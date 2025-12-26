# Sync GitHub Issues to Notion - Instructions

## ⏰ GitHub Rate Limit Hit

We hit GitHub's API rate limit. It resets in about 1 hour from now.

## 🚀 Run the Sync (When Rate Limit Resets)

### Option 1: Simple Script (Easiest)

```bash
cd "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio"
./RUN_NOTION_SYNC.sh
```

### Option 2: Manual Command

```bash
cd "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio"

# Set environment variables
export NOTION_DATABASE_ID="2d5ebcf9-81cf-8042-9f40-ef7b39b39ca1"

# Load from .env.local
source .env.local

# Run sync
node scripts/sync-github-to-notion.mjs
```

## ✅ What Happens

The sync will:
1. Fetch all 147 issues from GitHub Project
2. Create a Notion page for each issue
3. Map all fields (Status, Priority, Type, Milestone, etc.)
4. Take about 2-3 minutes (rate-limited for Notion API)

## 📊 Expected Output

```
Starting GitHub → Notion sync...

Fetching GitHub Project items...
Fetched 147 items from GitHub Project

✅ Created Notion page for act-regenerative-studio#34
✅ Created Notion page for act-regenerative-studio#35
✅ Created Notion page for act-regenerative-studio#36
... (continues for all 147)

=== Sync Complete ===
Total items: 147
Created: 147
Updated: 0
Skipped: 0
Errors: 0
```

## 🎨 After Sync: Create Kanban View

1. Open your Notion database: https://www.notion.so/acurioustractor/2d5ebcf981cf80429f40ef7b39b39ca1

2. Click **"+ New view"** (top right)

3. Select **"Board"**

4. Name it: **"Sprint Kanban"**

5. **Group by**: Status

6. **Done!** You now have a beautiful drag-and-drop Kanban board!

## 🎯 Your Kanban Board

You'll see columns:
- **📋 Todo** - Issues waiting to be started
- **⏳ In Progress** - Currently being worked on
- **✅ Done** - Completed issues
- **🚫 Blocked** - Issues that are blocked

## 💡 Daily Usage

**Morning**:
1. Open Notion Kanban
2. Drag 3-5 issues from "📋 Todo" → "⏳ In Progress"
3. Assign to yourself

**Development**:
4. Work in VS Code
5. Commit with `Fixes #34`
6. Push and merge

**Automatic**:
7. Re-run sync script (manual or automated)
8. Notion card moves to "✅ Done"

## 🔄 Keep It Synced

### Option A: Manual Sync (When You Want)
```bash
./RUN_NOTION_SYNC.sh
```

### Option B: Automated Sync (Every 15 Minutes)

Add to crontab:
```bash
crontab -e

# Add this line:
*/15 * * * * cd "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio" && ./RUN_NOTION_SYNC.sh >> notion-sync.log 2>&1
```

### Option C: GitHub Action (Cloud-Based)

Already documented in:
- [docs/integrations/notion/QUICK_START.md](docs/integrations/notion/QUICK_START.md)
- [docs/integrations/notion/NOTION_GITHUB_SYNC.md](docs/integrations/notion/NOTION_GITHUB_SYNC.md)

## 📚 Full Documentation

- [Quick Start Guide](docs/integrations/notion/QUICK_START.md)
- [Complete Integration Guide](docs/integrations/notion/NOTION_GITHUB_SYNC.md)
- [Agile Workflow Guide](docs/operations/AGILE_WORKFLOW_VSCODE.md)

## 🆘 Troubleshooting

### Still getting rate limit error?
- Wait 1 hour and try again
- Check when rate limit resets: https://api.github.com/rate_limit

### Sync script not found?
- Make sure you're in the right directory
- Run: `ls -la RUN_NOTION_SYNC.sh` to verify it exists

### Notion pages not appearing?
- Check that database is shared with your Notion integration
- Verify NOTION_DATABASE_ID is correct
- Check for errors in sync output

---

**Ready to sync!** Just wait for the rate limit to reset and run `./RUN_NOTION_SYNC.sh`
