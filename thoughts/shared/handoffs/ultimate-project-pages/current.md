---
date: 2026-04-22T20:00:00Z
session_name: ultimate-project-pages
branch: main
status: active
---

# Work Stream: ultimate-project-pages

## Ledger
**Updated:** 2026-04-22T20:00:00Z
**Goal:** EL connections + mobile nav shipped (881cfdb). Next session continues with blog polish, mosaic tweaks, or the EL→site editorial workflow.
**Branch:** main — head 881cfdb ("feat(el): per-page Empathy Ledger connections + mobile nav drawer")
**Test:** npm run dev on :3300. `npm run sync:el-media` after any EL-linkage changes.

### Session outcome (2026-04-22 evening)

- **EL Connections panel** shipped on every project and art page (photos, videos, stories, with project-scope / whole-org scope toggle + deep links into EL).
- **Image picker rebuilt** — two segments (ACT Projects / Organisations), fixed the silently-ignored `organization=<slug>` filter by switching to `organization_id=<uuid>` via a hard-coded 25-org registry.
- **Sync pagination** — per-org up to 500, per-project up to 250. Videos now sync alongside photos.
- **`elProjectSlugs` merge** — ACT projects can now fan out to multiple EL projects and the sync unions the pools (Quandamooka Justice + MMEIC Cultural Initiative = 187 media).
- **`empathyLedger` field on all 43 ACT projects** — 17 specific partner-org mappings, 26 defaulted to `a-curious-tractor` with notes to refine later. Art projects gained a direct `empathyLedger` override; The Caravan shipped as a first-class art project linked to ACT-CVN.
- **MobileMenu drawer** — hamburger + portalled right-side panel. Closes a gap where the `md-only` nav left phone users with no navigation at all.
- **`/admin/empathy-ledger-coverage`** — audit dashboard showing per-project EL linkage and media counts, plus refining instructions.

### Known follow-ups

- **26 projects defaulted to `a-curious-tractor`** still need review. List visible at `/admin/empathy-ledger-coverage`. Candidates to confirm: Goods on Country / Goods Tennant Creek (own EL org?), The Harvest (own EL org?), any that should point at Oonchiumpa, Mounty Yarns, or TOMNET once those orgs get media.
- **Three EL orgs missing from snapshot** (no media yet in EL): `tomnet`, `mounty-yarns`, `mmeic` (org-level). Panel renders empty state. Will auto-fix on next sync once media is added in EL.
- **`travelling-womens-car`** left as default parent — user confirmed it hasn't started yet.
- **As EL adds new orgs and more specific projects**, mappings should shift away from the `a-curious-tractor` default.

### Resume prompts (pick one and paste after /clear)

**A — Blog long-read polish.**
> Dev on :3300. Open http://localhost:3300/blog/seeds-of-change-walking-with-elders-and-youth-on-kalkadoon-country. The long-read layout has: full-bleed hero, short italic lede, prose body at 720px, Field Photographs gallery (up to 8 EL previews), author block, CTA band, 3-card Suggested Reading. Check type sizes, spacing, gallery caption behaviour on mobile. Fix obvious issues. No em dashes.

**B — Mosaic curation tweaks on the home.**
> The "More from the field" mosaic at the bottom of src/app/page.tsx uses `mosaicTiles` (9 tiles). Current roster: PICC Elders Hull River Story, CivicScope, CONTAINED, Gold.Phone, Uncle Allan Palm Island, Dad.Lab, Community Capital, Oonchiumpa, SMART Recovery. Each tile has optional `override` (always wins) and `fallback` (used when EL has nothing). Swap tiles, change names, repoint hrefs per user direction. Each `slot` id (e.g. `home-mosaic-dad-lab-25`) persists image picks to `src/data/image-overrides.json`.

**C — Refine the 26 `a-curious-tractor` default EL mappings.**
> Visit /admin/empathy-ledger-coverage to see all 43 ACT projects and their EL org mapping. 26 are flagged as defaulted (amber). For each one I name, update `src/data/projects.ts` to point at the correct EL org slug (and optionally `elProjectSlugs: [...]` for a specific EL project), remove the `notes` field, then re-run `npm run sync:el-media`.

**D — EL → site editorial workflow.**
> Sketch + start the approval pipeline the user described: new EL stories should flow to the ACT site only when the team marks them "approved for ACT platform." Today the sync pulls everything matching the project/org. We need: (1) a way to tag EL stories as `approved_for_act_site: true`, (2) the sync to honour that flag, (3) a small admin queue at `/admin/pending-el-stories` showing new untagged items. Start by checking the EL `stories` table for any approval-flag columns, then propose the data model.

**E — Panel UX polish + admin gating.**
> The EL Connections panel (src/components/projects/EmpathyLedgerConnections.tsx) currently renders for everyone. Consider: (a) admin-only gating — the affordance fits the team, not public visitors; (b) bottom-left launcher button collides with the Next.js dev indicator on localhost; (c) Videos tab just lists URLs — should have actual video player previews; (d) notes banner (amber) could be clearer. Pick one and fix it.
