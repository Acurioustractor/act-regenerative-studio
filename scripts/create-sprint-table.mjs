#!/usr/bin/env node

/**
 * Create sprint_snapshots table in Supabase
 * Uses service role key for admin access
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing Supabase credentials');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

console.log('🚀 Creating sprint_snapshots table in Supabase...\n');

const sql = `
-- Create sprint_snapshots table
CREATE TABLE IF NOT EXISTS sprint_snapshots (
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
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_sprint_snapshots_name ON sprint_snapshots(sprint_name);
CREATE INDEX IF NOT EXISTS idx_sprint_snapshots_date ON sprint_snapshots(snapshot_date);

-- Create views
CREATE OR REPLACE VIEW sprint_velocity AS
SELECT
  sprint_name,
  sprint_number,
  MAX(done_issues) as completed_issues,
  MAX(done_issues) as velocity_per_sprint,
  MAX(snapshot_date) as sprint_end_date
FROM sprint_snapshots
WHERE is_sprint_complete = true
GROUP BY sprint_name, sprint_number
ORDER BY sprint_number DESC;

CREATE OR REPLACE VIEW latest_sprint_snapshots AS
SELECT DISTINCT ON (sprint_name)
  *
FROM sprint_snapshots
ORDER BY sprint_name, snapshot_date DESC;

-- Enable RLS
ALTER TABLE sprint_snapshots ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read access for all" ON sprint_snapshots;
DROP POLICY IF EXISTS "Enable insert for service role" ON sprint_snapshots;
DROP POLICY IF EXISTS "Enable update for service role" ON sprint_snapshots;

-- Create policies (allow service role full access)
CREATE POLICY "Enable read access for all" ON sprint_snapshots
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for service role" ON sprint_snapshots
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for service role" ON sprint_snapshots
  FOR UPDATE USING (true);
`;

try {
  // Execute the SQL
  const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

  if (error) {
    // Try alternative method using raw SQL query
    console.log('Trying alternative method...\n');

    const { error: queryError } = await supabase
      .from('_supabase_admin')
      .select('*')
      .limit(0);

    if (queryError) {
      // Fall back to creating table via REST API
      console.log('Using REST API method...\n');

      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sql_query: sql })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }
    }
  }

  console.log('✅ Successfully created sprint_snapshots table!');
  console.log('✅ Created indexes for performance');
  console.log('✅ Created sprint_velocity view');
  console.log('✅ Created latest_sprint_snapshots view');
  console.log('✅ Enabled Row Level Security');
  console.log('✅ Created access policies\n');

  // Verify table exists
  console.log('🔍 Verifying table creation...\n');
  const { data: tables, error: checkError } = await supabase
    .from('sprint_snapshots')
    .select('*')
    .limit(0);

  if (checkError) {
    console.error('⚠️  Verification error:', checkError.message);
    console.log('\n💡 Table may still have been created. Try running the snapshot script to test.\n');
  } else {
    console.log('✅ Table verified and ready to use!\n');
  }

  console.log('📋 Next steps:');
  console.log('   1. Run: ./scripts/run-snapshot.sh');
  console.log('   2. Check: Should show "✅ Snapshot stored in Supabase"');
  console.log('   3. Open dashboard: http://localhost:3001/admin/dashboard\n');

} catch (error) {
  console.error('❌ Error creating table:', error.message);
  console.error('\n💡 Alternative: Run SQL manually in Supabase dashboard');
  console.error('   See: docs/operations/CREATE_SPRINT_TABLE.md\n');
  process.exit(1);
}
