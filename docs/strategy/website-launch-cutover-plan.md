# ACT Website Launch Cutover Plan

> Status: Phase 3 of the launch review, drafted 2026-08-07 with Ben.
> Companion to [website-launch-operating-system.md](./website-launch-operating-system.md),
> which holds the build standards, QA gates and story-system architecture.
> This document holds only what that one does not: the domain cutover itself,
> the hold un-block criteria, the upstream Empathy Ledger data asks, and the
> definition of "ready to cut over".

Production on `act-regenerative-studio.vercel.app` is staging-in-place. The
real launch is a cutover to `act.place`, and the point of this plan is that
the cutover is a config change, not a scramble.

## Decisions (2026-08-07, with Ben)

**The domain is `act.place`.** It is the address the old ACT site occupies, and
`config/launch-redirects.cjs` already maps that site's routes (`/seeds`,
`/action`, `/germinating`, `/news`, `/journal`, `/year-in-review`) into this
one. The cutover is a replacement in place, not a move to a new address, and
the redirect map is the migration.

**`hi@act.place` stays.** No code change. It is the public address on the
contact page, the footer, the JusticeHub, Empathy Ledger, Goods and Farm
flagship pages, and the Payout Wall right-of-reply. It appears in 11 source
files, not the five an earlier draft of this plan claimed: moving it later is
still a grep, just a wider one.

**`www.act.place` redirects to the apex.** With `act.place` as the target this
stops being a legacy-domain question and becomes the ordinary www-to-apex
redirect Vercel configures with the domain. `NEXT_PUBLIC_SITE_URL` is the apex.

### Choosing act.place broke two launch gates. Both are fixed.

**The site gate flagged the site's own address as stale.**
`scripts/check-launch-site.mjs` treats `https://act.place` on a page as a link
back to the old site. Canonical and `og:url` tags emit the site's own host on
every page, and the gate's HTML stripping removes only `<script>` and
`<style>`, so the head survives the scan. Verified against live production
markup: the host appears four times per page. All 28 routes would have failed
at checklist step 9 the moment the domain went live. The gate now removes the
site's own origin before the stale scan, so a self-reference passes while a
link to the other form of the domain still fails, that being an avoidable
redirect hop. The host patterns also gained a hostname boundary, so
`act.placeholder.com` and similar cannot trip them.

**The redirect gate was already red, and nothing was watching.**
`npm run check:redirects` failed 30 assertions against production. Every one
came from the 19 retired `/projects/*` entries that the editorial-site
closure's `/projects/:slug*` rule covers. Redirects are first-match-wins, so
those entries are dormant by design, and the config explicitly warns against
flattening them into `/#fields`. The checker had no notion of precedence and
asserted every rule against the live site, so it was testing the closure
rather than the rules. It now resolves coverage in declaration order and
reports dormant rules instead of failing them: 75 checked, 19 dormant, green.
This gate is not wired into CI, which is why a red gate went unnoticed. It
needs a running server, so it stays a manual step below.

## Cutover checklist (in order)

1. **Vercel: add `act.place` to the project** and set it as the production
   domain. DNS per Vercel's instructions (apex + www).
2. **Vercel env, Production scope: `NEXT_PUBLIC_SITE_URL=https://act.place`.**
   This is read at build time by `src/app/robots.ts` (host + sitemap URL),
   `src/app/sitemap.ts` (every `<loc>`), `src/lib/seo/site.ts` (canonicals and
   og:url) and the admin login panel. All four fall back to
   `VERCEL_PROJECT_PRODUCTION_URL`, which Vercel points at the shortest
   production custom domain once one exists, so the explicit env var is belt
   and braces rather than the only thing holding the host together.
3. **Redeploy** (any push to main, or a manual redeploy). Env vars apply at
   build time; nothing changes until a build runs with the new value.
4. **Empathy Ledger side:** repoint the webhook destination for the
   `act-regenerative-studio` site to `https://act.place/api/webhooks/empathy-ledger`.
   The vercel.app URL keeps resolving, so this is about one canonical
   destination rather than avoiding breakage. The EL site slug
   (`EMPATHY_LEDGER_SITE_SLUG=act-regenerative-studio`) is an identity, not a
   URL; it does not change.
5. **GoHighLevel side:** sweep workflows and email templates for links to the
   site and update hosts; repoint any webhook that targets
   `https://act.place/api/webhooks/ghl`. Form submissions themselves need no
   change: source tags are route-based (`source:website-*`, `source:page:*`),
   and the GHL client reads `GHL_API_KEY` / `GHL_LOCATION_ID`, none of which
   are domain-dependent.
6. **Email: nothing to do.** `hi@act.place` stays (decided above), and the
   mailboxes are independent of the web cutover. Confirm the mail records
   survive the DNS change when the domain is pointed at Vercel: the apex needs
   its MX records carried across, and that is the one way this cutover can
   break email.
7. **`www.act.place` to the apex.** Vercel configures this when both are added
   in step 1; confirm it resolves in one hop. The old site's routes are already
   mapped in `config/launch-redirects.cjs`, so a visitor arriving on any legacy
   URL lands on its new home.
8. **Search Console:** add the `act.place` property and submit
   `https://act.place/sitemap.xml`.
9. **Post-cutover gates**, in this order:
   - `LAUNCH_CHECK_BASE_URL=https://act.place node scripts/check-launch-site.mjs`
   - `npm run check:redirects` against the new host
   - Spot-check robots.txt host, sitemap `<loc>` hosts, and a canonical tag on
     one static page and one `/stories/[slug]` article (article canonicals
     stay on Empathy Ledger by design).

## Launch holds and their un-block criteria

All four holds stay held for launch (decided 2026-08-07). Each reverses by
removing its rule in `config/launch-redirects.cjs`, then updating
`src/app/sitemap.ts` and the `launchRoutes` list in
`scripts/check-launch-site.mjs` in the same commit (the config's own comment
demands lockstep), then restoring any nav or index links that were removed
with the hold.

| Route | Held because | Un-block when |
| --- | --- | --- |
| `/storytellers` | Only one consented profile syndicates | More than one consented storyteller profile flows from Empathy Ledger |
| `/ask` | Public AI Q&A unreviewed | Cost, safety and prompt-injection review done; rate limiting and moderation decided; explicit go |
| `/wiki` | **Not a hold pending fixes any more. Decided 2026-08-07: the wiki is internal.** It stays in the repository and stays useful to us; it does not go out to the public | Only if that decision is reversed, and then the original blockers still apply: `sync-canonical-wiki-pages.mjs` glob exclusions fixed, finance and decisions visibility decided, article quality pass per the operating system's wiki standard |
| `/people` | Internal research notes leaked into public bios | EL bio source sanitised; re-audit of every published bio before reversal |

### This site does not sell. The destinations do.

Decided 2026-08-07, closing a question raised by the route walk. Every path here
ends at a contact form, and the essay asks for buyers who can place real orders
because a promise of demand does not pay a wage. The answer is that ordering
belongs on the destination sites, JusticeHub, Goods on Country, Empathy Ledger
and The Harvest, not on the hub.

That matches how the site is already built. Every field page hands off twice,
sideways to another field and outward to the real thing, so the hub is a doorway
rather than a shop. Worth writing down so it is not rediscovered as a gap: the
absence is the design.

The Harvest is the exception and stays one, because the place is the product:
`/harvest/csa` takes members and `/harvest/produce` says what is in season.

### The wiki stays internal

Checked on production on 2026-08-07, because "held" and "not reachable" are not
the same claim. `src/lib/projects/get-project-data.ts` reads the generated wiki
data and is imported by live public routes (`/harvest`, `/empathy-ledger`,
`/art/residencies`, `/farm/*`), so the internal material could have travelled
without `/wiki` being reachable at all. It has not: a scan of those pages for
revenue figures, funder scores, Xero invoice numbers and political contacts came
back clean. The single hit is the `ACT-HV` project code on `/harvest`, carried as
a form-tagging prop rather than shown as copy.

Worth re-running that scan whenever the wiki sync regenerates, since the leak
would arrive through the data rather than through the route.

## Empathy Ledger data asks

These cap editorial quality on the site and are upstream fixes, not site work.
The sendable version, ranked rather than listed as five equal requests, is
[docs/integrations/empathy-ledger/data-asks.md](../integrations/empathy-ledger/data-asks.md).

Figures re-verified against `empathy-ledger-editorial.generated.json` on
2026-08-07. The earlier numbers here were stale, having been carried from a
larger corpus, and are corrected below.

- **Real publish dates.** 26 articles carry 5 distinct timestamps between them;
  18 share `2026-01-09T23:40:59.476+00:00` to the millisecond. Field pages
  deliberately render no dates, because printing that migration artifact would
  state something false. A guard test in `field-graph.test.ts` flips when real
  dates arrive.
- **Destination-key alignment.** The sync writes `editorialDestination:
  "act_el"`; the runtime reads `/api/v2/sites/act-regenerative-studio/`. Two
  identifiers for one site, and nothing on this side can tell whether they
  select the same corpus. If they diverge, the snapshot and the live read
  disagree silently.
- **Featured-image alt text.** 0 of the 18 articles that have a featured image
  carry alt text; the site strips Webflow filename junk and falls back to the
  article title.
- **Media captions.** 0 of 123 media items carry a caption, and none carry alt
  text either.
- **Per-article authors.** All 26 attribute to one person; person-voiced pieces
  need their real storyteller bylines.

## Ready to cut over

Ticked items were verified on 2026-08-07 against
`https://act-regenerative-studio.vercel.app`.

- [x] Domain chosen: `act.place`
- [ ] DNS access for `act.place` in hand, and the current MX records recorded
      before anything is repointed
- [x] PR #58 (route unification) merged as `c83f4ff` and verified on
      production: `/stories/the-spirit-must-be-strong` serves 200, `/blog`,
      `/blog/[slug]` and `/news` each 308 in one hop
- [x] Launch gate green against production, 28 routes
- [x] Redirect gate green against production, 75 checked and 19 dormant
- [x] Holds confirmed held (all four, decided 2026-08-07; criteria in the table
      above)
- [x] Email address decision made: `hi@act.place` stays, no code change
- [x] `www.act.place` decision made: redirects to the apex
- [ ] `NEXT_PUBLIC_SITE_URL` set in Vercel Production and a build shipped with it
- [ ] robots.txt, sitemap hosts and canonicals show `act.place`
- [ ] EL webhook destination repointed; GHL links and webhooks swept
- [ ] Search Console property live, sitemap submitted
- [ ] Both gates re-run green against `https://act.place` after the cutover
