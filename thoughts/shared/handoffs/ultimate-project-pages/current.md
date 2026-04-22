---
date: 2026-04-23T00:00:00Z
session_name: ultimate-project-pages
branch: main
status: active
---

# Work Stream: ultimate-project-pages

## Ledger
**Updated:** 2026-04-23T00:00:00Z
**Goal:** Last session swept the seven inherited resume prompts (A–G). All seven processed: A/B/E fully done, C/D/F/G done to the limit of what could happen without further user input. Next session picks up the open items those four left behind.
**Branch:** main — head 881cfdb ("feat(el): per-page Empathy Ledger connections + mobile nav drawer") + this session's uncommitted changes.
**Test:** npm run dev on :3300. `npm run sync:el-media` after any EL-linkage changes.

### Session outcome (2026-04-23 — sweep of inherited resume prompts A–G)

**A — Farm sub-pages copy polish: nothing to fix.**
- `/farm/stay`, `/farm/retreats`, `/farm/workshops` audited end-to-end. No HTML entities, no curly quotes, no decorative arrow spans, no metadata blocks (so no double-suffix). They were written clean from the start.

**B — Harvest + Art sub-pages.**
- Harvest sub-pages (`/harvest/csa`, `/harvest/produce`) — same audit as A: clean.
- Art sub-pages stripped of insider/system jargon for external readers (per the user-memory voice rule):
  - `art/artists/page.tsx` — hero + section rewritten ("works layer"/"live story layer" → plain language); chip "Live storyteller signal" → "Storyteller".
  - `art/artworks/page.tsx` — hero + section rewritten (no more "public ACT stack", "wiki carries the durable framing"); removed the `formatLiveSource` pill that exposed "Live feed"/"Project record"; fallback "Awaiting approved media" → "Images to come".
  - `art/exhibitions/page.tsx` — section description rewritten (no "public project records").
  - `art/commissions/page.tsx` — section description rewritten (no "live ACT stack"); fallback chip "Live project record" → work's medium.
  - `art/residencies/page.tsx` — already clean.

**E — EL Connections panel UX polish (full prompt landed).**
- `src/components/projects/EmpathyLedgerConnections.tsx`:
  - **Admin gating** — added Supabase `useEffect` that resolves the current session's `profiles.role` (same gate AdminShell uses); component returns `null` unless role is `admin` or `editor`. Public visitors no longer see the launcher.
  - **Launcher position** — moved bottom-left → bottom-right to clear the Next.js dev indicator. Drawer now slides in from the right (`items-end justify-end`) for consistency.
  - **Notes banner** — replaced the faint amber strip with a bordered card: icon + "Mapping note" label + the note text in higher-contrast amber.
  - **Video tab** — replaced the raw URL list with thumbnail cards (centered play-button overlay) when EL provides `thumbnail_url`/`preview_url`. Direct-upload videos (`.mp4`/`.webm`/`.mov`) get an inline `<video controls preload="metadata">` so the first frame previews without auto-loading the file. Generic external links fall back to a gradient placeholder with a play button.

**D — EL → site editorial approval workflow (phase 0 done).**
- Wrote design doc at `thoughts/shared/plans/el-editorial-approval-workflow.md`. Three layers, five phases:
  1. **EL schema** — add `approved_for_act_site` (bool) + `approved_at` + `approved_by` to `stories` and `media`. Backfill all existing rows as approved (one-time SQL).
  2. **EL API** — content-hub endpoints accept `?approved_for=act-regenerative-studio`; new admin-only `/api/v1/content-hub/pending` endpoint exposes the queue.
  3. **ACT consumer** — sync scripts add the flag behind `EL_APPROVAL_GATE` env (initially OFF); admin queue page wired to `/pending`; UI cues on the EL Connections panel.
- Scaffolded `/admin/pending-el-stories` route (`src/app/admin/pending-el-stories/page.tsx`) with an honest "waiting on EL API" empty state, deep-link to coverage dashboard + EL issue tracker, and the workflow summary visible to the team. Inherits the admin layout's Supabase auth gate.

**C — 26 defaulted EL mappings (partial cleanup).**
- 6 of the 26 are legitimately ACT-stewarded (not "defaults"); cleaned their `notes` field in `src/data/projects.ts` so the dashboard stops flagging them amber:
  - `black-cockatoo-valley`, `empathy-ledger`, `goods-on-country`, `goods-tennant-creek`, `the-harvest`, `act-monthly-dinners`.
- 18 partner-adjacent projects still defaulted — need user input per project before changing `orgSlug`.

**F — Blog long-read polish (code-only pass).**
- `/blog/[slug]/page.tsx`: title-cased related-project chips so they render "Green Harvest Witta" instead of "green harvest witta".
- Em-dash sweep across blog static copy: clean. (Em dashes inside article body come from EL via `post.content` — fixing those belongs upstream.)
- Type sizes / spacing / gradients reviewed on code. Nothing obvious to tune from a pure code read. Mobile caption behaviour and bento-grid ghost-cell scenarios still need a browser to verify.

**G — Mosaic curation (audit only).**
- 6 of 9 tiles render cleanly from EL (PICC Elders, CONTAINED, Gold.Phone, Uncle Allan, Community Capital, SMART Recovery — all have heroes + real media pools).
- 3 worth user attention:
  - **`oonchiumpa`** — NO EL block at all in the snapshot, despite being a registered EL org. Currently using `/media/field-stills/goods-remote-aerial.jpg` fallback. Re-run `npm run sync:el-media` first; if still empty the EL org may have org-level media but no project record.
  - **`civicgraph`** — 0 EL media items, tile name is "CivicScope" (slug/name mismatch suggests rename in EL). Using `justicehub-container.jpg` fallback. Either fix the slug, add media in EL, or drop the tile.
  - **`dad-lab-25`** — uses `override: jinibara-country-aerial.jpg` (a BCV aerial that's thematically off). EL has 233 items for this slug. Removing the override would let the EL hero show through.

### Files touched

- `src/app/art/artists/page.tsx`
- `src/app/art/artworks/page.tsx`
- `src/app/art/exhibitions/page.tsx`
- `src/app/art/commissions/page.tsx`
- `src/components/projects/EmpathyLedgerConnections.tsx`
- `src/data/projects.ts` (6 mapping notes removed)
- `src/app/blog/[slug]/page.tsx` (title-case fix)
- `src/app/admin/pending-el-stories/page.tsx` (new)
- `thoughts/shared/plans/el-editorial-approval-workflow.md` (new)

### Known follow-ups (carried forward)

- **18 partner-adjacent projects still defaulted** to `a-curious-tractor` in `src/data/projects.ts`. Need user to name each project + its correct EL org. Examples: `green-harvest-witta`, `gold-phone`, `bupa-tfn-pitch`, `pakkinjalki-kari`, `naidoc-week-mount-isa`, `westpac-summit-2025`, `the-confessional`, `regional-arts-fellowship`, `caring-for-those-who-care`, `designing-for-obsolescence`, `dad-lab-25`, `10x10-retreat`, `anat-spectra-2025`, `cars-and-microcontrollers`, `travelling-womens-car` (note already hints at Oonchiumpa), `nfp-leaders-interviews`, `project-her-self`, `weave-bed-tennant-creek`. Dashboard at `/admin/empathy-ledger-coverage`.
- **EL approval workflow phase 1** — open issue in `empathy-ledger-v2` for the schema migration; reference the design doc.
- **Blog long-read mobile pass** — Field Photographs caption breakpoint, bento-grid ghost cells when gallery < 3, suggested-reading on narrow screens. Needs a browser.
- **Mosaic tile decisions** — three flagged above. One-line changes once user confirms direction.
- **Three EL orgs still missing from snapshot** (`tomnet`, `mounty-yarns`, `mmeic`) — auto-fix when media added upstream. Run `npm run sync:el-media` after.
- **Events page (135 lines)** — got arrow fix, no copy pass.
- **Terms / Privacy** — title fixes only, no full copy pass.
- **`/vision` markdown** — still references `2025 → 2026 → 2027 → 2028` checklists; refresh if directions shifted.

### Resume prompts (pick one and paste after /clear)

**A — Refine specific defaulted EL mappings.**
> 18 ACT projects in `src/data/projects.ts` still default to `a-curious-tractor` org with a "refine" note. Visit /admin/empathy-ledger-coverage to see them. I'll name each project and the correct EL org slug; you update the mapping (and optionally `elProjectSlugs: [...]` for a specific EL project), remove the `notes` field, then re-run `npm run sync:el-media`.

**B — Open the EL approval-workflow issue + start phase 1.**
> Read the design doc at `thoughts/shared/plans/el-editorial-approval-workflow.md`. Open a GitHub issue in `empathy-ledger-v2` capturing phase 1 (schema migration on `stories` + `media` tables, plus a one-time backfill SQL marking existing rows as approved). Then if I have access, draft the migration file in the EL repo. The ACT-side admin page is already scaffolded at `/admin/pending-el-stories`.

**C — Mosaic tile decisions.**
> Three flagged: (1) `oonchiumpa` has no EL block — re-run sync first, then decide whether to keep the local fallback or drop the tile; (2) `civicgraph` slug/name mismatch with EL ("CivicScope") — fix slug, add EL media, or drop; (3) `dad-lab-25` override points at a BCV aerial despite EL having 233 items — likely safe to remove the override and let the EL hero through.

**D — Blog long-read mobile pass.**
> Dev on :3300. Open /blog/seeds-of-change-walking-with-elders-and-youth-on-kalkadoon-country at mobile width. Check: Field Photographs caption legibility at narrow widths, bento-grid behaviour when gallery has fewer than 3 items, suggested-reading 3-card grid on phone, hero title clamp at very small viewports.

**E — Tackle the inherited "no copy pass" pages.**
> Events (~135 lines), Terms, Privacy, blog index, wiki index, storytellers index. Apply the established polish pattern: HTML-entity decoding, decorative-arrow normalization (`<span aria-hidden="true">→</span>` → `&rarr;`), curly-quote scrub, metadata title double-suffix check, and an external-voice read-through (no insider jargon, no debug labels).

**F — Vision markdown refresh.**
> `src/data/vision/vision.md` still talks about the 2025–2028 quarter-by-quarter checklists. Walk me through what's still accurate vs stale, and rewrite the dated sections to reflect where the org actually is in 2026.

**G — Re-run EL syncs and check for `tomnet`, `mounty-yarns`, `mmeic`, `oonchiumpa`.**
> `npm run sync:el-media`; then check `src/data/empathy-ledger-featured.generated.json` to see whether the four orgs that were missing/empty now have content. If they do, update any pages that depended on the missing data.
