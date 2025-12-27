#!/usr/bin/env node

/**
 * Create sprint_snapshots table using Supabase Management API
 * This bypasses the client library and uses HTTP directly
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tednluwflfhxyucgwigh.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY not set');
  process.exit(1);
}

console.log('🚀 Creating sprint_snapshots table via Supabase API...\n');

// The SQL to execute
const SQL = `
DO $$
BEGIN
  -- Create table
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

  -- Enable RLS
  ALTER TABLE sprint_snapshots ENABLE ROW LEVEL SECURITY;

  -- Drop old policies
  DROP POLICY IF EXISTS "Enable read access for all" ON sprint_snapshots;
  DROP POLICY IF EXISTS "Enable insert for service role" ON sprint_snapshots;
  DROP POLICY IF EXISTS "Enable update for service role" ON sprint_snapshots;

  -- Create policies
  CREATE POLICY "Enable read access for all" ON sprint_snapshots FOR SELECT USING (true);
  CREATE POLICY "Enable insert for service role" ON sprint_snapshots FOR INSERT WITH CHECK (true);
  CREATE POLICY "Enable update for service role" ON sprint_snapshots FOR UPDATE USING (true);

END $$;

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
`.trim();

console.log('📝 SQL prepared (' + SQL.split('\n').length + ' lines)\n');
console.log('⚠️  Note: Supabase REST API doesn\'t support raw SQL execution via HTTP');
console.log('   for security reasons. We need to use one of these methods:\n');
console.log('   Option 1: Supabase Dashboard SQL Editor (RECOMMENDED)');
console.log('   Option 2: psql with database password');
console.log('   Option 3: Supabase CLI migration\n');

console.log('📋 Easiest method - Copy this SQL to clipboard:\n');
console.log('---SQL START---');
console.log(SQL);
console.log('---SQL END---\n');

console.log('Then:');
console.log('1. Open: https://supabase.com/dashboard/project/tednluwflfhxyucgwigh/sql/new');
console.log('2. Paste the SQL above');
console.log('3. Click "Run"');
console.log('4. Return here and run: ./scripts/run-snapshot.sh\n');
