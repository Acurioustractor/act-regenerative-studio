import { createClient } from '@supabase/supabase-js';

const SOURCE_URL = 'https://yvnuayzslukamizrlhwb.supabase.co';
const SOURCE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2bnVheXpzbHVrYW1penJsaHdiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjI0NDg1MCwiZXhwIjoyMDcxODIwODUwfQ.natmxpGJM9oZNnCAeMKo_D3fvkBz9spwwzhw7vbkT0k';

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
