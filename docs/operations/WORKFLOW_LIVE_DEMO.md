# Live Workflow Demonstration

> **Step-by-step walkthrough of working through Issue #32 with Claude Code**

---

## 🎯 Issue: #32 - Integrate with Vercel API

**Task**: Fetch real deployment data from Vercel API
**Type**: Enhancement
**Priority**: Low
**Effort**: 1h
**Current Status**: Todo

---

## 📋 Step 1: View Issue in VS Code

### How a Developer Would See This

**Option A: GitHub Extension (Recommended)**
1. Open VS Code
2. Click GitHub icon in sidebar
3. See "My Issues" or "All Open Issues"
4. Click #32 to view details

**Option B: Ask Claude Code**
```bash
User: "What issues should I work on?"
Claude: Shows list of issues, recommends #32 based on priority/effort
```

**Option C: VS Code Tasks**
```bash
Cmd+Shift+P → Tasks: Run Task → "All Open Issues"
# Shows: #32  Integrate with Vercel API  [ACT Main]  1h
```

---

## 🔨 Step 2: Start Working (In VS Code or via Claude Code)

### What Happens Automatically

**If using GitHub Extension:**
1. Right-click #32 → "Start Working on Issue"
2. VS Code creates branch: `issue32`
3. Switches to new branch
4. Ready to code!

**If using Claude Code:**
```bash
User: "Let's work on issue 32"
Claude:
  - Reads issue details
  - Creates branch: git checkout -b issue32
  - Starts working on solution
```

### Current GitHub Project Status
```
Status: Todo → In Progress (manual update, or auto via workflow)
```

---

## 💻 Step 3: Write Code (Demo: Vercel API Integration)

### File Created: `src/lib/vercel/client.ts`

```typescript
/**
 * Vercel API Client
 *
 * Fetches real deployment data from Vercel API
 * Fixes #32
 */

const VERCEL_TOKEN = process.env.VERCEL_TOKEN;

interface VercelDeployment {
  uid: string;
  name: string;
  url: string;
  state: 'READY' | 'ERROR' | 'BUILDING';
  created: number;
}

export async function getDeployments(projectName: string) {
  const response = await fetch(
    `https://api.vercel.com/v6/deployments?projectId=${projectName}`,
    {
      headers: { 'Authorization': `Bearer ${VERCEL_TOKEN}` }
    }
  );

  if (!response.ok) {
    throw new Error(`Vercel API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.deployments;
}

export async function getLatestProduction(projectName: string) {
  const deployments = await getDeployments(projectName);
  return deployments.find(d => d.state === 'READY');
}
```

### What Claude Code Does

```bash
User: "Create a Vercel API client to fetch deployment data"

Claude:
  1. Reads existing code patterns in src/lib/
  2. Creates src/lib/vercel/client.ts
  3. Writes TypeScript code with proper types
  4. Adds error handling
  5. Documents with JSDoc
  6. References #32 in comments
```

---

## ✅ Step 4: Commit Changes

### The Magic Keyword: "Fixes #32"

**Developer runs:**
```bash
git add src/lib/vercel/client.ts
git commit -m "feat: add Vercel API client for deployment data

Integrates with Vercel API to fetch real deployment information
for the dashboard instead of using mock data.

Fixes #32"
```

**Or with Claude Code:**
```bash
User: "Commit this work"

Claude:
  git add src/lib/vercel/client.ts
  git commit -m "$(cat <<'EOF'
  feat: add Vercel API client for deployment data

  Integrates with Vercel API to fetch real deployment info.

  Fixes #32

  🤖 Generated with Claude Code
  Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
  EOF
  )"
```

### What "Fixes #32" Does

This keyword tells GitHub:
- ✅ Link this commit to issue #32
- ✅ When PR merges, auto-close issue #32
- ✅ Update GitHub Project status to "Done"

---

## 🚀 Step 5: Push & Create PR

### Push Branch

```bash
git push origin issue32
```

### Create Pull Request

**Method A: GitHub Extension**
1. Click GitHub icon
2. Click "Create Pull Request"
3. Title: "Add Vercel API integration"
4. Body: "Fixes #32"
5. Submit

**Method B: GitHub CLI**
```bash
gh pr create --title "Add Vercel API integration" --body "Fixes #32"
```

**Method C: Claude Code**
```bash
User: "Create a PR for this"

Claude:
  gh pr create --title "feat: add Vercel API client" --body "$(cat <<'EOF'
  ## Summary
  Integrates with Vercel API to fetch real deployment data.

  ## Changes
  - Created src/lib/vercel/client.ts
  - Added getDeployments() function
  - Added getLatestProduction() helper
  - Proper error handling and types

  ## Testing
  - [x] Tested with ACT Main project
  - [x] Verified deployment data format
  - [x] Error handling works

  Fixes #32

  🤖 Generated with Claude Code
  EOF
  )"
```

---

## 🔄 Step 6: What Happens Automatically in GitHub

### When PR is Created

1. **PR Links to Issue #32**
   - Shows "1 linked pull request" on issue
   - Issue timeline shows PR reference

2. **GitHub Project Updates** (if configured)
   - Can add automation: When PR created → Status = "In Review"

3. **Vercel Deploys Preview**
   - Automatic preview deployment
   - Comment added to PR with preview URL

### When PR is Merged

1. **Issue #32 Closes Automatically** ✅
   - Because commit message contained "Fixes #32"

2. **GitHub Project Updates** ✅
   - Status: "In Progress" → "Done"
   - Shows in "Done" column on project board

3. **Notion Syncs** (if sync running) ✅
   - Next sync run detects closed issue
   - Moves card to "✅ Done" column in Notion Kanban

4. **Vercel Deploys to Production** ✅
   - Code merged to main
   - Automatic production deployment
   - New feature live!

---

## 📊 Step 7: Track Progress

### In GitHub Project Board

```
Before:
┌─────────┬──────────────┬────────┐
│ TODO    │ IN PROGRESS  │  DONE  │
├─────────┼──────────────┼────────┤
│ #32 ✓   │              │        │
│ #33     │              │        │
└─────────┴──────────────┴────────┘

After Merge:
┌─────────┬──────────────┬────────┐
│ TODO    │ IN PROGRESS  │  DONE  │
├─────────┼──────────────┼────────┤
│ #33     │              │ #32 ✅ │
└─────────┴──────────────┴────────┘
```

### In Notion (After Sync)

```
Before:
📋 Todo          ⏳ In Progress    ✅ Done
────────────────────────────────────────
#32 Vercel API
#33 Critical fix

After Sync:
📋 Todo          ⏳ In Progress    ✅ Done
────────────────────────────────────────
#33 Critical fix                   #32 Vercel API ✅
```

### Milestone Progress

```
Integration Platform: 15/20 complete (75%)
  ✅ #32: Vercel API integration
  ⏳ #28: Real deployment status
  📋 #27: Fetch deployment data
  ... 17 more
```

---

## 🎯 Complete Timeline

| Time | Action | Where | What Happens |
|------|--------|-------|--------------|
| **9:00am** | View issues | VS Code | See #32 in "My Issues" |
| **9:05am** | Start working | VS Code | Create branch `issue32` |
| **9:10am** | Write code | VS Code + Claude | Create src/lib/vercel/client.ts |
| **9:45am** | Test locally | Terminal | Verify API calls work |
| **9:50am** | Commit | Git | `git commit -m "Fixes #32"` |
| **9:52am** | Push | Git | `git push origin issue32` |
| **9:53am** | Create PR | GitHub | "Add Vercel API integration" |
| **9:53am** | Auto-deploy preview | Vercel | Preview URL posted to PR |
| **10:00am** | Review | GitHub | Teammate reviews code |
| **10:15am** | Approve & Merge | GitHub | PR merged to main |
| **10:15am** | **Issue closes** | **GitHub** | **#32 auto-closes** ✅ |
| **10:15am** | **Project updates** | **GitHub** | **Status → Done** ✅ |
| **10:16am** | Deploy production | Vercel | Live on act-studio.vercel.app |
| **10:30am** | Notion sync runs | Cron/Action | Card moves to Done column ✅ |

---

## 🤖 Claude Code Advantages

### Without Claude Code
```
1. Read issue manually
2. Research Vercel API docs
3. Write boilerplate code
4. Test API calls
5. Write commit message
6. Create PR description
= 1 hour
```

### With Claude Code
```
User: "Work on issue 32"
Claude:
  - Reads issue
  - Researches Vercel API
  - Writes complete implementation
  - Adds error handling
  - Creates tests
  - Writes commit with "Fixes #32"
  - Creates PR
= 15 minutes
```

**Time saved**: 45 minutes per issue!

---

## 💡 Key Takeaways

### What Makes This "Auto-magic"

1. **"Fixes #32" keyword** in commit
   - Auto-links commit to issue
   - Auto-closes issue when PR merges
   - No manual clicking needed!

2. **GitHub Actions** (if configured)
   - Auto-update Project status fields
   - Auto-assign to milestone
   - Auto-add labels

3. **Notion Sync** (when running)
   - Polls GitHub every 15 min
   - Updates Notion database
   - Moves cards on Kanban

4. **Vercel Integration**
   - Auto-deploys on merge
   - Posts preview URLs
   - Updates production

### The Developer Just Needs To

1. ✅ Pick an issue
2. ✅ Write code
3. ✅ Commit with "Fixes #XX"
4. ✅ Push

**Everything else is automatic!**

---

## 🚀 Try It Yourself

### Quick Test

1. **Pick an issue** from GitHub
2. **Create a branch**: `git checkout -b issue-test`
3. **Make a small change** (add a comment somewhere)
4. **Commit**: `git commit -m "test: verify workflow Fixes #999"` (use a test issue number)
5. **Push**: `git push origin issue-test`
6. **Create PR** with "Fixes #999" in description
7. **Watch**: Issue auto-closes when merged!

### With Claude Code

```bash
User: "Let's test the workflow with issue 32"
Claude: [Demonstrates entire flow]
```

---

## 📚 Related Docs

- [AGILE_WORKFLOW_VSCODE.md](./AGILE_WORKFLOW_VSCODE.md) - Complete workflow guide
- [WORKFLOW_DIAGRAM.md](./WORKFLOW_DIAGRAM.md) - Visual diagrams
- [QUICK_START_TEAM_WORKFLOW.md](./QUICK_START_TEAM_WORKFLOW.md) - Quick reference

---

**Last Updated**: 2025-12-26
**Demo Issue**: #32 - Vercel API Integration
**Status**: Ready to demonstrate!
