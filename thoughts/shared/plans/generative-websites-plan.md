# Feature Plan: ACT Generative Website System

Created: 2026-01-27
Author: architect-agent

---

## Overview

A reusable framework for generating content-driven websites for ACT innovation projects like Fishers Oysters. The system pulls from project configs, Empathy Ledger stories, Notion content, and media assets to generate templated Next.js sites that integrate with GoHighLevel for CRM, bookings, and e-commerce.

**Key insight from analysis:** ACT Regenerative Studio already has excellent patterns for project enrichment, component architecture, and integration with Empathy Ledger/GHL/Notion. The generative website system should leverage these patterns rather than reinvent them.

---

## Requirements

- [ ] Generate websites from project config (fo.json pattern)
- [ ] Pull stories and quotes from Empathy Ledger API
- [ ] Sync content from Notion project pages
- [ ] Display media from Supabase gallery
- [ ] Integrate GHL forms for contact, bookings, orders
- [ ] Consistent branding with ACT ecosystem footer
- [ ] Deployable to Vercel with CI/CD
- [ ] Replicable for any ACT partner organization

---

## Design

### Recommended Approach: Template Generator in act-ecosystem

After analyzing the existing codebase, I recommend **Option C: A template generator that scaffolds sites from act-ecosystem**.

**Rationale:**
1. `act-ecosystem/config/projects/` already has the detailed config pattern (fo.json)
2. `act-regenerative-studio` has proven component patterns (ProjectHero, CommunityVoicesSection, etc.)
3. New sites need independent deployment and customization
4. A generator can copy proven patterns while allowing project-specific customization

### Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         ACT ECOSYSTEM REPOSITORY                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  config/                       templates/site-generator/                 │
│  ├── projects/                 ├── base/                                 │
│  │   ├── fo.json               │   ├── src/                              │
│  │   ├── hv.json               │   │   ├── app/                          │
│  │   └── ...                   │   │   ├── components/                   │
│  └── project-codes.json        │   │   └── lib/                          │
│                                │   ├── package.json.template             │
│                                │   └── tailwind.config.template          │
│  scripts/generators/           │                                         │
│  ├── create-site.mjs           ├── themes/                               │
│  ├── sync-content.mjs          │   ├── earth/                            │
│  └── deploy-site.mjs           │   ├── justice/                          │
│                                │   └── goods/                            │
└────────────────────────────────┴─────────────────────────────────────────┘
                                        │
                                        │ generate
                                        ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    GENERATED SITE (fishers-oysters-website)              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  src/                                                                    │
│  ├── app/                                                                │
│  │   ├── page.tsx              ← Home page (hero, about, products)       │
│  │   ├── about/page.tsx        ← Story from Empathy Ledger               │
│  │   ├── products/page.tsx     ← Product grid, GHL integration           │
│  │   ├── book/page.tsx         ← GHL calendar embed                      │
│  │   └── contact/page.tsx      ← GHL form integration                    │
│  │                                                                       │
│  ├── components/                                                         │
│  │   ├── Hero.tsx              ← Full-width with video/image             │
│  │   ├── StorySection.tsx      ← Empathy Ledger quotes/stories           │
│  │   ├── ProductGrid.tsx       ← Oysters, merchandise, experiences       │
│  │   ├── BookingWidget.tsx     ← GHL calendar integration                │
│  │   ├── ContactForm.tsx       ← GHL form submission                     │
│  │   ├── Gallery.tsx           ← Supabase media                          │
│  │   └── EcosystemFooter.tsx   ← Link back to ACT ecosystem              │
│  │                                                                       │
│  ├── lib/                                                                │
│  │   ├── project-config.ts     ← Load from fo.json                       │
│  │   ├── empathy-ledger.ts     ← Fetch stories API                       │
│  │   ├── notion.ts             ← Sync content blocks                     │
│  │   ├── ghl.ts                ← CRM/booking/commerce API                │
│  │   └── media.ts              ← Supabase storage                        │
│  │                                                                       │
│  └── content/                                                            │
│      ├── config.json           ← Generated from fo.json                  │
│      └── content.json          ← Synced from Notion                      │
│                                                                          │
│  .env.local                    ← GHL keys, Supabase, Empathy Ledger      │
│  vercel.json                   ← Deployment config                       │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
                                        │
                    ┌───────────────────┼───────────────────┐
                    ▼                   ▼                   ▼
           ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
           │ Empathy      │    │ GoHighLevel  │    │ Supabase     │
           │ Ledger API   │    │ (CRM/Forms)  │    │ (Media/Data) │
           └──────────────┘    └──────────────┘    └──────────────┘
```

### Data Flow

```
                    ┌────────────────────────────────────────────┐
                    │              BUILD TIME                     │
                    └────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ fo.json     │───▶│ Generator   │───▶│ Next.js     │
│ (config)    │    │ Script      │    │ Project     │
└─────────────┘    └─────────────┘    └─────────────┘
                          │
                          │ reads
                          ▼
┌─────────────┐    ┌─────────────┐
│ Notion API  │───▶│ Content     │
│             │    │ JSON        │
└─────────────┘    └─────────────┘


                    ┌────────────────────────────────────────────┐
                    │              RUNTIME / ISR                  │
                    └────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Empathy     │───▶│ Featured    │───▶│ Story       │
│ Ledger API  │    │ Stories     │    │ Components  │
└─────────────┘    └─────────────┘    └─────────────┘
      │
      │ (5 min cache)
      ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Supabase    │───▶│ Media       │───▶│ Gallery     │
│ Storage     │    │ Items       │    │ Component   │
└─────────────┘    └─────────────┘    └─────────────┘


                    ┌────────────────────────────────────────────┐
                    │              USER INTERACTION               │
                    └────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Form        │───▶│ API Route   │───▶│ GHL         │
│ Submission  │    │ /api/forms  │    │ Contact API │
└─────────────┘    └─────────────┘    └─────────────┘
                          │
                          │ triggers
                          ▼
                   ┌─────────────┐
                   │ GHL         │
                   │ Workflow    │
                   └─────────────┘
```

### Interfaces

```typescript
// lib/project-config.ts - Project configuration interface
interface ProjectSiteConfig {
  // Identity (from fo.json)
  identity: {
    code: string;           // "ACT-FO"
    name: string;           // "Fishers Oysters"
    slug: string;           // "fishers-oysters"
    tagline: string;        // "Restoring oyster reefs..."
    description: string;
  };

  // Branding
  branding: {
    theme: 'earth' | 'justice' | 'goods' | 'harvest' | 'valley';
    primaryColor?: string;
    logo?: string;
    favicon?: string;
  };

  // Content sources
  connections: {
    notion: {
      page_id: string;
      child_pages: string[];
    };
    empathy_ledger: {
      project_id?: string;
      storytellers: string[];
    };
    ghl: {
      location_id: string;
      calendar_id?: string;
      pipeline_id?: string;
      form_ids?: Record<string, string>;
    };
    media: {
      bucket: string;
      project_folder: string;
    };
  };

  // Site structure
  pages: {
    home: {
      hero: HeroConfig;
      sections: SectionConfig[];
    };
    about?: PageConfig;
    products?: ProductPageConfig;
    book?: BookingPageConfig;
    contact?: ContactPageConfig;
  };

  // SEO
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage?: string;
  };
}

// lib/empathy-ledger.ts - Empathy Ledger integration
interface EmpathyLedgerClient {
  getFeaturedContent(projectSlug: string): Promise<FeaturedContentResponse>;
  getStoryById(storyId: string): Promise<Story>;
  getStoryteller(storytellerId: string): Promise<Storyteller>;
}

// lib/ghl.ts - GHL integration for forms, bookings, commerce
interface GHLIntegration {
  // Contact/Form handling
  submitContact(contact: ContactSubmission): Promise<void>;
  
  // Booking integration
  getAvailableSlots(calendarId: string, date: Date): Promise<TimeSlot[]>;
  createBooking(booking: BookingRequest): Promise<Booking>;
  
  // E-commerce (future)
  getProducts(): Promise<Product[]>;
  createOrder(order: OrderRequest): Promise<Order>;
}

// components/Hero.tsx - Reusable hero component
interface HeroProps {
  title: string;
  tagline: string;
  description?: string;
  image?: {
    url: string;
    alt: string;
  };
  video?: {
    url: string;
    poster?: string;
  };
  cta?: {
    primary: { text: string; href: string };
    secondary?: { text: string; href: string };
  };
  theme: ProjectTheme;
}
```

---

## Dependencies

| Dependency | Type | Reason |
|------------|------|--------|
| act-ecosystem/config | Internal | Project configs (fo.json pattern) |
| act-regenerative-studio | Internal | Component patterns, integration libs |
| empathy-ledger-v2 | Internal | Story API endpoint |
| @notionhq/client | External | Notion API for content sync |
| @supabase/supabase-js | External | Media storage, database |
| GoHighLevel API | External | CRM, forms, bookings, commerce |
| Next.js 15 | External | Framework |
| Tailwind CSS | External | Styling |

---

## Implementation Phases

### Phase 1: Generator Foundation
**Estimated effort:** Medium (3-4 days)

**Files to create in act-ecosystem:**
- `templates/site-generator/base/` - Base Next.js template
- `scripts/generators/create-site.mjs` - Site scaffolding script
- `scripts/generators/sync-content.mjs` - Notion content sync

**Acceptance criteria:**
- [ ] `node scripts/generators/create-site.mjs --project ACT-FO` creates a working Next.js project
- [ ] Generated site compiles without errors
- [ ] Project config (fo.json) is correctly loaded

### Phase 2: Component Library
**Estimated effort:** Medium (3-4 days)

**Files to create in template:**
- `templates/site-generator/base/src/components/Hero.tsx`
- `templates/site-generator/base/src/components/StorySection.tsx`
- `templates/site-generator/base/src/components/ProductGrid.tsx`
- `templates/site-generator/base/src/components/Gallery.tsx`
- `templates/site-generator/base/src/components/BookingWidget.tsx`
- `templates/site-generator/base/src/components/ContactForm.tsx`
- `templates/site-generator/base/src/components/EcosystemFooter.tsx`

**Dependencies:** Phase 1

**Acceptance criteria:**
- [ ] All components render correctly with sample data
- [ ] Components follow ACT design system (from act-regenerative-studio patterns)
- [ ] Responsive on mobile/tablet/desktop

### Phase 3: Empathy Ledger Integration
**Estimated effort:** Small (1-2 days)

**Files to create:**
- `templates/site-generator/base/src/lib/empathy-ledger.ts`
- API route for proxying Empathy Ledger requests if needed

**Dependencies:** Phase 1, 2

**Acceptance criteria:**
- [ ] Stories fetch and display correctly
- [ ] Storyteller profiles render
- [ ] Pull quotes appear in designated sections
- [ ] Cache strategy working (5 min revalidate)

### Phase 4: GHL Integration
**Estimated effort:** Medium (2-3 days)

**Files to create:**
- `templates/site-generator/base/src/lib/ghl.ts`
- `templates/site-generator/base/src/app/api/forms/submit/route.ts`
- `templates/site-generator/base/src/app/api/booking/route.ts`

**Dependencies:** Phase 1, 2

**Acceptance criteria:**
- [ ] Contact form creates GHL contact with correct tags
- [ ] Booking widget shows available slots
- [ ] Booking submission creates GHL appointment
- [ ] Workflows triggered on form submission

### Phase 5: Notion Content Sync
**Estimated effort:** Small (1-2 days)

**Files to create:**
- `templates/site-generator/base/src/lib/notion.ts`
- `scripts/generators/sync-content.mjs`

**Dependencies:** Phase 1

**Acceptance criteria:**
- [ ] Notion pages sync to local content.json
- [ ] Rich text renders correctly
- [ ] Images download to public folder
- [ ] Sync can be run on build or manually

### Phase 6: Theming & Branding
**Estimated effort:** Small (1-2 days)

**Files to create:**
- `templates/site-generator/themes/earth/` - Earth theme overrides
- `templates/site-generator/themes/justice/` - Justice theme overrides
- `templates/site-generator/themes/goods/` - Goods theme overrides

**Dependencies:** Phase 2

**Acceptance criteria:**
- [ ] Theme selection in config applies correct colors/typography
- [ ] Custom logo/favicon support
- [ ] Override capability for project-specific branding

### Phase 7: Deployment Pipeline
**Estimated effort:** Small (1 day)

**Files to create:**
- `scripts/generators/deploy-site.mjs`
- `templates/site-generator/base/vercel.json`
- `templates/site-generator/base/.github/workflows/deploy.yml`

**Dependencies:** Phase 1-6

**Acceptance criteria:**
- [ ] Site deploys to Vercel with single command
- [ ] Environment variables configured correctly
- [ ] CI/CD pipeline working

### Phase 8: Fishers Oysters Implementation
**Estimated effort:** Medium (2-3 days)

**Files to create:**
- `fishers-oysters-website/` - Generated site
- Custom content and branding for Fishers Oysters

**Dependencies:** All previous phases

**Acceptance criteria:**
- [ ] Full site live at fishersoysters.com.au
- [ ] Empathy Ledger stories displaying
- [ ] GHL booking working (oyster tours)
- [ ] Contact form working
- [ ] Photo gallery from Supabase
- [ ] ACT ecosystem footer linking back

---

## Template Components (Detailed)

### Hero Component
```tsx
// templates/site-generator/base/src/components/Hero.tsx
interface HeroProps {
  title: string;
  tagline: string;
  description?: string;
  backgroundImage?: string;
  video?: { url: string; poster?: string };
  cta: { primary: CTAButton; secondary?: CTAButton };
  theme: ProjectTheme;
  overlayOpacity?: number; // 0-100
}
```

### Story Section
```tsx
// templates/site-generator/base/src/components/StorySection.tsx
interface StorySectionProps {
  projectSlug: string;
  variant: 'featured' | 'grid' | 'carousel';
  maxStories?: number;
  showStorytellers?: boolean;
  theme: ProjectTheme;
}
// Fetches from Empathy Ledger API at build/ISR time
```

### Product Grid
```tsx
// templates/site-generator/base/src/components/ProductGrid.tsx
interface ProductGridProps {
  products: Product[];
  variant: 'cards' | 'list' | 'compact';
  enablePurchase?: boolean; // GHL commerce integration
  theme: ProjectTheme;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price?: { amount: number; currency: string };
  image?: string;
  category?: string;
  ghlProductId?: string; // For commerce integration
}
```

### Booking Widget
```tsx
// templates/site-generator/base/src/components/BookingWidget.tsx
interface BookingWidgetProps {
  calendarId: string;
  variant: 'embed' | 'modal' | 'inline';
  serviceName?: string;
  description?: string;
  theme: ProjectTheme;
}
// Options:
// 1. GHL embed (iframe)
// 2. Custom UI with GHL API
// 3. Calendly/Cal.com alternative
```

### Contact Form
```tsx
// templates/site-generator/base/src/components/ContactForm.tsx
interface ContactFormProps {
  projectCode: string;
  formType: string;
  fields: FormFieldConfig[];
  submitLabel?: string;
  successMessage?: string;
  ghlTags?: string[];
  theme: ProjectTheme;
}
// Uses /api/forms/submit which calls GHL contact upsert
```

### Ecosystem Footer
```tsx
// templates/site-generator/base/src/components/EcosystemFooter.tsx
interface EcosystemFooterProps {
  projectCode: string;
  showRelatedProjects?: boolean;
  showNewsletterSignup?: boolean;
  theme: ProjectTheme;
}
// Links back to act.place, shows related ecosystem projects
```

---

## Generator Script Usage

```bash
# Create new site from project config
node scripts/generators/create-site.mjs \
  --project ACT-FO \
  --output ~/Code/fishers-oysters-website \
  --theme earth

# Sync content from Notion
node scripts/generators/sync-content.mjs \
  --project ACT-FO \
  --site ~/Code/fishers-oysters-website

# Deploy to Vercel
node scripts/generators/deploy-site.mjs \
  --site ~/Code/fishers-oysters-website \
  --production
```

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Empathy Ledger API unavailable | Medium | Graceful fallback to static quotes from config |
| GHL rate limits | Low | Implement request queuing, respect rate limits |
| Notion API changes | Low | Abstract behind interface, pin API version |
| Branding inconsistency | Medium | Strong base theme with controlled overrides |
| Deployment complexity | Medium | Clear documentation, automated scripts |

---

## Open Questions

- [ ] **E-commerce scope**: Should Phase 1 include GHL commerce (product purchases)? Or defer to Phase 2 after basic site is working?
- [ ] **Booking provider**: Use GHL calendar directly, or abstract to support Cal.com as alternative?
- [ ] **Domain management**: Who manages DNS? Vercel domains vs custom?
- [ ] **Multi-language**: Any projects needing translation support?

---

## Success Criteria

1. **Generate Fishers Oysters site in < 30 minutes** from running generator to deployed
2. **Content updates without code changes** - Notion sync, Empathy Ledger API
3. **Replicate for 3 more projects** (The Harvest, JusticeHub partner, Goods) using same generator
4. **Form submissions flow to GHL** with correct tags and workflows
5. **Booking conversion** - Measurable improvement in tour/experience bookings

---

## Related Documentation

- `/Users/benknight/Code/act-ecosystem/config/projects/fo.json` - Fishers Oysters config
- `/Users/benknight/Code/act-regenerative-studio/src/components/projects/` - Component patterns
- `/Users/benknight/Code/act-regenerative-studio/src/lib/empathy-ledger-featured.ts` - EL integration
- `/Users/benknight/Code/act-regenerative-studio/src/lib/ghl/client.ts` - GHL client
- `/Users/benknight/Code/act-regenerative-studio/src/lib/ecosystem/index.ts` - Ecosystem data loader

---

## Implementation Notes

### Why not a monorepo?
Each project site may need:
- Different deployment schedules
- Custom branding beyond theme
- Project-specific pages/features
- Independent versioning

The generator approach gives us reusable patterns without coupling.

### Why not just extend act-regenerative-studio?
The studio is an internal ops platform. Project websites are:
- Public-facing
- Simpler (marketing sites, not dashboards)
- Need independent deployment
- May be handed off to partners

### Component reuse strategy
1. Copy proven components from act-regenerative-studio
2. Simplify for marketing site use case
3. Add theme/config support
4. Document for non-technical content updates

---

*Plan created by architect-agent for review by Ben Knight and Claude Code team.*
