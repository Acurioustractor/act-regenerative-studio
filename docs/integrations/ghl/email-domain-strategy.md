# Email & Domain Strategy - Smart Setup

**Date**: December 24, 2025
**Purpose**: Avoid email/domain chaos while maintaining professional appearance

---

## 🎯 The Problem

You don't want to:
- ❌ Set up 6+ different domains
- ❌ Manage 6+ email inboxes
- ❌ Pay for 6+ domain registrations
- ❌ Configure DNS for 6+ domains
- ❌ Monitor 6+ separate email accounts

But you DO want:
- ✅ Professional appearance (project-specific emails)
- ✅ Clear routing (know which project an email is for)
- ✅ Centralized inbox (one place to check)
- ✅ Future flexibility (can spin out domains later)

---

## ✅ **SOLUTION: Email Aliases + Subdomain Strategy**

### Option A: Single Domain with Aliases (RECOMMENDED)

Use **one main domain** with email aliases for all projects.

**Main Domain**: `act.place` (or `acurioustractor.org`)

**Email Setup**:
```
Master inbox: hello@act.place

Project aliases (all route to same inbox):
├── hello@act.place              (ACT Hub - general)
├── harvest@act.place            (The Harvest)
├── farm@act.place               (ACT Farm residencies)
├── stories@act.place            (Empathy Ledger)
├── justice@act.place            (JusticeHub)
└── goods@act.place              (Goods on Country)
```

**How It Works**:
1. All emails go to ONE inbox (e.g., `hello@act.place`)
2. GHL uses different "FROM" addresses for each project
3. Replies automatically route back to the right sub-account
4. You see which project it's for by the TO address

**Cost**: $0 extra (just email aliases in your email provider)

**Setup Time**: 10 minutes

---

### Option B: Subdomains Strategy (Future-Proof)

If you want to look like separate domains without actually buying them:

**Main Domain**: `act.place`

**Subdomain Websites**:
```
act.place                    → ACT Hub (main site)
harvest.act.place            → The Harvest
farm.act.place               → ACT Farm
stories.act.place            → Empathy Ledger
justice.act.place            → JusticeHub
goods.act.place              → Goods on Country
```

**Email Setup** (still centralized):
```
hello@act.place              → Main inbox
hello@harvest.act.place      → Alias to main inbox
hello@farm.act.place         → Alias to main inbox
hello@stories.act.place      → Alias to main inbox
hello@justice.act.place      → Alias to main inbox
hello@goods.act.place        → Alias to main inbox
```

**Benefit**: Looks professional, easy to spin out to own domains later

**Cost**: $0 extra (just DNS configuration)

---

### Option C: Email + Tag Strategy (SIMPLEST)

Use **one email address** for ALL projects, use GHL tags to route.

**Single Email**: `hello@act.place`

**GHL Setup**:
- All sub-accounts use same email: `hello@act.place`
- Each contact gets tagged with project source
- GHL workflows route based on tags
- Automation assigns to correct pipeline

**Example**:
```
Contact submits form on The Harvest website
  ↓
Email sent to: hello@act.place
  ↓
GHL receives webhook with tag: "source: the-harvest"
  ↓
Auto-assigns to The Harvest sub-account
  ↓
Routes to Volunteer Pipeline
```

**Benefit**: Zero extra setup, works immediately

**Downside**: All outgoing emails show `hello@act.place` (less project-specific branding)

---

## 🏆 **RECOMMENDED APPROACH**

### **Hybrid: One Domain + Smart Aliases**

**What You Need**:
1. **One domain**: `act.place` (you probably already have this)
2. **One email provider**: Google Workspace, Resend, or similar
3. **Email aliases**: Create 5 aliases that forward to main inbox

### **Step-by-Step Setup**

#### 1. Configure Email Aliases

**Using Google Workspace** (recommended):
```
1. Log into Google Workspace Admin (admin.google.com)
2. Go to Users → Your main user
3. Add aliases:
   - harvest@act.place
   - farm@act.place
   - stories@act.place
   - justice@act.place
   - goods@act.place

4. All emails route to hello@act.place inbox
```

**Using Resend** (what you already have):
```
Resend supports sending FROM any address on your domain.
You don't need to set up separate emails!

Just configure:
- Domain: act.place (verified)
- Send from: harvest@act.place, farm@act.place, etc.
- Replies go to: hello@act.place
```

**Using Cloudflare Email Routing** (free):
```
1. Add act.place to Cloudflare
2. Email Routing → Create routes:
   harvest@act.place → forward to hello@act.place
   farm@act.place → forward to hello@act.place
   stories@act.place → forward to hello@act.place
   justice@act.place → forward to hello@act.place
   goods@act.place → forward to hello@act.place

3. All emails arrive in one inbox
4. Can still send FROM different addresses via Resend
```

---

#### 2. Configure GHL Sub-Accounts

For **each sub-account**:

**Business Email** (what GHL uses internally):
```
The Harvest:        harvest@act.place
ACT Farm:           farm@act.place
Empathy Ledger:     stories@act.place
JusticeHub:         justice@act.place
Goods on Country:   goods@act.place
ACT Hub (Master):   hello@act.place
```

**Reply-To Email** (where responses go):
```
All projects: hello@act.place
```

**From Name** (what users see):
```
The Harvest:        "The Harvest" <harvest@act.place>
ACT Farm:           "ACT Farm" <farm@act.place>
Empathy Ledger:     "Empathy Ledger" <stories@act.place>
JusticeHub:         "JusticeHub" <justice@act.place>
Goods on Country:   "Goods on Country" <goods@act.place>
```

---

#### 3. Configure Resend (Transactional Email)

**Domain**: `act.place` (verify in Resend dashboard)

**Environment Variables** (all projects can use same API key):
```bash
RESEND_API_KEY=re_[your-shared-key]

# Different FROM address per project:
# The Harvest:
EMAIL_FROM="The Harvest <harvest@act.place>"

# ACT Farm:
EMAIL_FROM="ACT Farm <farm@act.place>"

# Empathy Ledger:
EMAIL_FROM="Empathy Ledger <stories@act.place>"

# JusticeHub:
EMAIL_FROM="JusticeHub <justice@act.place>"

# Goods on Country:
EMAIL_FROM="Goods on Country <goods@act.place>"
```

**Reply-To** (all projects):
```bash
EMAIL_REPLY_TO=hello@act.place
```

---

## 📊 Comparison Table

| Approach | Setup Time | Cost | Professional Look | Future Flexibility |
|----------|------------|------|-------------------|-------------------|
| **Single email + tags** | 5 mins | $0 | ⭐⭐ | ⭐⭐ |
| **Aliases (Recommended)** | 15 mins | $0 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Subdomains** | 30 mins | $0 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Separate domains** | 3+ hours | $60+/year | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |

---

## 🎯 **RECOMMENDED SETUP** (15 minutes)

### What You'll Create:

**1 Domain**: `act.place`

**6 Email Addresses** (all aliases to one inbox):
```
hello@act.place      → Main inbox (you check this)
harvest@act.place    → Alias → forwards to hello@act.place
farm@act.place       → Alias → forwards to hello@act.place
stories@act.place    → Alias → forwards to hello@act.place
justice@act.place    → Alias → forwards to hello@act.place
goods@act.place      → Alias → forwards to hello@act.place
```

**Result**:
- ✅ Users see professional project-specific emails
- ✅ You only check ONE inbox
- ✅ GHL can send from different addresses
- ✅ Can spin out to own domains later (just update DNS)
- ✅ Zero ongoing cost

---

## 🔧 Implementation Steps

### Step 1: Verify Your Domain in Resend

```bash
# Already done? Check Resend dashboard
# If not: Add act.place, add DNS records (SPF, DKIM, DMARC)
```

### Step 2: Set Up Email Forwarding

**Option A: Cloudflare Email Routing (FREE, RECOMMENDED)**

1. Add `act.place` to Cloudflare (if not already)
2. Go to Email Routing
3. Add routes:
   ```
   harvest@act.place → hello@act.place
   farm@act.place → hello@act.place
   stories@act.place → hello@act.place
   justice@act.place → hello@act.place
   goods@act.place → hello@act.place
   ```
4. Done! All emails arrive in one inbox

**Option B: Google Workspace (if you have it)**

1. Admin console → Users → Add aliases
2. Same aliases as above
3. Done!

### Step 3: Update GHL Sub-Account Emails

When creating each sub-account, use:
```
The Harvest:        harvest@act.place
ACT Farm:           farm@act.place
Empathy Ledger:     stories@act.place
JusticeHub:         justice@act.place
Goods on Country:   goods@act.place
```

### Step 4: Update Environment Variables

In each project's `.env.local`:

**The Harvest**:
```bash
EMAIL_FROM="The Harvest <harvest@act.place>"
EMAIL_REPLY_TO=hello@act.place
RESEND_API_KEY=re_[shared-key]
```

**ACT Farm**:
```bash
EMAIL_FROM="ACT Farm <farm@act.place>"
EMAIL_REPLY_TO=hello@act.place
RESEND_API_KEY=re_[shared-key]
```

**Empathy Ledger**:
```bash
EMAIL_FROM="Empathy Ledger <stories@act.place>"
EMAIL_REPLY_TO=hello@act.place
RESEND_API_KEY=re_[shared-key]
```

**JusticeHub**:
```bash
EMAIL_FROM="JusticeHub <justice@act.place>"
EMAIL_REPLY_TO=hello@act.place
RESEND_API_KEY=re_[shared-key]
```

**Goods on Country**:
```bash
EMAIL_FROM="Goods on Country <goods@act.place>"
EMAIL_REPLY_TO=hello@act.place
RESEND_API_KEY=re_[shared-key]
```

---

## 📧 How Email Flow Works

### Outgoing (Your Website → User)

```
User submits form on The Harvest website
  ↓
Next.js API route sends email via Resend
  ↓
FROM: "The Harvest <harvest@act.place>"
REPLY-TO: hello@act.place
  ↓
User receives email from harvest@act.place
  ↓
User clicks Reply
  ↓
Reply goes to hello@act.place (your main inbox)
```

### Incoming (User → Your Inbox)

```
User emails harvest@act.place
  ↓
Cloudflare Email Routing catches it
  ↓
Forwards to hello@act.place
  ↓
You see email in main inbox
Subject line shows: "To: harvest@act.place"
  ↓
You know it's for The Harvest project
```

---

## 🎨 User Experience

**What Users See**:
```
The Harvest confirmation email:
  FROM: The Harvest <harvest@act.place>
  SUBJECT: Thanks for signing up!

ACT Farm booking email:
  FROM: ACT Farm <farm@act.place>
  SUBJECT: Your residency booking confirmed

Empathy Ledger notification:
  FROM: Empathy Ledger <stories@act.place>
  SUBJECT: Your story has been published
```

**What You See** (in your `hello@act.place` inbox):
```
📨 [harvest@act.place] New volunteer inquiry
📨 [farm@act.place] Residency booking question
📨 [stories@act.place] Organization partnership request
```

You can set up Gmail filters to auto-label by TO address!

---

## 🔮 Future-Proofing

### When You Want Separate Domains Later:

**Current Setup**:
```
harvest@act.place → hello@act.place
```

**Future Setup** (when The Harvest spins out):
```
1. Buy theharvest.org.au
2. Set up hello@theharvest.org.au
3. Update GHL sub-account email
4. Update Resend FROM address
5. Update DNS routing

Old emails still work (forward from @act.place)
```

**Migration Time**: ~30 minutes per project
**Cost**: Only pay for domains you actually need

---

## 💰 Cost Comparison

### Current Setup (Recommended)
- **Domain**: $12/year (act.place only)
- **Email Routing**: $0 (Cloudflare free)
- **Transactional Email**: $0-20/month (Resend free tier covers most)
- **Total**: ~$12-250/year

### Alternative (Separate Domains)
- **Domains**: $72/year (6 domains @ $12 each)
- **Email Hosting**: $72-360/year (Google Workspace or similar)
- **Setup Time**: 6-10 hours
- **Total**: ~$144-432/year

**Savings**: $132-382/year with recommended approach! 💰

---

## ✅ Updated GHL Setup Checklist

### Instead of different domains, use:

```
# Sub-Account Emails (all @act.place)
A Curious Tractor:   hello@act.place
The Harvest:         harvest@act.place
ACT Farm:            farm@act.place
Empathy Ledger:      stories@act.place
JusticeHub:          justice@act.place
Goods on Country:    goods@act.place

# All forward to: hello@act.place (your main inbox)
```

---

## 🎯 Action Steps (15 minutes)

1. **Set up email forwarding** (Cloudflare Email Routing - FREE):
   - Add act.place to Cloudflare
   - Create 5 email routes (harvest@, farm@, stories@, justice@, goods@)
   - All forward to hello@act.place

2. **Verify domain in Resend** (if not already):
   - Add SPF, DKIM, DMARC records
   - Test sending from different addresses

3. **Update GHL sub-account emails**:
   - Use project-specific @act.place addresses
   - Set Reply-To as hello@act.place

4. **Update .env files**:
   - Different EMAIL_FROM per project
   - Same EMAIL_REPLY_TO (hello@act.place)
   - Same RESEND_API_KEY (shared)

**Done!** Professional email setup with zero extra domains. 🎉

---

## 📚 References

- **Cloudflare Email Routing**: https://www.cloudflare.com/products/email-routing/ (FREE)
- **Resend Domains**: https://resend.com/docs/dashboard/domains/introduction
- **GHL Email Setup**: https://help.gohighlevel.com/support/solutions/articles/48001159880

---

**Last Updated**: December 24, 2025
**Maintained By**: ACT Development Team
**Related**: [GHL_SETUP_CHECKLIST.md](./GHL_SETUP_CHECKLIST.md), [GHL_SUBACCOUNT_STRATEGY.md](./GHL_SUBACCOUNT_STRATEGY.md)
