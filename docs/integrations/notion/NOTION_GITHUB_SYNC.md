# Notion + GitHub Integration Guide

> **Use Notion as your Kanban board, sync with GitHub Issues & Projects**

---

## 🎯 The Vision

```
Notion (Kanban Board)  ↔  GitHub (Issues & Projects)  ↔  VS Code
     ↑                            ↑                          ↑
  Drag & Drop              Auto-sync on commit         Code & commit
  Beautiful UI             Project automation          GitHub extension
  Team planning            Milestone tracking          Development
```

---

## 📋 Step 1: Set Up Notion Database for Issues

### Create Issues Database in Notion

1. **Go to your Notion workspace**
2. **Create new database**: "ACT Development Issues"
3. **Set up properties**:

| Property | Type | Options |
|----------|------|---------|
| **Title** | Title | - |
| **Status** | Select | 📋 Todo, ⏳ In Progress, ✅ Done, 🚫 Blocked |
| **Priority** | Select | 🔴 Critical, 🟠 High, 🟡 Medium, 🟢 Low |
| **Type** | Select | Security, Bug, Feature, Enhancement, etc. |
| **ACT Project** | Select | ACT Main, Empathy Ledger, JusticeHub, etc. |
| **Milestone** | Select | Security Hardening, Empathy Ledger Core, etc. |
| **Sprint** | Select | Backlog, Sprint 4, Sprint 5, etc. |
| **Assignee** | Person | Team members |
| **Due Date** | Date | - |
| **Effort** | Select | 30m, 1h, 2h, 4h, 1d, 2d, 1w |
| **GitHub Issue #** | Number | - |
| **GitHub URL** | URL | - |
| **Description** | Text | - |

4. **Create views**:
   - **Kanban**: Group by Status
   - **Sprint Board**: Filter by Sprint, group by Status
   - **Timeline**: Calendar view by Due Date
   - **Priority Matrix**: Group by Priority
   - **My Tasks**: Filter by Assignee = You

### Get Database ID

1. Open the database in Notion
2. Copy the URL: `https://notion.so/workspace/177ebcf981cf80dd9514f1ec32f3314c?v=...`
3. Database ID is: `177ebcf9-81cf-80dd-9514-f1ec32f3314c`

---

## 🔄 Step 2: Set Up Bidirectional Sync

### Install Notion SDK

```bash
cd "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio"
npm install @notionhq/client
```

### Create Sync Scripts

I'll create 3 scripts:
1. **`scripts/sync-github-to-notion.js`** - Import GitHub issues to Notion
2. **`scripts/sync-notion-to-github.js`** - Export Notion updates to GitHub
3. **`scripts/notion-github-webhook.js`** - Real-time sync on changes

---

## 📥 Step 3: Import Existing GitHub Issues to Notion

### Run Initial Sync

```bash
cd "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio"

export GH_PROJECT_TOKEN=your_github_token_here
export NOTION_TOKEN=your_notion_token_here
export NOTION_ISSUES_DATABASE_ID=your_new_database_id_here

node scripts/sync-github-to-notion.js
```

**What it does**:
- Reads all 147 issues from GitHub Project
- Creates corresponding pages in Notion database
- Maps fields: Status, Priority, Type, Milestone, etc.
- Stores GitHub issue # and URL for linking

**Expected output**:
```
📥 Syncing GitHub → Notion

Fetching issues from GitHub Project...
Found 147 issues

Creating Notion pages...
  ✅ #34: Security vulnerability in auth flow
  ✅ #35: Add input validation to prevent SQL injection
  ✅ #36: Add rate limiting to prevent brute force attacks
  ... (continues for all 147)

Summary:
  Total issues: 147
  Created in Notion: 147
  Errors: 0

🎉 Sync complete! Open Notion to see your Kanban board.
```

---

## 📤 Step 4: Set Up Notion → GitHub Sync

### Workflow

When you **update an issue in Notion**:
1. Change Status from "Todo" → "In Progress"
2. Run sync script (or use automation)
3. GitHub issue gets updated automatically

### Manual Sync

```bash
node scripts/sync-notion-to-github.js
```

**What it does**:
- Checks for Notion pages updated since last sync
- Updates corresponding GitHub issues
- Updates GitHub Project fields
- Logs all changes

### Automated Sync (Optional)

**Option A: Cron Job** (runs every 15 minutes)
```bash
# Add to crontab
*/15 * * * * cd /Users/benknight/Code/ACT\ Farm\ and\ Regenerative\ Innovation\ Studio && node scripts/sync-notion-to-github.js
```

**Option B: GitHub Action** (runs on schedule)
```yaml
# .github/workflows/sync-notion.yml
name: Sync Notion to GitHub
on:
  schedule:
    - cron: '*/15 * * * *'  # Every 15 minutes
  workflow_dispatch:  # Manual trigger
jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm install
      - run: node scripts/sync-notion-to-github.js
        env:
          NOTION_TOKEN: ${{ secrets.NOTION_TOKEN }}
          GH_PROJECT_TOKEN: ${{ secrets.GH_PROJECT_TOKEN }}
```

**Option C: Notion Webhooks** (real-time)
- Set up webhook endpoint
- Notion calls it when database changes
- Sync happens immediately

---

## 🎨 Step 5: Use Notion for Daily Work

### Morning Routine

1. **Open Notion** (in browser or desktop app)
2. **Go to "ACT Development Issues" database**
3. **Switch to Kanban view** (grouped by Status)
4. **Drag 3-5 issues** from "Todo" → "In Progress"
5. **Assign to yourself**
6. **Close Notion**

### Development in VS Code

7. **Open VS Code**
8. **Use GitHub extension** to see assigned issues
   - They're already synced from Notion
9. **Work through them** as normal
10. **Commit with "Fixes #34"**

### Automatic Sync

11. **When you merge PR**:
    - GitHub issue closes
    - Sync script updates Notion
    - Card moves to "Done" in Kanban
    - No manual work needed!

---

## 🔧 Step 6: Notion VS Code Extension

### Install Notion Extension

```bash
code --install-extension notion.notion-vscode
```

**Features**:
- View Notion pages in sidebar
- Search Notion from Command Palette
- Create new pages quickly

### Configure in Workspace

Add to `ACT-Ecosystem.code-workspace`:
```json
"settings": {
  "notion.database": "177ebcf9-81cf-80dd-9514-f1ec32f3314c",
  "notion.defaultView": "kanban"
}
```

### Usage

1. Press `Cmd+Shift+P`
2. Type "Notion: Open Database"
3. See your Kanban board in VS Code sidebar!

---

## 🤖 Step 7: Automation Workflows

### When Issue Created in GitHub

```
GitHub Action (auto-tag) runs →
  ✅ Sets all default fields
  ✅ Assigns milestone
  ↓
Sync script runs (every 15 min) →
  ✅ Creates Notion page
  ✅ Shows in Kanban board
```

### When You Update in Notion

```
You change Status to "In Progress" →
  ↓
Sync script runs (every 15 min) →
  ✅ Updates GitHub issue
  ✅ Updates GitHub Project field
  ↓
Team sees update in GitHub
```

### When PR Merged

```
PR merges with "Fixes #34" →
  ✅ GitHub issue closes
  ↓
Sync script runs (every 15 min) →
  ✅ Notion Status → "Done"
  ✅ Card moves to Done column
```

---

## 📊 Advanced: Notion Dashboard

### Create Sprint Dashboard Page

In Notion, create a page with:

**1. Current Sprint Overview**
- Embed filtered view: Sprint = "Sprint 5"
- Shows only current sprint issues

**2. Progress Charts**
- Burndown chart (manual or automated)
- Completion percentage
- Issues by Type/Priority

**3. Team Workload**
- Table grouped by Assignee
- Shows each person's tasks

**4. Blocked Issues**
- Filter: Status = "Blocked"
- Quick view of what needs unblocking

**5. This Week's Completions**
- Filter: Status = "Done" AND Completed Date > Start of Week
- Celebrate wins!

### Example Dashboard

```
📊 Sprint 5: Security Hardening
Due: January 31, 2025

Progress: ▓▓▓▓▓▓░░░░ 60% (6/10 complete)

┌─────────────────────────────────────┐
│  👤 Team Workload                   │
├─────────────────────────────────────┤
│  Ben: 3 tasks (1 in progress)       │
│  Alice: 2 tasks (2 in progress)     │
│  Charlie: 1 task (done)             │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  🚨 Blocked Issues                  │
├─────────────────────────────────────┤
│  #42: Waiting on API design         │
└─────────────────────────────────────┘

[Embedded Kanban View]
```

---

## 🎯 Complete Workflow Example

### Monday (Sprint Planning)

**In Notion**:
1. Create new Sprint 6 in Select property
2. Drag 15 issues from Backlog to Sprint 6
3. Assign team members
4. Set due dates

**Auto-sync runs**:
- Updates GitHub Project Sprint field
- Team sees assignments in GitHub

### Tuesday-Friday (Development)

**Morning in Notion**:
1. Open Kanban view
2. Drag your 3 tasks to "In Progress"

**Development in VS Code**:
3. Code and commit: "Fixes #34"
4. Push and merge PR

**Auto-sync runs**:
5. Notion card moves to "Done"
6. Milestone progress updates

### Friday (Retrospective)

**In Notion**:
1. Open Sprint 6 dashboard
2. Review completion: 12/15 done (80%)
3. Move incomplete items to Sprint 7
4. Celebrate wins!

**Auto-sync runs**:
- Updates GitHub Project for next sprint

---

## 🔐 Environment Variables Needed

Add to `.env.local`:

```bash
# Already have these:
NOTION_TOKEN=your_notion_token_here

# Add this (your new Issues database):
NOTION_ISSUES_DATABASE_ID=your_database_id_here

# Already have this:
GH_PROJECT_TOKEN=your_github_token_here
```

---

## 📚 Related Docs

- [Notion API Docs](https://developers.notion.com/)
- [GitHub GraphQL API](https://docs.github.com/en/graphql)
- [AGILE_WORKFLOW_VSCODE.md](../operations/AGILE_WORKFLOW_VSCODE.md)

---

## 🚀 Next Steps

1. **Create Notion Issues database** (5 min)
2. **Get database ID** (1 min)
3. **I'll create sync scripts** (15 min)
4. **Run initial sync** (2 min)
5. **Test the workflow** (10 min)
6. **Set up automation** (5 min)

**Total setup time**: ~40 minutes for complete Notion + GitHub integration

---

**Ready to start?** Let me know and I'll create the sync scripts!

**Last Updated**: 2025-12-26
**Maintained By**: ACT Development Team
