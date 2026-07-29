<!-- Generated 2026-05-29 via the confessions-launch-content-engine workflow (12 agents, claims verified against the codebase). file:line citations are as of that date. -->

# A Curious Tractor: the content and campaign strategy

## 1. Executive summary

The thesis is one sentence: **the Confessions gold phone is the front door, the consent-carried stories are the proof, and the Substack to Empathy Ledger to site engine is how it compounds.**

A Curious Tractor has built a campaign that holds up under a sceptical reading. "Not anti-philanthropy. Anti-pretending." owns the critique of the sector without burning the room it needs. The gold phone (`+61 (0) 2 8503 4273`) is the provocation that gives a funder, a grantee, or a journalist a reason to act. The film, the history spine (Prometheus in chains, tzedakah's justice-root, the langar floor), and the share cards are the production weight that says this is serious work, not an off-hand remark. The five flagship projects each carry the confession they answer, already shipped and rendering on the homepage (`page.tsx:195`), so the critique resolves into proof:

- Empathy Ledger answers "Funders make you perform gratitude for your own story."
- JusticeHub answers "Programs die the day the grant ends."
- Goods answers "Communities are treated as beneficiaries, never owners."
- The Harvest answers "Nobody funds the unglamorous infrastructure that actually holds."
- Black Cockatoo Valley answers "Impact is a glossy PDF, not a thing that lives in the ground."

The proof has to be carried with consent, or the campaign indicts itself. The consent-carried story layer (the utopia-may-2026 packet, the per-block consent gating in `story-packets.ts`, the redaction firewall on Confessions) is not decoration. It is the demonstration that A Curious Tractor does the opposite of what philanthropy confessed it does. A community voice shipped under a generic byline, an empty inbox dressed as a live feed, a published wiki that leaks finance: each is the exact pretending the campaign names. So the entire build-out is governed by one rule: **nothing goes live that pretends.** Every trigger in this document is a real-world fact becoming true, never a date arriving.

The compounding mechanism is the content engine. Essays and the sector argument are canonical on Substack, where the subscriber graph and reading habit live. Community and storyteller voice is canonical on Empathy Ledger, the consent system of record, where the right to withdraw is enforced. The site is the hub that indexes both, never a third mirror. Substack feeds Empathy Ledger, Empathy Ledger feeds the site through the build-time sync that already runs. Field Notes (newsletter) and a disciplined social cadence are how each piece reaches the room. One front door, one proof, one engine, three honest surfaces.

One honesty call sits above everything and must be settled before launch week: **the line must answer and the greeting must play, and Queensland Philanthropy Week's dates must be confirmed** (neither is recorded in the repo). If the Dialpad line is not live, the campaign still launches, but it pivots to lead with the film and the Friday playback, and the phone becomes Phase 2. Publishing a number that rings out would break the thesis on day one.

---

## 2. Content-flow architecture

How one piece of content moves through the system, end to end. Three intake lanes, one consent gate, one hub, two distribution rails.

A note on the term used below: "Empathy Ledger" is written in full in prose. In the diagram it is shortened to keep the columns aligned, but it always means Empathy Ledger, the consent system of record. There is no separate "EL" entity.

```
                          A CURIOUS TRACTOR CONTENT FLOW
                          ==============================

  INTAKE LANE 1: THE PHONE (the front door, the provocation)
  ---------------------------------------------------------
   Caller dials +61 (0) 2 8503 4273
        |
        v
   Dialpad voicemail  --->  CONSENT FIREWALL  --->  themed (7 categories)  --->  VoicemailInbox
   (real voice)             strip caller-ID +        money/power/forms/            on /confessions
                            PII, human approval,     shame/hope/breakthrough/      (IS_MOCK=false
                            redact (the cream         the weird                     once 8-10 real)
                            [REDACTED] block)              |
                                                           v
                                                   FRIDAY PLAYBACK
                                                   read back, anonymous,
                                                   themed, said out loud
                                                   (THE recurring hero moment)
                                                           |
                          +--------------------------------+
                          |                                |
                          v                                v
                   newsletter (list first)          social (public, after)
                          |
                          v
   BRIDGE TO LANE 3 (the one path the diagram must name):
   a caller who later gives explicit narrative consent to expand a confession
   into a named story is routed into Lane 3, re-consented from scratch, and the
   story becomes Empathy-Ledger-canonical. The anonymous confession stays as it
   was; the named story is a new, separately consented artefact. Absent that
   fresh narrative consent, a phone confession never becomes a named story.


  INTAKE LANE 2: THE ESSAY (the argument, the history spine)
  ---------------------------------------------------------
   Idea on editorial calendar
   ("does this name a real person?" -> NO, anonymised/abstract)
        |
        v
   Written in ACT voice  --->  brand gate  --->  PUBLISH ON SUBSTACK (canonical)
   (Curtis compression,        (act-brand-              |
    no em-dashes)               alignment)              +--> sent to Substack subscribers
                                                        |
                                                        v
                                          mirrored into Empathy Ledger as an
                                          editorial record (registry/index, NOT
                                          a second canonical):
                                          canonicalSource='substack',
                                          canonicalUrl=<substack post>,
                                          relatedProjects tagged
                                                        |
                                                        v
                                          build-time sync-el-editorial.mjs
                                          (no runtime Empathy Ledger calls)
                                                        |
                                                        v
                                          SITE /blog renders EXCERPT + POINTER
                                          ("Read the full piece on Substack")
                                          canonical points OFF-SITE, never self


  INTAKE LANE 3: THE STORY (the proof, named people/community)
  -----------------------------------------------------------
   Idea on editorial calendar
   ("does this name a real person?" -> YES)
        |
        v
   EMPATHY LEDGER FIRST (canonical)  --->  consent cleared, attribution set,
   storyteller owns it, can withdraw       voices block consent='cleared'
        |
        v
   build-time sync into the site
        |
        v
   SITE /stories renders the story packet
   (full body only because a packet is site-origin structured doc;
    a person-voiced Empathy Ledger reprint stays excerpt+pointer)
        |
        v
   ONLY THEN may an excerpt travel to Substack/social, by reference, never copying the canonical


  THE HUB AND THE RAILS
  ---------------------
   /confessions  <----cross-link---->  /stories  <----cross-link---->  flagship project pages
   (provoke)                           (prove)                          (the built answer)
        |                                  |                                   |
        +----------------------------------+-----------------------------------+
                                           |
                          DISTRIBUTION RAIL A: Field Notes (newsletter)
                          monthly baseline + Friday daily burst during QPW
                          capture: NewsletterForm -> /api/forms/submit -> GHL (Audience: tag)
                                           |
                          DISTRIBUTION RAIL B: social
                          LinkedIn (primary, the funder room) + email + IG + X
                          one channel leads each day, the others echo
```

The single most important property: **the site is never the search-canonical for syndicated prose.** Today it is, by accident (`site.ts:58` sets `canonical: path`), which is the live duplication bug. The engine fixes that so the hub indexes and points, and the canonical equity compounds on Substack (essays) or Empathy Ledger (stories), never split three ways.

---

## 3. Launch week, day by day

Pinned to Queensland Philanthropy Week, Monday to Friday, Brisbane time. The principle: **one channel leads each day, the others echo. Never fire everything at once.** Each day sets up the next, so by Friday people are waiting for the playback. The editorial thread is the operator-chair concept already on the page: each day someone sits with what came through. The "guest" can be the day's framing if no one is booked.

**Tier 0, settle before Monday or it is theatre:** confirm Queensland Philanthropy Week's dates and pin this sequence to them; and call `+61 (0) 2 8503 4273` and hear the recorded greeting. If the line is not live, run the pivot (lead with the film Monday, stories Wednesday, Friday playback as a reading of the labelled sample confessions). Do not publish a number that rings out.

### Monday: open the line (Provoke). Theme: the phone exists.
- **07:00 Newsletter (lead).** To the existing list. The Prometheus lede: "The first philanthropist was a god in chains." Body: the sector says a lot it never says out loud, so we built a gold phone, call it, the honest version drops Friday. One link to `/confessions`. This is the day's anchor.
- **09:00 LinkedIn (the funder room).** The "anti-pretending" framing as a standalone, plus the number and the film thumbnail. Lead the day here because this is the platform that matters most to the audience.
- **12:00 X.** The sharpest teaser confession standalone (m06, the catering line: "The catering at the launch cost more than our entire volunteer budget for the year. I counted."). No commentary. The share card carries the number when shared.
- **All day.** Every channel ends with one instruction: call the number.

Monday opens with provocation and action, holding the film as Tuesday's payoff so the week has a second beat.

### Tuesday: show the film (Provoke deepens). Theme: what the phone is part of.
- **08:00 The film leads everywhere.** Native upload to LinkedIn and X (platforms suppress outbound links and reward native video), captions burned in. Caption: "We built a gold phone for philanthropy. Here is why." Link to `/confessions`.
- **12:00 Instagram.** The film poster still plus the langar image-line as a carousel: "Everybody on the same floor. No charity case. That used to be what giving meant."
- **15:00 Reply, do not broadcast.** Whoever runs channels spends the afternoon replying in-thread to Monday and Tuesday posts. The operator-chair ethos applied to social.

### Wednesday: prove it (Prove). Theme: we built the answer, not just a place to confess.
This is the pivot from art to ecosystem, the day the stories carry the load.
- **08:00 Newsletter beat two.** Short. "Three confessions the sector left on voicemail, and what we built instead." Pair three flagship captions with their projects: gratitude-performance to Empathy Ledger; programs-die to JusticeHub; beneficiaries-never-owners to Goods and the utopia-may-2026 story. Link the third directly to `/stories/utopia-may-2026`. This is the cross-link doing its job.
- **10:00 LinkedIn (the proof post).** The m03 confession ("We needed the grant, so I said nothing.") paired with the `answer` share card and one sentence: "This is the power asymmetry we designed against. Here is the consent-first alternative." Link to `/stories`. Built to be shared by a sympathetic funder into their own network.
- **14:00 The story layer goes from invisible to invited.** If the utopia packet can clear even one consent-cleared voice block, promote it from `public-preview` to `published` (removes `noIndex`). If not, keep it `noIndex` and lead people there by hand from the newsletter and posts.

### Thursday: build the room for Friday (Invite). Theme: tomorrow we play it back.
- **08:00 The Friday hook everywhere.** Verbatim from the page: "The honest version drops Friday. At the end of the week we play it back. Anonymous, themed, said out loud. Not a survey. Not an acquittal." Drive every channel to the `/confessions` newsletter opt-in.
- **11:00 LinkedIn event-style post.** Name the time the playback drops. Treat it as an appointment: "Friday, [time]. We read back what philanthropy confessed this week."
- **15:00 Last call for the phone.** "The line is open until Friday morning." Queensland Philanthropy Week's clock makes the call-to-action expire.
- **Behind the scenes.** Moderation happens today: theme the week's confessions into the seven categories for the read.

### Friday: play it back (THE HERO MOMENT). Theme: said out loud.
Not a number ticking up, not the film. The honest version, read back, themed, anonymous, out loud. It is the one thing the campaign can do for real this week, and it resolves the whole arc.
- **The playback is a recorded reading**, themed by the seven categories, redacted where needed. If a real operator-chair guest can be there (a grantee, a funder honest on the record, a historian), that is the upside. If not, the reading carries it. It must ship Friday in some real form (a published page section or a short recording, at minimum). The promise was made Monday; breaking it on Friday kills the thesis.
- **09:00 Drops to the list first.** The week's opt-ins get it before social: "You asked to be in the room. Here is the honest version."
- **11:00 Public release.** LinkedIn and X carry the playback. Closing line: "This is not anti-philanthropy. It is philanthropy trying to remember its older self." Pair with the tzedakah insight.
- **All day.** Every share ends pointing at `/stories` and the flagships: this is what we do instead.

---

## 4. Channel programs (the essentials)

### Newsletter: Field Notes
**Keep the name.** It is already the word in the codebase. The promise: notes from the work, project updates, and consent-cleared stories, reaching you as they move from the work into the open. No noise. Step out any time.

**Two speeds, deliberately:**
- **Monthly Field Notes** is the permanent baseline: one field story, one method note, one real invitation. Value-first, earns the next open.
- **The Friday daily burst** runs only during Queensland Philanthropy Week (C-Mon through C-Sun below), then folds back to monthly automatically. Saying this up front prevents list fatigue.

**Welcome sequence (works today, off the existing `Newsletter` tag), one swapped paragraph at the end:**
- W0 (day 0) "You are in." Confirm in the promise language.
- W1 (day 4) "From Alice Springs (Mparntwe) to Utopia." The utopia-may-2026 packet, consent-first practice shown before any ask.
- W2 (day 11) "Listen first. Then the rest follows." The method in plain language: Listen, Curiosity, Action, Art.
- W3 (day 21) "One real next step." The single soft ask, branched by segment.

**Door-picker to segment map.** The 11 homepage chips collapse to five durable segments via one `Audience:` tag the form already sends verbatim (`NewsletterForm.tsx:59`):

| Chip(s) | Segment | `Audience:` tag | Project code |
|---|---|---|---|
| Partner | Partner | `partner` | ACT-IN |
| Support the work | Funder | `funder` | ACT-IN |
| Share a story | Storyteller | `storyteller` | ACT-IN |
| Find myself | Reader | `story-reader` | ACT-IN |
| Visit farm / Harvest / Have some fun | Visitor | `visitor` | ACT-BV / ACT-HV |
| See some art / Be an artist | Reader (art) | `story-reader` + `art` | ACT-AS |
| Buy a bed / washing machine | Goods buyer | `goods-buyer` | ACT-GD |

Segmented add-ons fire on the `Audience:` tag: Partner gets the one-pager then a real conversation with Ben or Nick; Funder gets confession-to-flagship then the consent-first proof (the Empathy Ledger demonstration that storytellers keep ownership of their own narrative, with attribution and the right to withdraw); Storyteller gets the consent-first explainer; Visitor gets the honest "enquiry is not a booking"; Goods buyer gets the waste-to-wealth object story.

A note on what the Funder add-on does not say: there is no headline "money-back" figure in this campaign, and inventing one would be the exact pretending the campaign indicts. Where a hard number is used, it is the verifiable Empathy Ledger result already on record, a 40% increase in grant success for partnered organisations, attributed as such and not generalised into a promise about A Curious Tractor itself.

**Campaign daily series** (only during QPW, only to `confessions-friday` opt-ins): C-Mon "The phone has been ringing." / C-Tue "Today the grantee answers." / C-Wed "A funder, honest on the record." / C-Thu "The catering cost more than our volunteer budget." (this is confession m06, the same line used on launch-Monday X and as starter essay #5; one artefact, three surfaces, identical wording) / C-Fri "The honest version. Said out loud." / C-Sun "What we heard. What we are keeping." (soft re-subscribe to monthly).

### Social
**Platform mix:** LinkedIn primary (the philanthropy sector lives there, the critique must reach the room it describes), email primary (the only channel where a call-to-action does not decay), Instagram secondary (the film and gold-phone object are visual), X secondary (the sharp one-line confessions are native). Out of scope: TikTok and Facebook (no vertical-video production beyond the one film, sector audience not there at decision density).

**Three core assets, repurposed:**
- **The film:** one file, four cuts. LinkedIn native full-length captions-burned, IG Reel 9:16 pinned, IG Stories 15-second teaser with number sticker, X native on Day 0. Poster is the static fallback.
- **The confessions:** the 16 sample lines are the editorial engine and survive the `IS_MOCK` flip because they are pre-shaped to the moderated output. The hard rule: **always carry the sample framing.** Frame as "the kind of thing the phone is collecting," never "a real call we received," until the flip. The redaction mechanic (m13) is itself a trust-signal post.
- **The share cards** (hook / answer / invite, stable 1200x630 URLs): hook = launch and evergreen, answer = the daily confession-to-project slot, invite = Friday and QPW-timing. Sharing `/confessions` auto-serves the hook card. Known cosmetic gap: cards render in system sans, not Fraunces.

**The week's spine on social:** Day 0 launch (film + hook), Day 1 history lede (Prometheus, tzedakah), Days 2-4 the confession-to-project thread (the campaign's actual argument, reusing `confessionBySlug`), Day 5 Friday playback, weekend the lineage post (The Confessional 2023, Gold.Phone 2024, Confessions 2026).

**Hard voice rules for whoever schedules:** no em-dashes anywhere (the single most identifiable AI tell and a hard ACT rule); "Listen, Curiosity, Action, Art" in full, never the bare acronym; sentence case, straight quotes, no decorative emoji, no hashtag stuffing; never present a sample confession as a real call; do not name operator-chair guests who are not booked.

---

## 5. Build-out roadmap (phased, with triggers)

Each phase has one explicit trigger. Do not start a phase until its trigger fires. Triggers are real-world signal (a recorded greeting, a booked guest, a consented profile), never calendar dates, because shipping fake liveness is the exact pretending the campaign indicts.

```
Phase 0  Make the line real
  trigger: launch week live (now)
  exit: gold phone answers in your hand + email opt-in capturing

Phase 1  First real Friday
  trigger: 8-10 real moderated confessions exist
  flip IS_MOCK=false; run 1 Friday by hand
  exit: 2 manual Fridays run; hand-moderation is the bottleneck

Phase 2  Operator-chair + playback becomes a system
  trigger: 2+ guests committed to named days
  weekly guest cadence; build moderation UI + Dialpad pipeline + voice-consent-gated audio
  exit: 4 consecutive real Fridays + 3 guest responses; queue steady-state

Phase 3  Widen into the 5 flagship stories
  trigger: Friday rhythm self-sustaining + 1 flagship has a cleared voice
  one packet per fortnight, Empathy Ledger -> JusticeHub -> Goods -> Harvest -> BCV
  each packet publishes only with 1+ consent-cleared voices block
  add bidirectional /confessions <-> flagship cross-links

        |-- /storytellers un-holds when 2+ consented EL profiles pass canDisplayStoryteller()
        |-- /wiki un-holds ONLY when sync glob bug fixed + finance/decisions visibility decided
        |-- /ask un-holds LAST: requires /wiki safe (corpus) + injection/cost review
```

**Phase 0, make the line real (launch week, days 1-3).** Confirm the Dialpad line answers and the greeting is recorded in a real human voice (not text-to-speech). De-duplicate the phone number: make `share-card.tsx:15` import `DISPLAY_NUMBER` from `CallCTA.tsx` instead of its own local `const NUMBER` (both currently hold `+61 (0) 2 8503 4273`, verified at `CallCTA.tsx:5` and `share-card.tsx:15`), because a number change during the campaign would silently desync the cards from the page. Load Fraunces into the OG `ImageResponse` cards (highest-leverage polish before a share push). Add the email opt-in on `/confessions` (`audience='confessions-friday'`). Record the QPW dates as a constant, not prose (three surfaces hard-code the peg). Explicitly NOT in this phase: flipping `IS_MOCK`. An empty inbox during the loudest week is worse than honest sample content labelled "sample messages while the line warms up."

**Phase 1, the first real Friday (next two weeks).** Trigger: 8-10 real moderated confessions exist (the flip is a one-liner; the content is the gate). Moderate by hand in a doc, not in code: a human transcribes, strips PII with the existing redaction convention, theme-tags, hand-writes into a new `confessions-real.ts` in the same `Confession[]` shape. Flip `IS_MOCK=false`. Run the first Friday as one email plus one social post, not a system. Audio stays optional (transcript-only is lower-risk; voice consent is a higher bar than transcript consent).

**Phase 2, operator-chair becomes a system (weeks 2-4).** Trigger: 2+ guests verbally committed to named days. Run one guest per week, not per day (daily burns the pool in five days). Sequence the archetypes the page already names, in order: grantee, then funder on the record, then historian, then someone consulted to exhaustion. Now build the tooling, sized to what two manual Fridays proved you need: a minimal admin moderation UI behind the existing `/admin` auth, the Dialpad webhook to strip-and-queue pipeline, and real audio playback gated on explicit consent-to-publish-voice, separate from transcript consent. The Dialpad pipeline and the moderation tooling are shared infrastructure, so they must not be built twice: the entry condition for this build is a decision record filed in `act-global-infrastructure` naming the owner and the shared-versus-local split (an issue or an ADR in that repo, assigned to a named person, not an open-ended "coordinate with"). No decision record, no Phase 2 tooling build.

**Phase 3, widen into the five flagship stories (the quarter).** Trigger: the Friday rhythm is self-sustaining AND at least one flagship has a consent-cleared community voice. The homepage already does the structural bridge (`confessionBySlug` at `page.tsx:195`, which already names all five flagship confessions); Phase 3 makes it bidirectional and deep, using the `utopia-may-2026` packet as the template. Roll out one flagship per fortnight in confession order: Empathy Ledger (the platform is the answer), JusticeHub (an existing transcript corpus to draw from, re-consented before any named use), Goods (the utopia packet already is this), The Harvest, Black Cockatoo Valley on Jinibara Country (Witta is the colonial locality name; Jinibara is the Country). **Per-flagship publish gate, applied five times:** a flagship moves from card-caption to full packet only when it has at least one consent-cleared `voices` block. No cleared voice, no published packet. This is non-negotiable: the campaign's credibility rests on not doing to community stories what it accuses philanthropy of doing.

A note on the transcript corpus: the launch audit records that the Empathy Ledger transcript sync currently exposes 106 transcripts (`website-launch-audit.md:215`), and the transcription workflow doc references a larger pool in the source table. That sync count is not a JusticeHub-specific number, and no per-project count is verified here, so Phase 3 treats it as "an existing corpus to draw from," not a headline figure. Any transcript used for a named story is re-consented from scratch through Empathy Ledger regardless of how many exist.

---

## 6. The content engine (Substack to Empathy Ledger to site)

**The canonical-source model, in one rule:** one body, one canonical URL; everywhere else is a pointer or a fragment.

| Content type | Canonical home | Why |
|---|---|---|
| Essays, sector argument, campaign think-pieces | **Substack** | The distribution surface with the subscriber graph; search and audience equity compound in one place. |
| Community/storyteller voice, anything naming a person | **Empathy Ledger** | Empathy Ledger is the consent system of record. A story about a person must be canonical where consent, attribution, and the right to withdraw are enforced. Never canonical on Substack. |
| Project-native pages, story packets | **This site** | A Curious Tractor's own structured documents, authored in `story-packets.ts`. |

A piece chooses its canonical at creation time, recorded as data (`canonicalUrl` plus a new `canonicalSource: 'substack' | 'empathy_ledger' | 'site'` field). Every other surface keys off that field. No surface decides canonical-ness at render time by accident, which is the bug today (`site.ts:58`).

**Substack does not get its own sync-to-site script.** It feeds Empathy Ledger, which already feeds the site through `sync-el-editorial.mjs` at build time. The site never learns Substack exists. This keeps one pipe, one snapshot, no second sync racing the first. The minimal additive changes: the Empathy Ledger payload gains `canonicalSource` and a real `canonicalUrl` (today `sync-el-editorial.mjs:441` hardcodes it to the Empathy Ledger URL, wrong for Substack-origin); `sync-el-editorial.mjs` reads `canonicalUrl` instead of synthesising it; `site.ts` gets a `canonicalOverride` param so `alternates.canonical` can point off-site; `/blog/[slug]` passes `canonicalOverride: post.canonicalUrl` whenever `canonicalSource !== 'site'` and renders excerpt-plus-pointer instead of full body for foreign-canonical pieces.

**Consent guardrails (the engine indicts itself if these slip):**
- **Consent is a routing gate at the idea stage, not a publish checkbox.** First question on every calendar entry: does this name, quote, or depict a real person or community? Yes routes to Empathy Ledger first; an anonymised redacted confession is not a person under consent and can travel freely. This single distinction governs the whole engine.
- **OCAP® (ownership, control, access, possession) applied to the pipe.** The community owns the story, Empathy Ledger holds the consent record, access by the site and Substack is granted and revocable through `visibility` and `syndicationDestinations`, never assumed.
- **Withdrawal must be a positive signal, not an absence.** `sync-el-editorial.mjs` keeps the previous snapshot on an Empathy Ledger fetch failure (`keepExistingSnapshot`, correct for uptime, wrong for consent): a storyteller who withdraws during an outage stays published. A withdrawal must be a tombstone the build honours even when Empathy Ledger is unreachable.
- **Attribution defaults to erasure, and must not.** The sync falls back to `authorName: 'ACT Team'` (`sync-el-editorial.mjs:417,461`). For a campaign whose thesis is that philanthropy takes stories without crediting people, shipping a community voice under a generic byline is the exact failure mode the campaign names. Treat a missing real author on a person-voiced piece as a publish-blocker.
- **Two consent regimes, kept separate.** Substack subscribe is marketing consent; Empathy Ledger storyteller consent is narrative sovereignty under OCAP®. A subscriber list implies no right over a storyteller's words. On the marketing side there is one wrinkle the plan must not gloss: the Substack hosted subscribe widget is not A Curious Tractor's `NewsletterForm`, so a consent checkbox cannot be added to it directly. There are two honest options, and the plan must pick one and say which: (a) rely on Substack's own double-opt-in and terms as the consent record for Substack-originated subscribers, and add the explicit checkbox only to `NewsletterForm` for site-originated subscribers; or (b) route all subscribe intent through `NewsletterForm` first (which carries the checkbox) and subscribe to Substack server-side after consent. Until that choice is made, do not describe the Substack subscribe path as having the same explicit checkbox the site form will have. Checklist item 5 fixes `NewsletterForm` only; the Substack side is closed by this decision, not by that item.

**Starter editorial calendar (8 themes, sequencing noted):** (1) The first philanthropist was a god in chains (Substack, lowest consent risk, lead the week); (2) We needed the grant, so we said nothing (Substack, but any named grantee voice routes to Empathy Ledger first); (3) Tzedakah: giving and justice share a root (Substack); (4) The langar: everybody on the same floor (Substack); (5) The catering cost more than our volunteer budget, opening onto Goods (Substack, anonymised confession only; this is the same m06 line used on launch-Monday X and in the C-Thu email, one artefact, identical wording on all three surfaces); (6) From Alice Springs (Mparntwe) to Utopia (Empathy Ledger, names the Oonchiumpa relationship, consent must clear, hold until cleared); (7) The cockatoo came back before the fence came down, Black Cockatoo Valley on Jinibara Country (Witta) (Substack, any community voice via Empathy Ledger); (8) The honest version drops Friday, the recurring QPW operator-chair spine. Lead with #1, run #8 daily through the week, hold #2 and #6 until their named voices clear consent. #3, #4, #5, #7 are essay-grade and ship as soon as they pass the brand gate.

---

## 7. Next two weeks: action checklist

Ordered. The canonical fix is sequenced before any Substack syndication. Launch week itself leads with the phone and the film, not a syndicated essay, so launch can run before the canonical fix lands; but the first Substack essay waits for it.

1. **Call `+61 (0) 2 8503 4273` and confirm it answers with the recorded human greeting.** If it does not, decide now: pivot the campaign to film-plus-Friday-playback and pull the phone CTA. Blocks the entire launch.
2. **Confirm Queensland Philanthropy Week's exact dates and record them as a constant** (not prose) in the repo, then pin the day-by-day sequence and the C-Mon to C-Sun email series to them. Blocks all scheduling.
3. **De-duplicate the phone number:** edit `src/lib/confessions/share-card.tsx:15` to import `DISPLAY_NUMBER` from `src/components/confessions/CallCTA.tsx`. One source before anything scales.
4. **Add the email opt-in to `/confessions`** using `NewsletterForm` with `audience='confessions-friday'`, copy: "We play the honest version back on Fridays. Leave an email if you want to hear it." Turns the campaign's biggest gap into the fastest-growing list segment.
5. **Add the explicit consent opt-in line (a checkbox, not implied) to `NewsletterForm`.** Note its limit: this closes the consent gap for site-originated subscribers only. Decide and record the Substack-side approach (rely on Substack double-opt-in, or route Substack subscribes through `NewsletterForm` first) per section 6; do not claim the Substack path has the same checkbox until that decision ships. Ethically blocks volume outreach on every other email item.
6. **Add one cross-link each way:** `/confessions` to `/stories` ("This is what we build instead. Stories, carried with consent.") and `/stories` back to `/confessions`. The Prove arc is a claim without this.
7. **Load Fraunces into the OG `ImageResponse` share cards** so they render in brand font before the social push. Highest-leverage cosmetic fix.
8. **Fix the canonical bug before publishing any syndicated Substack essay:** add `canonicalOverride` to `pageMetadata` in `src/lib/seo/site.ts` and gate `/blog/[slug]` full-body rendering on `canonicalSource === 'site'`. This must land before the first Substack essay (calendar #1). Launch week (item 10) does not depend on it, because launch leads with the phone and film, not a syndicated essay. Adding Substack as a third surface without this turns two-way duplication into three-way.
9. **Stand up the Layer 1 universal welcome (W0 to W3) in GoHighLevel** off the existing `Newsletter` tag. Works today, no code.
10. **Build the C-Mon to C-Sun daily series in GoHighLevel** off `audience='confessions-friday'`, and write the L1 launch announcement send.
11. **Run launch week** per section 3, leading with the Monday newsletter and the phone at 07:00 on the confirmed QPW Monday. The Substack essay does not lead launch; the phone and film do.
12. **Ship the first real Friday playback** in some real form (published section or short recording), to the list at 09:00 then public at 11:00. The Monday promise must not break on Friday.
13. **Begin hand-collecting and moderating real confessions** (transcribe, redact with the existing convention, theme-tag into `confessions-real.ts`) toward the 8-10 that trigger the `IS_MOCK` flip.
14. **Route the door-picker chips through capture landing pages** carrying the five `Audience:` values, then build the Layer 2 segmented branches. The durable held-audience layer; can follow the campaign.

---

## 8. Risks and the launch holds to respect

**The governing risk, stated once:** anything that pretends breaks the thesis. An empty inbox dressed as a live feed, a guest named who is not booked, a published voice without consent, a public wiki that leaks finance, an AI answering from a corpus that does not exist. "Anti-pretending" is both the campaign's promise and the gating logic for the entire build-out.

**Campaign risks:**
- **The central artefact cannot yet hold a real voice.** `IS_MOCK=true` shows 16 shaped sample confessions; flip it and you get a blank feed; there is no audio source and no Dialpad pipeline in this repo. Mitigation: launch in the true state (moderated public artefact, sample-labelled), make the Friday playback the hero, do not flip until 8-10 real confessions exist.
- **The line and the dates are unverified in the repo.** Both are Tier 0 pre-launch confirmations (checklist items 1 and 2). A number that rings out is the worst possible failure for this specific campaign.
- **Canonical duplication is live, not future.** `/blog/[slug]` renders full Empathy Ledger bodies and claims self-canonical while the same prose sits at empathyledger.com. Fix before adding Substack (checklist 8).
- **Attribution defaults to 'ACT Team'** and consent can be silently violated by the sync's resilience logic. Both covered in section 6; both are publish-blockers for person-voiced content.
- **Two capture lists, one consent gap with a Substack-shaped wrinkle.** Substack subscribe and `NewsletterForm` both grow audiences with no opt-in checkbox today. The site form is fixed by checklist 5; the Substack widget cannot take a checkbox directly and is closed by the section 6 decision instead. Do not treat the gap as fully closed until both halves are addressed.

**The three launch holds to respect** (held by 307 with `permanent: false` so they reverse cleanly; reversing means editing `config/launch-redirects.cjs`, `src/app/sitemap.ts`, and `scripts/check-launch-site.mjs` in lockstep):

- **`/storytellers`** (held until more than one consented profile is syndicated). Today the Empathy Ledger snapshot has exactly one storyteller (Uncle Dale) who would render as a bare profile. Un-holds when `sync-el-storytellers.mjs` pulls 2+ storytellers passing `canDisplayStoryteller()`. Downstream of Phase 3's Empathy Ledger work; reverse it when the second consented profile lands, not on a date. The fix lives in Empathy Ledger's data, not this repo's redirect.

- **`/wiki`** (the longest pole, may stay held all quarter). Binding constraint: `sync-canonical-wiki-pages.mjs` shares the glob bug that leaked internal R&D and finance content. Do NOT reverse the 307 until (a) the exclusion glob is fixed so internal/finance/decisions content cannot publish, and (b) a human decides which page classes are public. This is a content-safety gate that ranks above any roadmap pressure.

- **`/ask`** (held last, hard prerequisite chain). A public AI question-and-answer surface is only as safe as the corpus it answers from. Un-hold only after `/wiki` is safely public (so a vetted corpus exists) and a prompt-injection plus cost-ceiling review passes. Opening a public AI surface during a campaign about honesty, while it can hallucinate or be injected, is the worst possible timing. Sequence: `/wiki` safe, then corpus exists, then safety review, then un-hold. Next-quarter-or-later.

**The one rule that governs every hold and every trigger:** each reversal is a real-world fact becoming true (a second consented profile, a fixed exclusion glob and a visibility decision, a vetted corpus plus a passed safety review), never a date arriving.
