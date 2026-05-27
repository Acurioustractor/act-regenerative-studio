# Launch plan — Homepage restructured around "Confessions to Philanthropy"

**Date:** 2026-05-27
**Branch:** launch/site-refresh-2026-05-26
**Decisions locked (Ben):** restructure the homepage · build toward MVP + share cards
**Goal:** Make the homepage lead with the Confessions campaign (the Provoke), arc into the real flagship project pages (the Prove), and invite (the Invite) — everything pointing at pages already verified gate-green. Ship this week for Queensland Philanthropy Week.

---

## Design spine: Provoke → Prove → Invite
Confessions is the front door. The flagships are the proof ACT builds the alternative. The confession themes are the bridge from art into the ecosystem, wired into the content model, not bolted on.

## New homepage structure
Keep the page that works; insert one strong new lead and lightly reframe the flagship band. Net new sections: 1. Net reframed: 1. Everything else unchanged.

| # | Section | Change |
|---|---|---|
| 1 | Farm-video brand HERO | **Keep.** Add one secondary CTA pill → `/confessions` ("Confessions to Philanthropy ☎"). Answers "what is ACT" for first-timers, then hands to the campaign. |
| 2 | **★ CONFESSIONS CAMPAIGN BAND** | **NEW.** Full-bleed dark espresso/gold, matched to `/confessions`. The Provoke + the call CTA. The lead content of the launch. |
| 3 | AUDIENCE CHIPS ("I'm here to…") | Keep, moves down. |
| 4 | WHO WE ARE | Keep. |
| 5 | PHOTO BREAK (Jinibara Country) | Keep. |
| 6 | FLAGSHIP FIELDS | **Reframe.** Add a transition header ("We didn't just build somewhere to confess") + a one-line *confession it answers* eyebrow on each of the 5 flagship cards. This is the Prove + the bridge. |
| 7 | VOICES (Empathy Ledger) | Keep. |
| 8 | ART CALLOUT | Keep. (Gold-phone art tile stays pointed at `/art/gold-phone`; campaign traffic stays on `/confessions`.) |
| 9 | ECOSYSTEM MOSAIC | Keep. |
| 10 | METHOD (LCAA) | Keep. |
| 11 | INVITATION | Keep. |

**Alternative considered (not chosen unless you say so):** replace the farm-video hero entirely with a Confessions hero. Bolder, but erases the brand-establishing hero and confuses first-time visitors on what ACT actually is. Recommendation: lead band, not hero replacement.

## Section 2 — Confessions Campaign Band (the new lead)
Dark `#15100A` / candlelight `#CFA16B` / cream `#F3EBDD`, faint rotary-dial engraving, warm vignette — reuses the `/confessions` visual language so the two read as one campaign.

Draft copy (ACT voice, no em-dashes, matches the live page):
- Eyebrow: `Confessions to Philanthropy · Queensland Philanthropy Week`
- Headline: `Tell philanthropy what you really think.`
- Body: `There is a lot the sector never says out loud. Funders who know the model is bent. Grantees who cannot say it because they need the cheque. So we built a gold phone. Call it. Confess. No name, no consequences, no "dear valued stakeholder".`
- Primary CTA: reuse `CallCTA` → `tel:+61285034273`, shows `+61 (0) 2 8503 4273`
- Secondary link: `Hear what has been confessed →` → `/confessions`
- Texture: 3 short rotating confession lines (pulled from existing `heroVoices` in `confessions-mock`) so the band feels alive. No fabricated content beyond the already-honest mock, and the band links to the page where the "sample messages while the line warms up" labelling lives.

## Section 6 — the bridge (confession → real project page)
Transition header above the flagship grid:
- Eyebrow: `What we build instead`
- Title: `We did not just build somewhere to confess. We built the answer.`

Then a *confession it answers* line on each existing flagship card (order is already Goods, JusticeHub, Harvest, Empathy Ledger, BCV/Farm):

| Flagship (real, verified live) | Confession it answers |
|---|---|
| Goods → `/goods` | "Communities are treated as beneficiaries, never owners." |
| JusticeHub → `/justicehub` | "Programs die the day the grant ends." |
| The Harvest → `/harvest` | "Nobody funds the unglamorous infrastructure that actually holds." |
| Empathy Ledger → `/empathy-ledger` | "Funders make you perform gratitude for your own story." |
| Black Cockatoo Valley → `/farm` | "Impact is a glossy PDF, not a thing that lives in the ground." |

All five hrefs return 200 (confirmed in this session's gate run). No stubs.

## Share cards (the "+ share cards" choice)
Three 1200×630 shareable images in the gold-phone aesthetic, generated with `next/og` `ImageResponse` (crisp, no design tool round-trip, regenerate by editing code):
1. The hook — `Tell philanthropy what you really think.` + the number + `acuriustractor… /confessions`
2. A confession + the answer — a sample confession line paired with the project that answers it.
3. The invite — `Queensland Philanthropy Week. Call the gold phone.` + number.

Delivered as: a route under `/confessions/share/` rendering the three cards (so they have stable URLs to drop into posts), plus a small **share kit** block on `/confessions` (or the campaign band): the three card previews + pre-written post copy + copy-link. Also wire `opengraph-image` so sharing `/confessions` itself shows card 1.

## Files touched
- `src/app/page.tsx` — add hero secondary CTA; insert Confessions band; reframe flagship section + add confession captions. (largest change)
- `src/components/confessions/` — likely extract a small `CampaignBand` and/or reuse `CallCTA`, `heroVoices`. May lift `CallCTA` into a shared spot so the homepage can import it.
- `src/data/confessions-mock.ts` — read-only (reuse `heroVoices`); no data change.
- New: `src/app/confessions/share/…` (ImageResponse cards) + optional `opengraph-image.tsx`.
- New: a small share-kit component.

## Voice + integrity guardrails
- No em-dashes anywhere in public copy. Grounded, truth-telling, no savior framing, no glossy overclaim.
- No fabricated confessions: band reuses the already-honest mock; real feed swaps in when `IS_MOCK` flips (Phase 2 pipeline in act-global-infrastructure).
- Every link points at a verified-live page. `/storytellers`, `/ask`, `/wiki` stay 307-held and out of the funnel.

## Verification (stop criteria)
1. `npx tsc --noEmit` clean.
2. `npm run check:launch` against dev passes (single h1 preserved — the campaign band uses h2, hero keeps the only h1; new share routes excluded or h1-clean).
3. Visual pass at localhost:3001 — band reads as one campaign with `/confessions`; flagship captions render; share cards render at their URLs.
4. `npm run build` clean (all static pages prerender).

## Out of scope (flagged, not built)
- Live Dialpad audio pipeline (Phase 2, other repo).
- Vanity `1800 CONFESS` (carrier-dependent).
- Physical gold-phone installation, press push (the RAD tier).
- `/wiki` un-hold + its sync fix (separate prerequisite, already in memory).
