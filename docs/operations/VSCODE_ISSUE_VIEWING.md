# VS Code Issue Viewing Guide

> **How to see GitHub issues directly in VS Code workspace**

**For complete agile workflow**, see: [AGILE_WORKFLOW_VSCODE.md](./AGILE_WORKFLOW_VSCODE.md)

---

## 🎯 Method 1: GitHub Pull Requests & Issues Extension (BEST FOR AGILE)

**This is the proper way to work through issues in VS Code with automatic GitHub sync.**

### Setup (One-Time)

1. Extension is already installed: `GitHub.vscode-pull-request-github`
2. Reload VS Code: `Cmd+Shift+P` → "Developer: Reload Window"
3. Look for **GitHub icon** in Activity Bar (left sidebar)

### Using It Daily

1. **Click GitHub icon** in sidebar
2. **See your sprint**:
   ```
   📌 MY ISSUES
     ├─ My Current Sprint (assignee:@me)
     ├─ Urgent This Week (critical/high priority)
     ├─ Security & Bugs
     └─ All Open Issues
   ```

3. **Right-click any issue**:
   - "Start Working on Issue" → Auto-creates branch
   - "Copy Issue URL" → Share with team
   - "Copy Issue Number" → Use in commits

4. **Work → Commit → Push**:
   - Use `Fixes #34` in commit message
   - GitHub auto-closes issue
   - Project board auto-updates

**This is the complete agile flow.** See [AGILE_WORKFLOW_VSCODE.md](./AGILE_WORKFLOW_VSCODE.md) for full details.

---

## 🎯 Method 2: VS Code Tasks (Quick Terminal View)

The workspace has custom tasks pre-configured. Just run them:

### View Your Issues

1. Press `Cmd+Shift+P` (Command Palette)
2. Type "Tasks: Run Task"
3. Select:
   - **"My Issues"** - Your assigned issues
   - **"Urgent Issues"** - Critical/High priority
   - **"All Open Issues"** - Everything

**Output shows:**
```
#34  Security vulnerability in auth [Security Hardening]  about 2 days ago
#35  SQL injection risk              [Security Hardening]  about 3 days ago
#45  Add mobile UI                   [Empathy Ledger Core] about 1 week ago
```

**That's it!** No extension needed.

**Use these for quick checks**, but use Method 1 (GitHub Extension) for daily workflow.

---

## 📋 Configured Issue Queries

Your workspace has custom queries for the GitHub extension:

### 1. My Current Sprint
- **Query**: `assignee:@me state:open`
- **Shows**: Your assigned issues across all 6 ACT repos
- **Use**: See what you're working on today

### 2. Urgent This Week
- **Query**: `state:open label:priority:critical,priority:high`
- **Shows**: Critical and High priority issues
- **Use**: What needs immediate attention

### 3. Security & Bugs
- **Query**: `state:open label:type:security,type:bug`
- **Shows**: Security issues and bugs
- **Use**: Quality-critical work

### 4. All Open Issues
- **Query**: `state:open sort:updated-desc`
- **Shows**: Everything, newest first
- **Use**: Full project overview

---

## 🔧 Additional Methods

### Method 3: TODO Tree Extension

The workspace already recommends `gruntfuggly.todo-tree`.

**Use case**: Find in-code TODOs, FIXMEs, NOTEs
**Shows**: Comments like `// TODO: Add validation`
**Not for**: GitHub issues (different purpose)

### Method 4: GitLens Extension

The workspace already recommends `eamodio.gitlens`.

**Use case**: See commit history, blame, and linked issues
**Shows**: Which issues were fixed in recent commits
**Not for**: Browsing open issues (use GitHub extension instead)

---

## 💡 Recommended Workflow

### Morning Routine
1. Open workspace: `code /Users/benknight/Code/ACT-Ecosystem.code-workspace`
2. Click **GitHub icon** in sidebar
3. Check **"My Current Sprint"** query
4. See your assigned issues for today
5. Right-click issue → "Start Working on Issue"

### During Development
1. GitHub extension shows issue details in sidebar
2. Work in code editor
3. Use Claude Code: `claude "Let's work on #34"`
4. Commit with: `Fixes #34` in message
5. Push → Issue auto-closes, project updates

### End of Day
1. Check **"My Current Sprint"** query
2. See what's still open
3. Update any "In Progress" items in GitHub Project
4. Plan tomorrow

---

## 🎨 Customizing Queries

Edit workspace file to add your own queries:

```json
"githubIssues.queries": [
  {
    "label": "This Week's Milestones",
    "query": "state:open milestone:\"Security Hardening\""
  },
  {
    "label": "Empathy Ledger Only",
    "query": "state:open repo:Acurioustractor/empathy-ledger-v2"
  }
]
```

**Query Syntax**: [GitHub search syntax](https://docs.github.com/en/search-github/searching-on-github/searching-issues-and-pull-requests)

Common filters:
- `assignee:@me` - Assigned to me
- `milestone:"Milestone Name"` - Specific milestone
- `label:type:bug` - Specific label
- `repo:owner/repo` - Specific repository
- `sort:updated-desc` - Sort by last updated

---

## 📚 Related Docs

- [WORLD_CLASS_WORKFLOW.md](./WORLD_CLASS_WORKFLOW.md) - Complete development workflow
- [QUICK_START_TEAM_WORKFLOW.md](./QUICK_START_TEAM_WORKFLOW.md) - 10-minute quick start
- [ACT-Ecosystem.code-workspace](../../ACT-Ecosystem.code-workspace) - Workspace config

---

## 🚀 Quick Reference

| Want to see...                     | Use...                          | Location                      |
| ---------------------------------- | ------------------------------- | ----------------------------- |
| My assigned issues                 | GitHub extension                | Sidebar → GitHub icon         |
| All issues in current repo         | GitHub extension                | Click "All Open Issues" query |
| In-code TODOs                      | TODO Tree extension             | Sidebar → TODO Tree icon      |
| Commit history with linked issues  | GitLens extension               | File → Inline blame view      |
| Issues via CLI                     | Custom workspace task           | Cmd+Shift+P → Tasks           |
| Full GitHub Project board          | Browser                         | https://github.com/users/Acurioustractor/projects/1 |

---

**Last Updated**: 2025-12-26
**Part of**: ACT World-Class Workflow
