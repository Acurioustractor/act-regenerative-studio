# ACT newsletter production

The newsletter is written in this repo so it inherits this site's design
system, then built to one HTML file and pasted into GoHighLevel.

Same convention in each brand's repo: `JusticeHub/emails/`,
`Goods Asset Register/v2/emails/`. The brand tokens differ; the process is
identical.

## The process, per issue

1. `mkdir emails/issues/<yyyy-mm-slug>/` with `meta.json`
   (`{ "title", "preheader", "eyebrow" }`) and `content.html`
   (h2 / p / blockquote / a fragments only — styles are inherited from the
   master).
2. Write the content in ACT voice (`/act-voice` skill), then fact-check with
   `/ground` before it is called ready.
3. `node emails/build.mjs <slug>` → `emails/issues/<slug>/dist.html`.
4. Open dist.html in a browser; Ben eyeballs it.
5. In GHL: new email campaign → paste HTML → audience is the smart list
   (`comms:act-newsletter` AND `newsletter_consent=Yes` AND not
   unsubscribed/DND). Ben presses send. Nothing sends without him.

## Audience contract

Tags are segments, consent is the `newsletter_consent` custom field — see
`act-global-infrastructure/wiki/decisions/newsletter-consent-policy.md`.
This site's NewsletterForm writes both atomically, routed by `projectCode`.

## Email HTML rules

- Tables + inline styles only; web fonts don't render in most clients, so
  DESIGN.md faces map to system stacks (Fraunces/Source Serif 4 → Georgia,
  Work Sans → Helvetica). Real color tokens stay.
- 600px single column. GHL merge tags ({{contact.first_name}},
  {{unsubscribe_link}}) pass through the build untouched.
