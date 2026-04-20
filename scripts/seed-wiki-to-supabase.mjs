/**
 * Seed wiki_pages table in Supabase from the canonical wiki snapshot.
 *
 * Reads src/data/wiki-pages.generated.json (329+ pages from the
 * act-global-infrastructure/wiki filesystem, already normalized).
 * Upserts each page on `slug` unique key. Idempotent — safe to re-run.
 *
 * Requires in .env.local:
 *   SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL)
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * Usage:
 *   npm run seed:wiki-to-supabase
 *   DRY_RUN=1 npm run seed:wiki-to-supabase   # preview only, no writes
 */

import fs from 'node:fs/promises';
import path from 'node:path';

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const SNAPSHOT_PATH = path.resolve(
  process.cwd(),
  'src/data/wiki-pages.generated.json'
);

const DRY_RUN = /^(1|true|yes)$/i.test(process.env.DRY_RUN || '');

// Schema constraint: page_type IN ('principle','method','practice','procedure','guide','template')
const SECTION_TO_PAGE_TYPE = {
  concepts: 'principle',
  projects: 'practice',
  communities: 'practice',
  people: 'practice',
  art: 'practice',
  sources: 'guide',
  stories: 'guide',
  research: 'guide',
  technical: 'procedure',
  finance: 'procedure',
  decisions: 'principle',
  synthesis: 'method',
};

function pageTypeFor(sectionId) {
  return SECTION_TO_PAGE_TYPE[sectionId] || 'method';
}

function getSupabaseClient() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function toRow(page) {
  const slug = (page.path || '').replace(/^\/+|\/+$/g, '');
  if (!slug || !page.title || !page.content) return null;
  return {
    slug,
    title: page.title,
    content: page.content,
    excerpt: page.excerpt || null,
    page_type: pageTypeFor(page.sectionId),
    status: 'active',
  };
}

async function main() {
  if (DRY_RUN) {
    console.log('DRY_RUN enabled — no writes will happen');
  }

  const client = getSupabaseClient();
  if (!client && !DRY_RUN) {
    console.error(
      'Missing SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY — cannot seed'
    );
    process.exit(1);
  }

  const raw = await fs.readFile(SNAPSHOT_PATH, 'utf8');
  const snapshot = JSON.parse(raw);
  const pages = Array.isArray(snapshot.pages) ? snapshot.pages : [];
  console.log(`Loaded ${pages.length} pages from snapshot`);

  const rows = pages.map(toRow).filter(Boolean);
  console.log(`Prepared ${rows.length} rows for upsert (filtered ${pages.length - rows.length} incomplete)`);

  if (DRY_RUN) {
    const sample = rows.slice(0, 3);
    console.log('Sample (first 3):');
    for (const r of sample) {
      console.log(`  - [${r.page_type}] ${r.slug} — ${r.title.slice(0, 60)}`);
    }
    return;
  }

  // Supabase upsert in batches to avoid hitting payload limits
  const BATCH = 50;
  let inserted = 0;
  let updated = 0;
  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH);
    const { error, count } = await client
      .from('wiki_pages')
      .upsert(batch, { onConflict: 'slug', count: 'estimated' });
    if (error) {
      console.error(`Batch ${i / BATCH + 1} failed:`, error.message);
      process.exit(1);
    }
    console.log(
      `Batch ${i / BATCH + 1}: upserted ${batch.length} rows (running total ${i + batch.length}/${rows.length})`
    );
  }

  console.log(`Done. Upserted ${rows.length} wiki pages to Supabase.`);
}

main().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
