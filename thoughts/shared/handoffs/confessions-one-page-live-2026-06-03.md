# Handoff — Confessions consolidated to one page, LIVE on prod

**Date:** 2026-06-03
**Repo:** act-regenerative-studio
**Status:** shipped to production, green.

## What this session did
Heavy iteration on the **Confessions to Philanthropy** campaign, ending in a hard simplification (Ben's calls). Net result:

- **One contained page: `/confessions/listen`** = the message + the thematics + the voice visualisation + full-screen listening. This is THE page now.
  - `ConfessionField` lights are coloured **by feeling** (`feelingOf`/`feelingMeta` in `confessions-mock.ts`); tap a light to play.
  - Full-screen **theatre** (`ListenTheatre.tsx`): sidebar of all voices, play-all auto-advance, prev/next, Esc.
  - Motion slowed ~half (Ben).
- **Payout Wall data grid RETIRED.** `/confessions/wall` AND `/confessions/feeling` 307-redirect to `/listen`. Removed from `CampaignNav` (now **Confess / Listen / Friday Tape**; Method also removed from nav, page still exists).
- **`/confessions` is its own contained microsite** — global ACT header + footer hidden. Mechanism: root `layout.tsx` marks them `data-site-chrome`; `confessions/layout.tsx` injects `<style>[data-site-chrome]{display:none}</style>` (server-rendered, no flash). Other routes keep chrome.
- **Two new voices** added as words-only: c07 (Aboriginal, "invest in strength not problems"), c08 (small orgs, no grant writer). Transcribed locally with whisper; raw audio gitignored in `Confessions Recordings/`.
- Dead "Payout Wall" buttons (landing/friday/method) repointed to `/listen`; sitemap fixed (dropped /wall, /method; added /listen).

### Built then PARKED (on disk, unused, reachable if wanted back)
- `PayoutWall.tsx` — the **mean-reactive wall**: press a voice → veil the grid, ignite its evidence cells, resolve one number (c02→45 move half / c03→104 doors / c08→1% long-tail / c06→$15.64B dead). Has hover-name + searchable directory + minimal mode.
- `WallOfFeeling.tsx` — voices sorted by emotion, lead-with-good.
- `FoundationContestForm.tsx` — right-of-reply form → /api/forms/submit.

## Git + deploy state
- **main = `76aa157`** ("feat(confessions): one contained listening page; retire the data wall"), pushed, **deployed to prod** via `deploy.yml` (`vercel --prod`), both jobs green.
- Same commit on branch `feat/confessions-experience` (pushed).
- **LIVE + shareable: `act-regenerative-studio.vercel.app/confessions/listen`** (verified 200, new message renders, /wall redirects, chrome hidden, homepage chrome intact).
- Vercel branch PREVIEWS are login-protected (Deployment Protection on) → only prod is publicly shareable.
- Working tree (on `main`) still has unrelated **uncommitted noise** from a prior codex branch (generated json: empathy-ledger-*, wiki-*, project-code-registry; untracked .agents/.claude/brand/compendium/Writing/ etc.). NOT part of the deploy. Left as-is — do not blanket `git add -A`.

## Data / provenance flags (carry forward)
- Payout-wall snapshot refreshed this session: **104 open doors / 10,141 givers / $12.93B** (was the locked 113 / 10,133 / $12.95B). The **113→104 openness drop is NOT re-verified** against `grantscope/output/foundation-power.provenance.md` — do before any number-sensitive publishing.
- The QPW comms calendar (`thoughts/shared/plans/confessions-qpw-comms-calendar-2026-06-01.md`) still cites the OLD numbers — update before posting.

## Next (Ben's stated direction)
Add **a few test pages** under `src/app/confessions/<name>/page.tsx` (auto-inherit the contained shell). Candidates discussed: message A/B variants, visualisation variants (the survival/cliff angle, or the QLD **place map** = fusion #2, heavier, needs CivicGraph geo wired), a consented "what do you wish philanthropy knew?" capture. Ask Ben which + whether to list in nav or keep unlisted.

See memory: [[project_confessions_campaign]], [[project_foundation_power_civicgraph]].
