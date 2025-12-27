#!/usr/bin/env node

/**
 * Create sprint_snapshots table using Supabase exec_sql RPC
 * This ACTUALLY WORKS via CLI automation!
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

console.log('🚀 Creating sprint_snapshots table via exec_sql RPC...\n');

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
});

// First, check if table exists
const { error: checkError } = await supabase
  .from('sprint_snapshots')
  .select('id')
  .limit(0);

if (!checkError || checkError.code === 'PGRST116') {
  console.log('✅ Table already exists!\n');
  console.log('📋 Next step: Run snapshot to populate data');
  console.log('   ./scripts/run-snapshot.sh\n');
  process.exit(0);
}

// Table doesn't exist - create it
const sql = readFileSync('scripts/create-table-simple.sql', 'utf8');

const { error } = await supabase.rpc('exec_sql', { query: sql });

if (error) {
  console.log('❌ Error:', error.message);
  console.log('Code:', error.code);
  if (error.details) console.log('Details:', error.details);
  process.exit(1);
}

console.log('✅ TABLE CREATED SUCCESSFULLY!\n');
console.log('📋 Next step: Run snapshot to populate data');
console.log('   ./scripts/run-snapshot.sh\n');
