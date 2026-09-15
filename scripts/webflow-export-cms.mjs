#!/usr/bin/env node
/**
 * Export every CMS collection on act.place before the domain leaves Webflow.
 *
 * READ ONLY against Webflow. Writes to .webflow-export/cms/ and nothing else.
 *
 * THE OUTPUT NEVER GOES IN THE REPO. This repository is public and the export
 * holds storyteller pages with named Aboriginal Elders, and three blog posts
 * whose consent was revoked in Empathy Ledger on 2026-07-29 and which Webflow
 * was still serving on 2026-09-16. Empathy Ledger is the system of record for
 * all of it; this export is a rescue copy of what Webflow holds, not a new home
 * for it. .webflow-export/ is gitignored. Delete it once the content has been
 * placed in Empathy Ledger, the project record, or the Goods site.
 *
 * WHY A SCRIPT RATHER THAN WEBFLOW'S CSV EXPORT
 * The CSV export is per collection, by hand, and it drops what the rescue needs:
 * draft and archived items, the asset URLs inside rich text, and any count you
 * could check afterwards. This takes all nine collections in one run and asserts
 * what it got.
 *
 * THE TRAP THIS IS BUILT AROUND (learned on the form-submission backfill, #106)
 * A single pass over the Webflow API is not evidence. Endpoints 404 and rate
 * limit intermittently, and a run that quietly returns two thirds of a
 * collection looks exactly like a run that returned all of it. So: retries with
 * backoff, dedupe by item id, and a per-collection reconciliation against the
 * total the API reports. The verdict refuses to say complete unless every
 * collection returned every item it claimed to have.
 *
 * Usage:
 *   node scripts/webflow-export-cms.mjs            # CMS items only
 *   node scripts/webflow-export-cms.mjs --assets   # also download every image
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";

const SITE_ID = "64ea91d86ff3fda1ff23fb95"; // A Curious Tractor, act.place
const API = "https://api.webflow.com/v2";
const OUT = ".webflow-export/cms";
const MAX_ATTEMPTS = 5;
const PAGE = 100;

const WANT_ASSETS = process.argv.includes("--assets");

function token() {
  // Read it here rather than taking it as an argument, so it never travels
  // through a shell history or an agent transcript.
  if (process.env.WEBFLOW_API_TOKEN) return process.env.WEBFLOW_API_TOKEN;
  for (const path of [
    ".env.local",
    "../act-regenerative-studio/.env.local",
    "../../act-regenerative-studio/.env.local",
  ]) {
    try {
      const line = readFileSync(path, "utf8")
        .split("\n")
        .find((l) => l.startsWith("WEBFLOW_API_TOKEN="));
      if (line)
        return line
          .slice("WEBFLOW_API_TOKEN=".length)
          .trim()
          .replace(/^["']|["']$/g, "");
    } catch {
      /* try the next path */
    }
  }
  throw new Error("WEBFLOW_API_TOKEN not found in the environment or .env.local");
}

const TOKEN = token();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** One GET, retried. Returns {ok, data, status, attempts}. */
async function get(path) {
  let status = 0;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const response = await fetch(`${API}${path}`, {
        headers: { Authorization: `Bearer ${TOKEN}`, accept: "application/json" },
        signal: AbortSignal.timeout(30_000),
      });
      status = response.status;
      if (response.ok) return { ok: true, data: await response.json(), status, attempts: attempt };
      // 429 and 5xx are worth another go; 401/403/404 are answers, not failures
      // to reach, except that this API 404s transiently on resources that exist.
      if (![429, 404, 500, 502, 503, 504].includes(status)) {
        return { ok: false, status, attempts: attempt, body: (await response.text()).slice(0, 300) };
      }
    } catch (error) {
      status = 0;
      if (attempt === MAX_ATTEMPTS) return { ok: false, status, attempts: attempt, body: String(error) };
    }
    await sleep(500 * 2 ** (attempt - 1));
  }
  return { ok: false, status, attempts: MAX_ATTEMPTS };
}

/**
 * Every item in one collection.
 *
 * Uses /items rather than /items/live on purpose: a draft or archived item is
 * part of the record we are rescuing, and each item carries isDraft/isArchived
 * so the distinction survives the export.
 */
async function fetchCollection(collection) {
  const byId = new Map();
  let reported = null;
  let offset = 0;
  const failures = [];

  for (;;) {
    const page = await get(`/collections/${collection.id}/items?limit=${PAGE}&offset=${offset}`);
    if (!page.ok) {
      failures.push({ offset, status: page.status, body: page.body });
      break;
    }
    const items = page.data.items ?? [];
    for (const item of items) byId.set(item.id, item);
    reported = page.data.pagination?.total ?? reported;
    offset += PAGE;
    if (items.length === 0 || (reported !== null && offset >= reported)) break;
    await sleep(250); // stay well inside the rate limit
  }

  return { items: [...byId.values()], reported, failures };
}

/**
 * Asset URLs, from image fields and from inside rich text.
 *
 * Two traps, both found by the manifest's own count on the first run.
 *
 * A filename here can contain brackets and spaces ("IMG_2575 (1).jpg"), so the
 * URL may only end at a quote, angle bracket or whitespace. An earlier version
 * also stopped at ")", which truncated eight URLs mid-name and fetched a 403.
 *
 * The same asset is referenced through two hosts, the current
 * cdn.prod.website-files.com and the retired uploads-ssl.webflow.com, with an
 * identical `<assetId>_<name>` tail. Downloading both saves one file and counts
 * two, so they are deduped by that tail with the current host preferred.
 */
function assetUrls(items) {
  const urls = new Set();
  const walk = (value) => {
    if (!value) return;
    if (typeof value === "string") {
      for (const match of value.matchAll(/https?:\/\/(?:cdn\.prod\.website-files\.com|uploads-ssl\.webflow\.com|assets\.website-files\.com)\/[^\s"'<>\\]+/g)) {
        urls.add(match[0]);
      }
      return;
    }
    if (Array.isArray(value)) return value.forEach(walk);
    if (typeof value === "object") return Object.values(value).forEach(walk);
  };
  walk(items);
  return [...urls];
}

/** The filename an asset is saved under: its Webflow asset id and name. */
function assetKey(url) {
  return decodeURIComponent(url.split("/").pop().split("?")[0]).replace(/[^\w.-]/g, "_");
}

/** One URL per asset, preferring the host Webflow serves from today. */
function dedupeAssets(urls) {
  const byKey = new Map();
  for (const url of urls) {
    const key = assetKey(url);
    const existing = byKey.get(key);
    if (!existing || (existing.includes("uploads-ssl") && url.includes("cdn.prod"))) byKey.set(key, url);
  }
  return [...byKey.values()];
}

/** CSV, with objects and arrays kept as JSON so nothing is silently flattened away. */
function toCsv(items) {
  const rows = items.map((item) => ({
    id: item.id,
    slug: item.fieldData?.slug ?? "",
    name: item.fieldData?.name ?? "",
    isDraft: item.isDraft ?? false,
    isArchived: item.isArchived ?? false,
    createdOn: item.createdOn ?? "",
    lastPublished: item.lastPublished ?? "",
    ...Object.fromEntries(
      Object.entries(item.fieldData ?? {})
        .filter(([key]) => key !== "slug" && key !== "name")
        .map(([key, value]) => [key, typeof value === "object" && value !== null ? JSON.stringify(value) : value]),
    ),
  }));
  const columns = [...new Set(rows.flatMap((row) => Object.keys(row)))];
  const escape = (value) => {
    const text = value === null || value === undefined ? "" : String(value);
    return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };
  return [columns.join(","), ...rows.map((row) => columns.map((c) => escape(row[c])).join(","))].join("\n");
}

async function downloadAssets(urls) {
  const dir = join(OUT, "assets");
  mkdirSync(dir, { recursive: true });
  let saved = 0;
  const failed = [];
  for (const url of urls) {
    // Webflow asset paths already carry a unique id; keep the filename readable.
    const path = join(dir, assetKey(url));
    if (existsSync(path)) { saved++; continue; }
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(60_000) });
      if (!response.ok) { failed.push({ url, status: response.status }); continue; }
      writeFileSync(path, Buffer.from(await response.arrayBuffer()));
      saved++;
    } catch (error) {
      failed.push({ url, error: String(error) });
    }
    await sleep(100);
  }
  return { saved, failed };
}

async function main() {
  mkdirSync(OUT, { recursive: true });

  const list = await get(`/sites/${SITE_ID}/collections`);
  if (!list.ok) {
    console.error(`Could not list collections (HTTP ${list.status}). ${list.body ?? ""}`);
    process.exit(1);
  }
  const collections = list.data.collections ?? [];
  console.log(`${collections.length} collections on act.place\n`);

  const manifest = { exportedAt: new Date().toISOString(), siteId: SITE_ID, collections: [] };
  let allComplete = true;
  const allAssets = new Set();

  for (const collection of collections) {
    const { items, reported, failures } = await fetchCollection(collection);
    const complete = failures.length === 0 && (reported === null || items.length === reported);
    if (!complete) allComplete = false;

    writeFileSync(join(OUT, `${collection.slug}.json`), JSON.stringify(items, null, 2));
    writeFileSync(join(OUT, `${collection.slug}.csv`), toCsv(items));

    const urls = assetUrls(items);
    urls.forEach((url) => allAssets.add(url));

    const drafts = items.filter((item) => item.isDraft).length;
    const archived = items.filter((item) => item.isArchived).length;
    manifest.collections.push({
      id: collection.id,
      slug: collection.slug,
      displayName: collection.displayName,
      fetched: items.length,
      reported,
      drafts,
      archived,
      assets: urls.length,
      complete,
      failures,
    });

    console.log(
      `${complete ? "ok  " : "GAP "} ${collection.slug.padEnd(14)} ${String(items.length).padStart(4)} items` +
        ` (reported ${reported ?? "?"}, ${drafts} draft, ${archived} archived, ${urls.length} assets)`,
    );
  }

  const assets = dedupeAssets([...allAssets]);
  writeFileSync(join(OUT, "assets.txt"), assets.join("\n"));

  if (WANT_ASSETS) {
    console.log(`\nDownloading ${assets.length} assets (${allAssets.size - assets.length} duplicate host references skipped)...`);
    const { saved, failed } = await downloadAssets(assets);
    manifest.assets = { referenced: allAssets.size, unique: assets.length, saved, failed };
    if (failed.length) allComplete = false;
    console.log(`${saved} saved, ${failed.length} failed`);
  } else {
    manifest.assets = { referenced: allAssets.size, unique: assets.length, saved: 0, note: "run with --assets to download" };
  }

  manifest.verdict = allComplete ? "complete" : "INCOMPLETE — do not treat this export as the whole record";
  writeFileSync(join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2));

  console.log(`\n${manifest.verdict}`);
  console.log(`Written to ${OUT}/ (gitignored). It holds named people; keep it off the repo and out of transcripts.`);
  process.exit(allComplete ? 0 : 1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
