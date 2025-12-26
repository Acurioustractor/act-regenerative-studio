# Complete Guide: Backfill & Organize Your GitHub Project

**Goal**: Tag all existing issues and create organized project views
**Time**: ~2 hours total
**Status**: Step-by-step guide

---

## Overview

You have automation working for NEW issues, but existing issues need to be:
1. Added to the GitHub Project
2. Tagged with ACT Project field
3. Optionally tagged with: Phase, Priority, Effort, Sprint

Then you'll create 13 views to organize everything.

---

## Part 1: Backfill Existing Issues (Automated)

### Step 1: Run the Bulk Add Script

This script automatically adds ALL existing open issues to your project and sets the ACT Project field.

```bash
cd "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio"

# Make sure you have dependencies
npm install @octokit/rest

# Run the script (uses your PAT token)
export GH_PROJECT_TOKEN=YOUR_CLASSIC_PAT_TOKEN_HERE
node scripts/bulk-add-to-project.js
```

**What it does**:
- Finds all open issues across all 7 ACT repos
- Adds each to "ACT Ecosystem Development" project
- Sets ACT Project field automatically based on repo
- Shows progress for each issue

**Expected output**:
```
📦 Processing: goods-asset-tracker
   ACT Project: Goods
   Found 15 open issues
   #1: Test automation...
      ✅ Added to project
      ✅ ACT Project set to: Goods
   ...

Summary:
  Total issues found: 138
  Added to project: 138
  Fields set: 138
```

**Time**: ~10-15 minutes (depends on number of issues)

---

## Part 2: Manual Tagging (Optional but Recommended)

After bulk-add, you should manually set these fields for better organization:

### Fields to Set

1. **LCAA Phase** - Which phase of methodology?
   - 🎧 Listen - Research, discovery, understanding
   - 🔍 Curiosity - Prototyping, testing, exploring
   - ⚡ Action - Building, implementing
   - 🎨 Art - Polish, storytelling, culture change

2. **Priority** - How urgent?
   - 🔴 Critical - Must do now
   - 🟠 High - Important, soon
   - 🟡 Medium - Standard priority
   - 🟢 Low - Nice to have

3. **Effort** - How long will it take?
   - 1h, 3h, 1d, 3d, 1w, 2w

4. **Sprint** - Which sprint/milestone?
   - "Sprint 4", "Q1 2025", etc.

### How to Tag

**Option A: In GitHub Project UI**

1. Go to: https://github.com/users/Acurioustractor/projects/1
2. Click on an issue
3. Set fields in right sidebar
4. Repeat for all issues

**Option B: Bulk Edit in Project**

1. Select multiple issues (Shift+Click)
2. Right-click → "Edit fields"
3. Set common values for selected items

### Recommended Tagging Strategy

**Quick pass** (~30 min):
- Set Priority for all issues (Critical/High/Medium/Low)
- Set LCAA Phase for major items

**Detailed pass** (~1 hour):
- Set Effort estimates
- Assign to Sprints
- Review and refine

**Don't overthink it!** You can always adjust later. Start with Priority and LCAA Phase.

---

## Part 3: Create 13 Project Views

Once issues are tagged, create filtered views for easy navigation.

### View 1: 🌍 Ecosystem View (Default)

1. Go to project: https://github.com/users/Acurioustractor/projects/1
2. Click "+ New view" (top right)
3. Name: `🌍 Ecosystem View`
4. Layout: **Table**
5. No filters (shows everything)
6. Columns to show:
   - Title
   - Status
   - ACT Project
   - LCAA Phase
   - Priority
   - Effort
   - Assignees

---

### View 2-7: Project-Specific Views

Create a board view for each ACT project:

**📦 Goods View**:
- Name: `📦 Goods`
- Layout: **Board**
- Filter: `ACT Project = "Goods"`
- Group by: **Status**

**📖 Empathy Ledger View**:
- Name: `📖 Empathy Ledger`
- Layout: **Board**
- Filter: `ACT Project = "Empathy Ledger"`
- Group by: **Status**

**⚖️ JusticeHub View**:
- Name: `⚖️ JusticeHub`
- Layout: **Board**
- Filter: `ACT Project = "JusticeHub"`
- Group by: **Status**

**🌾 The Harvest View**:
- Name: `🌾 The Harvest`
- Layout: **Board**
- Filter: `ACT Project = "The Harvest"`
- Group by: **Status**

**🚜 ACT Farm View**:
- Name: `🚜 ACT Farm`
- Layout: **Board**
- Filter: `ACT Project = "ACT Farm"`
- Group by: **Status**

**🗺️ ACT Placemat View**:
- Name: `🗺️ ACT Placemat`
- Layout: **Board**
- Filter: `ACT Project = "ACT Placemat"`
- Group by: **Status**

---

### View 8: 🎨 By LCAA Phase

Shows work organized by methodology phase:

- Name: `🎨 By LCAA Phase`
- Layout: **Board**
- No filter
- Group by: **LCAA Phase**

Result: 4 columns (Listen, Curiosity, Action, Art) showing how work maps to methodology

---

### View 9: 📅 Sprint Planning

Table view for sprint organization:

- Name: `📅 Sprint Planning`
- Layout: **Table**
- No filter (or filter by current sprint)
- Columns:
  - Title
  - ACT Project
  - Sprint
  - Effort
  - Priority
  - Assignees
  - Status
- Sort by: Sprint (descending)

---

### View 10: 🔥 High Priority

Focus on urgent work:

- Name: `🔥 High Priority`
- Layout: **Table**
- Filter: `Priority = "Critical" OR Priority = "High"`
- Columns:
  - Title
  - ACT Project
  - Priority
  - Effort
  - Assignees
  - Status
- Sort by: Priority (Critical first)

---

### View 11: 🆕 Good First Issues

Onboarding tasks for new contributors:

- Name: `🆕 Good First Issues`
- Layout: **Table**
- Filter: `Effort = "1h" OR Effort = "3h"`
- Optional additional filter: `Status = "Todo" OR Status = "Backlog"`
- Columns:
  - Title
  - ACT Project
  - Effort
  - Type
  - Status

---

### View 12: 📊 Roadmap

Timeline visualization:

- Name: `📊 Roadmap`
- Layout: **Roadmap**
- No filter
- Date fields: Start date, Target date
- Optional: Group by ACT Project

**Note**: You'll need to add Start/Target date fields to project first if they don't exist.

---

### View 13: 🚧 Cross-Project Work

Infrastructure and ecosystem-wide work:

- Name: `🚧 Cross-Project Work`
- Layout: **Table**
- Filter: `ACT Project = "Cross-Project"`
- Columns:
  - Title
  - Status
  - Priority
  - Effort
  - Assignees

---

## Part 4: Verification Checklist

After creating all views:

- [ ] All 13 views appear in view switcher dropdown
- [ ] 📦 Goods view shows only goods-asset-tracker issues
- [ ] 📖 Empathy Ledger view shows only empathy-ledger-v2 issues
- [ ] 🔥 High Priority view shows critical items at top
- [ ] 🆕 Good First Issues shows quick-win tasks (1h-3h)
- [ ] 🎨 By LCAA Phase groups by methodology
- [ ] 📅 Sprint Planning shows sprint assignments
- [ ] All issues have ACT Project field set
- [ ] Most issues have Priority set (at minimum)

---

## Part 5: Ongoing Workflow

### Daily Use

**Morning**:
1. Check 🔥 High Priority view
2. Review 📅 Sprint Planning for today's work

**During work**:
- Use project-specific views (📦 Goods, 📖 Empathy Ledger, etc.)
- Update Status as you progress
- Add new issues (they auto-tag!)

**Planning**:
- Use 📅 Sprint Planning view
- Assign Priority and Effort
- Group work into Sprints

**Onboarding new developers**:
- Point them to 🆕 Good First Issues
- They pick 1h or 3h tasks
- Build familiarity with codebase

---

## Quick Reference Commands

### Backfill Issues
```bash
export GH_PROJECT_TOKEN=YOUR_CLASSIC_PAT_TOKEN_HERE
node scripts/bulk-add-to-project.js
```

### Create Test Issue (Any Repo)
```bash
gh issue create --repo Acurioustractor/goods-asset-tracker \
  --title "New feature" \
  --body "Description"
# Auto-tags with ACT Project = "Goods" + labels
```

### View Project
```bash
# Open in browser
open "https://github.com/users/Acurioustractor/projects/1"

# List all issues in project
gh project item-list 1 --owner Acurioustractor --format json
```

---

## Troubleshooting

### Bulk script fails with auth error

**Fix**: Make sure `GH_PROJECT_TOKEN` is set:
```bash
export GH_PROJECT_TOKEN=YOUR_CLASSIC_PAT_TOKEN_HERE
```

### Some issues not appearing in project views

**Check**:
1. Is ACT Project field set? (Check in Ecosystem View)
2. Does the filter match? (Check filter syntax)
3. Is issue open? (Closed issues don't show by default)

### Can't create Roadmap view

**Fix**: Add date fields to project first:
1. Project settings → Fields
2. Add "Start date" (Date field)
3. Add "Target date" (Date field)
4. Then create Roadmap view

---

## Time Estimates

- **Run bulk-add script**: 10-15 minutes
- **Quick tagging pass** (Priority only): 30 minutes
- **Detailed tagging** (all fields): 1-2 hours
- **Create 13 views**: 30 minutes
- **Total**: 2-3 hours for complete setup

**Recommendation**: Do it in stages:
1. Day 1: Bulk-add + create views (1 hour)
2. Day 2: Tag Priority and LCAA Phase (30 min)
3. Ongoing: Tag Effort and Sprints as needed

---

## Success Criteria

✅ **Setup Complete** when:
- All open issues in GitHub Project
- All issues have ACT Project field set
- 13 views created and working
- Most issues have Priority set
- You can easily find work by project/phase/priority

✅ **Daily Workflow** is:
- Create issue → Auto-tags
- Check views → Find work
- Update fields → Track progress
- Zero manual project management

---

**Next**: [Set up Notion Sync](./GITHUB_PROJECTS_NOTION_SETUP.md) for team collaboration

---

**Maintained By**: ACT Ecosystem Team
**Last Updated**: 2025-12-26
**Estimated Time**: 2-3 hours total
**Status**: Ready to execute
