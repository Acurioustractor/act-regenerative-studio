# Handoff: launch merge + deploy hold + launch-critical fixes (2026-05-29)

Session that reviewed the Mon 2026-06-01 site-refresh launch, merged it, held the
deploy, produced a content strategy, and fixed launch-critical issues.

## Done this session
- **Pre-launch review** of all launch-ready pages: every gate green (check:launch
  117 routes, redirects 46, copy, forms, brand). Fixed `/people` held-link
  (resolveProjectChipHref), de-staled `check:brand` for held surfaces + the
  beneficiary-critique false positive, gated the confessions inbox copy on
  `IS_MOCK`. Committed `e656945`, shipped inside PR #39.
- **Merged PR #39** (`launch/site-refresh-2026-05-26` → `main`, merge `67a4ca2`).
- **Held the deploy**: `gh workflow disable deploy.yml` before merging so it would
  not auto-deploy to production. Verified no prod deploy fired.
- **Content strategy** via a 12-agent workflow, saved to
  `docs/strategy/confessions-launch-and-content-engine.md` (committed on branch
  `docs/confessions-content-strategy`, `3a01c52`).
- **Investigated + fixed `deploy.yml`** (Vercel CLI 25.1.0 → `vercel@latest`) and
  three launch-critical code issues (canonical, attribution, withdrawal) on branch
  `fix/launch-critical`.

## State
- `main`: has PR #39. Production NOT redeployed (held).
- Unpushed branches: `docs/confessions-content-strategy` (`3a01c52`),
  `fix/launch-critical` (`10c95ab`, `c715377`, `b61f909`).
- `deploy.yml`: DISABLED on GitHub; the fix lives on `fix/launch-critical` (not on
  main yet).

## Resume / Monday runbook
1. Push + open PRs for both branches (or merge directly).
2. Merge `fix/launch-critical` to `main`.
3. `gh workflow enable deploy.yml`
4. Trigger deploy (merge push, or `gh workflow run deploy.yml`); watch the first
   run to confirm the Vercel CLI fix works (could NOT be verified locally).
5. Human Tier-0: confirm gold-phone line `+61 (0) 2 8503 4273` answers; confirm
   Queensland Philanthropy Week dates.

## Notes
- Prod domain = `act-regenerative-studio.vercel.app`; `act.place` is old/deprecated.
- The strategy doc surfaces follow-ups: the Substack → Empathy Ledger → site engine
  (with a canonical fix now partly shipped), newsletter (Field Notes) + social
  programs, and the `/storytellers`, `/wiki`, `/ask` un-hold prerequisites.
