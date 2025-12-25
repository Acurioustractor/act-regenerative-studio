# GHL LC Email Integration Summary

**Date**: December 24, 2025
**Status**: ✅ Documentation Complete, Ready for Implementation

---

## 🎯 What We're Implementing

**GHL LC Email** - GoHighLevel's native email service for all 6 ACT projects.

### Why LC Email?

1. **Unified Communications**: All emails in GHL dashboard (no separate inbox)
2. **Automatic CRM Integration**: Every email links to contact record
3. **Pipeline Automation**: Email activity triggers pipeline movements
4. **Team Collaboration**: Multiple team members manage same inbox
5. **Cost Effective**: Included in GHL subscription ($297/month)
6. **Professional Sending**: Emails send FROM your actual domains

---

## 📧 Email Setup Overview

### Sending Flow
```
User submits form on website
  ↓
Next.js API creates GHL contact
  ↓
GHL workflow triggers
  ↓
Email sent FROM: hello@theharvest.org.au (via LC Email)
  ↓
Email delivered to user
  ↓
Email stored in GHL contact record
```

### Receiving Flow
```
User replies to email or sends new email
  ↓
Email sent TO: hello@theharvest.org.au
  ↓
MX records route email to GHL
  ↓
GHL receives email in LC Email inbox
  ↓
GHL links email to existing contact (or creates new)
  ↓
Pipeline automation triggers (e.g., move to "Replied" stage)
  ↓
Team member sees email in GHL dashboard
  ↓
Team responds from GHL
  ↓
Conversation history saved in contact record
```

---

## 🔧 Technical Requirements

### DNS Records Per Domain

Each domain needs 5 DNS records:

1. **SPF Record** (TXT): Authorizes GHL to send email
2. **DKIM Record** (CNAME): Email authentication
3. **DMARC Record** (TXT): Email policy
4. **MX Record 1** (Priority 10): Primary mail server
5. **MX Record 2** (Priority 20): Backup mail server

**All records point to**: `leadconnector.io` infrastructure

### Environment Variables

No changes needed to `.env` files for LC Email setup!

Email is configured entirely in GHL dashboard, not in code.

**Optional**: For non-CRM transactional emails (password resets, etc.), keep Resend:
```bash
# Optional: System emails only
RESEND_API_KEY=re_xxxxx
```

---

## 📋 Implementation Checklist

### Phase 1: GHL Account Setup (Week 1)
- [ ] Create 6 GHL accounts (1 master + 5 sub-accounts)
- [ ] Generate API keys for all 6 accounts
- [ ] Generate Location IDs for all 6 accounts
- [ ] Populate .env vault with credentials
- [ ] Run `./scripts/sync-env.sh` to deploy credentials

### Phase 2: LC Email Setup (Week 2)
- [ ] Add all 6 domains to respective GHL sub-accounts
- [ ] Copy DNS records from GHL for each domain
- [ ] Add DNS records to domain provider (Cloudflare, etc.)
- [ ] Verify all 6 domains in GHL (green checkmark)
- [ ] Test sending from each domain
- [ ] Test receiving on each domain

### Phase 3: Email Templates (Week 3)
- [ ] Create 5-10 templates per project (30-60 total templates)
- [ ] Configure email signatures for all 6 projects
- [ ] Test templates for formatting/deliverability
- [ ] A/B test subject lines

### Phase 4: Workflow Automation (Week 3-4)
- [ ] Build welcome/confirmation workflows (6 total, 1 per project)
- [ ] Build follow-up sequences (12+ workflows)
- [ ] Configure pipeline automation triggers
- [ ] Test end-to-end flows

### Phase 5: Testing & Go-Live (Week 4)
- [ ] Send test emails from all 6 domains
- [ ] Verify deliverability (not spam)
- [ ] Test reply handling
- [ ] Train team on GHL inbox
- [ ] Monitor first week of live emails

---

## 🎨 Email Template Examples

### The Harvest - Volunteer Confirmation

**Subject**: Welcome to The Harvest Community! 🌾

**Body**:
```
Hi {{contact.first_name}},

Thank you for your interest in volunteering at The Harvest!

We've received your application and our volunteer coordinator will
review it within 2-3 business days.

What happens next:
• We'll schedule a brief phone call to learn about your interests
• You'll attend a volunteer orientation (2 hours)
• You'll join us for your first volunteer day!

Learn more about our programs:
https://theharvest.org.au/get-involved

Questions? Just reply to this email!

The Harvest Team
hello@theharvest.org.au
theharvest.org.au
```

### ACT Farm - Residency Booking Confirmation

**Subject**: Your residency at ACT Farm is confirmed! 🏡

**Body**:
```
Hi {{contact.first_name}},

Great news! Your residency at ACT Farm is confirmed.

Booking Details:
• Check-in: {{custom.residency_start_date}}
• Check-out: {{custom.residency_end_date}}
• Residency Type: {{custom.residency_type}}
• Accommodation: {{custom.accommodation_name}}

Before You Arrive:
📋 Review our residency guide: https://actfarm.org.au/residency-guide
📦 What to bring: {{link.packing_list}}
🚗 Directions: {{link.directions}}

We'll send another email 7 days before your arrival with final details.

Looking forward to hosting you!

ACT Farm Team
bookings@actfarm.org.au
actfarm.org.au
```

---

## 🔄 Next.js Integration (Code Changes)

### Current State (Most Projects)

Most forms currently use Formspree or log to console.

### Updated Integration (Using GHL)

**Option 1: GHL API Only (Recommended)**

```typescript
// /app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { email, name, phone, message, inquiryType } = await request.json();

  // Create contact in GHL
  const ghlResponse = await fetch(
    'https://services.leadconnectorhq.com/contacts/',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GHL_API_KEY}`,
        'Content-Type': 'application/json',
        'Version': '2021-07-28',
      },
      body: JSON.stringify({
        email,
        name,
        phone,
        source: 'Website Contact Form',
        tags: ['website-inquiry', inquiryType],
        customFields: {
          message,
          inquiry_type: inquiryType,
        },
      }),
    }
  );

  if (!ghlResponse.ok) {
    return NextResponse.json(
      { error: 'Failed to submit inquiry' },
      { status: 500 }
    );
  }

  const contactData = await ghlResponse.json();

  // GHL workflow automatically sends confirmation email
  // No need to call email API separately!

  return NextResponse.json({
    success: true,
    message: 'Thank you! We\'ll be in touch soon.',
    contactId: contactData.contact.id,
  });
}
```

**That's it!** GHL workflows handle email sending automatically based on:
- Tags applied to contact
- Pipeline stage contact is added to
- Custom field values

**Option 2: GHL + Resend (For transactional emails)**

Keep Resend for system emails (password resets, etc.) that don't need CRM tracking:

```typescript
// System email (password reset) - use Resend
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'system@theharvest.org.au',
  to: user.email,
  subject: 'Password Reset',
  html: '<p>Click to reset...</p>',
});

// Customer communication - use GHL
// (creates contact, triggers workflow, sends via LC Email)
await fetch('https://services.leadconnectorhq.com/contacts/', {
  // ... create contact
});
```

---

## 📊 Domains & Email Addresses

| Domain | GHL Sub-Account | Primary Email | LC Email Status |
|--------|-----------------|---------------|-----------------|
| `theharvest.org.au` | The Harvest | `hello@theharvest.org.au` | ⏳ To Configure |
| `actfarm.org.au` | ACT Farm | `bookings@actfarm.org.au` | ⏳ To Configure |
| `empathyledger.com` | Empathy Ledger | `stories@empathyledger.com` | ⏳ To Configure |
| `justicehub.org.au` | JusticeHub | `support@justicehub.org.au` | ⏳ To Configure |
| `goodsoncountry.com` | Goods on Country | `hello@goodsoncountry.com` | ⏳ To Configure |
| `act.place` | ACT Hub (Master) | `hello@act.place` | ⏳ To Configure |

---

## ⚠️ Important Considerations

### MX Record Change = Email Routing Change

When you add MX records pointing to `leadconnector.io`:
- **All email for that domain goes to GHL**
- Any existing email (Gmail, Outlook, etc.) will STOP working
- Backup existing MX records before changing
- Update team that email will now be in GHL inbox

### Gradual Rollout Recommended

**Don't switch all 6 domains at once!**

Recommended rollout:
1. **Week 1**: Set up The Harvest only
2. **Week 2**: If successful, add ACT Farm
3. **Week 3**: Add Empathy Ledger & JusticeHub
4. **Week 4**: Add Goods on Country & ACT Hub

This allows you to:
- Learn LC Email interface on one project first
- Fix issues before rolling out to others
- Train team gradually
- Ensure deliverability is good before scaling

### Domain Warm-Up Required

New domains need to warm up gradually:

**Week 1**: Send 50 emails/day
**Week 2**: Send 200 emails/day
**Week 3**: Send 500 emails/day
**Week 4+**: Full volume

Sending too many emails immediately from new domain = spam folder.

---

## 🎯 Success Criteria

### Week 1 Post-Setup
- [ ] All 6 domains verified in GHL LC Email
- [ ] Test emails sending successfully (not spam)
- [ ] Test replies appearing in GHL inbox
- [ ] Team comfortable navigating GHL conversations

### Month 1 Post-Setup
- [ ] 100+ contacts receiving automated emails per project
- [ ] >95% email delivery rate
- [ ] >20% email open rate
- [ ] <2% bounce rate
- [ ] Pipeline automation working (contacts moving based on email activity)

### Quarter 1 Post-Setup
- [ ] 1000+ emails sent across ecosystem
- [ ] Measurable improvement in response time (<24 hours)
- [ ] Increased booking/conversion rates
- [ ] Team preferring GHL inbox over email client

---

## 💰 Cost Analysis

### GHL LC Email (Recommended)
- **Cost**: Included in GHL Pro subscription
- **GHL Pro**: $297/month for agency account
- **Email limit**: 25,000 emails/month included
- **Additional**: $10 per 10,000 emails if over limit
- **Total**: ~$297/month (email included)

### Alternative: Resend for All Projects
- **Resend**: $20/month per project = $120/month
- **GHL**: $297/month (but not using email feature)
- **Total**: $417/month

**Savings**: $120/month by using LC Email
**Annual savings**: $1,440/year

**Plus intangible benefits**:
- Centralized communications (massive time savings)
- Automated pipeline movements (fewer manual tasks)
- Better customer experience (full conversation history)

---

## 📚 Documentation Reference

- **[GHL_LC_EMAIL_SETUP.md](./GHL_LC_EMAIL_SETUP.md)**: Step-by-step setup guide
- **[EMAIL_STRATEGY_GHL_NATIVE.md](./EMAIL_STRATEGY_GHL_NATIVE.md)**: Complete email strategy
- **[GHL_SETUP_CHECKLIST.md](./GHL_SETUP_CHECKLIST.md)**: GHL account creation checklist
- **[GHL_SUBACCOUNT_STRATEGY.md](./GHL_SUBACCOUNT_STRATEGY.md)**: Sub-account architecture
- **[SYSTEM_STATUS_COMPLETE.md](./SYSTEM_STATUS_COMPLETE.md)**: Overall system status

---

## 🚀 Getting Started

### Immediate Next Steps

1. **Create 6 GHL Accounts** (if not already done)
   - See: [GHL_SETUP_CHECKLIST.md](./GHL_SETUP_CHECKLIST.md)

2. **Set Up LC Email for First Domain** (The Harvest)
   - See: [GHL_LC_EMAIL_SETUP.md](./GHL_LC_EMAIL_SETUP.md)
   - Start with one domain to learn the process
   - Test thoroughly before adding more

3. **Create Email Templates**
   - Build 5-10 templates for The Harvest
   - Test deliverability and formatting
   - Replicate for other projects

4. **Build First Workflow**
   - Volunteer signup confirmation workflow
   - Test end-to-end flow
   - Replicate pattern for other workflows

5. **Gradual Rollout**
   - Week 1: The Harvest
   - Week 2: ACT Farm
   - Week 3: Empathy Ledger & JusticeHub
   - Week 4: Goods on Country & ACT Hub

---

## ✅ Advantages Over Previous Approach

### Before (Email Forwarding Strategy)
- ❌ Emails in Gmail, contacts in GHL (disconnected)
- ❌ Manual work to link emails to CRM records
- ❌ No automated pipeline movements from email activity
- ❌ Multiple inboxes to check (Gmail + GHL)
- ❌ No conversation history in CRM
- ❌ Complex forwarding rules to maintain

### After (GHL LC Email)
- ✅ Everything in one place (GHL dashboard)
- ✅ Automatic contact linking (emails → contact records)
- ✅ Automated pipeline movements (reply → "Replied" stage)
- ✅ One inbox per project (all in GHL)
- ✅ Full conversation history per contact
- ✅ Simple setup (just DNS records)

---

**Status**: Documentation complete, ready for implementation
**Next Action**: Create 6 GHL accounts, then set up LC Email for The Harvest
**Timeline**: 4 weeks for full rollout across all 6 projects

---

**Last Updated**: December 24, 2025
**Maintained By**: ACT Development Team
