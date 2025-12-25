# GHL Migration Decision Guide - Option 2 Reality Check

**Date**: December 24, 2025
**Based on**: Official GHL documentation review (December 2025)

---

## ⚠️ Important Discovery

After reviewing [official GHL documentation](https://help.gohighlevel.com/support/solutions/articles/155000002031-sub-account-transfer-guide), I found:

**❌ You CANNOT migrate a sub-account into the parent agency account**

GHL only supports:
- ✅ Transferring sub-accounts between different agencies
- ✅ Ejecting sub-accounts to become new agencies
- ❌ Merging sub-account data into parent agency

**Source**: [GoHighLevel Sub-Account Transfer Guide](https://help.gohighlevel.com/support/solutions/articles/155000002031-sub-account-transfer-guide)

---

## 🎯 Your Two ACTUAL Options

### Option 1: Keep Sub-Account, Rename It (SAFEST)

**What to do**:
1. Log into GHL
2. Switch to sub-account "A Curious Tractor" (ID: `agzsSZWgovjwgpcoASWG`)
3. Go to Settings → Business Profile
4. Change name to: **"ACT Hub"**
5. Save
6. Go back to Agency level
7. Create 5 NEW sub-accounts (The Harvest, ACT Farm, etc.)

**Final Structure**:
```
A Curious Tractor (Agency) ← Admin/billing only
├── ACT Hub (Sub-Account) ← Renamed, keeps all your data
├── The Harvest (Sub-Account) ← NEW
├── ACT Farm (Sub-Account) ← NEW
├── Empathy Ledger (Sub-Account) ← NEW
├── JusticeHub (Sub-Account) ← NEW
└── Goods on Country (Sub-Account) ← NEW
```

**Pros**:
- ✅ Zero data loss
- ✅ No export/import needed
- ✅ Takes 10 minutes
- ✅ Zero risk
- ✅ All existing workflows, contacts, pipelines preserved

**Cons**:
- ⚠️ Agency account not used operationally (just admin)
- ⚠️ 6 sub-accounts instead of "agency + 5 subs"

**Recommendation**: ⭐⭐⭐⭐⭐ **BEST CHOICE** if you have ANY data in the current sub-account

---

### Option 2: Manual Migration (RISKIER, MORE WORK)

**What to do**:
1. **Audit current sub-account data**
2. **Export everything manually**:
   - Contacts (CSV export)
   - Pipelines (screenshot/document structure)
   - Workflows (export via Snapshots)
   - Email templates (manual copy)
   - Calendars (recreate manually)
3. **Delete sub-account** (24-hour grace period)
4. **Import/recreate at Agency level**:
   - Import contacts CSV
   - Rebuild pipelines manually
   - Import workflow snapshots
   - Recreate email templates
   - Reconfigure calendars
5. **Set up LC Email at agency level** for act.place
6. **Create 5 sub-accounts** for other projects

**Final Structure**:
```
A Curious Tractor (Agency) ← ACT Hub operations here
├── The Harvest (Sub-Account) ← NEW
├── ACT Farm (Sub-Account) ← NEW
├── Empathy Ledger (Sub-Account) ← NEW
├── JusticeHub (Sub-Account) ← NEW
└── Goods on Country (Sub-Account) ← NEW
```

**Pros**:
- ✅ Cleaner conceptual structure
- ✅ Agency account used for ACT Hub
- ✅ Only 5 sub-accounts

**Cons**:
- ⚠️ Risk of data loss during migration
- ⚠️ 3-5 hours of manual work
- ⚠️ Workflows need testing after import
- ⚠️ Contacts lose conversation history
- ⚠️ Email threads disconnected
- ⚠️ Pipeline progress reset
- ⚠️ 24-hour deletion window (pressure)

**Recommendation**: ⭐⭐ **ONLY if you have <20 contacts and no complex setup**

---

## 🔍 Step 1: Audit Your Current Sub-Account

Before deciding, check what you have in the current "A Curious Tractor" sub-account.

### Login and Check:

1. Log into GHL: https://app.gohighlevel.com/
2. Switch to sub-account "A Curious Tractor"
3. Check these metrics:

#### Contacts
```
Go to: Contacts

Count: _____ total contacts

Questions:
- Do you have ANY contacts?
- Are there active conversations?
- Any important contact history?
```

#### Pipelines
```
Go to: Opportunities → Pipelines

Count: _____ pipelines

Questions:
- Have you created any pipelines?
- Are there opportunities in any stages?
- Any automation triggers on pipeline stages?
```

#### Workflows
```
Go to: Automations → Workflows

Count: _____ workflows

Questions:
- Any active workflows?
- Any paused/draft workflows you want to keep?
```

#### Email Templates
```
Go to: Settings → Templates → Email Templates

Count: _____ templates

Questions:
- Any email templates created?
- Would recreating them take long?
```

#### Calendars
```
Go to: Calendars

Count: _____ calendars

Questions:
- Any booking calendars set up?
- Any scheduled appointments?
```

#### LC Email / Email Services
```
Go to: Settings → Email Services → LC Email

Questions:
- Have you set up LC Email for any domain?
- Any verified sending domains?
```

---

## 🎯 Decision Matrix

### If ALL of these are TRUE → Option 2 might work:
- [ ] <20 contacts (or willing to lose them)
- [ ] No pipelines OR simple pipelines you can rebuild in 30 mins
- [ ] No active workflows OR only 1-2 simple workflows
- [ ] No email templates OR happy to recreate
- [ ] No calendars OR no booked appointments
- [ ] No LC Email domains set up yet
- [ ] No active campaigns running
- [ ] You have 3-5 hours to dedicate to migration

### If ANY of these are TRUE → Option 1 is safer:
- [ ] >20 contacts
- [ ] Active conversations with contacts
- [ ] Complex pipelines with multiple stages
- [ ] 3+ workflows with conditions/delays
- [ ] Email templates you spent time creating
- [ ] Calendars with booked appointments
- [ ] LC Email already configured
- [ ] Active campaigns or sequences running
- [ ] You want to avoid risk of data loss
- [ ] You don't have 3-5 hours for migration

---

## 📋 Option 1 Step-by-Step (RECOMMENDED)

### Time Required: 10 minutes

### Step 1: Rename Sub-Account

1. Log into GHL: https://app.gohighlevel.com/
2. Click dropdown (top-right)
3. Switch to "A Curious Tractor" sub-account
4. Go to **Settings** → **Business Profile**
5. Find **Business Name** field
6. Change from: `A Curious Tractor`
7. Change to: `ACT Hub`
8. Click **Save**

### Step 2: Verify Name Change

1. Click dropdown (top-right)
2. You should now see: **"ACT Hub"** instead of "A Curious Tractor"
3. Verify URL still works and data intact

### Step 3: Return to Agency Level

1. Click dropdown (top-right)
2. Look for "Agency" or "A Curious Tractor (Agency)"
3. Click to switch to Agency level

### Step 4: Create 5 New Sub-Accounts

Follow: [GHL_SETUP_CHECKLIST.md](./GHL_SETUP_CHECKLIST.md) Section "Step 2: Create Sub-Accounts"

Create these 5:
1. The Harvest Community Hub
2. ACT Farm Tourism & Residencies
3. Empathy Ledger Platform
4. JusticeHub Service Finder
5. Goods on Country

### Step 5: Generate API Keys

For ALL 6 sub-accounts (including newly renamed "ACT Hub"):
- Follow: [GHL_SETUP_CHECKLIST.md](./GHL_SETUP_CHECKLIST.md) Section "Step 3: Generate API Keys"

### Step 6: Set Up LC Email

For ALL 6 sub-accounts:
- Follow: [QUICK_START_GHL_LC_EMAIL.md](./QUICK_START_GHL_LC_EMAIL.md)

### ✅ Done!

You now have:
- 1 Agency account (admin)
- 6 Sub-accounts (operational)
- All data preserved
- Zero migration risk

---

## 📋 Option 2 Step-by-Step (ADVANCED USERS ONLY)

**⚠️ WARNING**: This option has significant risk. Only proceed if you completed the audit above and are confident.

### Time Required: 3-5 hours

### Prerequisites Checklist

Before starting, complete this checklist:

- [ ] Audited sub-account (completed form above)
- [ ] Confirmed <20 contacts (or willing to lose data)
- [ ] Exported contacts to CSV
- [ ] Documented all pipeline structures (screenshots)
- [ ] Exported workflows to Snapshot
- [ ] Copied email template content to text file
- [ ] No active campaigns running
- [ ] No scheduled appointments in calendars
- [ ] Set aside 3-5 hours for this process
- [ ] Read GHL deletion warnings

---

### Step 1: Export All Data (60-90 minutes)

#### Export Contacts

**Source**: [How to Export Contacts from GoHighLevel](https://help.gohighlevel.com/support/solutions/articles/48001238482-contacts-export-as-csv-upgrade)

1. Switch to sub-account "A Curious Tractor"
2. Go to **Contacts**
3. Click checkbox (top-left) to select all
4. Click **Select All Contacts** (to include all pages)
5. Click **More** → **Export**
6. Click **Manage Fields** to select which data to export
7. Check all fields you want to keep
8. Click **Export**
9. Download CSV file
10. Save to safe location: `/Users/benknight/Downloads/act-contacts-export-[date].csv`

**Important Notes**:
- Only Admin/Manager roles can export
- CSV format only
- Export expires after 30 days
- No conversation history is exported

#### Document Pipelines

**Source**: [Understanding Pipelines](https://help.gohighlevel.com/support/solutions/articles/155000001982-understanding-pipelines)

1. Go to **Opportunities** → **Pipelines**
2. For EACH pipeline:
   - Take screenshot of full pipeline view
   - Note pipeline name
   - Note each stage name (in order)
   - Note any automation triggers per stage
   - Note any custom fields used
3. Save screenshots to: `/Users/benknight/Downloads/ghl-pipelines-backup/`

**GHL does NOT support exporting pipelines** - must rebuild manually.

#### Export Workflows

**Source**: [How to Copy Workflow to Another Sub-Account](https://growthable.io/gohighlevel-tutorials/workflows/how-to-copy-workflow-to-another-sub-account-in-gohighlevel/)

1. Go to **Automations** → **Workflows**
2. For EACH workflow you want to keep:
   - Open workflow
   - Click **...** (three dots) → **Add to Snapshot**
   - Create new Snapshot: "ACT Migration Backup"
   - Add workflow to snapshot
3. Go to **Settings** → **Snapshots**
4. Find "ACT Migration Backup" snapshot
5. Click **Share**
6. Copy Share Link
7. Save link in safe place

**Important Notes**:
- Custom fields transfer with workflows
- Pipeline stages must exist in target account
- Email/SMS templates transfer
- Test all workflows after import

#### Export Email Templates

1. Go to **Settings** → **Templates** → **Email Templates**
2. For EACH template:
   - Open template
   - Copy subject line to text file
   - Copy body HTML/text to text file
   - Note any merge fields used
3. Save to: `/Users/benknight/Downloads/ghl-email-templates.txt`

**No export feature** - manual copy only.

#### Document Calendars

1. Go to **Calendars**
2. For EACH calendar:
   - Take screenshot of calendar settings
   - Note availability rules
   - Note any integrations (Zoom, etc.)
   - Check for scheduled appointments
3. Save screenshots

**Warning**: Scheduled appointments will be lost if you delete sub-account.

---

### Step 2: Delete Sub-Account (5 minutes)

**Source**: [How to Delete a Sub-Account](https://help.gohighlevel.com/support/solutions/articles/48001184862-how-to-delete-a-subaccount-location)

**⚠️ CRITICAL WARNINGS**:
- After 24 hours, deletion is PERMANENT
- All contacts, messages, campaigns, settings will be LOST
- Disconnect all integrations first (Twilio, Mailgun, Facebook, Google)
- If unsure, you can PAUSE sub-account instead

**Steps**:

1. Switch to **Agency Level**
2. Click **Sub-Accounts** (left menu)
3. Find "A Curious Tractor" sub-account
4. Click **three-dot menu** → **Manage Client**
5. Click **Actions** (top-right) → **Delete**
6. Read all disclaimers carefully
7. Confirm deletion

**Grace Period**: You have 24 hours to undo deletion if needed.

---

### Step 3: Import Data to Agency Account (90-120 minutes)

#### Import Contacts

1. Switch to **Agency Level** account
2. Go to **Contacts**
3. Click **Import**
4. Upload your CSV file
5. Map columns (Email, Name, Phone, etc.)
6. Click **Import**
7. Wait for import to complete
8. Verify contact count matches export

**Important**:
- Conversation history will NOT be imported
- Email threads will be disconnected
- Pipeline associations will be lost

#### Recreate Pipelines

1. Go to **Opportunities** → **Pipelines**
2. Click **+ Create Pipeline**
3. For EACH pipeline (using your screenshots):
   - Enter pipeline name
   - Add stages (in correct order)
   - Configure stage automation (if any)
   - Add custom fields
4. Save pipeline

**Time estimate**: 15-20 minutes per pipeline

#### Import Workflows

1. Go to **Settings** → **Snapshots**
2. Click **Import Snapshot**
3. Paste the Share Link you saved earlier
4. Select which workflows to import
5. Click **Import**
6. Wait for import to complete
7. Go to **Automations** → **Workflows**
8. For EACH imported workflow:
   - Open workflow
   - Verify all steps are correct
   - Check that pipelines/stages exist
   - Check email templates exist
   - **Test the workflow** with dummy contact
   - Activate workflow if tests pass

**Important**: Do NOT activate workflows until pipelines and templates are recreated.

#### Recreate Email Templates

1. Go to **Settings** → **Templates** → **Email Templates**
2. Click **+ Create Template**
3. For EACH template (using your text file):
   - Enter template name
   - Enter subject line
   - Paste body HTML/text
   - Add merge fields
4. Save template

**Time estimate**: 5-10 minutes per template

#### Recreate Calendars

1. Go to **Calendars**
2. Click **+ Create Calendar**
3. For EACH calendar (using your screenshots):
   - Enter calendar name
   - Set availability rules
   - Configure integrations
   - Set notification settings
4. Save calendar

**Time estimate**: 10-15 minutes per calendar

---

### Step 4: Set Up LC Email at Agency Level (30 minutes)

Follow: [QUICK_START_GHL_LC_EMAIL.md](./QUICK_START_GHL_LC_EMAIL.md)

Set up LC Email for: **act.place**

1. Settings → Email Services → LC Email
2. Add Domain: `act.place`
3. Copy DNS records
4. Add to Cloudflare
5. Verify in GHL

---

### Step 5: Create 5 Sub-Accounts (60 minutes)

Follow: [GHL_SETUP_CHECKLIST.md](./GHL_SETUP_CHECKLIST.md)

Create:
1. The Harvest
2. ACT Farm
3. Empathy Ledger
4. JusticeHub
5. Goods on Country

---

### Step 6: Verification & Testing (30 minutes)

**Agency Account (ACT Hub)**:
- [ ] Contacts imported successfully
- [ ] Pipelines recreated
- [ ] Workflows imported and tested
- [ ] Email templates recreated
- [ ] Calendars recreated
- [ ] LC Email configured for act.place
- [ ] Test: Send email from act.place
- [ ] Test: Receive email to act.place
- [ ] Test: Create contact and move through pipeline
- [ ] Test: Trigger workflow

**Sub-Accounts**:
- [ ] All 5 sub-accounts created
- [ ] API keys generated for all 6 accounts
- [ ] LC Email configured for all 5 domains

---

## ✅ Final Recommendation

Based on GHL documentation review and migration complexity:

### ⭐ STRONGLY RECOMMEND: Option 1 (Rename)

**Why**:
- ✅ Zero data loss
- ✅ 10 minutes vs 3-5 hours
- ✅ Zero risk
- ✅ All features preserved (conversation history, email threads, pipeline progress)
- ✅ Can always reorganize later if needed

**Only use Option 2 if**:
- You have <10 contacts
- No pipelines, workflows, or templates
- You want "perfect" structure more than safety
- You have 5+ hours available

---

## 📚 Official Documentation Sources

- [Sub-Account Transfer Guide](https://help.gohighlevel.com/support/solutions/articles/155000002031-sub-account-transfer-guide)
- [How to Export Contacts](https://help.gohighlevel.com/support/solutions/articles/48001238482-contacts-export-as-csv-upgrade)
- [How to Delete a Sub-Account](https://help.gohighlevel.com/support/solutions/articles/48001184862-how-to-delete-a-subaccount-location)
- [Understanding Pipelines](https://help.gohighlevel.com/support/solutions/articles/155000001982-understanding-pipelines)
- [Copy Workflows Between Sub-Accounts](https://growthable.io/gohighlevel-tutorials/workflows/how-to-copy-workflow-to-another-sub-account-in-gohighlevel/)

---

**Last Updated**: December 24, 2025
**Recommendation**: Option 1 (Rename) unless you have <10 contacts and no workflows
