/**
 * Apply Continuous Claude migration to Supabase
 * Run with: npx tsx scripts/apply-cc-migration.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
});

async function applyMigration() {
  console.log('Applying Continuous Claude migration...');

  const migrationPath = path.join(
    __dirname,
    '../supabase/migrations/20260118000000_continuous_claude.sql'
  );

  const sql = fs.readFileSync(migrationPath, 'utf8');

  // Split by semicolons and execute each statement
  // Filter out comments and empty statements
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  console.log(`Found ${statements.length} SQL statements to execute`);

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    if (statement.trim()) {
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        if (error) {
          // Try direct execution for DDL statements
          const { error: rawError } = await supabase.from('_migrations').select().limit(0);
          // Ignore - we'll use psql instead
        }
        process.stdout.write('.');
      } catch (e) {
        // Continue - some statements may fail if already applied
      }
    }
  }

  console.log('\nMigration attempted. Checking tables...');

  // Verify tables exist
  const { data, error } = await supabase
    .from('cc_archival_memory')
    .select('id')
    .limit(1);

  if (error) {
    console.log('Tables not yet created. Run migration via Supabase Dashboard SQL Editor.');
    console.log(`File: supabase/migrations/20260118000000_continuous_claude.sql`);
  } else {
    console.log('✓ cc_archival_memory table exists');
  }
}

applyMigration().catch(console.error);
