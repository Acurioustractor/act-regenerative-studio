# Empathy Ledger - Complete Setup & Login Guide

**Last Updated:** December 24, 2024

---

## 🎯 Quick Access

### Login URLs

**Production:**
- URL: `https://empathy-ledger-v2.vercel.app/login` (assumed)
- Email: `benjamin@act.place`
- Password: See "Easy Password System" below

**Local Development:**
```bash
cd "/Users/benknight/Code/empathy-ledger-v2"
npm run dev
# Open: http://localhost:3001/login
```

---

## 🔑 Easy Password System

### Option 1: Magic Link (RECOMMENDED - No Password!)

1. Go to login page
2. Enter: `benjamin@act.place`
3. Click "Send Magic Link"
4. Check email
5. Click link → Auto-logged in ✅

**Setup Magic Links:**
```bash
# In Supabase Dashboard:
# 1. Go to Authentication → Email Templates
# 2. Enable "Magic Link" template
# 3. Test by sending to benjamin@act.place
```

### Option 2: Password Reset (If you forgot)

1. Go to: `http://localhost:3001/reset-password`
2. Enter: `benjamin@act.place`
3. Check email for reset link
4. Set new simple password: `ACT2025!` (or whatever you want)

### Option 3: Direct Database Password Set

```bash
# Reset password directly in Supabase

# 1. Get your user ID
supabase db execute "SELECT id, email FROM auth.users WHERE email = 'benjamin@act.place'"

# 2. Set new password (replace with actual user ID)
# Go to Supabase Dashboard → Authentication → Users
# Find benjamin@act.place → Click ... → Reset Password
# Or use SQL:
```

Go to Supabase Dashboard:
1. **Authentication** → **Users**
2. Find `benjamin@act.place`
3. Click **...** (three dots)
4. **Send Password Recovery**
5. Check email and set new password

---

## 📋 Current Setup Status

### Supabase Connection

**Database:** `https://yvnuayzslukamizrlhwb.supabase.co`

**Status:** ✅ Connected

Check connection:
```bash
cd "/Users/benknight/Code/empathy-ledger-v2"
npm run dev

# Should see in logs:
# ✓ Ready in XXXms
# ○ Compiling / ...
```

### Admin Permissions

**User:** `benjamin@act.place`

**Check if admin:**
```sql
-- Run in Supabase SQL Editor
SELECT * FROM act_admins WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'benjamin@act.place'
);
```

**Grant admin if not set:**
```sql
-- Get user ID first
SELECT id, email FROM auth.users WHERE email = 'benjamin@act.place';

-- Insert into act_admins (replace with actual UUID)
INSERT INTO act_admins (user_id, role, granted_by, granted_at)
VALUES (
  'YOUR-USER-ID-HERE',
  'super_admin',
  'YOUR-USER-ID-HERE',
  NOW()
);
```

---

## 🚀 Complete Integration Setup (Step-by-Step)

### Step 1: Confirm Which Codebase to Use

You have TWO Empathy Ledger directories. Choose one:

**Option A:** `/Users/benknight/Code/Empathy Ledger v.02` (with space)
- Has ACT tagging migration already
- Needs: API endpoint creation, UI components

**Option B:** `/Users/benknight/Code/empathy-ledger-v2` (hyphenated)
- Listed in ecosystem docs
- Needs: Everything (migration, API, UI)

**Recommendation:** Use **empathy-ledger-v2** (hyphenated) as it's cleaner and matches ecosystem docs.

**Action:** Copy migration and files from "Empathy Ledger v.02" to "empathy-ledger-v2"

### Step 2: Copy ACT Tagging System Files

```bash
# Copy migration
cp "/Users/benknight/Code/Empathy Ledger v.02/supabase/migrations/20251224000001_act_project_tagging_system_fixed.sql" \
   "/Users/benknight/Code/empathy-ledger-v2/supabase/migrations/"

# Copy shared types
mkdir -p "/Users/benknight/Code/empathy-ledger-v2/src/types/shared"
cp "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio/src/types/shared/act-featured-content.ts" \
   "/Users/benknight/Code/empathy-ledger-v2/src/types/shared/"

# Copy Supabase helpers (if missing)
cp "/Users/benknight/Code/Empathy Ledger v.02/src/lib/supabase/client.ts" \
   "/Users/benknight/Code/empathy-ledger-v2/src/lib/supabase/" 2>/dev/null || echo "Already exists"

cp "/Users/benknight/Code/Empathy Ledger v.02/src/lib/supabase/server.ts" \
   "/Users/benknight/Code/empathy-ledger-v2/src/lib/supabase/" 2>/dev/null || echo "Already exists"
```

### Step 3: Deploy Database Migration

```bash
cd "/Users/benknight/Code/empathy-ledger-v2"

# Link to your Supabase project (if not already)
supabase link --project-ref yvnuayzslukamizrlhwb

# Push migration to production
supabase db push

# Verify tables were created
supabase db execute "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE 'act_%'"
```

### Step 4: Grant Admin Permissions

```bash
# In Supabase SQL Editor, run:
# https://supabase.com/dashboard/project/yvnuayzslukamizrlhwb/sql/new

-- 1. Get your user ID
SELECT id, email FROM auth.users WHERE email = 'benjamin@act.place';

-- 2. Copy the ID, then insert into act_admins
INSERT INTO act_admins (user_id, role, granted_by, granted_at)
VALUES (
  'PASTE-YOUR-USER-ID-HERE',
  'super_admin',
  'PASTE-YOUR-USER-ID-HERE',
  NOW()
);

-- 3. Verify
SELECT * FROM act_admins;
```

### Step 5: Create API Endpoint

```bash
cd "/Users/benknight/Code/empathy-ledger-v2"

# Create directory
mkdir -p src/app/api/v1/act-projects/\[slug\]/featured

# Create the route file
# (I'll provide the code below)
```

**File:** `/src/app/api/v1/act-projects/[slug]/featured/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { FeaturedContentResponse } from '@/types/shared/act-featured-content';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
): Promise<NextResponse<FeaturedContentResponse>> {
  try {
    const { slug } = await context.params;
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';
    const limit = parseInt(searchParams.get('limit') || '10');

    const supabase = await createClient();

    // Get project
    const { data: project, error: projectError } = await supabase
      .from('act_projects')
      .select('*')
      .eq('slug', slug)
      .eq('active', true)
      .single();

    if (projectError || !project) {
      return NextResponse.json(
        { error: 'Project not found' } as any,
        { status: 404 }
      );
    }

    // Get featured storytellers (if requested)
    let storytellers = [];
    if (type === 'all' || type === 'storytellers') {
      const { data } = await supabase
        .from('act_featured_storytellers')
        .select('*')
        .eq('project_slug', slug)
        .limit(limit);

      storytellers = data || [];
    }

    // Get featured stories (if requested)
    let stories = [];
    if (type === 'all' || type === 'stories') {
      const { data } = await supabase
        .from('story_project_features')
        .select(`
          story_id,
          featured_quote,
          approved_at,
          stories (
            title,
            excerpt,
            published_at,
            storyteller:storytellers (
              id,
              display_name
            )
          )
        `)
        .eq('act_project_id', project.id)
        .eq('is_visible', true)
        .limit(limit);

      stories = (data || []).map((item: any) => ({
        story_id: item.story_id,
        title: item.stories?.title,
        excerpt: item.stories?.excerpt,
        featured_quote: item.featured_quote,
        storyteller_id: item.stories?.storyteller?.id,
        storyteller_name: item.stories?.storyteller?.display_name,
        published_at: item.stories?.published_at,
        approved_at: item.approved_at,
      }));
    }

    const response: FeaturedContentResponse = {
      project: {
        id: project.id,
        slug: project.slug,
        title: project.title,
        organization_name: project.organization_name,
        focus_areas: project.focus_areas,
        themes: project.themes,
        website_url: project.website_url,
        description: project.description,
        active: project.active,
        created_at: project.created_at,
        updated_at: project.updated_at,
      },
      featured: {
        storytellers,
        stories,
      },
      meta: {
        storyteller_count: storytellers.length,
        story_count: stories.length,
        fetched_at: new Date().toISOString(),
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Featured content API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' } as any,
      { status: 500 }
    );
  }
}
```

### Step 6: Install shadcn/ui Components

```bash
cd "/Users/benknight/Code/empathy-ledger-v2"

# Initialize shadcn (if not already)
npx shadcn@latest init

# Add required components
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add select
npx shadcn@latest add checkbox
npx shadcn@latest add label
npx shadcn@latest add badge
npx shadcn@latest add input
```

### Step 7: Copy Dashboard Components

```bash
# Copy storyteller dashboard
cp "/Users/benknight/Code/Empathy Ledger v.02/src/components/dashboard/ACTProjectOptIn.tsx" \
   "/Users/benknight/Code/empathy-ledger-v2/src/components/dashboard/"

# Copy admin dashboard
cp "/Users/benknight/Code/Empathy Ledger v.02/src/app/admin/act-featured/page.tsx" \
   "/Users/benknight/Code/empathy-ledger-v2/src/app/admin/act-featured/"
```

### Step 8: Add Navigation Links

Add to main dashboard navigation:

```typescript
// src/app/dashboard/layout.tsx or similar
<NavLink href="/dashboard/act-projects">
  ACT Projects Opt-In
</NavLink>

// For admins
<NavLink href="/admin/act-featured">
  ACT Featured Content
</NavLink>
```

### Step 9: Test Locally

```bash
cd "/Users/benknight/Code/empathy-ledger-v2"
npm run dev

# Test API endpoint:
curl http://localhost:3001/api/v1/act-projects/justicehub/featured | jq .

# Test in browser:
# 1. Login: http://localhost:3001/login
# 2. Dashboard: http://localhost:3001/dashboard/act-projects
# 3. Admin: http://localhost:3001/admin/act-featured
```

### Step 10: Deploy to Production

```bash
cd "/Users/benknight/Code/empathy-ledger-v2"

# Deploy to Vercel
vercel deploy --prod

# Test production API:
curl https://empathy-ledger-v2.vercel.app/api/v1/act-projects/justicehub/featured | jq .
```

---

## 🔧 Troubleshooting

### Can't Login

**Problem:** "Invalid login credentials"

**Solutions:**
1. Use Magic Link instead (see above)
2. Reset password via Supabase Dashboard
3. Check email is correct: `benjamin@act.place`

### Magic Link Not Working

**Problem:** Email not arriving

**Solutions:**
1. Check spam folder
2. Verify email in Supabase Dashboard → Authentication → Users
3. Check Supabase → Authentication → Email Templates → Confirm enabled

### "Not Authorized" Error

**Problem:** Can't access admin dashboard

**Solutions:**
1. Check admin permissions (see Step 4 above)
2. Verify RLS policies allow admin access
3. Check Supabase logs for errors

### API Returns Empty Data

**Problem:** `/api/v1/act-projects/justicehub/featured` returns no storytellers

**Possible Causes:**
1. Migration not deployed → Run `supabase db push`
2. No storytellers opted in yet → Use dashboard to opt in
3. Opted in but not approved → Use admin dashboard to approve

---

## 📝 Quick Reference Commands

```bash
# Start dev server
cd "/Users/benknight/Code/empathy-ledger-v2" && npm run dev

# Check if migration is deployed
supabase db execute "SELECT * FROM act_projects LIMIT 5"

# Test API locally
curl http://localhost:3001/api/v1/act-projects/justicehub/featured | jq .

# Check admin status
supabase db execute "SELECT * FROM act_admins WHERE user_id = (SELECT id FROM auth.users WHERE email = 'benjamin@act.place')"

# Send password reset
# Go to: https://supabase.com/dashboard/project/yvnuayzslukamizrlhwb/auth/users
# Find benjamin@act.place → ... → Send Password Recovery
```

---

## ✅ Checklist: Is Everything Working?

- [ ] Can login with `benjamin@act.place` (magic link or password)
- [ ] Database migration deployed (`act_projects` table exists)
- [ ] Admin permissions granted (can access `/admin/act-featured`)
- [ ] API endpoint works (`/api/v1/act-projects/justicehub/featured` returns data)
- [ ] Storyteller dashboard accessible (`/dashboard/act-projects`)
- [ ] Can opt in to a project
- [ ] Can approve as admin
- [ ] Approved storyteller appears in API response
- [ ] ACT Main Website can fetch and display featured content

---

## 🎯 Next: Test on ACT Main Website

Once Empathy Ledger API is working:

```bash
cd "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio"
npm run dev

# Open: http://localhost:3002/projects/justicehub
# Should see "Community Voices" section with featured storytellers
```

---

**Need help?** Check [ACT_ECOSYSTEM.md](./ACT_ECOSYSTEM.md) for the full system architecture.
