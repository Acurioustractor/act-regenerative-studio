# Sprint Snapshot Script Guide

## Overview

The `snapshot-sprint-metrics.mjs` script captures daily sprint progress and stores it in Supabase. This populates data for the dashboard's velocity and burndown charts.

## What It Does

1. **Fetches** all issues from GitHub Projects
2. **Filters** to current sprint (default: "Sprint 4")
3. **Calculates** metrics:
   - Total issues
   - Todo, In Progress, Done, Blocked counts
   - Completion percentage
   - Breakdowns by repository, type, priority
4. **Stores** snapshot in Supabase `sprint_snapshots` table

## Requirements

All environment variables are already configured in your `.env.local`:
- ✅ `GITHUB_TOKEN` - Already set
- ✅ `GITHUB_PROJECT_ID` - Already set (PVT_kwHOCOopjs4BLVik)
- ✅ `NEXT_PUBLIC_SUPABASE_URL` - Already set
- ✅ `SUPABASE_SERVICE_ROLE_KEY` - Already set

**Optional**:
- `CURRENT_SPRINT` - Defaults to "Sprint 4" if not set

## Usage

### Run Manually

```bash
# Run for current sprint (Sprint 4)
node scripts/snapshot-sprint-metrics.mjs

# Run for a different sprint
CURRENT_SPRINT="Sprint 5" node scripts/snapshot-sprint-metrics.mjs
```

### Expected Output

```
🚀 Sprint Snapshot Script Starting...
📅 Target Sprint: Sprint 4
📊 GitHub Project: PVT_kwHOCOopjs4BLVik

📥 Fetching GitHub Project items...
✅ Fetched 100 total items

📊 Calculating metrics for Sprint 4...
🔍 Found 15 issues in Sprint 4
  Total: 15
  Todo: 5
  In Progress: 3
  Done: 7
  Blocked: 0
  Completion: 46.67%

💾 Storing snapshot in Supabase...
✅ Snapshot stored in Supabase

✨ Sprint Snapshot Complete!
   Sprint: Sprint 4
   Total Issues: 15
   Completed: 7 (46.67%)
   Supabase: ✅
```

## What Gets Stored

Each snapshot creates/updates a row in `sprint_snapshots` with:

| Field | Example Value |
|-------|---------------|
| sprint_name | "Sprint 4" |
| sprint_number | 4 |
| snapshot_date | "2025-12-27" |
| total_issues | 15 |
| todo_issues | 5 |
| in_progress_issues | 3 |
| done_issues | 7 |
| blocked_issues | 0 |
| completion_percentage | 46.67 |
| velocity | 7 |
| actual_remaining | 8 |
| by_repository | {"empathy-ledger-v2": 5, "justicehub-platform": 3, ...} |
| by_type | {"Enhancement": 10, "Bug": 2, ...} |
| by_priority | {"High": 4, "Medium": 8, ...} |

## How This Powers the Dashboard

### Velocity Chart (`/admin/dashboard`)
- Reads from `sprint_velocity` view
- Shows last 5 completed sprints
- Calculates average velocity
- Displays bar chart with trend line

### Burndown Chart (`/admin/dashboard`)
- Reads daily snapshots for current sprint
- Plots ideal vs actual remaining issues
- Shows projection (on track / behind)
- Updates as you run the script daily

## Automation

### GitHub Action (Recommended)

Create `.github/workflows/snapshot-sprint.yml`:

```yaml
name: Sprint Snapshot

on:
  schedule:
    # Run daily at 5:00 PM UTC (end of workday)
    - cron: '0 17 * * *'
  workflow_dispatch: # Allow manual trigger

jobs:
  snapshot:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - run: npm install

      - name: Run Sprint Snapshot
        env:
          GITHUB_TOKEN: ${{ secrets.GH_PROJECT_TOKEN }}
          GITHUB_PROJECT_ID: ${{ secrets.GITHUB_PROJECT_ID }}
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
          CURRENT_SPRINT: 'Sprint 4'
        run: node scripts/snapshot-sprint-metrics.mjs
```

**Add these secrets to your GitHub repo**:
- `GH_PROJECT_TOKEN` - Your GitHub token
- `GITHUB_PROJECT_ID` - PVT_kwHOCOopjs4BLVik
- `SUPABASE_URL` - Your Supabase URL
- `SUPABASE_SERVICE_ROLE_KEY` - Your service role key

## Notion Integration

**Your existing issue sync already handles Sprint and Milestone!**

The `sync-github-to-notion.mjs` script (already running every 30 min) populates:
- ✅ Sprint property in your Issues database
- ✅ Milestone property in your Issues database

No additional Notion configuration needed.

## Troubleshooting

### No issues found in sprint
- Check sprint name matches exactly (case-sensitive)
- Verify Sprint field exists in GitHub Projects
- Confirm issues are assigned to the sprint

### Supabase error
- Verify `sprint_snapshots` table exists
- Check Supabase service role key is correct
- Ensure RLS policies allow service role access

### Zero velocity on dashboard
- Run snapshot script at least once
- Check if sprint has any completed issues
- Mark sprint as complete when done (for velocity view)

## Next Sprint

When starting a new sprint:

1. Update environment variable:
   ```bash
   # In .env.local or GitHub Action
   CURRENT_SPRINT="Sprint 5"
   ```

2. Run snapshot to create first data point:
   ```bash
   CURRENT_SPRINT="Sprint 5" node scripts/snapshot-sprint-metrics.mjs
   ```

3. Continue daily snapshots throughout sprint

---

**Related**:
- Dashboard: `/admin/dashboard`
- Database schema: `supabase/migrations/20251227010000_sprint_snapshots.sql`
- Issue sync: `scripts/sync-github-to-notion.mjs`
