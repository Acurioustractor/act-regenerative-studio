# Invoice Workflow (Xero + GHL)

## Purpose
Get paid faster with automated invoice creation, sending, and follow-up.

**Goal**: Invoice created → Sent → Paid within 14 days (industry average: 30-45 days).

---

## The Problem

**Manual invoicing sucks**:
- Takes 20 minutes to create invoice (finding client info, line items, etc.)
- Manually emailing PDFs (easy to forget)
- Chasing payments manually (awkward, time-consuming)
- Hard to track what's outstanding

**Result**: Late payments, cashflow stress, unpaid invoices.

---

## The Solution (Xero + GHL)

**Automated Process**:
1. Trigger: Job completed / milestone reached / recurring date
2. Create invoice in Xero (template or recurring) → 2 minutes
3. Xero auto-emails invoice to client → automatic
4. GHL tracks in pipeline (optional but powerful) → automatic
5. Auto-follow-up at 7, 14, 30 days → automatic
6. Payment received → Xero auto-reconciles → automatic

**Time**: 2-3 minutes to create, rest is automatic
**Result**: Paid faster, less chasing, better cashflow

---

## Invoice Types at ACT

### 1. Recurring Invoices (Predictable Revenue)

**Examples**:
- **JusticeHub**: NDIS monthly billing
- **The Harvest**: CSA memberships (monthly/quarterly)
- **Empathy Ledger**: Partnership retainers
- **BCV**: Residency deposits (when booked)

**Setup Once** → Xero auto-sends monthly/quarterly

### 2. Project-Based Invoices

**Examples**:
- **Workshops**: After event completion
- **Consulting**: After delivery
- **Grants**: Milestone-based billing
- **Art Commissions**: Upon completion or 50/50 split

**Created per project** → Manual but templated

### 3. Prepaid / Deposits

**Examples**:
- **BCV Residencies**: 50% deposit on booking
- **Workshops**: Full payment upfront
- **CSA Shares**: Seasonal prepayment

**Created on confirmation** → Triggers prepayment terms

---

## Step-by-Step Workflow

### Step 1: Create Invoice in Xero (2 minutes)

**Option A: From Template (Fastest)**
1. Open Xero → Invoices → New Invoice
2. Select client (start typing name)
3. Choose invoice template:
   - "Workshop Standard"
   - "Residency Deposit"
   - "NDIS Monthly"
   - "Consulting Day Rate"
4. Adjust dates, line items if needed
5. Check ABN, payment terms (usually 7-14 days)
6. Save + Approve

**Option B: Recurring Invoice (Set and Forget)**
1. Xero → Business → Repeating Invoices
2. Create new repeating invoice
3. Set frequency (weekly/monthly/quarterly)
4. Xero auto-creates and sends on schedule
5. Done!

**Option C: From GHL Opportunity (Future Integration)**
1. GHL opportunity reaches "Won" stage
2. Zapier/Make trigger creates Xero invoice
3. Pre-fills client info from GHL
4. You just review + approve
(Not set up yet, but on roadmap)

---

### Step 2: Send Invoice (Automatic or Manual)

**Automatic** (Recommended):
- Xero auto-emails invoice when you click "Approve + Send"
- Uses your Xero email template (customize once)
- Attaches PDF invoice
- Includes online payment link (if Xero Payments enabled)

**Manual** (If needed):
- Export PDF from Xero
- Attach to email manually
- Send via Gmail/Outlook
(Only use if client requested special delivery)

---

### Step 3: Payment Terms & Options

**Standard Terms**:
- **7 days**: For deposits, upfront payments
- **14 days**: Standard for most invoices
- **30 days**: For government/institutional clients (required)

**Payment Methods**:
1. **Bank Transfer** (EFT)
   - Include BSB, Account Number on invoice
   - Reference: Invoice number
   - Most common method

2. **Xero Payments** (Online)
   - Client clicks link in email → pays via card
   - Auto-reconciles in Xero
   - Fee: ~1.75% + $0.25 per transaction
   - Worth it for speed + convenience

3. **Stripe / Square** (If set up)
   - For online bookings (BCV residencies, workshops)
   - Auto-creates invoice in Xero (via integration)

4. **NDIS Portal** (JusticeHub specific)
   - Invoice through NDIS portal
   - Different process (see JusticeHub wiki)

---

### Step 4: Automated Follow-Up

**Xero Reminders** (Built-in):
- Day 0: Invoice sent
- Day 7: Gentle reminder (if unpaid)
- Day 14: Friendly follow-up
- Day 30: Firm reminder
- Day 45: Final notice

**Customize templates**:
- Xero → Settings → Invoice Reminders
- Edit email text for each stage
- Keep friendly but firm

**GHL Follow-Up** (Optional but Powerful):
If you log invoices in GHL:
- Pipeline stage: "Invoice Sent" → "Payment Received"
- GHL workflow triggers:
  - Day 7: SMS reminder
  - Day 14: Email + SMS
  - Day 30: Phone call task created
- Tracks all communication history

---

### Step 5: Payment Received

**When client pays**:
1. Bank transaction appears in Xero Banking
2. Xero auto-matches to invoice (usually)
3. Invoice marked "Paid"
4. Receipt auto-emailed to client
5. Done!

**If manual match needed**:
- Xero → Banking → Find transaction
- Click "Find & Match"
- Select invoice
- Reconcile

**If GHL tracking**:
- Move opportunity to "Payment Received"
- GHL records payment date
- Use for reporting (days to payment)

---

## Invoice Templates

### Workshop/Event Invoice

```
Invoice #: [AUTO]
Date: [EVENT_DATE + 1 day]
Due: [7 days from invoice date]

To: [CLIENT_NAME]
ABN: [IF_BUSINESS]

Description                           Qty    Rate      Amount
─────────────────────────────────────────────────────────────
[WORKSHOP_NAME]                        1    $[PRICE]  $[PRICE]
[DATE], [LOCATION]

                                            Subtotal:  $[PRICE]
                                            GST 10%:   $[GST]
                                            TOTAL:     $[TOTAL]

Payment Terms: 7 days
Payment Methods:
- Bank Transfer: BSB [XXX-XXX] Account [XXXXXXX]
- Online: [XERO_PAYMENT_LINK]

Reference: [INVOICE_NUMBER]
```

### BCV Residency Deposit

```
Invoice #: [AUTO]
Date: [BOOKING_DATE]
Due: 7 days (to confirm booking)

To: [RESIDENT_NAME]
Email: [EMAIL]

Description                           Qty    Rate      Amount
─────────────────────────────────────────────────────────────
R&D Residency - Deposit                1    $[50%]    $[50%]
[DATES], Black Cockatoo Valley

Booking: [ACCOMMODATION_TYPE]
Check-in: [DATE]
Check-out: [DATE]
Nights: [N]

                                            Subtotal:  $[AMT]
                                            GST 10%:   $[GST]
                                            TOTAL:     $[TOTAL]

Payment Terms: 7 days to secure booking
Remaining Balance ($[50%]) due 14 days before arrival

Payment Methods:
- Bank Transfer: BSB [XXX-XXX] Account [XXXXXXX]
- Online: [XERO_PAYMENT_LINK]

Cancellation Policy: [LINK_TO_TERMS]
```

### Recurring - NDIS Monthly (JusticeHub)

```
Invoice #: [AUTO]
Date: [LAST_DAY_OF_MONTH]
Due: 30 days (NDIS standard)

To: NDIS - [PARTICIPANT_NAME]
NDIS Number: [NUMBER]

Description                           Qty    Rate      Amount
─────────────────────────────────────────────────────────────
Support Coordination                  [HRS]  $[RATE]   $[AMT]
[MONTH] [YEAR]

Service Dates: [START] - [END]

                                            Subtotal:  $[AMT]
                                            GST-Free
                                            TOTAL:     $[AMT]

Payment Terms: 30 days
Submit to: NDIS Portal

Reference: [INVOICE_NUMBER]
```

---

## Tracking Outstanding Invoices

### Xero Dashboard
- Login to Xero
- Dashboard shows: "Overdue Invoices" + "Due Soon"
- Click to see details
- Export to CSV for analysis

### Weekly Review (10 minutes)
**Every Monday**:
1. Open Xero → Reports → Aged Receivables
2. Check "Current" (due soon), "1-30 days" (overdue), "30+" (very overdue)
3. For each overdue:
   - Did reminder already send?
   - Need personal follow-up?
   - Create task in GHL if needed
4. Follow up on 30+ day invoices (phone call)

### Monthly Cash Flow Forecast
- Xero → Business → Cash Coding
- See expected income (from outstanding invoices)
- Plan expenses based on when you'll get paid
- Identify cash flow gaps (need to chase invoices)

---

## GHL Integration (Optional but Recommended)

### Why Track Invoices in GHL?

**Benefits**:
1. **Full Context**: See invoice alongside all client communication
2. **Automated Follow-Up**: SMS + email sequences
3. **Reporting**: Average days to payment, conversion rates
4. **Team Visibility**: Everyone sees invoice status
5. **Task Creation**: Auto-create "Chase payment" tasks

### How to Set Up

**Option 1: Manual (Simple)**
1. Create invoice in Xero (as normal)
2. When sent, add note in GHL opportunity:
   - "Invoice #1234 sent - $X, due [DATE]"
3. Move opportunity to "Awaiting Payment" stage
4. When paid, move to "Complete"

**Option 2: Automated (via Zapier/Make - Future)**
1. Xero creates invoice → Zapier detects
2. Zapier updates GHL opportunity
3. Adds custom field: Invoice # + Amount + Due Date
4. Moves to "Awaiting Payment" stage
5. When Xero marks paid → Zapier moves GHL to "Complete"

(Not set up yet, but on [[integrations/xero-ghl-sync]] roadmap)

---

## Getting Paid Faster (Tactics)

### 1. Clear Payment Instructions
- **Always** include BSB + Account + Reference
- Offer online payment link (worth the 1.75% fee for speed)
- Make it brain-dead easy to pay

### 2. Send Immediately
- Don't wait days to invoice after job done
- Invoice same day or next day
- Delay = they forget = late payment

### 3. Follow-Up Early
- Day 7 reminder (before due date)
- Day 14 (on due date if unpaid)
- Don't wait until 30 days to start chasing

### 4. Personal Touch for Large Invoices
- $2K+ invoices: Send email + call to confirm received
- "Just wanted to check you got the invoice, any questions?"
- Builds relationship + catches issues early

### 5. Incentives
- **Early Payment Discount**: "2% discount if paid within 7 days"
- **Late Fee**: "1.5% per month on overdue" (usually not enforced, just motivator)

### 6. Partial Payments
- Large invoice? Offer payment plan
- 50% upfront, 50% on completion
- Easier for client, you get cash sooner

---

## Common Issues & Fixes

### Client Says "Never Received Invoice"

**Fix**:
1. Check Xero "Invoice History" (was it sent?)
2. Resend from Xero (goes to same email)
3. If still not received:
   - Check email address is correct
   - Try alternate email (cc'd contact)
   - Download PDF, send manually via Gmail

### Invoice Has Wrong Details

**Fix**:
1. **Before client paid**: Edit invoice in Xero, re-send
2. **After client paid**: Can't edit
   - Create "Credit Note" to cancel
   - Create new invoice with correct details
   - Explain to client

### Client Disputes Amount

**Fix**:
1. Pull up original quote/agreement (GHL, email, contract)
2. If you're right: Show evidence, politely request payment
3. If you're wrong: Issue credit note, apologize, correct invoice
4. If unclear: Meet in middle (partial credit)

### Consistent Late Payer

**Fix**:
1. Switch to prepayment terms ("50% deposit required")
2. Or stop working with them (if small client, not worth stress)
3. Or build relationship, understand their payment cycle (e.g., monthly)

---

## Metrics to Track

### Average Days to Payment
- Goal: <20 days
- Industry average: 30-45 days
- Track monthly, identify trends

### % Paid on Time
- Goal: >80% within terms
- Red flag if <50%

### Outstanding Invoices (Total $)
- Goal: <1 month of revenue
- If >2 months, cashflow risk

### Invoice-to-Payment Conversion
- Goal: 100% (all invoices eventually paid)
- If <95%, investigate (bad clients? unclear terms?)

**Where to find**:
- Xero → Reports → Aged Receivables
- Export to Google Sheets monthly
- Track over time

---

## Gamification (Make It Less Boring)

### Payment Speedrun 🏃
- Invoice created to payment received in <7 days
- Personal best: [X] days

### Zero Overdue Badge 🎯
- End of month with 0 invoices >30 days overdue
- Streak: [X] months in a row

### Cashflow Champion 💰
- All invoices paid within terms (14 days)
- Monthly achievement

---

## Related Pages
- [[finance/receipt-workflow]] - Processing expenses (Dext + Xero)
- [[finance/monthly-rhythm]] - Month-end close process
- [[finance/cashflow-forecast]] - Planning future income
- [[processes/ghl-workflows]] - Client pipeline management
- [[integrations/xero-ghl-sync]] - Automate invoice tracking

---

**Last Updated**: 2025-12-25
**Owner**: Finance/Bookkeeper + Ben
**Review Frequency**: Quarterly
