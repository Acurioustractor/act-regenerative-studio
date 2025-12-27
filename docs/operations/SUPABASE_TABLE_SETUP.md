# Supabase Table Setup for Sprint Workflow

## Overview

The Sprint Workflow System requires a `sprint_snapshots` table in Supabase to store daily sprint progress data. Due to security restrictions, this table must be created via the Supabase Dashboard SQL Editor.

## Why Manual Setup is Required

After extensive investigation, we found that:

1. **Supabase JavaScript Client**: Cannot execute raw DDL SQL (CREATE TABLE, CREATE INDEX, etc.) for security reasons
2. **Supabase REST API**: Does not expose SQL execution endpoints for security reasons
3. **Migration CLI (`supabase db push`)**: Blocked by migration history mismatches in existing projects
4. **psql Direct Connection**: Requires database password (not the service role key), which Supabase doesn't expose for managed databases

**Bottom Line**: The ONLY way to create tables in a remote Supabase project is via the Dashboard SQL Editor or by repairing the full migration history.

## Setup Instructions

### Step 1: Run the Setup Script

```bash
./scripts/setup-sprint-table.sh
```

This script will:
- Check if the `sprint_snapshots` table already exists
- If it doesn't exist, display the SQL you need to execute
- Provide next steps

### Step 2: Copy SQL to Dashboard

The script will output SQL like this:

```
────────────────────────────────────────────────────────────────────────────────
-- Sprint Snapshots Table
CREATE TABLE IF NOT EXISTS sprint_snapshots (
  ...
);
────────────────────────────────────────────────────────────────────────────────
```

**Copy the entire SQL block** (everything between the dashed lines).

### Step 3: Execute in Supabase Dashboard

1. Open: https://supabase.com/dashboard/project/tednluwflfhxyucgwigh/sql/new
2. Paste the SQL from Step 2
3. Click the **Run** button
4. Confirm success message appears

### Step 4: Verify Table Creation

Run the setup script again to confirm:

```bash
./scripts/setup-sprint-table.sh
```

Expected output:
```
✅ Table already exists!

📋 Next step: Run snapshot to populate data
   ./scripts/run-snapshot.sh
```

### Step 5: Run First Snapshot

```bash
./scripts/run-snapshot.sh
```

This will:
- Fetch all issues from GitHub Project filtered by Sprint="Backlog"
- Calculate metrics (completion %, remaining issues, etc.)
- Store snapshot in Supabase `sprint_snapshots` table

Expected output:
```
✅ Snapshot saved to Supabase!
   Sprint: Backlog
   Total: 100 issues
   Done: 0 (0%)
   Remaining: 100
```

## What the Table Does

The `sprint_snapshots` table stores:

- **Sprint Identification**: sprint_name, sprint_number, start/end dates
- **Issue Counts**: total, todo, in_progress, done, blocked
- **Metrics**: completion_percentage, velocity, ideal_remaining, actual_remaining
- **Breakdowns**: by_repository, by_type, by_priority (JSONB)
- **Metadata**: project_id, github_org, snapshot_date/time

## Helper Views

The migration also creates two views:

### `latest_sprint_snapshots`
Shows the most recent snapshot for each sprint:
```sql
SELECT * FROM latest_sprint_snapshots WHERE sprint_name = 'Sprint 4';
```

### `sprint_velocity`
Calculates velocity metrics for completed sprints:
```sql
SELECT * FROM sprint_velocity ORDER BY sprint_number DESC;
```

## Troubleshooting

### Table Creation Fails

**Error**: "relation already exists"
**Solution**: Table is already created! Skip to Step 4 to verify.

### Permission Denied

**Error**: "permission denied for schema public"
**Solution**: Ensure you're logged into Supabase dashboard as the project owner.

### RLS Policy Errors

**Error**: "must be owner of table sprint_snapshots"
**Solution**: The migration includes policies. If you see this error, you may need to skip the RLS section and create policies manually.

## Automation via GitHub Actions

Once the table is created, daily snapshots are automated via GitHub Action:

- **Schedule**: Daily at 5:00 PM UTC
- **Workflow**: `.github/workflows/snapshot-sprint.yml`
- **Secrets Required**:
  - `GH_PROJECT_TOKEN`
  - `GITHUB_PROJECT_ID`
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`

## Files Reference

- **Setup Script**: `scripts/setup-sprint-table.sh`
- **Table Check**: `scripts/create-table-via-http.mjs`
- **Migration SQL**: `supabase/migrations/20251227010000_sprint_snapshots.sql`
- **Snapshot Script**: `scripts/snapshot-sprint-metrics.mjs`
- **Snapshot Wrapper**: `scripts/run-snapshot.sh`

## Support

If you encounter issues:

1. Check script output for specific error messages
2. Verify Supabase credentials in `.env.local`
3. Confirm GitHub token has correct permissions
4. Review GitHub Action logs if automation fails
5. Check Supabase dashboard logs for SQL errors

## Next Steps

After successful table creation:

1. ✅ Run first manual snapshot: `./scripts/run-snapshot.sh`
2. ✅ Verify data in Supabase dashboard
3. ✅ Start dev server and check dashboard: http://localhost:3001/admin/dashboard
4. ✅ Configure GitHub Action secrets (see `docs/operations/GITHUB_SECRETS_SETUP.md`)
5. ✅ Test GitHub Action workflow manually
6. ✅ Daily snapshots will run automatically at 5 PM UTC
