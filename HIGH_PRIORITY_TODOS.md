# 🎯 High-Priority TODOs to Create Manually (Today)

**Created**: 2025-12-26
**Total Remaining**: 84 TODOs
**Recommendation**: Create these 8 high-priority TODOs manually today

---

## 🚨 Critical Security TODOs (Create These First!)

### 1. **ACT Main: Security vulnerability in auth flow**
- **File**: `act-regenerative-studio` (found in dry-run)
- **Priority**: 🔴 HIGH - Security issue
- **Why**: Security vulnerabilities should be addressed immediately
- **Create at**: https://github.com/Acurioustractor/act-regenerative-studio/issues/new/choose
- **Template**: Bug Report
- **Labels**: `type: bug`, `priority: high`, `security`

### 2. **ACT Main: Add input validation to prevent SQL injection**
- **File**: `act-regenerative-studio`
- **Priority**: 🔴 HIGH - Security issue
- **Why**: SQL injection is a critical vulnerability
- **Create at**: https://github.com/Acurioustractor/act-regenerative-studio/issues/new/choose
- **Template**: Bug Report
- **Labels**: `type: security`, `priority: high`

### 3. **ACT Main: Add rate limiting to prevent brute force attacks**
- **File**: `act-regenerative-studio`
- **Priority**: 🟡 MEDIUM - Security hardening
- **Why**: Important for production security
- **Create at**: https://github.com/Acurioustractor/act-regenerative-studio/issues/new/choose
- **Template**: Task
- **Labels**: `type: security`, `priority: medium`, `effort: 3h`

---

## ⚠️ Critical Functionality TODOs

### 4. **ACT Main: Critical - fix before production**
- **File**: `act-regenerative-studio`
- **Priority**: 🔴 HIGH - Explicitly marked critical
- **Why**: Marked as critical by developer
- **Create at**: https://github.com/Acurioustractor/act-regenerative-studio/issues/new/choose
- **Template**: Bug Report
- **Labels**: `type: bug`, `priority: critical`

### 5. **JusticeHub: Implement actual authentication**
- **File**: `justicehub-platform`
- **Priority**: 🟡 MEDIUM - Core functionality
- **Why**: Authentication is fundamental for production
- **Create at**: https://github.com/Acurioustractor/justicehub-platform/issues/new/choose
- **Template**: Feature Request
- **Labels**: `type: feature`, `priority: medium`, `effort: 1d`

### 6. **JusticeHub: Re-enable auth check once session handling is fixed**
- **File**: `justicehub-platform`
- **Priority**: 🟡 MEDIUM - Auth disabled temporarily
- **Why**: Indicates auth is currently bypassed (security risk)
- **Create at**: https://github.com/Acurioustractor/justicehub-platform/issues/new/choose
- **Template**: Task
- **Labels**: `type: bug`, `priority: medium`, `security`

---

## 🔧 Important Infrastructure TODOs

### 7. **The Harvest: Fix workflow trigger API signature**
- **File**: `theharvest`
- **Priority**: 🟡 MEDIUM - Workflow broken
- **Why**: Workflow integrations are critical for automation
- **Create at**: https://github.com/Acurioustractor/theharvest/issues/new/choose
- **Template**: Bug Report
- **Labels**: `type: bug`, `priority: medium`, `effort: 3h`

### 8. **ACT Farm: Fix workflow trigger API signature**
- **File**: `act-farm`
- **Priority**: 🟡 MEDIUM - Workflow broken
- **Why**: Same workflow issue as The Harvest
- **Create at**: https://github.com/Acurioustractor/act-farm/issues/new/choose
- **Template**: Bug Report
- **Labels**: `type: bug`, `priority: medium`, `effort: 3h`

---

## 📋 Step-by-Step: Creating These Issues

### For Each TODO Above:

1. **Click the "Create at" link** to open GitHub issue form

2. **Select the template** (Bug Report, Feature Request, or Task)

3. **Fill out the form**:

   **Example for "Security vulnerability in auth flow"**:

   - **Title**: `Security vulnerability in auth flow`
   - **Description**:
     ```markdown
     ## Issue
     Security vulnerability found in authentication flow.

     ## Impact
     Could allow unauthorized access to protected resources.

     ## Next Steps
     - [ ] Identify specific vulnerability
     - [ ] Review auth middleware
     - [ ] Implement fix
     - [ ] Add security tests
     - [ ] Conduct security audit

     ## Original TODO
     Found during TODO migration from codebase.
     ```
   - **Project**: ACT Main
   - **Priority**: High
   - **Type**: Bug
   - **Effort**: 1d (for investigation + fix)

4. **Click "Submit new issue"**

5. **Note the issue number** (e.g., #33)

6. **Update the code** (we'll do this in batch after all issues created):
   ```typescript
   // See issue #33 in act-regenerative-studio: Security vulnerability in auth flow
   ```

---

## 🎯 Why These 8?

**Security Issues** (3):
- Prevent vulnerabilities before production
- Address explicitly marked security TODOs

**Critical Functionality** (3):
- Explicitly marked "critical"
- Authentication is core infrastructure
- Auth currently disabled (risky)

**Infrastructure** (2):
- Workflow integrations broken
- Affects multiple projects

**Total**: 8 high-priority TODOs
**Remaining for automated migration**: 76 TODOs (mostly routine improvements)

---

## ⏱️ Time Estimate

- **5-7 minutes per issue** × 8 issues = **40-60 minutes total**
- Faster if you create them in batch using similar templates

---

## 📊 After You're Done

Once you've created these 8 issues:

1. **Update the code files** with issue references
2. **Commit the changes**:
   ```bash
   git add .
   git commit -m "docs: link high-priority TODOs to GitHub issues"
   git push
   ```

3. **Tomorrow**: Run automated migration for remaining 76 TODOs:
   ```bash
   node scripts/migrate-todos-to-github.mjs
   ```

---

## 🔗 Quick Links

- **ACT Main Issues**: https://github.com/Acurioustractor/act-regenerative-studio/issues
- **JusticeHub Issues**: https://github.com/Acurioustractor/justicehub-platform/issues
- **The Harvest Issues**: https://github.com/Acurioustractor/theharvest/issues
- **ACT Farm Issues**: https://github.com/Acurioustractor/act-farm/issues
- **Projects Board**: https://github.com/users/Acurioustractor/projects/1

---

**Remember**: These are the critical ones. The remaining 76 can wait for automated migration tomorrow when the rate limit resets!

🌾 **Securing the farm, one TODO at a time** 🌾
