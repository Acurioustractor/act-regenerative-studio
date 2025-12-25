# ACT Ecosystem - Developer Guide

**Welcome to the A Curious Tractor (ACT) ecosystem!**

This is a unified system of 7 interconnected Next.js applications that work together as one cohesive platform while maintaining distinct brands and audiences.

---

## 🚀 Quick Start (First Time Setup)

```bash
# 1. Navigate to ACT Main Website
cd "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio"

# 2. Start all 6 dev servers at once
./scripts/start-all-platforms.sh

# 3. Open in your browser:
# - ACT Main Website:  http://localhost:3002
# - Empathy Ledger:    http://localhost:3001
# - JusticeHub:        http://localhost:3003
# - The Harvest:       http://localhost:3004
# - ACT Farm:          http://localhost:3005
# - ACT Placemat:      http://localhost:3999
```

---

## 📚 Essential Reading

**Start here** (in this order):

1. **[ACT_ECOSYSTEM.md](./ACT_ECOSYSTEM.md)** (10 min read)
   - Complete map of all 7 codebases
   - How they connect and share data
   - Brand alignment and audiences
   - **Read this FIRST** to understand the big picture

2. **[MULTI_REPO_QUICK_REFERENCE.md](./MULTI_REPO_QUICK_REFERENCE.md)** (2 min read)
   - One-page cheat sheet
   - Daily commands
   - Common workflows

3. **[CROSS_CODEBASE_BEST_PRACTICES.md](./CROSS_CODEBASE_BEST_PRACTICES.md)** (30 min read)
   - Detailed guide for cross-codebase changes
   - Read when making complex changes

---

## 🎯 The 7 Core Platforms

| # | Platform | Port | Purpose | Status |
|---|----------|------|---------|--------|
| 1 | **ACT Main Website** | :3002 | Hub & Showcase | ✅ 95% |
| 2 | **Empathy Ledger v2** | :3001 | Storytelling API | ⚠️ 85% |
| 3 | **JusticeHub** | :3003 | Youth Justice | ⚠️ 65% |
| 4 | **The Harvest** | :3004 | Community Hub | ✅ 90% |
| 5 | **ACT Farm** | :3005 | Residencies | ⚠️ 80% |
| 6 | **ACT Placemat** | :3999 | Backend Tool | ✅ 75% |
| 7 | **Goods Register** | TBD | Asset Tracking | ❓ TBD |

---

## 🔄 Daily Workflow

### Morning: Start Everything

```bash
cd "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio"
./scripts/start-all-platforms.sh
```

This opens all 6 dev servers in a tmux session.

### After Editing Shared Types

```bash
# 1. Edit types in ACT Main Website (source of truth)
vim src/types/shared/act-featured-content.ts

# 2. Sync to all platforms
./scripts/sync-types-all.sh

# 3. Type check everything
./scripts/type-check-ecosystem.sh
```

### Before Committing

```bash
# Type check all repos
./scripts/type-check-ecosystem.sh

# Update changelog
vim MULTI_REPO_CHANGELOG.md
```

---

## 🌐 How Data Flows

```
┌─────────────────┐
│  ACT Main Site  │ ← Central hub
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼──────┐ │
│ Empathy  │ │  API Provider
│ Ledger   │ │  (storytellers/stories)
└──────────┘ │
             │
    ┌────────┴────────┬──────────┐
    │                 │          │
┌───▼──────┐  ┌───────▼───┐  ┌──▼──────┐
│Justice   │  │ Harvest   │  │  Farm   │
│Hub       │  │           │  │         │
└──────────┘  └───────────┘  └─────────┘

All consume featured content from Empathy Ledger API
All share types defined in ACT Main Website
```

---

## 🎨 One Ecosystem, Many Brands

**Unified Infrastructure:**
- Shared TypeScript types
- Consistent Next.js stack
- Common Redis caching (NAS)
- Coordinated deployments

**Distinct Identities:**
- Individual visual styles
- Unique audiences
- Platform-specific features
- Separate domains

**Result:** Strong network effects while respecting each platform's community and purpose.

---

## ⚡ Key Scripts

| Script | Purpose | When to Use |
|--------|---------|-------------|
| `./scripts/start-all-platforms.sh` | Start all 6 dev servers | Every morning |
| `./scripts/sync-types-all.sh` | Copy types to all platforms | After editing types |
| `./scripts/type-check-ecosystem.sh` | Type check all repos | Before committing |

---

## 🔧 Tech Stack Overview

**Shared:**
- Framework: Next.js (14-16)
- Language: TypeScript
- Database: Supabase (most)
- Styling: Tailwind CSS
- Deployment: Vercel
- Caching: Redis (NAS)

**Platform-Specific:**
- Empathy Ledger: Multiple AI providers, cultural protocols
- JusticeHub: Auth0, campaign bookings
- ACT Farm: Interactive maps, booking calendar
- The Harvest: Formspree (to replace with GoHighLevel)

---

## 📖 Full Documentation Index

### Overview
- [ACT_ECOSYSTEM.md](./ACT_ECOSYSTEM.md) - Complete system map
- [MULTI_REPO_MANAGEMENT.md](./MULTI_REPO_MANAGEMENT.md) - Management guide
- [README_ECOSYSTEM.md](./README_ECOSYSTEM.md) - This file

### Guides
- [CROSS_CODEBASE_BEST_PRACTICES.md](./CROSS_CODEBASE_BEST_PRACTICES.md) - Detailed workflows
- [MULTI_REPO_QUICK_REFERENCE.md](./MULTI_REPO_QUICK_REFERENCE.md) - Cheat sheet
- [docs/MULTI_REPO_ARCHITECTURE.md](./docs/MULTI_REPO_ARCHITECTURE.md) - Visual diagrams

### For Claude
- [.claude/skills/multi-repo-sync.md](./.claude/skills/multi-repo-sync.md) - Claude skill

### History
- [MULTI_REPO_CHANGELOG.md](./MULTI_REPO_CHANGELOG.md) - Change tracking

---

## 🎓 Learning Path

**New to the ecosystem?**

1. **Day 1:** Read [ACT_ECOSYSTEM.md](./ACT_ECOSYSTEM.md) - Understand all 7 platforms
2. **Day 2:** Run `./scripts/start-all-platforms.sh` - See everything working
3. **Day 3:** Read [CROSS_CODEBASE_BEST_PRACTICES.md](./CROSS_CODEBASE_BEST_PRACTICES.md) - Learn workflows
4. **Day 4:** Make a small change, sync types, test - Get hands-on experience
5. **Ongoing:** Keep [MULTI_REPO_QUICK_REFERENCE.md](./MULTI_REPO_QUICK_REFERENCE.md) handy

---

## 🚨 Important Rules

### Golden Rules (NEVER BREAK)

1. **ACT Main Website is source of truth for types** - Edit there FIRST
2. **Run `sync-types-all.sh`** after editing types
3. **Deploy order:** Migration → API → Consumers (NEVER reverse)
4. **Validate at runtime** - Never trust API responses
5. **Fail gracefully** - Handle errors, don't crash

### Before Committing Checklist

- [ ] Edited types in ACT Main Website (not other repos)
- [ ] Ran `./scripts/sync-types-all.sh`
- [ ] Ran `./scripts/type-check-ecosystem.sh` (no errors)
- [ ] Tested with `./scripts/start-all-platforms.sh`
- [ ] Updated `MULTI_REPO_CHANGELOG.md`

---

## 🤝 Getting Help

1. **Check docs:** Start with [ACT_ECOSYSTEM.md](./ACT_ECOSYSTEM.md)
2. **Search changelog:** [MULTI_REPO_CHANGELOG.md](./MULTI_REPO_CHANGELOG.md) for examples
3. **Run scripts:** `sync-types-all.sh` and `type-check-ecosystem.sh`
4. **Ask the team:** Share the error and which platforms are affected

---

## 🌟 Vision

**Building 7 platforms as one unified ecosystem:**

✅ Shared infrastructure (types, APIs, caching, hosting)
✅ Consistent development practices
✅ Cross-platform features (search, auth, analytics)
✅ Seamless data flow

**While preserving:**

✅ Individual brand identities
✅ Distinct audiences and purposes
✅ Platform-specific features
✅ Community sovereignty

**Result:** Each platform serves its community with excellence while benefiting from shared infrastructure and network effects across the whole ACT family.

---

**Welcome to the ecosystem! 🚀**

Start with [ACT_ECOSYSTEM.md](./ACT_ECOSYSTEM.md) to see how it all fits together.
