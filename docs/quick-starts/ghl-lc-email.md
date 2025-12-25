# Quick Start: GHL LC Email Setup

**5-Minute Guide** to get your first domain sending/receiving email through GHL.

---

## 📋 Prerequisites

- [ ] GHL sub-account created (e.g., "The Harvest")
- [ ] Access to domain DNS settings (Cloudflare, etc.)
- [ ] Domain you want to configure (e.g., `theharvest.org.au`)

---

## 🚀 Setup in 7 Steps

### 1. Log into GHL Sub-Account

```
1. Go to https://app.gohighlevel.com/
2. Switch to sub-account (top-right dropdown)
   Select: "The Harvest"
```

### 2. Access LC Email

```
1. Click Settings (left sidebar)
2. Click Email Services
3. Click LC Email tab
4. Click "+ Add Domain" button
```

### 3. Enter Your Domain

```
1. Domain field: theharvest.org.au
2. Click "Add Domain"
3. GHL shows DNS records page
```

### 4. Copy DNS Records

GHL will show 5 records. **Screenshot this or keep window open.**

Example (yours will be different):
```
SPF (TXT):
  Host: @
  Value: v=spf1 include:_spf.leadconnector.io ~all

DKIM (CNAME):
  Host: lc1._domainkey
  Value: lc1._domainkey.leadconnector.io

DMARC (TXT):
  Host: _dmarc
  Value: v=DMARC1; p=none; rua=mailto:hello@theharvest.org.au

MX #1:
  Host: @
  Priority: 10
  Value: mx1.leadconnector.io

MX #2:
  Host: @
  Priority: 20
  Value: mx2.leadconnector.io
```

### 5. Add DNS Records to Cloudflare

```
1. Log into Cloudflare
2. Select domain: theharvest.org.au
3. Go to DNS → Records
4. Add each record exactly as shown by GHL

For each record:
- Click "+ Add record"
- Select type (TXT, CNAME, or MX)
- Copy values from GHL
- Click Save

⚠️ For CNAME (DKIM): Set proxy to "DNS only" (gray cloud)
⚠️ Remove any existing MX records (Gmail, Outlook, etc.)
```

### 6. Verify Domain in GHL

```
1. Wait 15-30 minutes
2. Go back to GHL → Settings → Email Services → LC Email
3. Find domain in list
4. Click "Verify"
5. Status changes to "Verified" ✅
```

**If fails**: Wait longer (up to 24 hours), or check DNS records for typos.

### 7. Test Email

```
Send test email:
1. GHL → Conversations → New Message → Email
2. To: your-personal-email@gmail.com
3. Subject: Test
4. Body: Testing LC Email
5. Click Send
6. Check your email (not spam)

Receive test email:
1. From your personal email, reply to test
2. Check GHL → Conversations
3. Reply should appear and link to contact
```

---

## ✅ Done!

Your domain is now:
- ✅ Sending email FROM your domain (via GHL)
- ✅ Receiving email TO your domain (in GHL inbox)
- ✅ Automatically linking emails to contacts
- ✅ Ready for workflows and automation

---

## 🔁 Repeat for Other Domains

Now that you've done it once, repeat steps 1-7 for:
- [ ] actfarm.org.au (ACT Farm sub-account)
- [ ] empathyledger.com (Empathy Ledger sub-account)
- [ ] justicehub.org.au (JusticeHub sub-account)
- [ ] goodsoncountry.com (Goods on Country sub-account)
- [ ] act.place (ACT Hub master account)

**Time per domain**: 15-20 minutes
**Total time for all 6**: 1.5-2 hours

---

## 📚 Next Steps

After domain is verified:

1. **Create Email Templates**
   - GHL → Settings → Templates → Email Templates
   - Create 5-10 templates for common scenarios

2. **Build Automation Workflows**
   - GHL → Automation → Workflows
   - Create welcome email workflow

3. **Update Website Forms**
   - Connect forms to GHL API
   - Workflows automatically send emails

4. **Train Team**
   - Show team how to use GHL inbox
   - Assign team members to conversations

---

## 🆘 Need Help?

- **Detailed Guide**: [GHL_LC_EMAIL_SETUP.md](./GHL_LC_EMAIL_SETUP.md)
- **Email Strategy**: [EMAIL_STRATEGY_GHL_NATIVE.md](./EMAIL_STRATEGY_GHL_NATIVE.md)
- **Integration Summary**: [GHL_LC_EMAIL_INTEGRATION_SUMMARY.md](./GHL_LC_EMAIL_INTEGRATION_SUMMARY.md)
- **GHL Support**: https://support.gohighlevel.com/

---

**Last Updated**: December 24, 2025
