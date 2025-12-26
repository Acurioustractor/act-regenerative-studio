# Automated Notion Sync Setup Guide

> **Set up automatic syncing between GitHub and Notion every 30 minutes**

---

## 🎯 Overview

You have two options for automated sync:
1. **GitHub Action** (Cloud-based, recommended) - Runs on GitHub's servers
2. **Cron Job** (Local, runs on your machine)

---

## ✅ Option 1: GitHub Action (Recommended)

### Step 1: Add Secrets to GitHub

The workflow needs access to your API tokens. Add these as GitHub repository secrets:

1. **Go to GitHub repository**: https://github.com/Acurioustractor/act-regenerative-studio
2. **Click "Settings"** → **"Secrets and variables"** → **"Actions"**
3. **Click "New repository secret"**

Add these 3 secrets:

| Secret Name | Value | Where to Get |
|-------------|-------|--------------|
| `NOTION_TOKEN` | Your Notion integration token | From .env.local: `ntn_633000104477...` |
| `NOTION_DATABASE_ID` | Your Notion database ID | `2d5ebcf9-81cf-8042-9f40-ef7b39b39ca1` |
| `GH_PROJECT_TOKEN` | GitHub Personal Access Token | From .env.local or create new |

**To create new GitHub token (if needed):**
1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. **IMPORTANT**: Select these exact scopes (checkboxes):
   - ✅ `repo` - Full control of private repositories
   - ✅ `project` - Full access to projects (CRITICAL for Projects v2!)
     - Alternative: `read:project` for read-only (also works)
   - ✅ `read:org` - Read organization membership
4. Copy token and save as `GH_PROJECT_TOKEN` secret

**Having issues finding these scopes?** See [GITHUB_TOKEN_SETUP.md](./GITHUB_TOKEN_SETUP.md) for screenshots and detailed guide.

### Step 2: Push the Workflow File

The workflow file is already created: `.github/workflows/sync-notion.yml`

Just commit and push:

```bash
git add .github/workflows/sync-notion.yml
git commit -m "feat: add automated Notion sync workflow"
git push origin main
```

### Step 3: Verify It's Running

1. **Go to GitHub**: https://github.com/Acurioustractor/act-regenerative-studio/actions
2. **Click "Sync GitHub Issues to Notion"**
3. **You'll see**:
   - Scheduled runs every 30 minutes
   - Manual trigger button ("Run workflow")
   - Run history and logs

### Step 4: Test It Manually

1. Go to Actions tab
2. Click "Sync GitHub Issues to Notion"
3. Click "Run workflow" dropdown
4. Click "Run workflow" button
5. Watch it sync in real-time!

### What Happens Automatically

**Every 30 minutes:**
```
GitHub Action triggers →
  Checks out code →
  Installs dependencies →
  Runs sync script →
  Updates Notion database →
  ✅ All issues synced
```

**When issues change:**
- Issue opened → Sync runs → Appears in Notion
- Issue closed → Sync runs → Moves to "Done" in Notion
- Issue labeled → Sync runs → Updates in Notion

**You can also:**
- Run manually anytime from Actions tab
- Adjust frequency by changing cron schedule
- See logs of every sync run

---

## ✅ Option 2: Local Cron Job

### For Mac/Linux

**Step 1: Create cron job**

```bash
# Edit crontab
crontab -e

# Add this line (runs every 30 minutes):
*/30 * * * * cd "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio" && /bin/bash RUN_NOTION_SYNC.sh >> notion-sync.log 2>&1
```

**Step 2: Verify it's scheduled**

```bash
crontab -l
```

**Step 3: Check logs**

```bash
tail -f "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio/notion-sync.log"
```

### Cron Schedule Options

```bash
# Every 15 minutes
*/15 * * * * cd ... && ./RUN_NOTION_SYNC.sh

# Every hour
0 * * * * cd ... && ./RUN_NOTION_SYNC.sh

# Every 4 hours
0 */4 * * * cd ... && ./RUN_NOTION_SYNC.sh

# Daily at 9am
0 9 * * * cd ... && ./RUN_NOTION_SYNC.sh

# Weekdays at 9am and 5pm
0 9,17 * * 1-5 cd ... && ./RUN_NOTION_SYNC.sh
```

### Pros & Cons

**GitHub Action:**
- ✅ Runs on GitHub's servers (always on)
- ✅ No need to keep your computer on
- ✅ Logs viewable in GitHub
- ✅ Runs on any event (issue opened, closed, etc.)
- ❌ Requires GitHub secrets setup

**Cron Job:**
- ✅ Simple to set up
- ✅ Runs locally with your .env.local
- ✅ No secrets needed in GitHub
- ❌ Requires your computer to be on
- ❌ Stops when computer sleeps
- ❌ No logs in GitHub

---

## 🔧 Customization

### Adjust Sync Frequency

**GitHub Action** - Edit `.github/workflows/sync-notion.yml`:

```yaml
on:
  schedule:
    # Every 15 minutes
    - cron: '*/15 * * * *'

    # Every hour
    - cron: '0 * * * *'

    # Every 6 hours
    - cron: '0 */6 * * *'
```

### Sync Only on Specific Events

**GitHub Action** - Only sync when issues change:

```yaml
on:
  issues:
    types: [opened, edited, closed, reopened]
  # Remove schedule if you don't want automatic polling
```

### Add Slack Notifications

**GitHub Action** - Notify on sync completion:

```yaml
- name: Notify Slack
  if: success()
  uses: slackapi/slack-github-action@v1
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK_URL }}
    payload: |
      {
        "text": "✅ GitHub → Notion sync completed successfully!"
      }
```

---

## 🎯 Recommended Setup

**For teams:**
- Use GitHub Action (runs in cloud)
- Sync every 30 minutes
- Add Slack notifications
- Monitor via Actions tab

**For solo developers:**
- Use GitHub Action (less hassle)
- Or cron job if you prefer local control

**For testing:**
- Use manual trigger in GitHub Actions
- Or run `./RUN_NOTION_SYNC.sh` directly

---

## 📊 Monitoring

### GitHub Action Logs

1. Go to https://github.com/Acurioustractor/act-regenerative-studio/actions
2. Click on a workflow run
3. See detailed logs:
   ```
   Starting GitHub → Notion sync...
   Fetching GitHub Project items...
   Fetched 147 items from GitHub Project
   ✅ Created Notion page for #34
   ✅ Updated Notion page for #35
   ...
   === Sync Complete ===
   Total items: 147
   Created: 5
   Updated: 142
   Errors: 0
   ```

### Check Sync Status

**Last sync time:**
- Open Notion database
- Sort by "Last Synced" property
- See when each issue was last updated

**Verify sync working:**
1. Close an issue in GitHub
2. Wait 30 minutes (or trigger manually)
3. Check Notion - should move to "Done"

---

## 🆘 Troubleshooting

### GitHub Action Not Running

**Check:**
1. Secrets are set correctly in repository settings
2. Workflow file is in `.github/workflows/` folder
3. Main branch has the workflow file

**Fix:**
```bash
# Verify workflow exists
ls -la .github/workflows/sync-notion.yml

# Check workflow syntax
cat .github/workflows/sync-notion.yml
```

### Sync Failing

**Common issues:**

1. **Rate limit exceeded**
   - Solution: Increase sync interval (30min → 1 hour)
   - Or sync only on issue events

2. **Invalid tokens**
   - Solution: Regenerate tokens in GitHub/Notion
   - Update secrets in repository settings

3. **Database not found**
   - Solution: Verify `NOTION_DATABASE_ID` is correct
   - Check database is shared with integration

**View logs:**
- GitHub Action: Actions tab → Click run → View logs
- Cron job: Check `notion-sync.log` file

---

## 🚀 Next Steps

1. **Choose your method** (GitHub Action recommended)
2. **Set up secrets** (for GitHub Action)
3. **Push workflow file** (already created)
4. **Test it** (manual trigger or wait for schedule)
5. **Verify** (check Notion database updates)

---

## 📚 Related Docs

- [QUICK_START.md](./QUICK_START.md) - Initial setup
- [NOTION_GITHUB_SYNC.md](./NOTION_GITHUB_SYNC.md) - Complete integration guide
- [AGILE_WORKFLOW_VSCODE.md](../../operations/AGILE_WORKFLOW_VSCODE.md) - Development workflow

---

**Workflow File**: `.github/workflows/sync-notion.yml`
**Sync Script**: `RUN_NOTION_SYNC.sh`
**Last Updated**: 2025-12-26
