# Confessions Campaign — IA Reframe Plan (2026-05-30)

## Why
Ben review: the campaign reads as "part shit," the UI/UX is clunky, and it is hard to
move between areas. Full IA restructure approved (scope chosen over targeted-fix and
wall-only). Branch: `feat/confessions-ia-reframe` (no auto-deploy until merged).

## Current state
- 4 routes, **no shared nav**, split URLs (`/confessions/*` for voices, `/art/the-payout-wall/*` for data).
- Wall canvas reads as broken: 58vh tall, brightest-first sort crams light into the top ~10%,
  bottom 90% is a black void; top-left legend has no plate and dissolves into the bright cells.

## New IA — one home under /confessions
| Route | Was | Is |
|---|---|---|
| `/confessions` | home (call + voices inbox) | unchanged |
| `/confessions/wall` | `/art/the-payout-wall` | The Payout Wall (moved) |
| `/confessions/friday` | `/confessions/friday` | The Friday Tape (unchanged) |
| `/confessions/method` | `/art/the-payout-wall/method` | How we know + right of reply (moved) |

**Redirects (308, permanent):** `/art/the-payout-wall` -> `/confessions/wall`;
`/art/the-payout-wall/method` -> `/confessions/method`. Keeps the Friday tape's wall link,
the /art listing, and any shared links alive.

## Moves
1. **CampaignNav** component — slim persistent sub-header on all 4 pages:
   `Confess · The Wall · Friday Tape · Method`, current page marked. Land anywhere, reach
   anywhere in a click. This is the core fix for "hard to get around."
2. **Move** wall + method page files to `/confessions/wall` + `/confessions/method`; add the
   308 redirects; repoint every internal link.
3. **Fix the wall canvas** (PayoutWall.tsx): plate the top-left legend (match the bottom one);
   raise the dim-field floor so it reads as a dense wall of *closed doors*, not emptiness; cut
   the height; let the rare gold doors pop against a full dark field.
4. **Weave the spine** — nav carries wayfinding; tighten the connective copy between
   voices <-> data <-> call.
5. **Launch safety** — update `launch-redirects.cjs` (or next redirects), `sitemap.ts`,
   `scripts/check-launch-site.mjs` launchRoutes, and the `/art` listing entry.

## Order of operations
nav -> page moves + redirects -> wall canvas -> cross-links/copy -> verify -> ship.

## Verify before ship
- `tsc --noEmit` clean + `npm run build` green.
- Smoke ALL routes (new + old): `/confessions`, `/confessions/wall`, `/confessions/friday`,
  `/confessions/method` = 200; `/art/the-payout-wall`, `/art/the-payout-wall/method` = 308 to new.
- Screenshot the wall + a campaign page for Ben before merge.
- Merge to main only on Ben's go (auto-deploys).
