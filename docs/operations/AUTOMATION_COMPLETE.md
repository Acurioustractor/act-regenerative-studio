# ✅ GitHub Projects Automation - COMPLETE

**Date**: 2025-12-26
**Status**: Fully functional and tested
**Test Issue**: https://github.com/Acurioustractor/goods-asset-tracker/issues/6

---

## What Works Now

### Zero-Touch Automation ✅

When you create an issue in **any ACT repository**, the following happens automatically:

1. **Auto-add to GitHub Project** ✅
   - Issue appears in "ACT Ecosystem Development" project
   - No manual dragging required

2. **Auto-set ACT Project field** ✅
   - Based on repository:
     - goods-asset-tracker → "Goods"
     - empathy-ledger-v2 → "Empathy Ledger"
     - justicehub-platform → "JusticeHub"
     - etc.

3. **Auto-add repository-specific labels** ✅
   - goods-asset-tracker → `goods`, `asset-tracking`, `circular-economy`
   - empathy-ledger-v2 → `empathy-ledger`, `storytelling`
   - justicehub-platform → `justicehub`, `justice`
   - etc.

### Test Results

**Issue #6** in goods-asset-tracker:
```json
{
  "in_project": true,
  "labels": ["goods", "asset-tracking", "circular-economy"],
  "project_count": 1,
  "title": "🎉 Final test - classic token with project scope"
}
```

**All automation features working perfectly!**

---

## Technical Setup

### Account Type
- **User account** (not organization)
- Repos owned by: `Acurioustractor` (personal account)
- Project type: User-level project

### Authentication
- **Classic Personal Access Token** (not fine-grained)
- Scopes:
  - ✅ `repo` - Full control of repositories
  - ✅ `project` - Full control of projects
- Stored as: `GH_PROJECT_TOKEN` secret

### Workflow Configuration
- File: `.github/workflows/auto-tag-project-items.yml`
- Triggers: Issue/PR creation
- GraphQL: User-level project queries (not organization)
- Permissions: Uses PAT for project access

---

## Currently Deployed

### ✅ Fully Working
- **goods-asset-tracker** - Tested and verified

### ⏳ Needs PAT Secret
The following repos have the workflow deployed but need the `GH_PROJECT_TOKEN` secret added:

1. empathy-ledger-v2
2. justicehub-platform
3. theharvest
4. act-farm
5. act-placemat
6. act-project-template

---

## Next Steps

### Step 1: Add Secret to All Repos

Add the classic PAT as `GH_PROJECT_TOKEN` secret to each repository:

**The token**: You have the classic PAT that was created (starts with `ghp_...`)

**Quick deployment** (run this command):
```bash
# Add secret to all repos at once
# Replace YOUR_TOKEN with the actual token value

repos=(
  "Acurioustractor/empathy-ledger-v2"
  "Acurioustractor/justicehub-platform"
  "Acurioustractor/the-harvest-website"
  "Acurioustractor/act-farm"
  "Acurioustractor/act-placemat"
  "Acurioustractor/act-project-template"
)

for repo in "${repos[@]}"; do
  echo "YOUR_TOKEN" | gh secret set GH_PROJECT_TOKEN --repo "$repo"
  echo "✅ Secret added to $repo"
done
```

**Or manually** for each repo:
1. Go to: `https://github.com/[repo]/settings/secrets/actions`
2. New repository secret
3. Name: `GH_PROJECT_TOKEN`
4. Value: [Your classic PAT token]
5. Add secret

### Step 2: Test Each Repository

Create a test issue in each repo to verify automation:

```bash
# Test Empathy Ledger
gh issue create --repo Acurioustractor/empathy-ledger-v2 \
  --title "Test automation" --body "Testing auto-tagging"

# Test JusticeHub
gh issue create --repo Acurioustractor/justicehub-platform \
  --title "Test automation" --body "Testing auto-tagging"

# etc.
```

### Step 3: Create GitHub Project Views

Follow the guide to create 13 filtered views:
- [docs/operations/github-project-views-setup.md](./github-project-views-setup.md)

Views to create:
1. 🌍 Ecosystem View (all items)
2. 📦 Goods View (filter: ACT Project = Goods)
3. 📖 Empathy Ledger View
4. ⚖️ JusticeHub View
5. 🌾 The Harvest View
6. 🚜 ACT Farm View
7. 🗺️ ACT Placemat View
8. 🎨 By LCAA Phase
9. 📅 Sprint Planning
10. 🔥 High Priority
11. 🆕 Good First Issues
12. 📊 Roadmap
13. 🚧 Cross-Project Work

### Step 4: Set Up Notion Sync (Optional)

For automated development tracking in Notion:
- [docs/operations/GITHUB_PROJECTS_NOTION_SETUP.md](./GITHUB_PROJECTS_NOTION_SETUP.md)

---

## How It Works

### Repository to Project Mapping

```javascript
const REPO_TO_PROJECT = {
  'goods-asset-tracker': 'Goods',
  'empathy-ledger-v2': 'Empathy Ledger',
  'justicehub-platform': 'JusticeHub',
  'theharvest': 'The Harvest',
  'act-farm': 'ACT Farm',
  'act-placemat': 'ACT Placemat',
  'act-regenerative-studio': 'ACT Main',
  'act-project-template': 'Cross-Project'
};
```

### Repository to Labels Mapping

```javascript
const REPO_TO_LABELS = {
  'goods-asset-tracker': ['goods', 'asset-tracking', 'circular-economy'],
  'empathy-ledger-v2': ['empathy-ledger', 'storytelling'],
  'justicehub-platform': ['justicehub', 'justice'],
  'theharvest': ['harvest', 'community'],
  'act-farm': ['act-farm', 'website'],
  'act-placemat': ['placemat', 'mapping'],
  'act-regenerative-studio': ['studio', 'infrastructure'],
  'act-project-template': ['template', 'cross-project']
};
```

---

## Troubleshooting

### Issue not added to project

**Check**:
1. `GH_PROJECT_TOKEN` secret exists in repo
2. Token has `project` scope
3. Workflow has correct permissions

**Fix**: Re-add secret or regenerate token

### Labels not added

**Check**:
1. Repository name in workflow mapping
2. Labels are configured for that repo

**Fix**: Update `REPO_TO_LABELS` in workflow file

### ACT Project field not set

**Check**:
1. Field name is exactly "ACT Project" in GitHub Project
2. Option value matches mapping (e.g., "Goods" not "goods")

**Fix**: Verify field names and options in project settings

---

## Success Metrics

✅ **goods-asset-tracker**: Fully automated
- Auto-add to project: ✅
- Auto-set ACT Project: ✅
- Auto-add labels: ✅

⏳ **6 more repos**: Workflow deployed, needs secret

📊 **Total automation coverage**: 1/7 repos (14%) → Target: 7/7 (100%)

---

## Documentation

- [Automation Guide](./project-automation-guide.md) - Complete automation workflow
- [GitHub Project Views Setup](./github-project-views-setup.md) - Create 13 views
- [PAT Setup Guide](./setup-github-pat-for-projects.md) - Token permissions
- [Notion Sync](./notion-github-sync.md) - Notion integration architecture

---

## Maintenance

### Token Expiration

If you set the token to expire, you'll need to:
1. Generate new token with same scopes
2. Update `GH_PROJECT_TOKEN` in all 7 repos
3. No workflow changes needed

### Adding New Repository

1. Add repo to mappings in workflow file
2. Deploy workflow to new repo
3. Add `GH_PROJECT_TOKEN` secret
4. Test with issue creation

### Updating Mappings

Edit workflow file:
- Change `REPO_TO_PROJECT` for different ACT Project assignments
- Change `REPO_TO_LABELS` for different label sets
- Redeploy to all repos

---

**Maintained By**: ACT Ecosystem Team
**Last Updated**: 2025-12-26
**Status**: ✅ Production ready
**Next Milestone**: Deploy to all 7 repositories
