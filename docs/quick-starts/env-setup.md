# 🚀 Environment Variables - Quick Start Guide

**For**: ACT Development Team
**Goal**: Get all 4 projects running with proper environment configuration in 5 minutes

---

## TL;DR - Just Want to Start Coding?

```bash
# 1. Check what's missing
./scripts/validate-env.sh

# 2. If you have vault access, sync everything
./scripts/sync-env.sh

# 3. Start all projects
npm start

# 4. Open dev dashboard
# http://localhost:3999
```

---

## Current Status

✅ **Vault System Created**
- `.env-vault/` - Stores actual secrets (gitignored)
- `.env-templates/` - Template files for each project
- `scripts/sync-env.sh` - Copy vault → projects
- `scripts/validate-env.sh` - Check all variables are set
- `scripts/backup-env.sh` - Backup vault to secure location

✅ **Existing Secrets Backed Up**
- Empathy Ledger `.env.local` → vault ✅
- JusticeHub `.env.local` → vault ✅
- The Harvest - needs setup ⏳
- ACT Farm - needs setup ⏳

⏳ **Next Steps**
1. Create GHL sub-accounts (4 separate sub-accounts)
2. Generate API keys for each sub-account
3. Populate vault files with actual credentials
4. Run sync script to deploy to all projects

---

## For New Team Members

### Option 1: You Have Vault Access
```bash
# 1. Request vault files from team lead
# 2. Copy to .env-vault/ directory
# 3. Run sync
./scripts/sync-env.sh

# 4. Validate
./scripts/validate-env.sh

# 5. Start projects
npm start
```

### Option 2: Starting From Scratch
```bash
# 1. Copy templates to each project
cp .env-templates/the-harvest.env.template "../The Harvest/.env.local"
cp .env-templates/act-farm.env.template "../ACT Farm/act-farm/.env.local"
cp .env-templates/empathy-ledger.env.template "../Empathy Ledger v.02/.env.local"
cp .env-templates/justicehub.env.template "../JusticeHub/.env.local"

# 2. Get credentials from team lead or generate new ones
# See ENV_AUDIT_AND_MANAGEMENT.md → "Where to Get Credentials"

# 3. Edit each .env.local file and replace placeholders

# 4. Copy populated files to vault for team sharing
cp "../The Harvest/.env.local" .env-vault/the-harvest.env.local
cp "../ACT Farm/act-farm/.env.local" .env-vault/act-farm.env.local
cp "../Empathy Ledger v.02/.env.local" .env-vault/empathy-ledger.env.local
cp "../JusticeHub/.env.local" .env-vault/justicehub.env.local

# 5. Secure permissions
chmod 600 .env-vault/*.env.local

# 6. Validate
./scripts/validate-env.sh
```

---

## What's Shared vs Project-Specific?

### ✅ SHARED (Same for All Projects)

```bash
# NAS Services (auto-injected by orchestrator)
REDIS_URL=redis://192.168.0.34:6379
CHROMADB_URL=http://192.168.0.34:8000

# Email (same Resend API key OK)
RESEND_API_KEY=re_YourSharedResendKey
```

### ❌ NEVER SHARE (Unique Per Project)

```bash
# GoHighLevel (separate sub-account required!)
GHL_API_KEY=sk-live_TheHarvestKey  # Different for each project
GHL_LOCATION_ID=loc_TheHarvestID    # Different for each project

# Supabase (Empathy Ledger & JusticeHub only)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

---

## Common Issues

### ❌ "Port already in use" when starting
```bash
# Use the clean startup script
npm start  # This automatically runs start-clean.sh
```

### ❌ "Missing required variable" validation error
```bash
# Check which project is missing what
./scripts/validate-env.sh

# Edit the project's .env.local
nano "../The Harvest/.env.local"

# Or sync from vault if you have access
./scripts/sync-env.sh the-harvest
```

### ❌ "GHL_API_KEY is placeholder"
You need to create GHL sub-accounts and generate real API keys.

**Step-by-step:**
1. Log into https://app.gohighlevel.com/
2. Go to Settings → Sub-Accounts
3. Create 4 separate sub-accounts:
   - The Harvest Community Hub
   - ACT Farm Tourism & Residencies
   - Empathy Ledger Platform
   - JusticeHub Service Finder
4. For each sub-account:
   - Settings → Integrations → Private Integrations
   - Create Private Integration → Copy API Key
   - Settings → Business Profile → Copy Location ID
5. Paste into vault files

### ❌ "No vault file for [project]"
The vault is empty for that project. Either:
- Request from team lead, or
- Create from template: `cp .env-templates/[project].env.template .env-vault/[project].env.local`

---

## File Locations Reference

| What | Where |
|------|-------|
| **Templates** (safe, committed to Git) | `.env-templates/*.env.template` |
| **Vault** (secrets, gitignored) | `.env-vault/*.env.local` |
| **The Harvest** `.env.local` | `/Users/benknight/Code/The Harvest/.env.local` |
| **ACT Farm** `.env.local` | `/Users/benknight/Code/ACT Farm/act-farm/.env.local` |
| **Empathy Ledger** `.env.local` | `/Users/benknight/Code/Empathy Ledger v.02/.env.local` |
| **JusticeHub** `.env.local` | `/Users/benknight/Code/JusticeHub/.env.local` |
| **Scripts** | `scripts/sync-env.sh`, `scripts/validate-env.sh`, `scripts/backup-env.sh` |
| **Full Docs** | `ENV_AUDIT_AND_MANAGEMENT.md` |
| **Standards** | `UNIFIED_PROJECT_STANDARDS.md` |

---

## Scripts Quick Reference

```bash
# Sync vault → projects (all)
./scripts/sync-env.sh

# Sync specific project
./scripts/sync-env.sh empathy-ledger

# Validate all projects
./scripts/validate-env.sh

# Validate specific project
./scripts/validate-env.sh the-harvest

# Backup vault (encrypted)
./scripts/backup-env.sh

# Custom backup destination
./scripts/backup-env.sh ~/Dropbox/ACT-backup.tar.gz.enc
```

---

## Security Checklist

Before sharing vault with team:

- [ ] All vault files have real credentials (not placeholders)
- [ ] Vault directory is gitignored (`.env-vault/` in `.gitignore`)
- [ ] Each project has unique GHL sub-account (never shared)
- [ ] Supabase projects use separate Supabase instances
- [ ] Created encrypted backup: `./scripts/backup-env.sh`
- [ ] Backup stored in 1Password or secure location
- [ ] Team knows backup password (shared securely, not via email/Slack)

---

## Next Steps After Environment Setup

1. ✅ Run validation: `./scripts/validate-env.sh` (should show all green ✅)
2. ✅ Start all projects: `npm start`
3. ✅ Verify all 5 projects running: http://localhost:3999
4. ⏳ Set up GHL pipelines (see `GHL_PIPELINE_STRATEGY.md`)
5. ⏳ Create GHL calendars for booking systems
6. ⏳ Build GHL integration API routes (Week 1-3 of launch plan)

---

**Quick Links:**
- Full Environment Audit: [ENV_AUDIT_AND_MANAGEMENT.md](./ENV_AUDIT_AND_MANAGEMENT.md)
- Project Standards: [UNIFIED_PROJECT_STANDARDS.md](./UNIFIED_PROJECT_STANDARDS.md)
- GHL Strategy: [GHL_PIPELINE_STRATEGY.md](./GHL_PIPELINE_STRATEGY.md)
- Startup Docs: [README_STARTUP.md](./README_STARTUP.md)

**Last Updated**: December 24, 2025
