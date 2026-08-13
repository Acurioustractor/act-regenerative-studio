# Entity truth, the essay into Empathy Ledger, and a revocation that held by luck

**Session:** 2026-08-14
**Branch:** `launch/entity-truth-and-boundaries`, 5 commits ahead of `d7d8d47`. Two unpushed: `9b99dda`, `217220a`.
**Next job:** Ben reads and edits the essay, then publishes it in Empathy Ledger.

---

## What this session was

Align the launch pages with the Notion brand and radical-sustainability piece,
publish "What the Road Corrects" through Empathy Ledger, and reconcile the media
library against it. The brand work turned into an entity-facts correction, and
the media work turned into a duplication and consent audit.

## Three pages were stating entities we cannot stand behind

Fixed in `b4c70cc`.

- `/economy` named **Harvest Pty Ltd** and **Farm Pty Ltd** as holding their own
  ledgers. Neither company exists; both are still being designed. It also called
  **A Kind Tractor Ltd** "the charity, currently dormant". The charity is **The
  Butterfly Movement Ltd**, DGR-endorsed since 2012, with its own board, which
  ACT does not own.
- `/studio` published "ACT Foundation (CLG)" and "ACT Ventures (Trading)", which
  `CLAUDE.md` explicitly forbids as entity names, and claimed the charity "owns
  majority of the ventures". It owns none of them.
- `/goods` described containerised factories as infrastructure "that communities
  own and operate", a claim about legal rights that does not exist in any of
  those places, and listed a three-year facility roadmap as though built. Now a
  pathway each community decides on, roadmap marked as intent.

`/goods` also now states plainly that ACT is not an Aboriginal or Torres Strait
Islander organisation, and separates commercial trade from the charitable door.
`/about` carries the same statement in the essay's own words (`f5a1f43`).

**Decision recorded:** the Notion piece reserves "Goods on Country" for the
charity and calls the product brand "Goods.". Ben ruled the other way: the site
keeps **Goods on Country as the commercial product brand**, per `CLAUDE.md`. The
Notion rule is overridden. Write this into the Notion page or it will be
re-litigated.

## The essay is a draft in Empathy Ledger, not published

Article `2bfc16cb-7491-41a6-ba79-7409df6dde73`, slug `what-the-road-corrects`,
in the **live** EL database `yvnuayzslukamizrlhwb`.

`status=draft`, `visibility=private`, `syndication_enabled=false`, no
destinations. The site ingests on `destination=act_el`, so a draft is
structurally incapable of appearing at `/stories/`.

Generated from the tracked markdown `compendium/04-story/what-the-road-corrects.md`,
not the .docx: 120 HTML nodes, 3,863 words, no markdown left unconverted. Modelled
on `contained-where-policy-meets-flesh`. `related_projects` set to the five slugs
the site actually resolves (`justicehub`, `goods-on-country`, `empathy-ledger`,
`the-harvest`, `black-cockatoo-valley`); `act-main` and `harvest` are **not** in
`PROJECT_SLUG_TO_FIELD` and would be silently skipped.

Featured image: media asset `0fb201a7-fc1f-43c2-88b3-f9379c26a0d2` at
`media/photos/act-editorial/what-the-road-corrects-hero.jpg`, uploaded from
`public/media/field-stills/goods-remote-aerial.jpg`. Checked by hash against
`file_hash` first; it was genuinely new. Landscape aerial, no identifiable
person, so recorded `requires_consent=false`, `people_present=false` with a note
rather than asserting a consent nobody gave.

**Local preview, uncommitted by Ben's choice:** `/prototypes/road-corrects` plus
its layout. Renders the same markdown through the real `EditorialArticleReader`.
Delete both once the essay publishes and resolves at
`/stories/what-the-road-corrects` on its own.

**Still open before publishing:**
- Nic has read it. Ben has not finished reading and editing.
- Edit the **markdown**, not the EL row, then regenerate, or the two drift.
- `FIELD_ASSIGNMENTS` in `src/data/field-assignments.ts` should gain
  `"what-the-road-corrects": ["art"]` (the essay discusses CONTAINED, and art has
  no upstream project slug). **Do not add it yet**: the guard in
  `field-graph.test.ts` asserts every slug there exists in the feed, so adding it
  before publication turns the suite red.

## A revocation that was holding by luck

Fixed in `217220a`. This is the thing to carry forward.

Three articles had their `syndication_consent` row for this site **revoked on
2026-07-29**: `a-heros-journey-from-addiction-to-inspiration-the-life-of-vireak`,
`a-story-of-resilience-and-advocacy`,
`nhats-story-finding-belonging-and-purpose-at-the-hope-centre`. Personal
addiction and recovery stories.

They were never reaching readers. But they were absent from
`config/withdrawn-editorial.json`, so the exclusion rested entirely on the
content-hub API being reachable. That file exists precisely so a withdrawal
survives an outage. Now listed.

The same gap one layer up: `enforceWithdrawals` filters the `articles` array and
nothing else, while `featuredHomeArticleSlugs` was copied from the EL admin
manifest untouched. **A withdrawn slug is sitting in that list now.** It never
reached a reader only because `HOME_CURATED_SLUGS` in
`src/lib/empathy-ledger-editorial.ts` wins over it. The sync now filters it.

**Watch this:** `the-power-of-indigenous-storytelling-a-community-perspective` is
in the tombstone, but the 2026-08-09 handoff is explicit that it came down as an
**editorial** decision and was deliberately not recorded as a consent
withdrawal. The file's `_doc` calls the whole list a consent-withdrawal
tombstone. The list is already mixed-purpose. Do not read membership as evidence
a community withdrew.

## Numbers, including two of mine that were wrong

For `destination=act_el`: **28** published and syndicated articles, **25**
approved, **3** revoked, **0** with no consent row. Coverage for this site is
complete.

Earlier in the session I reported "88 published, 51 missing consent rows". Both
wrong. The 88 was a join artifact (articles with two consent rows counted
twice; the real base is **79**), and the 51 counted articles that never targeted
this site. Reconciled with the parallel EL session: its 66 (articles naming
nobody) and my 51 are different cuts of the same 79. Only 3 name real people and
lack a row, and all 3 target `goods`, `justicehub`/`contained` and `harvest`,
not this site.

## Media library

- `media_assets.file_hash` was empty on all but 66 of 7,589 rows. Now
  `sha256-64k` on **7,146 rows (94.2%)**. That emptiness is why duplicates were
  invisible. Duplicates are now a query.
- **721 proven duplicate sets, 943 redundant rows.** 536 sets (668 rows) are
  **cross-tenant and must not be merged**: one file held by two communities is a
  governance fact. 185 sets (275 rows) are same-tenant and mergeable, **not
  done** (blocked on a permission rule for writing the merge script).
- 100 size-collision groups proved **not** to be the same file. Never dedupe on
  `file_size` alone.
- The Compendium 2026 set was 20 photographs stored as 40 rows. Merged and the
  orphans deleted, after repointing links and proving zero references remained.
- **Two traps.** Public storage URLs fail for objects that exist; use
  service-role signed URLs or you will conclude thousands of assets are missing.
  And **26 foreign keys** point at `media_assets`, 16 `ON DELETE CASCADE` and
  `articles.featured_image_id` `ON DELETE SET NULL`, so a naive delete destroys
  tags, transcripts and provenance and can blank an article hero.

### One photograph was attributed to the wrong community

The Compendium held a Palm Island professional shoot (October 2025) titled
**"Mission Beach Elder's trip Premire"**, a label from the ACT Placemat
`curated-2025` list. The three people face-tagged in it (Uncle Frank Daniel
Anderson, Gurtrude Grace Richardson, Elsa Watson) all belong to the **Palm
Island** tenant and organisation, matching `palm-island/synced/…`, and both rows
share `taken_at 2025-10-16 07:56:45`.

Uncle Frank was tagged **only** on the Compendium copy, so a blanket delete would
have erased him. He was moved to the Palm Island record; the two genuine
duplicates were removed. Palm Island now holds all three tags. The Compendium row
holds none, carries a truthful title, and records the correction.

## Gates

All green against a live server on 3001: `type-check`, `test`, `check:copy`,
`check:consent`, `check:media` (196 live / 0 dead across 20 story pages),
`check:forms`, `check:brand`, `check:redirects`, `check:launch`,
`check:launch-ready`, `check:contrast` (26 routes), `check:living-field`.

`check:living-field` was failing and fixed in `418f1e3`. It required the homepage
to say "Make the system felt", a line the essay names as the insufficiency it
rejects and which was deliberately replaced. It also still listed `/blog`, folded
into `/stories` on 2026-08-07.

**The test suite skips 33 of 60 by default.** Those are the entire authorisation
suite, gated on `ACT_INTERNAL_TOKEN` being set on both server and test run. Run
it: `ACT_INTERNAL_TOKEN=<tok> npm run test` with the server started using the
same token. It passes **59/59, 0 skipped**. The guards are real; I checked
`POST /api/media` returns 401 without and not-401 with.

`/stories` article pages were drawing a pale band down both sides of the prose
(`9b99dda`): the reader paints `#FBF6EC`, the body is `#FAFAF7`, and
`main > section` is capped at 1200px. Two sections now carry `full-bleed`. The
720px measure is held by the inner container, not the section.

## Open

1. **Publish the essay** once Ben has read it. Then add the `art` field
   assignment and delete the preview route.
2. **275 same-tenant duplicate merges**, unstarted. Needs the link-preserving
   approach, not a bulk delete.
3. **Cross-tenant duplicates (668 rows)** need a human, not tooling.
4. The parallel EL session found there is **no storyteller-side route that grants
   consent** — every insert path is admin or service, and the only `/me`
   syndication route is revoke. That asymmetry is why bulk attestation exists. Its
   ~6-line fix to `/me/reviews` unblocks 1,125 pending face tags.
5. `syndication_consent_single_article_subject_guard` blocks 7 live articles
   naming 2+ people. One row per article is the wrong shape. Note
   `contained-where-policy-meets-flesh` already carries two person-basis rows the
   guard would now reject, so any migration must reconcile existing violators.
6. `/api/v1/content-hub/syndicate` gates on `storyteller_approved_at`, which is
   100% NULL across 105 rows. That branch has never returned success, so it is
   unverified rather than verified.
