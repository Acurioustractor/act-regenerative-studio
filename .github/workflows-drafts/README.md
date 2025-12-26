# 🤖 ACT GitHub Actions Workflows

This directory contains draft GitHub Actions workflows for the ACT ecosystem. These workflows implement world-class CI/CD, security scanning, and automation aligned with the LCAA methodology.

---

## 📋 Available Workflows

### 1. **test.yml** - CI/CD Testing
**Triggers:** PR, Push to main/develop
**Purpose:** Ensure code quality before deployment

**Jobs:**
- 🔍 **Lint & Type Check** - ESLint + TypeScript validation
- 🏗️ **Build** - Next.js build with artifacts
- 🧪 **Tests** - Run test suite (when configured)
- 🔒 **Security Audit** - npm audit for vulnerabilities
- 📊 **Quality Summary** - LCAA-aligned quality report

**Key Features:**
- Parallel job execution for speed
- Build artifacts saved for 7 days
- ACT Quality Checklist in summary

---

### 2. **deploy.yml** - Vercel Deployment
**Triggers:** Push to main, Manual
**Purpose:** Automated production deployments

**Jobs:**
- 🚀 **Deploy to Production** - Vercel deployment
- 📢 **Notify Team** - Deployment notifications

**Required Secrets:**
- `VERCEL_TOKEN` - Vercel API token
- `VERCEL_ORG_ID` - Vercel organization ID
- `VERCEL_PROJECT_ID` - Vercel project ID
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key

**Key Features:**
- Automatic PR comments on successful deployment
- Deployment summaries with commit info
- Optional Slack/Discord notifications (TODO)

---

### 3. **type-sync.yml** - Type Synchronization
**Triggers:** Push to main (types/** changes), Manual
**Purpose:** Keep types synchronized across ACT repos

**Jobs:**
- 🔍 **Detect Type Changes** - Identify changed type files
- 🔄 **Sync to Empathy Ledger** - Auto-create PR with synced types
- 🔄 **Sync to Other Repos** - Planned for repos using shared types

**What It Syncs:**
- `database.types.ts` - Supabase generated types
- `src/types/shared/**` - Shared type definitions

**Key Features:**
- Automatic PR creation in target repos
- Includes change summary and review checklist
- Prevents type drift across ecosystem

---

### 4. **security-scan.yml** - Security Scanning
**Triggers:** Weekly (Monday 9 AM UTC), PR (package changes), Manual
**Purpose:** Proactive security monitoring

**Jobs:**
- 🔍 **Dependency Audit** - npm audit for vulnerabilities
- 🔐 **Secret Scanning** - TruffleHog secret detection
- 📦 **Dependency Review** - Review new dependencies in PRs
- 🔬 **CodeQL Analysis** - Static code analysis
- 🌍 **Environment Check** - Verify no exposed secrets

**Key Features:**
- Weekly automated scans
- Blocks PRs with exposed secrets
- Generates security reports
- CodeQL for advanced vulnerability detection

---

### 5. **auto-label.yml** - Automatic Labeling
**Triggers:** PR/Issue open or edit
**Purpose:** Intelligent automatic labeling

**Jobs:**
- 🏷️ **Auto-Label PR** - Labels based on:
  - Changed files (via labeler.yml)
  - PR size → effort labels
  - Branch name → type, project, LCAA labels
- ✅ **Verify PR Template** - Ensures ACT Quality Checklist
- 👥 **Auto-Assign** - CODEOWNERS-based assignment
- 👋 **Welcome Contributors** - First-time contributor greeting

**Label Logic:**
- **Size**: < 50 lines = 1h, < 200 = 3h, < 500 = 1d, < 1000 = 3d, 1000+ = 1w
- **Branch prefixes**: `feature/`, `fix/`, `hotfix/`, `chore/`, `docs/`, `refactor/`
- **Project detection**: Branch name contains project keywords
- **LCAA detection**: Branch name contains LCAA keywords

**Key Features:**
- Welcomes first-time contributors with ACT overview
- Warns if PR template not used
- Automatic reviewer assignment

---

## 🚀 Deployment Instructions

### Step 1: Review Workflows
Review each workflow file to ensure it matches your needs.

### Step 2: Configure Secrets
Set up required secrets in GitHub repo settings:

```bash
# Vercel secrets (for deploy.yml)
gh secret set VERCEL_TOKEN --body "your-vercel-token"
gh secret set VERCEL_ORG_ID --body "your-org-id"
gh secret set VERCEL_PROJECT_ID --body "your-project-id"

# Supabase secrets (for test.yml, deploy.yml)
gh secret set NEXT_PUBLIC_SUPABASE_URL --body "your-supabase-url"
gh secret set NEXT_PUBLIC_SUPABASE_ANON_KEY --body "your-anon-key"

# Optional: Notification webhooks
gh secret set SLACK_WEBHOOK_URL --body "your-slack-webhook"
```

### Step 3: Create labeler.yml
Create `.github/labeler.yml` for file-based labeling:

```yaml
'type: feature':
  - 'src/app/**/*'
  - 'src/components/**/*'

'type: chore':
  - 'scripts/**/*'
  - '*.config.*'

'type: documentation':
  - 'docs/**/*'
  - '*.md'

'project: empathy-ledger':
  - 'src/lib/empathy-ledger/**/*'

'project: justicehub':
  - 'src/lib/justicehub/**/*'
```

### Step 4: Move Workflows to Production
```bash
# Move from drafts to active workflows
mv .github/workflows-drafts/*.yml .github/workflows/

# Commit and push
git add .github/workflows/
git commit -m "feat: deploy GitHub Actions workflows"
git push
```

### Step 5: Test Workflows
- **test.yml**: Create a PR to trigger
- **deploy.yml**: Push to main or run manually
- **security-scan.yml**: Run manually via Actions tab
- **auto-label.yml**: Create a PR with branch name like `feature/test`
- **type-sync.yml**: Modify a type file and push to main

---

## 📊 Monitoring & Maintenance

### View Workflow Runs
```bash
gh run list --workflow=test.yml
gh run view <run-id>
```

### Debug Failed Workflows
```bash
gh run view <run-id> --log-failed
```

### Re-run Failed Jobs
```bash
gh run rerun <run-id> --failed
```

---

## 🎯 Workflow Customization

### Adjust Trigger Frequency
Edit `security-scan.yml` cron schedule:
```yaml
schedule:
  - cron: '0 9 * * 1'  # Every Monday at 9 AM
  - cron: '0 0 * * *'  # Daily at midnight
```

### Add Custom Notifications
Uncomment Slack/Discord webhook sections in `deploy.yml` and `security-scan.yml`.

### Modify Auto-Label Logic
Edit `auto-label.yml` to customize:
- Effort estimation thresholds
- Branch name patterns
- Label names

---

## 🌾 LCAA Integration

All workflows align with ACT's LCAA methodology:

- **Listen**: Security scans detect community concerns
- **Curiosity**: Tests validate prototypes and experiments
- **Action**: Automated deployment builds tangible solutions
- **Art**: Clean, maintainable code is creative expression

---

## 📚 Additional Resources

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Vercel GitHub Integration](https://vercel.com/docs/git/vercel-for-github)
- [CodeQL Documentation](https://codeql.github.com/docs/)
- [TruffleHog Secret Scanning](https://github.com/trufflesecurity/trufflehog)

---

## 🤝 Contributing

To improve these workflows:
1. Test changes in a fork first
2. Document new secrets/configuration required
3. Update this README with your changes
4. Create a PR with `type: chore` label

---

**Last Updated**: 2025-12-26
**Maintained By**: ACT Ecosystem Team
**Questions?** Open an issue or check CLAUDE.md
