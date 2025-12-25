# GoHighLevel Implementation Checklist

**Goal**: Set up GoHighLevel CRM with automatic contact syncing across all 6 ACT projects using Supabase.

**Time Estimate**: 4-6 hours setup + 1 hour testing

---

## Phase 1: GHL Account Setup (1-2 hours)

### 1.1 Create GHL Sub-Accounts

- [ ] Create **ACT Hub** sub-account (master contact database)
- [ ] Create **The Harvest** sub-account
- [ ] Create **ACT Farm** sub-account
- [ ] Create **Empathy Ledger** sub-account
- [ ] Create **JusticeHub** sub-account
- [ ] Create **Goods on Country** sub-account

**Reference**: `GHL_SETUP_CHECKLIST.md` (existing)

### 1.2 Generate Private Integration Tokens

For EACH sub-account:

- [ ] ACT Hub: Generate Private Integration Token
- [ ] The Harvest: Generate Private Integration Token
- [ ] ACT Farm: Generate Private Integration Token
- [ ] Empathy Ledger: Generate Private Integration Token
- [ ] JusticeHub: Generate Private Integration Token
- [ ] Goods on Country: Generate Private Integration Token

**How**:
1. Log into sub-account
2. Go to Settings → Private Integrations
3. Click "Create Integration"
4. Name: "ACT Ecosystem API"
5. Scopes: Select ALL (contacts, calendars, workflows, etc.)
6. Click "Create"
7. Copy the token (save immediately - can't view again!)

### 1.3 Get Location IDs

For EACH sub-account:

- [ ] ACT Hub: Copy Location ID
- [ ] The Harvest: Copy Location ID
- [ ] ACT Farm: Copy Location ID
- [ ] Empathy Ledger: Copy Location ID
- [ ] JusticeHub: Copy Location ID
- [ ] Goods on Country: Copy Location ID

**How**:
1. Log into sub-account
2. Look at browser URL: `app.gohighlevel.com/location/LOCATION_ID_HERE/dashboard`
3. Copy `LOCATION_ID_HERE` value

---

## Phase 2: LC Email Setup (2-3 hours)

### 2.1 Add Domains to GHL LC Email

For EACH sub-account (except ACT Hub - use existing domain):

- [ ] The Harvest: Add `theharvest.org.au` to LC Email
- [ ] ACT Farm: Add `actfarm.org.au` to LC Email
- [ ] Empathy Ledger: Add `empathyledger.com` to LC Email
- [ ] JusticeHub: Add `justicehub.org.au` to LC Email
- [ ] Goods on Country: Add `goodsoncountry.com` to LC Email

**Reference**: `GHL_LC_EMAIL_SETUP.md`

### 2.2 Add DNS Records

For EACH domain, add these DNS records:

**SPF** (TXT record):
```
Host: @
Value: v=spf1 include:_spf.leadconnector.io ~all
```

**DKIM** (CNAME record):
```
Host: lc1._domainkey
Value: lc1._domainkey.leadconnector.io
```

**DMARC** (TXT record):
```
Host: _dmarc
Value: v=DMARC1; p=none; rua=mailto:postmaster@yourdomain.com
```

**MX Records**:
```
Priority 10: mx1.leadconnector.io
Priority 20: mx2.leadconnector.io
```

- [ ] The Harvest: DNS records added & verified
- [ ] ACT Farm: DNS records added & verified
- [ ] Empathy Ledger: DNS records added & verified
- [ ] JusticeHub: DNS records added & verified
- [ ] Goods on Country: DNS records added & verified

### 2.3 Verify Domains in GHL

For EACH sub-account:

- [ ] The Harvest: Domain verified ✅
- [ ] ACT Farm: Domain verified ✅
- [ ] Empathy Ledger: Domain verified ✅
- [ ] JusticeHub: Domain verified ✅
- [ ] Goods on Country: Domain verified ✅

---

## Phase 3: Supabase Database Setup (30 minutes)

### 3.1 Run Supabase Migration

- [ ] Copy migration file to Supabase project:
  ```bash
  # From: /Users/benknight/Code/ACT Farm and Regenerative Innovation Studio/supabase/migrations/20251224_ghl_contact_sync.sql
  ```

- [ ] Run migration in Supabase SQL Editor:
  1. Log into Supabase Dashboard
  2. Go to SQL Editor
  3. Paste entire migration file
  4. Click "Run"
  5. Verify no errors

- [ ] Verify tables created:
  - [ ] `ghl_contacts_master`
  - [ ] `ghl_contact_project_mappings`
  - [ ] `ghl_contact_sync_events`
  - [ ] `ghl_project_configs`

### 3.2 Populate Project Configs

Run this SQL in Supabase SQL Editor (replace with your actual values):

```sql
INSERT INTO ghl_project_configs (project, location_id, api_key, project_name, project_domain, sync_enabled)
VALUES
  ('act-hub', 'YOUR_ACT_HUB_LOCATION_ID', 'YOUR_ACT_HUB_API_KEY', 'ACT Hub', 'act.place', true),
  ('the-harvest', 'YOUR_HARVEST_LOCATION_ID', 'YOUR_HARVEST_API_KEY', 'The Harvest', 'theharvest.org.au', true),
  ('act-farm', 'YOUR_FARM_LOCATION_ID', 'YOUR_FARM_API_KEY', 'ACT Farm', 'actfarm.org.au', true),
  ('empathy-ledger', 'YOUR_LEDGER_LOCATION_ID', 'YOUR_LEDGER_API_KEY', 'Empathy Ledger', 'empathyledger.com', true),
  ('justice-hub', 'YOUR_JUSTICEHUB_LOCATION_ID', 'YOUR_JUSTICEHUB_API_KEY', 'JusticeHub', 'justicehub.org.au', true),
  ('goods-on-country', 'YOUR_GOODS_LOCATION_ID', 'YOUR_GOODS_API_KEY', 'Goods on Country', 'goodsoncountry.com', true);
```

- [ ] Project configs populated

---

## Phase 4: Environment Variables (15 minutes)

### 4.1 Generate Webhook Secret

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

- [ ] Webhook secret generated

### 4.2 Update .env.local

Copy `.env.example` to `.env.local` and fill in ALL values:

- [ ] `SUPABASE_URL`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `GHL_ACT_HUB_LOCATION_ID`
- [ ] `GHL_ACT_HUB_API_KEY`
- [ ] `GHL_HARVEST_LOCATION_ID`
- [ ] `GHL_HARVEST_API_KEY`
- [ ] `GHL_FARM_LOCATION_ID`
- [ ] `GHL_FARM_API_KEY`
- [ ] `GHL_LEDGER_LOCATION_ID`
- [ ] `GHL_LEDGER_API_KEY`
- [ ] `GHL_JUSTICEHUB_LOCATION_ID`
- [ ] `GHL_JUSTICEHUB_API_KEY`
- [ ] `GHL_GOODS_LOCATION_ID`
- [ ] `GHL_GOODS_API_KEY`
- [ ] `GHL_WEBHOOK_SECRET`

### 4.3 Update Vercel Environment Variables

Add same variables to Vercel production:

1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. Add ALL GHL variables from `.env.local`
3. Save

- [ ] Vercel environment variables configured

---

## Phase 5: Deploy Webhook Endpoint (30 minutes)

### 5.1 Install Dependencies

```bash
cd "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio"
npm install @supabase/supabase-js
```

- [ ] Dependencies installed

### 5.2 Deploy to Production

```bash
vercel --prod
```

- [ ] Webhook endpoint deployed
- [ ] Deployment URL: `https://_____________________.vercel.app`

### 5.3 Test Webhook Endpoint

```bash
curl https://your-domain.com/api/webhooks/ghl/contact-sync

# Expected response:
# {"service":"GHL Contact Sync Webhook","status":"active","timestamp":"..."}
```

- [ ] Webhook endpoint responding

---

## Phase 6: Configure GHL Webhooks (1 hour)

For EACH operational sub-account (NOT ACT Hub):

### The Harvest

- [ ] Go to Settings → Webhooks
- [ ] Click "+ Add Webhook"
- [ ] Name: `Contact Sync to ACT Hub`
- [ ] URL: `https://your-domain.com/api/webhooks/ghl/contact-sync`
- [ ] Events: Check "Contact Created", "Contact Updated", "Contact Deleted"
- [ ] Secret: Paste `GHL_WEBHOOK_SECRET` value
- [ ] Status: Active
- [ ] Save
- [ ] Test webhook (click "Test" button)

### ACT Farm

- [ ] Webhook configured
- [ ] Webhook tested

### Empathy Ledger

- [ ] Webhook configured
- [ ] Webhook tested

### JusticeHub

- [ ] Webhook configured
- [ ] Webhook tested

### Goods on Country

- [ ] Webhook configured
- [ ] Webhook tested

**Reference**: `GHL_WEBHOOK_SETUP_GUIDE.md`

---

## Phase 7: Testing (30 minutes)

### 7.1 Test Single-Project Contact

**Create test contact in The Harvest**:

- [ ] Go to The Harvest sub-account → Contacts
- [ ] Click "+ Add Contact"
- [ ] Email: `test-single@example.com`
- [ ] Name: `Test Single`
- [ ] Tag: `harvest-volunteer`
- [ ] Save

**Verify in ACT Hub** (within 10 seconds):

- [ ] Contact exists: `test-single@example.com`
- [ ] Tags include: `The Harvest`
- [ ] Custom field `active_projects`: `["the-harvest"]`
- [ ] Custom field `primary_project`: `the-harvest`
- [ ] Custom field `total_interactions`: `1`

**Verify in Supabase**:

- [ ] Table `ghl_contacts_master`: 1 row for `test-single@example.com`
- [ ] Table `ghl_contact_project_mappings`: 1 row (project: `the-harvest`)
- [ ] Table `ghl_contact_sync_events`: 1 row (processed: `true`)

### 7.2 Test Multi-Project Contact

**Create same contact in ACT Farm**:

- [ ] Go to ACT Farm sub-account → Contacts
- [ ] Click "+ Add Contact"
- [ ] Email: `test-multi@example.com` (SAME EMAIL)
- [ ] Name: `Test Multi`
- [ ] Tag: `farm-residency`
- [ ] Save

**Verify in ACT Hub** (within 10 seconds):

- [ ] Contact UPDATED (not duplicated!)
- [ ] Tags include: `The Harvest`, `ACT Farm`
- [ ] Custom field `active_projects`: `["the-harvest", "act-farm"]`
- [ ] Custom field `primary_project`: `the-harvest` (unchanged)
- [ ] Custom field `total_interactions`: `2` (incremented)

**Verify in Supabase**:

- [ ] Table `ghl_contacts_master`: Still 1 row (not duplicated!)
- [ ] Table `ghl_contact_project_mappings`: 2 rows (harvest + farm)
- [ ] Table `ghl_contact_sync_events`: 2 rows

### 7.3 Test Real Contact

**Create a real contact in one of your production sub-accounts**:

- [ ] Contact created
- [ ] Synced to ACT Hub ✅
- [ ] Logged in Supabase ✅

---

## Phase 8: Monitor (Ongoing)

### 8.1 Check Webhook Delivery Logs

For EACH sub-account:

- [ ] The Harvest: Go to Settings → Webhooks → View Logs → Verify 200 OK
- [ ] ACT Farm: Webhook logs showing 200 OK
- [ ] Empathy Ledger: Webhook logs showing 200 OK
- [ ] JusticeHub: Webhook logs showing 200 OK
- [ ] Goods on Country: Webhook logs showing 200 OK

### 8.2 Check Supabase Event Logs

```sql
-- Recent events
SELECT * FROM ghl_contact_sync_events ORDER BY received_at DESC LIMIT 20;

-- Failed events
SELECT * FROM vw_recent_sync_errors;

-- Event counts by project
SELECT
  source_project,
  COUNT(*) as total_events,
  SUM(CASE WHEN processed = true THEN 1 ELSE 0 END) as successful,
  SUM(CASE WHEN processed = false THEN 1 ELSE 0 END) as failed
FROM ghl_contact_sync_events
GROUP BY source_project;
```

- [ ] All events processing successfully (processed = true)

### 8.3 Check Multi-Project Contacts

```sql
-- How many contacts are in multiple projects?
SELECT * FROM vw_multi_project_contacts;
```

- [ ] Query returns results

---

## Troubleshooting

### Issue: Webhook returns 401 Unauthorized

**Fix**:
- Verify `GHL_WEBHOOK_SECRET` matches in:
  - `.env.local`
  - Vercel environment variables
  - GHL webhook configuration

### Issue: Webhook returns 500 Internal Server Error

**Fix**:
- Check Vercel logs: Vercel Dashboard → Logs → Filter by "[GHL Webhook]"
- Check Supabase logs: `SELECT * FROM vw_recent_sync_errors`
- Verify all environment variables are set correctly

### Issue: Contact not syncing

**Fix**:
- Verify contact has an email (required for syncing)
- Check webhook is Active in GHL
- Check webhook events include "Contact Created" or "Contact Updated"
- Test webhook manually using GHL's "Test" button

### Issue: Duplicate contacts in ACT Hub

**Fix**:
- Verify contacts use the SAME email (case-insensitive)
- Check Supabase: `SELECT email, COUNT(*) FROM ghl_contacts_master GROUP BY email HAVING COUNT(*) > 1`
- Manually delete duplicates in GHL or Supabase

---

## Success Criteria

✅ All 6 GHL sub-accounts created with LC Email configured

✅ Webhooks configured in 5 operational sub-accounts (not ACT Hub)

✅ Test contacts sync from any sub-account to ACT Hub within 10 seconds

✅ Multi-project contacts are recognized as the same person (no duplicates)

✅ Supabase event logs show 100% success rate (processed = true)

✅ Zero ongoing costs (no GHL workflow execution fees)

---

## Next Steps After Setup

1. **Integrate forms**: Update website contact forms to use GHL API (see plan file)
2. **Build booking systems**: Add calendar integration for residencies/workshops
3. **Create pipelines**: Set up lead nurturing workflows in each sub-account
4. **Build dashboard**: Monitor contact syncing and engagement across projects
5. **Bulk import**: Import existing contacts from spreadsheets/other CRMs

---

## Time Saved

**Without this system**:
- Manual contact entry across 6 sub-accounts: ~5 min/contact
- 100 contacts/month × 6 projects = 600 manual entries = **50 hours/month**

**With this system**:
- Automatic syncing: **0 hours/month**
- Cost: **$0/month** (vs $5-10/month for GHL workflow executions)

**ROI**: This 6-hour setup saves **50 hours every month** 🎉

---

## Questions?

Contact sync service location:
- Code: `/src/lib/ghl/contact-sync.ts`
- Webhook: `/src/app/api/webhooks/ghl/contact-sync/route.ts`
- Database: Supabase → `ghl_contacts_master` table

Full guides:
- `GHL_SETUP_CHECKLIST.md` - GHL account setup
- `GHL_LC_EMAIL_SETUP.md` - Email configuration
- `GHL_WEBHOOK_SETUP_GUIDE.md` - Webhook configuration
- `GHL_CROSS_ACCOUNT_CONTACT_STRATEGY.md` - Architecture overview
