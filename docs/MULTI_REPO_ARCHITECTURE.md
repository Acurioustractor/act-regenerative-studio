# Multi-Repository Architecture

Visual guide to how the three ACT codebases interact.

---

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         ACT Ecosystem                            │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────┐       ┌──────────────────────┐
│   ACT Main Website   │       │  Empathy Ledger v.02 │
│   (This Repo)        │◄──────┤  (API Provider)      │
│                      │  API  │                      │
│  - Project pages     │       │  - Storytellers      │
│  - Featured content  │       │  - Stories           │
│  - Public website    │       │  - ACT projects DB   │
└──────────────────────┘       └──────────────────────┘
         │                              │
         │                              │
         │                              │
         ▼                              ▼
┌─────────────────────────────────────────────────────┐
│                  Supabase Database                   │
│  - Empathy Ledger DB (storytellers, stories)        │
│  - ACT projects (act_projects, features)            │
└─────────────────────────────────────────────────────┘
```

---

## Data Flow: Featured Content

```
User visits ACT project page
         │
         ▼
┌─────────────────────────────────────────────────────┐
│ ACT Website: /projects/justicehub                   │
│ (Next.js Server Component)                          │
└─────────────────────────────────────────────────────┘
         │
         │ 1. Call getFeaturedContentForProject('justicehub')
         ▼
┌─────────────────────────────────────────────────────┐
│ ACT Website: /src/lib/empathy-ledger-featured.ts   │
│ (API Client)                                        │
└─────────────────────────────────────────────────────┘
         │
         │ 2. HTTP GET with cache
         │    fetch('/api/v1/act-projects/justicehub/featured')
         ▼
┌─────────────────────────────────────────────────────┐
│ Empathy Ledger: /api/v1/act-projects/[slug]/       │
│                 featured/route.ts                   │
│ (API Endpoint)                                      │
└─────────────────────────────────────────────────────┘
         │
         │ 3. Query database
         │    SELECT * FROM act_featured_storytellers
         │    WHERE project_slug = 'justicehub'
         ▼
┌─────────────────────────────────────────────────────┐
│ Supabase Database                                   │
│ - act_featured_storytellers (view)                  │
│ - storyteller_project_features                      │
│ - act_projects                                      │
└─────────────────────────────────────────────────────┘
         │
         │ 4. Return JSON
         ▼
┌─────────────────────────────────────────────────────┐
│ Response: FeaturedContentResponse                   │
│ {                                                   │
│   project: { slug, title, ... },                   │
│   featured: {                                       │
│     storytellers: [...],                            │
│     stories: [...]                                  │
│   }                                                 │
│ }                                                   │
└─────────────────────────────────────────────────────┘
         │
         │ 5. Validate response
         │    isValidFeaturedContentResponse(data)
         ▼
┌─────────────────────────────────────────────────────┐
│ ACT Website: Render CommunityVoicesSection          │
│ Display storytellers and stories on page            │
└─────────────────────────────────────────────────────┘
```

---

## Type Safety Flow

```
┌─────────────────────────────────────────────────────┐
│ 1. Define Types (SOURCE OF TRUTH)                   │
│ ACT Website: /src/types/shared/                     │
│                                                     │
│ export interface FeaturedContentResponse {         │
│   project: ACTProject;                             │
│   featured: {                                       │
│     storytellers: FeaturedStoryteller[];           │
│     stories: FeaturedStory[];                      │
│   };                                                │
│ }                                                   │
└─────────────────────────────────────────────────────┘
         │
         │ ./scripts/sync-types.sh
         ▼
┌─────────────────────────────────────────────────────┐
│ 2. Copy Types to Empathy Ledger                     │
│ Empathy Ledger: /src/types/shared/                  │
│                                                     │
│ // Synced from ACT Main Website on 2024-12-24      │
│ export interface FeaturedContentResponse { ... }    │
└─────────────────────────────────────────────────────┘
         │
         ├──────────────────────┬───────────────────────┐
         │                      │                       │
         ▼                      ▼                       ▼
┌────────────────────┐ ┌────────────────────┐ ┌──────────────────┐
│ 3a. API Provider   │ │ 3b. API Client     │ │ 3c. Display      │
│ (Empathy Ledger)   │ │ (ACT Website)      │ │ (ACT Website)    │
│                    │ │                    │ │                  │
│ Uses types to      │ │ Uses types to      │ │ Uses types for   │
│ ensure response    │ │ validate response  │ │ rendering props  │
│ matches contract   │ │ at runtime         │ │                  │
└────────────────────┘ └────────────────────┘ └──────────────────┘
         │                      │                       │
         │                      │                       │
         └──────────────────────┴───────────────────────┘
                                │
                    ✅ TypeScript ensures
                       type safety across
                       all three layers
```

---

## Database Schema (Empathy Ledger)

```
┌───────────────────────────────────────────────────────────┐
│                     act_projects                          │
├───────────────────────────────────────────────────────────┤
│ id                UUID PRIMARY KEY                        │
│ slug              TEXT UNIQUE                             │
│ title             TEXT                                    │
│ organization_name TEXT                                    │
│ focus_areas       TEXT[]                                  │
│ themes            TEXT[]                                  │
│ active            BOOLEAN                                 │
└───────────────────────────────────────────────────────────┘
                          │
                          │ Referenced by
                          ▼
┌───────────────────────────────────────────────────────────┐
│            storyteller_project_features                   │
├───────────────────────────────────────────────────────────┤
│ id                UUID PRIMARY KEY                        │
│ storyteller_id    UUID → auth.users(id)                   │
│ act_project_id    UUID → act_projects(id)                 │
│ opted_in          BOOLEAN (storyteller choice)            │
│ approved_by_act   BOOLEAN (admin approval)                │
│ is_visible        BOOLEAN (GENERATED: opted_in AND        │
│                            approved_by_act)               │
│ custom_bio        TEXT                                    │
│ custom_tagline    TEXT                                    │
└───────────────────────────────────────────────────────────┘
                          │
                          │ Used by view
                          ▼
┌───────────────────────────────────────────────────────────┐
│              act_featured_storytellers (VIEW)             │
├───────────────────────────────────────────────────────────┤
│ project_slug                                              │
│ storyteller_id                                            │
│ display_name                                              │
│ profile_image_url                                         │
│ featured_bio                                              │
│ featured_tagline                                          │
│ opted_in_at                                               │
│ approved_at                                               │
│                                                           │
│ WHERE is_visible = TRUE  ← Only shows approved content    │
└───────────────────────────────────────────────────────────┘
```

### Key Insight: Bidirectional Approval

```
Storyteller         Admin
opts in       AND   approves     =    Visible on website
   ✓                  ✓                      ✓
   ✓                  ✗                      ✗
   ✗                  ✓                      ✗
   ✗                  ✗                      ✗
```

This ensures **both parties consent** before content appears publicly.

---

## Workflow: Adding a New Storyteller to Project

```
┌─────────────────────────────────────────────────────┐
│ Step 1: Storyteller Opts In                         │
│ (Empathy Ledger Dashboard)                          │
└─────────────────────────────────────────────────────┘
         │
         │ Click "Opt In" button for JusticeHub project
         ▼
┌─────────────────────────────────────────────────────┐
│ INSERT INTO storyteller_project_features            │
│ (storyteller_id, act_project_id, opted_in)          │
│ VALUES ('storyteller-uuid', 'justicehub-uuid', TRUE)│
│                                                     │
│ Result: opted_in = TRUE, approved_by_act = FALSE    │
│         is_visible = FALSE (not yet approved)       │
└─────────────────────────────────────────────────────┘
         │
         │ Status: "Pending Approval"
         ▼
┌─────────────────────────────────────────────────────┐
│ Step 2: Admin Approves                              │
│ (Empathy Ledger Admin Dashboard)                    │
└─────────────────────────────────────────────────────┘
         │
         │ Click "Approve" button
         ▼
┌─────────────────────────────────────────────────────┐
│ UPDATE storyteller_project_features                 │
│ SET approved_by_act = TRUE,                         │
│     approved_at = NOW(),                            │
│     approved_by_admin_id = 'admin-uuid'             │
│ WHERE id = 'feature-uuid'                           │
│                                                     │
│ Result: opted_in = TRUE, approved_by_act = TRUE     │
│         is_visible = TRUE (computed)                │
└─────────────────────────────────────────────────────┘
         │
         │ Status: "Featured"
         ▼
┌─────────────────────────────────────────────────────┐
│ Step 3: Appears in API                              │
│ (Automatically via database view)                   │
└─────────────────────────────────────────────────────┘
         │
         │ SELECT * FROM act_featured_storytellers
         │ WHERE project_slug = 'justicehub'
         ▼
┌─────────────────────────────────────────────────────┐
│ Step 4: Displayed on Website                        │
│ (ACT Website auto-fetches and displays)             │
│                                                     │
│ GET /api/v1/act-projects/justicehub/featured        │
│ → Returns storyteller in response                   │
│ → CommunityVoicesSection renders it                 │
└─────────────────────────────────────────────────────┘
```

---

## Development Environment Setup

```
Terminal 1: Empathy Ledger Dev Server
┌─────────────────────────────────────┐
│ $ cd Empathy\ Ledger\ v.02          │
│ $ npm run dev                       │
│ ✓ Ready on http://localhost:3001   │
│                                     │
│ Provides:                           │
│ - API endpoints                     │
│ - Admin dashboard                   │
│ - Storyteller dashboard             │
└─────────────────────────────────────┘

Terminal 2: ACT Main Website Dev Server
┌─────────────────────────────────────┐
│ $ cd ACT\ Farm\ and\ Regenerative\  │
│   Innovation\ Studio                │
│ $ npm run dev                       │
│ ✓ Ready on http://localhost:3002   │
│                                     │
│ Provides:                           │
│ - Project pages                     │
│ - Featured content display          │
│ - Public website                    │
└─────────────────────────────────────┘

Or use:
┌─────────────────────────────────────┐
│ $ ./start-all.sh                    │
│ Starts both servers automatically   │
└─────────────────────────────────────┘
```

---

## Deployment Architecture

```
Production Environment

┌───────────────────────────────────────────────────────┐
│              Vercel (ACT Main Website)                │
│  https://act-regenerative-studio.vercel.app           │
│                                                       │
│  - Serves project pages                               │
│  - Fetches featured content from Empathy Ledger API   │
│  - Caches responses for 5 minutes                     │
└───────────────────────────────────────────────────────┘
                          │
                          │ HTTP GET (cached)
                          │ /api/v1/act-projects/{slug}/featured
                          ▼
┌───────────────────────────────────────────────────────┐
│             Vercel (Empathy Ledger)                   │
│  https://empathy-ledger.vercel.app                    │
│                                                       │
│  - Provides API endpoints                             │
│  - Admin dashboard                                    │
│  - Storyteller dashboard                              │
└───────────────────────────────────────────────────────┘
                          │
                          │ Query
                          ▼
┌───────────────────────────────────────────────────────┐
│              Supabase Database                        │
│  https://supabase.com/dashboard/project/...          │
│                                                       │
│  - Stores storytellers, stories                       │
│  - Stores ACT projects metadata                       │
│  - Stores opt-in/approval records                     │
│  - Row Level Security (RLS) policies                  │
└───────────────────────────────────────────────────────┘
```

### Deployment Order (CRITICAL!)

```
1. Database Migration
   ↓
   supabase db push
   ↓
2. Empathy Ledger API
   ↓
   vercel deploy --prod (in Empathy Ledger repo)
   ↓
3. ACT Main Website
   ↓
   vercel deploy --prod (in ACT Website repo)

⚠️ NEVER deploy in reverse order!
   Consumer before provider = broken website
```

---

## Error Handling Flow

```
User visits /projects/justicehub
         │
         ▼
ACT Website calls Empathy Ledger API
         │
         ├─────── Success ────────┐
         │                        │
         │                        ▼
         │              ┌──────────────────┐
         │              │ Validate response │
         │              │ with type guard   │
         │              └──────────────────┘
         │                        │
         │                ┌───────┴────────┐
         │                │                │
         │            Valid?           Invalid?
         │                │                │
         │                ▼                ▼
         │         Display content   Log error +
         │                            return []
         │
         └─────── Failure ────────┐
                                  │
                                  ▼
                         ┌────────────────┐
                         │ Catch error +  │
                         │ return []      │
                         └────────────────┘
                                  │
                                  ▼
                    ┌───────────────────────┐
                    │ Page renders without  │
                    │ featured content      │
                    │ (graceful degradation)│
                    └───────────────────────┘

Result: Website NEVER crashes due to API failure
```

---

## Type Sync Workflow

```
Developer makes changes

         1. Edit type
         ↓
┌─────────────────────────────────────┐
│ ACT Website (SOURCE OF TRUTH)       │
│ /src/types/shared/                  │
│                                     │
│ export interface Example {          │
│   id: string;                       │
│   name: string;                     │
│   new_field: string; // ← Added     │
│ }                                   │
└─────────────────────────────────────┘
         │
         │ 2. Run sync script
         │    ./scripts/sync-types.sh
         ▼
┌─────────────────────────────────────┐
│ Empathy Ledger (COPY)               │
│ /src/types/shared/                  │
│                                     │
│ // Synced from ACT Main Website     │
│ // on 2024-12-24                    │
│ export interface Example {          │
│   id: string;                       │
│   name: string;                     │
│   new_field: string; // ← Synced    │
│ }                                   │
└─────────────────────────────────────┘
         │
         │ 3. Type check
         │    ./scripts/type-check-all.sh
         ▼
┌─────────────────────────────────────┐
│ TypeScript Compiler                 │
│                                     │
│ ✅ Empathy Ledger: Type check OK    │
│ ✅ ACT Website: Type check OK       │
└─────────────────────────────────────┘
         │
         │ 4. Update implementations
         ▼
Both repos now use updated types safely
```

---

## Summary Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                    ACT Ecosystem Flow                         │
└──────────────────────────────────────────────────────────────┘

Types               Code                    Data
(TypeScript)        (Next.js)               (PostgreSQL)

ACT Website         ACT Website
/types/shared/      /lib/api-client.ts
   │                   │
   │ sync              │ HTTP GET
   ▼                   ▼
Empathy Ledger      Empathy Ledger          Supabase DB
/types/shared/      /api/v1/.../route.ts    - act_projects
   │                   │                     - features
   │ validates         │ queries             - storytellers
   ▼                   ▼                     - stories
Runtime             Database View
validation          act_featured_*
   │                   │
   ▼                   ▼
✅ Type-safe         ✅ Approved only
   response             content

Result: Type-safe, bidirectionally-approved content
        displayed on ACT project pages
```

---

## Key Takeaways

1. **ACT Website is the source of truth for types** - Always edit types there first
2. **Use `./scripts/sync-types.sh`** after editing shared types
3. **Deploy in order:** migration → API → consumer
4. **Validate at runtime** - Types are erased, check API responses
5. **Fail gracefully** - Website works even if API is down
6. **Bidirectional approval** - Both storyteller AND admin must approve

---

For more details, see:
- [MULTI_REPO_MANAGEMENT.md](../MULTI_REPO_MANAGEMENT.md) - Quick reference
- [CROSS_CODEBASE_BEST_PRACTICES.md](../CROSS_CODEBASE_BEST_PRACTICES.md) - Detailed guide
- [.claude/skills/multi-repo-sync.md](../.claude/skills/multi-repo-sync.md) - Step-by-step workflows
