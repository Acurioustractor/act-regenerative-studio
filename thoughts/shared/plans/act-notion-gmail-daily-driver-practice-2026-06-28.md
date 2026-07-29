# Plan - ACT Daily Driver Practice

**Date:** 2026-06-28
**Purpose:** create the repeatable practice for starting each day with the right work, not the loudest work.
**Status:** v1 practice scaffold. Built from read-only Notion, Gmail, and HighLevel calibration.

---

## Why this exists

ACT already has the pieces: Notion project/action/meeting/decision systems, Gmail live signals, HighLevel relationship/pipeline records, the Whole Picture horizon arc, and the Health / Wealth / Wise rhythm. The missing practice is the daily crossing point:

> What needs attention today, and how does it serve the week, month, year, and long horizon?

This practice keeps the daily read small enough to use and strong enough to feed the weekly, monthly, yearly, and 10+ year view.

---

## Verified calibration

### Notion

Read-only search/fetch confirmed these useful anchors:

- `ACT Portfolio Review - Urgency + Dashboard Process`
- `ACT Thinking`
- `A Curious Tractor - The Whole Picture`
- `ACT Agent Strategy - Data Estate & Notion Integration`
- Health / Wealth / Wise daily commitment language
- Existing daily, weekly, monthly, quarterly, annual, and horizon arc language

Key model already present:

- Notion is the human truth layer.
- Projects are the trunk.
- Actions, Decisions, Meetings, Opportunities, Artefacts, and Communications should link back to Projects.
- The Whole Picture is monthly founder-session material, not daily editing material.
- The horizon arc is: 5 years engines pay for themselves, 10 years network runs on its own revenue, 20 years the model is no longer ours, 30 years ACT is no longer needed.

### Gmail

Read-only label calibration on 2026-06-28:

- Inbox: 172 messages, 18 unread.
- Unread total across mailbox: 13,072 messages.
- Starred: 425 messages.
- Important: 9,528 messages.
- Drafts: 149 messages.

Practical conclusion: daily Gmail review must use bounded recent searches and relationship/action judgement. It cannot be a historical unread cleanup loop.

### HighLevel

Connector capability check confirmed HighLevel is currently search/fetch only in this environment.

Practical conclusion: daily HighLevel review can identify relationship and pipeline follow-up needs, but contact, tag, conversation, and opportunity changes should be queued as manual CRM actions unless write tools become available.

---

## Daily practice

**Timebox:** 20 minutes.

1. Name the horizon line today's work protects.
2. Check Notion:
   - Today's Must Do
   - This Week
   - Active Projects
   - Upcoming Meetings
   - Follow-up owed
   - Open Decisions
   - Funding deadlines
   - Comms needing approval
3. Check Gmail:
   - Recent inbox
   - Unread inbox direct asks
   - Starred/important recent items
   - Invoices/attachments/admin notices
   - Drafts that block today
4. Check HighLevel:
   - Recent and project-tagged contacts
   - Warm leads and open opportunities
   - Conversations that may need response
   - Pipeline records with no clear next step
   - Tag/source/data hygiene issues
5. Map every meaningful signal to a Project, relationship, deadline, or parking bucket.
6. Pick three commitments:
   - Delivery
   - Relationship / funding
   - Thinking / writing / design
6. Record unknowns separately.

**Done when:** Ben or Nic can start the day without opening raw inbox and dashboard lists again.

---

## Midday correction

**Timebox:** 5-10 minutes.

- Did anything new arrive that changes today?
- Is a commitment blocked?
- Should the day switch from doing to deciding?
- Does a Gmail or HighLevel signal need to become a Notion Action, Decision, Meeting, Opportunity, Artefact, Communication, or manual CRM action?

**Done when:** the day is either confirmed, consciously changed, or reduced.

---

## End-of-day harvest

**Timebox:** 10 minutes.

- What shipped?
- What moved?
- What is blocked?
- Who needs a reply?
- What is tomorrow's first action?
- Which Notion records need owner/date/status cleanup?

**Done when:** tomorrow has a first move and today's live threads are replied to, waiting, or captured.

---

## Weekly practice

**Timebox:** 45 minutes, Monday preferred.

- Review the week as a pattern, not a pile.
- Choose one move per lane:
  - To Us
  - To Down
  - To Grow
  - To Others
- Confirm the top project priorities.
- Review upcoming meetings and funding deadlines.
- Prune stale work: merge, park, rename, or close.
- Promote real Gmail signals into Notion records.
- Tag the week to a horizon line.

**Done when:** there are no more than seven live weekly actions and one move per lane.

---

## Monthly practice

**Timebox:** 90 minutes, founders' session.

- Edit the Whole Picture here, not during the daily scan.
- Review money truth, lane drift, founder roles, entity/structure issues, and open joint decisions.
- Review Gmail, Notion, and HighLevel patterns: reply debt, project sprawl, stale meetings, pipeline drift, unmapped signals.
- Decide what stops.
- Log joint decisions within 24 hours.

**Done when:** the next month has a small set of active bets and the decisions are written down.

---

## Quarterly and yearly practice

### Quarterly

- Correct one paragraph of the horizon arc.
- Run the handover test on one project.
- Review R&D evidence, funding pipeline, money truth, and pile mix.
- Ask what has become extractive, noisy, or founder-dependent.

### Yearly

- Review yearly goals, quarterly sprints, key results, and the Whole Picture.
- Decide primary bets, seasonal bets, and what must be handed over or sunset.
- Reconfirm the 5-year line.
- Revise the proposed 10/20-year lines if the work has learned something true.

**Done when:** the year plan names what ACT will not carry.

---

## Daily driver output

```markdown
# ACT Daily Driver - YYYY-MM-DD

## Read
- Health:
- Wealth:
- Wise:
- Relationship / inbox:
- Horizon line:

## Three Commitments
1. Delivery:
2. Relationship / funding:
3. Thinking / writing / design:

## Hard Gates

## Gmail
- Urgent:
- Needs reply soon:
- Waiting:
- FYI / archive candidates:
- Drafts to review:

## HighLevel
- Relationship follow-up:
- Pipeline moves:
- Data hygiene:
- Manual CRM actions:

## Notion
- Actions:
- Meetings:
- Decisions:
- Opportunities:
- Comms:
- Artefacts:

## Project Pulses

## Horizon Roll-Up
- This week:
- This month:
- This quarter:
- This year:
- 5 / 10 / 20 / 30 year line:

## Unknowns
```

---

## Anti-sprawl rules

- Three daily commitments maximum.
- Seven weekly live actions maximum.
- No historical Gmail cleanup inside the daily loop.
- No duplicate Notion databases.
- No schema change until repeated review shows a real decision gap.
- No automation for relationship, consent, cultural protocol, or public commitment decisions.

---

## Agent support

The repo-local skill has been updated:

- `.agents/skills/act-daily-driver/SKILL.md`
- `.agents/skills/act-daily-driver/references/notion-operating-model.md`
- `.agents/skills/act-daily-driver/references/gmail-operating-model.md`
- `.agents/skills/act-daily-driver/references/highlevel-operating-model.md`
- `.agents/skills/act-daily-driver/references/daily-output-template.md`
- `.agents/skills/act-daily-driver/references/approved-actions-protocol.md`
- `.agents/skills/act-daily-driver/references/loop-workflow-spec.md`

Use it by asking for the `ACT Daily Driver` or by asking for a daily Notion/Gmail/HighLevel review, inbox/action triage, relationship/pipeline sweep, weekly review, or horizon planning scan.
