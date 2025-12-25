# GHL Account Structure Diagnostic & Fix Guide

**Date**: December 24, 2025
**Purpose**: Determine your current GHL setup and provide correct next steps

---

## 🔍 Step 1: Diagnose Your Current Setup

### What to Check

1. **Log into GoHighLevel**: https://app.gohighlevel.com/
2. **Look at the top-right corner** where your account name/avatar is
3. **Click the dropdown** (it may show your company name or have an account switcher)

### What You Should See

You'll see ONE of these scenarios:

---

## ✅ Scenario A: CORRECT Setup (Ideal)

### What You See in Dropdown:
```
A Curious Tractor (Agency)
└── [No sub-accounts listed yet]
```

**OR** just your agency name with no sub-account options

### What This Means:
- ✅ You're at the Agency level (master account)
- ✅ You have NOT created any sub-accounts yet
- ✅ Your pipelines/CRM are in the Agency account (not a sub-account)
- ✅ This is the CORRECT setup

### ✅ Next Steps (Skip to Section 2 below)

---

## ⚠️ Scenario B: Needs Adjustment

### What You See in Dropdown:
```
A Curious Tractor (Agency)
├── A Curious Tractor (Sub-Account) ← You see this listed
└── [Maybe other sub-accounts]
```

**You can switch between "Agency" and a sub-account called "A Curious Tractor"**

### What This Means:
- ⚠️ You created a sub-account with same name as agency
- ⚠️ Your pipelines/CRM might be in the SUB-ACCOUNT (not agency)
- ⚠️ This creates confusion (two "A Curious Tractor" accounts)
- ⚠️ Needs reorganization

### ⚠️ Next Steps (Skip to Section 3 below)

---

## 2️⃣ If You Have Scenario A (CORRECT Setup)

Great! Your setup is ideal. Here's what to do:

### Your Current State:
- **Agency Account**: A Curious Tractor (this is your master account)
- **Sub-Accounts**: None yet
- **Next Action**: Create 5 sub-accounts

### Create 5 Sub-Accounts

**In GoHighLevel**:
1. Stay at Agency level
2. Go to: **Settings** → **Sub-Accounts**
3. Click **"+ Add Location"** or **"Create Sub-Account"**
4. Create these 5 sub-accounts:

#### Sub-Account 1: The Harvest
```
Name: The Harvest Community Hub
Domain: theharvest.org.au
Email: hello@theharvest.org.au
Address: 295 Black Cockatoo Road, Black Cockatoo Valley SA 5354
Phone: [ACT phone number]
```

#### Sub-Account 2: ACT Farm
```
Name: ACT Farm Tourism & Residencies
Domain: actfarm.org.au
Email: bookings@actfarm.org.au
Address: 295 Black Cockatoo Road, Black Cockatoo Valley SA 5354
Phone: [ACT phone number]
```

#### Sub-Account 3: Empathy Ledger
```
Name: Empathy Ledger Platform
Domain: empathyledger.com
Email: stories@empathyledger.com
Address: 295 Black Cockatoo Road, Black Cockatoo Valley SA 5354
Phone: [ACT phone number]
```

#### Sub-Account 4: JusticeHub
```
Name: JusticeHub Service Finder
Domain: justicehub.org.au
Email: support@justicehub.org.au
Address: 295 Black Cockatoo Road, Black Cockatoo Valley SA 5354
Phone: [ACT phone number]
```

#### Sub-Account 5: Goods on Country
```
Name: Goods on Country
Domain: goodsoncountry.com
Email: hello@goodsoncountry.com
Address: 295 Black Cockatoo Road, Black Cockatoo Valley SA 5354
Phone: [ACT phone number]
```

### After Creating Sub-Accounts

You'll have this structure:
```
A Curious Tractor (Agency) ← Master account for ACT Hub (act.place)
├── The Harvest (Sub-Account)
├── ACT Farm (Sub-Account)
├── Empathy Ledger (Sub-Account)
├── JusticeHub (Sub-Account)
└── Goods on Country (Sub-Account)
```

**Total**: 6 accounts (1 master + 5 subs)

### Next: Generate API Keys

For **EACH account** (including master):

1. **Switch to account** (using dropdown)
2. Go to **Settings** → **Integrations**
3. Click **API**
4. Click **"+ Create Private Integration"**
5. Fill in:
   - **Name**: `[Project Name] API`
   - **Scopes**: Select ALL scopes
6. Click **Create**
7. **Copy the API Key** (starts with `eyJ...` or similar)
8. **Copy the Location ID** (from Settings → Business Profile)

Repeat for all 6 accounts.

### Next: Configure LC Email

Follow the guide: [QUICK_START_GHL_LC_EMAIL.md](./QUICK_START_GHL_LC_EMAIL.md)

For each sub-account:
1. Add domain to LC Email
2. Copy DNS records
3. Add to Cloudflare
4. Verify in GHL

---

## 3️⃣ If You Have Scenario B (Needs Adjustment)

You have two options:

### Option 1: Keep Structure, Rename Sub-Account (EASIEST)

**What to do**:
1. Switch to the "A Curious Tractor" SUB-ACCOUNT
2. Go to Settings → Business Profile
3. Rename sub-account to: **"ACT Hub"** or **"ACT.Place"**
4. Keep your existing pipelines/CRM there
5. Create 5 MORE sub-accounts (The Harvest, ACT Farm, etc.)

**Result**:
```
A Curious Tractor (Agency) ← Master account (admin only)
├── ACT Hub (Sub-Account) ← Renamed from "A Curious Tractor"
├── The Harvest (Sub-Account)
├── ACT Farm (Sub-Account)
├── Empathy Ledger (Sub-Account)
├── JusticeHub (Sub-Account)
└── Goods on Country (Sub-Account)
```

**Total**: 7 accounts (1 agency admin + 6 sub-accounts)

**Pros**:
- ✅ Keep all existing work (pipelines, contacts, etc.)
- ✅ No data migration needed
- ✅ Quick fix (just rename + create 5 more)

**Cons**:
- ⚠️ Agency account not used for operations (just admin)
- ⚠️ 6 sub-accounts instead of 5

**Recommendation**: This is the EASIEST option if you have existing pipelines/contacts in the sub-account.

---

### Option 2: Migrate to Agency, Delete Sub-Account (CLEANEST)

**What to do**:
1. **In the "A Curious Tractor" sub-account**: Export all contacts, pipelines, workflows
2. **In the Agency account**: Import/recreate everything
3. **Delete the "A Curious Tractor" sub-account**
4. **Create 5 sub-accounts** (The Harvest, ACT Farm, etc.)

**Result**:
```
A Curious Tractor (Agency) ← Master account for ACT Hub operations
├── The Harvest (Sub-Account)
├── ACT Farm (Sub-Account)
├── Empathy Ledger (Sub-Account)
├── JusticeHub (Sub-Account)
└── Goods on Country (Sub-Account)
```

**Total**: 6 accounts (1 master + 5 subs)

**Pros**:
- ✅ Clean structure
- ✅ Agency account used for ACT Hub
- ✅ Only 5 sub-accounts (as intended)

**Cons**:
- ⚠️ Requires manual migration of existing work
- ⚠️ Takes 2-3 hours to migrate everything
- ⚠️ Risk of losing data if not careful

**Recommendation**: Only do this if you have minimal existing work in GHL.

---

## 4️⃣ Which Option Should You Choose?

### Choose **Scenario A Steps** if:
- You DON'T see a sub-account called "A Curious Tractor" in the dropdown
- You're working at the Agency level already
- Your pipelines/contacts are in the Agency account

### Choose **Option 1 (Rename)** if:
- You DO see a sub-account called "A Curious Tractor"
- You have existing pipelines/contacts in that sub-account
- You want to keep all existing work

### Choose **Option 2 (Migrate)** if:
- You DO see a sub-account called "A Curious Tractor"
- You have minimal work in that sub-account
- You want the cleanest structure
- You're willing to spend 2-3 hours migrating

---

## 5️⃣ After Determining Your Scenario

### Scenario A (Correct Setup)
- ✅ Create 5 sub-accounts
- ✅ Generate 6 API keys (1 master + 5 subs)
- ✅ Configure LC Email for all 6 domains
- ✅ Proceed to: [GHL_SETUP_CHECKLIST.md](./GHL_SETUP_CHECKLIST.md)

### Scenario B → Option 1 (Rename)
- ✅ Rename sub-account to "ACT Hub"
- ✅ Create 5 MORE sub-accounts
- ✅ Generate 6 API keys (not 7 - agency account won't be used operationally)
- ✅ Configure LC Email for all 6 domains
- ✅ Proceed to: [GHL_SETUP_CHECKLIST.md](./GHL_SETUP_CHECKLIST.md)

### Scenario B → Option 2 (Migrate)
- ✅ Export data from sub-account
- ✅ Import to agency account
- ✅ Delete sub-account
- ✅ Create 5 sub-accounts
- ✅ Generate 6 API keys (1 master + 5 subs)
- ✅ Configure LC Email for all 6 domains
- ✅ Proceed to: [GHL_SETUP_CHECKLIST.md](./GHL_SETUP_CHECKLIST.md)

---

## 6️⃣ Quick Check: What Do You See?

Answer these questions to determine your scenario:

1. **When you click the dropdown in top-right of GHL, what do you see?**
   - A) Just "A Curious Tractor" (or your name/agency name)
   - B) "A Curious Tractor" AND a sub-account also called "A Curious Tractor"
   - C) "A Curious Tractor" AND other sub-accounts with different names

2. **Where are your current pipelines/contacts located?**
   - A) In the Agency account (I think?)
   - B) In a sub-account called "A Curious Tractor"
   - C) I don't have any pipelines/contacts yet

3. **How many sub-accounts do you currently have?**
   - A) Zero
   - B) One (called "A Curious Tractor")
   - C) Multiple (list them)

### If You Answered:
- **Mostly A**: You have Scenario A (correct setup) → Follow Section 2
- **Mostly B**: You have Scenario B → Choose Option 1 (rename) or Option 2 (migrate)
- **Mostly C**: You have a different setup → Let's diagnose together

---

## 🎯 Final Account Structure (Goal)

After following this guide, you'll have:

```
A Curious Tractor (Agency/Master)
├── Location ID: loc_xxxxx
├── API Key: eyJxxxxx (or sk-live_xxxxx)
├── Domain: act.place
├── LC Email: hello@act.place
└── 5 Pipelines: General Inquiry, Partnership, Funding, Art, Governance

The Harvest (Sub-Account #1)
├── Location ID: loc_yyyyy
├── API Key: eyJyyyyy
├── Domain: theharvest.org.au
├── LC Email: hello@theharvest.org.au
└── 5 Pipelines: Volunteer, Event, Tenant, CSA, Contact

ACT Farm (Sub-Account #2)
├── Location ID: loc_zzzzz
├── API Key: eyJzzzzz
├── Domain: actfarm.org.au
├── LC Email: bookings@actfarm.org.au
└── 5 Pipelines: Residency, Accommodation, Workshop, June's Patch, General

Empathy Ledger (Sub-Account #3)
├── Location ID: loc_aaaaa
├── API Key: eyJaaaaa
├── Domain: empathyledger.com
├── LC Email: stories@empathyledger.com
└── 5 Pipelines: Storyteller, Organization, Partnership, Research, Subscription

JusticeHub (Sub-Account #4)
├── Location ID: loc_bbbbb
├── API Key: eyJbbbbb
├── Domain: justicehub.org.au
├── LC Email: support@justicehub.org.au
└── 5 Pipelines: Family, Provider, Campaign, CONTAINED, Partnership

Goods on Country (Sub-Account #5)
├── Location ID: loc_ccccc
├── API Key: eyJccccc
├── Domain: goodsoncountry.com
├── LC Email: hello@goodsoncountry.com
└── 5 Pipelines: Customer, Manufacturer, Wholesale, Community, Product Dev
```

**Total**: 6 accounts, 30 pipelines, 6 domains with LC Email

---

## 📋 Next Steps Checklist

After determining your scenario and fixing structure:

- [ ] All 6 accounts exist with correct names
- [ ] Generated 6 API keys (1 per account)
- [ ] Generated 6 Location IDs (1 per account)
- [ ] Configured LC Email for all 6 domains (DNS records added)
- [ ] Verified all 6 domains in GHL (green checkmark)
- [ ] Populated .env vault with credentials
- [ ] Synced vault to all projects (`./scripts/sync-env.sh`)
- [ ] Validated env vars (`./scripts/validate-env.sh`)

---

## 🆘 Still Confused?

If you're still unsure which scenario you're in:

1. Take a screenshot of your GHL dropdown menu (top-right corner)
2. Take a screenshot of Settings → Business Profile
3. Share both screenshots

I can then tell you exactly which scenario you're in and what to do.

---

**Last Updated**: December 24, 2025
**Related Docs**:
- [GHL_SETUP_CHECKLIST.md](./GHL_SETUP_CHECKLIST.md)
- [GHL_SUBACCOUNT_STRATEGY.md](./GHL_SUBACCOUNT_STRATEGY.md)
- [QUICK_START_GHL_LC_EMAIL.md](./QUICK_START_GHL_LC_EMAIL.md)
