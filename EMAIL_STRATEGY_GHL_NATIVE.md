# Email Strategy - GHL Native Email

**Date**: December 24, 2025
**Purpose**: Use GoHighLevel's native email to centralize all communications in CRM

---

## 🎯 Strategy Overview

**Use GHL's built-in email system** for all customer communications across all 6 projects.

### Why GHL Email?

✅ **Unified Communications**: All emails, SMS, calls in one dashboard
✅ **Automatic Contact Linking**: Every email automatically attaches to contact record
✅ **Pipeline Automation**: Email opens/replies trigger pipeline movements
✅ **Conversation History**: Full communication timeline per contact
✅ **Team Collaboration**: Multiple team members can see/respond
✅ **No Forwarding Needed**: No complex email routing setup

---

## 📧 How GHL Email Works

### Setup Flow

```
1. Connect your domain to GHL sub-account
   - Settings → Email Services → Mailgun Integration
   - Add DNS records (SPF, DKIM, DMARC)
   - Verify domain

2. GHL uses your domain for sending
   - Emails send FROM: hello@theharvest.org.au
   - Emails send THROUGH: GHL's email infrastructure
   - Replies come TO: GHL inbox (not external email)

3. All communications stored in GHL
   - Contact record shows full email history
   - Pipeline automation triggers on email activity
   - Team sees all conversations in one place
```

### Email Flow Example

```
The Harvest - Volunteer Signup
  ↓
1. User submits form on theharvest.org.au
  ↓
2. Next.js API creates contact in GHL (via API)
  ↓
3. GHL workflow triggers "New Volunteer Welcome" email
  ↓
4. Email sent FROM: hello@theharvest.org.au
   (via GHL's Mailgun integration)
  ↓
5. User receives email in their inbox
  ↓
6. User clicks Reply → email goes to GHL inbox
  ↓
7. GHL automatically:
   - Links reply to contact record
   - Moves contact to "Replied" pipeline stage
   - Notifies team member via app/email
  ↓
8. Team member responds in GHL dashboard
  ↓
9. Full conversation stored in contact record
```

---

## 🔧 Technical Setup

### Step 1: Domain Configuration in GHL (LC Email)

**LC Email** is GHL's native email service - simplest and most integrated option.

For **each GHL sub-account**:

```
1. Log into GHL sub-account (e.g., The Harvest)
2. Settings → Email Services → LC Email
3. Click "Add Domain"
4. Enter your domain: theharvest.org.au
5. GHL provides DNS records to add
6. Add DNS records to your domain provider
7. Click "Verify Domain"
8. Repeat for all 6 sub-accounts
```

**Why LC Email**:
- ✅ Fully integrated with GHL (no third-party service)
- ✅ Automatic conversation threading
- ✅ Built-in spam protection
- ✅ Simplified billing (included in GHL subscription)
- ✅ Best for <10,000 emails/month per domain

### Step 2: DNS Records (Per Domain)

**GHL LC Email** will provide these DNS records when you add each domain:

#### Example: The Harvest (theharvest.org.au)

```
# SPF Record (allows GHL to send email from your domain)
Type: TXT
Name: @
Value: v=spf1 include:_spf.leadconnector.io ~all

# DKIM Record (email authentication)
Type: CNAME
Name: lc1._domainkey
Value: lc1._domainkey.leadconnector.io

# DMARC Record (email policy)
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:hello@theharvest.org.au

# MX Records (receive email in GHL)
Type: MX
Priority: 10
Value: mx1.leadconnector.io

Type: MX
Priority: 20
Value: mx2.leadconnector.io
```

**Important**: The exact values will be shown in GHL when you add the domain. Copy them exactly as shown.

#### All 6 Domains Need DNS Records

Repeat the process for:
- ✅ theharvest.org.au (The Harvest)
- ✅ actfarm.org.au (ACT Farm)
- ✅ empathyledger.com (Empathy Ledger)
- ✅ justicehub.org.au (JusticeHub)
- ✅ goodsoncountry.com (Goods on Country)
- ✅ act.place (ACT Hub - Master)

### Step 3: Email Templates in GHL

Create email templates for each project:

**The Harvest Templates**:
- Volunteer Application Confirmation
- Event Registration Confirmation
- CSA Subscription Welcome
- Tenant Application Received
- General Inquiry Response

**ACT Farm Templates**:
- Residency Booking Confirmation
- Residency Pre-Arrival Information
- Workshop Registration Confirmation
- June's Patch Referral Received
- Accommodation Inquiry Response

**Empathy Ledger Templates**:
- Storyteller Welcome Email
- Organization Partnership Inquiry
- Story Submission Received
- Profile Approval Notification
- Monthly Storyteller Newsletter

**JusticeHub Templates**:
- Service Match Notification
- CONTAINED Booking Confirmation
- Service Provider Application Received
- Campaign Nomination Acknowledgment
- Family Support Request Received

**Goods on Country Templates**:
- Order Confirmation
- Shipping Notification
- Manufacturer Onboarding Welcome
- Wholesale Inquiry Response
- Product Launch Announcement

**ACT Hub (Master) Templates**:
- General Inquiry Response
- Partnership Opportunity Introduction
- Funding Application Received
- Art Residency Application Received
- Governance Participation Welcome

### Step 4: Workflow Automation

Set up GHL workflows for automatic email sending:

```
Example: The Harvest - Volunteer Signup

Trigger: Contact added to "Volunteer Pipeline"
  ↓
Action 1: Send "Volunteer Application Confirmation" email
  ↓
Wait: 2 days
  ↓
Condition: If contact has NOT replied
  ↓
Action 2: Send "Follow-Up - Volunteer Opportunities" email
  ↓
Wait: 7 days
  ↓
Condition: If contact has NOT booked orientation
  ↓
Action 3: Send "Volunteer Orientation Reminder" email
  ↓
End workflow when: Contact moves to "Active Volunteer" stage
```

---

## 📱 GHL Inbox Management

### Unified Inbox Per Sub-Account

Each GHL sub-account has its own inbox:

```
The Harvest Inbox:
- All emails to/from hello@theharvest.org.au
- Organized by contact
- Filter by pipeline stage, tags, etc.

ACT Farm Inbox:
- All emails to/from bookings@actfarm.org.au
- Organized by contact
- Filter by pipeline stage, tags, etc.
```

### Master Account View

The ACT Hub (master account) can see all sub-account activity:

```
Settings → Sub-Accounts → View Activity
- See all emails across all sub-accounts
- Filter by project
- Generate reports across entire ecosystem
```

### Team Member Access

Assign team members to specific sub-accounts:

```
Team Member: Sarah
Access:
- ✅ The Harvest (full access)
- ✅ ACT Farm (view only)
- ❌ Empathy Ledger (no access)

Result:
- Sarah sees The Harvest inbox in her GHL dashboard
- Can respond to inquiries, move contacts in pipeline
- Gets notifications for new emails
```

---

## 🔄 Integration with Existing Systems

### Next.js API → GHL Email

When user submits form:

```typescript
// /app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { email, name, phone, message, inquiryType } = await request.json();

  // Create contact in GHL
  const contact = await fetch('https://services.leadconnectorhq.com/contacts/', {
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
      source: 'The Harvest Website',
      tags: ['the-harvest', inquiryType],
      customFields: { message },
    }),
  });

  const contactData = await contact.json();

  // GHL workflow automatically sends email based on tags/pipeline
  // No need to call email API separately!

  return NextResponse.json({
    success: true,
    contactId: contactData.contact.id
  });
}
```

**Key Point**: GHL workflows handle email sending automatically. No need for separate email API calls.

### Optional: Transactional Emails via Resend

For **non-CRM** emails (password resets, system notifications), you can still use Resend:

```typescript
// System email (not customer communication)
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Password reset email (goes directly to user, no CRM tracking needed)
await resend.emails.send({
  from: 'system@theharvest.org.au',
  to: user.email,
  subject: 'Password Reset',
  html: '<p>Click here to reset your password...</p>',
});
```

**Rule of Thumb**:
- **Customer/lead communications** → GHL Email (tracked, automated)
- **System/transactional emails** → Resend (one-off, no tracking needed)

---

## 📊 Email Domains Setup Checklist

| Domain | GHL Sub-Account | Email Address | DNS Status | GHL Integration | Status |
|--------|-----------------|---------------|------------|-----------------|--------|
| `theharvest.org.au` | The Harvest | `hello@theharvest.org.au` | ❓ To Do | ❓ To Do | ⏳ Pending |
| `actfarm.org.au` | ACT Farm | `bookings@actfarm.org.au` | ❓ To Do | ❓ To Do | ⏳ Pending |
| `empathyledger.com` | Empathy Ledger | `stories@empathyledger.com` | ❓ To Do | ❓ To Do | ⏳ Pending |
| `justicehub.org.au` | JusticeHub | `support@justicehub.org.au` | ❓ To Do | ❓ To Do | ⏳ Pending |
| `goodsoncountry.com` | Goods on Country | `hello@goodsoncountry.com` | ❓ To Do | ❓ To Do | ⏳ Pending |
| `act.place` | ACT Hub (Master) | `hello@act.place` | ❓ To Do | ❓ To Do | ⏳ Pending |

---

## 🎯 Implementation Timeline

### Week 1: GHL Account Setup
- [x] Create 6 GHL accounts (1 master + 5 sub-accounts)
- [ ] Generate API keys for all accounts
- [ ] Populate .env vault with credentials

### Week 2: Email Domain Configuration
- [ ] Connect all 6 domains to respective GHL sub-accounts
- [ ] Add DNS records (SPF, DKIM, DMARC) for all domains
- [ ] Verify domain authentication in GHL
- [ ] Test email sending from each sub-account

### Week 3: Template & Workflow Setup
- [ ] Create email templates for each project (5-10 templates per project)
- [ ] Build welcome/confirmation workflows
- [ ] Set up pipeline automation (email triggers pipeline movements)
- [ ] Test end-to-end flow: form → contact → email → reply → pipeline

### Week 4: Team Training & Go-Live
- [ ] Train team on GHL inbox management
- [ ] Set up mobile app access for team members
- [ ] Create response templates for common inquiries
- [ ] Go live with first project (The Harvest)
- [ ] Monitor deliverability, adjust as needed

---

## 💡 Key Benefits of This Approach

### Centralized Communications
- ✅ All emails visible in GHL dashboard
- ✅ Full conversation history per contact
- ✅ No separate email inbox to check
- ✅ Mobile app access to all communications

### Automation & Efficiency
- ✅ Email sequences triggered automatically
- ✅ Pipeline movements based on email activity
- ✅ Templates for common responses
- ✅ Team collaboration on complex inquiries

### Data & Insights
- ✅ Email open rates tracked
- ✅ Link clicks tracked
- ✅ Conversion attribution (which email led to booking)
- ✅ A/B testing email templates

### Scalability
- ✅ Add new team members easily
- ✅ Create new email sequences without code changes
- ✅ Duplicate workflows across projects
- ✅ Report on all communications ecosystem-wide

---

## 🔐 Security & Compliance

### Email Authentication
- SPF, DKIM, DMARC all configured via GHL
- Reduces spam risk
- Protects domain reputation

### Data Privacy
- All emails stored in GHL (encrypted)
- GDPR-compliant contact deletion
- Audit trail of all communications

### Access Control
- Role-based permissions per sub-account
- Team members only see assigned projects
- Two-factor authentication required

---

## 🧪 Testing Your Setup

### Test 1: Outbound Email (Each Project)

```bash
# Trigger test workflow in GHL for each sub-account
1. Manually create test contact in The Harvest sub-account
2. Add contact to "Volunteer Pipeline"
3. Verify welcome email sent FROM hello@theharvest.org.au
4. Check email arrives in test inbox (not spam)
5. Verify FROM address shows "The Harvest <hello@theharvest.org.au>"
6. Repeat for all 6 sub-accounts
```

### Test 2: Inbound Email (Reply Handling)

```bash
# Test reply flow for each project
1. Send test email from GHL
2. Reply to that email from external email client
3. Verify reply appears in GHL inbox
4. Verify reply is linked to contact record
5. Verify pipeline automation triggered (if configured)
6. Respond from GHL, verify external recipient receives it
```

### Test 3: Pipeline Automation

```bash
# Test email-triggered pipeline movements
1. Create test contact in "New Lead" stage
2. Send automated email via workflow
3. Wait for email to be opened (use email tracking link)
4. Verify contact moves to "Email Opened" stage
5. Reply to email from external account
6. Verify contact moves to "Replied" stage
```

---

## 🔍 Troubleshooting

### Problem: Emails going to spam

**Solution**:
```bash
1. Verify DNS records in domain provider:
   dig theharvest.org.au TXT
   dig k1._domainkey.theharvest.org.au TXT
   dig _dmarc.theharvest.org.au TXT

2. Check GHL domain verification status:
   Settings → Email Services → Domain Status (must show "Verified")

3. Warm up domain (send gradually increasing volume):
   - Day 1-3: Send 50 emails/day
   - Day 4-7: Send 200 emails/day
   - Day 8-14: Send 500 emails/day
   - Day 15+: Full volume

4. Use mail-tester.com to check spam score
```

### Problem: Replies not appearing in GHL inbox

**Solution**:
```bash
1. Check email headers of sent email (View Original)
   - Verify Reply-To header points to GHL inbox
   - GHL inbox address: <unique-id>@msgsndr.com

2. Verify inbound email settings in GHL:
   Settings → Email Services → Inbound Settings (must be enabled)

3. Check spam folder in GHL inbox

4. Contact GHL support to verify inbound routing
```

### Problem: Email templates not sending

**Solution**:
```bash
1. Check workflow trigger conditions
   - Verify contact meets trigger criteria
   - Check workflow is "Active" (not paused)

2. Check email template status
   - Settings → Templates → Email Templates
   - Verify template is "Active"

3. Check contact's email settings
   - Ensure contact has valid email address
   - Check "Do Not Email" flag (must be unchecked)

4. Review workflow logs:
   Automation → Workflows → [Workflow Name] → Logs
```

---

## 📈 Monitoring & Optimization

### Email Deliverability Dashboard

GHL provides built-in analytics:

```
Reports → Email Performance
- Open rate (target: >25%)
- Click rate (target: >3%)
- Bounce rate (target: <2%)
- Unsubscribe rate (target: <0.5%)
```

### Pipeline Performance

Track how email impacts pipeline velocity:

```
Reports → Pipeline Analytics
- Average time in each stage
- Conversion rate per stage
- Drop-off points
- Revenue per pipeline
```

### A/B Testing

Test email subject lines, content, send times:

```
Campaigns → Create A/B Test
- Test subject lines (which gets more opens?)
- Test CTAs (which gets more clicks?)
- Test send times (morning vs evening?)
```

---

## 🎯 Success Criteria

### Week 1 Post-Launch
- [ ] All 6 domains verified in GHL
- [ ] Test emails sending successfully
- [ ] No spam folder issues
- [ ] Team comfortable with GHL inbox

### Month 1 Post-Launch
- [ ] >95% email deliverability
- [ ] >20% email open rate
- [ ] <3% bounce rate
- [ ] All workflows triggering correctly

### Quarter 1 Post-Launch
- [ ] 100+ contacts per project receiving automated emails
- [ ] Pipeline automation reducing manual work by 50%
- [ ] Response time <24 hours for all inquiries
- [ ] Measurable conversion improvement from email sequences

---

## 💰 Cost Comparison

### GHL Native Email
- **Cost**: Included in GHL subscription ($297/month)
- **Email limit**: 25,000/month included
- **Additional emails**: $10 per 10,000 emails
- **Total**: ~$297/month for 6 accounts + email

### Alternative (Resend + Forwarding)
- **Resend**: $20/month per project = $120/month
- **Email forwarding**: $0 (Cloudflare free) or $6/domain = $36/month
- **GHL**: $297/month (but not using email feature)
- **Total**: ~$417-453/month

**Savings**: $120-156/month by using GHL native email

**Plus**:
- Centralized communications (priceless)
- Automated pipeline movements (massive time savings)
- Full conversation history (better customer service)

---

## ✅ Recommendation

**Use GHL native email for all customer communications.**

**Why**:
1. Simplifies architecture (one system for CRM + email)
2. Enables powerful automation (email triggers pipeline movements)
3. Cost-effective (included in GHL subscription)
4. Better team collaboration (all comms in one dashboard)
5. Improved customer experience (full conversation history)

**Optional: Keep Resend for**:
- System/transactional emails (password resets, etc.)
- Bulk announcements (if need >25k emails/month)
- Emails that don't need CRM tracking

---

**Next Steps**:
1. Create 6 GHL accounts ← **START HERE**
2. Connect domains to GHL
3. Add DNS records
4. Create email templates
5. Build automation workflows
6. Train team on GHL inbox
7. Go live!

---

**Last Updated**: December 24, 2025
**Maintained By**: ACT Development Team
**Replaces**: EMAIL_DOMAIN_STRATEGY_EXISTING.md
