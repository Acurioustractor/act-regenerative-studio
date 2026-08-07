# Story photographs restored, and a consent trail that does not cover them

**Date:** 2026-08-08
**Branch:** work landed on `main` (PRs #63, #64, #65, #66, #67)
**Status of the site:** every photograph resolves. The consent question is open and is the reason to read this.

---

## The thing to deal with first

`consent-check` was run at the end of this session, against content that is already live. It comes back **RED**, on the skill's own stop conditions. Nothing here was published by this session, but this session materially increased what is visible on those pages, so it is ours to surface.

**The contradiction.** Two records disagree about whether storyteller content may be on the public internet.

Empathy Ledger says yes. For the 29 articles syndicated to `act_el`: `visibility = public`, `status = published`, `syndication_enabled = true`. Someone set those deliberately.

The wiki decision records say no. All three org-level story approvals
(`wiki/decisions/2026-04-18-{oonchiumpa,bg-fit,mounty-yarns}-story-approval.md`)
carry an explicit "What is NOT approved" section, and the first item in each is
public-internet publication. Oonchiumpa's is the clearest:

> ACT's closed-loop ecosystem is an approved audience, not the internet.

and

> Syndication beyond ACT's named surfaces. If a new destination appears
> (external journalist, book publisher, public website), a fresh per-destination
> approval is needed.

The named surfaces are the ACT wiki, the autoreason loop, the Brave Ones portrait
series, the Minderoo envelope, and the Judges on Country materials. The public
website is not among them.

**And the story named in that approval is live.** `Oonchiumpa: What Happens When
Community Leads` is listed by name at line 37 of the Oonchiumpa approval as one
of the six stories it covers. It is at
`/stories/oonchiumpa-what-happens-when-community-leads` with 17 photographs.

**Elder review.** Of the 29 syndicated articles, 14 contain culturally weighted
terms (Elder, Country, Traditional Owner, custodian, ceremony, sacred, sorry
business). One is flagged `requires_elder_review`. **Zero have an elder reviewer
recorded.** Titles in that set include "walking with Elders on Kalkadoon
Country" and "a day on Quandamooka Country". The Oonchiumpa approval treats the
cultural guard as belt-and-braces that must be *satisfied*, not switched off;
here `requires_elder_review` is simply false.

**What would unblock it.** One of:

1. A per-destination approval record for the public website, following the
   pattern the Oonchiumpa decision sets out (who, cultural role, when, channel,
   scope in the leader's own words), written per org whose stories are live.
2. Confirmation that a later approval exists which the wiki does not record, in
   which case the decision records need updating so the audit trail stops
   contradicting itself.
3. Narrowing what is public until 1 or 2 is done.

**Do not resolve this by writing a decision record from inference.** The skill is
explicit: never fabricate a consent detail to fill a gap, and an unverified gap
surfaced is recoverable where a fabricated fact published is not. The only
person who can say what Kristy Bloomfield and Tanya Turner agreed to is Ben.

---

## What shipped

Five PRs, all merged, deployed and verified live.

| PR | What |
|----|------|
| #63 | Dead photographs stop reaching the reader; two false claims removed; hero contrast measured |
| #64 | The last six broken frames, in the "Keep reading" cards |
| #65 | The migration that brings the article photographs back (doc) |
| #66 | Sync takes photographs from the gated route, not the ungated one |
| #67 | `check:media` baseline held at zero |

**Photographs: 107 dead → 0.** 201 live across 21 story pages, verified twice by
the gate and once by direct inspection of production HTML.

Two changes closed it:

1. **The Empathy Ledger migration.** All fifteen EL buckets are private and media
   serves through `/api/media/<id>/file`, which mints a signed URL. The migration
   rewrote the structured fields but not the article HTML bodies, which still
   embedded the retired `/object/public/media/` form. 244 URLs across 40 articles
   rewritten, all mappable via `media_assets.storage_path → id`. Backup at
   `articles_content_backup_20260807` in project `yvnuayzslukamizrlhwb`.
   Verified same-article: "The Spirit Must Be Strong" carried 19 raw
   public-storage URLs before and 19 gated ones after.

2. **The sync fix.** `/api/v1/content-hub/articles` (list) builds and passes the
   `gatedByStoragePath` map. `/api/v1/content-hub/articles/[slug]` (detail) does
   not. This sync fetched both and let detail win, so every photograph in the
   snapshot was the ungated form. Now the list wins for media; detail remains the
   only source of `content`.

Also landed: the `/stories` hero no longer claims "One place. Many voices." above
21 pieces with one byline, nor that each story stays connected to "its people and
its permissions" when the feed carries no per-story consent record. The article
reader stopped printing a date derived from a migration timestamp.

---

## Open, in priority order

1. **The consent RED above.**
2. **`articles/[slug]/route.ts` in `empathy-ledger-v2`** calls
   `resolveAssetUrl(url, sourceUrl)` with two arguments instead of three and
   never builds the gate map. Any consumer of that route gets photograph URLs
   that cannot be revoked. That is the consent hole, not merely a broken-image
   bug. Not touched: that repo had 68 uncommitted files on
   `chore/land-the-working-tree`.
3. **PR #62** still open on `launch-flatten-closure` (redirect flattening,
   predates this session). Its handoff at
   `thoughts/shared/handoffs/website-launch-review/current.md` lives on that
   branch, which is why this file is new rather than an update.
4. **The at-rest rewrite hardcoded `empathyledger.com`** into stored article
   content, where the app's design uses `NEXT_PUBLIC_APP_URL`. Previews and any
   future domain change will still point at production. Reversible from the
   backup table if you would rather fix it purely in code.
5. **Unexplained:** the EL detail route returns pre-migration content to a direct
   request despite being `force-dynamic`, doing a plain `select('*')`, against a
   database with zero old-form rows and no Supabase branch. Production
   demonstrably gets correct data. Left unresolved rather than papered over.

---

## Gates

- `npm run check:media` — probes rendered production story pages, baseline **0**.
  The renderers now hide a photograph that fails, so a rotting feed is invisible
  to a reader and this is the only thing that will say so. Raising the baseline
  is not a fix.
- `check-contrast.mjs` now resolves one story article at run time, so
  `/stories/[slug]` is covered. 26 routes, no violations. Text over photographs
  is skipped by design and was measured separately by sampling rendered pixels.
- `tsc`, 22 tests, `check:copy` all green.

## Traps worth not rediscovering

- The baked snapshot in `src/data` is a stale fallback and disagreed with
  production in both directions. Measure rendered pages, never the JSON.
- That storage endpoint rejects `HEAD` for everything; probe with `GET` and check
  `content-type` starts with `image/`.
- De-duping probe jobs by URL silently drops roles when one photograph is hero,
  gallery and body at once. It hid two dead heroes.
- Photographs that appear to work may be Cloudflare cache hits (`max-age=3600`).
  Check `cf-cache-status`: HIT means the origin was never asked.
- Clay-gold `#CFA16B` (luminance 0.397) can never clear AA over an arbitrary
  photograph at any scrim opacity. Small gold labels belong on solid surfaces.
