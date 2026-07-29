# Plan — Confessions as spine: lineage of works + Philanthropy Week comms cadence

**Date:** 2026-05-28
**Branch:** launch/site-refresh-2026-05-26
**Decisions locked (Ben):**
- Lead with **Confessions to Philanthropy** (`/confessions`); wrap everything around it.
- Strong link to the works = **lineage trio** (The Confessional 2023 → Gold.Phone 2024 → Confessions to Philanthropy 2026).
- Communication cadence = **external posting calendar** (social + email) using the existing share cards. Site copy mostly as-is.

**Needed input before build:** exact Queensland Philanthropy Week dates + the launch day. Calendar is drafted against `[QPW start]` / `[launch day]` placeholders until confirmed.

---

## Part A — Site: the lineage trio on `/confessions`

**Goal:** resolve the three-way naming collision (Gold.Phone / The Confessional / Confessions to Philanthropy read as three competing things) by turning it into a strength: ACT has a *practice* of building anonymous truth-telling infrastructure, and Confessions to Philanthropy is the latest in that line.

**New section on `/confessions`**, inserted between the Friday-inbox teaser (`page.tsx` ~L337) and the closing "Pick up the phone" CTA (~L339). Provenance right before the final ask.

Structure (matches espresso/gold palette, h2, no new h1):
- Eyebrow: `A line of work`
- Title (direction, final copy in brand pass): *"This is not the first phone we have built."*
- Three cards, oldest → newest, each linking to its art page:
  | Year | Work | Link | One line |
  |---|---|---|---|
  | 2023 | The Confessional | `/art/the-confessional` | A horse trailer made into a room where honesty becomes possible. |
  | 2024 | Gold.Phone | `/art/gold-phone` | A booth that connects strangers by voice, no screens, no profiles. |
  | 2026 | Confessions to Philanthropy | (this page / `/art/confessions-to-philanthropy`) | The gold phone, pointed at the sector that funds change. |
- The 2026 card is visually marked as "you are here / the current call."
- Closing line into the CTA: ties the lineage to the act of calling now.

**Homepage (minimal):** leave the art callout order (contained, gold-phone, the-confessional) as-is; optionally add one connective clause to its lede so the gold-phone tile reads as part of the Confessions thread, not a competing thing. Flagged optional, not required for launch.

**Cleanup while in the file:** fix the em-dashes (`—`) in the `the-confessional` art entry (`art-portfolio.ts:187,189,201`) — breaks the ACT no-em-dash rule and is now in the funnel's orbit.

**Voice guardrails:** load `act-brand-alignment` before writing the section copy. No em-dashes, grounded, no savior framing, no glossy overclaim. The lineage must read as honest practice, not a portfolio flex.

---

## Part B — External Philanthropy Week comms calendar

**Deliverable:** a posting calendar drafted with the marketing skills (`marketing-launch-strategy`, `marketing-social-content`, `marketing-email-sequence`), saved to `thoughts/shared/plans/` (or `brand/` — confirm).

**Anchored to the page's built-in rhythm:** launch → daily operator's-chair → Friday playback. The channels mirror what the page already promises.

**Channels (priority order for the philanthropy sector):**
1. **LinkedIn** — primary. Sector decision-makers live here.
2. **Email** — to ACT's list + sector contacts. Short sequence (announce → mid-week pulse → Friday playback).
3. **Instagram / X** — secondary amplification, card-led.

**Assets we already have (no new production needed):**
- 3 share cards: `hook`, `answer`, `invite` (`/confessions/share/{variant}`).
- The film (`confessions-to-philanthropy.mp4`) + poster.
- The number + `/confessions` link + OG card on the URL itself.

**Calendar shape (against `[launch day]`):**
- Day 0 (launch): hook card + film, "the line is open," the number. LinkedIn + email announce.
- Days 1–4 (operator's chair): one confession-led post/day (answer card variant), each pairing a confession with the flagship that answers it (reuse the homepage `confessionBySlug` mapping — already on-brand and on-site).
- Day 5 (Friday playback): the "honest version drops Friday" beat — invite card + a short playback post + email pulse.
- Evergreen: "pass it on" share-kit nudge.

Each slot gets draft copy in ACT voice (no em-dashes), the asset to attach, and the CTA. ~7–10 entries.

---

## Build order
1. Confirm QPW/launch dates + calendar save location.
2. Load `act-brand-alignment`; write the lineage-trio section copy + the cards.
3. Implement Part A on `/confessions`; fix the-confessional em-dashes.
4. `npx tsc --noEmit` clean + visual pass at localhost:3001 (single h1 preserved).
5. Draft Part B calendar (marketing skills) once dates land.

## Out of scope
- Phone-line provisioning (separate blocker, already flagged — verify the number answers before any of this ships).
- `IS_MOCK` flip (Phase 2 pipeline, other repo).
- On-site daily-rhythm automation (cadence chosen = external calendar, not site mechanics).
- New photo/video production for posts (use existing cards + film).

## Verification (stop criteria)
- Part A: tsc clean; `/confessions` renders the lineage band; all three links resolve 200; no em-dashes in rendered copy; one h1 on the page.
- Part B: calendar covers launch → Friday with per-slot copy + asset + CTA; every link points at a verified-live page; no em-dashes.
