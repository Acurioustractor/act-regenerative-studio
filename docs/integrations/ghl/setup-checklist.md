# GHL Setup Checklist - Complete Guide

**Date**: December 24, 2025
**Purpose**: Step-by-step guide to create all 6 GHL accounts

---

## 📋 The Complete List

You need **6 GoHighLevel accounts total**:

### ✅ 1 Master Account
- **A Curious Tractor (ACT)** - Parent organization

### ✅ 5 Sub-Accounts
1. **The Harvest** - Community hub + CSA
2. **ACT Farm** - Tourism + residencies
3. **Empathy Ledger** - Storytelling platform
4. **JusticeHub** - Service finder
5. **Goods on Country** - Circular economy products

---

## 🎯 Step-by-Step Setup

### Step 1: Log into GoHighLevel
- URL: https://app.gohighlevel.com/
- Use your ACT master account credentials

### Step 2: Create Sub-Accounts

For **EACH** of the 5 sub-accounts:

1. Go to **Settings** → **Sub-Accounts**
2. Click **Create Sub-Account**
3. Fill in:
   - **Name**: [Project Name] (e.g., "The Harvest Community Hub")
   - **Business Name**: [Same as name]
   - **Address**: Black Cockatoo Valley address
   - **Phone**: Main ACT phone number
   - **Email**: [project-specific email]
     - `hello@theharvest.org.au`
     - `bookings@actfarm.org.au`
     - `stories@empathyledger.com`
     - `support@justicehub.org.au`
     - `hello@goodsoncountry.com`

4. Click **Create**

### Step 3: Generate API Keys

For **EACH** sub-account (and master):

1. **Switch to sub-account** (top-right dropdown)
2. Go to **Settings** → **Integrations**
3. Click **Private Integrations**
4. Click **Create Private Integration**
5. Fill in:
   - **Name**: "[Project] API Integration"
   - **Scopes**: Select ALL scopes (contacts, calendars, pipelines, etc.)
6. Click **Create**
7. **Copy the API Key** (starts with `sk-live_...`)
8. **Copy the Location ID** (from Settings → Business Profile)

### Step 4: Set Up LC Email (Critical!)

For **EACH** sub-account:

1. **Switch to sub-account** (top-right dropdown)
2. Go to **Settings** → **Email Services** → **LC Email**
3. Click **"+ Add Domain"**
4. Enter domain (e.g., `theharvest.org.au`)
5. **Copy DNS records** shown by GHL
6. Add DNS records to your domain provider (Cloudflare, etc.)
   - SPF record (TXT)
   - DKIM record (CNAME)
   - DMARC record (TXT)
   - MX records (2 records)
7. Wait 15-30 minutes for DNS propagation
8. Click **"Verify"** in GHL
9. Status should show **"Verified"** ✅

**See detailed guide**: [GHL_LC_EMAIL_SETUP.md](./GHL_LC_EMAIL_SETUP.md)

**Why LC Email**:
- ✅ All emails sent/received through your domain
- ✅ Automatic contact linking in GHL
- ✅ Pipeline automation triggers on email activity
- ✅ Unified inbox for team collaboration
- ✅ Included in GHL subscription (no extra cost)

### Step 5: Document Credentials

Create a **secure document** (NOT in Git!) with:

```
=== A CURIOUS TRACTOR (MASTER) ===
GHL_API_KEY=sk-live_XXXXX
GHL_LOCATION_ID=loc_XXXXX

=== THE HARVEST ===
GHL_API_KEY=sk-live_XXXXX
GHL_LOCATION_ID=loc_XXXXX

=== ACT FARM ===
GHL_API_KEY=sk-live_XXXXX
GHL_LOCATION_ID=loc_XXXXX

=== EMPATHY LEDGER ===
GHL_API_KEY=sk-live_XXXXX
GHL_LOCATION_ID=loc_XXXXX

=== JUSTICEHUB ===
GHL_API_KEY=sk-live_XXXXX
GHL_LOCATION_ID=loc_XXXXX

=== GOODS ON COUNTRY ===
GHL_API_KEY=sk-live_XXXXX
GHL_LOCATION_ID=loc_XXXXX
```

---

## 🔐 Add to Environment Vault

### For Each Project:

```bash
# The Harvest
nano "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio/.env-vault/the-harvest.env.local"

# Add:
GHL_API_KEY=sk-live_[paste-actual-key]
GHL_LOCATION_ID=loc_[paste-actual-id]
GHL_API_VERSION=2021-07-28
```

```bash
# ACT Farm
nano "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio/.env-vault/act-farm.env.local"

# Add:
GHL_API_KEY=sk-live_[paste-actual-key]
GHL_LOCATION_ID=loc_[paste-actual-id]
GHL_API_VERSION=2021-07-28
```

```bash
# Empathy Ledger
nano "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio/.env-vault/empathy-ledger.env.local"

# Add:
GHL_API_KEY=sk-live_[paste-actual-key]
GHL_LOCATION_ID=loc_[paste-actual-id]
GHL_API_VERSION=2021-07-28
```

```bash
# JusticeHub
nano "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio/.env-vault/justicehub.env.local"

# Add:
GHL_API_KEY=sk-live_[paste-actual-key]
GHL_LOCATION_ID=loc_[paste-actual-id]
GHL_API_VERSION=2021-07-28
```

```bash
# Goods on Country (create new file)
nano "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio/.env-vault/goods-on-country.env.local"

# Add:
GHL_API_KEY=sk-live_[paste-actual-key]
GHL_LOCATION_ID=loc_[paste-actual-id]
GHL_API_VERSION=2021-07-28
REDIS_URL=redis://192.168.0.34:6379
CHROMADB_URL=http://192.168.0.34:8000
```

```bash
# ACT Hub (create new file)
nano "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio/.env-vault/act-hub.env.local"

# Add:
GHL_API_KEY=sk-live_[paste-actual-key]
GHL_LOCATION_ID=loc_[paste-actual-id]
GHL_API_VERSION=2021-07-28
REDIS_URL=redis://192.168.0.34:6379
CHROMADB_URL=http://192.168.0.34:8000

# Plus all the registry URLs (already in .env.local for ACT Hub)
```

---

## ✅ Validate Setup

After adding all credentials:

```bash
cd "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio"

# Sync vault to all projects
./scripts/sync-env.sh

# Validate all projects have required variables
./scripts/validate-env.sh

# Should show all ✅ for GHL_API_KEY and GHL_LOCATION_ID
```

---

## 📊 Quick Reference Table

| # | Account Name | Type | URL | Email |
|---|--------------|------|-----|-------|
| 1 | **A Curious Tractor** | Master | act.place | hello@act.place |
| 2 | **The Harvest** | Sub | theharvest.org.au | hello@theharvest.org.au |
| 3 | **ACT Farm** | Sub | actfarm.org.au | bookings@actfarm.org.au |
| 4 | **Empathy Ledger** | Sub | empathyledger.com | stories@empathyledger.com |
| 5 | **JusticeHub** | Sub | justicehub.org.au | support@justicehub.org.au |
| 6 | **Goods on Country** | Sub | goodsoncountry.com | hello@goodsoncountry.com |

**Total**: 6 accounts (1 master + 5 subs)
**Total Pipelines**: 30 (5 per account)

---

## 🎯 What Happens After Setup

Once all 6 accounts are created:

1. ✅ All projects can integrate contact forms
2. ✅ Booking calendars can be configured
3. ✅ Email automation can be set up
4. ✅ Pipelines can be created (30 total)
5. ✅ Cross-project reporting becomes possible
6. ✅ Master account can route inquiries to sub-accounts

---

## 🔄 Next Steps After Credentials Added

### Week 2: Create Pipelines

In **each sub-account**, create 5 pipelines:

**The Harvest**:
1. Volunteer Pipeline
2. Event Booking Pipeline
3. Tenant Pipeline
4. CSA Pipeline
5. Contact Pipeline

**ACT Farm**:
1. Residency Pipeline
2. Accommodation Pipeline
3. Workshop Pipeline
4. June's Patch Pipeline
5. General Inquiry Pipeline

**Empathy Ledger**:
1. Storyteller Pipeline
2. Organization Pipeline
3. Partnership Pipeline
4. Research Pipeline
5. Subscription Pipeline

**JusticeHub**:
1. Family Inquiry Pipeline
2. Service Provider Pipeline
3. Campaign Nomination Pipeline
4. CONTAINED Booking Pipeline
5. Partnership Pipeline

**Goods on Country**:
1. Customer Pipeline
2. Manufacturer Pipeline
3. Wholesale Pipeline
4. Community Partnership Pipeline
5. Product Development Pipeline

**ACT Hub (Master)**:
1. General Inquiry Pipeline
2. Partnership Pipeline
3. Funding Pipeline
4. Art Program Pipeline
5. Governance Pipeline

Copy pipeline IDs and add to `.env.local` files!

---

## 💡 Pro Tips

1. **Use test mode first**: GHL has test sub-accounts - create those first to practice
2. **Copy pipeline IDs immediately**: After creating each pipeline, copy its ID
3. **Screenshot everything**: Take screenshots of API keys, Location IDs (in case you lose them)
4. **Backup credentials**: Save in 1Password or secure password manager
5. **Don't rush**: Take time to set up each account properly

---

## ⚠️ Security Reminders

- ✅ **DO** store API keys in `.env-vault/` (gitignored)
- ❌ **DON'T** commit API keys to Git
- ✅ **DO** use separate keys for each project
- ❌ **DON'T** share sub-account keys between projects
- ✅ **DO** backup vault: `./scripts/backup-env.sh`

---

**Time Estimate**: 2-3 hours to create all 6 accounts + API keys
**Difficulty**: Medium (repetitive but straightforward)
**Priority**: CRITICAL (blocks all form integrations)

---

**Start Here**: https://app.gohighlevel.com/ → Settings → Sub-Accounts → Create

**Questions?**: See [GHL_SUBACCOUNT_STRATEGY.md](./GHL_SUBACCOUNT_STRATEGY.md) for detailed strategy

---

**Last Updated**: December 24, 2025
