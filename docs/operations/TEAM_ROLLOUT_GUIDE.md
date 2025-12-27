# Sprint Workflow System - Team Rollout Guide

## Overview

This guide walks you through introducing the sprint workflow system to your team (or for solo use). It covers onboarding, training, and establishing daily workflows.

---

## Pre-Rollout Checklist

Before introducing the system:

- [ ] All tests passing (see [TESTING_VERIFICATION_GUIDE.md](./TESTING_VERIFICATION_GUIDE.md))
- [ ] GitHub Action running successfully for 3+ days
- [ ] Dashboard shows real data (deployments, sprint progress, health)
- [ ] Charts populated with at least 2-3 data points
- [ ] Claude Code skill tested and working
- [ ] Documentation reviewed and accessible

---

## Rollout Timeline

### Solo Developer (You)

**Week 1**: Personal adoption
- Day 1-2: Daily dashboard checks in morning
- Day 3-5: Use `/sprint-workflow today` command each morning
- Day 6-7: Practice sprint planning with `/sprint-workflow plan`

**Week 2**: Workflow refinement
- Evaluate what's working
- Adjust snapshot timing if needed
- Document personal best practices

### Future Team Growth

**Week 1**: Soft launch (2-3 developers)
- Share dashboard URL
- Demo basic features
- Gather feedback

**Week 2**: Full team rollout
- 30-minute training session
- Distribute documentation
- Set team norms

**Week 3**: Notion integration demo
- Show how issues sync
- Demonstrate sprint tracking
- Review milestone roadmap

**Week 4**: Continuous improvement
- Weekly check-in on usage
- Iterate based on feedback
- Add custom views as needed

---

## Training Materials

### Quick Start (5 minutes)

**For Solo Use**:

1. **Morning Routine**:
   ```bash
   # Open VS Code
   # Run standup command
   /sprint-workflow today
   ```

   This shows:
   - What you completed yesterday
   - What's assigned to you today
   - Sprint progress percentage
   - Any blockers

2. **Check Dashboard**:
   - Open: http://localhost:3001/admin/dashboard
   - Review: System health, deployment status, sprint progress

3. **Start Work**:
   - Pick top priority issue from standup report
   - Move to "In Progress" in GitHub Project
   - Start coding

**For Teams**:

1. **Daily Standup** (async):
   - Each developer runs `/sprint-workflow today`
   - Posts summary to Slack/Discord
   - Team has visibility without meetings

2. **Sprint Planning** (weekly):
   - Product Owner runs `/sprint-workflow plan`
   - Reviews velocity recommendations
   - Team discusses and assigns issues

3. **Health Monitoring** (before deploys):
   - Run `/sprint-workflow health`
   - Verify all systems green
   - Deploy with confidence

---

### Detailed Walkthrough (30 minutes)

**Agenda**:

1. **Introduction** (5 min)
   - Why we built this
   - What problems it solves
   - Expected time savings

2. **Dashboard Tour** (10 min)
   - Navigate to `/admin/dashboard`
   - Explain each section:
     - **Metrics Cards**: Quick stats at a glance
     - **Sprint Progress**: Current sprint health
     - **Velocity Chart**: Historical performance
     - **Burndown Chart**: Sprint projection
     - **Health Matrix**: All 6 projects status
     - **Recent Deployments**: Latest production changes

3. **Claude Code Skill Demo** (10 min)
   - Show 4 capabilities:
     - `/sprint-workflow today` - Daily standup
     - `/sprint-workflow plan` - Sprint planning
     - `/sprint-workflow health` - Health check
     - `/sprint-workflow create [title]` - Quick issue creation

4. **Q&A** (5 min)

---

## Daily Workflows

### Morning Routine (10 minutes)

**Solo Developer**:
```bash
# 1. Open VS Code in ACT Studio workspace
code /Users/benknight/Code/ACT\ Farm\ and\ Regenerative\ Innovation\ Studio/

# 2. Run standup command
/sprint-workflow today
```

**Expected Output**:
```
☀️ Daily Standup - December 27, 2025

🎯 Sprint 4 Progress: 67% (10/15 issues done)

✅ Yesterday (Dec 26):
  - Fixed #33: Add velocity chart component
  - Committed 4 times across act-regenerative-studio

📝 Today's Focus (3 issues assigned):
  #42 [In Progress] - Health matrix component
  #45 [Todo] - Webhook signature verification 🔴 Critical

📦 Recent Deployments (24h):
  ✅ act-regenerative-studio - 2 hours ago

⚠️  Blockers: None

🚀 Ready to start on #42 or #45?
```

**Actions**:
- Review what you completed yesterday
- Pick highest priority issue for today
- Note any blockers

**Team Version**:
- Each developer runs command
- Posts output to team chat
- Product Owner reviews for blockers

---

### Sprint Planning (Monday, 30 minutes)

**Solo Developer**:
```bash
/sprint-workflow plan
```

**Expected Output**:
```
📊 Sprint Planning for Sprint 5

Historical Velocity:
  Sprint 2: 12 issues
  Sprint 3: 10 issues
  Sprint 4: 11 issues
  → Average: 11 issues/sprint

📋 Backlog Analysis:
  Total: 47 issues
  Critical: 2
  High: 12

🎯 Recommended for Sprint 5 (11 issues):
  [Shows top issues by priority]

Breakdown:
  By Type: Enhancement: 7, Bug: 2, Task: 2
  By Project: Empathy Ledger: 3, ACT Studio: 5, ...

Assign these 11 issues to Sprint 5? (y/n)
```

**Actions**:
- Review recommended issues
- Adjust based on priorities
- Assign to current sprint
- Set sprint goal in Notion

**Team Version**:
- Product Owner runs command
- Team reviews recommendations together
- Discuss capacity and dependencies
- Commit to sprint goal

---

### Pre-Deployment Health Check (5 minutes)

**Before ANY production deploy**:
```bash
/sprint-workflow health
```

**Expected Output**:
```
🏥 System Health Check - All ACT Projects

┌─────────────────┬────────────┬──────┬──────────┬──────────┐
│ Project         │ Deployment │ HTTP │ Database │ Registry │
├─────────────────┼────────────┼──────┼──────────┼──────────┤
│ Empathy Ledger  │ ✅ 2h      │ ✅   │ ✅       │ ⚠️       │
│ JusticeHub      │ ✅ 4h      │ ✅   │ ✅       │ N/A      │
│ ...             │ ...        │ ...  │ ...      │ ...      │
└─────────────────┴────────────┴──────┴──────────┴──────────┘

🏆 Overall: 5/6 systems healthy (83%)
```

**Actions**:
- Only deploy if all systems green
- Investigate any warnings first
- Check Vercel logs if degraded

---

### Issue Creation (2 minutes)

**Fast issue creation with auto-fields**:
```bash
/sprint-workflow create Add email notifications for form submissions
```

**Expected Output**:
```
🎯 Creating Issue...

Detected:
  Title: "Add email notifications for form submissions"
  Type: Enhancement (detected from "Add")
  ACT Project: The Harvest (from current directory)
  Priority: Medium (default)
  Effort: M (medium complexity)
  Sprint: Sprint 4 (current)

✅ Issue Created: #67
   URL: https://github.com/Acurioustractor/harvest-community-hub/issues/67
```

**Saves time**:
- No manual field selection
- Auto-assigned to project
- Synced to Notion immediately

---

## Best Practices

### For Solo Developers

**Daily**:
- ✅ Run `/sprint-workflow today` each morning
- ✅ Check dashboard at start of day
- ✅ Use quick issue creation for ad-hoc tasks
- ✅ Commit with descriptive messages ("Fixes #45: ...")

**Weekly**:
- ✅ Run `/sprint-workflow plan` on Mondays
- ✅ Review velocity trends
- ✅ Adjust capacity based on reality

**Before Deploys**:
- ✅ Always run `/sprint-workflow health`
- ✅ Check dashboard health matrix
- ✅ Verify no recent deployment failures

### For Teams

**Communication**:
- ✅ Post standup output to team chat daily
- ✅ Tag blockers for immediate attention
- ✅ Celebrate sprint completion in team channel

**Sprint Ceremonies**:
- ✅ Sprint Planning: Use velocity data for realistic commitments
- ✅ Daily Standups: Replace with async standup command
- ✅ Sprint Review: Reference dashboard charts in demo
- ✅ Sprint Retro: Review burndown for process improvements

**Project Hygiene**:
- ✅ Keep GitHub Project fields updated
- ✅ Close issues promptly
- ✅ Use consistent sprint naming (Sprint 4, Sprint 5, etc.)
- ✅ Mark sprints complete when done

---

## Common Questions

### Q: How do I know if the daily snapshot is running?

**A**: Check GitHub Actions:
1. Go to repo → Actions tab
2. Look for "Sprint Snapshot" workflow
3. Should show green checkmark daily at 5 PM UTC

Or check Supabase:
```sql
SELECT snapshot_date, total_issues, completion_percentage
FROM sprint_snapshots
WHERE sprint_name = 'Sprint 4'
ORDER BY snapshot_date DESC
LIMIT 7;
```

Should show 1 row per day.

---

### Q: What if velocity chart is empty?

**A**: You need:
1. At least 1 completed sprint with snapshots
2. Sprint marked as complete in Supabase:
   ```sql
   UPDATE sprint_snapshots
   SET is_sprint_complete = true
   WHERE sprint_name = 'Sprint 4';
   ```
3. Refresh dashboard

---

### Q: How do I start a new sprint?

**A**:
1. In GitHub Project, change current issues Sprint to "Sprint 5"
2. Update workflow file:
   ```yaml
   # .github/workflows/snapshot-sprint.yml
   CURRENT_SPRINT: 'Sprint 5'
   ```
3. Commit and push
4. Run snapshot manually to create first data point:
   ```bash
   CURRENT_SPRINT="Sprint 5" node scripts/snapshot-sprint-metrics.mjs
   ```

---

### Q: Can I customize the standup output?

**A**: Yes! Edit `.claude/skills/act-sprint-workflow/SKILL.md`:
- Modify the `/sprint-workflow today` section
- Change output format
- Add/remove sections
- Customize for your workflow

---

### Q: What if a deploy fails health check?

**A**:
1. Check which indicator is red (Deployment, HTTP, Database, Registry)
2. **Deployment**: Check Vercel logs for build errors
3. **HTTP**: Check site URL directly, review server logs
4. **Database**: Check Supabase dashboard for connection issues
5. **Registry**: Check sync script logs
6. Fix issue before deploying

---

### Q: How do I track multiple sprints across projects?

**A**:
- GitHub Project supports multi-repo issues
- Use "ACT Project" field to filter by project
- Dashboard shows unified view across all 6 projects
- Notion can show per-project sprint views

---

## Success Metrics

Track these metrics to measure system effectiveness:

**Time Savings**:
- Sprint planning time: Target < 30 min (down from 1-2 hours)
- Daily standup time: Target < 5 min (down from 15 min)
- Issue creation time: Target < 2 min (down from 5 min)
- Health checks: Target < 5 min (down from 10 min)

**Sprint Health**:
- Sprint completion rate: Target > 80%
- Velocity variance: Target ±10% between sprints
- On-time milestone delivery: Target > 70%
- Zero unnoticed outages: Target 100%

**Team Adoption** (if/when team grows):
- Daily standup participation: Target 100%
- Dashboard views per week: Target 5+ per developer
- Claude skill usage: Target 3+ commands per day
- GitHub Project hygiene: Target 90%+ fields populated

---

## Troubleshooting

### "Can't find the dashboard"
- **URL**: http://localhost:3001/admin/dashboard
- **Check**: Development server running (`npm run dev`)

### "Skill commands not working"
- **Check**: `.claude/skills/act-sprint-workflow/SKILL.md` exists
- **Reload**: VS Code window (Cmd+Shift+P → Reload Window)

### "Snapshot script fails"
- **Check**: Environment variables in `.env.local`
- **Run**: `node scripts/snapshot-sprint-metrics.mjs` with verbose errors

### "Charts not updating"
- **Check**: GitHub Action running daily
- **Verify**: Supabase has new snapshots
- **Refresh**: Browser cache (Cmd+Shift+R)

---

## Next Steps After Rollout

**Week 1-2**: Monitor adoption
- Track dashboard usage
- Gather feedback on skill commands
- Note any pain points

**Week 3-4**: Iterate
- Adjust snapshot timing if needed
- Customize dashboard views
- Add project-specific metrics

**Month 2+**: Expand
- Add more sprint analytics
- Integrate with other tools (Slack, Figma, etc.)
- Build custom reports

---

## Resources

**Documentation**:
- Quick Start: [QUICK_START_TEAM_WORKFLOW.md](./QUICK_START_TEAM_WORKFLOW.md)
- Testing Guide: [TESTING_VERIFICATION_GUIDE.md](./TESTING_VERIFICATION_GUIDE.md)
- Sprint Snapshots: [SPRINT_SNAPSHOT_GUIDE.md](./SPRINT_SNAPSHOT_GUIDE.md)
- Claude Skill: `.claude/skills/act-sprint-workflow/README.md`

**Dashboards**:
- Main: http://localhost:3001/admin/dashboard
- Notion: Your Issues database

**Support**:
- GitHub Issues: For bugs and feature requests
- Documentation: `/docs/operations/`

---

**Last Updated**: 2025-12-27
**Status**: Ready for rollout
**Next Review**: After 1 week of daily use
