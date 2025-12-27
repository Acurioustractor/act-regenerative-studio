# Create Sprint Snapshots Table in Supabase

## Quick Fix: Create Table via Dashboard

The `sprint_snapshots` table needs to be created in your Supabase database for the dashboard to work.

### Steps:

1. **Open Supabase Dashboard**: https://supabase.com/dashboard/project/tednluwflfhxyucgwigh

2. **Go to SQL Editor**:
   - Click "SQL Editor" in the left sidebar
   - Click "New query"

3. **Copy and paste this SQL**:

```sql
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

-- Create policies (allow service role full access)
CREATE POLICY "Enable read access for all" ON sprint_snapshots
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for service role" ON sprint_snapshots
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for service role" ON sprint_snapshots
  FOR UPDATE USING (true);
```

4. **Click "Run"**

5. **Verify**:
   - Go to "Table Editor" in sidebar
   - You should see `sprint_snapshots` table

### Test It Works

Run the snapshot script again:

```bash
./scripts/run-snapshot.sh
```

Expected output:
```
✅ Snapshot stored in Supabase
```

---

## Alternative: Use Migration (If Fixed)

If Supabase migration history gets fixed later:

```bash
npx supabase db push
```

The migration file already exists at:
`supabase/migrations/20251227010000_sprint_snapshots.sql`

---

**After table is created, the dashboard will show:**
- Sprint progress with real data
- Velocity charts (after a few days of snapshots)
- Burndown charts for current sprint
