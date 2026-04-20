---
date: 2026-01-27T06:45:00Z
session_name: ultimate-project-pages
branch: main
status: active
---

# Work Stream: ultimate-project-pages

## Ledger
**Updated:** 2026-04-22T03:00:00Z
**Goal:** Site-wide voice pass + drifted-route demotion complete
**Branch:** main (12 commits shipped 0dba621…1bfc843)
**Test:** npm run build && npm run dev (dev on :3300)

### Now
[->] Voice pass + drifted-route IA demotion complete. Zero interior-ops residue on user-facing pages. /wiki home collapsed 3→2 cards; "See the trail" promise retired rather than kept as a broken link.

### Followups surfaced but deferred
- Stat-block color variance on `/impact` (4 different hex accents) — may be semantic vs Sankey, needs browser eyes.
- Closing-CTA variance across identity-family (some have dark callouts, some don't) — likely intentional rhythm, needs browser eyes.

### Session commit roll-up (most recent first)

- `1bfc843` feat(ia): demote drifted /wiki/source-{packets,bridges} to /admin. Both pages were ops dashboards (packet review gates, ownership_rules, implementation repos) surfaced from /wiki home with user-facing card copy. `git mv` both to /admin, 301 redirects added, /wiki home dropped from 3 to 2 cards (Ecosystem + Voices from the field → /storytellers). "See the trail" card retired.
- `8002eef` refactor(pages): Phase B.4 voice pass on flagships + shared pages. /governance + /events PageHero descriptions; /method LCAA blurb; /contact LivingSystemStrip; 3× /projects/[slug] handoff card copy; /projects list page; /harvest Barry-shed editorial. Zero avoid-list grep hits across all user-facing pages.
- `53246c0` refactor(pages): Phase B.3 voice pass on 7 remaining identity pages (/about, /vision, /principles, /how-we-work, /governance, /partners, /events). Retired "public shell/surface/site/studio shell", "living memory/practice/system", "Partnership/Invitation/Principled layer", "field signal", "story layers", "governance surface", "canonical ACT wiki" → "working wiki", "second CMS/design language", and all "should"-note-to-author patterns from user-visible copy.
- `c66cbad` refactor(pages): identity-family visual sweep — /impact + /ask. Outer `space-y-16` → `space-y-20` (now matches other 8 identity pages). /impact: 3 hand-rolled `<h2 class="text-2xl">` replaced with `SectionHeading` (fixes heading rhythm — family uses display `text-[2rem] md:text-[2.6rem]` with eyebrows); inner `space-y-8` → `space-y-10`. /ask: dropped nested `<main class="min-h-screen bg-gradient-to-b from-stone-50 to-white">` — the stone grey clashed with the sand palette, nested main was semantically wrong, AskACT self-contains its container.
- `b33a45c` fix(links): stale hrefs → moved admin routes (/engine, /media-lab) cleaned up; VisionSearch mock repointed from /engine to /method.
- `0b549b5` feat(seo): root layout metadata enriched (metadataBase, title template, openGraph, twitter, canonical). New `src/app/sitemap.ts` (40 static routes + wiki/projects/storytellers/art/blog dynamic routes with per-route priority+changefreq). New `src/app/robots.ts` (allow-all, disallow /admin, /api, /image-picker). `export const metadata` added to 14 pages that were bare (/about, /art, /blog, /contact, /events, /governance, /how-we-work, /method, /partners, /principles, /projects, /studio, /vision, /wiki). Verified /robots.txt and /sitemap.xml both 200.
- `dec9617` refactor(pages): Phase B.2 voice tightening on /impact, /studio, /ask. Dropped "ALMA signals/seed set/signal flow", "public shell", "connective infrastructure", "field memory", "knowledge layer", "reading aid", "living system".
- `bf4d4f4` docs(ledger): captured Phases A–D in ledger.
- `93d5eb2` feat(ia): Phase D orphan triage. 2 stubs deleted w/ 301s, 3 tools demoted to /admin, 10 sub-pages wired into parents, 12 identity pages surfaced via new footer "Studio" column.
- `d79dc9f` feat(pages): Phase C audience pathing. Homepage "I'm here to…" chips, ExternalHandoffCard on 4 flagships, ContactForm dropdown expanded to 7 types.
- `09afcdd` refactor(pages): Phase B voice rewrites. /ecosystem rebuilt (238 lines interior ops removed), /wiki hero reframed, project-detail labels cleaned.
- `0dba621` feat(pages): Phase A dead-ends. Wiki backlinks resolver (`src/lib/wiki/backlinks.ts`), storyteller→project title + "Carry a story" CTA, art→parent-project chip.

### Phase A–D + B.2 + SEO cumulative verification
- `npm run build`: clean after every commit, ~90 routes compile.
- Copy-guard pre-commit hook: passed on all 8 commits.
- Dev smoke check (`:3300`): 11 live routes → 200, 5 redirects → 308 to correct targets, /robots.txt → 200, /sitemap.xml → 200 with full URL set.
- Session memory updated: `feedback_external_voice.md` now lists `/farm` as the voice benchmark + all interior-ops terms stripped this session, so future sessions don't re-audit.

### Latest session (2026-04-21): Site-wide page review

Four phases committed in sequence. Plan file: `~/.claude/plans/lets-review-all-page-snazzy-pumpkin.md`.

**Phase A — close dead-ends** (commit `0dba621`)
- `src/lib/wiki/backlinks.ts` — new resolver scanning `[[link]]` syntax across all wiki pages. Returns `{ fromProjects, fromWiki }` + same-section neighbours.
- `/wiki/[slug]` rebuilt: dropped "Follow the ecosystem" stub panel + "canonical" framing. Replaced with page-specific "See it in the field" CTA (first project backlink), plus "Where this shows up" and "Pages that pick up the same thread" sections.
- `/storytellers/[id]`: slugs → titles via `getCanonicalWikiProjectRecords()`. Chips read "Empathy Ledger" not "empathy-ledger". Added "Carry a story" CTA → `/contact?type=share-your-story`.
- `/art/[slug]`: `connectedProject` surfaced as "Part of X →" chip in hero pills row (was buried in details column).

**Phase B — voice rewrites, benchmark /farm** (commit `09afcdd`)
- `/ecosystem`: rewrite hero + body. Deleted 238 lines of interior ops (the whole "Public system/surfaces" section with classification/verification_status chips, "Open decisions", LivingSystemStrip, "Live graph" framing). Kept fields grid + stats (renamed columns to plain English) + "Ways in" pathways.
- `/wiki` home: hero retitled "How the work actually gets done". Stripped "canonical ACT wiki", "working infrastructure", "public face". Three intro cards relabelled ("Where our claims come from" instead of "How this site stays current").
- `/projects/[slug]`: "ALMA Insights" → "What we learned / Key Learnings & Outcomes"; "Connected in the wiki" → "Related work / How this thread runs through ACT".

**Phase C — audience pathing** (commit `d79dc9f`)
- Homepage: "I'm here to…" chip row between hero and flagship fields (Partner / Visit the farm / Support the work / Research or write / Share a story).
- `src/components/ecosystem/ExternalHandoffCard.tsx`: new. One-line framing + button. Added to `/harvest`, `/goods`, `/empathy-ledger`, `/justicehub` below hero. `/farm` intentionally skipped — it IS the hub.
- `ContactForm.tsx`: inquiryType dropdown 4 → 7 options (added share-your-story, support, research) so new audience-chip URLs resolve.

**Phase D — orphan triage** (commit `93d5eb2`)
- Deleted stubs: `/lcaa`, `/wiki/new` (redirect-only pages) + 301s in `next.config.js`.
- Demoted internal tools: `/engine`, `/image-picker`, `/media-lab` moved under `/admin/*` + 301s.
- Wired sub-pages into parents: `/farm` → stay/retreats/workshops; `/harvest` → csa/produce; `/art` → artists/artworks/commissions/exhibitions/residencies ("Browse by slice" strip).
- Expanded `UnifiedFooter` from 3 → 4 columns, new "Studio" column links about, vision, method, principles, how-we-work, governance, impact, studio, partners, events, ask, wiki.
- Net: no more orphan routes. 22 previously-unreachable pages are now linked; 2 stubs gone; 3 tools moved out of public space.

### Phase A–D cumulative verification
- `npm run build`: clean after each phase, all ~90 routes still compile.
- Copy-guard pre-commit hook: passed on all 4 commits (no internal-copy patterns in user-facing files).
- Smoke paths to verify in dev: `/` → chip → `/contact?type=partnership`; `/wiki/empathy-ledger` → "Where this shows up" → `/projects/empathy-ledger`; `/storytellers/<id>` → "Projects they shape" → `/projects/<slug>`; `/art/contained` → "Part of JusticeHub" chip → `/projects/justicehub`; `/harvest` → `ExternalHandoffCard` → `theharvestwitta.com.au`; `/wiki` home hero reads in /farm voice.

### This Session
- [x] Created unified data fetcher (`src/lib/projects/get-project-data.ts`)
- [x] Built ecosystem integration (`src/lib/ecosystem/index.ts`) - reads from act-ecosystem repo
- [x] Created 8 project components (ProjectHero, ImpactDashboard, LCAAJourney, CaseStudySection, ALMAInsightsSection, StoryVignettesSection, CommunityVoicesSection, KnowledgeLinksSection)
- [x] Fixed text contrast issues (darkened #6B5A45 → #4A4035, #5A6B4D → #3A4A3D)
- [x] Fixed justice theme visibility (explicit dark bg #0B1F2A, yellow text #F4D04F)
- [x] Set up Bitwarden secrets sharing (symlinked .env.shared from act-ecosystem)
- [x] Added ecosystem metadata badges to KnowledgeLinksSection (code, status, location, LCAA themes)
- [x] Built Project Config Editor MVP in act-ecosystem Command Center
- [x] Added ecosystem external links across all routes:
  - Created centralized `src/data/ecosystem.ts` (single source of truth)
  - Created reusable `EcosystemLinks` component with 3 variants (cards, compact, buttons)
  - Updated `PageHero` to support `external` prop for external links
  - Added "Visit ACT Farm" button to `/farm` page
  - Added "Visit The Harvest" button to `/harvest` page
  - Added "Visit Goods Registry" button to `/goods` page
  - Updated `/ecosystem` page with EcosystemLinks component
  - KnowledgeLinksSection shows "Live Platform" for projects with `production_url`

### Next
- [x] Fix P0: 7 wiki-redirect 404s (next.config.js:41-47) — deleted stale redirects, all routes now 200
- [x] Fix P2: per-project `<title>` via generateMetadata on /projects/[slug]
- [x] Fix P3: ScrollReveal SSR-hid every section — moved hide logic into useEffect so SSR/no-JS shows content
- [x] Cleared Merged/Art redirect block (12 stale redirects shadowing real pages) — all 12 routes now 200
- [x] Added d1d3n03t5zntha.cloudfront.net (Descript CDN) to next.config.js images — unblocks /people which was masked by stale redirect
- [x] Fixed inferMediaKind to sniff URL extension — surfaces 17 audio + 17 video files mis-tagged as image in existing featured snapshot. /media now shows 13 videos (was 0).
- [x] Added EL storyteller integration: sync-el-storytellers.mjs + src/lib/empathy-ledger-storytellers.ts (typed, cached, consent-aware via canDisplayStoryteller)
- [x] Added EL transcript integration: sync-el-transcripts.mjs + src/lib/empathy-ledger-transcripts.ts (typed, cached, consent + cultural-sensitivity gated via canDisplayTranscript)
- [x] Wired both new syncs into build pipeline (package.json)
- [x] Schema mapping captured in research — see next steps for unblocking broader transcript coverage
- [x] Wired TranscriptsSection into /projects/[slug] — silent until snapshots populate; renders Descript embeds / HTML5 video / audio with transcript segments + themes + key quotes + consent gating
- [x] Added site-scoped transcripts endpoint to empathy-ledger-v2: src/app/api/v1/sites/[siteSlug]/transcripts/route.ts — scopes via gallery_syndication_consent (no more JusticeHub-only gate), consent + cultural-sensitivity gated server-side
- [x] Updated sync-el-transcripts.mjs to prefer site-scoped endpoint, fall back to content-hub on 404 — labels the source in snapshot meta
- [x] Added /storytellers (list) and /storytellers/[id] (detail) — static params from snapshot, per-profile metadata, themes + cultural markers + quotes + transcripts composed in
- [x] Added "Storytellers" to main nav (src/app/layout.tsx)
- [x] Cross-linked storyteller surface: CommunityVoicesSection cards + TranscriptsSection names now deep-link to /storytellers/[id] when a detail profile exists (no dead links pre-population)
- [x] Connected wiki knowledge base to Supabase: added top-priority `supabase` source tier to canonical-site-wiki.ts reading from wiki_pages (status='active'). Falls through to live-wiki filesystem → snapshot. Source badge on /wiki/[slug] shows origin. Transparent when unconfigured: zero-risk rollout.
- [x] Wiki seed script: `scripts/seed-wiki-to-supabase.mjs` upserts 328 pages from snapshot into wiki_pages (idempotent, DRY_RUN supported). Maps sections → PMPP page_type. Run via `npm run seed:wiki-to-supabase`. Dry-run verified 328/329 pages prepared.
- [x] Wiki editing live at /wiki/[slug]/edit: Next.js server action writes to Supabase wiki_pages with upsert + revalidatePath. Gated by WIKI_EDIT_TOKEN env var (dev-mode auth — replace with session auth before exposing). Subtle Edit → link added to /wiki/[slug] view for discoverability. Validates page_type + status against DB CHECK constraints.
- [x] Wiki is now LCAA source of truth: src/lib/wiki/project-lcaa.ts parses 3 wiki patterns (single-phase, markdown table, bullet list) from wiki project docs and merges into project.listen/curiosity/action/art. getProjectData prefers wiki LCAA over static projects.ts hardcodes. Research loop is automatic via canonical-site-wiki live-filesystem tier — wiki edits propagate on next render without rebuild. Verified on /projects/contained and /projects/goods-on-country where wiki list-pattern content now surfaces directly.
- [x] Extended wiki-as-source-of-truth to pull-quotes + stats: parseProjectQuote extracts the epigraph blockquote (with optional — Author, Role attribution) from the head of each wiki project doc; parseProjectStats walks `## By the Numbers` / `## Impact` / `## Metrics` sections for bullet-list stats (`- **value** label`). Both merge into getProjectData ahead of baseProject hardcoded fallbacks. Verified: empathy-ledger project page now carries "third reality we can only discover together" straight from wiki/projects/empathy-ledger.md.
- [x] Added Key People extraction + project page section: parseProjectKeyPeople handles both `[[slug|Name]] — context` (wiki-linked) and `**Name** — context` (bold) patterns from `## Key People`. New ProjectKeyPeopleSection component renders cards with deep-links to /wiki/<slug> when the wiki-link pattern matched. Added to /projects/[slug] render pipeline. Verified: empathy-ledger now shows Benjamin Knight, Richard Cassidy, Rachel Atkinson from wiki.
- [x] Added wiki backlinks: parseProjectBacklinks parses `[[slug|Name]]` entries from `## Backlinks` sections (coverage: 80/89 project docs). Exposed as project.wikiBacklinks. New "Connected in the wiki" footer section on /projects/[slug] renders them as chip-style links to /wiki/<slug>. Gives editorial authorship over cross-project navigation, replacing theme-heuristic guessing with wiki-author intent.
- [x] getRelatedProjects now prefers wiki backlinks over theme heuristics: the "Related Projects" card grid on /projects/[slug] draws from editorially-curated wiki `## Backlinks` first (in wiki author order), then tops up with same-theme matches to fill 3 slots. Verified: /projects/empathy-ledger Related Projects now surfaces Oonchiumpa (wiki-editorial) instead of a theme guess. Removed legacy _legacyRelatedByTheme helper.
- [x] Integrate Empathy Ledger media (images, video, transcripts) — scaffolded; awaiting API key to populate
- [x] Connect wiki/knowledge base to Supabase — 3-tier resolver shipped + seed script + edit UI

### Options for the next session
- [x] **Site-wide page review Phases A–D** — shipped 2026-04-21 (commits 0dba621, 09afcdd, d79dc9f, 93d5eb2). See Latest session block above.
- [ ] **Visual QA pass on dev** — walk the 5 smoke paths above, verify spacing/contrast on new components (ExternalHandoffCard on 4 flagships, homepage chip row, wiki "Where this shows up" section, footer 4-column). ~15 min.
- [ ] **Populate EL snapshots** — still blocked on EMPATHY_LEDGER_API_KEY + deploy of empathy-ledger-v2 with site-scoped transcripts endpoint.
- [~] **Seed wiki_pages Supabase** — still BLOCKED: `wiki_pages` table doesn't exist in remote Supabase. Migration `supabase/migrations/20241225_living_wiki.sql` needs to be applied first.
- [ ] **Wiki editing auth upgrade** — replace WIKI_EDIT_TOKEN env gate with proper session auth before exposing externally.
- [ ] **More LCAA content authoring** — 15/89 wiki project docs have LCAA; rest will auto-light-up as `## LCAA Phase` sections get added.
- [x] **Cover the identity-family pages with the voice pass** — B.2 (commit `dec9617`) + B.3 (commit `53246c0`) covered all 10 identity pages. Avoid-list terms in feedback_external_voice.md now return zero grep hits across `src/app/{about,vision,principles,how-we-work,governance,impact,partners,events,studio,ask}/page.tsx`.
- [~] **Identity-family visual sweep** — shipped 2026-04-22 (commit `c66cbad`). /impact + /ask normalized. Open: /impact top-stat colors (#D87D4A orange + warm-brown + green + olive) may be semantic if they map to Sankey node colors — needs browser eyes. No other visual inconsistencies found across the 10 pages.
- [ ] **SEO/meta overhaul** — scoped out of this review. Per-route metadata consistency, OpenGraph cards, structured data.

### Decisions
- Ecosystem data source: `/Users/benknight/Code/act-ecosystem/config/project-codes.json`
- Shared secrets: Symlinked `.env.shared` from act-ecosystem to all projects
- Justice theme: Explicit solid bg (#0B1F2A) instead of gradient (wasn't rendering)
- Quote boxes: Always dark green (#2F3E2E) with white text for guaranteed contrast
- Project editing: Web UI in Command Center (http://localhost:5173/?tab=config) with AI-assist via GPT-4o

### Open Questions
- UNCONFIRMED: How does Empathy Ledger store media (images/video/transcripts)?
- UNCONFIRMED: Supabase env vars needed for wiki integration

### Workflow State
pattern: iterative-enhancement
phase: 4
total_phases: 4
retries: 0
max_retries: 3
last_phase_completed: 2026-04-21 — Phases A–D of site-wide page review

#### Resolved
- goal: "Ultimate project pages with ecosystem integration"
- resource_allocation: balanced

#### Unknowns
- empathy_ledger_media_schema: UNKNOWN
- ecosystem_edit_workflow: UNKNOWN

#### Last Failure
(none)

---

## Context

### Architecture Overview

```
Project Page Load
       │
       ▼
┌──────────────────────────────────────────────────┐
│              getProjectData(slug)                 │
│  ┌─────────────┬────────────┬─────────────┐      │
│  │ projects.ts │  Notion    │ Empathy     │      │
│  │ (fallback)  │  (enrich)  │ Ledger      │      │
│  └─────────────┴────────────┴─────────────┘      │
│          ┌───────────┴───────────┐               │
│          ▼                       ▼               │
│    Cover Image            Vignettes              │
│    + Ecosystem            (by project_slugs)     │
│    Metadata                                      │
└──────────────────────────────────────────────────┘
```

### Key Files Created/Modified

| File | Purpose |
|------|---------|
| `src/lib/ecosystem/index.ts` | Loads project data from act-ecosystem repo |
| `src/lib/projects/get-project-data.ts` | Unified data fetcher with 5 parallel sources |
| `src/components/projects/*.tsx` | 8 project page components |
| `src/lib/projects/theme-styles.ts` | Theme color definitions |
| `.env.shared` | Symlink to act-ecosystem shared secrets |

### Ecosystem Integration

The act-ecosystem repo at `/Users/benknight/Code/act-ecosystem` contains:
- `config/project-codes.json` - 70+ projects with codes, status, leads, locations, LCAA themes
- Command Center API (port 3456) - potential editing UI
- Notion IDs for cross-system linking

### Next Steps: Editing Workflow Options

1. **CLI Tool** - Simple node script to edit project-codes.json
2. **Notion Sync** - Pull from Notion database (projects already have notion_ids)
3. **Command Center UI** - Web interface in act-ecosystem
4. **Direct JSON editing** - VS Code with schema validation

### Next Steps: Empathy Ledger Media

Need to explore:
- How media is stored (Supabase storage? S3?)
- Schema for images/video/transcripts
- Tagging system for project association
- Consent/permissions model
