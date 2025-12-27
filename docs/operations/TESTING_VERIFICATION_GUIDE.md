# Sprint Workflow System - Testing & Verification Guide

## Overview

This guide walks through testing each component of the sprint workflow system to ensure everything is working correctly.

---

## Pre-Flight Checklist

Before testing, verify:

- [ ] `.env.local` has all required environment variables
- [ ] GitHub secrets configured (if testing Actions)
- [ ] Supabase migrations applied
- [ ] Development server running (`npm run dev`)
- [ ] You have at least 1 issue in GitHub Project with Sprint field set

### Environment Variables Check

```bash
# Required variables in .env.local:
grep -E "VERCEL_ACCESS_TOKEN|GITHUB_TOKEN|GITHUB_PROJECT_ID|SUPABASE|OPENAI_API_KEY" .env.local
```

Expected output should show values for:
- `VERCEL_ACCESS_TOKEN`
- `GITHUB_TOKEN`
- `GITHUB_PROJECT_ID`
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

---

## Component Testing

### 1. Dashboard Metrics API

**Test**: Verify metrics API returns real data

```bash
curl http://localhost:3001/api/dashboard/metrics | jq
```

**Expected Response**:
```json
{
  "syncedProjects": 6,
  "lastSyncTime": "2025-12-27T...",
  "totalAssets": 0,
  "recentDeployments": 20,
  "formSubmissions24h": 0
}
```

**Verify**:
- ✅ `recentDeployments` is a number (not 0 if you have Vercel deployments)
- ✅ `syncedProjects` is 6
- ✅ No error messages

**Troubleshooting**:
- If `recentDeployments: 0`, check `VERCEL_ACCESS_TOKEN` is set
- If error, check API logs in terminal running `npm run dev`

---

### 2. Deployment Status

**Test**: Check Vercel deployments API

```bash
curl http://localhost:3001/api/dashboard/deployments | jq '.[0:3]'
```

**Expected Response** (array of deployments):
```json
[
  {
    "id": "dpl_xxx",
    "name": "act-regenerative-studio",
    "status": "READY",
    "createdAt": "2025-12-27T...",
    "url": "https://act-regenerative-studio.vercel.app"
  }
]
```

**Verify**:
- ✅ Array has items (not empty)
- ✅ Status shows "READY", "BUILDING", or "ERROR"
- ✅ Timestamps are recent

**Troubleshooting**:
- Empty array → Check Vercel token is valid
- 401 error → Token expired or invalid
- 404 error → Personal account access issue

---

### 3. Site Health Checks

**Test**: Check all 6 project health statuses

```bash
curl http://localhost:3001/api/dashboard/projects | jq '.[] | {name, health, lastDeployed}'
```

**Expected Response**:
```json
{
  "name": "Empathy Ledger",
  "health": "healthy",
  "lastDeployed": "2025-12-27T..."
}
```

**Verify**:
- ✅ All 6 projects returned
- ✅ Health status: "healthy" | "degraded" | "down"
- ✅ Last deployed timestamps present

**Troubleshooting**:
- All sites "down" → Network issue or sites actually offline
- Missing `lastDeployed` → Vercel API not returning deployment data

---

### 4. Sprint Progress

**Test**: Verify GitHub Projects integration

```bash
curl http://localhost:3001/api/dashboard/sprint | jq
```

**Expected Response**:
```json
{
  "totalIssues": 100,
  "todoIssues": 50,
  "inProgressIssues": 20,
  "doneIssues": 30,
  "completionPercentage": 30
}
```

**Verify**:
- ✅ `totalIssues` > 0 (if you have issues in project)
- ✅ Percentages add up correctly
- ✅ Status counts match GitHub Project view

**Troubleshooting**:
- All issues show as "Todo" → Check Status field is populated in GitHub
- `totalIssues: 0` → Check `GITHUB_PROJECT_ID` is correct
- 401 error → `GITHUB_TOKEN` missing or invalid

---

### 5. Sprint Snapshot Script

**Test**: Run snapshot script manually

```bash
node scripts/snapshot-sprint-metrics.mjs
```

**Expected Output**:
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

**Verify**:
- ✅ Issues found matches your Sprint 4 count
- ✅ Status counts match GitHub Project
- ✅ "Snapshot stored in Supabase" appears
- ✅ No error messages

**Troubleshooting**:
- "Found 0 issues" → Check `CURRENT_SPRINT` env var matches exactly ("Sprint 4")
- Supabase error → Check `SUPABASE_SERVICE_ROLE_KEY` is set
- GraphQL error → Check `GITHUB_TOKEN` has project read permissions

---

### 6. Velocity Chart Data

**Test**: Check velocity API (requires snapshot data)

```bash
curl http://localhost:3001/api/dashboard/velocity | jq
```

**Expected Response** (after running snapshot):
```json
{
  "sprints": [
    {"sprintName": "Sprint 4", "velocity": 7}
  ],
  "averageVelocity": 7
}
```

**Verify**:
- ✅ Sprints array has data (empty if no snapshots yet)
- ✅ Average velocity calculated correctly

**Troubleshooting**:
- Empty sprints array → Run snapshot script at least once
- No average → Need completed sprints in Supabase

---

### 7. Burndown Chart Data

**Test**: Check burndown API

```bash
curl http://localhost:3001/api/dashboard/burndown | jq
```

**Expected Response**:
```json
{
  "sprintName": "Sprint 4",
  "startDate": "2025-12-16",
  "endDate": "2025-12-27",
  "dailySnapshots": [
    {"date": "2025-12-27", "remaining": 8, "ideal": 7}
  ],
  "projectedCompletion": "on-track"
}
```

**Verify**:
- ✅ Daily snapshots array populated
- ✅ Projection calculated ("on-track" | "ahead" | "behind")

**Troubleshooting**:
- Empty snapshots → Run snapshot script daily for multiple days
- No projection → Need at least 2 data points

---

### 8. Health Matrix

**Test**: Check comprehensive health matrix

```bash
curl http://localhost:3001/api/dashboard/health-matrix | jq
```

**Expected Response**:
```json
{
  "matrix": [
    {
      "project": "Empathy Ledger",
      "indicators": {
        "deployment": {"status": "healthy", "age": 2},
        "http": {"status": "healthy"},
        "database": {"status": "healthy"},
        "registry": {"status": "healthy"}
      },
      "overallHealth": "healthy"
    }
  ],
  "summary": {
    "totalProjects": 6,
    "healthyProjects": 5,
    "degradedProjects": 1,
    "downProjects": 0
  }
}
```

**Verify**:
- ✅ All 6 projects in matrix
- ✅ All 4 indicators present per project
- ✅ Summary counts add up

---

### 9. Dashboard UI

**Test**: Visual inspection of dashboard

1. Open browser: http://localhost:3001/admin/dashboard

**Verify Sections**:

**Metrics Cards**:
- ✅ Synced Projects: 6
- ✅ Recent Deployments: (number)
- ✅ Form Submissions (24h): (number)

**Sprint Progress**:
- ✅ Shows total/todo/in-progress/done counts
- ✅ Progress bar displays
- ✅ Percentage calculated correctly

**Velocity Chart** (may be empty initially):
- ✅ Component renders
- ✅ Shows "No velocity data yet" if empty
- ✅ Shows bars + average line if data exists

**Burndown Chart** (may be empty initially):
- ✅ Component renders
- ✅ Shows empty state if no data
- ✅ Shows ideal vs actual lines if data exists

**Health Matrix**:
- ✅ All 6 projects listed
- ✅ 4 columns: Deployment, HTTP, Database, Registry
- ✅ Status indicators show colors (green/yellow/red)

**Troubleshooting**:
- Components not rendering → Check browser console for errors
- Empty charts → Run snapshot script to populate data
- API errors → Check terminal logs for `npm run dev`

---

### 10. GitHub Action (Optional)

**Test**: Manual workflow run

1. Go to GitHub repo → Actions tab
2. Click "Sprint Snapshot" workflow
3. Click "Run workflow" → "Run workflow"
4. Wait for completion (~30 seconds)

**Expected**:
- ✅ Green checkmark after ~30 seconds
- ✅ Logs show "Sprint snapshot completed successfully"
- ✅ Supabase `sprint_snapshots` table has new row

**Verify in Supabase**:
```sql
SELECT * FROM sprint_snapshots
ORDER BY snapshot_date DESC
LIMIT 1;
```

**Troubleshooting**:
- Red X → Check GitHub Action logs for error
- "Resource not accessible" → Check `GH_PROJECT_TOKEN` secret
- "Invalid API key" → Check `SUPABASE_SERVICE_ROLE_KEY` secret

---

### 11. Claude Code Skill

**Test**: Skill invocation (requires Claude Code CLI)

```bash
# From VS Code or Claude Code CLI
/sprint-workflow today
```

**Expected Behavior**:
- ✅ Fetches yesterday's commits
- ✅ Shows today's assigned issues
- ✅ Displays sprint progress
- ✅ Lists recent deployments

**Verify Files Exist**:
```bash
ls -la .claude/skills/act-sprint-workflow/
```

Should show:
- `SKILL.md` (~430 lines)
- `README.md`
- `QUICK-REFERENCE.md`

**Troubleshooting**:
- Skill not found → Check `.claude/skills/act-sprint-workflow/SKILL.md` exists
- API errors → Same as dashboard API troubleshooting above

---

## Integration Testing

### Full Flow Test

Test the complete workflow end-to-end:

1. **Create Test Issue**:
   ```bash
   gh issue create \
     --repo Acurioustractor/act-regenerative-studio \
     --title "[TEST] Sprint workflow integration test" \
     --body "Testing sprint workflow system"
   ```

2. **Add to Project**:
   - Manually add issue to GitHub Project
   - Set Sprint = "Sprint 4"
   - Set Status = "Todo"

3. **Run Snapshot**:
   ```bash
   node scripts/snapshot-sprint-metrics.mjs
   ```

4. **Verify Dashboard**:
   - Refresh http://localhost:3001/admin/dashboard
   - Check Sprint Progress shows +1 issue

5. **Update Issue**:
   - Change Status to "Done" in GitHub
   - Run snapshot again

6. **Verify Charts**:
   - Check velocity chart (if sprint marked complete)
   - Check burndown chart (shows remaining decreased)

7. **Clean Up**:
   ```bash
   gh issue close <issue-number> --repo Acurioustractor/act-regenerative-studio
   ```

---

## Performance Benchmarks

Expected response times:

| Endpoint | Target | Acceptable |
|----------|--------|------------|
| `/api/dashboard/metrics` | < 500ms | < 2s |
| `/api/dashboard/deployments` | < 300ms | < 1s |
| `/api/dashboard/projects` | < 2s | < 5s |
| `/api/dashboard/sprint` | < 500ms | < 2s |
| `/api/dashboard/velocity` | < 200ms | < 1s |
| `/api/dashboard/burndown` | < 300ms | < 1s |
| `/api/dashboard/health-matrix` | < 3s | < 8s |
| Dashboard page load | < 3s | < 5s |

**Test Response Times**:
```bash
time curl http://localhost:3001/api/dashboard/metrics
```

---

## Common Issues & Fixes

### Issue: Dashboard shows all zeros
**Cause**: Environment variables not set
**Fix**: Check `.env.local` has all required variables

### Issue: Sprint snapshot finds 0 issues
**Cause**: Sprint name mismatch
**Fix**: Ensure `CURRENT_SPRINT` matches exactly (case-sensitive)

### Issue: Vercel deployments empty
**Cause**: Invalid or missing token
**Fix**: Regenerate Vercel access token

### Issue: Charts show empty state
**Cause**: No historical data
**Fix**: Run snapshot script daily for multiple days

### Issue: GitHub Action fails
**Cause**: Missing or incorrect secrets
**Fix**: Verify all 4 secrets configured correctly

---

## Success Criteria

All systems operational when:

- ✅ Dashboard loads in < 3 seconds
- ✅ All 6 projects show health status
- ✅ Sprint progress displays real GitHub data
- ✅ Snapshot script runs without errors
- ✅ Supabase table receives daily snapshots
- ✅ Charts populate after 2+ days of snapshots
- ✅ GitHub Action runs successfully on schedule
- ✅ Claude Code skill responds to commands

---

## Next Steps

Once all tests pass:
1. Set up GitHub Action schedule (daily 5 PM)
2. Run snapshot manually for 3-5 days to populate charts
3. Train team on dashboard usage
4. Document any custom workflows

---

**Related**:
- Sprint Snapshot Guide: [SPRINT_SNAPSHOT_GUIDE.md](./SPRINT_SNAPSHOT_GUIDE.md)
- GitHub Secrets Setup: [GITHUB_SECRETS_SETUP.md](./GITHUB_SECRETS_SETUP.md)
- Dashboard: `/admin/dashboard`
- Scripts: `/scripts/snapshot-sprint-metrics.mjs`
