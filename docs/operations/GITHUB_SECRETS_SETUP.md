# GitHub Secrets Setup for Sprint Snapshot Automation

## Overview

The sprint snapshot GitHub Action requires several secrets to be configured in your repository settings.

## Required Secrets

Navigate to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret

### 1. `GH_PROJECT_TOKEN`

**Purpose**: GitHub Personal Access Token for accessing GitHub Projects API

**Create**:
1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Name: "Sprint Snapshot Automation"
4. Expiration: No expiration (or 1 year)
5. **Scopes**:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `read:org` (Read org and team membership)
   - ✅ `read:project` (Read access to projects)
6. Click "Generate token"
7. Copy the token (starts with `ghp_`)

**Add to GitHub**:
- Name: `GH_PROJECT_TOKEN`
- Value: `ghp_xxxxxxxxxxxxxxxxxxxxx`

### 2. `GITHUB_PROJECT_ID`

**Purpose**: The ID of your GitHub Project (ACT Ecosystem Development)

**Value**: `PVT_kwHOCOopjs4BLVik`

**Add to GitHub**:
- Name: `GITHUB_PROJECT_ID`
- Value: `PVT_kwHOCOopjs4BLVik`

### 3. `SUPABASE_URL`

**Purpose**: Your Supabase project URL

**Find**:
1. Go to Supabase Dashboard → Project Settings → API
2. Copy "Project URL"

**Add to GitHub**:
- Name: `SUPABASE_URL`
- Value: `https://tednluwflfhxyucgwigh.supabase.co`

### 4. `SUPABASE_SERVICE_ROLE_KEY`

**Purpose**: Supabase service role key for server-side database access

**Find**:
1. Go to Supabase Dashboard → Project Settings → API
2. Copy "service_role secret" (⚠️ Keep this secret!)

**Add to GitHub**:
- Name: `SUPABASE_SERVICE_ROLE_KEY`
- Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (long token)

## Verification

After adding all secrets, you can test the workflow:

1. Go to Actions tab in your GitHub repository
2. Click "Sprint Snapshot" workflow
3. Click "Run workflow" → "Run workflow"
4. Wait for completion (should take ~30 seconds)
5. Check run logs for success message

Expected output:
```
✅ Fetched 100 total items
🔍 Found 15 issues in Sprint 4
✅ Snapshot stored in Supabase
✨ Sprint Snapshot Complete!
```

## Troubleshooting

### "Resource not accessible by integration"
- Check that `GH_PROJECT_TOKEN` has correct scopes (`repo`, `read:org`, `read:project`)
- Verify the token is valid and not expired

### "Invalid API key"
- Check that `SUPABASE_SERVICE_ROLE_KEY` is the service_role key, not the anon key

### "Project not found"
- Verify `GITHUB_PROJECT_ID` is correct: `PVT_kwHOCOopjs4BLVik`
- Ensure the token has access to the Acurioustractor organization

### No issues found in sprint
- Check that `CURRENT_SPRINT` matches exactly (case-sensitive): "Sprint 4"
- Verify issues in GitHub Project have Sprint field populated

## Schedule

The workflow runs automatically:
- **Daily at 5:00 PM UTC** (12:00 PM EST / 9:00 AM PST)
- **Manual trigger**: Use "Run workflow" button in Actions tab

## Updating Sprint

When starting a new sprint:

1. Update the workflow file (`.github/workflows/snapshot-sprint.yml`)
2. Change `CURRENT_SPRINT: 'Sprint 4'` to `CURRENT_SPRINT: 'Sprint 5'`
3. Commit and push
4. Run manually to create first snapshot

---

**Related**:
- Sprint Snapshot Guide: [SPRINT_SNAPSHOT_GUIDE.md](./SPRINT_SNAPSHOT_GUIDE.md)
- Script: `/scripts/snapshot-sprint-metrics.mjs`
- Dashboard: `/admin/dashboard`
