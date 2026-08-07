#!/usr/bin/env node
// Builds small, short web encodes of the hero clips.
//
// The source footage is long documentary material: the clip the homepage shipped
// was 1280x720 but 48.9 seconds and 10.2MB, and one field clip runs 108 seconds.
// The hero frame is at most 560 CSS px wide and rotates away after 6.5s, so
// almost all of that was downloaded and never seen. These encodes crop to the
// frame's own aspect, cap at 1120px (2x the frame), and keep 6 seconds.
//
// Originals stay where they are. This writes `<name>-hero.mp4` beside them plus a
// matching poster frame, and a manifest the hero reads. Re-run after changing a
// selection in the screening room:  node scripts/build-hero-encodes.mjs
//
// Flags: --force  re-encode even when the output is newer than the source.

import { execFile } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs/promises";
import path from "node:path";

const run = promisify(execFile);
const root = process.cwd();
const force = process.argv.includes("--force");

const SELECTIONS = path.join(root, "src/data/hero-media-selections.json");
const MANIFEST = path.join(root, "src/data/hero-encodes.json");
const PUBLIC = path.join(root, "public");

// The frame is aspect-ratio 1.04 and object-fit: cover, so anything outside that
// centre crop is downloaded and then thrown away by the browser. Crop first.
const ASPECT = 1.04;
const MAX_WIDTH = 1120;
const SECONDS = 6;
// A byte ceiling rather than one fixed quality. Calm footage hits it at the first
// step and keeps its detail (a static clip lands at 59KB); busy footage needs
// more compression to reach the same weight. The drone aerial is the case that
// forced this: at crf 28 it came out 1591KB, three to five times every other
// clip, because constant motion defeats inter-frame prediction. Dropping frame
// rate does not help, since fewer frames means more motion between each pair and
// the per-frame cost rises to match; resolution does not help either, as the
// source crop is already narrower than MAX_WIDTH. Quality is the only lever.
const MAX_KB = 520;
const CRF_STEPS = [28, 31, 34, 36, 38];
// Skip the opening moment: cuts often start on a fade, a slate or a camera settle.
const START = 2;

const VIDEO_FILTER = `crop='min(iw,ih*${ASPECT})':'min(ih,iw/${ASPECT})',scale='min(${MAX_WIDTH},iw)':-2`;

async function exists(file) {
  try { await fs.access(file); return true; } catch { return false; }
}

async function isStale(source, output) {
  if (force) return true;
  if (!(await exists(output))) return true;
  const [s, o] = await Promise.all([fs.stat(source), fs.stat(output)]);
  return s.mtimeMs > o.mtimeMs;
}

async function encode(sourceUrl) {
  const source = path.join(PUBLIC, sourceUrl.replace(/^\//, ""));
  if (!(await exists(source))) {
    console.warn(`  skipped, source missing: ${sourceUrl}`);
    return null;
  }

  const dir = path.dirname(sourceUrl);
  const base = path.basename(sourceUrl, path.extname(sourceUrl));
  const videoUrl = `${dir}/${base}-hero.mp4`;
  const posterUrl = `${dir}/${base}-hero.jpg`;
  const videoOut = path.join(PUBLIC, videoUrl.replace(/^\//, ""));
  const posterOut = path.join(PUBLIC, posterUrl.replace(/^\//, ""));

  let chosenCrf = null;
  if (await isStale(source, videoOut)) {
    for (const crf of CRF_STEPS) {
      await run("ffmpeg", [
        "-y", "-v", "error",
        "-ss", String(START), "-t", String(SECONDS), "-i", source,
        "-vf", VIDEO_FILTER,
        "-an",
        "-c:v", "libx264", "-crf", String(crf), "-preset", "slow",
        "-pix_fmt", "yuv420p", "-movflags", "+faststart",
        videoOut,
      ]);
      chosenCrf = crf;
      const { size } = await fs.stat(videoOut);
      if (size / 1024 <= MAX_KB) break;
    }
    // The poster has to match the encode's crop, or the video jumps on first frame.
    await run("ffmpeg", [
      "-y", "-v", "error",
      "-ss", String(START), "-i", source,
      "-vf", VIDEO_FILTER, "-frames:v", "1", "-q:v", "4",
      posterOut,
    ]);
  }

  const [before, after] = await Promise.all([fs.stat(source), fs.stat(videoOut)]);
  const kb = (bytes) => Math.round(bytes / 1024);
  const note = chosenCrf === null
    ? " (cached)"
    : `${chosenCrf === CRF_STEPS[0] ? "" : ` (crf ${chosenCrf} to meet the ${MAX_KB}KB ceiling)`}`;
  const over = kb(after.size) > MAX_KB ? `  OVER the ${MAX_KB}KB ceiling even at crf ${chosenCrf}` : "";
  console.log(`  ${base}: ${kb(before.size)}KB -> ${kb(after.size)}KB${note}${over}`);
  return { videoUrl, posterUrl, sourceKb: kb(before.size), encodedKb: kb(after.size) };
}

const selections = JSON.parse(await fs.readFile(SELECTIONS, "utf8"));
const shots = [selections.homepage, ...Object.values(selections.fields ?? {})].filter(
  (shot) => shot?.videoUrl,
);
const unique = [...new Set(shots.map((shot) => shot.videoUrl))];

console.log(
  `Encoding ${unique.length} hero clips (${SECONDS}s, <=${MAX_WIDTH}px, ` +
    `quality stepped from crf ${CRF_STEPS[0]} until each is under ${MAX_KB}KB)`,
);

const manifest = {};
let sourceTotal = 0;
let encodedTotal = 0;
for (const videoUrl of unique) {
  const result = await encode(videoUrl);
  if (!result) continue;
  manifest[videoUrl] = { videoUrl: result.videoUrl, posterUrl: result.posterUrl };
  sourceTotal += result.sourceKb;
  encodedTotal += result.encodedKb;
}

// Encoding locally is not the same as publishing. `public/media/field-videos/` is
// gitignored and `/media/field-videos/*` 308s to the Supabase `site-media` bucket
// (see next.config.js), so a file sitting on this machine is never the file the
// browser fetches. Only list an encode the bucket can actually serve, or the hero
// points every clip at a 400 and silently shows nothing.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://tednluwflfhxyucgwigh.supabase.co";
const BUCKET = "site-media";
const READ_BASE = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}`;
const WRITE_BASE = `${SUPABASE_URL}/storage/v1/object/${BUCKET}`;
const objectPath = (url) => url.replace(/^\/media\//, "");

async function publishedSize(url) {
  try {
    const response = await fetch(`${READ_BASE}/${objectPath(url)}`, { method: "HEAD" });
    if (!response.ok) return null;
    return Number(response.headers.get("content-length") ?? 0);
  } catch {
    return null;
  }
}

const isPublished = async (url) => (await publishedSize(url)) !== null;

async function publish(url, contentType) {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set. Run: node --env-file=.env.local scripts/build-hero-encodes.mjs --publish",
    );
  }
  const body = await fs.readFile(path.join(PUBLIC, url.replace(/^\//, "")));
  // Upsert is confined to derivatives this script generates: every path it can
  // address is `<name>-hero.mp4` or `<name>-hero.jpg`, built from the source
  // filename, so it structurally cannot address original footage. That is what
  // makes overwriting safe here, and it is needed because re-encoding a clip to
  // meet the byte ceiling has to replace the copy already in the bucket.
  const response = await fetch(`${WRITE_BASE}/${objectPath(url)}`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${serviceKey}`,
      "content-type": contentType,
      "cache-control": "public, max-age=31536000, immutable",
      "x-upsert": "true",
    },
    body,
  });
  if (!response.ok) {
    throw new Error(`${response.status} ${(await response.text()).slice(0, 180)}`);
  }
}

if (process.argv.includes("--publish")) {
  console.log(`\nPublishing to the ${BUCKET} bucket`);
  for (const entry of Object.values(manifest)) {
    for (const [url, type] of [[entry.videoUrl, "video/mp4"], [entry.posterUrl, "image/jpeg"]]) {
      const local = (await fs.stat(path.join(PUBLIC, url.replace(/^\//, "")))).size;
      const remote = await publishedSize(url);
      if (remote === local) {
        console.log(`  unchanged: ${objectPath(url)}`);
        continue;
      }
      try {
        await publish(url, type);
        console.log(`  ${remote === null ? "uploaded" : "replaced"}: ${objectPath(url)}`);
      } catch (error) {
        console.warn(`  FAILED  ${objectPath(url)}: ${error.message}`);
      }
    }
  }
}

const published = {};
const pending = [];
for (const [sourceUrl, entry] of Object.entries(manifest)) {
  if (await isPublished(entry.videoUrl)) published[sourceUrl] = entry;
  else pending.push(entry.videoUrl);
}

await fs.writeFile(MANIFEST, `${JSON.stringify(published, null, 2)}\n`);
console.log(
  `\n${Object.keys(manifest).length} encoded. ${sourceTotal}KB -> ${encodedTotal}KB ` +
    `(${(sourceTotal / Math.max(encodedTotal, 1)).toFixed(1)}x smaller).`,
);
console.log(`${Object.keys(published).length} live in the bucket and listed in the manifest.`);
if (pending.length > 0) {
  console.log(
    `\n${pending.length} encoded but NOT yet in the Supabase site-media bucket, so the hero keeps\n` +
      `using the full-size originals for these. Upload them under field-videos/ (with their\n` +
      `matching -hero.jpg posters) and re-run this script to pick them up:`,
  );
  for (const item of pending) console.log(`  ${item}`);
}
