# GHL LC Email Setup Guide

**Date**: December 24, 2025
**Purpose**: Step-by-step guide to configure LC Email for all 6 ACT domains

---

## 🎯 What is LC Email?

**LC Email** (LeadConnector Email) is GoHighLevel's native email service that:
- Sends and receives email through your custom domain
- Automatically links all emails to contact records in GHL
- Enables pipeline automation based on email activity
- Provides unified inbox for all team communications
- Included in your GHL subscription (no extra cost)

---

## 📋 Prerequisites

Before starting, ensure you have:
- [x] 6 GHL accounts created (1 master + 5 sub-accounts)
- [x] Access to DNS settings for all 6 domains
- [ ] List of email addresses you want to use per domain

---

## 🚀 Setup Process

### Step 1: Access Email Services in GHL

For **each sub-account**, repeat this process:

```
1. Log into https://app.gohighlevel.com/
2. Switch to sub-account (top-right dropdown)
   Example: Switch to "The Harvest" sub-account
3. Click Settings (left sidebar)
4. Click Email Services
5. Click LC Email tab
```

### Step 2: Add Your Domain

```
1. Click "+ Add Domain" button
2. Enter your domain name (without www or http)
   Example: theharvest.org.au
3. Click "Add Domain"
4. GHL shows DNS records page
```

### Step 3: Copy DNS Records

GHL will display 4-5 DNS records. **Screenshot this page** or keep it open.

Example records shown (yours will be different):

```
SPF Record:
Type: TXT
Host: @
Value: v=spf1 include:_spf.leadconnector.io ~all

DKIM Record:
Type: CNAME
Host: lc1._domainkey
Value: lc1._domainkey.leadconnector.io

DMARC Record:
Type: TXT
Host: _dmarc
Value: v=DMARC1; p=none; rua=mailto:hello@theharvest.org.au

MX Record 1:
Type: MX
Host: @
Priority: 10
Value: mx1.leadconnector.io

MX Record 2:
Type: MX
Host: @
Priority: 20
Value: mx2.leadconnector.io
```

### Step 4: Add DNS Records to Your Domain Provider

#### If using Cloudflare:

```
1. Log into Cloudflare
2. Select domain: theharvest.org.au
3. Go to DNS → Records
4. Add each record:

   Add SPF Record:
   - Type: TXT
   - Name: @ (or leave blank)
   - Content: v=spf1 include:_spf.leadconnector.io ~all
   - TTL: Auto
   - Click Save

   Add DKIM Record:
   - Type: CNAME
   - Name: lc1._domainkey
   - Target: lc1._domainkey.leadconnector.io
   - TTL: Auto
   - Proxy status: DNS only (gray cloud)
   - Click Save

   Add DMARC Record:
   - Type: TXT
   - Name: _dmarc
   - Content: v=DMARC1; p=none; rua=mailto:hello@theharvest.org.au
   - TTL: Auto
   - Click Save

   Add MX Records:
   - Type: MX
   - Name: @ (or leave blank)
   - Mail server: mx1.leadconnector.io
   - Priority: 10
   - TTL: Auto
   - Click Save

   - Type: MX
   - Name: @ (or leave blank)
   - Mail server: mx2.leadconnector.io
   - Priority: 20
   - TTL: Auto
   - Click Save
```

#### If using another DNS provider:

Similar process - add the exact records GHL provided to your DNS settings.

**⚠️ CRITICAL**:
- Remove any existing MX records pointing to other email services (Gmail, Outlook, etc.)
- LC Email needs to be the only email handler for the domain
- Backup any existing MX records before deleting (in case you need to revert)

### Step 5: Verify Domain in GHL

```
1. Wait 15-30 minutes for DNS propagation
2. Go back to GHL → Settings → Email Services → LC Email
3. Find your domain in the list
4. Click "Verify" button
5. GHL checks DNS records
6. Status should change to "Verified" (green checkmark)
```

**If verification fails**:
- Wait longer (DNS can take up to 24 hours)
- Double-check DNS records match exactly (case-sensitive)
- Use https://dnschecker.org to verify records propagated globally
- Check for typos in DNS entries

### Step 6: Configure Sending Address

```
1. In GHL → Settings → Email Services → LC Email
2. Click on verified domain
3. Set "Default From Name": The Harvest
4. Set "Default From Email": hello@theharvest.org.au
5. Click Save
```

### Step 7: Test Email Sending

```
1. In GHL → Conversations
2. Click "New Message"
3. Select "Email"
4. To: your-personal-email@gmail.com (use your own email)
5. Subject: Test from The Harvest
6. Body: This is a test email from LC Email
7. Click Send
8. Check your personal email
9. Verify:
   - Email arrived (not in spam)
   - FROM shows: The Harvest <hello@theharvest.org.au>
   - Reply button works
```

### Step 8: Test Email Receiving

```
1. From your personal email, send email to: hello@theharvest.org.au
2. Wait 1-2 minutes
3. In GHL → Conversations
4. Check for new email
5. Verify:
   - Email appears in GHL inbox
   - Automatically creates contact (if new sender)
   - Reply from GHL works
```

---

## 🔄 Repeat for All 6 Domains

Complete Steps 1-8 for each sub-account:

### The Harvest (Sub-Account 1)
- **Domain**: theharvest.org.au
- **Email**: hello@theharvest.org.au
- **Status**: ⏳ Pending

### ACT Farm (Sub-Account 2)
- **Domain**: actfarm.org.au
- **Email**: bookings@actfarm.org.au
- **Status**: ⏳ Pending

### Empathy Ledger (Sub-Account 3)
- **Domain**: empathyledger.com
- **Email**: stories@empathyledger.com
- **Status**: ⏳ Pending

### JusticeHub (Sub-Account 4)
- **Domain**: justicehub.org.au
- **Email**: support@justicehub.org.au
- **Status**: ⏳ Pending

### Goods on Country (Sub-Account 5)
- **Domain**: goodsoncountry.com
- **Email**: hello@goodsoncountry.com
- **Status**: ⏳ Pending

### ACT Hub (Master Account)
- **Domain**: act.place
- **Email**: hello@act.place
- **Status**: ⏳ Pending

---

## 🎨 Setting Up Email Signatures

For each sub-account, create a professional email signature:

```
1. GHL → Settings → Email Services → LC Email
2. Click "Email Signature"
3. Add signature HTML:

<div style="font-family: Arial, sans-serif; color: #333;">
  <p style="margin: 0;"><strong>The Harvest Team</strong></p>
  <p style="margin: 0; font-size: 12px; color: #666;">Community Hub & CSA</p>
  <p style="margin: 10px 0 0 0; font-size: 12px;">
    <a href="https://theharvest.org.au" style="color: #22c55e; text-decoration: none;">theharvest.org.au</a><br>
    <a href="mailto:hello@theharvest.org.au" style="color: #22c55e; text-decoration: none;">hello@theharvest.org.au</a>
  </p>
</div>

4. Click Save
5. Test signature by sending test email
```

Repeat for all 6 projects with appropriate branding.

---

## 📧 Creating Email Templates

Build reusable email templates for common scenarios:

### Example: Volunteer Application Confirmation (The Harvest)

```
1. GHL → Settings → Templates → Email Templates
2. Click "+ Create Template"
3. Fill in:
   - Name: Volunteer Application Confirmation
   - Subject: Welcome! Your volunteer application received
   - Body:
     Hi {{contact.first_name}},

     Thank you for your interest in volunteering at The Harvest!

     We've received your application and will review it within 2-3 business days.
     Our volunteer coordinator will reach out to schedule an orientation.

     In the meantime, learn more about our community programs:
     https://theharvest.org.au/get-involved

     Looking forward to connecting!

     The Harvest Team
     hello@theharvest.org.au

4. Click Save
```

**Create 5-10 templates per project** for:
- Welcome/confirmation emails
- Booking confirmations
- Follow-up reminders
- Event notifications
- General inquiry responses

---

## ⚙️ Setting Up Automated Workflows

Create workflows that automatically send emails based on triggers:

### Example: Volunteer Signup Workflow

```
1. GHL → Automation → Workflows
2. Click "+ Create Workflow"
3. Name: Volunteer Signup - Auto Confirmation
4. Trigger: Contact added to "Volunteer Pipeline"
5. Add Action: Send Email
   - Template: Volunteer Application Confirmation
   - From: hello@theharvest.org.au
6. Add Wait: 2 days
7. Add Condition: Contact has NOT replied
8. Add Action: Send Email
   - Template: Volunteer Follow-Up
   - From: hello@theharvest.org.au
9. Save & Activate workflow
```

---

## 🔍 Monitoring Email Deliverability

### Check Domain Health

```
1. GHL → Settings → Email Services → LC Email
2. View domain status:
   - Verified: ✅ (green) = Good
   - Pending: ⏳ (yellow) = Waiting for DNS
   - Failed: ❌ (red) = DNS issue

3. Check "Email Health Score"
   - >90% = Excellent
   - 70-90% = Good
   - <70% = Needs improvement
```

### Email Analytics

```
1. GHL → Reports → Email Performance
2. View metrics:
   - Sent: Total emails sent
   - Delivered: Successfully delivered
   - Opened: Recipients opened email
   - Clicked: Recipients clicked links
   - Bounced: Failed delivery
   - Unsubscribed: Opted out

3. Target benchmarks:
   - Delivery rate: >98%
   - Open rate: >25%
   - Click rate: >3%
   - Bounce rate: <2%
```

---

## ⚠️ Common Issues & Solutions

### Issue 1: Domain won't verify

**Solution**:
```
1. Wait 24 hours for DNS propagation
2. Use https://dnschecker.org to verify records:
   - Search: theharvest.org.au
   - Type: TXT
   - Look for SPF record globally

3. Check for typos in DNS entries
4. Ensure MX records point ONLY to leadconnector.io
5. Remove conflicting records (other email services)
6. Contact GHL support if still failing after 48 hours
```

### Issue 2: Emails going to spam

**Solution**:
```
1. Warm up domain gradually:
   - Week 1: Send 50 emails/day
   - Week 2: Send 200 emails/day
   - Week 3: Send 500 emails/day
   - Week 4+: Full volume

2. Maintain healthy sending practices:
   - Only email people who opted in
   - Include unsubscribe link
   - Use clear, honest subject lines
   - Avoid spam trigger words

3. Check spam score:
   - Use https://mail-tester.com
   - Send test email to their address
   - Review score & fix issues

4. Monitor engagement:
   - High open rates = good
   - High bounces/spam complaints = bad
```

### Issue 3: Replies not appearing in GHL

**Solution**:
```
1. Verify MX records are correct and active
2. Check GHL → Conversations → Settings
   - Ensure "Email to Conversations" is enabled
3. Check spam folder in GHL inbox
4. Send test reply from external email
5. Wait 5 minutes and refresh GHL
6. Contact GHL support if persistent
```

---

## ✅ Setup Completion Checklist

Use this to track progress across all 6 domains:

### The Harvest (theharvest.org.au)
- [ ] LC Email domain added in GHL
- [ ] DNS records added to domain provider
- [ ] Domain verified in GHL (green checkmark)
- [ ] Test email sent successfully
- [ ] Test reply received in GHL inbox
- [ ] Email signature configured
- [ ] 5+ email templates created
- [ ] 2+ workflows configured

### ACT Farm (actfarm.org.au)
- [ ] LC Email domain added in GHL
- [ ] DNS records added to domain provider
- [ ] Domain verified in GHL (green checkmark)
- [ ] Test email sent successfully
- [ ] Test reply received in GHL inbox
- [ ] Email signature configured
- [ ] 5+ email templates created
- [ ] 2+ workflows configured

### Empathy Ledger (empathyledger.com)
- [ ] LC Email domain added in GHL
- [ ] DNS records added to domain provider
- [ ] Domain verified in GHL (green checkmark)
- [ ] Test email sent successfully
- [ ] Test reply received in GHL inbox
- [ ] Email signature configured
- [ ] 5+ email templates created
- [ ] 2+ workflows configured

### JusticeHub (justicehub.org.au)
- [ ] LC Email domain added in GHL
- [ ] DNS records added to domain provider
- [ ] Domain verified in GHL (green checkmark)
- [ ] Test email sent successfully
- [ ] Test reply received in GHL inbox
- [ ] Email signature configured
- [ ] 5+ email templates created
- [ ] 2+ workflows configured

### Goods on Country (goodsoncountry.com)
- [ ] LC Email domain added in GHL
- [ ] DNS records added to domain provider
- [ ] Domain verified in GHL (green checkmark)
- [ ] Test email sent successfully
- [ ] Test reply received in GHL inbox
- [ ] Email signature configured
- [ ] 5+ email templates created
- [ ] 2+ workflows configured

### ACT Hub (act.place)
- [ ] LC Email domain added in GHL
- [ ] DNS records added to domain provider
- [ ] Domain verified in GHL (green checkmark)
- [ ] Test email sent successfully
- [ ] Test reply received in GHL inbox
- [ ] Email signature configured
- [ ] 5+ email templates created
- [ ] 2+ workflows configured

---

## 📅 Recommended Timeline

### Week 1: Domain Setup (Days 1-2)
- **Day 1**: Set up 3 domains (The Harvest, ACT Farm, Empathy Ledger)
- **Day 2**: Set up 3 domains (JusticeHub, Goods on Country, ACT Hub)
- **Total time**: 30-45 minutes per domain = 3-4 hours total

### Week 2: Template Creation (Days 3-5)
- **Day 3**: Create templates for The Harvest & ACT Farm
- **Day 4**: Create templates for Empathy Ledger & JusticeHub
- **Day 5**: Create templates for Goods on Country & ACT Hub
- **Total time**: 1 hour per project = 6 hours total

### Week 3: Workflow Automation (Days 6-8)
- **Day 6**: Build workflows for The Harvest & ACT Farm
- **Day 7**: Build workflows for Empathy Ledger & JusticeHub
- **Day 8**: Build workflows for Goods on Country & ACT Hub
- **Total time**: 1.5 hours per project = 9 hours total

### Week 4: Testing & Optimization (Days 9-10)
- **Day 9**: Test all 6 email flows end-to-end
- **Day 10**: Optimize templates, fix issues, train team
- **Total time**: 3-4 hours

**Total setup time**: ~20-24 hours spread over 2 weeks

---

## 🎯 Success Metrics

After setup is complete, track these metrics:

### Week 1 Post-Launch
- [ ] All 6 domains verified and sending
- [ ] >95% email delivery rate
- [ ] No spam folder issues
- [ ] All test emails working

### Month 1 Post-Launch
- [ ] >98% email delivery rate
- [ ] >20% average open rate
- [ ] <2% bounce rate
- [ ] All workflows triggering correctly

### Quarter 1 Post-Launch
- [ ] 1000+ emails sent across ecosystem
- [ ] 25%+ open rate
- [ ] Measurable pipeline velocity improvement
- [ ] Positive customer feedback on communication

---

## 📚 Resources

- **GHL LC Email Docs**: https://help.gohighlevel.com/support/solutions/articles/48001182921
- **DNS Checker**: https://dnschecker.org/
- **Email Spam Tester**: https://mail-tester.com/
- **GHL Support**: https://support.gohighlevel.com/

---

**Last Updated**: December 24, 2025
**Maintained By**: ACT Development Team
**Related**: [EMAIL_STRATEGY_GHL_NATIVE.md](./EMAIL_STRATEGY_GHL_NATIVE.md)
