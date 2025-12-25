# Gmail Scanner Setup Guide

**ACT Living Wiki - Email Knowledge Extraction**

This guide walks you through setting up the Gmail scanner to automatically extract knowledge from your emails.

---

## Table of Contents

1. [Overview](#overview)
2. [Google Cloud Setup](#google-cloud-setup)
3. [Environment Configuration](#environment-configuration)
4. [Connecting Your Gmail Account](#connecting-your-gmail-account)
5. [Running Scans](#running-scans)
6. [Monitoring and Statistics](#monitoring-and-statistics)
7. [Troubleshooting](#troubleshooting)
8. [Architecture Overview](#architecture-overview)

---

## Overview

The Gmail scanner automatically extracts tacit knowledge from your emails by:

- **Scanning** your inbox for knowledge-worthy emails (decisions, processes, meetings)
- **Detecting** patterns that indicate valuable organizational knowledge
- **Extracting** content and formatting it as markdown
- **Scoring** confidence using embeddings (same as Notion scanner)
- **Queueing** items for human review or auto-approval
- **Publishing** approved knowledge to the Living Wiki

### What Gets Extracted?

The scanner looks for emails containing:

- **Decisions** - "we agreed", "decided to", "approved"
- **Processes** - "step 1", "procedure", "workflow"
- **Meetings** - "action items", "next steps", "follow-up"
- **Planning** - "roadmap", "timeline", "milestones"

**Confidence Scoring:**
- 🟢 High (80-100%): Auto-approved if confidence >= 90%
- 🟡 Medium (60-80%): Queued for review
- 🟠 Low (<60%): Requires review or rejected

---

## Google Cloud Setup

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Select a project"** → **"New Project"**
3. Project name: `ACT Living Wiki`
4. Click **"Create"**

### Step 2: Enable Gmail API

1. In your project, go to **"APIs & Services"** → **"Library"**
2. Search for **"Gmail API"**
3. Click **"Enable"**

### Step 3: Create OAuth 2.0 Credentials

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"OAuth client ID"**
3. If prompted, configure the OAuth consent screen:
   - User Type: **Internal** (if G Suite) or **External**
   - App name: `ACT Living Wiki`
   - User support email: Your email
   - Developer contact: Your email
   - Scopes: Add `https://www.googleapis.com/auth/gmail.readonly`
   - Test users: Add your email (for External apps)

4. Create OAuth client ID:
   - Application type: **Web application**
   - Name: `ACT Living Wiki`
   - Authorized redirect URIs:
     - `http://localhost:3001/api/auth/gmail/callback` (for development)
     - `https://your-domain.com/api/auth/gmail/callback` (for production)

5. Click **"Create"**
6. **Save the Client ID and Client Secret** - you'll need these next!

### Step 4: Configure OAuth Consent Screen (if External)

If you selected "External" for user type:

1. Go to **"OAuth consent screen"**
2. Add required scopes:
   - `https://www.googleapis.com/auth/gmail.readonly`
   - `https://www.googleapis.com/auth/userinfo.email`
3. Add test users (your Gmail address)
4. **Important:** Leave app in "Testing" mode unless you want to publish it

---

## Environment Configuration

### Step 1: Add Credentials to .env.local

Copy your Google Cloud credentials to `.env.local`:

```bash
# Gmail API (for knowledge extraction from emails)
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_OAUTH_REDIRECT_URI=http://localhost:3001/api/auth/gmail/callback
```

**Important:**
- Replace `your-client-id` with your actual Client ID
- Replace `your-client-secret` with your actual Client Secret
- For production, update `GOOGLE_OAUTH_REDIRECT_URI` to your production domain

### Step 2: Verify Other Required Variables

The Gmail scanner also requires these variables (should already be set):

```bash
# Anthropic AI API Key (for embeddings)
ANTHROPIC_API_KEY=sk-ant-api03-xxx

# Supabase (for database)
NEXT_PUBLIC_SUPABASE_URL=https://tednluwflfhxyucgwigh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### Step 3: Restart Development Server

```bash
npm run dev
```

---

## Connecting Your Gmail Account

### Step 1: Initiate OAuth Flow

Open your browser and navigate to:

```
http://localhost:3001/api/auth/gmail
```

This will redirect you to Google's OAuth consent screen.

### Step 2: Grant Permissions

1. Select your Gmail account
2. Review permissions:
   - "Read your email messages and settings"
   - "View your email address"
3. Click **"Allow"**

### Step 3: Verify Connection

After authorization, you'll be redirected to:

```
http://localhost:3001/admin/settings?gmail_connected=your-email@gmail.com
```

You should see a success message confirming your Gmail account is connected.

### What Just Happened?

- OAuth tokens (access + refresh) were saved to `gmail_auth_tokens` table
- The refresh token enables automatic token renewal
- Your account is now ready for scanning

---

## Running Scans

### Manual Scan via API

Trigger a scan using curl:

```bash
curl -X POST http://localhost:3001/api/knowledge/scan-gmail \
  -H "Content-Type: application/json" \
  -d '{"userEmail": "your-email@gmail.com"}'
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Scanned 150 emails, extracted 12 knowledge items",
  "scanned": 150,
  "extracted": 12,
  "highConfidence": 8,
  "mediumConfidence": 3,
  "lowConfidence": 1
}
```

### Manual Scan via UI (Coming Soon)

A scan button will be added to the admin interface.

### Automatic Scanning with Cron (Recommended)

Set up a cron job to scan Gmail every hour:

**Option 1: System Cron**

```bash
# Edit crontab
crontab -e

# Add this line (scan every hour)
0 * * * * curl -X POST http://localhost:3001/api/knowledge/scan-gmail -H "Content-Type: application/json" -d '{"userEmail": "your-email@gmail.com"}'
```

**Option 2: Node Script**

Create `scripts/scan-gmail.sh`:

```bash
#!/bin/bash
curl -X POST http://localhost:3001/api/knowledge/scan-gmail \
  -H "Content-Type: application/json" \
  -d '{"userEmail": "your-email@gmail.com"}'
```

Make it executable and add to cron:

```bash
chmod +x scripts/scan-gmail.sh
crontab -e
# Add: 0 * * * * /path/to/scripts/scan-gmail.sh
```

---

## Monitoring and Statistics

### View Sync Statistics

Query the `gmail_sync_stats` view:

```sql
SELECT * FROM gmail_sync_stats;
```

**Example Output:**

| user_email | last_sync_at | status | last_scan_found | last_scan_extracted | total_in_queue | pending_review | approved |
|------------|--------------|--------|-----------------|---------------------|----------------|----------------|----------|
| you@gmail.com | 2024-12-25 14:30:00 | completed | 150 | 12 | 12 | 4 | 8 |

### Check Sync State

```sql
SELECT
  t.user_email,
  s.last_sync_at,
  s.next_sync_at,
  s.status,
  s.items_found,
  s.items_extracted,
  s.error_message
FROM gmail_auth_tokens t
LEFT JOIN gmail_sync_state s ON s.account_id = t.id;
```

### View Extracted Knowledge

Check the extraction queue:

```bash
open http://localhost:3001/admin/queue?filter=gmail
```

Or query directly:

```sql
SELECT
  id,
  raw_title,
  suggested_type,
  confidence_score,
  status,
  created_at
FROM knowledge_extraction_queue
WHERE source_type = 'gmail'
ORDER BY confidence_score DESC;
```

### Monitor Auto-Approvals

See which Gmail items were auto-approved:

```sql
SELECT
  title,
  page_type,
  approval_confidence,
  created_at
FROM wiki_pages
WHERE auto_approved = true
  AND 'gmail' = ANY(source_urls)
ORDER BY created_at DESC;
```

---

## Troubleshooting

### Error: "Gmail API not configured"

**Cause:** Missing `GOOGLE_CLIENT_ID` or `GOOGLE_CLIENT_SECRET` in `.env.local`

**Fix:**
1. Verify credentials in `.env.local`
2. Restart development server: `npm run dev`

### Error: "No Gmail tokens found for {email}"

**Cause:** Gmail account not connected via OAuth

**Fix:**
1. Go to `http://localhost:3001/api/auth/gmail`
2. Complete OAuth flow
3. Retry scan

### Error: "Invalid grant" or "Token expired"

**Cause:** Refresh token is invalid or revoked

**Fix:**
1. Delete old tokens:
   ```sql
   DELETE FROM gmail_auth_tokens WHERE user_email = 'your-email@gmail.com';
   ```
2. Reconnect: `http://localhost:3001/api/auth/gmail`

### Error: 429 "Rate limit exceeded"

**Cause:** Too many Gmail API requests

**Fix:**
- Wait 1 minute and retry
- The scanner has built-in rate limiting (30 concurrent requests)
- If persistent, reduce scan frequency

### Error: 404 "History not found"

**Cause:** Last scan was >1 week ago, Gmail History API doesn't go back that far

**Fix:**
- This is handled automatically - scanner falls back to full scan
- No action needed

### No Knowledge Items Extracted

**Possible Causes:**

1. **No matching emails:**
   - Scanner looks for decisions, processes, meetings
   - Try searching for emails with "decision", "process", "action items"

2. **Confidence too low:**
   - Check `confidence_score` in `knowledge_extraction_queue`
   - Lower confidence threshold in `detectKnowledgeSignals()`

3. **Recent emails only:**
   - First scan only fetches last 100 emails
   - Wait for incremental scans to catch more

**Debug:**

```sql
-- Check raw extractions (including rejected)
SELECT
  raw_title,
  confidence_score,
  status,
  source_metadata->>'subject' as email_subject
FROM knowledge_extraction_queue
WHERE source_type = 'gmail'
ORDER BY created_at DESC
LIMIT 20;
```

### OAuth Consent Screen Errors

**Error: "Access blocked: This app's request is invalid"**

**Cause:** Redirect URI mismatch

**Fix:**
1. Go to Google Cloud Console → Credentials
2. Edit OAuth client
3. Verify redirect URI matches `.env.local`:
   - Development: `http://localhost:3001/api/auth/gmail/callback`
   - Production: `https://your-domain.com/api/auth/gmail/callback`

**Error: "This app isn't verified"**

**Cause:** OAuth consent screen is in "Testing" mode

**Fix:**
- For personal use: Click "Advanced" → "Go to ACT Living Wiki (unsafe)"
- For production: Submit app for verification (not required for internal use)

---

## Architecture Overview

### How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                     Gmail Scanner Flow                       │
└─────────────────────────────────────────────────────────────┘

1. OAuth Flow
   User → /api/auth/gmail → Google OAuth → /api/auth/gmail/callback
   → Tokens saved to gmail_auth_tokens

2. Scan Trigger
   Cron/Manual → POST /api/knowledge/scan-gmail
   → GmailScanner.scanInbox()

3. Incremental Sync
   Get last_history_id from gmail_sync_state
   → Gmail History API (only new emails since last scan)
   → Fallback to full scan if history too old

4. Message Processing
   For each message:
   - Fetch full message (subject + body)
   - Convert HTML to plain text
   - Detect knowledge signals (decisions, processes, etc.)
   - Calculate confidence score

5. Knowledge Extraction
   If confidence > 0.3:
   - Format as markdown
   - Generate embedding (OpenAI)
   - Calculate semantic similarity confidence
   - Insert into knowledge_extraction_queue

6. Human Review / Auto-Approval
   - High confidence (>= 90%): Auto-approve
   - Medium/Low: Queue for review at /admin/queue

7. Wiki Publishing
   Approved items → wiki_pages → Searchable at /wiki
```

### Database Schema

**gmail_auth_tokens**
- Stores OAuth tokens (access + refresh)
- Auto-refreshes when tokens expire
- One row per connected Gmail account

**gmail_sync_state**
- Tracks incremental sync state
- `last_history_id`: Gmail History API cursor
- `last_sync_at`: Timestamp of last scan
- `items_found`: Total emails scanned
- `items_extracted`: Knowledge items found

**knowledge_extraction_queue**
- Unified queue for all sources (Notion, Gmail, etc.)
- `source_type = 'gmail'`
- `source_id = message.id`
- `thread_id = message.threadId` (for email threading)
- `confidence_score`: 0.0 to 1.0

### Rate Limiting

Gmail API quota: **250 quota units/second**

Scanner strategy:
- Each `messages.get()` = 5 quota units
- 250 ÷ 5 = 50 requests/second
- Scanner uses 30 concurrent requests (safety buffer)
- Exponential backoff on 429 errors

**Result:** Can process ~1,800 emails/minute without hitting limits

### Incremental Sync Strategy

**First Scan:**
- Fetches last 100 messages
- Stores `historyId` in `gmail_sync_state`

**Subsequent Scans:**
- Uses Gmail History API with `startHistoryId`
- Only fetches new/modified emails since last scan
- Dramatically reduces API calls

**Fallback:**
- If `historyId` is >7 days old → 404 error
- Automatically falls back to full scan
- Updates `historyId` for next incremental sync

### Knowledge Detection Patterns

The scanner scores emails based on content signals:

```typescript
// Decisions (+0.4 confidence)
"decision", "decided to", "we agreed", "approved"

// Processes (+0.3 confidence)
"process", "procedure", "step 1", "workflow"

// Planning (+0.3 confidence)
"roadmap", "timeline", "milestones", "plan"

// Meetings (+0.2 confidence)
"action items", "next steps", "follow-up", "minutes"
```

**Minimum threshold:** 0.3 confidence to enter queue

**Embedding boost:**
- Generates embedding using OpenAI
- Compares to existing wiki pages
- High similarity → boosts confidence to 0.80-0.95
- Low similarity → confidence stays 0.30-0.60

### Integration with Existing System

Gmail scanner reuses all existing infrastructure:

- ✅ Same `knowledge_extraction_queue` table
- ✅ Same embedding service (OpenAI)
- ✅ Same confidence scoring logic
- ✅ Same queue viewer UI (`/admin/queue`)
- ✅ Same auto-approval system (>= 90%)
- ✅ Same notification system
- ✅ Same wiki publishing flow

**Result:** Zero new UI needed - everything just works!

---

## Next Steps

1. **Set up Google Cloud credentials** (see [Google Cloud Setup](#google-cloud-setup))
2. **Add credentials to .env.local** (see [Environment Configuration](#environment-configuration))
3. **Connect your Gmail account** (see [Connecting Your Gmail Account](#connecting-your-gmail-account))
4. **Run your first scan** (see [Running Scans](#running-scans))
5. **Review extracted knowledge** at http://localhost:3001/admin/queue
6. **Set up automatic scanning** with cron (see [Automatic Scanning](#automatic-scanning-with-cron-recommended))

---

## Cost Analysis

### Gmail API Quota

- **Free tier:** 1 billion quota units/day
- **Scanner usage:** ~5 units per email
- **Daily capacity:** 200 million emails/day (way more than needed!)

**Cost:** FREE for typical usage

### OpenAI Embeddings

- **Model:** text-embedding-3-small
- **Cost:** $0.00002 per 1K tokens
- **Typical email:** ~500 tokens = $0.00001 per email

**Example:**
- 1,000 emails/month × $0.00001 = **$0.01/month**
- 10,000 emails/month × $0.00001 = **$0.10/month**

**Cost:** Nearly FREE!

---

## Security & Privacy

### What Data is Stored?

- **OAuth tokens:** Access + refresh tokens (encrypted at rest by Supabase)
- **Email metadata:** Subject, sender, date, thread ID
- **Email content:** Only for knowledge-worthy emails (stored as markdown)
- **Not stored:** Full inbox, attachments, recipients

### Data Retention

- **Tokens:** Stored until you disconnect Gmail
- **Extractions:** Kept in queue until approved/rejected
- **Published knowledge:** Kept in `wiki_pages` indefinitely

### Revoking Access

To disconnect Gmail:

1. Delete tokens:
   ```sql
   DELETE FROM gmail_auth_tokens WHERE user_email = 'your-email@gmail.com';
   ```

2. Revoke OAuth access at: https://myaccount.google.com/permissions

3. (Optional) Delete extracted knowledge:
   ```sql
   DELETE FROM knowledge_extraction_queue WHERE source_type = 'gmail';
   DELETE FROM wiki_pages WHERE 'gmail' = ANY(source_urls);
   ```

---

## Support

**Issues?** Check [Troubleshooting](#troubleshooting) first.

**Questions?** See [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) for full system overview.

**Need help?** Open an issue or contact the ACT team.

---

**Status:** Gmail scanner ready for production use! 🎉
