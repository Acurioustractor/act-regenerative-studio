# Setup GitHub Personal Access Token for Projects

**Required for**: Auto-tagging workflow to add issues to organization projects
**Time required**: 5 minutes
**Created**: 2025-12-26

---

## Why This Is Needed

The default `GITHUB_TOKEN` in GitHub Actions doesn't have permission to modify **organization-level** projects. To enable the auto-tagging workflow to add issues to the "ACT Ecosystem Development" project, you need to create a Personal Access Token (PAT) with the right permissions.

---

## Step 1: Create Personal Access Token

1. Go to: https://github.com/settings/tokens?type=beta

2. Click **"Generate new token"** → **"Generate new token (fine-grained)"**

3. **Token name**: `ACT Project Auto-Tagger`

4. **Expiration**:
   - Recommended: **No expiration** (for automation)
   - Alternative: **1 year** (you'll need to renew annually)

5. **Repository access**:
   - Select: **"All repositories"** (for Acurioustractor organization)
   - Or: Select specific repos (empathy-ledger-v2, goods-asset-tracker, etc.)

6. **Permissions** (Repository permissions):
   - ✅ **Issues**: Read and write
   - ✅ **Pull requests**: Read and write
   - ✅ **Contents**: Read-only

7. **Permissions** (Organization permissions):
   - ✅ **Projects**: Read and write ← **Most important!**

8. Click **"Generate token"**

9. **Copy the token** immediately (starts with `github_pat_...`)
   - ⚠️ You won't be able to see it again!

---

## Step 2: Add Token as Organization Secret

**Option A: Organization-level** (recommended - applies to all repos)

1. Go to: https://github.com/organizations/Acurioustractor/settings/secrets/actions

2. Click **"New organization secret"**

3. **Name**: `GH_PROJECT_TOKEN`

4. **Value**: Paste the token from Step 1

5. **Repository access**:
   - Select **"All repositories"**
   - Or select specific repos if you prefer

6. Click **"Add secret"**

**Option B: Per-repository** (if you prefer granular control)

For each repository:
1. Go to repo → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Name: `GH_PROJECT_TOKEN`
4. Value: Paste the token
5. Click "Add secret"

Repeat for: empathy-ledger-v2, justicehub-platform, theharvest, act-farm, act-placemat, goods-asset-tracker, act-project-template

---

## Step 3: Redeploy Updated Workflow

The workflow has been updated to use this new token. Redeploy to all repos:

```bash
cd "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio"
./scripts/deploy-auto-tagging.sh
```

This will update all repos with the fixed workflow that uses `GH_PROJECT_TOKEN`.

---

## Step 4: Test Again

Create a new test issue:

```bash
gh issue create --repo Acurioustractor/goods-asset-tracker \
  --title "Test auto-tagging with PAT" \
  --body "Testing with Personal Access Token for project access"
```

**Expected result** (within 30 seconds):
- ✅ Workflow runs successfully
- ✅ Issue added to GitHub Project
- ✅ ACT Project field set to "Goods"
- ✅ Labels added: goods, asset-tracking, circular-economy

**Verify**:
```bash
# Check workflow run
gh run list --repo Acurioustractor/goods-asset-tracker --workflow=auto-tag-project-items.yml --limit 1

# Check logs
gh run view <run-id> --repo Acurioustractor/goods-asset-tracker --log
```

**Verify in GitHub Project**:
https://github.com/orgs/Acurioustractor/projects/1
- Issue should appear with ACT Project = "Goods"

---

## Troubleshooting

### Workflow still fails with "Resource not accessible"

**Check**:
1. Token has "Projects: Read and write" permission
2. Token is added as `GH_PROJECT_TOKEN` secret
3. Secret is available to the repository (check secret access)
4. Workflow file is updated (should show `secrets.GH_PROJECT_TOKEN`)

### Token expired

1. Create new token with same steps above
2. Update `GH_PROJECT_TOKEN` secret with new value
3. No need to redeploy workflows

### Want to revoke access

1. Go to https://github.com/settings/tokens
2. Find "ACT Project Auto-Tagger" token
3. Click "Revoke"
4. Automation will stop working (workflows will fail)

---

## Security Notes

**What this token can do**:
- ✅ Read/write issues and PRs in ACT repos
- ✅ Read/write to organization projects
- ✅ Read repository contents

**What it cannot do**:
- ❌ Push code or create commits
- ❌ Modify repository settings
- ❌ Delete repositories
- ❌ Manage organization members

**Best practices**:
- Use fine-grained token (not classic)
- Set minimum permissions needed
- Use organization secret (one token for all repos)
- Monitor token usage: https://github.com/settings/tokens

---

## Alternative: Manual Project Addition

If you prefer not to use a PAT, you can:

1. Disable auto-add to project in workflow
2. Manually add issues to project
3. Workflow will still auto-set ACT Project field and labels
4. Less automation but no PAT required

To disable auto-add, comment out the "Add issue/PR to project" section in the workflow.

---

## Summary

**What you created**:
- Personal Access Token with project write permissions

**Where you added it**:
- Organization secret: `GH_PROJECT_TOKEN`

**What it enables**:
- Auto-add issues to GitHub Project
- Auto-set ACT Project field
- Auto-add repository-specific labels
- Full automation workflow

**Next**: Test the automation and verify everything works!

---

**Related Documentation**:
- [Project Automation Guide](./project-automation-guide.md)
- [GitHub Projects Notion Setup](./GITHUB_PROJECTS_NOTION_SETUP.md)

---

**Maintained By**: ACT Ecosystem Team
**Last Updated**: 2025-12-26
