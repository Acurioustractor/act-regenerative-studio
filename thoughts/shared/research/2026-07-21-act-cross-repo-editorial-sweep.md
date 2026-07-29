---
date: 2026-07-21T15:21:01+08:00
researcher: Codex
git_commit: a54fc5aa5c3f0b362a0d818f58d6f7b97d2632e5
branch: wip/world-class-site-2026-06-13
repository: act-regenerative-studio
topic: "Full cross-repository ACT story, image, film and interaction sweep"
tags: [research, editorial, story, media, governance, cross-repo]
status: complete
last_updated: 2026-07-21
last_updated_by: Codex
---

# Full cross-repository ACT editorial sweep

## Research question

What story, photograph, film, audio and interaction material exists across the ACT project repositories, and which sources can form the parent website while moving people joyfully into each canonical project site?

## Scope and method

This read-only sweep covered twelve locally available repositories. It inspected narrative sources, public media concentrations, annual reviews, interaction systems, project routes and governance evidence. It did not copy media, query private contacts, expose personal information or infer permission from file presence.

The generated discovery index currently records:

- 2,806 story signals
- 8,350 images
- 284 films
- 175 audio files
- 654 governance-related files

These are discovery counts, not publishable asset counts.

The durable repository scan is implemented by:

- `/Users/benknight/Code/act-regenerative-studio/scripts/sweep-story-sources.mjs`
- `/Users/benknight/Code/act-regenerative-studio/src/data/story-source-index.generated.json`

Run `npm run story:sweep` whenever connected repositories change. The sweep ranks narrative and media candidates without moving source files.

## Primary finding

The repositories do not form one pooled media library. They form a governed publishing chain:

1. Canonical project source
2. Empathy Ledger authority record
3. Consent, credit and cultural or Elder review
4. Approved destination-specific derivative packet
5. ACT connective story
6. Link back into the canonical project experience

The parent ACT site should hold the relationships between the projects. It should not duplicate the full project libraries.

## Strongest parent-site narrative

The source material supports this movement:

1. **Art makes the system felt.** Enter through CONTAINED.
2. **Justice turns feeling into alternatives.** Move into JusticeHub and community-led practice.
3. **Story remains a relationship.** Empathy Ledger reveals consent and authority.
4. **Material carries consequence.** Goods on Country follows waste, objects, repair and local making.
5. **Hospitality makes room.** The Harvest brings the work to a garden, pavilion and table.
6. **Place changes the pace.** Black Cockatoo Valley returns the work to Country, water, habitat and limits.
7. **ACT connects without swallowing.** The long history shows what was learned, transferred and released.

## Repository findings

### A Curious Tractor

Canonical role: connective history and receiving surface.

Strongest sources:

1. `thoughts/shared/research/2026-07-21-act-history-archive-media-audit.md`
2. `src/data/history-media.ts`
3. `src/lib/stories/story-packets.ts`
4. `src/data/vision/vision.md`
5. `Writing/ACT_Compendium_2026_Media_Inventory.md`
6. `assets/compendium-2026/consented-story-candidates.json`
7. `compendium/04-story/story-collection-tracker.md`
8. `compendium/04-story/evidence-learning.md`
9. `compendium/04-story/alma-model.md`
10. `compendium/05-operations/cultural-protocols.md`
11. `compendium/05-operations/governance.md`
12. `src/app/prototypes/field-history/page.tsx`
13. `src/app/prototypes/history-media/page.tsx`
14. `src/app/prototypes/story-atlas/page.tsx`
15. `src/app/prototypes/living-field/`

Media concentrations:

- `public/media/field-stills`: 24 files
- `public/media/field-videos`: 13 files
- `output/video-stills`: 7 editorial stills

Boundary: `Confessions Recordings` is not a general source pool. Caller and publication-specific consent applies.

### Empathy Ledger

Canonical role: authority for people, quotes, media, cultural review and cross-site syndication.

Strongest story and philosophy sources:

1. `compendium/stories/origin-of-act.md`
2. `compendium/stories/building-empathy-ledger.md`
3. `compendium/stories/storytelling-data-sovereignty.md`
4. `content/stories/example-consent-as-infrastructure.md`
5. `content/stories/kristy-bloomfield-two-worlds-youth-leadership.md`
6. `content/stories/barry-rodgerig-timber-country-five-decades.md`
7. `compendium/stories/uncle-alan-palm-island.md`
8. `compendium/stories/peggy-palm-island.md`

Authority implementation:

- `docs/GOVERNANCE-PRINCIPLES.md`
- `docs/world-tour-consent-framework.md`
- `src/lib/governance/story-release-decision.ts`
- `src/lib/governance/community-review-authority.ts`
- `src/lib/governance/person-use-ledger.ts`
- `src/lib/cultural-safety/publish-gate.ts`
- `src/lib/cultural-safety/media-gate.ts`
- `src/lib/cultural-safety/quote-gate.ts`
- `src/lib/services/syndication-consent-service.ts`

Boundary: a file, imported article or public route is not enough. ACT use requires the destination-specific release decision and applicable person, community, media and quote gates.

### JusticeHub and Art + CONTAINED

Canonical role: justice practice, community alternatives and the current CONTAINED experience.

Strongest sources:

1. `src/app/stories/the-fire-and-the-road/page.tsx`
2. `public/stories/fire-and-road/photos`
3. `public/stories/fire-and-road/video`
4. `src/app/judges-on-country/page.tsx`
5. `src/app/judges-on-country/stories/page.tsx`
6. `src/content/judges-stories.json`
7. `src/content/judges-postcards.ts`
8. `src/lib/judges-postcard-publication-plan.ts`
9. `src/data/justice-reinvestment/history.json`
10. `src/data/justice-reinvestment/site-research.json`
11. `src/data/justice-reinvestment/sites.json`
12. `src/app/contained/page.tsx`
13. `src/app/contained/experience`
14. `src/app/contained/stories`
15. `src/app/contained/tour`

The Webflow migration contains strong relationship and learning essays about Central Australia, Mount Isa, Diagrama, cultural authority, unpaid expertise and justice alternatives under `data/webflow-migration/articles-markdown/`.

The Fire and the Road has a cohesive 17-photo and 18-film/poster sequence. Jeremy, Elder and community review remains required before cross-site duplication.

The separate `/Users/benknight/Code/Contained` repository is a legacy concept archive. Its strongest sources are `Political theatre.md`, `container reserch.md`, `contained-brand-guide.md` and `SITE-ARCHITECTURE-FOR-WEBFLOW.md`. The canonical current destination is JusticeHub `/contained/*`.

### Goods on Country

Canonical role: material, making, design authority and local capability.

Strongest sources:

1. `wiki/outputs/utopia-story-spine-2026-05.md`
2. `wiki/outputs/2026-05-14-washing-machine-full-history.md`
3. `wiki/outputs/2026-07-20-the-voices-are-the-evidence.md`
4. `wiki/outputs/2026-07-12-storyteller-lockdown.md`
5. `v2/src/lib/data/storyteller-registry.ts`
6. `wiki/outputs/2026-07-03-canon-photo-video-review.md`
7. `wiki/outputs/community-media-coverage-2026-07-10.md`
8. `wiki/outputs/2026-06-18-goods-storyteller-library-index.md`
9. `wiki/articles/products/stretch-bed.md`
10. `wiki/articles/products/washing-machine.md`
11. `wiki/articles/products/basket-bed-legacy.md`
12. `wiki/investor/case-studies/01-pakkimjalki-kari-design-authority.md`

Strongest lower-risk motion candidates, subject to the existing Goods audit:

- `v2/public/video/recycling-plant-desktop.mp4`
- `v2/public/video/stretch-bed/assembly.mp4`
- `v2/public/video/community-desktop.mp4`
- `v2/public/video/stretch-bed-desktop.mp4`
- `v2/public/images/product/stretch-bed-community.jpg`
- `v2/public/goods-plastic-journey.jpg`
- `v2/public/images/pitch/`

The Utopia sequence and person-led films have much higher narrative value, but several remain consent-pending or use-specific. The Goods storyteller registry and canon review are the current project authorities.

### The Harvest

Canonical role: hospitality, inherited material, collective making and an easy physical arrival.

Strongest sources:

1. `docs/communications/articles-launch-set/01-milk-create-pavilion.md`
2. `docs/communications/articles-launch-set/02-the-cedar.md`
3. `docs/communications/story-packs/2026-05-07-sophie-garden-story-pack.md`
4. `docs/communications/articles-launch-set/04-the-garden-susie-joey.md`
5. `docs/brand/real-photo-and-history-assets.md`
6. `docs/community-intelligence/09-heritage-and-history.md`
7. `docs/vision-prep/audio-transcripts/site-walkthrough-jan2026.md`
8. `docs/vision-prep/content/walkthrough-insights.md`
9. `docs/communications/photo-and-content-system-2026-07.md`
10. `docs/communications/harvest-blog-empathy-ledger-flow.md`
11. `docs/communications/empathy-ledger-media-intake.md`
12. `client/src/pages/HarvestJourneyPost.tsx`

Strongest media concentrations:

- `client/public/images/compendium/hero-aerial.mp4`
- `client/public/images/compendium/hero-aerial.jpg`
- `client/public/images/compendium/seed-house-front.jpg`
- `client/public/images/compendium/barry/`
- `client/public/images/witta/history/`

The local Empathy Ledger UUID image cache is not a rights ledger. Garden, pavilion and Barry material should be selected through its metadata and use-specific approval.

### Black Cockatoo Valley

Canonical role: place, conservation, pace and the limits set by Country.

Strongest sources:

1. `app/country/page.tsx`
2. `wiki/decisions/why-interactive-map.md`
3. `lib/map/farmData.ts`
4. `app/map/page.tsx`
5. `app/vision/page.tsx`
6. `app/junes-patch/page.tsx`
7. `app/residencies/page.tsx`
8. `lib/experiences/catalog.ts`
9. `lib/case-studies/catalog.ts`
10. `thoughts/shared/handoffs/2026-04-14-farm-experiences-roadmap.md`

Strongest media:

- `public/media/hero-aerial.mp4`
- `public/media/bcv-aerial.mp4`
- `public/media/hero-aerial-poster.jpg`
- `public/images/hero/farm-drone.jpg`
- `public/images/map/drone-current.jpg`
- `public/images/map/drone-before.jpg`

The repository is an older prototype, not a current factual authority. It repeats 150 acres, while current ACT facts record approximately 138 acres or 55.8 hectares. It also contains obsolete entity names, unsupported targets and concept-stage offerings. Use it for place imagery and interaction discovery only after current fact and authority checks.

### Oonchiumpa

Canonical role: community-controlled Country, family, youth and work narratives.

Strongest structural sources:

- `STORY_IMPORT_SUMMARY.md`
- `oonchiumpa-platform/docs/Reports/`
- `oonchiumpa-app/public/atnarpa-snow/index.html`
- `empathy-ledger-integration-architecture.md`
- `oonchiumpa-platform/packages/cultural-protocols/src/types.ts`

The Atnarpa experience supplies a compelling page-turn, film and place-led chapter rhythm. Imported records marked published cannot be assumed to have completed storyteller linking and Elder review. Actual community reports, stories, images and films require Oonchiumpa authority and an approved derivative packet.

### Palm Island Repository

Canonical role: PICC-controlled longitudinal archive and community evidence system.

Strongest structural sources:

- `SOUL.md`
- `templates/community-story-template.md`
- `STARRED-PHOTOS.json`
- `picc-constellation-snapshot-final.md`
- `output/PICC-LIVING-ATLAS-PLATFORM-MAP.md`
- `annual-report-system-audit.md`

The repository offers constellation navigation, year layers and service-to-story evidence links. Starred status is ranking metadata, not consent. PICC is the principal. Names, quotes, photographs, histories and annual-report content remain under PICC, family and Elder authority.

### ACT video storytelling

Canonical role: reusable emotional film and motion grammar.

Strongest implementation sources:

- `src/compositions/InterviewVideo.tsx`
- `src/compositions/VoiceCanvas.tsx`
- `src/compositions/EmotionalArc.tsx`
- `src/compositions/TransitionWipe.tsx`
- `src/compositions/SketchAlong.tsx`
- `src/compositions/PhotoReveal.tsx`
- `src/compositions/QuoteCard.tsx`
- `thoughts/MAKE-IT-AMAZING.md`

Reusable patterns include storyteller-first framing, silence after emotional peaks, continuous Country or room tone, asymmetry, hand-drawn overlays, photo reveals and motion that fills gaps without replacing testimony. Existing renders are production references, not automatically cleared content.

### Living story map

Canonical role: reusable time and people architecture.

Strongest implementation sources:

- `src/components/TimelineGrid.tsx`
- `src/components/EventDot.tsx`
- `src/components/VideoHero.tsx`
- `src/components/ChaptersOverlay.tsx`
- `src/components/TimelineRibbon.tsx`
- `src/pages/JourneyDetailPage.tsx`
- `src/services/types.ts`

Reusable pattern: time on one axis, people on another, with aspirations changing from dashed rings into milestone dots. Do not reuse the governed family graph, names, clips or dreams.

### Reciprocal Voices

Canonical role: reusable playful listening interaction.

Strongest implementation sources:

- `index.html`
- `README.md`
- `PROJECT_SUMMARY.md`
- `sanitize_transcripts.py`

Reusable pattern: move a handset to catch a voice, unlock its transcript, then move between an individual voice and a collective chorus.

Critical privacy finding: original-name backups and a filename mapping remain in the repository without an obvious matching ignore rule. These paths must not be indexed, exposed, deployed or quoted. Existing audio and transcripts remain held until provenance and consent are verified.

## Ranked first story packets

### 1. Come into the art

Purpose: homepage opening and emotional threshold.

Sources: ACT field footage plus the current JusticeHub CONTAINED experience. Use darkness, steel, aerial form, light and room tone. Move to JusticeHub rather than duplicating its complete experience.

### 2. The fire and the road

Purpose: long-form justice and Country chapter.

Sources: JusticeHub Fire and Road page, photo sequence and film sequence. Status: hold until Jeremy, Elder and community approval is represented for ACT destination use.

### 3. A story remains with its storyteller

Purpose: explain why the website behaves differently.

Sources: Empathy Ledger origin, consent-as-infrastructure and data-sovereignty writing. Prefer diagrams and interface behaviour until specific human testimony is cleared.

### 4. Lids become a bed

Purpose: Goods material journey.

Sources: face-free recycling plant film, assembly film, object anatomy and only registry-cleared voices. Link to the full Goods story and product pathways.

### 5. Before there were walls, there was a pavilion

Purpose: Harvest arrival story.

Sources: Milk Create Pavilion writing, dairy history, reclaimed crates, making and gathering. Retrieve human media through Empathy Ledger metadata.

### 6. The wood the range almost lost

Purpose: Harvest material-memory story.

Sources: The Cedar, Witta archival context and Barry material after approval. Link to The Harvest work page.

### 7. Country sets the pace

Purpose: Black Cockatoo Valley place chapter.

Sources: aerial arrival, before/current map, creek and habitat evidence. Replace all stale acreage, entity and offering claims with current core facts.

### 8. Material remembers

Purpose: cross-project connective essay.

Sources: recycled lids at Goods, milk crates and cedar at Harvest, forest and water at Black Cockatoo Valley. This is the strongest non-organisational way to reveal the ecosystem.

## Interaction grammar available to the website

1. Emotional film grammar from ACT video storytelling
2. Time by people history from the Living Story Map
3. Catch-a-voice and chorus from Reciprocal Voices, rebuilt with cleared ACT audio
4. Place-led chapter rhythm from Oonchiumpa, without lifting community content
5. Constellation and evidence links from PICC, without lifting community content
6. Object-to-material movement from Goods
7. Aerial-to-table arrival from The Harvest
8. Threshold-to-alternative movement from CONTAINED into JusticeHub

## Publication states

Every candidate should have one of these explicit states:

- **Approved for this ACT surface**: destination, people, context, credit and expiry are recorded.
- **Currently public, authority check required**: visible already, but cross-context permission is unresolved.
- **Internal candidate**: useful for curation, not for publishing.
- **Community or client held**: structural reference only unless the principal authorises a derivative.
- **Do not index or publish**: private, identifying, caller-held or provenance-deficient material.

## Verified unknowns

- Repository presence does not establish copyright ownership or destination-specific consent.
- Some public folders contain placeholders, scraped evidence caches or unresolved people media.
- Historical images at The Harvest need source and rights confirmation.
- Black Cockatoo Valley facts and proposed offerings require reconciliation with current ACT core facts.
- Reciprocal Voices contains privacy-sensitive source mappings that must remain outside all generated indexes and deployments.
- Empathy Ledger runtime records remain necessary to complete approval packets for named people, quotes and media.

## Conclusion

The full sweep establishes enough material to build the parent website without inventing a new story. The strongest experience begins with art, follows human questions into canonical project stories, and returns to the ACT field with a clearer understanding of relationship, authority, material and place.

The website can reuse interaction grammar broadly. It can reuse people and community content only through the governed publishing chain.
