# Agile Workflow in VS Code with GitHub Integration

> **Complete guide to working through issues in VS Code with automatic GitHub sync**

---

## 🎯 The Complete Development Flow

```
View Issues → Pick Task → Work on Code → Commit → Auto-Update GitHub → Next Task
     ↓                                          ↓
GitHub Project Board ←──────────────────────────┘
(automatically syncs Status, Milestone, Sprint)
```

---

## 📋 Step 1: View Your Sprint in VS Code

### Method A: GitHub Pull Requests & Issues Extension (BEST)

**Install**:
1. The extension is already installed: `GitHub.vscode-pull-request-github`
2. Reload VS Code: `Cmd+Shift+P` → "Developer: Reload Window"

**Access**:
1. Click the **GitHub icon** in the Activity Bar (left sidebar)
2. You'll see sections:
   ```
   📌 MY ISSUES
     ├─ My Current Sprint (your assigned issues)
     ├─ Urgent This Week (critical/high priority)
     ├─ Security & Bugs
     └─ All Open Issues

   🔍 CREATE ISSUE
   📝 CREATE PULL REQUEST
   ```

**What You See**:
- Issue number and title
- Labels (Type, Priority, ACT Project)
- Milestone
- Status
- Due date

**Interaction**:
- Click issue → See full description, comments, history
- Right-click → "Start Working on Issue" (creates branch automatically)
- Right-click → "Create Pull Request"
- Right-click → "Copy Issue URL"

### Method B: GitHub Issues Notebooks

**Install**: Already added to workspace
**Use**: Create `.github-issues` files to track issues in notebook format

**Example**: Create `current-sprint.github-issues`:
```markdown
repo:Acurioustractor/act-regenerative-studio
repo:Acurioustractor/empathy-ledger-v2
state:open
assignee:@me
```

Opens as interactive notebook showing all your issues.

---

## 🔨 Step 2: Start Working on an Issue

### Option A: Right-Click Method (Automatic Branch Creation)

1. In GitHub sidebar, find your issue
2. Right-click → **"Start Working on Issue"**
3. VS Code automatically:
   - Creates branch: `issue42` (or custom name)
   - Checks out the branch
   - Opens related files (if any)

### Option B: Manual Method

```bash
# Create branch for issue #34
git checkout -b issue34

# Or use descriptive name
git checkout -b fix-auth-security
```

---

## 💻 Step 3: Write Code

Work normally in VS Code:
- Edit files
- Save changes
- Use Claude Code for assistance: `claude "help me fix #34"`

**Tip**: Reference the issue number in your code comments:
```typescript
// TODO: Add rate limiting - see issue #36
// FIXME: Security vulnerability - fixes #34
```

---

## ✅ Step 4: Commit Changes

### Important: Use Keywords for Auto-Close

GitHub recognizes these keywords in commit messages:
- `Fixes #34`
- `Closes #34`
- `Resolves #34`

**Example commit**:
```bash
git add .
git commit -m "$(cat <<'EOF'
fix: add rate limiting to prevent brute force attacks

Fixes #36

- Added express-rate-limit middleware
- Set limit to 5 requests per 15 minutes for /login
- Added proper error responses

🤖 Generated with Claude Code
Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
EOF
)"
```

**What Happens**:
- When you push, GitHub automatically:
  ✅ Closes issue #36
  ✅ Links commit to issue
  ✅ Updates GitHub Project status to "Done"
  ✅ Triggers any workflow automations

---

## 🚀 Step 5: Push & Create PR

### Push Your Branch

```bash
git push origin issue34
```

### Create Pull Request

**Method A: VS Code Extension**
1. Click GitHub icon in sidebar
2. Click "Create Pull Request"
3. Fill in title and description
4. Include: `Fixes #34` in PR description
5. Submit

**Method B: GitHub CLI**
```bash
gh pr create --title "Fix auth security vulnerability" --body "$(cat <<'EOF'
## Summary
Fixes security vulnerability in authentication flow

## Changes
- Added input validation
- Fixed SQL injection risk
- Added rate limiting

## Testing
- [x] Tested login flow
- [x] Tested with malicious input
- [x] Verified rate limiting works

Fixes #34

🤖 Generated with Claude Code
EOF
)"
```

**What Happens**:
- PR is linked to issue #34
- When PR is merged:
  ✅ Issue automatically closes
  ✅ GitHub Project updates
  ✅ Milestone progress updates
  ✅ Sprint completion tracked

---

## 🔄 Step 6: What Happens in GitHub Automatically

### When You Create an Issue
GitHub Action runs and sets:
- **ACT Project** (based on repo)
- **Type** = "Enhancement"
- **Priority** = "Low"
- **Effort** = "1h"
- **Sprint** = "Backlog"
- **LCAA Phase** = "Action"
- **Milestone** (based on Type + Project)
- Repository labels

### When You Push a Commit with "Fixes #XX"
- Commit links to issue
- Shows up in issue timeline

### When You Merge PR with "Fixes #XX"
- Issue status → "Done"
- Issue closes automatically
- GitHub Project board updates
- Milestone progress increments

### Manual Updates
You can still manually change:
- Priority
- Sprint (move from Backlog → Sprint 4)
- Due Date (if different from milestone)
- Assignee
- Labels

All sync automatically to VS Code!

---

## 📊 Step 7: Track Progress

### In VS Code

**GitHub Extension Sidebar**:
- See issue count by query
- Watch Status field update
- Track sprint progress

**GitLens**:
- See which issues were closed in commits
- View commit history with linked issues

### In GitHub

**Project Board**: https://github.com/users/Acurioustractor/projects/1

**Views**:
1. **Sprint Board** - Kanban by Status (Todo/In Progress/Done)
2. **Milestone Roadmap** - Timeline view by Milestone
3. **Priority Matrix** - By Priority + Type
4. **My Work** - Filter: Assignee = @me

---

## 🎯 Daily Workflow Example

### Morning (10 min)

1. **Open workspace**
   ```bash
   code /Users/benknight/Code/ACT-Ecosystem.code-workspace
   ```

2. **Pull latest**
   - `Cmd+Shift+P` → "Tasks: Run Task" → "Pull All Repos"

3. **Check sprint**
   - Click GitHub icon in sidebar
   - View "My Current Sprint" query
   - See your 5-10 assigned issues

4. **Pick highest priority**
   - Sort by Priority (Critical → High → Medium)
   - Look at Due Date
   - Check Effort estimate

### During Development (2-4 hours)

5. **Start working**
   - Right-click issue → "Start Working on Issue"
   - Auto-creates branch `issue34`

6. **Code + commit**
   - Work normally in VS Code
   - Use Claude Code for help
   - Commit with `Fixes #34` in message

7. **Push + PR**
   - Push branch
   - Create PR via GitHub extension
   - Request review if needed

8. **Merge**
   - After approval, merge PR
   - Issue auto-closes
   - Move to next issue

### End of Day (5 min)

9. **Check progress**
   - View GitHub Project board
   - See completed issues moved to "Done"
   - Update any "In Progress" items

10. **Plan tomorrow**
    - Look at remaining sprint issues
    - Adjust priorities if needed

---

## 🔧 Advanced: GitHub Project Automation

### Your Current Automations

**Auto-Tag New Issues** (`.github/workflows/auto-tag-project-items.yml`):
- Runs when issue created
- Sets all default fields
- Assigns to milestone

**What You Could Add**:

### Auto-Move to "In Progress"
```yaml
# .github/workflows/auto-move-in-progress.yml
name: Auto-move to In Progress
on:
  issues:
    types: [assigned]
jobs:
  move:
    runs-on: ubuntu-latest
    steps:
      - name: Move to In Progress
        run: |
          # Update GitHub Project Status field to "In Progress"
```

### Auto-Move to "Done" on Close
```yaml
# .github/workflows/auto-move-done.yml
name: Auto-move to Done
on:
  issues:
    types: [closed]
jobs:
  move:
    runs-on: ubuntu-latest
    steps:
      - name: Move to Done
        run: |
          # Update GitHub Project Status field to "Done"
```

### Sprint Burndown Notifications
```yaml
# .github/workflows/sprint-reminder.yml
name: Sprint Reminder
on:
  schedule:
    - cron: '0 9 * * 1,3,5'  # Mon/Wed/Fri at 9am
jobs:
  remind:
    runs-on: ubuntu-latest
    steps:
      - name: Post sprint progress
        run: |
          # Post message showing sprint completion %
```

---

## 🎨 Sprint Planning Workflow

### Planning a New Sprint (Weekly)

1. **Review backlog**
   - Open GitHub Project: https://github.com/users/Acurioustractor/projects/1
   - Filter: Sprint = "Backlog"
   - Sort by Priority

2. **Assign to sprint**
   - Select 10-20 issues (based on team capacity)
   - Change Sprint field: "Backlog" → "Sprint 5"
   - Assign team members

3. **Set due dates** (if different from milestone)
   - Critical issues: Due at start of sprint
   - Others: Due by end of sprint

4. **Sync in VS Code**
   - Reload GitHub extension
   - See "My Current Sprint" updated automatically

### During Sprint (Daily Standups)

**Questions**:
1. What did you complete yesterday?
   - Check GitHub Project → Status = "Done"
2. What are you working on today?
   - Check GitHub Project → Status = "In Progress"
3. Any blockers?
   - Update issue comments, adjust priorities

**In VS Code**:
- Everyone sees same view via GitHub extension
- No need to switch to browser
- Work directly in code

### End of Sprint (Retrospective)

1. **Review completion**
   - GitHub Project → Filter Sprint 5
   - Count: Done vs Total
   - Calculate velocity

2. **Move incomplete items**
   - Unfinished issues → Next sprint
   - Or back to Backlog with updated priority

3. **Close sprint**
   - Create new Sprint 6
   - Plan next iteration

---

## 🚀 VS Code Keyboard Shortcuts

### Custom Shortcuts You Can Add

**File**: `~/Library/Application Support/Code/User/keybindings.json`

```json
[
  {
    "key": "cmd+shift+i",
    "command": "workbench.view.extension.github-pull-requests"
  },
  {
    "key": "cmd+shift+p cmd+shift+r",
    "command": "pr.create"
  },
  {
    "key": "cmd+shift+g cmd+shift+p",
    "command": "git.push"
  }
]
```

Now:
- `Cmd+Shift+I` → Open GitHub issues sidebar
- `Cmd+Shift+P Cmd+Shift+R` → Create PR
- `Cmd+Shift+G Cmd+Shift+P` → Git push

---

## 📚 Related Docs

- [WORLD_CLASS_WORKFLOW.md](./WORLD_CLASS_WORKFLOW.md) - Complete development workflow
- [QUICK_START_TEAM_WORKFLOW.md](./QUICK_START_TEAM_WORKFLOW.md) - 10-minute quick start
- [VSCODE_ISSUE_VIEWING.md](./VSCODE_ISSUE_VIEWING.md) - Extension setup details
- [MILESTONE_SYSTEM_DESIGN.md](./MILESTONE_SYSTEM_DESIGN.md) - Milestone architecture

---

## 🎯 Quick Reference Card

| Action | VS Code Method | Result |
|--------|----------------|--------|
| View sprint issues | Click GitHub icon → "My Current Sprint" | See assigned issues |
| Start working | Right-click issue → "Start Working on Issue" | Creates branch, opens files |
| Commit changes | Git commit with "Fixes #XX" | Links commit to issue |
| Create PR | GitHub icon → "Create Pull Request" | Links PR to issue |
| Merge PR | Merge in GitHub | Auto-closes issue, updates project |
| Track progress | GitHub icon sidebar | Real-time sync with GitHub |
| Plan sprint | GitHub Project board | Assign Sprint field |
| Daily standup | Filter by Status in Project | See what's done/in-progress |

---

**Last Updated**: 2025-12-26
**Maintained By**: ACT Development Team
**Questions?** See [WORLD_CLASS_WORKFLOW.md](./WORLD_CLASS_WORKFLOW.md)
