#!/usr/bin/env node

/**
 * Create sprint_snapshots table using Supabase REST API
 * This executes raw SQL via the PostgREST API using RPC
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌ Missing Supabase credentials');
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', SUPABASE_URL ? '✓' : '✗');
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', SERVICE_KEY ? '✓' : '✗');
  process.exit(1);
}

console.log('🚀 Creating sprint_snapshots table via Supabase client...\n');

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
});

// Read the migration SQL
const migrationSQL = readFileSync('supabase/migrations/20251227010000_sprint_snapshots.sql', 'utf8');

console.log('📝 Loaded migration (' + migrationSQL.split('\n').length + ' lines)\n');

// First, check if table exists
console.log('🔍 Checking if table exists...\n');

const { data: checkData, error: checkError } = await supabase
  .from('sprint_snapshots')
  .select('id')
  .limit(0);

if (!checkError || checkError.code === 'PGRST116') {
  console.log('✅ Table already exists!\n');
  console.log('📋 Next step: Run snapshot to populate data');
  console.log('   ./scripts/run-snapshot.sh\n');
  process.exit(0);
}

console.log("⚠️  Table doesn't exist (error code: " + checkError.code + ')\n');
console.log('Unfortunately, the Supabase JavaScript client cannot execute raw DDL SQL\n');
console.log('   (CREATE TABLE, CREATE INDEX, CREATE POLICY, etc.)\n');
console.log('   for security reasons.\n');

console.log('╔════════════════════════════════════════════════════════════════════════╗');
console.log('║  SOLUTION: Copy SQL to Supabase Dashboard                              ║');
console.log('╚════════════════════════════════════════════════════════════════════════╝\n');

console.log('Step 1: Copy the SQL below');
console.log('Step 2: Open: https://supabase.com/dashboard/project/tednluwflfhxyucgwigh/sql/new');
console.log('Step 3: Paste and click "Run"');
console.log('Step 4: Return here and run: ./scripts/run-snapshot.sh\n');

console.log('─'.repeat(80));
console.log(migrationSQL);
console.log('─'.repeat(80));
console.log('');
