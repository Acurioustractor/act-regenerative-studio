---
date: 2026-07-21T15:57:59+08:00
researcher: Codex
git_commit: a54fc5aa5c3f0b362a0d818f58d6f7b97d2632e5
branch: wip/world-class-site-2026-06-13
repository: act-regenerative-studio
topic: "Current Goods on Country model, story, media and operating system"
tags: [research, goods-on-country, story, media, ownership, product]
status: complete
last_updated: 2026-07-21
last_updated_by: Codex
---

# Current Goods on Country review

## Summary

Goods on Country is not adequately described as a circular-product project. Its current model is:

> Goods turns community knowledge into health hardware, local work and production that communities can own.

Its five-stage loop is:

1. Listen
2. Design in community
3. Make On Country
4. Deliver and feed back
5. Transfer and support

The strongest current hinge is: **The product is proven. The transfer is not.**

## Current model authority

- `/Users/benknight/Code/Goods Asset Register/AGENTS.md`
- `/Users/benknight/Code/Goods Asset Register/v2/src/lib/data/products.ts`
- `/Users/benknight/Code/Goods Asset Register/v2/src/lib/data/asset-canonical.ts`
- `/Users/benknight/Code/Goods Asset Register/v2/src/lib/data/deck.ts`
- `/Users/benknight/Code/Goods Asset Register/wiki/articles/impact/theory-of-change.md`
- `/Users/benknight/Code/Goods Asset Register/wiki/articles/governance/legal-structure.md`
- `/Users/benknight/Code/Goods Asset Register/wiki/articles/governance/board-structure.md`
- `/Users/benknight/Code/Goods Asset Register/design/brand/tokens.css`

The truck test asks what came in, what leaves and what stays. If the object stays while wages, tools, knowledge and decisions leave, the old arrangement survives. Ownership must eventually include title, contracts, margin, knowledge and authority.

Current pitch truth is explicit: ownership is the promise, and it is not true yet.

## Current committed claims

- 540 beds: 177 Stretch Beds and 363 Basket Beds
- 20 washing machines recorded in community
- 11 communities
- 3,540kg modelled plastic from 177 Stretch Beds at a 20kg design specification

The plastic figure is modelled rather than weighbridge verified. Product presence, feedback and repeat demand are claimable. Long-term health outcomes, local plant economics and repeatable ownership governance remain under proof.

Health language must remain a plausible pathway rather than claim that a bed or washer prevents rheumatic heart disease without attributed clinical evidence.

## Strongest living-object system

The public `/bed/[id]` route is the strongest current product proof. A QR scan can connect an object to:

- Public identity and location
- Materials and suppliers
- Installation history
- Setup and support
- A recipient pulse
- Naming with a separate public or private choice
- Photographs, words, voice and story submission
- Community siblings and journey timeline
- Private Empathy Ledger draft creation after explicit share consent

Core sources:

- `/Users/benknight/Code/Goods Asset Register/v2/src/app/bed/[id]/page.tsx`
- `/Users/benknight/Code/Goods Asset Register/v2/src/app/bed/[id]/recipient-card.tsx`
- `/Users/benknight/Code/Goods Asset Register/v2/src/app/bed/[id]/story-modal.tsx`
- `/Users/benknight/Code/Goods Asset Register/v2/src/app/bed/[id]/install-logger.tsx`
- `/Users/benknight/Code/Goods Asset Register/v2/src/app/api/bed/[id]/story/route.ts`

Offline installation capture is implemented, providing strong evidence that the operational system is designed for remote conditions rather than only for a connected showroom.

## Strongest story packets

### Stretch Bed material and assembly

The safest immediate visual packet. Product, plant, macro material, assembly and people-free delivery media are documented in:

- `/Users/benknight/Code/Goods Asset Register/v2/public/images/product/`
- `/Users/benknight/Code/Goods Asset Register/v2/public/images/pitch/`
- `/Users/benknight/Code/Goods Asset Register/v2/public/images/process/`
- `/Users/benknight/Code/Goods Asset Register/v2/public/video/stretch-bed/assembly.mp4`
- `/Users/benknight/Code/Goods Asset Register/wiki/outputs/2026-07-03-canon-photo-video-review.md`

### Utopia and Oonchiumpa

The richest narrative and interaction structure, moving from young makers through relationship, road, homelands, household use and future local making.

- `/Users/benknight/Code/Goods Asset Register/v2/src/lib/data/trip-stories.ts`
- Route: `/field-notes/utopia-may-2026`

The current published story is not reliably consent-clean. Its local manifest says story stills are consent-pending, and manual gallery selection bypasses public-state filtering. Current counts inside the story also conflict. Do not reuse its people media in ACT until a destination-specific Empathy Ledger review is complete.

### Pakkimjalki Kari

The strongest washing-machine story, grounded in naming, washing at home, durability and iterative product feedback.

- `/Users/benknight/Code/Goods Asset Register/wiki/outputs/2026-05-14-washing-machine-full-history.md`
- `/Users/benknight/Code/Goods Asset Register/wiki/outputs/2026-07-11-narrative-foundation.md`
- `/Users/benknight/Code/Goods Asset Register/v2/src/lib/data/storyteller-registry.ts`

Person images and exact quotes remain item-specific and destination-dependent.

## Governance

Empathy Ledger owns people, story, media and consent. Goods references those records and owns product and operational media.

- `/Users/benknight/Code/Goods Asset Register/wiki/canon/storyteller-edit-flow.md`
- `/Users/benknight/Code/Goods Asset Register/wiki/canon/el-goods-alignment.md`
- `/Users/benknight/Code/Goods Asset Register/v2/src/lib/data/storyteller-registry.ts`
- `/Users/benknight/Code/Goods Asset Register/wiki/outputs/2026-07-03-canon-photo-video-review.md`

Public presence or a `verified` boolean is not enough. External use should pass through the canonical storyteller registry and destination-specific media permission.

## Current technical boundaries

The rereview found three current write or privacy boundaries that affect how confidently the QR journey can be presented:

- The service-role asset update endpoint lacks the admin guard used by neighbouring endpoints.
- The item-name endpoint permits renaming and public visibility changes without claimant or admin verification.
- Non-public story photographs and audio are uploaded to publicly addressable object URLs even though database rendering is consent-gated.

Relevant sources:

- `/Users/benknight/Code/Goods Asset Register/v2/src/app/api/admin/assets/[unique_id]/route.ts`
- `/Users/benknight/Code/Goods Asset Register/v2/src/app/api/bed/[id]/name/route.ts`
- `/Users/benknight/Code/Goods Asset Register/v2/src/app/api/bed/[id]/story/route.ts`

The ACT prototype describes the relationship model without presenting those write pathways as fully production-safe.

## Public-page drift

Several current public or pitch surfaces contain older figures or claims:

- `/story` incorrectly places the current 540 total inside 2024.
- `/the-work` still uses more than 400 beds, 87 Utopia beds and present-tense community ownership.
- One deck chip says 16 washers while the current canon says 20.
- Older brand documentation preserves a superseded 496-bed snapshot.
- Goods governance writing contains an entity description that conflicts with current ACT core facts.

ACT should use `asset-canonical.ts`, `products.ts` and the signed deck narrative rather than these drifted surfaces.

## ACT prototype update

The ACT Goods field story now follows:

1. Material
2. Make
3. Install
4. Return
5. Learn

Its interactive truck test asks whether the product, wages, tools, knowledge and decisions remain after delivery.

Implementation:

- `/Users/benknight/Code/act-regenerative-studio/src/app/prototypes/goods-field/goods-field-experience.tsx`
- `/Users/benknight/Code/act-regenerative-studio/src/app/prototypes/goods-field/story.module.css`
- `/Users/benknight/Code/act-regenerative-studio/src/app/prototypes/living-field/field-story.tsx`
