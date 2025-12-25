# Multi-Repo Management Quick Reference

**One-page guide for working across ACT codebases**

---

## 🚀 Daily Commands

```bash
# Start dev servers
./start-all.sh

# After editing shared types
./scripts/sync-types.sh

# Before committing
./scripts/type-check-all.sh
```

---

## 📁 The Three Repos

| Repo | Role | Path |
|------|------|------|
| **ACT Website** | Consumer, Types source | `/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio` |
| **Empathy Ledger** | API provider | `/Users/benknight/Code/Empathy Ledger v.02` |
| **ACT Placemat** | Backend services | `/Users/benknight/Code/ACT Placemat` |

---

## 📝 Golden Rules

1. **Edit types in ACT Website ONLY** - It's the source of truth
2. **Run `./scripts/sync-types.sh`** after editing types
3. **Deploy order:** migration → API → consumer (NEVER reverse)
4. **Validate at runtime** - Never trust API responses
5. **Fail gracefully** - Handle API errors, don't crash

---

## 🔄 Common Workflows

### Adding New API Endpoint

```bash
# 1. Define types in ACT Website
vim src/types/shared/my-types.ts

# 2. Sync to Empathy Ledger
./scripts/sync-types.sh

# 3. Implement API in Empathy Ledger
cd "/Users/benknight/Code/Empathy Ledger v.02"
vim src/app/api/v1/my-endpoint/route.ts

# 4. Implement client in ACT Website
cd "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio"
vim src/lib/my-client.ts

# 5. Type check everything
./scripts/type-check-all.sh

# 6. Test locally
./start-all.sh

# 7. Update changelog
vim MULTI_REPO_CHANGELOG.md

# 8. Deploy in order
cd "/Users/benknight/Code/Empathy Ledger v.02"
vercel deploy --prod

cd "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio"
vercel deploy --prod
```

### Editing Shared Types

```bash
# 1. Edit in ACT Website (source of truth)
vim src/types/shared/act-featured-content.ts

# 2. Sync to Empathy Ledger
./scripts/sync-types.sh

# 3. Type check
./scripts/type-check-all.sh

# 4. Fix errors if any
# 5. Test locally
# 6. Commit and deploy
```

### Database Migration

```bash
cd "/Users/benknight/Code/Empathy Ledger v.02"

# 1. Write migration
vim supabase/migrations/20241224_my_migration.sql

# 2. Test locally
supabase db reset

# 3. Update API to use new schema
vim src/app/api/v1/.../route.ts

# 4. Update types in ACT Website
cd "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio"
vim src/types/shared/...

# 5. Sync types
./scripts/sync-types.sh

# 6. Type check
./scripts/type-check-all.sh

# 7. Deploy migration first
cd "/Users/benknight/Code/Empathy Ledger v.02"
supabase db push

# 8. Deploy API
vercel deploy --prod

# 9. Deploy consumer
cd "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio"
vercel deploy --prod
```

---

## ⚠️ Common Mistakes

| ❌ Wrong | ✅ Right |
|---------|---------|
| Edit types in Empathy Ledger | Edit types in ACT Website |
| Trust API responses | Validate with type guards |
| Deploy consumer first | Deploy provider (API) first |
| Break API without versioning | Create /api/v2/ for breaking changes |
| Remove DB columns | Add new columns, deprecate old ones |

---

## 📚 Documentation

| File | What | When to Read |
|------|------|--------------|
| `MULTI_REPO_MANAGEMENT.md` | Overview | First time setup |
| `CROSS_CODEBASE_BEST_PRACTICES.md` | Detailed guide (15k words) | Before complex changes |
| `.claude/skills/multi-repo-sync.md` | Step-by-step workflows | During implementation |
| `MULTI_REPO_CHANGELOG.md` | Change history | To see examples |
| `docs/MULTI_REPO_ARCHITECTURE.md` | Visual diagrams | To understand system |

---

## 🔧 Scripts

| Script | Purpose | When to Use |
|--------|---------|-------------|
| `./scripts/sync-types.sh` | Copy types to Empathy Ledger | After editing types |
| `./scripts/type-check-all.sh` | Type check all repos | Before committing |
| `./start-all.sh` | Start dev servers | Daily development |

---

## 🐛 Troubleshooting

### "Module not found: @/types/shared/..."
```bash
./scripts/sync-types.sh
```

### "Types don't match"
```bash
# Re-sync from source of truth
./scripts/sync-types.sh
./scripts/type-check-all.sh
```

### "API returning unexpected data"
```bash
# Test API directly
curl http://localhost:3001/api/v1/act-projects/justicehub/featured | jq .

# Compare to type definition
cat src/types/shared/act-featured-content.ts
```

### "Type errors after editing types"
Did you edit in Empathy Ledger instead of ACT Website?
```bash
# Fix: Edit in ACT Website, then sync
vim src/types/shared/...  # In ACT Website
./scripts/sync-types.sh
```

---

## ✅ Before Committing Checklist

- [ ] Edited types in ACT Website (not Empathy Ledger)
- [ ] Ran `./scripts/sync-types.sh`
- [ ] Ran `./scripts/type-check-all.sh` (no errors)
- [ ] Tested with `./start-all.sh`
- [ ] Updated `MULTI_REPO_CHANGELOG.md`

---

## 🚀 Before Deploying Checklist

- [ ] All type checks pass
- [ ] Manual testing complete
- [ ] Changelog updated
- [ ] Deploying in correct order:
  - [ ] 1. Database migration (if any)
  - [ ] 2. Empathy Ledger (API provider)
  - [ ] 3. ACT Website (consumer)

---

## 📖 Need More Detail?

See [CROSS_CODEBASE_BEST_PRACTICES.md](./CROSS_CODEBASE_BEST_PRACTICES.md) for comprehensive guidance.
