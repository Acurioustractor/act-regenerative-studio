## GoHighLevel Webhook Setup Guide

**Purpose**: Configure webhooks in all 6 GHL sub-accounts to trigger automatic contact syncing to Supabase + ACT Hub master database.

**Result**: When a contact is created/updated in ANY project, it automatically syncs to all other projects.

---

## Prerequisites

Before setting up webhooks, you need:

1. ✅ All 6 GHL sub-accounts created
2. ✅ Private Integration Tokens generated for each sub-account
3. ✅ Supabase project with contact sync schema deployed
4. ✅ Webhook endpoint deployed to production

---

## Step 1: Deploy Webhook Endpoint

### 1.1 Set Environment Variables

Add these to your `.env.local` (and Vercel/production):

```bash
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# ACT Hub (Master Sub-Account)
GHL_ACT_HUB_LOCATION_ID=location-id-from-ghl
GHL_ACT_HUB_API_KEY=your-private-integration-token

# The Harvest
GHL_HARVEST_LOCATION_ID=location-id-from-ghl
GHL_HARVEST_API_KEY=your-private-integration-token

# ACT Farm
GHL_FARM_LOCATION_ID=location-id-from-ghl
GHL_FARM_API_KEY=your-private-integration-token

# Empathy Ledger
GHL_LEDGER_LOCATION_ID=location-id-from-ghl
GHL_LEDGER_API_KEY=your-private-integration-token

# JusticeHub
GHL_JUSTICEHUB_LOCATION_ID=location-id-from-ghl
GHL_JUSTICEHUB_API_KEY=your-private-integration-token

# Goods on Country
GHL_GOODS_LOCATION_ID=location-id-from-ghl
GHL_GOODS_API_KEY=your-private-integration-token

# Webhook Security (IMPORTANT: Generate a strong secret)
GHL_WEBHOOK_SECRET=your-webhook-secret-key-here
```

### 1.2 Generate Webhook Secret

```bash
# Generate a strong random secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and use it as `GHL_WEBHOOK_SECRET`.

### 1.3 Deploy to Production

```bash
# Deploy to Vercel (or your hosting platform)
vercel --prod
```

**Your webhook URL will be**: `https://yourdomain.com/api/webhooks/ghl/contact-sync`

### 1.4 Test Webhook Endpoint

```bash
curl https://yourdomain.com/api/webhooks/ghl/contact-sync

# Should return:
# {"service":"GHL Contact Sync Webhook","status":"active","timestamp":"2025-12-24T..."}
```

---

## Step 2: Configure Webhooks in Each GHL Sub-Account

You need to configure webhooks in **5 sub-accounts** (NOT ACT Hub - that's the master):

1. ✅ The Harvest
2. ✅ ACT Farm
3. ✅ Empathy Ledger
4. ✅ JusticeHub
5. ✅ Goods on Country

**Do NOT configure webhook in ACT Hub** - it's the master sub-account that receives synced contacts.

---

### 2.1 Configure Webhook (Repeat for Each Sub-Account)

#### Step 1: Log into GHL Sub-Account

1. Log into your GHL Agency account
2. Click account switcher (top-right)
3. Select the sub-account (e.g., "The Harvest")

#### Step 2: Navigate to Webhooks Settings

1. Click **Settings** (left sidebar, gear icon)
2. Scroll down to **Webhooks** section
3. Click **"+ Add Webhook"** (or "+ Add New")

#### Step 3: Configure Webhook

Fill out the webhook form:

**1. Webhook Name**:
```
Contact Sync to ACT Hub
```

**2. Webhook URL**:
```
https://yourdomain.com/api/webhooks/ghl/contact-sync
```
*(Replace `yourdomain.com` with your actual domain)*

**3. Events to Subscribe**:

Check these boxes:
- ✅ **Contact Created**
- ✅ **Contact Updated**
- ✅ **Contact Deleted** (optional - for cleanup)

**Uncheck everything else** (we only need contact events)

**4. Webhook Secret** (if GHL provides this field):
```
your-webhook-secret-key-here
```
*(Same value as `GHL_WEBHOOK_SECRET` environment variable)*

**5. Status**:
- ✅ **Active**

#### Step 4: Save Webhook

1. Click **"Save"** or **"Create Webhook"**
2. GHL will send a test event to verify the endpoint
3. You should see a success message: ✅ "Webhook created successfully"

#### Step 5: Test Webhook

**Option A: Create Test Contact in GHL**

1. Go to **Contacts** (left sidebar)
2. Click **"+ Add Contact"**
3. Fill in:
   - **Email**: `test@example.com`
   - **Name**: `Test Contact`
4. Click **"Add Contact"**

**Option B: Update Existing Contact**

1. Go to **Contacts**
2. Select any contact
3. Click **"Edit"**
4. Add a tag: `webhook-test`
5. Click **"Save"**

**Verify Sync Worked**:

1. Check **ACT Hub sub-account** → Contacts
2. You should see the test contact appear within 5-10 seconds
3. Check custom field `active_projects` → should include this project
4. Check custom field `primary_project` → should be this project (if first contact)

#### Step 6: Check Supabase Logs

1. Log into Supabase Dashboard
2. Go to **Table Editor** → `ghl_contact_sync_events`
3. You should see a new row with:
   - `event_type`: `contact_create` or `contact_update`
   - `source_project`: The project you just tested
   - `processed`: `true`
   - `processing_error`: `null`

If `processed = false` or `processing_error` is not null, check the error message.

---

### 2.2 Webhook Configuration Checklist

**Complete this for EACH sub-account**:

| Sub-Account        | Webhook Created | Test Contact Synced | Supabase Event Logged | Notes |
|--------------------|-----------------|---------------------|-----------------------|-------|
| The Harvest        | ☐               | ☐                   | ☐                     |       |
| ACT Farm           | ☐               | ☐                   | ☐                     |       |
| Empathy Ledger     | ☐               | ☐                   | ☐                     |       |
| JusticeHub         | ☐               | ☐                   | ☐                     |       |
| Goods on Country   | ☐               | ☐                   | ☐                     |       |

---

## Step 3: Verify Cross-Account Syncing

### Test Scenario: Create Contact in The Harvest

1. **Create contact in The Harvest GHL**:
   - Email: `jane@example.com`
   - Name: `Jane Smith`
   - Tag: `harvest-volunteer`

2. **Check ACT Hub GHL** (within 10 seconds):
   - Contact `jane@example.com` should exist
   - Tags: `["harvest-volunteer", "The Harvest"]`
   - Custom Field `active_projects`: `["the-harvest"]`
   - Custom Field `primary_project`: `the-harvest`
   - Custom Field `total_interactions`: `1`
   - Custom Field `harvest_contact_id`: `<contact ID from The Harvest>`

3. **Create contact in ACT Farm GHL** with SAME email:
   - Email: `jane@example.com` (same person!)
   - Name: `Jane Smith`
   - Tag: `farm-residency`

4. **Check ACT Hub GHL again**:
   - Contact `jane@example.com` UPDATED (not duplicated!)
   - Tags: `["harvest-volunteer", "The Harvest", "farm-residency", "ACT Farm"]`
   - Custom Field `active_projects`: `["the-harvest", "act-farm"]`
   - Custom Field `primary_project`: `the-harvest` (unchanged - first project)
   - Custom Field `total_interactions`: `2` (incremented)
   - Custom Field `harvest_contact_id`: `<contact ID from The Harvest>`
   - Custom Field `farm_contact_id`: `<contact ID from ACT Farm>`

5. **Check Supabase**:
   - Table `ghl_contacts_master`: 1 row for `jane@example.com`
   - Table `ghl_contact_project_mappings`: 2 rows (one for harvest, one for farm)
   - Table `ghl_contact_sync_events`: 2 rows (one create event, one update event)

✅ **Success**: Jane exists in 3 places (Harvest GHL, Farm GHL, ACT Hub GHL) but is recognized as the SAME person across all projects.

---

## Step 4: Monitor Webhook Health

### 4.1 Check Webhook Delivery Logs in GHL

Each GHL sub-account has a webhook delivery log:

1. Go to **Settings** → **Webhooks**
2. Click on your webhook name
3. Click **"View Logs"** or **"Deliveries"** tab
4. You should see:
   - ✅ Status: `200 OK`
   - ✅ Response time: < 3 seconds
   - ❌ If you see `4xx` or `5xx` errors, check webhook endpoint logs

### 4.2 Check Supabase Event Logs

```sql
-- Recent events
SELECT * FROM ghl_contact_sync_events
ORDER BY received_at DESC
LIMIT 20;

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

### 4.3 Check Server Logs

If deployed to Vercel:

1. Go to Vercel Dashboard → Your Project
2. Click **"Logs"** tab
3. Filter by: `[GHL Webhook]`
4. Look for errors or warnings

---

## Step 5: Troubleshooting

### Issue: Webhook Returns 401 Unauthorized

**Cause**: Signature verification failed

**Fix**:
1. Verify `GHL_WEBHOOK_SECRET` is set correctly in environment variables
2. Check that GHL webhook secret matches
3. If no secret field in GHL, remove signature verification temporarily:
   ```typescript
   // In route.ts, comment out signature verification:
   // const isValid = verifyWebhookSignature(rawBody, signature, webhookSecret);
   ```

### Issue: Webhook Returns 500 Internal Server Error

**Cause**: Error in contact sync service

**Fix**:
1. Check Supabase connection (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`)
2. Check GHL API keys are correct
3. Review `ghl_contact_sync_events` table for `processing_error` messages
4. Check server logs for stack traces

### Issue: Contact Created But Not Syncing

**Cause**: Event not triggering webhook

**Fix**:
1. Verify webhook is **Active** in GHL settings
2. Verify **Contact Created** event is checked
3. Test webhook manually using GHL's "Test" button
4. Check if contact has an email (required for syncing)

### Issue: Duplicate Contacts in ACT Hub

**Cause**: Email deduplication not working

**Fix**:
1. Verify contacts in different sub-accounts use the SAME email (case-insensitive)
2. Check `ghl_contacts_master` table for duplicates:
   ```sql
   SELECT email, COUNT(*) FROM ghl_contacts_master GROUP BY email HAVING COUNT(*) > 1;
   ```
3. If duplicates exist, manually merge using GHL or delete and re-sync

### Issue: Webhook Timeouts

**Cause**: Sync taking too long (>10 seconds)

**Fix**:
1. Add Redis caching for GHL API calls to speed up lookups
2. Use background job queue (Inngest, BullMQ) for async processing
3. Increase Vercel function timeout (Pro plan: 60s, Hobby: 10s)

---

## Step 6: Advanced Configuration (Optional)

### 6.1 Retry Failed Events

Create a cron job to retry failed events:

```typescript
// src/app/api/cron/retry-failed-sync/route.ts
import { createContactSyncService } from '@/lib/ghl/contact-sync';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Get failed events with retry_count < 3
  const { data: failedEvents } = await supabase
    .from('ghl_contact_sync_events')
    .select('*')
    .eq('processed', false)
    .lt('retry_count', 3)
    .order('received_at', { ascending: true })
    .limit(10);

  const syncService = createContactSyncService();

  for (const event of failedEvents || []) {
    try {
      await syncService.processContactEvent({
        sourceProject: event.source_project,
        sourceLocationId: event.source_location_id,
        sourceContactId: event.source_contact_id,
        contact: event.event_payload,
        eventType: event.event_type.replace('contact_', ''),
        timestamp: event.event_timestamp,
      });
    } catch (error) {
      console.error('Retry failed:', error);
    }
  }

  return Response.json({ retried: failedEvents?.length || 0 });
}
```

Add to `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/retry-failed-sync",
      "schedule": "*/15 * * * *"
    }
  ]
}
```

### 6.2 Add Rate Limiting

Prevent webhook abuse:

```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 requests per minute
});

// In route.ts POST handler:
const identifier = request.headers.get('x-forwarded-for') || 'unknown';
const { success } = await ratelimit.limit(identifier);

if (!success) {
  return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
}
```

### 6.3 Add Idempotency

Prevent duplicate processing:

```typescript
// Store processed event IDs in Redis with 24hr TTL
const eventKey = `ghl:event:${syncEvent.sourceContactId}-${syncEvent.timestamp}`;
const redis = Redis.fromEnv();

const alreadyProcessed = await redis.get(eventKey);
if (alreadyProcessed) {
  return NextResponse.json({ message: 'Event already processed' }, { status: 200 });
}

// Process event...

// Mark as processed
await redis.set(eventKey, '1', { ex: 86400 }); // 24hr TTL
```

---

## Step 7: Monitoring Dashboard (Future)

Build an admin dashboard to monitor contact syncing:

**URL**: `http://localhost:3999/admin/ghl-sync`

**Features**:
- Real-time event log
- Failed events with retry button
- Contact sync stats (total contacts, multi-project contacts, etc.)
- Project health (last sync time, error rate)
- Search contacts across all projects
- Manual sync trigger

**Tech Stack**:
- Next.js page with Supabase real-time subscriptions
- Charts using Recharts or Chart.js
- Table using TanStack Table

---

## Summary

### What You've Accomplished

✅ **Unified Contact Database**: All contacts across 6 projects are now in one place (ACT Hub + Supabase)

✅ **Automatic Syncing**: No manual work - contacts sync in real-time via webhooks

✅ **Zero Ongoing Costs**: No GHL workflow execution fees ($0 vs $5-10/month)

✅ **Full Control**: Custom logic, error handling, retry, and audit trail

✅ **Queryable Data**: Use Supabase to build dashboards and reports

### What Happens When Someone Engages with Multiple Projects

**Example: Jane Smith**

1. Signs up for The Harvest newsletter
   → Contact created in The Harvest GHL
   → Webhook fires → Synced to ACT Hub + Supabase
   → `active_projects: ["the-harvest"]`

2. Books ACT Farm residency (same email!)
   → Contact created in ACT Farm GHL
   → Webhook fires → Updates ACT Hub + Supabase
   → `active_projects: ["the-harvest", "act-farm"]`

3. Submits Empathy Ledger story (same email!)
   → Contact created in Empathy Ledger GHL
   → Webhook fires → Updates ACT Hub + Supabase
   → `active_projects: ["the-harvest", "act-farm", "empathy-ledger"]`

**Result**: Jane has 1 unified record in ACT Hub showing all 3 projects she's engaged with.

### Next Steps

1. ☐ Run Supabase migration to create database schema
2. ☐ Deploy webhook endpoint to production
3. ☐ Configure webhooks in all 5 operational sub-accounts
4. ☐ Test with real contacts
5. ☐ Monitor for 1 week and fix any issues
6. ☐ Build admin dashboard (optional)

---

## Questions?

- **How do I see all contacts who engaged with multiple projects?**
  ```sql
  SELECT * FROM vw_multi_project_contacts;
  ```

- **How do I manually trigger a sync?**
  Create a test contact in any sub-account or use GHL's "Test Webhook" button

- **What if GHL is down?**
  Events are logged in Supabase - run manual retry after GHL is back up

- **Can I disable sync for a specific project?**
  Yes - set `sync_enabled = false` in `ghl_project_configs` table

- **How do I bulk sync existing contacts?**
  Export contacts from each GHL sub-account → Import via API using bulk create endpoint (see bulk sync guide)
