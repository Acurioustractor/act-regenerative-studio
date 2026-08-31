import { createClient } from '@supabase/supabase-js';

const SOURCE_URL = 'https://yvnuayzslukamizrlhwb.supabase.co';
// Credentials come from the environment. They were hardcoded here as literal
// service_role JWTs in a PUBLIC repository until 2026-08-31. Both are now dead,
// because Supabase disabled legacy keys on these projects, and that was verified
// rather than assumed: a valid sb_secret_ key returns 200 on the same tables where
// both the committed key and a nonsense key return 401. They are removed anyway.
// A disabled key is one dashboard toggle from being live again, and git history
// keeps them regardless, so treat both as burned and never re-enable legacy keys.
//
// No fallback literal. A missing variable must stop the script, not silently reach
// for a credential nobody meant to ship.
const SOURCE_KEY = process.env.EL_SUPABASE_SERVICE_ROLE_KEY;

if (!SOURCE_KEY) {
  console.error('EL_SUPABASE_SERVICE_ROLE_KEY is not set. Export it before running this script.');
  process.exit(1);
}

const db = createClient(SOURCE_URL, SOURCE_KEY);

async function checkTables() {
  console.log('Checking tables in portfolio database...\n');

  const tables = ['media_items', 'media_files', 'review_videos', 'review_media_links', 'review_curated_entries'];

  for (const table of tables) {
    const { data, error } = await db.from(table).select('*').limit(1);
    if (error) {
      console.log(`❌ ${table}: ${error.message}`);
    } else {
      const count = data ? data.length : 0;
      console.log(`✅ ${table}: ${count} rows found`);
    }
  }
}

checkTables();
