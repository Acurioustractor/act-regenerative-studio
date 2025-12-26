# Type Field Strategy - Complete Guide

**Goal**: Move Type from labels to a proper Project field
**Why**: Better categorization, filtering, and understanding of work types
**Date**: 2025-12-26

---

## ❓ What is "Type"?

**Type** = The nature/category of work being done

This helps you understand:
- What kind of work is this?
- How does it contribute to the project?
- How should I approach it?

---

## 🤔 What is "Chore"? (Currently Used)

**Current label**: `type: chore` = "Maintenance"

**What "chore" typically means in software**:
- Technical debt cleanup
- Dependency updates
- Build configuration
- Tooling improvements
- Code cleanup without changing behavior
- Refactoring for maintainability

**But looking at your issues**, most labeled as "chore" are actually:
- `"Implement thumbnail generation"` → Feature (new capability)
- `"Add organizations table"` → Feature (new capability)
- `"Create mobile version"` → Feature (new capability)
- `"Implement proper permissions"` → Feature (new capability)

**Problem**: These aren't chores - they're **features**! The auto-labeling was too generic.

---

## 🎯 Recommended Types for ACT Projects

Based on your actual work, here are the types you need:

### 1. **Feature**
**What**: Building new functionality or capabilities
**Examples from your issues**:
- "Implement thumbnail generation"
- "Add organizations table"
- "Create mobile version"
- "Implement file upload logic"
- "Add toast notification"

**When to use**: Adds something new that users/developers will use

---

### 2. **Enhancement**
**What**: Improving existing functionality
**Examples from your issues**:
- "Improve search performance"
- "Add filtering to dashboard"
- "Enhance story discovery algorithm"
- "Make forms more user-friendly"

**When to use**: Makes existing features better, faster, or more usable

---

### 3. **Bug**
**What**: Something is broken or not working as intended
**Examples**:
- "Security vulnerability in auth flow" (your Critical #33)
- "Form validation not triggering"
- "API returning 500 errors"
- "Images not loading on mobile"

**When to use**: Fixes something that's broken

---

### 4. **Data**
**What**: Database changes, migrations, data modeling
**Examples from your issues**:
- "Add title column to transcripts table"
- "Add organizations table"
- "Add preferences column to profiles table"
- "Add verification_status column to profiles table"

**When to use**: Database schema changes, data migrations, data modeling

---

### 5. **Integration**
**What**: Connecting systems, APIs, third-party services
**Examples from your issues**:
- "Integrate with Vercel API"
- "Implement actual payment processing"
- "Sync to Notion"
- "Connect to GHL webhooks"
- "Send email notifications"

**When to use**: Connecting to external systems or services

---

### 6. **UX/UI**
**What**: User interface, user experience, design work
**Examples from your issues**:
- "Create mobile version" (responsive design)
- "Add toast notification" (user feedback)
- "Navigate to storyteller detail page"
- "Implement featured toggle"

**When to use**: Anything related to how users see and interact with the app

---

### 7. **Configuration**
**What**: Setup, settings, environment, tooling
**Examples from your issues**:
- "Implement API configuration"
- "Update GHL form IDs"
- "Implement signature verification"
- "Set up deployment pipeline"

**When to use**: Configuration, setup, environment variables, tooling

---

### 8. **Security**
**What**: Security fixes, vulnerabilities, permissions
**Examples from your issues**:
- "Security vulnerability in auth flow" (#33)
- "Implement proper permissions"
- "Implement proper permission check for media review"
- "Add input validation to prevent SQL injection"

**When to use**: Security-related work (very important to track!)

---

### 9. **Research**
**What**: Investigation, exploration, learning, discovery
**Examples**:
- "Research best approach for real-time sync"
- "Investigate performance bottleneck"
- "Explore authentication options"
- "Spike: Test Notion API capabilities"

**When to use**: When you need to learn/explore before building

---

### 10. **Documentation**
**What**: Writing docs, comments, guides, README
**Examples**:
- "Document API endpoints"
- "Write setup guide"
- "Add comments to complex functions"
- "Create user guide"

**When to use**: Writing or updating documentation

---

### 11. **Testing**
**What**: Writing tests, test automation, QA
**Examples from your issues**:
- "Test automation" issues in goods-asset-tracker
- "Add unit tests for auth flow"
- "Set up E2E testing"

**When to use**: Writing or fixing tests

---

### 12. **Cleanup**
**What**: Remove dead code, deprecated features, tech debt
**Examples from your issues**:
- "Remove before production" (#62)
- "Delete unused components"
- "Remove deprecated API calls"

**When to use**: Removing or cleaning up code/features

---

## 📊 Type Distribution Analysis

Looking at your 149 issues, here's what they actually are:

| Type | Count | Percentage |
|------|-------|------------|
| **Feature** | ~80 | 54% |
| **Data** | ~30 | 20% |
| **Integration** | ~15 | 10% |
| **UX/UI** | ~10 | 7% |
| **Bug** | ~5 | 3% |
| **Security** | ~3 | 2% |
| **Configuration** | ~3 | 2% |
| **Testing** | ~2 | 1% |
| **Cleanup** | ~1 | <1% |

**Insight**: Most of your TODO items are **Feature** work (building new capabilities), not "chores"!

---

## 🎯 Recommended Type Field Setup

### Create "Type" Project Field

**Field Type**: Single Select
**Options** (in priority order):
1. 🔴 **Security** - Critical security work
2. 🐛 **Bug** - Something broken
3. ✨ **Feature** - New capability
4. 🔧 **Enhancement** - Improve existing
5. 🗄️ **Data** - Database/schema changes
6. 🔌 **Integration** - Connect systems
7. 🎨 **UX/UI** - User interface/design
8. ⚙️ **Configuration** - Setup/settings
9. 🔍 **Research** - Investigation/learning
10. 📚 **Documentation** - Docs/guides
11. 🧪 **Testing** - Tests/QA
12. 🧹 **Cleanup** - Remove/refactor

---

## 🔄 How Type Relates to Other Fields

### Type + Priority

**Security** + Critical = Drop everything, fix now
**Bug** + High = Fix soon (blocking users)
**Feature** + Low = Backlog (nice to have)
**Research** + Medium = Do before building feature

### Type + LCAA Phase

**Research** → Usually **Listen** or **Curiosity** phase
**Feature** → Usually **Action** phase
**UX/UI** → Often **Art** phase
**Bug** → Always **Action** phase

### Type + Effort

**Configuration** → Usually 1h-3h (quick)
**Feature** → Usually 1d-1w (substantial)
**Security** → Usually 3h-3d (depends on severity)
**Research** → Usually 3h-1d (time-boxed)

### Type + Sprint

**Security** → Always current sprint
**Bug** → Current or next sprint
**Feature** → Prioritize by value
**Research** → Before related feature

---

## 🎯 Type-Based Workflows

### Security Workflow

**Type = Security**:
1. Auto-set Priority = Critical
2. Auto-set Sprint = Current
3. Immediate notification
4. Must have reviewer before deploy

### Feature Development

**Type = Feature**:
1. Starts in Backlog
2. Needs Priority assignment
3. May need Research first
4. Consider UX/UI implications

### Bug Triage

**Type = Bug**:
1. Assess severity → Set Priority
2. High/Critical → Current Sprint
3. Medium → Next Sprint
4. Low → Backlog

### Data Changes

**Type = Data**:
1. Needs migration script
2. Test on staging first
3. Backup before deploy
4. May need rollback plan

---

## 🚀 Migration Plan

### Step 1: Create Type Field in GitHub Project

**Manual step** (GitHub UI):
1. Go to: https://github.com/users/Acurioustractor/projects/1/settings
2. Add new field: "Type"
3. Field type: Single select
4. Add options (copy from list above)
5. Save

### Step 2: Re-categorize Existing Issues

I'll create a script that:
1. Analyzes each issue title and body
2. Suggests appropriate Type
3. Shows you the mapping
4. Updates Type field

**Smart detection examples**:
- Title contains "database", "table", "column" → **Data**
- Title contains "integrate", "API", "webhook" → **Integration**
- Title contains "mobile", "responsive", "UI" → **UX/UI**
- Title contains "security", "vulnerability", "auth" → **Security**
- Title contains "bug", "fix", "broken" → **Bug**
- Default → **Feature**

### Step 3: Update Automation Workflow

Update `.github/workflows/auto-tag-project-items.yml`:
- New issues default to Type = "Feature"
- Keep type labels for backward compatibility
- Sync label → field

### Step 4: Remove or Keep Type Labels?

**Option A: Remove type labels** (cleaner)
- Type is now a field
- No duplication
- Cleaner issue view

**Option B: Keep both** (safer)
- Field for filtering
- Label for visibility
- Sync them together

**Recommendation**: Keep both initially, remove labels after 2-3 weeks when confident.

---

## 📊 Type-Based Views to Create

### By Type

**Security & Bugs View**:
- Filter: Type = "Security" OR Type = "Bug"
- Sort: Priority (Critical first)
- Purpose: Focus on critical fixes

**Feature Development View**:
- Filter: Type = "Feature" AND Status != "Done"
- Group by: ACT Project
- Purpose: Track feature work by project

**Data Migration View**:
- Filter: Type = "Data"
- Sort: Sprint
- Purpose: Plan database changes together

**Integration Work View**:
- Filter: Type = "Integration"
- Group by: Status
- Purpose: Track external dependencies

**UX/UI Polish View**:
- Filter: Type = "UX/UI" OR LCAA Phase = "Art"
- Purpose: Design and polish work

---

## 🎯 Type + Priority Matrix

Quick decision guide:

| Type | Typical Priority | Typical Sprint |
|------|-----------------|----------------|
| Security | Critical/High | Current |
| Bug | High/Medium | Current/Next |
| Feature | Medium/Low | Backlog |
| Enhancement | Medium/Low | Backlog |
| Data | Medium | Plan ahead |
| Integration | Medium | Plan ahead |
| UX/UI | Low/Medium | After features |
| Configuration | Low | As needed |
| Research | Medium | Before features |
| Documentation | Low | Ongoing |
| Testing | Medium | With features |
| Cleanup | Low | Occasional |

---

## 💡 Examples from Your Issues

Let me re-categorize some of your actual issues:

### Currently labeled "type: chore" → Should be:

**"Implement thumbnail generation"** (#124)
- Current: type: chore
- Should be: **Feature** (new capability)
- Why: Adding new functionality

**"Add organizations table"** (#119, #89)
- Current: type: chore
- Should be: **Data** (database change)
- Why: Schema/data modeling

**"Create mobile version"** (#117, 116, 115, etc.)
- Current: type: chore
- Should be: **UX/UI** (interface work)
- Why: User interface improvement

**"Implement proper permissions"** (#111, #78)
- Current: type: chore
- Should be: **Security** (security work)
- Why: Access control

**"Integrate with Vercel API"** (#32)
- Current: type: chore
- Should be: **Integration** (external system)
- Why: Connecting to external API

**"Send notification email"** (#11, #40, etc.)
- Current: type: chore
- Should be: **Integration** (email service)
- Why: Integrating with email system

**"Navigate to storyteller detail page"** (#93)
- Current: type: chore
- Should be: **UX/UI** (navigation)
- Why: User interface behavior

**"Remove before production"** (#62)
- Current: type: chore
- Should be: **Cleanup** (remove code)
- Why: Actually IS a chore (this one was right!)

---

## 🚀 Next Steps

**Would you like me to**:

1. ✅ Create the Type field migration script?
2. ✅ Analyze all 149 issues and suggest Type for each?
3. ✅ Update the automation workflow to set Type field?
4. ✅ All of the above?

**After migration, you'll have**:
- Type field properly categorizing all work
- Better understanding of what kind of work you're doing
- Smarter filtering and views
- More accurate project planning

---

## 📖 Summary

**The problem**:
- Type was only a label
- Everything was labeled "chore" (incorrect)
- Hard to filter by work type

**The solution**:
- Move Type to proper Project field
- Use 12 meaningful categories
- Most issues are actually Features, Data, or Integration work
- Better categorization → Better planning

**The benefit**:
- "Show me all Security work" → Filter by Type
- "How much Feature vs Bug work?" → Analytics
- "What Integration dependencies?" → Clear visibility
- "Plan Data migrations together" → Grouped view

---

**Ready to migrate?** Let me know and I'll create the scripts!

**Maintained By**: ACT Ecosystem Team
**Last Updated**: 2025-12-26
