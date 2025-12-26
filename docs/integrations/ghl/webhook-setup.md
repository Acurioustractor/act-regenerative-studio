# GoHighLevel Webhook Setup Guide

## Overview

This guide shows you how to configure GoHighLevel to send form submission webhooks to your ACT Studio dashboard for tracking and analytics.

**What this enables:**
- Real-time form submission tracking in dashboard
- Automatic storage in Supabase
- 24-hour and 7-day submission stats
- Breakdown by form type (contact, farm stay, CSA, art residency, newsletter)

---

## Prerequisites

- GoHighLevel account with form(s) set up
- ACT Studio deployed to Vercel (or other production URL)
- Supabase `ghl_submissions` table created (✅ already done)

---

## Step 1: Find Your Webhook URL

Your webhook endpoint is:

```
https://your-domain.vercel.app/api/webhooks/ghl
```

Replace `your-domain.vercel.app` with your actual Vercel deployment URL.

**Example:**
```
https://act-studio.vercel.app/api/webhooks/ghl
```

---

## Step 2: Configure Webhook in GoHighLevel

1. **Log in to GoHighLevel**
   - Go to your GHL dashboard
   - Navigate to: **Settings → Integrations → Webhooks**

2. **Create New Webhook**
   - Click **"Add Webhook"** or **"Create Webhook"**

3. **Configure Webhook Settings**
   - **Name**: `ACT Studio Form Submissions`
   - **Webhook URL**: `https://your-domain.vercel.app/api/webhooks/ghl`
   - **Method**: `POST`

4. **Select Events to Trigger**
   - ✅ **Form Submitted** (check this box)
   - You can also select:
     - Contact Created
     - Contact Updated
     - Opportunity Created

5. **Optional: Add Secret (Recommended)**
   - If GHL provides a webhook secret field, create one
   - Save it to `.env.local` as `GOHIGHLEVEL_WEBHOOK_SECRET=your_secret_here`
   - This will be used for signature verification (TODO: implement)

6. **Save Webhook**
   - Click **Save** or **Create**

---

## Step 3: Test the Webhook

### Option A: Use GHL's Built-in Test

1. In the webhook configuration, look for a **"Test"** or **"Send Test Event"** button
2. Click it to send a test payload
3. Check your server logs to confirm receipt

### Option B: Submit a Real Form

1. Go to one of your public GHL forms
2. Fill it out and submit
3. Check the dashboard at `/admin/dashboard`
4. Verify the submission appears in the "Form Activity" widget

---

## Step 4: Verify Data is Being Stored

### Check Supabase

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Navigate to: **Table Editor → ghl_submissions**
3. You should see your test submission with:
   - Form name
   - Contact details
   - Submission timestamp
   - Full webhook payload (for debugging)

### Check Dashboard API

```bash
curl https://your-domain.vercel.app/api/dashboard/forms
```

Expected response:
```json
{
  "submissions": [
    {
      "id": "uuid-here",
      "formName": "Contact Form",
      "formType": "contact",
      "submittedAt": "2025-12-27T10:30:00Z",
      "name": "Test User",
      "email": "test@example.com",
      "synced": false
    }
  ],
  "stats": {
    "total24h": 1,
    "total7d": 1,
    "byType": {
      "contact": 1
    }
  }
}
```

---

## Form Type Detection

The webhook handler automatically detects form types based on the form name:

| Keywords in Form Name | Detected Type |
|-----------------------|---------------|
| "contact" | `contact` |
| "farm", "stay" | `farm_stay` |
| "csa" | `csa` |
| "art", "residency" | `art_residency` |
| "newsletter" | `newsletter` |
| "volunteer" | `volunteer` |
| "harvest" | `harvest` |
| (none match) | `other` |

**Example:**
- Form named "Contact Us" → Type: `contact`
- Form named "Farm Stay Booking" → Type: `farm_stay`
- Form named "CSA Interest" → Type: `csa`

---

## Environment Variables

No additional environment variables are required for basic webhook functionality. Optional:

```bash
# .env.local

# Optional: Webhook signature verification
GOHIGHLEVEL_WEBHOOK_SECRET=your_webhook_secret_here

# Optional: Form ID mapping (for specific routing)
CONTACT_FORM_ID=ghl_form_id_here
FARM_STAY_BOOKING=ghl_form_id_here
CSA_INTEREST=ghl_form_id_here
ART_RESIDENCY=ghl_form_id_here
NEWSLETTER_FORM_ID=ghl_form_id_here
```

---

## Troubleshooting

### Webhook Not Receiving Data

1. **Check GHL webhook logs**
   - In GHL, go to your webhook settings
   - Look for delivery logs/history
   - Check HTTP status codes (should be 200)

2. **Verify URL is correct**
   - Make sure URL doesn't have trailing slash
   - Correct: `/api/webhooks/ghl`
   - Incorrect: `/api/webhooks/ghl/`

3. **Check server logs**
   ```bash
   # If deployed on Vercel
   vercel logs
   ```

### Data Not Appearing in Dashboard

1. **Check Supabase table directly**
   - Verify data is being inserted
   - Check for error messages

2. **Verify API endpoint**
   ```bash
   curl https://your-domain.vercel.app/api/dashboard/forms
   ```

3. **Check Supabase RLS policies**
   - Table: `ghl_submissions`
   - Policy: "Service role can manage ghl_submissions" should exist

### Form Type Shows as "unknown"

- Check form name in GHL
- Ensure it contains keywords from the detection table above
- Or manually set form type using `CONTACT_FORM_ID` etc. env vars

---

## Next Steps

Once webhooks are working:

1. **Set up Notion Sync** (Phase 3 of implementation plan)
   - Automatically create Notion pages for new submissions
   - Link to CRM pipelines

2. **Add Email Notifications**
   - Send confirmation emails to form submitters
   - Notify team members of new submissions

3. **Create Custom Workflows**
   - Different actions for different form types
   - Integration with GoHighLevel automation

---

## Webhook Payload Example

Here's what GHL sends:

```json
{
  "type": "FormSubmitted",
  "formId": "abc123",
  "formName": "Contact Form",
  "submissionId": "sub_xyz789",
  "contactId": "contact_456",
  "contact": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890"
  },
  "customFields": {
    "message": "I'm interested in learning more",
    "subject": "General Inquiry"
  },
  "submittedAt": "2025-12-27T10:30:00Z",
  "location": "location_id_here"
}
```

---

## Related Documentation

- [GoHighLevel Integration Overview](./setup-guide.md)
- [Dashboard API Reference](../../features/dashboard/implementation-guide.md)
- [Supabase Schema](../../architecture/database-schema.md)

---

**Last Updated**: 2025-12-27
**Status**: Ready to configure
**Issues Fixed**: #8 (Store submissions in Supabase), #30, #31 (Query and display stats)
