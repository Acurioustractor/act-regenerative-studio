# Living Field launch candidate

Date: 22 July 2026

## Promoted public routes

- `/`
- `/stories`
- `/questions`
- `/questions/[slug]`
- `/fields/art`
- `/fields/empathy`
- `/fields/justice`
- `/fields/goods`
- `/fields/harvest`
- `/visit` redirects to `/harvest`

The `/prototypes/*` versions remain available for comparison and are marked no-index.

## Verified locally

- Optimized Next.js production compilation completed and wrote `.next/BUILD_ID`.
- TypeScript passes.
- Launch-readiness gate passes.
- Brand and public-language gate passes.
- Living Field route and shared-logo gate passes.
- Newsletter form validation passes without creating a CRM submission.
- Public production routes return HTTP 200.
- Questions and Fields are included in the sitemap.
- Canonical and Open Graph URLs are present for the new production route family.
- Exact ACT logo asset and application icon pack are in use.
- Empathy Ledger editorial snapshot supplies the Stories stream.
- Signed webhook code accepts publish, update and withdrawal events only when configured.

## Infrastructure configuration required

- `EMPATHY_LEDGER_WEBHOOK_SECRET`
- `ACT_EDITORIAL_DEPLOY_HOOK_URL`

Without these values, editorial content refreshes during an ACT build but does not trigger a build automatically when Empathy Ledger changes.

## Content and governance review required

- Final human approval of homepage claims and project descriptions.
- Final choice of homepage and Harvest films.
- Confirm current media permissions remain valid at launch.
- Review all public Empathy Ledger articles for attribution, canonical URL and destination approval.
- Confirm whether the Questions collection launches with six ACT-authored seeds or remains private until additional responses are commissioned.

## Final external release gate

No commit, push, preview deployment, production deployment or domain change was performed. Before release, create a recoverable Git checkpoint, deploy a private preview, complete visual review at 375, 768, 1024 and 1440 pixels in Safari, Chrome and Firefox, then obtain explicit production approval.
