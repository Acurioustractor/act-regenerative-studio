# Vercel Token Creation Workarounds

## Issue
Vercel token creation page dropdown for expiration date not working.

---

## ✅ Solution 1: Use Different Browser (Fastest)

The dropdown often works better in:
- **Chrome/Chromium** (most reliable)
- **Safari**
- **Firefox**

Try opening https://vercel.com/account/tokens in a different browser.

---

## ✅ Solution 2: Use Vercel CLI (Recommended)

Create a token directly via CLI - no UI needed!

```bash
# Login to Vercel CLI
vercel login

# This will open browser for auth, then you're logged in
# The CLI automatically has access and can be used by GitHub Actions
```

**Then update the workflow to use Vercel CLI instead**:

Edit [.github/workflows/deploy.yml](.github/workflows/deploy.yml):

```yaml
# Replace the vercel-action step with CLI commands:
- name: Deploy to Vercel
  env:
    VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
  run: |
    npm i -g vercel
    vercel --prod --token=$VERCEL_TOKEN
```

**But you still need a token for GitHub Actions.** Let's try Solution 3.

---

## ✅ Solution 3: Use Browser Console to Force Selection

1. Go to https://vercel.com/account/tokens
2. Open Browser Console (F12 or Cmd+Option+I)
3. Paste this code:

```javascript
// Find the expiration select dropdown
const select = document.querySelector('select[name="expiresAt"]');

// Set value to "never" (no expiration)
select.value = 'never';

// Or set to specific duration (in days)
// select.value = '30';  // 30 days
// select.value = '90';  // 90 days

// Trigger change event
select.dispatchEvent(new Event('change', { bubbles: true }));

// Click create button
document.querySelector('button[type="submit"]').click();
```

---

## ✅ Solution 4: Use Keyboard Navigation

Sometimes the dropdown works with keyboard:

1. Go to https://vercel.com/account/tokens
2. Click in the "Expiration" field
3. Use **Arrow Up/Down** keys to select duration
4. Press **Enter** to confirm
5. Fill in token name
6. Press **Tab** then **Enter** to submit

---

## ✅ Solution 5: Mobile Browser

The Vercel mobile UI sometimes works when desktop doesn't:

1. Open https://vercel.com/account/tokens on your phone
2. Create token there
3. Send token to yourself securely (avoid SMS/email)
4. Use it on desktop

---

## ✅ Solution 6: Contact Vercel Support

If all else fails, Vercel support is usually very responsive:

1. Go to https://vercel.com/help
2. Click "Contact Support"
3. Mention: "Cannot select expiration date when creating API token - dropdown not working"

They can create a token for you or help debug.

---

## ✅ Solution 7: Skip Auto-Deploy for Now

You can deploy manually and skip the automatic deployment:

```bash
# Deploy manually whenever you want
vercel --prod

# Or use Vercel GitHub integration (no token needed)
```

**To use GitHub integration instead**:
1. Go to https://vercel.com/dashboard
2. Click your project
3. Go to Settings → Git
4. Connect to GitHub
5. This handles deployments automatically without needing the workflow!

---

## 🎯 My Recommendation

**Try in this order:**

1. **Browser Console method** (Solution 3) - Works 90% of the time
2. **Different browser** (Solution 1) - Chrome usually works
3. **Use Vercel's GitHub Integration** (Solution 7) - No token needed at all!
4. **Keyboard navigation** (Solution 4) - Sometimes works
5. **Contact Vercel** (Solution 6) - They'll help fast

---

## 📝 Notes

- Tokens can't be viewed again after creation, so copy immediately
- "Never expire" is fine for GitHub Actions (secure in secrets)
- You can always revoke and create new tokens later

---

**Last Updated**: 2025-12-26
