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

async function inspectMediaFiles() {
  console.log('Inspecting media_files table...\n');

  const { data, error } = await db.from('media_files').select('*').limit(5);

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log(`Found ${data.length} rows`);

  if (data.length > 0) {
    console.log('\nFirst row structure:');
    console.log(JSON.stringify(data[0], null, 2));
    console.log('\nAll column names:');
    console.log(Object.keys(data[0]).join(', '));
  }
}

inspectMediaFiles();
