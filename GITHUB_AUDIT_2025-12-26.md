# ACT GitHub Organization Audit
**Date**: 2025-12-26
**Organization**: [Acurioustractor](https://github.com/Acurioustractor)
**Purpose**: Assess current state and identify improvements for world-class project management

---

## Executive Summary

**Current State**:
- ✅ GitHub org exists with 82 repositories
- ✅ Issues enabled on repos
- ✅ Projects enabled on repos
- ❌ **No organization-wide project management structure**
- ❌ **No consistent labels across repos** (only default GitHub labels)
- ❌ **No issue/PR templates**
- ❌ **No GitHub Actions CI/CD**
- ❌ **No organization-wide .github repository**
- ❌ **Most repos have 0 issues** (work not tracked in GitHub)

**Critical Finding**: The GitHub organization exists but is **underutilized**. It's currently just a code repository without project management features.

---

## Repository Inventory

### Core ACT Ecosystem (7 primary repos)

| Repository | Visibility | Last Updated | Local Path | Status |
|------------|-----------|--------------|------------|---------|
| [act-farm](https://github.com/Acurioustractor/act-farm) | PUBLIC | 2025-12-25 | `/Users/benknight/Code/ACT Farm/act-farm` | ⚠️ No issues, no workflows |
| [empathy-ledger-v2](https://github.com/Acurioustractor/empathy-ledger-v2) | PUBLIC | 2025-09-05 | `/Users/benknight/Code/empathy-ledger-v2` | ⚠️ Outdated (4mo), no issues |
| [theharvest](https://github.com/Acurioustractor/theharvest) | PUBLIC | 2025-12-22 | `/Users/benknight/Code/The Harvest` | ⚠️ No issues, no workflows |
| [justicehub-platform](https://github.com/Acurioustractor/justicehub-platform) | PUBLIC | 2025-12-22 | `/Users/benknight/Code/JusticeHub` | ⚠️ No issues, no workflows |
| [act-placemat](https://github.com/Acurioustractor/act-placemat) | PUBLIC | 2025-12-18 | `/Users/benknight/Code/ACT Placemat` | ⚠️ No issues, no workflows |
| [goods-asset-tracker](https://github.com/Acurioustractor/goods-asset-tracker) | PUBLIC | 2025-12-18 | `/Users/benknight/Code/Goods Asset Register` | ⚠️ No issues, no workflows |
| **ACT Main Website** | ❌ **MISSING** | - | `/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio` | 🚨 **NOT ON GITHUB!** |

**CRITICAL**: ACT Main Website (Regenerative Innovation Studio) is NOT in GitHub! This is the most complete codebase (95% done, production-ready) and should be the priority.

### Additional ACT Projects (75+ repos)

The org contains 75+ additional repositories for various ACT projects:
- Partner projects (Orange Sky, AIME, Diagrama, etc.)
- Research platforms (Barkly, Mount Isa, Palm Island)
- Older/archived projects
- Experimental/prototype repos

**Recommendation**: Focus improvement efforts on the 7 core repos first, then apply learnings to other active projects.

---

## Current Configuration Analysis

### Labels
**Status**: ❌ Using default GitHub labels only

**Current labels** (example from act-farm):
- bug
- documentation
- duplicate
- enhancement
- help wanted
- good first issue
- invalid
- question
- wontfix

**What's Missing**:
- No priority indicators (critical, high, medium, low)
- No project tags (to identify which ACT project)
- No effort estimates (1h, 4h, 1d, 3d, 1w)
- No LCAA method tags (Listen, Curiosity, Action, Art)
- No status indicators (blocked, in-progress, needs-review)
- No cross-repo coordination labels

### Issue Templates
**Status**: ❌ None exist

**Impact**:
- Inconsistent issue reporting
- No ACT brand voice in templates
- No LCAA method integration
- Missing context for issues

### PR Templates
**Status**: ❌ None exist

**Impact**:
- No quality checklist
- No ACT standards verification
- No cross-repo coordination checks
- No type syncing reminders

### GitHub Actions / CI/CD
**Status**: ❌ None configured

**Impact**:
- No automated testing
- No automated deployment
- No type syncing across repos
- Manual deployment only (Vercel CLI)

### GitHub Projects
**Status**: ❓ Unknown (need auth refresh to check)

**Likely**: No organization-wide unified board exists

### Organization-wide .github Repository
**Status**: ❌ Does not exist

**Impact**:
- No default templates for all repos
- No organization profile README
- No workflow templates
- Each repo must configure independently

---

## Gap Analysis

### High Priority Gaps

1. **ACT Main Website Not on GitHub** 🚨
   - Most complete codebase
   - Production-ready (95% complete)
   - Source of truth for shared types
   - No remote backup!

2. **No Issue Tracking in GitHub**
   - 32 TODOs scattered in code
   - Work not visible in GitHub
   - No central task management
   - Difficult to onboard collaborators

3. **No Consistent Labels**
   - Can't filter across repos
   - No priority indication
   - No LCAA method tracking
   - No effort estimation

4. **No Templates**
   - Inconsistent issues/PRs
   - No ACT branding
   - No quality standards
   - Missing LCAA alignment checks

5. **No CI/CD**
   - Manual testing
   - Manual deployment
   - No automated type syncing
   - Higher error risk

### Medium Priority Gaps

6. **No Unified Project Board**
   - Can't see ecosystem-wide progress
   - No sprint planning
   - No roadmap visibility
   - Difficult to coordinate cross-repo work

7. **No GitHub MCP Integration**
   - Can't use Claude Code with GitHub
   - Manual issue creation
   - No AI-assisted PM
   - Missing "vibe coding" workflow

8. **Inconsistent Repo Activity**
   - empathy-ledger-v2 outdated (4 months)
   - Some repos actively developed
   - Need synchronization strategy

---

## Recommended Improvements

### Phase 1: Foundation (Week 1)

**1.1 Push ACT Main Website to GitHub** (CRITICAL)
```bash
# Create new repo
gh repo create Acurioustractor/act-regenerative-studio --public --source=.

# Or use existing if available
cd "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio"
git remote add origin git@github.com:Acurioustractor/act-regenerative-studio.git
git push -u origin main
```

**1.2 Create Organization .github Repository**
```bash
gh repo create Acurioustractor/.github --public
```

Contents:
- `profile/README.md` - Organization profile
- `ISSUE_TEMPLATE/` - Issue templates (bug, feature, task, epic)
- `PULL_REQUEST_TEMPLATE.md` - PR template with ACT checklist
- `workflow-templates/` - Reusable GitHub Actions
- `FUNDING.yml` - Donation links

**1.3 Implement Label Taxonomy**

Create script `scripts/setup-github-labels.mjs` to apply to all core repos:

**Priority Labels**:
- `priority: critical` (red) - Blocking production
- `priority: high` (orange) - Important, do soon
- `priority: medium` (yellow) - Normal priority
- `priority: low` (green) - Nice to have

**Project Labels**:
- `project: empathy-ledger` (purple)
- `project: justicehub` (purple)
- `project: harvest` (purple)
- `project: act-farm` (purple)
- `project: act-main` (purple)
- `project: placemat` (purple)
- `project: goods` (purple)
- `project: ecosystem` (purple) - Cross-project

**Effort Labels**:
- `effort: 1h` (light green)
- `effort: 4h` (green)
- `effort: 1d` (dark green)
- `effort: 3d` (darker green)
- `effort: 1w` (darkest green)

**LCAA Method Labels**:
- `lcaa: listen` (soft red)
- `lcaa: curiosity` (soft orange)
- `lcaa: action` (soft green)
- `lcaa: art` (soft blue)

**Status Labels**:
- `status: blocked` (red)
- `status: needs-review` (yellow)
- `status: in-progress` (blue)
- `status: help-wanted` (green)

### Phase 2: Templates & Standards (Week 1-2)

**2.1 Issue Templates**

**bug.yml**:
- Project dropdown (which ACT project?)
- What happened / Expected behavior / Steps to reproduce
- Priority dropdown
- Additional context
- Auto-labels: `type: bug`

**feature.yml**:
- Project dropdown
- Problem statement (LCAA: Listen)
- Proposed solution (LCAA: Curiosity)
- LCAA alignment checkboxes
- Effort estimate dropdown
- Auto-labels: `type: feature`

**task.yml**:
- Project dropdown
- Task description
- Acceptance criteria checklist
- Effort estimate
- Auto-labels: `type: chore`

**epic.yml**:
- Vision statement
- Expected impact
- Scope (included/excluded)
- Breakdown (linked issues)
- Auto-labels: `type: feature`, `epic`

**2.2 PR Template**

Template includes:
- Description & Related issues
- Type of change checkboxes
- Testing checklist
- ACT Quality Checklist:
  - LCAA Method alignment
  - Brand voice (if user-facing)
  - Accessibility (WCAG AA)
  - TypeScript types synced
  - No console logs
  - Cross-repo dependencies checked
  - Breaking changes communicated

### Phase 3: Unified Project Board (Week 2)

**3.1 Create Organization-Level Project**

Name: "ACT Ecosystem Development"
Scope: All 7 core repositories

**Custom Fields**:
- Status (Backlog, To Do, In Progress, Review, Done)
- Project (dropdown of 7 projects + Ecosystem)
- Priority (Critical, High, Medium, Low)
- Effort (1h, 4h, 1d, 3d, 1w)
- Sprint (2-week iterations)
- LCAA Phase (Listen, Curiosity, Action, Art)
- Dependencies (linked issues)

**Views**:
1. **Kanban** - Default workflow view
2. **By Project** - Swim lanes per codebase
3. **Sprint Board** - Current sprint only
4. **Timeline** - Roadmap view (3-6 months)
5. **LCAA Method** - Grouped by ACT methodology

**Automation**:
- PR opens → Move to "Review"
- PR merges → Move to "Done", close linked issues
- Issue assigned → Move to "In Progress"
- Labeled "blocked" → Move to "Backlog"

### Phase 4: TODO Migration (Week 2)

**4.1 Migrate 32 In-Code TODOs**

Create `scripts/migrate-todos-to-github.mjs`:
- Scan all 7 codebases for `// TODO:See issue #2 in act-regenerative-studio: ` and `// FIXME:`
- Create GitHub issue for each
- Replace in code with: `// See issue #123 in repo-name: original text`
- Link to unified Projects board

Expected: ~32 issues created across repos

### Phase 5: CI/CD & Automation (Week 2-3)

**5.1 GitHub Actions Workflows**

**test.yml** (all repos):
```yaml
on: [pull_request]
- Checkout code
- Install dependencies
- Run lint
- Run type-check
- Run build
- Run tests (if exist)
```

**deploy.yml** (production repos):
```yaml
on:
  push:
    branches: [main]
- Checkout code
- Deploy to Vercel
- Comment on PR with deploy URL
```

**type-sync.yml** (ACT Main only):
```yaml
on:
  push:
    paths: ['src/types/shared/**']
- Sync types to other repos
- Create PRs automatically
```

**secret-scan.yml** (all repos):
```yaml
on: [push, pull_request, schedule]
- Scan for hardcoded secrets
- Fail if found
```

### Phase 6: Claude Code Integration (Week 3)

**6.1 Install GitHub MCP Server**
```bash
npm install -g @anthropic/github-mcp-server
claude mcp add github --scope "Acurioustractor/*"
```

**6.2 Create github-pm-assistant Skill**

Location: `.claude/skills/github-pm-assistant/SKILL.md`

Capabilities:
- Create issues from TODOs
- Start work from issue number
- Review PRs for ACT standards
- Update project board
- Check cross-repo dependencies
- Suggest type syncing when needed

Commands:
- `/gh-create-issue <description>`
- `/gh-start-work <issue-number>`
- `/gh-review-pr <pr-number>`
- `/gh-board-status`
- `/gh-sync-check`

**6.3 Update CLAUDE.md in All Repos**

Add GitHub workflow instructions:
- How to create issues
- How to start work from issue
- How to review PRs
- How to update board

---

## Priority Action Items

### Immediate (This Week)

1. ✅ **Push ACT Main Website to GitHub** - CRITICAL, no remote backup
2. ✅ **Create organization .github repository** - Templates for all repos
3. ✅ **Implement label taxonomy** - Consistent across all 7 core repos
4. ✅ **Create issue/PR templates** - ACT branding + LCAA integration

### Short Term (Next 2 Weeks)

5. ✅ **Create unified Projects board** - Ecosystem-wide visibility
6. ✅ **Migrate 32 TODOs to issues** - Centralize task tracking
7. ✅ **Set up GitHub Actions** - CI/CD for all core repos
8. ✅ **Install GitHub MCP** - Claude Code integration

### Medium Term (Month 2)

9. ⏳ **Create github-pm-assistant skill** - AI-powered PM
10. ⏳ **Create project template** - Easy onboarding for new projects
11. ⏳ **Document workflows** - Team training materials
12. ⏳ **Sync empathy-ledger-v2** - Update 4-month-old repo

---

## Repository Mapping

| Local Path | GitHub Repo | Status |
|-----------|-------------|---------|
| `/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio` | ❌ **MISSING** → Create `act-regenerative-studio` | 🚨 Priority 1 |
| `/Users/benknight/Code/empathy-ledger-v2` | ✅ `empathy-ledger-v2` | ⚠️ Outdated (4mo) |
| `/Users/benknight/Code/JusticeHub` | ✅ `justicehub-platform` | ✅ Recent |
| `/Users/benknight/Code/The Harvest` | ✅ `theharvest` | ✅ Recent |
| `/Users/benknight/Code/ACT Farm/act-farm` | ✅ `act-farm` | ✅ Recent |
| `/Users/benknight/Code/ACT Placemat` | ✅ `act-placemat` | ✅ Recent |
| `/Users/benknight/Code/Goods Asset Register` | ✅ `goods-asset-tracker` | ✅ Recent |

**Note**: `Empathy Ledger v.02` is campaign copy only, not main codebase.

---

## Success Metrics

After implementing improvements:

1. **All 7 core repos on GitHub** ✅/❌
   - ACT Main pushed
   - All repos synced
   - No missing codebases

2. **Consistent labels across repos** ✅/❌
   - Priority, project, effort, LCAA, status
   - Applied to all 7 core repos
   - Filterable across org

3. **Templates in use** ✅/❌
   - Issue templates (4 types)
   - PR template with ACT checklist
   - Org-wide .github repo created

4. **Unified project management** ✅/❌
   - Organization-level Projects board
   - 32 TODOs migrated to issues
   - Clear Kanban workflow

5. **CI/CD automation** ✅/❌
   - GitHub Actions on all repos
   - Automated testing
   - Automated deployment
   - Type syncing automated

6. **Claude Code integration** ✅/❌
   - GitHub MCP installed
   - github-pm-assistant skill created
   - Team trained on workflow

---

## Risk Assessment

**High Risk**:
- 🚨 ACT Main Website has no remote backup
- 🚨 empathy-ledger-v2 outdated by 4 months
- ⚠️ 82 repos may be overwhelming to manage

**Mitigation**:
- ✅ Push ACT Main immediately (Priority 1)
- ✅ Focus on 7 core repos first, not all 82
- ✅ Sync empathy-ledger-v2 before major changes
- ✅ Use templates to scale improvements

**Low Risk**:
- Adding labels (non-destructive)
- Creating templates (additive)
- Setting up Projects board (no code changes)

---

## Next Steps

**After review, proceed with**:

1. Push ACT Main Website to GitHub
2. Create organization .github repository
3. Implement label taxonomy script
4. Create issue/PR templates
5. Set up unified Projects board

Each step is documented in approved plan: `/Users/benknight/.claude/plans/toasty-yawning-quail.md`

---

**Audit Completed**: 2025-12-26
**Auditor**: Claude Code + Ben Knight
**Status**: Ready for implementation
