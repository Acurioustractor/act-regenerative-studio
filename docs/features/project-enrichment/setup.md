# ACT Project Enrichment System - Setup Guide

## What This Does

The ACT Project Enrichment system automatically combines data from multiple sources to create rich, connected project pages:

1. **Canonical ACT wiki metadata** - Project framing, timelines, outcomes, metrics
2. **Empathy Ledger** - Storytellers, stories, thematic insights
3. **Blog Posts** - Related reading and context (coming soon)
4. **Project Analysis** - Related project discovery (coming soon)
5. **Media Storage** - Photo and video galleries (coming soon)

## What's Been Implemented

### ✅ Phase 1: Canonical Metadata & Empathy Ledger Sync
- **Library**: `/src/lib/project-metadata/public.ts` - Wiki-derived project metadata
- **Types**: `/src/lib/project-metadata/types.ts` - TypeScript interfaces
- **Functions**:
  - `getPublicProjectMetadata(slug)` - Fetch single project by slug
  - `getAllPublicProjectMetadata()` - Fetch all active projects
  - `getPublicProjectPageContent(slug)` - Fetch page content blocks

### ✅ Phase 2: Blog Linking & Related Projects Discovery

#### Blog Post Linking
- **Service**: `/src/lib/enrichment/blog-linking.ts`
- **Features**:
  - Semantic similarity scoring (theme, focus area, partner overlap)
  - Direct project mention detection
  - Recency bonus for recent posts
  - Relevance scoring (0.0-1.0)
  - Top 5 most relevant posts per project

#### Related Projects Discovery
- **Service**: `/src/lib/enrichment/project-relationships.ts`
- **Connection Types**:
  - **Direct**: Same organization or explicit metadata relation
  - **Thematic**: Shared focus areas and themes
  - **Community**: Shared storytellers from Empathy Ledger
  - **Geographic**: Same location mentions
  - **Temporal**: Concurrent or sequential projects
- **Features**:
  - Multi-factor relevance scoring
  - Project constellation mapping
  - Connection type distribution analytics

### ✅ Enrichment Service
- **Service**: `/src/lib/enrichment/project-enrichment.ts`
- **Main Function**: `enrichProject(slug)` - Combines all data sources
- **Features**:
  - Fetches wiki-derived project metadata
  - Fetches Empathy Ledger storytellers and stories
  - Analyzes themes from stories (primary/emerging themes)
  - Finds related blog posts (semantic matching)
  - Discovers related projects (multi-factor analysis)
  - Tracks enrichment metadata and sources

### ✅ API Endpoints

#### Core Enrichment
- **Metadata**: `GET /api/projects/[slug]/metadata`
  - Returns wiki-derived project metadata + page content
- **Legacy alias**: `GET /api/projects/[slug]/notion`
  - Compatibility alias to the canonical metadata route

- **Enriched Data**: `GET /api/projects/[slug]/enrich`
  - Returns combined data from all sources
  - Includes thematic analysis, related posts, related projects
  - Tracks verification status

#### Related Content Discovery
- **Related Projects**: `GET /api/projects/[slug]/related`
  - Query params: `minScore`, `maxResults`, `includeStorytellers`
  - Returns projects with connection types and relevance scores

- **Project Constellation**: `GET /api/projects/[slug]/constellation`
  - Returns complete constellation map with all connections
  - Shows connection type distribution

- **Blog Links**: `GET /api/projects/[slug]/blog-links`
  - Query params: `minScore`, `maxResults`, `report`
  - Returns related blog posts with relevance explanations

## Setup Instructions

### 1. Canonical metadata source

The public project metadata layer is now derived from the canonical ACT wiki and static project registry. The website build runs `sync:wiki` before `next build`, so project truth should be updated in the wiki first.

Optional legacy Notion tooling still exists for older enrichment paths, but it is no longer part of the main public build contract.

### 2. Configure Environment Variables

Add these to your `.env.local` file:

```bash
# Canonical website build
EMPATHY_LEDGER_URL=http://localhost:3030
```

Optional legacy Notion env vars are only needed if you are explicitly using the old snapshot tooling or admin scanners.

### 3. Expected canonical metadata structure

The canonical metadata layer is assembled from:
- `wiki/projects/`
- the static project registry in `/src/data/projects.ts`
- generated snapshots in `/src/data/wiki-projects.generated.json`

**Required Fields:**
- **Slug** (Text) - URL-friendly project identifier (e.g., "justicehub")
- **Name** or **Title** (Title) - Project name
- **Description** (Text) - Project description
- **Status** (Select) - active, planning, completed, paused
- **Organization** (Text) - Organization name

**Optional Fields:**
- **Priority** (Number) - Project priority (1-10)
- **Focus Areas** (Multi-select) - e.g., Justice, Youth, Community
- **Themes** (Multi-select) - e.g., Systems Change, Healing
- **Partners** (Multi-select) - Partner organizations
- **Start Date** (Date) - Project start date
- **End Date** (Date) - Project end date
- **Outcomes** (Text) - Project outcomes and impact
- **Metrics** (Text) - JSON or structured metrics data
- **Timeline** (Text) - JSON array of timeline entries
- **Connections** (Relation) - Related projects
- **Notes** (Text) - Additional project notes

## Usage Examples

### Phase 1: Test Notion Connection

```bash
# Fetch JusticeHub project metadata
curl http://localhost:3002/api/projects/justicehub/metadata
```

Expected response:
```json
{
  "success": true,
  "project": {
    "id": "justicehub",
    "slug": "justicehub",
    "title": "JusticeHub",
    "description": "Digital platform connecting system-impacted youth...",
    "status": "active",
    "focusAreas": ["Justice", "Youth"],
    "themes": ["Systems Change", "Community Healing"],
    "partners": ["Mount Isa Aunties Network"],
    "pageContent": "Additional notes from the canonical project page...",
    "source": "wiki-derived"
  }
}
```

### Phase 1: Test Full Enrichment

```bash
# Get enriched project data combining metadata + Empathy Ledger
curl http://localhost:3002/api/projects/justicehub/enrich
```

Expected response:
```json
{
  "success": true,
  "data": {
    "metadata": { /* Wiki-derived project metadata */ },
    "storytellers": [
      {
        "id": "storyteller-uuid",
        "name": "Aunty Corrine",
        "bio": "Community leader in Mount Isa...",
        "profileImage": "https://...",
        "storyCount": 3
      }
    ],
    "stories": [
      {
        "id": "story-uuid",
        "title": "Youth justice in Mount Isa",
        "excerpt": "...",
        "themes": ["Youth Justice", "Community Healing"]
      }
    ],
    "thematicInsights": {
      "primaryThemes": ["Youth Justice", "Community Healing"],
      "emergingThemes": ["Healing"],
      "storyCountByTheme": {
        "Youth Justice": 34,
        "Community Healing": 8
      }
    },
    "relatedBlogPosts": [
      {
        "slug": "community-programs-work",
        "title": "Why Community Programs Work",
        "relevanceScore": 0.89,
        "reason": "Direct mention of 'justicehub'; Shared focus areas: Justice, Youth"
      }
    ],
    "relatedProjects": [
      {
        "slug": "contained",
        "title": "CONTAINED",
        "connectionType": "thematic",
        "relevanceScore": 0.92,
        "reason": "Strong thematic alignment; 3 shared storytellers"
      }
    ],
    "sources": {
      "metadata": {
        "page_id": "...",
        "last_synced": "2025-12-24T..."
      },
      "empathyLedger": {
        "storytellerCount": 12,
        "storyCount": 34,
        "last_synced": "2025-12-24T..."
      }
    }
  }
}
```

### Phase 2: Test Related Projects Discovery

```bash
# Find related projects for JusticeHub
curl "http://localhost:3002/api/projects/justicehub/related?minScore=0.3&maxResults=5"
```

Expected response:
```json
{
  "success": true,
  "project": {
    "slug": "justicehub",
    "title": "JusticeHub"
  },
  "relatedProjects": [
    {
      "slug": "contained",
      "title": "CONTAINED",
      "connectionType": "community",
      "relevanceScore": 0.92,
      "reason": "Strong thematic alignment; 3 shared storytellers",
      "sharedElements": [
        "Focus: Justice",
        "Focus: Youth",
        "Theme: Systems Change",
        "3 shared storytellers"
      ],
      "organizationName": "JusticeHub",
      "status": "active"
    },
    {
      "slug": "mounty-yarns",
      "title": "Mounty Yarns",
      "connectionType": "geographic",
      "relevanceScore": 0.71,
      "reason": "Shared locations: Mount Isa; Concurrent projects",
      "sharedElements": [
        "Focus: Justice",
        "Partner: Mount Isa Aunties Network"
      ],
      "organizationName": "A Curious Tractor",
      "status": "active"
    }
  ],
  "metadata": {
    "minRelevanceScore": 0.3,
    "maxResults": 5,
    "includeStorytellers": true
  }
}
```

### Phase 2: Test Project Constellation Map

```bash
# Generate constellation map for JusticeHub
curl http://localhost:3002/api/projects/justicehub/constellation
```

Expected response:
```json
{
  "success": true,
  "constellation": {
    "centerProject": {
      "slug": "justicehub",
      "title": "JusticeHub",
      "focusAreas": ["Justice", "Youth"],
      "themes": ["Systems Change", "Community Healing"]
    },
    "relatedProjects": [
      /* Array of 10 related projects */
    ],
    "connectionTypes": {
      "direct": 2,
      "thematic": 4,
      "community": 3,
      "geographic": 1,
      "temporal": 0
    },
    "totalConnections": 10
  }
}
```

### Phase 2: Test Blog Post Linking

```bash
# Find related blog posts for JusticeHub
curl "http://localhost:3002/api/projects/justicehub/blog-links?minScore=0.2&report=true"
```

Expected response:
```json
{
  "success": true,
  "project": {
    "slug": "justicehub",
    "title": "JusticeHub"
  },
  "relatedPosts": [
    {
      "slug": "community-programs-work",
      "title": "Why Community Programs Work",
      "excerpt": "Research shows community-led programs...",
      "relevanceScore": 0.89,
      "publishedAt": "2024-11-15",
      "relevanceReasons": [
        "Direct mention of 'justicehub'",
        "Shared focus areas: Justice, Youth",
        "Shared themes: Systems Change"
      ],
      "matchedKeywords": ["justicehub", "Justice", "Youth", "Systems Change"]
    }
  ],
  "report": {
    "totalPostsScanned": 45,
    "relevantPostsFound": 5,
    "topPosts": [/* Top 5 posts */],
    "averageRelevanceScore": 0.67
  },
  "metadata": {
    "minRelevanceScore": 0.2,
    "maxResults": 5
  }
}
```

## Next Steps (Phase 3+)

### Media Gallery Management
- Pull from Supabase storage
- Connect year-in-review media
- Extract Empathy Ledger story media
- AI-generated captions with verification

### Human Verification UI
- Review interface for generated content
- Side-by-side comparison (source vs generated)
- Edit workflow before publishing
- Flagging system for uncertain content

## Current Integration Status

| Data Source | Status | Endpoint |
|------------|--------|----------|
| Project Metadata | ✅ Implemented | `/api/projects/[slug]/metadata` |
| Empathy Ledger Stories | ✅ Implemented | `/api/projects/[slug]/enrich` |
| Thematic Analysis | ✅ Implemented | `/api/projects/[slug]/enrich` |
| Blog Post Linking | ✅ Implemented | `/api/projects/[slug]/blog-links` |
| Related Projects | ✅ Implemented | `/api/projects/[slug]/related` |
| Project Constellation | ✅ Implemented | `/api/projects/[slug]/constellation` |
| Media Galleries | 🚧 Phase 3 | - |
| Verification UI | 🚧 Phase 3 | - |

## File Structure

```
src/
├── lib/
│   ├── project-metadata/
│   │   ├── public.ts                    # Wiki-derived project metadata
│   │   └── types.ts                     # TypeScript interfaces
│   └── enrichment/
│       ├── project-enrichment.ts        # Main enrichment service
│       ├── blog-linking.ts              # Blog post discovery
│       └── project-relationships.ts     # Related projects discovery
├── app/
│   └── api/
│       └── projects/
│           └── [slug]/
│               ├── metadata/
│               │   └── route.ts         # Canonical metadata endpoint
│               ├── notion/
│               │   └── route.ts         # Legacy compatibility alias
│               ├── enrich/
│               │   └── route.ts         # Full enrichment endpoint
│               ├── related/
│               │   └── route.ts         # Related projects endpoint
│               ├── constellation/
│               │   └── route.ts         # Constellation map endpoint
│               └── blog-links/
│                   └── route.ts         # Blog post linking endpoint
```

## Troubleshooting

**"Project not found in metadata registry"**
- Check that the project slug exists in the canonical wiki project set
- Verify the slug matches exactly
- Run `npm run sync:wiki` to refresh the generated snapshot

**"Failed to fetch Empathy Ledger data"**
- Verify `EMPATHY_LEDGER_URL` is set correctly (http://localhost:3000)
- Ensure Empathy Ledger dev server is running
- Check that the project exists in the `act_projects` table with `is_active = true`

**"Notion API authentication failed"**
- Verify `NOTION_API_KEY` is set correctly (starts with `secret_`)
- Ensure the integration has access to your workspace
- Check that the database is shared with the integration

## Support

For issues or questions:
- Check the [ACT Project Enrichment skill document](./.claude/skills/act-project-enrichment.md)
- Review API responses for detailed error messages
- Check server logs for additional context
