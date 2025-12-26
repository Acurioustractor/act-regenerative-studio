# GitHub Project Views Setup Guide

**Project**: ACT Ecosystem Development
**Project URL**: https://github.com/orgs/Acurioustractor/projects/1
**Project ID**: `PVT_kwHOCOopjs4BLVik`
**Created**: 2025-12-26

---

## Overview

This guide provides step-by-step instructions for creating 13 filtered views in the ACT Ecosystem Development GitHub Project board. These views enable project-specific focus, LCAA phase tracking, sprint planning, and contributor onboarding.

**Important**: GitHub doesn't provide API access to create Project views programmatically. These must be created manually through the web interface.

---

## View Architecture

### Strategy
- **Single unified board** with 138 items across all ACT projects
- **13 filtered views** for different perspectives and workflows
- **Hybrid approach**: Get benefits of project-specific boards without duplication

### Benefits
- One source of truth for all ecosystem work
- Easy cross-project visibility
- No duplicate issue tracking
- Flexible filtering without data silos

---

## Views to Create

### 1. 🌍 Ecosystem View (Default)
**Purpose**: See everything across all ACT projects
**Layout**: Table
**Filters**: None (shows all items)
**Columns to show**:
- Title
- Status
- ACT Project
- LCAA Phase
- Priority
- Effort
- Assignees

**How to create**:
1. Go to https://github.com/orgs/Acurioustractor/projects/1
2. Click "New view" button (top right)
3. Name: `🌍 Ecosystem View`
4. Layout: Table
5. No filters needed
6. Arrange columns as listed above

---

### 2. 📖 Empathy Ledger View
**Purpose**: All Empathy Ledger v2 work
**Layout**: Board
**Filters**: `ACT Project = "Empathy Ledger"`
**Group by**: Status
**Columns to show**: Title, Priority, Effort, Assignees

**How to create**:
1. Click "New view"
2. Name: `📖 Empathy Ledger`
3. Layout: Board
4. Click "Filter" → Select "ACT Project" → Choose "Empathy Ledger"
5. Group by: Status field

---

### 3. ⚖️ JusticeHub View
**Purpose**: All JusticeHub Platform work
**Layout**: Board
**Filters**: `ACT Project = "JusticeHub"`
**Group by**: Status

**How to create**:
1. Click "New view"
2. Name: `⚖️ JusticeHub`
3. Layout: Board
4. Filter: ACT Project = "JusticeHub"
5. Group by: Status

---

### 4. 🌾 The Harvest View
**Purpose**: All The Harvest work
**Layout**: Board
**Filters**: `ACT Project = "The Harvest"`
**Group by**: Status

**How to create**:
1. Click "New view"
2. Name: `🌾 The Harvest`
3. Layout: Board
4. Filter: ACT Project = "The Harvest"
5. Group by: Status

---

### 5. 🚜 ACT Farm View
**Purpose**: All ACT Farm website work
**Layout**: Board
**Filters**: `ACT Project = "ACT Farm"`
**Group by**: Status

**How to create**:
1. Click "New view"
2. Name: `🚜 ACT Farm`
3. Layout: Board
4. Filter: ACT Project = "ACT Farm"
5. Group by: Status

---

### 6. 🗺️ ACT Placemat View
**Purpose**: All ACT Placemat work
**Layout**: Board
**Filters**: `ACT Project = "ACT Placemat"`
**Group by**: Status

**How to create**:
1. Click "New view"
2. Name: `🗺️ ACT Placemat`
3. Layout: Board
4. Filter: ACT Project = "ACT Placemat"
5. Group by: Status

---

### 7. 📦 Goods View
**Purpose**: All Goods on Country asset tracker work (emphasized by user)
**Layout**: Board
**Filters**: `ACT Project = "Goods"`
**Group by**: Status

**Important**: Ensure all goods-asset-tracker repository issues are properly tagged with `ACT Project = "Goods"`

**How to create**:
1. Click "New view"
2. Name: `📦 Goods`
3. Layout: Board
4. Filter: ACT Project = "Goods"
5. Group by: Status

---

### 8. 🎨 By LCAA Phase
**Purpose**: See work organized by Listen/Curiosity/Action/Art methodology
**Layout**: Board
**Filters**: None
**Group by**: LCAA Phase

**How to create**:
1. Click "New view"
2. Name: `🎨 By LCAA Phase`
3. Layout: Board
4. No filters
5. Group by: LCAA Phase

**Result**: 4 columns (Listen, Curiosity, Action, Art) showing how work maps to methodology

---

### 9. 📅 Sprint Planning
**Purpose**: Organize work by sprint cycles
**Layout**: Table
**Filters**: None
**Columns to show**:
- Title
- ACT Project
- Sprint
- Effort
- Priority
- Assignees
- Status

**How to create**:
1. Click "New view"
2. Name: `📅 Sprint Planning`
3. Layout: Table
4. Arrange columns as listed
5. Sort by: Sprint (descending)

---

### 10. 🔥 High Priority
**Purpose**: Focus on urgent and high-priority work
**Layout**: Table
**Filters**: `Priority = "High" OR Priority = "Critical"`
**Columns to show**:
- Title
- ACT Project
- Priority
- Effort
- Assignees
- Status

**How to create**:
1. Click "New view"
2. Name: `🔥 High Priority`
3. Layout: Table
4. Filter: Priority field → Select "High" and "Critical"
5. Sort by: Priority (Critical first)

---

### 11. 🆕 Good First Issues
**Purpose**: Onboarding tasks for new contributors
**Layout**: Table
**Filters**: `Effort = "1h" OR Effort = "3h"`
**Columns to show**:
- Title
- ACT Project
- Effort
- Type
- Status

**How to create**:
1. Click "New view"
2. Name: `🆕 Good First Issues`
3. Layout: Table
4. Filter: Effort = "1h" or "3h"
5. Additional filter (optional): Status = "Todo" or "Backlog"

**Purpose for onboarding**: When bringing on 2-3 new developers, point them to this view first

---

### 12. 📊 Roadmap
**Purpose**: Timeline view of milestones and major work
**Layout**: Roadmap
**Filters**: None
**Date fields**: Start date, Target date

**How to create**:
1. Click "New view"
2. Name: `📊 Roadmap`
3. Layout: Roadmap
4. Configure date fields: Start date, Target date
5. Group by: ACT Project (optional)

**Note**: Ensure issues have start/target dates for proper timeline visualization

---

### 13. 🚧 Cross-Project Work
**Purpose**: Infrastructure and work affecting multiple projects
**Layout**: Table
**Filters**: `ACT Project = "Cross-Project"`
**Columns to show**:
- Title
- Status
- Priority
- Effort
- Assignees

**How to create**:
1. Click "New view"
2. Name: `🚧 Cross-Project Work`
3. Layout: Table
4. Filter: ACT Project = "Cross-Project"

**Examples of cross-project work**:
- Global Claude skills updates
- ACT project template improvements
- Documentation standards
- Shared GitHub Actions workflows
- Ecosystem-wide tooling

---

## Verification Checklist

After creating all views:

- [ ] All 13 views appear in view switcher dropdown
- [ ] Each project-specific view shows only its items
- [ ] 📦 Goods view shows goods-asset-tracker issues
- [ ] 🔥 High Priority view shows critical items at top
- [ ] 🆕 Good First Issues shows quick-win tasks
- [ ] 📊 Roadmap shows timeline visualization
- [ ] 🎨 By LCAA Phase groups by methodology
- [ ] 📅 Sprint Planning shows sprint assignments

---

## Next Steps

Once views are created:

1. **Tag existing issues**: Ensure all 138 items have proper:
   - ACT Project assignment
   - LCAA Phase
   - Priority
   - Effort estimate

2. **Set up Notion sync**: Automate GitHub ↔ Notion database synchronization (see [notion-github-sync.md](./notion-github-sync.md))

3. **Onboard team**: When bringing on 2-3 developers:
   - Start with 🆕 Good First Issues view
   - Assign to project-specific views (📖 📦 ⚖️ etc.)
   - Use 📅 Sprint Planning for sprint assignments

4. **Daily workflow**:
   - Morning: Check 🔥 High Priority
   - Planning: Use 📅 Sprint Planning
   - Project work: Use project-specific views
   - Cross-project: Check 🚧 Cross-Project Work

---

## Custom Field Reference

**ACT Project** (single select):
- ACT Main
- Empathy Ledger
- JusticeHub
- The Harvest
- ACT Farm
- ACT Placemat
- Goods ← **Ensure this is used for goods-asset-tracker**
- Cross-Project

**LCAA Phase** (single select):
- Listen
- Curiosity
- Action
- Art

**Priority** (single select):
- Critical
- High
- Medium
- Low

**Effort** (single select):
- 1h
- 3h
- 1d
- 3d
- 1w
- 2w

**Sprint** (text field):
- Format: "Sprint N" or "Q1 2025", etc.

---

## Troubleshooting

**Problem**: View doesn't show expected items
**Solution**: Check filter syntax, ensure custom field values are set on items

**Problem**: Can't create roadmap view
**Solution**: Ensure date fields exist on project (Start date, Target date)

**Problem**: Goods view is empty
**Solution**: Tag goods-asset-tracker issues with `ACT Project = "Goods"`

---

**Maintained By**: ACT Ecosystem Team
**Last Updated**: 2025-12-26
**Related Docs**:
- [Multi-Repo Management](./multi-repo-management.md)
- [Notion-GitHub Sync](./notion-github-sync.md)
- [Ecosystem Unification](../ECOSYSTEM_UNIFICATION_COMPLETE.md)
