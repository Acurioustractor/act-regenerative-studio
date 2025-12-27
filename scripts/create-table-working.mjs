#!/usr/bin/env node

/**
 * Create sprint_snapshots table by executing SQL through Supabase client
 * This uses the same pattern as the existing codebase
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing Supabase credentials in environment');
  process.exit(1);
}

console.log('🚀 Creating sprint_snapshots table...\n');

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

// Read the migration file
const migrationSQL = readFileSync('supabase/migrations/20251227010000_sprint_snapshots.sql', 'utf8');

console.log('📝 Loaded migration SQL (' + migrationSQL.split('\n').length + ' lines)');
console.log('🔧 Attempting to create table...\n');

// Try to insert a test row - if table doesn't exist, we'll get an error
// But first, let's just try to select from it to check if it exists
const { data: existingData, error: checkError } = await supabase
  .from('sprint_snapshots')
  .select('count')
  .limit(1)
  .single();

if (!checkError || checkError.code === 'PGRST116') {
  // PGRST116 = no rows, but table exists
  console.log('✅ Table already exists!');
  console.log('✅ Ready to use\n');

  console.log('📋 Next step:');
  console.log('   Run: ./scripts/run-snapshot.sh\n');
  process.exit(0);
}

if (checkError && checkError.code !== 'PGRST204') {
  // PGRST204 = table doesn't exist (what we expect)
  console.error('❌ Unexpected error:', checkError);
  console.log('\n💡 The table might already exist or there\'s a permissions issue.');
  console.log('   Try running the snapshot script anyway: ./scripts/run-snapshot.sh\n');
  process.exit(0);
}

// Table doesn't exist - we need to create it
console.log('⚠️  Table doesn\'t exist yet\n');
console.log('Unfortunately, Supabase JavaScript client cannot execute raw DDL SQL');
console.log('(CREATE TABLE, CREATE INDEX, etc.) for security reasons.\n');
console.log('✅ SOLUTION: Use Supabase CLI migration repair and push:\n');
console.log('   npx supabase migration repair --status reverted 20251114070000');
console.log('   Then manually run just our migration via psql or Supabase dashboard\n');
console.log('OR copy this SQL to Supabase dashboard:\n');
console.log('─'.repeat(60));
console.log(migrationSQL);
console.log('─'.repeat(60));
console.log('\nPaste at: https://supabase.com/dashboard/project/tednluwflfhxyucgwigh/sql/new\n');
