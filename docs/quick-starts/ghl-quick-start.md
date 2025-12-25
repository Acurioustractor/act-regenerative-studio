# Quick Start - GHL Integration

## 🚀 Get The Harvest Running with GHL in 30 Minutes

### Prerequisites
- GoHighLevel account with agency access
- Terminal access to your Mac
- Code editor (VSCode recommended)

---

## Step 1: Create GHL Sub-Account (5 minutes)

1. Log into https://app.gohighlevel.com/
2. Click **Settings** → **Sub-Accounts**
3. Click **Create Sub-Account**
4. Fill in:
   - **Name**: The Harvest
   - **Business Name**: The Harvest Community Hub
   - **Category**: Non-profit
   - **Timezone**: Australia/Brisbane
   - **Currency**: AUD
5. Click **Create**
6. Open the new sub-account
7. Go to **Settings** → **Business Profile**
8. **Copy the Location ID** (looks like `loc_xxxxxxxxxxxx`)
9. Save it somewhere - you'll need it in Step 3

---

## Step 2: Generate API Token (5 minutes)

1. **While still in the sub-account**, go to:
   - **Settings** → **Integrations** → **Private Integrations**
2. Click **Create new Integration**
3. Fill in:
   - **Name**: The Harvest Website Integration
   - **Description**: API access for contact forms and bookings
4. **Select these scopes** (check all):
   - `contacts.readonly`
   - `contacts.write`
   - `conversations.readonly`
   - `conversations.write`
   - `workflows.readonly`
   - `workflows.write`
   - `opportunities.readonly`
   - `opportunities.write`
   - `locations/tags.readonly`
   - `locations/customFields.readonly`
5. Click **Create**
6. **IMMEDIATELY COPY THE TOKEN** (you won't see it again!)
   - Looks like: `sk-live_xxxxxxxxxxxxxxxxxxxxxxxxxxxx`
7. Save it in password manager or secure note

---

## Step 3: Configure Environment Variables (3 minutes)

```bash
# Navigate to The Harvest directory
cd "/Users/benknight/Code/The Harvest"

# Copy example environment file
cp .env.local.example .env.local

# Open in editor
code .env.local
# (or use nano, vim, etc.)
```

Update these lines with YOUR values:
```bash
# Replace these:
GHL_API_KEY=sk-live_paste_your_token_from_step_2_here
GHL_LOCATION_ID=loc_paste_your_location_id_from_step_1_here

# Keep these as-is:
GHL_API_VERSION=2021-07-28
REDIS_URL=redis://192.168.0.34:6379
CHROMADB_URL=http://192.168.0.34:8000

# Leave these empty for now (we'll configure later):
GHL_ENABLE_PIPELINES=false
GHL_VOLUNTEER_PIPELINE_ID=
GHL_EVENT_BOOKING_PIPELINE_ID=
GHL_CONTACT_WORKFLOW_ID=
```

**Save and close the file.**

---

## Step 4: Install Dependencies (2 minutes)

```bash
# Still in The Harvest directory
npm install
```

This installs `ioredis` for Redis caching.

---

## Step 5: Start Dev Server (1 minute)

```bash
npm run dev
```

Wait for:
```
✓ Ready in 2.5s
○ Local:    http://localhost:3004
```

**Leave this terminal running.**

---

## Step 6: Test the Integration (5 minutes)

Open a **new terminal** and run:

```bash
cd "/Users/benknight/Code/The Harvest"
node scripts/test-ghl-integration.mjs
```

You should see:
```
🧪 The Harvest GHL Integration Test

═══════════════════════════════════════

1️⃣  Checking environment variables...

   ✅ GHL_API_KEY - sk-live_a1b2...xyz9
   ✅ GHL_LOCATION_ID - loc_abc123xyz
   ✅ GHL_API_VERSION - 2021-07-28
   ✅ REDIS_URL - redis://192.168.0.34:6379

2️⃣  Testing API endpoint...

   Submitting test contact: test-1234567890@example.com

   ✅ Contact created successfully!
   📋 Contact ID: con_abc123xyz

3️⃣  Testing caching...

   ✅ Contact updated successfully (cache working)
   📋 Contact ID: con_abc123xyz

═══════════════════════════════════════
✅ All tests completed!
```

---

## Step 7: Verify in GHL (2 minutes)

1. Go back to https://app.gohighlevel.com/
2. Switch to "The Harvest" sub-account (top-right dropdown)
3. Click **Contacts** in left sidebar
4. Search for the test email (e.g., `test-1234567890@example.com`)
5. Click the contact to open details

**You should see**:
- ✅ Name: "Test User"
- ✅ Email: test-xxx@example.com
- ✅ Source: "The Harvest Website"
- ✅ Tags: `the-harvest`, `interest:volunteering`
- ✅ Custom Fields: `interest_area`, `initial_message`, `submission_date`

**If you see all this → Success! 🎉**

---

## Step 8: Test the Live Form (2 minutes)

1. Open http://localhost:3004 in your browser
2. Scroll down to "Connect With Us" form
3. Fill in:
   - Your Name: "Real Test"
   - Email: your-real-email@example.com
   - Interest: "Partnership Opportunities"
   - Message: "Testing the live form!"
4. Click **Send Message**
5. You should see: "Thank you for your message! We'll be in touch soon."

**Verify in GHL**:
- Go to Contacts
- Search for your email
- Should see new contact with "interest:partnership opportunities" tag

---

## Troubleshooting

### "GHL API Error: Unauthorized"
- Check token copied correctly (no extra spaces)
- Verify Location ID is from the correct sub-account
- Regenerate token if unsure

### "ECONNREFUSED"
- Dev server not running
- Start it: `npm run dev` in The Harvest directory
- Wait for "Ready" message

### "Redis connection failed"
- Check NAS is running
- Open http://192.168.0.34:9000 (Portainer)
- Start Redis container if stopped
- Integration will still work, just slower

### Test script says env vars missing
- Make sure `.env.local` exists (not `.env.local.example`)
- Check file is in `/Users/benknight/Code/The Harvest/` directory
- Verify no typos in env var names

---

## Next Steps (Optional, ~15 minutes)

### Create Pipelines

1. In GHL, go to **Opportunities** → **Pipelines**
2. Click **Create Pipeline**
3. Name: "Volunteer Engagement"
4. Add stages:
   - Initial Inquiry
   - Information Sent
   - Orientation Scheduled
   - Active Volunteer
5. Click **Save**
6. Copy Pipeline ID (in settings)
7. Add to `.env.local`:
   ```bash
   GHL_VOLUNTEER_PIPELINE_ID=pip_xxxxxxxxxxxx
   GHL_ENABLE_PIPELINES=true
   ```
8. Restart dev server
9. Submit test form again
10. Check contact is in pipeline!

### Create Welcome Workflow

1. Go to **Automation** → **Workflows**
2. Click **Create Workflow**
3. Name: "Contact Form - Thank You"
4. Trigger: "Contact Created" with tag "the-harvest"
5. Add actions:
   - **Wait** 5 minutes
   - **Send Email** - Create branded thank you email
   - **Wait** 2 days
   - **Send Email** - Follow-up with resources
6. Click **Publish**
7. Copy Workflow ID
8. Add to `.env.local`:
   ```bash
   GHL_CONTACT_WORKFLOW_ID=wkf_xxxxxxxxxxxx
   ```
9. Submit test form
10. Check email arrives!

---

## Ready for Production? ✅

Once everything works locally:

1. **Deploy to Vercel**:
   - Go to https://vercel.com/dashboard
   - Select The Harvest project
   - Settings → Environment Variables
   - Add all `GHL_*` and `REDIS_URL` variables
   - Deploy

2. **Test production**:
   - Visit your live site (e.g., theharvestwitta.com.au)
   - Submit form
   - Verify contact created in GHL

3. **Monitor**:
   - Check GHL dashboard daily
   - Respond to inquiries within 24 hours
   - Review pipeline progression weekly

---

## Summary

**What You Just Did**:
✅ Created GHL sub-account for The Harvest
✅ Generated API credentials
✅ Configured environment variables
✅ Installed dependencies
✅ Tested integration successfully
✅ Verified contact creation in GHL
✅ Tested live form submission

**What Happens Now**:
- Form submissions create contacts in GHL automatically
- Contacts tagged by interest area
- Messages stored in custom fields
- Ready for pipeline assignment
- Ready for workflow automation

**Next Projects**:
- ACT Farm (residency booking + forms)
- Empathy Ledger (organization inquiries)
- JusticeHub (service provider + booking)

---

## Support

- **Main Guide**: [GHL_SETUP_GUIDE.md](GHL_SETUP_GUIDE.md)
- **The Harvest Docs**: [The Harvest/GHL_INTEGRATION_SETUP.md](../The%20Harvest/GHL_INTEGRATION_SETUP.md)
- **Progress Report**: [GHL_INTEGRATION_PROGRESS.md](GHL_INTEGRATION_PROGRESS.md)
- **GHL Documentation**: https://marketplace.gohighlevel.com/docs

**Total Time**: ~30 minutes
**Status**: ✅ Production Ready (once tested!)
