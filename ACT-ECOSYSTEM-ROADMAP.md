# ACT Ecosystem Integration Roadmap
**A Curious Tractor - Multi-Site Strategy & Implementation Plan**

*Generated: December 24, 2024*
*Timeline: Next 4-8 weeks*

---

## Executive Summary

The ACT ecosystem consists of 6 interconnected projects that currently operate independently with minimal cross-integration. This roadmap outlines the strategic work needed to unify media management, establish consistent branding, implement cross-project linking, enhance the wiki as a coordination hub, leverage Empathy Ledger's story system across all sites, and create an amazing unified footer experience.

**Current State:** 6 independent sites with no shared assets, inconsistent branding, minimal cross-linking
**Future State:** Cohesive ecosystem with shared infrastructure, unified branding, cross-project stories, and seamless navigation

---

## 1. Media Library & Asset Management

### Current State Analysis

**Critical Issues:**
- ❌ **No centralized media storage** - each project maintains independent assets
- 🔴 **The Harvest: 180MB of unoptimized images** (6-9MB per image)
- 🔴 **ACT Farm: 5MB of unoptimized images** (1MB each)
- ⚠️ **Only 2 of 6 projects** have Supabase Storage (JusticeHub, Empathy Ledger)
- ⚠️ **Only 1 of 6 projects** has logo system (Empathy Ledger - 33 variations)
- ⚠️ **Zero shared assets** between projects

**Existing Infrastructure:**
- ✅ **Empathy Ledger:** Most advanced - deduplication, transcripts, cultural context
- ✅ **JusticeHub:** Professional media_library table with blurhash, multi-size optimization

### Strategic Goals

1. **Unified Supabase Media Bucket** for all projects
2. **Shared brand assets** accessible from all sites
3. **Optimized image pipeline** with automatic WebP conversion
4. **Centralized media management** interface via Admin Wiki
5. **Cross-project media reuse** (team photos, events, shared content)

### Implementation Plan

#### Week 1-2: Critical Optimization & Audit

**Priority 1: The Harvest Image Optimization** 🔴
```bash
# Convert 180MB of images to WebP with responsive sizes
Tasks:
- Install Sharp image processing
- Batch convert all 6-9MB JPGs → WebP
- Generate responsive sizes: 400/800/1200/1920px
- Implement lazy loading
- Expected result: 180MB → ~20MB (89% reduction)
```

**Priority 2: ACT Farm Optimization** 🟡
```bash
# Optimize 5 x 1MB map images
Tasks:
- Convert to WebP
- Generate responsive versions
- Add srcset attributes
- Expected result: 5MB → ~1.5MB (70% reduction)
```

**Priority 3: Media Audit**
```bash
Tasks:
- Inventory all images across 6 projects
- Identify duplicates and shared content
- Document branding needs per project
- Map existing Supabase buckets
```

#### Week 3-4: Centralized Media Infrastructure

**Supabase Shared Media Bucket Setup**
```
Structure:
act-media/
├── branding/
│   ├── logos/
│   │   ├── act-main/           # A Curious Tractor
│   │   ├── act-farm/
│   │   ├── empathy-ledger/     ✅ Migrate existing 33 variations
│   │   ├── justicehub/
│   │   ├── the-harvest/
│   │   └── goods-on-country/
│   ├── icons/
│   │   ├── favicon-variations/
│   │   └── social-share/
│   └── brand-guidelines/
│       ├── colors.json
│       ├── typography.json
│       └── voice-tone.md
├── shared-media/
│   ├── team-photos/
│   ├── event-photos/
│   ├── farm-imagery/
│   ├── hero-images/
│   └── marketing/
├── project-specific/
│   ├── act-farm/
│   ├── justicehub/
│   └── the-harvest/
└── documents/
    ├── reports/
    └── presentations/
```

**Database Schema:**
```sql
-- Extend existing media_assets pattern from Empathy Ledger
CREATE TABLE shared_media_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT,
  media_type TEXT, -- image/video/audio/document

  -- Optimization
  file_hash TEXT UNIQUE, -- SHA-256 for deduplication
  optimized_versions JSONB, -- { webp_400, webp_800, etc. }
  blurhash TEXT,

  -- Metadata
  title TEXT,
  description TEXT,
  alt_text TEXT,
  tags TEXT[],

  -- Project Association
  available_to TEXT[], -- ['all', 'act-farm', 'justicehub']
  used_in_projects JSONB, -- Track usage across sites

  -- Attribution
  uploaded_by UUID REFERENCES auth.users,
  credit TEXT,
  license TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Full-text search
CREATE INDEX idx_media_search ON shared_media_assets
USING gin(to_tsvector('english', title || ' ' || description || ' ' || alt_text));

-- RLS Policies
ALTER TABLE shared_media_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for shared media"
  ON shared_media_assets FOR SELECT
  USING (TRUE);

CREATE POLICY "Project write access"
  ON shared_media_assets FOR INSERT
  USING (auth.jwt() ->> 'project' = ANY(available_to));
```

**Shared Component Library**
```typescript
// packages/shared-components/src/MediaLibrary.tsx
import { createClient } from '@supabase/supabase-js'

export function useSharedMedia(project: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SHARED_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SHARED_SUPABASE_ANON_KEY!
  )

  return {
    async getProjectLogos(projectName: string) {
      const { data } = await supabase.storage
        .from('act-media')
        .list(`branding/logos/${projectName}`)
      return data
    },

    async getTeamPhotos() {
      const { data } = await supabase
        .from('shared_media_assets')
        .select('*')
        .eq('media_type', 'image')
        .contains('tags', ['team'])
        .contains('available_to', [project, 'all'])
      return data
    },

    async uploadOptimized(file: File) {
      // Use Sharp for optimization
      // Generate WebP versions
      // Create blurhash
      // Upload to storage
      // Insert metadata
    }
  }
}
```

#### Week 5-6: Logo & Branding System

**Create Logos for All Projects**
```
Designer Tasks:
1. A Curious Tractor (Main) - Primary brand
   - Full logo (text + mark)
   - Logo mark only
   - Horizontal & stacked variations
   - Light/dark versions

2. ACT Farm
   - Farm-focused identity
   - Maintain ACT connection
   - Variations for different contexts

3. JusticeHub
   - Youth-focused, empowering
   - Strong, modern aesthetic

4. The Harvest
   - Community, abundance themes
   - Warm, welcoming

5. Goods on Country
   - Commerce meets conservation
   - Distinctive but cohesive

Deliverables per project:
- SVG formats (optimized)
- PNG exports (multiple sizes)
- Favicon variations
- Social share images (OG tags)
- Brand guidelines document
```

**Brand Guidelines Structure**
```markdown
# A Curious Tractor Brand System

## Core Values
- Regeneration
- Co-stewardship
- Curiosity
- Place-based practice

## Visual Identity
- Color Palette (shared + project-specific)
- Typography (Fraunces display, Work Sans body)
- Photography style
- Illustration guidelines

## Voice & Tone
- Warm, inviting, intelligent
- Avoid jargon, embrace specificity
- Land-first language
- Community-centered

## Logo Usage
- Clear space requirements
- Minimum sizes
- Do's and don'ts
- File naming conventions
```

#### Week 7-8: Admin Wiki Media Management

**Build Media Management Interface**
```typescript
// admin-wiki/src/components/MediaManager.tsx
Features:
- Upload interface with drag-and-drop
- Automatic optimization pipeline
- Tag management and search
- Usage tracking across projects
- Bulk operations (tag, move, delete)
- Preview with metadata editing
- Project assignment controls
- Analytics dashboard
```

**Integration Points**
```typescript
// All projects import from shared library
import { MediaPicker } from '@act/shared-components'

<MediaPicker
  project="act-farm"
  mediaType="image"
  tags={['hero', 'farm']}
  onSelect={(media) => setHeroImage(media)}
/>
```

---

## 2. Logos & Icons Across All Sites

### Current State
- **Empathy Ledger:** ✅ 33 logo variations, professional system
- **All others:** ❌ No logo files found
- **Icons:** lucide-react used by 4 projects (408 total components)

### Strategic Goals
1. **Unified icon system** with project-specific additions
2. **Consistent logo placement** in headers/footers
3. **Favicon strategy** across all domains
4. **Social share images** (Open Graph) for each project

### Implementation

**Icon Library Wrapper**
```typescript
// packages/shared-components/src/icons/index.ts
import * as LucideIcons from 'lucide-react'

// Project-specific icon sets
export const ACTIcons = {
  // Shared ecosystem icons
  Farm: LucideIcons.Tractor,
  Community: LucideIcons.Users,
  Story: LucideIcons.BookOpen,

  // Custom SVG icons
  ACTMark: () => <svg>...</svg>,
  Goods: () => <svg>...</svg>,
}

// Usage in any project
import { ACTIcons } from '@act/shared-components/icons'
<ACTIcons.Farm className="w-5 h-5" />
```

**Logo Component**
```typescript
// Automatically loads from shared media bucket
<ProjectLogo
  project="act-farm"
  variant="horizontal" // horizontal, stacked, mark
  theme="light" // light, dark
  size="md" // sm, md, lg, xl
/>
```

---

## 3. Cross-Project Integration & Linking

### Current State
- **Minimal cross-linking:** Only ACT Farm → The Harvest link exists
- **No ecosystem navigation:** Each site feels isolated
- **Inconsistent branding:** No mention of ACT on most sites

### Strategic Goals
1. **Ecosystem badge** on every site showing ACT affiliation
2. **Smart cross-linking** based on user journey
3. **Unified navigation** in footers to sibling projects
4. **Referral tracking** via GHL to measure cross-project traffic

### Implementation

#### Ecosystem Badge Component
```typescript
// packages/shared-components/src/EcosystemBadge.tsx
<EcosystemBadge
  currentProject="justicehub"
  placement="header" // header, footer, sidebar
/>

// Renders:
// "Part of A Curious Tractor ecosystem"
// With dropdown/modal showing all 6 projects
```

#### Smart Cross-Links
```typescript
// Context-aware project suggestions
const CrossProjectSuggestions = {
  'act-farm': {
    afterBooking: ['the-harvest', 'goods-on-country'],
    storytellerInvite: ['empathy-ledger'],
    socialImpact: ['justicehub']
  },
  'justicehub': {
    afterStory: ['empathy-ledger'],
    familySupport: ['the-harvest'],
    youthPrograms: ['act-farm']
  },
  // ... etc
}

// Usage:
<ProjectSuggestion
  context="after-booking"
  currentProject="act-farm"
/>
// Renders: "Interested in community programs? Check out The Harvest"
```

#### Referral Tracking
```typescript
// GHL webhook integration
// Track cross-project user journeys
// Analytics in Admin Wiki

Example journey:
1. User discovers ACT Farm via Google
2. Books residency
3. Gets email about Empathy Ledger storytelling
4. Submits story to Empathy Ledger
5. Story syndicated to JusticeHub
6. Becomes CSA member at The Harvest

Result: Single user, 4 project touchpoints, tracked via email
```

---

## 4. Wiki as Shared Coordination Hub

### Current State
- **Basic dashboard** with system health
- **5 project cards** with mock data
- **Ecosystem map** visualization
- **No media management** functionality

### Strategic Goals
1. **Central media library** interface
2. **Cross-project analytics** dashboard
3. **Shared content calendar**
4. **Team directory** and access management
5. **Documentation hub** for all projects
6. **Real-time system status**

### Implementation

#### Enhanced Dashboard Features

**Media Management Tab**
- Upload to shared bucket
- Tag and categorize
- Assign to projects
- View usage analytics
- Bulk operations

**Content Calendar**
```typescript
// Unified calendar across all projects
Features:
- Blog post scheduling
- Event management
- Story publishing schedule
- Newsletter planning
- Social media coordination
- Cross-project campaigns
```

**Team Directory**
```typescript
// Central team management
Features:
- Staff profiles with photos (from shared media)
- Project assignments
- Contact information
- Access control per project
- Role-based permissions
- Activity logs
```

**Documentation Hub**
```markdown
Wiki Structure:
├── Getting Started/
│   ├── Local Development Setup
│   ├── Shared Component Library
│   └── Media Upload Guidelines
├── Brand Guidelines/
│   ├── Logo Usage
│   ├── Color System
│   └── Voice & Tone
├── Technical Docs/
│   ├── Supabase Setup
│   ├── GHL Integration
│   ├── Empathy Ledger API
│   └── Deployment Process
├── Project Specific/
│   ├── ACT Farm/
│   ├── JusticeHub/
│   └── ... (each project)
└── Templates/
    ├── Footer Code
    ├── Newsletter Signup
    └── Story Widget
```

**Real-Time System Monitoring**
```typescript
Features:
- API health checks (GHL, Supabase, Resend, Redis)
- Build status for all 6 projects
- Deployment notifications
- Error tracking aggregation
- Performance metrics
- Uptime monitoring
```

---

## 5. Empathy Ledger Story System Integration

### Current State
- **Robust story API** in Empathy Ledger
- **Story categories:** 8+ themes (Community Organizing, Environmental Justice, etc.)
- **Filtering & discovery** components built
- **JusticeHub integration** already exists (empathy-ledger-client.ts)
- **No integration** in other projects

### Strategic Goals
1. **Syndicate stories** to all relevant projects
2. **Category-based filtering** per project context
3. **Shared story widget** component
4. **Unified submission** flow with project context
5. **Cross-project story analytics**

### Implementation

#### Universal Story Widget
```typescript
// packages/shared-components/src/EmpathyStories.tsx
import { createClient } from '@supabase/supabase-js'

interface EmpathyStoriesProps {
  project: 'act-farm' | 'justicehub' | 'the-harvest' | 'main'
  themes?: string[] // Filter by relevant themes
  featured?: boolean
  limit?: number
  layout?: 'grid' | 'carousel' | 'list'
}

export function EmpathyStories({
  project,
  themes = [],
  featured = false,
  limit = 3,
  layout = 'grid'
}: EmpathyStoriesProps) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_EMPATHY_LEDGER_URL!,
    process.env.NEXT_PUBLIC_EMPATHY_LEDGER_ANON_KEY!
  )

  const { data: stories } = useQuery({
    queryKey: ['empathy-stories', project, themes],
    queryFn: async () => {
      let query = supabase
        .from('storyteller_profiles')
        .select(`
          *,
          stories:storyteller_stories(*)
        `)
        .eq(`${project}_enabled`, true)

      if (featured) {
        query = query.eq(`${project}_featured`, true)
      }

      if (themes.length > 0) {
        query = query.overlaps('story_categories', themes)
      }

      return query.limit(limit)
    }
  })

  return <StoryGrid stories={stories} layout={layout} />
}
```

#### Project-Specific Story Themes

**ACT Farm Stories**
```typescript
<EmpathyStories
  project="act-farm"
  themes={[
    'Environmental Justice',
    'Arts & Culture',
    'Community Organizing'
  ]}
  featured={true}
  limit={4}
/>

// Show: Resident reflections, land stewardship stories, artist experiences
```

**JusticeHub Stories** ✅ Already integrated
```typescript
<EmpathyStories
  project="justicehub"
  themes={[
    'Youth Development',
    'Community Organizing',
    'Economic Justice'
  ]}
  featured={true}
/>

// Show: Youth voices, family experiences, system navigation stories
```

**The Harvest Stories**
```typescript
<EmpathyStories
  project="the-harvest"
  themes={[
    'Community Organizing',
    'Environmental Justice',
    'Economic Justice'
  ]}
  limit={6}
/>

// Show: CSA member experiences, volunteer stories, community impact
```

**Main Site Stories**
```typescript
<EmpathyStories
  project="main"
  themes={[]} // All themes
  featured={true}
  limit={8}
/>

// Show: Ecosystem-wide impact stories, cross-project narratives
```

#### Story Submission Flow
```typescript
// Unified story submission with project context
<StorySubmitButton
  source="act-farm"
  prefilledContext={{
    categories: ['Environmental Justice'],
    tags: ['residency', 'farm'],
    prompt: 'Tell us about your experience at ACT Farm'
  }}
/>

// Redirects to Empathy Ledger with context
// Or: Embedded form that posts to Empathy Ledger API
```

#### Database Schema Extensions
```sql
-- Extend Empathy Ledger storyteller_profiles
ALTER TABLE storyteller_profiles ADD COLUMN IF NOT EXISTS
  act_farm_enabled BOOLEAN DEFAULT FALSE,
  act_farm_featured BOOLEAN DEFAULT FALSE,
  the_harvest_enabled BOOLEAN DEFAULT FALSE,
  the_harvest_featured BOOLEAN DEFAULT FALSE,
  main_site_enabled BOOLEAN DEFAULT FALSE,
  main_site_featured BOOLEAN DEFAULT FALSE;

-- Track story views per project
CREATE TABLE story_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  story_id UUID REFERENCES storyteller_stories,
  project TEXT, -- 'act-farm', 'justicehub', etc.
  view_count INTEGER DEFAULT 0,
  last_viewed_at TIMESTAMPTZ,
  referrer TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 6. Unified Footer Strategy

### Current State
- **Inconsistent implementations:** 3 have footers, 3 don't
- **No cross-linking:** Only 1 project links to another
- **Varied contact info:** Multiple emails, no standardization
- **No ecosystem branding:** Most don't mention ACT

### Strategic Goals
1. **Standardized footer component** across all projects
2. **Consistent ACT ecosystem branding**
3. **Smart cross-project navigation**
4. **Unified newsletter signup** (GHL)
5. **Jinibara Country acknowledgment** on all sites
6. **Shared contact strategy**

### Implementation

#### Universal Footer Component
```typescript
// packages/shared-components/src/UnifiedFooter.tsx

interface FooterConfig {
  project: 'main' | 'act-farm' | 'justicehub' | 'empathy-ledger' | 'the-harvest' | 'goods'

  // Project-specific customization
  description?: string
  customLinks?: Array<{ label: string, href: string }>
  contactEmail?: string

  // Feature toggles
  showNewsletter?: boolean
  showSiblingProjects?: boolean
  showStories?: boolean // Empathy Ledger story widget

  // Theme
  variant?: 'light' | 'dark'
}

export function UnifiedFooter({
  project,
  description,
  customLinks = [],
  contactEmail,
  showNewsletter = true,
  showSiblingProjects = true,
  showStories = true,
  variant = 'dark'
}: FooterConfig) {
  const siblingProjects = getSiblingProjects(project)

  return (
    <footer className={cn(
      'border-t',
      variant === 'dark' ? 'bg-stone-900 text-stone-100' : 'bg-stone-50 text-stone-900'
    )}>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-4">

          {/* Column 1: About This Project */}
          <div className="lg:col-span-1">
            <ProjectLogo
              project={project}
              variant="horizontal"
              theme={variant}
              size="md"
            />
            <p className="mt-4 text-sm opacity-80">
              {description || getDefaultDescription(project)}
            </p>

            {/* Project-specific links */}
            {customLinks.length > 0 && (
              <nav className="mt-6 space-y-2">
                {customLinks.map(link => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="block text-sm hover:opacity-100 opacity-80 transition"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            )}
          </div>

          {/* Column 2: ACT Ecosystem */}
          {showSiblingProjects && (
            <div>
              <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider">
                ACT Ecosystem
              </h3>
              <nav className="space-y-3">
                {siblingProjects.map(sibling => (
                  <a
                    key={sibling.slug}
                    href={sibling.url}
                    className="group block"
                  >
                    <div className="text-sm font-medium group-hover:opacity-100 opacity-90 transition">
                      {sibling.name}
                    </div>
                    <div className="text-xs opacity-60 mt-0.5">
                      {sibling.tagline}
                    </div>
                  </a>
                ))}
              </nav>

              <div className="mt-6 pt-6 border-t border-white/10">
                <EcosystemBadge currentProject={project} />
              </div>
            </div>
          )}

          {/* Column 3: Featured Stories (if enabled) */}
          {showStories && (
            <div>
              <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider">
                Stories from Our Community
              </h3>
              <EmpathyStories
                project={project}
                limit={2}
                layout="list"
                featured={true}
              />
              <a
                href={getEmpathyLedgerUrl()}
                className="mt-4 inline-flex items-center text-sm font-medium hover:opacity-100 opacity-80"
              >
                Read more stories →
              </a>
            </div>
          )}

          {/* Column 4: Connect */}
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider">
              Connect
            </h3>

            {/* Contact */}
            <div className="space-y-3 mb-6">
              <a
                href={`mailto:${contactEmail || 'hi@act.place'}`}
                className="block text-sm hover:opacity-100 opacity-80"
              >
                {contactEmail || 'hi@act.place'}
              </a>

              <SocialLinks variant={variant} />
            </div>

            {/* Newsletter */}
            {showNewsletter && (
              <div className="mt-6 pt-6 border-t border-white/10">
                <NewsletterSignup
                  project={project}
                  variant={variant}
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs opacity-60">
          <div>
            <JinibaraAcknowledgment />
          </div>

          <div className="flex gap-6">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <span>© {new Date().getFullYear()} A Curious Tractor</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
```

#### Supporting Components

**Ecosystem Badge**
```typescript
function EcosystemBadge({ currentProject }: { currentProject: string }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <ACTIcons.Mark className="w-4 h-4" />
      <span className="opacity-60">
        Part of the{' '}
        <a
          href="https://act.place"
          className="font-medium opacity-100 hover:underline"
        >
          A Curious Tractor
        </a>
        {' '}ecosystem
      </span>
    </div>
  )
}
```

**Jinibara Acknowledgment**
```typescript
function JinibaraAcknowledgment() {
  return (
    <p className="text-xs opacity-60">
      We acknowledge the Jinibara people as the Traditional Custodians of the land
      on which we work and live. We pay our respects to Elders past and present,
      and extend that respect to all Aboriginal and Torres Strait Islander peoples.
    </p>
  )
}
```

**Newsletter Signup**
```typescript
function NewsletterSignup({
  project,
  variant
}: {
  project: string
  variant: 'light' | 'dark'
}) {
  return (
    <div>
      <h4 className="font-medium text-sm mb-2">Stay Connected</h4>
      <p className="text-xs opacity-70 mb-4">
        Get updates about {getProjectName(project)} and the ACT ecosystem
      </p>

      {/* GHL embed or custom form */}
      <GHLNewsletterEmbed
        project={project}
        variant={variant}
      />
    </div>
  )
}
```

#### Project-Specific Configurations

**A Curious Tractor Main Site**
```typescript
<UnifiedFooter
  project="main"
  description="A regenerative innovation studio stewarding a working farm on Jinibara Country"
  customLinks={[
    { label: 'About', href: '/about' },
    { label: 'Projects', href: '/projects' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' }
  ]}
  contactEmail="hi@act.place"
  showNewsletter={true}
  showSiblingProjects={true}
  showStories={true}
  variant="light"
/>
```

**ACT Farm**
```typescript
<UnifiedFooter
  project="act-farm"
  description="Low-impact eco-residencies and R&D prototyping at Black Cockatoo Valley. Conservation-first experiences on Jinibara lands."
  customLinks={[
    { label: 'About', href: '/about' },
    { label: 'Residencies', href: '/residencies' },
    { label: 'Activities', href: '/activities' },
    { label: 'Conservation Map', href: '/map' }
  ]}
  contactEmail="hello@acurioustractor.com"
  variant="dark"
/>
```

**JusticeHub**
```typescript
<UnifiedFooter
  project="justicehub"
  description="Infrastructure for justice innovation and civic imagination"
  customLinks={[
    { label: 'Stories', href: '/stories' },
    { label: 'Services', href: '/services' },
    { label: 'Campaigns', href: '/campaigns' },
    { label: 'Get Involved', href: '/get-involved' }
  ]}
  contactEmail="hello@act.place"
  variant="dark"
/>
```

**Empathy Ledger**
```typescript
<UnifiedFooter
  project="empathy-ledger"
  description="A living record of care, accountability, and shared memory"
  customLinks={[
    { label: 'Discover Stories', href: '/discover' },
    { label: 'For Organizations', href: '/organizations' },
    { label: 'Storyteller Portal', href: '/portal' }
  ]}
  showStories={false} // Don't show stories widget on story platform
  variant="light"
/>
```

**The Harvest**
```typescript
<UnifiedFooter
  project="the-harvest"
  description="Community hub, event space, and CSA programs rooted in shared stewardship"
  customLinks={[
    { label: 'Visit', href: '/visit' },
    { label: 'Get Involved', href: '/get-involved' },
    { label: 'Events', href: '/events' },
    { label: 'CSA Program', href: '/csa' }
  ]}
  contactEmail="hi@theharvestwitta.com.au"
  variant="dark"
/>
```

**Goods on Country**
```typescript
<UnifiedFooter
  project="goods"
  description="Objects and offerings that fund the commons"
  customLinks={[
    { label: 'Shop', href: '/shop' },
    { label: 'About', href: '/about' },
    { label: 'Wholesale', href: '/wholesale' }
  ]}
  variant="light"
/>
```

---

## 7. Implementation Timeline

### Week 1-2: Foundation & Critical Fixes
- [ ] **The Harvest image optimization** (180MB → 20MB)
- [ ] **ACT Farm image optimization** (5MB → 1.5MB)
- [ ] **Media audit** across all projects
- [ ] **Set up shared Supabase bucket** structure
- [ ] **Logo design kickoff** for 5 projects

### Week 3-4: Shared Infrastructure
- [ ] **Database schema** for shared_media_assets
- [ ] **Shared component library** setup (@act/shared-components)
- [ ] **Media upload pipeline** with Sharp optimization
- [ ] **Logo delivery** and Supabase upload
- [ ] **Brand guidelines** documentation

### Week 5-6: Integration Layer
- [ ] **UnifiedFooter component** development
- [ ] **EmpathyStories widget** development
- [ ] **MediaPicker component** development
- [ ] **Icon library wrapper**
- [ ] **Newsletter integration** (GHL)

### Week 7-8: Deployment & Testing
- [ ] **Deploy UnifiedFooter** to all 6 projects
- [ ] **Deploy story widgets** to ACT Farm, The Harvest, Main Site
- [ ] **Admin Wiki media management** interface
- [ ] **Cross-project linking** implementation
- [ ] **Testing & QA** across all sites
- [ ] **Analytics setup** for cross-project tracking
- [ ] **Documentation** completion

---

## 8. Success Metrics

### Technical Metrics
- **Image optimization:** 180MB → <30MB total (83% reduction)
- **Page load time:** <3s on all sites
- **Shared component usage:** 100% footer adoption
- **Media reuse:** Track duplicate→shared migrations

### User Experience Metrics
- **Cross-project navigation:** Track footer link clicks
- **Story engagement:** Views per project for Empathy Ledger stories
- **Newsletter signups:** Conversion rate per project
- **Referral flows:** Users visiting 2+ ACT projects

### Brand Metrics
- **Visual consistency:** All sites use ACT logos
- **Ecosystem awareness:** Survey users about ACT connection
- **Media quality:** Professional photography across sites

---

## 9. Dependencies & Risks

### Technical Dependencies
- **Supabase Storage** quota (monitor usage)
- **Sharp** for image processing (requires native dependencies)
- **GHL API** rate limits for newsletter
- **Vercel** build times with shared components

### Resource Dependencies
- **Designer** for logo creation (5 projects × 3 variations)
- **Photographer** for team/shared imagery
- **Content writer** for brand guidelines
- **Developer time** estimate: 120-160 hours over 8 weeks

### Risks & Mitigation
- **Risk:** Sites breaking during footer migration
  - *Mitigation:* Deploy to staging first, gradual rollout

- **Risk:** Logo design delays
  - *Mitigation:* Phase 1 with placeholder, Phase 2 full rollout

- **Risk:** Performance regression from shared components
  - *Mitigation:* Bundle size monitoring, lazy loading

- **Risk:** Media storage costs exceed budget
  - *Mitigation:* Monitor Supabase usage, implement CDN caching

---

## 10. Next Steps

### Immediate Actions (This Week)
1. **Review this roadmap** with team
2. **Prioritize logo design** projects
3. **Assign developer** to image optimization
4. **Set up Supabase shared project**
5. **Create GitHub project** for tracking

### Decision Points
- **Logo design:** In-house vs agency?
- **Shared component library:** Monorepo vs separate package?
- **Newsletter strategy:** Single list vs segmented?
- **Contact email:** Centralized vs project-specific?

### Team Alignment
- **Weekly syncs** during implementation
- **Design reviews** for logos and footers
- **QA checkpoints** after each phase
- **Launch coordination** for footer rollout

---

## Appendix: File Reference

### Key Files Modified

**Main Site:**
- `/src/app/layout.tsx` - Add UnifiedFooter
- `/src/components/Footer.tsx` - New component

**ACT Farm:**
- `/components/layout/Footer.tsx` - Replace with UnifiedFooter
- `/app/page.tsx` - Update footer usage

**JusticeHub:**
- `/src/components/site-footer.tsx` - Replace with UnifiedFooter
- `/src/app/layout.tsx` - Update footer

**Empathy Ledger:**
- `/src/components/layout/Footer.tsx` - Replace stub with UnifiedFooter
- `/src/app/layout.tsx` - Update footer

**The Harvest:**
- Create `/client/src/components/Footer.tsx` - New UnifiedFooter
- `/client/src/components/layout.tsx` - Add footer

**Admin Wiki:**
- `/src/components/MediaManager.tsx` - New media management interface
- `/src/components/Dashboard.tsx` - Add media management tab

### New Packages
- `packages/shared-components/` - Shared component library
- `packages/shared-types/` - TypeScript types
- `packages/shared-utils/` - Utility functions

---

**Document Version:** 1.0
**Last Updated:** December 24, 2024
**Owner:** A Curious Tractor Team
**Review Frequency:** Weekly during implementation, then quarterly
