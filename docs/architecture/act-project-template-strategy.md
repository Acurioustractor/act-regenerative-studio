# ACT Project Template & Standardization Strategy

**Created**: 2025-12-26
**Purpose**: Create unified standards, templates, and Claude skills architecture across all ACT ecosystem projects

---

## 🎯 Vision

Every ACT project should:
1. **Feel familiar** - Same structure, conventions, workflows
2. **Have AI superpowers** - Claude skills available everywhere
3. **Be discoverable** - Easy to understand, navigate, contribute to
4. **Show progress** - Visible status, health, deployment state
5. **Align with LCAA** - Methodology embedded in every layer

---

## 📦 The ACT Project Template

### Core Structure

Every ACT project repository should have:

```
project-root/
├── .github/
│   ├── ISSUE_TEMPLATE/          # Standard ACT issue templates
│   ├── PULL_REQUEST_TEMPLATE.md # ACT quality checklist
│   ├── workflows/               # Standard workflows (test, deploy, security)
│   ├── labeler.yml              # File-based auto-labeling
│   └── CODEOWNERS               # Auto-reviewer assignment
├── .claude/
│   ├── skills/
│   │   ├── global/              # Symlinked from ~/act-global-skills/
│   │   │   ├── act-brand-alignment/
│   │   │   ├── ghl-crm-advisor/
│   │   │   ├── act-knowledge-base/
│   │   │   └── ...              # Other shared skills
│   │   └── local/               # Project-specific skills
│   │       └── [project]-assistant/
│   ├── SKILLS_GUIDE.md          # Project-specific skill docs
│   └── hooks.json               # Project-specific hooks
├── docs/
│   ├── README.md                # Documentation index
│   ├── quick-starts/            # Getting started guides
│   ├── architecture/            # System design
│   ├── features/                # Feature documentation
│   ├── integrations/            # Integration guides
│   └── development/             # Dev environment setup
├── scripts/                     # Automation scripts
├── CLAUDE.md                    # AI assistant context (required!)
├── README.md                    # Project overview
├── CONTRIBUTING.md              # Contribution guidelines
└── [project-specific-structure]
```

---

## 🤖 Claude Skills Architecture

### 1. Global Skills (Shared Across All Projects)

**Location**: `~/act-global-skills/` (symlinked into each project)

**Shared Skills**:
- **`act-brand-alignment`** - ACT voice, tone, LCAA methodology, content creation
- **`ghl-crm-advisor`** - GoHighLevel CRM strategy (for projects using GHL)
- **`act-knowledge-base`** - Knowledge extraction and wiki management
- **`act-github-pm`** (NEW) - GitHub project management, issue creation, workflow advice
- **`act-deployment-helper`** (NEW) - Vercel/deployment troubleshooting
- **`act-security-advisor`** (NEW) - Security best practices, vulnerability scanning

**How It Works**:
```bash
# Global skills repository
~/act-global-skills/
  ├── act-brand-alignment/
  ├── ghl-crm-advisor/
  ├── act-knowledge-base/
  ├── act-github-pm/
  ├── act-deployment-helper/
  └── act-security-advisor/

# Each project symlinks to global skills
~/Code/empathy-ledger-v2/.claude/skills/global/ -> ~/act-global-skills/
~/Code/justicehub-platform/.claude/skills/global/ -> ~/act-global-skills/
~/Code/theharvest/.claude/skills/global/ -> ~/act-global-skills/
```

**Benefits**:
- ✅ Update a skill once, applies everywhere
- ✅ Consistent AI assistance across all projects
- ✅ Easy to add new skills to entire ecosystem

---

### 2. Project-Specific Skills (Local)

**Location**: `[project]/.claude/skills/local/`

**Examples**:
- **`empathy-ledger-assistant`** - Empathy Ledger API, consent workflows, OCAP principles
- **`justicehub-assistant`** - JusticeHub forkable models, justice program design
- **`harvest-assistant`** - Harvest booking system, therapeutic horticulture programs
- **`placemat-assistant`** - Placemat event management, community engagement

**Project-Specific Skills Include**:
- Codebase-specific patterns and conventions
- API endpoints and data models
- Integration details (Supabase schema, external APIs)
- Project-specific workflows and processes
- Feature development guidance

---

### 3. Skills Menu & Discovery

Every project gets:

**`.claude/skills-menu.sh`**:
```bash
#!/bin/bash
# Interactive skill selector for this project

echo "🌾 ACT Ecosystem - [Project Name] Skills"
echo "========================================"
echo ""
echo "Global Skills (available in all projects):"
echo "  1. /act-brand-alignment    - ACT voice, LCAA, content"
echo "  2. /ghl-crm-advisor        - CRM strategy"
echo "  3. /act-github-pm          - GitHub project management"
echo "  4. /act-deployment-helper  - Deployment troubleshooting"
echo ""
echo "Project Skills:"
echo "  5. /[project]-assistant    - Project-specific guidance"
echo ""
echo "Enter number to invoke skill..."
```

**`.claude/SKILLS_GUIDE.md`**:
- Comprehensive guide to available skills
- When to use each skill
- Examples and common workflows
- Project-specific skill documentation

---

## 📋 Standard Files Every Project Needs

### 1. CLAUDE.md (Required!)

**Purpose**: AI assistant context about this specific project

**Template**: [See section below](#claudemd-template)

**Contents**:
- Project overview and purpose
- Tech stack
- Key commands and workflows
- Codebase structure
- Where to find things
- Common tasks
- Integration details
- Link to available skills

---

### 2. CONTRIBUTING.md

**Purpose**: How to contribute to this project

**Standard Sections**:
- Code of conduct (link to ACT CoC)
- Development setup
- Running locally
- Making changes
- Commit message conventions
- PR process
- Testing requirements
- LCAA alignment checklist

---

### 3. README.md

**Purpose**: Project overview and quick start

**Standard Sections**:
- Project name and tagline
- Purpose and impact
- Key features
- Quick start
- Tech stack
- Deployment status badge
- Links to documentation
- How to contribute
- License (AGPL-3.0 for ACT)

---

## 🔧 Standard GitHub Workflows

Every project gets these 5 workflows (already created for ACT Main):

1. **`test.yml`** - CI/CD testing on every PR
2. **`deploy.yml`** - Auto-deployment to production
3. **`security-scan.yml`** - Weekly security scanning
4. **`auto-label.yml`** - Automatic PR/issue labeling
5. **`type-sync.yml`** - Type synchronization (for TypeScript projects)

**Stored in**: `~/act-project-template/.github/workflows/`

---

## 🏷️ Standard Labels

All projects use the same 37 labels (already deployed to 7 repos):

**Categories**:
- **Priority**: Critical, High, Medium, Low
- **Type**: Bug, Feature, Chore, Documentation, Security, Refactor
- **Project**: ACT Main, Empathy Ledger, JusticeHub, Harvest, etc.
- **Effort**: 1h, 3h, 1d, 3d, 1w, 2w
- **Status**: Blocked, In Progress, Ready for Review, Needs Discussion
- **LCAA**: Listen, Curiosity, Action, Art
- **Special**: Good First Issue, Help Wanted, Breaking Change, etc.

**Deploy to new project**:
```bash
node ~/act-global-scripts/setup-github-labels.mjs --repo new-project-name
```

---

## 📊 Standard Documentation Structure

Every project's `docs/` folder should have:

```
docs/
├── README.md                  # Documentation index
├── quick-starts/              # Getting started guides
│   ├── quick-start.md
│   ├── env-setup.md
│   └── deploy.md
├── architecture/              # System design
│   ├── overview.md
│   ├── database-schema.md
│   └── api-design.md
├── features/                  # Feature documentation
├── integrations/              # Integration guides
│   ├── supabase.md
│   ├── [external-service].md
│   └── cross-project.md
├── development/               # Dev environment
│   ├── setup.md
│   ├── best-practices.md
│   └── troubleshooting.md
└── strategy/                  # Roadmaps, vision
    ├── roadmap.md
    └── vision.md
```

---

## 🎨 Standard Scripts

Every project gets:

**`scripts/setup.sh`** - One-command setup:
```bash
#!/bin/bash
# Setup this ACT project

echo "🌾 Setting up [Project Name]..."

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Setup database (if applicable)
# npm run db:setup

# Link global Claude skills
ln -s ~/act-global-skills .claude/skills/global

echo "✅ Setup complete!"
echo "Next steps: Update .env.local with your credentials"
```

**`scripts/health-check.sh`** - Check project health:
```bash
#!/bin/bash
# Health check for [Project Name]

echo "🏥 Running health check..."

# Check dependencies
npm outdated

# Check for build errors
npm run build

# Check for type errors
npm run type-check

# Check for security issues
npm audit

echo "✅ Health check complete"
```

---

## 🔄 Implementation Plan

### Phase 1: Create Template Repository
**Goal**: `act-project-template` repository with all standards

**Tasks**:
- [ ] Create `act-project-template` repository
- [ ] Add standard `.github/` folder with workflows, templates
- [ ] Add standard `docs/` structure
- [ ] Add standard `scripts/`
- [ ] Create template `CLAUDE.md`
- [ ] Create template `CONTRIBUTING.md`
- [ ] Create template `README.md`
- [ ] Document customization process

**Time**: 2-3 hours

---

### Phase 2: Create Global Skills Repository
**Goal**: `~/act-global-skills/` with shared Claude skills

**Tasks**:
- [ ] Create `~/act-global-skills/` directory
- [ ] Move `act-brand-alignment` to global
- [ ] Move `ghl-crm-advisor` to global
- [ ] Create `act-github-pm` skill
- [ ] Create `act-deployment-helper` skill
- [ ] Create `act-security-advisor` skill
- [ ] Add global `README.md` with skill catalog

**Time**: 3-4 hours

---

### Phase 3: Align Existing Projects
**Goal**: Update 7 core repos to match template

**Per Project** (~30 min each):
- [ ] Add/update `CLAUDE.md`
- [ ] Symlink global skills
- [ ] Create project-specific skill
- [ ] Update `docs/` structure
- [ ] Add standard scripts
- [ ] Ensure workflows are deployed
- [ ] Update `README.md` to match template

**Projects**:
1. act-regenerative-studio ✅ (already mostly aligned)
2. empathy-ledger-v2
3. justicehub-platform
4. theharvest
5. act-farm
6. act-placemat
7. goods-asset-tracker

**Time**: 3-4 hours total

---

### Phase 4: Create Ecosystem Visibility Dashboard
**Goal**: Unified view of all ACT projects

**See**: [ACT Ecosystem Dashboard Strategy](#dashboard-strategy) (below)

**Time**: 4-8 hours (depending on approach)

---

## 🎯 Benefits of Standardization

### For Developers
- ✅ Familiar structure across all projects
- ✅ Same commands, conventions everywhere
- ✅ AI assistance available consistently
- ✅ Easy to jump between projects
- ✅ Faster onboarding

### For AI Assistants (Claude)
- ✅ Consistent context across projects
- ✅ Reusable skills and knowledge
- ✅ Better understanding of ACT patterns
- ✅ More accurate code generation
- ✅ Easier to maintain

### For Team
- ✅ Unified visibility into all projects
- ✅ Consistent quality standards
- ✅ Easier collaboration across projects
- ✅ Shared best practices
- ✅ Centralized documentation patterns

### For Community
- ✅ Easier to contribute
- ✅ Consistent experience
- ✅ Clear expectations
- ✅ Professional presentation
- ✅ Visible progress and health

---

## 📝 CLAUDE.md Template

```markdown
# [Project Name] - Claude Code Context

> **Quick Reference for Claude Code**
> This document provides essential context about this codebase for AI-assisted development.

---

## 🎯 Project Overview

**Name**: [Project Name]
**Purpose**: [One-line description]
**Tech Stack**: [e.g., Next.js 15, React 19, TypeScript, Supabase, Tailwind]
**Primary Focus**: [Main features/goals]

---

## 🚀 Quick Start

### Essential Commands
\`\`\`bash
npm run dev        # Start development
npm run build      # Build for production
npm run test       # Run tests
\`\`\`

### Key Files to Read First
1. [README.md](./README.md)
2. [docs/quick-starts/quick-start.md](./docs/quick-starts/quick-start.md)
3. [docs/architecture/overview.md](./docs/architecture/overview.md)

---

## 📁 Codebase Structure

[Document your specific structure]

---

## 🤖 Claude Skills

This project has access to:

**Global Skills** (available in all ACT projects):
- `/act-brand-alignment` - ACT voice, LCAA methodology, content
- `/ghl-crm-advisor` - CRM strategy (if applicable)
- `/act-github-pm` - GitHub project management
- `/act-deployment-helper` - Deployment troubleshooting

**Project Skills**:
- `/[project]-assistant` - [Project]-specific guidance

Run `./.claude/skills-menu.sh` for interactive selection.

---

## 🗄️ Database Schema

[Document your schema]

---

## 🔐 Environment Variables

[Document required env vars]

---

## 🏗️ Architecture

[Link to architecture docs]

---

## 🎨 Brand Voice & Methodology

All ACT projects follow the **LCAA Method**:
- **Listen** → Deep listening to place, people, community
- **Curiosity** → Think deeply, prototype boldly
- **Action** → Build tangible solutions
- **Art** → Translate change into culture

Use `/act-brand-alignment` skill for content creation.

---

## 🛠️ Common Tasks

[Document common development tasks]

---

**Last Updated**: [Date]
**Maintained By**: [Team]
**Questions?** Check `.claude/SKILLS_GUIDE.md` or ask for help!
```

---

## 🔗 Next Steps

1. **Review this strategy** - Does it match your vision?
2. **Create template repository** - Start with `act-project-template`
3. **Create global skills** - Set up `~/act-global-skills/`
4. **Design dashboard** - See dashboard strategy research
5. **Align existing projects** - Roll out template to 7 repos

---

## 📚 Related Documentation

- [Multi-Codebase Skills Architecture](./multi-codebase-skills.md)
- [ACT Ecosystem Dashboard Strategy](#) (to be created after research)
- [GitHub PM Complete](../../GITHUB_PM_COMPLETE.md)

---

**Last Updated**: 2025-12-26
**Status**: Draft - Needs Review
**Next Action**: Get feedback on strategy, then implement Phase 1

🌾 **Building unified infrastructure for the ACT ecosystem** 🌾
