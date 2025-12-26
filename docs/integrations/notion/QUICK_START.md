# Notion Integration Quick Start

> **Get your Kanban board running in 10 minutes**

---

## ✅ Step 1: Create Notion Database (5 min)

### Option A: Use Setup Script (Automated)

```bash
cd "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio"

# Install Notion SDK if not already installed
npm install @notionhq/client

# Set parent page ID (get from Notion workspace)
export NOTION_PARENT_PAGE_ID=your_page_id_here

# Run setup
node scripts/setup-notion-database.js
```

**To get your parent page ID**:
1. Open Notion in browser
2. Create or open a page where you want the database
3. Copy the URL: `https://notion.so/workspace/PAGE_ID?v=...`
4. Extract `PAGE_ID` from URL
5. Use it as `NOTION_PARENT_PAGE_ID`

### Option B: Manual Setup (Easy)

1. **Go to Notion**
2. **Create new database**: Click "+ New" → "Table - Database"
3. **Name it**: "ACT Development Issues"
4. **Add these properties**:

| Property | Type | Values |
|----------|------|--------|
| Status | Select | 📋 Todo, ⏳ In Progress, ✅ Done, 🚫 Blocked |
| Priority | Select | 🔴 Critical, 🟠 High, 🟡 Medium, 🟢 Low |
| Type | Select | Security, Bug, Feature, Enhancement, Data, Integration |
| ACT Project | Select | ACT Main, Empathy Ledger, JusticeHub, The Harvest, Goods, ACT Farm |
| Milestone | Select | Security Hardening, Empathy Ledger Core, JusticeHub Alpha, etc. |
| Sprint | Select | Backlog, Sprint 4, Sprint 5, Sprint 6 |
| Assignee | Person | (Your team members) |
| Due Date | Date | - |
| Effort | Select | 30m, 1h, 2h, 4h, 1d, 2d, 1w |
| GitHub Issue # | Number | - |
| GitHub URL | URL | - |
| Repository | Select | act-regenerative-studio, empathy-ledger-v2, justicehub-platform, etc. |
| Description | Text | - |
| Last Synced | Date | - |

5. **Get database ID**:
   - Copy database URL: `https://notion.so/workspace/DATABASE_ID?v=...`
   - Extract `DATABASE_ID`

---

## ✅ Step 2: Sync GitHub Issues (2 min)

```bash
cd "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio"

# Set environment variables
export NOTION_TOKEN=your_notion_token_here
export NOTION_ISSUES_DATABASE_ID=your_database_id_here
export GITHUB_TOKEN=your_github_token_here

# Or use from .env.local
export NOTION_DATABASE_ID=your_database_id_here

# Run sync
node scripts/sync-github-to-notion.js
```

**Result**: All 147 GitHub issues imported to Notion!

---

## ✅ Step 3: Create Kanban View (1 min)

1. **Open Notion database**
2. **Click "+ New view"** (top right)
3. **Select "Board"**
4. **Name**: "Sprint Kanban"
5. **Group by**: Status
6. **Done!**

Now you have a beautiful drag-and-drop Kanban board!

---

## ✅ Step 4: Daily Usage

### Morning Planning (Notion)

1. Open Notion Kanban view
2. Drag 3-5 issues from "📋 Todo" → "⏳ In Progress"
3. Assign to yourself

### Development (VS Code)

4. Open VS Code
5. Work on code
6. Commit with `Fixes #34`
7. Push and merge

### Auto-sync (Every 15 min)

8. Sync script runs (or run manually)
9. Notion card moves to "✅ Done"
10. Move to next task!

---

## 🎨 Recommended Views

### 1. Kanban by Status
**Group by**: Status
**Filter**: Sprint = Current
**Use**: Daily workflow

### 2. My Tasks
**Filter**: Assignee = You AND Status ≠ Done
**Sort**: Priority (descending)
**Use**: See your workload

### 3. Sprint Timeline
**View type**: Timeline
**Date property**: Due Date
**Filter**: Sprint = Current
**Use**: Sprint planning

### 4. All Backlog
**Filter**: Sprint = Backlog
**Sort**: Priority (descending)
**Use**: Sprint planning

---

## 🔄 Sync Options

### Option A: Manual Sync (Simple)

Run whenever you want to sync:
```bash
node scripts/sync-github-to-notion.js
```

### Option B: Cron Job (Automated)

Add to crontab (runs every 15 min):
```bash
*/15 * * * * cd /path/to/project && node scripts/sync-github-to-notion.js >> sync.log 2>&1
```

### Option C: GitHub Action (Cloud)

Create `.github/workflows/sync-notion.yml`:
```yaml
name: Sync Notion
on:
  schedule:
    - cron: '*/15 * * * *'
jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm install
      - run: node scripts/sync-github-to-notion.js
        env:
          NOTION_TOKEN: ${{ secrets.NOTION_TOKEN }}
          NOTION_DATABASE_ID: ${{ secrets.NOTION_DATABASE_ID }}
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

---

## 🚀 Notion VS Code Extension

1. **Install**: Search "Notion" in VS Code extensions
2. **Sign in**: Connect your Notion account
3. **Access**: Press `Cmd+Shift+P` → "Notion: Open Database"
4. **View**: See your Kanban board in VS Code sidebar!

---

## 💡 Pro Tips

### Keyboard Shortcuts in Notion

- **Create new issue**: Click "+ New" in database
- **Open issue**: Click title
- **Move between columns**: Drag & drop
- **Change property**: Click property value
- **Filter**: Click "Filter" button
- **Sort**: Click "Sort" button

### Notion Mobile App

- Install Notion on your phone
- Access your Kanban board anywhere
- Update issues on the go
- Syncs back to GitHub automatically!

### Team Collaboration

- **Share database** with team members
- **Assign tasks** by clicking Assignee property
- **Comment** on issues (@mention teammates)
- **Subscribe** to get notifications

---

## 🎯 Complete Workflow Example

**Monday Morning (Sprint Planning)**:
1. Open Notion
2. Go to "All Backlog" view
3. Drag 15 issues to "Sprint 5"
4. Assign team members
5. Set priorities and due dates

**Tuesday-Friday (Development)**:
1. Open Notion Kanban
2. Drag your 3 tasks to "In Progress"
3. Work in VS Code
4. Commit with "Fixes #34"
5. Merge PR
6. Sync runs → Card moves to "Done"

**Friday (Review)**:
1. Open "Sprint 5" view
2. See 12/15 done (80% complete)
3. Move incomplete to next sprint
4. Celebrate! 🎉

---

## 🆘 Troubleshooting

### Database not syncing?
- Check NOTION_DATABASE_ID is correct
- Check NOTION_TOKEN has access to database
- Share database with integration

### Missing issues?
- Check GitHub Project has all issues
- Run sync manually to see errors
- Check Notion API rate limits

### Duplicate issues?
- Sync script checks GitHub Issue # and Repository
- Should not create duplicates
- If duplicates exist, delete and re-sync

---

## 📚 Next Steps

- [Full Notion + GitHub Integration Guide](./NOTION_GITHUB_SYNC.md)
- [AGILE_WORKFLOW_VSCODE.md](../../operations/AGILE_WORKFLOW_VSCODE.md)
- [WORLD_CLASS_WORKFLOW.md](../../operations/WORLD_CLASS_WORKFLOW.md)

---

**Questions?** Check the full integration guide or ask for help!

**Last Updated**: 2025-12-26
