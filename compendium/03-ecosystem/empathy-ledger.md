---
title: Empathy Ledger
slug: empathy-ledger
website_path: /projects/empathy-ledger
excerpt: "Your story, your power, your profit"
image: /images/empathy-ledger-hero.jpg
status: published
last_updated: 2026-01-12
---

# Empathy Ledger

**"Your story, your power, your profit"**

Ethical storytelling platform where communities retain control over narratives and share in value created.

---

## The Problem

Current storytelling platforms extract value from communities:
- Stories shared without consent
- Used for others' profit
- Stripped of cultural context
- Controlled by corporations
- Indigenous and community knowledge commodified without compensation or respect

---

## Our Approach

Community-owned platform with:
- Consent-gated sharing
- Cultural protocol enforcement
- Blockchain-based ownership
- Value-sharing for storytellers
- OCAP® principles (Ownership, Control, Access, Possession) baked into architecture

---

## Target Audiences

| Audience | Description |
|----------|-------------|
| **Primary** | Indigenous communities and cultural heritage organizations |
| **Secondary** | Storytellers, elders, community historians |
| **Tertiary** | Researchers, educators, policymakers (with community permission) |

---

## Key Features

### Platform Capabilities
- Multi-tenant architecture (each community = separate tenant)
- Granular consent management (story, media, usage levels)
- Cultural protocol enforcement (gender restrictions, sacred content)
- Elder review workflows
- Blockchain provenance tracking
- Value-sharing mechanisms
- Data sovereignty guarantees
- Export and portability

### User Journeys

**Storyteller:**
Create account → Share story → Set consent preferences → Track usage → Receive compensation

**Community:**
Establish organization → Invite storytellers → Review content → Manage cultural protocols → Access analytics

**Public:**
Browse consented stories → Request additional access → Compensate storytellers → Respect restrictions

---

## Technical Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15.5.2, React 19.1.0, TypeScript |
| Styling | Tailwind CSS 4, shadcn/ui |
| Database | Supabase (PostgreSQL + RLS) |
| Auth | Supabase Auth (JWT-based) |
| Storage | Supabase Storage |
| AI | With community consent only |
| Blockchain | Story ownership provenance |

### Multi-Tenant Architecture
- Shared database with Row Level Security (RLS)
- Each organization = separate tenant
- Data sovereignty through RLS policies
- Compliance-ready (GDPR, Indigenous data sovereignty)

---

## Business Model

| Tier | Pricing | Features |
|------|---------|----------|
| Free | $0 | Individual storytellers, basic features |
| Community | $50-200/month | Organization features |
| Enterprise | Custom | White-label, advanced features |
| Transaction fees | Small % | Value-sharing payments |

**Impact Distribution:**
- 60% to storytellers
- 30% to platform operations
- 10% to commons fund

---

## 2026 Focus

1. **Strengthen consent workflows** and Elder review pathways
2. **Keep OCAP enforcement** non-negotiable
3. **Improve story stewardship** and community-led publishing
4. **Use Empathy Ledger as the core impact tool** across the ecosystem

---

## LCAA Application

**Listen:**
- Communities shared stories but feared extraction
- Cultural protocols not respected by existing platforms
- Storytellers wanted compensation and control
- Trust broken by previous researcher/journalist extraction

**Curiosity:**
- What if blockchain could prove story ownership?
- How might platform architecture enforce cultural protocols?
- Can consent be granular enough to respect complexity?
- What would value-sharing look like in practice?

**Action:**
- Built multi-tenant platform with RLS
- Implemented consent-gating at every level
- Created elder review workflows
- Integrated blockchain provenance
- Developed fair compensation model

**Art:**
- Stories themselves as art form
- Platform design as cultural respect
- User experience that honors protocols
- Documentation as participatory process

---

## Impact Goals

| Metric | Target (by 2027) |
|--------|------------------|
| Stories protected | 1000+ |
| Communities using platform | 100+ |
| Storyteller earnings | Meaningful income |
| Traditional knowledge | Respected and compensated |
| Model replication | Global |

---

## Success Metrics

- Stories created and shared
- Consent compliance rates
- Community satisfaction (NPS > 70)
- Revenue to storytellers
- Cultural protocol adherence

---

## Current Status

| Element | Status |
|---------|--------|
| Platform | Live at empathy-ledger-v2.vercel.app |
| Multi-tenant architecture | Complete |
| Consent system | Operational |
| Early adopter communities | Onboarding |
| Value-sharing | Pilot phase |

**Registry API:** `/api/registry` (consent-gated, bearer token required)

---

## Role as Core Impact Tool

Empathy Ledger is not just a platform—it's the core impact tool across the ACT ecosystem:

- **ALMA integration:** Stories carry ALMA signals for learning
- **Cross-project evidence:** Stories from JusticeHub, Goods, BCV all flow through
- **Consent infrastructure:** Handles consent for the entire ecosystem
- **Impact attribution:** Links stories to project outcomes

> Field note: Evidence is story, not surveillance. We do not profile people. We track system-level signals, learn from consented stories, and change practice in response.

---

*See also: [ALMA Model](../04-story/alma-model.md) | [Cultural Protocols](../05-operations/cultural-protocols.md) | [Overview](overview.md)*
