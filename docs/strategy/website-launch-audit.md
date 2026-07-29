# ACT Website Launch Audit

Last reviewed: 2026-05-24  
Canonical local review surface: `http://localhost:3001/`

## Launch Decision

The new Next site is the only design surface for launch work. The legacy public
domain can be used for content inventory and redirect planning, but not as a
design reference.

The Harvest website review is now treated as an ACT-wide launch framework, not a
Harvest-specific copy task. It applies to navigation clarity, one clear H1 per
route, CTA labels that say what the visitor is doing, mobile media crops,
footer trust details, privacy visibility, and page-specific metadata.

Primary navigation for launch:

- About
- Projects
- Stories
- Art
- Farm
- Wiki
- Contact

Method, Economy, Partners, Vision, Impact, Principles, Governance, How We Work,
Studio, Media, and Storytellers stay reachable through contextual links and the
footer. They should not carry primary navigation weight until each route has
stronger launch content and visual QA.

## Route Status

| Route | Status | Launch note |
| --- | --- | --- |
| `/` | launch | New video-heavy homepage and story/project pathways. |
| `/about` | launch | Core ACT context. |
| `/projects` | launch | Portfolio entry point, now points field writing to `/stories`. |
| `/stories` | launch | Canonical public story layer for immersive stories. |
| `/stories/utopia-may-2026` | launch | Consent-safe Goods Utopia story shell. No pending voice is public. |
| `/goods` | launch | Flagship project route. |
| `/justicehub` | launch | Flagship project route. |
| `/empathy-ledger` | launch | Flagship project route and canonical consent system story. |
| `/harvest` | launch | Flagship project route. |
| `/farm` | launch | Land and visit pathway. |
| `/art` | launch | Public works and studio line. |
| `/wiki` | launch | Durable source trail for projects and system context. |
| `/contact` | launch | Main GHL-backed contact path. |
| `/blog` | later | Keep as article archive and backwards-compatible editorial route. |
| `/blog/[slug]` | later | Keep for syndicated articles from Empathy Ledger. |
| `/method` | unpromote | Contextual link only for launch. |
| `/economy` | unpromote | Contextual link only for launch. |
| `/partners` | unpromote | Contextual link only for launch. |
| `/vision` | unpromote | Contextual link only for launch. |
| `/impact` | unpromote | Contextual link only for launch. |
| `/principles` | unpromote | Contextual link only for launch. |
| `/governance` | unpromote | Contextual link only for launch. |
| `/how-we-work` | unpromote | Contextual link only for launch. |
| `/studio` | unpromote | Contextual link only for launch. |
| `/media` | fix before launch | Needs full visual/content QA before promotion. |
| `/storytellers` | fix before launch | Consent-led empty state is acceptable, but route should not be promoted until profiles exist. |
| `/events` | later | Keep out of launch nav. |
| `/ask` | later | Keep out of launch nav. |
| `/admin/*` | admin/private | Never part of public launch navigation. |

## Project Route Checklist

Thirty-two static project routes were smoke-tested for `200` during the launch
review. Each route needs the same page-level checklist before heavy promotion:

- Hero media renders or has a strong fallback.
- Project story explains place, people, method, and current state.
- Primary CTA is specific to the project, not generic.
- Related articles or story links point to `/stories` or `/blog` intentionally.
- Wiki/source links are present only where a wiki page exists.
- Empathy Ledger content is shown only when public/cleared.
- Newsletter CTA carries project context and route tags.
- No stale `act.place` year-in-review or old design links are used as launch CTAs.

Static project slugs checked:

`black-cockatoo-valley`, `diagrama`, `gold-phone`, `empathy-ledger`,
`fishers-oysters`, `justicehub`, `goods`, `bg-fit`,
`quandamooka-justice-strategy`, `smart-recovery-gp-kits`,
`goods-tennant-creek`, `oonchiumpa`, `pakkinjalki-kari`,
`weave-bed-tennant-creek`, `contained`, `the-harvest`, `tomnet`,
`uncle-allan-palm-island-art`, `the-confessional`, `smart-hcp-uplift`,
`smart-connect`, `regional-arts-fellowship`, `picc-centre-precinct`,
`picc-photo-kiosk`, `picc-elders-hull-river`, `picc-annual-report`,
`caring-for-those-who-care`, `mounty-yarns`, `junes-patch`,
`designing-for-obsolescence`, `travelling-womens-car`,
`nfp-leaders-interviews`.

## Story System V1

`/stories` is the canonical public story layer. `/blog` remains the article
archive for syndicated editorial writing.

Plain-language labels:

- Use `Stories` for immersive narrative pages.
- Use `Blog` for the article archive and article-style writing.
- Do not introduce `Journal` as a public route label unless the route has a
  specific editorial reason and user testing supports it.

Story packet v1 supports:

- Masthead
- Read section
- Immersive media
- Pullquote
- Voices
- Empathy Ledger image gallery
- Empathy Ledger video gallery
- Before/after proof
- Stats
- Wiki/source links
- Newsletter CTA
- Closing scene

Public story pages must hide pending-consent content. Local internal preview can
show that material only with a visible warning and only outside production.

The first implementation is `/stories/utopia-may-2026`, built around the Goods
Utopia pattern. It deliberately withholds Mykel/youth/Elder voice and attribution
until consent is cleared in Empathy Ledger.

## Publishing Workflow

1. Add or clear media, storyteller identity, story text, attribution, and consent
   state in Empathy Ledger.
2. Sync generated ACT data.
3. Add or update a story packet only for public page structure, fallback media,
   route copy, newsletter context, and source links.
4. Link the story from the project page, wiki page, newsletter, and partner page
   only after consent status is public-safe.
5. Use local media/admin overrides only for temporary launch hero images or
   fallbacks. Empathy Ledger remains canonical for new photos, videos, stories,
   consent state, and storyteller identity.

## Newsletter Strategy

Newsletter signup should be global plus contextual:

- Footer remains the global signup.
- Project pages include project-scoped newsletter CTAs.
- Story pages include story-scoped newsletter CTAs.
- `/stories` includes the general story-reader signup.
- Submitted tags should include `Newsletter`, route, source, project/story slug,
  audience, and any project/story labels needed by GHL.

## Harvest Review Launch Rules

Use these checks on every public route before promotion:

- Navigation: primary nav stays `About`, `Projects`, `Stories`, `Art`, `Farm`,
  `Wiki`, `Contact`.
- Hero: one H1, one primary CTA, and any secondary CTA must be contextual.
- Home: `A Curious Tractor` is the first-viewport brand signal. The value
  proposition belongs in supporting copy.
- CTA language: prefer `Explore projects`, `Read stories`, `Start a
  conversation`, `Visit the farm`, and `Join the newsletter`.
- Copy: remove internal workflow language, placeholder states, duplicate back
  home links, and ambiguous bottom-page CTA boxes.
- Naming: write `Listen · Curiosity · Action · Art` or the full method name,
  never bare `LCAA`. Write `Australian Living Map of Alternatives`, never bare
  `ALMA`. Public ACT copy should not use em or en dashes.
- Footer: show Privacy, Terms, contact/newsletter context, and `A Curious
  Tractor Pty Ltd · ACN 697 347 676`. Do not publish ABN until active.
- Metadata: every launch route needs its own canonical, `og:url`, title, and
  description. Nested routes must not inherit the homepage canonical.

## Media Audit Checklist

Before launch and after each major media sync:

- Mobile first viewport crop is checked on `/`, `/projects`, `/stories`,
  `/goods`, `/justicehub`, `/empathy-ledger`, `/harvest`, `/farm`, `/art`,
  `/wiki`, and `/contact`.
- Hero videos have a poster image and do not block the first meaningful paint.
- Images larger than needed for their rendered slot are compressed or replaced
  with responsive variants.
- Alt text describes the actual image, not a filename, upload ID, or generated
  asset label.
- `npm run media:audit` checks launch-route rendered images, public media
  source references, filename-like alt text, video files leaking into rendered
  image tags, and oversized local media.
- Empathy Ledger media remains canonical for new photos, videos, consent state,
  storyteller identity, and attribution.
- Local media is used only for launch fallbacks, hero overrides, or temporary
  public-safe substitutes.

## Production Build Status

Verified on 2026-05-24 against the built Next app:

- `npm run build` passed with network access. The first sandboxed attempt failed
  only because Google Fonts DNS was blocked in the sandbox.
- The build generated 213 static pages.
- `npm run start` is pinned to `next start -p 3001`, so the production server
  uses the same canonical local review surface as development.
- `npm run check:launch-ready` now runs the local launch gate in one command:
  package-script guardrails, generated wiki JSON validity, copy check,
  TypeScript check, server reachability, brand/wiki check, route launch check,
  legacy redirect check, media audit, and form safety check.
- `config/launch-redirects.cjs` is the canonical local redirect map for old
  public routes, canonical slug moves, and demoted project pages.
- Wiki sync produced 89 canonical wiki projects, 454 canonical wiki pages, and
  5 flagship project packs.
- Project-code sync produced 75 canonical project codes, with wiki slugs
  resolved for 44 of 89 wiki projects.
- Empathy Ledger media sync produced 2,802 images across 35 of 89 projects and
  18 of 25 organisations.
- Empathy Ledger storyteller sync currently exposes 1 storyteller and transcript
  sync exposes 106 transcripts.
- Empathy Ledger editorial articles and source packets returned HTTP 401 during
  build sync, so the build kept the existing generated snapshots for those
  datasets.
- During static generation the app logged that Empathy Ledger was unreachable
  and used wiki/static fallbacks for the rest of the build. This is acceptable
  for local launch QA, but should be fixed before relying on live EL editorial
  data in production.

## Verification Status

Verified on 2026-05-24:

- `npm run dev` is pinned to `next dev -p 3001`, matching the canonical local
  review surface.
- `npm run start` is pinned to `next start -p 3001`, matching the canonical
  local production review surface.
- `rg -n "<<<<<<<|=======|>>>>>>>" src/data/*.generated.json` returned no
  merge conflict markers in generated JSON.
- `npm run build` passed and generated 213 static pages.
- `npx tsc --noEmit` passed after the production-build fixes.
- `npm run check:launch-ready` passed against `http://localhost:3001`, checking
  10 launch requirements in one local gate.
- `npm run check:brand` passed against `http://localhost:3001`, verifying ACT
  homepage signals, public-language guardrails, generated wiki content, flagship
  project packs, required wiki routes, no bare `LCAA`/`ALMA`, and no em/en dash
  drift on launch plus major public routes.
- 24 major public routes returned `200`.
- 32 static project routes returned `200`.
- `npm run check:copy` passed.
- Generated wiki JSON conflict markers had been cleared.
- After the story-system implementation, launch routes `/`, `/about`,
  `/projects`, `/stories`, `/stories/utopia-may-2026`, `/goods`,
  `/justicehub`, `/empathy-ledger`, `/harvest`, `/farm`, `/art`, `/wiki`, and
  `/contact` returned `200`.
- `npx tsc --noEmit` passed.
- Public story response for `/stories/utopia-may-2026` did not contain the
  removed consent-pending voice strings.
- Harvest-review launch polish pass added page-specific metadata, structured
  data, footer ACN/legal detail, clearer CTA labels, story/blog naming, and
  repeatable route checks.
- `npm run check:launch` passed against `http://localhost:3001`, checking 96
  routes for `200` after redirects, one H1, page-specific canonical/`og:url`,
  stale CTAs, placeholder copy, consent leaks, and newsletter context tags.
- `npm run check:redirects` passed against `http://localhost:3001`, checking 33
  configured redirects for expected permanent status and destination. The map
  includes legacy public routes `/seeds`, `/action`, `/germinating`, `/news`,
  `/journal`, `/year-in-review`, and `/2025-review`.
- `npm run check:forms` passed against the production server on
  `http://localhost:3001`, verifying production blocks dry-run form submissions
  without sending a CRM lead. Static launch checks still verify newsletter
  context tags in the source.
- `npm run media:audit` passed against `http://localhost:3001`, checking 12
  launch routes, 33 source media references, 202 rendered images, no missing
  public files, no filename-like rendered alt text, no rendered image pointing
  to `.mp4`/`.mov`/`.webm`, and no oversized local media warnings.
- Public wiki rendering now redacts ABN and private credential language from
  public excerpts/details while keeping wiki context and source links available.
- Browser QA verified desktop and mobile for `/`, `/projects`,
  `/stories/utopia-may-2026`, `/wiki`, and `/contact`: each rendered one H1, no
  horizontal overflow, no broken rendered images, no image tags pointing at
  video assets, no bare `LCAA`/`ALMA`, no em/en dash drift, no pending-consent
  story leak, and no browser console errors.
- Compressed `goods-remote-aerial-video.jpg`, `justicehub-community.jpg`, and
  `jinibara-country-aerial.jpg` for launch-size hygiene while preserving
  full-width page use.
- Focused Playwright QA checked desktop and mobile first viewports. `/projects`
  and `/wiki` mobile overflow issues were fixed, and `/projects` and `/art`
  now include first-viewport visual media.
- Public dynamic copy now passes through ACT brand text cleanup at the wiki,
  project-card, project archive, art, and vision-markdown display boundaries.

## Remaining Launch Risks

- Production deployment and DNS/domain switch for `act.place` and
  `www.act.place` have not been completed in this pass. The local redirect map
  is verified, but it has not been proven on the live domain.
- Live GHL submissions were not sent. Local checks cover dry-run payload shape in
  development and safe dry-run blocking in production.
- Empathy Ledger editorial article and source-packet endpoints need working
  auth before live editorial data can be treated as fully current.
- Full manual visual QA for every public route and every mobile breakpoint is
  not exhaustive. The latest browser pass covered the launch core routes listed
  above.
- ABN remains pending and must not be published until active.

Requires verification after each launch pass:

- `rg -n "<<<<<<<|=======|>>>>>>>" src/data/*.generated.json`
- `npm run check:brand`
- `npm run check:copy`
- `npm run media:audit`
- `npm run check:launch`
- `npm run check:launch-ready`
- `npm run check:redirects`
- `npm run build`
- `npx tsc --noEmit`
- Smoke-test launch nav, `/stories`, `/stories/utopia-may-2026`, and all project routes.
- Desktop and mobile visual QA for `/`, `/projects`, `/stories`,
  `/stories/utopia-may-2026`, `/goods`, `/justicehub`, `/empathy-ledger`,
  `/harvest`, `/farm`, `/art`, `/wiki`, and `/contact`.
- `npm run check:forms` confirms newsletter/contact dry-run payload tags
  without submitting a live CRM lead.
