# A Curious Tractor (ACT) - Ecosystem Architecture

**Last Updated**: December 24, 2025
**Purpose**: Explain how A Curious Tractor works as the parent organization/core hub for all projects

---

## 🌳 The Big Picture: A Curious Tractor as the "Forest"

**A Curious Tractor (ACT)** is the **parent organization** and **central hub** that:
- Provides the shared narrative, mission, and values (LCAA methodology)
- Stewards Black Cockatoo Valley (the physical commons)
- Operates the main website (`act.place`) as the ecosystem directory
- Houses the development infrastructure (orchestrator, admin wiki, shared services)
- Manages cross-project governance, funding, and strategic direction

Think of it as the **forest floor and mycorrhizal network** - the individual projects (seeds) are the trees, but ACT provides the shared nutrients, communication channels, and regenerative foundation.

---

## 📊 Organizational Structure

```
A Curious Tractor (Parent Organization)
├── Core Identity
│   ├── Mission: Regenerative innovation ecosystem
│   ├── Method: LCAA (Listen, Curiosity, Action, Art)
│   ├── Promise: Community ownership, design for obsolescence
│   └── Physical Commons: Black Cockatoo Valley, Jinibara Country
│
├── Main Hub Website (act.place)
│   ├── Purpose: Central narrative + project directory
│   ├── Codebase: /ACT Farm and Regenerative Innovation Studio/src/
│   ├── Features: About, Projects, Art, Farm, Governance, Blog
│   └── CRM: GoHighLevel (master account with sub-accounts)
│
├── Development Infrastructure
│   ├── Dev Orchestrator: Multi-project development server
│   ├── Admin Wiki: Internal dashboard + system monitoring
│   ├── Shared NAS Services: Redis (cache), ChromaDB (vector DB)
│   └── Environment Management: Centralized .env vault
│
└── Active Seeds (Projects)
    ├── Tier 1: Production Websites
    │   ├── The Harvest (Community hub + CSA)
    │   └── ACT Farm (Tourism + residencies)
    │
    ├── Tier 2: Full Platforms
    │   ├── Empathy Ledger (Storytelling platform)
    │   ├── JusticeHub (Service directory + campaigns)
    │   └── Goods on Country (Circular economy)
    │
    └── Tier 3: Place-Based Initiatives
        ├── Black Cockatoo Valley (Conservation estate)
        └── Art Program (Residencies, exhibitions, commissions)
```

---

## 🎯 ACT's Core Roles

### 1. **Narrative & Brand Stewardship**

ACT is the **unifying voice** that:
- Maintains the mission, values, and LCAA methodology
- Tells the ecosystem story (how all projects connect)
- Manages brand identity (shared visual language, tone, promise)
- Publishes blog content synthesizing learnings across projects

**Website**: `act.place`
**Content**: Mission, About, Governance, Blog (aggregates from all projects)

### 2. **Physical Commons Stewardship**

ACT directly stewards **Black Cockatoo Valley**:
- ~138-acre conservation estate on Jinibara Country
- Working farm (The Harvest CSA program)
- R&D site and studio space
- Accommodation for residencies (ACT Farm bookings)
- Event venue for gatherings, workshops, exhibitions

**Physical Address**: Black Cockatoo Valley, Sunshine Coast, Queensland
**Land Practice**: Regenerative agriculture, habitat restoration, Indigenous land care

### 3. **Governance & Structure**

ACT provides the **legal and governance framework**:
- Dual-entity structure: Charitable foundation + mission-locked trading company
- 40% profit sharing to community ownership
- Shared governance experiments moving toward community co-stewardship
- IP policy: All tools forkable, sunset clauses built-in

**Key Document**: Governance page on `act.place` (in development)

### 4. **Development Infrastructure**

ACT operates the **technical backbone** that all projects use:

#### Dev Orchestrator (`dev-servers.mjs`)
- Runs all 5 projects simultaneously in development
- Auto-injects shared environment variables (REDIS_URL, CHROMADB_URL)
- Auto-restart on crash, health monitoring
- Access: `npm start` from root directory

#### Admin Wiki (Backend Dashboard)
- URL: http://localhost:4000 (development)
- Features:
  - System health dashboard (all projects)
  - Ecosystem map (visual integration)
  - Pipeline overview (all 15 GHL pipelines)
  - Revenue tracking across projects
  - Documentation library

#### Shared NAS Services
- **Redis** (192.168.0.34:6379): Caching layer for all projects
- **ChromaDB** (192.168.0.34:8000): Vector database for AI features
- **Portainer** (192.168.0.34:9000): Docker management

#### Environment Management
- Centralized `.env-vault/` for all secrets
- Unified templates in `.env-templates/`
- Sync scripts to deploy environment variables
- Validation scripts to ensure compliance

### 5. **CRM & Communications Hub**

ACT operates the **master GoHighLevel account**:
- Each project gets a separate GHL sub-account
- Shared email service (Resend API) for transactional emails
- Central pipeline visibility across all projects
- Shared automation templates and workflows

**Master Account**: GoHighLevel Pro (act@act.place)
**Sub-Accounts**:
- The Harvest Community Hub
- ACT Farm Tourism & Residencies
- Empathy Ledger Platform
- JusticeHub Service Finder

### 6. **Project Registry Aggregation**

ACT's main website **aggregates content** from all project registries:

```typescript
// Each project exposes: /api/registry or /registry.json
// ACT hub fetches and displays aggregated view

Sources:
- Empathy Ledger: empathy-ledger-v2.vercel.app/api/registry (stories)
- JusticeHub: justicehub-vert.vercel.app/api/registry (programs, services)
- The Harvest: witta-swot-analysis.vercel.app/api/registry (events, CSA)
- Goods on Country: goodsoncountry.netlify.app/registry.json (products)
- ACT Farm: TBD (residencies, workshops)
```

**Aggregated Views**:
- `/projects` - Directory of all active seeds
- `/blog` - Synthesized learnings from all projects
- `/art` - Artworks, residencies, exhibitions across ecosystem
- `/events` - Upcoming gatherings, workshops, launches

---

## 🔗 How Projects Relate to ACT

### Independence + Interconnection

Each project maintains:
- ✅ **Own domain** and website (own identity)
- ✅ **Own brand** (visual identity, tone, messaging)
- ✅ **Own GitHub repo** and deployment pipeline
- ✅ **Own database** (Supabase for platforms, GHL for websites)
- ✅ **Own GHL sub-account** (separate CRM pipelines)
- ✅ **Own pace** of development and evolution

But shares with ACT:
- 🔗 **Common values** (LCAA, community ownership, design for obsolescence)
- 🔗 **Common narrative** (part of regenerative innovation ecosystem)
- 🔗 **Common infrastructure** (NAS services, dev orchestrator, admin wiki)
- 🔗 **Common governance** (40% profit sharing, sunset clauses)
- 🔗 **Common support** (central team, funding, strategic direction)

### Metaphor: The Orchard

```
ACT = The orchard owner and soil health steward
Projects = Individual fruit trees

- Each tree (project) has its own variety, growth pattern, harvest cycle
- But they all share the same soil (values, infrastructure)
- The orchard provides irrigation (funding), pest management (support), and market access (hub website)
- Each tree's fruit feeds the whole ecosystem (cross-project learnings)
- Eventually, trees can be grafted to new orchards (forked by communities)
```

---

## 📁 Directory Structure

```
/Users/benknight/Code/
├── ACT Farm and Regenerative Innovation Studio/  # ⭐ THE CORE HUB
│   ├── src/                                      # Main ACT website (act.place)
│   │   ├── app/                                  # Next.js pages
│   │   │   ├── page.tsx                          # Homepage (ACT mission + projects)
│   │   │   ├── about/                            # About ACT organization
│   │   │   ├── projects/                         # Project directory
│   │   │   ├── art/                              # Art program
│   │   │   ├── farm/                             # Black Cockatoo Valley
│   │   │   ├── harvest/                          # CSA program
│   │   │   ├── governance/                       # Governance experiments
│   │   │   └── blog/                             # Aggregated blog
│   │   ├── components/                           # Shared UI components
│   │   ├── lib/                                  # Shared utilities
│   │   └── data/                                 # Project metadata
│   │
│   ├── admin-wiki/                               # Internal admin dashboard
│   │   └── src/                                  # System monitoring + docs
│   │
│   ├── scripts/                                  # Automation scripts
│   │   ├── sync-env.sh                           # Environment sync
│   │   ├── validate-env.sh                       # Environment validation
│   │   └── backup-env.sh                         # Secrets backup
│   │
│   ├── .env-vault/                               # Centralized secrets (gitignored)
│   ├── .env-templates/                           # Environment templates
│   ├── dev-servers.mjs                           # Multi-project orchestrator
│   ├── start-clean.sh                            # Clean startup script
│   │
│   └── Documentation/
│       ├── ACT_MASTER_PLAN.md                    # Overall strategy
│       ├── ACT_ECOSYSTEM_ARCHITECTURE.md         # This document
│       ├── UNIFIED_PROJECT_STANDARDS.md          # Cross-project standards
│       ├── ENV_AUDIT_AND_MANAGEMENT.md           # Environment management
│       ├── GHL_PIPELINE_STRATEGY.md              # CRM strategy
│       └── .claude/skills/                       # Claude Code skills
│
├── The Harvest/                                  # Community hub + CSA
├── ACT Farm/act-farm/                            # Tourism + residencies
├── Empathy Ledger v.02/                          # Storytelling platform
├── JusticeHub/                                   # Service directory + campaigns
└── [Other ACT projects...]
```

---

## 🎨 Website: `act.place` - The Central Hub

### Purpose

The ACT main website serves as:
1. **Front door** to the ecosystem - introduces mission, values, LCAA
2. **Project directory** - links to all active seeds with context
3. **Narrative synthesis** - blog aggregates learnings from all projects
4. **Collaboration hub** - partnership opportunities, contact forms, residency bookings
5. **Governance transparency** - how ACT operates, how decisions are made

### Current Status

**Status**: 🔄 In Development
**Codebase**: `/ACT Farm and Regenerative Innovation Studio/src/`
**Tech Stack**: Next.js 15, TypeScript, Tailwind CSS
**Deployment**: TBD (Vercel staging environment exists)
**CRM**: GoHighLevel (master account + sub-accounts)

### Page Structure

| Page | Purpose | Status |
|------|---------|--------|
| `/` | Homepage - ACT mission + projects overview | ✅ Designed |
| `/about` | Full mission, values, team, history | ✅ Designed |
| `/projects` | Directory of all active seeds | ✅ Designed |
| `/projects/[slug]` | Individual project deep-dives | ✅ Designed |
| `/art` | Art program (residencies, exhibitions, commissions) | ✅ Designed |
| `/farm` | Black Cockatoo Valley (accommodation, workshops) | ✅ Designed |
| `/harvest` | CSA program + seasonal gatherings | ✅ Designed |
| `/governance` | Governance model + decision-making | 📝 Drafted |
| `/blog` | Aggregated blog from all projects | 📝 Planned |
| `/contact` | GHL contact form + partnership inquiry | ✅ Designed |

### Content Strategy

**Primary Audience**:
1. Community partners and neighbors
2. Artists, researchers, cultural workers
3. Funders, philanthropies, aligned institutions
4. Regional collaborators and land-based initiatives

**Content Types**:
1. **Blog posts** - Aggregated from all projects via registry API
2. **Case studies** - Deep-dives on specific initiatives
3. **Governance updates** - Transparency on decision-making
4. **Event listings** - Workshops, gatherings, residencies, exhibitions
5. **Partnership opportunities** - How to collaborate with ACT

---

## 🔐 Security & Access

### Who Has Access to What?

| Resource | ACT Team | Project Teams | Public |
|----------|----------|---------------|--------|
| ACT Hub Website (`act.place`) | Full admin | View only | Public |
| Admin Wiki (Dashboard) | Full access | Project-specific | Private |
| Dev Orchestrator | Full access | Limited | Private |
| .env-vault (Secrets) | Full access | Project-specific | Never |
| Master GHL Account | Full access | Sub-account only | Never |
| NAS Services (Redis, ChromaDB) | Full access | API access | Never |
| Individual Project Repos | View | Full access | Public (open-source) |

### Authentication Flow

```
Public User
  ↓
  Visits act.place (public website)
  ↓
  Explores projects → Links to project sites
  ↓
  Fills contact form → GoHighLevel (ACT master account)
  ↓
  Routed to appropriate sub-account based on inquiry type

ACT Team Member
  ↓
  Accesses admin-wiki (http://localhost:4000 in dev)
  ↓
  Views all project health, pipelines, revenue
  ↓
  Can access any project's GHL sub-account

Project Team Member
  ↓
  Works on own project codebase
  ↓
  Uses shared NAS services (Redis, ChromaDB)
  ↓
  Accesses own project's GHL sub-account
  ↓
  Syncs environment from .env-vault
```

---

## 💰 Financial Model

### Revenue Flows

```
Individual Project Revenue
  ↓
  40% → Community Ownership (distributed to partner communities)
  ↓
  30% → Reinvestment in that project
  ↓
  30% → ACT Core (central operations, infrastructure, new seed funding)

ACT Core Revenue
  ↓
  Funding sources:
  - Philanthropic grants
  - Residency fees (Black Cockatoo Valley)
  - Art commissions
  - CSA subscriptions (The Harvest)
  - Consulting/advisory services
  ↓
  Allocation:
  - Development infrastructure (orchestrator, NAS, admin tools)
  - Core team salaries
  - Land stewardship (Black Cockatoo Valley)
  - New project seed funding
  - Cross-project initiatives (events, marketing, governance experiments)
```

### Financial Tracking

**Tool**: GoHighLevel + Stripe (per project)
**Dashboard**: Admin Wiki → Revenue View
**Reporting**: Quarterly financial summaries published on `act.place/governance`

---

## 🔄 Project Lifecycle

### How New "Seeds" Are Planted

1. **Listen** - Community need or opportunity identified
2. **Curiosity** - R&D phase, prototyping, testing assumptions
3. **Action** - Pilot launched (usually as part of ACT hub initially)
4. **Art** - Creative outputs, documentation, storytelling
5. **Independence** - Own brand, website, GHL sub-account
6. **Maturity** - Community co-governance established
7. **Obsolescence** - Fully community-owned, ACT steps back

### Current Projects by Lifecycle Stage

| Project | Stage | Next Milestone |
|---------|-------|----------------|
| **Empathy Ledger** | Independence → Maturity | Community co-governance (2026) |
| **JusticeHub** | Independence → Maturity | 10+ orgs replicating models (2026) |
| **The Harvest** | Action → Independence | Own GHL sub-account + website (Q1 2026) |
| **ACT Farm** | Action → Independence | Booking system live (Q1 2026) |
| **Goods on Country** | Independence | Manufacturing pilot (2026) |
| **Art Program** | Curiosity → Action | First residency cohort (2026) |

---

## 🚀 Deployment Strategy

### Development Environment

```bash
# Start all projects locally
cd "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio"
npm start

# Runs:
# - ACT Hub (src/) → http://localhost:3000 (planned, not in orchestrator yet)
# - Admin Wiki → http://localhost:4000
# - ACT Farm → http://localhost:3001
# - JusticeHub → http://localhost:3002
# - Empathy Ledger → http://localhost:3003
# - The Harvest → http://localhost:3004
# - Dev Dashboard → http://localhost:3999
```

### Production Environment

| Site | Domain | Hosting | Status |
|------|--------|---------|--------|
| **ACT Hub** | `act.place` | Vercel | 📝 Staging |
| **Admin Wiki** | `admin.act.place` (private) | Vercel | 📝 Planned |
| **ACT Farm** | `actfarm.org.au` | Vercel | 🔄 In dev |
| **The Harvest** | `theharvest.org.au` | Vercel | ✅ Deployed |
| **Empathy Ledger** | `empathyledger.com` | Vercel | ✅ Deployed |
| **JusticeHub** | `justicehub.org.au` | Vercel | ✅ Deployed |
| **Goods on Country** | `goodsoncountry.com` | Netlify | ✅ Deployed |

### Infrastructure Dependencies

**Critical for ALL projects**:
- NAS Services (Redis + ChromaDB) - Currently local network only (192.168.0.34)
- For production: Need cloud alternatives (Vercel KV, Upstash, Pinecone)

**Per Project**:
- Supabase (cloud database) - Empathy Ledger, JusticeHub
- GoHighLevel (cloud CRM) - All projects
- Resend (cloud email) - All projects

---

## 🎯 Current Priorities (Q1 2026)

### For ACT Core

1. **Launch `act.place` website** (public-facing hub)
   - Complete remaining pages (governance, blog aggregation)
   - Deploy to production
   - Set up GHL master account with sub-accounts

2. **Finalize environment management**
   - Create all 4 GHL sub-accounts
   - Populate .env-vault with real credentials
   - Sync to all projects

3. **Admin Wiki enhancement**
   - Add individual project restart capability
   - Implement logs viewer
   - Add health check endpoint

4. **Infrastructure optimization**
   - Upgrade all projects to Next.js 16 + Turbopack
   - Remove 1-second startup delay
   - Cloud Redis/ChromaDB alternatives for production

### For Projects

1. **The Harvest** - GHL integration (contact, volunteer, event booking)
2. **ACT Farm** - Residency booking system + workshop registration
3. **Empathy Ledger** - Organization inquiry pipeline + GHL sync
4. **JusticeHub** - Service provider CRM + booking flow completion

---

## 📚 Related Documentation

- [UNIFIED_PROJECT_STANDARDS.md](./UNIFIED_PROJECT_STANDARDS.md) - Technical standards across all projects
- [ENV_AUDIT_AND_MANAGEMENT.md](./ENV_AUDIT_AND_MANAGEMENT.md) - Environment variable management
- [GHL_PIPELINE_STRATEGY.md](./GHL_PIPELINE_STRATEGY.md) - Complete CRM strategy
- [ACT_MASTER_PLAN.md](./ACT_MASTER_PLAN.md) - Overall strategic plan
- [DRAFT_MISSION_AND_ABOUT.md](./DRAFT_MISSION_AND_ABOUT.md) - ACT mission + values

---

**Maintained By**: A Curious Tractor Core Team
**Last Updated**: December 24, 2025
**Questions**: hello@act.place
