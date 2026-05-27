# ACT website review: lessons from The Harvest review + mentor feedback

**Date:** 2026-05-27
**Sources:** `04_Visuals/The Harvest web review.docx` (external website audit of theharvestwitta.com.au) and Benjamin Croft's audience-engagement feedback (25-26 May 2026).
**Scope:** what applies to the main A Curious Tractor site (this repo), what is already handled, and what to fix.

---

## TL;DR

The ACT site already passes most of the Harvest audit's mechanical points (the launch gate has been doing this work). The audit's real value for ACT is in three areas we have NOT fully solved: **CTA visual consistency**, **homepage focus / content density**, and **mobile hero behaviour**. The mentor feedback is the bigger prize: it is about **how the story reaches people**, not the site itself, and points us toward drip-fed delivery, audience-led formats, and lower form friction.

---

## Part A. Harvest audit points mapped to the ACT site

| Audit point | ACT status | Action |
|---|---|---|
| 10-second test (who/what/who-for/why) above the fold | Likely OK, hero leads with video + one clear line | Sanity-check on a cold visitor; verify the first screen answers "who/what/why" without scrolling |
| One-word nav headings | **Done** (Projects, Stories, Art, Farm, Contact) | none |
| Contact in nav, single primary CTA in header | **Done** (Contact in nav; hero has one CTA "Explore projects") | none |
| Exactly one H1 per page | **Done** (launch gate enforces) | Add/verify H2/H3 hierarchy for semantics + SEO |
| SEO-friendly image filenames (not `DJI_2026...`) | **Done** (24 media files, all clean-named) | keep the naming convention for new assets |
| Descriptive alt text (not filenames) | **Done** (`cleanMediaAlt` used; no raw-filename alts found) | keep |
| Footer trust info (copyright, entity) | **Done** (© year + "A Curious Tractor Pty Ltd · ACN 697 347 676"). ABN correctly omitted (pending) | none |
| Privacy policy when collecting emails | **Done** (`/privacy`) | none |
| Meta title/description | **Done** (canonical/OG on every route) | none |
| **CTA buttons: one consistent style/colour** | **GAP** — 4 primary-button colours in use: `#4CAF50` (x22), `--we-olive` (x15), `#CFA16B` (x12), `#245c43` (x6) | Pick ONE primary CTA style + one secondary; apply site-wide. Biggest quick win. |
| **Homepage focus ("kid in a toy shop")** | **GAP** — homepage is dense, many sections + CTAs | Tighten: fewer competing CTAs, each tied to journey stage. See Part B (drip delivery). |
| **Mobile hero optimisation** (grey band on Galaxy S25) | **UNVERIFIED** | Test hero on Android/wide-aspect viewports; ensure cover video/image fills "above the fold" |
| CTA copy finishes "I want to…" (verbs not nouns) | Mostly OK ("Explore projects") | Audit remaining CTAs for noun-style labels ("What is X" -> "Discover X") |
| Image weight < 150kb / Core Web Vitals | **UNVERIFIED** | Run PageSpeed/GTmetrix; compress heavy stills; the 4.7MB Confessions video should lazy-load/poster only |
| Sentence-case heading consistency | **UNVERIFIED** | Quick consistency pass across pages |
| No orphan pages (missing header/footer) | **Done** (even `/confessions` uses the root layout + nav) | none |
| Distinct Contact vs join pages (not same URL) | OK (contact form is its own route) | none |
| Punctuation/proofreading consistency | Ongoing | Note: the audit suggests adding em dashes; ACT house style is **no em dashes**. Keep our rule; enforce comma/dot consistency instead. |

**Verdict:** the ACT site is in much better shape than Harvest was. The one clear design fix is **CTA consistency**; the one clear strategic fix is **content density** (which Part B addresses).

---

## Part B. Mentor feedback: how to engage audiences

Croft's notes are aimed at Harvest but apply directly to how ACT launches and sustains attention. The throughline: **make the message fit the medium and the audience, deliver it in small strategic pieces, and let people return on their own agency.**

1. **Ask the first audiences how they want to receive the story.** Don't assume a website link. Offer a gallery they can text around, a short video, a printable one-pager, a board-ready slide deck, or an audio piece. *ACT action:* for warm relationships (Centrecorp, Oonchiumpa, community), package the same narrative in 2-3 shareable formats, not just a URL. We already have a strong video (Confessions) and story packets to repurpose.

2. **Build funnels for the second audiences.** Warm them up before a launch. *ACT action:* this is where GHL earns its keep. Map a simple warm-up sequence per audience (funders, partners, public) feeding to the launch moment.

3. **Less content, drip-fed.** "Significantly less content, the story fed strategically through a number of communications. Drip-fed emails, a podcast, other delivery." People understand the mission better in small sequenced pieces than in one dense site. *ACT action:* this validates holding /wiki and trimming homepage density. Move depth off the homepage into a sequence. Keep the site as the front door, not the whole story.

4. **Reduce form friction.** Croft flags the Goods `/partner` "what size are you thinking?" question as unnecessary early friction; recommends removing it or moving it to a stage-2 after initial submission. *ACT action:* audit our forms (contact, farm stay, CSA, residency) for early-ask friction. Prefer a short stage-1 (name + intent) with details captured later.

5. **Get message + medium + market right, then convert.** The classic failure is imposing your medium (a membership site no one logs into) when the audience lives in WhatsApp / a Facebook group. *ACT action:* meet each audience where they already are before asking them to come to us.

6. **Show the humans behind it.** Croft is "torn" but believes target audiences are more likely to engage if they know Ben and Nick are behind this. *ACT action:* this is a brand-tension call (community-first vs founder-led). Recommendation: keep communities at the centre of the work, but make the founders reachable and visible in the trust layer (about/partners), since funders and partners back people. Worth A/B considering per audience.

7. **Mini-projects owned by volunteers/interns, trained on a brand-voice guide.** Croft: turn the smaller pieces into mini-projects owned by trusted interns, trained from a brand/voice/strategy guide, with Ben as visionary. *ACT action:* we already have the `act-brand-alignment` skill + writing-voice references; that is the training spine. Package it into an intern brief so output scales without drift.

8. **Value-first retention.** Ben's own synthesis: "create cool, interesting, usable stuff and let people use their own agency to keep connecting because they know they keep getting value." *ACT action:* design recurring value (stories, usable tools, things people can repurpose for their own goals) rather than asking for engagement.

---

## Recommended next steps (priority order)

1. **CTA design pass** (site fix, ~half day): define one primary + one secondary button style/colour; replace the 4 ad-hoc colours. Highest-leverage visual fix from the audit.
2. **Homepage focus pass** (site + strategy): cut competing CTAs, tie each remaining CTA to a journey stage, move depth into sequenced comms.
3. **Form friction audit** (CRO): shorten stage-1 on contact/farm-stay/CSA/residency; defer detail to stage-2.
4. **Performance + mobile pass**: PageSpeed/GTmetrix; compress heavy stills; verify hero on wide Android viewports.
5. **Audience-delivery kit** (strategy): per warm audience, build 2-3 shareable formats of the narrative + a GHL warm-up sequence for cold audiences.
6. **Intern brief from the brand-voice guide**: turn `act-brand-alignment` into a delegable mini-project playbook.
