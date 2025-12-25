# Receipt Workflow (Xero + Dext)

## Purpose
Make receipt processing painless using Dext's AI extraction + Xero's accounting automation.

**Goal**: Capture → Process → File in under 30 seconds per receipt.

---

## The Problem

**Manual Process** (The Old Way):
1. Collect physical receipts → 5 min
2. Find them when needed → 10 min (lost half the time)
3. Manually enter into Xero → 5 min per receipt
4. Scan/photo for records → 3 min
5. File physically → 2 min

**Time per receipt**: 25 minutes
**Monthly (20 receipts)**: 8+ hours of painful admin

---

## The Solution (Dext + Xero)

**Automated Process**:
1. Photo receipt with Dext app → 10 seconds
2. Dext AI extracts data → automatic
3. Review/approve in Dext → 15 seconds
4. Auto-publishes to Xero → automatic
5. Done!

**Time per receipt**: 30 seconds
**Monthly (20 receipts)**: 10 minutes

**Time saved**: 7.5 hours/month = 90 hours/year

---

## Step-by-Step Workflow

### 1. Capture Receipt (10 seconds)

**As soon as you get it** (don't wait, don't collect in wallet):

```
Option A: Mobile (Best for on-the-go)
1. Open Dext Prepare app
2. Tap camera icon
3. Snap photo (one or both sides if needed)
4. Done - put physical receipt in "To File" box

Option B: Email (Best for digital receipts)
1. Forward email to your Dext inbox
   (Usually: yourcompany@dext.com)
2. Delete email (it's in Dext now)
3. Done

Option C: Bulk Upload (Best for accumulated receipts)
1. Login to Dext web app
2. Drag & drop multiple photos/PDFs
3. Dext processes all in batch
```

**Pro Tips**:
- Capture IMMEDIATELY (gas station, office supply store, etc.)
- Don't let them pile up (30 seconds now vs 2 hours later)
- Physical receipts fade - photo within 24 hours

---

### 2. Dext AI Extraction (Automatic)

Dext AI reads the receipt and extracts:
- **Date**: Transaction date
- **Supplier**: Who you paid
- **Amount**: Total paid
- **Category**: Guesses based on supplier
- **Tax**: Automatically calculates GST

**This happens automatically** - you don't do anything.

**Time**: 30 seconds - 2 minutes (depending on Dext server load)

---

### 3. Review in Dext (15 seconds)

**Daily or Weekly** (set reminder):

1. Open Dext Prepare (web or app)
2. Go to "Items" → "Not Published"
3. For each receipt:
   - ✅ Check supplier name is correct
   - ✅ Check amount matches receipt
   - ✅ Check date is right
   - ✅ **Most Important**: Check category
     - Dext guesses category based on supplier
     - Fix if wrong (e.g., "Office Supplies" vs "Marketing")
   - Add note if needed (e.g., "Client meeting coffee")
   - Click "Publish to Xero"

**Common Fixes**:
- Supplier name: "BUNNINGS 1234" → "Bunnings Warehouse"
- Category: Wrong guess → Change to correct account
- Tax: Check GST is correct (usually automatic)

**Batch Review**: You can review 10-15 receipts in 3-5 minutes once you get fast.

---

### 4. Auto-Publish to Xero (Automatic)

When you click "Publish to Xero" in Dext:
- Receipt image attaches to Xero transaction
- Supplier, date, amount, category all transfer
- GST calculated and recorded
- Appears in Xero as expense
- Ready for reconciliation

**You don't touch Xero for receipt entry** - it's all automated.

---

### 5. Reconciliation (Monthly)

**Once per month** (usually with accountant/bookkeeper):

1. Open Xero → Banking
2. Match Dext-published expenses to bank transactions
3. Most will auto-match (Xero learns patterns)
4. Manual match any that don't auto-match
5. Reconcile bank account

**Time**: 30 minutes - 1 hour for month-end
(vs 4-8 hours manually entering receipts)

---

## Receipt Categories (Xero Chart of Accounts)

### Common ACT Categories

**Operations**:
- **Office Expenses**: Stationery, supplies, printing
- **Software & Subscriptions**: Xero, Dext, Notion, GHL, etc.
- **Utilities**: Internet, phone, electricity (office)
- **Rent/Lease**: Office space (if applicable)

**Land & Facilities** (BCV/Farm):
- **Property Expenses**: Maintenance, repairs
- **Utilities - Farm**: Water, electricity (farm)
- **Equipment**: Tools, machinery, farm equipment
- **Fuel**: Vehicle fuel, machinery fuel
- **Materials**: Building materials, fencing, etc.

**Programs** (JusticeHub, Harvest, etc.):
- **Program Delivery**: Direct costs for workshops, events
- **Catering**: Food for programs/events
- **Transport**: Participant transport, staff travel
- **Materials & Supplies**: Program-specific supplies

**Marketing & Communications**:
- **Advertising**: Online ads, print ads
- **Website & Hosting**: Domain, hosting, Vercel
- **Printing & Design**: Brochures, signage
- **Events & Sponsorship**: Community events, sponsorships

**Professional Services**:
- **Accounting**: Bookkeeper, accountant, tax prep
- **Legal**: Contracts, compliance, insurance
- **Consultants**: Specialist advice, project consultants

**Staff & Contractors**:
- **Wages & Salaries**: Employee pay
- **Contractor Payments**: Freelancers, consultants
- **Superannuation**: Employee super
- **Staff Training**: Professional development

**Financial**:
- **Bank Fees**: Transaction fees, account fees
- **Interest**: Loan interest, mortgage interest
- **Insurance**: Business insurance, property insurance

---

## Special Cases

### Mileage/Vehicle

**If tracking vehicle expenses**:
1. Use Dext app "Mileage" feature
2. Log trip: Date, start/end location, purpose, km
3. Dext calculates ATO-approved rate (currently $0.85/km)
4. Publishes to Xero as expense

**OR manually**:
- Track in spreadsheet
- Submit monthly to accountant

### Split Transactions

**If one receipt covers multiple categories**:
Example: Bunnings receipt with $50 office supplies + $150 farm materials

1. In Dext, add note: "Split: $50 Office, $150 Farm Materials"
2. Publish to Xero
3. In Xero, edit transaction → "Split"
4. Allocate amounts to different accounts

### Reimbursements

**If you paid personally, need reimbursement**:
1. Capture receipt in Dext (as normal)
2. In Dext, category: "Expense Claims"
3. Add note: "Reimbursement - Ben"
4. Publish to Xero
5. Xero creates expense claim
6. Process reimbursement (EFT to personal account)

### Missing Receipts

**If you lost the receipt but have bank transaction**:
1. In Xero, find bank transaction
2. Create "bill" manually with best-guess details
3. Attach note: "Receipt missing - from bank statement"
4. Continue (ATO allows reasonable reconstruction)

**Better**: Use Dext to avoid this entirely.

---

## Weekly Rhythm

### Monday Morning (5 minutes)
- Open Dext app
- Upload any weekend receipts (if you collected any)
- Review weekend digital receipts (emailed to Dext)

### Wednesday Midday (10 minutes)
- Review week's receipts in Dext
- Fix any extraction errors
- Publish all to Xero
- Clear "Not Published" queue

### Friday Arvo (5 minutes)
- Final sweep of week's receipts
- Check nothing stuck in "Processing"
- File physical receipts (if you haven't yet)

**Total weekly time**: 20 minutes
**Result**: Never behind, month-end is easy

---

## Monthly Close Process

### Week 4 (Month-End)

**Step 1: Final Receipt Capture** (Day 28-30)
- Upload any stragglers from last week of month
- Review Dext "Not Published" (should be nearly empty if weekly rhythm followed)
- Publish all to Xero

**Step 2: Reconcile Bank** (Day 1-3 of next month)
- Open Xero → Banking
- Reconcile all transactions
- Most Dext receipts will auto-match
- Manually match any cash transactions
- Mark any pending items

**Step 3: Review Reports** (Day 3-5)
- Run Xero "Profit & Loss" report
- Check for anomalies (huge spikes, weird categories)
- Fix any miscategorized items
- Add notes for accountant

**Step 4: Accountant Handoff** (Day 5-7)
- Send summary email to accountant
- Mention any unusual transactions
- Ask questions about anything uncertain
- Accountant finalizes month-end

**Total time**: 2-3 hours (vs 8-12 hours without Dext automation)

---

## Gamification (Make It Fun)

### Receipt Streak Badge 🔥
- **Bronze**: 7 days in a row (all receipts processed same day)
- **Silver**: 30 days in a row
- **Gold**: 90 days in a row (full quarter!)

### Flash Accountant ⚡
- Process 10 receipts in under 5 minutes
- Review, categorize, publish - speed run!

### Zero Inbox Hero 🦸
- End of month with "Not Published" queue = 0
- No stragglers, all caught up

### Accuracy Master 🎯
- 95%+ Dext extractions correct (minimal fixes needed)
- Means you're taking clear photos, choosing good suppliers

---

## Troubleshooting

### Dext Not Extracting Data

**Problem**: Photo uploaded but Dext shows "Processing" forever
**Fix**:
- Wait 2-5 minutes (sometimes slow)
- If still stuck, delete and re-upload
- Check photo is clear, readable
- Try scanning in better light

### Wrong Category Keeps Happening

**Problem**: Dext always categorizes "Bunnings" as "Office Supplies" (should be "Farm Materials")
**Fix**:
- In Dext, click supplier name
- "Edit Supplier Rules"
- Set default category to "Farm Materials"
- Dext learns and uses this going forward

### Receipt Not Matching in Xero

**Problem**: Published to Xero but can't find matching bank transaction
**Fix**:
- Check date (was it charged next day? Credit card vs debit?)
- Check amount (did bank charge fee? Foreign currency conversion?)
- Manual match if amounts are close (e.g., $99.90 receipt vs $100.00 bank)

### Duplicate Receipts

**Problem**: Uploaded same receipt twice (accidentally)
**Fix**:
- Dext usually detects duplicates (warns you)
- If not, delete one in Dext before publishing
- If already published to Xero, delete in Xero

---

## Integration with GHL

**Future Enhancement** (Optional):

If client/project-specific expenses (e.g., JusticeHub program supplies):
1. In Dext, add note with GHL contact/opportunity ID
2. Or tag with project name
3. Xero exports expenses by tag
4. Match to GHL project budget tracking
5. See profitability per project

**For now**: Just use category + notes in Dext (good enough).

---

## Cost

**Dext**: ~$40-60/month (depends on plan)
**Xero**: ~$60-90/month (depending on features)

**Total**: ~$100-150/month

**Time saved**: 90 hours/year
**Value**: $90 hours × $50/hr = $4,500/year

**ROI**: 2,500%+ (pays for itself 25x over)

---

## Related Pages
- [[finance/invoice-workflow]] - How to get paid faster
- [[finance/reconciliation]] - Monthly close process
- [[finance/monthly-rhythm]] - Full month-end checklist
- [[operations/weekly-checklist]] - When to review receipts

---

**Last Updated**: 2025-12-25
**Owner**: Finance/Bookkeeper + Ben
**Review Frequency**: Quarterly (check if process still optimal)
