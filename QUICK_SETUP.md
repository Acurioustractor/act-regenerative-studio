# 🚀 Quick Setup Reference

**Purpose**: Fast reference for completing GitHub PM setup and TODO migration.

---

## ⚡ Vercel Deployment (5 minutes)

### 1. Get Credentials
```bash
# Get token: https://vercel.com/account/tokens
# Get org/project ID:
vercel link
cat .vercel/project.json
```

### 2. Set Secrets
```bash
gh secret set VERCEL_TOKEN --body "your-token"
gh secret set VERCEL_ORG_ID --body "team_xxx"
gh secret set VERCEL_PROJECT_ID --body "prj_xxx"
gh secret set NEXT_PUBLIC_SUPABASE_URL --body "https://tednluwflfhxyucgwigh.supabase.co"
gh secret set NEXT_PUBLIC_SUPABASE_ANON_KEY --body "your-key"
```

### 3. Test
```bash
gh workflow run deploy.yml
gh run watch
```

**Full Guide**: [docs/quick-starts/vercel-deployment-setup.md](./docs/quick-starts/vercel-deployment-setup.md)

---

## 📝 TODO Migration - Hybrid Approach

### Phase 1: Manual (Today) - 5-10 high-priority TODOs

1. **See what's left**:
   ```bash
   node scripts/migrate-todos-to-github.mjs --dry-run
   ```

2. **Create manually** for:
   - Security/auth TODOs
   - Critical bugs
   - FIXMEs
   - Blocking work

3. **Use templates**:
   - JusticeHub: https://github.com/Acurioustractor/justicehub-platform/issues/new/choose
   - Harvest: https://github.com/Acurioustractor/theharvest/issues/new/choose
   - ACT Farm: https://github.com/Acurioustractor/act-farm/issues/new/choose
   - Placemat: https://github.com/Acurioustractor/act-placemat/issues/new/choose

4. **Update code**:
   ```typescript
   // See issue #7 in justicehub-platform: Description
   ```

### Phase 2: Automated (Tomorrow) - Remaining ~70 TODOs

1. **Wait for rate limit reset** (~24 hours from last attempt)

2. **Modify script** (increase delay to 2 seconds):
   ```bash
   code scripts/migrate-todos-to-github.mjs
   # Change: setTimeout(resolve, 300) to setTimeout(resolve, 2000)
   ```

3. **Run migration**:
   ```bash
   node scripts/migrate-todos-to-github.mjs
   ```

4. **Add to Projects board**:
   ```bash
   bash scripts/add-issues-to-project.sh
   ```

**Full Guide**: [docs/operations/hybrid-todo-migration-guide.md](./docs/operations/hybrid-todo-migration-guide.md)

---

## 📊 Current Status

- ✅ Phase 1-5 Complete
- ✅ 132 issues on Projects board
- ✅ All workflows ACTIVE
- ⏳ 79 TODOs remaining (rate limited)

**Projects Board**: https://github.com/users/Acurioustractor/projects/1

---

## 🔗 Key Links

- **Complete Documentation**: [GITHUB_PM_COMPLETE.md](./GITHUB_PM_COMPLETE.md)
- **Vercel Setup**: [docs/quick-starts/vercel-deployment-setup.md](./docs/quick-starts/vercel-deployment-setup.md)
- **TODO Migration**: [docs/operations/hybrid-todo-migration-guide.md](./docs/operations/hybrid-todo-migration-guide.md)
- **Workflow Docs**: [.github/workflows-drafts/README.md](./.github/workflows-drafts/README.md)

---

**Last Updated**: 2025-12-26
🌾 **Building infrastructure for regenerative innovation** 🌾
