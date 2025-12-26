# 🎯 Milestone System - Implementation Guide

**Time**: 30-40 minutes total
**Result**: Fully automated milestone + date management integrated with Claude Code

---

## 📋 What You'll Get

After completing this guide:

✅ **8 Milestones** created across all repos
✅ **149 issues** auto-assigned to correct milestones
✅ **Due Dates** auto-set based on milestone + priority
✅ **Start Dates** auto-set for urgent work
✅ **New issues** automatically get milestone + dates
✅ **Claude Code** can reference milestone context when you work

---

## 🚀 Implementation Steps

### Step 1: Create Milestones in GitHub (10 min - MANUAL)

**Why manual?** GitHub API doesn't support milestone creation.

**Instructions**: See [scripts/CREATE_MILESTONES.md](../../scripts/CREATE_MILESTONES.md)

**Quick summary**:
- Go to each repo → Issues → Milestones → New Milestone
- Copy-paste exact titles and dates from guide
- 8 milestones total across 5 repos

**Repos and their milestones**:
- **empathy-ledger-v2**: 5 milestones
- **act-regenerative-studio**: 3 milestones
- **goods-asset-tracker**: 2 milestones
- **justicehub-platform**: 2 milestones
- **the-harvest-website**: 1 milestone

---

### Step 2: Assign Milestones to All Issues (15 min - AUTOMATED)

**Script**: `scripts/assign-milestones.js`

```bash
cd "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio"

export GH_PROJECT_TOKEN=your_github_token_here

node scripts/assign-milestones.js
```

**What it does**:
1. Reads all 149 issues across all repos
2. Analyzes Type, ACT Project, and Priority
3. Applies milestone assignment rules
4. Assigns each issue to correct milestone
5. Shows progress for each issue

**Assignment Rules**:
- **Type = Security or Bug** → "Security Hardening"
- **Type = Data** → "Data Architecture Complete"
- **Type = Enhancement + ACT Project = Empathy Ledger** → "Empathy Ledger Core"
- **ACT Project = Goods** → "Goods Asset Register MVP"
- **Type = Integration** → "Integration Platform"
- **ACT Project = JusticeHub** → "JusticeHub Alpha"
- **Type = Testing** → "Testing & Quality"
- **ACT Project = The Harvest** → "The Harvest Website"

**Expected output**:
```
📦 Processing: empathy-ledger-v2
   #127: Check if enough time has passed to retry
      Milestone: Empathy Ledger Core
      Due: 2025-02-28
      ✅ Assigned milestone

   #34: Security vulnerability in auth flow
      Milestone: Security Hardening
      Due: 2025-01-31
      Start: 2025-12-26
      ✅ Assigned milestone

... (continues for all 149 issues)

Summary:
  Total issues processed: 149
  Milestones assigned: 149
  Errors: 0
```

---

### Step 3: Sync Due Dates & Start Dates (10 min - AUTOMATED)

**Script**: `scripts/sync-milestone-dates.js`

```bash
cd "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio"

export GH_PROJECT_TOKEN=your_github_token_here

node scripts/sync-milestone-dates.js
```

**What it does**:
1. Reads all project items
2. Gets milestone for each issue
3. Calculates Due Date based on:
   - Milestone due date
   - Issue priority
4. Calculates Start Date based on:
   - Milestone type
   - Issue priority
5. Sets both date fields in GitHub Project

**Due Date Logic**:
- **Critical**: Due on milestone date (urgent!)
- **High**: Due 1 week before milestone (buffer)
- **Medium**: Due 2 weeks before milestone
- **Low**: Due on milestone date

**Start Date Logic**:
- **Security/Critical**: Start today (immediate)
- **Data**: Start 2 weeks before due date (planned)
- **Enhancement**: Start when added to Sprint (not set yet)

**Expected output**:
```
📅 Syncing dates...

empathy-ledger-v2#34: Security vulnerability in auth flow
   Milestone: Security Hardening | Priority: Critical
   ✅ Due Date: 2025-01-31
   ✅ Start Date: 2025-12-26

empathy-ledger-v2#127: Check if enough time has passed
   Milestone: Empathy Ledger Core | Priority: Low
   ✅ Due Date: 2025-02-28
   ⏸️  Start Date: Not set (starts when added to Sprint)

... (continues for all issues)

Summary:
  Total items: 149
  Due Dates set: 149
  Start Dates set: 17 (Security + Data issues)
  Errors: 0
```

---

### Step 4: Verify in GitHub Project (5 min - MANUAL)

**Check**:
1. Go to: https://github.com/users/Acurioustractor/projects/1
2. Look at any issue
3. Verify it has:
   - ✅ Milestone assigned
   - ✅ Due Date set
   - ✅ Start Date set (if Security/Data)

**Create quick view**:
- Filter: Milestone = "Security Hardening"
- Sort by: Due Date
- Should show 5 Security issues + 12 Bugs

---

### Step 5: Test New Issue Creation (5 min - MANUAL)

**Create a test issue** to verify automation works:

```bash
# Test in empathy-ledger-v2 repo
gh issue create \
  --repo Acurioustractor/empathy-ledger-v2 \
  --title "Test milestone automation" \
  --body "Testing that milestones auto-assign for new issues"
```

**Expected auto-assignment**:
- ✅ Added to project
- ✅ ACT Project = "Empathy Ledger"
- ✅ Type = "Enhancement"
- ✅ Priority = "Low"
- ✅ Effort = "1h"
- ✅ Sprint = "Backlog"
- ✅ **Milestone = "Empathy Ledger Core"** ← NEW!
- ✅ LCAA Phase = "Action"

**Then close the test issue**:
```bash
gh issue close <issue-number> --repo Acurioustractor/empathy-ledger-v2
```

---

## 🎯 How It Works with Claude Code

### Scenario 1: You're Working in VS Code

```bash
# You open an issue in VS Code
claude "Show me details for issue #34"
```

**Claude reads from GitHub**:
```
Issue #34: Security vulnerability in auth flow

Milestone: Security Hardening (Due: 2025-01-31)
Priority: Critical
Due Date: 2025-01-31 (5 days away!)
Start Date: Today
Type: Security
Effort: 3h

This is URGENT - milestone deadline is in 5 days!
```

**Claude knows**:
- This is critical security work
- Due very soon
- Work efficiently
- Link fix to milestone

---

### Scenario 2: You Create an Issue via Claude

```bash
# You find a bug while coding
claude "Create issue: SQL injection in search endpoint - critical security bug"
```

**Auto-detection**:
- Title contains "SQL injection" → Type: Security
- Title contains "critical" → Priority: Critical

**Auto-assignment** (within 30 seconds):
- Type: Security ✅
- Priority: Critical ✅
- Milestone: Security Hardening ✅
- Due Date: 2025-01-31 ✅
- Start Date: Today ✅
- Sprint: Sprint 4 (Critical → current) ✅

**Claude can then**:
```bash
claude "Let's fix this security issue now"
# Claude knows it's urgent and helps you fix it immediately
```

---

### Scenario 3: You Ask About Milestone Progress

```bash
claude "How many issues are left in Security Hardening milestone?"
```

**Claude queries GitHub**:
```
Security Hardening Milestone (Due: 2025-01-31 - 5 days!)

Total: 17 issues
  ✅ Done: 1
  🔄 In Progress: 0
  📋 Todo: 16

Breakdown by Type:
  Security: 5 issues
  Bug: 12 issues

Estimated effort remaining: ~2.5 days

Status: ⚠️ AT RISK - Need to focus 100% this week!
```

---

## 📊 Milestone Overview

### Current Setup (After Implementation)

| Milestone | Due Date | Issues | Primary Type | Status |
|-----------|----------|--------|--------------|--------|
| **Security Hardening** | 2025-01-31 | 17 | Security, Bug | 🔴 URGENT |
| **Data Architecture** | 2025-02-15 | 11 | Data | 🟡 Planned |
| **Empathy Ledger Core** | 2025-02-28 | ~40 | Enhancement | 🟢 On Track |
| **Goods MVP** | 2025-03-15 | 6 | Testing, Feature | 🟢 On Track |
| **Integration Platform** | 2025-03-31 | 29 | Integration | 🟢 On Track |
| **JusticeHub Alpha** | 2025-04-30 | 5 | Feature, Security | 🟢 On Track |
| **The Harvest Website** | 2025-05-15 | 1 | Bug | 🟢 On Track |
| **Testing & Quality** | 2025-06-30 | 7 | Testing | 🟢 On Track |

---

## 🔄 Daily Workflow

### Monday Morning: Milestone Planning

```bash
claude "What should I focus on this week?"
```

**Claude suggests**:
```
Based on milestones and due dates:

🔴 URGENT (Due in 5 days):
  Security Hardening: 16 issues remaining
  → Recommend: Focus 100% on security this week

🟡 SOON (Due in 19 days):
  Data Architecture: 11 issues
  → Start planning migrations this week

🟢 ON TRACK:
  Empathy Ledger Core: 40 issues
  → Continue normal sprint work
```

---

### During Development

```bash
# You're coding and reference an issue
claude "Let's work on #34"
```

**Claude sees**:
- Milestone: Security Hardening
- Due: 5 days
- Priority: Critical

**Claude helps you**:
- Work efficiently (knows it's urgent)
- Write tests (security requirement)
- Create PR with proper commit message
- Link to milestone in commit

---

### Friday: Milestone Review

```bash
claude "Show Security Hardening progress"
```

**Claude reports**:
```
Security Hardening (Due: Jan 31)

This week:
  ✅ Completed: 1 issue (#150 - auth bypass)
  🔄 In Progress: 1 issue (#34 - auth vulnerability)

Remaining: 15 issues
Days left: 2 days

Velocity: 0.5 issues/day
Needed velocity: 7.5 issues/day

Status: 🔴 CRITICAL - Milestone at risk!
Recommendation: Request help or extend deadline
```

---

## 🎨 Recommended Project Views

Create these views in GitHub Project:

### 1. Milestone Roadmap

**Type**: Roadmap view
**Group by**: Milestone
**X-axis**: Time (Start Date → Due Date)
**Shows**: Visual timeline of all milestones

**Use**: High-level planning, see overlaps

---

### 2. Current Milestone

**Type**: Board
**Filter**: `Milestone = "Security Hardening"`
**Group by**: Status (Todo, In Progress, Done)
**Sort by**: Priority

**Use**: Daily standup, sprint work

---

### 3. Upcoming Deadlines

**Type**: Table
**Filter**: `Status != "Done"`
**Sort by**: Due Date (ascending)
**Columns**: Title, Milestone, Due Date, Priority, Effort

**Use**: Prevent missed deadlines

---

### 4. By Milestone Progress

**Type**: Table
**Group by**: Milestone
**Columns**: Title, Status, Due Date, Start Date, Priority
**Sort by**: Milestone Due Date

**Use**: Weekly milestone review

---

## 🔧 Troubleshooting

### Issue: Milestone not assigned

**Problem**: Script says "Milestone not found in repo"

**Solution**: You forgot to create that milestone in that repo
- Check [scripts/CREATE_MILESTONES.md](../../scripts/CREATE_MILESTONES.md)
- Create the missing milestone
- Re-run `node scripts/assign-milestones.js`

---

### Issue: Due Date not set

**Problem**: Due Date field empty in project

**Solution**: Run the date sync script
```bash
node scripts/sync-milestone-dates.js
```

---

### Issue: New issue doesn't get milestone

**Problem**: Created issue but milestone wasn't auto-assigned

**Check**:
1. Wait 30 seconds (workflow takes time to run)
2. Check if milestone exists in that repo
3. Check GitHub Actions logs for errors
4. Verify GH_PROJECT_TOKEN secret is set

---

### Issue: Wrong milestone assigned

**Problem**: Issue assigned to wrong milestone

**Fix manually**:
1. Go to issue in GitHub
2. Change milestone in sidebar
3. Workflow will update project automatically

**Or adjust rules** in:
- `.github/workflows/auto-tag-project-items.yml` (for new issues)
- `scripts/assign-milestones.js` (for bulk assignment)

---

## ✅ Success Checklist

After implementation, verify:

- [ ] All 8 milestones created in correct repos
- [ ] All 149 issues have milestones assigned
- [ ] Due Dates set for all 149 issues
- [ ] Start Dates set for Security/Data issues (17 total)
- [ ] Test issue auto-assigns milestone correctly
- [ ] Can filter by milestone in GitHub Project
- [ ] Claude can reference milestone context
- [ ] Milestone Roadmap view shows timeline

---

## 📈 Next Steps

After milestones are set up:

**Immediate**:
1. ✅ Focus on Security Hardening milestone (URGENT!)
2. ✅ Review all 17 Security/Bug issues
3. ✅ Move Critical items to Sprint 4

**This Week**:
1. Create milestone views in project
2. Start weekly milestone review habit
3. Use milestones to guide sprint planning

**Ongoing**:
1. Reference milestones when working with Claude
2. Adjust due dates if priorities change
3. Celebrate when milestones complete! 🎉

---

## 🎓 Key Learnings

### Milestones Are For

✅ Major goals (launches, releases)
✅ Grouping related work
✅ Setting deadlines
✅ Tracking progress
✅ Context for Claude Code

### Milestones Are NOT For

❌ Day-to-day task management (use Sprints)
❌ Individual developer assignments (use Assignees)
❌ Categorizing by type (use Type field)
❌ Tracking hours (use Effort field)

### The Perfect Workflow

```
Milestone → "What are we building?"
Sprint → "What are we doing this week?"
Issue → "What am I working on now?"
Claude → "Help me complete this efficiently"
```

---

**Ready to implement?**

1. Create milestones (10 min)
2. Run `node scripts/assign-milestones.js` (15 min)
3. Run `node scripts/sync-milestone-dates.js` (10 min)
4. Verify in GitHub Project (5 min)
5. Test new issue creation (5 min)

**Total**: 45 minutes to world-class milestone management! 🚀

---

**Maintained By**: ACT Ecosystem Team
**Last Updated**: 2025-12-26
**Status**: Ready to Implement
