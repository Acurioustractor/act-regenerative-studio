# GitHub Projects + Notion Integration - Complete Setup

**Status**: Ready for implementation
**Created**: 2025-12-26
**Purpose**: World-class project management workflow for ACT Ecosystem

---

## Overview

This document provides the complete setup for:
1. **13 GitHub Project Views** - Filtered views for projects, phases, sprints, and priorities
2. **Notion Database** - Synced database for automated development tracking
3. **Bidirectional Sync** - Real-time synchronization between GitHub and Notion

---

## Architecture Summary

```
┌─────────────────────────────────────────────────────────────┐
│                    ACT Ecosystem Development                 │
│                  (GitHub Projects v2 - Unified Board)        │
└─────────────┬───────────────────────────────────────────────┘
              │
              ├──► 🌍 Ecosystem View (all 138 items)
              ├──► 📖 Empathy Ledger View
              ├──► ⚖️ JusticeHub View
              ├──► 🌾 The Harvest View
              ├──► 🚜 ACT Farm View
              ├──► 🗺️ ACT Placemat View
              ├──► 📦 Goods View (emphasized)
              ├──► 🎨 By LCAA Phase View
              ├──► 📅 Sprint Planning View
              ├──► 🔥 High Priority View
              ├──► 🆕 Good First Issues View
              ├──► 📊 Roadmap View
              └──► 🚧 Cross-Project Work View
                     │
                     ▼
              ┌─────────────────┐
              │  Notion Database │◄──── Team collaboration
              │  (Synced)        │      Non-technical stakeholders
              └──────────────────┘
```

---

## Part 1: GitHub Project Views

### Current Status
✅ **Goods project verified** in ACT Project field options
📋 **Views must be created manually** (GitHub doesn't provide API for view creation)

### Step-by-Step Instructions

Go to: https://github.com/orgs/Acurioustractor/projects/1

Follow detailed instructions in: [github-project-views-setup.md](./github-project-views-setup.md)

**Summary of 13 views to create**:
1. 🌍 Ecosystem View (table, all items)
2. 📖 Empathy Ledger (board, filter: ACT Project = "Empathy Ledger")
3. ⚖️ JusticeHub (board, filter: ACT Project = "JusticeHub")
4. 🌾 The Harvest (board, filter: ACT Project = "The Harvest")
5. 🚜 ACT Farm (board, filter: ACT Project = "ACT Farm")
6. 🗺️ ACT Placemat (board, filter: ACT Project = "ACT Placemat")
7. **📦 Goods** (board, filter: ACT Project = "Goods") ← **User emphasized**
8. 🎨 By LCAA Phase (board, group by: LCAA Phase)
9. 📅 Sprint Planning (table, all sprints)
10. 🔥 High Priority (table, filter: Priority = High/Critical)
11. 🆕 Good First Issues (table, filter: Effort = 1h/3h)
12. 📊 Roadmap (roadmap layout)
13. 🚧 Cross-Project Work (table, filter: ACT Project = "Cross-Project")

**Time required**: ~30 minutes
**Difficulty**: Easy (point-and-click in GitHub UI)

---

## Part 2: Notion Database Setup

### Step 1: Create Notion Integration

1. Go to https://www.notion.so/my-integrations
2. Click "New integration"
3. Settings:
   - **Name**: `ACT GitHub Sync`
   - **Associated workspace**: Your ACT workspace
   - **Capabilities**:
     - ✅ Read content
     - ✅ Update content
     - ✅ Insert content
   - **Type**: Internal integration
4. Click "Submit"
5. **Copy the Internal Integration Token** (starts with `secret_`)
6. Save this as `NOTION_TOKEN` (you'll need it later)

---

### Step 2: Create Notion Database

1. In Notion, create a new page
2. Add a database (full page)
3. Name: `ACT Ecosystem Development`
4. Add all properties from the schema below

#### Complete Database Schema

| Property | Type | Options |
|----------|------|---------|
| Title | Title | - |
| Status | Status | 📋 Backlog, 📝 Todo, 🏗️ In Progress, 👀 In Review, ✅ Done, 🚫 Blocked |
| ACT Project | Select | ACT Main, Empathy Ledger, JusticeHub, The Harvest, ACT Farm, ACT Placemat, **Goods**, Cross-Project |
| LCAA Phase | Select | 🎧 Listen, 🔍 Curiosity, ⚡ Action, 🎨 Art |
| Priority | Select | 🔴 Critical, 🟠 High, 🟡 Medium, 🟢 Low |
| Effort | Select | 1h, 3h, 1d, 3d, 1w, 2w |
| Sprint | Text | - |
| Type | Select | Feature, Bug, Task, Epic |
| Assignees | People | - |
| GitHub URL | URL | - |
| GitHub ID | Number | - |
| Repository | Select | act-regenerative-studio, empathy-ledger-v2, justicehub-platform, theharvest, act-farm, act-placemat, **goods-asset-tracker** |
| Labels | Multi-select | (auto-populated from GitHub) |
| Created | Date | - |
| Updated | Date | - |
| Description | Text | - |
| Comments Count | Number | - |
| Last Synced | Date | - |

5. After creating all properties:
   - Click "..." (top right) → "Add connections"
   - Select "ACT GitHub Sync" integration
   - Click "Confirm"

6. **Copy the database ID** from URL:
   - URL format: `https://notion.so/{workspace}/{DATABASE_ID}?v=...`
   - Extract the `DATABASE_ID` part (long alphanumeric string)
   - Save as `NOTION_DATABASE_ID`

---

### Step 3: Create Supabase Tables

From ACT Studio directory:

```bash
cd "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio"
```

The migration file is ready at:
`supabase/migrations/20251226000000_notion_github_sync.sql`

Apply the migration:

```bash
npx supabase db push
```

This creates:
- `notion_github_sync_log` - Sync operation logs
- `notion_github_mappings` - Notion ↔ GitHub page mappings
- `notion_github_conflicts` - Conflict tracking for manual resolution

---

### Step 4: Add GitHub Secrets

**Option A: Organization-level secrets** (recommended - applies to all repos)

1. Go to: https://github.com/organizations/Acurioustractor/settings/secrets/actions
2. Click "New organization secret"
3. Add each secret:

| Secret Name | Value |
|-------------|-------|
| `NOTION_TOKEN` | Integration token from Step 1 |
| `NOTION_DATABASE_ID` | Database ID from Step 2 |
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key |

**Option B: Repository-level secrets** (per-repo)

For each repo, go to Settings → Secrets and variables → Actions → New repository secret

---

### Step 5: Install Dependencies

In ACT Studio repository:

```bash
npm install @notionhq/client@^2.2.0 @octokit/rest@^20.0.0 --save
```

---

### Step 6: Deploy Sync Workflows

The following files are ready:

- `.github/workflows/sync-to-notion.yml` - GitHub → Notion sync
- `scripts/sync-github-to-notion.js` - Sync script

Commit and push:

```bash
git add .github/workflows/sync-to-notion.yml
git add scripts/sync-github-to-notion.js
git add supabase/migrations/20251226000000_notion_github_sync.sql
git add docs/operations/

git commit -m "feat: add Notion-GitHub bidirectional sync for project management

- GitHub Projects: 13 filtered views for ecosystem workflow
- Notion database: Complete schema with all ACT projects
- Bidirectional sync: Real-time GitHub ↔ Notion synchronization
- Conflict tracking: Supabase tables for conflict resolution
- Documentation: Complete setup guides

Emphasizes Goods project integration with codebase tracking.

🤖 Generated with Claude Code
Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

git push
```

---

### Step 7: Run Initial Sync

Trigger the workflow manually to populate Notion:

```bash
gh workflow run sync-to-notion.yml
```

Monitor the sync:

```bash
gh run list --workflow=sync-to-notion.yml
gh run watch
```

Expected result:
- All 138 GitHub Project items synced to Notion
- Database populated with all fields
- Supabase sync log shows success

---

## Part 3: Verification

### Verify GitHub Project Views

1. Go to https://github.com/orgs/Acurioustractor/projects/1
2. Check view switcher dropdown (top right)
3. Should see all 13 views
4. Test each view:
   - 📦 **Goods View** should show only Goods items
   - 🔥 **High Priority** should show critical/high items
   - 🆕 **Good First Issues** should show 1h/3h tasks

### Verify Notion Database

1. Open Notion database
2. Should see 138 pages (same as GitHub Project items)
3. Check properties are populated:
   - ACT Project field shows "Goods" for goods-asset-tracker items
   - GitHub URL links work
   - Status matches GitHub
   - Last Synced timestamp is recent

### Verify Sync Automation

**Test 1: GitHub → Notion**
1. Create new issue in any ACT repo
2. Add to "ACT Ecosystem Development" project
3. Set ACT Project = "Goods"
4. Wait 15 minutes (or trigger workflow manually)
5. Check Notion: Issue should appear

**Test 2: Check Sync Logs**
```bash
# Query Supabase to see sync history
npx supabase db query "SELECT * FROM notion_github_sync_log ORDER BY started_at DESC LIMIT 5"
```

---

## Daily Workflow

### For Developers (GitHub-first)

1. **Morning**: Check 🔥 High Priority view
2. **Sprint planning**: Use 📅 Sprint Planning view
3. **Project work**: Switch to project-specific view (📦 Goods, 📖 Empathy Ledger, etc.)
4. **Create issues**: In VS Code or GitHub, auto-syncs to Notion
5. **Cross-project**: Check 🚧 Cross-Project Work view

### For Non-Technical Team (Notion-first)

1. **Morning**: Open Notion database
2. **View by project**: Use Notion's built-in filters
3. **Create tasks**: Add new pages in Notion, auto-creates GitHub issues
4. **Update status**: Change status in Notion, syncs to GitHub
5. **Collaboration**: Add comments, assignees in Notion

### For Project Managers

1. **Overview**: Use 🌍 Ecosystem View in GitHub
2. **Sprint planning**: Use 📅 Sprint Planning view
3. **Roadmap**: Use 📊 Roadmap view
4. **Notion reports**: Create custom views in Notion database
5. **Onboarding**: Point new devs to 🆕 Good First Issues

---

## Troubleshooting

### Sync Not Running

**Check workflow status**:
```bash
gh run list --workflow=sync-to-notion.yml
```

**View logs**:
```bash
gh run view <run-id> --log
```

**Trigger manually**:
```bash
gh workflow run sync-to-notion.yml
```

### Items Not Appearing in Notion

1. Check Notion integration has access to database
2. Verify secrets are set correctly
3. Check Supabase sync logs for errors
4. Run manual sync

### Goods Project Items Missing

1. Verify goods-asset-tracker issues are in GitHub Project
2. Check ACT Project field is set to "Goods"
3. Check Repository field in Notion is set to "goods-asset-tracker"
4. Re-run sync

---

## Next Steps

### Phase 2: Enhanced Sync (Future)

- [ ] Notion → GitHub sync script (reverse direction)
- [ ] Comment synchronization
- [ ] File attachment sync
- [ ] Dependency tracking

### Phase 3: Intelligence (Future)

- [ ] Auto-tag LCAA phase using AI
- [ ] Auto-estimate effort using AI
- [ ] Sprint auto-assignment based on capacity
- [ ] Dependency visualization

### Phase 4: Team Onboarding

- [ ] Create onboarding guide pointing to 🆕 Good First Issues
- [ ] Set up team Notion workspace
- [ ] Configure notifications
- [ ] Create team dashboards

---

## Documentation

**Complete guides**:
- [GitHub Project Views Setup](./github-project-views-setup.md) - Detailed view creation instructions
- [Notion-GitHub Sync Architecture](./notion-github-sync.md) - Technical architecture and implementation
- [Multi-Repo Management](./multi-repo-management.md) - Managing multiple ACT repositories
- [Ecosystem Unification](../ECOSYSTEM_UNIFICATION_COMPLETE.md) - Full ecosystem context

**Quick reference**:
- GitHub Project: https://github.com/orgs/Acurioustractor/projects/1
- Notion Integration: https://www.notion.so/my-integrations
- Sync workflow: `.github/workflows/sync-to-notion.yml`
- Sync script: `scripts/sync-github-to-notion.js`

---

## Success Criteria

✅ All 13 GitHub Project views created
✅ Notion database created with complete schema
✅ **Goods project** properly tracked with codebase
✅ Sync automation deployed and running
✅ Initial sync completed (138 items)
✅ Supabase tables created for conflict tracking
✅ Team can work in GitHub or Notion seamlessly

---

**Maintained By**: ACT Ecosystem Team
**Last Updated**: 2025-12-26
**Status**: Ready for implementation
**Time to Complete**: ~2 hours total

---

**🌾 World-class project management for a post-extractive economy 🌾**
