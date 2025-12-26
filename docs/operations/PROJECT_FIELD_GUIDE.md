# GitHub Project Fields - Complete Guide

**For**: ACT Ecosystem Development Project
**Date**: 2025-12-26

---

## 📍 Where Are Type Labels?

**Type labels ARE on your issues!** They're just not visible as a separate field in the project.

### How to See Type Labels

**In GitHub Project**:
1. Go to: https://github.com/users/Acurioustractor/projects/1
2. Look at the **Labels** column (built-in field)
3. You'll see labels like: `type: chore`, `type: bug`, `type: feature`, etc.

**In Issue View**:
1. Click any issue in the project
2. Look at the right sidebar
3. You'll see all labels including Type

**Example from your issues**:
```
Issue #127: [TODO]: Check if enough time has passed to retry
Labels: priority: low, type: chore, project: empathy-ledger, effort: 1h
```

### Why Type Is a Label (Not a Field)

**Labels** are flexible:
- Can have multiple types on one issue
- Easy to add/remove
- Show up prominently in issue lists
- GitHub's native way to categorize

**Fields** are structured:
- Single value per issue
- Better for filtering/sorting
- Used for project management metadata

### Current Type Labels in Use

Your issues have these type labels:
- `type: bug` - Something broken
- `type: feature` - New capability
- `type: docs` - Documentation
- `type: refactor` - Code improvement
- `type: test` - Testing
- `type: chore` - Maintenance (most TODO items)

**To filter by type in project views**:
- Create view → Filter by Labels contains "type: chore"
- This shows all chore/TODO items

---

## 🗑️ Removing [TODO]: Prefix from Titles

You're absolutely right - the `[TODO]:` prefix is redundant since you have Status field!

### Why They Have [TODO]:

These issues were auto-generated from code comments:
```javascript
// TODO: Check if enough time has passed to retry
```

The extraction script kept the `[TODO]:` prefix.

### How to Remove [TODO]: Prefix

I can create a script to bulk-remove the `[TODO]:` prefix from all issue titles.

**Option 1: Automated Script** (Recommended)
- I'll create a script to remove `[TODO]:` from all 149 issues
- Keeps the rest of the title
- Takes ~5 minutes to run

**Option 2: Manual**
- Edit each issue individually
- Time-consuming (2-3 hours)

**Would you like me to create the cleanup script?** It will change:
- `[TODO]: Check if enough time has passed` → `Check if enough time has passed`
- `[TODO]: Implement thumbnail generation` → `Implement thumbnail generation`

---

## 📅 Due Date and Start Date Fields

Great! You've added these fields to your project. Here's how to use them effectively.

### Due Date (Target Date)

**Purpose**: When must this be completed?

**Best Practices**:
- Set for time-sensitive work (launches, deadlines, dependencies)
- Don't set for every issue (creates pressure)
- Use for Critical/High priority items
- Review weekly and adjust if needed

**Example Usage**:
- Critical security fix → Due: 2025-12-27
- Feature for launch → Due: 2026-01-15
- Research (no deadline) → Due: (empty)

**Recommended**:
- **Critical items**: Always have a Due Date
- **High items**: Usually have a Due Date
- **Medium items**: Optional Due Date
- **Low items**: Rarely have Due Date

### Start Date

**Purpose**: When can/should we start this work?

**Best Practices**:
- Use for work that can't start yet (blocked, future)
- Helps with capacity planning ("when does this become available?")
- Useful for sequenced work

**Example Usage**:
- Blocked by API work → Start: 2026-01-10 (when API is ready)
- Post-launch feature → Start: 2026-02-01 (after launch)
- Available now → Start: (empty or today)

**Recommended**:
- Only set if there's a real constraint
- Most issues can start anytime → leave empty
- Use for dependencies and sequencing

### Roadmap View

With Start + Due dates, you can create a **Roadmap view**:
1. Go to project settings
2. Create new view → Type: Roadmap
3. Configure: X-axis = time, Y-axis = ACT Project
4. Shows timeline of when work happens

---

## 🏃 Sprint Field - How It Works

**Sprint** = A time-boxed period of focused work (usually 1-2 weeks)

### What Is a Sprint?

**Traditional Agile**:
- 2-week cycle
- Team commits to specific work
- Daily standups
- Sprint review at end

**Flexible Approach** (for small team):
- Define your own cadence (1 week, 2 weeks, monthly)
- Group related work together
- Use as "batch" or "focus period"

### How to Use Sprint Field

**Option A: Time-based Sprints** (Recommended for you)

Create sprints like:
- "Sprint 4" (current)
- "Sprint 5" (next)
- "Q1 2025" (quarterly planning)
- "Backlog" (not scheduled)

**Workflow**:
1. Each week/period, create a new sprint
2. Assign High/Critical items to current sprint
3. Assign Medium items to next sprint
4. Low priority → Backlog
5. At end of sprint, review what's done
6. Move incomplete work to next sprint

**Option B: Theme-based Sprints**

Create sprints like:
- "Launch Prep"
- "Tech Debt"
- "New Features"
- "Bug Fixes"

**Option C: Project-based Sprints**

Create sprints like:
- "Goods MVP"
- "Empathy Ledger Polish"
- "Infrastructure"

### Recommended Sprint Strategy for You

Based on your 149 issues (mostly TODO items):

**Immediate (This Week)**:
- Sprint: "Sprint 4"
- Include: Critical item (#33), 10-15 High priority items
- Total effort: ~1-2 days

**Next (Next Week)**:
- Sprint: "Sprint 5"
- Include: Medium priority items, selected Low items
- Total effort: ~2-3 days

**Backlog**:
- Sprint: "Backlog"
- Include: All Low priority TODO items
- Work through opportunistically

**How to assign**:
1. Filter by Priority = Critical/High
2. Bulk-select items
3. Set Sprint = "Sprint 4"
4. Repeat for Medium → "Sprint 5"
5. Rest → "Backlog"

### Sprint Planning Workflow

**Weekly Cycle**:
1. **Monday**: Review Sprint 4, assign new work
2. **Daily**: Update Status (Todo → In Progress → Done)
3. **Friday**: Sprint review, incomplete → Sprint 5
4. **Next Monday**: Sprint 5 becomes Sprint 4

**Create a Sprint Planning View**:
- Filter: Sprint = "Sprint 4"
- Group by: Status
- Sort by: Priority
- Shows: What to work on this week

---

## 🎯 Milestones - How They Work

**Milestone** = A significant goal or release marker

### Milestone vs Sprint

| Milestone | Sprint |
|-----------|--------|
| Long-term goal | Short-term batch |
| Multiple sprints | 1-2 weeks |
| "Ship Goods v1.0" | "Sprint 4" |
| Outcome-focused | Time-focused |

### How to Use Milestones

**Create in GitHub**:
1. Go to any repo → Issues → Milestones
2. Create milestone: "Goods MVP", "Empathy Ledger Launch", etc.
3. Set due date for milestone
4. Assign issues to milestone

**Example Milestones**:
- **Goods MVP** (Due: 2026-02-01)
  - All essential features for launch
  - ~30 issues

- **Empathy Ledger v2.0** (Due: 2026-03-15)
  - Feature complete
  - ~50 issues

- **Security & Infrastructure** (Due: 2026-01-31)
  - Critical security fixes
  - Performance improvements
  - ~10 issues

### Recommended Milestone Strategy

**For you** (with 149 TODO items):

**Milestone 1: Critical Fixes** (Due: 2025-12-31)
- Security vulnerability (#33)
- Any broken functionality
- Blockers

**Milestone 2: Empathy Ledger Core** (Due: 2026-01-31)
- Complete TODO items for core features
- ~30-40 high-value TODOs

**Milestone 3: Goods Asset Register MVP** (Due: 2026-02-28)
- All Goods-related issues
- Launch-ready state

**Milestone 4: Tech Debt & Polish** (Due: 2026-03-31)
- Remaining TODO items
- Refactoring
- Documentation

### Milestone vs Sprint Example

**Milestone: "Goods MVP"** (Big goal, 6 weeks)
- Contains: 30 issues total
- **Sprint 4**: 5 issues from Goods MVP
- **Sprint 5**: 7 issues from Goods MVP
- **Sprint 6**: 6 issues from Goods MVP
- etc.

**The relationship**:
- Milestones = WHAT (the destination)
- Sprints = WHEN (the journey)
- Issues get both: Milestone = "Goods MVP", Sprint = "Sprint 4"

---

## 🗺️ Complete Field Reference

Here's your full field setup:

### Core Fields (Set for all items)

| Field | Purpose | Example Values |
|-------|---------|----------------|
| **Status** | Current stage | Todo, In Progress, Done |
| **ACT Project** | Which product | Goods, Empathy Ledger, JusticeHub |
| **LCAA Phase** | Methodology phase | Listen, Curiosity, Action, Art |
| **Priority** | Urgency | Critical, High, Medium, Low |
| **Effort** | Time to complete | 1h, 3h, 1d, 3d, 1w, 2w |

### Planning Fields (Set as needed)

| Field | Purpose | When to Use |
|-------|---------|-------------|
| **Sprint** | Time batch | Current: "Sprint 4", Future: "Backlog" |
| **Milestone** | Major goal | "Goods MVP", "v2.0 Launch" |
| **Start Date** | When to begin | Only if blocked or future work |
| **Due Date** | Deadline | Critical/High items, real deadlines |

### Built-in Fields (Automatic)

| Field | Purpose | How It Works |
|-------|---------|--------------|
| **Labels** | Categories | Type, domain, flags (set in issue) |
| **Assignees** | Who's working | Assign yourself when working |
| **Repository** | Which repo | Automatic from issue |
| **Linked PRs** | Related code | Automatic when PR references issue |

---

## 💡 Recommended Next Steps

### 1. Clean Up [TODO]: Prefixes (5 min)
Let me create a script to remove `[TODO]:` from all issue titles.

### 2. Set Up Milestones (15 min)
Create 3-4 milestones in GitHub:
- Critical Fixes
- Goods MVP
- Empathy Ledger Core
- Tech Debt

### 3. Assign Current Sprint (10 min)
1. Filter Priority = Critical/High
2. Bulk assign Sprint = "Sprint 4"
3. Medium → "Sprint 5"
4. Low → "Backlog"

### 4. Create Sprint Planning View (5 min)
- View: "📅 Current Sprint"
- Filter: Sprint = "Sprint 4"
- Group by: Status
- Sort by: Priority

### 5. Add Due Dates for Critical Items (5 min)
- Issue #33 (security) → Due: 2025-12-27
- Any other blockers → Due: within 1 week

---

## 🎯 Putting It All Together - Example Workflow

**Issue #33: Security vulnerability**
- Status: Todo → In Progress → Done
- ACT Project: ACT Main (auto-set from repo)
- LCAA Phase: Action (implementation work)
- Priority: Critical (security issue)
- Effort: 3h (estimated)
- Sprint: Sprint 4 (current week)
- Milestone: Critical Fixes
- Start Date: (empty, can start now)
- Due Date: 2025-12-27 (must fix ASAP)
- Labels: `type: bug`, `security`, `priority: critical`
- Assignee: (you, when working on it)

**Issue #127: [TODO]: Check if enough time has passed**
- Status: Todo
- ACT Project: Empathy Ledger
- LCAA Phase: Action
- Priority: Low (TODO item)
- Effort: 1h (quick fix)
- Sprint: Backlog (not urgent)
- Milestone: Empathy Ledger Core
- Start Date: (empty)
- Due Date: (empty, no deadline)
- Labels: `type: chore`, `priority: low`, `effort: 1h`
- Assignee: (unassigned until picked up)

---

## 🔍 Quick Answers

**Q: Why do I see "type: chore" in Labels column?**
A: Type labels ARE there! Check the Labels column in your project view.

**Q: Should I remove [TODO]: from titles?**
A: Yes! It's redundant. I can create a script to bulk-remove it.

**Q: How do I use Sprint field?**
A: Assign issues to time batches like "Sprint 4" (this week), "Sprint 5" (next week), "Backlog" (future).

**Q: What's the difference between Sprint and Milestone?**
A: Sprint = short-term batch (1-2 weeks), Milestone = long-term goal (1-3 months, multiple sprints).

**Q: When should I set Due Date?**
A: For Critical/High priority items with real deadlines. Not every issue needs one.

**Q: When should I set Start Date?**
A: Only when work can't start yet (blocked, future dependency).

---

**Would you like me to**:
1. ✅ Create script to remove `[TODO]:` prefixes? (Recommended)
2. ✅ Create Sprint assignment script? (Bulk assign based on priority)
3. ✅ Create milestone suggestions? (Which issues in which milestone)
4. ✅ All of the above?

Let me know!

---

**Maintained By**: ACT Ecosystem Team
**Last Updated**: 2025-12-26
