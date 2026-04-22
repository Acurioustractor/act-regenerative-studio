---
date: 2026-04-23T18:00:00Z
session_name: ultimate-project-pages
branch: main
status: active
---

# Work Stream: ultimate-project-pages

## Ledger
**Updated:** 2026-04-23T18:00:00Z
**Goal:** Reconcile `src/data/projects.ts` + wiki to a single canonical hierarchy, clean the carryover resume prompts (A–G), refresh the vision doc + farm size, tidy GitHub branches, ship.
**Branch:** main — head `686daf2` ("docs: add HTML viewer for ALMA diagrams"), pushed to `origin/main`. Working tree clean apart from `supabase/.temp/cli-latest` (autogen). Production build verified clean (83+ project pages prerender; all static pages compile).
**Test:** `npm run dev` on :3300. Run `npm run sync:wiki && npm run sync:el-media` after any EL-linkage or wiki-slug change. `npm run build` passes.

---

### Session outcome (2026-04-23 — canonical list + reconciliation + polish)

This session replaced the prior approach of per-project mapping refinement with a **whole-list canonical hierarchy** that now lives in project memory:

- `~/.claude/projects/-Users-benknight-Code-act-regenerative-studio/memory/project_canonical_list.md` (auto-loaded each session)
- MEMORY.md index pointer added

The canonical list tiers everything:

- **Tier 1** — 5 flagships: `empathy-ledger`, `justicehub`, `the-harvest`, `goods-on-country`, `black-cockatoo-valley` (+ Art as cross-cutting program at `/art`).
- **Tier 2** — sub-projects nested under each flagship, plus a "standalone partners" subsection (Fishers Oysters).
- **Tier 3** — 9 events/activations demoted to `/events`.
- **Tier 4** — kill list: `green-harvest-witta` merged to The Harvest, `project-her-self` deleted.
- **Slug alignment** — 4 renames applied: `diagrama-spain→diagrama`, `bg-fit-mount-isa→bg-fit`, `smart-hcp-gp-uplift→smart-hcp-uplift`, wiki `dadlab25.md→dad-lab-25.md`.
- **Goods pragmatic split** — data slug stays `goods-on-country` (29-file blast radius + cross-repo touch needed for a full rename); `goods` is the display/route.

### Commits this session

1. `ff09c68` — `refactor(projects): reconcile canonical project list` — 2 deletions, 9 event demotions, 4 slug renames, 11 redirects in `next.config.js`, 8 defaulted EL notes cleaned (`travelling-womens-car → oonchiumpa`; the other 7 kept `a-curious-tractor`), `projects.ts.backup` removed. Regenerated `wiki-projects`, `wiki-pages`, `wiki-flagship-project-packs`, `empathy-ledger-featured`, `living-ecosystem-canon`, `project-code-registry` snapshots. Rolled in prior session's uncommitted work (art sub-page voice cleanup, blog title-case fix, EL Connections admin gate + video thumbs, `/admin/pending-el-stories` scaffold, EL editorial-approval workflow design doc).
2. `a1e22db` — `polish(site): mosaic cleanup + external voice on index pages` — homepage mosaic: replaced demoted `dad-lab-25` tile with `fishers-oysters`, fixed `/goods-on-country` href → `/goods`. Index-page external-voice sweep on events, wiki, storytellers (removed dev language like `EMPATHY_LEDGER_API_KEY`, npm sync commands, "syndication layer", snapshot timestamps). Normalized a raw `→` to `&rarr;` span on the wiki index.
3. `f29b1dd` — `docs(ledger): update handoff + draft EL phase-1 issue body` — first ledger rewrite + saved the drafted GH issue body at `thoughts/shared/plans/el-editorial-approval-phase1-issue-draft.md` (cross-repo auto-post was blocked by guardrail).
4. `b738648` — `docs(vision): correct farm size + refresh 2026 roadmap` — single source of truth for BCV size: **557,803 m² = ~55.8 ha = ~138 acres**. Corrected across 8 files (`vision.md`, `CLAUDE.md`, `src/app/farm/page.tsx` ×3, `compendium/CHANGELOG.md`, `compendium/appendices/glossary.md`, `compendium/02-place/black-cockatoo-valley.md`, `docs/brand/content-drafts/draft-mission-and-about.md`, `docs/architecture/act-ecosystem.md`). Vision 2026 roadmap refreshed for April reality: Q1 ✅ (ACT Hub, GHL), Q2 ✅ (EL V1), rest flagged. Added Fishers Oysters to Pillar 3 + Art-cross-cutting note.
5. `f0d144b` — `feat: add ALMA diagrams as SVG files` — cherry-picked from the deleted `claude/find-act-compendium-jR0C5` branch. Adds `assets/diagrams/alma-loop.svg` + `alma-vs-traditional.svg`.
6. `686daf2` — `docs: add HTML viewer for ALMA diagrams` — cherry-picked from the same deleted branch. Adds `docs/diagrams/alma-diagrams.html`.

All 6 pushed to `origin/main` across three pushes during the session.

### GitHub cleanup this session

- **Branches deleted:** `origin/codex/act-node22-next-fix` (PR #37 was merged; 3 post-merge commits were either superseded or obsolete — main has more sophisticated versions of `.eslintrc.json`, supabase client lazy init, etc.), `origin/claude/find-act-compendium-jR0C5` (Jan 14 branch carrying ALMA diagram work — valuable content was cherry-picked before deletion).
- **Worktrees pruned:** `/private/tmp/act-regenerative-studio-node22-fix` (dead) and `/private/tmp/act-regenerative-studio-flagship-deploy` (dead).
- **Cherry-pick outcome:** 2 commits landed (ALMA SVGs + HTML viewer). 4 commits skipped — ALMA framework + Mermaid commits targeted `ACT_Compendium_2026.md` which was deleted on main; codex pre-merge commit was already in main via PR squash (`707b8cb`); codex post-merge commits were superseded by later main work.
- **Current branches:** only `main` locally; only `origin/main` on remote.
- **Production build verified clean** post-cleanup.

### Resume-prompt status (A–G from prior ledger)

| prompt | status | notes |
|---|---|---|
| A — 18 defaulted EL mappings | **done** | All "refine" notes gone. Path forward if more cleanup needed: each Tier 2 Art/Goods sub-project still uses `a-curious-tractor` as its EL org — intentional, since they're ACT-stewarded. Swap to a partner slug only when EL has an org for the partner. |
| B — EL approval workflow | **partial** | Phase 0 scaffold already shipped (admin page). Phase 1 GH issue drafted at `thoughts/shared/plans/el-editorial-approval-phase1-issue-draft.md` with the exact `gh issue create` command — post it when ready. Guardrail blocked the auto-post. |
| C — Mosaic tile decisions | **done** | `dad-lab-25` tile replaced with `fishers-oysters`. `civicgraph` slug works via wiki-backed `/projects/[slug]`. `oonchiumpa` still on fallback image — EL org exists but has 0 media. |
| D — Blog long-read mobile pass | **open** | Needs browser + mobile viewport; flagged for next session with user driving. |
| E — No-copy-pass pages | **done** | Events, wiki, storytellers rewrites landed in `a1e22db`. Terms, privacy, blog index already clean. |
| F — Vision markdown refresh | **done** | Landed in `b738648`. Farm size corrected globally. 2026 roadmap reflects April reality. Fishers Oysters added to Pillar 3. Art-cross-cutting note added. The "2025–2028 checklists" the prior handoff warned about didn't exist — the doc was already 2026-focused; only Q-level statuses needed updating. |
| G — EL sync for missing orgs | **done** | Re-ran `sync:el-media`. Coverage unchanged: `tomnet` has project/0 media; `oonchiumpa` has org/0 media; `mounty-yarns`, `mmeic` have neither. All still blocked upstream. |

### Files touched this session (highlights)

- `src/data/projects.ts` — 11 entries removed (2 deletions + 9 event demotions), 4 slug renames, EL notes cleaned, count: 43 → 32
- `next.config.js` — 11 redirects added (renames + deletions + event demotions)
- `src/app/page.tsx` — mosaic + flagship config fixes
- `src/app/events/page.tsx`, `src/app/wiki/page.tsx`, `src/app/storytellers/page.tsx` — external-voice rewrites of empty/pending states
- `src/lib/projects/get-project-field-media.ts` — photoSlugs cleaned (removed deleted refs, renamed to new slugs)
- `src/lib/wiki/canonical-project-wiki.ts` — PROJECT_SLUG_ALIASES simplified now that sites+wiki align
- `src/data/alma-seeds.ts` — smart-hcp slug rename
- `compendium/*` — scattered slug updates (goods mass rename applied then reverted to keep pragmatic split)
- Regenerated JSONs: `wiki-*.generated.json`, `empathy-ledger-featured.generated.json`, `living-ecosystem-canon.generated.json`, `project-code-registry.generated.json`

### Open carry-forward (pick up next session)

1. **B follow-up** — paste the drafted GH issue into `empathy-ledger-v2` (command + body ready at `thoughts/shared/plans/el-editorial-approval-phase1-issue-draft.md`). Once the schema+backfill lands in EL, Phase 2 can start.
2. **D — Blog mobile pass** — needs dev on :3300 + browser. Hit `/blog/seeds-of-change-walking-with-elders-and-youth-on-kalkadoon-country` at mobile width; check Field Photographs caption legibility, bento-grid behaviour when gallery has < 3 items, suggested-reading 3-card grid, hero title clamp.
3. **F — Vision refresh** — `src/data/vision/vision.md` still references 2025–2028 quarterly checklists. Walk through what's still accurate vs stale; rewrite dated sections to reflect where the org actually is in 2026.
4. **Goods full rename** — if/when someone wants `goods-on-country → goods` across the data layer, it's ~29 files in this repo **plus** parallel edits in `act-global-infrastructure/wiki` (guardrail-protected). The pragmatic split is documented in memory.
5. **7 wiki-only entries** deferred in the canonical list (`act-bali-retreat`, `act-regenerative-studio`, `custodian-economy`, `fairfax-place-tech`, `mingaminga-rangers`, `mmeic-justice`, `picc-storm-stories`) — revisit if any becomes active.
6. **Upstream EL content gaps** — `tomnet`, `mounty-yarns`, `mmeic`, `oonchiumpa` need media/stories added in EL. Re-run `npm run sync:el-media` once populated.

### Resume prompts (pick one and paste after `/clear`)

**A — Post the EL approval-workflow issue.**
> Read `thoughts/shared/plans/el-editorial-approval-phase1-issue-draft.md`. Run the `gh issue create` command at the top of that file to post the issue in `empathy-ledger-v2`. If you want any tweaks to the body before posting, read it first and adjust.

**B — Blog long-read mobile pass.**
> Start dev on :3300. Open `/blog/seeds-of-change-walking-with-elders-and-youth-on-kalkadoon-country` at a mobile viewport. Check: Field Photographs caption legibility at narrow widths; bento-grid behaviour when the gallery has fewer than 3 items; suggested-reading 3-card grid on phone; hero title clamp at very small viewports. User drives the browser, I read the code and suggest fixes.

**C — Vision markdown refresh.**
> Read `src/data/vision/vision.md`. The 2025–2028 quarterly checklists are likely stale — walk through with me what's still accurate vs what's shifted, and rewrite the dated sections to reflect where ACT actually is in 2026.

**D — Canonical list: 7 deferred wiki-only entries.**
> Check `memory/project_canonical_list.md` "Deferred" section. For each of the 7 wiki-only entries (`act-bali-retreat`, `act-regenerative-studio`, `custodian-economy`, `fairfax-place-tech`, `mingaminga-rangers`, `mmeic-justice`, `picc-storm-stories`), decide: add to `src/data/projects.ts` (which tier?) / keep wiki-only / delete. I'll apply once you call them.

**E — Goods data-slug full rename.**
> Commit to `goods-on-country → goods` across this repo (~29 files) AND the sibling `act-global-infrastructure/wiki`. Requires you to authorise cross-repo edits. I'll run the rename, add redirects, regenerate all JSONs, verify TS, commit.
