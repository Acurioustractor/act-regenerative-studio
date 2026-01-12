---
title: Cultural Protocols
slug: cultural-protocols
website_path: null
excerpt: "OCAP principles and Indigenous data sovereignty"
status: published
last_updated: 2026-01-12
shareability: INTERNAL
---

# Cultural Protocols

Community authority comes first. Consent, cultural protocols, and local authority are non-negotiable. OCAP is enforced in code and practice.

> "Authority governs data and images. If Elders say wait, we wait. If a partner wants speed over safety, we slow down."

---

## OCAP® Principles

**Ownership, Control, Access, Possession** - The foundation of Indigenous data sovereignty.

### Ownership
- Communities own their cultural knowledge and stories
- Ownership cannot be transferred to ACT or third parties
- Legal structures reflect community ownership
- Blockchain provenance tracking (where appropriate)
- Exit = full data portability

### Control
- Communities control how data is collected, used, shared
- Granular consent at every level (story, media, usage type)
- Veto power over AI training, research, commercial use
- Right to withdraw consent at any time
- Community decides governance and access rules

### Access
- Communities decide who can access what and when
- Cultural protocols enforced by platform architecture
- Gender restrictions, sacred content, ceremonial knowledge
- Different access levels (public, community, elders, restricted)
- No backdoors or admin overrides

### Possession
- Communities physically possess data (export anytime)
- Self-hosting options available
- Backups owned and controlled by community
- No vendor lock-in
- Data remains with community if ACT shuts down

---

## Consent Architecture

### Granular Consent Levels

**Story-Level:**
| Level | Visibility |
|-------|------------|
| Private | Only me |
| Community | My organization |
| Restricted public | With cultural protocols |
| Public | Anyone can view |

**Media-Level:**
- Photo/video/audio separate consents
- Face visibility options
- Voice consent
- Location sharing
- Metadata stripping

**Usage-Type:**
- Research (yes/no, which types)
- Education (yes/no, which contexts)
- AI training (yes/no, which models)
- Commercial (yes/no, what terms)
- Media coverage (yes/no, which outlets)

**Temporal:**
- Time-limited sharing (expires after X months)
- Event-specific (only for this exhibition)
- Seasonal (cultural calendar-based)
- Revocable at any time

---

## Default Settings

**Default: Private**
- Opt-in to sharing, not opt-out
- Clear language, no legal jargon
- Visual icons for quick recognition
- Examples showing what each level means
- Warnings about irreversible actions

---

## Elder Review Workflows

### When Required
- Cultural knowledge or traditional practices
- Stories from or about elders
- Content touching sacred topics
- Wisdom quotes or teachings
- Historical or genealogical information

### Process
1. Storyteller flags for elder review
2. Notification to designated elder(s)
3. Elder reviews with cultural lens
4. Approval, edit request, or rejection
5. Storyteller notified of decision
6. Content only published after approval

### Compensation
- Elders compensated for review time
- Rate set by community, not ACT
- Payment before review begins
- Additional compensation for extensive edits
- Recognition in published content

---

## Cultural Safety Protocols

### Gender Restrictions

**Technical Enforcement:**
- User profiles include gender identity (optional, self-reported)
- Content flagged with gender restrictions (men's business, women's business)
- Platform blocks access based on profile + content flags
- Override requires elder approval
- Audit logs for compliance

**Cultural Contexts:**
- Men's and women's business (separate knowledge systems)
- Ceremonial restrictions
- Initiation-related content
- Sacred site information
- Traditional healing practices

### Sacred Content Protection

**What Qualifies as Sacred:**
- Determined by Traditional Owners, not ACT
- Ceremonial knowledge and practices
- Sacred site locations and details
- Ancestral stories with restricted sharing
- Objects of power or spiritual significance
- Certain plant, animal, or mineral knowledge

**Protection Mechanisms:**
- Marked as sacred = never AI trained, never public
- Access only by approved community members
- No screenshots, downloads, or copying
- Watermarked if visuals included
- Encrypted at rest with community-held keys

### Mourning Protocols

**Death and Mourning:**
- Respect for sorry business (mourning periods)
- Removal of deceased person's images/voice (if requested)
- Temporary or permanent content suppression
- Family consultation before any posthumous use
- Cultural timeline (not rushed)

---

## Language and Translation

### First Languages
- Support for Indigenous languages in platform
- Translation assistance (with cultural review)
- Language preservation as goal
- Community language authorities consulted
- Pronunciation guides and audio

---

## Data Sovereignty Implementation

### Self-Hosting Option
```
Community can deploy own instance:
- Docker container with full platform
- Community-controlled database
- Own domain and branding
- ACT provides setup support
- Data never leaves community servers
```

### Data Portability
```
Export formats:
- JSON (machine-readable)
- CSV (spreadsheet-friendly)
- PDF (human-readable)
- Original media files
- Full database dump available
```

### Federated Architecture (Future)
```
Community instances can connect:
- Share consented content across instances
- Maintain separate governance
- Cross-community search (with consent)
- Interoperable but independent
```

---

## Privacy-Preserving Analytics

### Aggregated Only
- Individual storyteller data never sold or shared
- Reports show community-level aggregates (10+ minimum)
- No re-identification possible
- Differential privacy techniques
- Community approval for any external research

### What's Tracked
- Community-level engagement (stories shared, views)
- Consent patterns (what sharing levels chosen)
- Platform usage (what features used)
- Impact metrics (community-defined)
- Technical performance (errors, speed)

### What's NOT Tracked
- Individual reading habits
- Personally identifiable browsing
- Tracking across websites
- Third-party analytics (Google, etc.)
- Advertising profiles

---

## Emergency Protocols

### If Sacred Content Accidentally Published
1. Immediately remove from all platforms
2. Notify community and affected parties
3. Apologize publicly and privately
4. Investigate how it happened
5. Update systems to prevent recurrence
6. Offer repair and compensation
7. Community decides next steps

### If Community Partnership Breaks Down
1. Stop all work immediately
2. Listen to community concerns
3. Offer mediation if appropriate
4. Honor exit clauses and handover
5. Ensure community retains all data and ownership
6. Publicly acknowledge breakdown (with community consent)
7. Document learnings
8. Respect community decision

---

*See also: [Governance](governance.md) | [ALMA Model](../04-story/alma-model.md) | [Empathy Ledger](../03-ecosystem/empathy-ledger.md)*
