# Quick Start: Setting Up Sprint Workflow

## Current Status

✅ **GitHub Secrets**: Configured
✅ **Snapshot Script**: Working
✅ **Supabase**: Connected
⚠️  **Sprint Values**: Not yet assigned to issues

## Next Steps

### Step 1: Create Sprint Values in GitHub Project

1. Go to your GitHub Project: https://github.com/users/Acurioustractor/projects/1
2. Click the Sprint field dropdown on any issue
3. Create sprint options:
   - "Sprint 4" (current)
   - "Sprint 5" (next)
   - "Backlog" (unscheduled)

### Step 2: Assign Issues to Sprint 4

Select 10-15 issues you're currently working on and set their Sprint field to "Sprint 4"

### Step 3: Run Snapshot Again

```bash
./scripts/run-snapshot.sh
```

Expected output:
```
🔍 Found 15 issues in Sprint 4
  Total: 15
  Todo: 8
  In Progress: 3
  Done: 4
  ✅ Snapshot stored in Supabase
```

### Step 4: Check Dashboard

Open: http://localhost:3001/admin/dashboard

You should now see:
- Sprint progress bar with real data
- Velocity chart (after a few days)
- Burndown chart showing your sprint

## For Now: Test with Existing Data

Even without Sprint values, you can test the dashboard:

1. Start dev server:
   ```bash
   npm run dev
   ```

2. Open dashboard:
   ```
   http://localhost:3001/admin/dashboard
   ```

3. You'll see:
   - ✅ Deployments (20 from Vercel)
   - ✅ Health matrix (all 6 projects)
   - ⚠️  Sprint progress (0 issues until Sprint field is set)
   - ⚠️  Charts (empty until snapshots have data)

## Automated Daily Snapshots

Once you have Sprint values assigned:

1. GitHub Action will run daily at 5 PM UTC
2. Captures progress automatically
3. Populates velocity and burndown charts
4. No manual work needed!

## Alternative: Use Your Own Sprint Names

If you prefer different sprint names (e.g., "Week 1", "January 2025"):

1. Update `CURRENT_SPRINT` in `.env.local`:
   ```
   CURRENT_SPRINT="Week 1"
   ```

2. Create matching value in GitHub Project Sprint field

3. Run snapshot script

---

**Need Help?**
- Full documentation: [SPRINT_WORKFLOW_SYSTEM.md](./SPRINT_WORKFLOW_SYSTEM.md)
- Testing guide: [TESTING_VERIFICATION_GUIDE.md](./TESTING_VERIFICATION_GUIDE.md)
