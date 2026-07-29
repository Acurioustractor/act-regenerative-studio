---
date: 2026-07-21T14:52:14+08:00
researcher: Codex
git_commit: a54fc5aa5c3f0b362a0d818f58d6f7b97d2632e5
branch: wip/world-class-site-2026-06-13
repository: act-regenerative-studio
topic: "ACT yearly reviews, old blogs, interactive experiences and story media"
tags: [research, archive, history, blog, media, consent]
status: complete
last_updated: 2026-07-21
last_updated_by: Codex
last_updated_note: "Resolved the 2024 media order, audited the live newsletter systems and mapped connected project repositories."
---

# Research: ACT yearly reviews, old blogs, interactive experiences and story media

## Research question

Have all yearly check-ins, old blogs and reflective interactive experiences been found, and what image and video material can inform the long ACT history?

## Summary

The scoped repository and archive contain two annual reviews, one earlier personal season review, 36 Webflow blog records, 49 additional article-source records and several separate interactive storytelling systems.

The most important missing source was **BK's Season Review**, created in December 2023. It contains eight Odysee video chapters and eight paired Audius tracks. It is marked draft and has no publication timestamp.

The media corpus is large. The old Webflow export contains 261 references to media and 245 unique URLs. The 2025 review adds 20 hero images and six Descript films. Neither archive contains structured rights, consent or licence fields. Existing publication and public URLs prove prior context, not authority for a new use.

## Annual and seasonal reviews

### 2023: BK's Season Review

Source: `data/A Curious Tractor - Blogs.csv`, row with slug `bks-season-review`.

- Created 13 December 2023.
- Marked draft. No `Published On` value.
- Eight reflection chapters: Achievements, Obstacles, Creativity, Engagement, Personal Growth, Next Season, Curious and the full review.
- Eight Odysee films and eight paired Audius audio tracks.
- Includes a generated song/reflection and one image.
- No consent, credit, rights or licence fields.

This is the strongest founder-interiority source found. It predates the project-heavy 2024 review and records how Ben understood the work while it was still forming.

### 2024: public year in review

Former route: `https://www.act.place/2024-in-review`.

Preserved source:

- `/Users/benknight/Code/act-global-infrastructure/wiki/raw/2026-04-07-scrape-act-place-2024-review.md`
- `/Users/benknight/Code/act-global-infrastructure/wiki/sources/2026-04-07-scrape-act-place-2024-review.md`

The capture contains 26 dated moments from January to December. It links BG Fit, DAD.LAB, June's Patch, Diagrama, SMART Stories, Gold.Phone, Goods on Country, Bwgcolman (Palm Island), the Confessional, Bimberi and the Queensland Youth Justice Inquiry tool.

The preserved version is text only. No original media manifest was captured. There is no current Next.js route for the review.

### 2025: Growing Curious interactive review

Archived implementation:

- `/Users/benknight/Code/act-global-infrastructure/archive/intelligence-platform/apps/webflow-portfolio/`
- Duplicate active codebase: `/Users/benknight/Code/act-intelligence-platform/apps/webflow-portfolio/`
- Route: `/2025-review`
- Encoded deployment: `https://webflow-portfolio-one.vercel.app/2025-review`

The experience contains:

- season-based scrolling through Planting, Growing, Harvesting and Resting;
- an interactive constellation canvas;
- a Leaflet place map;
- modal project stories;
- project discovery;
- a land redevelopment sequence;
- a year-in-numbers surface;
- 24 curated timeline entries in `data/curated-2025.json`;
- 20 hero image references and six Descript films.

The application can silently use `DEMO_DATA` when its API fails. Metrics visible in the interface are therefore not evidence until traced to a source.

## Old Webflow blog archive

Canonical export: `/Users/benknight/Code/act-regenerative-studio/data/A Curious Tractor - Blogs.csv`.

Verified structure:

- 36 records spanning 2023 to 2025.
- 21 records marked non-draft.
- 15 records marked draft, including five that also retain a publication timestamp.
- 261 media references, 245 unique URLs.
- 205 inline image references.
- Media hosts include Webflow CDN/uploads, Embedly, Audius, YouTube and Descript.
- The file contains no structured consent, rights or licence columns.

Reflective records with direct value for the ACT history:

- `bks-season-review`
- `its-overwhelming-isnt-it`
- `life-is-hard-but-its-not`
- `the-raucous-revolution`
- `between-waters-and-worlds-a-day-on-quandamooka-country`
- `spain-diagrama-trip-reflection`
- `the-weight-of-silence-and-the-audacity-to-imagine-reflections-on-fear-hope-and-the-long-game-of-human-liberation`
- `powering-change-a-curious-tractors-journey`
- `historys-wounds-and-tomorrows-possibilities`
- `edition-1-sowing-seeds-of-connection-2`

Media-rich records:

- **Edition #1: Sowing Seeds of Connection**: 21 images, a YouTube film and extensive embeds.
- **At the Speed of Ceremony**: 18 images from Bwgcolman (Palm Island) and Goods work.
- **The ACT comic**: 18 images.
- **Seeds of Change**: 15 Kalkadoon Country images.
- **Conversation Camp**: 14 images.
- **History's wounds**: 12 images and two Descript films.
- **The Tapestry of Dignity**: 11 images.
- **Wilya Janta**: eight images. One caption credits Andrew Quilty and another identifies the Wilya Janta website as source.
- **CONTAINED: Where Policy Meets Flesh**: six images.
- **From Bolivia to Brisbane**: six images.
- **Beyond Bars**: three images and two YouTube films.

The current ACT `/blog` does not read this CSV. It reads public editorial records syndicated from Empathy Ledger through `src/lib/empathy-ledger-editorial.ts`. The checked-in fallback snapshot contains 29 articles. Current pages support a hero and up to eight gallery images.

## Wider writing and interaction archive

### Article sources

Global infrastructure contains 49 raw article records and 49 corresponding source summaries under:

- `/Users/benknight/Code/act-global-infrastructure/wiki/raw/`
- `/Users/benknight/Code/act-global-infrastructure/wiki/sources/`

These include Bimberi reflections, Spain and Diagrama writing, NAIDOC and fire, Oonchiumpa, Palm Island, Goods and personal justice essays. They are knowledge sources. Their presence is not publication permission.

### ACT Brand Guide

`/Users/benknight/Code/ACT Brand Guide` contains routes for methodology, platforms, projects, brand, about and galleries, plus roughly 44 local gallery photographs under `public/galleries/photos/`.

### Aesthetics of Asymmetry

`/Users/benknight/Code/act-aesthetics-of-asymmetry` contains episode, artefact, campaign and Murri Watch support routes. Its encoded public site is `https://aesthetics.act.place`.

### ACT video storytelling

`/Users/benknight/Code/act-video-storytelling` contains a static review surface at `public/review.html`, motion studies under `public/voice-canvas/`, completed renders under `out/`, and earlier renders under `public/previous-renders/`.

### Other interaction references

`/Users/benknight/Code/AIME Hoodie Journey` contains three self-contained Webflow scrolling prototypes. They use progress, phase changes, expanding cards and modal detail. They are useful interaction precedents, not ACT history sources.

## Media use classification for the long history

### Strongest founder-history material

1. BK's Season Review, as voice, rhythm and private reflection.
2. The 2024 review chronology, as the factual spine for the year.
3. The 2025 seasonal interface, as an interaction model and discovery index.
4. Powering Change, Dear Souls Adrift, Life is hard and The Raucous Revolution, as evidence of the language ACT used while becoming itself.

### Strong visual sequences with governance work attached

1. At the Speed of Ceremony and related Palm Island work.
2. Seeds of Change on Kalkadoon Country.
3. History's wounds and Oonchiumpa.
4. Wilya Janta and Goods on Country.
5. NAIDOC with Jimmy.
6. Mission Beach Elders trip.
7. Jeremy Donovan's Fire and Road material.

These sequences depict named people, cultural knowledge, community places or partner-held work. They require item-level review before reuse.

### Lower-risk discovery material

- Founder-only reflections where Ben is author and subject.
- ACT-made diagrams, interface captures and comic experiments.
- Place footage without identifiable people, once Country, creator and original context are confirmed.
- Existing ACT prototype footage, while retaining its status as currently public but not yet authority-verified.

## Publication boundary

A media URL answers one question: where the file was seen.

It does not answer:

- who made it;
- who appears in it;
- what the original agreement covered;
- whether cultural review occurred;
- whether a new ACT history page is inside that agreement;
- what credit must travel with it;
- whether permission can be withdrawn.

The history media review should retain, per asset: source publication, people depicted, creator, original context, consent scope, cultural review, reuse decision and credit line.

## Open questions

- The original image order and page design of the 2024 review were not preserved in its text scrape.
- The current public newsletter archive depends on database access, so the number and contents of sent brand editions were not established from the repository alone.
- Draft records with publication timestamps need historical interpretation. The audit preserves both values instead of choosing one.
- Several remote Webflow and Descript assets may disappear. Archival availability and publication authority are separate questions.

## Follow-up research: 2024 sequence, newsletters and connected repositories

### The 2024 sequence is recovered

The original Webflow page remains available at `https://www.act.place/2024-in-review`. Its DOM preserves 31 timeline moments, 48 image elements and three Vidzflow films. No media was downloaded for this audit.

Ordered sequence:

1. 4 Jan: Confit and BG Fit in Mount Isa. Two images.
2. 28 Jan: ACT Lab commences. One image.
3. 4 Feb: PRF application and Justice Co-lab. One image.
4. 12 Feb: Conversation Camp. Two images.
5. 14 Feb: DAD.LAB. One image and Vidzflow film `YUF4fUaphM`.
6. 28 Feb: Kickin It at Acmena. One image.
7. 1 Mar: SMART Stories begins. One image.
8. 5 Mar: con-nected v.01. One image.
9. 6 Mar: Worldview. Vidzflow film `Tc7nrvP2Ud`.
10. 6 Apr: Diagrama in Spain. Two images.
11. 13 Mar: Reintegration Puzzle abstract. One image. This event appears after 6 Apr in the rendered DOM.
12. 23 Apr: Confessional and Treacher. Two images.
13. 6 May: Westpac Fellows at the Farm. One image.
14. 15 May: Queensland Gives. One image.
15. 7 Jun: June's Patch build. Two images.
16. 20 Jun: Reintegration Puzzle and Gold.Phone. Two images.
17. 27 Jun: SMART Directors filming. One image and Vidzflow film `sLlICtiHcX`.
18. 2 Jul: first Kalgoorlie visit. Two images.
19. 16 Jul: AMP Spark at Beechworth Prison. Two images.
20. 18 Jul: ReKindle on ABC. One image.
21. 7 Sep: AIME journey from Mutitjulu to Darwin. Two images.
22. 24 Sep: Minjerribah. One image.
23. 2 Oct: Goods in Kalgoorlie. Three images.
24. 20 Oct: June Canavan Foundation at the Farm. Two images.
25. 3 Nov: Goods on Bwgcolman (Palm Island). Two images.
26. 20 Nov: Mount Isa CAMPFIRE. Two images.
27. 28 Nov: AMP Spark final. Two images.
28. 29 Nov: SMART Recovery anniversary. Two images.
29. 5 Dec: Bimberi ReSOLEution. Two images.
30. 10 Dec: Youth Justice Inquiry tool. One image.
31. 16 Dec: return to Bwgcolman. Two images.

All 48 images use Webflow collection base `https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/`. Image alt attributes are empty. Timeline context and filenames identify the events, but do not identify the creator, depicted people or permission scope.

### The live newsletter gap is resolved

Read-only queries were limited to edition metadata and public content. No subscriber or contact data was queried.

The intended ACT public newsletter system uses `newsletter_drafts`. It contains one row total: a private funder draft with status `reviewed`. It contains zero rows where `audience=brand` and `status=sent`. The planned `/newsletters` archive therefore has no editions to render, and the production route currently returns 404.

One historical ACT newsletter exists in the live Empathy Ledger `articles` table: **Edition #1: Sowing Seeds of Connection**. It exists twice due to Webflow and sitemap imports:

- `edition-1-sowing-seeds-of-connection-2`
- `act-blog-edition-1-sowing-seeds-of-connection-2`

The richer record contains 21 embedded photographs and one Dad.Lab YouTube film, ID `7W_N8yvjX_4`. Its subjects include the Food Connect Shed, SMART Stories, Dad.Lab at Black Cockatoo Valley, the Confessional and a founders' reflection.

The record has no `featured_image_id` or `gallery_ids` governance linkage. Its images are raw public-storage URLs inside imported HTML. It is a discovery source, not an approved media packet.

Code paths:

- `/Users/benknight/Code/act-global-infrastructure/apps/website/src/lib/newsletters.ts`
- `/Users/benknight/Code/act-global-infrastructure/apps/website/src/app/newsletters/page.tsx`
- `/Users/benknight/Code/act-global-infrastructure/apps/website/src/app/newsletters/[slug]/page.tsx`
- `/Users/benknight/Code/act-regenerative-studio/src/data/empathy-ledger-editorial.generated.json`

### Connected repository map

The canonical registry is `/Users/benknight/Code/act-global-infrastructure/config/living-ecosystem-canon.json`. The core path registry is `config/repos.json`.

#### ACT Studio

Path: `/Users/benknight/Code/act-regenerative-studio`

Role: public hub, history, project entry points and receiving surface for approved editorial packets.

#### Empathy Ledger

Path: `/Users/benknight/Code/empathy-ledger-v2`

Role: authority layer for story, media, consent, syndication, cultural review and use-and-return records. Public story surfaces include articles, field notes, stories, journeys, storytellers and projects. Control surfaces include consent logs, syndication review, media review and Elder/family review.

#### JusticeHub and CONTAINED

Path: `/Users/benknight/Code/JusticeHub`

Role: justice stories, evidence and the current CONTAINED experience. Strong media collections include Fire and Road, CONTAINED, STAY, Judges on Country and project articles. CONTAINED is part of JusticeHub and Art, not a separate public field. The separate `/Users/benknight/Code/Contained` repository is a legacy/reference surface.

#### Goods on Country

Path: `/Users/benknight/Code/Goods Asset Register`

Role: field notes, gallery, media, stories and public product work. Large collections cover Utopia, partners, builds, process and community work. Handoffs already record the need for per-image consent review.

#### The Harvest

Path: `/Users/benknight/Code/The Harvest Website`

Role: community place, newsletters, story packs, weekly reflections and oral-history/photo systems. Governance documentation includes photo consent and oral-history procedures.

#### Black Cockatoo Valley and ACT Farm

Path: `/Users/benknight/Code/act-farm`

Role: land practice, stays, map, conservation and place imagery. Black Cockatoo Valley remains the public place name. It is not a separate current project from ACT Farm.

#### Related approval-boundary repositories

- Oonchiumpa: `/Users/benknight/Code/Oochiumpa`
- Palm Island Repository: `/Users/benknight/Code/Palm Island Reposistory`
- ACT video storytelling: `/Users/benknight/Code/act-video-storytelling`
- Oonchiumpa/Palm living story map: `/Users/benknight/Code/10-years`
- Reciprocal Voices prototype: `/Users/benknight/Code/reciprocal-voices-interactive`

The Palm Island Repository is a client/community archive and is explicitly excluded from automatic ACT repository sync. Oonchiumpa, the Palm story map and Reciprocal Voices hold governed community material. Their interaction ideas can be studied without treating their stories as generic ACT assets.

### Publishing chain

The repository architecture defines this chain:

`canonical project code -> Empathy Ledger story/media record -> consent, credit and cultural review -> approved derivative packet -> ACT history`

Repository connection is useful for discovery. It does not grant the history page permission to render raw project files.
