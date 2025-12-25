# ACT Ecosystem - Unified Project Standards

> **Purpose**: Eliminate confusion across all 4 projects with consistent rules for deployments, databases, GHL, and infrastructure.

---

## 🎯 Core Principle: Cloud-First, NAS-Enhanced

**Rule**: All projects use **cloud services** as primary, **NAS as performance layer**.

- **Databases**: Cloud-hosted (Supabase) - NO local databases
- **Authentication**: Cloud-hosted (Supabase Auth) - NO local auth
- **CRM**: Cloud-hosted (GoHighLevel) - NO local CRM
- **NAS**: Performance enhancement only (Redis cache, ChromaDB vector search)

**Why**: No Docker chaos, clean deployments, team collaboration works

---

## 📊 Project Classification & Rules

### Tier 1: Platform Projects (Complex Auth + Database)

**Projects**: Empathy Ledger, JusticeHub

**Primary Stack**:
- ✅ **Supabase** (PostgreSQL + Auth + Storage)
- ✅ **GoHighLevel** (CRM + Marketing automation)
- ✅ **Resend** (Transactional emails)
- ✅ **Redis NAS** (Caching layer - optional but recommended)
- ✅ **ChromaDB NAS** (Vector search - optional)

**Database Rules**:
```bash
# ✅ CORRECT - Cloud-first
NEXT_PUBLIC_SUPABASE_URL=https://[project].supabase.co
SUPABASE_SERVICE_ROLE_KEY=[from cloud dashboard]
DATABASE_URL=[from Supabase, if needed for migrations]

# ❌ WRONG - No local databases
# Don't use: docker-compose up supabase
# Don't use: supabase start (local mode)
# Don't use: localhost database URLs
```

**GHL Integration**:
```bash
# Each project gets its own GHL sub-account
GHL_API_KEY=[Private Integration Token for THIS project]
GHL_LOCATION_ID=[Sub-account ID for THIS project]
GHL_API_VERSION=2021-07-28

# Project-specific pipelines
GHL_STORYTELLER_PIPELINE_ID=     # Empathy Ledger
GHL_ORGANIZATION_PIPELINE_ID=     # Empathy Ledger
GHL_SERVICE_PROVIDER_PIPELINE_ID= # JusticeHub
GHL_FAMILY_SUPPORT_PIPELINE_ID=   # JusticeHub
```

**Deployment Flow**:
```
1. Make changes locally
2. Push to GitHub
3. Supabase auto-updates from GitHub (migrations)
4. Vercel auto-deploys from GitHub (frontend)
```

---

### Tier 2: Website Projects (Simple CRM)

**Projects**: The Harvest, ACT Farm

**Primary Stack**:
- ✅ **GoHighLevel** (CRM + Forms + Booking + Email)
- ✅ **Stripe** (Payments for tenants, residencies)
- ✅ **Resend** (Transactional emails - confirmations, receipts)
- ✅ **Redis NAS** (Caching GHL API calls - optional but recommended)
- ❌ **No Supabase** (unless user base grows significantly)

**Database Rules**:
```bash
# ✅ CORRECT - GHL is the database
# All contacts, pipelines, bookings stored in GoHighLevel cloud

# ⚠️ Only add Supabase if:
# - 50+ active members needing complex permissions
# - 20+ volunteers with scheduling/hour tracking
# - 5+ tenants with document management needs
# - User-generated content requiring moderation
```

**GHL Integration**:
```bash
# Each project gets its own GHL sub-account
GHL_API_KEY=[Private Integration Token for THIS project]
GHL_LOCATION_ID=[Sub-account ID for THIS project]

# Project-specific pipelines
GHL_VOLUNTEER_PIPELINE_ID=        # The Harvest
GHL_TENANT_PIPELINE_ID=           # The Harvest
GHL_RESIDENCY_PIPELINE_ID=        # ACT Farm
GHL_WORKSHOP_PIPELINE_ID=         # ACT Farm
```

**Deployment Flow**:
```
1. Make changes locally
2. Push to GitHub
3. Vercel auto-deploys (or manual deploy to hosting)
```

---

## 🔐 Environment Variable Standards

### Required for ALL Projects

```bash
# ==============================================
# PROJECT IDENTIFICATION (same across all)
# ==============================================
NODE_ENV=development                    # or production
NEXT_PUBLIC_APP_ENV=development         # or production
NEXT_PUBLIC_APP_NAME="[Project Name]"
NEXT_PUBLIC_APP_URL=http://localhost:[port]

# ==============================================
# NAS SERVICES (same URL for all projects)
# ==============================================
REDIS_URL=redis://192.168.0.34:6379
CHROMADB_URL=http://192.168.0.34:8000

# ==============================================
# GOHIGHLEVEL (project-specific sub-account)
# ==============================================
GHL_API_KEY=[get from GHL dashboard for THIS project]
GHL_LOCATION_ID=[sub-account ID for THIS project]
GHL_API_VERSION=2021-07-28

# ==============================================
# RESEND EMAIL (same API key for all projects)
# ==============================================
RESEND_API_KEY=re_[your_unified_resend_key]
EMAIL_FROM=[project]@actstudio.org.au
```

### Additional for Platform Projects (Empathy Ledger, JusticeHub)

```bash
# ==============================================
# SUPABASE (project-specific cloud instance)
# ==============================================
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[from Supabase dashboard]
SUPABASE_SERVICE_ROLE_KEY=[from Supabase dashboard]
DATABASE_URL=[from Supabase, only if needed for migrations]

# ==============================================
# STRIPE (if using payments)
# ==============================================
STRIPE_SECRET_KEY=sk_test_[or sk_live_]
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_[or pk_live_]
STRIPE_WEBHOOK_SECRET=whsec_[webhook secret]
```

---

## 🚀 Deployment Standards

### Local Development

**Port Assignments** (managed by orchestrator):
```
Admin Wiki:      4000
ACT Farm:        3001
JusticeHub:      3002
Empathy Ledger:  3003
The Harvest:     3004
Dev Dashboard:   3999
```

**Start Command** (same for all):
```bash
# From root directory
cd "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio"
npm start

# Automatically starts all 5 projects + dashboard
```

**Stop Command** (same for all):
```bash
# Press Ctrl+C in terminal
# Or from another terminal:
npm run stop
```

### Production Deployment

**Platform** (recommended for all):
- **Frontend**: Vercel
- **Database**: Supabase (for Empathy Ledger, JusticeHub)
- **CRM**: GoHighLevel (for all)
- **Email**: Resend (for all)
- **Payments**: Stripe (where needed)

**Deployment Process**:
```
1. Push to GitHub main branch
2. Vercel auto-deploys
3. Supabase migrations auto-apply (if using Supabase)
4. GHL continues working (cloud-hosted)
```

**Environment Variables**:
- Set in Vercel dashboard (not in code)
- Same variable names as local `.env.local`
- Use production values (sk_live_, prod URLs, etc.)

---

## 📁 File Structure Standards

### Every Project Must Have:

```
[project-root]/
├── .env.local.example         # Template with ALL env vars
├── .env.example              # (optional) detailed version
├── .gitignore                # Must include .env.local
├── package.json              # "dev": "next dev" (no hardcoded ports!)
├── README.md                 # Project-specific setup
└── SETUP_STATUS.md           # Current status (optional)
```

### Shared Root Directory Has:

```
ACT Farm and Regenerative Innovation Studio/
├── dev-servers.mjs           # Orchestrator (manages all projects)
├── start-clean.sh            # Clean startup script
├── package.json              # Hub commands (start, stop, etc.)
│
├── UNIFIED_PROJECT_STANDARDS.md     # This file
├── SYSTEM_SETUP_COMPLETE.md         # System overview
├── README_STARTUP.md                # How to start everything
├── STARTUP_IMPROVEMENTS.md          # Performance analysis
│
├── src/lib/ghl/              # Shared GHL library
│   ├── client.ts             # GHL API client
│   ├── types.ts              # TypeScript types
│   └── redis.ts              # Caching utilities
│
├── .claude/skills/           # Claude Code skills
│   └── ghl-crm-advisor/      # CRM strategy skill
│
└── admin-wiki/               # Admin dashboard for all projects
```

---

## 🗄️ Database Decision Tree

### When to Use What

```
┌─────────────────────────────────────────────────────┐
│ Does the project need user accounts?                │
├─────────────────────────────────────────────────────┤
│ NO  → Use GoHighLevel only                          │
│      (The Harvest, ACT Farm)                        │
│                                                      │
│ YES → Does it need complex permissions?             │
│       ├─ NO  → Use GoHighLevel only                 │
│       │        (simple member login)                │
│       │                                              │
│       └─ YES → Use Supabase + GoHighLevel           │
│                (Empathy Ledger, JusticeHub)         │
│                - Supabase: Auth + permissions       │
│                - GHL: Marketing + CRM               │
└─────────────────────────────────────────────────────┘
```

### Decision Matrix

| Feature | GHL Only | GHL + Supabase |
|---------|----------|----------------|
| Contact forms | ✅ | ✅ |
| Email automation | ✅ | ✅ |
| SMS campaigns | ✅ | ✅ |
| Booking/Calendar | ✅ | ✅ |
| Payment collection | ✅ (via Stripe integration) | ✅ (via Stripe) |
| User login | ❌ | ✅ |
| Complex permissions | ❌ | ✅ |
| User-generated content | ❌ | ✅ |
| Real-time features | ❌ | ✅ |
| File storage | ❌ | ✅ |
| Row-level security | ❌ | ✅ |
| Cultural protocols | ❌ | ✅ |

**Rule of Thumb**:
- **GHL-only**: Marketing websites, booking sites, contact forms
- **GHL + Supabase**: User platforms, content creation, community governance

---

## 🔄 Data Flow Standards

### Form Submission (All Projects)

```typescript
// STANDARD PATTERN - Use this everywhere

import { createGHLClient } from '@/lib/ghl/client';
import { withCache } from '@/lib/redis';

export async function POST(request: Request) {
  const { name, email, interest, message } = await request.json();

  // Validate
  if (!name || !email) {
    return Response.json({ error: 'Required fields missing' }, { status: 400 });
  }

  const ghlClient = createGHLClient();

  // Check cache first (10-minute TTL)
  const existingContact = await withCache(
    `ghl:contact:${email}`,
    async () => ghlClient.contacts.searchByEmail(email),
    600
  );

  // Create or update in GHL
  const contact = existingContact
    ? await ghlClient.contacts.updateCustomFields(existingContact.id, { /* fields */ })
    : await ghlClient.contacts.upsert({ email, name, /* ... */ });

  // Add to pipeline
  await ghlClient.opportunities.create({
    contactId: contact.id,
    pipelineId: getPipelineIdForInterest(interest),
    /* ... */
  });

  // Cache result
  await setCached(`ghl:contact:${email}`, contact, 600);

  return Response.json({ success: true, contactId: contact.id });
}
```

### Supabase + GHL Sync (Platform Projects Only)

```typescript
// When user registers in Supabase (Empathy Ledger, JusticeHub)

import { createClient } from '@supabase/supabase-js';
import { createGHLClient } from '@/lib/ghl/client';

export async function registerUser(email: string, name: string, role: string) {
  const supabase = createClient(/* ... */);
  const ghlClient = createGHLClient();

  // 1. Create Supabase user (PRIMARY)
  const { data: user } = await supabase.auth.signUp({ email, password });

  // 2. Create/link GHL contact (SECONDARY - for marketing)
  const ghlContact = await ghlClient.contacts.upsert({
    email,
    name,
    tags: ['empathy-ledger', `role:${role}`],
    customFields: { supabase_user_id: user.id },
  });

  // 3. Store sync relationship
  await supabase.from('ghl_contact_sync').insert({
    supabase_user_id: user.id,
    ghl_contact_id: ghlContact.id,
    email,
    project: 'empathy-ledger',
  });

  return user;
}
```

---

## 📧 Email Standards

### Transactional Emails (Resend)

**Use Resend for**:
- Welcome emails (account created)
- Password reset
- Booking confirmations
- Payment receipts
- Application status updates
- System notifications

**Pattern**:
```typescript
import { Resend } from 'resend';
import { WelcomeEmail } from '@/emails/welcome';

const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: '[Project Name] <hello@actstudio.org.au>',
  to: user.email,
  subject: 'Welcome to [Project]',
  react: WelcomeEmail({ name: user.name }),
});
```

### Marketing Emails (GoHighLevel)

**Use GHL for**:
- Newsletter campaigns
- Nurture sequences (multi-touch)
- Event reminders (3 days, 1 day, 2 hours)
- Re-engagement campaigns
- Cross-project referrals

**Configured in**: GHL dashboard workflows

---

## 🎯 Cross-Project Referral Rules

### Standard Referral Flow

```
1. User shows interest in cross-project topic
   ↓
2. Tag contact in GHL: "interest:[topic]"
   ↓
3. GHL workflow detects tag
   ↓
4. Automated email sent with warm intro to other project
   ↓
5. User clicks link → tracked in GHL
   ↓
6. User submits form on new project → GHL merges contacts
   ↓
7. Custom field updated: cross_project = true
```

### Referral Tag Standards

| Tag | Triggers Email To | For Project |
|-----|------------------|-------------|
| `interest:conservation` | ACT Farm workshop invite | From The Harvest |
| `interest:storytelling` | Empathy Ledger intro | From ACT Farm |
| `interest:justice` | JusticeHub campaign | From Empathy Ledger |
| `interest:community` | The Harvest programs | From JusticeHub |

---

## 🔒 Security Standards

### Secrets Management

```bash
# ✅ CORRECT
# - Store in .env.local (gitignored)
# - Set in Vercel dashboard for production
# - Never commit to Git
# - Use strong, unique keys per project

# ❌ WRONG
# - Don't hardcode in code
# - Don't commit .env files
# - Don't share keys between projects (except Resend)
# - Don't use weak/default secrets
```

### API Key Rules

| Service | Sharing Rule |
|---------|-------------|
| **GHL** | One sub-account per project (separate keys) |
| **Supabase** | Separate project per platform (separate keys) |
| **Resend** | Can share across all projects (same key OK) |
| **Stripe** | Separate account per project if separate finances |
| **Redis** | Shared NAS (same URL for all) |
| **ChromaDB** | Shared NAS (same URL for all) |

---

## 📊 Monitoring Standards

### Health Checks

Every project should respond to:
```
GET /api/health

Response:
{
  "status": "healthy",
  "timestamp": "2025-12-24T...",
  "services": {
    "database": "connected",    // if using Supabase
    "redis": "connected",        // if using Redis
    "ghl": "authenticated"       // if using GHL
  }
}
```

### Error Tracking

**Recommended**: Sentry (optional, add if budget allows)

**Pattern**:
```typescript
try {
  // operation
} catch (error) {
  console.error('Operation failed:', error);
  // Send to Sentry if configured
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.captureException(error);
  }
  return Response.json({ error: 'Internal error' }, { status: 500 });
}
```

---

## ✅ Project Alignment Checklist

Use this to verify each project follows standards:

### Environment
- [ ] `.env.local.example` exists with all variables
- [ ] `.gitignore` includes `.env.local`
- [ ] No hardcoded API keys in code
- [ ] Uses cloud-first approach (no local DB)

### Development
- [ ] `package.json` has `"dev": "next dev"` (no hardcoded port)
- [ ] Starts via orchestrator (`npm start` from root)
- [ ] Connects to NAS services (Redis, ChromaDB)
- [ ] Port assigned in `dev-servers.mjs`

### GHL Integration
- [ ] Has own sub-account in GoHighLevel
- [ ] API key configured in `.env.local`
- [ ] Contact form uses shared GHL client (`@/lib/ghl/client`)
- [ ] Implements Redis caching for API calls
- [ ] Pipelines configured in GHL dashboard

### Deployment
- [ ] Connected to GitHub
- [ ] Vercel configured (or deployment plan documented)
- [ ] Environment variables set in Vercel
- [ ] Production URLs use HTTPS
- [ ] Supabase migrations automated (if using Supabase)

### Documentation
- [ ] README.md explains project purpose
- [ ] SETUP_STATUS.md shows current status (optional)
- [ ] Environment variables documented in `.env.local.example`
- [ ] Deployment process documented

---

## 🎓 Quick Reference

### "Which database should I use?"

- **Simple contact forms, booking, newsletters** → GoHighLevel only
- **User accounts with complex permissions** → Supabase + GoHighLevel

### "Where do emails come from?"

- **Transactional** (receipts, confirmations) → Resend
- **Marketing** (campaigns, sequences) → GoHighLevel

### "How do I start developing?"

```bash
cd "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio"
npm start
# All projects start automatically
```

### "How do I deploy?"

```bash
git push origin main
# Vercel auto-deploys
# Supabase auto-migrates (if using Supabase)
```

### "Can I share API keys?"

- **Yes**: Resend, NAS services (Redis, ChromaDB)
- **No**: GHL (separate sub-accounts), Supabase (separate projects)

---

**Last Updated**: 2025-12-24
**Applies To**: All ACT projects (The Harvest, ACT Farm, Empathy Ledger, JusticeHub, Admin Wiki)
