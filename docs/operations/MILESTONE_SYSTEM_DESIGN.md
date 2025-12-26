# Milestone System Design - Automated & VS Code Integrated

**Goal**: Milestones that work seamlessly with automation, Due Dates, Start Dates, and Claude Code development workflow
**Philosophy**: Set it once, flows automatically

---

## 🎯 What Are Milestones For?

### Milestones = Major Goals / Releases

**Think of Milestones as**:
- Product launches
- Major feature completions
- Version releases
- Time-boxed initiatives

**Examples for ACT**:
- "Goods MVP Launch"
- "Empathy Ledger v2.0"
- "Security Hardening Q1"
- "Integration Platform Complete"

---

## 🔄 How Milestones Relate to Other Fields

### The Hierarchy

```
Milestone (Big Goal)
  ↓
Sprint (Time Batch)
  ↓
Issue (Individual Task)
```

**Example**:
- **Milestone**: "Goods MVP Launch" (6 weeks, 30 issues)
  - **Sprint 4**: 5 issues from Goods MVP
  - **Sprint 5**: 7 issues from Goods MVP
  - **Sprint 6**: 6 issues from Goods MVP
  - etc.

### Milestone ↔ Dates Relationship

**Milestone has**:
- **Due Date**: When the milestone must be complete
- **Start Date**: When work on this milestone begins

**Issues within Milestone inherit**:
- **Start Date**: Can't start before milestone starts
- **Due Date**: Must finish before milestone due date

**Automation rule**:
```
If Issue.Milestone = "Goods MVP Launch"
Then Issue.DueDate <= Milestone.DueDate
And Issue.StartDate >= Milestone.StartDate
```

---

## 📋 Recommended Milestone Structure for ACT

Based on your 149 issues, here's the ideal milestone setup:

### 1. Security Hardening (Q1 2025)
**Due Date**: 2025-01-31
**Issues**: 5 Security + 12 Bugs = 17 issues
**Why**: Critical security and stability work
**Priority**: HIGHEST - all Critical/High

### 2. Empathy Ledger Core (Q1 2025)
**Due Date**: 2025-02-28
**Issues**: ~40 Empathy Ledger enhancements
**Why**: Complete core features for Empathy Ledger v2
**Focus**: User-facing improvements

### 3. Goods Asset Register MVP (Q1 2025)
**Due Date**: 2025-03-15
**Issues**: 6 Goods issues + new work
**Why**: Launch minimum viable product
**Focus**: Asset tracking basics

### 4. Integration Platform (Q1-Q2 2025)
**Due Date**: 2025-03-31
**Issues**: 29 Integration issues
**Why**: Connect all systems (Vercel, Notion, GHL, Email)
**Focus**: Automation and workflows

### 5. Data Architecture Complete (Q1 2025)
**Due Date**: 2025-02-15
**Issues**: 11 Data/schema issues
**Why**: Stable database foundation
**Focus**: Schema and migrations

### 6. JusticeHub Alpha (Q2 2025)
**Due Date**: 2025-04-30
**Issues**: 5 JusticeHub issues
**Why**: First public version
**Focus**: Core justice platform features

### 7. The Harvest Website (Q2 2025)
**Due Date**: 2025-05-15
**Issues**: 1 issue + new work
**Why**: Community website launch
**Focus**: Public presence

### 8. Testing & Quality (Ongoing)
**Due Date**: 2025-06-30
**Issues**: 7 Testing issues
**Why**: Test automation infrastructure
**Focus**: Quality assurance

---

## 🤖 Automated Milestone Assignment

### Strategy: Auto-assign based on Type + Priority + ACT Project

**Rule Set**:

```javascript
// Security & Bugs → Security Hardening
If (Type = "Security" OR Type = "Bug")
  → Milestone = "Security Hardening"
  → Due Date = 2025-01-31
  → Priority = Critical/High

// Data issues → Data Architecture Complete
If (Type = "Data")
  → Milestone = "Data Architecture Complete"
  → Due Date = 2025-02-15
  → Sprint = Plan together

// Integration issues → Integration Platform
If (Type = "Integration")
  → Milestone = "Integration Platform"
  → Due Date = 2025-03-31

// Empathy Ledger enhancements → Empathy Ledger Core
If (ACT Project = "Empathy Ledger" AND Type = "Enhancement")
  → Milestone = "Empathy Ledger Core"
  → Due Date = 2025-02-28

// Goods issues → Goods MVP
If (ACT Project = "Goods")
  → Milestone = "Goods Asset Register MVP"
  → Due Date = 2025-03-15

// JusticeHub → JusticeHub Alpha
If (ACT Project = "JusticeHub")
  → Milestone = "JusticeHub Alpha"
  → Due Date = 2025-04-30

// Testing → Testing & Quality
If (Type = "Testing")
  → Milestone = "Testing & Quality"
  → Due Date = 2025-06-30
```

---

## 🔗 Milestone ↔ Dates Automation

### Auto-set Due Dates Based on Milestone

**When Milestone is assigned**:

1. **Critical Security** → Due Date = Milestone Due Date (urgent!)
2. **High Priority** → Due Date = Milestone Due Date - 1 week (buffer)
3. **Medium Priority** → Due Date = Milestone Due Date - 2 weeks
4. **Low Priority** → Due Date = Milestone Due Date - 4 weeks

**Example**:
```
Issue: Security vulnerability (#34)
  Type: Security
  Priority: Critical

Auto-assigned:
  Milestone: Security Hardening (Due: 2025-01-31)
  Due Date: 2025-01-31 (same as milestone)
  Sprint: Sprint 4 (current)
```

### Auto-set Start Dates Based on Dependencies

**Smart Start Date Logic**:

1. **Security/Bugs** → Start Date = Today (immediate)
2. **Data migrations** → Start Date = 2 weeks before Due Date (planned)
3. **Enhancements** → Start Date = When assigned to Sprint
4. **Integrations** → Start Date = After dependencies complete

---

## 💻 VS Code + Claude Code Integration

### How It Works in Your Dev Workflow

#### Scenario 1: You're Working on an Issue

**In VS Code**:
```bash
# You pick up issue from Sprint 4
claude "Let's work on issue #34 - Security vulnerability"
```

**Claude Code**:
1. Fetches issue from GitHub
2. Sees: Milestone = "Security Hardening", Due = 2025-01-31
3. Knows this is urgent (Critical priority)
4. Helps you fix it quickly
5. When done, **auto-updates**:
   - Status: Todo → Done
   - Closes issue
   - Links commit to issue

#### Scenario 2: You Create a New Issue

**In VS Code**:
```bash
claude "Create issue: Add thumbnail caching to improve performance"
```

**Claude Code**:
1. Analyzes: "thumbnail caching" = Enhancement, "performance" = optimization
2. Detects: You're in empathy-ledger-v2 repo
3. **Auto-assigns**:
   - ACT Project: Empathy Ledger
   - Type: Enhancement
   - Priority: Low
   - Effort: 1h
   - Sprint: Backlog
   - **Milestone: Empathy Ledger Core** ← Auto!
   - **Due Date: 2025-02-28** ← From milestone!
4. Creates issue in GitHub
5. Adds to project automatically

#### Scenario 3: You Find a Security Issue

**In VS Code**:
```bash
claude "Found SQL injection vulnerability in search endpoint - create critical issue"
```

**Claude Code detects keywords**:
- "SQL injection" → Type: Security
- "critical" → Priority: Critical
- "vulnerability" → Security confirmed

**Auto-assigns**:
- Type: Security
- Priority: Critical
- **Milestone: Security Hardening** ← Auto!
- **Due Date: 2025-01-31** ← From milestone!
- **Sprint: Sprint 4** ← Critical goes to current!
- Start Date: Today ← Immediate work!

#### Scenario 4: Planning Mode

**You ask Claude**:
```bash
claude "What issues are in the Goods MVP milestone?"
```

**Claude responds**:
```
Goods Asset Register MVP (Due: 2025-03-15)
  6 issues currently assigned
  Estimated effort: 12 hours total

  Sprint 4 (Current):
    - None assigned yet

  Backlog:
    #1: Test auto-tagging workflow (1h)
    #2: Test full automation with PAT (1h)
    #3: Final automation test (1h)
    #4: Test automation - user-level (1h)
    #5: Test with PAT - full automation (1h)
    #6: Final test - classic token (1h)

  Recommendation: Move 3-4 issues to Sprint 4 to start milestone progress
```

---

## 🔧 Implementation Plan

### Phase 1: Create Milestones in GitHub (Manual - 10 min)

**Create these 8 milestones**:

1. Go to each repo → Issues → Milestones → New Milestone

**For repos with issues**:

**goods-asset-tracker**:
- Milestone: "Goods Asset Register MVP"
- Due date: 2025-03-15
- Description: "Minimum viable product for asset tracking"

**empathy-ledger-v2**:
- Milestone: "Empathy Ledger Core"
- Due date: 2025-02-28
- Description: "Core features for v2.0 launch"
-
- Milestone: "Security Hardening"
- Due date: 2025-01-31
- Description: "Critical security and stability fixes"

**justicehub-platform**:
- Milestone: "JusticeHub Alpha"
- Due date: 2025-04-30
- Description: "First public version"

**act-regenerative-studio**:
- Milestone: "Integration Platform"
- Due date: 2025-03-31
- Description: "Connect all systems and automation"
-
- Milestone: "Security Hardening"
- Due date: 2025-01-31
- Description: "Critical security and stability fixes"

**All repos**:
- Milestone: "Data Architecture Complete"
- Due date: 2025-02-15
- Description: "Stable database foundation"
-
- Milestone: "Testing & Quality"
- Due date: 2025-06-30
- Description: "Test automation infrastructure"

---

### Phase 2: Auto-Assign Script (15 min to run)

I'll create a script that:
1. Reads all 149 issues
2. Applies milestone assignment rules
3. Sets Due Date based on milestone
4. Sets Start Date for Security/Bugs
5. Shows preview before applying

---

### Phase 3: Update Automation Workflow (5 min)

Update `.github/workflows/auto-tag-project-items.yml`:
- Auto-detect milestone from Type + Priority + ACT Project
- Auto-set Due Date from milestone
- Auto-set Start Date for urgent items

---

### Phase 4: Claude Code Integration (Built-in!)

Claude Code already reads issue metadata:
- When you reference an issue, it sees Milestone + Dates
- When you create an issue, automation assigns Milestone
- When you work on code, it can link to milestone context

**No extra configuration needed!** Just works.

---

## 📊 Milestone Dashboard Views

### Create These Views in GitHub Project:

**1. Milestone Overview**
- Group by: Milestone
- Shows: Progress on each milestone
- Use: Weekly planning

**2. Current Milestone Sprint**
- Filter: Milestone = "Security Hardening" AND Sprint = "Sprint 4"
- Shows: This week's work on critical milestone
- Use: Daily standup

**3. Upcoming Deadlines**
- Sort by: Due Date (ascending)
- Filter: Status != "Done"
- Shows: What's due soonest
- Use: Prevent missed deadlines

**4. Milestone Roadmap**
- Layout: Roadmap view
- Group by: Milestone
- X-axis: Time (Start Date → Due Date)
- Shows: Visual timeline of all milestones

---

## 🎯 Example: Full Issue Lifecycle

Let's trace a security issue from creation to completion:

### 1. Discovery (VS Code)
```bash
# You're coding and notice an issue
claude "Found auth bypass vulnerability - create critical issue"
```

### 2. Auto-Assignment (Workflow)
**GitHub Action runs**:
```
Issue created: "Auth bypass in session validation"

Detected:
  - "auth" → Security type
  - "bypass", "vulnerability" → Critical priority

Auto-assigned:
  ✅ Type: Security
  ✅ Priority: Critical
  ✅ ACT Project: ACT Main
  ✅ LCAA Phase: Action
  ✅ Effort: 3h (security default)
  ✅ Milestone: Security Hardening (Due: 2025-01-31)
  ✅ Due Date: 2025-01-31 (from milestone)
  ✅ Start Date: 2025-12-26 (today - immediate)
  ✅ Sprint: Sprint 4 (current - critical priority)
```

### 3. You See It in Project
**GitHub Project**:
- Appears in "Current Sprint" view
- Shows in "Security Hardening" milestone group
- Red indicator for Critical priority
- Due date visible: 5 days away

### 4. Claude Helps You Fix It
```bash
claude "Fix issue #150 - auth bypass"
```

**Claude**:
- Reads issue details
- Sees Milestone = "Security Hardening" (knows it's urgent)
- Sees Due Date = 5 days (works efficiently)
- Helps you implement fix
- Runs tests
- Creates PR

### 5. Complete & Auto-Update
```bash
git commit -m "fix: prevent auth bypass in session validation

Closes #150"

git push
```

**Auto-updates**:
- Issue status: Todo → Done
- Sprint 4: One less item
- Milestone progress: Security Hardening (1/5 complete)
- Due date: Met (5 days early)

---

## 🔄 Milestone Workflow (Weekly)

### Monday Morning: Milestone Review

**1. Check Milestone Progress**
```bash
claude "Show progress on Security Hardening milestone"
```

**Claude responds**:
```
Security Hardening (Due: 2025-01-31 - 5 days away!)

Progress: 1/5 complete (20%)
  ✅ #150: Auth bypass fixed

Remaining (URGENT):
  🔴 #34: Security vulnerability in auth flow (3h)
  🔴 #36: Add rate limiting (1d)
  🟠 #6: Re-enable auth check (3h)
  🟠 #50: Permission check for reviews (1h)

Total effort: ~2.5 days
Recommendation: Focus 100% on these this week!
```

**2. Adjust Sprint if Needed**
- Move milestone items to current Sprint
- Re-prioritize if deadline is tight
- Ask for help if needed

---

### Mid-Week: Date Check

**3. Due Date Alerts**
```bash
claude "What's due this week?"
```

**Claude checks**:
- Issues with Due Date in next 7 days
- Groups by Milestone
- Shows effort required

---

### Friday: Milestone Retrospective

**4. Review Completed Work**
```bash
claude "What did we complete in Security Hardening this week?"
```

**5. Update Timeline if Needed**
- Milestone delayed? Adjust Due Date
- Issues taking longer? Adjust Effort estimates
- Dependencies blocking? Update Start Dates

---

## 🤖 Automated Scripts to Create

### 1. Bulk Assign Milestones Script
```bash
node scripts/assign-milestones.js
```
**Does**:
- Assigns milestone to all 149 issues based on rules
- Sets Due Dates from milestones
- Sets Start Dates for urgent items
- Preview before applying

### 2. Milestone Progress Reporter
```bash
node scripts/milestone-progress.js
```
**Shows**:
- Progress on each milestone (X/Y complete)
- Days until due date
- Estimated effort remaining
- Risk assessment (red/yellow/green)

### 3. Due Date Sync Script
```bash
node scripts/sync-due-dates.js
```
**Does**:
- When milestone Due Date changes
- Updates all issue Due Dates
- Respects Priority offsets

---

## 📋 Milestone Assignment Rules (Complete)

```javascript
const MILESTONE_RULES = {
  // Security & Bugs → Security Hardening
  security: {
    conditions: ['Type = Security', 'Type = Bug'],
    milestone: 'Security Hardening',
    dueDate: '2025-01-31',
    startDate: 'today', // Immediate
    sprint: 'Sprint 4' // Current
  },

  // Data → Data Architecture
  data: {
    conditions: ['Type = Data'],
    milestone: 'Data Architecture Complete',
    dueDate: '2025-02-15',
    startDate: 'milestone.dueDate - 2 weeks',
    sprint: 'Backlog' // Plan together
  },

  // Integration → Integration Platform
  integration: {
    conditions: ['Type = Integration'],
    milestone: 'Integration Platform',
    dueDate: '2025-03-31',
    startDate: 'when assigned to Sprint',
    sprint: 'Backlog'
  },

  // Empathy Ledger Enhancement → Empathy Ledger Core
  empathyLedger: {
    conditions: ['ACT Project = Empathy Ledger', 'Type = Enhancement'],
    milestone: 'Empathy Ledger Core',
    dueDate: '2025-02-28',
    startDate: 'when assigned to Sprint',
    sprint: 'Backlog'
  },

  // Goods → Goods MVP
  goods: {
    conditions: ['ACT Project = Goods'],
    milestone: 'Goods Asset Register MVP',
    dueDate: '2025-03-15',
    startDate: 'when assigned to Sprint',
    sprint: 'Backlog'
  },

  // JusticeHub → JusticeHub Alpha
  justiceHub: {
    conditions: ['ACT Project = JusticeHub'],
    milestone: 'JusticeHub Alpha',
    dueDate: '2025-04-30',
    startDate: 'when assigned to Sprint',
    sprint: 'Backlog'
  },

  // Testing → Testing & Quality
  testing: {
    conditions: ['Type = Testing'],
    milestone: 'Testing & Quality',
    dueDate: '2025-06-30',
    startDate: 'when assigned to Sprint',
    sprint: 'Backlog'
  }
};
```

---

## ✅ Success Criteria

**Milestones are working well when**:

1. ✅ Every issue has a milestone
2. ✅ Due Dates align with milestone deadlines
3. ✅ Start Dates prevent premature work
4. ✅ Critical items auto-assign to current Sprint
5. ✅ Claude Code can reference milestone context
6. ✅ You can ask "What's in milestone X?" and get clear answer
7. ✅ Milestone progress visible at a glance
8. ✅ Deadlines are realistic and achievable

---

## 🚀 Next Steps

**Ready to implement?**

1. ✅ Create 8 milestones in GitHub (manual - 10 min)
2. ✅ I create bulk milestone assignment script
3. ✅ Run script to assign all 149 issues
4. ✅ Update automation workflow
5. ✅ Test with new issue creation
6. ✅ Create milestone dashboard views

**Tell me when you're ready and I'll create the scripts!**

---

**Maintained By**: ACT Ecosystem Team
**Last Updated**: 2025-12-26
**Status**: Design Complete - Ready to Implement
