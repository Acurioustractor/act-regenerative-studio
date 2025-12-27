-- Create sprint_snapshots table (simplified for RPC execution)

CREATE TABLE IF NOT EXISTS sprint_snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sprint_name TEXT NOT NULL,
  sprint_number INTEGER,
  sprint_start_date DATE,
  sprint_end_date DATE,
  snapshot_date DATE NOT NULL DEFAULT CURRENT_DATE,
  snapshot_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  total_issues INTEGER NOT NULL DEFAULT 0,
  todo_issues INTEGER NOT NULL DEFAULT 0,
  in_progress_issues INTEGER NOT NULL DEFAULT 0,
  done_issues INTEGER NOT NULL DEFAULT 0,
  blocked_issues INTEGER NOT NULL DEFAULT 0,
  completion_percentage DECIMAL(5,2) DEFAULT 0,
  velocity DECIMAL(5,2),
  ideal_remaining INTEGER,
  actual_remaining INTEGER,
  by_repository JSONB DEFAULT '{}',
  by_type JSONB DEFAULT '{}',
  by_priority JSONB DEFAULT '{}',
  project_id TEXT,
  github_org TEXT DEFAULT 'Acurioustractor',
  is_sprint_complete BOOLEAN DEFAULT FALSE,
  is_final_snapshot BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(sprint_name, snapshot_date)
);

CREATE INDEX IF NOT EXISTS idx_sprint_snapshots_sprint_name ON sprint_snapshots(sprint_name);
CREATE INDEX IF NOT EXISTS idx_sprint_snapshots_snapshot_date ON sprint_snapshots(snapshot_date DESC);
CREATE INDEX IF NOT EXISTS idx_sprint_snapshots_sprint_number ON sprint_snapshots(sprint_number DESC);
CREATE INDEX IF NOT EXISTS idx_sprint_snapshots_complete ON sprint_snapshots(is_sprint_complete);

ALTER TABLE sprint_snapshots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role can manage sprint_snapshots" ON sprint_snapshots;
CREATE POLICY "Service role can manage sprint_snapshots"
  ON sprint_snapshots
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can read sprint_snapshots" ON sprint_snapshots;
CREATE POLICY "Authenticated users can read sprint_snapshots"
  ON sprint_snapshots
  FOR SELECT
  TO authenticated
  USING (true);
