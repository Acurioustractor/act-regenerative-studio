# Google Calendar Integration Setup Guide

This guide walks you through setting up automatic calendar entries for farm stay bookings.

## Prerequisites

- Google account with Google Calendar enabled
- Access to Google Cloud Console
- Admin access to your Vercel deployment

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (or use existing):
   - Click "Select a project" → "New Project"
   - Name: "ACT Farm Integrations"
   - Click "Create"

## Step 2: Enable Google Calendar API

1. In your project, go to **APIs & Services** → **Library**
2. Search for "Google Calendar API"
3. Click on it and click **Enable**

## Step 3: Create Service Account

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **Service Account**
3. Fill in details:
   - **Service account name**: `act-farm-calendar`
   - **Service account ID**: `act-farm-calendar` (auto-filled)
   - **Description**: "Service account for adding farm bookings to calendar"
4. Click **Create and Continue**
5. Skip "Grant this service account access to project" (click Continue)
6. Skip "Grant users access to this service account" (click Done)

## Step 4: Create Service Account Key

1. On the Credentials page, find your new service account
2. Click on the service account email
3. Go to the **Keys** tab
4. Click **Add Key** → **Create new key**
5. Choose **JSON** format
6. Click **Create**
7. A JSON file will download - **save this securely!**

## Step 5: Get Calendar ID

1. Go to [Google Calendar](https://calendar.google.com)
2. Create a dedicated calendar for bookings (recommended):
   - Click "+" next to "Other calendars"
   - Choose "Create new calendar"
   - Name: "ACT Farm Bookings"
   - Click "Create calendar"
3. Click the three dots next to your calendar → **Settings and sharing**
4. Scroll down to "Integrate calendar"
5. Copy the **Calendar ID** (looks like: `abc123@group.calendar.google.com`)

## Step 6: Share Calendar with Service Account

1. Still in calendar settings, scroll to "Share with specific people"
2. Click **Add people**
3. Enter the service account email from Step 3 (from JSON file: `client_email` field)
   - It looks like: `act-farm-calendar@your-project.iam.gserviceaccount.com`
4. Set permission to **Make changes to events**
5. Click **Send**

## Step 7: Extract Credentials from JSON

Open the downloaded JSON file and extract these values:

```json
{
  "client_email": "act-farm-calendar@your-project.iam.gserviceaccount.com",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...very long key...\n-----END PRIVATE KEY-----\n"
}
```

## Step 8: Add Environment Variables

Add these to your `.env.local`:

```bash
# Google Calendar Integration
GOOGLE_CALENDAR_ID=your_calendar_id@group.calendar.google.com
GOOGLE_SERVICE_ACCOUNT_EMAIL=act-farm-calendar@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
...your private key...
-----END PRIVATE KEY-----"
```

**Important:** The private key must include the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` markers, and preserve the newlines.

## Step 9: Add to Vercel

For the private key in Vercel, you need to escape the newlines:

```bash
# In your terminal, from the project directory:
vercel env add GOOGLE_CALENDAR_ID
# Paste: your_calendar_id@group.calendar.google.com

vercel env add GOOGLE_SERVICE_ACCOUNT_EMAIL
# Paste: act-farm-calendar@your-project.iam.gserviceaccount.com

vercel env add GOOGLE_PRIVATE_KEY
# Paste the ENTIRE private key including BEGIN/END markers
# Vercel will handle the formatting
```

Or add them in Vercel dashboard:
1. Go to your project → **Settings** → **Environment Variables**
2. Add each variable
3. For `GOOGLE_PRIVATE_KEY`, paste the entire key as-is

## Step 10: Test the Integration

1. Deploy your changes: `git push`
2. Submit a test farm stay booking through your GHL form
3. Check your Google Calendar - you should see the booking appear!
4. Check Vercel logs for:
   - ✅ Added booking to Google Calendar

## What Gets Created

When a farm stay booking is submitted:

- **Event title**: "Farm Stay: [Guest Name]"
- **Description**: Guest details, email, phone, number of guests, notes
- **Location**: ACT Farm (update in `src/lib/calendar.ts`)
- **Dates**: Parsed from booking dates (all-day events)
- **Attendees**: Guest email added (but no invite sent - they already got confirmation)

## Date Format Support

The calendar integration supports these date formats from your GHL form:

- `Jan 15-20, 2025`
- `2025-01-15 to 2025-01-20`
- `TBD` (defaults to tomorrow)

If you use a different format, update the `parseDateRange` function in `src/lib/calendar.ts`.

## Troubleshooting

### "Failed to add booking to Google Calendar"

1. **Check service account email**: Make sure it matches the JSON file
2. **Check calendar sharing**: Service account must have "Make changes to events" permission
3. **Check private key**: Must include BEGIN/END markers and preserve newlines
4. **Check Calendar ID**: Make sure it's the correct calendar
5. **Check API enabled**: Verify Google Calendar API is enabled in Cloud Console

### "Invalid credentials"

- The private key may be malformed
- Try re-downloading the JSON file and re-copying the key
- Make sure you didn't add extra quotes or modify the key

### Events not showing up

- Check the calendar is actually shared with the service account
- Check you're looking at the right calendar
- Check the timezone setting in `src/lib/calendar.ts`

## Benefits

With Google Calendar integration:

✅ **Centralized scheduling**: All bookings in one calendar
✅ **Team visibility**: Share calendar with your team
✅ **Conflict detection**: See booking overlaps
✅ **Mobile access**: Check bookings on the go
✅ **Integration**: Sync with other calendars and tools

## Optional Enhancements

You can extend this integration to:

- Add different event colors for different booking types
- Set reminders for check-in/check-out
- Create recurring events for CSA pickup schedules
- Add art residency dates to a separate calendar
- Send calendar invites to guests (change `sendUpdates: 'all'`)

## Security Notes

🔐 **Keep your JSON key file secure!**
- Never commit it to git
- Store it securely (password manager, secure vault)
- If compromised, delete the key in Google Cloud Console and create a new one

The service account only has access to the calendars you explicitly share with it - it cannot access your personal calendar unless you share it.

## Resources

- [Google Calendar API Documentation](https://developers.google.com/calendar/api)
- [Node.js Quickstart](https://developers.google.com/calendar/api/quickstart/nodejs)
- [Create Events Guide](https://developers.google.com/calendar/api/guides/create-events)
