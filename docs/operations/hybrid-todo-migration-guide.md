# Hybrid TODO Migration Guide

## 🎯 Purpose
Complete the remaining 79 TODO migrations using a hybrid approach:
- **Phase 1**: Manual creation of high-priority TODOs (today)
- **Phase 2**: Automated bulk migration (tomorrow, with slower delays)

---

## 📊 Current Status

**Completed**: 92/171 TODOs migrated to GitHub Issues
- ✅ ACT Main: 32/32
- ✅ Empathy Ledger: 60/60

**Remaining**: 79 TODOs (rate limited)
- ⏳ JusticeHub: 12 TODOs
- ⏳ The Harvest: 1 TODO
- ⏳ ACT Farm: 1 TODO
- ⏳ ACT Placemat: 65 TODOs

---

## 🎯 Phase 1: Manual High-Priority Migration (Today)

### Step 1: Identify High-Priority TODOs

Run the migration script in dry-run mode to see what would be created:

```bash
cd "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio"

# Dry-run to see all remaining TODOs
node scripts/migrate-todos-to-github.mjs --dry-run
```

### Step 2: Prioritize TODOs

Look for TODOs with these characteristics (create these manually first):

**High Priority Indicators**:
- Contains: "security", "auth", "vulnerability", "bug", "broken", "critical"
- Contains: "FIXME" instead of "TODO"
- In critical files: API routes, authentication, database migrations
- Blocking other work: "must do before X"

**Example High-Priority Patterns**:
```typescript
// FIXME: Security vulnerability in auth flow
// TODO: Critical - fix before production
// TODO: Implement signature verification (security)
// TODO: Add input validation to prevent SQL injection
```

### Step 3: Create Issues Manually Using Templates

For each high-priority TODO:

1. **Go to the repository**:
   - JusticeHub: https://github.com/Acurioustractor/justicehub-platform/issues/new/choose
   - The Harvest: https://github.com/Acurioustractor/theharvest/issues/new/choose
   - ACT Farm: https://github.com/Acurioustractor/act-farm/issues/new/choose
   - ACT Placemat: https://github.com/Acurioustractor/act-placemat/issues/new/choose

2. **Select "Task" template**

3. **Fill out the form**:
   - **Title**: `[TODO]: <description from code>`
   - **Description**:
     ```markdown
     ## Original TODO
     Found in: `src/path/to/file.ts:123`

     ```typescript
     // TODO: Implement signature verification
     ```

     ## Context
     <3 lines before and after the TODO>

     ## Next Steps
     - [ ] Research signature verification libraries
     - [ ] Implement verification function
     - [ ] Add tests
     - [ ] Update documentation
     ```
   - **Project**: Select appropriate project (JusticeHub, Harvest, etc.)
   - **Priority**: High (for critical TODOs)
   - **Effort**: Your best estimate
   - **Type**: Bug (if fixing), Feature (if building), Chore (if cleanup)

4. **Update the code file**:
   ```typescript
   // Before:
   // TODO: Implement signature verification

   // After:
   // See issue #7 in justicehub-platform: Implement signature verification
   ```

5. **Commit the change**:
   ```bash
   git add src/path/to/file.ts
   git commit -m "docs: link TODO to GitHub issue #7"
   git push
   ```

### Step 4: How Many to Create Manually?

**Recommendation**: Create 5-10 high-priority TODOs manually today.

**Why?**
- Addresses critical items immediately
- Avoids triggering rate limits
- Gives you practice with the templates
- Remaining 70-ish can be automated tomorrow

---

## 🤖 Phase 2: Automated Bulk Migration (Tomorrow)

### Step 1: Wait for Rate Limit Reset

**Current Status**: Rate limited until ~2025-12-27 09:00 UTC

**Check if reset**:
```bash
# Try a simple API call
gh api /users/Acurioustractor

# If successful, rate limit has reset
```

### Step 2: Modify Script for Slower Execution

The script needs to slow down to avoid re-triggering rate limits:

```bash
# Open the migration script
code scripts/migrate-todos-to-github.mjs
```

Find this section (around line 250):
```javascript
// Add delay between issues to avoid rate limiting
await new Promise(resolve => setTimeout(resolve, 300));
```

Change to:
```javascript
// Add longer delay to avoid secondary rate limits
await new Promise(resolve => setTimeout(resolve, 2000)); // 2 seconds instead of 0.3
```

### Step 3: Run Automated Migration

```bash
cd "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio"

# Run the migration (will now be much slower)
node scripts/migrate-todos-to-github.mjs

# Expected duration: 79 issues × 2 seconds = ~3 minutes
```

### Step 4: Monitor Progress

The script will output:
```
📊 TODO Migration Summary
Repository: justicehub-platform
✅ Created 12 issues
✅ Updated 12 code files

Repository: theharvest
✅ Created 1 issue
...
```

### Step 5: Add New Issues to Projects Board

```bash
# Run the script to add new issues to board
bash scripts/add-issues-to-project.sh
```

---

## 📋 Recommended High-Priority TODOs to Create First

Based on common patterns, focus on TODOs in these areas:

### 1. Security & Authentication
- Auth flow improvements
- Input validation
- Token handling
- Permission checks

### 2. API Routes
- Missing error handling
- Rate limiting
- Response validation
- Endpoint security

### 3. Database
- Migration TODOs
- Schema updates
- Index optimizations
- Type safety

### 4. Critical Features
- Blocking functionality
- Core user flows
- Payment/billing (if applicable)
- Data integrity

---

## 🔍 Example: Manual TODO Creation Workflow

Let's walk through creating one manually:

### 1. Find TODO in dry-run output:
```
JusticeHub Platform:
  File: src/app/api/auth/verify/route.ts:45
  TODO: Add rate limiting to prevent brute force attacks
```

### 2. Go to GitHub and create issue:
- URL: https://github.com/Acurioustractor/justicehub-platform/issues/new/choose
- Template: Task
- Title: `[TODO]: Add rate limiting to prevent brute force attacks`
- Description:
  ```markdown
  ## Original TODO
  Found in: `src/app/api/auth/verify/route.ts:45`

  ```typescript
  // TODO: Add rate limiting to prevent brute force attacks
  export async function POST(req: Request) {
    const { token } = await req.json();
    // Verify token logic...
  }
  ```

  ## Context
  This endpoint is exposed publicly and could be vulnerable to brute force attacks. We need to implement rate limiting to protect it.

  ## Next Steps
  - [ ] Research rate limiting libraries (upstash/ratelimit, express-rate-limit)
  - [ ] Implement rate limit middleware
  - [ ] Add rate limit headers to response
  - [ ] Add tests for rate limit behavior
  - [ ] Document rate limit policy
  ```
- Project: JusticeHub
- Priority: High
- Effort: 3h
- Type: Security
- Labels: `lcaa: action`, `security`

### 3. Update code file:
```typescript
// See issue #7 in justicehub-platform: Add rate limiting to prevent brute force attacks
export async function POST(req: Request) {
  const { token } = await req.json();
  // Verify token logic...
}
```

### 4. Commit and push:
```bash
git add src/app/api/auth/verify/route.ts
git commit -m "docs: link TODO to GitHub issue #7"
git push
```

---

## 📊 Tracking Your Progress

### View All TODO Issues
```bash
# JusticeHub
gh issue list --repo Acurioustractor/justicehub-platform --label "type: task" --search "[TODO]"

# The Harvest
gh issue list --repo Acurioustractor/theharvest --label "type: task" --search "[TODO]"

# ACT Farm
gh issue list --repo Acurioustractor/act-farm --label "type: task" --search "[TODO]"

# ACT Placemat
gh issue list --repo Acurioustractor/act-placemat --label "type: task" --search "[TODO]"
```

### View on Projects Board
All issues are automatically visible at: https://github.com/users/Acurioustractor/projects/1

Filter by:
- Label: `type: task`
- Search: `[TODO]`

---

## 🎯 Success Criteria

**Phase 1 Complete** when:
- ✅ 5-10 high-priority TODOs created manually
- ✅ Code files updated with issue references
- ✅ Issues added to Projects board
- ✅ All critical security/auth TODOs addressed

**Phase 2 Complete** when:
- ✅ Remaining 70-ish TODOs migrated automatically
- ✅ All code files updated
- ✅ All issues added to Projects board
- ✅ Zero rate limit errors

---

## 🚨 If You Hit Rate Limit Again

**Don't Panic!** Just:

1. Stop the script immediately (Ctrl+C)
2. Note how many issues were created
3. Wait 24 hours
4. Increase delay to 3-5 seconds
5. Re-run for remaining items

---

## 📚 Related Documentation

- [GITHUB_PM_COMPLETE.md](../../GITHUB_PM_COMPLETE.md) - Full implementation overview
- [scripts/migrate-todos-to-github.mjs](../../scripts/migrate-todos-to-github.mjs) - Migration script
- [Issue Templates](https://github.com/Acurioustractor/.github/tree/main/.github/ISSUE_TEMPLATE) - Available templates

---

**Last Updated**: 2025-12-26
**Next Review**: After Phase 2 completion
**Questions?** Check the main GITHUB_PM_COMPLETE.md or open an issue

🌾 **One TODO at a time, we cultivate a well-organized codebase** 🌾
