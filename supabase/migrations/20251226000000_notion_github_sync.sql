-- Notion-GitHub Sync State Tables
-- Created: 2025-12-26
-- Purpose: Track sync operations and mappings between Notion and GitHub

-- Table: Sync operation logs
CREATE TABLE IF NOT EXISTS notion_github_sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sync_direction TEXT NOT NULL CHECK (sync_direction IN ('github_to_notion', 'notion_to_github')),
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  status TEXT NOT NULL CHECK (status IN ('running', 'success', 'error', 'partial')) DEFAULT 'running',
  items_total INTEGER DEFAULT 0,
  items_created INTEGER DEFAULT 0,
  items_updated INTEGER DEFAULT 0,
  items_skipped INTEGER DEFAULT 0,
  items_errored INTEGER DEFAULT 0,
  errors JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: Notion-GitHub page mappings
CREATE TABLE IF NOT EXISTS notion_github_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  github_repo TEXT NOT NULL,
  github_issue_id INTEGER NOT NULL,
  github_issue_url TEXT NOT NULL,
  notion_page_id TEXT NOT NULL UNIQUE,
  notion_page_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_synced_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(github_repo, github_issue_id)
);

-- Table: Sync conflicts for manual resolution
CREATE TABLE IF NOT EXISTS notion_github_conflicts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  github_repo TEXT NOT NULL,
  github_issue_id INTEGER NOT NULL,
  notion_page_id TEXT NOT NULL,
  field_name TEXT NOT NULL,
  github_value JSONB,
  notion_value JSONB,
  github_updated_at TIMESTAMPTZ,
  notion_updated_at TIMESTAMPTZ,
  detected_at TIMESTAMPTZ DEFAULT NOW(),
  resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMPTZ,
  resolved_by TEXT,
  resolution_action TEXT, -- 'github_wins' | 'notion_wins' | 'manual_merge'
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_sync_log_direction ON notion_github_sync_log(sync_direction);
CREATE INDEX IF NOT EXISTS idx_sync_log_started ON notion_github_sync_log(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_sync_log_status ON notion_github_sync_log(status);

CREATE INDEX IF NOT EXISTS idx_mappings_notion ON notion_github_mappings(notion_page_id);
CREATE INDEX IF NOT EXISTS idx_mappings_github ON notion_github_mappings(github_repo, github_issue_id);
CREATE INDEX IF NOT EXISTS idx_mappings_last_synced ON notion_github_mappings(last_synced_at DESC);

CREATE INDEX IF NOT EXISTS idx_conflicts_resolved ON notion_github_conflicts(resolved);
CREATE INDEX IF NOT EXISTS idx_conflicts_detected ON notion_github_conflicts(detected_at DESC);
CREATE INDEX IF NOT EXISTS idx_conflicts_github ON notion_github_conflicts(github_repo, github_issue_id);

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Auto-update updated_at on mappings table
CREATE TRIGGER update_mappings_updated_at
  BEFORE UPDATE ON notion_github_mappings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE notion_github_sync_log IS 'Logs all sync operations between Notion and GitHub';
COMMENT ON TABLE notion_github_mappings IS 'Maps Notion pages to GitHub issues for bidirectional sync';
COMMENT ON TABLE notion_github_conflicts IS 'Tracks conflicts when both systems are updated simultaneously';

COMMENT ON COLUMN notion_github_sync_log.sync_direction IS 'Direction of sync: github_to_notion or notion_to_github';
COMMENT ON COLUMN notion_github_sync_log.status IS 'Sync status: running, success, error, or partial';
COMMENT ON COLUMN notion_github_sync_log.errors IS 'Array of error objects from sync operation';
COMMENT ON COLUMN notion_github_sync_log.metadata IS 'Additional sync metadata (triggered_by, event_type, etc.)';

COMMENT ON COLUMN notion_github_mappings.github_repo IS 'Repository name (e.g., empathy-ledger-v2)';
COMMENT ON COLUMN notion_github_mappings.github_issue_id IS 'GitHub issue number';
COMMENT ON COLUMN notion_github_mappings.notion_page_id IS 'Notion page ID (unique)';
COMMENT ON COLUMN notion_github_mappings.last_synced_at IS 'Last successful sync timestamp';

COMMENT ON COLUMN notion_github_conflicts.field_name IS 'Name of the field that has conflicting values';
COMMENT ON COLUMN notion_github_conflicts.resolution_action IS 'How the conflict was resolved';
