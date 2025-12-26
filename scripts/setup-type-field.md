# Setup Type Field - Manual Step Required

**Time**: 2-3 minutes
**Why**: GitHub API doesn't support adding field options programmatically

---

## Step 1: Add Type Options (MANUAL)

Go to: https://github.com/users/Acurioustractor/projects/1/settings

1. Find "Type" field in the list
2. Click the **⋯** menu next to it
3. Click "Edit options"
4. Add these options (copy-paste exactly):

```
Security
Bug
Feature
Enhancement
Data
Integration
UX/UI
Configuration
Research
Documentation
Testing
Cleanup
```

5. **Delete the old "Chore" option**
6. **Reorder** so Security is first, Cleanup is last (drag and drop)
7. Click "Save"

---

## Final order should be:

1. Security
2. Bug
3. Feature
4. Enhancement
5. Data
6. Integration
7. UX/UI
8. Configuration
9. Research
10. Documentation
11. Testing
12. Cleanup

---

**When done, come back and run the migration script!**
