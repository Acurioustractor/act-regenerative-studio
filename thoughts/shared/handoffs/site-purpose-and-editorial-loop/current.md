---
date: 2026-09-04T23:29:14Z
session_name: site-purpose-and-editorial-loop
branch: three feature branches in worktrees under ~/Code/.wt (see Ledger); main tree untouched
status: active
---

# Work Stream: site-purpose-and-editorial-loop

## Ledger
<!-- This section is extracted by SessionStart hook for quick resume -->
**Updated:** 2026-09-05T07:57:58Z
**Goal:** Land the three Empathy Ledger fixes (held reads, contained CI, no-store default) and the three act-regenerative-studio branches, then close key hygiene. Done when each is merged, deployed where it needs to be, and proved live.
**Branch:** worktrees, all clean, all pushed: `~/Code/.wt/el-content-hub-no-store` (fix/content-hub-reads-are-never-held @ 90d32fb6d, PR #627) · `~/Code/.wt/el-ci-hardening` (ci/contain-the-runner @ f04e7b7f0) · `~/Code/.wt/el-no-store-default` (fix/server-reads-are-never-held @ 47a6fa1cf). Each has its own .env.local with BYPASS_SERVER_AUTH stripped.
**Test:** EL: `npm run verify:fast` in the worktree (needs .env.local) · guards: `npx vitest run src/test/critical-path/content-hub-reads-are-never-held.test.ts src/test/critical-path/ci-runner-is-contained.test.ts src/test/critical-path/no-server-read-is-ever-held.test.ts` · live: `PROBE_BASE_URL=https://empathy-ledger-v2.vercel.app PROBE_CONTENT_HUB_API_KEY=<site key> node scripts/probe-production.mjs`

### Now
[->] PR #627: Ben gave the merge verb 2026-09-05 ~16:45Z; four CI checks were still QUEUED on the single self-hosted runner when the session closed, so it did NOT merge. Resume: check `gh pr checks 627`, rebase onto main if behind (it is behind 2), merge `--squash --delete-branch` with the subject `fix(content-hub): every read is answered live, for every caller` and the body in `/private/tmp/.../scratchpad/pr-627-squash-body.md` (regenerate from the commit if the scratchpad is gone; strip trailers), then verify live and add `[deploy]`.

### This Session
- [x] Root-caused the Empathy Ledger keyed-feed staleness: Next 14's fetch cache on the inner PostgREST GET, not a CDN, not a stale deploy. `force-dynamic` leaves store.revalidate `false`; an Authorization-bearing fetch escapes the cache only when revalidate is 0, which `cookies()` sets; the anonymous path reads cookies, the keyed path does not. Control: changing the inner URL returns the live set, busting the outer URL does nothing.
- [x] PR #627 (`fix/content-hub-reads-are-never-held`): `fetchCache = 'force-no-store'` on all 20 content-hub routes + one `createContentHubClient()` with `cache: 'no-store'`; 2 guards; CI green on the pre-rebase head; rebased onto main (one generated-file conflict, resolved by regenerating the census); force-pushed with lease.
- [x] `ci/contain-the-runner`: every job has `timeout-minutes`, every action pinned to a commit with its version beside it (Snyk off `@master`), `permissions: contents: read` per workflow, `npm ci --ignore-scripts` everywhere except a pinned `pa11y-ci@4.1.1`. Guard `ci-runner-is-contained.test.ts` failed 20/26 on the old files. Controls: real scripts-free install + build + `test:ci` all green.
- [x] `fix/server-reads-are-never-held`: every factory in `src/lib/supabase/{server,client-ssr}.ts` passes `cache: 'no-store'`; `createNoStoreServerClient` aliased to `createClient`; guard + baseline of 243 bare service-role clients that may only shrink. `scripts/probe-production.mjs` gains a DOES IT AGREE section (anon visibilities, anon doors, keyed ⊇ anon, keyed-only must be community, shared articles identical, keyed doors); `probe-production.yml` now runs daily. Controls: with the site key it fails on today's frozen body (7 keyed-only "public", 15 date disagreements); without a key it exits 0 with the keyed half SKIPPED.
- [x] Skill routing made structural: `~/.claude/rules/skills-routing.md` + `~/.claude/hooks/skill-gate.mjs` wired into `~/.claude/settings.json` (PreToolUse Bash denies commit/push/PR/branch-delete until the owning skill is loaded this session; PostToolUse Skill + UserPromptSubmit record loads). 22-case matrix `~/.claude/hooks/skill-gate.test.mjs` green; live deny and live allow both observed. Bypass `CLAUDE_SKILL_GATE=off` in the harness environment.
- [x] Attribution off everywhere (Ben: "fix it"): `attribution: {commit: "", pr: "", sessionUrl: false}` in `~/.claude/settings.json`; PR #627's footer removed; 38ca00ab4 keeps its trailers on the branch, the squash keeps them off main.
- [x] Key hygiene, read-only half: VERIFIED with a control that the Empathy Ledger `service_role` JWT leaked in the public act-regenerative-studio repo (PR #105) is dead (leaked 401, current `sb_secret` 200, nonsense 401). Pruned 5 clean EL worktrees idle 19-39 days (28 -> 24; `.env.local` copies 18 -> 15), branches kept.
- [x] CORRECTED my own wrong number: the "~5 seconds per content-hub request" was a dev-server figure. Production, interleaved, server time only: anonymous 1.52s, keyed-from-cache 1.22s, keyed-doing-the-work 1.30s. The cache buys ~80ms. No CDN cache, no precompute, no consent-latency trade-off; that decision is withdrawn.
- [x] Found on the way: the keyed DETAIL route also served the withdrawn article 200 while anonymous answered 404. #627 covers it.
- [x] Diagnosed the CI stall: attempt 1 of run 33944108307 froze 20 min in the Setup Node cache-save post step (14.6 of 148.9 MB, 0.0 MB/s) holding the only runner; cancel + re-run cleared it.

### Next
- [ ] Merge PR #627 (verb given, see Now), then `[deploy]`, then re-probe keyed vs anonymous on production to prove the frozen body is gone. Then re-probe every keyed partner destination (JusticeHub, PICC, Oonchiumpa org keys had the same exposure).
- [ ] Open PRs for `ci/contain-the-runner` and `fix/server-reads-are-never-held` (Tier 3, needs Ben's verb). ORDER: CI branch first, then rebase the no-store branch onto it. Both touch `.github/workflows/probe-production.yml`. Both are behind main by 5 and need a rebase before merge.
- [ ] Ben's repo settings for CI (commands in the 2026-09-05 report): `default_workflow_permissions=read`, `allowed_actions=selected` + the four patterns, and move the self-hosted runner to a separate macOS user (biggest single win; it currently runs as `benknight` beside 15 worktrees holding the service-role key).
- [ ] Ben's decisions on key hygiene, SQL ready in the 2026-09-05 report: revoke six unused/dormant `api_keys` rows; set `expires_at` on the five live keys (no key has an expiry today, and `allowed_domains` only constrains browser callers, so expiry and revocation are the real controls).
- [ ] Mint `PROBE_CONTENT_HUB_API_KEY` as an EL repository secret (a site key for act-regenerative-studio, with an expiry) so the probe's keyed half stops reporting SKIPPED.
- [ ] act-regenerative-studio: open + merge the three pushed branches (`feat/vercel-analytics` 1 commit, `feat/platform-links-from-registry` 3, `feat/story-dates` 1; all level with main). Merge-order note: story-dates and the main tree's uncommitted 31 Aug repairs both touch `src/data/living-field.ts` and the editorial snapshot; resolve the snapshot by re-running `npm run sync:el-editorial`, never by hand.
- [ ] Registry corrections in act-global-infrastructure `config/project-codes.json` (needs Ben's go): ACT-EL -> https://empathyledger.com, ACT-JH -> https://justicehub.com.au, ACT-CN production_url, version bump, decide ACT-QD and ACT-RS. Then `npm run sync:project-codes` here and commit the snapshot.
- [ ] Thin `src/data/project-editorial-recipes.json` to section copy only; newsletter drafter repointed at EL articles; www.act.place still Webflow (cutover, MX first); The Harvest links back or records that it does not.
- [ ] Debt, not started: 1297 routes against Vercel's 2048-entry ceiling with one more route having failed the deploy three times, and a 1192 type-error baseline. Both ratchets only hold the line.

### Decisions
- Processes with a skill run through the skill (Ben, 2026-09-05), enforced by the skill gate; routing in `~/.claude/rules/skills-routing.md`.
- No attribution in commits or PR bodies, anywhere (Ben, 2026-09-05).
- Content-hub and shared server reads are never cached. The ~80ms this costs is not worth trading against a withdrawal outliving a cached read.
- The production probe reports a check it could not run as SKIPPED, never as passed.
- CI containment lives in the workflow files; the runner's OS-level containment is Ben's.
- Archive/prune rule kept: worktrees removed only when clean, branches always kept.
- Site purpose unchanged: front door + field journal, hand-over to platforms; enforced by the 2026-08-07 redirects.

### Open Questions
- UNCONFIRMED: PR #627's CI result on head 90d32fb6d (4 checks queued at close). Check before merging.
- UNCONFIRMED: the philanthropy-database (`tednluwflfhxyucgwigh`) token from PR #105 was tested dead on 2026-08-31 but NOT re-tested by me on 2026-09-05.
- UNCONFIRMED: whether the 10 sequential database round trips in the content-hub list route could be parallelised. They could; at 1.3s for a partner API read it was judged not worth the session.
- OPEN, another session's work: `people_whose_consent_names_nobody` appeared in the live database today with no admin door and no filed issue, so `check:admin-numbers` and the coverage-ledger policy check are RED on every branch including main. Not mine to rule. Both generators were regenerated on the no-store branch so the doc-currency gates pass.
- The single self-hosted runner is the throughput ceiling: three CI runs queued behind each other today, and a frozen cache upload blocked everything for 20 minutes.

### Workflow State
pattern: sequential
phase: 6
total_phases: 7
retries: 0
max_retries: 3

#### Resolved
- goal: "make this healthy and more secure" -> the assessment's items 1-3 are branches or done; item 4 was withdrawn as a wrong measurement; item 5 (route + type debt) is untouched.
- resource_allocation: balanced

#### Unknowns
- pr_627_ci_result: UNKNOWN (queued at close)
- philanthropy_token_still_dead: UNKNOWN (not re-tested 2026-09-05)

#### Last Failure
(none blocking. Two pushes were refused by generated-doc gates and fixed by running the generators; one CI attempt stalled in a cache upload and was cleared by cancel + re-run.)

---

## Context
<!-- Full detail - read on demand by resume_handoff -->

### Pull request links (branches pushed, PRs not opened)
- https://github.com/Acurioustractor/act-regenerative-studio/pull/new/feat/vercel-analytics
- https://github.com/Acurioustractor/act-regenerative-studio/pull/new/feat/platform-links-from-registry
- https://github.com/Acurioustractor/act-regenerative-studio/pull/new/feat/story-dates

### The assessment, in short
The site decided what it is for in code on 2026-08-07: /projects closed permanently, the Living Field (5 fields: art, empathy, justice, goods, harvest) became the IA, the homepage leads with the essay. Three jobs: say who ACT is and what it refuses; carry the writing with consent (via Empathy Ledger); hand over to the platform that does the work. The wiki doctrine agrees (wiki = brain, EL = voice, websites = face). Art is a lens across the four platform fields (CONTAINED sits in Art and grows through JusticeHub); the /art section is the one public surface fed by neither the wiki nor EL (art-portfolio.ts, hand-typed, no field/platform/article join) — a candidate next step.

Route census (origin/main): 92 page routes = 26 public (25 advertised + /confessions/feeling) + 30 redirected (3 permanent: projects, projects/[slug], events; 27 temporary holds) + 36 gated (20 admin, 16 prototypes); 52 API handlers. Two scripts know routes (`scripts/sweep-routes.mjs`, `scripts/check-launch-site.mjs`); neither leaves a durable map; the wiki's studio page route table is stale. Recommendation: a generated route manifest (not built).

Newsletter: act-global-infrastructure pipeline (cross-codebase feed → newsletter_candidates → drafts → paste to GHL) stalled 2026-06-15 because its input is machine events. Tight loop: write in EL (one piece a fortnight, fields filled) → site composes → drafter takes EL articles since last edition → GHL; blog post and newsletter become the same EL article with three destinations.

### Empathy Ledger authenticated feed: reproduction
```
curl -s 'https://empathy-ledger-v2.vercel.app/api/v1/content-hub/articles?destination=act-regenerative-studio&limit=100'                       # 19 articles, 14 distinct dates, consent-enforced, current (accessLevel anonymous)
curl -s -H "X-API-Key: <EMPATHY_LEDGER_API_KEY from .env.local>" '...same URL...'   # 26 articles, 4 distinct dates (pre-backfill), includes the-spirit-must-be-strong (in_review, private since 2026-08-09); accessLevel community
```
No duplicate rows in `articles`; the route (`src/app/api/v1/content-hub/articles/route.ts` in empathy-ledger-v2) is one query on `articles`, so the authed answer is not the current table. Same fault as EL's `thoughts/shared/2026-08-14-content-hub-authed-list-is-stale.md`. NOTE the header needs a space after the colon; `-H X-API-Key:key` is dropped by curl and answered as anonymous, which hid this for an hour.

### PR #627 SEEN verification (2026-09-05, land skill step 3a)
Branch dev server (worktree, port 3041) vs production, same minute, same database `yvnuayzslukamizrlhwb`, same site key: local anonymous 19 articles / 18 distinct dates / private article absent; local keyed (accessLevel community) 19 / 18 / absent, identical set (no community-visibility articles exist for this destination today); production anonymous 19 / 18 / absent; production keyed 26 / 5 / private article present. Control: the frozen body appears only where main's code runs. No preview URL exists (ignored-build step cancels branch builds; previews are SSO-protected anyway), so Ben's look is the PR diff plus this reading.

### Empathy Ledger keyed feed: root cause (2026-09-05)
Same row ids come back with different `published_at` in the two responses, one second apart, same `servedBy.projectRef`; the keyed body holds 7 articles the database has as in_review/private. Adding `&after=2000-01-01` or `limit=99` to the keyed request (changes the inner PostgREST URL only) returns the live set; `&_t=` on the outer URL changes nothing. Mechanism, read from Next 14.2.32 source: a route handler's `force-dynamic` leaves `store.revalidate = false`; an Authorization-bearing fetch is bailed out of the cache only when `revalidate === 0`, which `cookies()` sets; the anonymous path calls `auth.getUser()` (cookies), the keyed path validates a header and does not. Vercel's Data Cache keeps the entry across deploys. Fix: `fetchCache = 'force-no-store'` on all 20 content-hub routes + one `createContentHubClient()` with fetch `cache: 'no-store'`; guards `src/test/critical-path/content-hub-reads-are-never-held.test.ts` and `src/test/unit/content-hub-client-no-store.test.ts`. Wider exposure noted, not changed: `createClient` in EL's `src/lib/supabase/server.ts` bounds the request but is not no-store. The site key in this repo's `.env.local` is the `act-regenerative-studio` site key (api_keys row, key_type site), so consent scope was never the difference.

### Data facts (verified 2026-09-05)
- EL articles tagged act_el: 22 published (19 public, 3 private by consent revocation 2026-07-29). Site shows 15: 19 minus 4 withheld by editorial decision in `config/withdrawn-editorial.json`.
- The 21-article snapshot seen in the main tree is that other session's uncommitted regeneration; the committed one on main had 15.
- Consent for the 15: every one has ≥1 live approved `syndication_consent` row for site act-regenerative-studio; 0 revoked; earliest expiry 2027-07-29.
- Registry (`src/data/project-code-registry.generated.json`, from act-global-infrastructure config, snapshot 2026-08-12): ACT-GD canonical slug `goods` (alias goods-on-country), ACT-FM canonical `act-farm` (alias black-cockatoo-valley), ACT-CN (CONTAINED) has no production_url, ACT-EL/ACT-JH production URLs are www hosts that hop.
- Vercel: project prj_Hz7eQOE4Zh1Dw9O6OZDn6ExRuWuk, team team_3aAWFPdRQ92RkkJ2LehJ209u. Web Analytics API returned 404 before Ben toggled it on.
- www.act.place: still Webflow (x-wf-region header); act-regenerative-studio.vercel.app is the live Next site.

### The three Empathy Ledger branches, in landing order (2026-09-05)
1. `fix/content-hub-reads-are-never-held` @ 90d32fb6d, PR #627, merge verb given. Squash subject: `fix(content-hub): every read is answered live, for every caller`. Behind main by 2 at close.
2. `ci/contain-the-runner` @ f04e7b7f0, no PR, behind 5. Repo settings that pair with it (Ben's, `gh api`): `-X PUT .../actions/permissions/workflow -f default_workflow_permissions=read -F can_approve_pull_request_reviews=false`; `-X PUT .../actions/permissions -F enabled=true -f allowed_actions=selected`; `-X PUT .../actions/permissions/selected-actions -F github_owned_allowed=true -F verified_allowed=true` plus patterns for `patrickedqvist/wait-for-vercel-preview@*`, `treosh/lighthouse-ci-action@*`, `snyk/actions/*`, `codecov/codecov-action@*`.
3. `fix/server-reads-are-never-held` @ 47a6fa1cf, no PR, behind 5. Rebase onto 2 before merging: both edit `.github/workflows/probe-production.yml`.

### Key hygiene: the proposed writes, not applied (2026-09-05)
Ben's call. Revoke six `api_keys` rows that are unused or dormant: ACT Farm, The Harvest, ACT Command Center and the JusticeHub *site* key (never used), 10 Years Map (last used 11 May), The Aesthetics of Asymmetry (14 Apr). Set `expires_at`: 2027-03-31 on the four live keys (JusticeHub Production 1693 calls/30d, ACT Regenerative Studio 954, Goods Asset Register 367, Oonchiumpa 103), 2026-10-31 on PICC Production (silent since 28 Apr). No key has an expiry today. `allowed_domains` is checked only when a request carries Origin or Referer, so it does not constrain a partner's server; expiry and revocation are the real controls. The platform gives no warning before a key expires, so the dates need a calendar entry.

### Measured, so nobody re-derives it
Content-hub list, production, 6 interleaved samples, server time = TTFB minus connect: anonymous 1.52s (slowest: it makes an extra `auth.getUser()` round trip), keyed served from the frozen copy 1.22s, keyed doing the real work 1.30s. `limit=5` is no faster than `limit=100`, so the cost is the ~10 sequential database round trips, not per-article media governance.

### Gotchas met this session
- Bash cwd drifts after `cd`; use absolute paths.
- `sleep` is blocked in the tool; `perl -e 'select(undef,undef,undef,1.5)'` or curl `--retry-delay` waits instead.
- A worktree has no node_modules or .env.local; symlink node_modules from another worktree (shows as untracked; remove before leaving) and copy .env.local only when a script needs it (delete after).
- `rm -rf .next` races a dying dev server; kill the listener PIDs first.
- Port 3001 may be The Harvest; used 3005/3006 for dev servers.
- EL pre-push runs generated-doc gates: a push is refused when `docs/coverage-ledger.md` or `src/lib/generated/route-facts.json` are stale. Fix by running `node scripts/coverage-ledger.mjs --write` and `node scripts/surface-census.mjs`, then committing, NOT by hand-editing.
- A branch push triggers no CI in EL; only a PR does. Vercel cancels branch builds via the ignored-build step, and previews are SSO-protected, so local verification is the only pre-merge look.
- EL's single self-hosted runner is this laptop, running as `benknight`. Jobs are serial. Expect queueing, and check `~/actions-runner/_diag/pages/*.log` for a frozen upload before blaming the change.
- The opc `recall_learnings.py` tool CLAUDE.md points at is broken (legacy Supabase keys disabled 2026-06-29).
- Supabase MCP occasionally returns "Unable to connect"; retry once.
