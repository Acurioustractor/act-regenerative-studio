# ACT Project Enrichment System - Setup Guide

## What This Does

The ACT Project Enrichment system automatically combines data from multiple sources to create rich, connected project pages:

1. **Notion Database** - Project metadata, timelines, outcomes, metrics
2. **Empathy Ledger** - Storytellers, stories, thematic insights
3. **Blog Posts** - Related reading and context (coming soon)
4. **Project Analysis** - Related project discovery (coming soon)
5. **Media Storage** - Photo and video galleries (coming soon)

## What's Been Implemented

### ✅ Phase 1: Notion Integration & Empathy Ledger Sync
- **Library**: `/src/lib/notion/client.ts` - Notion API client
- **Types**: `/src/lib/notion/types.ts` - TypeScript interfaces
- **Functions**:
  - `getNotionProject(slug)` - Fetch single project by slug
  - `getAllNotionProjects()` - Fetch all active projects
  - `getNotionPageContent(pageId)` - Fetch page content blocks

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
  - **Direct**: Same organization or explicit Notion relation
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
  - Fetches Notion project metadata
  - Fetches Empathy Ledger storytellers and stories
  - Analyzes themes from stories (primary/emerging themes)
  - Finds related blog posts (semantic matching)
  - Discovers related projects (multi-factor analysis)
  - Tracks enrichment metadata and sources

### ✅ API Endpoints

#### Core Enrichment
- **Notion Data**: `GET /api/projects/[slug]/notion`
  - Returns raw Notion project data + page content

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

### 1. Create Notion Integration

1. Go to [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Click "+ New integration"
3. Name it "ACT Project Enrichment"
4. Select your workspace
5. Copy the **Internal Integration Token** (starts with `secret_`)

### 2. Share Notion Database with Integration

1. Open your ACT Projects database in Notion
2. Click the `···` menu in the top right
3. Click "Add connections"
4. Search for "ACT Project Enrichment" and select it
5. Copy the **Database ID** from the URL:
   ```
   https://www.notion.so/177ebcf981cf80dd9514f1ec32f3314c?v=...
                        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                        This is your database ID
   ```

### 3. Configure Environment Variables

Add these to your `.env.local` file:

```bash
# Notion Integration
NOTION_API_KEY=secret_your_actual_token_here
NOTION_PROJECTS_DATABASE_ID=177ebcf981cf80dd9514f1ec32f3314c
```

### 4. Expected Notion Database Structure

Your Notion ACT Projects database should have these properties:

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
# Fetch JusticeHub project from Notion
curl http://localhost:3002/api/projects/justicehub/notion
```

Expected response:
```json
{
  "success": true,
  "project": {
    "id": "notion-page-id",
    "slug": "justicehub",
    "title": "JusticeHub",
    "description": "Digital platform connecting system-impacted youth...",
    "status": "active",
    "focusAreas": ["Justice", "Youth"],
    "themes": ["Systems Change", "Community Healing"],
    "partners": ["Mount Isa Aunties Network"],
    "pageContent": "Additional notes from the Notion page..."
  }
}
```

### Phase 1: Test Full Enrichment

```bash
# Get enriched project data combining Notion + Empathy Ledger
curl http://localhost:3002/api/projects/justicehub/enrich
```

Expected response:
```json
{
  "success": true,
  "data": {
    "notion": { /* Notion metadata */ },
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
      "notion": {
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
| Notion Projects | ✅ Implemented | `/api/projects/[slug]/notion` |
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
│   ├── notion/
│   │   ├── client.ts                    # Notion API client
│   │   ├── types.ts                     # TypeScript interfaces
│   │   └── index.ts                     # Exports
│   └── enrichment/
│       ├── project-enrichment.ts        # Main enrichment service
│       ├── blog-linking.ts              # Blog post discovery
│       └── project-relationships.ts     # Related projects discovery
├── app/
│   └── api/
│       └── projects/
│           └── [slug]/
│               ├── notion/
│               │   └── route.ts         # Notion data endpoint
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

**"Project not found in Notion database"**
- Check that the project slug exists in your Notion database
- Verify the Slug property matches exactly (case-sensitive)
- Ensure the Notion integration has access to the database

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
