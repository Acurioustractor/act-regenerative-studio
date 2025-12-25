# Multi-Repository Changelog

**Purpose:** Track changes that span multiple ACT codebases

**Repos:**
- Empathy Ledger v.02 (`/Users/benknight/Code/Empathy Ledger v.02`)
- ACT Main Website (`/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio`)
- ACT Placemat (`/Users/benknight/Code/ACT Placemat`)

---

## 2024-12-24 - ACT Project Tagging System

### Summary
Created bidirectional opt-in system for featuring Empathy Ledger storytellers on ACT project pages.

### Changes Made

#### Empathy Ledger v.02
- **Database:**
  - Created: `/supabase/migrations/20251224000001_act_project_tagging_system_fixed.sql`
  - Added 5 tables: `act_projects`, `act_project_tags`, `storyteller_project_features`, `story_project_features`, `act_admins`
  - Added view: `act_featured_storytellers`
  - Added RLS policies for all tables
  - Seeded 9 ACT projects

- **API:**
  - Created: `/src/app/api/v1/act-projects/[slug]/featured/route.ts`
  - Endpoint: `GET /api/v1/act-projects/{slug}/featured`
  - Returns: `FeaturedContentResponse` (storytellers + stories)

- **UI:**
  - Created: `/src/components/dashboard/ACTProjectOptIn.tsx` (storyteller opt-in dashboard)
  - Created: `/src/app/admin/act-featured/page.tsx` (admin approval interface)
  - Created: `/src/lib/supabase/client.ts` (client-side Supabase helper)
  - Created: `/src/lib/supabase/server.ts` (server-side Supabase helper)
  - Created: `/src/components/ui/button.tsx` (shadcn/ui component)

- **Types:**
  - Created: `/src/types/shared/act-featured-content.ts` (synced from ACT Website)

#### ACT Main Website
- **Types (SOURCE OF TRUTH):**
  - Created: `/src/types/shared/act-featured-content.ts`
  - Defines: `ACTProject`, `FeaturedStoryteller`, `FeaturedStory`, `FeaturedContentResponse`
  - Includes runtime validation helper

- **API Client:**
  - Created: `/src/lib/empathy-ledger-featured.ts`
  - Function: `getFeaturedContentForProject(projectSlug)`
  - Includes runtime validation and error handling
  - 5-minute cache (`revalidate: 300`)

- **UI:**
  - Created: `/src/components/projects/CommunityVoicesSection.tsx`
  - Displays featured storytellers and stories on project pages

- **Data:**
  - Modified: `/src/data/projects.ts`
  - Extended from 6 to 36 projects
  - Added photos and video URLs to projects

- **Pages:**
  - Modified: `/src/app/projects/[slug]/page.tsx`
  - Integrated `getFeaturedContentForProject()` and `CommunityVoicesSection`

#### Documentation
- Created: `/ACT_PROJECT_TAGGING_SYSTEM.md` (600+ lines)
- Created: `/QUICK_START_ACT_TAGGING.md`
- Created: `/.claude/skills/multi-repo-sync.md` (this skill)
- Created: `/CROSS_CODEBASE_BEST_PRACTICES.md` (comprehensive guide)

### API Contract

**Endpoint:** `GET /api/v1/act-projects/{slug}/featured`

**Request Parameters:**
- `slug` (path): Project slug (e.g., "justicehub")
- `type` (query, optional): Filter by "storytellers", "stories", or "all" (default)
- `limit` (query, optional): Max results per type (default: 10)

**Response Type:** `FeaturedContentResponse`
```typescript
{
  project: {
    id: string;
    slug: string;
    title: string;
    organization_name: string;
    focus_areas: string[];
    themes: string[];
    website_url?: string;
    active: boolean;
  };
  featured: {
    storytellers: Array<{
      storyteller_id: string;
      display_name: string;
      profile_image_url?: string;
      featured_bio?: string;
      featured_tagline?: string;
      opted_in_at: string;
      approved_at?: string;
    }>;
    stories: Array<{
      story_id: string;
      title: string;
      excerpt?: string;
      featured_quote?: string;
      storyteller_id: string;
      storyteller_name: string;
      published_at: string;
      approved_at?: string;
    }>;
  };
  meta: {
    storyteller_count: number;
    story_count: number;
    fetched_at: string;
  };
}
```

**Breaking:** No (new endpoint)

### Testing
- [x] Database migration ran successfully
- [x] Admin permissions granted (benjamin@act.place)
- [x] Types synced between repos
- [x] API endpoint created
- [x] Client function created
- [x] Display component created
- [ ] End-to-end test (pending: missing UI components)

### Deployment
- [ ] Empathy Ledger: Database migration deployed
- [ ] Empathy Ledger: API and UI deployed
- [ ] ACT Website: Consumer deployed

### Known Issues
- Missing UI components in Empathy Ledger: `select`, `card`, `checkbox`, `label`
- Dashboard integration: ACTProjectOptIn not wired into main navigation yet

---

## Template for Future Changes

```markdown
## YYYY-MM-DD - [Change Description]

### Summary
[Brief description of what changed and why]

### Changes Made

#### Empathy Ledger v.02
- **Database:**
  - Created/Modified: [file paths]
  - [Description of changes]

- **API:**
  - Created/Modified: [file paths]
  - Endpoints: [list endpoints]

- **UI:**
  - Created/Modified: [file paths]

- **Types:**
  - Created/Modified: [file paths]

#### ACT Main Website
- **Types (SOURCE OF TRUTH):**
  - Created/Modified: [file paths]

- **API Client:**
  - Created/Modified: [file paths]

- **UI:**
  - Created/Modified: [file paths]

#### ACT Placemat
- [Similar structure]

### API Contract (if applicable)

**Endpoint:** `METHOD /api/vX/path`

**Request:**
[Request structure]

**Response:**
[Response structure]

**Breaking:** Yes/No

### Testing
- [ ] Type checking passed in all repos
- [ ] Unit tests passed
- [ ] Integration tests passed
- [ ] Manual testing completed

### Deployment
- [ ] Database migration deployed
- [ ] Empathy Ledger deployed
- [ ] ACT Website deployed
- [ ] ACT Placemat deployed

### Known Issues
[List any issues or follow-up work needed]
```

---

## Quick Commands

### Sync Types from ACT Website to Empathy Ledger
```bash
cp "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio/src/types/shared/"* \
   "/Users/benknight/Code/Empathy Ledger v.02/src/types/shared/"
```

### Type Check All Repos
```bash
for repo in \
  "/Users/benknight/Code/Empathy Ledger v.02" \
  "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio"
do
  echo "Checking $repo..."
  (cd "$repo" && npm run type-check)
done
```

### Start All Dev Servers
```bash
cd "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio"
./start-all.sh
```
