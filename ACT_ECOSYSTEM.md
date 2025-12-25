# ACT Ecosystem - Complete Codebase Map

**The 7 Core Codebases** that make up the heart and soul of A Curious Tractor's regenerative innovation work.

---

## 🌐 The Ecosystem at a Glance

```
                    ┌─────────────────────────┐
                    │   ACT Main Website      │
                    │   (Hub & Showcase)      │
                    └───────────┬─────────────┘
                                │
                    ┌───────────┴───────────┐
                    │                       │
        ┌───────────▼──────────┐  ┌────────▼─────────┐
        │   Empathy Ledger     │  │   JusticeHub     │
        │   (Storytelling)     │  │   (Youth Justice)│
        └──────────────────────┘  └──────────────────┘
                    │
        ┌───────────┼───────────┬───────────┐
        │           │           │           │
    ┌───▼───┐  ┌───▼───┐  ┌────▼────┐  ┌──▼──────┐
    │Harvest│  │  ACT  │  │  Goods  │  │   ACT   │
    │       │  │ Farm  │  │ Register│  │Placemat │
    └───────┘  └───────┘  └─────────┘  └─────────┘
```

---

## 📋 The 7 Core Codebases

### 1. **ACT Main Website** (Hub)
- **Path:** `/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio`
- **Role:** Central hub, project showcase, public face of ACT
- **Stack:** Next.js 15.1.3, Supabase, TypeScript
- **Port:** `:3002` (local dev)
- **Brand:** A Curious Tractor - Regenerative Innovation Studio
- **Audience:** General public, funders, partners, collaborators
- **Purpose:**
  - Showcase all ACT projects with LCAA method
  - Featured storytellers from Empathy Ledger
  - Central navigation to all other platforms
  - Year-in-review content and impact metrics

**Key Features:**
- 36 project pages with photos, videos, stats
- Community Voices section (pulls from Empathy Ledger)
- LCAA storytelling framework (Listen, Curiosity, Action, Art)
- Redis caching for performance
- Shared types source of truth

---

### 2. **Empathy Ledger v2**
- **Path:** `/Users/benknight/Code/empathy-ledger-v2`
- **Role:** Storytelling platform, API provider, cultural archive
- **Stack:** Next.js 14.2.35, Supabase, TypeScript
- **Port:** `:3001` (local dev)
- **Brand:** Empathy Ledger - Every Story Matters
- **Audience:** Storytellers, organizations, researchers
- **Purpose:**
  - Consent-first storytelling with Indigenous data sovereignty
  - OCAP protocols (Ownership, Control, Access, Possession)
  - Cultural privacy levels (public/community/restricted/sacred)
  - API provider for featured content to other ACT sites

**Key Features:**
- 231 storytellers, 251 interviews, 65 hours of wisdom
- ACT project tagging system (bidirectional opt-in)
- Admin approval workflow
- Storyteller dashboard
- Cultural review workflows
- API: `/api/v1/act-projects/{slug}/featured`

**Provides Data To:**
- ACT Main Website (featured storytellers/stories)
- JusticeHub (justice-related stories)
- The Harvest (community stories)

---

### 3. **JusticeHub**
- **Path:** `/Users/benknight/Code/JusticeHub`
- **Role:** Youth justice platform, service directory, advocacy tool
- **Stack:** Next.js ^14.2.25, Supabase, Auth0, TypeScript
- **Port:** `:3003` (assumed)
- **Brand:** JusticeHub - TRUTH • ACTION • JUSTICE
- **Audience:** Families, youth, community programs, policymakers
- **Purpose:**
  - Document 150+ grassroots youth justice programs
  - Connect 2,400+ youth to services
  - CONTAINED experiential installation
  - Service finder and booking system

**Key Features:**
- Service directory with search
- Program success metrics (78% vs 15.5% detention)
- CONTAINED campaign bookings (24 slots/day)
- Family support request forms
- Campaign nominations
- Stories integration with Empathy Ledger

**Integrations:**
- Empathy Ledger (pulls justice-related stories)
- ACT Main Website (featured on projects page)

---

### 4. **The Harvest**
- **Path:** `/Users/benknight/Code/The Harvest`
- **Role:** Community hub, therapeutic programs, events
- **Stack:** Next.js 14.0.4, TypeScript
- **Port:** `:3004` (assumed)
- **Brand:** The Harvest - Community Connection & Healing
- **Audience:** Local community, volunteers, program participants
- **Purpose:**
  - Community meals and seasonal harvests
  - Therapeutic gardening programs (June's Patch)
  - Workshop and event registration
  - Volunteer signup
  - Farm tours and heritage experiences

**Key Features:**
- Contact form
- Volunteer signup
- Event registration
- Therapeutic program intake
- Partnership inquiries
- Heritage-focused content

**Current State:**
- 90% complete, production-ready
- Currently uses Formspree (to be replaced with GoHighLevel)

---

### 5. **ACT Farm**
- **Path:** `/Users/benknight/Code/ACT Farm/act-farm`
- **Role:** Tourism, residencies, conservation showcase
- **Stack:** Next.js 16, TypeScript, Tailwind
- **Port:** `:3005` (assumed)
- **Brand:** ACT Farm - Regenerative Living & Research
- **Audience:** Researchers, artists, tourists, healthcare referrals
- **Purpose:**
  - Artist & researcher residency bookings ($300-500/night)
  - Workshop registration
  - June's Patch prescription referrals (therapeutic gardening)
  - Farm tours and accommodation

**Key Features:**
- Residency booking system
- Interactive farm map with drone imagery
- Workshop calendar
- June's Patch healthcare program
- LCAA framework for conservation messaging
- Future accommodation bookings

**Current State:**
- 80% complete
- Needs: GoHighLevel integration, real map images, booking system

---

### 6. **ACT Placemat**
- **Path:** `/Users/benknight/Code/ACT Placemat`
- **Role:** Backend services, year-in-review, project metadata
- **Stack:** Next.js ~15.2.4, Supabase
- **Port:** `:3999` (dev hub dashboard)
- **Brand:** Internal tool (not public-facing)
- **Audience:** ACT team, admins
- **Purpose:**
  - Year-in-review data aggregation
  - Project metadata management
  - Backend workflows
  - Admin dashboards

**Key Features:**
- Year-in-review content from webflow-portfolio
- Project metadata (curated-2025.json)
- Media library (photos, videos, audio)
- Backend business logic

**Provides Data To:**
- ACT Main Website (project content, stats, media)
- All other platforms (metadata, media assets)

---

### 7. **Goods Asset Register**
- **Path:** `/Users/benknight/Code/Goods Asset Register`
- **Role:** Goods on Country asset tracking and management
- **Stack:** TBD (no package.json found yet)
- **Brand:** Goods on Country - Quality Essentials for Every Home
- **Audience:** Communities, Traditional Owners, logistics team
- **Purpose:**
  - Track 389 assets (363 beds, washing machines, furniture)
  - Deployment tracking across 8 communities
  - Repair network coordination
  - Feedback collection (500+ minutes recorded)
  - Community co-design documentation

**Key Features:**
- Asset inventory management
- Deployment tracking
- Repair scheduling
- Community feedback loops
- Co-design iteration tracking

**Current State:**
- Needs investigation (no package.json found)
- May be spreadsheet/Airtable currently

---

## 🔄 Data Flow Between Codebases

### Primary Flow: Featured Content

```
Empathy Ledger (Source)
    │
    ├─→ Storyteller opts in to ACT project tag
    ├─→ Admin approves in Empathy Ledger dashboard
    ├─→ API endpoint: /api/v1/act-projects/{slug}/featured
    │
    ▼
ACT Main Website (Consumer)
    │
    ├─→ Calls API with project slug
    ├─→ Validates response with type guards
    ├─→ Caches for 5 minutes (Redis)
    ├─→ Displays in CommunityVoicesSection
    │
    ▼
JusticeHub (Consumer)
    │
    ├─→ Same API for justice-related stories
    └─→ Displays on JusticeHub pages

The Harvest (Consumer)
    │
    ├─→ Same API for harvest/community stories
    └─→ Displays on Harvest pages
```

### Secondary Flow: Shared Assets

```
ACT Placemat (Source)
    │
    ├─→ Year-in-review data (curated-2025.json)
    ├─→ Media assets (photos, videos, audio)
    ├─→ Project metadata
    │
    ▼
ACT Main Website (Consumer)
    │
    ├─→ Uses project data for 36 project pages
    ├─→ Embeds photos and videos
    └─→ Displays stats and quotes
```

---

## 🎨 Brand & Audience Alignment

### Unified Brand Elements (Shared)
- **Philosophy:** Regenerative innovation, community sovereignty, LCAA method
- **Values:** Listen first, Indigenous leadership, systems change
- **Design:** Clean, accessible, story-driven
- **Tech:** Next.js, TypeScript, Supabase (consistent stack)

### Individual Brand Expressions

| Codebase | Visual Style | Tone | Key Color Theme |
|----------|-------------|------|-----------------|
| **ACT Main** | Professional, warm, inviting | Inspirational, inclusive | Earth tones |
| **Empathy Ledger** | Cultural, respectful, sacred | Honoring, preserving | Deep blues, earth |
| **JusticeHub** | Bold, urgent, confronting | Truth-telling, advocacy | Black, red, white |
| **The Harvest** | Community, heritage, growth | Welcoming, nurturing | Greens, harvest gold |
| **ACT Farm** | Regenerative, land-focused | Educational, immersive | Browns, greens |
| **Placemat** | Utilitarian, data-rich | Internal, functional | Neutral |
| **Goods** | Practical, durable, honest | Empowering, co-designed | Industrial, warm |

---

## 🛠 Tech Stack Alignment

### Shared Technologies (Consistent Across All)
- **Framework:** Next.js (versions vary: 14-16)
- **Language:** TypeScript
- **Database:** Supabase (where applicable)
- **Styling:** Tailwind CSS (most)
- **Deployment:** Vercel
- **Version Control:** Git

### Shared Services (NAS Infrastructure)
- **Redis:** `redis://192.168.0.34:6379` (caching)
- **ChromaDB:** `http://192.168.0.34:8000` (vector search)
- **Portainer:** `http://192.168.0.34:9000` (container management)

### Individual Differences

| Codebase | Next.js | Unique Tech |
|----------|---------|-------------|
| ACT Main | 15.1.3 | Redis caching, shared types source |
| Empathy Ledger | 14.2.35 | Multiple AI providers, Resend |
| JusticeHub | ^14.2.25 | Auth0, campaign bookings |
| The Harvest | 14.0.4 | Formspree (to replace) |
| ACT Farm | 16 | Interactive maps, booking calendar |
| Placemat | ~15.2.4 | Webflow data import |
| Goods | TBD | TBD |

---

## 🔐 Shared Type System

### Source of Truth Hierarchy

1. **ACT Main Website** - Defines all shared TypeScript interfaces
2. **Copy to other repos** - Via `./scripts/sync-types.sh`
3. **Runtime validation** - Type guards in all consumers

### Shared Types Directory

```
ACT Main Website/
└── src/types/shared/
    ├── act-featured-content.ts    # Featured storytellers/stories
    ├── act-projects.ts             # Project metadata
    ├── api-contracts.ts            # API request/response types
    └── common.ts                   # Shared utilities

↓ Sync via script ↓

Empathy Ledger v2/
└── src/types/shared/
    └── [copied from ACT Main]

JusticeHub/
└── src/types/shared/
    └── [copied from ACT Main]

The Harvest/
└── src/types/shared/
    └── [copied from ACT Main]

ACT Farm/
└── types/shared/
    └── [copied from ACT Main]
```

---

## 🚀 Development Workflow

### Starting All Dev Servers

```bash
# From ACT Main Website directory
cd "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio"
./scripts/start-all-platforms.sh
```

This starts:
- ACT Main Website: `http://localhost:3002`
- Empathy Ledger: `http://localhost:3001`
- JusticeHub: `http://localhost:3003`
- The Harvest: `http://localhost:3004`
- ACT Farm: `http://localhost:3005`
- Placemat: `http://localhost:3999`

### Syncing Types Across All Platforms

```bash
# After editing types in ACT Main Website
./scripts/sync-types-all.sh

# This copies to:
# - Empathy Ledger v2
# - JusticeHub
# - The Harvest
# - ACT Farm
```

### Type Checking All Platforms

```bash
./scripts/type-check-ecosystem.sh

# Checks all 7 codebases in parallel
# Shows pass/fail for each
```

---

## 📊 Codebase Status Matrix

| Codebase | Status | Next.js | Supabase | GoHighLevel | Empathy API | Production Ready |
|----------|--------|---------|----------|-------------|-------------|------------------|
| **ACT Main** | ✅ 95% | 15.1.3 | ✅ | Planned | ✅ Consumer | ✅ Yes |
| **Empathy Ledger** | ⚠️ 85% | 14.2.35 | ✅ | - | ✅ Provider | ⚠️ Needs UI fixes |
| **JusticeHub** | ⚠️ 65% | ^14.2.25 | ✅ | Planned | ✅ Consumer | ❌ Many TODOs |
| **The Harvest** | ✅ 90% | 14.0.4 | ❌ | Planned | Planned | ✅ Almost ready |
| **ACT Farm** | ⚠️ 80% | 16 | ❌ | Planned | Planned | ❌ Needs bookings |
| **Placemat** | ✅ 75% | ~15.2.4 | ✅ | - | - | ⚠️ Internal only |
| **Goods** | ❓ TBD | - | - | - | - | ❓ Unknown |

---

## 🎯 Integration Priorities

### Phase 1: Core Infrastructure (DONE ✅)
- [x] ACT Main Website as hub
- [x] Empathy Ledger API integration
- [x] Shared type system
- [x] Multi-repo management documentation
- [x] Redis caching on NAS

### Phase 2: Featured Content (IN PROGRESS ⚠️)
- [x] Database schema for ACT project tagging
- [x] Empathy Ledger opt-in dashboard
- [x] Admin approval interface
- [x] API endpoint
- [ ] Complete missing UI components
- [ ] End-to-end testing
- [ ] Deploy to production

### Phase 3: GoHighLevel Integration (PLANNED 📋)
- [ ] The Harvest contact/volunteer/event forms
- [ ] ACT Farm residency booking
- [ ] JusticeHub service requests
- [ ] Unified lead management
- [ ] Email automation across all platforms

### Phase 4: Cross-Platform Features (PLANNED 📋)
- [ ] Unified search across all platforms
- [ ] Shared user authentication (SSO)
- [ ] Cross-platform analytics dashboard
- [ ] Shared media library
- [ ] Goods Asset Register web interface

---

## 🔗 API Contracts Between Codebases

### Empathy Ledger → ACT Main Website

```typescript
// GET /api/v1/act-projects/{slug}/featured
interface FeaturedContentResponse {
  project: ACTProject;
  featured: {
    storytellers: FeaturedStoryteller[];
    stories: FeaturedStory[];
  };
  meta: {
    storyteller_count: number;
    story_count: number;
    fetched_at: string;
  };
}
```

### Empathy Ledger → JusticeHub

```typescript
// GET /api/v1/act-projects/justicehub/featured?type=stories&limit=20
// Same response structure, filtered for justice theme
```

### ACT Placemat → ACT Main Website

```typescript
// Static import from curated-2025.json
interface ProjectData {
  slug: string;
  title: string;
  photos: string[];
  videoUrl?: string;
  stats: { value: string; label: string }[];
  quote?: { text: string; author: string; role: string };
}
```

---

## 📖 Documentation Per Codebase

### ACT Main Website
- `MULTI_REPO_MANAGEMENT.md` - Hub for all docs
- `CROSS_CODEBASE_BEST_PRACTICES.md` - Detailed guide
- `ACT_ECOSYSTEM.md` - This file
- `.claude/skills/multi-repo-sync.md` - Claude skill

### Empathy Ledger
- `ACT_PROJECT_TAGGING_SYSTEM.md` - Tagging system docs
- `QUICK_START_ACT_TAGGING.md` - Setup guide

### Others
- Individual READMEs (to be created)
- Linking back to ACT Main Website docs

---

## 🎓 Onboarding New Developers

1. **Read:** `ACT_ECOSYSTEM.md` (this file) - Understand the full picture
2. **Read:** `CROSS_CODEBASE_BEST_PRACTICES.md` - Learn workflows
3. **Clone all 7 repos** to `/Users/benknight/Code/`
4. **Run:** `./scripts/start-all-platforms.sh` - See everything working
5. **Try:** Make a small change, sync types, test across platforms
6. **Reference:** `.claude/skills/multi-repo-sync.md` for step-by-step workflows

---

## 🌟 Vision: One Ecosystem, Many Brands

**The Goal:**
Build these 7 codebases as **one unified ecosystem** with:
- Shared infrastructure (types, APIs, caching, hosting)
- Consistent development practices
- Cross-platform features (search, auth, analytics)
- Seamless data flow

**While preserving:**
- Individual brand identities
- Distinct audiences and purposes
- Platform-specific features and workflows
- Community sovereignty (especially for Empathy Ledger)

**Result:**
An ecosystem where each platform serves its community with excellence, while benefiting from shared infrastructure, learnings, and network effects across the whole ACT family.

---

**Last Updated:** December 24, 2024
**Maintained By:** A Curious Tractor team
**Questions?** See [CROSS_CODEBASE_BEST_PRACTICES.md](./CROSS_CODEBASE_BEST_PRACTICES.md)
