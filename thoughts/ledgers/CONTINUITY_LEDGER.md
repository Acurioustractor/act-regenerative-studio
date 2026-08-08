# ACT Regenerative Studio - Continuity Ledger

> Last Updated: 2026-08-09
> Session: consent enforcement closed on the detail route, media URLs made host-neutral
> Full handoff: `thoughts/shared/handoffs/2026-08-09-consent-enforcement-and-media-urls.md`

## Active Context

### NEXT SESSION IS A DIFFERENT JOB — UI/UX review, then a launch piece
Launch is **tomorrow**. Two things, in order:

1. **UI/UX review of the site, launch-ready.** Nothing below blocks it. The
   consent, media and photograph layers are all done and verified; treat the site
   as functionally sound and review it as a reader would.
2. **The first large newsletter / blog post for launch.** Load the `act-voice`
   skill BEFORE drafting, not after. No em-dashes. The essay the homepage speaks
   in is now tracked at `compendium/04-story/what-the-road-corrects.md` — it is
   the register to write in, and Field Notes 01 implies a series.

Useful for the launch piece: seven articles now carry recorded elder review, the
photographs all resolve, and consent is enforced end to end. That is a real story
about how the work is held, if it is wanted.

### Everything from the 2026-08-08 evening run is DONE
- **Media URL migration: COMPLETE.** 39 articles now stored host-relative, 0
  absolute. It broke 13 heroes on the first attempt, was reverted, fixed by EL
  #504, then retried as a canary (one article, verified at API AND rendered page,
  then the rest). Final: `check:media` 200 live / 0 dead.
- **Elder review: 7 articles recorded**, up from 1. Kristy Bloomfield
  (Oonchiumpa), Jimmy Frank (Warumungu, 2), Uncle Allan Palm Island (Bwgcolman,
  2), Shaun Fisher (Quandamooka), Brodie Germaine (Kalkadoon).

### Current Goals
- [ ] UI/UX review, launch-ready (see above).
- [ ] First large newsletter / blog post for launch.
- [ ] **`the-power-of-indigenous-storytelling-a-community-perspective` is live and
      probably should not be.** 1,123 characters, the shortest of the 21 by a wide
      margin, subtitled "a community perspective", speaking for Indigenous
      communities across Australia with no named community and no named person in
      it. Reads as placeholder or generated filler. This is a publish/unpublish
      call, not a consent one. **Worth settling before launch.**
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
