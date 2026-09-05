# Multi-Repo Sync Skill

**Purpose**: Manage code changes across ACT's interconnected codebases with type safety and API contract verification.

**Codebases**:
- **Empathy Ledger v.02** (`/Users/benknight/Code/Empathy Ledger v.02`) - Storytelling platform
- **ACT Main Website** (`/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio`) - Public-facing site
- **ACT Placemat** (`/Users/benknight/Code/ACT Placemat`) - Backend services

## When to Use This Skill

Use this skill whenever you're making changes that affect multiple codebases:

- **API Contract Changes** - Modifying endpoint signatures, response types, or request payloads
- **Shared Type Definitions** - Creating/updating TypeScript interfaces used across projects
- **Database Schema Changes** - Migrations that affect multiple consuming applications
- **Feature Integration** - Adding functionality that spans multiple repos (like the ACT project tagging system)
- **Dependency Updates** - Upgrading shared packages that require coordinated changes

## Workflow

### 1. Pre-Change Analysis

Before making any changes, document what will be affected:

```bash
# Run from ACT Main Website directory
cat > /tmp/multi-repo-change.md <<EOF
# Change: [Brief Description]

## Affected Codebases
- [ ] Empathy Ledger v.02
- [ ] ACT Main Website
- [ ] ACT Placemat

## Files to Modify

### Empathy Ledger v.02
- [ ] \`/path/to/file1.ts\` - [What changes]
- [ ] \`/path/to/file2.ts\` - [What changes]

### ACT Main Website
- [ ] \`/path/to/file1.ts\` - [What changes]

### ACT Placemat
- [ ] \`/path/to/file1.ts\` - [What changes]

## API Contracts
- [ ] Endpoint: \`/api/v1/example\`
  - Request type: \`ExampleRequest\`
  - Response type: \`ExampleResponse\`
  - Breaking change? Yes/No

## Shared Types
- [ ] Type: \`Example\`
  - Defined in: [Codebase + path]
  - Used in: [List all usages]

## Testing Plan
- [ ] Test in Empathy Ledger: [Describe test]
- [ ] Test in ACT Website: [Describe test]
- [ ] Test in ACT Placemat: [Describe test]
- [ ] Test integration: [Describe end-to-end test]

## Rollback Plan
[How to undo if things break]
EOF

cat /tmp/multi-repo-change.md
```

### 2. Create Shared Types (If Needed)

If creating types used across codebases, use the shared types directory:

```bash
# Create shared types in ACT Main Website (source of truth)
mkdir -p /Users/benknight/Code/ACT\ Farm\ and\ Regenerative\ Innovation\ Studio/src/types/shared

# Example: ACT Project Tagging types
cat > "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio/src/types/shared/act-featured-content.ts" <<'EOF'
/**
 * Shared types for ACT Project Featured Content
 * Used by: Empathy Ledger API, ACT Website client
 * Last updated: [Date]
 */

export interface ACTProject {
  id: string;
  slug: string;
  title: string;
  organization_name: string;
  focus_areas: string[];
  themes: string[];
  website_url?: string;
}

export interface FeaturedStoryteller {
  storyteller_id: string;
  display_name: string;
  profile_image_url?: string;
  featured_bio?: string;
  featured_tagline?: string;
  opted_in_at: string;
  approved_at?: string;
}

export interface FeaturedStory {
  story_id: string;
  title: string;
  excerpt?: string;
  featured_quote?: string;
  storyteller_name: string;
  published_at: string;
  approved_at?: string;
}

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
EOF
```

### 3. Copy Types to Consuming Codebases

```bash
# Copy to Empathy Ledger (API provider)
cp "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio/src/types/shared/act-featured-content.ts" \
   "/Users/benknight/Code/Empathy Ledger v.02/src/types/shared/act-featured-content.ts"

# Add timestamp comment to track sync
echo "// Synced from ACT Main Website on $(date)" | \
  cat - "/Users/benknight/Code/Empathy Ledger v.02/src/types/shared/act-featured-content.ts" > temp && \
  mv temp "/Users/benknight/Code/Empathy Ledger v.02/src/types/shared/act-featured-content.ts"
```

### 4. Implement Changes with Type Guards

In **Empathy Ledger** (API provider), use type guards to ensure runtime safety:

```typescript
// /Users/benknight/Code/Empathy Ledger v.02/src/app/api/v1/act-projects/[slug]/featured/route.ts
import { FeaturedContentResponse } from '@/types/shared/act-featured-content';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
): Promise<NextResponse<FeaturedContentResponse>> {
  // Implementation with strict typing
  const response: FeaturedContentResponse = {
    project: { /* ... */ },
    featured: { storytellers: [], stories: [] },
    meta: { /* ... */ }
  };

  return NextResponse.json(response);
}
```

In **ACT Main Website** (API consumer), validate responses:

```typescript
// /Users/benknight/Code/ACT Farm and Regenerative Innovation Studio/src/lib/empathy-ledger-featured.ts
import { FeaturedContentResponse } from '@/types/shared/act-featured-content';

export async function getFeaturedContentForProject(
  projectSlug: string
): Promise<FeaturedContentResponse | null> {
  const response = await fetch(`${API_URL}/api/v1/act-projects/${projectSlug}/featured`);
  const data = await response.json();

  // Runtime validation
  if (!isValidFeaturedContentResponse(data)) {
    console.error('Invalid API response:', data);
    return null;
  }

  return data;
}

function isValidFeaturedContentResponse(data: any): data is FeaturedContentResponse {
  return (
    data &&
    typeof data === 'object' &&
    'project' in data &&
    'featured' in data &&
    'meta' in data &&
    Array.isArray(data.featured.storytellers) &&
    Array.isArray(data.featured.stories)
  );
}
```

### 5. Run Type Checking Across All Codebases

```bash
# Check each codebase in parallel
(cd "/Users/benknight/Code/Empathy Ledger v.02" && npm run type-check) &
(cd "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio" && npm run type-check) &
(cd "/Users/benknight/Code/ACT Placemat" && npm run type-check) &

wait
echo "✅ Type checking complete across all codebases"
```

### 6. Test Integration Points

```bash
# Start all services
tmux new-session -d -s act-multi-repo

# Empathy Ledger on :3001
tmux send-keys -t act-multi-repo "cd '/Users/benknight/Code/Empathy Ledger v.02' && npm run dev" C-m
tmux split-window -t act-multi-repo -h

# ACT Main Website on :3002
tmux send-keys -t act-multi-repo "cd '/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio' && npm run dev" C-m
tmux split-window -t act-multi-repo -v

# ACT Placemat backend on :3999
tmux send-keys -t act-multi-repo "cd '/Users/benknight/Code/ACT Placemat' && npm run dev" C-m

# Attach to session
tmux attach -t act-multi-repo
```

### 7. Document Changes in Shared Changelog

```bash
# Append to shared changelog
cat >> "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio/MULTI_REPO_CHANGELOG.md" <<EOF

## $(date +%Y-%m-%d) - [Change Description]

### Changes Made
- **Empathy Ledger v.02**
  - Modified: \`/path/to/file.ts\`
  - Added: API endpoint \`/api/v1/example\`

- **ACT Main Website**
  - Modified: \`/path/to/file.ts\`
  - Added: Client function \`getExample()\`

### API Contract
- Endpoint: \`GET /api/v1/example\`
- Request: \`ExampleRequest\`
- Response: \`ExampleResponse\`
- Breaking: No

### Testing
- [x] Empathy Ledger builds successfully
- [x] ACT Website builds successfully
- [x] Integration test passed
- [x] Type checking passed

### Deployed
- Empathy Ledger: [Vercel URL or commit hash]
- ACT Website: [Vercel URL or commit hash]

EOF
```

## API Contract Management

### Creating New API Endpoints

When creating an API that will be consumed by other codebases:

1. **Define the contract in shared types FIRST**
2. **Implement the provider (Empathy Ledger)**
3. **Implement the consumer (ACT Website)**
4. **Add integration tests**

Example:

```typescript
// 1. Define in shared types (ACT Main Website)
// /src/types/shared/api-contracts.ts
export namespace ACTAPI {
  export namespace FeaturedContent {
    export interface Request {
      projectSlug: string;
      type?: 'storytellers' | 'stories' | 'all';
      limit?: number;
    }

    export interface Response {
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
  }
}

// 2. Copy to Empathy Ledger, implement provider
// 3. Implement consumer in ACT Website
// 4. Add integration test
```

### Versioning API Contracts

Use API versioning in URLs to prevent breaking changes:

- **v1** - Initial implementation
- **v2** - Breaking changes (new response structure, different validation)

When introducing breaking changes:

1. Create new version (e.g., `/api/v2/...`)
2. Keep v1 running for 1 release cycle
3. Update consumers to v2
4. Deprecate v1 with console warnings
5. Remove v1 after migration complete

## Database Migration Coordination

When making schema changes that affect multiple codebases:

### 1. Plan Migration

```sql
-- Document what's changing
-- Migration: add_act_project_tagging_system
-- Affects: Empathy Ledger API, ACT Website queries
-- Breaking: No (additive only)

CREATE TABLE act_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  -- ...
);
```

### 2. Deploy Migration to Empathy Ledger DB

```bash
cd "/Users/benknight/Code/Empathy Ledger v.02"

# Test locally first
supabase db reset
supabase migration up

# Then deploy to production
supabase db push
```

### 3. Update All Consuming Code

Before deploying the migration:
- ✅ Update Empathy Ledger API to use new tables
- ✅ Update ACT Website to handle new response fields
- ✅ Update any direct DB queries in ACT Placemat

After deploying the migration:
- ✅ Deploy Empathy Ledger API changes
- ✅ Deploy ACT Website changes
- ✅ Monitor for errors

## Dependency Management

### Keeping Shared Dependencies in Sync

Track critical shared dependencies:

```json
// package.json version alignment
{
  "name": "act-dependency-manifest",
  "dependencies": {
    "next": "15.1.3",           // Empathy Ledger, ACT Website
    "@supabase/ssr": "^0.5.2",  // Empathy Ledger, ACT Placemat
    "typescript": "^5.0.0",     // All repos
    "tailwindcss": "^3.4.0"     // Empathy Ledger, ACT Website
  }
}
```

When updating a shared dependency:

```bash
# Update in all repos simultaneously
for repo in \
  "/Users/benknight/Code/Empathy Ledger v.02" \
  "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio" \
  "/Users/benknight/Code/ACT Placemat"
do
  echo "Updating $repo..."
  (cd "$repo" && npm update next@15.1.3)
done
```

## Troubleshooting

### "Types don't match between repos"

```bash
# Check which version is in each repo
grep -r "export interface FeaturedContentResponse" \
  "/Users/benknight/Code/Empathy Ledger v.02/src/types" \
  "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio/src/types"

# Re-sync from source of truth
cp "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio/src/types/shared/"* \
   "/Users/benknight/Code/Empathy Ledger v.02/src/types/shared/"
```

### "API returning unexpected data"

```bash
# Test API directly
curl -s http://localhost:3001/api/v1/act-projects/justicehub/featured | jq .

# Compare against TypeScript type
# If structure doesn't match, update either API or type (breaking change)
```

### "Dependency version mismatch"

```bash
# List all Next.js versions across repos
for repo in \
  "/Users/benknight/Code/Empathy Ledger v.02" \
  "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio" \
  "/Users/benknight/Code/ACT Placemat"
do
  echo "$repo:"
  (cd "$repo" && npm list next 2>/dev/null | grep next@ || echo "Not installed")
done
```

## Quick Reference

### Start All Dev Servers

```bash
# Using the existing start-all.sh script
cd "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio"
./start-all.sh
```

### Type Check All Repos

```bash
for repo in \
  "/Users/benknight/Code/Empathy Ledger v.02" \
  "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio" \
  "/Users/benknight/Code/ACT Placemat"
do
  echo "Checking $repo..."
  (cd "$repo" && npm run type-check || echo "❌ Type errors")
done
```

### Sync Shared Types

```bash
# Copy from ACT Website (source of truth) to others
rsync -av \
  "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio/src/types/shared/" \
  "/Users/benknight/Code/Empathy Ledger v.02/src/types/shared/"
```

### Build All for Production

```bash
for repo in \
  "/Users/benknight/Code/Empathy Ledger v.02" \
  "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio"
do
  echo "Building $repo..."
  (cd "$repo" && npm run build)
done
```
