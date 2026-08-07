# ACT Website Launch Cutover Plan

> Status: Phase 3 of the launch review, drafted 2026-08-07 with Ben.
> Companion to [website-launch-operating-system.md](./website-launch-operating-system.md),
> which holds the build standards, QA gates and story-system architecture.
> This document holds only what that one does not: the domain cutover itself,
> the hold un-block criteria, the upstream Empathy Ledger data asks, and the
> definition of "ready to cut over".

Production on `act-regenerative-studio.vercel.app` is staging-in-place. The
real launch is a cutover to a new domain, and the point of this plan is that
the cutover is a config change, not a scramble.

## The one open decision

**Which domain.** Everything below is written against `<domain>`. Nothing in
the codebase hardcodes the current host on a public page; the launch gate
fails on any visible `act.place` or stale-host reference, so the cutover is
environment and third-party config only.

## Cutover checklist (in order)

1. **Vercel: add `<domain>` to the project** and set it as the production
   domain. DNS per Vercel's instructions (apex + www).
2. **Vercel env, Production scope: `NEXT_PUBLIC_SITE_URL=https://<domain>`.**
   This is read at build time by `src/app/robots.ts` (host + sitemap URL),
   `src/app/sitemap.ts` (every `<loc>`), `src/lib/seo/site.ts` (canonicals and
   og:url) and the admin login panel. All four fall back to
   `VERCEL_PROJECT_PRODUCTION_URL`, which Vercel points at the shortest
   production custom domain once one exists, so the explicit env var is belt
   and braces rather than the only thing holding the host together.
3. **Redeploy** (any push to main, or a manual redeploy). Env vars apply at
   build time; nothing changes until a build runs with the new value.
4. **Empathy Ledger side:** repoint the webhook destination for the
   `act-regenerative-studio` site to `https://<domain>/api/webhooks/empathy-ledger`.
   The vercel.app URL keeps resolving, so this is about one canonical
   destination rather than avoiding breakage. The EL site slug
   (`EMPATHY_LEDGER_SITE_SLUG=act-regenerative-studio`) is an identity, not a
   URL; it does not change.
5. **GoHighLevel side:** sweep workflows and email templates for links to the
   site and update hosts; repoint any webhook that targets
   `https://<domain>/api/webhooks/ghl`. Form submissions themselves need no
   change: source tags are route-based (`source:website-*`, `source:page:*`),
   and the GHL client reads `GHL_API_KEY` / `GHL_LOCATION_ID`, none of which
   are domain-dependent.
6. **Email address call:** the site's public address is `hi@act.place`
   (contact page, JusticeHub and Empathy Ledger flagship pages, Payout Wall
   right-of-reply, footer). Decide whether it stays or moves to the new
   domain; if it moves, the addresses live in five files and the change is a
   grep away. The mailboxes are independent of the web cutover either way.
7. **Legacy domain:** decide whether `www.act.place` redirects to `<domain>`
   (301 at the DNS or old host level). `config/launch-redirects.cjs` already
   maps the old site's routes; `npm run check:redirects` verifies the map.
8. **Search Console:** add the `<domain>` property and submit
   `https://<domain>/sitemap.xml`.
9. **Post-cutover gates**, in this order:
   - `LAUNCH_CHECK_BASE_URL=https://<domain> node scripts/check-launch-site.mjs`
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
| `/wiki` | Sync leaked internal R&D and finance content | `sync-canonical-wiki-pages.mjs` glob exclusions fixed; finance/decisions visibility decided; article quality pass per the operating system's wiki standard |
| `/people` | Internal research notes leaked into public bios | EL bio source sanitised; re-audit of every published bio before reversal |

## Empathy Ledger data asks

These cap editorial quality on the site and are upstream fixes, not site work.
Raised with the EL side; timeline unconfirmed.

- **Real publish dates.** 21 of 29 articles share one timestamp to the
  millisecond. Field pages deliberately render no dates because printing the
  migration artifact would state something false. Dates return to the pages
  when the feed carries real ones (a guard test in `field-graph.test.ts`
  flips when they arrive).
- **Media captions.** 0 of 114 photos carry captions.
- **Featured-image alt text.** 0 of 26 featured images carry alts; the site
  strips Webflow filename junk and falls back to the article title.
- **Per-article authors.** Every article currently attributes to one person;
  person-voiced pieces need their real storyteller bylines.
- **Destination-key alignment.** The sync uses the `act_el` destination key,
  the live read filters by site slug; the two paths can return different
  corpora. Needs one key.

## Ready to cut over

- [ ] Domain chosen; DNS access in hand
- [ ] PR #58 (route unification) merged and verified on production
- [ ] Launch gate green against production (`LAUNCH_CHECK_BASE_URL=https://act-regenerative-studio.vercel.app`)
- [ ] Redirect gate green (`npm run check:redirects`)
- [ ] Holds confirmed held, or reversed deliberately via the lockstep rule
- [ ] `NEXT_PUBLIC_SITE_URL` set in Vercel Production and a build shipped with it
- [ ] robots.txt, sitemap hosts and canonicals show `<domain>`
- [ ] EL webhook destination repointed; GHL links and webhooks swept
- [ ] Email address decision made (and applied, if moving)
- [ ] Search Console property live, sitemap submitted
- [ ] Legacy `www.act.place` redirect decision made
