# ACT Claude Skills - Complete Guide

**Last Updated**: 2025-12-26
**Purpose**: Centralized guide to discover, choose, run, and manage all ACT Claude skills

---

## 🎯 Quick Start

### Run a Skill

**Method 1: Slash Command** (Fastest)
```
/act-brand-alignment
/ghl-crm-advisor
```

**Method 2: Natural Language** (Most Flexible)
```
"Use the brand alignment skill to help me write this page"
"I need GHL CRM advice for setting up a new pipeline"
"Apply ACT brand guidelines to this content"
```

**Method 3: Explicit Skill Invocation** (Most Formal)
```
Use skill: act-brand-alignment
Scope: Black Cockatoo Valley website
Task: Review homepage copy for brand alignment
```

---

## 📚 Available Skills

### 1. **act-brand-alignment** (Project Skill)
**Invoke**: `/act-brand-alignment` or mention "brand alignment" or "ACT voice"

**When to Use**:
- Writing ANY ACT content (web pages, marketing, grants, reports)
- Designing UI, visuals, or brand materials
- Planning information architecture
- Reviewing copy for voice/tone alignment
- Creating content for any ACT project

**What It Knows**:
- ✅ ACT identity & regenerative innovation mission
- ✅ LCAA methodology (Listen, Curiosity, Action, Art)
- ✅ Dual-entity structure (CLG + trading arm)
- ✅ All 8 ACT projects (Empathy Ledger, JusticeHub, BCV, Harvest, Goods, Art, etc.)
- ✅ Voice & tone guidelines (grounded yet visionary, poetic yet clear)
- ✅ Visual language (colors, typography, farm metaphors)
- ✅ Impact framework (community ownership, narrative sovereignty)

**Example Uses**:
```
"Use act-brand-alignment to write a homepage for Black Cockatoo Valley"
"Review this grant application for ACT voice consistency"
"What's the right tone for The Harvest vs BCV?"
```

---

### 2. **ghl-crm-advisor** (Project Skill)
**Invoke**: `/ghl-crm-advisor` or mention "GHL" or "CRM strategy"

**When to Use**:
- Planning CRM implementations
- Designing pipelines and workflows
- Creating email sequences and automation
- Troubleshooting GHL integrations
- Optimizing lead management
- Training team on GHL usage

**What It Knows**:
- ✅ All 4 ACT projects using GHL (Harvest, ACT Farm, Empathy Ledger, JusticeHub)
- ✅ Pipeline design patterns for each project
- ✅ Workflow automation strategies
- ✅ Tag organization systems
- ✅ Integration best practices
- ✅ Reporting & analytics setup
- ✅ Team coordination workflows

**Example Uses**:
```
"Use ghl-crm-advisor to design a pipeline for workshop bookings"
"How should we set up automation for The Harvest volunteers?"
"Create an email sequence for JusticeHub onboarding"
```

---

### 3. **act-knowledge-base** (In Development)
**Status**: Partially built, needs consolidation
**Purpose**: Living Wiki, knowledge extraction, multi-source integration

**Current Components**:
- Gmail knowledge scanner
- Notion knowledge scanner
- Calendar integration (designed, not built)
- Review queue system
- Auto-approval workflows

**Planned Skills**:
- Knowledge extraction guidance
- Source prioritization
- Review workflow optimization
- Timeline management

---

## 🗂️ Skill Organization System

### Directory Structure
```
.claude/
├── SKILLS_GUIDE.md (this file - your skills homepage)
├── settings.local.json (Claude Code settings)
├── skills/
│   ├── act-brand-alignment/
│   │   ├── SKILL.md (main skill definition)
│   │   ├── references/
│   │   │   ├── brand-core.md
│   │   │   ├── projects-ecosystem.md
│   │   │   ├── land-practice.md
│   │   │   └── content-structure.md
│   │   └── README.md (skill-specific docs)
│   │
│   ├── ghl-crm-advisor/
│   │   ├── SKILL.md
│   │   ├── QUICK-REFERENCE.md
│   │   └── README.md
│   │
│   ├── act-knowledge-base/
│   │   ├── skill.md
│   │   ├── START_HERE.md
│   │   ├── QUICK_START.md
│   │   └── [implementation docs...]
│   │
│   ├── dist/ (packaged skills)
│   │   └── *.skill (ZIP archives)
│   │
│   └── ACT_SKILLS_SUMMARY.md (legacy summary)
```

### File Naming Convention

**For Skills**:
- `SKILL.md` - Main skill definition (uppercase)
- `README.md` - Documentation for humans
- `QUICK-REFERENCE.md` - Cheat sheet / quick start
- `references/` - Supporting knowledge files

**For Guides**:
- `SKILLS_GUIDE.md` - This file (uppercase for top-level guides)
- `KNOWLEDGE_SYSTEM_DESIGN.md` - System architecture
- `PHASE_2_COMPLETE.md` - Status updates

---

## 🎨 Smart Skill Selection

### By Task Type

**Content Writing** → `act-brand-alignment`
- Web pages, blog posts, marketing copy
- Grant applications, reports
- Email templates, social media

**CRM & Automation** → `ghl-crm-advisor`
- Pipeline design, workflow setup
- Email sequences, automation
- Lead management, reporting

**Knowledge Management** → `act-knowledge-base` (when ready)
- Extracting knowledge from sources
- Review workflows
- Timeline planning

**Technical Development** → No specific skill yet
- Consider creating: `act-technical-stack` skill
- Would cover: Next.js, Supabase, Vercel, APIs

**Business Operations** → No specific skill yet
- Consider creating: `act-operations` skill
- Would cover: Finance (Xero, Dext), GHL, Notion workflows

---

### By Project

**ACT Hub / Main Site** → `act-brand-alignment`
- Ecosystem-level messaging
- LCAA methodology emphasis
- All projects overview

**Black Cockatoo Valley / ACT Farm** → `act-brand-alignment`
- Conservation-first framing
- Land practice emphasis
- Serene, R&D-focused voice

**The Harvest** → `act-brand-alignment` + `ghl-crm-advisor`
- Community-accessible voice
- CSA program operations
- Volunteer + member management

**JusticeHub** → `act-brand-alignment` + `ghl-crm-advisor`
- Justice innovation framing
- Service directory operations
- Family + provider pipelines

**Empathy Ledger** → `act-brand-alignment` + `ghl-crm-advisor`
- Ethical storytelling emphasis
- Consent frameworks
- Storyteller onboarding

**Goods on Country** → `act-brand-alignment`
- Circular economy framing
- Waste-to-wealth messaging

---

## 🔧 Managing Skills

### Adding a New Skill

**1. Create skill directory**:
```bash
mkdir -p .claude/skills/[skill-name]
cd .claude/skills/[skill-name]
```

**2. Create SKILL.md** with frontmatter:
```markdown
---
name: skill-name
description: What this skill does and when to use it
---

# Skill Name

## Overview
[Clear description]

## When to Use
- [Use case 1]
- [Use case 2]

## What It Knows
- [Knowledge area 1]
- [Knowledge area 2]

## How to Use
[Clear instructions]
```

**3. Add supporting references**:
```bash
mkdir references
# Add any reference docs the skill needs
```

**4. Update this guide** ([SKILLS_GUIDE.md](.claude/SKILLS_GUIDE.md)):
- Add to "Available Skills" section
- Update "Smart Skill Selection" section
- Update directory structure if needed

**5. Register in Claude Code** (if using managed skills):
```bash
claude skill package path/to/skill -o dist/skill-name.skill
```

---

### Updating an Existing Skill

**1. Edit the skill files**:
```bash
# Edit main definition
code .claude/skills/[skill-name]/SKILL.md

# Edit references
code .claude/skills/[skill-name]/references/
```

**2. Test the skill**:
- Invoke it in a conversation
- Verify it has the right knowledge
- Check if outputs match expectations

**3. Document changes**:
- Update skill's README.md
- Update this SKILLS_GUIDE.md if needed
- Note version/date in SKILL.md

---

### Deprecating a Skill

**1. Mark as deprecated** in SKILL.md:
```markdown
---
name: old-skill
description: [DEPRECATED] Use new-skill instead
deprecated: true
replacement: new-skill
---
```

**2. Move to archive**:
```bash
mkdir -p .claude/skills/archive
mv .claude/skills/old-skill .claude/skills/archive/
```

**3. Update this guide**:
- Remove from "Available Skills"
- Add deprecation notice if needed

---

## 🚀 Advanced Patterns

### Combining Multiple Skills

**Example: Brand-aligned CRM setup**
```
1. Use act-brand-alignment to understand project voice
2. Use ghl-crm-advisor to design pipeline
3. Apply brand voice to all email sequences
```

**Example: Knowledge-informed content**
```
1. Use act-knowledge-base to extract decisions from emails
2. Use act-brand-alignment to write up as wiki page
3. Use ghl-crm-advisor to notify team via workflow
```

---

### Creating Skill Chains

**Pattern**: One skill's output feeds another skill's input

```markdown
Task: Create a new ACT project launch

Chain:
1. act-brand-alignment → Define project voice, messaging, positioning
2. ghl-crm-advisor → Design launch pipeline, automation, sequences
3. act-brand-alignment → Review all sequences for voice consistency
4. act-knowledge-base → Document decisions and setup in wiki
```

---

### Skill Context Switching

**Pattern**: Switch skills mid-conversation

```
[Writing content with act-brand-alignment]
"Now switch to ghl-crm-advisor and help me set up the CRM for this"
[Designing pipeline with ghl-crm-advisor]
"Back to act-brand-alignment - review this email sequence"
```

---

## 📊 Skill Coverage Matrix

| Task | Brand | CRM | Knowledge | Technical | Operations |
|------|-------|-----|-----------|-----------|------------|
| Content Writing | ✅ | - | - | - | - |
| Web Design | ✅ | - | - | ⚠️ | - |
| CRM Setup | - | ✅ | - | - | - |
| Email Sequences | ✅ | ✅ | - | - | - |
| Pipeline Design | - | ✅ | - | - | - |
| Knowledge Extraction | - | - | ✅ | - | - |
| Review Workflows | - | - | ✅ | - | - |
| API Integration | - | ⚠️ | - | ❌ | - |
| Database Schema | - | - | - | ❌ | - |
| Finance Automation | - | - | - | - | ❌ |
| Notion Setup | - | - | ⚠️ | - | ❌ |

**Legend**:
- ✅ Full coverage
- ⚠️ Partial coverage
- ❌ No coverage (skill needed)

---

## 🎯 Recommended New Skills

Based on coverage gaps, consider creating:

### 1. **act-technical-stack**
**Purpose**: Technical implementation guidance
**Covers**:
- Next.js patterns and best practices
- Supabase schema design and queries
- Vercel deployment and configuration
- API design (REST, webhooks)
- Authentication flows
- Database migrations

**When to Use**: Building or modifying ACT technical platforms

---

### 2. **act-operations**
**Purpose**: Business operations and workflows
**Covers**:
- Finance workflows (Xero + Dext)
- Receipt processing automation
- Invoice creation and follow-up
- Notion workspace organization
- GHL → Notion sync patterns
- Monthly close procedures

**When to Use**: Managing ACT day-to-day operations

---

### 3. **act-calendar-integration** (Future)
**Purpose**: Calendar and timeline management
**Covers**:
- Google Calendar knowledge extraction
- Pattern detection (recurring meetings)
- Deadline tracking
- Milestone timelines
- Historical event documentation

**When to Use**: Managing ACT schedules and important dates

---

### 4. **act-grant-writing**
**Purpose**: Grant applications and funding
**Covers**:
- Grant application templates
- Impact metrics reporting
- Budget justification
- Partnership letters
- Outcomes tracking
- Funder-specific language

**When to Use**: Applying for grants or reporting to funders

---

## 💡 Best Practices

### 1. **Be Specific When Invoking**
❌ "Help me with this"
✅ "Use act-brand-alignment to review this BCV homepage for voice consistency"

### 2. **Chain Skills Deliberately**
❌ Try to do everything with one skill
✅ Use brand → CRM → brand chain for holistic project setup

### 3. **Keep Skills Focused**
❌ Create one mega-skill that does everything
✅ Create focused skills that do one thing well

### 4. **Document As You Go**
❌ Build skill and forget to document
✅ Update SKILL.md, README.md, and this guide immediately

### 5. **Test Before Deploying**
❌ Create skill and assume it works
✅ Test in conversation, verify outputs, iterate

---

## 🔍 Discovering Skills

### Method 1: Read This Guide
- **Best for**: Understanding what's available
- **Location**: You're here! Read "Available Skills" section

### Method 2: Browse Skills Directory
```bash
ls .claude/skills/
cat .claude/skills/*/SKILL.md | grep "name:"
```

### Method 3: Ask Claude
```
"What Claude skills are available for ACT projects?"
"Show me all skills related to [topic]"
"Which skill should I use for [task]?"
```

### Method 4: Check Settings
```bash
cat .claude/settings.local.json
```

---

## 🎓 Learning Resources

### For Skill Users
1. Read this guide (SKILLS_GUIDE.md)
2. Review individual skill README files
3. Check QUICK-REFERENCE.md files where available
4. Ask Claude to demonstrate skill usage

### For Skill Developers
1. Study existing skills (act-brand-alignment is comprehensive)
2. Review [Claude Code skills documentation](https://docs.anthropic.com/claude/docs/skills)
3. Check ACT_SKILLS_SUMMARY.md for context
4. Test skills thoroughly before sharing

---

## 📞 Support & Updates

### Getting Help
- **Skill not working?** Check SKILL.md for correct invocation
- **Missing knowledge?** Update skill references
- **Need new skill?** Follow "Adding a New Skill" guide above

### Staying Updated
- Check this file for changes
- Review git history for skill updates
- Subscribe to skill change notifications (if available)

---

## 🗺️ Roadmap

### Current Focus (Q1 2026)
- ✅ act-brand-alignment (complete)
- ✅ ghl-crm-advisor (complete)
- 🚧 act-knowledge-base (in progress - Phase 2 complete)

### Next Quarter (Q2 2026)
- ⏳ act-technical-stack (planned)
- ⏳ act-operations (planned)
- ⏳ act-calendar-integration (designed)

### Future (Q3-Q4 2026)
- ⏳ act-grant-writing
- ⏳ act-visual-design
- ⏳ act-impact-reporting

---

## 🎉 Quick Reference Card

**Print or save this for daily use:**

```
╔════════════════════════════════════════════════════════════╗
║              ACT CLAUDE SKILLS - QUICK REFERENCE            ║
╠════════════════════════════════════════════════════════════╣
║                                                            ║
║  BRAND & CONTENT                                           ║
║  → /act-brand-alignment                                    ║
║     Writing, design, voice, all ACT projects               ║
║                                                            ║
║  CRM & AUTOMATION                                          ║
║  → /ghl-crm-advisor                                        ║
║     Pipelines, workflows, automation, reporting            ║
║                                                            ║
║  KNOWLEDGE MANAGEMENT                                      ║
║  → act-knowledge-base (in development)                     ║
║     Extraction, review, timeline, multi-source             ║
║                                                            ║
╠════════════════════════════════════════════════════════════╣
║  QUICK TIPS                                                ║
║  • Be specific when invoking                               ║
║  • Chain skills for complex tasks                          ║
║  • Update this guide when adding skills                    ║
║  • Test before deploying                                   ║
╚════════════════════════════════════════════════════════════╝
```

---

**Questions?** Ask Claude: "How do I use the [skill-name] skill?"

**Feedback?** Update this guide with improvements!

**Ready to start?** Try: `/act-brand-alignment` or `/ghl-crm-advisor`

---

**Last Updated**: 2025-12-26
**Maintained By**: Ben Knight + Claude AI
**Location**: `.claude/SKILLS_GUIDE.md`
