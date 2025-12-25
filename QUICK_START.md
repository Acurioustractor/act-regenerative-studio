# ACT Ecosystem Dashboard - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: View the Dashboard

```bash
cd "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio"
npm run dev
```

Then open: **http://localhost:3000/admin/dashboard**

### Step 2: Test Registry Sync

On the dashboard:
1. Scroll to "Registry Sync Status" section
2. Click the **"Sync Now"** button
3. Watch as all 5 project registries are polled

You should see:
- ✅ Empathy Ledger - Success with item count
- ✅ JusticeHub - Success with item count
- ✅ Goods on Country - Success with item count
- ✅ The Harvest - Success with item count
- ✅ ACT Farm - Success with item count

### Step 3: Explore the Dashboard

The dashboard shows:

**Top Metrics**
- 6 active projects
- 5 registry connections (when synced)
- Deployments in last 24h (requires Vercel API setup)
- Form submissions in last 24h (requires GHL webhook setup)

**Project Health Cards**
- Status for all 6 ACT projects
- Links to GitHub and Vercel
- Last deployment dates
- Registry sync status

**Recent Deployments**
- Currently empty (requires Vercel API token)
- Will show deployment timeline once configured

**Form Activity**
- Currently empty (requires GHL webhook configuration)
- Will track all form submissions once configured

---

## 📋 What Works Right Now (No Config Needed)

### ✅ Registry Sync System

All environment variables for registries are already configured in `.env.local`:

```bash
EMPATHY_LEDGER_API_TOKEN=d35d4195fdbde06c018ee41289f47543d02aaf738f51b1b80efc46c06380ab14
JUSTICEHUB_API_TOKEN=jh_test_key_2024_empathy_ledger
HARVEST_API_TOKEN=94b1574a687ab83d2c56f752aa0fb9f51632f70a515c8e052b5365047c748e57
GOODS_REGISTRY_URL=https://goodsoncountry.netlify.app/registry.json
ACT_TRACTOR_API_TOKEN=act_hub_internal_token_2024
```

**Try it now:**
```bash
# Terminal test
curl http://localhost:3000/api/registry/status
```

You should see JSON with sync results from all 5 registries.

### ✅ Dashboard UI

Complete admin interface at `/admin/dashboard` with:
- Auto-refreshing metrics
- Live registry status
- Project health cards
- Deployment history (placeholder)
- Form activity tracking (placeholder)

### ✅ API Endpoints

Test all endpoints:

```bash
# Metrics
curl http://localhost:3000/api/dashboard/metrics

# Projects
curl http://localhost:3000/api/dashboard/projects

# Registry status
curl http://localhost:3000/api/registry/status

# Manual registry sync
curl -X POST http://localhost:3000/api/registry/sync
```

---

## ⚙️ What Needs Configuration

### 1. GoHighLevel Webhooks (~15 minutes)

**What you get**: Form submission tracking in dashboard

**Steps**:
1. Login to GoHighLevel
2. Settings → Integrations → Webhooks
3. Create webhook pointing to: `https://your-domain.com/api/webhooks/ghl`
4. Get form IDs from each form
5. Add to `.env.local`:
   ```bash
   CONTACT_FORM_ID=your_form_id_here
   FARM_STAY_BOOKING=your_form_id_here
   CSA_INTEREST=your_form_id_here
   ART_RESIDENCY=your_form_id_here
   NEWSLETTER_FORM_ID=your_form_id_here
   GOHIGHLEVEL_WEBHOOK_SECRET=your_secret_here
   ```

**Full guide**: See [DASHBOARD_IMPLEMENTATION_GUIDE.md - Phase 2](DASHBOARD_IMPLEMENTATION_GUIDE.md#phase-2-configure-gohighlevel-webhooks)

### 2. Vercel API (~5 minutes)

**What you get**: Live deployment monitoring in dashboard

**Steps**:
1. Go to https://vercel.com/account/tokens
2. Create new token
3. Copy your Team ID from team settings
4. Add to `.env.local`:
   ```bash
   VERCEL_ACCESS_TOKEN=your_token_here
   VERCEL_TEAM_ID=your_team_id_here
   ```
5. Uncomment Vercel API code in `src/app/api/dashboard/deployments/route.ts`

**Full guide**: See [DASHBOARD_IMPLEMENTATION_GUIDE.md - Phase 3](DASHBOARD_IMPLEMENTATION_GUIDE.md#phase-3-set-up-vercel-api-integration)

### 3. Notion Integration (~20 minutes)

**What you get**: Form submissions automatically create Notion pages

**Steps**:
1. Create 4 databases in Notion:
   - Partnerships
   - Bookings
   - CSA Members
   - Residency Applications
2. Get Notion integration token
3. Get database IDs
4. Add to `.env.local`:
   ```bash
   NOTION_API_KEY=your_token_here
   NOTION_PARTNERSHIPS_DATABASE_ID=your_db_id
   NOTION_BOOKINGS_DATABASE_ID=your_db_id
   NOTION_CSA_MEMBERS_DATABASE_ID=your_db_id
   NOTION_RESIDENCIES_DATABASE_ID=your_db_id
   ```

**Full guide**: See [DASHBOARD_IMPLEMENTATION_GUIDE.md - Phase 4](DASHBOARD_IMPLEMENTATION_GUIDE.md#phase-4-configure-notion-integration)

### 4. Supabase Tables (~10 minutes)

**What you get**: Persistent storage for form submissions and registry cache

**Steps**:
1. Open Supabase SQL Editor
2. Run this SQL:
   ```sql
   -- Form submissions
   CREATE TABLE ghl_submissions (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     form_id TEXT NOT NULL,
     form_type TEXT NOT NULL,
     submission_id TEXT UNIQUE NOT NULL,
     contact_name TEXT,
     contact_email TEXT,
     submitted_at TIMESTAMPTZ NOT NULL,
     synced_to_notion BOOLEAN DEFAULT FALSE,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );

   -- Registry cache
   CREATE TABLE registry_cache (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     registry_name TEXT NOT NULL,
     content JSONB NOT NULL,
     item_count INTEGER NOT NULL,
     last_synced TIMESTAMPTZ NOT NULL,
     sync_status TEXT NOT NULL
   );
   ```

**Full guide**: See [DASHBOARD_IMPLEMENTATION_GUIDE.md - Phase 5](DASHBOARD_IMPLEMENTATION_GUIDE.md#phase-5-set-up-supabase-tables-for-webhook-storage)

---

## 🧪 Testing

### Test Registry Sync
```bash
# Status check
curl http://localhost:3000/api/registry/status

# Manual sync
curl -X POST http://localhost:3000/api/registry/sync
```

### Test GHL Webhook
```bash
curl -X POST http://localhost:3000/api/webhooks/ghl \
  -H "Content-Type: application/json" \
  -d '{
    "formId": "test",
    "formName": "Contact Form",
    "contact": {"email": "test@example.com", "name": "Test User"},
    "submittedAt": "2025-12-23T00:00:00Z"
  }'
```

### Test Dashboard APIs
```bash
# All metrics
curl http://localhost:3000/api/dashboard/metrics

# Project health
curl http://localhost:3000/api/dashboard/projects

# Deployments
curl http://localhost:3000/api/dashboard/deployments

# Form activity
curl http://localhost:3000/api/dashboard/forms
```

---

## 📚 Full Documentation

### Comprehensive Guides

1. **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)**
   - Complete overview of what was built
   - File structure
   - Architecture diagram
   - Current status

2. **[DASHBOARD_IMPLEMENTATION_GUIDE.md](DASHBOARD_IMPLEMENTATION_GUIDE.md)**
   - Step-by-step setup for all integrations
   - Environment variable configuration
   - Webhook setup
   - Supabase schemas
   - Troubleshooting guide

3. **[ACT_MASTER_PLAN.md](ACT_MASTER_PLAN.md)**
   - Ecosystem architecture
   - Integration philosophy
   - Complete project details
   - Strategic roadmap

4. **[CODEBASE_STRUCTURE.md](CODEBASE_STRUCTURE.md)**
   - Two-codebase organization
   - File locations
   - When to use which directory

---

## 🎯 Priority Setup Order

**For immediate value** (do these first):

1. ✅ **Test the dashboard** (already works!)
   - Navigate to `/admin/dashboard`
   - Click "Sync Now" button
   - See all registries connect

2. **Set up Vercel API** (5 minutes)
   - Get live deployment monitoring
   - See deployment history

3. **Configure GHL webhooks** (15 minutes)
   - Track form submissions
   - See activity in dashboard

**For complete integration** (do these next):

4. **Create Supabase tables** (10 minutes)
   - Persistent form submission storage
   - Registry cache

5. **Set up Notion integration** (20 minutes)
   - Automatic page creation from forms
   - Complete workflow automation

---

## 🚨 Common Issues

### Registry sync shows errors

**Check**:
- API tokens are correct in `.env.local`
- Registry URLs are accessible
- No CORS issues (should be server-side)

**Fix**:
```bash
# Test each registry URL directly
curl -H "Authorization: Bearer YOUR_TOKEN" https://empathy-ledger-v2.vercel.app/api/registry
```

### Dashboard won't load

**Check**:
- Development server is running (`npm run dev`)
- You're logged in to admin (`/admin/login`)
- Your user has admin/editor role

**Fix**:
```bash
# Restart dev server
npm run dev

# Check Supabase profiles table for your user role
```

### GHL webhook not received

**Check**:
- Webhook URL in GoHighLevel is correct
- Using ngrok or similar for local testing
- Server logs show incoming request

**Fix**:
```bash
# For local testing, use ngrok
ngrok http 3000

# Update GHL webhook URL to ngrok URL
# Example: https://abc123.ngrok.io/api/webhooks/ghl
```

---

## 💡 Quick Tips

### Auto-refresh Intervals

- Metrics: 30 seconds
- Projects: 60 seconds
- Registries: 60 seconds
- Deployments: 30 seconds
- Forms: 60 seconds

### Registry Cache

Registries are cached for 60 seconds by default. Change in `.env.local`:
```bash
REGISTRY_REVALIDATE_SECONDS=60
```

### Manual Sync

Click "Sync Now" button in dashboard to force immediate registry sync.

### API Testing

All API endpoints return JSON and can be tested with:
- curl (command line)
- Postman
- Browser DevTools

---

## 🎉 What You Get

### After Full Setup

- **Real-time monitoring** of all 6 ACT projects
- **Automatic content aggregation** from all registries
- **Form submission tracking** from GoHighLevel
- **Deployment history** from Vercel
- **Notion automation** for all form submissions
- **Single dashboard view** of entire ACT ecosystem

### Dashboard Auto-Refreshes

Everything updates automatically:
- No page refresh needed
- Live status indicators
- Real-time metrics
- Instant deployment notifications

### Complete Ecosystem Visibility

See at a glance:
- Which projects are healthy
- Which registries are syncing
- Recent deployments across all sites
- Form submission activity
- Complete system status

---

## 🆘 Need Help?

**Documentation**:
- Full setup: [DASHBOARD_IMPLEMENTATION_GUIDE.md](DASHBOARD_IMPLEMENTATION_GUIDE.md)
- Architecture: [ACT_MASTER_PLAN.md](ACT_MASTER_PLAN.md)
- Summary: [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)

**Troubleshooting**:
- See [DASHBOARD_IMPLEMENTATION_GUIDE.md - Troubleshooting](DASHBOARD_IMPLEMENTATION_GUIDE.md#troubleshooting)

**Contact**:
- Ben Knight: benjamin@act.place
- Nic Marchesi: 0424 054 113

---

**Ready to start?** Just run `npm run dev` and open `/admin/dashboard` 🚀
