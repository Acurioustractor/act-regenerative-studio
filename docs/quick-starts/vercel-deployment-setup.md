# Vercel Deployment Setup Guide

## 🎯 Purpose
Configure automatic deployment to Vercel via GitHub Actions workflow.

---

## 📋 Prerequisites

- Vercel account with your project already deployed
- GitHub CLI (`gh`) installed and authenticated
- Admin access to the GitHub repository

---

## 🔑 Step 1: Get Your Vercel Credentials

### 1.1 Get Vercel Token

1. Go to https://vercel.com/account/tokens
2. Click "Create Token"
3. Name it: `GitHub Actions - ACT Studio`
4. Scope: Full Account
5. Click "Create"
6. **Copy the token immediately** (you won't see it again)

### 1.2 Get Vercel Organization ID

```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Login to Vercel
vercel login

# Go to your project directory
cd "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio"

# Link to your Vercel project (if not already linked)
vercel link

# Get your org ID and project ID
cat .vercel/project.json
```

This will output something like:
```json
{
  "orgId": "team_xxxxxxxxxxxxxxxx",
  "projectId": "prj_xxxxxxxxxxxxxxxx"
}
```

---

## 🔐 Step 2: Set GitHub Secrets

Run these commands in your terminal:

```bash
# Navigate to your repo
cd "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio"

# Set Vercel Token
gh secret set VERCEL_TOKEN --body "your-token-from-vercel"

# Set Vercel Org ID
gh secret set VERCEL_ORG_ID --body "team_xxxxxxxxxxxxxxxx"

# Set Vercel Project ID
gh secret set VERCEL_PROJECT_ID --body "prj_xxxxxxxxxxxxxxxx"

# Also set Supabase secrets (needed for builds)
gh secret set NEXT_PUBLIC_SUPABASE_URL --body "https://tednluwflfhxyucgwigh.supabase.co"
gh secret set NEXT_PUBLIC_SUPABASE_ANON_KEY --body "your-supabase-anon-key"

# Verify secrets were created
gh secret list
```

---

## ✅ Step 3: Test the Deployment Workflow

### Option A: Manual Test (Recommended First)

```bash
# Trigger the deploy workflow manually
gh workflow run deploy.yml
```

Then check the workflow run:
```bash
gh run list --workflow=deploy.yml
```

### Option B: Push to Main

```bash
# Make a small change
echo "# Test deployment" >> README.md
git add README.md
git commit -m "test: trigger deployment workflow"
git push origin main
```

Watch the deployment:
```bash
gh run watch
```

---

## 🔍 Troubleshooting

### Secret Not Found Error

**Error**: `Error: VERCEL_TOKEN not found`

**Fix**:
```bash
gh secret list  # Verify secret exists
gh secret set VERCEL_TOKEN --body "your-token"  # Re-set if needed
```

### Build Fails with "Missing Environment Variables"

**Fix**: Ensure Supabase secrets are set:
```bash
gh secret set NEXT_PUBLIC_SUPABASE_URL --body "your-url"
gh secret set NEXT_PUBLIC_SUPABASE_ANON_KEY --body "your-key"
```

### Vercel CLI Not Linked

**Fix**:
```bash
vercel link
# Follow prompts to select your project
```

---

## 📊 Monitoring Deployments

### View Recent Deployments
```bash
gh run list --workflow=deploy.yml --limit 5
```

### View Specific Run Details
```bash
gh run view <run-id>
```

### View Logs for Failed Run
```bash
gh run view <run-id> --log-failed
```

---

## 🎯 Expected Workflow Behavior

Once configured, every push to `main` will:

1. ✅ Checkout code
2. ✅ Install dependencies
3. ✅ Build Next.js app
4. ✅ Deploy to Vercel production
5. ✅ Comment on PR with deployment URL (if from PR merge)
6. ✅ Create deployment summary

You'll see output like:
```
🚀 Deployment successful!
📦 Project: act-regenerative-studio
🌐 URL: https://act-studio.vercel.app
📝 Commit: feat: add new feature (abc123)
```

---

## 🔒 Security Best Practices

- ✅ Never commit tokens to git
- ✅ Use GitHub Secrets for all sensitive values
- ✅ Rotate Vercel tokens every 90 days
- ✅ Use scoped tokens when possible
- ✅ Review deployment logs for exposed secrets

---

## 📚 Additional Resources

- [Vercel GitHub Integration](https://vercel.com/docs/git/vercel-for-github)
- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Vercel CLI Documentation](https://vercel.com/docs/cli)

---

**Last Updated**: 2025-12-26
**Maintained By**: ACT Ecosystem Team
**Questions?** Check workflow logs or open an issue
