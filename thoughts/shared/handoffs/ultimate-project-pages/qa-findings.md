---
date: 2026-04-20
session_name: ultimate-project-pages
type: visual-qa-findings
branch: main
tested_against: http://localhost:3300 (Next.js dev)
---

# Visual QA Walk — Findings

Walked homepage, /farm, /harvest, /goods, /ecosystem, and two project pages (justicehub, empathy-ledger) at 1440x900. Screenshots in `/tmp/act-qa/`.

## P0 — Ship blockers

### 1. All 7 wiki-redirect routes return 404

`next.config.js:41-47` permanently redirects these top-level paths to `/wiki/<slug>` pages that don't exist:

| Source | Destination | Final |
|--------|-------------|-------|
| `/governance` | `/wiki/governance` | **404** |
| `/principles` | `/wiki/principles` | **404** |
| `/how-we-work` | `/wiki/how-we-work` | **404** |
| `/vision` | `/wiki/vision` | **404** |
| `/ecosystem` | `/wiki/ecosystem` | **404** |
| `/impact` | `/wiki/impact` | **404** |
| `/studio` | `/wiki/studio-capabilities` | **404** |

`src/app/wiki/` only has `[slug]`, `new`, `source-bridges`, `source-packets`, `page.tsx` — no per-slug static pages. The `[slug]` route evidently does not resolve any of these.

Impact:
- The `/ecosystem` page in this session's work (with `EcosystemLinks` component) is **unreachable** — redirect short-circuits the `src/app/ecosystem/page.tsx` file.
- `/studio` and other nav-adjacent URLs are dead.

Fix options:
1. Remove the stale redirects from `next.config.js` (lets `src/app/ecosystem/page.tsx` etc. render).
2. Populate matching wiki pages via the `[slug]` data source.

Recommended: #1 for `/ecosystem` (has a dedicated page.tsx); audit the other 6 to decide per-route.

## P2 — Polish

### 2. All project pages share a generic `<title>`

`/projects/justicehub`, `/projects/empathy-ledger`, `/projects/black-cockatoo-valley` all return `<title>A Curious Tractor | Regenerative Innovation Studio</title>`. Per-project metadata (SEO, browser tabs, social cards) not set.

Fix: add `generateMetadata({ params })` to `src/app/projects/[slug]/page.tsx` pulling from `getProjectData()`.

### 3. `/farm` has ~1500px of blank mid-page space in static capture

DOM survey shows 23 sections all populated — likely `FullscreenVideo` (655px) and `PhotoStrip` (1458px) components rendering empty containers before media loads. Static prettyscreenshot captures pre-load state.

Verify: load `/farm` in a real browser, watch if strips fill in. If not, check image src resolution in `PhotoStrip` and `FullscreenVideo` components.

## OK — No action needed

- Homepage: hero, stats row, 6-tile project grid, dark quote block, LCAA section, footer all render clean. No console errors.
- `/farm` heroing Black Cockatoo Valley is intentional (BCV is ACT's 150-acre farm property).
- `/projects/goods` 404 is correct — actual slug is `goods-on-country`.
- Justice theme (dark `#0B1F2A` bg + yellow `#F4D04F` text) renders as designed on `/projects/justicehub`.
- Warm theme renders as designed on `/projects/empathy-ledger`.
- Warm Editorial palette migration looks consistent across all routes visited.

## Routes verified

| Route | Status | Notes |
|-------|--------|-------|
| `/` | ✓ | Bold Documentary homepage |
| `/farm` | ⚠️ | Content correct (BCV), lazy media gap |
| `/harvest` | ✓ | "Food, gathering, and regenerative enterprise" |
| `/goods` | ✓ | "Beds that change lives" |
| `/ecosystem` | ✗ | 308 → 404 (see P0) |
| `/projects/justicehub` | ✓ | Justice theme |
| `/projects/empathy-ledger` | ✓ | Warm theme |
| `/projects/goods-on-country` | ✓ | 200 |

## Not tested

- Mobile viewports (375/768).
- Interactive states (hover, focus, form submit).
- Authenticated admin routes.
- Dark mode (deferred to next task per handoff).
