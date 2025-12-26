# Label to Project Field Migration Guide

**Goal**: Move metadata from GitHub Labels to proper GitHub Project Fields
**Why**: Project fields are better for filtering, sorting, and analytics
**Status**: Ready to execute

---

## Current State Analysis

### ✅ GitHub Project Fields (Already Created)

Your project already has these custom fields set up:

1. **ACT Project** (Single Select) ✅ FULLY AUTOMATED
   - Options: ACT Main, Empathy Ledger, JusticeHub, The Harvest, ACT Farm, ACT Placemat, Goods, Cross-Project
   - **Status**: Already populated for all 149 issues via automation

2. **LCAA Phase** (Single Select) ✅ POPULATED
   - Options: Listen, Curiosity, Action, Art
   - **Status**: All 149 issues set to "Action"

3. **Effort** (Single Select) ⚠️ NEEDS MIGRATION
   - Options: 1h, 3h, 1d, 3d, 1w, 2w
   - **Status**: Field exists, but values are in labels

4. **Priority** (Single Select) ⚠️ NEEDS MIGRATION + FIX OPTIONS
   - Options: low, Medium, High (needs "Critical" added)
   - **Status**: Field exists, but values are in labels

5. **Sprint** (Text Field)
   - **Status**: Empty, can be set manually or via script

---

## 🏷️ Labels Currently in Use

### Labels That Should Become Project Fields

**Effort Labels** (should → Effort field):
- `effort: 1h` → Effort = "1h"
- `effort: 4h` → Effort = "3h" (close enough) or add "4h" option
- `effort: 1d` → Effort = "1d"
- `effort: 3d` → Effort = "3d"
- `effort: 1w` → Effort = "1w"

**Priority Labels** (should → Priority field):
- `priority: critical` → Priority = "Critical" (need to add this option!)
- `priority: high` → Priority = "High"
- `priority: medium` → Priority = "Medium"
- `priority: low` → Priority = "low" (capitalize to "Low"?)

**LCAA Labels** (already migrated ✅):
- `lcaa: listen` → LCAA Phase = "Listen"
- `lcaa: curiosity` → LCAA Phase = "Curiosity"
- `lcaa: action` → LCAA Phase = "Action"
- `lcaa: art` → LCAA Phase = "Art"

**Project Labels** (already migrated ✅):
- `project: goods` → ACT Project = "Goods"
- `project: empathy-ledger` → ACT Project = "Empathy Ledger"
- etc.

### Labels That Should Stay as Labels

**Type Labels** (keep as labels - explained below):
- `type: bug` - Something broken
- `type: feature` - New capability
- `type: docs` - Documentation
- `type: refactor` - Code improvement
- `type: test` - Testing
- `type: chore` - Maintenance

**Status Labels** (keep as labels - Status field exists):
- `status: blocked`
- `status: needs-review`
- `status: in-progress`
- `status: help-wanted`

**Domain/Category Labels** (keep as labels):
- `asset-tracking`
- `circular-economy`
- `goods`
- `breaking-change`
- `epic`
- `needs-decision`
- `good first issue`
- `help wanted`

**Built-in GitHub Labels** (keep):
- `bug`, `documentation`, `duplicate`, `enhancement`, `invalid`, `question`, `wontfix`

---

## 📝 What is "Type"?

**Type** = The nature/category of work being done

**Examples**:
- `type: bug` - Fixing something broken
- `type: feature` - Building new capability
- `type: docs` - Writing documentation
- `type: refactor` - Improving code structure without changing behavior
- `type: test` - Adding or improving tests
- `type: chore` - Maintenance work (dependency updates, config, etc.)

**Why keep as labels instead of a field?**
- Issues can have multiple types (e.g., `bug` + `breaking-change`)
- GitHub's built-in labels already cover some of this (`bug`, `enhancement`, `documentation`)
- Labels are more visible in issue lists
- Type is more about "what kind of work" vs. "where/when/how much" (which are better as fields)

**Alternative**: You could create a "Type" project field if you want strict categorization, but labels are the GitHub-native way to handle this.

---

## 🎯 Recommended Field Structure

Here's the ideal setup:

### Project Fields (structured data for filtering/sorting):
1. **ACT Project** - Which product/project? (Goods, Empathy Ledger, etc.)
2. **LCAA Phase** - Which methodology phase? (Listen, Curiosity, Action, Art)
3. **Priority** - How urgent? (Critical, High, Medium, Low)
4. **Effort** - How long? (1h, 3h, 1d, 3d, 1w, 2w)
5. **Sprint** - Which sprint/milestone? (Text field)
6. **Status** - What stage? (Todo, In Progress, Done)

### GitHub Labels (flexible tags for categorization):
1. **Type** - What kind of work? (`type: bug`, `type: feature`, `type: docs`, etc.)
2. **Domain** - What area? (`asset-tracking`, `circular-economy`, `storytelling`, etc.)
3. **Flags** - Special markers (`breaking-change`, `good first issue`, `needs-decision`, `epic`)
4. **Status modifiers** - Additional status info (`blocked`, `needs-review`, `help-wanted`)

---

## 🚀 Migration Steps

### Step 1: Add Missing Priority Option

The Priority field is missing "Critical". We need to add it via the GitHub UI:

1. Go to: https://github.com/users/Acurioustractor/projects/1/settings
2. Find "Priority" field
3. Add option: "Critical"
4. Optionally: Capitalize "low" to "Low" for consistency
5. Reorder options: Critical, High, Medium, Low

**OR** I can create a script to add the "Critical" option via GraphQL.

### Step 2: Migrate Effort Labels → Effort Field

Create script to:
1. Find all issues with `effort: *` labels
2. Set corresponding Effort field value
3. Optionally remove the label (or keep for backward compatibility)

### Step 3: Migrate Priority Labels → Priority Field

Create script to:
1. Find all issues with `priority: *` labels
2. Set corresponding Priority field value
3. Optionally remove the label

### Step 4: Clean Up Old Labels (Optional)

After migration:
- Remove `project: *` labels (replaced by ACT Project field)
- Remove `lcaa: *` labels (replaced by LCAA Phase field)
- Remove `effort: *` labels (replaced by Effort field)
- Remove `priority: *` labels (replaced by Priority field)

**OR** keep them for backward compatibility in repos.

---

## 📊 Migration Script Preview

I can create a script that:

```javascript
// Pseudocode
for each issue in project:
  // Migrate Effort
  if (issue has label 'effort: 1h'):
    set Effort field = "1h"
    optionally remove label

  // Migrate Priority
  if (issue has label 'priority: high'):
    set Priority field = "High"
    optionally remove label

  // etc.
```

---

## ⚡ Quick Decision Matrix

| Label Pattern | Action | Reason |
|---------------|--------|--------|
| `project: *` | ✅ Migrate to ACT Project field | Already done! |
| `lcaa: *` | ✅ Migrate to LCAA Phase field | Already done! |
| `effort: *` | ⚠️ Migrate to Effort field | **TODO** |
| `priority: *` | ⚠️ Migrate to Priority field | **TODO** (add Critical first) |
| `type: *` | ❌ Keep as labels | Multiple types possible, GitHub-native |
| `status: *` | ❌ Keep as labels | Supplements Status field |
| Domain tags | ❌ Keep as labels | Flexible categorization |
| Flags | ❌ Keep as labels | Special markers |

---

## 🎯 Recommended Next Steps

**Option A: Full Automation (Recommended)**
1. I create a migration script
2. Add "Critical" to Priority field
3. Run script to migrate Effort and Priority from labels → fields
4. Review results
5. Optionally clean up old labels

**Time**: 10-15 minutes

**Option B: Manual Migration**
1. You manually add "Critical" to Priority field
2. You bulk-select issues in project UI and set Effort/Priority
3. Manually remove old labels if desired

**Time**: 1-2 hours

**Option C: Hybrid**
1. I create the script but you review first
2. You run it when ready
3. Gradual migration as you work

**Time**: Ongoing

---

## 🤔 Questions to Decide

1. **Should I create the migration script now?** (Recommended: Yes)
2. **Should we add "Critical" to Priority field?** (Recommended: Yes)
3. **Should we add "4h" to Effort field?** (You have `effort: 4h` labels but no 4h option)
4. **Should we remove old labels after migration?** (Recommended: No, keep for compatibility)
5. **Should we create a "Type" project field?** (Recommended: No, keep as labels)

---

## 📈 Benefits After Migration

**Better filtering**:
- "Show me all High priority items in Goods project that are 1d or less"
- "Show me all Critical items across ecosystem"
- "Show me Action phase work that's 1-3 hours (good first issues)"

**Better sorting**:
- Sort by Priority (Critical → High → Medium → Low)
- Sort by Effort (1h → 2w)
- Group by LCAA Phase in board view

**Better analytics**:
- How much effort is in each Sprint?
- What's the priority distribution across projects?
- Which phase has the most work?

**Automation**:
- Auto-tag Priority/Effort based on issue title keywords
- Sprint planning views that calculate total effort
- Priority-based notifications

---

**Next**: Tell me which option (A, B, or C) you prefer and I'll proceed!

---

**Maintained By**: ACT Ecosystem Team
**Last Updated**: 2025-12-26
**Status**: Ready for migration
