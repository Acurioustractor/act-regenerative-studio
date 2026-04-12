import fs from 'node:fs/promises';
import path from 'node:path';

import dotenv from 'dotenv';
import pLimit from 'p-limit';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const EMPATHY_LEDGER_URL =
  process.env.EMPATHY_LEDGER_URL ||
  process.env.NEXT_PUBLIC_EMPATHY_LEDGER_URL ||
  'http://localhost:3030';

const EMPATHY_LEDGER_SITE_SLUG =
  process.env.EMPATHY_LEDGER_SITE_SLUG || 'act-regenerative-studio';

const EMPATHY_LEDGER_EDITORIAL_DESTINATION =
  process.env.EMPATHY_LEDGER_EDITORIAL_DESTINATION || 'act_el';

const DEFAULT_TIMEOUT_MS = Number.parseInt(
  process.env.EMPATHY_LEDGER_SYNC_TIMEOUT_MS || '20000',
  10
);
const MAX_RETRIES = Number.parseInt(
  process.env.EMPATHY_LEDGER_SYNC_RETRIES || '3',
  10
);

const OUTPUT_PATH = path.resolve(
  process.cwd(),
  'src/data/empathy-ledger-source-packets.generated.json'
);

const FLAGSHIP_PACKS_PATH = path.resolve(
  process.cwd(),
  'src/data/wiki-flagship-project-packs.generated.json'
);

const PROJECTS_TS_PATH = path.resolve(process.cwd(), 'src/data/projects.ts');

function createEmptySnapshot() {
  return {
    generatedAt: new Date().toISOString(),
    sourceUrl: null,
    siteSlug: EMPATHY_LEDGER_SITE_SLUG,
    destination: EMPATHY_LEDGER_EDITORIAL_DESTINATION,
    packetCount: 0,
    packets: {},
  };
}

async function writeSnapshot(snapshot) {
  await fs.writeFile(OUTPUT_PATH, `${JSON.stringify(snapshot, null, 2)}\n`);
}

async function readExistingSnapshot() {
  try {
    const raw = await fs.readFile(OUTPUT_PATH, 'utf8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function keepExistingSnapshot(reason) {
  try {
    await fs.access(OUTPUT_PATH);
    console.log(`${reason}, keeping existing EL source packet snapshot at ${OUTPUT_PATH}`);
    return;
  } catch {
    const emptySnapshot = createEmptySnapshot();
    await writeSnapshot(emptySnapshot);
    console.log(`${reason}, wrote empty EL source packet snapshot to ${OUTPUT_PATH}`);
  }
}

async function loadProjectSlugs() {
  try {
    const raw = await fs.readFile(FLAGSHIP_PACKS_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    const slugs = Array.isArray(parsed.packs)
      ? parsed.packs.map((pack) => pack?.slug).filter(Boolean)
      : [];

    if (slugs.length > 0) {
      return Array.from(new Set(slugs));
    }
  } catch {
    // Fall back to the broader project registry when the flagship snapshot
    // is unavailable. This keeps the sync script usable in partial checkouts.
  }

  const raw = await fs.readFile(PROJECTS_TS_PATH, 'utf8');
  const slugs = [];
  const pattern = /slug:\s*"([^"]+)"/g;
  let match = pattern.exec(raw);

  while (match) {
    slugs.push(match[1]);
    match = pattern.exec(raw);
  }

  return Array.from(new Set(slugs));
}

function buildHeaders() {
  const headers = {};
  if (process.env.EMPATHY_LEDGER_API_KEY) {
    headers['X-API-Key'] = process.env.EMPATHY_LEDGER_API_KEY;
  }
  return headers;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchJson(url) {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt += 1) {
    const response = await fetch(url, {
      headers: buildHeaders(),
      signal: AbortSignal.timeout(DEFAULT_TIMEOUT_MS),
    });

    if (response.ok) {
      return response.json();
    }

    const contentType = response.headers.get('content-type') || '';
    const isHtml = contentType.includes('text/html');
    const body = isHtml ? await response.text() : '';
    const isWarmupMiss =
      isHtml && body.includes('missing required error components');
    const canRetry =
      attempt < MAX_RETRIES - 1 &&
      (isWarmupMiss || response.status >= 500);

    if (canRetry) {
      await delay(250 * (attempt + 1));
      continue;
    }

    throw new Error(`HTTP ${response.status} for ${url}`);
  }

  throw new Error(`HTTP 503 for ${url}`);
}

async function fetchProjectPacket(projectSlug) {
  const url = new URL('/api/v1/content-hub/source-packets', EMPATHY_LEDGER_URL);
  url.searchParams.set('project', projectSlug);
  url.searchParams.set('site', EMPATHY_LEDGER_SITE_SLUG);
  url.searchParams.set('destination', EMPATHY_LEDGER_EDITORIAL_DESTINATION);

  return fetchJson(url.toString());
}

async function main() {
  const projectSlugs = await loadProjectSlugs();
  const limit = pLimit(2);

  try {
    const packets = await Promise.all(
      projectSlugs.map((projectSlug) =>
        limit(async () => {
          try {
            const packet = await fetchProjectPacket(projectSlug);
            return [projectSlug, packet];
          } catch (error) {
            console.warn(`Skipping EL source packet for ${projectSlug}: ${error.message}`);
            return null;
          }
        })
      )
    );

    const packetMap = Object.fromEntries(packets.filter(Boolean));
    const snapshot = {
      generatedAt: new Date().toISOString(),
      sourceUrl: EMPATHY_LEDGER_URL,
      siteSlug: EMPATHY_LEDGER_SITE_SLUG,
      destination: EMPATHY_LEDGER_EDITORIAL_DESTINATION,
      packetCount: Object.keys(packetMap).length,
      packets: packetMap,
    };

    if (snapshot.packetCount === 0) {
      await keepExistingSnapshot(
        'EL source packet sync produced 0 packets'
      );
      return;
    }

    const existingSnapshot = await readExistingSnapshot();
    if (
      existingSnapshot &&
      typeof existingSnapshot.packetCount === 'number' &&
      snapshot.packetCount < existingSnapshot.packetCount
    ) {
      console.log(
        `EL source packet sync produced ${snapshot.packetCount}/${existingSnapshot.packetCount} packets, keeping existing EL source packet snapshot at ${OUTPUT_PATH}`
      );
      return;
    }

    await writeSnapshot(snapshot);
    console.log(`Wrote ${snapshot.packetCount} EL source packets to ${OUTPUT_PATH}`);
  } catch (error) {
    await keepExistingSnapshot(`EL source packet sync failed: ${error.message}`);
  }
}

main().catch(async (error) => {
  await keepExistingSnapshot(`EL source packet sync failed: ${error.message}`);
  process.exit(1);
});
