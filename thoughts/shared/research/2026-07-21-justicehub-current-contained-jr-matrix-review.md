---
date: 2026-07-21T15:44:52+08:00
researcher: Codex
git_commit: a54fc5aa5c3f0b362a0d818f58d6f7b97d2632e5
branch: wip/world-class-site-2026-06-13
repository: act-regenerative-studio
topic: "Current JusticeHub CONTAINED, justice reinvestment and Justice Matrix review"
tags: [research, justicehub, contained, justice-reinvestment, justice-matrix]
status: complete
last_updated: 2026-07-21
last_updated_by: Codex
---

# Current JusticeHub review

## Research question

What currently exists across CONTAINED, justice reinvestment and the Justice Matrix, and how should the ACT justice field story represent this work?

## Summary

JusticeHub is no longer accurately described as only a directory of alternatives. Three connected forms of public infrastructure now exist:

1. **CONTAINED makes the system felt.** It is a built and tested travelling artwork with a repeatable three-room encounter.
2. **Justice Reinvestment returns change to place.** It connects a national public-source record to protected local outcomes, evidence and owner-authorised publication.
3. **The Justice Matrix connects evidence to strategy.** It moves from a question through reviewed cases, campaigns, issues and governed evidence with visible trust states.

The shared narrative is: encounter opens attention, community authority defines change locally, and evidence helps strategy travel without flattening place.

## CONTAINED

### Current canonical surfaces

- `/Users/benknight/Code/JusticeHub/src/app/contained/page.tsx`
- `/Users/benknight/Code/JusticeHub/src/app/contained/tour/tour-content.tsx`
- `/Users/benknight/Code/JusticeHub/src/app/contained/experience/page.tsx`
- `/Users/benknight/Code/JusticeHub/src/app/contained/adelaide/page.tsx`
- `/Users/benknight/Code/JusticeHub/src/app/contained/adelaide-proof/page.tsx`
- `/Users/benknight/Code/JusticeHub/src/app/contained/about/page.tsx`
- `/Users/benknight/Code/JusticeHub/src/app/contained/how-it-works/page.tsx`
- `/Users/benknight/Code/JusticeHub/src/app/contained/stories/page.tsx`
- `/Users/benknight/Code/JusticeHub/src/app/contained/tour/`

The current post-Adelaide story is strongest in `/contained/adelaide-proof`: five days, three rooms, a thirty-minute encounter, real photographs, audience learning and the next-city host model.

The repeatable spine is:

- Room 1: detention becomes physical.
- Room 2: therapeutic practice and possibility.
- Room 3: the host place gives the room to local organisations already doing the work.

The current framing calls CONTAINED an art piece that travels and a third place. The art is the doorway. Local organisations are the answer behind it.

### Media

The strongest current visual proof is the real Adelaide record under:

- `/Users/benknight/Code/JusticeHub/public/images/contained/adelaide/`

Current campaign film and installation media are configured in:

- `/Users/benknight/Code/JusticeHub/src/content/campaign.ts`

Artificial-looking photorealistic assets have been deliberately moved to:

- `/Users/benknight/Code/JusticeHub/public/images/contained/_archived-ai-photorealistic/`

### Current inconsistencies and boundaries

`src/content/campaign.ts` predates the July post-Adelaide surfaces. It still contains future Adelaide language, old counters, campaign pressure language and earlier stage assumptions. Current public narrative should be taken from the July Adelaide pages.

The CONTAINED stories and voices APIs filter public rows but directly read Empathy Ledger tables rather than using the newer fail-closed syndication client. The canonical syndication implementation is:

- `/Users/benknight/Code/JusticeHub/src/lib/empathy-ledger/syndication.ts`

Raw interviews, private notes and identifiable material remain private unless consent and cultural review are clear.

## Justice Reinvestment

### Current public system

The route family under `/Users/benknight/Code/JusticeHub/src/app/communities/justice-reinvestment/` includes:

- National front door
- Map
- Directory
- Impact
- State of play
- Methodology
- How it works
- Public site dossiers
- Governed contribution
- Protected community workspaces

The current national registry has 42 records, 40 mapped and two off-map national bodies. All states and territories are represented. Thirty-four sites have enriched, source-linked dossiers.

Core data:

- `/Users/benknight/Code/JusticeHub/src/data/justice-reinvestment/sites.json`
- `/Users/benknight/Code/JusticeHub/src/data/justice-reinvestment/site-research.json`
- `/Users/benknight/Code/JusticeHub/src/data/justice-reinvestment/history.json`
- `/Users/benknight/Code/JusticeHub/src/data/justice-reinvestment/org-connections.json`

The strongest current public line is: **A community-governed public record of places, outcomes, evidence and shared learning across Australia.**

### Authority model

The core sequence is:

1. Public-source baseline
2. Protected community workspace
3. Locally named outcomes
4. Governed evidence
5. Owner-authorised edition
6. Optional shared learning

Source validation and community authority remain distinct. Platform administrators cannot publish for a community. Site-specific authority must match the lead organisation. Published snapshots are versioned, immutable and withdrawable.

Empathy Ledger story bodies are not copied into justice reinvestment tables. Story relationship and relevance are stored, while live permission is rechecked and fails closed.

Core implementation:

- `/Users/benknight/Code/JusticeHub/src/lib/communities/jr-workspace-auth.ts`
- `/Users/benknight/Code/JusticeHub/src/lib/communities/jr-site-authority.ts`
- `/Users/benknight/Code/JusticeHub/src/lib/communities/justice-reinvestment.ts`
- `/Users/benknight/Code/JusticeHub/src/lib/communities/stories.ts`
- `/Users/benknight/Code/JusticeHub/supabase/migrations/20260714124021_jr_outcomes_governance_contract.sql`

Hosted migration state, populated community editions and authenticated production journeys remain unverified from the local rereview.

## Justice Matrix

### Current public system

The Justice Matrix is an ask-first research and strategy tool. Its route family includes:

- Ask
- Explore
- Cases
- Campaigns
- Strategic issues
- Evidence
- Map
- Coverage
- Research
- Digest
- Playbook
- UN, refugee and youth lenses
- Contribution and feedback

Current hub:

- `/Users/benknight/Code/JusticeHub/src/app/justice-matrix/page.tsx`

Current operating explanation:

- `/Users/benknight/Code/JusticeHub/src/app/justice-matrix/how-it-works/page.tsx`

### Evidence and trust model

The Matrix connects cases, campaigns and resources through strategic issues and explicit case-campaign relationships. Trust has three visible states:

- Human reviewed
- Source checked
- Needs review

Machine-set verification does not count as human confirmation. Unreviewed holdings are withheld from answer synthesis. Faithfulness checks remove invalid citations and can only lower confidence.

Key sources:

- `/Users/benknight/Code/JusticeHub/src/lib/justice-matrix/verifier-display.ts`
- `/Users/benknight/Code/JusticeHub/src/lib/justice-matrix/faithfulness.ts`
- `/Users/benknight/Code/JusticeHub/src/app/api/justice-matrix/search/route.ts`
- `/Users/benknight/Code/JusticeHub/src/app/api/justice-matrix/ask/route.ts`
- `/Users/benknight/Code/JusticeHub/src/app/justice-matrix/ask/AskMatrixClient.tsx`

Search uses hybrid reciprocal-rank fusion across full-text and vector retrieval, with explicit degraded states. Answers show citations, confidence, trust, research trail, related issues and gaps.

External federation currently searches HUDOC and CourtListener live. Other sources are honest link-out or ingestion sources. Federated material remains a lead and does not ground answers until owned and reviewed.

### Current pitch state

The latest external-facing materials are:

- `/Users/benknight/Code/JusticeHub/output/justice-matrix/dla-piper-support-brief-2026-07-17.md`
- `/Users/benknight/Code/JusticeHub/output/justice-matrix/un-meeting-prep-2026-07-20.md`

They frame the product as an early guided research system seeking lawyer verification, canonical questions, coverage review and structured feedback. They do not claim proven UN adoption.

OHCHR jurisprudence ingestion remains permission-gated. Refugee lived-experience stories remain an explicit gap rather than a live feature.

## Visual language

JusticeHub's current visual system is refined brutalist or Civic Bauhaus:

- Warm black `#0A0A0A`
- Warm off-white `#F5F0E8`
- Reserved urgent red `#DC2626`
- Emerald for positive outcomes
- Space Grotesk and IBM Plex Mono
- Sharp ruled surfaces
- Large evidence numbers
- Minimal functional motion

Canon:

- `/Users/benknight/Code/JusticeHub/DESIGN.md`

Interaction is evidence movement rather than decoration: map marker to dossier to community workspace, question to cited answer, trust state on every record, issue timeline, case-campaign reinforcement and watch, save or return loops.

## ACT prototype update

The ACT justice field now presents the three connected systems as:

- Feel: CONTAINED
- Place: Justice Reinvestment
- Connect: Justice Matrix

It uses JusticeHub's Civic Bauhaus system inside the warmer ACT story family, and links each doorway to its canonical JusticeHub destination.

Implementation:

- `/Users/benknight/Code/act-regenerative-studio/src/app/prototypes/justice-field/justice-field-experience.tsx`
- `/Users/benknight/Code/act-regenerative-studio/src/app/prototypes/justice-field/story.module.css`
- `/Users/benknight/Code/act-regenerative-studio/src/app/prototypes/living-field/field-story.tsx`

## Open questions

- When will CONTAINED stories and voices use the canonical fail-closed syndication client?
- Which Adelaide reflection quotes have destination-specific provenance and approval records?
- What is the current hosted migration state for justice reinvestment owner publication?
- Which Justice Matrix records will receive the first human legal verification sprint?
- Which two support asks will become the send-ready Justice Matrix partner brief?
