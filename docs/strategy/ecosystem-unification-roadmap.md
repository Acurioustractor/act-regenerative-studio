# ACT Ecosystem Unification Roadmap

**Created**: 2025-12-26
**Purpose**: Complete roadmap for unifying all ACT projects with standard templates, Claude skills, and visibility dashboards

---

## 🎯 The Vision

**Every ACT project should**:
- ✅ Follow the same structure and conventions
- ✅ Have Claude AI assistance available
- ✅ Be visible on unified dashboards
- ✅ Show its health and progress
- ✅ Be easy to contribute to
- ✅ Align with LCAA methodology

---

## 📋 The Three Pillars

### 1. **Standard Project Template**
All projects use the same structure, documentation, workflows, and conventions.

**Doc**: [act-project-template-strategy.md](../architecture/act-project-template-strategy.md)

---

### 2. **Unified Claude Skills**
Global skills available everywhere + project-specific assistants.

**Doc**: [act-project-template-strategy.md#claude-skills-architecture](../architecture/act-project-template-strategy.md#claude-skills-architecture)

---

### 3. **Ecosystem Dashboards**
Three dashboards showing all projects: team operations, public showcase, GitHub Projects.

**Doc**: [act-ecosystem-dashboard-strategy.md](../architecture/act-ecosystem-dashboard-strategy.md)

---

## 🗺️ Implementation Roadmap

### **Phase 1: Create Foundation** (6-8 hours)

**Goal**: Create the template and global skills repository

#### 1.1 Create `act-project-template` Repository
**Time**: 3-4 hours

**Tasks**:
- [ ] Create new GitHub repo: `act-project-template`
- [ ] Add standard `.github/` folder
  - [ ] Copy workflows from ACT Main
  - [ ] Copy issue templates
  - [ ] Copy PR template
  - [ ] Add labeler.yml template
  - [ ] Add CODEOWNERS template
- [ ] Add standard `docs/` structure
  - [ ] quick-starts/
  - [ ] architecture/
  - [ ] features/
  - [ ] integrations/
  - [ ] development/
  - [ ] strategy/
- [ ] Add standard `scripts/`
  - [ ] setup.sh
  - [ ] health-check.sh
- [ ] Create template files
  - [ ] CLAUDE.md template
  - [ ] CONTRIBUTING.md template
  - [ ] README.md template
- [ ] Write USAGE.md (how to use template)

**Deliverable**: Template repository ready for use

---

#### 1.2 Create Global Skills Repository
**Time**: 3-4 hours

**Tasks**:
- [ ] Create `~/act-global-skills/` directory
- [ ] Move existing skills to global:
  - [ ] `act-brand-alignment` (already exists)
  - [ ] `ghl-crm-advisor` (already exists)
- [ ] Create new global skills:
  - [ ] `act-github-pm` - GitHub project management
  - [ ] `act-deployment-helper` - Deployment troubleshooting
  - [ ] `act-security-advisor` - Security best practices
- [ ] Add global README.md
  - [ ] Skill catalog
  - [ ] Usage instructions
  - [ ] How to add new skills

**Deliverable**: Global skills ready to symlink

---

### **Phase 2: Align Existing Projects** (4-6 hours)

**Goal**: Update all 7 core repos to match template

**Per Project** (~30-45 min each):
- [ ] Add/update `CLAUDE.md`
- [ ] Symlink global skills: `ln -s ~/act-global-skills .claude/skills/global`
- [ ] Create project-specific skill in `.claude/skills/local/`
- [ ] Update `docs/` structure to match template
- [ ] Add standard scripts (`setup.sh`, `health-check.sh`)
- [ ] Ensure workflows are deployed
- [ ] Update `README.md` to match template format
- [ ] Add `CONTRIBUTING.md`

**Projects** (in priority order):
1. [ ] **act-regenerative-studio** (already ~80% aligned)
2. [ ] **empathy-ledger-v2** (high priority, public-facing)
3. [ ] **justicehub-platform** (high priority, public-facing)
4. [ ] **theharvest** (medium priority)
5. [ ] **act-farm** (low priority, internal)
6. [ ] **act-placemat** (medium priority)
7. [ ] **goods-asset-tracker** (low priority)

**Deliverable**: All 7 projects aligned to template

---

### **Phase 3: Build Team Dashboard** (6-8 hours)

**Goal**: Internal operations dashboard showing all project health

**Location**: `/admin/ecosystem` in ACT Studio

#### 3.1 Basic Dashboard (4-5 hours)
- [ ] Create page: `src/app/admin/ecosystem/page.tsx`
- [ ] Build components:
  - [ ] `ProjectHealthCard.tsx`
  - [ ] `EcosystemOverview.tsx`
- [ ] Create API routes:
  - [ ] `/api/ecosystem/projects` - List all projects
  - [ ] `/api/ecosystem/health` - Health check all projects
- [ ] Fetch from GitHub API:
  - [ ] Repos data
  - [ ] Issues count
  - [ ] PRs count
  - [ ] Latest commit
- [ ] Display 7 project cards with health status

#### 3.2 Add Deployment Status (2-3 hours)
- [ ] Integrate Vercel API
- [ ] Show deployment status per project
- [ ] Add "last deployed" timestamp
- [ ] Link to live deployments

**Deliverable**: Team dashboard showing all project health

---

### **Phase 4: Build Public Showcase** (6-8 hours)

**Goal**: Beautiful public-facing project showcase

**Location**: `/projects` in ACT Studio

#### 4.1 Project Showcase Page (4-5 hours)
- [ ] Create page: `src/app/projects/page.tsx`
- [ ] Build components:
  - [ ] `ProjectShowcaseCard.tsx` - Beautiful project cards
  - [ ] Hero section with ecosystem overview
- [ ] Add project data:
  - [ ] Descriptions, tech stacks, status
  - [ ] Links to repos, live sites, docs
  - [ ] Impact metrics
- [ ] Add filtering:
  - [ ] By status (active, beta, planning)
  - [ ] By technology
  - [ ] By LCAA phase

#### 4.2 Contribution Opportunities (2-3 hours)
- [ ] Fetch "good first issue" across all repos
- [ ] Group by project and skill type
- [ ] Add contribution CTA
- [ ] Link to CONTRIBUTING.md for each project

**Deliverable**: Public project showcase live

---

### **Phase 5: Enhanced Features** (8-10 hours)

**Goal**: Advanced features for team and public dashboards

#### 5.1 Activity Feed (3-4 hours)
- [ ] Fetch recent commits across all repos
- [ ] Fetch recent issues/PRs
- [ ] Fetch deployment events
- [ ] Build unified activity feed
- [ ] Add time grouping (today, yesterday, this week)

#### 5.2 Roadmap Timeline (3-4 hours)
- [ ] Create page: `src/app/roadmap/page.tsx`
- [ ] Build timeline component
- [ ] Fetch milestones from GitHub Projects
- [ ] Group by quarter/phase
- [ ] Add LCAA phase indicators

#### 5.3 Caching & Performance (2-3 hours)
- [ ] Add Supabase tables for caching
- [ ] Implement 15-minute cache strategy
- [ ] Store historical snapshots
- [ ] Optimize API calls

**Deliverable**: Full-featured ecosystem dashboards

---

### **Phase 6: Documentation & Rollout** (2-3 hours)

**Goal**: Document everything and train team

**Tasks**:
- [ ] Write usage guides:
  - [ ] How to use project template
  - [ ] How to invoke Claude skills
  - [ ] How to use dashboards
- [ ] Create video walkthrough (optional)
- [ ] Update CLAUDE.md in all projects
- [ ] Announce to team
- [ ] Gather feedback

**Deliverable**: Documented, rolled out to team

---

## 📊 Total Time Estimate

| Phase | Description | Time |
|-------|-------------|------|
| Phase 1 | Create foundation | 6-8 hours |
| Phase 2 | Align existing projects | 4-6 hours |
| Phase 3 | Build team dashboard | 6-8 hours |
| Phase 4 | Build public showcase | 6-8 hours |
| Phase 5 | Enhanced features | 8-10 hours |
| Phase 6 | Documentation & rollout | 2-3 hours |
| **Total** | **Complete ecosystem unification** | **32-43 hours** |

---

## 🎯 Recommended Execution Order

### **Sprint 1: MVP** (12-16 hours)
**Goal**: Template + Basic Dashboards

- Phase 1.1: Create project template (3-4 hours)
- Phase 1.2: Create global skills (3-4 hours)
- Phase 3.1: Basic team dashboard (4-5 hours)
- Phase 4.1: Public showcase (4-5 hours)

**Deliverable**:
- ✅ Project template ready
- ✅ Global skills available
- ✅ Team can see all project health
- ✅ Public can see all projects

---

### **Sprint 2: Alignment** (6-10 hours)
**Goal**: Align all existing projects

- Phase 2: Align 7 core repos (4-6 hours)
- Phase 3.2: Add deployment status (2-3 hours)

**Deliverable**:
- ✅ All projects follow same structure
- ✅ Claude skills available everywhere
- ✅ Deployment status visible

---

### **Sprint 3: Polish** (10-14 hours)
**Goal**: Enhanced features and documentation

- Phase 5.1: Activity feed (3-4 hours)
- Phase 5.2: Roadmap timeline (3-4 hours)
- Phase 5.3: Caching & performance (2-3 hours)
- Phase 6: Documentation (2-3 hours)

**Deliverable**:
- ✅ Full-featured dashboards
- ✅ Optimized and cached
- ✅ Fully documented

---

## 🎨 Visual Summary: Before vs After

### Before (Current State)
```
ACT Projects
├── Each has different structure
├── Inconsistent documentation
├── Claude skills only in some repos
├── No unified visibility
├── Hard to see overall progress
└── Manual checks for health
```

### After (Target State)
```
ACT Ecosystem
├── All projects follow template
│   ├── Same .github/ structure
│   ├── Same docs/ organization
│   ├── Same scripts and conventions
│   └── Standard CLAUDE.md, README, CONTRIBUTING
│
├── Claude Skills Everywhere
│   ├── Global skills (symlinked)
│   │   ├── act-brand-alignment
│   │   ├── ghl-crm-advisor
│   │   ├── act-github-pm
│   │   └── act-deployment-helper
│   └── Project-specific skills
│       ├── empathy-ledger-assistant
│       ├── justicehub-assistant
│       └── harvest-assistant
│
└── Unified Dashboards
    ├── Team Dashboard (/admin/ecosystem)
    │   └── See all project health, deployments, activity
    ├── Public Showcase (/projects)
    │   └── Beautiful project cards, contribution CTAs
    ├── Roadmap (/roadmap)
    │   └── Visual timeline of ecosystem progress
    └── GitHub Projects
        └── All issues/PRs in one place
```

---

## 🚀 Quick Start Guide (After Implementation)

### For Developers

**Starting a new project**:
```bash
# Clone template
git clone https://github.com/Acurioustractor/act-project-template my-new-project

# Run setup
cd my-new-project
./scripts/setup.sh

# Link global skills
ln -s ~/act-global-skills .claude/skills/global

# Customize CLAUDE.md, README.md
# Start coding!
```

**Joining an existing project**:
```bash
# Clone project
git clone https://github.com/Acurioustractor/empathy-ledger-v2
cd empathy-ledger-v2

# Run setup script
./scripts/setup.sh

# Read CLAUDE.md for context
cat CLAUDE.md

# Invoke skills for help
./.claude/skills-menu.sh
```

---

### For Team (Using Dashboards)

**Daily standup**:
1. Go to `https://act-studio.vercel.app/admin/ecosystem`
2. Check project health cards
3. Note any red/yellow status
4. Review activity feed for recent work
5. Plan day's priorities

**Showcasing progress**:
1. Go to `https://act-studio.vercel.app/projects`
2. Show public-facing project cards
3. Highlight recent deployments
4. Point to contribution opportunities

**Planning sprints**:
1. Go to GitHub Projects board
2. Use roadmap view for big picture
3. Use Kanban view for current sprint
4. Filter by priority, project, LCAA phase

---

## 📚 Key Documents

| Document | Purpose |
|----------|---------|
| [act-project-template-strategy.md](../architecture/act-project-template-strategy.md) | Complete template and skills architecture |
| [act-ecosystem-dashboard-strategy.md](../architecture/act-ecosystem-dashboard-strategy.md) | Dashboard design and implementation |
| [ecosystem-unification-roadmap.md](./ecosystem-unification-roadmap.md) | This document - complete roadmap |
| [GITHUB_PM_COMPLETE.md](../../GITHUB_PM_COMPLETE.md) | GitHub PM infrastructure (already complete) |

---

## ✅ Success Criteria

**We'll know this is successful when**:

1. ✅ **Any developer** can jump between projects easily
2. ✅ **Any AI assistant** has consistent context across projects
3. ✅ **The team** can see ecosystem health at a glance
4. ✅ **The public** can discover and contribute to projects
5. ✅ **New projects** can be scaffolded in minutes
6. ✅ **Progress** is visible and measurable
7. ✅ **LCAA** methodology is embedded everywhere

---

## 🔄 Maintenance

**Ongoing tasks**:
- Update global skills as needed (benefits all projects)
- Keep template up to date with new best practices
- Add new projects to dashboards
- Monitor dashboard performance
- Gather team feedback

**Quarterly reviews**:
- Review template effectiveness
- Update skills based on team needs
- Add new dashboard features
- Align new tools/technologies

---

## 🌟 Future Enhancements

**Potential additions**:
- Mobile app for dashboards
- Slack/Discord notifications from activity feed
- Automated weekly ecosystem health reports
- AI-powered issue triage across projects
- Cross-project dependency tracking
- Unified search across all projects
- Contributor recognition dashboard

---

## 💡 Key Benefits

### For ACT Organization
- **Visibility**: See everything in one place
- **Consistency**: Professional, unified experience
- **Efficiency**: Less time figuring out conventions
- **Quality**: Standard workflows ensure quality
- **Growth**: Easy to scale to new projects

### For Contributors
- **Familiarity**: Same structure everywhere
- **Onboarding**: Faster to get started
- **Support**: AI assistance available
- **Discovery**: Easy to find work to do
- **Impact**: See their contribution in ecosystem

### For Funders/Community
- **Transparency**: Public showcase of work
- **Progress**: Visible roadmap and activity
- **Professionalism**: Well-organized projects
- **Impact**: Clear ecosystem vision
- **Trust**: Consistent, high-quality work

---

## 🎯 Next Action

**Recommended**: Start with Sprint 1 MVP

1. **This week**: Phase 1 (Create foundation) - 6-8 hours
2. **Next week**: Phase 3.1 + Phase 4.1 (Basic dashboards) - 8-10 hours
3. **Following week**: Phase 2 (Align projects) - 4-6 hours

**After 3 weeks, you'll have**:
- ✅ Project template ready for new projects
- ✅ Global skills available everywhere
- ✅ Team dashboard showing all health
- ✅ Public showcase of all projects
- ✅ All 7 core repos aligned

---

**🌾 Building unified, visible, AI-powered infrastructure for the ACT ecosystem 🌾**

**Last Updated**: 2025-12-26
**Status**: Ready for Implementation
**Estimated Total Time**: 32-43 hours (can be done in 3 sprints)
