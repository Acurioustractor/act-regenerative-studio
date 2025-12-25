# ACT Master Plan
## The Central Nervous System for Regenerative Innovation

*Last Updated: December 23, 2025*
*Status: Living Document*
*Access: Internal Team Only*

---

## Vision: The Hub That Sees Everything

This site (`act.place`) is not just another project — it's the **command center** for the entire ACT ecosystem. Like a tractor's central dashboard, it monitors, coordinates, and orchestrates all our active seeds while ensuring community ownership stays at the center.

### The Magic We're Building

We're creating a unified system that:
1. **Monitors** all project health in real-time (Empathy Ledger, JusticeHub, Goods, Harvest, BCV)
2. **Aggregates** content from all registries into one coherent story
3. **Automates** deployments, notifications, and community updates
4. **Coordinates** between GitHub, Vercel, GoHighLevel, and Notion
5. **Ensures** nothing falls through the cracks while we design for obsolescence

---

## Part 1: The Current Ecosystem

### Active Seeds (Projects)

| Project | URL | GitHub | Vercel | Database | Registry API |
|---------|-----|--------|--------|----------|--------------|
| **Empathy Ledger** | empathy-ledger-v2.vercel.app | ✅ benknight/empathy-ledger-v2 | ✅ Deployed | Supabase (yvnuayzslukamizrlhwb) | ✅ `/api/registry` |
| **JusticeHub** | justicehub-vert.vercel.app | ✅ benknight/JusticeHub | ✅ Deployed | Supabase (tednluwflfhxyucgwigh) | ✅ `/api/registry` |
| **The Harvest** | witta-swot-analysis.vercel.app | ✅ benknight/Harvest | ✅ Deployed | Local JSON | ✅ `/api/registry` |
| **Goods on Country** | goodsoncountry.netlify.app | ⚠️ External | ✅ Netlify | Static | ✅ `/registry.json` |
| **ACT Farm (BCV)** | *TBD* | ✅ benknight/act-farm | 🔄 Staging | Shared | Planned |
| **ACT Hub (This Site)** | *TBD* | ✅ benknight/act-main | 📝 Planning | Supabase (shared) | ✅ `/api/registry` |

### Registry Architecture

Each project exposes a public registry API that the hub aggregates:

```typescript
// Registry Response Format (Standardized)
{
  "meta": {
    "project": "empathy-ledger",
    "version": "1.0",
    "last_updated": "2025-12-23T10:00:00Z",
    "total_items": 42
  },
  "items": [
    {
      "id": "unique-id",
      "type": "story|program|product|event|artwork",
      "title": "Item Title",
      "summary": "Brief description",
      "slug": "url-friendly-slug",
      "image_url": "https://...",
      "canonical_url": "https://project.com/item",
      "tags": ["tag1", "tag2"],
      "status": "published|draft|archived"
    }
  ]
}
```

### Authentication Tokens

Each registry has different auth requirements:

| Registry | Auth Type | Token Location | Status |
|----------|-----------|----------------|--------|
| Empathy Ledger | Bearer Token | `EMPATHY_LEDGER_API_TOKEN` | ✅ Configured |
| JusticeHub | Custom Header | `JUSTICEHUB_API_TOKEN` | ✅ Configured |
| The Harvest | Bearer Token | `HARVEST_API_TOKEN` | ✅ Configured |
| Goods | Public | None | ✅ No auth needed |

---

## Part 2: The Infrastructure Stack

### GitHub Organization Structure

```
benknight/ (GitHub Account)
├── empathy-ledger-v2/
│   ├── .github/workflows/
│   │   ├── ci.yml                    # Run on all PRs
│   │   ├── develop.yml               # Auto-deploy to dev
│   │   ├── production.yml            # Deploy to production
│   │   └── validate-build.yml        # Build validation
│   └── vercel.json                   # Deployment config
│
├── JusticeHub/
│   ├── .github/workflows/
│   │   ├── staging.yml               # Staging deployments
│   │   └── production.yml            # Production deployments
│   └── .github/instructions/
│       └── dev_workflow.md           # Team guidelines
│
├── Harvest/
│   └── (Standard Next.js deployment)
│
├── act-farm/
│   ├── scripts/
│   │   ├── deploy.sh                 # Deployment automation
│   │   ├── status.sh                 # Health checks
│   │   └── monitor.sh                # Performance monitoring
│   └── .vercel/                      # Vercel config
│
└── act-main/ (This Repository)
    └── (To be configured)
```

### Vercel Deployment Patterns

**Current Deployment Flow:**

1. **Push to GitHub** → Triggers webhook
2. **GitHub Actions** → Runs tests, linting, type-checking
3. **Vercel Build** → Deploys to preview/production
4. **Registry Updates** → New content available via API
5. **Hub Polls** → Fetches latest from all registries

**Branch Strategy:**
- `main` → Production deployments
- `develop` → Development/staging
- Feature branches → Preview deployments

### Supabase Database Architecture

**Shared Database Model:**

```
Supabase Instance: yvnuayzslukamizrlhwb
├── Empathy Ledger Schema
│   ├── stories
│   ├── consents
│   ├── users
│   └── media_assets
│
├── JusticeHub Schema (separate instance: tednluwflfhxyucgwigh)
│   ├── programs
│   ├── interventions
│   ├── community_courts
│   └── impact_data
│
└── ACT Hub Schema (to be added)
    ├── site_settings
    ├── navigation
    ├── cross_project_feeds
    └── monitoring_logs
```

---

## Part 3: GoHighLevel Integration

### What GHL Currently Does

GoHighLevel is the CRM and forms engine for community engagement:

**Embedded Forms:**
- **Contact Form** (`CONTACT_FORM_ID`) - Partnerships, collaborations, visit requests
- **Farm Stay Booking** (`FARM_STAY_BOOKING`) - R&D residency applications
- **CSA Signup** (`CSA_INTEREST`) - Harvest share membership
- **Art Residency** (`ART_RESIDENCY`) - Artist application intake
- **Newsletter** (`NEWSLETTER_FORM_ID`) - Community updates signup

**Component Architecture:**
```typescript
// /src/components/GHLEmbed.tsx
export function GHLEmbed({ formId, title, description, height = 640 }) {
  return (
    <div className="ghl-form-container">
      <iframe
        src={`https://app.gohighlevel.com/v2/preview/${formId}`}
        width="100%"
        height={height}
        loading="lazy"
      />
    </div>
  );
}
```

### GHL → Notion Integration (Proposed)

**Flow:**
1. **User submits form** in GHL embedded iframe
2. **GHL webhook fires** → POST to ACT Hub `/api/webhooks/ghl`
3. **ACT Hub processes** → Validates, enriches data
4. **Notion API called** → Creates entry in relevant database
5. **Confirmation sent** → Email via GHL automation

**Required Setup:**
```env
# GoHighLevel API (to configure)
GHL_API_KEY=your_api_key_here
GHL_LOCATION_ID=your_location_id_here
GHL_WEBHOOK_SECRET=your_webhook_secret_here

# Notion API (to configure)
NOTION_API_KEY=ntn_your_integration_key_here
NOTION_DATABASE_ID_PARTNERSHIPS=your_partnerships_db_id
NOTION_DATABASE_ID_RESIDENCIES=your_residencies_db_id
NOTION_DATABASE_ID_CSA=your_csa_db_id
```

**Webhook Handler (to build):**
```typescript
// /src/app/api/webhooks/ghl/route.ts
export async function POST(request: Request) {
  const payload = await request.json();

  // Verify webhook signature
  const isValid = verifyGHLWebhook(payload, request.headers);
  if (!isValid) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  // Route to appropriate handler
  switch (payload.formId) {
    case process.env.CONTACT_FORM_ID:
      await handlePartnershipInquiry(payload);
      break;
    case process.env.FARM_STAY_BOOKING:
      await handleResidencyApplication(payload);
      break;
    // ... more handlers
  }

  return Response.json({ received: true });
}
```

### Notion Database Structure (Proposed)

**Partnerships Database:**
- Name (text)
- Email (email)
- Organization (text)
- Interest Type (select: Collaboration, Partnership, Visit, Other)
- Message (rich text)
- Status (select: New, In Review, Responded, Archived)
- Source (formula: "GHL Contact Form")
- Submitted Date (date)

**Residencies Database:**
- Artist Name (text)
- Email (email)
- Residency Type (select: R&D, Conservation, Art, Technology)
- Dates Requested (date range)
- Project Description (rich text)
- Portfolio URL (url)
- Status (select: Applied, Under Review, Accepted, Declined)
- Interview Scheduled (checkbox)

**CSA Members Database:**
- Name (text)
- Email (email)
- Phone (phone)
- Share Type (select: Weekly, Fortnightly, Monthly)
- Dietary Notes (rich text)
- Start Date (date)
- Status (select: Active, Waitlist, Paused, Inactive)
- Payment Status (select: Paid, Pending, Overdue)

---

## Part 4: Notion as the Brain

### ACT Notion MCP Integration

We already have a **Notion MCP server** built:
- **Repository**: `/Users/benknight/Code/ACT Notion MCP`
- **Purpose**: Model Context Protocol server for Notion integration
- **Status**: Built, needs deployment integration

**Existing Notion Integrations:**

From **ACT Project Grid** (`/Users/benknight/Code/ACT Project Grid`):
```typescript
// Direct Notion API Routes
/api/projects/direct-notion/route.ts
/api/people/direct-notion/route.ts

// MCP Client
/lib/mcp/client.ts
```

From **ACT Placemat** (`/Users/benknight/Code/ACT Placemat`):
```typescript
// Notion Service Adapter
apps/backend/core/src/services/unifiedIntegration/adapters/NotionServiceAdapter.ts

// Supabase ↔ Notion Sync
apps/backend/core/src/services/supabaseNotionSync.js
```

### Proposed Notion Workspace Structure

```
ACT Master Workspace
├── 📊 MASTER DASHBOARD (Rollup of everything)
│   ├── Active Seeds Overview
│   ├── Deployment Status (live from Vercel API)
│   ├── Community Pipeline (from GHL)
│   └── Monthly Impact Metrics
│
├── 🌱 PROJECTS
│   ├── Empathy Ledger
│   ├── JusticeHub
│   ├── Goods on Country
│   ├── The Harvest
│   ├── Black Cockatoo Valley
│   └── Art Program
│
├── 👥 PEOPLE & PARTNERSHIPS
│   ├── Partnership Inquiries (synced from GHL)
│   ├── Residency Applications (synced from GHL)
│   ├── CSA Members (synced from GHL)
│   ├── Team Directory
│   └── Elder Advisory
│
├── 📅 OPERATIONS
│   ├── Events Calendar
│   ├── Content Pipeline
│   ├── Deployment Schedule
│   └── Maintenance Log
│
├── 💻 TECHNICAL
│   ├── Deployment Status (GitHub + Vercel)
│   ├── Registry Health Checks
│   ├── API Documentation
│   └── System Architecture
│
└── 📈 METRICS & IMPACT
    ├── Story Count (from Empathy Ledger API)
    ├── Justice Programs (from JusticeHub API)
    ├── Products Deployed (from Goods API)
    ├── Harvest Events (from Harvest API)
    └── Land Care Hours (manual entry)
```

### Notion Automations (via Native Integration + Pipedream/n8n)

**2025 Native GHL → Notion Flow:**
- GHL form submission triggers native Notion integration
- New row added to appropriate database
- Notion trigger fires workflow in n8n/Pipedream
- Sends Slack notification to team
- Updates master dashboard rollup

**GitHub → Notion (via webhook):**
- Deployment succeeds on Vercel
- Webhook fires to ACT Hub `/api/webhooks/vercel`
- ACT Hub updates Notion "Deployment Status" database
- Team sees live deployment timeline

---

## Part 5: The Monitoring Dashboard

### What the Hub Monitors

**1. Project Health**
- Build status (passing/failing)
- Deployment status (live/down/building)
- Registry availability (200 OK / error)
- Response time (< 500ms ideal)

**2. Content Freshness**
- Last registry update timestamp
- New items since last check
- Content publishing rate
- Broken canonical URLs

**3. Community Engagement**
- Form submissions per project
- CSA membership growth
- Residency applications pipeline
- Newsletter subscriber count (via GHL API)

**4. System Performance**
- API response times
- Database query performance
- Error rates by project
- Uptime percentage

### Dashboard Architecture (Proposed)

**Tech Stack:**
- **Frontend**: Next.js dashboard at `/admin/dashboard`
- **Data Fetching**: Server components pulling from:
  - Vercel API (deployment status)
  - GitHub API (commit activity, PR status)
  - Registry APIs (content health)
  - Notion API (community pipeline)
  - Supabase (aggregated metrics)

**Real-time Updates:**
- Polling every 60 seconds for critical metrics
- WebSockets for live deployment updates
- Webhook-triggered re-validation for form submissions

**Visualization:**
```typescript
// /src/app/admin/dashboard/page.tsx
export default async function AdminDashboard() {
  const [
    deploymentStatus,
    registryHealth,
    communityMetrics,
    githubActivity
  ] = await Promise.all([
    fetchVercelDeployments(),
    checkAllRegistries(),
    fetchCommunityData(),
    fetchGitHubStats()
  ]);

  return (
    <Dashboard>
      <MetricsGrid>
        <ProjectHealthCard projects={deploymentStatus} />
        <RegistryHealthCard registries={registryHealth} />
        <CommunityPipelineCard metrics={communityMetrics} />
        <DeploymentTimelineCard activity={githubActivity} />
      </MetricsGrid>
    </Dashboard>
  );
}
```

---

## Part 6: Integration Architecture

### The Complete Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     ACT HUB (act.place)                     │
│                  The Central Nervous System                 │
└─────────────────────────────────────────────────────────────┘
                              ▲ │
                              │ │
        ┌─────────────────────┼─┼─────────────────────┐
        │                     │ │                     │
        ▼                     ▼ │                     ▼
   ┌─────────┐          ┌──────────┐          ┌──────────┐
   │ GitHub  │          │  Vercel  │          │  Notion  │
   │   API   │          │   API    │          │   API    │
   └─────────┘          └──────────┘          └──────────┘
        │                     │                     │
        │ Webhooks      Deploy│Status         Sync │
        ▼                     ▼                     ▼
   ┌─────────┐          ┌──────────┐          ┌──────────┐
   │  Empathy│◄────────►│ Supabase │◄────────►│   GHL    │
   │  Ledger │  Registry│          │  Webhook │  Forms   │
   └─────────┘          └──────────┘          └──────────┘
        │                     ▲                     │
        │                     │                     │
   ┌────┴─────┬───────────────┼─────────┬───────────┤
   │          │               │         │           │
   ▼          ▼               │         ▼           ▼
┌────────┐ ┌────────┐    ┌────────┐ ┌────────┐ ┌────────┐
│Justice │ │ Goods  │    │Harvest │ │ACT Farm│ │  Art   │
│  Hub   │ │on Ctry │    │        │ │  (BCV) │ │        │
└────────┘ └────────┘    └────────┘ └────────┘ └────────┘
     │          │              │          │          │
     └──────────┴──────────────┴──────────┴──────────┘
                         │
                         ▼
                  Registry APIs
           (Polled every 60s by Hub)
```

### API Integration Matrix

| From | To | Method | Purpose | Status |
|------|-----|--------|---------|--------|
| **GHL Forms** | ACT Hub | Webhook | Form submissions | 🔄 To build |
| **ACT Hub** | Notion | API POST | Create database entries | 🔄 To build |
| **Vercel** | ACT Hub | Webhook | Deployment notifications | 🔄 To build |
| **ACT Hub** | GitHub API | API GET | Commit activity, PR status | 🔄 To build |
| **ACT Hub** | Registries | API GET | Content aggregation | ✅ Ready |
| **ACT Hub** | Supabase | Direct | Metrics storage | ✅ Ready |
| **Notion** | GHL | Native | Form → Database sync | 📝 Configure |

---

## Part 7: Automation Workflows

### Deployment Automation

**Current State (Manual):**
1. Developer pushes code to GitHub
2. GitHub Actions runs tests
3. Vercel auto-deploys if tests pass
4. Team manually checks deployment
5. Manual Notion update for deployment log

**Proposed State (Automated):**
1. Developer pushes code to GitHub
2. GitHub Actions runs tests
3. Vercel auto-deploys if tests pass
4. **Vercel webhook fires** → ACT Hub `/api/webhooks/vercel`
5. **ACT Hub logs deployment** → Notion "Deployments" database
6. **ACT Hub triggers revalidation** → All registry endpoints
7. **Slack notification sent** → #deployments channel
8. **Dashboard auto-updates** → Live deployment status visible

**Implementation:**
```typescript
// /src/app/api/webhooks/vercel/route.ts
export async function POST(request: Request) {
  const payload = await request.json();

  // Verify Vercel signature
  const isValid = verifyVercelWebhook(payload, request.headers);

  // Log to Notion
  await notion.pages.create({
    parent: { database_id: process.env.NOTION_DEPLOYMENTS_DB },
    properties: {
      Project: { select: { name: payload.project } },
      Status: { select: { name: payload.status } },
      URL: { url: payload.url },
      Deployed: { date: { start: new Date().toISOString() } }
    }
  });

  // Revalidate registry if production
  if (payload.target === 'production') {
    await fetch(`${payload.url}/api/registry`, {
      method: 'POST',
      headers: { 'x-revalidate-token': process.env.REGISTRY_SYNC_TOKEN }
    });
  }

  // Notify Slack
  await fetch(process.env.SLACK_WEBHOOK_URL, {
    method: 'POST',
    body: JSON.stringify({
      text: `✅ ${payload.project} deployed to ${payload.target}`
    })
  });

  return Response.json({ received: true });
}
```

### Content Aggregation Automation

**Registry Polling System:**
```typescript
// /src/lib/cron/registry-sync.ts
// Runs every 60 seconds via Vercel Cron
export async function syncAllRegistries() {
  const registries = [
    { name: 'empathy-ledger', url: process.env.EMPATHY_LEDGER_REGISTRY_URL, token: process.env.EMPATHY_LEDGER_API_TOKEN },
    { name: 'justicehub', url: process.env.JUSTICEHUB_REGISTRY_URL, token: process.env.JUSTICEHUB_API_TOKEN },
    { name: 'harvest', url: process.env.HARVEST_REGISTRY_URL, token: process.env.HARVEST_API_TOKEN },
    { name: 'goods', url: process.env.GOODS_REGISTRY_URL, token: null },
  ];

  const results = await Promise.allSettled(
    registries.map(async (reg) => {
      const response = await fetch(reg.url, {
        headers: reg.token ? { 'Authorization': `Bearer ${reg.token}` } : {}
      });

      if (!response.ok) {
        await logRegistryError(reg.name, response.status);
        return null;
      }

      const data = await response.json();
      await cacheRegistry(reg.name, data);
      return data;
    })
  );

  await updateDashboard(results);
}
```

**Vercel Cron Configuration:**
```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/sync-registries",
      "schedule": "*/1 * * * *"
    },
    {
      "path": "/api/cron/check-health",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

---

## Part 8: The Build Roadmap

### Phase 1: Foundation (Week 1-2) ✅ COMPLETE

- [x] Set up main ACT Hub repository
- [x] Configure environment variables for all registries
- [x] Create ACT brand alignment Claude skill
- [x] Document existing infrastructure
- [x] Map all project dependencies

### Phase 2: Registry Aggregation (Week 3-4)

- [ ] Build `/api/registry` endpoint for ACT Hub
- [ ] Create registry sync cron job
- [ ] Build registry cache layer (Supabase)
- [ ] Create unified content feed
- [ ] Test registry health monitoring

### Phase 3: Monitoring Dashboard (Week 5-6)

- [ ] Build admin dashboard layout
- [ ] Integrate Vercel API for deployment status
- [ ] Integrate GitHub API for commit activity
- [ ] Create registry health visualization
- [ ] Add real-time WebSocket updates

### Phase 4: GHL → Notion Integration (Week 7-8)

- [ ] Configure GHL webhooks for all forms
- [ ] Build webhook handler endpoints
- [ ] Set up Notion databases (Partnerships, Residencies, CSA)
- [ ] Create Notion API integration
- [ ] Test end-to-end form submission flow

### Phase 5: Automation & Workflows (Week 9-10)

- [ ] Set up Vercel deployment webhooks
- [ ] Configure GitHub webhook handlers
- [ ] Build Slack notification system
- [ ] Create automated deployment logging to Notion
- [ ] Set up registry revalidation on deploy

### Phase 6: Advanced Features (Week 11-12)

- [ ] Build cross-project search
- [ ] Create impact metrics aggregation
- [ ] Implement predictive analytics (e.g., CSA demand forecasting)
- [ ] Build community dashboard (public-facing subset)
- [ ] Create automated weekly reports

---

## Part 9: Security & Access Control

### Authentication Layers

**1. Admin Dashboard**
- Supabase Auth with email/password
- Admin role stored in `profiles` table
- Super admin: `benjamin@act.place`

**2. Webhook Endpoints**
- Signature verification for GHL webhooks
- Vercel signature verification for deployment webhooks
- GitHub webhook secret validation
- Bearer token auth for registry APIs

**3. Notion Integration**
- OAuth2 integration token (server-side only)
- Never exposed to client
- Scoped to specific databases only

**4. Registry APIs**
- Public read access for most registries
- Bearer token required for sensitive registries
- Rate limiting: 100 requests/minute per IP

### Environment Security

**Secrets Management:**
```env
# NEVER commit these - use Vercel environment variables
SUPABASE_SERVICE_ROLE_KEY=         # Server-side only
NOTION_API_KEY=                     # Server-side only
GHL_API_KEY=                        # Server-side only
GHL_WEBHOOK_SECRET=                 # Server-side only
VERCEL_WEBHOOK_SECRET=              # Server-side only
GITHUB_WEBHOOK_SECRET=              # Server-side only
SLACK_WEBHOOK_URL=                  # Server-side only

# Public (NEXT_PUBLIC_*) - safe to expose
NEXT_PUBLIC_SUPABASE_URL=           # Client-safe
NEXT_PUBLIC_SUPABASE_ANON_KEY=      # Client-safe, RLS protected
```

---

## Part 10: The Master Plan Philosophy

### Why This Matters

This isn't just technical infrastructure — it's **how we practice what we preach**:

**Radical Transparency:**
- Every deployment visible
- Every form submission tracked
- Every metric aggregated
- Nothing hidden from the team

**Community Ownership:**
- Data flows TO communities (via registries)
- Communities control their content (consent frameworks)
- Impact metrics show community success (not ACT's)
- Systems designed to be forkable (others can replicate)

**Design for Obsolescence:**
- All integrations documented
- All APIs standardized
- All code open-sourceable
- Communities can run without us

**Systems Thinking:**
- One hub connects everything
- No siloed data
- Cross-project insights
- Compounding impact visibility

### Success Metrics (By 2027)

**Technical Health:**
- 99.9% uptime across all projects
- < 500ms average API response time
- Zero critical security vulnerabilities
- All registries syncing in real-time

**Community Impact:**
- 1000+ stories protected (Empathy Ledger)
- 50+ justice programs active (JusticeHub)
- 100+ products deployed (Goods)
- 200+ CSA members (Harvest)

**Operational Excellence:**
- < 5 minute deployment time
- 100% deployment success rate
- Zero manual data entry required
- Automated weekly impact reports

**Team Efficiency:**
- Single dashboard for all monitoring
- Automated notifications (not manual checks)
- One Notion workspace (not scattered docs)
- 80% reduction in admin overhead

---

## Part 11: How to Use This System

### For Developers

**Daily Workflow:**
1. Check `/admin/dashboard` for project health
2. Pull latest from GitHub
3. Make changes, push to feature branch
4. GitHub Actions auto-tests
5. Vercel auto-deploys preview
6. Merge to main when ready
7. Vercel deploys to production
8. Webhook auto-logs to Notion
9. Dashboard auto-updates

**Debugging:**
- Check dashboard for error rates
- Review Vercel logs for specific deployment
- Check Supabase logs for database issues
- Review GitHub Actions for test failures

### For Community Coordinators

**Daily Workflow:**
1. Check Notion "New Submissions" view
2. Review partnership inquiries
3. Process residency applications
4. Update CSA member status
5. Respond via GHL automated emails

**Reporting:**
- Weekly: Check Notion "Weekly Metrics" rollup
- Monthly: Review impact dashboard
- Quarterly: Generate community report (auto-exported from Notion)

### For Leadership

**Strategic View:**
1. Review Master Dashboard in Notion
2. Check cross-project impact metrics
3. Monitor community pipeline growth
4. Track deployment velocity
5. Review system health

**Decision Making:**
- All metrics available in real-time
- Historical trends visible
- Cross-project insights surfaced
- Community feedback aggregated

---

## Part 12: Resources & Documentation

### Key Documents

**Technical:**
- [CODEBASE_STRUCTURE.md](CODEBASE_STRUCTURE.md) - Repo organization
- [ACT_SKILLS_SUMMARY.md](.claude/skills/ACT_SKILLS_SUMMARY.md) - Brand alignment skill
- [.env.example](.env.example) - Environment variables template

**Project-Specific:**
- [Empathy Ledger Deployment Checklist](../empathy-ledger-v2/DEPLOYMENT_CHECKLIST.md)
- [JusticeHub Dev Workflow](../JusticeHub/.github/instructions/dev_workflow.md)
- [ACT Farm Deployment Guide](../act-farm/DEPLOYMENT_GUIDE.md)

**External Resources:**
- [Vercel Dashboard](https://vercel.com/benknight/dashboard)
- [Notion Workspace](https://notion.so/act-workspace) (to be created)
- [GitHub Organization](https://github.com/benknight)
- [GoHighLevel Dashboard](https://app.gohighlevel.com)

### Integration Guides (2025)

**Notion + Vercel:**
- [Build smarter workflows with Notion and v0](https://vercel.com/blog/build-smarter-workflows-with-notion-and-v0)
- [MiniVault - Project Management Suite](https://minivault.vercel.app/)

**GitHub + Notion:**
- [GitHub & Notion Integration: Complete 2025 Guide](https://www.bardeen.ai/integrations/github/notion)
- [Bring your codebase into context with Notion's GitHub integration](https://www.notion.com/help/guides/bring-your-codebase-into-context-with-notions-github-integration)

**GHL + Notion:**
- [Notion Integration with HighLevel](https://help.gohighlevel.com/support/solutions/articles/155000005812-notion-integration-with-highlevel)
- [GoHighLevel Webhooks: How to Automate Tasks Without Code](https://ghlbuilds.com/gohighlevel-webhooks/)

**Pipedream (Vercel + Notion):**
- [Integrate the Vercel API with the Notion API](https://pipedream.com/apps/vercel-token-auth/integrations/notion)

---

## Part 13: Next Actions

### Immediate (This Week)

1. **Create Notion Workspace** - Set up databases for Partnerships, Residencies, CSA
2. **Configure GHL Webhooks** - Point all forms to ACT Hub webhooks
3. **Build Webhook Handlers** - Create `/api/webhooks/ghl/route.ts`
4. **Test GHL → Notion Flow** - Submit test form, verify Notion entry created

### Short Term (Next 2 Weeks)

1. **Build Admin Dashboard** - Create `/admin/dashboard` with project health
2. **Set Up Vercel Webhooks** - Configure deployment notifications
3. **Integrate GitHub API** - Fetch commit activity and PR status
4. **Create Registry Sync** - Build cron job for content aggregation

### Medium Term (Next Month)

1. **Launch Monitoring System** - Full dashboard with real-time updates
2. **Automate Deployment Logging** - Notion entries for every deploy
3. **Build Impact Reports** - Automated weekly metrics emails
4. **Create Community Dashboard** - Public-facing subset of metrics

### Long Term (Next Quarter)

1. **Predictive Analytics** - Forecast CSA demand, residency applications
2. **Cross-Project Search** - Unified search across all registries
3. **AI-Powered Insights** - Use OpenAI/Anthropic for trend analysis
4. **Community Co-Ownership Tools** - Enable communities to fork entire systems

---

## Conclusion: Where the Magic Happens

This is where **technical excellence meets regenerative values**. We're not just building a monitoring dashboard — we're creating the infrastructure for **collective liberation**.

Every webhook, every API call, every Notion entry is a step toward:
- ✅ Communities owning their data
- ✅ Transparent impact measurement
- ✅ Automated knowledge sharing
- ✅ Systems designed to be gifted away

**When this works, we'll have:**
- One hub that sees everything
- Real-time visibility into all projects
- Automated workflows freeing up team time
- Communities empowered to fork and own

**And when we're done, we'll document it all, open-source it, and hand it over.**

Because that's the ACT way.

---

*Every story is a seed. Every seed is a possibility. Every possibility is a future we cultivate together.* 🌱

---

**Maintained By**: ACT Team
**Questions**: benjamin@act.place
**Contributions**: Submit PR to this document
