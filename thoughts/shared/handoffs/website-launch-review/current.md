---
date: 2026-08-07T09:40:00Z
session_name: website-launch-review
branch: launch-flatten-closure
status: active
---

# Work Stream: website-launch-review

## Ledger
<!-- This section is extracted by SessionStart hook for quick resume -->
**Updated:** 2026-08-07T09:40:00Z
**Goal:** Get the site launch-ready so the cutover to act.place is a config change, not a scramble. Code side is DONE. What remains is DNS/env/third-party, which is Ben's.
**Branch:** `launch-flatten-closure` (PR #62 open). `main` at `c500992`.
**Test:** `npx tsc --noEmit && npm run test`. Gates need a running server: `LAUNCH_CHECK_BASE_URL=<url> node scripts/check-launch-site.mjs`, `REDIRECT_CHECK_BASE_URL=<url> node scripts/check-launch-redirects.mjs`, `CONTRAST_BASE_URL=<url> node scripts/check-contrast.mjs`. Dev on :3007 (:3001 is often The Harvest). **Restart the dev server after any change to `config/launch-redirects.cjs`** — next.config reads it at boot.

### Now
[->] SESSION CLEARED 2026-08-07 (second clear). State:
- **`054f8d7` may be UNPUSHED** — check `git log origin/launch-flatten-closure..HEAD`. If so, push it; PR #62 is missing it.
- **PR #62 open, MERGEABLE**, awaiting Ben's merge verb. PRs #60 and #61 merged and deployed and verified live earlier today.
- **Ben's next move is the cutover itself** (his, not ours): point act.place DNS **with MX records recorded first, the one way this breaks his email**, set `NEXT_PUBLIC_SITE_URL=https://act.place` in Vercel Production, ship a build, repoint the EL webhook, sweep GHL, add Search Console. When he says the domain is pointed: re-run both gates against `https://act.place` and spot-check robots host, sitemap `<loc>` hosts, and a canonical on one static page plus one `/stories/[slug]`.
- **EL brief is written and NOT committed** at `/Users/benknight/Code/empathy-ledger-v2/docs/08-integrations/ACT_SITE_EDITORIAL_DATA_BRIEF.md`. That repo had 67 uncommitted files on `feat/age-is-a-column-not-prose` and was being worked in, so it was deliberately left untracked. Do not commit there without checking with Ben.

### Decisions taken 2026-08-07 (all recorded in docs/strategy/website-launch-cutover-plan.md)
- **Domain: `act.place`.** The old ACT site's address; launch-redirects already maps its routes in, so cutover is replacement in place.
- **`hi@act.place` stays.** No code change. It is in 11 source files, not the 5 the plan claimed.
- **`www.act.place` to the apex.** Ordinary www-to-apex, not a legacy 301.
- **`/projects` and `/events` closure is PERMANENT.** Living Field is the IA. Moved 307 to 308.
- **The wiki is internal.** Stays in the repo, stays useful, never goes public. Not a hold pending fixes. Left redirected (Ben chose this over gating it behind ACT_INTERNAL_TOKEN).
- **The hub does not sell.** Ordering belongs on JusticeHub, Goods, Empathy Ledger, The Harvest. The absence is the design. The Harvest is the exception because the place is the product.

### Traps worth not rediscovering
- **`public/media/field-videos/` is GITIGNORED.** `/media/field-videos/*` 308s to the Supabase `site-media` bucket (next.config.js), and that redirect runs BEFORE static file serving, so a file encoded locally is never what a browser fetches, even in dev. Encoding is not publishing. `scripts/build-hero-encodes.mjs --publish` uploads; it HEADs the bucket and only lists what it can actually serve.
- **Hero encode filenames carry a content hash** because objects are served `immutable, max-age=31536000`. Replacing bytes at a fixed URL left a browser holding the old clip until 2027. This was caught live: the browser kept serving the square 1120x1078 encode while the bucket already had 1600x900.
- **Verify pixels, not wiring.** Twice this session "working" was claimed off a `src` attribute while `readyState` was 0 and `videoWidth` 0. Assert readyState/videoWidth/currentTime. And **re-query the element after any await** — React remounts on key change and a stale ref reads as paused with a mismatched caption.
- **Three gate holes closed this session, all the same shape: the check was measuring the wrong thing, not failing to run.** (1) the stale-reference scan judged the site's own host as foreign, would have failed all 28 routes at cutover; (2) the site gate followed redirects and validated the destination, so `/confessions/wall` passed while 307ing away; (3) the redirect gate asserted one hop while the browser kept travelling, hiding 30 chains.
- **`white-space: nowrap` on the hero h1 was removed.** It overflowed instead of wrapping, which is how the old headline painted across the artwork, and left 0px slack at 320px.
- **`main > section` is clamped to 1200px in globals.css**; the opt-out is `max-width:none; margin-inline:0`. Any new full-width band needs it or it floats.

### This Session (2026-08-07, Phases 1-2)
- [x] Phase 1 page-by-page review with Ben → PR #57 (branch launch-review-fixes: corpus commit 97ac9b7 + batch 1-3 fixes 953df80). All CI green, MERGEABLE, awaiting Ben's merge verb.
- [x] Phase 2 route decisions made with Ben and implemented in 716e5c6 on launch-routes-unify (stacked on launch-review-fixes, UNPUSHED):
  - Articles unified under /stories/[slug] (packets resolve first, articles second; /blog + /blog/:slug* are 308s; /blog directory deleted; localPath normalised at serving boundary + sync script)
  - Live chains flattened: /news, /journal → /stories; /lcaa → /about#convictions; /ask → /questions; /wiki, /wiki/new → /#fields
  - Event-demotion + deleted-project rules left alone ON PURPOSE: /projects/:slug* catch-all matches first, they are inert today and correct if the closure reverses (comments in config say so)
  - All four holds stay held for launch (criteria go into the Phase 3 plan)
  - Sitemap: + /confessions/wall + /confessions/method + published packets (none yet: utopia is public-preview/noindex); articles at /stories/
  - Launch gate: + /stories/the-spirit-must-be-strong sample; off-site (EL) canonicals skip path-equality, site host read from homepage canonical
- [x] Verified on local prod build: one-hop redirects, both content types render, 404 on unknown, 21 /stories/ sitemap articles, zero /blog/; tsc clean, 22 tests, gate passes 28 routes

### Earlier (2026-08-06 session)
- [x] Three-agent audit; P0 consent gates; P1 /blog/[slug] renderer rebuild; EL fetch deploy-killer fixed; PRs #55 + #56 shipped + prod verified

### Phase 1 landed (2026-08-07)
- [x] PR #57 MERGED as b6fcdc2, deployed, verified live: home API silence, legal footer, letterboxing, 3 withdrawn slugs 404, showcase article intact

### Phase 2 in flight
- [x] launch-routes-unify rebased onto main (single commit 1bcc22f), pushed, PR #58 open; CI: lint/type/security/preview green, Build + Tests pending at handoff-write time

### Phase 3 done (2026-08-07)
- [x] docs/strategy/website-launch-cutover-plan.md written + OS doc reconciled (pointer + /stories decision recorded); committed LOCALLY as c9c5360 on launch-routes-unify, NOT pushed (pushing adds it to PR #58 — Ben's call)
- Plan's open inputs for Ben: which domain; keep or move hi@act.place; www.act.place legacy redirect

### Session 2026-08-07b (cutover decisions + gate repair)
- [x] Domain decided: **act.place** — the address the old ACT site occupies, whose routes launch-redirects.cjs already maps in. Cutover is a replacement in place.
- [x] Email decided: **hi@act.place stays**, no code change (it is in 11 source files, not the 5 the plan claimed)
- [x] Third decision self-resolved: www.act.place is now an ordinary www→apex redirect, not a legacy 301
- [x] **Two launch gates would have failed the cutover. Both fixed** in `15e0784` on branch `launch-cutover-decisions` (off main, UNPUSHED):
  - `check-launch-site.mjs` treated `https://act.place` as a stale link to the old site. Canonical + og:url emit the site host on every page and only script/style are stripped, so head survives the scan (verified on live prod markup: 4 hits/page). All 28 routes would have failed at cutover. Now strips the site's own origin first; other-form-of-domain links still fail; host patterns got a boundary so act.placeholder.com cannot trip them.
  - `check-launch-redirects.mjs` was **already red against prod** (30 assertions), unnoticed because the gate is not in CI. All 19 rules are retired /projects/* entries covered by the /projects/:slug* closure. Redirects are first-match-wins; the checker had no precedence notion so it tested the closure, not the rules. Now resolves coverage in declaration order and reports dormant.
- [x] Verified on prod: site gate 28 routes green; redirect gate 75 checked / 19 dormant / green; PR #58 route unification live (/stories/[slug] 200, /blog + /blog/[slug] + /news one-hop 308); tsc clean; 22 tests
- [x] Cutover plan updated: decisions section, act.place substituted throughout, steps 6-7 rewritten, ready-to-cut-over checklist ticked with evidence + dates

### Session 2026-08-07c (homepage design pass, branch `launch-cutover-decisions`)
- [x] `c687564` full-bleed bands + hero: globals.css clamps `main > section` to 1200px; the method ribbon escaped only because it is an `<aside>`. `.harvest`/`.return` already had the escape, `.fieldSection`/`.crossStory`/`.hero` never did. The hero was the bad one: headline column 405px vs 537px needed for "system felt." (nowrap), so type painted 54px across the artwork.
- [x] `4f29f1e` hero rotates the fields + return mark off the photo. **Lesson: the first mark fix used a fixed offset above the photo — cleared at 1920x1080 but hit the header by 32px at 1440x760 and 19px at 1440x900, because the photo's y position moves with viewport height. Now in normal flow so the column reserves its space; collision is structurally impossible.**
- [x] `24f6d3d` "the field speaks": each field's own line (from living-field.ts) over its own footage; 5 seeds = clickable nav, 44px targets, hold-on-hover/focus; return mark redraws per change; h1 stays fixed for SEO/SR; aria-live off; reduced-motion honoured
- [x] `dd8874a` hero encodes published to Supabase `site-media`. **Trap worth remembering: `public/media/field-videos/` is GITIGNORED and `/media/field-videos/*` 308s to the bucket (next.config.js), and that redirect runs BEFORE static file serving — so a file encoded locally is never the file the browser fetches, even in dev.** Script HEADs the bucket and only lists encodes it can actually serve; `--publish` uploads with POST (creates, never overwrites).
- Weight: six clips 34,274KB → 3,421KB; **first paint 9,956KB → 59KB** (rotation opens on Art). Verified through the real 308→bucket path, all 200.
- **Process lesson: I twice claimed "working" from wiring rather than pixels.** `src` attribute set ≠ video loaded (`readyState 0`, `videoWidth 0`). Always assert readyState/videoWidth/currentTime, and re-query the element after any await (React remounts on key change; a stale ref reads as paused + mismatched).
- Still open: `harvest-field-notes-dji-0021-hero.mp4` is 1591KB, 3-5x the others (drone aerial, high motion). 6x better than before but worth a higher CRF or a calmer clip.

### Next
- [ ] Push `054f8d7` if unpushed, then Ben merges PR #62
- [ ] Ben: the cutover (DNS + MX first, env, build, EL webhook, GHL sweep, Search Console)
- [ ] On Ben's word that act.place is pointed: re-run both gates against it, spot-check robots/sitemap/canonicals
- [ ] Ben: send the EL brief (path above). `/storytellers` and `/people` unblock behind it; `/ask` needs a safety review he would commission
- [ ] Optional follow-ups, both flagged and deliberately not done: delete the 19 dormant `/projects/*` rules now the closure is permanent; remove the `/projects` and `/events` page code (needs an import check first)

### Decisions
- Prod on act-regenerative-studio.vercel.app is **staging-in-place**; real launch = cutover to a new domain (Ben, 2026-08-06)
- One renderer: /blog/[slug] carries the editorial design; StoryScroll remains for authored story packets
- EL failures never take the site down — null → baked snapshot, always
- DGR/entity/brand rules per CLAUDE.md apply to all public copy reviewed in this stream

### Open Questions
- RESOLVED 2026-08-07: domain is act.place; hi@act.place stays; www→apex
- UNCONFIRMED: DNS access for act.place, and whether its current MX records are recorded before the nameserver/A-record change (the one way this cutover breaks email)
- UNCONFIRMED: whether any external caller (cron, other repo) hits the newly-gated knowledge/registry endpoints anonymously
- UNCONFIRMED: EL-side appetite/timeline for data fixes (real publish dates, captions, per-article authors, featured-image alts)

### Workflow State
pattern: review-then-plan
phase: 1
total_phases: 3
retries: 0
max_retries: 3

#### Resolved
- goal: "walk through full page review and routes, then align the launch plan"
- resource_allocation: balanced

#### Unknowns
- new_domain: UNKNOWN
- el_data_fix_timeline: UNKNOWN

#### Last Failure
(none — both prod deploy failures root-caused and fixed in #56)

---

## Context

### Kickoff prompt for next session (paste or run as-is)

> Walk me through the full launch review in three phases. Work from
> `thoughts/shared/handoffs/website-launch-review/current.md` and memory
> `project_editorial_p1_state`.
>
> **Phase 1 — page-by-page review.** Take the live route inventory (24 sitemap
> routes + /stories/[slug] + /blog/[slug] articles) and walk me through them a
> section at a time on production, in this order: home, /about, /contact,
> /fields/* (5), /stories + 3–4 representative articles, /questions, /art + its
> 5 subpages + a detail page, /harvest + csa/produce, /confessions cluster,
> /privacy + /terms. For each: screenshot, judge copy against the ACT voice
> rules (no em-dashes, Indigenous place names first, no bare LCAA/ALMA), check
> data freshness (dates, stats, images), flag anything unfinished. Batch your
> findings per section and give me accept/fix calls to make. Fix Tier-1 items
> as we agree them; queue the rest.
>
> **Phase 2 — routes alignment.** Then put the route decisions to me one at a
> time with a recommendation: (a) /blog vs /stories naming — articles live at
> /blog/[slug] but the index is /stories and /blog 307s away; sitemap indexes
> /blog/* but not /stories/[slug]; (b) the redirect chains through retired
> routes (/wiki→/projects→/#fields, /lcaa→/method [308 into a dead hop],
> /wiki/new→/wiki, /ask→/projects); (c) the four launch holds (/storytellers,
> /ask, /wiki, /people) — confirm each stays held for launch and record the
> un-block criteria; (d) sitemap gaps (/stories/[slug] absent,
> /confessions/method absent) and the check-launch-site.mjs launchRoutes drift.
> Apply what we decide in config/launch-redirects.cjs + sitemap.ts +
> check-launch-site.mjs together (the file's own comment demands all three
> move in lockstep).
>
> **Phase 3 — align the launch plan.** Write the launch plan as a short doc:
> new-domain cutover checklist (Vercel domain, NEXT_PUBLIC_SITE_URL at build
> time, sitemap/robots host, GHL form source fields, EL webhook destination
> URLs), the hold un-block criteria from Phase 2, the EL-side data asks (real
> publish dates, captions, per-article authors, featured-image alts — these cap
> editorial quality and are upstream fixes), and what "ready to cut over" means
> as a checklist we can tick. Reconcile it against
> docs/strategy/website-launch-operating-system.md rather than duplicating it.
>
> Pause for my call at each phase boundary. Don't push or merge anything
> without my explicit verb.

### State that matters (verified this session)

- **Shipped + live:** a11ed96 (#55 editorial + consent/auth) and 72d27dc (#56 EL runtime hardening); verified on `/blog/the-spirit-must-be-strong` (full-bleed figures), `/blog/powering-change-a-curious-tractors-journey` (typographic hero), `/blog/historys-wounds-and-tomorrows-possibilities` (Descript embeds). Zero junk alts, zero "no public body" placeholders.
- **The deploy trap (do not reintroduce):** never pass an AbortSignal to an EL fetch — Next's background cache-write rejects outside try/catch and kills the build. `performEmpathyLedgerFetch` races an un-signalled fetch vs a timer and abandons on timeout.
- **Working tree:** 9 regenerated `src/data/*.generated.json` uncommitted on purpose. The regen drops 3 articles (vireak, nhat, +1); `field-assignments.ts` has 3 stale curated entries that must be fixed in the same commit (field-graph test enforces).
- **Local main:** carries unpushed `f434188` (newsletter authoring scaffold) — ship separately.
- **Route audit facts:** 94 pages; public site ungated; only /admin + /prototypes behind ACT_INTERNAL_TOKEN (404-on-deny); holds at config/launch-redirects.cjs:169-183 with rationale comments; the four top public pages import their bodies from src/app/prototypes/* (works, but fragile).
- **P2 backlog detail** lives in memory `project_editorial_p1_state` — destination-key divergence (act_el vs site slug), live read unpaginated (limit=100), per-process unavailable latch never resets, HOME_CURATED_SLUGS hardcoded.
