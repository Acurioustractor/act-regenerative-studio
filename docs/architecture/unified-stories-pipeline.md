# Unified ACT stories pipeline

## Outcome

Every ACT project can publish through the Empathy Ledger editorial system. Public, destination-approved stories are aggregated into the ACT Stories page without copying them into a second editor.

## Flow

1. A project creates or imports an article in Empathy Ledger.
2. The editor adds attribution, project relationships, images, video, canonical source and syndication destinations.
3. Empathy Ledger applies visibility and consent rules.
4. Publishing, updating or withdrawing sends a signed webhook to `/api/webhooks/empathy-ledger/editorial`.
5. The webhook queues an ACT deployment through the configured Vercel deploy hook.
6. During the build, `npm run sync:el-editorial` retrieves all destination-approved articles and media.
7. `/prototypes/stories` renders the unified stream. Existing `/blog/[slug]` pages render the complete article and media gallery.

Empathy Ledger remains the source of truth. Project sites can keep their own visual identity and canonical URLs.

## Required Empathy Ledger article fields

- stable article ID and slug
- title, excerpt and body
- author or storyteller attribution
- consent and public visibility
- canonical source URL
- primary and related projects
- featured image and alt text
- optional photo and video media
- syndication destination including `act_el`
- publication and update timestamps

Person-voiced writing without resolved attribution is withheld by the existing sync. Local withdrawal tombstones remain effective when Empathy Ledger is unavailable.

## Environment

```text
EMPATHY_LEDGER_URL=
EMPATHY_LEDGER_API_KEY=
EMPATHY_LEDGER_EDITORIAL_DESTINATION=act_el
EMPATHY_LEDGER_WEBHOOK_SECRET=
ACT_EDITORIAL_DEPLOY_HOOK_URL=
```

Empathy Ledger signs the unmodified JSON request body with HMAC SHA-256 and sends it in `x-empathy-ledger-signature` as either the raw hex digest or `sha256=<digest>`.

Supported events:

- `article.published`
- `article.updated`
- `article.withdrawn`

## Project-site rule

Project sites do not push directly into the ACT website. Their publishing workflow sends the story into Empathy Ledger first, where consent, attribution and destinations are resolved. ACT only consumes the public destination feed.
