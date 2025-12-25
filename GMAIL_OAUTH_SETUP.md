# Gmail OAuth Setup - Step by Step

**Goal**: Set up Google OAuth so the Living Wiki can scan your Gmail for knowledge extraction.

**Time Required**: 10-15 minutes

---

## Step 1: Create Google Cloud Project

1. **Go to Google Cloud Console**
   - Open: https://console.cloud.google.com/
   - Sign in with your Gmail account (the one you want to scan)

2. **Create New Project**
   - Click "Select a project" (top left)
   - Click "New Project"
   - **Project name**: `ACT Living Wiki`
   - **Organization**: Leave as "No organization" (or select if you have one)
   - Click **"Create"**
   - Wait 10-20 seconds for project creation

3. **Select Your New Project**
   - Click "Select a project" again
   - Choose "ACT Living Wiki"
   - You should see "ACT Living Wiki" in the top bar

---

## Step 2: Enable Gmail API

1. **Go to APIs & Services**
   - In the left sidebar, click **"APIs & Services"** → **"Library"**
   - Or go directly to: https://console.cloud.google.com/apis/library

2. **Search for Gmail API**
   - In the search box, type: `Gmail API`
   - Click on **"Gmail API"** in the results

3. **Enable the API**
   - Click the blue **"Enable"** button
   - Wait 5-10 seconds
   - You should see "API enabled" confirmation

---

## Step 3: Configure OAuth Consent Screen

1. **Go to OAuth Consent Screen**
   - Left sidebar: **"APIs & Services"** → **"OAuth consent screen"**
   - Or: https://console.cloud.google.com/apis/credentials/consent

2. **Choose User Type**
   - Select **"External"** (unless you have a Google Workspace organization)
   - Click **"Create"**

3. **App Information** (Page 1)
   - **App name**: `ACT Living Wiki`
   - **User support email**: Your email
   - **App logo**: (Optional - skip for now)
   - **App domain**: (Optional - skip for now)
   - **Developer contact information**: Your email
   - Click **"Save and Continue"**

4. **Scopes** (Page 2)
   - Click **"Add or Remove Scopes"**
   - In the filter box, type: `gmail.readonly`
   - Check these scopes:
     - ✅ `.../auth/gmail.readonly` - "Read all resources and their metadata—no write operations"
     - ✅ `.../auth/userinfo.email` - "See your primary Google Account email address"
   - Click **"Update"**
   - Click **"Save and Continue"**

5. **Test Users** (Page 3)
   - Click **"Add Users"**
   - Enter your Gmail address (the one you want to scan)
   - Click **"Add"**
   - Click **"Save and Continue"**

6. **Summary** (Page 4)
   - Review the information
   - Click **"Back to Dashboard"**

**Important**: Leave the app in "Testing" mode. You don't need to publish it for personal use.

---

## Step 4: Create OAuth Credentials

1. **Go to Credentials**
   - Left sidebar: **"APIs & Services"** → **"Credentials"**
   - Or: https://console.cloud.google.com/apis/credentials

2. **Create OAuth Client ID**
   - Click **"+ Create Credentials"** (top of page)
   - Select **"OAuth client ID"**

3. **Configure OAuth Client**
   - **Application type**: Select **"Web application"**
   - **Name**: `ACT Living Wiki - Local Dev`

4. **Add Authorized Redirect URIs**
   - Under "Authorized redirect URIs", click **"+ Add URI"**
   - Enter: `http://localhost:3001/api/auth/gmail/callback`
   - Click **"+ Add URI"** again
   - Enter: `http://127.0.0.1:3001/api/auth/gmail/callback`
   - (We add both localhost and 127.0.0.1 for compatibility)

5. **Create**
   - Click **"Create"**
   - A popup will appear with your credentials

6. **Copy Your Credentials** ⚠️ IMPORTANT
   - **Client ID**: Copy this (looks like: `123456789-abc123.apps.googleusercontent.com`)
   - **Client Secret**: Copy this (looks like: `GOCSPX-abc123xyz789`)
   - Click **"OK"**

**Don't lose these!** You'll need them in the next step.

---

## Step 5: Add Credentials to .env.local

1. **Open Your .env.local File**
   - File: `/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio/.env.local`
   - (You already have this open in VS Code)

2. **Add Gmail OAuth Variables**
   - Find the Gmail section (or add it)
   - Paste your credentials:

```bash
# Gmail API (for knowledge extraction from emails)
GOOGLE_CLIENT_ID=paste-your-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=paste-your-client-secret-here
GOOGLE_OAUTH_REDIRECT_URI=http://localhost:3001/api/auth/gmail/callback
```

3. **Example** (with fake values):
```bash
# Gmail API (for knowledge extraction from emails)
GOOGLE_CLIENT_ID=123456789012-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-aBcDeFgHiJkLmNoPqRsTuVwXyZ
GOOGLE_OAUTH_REDIRECT_URI=http://localhost:3001/api/auth/gmail/callback
```

4. **Save the File**
   - Save `.env.local` (Cmd+S or Ctrl+S)

---

## Step 6: Restart Development Server

The server needs to reload the new environment variables.

```bash
# If server is running, stop it (Ctrl+C in terminal)
# Then restart:
npm run dev
```

Wait for "Ready" message (usually 10-20 seconds).

---

## Step 7: Connect Your Gmail Account

1. **Open Authorization URL**
   - In your browser, go to: http://localhost:3001/api/auth/gmail

2. **Google Sign-In**
   - You'll be redirected to Google
   - **Sign in** with the Gmail account you want to scan

3. **Grant Permissions**
   - Google will show: "ACT Living Wiki wants to access your Google Account"
   - You'll see these permissions:
     - ✅ "Read your email messages and settings"
     - ✅ "See your email address"
   - Click **"Continue"** or **"Allow"**

4. **Warning Screen** (if app is in Testing mode)
   - You might see: "Google hasn't verified this app"
   - Click **"Advanced"**
   - Click **"Go to ACT Living Wiki (unsafe)"**
   - (This is safe - it's your own app)

5. **Success!**
   - You'll be redirected to: `http://localhost:3001/admin/settings?gmail_connected=your-email@gmail.com`
   - You should see a success message

---

## Step 8: Verify Connection

Let's check that Gmail OAuth tokens were saved:

```bash
# Connect to Supabase and check for tokens
PGPASSWORD="19bhlGkZRuH9LxrK" psql -h aws-0-ap-southeast-2.pooler.supabase.com -p 6543 -d postgres -U postgres.tednluwflfhxyucgwigh -c "SELECT user_email, created_at FROM gmail_auth_tokens;"
```

**Expected Output**:
```
      user_email       |          created_at
-----------------------+-------------------------------
 your-email@gmail.com  | 2025-12-25 21:30:00.123456+00
```

If you see your email, **you're connected!** ✅

---

## Step 9: Run Your First Gmail Scan

Now let's extract knowledge from your emails:

```bash
# Trigger Gmail scan
curl -X POST http://localhost:3001/api/knowledge/scan-gmail \
  -H "Content-Type: application/json" \
  -d '{"userEmail": "your-email@gmail.com"}'
```

**Replace** `your-email@gmail.com` with your actual email.

**What happens**:
1. Scans last 100 emails (first scan)
2. Looks for decisions, processes, meetings, planning
3. Extracts knowledge and adds to queue
4. Returns summary

**Expected Output** (example):
```json
{
  "success": true,
  "message": "Scanned 100 emails, extracted 8 knowledge items",
  "scanned": 100,
  "extracted": 8,
  "highConfidence": 5,
  "mediumConfidence": 2,
  "lowConfidence": 1
}
```

**Time**: First scan takes 30-60 seconds (scanning 100 emails)

---

## Step 10: Review Extracted Knowledge

1. **Open Queue Viewer**
   - Go to: http://localhost:3001/admin/queue

2. **Filter for Gmail**
   - You should see items with source "Gmail"
   - Review titles, confidence scores, extracted content

3. **Approve High-Confidence Items**
   - Items with 80%+ confidence are usually good
   - Click "Approve" to publish to wiki
   - Or use bulk approve for high-confidence items

---

## Step 11: Set Up Automatic Scanning (Optional)

To scan Gmail automatically every day:

```bash
# Open crontab editor
crontab -e

# Add this line (scan daily at 9am):
0 9 * * * curl -X POST http://localhost:3001/api/knowledge/scan-gmail -H "Content-Type: application/json" -d '{"userEmail": "your-email@gmail.com"}'
```

Or create a script:

```bash
# Create scan script
cat > ~/scan-gmail-daily.sh << 'EOF'
#!/bin/bash
curl -X POST http://localhost:3001/api/knowledge/scan-gmail \
  -H "Content-Type: application/json" \
  -d '{"userEmail": "your-email@gmail.com"}'
EOF

# Make executable
chmod +x ~/scan-gmail-daily.sh

# Add to crontab
crontab -e
# Add: 0 9 * * * ~/scan-gmail-daily.sh
```

---

## Troubleshooting

### Error: "Gmail API not configured"

**Cause**: Environment variables not set or server not restarted

**Fix**:
1. Check `.env.local` has `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
2. Restart server: `npm run dev`
3. Try again: `http://localhost:3001/api/auth/gmail`

### Error: "Redirect URI mismatch"

**Cause**: Redirect URI in Google Cloud doesn't match your app

**Fix**:
1. Go to Google Cloud Console → Credentials
2. Edit your OAuth client
3. Verify redirect URI is exactly: `http://localhost:3001/api/auth/gmail/callback`
4. Try authorization again

### Error: "Access blocked: This app's request is invalid"

**Cause**: OAuth consent screen not configured correctly

**Fix**:
1. Go to OAuth consent screen
2. Make sure you added scopes: `gmail.readonly` and `userinfo.email`
3. Make sure you added yourself as a test user
4. Try authorization again

### Error: "No Gmail tokens found"

**Cause**: Authorization didn't complete or tokens weren't saved

**Fix**:
1. Re-authorize: `http://localhost:3001/api/auth/gmail`
2. Complete the flow all the way to redirect
3. Check database for tokens (Step 8)

### Gmail Scan Returns 0 Items

**Possible Causes**:

1. **No matching emails**
   - Scanner looks for keywords: "decision", "process", "meeting", "action items"
   - Your recent emails might not contain these

2. **Already scanned**
   - If you ran multiple scans, incremental sync might skip emails
   - To reset: Delete from `gmail_sync_state` table

3. **Confidence too low**
   - Scanner might be finding items but confidence <30%
   - Check `knowledge_extraction_queue` table for rejected items

---

## What Gets Scanned?

The Gmail scanner looks for emails containing:

**Decisions** (+0.4 confidence):
- "decision", "decided to", "we agreed", "approved", "chose to"

**Processes** (+0.3 confidence):
- "process", "procedure", "step 1", "workflow", "how to"

**Meetings** (+0.2 confidence):
- "action items", "next steps", "follow-up", "meeting notes"

**Planning** (+0.3 confidence):
- "roadmap", "timeline", "milestones", "plan", "goals"

**Minimum confidence**: 0.3 (30%) to enter queue

**Embedding boost**: OpenAI similarity can boost to 80-95%

---

## Security & Privacy

**What data is accessed**:
- ✅ Email subject lines
- ✅ Email body text
- ✅ Sender/date metadata
- ❌ NOT: Attachments, recipient lists, full email headers

**What data is stored**:
- OAuth tokens (encrypted by Supabase)
- Extracted knowledge items (only emails meeting criteria)
- Sync state (last scan timestamp)

**You control**:
- Which emails get scanned (all, or you can filter)
- Which knowledge items get published (review queue)
- When to scan (manual trigger or cron)

**To revoke access**:
1. Delete tokens from database
2. Revoke at: https://myaccount.google.com/permissions

---

## Next Steps

**After Gmail is connected**:
1. ✅ Run daily scans (manual or cron)
2. ✅ Review queue weekly: http://localhost:3001/admin/queue
3. ✅ Approve high-confidence items (80%+)
4. ✅ Watch wiki grow: http://localhost:3001/wiki

**Future enhancements**:
- WhatsApp scanner (if useful)
- Calendar pattern extraction
- Slack integration (if ACT uses Slack)

---

## Success!

You now have:
- ✅ Gmail OAuth configured
- ✅ Gmail scanner active
- ✅ Automatic knowledge extraction from emails
- ✅ Living wiki capturing tacit knowledge

**The system learns from your daily work automatically!**

---

**Questions?** Check [[GMAIL_SCANNER_SETUP.md]] for detailed documentation.

**Last Updated**: 2025-12-25
**Status**: Ready to use
