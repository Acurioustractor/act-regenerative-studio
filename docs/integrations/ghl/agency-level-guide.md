# How to Access Agency-Level CRM in GoHighLevel

**Date**: December 24, 2025
**Purpose**: Show you exactly how to see and use CRM features at the Agency level

---

## 🎯 The Confusion

You're right to be confused! GoHighLevel's interface can be tricky because:

- **Agency View** looks like it's only for managing sub-accounts
- **Location/Sub-Account View** is where you normally see CRM features
- BUT: The Agency account DOES have full CRM features - you just need to know where to look

**Source**: [GoHighLevel Agency Sub-Account Guide](https://ghl-services-playbooks-automation-crm-marketing.ghost.io/highlevel-sub-account-guide-setup-transfer-optimization-for-agencies/)

---

## 🔍 How to Access Agency-Level CRM

### Step 1: Make Sure You're at Agency Level

1. Log into GHL: https://app.gohighlevel.com/
2. Look at the **top-right corner** (where your name/avatar is)
3. Click the **dropdown**
4. You should see:
   ```
   A Curious Tractor (Agency)  ← This is what you want
   └── A Curious Tractor (Location)  ← This is your sub-account
   ```
5. **Click on "A Curious Tractor (Agency)"** if not already selected

### Step 2: Look at the Left Sidebar

Once you're at Agency level, you'll see the left sidebar has TWO sections:

**Top Section - Agency Management** (this is what you probably see now):
- Dashboard
- Sub-Accounts
- Payments
- Reporting
- Settings
- etc.

**Bottom Section - CRM Features** (this is what you're looking for):
- **Contacts** ← This is where your agency-level contacts are
- **Opportunities** ← This is where your pipelines are
- **Calendars** ← This is where booking calendars go
- **Conversations** ← This is where emails/SMS appear
- **Automations** ← This is where workflows are
- **Marketing** ← Campaigns, forms, etc.

**If you DON'T see the CRM section**, it means your Agency account might not have the "location" features enabled.

---

## 🎨 How to Enable Agency-Level CRM (If Not Visible)

### Option A: Your Agency Might Already Be a "Location"

Some GHL accounts automatically make the Agency a location. Check this:

1. Go to **Settings** (in left sidebar)
2. Click **Business Profile**
3. Look for **Location ID** or **Location Name**
4. If you see a Location ID (like `loc_xxxxx`), your agency IS a location and you should see CRM features

### Option B: Enable "Agency as Location" Feature

If you DON'T see CRM features at agency level:

1. Go to **Settings** → **Company**
2. Look for **"Use Agency as a Location"** toggle
3. Turn it ON
4. Refresh the page
5. CRM features should now appear in left sidebar

**Note**: Not all GHL plans have this option. It may depend on your subscription level.

---

## 📋 Testing Agency-Level CRM (Before Deleting Sub-Account)

Let's set up a test to prove the Agency level works for CRM:

### Test 1: Create a Contact at Agency Level

1. Make sure you're at **Agency level** (check dropdown)
2. Click **Contacts** (left sidebar)
3. Click **+ Add Contact**
4. Fill in:
   - **Name**: Test Agency Contact
   - **Email**: test@act.place
   - **Phone**: +61 400 000 000
5. Click **Save**
6. You should see the contact appear in your agency-level contacts list

### Test 2: Create a Pipeline at Agency Level

1. Make sure you're at **Agency level**
2. Click **Opportunities** → **Pipelines** (left sidebar)
3. Click **+ New Pipeline**
4. Fill in:
   - **Pipeline Name**: ACT Hub Test Pipeline
5. Click **Save**
6. Add stages:
   - Click **+ Add Stage**
   - Stage 1: "Inquiry"
   - Stage 2: "Qualified"
   - Stage 3: "Active"
7. Click **Save**

### Test 3: Create an Opportunity in Your Pipeline

1. Stay in **Opportunities** view
2. Click **+ Add Opportunity**
3. Fill in:
   - **Pipeline**: ACT Hub Test Pipeline
   - **Stage**: Inquiry
   - **Name**: Test Opportunity
   - **Contact**: Test Agency Contact (select from dropdown)
4. Click **Save**
5. You should see the opportunity card appear in your pipeline

### Test 4: Set Up LC Email at Agency Level

1. Make sure you're at **Agency level**
2. Go to **Settings** → **Email Services** → **LC Email**
3. Click **+ Add Domain**
4. Enter: `act.place`
5. GHL will show DNS records
6. **Take screenshot** of DNS records (don't add to Cloudflare yet, just test the interface)
7. This proves LC Email works at agency level

---

## ✅ If All Tests Work

If you can do ALL of the above at Agency level, then you're ready to:

1. **Export** your sub-account data (contacts, pipelines)
2. **Import** to Agency level
3. **Delete** the sub-account
4. **Create** 5 new sub-accounts for your projects
5. **Use Agency** as your ACT Hub operations

---

## ⚠️ If Tests DON'T Work

If you **CANNOT** see Contacts, Opportunities, or CRM features at Agency level, then:

### You have two options:

**Option A: Contact GHL Support**

Ask them to enable "Agency as Location" for your account:

1. Go to: https://support.gohighlevel.com/
2. Submit ticket: "Please enable Agency-as-Location for my account"
3. Wait for response (usually 24-48 hours)

**Option B: Use Option 1 (Rename Sub-Account)**

Just rename your existing sub-account to "ACT Hub" and create 5 more sub-accounts. This avoids needing agency-level CRM.

---

## 🎯 Visual Guide: Where to Find Things

### When at AGENCY LEVEL:

```
Left Sidebar:
┌─────────────────────────────┐
│ 🏢 Agency Management        │
├─────────────────────────────┤
│   Dashboard                 │
│   Sub-Accounts              │
│   Payments                  │
│   Reporting                 │
│   Settings                  │
├─────────────────────────────┤
│ 👥 CRM (Agency Location)    │  ← THIS SECTION MIGHT BE HIDDEN
├─────────────────────────────┤
│   Contacts  ✅              │
│   Opportunities  ✅          │
│   Calendars  ✅              │
│   Conversations  ✅          │
│   Automations  ✅            │
│   Marketing  ✅              │
└─────────────────────────────┘
```

### When at SUB-ACCOUNT LEVEL:

```
Left Sidebar:
┌─────────────────────────────┐
│ 👥 CRM Features             │
├─────────────────────────────┤
│   Contacts  ✅              │
│   Opportunities  ✅          │
│   Calendars  ✅              │
│   Conversations  ✅          │
│   Automations  ✅            │
│   Marketing  ✅              │
│   Settings                  │
│   Users                     │
└─────────────────────────────┘
```

**The key difference**: Sub-account view ONLY shows CRM features. Agency view shows BOTH agency management AND CRM features (if enabled).

---

## 🔄 Switching Between Agency and Sub-Account

**To switch views:**

1. Click **dropdown** (top-right, where your name is)
2. Select:
   - **"A Curious Tractor (Agency)"** → See agency management + agency-level CRM
   - **"A Curious Tractor (Location)"** → See sub-account CRM only

**Why this matters:**

- When you delete the sub-account, you'll ONLY have the Agency level
- So you MUST make sure Agency-level CRM works BEFORE deleting the sub-account
- Test everything at Agency level first!

---

## 📋 Pre-Migration Checklist

Before deleting your sub-account, confirm ALL of these work at Agency level:

- [ ] Can see **Contacts** section in left sidebar
- [ ] Can add a new contact
- [ ] Can see **Opportunities** section in left sidebar
- [ ] Can create a new pipeline
- [ ] Can add an opportunity to pipeline
- [ ] Can see **Calendars** section
- [ ] Can create a calendar
- [ ] Can see **Conversations** section
- [ ] Can see **Automations** → **Workflows**
- [ ] Can create a workflow
- [ ] Can see **Settings** → **Email Services** → **LC Email**
- [ ] Can add a domain to LC Email
- [ ] Can see **Settings** → **Integrations** → **API**
- [ ] Can generate API key at Agency level

**If ALL boxes are checked** → Safe to proceed with Option 2 (migrate to agency, delete sub)

**If ANY box is NOT checked** → Use Option 1 (rename sub-account, keep everything)

---

## 🆘 Troubleshooting

### Issue: "I don't see Contacts/Opportunities at Agency level"

**Solution 1**: Enable "Agency as Location"
1. Settings → Company
2. Toggle "Use Agency as a Location"
3. Refresh page

**Solution 2**: Contact GHL Support
1. https://support.gohighlevel.com/
2. Ask to enable Agency-as-Location

**Solution 3**: Use Option 1 (Rename)
1. Keep sub-account as "ACT Hub"
2. Create 5 more sub-accounts
3. Total: 6 sub-accounts (not using agency for operations)

---

### Issue: "I can see CRM features but they're greyed out"

**Cause**: Permissions issue or plan limitation

**Solution**:
1. Check your GHL plan (Starter has limitations)
2. Make sure you're logged in as Admin
3. Contact GHL support if issue persists

---

### Issue: "My Agency account doesn't have a Location ID"

**Cause**: Agency account hasn't been converted to a location

**Solution**:
1. Settings → Business Profile
2. If you see "This is an agency account, not a location", you need to enable it
3. OR: Contact GHL support to convert agency to location

---

## 🎯 Next Steps

### Path A: If Agency-Level CRM Works

1. ✅ Test all features at Agency level (use checklist above)
2. ✅ Export contacts from sub-account
3. ✅ Export workflows to Snapshot
4. ✅ Document pipelines (screenshots)
5. ✅ Import contacts to Agency
6. ✅ Recreate pipelines at Agency
7. ✅ Import workflows at Agency
8. ✅ Test everything works
9. ✅ Delete sub-account
10. ✅ Create 5 new sub-accounts

**Follow**: [GHL_MIGRATION_DECISION_GUIDE.md](./GHL_MIGRATION_DECISION_GUIDE.md) → Option 2

---

### Path B: If Agency-Level CRM Does NOT Work

1. ✅ Rename sub-account from "A Curious Tractor" to "ACT Hub"
2. ✅ Create 5 new sub-accounts
3. ✅ Generate API keys for all 6 sub-accounts
4. ✅ Set up LC Email for all 6 domains

**Follow**: [GHL_MIGRATION_DECISION_GUIDE.md](./GHL_MIGRATION_DECISION_GUIDE.md) → Option 1

---

## 📚 Official Documentation

- [GoHighLevel Agency Sub-Account Guide](https://ghl-services-playbooks-automation-crm-marketing.ghost.io/highlevel-sub-account-guide-setup-transfer-optimization-for-agencies/)
- [How to Use GoHighLevel as a CRM](https://axiabits.com/how-to-use-gohighlevel-as-a-crm-in-2025/)
- [GoHighLevel CRM Features](https://www.gohighlevel.com/crm)

---

**Last Updated**: December 24, 2025
**Action**: Test Agency-level CRM features BEFORE deciding on migration path
