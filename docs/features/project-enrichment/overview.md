# ACT Project Enrichment System

An AI-powered system that automatically enriches ACT project pages with data from multiple sources: canonical ACT wiki metadata, Empathy Ledger storytellers/stories, and intelligent thematic matching using Claude AI.

## Overview

The enrichment system uses the **LCAA method** (Listen, Curiosity, Action, Art) as its guiding framework to find and display the most relevant community voices and stories for each project.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    ACT Project Page                          │
│  (Displays enriched data from all sources below)            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              Project Enrichment Orchestrator                 │
│         (/src/lib/project-enrichment.ts)                    │
│  Coordinates data from all sources using AI matching       │
└─────────────────────────────────────────────────────────────┘
            │                  │                  │
            ▼                  ▼                  ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│ Canonical Wiki   │  │ Empathy Ledger   │  │  Claude AI       │
│ Metadata Layer   │  │   Integration    │  │   Matcher        │
│                  │  │                  │  │                  │
│ Fetches project  │  │ Queries stories  │  │ matches stories  │
│ data from wiki   │  │ and storytellers │  │ to projects      │
│ snapshots        │  │ from Supabase DB │  │                  │
└──────────────────┘  └──────────────────┘  └──────────────────┘
```

## Key Components

### 1. Canonical Metadata Layer (`/src/lib/project-metadata/public.ts`)

Fetches project data from the ACT wiki-derived public metadata layer.

**Key Functions:**
- `getPublicProjectMetadata(slug)` - Get a single project
- `getAllPublicProjectMetadata()` - Get all projects
- `getPublicProjectPageContent(slug)` - Get project page content

**Data Retrieved:**
- AI-generated project summaries
- Related organizations and people
- Project themes and tags
- Autonomy scores
- Cover images
- Funding information
- Canonical project IDs and slugs

### 2. Empathy Ledger Integration (`/src/lib/empathy-ledger-integration.ts`)

Queries the Empathy Ledger Supabase database for storytellers and stories.

**Key Functions:**
- `searchStorytellersByOrganization(org, options)` - Find storytellers by org
- `searchStorytellersByThemes(themes, options)` - Find by themes
- `getStorytellerStories(id, options)` - Get storyteller's stories
- `searchStoriesByThemes(themes, options)` - Search stories
- `getThematicAnalysis(ids, options)` - Cross-storyteller analysis

**Respects:**
- Cultural sensitivity levels (public/community/restricted/sacred)
- Consent protocols
- OCAP principles (Ownership, Control, Access, Possession)
- Privacy settings

### 3. AI Project Matcher (`/src/lib/ai-project-matcher.ts`)

Uses Claude Sonnet 4.5 to intelligently match storytellers and stories to projects.

**Key Functions:**
- `matchStorytellerToProject(storyteller, project)` - Single match with reasoning
- `batchMatchStorytellersToProject(storytellers, project)` - Batch matching
- `findBestStoriesForProject(stories, project)` - Select most impactful stories
- `generateLCAAContentFromStories(project, stories)` - AI-generated LCAA content

**Matching Criteria:**
- Thematic alignment with project focus areas
- Cultural protocols and sovereignty
- LCAA method alignment (Listen, Curiosity, Action, Art)
- Community voice and lived experience
- Narrative strengthening potential

**Returns:**
- Relevance score (0-100)
- Reasoning explanation
- Suggested themes
- Cultural alignment notes
- Quotable excerpts

### 4. Unified Enrichment Service (`/src/lib/project-enrichment.ts`)

Orchestrates all data sources into a comprehensive enriched project.

**Main Function:**
```typescript
enrichProject(project, options): Promise<EnrichedProject>
```

**Options:**
- `includeMetadata` - Fetch canonical metadata (default: true)
- `includeStorytellers` - Find related storytellers (default: true)
- `includeStories` - Find related stories (default: true)
- `generateLCAA` - AI-generate LCAA content if missing (default: false)
- `maxStorytellers` - Max storytellers to include (default: 5)
- `maxStories` - Max stories to include (default: 3)

**Enriched Data Structure:**
```typescript
interface EnrichedProject {
  // Original project data
  ...project

  // From canonical metadata
  projectMetadata?: {
    aiSummary, themes, relatedPlaces, relatedOrganisations,
    relatedPeople, autonomyScore, supporters, partnerCount,
    projectLead, funding
  }

  // From Empathy Ledger + AI matching
  featuredStorytellers?: Array<{
    storyteller, relevanceScore, reasoning,
    suggestedThemes, culturalAlignment
  }>

  relatedStories?: Array<{
    story, relevanceScore, reasoning, quotableExcerpts
  }>

  // AI-generated LCAA (if requested)
  aiGeneratedLCAA?: {
    listen, curiosity, action, art
  }

  // Metadata
  enrichmentMetadata: {
    lastEnriched, sources[], confidence
  }
}
```

## API Routes

### GET /api/projects/enrich

Enrich one or all projects.

**Query Parameters:**
- `slug` - Specific project slug (omit to enrich all)
- `metadata` - Include canonical metadata (default: true)
- `storytellers` - Include storytellers (default: true)
- `stories` - Include stories (default: true)
- `generate_lcaa` - Generate LCAA content (default: false)

**Examples:**
```bash
# Enrich single project
GET /api/projects/enrich?slug=justicehub

# Enrich with AI-generated LCAA
GET /api/projects/enrich?slug=goods-on-country&generate_lcaa=true

# Enrich all projects (lightweight)
GET /api/projects/enrich?metadata=true&storytellers=false&stories=false
```

### POST /api/projects/enrich

Batch enrich specific projects.

**Request Body:**
```json
{
  "slugs": ["justicehub", "empathy-ledger", "goods-on-country"],
  "options": {
    "includeMetadata": true,
    "includeStorytellers": true,
    "includeStories": true,
    "generateLCAA": false,
    "maxStorytellers": 5,
    "maxStories": 3
  }
}
```

## Project-to-Organization Mapping

The system uses intelligent mapping to connect ACT projects to Empathy Ledger organizations:

```typescript
{
  'JusticeHub': 'JusticeHub',
  'Empathy Ledger': 'Empathy Ledger',
  'Goods on Country': 'Goods.',
  'Goods Tennant Creek Journey': 'Goods.',
  'Pakkinjalki kari (Washing Machine)': 'Goods.',
  'Fishers Oysters': 'Fishers Oysters',
  'BG Fit Mount Isa': 'BG Fit',
  'NAIDOC Week Mount Isa': 'BG Fit',
  'Quandamooka Justice and Healing Strategy': 'MMEIC',
  'PICC Centre Precinct': 'PICC',
  // ... more mappings
}
```

## Usage

### 1. Setup Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
# Required for AI matching
ANTHROPIC_API_KEY=sk-ant-api03-xxx

# Required for Empathy Ledger integration
EMPATHY_LEDGER_URL=http://localhost:3001

# Public URLs
NEXT_PUBLIC_EMPATHY_LEDGER_URL=https://empathyledger.com
```

### 2. Install Dependencies

```bash
npm install @anthropic-ai/sdk
```

### 3. Run Enrichment

**Option A: API Route (Recommended for production)**
```bash
curl http://localhost:3999/api/projects/enrich?slug=justicehub
```

**Option B: Direct Function Call (For scripts/tools)**
```typescript
import { enrichProject } from '@/lib/project-enrichment';
import { projects } from '@/data/projects';

const project = projects.find(p => p.slug === 'justicehub');
const enriched = await enrichProject(project, {
  includeMetadata: true,
  includeStorytellers: true,
  includeStories: true,
  maxStorytellers: 5,
  maxStories: 3
});

console.log(enriched);
```

### 4. Display on Project Pages

The project pages at `/projects/[slug]` automatically show a "Community Voices" section ready for enriched content.

## LCAA Method Integration

The enrichment system is built around the LCAA framework:

### 🎧 Listen
- Searches for storytellers by organization and themes
- Respects cultural sensitivity and consent protocols
- Queries stories that amplify community voice

### 🔍 Curiosity
- Uses AI to ask: "What themes connect this storyteller to this project?"
- Explores cross-storyteller thematic analysis
- Discovers unexpected connections

### ⚡ Action
- Automatically fetches and matches data from multiple sources
- Generates enriched project pages with real community stories
- Creates API endpoints for dynamic content

### 🎨 Art
- Displays stories in beautiful, accessible interfaces
- Makes invisible connections visible through AI reasoning
- Honors cultural protocols in presentation

## Confidence Scoring

Each enrichment includes a confidence score (0-100) based on:

- **Base content** (20 points): Description, hero image, video
- **LCAA content** (20 points): Listen, Curiosity, Action, Art sections
- **Metadata** (20 points): AI summary, themes, organizations
- **Storytellers** (15 points): Number and quality of matches
- **Stories** (10 points): Number and relevance of stories
- **Other** (15 points): Stats, quotes, additional media

## Rate Limiting

The system includes built-in rate limiting:
- 500ms delay between AI matching requests (storytellers)
- 1 second delay between batch enrichment operations
- Caching with 5-10 minute TTLs to reduce API calls

## Cultural Protocols

The system respects Indigenous data sovereignty principles:

1. **Consent-first**: Only public/community stories are accessed
2. **OCAP compliance**: Ownership, Control, Access, Possession respected
3. **Cultural sensitivity levels**: Sacred/restricted content never accessed
4. **Community voice**: AI assists but never replaces community narrative
5. **Transparent reasoning**: AI explains all matching decisions

## Future Enhancements

- [ ] Admin UI for reviewing AI suggestions before publishing
- [ ] Webhook triggers for auto-enrichment when wiki metadata or Empathy Ledger updates
- [ ] Vector similarity search using ChromaDB for better matching
- [ ] Multi-language support for AI-generated content
- [ ] Automated LCAA content generation for all projects
- [ ] Real-time enrichment status dashboard
- [ ] A/B testing for different AI matching strategies

## Troubleshooting

### "No storytellers found"
- Check organization mapping in `project-enrichment.ts`
- Verify Empathy Ledger URL is correct
- Ensure organization exists in Empathy Ledger database

### "AI matching fails"
- Verify `ANTHROPIC_API_KEY` is set correctly
- Check API rate limits haven't been exceeded
- Review error logs for specific Claude API errors

### "Low confidence scores"
- Add more LCAA content to base project data
- Enrich the canonical wiki project article with more metadata
- Increase `maxStorytellers` and `maxStories` options

## License

Part of the ACT Farm and Regenerative Innovation Studio ecosystem.
Built with respect for community sovereignty and cultural protocols.
