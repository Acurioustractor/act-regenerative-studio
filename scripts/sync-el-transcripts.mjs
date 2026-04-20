import fs from 'node:fs/promises';
import path from 'node:path';

import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const EMPATHY_LEDGER_URL =
  process.env.EMPATHY_LEDGER_URL ||
  process.env.NEXT_PUBLIC_EMPATHY_LEDGER_URL ||
  'http://localhost:3030';

const EMPATHY_LEDGER_SITE_SLUG =
  process.env.EMPATHY_LEDGER_SITE_SLUG || 'act-regenerative-studio';

const DEFAULT_TIMEOUT_MS = Number.parseInt(
  process.env.EMPATHY_LEDGER_SYNC_TIMEOUT_MS || '12000',
  10
);

const OUTPUT_PATH = path.resolve(
  process.cwd(),
  'src/data/empathy-ledger-transcripts.generated.json'
);

const PAGE_SIZE = 50;
const MAX_PAGES = 40;

function createEmptySnapshot() {
  return {
    generatedAt: new Date().toISOString(),
    sourceUrl: null,
    siteSlug: EMPATHY_LEDGER_SITE_SLUG,
    transcriptCount: 0,
    transcripts: [],
    note: 'EL /api/v1/content-hub/transcripts currently returns only is_justicehub_featured storytellers. For broader coverage the EL team needs to add a site-scoped transcript endpoint.',
  };
}

async function writeSnapshot(snapshot) {
  await fs.writeFile(OUTPUT_PATH, `${JSON.stringify(snapshot, null, 2)}\n`);
}

async function keepExistingSnapshot(reason) {
  try {
    await fs.access(OUTPUT_PATH);
    console.log(`${reason}, keeping existing EL transcript snapshot at ${OUTPUT_PATH}`);
    return;
  } catch {
    await writeSnapshot(createEmptySnapshot());
    console.log(`${reason}, wrote empty EL transcript snapshot to ${OUTPUT_PATH}`);
  }
}

function buildHeaders() {
  const headers = {};
  if (process.env.EMPATHY_LEDGER_API_KEY) {
    headers['X-API-Key'] = process.env.EMPATHY_LEDGER_API_KEY;
  }
  return headers;
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: buildHeaders(),
    signal: AbortSignal.timeout(DEFAULT_TIMEOUT_MS),
  });
  if (!response.ok) {
    throw new Error(`EL API ${response.status} on ${url}`);
  }
  return response.json();
}

async function fetchFromEndpoint(basePath) {
  const records = [];
  for (let page = 1; page <= MAX_PAGES; page += 1) {
    const url = new URL(basePath, EMPATHY_LEDGER_URL);
    url.searchParams.set('limit', String(PAGE_SIZE));
    url.searchParams.set('page', String(page));
    url.searchParams.set('include_analysis', 'true');
    url.searchParams.set('include_segments', 'true');

    const payload = await fetchJson(url.toString());
    const batch = Array.isArray(payload?.transcripts) ? payload.transcripts : [];
    if (!batch.length) break;
    records.push(...batch);

    const totalPages = payload?.pagination?.pages;
    if (typeof totalPages === 'number' && page >= totalPages) break;
    if (batch.length < PAGE_SIZE) break;
  }
  return records;
}

async function fetchTranscripts() {
  // Preferred: site-scoped endpoint (covers the full ACT syndicated storyteller set).
  // Fallback: content-hub endpoint (limited to is_justicehub_featured=true).
  const sitePath = `/api/v1/sites/${EMPATHY_LEDGER_SITE_SLUG}/transcripts`;
  try {
    const records = await fetchFromEndpoint(sitePath);
    if (records.length > 0) return { source: 'site-scoped', records };
    // Empty may be legitimate, but try content-hub as a fallback to capture JH content
    const hubRecords = await fetchFromEndpoint('/api/v1/content-hub/transcripts');
    return { source: hubRecords.length > 0 ? 'content-hub-fallback' : 'site-scoped', records: hubRecords };
  } catch (error) {
    // Site-scoped endpoint may not exist on older EL deploys; fall back to content-hub
    if (/\b404\b/.test(String(error.message))) {
      const hubRecords = await fetchFromEndpoint('/api/v1/content-hub/transcripts');
      return { source: 'content-hub-fallback', records: hubRecords };
    }
    throw error;
  }
}

async function main() {
  if (!process.env.EMPATHY_LEDGER_API_KEY) {
    await keepExistingSnapshot('No EMPATHY_LEDGER_API_KEY');
    return;
  }

  let fetchResult;
  try {
    fetchResult = await fetchTranscripts();
  } catch (error) {
    await keepExistingSnapshot(`EL transcript fetch failed: ${error.message}`);
    return;
  }

  const { source, records: transcripts } = fetchResult;
  const sourcePath =
    source === 'site-scoped'
      ? `/api/v1/sites/${EMPATHY_LEDGER_SITE_SLUG}/transcripts`
      : '/api/v1/content-hub/transcripts';

  await writeSnapshot({
    generatedAt: new Date().toISOString(),
    sourceUrl: `${EMPATHY_LEDGER_URL}${sourcePath}`,
    siteSlug: EMPATHY_LEDGER_SITE_SLUG,
    transcriptCount: transcripts.length,
    transcripts,
    note:
      source === 'site-scoped'
        ? 'Sourced from the site-scoped transcripts endpoint (gallery-syndication consent-gated).'
        : 'Fell back to /api/v1/content-hub/transcripts (is_justicehub_featured only). Upgrade EL to expose /api/v1/sites/[siteSlug]/transcripts for broader ACT coverage.',
  });
  console.log(
    `Synced ${transcripts.length} transcripts from ${source} to ${OUTPUT_PATH}`
  );
}

main().catch(async (error) => {
  await keepExistingSnapshot(`EL transcript sync unhandled: ${error.message}`);
  process.exitCode = 0;
});
