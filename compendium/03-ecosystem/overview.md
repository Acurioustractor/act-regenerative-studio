---
title: Ecosystem Overview
slug: ecosystem
website_path: /ecosystem
excerpt: "Outputs carry infrastructure. Expressions carry culture. We need both."
status: published
last_updated: 2026-01-26
---

# ACT Ecosystem Dashboard

**6 core platforms | 5 integrations | 1 unified data layer**

---

## Platform Health Status

| Platform | Status | Health | Domain | Quick Links |
|----------|--------|--------|--------|-------------|
| **ACT Studio** | Active | 67/100 | [act.place](https://act.place) | [Details](./projects/act-regenerative-studio.md) |
| **Empathy Ledger** | Critical | 47/100 | [empathyledger.com](https://empathyledger.com) | [Details](./projects/empathy-ledger.md) |
| **JusticeHub** | Critical | 47/100 | [justicehub.com.au](https://justicehub.com.au) | [Details](./projects/justicehub.md) |
| **The Harvest** | Healthy | -- | [theharvestwitta.com.au](https://theharvestwitta.com.au) | [Details](./projects/the-harvest.md) |
| **Goods on Country** | Critical | 47/100 | [goodsoncountry.au](https://goodsoncountry.au) | [Details](./projects/goods.md) |
| **ACT Farm** | Active | -- | Integrated with Studio | [Details](../02-place/act-farm.md) |

---

## Integration Layer

```
┌─────────────────────────────────────────────────────────────────────┐
│                     ACT ECOSYSTEM ARCHITECTURE                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  PLATFORMS                           SHARED SERVICES                │
│  ┌───────────────────────────┐      ┌───────────────────────────┐  │
│  │ ACT Studio (Hub)          │      │ Supabase (Data)           │  │
│  │ └─ Compendium + Wiki      │◄────►│ └─ ghl_contacts (867)     │  │
│  │ └─ Admin Dashboard        │      │ └─ agent_proposals (37)   │  │
│  │ └─ Media Gallery          │      │ └─ projects (77)          │  │
│  ├───────────────────────────┤      │ └─ goals (47)             │  │
│  │ Empathy Ledger            │      │ └─ communications (8468)  │  │
│  │ └─ Stories + Consent      │◄────►├───────────────────────────┤  │
│  │ └─ Elder Review           │      │ GoHighLevel (CRM)         │  │
│  │ └─ Content Hub            │      │ └─ 867 contacts           │  │
│  ├───────────────────────────┤      │ └─ 8 pipelines            │  │
│  │ JusticeHub                │      │ └─ 46 opportunities       │  │
│  │ └─ Research Platform      │◄────►├───────────────────────────┤  │
│  │ └─ Service Directory      │      │ Xero (Finance)            │  │
│  │ └─ Contained Program      │      │ └─ $47K net position      │  │
│  ├───────────────────────────┤      │ └─ $156K receivable       │  │
│  │ The Harvest               │      │ └─ Project tracking       │  │
│  │ └─ Events + Calendar      │◄────►├───────────────────────────┤  │
│  │ └─ Business Directory     │      │ Notion (Projects)         │  │
│  │ └─ CSA Program            │      │ └─ 77 active projects     │  │
│  ├───────────────────────────┤      │ └─ Sprint planning        │  │
│  │ Goods on Country          │      │ └─ Documentation          │  │
│  │ └─ Asset Tracking (389)   │◄────►├───────────────────────────┤  │
│  │ └─ QR Code System         │      │ Command Center (API)      │  │
│  │ └─ Community Alerts       │      │ └─ 13 agents registered   │  │
│  └───────────────────────────┘      │ └─ 37 pending proposals   │  │
│                                     └───────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Overview

### GHL Pipelines by Project

| Project | Pipeline | Tags | Contact Field |
|---------|----------|------|---------------|
| ACT Studio | ACT Studio | act, studio, farm, retreat | -- |
| Empathy Ledger | Storytellers | storytelling, empathy, elder, indigenous | is_storyteller |
| JusticeHub | Justice | youth-justice, justicehub, contained | -- |
| The Harvest | Harvest | harvest, witta, csa, events | -- |
| Goods on Country | Goods | goods, beds, washers, assets | -- |

### Xero Tracking Categories

| Project | Category | Project Codes |
|---------|----------|---------------|
| ACT Studio | ACT | ACT-CORE, ACT-ADMIN |
| Empathy Ledger | EL | EL-CORE, EL-CONTENT |
| JusticeHub | JH | JH-CORE, JH-CONTAINED |
| The Harvest | HARVEST | HARVEST-CSA, HARVEST-VENUE, HARVEST-EVENTS |
| Goods on Country | GOODS | GOODS-BEDS, GOODS-WASHERS, GOODS-MAINT |

---

## Supabase Projects

| Platform | Project ID | Tables | Key Features |
|----------|------------|--------|--------------|
| ACT Studio | tednluwflfhxyucgwigh | ~50 | Wiki, media, GHL sync |
| Empathy Ledger | yvnuayzslukamizrlhwb | 207 | pgvector, 364 RLS policies |
| JusticeHub | main + yjsf + qjt | ~30 | Multi-instance, ChromaDB |
| The Harvest | custom-instance | ~10 | Edge functions, Drizzle |
| Goods on Country | goods-tracker | ~10 | Asset tracking, alerts |

---

## Quick Actions

### Relationship Management
- **Hot contacts (234):** Need immediate attention
- **Warm contacts (412):** Maintain relationship
- **Cool contacts (221):** Re-engage or archive

→ [People Dashboard](/people)

### Project Status
- **Listen phase:** 12 projects
- **Curiosity phase:** 8 projects
- **Action phase:** 43 projects
- **Art phase:** 14 projects

→ [Projects Dashboard](/projects)

### Agent Inbox
- **Pending proposals:** 37
- **Agents registered:** 13

→ [Agent Dashboard](/system)

---

## Platform Philosophy

We work in two layers: **Outputs** and **Expressions**.

Outputs carry infrastructure. Expressions carry culture. We need both.

### Outputs (Core Projects)

| Output | Purpose |
|--------|---------|
| **ACT Studio** | Central hub and coordination |
| **Empathy Ledger** | Consent-centred, community-controlled storytelling |
| **JusticeHub** | Justice infrastructure centred on community authority |
| **Goods on Country** | Community-owned manufacturing |
| **The Harvest** | Community enterprise hub |
| **ACT Farm** | Land practice and studio |

### Expressions (How People Experience the Work)

| Expression | Description |
|------------|-------------|
| **Residencies & Workshops** | Time on Country, skills development |
| **Events & Gatherings** | Community connection, seasonal celebrations |
| **Artworks & Exhibitions** | Making change felt, not abstract |
| **Seasonal Moments** | Harvest gatherings, working bees |
| **Making Roles** | Practical building and making |
| **Enterprise Pathways** | Manufacturing, support through Goods |
| **Justice & Storytelling Pathways** | Centring lived experience |

---

## Platform Interconnections

```
           OUTPUTS                    EXPRESSIONS
    ┌─────────────────┐          ┌─────────────────┐
    │ ACT Studio      │◄────────►│ Coordination    │
    │ Empathy Ledger  │◄────────►│ Story Events    │
    │ JusticeHub      │◄────────►│ Justice Programs│
    │ Goods on Country│◄────────►│ Making Pathways │
    │ The Harvest     │◄────────►│ Gatherings      │
    │ ACT Farm        │◄────────►│ Workshops       │
    └─────────────────┘          └─────────────────┘
            ↓                            ↓
    Infrastructure                   Culture
    (can be forked)              (must be lived)
```

### Empathy Ledger as Core Impact Tool
- Stories from across all projects flow through Empathy Ledger
- Consent and cultural protocols managed centrally
- ALMA signals tracked at story level
- Evidence base for all projects

### Registry System
Each project exposes a standardized `/api/registry` endpoint:

| Project | Registry Content |
|---------|-----------------|
| ACT Studio | Ecosystem metadata |
| Empathy Ledger | Consented public stories |
| JusticeHub | Forkable justice programs |
| Goods on Country | Product catalog, asset status |
| The Harvest | Events and CSA shares |

---

## 2026 Focus Areas

1. **Land stewardship with shared governance**
   - Conservation-first baseline
   - Co-stewardship groundwork

2. **Innovation studio and product work**
   - Tools for community ownership
   - Clarity, simplicity, handover readiness

3. **The Harvest as grounded enterprise**
   - Micro-enterprise and maker pathways
   - Community connection through practical enterprise

4. **Goods on Country manufacturing**
   - Pilots to reliable production
   - Community ownership non-negotiable

5. **Story and evidence**
   - Storytelling as infrastructure
   - ALMA and Empathy Ledger alignment

---

## The A Curious Tractor Platform

A Curious Tractor names ACT's platform expression. It is how we build tools communities can own, adapt, and outgrow.

**Characteristics:**
- Shared capacity that can attach to many implements
- Can be unhitched, repaired locally, and left behind
- Design for handover, not dependency
- Systems that are forkable and transferable

---

## Agentic Support

### Current Agents (13 registered)

| Agent | Domain | Purpose |
|-------|--------|---------|
| Ralph | Orchestration | Task coordination, priority management |
| Scout | Research | Codebase exploration, pattern finding |
| Scribe | Documentation | Handoffs, session summaries |
| Ledger | Finance | Transaction categorization, reconciliation |
| Cultivator | Relationships | Follow-up suggestions, engagement tracking |
| Shepherd | Project | Progress tracking, blocker identification |
| Oracle | External | Web research, API integration |
| Herald | Release | Changelog, version management |
| Dispatcher | Support | Task routing, queue management |
| Reviewer | Quality | Proposal review, approval workflow |
| Chronicler | History | Session analysis, precedent lookup |

### Proposal Workflow

```
Agent creates proposal
        ↓
Human reviews in inbox
        ↓
    ┌───┴───┐
 Approve   Reject
    ↓         ↓
 Execute   Archive
    ↓
 Learn from outcome
```

---

*See also: [ACT Studio](./projects/act-regenerative-studio.md) | [Empathy Ledger](./projects/empathy-ledger.md) | [JusticeHub](./projects/justicehub.md) | [The Harvest](./projects/the-harvest.md) | [Goods](./projects/goods.md)*
