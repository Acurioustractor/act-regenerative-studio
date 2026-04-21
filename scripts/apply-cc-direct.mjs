/**
 * Apply Continuous Claude migration directly via Supabase SQL
 * Run with: node scripts/apply-cc-direct.mjs
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

// Load env
config({ path: '.env.local' });

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

console.log('Connecting to:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
});

// Read migration
const migrationPath = path.join(__dirname, '../supabase/migrations/20260118000000_continuous_claude.sql');
const sql = fs.readFileSync(migrationPath, 'utf8');

// Split into individual statements (crude but works)
const statements = [];
let current = '';
for (const line of sql.split('\n')) {
  current += line + '\n';
  if (line.trim().endsWith(';') && !line.trim().startsWith('--')) {
    statements.push(current.trim());
    current = '';
  }
}
if (current.trim()) statements.push(current.trim());

console.log(`Found ${statements.length} SQL statements`);

// Check if tables already exist
const { data: existingTables, error: checkError } = await supabase
  .from('cc_sessions')
  .select('id')
  .limit(1);

if (!checkError) {
  console.log('✓ cc_sessions table already exists');
  console.log('Migration may have already been applied.');

  // Verify other tables
  const tables = ['cc_file_claims', 'cc_archival_memory', 'cc_handoffs', 'cc_ledgers'];
  for (const table of tables) {
    const { error } = await supabase.from(table).select('*').limit(0);
    if (!error) {
      console.log(`✓ ${table} exists`);
    } else {
      console.log(`✗ ${table} missing: ${error.message}`);
    }
  }
  process.exit(0);
}

console.log('Tables do not exist. You need to run the migration manually.');
console.log('');
console.log('Option 1: Supabase Dashboard SQL Editor');
console.log('  1. Go to: https://supabase.com/dashboard');
console.log('  2. Select your project');
console.log('  3. Go to SQL Editor');
console.log('  4. Paste contents of: supabase/migrations/20260118000000_continuous_claude.sql');
console.log('  5. Click Run');
console.log('');
console.log('Option 2: Use psql directly');
console.log('  psql $DATABASE_URL -f supabase/migrations/20260118000000_continuous_claude.sql');
