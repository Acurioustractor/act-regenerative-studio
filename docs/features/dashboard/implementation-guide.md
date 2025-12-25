# ACT Ecosystem Dashboard - Implementation Guide

This document provides complete implementation instructions for the ACT Ecosystem monitoring dashboard and integration system.

## What Has Been Built

### 1. Monitoring Dashboard (`/admin/dashboard`)

A comprehensive admin dashboard showing:
- **Real-time Metrics**: Total projects, active registries, deployments, form submissions
- **Project Health Cards**: Status of all 6 ACT projects with registry sync status
- **Registry Sync Status**: Live monitoring of content aggregation from all project APIs
- **Deployment History**: Recent Vercel deployments across all projects
- **GHL Form Activity**: Form submission tracking with Notion sync status

**Files Created:**
- `/src/app/admin/dashboard/page.tsx` - Main dashboard page
- `/src/components/dashboard/DashboardMetrics.tsx` - Top-level metrics cards
- `/src/components/dashboard/ProjectHealthCards.tsx` - Project status cards
- `/src/components/dashboard/RegistryStatus.tsx` - Registry sync monitoring
- `/src/components/dashboard/DeploymentHistory.tsx` - Deployment timeline
- `/src/components/dashboard/GHLFormActivity.tsx` - Form submission tracking

### 2. Registry Sync System

Content aggregation from all ACT project registries:

**Files Created:**
- `/src/lib/registry-sync.ts` - Core sync logic and registry configuration
- `/src/app/api/registry/status/route.ts` - Get current sync status
- `/src/app/api/registry/sync/route.ts` - Trigger manual sync

**Supported Registries:**
1. Empathy Ledger - `https://empathy-ledger-v2.vercel.app/api/registry`
2. JusticeHub - `https://justicehub-vert.vercel.app/api/registry`
3. Goods on Country - `https://goodsoncountry.netlify.app/registry.json`
4. The Harvest - `https://witta-swot-analysis.vercel.app/api/registry`
5. ACT Farm - `http://localhost:3000/api/registry` (self)

### 3. Dashboard API Endpoints

**Files Created:**
- `/src/app/api/dashboard/metrics/route.ts` - Aggregate metrics
- `/src/app/api/dashboard/projects/route.ts` - Project health data
- `/src/app/api/dashboard/deployments/route.ts` - Deployment history (Vercel)
- `/src/app/api/dashboard/forms/route.ts` - Form submission stats

### 4. GoHighLevel Webhook Handler

**File Created:**
- `/src/app/api/webhooks/ghl/route.ts` - GHL form submission webhook processor

Handles 5 form types:
- Contact/Partnership inquiries
- Farm stay bookings
- CSA interest registrations
- Art residency applications
- Newsletter signups

---

## Environment Variables Required

Add these to your `.env.local` file:

```bash
# Registry API Tokens (already configured)
EMPATHY_LEDGER_API_TOKEN=d35d4195fdbde06c018ee41289f47543d02aaf738f51b1b80efc46c06380ab14
EMPATHY_LEDGER_REGISTRY_URL=https://empathy-ledger-v2.vercel.app/api/registry

JUSTICEHUB_API_TOKEN=jh_test_key_2024_empathy_ledger
JUSTICEHUB_REGISTRY_URL=https://justicehub-vert.vercel.app/api/registry

HARVEST_API_TOKEN=94b1574a687ab83d2c56f752aa0fb9f51632f70a515c8e052b5365047c748e57
HARVEST_REGISTRY_URL=https://witta-swot-analysis.vercel.app/api/registry

GOODS_REGISTRY_URL=https://goodsoncountry.netlify.app/registry.json

ACT_TRACTOR_API_TOKEN=act_hub_internal_token_2024
ACT_TRACTOR_REGISTRY_URL=http://localhost:3000/api/registry

REGISTRY_REVALIDATE_SECONDS=60

# GoHighLevel Configuration (NEW - needs setup)
GOHIGHLEVEL_WEBHOOK_SECRET=your_webhook_secret_here
CONTACT_FORM_ID=your_ghl_contact_form_id
FARM_STAY_BOOKING=your_ghl_farm_stay_form_id
CSA_INTEREST=your_ghl_csa_form_id
ART_RESIDENCY=your_ghl_art_residency_form_id
NEWSLETTER_FORM_ID=your_ghl_newsletter_form_id

# Vercel API (NEW - needs setup for deployment monitoring)
VERCEL_ACCESS_TOKEN=your_vercel_token_here
VERCEL_TEAM_ID=your_vercel_team_id_here

# Notion API (NEW - needs setup for form sync)
NOTION_API_KEY=your_notion_integration_token
NOTION_PARTNERSHIPS_DATABASE_ID=notion_database_id
NOTION_BOOKINGS_DATABASE_ID=notion_database_id
NOTION_CSA_MEMBERS_DATABASE_ID=notion_database_id
NOTION_RESIDENCIES_DATABASE_ID=notion_database_id
```

---

## Setup Instructions

### Phase 1: Access the Dashboard

1. **Navigate to the dashboard:**
   ```
   http://localhost:3000/admin/dashboard
   ```

2. **Add to admin navigation** (TODO):
   Update `/src/components/admin/AdminShell.tsx` to include dashboard link

### Phase 2: Configure GoHighLevel Webhooks

1. **Login to GoHighLevel** (https://app.gohighlevel.com)

2. **Navigate to Settings → Integrations → Webhooks**

3. **Create webhook** for each form:
   - **URL**: `https://your-production-domain.com/api/webhooks/ghl`
   - **Events**: Select "Form Submission"
   - **Secret**: Generate a secure secret and add to `GOHIGHLEVEL_WEBHOOK_SECRET`

4. **Get Form IDs**:
   - Go to Sites → Forms
   - Open each form
   - Copy the form ID from the URL
   - Add to corresponding env var (`CONTACT_FORM_ID`, etc.)

5. **Test webhook**:
   - Submit a test form
   - Check server logs: `npm run dev`
   - Should see: "Received GHL webhook: ..."

### Phase 3: Set Up Vercel API Integration

1. **Create Vercel Access Token**:
   - Go to https://vercel.com/account/tokens
   - Create new token with "Read" access
   - Add to `VERCEL_ACCESS_TOKEN`

2. **Get Team ID**:
   - Go to https://vercel.com/teams/settings
   - Copy Team ID
   - Add to `VERCEL_TEAM_ID`

3. **Uncomment Vercel API code** in:
   - `/src/app/api/dashboard/deployments/route.ts`

4. **Test deployment monitoring**:
   ```bash
   curl http://localhost:3000/api/dashboard/deployments
   ```

### Phase 4: Configure Notion Integration

**Option A: Use Existing ACT Notion MCP Server**

The ACT Notion MCP server already exists at:
```
/Users/benknight/Code/ACT Notion MCP
```

1. **Get Notion Integration Token**:
   - Already exists: Check existing `.env` in ACT Notion MCP project
   - Or create new at: https://www.notion.so/my-integrations

2. **Create Databases in Notion**:
   - **Partnerships** (Contact form submissions)
     - Properties: Name, Email, Phone, Message, Source, Submitted At, Status
   - **Bookings** (Farm stay requests)
     - Properties: Name, Email, Check-in, Check-out, Guests, Status, Notes
   - **CSA Members** (Harvest share signups)
     - Properties: Name, Email, Share Type, Start Date, Status, Payment
   - **Residency Applications** (Art residencies)
     - Properties: Name, Email, Portfolio, Dates, Status, Review Notes

3. **Get Database IDs**:
   - Open each database in Notion
   - Copy database ID from URL: `notion.so/{workspace}/{DATABASE_ID}?v=...`
   - Add to corresponding `NOTION_*_DATABASE_ID` env vars

4. **Create Notion API integration functions**:
   ```typescript
   // /src/lib/notion-sync.ts
   import { Client } from "@notionhq/client";

   const notion = new Client({ auth: process.env.NOTION_API_KEY });

   export async function createPartnershipEntry(data: any) {
     await notion.pages.create({
       parent: { database_id: process.env.NOTION_PARTNERSHIPS_DATABASE_ID! },
       properties: {
         Name: { title: [{ text: { content: data.name } }] },
         Email: { email: data.email },
         // ... other properties
       },
     });
   }
   ```

5. **Update webhook handlers** to call Notion sync functions

**Option B: Use Notion MCP Tools via ACT Notion MCP**

Leverage existing MCP server tools:
- `create_notion_page`
- `query_notion_database`
- `update_notion_page`

See: `/Users/benknight/Code/ACT Notion MCP/README.md`

### Phase 5: Set Up Supabase Tables for Webhook Storage

1. **Create tables** in Supabase:

```sql
-- GHL Form Submissions
CREATE TABLE ghl_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  form_id TEXT NOT NULL,
  form_name TEXT NOT NULL,
  form_type TEXT NOT NULL,
  submission_id TEXT UNIQUE NOT NULL,
  contact_id TEXT,
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  custom_fields JSONB,
  submitted_at TIMESTAMPTZ NOT NULL,
  synced_to_notion BOOLEAN DEFAULT FALSE,
  notion_page_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ghl_submissions_submitted_at ON ghl_submissions(submitted_at DESC);
CREATE INDEX idx_ghl_submissions_form_type ON ghl_submissions(form_type);
CREATE INDEX idx_ghl_submissions_synced ON ghl_submissions(synced_to_notion);

-- Registry Cache
CREATE TABLE registry_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  registry_name TEXT NOT NULL,
  registry_url TEXT NOT NULL,
  content JSONB NOT NULL,
  item_count INTEGER NOT NULL,
  last_synced TIMESTAMPTZ NOT NULL,
  sync_status TEXT NOT NULL,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_registry_cache_name ON registry_cache(registry_name);
CREATE INDEX idx_registry_cache_synced ON registry_cache(last_synced DESC);
```

2. **Update API endpoints** to use Supabase:

```typescript
import { createClient } from "@/lib/supabase/server";

// In webhook handler:
const supabase = createClient();
await supabase.from("ghl_submissions").insert({
  form_id: payload.formId,
  form_name: payload.formName,
  submission_id: payload.submissionId,
  // ... other fields
});
```

---

## Testing the Complete Flow

### Test 1: Registry Sync

1. **Navigate to dashboard**: `http://localhost:3000/admin/dashboard`
2. **Check "Registry Sync Status" section**
3. **Click "Sync Now" button**
4. **Verify**: All registries show "success" status with item counts

### Test 2: GoHighLevel Webhook

1. **Submit a test form** (e.g., Contact form on production site)
2. **Check server logs** for webhook receipt
3. **Verify Supabase**: Check `ghl_submissions` table for new entry
4. **Verify Notion**: Check Partnerships database for new page
5. **Check dashboard**: "GHL Form Activity" should show new submission

### Test 3: Deployment Monitoring

1. **Push a commit** to any ACT project repository
2. **Wait for Vercel deployment** to complete
3. **Refresh dashboard**: "Recent Deployments" should show new deployment
4. **Verify project card**: Last deployed date should update

---

## Production Deployment Checklist

- [ ] Update all `.env.local` variables in Vercel project settings
- [ ] Configure GoHighLevel webhooks to point to production URL
- [ ] Test webhook with production domain
- [ ] Verify Notion integration works with production credentials
- [ ] Set up Supabase tables in production database
- [ ] Test registry sync with production URLs
- [ ] Configure Vercel API with production team settings
- [ ] Add dashboard link to admin navigation
- [ ] Set up monitoring alerts (optional: Sentry, LogRocket)
- [ ] Document admin access procedures for team

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    ACT Hub (Main Site)                       │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │          Admin Dashboard (/admin/dashboard)             │ │
│  │                                                          │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │ │
│  │  │   Project    │  │   Registry   │  │  Deployment  │  │ │
│  │  │   Health     │  │    Sync      │  │   History    │  │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  │ │
│  │                                                          │ │
│  │  ┌──────────────┐  ┌──────────────┐                    │ │
│  │  │ GHL Forms    │  │   Metrics    │                    │ │
│  │  └──────────────┘  └──────────────┘                    │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
│  API Endpoints:                                               │
│  • /api/registry/status     → Registry sync status           │
│  • /api/registry/sync       → Manual sync trigger            │
│  • /api/dashboard/metrics   → Aggregate metrics              │
│  • /api/dashboard/projects  → Project health data            │
│  • /api/dashboard/deployments → Vercel deployments           │
│  • /api/dashboard/forms     → GHL form submissions           │
│  • /api/webhooks/ghl        → GHL webhook receiver           │
│                                                               │
└───────────────┬───────────────────────────────┬──────────────┘
                │                               │
                ▼                               ▼
    ┌───────────────────────┐       ┌───────────────────────┐
    │  External Registries  │       │  GoHighLevel Forms    │
    │                       │       │                       │
    │  • Empathy Ledger     │       │  • Contact            │
    │  • JusticeHub         │       │  • Farm Stay          │
    │  • Goods on Country   │       │  • CSA Interest       │
    │  • The Harvest        │       │  • Art Residency      │
    │  • ACT Farm           │       │  • Newsletter         │
    └───────────┬───────────┘       └───────────┬───────────┘
                │                               │
                ▼                               ▼
    ┌─────────────────────────────────────────────────────────┐
    │                    Supabase Database                     │
    │                                                           │
    │  • registry_cache          → Cached registry content     │
    │  • ghl_submissions         → Form submission log         │
    │  • (existing tables)       → Site content, media, etc.   │
    └───────────────────────────────────────────────────────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │   Notion Workspace    │
                    │                       │
                    │  • Partnerships       │
                    │  • Bookings           │
                    │  • CSA Members        │
                    │  • Residencies        │
                    └───────────────────────┘
```

---

## Next Steps

1. **Immediate** (Today):
   - [ ] Add dashboard link to admin navigation
   - [ ] Test registry sync locally
   - [ ] Review environment variable requirements

2. **Short-term** (This Week):
   - [ ] Set up GoHighLevel webhooks
   - [ ] Create Notion databases
   - [ ] Configure Vercel API access
   - [ ] Create Supabase tables

3. **Medium-term** (This Month):
   - [ ] Deploy to production
   - [ ] Test full webhook → Notion flow
   - [ ] Add real-time updates (WebSockets/SSE)
   - [ ] Implement email notifications
   - [ ] Create admin documentation

4. **Long-term** (Next Quarter):
   - [ ] Add advanced analytics
   - [ ] Build automated reporting
   - [ ] Create public-facing "ACT Master Plan" wiki
   - [ ] Implement role-based access control
   - [ ] Add AI-powered insights

---

## Troubleshooting

### Registry Sync Fails

**Symptom**: Registry shows "error" status

**Solutions**:
1. Check API token is correct in `.env.local`
2. Verify registry URL is accessible: `curl {REGISTRY_URL}`
3. Check for CORS issues (should be server-side only)
4. Review server logs for detailed error messages

### GHL Webhook Not Received

**Symptom**: Form submissions don't appear in dashboard

**Solutions**:
1. Verify webhook URL is correct in GHL settings
2. Check ngrok/localhost tunnel if testing locally
3. Review GHL webhook logs for delivery failures
4. Test with curl:
   ```bash
   curl -X POST http://localhost:3000/api/webhooks/ghl \
     -H "Content-Type: application/json" \
     -d '{"formId":"test","formName":"Test","contact":{"email":"test@example.com"}}'
   ```

### Notion Sync Fails

**Symptom**: `synced_to_notion` remains false

**Solutions**:
1. Verify Notion integration has access to databases
2. Check database IDs are correct
3. Ensure properties match expected schema
4. Review Notion API error messages in logs

### Vercel Deployments Not Showing

**Symptom**: "Recent Deployments" section empty

**Solutions**:
1. Verify `VERCEL_ACCESS_TOKEN` has correct permissions
2. Check `VERCEL_TEAM_ID` matches your team
3. Uncomment Vercel API code in deployments route
4. Test API directly:
   ```bash
   curl https://api.vercel.com/v6/deployments \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

---

## Support & Documentation

- **Master Plan**: See `ACT_MASTER_PLAN.md` for complete ecosystem overview
- **Codebase Structure**: See `CODEBASE_STRUCTURE.md`
- **ACT Brand Guide**: See `.claude/skills/act-brand-alignment/`
- **Notion MCP**: See `/Users/benknight/Code/ACT Notion MCP/README.md`

For questions or issues, contact:
- Ben Knight: benjamin@act.place
- Nic Marchesi: 0424 054 113
