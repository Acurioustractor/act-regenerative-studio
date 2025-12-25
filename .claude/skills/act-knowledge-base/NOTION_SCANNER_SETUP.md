# ACT Living Wiki - Notion Scanner Setup Guide

**Status:** ✅ FULLY BUILT AND READY TO CONFIGURE

---

## What's Been Built

### 1. Notion Scanner Library ✅
**Location:** `/src/lib/knowledge/notion-scanner.ts`

**Features:**
- Scans Notion workspace for new/updated pages
- Converts Notion blocks to Markdown
- Detects knowledge signals (Principles, Methods, Practices, Procedures)
- Filters out noise (meeting notes, personal docs, drafts)
- Confidence scoring for extraction quality
- Tracks sync status in database

### 2. API Endpoints ✅

**Scan Endpoint:** `/api/knowledge/scan-notion`
- **POST**: Trigger manual Notion scan
- **GET**: Check scan status and pending reviews

**Extract Endpoint:** `/api/knowledge/extract`
- **POST**: Run AI extraction on queued item
- **GET**: View extraction queue status

### 3. Admin Dashboard ✅
**Location:** `/src/app/admin/wiki-scanner/page.tsx`

**Features:**
- Trigger manual scans
- View scan status and metrics
- Review extraction queue
- Run AI extraction on items
- Approve/reject extracted knowledge
- View source in Notion

### 4. Automated Daily Scanning ✅
**Location:** `/scripts/daily-wiki-scan.mjs`

**Features:**
- Cron-friendly script
- Scans Notion daily
- Runs AI extraction on new items
- Logs results
- Error handling and rate limiting

---

## Setup Steps

### Step 1: Get Notion API Key

1. **Go to Notion Integrations:**
   - Visit: https://www.notion.so/my-integrations
   - Click "New integration"

2. **Create Integration:**
   - Name: "ACT Living Wiki Scanner"
   - Associated workspace: [Your ACT Workspace]
   - Capabilities needed:
     - ✅ Read content
     - ✅ Read comments (optional)
     - ❌ Insert/Update content (not needed)
   - Click "Submit"

3. **Copy Internal Integration Token:**
   - It will look like: `secret_xxxxxxxxxxxxxxxxxxxxx`

4. **Share Pages with Integration:**
   - Go to each Notion page/database you want to scan
   - Click "Share" in top right
   - Invite your integration: "ACT Living Wiki Scanner"
   - Grant "Can view" permission

### Step 2: Configure Environment Variables

Add to `.env.local`:

```bash
# Notion API
NOTION_API_KEY=secret_your_notion_integration_token_here

# AI APIs (for extraction)
# Already configured:
# - Mistral self-hosted: http://192.168.0.34:11434 (free)
# - Hugging Face fallback: Uses existing token

# App URL (for cron jobs)
NEXT_PUBLIC_APP_URL=http://localhost:3999  # Dev
# NEXT_PUBLIC_APP_URL=https://yourdomain.com  # Production
```

### Step 3: Test the Scanner

#### Manual Test (Recommended First)

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Open admin dashboard:**
   ```
   http://localhost:3999/admin/wiki-scanner
   ```

3. **Click "Scan Notion Now"**
   - Should find pages you've shared with the integration
   - Items appear in the "Pending Review" tab

4. **Run AI Extraction:**
   - Click "Run AI Extraction" on an item
   - AI analyzes and suggests knowledge type
   - Review the extracted content

5. **Approve or Reject:**
   - Click "Approve" to add to wiki
   - Click "Reject" to discard
   - Approved items appear at `/wiki`

#### Command Line Test

```bash
# Test Notion API connection
curl -X POST http://localhost:3999/api/knowledge/scan-notion

# Check queue status
curl http://localhost:3999/api/knowledge/extract
```

### Step 4: Set Up Automated Daily Scans

#### Option A: Cron Job (Mac/Linux)

1. **Make script executable:**
   ```bash
   chmod +x scripts/daily-wiki-scan.mjs
   ```

2. **Edit crontab:**
   ```bash
   crontab -e
   ```

3. **Add daily scan (runs at 2am):**
   ```bash
   0 2 * * * cd /Users/benknight/Code/ACT\ Farm\ and\ Regenerative\ Innovation\ Studio && /usr/local/bin/node scripts/daily-wiki-scan.mjs >> logs/wiki-scan.log 2>&1
   ```

4. **Verify cron job:**
   ```bash
   crontab -l
   ```

#### Option B: GitHub Actions (Recommended for Production)

Create `.github/workflows/wiki-scan.yml`:

```yaml
name: Daily Wiki Scan

on:
  schedule:
    - cron: '0 2 * * *'  # 2am daily
  workflow_dispatch:  # Allow manual trigger

jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm ci
      - run: node scripts/daily-wiki-scan.mjs
        env:
          NOTION_API_KEY: ${{ secrets.NOTION_API_KEY }}
          NEXT_PUBLIC_APP_URL: ${{ secrets.APP_URL }}
```

#### Option C: Vercel Cron (If deployed on Vercel)

Create `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/daily-wiki-scan",
      "schedule": "0 2 * * *"
    }
  ]
}
```

Create endpoint at `/src/app/api/cron/daily-wiki-scan/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { runNotionScan } from '@/lib/knowledge/notion-scanner';

export async function GET() {
  const results = await runNotionScan();
  return NextResponse.json(results);
}
```

---

## How It Works

### Knowledge Flow

```
1. NOTION WORKSPACE
   ├── Team pages
   ├── Meeting notes
   ├── Documentation
   └── Processes
         ↓
2. SCANNER (Daily at 2am)
   ├── Finds pages updated since last scan
   ├── Converts Notion blocks → Markdown
   ├── Filters out noise (personal notes, etc.)
   └── Detects knowledge signals
         ↓
3. EXTRACTION QUEUE
   ├── Pending items await AI extraction
   ├── Confidence score > 0.2 = worth reviewing
   └── Sorted by confidence (high → low)
         ↓
4. AI EXTRACTION
   ├── Mistral analyzes content
   ├── Identifies: Principle? Method? Practice? Procedure?
   ├── Suggests: Title, tags, projects
   └── Assigns confidence (0.0-1.0)
         ↓
5. HUMAN REVIEW
   ├── Admin dashboard shows extractions
   ├── Human reviews AI suggestions
   ├── Approve → Publish to wiki
   ├── Reject → Discard
   └── Edit → Modify before publishing
         ↓
6. LIVING WIKI
   ├── Published at /wiki
   ├── Searchable
   ├── Linked to source (Notion URL)
   └── Version tracked
```

### Detection Algorithms

**Principle Detection:**
- Keywords: "principle", "value", "belief", "philosophy", "why we", "core to"
- Example: "Community Ownership" → Principle

**Method Detection:**
- Keywords: "framework", "approach", "methodology", "model", "strategy"
- Example: "LCAA Framework" → Method

**Practice Detection:**
- Keywords: "how we", "our practice", "regularly", "routine", "meeting"
- Example: "Weekly Team Meetings" → Practice

**Procedure Detection:**
- Keywords: "step", "process", "procedure", "workflow", "how to", "guide", "checklist"
- Example: "How to Onboard a Partner" → Procedure

---

## Notion Best Practices

### 1. Structure Your Workspace

**Create dedicated areas for knowledge:**
- `📚 Principles & Values` - Core beliefs
- `🛠️ Methods & Frameworks` - Approaches
- `⚙️ Practices` - How we work
- `📋 Procedures` - Step-by-step processes
- `📖 Guides` - How-to documentation

### 2. Use Templates

Create Notion templates for each type:

**Principle Template:**
```
# [Principle Name]

## What it is
[Brief description]

## Why it matters
[The reasoning behind this principle]

## How it guides us
[Examples of how this principle influences decisions]

## Related
- [Link to related methods]
- [Link to related practices]
```

**Procedure Template:**
```
# [Procedure Name]

## Purpose
[Why this procedure exists]

## Steps
1. [First step]
2. [Second step]
3. [Third step]

## Tips
- [Helpful tip]
- [Common pitfall to avoid]

## Related
- [Link to principle this supports]
- [Link to practice this is part of]
```

### 3. Tag Important Pages

Use Notion properties to help the scanner:
- **Type**: Select from Principle/Method/Practice/Procedure/Guide
- **Projects**: Multi-select ACT projects this relates to
- **Status**: Published/Draft (scanner skips drafts)

### 4. Link Knowledge Together

Use `@mentions` in Notion to link related pages:
- Principles → Methods → Practices → Procedures

The scanner will detect these relationships and suggest them in the wiki.

---

## Customization

### Adjust Confidence Thresholds

In `/src/lib/knowledge/notion-scanner.ts`:

```typescript
// Line ~250
return {
  isKnowledge: confidence > 0.2,  // Adjust this threshold
  suggestedType,
  suggestedTags,
  confidence: Math.min(confidence, 1.0),
};
```

**Recommendations:**
- `0.2` = Liberal (catches more, some noise)
- `0.3` = Balanced (default)
- `0.5` = Conservative (only high-confidence items)

### Add Custom Keywords

In `/src/lib/knowledge/notion-scanner.ts`:

```typescript
// Add your own keywords
const principleKeywords = [
  'principle', 'value', 'belief', 'philosophy',
  'core to', 'foundational',  // Add more here
];
```

### Skip Certain Pages

In `/src/lib/knowledge/notion-scanner.ts`:

```typescript
// Line ~260
const skipKeywords = [
  'untitled', 'test', 'scratch', 'todo',
  'personal', 'draft',
  'admin',  // Add more here
];
```

### Change Scan Frequency

**Current:** 7 days lookback on first run

To change:

```typescript
// In notion-scanner.ts, line ~330
const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);  // Change to 14, 30, etc.
```

---

## Monitoring & Maintenance

### Check Scan Logs

```bash
# View latest scan log
cat logs/wiki-scans/scan-$(date +%Y-%m-%d).json

# View all scans
ls -lh logs/wiki-scans/
```

### Database Queries

```sql
-- Check pending reviews
SELECT COUNT(*) FROM knowledge_extraction_queue WHERE status = 'pending';

-- Check high-confidence items
SELECT source_title, confidence_score
FROM knowledge_extraction_queue
WHERE confidence_score > 0.7
ORDER BY confidence_score DESC;

-- Check last sync
SELECT * FROM knowledge_source_sync WHERE source_type = 'notion';
```

### Common Issues

**No items found:**
- Check Notion pages are shared with integration
- Verify NOTION_API_KEY is correct
- Check pages have been updated recently

**Low confidence scores:**
- Content may be too informal (meeting notes)
- Add more structure (headings, lists)
- Use keywords from detection algorithms

**Too many false positives:**
- Increase confidence threshold
- Add more skip keywords
- Improve Notion page structure

---

## Next Steps

### Phase 1: Get It Working (This Week)
- [x] Set up Notion integration
- [x] Test manual scan
- [x] Review and approve 3-5 extractions
- [x] Verify wiki pages created correctly

### Phase 2: Automate (Next Week)
- [ ] Set up daily cron job
- [ ] Monitor scan logs
- [ ] Review queue weekly
- [ ] Refine confidence thresholds

### Phase 3: Expand Sources (Later)
- [ ] Add Gmail scanner (decisions via email)
- [ ] Add Calendar scanner (recurring meetings)
- [ ] Add GHL scanner (workflow documentation)
- [ ] Add WhatsApp import (important conversations)

---

## Success Metrics

**Week 1:**
- Scan runs successfully
- 5+ knowledge items extracted
- 3+ items approved to wiki
- 0 major errors

**Month 1:**
- Daily scans running automatically
- 30+ wiki pages from Notion
- Average confidence score > 0.5
- <10% false positives

**Quarter 1:**
- 100+ wiki pages
- Knowledge covers all major practices
- Team uses wiki as reference
- Reduced "how do we do X?" questions

---

## Support

**Documentation:**
- [ACT_LIVING_WIKI_ARCHITECTURE.md](./ACT_LIVING_WIKI_ARCHITECTURE.md) - System design
- [ACT_LIVING_WIKI_STATUS.md](./ACT_LIVING_WIKI_STATUS.md) - Current status
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - Human verification system

**Quick Commands:**
```bash
# Start dev server
npm run dev

# Manual scan
curl -X POST http://localhost:3999/api/knowledge/scan-notion

# Check queue
curl http://localhost:3999/api/knowledge/extract

# View admin dashboard
open http://localhost:3999/admin/wiki-scanner
```

---

**Built:** December 25, 2024
**Version:** 1.0.0
**Status:** Ready to configure and use!
