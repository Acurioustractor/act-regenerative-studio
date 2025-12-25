# GoHighLevel Setup Guide for ACT Projects

## 🎯 Overview

This guide walks you through setting up GoHighLevel integration for all 4 ACT websites using **Private Integration Tokens** (recommended for your use case).

---

## Step 1: Set Up GHL Sub-Accounts (15 minutes)

### What You Need

In your GoHighLevel account, you'll need **4 separate sub-accounts** (one per website):

1. **The Harvest** - Community hub & events
2. **ACT Farm** - Residencies & tourism
3. **Empathy Ledger** - Storyteller platform
4. **JusticeHub** - Service finder

### How to Create Sub-Accounts

1. Login to your GHL Agency account
2. Navigate to **Settings** → **Sub-Accounts**
3. Click **Create Sub-Account**
4. For each project, create a sub-account with:
   - **Name**: `The Harvest`, `ACT Farm`, etc.
   - **Business Name**: Same as project name
   - **Business Category**: Choose appropriate (Non-profit, Tourism, Healthcare, etc.)
   - **Timezone**: Australia/Brisbane
   - **Currency**: AUD

5. After creating each sub-account, **note down the Location ID**:
   - Click into the sub-account
   - Go to Settings → Business Profile
   - Copy the **Location ID** (looks like: `loc_xxxxxxxxxxxx`)

---

## Step 2: Generate Private Integration Tokens (10 minutes per sub-account)

For **each sub-account**, generate a Private Integration Token:

### Steps:

1. **Switch to the sub-account** (use sub-account switcher in top-right)

2. **Navigate to**: Settings → Integrations → Private Integrations

3. **Click**: "Create new Integration"

4. **Fill in details**:
   - **Name**: `Website Integration` or `ACT Farm Website`
   - **Description**: `API access for [website name] contact forms and bookings`

5. **Select Scopes** (permissions):

   ✅ **Required for all projects**:
   - `contacts.readonly` - Read contacts
   - `contacts.write` - Create/update contacts
   - `conversations.readonly` - Read messages
   - `conversations.write` - Send messages/emails
   - `workflows.readonly` - Read workflows
   - `workflows.write` - Trigger workflows

   ✅ **Required for booking sites** (ACT Farm, The Harvest, JusticeHub):
   - `calendars/events.readonly` - Read calendars
   - `calendars/events.write` - Create appointments
   - `calendars.readonly` - Read calendar settings

   ✅ **Required for pipeline management** (all):
   - `opportunities.readonly` - Read opportunities/leads
   - `opportunities.write` - Create/update opportunities

   ✅ **Optional but recommended**:
   - `locations/customFields.readonly` - Read custom fields
   - `locations/tags.readonly` - Read tags
   - `users.readonly` - Read users (for assignment)

6. **Click**: "Create"

7. **IMPORTANT**: Copy the token immediately! You won't see it again.
   ```
   Token format: sk-live_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

8. **Store securely**: Save in password manager or secure notes

---

## Step 3: Configure Environment Variables (5 minutes per project)

For each project, add GHL credentials to `.env.local`:

### The Harvest

File: `/Users/benknight/Code/The Harvest/.env.local`

```bash
# GoHighLevel Integration
GHL_API_KEY=sk-live_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
GHL_LOCATION_ID=loc_xxxxxxxxxxxx
GHL_API_VERSION=2021-07-28

# Optional: Pipeline/Workflow IDs (set these after creating pipelines)
GHL_VOLUNTEER_PIPELINE_ID=
GHL_EVENT_BOOKING_PIPELINE_ID=
GHL_CONTACT_WORKFLOW_ID=
```

### ACT Farm

File: `/Users/benknight/Code/ACT Farm/act-farm/.env.local`

```bash
# GoHighLevel Integration
GHL_API_KEY=sk-live_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
GHL_LOCATION_ID=loc_xxxxxxxxxxxx
GHL_API_VERSION=2021-07-28

# Calendar IDs (set these after creating calendars in GHL)
GHL_RESIDENCY_CALENDAR_ID=
GHL_WORKSHOP_CALENDAR_ID=
GHL_JUNES_PATCH_CALENDAR_ID=

# Pipeline IDs
GHL_RESIDENCY_PIPELINE_ID=
GHL_INQUIRY_PIPELINE_ID=
```

### Empathy Ledger

File: `/Users/benknight/Code/Empathy Ledger v.02/.env.local`

```bash
# GoHighLevel Integration
GHL_API_KEY=sk-live_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
GHL_LOCATION_ID=loc_xxxxxxxxxxxx
GHL_API_VERSION=2021-07-28

# Pipeline IDs
GHL_STORYTELLER_PIPELINE_ID=
GHL_ORGANIZATION_PIPELINE_ID=
GHL_PARTNERSHIP_PIPELINE_ID=
```

### JusticeHub

File: `/Users/benknight/Code/JusticeHub/.env.local`

```bash
# GoHighLevel Integration
GHL_API_KEY=sk-live_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
GHL_LOCATION_ID=loc_xxxxxxxxxxxx
GHL_API_VERSION=2021-07-28

# Calendar IDs
GHL_CONTAINED_BOOKING_CALENDAR_ID=

# Pipeline IDs
GHL_FAMILY_INQUIRY_PIPELINE_ID=
GHL_SERVICE_PROVIDER_PIPELINE_ID=
GHL_CAMPAIGN_NOMINATION_PIPELINE_ID=
```

---

## Step 4: Create Pipelines in GHL (10 minutes per sub-account)

Pipelines track leads through your sales/engagement process.

### For The Harvest Sub-Account

1. Navigate to: **Opportunities** → **Pipelines**
2. Click: **Create Pipeline**
3. **Pipeline Name**: "Volunteer Pipeline"
4. **Create Stages**:
   - Initial Inquiry
   - Information Sent
   - Orientation Scheduled
   - Active Volunteer
   - Inactive

5. **Repeat** for:
   - "Event Booking Pipeline" (Interested → Registered → Attended → Repeat Attendee)
   - "Partnership Pipeline" (Inquiry → Discovery Call → Proposal → Active Partner)

6. **Copy Pipeline IDs**: Click pipeline → Settings → Copy ID

### For ACT Farm Sub-Account

Create pipelines:
- **Residency Pipeline**: Inquiry → Application → Approved → Booked → Attended → Alumni
- **General Inquiry Pipeline**: Contact → Follow-up → Qualified → Converted
- **June's Patch Pipeline**: Referral → Assessment → Active Client → Completed

### For Empathy Ledger Sub-Account

Create pipelines:
- **Storyteller Pipeline**: Application → Review → Onboarding → Active → Published
- **Organization Pipeline**: Inquiry → Demo → Proposal → Contract → Active
- **Research Partnership**: Contact → Discussion → Agreement → Active

### For JusticeHub Sub-Account

Create pipelines:
- **Family Support Pipeline**: Inquiry → Needs Assessment → Service Connected → Follow-up → Success
- **Service Provider Pipeline**: Application → Verification → Listed → Active → Renewal
- **Campaign Pipeline**: Nominated → Contacted → Engaged → Ambassador

---

## Step 5: Create Calendars in GHL (15 minutes per calendar)

For booking systems, set up calendars:

### ACT Farm - Residency Booking Calendar

1. Navigate to: **Calendars** → **Create Calendar**
2. **Calendar Type**: Service Booking
3. **Basic Info**:
   - Name: "R&D Residency Booking"
   - Description: "Book your research and development residency at Black Cockatoo Valley"
   - Slug: `residency-booking` (for URL)
4. **Availability**:
   - Days: Mon-Sun
   - Hours: Flexible (overnight stays)
   - Slot Duration: Custom (multi-day bookings)
   - Slots per day: 2 (max 2 residencies at once)
5. **Notifications**:
   - Email confirmation to guest
   - Email notification to admin
   - SMS reminder 24h before
6. **Copy Calendar ID** from settings

### The Harvest - Event Booking Calendar

1. **Calendar Type**: Event
2. **Basic Info**:
   - Name: "Community Event Booking"
   - Description: "Register for workshops, tours, and community events"
3. **Availability**:
   - Days: Sat-Sun primarily
   - Hours: 9 AM - 5 PM
   - Slot Duration: Varies by event
   - Appointments per slot: Unlimited (group events)
4. **Notifications**: Email + SMS confirmations

### JusticeHub - CONTAINED Campaign Booking

1. **Calendar Type**: Class Booking
2. **Basic Info**:
   - Name: "CONTAINED Experience Booking"
   - Description: "Book your immersive justice transformation experience"
3. **Availability**:
   - Days: Mon-Fri
   - Hours: 9 AM - 5 PM
   - Slot Duration: 90 minutes
   - Appointments per slot: 5 (max group size)
   - Appointments per day: 24 slots total
4. **Payments**: Optional contribution ($0-$50)

---

## Step 6: Create Email/SMS Workflows (10 minutes per workflow)

Automate communications when contacts are created or appointments booked.

### Example: The Harvest Contact Form Workflow

1. Navigate to: **Automation** → **Workflows** → **Create Workflow**
2. **Trigger**: Contact Created with Tag "website-inquiry"
3. **Actions**:
   - **Wait**: 5 minutes
   - **Send Email**:
     - Template: "Thank You for Contacting The Harvest"
     - Subject: "We received your inquiry about The Harvest"
     - Body: Personalized thank you + what to expect next
   - **Wait**: 2 days
   - **Send Follow-up Email**:
     - Check if they replied
     - Send additional resources
   - **Create Task**: Assign to staff member to respond
   - **Add to Pipeline**: Move to "Information Sent" stage

4. **Copy Workflow ID** for triggering from API

### Example: ACT Farm Residency Booking Workflow

1. **Trigger**: Appointment Created on Residency Calendar
2. **Actions**:
   - **Send Confirmation Email**: Booking details, what to bring, directions
   - **Send SMS**: Simple confirmation with dates
   - **Wait**: 1 week before arrival
   - **Send Reminder Email**: Pre-arrival checklist
   - **Wait**: 1 day before
   - **Send SMS Reminder**: Final reminder with contact info
   - **Wait**: 1 day after checkout
   - **Send Follow-up Email**: Thank you + feedback request
   - **Add Tag**: "residency-alumni"
   - **Update Pipeline**: Move to "Alumni" stage

---

## Step 7: Test the Integration (30 minutes)

Before going live, test everything:

### Test Contact Creation

```bash
# Use the test script we'll create
cd "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio"
node scripts/test-ghl-contact.mjs
```

Should:
1. Create contact in GHL sub-account
2. Apply correct tags
3. Trigger workflow
4. Send confirmation email

### Test Booking Creation

```bash
node scripts/test-ghl-booking.mjs
```

Should:
1. Check calendar availability
2. Create appointment
3. Link to contact
4. Send confirmation emails/SMS
5. Add to pipeline

### Test Webhook Reception

```bash
# Start webhook test server
node scripts/test-ghl-webhooks.mjs

# Then in GHL:
# Settings → Integrations → Webhooks → Create Webhook
# URL: https://your-dev-url.ngrok.io/api/webhooks/ghl
# Select events: Contact Created, Appointment Created
# Send test event
```

---

## Step 8: Security Best Practices

### Token Storage
- ✅ Store tokens in `.env.local` (git-ignored)
- ✅ Never commit tokens to git
- ✅ Use Vercel environment variables for production
- ✅ Rotate tokens every 90 days (set calendar reminder)

### API Usage
- ✅ Implement rate limiting (GHL has limits per endpoint)
- ✅ Use Redis caching to reduce API calls
- ✅ Implement retry logic with exponential backoff
- ✅ Log all API errors for debugging

### Webhooks
- ✅ Verify webhook signatures (if GHL provides them)
- ✅ Validate payload structure
- ✅ Implement idempotency (handle duplicate webhooks)
- ✅ Return 200 OK quickly, process async

---

## Step 9: Go Live Checklist

For each project before launch:

### Technical
- [ ] Environment variables set in Vercel
- [ ] API client tested and working
- [ ] Forms submit successfully
- [ ] Contacts created in correct sub-account
- [ ] Tags applied correctly
- [ ] Workflows triggering
- [ ] Emails/SMS sending
- [ ] Booking calendars accessible
- [ ] Webhooks receiving events

### Business
- [ ] Pipeline stages make sense
- [ ] Email templates branded correctly
- [ ] SMS templates within character limits
- [ ] Calendar booking URLs work
- [ ] Confirmation emails professional
- [ ] Staff assigned to receive notifications
- [ ] Response time SLA defined

### Compliance
- [ ] GDPR/Privacy policy updated (data stored in GHL)
- [ ] Terms of service include GHL processing
- [ ] Email opt-in/opt-out working
- [ ] SMS opt-in required (Australian law)
- [ ] Data retention policy documented

---

## Troubleshooting

### "Unauthorized" Errors
- Check token is correct in `.env.local`
- Verify token hasn't expired (90 days)
- Confirm token has required scopes
- Try regenerating token in GHL

### Contacts Not Creating
- Check Location ID is correct
- Verify API endpoint URL
- Check request body format (JSON)
- Look for validation errors in response

### Workflows Not Triggering
- Confirm contact has correct tags
- Check workflow is published (not draft)
- Verify workflow trigger conditions match
- Check workflow execution logs in GHL

### Booking Calendar Not Available
- Check calendar is published
- Verify calendar ID is correct
- Confirm availability hours set
- Check slot capacity not exceeded

---

## Next Steps

Now that GHL is configured:

1. ✅ **Week 1**: Integrate The Harvest contact form
2. ✅ **Week 2**: Build ACT Farm booking system
3. ✅ **Week 3**: Implement Empathy Ledger & JusticeHub forms
4. ✅ **Week 4**: Polish, test, document, launch!

**Ready to start coding?** Let's implement The Harvest contact form integration first!
