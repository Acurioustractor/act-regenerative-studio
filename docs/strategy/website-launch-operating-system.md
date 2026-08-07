# ACT Website Launch Operating System

> Status: working launch plan. Last reviewed locally on 2026-05-24.
> The domain cutover checklist, launch-hold un-block criteria and Empathy
> Ledger data asks live in [website-launch-cutover-plan.md](./website-launch-cutover-plan.md)
> (Phase 3 of the 2026-08-07 launch review).

## Purpose

This document keeps the new ACT website work oriented around the right system:
the local Next.js app in this repo, the Bold Documentary homepage, the ACT wiki,
Empathy Ledger, and GoHighLevel.

The live `www.act.place` domain is legacy until deployment changes. Do not use it
as the design reference. Use it only for old-route inventory and redirect checks.

## Current Canonical Surface

- Working repo: `/Users/benknight/Code/act-regenerative-studio`
- Local review URL: `http://localhost:3001/`
- Start command: `npm run dev`
- Production review command: `npm run start`
- Full local launch gate: `npm run check:launch-ready`
- Full local launch gate including a fresh build: `npm run check:launch-ready:build`
- Legacy redirect gate: `npm run check:redirects`
- New homepage: `src/app/page.tsx`
- Visual system: `DESIGN.md` and `src/components/design-system/`
- Main app shell and nav: `src/app/layout.tsx`
- Public project system: `src/app/projects/[slug]/page.tsx`
- Flagship pages: `/goods`, `/justicehub`, `/empathy-ledger`, `/harvest`, `/farm`, `/art`
- Legacy redirect map: `config/launch-redirects.cjs`
- Story/editorial source: Empathy Ledger snapshots through `src/lib/empathy-ledger-editorial.ts`
- Wiki source: generated wiki JSON under `src/data/*.generated.json`
- Form and GHL path: `src/components/forms/ContactForm.tsx` to `src/app/api/forms/submit/route.ts`

## Work Rule

Before making design, copy, route, or launch decisions:

1. Start or confirm the local server on `http://localhost:3001/`.
2. Confirm generated JSON has no conflict markers:
   `rg -n "<<<<<<<|=======|>>>>>>>" src/data/*.generated.json`.
3. Run `npm run check:launch-ready` before calling any local pass launch-ready.
4. Review the local page, not the live legacy domain.
5. Check `DESIGN.md` before adding UI patterns.
6. Check ACT brand alignment before public copy.
7. Treat the wiki as durable context, Empathy Ledger as consented story and media, and GHL as relationship follow-up.
8. Add old public routes to `config/launch-redirects.cjs`, then run `npm run check:redirects` against the rebuilt local server.

## Launch Principle

Launch fewer surfaces, finished.

Do not ship a broad site where half the routes feel like placeholders. The first
public launch should feel complete even if it is intentionally small. Hidden or
unlinked future routes can keep developing behind the scenes.

## Minimal Finished Launch Scope

| Surface | Launch standard |
| --- | --- |
| `/` | New video-heavy homepage, clear ACT vision, project pathways, story/art finish. |
| `/projects` | Coherent project index with no dead or weak cards. |
| `/goods` | Strong enough to introduce Goods and point to the deeper Goods site/story. |
| `/empathy-ledger` | Clear consent-first story system framing. |
| `/justicehub` | Clear justice/public works framing. |
| `/farm` | Black Cockatoo Valley, Jinibara Country, visit/residency path. |
| `/harvest` | Community hub, food, gatherings, local pathway. |
| `/art` | The work lands in culture, not just service delivery. |
| `/stories` | Only publish approved, image-led stories. Decided 2026-08-07: one slug space at `/stories/[slug]` for packets and editorial articles; `/blog` is a 308. |
| `/wiki` | Useful as living knowledge, but not promoted as a finished public archive unless article quality is ready. |
| `/contact` | Clear routes into GHL with source/context tags. |

Everything else should be one of:

- linked only when it is finished;
- admin/private;
- redirected to a stronger parent page;
- left in the build but removed from primary nav until ready.

## Story System To Build

The missing first-class product is an ACT story page model. Goods already has the
shape in `/Users/benknight/Code/Goods Asset Register/v2/src/lib/data/trip-stories.ts`
and `/Users/benknight/Code/Goods Asset Register/v2/src/components/stories/trip-story.tsx`.

Bring that pattern into ACT as a reusable story packet:

- `src/data/story-packets/*.ts` or generated JSON
- `src/app/stories/[slug]/page.tsx`
- `src/components/stories/StoryScroll.tsx`
- `src/lib/stories/resolve-story-media.ts`
- optional partner variant route: `src/app/for/[partnerSlug]/[storySlug]/page.tsx`

Core block types:

- masthead: full-screen video or image, place, date, title, standfirst
- read: short editorial text with optional under-text media
- immersive: full-bleed video transition
- pullquote: one sentence that carries emotional weight
- voices: consent-aware storyteller quotes
- el-gallery: photos from Empathy Ledger by tag query
- el-video-gallery: videos from Empathy Ledger by tag query
- before-after: one visual proof pair
- stats: sourced numbers with dates
- wiki-links: durable project context
- partner-proof: tailored proof for a named partner or funder
- close: art-led closing image, invitation, or cultural work

Consent rules:

- Public route shows only content cleared in Empathy Ledger.
- Internal preview may show consent-pending content with a visible warning.
- Youth, Elder, and cultural content requires the relevant protocol before name, portrait, or voice appears publicly.
- Quotes stay verbatim and are never recombined.

## First Flagship Story: Goods Utopia

Use the Goods Utopia work as the first proof of the story system.

Source files already identified:

- `/Users/benknight/Code/Goods Asset Register/wiki/outputs/utopia-story-spine-2026-05.md`
- `/Users/benknight/Code/Goods Asset Register/wiki/outputs/2026-05-22-utopia-trip-report.md`
- `/Users/benknight/Code/Goods Asset Register/wiki/outputs/2026-05-23-empathy-ledger-prompt-goods-upload-flow.md`
- `/Users/benknight/Code/Goods Asset Register/v2/src/lib/data/trip-stories.ts`

Story shape:

1. Oonchiumpa holds the trip.
2. Young people build the beds they will sleep on.
3. Mykel builds seven beds and names a possible future job.
4. Community leads the road to Utopia Homelands, Arlparra, Arawerr, and Ampilatwatja.
5. Beds move from delivery object to household infrastructure.
6. Elder voice and consent carry the heaviest moments.
7. The model closes on making locally, not delivering forever.
8. The story ends in art, voice, and invitation.

Public blocker:

- Mykel and youth footage are consent pending.
- Elder quotes and Ampilatwatja footage need review and permission.
- Counts must be reconciled between narrative language and live Goods asset data.

## Communications Layer

Every public story should produce one canonical story packet, then generate:

- website story page;
- partner page;
- wiki article or source note;
- GHL campaign/email sequence;
- social excerpt;
- funder proof block;
- internal follow-up task list.

GHL tagging pattern should preserve:

- project: `goods`, `empathy-ledger`, `justicehub`, etc.
- audience: partner, supporter, funder, storyteller, artist, researcher
- story: `utopia-may-2026`, etc.
- source route and CTA
- partner or campaign context

The current contact form already carries route/source/context tags. Partner and
story pages should extend that pattern rather than creating disconnected forms.

## Partner Pages

Build bespoke partner pages as configured views over the same story packet.

Recommended route:

- `/for/[partnerSlug]`
- `/for/[partnerSlug]/[storySlug]`

Each partner page should include:

- private or noindex option;
- partner-specific opening note;
- relevant story blocks only;
- proof metrics with dates;
- consent-safe media;
- clear next action;
- GHL tags for partner, story, campaign, and route.

Example:

- `/for/centrecorp/utopia-may-2026`
- Utopia delivery numbers, map, plastic diverted, bed allocation model, approved photos, next pathway.

## Source Of Truth

Use this layering:

| Layer | Job |
| --- | --- |
| Wiki | durable facts, project context, decisions, background |
| Empathy Ledger | consent, storyteller identity, media, public/private status |
| Goods asset register | bed IDs, delivery records, live deployment proof |
| ACT website | public narrative, routes, partner pages, project framing |
| GHL | relationship journey, segmented follow-up, campaign reporting |

Do not duplicate facts manually when a source can generate them. If manual copy is
needed for launch speed, label the source and date in the story packet.

## Build Phases

### Phase 1: Launch a Finished Small Site

- Freeze primary nav to finished routes only.
- Audit all public routes for 200 status, visual completeness, and no placeholder copy.
- Decide which existing routes are hidden, redirected, or launch-ready.
- Keep the new homepage as the public entry point.
- Ship redirects from old production routes to the new structure.

### Phase 2: StoryScroll MVP

- Port the Goods `TripStory` model into ACT as `StoryScroll`.
- Implement internal preview and public consent gating.
- Build the Utopia story packet.
- Pull public media from Empathy Ledger by tag.
- Add fallback stills so no story panel fails blank.

### Phase 3: Partner Pages

- Add partner config and `/for/[partnerSlug]` routes.
- Start with Centrecorp, Oonchiumpa, and one open partnership page.
- Connect every CTA to the existing GHL form route with structured tags.

### Phase 4: Editorial And Campaign System

- Define story writing profiles: field note, partner brief, public article, GHL email, wiki note, art close.
- Add a repeatable prompt/checklist for writing in ACT voice.
- Connect article/story pages back to project pages and wiki sources.

### Phase 5: Launch QA

- Browser QA desktop and mobile.
- Run `npm run check:launch-ready`.
- Run `npm run check:launch-ready:build` before a release candidate.
- Run `npm run check:redirects` after any old-route or domain-switch change.
- Route smoke test.
- JSON conflict marker check.
- `npx tsc --noEmit`.
- Check no hidden internal notes appear on public routes.
- Check all forms submit or queue correctly.
- Check old-domain redirect map before production switch.

## Immediate Backlog

1. Create route inventory with status: launch, hide, redirect, admin, later.
2. Build ACT `StoryScroll` from the Goods field-notes pattern.
3. Create `utopia-may-2026` ACT story packet.
4. Add consent-gated internal preview mode.
5. Add partner page config and one Centrecorp proof page.
6. Add GHL tag conventions for story and partner CTAs.
7. Run `npm run check:launch-ready` after every launch-facing change.
8. Run full visual QA on local `http://localhost:3001/`.
9. Keep the production redirect/deployment checklist current while replacing the old live site.
