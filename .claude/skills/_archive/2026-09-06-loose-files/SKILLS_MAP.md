# ACT Claude Skills - Visual Map

**Quick visual reference for choosing the right skill**

---

## 🗺️ Skills by Use Case

```
┌─────────────────────────────────────────────────────────────┐
│                    YOUR TASK                                │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
              ┌─────────────┴─────────────┐
              │      What are you         │
              │       working on?         │
              └─────────────┬─────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌───────────────┐   ┌──────────────┐   ┌──────────────────┐
│   CONTENT &   │   │   CRM &      │   │   KNOWLEDGE &    │
│    BRAND      │   │  AUTOMATION  │   │    SYSTEMS       │
└───────┬───────┘   └──────┬───────┘   └────────┬─────────┘
        │                  │                     │
        ▼                  ▼                     ▼
┌──────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ act-brand-       │ │ ghl-crm-        │ │ act-knowledge-  │
│ alignment        │ │ advisor         │ │ base            │
│                  │ │                 │ │                 │
│ • Web pages      │ │ • Pipelines     │ │ • Extraction    │
│ • Marketing      │ │ • Workflows     │ │ • Review queue  │
│ • Grant apps     │ │ • Automation    │ │ • Timeline      │
│ • Voice review   │ │ • Email seq.    │ │ • Multi-source  │
│ • Design         │ │ • Lead mgmt     │ │ (in dev)        │
└──────────────────┘ └─────────────────┘ └─────────────────┘
```

---

## 🎯 Skills by Project

```
┌──────────────────────────────────────────────────────────┐
│                   ACT ECOSYSTEM                          │
└──────────────────────────────────────────────────────────┘

ACT Hub / Main Site
├─ Brand & Content ────────► act-brand-alignment
└─ Operations ─────────────► (future: act-operations)

Black Cockatoo Valley / ACT Farm
├─ Brand & Content ────────► act-brand-alignment
├─ Bookings & CRM ─────────► ghl-crm-advisor
└─ Knowledge ──────────────► act-knowledge-base

The Harvest
├─ Brand & Content ────────► act-brand-alignment
├─ Member/Volunteer CRM ───► ghl-crm-advisor
└─ Operations ─────────────► (future: act-operations)

JusticeHub
├─ Brand & Content ────────► act-brand-alignment
├─ Service Directory CRM ──► ghl-crm-advisor
└─ Technical Dev ──────────► (future: act-technical-stack)

Empathy Ledger
├─ Brand & Content ────────► act-brand-alignment
├─ Storyteller CRM ────────► ghl-crm-advisor
└─ Technical Dev ──────────► (future: act-technical-stack)

Goods on Country
├─ Brand & Content ────────► act-brand-alignment
└─ Operations ─────────────► (future: act-operations)
```

---

## 📊 Skills by Content Type

```
┌────────────────────────────────────────────────────────────┐
│                 WHAT YOU'RE CREATING                       │
└────────────────────────────────────────────────────────────┘

📝 WRITING
├─ Web page ──────────────────► act-brand-alignment
├─ Blog post ─────────────────► act-brand-alignment
├─ Email sequence ────────────► act-brand-alignment + ghl-crm-advisor
├─ Grant application ─────────► act-brand-alignment (+ future: act-grant-writing)
├─ Report ────────────────────► act-brand-alignment
└─ Social media ──────────────► act-brand-alignment

🎨 DESIGN
├─ UI design ─────────────────► act-brand-alignment
├─ Visual assets ─────────────► act-brand-alignment
├─ Brand materials ───────────► act-brand-alignment
└─ Information arch. ─────────► act-brand-alignment

⚙️ CRM & AUTOMATION
├─ Pipeline design ───────────► ghl-crm-advisor
├─ Workflow automation ───────► ghl-crm-advisor
├─ Email sequences ───────────► ghl-crm-advisor (+ act-brand-alignment for voice)
├─ Lead scoring ──────────────► ghl-crm-advisor
└─ Reporting dashboard ───────► ghl-crm-advisor

📚 KNOWLEDGE
├─ Extract from emails ───────► act-knowledge-base
├─ Extract from Notion ───────► act-knowledge-base
├─ Review workflow ───────────► act-knowledge-base
└─ Timeline planning ─────────► act-knowledge-base (+ future: act-calendar)

💻 TECHNICAL
├─ Next.js development ───────► (future: act-technical-stack)
├─ Supabase schema ───────────► (future: act-technical-stack)
├─ API integration ───────────► (future: act-technical-stack)
└─ Database queries ──────────► (future: act-technical-stack)

📊 OPERATIONS
├─ Finance workflows ─────────► (future: act-operations)
├─ Notion setup ──────────────► (future: act-operations)
├─ Receipt processing ────────► (future: act-operations)
└─ Invoice management ────────► (future: act-operations)
```

---

## 🔀 Skill Combinations

```
┌────────────────────────────────────────────────────────────┐
│              COMMON SKILL CHAINS                           │
└────────────────────────────────────────────────────────────┘

NEW PROJECT LAUNCH
1. act-brand-alignment ──► Define voice, messaging, positioning
2. ghl-crm-advisor ─────► Design pipeline, automation
3. act-brand-alignment ──► Review sequences for consistency
4. act-knowledge-base ──► Document setup decisions

CONTENT CAMPAIGN
1. act-brand-alignment ──► Write email series
2. ghl-crm-advisor ─────► Set up automation
3. act-brand-alignment ──► Review final output

CRM OPTIMIZATION
1. ghl-crm-advisor ─────► Analyze current pipeline
2. act-brand-alignment ──► Review all messaging
3. ghl-crm-advisor ─────► Rebuild with improvements

KNOWLEDGE DOCUMENTATION
1. act-knowledge-base ──► Extract from sources
2. act-brand-alignment ──► Write up as wiki page
3. ghl-crm-advisor ─────► Notify team via workflow
```

---

## 🎯 Decision Tree

```
START: What do you need?
│
├─ "I need to write something" ──────────► act-brand-alignment
│
├─ "I need to set up automation" ────────► ghl-crm-advisor
│
├─ "I need to extract knowledge" ────────► act-knowledge-base
│
├─ "I need to build a feature" ──────────► (future: act-technical-stack)
│
├─ "I need to manage operations" ────────► (future: act-operations)
│
└─ "I'm not sure" ────────────────────────► Run: ./.claude/skills-menu.sh
```

---

## 📈 Coverage Heatmap

```
Task Type          | Brand | CRM | Knowledge | Technical | Ops |
-------------------|-------|-----|-----------|-----------|-----|
Content Writing    |  ███  |     |           |           |     |
Web Design         |  ███  |     |           |    ▓▓▓    |     |
Email Sequences    |  ███  | ███ |           |           |     |
Pipeline Design    |       | ███ |           |           |     |
Workflow Auto      |       | ███ |           |           |     |
Knowledge Extract  |       |     |    ███    |           |     |
Review Workflows   |       |     |    ███    |           |     |
API Integration    |       |  ░  |           |           |     |
Database Design    |       |     |           |           |     |
Finance Automation |       |     |           |           |     |
Notion Setup       |       |     |    ▓▓▓    |           |     |

Legend:
███ Full coverage (skill exists)
▓▓▓ Partial coverage
░░░ Minimal coverage
    No coverage (skill needed)
```

---

## 🚀 Quick Launch

**Terminal**:
```bash
# Interactive menu
./.claude/skills-menu.sh

# Direct run
claude chat "/act-brand-alignment review this copy"
```

**In Conversation**:
```
/act-brand-alignment
/ghl-crm-advisor
```

**Natural Language**:
```
"Use brand alignment to help me write this page"
"I need GHL advice for this pipeline"
"Extract knowledge from these emails"
```

---

## 📚 Learn More

- [SKILLS_GUIDE.md](.claude/SKILLS_GUIDE.md) - Complete reference
- [README.md](.claude/README.md) - Quick start
- [skills/*/SKILL.md](.claude/skills/) - Individual skill docs

---

**Pro Tip**: Bookmark this page for quick skill selection!

**Updated**: 2025-12-26
