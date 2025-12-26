# Multi-Repository Management System

**Created:** December 24, 2024
**Purpose:** Manage code changes across ACT's 7 core codebases with type safety and clarity

---

## Quick Start

### Daily Commands

```bash
# Start all 6 dev servers
./scripts/start-all-platforms.sh

# Sync types after editing them (to all platforms)
./scripts/sync-types-all.sh

# Type check all repos
./scripts/type-check-ecosystem.sh
```

---

## Documentation

### 📚 Core Documents

1. **[ACT_ECOSYSTEM.md](./ACT_ECOSYSTEM.md)** - Complete map of all 7 codebases
   - System overview with architecture diagrams
   - Brand & audience alignment
   - Tech stack details per platform
   - **Read this first** to understand the full ecosystem

2. **[CROSS_CODEBASE_BEST_PRACTICES.md](./CROSS_CODEBASE_BEST_PRACTICES.md)** (15,000+ words)
   - Comprehensive guide to working across multiple codebases
   - Principles, workflows, checklists, and common pitfalls
   - API contract management, database coordination

3. **[.claude/skills/multi-repo-sync.md](./.claude/skills/multi-repo-sync.md)** (6,000+ words)
   - Claude Code skill for managing cross-repo changes
   - Step-by-step workflows for common tasks

4. **[MULTI_REPO_CHANGELOG.md](./MULTI_REPO_CHANGELOG.md)**
   - Track changes that span multiple repos
   - Documents API contracts, deployments, and known issues
   - **Update this** whenever you make cross-repo changes

5. **[MULTI_REPO_QUICK_REFERENCE.md](./MULTI_REPO_QUICK_REFERENCE.md)**
   - One-page cheat sheet for daily workflows

---

## The 7 Core Codebases

### 1. **ACT Main Website** (This Repo)
- **Path:** `/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio`
- **Role:** Central hub, project showcase, **shared types source of truth**
- **Stack:** Next.js 15.1.3, Supabase, TypeScript
- **Port:** `:3002`
- **Status:** ✅ 95% complete, production-ready

### 2. **Empathy Ledger v2**
- **Path:** `/Users/benknight/Code/empathy-ledger-v2`
- **Role:** Storytelling platform, API provider, cultural archive
- **Stack:** Next.js 14.2.35, Supabase, TypeScript
- **Port:** `:3001`
- **Status:** ⚠️ 85% complete, needs UI fixes

### 3. **JusticeHub**
- **Path:** `/Users/benknight/Code/JusticeHub`
- **Role:** Youth justice platform, service directory
- **Stack:** Next.js ^14.2.25, Supabase, Auth0
- **Port:** `:3003`
- **Status:** ⚠️ 65% complete, many TODOs

### 4. **The Harvest**
- **Path:** `/Users/benknight/Code/The Harvest Website`
- **GitHub:** `harvest-community-hub`
- **Role:** Community hub, therapeutic programs, events
- **Stack:** Next.js 14.0.4, TypeScript, Supabase
- **Port:** `:3004`
- **Status:** ✅ 90% complete, almost production-ready

### 5. **ACT Farm**
- **Path:** `/Users/benknight/Code/ACT Farm/act-farm`
- **Role:** Tourism, residencies, conservation showcase
- **Stack:** Next.js 16, TypeScript, Tailwind
- **Port:** `:3005`
- **Status:** ⚠️ 80% complete, needs bookings

### 6. **ACT Placemat**
- **Path:** `/Users/benknight/Code/ACT Placemat`
- **Role:** Backend services, year-in-review, project metadata
- **Stack:** Next.js ~15.2.4, Supabase
- **Port:** `:3999`
- **Status:** ✅ 75% complete, internal tool

### 7. **Goods Asset Register**
- **Path:** `/Users/benknight/Code/Goods Asset Register`
- **Role:** Goods on Country asset tracking
- **Stack:** TBD (under investigation)
- **Status:** ❓ Unknown

---

## Key Principles

### 1. **Single Source of Truth for Types**
ACT Main Website defines all shared TypeScript interfaces. Copy them to other repos.

**Why?** The website is the consumer, so it defines what it expects to receive from APIs.

### 2. **Runtime Validation at Boundaries**
Never trust data crossing codebase boundaries, even with TypeScript.

**Why?** Types are erased at runtime. API responses need validation.

### 3. **API Versioning for Breaking Changes**
Use `/api/v1/`, `/api/v2/` in URLs. Keep old versions during migration.

**Why?** Prevents breaking existing consumers when you change response structure.

### 4. **Additive-Only Database Changes**
Add columns, don't rename or remove (until safe).

**Why?** Downtime-free deployments require backward compatibility.

### 5. **Fail Gracefully**
If an API fails, degrade gracefully rather than crashing.

**Why?** Better user experience when integrations are temporarily unavailable.

---

## Workflows

### ✅ Adding a New API Endpoint

1. Define types in ACT Main Website (`/src/types/shared/`)
2. Run `./scripts/sync-types.sh` to copy to Empathy Ledger
3. Implement API in Empathy Ledger (`/src/app/api/v1/`)
4. Implement client in ACT Website (`/src/lib/`)
5. Add runtime validation in both
6. Run `./scripts/type-check-all.sh`
7. Test locally with `./start-all.sh`
8. Update `MULTI_REPO_CHANGELOG.md`
9. Deploy: migration → API → consumer

### ✅ Modifying Shared Types

1. Edit in ACT Main Website (`/src/types/shared/`)
2. Run `./scripts/sync-types.sh`
3. Update implementations in both repos
4. Run `./scripts/type-check-all.sh`
5. Test locally
6. Update changelog
7. Deploy

### ✅ Database Migration

1. Write migration in Empathy Ledger (`/supabase/migrations/`)
2. Test locally (`supabase db reset`)
3. Update API to use new schema
4. Update types in ACT Website
5. Sync types to Empathy Ledger
6. Type check and test
7. Deploy: migration first, then API, then consumer

---

## Scripts

### `./scripts/sync-types.sh`
Copies shared types from ACT Main Website to Empathy Ledger.

**Usage:**
```bash
./scripts/sync-types.sh
```

**When to use:**
- After editing any file in `/src/types/shared/`
- Before committing changes to Empathy Ledger
- Before deploying

### `./scripts/type-check-all.sh`
Runs TypeScript type checking on all three codebases.

**Usage:**
```bash
./scripts/type-check-all.sh
```

**When to use:**
- Before committing
- Before deploying
- After syncing types

### `./start-all.sh`
Starts dev servers for Empathy Ledger and ACT Website.

**Usage:**
```bash
./start-all.sh
```

**Starts:**
- Empathy Ledger on http://localhost:3001
- ACT Main Website on http://localhost:3002

---

## Common Tasks

### I'm adding a new feature that spans multiple repos

1. Read [CROSS_CODEBASE_BEST_PRACTICES.md](./CROSS_CODEBASE_BEST_PRACTICES.md)
2. Follow the "Adding a New API Endpoint" workflow above
3. Update [MULTI_REPO_CHANGELOG.md](./MULTI_REPO_CHANGELOG.md)

### I changed a shared type

1. Make sure you edited it in **ACT Main Website** (source of truth)
2. Run `./scripts/sync-types.sh`
3. Run `./scripts/type-check-all.sh`
4. Fix any errors in both repos
5. Test locally with `./start-all.sh`

### I want to deploy changes

1. Run `./scripts/type-check-all.sh` to verify no errors
2. Deploy in this order:
   - Database migration (if any): `supabase db push`
   - Empathy Ledger API: `vercel deploy --prod`
   - ACT Website: `vercel deploy --prod`
3. Monitor production logs

### Types are out of sync between repos

```bash
# Re-sync from source of truth
./scripts/sync-types.sh

# Verify
./scripts/type-check-all.sh
```

### API is returning unexpected data

```bash
# Test API directly
curl -s http://localhost:3001/api/v1/act-projects/justicehub/featured | jq .

# Compare against TypeScript type definition
cat src/types/shared/act-featured-content.ts

# If they don't match, update either the API or the type
```

---

## Checklists

### Before Committing
- [ ] Edited types in ACT Main Website (not Empathy Ledger)
- [ ] Ran `./scripts/sync-types.sh`
- [ ] Ran `./scripts/type-check-all.sh`
- [ ] Tested locally with `./start-all.sh`
- [ ] Updated `MULTI_REPO_CHANGELOG.md`

### Before Deploying
- [ ] All type checks pass
- [ ] Manual testing complete
- [ ] Changelog updated
- [ ] Rollback plan identified
- [ ] Deploy in correct order: migration → API → consumer

---

## File Reference

### Shared Types (Source of Truth)
```
/src/types/shared/
├── act-featured-content.ts   # ACT project tagging types
└── [more types as needed]
```

### API Implementations (Empathy Ledger)
```
/Users/benknight/Code/Empathy Ledger v.02/src/app/api/v1/
├── act-projects/
│   └── [slug]/
│       └── featured/
│           └── route.ts       # GET /api/v1/act-projects/{slug}/featured
└── [more endpoints]
```

### API Clients (ACT Website)
```
/src/lib/
├── empathy-ledger-featured.ts # Client for featured content API
└── [more clients]
```

---

## Troubleshooting

### "Module not found: Can't resolve '@/types/shared/...'"
Run `./scripts/sync-types.sh` to copy types from ACT Website to Empathy Ledger.

### "Types don't match between repos"
Types in Empathy Ledger are stale. Run `./scripts/sync-types.sh`.

### "Type check fails in Empathy Ledger after editing types"
You probably edited types in Empathy Ledger instead of ACT Website.

Fix:
1. Edit types in ACT Website
2. Run `./scripts/sync-types.sh`
3. Run `./scripts/type-check-all.sh`

### "API returning different structure than TypeScript expects"
Add runtime validation in your API client. See [CROSS_CODEBASE_BEST_PRACTICES.md](./CROSS_CODEBASE_BEST_PRACTICES.md#runtime-validation-at-boundaries).

---

## Getting Help

1. **Read the docs:**
   - [CROSS_CODEBASE_BEST_PRACTICES.md](./CROSS_CODEBASE_BEST_PRACTICES.md) - Comprehensive guide
   - [.claude/skills/multi-repo-sync.md](./.claude/skills/multi-repo-sync.md) - Step-by-step workflows

2. **Check the changelog:**
   - [MULTI_REPO_CHANGELOG.md](./MULTI_REPO_CHANGELOG.md) - See how similar changes were made

3. **Run the scripts:**
   - `./scripts/sync-types.sh` - Fix type sync issues
   - `./scripts/type-check-all.sh` - Find type errors

---

## Summary

**Key Files:**
- `CROSS_CODEBASE_BEST_PRACTICES.md` - Read this for detailed guidance
- `MULTI_REPO_CHANGELOG.md` - Update this when making changes
- `.claude/skills/multi-repo-sync.md` - Use this for step-by-step workflows

**Key Scripts:**
- `./scripts/sync-types.sh` - Sync types from ACT Website to Empathy Ledger
- `./scripts/type-check-all.sh` - Type check all repos
- `./start-all.sh` - Start all dev servers

**Key Principle:**
ACT Main Website is the source of truth for shared types. Always edit there first, then sync.

**Deployment Order:**
Migration → API Provider (Empathy Ledger) → Consumer (ACT Website)

---

**Questions?** See [CROSS_CODEBASE_BEST_PRACTICES.md](./CROSS_CODEBASE_BEST_PRACTICES.md) for detailed answers.
