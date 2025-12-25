import { createClient } from '@supabase/supabase-js';

const SOURCE_URL = 'https://yvnuayzslukamizrlhwb.supabase.co';
const SOURCE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2bnVheXpzbHVrYW1penJsaHdiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjI0NDg1MCwiZXhwIjoyMDcxODIwODUwfQ.natmxpGJM9oZNnCAeMKo_D3fvkBz9spwwzhw7vbkT0k';

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
