# Launch review, a story taken down, and a draft waiting on three decisions

**Session:** 2026-08-09
**Branch:** `main` at `555473f`, clean, nothing unpushed
**Next job:** final checking for launch

---

## What this session was

The ledger said: UI/UX review, then the launch piece. Both done. One thing
settled that the previous session had flagged and left live.

## The story is down

`the-power-of-indigenous-storytelling-a-community-perspective` is unpublished on
Ben's call. It had been `status=published, visibility=public` since 8 January
2026.

Article id `b21fafab-255d-4c62-b989-9f165213063b`, Empathy Ledger project
`yvnuayzslukamizrlhwb`. Now `status=draft, visibility=private`. Restore by
reversing those two fields on that id.

**The reason is recorded on an `article_reviews` row, not in
`syndication_audit_log`.** That was deliberate. `syndication_audit_log` is
consent-scoped and requires a `story_id`, `tenant_id` and `site_id`. Filing an
editorial decision there would have recorded that a community withdrew consent.
No community asked for this to come down. The row is `review_type=editor`,
`decision=reject`, `reviewer_name='Ben Knight'`, with the grounds and the
restore instruction in `notes` and `requested_changes`.

Verified on live surfaces rather than at the write: page 404s, sitemap dropped
66 to 65, `/stories` count decremented 21 to 20 on its own, control story still
200.

**Incidental find that matters for the elder-approval FK gap:**
`article_reviews.reviewer_id` already has a foreign key to `storytellers`, and
`reviewer_name` is free text. The mechanism that gap wants may already exist.
Look there before adding `elder_approved_by_storyteller_id` to `articles`.

## The UI review: the site is launch-sound

Checked against prod, not the dev server.

- All 65 sitemap routes return 200
- Contrast gate: 0 WCAG AA violations across 26 routes
- 0 console errors (64 warnings, all one benign Next.js CSS-preload notice)
- No horizontal overflow at 390px; h1 wraps; hero seeds are 44px tall
- Hero rotation correct: video, field name and line change together
- `/stories` counts are live, not hardcoded

**One finding fixed and shipped.** `STORY_FEATURE` was rendering as a raw
machine token in story bylines. PR #78, merged as `555473f`, verified live on
prod: 20 story pages swept, 0 raw tokens. New formatter at
`src/lib/editorial/article-type.ts` with 5 tests, now used by all four call
sites (the two `/projects` ones each had their own drifted `.replace()`).

**Three findings left unfixed, none blocking.** All recorded in PR #78.

1. The Confessions hero clip has text burned into the video ("No one is
   available to take your call right now.") and the hero's own text layer sits
   on top of it. Two typographic layers fighting. Only the Art field's clip.
2. Standalone mobile CTAs are ~13px tall ("Read the field notes", "Ask a
   question", "Enter The Harvest story"). Inline links are exempt from WCAG
   target size; standalone CTAs less clearly so.
3. Hovering a field seed holds the current field rather than previewing the
   hovered one. Possibly intended as pause-on-hover, reads as unresponsive.

## The launch piece is drafted and must not ship yet

`compendium/04-story/what-the-site-refuses.md`. Field Notes 02, 1,213 words,
written after loading `act-voice`, in the register of
`compendium/04-story/what-the-road-corrects.md`. Em-dash check, AI-vocab check
and `check:copy` all clean.

It opens on subtraction rather than addition: the story taken down, and the
seven months it sat there before anyone looked.

**Three decisions are Ben's and are listed at the foot of the draft:**

1. **The 40,469-character disclosure.** The draft includes the admission that
   the article route never queried the consent ledger, and production served a
   story's body to a site with no recorded permission. Most honest thing in the
   piece, most exposing. A storyteller might reasonably want to hear it from ACT
   before reading it in a launch email.
2. **No Elders are named, deliberately.** Seven approvals are recorded and every
   name is in the ledger. Naming an Elder in a launch announcement as evidence
   of good practice is closer to using them than crediting them. If any would
   want naming, that is a conversation with them, not a drafting decision.
3. **The domain.** The piece says "the site is live" and names no address,
   because the cutover is Ben's and DNS is unconfirmed.

## Numbers, and which one is not mine

Queried directly against `yvnuayzslukamizrlhwb` on 2026-08-09:

- 20 stories live on the site
- all 20 hold an approved, unrevoked `syndication_consent` row scoped to
  `act-regenerative-studio`: 0 missing, 0 revoked
- 7 of the 20 carry `elder_approved`

**`40,469` is carried from the 2026-08-08 handoff and was not re-queried this
session.** It is the one figure in the draft I did not confirm. If it goes to
print, confirm it first.

Note the consent gate's own suggested query returns **848** articles because it
is not scoped by destination. The site-scoped number is 20. Do not report 848 as
this site's corpus.

## Traps found this session

- **The long-running dev server on :3001 was serving stale code.** It runs from
  this working tree but rendered a byline that does not exist in the source (a
  date field the component does not have, and no reading time). It read exactly
  like the fix having failed. Verify on a fresh server on a free port, or
  restart :3001 before trusting anything on it.
- **Vercel preview deployments are behind SSO.** Curling one returns Vercel's
  login page with a 200. A grep for "bad string absent" on that HTML passes and
  means nothing. Ben can open previews logged in; an agent cannot.
- **The pre-commit consent gate fires on `editorial-article.tsx`.** It is
  correct to fire. Answer it from the database and pass the answer through
  `CONSENT_CHECKED=`. Never write that line to get past it.

## Next session: final checking for launch

The code side has been done since 2026-08-07. What is left is Ben's and is
mostly outside this repo.

- [ ] **Ben: the cutover.** Point act.place DNS, **with the current MX records
      recorded first, the one way this breaks his email.** Set
      `NEXT_PUBLIC_SITE_URL=https://act.place` in Vercel Production, ship a
      build, repoint the EL webhook, sweep GHL, add Search Console.
- [ ] **On Ben's word that act.place is pointed**, re-run both gates against it
      and spot-check robots host, sitemap `<loc>` hosts, and a canonical on one
      static page plus one `/stories/[slug]`:
      - `LAUNCH_CHECK_BASE_URL=https://act.place node scripts/check-launch-site.mjs`
      - `REDIRECT_CHECK_BASE_URL=https://act.place node scripts/check-launch-redirects.mjs`
      - `CONTRAST_BASE_URL=https://act.place node scripts/check-contrast.mjs`
- [ ] **Ben: the three decisions on the launch piece**, then it can go out.
- [ ] Optional, flagged and deliberately not done: the three UI findings above;
      deleting the 19 dormant `/projects/*` redirect rules now the closure is
      permanent; removing the `/projects` and `/events` page code, which needs
      an import check first.

## Still open from before, unchanged

- Whether **Richard Cassidy** has agreed to his own words being published in
  `the-spirit-must-be-strong`. Uncle Allan's approval covers elder authority for
  Country; it does not establish this, and the audit row says so.
- Jimmy Frank would like to see his `/me` page with his content aligned.
- Article-level elder review queue in Empathy Ledger. Every approval still
  arrives as hand-written SQL.
- Conversation dates for all seven approvals. `elder_approved_at` holds the
  recording time and every audit row says so.
- 6 rows in `stories` carry a hardcoded `empathyledger.com` host.
- 2,164 project photographs: 118 captioned, 0 credited.
- `primaryProject` and `themes` empty across the corpus; `publishedAt` still a
  migration artifact.
- Cleanup, safe: EL branches `fix/host-relative-media-urls`,
  `fix/absolutize-before-first-image`; worktrees `~/Code/el-wt-hosturl`,
  `~/Code/el-wt-firstimg`. All merged.

## State at handoff

Prod verified 2026-08-09: home 200, unpublished article 404, 20 stories in
sitemap, 65 routes total. `main` at `555473f`, clean, in sync with origin.
