# GitHub Token Setup for Notion Sync

## ❌ Current Error

```
Request failed due to following response errors:
- Resource not accessible by personal access token
```

This means your GitHub token doesn't have permission to access the GitHub Project.

---

## ✅ Fix: Create New Token with Correct Scopes

### Step 1: Generate New Personal Access Token

1. **Go to**: https://github.com/settings/tokens
2. **Click**: "Generate new token" → "Generate new token (classic)"
3. **Name**: `ACT Notion Sync`
4. **Expiration**: Choose expiration (90 days recommended)

### Step 2: Select Required Scopes

**IMPORTANT**: Check these exact scopes:

- ✅ **`repo`** (Full control of private repositories)
  - Includes: repo:status, repo_deployment, public_repo, repo:invite
- ✅ **`read:project`** (Read access to projects)
  - This is CRITICAL for reading GitHub Projects (v2)
- ✅ **`read:org`** (Read org and team membership, read org projects)

**Visual checklist:**
```
[✓] repo
    [✓] repo:status
    [✓] repo_deployment
    [✓] public_repo
    [✓] repo:invite
    [✓] security_events
[ ] workflow
[ ] write:packages
[ ] delete:packages
[✓] read:project  ← MUST HAVE THIS!
[ ] admin:org
[✓] read:org      ← MUST HAVE THIS!
```

### Step 3: Generate and Copy Token

1. Click **"Generate token"** at bottom
2. **IMPORTANT**: Copy the token NOW (it won't be shown again)
3. Token format: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Step 4: Update GitHub Secret

1. **Go to**: https://github.com/Acurioustractor/act-regenerative-studio/settings/secrets/actions
2. **Find**: `GH_PROJECT_TOKEN`
3. **Click**: "Update" (pencil icon)
4. **Paste**: Your new token
5. **Click**: "Update secret"

### Step 5: Re-run Workflow

1. Go to: https://github.com/Acurioustractor/act-regenerative-studio/actions
2. Click: "Sync GitHub Issues to Notion"
3. Click: "Run workflow" → "Run workflow"
4. Watch it succeed! 🎉

---

## 🔍 Troubleshooting

### Error: "Resource not accessible"
**Fix**: Token missing `read:project` scope → Regenerate token with correct scopes

### Error: "Bad credentials"
**Fix**: Token is invalid or expired → Generate new token

### Error: "API rate limit exceeded"
**Fix**: Wait 1 hour for rate limit to reset

### Sync runs but creates 0 pages
**Fix**: Check Notion database is shared with integration

---

## 📊 Verify Token Has Correct Scopes

Run this to check your token scopes:

```bash
curl -H "Authorization: token YOUR_TOKEN_HERE" https://api.github.com/user -I | grep x-oauth-scopes
```

Should return:
```
x-oauth-scopes: repo, read:org, read:project
```

---

## 🎯 Quick Summary

**Problem**: Token doesn't have `read:project` scope
**Solution**: Generate new token with `repo`, `read:project`, `read:org`
**Update**: Replace `GH_PROJECT_TOKEN` secret in GitHub
**Test**: Re-run workflow

---

**Last Updated**: 2025-12-26
**Workflow**: `.github/workflows/sync-notion.yml`
