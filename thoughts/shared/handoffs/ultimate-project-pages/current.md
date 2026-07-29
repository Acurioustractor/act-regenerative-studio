---
date: 2026-06-03T00:00:00Z
session_name: confessions-one-page-live
branch: main
status: active
---

## Ledger
**Updated:** 2026-06-03
**Goal (shipped):** Confessions to Philanthropy collapsed to ONE contained page and pushed LIVE to production. Next: a few test pages under `src/app/confessions/<name>/`.
**Branch:** `main` — head `76aa157` ("feat(confessions): one contained listening page; retire the data wall"), pushed + deployed to prod (deploy.yml → `vercel --prod`, green). Also on `feat/confessions-experience`.
**Live:** **act-regenerative-studio.vercel.app/confessions/listen** (public, shareable). Vercel branch previews are login-protected, so only prod is shareable.
**Test:** `npx tsc --noEmit` clean (0 errors). Prod verified: /confessions + /listen 200, /wall→/listen 307 redirect, global ACT chrome hidden on /confessions (contained microsite), homepage chrome intact, thematics + new message render.

**The one page (`/confessions/listen`):** message + thematics (feeling legend) + visualisation (`ConfessionField` lights coloured by feeling, tap-to-play) + full-screen listening (`ListenTheatre`: sidebar, play-all). Payout Wall data grid RETIRED (`/wall` + `/feeling` redirect to `/listen`, removed from nav). PayoutWall/WallOfFeeling/FoundationContestForm parked on disk. Nav = Confess / Listen / Friday Tape.

**Watch-outs:**
- Working tree on `main` carries unrelated uncommitted noise (generated json + untracked dirs from a prior codex branch). NOT deployed. Never blanket `git add -A` — curate-add.
- Payout-wall numbers refreshed to 104 / 10,141 / $12.93B; the 113→104 openness drop NOT re-verified vs provenance. Comms calendar still cites old numbers.

---

Full handoff: thoughts/shared/handoffs/confessions-one-page-live-2026-06-03.md
Memory (current): project_confessions_campaign, project_foundation_power_civicgraph
