# Feature Plan: Fishers Oysters Generative Website System

**Created:** 2026-01-27
**Author:** architect-agent
**Project Code:** ACT-FO

---

## Overview

Build a generative website system for Fishers Oysters that consolidates all existing content (photos, stories, video, Notion history, Empathy Ledger stories) into a Next.js website. This system will serve as a **replicable template** for all Straddie innovation projects and other ACT ecosystem partners, integrating GoHighLevel for CRM/commerce, Empathy Ledger for stories, and unified content management.

---

## Requirements

### Core Requirements
- [ ] Consolidate all Fishers Oysters content from multiple sources
- [ ] Generate website pages from structured content
- [ ] Integrate with GoHighLevel for CRM and e-commerce
- [ ] Connect to Empathy Ledger for story display with consent management
- [ ] Support group tour bookings (September target)
- [ ] Enable direct-to-market sales ($24/dozen vs $16 wholesale)
- [ ] Newsletter and communication cadence management
- [ ] Mobile events support (van for Gold Coast to Sunny Coast)

### Replicability Requirements
- [ ] Create template pattern that works for any project
- [ ] Document the project configuration schema
- [ ] Build shared components that adapt to project context
- [ ] Enable rapid deployment for new Straddie projects

---

## Design

### Architecture

```
                    ┌─────────────────────────────────────────────────────────┐
                    │               Content Sources                            │
                    └─────────────────────────────────────────────────────────┘
                                            │
           ┌────────────────┬───────────────┼───────────────┬────────────────┐
           │                │               │               │                │
           ▼                ▼               ▼               ▼                ▼
    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
    │  Notion  │    │ Empathy  │    │  Photos  │    │  Videos  │    │  Webflow │
    │ History  │    │  Ledger  │    │ (Various)│    │ (Existing│    │   Mock   │
    └──────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘
           │                │               │               │                │
           └────────────────┴───────────────┴───────────────┴────────────────┘
                                            │
                                            ▼
                    ┌─────────────────────────────────────────────────────────┐
                    │            act-ecosystem (Content Hub)                   │
                    │  ┌────────────────────────────────────────────────────┐ │
                    │  │  Project Configuration (project-codes.json)        │ │
                    │  │  Content Sync Scripts (sync-*.mjs)                 │ │
                    │  │  GHL Webhook Handler                               │ │
                    │  └────────────────────────────────────────────────────┘ │
                    └─────────────────────────────────────────────────────────┘
                                            │
                                            ▼
                    ┌─────────────────────────────────────────────────────────┐
                    │                    Supabase                              │
                    │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
                    │  │ ghl_contacts│  │  stories    │  │ project_content │  │
                    │  │ ghl_opps    │  │ storytellers│  │ media_assets    │  │
                    │  └─────────────┘  └─────────────┘  └─────────────────┘  │
                    └─────────────────────────────────────────────────────────┘
                                            │
                    ┌───────────────────────┼───────────────────────┐
                    │                       │                       │
                    ▼                       ▼                       ▼
          ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
          │ fishers-oysters │    │  straddie-proj  │    │  other-projects │
          │    Website      │    │    Websites     │    │    Websites     │
          │   (Next.js)     │    │   (Next.js)     │    │   (Next.js)     │
          └─────────────────┘    └─────────────────┘    └─────────────────┘
                    │                       │                       │
                    └───────────────────────┼───────────────────────┘
                                            │
                                            ▼
                    ┌─────────────────────────────────────────────────────────┐
                    │              GoHighLevel (CRM/Commerce)                  │
                    │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
                    │  │  Contacts   │  │  Bookings   │  │   E-Commerce    │  │
                    │  │  Pipeline   │  │  Calendar   │  │   (Products)    │  │
                    │  └─────────────┘  └─────────────┘  └─────────────────┘  │
                    └─────────────────────────────────────────────────────────┘
```

### Data Flow

#### Content Consolidation Flow
```
1. Notion History → sync-notion-to-supabase.mjs → supabase.project_content
2. Empathy Ledger → stories API → supabase.stories (with consent)
3. Photos → upload-media.mjs → supabase.media_assets + Storage
4. Videos → upload-media.mjs → supabase.media_assets + Cloudflare Stream
5. Webflow Mock → scrape-webflow.mjs → supabase.page_templates
```

#### Commerce Flow
```
1. Website Form → GHL Webhook → supabase.ghl_contacts
2. Booking Request → GHL Calendar → Booking Confirmation
3. Product Order → GHL/Stripe → Order Processing
4. Newsletter Signup → GHL List → Email Sequences
```

### New Interfaces

```typescript
// src/types/project-website.ts

interface ProjectWebsiteConfig {
  code: string;              // ACT-FO
  slug: string;              // fishers-oysters
  name: string;              // Fishers Oysters
  tagline: string;           // "Restoring oyster reefs, restoring sovereignty"
  
  // Content sources
  empathyLedgerProject?: string;  // Project ID in Empathy Ledger
  notionDatabaseId?: string;      // Notion content database
  
  // GHL Integration
  ghlLocationId: string;
  ghlPipelineId?: string;
  ghlTags: string[];
  
  // Features enabled
  features: {
    bookings: boolean;
    ecommerce: boolean;
    newsletter: boolean;
    stories: boolean;
    gallery: boolean;
    events: boolean;
  };
  
  // Theme/Branding
  theme: {
    primaryColor: string;
    accentColor: string;
    logo?: string;
    heroImage?: string;
    heroVideo?: string;
  };
  
  // Pages
  pages: PageConfig[];
}

interface PageConfig {
  slug: string;
  title: string;
  template: 'hero' | 'about' | 'stories' | 'gallery' | 'booking' | 'shop' | 'contact';
  content?: {
    notion?: { pageId: string };
    custom?: Record<string, any>;
  };
}

interface BookingConfig {
  type: 'group-tour' | 'event' | 'private';
  minGroupSize?: number;
  maxGroupSize?: number;
  price: number;
  duration: string;
  ghlCalendarId: string;
}

interface ProductConfig {
  id: string;
  name: string;
  price: number;
  unit: string;          // "dozen"
  wholesalePrice?: number;
  stripeProductId?: string;
  ghlProductId?: string;
}
```

### Database Schema Additions

```sql
-- New table: project_website_config
CREATE TABLE project_website_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_code TEXT NOT NULL UNIQUE,  -- ACT-FO
  slug TEXT NOT NULL UNIQUE,           -- fishers-oysters
  name TEXT NOT NULL,
  tagline TEXT,
  config JSONB NOT NULL,               -- Full ProjectWebsiteConfig
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- New table: project_content
CREATE TABLE project_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_code TEXT REFERENCES project_website_config(project_code),
  content_type TEXT NOT NULL,          -- 'page', 'story', 'product', 'event'
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  content JSONB,
  source TEXT,                         -- 'notion', 'empathy-ledger', 'manual'
  source_id TEXT,                      -- ID in source system
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(project_code, content_type, slug)
);

-- New table: media_assets  
CREATE TABLE media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_code TEXT REFERENCES project_website_config(project_code),
  type TEXT NOT NULL,                  -- 'image', 'video', 'document'
  title TEXT,
  description TEXT,
  url TEXT NOT NULL,                   -- Supabase Storage URL
  thumbnail_url TEXT,
  metadata JSONB,                      -- dimensions, duration, etc.
  consent_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- New table: bookings
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_code TEXT REFERENCES project_website_config(project_code),
  ghl_contact_id TEXT REFERENCES ghl_contacts(ghl_id),
  booking_type TEXT NOT NULL,          -- 'group-tour', 'event'
  date DATE NOT NULL,
  time_slot TEXT,
  group_size INTEGER,
  status TEXT DEFAULT 'pending',       -- 'confirmed', 'cancelled'
  total_amount DECIMAL,
  ghl_appointment_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- New table: products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_code TEXT REFERENCES project_website_config(project_code),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL NOT NULL,
  unit TEXT,
  wholesale_price DECIMAL,
  stripe_product_id TEXT,
  ghl_product_id TEXT,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## Dependencies

| Dependency | Type | Reason |
|------------|------|--------|
| act-ecosystem | Internal | Project config, GHL integration, sync scripts |
| empathy-ledger-v2 | Internal | Stories platform with consent management |
| Supabase | External | Database and storage |
| GoHighLevel | External | CRM, calendar, e-commerce |
| Stripe | External | Payment processing |
| Cloudflare Stream | External | Video hosting (optional) |
| Next.js 15 | Framework | Website framework |

---

## Existing Assets Inventory

### Verified Content (VERIFIED via Read operations)

| Source | Content Type | Status | Location |
|--------|--------------|--------|----------|
| Empathy Ledger | 3 Transcripts | Exists | `/archive/empathy-ledger-v02-2025/.../transcripts/shaun-fisher_*.txt` |
| Compendium | Project doc | Exists | `/compendium/03-ecosystem/projects/fishers-oysters.md` |
| act-ecosystem | Project config | Exists | `/config/project-codes.json` (ACT-FO) |
| act-ecosystem | GHL tags | Configured | `fishers-oysters`, `fishers` |
| Webflow | Mock site | External | https://fishers-oysters-new.webflow.io/ |

### Content to Locate/Migrate

| Source | Content Type | Status | Action Needed |
|--------|--------------|--------|---------------|
| Notion | History | ? INFERRED | Query Notion for "Fishers Oysters" pages |
| Photos | Gallery | ? INFERRED | Consolidate from various sources |
| Videos | Media | ? INFERRED | Check for existing video assets |
| GHL | Contacts | ? INFERRED | Verify 18 contacts exist (per allProjects.ts) |

---

## Implementation Phases

### Phase 1: Content Consolidation
**Duration:** 1 week
**Files to create/modify:**

```
act-ecosystem/
├── scripts/
│   ├── consolidate-project-content.mjs    # New: Pull all content for a project
│   ├── scrape-webflow-mock.mjs            # New: Extract from Webflow mock
│   └── upload-project-media.mjs           # New: Media upload helper
└── config/
    └── fishers-oysters-website.json       # New: Website-specific config
    
supabase/
└── migrations/
    └── 20260127_project_website_tables.sql  # New: Schema additions
```

**Tasks:**
1. Query Notion for all Fishers Oysters history
2. Export Empathy Ledger stories with consent status
3. Scrape Webflow mock for structure/content
4. Inventory all photos and videos
5. Create migration for new tables
6. Run content consolidation script

**Acceptance Criteria:**
- [ ] All content sources identified and documented
- [ ] Database tables created
- [ ] Content imported to Supabase
- [ ] Media assets uploaded to storage

**Estimated effort:** Medium

---

### Phase 2: Replicable Website Template
**Duration:** 2 weeks
**Files to create:**

```
act-regenerative-studio/
└── src/
    ├── app/
    │   └── projects/
    │       └── [project-slug]/
    │           ├── page.tsx              # Dynamic project homepage
    │           ├── about/page.tsx
    │           ├── stories/page.tsx
    │           ├── gallery/page.tsx
    │           ├── book/page.tsx
    │           ├── shop/page.tsx
    │           └── contact/page.tsx
    ├── components/
    │   └── project-templates/
    │       ├── ProjectHero.tsx
    │       ├── StoryGrid.tsx
    │       ├── BookingForm.tsx
    │       ├── ProductGrid.tsx
    │       └── ProjectGallery.tsx
    ├── lib/
    │   └── project-website/
    │       ├── config-loader.ts          # Load project config
    │       ├── content-fetcher.ts        # Fetch from Supabase
    │       └── ghl-integration.ts        # GHL forms/bookings
    └── types/
        └── project-website.ts            # Type definitions
```

**Tasks:**
1. Create project-website types
2. Build config loader from Supabase
3. Create template components
4. Build dynamic routing for [project-slug]
5. Connect to Empathy Ledger API for stories
6. Add gallery component with media from storage

**Acceptance Criteria:**
- [ ] Project pages render from config
- [ ] Stories display with consent indicators
- [ ] Gallery shows media assets
- [ ] Template works for any project code

**Estimated effort:** Large

---

### Phase 3: GHL Commerce/Booking Integration
**Duration:** 1 week
**Files to create/modify:**

```
act-ecosystem/
└── packages/
    └── integrations/
        └── ghl/
            ├── booking-service.ts        # New: Handle bookings
            ├── product-service.ts        # New: Product sync
            └── calendar-service.ts       # New: Calendar integration

act-regenerative-studio/
└── src/
    ├── app/
    │   └── api/
    │       └── projects/
    │           └── [project-slug]/
    │               ├── book/route.ts     # Booking endpoint
    │               └── order/route.ts    # Order endpoint
    └── components/
        └── project-templates/
            ├── GroupBookingForm.tsx      # Tour booking
            └── ProductCheckout.tsx       # E-commerce
```

**Tasks:**
1. Configure GHL calendar for Fishers Oysters
2. Create booking form component
3. Build booking API endpoint
4. Set up GHL products for oyster sales
5. Create checkout flow
6. Test full booking/purchase cycle

**Acceptance Criteria:**
- [ ] Group tour booking works end-to-end
- [ ] GHL contact created on booking
- [ ] Products purchasable online
- [ ] Order synced to GHL

**Estimated effort:** Medium

---

### Phase 4: Newsletter & Ongoing Content
**Duration:** 1 week
**Files to create:**

```
act-ecosystem/
└── scripts/
    ├── project-newsletter-sequence.mjs   # Email automation setup
    └── content-to-newsletter.mjs         # Generate newsletter from content

act-regenerative-studio/
└── src/
    └── components/
        └── project-templates/
            ├── NewsletterSignup.tsx
            └── EventsCalendar.tsx
```

**Tasks:**
1. Create GHL email sequence for Fishers Oysters
2. Build newsletter signup component
3. Connect signup to GHL list
4. Create event calendar view
5. Set up communication cadence

**Acceptance Criteria:**
- [ ] Newsletter signup captures to GHL
- [ ] Welcome sequence sends automatically
- [ ] Events display on website
- [ ] Regular communication flow established

**Estimated effort:** Small

---

### Phase 5: Documentation & Replication
**Duration:** 3 days
**Files to create:**

```
act-regenerative-studio/
└── docs/
    └── project-websites/
        ├── README.md                     # Overview
        ├── setup-new-project.md          # Step-by-step guide
        ├── content-sources.md            # How to add content
        ├── ghl-integration.md            # GHL setup guide
        └── customization.md              # Theming/branding

act-ecosystem/
└── docs/
    └── PROJECT_WEBSITE_PATTERN.md        # Architecture pattern
```

**Tasks:**
1. Document complete system architecture
2. Create step-by-step guide for new projects
3. Write content consolidation guide
4. Document GHL integration patterns
5. Create Straddie projects checklist

**Acceptance Criteria:**
- [ ] New project can be set up in < 1 day
- [ ] All steps documented
- [ ] Pattern documented for future projects

**Estimated effort:** Small

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Empathy Ledger stories need consent review | High | Check consent_status before display; show only approved |
| Webflow mock has limited content | Medium | Use as structure guide; source content from Notion/EL |
| GHL e-commerce setup complexity | Medium | Start with bookings only; add products in Phase 3 |
| Video hosting costs | Low | Use Cloudflare Stream free tier; fallback to YouTube |
| September deadline for tours | High | Prioritize booking system in Phase 3 |
| Content spread across many sources | Medium | Phase 1 consolidation addresses this |

---

## Open Questions

- [ ] What is the Notion workspace/database ID for Fishers Oysters content?
- [ ] Which photos/videos need to be collected and from where?
- [ ] Is there existing GHL setup for Fishers Oysters or starting fresh?
- [ ] What's the exact tour booking configuration (times, capacity, pricing)?
- [ ] Is there video content already produced that needs hosting?
- [ ] Event at The Harvest before Easter - details needed for cross-promotion

---

## Success Criteria

1. **Content Consolidated**: All Fishers Oysters content in Supabase, organized and accessible
2. **Website Live**: fishers-oysters.act.farm (or similar) serving pages from content
3. **Bookings Working**: Group tours bookable online, synced to GHL calendar
4. **E-commerce Ready**: Oysters purchasable online, orders in GHL pipeline
5. **Newsletter Active**: Signup working, welcome sequence sending
6. **Template Replicable**: Same pattern deployable for next Straddie project in < 1 day

---

## Key Files Reference

### Existing (Verified)

| File | Purpose |
|------|---------|
| `/Users/benknight/Code/act-ecosystem/config/project-codes.json` | ACT-FO config |
| `/Users/benknight/Code/act-ecosystem/packages/supabase/functions/ghl-webhook/index.ts` | GHL integration |
| `/Users/benknight/Code/act-ecosystem/apps/intelligence/src/data/allProjects.ts` | Project metadata |
| `/Users/benknight/Code/empathy-ledger-v2/archive/.../transcripts/shaun-fisher_*.txt` | 3 transcripts |
| `/Users/benknight/Code/act-regenerative-studio/compendium/03-ecosystem/projects/fishers-oysters.md` | Project doc |

### To Create

| File | Purpose |
|------|---------|
| `supabase/migrations/20260127_project_website_tables.sql` | Schema |
| `src/types/project-website.ts` | TypeScript interfaces |
| `src/lib/project-website/config-loader.ts` | Config loading |
| `src/app/projects/[project-slug]/page.tsx` | Dynamic routing |
| `src/components/project-templates/*.tsx` | Reusable components |

---

## Transcript Content Summary (for reference)

From the three Empathy Ledger transcripts (`2024-08-15_shaun-fisher_*.txt`):

**Key Themes:**
- Indigenous aquaculture cooperative (3+ families joined)
- Traditional knowledge + contemporary technology integration
- Environmental restoration (seasonal closures, biodiversity recovery)
- Economic sovereignty through collective ownership
- Youth development and leadership pipeline
- Premium market positioning through storytelling
- Replication model for other coastal Indigenous communities

**Powerful Quotes:**
- "These young people aren't choosing between traditional knowledge and modern technology. They're weaving them together..."
- "Start with your traditional knowledge. Don't try to fit into existing commercial models - create your own."
- "The sea country has been waiting for us to come home. Now's the time."

**Business Stats (from workshop presentation):**
- 12 Indigenous employees (full-time)
- 4 commercial oyster leases
- $340,000 revenue (last year)

---

*Plan generated by architect-agent on 2026-01-27*
