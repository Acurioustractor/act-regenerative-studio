---
title: Website Integration
slug: website-integration
website_path: null
status: published
last_updated: 2026-01-12
shareability: INTERNAL
---

# Website Integration

How content flows from the Compendium to act.place and project websites.

---

## Content Flow Pattern

```
compendium/03-ecosystem/empathy-ledger.md
                 ↓
      [Build script parses frontmatter]
                 ↓
act-regenerative-studio/app/projects/empathy-ledger/page.tsx
                 ↓
             act.place/projects/empathy-ledger
```

---

## Frontmatter Schema

Every wiki file includes frontmatter for website sync:

```yaml
---
title: Page Title                    # Required
slug: url-slug                       # Required - URL-safe identifier
website_path: /projects/slug         # Where it appears on site (null = not published)
excerpt: "Short description"         # For cards and meta
image: /images/hero.jpg              # Hero image path
status: published | draft | archived # Publication status
last_updated: 2026-01-12             # ISO date
shareability: INTERNAL | EXTERNAL    # Access level
---
```

---

## Content Types

| Type | Source | Website Use |
|------|--------|-------------|
| Long-form narrative | Compendium body content | About pages, methodology |
| Project pages | `03-ecosystem/*.md` | /projects/* pages |
| Story embeds | Empathy Ledger Registry API | Story highlights |
| Impact data | ALMA signals from stories | Impact pages |
| Team/people | `01-identity/mission.md` | About/team page |

---

## Registry API Integration

Each platform exposes `/api/registry` for content aggregation:

| Source | Endpoint | Content |
|--------|----------|---------|
| Empathy Ledger | `/api/registry` | Consented public stories |
| JusticeHub | `/api/registry` | Forkable programs |
| Goods on Country | `/registry.json` | Product catalog |
| The Harvest | `/api/registry` | Events and CSA shares |

### Standard Registry Schema

```json
{
  "meta": {
    "project": "project-slug",
    "version": "1.0.0",
    "last_updated": "2026-01-12T10:00:00Z",
    "total_items": 42
  },
  "items": [
    {
      "id": "unique-id",
      "type": "story|program|product|event",
      "title": "Human-readable title",
      "summary": "Brief description",
      "slug": "url-friendly-slug",
      "canonical_url": "https://project.com/items/slug",
      "tags": ["tag1", "tag2"],
      "status": "published"
    }
  ]
}
```

---

## Website Sections

### act.place Structure

| Path | Source |
|------|--------|
| `/` | Custom homepage |
| `/about` | `01-identity/mission.md` |
| `/methodology` | `01-identity/lcaa-methodology.md` |
| `/projects` | `03-ecosystem/*.md` index |
| `/projects/[slug]` | Individual project files |
| `/places` | `02-place/*.md` index |
| `/places/[slug]` | Individual place files |
| `/stories` | Empathy Ledger Registry feed |
| `/impact` | `04-story/alma-model.md` + data |

---

## Sync Process

### Manual (Current)
1. Edit Compendium markdown file
2. Run build script to parse frontmatter
3. Generate static pages
4. Deploy to Vercel

### Automated (Planned)
1. GitHub webhook on Compendium change
2. Build script parses updated files
3. Incremental static regeneration
4. Auto-deploy to production

---

## Shareability Matrix

Content is tagged with shareability levels:

| Level | Description | Website Use |
|-------|-------------|-------------|
| **INTERNAL** | Team only | Not published to website |
| **EXTERNAL-LITE** | Can share with permission | May appear with review |
| **EXTERNAL** | Public | Published to website |

---

## Image Assets

### Location
- `/public/images/` - Static images in website repo
- Supabase Storage - Dynamic/uploaded images
- Empathy Ledger - Consented story media

### Naming Convention
```
/images/[project]-[type].jpg
/images/empathy-ledger-hero.jpg
/images/goods-product-bed.jpg
```

---

## SEO Considerations

Each page generates:
- `<title>` from frontmatter title
- `<meta description>` from excerpt
- Open Graph tags for social sharing
- Canonical URL
- Structured data (JSON-LD) where applicable

---

*See also: [Overview](overview.md) | [Technical Architecture](../appendices/tech-architecture.md)*
