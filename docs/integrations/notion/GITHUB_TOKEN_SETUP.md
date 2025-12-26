# GitHub Token Setup for Notion Sync

## ❌ Current Error

```
Request failed due to following response errors:
- Resource not accessible by personal access token
```

This means your GitHub token doesn't have permission to access the GitHub Project.

---

## ✅ Fix: Create New Token with Correct Scopes

### Step 1: Generate New Personal Access Token (CLASSIC)

**CRITICAL**: You MUST use a **classic token**, NOT a fine-grained token. Fine-grained tokens cannot access user-level Projects.

1. **Go to**: https://github.com/settings/tokens
2. **Look for two tabs**: "Fine-grained tokens" and "Tokens (classic)"
3. **Click the "Tokens (classic)" tab** ← Make sure you're on this tab!
4. **Click**: "Generate new token (classic)" button
5. **Name**: `ACT Notion Sync`
6. **Expiration**: Choose expiration (90 days recommended)

**If you see**: "Repository access", "Permissions", "User permissions" → You're on the WRONG page (fine-grained tokens). Go back and click "Tokens (classic)".

### Step 2: Select Required Scopes (Classic Token Page)

**On the classic token page**, you'll see a list of checkboxes. Scroll down and check these **exact three boxes**:

1. ✅ **`repo`** - Full control of private repositories
   - You'll see this near the top
   - Check the main "repo" checkbox (this checks all sub-items)

2. ✅ **`project`** - Full access to user and organization projects
   - **THIS IS CRITICAL** - scroll down to find this
   - It's a standalone checkbox (not nested under anything)

3. ✅ **`read:org`** - Read org and team membership, read org projects
   - Further down the page
   - Under the "admin:org" section, check ONLY "read:org"

**What the page looks like:**
```
Note
[Description field]

Select scopes
Scopes define the access for personal tokens. Read more about OAuth scopes.

☑ repo                     Full control of private repositories
  ☑ repo:status           Access commit status
  ☑ repo_deployment       Access deployment status
  ☑ public_repo           Access public repositories
  ☑ repo:invite           Access repository invitations
  ☑ security_events       Read and write security events

☐ workflow                 Update GitHub Action workflows

☐ write:packages           Upload packages to GitHub Package Registry
☐ read:packages            Download packages from GitHub Package Registry

☐ delete:packages          Delete packages from GitHub Package Registry

☐ admin:org                Full control of orgs and teams, read and write org projects
  ☑ read:org              Read org and team membership, read org projects  ← CHECK THIS

☐ admin:public_key         Full control of user public keys

☐ admin:repo_hook          Full control of repository hooks

☐ admin:org_hook           Full control of organization hooks

☐ gist                     Create gists

☐ notifications            Access notifications

☐ user                     Update ALL user data

☐ delete_repo              Delete repositories

☐ write:discussion         Read and write team discussions

☐ read:discussion          Read team discussions

☐ write:packages           Upload packages

☐ read:packages            Download packages

☐ delete:packages          Delete packages

☑ project                  Full access to user and organization projects  ← CHECK THIS
☐ read:project             Read access to user and organization projects

☐ admin:gpg_key            Full control of user gpg keys
```

**Important**: If you see "read:project" instead of "project", that's fine - check "read:project".

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

Should return something like:
```
x-oauth-scopes: repo, project, read:org
```

Or with read-only project access:
```
x-oauth-scopes: repo, read:project, read:org
```

---

## 🎯 Quick Summary

**Problem**: Token doesn't have `project` or `read:project` scope
**Solution**: Generate new token with `repo`, `project` (or `read:project`), `read:org`
**Update**: Replace `GH_PROJECT_TOKEN` secret in GitHub
**Test**: Re-run workflow

---

**Last Updated**: 2025-12-26
**Workflow**: `.github/workflows/sync-notion.yml`
