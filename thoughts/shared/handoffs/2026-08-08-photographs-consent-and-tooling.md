# Photographs restored, consent recorded, tooling trimmed

**Date:** 2026-08-08
**Branch:** everything merged to `main`. Zero open PRs in this repo.
**Supersedes:** `2026-08-08-story-photographs-and-a-consent-red.md`, whose central
finding was wrong and is corrected below.

---

## Read this first: the correction that matters

An earlier pass in this session raised a **consent RED** claiming no approval
covered public-web publication of storyteller content. **That was wrong.** It
was based on reading the wiki decision records, which is where `consent-check`
says to look, and not the database.

Empathy Ledger is the system of record. `syndication_consent` holds 40 rows for
the `act-regenerative-studio` site: 37 approved, 38 article-scoped, every live
article covered by an approved, unrevoked row. Nothing was published without a
record.

**Rule for next time: query `syndication_consent` before believing the wiki.**

```sql
select a.slug, sc.status, sc.elder_approved, sc.revoked_at
from articles a
left join syndication_consent sc on sc.article_id = a.id
 and sc.site_id = (select id from syndication_sites where slug='act-regenerative-studio')
where a.syndication_enabled and a.status='published';
```

---

## What shipped

Ten PRs across two repos, all merged, deployed and verified live.

### Photographs: 107 dead → 0

Every photograph on all 21 live story pages resolves. Verified twice by
`npm run check:media` (baseline 0) and once by direct inspection of production
HTML.

Two changes closed it:

1. **A migration in Empathy Ledger** rewrote 244 article-body URLs off the
   retired public bucket onto the gated `/api/media/<id>/file` route, across 40
   articles. Backup table `articles_content_backup_20260807` still exists.
   Verified same-article: "The Spirit Must Be Strong" carried 19 raw
   public-storage URLs before and 19 gated ones after.
2. **This repo's sync stopped taking photographs from the content-hub detail
   route**, which does not apply the consent gate, in favour of the list route,
   which does.

Empathy Ledger PR #493 also closed the underlying hole: `articles/[slug]`
called `resolveAssetUrl` with two arguments instead of three and never built the
gate map, so every photograph it returned was a raw, unrevocable URL.

### Consent: the first real elder review recorded

Kristy Bloomfield's elder review is on the consent row for
`oonchiumpa-what-happens-when-community-leads`, attributed by id, provenance in
audit row `a0cea170`.

Scope is deliberately one article. *History's Wounds* and *JusticeHub: A
Platform* mention Oonchiumpa but are ACT-authored pieces, and were excluded
rather than swept in by name match.

`elder_approved_at` holds the moment of **recording, not the conversation**. The
date was never given. The audit row says so.

### Site corrections

- `/stories` no longer claims "One place. Many voices." above 21 pieces with one
  byline, nor that each story keeps "its people and its permissions" when the
  feed carries no per-story consent record.
- The article reader stopped printing a date derived from a migration timestamp.
- Hero text measured by sampling rendered pixels: the clay-gold "All stories"
  link ran 1.58–4.18 against a 4.5 requirement and moved onto a solid surface.
  Scrim 25/45/80 → 30/60/85.

### Tooling

```
CLAUDE.md            20,545 → 9,384 bytes, three false facts corrected
skills with no description   9 → 0
dangling symlinks (live)     3 → 0
stale project skills         3 synced, ~1,050 lines lighter
local MCP servers            7 → 4
```

---

## Next steps, in priority order

### 1. Elder review for the remaining eleven articles

Four communities, none recorded. `docs/integrations/empathy-ledger/record-elder-review.sql`
has a block per community; run only the ones with an actual approval behind them.

| community | articles | approver |
| --- | --- | --- |
| Warumungu / Tennant Creek | 2 | Jimmy Frank is in the system (`dda39576-…`) |
| Bwgcolman / Palm Island | 1 | none identified |
| Quandamooka | 1 | none identified |
| Kalkadoon | 1 | none identified |
| not community-specific | 6 | may need none |

Also outstanding: the **conversation date** for Kristy's approval, and whether
her approval extends to the two ACT-authored pieces that mention Oonchiumpa.

### 2. Two builds in Empathy Ledger, for "end to end" to be true

- **An article-level elder review queue.** `/admin/elder-review` reviews
  photographs and writes to `media_assets`. Nothing writes the article-level
  fields, so every approval has to arrive as hand-written SQL. Three-quarters of
  a feature: columns on the consent row, no vocabulary in the audit log, no UI.
- **Consent enforcement on the detail route.** The list route joins
  `syndication_consent`, respects `consent_enforced` and fails closed. The
  `[slug]` route does neither, so a revoke in the admin UI does not stop it
  serving.

### 3. Smaller, still open

- **The media gate fails open.** `resolveAssetUrl` ends `return gated ?? url`, so
  an unregistered asset ships raw. Flagged on EL #493.
- **The wiki decision records contradict the database** and should defer to it.
- **2,164 project photographs**: 118 captioned, 0 credited, 75 with named people.
  Unpublishable until that changes; not a design backlog.
- **The at-rest URL rewrite hardcoded `empathyledger.com`** into stored content
  where the app uses `NEXT_PUBLIC_APP_URL`. Reversible from the backup table.
- **claude.ai connectors** — Adobe, Canva, Miro are ~110 unused tool definitions.
  Only reachable from claude.ai settings.
- **`ACT_What_the_Road_Corrects_Website_Release (1).docx`** still untracked in the
  repo root. It is the essay the homepage speaks in. No decision on where it goes.

---

## Traps worth not rediscovering

- **The baked snapshots in `src/data/*.generated.json` are a stale fallback**, not
  the truth. Production reads live. Measure rendered pages, never the JSON.
- **That storage endpoint rejects `HEAD`** for everything. Probe with `GET` and
  check `content-type` starts with `image/`.
- **De-duping media probes by URL silently drops roles** when one photograph is
  hero, gallery and body at once. It hid two dead heroes.
- **A photograph that appears to work may be a Cloudflare cache hit**
  (`max-age=3600`). Check `cf-cache-status`: HIT means the origin was never asked.
- **Clay-gold `#CFA16B` (luminance 0.397) can never clear AA over an arbitrary
  photograph** at any scrim opacity. Small gold labels belong on solid surfaces.
- **`check-contrast.mjs` cannot see text over media**, by design. Measure by
  sampling rendered pixels: Playwright screenshot with the text layer hidden,
  decode with `sharp`, worst-case luminance in each text rect. Scripts must live
  in the repo root or the playwright/sharp imports do not resolve.
- **`cultural_permission_level` allows only** `public | community | restricted |
  sacred`. It describes the material's sensitivity tier, not who approved it.
- **`syndication_audit_log.event_type` has no elder-review value.** Nine permitted
  values, none of them this. `consent_granted` plus `consent_kind` in metadata is
  the current workaround.
- **`npm run db:types` does not exist**, despite older notes. Use the Supabase MCP
  or CLI.
- **Never `git commit -am` in this repo.** Modified pages import untracked new
  files; curate the add.
- **Restart the dev server after editing `config/launch-redirects.cjs`.**

---

## Gates

- `npm run check:media` — rendered production story pages, **baseline 0**. Retries
  non-image responses twice, because the gated route 302s across two hosts and a
  429 from either was making it flaky.
- `npm run check:consent` — blocks a commit touching the nine paths that change
  what community content is public. Pass with
  `CONSENT_CHECKED="<one line>" git commit …`. Install with `npm run hooks:install`.
- `check-contrast.mjs` — resolves one story article at run time so
  `/stories/[slug]` is covered. 26 routes, no violations.
- `npx tsc --noEmit && npm run test` — the fast gate. `npm run build` runs the EL
  and Notion syncs first and hits the network.
