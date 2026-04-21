---
date: 2026-04-22T23:30:00Z
session_name: ultimate-project-pages
branch: main
status: active
---

# Work Stream: ultimate-project-pages

## Ledger
**Updated:** 2026-04-22T23:30:00Z
**Goal:** Site-wide text-hygiene + structural polish across every user-facing interior page is done. Next session continues with Farm/Harvest/Art sub-pages (content passes) or inherited follow-ups (EL approval workflow, default-org cleanup, blog polish).
**Branch:** main — head 881cfdb ("feat(el): per-page Empathy Ledger connections + mobile nav drawer") + this session's commit on top.
**Test:** npm run dev on :3300. `npm run sync:el-media` after any EL-linkage changes.

### Session outcome (2026-04-22 late evening — text-hygiene pass)

- **Global header offset fix** — interior pages were clipping under the `fixed` floating nav. Added CSS rule in `src/app/globals.css`: `main > section:first-child, main > div:first-child` get `padding-top: 6rem` (mobile) / `7rem` (md+). Full-bleed first-child sections (home DocHero) opt out via `main > section.full-bleed:first-child` override. Fixes every PageHero-based page + every custom-hero page without touching individual files.
- **About added to main nav** in `src/app/layout.tsx` (first position after logo). MobileMenu picks it up automatically.
- **40% / profit-share scrub** — user flagged as "random and weird." All user-facing mentions removed across About, Principles (3 spots), Partners, Studio. Rewrites use "value circulating back to communities" / "surplus distribution" / dual-entity framing.
- **Metadata title duplication fixed** — 12 pages had `{page title} | A Curious Tractor` explicitly, which layout.tsx then templated to `{page title} | A Curious Tractor | A Curious Tractor`. Stripped the suffix on Media, Impact, Storytellers, Ask, Privacy, Goods, Ecosystem, Empathy Ledger, Farm, Harvest, Terms, JusticeHub, People.
- **Page polish pass** (each got entity decoding, arrow normalization, EL Connections panel on meta pages where relevant):
  - About — LCAA teaser now deep-links to /method (no duplication), fan-out strip to Projects/People/Partners, EL panel, straight quote fix.
  - Method — added "In practice" section with one real project moment per LCAA phase (Fishers Oysters / Empathy Ledger / Goods / JusticeHub), EL panel, arrow fix.
  - How we work — "Surplus distribution back to communities" rewrite, 3 arrows, EL panel.
  - Principles — `${operationalPrinciples.length}` dynamic heading (was hardcoded "10"), EL panel.
  - Vision — fixed broken local `/Users/benknight/.gemini/...` image path in `src/data/vision/vision.md` → `/act_placemat_2026_poster.png` (image was 404ing on every render).
  - Governance — 3 curly apostrophes in dark CTA, EL panel.
  - Ecosystem — "Six public works" → "Public works" (curatedProjects only renders 5; Art has its own door), `&rsquo;` entity, 2 arrows, EL panel.
  - Impact — 4 `&rsquo;` entities, EL panel.
  - Partners — arrow, EL panel.
  - Studio — 3 arrows, EL panel.
  - Contact — 1 arrow.
  - Farm / Harvest / Goods / JusticeHub / Empathy Ledger (project landers) — HTML entity decoding (`&apos;`, `&ldquo;`, `&rdquo;`), trailing span arrows. Left CTA button-label arrows (`The full story →`) as intentional copy.
- **Site-wide final entity sweep** — decoded every remaining `&rsquo; &lsquo; &rdquo; &ldquo; &apos; &hellip;` across src/app (Method, Media, Ask, not-found, Art, Art/[slug], Home, Storytellers/[id], Wiki/[slug], Wiki).
- **Site-wide decorative arrow sweep** — every `<span aria-hidden="true">→</span>` normalized to `&rarr;` (events, art/artists, art/exhibitions, art/commissions, art/artworks, projects/[slug], wiki/[slug], plus the earlier cluster).

### What was deliberately left

- **CTA button-label arrows** (e.g. `The full story →`, `Get in touch →`, `Partner with us →`) — stay as copy, not decorative spans.
- **Inline text labels** like `Open ACT hub page →`, `Enter the art →`, `View 2025 Year in Review →` — design intent in hover/inline states.
- **Data labels** like JusticeHub's `5 → <1` (police contacts).
- **Code comments & webhook server logs** (arrows in `api/webhooks/ghl/route.ts`).

### Known follow-ups (inherited + new)

- **Farm sub-pages** (`/farm/stay`, `/farm/retreats`, `/farm/workshops`) — not yet polished. 80–106 lines each.
- **Harvest sub-pages** (`/harvest/csa`, `/harvest/produce`) — not yet polished. ~95 lines each.
- **Art sub-pages** (`/art/artworks`, `/art/artists`, `/art/exhibitions`, `/art/commissions`, `/art/residencies`) — got arrow fixes only, no full copy pass.
- **Events** — got arrow fix, no copy pass. 135 lines.
- **Terms / Privacy** — title fixes only, no full pass.
- **Blog index / Wiki index / Storytellers index** — lightly touched, could use a proper review.
- **26 projects defaulted to `a-curious-tractor`** still need review (from previous session). Dashboard at `/admin/empathy-ledger-coverage`.
- **Three EL orgs still missing from snapshot** (`tomnet`, `mounty-yarns`, `mmeic`) — will auto-fix on next sync once media is added upstream.
- **EL → site editorial approval workflow** (approved_for_act_site flag) — not started.
- **EL Connections panel UX** — admin-only gating, video previews, launcher collides with Next.js dev indicator on localhost.
- **`/vision` markdown** — `vision.md` still references `2025 → 2026 → 2027 → 2028` plans with specific Q1/Q2/Q3 checklists. Could use a refresh if directions have shifted.

### Resume prompts (pick one and paste after /clear)

**A — Finish the Farm cluster copy polish.**
> Dev on :3300. Open /farm/stay, /farm/retreats, /farm/workshops. Each is ~80–106 lines. Apply the same polish pattern we used on /farm itself: decode any `&apos; &ldquo; &rdquo;` HTML entities, normalize `<span aria-hidden="true">→</span>` to `&rarr;`, check for curly quotes, verify the metadata title doesn't double-suffix `| A Curious Tractor` (layout.tsx adds the template). Check that the pages render above the fixed floating nav (recent globals.css rule should handle this). Don't add EL panels to these sub-pages — they're transactional, not showcase.

**B — Harvest and Art sub-pages cleanup.**
> Same pattern as prompt A but for /harvest/csa, /harvest/produce, /art/artworks, /art/artists, /art/exhibitions, /art/commissions, /art/residencies. Arrows in spans already converted. Left to do: HTML entity scrub, metadata title double-suffix check, any curly quotes or stray `&apos;` in text.

**C — Refine the 26 `a-curious-tractor` default EL mappings.**
> Visit /admin/empathy-ledger-coverage to see all 43 ACT projects and their EL org mapping. 26 are flagged as defaulted (amber). For each one I name, update `src/data/projects.ts` to point at the correct EL org slug (and optionally `elProjectSlugs: [...]` for a specific EL project), remove the `notes` field, then re-run `npm run sync:el-media`.

**D — EL → site editorial workflow.**
> Sketch + start the approval pipeline: new EL stories should flow to the ACT site only when the team marks them "approved for ACT platform." Today the sync pulls everything matching the project/org. We need: (1) a way to tag EL stories as `approved_for_act_site: true`, (2) the sync to honour that flag, (3) a small admin queue at `/admin/pending-el-stories` showing new untagged items. Start by checking the EL `stories` table for any approval-flag columns, then propose the data model.

**E — Panel UX polish + admin gating.**
> The EL Connections panel (src/components/projects/EmpathyLedgerConnections.tsx) currently renders for everyone. Consider: (a) admin-only gating — the affordance fits the team, not public visitors; (b) bottom-left launcher button collides with the Next.js dev indicator on localhost; (c) Videos tab just lists URLs — should have actual video player previews; (d) notes banner (amber) could be clearer. Pick one and fix it.

**F — Blog long-read polish.**
> Dev on :3300. Open http://localhost:3300/blog/seeds-of-change-walking-with-elders-and-youth-on-kalkadoon-country. The long-read layout has: full-bleed hero, short italic lede, prose body at 720px, Field Photographs gallery (up to 8 EL previews), author block, CTA band, 3-card Suggested Reading. Check type sizes, spacing, gallery caption behaviour on mobile. Fix obvious issues. No em dashes.

**G — Mosaic curation tweaks on the home.**
> The "More from the field" mosaic at the bottom of src/app/page.tsx uses `mosaicTiles` (9 tiles). Current roster: PICC Elders Hull River Story, CivicScope, CONTAINED, Gold.Phone, Uncle Allan Palm Island, Dad.Lab, Community Capital, Oonchiumpa, SMART Recovery. Each tile has optional `override` (always wins) and `fallback` (used when EL has nothing). Swap tiles, change names, repoint hrefs per user direction. Each `slot` id (e.g. `home-mosaic-dad-lab-25`) persists image picks to `src/data/image-overrides.json`.
