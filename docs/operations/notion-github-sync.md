# Notion-GitHub Sync for ACT Ecosystem

**Purpose**: Bidirectional sync between GitHub Projects and Notion for automated development tracking
**Status**: Architecture designed, ready for implementation
**Created**: 2025-12-26

---

## Overview

This system synchronizes GitHub Projects data with a Notion database, enabling:
- **Notion-first workflow**: Create and manage tasks in Notion
- **GitHub-first workflow**: Create issues in GitHub, auto-sync to Notion
- **Automated tracking**: Real-time updates in both directions
- **Team visibility**: Non-technical stakeholders can use Notion
- **Developer workflow**: Developers continue using GitHub/VS Code

---

## Architecture

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│   GitHub API    │◄────────┤  Sync Service    ├────────►│   Notion API    │
│  (Projects v2)  │         │  (GitHub Action  │         │   (Database)    │
│                 │         │   + Webhook)     │         │                 │
└─────────────────┘         └──────────────────┘         └─────────────────┘
        ▲                            │                            ▲
        │                            │                            │
        │                            ▼                            │
   ┌────┴─────┐              ┌──────────────┐            ┌───────┴────────┐
   │ VS Code  │              │   Supabase   │            │  Notion Web    │
   │ GitHub   │              │   (State)    │            │  Notion Mobile │
   └──────────┘              └──────────────┘            └────────────────┘
```

---

## Notion Database Schema

### Database Name
`ACT Ecosystem Development`

### Properties

| Property | Type | Description | Synced Field |
|----------|------|-------------|--------------|
| **Title** | Title | Issue title | `GitHub issue title` |
| **Status** | Status | Todo/In Progress/Done/Blocked | `GitHub Project Status field` |
| **ACT Project** | Select | Which ACT project | `GitHub Project "ACT Project" field` |
| **LCAA Phase** | Select | Listen/Curiosity/Action/Art | `GitHub Project "LCAA Phase" field` |
| **Priority** | Select | Critical/High/Medium/Low | `GitHub Project "Priority" field` |
| **Effort** | Select | 1h/3h/1d/3d/1w/2w | `GitHub Project "Effort" field` |
| **Sprint** | Text | Sprint assignment | `GitHub Project "Sprint" field` |
| **Type** | Select | Feature/Bug/Task/Epic | `GitHub issue labels` |
| **Assignees** | People | Who's working on it | `GitHub assignees` |
| **GitHub URL** | URL | Link to issue | `GitHub issue URL` |
| **GitHub ID** | Number | Issue number | `GitHub issue number` |
| **Repository** | Select | Which repo | `GitHub repository name` |
| **Labels** | Multi-select | All GitHub labels | `GitHub labels` |
| **Created** | Date | When created | `GitHub created_at` |
| **Updated** | Date | Last updated | `GitHub updated_at` |
| **Description** | Text | Issue body | `GitHub issue body` |
| **Comments Count** | Number | # of comments | `GitHub comments count` |
| **Last Synced** | Date | Last sync timestamp | Auto-updated by sync service |

### Status Options
- 📋 **Backlog** (maps to GitHub: "Backlog")
- 📝 **Todo** (maps to GitHub: "Todo")
- 🏗️ **In Progress** (maps to GitHub: "In Progress")
- 👀 **In Review** (maps to GitHub: "In Review")
- ✅ **Done** (maps to GitHub: "Done")
- 🚫 **Blocked** (maps to GitHub: "Blocked")

### ACT Project Options
- ACT Main
- Empathy Ledger
- JusticeHub
- The Harvest
- ACT Farm
- ACT Placemat
- **Goods** ← Emphasized
- Cross-Project

### LCAA Phase Options
- 🎧 Listen
- 🔍 Curiosity
- ⚡ Action
- 🎨 Art

### Priority Options
- 🔴 Critical
- 🟠 High
- 🟡 Medium
- 🟢 Low

### Effort Options
- 1h
- 3h
- 1d
- 3d
- 1w
- 2w

### Repository Options
- act-regenerative-studio
- empathy-ledger-v2
- justicehub-platform
- theharvest
- act-farm
- act-placemat
- **goods-asset-tracker** ← Emphasized
- act-project-template

---

## Sync Service Implementation

### Technology Stack
- **GitHub Actions**: Scheduled sync + webhook triggers
- **Supabase Functions**: Serverless sync logic
- **Supabase Database**: Sync state tracking
- **Notion API**: Database updates
- **GitHub API**: Projects v2 queries

### Sync Frequency
- **GitHub → Notion**: Real-time (webhook triggered) + 15-minute backup cron
- **Notion → GitHub**: 15-minute polling (Notion doesn't support webhooks well)

---

## GitHub Actions Workflows

### 1. GitHub → Notion Sync (Event-Driven)

**File**: `.github/workflows/sync-to-notion.yml`

```yaml
name: Sync GitHub to Notion

on:
  issues:
    types: [opened, edited, closed, reopened, assigned, labeled]
  project_card:
    types: [created, moved, deleted]
  schedule:
    - cron: '*/15 * * * *'  # Backup: every 15 minutes
  workflow_dispatch:  # Manual trigger

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm install @notionhq/client @octokit/rest

      - name: Sync to Notion
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NOTION_TOKEN: ${{ secrets.NOTION_TOKEN }}
          NOTION_DATABASE_ID: ${{ secrets.NOTION_DATABASE_ID }}
          GITHUB_PROJECT_ID: 'PVT_kwHOCOopjs4BLVik'
        run: node scripts/sync-github-to-notion.js
```

---

### 2. Notion → GitHub Sync (Polling)

**File**: `.github/workflows/sync-from-notion.yml`

```yaml
name: Sync Notion to GitHub

on:
  schedule:
    - cron: '*/15 * * * *'  # Every 15 minutes
  workflow_dispatch:  # Manual trigger

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm install @notionhq/client @octokit/rest

      - name: Sync from Notion
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NOTION_TOKEN: ${{ secrets.NOTION_TOKEN }}
          NOTION_DATABASE_ID: ${{ secrets.NOTION_DATABASE_ID }}
          GITHUB_PROJECT_ID: 'PVT_kwHOCOopjs4BLVik'
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
        run: node scripts/sync-notion-to-github.js
```

---

## Sync Scripts

### GitHub → Notion Script

**File**: `scripts/sync-github-to-notion.js`

**Logic**:
1. Fetch all items from GitHub Project (GraphQL)
2. For each item:
   - Check if exists in Notion (by GitHub ID)
   - If exists: Update Notion page with latest data
   - If not: Create new Notion page
3. Update "Last Synced" timestamp
4. Log results to Supabase for monitoring

**Key Notion API calls**:
```javascript
// Create page
await notion.pages.create({
  parent: { database_id: NOTION_DATABASE_ID },
  properties: {
    Title: { title: [{ text: { content: issue.title } }] },
    Status: { status: { name: statusMapping[projectStatus] } },
    'ACT Project': { select: { name: actProject } },
    'GitHub URL': { url: issue.html_url },
    'GitHub ID': { number: issue.number },
    // ... all other fields
  }
});

// Update page
await notion.pages.update({
  page_id: notionPageId,
  properties: { /* updated fields */ }
});
```

---

### Notion → GitHub Script

**File**: `scripts/sync-notion-to-github.js`

**Logic**:
1. Query Notion database for pages updated since last sync
2. For each updated page:
   - Find corresponding GitHub issue (by GitHub ID)
   - Update GitHub issue fields that changed
   - Update GitHub Project custom fields
3. Store last sync timestamp in Supabase
4. Log results

**Key GitHub API calls**:
```javascript
// Update issue
await octokit.issues.update({
  owner: 'Acurioustractor',
  repo: repoName,
  issue_number: githubId,
  title: notionTitle,
  body: notionDescription,
  state: notionStatus === 'Done' ? 'closed' : 'open'
});

// Update project item fields (GraphQL)
await octokit.graphql(`
  mutation {
    updateProjectV2ItemFieldValue(input: {
      projectId: "${PROJECT_ID}"
      itemId: "${itemId}"
      fieldId: "${fieldId}"
      value: { singleSelectOptionId: "${optionId}" }
    }) {
      projectV2Item { id }
    }
  }
`);
```

---

## Supabase Sync State Table

**Table**: `notion_github_sync_log`

```sql
CREATE TABLE notion_github_sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sync_direction TEXT NOT NULL, -- 'github_to_notion' | 'notion_to_github'
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  status TEXT NOT NULL, -- 'running' | 'success' | 'error'
  items_synced INTEGER,
  items_created INTEGER,
  items_updated INTEGER,
  errors JSONB,
  metadata JSONB
);

CREATE INDEX idx_sync_log_direction ON notion_github_sync_log(sync_direction);
CREATE INDEX idx_sync_log_started ON notion_github_sync_log(started_at DESC);
```

**Table**: `notion_github_mappings`

```sql
CREATE TABLE notion_github_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  github_issue_id INTEGER NOT NULL,
  github_repo TEXT NOT NULL,
  notion_page_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(github_repo, github_issue_id)
);

CREATE INDEX idx_mappings_notion ON notion_github_mappings(notion_page_id);
CREATE INDEX idx_mappings_github ON notion_github_mappings(github_repo, github_issue_id);
```

---

## Conflict Resolution

### Strategy: Last-Write-Wins with Safeguards

**Scenario 1**: GitHub updated, Notion not yet synced
- ✅ GitHub → Notion sync overwrites Notion

**Scenario 2**: Notion updated, GitHub not yet synced
- ✅ Notion → GitHub sync overwrites GitHub

**Scenario 3**: Both updated within 15-minute window
- ⚠️ Conflict detected (compare timestamps)
- 🛡️ Safeguard: Don't overwrite if both changed in < 2 minutes
- 📝 Log conflict to Supabase
- 👤 Manual resolution required (show in admin dashboard)

**Conflict Dashboard**:
- New page: `/admin/sync-conflicts`
- Shows items with conflicts
- Side-by-side comparison
- Manual merge buttons

---

## Setup Instructions

### Step 1: Create Notion Integration

1. Go to https://www.notion.so/my-integrations
2. Click "New integration"
3. Name: `ACT GitHub Sync`
4. Associated workspace: Your ACT workspace
5. Capabilities:
   - ✅ Read content
   - ✅ Update content
   - ✅ Insert content
6. Copy **Internal Integration Token**
7. Save as `NOTION_TOKEN` in GitHub secrets

---

### Step 2: Create Notion Database

1. Create new database in Notion: `ACT Ecosystem Development`
2. Add all properties from schema above
3. Click "..." → "Add connections" → Select "ACT GitHub Sync" integration
4. Copy database ID from URL:
   - URL: `https://notion.so/{workspace}/{database_id}?v=...`
   - Extract: `database_id`
5. Save as `NOTION_DATABASE_ID` in GitHub secrets

---

### Step 3: Create Supabase Tables

```bash
# From ACT Studio directory
cd /Users/benknight/Code/ACT\ Farm\ and\ Regenerative\ Innovation\ Studio
```

Create migration:
```sql
-- File: supabase/migrations/YYYYMMDD_notion_github_sync.sql
-- (See Supabase Sync State Table section above)
```

Apply migration:
```bash
npx supabase db push
```

---

### Step 4: Add GitHub Secrets

Go to each ACT repo → Settings → Secrets and variables → Actions

Add:
- `NOTION_TOKEN` - Notion integration token
- `NOTION_DATABASE_ID` - Notion database ID
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key

**Or**: Add to organization-level secrets (applies to all repos)
- Go to https://github.com/organizations/Acurioustractor/settings/secrets/actions
- Add all secrets there

---

### Step 5: Install Sync Scripts

**In act-regenerative-studio** (central sync hub):

```bash
mkdir -p scripts
# Copy sync scripts (will be created next)
npm install @notionhq/client @octokit/rest --save
```

---

### Step 6: Deploy Workflows

```bash
mkdir -p .github/workflows
# Copy workflow YAML files (see above)
git add .github/workflows/sync-*.yml scripts/sync-*.js
git commit -m "feat: add Notion-GitHub bidirectional sync"
git push
```

---

### Step 7: Initial Sync

Run manual sync to populate Notion:

```bash
# Trigger GitHub Action manually
gh workflow run sync-to-notion.yml

# Monitor
gh run list --workflow=sync-to-notion.yml
gh run watch
```

Expected result:
- All 138 GitHub Project items created in Notion
- Notion database populated with all fields
- Supabase log shows successful sync

---

## Testing Strategy

### Test 1: GitHub → Notion
1. Create new issue in GitHub
2. Add to ACT Ecosystem Project
3. Set ACT Project = "Goods"
4. Wait 15 minutes (or trigger workflow manually)
5. Verify: Issue appears in Notion with all fields correct

### Test 2: Notion → GitHub
1. Create new page in Notion database
2. Fill all required fields
3. Set ACT Project = "Goods"
4. Wait 15 minutes
5. Verify: Issue created in goods-asset-tracker repo and added to project

### Test 3: GitHub Update → Notion
1. Update issue status in GitHub Project
2. Wait 15 minutes
3. Verify: Notion page status updated

### Test 4: Notion Update → GitHub
1. Change priority in Notion
2. Wait 15 minutes
3. Verify: GitHub Project priority updated

### Test 5: Conflict Handling
1. Update same field in both systems within 1 minute
2. Wait 15 minutes
3. Verify: Conflict logged to Supabase
4. Verify: Conflict appears in `/admin/sync-conflicts`

---

## Monitoring Dashboard

**New page**: `/admin/notion-sync`

**Features**:
- Sync status indicator (last sync time, next sync time)
- Sync history (last 20 syncs)
- Items synced count
- Error log
- Manual sync trigger buttons
- Conflict resolution interface

**Component**: `src/components/admin/NotionSyncDashboard.tsx`

---

## Notion Views for Team

Create these views in Notion database:

1. **By Project** - Group by ACT Project (shows Goods separately)
2. **By Status** - Kanban board view
3. **By LCAA Phase** - Group by methodology
4. **Sprint Board** - Filter current sprint, group by status
5. **My Tasks** - Filter by assignee = current user
6. **High Priority** - Filter Priority = High or Critical
7. **Goods Project** - Filter ACT Project = "Goods" (emphasized)

---

## Performance Optimization

### Rate Limits
- **GitHub API**: 5000 requests/hour (authenticated)
- **Notion API**: 3 requests/second (average over 1 minute)

### Optimization Strategies
1. **Batch updates**: Group multiple updates in single GraphQL query
2. **Delta sync**: Only sync changed items (use `updated_at` timestamps)
3. **Parallel processing**: Sync different projects concurrently
4. **Caching**: Store field ID mappings to reduce API calls

### Expected Performance
- Initial sync (138 items): ~5 minutes
- Delta sync (10 changed items): ~30 seconds
- Per-item sync time: ~2 seconds

---

## Future Enhancements

### Phase 2: Advanced Features
- **Comment sync**: Sync GitHub comments to Notion page comments
- **File attachments**: Sync GitHub attachments to Notion
- **Relations**: Link related issues across Notion and GitHub
- **Activity feed**: Show sync activity in ecosystem dashboard

### Phase 3: Intelligence
- **Auto-tagging**: Use AI to suggest LCAA phase, effort, priority
- **Sprint planning**: Auto-assign issues to sprints based on capacity
- **Dependency tracking**: Detect and visualize issue dependencies

---

## Troubleshooting

### Problem: Items not syncing
**Check**:
1. GitHub Action logs: `gh run list --workflow=sync-to-notion.yml`
2. Supabase sync log table
3. Notion integration permissions
4. GitHub secrets are set correctly

### Problem: Conflicts not resolving
**Solution**: Check `/admin/sync-conflicts` dashboard, manually merge

### Problem: Notion database missing items
**Solution**: Run manual sync: `gh workflow run sync-to-notion.yml`

### Problem: Duplicate items created
**Solution**: Check `notion_github_mappings` table, delete duplicates in Notion, re-sync

---

## Related Documentation

- [GitHub Project Views Setup](./github-project-views-setup.md)
- [Multi-Repo Management](./multi-repo-management.md)
- [Ecosystem Unification](../ECOSYSTEM_UNIFICATION_COMPLETE.md)

---

**Maintained By**: ACT Ecosystem Team
**Last Updated**: 2025-12-26
**Status**: Architecture complete, ready for implementation
**Next Step**: Create sync scripts and deploy workflows
