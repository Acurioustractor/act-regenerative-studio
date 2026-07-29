---
title: The Harvest current model, story and media review
date: 2026-07-21
status: current working research
source_repository: /Users/benknight/Code/The Harvest Website
prototype: /prototypes/harvest-field
---

# The Harvest current model, story and media review

## The story now

The Harvest has moved beyond its opening story. The strongest current line in the July founder narrative is:

> The gate is open. The rhythm is not settled.

The place is the former Green Harvest nursery in Witta, on Jinibara Country. It is becoming economically alive without becoming bland, and community-shaped without becoming vague. Its practical public grammar is **Grow. Make. Gather.**

The ACT story should therefore move through:

`Gate → Grow → Make → Gather → Leave a mark → Return`

The invitation is not to admire a finished venue. It is to enter something unfinished and help make it.

## Current works and truthful tense

- **The Garden:** planted and growing, with a recurring care rhythm.
- **Milk Create Pavilion:** building. A modular 14 m × 9 m structure that turns a dairy object into communal architecture.
- **The Garden Paths:** building and making. Reclaimed timber, with parts of its source trail still being checked.
- **The Milk Man:** built and standing at the gate.
- **The Shop:** a concept taking shape. Do not describe it as a finished shop or legal co-operative.
- **Kids' Area:** consulting and planned. Do not describe it as built.

This changing-state vocabulary is more honest and more interesting than presenting every work as complete.

## Current public doors

The ACT page should keep operational information on The Harvest site and link people through:

- `/whats-on` for current dates and DIY pizza
- `/works` for the living collection
- `/get-involved` for volunteering, making and proposals
- `/membership` for the free member return loop

Do not duplicate volatile times, prices or supporter tiers on ACT.

## Visual direction

The milk-crate grid is the strongest interaction system. It is structure, sculpture and a frame through which the rest of the place appears. The selected prototype imagery therefore prioritises:

- the Milk Man at the gate
- the garden without identifiable people
- the Milk Create Pavilion as evolving architecture
- timber, paths and other material works

The page should ultimately move from daylight work into food, fire, music and the long table, once destination-specific consent for the human opening photographs is confirmed.

## Media governance finding

Do not treat the Empathy Ledger Harvest gallery or the generated local fallback as an approval boundary.

Verified during this audit:

- Empathy Ledger holds 605 Harvest assets, including 575 images and 30 videos.
- 111 opening-period photographs are present.
- Identifiable visitors and children are marked public even where there is no useful consent evidence.
- A further 21 assets explicitly require consent and have none recorded.
- The Harvest sync script downloads project media without applying consent and visibility gates.
- The Harvest gallery API does not explicitly filter consent, visibility, elder review or the central media gate.
- Sophie requested removal of her garden photographs on 5 July, but her article and tagged images remain exposed through live Empathy Ledger endpoints.

Until the records and API are repaired, ACT should use hand-selected no-person place and material images only. Public availability is not equivalent to permission.

## Primary sources read

- `docs/strategy/harvest-founder-narrative-workthrough-2026-07-13.md`
- `docs/communications/now-open-communications-map-2026-07.md`
- `docs/communications/post-opening-newsletter-2026-07.md`
- `docs/communications/articles-launch-set/01-milk-create-pavilion.md`
- `docs/communications/articles-launch-set/02-the-cedar.md`
- `docs/communications/story-packs/2026-05-07-sophie-garden-story-pack.md`
- `client/src/data/works.ts`
- `client/src/pages/HarvestReviewTest.tsx`
- `client/src/pages/WhatsOn.tsx`
- `client/src/pages/Membership.tsx`
- `client/src/pages/GetInvolved.tsx`
- `client/src/pages/StartHere.tsx`
- `client/src/App.tsx`
- `docs/brand/real-photo-and-history-assets.md`

## Known next work

1. Repair the Empathy Ledger Harvest gallery query and local sync consent filtering.
2. Unpublish or correctly gate Sophie's article and media in Empathy Ledger.
3. Establish item-level consent for the 20 June opening image set.
4. Once cleared, add the human movement sequence: hands making, pizza, fire, music and gathering.
5. Resolve The Harvest's still-unscoped place in the ACT visual family before treating this prototype as a final sub-brand.
