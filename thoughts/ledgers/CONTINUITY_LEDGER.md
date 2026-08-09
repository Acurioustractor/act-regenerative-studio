# ACT Regenerative Studio - Continuity Ledger

> Last Updated: 2026-08-09
> Session: launch UI review, the "community perspective" story taken down, Field Notes 02 drafted
> Full handoff: `thoughts/shared/handoffs/2026-08-09-launch-review-and-the-story-taken-down.md`

## Active Context

### NEXT SESSION: FINAL CHECKING FOR LAUNCH
The code side is done and has been since 2026-08-07. What is left is Ben's, and
most of it is outside this repo. Nothing in this repo blocks the launch.

**Do not start new work. Verify, then stop.**

1. **Ben's cutover, his to do, not ours.** Point act.place DNS, **with the
   current MX records recorded first: that is the one way this breaks his
   email.** Then `NEXT_PUBLIC_SITE_URL=https://act.place` in Vercel Production,
   ship a build, repoint the EL webhook, sweep GHL, add Search Console.
2. **The moment Ben says act.place is pointed**, run all three gates against it
   and spot-check robots host, sitemap `<loc>` hosts, and a canonical on one
   static page plus one `/stories/[slug]`:
   - `LAUNCH_CHECK_BASE_URL=https://act.place node scripts/check-launch-site.mjs`
   - `REDIRECT_CHECK_BASE_URL=https://act.place node scripts/check-launch-redirects.mjs`
   - `CONTRAST_BASE_URL=https://act.place node scripts/check-contrast.mjs`
3. **The launch piece is drafted and must not ship yet.**
   `compendium/04-story/what-the-site-refuses.md` (Field Notes 02, 1,213 words,
   written in the `what-the-road-corrects.md` register with `act-voice` loaded).
   Three decisions are Ben's and are listed at the foot of the draft: the
   40,469-character disclosure, whether any Elder is named (none are, on
   purpose), and the domain. **Do not send it until those are settled.**

**One number in that draft is not verified.** `40,469` is carried from the
2026-08-08 handoff and was not re-queried. Confirm before it goes to print.

**Do not report 848 as this site's corpus.** The consent gate's own suggested
query is not scoped by destination and returns the whole EL corpus. The
site-scoped number is 20.

### Everything from the 2026-08-08 evening run is DONE
- **Media URL migration: COMPLETE.** 39 articles now stored host-relative, 0
  absolute. It broke 13 heroes on the first attempt, was reverted, fixed by EL
  #504, then retried as a canary (one article, verified at API AND rendered page,
  then the rest). Final: `check:media` 200 live / 0 dead.
- **Elder review: 7 articles recorded**, up from 1. Kristy Bloomfield
  (Oonchiumpa), Jimmy Frank (Warumungu, 2), Uncle Allan Palm Island (Bwgcolman,
  2), Shaun Fisher (Quandamooka), Brodie Germaine (Kalkadoon).
  **These names stay in the ledger and out of public copy** unless the person
  has been asked. Recording an approval and citing it as proof of good practice
  are different acts.

### Traps found 2026-08-09
- **The long-running dev server on :3001 serves stale code.** It runs from this
  working tree but rendered a byline that does not exist in the source. It reads
  exactly like a fix having failed. Use a fresh server on a free port, or
  restart :3001 first.
- **Vercel preview deployments are behind SSO.** Curling one returns Vercel's
  login page with a 200, so a "bad string is absent" grep passes and means
  nothing. Only Ben can check a preview.
- **The pre-commit consent gate fires on `editorial-article.tsx`.** Correct
  behaviour. Answer it from the database and pass the answer through
  `CONSENT_CHECKED=`. Never write that line to get past it.

### Everything from the 2026-08-08 evening run is DONE
- **Media URL migration: COMPLETE.** 39 articles now stored host-relative, 0
  absolute. It broke 13 heroes on the first attempt, was reverted, fixed by EL
  #504, then retried as a canary (one article, verified at API AND rendered page,
  then the rest). Final: `check:media` 200 live / 0 dead.
- **Elder review: 7 articles recorded**, up from 1. Kristy Bloomfield
  (Oonchiumpa), Jimmy Frank (Warumungu, 2), Uncle Allan Palm Island (Bwgcolman,
  2), Shaun Fisher (Quandamooka), Brodie Germaine (Kalkadoon).

### Current Goals
- [x] UI/UX review, launch-ready. Done 2026-08-09 against prod. Site is sound:
      all 65 sitemap routes 200, contrast gate 0 violations across 26 routes,
      0 console errors, no horizontal overflow at 390px, hero rotation correct
      (video + field name + line change together), /stories count live and honest.
      Four findings, none blocking, in the handoff. The one worth fixing before
      launch, the raw `STORY_FEATURE` token in story bylines, is **FIXED and
      live**: PR #78, merged `555473f`, new formatter at
      `src/lib/editorial/article-type.ts` with 5 tests, all four call sites
      converted, 20 story pages swept on prod with 0 raw tokens remaining.
      Three findings left unfixed on purpose, all in PR #78: burned-in text in
      the Confessions hero clip colliding with the hero's own text layer;
      standalone mobile CTAs at ~13px tall; hover on a field seed holding the
      current field rather than previewing the hovered one.
- [~] First large newsletter / blog post for launch. **DRAFTED, NOT SENT** at
      `compendium/04-story/what-the-site-refuses.md`. Field Notes 02, 1,213
      words, `act-voice` loaded before drafting, em-dash and AI-vocab and
      `check:copy` all clean. Opens on the story taken down rather than on what
      was built. Three decisions at the foot of the draft are Ben's and block
      sending: the 40,469-character disclosure, naming any Elder (none named, on
      purpose), and the domain.
- [x] **`the-power-of-indigenous-storytelling-a-community-perspective`:
      UNPUBLISHED 2026-08-09** on Ben's call. Was `status=published,
      visibility=public` since 2026-01-08; now `status=draft, visibility=private`
      (article id `b21fafab-255d-4c62-b989-9f165213063b`, project
      `yvnuayzslukamizrlhwb`). Reason recorded on an `article_reviews` row
      (`review_type=editor`, `decision=reject`, reviewer_name "Ben Knight"), not in
      `syndication_audit_log`: this was an editorial call, and filing it as a
      consent event would have falsely recorded that a community withdrew.
      Verified: live page 404s, sitemap dropped 66 to 65 entries, /stories count
      decremented 21 to 20, control story still 200.
      Restore by reversing status/visibility on that id.
      **Note for the elder-approval FK gap below: `article_reviews.reviewer_id`
      already FKs to `storytellers`, and `reviewer_name` is free text.** That may
      be the existing mechanism the fix wants, rather than a new column.
- [ ] **`elder_approved_by` has a FK to `auth.users`**, so it can only name someone
      with a platform login. Six of the seven approvals could not use it — Jimmy
      Frank, Uncle Allan, Shaun Fisher and Brodie Germaine are storytellers, not
      users. Attribution lives in `syndication_audit_log` metadata instead, with
      the reason stated on each row. The real fix is pointing that FK at
      `storytellers`, or adding `elder_approved_by_storyteller_id`.
- [ ] Whether **Richard Cassidy** has agreed to his own words being published in
      `the-spirit-must-be-strong`. Uncle Allan's approval covers elder authority
      for Country; it does not establish this, and the audit row says so.
- [ ] Jimmy Frank would like to see his `/me` page with his content aligned. Not
      looked at yet.
- [ ] **Article-level elder review queue in Empathy Ledger** — every approval still
      arrives as hand-written SQL. Another session was committing to that repo
      hourly; coordinate before starting.
- [ ] Conversation dates for all seven approvals — `elder_approved_at` holds the
      recording time, and every audit row says so explicitly.
- [ ] 6 rows in `stories` carry a hardcoded `empathyledger.com` host on
      `/api/v1/content-hub/stories/[id]`. Deliberately out of scope for #501.
- [ ] 2,164 project photographs: 118 captioned, 0 credited. Not a design backlog.
- [ ] `primaryProject` and `themes` still empty across the corpus; `publishedAt` is
      still a migration artifact.
- [ ] Cleanup (deletions): branches `fix/host-relative-media-urls`,
      `fix/absolutize-before-first-image`; worktrees `~/Code/el-wt-hosturl`,
      `~/Code/el-wt-firstimg`. All merged; safe to delete.

### CORRECTIONS carried forward
1. **Query `syndication_consent` before believing the wiki.** Empathy Ledger is the
   system of record. Already written into CLAUDE.md:65-67; no wiki record was found
   still contradicting it. Note the table lives in project `yvnuayzslukamizrlhwb`
   ("Empathy Ledger Enhanced"), **not** `tednluwflfhxyucgwigh` ("Empathy Ledger").
2. **Trace the logic; do not infer behaviour from an observed response.** This
   session I wrongly reported that the detail route enforced consent, because
   revoked articles returned 403. They returned 403 from a `visibility='private'`
   check; the route never queried consent at all. The two correlated perfectly
   across the whole table. Correlation that clean is still not causation.

### Recently Shipped (2026-08-08 evening)
Five landings, each verified on a live surface rather than at the merge:
ACT #75 (Field Notes 01 essay filed) · EL #496 (consent ledger governs the article
detail route — production had been serving 40,469 characters of body to a site with
no consent row) · EL #497 (a governed storage URL serves gated or not at all) ·
EL #501 (absolutize body media URLs on read, not at rest) · 34 JusticeHub featured
images registered and serving real bytes. Vercel Data Cache purged, which was the
cause of production serving content matching nothing in the database.
`check:media` 200 live / 0 dead across 21 story pages afterwards.

### Key Patterns Discovered
- This project uses **Supabase** with pgvector for storage
- Already has a `.claude/skills/` directory with project-specific skills
- Uses Next.js 15 + React 19 + TypeScript
- LCAA methodology (Listen, Curiosity, Action, Art) drives all work

### Architecture Notes
- **Living Wiki**: Knowledge extraction from Gmail, Notion, Calendar
- **Multi-Project Hub**: Empathy Ledger, JusticeHub, Harvest, BCV, Goods
- **GHL Integration**: CRM automation for all projects

## Memory System

### How to Recall
```bash
cd $CLAUDE_PROJECT_DIR/opc && PYTHONPATH=. uv run python scripts/core/recall_learnings.py --query "your search" --k 5
```

### How to Store
```bash
cd $CLAUDE_PROJECT_DIR/opc && PYTHONPATH=. uv run python scripts/core/store_learning.py \
  --session-id "session-id" \
  --type WORKING_SOLUTION \
  --content "what you learned" \
  --context "what it relates to" \
  --tags "tag1,tag2" \
  --confidence high
```

## Blocked Items
None. The editorial gaps above are decisions rather than blockers.

## Traps
- **Tests need a running server.** Port 3001 is often occupied by another session; a
  run against the wrong one produces failures that read as "the middleware is broken".
  Use `TEST_BASE_URL`. The suite has a preflight that says so.
- **`npm run build` runs eight sync scripts** that hit Empathy Ledger and Notion and
  rewrite generated JSON. Use `npx next build` to check compilation only.
- **Generated data files are rewritten on every build.** Never edit
  `src/data/*.generated.json` by hand; use the overlay pattern in
  `src/data/field-assignments.ts`.
- **The shell is zsh**, which does not word-split unquoted variables.

## Handoff Notes
Read `thoughts/shared/handoffs/2026-07-29-launch-hardening-and-field-graph.md` first.
It carries the reasoning, not just the outcome.
