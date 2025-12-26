# ACT Development Workflow Diagram

> **Visual guide to the complete development → deployment → feedback loop**

---

## 📊 The Complete Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                        SPRINT PLANNING (Weekly)                      │
│                                                                      │
│  GitHub Project Board                                                │
│  ├─ Select 10-20 issues from Backlog                                │
│  ├─ Assign to "Sprint 5"                                            │
│  ├─ Assign team members                                             │
│  └─ Set priorities & due dates                                      │
│                                                                      │
│  Auto-syncs to ↓                                                    │
└──────────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────────┐
│                       VS CODE WORKSPACE (Daily)                       │
│                                                                      │
│  Morning Routine:                                                    │
│  ├─ 1. Open workspace: ACT-Ecosystem.code-workspace                 │
│  ├─ 2. Click GitHub icon in sidebar                                 │
│  ├─ 3. View "My Current Sprint" query                               │
│  └─ 4. See 5-10 assigned issues                                     │
│                                                                      │
│  Pick Task:                                                          │
│  ├─ Right-click issue #34                                           │
│  ├─ "Start Working on Issue"                                        │
│  ├─ Auto-creates branch: issue34                                    │
│  └─ Opens related files                                             │
│                                                                      │
│  Development:                                                        │
│  ├─ Write code                                                       │
│  ├─ Ask Claude Code for help                                        │
│  ├─ Test locally                                                     │
│  └─ Commit with "Fixes #34"                                         │
│                                                                      │
│  Push:                                                               │
│  ├─ git push origin issue34                                         │
│  └─ Create PR via GitHub extension                                  │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────────┐
│                     GITHUB (Automatic)                                │
│                                                                      │
│  When PR Created:                                                    │
│  ├─ Links to issue #34                                              │
│  ├─ Shows in Project timeline                                       │
│  └─ Requests review (optional)                                      │
│                                                                      │
│  When PR Merged:                                                     │
│  ├─ ✅ Issue #34 auto-closes                                        │
│  ├─ ✅ Project Status → "Done"                                      │
│  ├─ ✅ Milestone progress updates                                   │
│  ├─ ✅ Sprint completion tracked                                    │
│  └─ ✅ Triggers deployment →                                        │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────────┐
│                     VERCEL (Automatic)                                │
│                                                                      │
│  Deployment:                                                         │
│  ├─ Detects push to main                                            │
│  ├─ Runs build: npm run build                                       │
│  ├─ Runs tests (if configured)                                      │
│  ├─ Deploys to production                                           │
│  └─ Updates deployment URL                                          │
│                                                                      │
│  Result:                                                             │
│  ├─ 🌐 Live at https://act-studio.vercel.app                        │
│  ├─ ⚡ Edge functions deployed                                      │
│  └─ 🔒 HTTPS automatically configured                               │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────────┐
│                    USER FEEDBACK (Continuous)                         │
│                                                                      │
│  Users interact with site:                                           │
│  ├─ Browse pages                                                     │
│  ├─ Submit forms                                                     │
│  ├─ Encounter errors (hopefully not!)                               │
│  └─ Provide feedback                                                 │
│                                                                      │
│  Monitoring (Optional - Can Add):                                    │
│  ├─ Sentry: Error tracking                                          │
│  ├─ Vercel Analytics: Performance metrics                           │
│  ├─ PostHog: User behavior                                          │
│  └─ GitHub Issues: Bug reports                                      │
│                                                                      │
│  Feedback becomes → New Issues                                       │
│  ├─ Users report bugs → Create GitHub issue                         │
│  ├─ Auto-tagged by GitHub Action                                    │
│  ├─ Auto-assigned to Milestone                                      │
│  ├─ Added to Project Backlog                                        │
│  └─ Reviewed in next Sprint Planning ↑                              │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
                              ↑
                              │
                    (Loop back to Sprint Planning)
```

---

## 🔄 What Happens Automatically

### When Issue Created
```
GitHub Action runs →
  ✅ Set ACT Project (from repo name)
  ✅ Set Type = "Enhancement"
  ✅ Set Priority = "Low"
  ✅ Set Sprint = "Backlog"
  ✅ Set Milestone (from Type + Project)
  ✅ Add to GitHub Project
  ✅ Add repository labels
```

### When You Commit with "Fixes #34"
```
Git push →
  ✅ Commit links to issue
  ✅ Shows in issue timeline
  ✅ PR created (if from branch)
```

### When PR Merged
```
GitHub merge →
  ✅ Issue closes
  ✅ Project Status → "Done"
  ✅ Milestone progress +1
  ✅ Vercel deployment triggered
  ✅ Site goes live
```

### When Deployment Completes
```
Vercel →
  ✅ Production URL updated
  ✅ Preview URL for PR (if applicable)
  ✅ Deployment notification in PR
  ✅ Users see changes immediately
```

---

## 👥 Team Collaboration Flow

### Developer A Working on Issue #34

**VS Code**:
```
1. Click GitHub icon
2. See "My Current Sprint"
3. Right-click #34 → "Start Working on Issue"
4. Branch created: issue34
5. Write code
6. Commit: "Fixes #34"
7. Push + Create PR
```

**GitHub** (automatic):
```
✅ PR created and linked to #34
✅ Developer B gets notification (if watching)
✅ Issue shows "linked pull request"
```

### Developer B Reviews PR

**VS Code**:
```
1. Click GitHub icon
2. Click PR section
3. See Developer A's PR
4. Click to review
5. Comment on code
6. Approve or Request Changes
```

**GitHub** (automatic):
```
✅ Developer A gets notification
✅ PR status updates
```

### Developer A Addresses Feedback

**VS Code**:
```
1. Make requested changes
2. Commit: "Address review feedback"
3. Push to same branch
```

**GitHub** (automatic):
```
✅ PR updates with new commits
✅ Developer B gets notification
✅ Developer B re-reviews and approves
```

### Merge to Production

**GitHub**:
```
1. Developer A or B clicks "Merge"
2. PR merges to main
```

**Automatic cascade**:
```
✅ Issue #34 closes
✅ Project board updates
✅ Vercel deploys
✅ Site goes live
✅ Branch can be deleted
```

---

## 📊 Sprint Progress Tracking

### In VS Code

**GitHub Extension Sidebar**:
```
📌 MY ISSUES
  ├─ Issue #34 (Status: Done) ✅
  ├─ Issue #35 (Status: In Progress) ⏳
  ├─ Issue #36 (Status: Todo) 📋
  └─ Issue #37 (Status: Todo) 📋

Sprint Progress: 1/4 complete (25%)
```

### In GitHub Project Board

**Kanban View**:
```
┌──────────┬──────────────┬──────────┐
│  TODO    │ IN PROGRESS  │   DONE   │
├──────────┼──────────────┼──────────┤
│ #36      │ #35          │ #34 ✅   │
│ #37      │              │          │
│          │              │          │
└──────────┴──────────────┴──────────┘
```

**Timeline View**:
```
Jan 2025          Feb 2025          Mar 2025
|─────────────────|─────────────────|
  Security         Empathy Ledger    Integration
  Hardening        Core              Platform
  ▓▓▓▓▓▓░░         ░░░░░░░░░         ░░░░░░░░
  60% done         0% done           0% done
```

---

## 🎯 Daily Standup (Remote Team)

### Each Developer Reports

**Morning (Async)**:
```
Developer A:
  Yesterday: ✅ Completed #34 (auth security)
  Today: 🔨 Working on #35 (SQL injection)
  Blockers: None

Developer B:
  Yesterday: ✅ Completed #42 (mobile UI)
  Today: 🔨 Working on #43 (notifications)
  Blockers: Waiting on API design decision

Developer C:
  Yesterday: 📚 Researched rate limiting options
  Today: 🔨 Starting #36 (rate limiting)
  Blockers: None
```

**How They Know**:
- Open VS Code
- Click GitHub icon
- See "My Issues" filtered by "closed:>yesterday"
- See current "In Progress" issues
- Check comments for blockers

**Team Lead Checks**:
- GitHub Project board
- Filter: Sprint = Current
- Group by: Assignee
- See each person's progress at a glance

---

## 🚀 Release Process

### When Sprint Completes

**GitHub**:
```
1. All issues in Sprint 5 → Done
2. Create GitHub Release:
   - Tag: v1.5.0
   - Title: "Sprint 5: Security Hardening"
   - Notes: Auto-generated from closed issues
3. Vercel automatically deploys tagged release
```

**Announcement**:
```
📢 Sprint 5 Complete!

✅ 12 issues completed
✅ 3 security vulnerabilities fixed
✅ 2 new features shipped
✅ 100% test coverage

Live now: https://act-studio.vercel.app

Next up: Sprint 6 (Empathy Ledger Core)
```

---

## 📚 Related Docs

- [AGILE_WORKFLOW_VSCODE.md](./AGILE_WORKFLOW_VSCODE.md) - Complete agile workflow
- [WORLD_CLASS_WORKFLOW.md](./WORLD_CLASS_WORKFLOW.md) - Development workflow guide
- [QUICK_START_TEAM_WORKFLOW.md](./QUICK_START_TEAM_WORKFLOW.md) - 10-minute quick start
- [MILESTONE_SYSTEM_DESIGN.md](./MILESTONE_SYSTEM_DESIGN.md) - Milestone architecture

---

**Last Updated**: 2025-12-26
**Maintained By**: ACT Development Team
