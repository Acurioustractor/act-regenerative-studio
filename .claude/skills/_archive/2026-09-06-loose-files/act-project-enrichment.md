# ACT Project Enrichment Skill

## Purpose
Intelligently enrich ACT project pages by:
1. Reading Notion databases for project metadata
2. Connecting Empathy Ledger storytellers and thematic insights
3. Linking blog posts from the main site
4. Suggesting related projects
5. Managing photo and video galleries
6. Generating emergent, verified content

## Core Capabilities

### 1. Notion Data Extraction
**Extract nuanced project information from Notion:**
- Read project entries with intelligent interpretation
- Parse complex metadata (focus areas, themes, partners)
- Extract timeline information
- Identify key outcomes and metrics
- Detect connection points to other projects

**Human Verification Workflow:**
- Generate extracted data preview
- Flag ambiguous or uncertain interpretations
- Present side-by-side comparison (Notion → Generated)
- Allow human editing before committing
- Track verification status

### 2. Empathy Ledger Story Connection
**Link storytellers and thematic insights:**
- Identify storytellers who opted into this project
- Extract common themes from their stories
- Generate thematic summaries using AI
- Connect story insights to project outcomes
- Surface quotes and key moments

**Thematic Analysis:**
- Analyze story transcripts for recurring themes
- Map themes to project focus areas
- Identify unexpected patterns
- Generate "Community Voice Insights" section
- Show theme evolution over time

### 3. Blog Post Linking
**Connect relevant blog content:**
- Scan blog posts for project mentions
- Identify semantic relevance (not just keyword matching)
- Extract relevant excerpts
- Generate "Related Reading" sections
- Track bidirectional links (blog ↔ project)

**Smart Suggestions:**
- AI-powered relevance scoring
- Consider recency, topic overlap, storyteller mentions
- Present top 3-5 most relevant posts
- Include brief context for why it's relevant

### 4. Related Project Discovery
**Surface project connections:**
- Identify projects with shared themes
- Find projects with shared storytellers
- Detect geographic or organizational overlap
- Analyze focus area alignment
- Generate "Projects in this constellation" section

**Connection Types:**
- **Direct:** Same organization or initiative
- **Thematic:** Shared focus areas or approaches
- **Community:** Shared storytellers or partners
- **Geographic:** Same region or community
- **Temporal:** Related through timeline events

### 5. Media Gallery Management
**Photo and video curation:**
- Pull from Supabase storage
- Connect to year-in-review media
- Extract from Empathy Ledger story media
- Organize by theme, date, or story
- Generate captions using AI (with human verification)

**Gallery Sections:**
- **Hero Gallery:** Top 5-10 defining images
- **Community Moments:** Photos from storyteller contributions
- **Timeline:** Chronological visual journey
- **Video Highlights:** Key video clips with timestamps

### 6. Emergent Content Generation
**AI-assisted content creation:**
- Generate project summaries from multiple sources
- Create thematic narratives
- Draft "Impact Snapshots"
- Suggest LCAA content based on data
- Generate meta descriptions and SEO content

**Verification Workflow:**
- Show sources for each generated statement
- Highlight confidence levels
- Flag potential inaccuracies
- Present for human editing
- Track edit history

## Workflow Commands

### Initialize Project Enrichment
```bash
claude act-project enrich [project-slug]
```
**Steps:**
1. Read Notion database entry
2. Fetch Empathy Ledger featured content
3. Search blog posts for mentions
4. Analyze related projects
5. Compile media from all sources
6. Generate preview for human review

### Review & Verify
```bash
claude act-project review [project-slug]
```
**Shows:**
- Side-by-side comparison of source data vs. generated content
- Confidence scores for each section
- Flagged items needing human review
- Edit interface for corrections

### Thematic Analysis
```bash
claude act-project themes [project-slug]
```
**Analyzes:**
- All stories tagged to this project
- Extract recurring themes and patterns
- Generate insights report
- Suggest new focus areas or tags
- Create "What We're Learning" section

### Link Discovery
```bash
claude act-project links [project-slug]
```
**Finds:**
- Related blog posts (with relevance scores)
- Connected projects (with connection type)
- External references
- Partner organization pages
- Media mentions

### Media Sync
```bash
claude act-project media [project-slug]
```
**Syncs:**
- Photos from Supabase storage
- Videos from Descript
- Story media from Empathy Ledger
- Year-in-review content
- Generates galleries with AI captions

### Full Regeneration
```bash
claude act-project regenerate [project-slug] --verify
```
**Complete refresh:**
- Re-read all data sources
- Re-run thematic analysis
- Update all connections
- Regenerate emergent content
- Present for verification before committing

## Data Sources

### 1. Notion Database
**Expected fields:**
- Project name, slug, status
- Focus areas, themes
- Organization, partners
- Timeline entries
- Outcomes, metrics
- Links to external sites

### 2. Empathy Ledger
**Via API:**
- Featured storytellers (approved)
- Featured stories (approved)
- Story transcripts (for theme analysis)
- Media attachments
- Themes and tags

### 3. Blog Posts
**From main site:**
- All blog content
- Tags and categories
- Publication dates
- Author information
- Embedded media

### 4. Media Storage
**Supabase bucket:**
- Project hero images
- Photo galleries
- Video files
- Document uploads

### 5. Year-in-Review Data
**Structured content:**
- Photos by project
- Video highlights
- Impact metrics
- Timeline events

## Output Format

### Generated Project Page Sections

**1. Hero Section** (from static data + Notion)
- Title, tagline
- Hero image
- Key metrics

**2. LCAA Method** (AI-enhanced from existing + Notion notes)
- Listen: What we heard from community
- Curiosity: Questions we explored
- Action: What we built/did
- Art: How we made it beautiful

**3. Community Voices** (from Empathy Ledger)
- Featured storytellers
- Featured stories
- Thematic insights ("What we're hearing")
- Quote highlights

**4. Impact & Outcomes** (from Notion + story analysis)
- Key metrics
- Community feedback themes
- Unexpected learnings
- Future directions

**5. Related Reading** (from blog links)
- Top 3-5 relevant blog posts
- Brief context for each
- Publication dates

**6. Connected Projects** (from relationship analysis)
- 3-5 related projects
- Connection type and description
- Visual links

**7. Photo Gallery** (from media sync)
- Hero gallery (5-10 images)
- Community moments
- Timeline view

**8. Video Gallery** (from media sync)
- Featured videos with timestamps
- Story video clips
- Event recordings

## Human Verification UI

### Review Interface
```
┌─────────────────────────────────────────────────────────┐
│ ACT Project Enrichment Review: JusticeHub               │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ Section: Listen (LCAA Method)                           │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ SOURCE: Notion notes + Story analysis               │ │
│ │ CONFIDENCE: 85%                                      │ │
│ │                                                      │ │
│ │ Generated:                                           │ │
│ │ "Indigenous youth are locked up 24x more frequently │ │
│ │  than non-Indigenous youth. We listened to families,│ │
│ │  community workers, and young people who told us:   │ │
│ │  detention doesn't work, but community programs do."│ │
│ │                                                      │ │
│ │ Sources:                                             │ │
│ │ - Notion: "Youth justice research notes" (2024)    │ │
│ │ - Story: Sarah M. (JusticeHub storyteller)         │ │
│ │ - Story: Marcus T. (JusticeHub storyteller)        │ │
│ │                                                      │ │
│ │ [✓ Approve] [✎ Edit] [✗ Reject]                    │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                          │
│ Flagged Items: 2                                        │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ ⚠ Theme "Healing" appears in 8 stories but not in   │ │
│ │   focus_areas. Add as theme?                        │ │
│ │   [Yes, add "Community Healing"] [No, dismiss]      │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                          │
│ [← Previous] [Save Draft] [Next →] [Publish All]       │
└─────────────────────────────────────────────────────────┘
```

## Storage Format

### Enrichment Metadata
```json
{
  "project_slug": "justicehub",
  "last_enriched": "2025-12-24T10:30:00Z",
  "enrichment_version": "1.0",
  "sources": {
    "notion": {
      "database_id": "...",
      "page_id": "...",
      "last_synced": "2025-12-24T10:25:00Z"
    },
    "empathy_ledger": {
      "storyteller_count": 12,
      "story_count": 34,
      "last_synced": "2025-12-24T10:28:00Z"
    },
    "blog_posts": {
      "linked_count": 5,
      "last_scanned": "2025-12-24T10:27:00Z"
    }
  },
  "verification_status": {
    "lcaa_content": "approved",
    "community_voices": "approved",
    "blog_links": "needs_review",
    "media_galleries": "draft"
  },
  "thematic_insights": {
    "primary_themes": ["Youth Justice", "Community Healing", "Systems Change"],
    "emerging_themes": ["Healing", "Lived Experience Leadership"],
    "story_count_by_theme": {
      "Youth Justice": 34,
      "Community Healing": 8,
      "Systems Change": 12
    }
  },
  "related_projects": [
    {
      "slug": "contained",
      "connection_type": "thematic",
      "relevance_score": 0.92,
      "reason": "Both focus on youth justice and experiential storytelling"
    }
  ],
  "blog_links": [
    {
      "slug": "community-programs-work",
      "title": "Why Community Programs Work",
      "relevance_score": 0.89,
      "excerpt": "...",
      "published_at": "2024-11-15"
    }
  ],
  "media": {
    "photos": [
      {
        "url": "...",
        "caption": "Youth advocates at CONTAINED opening (generated)",
        "source": "empathy-ledger-story-123",
        "verified": true
      }
    ],
    "videos": [
      {
        "url": "...",
        "title": "Community voices on youth justice",
        "duration": 180,
        "source": "year-in-review-2025"
      }
    ]
  }
}
```

## Implementation Checklist

### Phase 1: Data Reading (Week 1)
- [ ] Notion integration for project metadata
- [ ] Empathy Ledger API expansion for story content
- [ ] Blog post indexing and search
- [ ] Media inventory from all sources

### Phase 2: AI Analysis (Week 2)
- [ ] Thematic analysis of story transcripts
- [ ] Semantic blog post matching
- [ ] Related project discovery algorithm
- [ ] Content generation with source attribution

### Phase 3: Verification UI (Week 3)
- [ ] Review interface component
- [ ] Side-by-side comparison view
- [ ] Edit workflow
- [ ] Draft/publish states

### Phase 4: Gallery Management (Week 4)
- [ ] Photo gallery component
- [ ] Video gallery component
- [ ] AI caption generation
- [ ] Media sync automation

### Phase 5: Emergent Content (Month 2)
- [ ] LCAA auto-generation from notes + stories
- [ ] Impact snapshot creation
- [ ] "What we're learning" synthesis
- [ ] Related reading suggestions

## Usage Example

```bash
# Start enrichment for JusticeHub project
claude act-project enrich justicehub

# Output:
# 📊 Reading data sources...
# ✓ Notion database synced (last updated 2 days ago)
# ✓ Empathy Ledger: 12 storytellers, 34 stories
# ✓ Blog posts scanned: 5 relevant matches found
# ✓ Media inventory: 45 photos, 8 videos
#
# 🤖 Analyzing themes...
# Primary themes: Youth Justice, Community Healing, Systems Change
# Emerging theme detected: "Healing" (8 stories, not in focus_areas)
#
# 🔗 Finding connections...
# Related projects: CONTAINED (92%), TOMNET (78%), Mounty Yarns (71%)
# Related blog posts: 5 high-confidence matches
#
# ✨ Generating content...
# ⚠ 3 sections need human review
#
# Run 'claude act-project review justicehub' to verify

# Review and verify
claude act-project review justicehub

# [Opens interactive review interface]

# After approval, regenerate project page
claude act-project regenerate justicehub

# ✓ Project page updated with enriched content
# ✓ Media galleries added
# ✓ Related reading section added
# ✓ Thematic insights section added
# 🎉 JusticeHub project page is now live!
```

## Benefits

**For Users:**
- Discover connections between projects
- See thematic evolution through stories
- Find related reading naturally
- Experience rich media galleries
- Understand project impact through multiple lenses

**For ACT Team:**
- Reduce manual content creation
- Surface unexpected insights
- Maintain accuracy through verification
- Keep content fresh and connected
- Scale across all 26 projects

**For Storytellers:**
- See their stories connected to broader themes
- Discover related projects
- Contribute to emergent understanding
- Be part of living documentation

## Next Steps

1. **Create the skill file** (this document)
2. **Build Notion integration** using Notion API
3. **Expand Empathy Ledger API** to return story content for theme analysis
4. **Create blog indexing** system
5. **Build verification UI** components
6. **Deploy enrichment workflow** for first 5 projects as pilot
