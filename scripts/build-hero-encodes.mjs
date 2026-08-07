#!/usr/bin/env node
// Builds small, short web encodes of the homepage hero clips.
//
// The source footage is long documentary material: the clip the homepage shipped
// was 1280x720 but 48.9 seconds and 10.2MB, and one field clip runs 108 seconds.
// The hero shows six seconds of each. Trimming and re-encoding takes the set from
// roughly 34MB to 3MB with no visible loss at the size it is displayed.
//
// Two things here are less obvious than they look.
//
// 1. Encoding is not publishing. `public/media/field-videos/` is gitignored and
//    `/media/field-videos/*` 308s to the Supabase `site-media` bucket (see
//    next.config.js), and that redirect runs before static file serving, so a
//    file on this machine is never the file a browser fetches, even in dev.
//    Nothing reaches the site until --publish puts it in the bucket.
//
// 2. Output names carry a content hash. Objects are served immutable for a year,
//    so replacing bytes at a fixed URL leaves anyone who already visited holding
//    the old clip until 2027. Hashing the name means changed content is a new
//    URL and immutable stays honest.
//
// Usage:
//   node scripts/build-hero-encodes.mjs                                  # encode only
//   node --env-file=.env.local scripts/build-hero-encodes.mjs --publish  # encode + upload

import { execFile } from "node:child_process";
import { promisify } from "node:util";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

const run = promisify(execFile);
const root = process.cwd();

const SELECTIONS = path.join(root, "src/data/hero-media-selections.json");
const MANIFEST = path.join(root, "src/data/hero-encodes.json");
const PUBLIC = path.join(root, "public");

// The hero is full-bleed, so the encode keeps the footage's native 16:9. Most
// sources are already 1280x720, so this crops nothing and only stops a 1920x1080
// source being carried at full size for no gain.
const ASPECT = 16 / 9;
const MAX_WIDTH = 1600;
const SECONDS = 6;
// Skip the opening moment: cuts often start on a fade, a slate or a camera settle.
const START = 2;
// A byte ceiling rather than one fixed quality. Calm footage meets it at the
// first step and keeps its detail; busy footage is compressed until it complies.
// The drone aerial forced this: at crf 28 it came out three to five times every
// other clip, because constant motion defeats inter-frame prediction. Frame rate
// does not help (fewer frames means more motion between each pair, so per-frame
// cost rises to match) and neither does resolution (the sources are already at or
// below MAX_WIDTH). Quality is the only lever.
const MAX_KB = 850;
const CRF_STEPS = [28, 31, 34, 36, 38];

const VIDEO_FILTER = `crop='min(iw,ih*${ASPECT})':'min(ih,iw/${ASPECT})',scale='min(${MAX_WIDTH},iw)':-2`;

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://tednluwflfhxyucgwigh.supabase.co";
const BUCKET = "site-media";
const READ_BASE = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}`;
const WRITE_BASE = `${SUPABASE_URL}/storage/v1/object/${BUCKET}`;
const objectPath = (url) => url.replace(/^\/media\//, "");

const kb = (bytes) => Math.round(bytes / 1024);

async function exists(file) {
  try { await fs.access(file); return true; } catch { return false; }
}

async function encodeClip(sourceUrl) {
  const source = path.join(PUBLIC, sourceUrl.replace(/^\//, ""));
  if (!(await exists(source))) {
    console.warn(`  skipped, source missing: ${sourceUrl}`);
    return null;
  }

  const dir = path.dirname(sourceUrl);
  const base = path.basename(sourceUrl, path.extname(sourceUrl));
  const tmpVideo = path.join(PUBLIC, dir.replace(/^\//, ""), `${base}-hero.tmp.mp4`);
  const tmpPoster = path.join(PUBLIC, dir.replace(/^\//, ""), `${base}-hero.tmp.jpg`);

  let chosenCrf = null;
  for (const crf of CRF_STEPS) {
    await run("ffmpeg", [
      "-y", "-v", "error",
      "-ss", String(START), "-t", String(SECONDS), "-i", source,
      "-vf", VIDEO_FILTER,
      "-an",
      "-c:v", "libx264", "-crf", String(crf), "-preset", "slow",
      "-pix_fmt", "yuv420p", "-movflags", "+faststart",
      tmpVideo,
    ]);
    chosenCrf = crf;
    if (kb((await fs.stat(tmpVideo)).size) <= MAX_KB) break;
  }

  // The poster has to match the encode's crop, or the first frame jumps.
  await run("ffmpeg", [
    "-y", "-v", "error",
    "-ss", String(START), "-i", source,
    "-vf", VIDEO_FILTER, "-frames:v", "1", "-q:v", "4",
    tmpPoster,
  ]);

  const bytes = await fs.readFile(tmpVideo);
  const hash = crypto.createHash("sha256").update(bytes).digest("hex").slice(0, 8);
  const videoUrl = `${dir}/${base}-hero-${hash}.mp4`;
  const posterUrl = `${dir}/${base}-hero-${hash}.jpg`;
  await fs.rename(tmpVideo, path.join(PUBLIC, videoUrl.replace(/^\//, "")));
  await fs.rename(tmpPoster, path.join(PUBLIC, posterUrl.replace(/^\//, "")));

  // Drop this clip's earlier hashes so the local folder does not silently grow a
  // copy per run. Only ever this clip's own derivatives; sources are never named.
  const folder = path.join(PUBLIC, dir.replace(/^\//, ""));
  for (const name of await fs.readdir(folder)) {
    const isOwnDerivative = name.startsWith(`${base}-hero-`) && !name.includes(hash);
    if (isOwnDerivative) await fs.rm(path.join(folder, name), { force: true });
  }

  const sourceSize = (await fs.stat(source)).size;
  const note = chosenCrf === CRF_STEPS[0] ? "" : ` (crf ${chosenCrf} to meet the ${MAX_KB}KB ceiling)`;
  console.log(`  ${base}: ${kb(sourceSize)}KB -> ${kb(bytes.length)}KB${note}`);
  return { videoUrl, posterUrl, sourceKb: kb(sourceSize), encodedKb: kb(bytes.length) };
}

async function publishedSize(url) {
  try {
    const response = await fetch(`${READ_BASE}/${objectPath(url)}`, { method: "HEAD" });
    return response.ok ? Number(response.headers.get("content-length") ?? 0) : null;
  } catch {
    return null;
  }
}

async function upload(url, contentType) {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set. Run: node --env-file=.env.local scripts/build-hero-encodes.mjs --publish",
    );
  }
  const body = await fs.readFile(path.join(PUBLIC, url.replace(/^\//, "")));
  // Every path this can address is `<name>-hero-<hash>.mp4|jpg`, built from the
  // source filename, so it structurally cannot address original footage.
  const response = await fetch(`${WRITE_BASE}/${objectPath(url)}`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${serviceKey}`,
      "content-type": contentType,
      // Safe to keep immutable now that the name changes with the bytes.
      "cache-control": "public, max-age=31536000, immutable",
      "x-upsert": "true",
    },
    body,
  });
  if (!response.ok) throw new Error(`${response.status} ${(await response.text()).slice(0, 180)}`);
}

const selections = JSON.parse(await fs.readFile(SELECTIONS, "utf8"));
const shots = [selections.homepage, ...Object.values(selections.fields ?? {})].filter((shot) => shot?.videoUrl);
const unique = [...new Set(shots.map((shot) => shot.videoUrl))];

console.log(
  `Encoding ${unique.length} hero clips (${SECONDS}s, <=${MAX_WIDTH}px, ` +
    `quality stepped from crf ${CRF_STEPS[0]} until each is under ${MAX_KB}KB)`,
);

const manifest = {};
let sourceTotal = 0;
let encodedTotal = 0;
for (const videoUrl of unique) {
  const result = await encodeClip(videoUrl);
  if (!result) continue;
  manifest[videoUrl] = { videoUrl: result.videoUrl, posterUrl: result.posterUrl };
  sourceTotal += result.sourceKb;
  encodedTotal += result.encodedKb;
}

if (process.argv.includes("--publish")) {
  console.log(`\nPublishing to the ${BUCKET} bucket`);
  for (const entry of Object.values(manifest)) {
    for (const [url, type] of [[entry.videoUrl, "video/mp4"], [entry.posterUrl, "image/jpeg"]]) {
      const local = (await fs.stat(path.join(PUBLIC, url.replace(/^\//, "")))).size;
      if ((await publishedSize(url)) === local) {
        console.log(`  already published: ${objectPath(url)}`);
        continue;
      }
      try {
        await upload(url, type);
        console.log(`  uploaded: ${objectPath(url)}`);
      } catch (error) {
        console.warn(`  FAILED  ${objectPath(url)}: ${error.message}`);
      }
    }
  }
}

// Only list an encode the bucket can actually serve, so a missing upload degrades
// to the full-size original rather than to a broken hero.
const published = {};
const pending = [];
for (const [sourceUrl, entry] of Object.entries(manifest)) {
  if ((await publishedSize(entry.videoUrl)) !== null) published[sourceUrl] = entry;
  else pending.push(entry.videoUrl);
}

await fs.writeFile(MANIFEST, `${JSON.stringify(published, null, 2)}\n`);
console.log(
  `\n${Object.keys(manifest).length} encoded. ${sourceTotal}KB -> ${encodedTotal}KB ` +
    `(${(sourceTotal / Math.max(encodedTotal, 1)).toFixed(1)}x smaller).`,
);
console.log(`${Object.keys(published).length} live in the bucket and listed in the manifest.`);
if (pending.length > 0) {
  console.log(`\n${pending.length} not in the bucket, so the hero keeps the originals for these:`);
  for (const item of pending) console.log(`  ${item}`);
}
