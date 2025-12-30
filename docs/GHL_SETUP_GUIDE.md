# GoHighLevel Integration Setup Guide

## 1. Get Your Webhook Secret

1. Log into GoHighLevel
2. Go to **Settings** → **Integrations** → **Webhooks**
3. Create a new webhook:
   - **URL**: `https://your-domain.vercel.app/api/webhooks/ghl`
   - **Events**: Select "Form Submission"
4. Copy the **Webhook Secret** (shown after creation)

## 2. Get Your Form IDs

1. In GoHighLevel, go to **Settings** → **Forms**
2. For each form you want to track, click on it
3. Copy the **Form ID** from the URL or form settings

You need IDs for these forms:
- Contact/Partnership inquiry form
- Farm stay booking form
- CSA interest form
- Art residency application form
- Newsletter signup form

## 3. Add to Your Environment Variables

Create or update `.env.local` in your project root:

```bash
# GHL Webhook Security
GOHIGHLEVEL_WEBHOOK_SECRET=your_webhook_secret_here

# GHL Form ID Mapping (copy these from your GHL forms)
GHL_FORM_CONTACT=abc123xyz
GHL_FORM_FARM_STAY=def456xyz
GHL_FORM_CSA=ghi789xyz
GHL_FORM_ART_RESIDENCY=jkl012xyz
GHL_FORM_NEWSLETTER=mno345xyz

# GHL API (for automation - see Phase 2)
GOHIGHLEVEL_API_KEY=your_api_key_here
GOHIGHLEVEL_LOCATION_ID=your_location_id_here
```

## 4. Deploy to Vercel

After adding these variables locally, add them to Vercel:

```bash
# Using Vercel CLI
vercel env add GOHIGHLEVEL_WEBHOOK_SECRET
vercel env add GHL_FORM_CONTACT
vercel env add GHL_FORM_FARM_STAY
vercel env add GHL_FORM_CSA
vercel env add GHL_FORM_ART_RESIDENCY
vercel env add GHL_FORM_NEWSLETTER
```

Or add them in the Vercel dashboard:
- Go to your project → Settings → Environment Variables
- Add each variable

## 5. Test Your Webhook

1. Submit a test form in GoHighLevel
2. Check your Vercel logs to see:
   - ✅ Webhook signature verified
   - ✅ Form matched by ID
   - ✅ Email sent
   - ✅ Submission stored in Supabase

## What's Implemented

✅ **Phase 1: Essential Integration (COMPLETE)**
- Webhook signature verification (security)
- Form ID mapping (reliability)
- Automated emails (4 types)
- Supabase storage

🚧 **Phase 2: GHL Automation (NEXT)**
- Add newsletter subscribers to GHL contact list
- Add CSA signups to GHL "Harvest" tag/segment
- Trigger GHL workflows from webhook

🚧 **Phase 3: Calendar Integration (LATER)**
- Auto-add farm stay bookings to Google Calendar

## Troubleshooting

### "Invalid webhook signature"
- Check that `GOHIGHLEVEL_WEBHOOK_SECRET` matches the secret in GHL
- Make sure you copied the entire secret (no spaces)

### "Unknown form type"
- Check that your form IDs are correct in `.env.local`
- The system falls back to name-based matching, but it's less reliable
- Look for the 💡 tip in logs telling you which env var to set

### Email not sending
- Check `RESEND_API_KEY` is set
- Verify your domain is configured in Resend
- Look for ❌ error logs in Vercel
