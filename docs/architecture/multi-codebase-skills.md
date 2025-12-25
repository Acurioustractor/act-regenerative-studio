# Multi-Codebase Claude Skills & MCP Architecture

**Created**: 2025-12-26
**Purpose**: Enable global skills + MCP servers across all ACT codebases with project-specific overrides

---

## 🎯 Goals

1. **Global Skills** - Shared across all ACT projects (brand, CRM, operations)
2. **Project-Specific Skills** - Unique to individual codebases (Empathy Ledger, JusticeHub, etc.)
3. **MCP Servers** - Centralized integrations (Notion, GitHub, Supabase) accessible everywhere
4. **Easy Maintenance** - Update once, benefit everywhere
5. **Clear Precedence** - Project-specific overrides global when needed

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                   GLOBAL SKILLS & MCP                        │
│  Location: ~/act-global-skills/                              │
│  Shared across ALL ACT projects                              │
└─────────────────────────────────────────────────────────────┘
                            │
                            ├─ Symlinked to each project
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌───────────────┐   ┌──────────────┐   ┌──────────────────┐
│ ACT Farm      │   │ Empathy      │   │ JusticeHub       │
│ (This repo)   │   │ Ledger       │   │                  │
├───────────────┤   ├──────────────┤   ├──────────────────┤
│ .claude/      │   │ .claude/     │   │ .claude/         │
│ ├─ skills/    │   │ ├─ skills/   │   │ ├─ skills/       │
│ │  ├─ global@│   │ │  ├─ global@│   │ │  ├─ global@     │
│ │  └─ local/  │   │ │  └─ local/ │   │ │  └─ local/      │
│ └─ mcp.json   │   │ └─ mcp.json  │   │ └─ mcp.json      │
│ └─CLAUDE.md   │   │ └─CLAUDE.md  │   │ └─CLAUDE.md      │
└───────────────┘   └──────────────┘   └──────────────────┘
     Project            Project            Project
     Context            Context            Context
```

---

## 📁 Directory Structure

### Global Skills Repository

**Location**: `~/act-global-skills/` (or `~/Code/act-global-skills/`)

```
~/act-global-skills/
├── README.md                       ← Setup instructions
├── SKILLS_CATALOG.md               ← Complete skills inventory
│
├── skills/                         ← Global skills (shared)
│   ├── act-brand-alignment/        ← ACT brand, voice, all projects
│   ├── ghl-crm-advisor/            ← CRM strategy, all projects
│   ├── act-operations/             ← Finance, Notion, operations
│   └── act-technical-stack/        ← Next.js, Supabase, common tech
│
├── mcp-servers/                    ← MCP server configs
│   ├── notion/
│   │   └── config.json
│   ├── github/
│   │   └── config.json
│   ├── supabase/
│   │   └── config.json
│   └── slack/
│       └── config.json
│
└── templates/                      ← Project templates
    ├── CLAUDE.md.template          ← CLAUDE.md template
    ├── mcp.json.template           ← MCP config template
    └── .claude-settings.template   ← Settings template
```

---

### Project-Specific Structure

**Example**: ACT Farm (this repo)

```
/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio/
├── CLAUDE.md                       ← Project-specific context
│
├── .claude/
│   ├── settings.local.json         ← Claude Code settings
│   ├── mcp.json                    ← MCP config (inherits + overrides)
│   │
│   └── skills/
│       ├── global/                 ← SYMLINK to ~/act-global-skills/skills/
│       │   ├── act-brand-alignment@    (symlink)
│       │   ├── ghl-crm-advisor@        (symlink)
│       │   ├── act-operations@         (symlink)
│       │   └── act-technical-stack@    (symlink)
│       │
│       └── local/                  ← Project-specific skills
│           ├── act-farm-specific/  ← ACT Farm unique features
│           └── multi-repo-sync/    ← Multi-project orchestration
│
└── docs/                           ← Project-specific docs
```

**Example**: Empathy Ledger

```
/Users/benknight/Code/Empathy Ledger v.02/
├── CLAUDE.md                       ← Empathy Ledger context
│
├── .claude/
│   ├── mcp.json                    ← MCP config (inherits + overrides)
│   │
│   └── skills/
│       ├── global/                 ← SYMLINK to ~/act-global-skills/skills/
│       │   ├── act-brand-alignment@
│       │   ├── ghl-crm-advisor@
│       │   └── act-technical-stack@
│       │
│       └── local/                  ← Empathy Ledger specific
│           ├── storyteller-consent/    ← Consent frameworks
│           └── narrative-sovereignty/  ← Story ownership
│
└── docs/
```

---

## 🔧 Implementation

### Step 1: Create Global Skills Repository

```bash
# Create global skills directory
mkdir -p ~/act-global-skills
cd ~/act-global-skills

# Initialize structure
mkdir -p skills mcp-servers templates

# Initialize git
git init
git remote add origin <global-skills-repo-url>

# Create README
cat > README.md << 'EOF'
# ACT Global Skills & MCP

Shared Claude Code skills and MCP servers for all ACT projects.

## Usage

Link to any ACT project:
```bash
cd /path/to/project
ln -s ~/act-global-skills/skills .claude/skills/global
```

## Skills Available

- act-brand-alignment - Brand, voice, all projects
- ghl-crm-advisor - CRM strategy
- act-operations - Finance, Notion, operations
- act-technical-stack - Next.js, Supabase, tech

## MCP Servers

- Notion - Access Notion databases
- GitHub - Create PRs, manage repos
- Supabase - Query databases
- Slack - Post notifications
EOF
```

---

### Step 2: Move Global Skills

```bash
# Move global skills from ACT Farm to global repo
cd ~/act-global-skills/skills

# Copy (then we'll symlink back)
cp -r "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio/.claude/skills/act-brand-alignment" ./
cp -r "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio/.claude/skills/ghl-crm-advisor" ./

# Commit
cd ~/act-global-skills
git add -A
git commit -m "Initial global skills: brand-alignment, ghl-crm-advisor"
```

---

### Step 3: Symlink Global Skills to Projects

```bash
# ACT Farm
cd "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio/.claude/skills"
mkdir -p global local

# Symlink global skills
ln -s ~/act-global-skills/skills/act-brand-alignment global/act-brand-alignment
ln -s ~/act-global-skills/skills/ghl-crm-advisor global/ghl-crm-advisor

# Move project-specific skills to local/
mv act-knowledge-base local/  # ACT Farm specific

# Empathy Ledger
cd "/Users/benknight/Code/Empathy Ledger v.02/.claude/skills"
mkdir -p global local

ln -s ~/act-global-skills/skills/act-brand-alignment global/act-brand-alignment
ln -s ~/act-global-skills/skills/ghl-crm-advisor global/ghl-crm-advisor

# JusticeHub
cd "/Users/benknight/Code/JusticeHub/.claude/skills"
mkdir -p global local

ln -s ~/act-global-skills/skills/act-brand-alignment global/act-brand-alignment
ln -s ~/act-global-skills/skills/ghl-crm-advisor global/ghl-crm-advisor
```

---

### Step 4: MCP Server Configuration

**Global MCP Config** (`~/act-global-skills/mcp-servers/base-config.json`):

```json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["-y", "@notionhq/client"],
      "env": {
        "NOTION_API_KEY": "${NOTION_API_KEY}"
      }
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/supabase-js"],
      "env": {
        "SUPABASE_URL": "${SUPABASE_URL}",
        "SUPABASE_KEY": "${SUPABASE_SERVICE_ROLE_KEY}"
      }
    }
  }
}
```

**Project-Specific MCP Config** (`.claude/mcp.json`):

```json
{
  "extends": "~/act-global-skills/mcp-servers/base-config.json",
  "mcpServers": {
    "project-specific-server": {
      "command": "...",
      "args": []
    }
  }
}
```

---

### Step 5: CLAUDE.md Templates

**Global Template** (`~/act-global-skills/templates/CLAUDE.md.template`):

```markdown
# Claude Code Configuration - {PROJECT_NAME}

## Project Context
{PROJECT_DESCRIPTION}

## ACT Ecosystem
Part of A Curious Tractor's regenerative innovation ecosystem.

**Related Projects**:
- ACT Farm (multi-project orchestrator)
- Empathy Ledger (storytelling platform)
- JusticeHub (justice innovation network)
- The Harvest (community hub)
- Black Cockatoo Valley (conservation estate)

## Code Style
- TypeScript strict mode
- Functional React patterns
- Supabase for data persistence
- Tailwind CSS for styling
- Next.js App Router

## Common Workflows

### Before Any Changes
```bash
npm run type-check
npm run lint
```

### Testing
```bash
npm run test
# Test auth in incognito mode
```

### Database Changes
```bash
# Always run migrations before schema changes
npx supabase migration new <name>
npx supabase db push
```

### Deployment
```bash
# Vercel auto-deploys from main branch
git push origin main
```

## Global Skills Available
- `/act-brand-alignment` - ACT brand, voice, all projects
- `/ghl-crm-advisor` - CRM strategy, pipelines
- `/act-operations` - Finance, Notion, operations
- `/act-technical-stack` - Next.js, Supabase, tech

## Project-Specific Skills
{PROJECT_SPECIFIC_SKILLS}

## MCP Servers Available
- **Notion** - Access ACT Placemat databases
- **GitHub** - Create PRs, manage repos
- **Supabase** - Query project database
- **Slack** - Post notifications (optional)

## Environment Variables
Stored in `.env.local` (never commit!)
Required: {REQUIRED_ENV_VARS}

## Key Conventions
- {CONVENTION_1}
- {CONVENTION_2}
- {CONVENTION_3}
```

**Project-Specific CLAUDE.md** (ACT Farm example):

```markdown
# Claude Code Configuration - ACT Farm

## Project Context
Multi-project orchestrator and dashboard for the ACT ecosystem. Manages 6 projects:
Empathy Ledger, JusticeHub, The Harvest, BCV, Goods, Art.

## ACT Ecosystem
**This is the hub project** - coordinates all other ACT projects.

**Managed Projects**:
- Empathy Ledger (`/Users/benknight/Code/Empathy Ledger v.02`)
- JusticeHub (`/Users/benknight/Code/JusticeHub`)
- The Harvest (`/Users/benknight/Code/The Harvest`)
- BCV (`/Users/benknight/Code/ACT Farm`)

## Code Style
[... standard ACT conventions ...]

## Project-Specific Skills
- `/multi-repo-sync` - Sync changes across all projects
- `/act-knowledge-base` - Extract knowledge from Notion/Gmail

## Key Conventions
- Use GHL for all CRM operations
- Knowledge extraction runs daily (Notion + Gmail)
- Multi-repo git operations coordinated from this project
- Dashboard aggregates data from all 6 projects
```

---

## 🔀 Precedence Rules

### Skill Loading Order (First Match Wins)

1. **Project-specific** (`.claude/skills/local/`)
2. **Global** (`.claude/skills/global/` → symlink)
3. **User-level** (`~/.claude/skills/`)

**Example**:
- If `act-brand-alignment` exists in both local and global, local version is used
- Allows project-specific overrides of global skills

### MCP Server Loading

1. **Project mcp.json** (extends global)
2. **Global base-config.json**
3. **Merged configuration**

**Example**:
```json
// Global: Notion MCP
// Project: Adds project-specific Supabase MCP
// Result: Both available
```

---

## 📊 Skills Distribution Matrix

| Skill | ACT Farm | Empathy Ledger | JusticeHub | Harvest | BCV |
|-------|----------|----------------|------------|---------|-----|
| **Global Skills** |
| act-brand-alignment | ✅ | ✅ | ✅ | ✅ | ✅ |
| ghl-crm-advisor | ✅ | ✅ | ✅ | ✅ | ✅ |
| act-operations | ✅ | ✅ | ✅ | ✅ | ✅ |
| act-technical-stack | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Project-Specific Skills** |
| multi-repo-sync | ✅ | - | - | - | - |
| act-knowledge-base | ✅ | - | - | - | - |
| storyteller-consent | - | ✅ | - | - | - |
| narrative-sovereignty | - | ✅ | - | - | - |
| justice-forkable-models | - | - | ✅ | - | - |
| community-court-design | - | - | ✅ | - | - |
| harvest-csa-operations | - | - | - | ✅ | - |
| volunteer-coordination | - | - | - | ✅ | - |
| bcv-residency-booking | - | - | - | - | ✅ |
| conservation-first | - | - | - | - | ✅ |

---

## 🚀 Workflow Examples

### Updating a Global Skill

```bash
# Update act-brand-alignment (benefits ALL projects)
cd ~/act-global-skills/skills/act-brand-alignment

# Edit SKILL.md or references
code SKILL.md

# Commit and push
git add -A
git commit -m "Update brand guidelines for 2026"
git push

# ALL projects now have updated skill (via symlink)
```

### Creating a Project-Specific Skill

```bash
# In Empathy Ledger project
cd "/Users/benknight/Code/Empathy Ledger v.02/.claude/skills/local"

mkdir storyteller-consent
cd storyteller-consent

# Create SKILL.md
cat > SKILL.md << 'EOF'
---
name: storyteller-consent
description: Consent frameworks for ethical storytelling in Empathy Ledger
---

# Storyteller Consent Framework

## When to Use
- Designing consent flows for storytellers
- Implementing data sovereignty principles
- Creating value-sharing agreements

[... skill content ...]
EOF

# This skill is ONLY available in Empathy Ledger
```

### Using MCP Servers

```bash
# In any project with Notion MCP configured
# Claude can now directly query Notion

"Query the Notion Projects database for all active projects"
# → Claude uses Notion MCP to fetch data

"Create a GitHub PR for this feature"
# → Claude uses GitHub MCP to create PR
```

---

## 🔧 Setup Script

**File**: `~/act-global-skills/setup-project.sh`

```bash
#!/bin/bash

# Setup a new ACT project with global skills
# Usage: ./setup-project.sh /path/to/project "Project Name"

PROJECT_PATH=$1
PROJECT_NAME=$2
GLOBAL_SKILLS_PATH=~/act-global-skills

if [ -z "$PROJECT_PATH" ] || [ -z "$PROJECT_NAME" ]; then
    echo "Usage: $0 <project-path> <project-name>"
    exit 1
fi

cd "$PROJECT_PATH"

echo "Setting up Claude configuration for $PROJECT_NAME..."

# Create .claude directory structure
mkdir -p .claude/skills/{global,local}

# Symlink global skills
echo "Linking global skills..."
for skill in "$GLOBAL_SKILLS_PATH/skills/"*; do
    skill_name=$(basename "$skill")
    ln -s "$skill" ".claude/skills/global/$skill_name"
    echo "  ✅ Linked $skill_name"
done

# Copy MCP config template
echo "Creating MCP configuration..."
cp "$GLOBAL_SKILLS_PATH/templates/mcp.json.template" .claude/mcp.json

# Create CLAUDE.md from template
echo "Creating CLAUDE.md..."
sed "s/{PROJECT_NAME}/$PROJECT_NAME/g" \
    "$GLOBAL_SKILLS_PATH/templates/CLAUDE.md.template" > CLAUDE.md

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Edit CLAUDE.md to add project-specific context"
echo "  2. Add project-specific skills to .claude/skills/local/"
echo "  3. Configure .claude/mcp.json if needed"
echo ""
```

---

## 📈 Benefits

### For Development

**Single Update, Global Benefit**:
- Update brand guidelines once → all projects benefit
- Fix GHL skill bug once → all projects fixed
- Add new best practice → propagates everywhere

**Project Autonomy**:
- Projects can override global skills when needed
- Project-specific skills stay isolated
- No cross-contamination

**Easy Onboarding**:
- New project? Run `setup-project.sh`
- Instant access to all global skills
- Consistent development experience

### For Maintenance

**Version Control**:
- Global skills in dedicated repo
- Track changes with git
- Rollback if needed

**Clear Ownership**:
- Global skills → team responsibility
- Project skills → project maintainer

**Scalability**:
- Add new project? Just symlink
- Add new skill? Available everywhere
- Remove project? No orphaned skills

---

## 🎯 Migration Plan

### Phase 1: Setup Global Repository

- [ ] Create `~/act-global-skills/` directory
- [ ] Initialize git repository
- [ ] Create directory structure
- [ ] Add README and templates

### Phase 2: Move Global Skills

- [ ] Move `act-brand-alignment` to global
- [ ] Move `ghl-crm-advisor` to global
- [ ] Commit and push

### Phase 3: Setup ACT Farm (This Repo)

- [ ] Create `.claude/skills/{global,local}/`
- [ ] Symlink global skills
- [ ] Move `act-knowledge-base` to local
- [ ] Create CLAUDE.md
- [ ] Test skill loading

### Phase 4: Setup Other Projects

- [ ] Empathy Ledger - symlink + CLAUDE.md
- [ ] JusticeHub - symlink + CLAUDE.md
- [ ] The Harvest - symlink + CLAUDE.md
- [ ] BCV - symlink + CLAUDE.md

### Phase 5: MCP Servers

- [ ] Create global MCP configs
- [ ] Setup Notion MCP
- [ ] Setup GitHub MCP
- [ ] Setup Supabase MCP
- [ ] Test in each project

### Phase 6: Create New Global Skills

- [ ] `act-operations` (finance, Notion, operations)
- [ ] `act-technical-stack` (Next.js, Supabase, common patterns)

---

## 📚 Resources

**Claude Code**:
- [Skills Documentation](https://docs.anthropic.com/claude/docs/skills)
- [MCP Overview](https://www.anthropic.com/news/model-context-protocol)
- [Best Practices](https://docs.anthropic.com/claude/docs/claude-code-best-practices)

**ACT Documentation**:
- [SKILLS_GUIDE.md](.claude/SKILLS_GUIDE.md) - How to use skills
- [DOCUMENTATION_SUMMARY.md](DOCUMENTATION_SUMMARY.md) - Docs overview

---

**Created**: 2025-12-26
**Status**: Architecture Designed, Ready for Implementation
**Priority**: HIGH - Enables skills to scale across all ACT projects

**Next Step**: Decide if you want to implement this architecture, then continue with documentation reorganization.
