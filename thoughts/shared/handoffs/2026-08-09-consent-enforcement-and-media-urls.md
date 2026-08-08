# Consent enforcement, a real hole closed, and one migration left loaded

**Date:** 2026-08-09 (work done through the evening of 2026-08-08)
**Branch:** everything merged. ACT `main` clean. EL `main` clean.
**Follows:** `2026-08-08-photographs-consent-and-tooling.md`, whose open list this
session worked down.

---

## Read this first: the one thing left loaded

`docs/integrations/empathy-ledger/host-relative-media-urls-2026-08-08.sql`
is **written, verified safe, and NOT run**.

Its prerequisite is now met: PR #501 is merged AND deployed to production,
confirmed on the wire (production returns 5 absolute `/api/media` URLs and 0
host-relative, content length 6668 unchanged). So the migration can be run.

**The order is not optional and is the opposite of the backfill below.**

```
code first, then data -> consumers keep receiving absolute URLs throughout
data first, then code -> every partner gets `/api/media/...`, resolves it
                         against its OWN domain, and 404s
```

That second line is not hypothetical. It is the JusticeHub eight-broken-images
bug, already recorded at the top of `src/lib/media/serve-absolutize.test.ts`.

After running it: confirm on the wire that consumers still receive **absolute**
URLs, then `npm run check:media` in this repo (baseline 0 dead across 21 story
pages).

---

## The correction that matters this session

Mid-investigation I told Ben the article detail route **did** enforce consent,
because revoked articles returned 403. That was wrong, and the code said so.

The 403s came from an `article.visibility === 'private'` check. The route never
queried `syndication_consent` at all. Every revoked article happened to also be
`visibility='private'`, so the two correlated perfectly and the behaviour looked
like enforcement. It was luck.

**Rule: trace the logic, do not infer behaviour from an observed response.**
A perfect correlation across the whole table is not causation.

---

## What shipped

Five merges, all verified on live surfaces rather than at the merge.

| PR | what | verified by |
| --- | --- | --- |
| ACT #75 | Field Notes 01 essay filed | 12/12 CI green |
| EL #496 | consent ledger governs the article detail route | 403/200 against production with ACT's key |
| EL #497 | governed storage URL serves gated or not at all | `check:media` 200 live / 0 dead |
| EL #501 | absolutize body media URLs on read, not at rest | preview vs prod byte-identical |
| (data) | 34 featured images registered | real bytes, `200 image/png 1,137,879` |

### The hole that was real, and live

`/api/v1/content-hub/articles/:slug` returned the full body without consulting
`syndication_consent`. With ACT's own site key against production:

- list route (`destination=act_el`): 26 articles, target **absent** — refused
- detail route: **200, 40,469 characters of body**

Not a latent bug. A site key could read the full text of articles that site had
no consent for. Closed by #496; production now answers
`403 {"error":"Consent for this article has not been granted..."}`.

The security-relevant half is precedence: the consuming site resolves from the
**site-scoped API key**, and `?destination=` is honoured only when the key names
no site. The other way round, any key holder could aim at a site with no consent
rows and read what their own site was refused. I wrote it backwards first and
caught it on review.

### Vercel Data Cache, not a stale deployment

Production served article bodies that matched nothing in the database. Ruled out,
in order: different code (`git diff` empty for content-hub), different database
(both deployments resolve the same asset id to the same storage path with the
same signing key), HTTP cache (`x-vercel-cache: MISS`, `age: 0`), and
per-deployment cache (a fresh deploy still served stale bytes).

What survived: **Vercel's Data Cache is per-project and survives deployments.**
`vercel cache purge --type data` flipped production from 6953/raw to 6668/gated
immediately. Confirmed by intervention.

The tell that pointed at it: two articles production had never served returned
database-exact bytes. Only previously-served articles were stale.

### 34 featured images: broken, not leaking

Framed in the last handoff as a fail-open leak. It was not. The `media` bucket is
no longer public, so those raw URLs return `400 NoSuchBucket` — they served
nothing. All 34 objects were still in the bucket, just unregistered, so nothing
could sign a URL for them.

Registered following the precedent already in the data
(`ungoverned-public-media-backfill-2026-07-30`): `requires_consent=false`,
`visibility='public'`, same tenant and operator ids. Marked
`metadata.backfill = 'featured-image-backfill-2026-08-08'`, `reviewed: false`,
alt text provisional and flagged.

**Ben's call, twice stated: these images carry no people and are cleared for
use.** I had wrongly inferred people from article slugs.

All 34 are JusticeHub's. None are ACT's.

---

## Next, in the order I would take it

### 1. Run the loaded migration
See the top of this document. Prerequisite met. ~5 minutes plus verification.

### 2. Elder review for eleven articles
Unchanged and still the real blocker, because it needs people rather than code.
`docs/integrations/empathy-ledger/record-elder-review.sql` has a block per
community; run only the ones with an actual approval behind them.

| community | articles | approver |
| --- | --- | --- |
| Warumungu / Tennant Creek | 2 | Jimmy Frank (`dda39576-…`), awaiting his approval |
| Bwgcolman / Palm Island | 1 | none identified |
| Quandamooka | 1 | none identified |
| Kalkadoon | 1 | none identified |
| not community-specific | 6 | may need none |

Also outstanding: the conversation date for Kristy's approval, and whether it
extends to the two ACT-authored pieces that mention Oonchiumpa.

### 3. Article-level elder review queue (EL build)
The thing that would replace hand-written SQL with a UI, and so actually unblock
(2). Held off deliberately: another session was committing to that repo hourly
all evening. **Coordinate before starting.**

### 4. Smaller, still open
- **6 rows in `stories`** carry the same hardcoded `empathyledger.com` host, on
  `/api/v1/content-hub/stories/[id]`. Out of scope for #501 on purpose.
- **2,164 project photographs**: 118 captioned, 0 credited, 75 with named people.
  Content work, not code.
- **`09c855ba feat(scripts): sweep partner sites for images served outside the
  gate`** landed from another session. Mention the featured-image backfill to
  whoever wrote it before they sweep.
- **claude.ai connectors** — Adobe, Canva, Miro are ~110 unused tool definitions.
  Only reachable from claude.ai settings.

### 5. Leftover cleanup (deletions, so left for Ben)
- remote branch `fix/host-relative-media-urls`
- worktree `~/Code/el-wt-hosturl` (remove its two symlinks first, then
  `git worktree remove` needs no `--force`)

---

## Traps worth not rediscovering

- **`syndication_consent` lives in `yvnuayzslukamizrlhwb` ("Empathy Ledger
  Enhanced"), NOT in the project named "Empathy Ledger"** (`tednluwflfhxyucgwigh`).
  The last handoff's SQL block does not name a project and the obvious guess is
  wrong.
- **Vercel Data Cache survives deployments.** `x-vercel-cache: MISS` and `age: 0`
  say nothing about it. A route can look uncached and still serve pre-migration
  rows. Purge with `vercel cache purge --type data`.
- **`VERCEL_ACCESS_TOKEN` in the environment is invalid.** The CLI rejects it.
  `vercel login` (device flow) works; the CLI had no stored credentials.
- **`gh pr merge --delete-branch` fails** in these repos because `main` is checked
  out in another worktree. The merge still succeeds; only the local cleanup step
  errors. Read the PR state rather than the command's exit.
- **`gh pr checks` output is TAB-separated.** Grepping for `| pass |` matches
  nothing and silently reports zero. My CI watcher did exactly this and I nearly
  acted on `pass: 0, fail: 0`. Use `grep -cP '\tpass\t'`.
- **A squash merge needs `git branch -D`, not `-d`** — the original commit is
  never an ancestor of `main`. Verify the content landed before forcing.
- **The `media` bucket is private.** Any `/storage/v1/object/public/media/...`
  URL returns `400 NoSuchBucket`. Those URLs are dead, not leaking.
- **`evaluateMediaGate` requires `visibility='public'` AND one of
  `requires_consent=false | consent_obtained | consent_granted |
  contained_consent`.** Registering an asset without one of those makes it
  `pending`, which 403s. Registration alone does not make an image serve.
- **`appBaseUrl()` is `http://localhost:4000` in the EL working tree.** It falls
  back to the canonical production host only when the variable is unset, and
  `NEXT_PUBLIC_APP_URL` is not in that project's Vercel production env list.
- **EL `main` moved five times during one session** and another session held 68
  uncommitted files in the working tree the whole time. Always
  `git worktree add` off `origin/main`; never work in that tree.
- **Zsh globs an unquoted `?`** in a URL passed to `gh api`, so the call fails
  silently inside an `until` loop and polls forever.

---

## Gates

- `npm run check:media` — rendered production story pages, **baseline 0**.
  Confirmed 200 live / 0 dead after all of the above.
- `npm run check:copy`, `npm run check:consent` — pass; pre-commit re-runs
  `check:copy`.
- EL pre-push gate needs `.env.local` present in the worktree, or the data-model
  check fails with a postgres auth error. Symlink it in; do not `--no-verify`.
- EL `tsc` baseline is **1247 errors** on `main`. Compare by set-diff, not count:
  a flaky `TS2589` in `media/route.ts` moves whenever a shared type changes.
