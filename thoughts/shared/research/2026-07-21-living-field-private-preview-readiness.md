---
title: Living Field private preview readiness
date: 2026-07-21
status: local preview ready, production not approved
route: /prototypes/living-field
---

# Living Field private preview readiness

## Outcome

The Living Field is ready for a private local review across the homepage, five field overviews and five immersive project stories. It is not yet approved for production publication.

## Verified locally

- Nineteen core routes return successful responses.
- Art, Empathy Ledger, JusticeHub, Goods on Country and The Harvest each have a direct immersive doorway, an ACT overview and a canonical project destination.
- All field summaries now come from `src/data/living-field.ts`, removing the previous homepage and overview duplication.
- The newsletter form uses the existing `/api/forms/submit` pipeline with explicit newsletter consent and Living Field provenance.
- Question links enter the working contact form with `field-question` context. They no longer point to the held `/ask` route.
- Native sharing is available through the device share sheet, with clipboard fallback.
- Newsletter and contact payloads pass dry-run validation without creating CRM contacts or opportunities.
- TypeScript, diff, form-contract and public-copy checks pass.
- Required local field stills and videos exist and are non-empty.
- Canonical external project destinations responded successfully during the audit.
- Every immersive stylesheet includes a mobile breakpoint and reduced-motion handling.

## Media governance boundary

The Harvest field deliberately uses no-person place and material imagery. Do not enable the general Empathy Ledger Harvest gallery as a source until its visibility, consent, elder-review and media-gate filtering is repaired. Sophie-related garden media must remain excluded following the recorded privacy request.

Community-led imagery in the other fields remains governed by the existing curated local selections. A production launch still requires an item-level media register naming source, consent state, permitted destination and withdrawal path.

## Not visually verified

The in-app browser refused localhost control under its URL security policy. The server itself was healthy and automated HTTP checks passed, but desktop, tablet and mobile pixel-level screenshots could not be captured from the controlled browser.

Before production, visually review at minimum:

- 1440 × 1000 desktop
- 1024 × 768 tablet
- 390 × 844 mobile
- keyboard-only navigation
- reduced-motion operating-system setting
- video fallback with autoplay disabled

## Production blockers

1. Complete the visual breakpoint review above.
2. Repair the Harvest Empathy Ledger gallery and sync consent gates.
3. Create an item-level publication register for every person-led image and video.
4. Confirm the final public home route. The Living Field remains under `/prototypes/` and has not replaced `/`.
5. Confirm canonical ACT social account URLs before adding persistent platform icons. Native sharing is implemented without inventing handles.
6. Confirm newsletter sender, welcome message and ongoing editorial cadence inside GHL.
7. Run the production build and launch checks only when moving into an explicitly authorised release phase.

## Repeatable QA

Run with the development server available on port 3001:

```bash
npm run check:living-field
npm run check:forms
npm run check:copy
npx tsc --noEmit --pretty false
```

`check:living-field` includes the full route sweep, required homepage content, forbidden stale copy and a newsletter dry run.
