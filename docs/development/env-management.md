# ACT Ecosystem - Environment Variable Audit & Management

**Last Updated**: December 24, 2025
**Purpose**: Centralized overview of all environment variables across ACT projects with secure management strategy

---

## Active Projects Overview

### 🌾 Tier 1: Production Sites (Website + CRM)

| Project | Location | Database | CRM | Email | Status |
|---------|----------|----------|-----|-------|--------|
| **The Harvest** | `/Users/benknight/Code/The Harvest` | GHL only | GHL | Resend (transactional)<br>GHL (marketing) | ✅ Active |
| **ACT Farm** | `/Users/benknight/Code/ACT Farm/act-farm` | GHL only | GHL | Resend (transactional)<br>GHL (marketing) | ✅ Active |

### 🏛️ Tier 2: Platforms (Full Stack + CRM)

| Project | Location | Database | CRM | Email | Status |
|---------|----------|----------|-----|-------|--------|
| **Empathy Ledger** | `/Users/benknight/Code/Empathy Ledger v.02` | Supabase (cloud) | GHL | Resend (transactional)<br>GHL (marketing) | ✅ Active |
| **JusticeHub** | `/Users/benknight/Code/JusticeHub` | Supabase (cloud) | GHL | Resend (transactional)<br>GHL (marketing) | ✅ Active |

### 🛠️ Tier 3: Admin Tools

| Project | Location | Purpose | Status |
|---------|----------|---------|--------|
| **Admin Wiki** | `/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio/admin-wiki` | System dashboard, ecosystem overview | ✅ Active |
| **Dev Dashboard** | `/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio/dev-servers.mjs` | Multi-project orchestrator | ✅ Active |

### 📦 Archived/Deprecated Projects

| Project | Location | Reason | Action |
|---------|----------|--------|--------|
| Empathy Ledger (old) | `/Users/benknight/Code/Empathy Ledger` | Superseded by v.02 | Keep for reference |
| Empathy Ledger Final | `/Users/benknight/Code/Empathy Ledger Final` | Superseded by v.02 | Keep for reference |
| JusticeHub Tests | `/Users/benknight/Code/JusticeHub Tests` | Testing only | Archive |
| Orange Sky - Empathy Ledger | `/Users/benknight/Code/Orange Sky - Empathy Ledger` | Client project (completed) | Archive |

---

## Environment Variable Matrix

### Shared Across ALL Projects

| Variable | Value | Where Used | Notes |
|----------|-------|------------|-------|
| `REDIS_URL` | `redis://192.168.0.34:6379` | All 4 active projects | Auto-injected by orchestrator |
| `CHROMADB_URL` | `http://192.168.0.34:8000` | All 4 active projects | Auto-injected by orchestrator |
| `RESEND_API_KEY` | `re_[shared-key]` | All 4 projects (transactional email) | ✅ SAFE to share same key |

### Project-Specific (DO NOT SHARE)

#### GoHighLevel (Separate Sub-Account Per Project)

| Project | Variables | Notes |
|---------|-----------|-------|
| **The Harvest** | `GHL_API_KEY`<br>`GHL_LOCATION_ID`<br>`GHL_VOLUNTEER_PIPELINE_ID`<br>`GHL_EVENT_BOOKING_PIPELINE_ID`<br>`GHL_PARTNERSHIP_PIPELINE_ID`<br>`GHL_TENANT_PIPELINE_ID` | Tenant CRM critical |
| **ACT Farm** | `GHL_API_KEY`<br>`GHL_LOCATION_ID`<br>`GHL_RESIDENCY_PIPELINE_ID`<br>`GHL_INQUIRY_PIPELINE_ID`<br>`GHL_RESIDENCY_CALENDAR_ID`<br>`GHL_WORKSHOP_CALENDAR_ID`<br>`GHL_JUNES_PATCH_CALENDAR_ID` | Booking calendars |
| **Empathy Ledger** | `GHL_API_KEY`<br>`GHL_LOCATION_ID`<br>`GHL_STORYTELLER_PIPELINE_ID`<br>`GHL_ORGANIZATION_PIPELINE_ID`<br>`GHL_PARTNERSHIP_PIPELINE_ID`<br>`GHL_RESEARCH_PIPELINE_ID` | Organization leads |
| **JusticeHub** | `GHL_API_KEY`<br>`GHL_LOCATION_ID`<br>`GHL_FAMILY_INQUIRY_PIPELINE_ID`<br>`GHL_SERVICE_PROVIDER_PIPELINE_ID`<br>`GHL_CAMPAIGN_NOMINATION_PIPELINE_ID`<br>`GHL_CONTAINED_BOOKING_CALENDAR_ID` | Service directory CRM |

#### Supabase (Cloud Database)

| Project | Variables | Notes |
|---------|-----------|-------|
| **Empathy Ledger** | `NEXT_PUBLIC_SUPABASE_URL`<br>`NEXT_PUBLIC_SUPABASE_ANON_KEY`<br>`SUPABASE_SERVICE_ROLE_KEY`<br>`DATABASE_URL` | Cloud-first (yvnuayzslukamizrlhwb.supabase.co) |
| **JusticeHub** | `NEXT_PUBLIC_SUPABASE_URL`<br>`NEXT_PUBLIC_SUPABASE_ANON_KEY`<br>`SUPABASE_SERVICE_ROLE_KEY`<br>`DATABASE_URL` | Separate Supabase project |

#### AI Services (If Used)

| Project | Variables | Notes |
|---------|-----------|-------|
| **Empathy Ledger** | `OPENAI_API_KEY`<br>`ANTHROPIC_API_KEY`<br>`ASSEMBLY_AI_API_KEY` | Story analysis, transcription |
| **ACT Farm** | May need AI for June's Patch | TBD |

#### Payment Processing

| Project | Variables | Notes |
|---------|-----------|-------|
| **Empathy Ledger** | `STRIPE_SECRET_KEY`<br>`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`<br>`STRIPE_WEBHOOK_SECRET` | Subscription billing |
| **ACT Farm** | `STRIPE_SECRET_KEY` (or GHL payments) | Residency deposits |

---

## .env File Status by Project

### ✅ The Harvest
- **Location**: `/Users/benknight/Code/The Harvest`
- **Files Found**:
  - `.env.example` (comprehensive, 1101 bytes)
  - `.env.local.example` (GHL-focused, 890 bytes) ✅ Aligned with standards
- **Status**: ✅ Ready for GHL integration
- **Missing**: Actual `.env.local` (user needs to create from template)

### ✅ ACT Farm
- **Location**: `/Users/benknight/Code/ACT Farm/act-farm`
- **Files Found**:
  - `.env.local.example` (GHL-focused, 586 bytes) ✅ Aligned with standards
- **Status**: ✅ Ready for GHL integration
- **Missing**: Actual `.env.local` (user needs to create from template)

### ✅ Empathy Ledger v.02
- **Location**: `/Users/benknight/Code/Empathy Ledger v.02`
- **Files Found**:
  - `.env.example` (comprehensive, 9306 bytes)
  - `.env.local.example` (minimal, 563 bytes)
  - `.env.local.example.ACT` (aligned template, 4058 bytes) ✅ **GOLD STANDARD**
  - `.env.local` (active, 4756 bytes) ✅ **HAS ACTUAL SECRETS**
- **Status**: ✅ Fully configured, cloud-first
- **Action**: Use `.env.local.example.ACT` as template for other projects

### ⚠️ JusticeHub
- **Location**: `/Users/benknight/Code/JusticeHub`
- **Files Found**:
  - `.env` (4436 bytes) ⚠️ **Should be gitignored**
  - `.env.example` (comprehensive, 4942 bytes)
  - `.env.local` (active, 5104 bytes) ✅ **HAS ACTUAL SECRETS**
  - `.env.local.example` (GHL-focused, 637 bytes) ✅ Aligned with standards
  - `.env.docker` (2479 bytes) ⚠️ **Deprecated (no local Docker per standards)**
  - `.env.schema.json` (3317 bytes) - validation schema
- **Status**: ✅ Configured but needs cleanup
- **Action**:
  1. Ensure `.env` is gitignored
  2. Remove `.env.docker` (violates cloud-first standard)
  3. Verify `.env.local` follows unified standards

---

## Centralized Management Strategy

### Option A: Template Directory (Recommended)

Create centralized template repository:

```
/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio/
├── .env-templates/
│   ├── the-harvest.env.template       # Copy to The Harvest/.env.local
│   ├── act-farm.env.template          # Copy to ACT Farm/act-farm/.env.local
│   ├── empathy-ledger.env.template    # Copy to Empathy Ledger v.02/.env.local
│   ├── justicehub.env.template        # Copy to JusticeHub/.env.local
│   └── SHARED.env                     # Shared variables (Redis, Resend)
├── .env-vault/                        # ⚠️ GITIGNORED - actual secrets
│   ├── the-harvest.env.local
│   ├── act-farm.env.local
│   ├── empathy-ledger.env.local
│   └── justicehub.env.local
└── scripts/
    ├── sync-env.sh                    # Copy from vault to projects
    ├── validate-env.sh                # Check all projects have required vars
    └── backup-env.sh                  # Backup vault to secure location
```

### Option B: 1Password/Vault Integration

Use secure password manager:
- Store all secrets in 1Password vault
- Use 1Password CLI to inject secrets at runtime
- Never store secrets in files (except local dev)

### Option C: GitHub Secrets + Vercel Integration

For deployment:
- Development: Use local `.env.local` files
- Staging/Production: Store in Vercel dashboard per project
- CI/CD: Use GitHub secrets for automated deploys

---

## Sync Script Example

```bash
#!/bin/bash
# sync-env.sh - Copy environment files from vault to projects

VAULT_DIR="/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio/.env-vault"
PROJECTS=(
  "the-harvest:/Users/benknight/Code/The Harvest"
  "act-farm:/Users/benknight/Code/ACT Farm/act-farm"
  "empathy-ledger:/Users/benknight/Code/Empathy Ledger v.02"
  "justicehub:/Users/benknight/Code/JusticeHub"
)

for project in "${PROJECTS[@]}"; do
  IFS=':' read -r name path <<< "$project"

  if [ -f "$VAULT_DIR/$name.env.local" ]; then
    echo "📋 Syncing $name..."
    cp "$VAULT_DIR/$name.env.local" "$path/.env.local"
    chmod 600 "$path/.env.local"  # Secure permissions
    echo "✅ $name synced"
  else
    echo "⚠️  No vault file for $name"
  fi
done

echo "🎉 Environment sync complete!"
```

---

## Validation Checklist

### Before Running Any Project

- [ ] `.env.local` exists in project root
- [ ] `GHL_API_KEY` is set (if project uses GHL)
- [ ] `GHL_LOCATION_ID` is set (if project uses GHL)
- [ ] `REDIS_URL=redis://192.168.0.34:6379` (auto-injected by orchestrator, but good to verify)
- [ ] `CHROMADB_URL=http://192.168.0.34:8000` (auto-injected by orchestrator)
- [ ] No hardcoded secrets in code (all use `process.env.*`)

### For Supabase Projects (Empathy Ledger, JusticeHub)

- [ ] `NEXT_PUBLIC_SUPABASE_URL` is set
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is set
- [ ] `DATABASE_URL` matches Supabase project

### For Projects with Payments

- [ ] `STRIPE_SECRET_KEY` is set
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set
- [ ] `STRIPE_WEBHOOK_SECRET` is set

---

## Security Best Practices

### ✅ DO

1. **Use separate GHL sub-accounts** for each project (prevents data mixing)
2. **Share Resend API key** across projects (cheaper, emails clearly labeled by sender)
3. **Gitignore all `.env.local` files** (never commit secrets)
4. **Use environment-specific keys** (test keys in dev, production keys in prod)
5. **Rotate keys quarterly** (security hygiene)
6. **Backup .env-vault/ directory** to secure external location (1Password, encrypted USB)

### ❌ DON'T

1. **Share GHL API keys** between projects (breaks CRM isolation)
2. **Commit `.env` or `.env.local`** to Git (security risk)
3. **Hardcode secrets** in code (use `process.env.*`)
4. **Use production keys** in development (data corruption risk)
5. **Store secrets in plain text** outside `.env-vault/` (use 1Password or similar)
6. **Mix Supabase projects** (each platform needs separate Supabase instance)

---

## Migration Path to Unified System

### Step 1: Create Vault (Now)
```bash
mkdir -p "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio/.env-vault"
mkdir -p "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio/.env-templates"
echo ".env-vault/" >> "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio/.gitignore"
```

### Step 2: Copy Existing Secrets to Vault
```bash
# Copy actual .env.local files to vault (if they exist)
cp "/Users/benknight/Code/Empathy Ledger v.02/.env.local" \
   "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio/.env-vault/empathy-ledger.env.local"

cp "/Users/benknight/Code/JusticeHub/.env.local" \
   "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio/.env-vault/justicehub.env.local"
```

### Step 3: Create Templates from Examples
```bash
# Use .env.local.example files as templates
cp "/Users/benknight/Code/Empathy Ledger v.02/.env.local.example.ACT" \
   "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio/.env-templates/empathy-ledger.env.template"

cp "/Users/benknight/Code/The Harvest/.env.local.example" \
   "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio/.env-templates/the-harvest.env.template"

cp "/Users/benknight/Code/ACT Farm/act-farm/.env.local.example" \
   "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio/.env-templates/act-farm.env.template"

cp "/Users/benknight/Code/JusticeHub/.env.local.example" \
   "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio/.env-templates/justicehub.env.template"
```

### Step 4: Create Shared Variables File
```bash
cat > "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio/.env-templates/SHARED.env" <<'EOF'
# ⚠️ SHARED ACROSS ALL ACT PROJECTS
# These variables are injected by the dev orchestrator automatically
# DO NOT change these values unless NAS configuration changes

# NAS Services (Synology DS420+ - 192.168.0.34)
REDIS_URL=redis://192.168.0.34:6379
CHROMADB_URL=http://192.168.0.34:8000

# Shared Email Service (OK to use same key across all projects)
RESEND_API_KEY=re_[your_shared_resend_api_key_here]

# Email sender addresses (customize per project)
# The Harvest:      EMAIL_FROM=hello@theharvest.org.au
# ACT Farm:         EMAIL_FROM=bookings@actfarm.org.au
# Empathy Ledger:   EMAIL_FROM=stories@empathyledger.com
# JusticeHub:       EMAIL_FROM=support@justicehub.org.au
EOF
```

### Step 5: Create Sync Script
Create `/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio/scripts/sync-env.sh` (see example above)

### Step 6: Create Validation Script
```bash
#!/bin/bash
# validate-env.sh - Check all projects have required environment variables

PROJECTS=(
  "The Harvest:/Users/benknight/Code/The Harvest:GHL_API_KEY,GHL_LOCATION_ID,REDIS_URL"
  "ACT Farm:/Users/benknight/Code/ACT Farm/act-farm:GHL_API_KEY,GHL_LOCATION_ID,REDIS_URL"
  "Empathy Ledger:/Users/benknight/Code/Empathy Ledger v.02:GHL_API_KEY,NEXT_PUBLIC_SUPABASE_URL,REDIS_URL"
  "JusticeHub:/Users/benknight/Code/JusticeHub:GHL_API_KEY,NEXT_PUBLIC_SUPABASE_URL,REDIS_URL"
)

for project in "${PROJECTS[@]}"; do
  IFS=':' read -r name path required <<< "$project"

  if [ ! -f "$path/.env.local" ]; then
    echo "❌ $name: No .env.local file found"
    continue
  fi

  echo "🔍 Checking $name..."
  IFS=',' read -ra VARS <<< "$required"
  for var in "${VARS[@]}"; do
    if grep -q "^$var=" "$path/.env.local"; then
      echo "  ✅ $var"
    else
      echo "  ❌ $var (missing or not set)"
    fi
  done
done
```

---

## Quick Reference: Where to Get Credentials

### GoHighLevel
1. Log into https://app.gohighlevel.com/
2. **Sub-Accounts**: Settings → Sub-Accounts → Create new sub-account per project
3. **API Key**: Settings → Integrations → Private Integrations → Create Private Integration
4. **Location ID**: Settings → Business Profile → Location ID
5. **Pipeline IDs**: Settings → Pipelines → Copy ID from URL or pipeline settings
6. **Calendar IDs**: Settings → Calendars → Create calendar → Copy ID

### Supabase
1. Log into https://supabase.com/dashboard
2. **Project URL**: Project Settings → API → Project URL
3. **Anon Key**: Project Settings → API → anon/public key
4. **Service Role Key**: Project Settings → API → service_role key (⚠️ secret!)
5. **Database URL**: Project Settings → Database → Connection String

### Resend
1. Log into https://resend.com/
2. **API Key**: API Keys → Create API Key
3. **Same key OK for all projects** (emails differentiated by FROM address)

### Stripe
1. Log into https://dashboard.stripe.com/
2. **Secret Key**: Developers → API keys → Secret key
3. **Publishable Key**: Developers → API keys → Publishable key
4. **Webhook Secret**: Developers → Webhooks → Add endpoint → Copy signing secret

---

## Next Steps

1. ✅ **Create vault structure** (directories + gitignore)
2. ✅ **Copy existing secrets** to vault
3. ✅ **Create templates** from .env.local.example files
4. ⏳ **Set up GHL sub-accounts** (requires user action in GHL dashboard)
5. ⏳ **Generate GHL API keys** for each project
6. ⏳ **Populate vault files** with actual credentials
7. ⏳ **Run sync script** to deploy .env.local files to each project
8. ⏳ **Validate** all projects have required variables
9. ⏳ **Test** each project starts successfully with new .env setup

---

**Last Updated**: December 24, 2025
**Maintained By**: Claude Code + ACT Development Team
**Related Docs**: `UNIFIED_PROJECT_STANDARDS.md`, `ACT_ECOSYSTEM_VISUAL_STRATEGY.md`
