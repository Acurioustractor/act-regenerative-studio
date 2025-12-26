-- Sprint Snapshots Table
-- Stores daily snapshots of sprint progress for velocity and burndown calculations
-- Populated by GitHub Action that runs daily at 5:00 PM

CREATE TABLE IF NOT EXISTS sprint_snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Sprint identification
  sprint_name TEXT NOT NULL,
  sprint_number INTEGER, -- Extract number from "Sprint 4" -> 4
  sprint_start_date DATE,
  sprint_end_date DATE,

  -- Snapshot metadata
  snapshot_date DATE NOT NULL DEFAULT CURRENT_DATE,
  snapshot_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Issue counts at snapshot time
  total_issues INTEGER NOT NULL DEFAULT 0,
  todo_issues INTEGER NOT NULL DEFAULT 0,
  in_progress_issues INTEGER NOT NULL DEFAULT 0,
  done_issues INTEGER NOT NULL DEFAULT 0,
  blocked_issues INTEGER NOT NULL DEFAULT 0,

  -- Calculated metrics
  completion_percentage DECIMAL(5,2) DEFAULT 0, -- e.g., 67.50
  velocity DECIMAL(5,2), -- Issues completed per day or per sprint

  -- Ideal burndown (calculated from total and days remaining)
  ideal_remaining INTEGER,
  actual_remaining INTEGER,

  -- Repository breakdown (JSONB for flexibility)
  by_repository JSONB DEFAULT '{}', -- {"empathy-ledger-v2": 5, "justicehub-platform": 3}
  by_type JSONB DEFAULT '{}', -- {"Type: Enhancement": 10, "Type: Bug": 2}
  by_priority JSONB DEFAULT '{}', -- {"Priority: Critical": 1, "Priority: High": 4}

  -- GitHub Project metadata
  project_id TEXT, -- GitHub Project ID
  github_org TEXT DEFAULT 'Acurioustractor',

  -- Status flags
  is_sprint_complete BOOLEAN DEFAULT FALSE,
  is_final_snapshot BOOLEAN DEFAULT FALSE, -- Last snapshot of sprint

  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  UNIQUE(sprint_name, snapshot_date)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_sprint_snapshots_sprint_name ON sprint_snapshots(sprint_name);
CREATE INDEX IF NOT EXISTS idx_sprint_snapshots_snapshot_date ON sprint_snapshots(snapshot_date DESC);
CREATE INDEX IF NOT EXISTS idx_sprint_snapshots_sprint_number ON sprint_snapshots(sprint_number DESC);
CREATE INDEX IF NOT EXISTS idx_sprint_snapshots_complete ON sprint_snapshots(is_sprint_complete);

-- RLS Policies
ALTER TABLE sprint_snapshots ENABLE ROW LEVEL SECURITY;

-- Service role can manage all snapshots
CREATE POLICY "Service role can manage sprint_snapshots"
  ON sprint_snapshots
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Authenticated users can read snapshots
CREATE POLICY "Authenticated users can read sprint_snapshots"
  ON sprint_snapshots
  FOR SELECT
  TO authenticated
  USING (true);

-- Helper view: Latest snapshot per sprint
CREATE OR REPLACE VIEW latest_sprint_snapshots AS
SELECT DISTINCT ON (sprint_name)
  *
FROM sprint_snapshots
ORDER BY sprint_name, snapshot_date DESC, snapshot_time DESC;

-- Helper view: Velocity calculations
CREATE OR REPLACE VIEW sprint_velocity AS
SELECT
  sprint_name,
  sprint_number,
  MAX(snapshot_date) as completed_date,
  MAX(total_issues) as total_issues,
  MAX(done_issues) as completed_issues,
  ROUND(
    CAST(MAX(done_issues) AS DECIMAL) / NULLIF(
      EXTRACT(DAY FROM MAX(snapshot_date) - MIN(snapshot_date)) + 1,
      0
    ),
    2
  ) as velocity_per_day,
  MAX(done_issues) as velocity_per_sprint
FROM sprint_snapshots
WHERE is_sprint_complete = true
GROUP BY sprint_name, sprint_number
ORDER BY sprint_number DESC;

-- Add helpful comments
COMMENT ON TABLE sprint_snapshots IS 'Daily snapshots of sprint progress for velocity tracking and burndown charts';
COMMENT ON VIEW latest_sprint_snapshots IS 'Most recent snapshot for each sprint';
COMMENT ON VIEW sprint_velocity IS 'Calculated velocity metrics for completed sprints';
