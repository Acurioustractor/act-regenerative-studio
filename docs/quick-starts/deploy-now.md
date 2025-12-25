# 🚀 Deploy Empathy Ledger Integration - Quick Steps

**Run these commands NOW to get everything working!**

---

## ✅ Status So Far

- [x] Setup script run
- [x] API route created
- [x] Types synced
- [x] Magic Link login added
- [ ] Migration deployed ← **YOU ARE HERE**
- [ ] Admin permissions granted
- [ ] shadcn components installed
- [ ] Test everything

---

## 📋 Step-by-Step (Copy & Paste)

### Step 1: Deploy Migration via Supabase Dashboard

I just opened the Supabase SQL editor for you. **Copy and paste the migration SQL:**

```sql
-- Run this in: https://supabase.com/dashboard/project/yvnuayzslukamizrlhwb/sql/new

-- Check if tables already exist
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_name LIKE 'act_%';

-- If no results, run the full migration from:
-- /Users/benknight/Code/empathy-ledger-v2/supabase/migrations/20251224000001_act_project_tagging_system_fixed.sql
```

**Or manually in terminal:**
```bash
# Copy migration content
cat "/Users/benknight/Code/empathy-ledger-v2/supabase/migrations/20251224000001_act_project_tagging_system_fixed.sql" | pbcopy

# Paste into Supabase SQL editor and run
```

---

### Step 2: Grant Admin Permissions

**In Supabase SQL editor:**

```sql
-- 1. Get your user ID
SELECT id, email FROM auth.users WHERE email = 'benjamin@act.place';

-- 2. Copy the ID from results, then run (replace YOUR-USER-ID):
INSERT INTO act_admins (user_id, role, granted_by, granted_at)
VALUES (
  'YOUR-USER-ID-HERE',  -- Replace with ID from step 1
  'super_admin',
  'YOUR-USER-ID-HERE',  -- Same ID
  NOW()
)
ON CONFLICT (user_id) DO NOTHING;

-- 3. Verify
SELECT * FROM act_admins;
```

---

### Step 3: Install shadcn Components

```bash
cd "/Users/benknight/Code/empathy-ledger-v2"

# Install all components at once
npx shadcn@latest add button card select checkbox label badge input alert
```

If prompted, accept defaults (yes to all).

---

### Step 4: Test Magic Link Login

```bash
# Start dev server
cd "/Users/benknight/Code/empathy-ledger-v2"
npm run dev
```

Then:
1. Open: http://localhost:3001/login
2. Enter: `benjamin@act.place`
3. Click: "✨ Send Magic Link"
4. Check email
5. Click link → Should auto-login! ✅

---

### Step 5: Test API Endpoint

```bash
# Test the API locally
curl http://localhost:3001/api/v1/act-projects/justicehub/featured | jq .

# Should return JSON with project data (may be empty storytellers/stories until you opt in)
```

---

### Step 6: Start ACT Main Website

```bash
cd "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio"
npm run dev
```

Open: http://localhost:3002/projects/justicehub

Should see "Community Voices" section (may be empty until storytellers opt in).

---

## 🎯 All Commands in One Block (Copy & Run)

```bash
# Install shadcn components
cd "/Users/benknight/Code/empathy-ledger-v2"
npx shadcn@latest add button card select checkbox label badge input alert

# Start Empathy Ledger
cd "/Users/benknight/Code/empathy-ledger-v2"
npm run dev &

# Wait a few seconds, then start ACT Website
sleep 5
cd "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio"
npm run dev &

# Open both in browser
sleep 3
open http://localhost:3001/login
open http://localhost:3002/projects/justicehub

echo "✅ Both servers running!"
echo "Empathy Ledger: http://localhost:3001"
echo "ACT Website: http://localhost:3002"
```

---

## 🔧 Supabase Dashboard Tasks (Do These First!)

### Task 1: Deploy Migration

1. Go to: https://supabase.com/dashboard/project/yvnuayzslukamizrlhwb/sql/new
2. Copy migration file content:
   ```bash
   cat "/Users/benknight/Code/empathy-ledger-v2/supabase/migrations/20251224000001_act_project_tagging_system_fixed.sql"
   ```
3. Paste into SQL editor
4. Click "Run"
5. Should see: "Success. No rows returned" ✅

### Task 2: Grant Admin

1. In same SQL editor, run:
   ```sql
   SELECT id, email FROM auth.users WHERE email = 'benjamin@act.place';
   ```
2. Copy the `id` value
3. Run (replace YOUR-ID):
   ```sql
   INSERT INTO act_admins (user_id, role, granted_by, granted_at)
   VALUES ('YOUR-ID', 'super_admin', 'YOUR-ID', NOW())
   ON CONFLICT DO NOTHING;
   ```

---

## ✅ Verification Checklist

After running everything:

- [ ] Empathy Ledger running on http://localhost:3001
- [ ] Can login with Magic Link (no password!)
- [ ] ACT Website running on http://localhost:3002
- [ ] `/api/v1/act-projects/justicehub/featured` returns JSON
- [ ] `act_projects` table exists in Supabase
- [ ] Admin permissions granted
- [ ] No console errors in browser

---

## 🐛 Quick Troubleshooting

**Migration fails?**
- Tables might already exist
- Check in Supabase Dashboard → Database → Tables
- If `act_projects` exists, skip migration

**Admin not working?**
- Check SQL results for your user ID
- Make sure ID is a valid UUID
- Check `act_admins` table has a row

**Magic Link email not arriving?**
- Check spam folder
- Verify in Supabase → Authentication → Email Templates
- Enable "Magic Link" template

**API returns 404?**
- Check migration deployed (tables exist)
- Check route file created correctly
- Restart dev server

---

## 🎉 You're Almost Done!

Just need to:
1. ✅ Run SQL in Supabase (2 minutes)
2. ✅ Install shadcn components (1 minute)
3. ✅ Test login and API (2 minutes)

**Total time: ~5 minutes!**

Then you'll have:
- ✨ Magic Link login (no password!)
- 📊 Featured content API working
- 🌐 ACT Website showing Empathy Ledger stories
- 🎯 Full admin dashboard access

Let's do this! 🚀
