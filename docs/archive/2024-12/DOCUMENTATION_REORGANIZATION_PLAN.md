# ACT Documentation Reorganization Plan

**Created**: 2025-12-26
**Status**: Ready for Implementation
**Priority**: HIGH - Improves both human and Claude Code navigation

---

## 🎯 Executive Summary

**Current State**: 85 markdown files in root directory (37,884 lines), plus 34 in `.claude/` directory

**Problems**:
- Cognitive overload (too many files in root)
- Redundancy (5+ ecosystem docs, 13 GHL docs, 35+ temporal snapshots)
- Confusion (multiple competing entry points and sources of truth)
- Claude Code inefficiency (context window waste, bloated skills)

**Solution**: Reduce root to 5 core files, organize rest into logical `docs/` structure, archive temporal snapshots

**Benefits**:
- ✅ Faster navigation for humans
- ✅ Efficient context loading for Claude Code
- ✅ Clear single source of truth
- ✅ Professional, maintainable documentation

---

## 📊 By The Numbers

| Metric | Current | After Reorganization | Improvement |
|--------|---------|----------------------|-------------|
| Root directory files | 85 | 5 | **94% reduction** |
| GHL docs in root | 13 | 0 | **All organized** |
| Temporal snapshots in root | 35+ | 0 | **All archived** |
| act-knowledge-base skill files | 21 (373KB) | 6 (est. 120KB) | **68% reduction** |
| Duplicate/redundant docs | 20+ | 0 | **Consolidated** |
| Entry points | 4+ competing | 1 canonical | **Clear path** |

---

## 🗂️ Target Architecture

```
/
├── START_HERE.md                    ← 🎯 PRIMARY entry point
├── ACT_MASTER_PLAN.md               ← 📋 Canonical ecosystem plan
├── CODEBASE_STRUCTURE.md            ← 🏗️ Codebase organization
├── CHANGELOG.md                     ← 📝 Version history
├── README.md                        ← 📖 Project overview (if exists)
│
├── docs/
│   ├── INDEX.md                     ← 🗺️ Complete navigation guide
│   │
│   ├── quick-starts/                ← ⚡ Get started fast
│   │   ├── dashboard.md
│   │   ├── ghl.md
│   │   └── dev-environment.md
│   │
│   ├── architecture/                ← 🏛️ System design
│   │   ├── ecosystem-overview.md
│   │   ├── supabase-ghl-integration.md
│   │   └── people-intelligence.md
│   │
│   ├── features/                    ← ✨ Feature implementation
│   │   ├── dashboard/
│   │   ├── knowledge-base/
│   │   ├── media-gallery/
│   │   └── story-impact/
│   │
│   ├── integrations/                ← 🔌 External integrations
│   │   ├── ghl/                     ← (13 files → 6-8 files)
│   │   ├── notion/
│   │   ├── gmail/
│   │   ├── openai/
│   │   └── supabase/
│   │
│   ├── infrastructure/              ← 🖥️ Infrastructure setup
│   │   ├── synology-nas.md
│   │   ├── redis-cache.md
│   │   └── chromadb.md
│   │
│   ├── development/                 ← 💻 Developer guides
│   │   ├── vscode-setup.md
│   │   ├── multi-repo-management.md
│   │   └── best-practices.md
│   │
│   ├── operations/                  ← ⚙️ Day-to-day operations
│   │   └── environment-variables.md
│   │
│   ├── strategy/                    ← 📈 Strategic planning
│   │   ├── content-engagement.md
│   │   ├── email-strategy.md
│   │   └── roadmap.md
│   │
│   ├── brand/                       ← 🎨 Brand & content
│   │   ├── visual-strategy.md
│   │   └── content-drafts/
│   │
│   ├── projects/                    ← 📁 Project-specific docs
│   │   ├── empathy-ledger/
│   │   ├── justicehub/
│   │   ├── harvest/
│   │   └── bcv/
│   │
│   ├── standards/                   ← 📏 Standards & conventions
│   │   └── unified-project-standards.md
│   │
│   ├── examples/                    ← 📚 Code examples
│   │   └── integration-examples.md
│   │
│   └── archive/                     ← 📦 Historical docs
│       └── 2024-12/                 ← (35+ temporal snapshots)
│
└── .claude/                         ← 🤖 Claude Code configuration
    ├── README.md
    ├── SKILLS_GUIDE.md
    ├── SKILLS_MAP.md
    └── skills/
        ├── act-brand-alignment/     ← ✅ Keep as-is (well-organized)
        ├── ghl-crm-advisor/         ← ✅ Keep as-is (well-organized)
        └── act-knowledge-base/      ← 🔧 Slim down (21 → 6 files)
```

---

## 📋 Implementation Checklist

### Phase 1: Setup (30 minutes)

- [ ] **Create directory structure**
  ```bash
  ./scripts/create-docs-structure.sh
  ```

- [ ] **Review current files**
  ```bash
  ls -lh *.md | wc -l  # Count root .md files
  ```

- [ ] **Backup current state**
  ```bash
  git add -A
  git commit -m "Backup before documentation reorganization"
  ```

---

### Phase 2: Archive Temporal Snapshots (20 minutes)

**Move 35+ temporal "COMPLETE" / "STATUS" / "SUMMARY" files:**

- [ ] `SETUP_COMPLETE.md` → `docs/archive/2024-12/`
- [ ] `MULTI_PROJECT_SETUP_COMPLETE.md` → `docs/archive/2024-12/`
- [ ] `SYSTEM_SETUP_COMPLETE.md` → `docs/archive/2024-12/`
- [ ] `SYSTEM_STATUS_COMPLETE.md` → `docs/archive/2024-12/`
- [ ] `ENGAGEMENT_SYSTEM_COMPLETE.md` → `docs/archive/2024-12/`
- [ ] `PHASE_2_COMPLETE.md` → `docs/archive/2024-12/`
- [ ] All `QUICK_WIN_*_COMPLETE.md` files → `docs/archive/2024-12/`
- [ ] All `*_IMPLEMENTATION_STATUS.md` files → `docs/archive/2024-12/`
- [ ] All `*_PROGRESS.md` files → `docs/archive/2024-12/`
- [ ] All `*_UPDATE.md` files → `docs/archive/2024-12/`

**Script**: `./scripts/archive-temporal-docs.sh`

---

### Phase 3: Organize by Category (45 minutes)

#### A. Quick Starts
- [ ] `QUICK_START.md` → `docs/quick-starts/dashboard.md`
- [ ] `QUICK_START_GHL.md` + `GHL_SETUP_GUIDE.md` → `docs/quick-starts/ghl.md` (merge)
- [ ] `README_STARTUP.md` content → merge into `START_HERE.md`
- [ ] `DEV_HUB_SETUP.md` → `docs/quick-starts/dev-environment.md`

#### B. Architecture
- [ ] `ACT_ECOSYSTEM.md` + `ACT_ECOSYSTEM_ARCHITECTURE.md` → merge into `ACT_MASTER_PLAN.md`
- [ ] `ACT_COMPLETE_SYSTEM.md` → merge into `ACT_MASTER_PLAN.md`
- [ ] `SUPABASE_GHL_INTEGRATION_ARCHITECTURE.md` → `docs/architecture/supabase-ghl.md`
- [ ] `ACT_PEOPLE_INTELLIGENCE_ARCHITECTURE.md` → `docs/architecture/people-intelligence.md`

#### C. Features
- [ ] `DASHBOARD_IMPLEMENTATION_GUIDE.md` → `docs/features/dashboard/implementation.md`
- [ ] `MEDIA_GALLERY_SETUP.md` → `docs/features/media-gallery/setup.md`
- [ ] `STORY_BASED_IMPACT_IMPLEMENTATION.md` → `docs/features/story-impact/implementation.md`
- [ ] `ADMIN_WIKI_ENHANCEMENTS.md` → `docs/features/knowledge-base/enhancements.md`

#### D. Integrations

**GHL (consolidate 13 → 6-8 files)**:
- [ ] `GHL_SETUP_GUIDE.md` → `docs/integrations/ghl/setup.md`
- [ ] `GHL_PIPELINE_STRATEGY.md` → `docs/integrations/ghl/pipeline-strategy.md`
- [ ] `GHL_WEBHOOK_SETUP_GUIDE.md` → `docs/integrations/ghl/webhooks.md`
- [ ] `GHL_LC_EMAIL_SETUP.md` → `docs/integrations/ghl/lc-email.md`
- [ ] `GHL_CROSS_ACCOUNT_CONTACT_STRATEGY.md` → `docs/integrations/ghl/contact-strategy.md`
- [ ] `GHL_MIGRATION_DECISION_GUIDE.md` → `docs/integrations/ghl/migration.md`
- [ ] Archive: `GHL_SETUP_CHECKLIST.md`, `GHL_IMPLEMENTATION_CHECKLIST.md` (redundant with setup.md)
- [ ] Archive: `GHL_CONTACT_SYNC_SUMMARY.md`, `GHL_LC_EMAIL_INTEGRATION_SUMMARY.md` (summaries)

**Other Integrations**:
- [ ] `GMAIL_OAUTH_SETUP.md` + `GMAIL_SCANNER_SETUP.md` → `docs/integrations/gmail/`
- [ ] `NOTION_SETUP_INSTRUCTIONS.md` + `NOTION_ACCESS_SUMMARY.md` → `docs/integrations/notion/setup.md`
- [ ] `OPENAI_SETUP.md` → `docs/integrations/openai/setup.md`
- [ ] `EMPATHY_LEDGER_IMPACT_INTEGRATION.md` → `docs/integrations/empathy-ledger/impact.md`

#### E. Infrastructure
- [ ] `SYNOLOGY_SETUP_GUIDE.md` + `NAS_QUICK_SETUP.md` → `docs/infrastructure/synology-nas.md` (merge)

#### F. Development
- [ ] `VSCODE_SETUP.md` → `docs/development/vscode-setup.md`
- [ ] `MULTI_REPO_MANAGEMENT.md` → `docs/development/multi-repo.md`
- [ ] `CROSS_CODEBASE_BEST_PRACTICES.md` → `docs/development/best-practices.md`

#### G. Operations
- [ ] `ENV_AUDIT_AND_MANAGEMENT.md` + `ENV_QUICK_START.md` → `docs/operations/environment-vars.md`

#### H. Strategy
- [ ] `CONTENT_ENGAGEMENT_GUIDE.md` → `docs/strategy/content-engagement.md`
- [ ] `EMAIL_DOMAIN_STRATEGY.md` + `EMAIL_STRATEGY_GHL_NATIVE.md` → `docs/strategy/email.md`
- [ ] `ACT-ECOSYSTEM-ROADMAP.md` + `NEXT_STEPS_ROADMAP.md` → `docs/strategy/roadmap.md`

#### I. Brand
- [ ] `ACT_ECOSYSTEM_VISUAL_STRATEGY.md` → `docs/brand/visual-strategy.md`
- [ ] `DRAFT_MISSION_AND_ABOUT.md` → `docs/brand/content-drafts/mission.md`
- [ ] `DRAFT_BIOS.md` → `docs/brand/content-drafts/bios.md`

#### J. Standards
- [ ] `UNIFIED_PROJECT_STANDARDS.md` → `docs/standards/unified-standards.md`

#### K. Examples
- [ ] `INTEGRATION_EXAMPLE.md` → `docs/examples/integration.md`

#### L. Projects
- [ ] `EMPATHY_LEDGER_SETUP_GUIDE.md` → `docs/projects/empathy-ledger/setup.md`
- [ ] `HARVEST_TENANT_UPDATE.md` → `docs/projects/harvest/tenant-update.md`
- [ ] `ACT_PROJECT_ENRICHMENT_SETUP.md` → `docs/features/project-enrichment/setup.md`

---

### Phase 4: Consolidate & Clean .claude/ (30 minutes)

**act-knowledge-base skill (reduce 21 → 6 files)**:

**Keep (6 files)**:
- [ ] `skill.md` ✅
- [ ] `README.md` ✅
- [ ] `START_HERE.md` ✅
- [ ] `ACT_LIVING_WIKI_ARCHITECTURE.md` (rename to `ARCHITECTURE.md`) ✅
- [ ] `IMPLEMENTATION_GUIDE.md` (consolidate from INTEGRATION_GUIDE + IMPLEMENTATION_SUMMARY) ✅
- [ ] `QUICK_START.md` ✅

**Archive (15 files)**:
- [ ] `ACT_COMPLETE_KNOWLEDGE_BASE.md` → `.claude/skills/act-knowledge-base/archive/`
- [ ] `ACT_COMPLETE_KNOWLEDGE_BASE_PART_2.md` → archive
- [ ] All `*_COMPLETE.md` files → archive
- [ ] All `*_SUMMARY.md` files → archive
- [ ] All `*_STATUS.md` files → archive
- [ ] `LLM_TRAINING_STRATEGY.md` → archive (or move to main docs if still relevant)
- [ ] `OPTION_3_OPEN_SOURCE_STRATEGY.md` → archive
- [ ] `HOW_TO_IMPROVE_WIKI.md` → archive or merge into README

**Other .claude/ cleanup**:
- [ ] Archive or complete: `multi-repo-sync.md`, `act-project-enrichment.md`
- [ ] Archive: `ACT_SKILLS_SUMMARY.md` (superseded by SKILLS_GUIDE.md)

---

### Phase 5: Create Navigation Aids (30 minutes)

- [ ] **Create `docs/INDEX.md`** - Comprehensive navigation guide
  ```markdown
  # Documentation Index

  ## Getting Started
  - [Start Here](../START_HERE.md) - Primary entry point
  - [Quick Starts](quick-starts/) - Get up and running fast

  ## Architecture & Planning
  - [ACT Master Plan](../ACT_MASTER_PLAN.md) - Canonical ecosystem plan
  - [Architecture](architecture/) - System design documents

  [... complete navigation tree ...]
  ```

- [ ] **Update `START_HERE.md`** - Reference new structure
  ```markdown
  ## Documentation Structure

  - **This file** - Start here for onboarding
  - **[ACT Master Plan](ACT_MASTER_PLAN.md)** - Complete ecosystem overview
  - **[Quick Starts](docs/quick-starts/)** - Fast-track guides
  - **[Full Index](docs/INDEX.md)** - Complete documentation map
  ```

- [ ] **Update `.claude/SKILLS_GUIDE.md`** - Update file paths to new locations

- [ ] **Add "See Also" links** - Cross-reference related docs

---

### Phase 6: Cleanup & Verification (20 minutes)

- [ ] **Delete duplicate README files**
  ```bash
  # Keep only primary README.md
  # Remove: README_STARTUP.md, README_ECOSYSTEM.md (merged into START_HERE/MASTER_PLAN)
  ```

- [ ] **Verify all moves**
  ```bash
  # Check no broken links
  ./scripts/check-broken-links.sh
  ```

- [ ] **Update git**
  ```bash
  git add -A
  git status  # Review changes
  git commit -m "Reorganize documentation: 85 files → structured docs/"
  ```

- [ ] **Test Claude Code skill loading**
  - Invoke each skill
  - Verify references load correctly
  - Check no missing files

---

## 🔧 Implementation Scripts

### 1. Create Directory Structure

**File**: `scripts/create-docs-structure.sh`

```bash
#!/bin/bash

echo "Creating documentation structure..."

mkdir -p docs/{quick-starts,architecture,features,integrations,infrastructure,development,operations,strategy,brand,projects,standards,examples,archive/2024-12}

# Features subdirectories
mkdir -p docs/features/{dashboard,knowledge-base,media-gallery,story-impact,project-enrichment}

# Integrations subdirectories
mkdir -p docs/integrations/{ghl,notion,gmail,openai,supabase,empathy-ledger}

# Brand subdirectories
mkdir -p docs/brand/content-drafts

# Projects subdirectories
mkdir -p docs/projects/{empathy-ledger,justicehub,harvest,bcv}

# .claude skill cleanup
mkdir -p .claude/skills/act-knowledge-base/archive

echo "✅ Directory structure created"
ls -R docs/
```

---

### 2. Archive Temporal Snapshots

**File**: `scripts/archive-temporal-docs.sh`

```bash
#!/bin/bash

ARCHIVE_DIR="docs/archive/2024-12"

echo "Archiving temporal snapshot documents..."

# List of temporal files to archive
temporal_files=(
  "SETUP_COMPLETE.md"
  "MULTI_PROJECT_SETUP_COMPLETE.md"
  "SYSTEM_SETUP_COMPLETE.md"
  "SYSTEM_STATUS_COMPLETE.md"
  "ENGAGEMENT_SYSTEM_COMPLETE.md"
  "PHASE_2_COMPLETE.md"
  "QUICK_WIN_1_COMPLETE.md"
  "QUICK_WIN_2_COMPLETE.md"
  "QUICK_WIN_3_COMPLETE.md"
  "VERIFICATION_SYSTEM_COMPLETE.md"
  "DEPLOYMENT_COMPLETE.md"
  "LIVING_WIKI_COMPLETE.md"
  "WIKI_SCAN_SUCCESS.md"
  "GHL_IMPLEMENTATION_STATUS.md"
  "GHL_IMPLEMENTATION_CHECKLIST.md"
  "GHL_INTEGRATION_PROGRESS.md"
  "GHL_CONTACT_SYNC_SUMMARY.md"
  "GHL_LC_EMAIL_INTEGRATION_SUMMARY.md"
  "OPTIMIZATION_SUMMARY.md"
  "STARTUP_IMPROVEMENTS.md"
  "PROGRESS-UPDATE.md"
  "HARVEST_TENANT_UPDATE.md"
  "FIX_GMAIL_AUTH.md"
  "SKILL_PROPOSAL_GHL_ADVISOR.md"
)

for file in "${temporal_files[@]}"; do
  if [ -f "$file" ]; then
    echo "  Archiving: $file"
    mv "$file" "$ARCHIVE_DIR/"
  fi
done

echo "✅ Archived ${#temporal_files[@]} temporal documents to $ARCHIVE_DIR"
```

---

### 3. Move & Consolidate Files

**File**: `scripts/reorganize-docs.sh`

```bash
#!/bin/bash

echo "Reorganizing documentation files..."

# Quick Starts
mv QUICK_START.md docs/quick-starts/dashboard.md
mv DEV_HUB_SETUP.md docs/quick-starts/dev-environment.md

# Architecture
mv SUPABASE_GHL_INTEGRATION_ARCHITECTURE.md docs/architecture/supabase-ghl.md
mv ACT_PEOPLE_INTELLIGENCE_ARCHITECTURE.md docs/architecture/people-intelligence.md

# Features
mv DASHBOARD_IMPLEMENTATION_GUIDE.md docs/features/dashboard/implementation.md
mv MEDIA_GALLERY_SETUP.md docs/features/media-gallery/setup.md
mv STORY_BASED_IMPACT_IMPLEMENTATION.md docs/features/story-impact/implementation.md
mv ADMIN_WIKI_ENHANCEMENTS.md docs/features/knowledge-base/enhancements.md
mv ACT_PROJECT_ENRICHMENT_SETUP.md docs/features/project-enrichment/setup.md
mv PROJECT_ENRICHMENT.md docs/features/project-enrichment/overview.md

# Integrations - GHL
mv GHL_SETUP_GUIDE.md docs/integrations/ghl/setup.md
mv GHL_PIPELINE_STRATEGY.md docs/integrations/ghl/pipeline-strategy.md
mv GHL_WEBHOOK_SETUP_GUIDE.md docs/integrations/ghl/webhooks.md
mv GHL_LC_EMAIL_SETUP.md docs/integrations/ghl/lc-email.md
mv GHL_CROSS_ACCOUNT_CONTACT_STRATEGY.md docs/integrations/ghl/contact-strategy.md
mv GHL_MIGRATION_DECISION_GUIDE.md docs/integrations/ghl/migration.md
mv GHL_SUBACCOUNT_STRATEGY.md docs/integrations/ghl/subaccount-strategy.md
mv GHL_AGENCY_LEVEL_GUIDE.md docs/integrations/ghl/agency-guide.md
mv GHL_ACCOUNT_DIAGNOSTIC.md docs/integrations/ghl/diagnostics.md

# Integrations - Others
mv GMAIL_OAUTH_SETUP.md docs/integrations/gmail/oauth-setup.md
mv GMAIL_SCANNER_SETUP.md docs/integrations/gmail/scanner-setup.md
mv NOTION_SETUP_INSTRUCTIONS.md docs/integrations/notion/setup.md
mv NOTION_ACCESS_SUMMARY.md docs/integrations/notion/access.md
mv OPENAI_SETUP.md docs/integrations/openai/setup.md
mv EMPATHY_LEDGER_IMPACT_INTEGRATION.md docs/integrations/empathy-ledger/impact.md

# Infrastructure
mv SYNOLOGY_SETUP_GUIDE.md docs/infrastructure/synology-nas.md
mv NAS_QUICK_SETUP.md docs/infrastructure/nas-quick-setup.md  # Will merge later

# Development
mv VSCODE_SETUP.md docs/development/vscode-setup.md
mv MULTI_REPO_MANAGEMENT.md docs/development/multi-repo.md
mv CROSS_CODEBASE_BEST_PRACTICES.md docs/development/best-practices.md

# Operations
mv ENV_AUDIT_AND_MANAGEMENT.md docs/operations/environment-vars.md
mv ENV_QUICK_START.md docs/operations/env-quick-start.md  # Will merge later

# Strategy
mv CONTENT_ENGAGEMENT_GUIDE.md docs/strategy/content-engagement.md
mv EMAIL_DOMAIN_STRATEGY.md docs/strategy/email.md
mv ACT-ECOSYSTEM-ROADMAP.md docs/strategy/roadmap.md
mv NEXT_STEPS_ROADMAP.md docs/strategy/next-steps.md  # Will merge later

# Brand
mv ACT_ECOSYSTEM_VISUAL_STRATEGY.md docs/brand/visual-strategy.md
mv DRAFT_MISSION_AND_ABOUT.md docs/brand/content-drafts/mission.md
mv DRAFT_BIOS.md docs/brand/content-drafts/bios.md

# Standards
mv UNIFIED_PROJECT_STANDARDS.md docs/standards/unified-standards.md

# Examples
mv INTEGRATION_EXAMPLE.md docs/examples/integration.md

# Projects
mv EMPATHY_LEDGER_SETUP_GUIDE.md docs/projects/empathy-ledger/setup.md

# Knowledge Base
mv KNOWLEDGE_SYSTEM_DESIGN.md docs/features/knowledge-base/system-design.md
mv LIVING_WIKI_RESEARCH_IMPROVEMENTS.md docs/features/knowledge-base/research.md
mv QUICK_WINS_IMPLEMENTATION.md docs/features/knowledge-base/quick-wins.md

echo "✅ Files reorganized into docs/ structure"
```

---

### 4. Cleanup .claude/act-knowledge-base

**File**: `scripts/cleanup-knowledge-base-skill.sh`

```bash
#!/bin/bash

SKILL_DIR=".claude/skills/act-knowledge-base"
ARCHIVE_DIR="$SKILL_DIR/archive"

echo "Cleaning up act-knowledge-base skill..."

# Archive bloat
mv "$SKILL_DIR/ACT_COMPLETE_KNOWLEDGE_BASE.md" "$ARCHIVE_DIR/"
mv "$SKILL_DIR/ACT_COMPLETE_KNOWLEDGE_BASE_PART_2.md" "$ARCHIVE_DIR/"
mv "$SKILL_DIR/LIVING_WIKI_COMPLETE.md" "$ARCHIVE_DIR/"
mv "$SKILL_DIR/VERIFICATION_SYSTEM_COMPLETE.md" "$ARCHIVE_DIR/"
mv "$SKILL_DIR/DEPLOYMENT_COMPLETE.md" "$ARCHIVE_DIR/"
mv "$SKILL_DIR/ACT_LIVING_WIKI_STATUS.md" "$ARCHIVE_DIR/"
mv "$SKILL_DIR/DELIVERY_SUMMARY.md" "$ARCHIVE_DIR/"
mv "$SKILL_DIR/LLM_TRAINING_STRATEGY.md" "$ARCHIVE_DIR/"
mv "$SKILL_DIR/OPTION_3_OPEN_SOURCE_STRATEGY.md" "$ARCHIVE_DIR/"
mv "$SKILL_DIR/HOW_TO_IMPROVE_WIKI.md" "$ARCHIVE_DIR/"

# Rename architecture doc
mv "$SKILL_DIR/ACT_LIVING_WIKI_ARCHITECTURE.md" "$SKILL_DIR/ARCHITECTURE.md"

echo "✅ Reduced skill from 21 to 6 core files"
echo "📦 Archived 10+ historical docs"
```

---

### 5. Consolidate Duplicates

**File**: `scripts/consolidate-duplicates.sh`

```bash
#!/bin/bash

echo "Consolidating duplicate documents..."

# Merge ecosystem docs into MASTER_PLAN
echo "  Merging ACT_ECOSYSTEM.md into ACT_MASTER_PLAN.md..."
# (Manual merge recommended - preserve unique content from both)

# Merge NAS setup docs
echo "  Merging NAS_QUICK_SETUP.md into synology-nas.md..."
cat docs/infrastructure/nas-quick-setup.md >> docs/infrastructure/synology-nas.md
rm docs/infrastructure/nas-quick-setup.md

# Merge env docs
echo "  Merging env-quick-start.md into environment-vars.md..."
cat docs/operations/env-quick-start.md >> docs/operations/environment-vars.md
rm docs/operations/env-quick-start.md

# Merge roadmap docs
echo "  Merging next-steps.md into roadmap.md..."
cat docs/strategy/next-steps.md >> docs/strategy/roadmap.md
rm docs/strategy/next-steps.md

echo "✅ Duplicates consolidated"
```

---

### 6. Check for Broken Links

**File**: `scripts/check-broken-links.sh`

```bash
#!/bin/bash

echo "Checking for broken internal links..."

# Find all markdown files
find . -name "*.md" -not -path "./node_modules/*" -not -path "./.next/*" | while read file; do
  # Extract markdown links
  grep -oP '\[.*?\]\(\K[^)]+' "$file" 2>/dev/null | while read link; do
    # Skip external links
    if [[ ! "$link" =~ ^http ]]; then
      # Resolve relative path
      dir=$(dirname "$file")
      target="$dir/$link"

      if [ ! -f "$target" ] && [ ! -d "$target" ]; then
        echo "❌ Broken link in $file: $link"
      fi
    fi
  done
done

echo "✅ Link check complete"
```

---

## 📝 Post-Reorganization Tasks

### Update Key Documents

1. **START_HERE.md**:
   ```markdown
   ## 📚 Documentation Structure

   This project uses an organized documentation system:

   - **Root directory**: Core entry points only
     - This file (START_HERE.md)
     - ACT_MASTER_PLAN.md (canonical ecosystem plan)
     - CODEBASE_STRUCTURE.md (codebase organization)

   - **docs/**: All other documentation
     - [Quick Starts](docs/quick-starts/) - Get started fast
     - [Architecture](docs/architecture/) - System design
     - [Features](docs/features/) - Feature implementation
     - [Integrations](docs/integrations/) - External integrations
     - [Full Index](docs/INDEX.md) - Complete navigation

   - **.claude/**: Claude Code skills and configuration
     - [Skills Guide](.claude/SKILLS_GUIDE.md) - Using Claude skills
   ```

2. **ACT_MASTER_PLAN.md**:
   - Add "Documentation" section referencing new structure
   - Update any file paths that changed

3. **.claude/SKILLS_GUIDE.md**:
   - Update all file path references
   - Update examples to use new paths

4. **Create docs/INDEX.md**:
   - Complete navigation tree
   - Organize by topic and use case
   - Include "Quick Find" section

---

## ✅ Success Criteria

After reorganization, you should have:

- [ ] **5 files in root** (vs 85)
- [ ] **Organized docs/** structure with clear categories
- [ ] **35+ temporal docs archived** to docs/archive/2024-12/
- [ ] **GHL docs consolidated** from 13 to 6-8 in docs/integrations/ghl/
- [ ] **act-knowledge-base skill** reduced from 21 to 6 files
- [ ] **Single source of truth** for each topic
- [ ] **Clear entry points** (START_HERE.md canonical)
- [ ] **No broken links**
- [ ] **Git history preserved**

---

## 🎯 Maintenance Guidelines

### Going Forward:

1. **New Documentation**:
   - Always create in appropriate `docs/` subdirectory
   - Never add to root (except rare exceptions like CHANGELOG)
   - Follow naming conventions

2. **Temporal Snapshots**:
   - Status/progress/complete docs go directly to `docs/archive/YYYY-MM/`
   - Never leave in root or active dirs

3. **Consolidation**:
   - Before creating new doc, check if topic already covered
   - Merge into existing doc if <50% new content
   - Split only if existing doc >10K lines

4. **Review Cadence**:
   - Monthly: Check for docs to archive
   - Quarterly: Review for consolidation opportunities
   - Annually: Major cleanup and reorganization if needed

---

## 📞 Need Help?

**Questions about reorganization?**
- Check [docs/INDEX.md](docs/INDEX.md) for navigation
- Review [.claude/SKILLS_GUIDE.md](.claude/SKILLS_GUIDE.md) for Claude skills
- Ask Claude: "Where should I put documentation about [topic]?"

**Found a broken link?**
- Run `./scripts/check-broken-links.sh`
- Fix and commit
- Update INDEX.md if path changed

---

**Created**: 2025-12-26
**Status**: Ready for Implementation
**Estimated Time**: 2-3 hours total
**Priority**: HIGH - Dramatically improves documentation usability

**Next Step**: Run Phase 1 scripts to create directory structure and begin reorganization.
