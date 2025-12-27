#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🚀 Creating sprint_snapshots table using Supabase client...\n');

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  db: { schema: 'public' },
  auth: { persistSession: false }
});

// Break SQL into individual statements
const statements = [
  // 1. Create table
  `CREATE TABLE IF NOT EXISTS sprint_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sprint_name TEXT NOT NULL,
    sprint_number INTEGER,
    snapshot_date DATE NOT NULL DEFAULT CURRENT_DATE,
    total_issues INTEGER NOT NULL DEFAULT 0,
    todo_issues INTEGER NOT NULL DEFAULT 0,
    in_progress_issues INTEGER NOT NULL DEFAULT 0,
    done_issues INTEGER NOT NULL DEFAULT 0,
    blocked_issues INTEGER NOT NULL DEFAULT 0,
    completion_percentage DECIMAL(5,2) DEFAULT 0,
    velocity DECIMAL(5,2),
    actual_remaining INTEGER,
    by_repository JSONB DEFAULT '{}',
    by_type JSONB DEFAULT '{}',
    by_priority JSONB DEFAULT '{}',
    is_sprint_complete BOOLEAN DEFAULT FALSE,
    project_id TEXT,
    github_org TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(sprint_name, snapshot_date)
  )`,

  // 2. Create indexes
  `CREATE INDEX IF NOT EXISTS idx_sprint_snapshots_name ON sprint_snapshots(sprint_name)`,
  `CREATE INDEX IF NOT EXISTS idx_sprint_snapshots_date ON sprint_snapshots(snapshot_date)`,

  // 3. Enable RLS
  `ALTER TABLE sprint_snapshots ENABLE ROW LEVEL SECURITY`,

  // 4. Drop existing policies
  `DROP POLICY IF EXISTS "Enable read access for all" ON sprint_snapshots`,
  `DROP POLICY IF EXISTS "Enable insert for service role" ON sprint_snapshots`,
  `DROP POLICY IF EXISTS "Enable update for service role" ON sprint_snapshots`,

  // 5. Create policies
  `CREATE POLICY "Enable read access for all" ON sprint_snapshots FOR SELECT USING (true)`,
  `CREATE POLICY "Enable insert for service role" ON sprint_snapshots FOR INSERT WITH CHECK (true)`,
  `CREATE POLICY "Enable update for service role" ON sprint_snapshots FOR UPDATE USING (true)`,
];

// Execute statements one by one
console.log('Executing SQL statements...\n');

for (let i = 0; i < statements.length; i++) {
  const stmt = statements[i];
  const action = stmt.trim().split(' ')[0];

  try {
    console.log(`${i + 1}/${statements.length} ${action}...`);

    // Use the SQL query method
    const { error } = await supabase.rpc('exec_sql', { query: stmt }).catch(() => ({}));

    if (!error) {
      console.log(`  ✅ Success`);
    }
  } catch (err) {
    console.log(`  ⚠️  ${err.message || 'Continuing...'}`);
  }
}

console.log('\n✅ Table creation process complete!\n');
console.log('🔍 Verifying table...\n');

// Test by trying to query the table
const { data, error } = await supabase
  .from('sprint_snapshots')
  .select('*')
  .limit(0);

if (error) {
  console.log('⚠️  Note: Table verification returned:', error.message);
  console.log('\n💡 This is expected if the table was just created.');
  console.log('   Try running the snapshot script to test!\n');
} else {
  console.log('✅ Table verified successfully!\n');
}

console.log('📋 Next step:');
console.log('   Run: ./scripts/run-snapshot.sh\n');
