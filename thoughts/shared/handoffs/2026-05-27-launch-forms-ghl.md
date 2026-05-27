# Handoff — launch holds, forms → GHL pipeline (2026-05-27)

**Branch:** `launch/site-refresh-2026-05-26` (18+ commits ahead of `main`, NOT merged).
**Durable detail in memory:** `project_forms_ghl_pipeline.md`, `project_launch_holds.md`, `project_launch_curated_commit.md`.

## What shipped this session (all committed)

**Launch holds** (redirect + drop from sitemap + gate; flag-gated UI):
- `/storytellers` → `/stories` (only 1 unconsented profile). `/ask` → `/projects` (public AI, later phase). `/wiki` → `/projects` (longer build). Flags: `STORYTELLERS_PUBLIC`, `WIKI_PUBLIC` in `src/lib/launch-flags.ts` (both `false`). Restore steps in `project_launch_holds.md`.

**Homepage hero stats** wired live: Projects (`getPublicProjectCount()`), Artworks, Field stories. Removed stale 319/191/58 hardcodes. Fixed a build-breaking `false &&` TS narrowing bug (use the boolean flag pattern, never literal `false &&` over a narrowed var).

**Art:** added "Confessions to Philanthropy" as a portfolio artwork with the campaign film as hero video + thumbnail (new `heroVideo` field on `ArtProjectConfig`).

**Forms → GHL** (the big one — verified live on preview):
- All forms POST `/api/forms/submit` → forward to Command Center (localhost-only, fails in prod) → **direct GHL push** (same location, project-code/source/context tags) → Supabase `pending_form_submissions` audit.
- **Pipeline routing** (opportunities), gated by `GHL_ENABLE_PIPELINES`: ACT-EL→Empathy Ledger, ACT-GD→Goods Buyer, else→Universal Inquiry; newsletter→skip. Response includes `opportunity: created|failed|skipped`. All routes tested `created`.
- Fixed project codes: residency `ACT-AR`→`ACT-AS`, farm-stay `ACT-FM`→`ACT-BV`.
- Created Supabase table `pending_form_submissions` (RLS on); pointed `/admin/dashboard` (GHLFormActivity) at it.

## Production state (Vercel `act-regenerative-studio`)
Env now set (prod + preview): full Supabase family, `GHL_API_KEY`, `GHL_LOCATION_ID`, `GHL_ENABLE_PIPELINES=true`. `ACT_ECOSYSTEM_API_URL` deliberately NOT set (Command Center is localhost-only). **Live prod still runs OLD code** until the launch branch merges.

## Open / next actions
1. **Merge `launch/site-refresh-2026-05-26` → `main`** to deploy all of the above to prod. (Use the curated-add discipline if rebasing; never `commit -am` — see `project_launch_curated_commit.md`.)
2. **GHL message workflows** (UI config, not code): auto-replies + nurture, copy ready in `docs/strategy/act-forms-ghl-pipelines-messages.md`, triggered by the tags forms already send.
3. **GHL test-data cleanup**: delete `TEST-SUBMISSION`-tagged contacts + 3 test opportunities (Universal Inquiry / Empathy Ledger / Goods Buyer).
4. **Website review actions** not yet done (`docs/strategy/act-website-review-2026-05-27.md`): homepage focus pass, mobile/PageSpeed, program-form friction staging. NOTE: the audit's "flatten CTAs" advice was deliberately NOT applied (ACT's green is a coherent brand accent, not inconsistency).
5. Deep contextual `/wiki/<slug>` backlinks on project pages still redirect (graceful) — hide if wanted before launch.

## Gotchas to remember
- GHL opportunities API needs `POST /opportunities/` (trailing slash) + Version `2023-02-21`; use the GHL `ghl_id` (not the Supabase row `id`) from `ghl_pipelines`. Location `agzsSZWgovjwgpcoASWG`.
- Vercel deploys/migrations/secret-writes are blocked by the auto-mode guard without an explicit verb — expect to ask the user or have them run it.
- The launch gate (`check:launch`) needs a running server; runs flaky against a cold dev server (fetch-fail) — warm it or re-run.
