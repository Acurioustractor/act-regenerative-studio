# Fix Gmail Authentication Error

## The Error
```
Request is missing required authentication credential. 
Expected OAuth 2 access token, login cookie or other valid authentication credential.
```

## Root Cause
The **Gmail API is not enabled** in your Google Cloud project.

---

## Quick Fix (5 minutes)

### Step 1: Enable Gmail API

1. **Go to Gmail API page**
   - Direct link: https://console.cloud.google.com/apis/library/gmail.googleapis.com
   - Or: Google Cloud Console → APIs & Services → Library → Search "Gmail API"

2. **Make sure correct project is selected**
   - Top bar should show: "ACT Living Wiki"
   - If not, click project selector and choose "ACT Living Wiki"

3. **Click "ENABLE"**
   - Big blue button that says "Enable"
   - Wait 5-10 seconds for API to enable
   - You should see "API enabled" confirmation

### Step 2: Verify OAuth Scopes

1. **Go to OAuth Consent Screen**
   - https://console.cloud.google.com/apis/credentials/consent

2. **Click "EDIT APP"**

3. **Scopes page**
   - Click "ADD OR REMOVE SCOPES"
   - Make sure these are checked:
     - ✅ `.../auth/gmail.readonly`
     - ✅ `.../auth/userinfo.email`
   - Click "UPDATE"
   - Click "SAVE AND CONTINUE" through remaining pages

### Step 3: Try Authorization Again

1. **Go back to authorization URL**:
   ```
   http://localhost:3001/api/auth/gmail
   ```

2. **Complete the OAuth flow**:
   - Sign in with Gmail
   - Grant permissions
   - Should redirect to success page

---

## Still Having Issues?

### Check OAuth Redirect URI

1. **Go to Credentials**
   - https://console.cloud.google.com/apis/credentials

2. **Click your OAuth client** ("ACT Living Wiki - Local Dev")

3. **Verify Authorized redirect URIs**:
   - Should have: `http://localhost:3001/api/auth/gmail/callback`
   - Exact match required (no trailing slash, correct port)

4. **If wrong, edit and save**

### Check Test Users

1. **Go to OAuth Consent Screen**
   - https://console.cloud.google.com/apis/credentials/consent

2. **Scroll to "Test users"**

3. **Add your Gmail address** if not there:
   - Click "+ ADD USERS"
   - Enter your email
   - Click "SAVE"

---

## Complete Checklist

- [ ] Gmail API is **ENABLED** in Google Cloud
- [ ] OAuth scopes include `gmail.readonly` and `userinfo.email`
- [ ] OAuth client has redirect URI: `http://localhost:3001/api/auth/gmail/callback`
- [ ] Your email is added as a test user
- [ ] Server is running (`npm run dev`)
- [ ] Credentials in .env.local are correct

---

## After Fixing

1. **Try authorization again**: http://localhost:3001/api/auth/gmail
2. **Should redirect to Google sign-in**
3. **Grant permissions**
4. **Success!** You'll be redirected back

Let me know once you've enabled the Gmail API and I'll help you test!

