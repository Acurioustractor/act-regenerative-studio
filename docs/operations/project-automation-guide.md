# Project Management Automation Guide

**Purpose**: Automate ACT Project field assignment, labels, and Notion sync
**Created**: 2025-12-26
**Status**: Ready to deploy

---

## Overview

This guide explains the **fully automated** project management workflow where:
- ✅ Issues/PRs are **automatically tagged** with the correct ACT Project based on repository
- ✅ Repository-specific **labels are auto-added**
- ✅ Everything **auto-syncs to Notion** with proper fields
- ✅ **Zero manual tagging** required

---

## How Automation Works

### Step 1: Create Issue in Any Repo

When you create an issue in **any ACT repository**:

```bash
# Example: Create issue in goods-asset-tracker
gh issue create --repo Acurioustractor/goods-asset-tracker \
  --title "Add barcode scanning feature" \
  --body "Need to scan QR codes for inventory tracking"
```

### Step 2: Auto-Tagging Workflow Runs

The GitHub Action `.github/workflows/auto-tag-project-items.yml` automatically:

1. **Adds issue to project** (ACT Ecosystem Development)
2. **Sets ACT Project field** based on repository:
   - `goods-asset-tracker` → ACT Project = "Goods"
   - `empathy-ledger-v2` → ACT Project = "Empathy Ledger"
   - `justicehub-platform` → ACT Project = "JusticeHub"
   - etc.
3. **Adds repository-specific labels**:
   - `goods-asset-tracker` → Adds labels: `goods`, `asset-tracking`, `circular-economy`
   - `empathy-ledger-v2` → Adds labels: `empathy-ledger`, `storytelling`
   - etc.

### Step 3: Notion Sync Runs

The sync workflow `.github/workflows/sync-to-notion.yml` automatically:

1. **Detects new issue** (triggered by issue creation event)
2. **Creates Notion page** with all fields populated:
   - Title, Description, GitHub URL, GitHub ID
   - **ACT Project** = "Goods" (from Step 2)
   - **Repository** = "goods-asset-tracker"
   - **Labels** = ["goods", "asset-tracking", "circular-economy"]
   - **Type** = Auto-detected from labels
   - Status, Created, Updated timestamps

### Result

**You do nothing.** The issue is:
- ✅ In GitHub Project with correct ACT Project field
- ✅ In Notion database with all fields populated
- ✅ Labeled properly for filtering
- ✅ Ready for sprint planning

---

## Repository → ACT Project Mapping

The auto-tagging workflow uses this mapping:

| Repository | ACT Project Field | Auto-Added Labels |
|------------|-------------------|-------------------|
| `goods-asset-tracker` | **Goods** | goods, asset-tracking, circular-economy |
| `empathy-ledger-v2` | Empathy Ledger | empathy-ledger, storytelling |
| `justicehub-platform` | JusticeHub | justicehub, justice |
| `theharvest` | The Harvest | harvest, community |
| `act-farm` | ACT Farm | act-farm, website |
| `act-placemat` | ACT Placemat | placemat, mapping |
| `act-regenerative-studio` | ACT Main | studio, infrastructure |
| `act-project-template` | Cross-Project | template, cross-project |

---

## Label-Based Automation

### Type Detection

The Notion sync automatically detects issue type from labels:

| GitHub Label | Notion Type Field |
|--------------|-------------------|
| `feature` | Feature |
| `bug` | Bug |
| `task` | Task |
| `epic` | Epic |
| `enhancement` | Feature (fallback) |
| `documentation` | Task (fallback) |
| (none) | Task (default) |

### How to Use

When creating issues, add standard labels for auto-detection:

```bash
# Feature
gh issue create --label feature --title "Add dark mode"

# Bug
gh issue create --label bug --title "Fix login error"

# Task
gh issue create --label task --title "Update dependencies"

# Epic (multi-issue)
gh issue create --label epic --title "Complete Goods v1.0"
```

---

## Notion Field Population

### Automatically Populated

These fields are **100% automated** - you never need to set them:

| Notion Field | Auto-Populated From |
|--------------|---------------------|
| Title | GitHub issue title |
| ACT Project | Repository name (via auto-tag workflow) |
| Repository | GitHub repository name |
| GitHub URL | GitHub issue URL |
| GitHub ID | GitHub issue number |
| Labels | GitHub labels (auto-added by repo) |
| Type | GitHub labels (feature/bug/task/epic) |
| Created | GitHub created_at timestamp |
| Updated | GitHub updated_at timestamp |
| Last Synced | Current timestamp (on each sync) |
| Comments Count | GitHub comment count |
| Description | GitHub issue body |

### Manually Set (Optional)

These fields you can set in **either GitHub or Notion**:

| Field | Where to Set | Syncs To |
|-------|--------------|----------|
| Status | GitHub Project or Notion | Both directions |
| LCAA Phase | GitHub Project or Notion | Both directions |
| Priority | GitHub Project or Notion | Both directions |
| Effort | GitHub Project or Notion | Both directions |
| Sprint | GitHub Project or Notion | Both directions |
| Assignees | GitHub or Notion | Both directions |

---

## Example Workflows

### Workflow 1: Create Goods Issue in GitHub

```bash
# 1. Create issue
gh issue create \
  --repo Acurioustractor/goods-asset-tracker \
  --title "Add inventory barcode scanner" \
  --body "Need QR code scanning for asset tracking" \
  --label feature

# Auto-magic happens:
# ✅ Added to GitHub Project
# ✅ ACT Project set to "Goods"
# ✅ Labels added: goods, asset-tracking, circular-economy, feature
# ✅ Type detected: Feature
# ✅ Synced to Notion (within 15 min or immediately on issue creation)
# ✅ Notion page created with all fields

# 2. (Optional) Set additional fields in GitHub Project UI
# - LCAA Phase: Curiosity
# - Priority: High
# - Effort: 3d
# - Sprint: Sprint 4

# Auto-magic continues:
# ✅ These fields sync to Notion on next sync (within 15 min)
```

**Result in Notion**:
- Title: "Add inventory barcode scanner"
- ACT Project: Goods
- Repository: goods-asset-tracker
- Type: Feature
- Labels: goods, asset-tracking, circular-economy, feature
- LCAA Phase: Curiosity
- Priority: High
- Effort: 3d
- Sprint: Sprint 4
- (All other fields auto-populated)

### Workflow 2: Create Task in Notion

```
# 1. Create new page in Notion database
Title: "Update Goods documentation"
ACT Project: Goods
Repository: goods-asset-tracker
Type: Task
Priority: Medium
Effort: 3h
Status: Todo

# 2. Notion → GitHub sync (future feature, not yet implemented)
# Will create GitHub issue in goods-asset-tracker repo
# Will add to GitHub Project
# Will set all fields

# For now: Create issue manually in GitHub first
```

**Current state**: GitHub → Notion is fully automated. Notion → GitHub is planned for Phase 2.

---

## Filters in GitHub Project Views

With automation, the **📦 Goods View** automatically shows:
- All issues from `goods-asset-tracker` repository
- Auto-tagged with ACT Project = "Goods"
- Auto-labeled with `goods`, `asset-tracking`, `circular-economy`

**No manual filtering needed** - just open the view and see your Goods work.

Same for all other project views:
- 📖 Empathy Ledger View → Shows empathy-ledger-v2 issues
- ⚖️ JusticeHub View → Shows justicehub-platform issues
- etc.

---

## Setup Instructions

### 1. Deploy Auto-Tagging Workflow

The workflow is already created at `.github/workflows/auto-tag-project-items.yml`.

**Deploy to all repositories**:

You need to add this workflow to **each ACT repository**:

```bash
# For each repo, copy the workflow file
repos=(
  "empathy-ledger-v2"
  "justicehub-platform"
  "theharvest"
  "act-farm"
  "act-placemat"
  "goods-asset-tracker"
  "act-project-template"
)

for repo in "${repos[@]}"; do
  echo "Deploying to $repo..."

  # Clone or navigate to repo
  cd "/Users/benknight/Code/$repo" || continue

  # Create workflows directory if needed
  mkdir -p .github/workflows

  # Copy workflow
  cp "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio/.github/workflows/auto-tag-project-items.yml" \
     .github/workflows/

  # Commit and push
  git add .github/workflows/auto-tag-project-items.yml
  git commit -m "feat: add auto-tagging for GitHub Projects

Automatically assigns ACT Project field based on repository.
Auto-adds repository-specific labels for filtering.

🤖 Generated with Claude Code
Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
  git push
done
```

**OR**: Use a script to deploy to all repos at once (see below).

### 2. Verify Workflow Permissions

Each repository needs these permissions for the workflow:

Go to each repo → Settings → Actions → General → Workflow permissions:
- ✅ **Read and write permissions**
- ✅ **Allow GitHub Actions to create and approve pull requests**

### 3. Test Auto-Tagging

Create a test issue:

```bash
# Test in goods-asset-tracker
gh issue create \
  --repo Acurioustractor/goods-asset-tracker \
  --title "Test auto-tagging" \
  --body "Testing automated project assignment"

# Check GitHub Actions
gh run list --repo Acurioustractor/goods-asset-tracker --workflow=auto-tag-project-items.yml

# Verify in GitHub Project
# Should see issue with ACT Project = "Goods"
```

### 4. Deploy Notion Sync

Follow: [GITHUB_PROJECTS_NOTION_SETUP.md](./GITHUB_PROJECTS_NOTION_SETUP.md)

This completes the automation loop.

---

## Deployment Script

Create this script to deploy auto-tagging to all repos:

**File**: `scripts/deploy-auto-tagging.sh`

```bash
#!/bin/bash

# Deploy auto-tagging workflow to all ACT repositories

WORKFLOW_FILE="/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio/.github/workflows/auto-tag-project-items.yml"

repos=(
  "/Users/benknight/Code/empathy-ledger-v2"
  "/Users/benknight/Code/JusticeHub"
  "/Users/benknight/Code/The Harvest"
  "/Users/benknight/Code/ACT Farm/act-farm"
  "/Users/benknight/Code/ACT Placemat"
  "/Users/benknight/Code/Goods"
  "/Users/benknight/Code/act-project-template"
)

for repo_path in "${repos[@]}"; do
  if [ ! -d "$repo_path" ]; then
    echo "⚠️  Skipping $repo_path (not found)"
    continue
  fi

  repo_name=$(basename "$repo_path")
  echo ""
  echo "📦 Deploying to: $repo_name"

  cd "$repo_path" || continue

  # Create directory
  mkdir -p .github/workflows

  # Copy workflow
  cp "$WORKFLOW_FILE" .github/workflows/

  # Check if git repo
  if [ ! -d .git ]; then
    echo "⚠️  Not a git repo, skipping commit"
    continue
  fi

  # Commit and push
  git add .github/workflows/auto-tag-project-items.yml

  if git diff --cached --quiet; then
    echo "✅ Already deployed"
  else
    git commit -m "feat: add auto-tagging for GitHub Projects

Automatically assigns ACT Project field based on repository.
Auto-adds repository-specific labels for filtering.

🤖 Generated with Claude Code
Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

    git push

    echo "✅ Deployed and pushed"
  fi
done

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "Next: Create test issues to verify automation"
```

**Run it**:

```bash
chmod +x scripts/deploy-auto-tagging.sh
./scripts/deploy-auto-tagging.sh
```

---

## Verification Checklist

After deploying:

- [ ] Auto-tagging workflow exists in all 7+ repos
- [ ] Workflow permissions set to "Read and write"
- [ ] Test issue created in goods-asset-tracker
- [ ] Test issue automatically added to GitHub Project
- [ ] Test issue has ACT Project = "Goods"
- [ ] Test issue has labels: goods, asset-tracking, circular-economy
- [ ] Notion sync workflow deployed (from main setup guide)
- [ ] Test issue appears in Notion database
- [ ] Notion page has correct ACT Project and Repository fields

---

## Troubleshooting

### Issue not added to project

**Check**:
1. Workflow ran successfully: `gh run list --workflow=auto-tag-project-items.yml`
2. Workflow has write permissions
3. Repository name matches mapping in workflow file

**Fix**: Re-run workflow manually:
```bash
gh workflow run auto-tag-project-items.yml --repo Acurioustractor/goods-asset-tracker
```

### ACT Project field not set

**Check**:
1. View workflow logs: `gh run view <run-id> --log`
2. Project ID is correct (PVT_kwHOCOopjs4BLVik)
3. ACT Project field exists in GitHub Project

**Fix**: Update PROJECT_ID in workflow file if needed

### Labels not added

**Check**:
1. Repository name in REPO_TO_LABELS mapping
2. Issue (not PR) - labels only auto-add to issues currently

**Fix**: Add repository to mapping in workflow

### Notion sync not picking up fields

**Check**:
1. Sync workflow running: `gh run list --workflow=sync-to-notion.yml`
2. NOTION_TOKEN and NOTION_DATABASE_ID secrets set
3. Notion integration has access to database

**Fix**: Follow Notion setup guide in [GITHUB_PROJECTS_NOTION_SETUP.md](./GITHUB_PROJECTS_NOTION_SETUP.md)

---

## Customization

### Add New Repository

Edit `.github/workflows/auto-tag-project-items.yml`:

```javascript
const REPO_TO_PROJECT = {
  // ... existing mappings ...
  'your-new-repo': 'Your Project Name',
};

const REPO_TO_LABELS = {
  // ... existing mappings ...
  'your-new-repo': ['label1', 'label2', 'label3'],
};
```

Deploy to the new repo, commit, push.

### Change Label Mappings

Update REPO_TO_LABELS in the workflow file:

```javascript
'goods-asset-tracker': ['goods', 'inventory', 'tracking'],  // Changed
```

Commit and push to update.

---

## Summary

**What's Automated**:
✅ Add issues to GitHub Project
✅ Set ACT Project field based on repository
✅ Add repository-specific labels
✅ Sync to Notion with all fields
✅ Auto-detect Type from labels
✅ Populate Repository, GitHub URL, GitHub ID in Notion

**What You Do**:
1. Create issue in GitHub (or Notion later)
2. (Optional) Set LCAA Phase, Priority, Effort, Sprint manually
3. Everything else is automatic

**Result**: **Zero manual tagging** for 90% of project management workflow.

---

**Related Documentation**:
- [GitHub Project Views Setup](./github-project-views-setup.md)
- [Notion-GitHub Sync](./notion-github-sync.md)
- [Complete Setup Guide](./GITHUB_PROJECTS_NOTION_SETUP.md)

---

**Maintained By**: ACT Ecosystem Team
**Last Updated**: 2025-12-26
**Status**: Ready to deploy
