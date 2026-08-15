---
date: 2026-08-15T09:05:00Z
session_name: field-notes-01-and-entity-truth
branch: main
status: complete
---

# Work Stream: field-notes-01-and-entity-truth

## Ledger
<!-- This section is extracted by SessionStart hook for quick resume -->
**Updated:** 2026-08-15T09:05:00Z
**Goal:** Align the launch pages with the Notion brand piece, publish Field Notes 01 through Empathy Ledger, reconcile the media library. **Done and live in production.** What remains is Empathy Ledger work and two media decisions.
**Branch:** `main` at `f00836f`. PRs #80 and #81 merged and verified live. Local checkout is still on the merged branch `launch/field-authority-note`; switch to main before new work.
**Test:** `npx tsc --noEmit && npm run test`. **33 of 60 tests skip by default** — that is the whole authorisation suite, gated on `ACT_INTERNAL_TOKEN` on BOTH server and test run. With it: 59/59, 0 skipped. Gates need a server: `CONTRAST_BASE_URL=http://localhost:3001 node scripts/check-contrast.mjs`. Dev is :3001 here (check it is not The Harvest first).

### Now
[->] Nothing in this repo. The remaining work is in `empathy-ledger-v2`.

### This Session
- [x] Entity truth on `/economy`, `/studio`, `/goods`: removed two companies that do not exist (Harvest Pty Ltd, Farm Pty Ltd), the wrong charity (A Kind Tractor, actually The Butterfly Movement Ltd), two forbidden entity names, and a community-ownership claim about containerised factories
- [x] Field Notes 01 published through Empathy Ledger with an individual consent row and seven photographs; live at `/stories/what-the-road-corrects`
- [x] "ACT is not a First Nations organisation" now on `/about` AND all five live field pages (goods, justice, empathy, harvest, art)
- [x] Three revoked-consent articles added to `config/withdrawn-editorial.json`; sync now filters `featuredHomeArticleSlugs` against the tombstone too
- [x] `media_assets.file_hash` populated on 7,146 of 7,589 rows; 943 duplicates now provable, 20 compendium orphans merged and deleted
- [x] Palm Island photograph corrected (was captioned "Mission Beach Elder's trip"); Uncle Frank's tag recovered from a merge that would have erased it
- [x] Mykel and Karen Liddle's photographs registered and linked to their storyteller records
- [x] Fixed: `/stories` pale band down both sides of prose; `check:living-field` asserting retired copy and a folded route; unmapped `goods` field slug
- [x] Audited all 44 live pages: no community-ownership overclaims, no forbidden entity names, no tax-deductibility claims

### Next
- [ ] **Empathy Ledger, highest value:** no storyteller-side route grants consent. Every insert path is admin or service; the only `/me` syndication route is revoke. That asymmetry is why bulk attestation exists. ~6-line fix to `/me/reviews` unblocks 1,125 pending face tags
- [ ] **Empathy Ledger:** did other consuming sites get the same wrong feed? Answerable now that authenticated calls work
- [ ] **Empathy Ledger:** `syndication_consent_single_article_subject_guard` blocks 7 live articles naming 2+ people. One row per article is the wrong shape. `contained-where-policy-meets-flesh` already holds two person-basis rows the guard would now reject, so any migration must reconcile existing violators
- [ ] 275 same-tenant duplicate media rows, mergeable. Needs a permission rule to write the merge script; 26 FKs point at `media_assets`, 16 CASCADE and `articles.featured_image_id` SET NULL, so repoint everything and prove zero references before deleting
- [ ] 668 cross-tenant duplicate rows: governance decision, not tooling. One file held by two communities is not a mistake
- [ ] When any of the 23 shadowed pages is un-held, give it the claims pass `/economy` and `/studio` just got

### Decisions
- **"Goods on Country" stays the commercial product brand.** The Notion piece reserves it for the charity; Ben ruled the other way, per `CLAUDE.md`. Record this in Notion or it will be re-litigated
- **`/economy` and `/studio` are deliberately dark at launch.** Their corrections are banked, not live
- **Harvest stays a flagship hub.** The Notion piece's demote-to-Farm-program recommendation was not taken
- **Essay images: seven, not eight.** Every candidate was opened and looked at. Excluded: identifiable people with no consent record, a group including children, an `EZVIZ` CCTV watermark. `goods-mykel-building-the-bed.jpg` excluded on editorial grounds — the essay refuses to turn his morning into proof, so leading with his face contradicts the text
- **Consent modelled as Ben sole subject.** He is author and only named person; Nic's agreement is recorded in the consent row's `request_reason` because the guard permits one person-basis row per article
- **Markdown is the source for the essay.** Edit `compendium/04-story/what-the-road-corrects.md`, then regenerate via `empathy-ledger-v2/tmp/regenerate-road-corrects.mjs`, which refuses to run once published. Never edit the EL row directly

### Open Questions
- UNCONFIRMED: root cause of the Empathy Ledger authenticated-feed fault. It resolved during the EL session's work, and `b21fafab` is now excluded despite holding approved consent (so the status filter is applying, not the consent gate masking it). Why it ever returned a draft is not explained
- UNCONFIRMED: whether `goods-karen-liddle-on-beds.jpg` and `goods-mykel-building-the-bed.jpg` should be used at all. Both are now linked with `consent_status: pending`; neither person has been asked

### Workflow State
pattern: sequential-with-verification
phase: 6
total_phases: 6
retries: 0
max_retries: 3

#### Resolved
- goal: "align launch pages with the Notion piece, publish the essay through Empathy Ledger, align the media"
- resource_allocation: balanced

#### Unknowns
- el_authed_feed_root_cause: UNKNOWN (symptom resolved, mechanism unexplained)
- other_consuming_sites_affected: UNKNOWN

#### Last Failure
(none)

---

## Context

Full narrative detail is in the committed handoff on `main`:
`thoughts/shared/handoffs/2026-08-14-entity-truth-the-essay-and-a-revocation-that-held-by-luck.md`

Cross-repo, in `empathy-ledger-v2` and deliberately **uncommitted** because another
session was active in that repo:
`thoughts/shared/2026-08-14-content-hub-authed-list-is-stale.md`

### The traps this session paid for

- **The live Empathy Ledger database is `yvnuayzslukamizrlhwb` ("Empathy Ledger
  Enhanced"), not `tednluwflfhxyucgwigh` ("Empathy Ledger").** Reading migrations
  in the repo and querying the wrong project gives columns that do not exist.
- **`media_storytellers.consent_status` values are `pending` / `not_required` /
  `granted`.** There is no `approved`. Querying for it returns zero and looks
  like an absence.
- **Public Supabase storage URLs 400 for objects that exist.** Use service-role
  signed URLs, or you will conclude thousands of assets are missing.
- **Article images must be referenced as
  `https://empathyledger.com/api/media/<id>/file`.** Raw storage URLs 400.
  `gallery_ids` is 0 on all act_el articles and the sync hardcodes
  `photoCount: 0`, so inline `<img>` in the content HTML is the only route.
- **`config/withdrawn-editorial.json` is load-bearing.** For most of 2026-08-14 it
  was the only thing keeping a withdrawn story out of a feed that still served it.

### The pattern worth carrying

Three times, something was true by its label and false in fact: a photograph
captioned as the wrong community, a filename that would have published a
stranger's face, and a confident diagnosis of a cache that was nothing of the
sort. Each was caught by opening the thing rather than trusting the name on it.
Twice the catch came from Ben or the parallel Empathy Ledger session.
