# ACT forms → GHL pipelines + messages

**Date:** 2026-05-27
**Scope:** for each public form, the GHL pipeline/stage it should enter and the first message that goes to the person. Grounded in the live GHL pipelines (location-wide) and the existing form tags.

---

## How it works today (after this session's fixes)

Every form posts to `/api/forms/submit` → upserts a GHL **contact** tagged with `act-regenerative-studio` + project code + formType + context. That's enough to **trigger messages** (GHL workflows fire on tags). It does **not** yet create an **opportunity**, which is what puts a lead into a pipeline/stage. Pipeline routing is a small code add (the client already has `opportunities.create`).

---

## Routing map

| Form | Code | Pipeline → entry stage | Tag that drives the message |
|---|---|---|---|
| Contact (general) | ACT-IN | **Universal Inquiry → New Inquiry** | `contact` |
| Flagship inquiry — Empathy Ledger | ACT-EL | **Empathy Ledger → Identified** | `flagship-inquiry` |
| Flagship inquiry — Goods | ACT-GD | **Goods — Buyer Pipeline → First Contact** | `flagship-inquiry` |
| Flagship inquiry — Harvest / JusticeHub / BCV | ACT-HV/JH/BV | **Universal Inquiry → New Inquiry** | `flagship-inquiry` |
| Farm stay | ACT-BV | **Universal Inquiry → New Inquiry** (tag `farm-stay`) | `farm-stay` |
| CSA waitlist | ACT-HV | **Universal Inquiry → New Inquiry** (tag `csa-waitlist`) | `csa` |
| Residency | ACT-AS | **Universal Inquiry → New Inquiry** (tag `residency`) | `residency` |
| Newsletter | ACT-IN | *no opportunity* — subscriber tag only | `newsletter` |

Notes:
- **Universal Inquiry is the catch-all front door.** A human moves leads New Inquiry → Needs Assessment → Routed to Project. Harvest, JusticeHub, BCV, farm-stay, CSA, and residency land here because there is no dedicated pipeline for them yet (we can add Farm/Residency pipelines later if volume warrants).
- **Empathy Ledger and Goods have dedicated pipelines**, so their inquiries route straight there.
- **Newsletter is not a pipeline lead** — it is a subscriber. Tag only, into a nurture sequence.

---

## First message per form (ACT voice — field notes, honest, no em-dashes)

These are the immediate auto-replies. GHL workflow trigger: contact tagged with the formType. Sender: the studio (set in GHL).

**Contact (general)**
> Subject: We have your note
> Thanks for reaching out. Your note has landed with us and a real person will read it, usually within a few days. We tend to reply properly rather than quickly. If it takes a moment, that is us giving it thought.

**Flagship inquiry** (swap the project line per code)
> Subject: Thanks for your interest in {project}
> We have your note about {project} and someone close to the work will be in touch. We answer these by hand, so expect a real reply rather than an instant one.

**Farm stay (Black Cockatoo Valley)**
> Subject: Your enquiry about staying at Black Cockatoo Valley
> Thanks for your interest in staying on the land. This is an enquiry, not a booking. The next step is a short conversation about timing, purpose, and what the place can hold this season. We will be in touch.

**CSA waitlist (The Harvest)**
> Subject: You are on the list
> Thanks for adding your name. Harvest shares are being built in rhythm with the season, so being on the list does not guarantee a share in the first cycle. We would rather stay honest about that than oversell. We will write when there is something real to offer.

**Residency (Art for Social Change)**
> Subject: Your residency enquiry
> Thanks for your enquiry. We read these properly and respond as the season and our capacity allow. Expect a considered reply, not an instant one.

**Newsletter**
> Subject: You are in
> Field notes, project updates, and consent-cleared stories will reach you as they move from the work into the open. No noise, and you can step out any time.

---

## Nurture (the "drip-fed, not dense" idea from the mentor)

For **newsletter** and **warm-up** audiences, a short sequence beats a wall of content:
- Day 0: the welcome above.
- Day 4: one field story (reuse an editorial article / story packet).
- Day 11: one idea or method note (the LCAA lens, in plain language).
- Day 21: one invitation (a real next step — visit, partner conversation, support).

Keep each to a single story or idea. Field-notes voice, not marketing.

---

## What needs code vs GHL config

**GHL config (no code — fastest value, do first):**
1. Auto-reply workflows, one per formType tag, using the copy above.
2. Newsletter nurture sequence.
3. Routing automation on Universal Inquiry "New Inquiry" (notify/assign a human).
4. (Optional) cross-project synergy: e.g. a farm-stay lead who mentions storytelling gets a warm handoff to Empathy Ledger.

**Code (this repo — a follow-up change):**
1. Extend `pushToGHL` in `/api/forms/submit` to also `opportunities.create` in the mapped pipeline + entry stage. Needs the pipeline/stage IDs (we have them) as config, gated behind a flag (`GHL_ENABLE_PIPELINES`). Until then, contacts + tags + messages work; only the pipeline/stage tracking is missing.

**Recommended order:** stand up the message workflows in GHL now (they work off the tags the forms already send), then add the opportunity-creation code so the team gets pipeline visibility.
