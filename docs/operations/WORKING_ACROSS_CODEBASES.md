# Working Across ACT Codebases - Quick Guide

**Updated:** December 30, 2024
**Purpose:** Know what goes where and how to navigate the ACT ecosystem

---

## 🗺️ The Map: What Goes Where

### 📦 **act-global-infrastructure** (NEW!)
**Path:** `/Users/benknight/act-global-infrastructure`
**What Lives Here:**
- ✅ **GitHub automation scripts** - Issue tagging, project field management, milestone automation
- ✅ **Notion integration scripts** - GitHub → Notion sync, sprint tracking, database setup
- ✅ **Planning databases** - Yearly Goals, 6-Month Phases, Moon Cycles, Sprint Tracking
- ✅ **Operational documentation** - Sprint system design, milestone guides, automation guides
- ✅ **Cross-repo utilities** - Scripts that work across all 6+ ACT projects

**When to Work Here:**
- Setting up GitHub automation (auto-tagging, project management)
- Creating/managing Notion databases
- Writing scripts that sync data across repos
- Documenting operational processes (sprints, milestones, workflows)
- Working on planning/tracking infrastructure

**What NOT to Put Here:**
- Project-specific code (that goes in individual repos)
- User-facing features (those go in ACT Studio or project repos)

---

### 🏗️ **ACT Studio** (Main Website)
**Path:** `/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio`
**What Lives Here:**
- ✅ **Source of truth for shared TypeScript types**
- ✅ **Living Wiki knowledge base** (Gmail/Notion extraction)
- ✅ **Multi-project dashboard** (operations hub)
- ✅ **ACT ecosystem showcase** (all projects overview)
- ✅ **GoHighLevel CRM integration**
- ✅ **Cross-codebase documentation** (this file!)

**When to Work Here:**
- Defining shared types used by multiple projects
- Building the knowledge base / wiki
- Creating dashboards that show data from all projects
- Writing brand guidelines, ecosystem docs
- Managing GHL CRM workflows

---

### 💙 **Empathy Ledger v2**
**Path:** `/Users/benknight/Code/Empathy Ledger v.02`
**What Lives Here:**
- ✅ **Ethical storytelling platform**
- ✅ **API provider for featured content**
- ✅ **Cultural archive**
- ✅ **Consent-first story management**

**When to Work Here:**
- Building story collection features
- Managing consent workflows
- Creating APIs for other projects to consume

---

### ⚖️ **JusticeHub**
**Path:** `/Users/benknight/Code/JusticeHub`
**What Lives Here:**
- ✅ **Youth justice platform**
- ✅ **Service directory**
- ✅ **Program enrollment**

---

### 🌱 **The Harvest**
**Path:** `/Users/benknight/Code/The Harvest Website`
**GitHub:** `harvest-community-hub`
**What Lives Here:**
- ✅ **Community hub**
- ✅ **Therapeutic horticulture programs**
- ✅ **Events calendar**
- ✅ **Heritage preservation**

---

### 🦅 **ACT Farm**
**Path:** `/Users/benknight/Code/ACT Farm/act-farm`
**What Lives Here:**
- ✅ **Tourism site**
- ✅ **Artist residencies**
- ✅ **Conservation showcase**
- ✅ **Bookings system**

---

### 🔧 **ACT Placemat**
**Path:** `/Users/benknight/Code/ACT Placemat`
**What Lives Here:**
- ✅ **Backend services**
- ✅ **Year-in-review generator**
- ✅ **Project metadata**
- ✅ **Subscription tracking**

---

### ♻️ **Goods Asset Register**
**Path:** `/Users/benknight/Code/Goods Asset Register`
**What Lives Here:**
- ✅ **Goods on Country asset tracking**

---

## 🎯 Quick Decision Tree: Where Does This Go?

### "I'm working on GitHub automation"
→ **act-global-infrastructure** (`/scripts/`, `/docs/operations/`)

### "I'm creating Notion databases for planning"
→ **act-global-infrastructure** (`/scripts/`, `/config/`)

### "I'm syncing GitHub issues to Notion"
→ **act-global-infrastructure** (`/scripts/sync-github-to-notion.mjs`)

### "I'm defining TypeScript types used by multiple projects"
→ **ACT Studio** (`/src/types/shared/`) - then sync to other repos

### "I'm building a dashboard that shows all project health"
→ **ACT Studio** (`/src/app/admin/dashboard/`)

### "I'm extracting knowledge from Gmail/Notion for the wiki"
→ **ACT Studio** (`/src/lib/knowledge/`)

### "I'm building a storytelling feature"
→ **Empathy Ledger** (`/src/app/`, `/src/components/`)

### "I'm creating an API endpoint for featured content"
→ **Empathy Ledger** (`/src/app/api/v1/`)

### "I'm building a GHL CRM workflow"
→ **ACT Studio** (`/src/lib/ghl/`, `/src/app/api/webhooks/ghl/`)

---

## 🚀 How to Work Across Codebases

### Option 1: VS Code Multi-Root Workspace (Recommended)

**Setup:**
```bash
# Open the workspace in VS Code
code /Users/benknight/Code/ACT-Ecosystem.code-workspace
```

**Benefits:**
- See all 7 repos in one window
- Search across all codebases at once
- Navigate between repos easily in sidebar
- Run tasks across all repos

**Current Workspace Includes:**
1. 🏗️ ACT Studio
2. 💙 Empathy Ledger
3. ⚖️ JusticeHub
4. 🌱 The Harvest
5. ♻️ Goods
6. 🦅 ACT Farm
7. **🔧 act-global-infrastructure** (we should add this!)

---

### Option 2: Claude Code Working Directories

Claude Code can work across multiple directories in one session:

**Your Current Setup:**
- Primary: `/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio`
- Additional: `/Users/benknight/Code`
- Additional: `/Users/benknight/act-global-infrastructure`

**How It Works:**
- I can read/write files in any of these directories
- Specify full paths when asking me to work in different repos
- Example: "Edit `/Users/benknight/act-global-infrastructure/scripts/sync-github-to-notion.mjs`"

---

## 📋 Common Cross-Codebase Workflows

### 1. **Creating GitHub Automation**

**Where:** `act-global-infrastructure`

```bash
cd /Users/benknight/act-global-infrastructure

# Create script
touch scripts/new-automation.mjs

# Test locally
node scripts/new-automation.mjs

# Deploy to GitHub Actions
# Edit .github/workflows/
# Push to trigger
```

**Files to Update:**
- Script: `/scripts/new-automation.mjs`
- Workflow: `/.github/workflows/new-workflow.yml`
- Docs: `/docs/operations/AUTOMATION_GUIDE.md`

---

### 2. **Setting Up Notion Integration**

**Where:** `act-global-infrastructure`

```bash
cd /Users/benknight/act-global-infrastructure

# Create database setup script
touch scripts/create-notion-database.mjs

# Update config
vim config/notion-database-ids.json

# Run setup
NOTION_TOKEN="$NOTION_TOKEN" node scripts/create-notion-database.mjs
```

**Files to Update:**
- Script: `/scripts/create-notion-database.mjs`
- Config: `/config/notion-database-ids.json`
- Docs: `/docs/NOTION_SETUP_GUIDE.md`

---

### 3. **Adding Shared TypeScript Types**

**Where:** `ACT Studio` → sync to other repos

```bash
cd "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio"

# 1. Define type in ACT Studio (source of truth)
vim src/types/shared/new-type.ts

# 2. Sync to other repos (if needed)
./scripts/sync-types.sh

# 3. Verify
./scripts/type-check-all.sh
```

**Read More:** [multi-repo-management.md](./multi-repo-management.md)

---

### 4. **Building Cross-Project Dashboard**

**Where:** `ACT Studio`

```bash
cd "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio"

# Create component
vim src/components/dashboard/NewMetric.tsx

# Create API route
vim src/app/api/dashboard/new-metric/route.ts

# Test locally
npm run dev  # Port 3002
```

---

### 5. **Creating API in One Repo, Consuming in Another**

**Example:** Empathy Ledger API → ACT Studio client

**Step 1: Define type in ACT Studio**
```typescript
// /Users/benknight/Code/ACT Farm and Regenerative Innovation Studio/src/types/shared/story.ts
export interface Story {
  id: string;
  title: string;
  // ...
}
```

**Step 2: Sync type to Empathy Ledger**
```bash
cd "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio"
./scripts/sync-types.sh
```

**Step 3: Implement API in Empathy Ledger**
```typescript
// /Users/benknight/Code/Empathy Ledger v.02/src/app/api/v1/stories/route.ts
import { Story } from '@/types/shared/story';
export async function GET() {
  const stories: Story[] = await getStories();
  return NextResponse.json(stories);
}
```

**Step 4: Create client in ACT Studio**
```typescript
// /Users/benknight/Code/ACT Farm and Regenerative Innovation Studio/src/lib/empathy-ledger-stories.ts
export async function fetchStories(): Promise<Story[]> {
  const res = await fetch('http://localhost:3001/api/v1/stories');
  return res.json();
}
```

**Read More:** [multi-repo-management.md](./multi-repo-management.md)

---

## 🔍 Finding What You Need

### "Where's the GitHub automation for auto-tagging?"
→ `/Users/benknight/act-global-infrastructure/.github/workflows/auto-tag-project-items.yml`

### "Where's the Notion sync script?"
→ `/Users/benknight/act-global-infrastructure/scripts/sync-github-to-notion.mjs`

### "Where are sprint/milestone scripts?"
→ `/Users/benknight/act-global-infrastructure/scripts/assign-milestones.js`
→ `/Users/benknight/act-global-infrastructure/scripts/sync-milestone-dates.js`

### "Where's the dashboard code?"
→ `/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio/src/app/admin/dashboard/`

### "Where are shared TypeScript types defined?"
→ `/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio/src/types/shared/`

### "Where's the knowledge base extraction code?"
→ `/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio/src/lib/knowledge/`

### "Where's the GHL CRM integration?"
→ `/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio/src/lib/ghl/`

---

## 🎨 Visual Map

```
act-global-infrastructure/          ← GitHub automation, Notion sync, planning
├── .github/workflows/              ← Auto-tagging, sync workflows
├── scripts/                        ← Automation scripts
├── config/                         ← Database IDs, settings
└── docs/operations/                ← Operational guides

ACT Studio/                         ← Source of truth for types, dashboards, wiki
├── src/types/shared/               ← SHARED TYPES (sync to other repos)
├── src/app/admin/dashboard/        ← Multi-project dashboard
├── src/lib/knowledge/              ← Wiki extraction
├── src/lib/ghl/                    ← GHL CRM integration
└── docs/                           ← Ecosystem documentation

Empathy Ledger/                     ← Storytelling platform, API provider
├── src/app/api/v1/                 ← APIs consumed by other projects
└── src/types/shared/               ← SYNCED from ACT Studio

JusticeHub/                         ← Youth justice platform
The Harvest/                        ← Community hub
ACT Farm/                           ← Tourism & residencies
ACT Placemat/                       ← Backend services
Goods/                              ← Asset tracking
```

---

## 🛠️ Tools & Commands

### Git Status Across All Repos
```bash
cd /Users/benknight/Code
for dir in "ACT Farm and Regenerative Innovation Studio" "Empathy Ledger v.02" "JusticeHub" "The Harvest Website" "Goods Asset Register" "ACT Farm/act-farm"; do
  echo "\n📦 $dir"
  cd "/Users/benknight/Code/$dir" && git status -s
done

cd /Users/benknight/act-global-infrastructure && echo "\n📦 act-global-infrastructure" && git status -s
```

### Open VS Code Workspace
```bash
code /Users/benknight/Code/ACT-Ecosystem.code-workspace
```

### Type Check All Repos
```bash
cd "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio"
./scripts/type-check-all.sh
```

---

## 📚 Related Documentation

- [multi-repo-management.md](./multi-repo-management.md) - Detailed multi-repo guide (15,000+ words)
- [CROSS_CODEBASE_BEST_PRACTICES.md](./CROSS_CODEBASE_BEST_PRACTICES.md) - Principles & workflows
- [WORLD_CLASS_WORKFLOW.md](./WORLD_CLASS_WORKFLOW.md) - Daily development workflow
- [act-global-infrastructure/SUCCESS_SUMMARY.md](/Users/benknight/act-global-infrastructure/SUCCESS_SUMMARY.md) - Notion setup success summary

---

## 💡 Tips

1. **Use the VS Code workspace** - Easier to navigate and search across repos
2. **Check `act-global-infrastructure` first** for automation/operational scripts
3. **Define types in ACT Studio** - It's the source of truth
4. **Document in the right repo** - Operations docs → `act-global-infrastructure`, ecosystem docs → ACT Studio
5. **Ask me with full paths** - Be explicit: "Edit `/Users/benknight/act-global-infrastructure/scripts/sync.mjs`"

---

**Last Updated:** December 30, 2024
**Maintained By:** Ben Knight + Claude AI
