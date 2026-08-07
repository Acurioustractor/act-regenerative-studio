#!/usr/bin/env node
/**
 * Probes every photograph a story page actually renders, and reports the dead.
 *
 * Written 2026-08-07, after production was found serving 107 dead images
 * across 18 of its 21 story pages. What a reader met was a broken frame every
 * few paragraphs, and eighteen of them in "At the Speed of Ceremony".
 *
 * The cause is upstream and specific. Empathy Ledger has moved its media to
 * `empathyledger.com/api/media/<id>/file`, and the structured fields of the
 * feed carry the new URLs: hero images and gallery photographs resolve. The
 * exported article HTML was not rewritten in that move, so every photograph
 * embedded in the prose still points at the retired Supabase bucket and
 * returns 400. Empathy Ledger's own article pages show the same damage, which
 * is how we know it is not this site's configuration.
 *
 * This checks rendered pages rather than the committed snapshot, deliberately.
 * The snapshot in src/data is a build-time fallback that goes stale between
 * syncs, and measuring it produced a picture that disagreed with production in
 * both directions: dead heroes that production renders fine, live galleries
 * that it does not use. The page is the only honest subject.
 *
 * The renderers now hide photographs that fail, so none of this is visible to
 * a reader any more. That makes the check more important rather than less:
 * silent self-healing is exactly the condition under which a feed can rot to
 * nothing while every page still looks well.
 *
 * Usage:
 *   node scripts/check-editorial-media.mjs                      # against production
 *   node scripts/check-editorial-media.mjs --base http://localhost:3001
 *   node scripts/check-editorial-media.mjs --report             # full detail, never fails
 */

const DEFAULT_BASE = "https://act-regenerative-studio.vercel.app";

/**
 * Dead images measured on production, 2026-08-07: 107 across 21 story pages.
 * The baseline exists so this fails on *new* rot rather than on damage already
 * known and raised with Empathy Ledger. Lower it as photographs are restored;
 * never raise it without saying why in the commit message.
 */
const DEAD_BASELINE = 107;

const args = process.argv.slice(2);
const reportOnly = args.includes("--report");
const baseIndex = args.indexOf("--base");
const BASE = (baseIndex >= 0 ? args[baseIndex + 1] : process.env.MEDIA_CHECK_BASE_URL) || DEFAULT_BASE;

/** Pull every image URL a page renders, unwrapping Next's optimiser. */
function imageUrls(html) {
  const urls = new Set();
  for (const attr of html.matchAll(/(?:src|srcSet|srcset)="([^"]+)"/g)) {
    for (const candidate of attr[1].split(",")) {
      let raw = candidate.trim().split(/\s+/)[0].replace(/&amp;/g, "&");
      if (raw.startsWith("/_next/image")) {
        raw = decodeURIComponent(new URL(raw, BASE).searchParams.get("url") || "");
      }
      if (!/^https?:\/\//.test(raw)) continue;
      if (/\.(jpe?g|png|webp|gif|avif)(\?|#|$)/i.test(raw) || /\/api\/media\//.test(raw)) {
        urls.add(raw);
      }
    }
  }
  return [...urls];
}

/**
 * A 200 is not enough. The retired bucket answers a missing object with a JSON
 * error body, so the content type is what distinguishes a photograph from a
 * polite refusal. HEAD is not supported there and returns 400 for everything,
 * which is how an earlier version of this measurement went wrong.
 *
 * A thrown fetch is a transport failure, not an answer. Probing hundreds of
 * URLs produces one or two per run, and counting those as dead made the check
 * fail at random and made a real regression indistinguishable from a dropped
 * packet. A refusal that survives three attempts is treated as real.
 */
async function probe(url, attempt = 0) {
  try {
    const response = await fetch(url);
    const contentType = response.headers.get("content-type") || "";
    await response.arrayBuffer();
    return { url, status: response.status, live: response.ok && contentType.startsWith("image/") };
  } catch (error) {
    if (attempt < 2) {
      await new Promise((resolve) => setTimeout(resolve, 400 * (attempt + 1)));
      return probe(url, attempt + 1);
    }
    return { url, status: 0, live: false, error: String(error).slice(0, 120) };
  }
}

async function main() {
  const index = await fetch(`${BASE}/stories`);
  if (!index.ok) {
    console.error(`Cannot read ${BASE}/stories (HTTP ${index.status}). Is the server up?`);
    process.exit(1);
  }
  const slugs = [
    ...new Set([...(await index.text()).matchAll(/href="\/stories\/([a-z0-9-]+)"/g)].map((m) => m[1])),
  ];
  if (slugs.length === 0) {
    console.error("No story links found on the index. The page shape has changed.");
    process.exit(1);
  }

  console.log(`Checking ${slugs.length} story pages at ${BASE}`);
  const pages = [];

  for (const slug of slugs) {
    const response = await fetch(`${BASE}/stories/${slug}`);
    const urls = response.ok ? imageUrls(await response.text()) : [];
    const checked = [];
    for (let i = 0; i < urls.length; i += 10) {
      checked.push(...(await Promise.all(urls.slice(i, i + 10).map((url) => probe(url)))));
    }
    const dead = checked.filter((result) => !result.live);
    pages.push({ slug, total: checked.length, dead });
    if (reportOnly || dead.length) {
      console.log(`  ${String(checked.length - dead.length).padStart(3)} live / ${String(dead.length).padStart(3)} dead   ${slug}`);
    }
  }

  const totalImages = pages.reduce((count, page) => count + page.total, 0);
  const totalDead = pages.reduce((count, page) => count + page.dead.length, 0);
  const affected = pages.filter((page) => page.dead.length > 0).length;

  console.log(`\n${totalImages - totalDead} live / ${totalDead} dead across ${pages.length} story pages (baseline ${DEAD_BASELINE})`);
  console.log(`Pages with at least one dead photograph: ${affected}`);

  if (reportOnly) {
    const hosts = {};
    for (const page of pages) {
      for (const result of page.dead) {
        const host = new URL(result.url).host;
        hosts[host] = (hosts[host] || 0) + 1;
      }
    }
    console.log("Dead by host:", JSON.stringify(hosts, null, 1));
    return;
  }

  if (totalDead > DEAD_BASELINE) {
    console.error(
      `\nFAIL\n  dead photographs grew from ${DEAD_BASELINE} to ${totalDead}; the feed is still rotting`,
    );
    process.exit(1);
  }
  console.log("\nOK (no new losses since the recorded baseline)");
}

main().catch((error) => {
  console.error("check-editorial-media failed to run:", error);
  process.exit(1);
});
