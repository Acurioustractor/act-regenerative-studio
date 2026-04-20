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
  process.env.EMPATHY_LEDGER_SYNC_TIMEOUT_MS || '8000',
  10
);

const OUTPUT_PATH = path.resolve(
  process.cwd(),
  'src/data/empathy-ledger-storytellers.generated.json'
);

const PAGE_SIZE = 100;
const MAX_PAGES = 20;

function createEmptySnapshot() {
  return {
    generatedAt: new Date().toISOString(),
    sourceUrl: null,
    siteSlug: EMPATHY_LEDGER_SITE_SLUG,
    storytellerCount: 0,
    storytellers: [],
  };
}

async function writeSnapshot(snapshot) {
  await fs.writeFile(OUTPUT_PATH, `${JSON.stringify(snapshot, null, 2)}\n`);
}

async function keepExistingSnapshot(reason) {
  try {
    await fs.access(OUTPUT_PATH);
    console.log(`${reason}, keeping existing EL storyteller snapshot at ${OUTPUT_PATH}`);
    return;
  } catch {
    await writeSnapshot(createEmptySnapshot());
    console.log(`${reason}, wrote empty EL storyteller snapshot to ${OUTPUT_PATH}`);
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

async function fetchStorytellerList() {
  const records = [];
  for (let offset = 0, page = 0; page < MAX_PAGES; offset += PAGE_SIZE, page += 1) {
    const url = new URL(
      `/api/v1/sites/${EMPATHY_LEDGER_SITE_SLUG}/storytellers`,
      EMPATHY_LEDGER_URL
    );
    url.searchParams.set('limit', String(PAGE_SIZE));
    url.searchParams.set('offset', String(offset));

    const payload = await fetchJson(url.toString());
    const batch = Array.isArray(payload?.storytellers)
      ? payload.storytellers
      : Array.isArray(payload)
        ? payload
        : [];
    if (!batch.length) break;
    records.push(...batch);
    if (batch.length < PAGE_SIZE) break;
  }
  return records;
}

async function fetchStorytellerDetail(id) {
  const url = new URL(
    `/api/v1/sites/${EMPATHY_LEDGER_SITE_SLUG}/storytellers/${encodeURIComponent(id)}`,
    EMPATHY_LEDGER_URL
  );
  try {
    return await fetchJson(url.toString());
  } catch {
    return null;
  }
}

async function main() {
  if (!process.env.EMPATHY_LEDGER_API_KEY) {
    await keepExistingSnapshot('No EMPATHY_LEDGER_API_KEY');
    return;
  }

  let listRecords;
  try {
    listRecords = await fetchStorytellerList();
  } catch (error) {
    await keepExistingSnapshot(`EL storyteller list failed: ${error.message}`);
    return;
  }

  if (!listRecords.length) {
    await writeSnapshot(createEmptySnapshot());
    console.log(`No storytellers returned, wrote empty EL storyteller snapshot`);
    return;
  }

  const details = await Promise.all(
    listRecords.map(async (record) => {
      const id = record?.id || record?.storyteller_id;
      if (!id) return null;
      const detail = await fetchStorytellerDetail(id);
      return {
        id,
        list: record,
        detail: detail?.storyteller || detail || null,
      };
    })
  );

  const storytellers = details.filter(Boolean);

  await writeSnapshot({
    generatedAt: new Date().toISOString(),
    sourceUrl: `${EMPATHY_LEDGER_URL}/api/v1/sites/${EMPATHY_LEDGER_SITE_SLUG}/storytellers`,
    siteSlug: EMPATHY_LEDGER_SITE_SLUG,
    storytellerCount: storytellers.length,
    storytellers,
  });
  console.log(`Synced ${storytellers.length} storytellers to ${OUTPUT_PATH}`);
}

main().catch(async (error) => {
  await keepExistingSnapshot(`EL storyteller sync unhandled: ${error.message}`);
  process.exitCode = 0;
});
