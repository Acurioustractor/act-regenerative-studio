# ACT Codebase Structure

## Two Codebases, Different Purposes

### 1. **ACT Farm and Regenerative Innovation Studio** (This Directory)
**Purpose**: Main ACT hub site (act.place) - the ecosystem overview

**What Lives Here:**
- ✅ General ACT brand guidelines and skills
- ✅ Content for all projects (Empathy Ledger, JusticeHub, Goods, BCV, Harvest, Art)
- ✅ Mission statements and about pages
- ✅ Team bios (Ben & Nic)
- ✅ LCAA methodology
- ✅ Dual-entity structure explanations
- ✅ Cross-project navigation

**Key Files:**
```
ACT Farm and Regenerative Innovation Studio/
├── .claude/
│   └── skills/
│       ├── act-brand-alignment/          ← GENERAL ACT brand (all projects)
│       │   ├── SKILL.md
│       │   └── references/
│       │       ├── brand-core.md         ← Identity, LCAA, values, voice
│       │       ├── projects-ecosystem.md ← All seeds/projects
│       │       ├── land-practice.md      ← BCV details
│       │       └── content-structure.md  ← IA patterns
│       ├── ACT_SKILLS_SUMMARY.md         ← Documentation
│       └── dist/
│           └── act-brand-alignment-enhanced.skill
├── DRAFT_MISSION_AND_ABOUT.md            ← For main hub site
├── DRAFT_BIOS.md                         ← Ben & Nic bios
└── CODEBASE_STRUCTURE.md                 ← This file
```

**Use This For:**
- Writing content about ACT as an ecosystem
- Brand alignment across all projects
- Strategy documents
- Grant applications
- Partner communications
- Anything that mentions multiple ACT projects

---

### 2. **ACT Farm** (/Users/benknight/Code/ACT Farm/act-farm)
**Purpose**: Black Cockatoo Valley specific website - the land/farm site

**What Lives There:**
- ✅ Next.js website for ACT Farm / Black Cockatoo Valley
- ✅ Map feature with drone photos
- ✅ Residencies, June's Patch, accommodation pages
- ✅ Farm-specific deployment and monitoring skills
- ✅ Conservation-first messaging
- ✅ Site-specific technical documentation

**Key Files:**
```
act-farm/
├── app/                               ← Next.js pages
│   ├── page.tsx                       ← Homepage
│   ├── about/
│   ├── map/                           ← Interactive farm map
│   ├── residencies/
│   ├── junes-patch/
│   └── ...
├── .claude/skills/
│   ├── deploy-github.md               ← Farm deployment
│   ├── deploy-vercel.md               ← Farm deployment
│   ├── monitor-site.md                ← Farm monitoring
│   └── cli-automation.md              ← Farm CLI
├── README.md                          ← Farm site docs
├── PROJECT_SUMMARY.md
└── MAP_SETUP_GUIDE.md
```

**Use This For:**
- Black Cockatoo Valley website development
- Farm-specific content
- Map features
- Residency and accommodation details
- June's Patch program
- Conservation and land practice pages

---

## How They Relate

```
┌─────────────────────────────────────────────────┐
│  Main ACT Hub (act.place)                       │
│  "Regenerative Innovation Ecosystem"            │
│                                                  │
│  ┌─────────────┐  ┌─────────────┐               │
│  │  Empathy    │  │ JusticeHub  │               │
│  │  Ledger     │  │             │               │
│  └─────────────┘  └─────────────┘               │
│                                                  │
│  ┌─────────────┐  ┌─────────────┐               │
│  │   Goods     │  │  ACT Farm   │───────┐       │
│  │ on Country  │  │   / BCV     │       │       │
│  └─────────────┘  └─────────────┘       │       │
│                                          │       │
│  ┌─────────────┐  ┌─────────────┐       │       │
│  │ The Harvest │  │    Art      │       │       │
│  └─────────────┘  └─────────────┘       │       │
└──────────────────────────────────────────┼───────┘
                                           │
                                           │ Links to
                                           ▼
                         ┌─────────────────────────────────┐
                         │  ACT Farm Site                  │
                         │  (Black Cockatoo Valley Focus)  │
                         │                                 │
                         │  • Conservation-first land      │
                         │  • Interactive map              │
                         │  • R&D residencies              │
                         │  • June's Patch                 │
                         │  • Low-impact accommodation     │
                         └─────────────────────────────────┘
```

---

## Claude Skills Usage

### act-brand-alignment Skill
**Location**: Main hub `.claude/skills/act-brand-alignment/`

**When to Use:**
- ✅ Writing ANY ACT content (hub or project sites)
- ✅ Ensuring voice consistency
- ✅ Cross-project navigation
- ✅ Brand compliance
- ✅ Mission/vision statements
- ✅ Grant writing
- ✅ Partner communications

**Scope**: ALL ACT work across all projects

### Farm-Specific Skills
**Location**: ACT Farm `.claude/skills/`

**When to Use:**
- ✅ Deploying the ACT Farm website
- ✅ Monitoring farm site performance
- ✅ CLI automation for farm operations

**Scope**: Black Cockatoo Valley site only

---

## Quick Reference

**Working on main hub site content?**
→ Use: `ACT Farm and Regenerative Innovation Studio/`
→ Reference: `.claude/skills/act-brand-alignment/`

**Working on farm website code?**
→ Use: `ACT Farm/act-farm/`
→ Reference: Farm-specific skills

**Need ACT brand voice for ANY project?**
→ Use: `act-brand-alignment` skill from main hub
→ It covers ALL projects (Empathy Ledger, JusticeHub, Goods, BCV, Harvest, Art)

---

## File Organization Summary

| Content Type | Main Hub | ACT Farm |
|-------------|----------|----------|
| **ACT Brand Skill** | ✅ Lives here | ← References this |
| **Mission/Vision** | ✅ Lives here | Links to hub |
| **All Projects Overview** | ✅ Lives here | - |
| **BCV Specific Content** | Overview only | ✅ Full detail |
| **Team Bios** | ✅ Lives here | - |
| **LCAA Method** | ✅ Lives here | Applied here |
| **Farm Website Code** | - | ✅ Lives here |
| **Deployment Guides** | General | ✅ Farm-specific |

---

**Last Updated**: December 23, 2025
**Maintained By**: A Curious Tractor Team
