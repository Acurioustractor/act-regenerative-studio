# Cross-Codebase Management Best Practices

**For:** ACT Farm ecosystem with multiple interconnected Next.js applications

**Last Updated:** December 24, 2024

---

## Table of Contents

1. [Overview](#overview)
2. [The Three Codebases](#the-three-codebases)
3. [Principles](#principles)
4. [File Organization](#file-organization)
5. [Type Safety Workflow](#type-safety-workflow)
6. [API Contract Management](#api-contract-management)
7. [Database Schema Coordination](#database-schema-coordination)
8. [Development Workflow](#development-workflow)
9. [Testing Strategy](#testing-strategy)
10. [Deployment Coordination](#deployment-coordination)
11. [Common Pitfalls](#common-pitfalls)
12. [Checklists](#checklists)

---

## Overview

The ACT Farm ecosystem consists of three interconnected Next.js applications that share data, APIs, and user experiences. Changes in one codebase often require coordinated updates in others.

**Key Challenge:** Maintaining type safety and API contracts across codebases without creating tight coupling.

**Solution:** Single source of truth for shared types + runtime validation + coordinated testing.

---

## The Three Codebases

### 1. Empathy Ledger v.02
- **Path:** `/Users/benknight/Code/Empathy Ledger v.02`
- **Role:** API provider, data owner
- **Stack:** Next.js 15, Supabase, TypeScript
- **Responsibilities:**
  - Storyteller profiles and stories
  - ACT project tagging system
  - User authentication (Supabase Auth)
  - Provides APIs for other projects

**Key Files:**
- `/src/app/api/v1/**` - Public APIs consumed by other codebases
- `/src/types/shared/**` - Shared type definitions (copied from ACT Website)
- `/supabase/migrations/**` - Database schema

### 2. ACT Main Website (ACT Farm and Regenerative Innovation Studio)
- **Path:** `/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio`
- **Role:** Public website, API consumer, shared types source of truth
- **Stack:** Next.js 16, TypeScript, Tailwind
- **Responsibilities:**
  - Project showcase pages
  - Featured storyteller/story display
  - Public-facing content
  - Shared type definitions (source of truth)

**Key Files:**
- `/src/types/shared/**` - **SOURCE OF TRUTH** for all shared types
- `/src/lib/empathy-ledger-featured.ts` - API client for Empathy Ledger
- `/src/app/projects/[slug]/page.tsx` - Consumes featured content API

### 3. ACT Placemat
- **Path:** `/Users/benknight/Code/ACT Placemat`
- **Role:** Backend services, admin tools
- **Stack:** Next.js 14, Supabase
- **Responsibilities:**
  - Year-in-review data
  - Project metadata
  - Backend workflows

**Key Files:**
- `/apps/backend/src/services/**` - Backend business logic
- `/supabase/migrations/**` - Backend-specific schema

---

## Principles

### 1. Single Source of Truth for Types

**Rule:** ACT Main Website is the source of truth for all shared types.

**Why:** It's the consumer of APIs, so it defines what it expects to receive.

**Implementation:**
```typescript
// ACT Main Website: /src/types/shared/act-featured-content.ts
export interface FeaturedContentResponse {
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

**Sync to Empathy Ledger:**
```bash
cp "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio/src/types/shared/act-featured-content.ts" \
   "/Users/benknight/Code/Empathy Ledger v.02/src/types/shared/act-featured-content.ts"
```

### 2. Runtime Validation at Boundaries

**Rule:** Never trust data crossing codebase boundaries, even with TypeScript.

**Why:** Types are erased at runtime. API responses, database queries, and external data need validation.

**Implementation:**
```typescript
// Consumer side (ACT Website)
function isValidFeaturedContentResponse(data: any): data is FeaturedContentResponse {
  return (
    data &&
    typeof data === 'object' &&
    'project' in data &&
    'featured' in data &&
    Array.isArray(data.featured.storytellers)
  );
}

export async function getFeaturedContent(slug: string) {
  const response = await fetch(`/api/v1/act-projects/${slug}/featured`);
  const data = await response.json();

  if (!isValidFeaturedContentResponse(data)) {
    console.error('Invalid API response:', data);
    return null;
  }

  return data; // TypeScript now knows this is FeaturedContentResponse
}
```

### 3. API Versioning for Breaking Changes

**Rule:** Use URL versioning (`/api/v1/`, `/api/v2/`) for all public APIs.

**Why:** Prevents breaking existing consumers when you need to change response structure.

**Implementation:**
```typescript
// Empathy Ledger API
// /src/app/api/v1/act-projects/[slug]/featured/route.ts  ← Current version
// /src/app/api/v2/act-projects/[slug]/featured/route.ts  ← Future breaking change

// When you need to break the contract:
// 1. Create v2 endpoint
// 2. Update consumers to use v2
// 3. Keep v1 for 1 release cycle
// 4. Add deprecation warning to v1
// 5. Remove v1
```

### 4. Additive-Only Database Changes

**Rule:** Database migrations should add, never modify or remove (until you're sure it's safe).

**Why:** Downtime-free deployments require backward compatibility.

**Implementation:**
```sql
-- ✅ GOOD: Adding a new column with default value
ALTER TABLE storytellers
ADD COLUMN featured_bio TEXT DEFAULT NULL;

-- ❌ BAD: Renaming a column (breaks existing queries)
ALTER TABLE storytellers
RENAME COLUMN bio TO featured_bio;

-- ✅ GOOD: Add new column, migrate data, then deprecate old
ALTER TABLE storytellers ADD COLUMN featured_bio TEXT;
UPDATE storytellers SET featured_bio = bio WHERE featured_bio IS NULL;
-- Deploy code to use featured_bio
-- Wait 1 release cycle
-- Then: ALTER TABLE storytellers DROP COLUMN bio;
```

### 5. Fail Gracefully

**Rule:** If an API or integration fails, degrade gracefully rather than crashing.

**Implementation:**
```typescript
// ACT Website project page
const featuredContent = await getFeaturedContentForProject(project.slug);

// Don't crash if API fails
if (!featuredContent) {
  return (
    <div>
      <h1>{project.title}</h1>
      {/* Show project without featured content */}
    </div>
  );
}

// Show full experience when API works
return (
  <div>
    <h1>{project.title}</h1>
    <CommunityVoicesSection
      storytellers={featuredContent.featured.storytellers}
      stories={featuredContent.featured.stories}
    />
  </div>
);
```

---

## File Organization

### Shared Types Directory Structure

```
ACT Main Website (SOURCE OF TRUTH)
└── src/
    └── types/
        └── shared/           ← All types used across codebases
            ├── act-featured-content.ts
            ├── api-contracts.ts
            ├── database-types.ts
            └── common.ts

Empathy Ledger (COPY)
└── src/
    └── types/
        └── shared/           ← Copied from ACT Website
            ├── act-featured-content.ts  (synced)
            ├── api-contracts.ts         (synced)
            └── ...
```

### Naming Conventions

**Shared Types:**
- Use descriptive, domain-specific names
- Include "Response", "Request", "Entity" suffixes
- Example: `FeaturedContentResponse`, `ACTProject`, `CreateStoryRequest`

**API Routes:**
- Follow REST conventions
- Version in URL: `/api/v1/resource`
- Use plural nouns: `/api/v1/projects`, not `/api/v1/project`

**Database Tables:**
- Use snake_case
- Plural nouns: `act_projects`, `storyteller_project_features`
- Add context prefix if needed: `act_*`, `story_*`

---

## Type Safety Workflow

### Step-by-Step: Adding a New Shared Type

**Scenario:** You need to add a new API endpoint that returns user bookmarks.

#### 1. Define Types in ACT Main Website (Source of Truth)

```typescript
// /Users/benknight/Code/ACT Farm and Regenerative Innovation Studio/src/types/shared/bookmarks.ts

/**
 * Shared types for User Bookmarks API
 * Created: 2024-12-24
 * Used by: Empathy Ledger API, ACT Website
 */

export interface Bookmark {
  id: string;
  user_id: string;
  content_type: 'story' | 'project' | 'storyteller';
  content_id: string;
  created_at: string;
  note?: string;
}

export namespace BookmarksAPI {
  export interface GetBookmarksRequest {
    userId: string;
    contentType?: 'story' | 'project' | 'storyteller';
    limit?: number;
    offset?: number;
  }

  export interface GetBookmarksResponse {
    bookmarks: Bookmark[];
    total_count: number;
    has_more: boolean;
  }

  export interface CreateBookmarkRequest {
    content_type: 'story' | 'project' | 'storyteller';
    content_id: string;
    note?: string;
  }

  export interface CreateBookmarkResponse {
    bookmark: Bookmark;
  }
}
```

#### 2. Copy to Empathy Ledger

```bash
cp "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio/src/types/shared/bookmarks.ts" \
   "/Users/benknight/Code/Empathy Ledger v.02/src/types/shared/bookmarks.ts"

# Add sync timestamp
echo "// Synced from ACT Main Website on $(date)" | \
  cat - "/Users/benknight/Code/Empathy Ledger v.02/src/types/shared/bookmarks.ts" > temp && \
  mv temp "/Users/benknight/Code/Empathy Ledger v.02/src/types/shared/bookmarks.ts"
```

#### 3. Implement API Provider (Empathy Ledger)

```typescript
// /Users/benknight/Code/Empathy Ledger v.02/src/app/api/v1/bookmarks/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { BookmarksAPI } from '@/types/shared/bookmarks';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest
): Promise<NextResponse<BookmarksAPI.GetBookmarksResponse>> {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const contentType = searchParams.get('contentType');
  const limit = parseInt(searchParams.get('limit') || '20');

  if (!userId) {
    return NextResponse.json(
      { error: 'userId required' } as any,
      { status: 400 }
    );
  }

  const supabase = await createClient();

  let query = supabase
    .from('bookmarks')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (contentType) {
    query = query.eq('content_type', contentType);
  }

  const { data, count, error } = await query;

  if (error) {
    return NextResponse.json(
      { error: error.message } as any,
      { status: 500 }
    );
  }

  const response: BookmarksAPI.GetBookmarksResponse = {
    bookmarks: data || [],
    total_count: count || 0,
    has_more: (count || 0) > limit,
  };

  return NextResponse.json(response);
}
```

#### 4. Implement API Consumer (ACT Website)

```typescript
// /Users/benknight/Code/ACT Farm and Regenerative Innovation Studio/src/lib/empathy-ledger-bookmarks.ts
import { BookmarksAPI, Bookmark } from '@/types/shared/bookmarks';

const EMPATHY_LEDGER_URL = process.env.NEXT_PUBLIC_EMPATHY_LEDGER_URL || 'http://localhost:3001';

function isValidBookmarksResponse(data: any): data is BookmarksAPI.GetBookmarksResponse {
  return (
    data &&
    typeof data === 'object' &&
    Array.isArray(data.bookmarks) &&
    typeof data.total_count === 'number' &&
    typeof data.has_more === 'boolean'
  );
}

export async function getUserBookmarks(
  userId: string,
  options: { contentType?: string; limit?: number } = {}
): Promise<Bookmark[]> {
  const params = new URLSearchParams({
    userId,
    ...(options.contentType && { contentType: options.contentType }),
    ...(options.limit && { limit: options.limit.toString() }),
  });

  try {
    const response = await fetch(
      `${EMPATHY_LEDGER_URL}/api/v1/bookmarks?${params}`,
      { next: { revalidate: 60 } } // Cache for 1 minute
    );

    if (!response.ok) {
      console.error('Bookmarks API error:', response.status);
      return [];
    }

    const data = await response.json();

    if (!isValidBookmarksResponse(data)) {
      console.error('Invalid bookmarks API response:', data);
      return [];
    }

    return data.bookmarks;
  } catch (error) {
    console.error('Failed to fetch bookmarks:', error);
    return [];
  }
}
```

#### 5. Type Check Both Repos

```bash
# Check Empathy Ledger
cd "/Users/benknight/Code/Empathy Ledger v.02"
npm run type-check

# Check ACT Website
cd "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio"
npm run type-check
```

#### 6. Document in Changelog

```bash
cat >> "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio/MULTI_REPO_CHANGELOG.md" <<EOF

## 2024-12-24 - Added User Bookmarks API

### Changes Made
- **ACT Main Website**
  - Created: \`/src/types/shared/bookmarks.ts\` (source of truth)
  - Created: \`/src/lib/empathy-ledger-bookmarks.ts\` (API client)

- **Empathy Ledger v.02**
  - Created: \`/src/types/shared/bookmarks.ts\` (synced from ACT Website)
  - Created: \`/src/app/api/v1/bookmarks/route.ts\` (API implementation)

### API Contract
- Endpoint: \`GET /api/v1/bookmarks\`
- Request params: \`userId\`, \`contentType?\`, \`limit?\`
- Response: \`BookmarksAPI.GetBookmarksResponse\`
- Breaking: No (new endpoint)

### Testing
- [x] Type checking passed in both repos
- [x] API returns correct structure
- [x] Client validates response
- [x] Handles errors gracefully

EOF
```

---

## API Contract Management

### Creating a New API Endpoint (Checklist)

- [ ] **Define types in ACT Main Website first** (`/src/types/shared/`)
- [ ] **Copy types to Empathy Ledger** (`/src/types/shared/`)
- [ ] **Implement provider in Empathy Ledger** (`/src/app/api/v1/`)
- [ ] **Add runtime validation** (type guards)
- [ ] **Implement consumer in ACT Website** (`/src/lib/`)
- [ ] **Add error handling and fallbacks**
- [ ] **Type check both repos**
- [ ] **Test locally** (both dev servers running)
- [ ] **Document in changelog**
- [ ] **Deploy provider first, then consumer**

### Modifying an Existing API (Breaking vs Non-Breaking)

**Non-Breaking Changes (Safe):**
- Adding optional fields to request
- Adding new fields to response
- Adding new endpoints
- Making required fields optional
- Relaxing validation rules

**Breaking Changes (Require Versioning):**
- Removing fields from response
- Renaming fields
- Changing field types
- Making optional fields required
- Changing validation rules (stricter)

**Example: Non-Breaking Addition**

```typescript
// BEFORE
export interface FeaturedStoryteller {
  storyteller_id: string;
  display_name: string;
}

// AFTER (non-breaking - added optional field)
export interface FeaturedStoryteller {
  storyteller_id: string;
  display_name: string;
  profile_image_url?: string;  // ← New optional field
}

// Old consumers still work! They just ignore the new field.
```

**Example: Breaking Change (Requires v2)**

```typescript
// v1: /api/v1/storytellers/[id]
export interface StoryellerResponse {
  id: string;
  name: string;  // ← Consumers expect this
}

// v2: /api/v2/storytellers/[id]
export interface StorytellerResponseV2 {
  id: string;
  display_name: string;  // ← Renamed field (BREAKING!)
  full_name: string;     // ← New field
}

// Migration plan:
// 1. Create v2 endpoint with new types
// 2. Update ACT Website to use v2
// 3. Add deprecation warning to v1 (console.warn)
// 4. Remove v1 after all consumers migrated
```

---

## Database Schema Coordination

### Principle: Empathy Ledger Owns the Schema

Empathy Ledger's Supabase database is the source of truth for all shared data (storytellers, stories, projects, bookmarks, etc.).

**Other codebases:**
- ACT Website: Reads via API (never direct DB access)
- ACT Placemat: May have its own DB for backend-specific data

### Migration Workflow

#### 1. Plan Migration (Write SQL)

```sql
-- /Users/benknight/Code/Empathy Ledger v.02/supabase/migrations/20241224_add_bookmarks.sql

-- Add bookmarks table
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL CHECK (content_type IN ('story', 'project', 'storyteller')),
  content_id UUID NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE(user_id, content_type, content_id)
);

-- Add indexes
CREATE INDEX idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX idx_bookmarks_content ON bookmarks(content_type, content_id);

-- Enable RLS
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can read own bookmarks"
  ON bookmarks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own bookmarks"
  ON bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookmarks"
  ON bookmarks FOR DELETE
  USING (auth.uid() = user_id);
```

#### 2. Test Migration Locally

```bash
cd "/Users/benknight/Code/Empathy Ledger v.02"

# Reset local DB and apply migration
supabase db reset

# Check if tables created
supabase db diff
```

#### 3. Update API to Use New Schema

```typescript
// /src/app/api/v1/bookmarks/route.ts
// Implement CRUD operations using new table
```

#### 4. Update Types in ACT Website

```typescript
// /src/types/shared/bookmarks.ts
// Make sure types match DB schema
```

#### 5. Deploy to Production

```bash
# Deploy migration first
cd "/Users/benknight/Code/Empathy Ledger v.02"
supabase db push

# Then deploy API changes
vercel deploy --prod

# Finally deploy ACT Website consumer
cd "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio"
vercel deploy --prod
```

---

## Development Workflow

### Daily Workflow

#### Morning: Start Dev Servers

```bash
# Use the start-all.sh script
cd "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio"
./start-all.sh

# This starts:
# - Empathy Ledger on http://localhost:3001
# - ACT Main Website on http://localhost:3002
# - (Add ACT Placemat if needed)
```

#### During Development

When making a change that affects multiple repos:

1. **Make changes in order:**
   - Database migration (if needed)
   - Types in ACT Website (source of truth)
   - Copy types to Empathy Ledger
   - API implementation in Empathy Ledger
   - Consumer implementation in ACT Website

2. **Test continuously:**
   - Check browser for errors
   - Check terminal for TypeScript errors
   - Test API with curl or browser devtools

3. **Commit strategically:**
   - Commit to each repo separately
   - Use descriptive messages that reference other repos
   - Example: "Add bookmarks API (consumes types from ACT Website)"

#### End of Day: Sync and Document

```bash
# Run type check on all repos
for repo in \
  "/Users/benknight/Code/Empathy Ledger v.02" \
  "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio"
do
  echo "Type checking $repo..."
  (cd "$repo" && npm run type-check)
done

# Update shared changelog
# (Document what changed across repos today)
```

---

## Testing Strategy

### Unit Tests (Per Repo)

Each repo should have its own unit tests for internal logic.

```typescript
// Empathy Ledger: Test API logic
// /src/app/api/v1/bookmarks/__tests__/route.test.ts
import { GET } from '../route';

describe('GET /api/v1/bookmarks', () => {
  it('returns bookmarks for valid userId', async () => {
    const request = new Request('http://localhost/api/v1/bookmarks?userId=123');
    const response = await GET(request);
    const data = await response.json();

    expect(data).toHaveProperty('bookmarks');
    expect(Array.isArray(data.bookmarks)).toBe(true);
  });

  it('returns 400 for missing userId', async () => {
    const request = new Request('http://localhost/api/v1/bookmarks');
    const response = await GET(request);

    expect(response.status).toBe(400);
  });
});
```

### Integration Tests (Cross-Repo)

Test that APIs work end-to-end across codebases.

```typescript
// ACT Website: Test API client against real Empathy Ledger API
// /src/lib/__tests__/empathy-ledger-bookmarks.test.ts
import { getUserBookmarks } from '../empathy-ledger-bookmarks';

describe('getUserBookmarks', () => {
  it('fetches bookmarks from Empathy Ledger API', async () => {
    // Assumes Empathy Ledger dev server is running on :3001
    const bookmarks = await getUserBookmarks('test-user-id');

    expect(Array.isArray(bookmarks)).toBe(true);
  });

  it('handles API errors gracefully', async () => {
    const bookmarks = await getUserBookmarks('invalid-user');

    // Should return empty array, not throw
    expect(bookmarks).toEqual([]);
  });
});
```

### Manual Testing Checklist

Before deploying a change that affects multiple repos:

- [ ] Both dev servers running (`./start-all.sh`)
- [ ] Test happy path in browser
- [ ] Test error cases (invalid input, missing data)
- [ ] Check browser console for errors
- [ ] Check network tab for correct API requests/responses
- [ ] Test on mobile viewport
- [ ] Verify type safety (no TypeScript errors)
- [ ] Check database state (Supabase dashboard)

---

## Deployment Coordination

### Deployment Order (Critical!)

When deploying changes that span multiple repos:

1. **Database migrations** (if any) - Deploy FIRST
2. **API provider** (Empathy Ledger) - Deploy SECOND
3. **API consumers** (ACT Website) - Deploy LAST

**Why this order?**
- Migrations must be live before code that uses them
- APIs must be deployed before consumers call them
- Additive changes mean consumers can deploy safely after provider

### Example: Deploying Bookmarks Feature

```bash
# 1. Deploy database migration
cd "/Users/benknight/Code/Empathy Ledger v.02"
supabase db push  # Pushes to production Supabase

# 2. Deploy Empathy Ledger API
vercel deploy --prod
# Wait for deployment to complete...

# 3. Deploy ACT Website consumer
cd "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio"
vercel deploy --prod
```

### Rollback Plan

If something breaks in production:

1. **Identify which layer broke:**
   - Database? Revert migration
   - API? Revert Empathy Ledger deployment
   - Consumer? Revert ACT Website deployment

2. **Revert in reverse order:**
   ```bash
   # If ACT Website breaks, revert it first
   cd "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio"
   vercel rollback

   # If API breaks, revert Empathy Ledger
   cd "/Users/benknight/Code/Empathy Ledger v.02"
   vercel rollback

   # If migration breaks, run down migration
   supabase db reset  # In development
   # In production: manually revert via Supabase SQL editor
   ```

---

## Common Pitfalls

### 1. Modifying Types in Wrong Repo

**❌ WRONG:**
```typescript
// Empathy Ledger: /src/types/shared/bookmarks.ts
export interface Bookmark {
  id: string;
  user_id: string;
  title: string;  // ← Added here first
}
```

**✅ CORRECT:**
```typescript
// ACT Main Website: /src/types/shared/bookmarks.ts
export interface Bookmark {
  id: string;
  user_id: string;
  title: string;  // ← Add here first (source of truth)
}

// Then copy to Empathy Ledger
```

### 2. Trusting Types Without Runtime Validation

**❌ WRONG:**
```typescript
export async function getBookmarks(userId: string): Promise<Bookmark[]> {
  const response = await fetch(`/api/v1/bookmarks?userId=${userId}`);
  return response.json();  // ← Trusting response matches type!
}
```

**✅ CORRECT:**
```typescript
export async function getBookmarks(userId: string): Promise<Bookmark[]> {
  const response = await fetch(`/api/v1/bookmarks?userId=${userId}`);
  const data = await response.json();

  if (!isValidBookmarksResponse(data)) {
    console.error('Invalid API response:', data);
    return [];
  }

  return data.bookmarks;
}
```

### 3. Breaking Changes Without Versioning

**❌ WRONG:**
```typescript
// Changing existing endpoint breaks consumers!
// /api/v1/bookmarks - Changed response structure
export interface GetBookmarksResponse {
  data: Bookmark[];  // ← Changed from "bookmarks" to "data"
}
```

**✅ CORRECT:**
```typescript
// Keep v1 unchanged, create v2
// /api/v1/bookmarks - Original (keep for backward compat)
export interface GetBookmarksResponse {
  bookmarks: Bookmark[];
}

// /api/v2/bookmarks - New structure
export interface GetBookmarksResponseV2 {
  data: Bookmark[];
  meta: { total: number };
}
```

### 4. Deploying in Wrong Order

**❌ WRONG:**
```bash
# Deploy consumer before provider
cd "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio"
vercel deploy --prod  # ← Calls API that doesn't exist yet!

cd "/Users/benknight/Code/Empathy Ledger v.02"
vercel deploy --prod  # ← API deployed after consumer broke
```

**✅ CORRECT:**
```bash
# Deploy provider first
cd "/Users/benknight/Code/Empathy Ledger v.02"
vercel deploy --prod  # ← API live first

# Then consumer
cd "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio"
vercel deploy --prod  # ← Can safely call new API
```

### 5. Not Handling API Failures

**❌ WRONG:**
```typescript
export default async function ProjectPage({ params }) {
  const featuredContent = await getFeaturedContent(params.slug);

  return (
    <div>
      {/* Crashes if getFeaturedContent returns null! */}
      {featuredContent.featured.storytellers.map(...)}
    </div>
  );
}
```

**✅ CORRECT:**
```typescript
export default async function ProjectPage({ params }) {
  const featuredContent = await getFeaturedContent(params.slug);

  return (
    <div>
      {featuredContent ? (
        <CommunityVoicesSection {...featuredContent.featured} />
      ) : (
        <div>Community voices coming soon...</div>
      )}
    </div>
  );
}
```

---

## Checklists

### ✅ Adding a New API Endpoint

- [ ] Define request/response types in ACT Main Website (`/src/types/shared/`)
- [ ] Copy types to Empathy Ledger (`/src/types/shared/`)
- [ ] Add database migration if needed (Empathy Ledger)
- [ ] Implement API route (Empathy Ledger `/src/app/api/v1/`)
- [ ] Add runtime validation in API route
- [ ] Implement API client (ACT Website `/src/lib/`)
- [ ] Add runtime validation in client
- [ ] Add error handling and fallbacks
- [ ] Type check both repos (`npm run type-check`)
- [ ] Test locally (start both dev servers)
- [ ] Document in `MULTI_REPO_CHANGELOG.md`
- [ ] Deploy in order: migration → API → consumer

### ✅ Modifying Existing Types

- [ ] Determine if change is breaking or non-breaking
- [ ] If breaking: create v2 endpoint instead
- [ ] If non-breaking: modify in ACT Main Website first
- [ ] Copy updated types to Empathy Ledger
- [ ] Update API implementation (if needed)
- [ ] Update consumer (if needed)
- [ ] Type check both repos
- [ ] Test with both old and new clients (if applicable)
- [ ] Document in changelog
- [ ] Deploy

### ✅ Database Migration

- [ ] Write migration SQL in Empathy Ledger repo
- [ ] Test migration locally (`supabase db reset`)
- [ ] Update RLS policies
- [ ] Update API routes to use new schema
- [ ] Update types in ACT Main Website
- [ ] Copy types to Empathy Ledger
- [ ] Type check both repos
- [ ] Test locally
- [ ] Deploy migration to production
- [ ] Deploy API changes
- [ ] Deploy consumer changes
- [ ] Verify in production Supabase dashboard

### ✅ Before Committing

- [ ] Run `npm run type-check` in all affected repos
- [ ] Run `npm run lint` in all affected repos
- [ ] Test manually in browser
- [ ] Check for console errors
- [ ] Verify network requests in devtools
- [ ] Write clear commit messages that reference related changes
- [ ] Update `MULTI_REPO_CHANGELOG.md`

### ✅ Before Deploying to Production

- [ ] All type checks pass
- [ ] All linters pass
- [ ] Manual testing complete
- [ ] Integration tests pass
- [ ] Documented in changelog
- [ ] Rollback plan identified
- [ ] Deploy in correct order (migration → API → consumer)
- [ ] Monitor production logs after deployment
- [ ] Test in production after deployment

---

## Quick Reference Commands

### Start All Dev Servers
```bash
cd "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio"
./start-all.sh
```

### Type Check All Repos
```bash
for repo in \
  "/Users/benknight/Code/Empathy Ledger v.02" \
  "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio"
do
  (cd "$repo" && npm run type-check)
done
```

### Sync Types from ACT Website to Empathy Ledger
```bash
cp "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio/src/types/shared/"* \
   "/Users/benknight/Code/Empathy Ledger v.02/src/types/shared/"
```

### Deploy in Correct Order
```bash
# 1. Migration
cd "/Users/benknight/Code/Empathy Ledger v.02"
supabase db push

# 2. API provider
vercel deploy --prod

# 3. Consumer
cd "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio"
vercel deploy --prod
```

---

## Summary

**Key Principles:**
1. ACT Main Website is source of truth for shared types
2. Always validate at runtime (types are erased)
3. Version APIs for breaking changes
4. Database migrations should be additive
5. Fail gracefully when integrations break
6. Deploy in order: migration → provider → consumer

**File Organization:**
- Shared types: `/src/types/shared/` (source of truth in ACT Website)
- API routes: `/src/app/api/v1/` (in Empathy Ledger)
- API clients: `/src/lib/` (in ACT Website)

**Workflow:**
1. Define types in ACT Website
2. Copy to Empathy Ledger
3. Implement provider (API)
4. Implement consumer (client)
5. Type check both
6. Test locally
7. Deploy in order

**Common Mistakes:**
- Editing types in wrong repo
- Not validating at runtime
- Breaking changes without versioning
- Deploying in wrong order
- Not handling API failures

Follow this guide to maintain type safety, prevent breakage, and keep the ACT ecosystem running smoothly across all three codebases.
