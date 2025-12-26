# 🚀 Quick Start - ACT Team Workflow

**Time to set up**: 10 minutes
**What you get**: World-class development workflow

---

## ⚡ Step 1: Open Your Workspace (2 min)

```bash
# Open all 6 ACT projects at once
code /Users/benknight/Code/ACT-Ecosystem.code-workspace
```

**You now see**:
```
VS Code Sidebar:
  🏗️ ACT Studio
  💙 Empathy Ledger
  ⚖️ JusticeHub
  🌱 The Harvest
  ♻️ Goods
  🦅 ACT Farm
```

Switch between projects instantly in the Explorer!

---

## ⚡ Step 2: Check What to Work On (1 min)

**Option A: VS Code Tasks** (Simplest)
1. Press `Cmd+Shift+P` → "Tasks: Run Task"
2. Select **"My Issues"**
3. See your assigned issues in terminal

**Option B: VS Code Sidebar**
1. Click **GitHub icon** in VS Code sidebar
2. See **"My Current Sprint"** query
3. Shows all your assigned issues
4. Right-click issue → "Start Working on Issue"

**Option C: Ask Claude**:
```bash
claude "What should I work on today?"
```

**Claude shows**:
```
🔴 URGENT (Due in 5 days):
  #34: Security vulnerability - Start TODAY
  #35: SQL injection risk

🟢 This Sprint:
  #45: Add mobile UI
  #46: Implement notifications
```

**Option D: GitHub Project**:
https://github.com/users/Acurioustractor/projects/1

Filter: **Sprint = Current**, **Assignee = @me**

**See**: [VSCODE_ISSUE_VIEWING.md](./VSCODE_ISSUE_VIEWING.md) for full guide

---

## ⚡ Step 3: Start Working (5 min)

```bash
# Claude helps you start
claude "Let's work on #34"
```

**Claude**:
1. Switches to correct project folder
2. Reads issue from GitHub
3. Shows milestone context (Security Hardening, Due Jan 31)
4. Opens relevant files
5. Helps you code the fix

**You code with Claude's help**:
- Claude suggests fixes
- You review and refine
- Tests pass
- Ready to commit

---

## ⚡ Step 4: Commit & Push (2 min)

```bash
# Claude creates smart commit
claude "commit this fix"
```

**Claude generates**:
```bash
git commit -m "fix: resolve auth vulnerability (#34)

- Add input validation
- Implement rate limiting

Fixes #34
Milestone: Security Hardening

🤖 Generated with Claude Code"

git push origin main
```

**What happens automatically**:
- ✅ Issue #34 closes
- ✅ Project card moves to Done
- ✅ Milestone updates (4 of 5 complete)
- ✅ Vercel deploys to production
- ✅ Team sees your progress

**Done! On to the next issue.**

---

## 🔄 Daily Rhythm

### Morning (9:00 AM)
```bash
# 1. Open workspace
code /Users/benknight/Code/ACT-Ecosystem.code-workspace

# 2. Pull latest changes
# Command Palette (Cmd+Shift+P) → "Tasks: Run Task" → "Pull All Repos"

# 3. Check today's work
claude "What should I focus on today?"
```

### During Day
```bash
# Work on issues
claude "Let's work on #45"
# ... code ...
claude "commit this"
git push

# Repeat for next issue
```

### End of Day (5:00 PM)
```bash
# Check GitHub Project to see progress
# Update any In Progress items
# Plan tomorrow
```

---

## 👥 Team Sync Points

### Monday 9:00 AM - Sprint Planning (30 min)

**Where**: https://github.com/users/Acurioustractor/projects/1

**Do**:
1. Review last sprint (what got done)
2. Check milestone progress
3. Pull next 10-15 issues into current sprint
4. Assign to team members
5. Set sprint goal

### Daily 10:00 AM - Standup (5 min)

**Where**: Slack or in-person

**Each person**:
- Yesterday: "Closed #34, deployed to production"
- Today: "Working on #35 and #36"
- Blockers: "None" (or ask for help)

**Check**: GitHub Project shows real-time status

### Friday 4:00 PM - Review (15 min)

**Where**: https://github.com/users/Acurioustractor/projects/1

**Do**:
1. Review completed work this week
2. Check milestone progress
3. Celebrate wins
4. Note learnings

---

## 🔥 Common Tasks

### See My Work for the Week
1. Go to: https://github.com/users/Acurioustractor/projects/1
2. Create view: "My Week"
   - Filter: Assignee = @me, Sprint = Current
   - Group by: Status
3. See your Todo, In Progress, Done

### See Team's Work
1. Go to GitHub Project
2. View: "Team Sprint"
   - Filter: Sprint = Current
   - Group by: Assignee
3. See who's working on what

### See What's Urgent
1. GitHub Project
2. View: "Urgent This Week"
   - Filter: Due Date < 7 days, Status != Done
   - Sort by: Due Date
3. Prioritize these!

### Check Milestone Progress
1. Go to specific repo:
   - https://github.com/Acurioustractor/act-regenerative-studio/milestones
2. See progress bars
3. Track toward deadlines

### Deploy to Production
```bash
# Just push to main - automatic!
git push origin main
```

Vercel deploys automatically. Check:
- https://vercel.com/acurioustractor

### Report a Bug
```bash
gh issue create \
  --repo Acurioustractor/empathy-ledger-v2 \
  --title "Bug: Stories not loading" \
  --body "Description..." \
  --label "bug"
```

Automation tags it, assigns milestone, sets due date!

---

## 💡 Pro Tips

### Use GitHub CLI
```bash
# View issue
gh issue view 34 --repo Acurioustractor/act-regenerative-studio

# List my issues
gh issue list --assignee @me

# Create issue
gh issue create --title "..." --body "..."

# Close issue
gh issue close 34
```

### Use VS Code Tasks
**Command Palette** (Cmd+Shift+P):
- "Tasks: Run Task" → "Pull All Repos" (updates all 6 repos)
- "Tasks: Run Task" → "Check All Git Status" (see all changes)

### Use Claude Effectively
```bash
# Good prompts:
claude "What should I work on today?"
claude "Let's work on #34"
claude "Explain what this code does"
claude "commit this fix"
claude "create a PR for this"

# Claude sees:
# - Your GitHub Project
# - Milestone context
# - Due dates
# - Priority
# - Related files
```

### Link Issues in Commits
```bash
# Use "Fixes #issue" to auto-close
git commit -m "fix: resolve bug

Fixes #34
"

# Push → Issue closes automatically!
```

---

## 🐛 Troubleshooting

### "Claude doesn't see my issues"
- Make sure `GH_PROJECT_TOKEN` is set
- Check GitHub CLI is authenticated: `gh auth status`

### "My push didn't trigger deployment"
- Check Vercel dashboard
- Make sure repo is connected to Vercel
- Check branch is `main`

### "Issue didn't close after push"
- Commit message must include `Fixes #issue` or `Closes #issue`
- Must be in commit message, not just PR description

### "Can't see team's work"
- Make sure you're added to GitHub Project
- Check filters in Project views

---

## 📚 Learn More

**Full workflow**: [WORLD_CLASS_WORKFLOW.md](./WORLD_CLASS_WORKFLOW.md)
**Repository setup**: [REPOSITORY_ALIGNMENT.md](./REPOSITORY_ALIGNMENT.md)
**Milestone system**: [MILESTONE_IMPLEMENTATION_GUIDE.md](./MILESTONE_IMPLEMENTATION_GUIDE.md)

---

## ✅ You're Ready!

You now have:
- ✅ All 6 projects in one workspace
- ✅ Claude Code helping you develop
- ✅ Automatic issue tracking
- ✅ Team visibility in GitHub Project
- ✅ Milestone-driven deadlines
- ✅ Auto-deployments on push
- ✅ Complete traceability

**Start coding!** 🚀

---

**Questions?** Ask in Slack or check the docs.
**Last Updated**: 2025-12-26
