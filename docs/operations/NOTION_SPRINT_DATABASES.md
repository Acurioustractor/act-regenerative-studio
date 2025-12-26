# Notion Sprint Tracking Databases Setup Guide

This guide shows how to create and configure two new Notion databases for sprint metrics tracking.

---

## Overview

**Purpose**: Track sprint velocity, milestones, and team capacity alongside existing GitHub issue tracking.

**New Databases**:
1. **Sprint Tracking** - Historical sprint data, velocity, goals
2. **Milestone Roadmap** - High-level milestone tracking across repos

**Integration**: Synced daily via GitHub Actions from GitHub Projects API

---

## Database 1: Sprint Tracking

### Purpose
Track historical sprint performance, velocity trends, and sprint goals.

### Schema

| Property | Type | Description | Example |
|----------|------|-------------|---------|
| **Sprint Name** | Title | Sprint identifier | "Sprint 4" |
| **Sprint Number** | Number | Extract from name | 4 |
| **Start Date** | Date | Sprint start | 2025-01-20 |
| **End Date** | Date | Sprint end | 2025-01-26 |
| **Goal** | Text | Sprint objective | "Complete dashboard analytics" |
| **Status** | Select | Sprint state | "Active", "Completed", "Planned" |
| **Total Issues** | Number | Issues planned | 15 |
| **Completed** | Number | Issues done | 12 |
| **In Progress** | Number | Currently working | 2 |
| **Blocked** | Number | Blocked issues | 1 |
| **Velocity** | Formula | Completed issues | `prop("Completed")` |
| **Completion %** | Formula | Progress percentage | `round(prop("Completed") / prop("Total Issues") * 100)` |
| **Days in Sprint** | Formula | Sprint duration | `dateBetween(prop("End Date"), prop("Start Date"), "days") + 1` |
| **Velocity per Day** | Formula | Daily completion rate | `round(prop("Velocity") / prop("Days in Sprint") * 10) / 10` |
| **Issues** | Relation | Link to Issues DB | → Issues database |
| **By Repository** | Text | Breakdown | "empathy-ledger: 5, justicehub: 3" |
| **By Type** | Text | Breakdown | "Enhancement: 10, Bug: 2" |
| **By Priority** | Text | Breakdown | "Critical: 1, High: 4" |
| **Last Synced** | Date | Last update | 2025-12-27 |

### Select Options

**Status**:
- 🟢 Active (green)
- ✅ Completed (green)
- 📋 Planned (gray)
- ❌ Cancelled (red)

### Views

**1. Current Sprint** (Table)
- Filter: Status = "Active"
- Sort: Start Date (descending)
- Show: All properties

**2. Sprint History** (Table)
- Filter: Status = "Completed"
- Sort: Sprint Number (descending)
- Show: Sprint Name, Dates, Velocity, Completion %

**3. Velocity Trend** (Board by Status)
- Group by: Status
- Sort: Sprint Number (ascending)
- Show: Sprint Name, Velocity, Completion %

**4. Sprint Calendar** (Calendar by Start Date)
- Show: Sprint Name, Status, Goal

---

## Database 2: Milestone Roadmap

### Purpose
High-level milestone tracking across all repositories with progress rollups.

### Schema

| Property | Type | Description | Example |
|----------|------|-------------|---------|
| **Milestone** | Title | Milestone name | "Goods MVP Launch" |
| **Repository** | Select | GitHub repo | "goods-asset-tracker" |
| **Description** | Text | Milestone goal | "Launch minimum viable product" |
| **Due Date** | Date | Target completion | 2025-02-15 |
| **Status** | Select | Current state | "In Progress", "Planned", "Done" |
| **Total Issues** | Rollup | From Issues relation | Count of related issues |
| **Completed Issues** | Rollup | From Issues relation | Count where Status = Done |
| **Progress** | Formula | Completion % | `round(prop("Completed Issues") / prop("Total Issues") * 100)` |
| **Priority** | Select | Importance | "Critical", "High", "Medium", "Low" |
| **Issues** | Relation | Link to Issues DB | → Issues database |
| **Sprints** | Relation | Link to Sprints DB | → Sprint Tracking database |
| **Owner** | Person | Responsible person | Team member |
| **Dependencies** | Relation | Blocking milestones | Self-relation |
| **Last Synced** | Date | Last update | 2025-12-27 |

### Select Options

**Status**:
- 🏗️ In Progress (blue)
- 📋 Planned (gray)
- ✅ Done (green)
- ⏸️ On Hold (yellow)
- ❌ Cancelled (red)

**Repository**:
- empathy-ledger-v2
- justicehub-platform
- harvest-community-hub
- act-farm
- goods-asset-tracker
- act-regenerative-studio

**Priority**:
- 🔴 Critical (red)
- 🟠 High (orange)
- 🟡 Medium (yellow)
- 🟢 Low (green)

### Views

**1. Active Milestones** (Table)
- Filter: Status = "In Progress"
- Sort: Due Date (ascending)
- Show: Milestone, Repository, Progress, Due Date

**2. By Repository** (Board grouped by Repository)
- Group by: Repository
- Sort: Due Date (ascending)
- Show: Milestone, Status, Progress, Due Date

**3. Timeline** (Timeline by Due Date)
- Filter: Status != "Cancelled"
- Sort: Due Date (ascending)
- Show: Milestone, Repository, Status, Progress

**4. Priority Matrix** (Board by Priority)
- Group by: Priority
- Sort: Due Date (ascending)
- Show: Milestone, Repository, Status, Progress

---

## Step-by-Step Setup

### 1. Create Sprint Tracking Database

1. **In Notion, create new database**:
   - Click "+ New page" in your workspace
   - Select "Table" database
   - Name: "Sprint Tracking"

2. **Add all properties from schema above**:
   - Use exact names and types
   - Configure formulas as specified
   - Add select options with colors

3. **Create the 4 views**:
   - Duplicate default view for each
   - Apply filters and sorts
   - Rename views

4. **Get database ID**:
   - Open database as full page
   - Copy ID from URL: `https://notion.so/workspace/XXXXXXXX?v=...`
   - ID is the part before `?v=`

5. **Add to `.env.local`**:
   ```bash
   NOTION_SPRINT_TRACKING_ID=your_database_id_here
   ```

### 2. Create Milestone Roadmap Database

1. **Create new database**:
   - Name: "Milestone Roadmap"
   - Add all properties from schema

2. **Create the 4 views**:
   - Active Milestones (table)
   - By Repository (board)
   - Timeline (timeline view)
   - Priority Matrix (board)

3. **Get database ID and add to env**:
   ```bash
   NOTION_MILESTONE_ROADMAP_ID=your_database_id_here
   ```

### 3. Link Existing Issues Database

The existing GitHub Issues database needs two new relation properties:

1. **Add "Sprint" relation**:
   - Type: Relation
   - Link to: Sprint Tracking database
   - Relation type: Many-to-one (many issues → one sprint)

2. **Add "Milestone" relation**:
   - Type: Relation
   - Link to: Milestone Roadmap database
   - Relation type: Many-to-one (many issues → one milestone)

---

## Syncing Strategy

### Daily Sprint Snapshot (5:00 PM daily)
**Script**: `scripts/snapshot-sprint-metrics.mjs`
**Triggers**: GitHub Action + Manual

**What it does**:
1. Queries GitHub Projects for current sprint
2. Calculates metrics (total, done, in progress, blocked)
3. Stores snapshot in Supabase `sprint_snapshots` table
4. Updates Notion Sprint Tracking database
5. Logs results

### Milestone Sync (Every 6 hours)
**Script**: `scripts/sync-milestones-to-notion.mjs`
**Triggers**: GitHub Action + Manual

**What it does**:
1. Fetches all milestones from 6 GitHub repos
2. Calculates progress (open vs closed issues)
3. Updates Notion Milestone Roadmap database
4. Links related issues

### Enhanced Issue Sync (Every 30 minutes)
**Script**: `scripts/sync-github-to-notion.mjs` (enhanced)
**Triggers**: GitHub Action (existing)

**New features**:
1. Links issues to Sprint Tracking (via Sprint field)
2. Links issues to Milestone Roadmap (via Milestone)
3. Maintains existing functionality

---

## Environment Variables Summary

Add these to `.env.local`:

```bash
# Existing (already configured)
NOTION_TOKEN=ntn_...
NOTION_DATABASE_ID=...  # GitHub Issues database

# New (you need to add these)
NOTION_SPRINT_TRACKING_ID=xxxxx  # Sprint Tracking database
NOTION_MILESTONE_ROADMAP_ID=xxxxx  # Milestone Roadmap database

# GitHub (already configured)
GITHUB_TOKEN=ghp_...
GITHUB_PROJECT_ID=PVT_kwHOCOopjs4BLVik
```

---

## Testing the Setup

### 1. Test Sprint Tracking Database
```bash
node scripts/snapshot-sprint-metrics.mjs
```

Expected:
- Creates/updates row for current sprint
- Shows total, completed, in progress counts
- Calculates velocity

### 2. Test Milestone Roadmap Database
```bash
node scripts/sync-milestones-to-notion.mjs
```

Expected:
- Creates rows for all 8 milestones
- Shows progress percentages
- Links to repository

### 3. Test Enhanced Issue Sync
```bash
node scripts/sync-github-to-notion.mjs
```

Expected:
- Existing functionality works
- New Sprint relation populated
- New Milestone relation populated

---

## Maintenance

**Weekly**:
- Review completed sprints in Sprint Tracking
- Update milestone due dates if needed
- Check for orphaned issues (no sprint/milestone)

**Monthly**:
- Archive completed milestones
- Review velocity trends
- Adjust sprint capacity based on data

---

## Troubleshooting

### Issue: Database not found
- Check database ID in `.env.local`
- Ensure Notion integration has access to database
- Verify database is in correct workspace

### Issue: Properties not updating
- Check Notion API rate limits
- Verify property names match exactly
- Check script logs for errors

### Issue: Relations not linking
- Ensure relation properties exist in both databases
- Check that database IDs are correct
- Verify Issues database has Sprint and Milestone relations

---

## Next Steps

After creating these databases:

1. Run initial sync to populate data
2. Configure GitHub Actions for automatic syncing
3. Share databases with team
4. Create custom views for specific use cases

---

**Last Updated**: 2025-12-27
**Related**: Phase 3 - Notion Sprint Metrics
**Scripts**: `snapshot-sprint-metrics.mjs`, `sync-milestones-to-notion.mjs`
