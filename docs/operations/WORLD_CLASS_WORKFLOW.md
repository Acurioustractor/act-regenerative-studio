# 🌟 ACT Ecosystem - World-Class Development Workflow

**Updated**: 2025-12-26
**Status**: Production System Design

---

## 🎯 The Complete Picture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Your Development Flow                        │
└─────────────────────────────────────────────────────────────────┘

        VS Code + Claude Code (Local Development)
                    ↓ (Work on features)
              Git Commit & Push
                    ↓ (Automatic)
         GitHub Projects Auto-Update
                    ↓ (Triggers)
              Vercel Deployment
                    ↓ (Live)
           Production Websites
                    ↓ (Users)
          Feedback & Bug Reports
                    ↓ (Creates)
        New GitHub Issues (Auto-tagged)
                    ↓ (Returns to)
        VS Code + Claude Code

        🔄 CONTINUOUS LOOP
```

---

## 💻 Part 1: Working in VS Code with Claude Code

### Your Daily Workspace Setup

**Morning Startup**:
```bash
# Open your workspace (all 6 repos visible)
code ~/Code/ACT-Workspace.code-workspace
```

**Workspace File** (`~/Code/ACT-Workspace.code-workspace`):
```json
{
  "folders": [
    {
      "name": "🏗️ ACT Studio",
      "path": "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio"
    },
    {
      "name": "💙 Empathy Ledger",
      "path": "/Users/benknight/Code/Empathy Ledger v.02"
    },
    {
      "name": "⚖️ JusticeHub",
      "path": "/Users/benknight/Code/JusticeHub"
    },
    {
      "name": "🌱 The Harvest",
      "path": "/Users/benknight/Code/The Harvest Website"
    },
    {
      "name": "♻️ Goods",
      "path": "/Users/benknight/Code/Goods Asset Register"
    },
    {
      "name": "🦅 ACT Farm",
      "path": "/Users/benknight/Code/ACT Farm/act-farm"
    }
  ],
  "settings": {
    "files.exclude": {
      "**/node_modules": true,
      "**/.next": true
    }
  }
}
```

### Working with Claude Code

**1. Check What to Work On**:
```bash
# Claude knows your GitHub Project
claude "What should I work on today?"
```

**Claude sees**:
```
🔴 URGENT (Due in 5 days):
  Security Hardening: 5 issues
  → act-regenerative-studio#33: Critical security fix (Start: TODAY)
  → act-regenerative-studio#34: Auth vulnerability

🟡 THIS WEEK:
  Integration Platform: 32 issues
  → 25 are ACT Main integrations (Due: Mar 31)

🟢 THIS SPRINT:
  Empathy Ledger Core: 100 issues (Due: Feb 28)
  → Sprint 5 has 1 Medium priority item
```

**2. Start Working on an Issue**:
```bash
# Claude opens the right repo, reads the issue, understands context
claude "Let's work on #34"
```

**Claude does**:
1. Switches to `act-regenerative-studio` folder
2. Fetches issue #34 from GitHub
3. Reads milestone context (Security Hardening, Due Jan 31)
4. Understands priority (Critical)
5. Knows related files from past context
6. Helps you fix it efficiently

**3. Claude Helps You Code**:
```bash
# In VS Code, with issue context loaded
claude "Fix the auth vulnerability in the session handler"
```

**Claude**:
- Reads current code
- Applies security best practices
- Writes the fix
- Explains what changed
- Suggests tests

**4. Commit Your Work**:
```bash
# Claude creates smart commits
claude "commit this fix"
```

**Claude generates**:
```bash
git add src/lib/auth/session.ts
git commit -m "fix: resolve session auth vulnerability (#34)

- Add input validation to session tokens
- Implement rate limiting on auth endpoints
- Add security headers to prevent XSS

Fixes #34
Milestone: Security Hardening

🤖 Generated with Claude Code
Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

**Key**: Using `Fixes #34` auto-closes the issue when merged!

---

## 🔄 Part 2: GitHub Auto-Updates Everything

### What Happens When You Push

**You push**:
```bash
git push origin main
```

**GitHub automatically**:
1. ✅ **Workflow runs** - Auto-tag workflow validates
2. ✅ **Issue updates** - Status changes to "Done" (if `Fixes #34`)
3. ✅ **Milestone updates** - Progress bar moves forward
4. ✅ **Project updates** - Card moves to "Done" column
5. ✅ **Vercel deploys** - New version goes live
6. ✅ **Team notified** - Slack/Discord webhook fires

### The Auto-Update Magic

**GitHub Actions Workflow** (already deployed):
```yaml
# When you push or merge PR
on: [push, pull_request]

# Updates:
- Issue status → Done
- Milestone progress → +1 complete
- Project card → Moved to Done column
- Due date → Checked off
- Team notification → Sent
```

### Milestones Track Everything

**View your progress**:
- https://github.com/Acurioustractor/act-regenerative-studio/milestones

**You see**:
```
Security Hardening (Due: Jan 31, 2025)
  ████████░░ 80% complete (4 of 5 done)
  5 days remaining
  ⚠️ AT RISK - 1 issue remaining
```

---

## 📅 Part 3: Planning & Coordination

### Monday Morning: Team Planning Session

**1. Review Milestones**:
```bash
# See what's due this week across ALL projects
claude "Show me all milestones due this week"
```

**Claude reports**:
```
🔴 URGENT (Due Jan 31 - 5 days):
  Security Hardening
    - 5 issues remaining
    - 2 developers needed
    - Estimated: 12 hours work

📊 Milestone Health:
  ✅ Empathy Ledger Core: On track (Feb 28)
  ✅ Integration Platform: On track (Mar 31)
  ⚠️ Security Hardening: AT RISK (Jan 31)
```

**2. Assign Work to Team**:

Go to: https://github.com/users/Acurioustractor/projects/1

Create **Assignee** view:
- Group by: Assignee
- Filter: Sprint = "Sprint 5"
- Shows: Who's working on what

**Assign issues**:
```bash
# Via CLI
gh issue edit 34 --repo Acurioustractor/act-regenerative-studio --assignee @username

# Or in GitHub Project UI
# Drag issue to assignee column
```

**3. Set Sprint Goals**:

Create **Sprint Board** view:
- Filter: Sprint = "Sprint 5"
- Group by: Status (Todo, In Progress, Done)
- Shows: What's happening this week

**Move issues to current sprint**:
```bash
# This also sets Start Date automatically!
# Just update the Sprint field in GitHub Project
```

---

## 👥 Part 4: Team Sync & Communication

### Daily Standup (5 minutes)

**Everyone opens**:
https://github.com/users/Acurioustractor/projects/1

**Current Sprint view shows**:
```
Todo (12)         In Progress (3)      Done (8)
─────────         ───────────────      ────────
#45 - @alice      #34 - @ben          #33 ✅
#46 - @bob        #35 - @alice        #29 ✅
#47 - (unassigned)#36 - @bob          #28 ✅
```

**Each person reports**:
- Yesterday: "Closed #29" (visible in Done column)
- Today: "Working on #34" (visible in In Progress)
- Blockers: "Need design for #47" (tag designer)

**Update status in real-time**:
- Drag cards between columns
- Everyone sees updates instantly
- No separate status tool needed

### Weekly Milestone Review (Friday)

**View**:
https://github.com/Acurioustractor/act-regenerative-studio/milestones

**See**:
```
Security Hardening (Due: Jan 31, 2025)
  ██████████ 100% complete! 🎉

Integration Platform (Due: Mar 31, 2025)
  ████░░░░░░ 40% complete
  56 days remaining
  ✅ ON TRACK
```

**Celebrate wins**:
- Post in Slack when milestones complete
- Review what went well
- Adjust next sprint based on velocity

---

## 🚀 Part 5: Deployment & Production

### Automatic Deployments

**Every repo connected to Vercel**:

1. **Push to `main`** → Deploys to production
2. **Push to branch** → Creates preview URL
3. **Open PR** → Preview URL in PR comments

**GitHub → Vercel Integration**:
```
Commit pushed
  ↓
Vercel builds
  ↓
Runs tests
  ↓
Deploys to production
  ↓
Comments on issue: "Deployed to https://..."
```

### Production Monitoring

**Track live sites**:
```
✅ empathy-ledger-v2.vercel.app
✅ justicehub.vercel.app
✅ harvest-community-hub.vercel.app
✅ goods-asset-tracker.vercel.app
✅ act-farm.vercel.app
✅ act-studio.vercel.app
```

**Monitor in Vercel dashboard**:
- Build status
- Performance metrics
- Error logs
- User analytics

---

## 🐛 Part 6: User Feedback Loop

### When Users Report Issues

**Option 1: Email**:
User emails: support@acurioustractor.com

**You create issue**:
```bash
gh issue create \
  --repo Acurioustractor/empathy-ledger-v2 \
  --title "User reports: Stories not loading on mobile" \
  --body "From: user@example.com\n\nStories page blank on iPhone 12" \
  --label "bug,user-report"
```

**Automation kicks in**:
- ✅ Added to project
- ✅ Type = Bug
- ✅ Priority = High (user-facing)
- ✅ Milestone = Security Hardening (bugs go here)
- ✅ Due Date = Jan 31
- ✅ Team notified

**Option 2: Sentry Integration** (recommended):

Install Sentry in each app:
```bash
npm install @sentry/nextjs
```

**Auto-creates issues**:
- User hits error
- Sentry captures it
- Creates GitHub issue automatically
- Includes stack trace, user context
- Already tagged and categorized

**Option 3: In-App Feedback Widget**:

Add to each site:
```tsx
<FeedbackButton
  onSubmit={(feedback) => {
    // Calls GitHub API
    // Creates issue with user feedback
  }}
/>
```

---

## 📊 Part 7: The Complete Dashboard

### Your Single Source of Truth

**GitHub Project**: https://github.com/users/Acurioustractor/projects/1

**Create These Views**:

#### 1. **My Week** (Personal view)
- Filter: Assignee = @me, Sprint = Current
- Group by: Status
- Shows: Your work this week

#### 2. **Team Sprint** (Team view)
- Filter: Sprint = Current
- Group by: Assignee
- Shows: Who's doing what

#### 3. **Milestone Roadmap** (Planning view)
- Type: Roadmap
- Group by: Milestone
- Shows: Timeline of all major goals

#### 4. **Security Dashboard** (Critical view)
- Filter: Type = Security OR Type = Bug
- Sort by: Priority
- Shows: All security work

#### 5. **By Project** (Portfolio view)
- Group by: ACT Project
- Shows: Work across all 6 projects

#### 6. **Urgent This Week** (Focus view)
- Filter: Due Date < 7 days, Status != Done
- Sort by: Due Date
- Shows: What MUST be done

---

## 🔧 Part 8: VS Code Extensions to Install

### Essential Extensions

**1. GitHub Pull Requests and Issues**:
- View issues in VS Code
- Create issues from editor
- See PR status

**2. GitLens**:
- See who changed what line
- Blame annotations
- File history

**3. Claude Code** (already have):
- AI pair programming
- Milestone-aware
- Smart commits

**4. Todo Tree**:
- Highlights TODO/FIXME comments
- Creates list of tasks
- Syncs with issues

**5. Project Manager**:
- Quick switch between 6 projects
- Saves context per project

**Install all**:
```bash
code --install-extension GitHub.vscode-pull-request-github
code --install-extension eamodio.gitlens
code --install-extension Gruntfuggly.todo-tree
code --install-extension alefragnani.project-manager
```

---

## 🔄 Part 9: Daily Workflow Example

### Ben's Tuesday (Full Cycle)

**9:00 AM - Start Day**:
```bash
code ~/Code/ACT-Workspace.code-workspace
claude "What should I focus on today?"
```

**Claude**:
> You have 2 critical security issues due in 4 days:
> - #34: Auth vulnerability (act-regenerative-studio)
> - #35: SQL injection risk (act-regenerative-studio)
>
> Recommend: Focus on security today. Start with #34.

**9:15 AM - Start Work**:
```bash
claude "Let's work on #34"
```

Claude:
- Switches to ACT Studio folder
- Reads issue and milestone context
- Opens relevant files
- Shows current vulnerability

**10:00 AM - Fix Complete**:
```bash
claude "commit this security fix"
git push origin main
```

**What happens automatically**:
1. Commit message includes `Fixes #34`
2. GitHub closes issue #34
3. Project card moves to Done
4. Milestone progress: 4 of 5 complete
5. Vercel deploys new version
6. Sentry marks vulnerability as resolved

**10:15 AM - Update Team**:
In Slack:
> ✅ Fixed #34 - Auth vulnerability resolved and deployed
> Next: Working on #35 (SQL injection)

**11:00 AM - Continue**:
```bash
claude "Now let's work on #35"
```

Repeat cycle...

**5:00 PM - End of Day**:
Check GitHub Project:
- See what got done today
- See what's left for tomorrow
- Update status if needed

---

## 📈 Part 10: Tracking Across Everything

### The Full Integration Map

```
VS Code (Local Development)
  ↓ commit
GitHub (Source Control)
  ↓ webhook
GitHub Projects (Project Management)
  ↓ milestone tracking
GitHub Milestones (Goal Tracking)
  ↓ trigger
Vercel (Deployment)
  ↓ monitor
Sentry (Error Tracking)
  ↓ creates
GitHub Issues (Bug Reports)
  ↓ auto-tag
GitHub Projects (Back to planning)

FULL CIRCLE 🔄
```

### Data Flow

**Issue Created** (manually or via Sentry):
```
User reports bug
  ↓
GitHub issue created
  ↓ (< 30 seconds)
Auto-tag workflow runs:
  - Type = Bug
  - Priority = High
  - Project = Empathy Ledger
  - Milestone = Security Hardening
  - Due Date = Jan 31
  - Start Date = Today
  ↓
Appears in GitHub Project
  ↓
Visible in VS Code GitHub extension
  ↓
Developer sees it in daily planning
  ↓
Claude helps fix it
  ↓
Push to GitHub
  ↓
Issue auto-closes
  ↓
Deploys to production
  ↓
User's bug is fixed
```

**All without manual updates!**

---

## 🎯 Part 11: Sprint Planning Process

### Every 2 Weeks: New Sprint

**Friday (Sprint Close)**:

1. **Review completed work**:
   - https://github.com/users/Acurioustractor/projects/1
   - Filter: Sprint = Current, Status = Done
   - Celebrate wins!

2. **Calculate velocity**:
   ```
   Sprint 4: 8 issues completed
   Sprint 5: 12 issues completed
   Average: 10 issues per sprint
   ```

3. **Check milestone progress**:
   - Security Hardening: 100% ✅
   - Integration Platform: 40% (on track)
   - Empathy Ledger Core: 60% (on track)

**Monday (Sprint Planning)**:

1. **Pull highest priority items**:
   - Filter: Priority = Critical OR High
   - Filter: Milestone with nearest due date
   - Filter: Not in any sprint (Backlog)

2. **Assign to Sprint 6**:
   - Drag 10-15 issues to Sprint 6
   - Consider team capacity
   - Balance across projects

3. **Set sprint goal**:
   ```
   Sprint 6 Goal:
   - Complete Integration Platform foundation (15 issues)
   - Start Empathy Ledger mobile UI (5 issues)
   ```

4. **Assign to team**:
   - Each person gets ~3-5 issues
   - Based on expertise and capacity

---

## 🔔 Part 12: Notifications & Alerts

### Stay Informed Without Noise

**GitHub Notifications** (configure):
```
Settings → Notifications:
  ✅ Issues assigned to me
  ✅ PRs requesting my review
  ✅ Milestone deadlines (7 days before)
  ❌ All other activity (too noisy)
```

**Slack Integration** (optional):
```
Install: GitHub + Slack app

Subscribe to:
  - Issues closed
  - PRs merged
  - Milestone completed
  - Deployment succeeded
```

**Critical Alerts**:
```
Sentry → Slack:
  - New errors in production
  - Error spike detected

Vercel → Slack:
  - Build failed
  - Deployment succeeded
```

---

## 💡 Part 13: Best Practices

### Commit Message Format

**Always include**:
```bash
type(scope): description (#issue-number)

- Detailed change 1
- Detailed change 2

Fixes #issue
Milestone: Milestone Name

🤖 Generated with Claude Code
Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring
- `docs`: Documentation
- `test`: Tests
- `chore`: Maintenance

**Why**:
- `Fixes #issue` auto-closes issue
- `Milestone: X` links to milestone
- Clear changelog for team

### Branch Strategy

**Simple and effective**:
```
main - Production (always deployable)
feature/issue-34 - Feature branches
```

**Workflow**:
1. Create branch: `git checkout -b feature/issue-34`
2. Work on feature
3. Push: `git push origin feature/issue-34`
4. Create PR
5. Review
6. Merge to main → Auto-deploy

### PR Template

Create `.github/PULL_REQUEST_TEMPLATE.md`:
```markdown
## What does this PR do?
Fixes #issue-number

## Type of change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change

## Checklist
- [ ] Tests pass
- [ ] Code follows style guide
- [ ] Documentation updated
- [ ] Milestone linked
```

---

## 📊 Part 14: Metrics & Reporting

### Weekly Report (Auto-Generated)

**GitHub API Script**:
```javascript
// scripts/weekly-report.js
// Generates weekly report from GitHub data

Output:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ACT Ecosystem - Week of Jan 22
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Sprint Progress:
  Sprint 5: 12 of 15 issues complete (80%)

🎯 Milestones:
  ✅ Security Hardening: 100% (COMPLETE!)
  🟡 Integration Platform: 45% (on track)
  🟢 Empathy Ledger Core: 65% (on track)

👥 Team:
  @ben: 5 issues closed
  @alice: 4 issues closed
  @bob: 3 issues closed

🚀 Deployments:
  15 deployments across 6 projects
  0 rollbacks
  99.9% uptime

🐛 Issues:
  8 bugs fixed
  12 features shipped
  3 new issues created
```

---

## 🎓 Part 15: Onboarding New Developers

### Day 1: Setup

**1. Clone all repos**:
```bash
cd ~/Code
git clone https://github.com/Acurioustractor/act-regenerative-studio
git clone https://github.com/Acurioustractor/empathy-ledger-v2
git clone https://github.com/Acurioustractor/justicehub-platform
git clone https://github.com/Acurioustractor/harvest-community-hub
git clone https://github.com/Acurioustractor/goods-asset-tracker
git clone https://github.com/Acurioustractor/act-farm
```

**2. Install workspace**:
```bash
code ~/Code/ACT-Workspace.code-workspace
```

**3. Install dependencies** (in each repo):
```bash
npm install
```

**4. Get added to GitHub**:
- Add to Acurioustractor organization
- Add to GitHub Project
- Configure notifications

**5. Read docs**:
- This file
- [REPOSITORY_ALIGNMENT.md](./REPOSITORY_ALIGNMENT.md)
- [MILESTONE_IMPLEMENTATION_GUIDE.md](./MILESTONE_IMPLEMENTATION_GUIDE.md)

### Week 1: Learn the Flow

**Assign 3 small issues**:
- Type: Documentation or Enhancement
- Priority: Low
- Good first issues

**Pair with senior dev**:
- Walk through workflow
- Learn VS Code + Claude
- Practice commit messages
- See deployment process

---

## ✅ Success Checklist

After setting this up, you should have:

### Technical Setup
- [ ] VS Code workspace with all 6 repos
- [ ] Claude Code installed and configured
- [ ] GitHub CLI (`gh`) installed
- [ ] Git configured with proper credentials
- [ ] VS Code extensions installed
- [ ] Vercel linked to all repos

### GitHub Configuration
- [ ] All repos have auto-tag workflow
- [ ] GitHub Project has all views created
- [ ] Milestones created in all repos
- [ ] All issues have milestones
- [ ] Slack/Discord webhooks configured
- [ ] Sentry integrated (optional)

### Team Alignment
- [ ] Everyone has access to GitHub Project
- [ ] Team knows how to use views
- [ ] Sprint planning process documented
- [ ] Daily standup format agreed
- [ ] Communication channels set up

### Documentation
- [ ] This workflow documented
- [ ] Team onboarding guide created
- [ ] Commit message guide shared
- [ ] PR template in each repo

---

## 🚀 You Now Have

✅ **Single workspace** for all 6 ACT projects
✅ **AI-powered development** with Claude Code
✅ **Automatic issue tracking** on every commit
✅ **Real-time team visibility** in GitHub Project
✅ **Milestone-driven planning** with dates
✅ **Automatic deployments** on every push
✅ **User feedback loop** via Sentry/issues
✅ **Complete traceability** from idea to production

**This is world-class development workflow** used by the best engineering teams. You have it fully set up for the entire ACT ecosystem! 🎉

---

**Maintained By**: ACT Ecosystem Team
**Last Updated**: 2025-12-26
**Next Review**: When team grows or process needs adjustment
