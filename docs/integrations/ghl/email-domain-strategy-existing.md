# Email & Domain Strategy - Using Existing Domains

**Date**: December 24, 2025
**Purpose**: Manage existing project domains efficiently

---

## 🎯 Current Situation

You **ALREADY HAVE** these domains:
- ✅ `theharvest.org.au`
- ✅ `actfarm.org.au`
- ✅ `empathyledger.com`
- ✅ `justicehub.org.au`
- ✅ `goodsoncountry.com`
- ✅ `act.place` (ACT Hub)

**Question**: How to manage 6 separate email inboxes efficiently?

---

## ✅ **SOLUTION: Email Forwarding to Centralized Inbox**

### The Smart Setup

**Keep the professional look** (users see project-specific emails)
**Centralize management** (you check one inbox)

### Recommended Approach: Forward All → One Inbox

```
hello@theharvest.org.au      → forward to → hello@act.place
bookings@actfarm.org.au      → forward to → hello@act.place
stories@empathyledger.com    → forward to → hello@act.place
support@justicehub.org.au    → forward to → hello@act.place
hello@goodsoncountry.com     → forward to → hello@act.place

Main inbox: hello@act.place (you check this one)
```

**Result**:
- ✅ Users email project-specific addresses
- ✅ All emails arrive in ONE inbox
- ✅ You can still send FROM project-specific addresses
- ✅ Professional appearance maintained

---

## 🔧 Implementation Options

### Option 1: Email Provider Forwarding (RECOMMENDED)

**If domains are hosted with**:

#### Google Workspace:
```
1. Log into admin.google.com
2. For each domain:
   - Users → Create user (if not exists)
   - Add forwarding rule → hello@act.place
3. Done!
```

#### Cloudflare Email Routing (FREE):
```
For each domain in Cloudflare:
1. Email Routing → Enable
2. Create route:
   hello@theharvest.org.au → hello@act.place
   bookings@actfarm.org.au → hello@act.place
   stories@empathyledger.com → hello@act.place
   support@justicehub.org.au → hello@act.place
   hello@goodsoncountry.com → hello@act.place
```

#### cPanel / Generic Hosting:
```
1. Email → Forwarders
2. Create forwarder for each domain:
   hello@[domain] → hello@act.place
```

---

### Option 2: Catch-All Forwarding (SIMPLEST)

Set up **catch-all** on each domain → forward to `hello@act.place`

**Benefit**: ANY email to that domain forwards to main inbox (no need to create individual addresses)

**Setup** (most email providers):
```
1. Email settings for each domain
2. Enable "Catch-All" or "Default Address"
3. Set forward-to: hello@act.place
```

---

## 📧 Email Flow (How It Works)

### Outgoing (Your Site → User)

**The Harvest sends confirmation email**:
```
Next.js API → Resend API
  ↓
FROM: "The Harvest <hello@theharvest.org.au>"
REPLY-TO: hello@theharvest.org.au
  ↓
User receives from hello@theharvest.org.au
  ↓
User clicks Reply
  ↓
Email sent to hello@theharvest.org.au
  ↓
Forwarding rule catches it
  ↓
Arrives at hello@act.place (your main inbox)
```

### Incoming (Direct Email)

```
User emails bookings@actfarm.org.au directly
  ↓
Email provider catches it
  ↓
Forwarding rule applies
  ↓
Forwarded to hello@act.place
  ↓
You see it in main inbox
  ↓
Subject shows: "To: bookings@actfarm.org.au"
  ↓
You know it's for ACT Farm
```

---

## 🎨 Using Gmail Labels for Organization

**Pro Tip**: Set up Gmail filters to auto-label by domain

### Gmail Filter Setup:

```
Filter 1:
To: hello@theharvest.org.au
Label: "🌾 The Harvest"
Color: Green

Filter 2:
To: bookings@actfarm.org.au
Label: "🏡 ACT Farm"
Color: Blue

Filter 3:
To: stories@empathyledger.com
Label: "📖 Empathy Ledger"
Color: Purple

Filter 4:
To: support@justicehub.org.au
Label: "⚖️ JusticeHub"
Color: Orange

Filter 5:
To: hello@goodsoncountry.com
Label: "♻️ Goods on Country"
Color: Brown
```

**Result**: All emails in one inbox, auto-organized by project!

---

## 🔐 DNS Configuration Needed

For **each domain**, you need these DNS records:

### SPF Record (Sender Policy Framework)
```
Type: TXT
Name: @
Value: v=spf1 include:_spf.resend.com ~all
```

### DKIM Record (Domain Keys)
```
Get from Resend dashboard for each domain
Type: TXT
Name: resend._domainkey
Value: [provided by Resend]
```

### DMARC Record (Email Authentication)
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:hello@act.place
```

**Why**: Ensures emails from your domains don't go to spam

---

## 📊 Domain Setup Status

| Domain | Email Address | Status | Needs |
|--------|---------------|--------|-------|
| `theharvest.org.au` | `hello@theharvest.org.au` | ❓ Check | Verify DNS, set up forwarding |
| `actfarm.org.au` | `bookings@actfarm.org.au` | ❓ Check | Verify DNS, set up forwarding |
| `empathyledger.com` | `stories@empathyledger.com` | ❓ Check | Verify DNS, set up forwarding |
| `justicehub.org.au` | `support@justicehub.org.au` | ❓ Check | Verify DNS, set up forwarding |
| `goodsoncountry.com` | `hello@goodsoncountry.com` | ❓ Check | Verify DNS, set up forwarding |
| `act.place` | `hello@act.place` | ❓ Check | Main inbox |

---

## 🎯 Step-by-Step Setup

### Step 1: Verify All Domains in Resend

```bash
# Log into Resend dashboard
# For each domain:
1. Domains → Add Domain
2. Enter: theharvest.org.au
3. Copy DNS records (SPF, DKIM, DMARC)
4. Add to domain DNS settings
5. Click "Verify"
6. Repeat for all 6 domains
```

### Step 2: Set Up Email Forwarding

**Option A: Cloudflare (Recommended - FREE)**

For each domain:
```
1. Add domain to Cloudflare (if not already)
2. Email Routing → Enable
3. Create destination: hello@act.place
4. Create route:
   hello@theharvest.org.au → hello@act.place
5. Test: Send email to address, check main inbox
```

**Option B: Your Current Email Host**

Check where each domain is hosted:
```bash
# Find nameservers for each domain
dig theharvest.org.au NS
dig actfarm.org.au NS
dig empathyledger.com NS
dig justicehub.org.au NS
dig goodsoncountry.com NS
```

Then configure forwarding in that provider's control panel.

### Step 3: Update GHL Sub-Accounts

Use the actual domain emails:
```
The Harvest:        hello@theharvest.org.au
ACT Farm:           bookings@actfarm.org.au
Empathy Ledger:     stories@empathyledger.com
JusticeHub:         support@justicehub.org.au
Goods on Country:   hello@goodsoncountry.com
ACT Hub (Master):   hello@act.place
```

### Step 4: Update Environment Variables

**The Harvest** `.env.local`:
```bash
EMAIL_FROM="The Harvest <hello@theharvest.org.au>"
EMAIL_REPLY_TO=hello@theharvest.org.au
RESEND_API_KEY=re_[shared-key]
```

**ACT Farm** `.env.local`:
```bash
EMAIL_FROM="ACT Farm <bookings@actfarm.org.au>"
EMAIL_REPLY_TO=bookings@actfarm.org.au
RESEND_API_KEY=re_[shared-key]
```

**Empathy Ledger** `.env.local`:
```bash
EMAIL_FROM="Empathy Ledger <stories@empathyledger.com>"
EMAIL_REPLY_TO=stories@empathyledger.com
RESEND_API_KEY=re_[shared-key]
```

**JusticeHub** `.env.local`:
```bash
EMAIL_FROM="JusticeHub <support@justicehub.org.au>"
EMAIL_REPLY_TO=support@justicehub.org.au
RESEND_API_KEY=re_[shared-key]
```

**Goods on Country** `.env.local`:
```bash
EMAIL_FROM="Goods on Country <hello@goodsoncountry.com>"
EMAIL_REPLY_TO=hello@goodsoncountry.com
RESEND_API_KEY=re_[shared-key]
```

---

## 💡 Key Benefits

### Using Real Domain Emails:

✅ **Professional**: Each project has own branded email
✅ **Trustworthy**: Users see legitimate domain, not generic alias
✅ **Deliverability**: Better inbox placement (not flagged as spam)
✅ **Scalable**: Projects can spin out independently
✅ **Brand Building**: Reinforces individual project identities

### With Centralized Forwarding:

✅ **Efficient**: One inbox to check (`hello@act.place`)
✅ **Organized**: Use Gmail labels to auto-sort by project
✅ **Flexible**: Can change forwarding destination anytime
✅ **Cost-Effective**: No need for 6 email accounts/hosting

---

## 🔄 Sending vs Receiving

### Sending (via Resend):
```
Each project sends FROM its own domain:
- The Harvest → sends from hello@theharvest.org.au
- ACT Farm → sends from bookings@actfarm.org.au
- etc.

All use same Resend API key (just different FROM addresses)
```

### Receiving (via Forwarding):
```
All emails forward to → hello@act.place
You check one inbox
Gmail labels auto-organize by project
```

**Best of both worlds**: Professional sending, centralized receiving! 🎉

---

## 🎯 Updated GHL Setup Checklist

### Sub-Account Emails (Use Real Domains):

```
✅ A Curious Tractor (Master):   hello@act.place
✅ The Harvest:                   hello@theharvest.org.au
✅ ACT Farm:                      bookings@actfarm.org.au
✅ Empathy Ledger:                stories@empathyledger.com
✅ JusticeHub:                    support@justicehub.org.au
✅ Goods on Country:              hello@goodsoncountry.com

All forward to: hello@act.place (your main inbox)
```

---

## 🚀 Quick Start Checklist

- [ ] **Step 1**: Verify all 6 domains in Resend (add DNS records)
- [ ] **Step 2**: Set up email forwarding (all → `hello@act.place`)
- [ ] **Step 3**: Test forwarding (send email to each address)
- [ ] **Step 4**: Set up Gmail labels for auto-organization
- [ ] **Step 5**: Update GHL sub-accounts with real domain emails
- [ ] **Step 6**: Update `.env.local` files with correct FROM addresses
- [ ] **Step 7**: Test sending from each project (via Resend)
- [ ] **Step 8**: Confirm deliverability (check spam scores)

**Time Estimate**: 2-3 hours for all 6 domains
**Cost**: $0 (using existing domains + free forwarding)

---

## 📚 Resources

- **Resend Domain Verification**: https://resend.com/docs/dashboard/domains/introduction
- **Cloudflare Email Routing**: https://developers.cloudflare.com/email-routing/
- **Gmail Filters**: https://support.google.com/mail/answer/6579
- **DNS Propagation Check**: https://dnschecker.org/

---

**Last Updated**: December 24, 2025
**Maintained By**: ACT Development Team
**Related**: [GHL_SETUP_CHECKLIST.md](./GHL_SETUP_CHECKLIST.md)
