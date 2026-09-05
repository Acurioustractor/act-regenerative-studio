# ACT Complete Knowledge Base - Part 3

**Sections 11-14**: Finance, Legal, Operations, Content Templates

This extends [ACT_COMPLETE_KNOWLEDGE_BASE.md](./ACT_COMPLETE_KNOWLEDGE_BASE.md) (Sections 1-6) and [ACT_COMPLETE_KNOWLEDGE_BASE_PART_2.md](./ACT_COMPLETE_KNOWLEDGE_BASE_PART_2.md) (Sections 7-10) with operational knowledge, templates, and procedures.

---

## 11. FINANCE & ACCOUNTING

### 11.1 Revenue Model (Real Talk)

**Purpose**: How ACT actually makes money (not vague "business model" - actual revenue sources).

#### Primary Revenue Streams

**JusticeHub** - Youth Justice Community Services
- **Revenue**: $15K-25K/month
- **Sources**: NDIS support coordination, government contracts
- **Billing**: Monthly (NDIS 30-day terms)
- **Status**: Production, 50+ active participants
- **Variability**: Medium (government contracts = stable)

**The Harvest** - Community Hub & CSA Programs
- **Revenue**: $5K-12K/month
- **Sources**: Memberships, CSA shares, workshops, event space rental
- **Billing**: Monthly (memberships), seasonal (CSA), per-event (workshops)
- **Status**: Production, 120+ members
- **Variability**: High (seasonal agriculture patterns)

**Black Cockatoo Valley (BCV)** - Conservation R&D Residencies
- **Revenue**: $2K-8K/month
- **Sources**: Artist/researcher residencies ($300-500/night), workshops
- **Billing**: 50% deposit on booking, 50% 14 days before arrival
- **Status**: Production, launched Dec 2025
- **Variability**: High (low volume, high value)

**Goods on Country** - Funding Commons Through Goods
- **Revenue**: TBD (launching)
- **Sources**: Product sales with 40% profit to source communities
- **Billing**: Per-transaction (e-commerce)
- **Status**: MVP, soft launch
- **Variability**: Unknown (new venture)

**Grants & Funding**
- **Revenue**: $20K-80K/year
- **Sources**: Arts grants, conservation grants, innovation grants
- **Billing**: Milestone-based (typically 3-6 month intervals)
- **Status**: Active applications across 5-8 funders
- **Variability**: Very high (sporadic, project-specific)

**Art Commissions & Residencies**
- **Revenue**: $5K-15K/quarter
- **Sources**: Felt story commissions, creative residencies, public art
- **Billing**: 50% deposit, 50% on completion
- **Status**: Irregular but ongoing
- **Variability**: Very high (project-based)

#### Total Revenue Summary

- **Monthly Average**: $30K-50K
- **Annual Target**: $360K-600K
- **Variability**: High (40-60% range month-to-month)
- **Seasonality**: Higher in Sept-May (CSA, residencies), lower in Jun-Aug (winter)

### 11.2 Cost Structure

**Purpose**: Transparent breakdown of where money goes.

#### People (Largest Expense)

- **Ben (Founder)**: $12K-18K/month (varies with cashflow)
- **Part-time Team**: $3K-7K/month
  - JusticeHub coordinator (15 hrs/week)
  - The Harvest coordinator (10 hrs/week)
  - Bookkeeper (5 hrs/month)
  - Contractors (irregular)
- **Total People Cost**: $15K-25K/month

#### Land & Facilities

- **Black Cockatoo Valley**:
  - Mortgage/lease: $2K-3K/month
  - Maintenance & repairs: $500-1K/month
  - Utilities (water, electricity): $300-500/month
  - Property insurance: $150-250/month
- **The Harvest Space** (if separate):
  - Rent: $500-1K/month (or shared with BCV)
- **Total Land Cost**: $3K-5K/month

#### Operations

- **Software & Subscriptions**: $500-800/month
  - Xero (accounting): $60-90/month
  - Dext (receipts): $40-60/month
  - GoHighLevel (CRM): $97-297/month
  - Notion (knowledge): $20/month
  - Supabase (database): $25-50/month
  - Vercel (hosting): $20-50/month
  - Other tools: $100-200/month
- **Supplies & Materials**: $500-1K/month
  - Office supplies
  - Program materials (JusticeHub, Harvest)
  - Farm/garden supplies
- **Travel & Transport**: $500-1K/month
  - Fuel
  - Vehicle maintenance
  - Travel to sites/events
- **Marketing & Communications**: $300-500/month
  - Website hosting
  - Social media ads (occasional)
  - Printing (brochures, signage)
- **Total Operations**: $2K-4K/month

#### Professional Services

- **Accounting & Bookkeeping**: $200-400/month
  - Monthly bookkeeping: $150-250/month
  - Quarterly BAS: $150-300/quarter
  - Annual tax prep: $800-1,500/year
- **Legal & Compliance**: $100-300/month (averaged)
  - Insurance: $100-200/month
  - Legal advice: $500-2K/year (irregular)
- **Total Professional**: $300-700/month

#### Technology

- **Hosting & Infrastructure**: $50-150/month
  - Vercel Pro: $20/month
  - Supabase Pro: $25/month
  - Domain names: $10-20/month
  - CDN/storage: $10-50/month
- **Development Tools**: $50-100/month
  - GitHub: $0 (open source)
  - Design tools: $20-50/month
  - Analytics: $20-50/month
- **Total Tech**: $500-1K/month (including software above)

#### Summary

- **Total Monthly Burn**: $20K-35K/month
- **Break-Even**: ~$25K/month
- **Runway**: Track monthly in cashflow forecast
- **Margin**: 10-40% (highly variable)

### 11.3 Invoice Workflow (Xero + GHL)

**Purpose**: Get paid faster with automated invoice creation, sending, and follow-up.

**Goal**: Invoice created → Sent → Paid within 14 days (industry average: 30-45 days).

#### The Problem (Without Automation)

Manual invoicing sucks:
- Takes 20 minutes to create invoice (finding client info, line items, etc.)
- Manually emailing PDFs (easy to forget)
- Chasing payments manually (awkward, time-consuming)
- Hard to track what's outstanding

**Result**: Late payments, cashflow stress, unpaid invoices.

#### The Solution (Xero + GHL Automated)

**Automated Process**:
1. **Trigger**: Job completed / milestone reached / recurring date
2. **Create invoice in Xero** (template or recurring) → 2 minutes
3. **Xero auto-emails invoice** to client → automatic
4. **GHL tracks in pipeline** (optional but powerful) → automatic
5. **Auto-follow-up** at 7, 14, 30 days → automatic
6. **Payment received** → Xero auto-reconciles → automatic

**Time**: 2-3 minutes to create, rest is automatic
**Result**: Paid faster, less chasing, better cashflow

#### Invoice Types at ACT

**1. Recurring Invoices (Predictable Revenue)**

Examples:
- **JusticeHub**: NDIS monthly billing
- **The Harvest**: CSA memberships (monthly/quarterly)
- **Empathy Ledger**: Partnership retainers
- **BCV**: Residency deposits (when booked)

**Setup Once** → Xero auto-sends monthly/quarterly

**2. Project-Based Invoices**

Examples:
- **Workshops**: After event completion
- **Consulting**: After delivery
- **Grants**: Milestone-based billing
- **Art Commissions**: Upon completion or 50/50 split

**Created per project** → Manual but templated

**3. Prepaid / Deposits**

Examples:
- **BCV Residencies**: 50% deposit on booking
- **Workshops**: Full payment upfront
- **CSA Shares**: Seasonal prepayment

**Created on confirmation** → Triggers prepayment terms

#### Step-by-Step Workflow

**Step 1: Create Invoice in Xero (2 minutes)**

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

**Step 2: Send Invoice (Automatic or Manual)**

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

**Step 3: Payment Terms & Options**

**Standard Terms**:
- **7 days**: For deposits, upfront payments
- **14 days**: Standard for most invoices
- **30 days**: For government/institutional clients (required)

**Payment Methods**:

1. **Bank Transfer (EFT)**
   - Include BSB, Account Number on invoice
   - Reference: Invoice number
   - Most common method

2. **Xero Payments (Online)**
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

**Step 4: Automated Follow-Up**

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

**Step 5: Payment Received**

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

#### Getting Paid Faster (Tactics)

**1. Clear Payment Instructions**
- **Always** include BSB + Account + Reference
- Offer online payment link (worth the 1.75% fee for speed)
- Make it brain-dead easy to pay

**2. Send Immediately**
- Don't wait days to invoice after job done
- Invoice same day or next day
- Delay = they forget = late payment

**3. Follow-Up Early**
- Day 7 reminder (before due date)
- Day 14 (on due date if unpaid)
- Don't wait until 30 days to start chasing

**4. Personal Touch for Large Invoices**
- $2K+ invoices: Send email + call to confirm received
- "Just wanted to check you got the invoice, any questions?"
- Builds relationship + catches issues early

**5. Incentives**
- **Early Payment Discount**: "2% discount if paid within 7 days"
- **Late Fee**: "1.5% per month on overdue" (usually not enforced, just motivator)

**6. Partial Payments**
- Large invoice? Offer payment plan
- 50% upfront, 50% on completion
- Easier for client, you get cash sooner

#### Metrics to Track

**Average Days to Payment**
- Goal: <20 days
- Industry average: 30-45 days
- Track monthly, identify trends

**% Paid on Time**
- Goal: >80% within terms
- Red flag if <50%

**Outstanding Invoices (Total $)**
- Goal: <1 month of revenue
- If >2 months, cashflow risk

**Invoice-to-Payment Conversion**
- Goal: 100% (all invoices eventually paid)
- If <95%, investigate (bad clients? unclear terms?)

**Where to find**:
- Xero → Reports → Aged Receivables
- Export to Google Sheets monthly
- Track over time

### 11.4 Receipt Workflow (Xero + Dext)

**Purpose**: Make receipt processing painless using Dext's AI extraction + Xero's accounting automation.

**Goal**: Capture → Process → File in under 30 seconds per receipt.

#### The Problem (Manual Process)

**The Old Way**:
1. Collect physical receipts → 5 min
2. Find them when needed → 10 min (lost half the time)
3. Manually enter into Xero → 5 min per receipt
4. Scan/photo for records → 3 min
5. File physically → 2 min

**Time per receipt**: 25 minutes
**Monthly (20 receipts)**: 8+ hours of painful admin

#### The Solution (Dext + Xero)

**Automated Process**:
1. Photo receipt with Dext app → 10 seconds
2. Dext AI extracts data → automatic
3. Review/approve in Dext → 15 seconds
4. Auto-publishes to Xero → automatic
5. Done!

**Time per receipt**: 30 seconds
**Monthly (20 receipts)**: 10 minutes

**Time saved**: 7.5 hours/month = 90 hours/year

#### Step-by-Step Workflow

**Step 1: Capture Receipt (10 seconds)**

**As soon as you get it** (don't wait, don't collect in wallet):

**Option A: Mobile (Best for on-the-go)**
1. Open Dext Prepare app
2. Tap camera icon
3. Snap photo (one or both sides if needed)
4. Done - put physical receipt in "To File" box

**Option B: Email (Best for digital receipts)**
1. Forward email to your Dext inbox (usually: yourcompany@dext.com)
2. Delete email (it's in Dext now)
3. Done

**Option C: Bulk Upload (Best for accumulated receipts)**
1. Login to Dext web app
2. Drag & drop multiple photos/PDFs
3. Dext processes all in batch

**Pro Tips**:
- Capture IMMEDIATELY (gas station, office supply store, etc.)
- Don't let them pile up (30 seconds now vs 2 hours later)
- Physical receipts fade - photo within 24 hours

**Step 2: Dext AI Extraction (Automatic)**

Dext AI reads the receipt and extracts:
- **Date**: Transaction date
- **Supplier**: Who you paid
- **Amount**: Total paid
- **Category**: Guesses based on supplier
- **Tax**: Automatically calculates GST

**This happens automatically** - you don't do anything.

**Time**: 30 seconds - 2 minutes (depending on Dext server load)

**Step 3: Review in Dext (15 seconds)**

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

**Step 4: Auto-Publish to Xero (Automatic)**

When you click "Publish to Xero" in Dext:
- Receipt image attaches to Xero transaction
- Supplier, date, amount, category all transfer
- GST calculated and recorded
- Appears in Xero as expense
- Ready for reconciliation

**You don't touch Xero for receipt entry** - it's all automated.

**Step 5: Reconciliation (Monthly)**

**Once per month** (usually with accountant/bookkeeper):

1. Open Xero → Banking
2. Match Dext-published expenses to bank transactions
3. Most will auto-match (Xero learns patterns)
4. Manual match any that don't auto-match
5. Reconcile bank account

**Time**: 30 minutes - 1 hour for month-end (vs 4-8 hours manually entering receipts)

#### Receipt Categories (Xero Chart of Accounts)

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

#### Weekly Rhythm

**Monday Morning (5 minutes)**
- Open Dext app
- Upload any weekend receipts (if you collected any)
- Review weekend digital receipts (emailed to Dext)

**Wednesday Midday (10 minutes)**
- Review week's receipts in Dext
- Fix any extraction errors
- Publish all to Xero
- Clear "Not Published" queue

**Friday Arvo (5 minutes)**
- Final sweep of week's receipts
- Check nothing stuck in "Processing"
- File physical receipts (if you haven't yet)

**Total weekly time**: 20 minutes
**Result**: Never behind, month-end is easy

#### Cost & ROI

**Dext**: ~$40-60/month (depends on plan)
**Xero**: ~$60-90/month (depending on features)
**Total**: ~$100-150/month

**Time saved**: 90 hours/year
**Value**: 90 hours × $50/hr = $4,500/year
**ROI**: 2,500%+ (pays for itself 25x over)

### 11.5 Profit-Sharing Calculations (40% to Communities)

**Purpose**: Transparent methodology for calculating and distributing 40% of profit to source communities.

**Principle**: ACT commits 40% of net profit to the communities whose knowledge, land, or participation created the value. This isn't charity - it's recognition that value is co-created.

#### Calculation Methodology

**Step 1: Calculate Net Profit Per Project**

For each ACT project (JusticeHub, Empathy Ledger, The Harvest, etc.):

```
Net Profit = Total Revenue - Direct Costs - Allocated Overhead

Where:
- Total Revenue = All income from project
- Direct Costs = Costs directly attributable to project
- Allocated Overhead = Proportional share of ACT operations
```

**Example (The Harvest - CSA Program)**:
```
Revenue:
- CSA memberships: $8,000/month
- Workshop fees: $2,000/month
- Total Revenue: $10,000/month

Direct Costs:
- Coordinator wages: $2,500/month
- Supplies & materials: $500/month
- Marketing: $300/month
- Total Direct Costs: $3,300/month

Allocated Overhead (30% of revenue):
- Rent (shared): $300/month
- Utilities: $100/month
- Software: $200/month
- Accounting: $100/month
- Insurance: $100/month
- Admin time: $500/month
- Total Overhead: $3,000/month

Net Profit = $10,000 - $3,300 - $3,000 = $3,700/month
```

**Step 2: Allocate 40% to Source Community**

```
Community Share = Net Profit × 40%

Using example above:
Community Share = $3,700 × 0.40 = $1,480/month
```

**Step 3: Track from Day One (Even Pre-Profit)**

**Critical**: Start tracking from project launch, even if unprofitable initially.

If project is loss-making:
- No distribution (can't distribute negative profit)
- But track accumulated deficit
- Once profitable, deficit must be recovered before distribution

**Example (Project Lifecycle)**:
```
Year 1:
- Months 1-6: -$2,000/month loss → Accumulated deficit: -$12,000
- Months 7-12: +$1,000/month profit → Deficit reduced to -$6,000

Year 2:
- Months 1-3: +$2,000/month profit → Deficit cleared ($6,000 recovered)
- Month 4 onwards: Profit distributable at 40%
- Month 4: $3,000 profit → $1,200 to community
```

**Step 4: Community Decides Fund Allocation**

ACT transfers funds to community-controlled entity:
- Community bank account
- Community foundation
- Community-elected committee

**Community decides**:
- Elder stipends
- Cultural programs
- Youth activities
- Infrastructure
- Savings for future needs

**ACT does NOT decide** how funds are used.

**Step 5: Transparent Reporting (Quarterly)**

Every 3 months, ACT provides:

**Financial Report** to community:
- Total revenue (project)
- Direct costs breakdown
- Allocated overhead breakdown
- Net profit calculation
- 40% community share
- Cumulative totals

**Format**: Simple 1-page PDF + spreadsheet

**Quarterly Meeting**:
- Review finances together
- Answer questions
- Discuss project direction
- Hear community priorities

#### Special Cases

**Multiple Communities (e.g., Goods on Country)**

If project involves multiple source communities:
- 40% total split between communities
- Split proportional to contribution (decided upfront in partnership agreement)

**Example**:
- Goods product co-created by 3 communities
- Split: 15% / 15% / 10% (based on design contribution, time invested)
- ACT retains: 60%

**Grant-Funded Projects**

If project funded by grants (no revenue):
- No profit → No 40% distribution
- BUT: Allocate grant budget to community direct (70% minimum)

**Example (Grant-funded program)**:
- $50K grant for community storytelling project
- Budget:
  - Community direct (stipends, events, materials): $35K (70%)
  - Capacity building (training, documentation): $10K (20%)
  - ACT admin/coordination: $5K (10%)

**IP Licensing Revenue**

If community IP generates ongoing licensing revenue:
- 40% of gross licensing revenue to community (not net profit)
- Exception to net profit rule (acknowledges IP ownership)

**Example**:
- Community designs sold on Goods platform
- $1,000 product sales
- Community receives: $400 (40% of gross)
- Before ACT calculates costs

#### Implementation Tools

**Tracking Spreadsheet** (Google Sheets):
```
Columns:
- Month/Year
- Project Name
- Total Revenue
- Direct Costs (itemized)
- Allocated Overhead (%)
- Net Profit
- Community Share (40%)
- Cumulative Deficit/Surplus
- Amount Paid to Community
- Date Paid
- Community Notes
```

**Quarterly Report Template**:
```
Project: [NAME]
Quarter: [Q1/Q2/Q3/Q4] [YEAR]
Community Partner: [NAME]

SUMMARY:
Revenue: $[X]
Costs: $[Y]
Net Profit: $[Z]
Your Share (40%): $[A]

BREAKDOWN:
[Detailed line items]

PAYMENT:
Amount: $[A]
Date: [DATE]
Method: [EFT to community account]

CUMULATIVE:
Total distributed to date: $[B]

NOTES:
[Any context, upcoming changes, questions]
```

**Community Account Setup**:
1. Community opens dedicated bank account
2. ACT receives BSB + Account number
3. Monthly/quarterly EFT transfer (on schedule)
4. Receipt confirmation (for both parties' records)

#### Accountability Mechanisms

**ACT Responsibilities**:
- Accurate profit calculation (auditable)
- Transparent cost allocation (no hidden overhead)
- Timely distribution (30 days after quarter-end)
- Open books (community can request full financials)

**Community Rights**:
- Request detailed cost breakdowns
- Question overhead allocation
- Audit ACT's calculations (third-party if desired)
- Renegotiate terms if unfair

**Dispute Resolution**:
If community disputes profit calculation:
1. ACT provides full breakdown
2. Independent accountant review (cost shared)
3. Mediation if needed (trusted third party)
4. Binding decision (both parties agree upfront)

#### Long-Term Vision

**As project matures**:
- Year 1-2: ACT-led, community advisory → 40% profit share
- Year 3-4: Co-governance (50/50) → 50% profit share increase
- Year 5+: Community-majority (70/30) → 70% profit share increase
- Exit: Full community ownership → 100% profit to community

**Beautiful Obsolescence**: Profit-sharing is pathway to community ownership, not permanent ACT revenue.

### 11.6 Budget Templates

**Purpose**: Standardized templates for different budget types across ACT projects.

#### Project Budget Template (LCAA Phases)

**Use for**: New project proposals, grant applications, partnership planning

```
PROJECT: [Name]
BUDGET PERIOD: [Start Date] - [End Date]
TOTAL BUDGET: $[Amount]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 1: LISTEN (Discovery & Relationships)
Budget: $[X] ([Y]% of total)
Duration: [Months]

LINE ITEMS:
Community consultation stipends       $[Amount]
Elder honorariums                     $[Amount]
Travel to Country                     $[Amount]
Research & documentation              $[Amount]
Translation services (if needed)      $[Amount]

DELIVERABLES:
- Community partnership agreements signed
- Cultural protocols documented
- Project scope co-defined
- Trust established

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 2: CURIOSITY (Questioning & Co-Design)
Budget: $[X] ([Y]% of total)
Duration: [Months]

LINE ITEMS:
Co-design workshops                   $[Amount]
Community participant payments        $[Amount]
Design iteration & testing            $[Amount]
Prototype materials                   $[Amount]
Facilitation & coordination           $[Amount]

DELIVERABLES:
- Co-designed solution validated
- Community feedback incorporated
- Prototype tested with users
- Roadmap agreed

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 3: ACTION (Building & Implementation)
Budget: $[X] ([Y]% of total)
Duration: [Months]

LINE ITEMS:
Development/build costs               $[Amount]
Community training & capacity         $[Amount]
Materials & equipment                 $[Amount]
Launch event                          $[Amount]
Initial operations support            $[Amount]

DELIVERABLES:
- Solution built & launched
- Community trained to operate
- Participants onboarded
- Operations sustainable

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 4: ART (Making Visible & Storytelling)
Budget: $[X] ([Y]% of total)
Duration: [Ongoing]

LINE ITEMS:
Impact documentation                  $[Amount]
Community storytelling support        $[Amount]
Case study creation                   $[Amount]
Photography & videography             $[Amount]
Dissemination (conferences, media)    $[Amount]

DELIVERABLES:
- Impact story told (community-led)
- Learnings shared publicly
- Model documented for replication
- Knowledge returned to community

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ALLOCATED TO COMMUNITY DIRECT: $[Amount] ([X]%)
(All community stipends, honorariums, participant payments, training)

CAPACITY BUILDING: $[Amount] ([Y]%)
(Training, tools, documentation, infrastructure)

ACT OPERATIONS: $[Amount] ([Z]%)
(Coordination, reporting, overhead)

TOTAL: $[Total]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NOTES:
- All $ amounts GST exclusive (add 10% if applicable)
- Community receives [X]% directly
- 40% profit-sharing applies to any revenue generated
- Beautiful Obsolescence: Exit plan in Year [N]
```

#### Monthly Operational Budget

**Use for**: Regular monthly financial planning and tracking

```
ACT MONTHLY OPERATIONAL BUDGET
Month: [Month/Year]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REVENUE (Actual/Forecast)

JusticeHub:
- NDIS billing                        $[Amount]
- Government contracts                $[Amount]
Subtotal JusticeHub:                  $[Amount]

The Harvest:
- Memberships                         $[Amount]
- CSA shares                          $[Amount]
- Workshops                           $[Amount]
Subtotal The Harvest:                 $[Amount]

BCV Residencies:
- Residency bookings                  $[Amount]
- Workshop bookings                   $[Amount]
Subtotal BCV:                         $[Amount]

Grants & Other:
- Grant milestone payment             $[Amount]
- Art commissions                     $[Amount]
- Consulting                          $[Amount]
Subtotal Other:                       $[Amount]

TOTAL REVENUE:                        $[Amount]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXPENSES

PEOPLE:
- Ben (founder)                       $[Amount]
- JusticeHub coordinator              $[Amount]
- The Harvest coordinator             $[Amount]
- Bookkeeper                          $[Amount]
- Contractors                         $[Amount]
Subtotal People:                      $[Amount]

LAND & FACILITIES:
- BCV mortgage/lease                  $[Amount]
- Maintenance & repairs               $[Amount]
- Utilities (water, electric)         $[Amount]
- Property insurance                  $[Amount]
Subtotal Land:                        $[Amount]

OPERATIONS:
- Xero (accounting)                   $[Amount]
- Dext (receipts)                     $[Amount]
- GoHighLevel (CRM)                   $[Amount]
- Notion                              $[Amount]
- Supabase                            $[Amount]
- Vercel (hosting)                    $[Amount]
- Other software                      $[Amount]
- Office supplies                     $[Amount]
- Program materials                   $[Amount]
- Travel & transport                  $[Amount]
- Marketing                           $[Amount]
Subtotal Operations:                  $[Amount]

PROFESSIONAL SERVICES:
- Bookkeeping                         $[Amount]
- Accounting                          $[Amount]
- Legal                               $[Amount]
Subtotal Professional:                $[Amount]

TOTAL EXPENSES:                       $[Amount]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NET PROFIT/LOSS:                      $[Amount]

Profit Margin:                        [X]%
Burn Rate (if negative):              $[Amount]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMMUNITY PROFIT-SHARING (if profitable):

40% to communities:                   $[Amount]
Allocated:
- [Community A]:                      $[Amount]
- [Community B]:                      $[Amount]

ACT retains:                          $[Amount]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CASHFLOW NOTES:
- Outstanding invoices: $[Amount]
- Upcoming large expenses: [Note]
- Runway: [X] months at current burn
```

#### Quarterly Forecast Template

**Use for**: 3-month rolling financial planning

```
ACT QUARTERLY FORECAST
Quarter: [Q1/Q2/Q3/Q4] [Year]
Forecast Date: [Date]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REVENUE FORECAST (Conservative / Realistic / Optimistic)

                    Month 1    Month 2    Month 3    Q Total
JusticeHub          $[X]       $[X]       $[X]       $[X]
The Harvest         $[X]       $[X]       $[X]       $[X]
BCV                 $[X]       $[X]       $[X]       $[X]
Grants              $[X]       $[X]       $[X]       $[X]
Other               $[X]       $[X]       $[X]       $[X]
────────────────────────────────────────────────────────
TOTAL REVENUE       $[X]       $[X]       $[X]       $[X]

EXPENSES FORECAST

                    Month 1    Month 2    Month 3    Q Total
People              $[X]       $[X]       $[X]       $[X]
Land/Facilities     $[X]       $[X]       $[X]       $[X]
Operations          $[X]       $[X]       $[X]       $[X]
Professional        $[X]       $[X]       $[X]       $[X]
────────────────────────────────────────────────────────
TOTAL EXPENSES      $[X]       $[X]       $[X]       $[X]

NET PROFIT/LOSS     $[X]       $[X]       $[X]       $[X]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ASSUMPTIONS:
- JusticeHub: [X] NDIS clients @ $[Y]/month
- The Harvest: [X] members, [Y] CSA shares, [Z] workshops
- BCV: [X] residency bookings (low season/high season)
- Grants: [Milestone payments expected]

RISKS:
- [Risk 1 + mitigation]
- [Risk 2 + mitigation]

OPPORTUNITIES:
- [Opportunity 1]
- [Opportunity 2]

CASHFLOW GAP ANALYSIS:
Month 1: [Surplus/Deficit] $[Amount]
Month 2: [Surplus/Deficit] $[Amount]
Month 3: [Surplus/Deficit] $[Amount]

ACTION REQUIRED:
- [If deficit: Delay expenses, chase invoices, etc.]
- [If surplus: Invest in growth, pay down debt, etc.]
```

#### Annual Strategic Budget

**Use for**: Yearly planning, board reporting, grant applications

```
ACT ANNUAL STRATEGIC BUDGET
Year: [YYYY]
Version: [Draft/Final]
Approved by: [Board/Founder]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STRATEGIC GOALS FOR [YEAR]:
1. [Goal 1 - e.g., "Scale JusticeHub to 100 participants"]
2. [Goal 2 - e.g., "Launch Goods on Country revenue stream"]
3. [Goal 3 - e.g., "Achieve operational break-even"]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ANNUAL REVENUE TARGET: $[Amount]

BY PROJECT:
JusticeHub                            $[Amount] ([X]%)
The Harvest                           $[Amount] ([X]%)
BCV Residencies                       $[Amount] ([X]%)
Goods on Country                      $[Amount] ([X]%)
Grants                                $[Amount] ([X]%)
Other (Art, Consulting)               $[Amount] ([X]%)

BY QUARTER:
Q1 (Jan-Mar)                          $[Amount] ([X]%)
Q2 (Apr-Jun)                          $[Amount] ([X]%)
Q3 (Jul-Sep)                          $[Amount] ([X]%)
Q4 (Oct-Dec)                          $[Amount] ([X]%)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ANNUAL EXPENSES TARGET: $[Amount]

PEOPLE ($[Amount] - [X]%):
- Core team                           $[Amount]
- Contractors                         $[Amount]
- Professional development            $[Amount]

LAND & FACILITIES ($[Amount] - [X]%):
- Mortgage/lease                      $[Amount]
- Maintenance                         $[Amount]
- Utilities                           $[Amount]
- Insurance                           $[Amount]

OPERATIONS ($[Amount] - [X]%):
- Software & tools                    $[Amount]
- Supplies & materials                $[Amount]
- Travel & transport                  $[Amount]
- Marketing                           $[Amount]

PROFESSIONAL SERVICES ($[Amount] - [X]%):
- Accounting & bookkeeping            $[Amount]
- Legal & compliance                  $[Amount]
- Consultants                         $[Amount]

GROWTH INVESTMENTS ($[Amount] - [X]%):
- New project development             $[Amount]
- Technology upgrades                 $[Amount]
- Capacity building                   $[Amount]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NET PROFIT TARGET: $[Amount]
Profit Margin Target: [X]%

COMMUNITY PROFIT-SHARING (40%): $[Amount]

ACT RETAINED PROFIT (60%): $[Amount]
Use of Retained Profit:
- Reserves (3 months operating): $[Amount]
- Debt repayment: $[Amount]
- Growth investments: $[Amount]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
KEY METRICS TO TRACK:
- Monthly revenue (actual vs forecast)
- Monthly expenses (actual vs budget)
- Net profit margin (target: >15%)
- Community profit distributed (target: $[X]/year)
- Cashflow runway (target: >3 months)
- Invoice payment time (target: <20 days)
- Revenue diversity (no single source >40%)

REVIEW SCHEDULE:
- Monthly: Actuals vs budget review
- Quarterly: Forecast revision
- Annual: Strategic budget refresh
```

### 11.7 Grant Reporting Procedures

**Purpose**: Standardized procedures for grant reporting to common ACT funders.

*[This section will be populated based on actual grant relationships and funder requirements]*

**Common Elements**:
- Impact metrics framework (aligned with LCAA methodology)
- Financial acquittal templates
- Community voice in reporting (co-authored reports)
- Photo/video consent protocols
- Timeline management (avoid last-minute scrambles)

---

## 12. LEGAL & GOVERNANCE

### 12.1 Dual-Entity Structure (Detailed)

**Purpose**: ACT operates through two complementary entities that enable both charitable impact and sustainable revenue generation while maintaining mission alignment.

#### ACT Foundation (NFP Company Limited by Guarantee)

**Legal Purpose**: Charitable advancement of regenerative practices and community-led innovation

**Structure**:
- Company Limited by Guarantee (CLG)
- Not-for-profit (NFP)
- Member-based (no shareholders)
- Directors elected by members

**Governance**:
- Board of Directors: 3-7 members
- Majority community representatives
- Annual General Meetings (AGM)
- Member voting on constitutional changes

**Asset Lock**:
- Prevents asset distribution to members
- All assets held in trust for charitable purposes
- On winding up: Assets transfer to similar charity (not members)

**Tax Status**:
- Pursuing Deductible Gift Recipient (DGR) status
- Pursuing Public Benevolent Institution (PBI) status
- Tax-exempt on charitable activities
- Can issue tax-deductible donation receipts (once DGR approved)

**IP Holding**:
- Owns intellectual property in trust for the commons
- Licenses IP to Ventures (at cost or free)
- Ensures IP remains accessible for public benefit
- Cannot be sold for private profit

**Primary Activities**:
- Grant-funded projects
- Community capacity building
- Knowledge commons development
- Cultural protocols stewardship

#### ACT Ventures (Mission-Locked Trading Entity)

**Legal Purpose**: Social enterprise revenue generation to sustain ACT's mission

**Structure**:
- Proprietary Limited Company (Pty Ltd)
- For-profit but mission-locked
- Foundation is majority shareholder (51%+)
- Founder/community can hold minority shares

**Shareholder Structure**:
- ACT Foundation: 51-80% (ensures mission control)
- Founder/team: 10-30% (incentive alignment)
- Community partners: 10-20% (optional, project-specific)

**Profit Distribution**:
- 40% to source communities (contractual commitment)
- Remaining profit distributable to shareholders
- Foundation reinvests dividends in mission

**Mission Lock (Constitutional Clauses)**:
- Cannot change charitable objects without Foundation approval
- Cannot sell assets without Foundation consent
- Profit-sharing to communities cannot be removed
- Community ownership pathways cannot be reversed

**Winding Up Provisions**:
- On dissolution: All assets transfer to Foundation
- Cannot distribute to private shareholders
- Debt to creditors paid first, remainder to Foundation
- Ensures value created stays in mission ecosystem

**Primary Activities**:
- Commercial projects (JusticeHub, The Harvest, BCV)
- Fee-for-service consulting
- Product sales (Goods on Country)
- Workshop & event revenue

#### Why This Structure?

**Separation of Concerns**:
- **Foundation**: Grants, charity work, community trust
- **Ventures**: Revenue, commercial partnerships, sustainability

**Risk Management**:
- Commercial risks don't threaten charitable assets
- Grant funding kept separate from trading income
- Legal liability separated (important for NDIS, etc.)

**Tax Optimization**:
- Foundation receives grants tax-free (when DGR approved)
- Ventures pays tax on profit (but reinvests most)
- No tax avoidance - just appropriate structure

**Investor Clarity**:
- Social investors can invest in Ventures (returns possible)
- Philanthropists donate to Foundation (tax deductible)
- Both support same mission, different mechanisms

**Community Confidence**:
- Foundation governance ensures community voice
- Mission lock prevents "mission drift" or sellout
- Beautiful Obsolescence pathway ensures exit is possible

### 12.2 Partnership Agreement Templates

**Purpose**: Standardized agreements for community partnerships ensuring clarity, fairness, and cultural safety.

#### Standard Partnership Agreement Structure

**Template applies to**: JusticeHub, Empathy Ledger, The Harvest, BCV partnerships

**Key Sections**:

**1. Parties**
- ACT Ventures Pty Ltd (or ACT Foundation, depending on project)
- [Community Organization/Traditional Owner Group]
- Defined representatives and contact points

**2. Purpose & Vision**
- Shared mission statement
- Community-defined outcomes (not ACT-imposed)
- Alignment with LCAA methodology
- Recognition of Country/cultural context

**3. Scope of Work & Deliverables**
- What ACT will deliver (infrastructure, technology, coordination)
- What community will lead (decision-making, cultural direction, governance)
- Co-created components (design, content, process)
- Timeline with flexibility (not rigid deadlines)

**4. LCAA Methodology Application**
- **Listen Phase**: Community consultation process, Elder involvement, cultural protocols
- **Curiosity Phase**: Co-design workshops, testing with community, iteration based on feedback
- **Action Phase**: Build/implement with community oversight, training, handover planning
- **Art Phase**: Community-led storytelling, impact documentation, knowledge sharing

**5. Governance & Decision-Making**
- Steering committee structure (community majority)
- Decision-making process (consensus-seeking, not majority-vote)
- Veto rights for community on cultural matters
- Escalation process for disputes

**6. Community Ownership Commitments**
- Year 1-2: ACT-led, community advisory (ACT builds capacity)
- Year 3-4: Co-governance (50/50 decision-making)
- Year 5+: Community-majority (70/30, community leads)
- Exit: Full community ownership (ACT exits or becomes service provider)

**7. Intellectual Property**
- **Community IP**: Remains with community (stories, designs, cultural knowledge)
- **Technology IP**: ACT develops, then transfers to community over time
- **Co-created IP**: Joint ownership with community priority
- **Sacred Knowledge**: Never recorded, never owned, always protected

**8. 40% Profit-Sharing Terms**
- Calculation methodology (net profit after costs)
- Reporting frequency (quarterly)
- Payment schedule (within 30 days of quarter-end)
- Community decision-making on fund use
- Audit rights for community

**9. Financial Transparency**
- ACT provides full cost breakdowns
- Community can question any expense
- Independent accountant review if disputed
- Open-book policy (community can request any financial record)

**10. Cultural Protocols & Safeguards**
- Free, Prior, and Informed Consent (FPIC) process
- Cultural authority remains with community
- No extraction of cultural knowledge without permission
- OCAP® principles applied (Ownership, Control, Access, Possession)

**11. Data Sovereignty**
- Community owns all data about community members
- ACT is data custodian only (not owner)
- Data stored where community specifies
- Community can request data deletion at any time
- Privacy protections exceed legal minimums

**12. Sunset Clause (3-5 years typical)**
- See Section 12.3 for standard language
- Triggers: timeline, milestones, community readiness
- Transition support period (ACT doesn't just leave)
- Asset transfer process
- Ongoing relationship terms (if desired)

**13. Dispute Resolution**
- Step 1: Direct conversation (good faith attempt)
- Step 2: Mediation with trusted third party (community chooses)
- Step 3: Arbitration (binding decision)
- Cultural mediation respected (if community requests)

**14. Exit Provisions**
- Either party can exit with 6 months notice
- ACT cannot exit without ensuring continuity (handover plan required)
- Community can exit anytime (ACT supports transition)
- Asset transfer on exit (to community or community-nominated entity)

**15. Amendments**
- Agreement can be amended by mutual consent
- Community can request changes anytime
- ACT commits to good faith consideration
- No unilateral changes by ACT

#### Execution Process

**Before Signing**:
1. Draft shared with community (plain language version + legal version)
2. Community has time to review (minimum 30 days)
3. Community can request legal advice (ACT covers cost)
4. Community meeting to discuss and approve
5. Modifications made based on community feedback

**Signing**:
- Signed by authorized representatives
- Witnessed appropriately (cultural protocols respected)
- Original to community, copy to ACT
- Published on ACT website (if community consents)

**After Signing**:
- Kick-off meeting to confirm understanding
- Quarterly reviews of agreement effectiveness
- Annual formal review (Is this still working?)
- Open to amendments as relationship evolves

### 12.3 Sunset Clause Standard Language

**Purpose**: Every ACT partnership includes a "beautiful obsolescence" clause - a commitment to exit when community is ready.

#### Standard Sunset Clause Template

```
SUNSET CLAUSE (Beautiful Obsolescence)

Purpose:
This partnership is designed to build community capacity and ownership,
with the explicit goal of ACT becoming obsolete. This clause defines
the pathway to full community ownership and ACT's graceful exit.

Triggers (any one activates transition):
1. Timeline: [3-5 years] from partnership commencement
2. Milestone: Community achieves [defined capabilities]
3. Community Request: Community determines readiness anytime

Transition Process:

Phase 1: Notice (Month 1)
- Trigger activated (timeline, milestone, or community request)
- Transition planning meeting scheduled
- Community priorities for transition documented

Phase 2: Planning (Months 1-3)
- Co-develop transition plan
- Identify capacity gaps
- Resource what's needed for sustainability
- Define post-exit relationship (if any)

Phase 3: Capacity Building (Months 3-9)
- ACT provides intensive training/support
- Community takes on increasing operational control
- Systems documented in plain language
- Knowledge transfer completed

Phase 4: Asset Transfer (Month 9-10)
- Technology ownership transferred (source code, servers, domains)
- Intellectual property assigned to community
- Physical assets transferred (if any)
- Financial accounts transferred or closed

Phase 5: Support Period (Months 10-12)
- ACT available for questions/troubleshooting
- No active involvement unless requested
- Final knowledge transfer sessions
- Relationship evaluation

Phase 6: Exit (Month 12)
- All assets, IP, data transferred
- Community assumes full ownership
- ACT role formally ends
- Post-exit relationship defined (if desired)

Community Rights During Transition:
- Request acceleration (finish faster than planned)
- Request extension (more time needed)
- Request modified exit (ACT remains in service role)
- Cancel exit (keep partnership, revise terms)

ACT Commitments:
- Maintain service quality during transition
- Cover transition costs (training, documentation, setup)
- Provide [6-12 months] technical assistance post-transfer
- No abandonment (support until community is confident)

Post-Exit Relationship Options:
1. Full independence (no ongoing ACT involvement)
2. Technical support contract (community pays for services)
3. Peer relationship (mutual support, no hierarchy)
4. New partnership (if community wants to build something new)

Financial Settlement:
- Any outstanding profit-share distributed
- Community receives all project revenue post-exit
- ACT has no ongoing financial claim
- Debts/liabilities settled before transfer

Legal Transfer:
- All contracts transferred or terminated
- Community holds all IP, trademarks, domains
- ACT indemnifies community for past actions
- Clean legal separation

Success Metrics:
Exit is successful when:
- Community operates independently (no ACT dependence)
- Community controls all assets and decisions
- Community has capacity to sustain and evolve
- Relationship is positive (gratitude, not resentment)
```

#### When Sunset Clause Activates

**Timeline Trigger** (Most Common):
- 3 years: For simpler projects (e.g., workshop series)
- 5 years: For complex systems (e.g., Empathy Ledger platform)
- 7 years: For multi-community projects (e.g., regional networks)

**Milestone Trigger** (Capability-Based):
Community demonstrates:
- Financial sustainability (revenue exceeds costs)
- Technical capability (can maintain/evolve system)
- Governance maturity (decision-making processes work)
- Community ownership (members engaged and leading)

**Community Request Trigger** (Anytime):
- Community says "We're ready" → ACT supports transition
- Community says "This isn't working" → ACT exits gracefully
- Community says "We want to modify" → Renegotiate partnership

#### What If Community Isn't Ready?

**Extension Process**:
1. Honest conversation: What's blocking readiness?
2. Identify gaps: Skills, resources, confidence, funding?
3. Resource gaps: ACT commits support to address
4. Extend timeline: 6-12 month extensions (renewable)
5. Re-evaluate: Check in quarterly until ready

**ACT Will Not**:
- Abandon community if unprepared
- Force exit on timeline if community needs more time
- Leave system unsustainable
- Walk away from problems created

**ACT Will**:
- Invest in making exit successful
- Provide resources to build capacity
- Stay as long as needed (within reason)
- Ensure community thrives post-exit

### 12.4 IP Licensing Framework

**Purpose**: All ACT-created IP is designed to be forkable, transferable, and community-controlled.

#### Open Source Licensing for Code

**Default License**: MIT or GPL-3.0 (community choice)

**Why Open Source**:
- Enables community to fork and evolve
- Removes dependency on ACT
- Allows community to hire any developer
- Prevents vendor lock-in
- Aligns with commons-building mission

**MIT License** (Recommended for most projects):
- Maximum freedom to use, modify, distribute
- Commercial use allowed
- Community can relicense if needed
- Simple, well-understood

**GPL-3.0** (For projects requiring reciprocity):
- Ensures modifications remain open source
- Prevents proprietary forks
- Protects commons from enclosure
- Good for community-critical infrastructure

**Community Chooses**:
- ACT presents both options + implications
- Community decides based on values/needs
- Can change license during transition (with ACT agreement)

#### Creative Commons for Design & Content

**Default License**: CC BY-SA 4.0 (Attribution, Share-Alike)

**For Design Assets**:
- Logos, graphics, website designs
- Attribution to community (not ACT)
- Share-alike ensures derivatives remain open
- Commercial use allowed (enables community revenue)

**For Content** (Non-Commercial):
- Stories, blog posts, educational materials
- CC BY-NC-SA 4.0 (Non-Commercial, Share-Alike)
- Protects against commercial exploitation
- Community can change to commercial license later

**For Sacred/Cultural Knowledge**:
- **No license** (not open, not owned)
- Protected under cultural protocols
- Not recorded without explicit permission
- Access controlled by cultural authority
- ACT has no rights to use or distribute

#### Forkable IP Framework

**What "Forkable" Means**:
Community can take all ACT-created technology and:
- Modify it freely
- Run it independently
- Hire anyone to maintain it
- Rebrand it completely
- Take it in new directions

**ACT Provides**:
1. **Complete Source Code**
   - All code repositories (GitHub, GitLab, etc.)
   - Build scripts and deployment tools
   - Documentation (technical + plain language)
   - Dependencies and configuration

2. **Design Files**
   - Original design files (Figma, Adobe, etc.)
   - Export formats (SVG, PNG, PDF)
   - Brand guidelines
   - Asset libraries

3. **Data Export**
   - Full database export (community owns data)
   - In open formats (JSON, CSV, not proprietary)
   - Migration scripts to move elsewhere
   - Backups and archives

4. **Documentation for Independence**
   - How to self-host
   - How to modify/extend
   - How to troubleshoot
   - How to hire developers

5. **Ongoing Support During Fork**
   - Answer questions
   - Help with setup
   - Troubleshoot issues
   - Knowledge transfer sessions

**Community Retains Fork Ownership**:
- Forked version belongs to community (not ACT)
- Community can relicense if needed
- ACT has no ongoing claim or control
- Community can commercialize, sell, or give away

#### Trademark & Branding

**Project Names**:
- Community owns project name/brand
- ACT never trademarks community project names
- Community can rebrand post-exit (keep or change name)

**"Powered by ACT" (Optional)**:
- Community can choose to attribute ACT
- Not required (community decides)
- ACT doesn't require ongoing branding

**ACT Brand**:
- "ACT", "A Curious Tractor", "Regenerative Innovation Studio" are ACT trademarks
- Community can say "Built with ACT" (attribution)
- Cannot impersonate ACT or use ACT brand for unrelated work

### 12.5 Community Ownership Pathway

**Purpose**: Phased transition from ACT-led to community-owned over 3-7 years.

#### Phase 1: ACT-Led, Community Advisory (Years 1-2)

**Decision-Making**:
- ACT makes operational decisions (daily execution)
- Community provides strategic guidance (vision, priorities)
- Community has veto on cultural matters
- Major decisions require community consultation

**Operations**:
- ACT handles: Technology, administration, finances, compliance
- Community leads: Cultural direction, program design, participant engagement
- Monthly check-ins with community steering committee

**Capacity Building**:
- ACT trains community in operations
- Community members shadow ACT on tasks
- Documentation created in plain language
- Skills transfer begins

**Governance**:
- Community steering committee (advisory)
- Quarterly partnership reviews
- Annual strategic planning together

**Goal**: Build trust, prove concept, transfer knowledge

#### Phase 2: Co-Governance (Years 3-4)

**Decision-Making**:
- 50/50 decision-making (consensus-based)
- Both parties have equal voice
- Disagreements resolved through dialogue (not voting)
- Community can override ACT on cultural/strategic matters

**Operations**:
- ACT handles: Technology maintenance, financial reporting, compliance
- Community handles: Day-to-day operations, participant services, community engagement
- Shared responsibility: Program design, partnerships, communications

**Capacity Building**:
- Community takes on increasing operational tasks
- ACT provides training on technology, finance, governance
- Community builds confidence and capability

**Governance**:
- Joint governance board (50/50 ACT/community)
- Monthly operational meetings
- Quarterly strategic reviews

**Financial**:
- Profit-sharing increases to 50% (if performing well)
- Community sees full financial transparency
- Community co-manages budget

**Goal**: Shared leadership, community capability growth

#### Phase 3: Community-Majority (Years 5+)

**Decision-Making**:
- Community makes all strategic decisions
- ACT provides input but community decides
- ACT operates in service role (not leadership)

**Operations**:
- Community handles: All operations, programs, partnerships
- ACT provides: Technical support (as requested), troubleshooting, advice

**Capacity Building**:
- Community fully capable of independent operation
- ACT available for questions but not needed day-to-day

**Governance**:
- Community-controlled board (70/30 or 80/20)
- ACT representatives in advisor role
- Community sets strategic direction

**Financial**:
- Profit-sharing increases to 70% community
- Community manages budget independently
- ACT provides financial oversight only if requested

**Goal**: Community ownership with ACT safety net

#### Phase 4: Full Community Ownership (Exit)

**Decision-Making**:
- Community makes all decisions
- ACT has no decision-making role

**Operations**:
- Community operates independently
- ACT available for technical support (if contracted)

**Assets**:
- All IP, technology, data transferred to community
- Community owns everything

**Financial**:
- 100% of revenue/profit to community
- ACT has no financial claim

**Relationship**:
- ACT exits or becomes service provider (if community wants)
- Peer relationship (mutual respect, no hierarchy)

**Goal**: Beautiful obsolescence achieved

#### Flexibility in Pathway

**Acceleration**:
- Community can request faster transition
- If ready earlier, ACT supports immediate progression
- Skip phases if capability demonstrated

**Extension**:
- Community can request more time in any phase
- ACT supports extended timeline if needed
- No penalty for slower transition

**Revision**:
- Pathway can be modified based on learnings
- Both parties can propose changes
- Flexibility preferred over rigid adherence

### 12.6 Contracts & Agreement Templates

**Purpose**: Standardized, plain-language contracts for common ACT partnerships.

#### Service Agreement Template

**Use for**: Consulting, workshop delivery, technical services

**Key Terms**:
- Scope of services (clear deliverables)
- Timeline (realistic, with buffer)
- Payment terms (milestone-based or time-based)
- IP ownership (client owns output)
- Confidentiality (if needed)
- Termination clauses (either party, 30 days notice)

**Plain Language Requirement**:
- No legalese
- Short sentences
- Defined terms
- Community can understand without lawyer

#### Artist Residency Agreement Template

**Use for**: BCV residencies, creative residencies

**Key Terms**:
- Residency dates and duration
- Accommodation details (what's included)
- Facilities access (studio, equipment, land)
- Artist obligations (minimal - focus on creation)
- Output expectations (none, or community-defined)
- IP ownership (artist retains all IP)
- Community engagement (optional, not mandatory)
- Photography/media (consent-based)
- Payment terms (deposit + balance)
- Cancellation policy (fair to both)

#### Grant Partnership Agreement Template

**Use for**: Grant-funded community projects

**Key Terms**:
- Grant purpose and funder
- Community role (lead or co-lead)
- ACT role (support, administration, fiscal sponsor)
- Budget allocation (70% community direct)
- Reporting responsibilities (shared)
- IP ownership (community)
- Data ownership (community)
- Grant compliance (ACT supports, community decides)
- Acquittal process (transparent)

### 12.7 Legal Compliance Checklists

**Purpose**: Ensure ACT meets all legal obligations for both entities.

#### Annual Compliance (ACT Foundation)

**ASIC Requirements**:
- [ ] Annual review due date: [Insert date based on registration]
- [ ] Confirm registered office address
- [ ] Update director details if changed
- [ ] Confirm member register is current
- [ ] Pay annual ASIC fee

**ACNC Requirements** (Once registered):
- [ ] Annual Information Statement (AIS) due [date]
- [ ] Financial reports submitted
- [ ] Confirm charitable purpose unchanged
- [ ] Update responsible persons register
- [ ] Declare if any incidents or changes

**Governance**:
- [ ] Hold Annual General Meeting (AGM)
- [ ] Approve annual financial statements
- [ ] Elect/re-elect directors
- [ ] Review and update constitution (if needed)
- [ ] Member register updated

**Tax**:
- [ ] Confirm tax-exempt status maintained
- [ ] Lodge annual charity tax return (if required)
- [ ] FBT return (if applicable)

**Insurance**:
- [ ] Renew public liability insurance
- [ ] Renew directors' & officers' insurance
- [ ] Review coverage adequacy

#### Quarterly Compliance (ACT Ventures)

**BAS (Business Activity Statement)**:
- [ ] Prepare BAS (GST, PAYG if applicable)
- [ ] Lodge with ATO by due date
- [ ] Pay any GST owing
- [ ] Claim any GST credits

**PAYG (if employees)**:
- [ ] Pay PAYG withholding to ATO
- [ ] Submit payment summary (annual)
- [ ] Superannuation payments made (quarterly deadline)

**Bookkeeping**:
- [ ] Reconcile all bank accounts
- [ ] Review Xero for accuracy
- [ ] Aged receivables reviewed (chase overdue)
- [ ] Aged payables reviewed (plan payments)

**Governance**:
- [ ] Board meeting held (if scheduled)
- [ ] Minutes documented
- [ ] Resolutions recorded

---

## 13. OPERATIONS & PROCEDURES

### 13.1 Daily Operations Checklist

**Purpose**: 15-minute morning and 10-minute evening routine to stay on top of operations.

#### Morning Routine (15 minutes)

**Time**: First thing, before deep work

**GHL Check** (5 min):
- [ ] Open GoHighLevel dashboard
- [ ] Check notifications (new leads, messages, appointments)
- [ ] Respond to urgent messages (or flag for later)
- [ ] Review today's pipeline tasks
- [ ] Update any stale opportunities

**Calendar Review** (3 min):
- [ ] Open calendar (Google Calendar / GHL)
- [ ] Confirm today's meetings/calls
- [ ] Check for conflicts or last-minute changes
- [ ] Prep for first meeting (if needed)

**Receipt Processing** (5 min):
- [ ] Check wallet/desk for physical receipts
- [ ] Photo any new receipts in Dext app
- [ ] Forward email receipts to Dext inbox
- [ ] Quick scan for urgent invoices to pay

**Living Wiki Review Queue** (2 min):
- [ ] Check for any flagged decisions from yesterday
- [ ] Review if any urgent knowledge needs documenting
- [ ] Flag items for weekly wiki update

**Output**: Clear on today's priorities, no urgent items missed

#### End of Day Routine (10 minutes)

**Time**: Last thing before shutdown

**Decision Logging** (3 min):
- [ ] Any important decisions made today?
- [ ] Log in Notion (ACT Placemat) or Living Wiki
- [ ] Note context (why decision made, what was considered)

**Receipt Filing** (2 min):
- [ ] File physical receipts in "To File" box
- [ ] Ensure all Dext uploads from today processed
- [ ] Check nothing stuck in "Processing"

**Project Status Update** (3 min):
- [ ] Any project progress today?
- [ ] Update relevant Notion project page
- [ ] Flag any blockers for tomorrow

**Tomorrow Prep** (2 min):
- [ ] What are top 3 priorities for tomorrow?
- [ ] Any prep needed for tomorrow's meetings?
- [ ] Set morning intention

**Output**: Clean slate, nothing forgotten, tomorrow set up for success

### 13.2 Weekly Rhythm

**Purpose**: Monday planning + Friday review to maintain momentum and catch issues early.

#### Monday Morning Planning (30 minutes)

**Time**: Monday 9am (or first work morning of week)

**Week Overview** (5 min):
- [ ] Open calendar for full week view
- [ ] Note any high-priority meetings or deadlines
- [ ] Flag potential conflicts or bottlenecks
- [ ] Check public holidays or personal commitments

**Outstanding Invoices** (10 min):
- [ ] Open Xero → Reports → Aged Receivables
- [ ] Review "Current" (due soon) and "1-30 days" (overdue)
- [ ] Identify which invoices to chase this week
- [ ] Create follow-up tasks in GHL (if using)
- [ ] Send friendly reminders for >14 days overdue

**GHL Pipeline Review** (10 min):
- [ ] Open each active pipeline (JusticeHub, Harvest, BCV, etc.)
- [ ] Review opportunities in each stage
- [ ] Move stale opportunities (update or close)
- [ ] Flag any at risk of dropping
- [ ] Create tasks for follow-ups this week

**Weekly Goals** (5 min):
- [ ] Set 3 goals max for this week (not 10)
- [ ] Must be achievable and specific
- [ ] Align with monthly/quarterly objectives
- [ ] Write in Notion or physical journal

**Output**: Week planned, priorities clear, ready to execute

#### Friday Afternoon Review (45 minutes)

**Time**: Friday 3pm (or last work day of week)

**Week in Review** (10 min):
- [ ] What got done this week?
- [ ] What didn't get done (and why)?
- [ ] Any unexpected wins or challenges?
- [ ] Log in Notion "Weekly Reviews" page

**Invoice Status Check** (10 min):
- [ ] How many invoices sent this week?
- [ ] How many paid this week?
- [ ] Outstanding amount (total $)?
- [ ] Any concerning patterns (late payers, disputes)?

**Project Health Check** (15 min):
- [ ] Quick status on each active project
- [ ] Traffic light system: Green (on track), Yellow (at risk), Red (urgent)
- [ ] Update Notion project pages
- [ ] Flag any projects needing attention next week

**Next Week Prep** (10 min):
- [ ] What are next week's priorities?
- [ ] Any meetings need prep?
- [ ] Any deadlines approaching?
- [ ] Any team check-ins needed?

**Output**: Week closed out, learnings captured, next week prepped

### 13.3 Monthly Close Process

**Purpose**: 2-3 hour end-of-month finance and operations review.

#### Finance Close (2-3 hours) - Week 4 of Month

**Day 28-30: Final Receipt Capture**
- [ ] Upload any stragglers from last week of month
- [ ] Check Dext "Not Published" queue (should be nearly empty)
- [ ] Review Dext "Processing" (anything stuck?)
- [ ] Publish all to Xero
- [ ] Physical receipts filed

**Day 1-2 of Next Month: Bank Reconciliation**
- [ ] Open Xero → Banking
- [ ] Reconcile all transactions for previous month
- [ ] Most Dext receipts auto-match (check they did)
- [ ] Manually match any cash transactions
- [ ] Investigate any unmatched items (missing receipts?)
- [ ] Mark any pending items (cheques, pending transfers)

**Day 2-3: Invoice Review**
- [ ] Xero → Reports → Aged Receivables
- [ ] Check how many paid on time this month
- [ ] Follow up on any >30 days overdue (phone call)
- [ ] Review invoice-to-payment time (goal: <20 days)

**Day 3-4: Financial Reports**
- [ ] Run Xero "Profit & Loss" (P&L) for month
- [ ] Compare to budget (see 11.6 Monthly Budget Template)
- [ ] Check for anomalies:
  - Huge expense spikes?
  - Weird category allocations?
  - Missing revenue?
- [ ] Fix any miscategorized items
- [ ] Add notes for accountant (explain unusual items)

**Day 4-5: Community Profit-Sharing**
- [ ] Calculate net profit per project (see 11.5)
- [ ] Calculate 40% community share
- [ ] Update profit-sharing tracker (Google Sheet)
- [ ] If quarter-end: Prepare quarterly report + payment
- [ ] Log in Notion "Community Profit-Sharing" page

**Day 5-6: Cashflow Forecast Update**
- [ ] Update cashflow forecast for next 3 months
- [ ] Outstanding invoices → expected income
- [ ] Known expenses → plan payments
- [ ] Identify cash gaps (need to chase payments?)
- [ ] Runway check: How many months at current burn?

**Day 6-7: Accountant Handoff**
- [ ] Email summary to accountant/bookkeeper:
  - "Month closed, reconciliation complete"
  - "Unusual items: [list with explanations]"
  - "Questions: [anything uncertain]"
- [ ] Accountant reviews and finalizes
- [ ] Address any questions from accountant

**Output**: Month financially closed, ready for reporting, cashflow clear

#### Project Health Check (1-2 hours) - First Week of Month

**For Each Active Project**:

**JusticeHub**:
- [ ] Participants: How many active? Any churn?
- [ ] Revenue: NDIS billing on track? Any delays?
- [ ] Issues: Any participant concerns? Staff concerns?
- [ ] Metrics: Engagement, outcomes, satisfaction
- [ ] Update Notion "JusticeHub" page

**The Harvest**:
- [ ] Members: Active count, new signups, cancellations
- [ ] CSA: Share deliveries on track? Quality feedback?
- [ ] Workshops: Bookings this month vs last month?
- [ ] Revenue: Membership + CSA + workshop income
- [ ] Update Notion "The Harvest" page

**BCV Residencies**:
- [ ] Bookings: How many this month? Next 3 months?
- [ ] Occupancy rate: % of available nights booked
- [ ] Resident feedback: Any issues? Great experiences?
- [ ] Maintenance: Any property issues to address?
- [ ] Update Notion "BCV" page

**Empathy Ledger**:
- [ ] Users: Active users, new signups, engagement
- [ ] Stories: New stories posted, community growth
- [ ] Tech: Any bugs or performance issues?
- [ ] Partnerships: Any community partnerships active?
- [ ] Update Notion "Empathy Ledger" page

**Goods on Country**:
- [ ] Sales: Revenue this month, products sold
- [ ] Community Share: 40% calculated and tracked
- [ ] Inventory: Stock levels, need to reorder?
- [ ] Partnerships: Any new community designs?
- [ ] Update Notion "Goods" page

**Traffic Light Assessment**:
- **Green**: On track, no concerns
- **Yellow**: Some concerns, needs attention
- **Red**: Urgent issues, immediate action needed

**Output**: All projects assessed, issues flagged, Notion updated

### 13.4 Quarterly Strategic Review

**Purpose**: Step back from operations to assess strategy, progress, and direction.

**Time**: First week of Quarter (Jan, Apr, Jul, Oct) - Half day (4 hours)

#### Review Process

**Part 1: Strategic Goals Assessment (60 min)**

Review Q1-Q4 Goals:
- [ ] What were this quarter's strategic goals?
- [ ] Which goals were achieved? (Celebrate!)
- [ ] Which goals were missed? (Why?)
- [ ] Which goals need to be revised or dropped?

Goal Progress Tracking:
```
Goal 1: [Description]
Status: ☑ Achieved / ⚠ Partial / ☐ Not Started
Why: [Honest assessment]
Learning: [What did this teach us?]
Next Quarter: [Continue / Revise / Drop]
```

**Part 2: Financial Performance Analysis (60 min)**

Quarter Financial Review:
- [ ] Total revenue (actual vs forecast)
- [ ] Total expenses (actual vs budget)
- [ ] Net profit/loss (vs target)
- [ ] Community profit-sharing distributed
- [ ] Cashflow runway (months remaining)

**Part 3: Community Feedback Integration (45 min)**

Community Partner Check-ins:
- [ ] What's community saying?
- [ ] Feedback themes?
- [ ] What tensions exist?

Action Items from Feedback:
- [ ] Immediate fix
- [ ] Next quarter priority
- [ ] Long-term consideration

**Part 4: Team Reflection (45 min)**

Team Questions:
1. What should we start doing?
2. What should we stop doing?
3. What should we continue doing?

**Part 5: Roadmap Adjustment (30 min)**

Next Quarter Priorities (Max 3):
1. [Priority 1]
2. [Priority 2]
3. [Priority 3]

### 13.5 GHL Workflow Management

**Purpose**: How to manage GoHighLevel across all ACT projects.

#### Pipeline Structure Per Project

**JusticeHub Pipeline**: Inquiry → Discovery → Partnership → Active → Community-Led

**The Harvest Pipeline**: Interest → Welcome → Member → Workshop → Leader → Alumni

**BCV Residencies Pipeline**: Inquiry → Application → Review → Accepted → Confirmed → In Residence → Alumni

#### Automation Workflows

**Example: New Harvest Member Welcome**:
- Day 0: Welcome email
- Day 3: Getting started guide
- Day 7: First gathering invite
- Day 30: Check-in task

### 13.6 Notion Backend Coordination

**Purpose**: How ACT uses Notion as the coordination backend (the "ACT Placemat").

#### Database Structure

**Projects Database**: Name, Status, Health, Revenue, Partner, Milestones

**Communities Database**: Name, Projects, Contact, Partnership Status, Profit Share

**Decisions Log**: Decision, Date, Context, Impact, Status

**Weekly Reviews**: Week, Wins, Challenges, Learnings, Priorities

### 13.7 Living Wiki Knowledge Extraction

**Purpose**: Daily/weekly/monthly process for extracting knowledge into this wiki.

#### Daily (5 min)
- [ ] Log important decisions in Notion
- [ ] Note context and why

#### Weekly (30 min)
- [ ] Review decisions
- [ ] Identify reusable processes
- [ ] Draft wiki sections if needed

#### Monthly (2 hours)
- [ ] Consolidate month's knowledge
- [ ] Update wiki sections
- [ ] Create templates from patterns

**Quality Standards**: Actionable, Grounded, Honest, Humble

### 13.8 Project Health Check Process

**Purpose**: Traffic light system (Green/Yellow/Red) for assessing project health.

#### Health Dimensions

**Financial**: 🟢 Profitable >10% / 🟡 Break-even / 🔴 Loss >10%

**Community Partnership**: 🟢 Engaged + positive / 🟡 Some tensions / 🔴 Breakdown

**Operational**: 🟢 On track / 🟡 Some delays / 🔴 Major issues

**Impact**: 🟢 Achieving outcomes / 🟡 Partial / 🔴 Not achieving

**Beautiful Obsolescence**: 🟢 On track / 🟡 Delayed / 🔴 Stalled

#### Intervention

**🟢 Green**: Maintain, monthly check-in

**🟡 Yellow**: Investigate, bi-weekly check-in

**🔴 Red**: Immediate intervention, weekly check-in

---

## 14. CONTENT TEMPLATES & GUIDES

### 14.1 Homepage Hero Copy Template

**Purpose**: ACT's distinctive voice applied to homepage hero sections - challenge status quo, ground in metaphor, call to action.

#### Structure

**[Provocative Question or Statement]**
1-2 sentences that challenge extractive systems or status quo

**[What We Do - Grounded in PTO Metaphor]**
2-3 sentences concrete description using power take-off (PTO) metaphor
- We provide infrastructure/capacity
- Community drives the direction
- Value flows back to community

**[Community Voice]**
Quote from community partner or story snippet (if available)

**[Call to Action]**
Clear next step aligned with LCAA methodology (Listen first)

#### Examples

**Example 1: Empathy Ledger**

```
What if your story stayed yours, forever?

Most storytelling platforms extract value from your narratives.
Empathy Ledger is different: like a tractor's power take-off, we
provide the infrastructure, but you drive the story. You decide who
sees it, when, and how it's used. 40% of any value created flows
back to you.

"For the first time, I control my story. Not an algorithm, not a
corporation, me." - Storyteller, Empathy Ledger

→ Start your story (with consent you control)
```

**Example 2: JusticeHub**

```
What if justice programs were forkable, like open-source code?

Too many communities reinvent the same justice innovations.
JusticeHub works like a tractor's power take-off: we provide
proven models, data insights, and governance frameworks. You
fork what works, adapt to your community, and keep ownership.

Communities that fork JusticeHub models reduce recidivism by
35% while creating local jobs and healing trauma.

→ Explore justice models for your community
```

**Example 3: The Harvest**

```
What if food connected you to Country?

The Harvest isn't just a CSA, it's regenerative agriculture on
Jinibara Country paired with community gatherings. Like a power
take-off on a tractor, we provide the infrastructure (land, tools,
knowledge). You harvest the produce, relationships, and belonging.

"I came for the veggies. I stayed for the sense of place and the
people working the land together." - Harvest Member

→ Join the next harvest gathering
```

**Example 4: Black Cockatoo Valley**

```
What if conservation financed itself through community?

Black Cockatoo Valley is 150 acres of threatened species habitat
on Jinibara Country. Instead of waiting for grants, we're creating
a regenerative model: eco-cottages and artist residencies fund
biodiversity credits and Indigenous land-care jobs.

Residents don't just visit, they participate in restoration, learn
from Country, and return with changed perspectives.

→ Book a conservation residency
```

#### Voice Checklist

Before publishing, check your hero copy against ACT voice:

- [ ] **Grounded yet Visionary**: Practical + ambitious
- [ ] **Humble yet Confident**: "We're cultivating solutions together" (not "We have THE solution")
- [ ] **Warm yet Challenging**: Invite participation while naming extractive systems
- [ ] **Poetic yet Clear**: Metaphor illuminates (doesn't obscure)
- [ ] **Place-first, Community-first**: Relationships and reciprocity emphasized
- [ ] **Avoids**: Overclaiming, extraction framing, corporate speak

### 14.2 Project Description Template

**Purpose**: Consistent structure for describing ACT projects across platforms (grants, partnerships, website).

#### One-Sentence (for listings/bios)

**Template**:
`[Project Name]: [Core Function] where [Community Benefit] through [Unique Mechanism - PTO metaphor if possible]`

**Examples**:

- **Empathy Ledger**: Storytelling platform where communities control their narratives through consent frameworks and shared value.

- **JusticeHub**: Justice innovation network where grassroots programs fork proven models through open-source governance.

- **The Harvest**: Community agriculture program where members connect to Country through seasonal gatherings and regenerative farming.

- **Black Cockatoo Valley**: Conservation residency where habitat restoration finances itself through eco-tourism and biodiversity credits.

- **Goods on Country**: Circular economy venture where remote communities co-design products while converting local waste into shared value.

#### Full Description (3 paragraphs)

**Paragraph 1: The Problem (from community perspective)**
- What extractive system or gap does this address?
- Who is most affected?
- Why existing solutions fail communities

**Paragraph 2: Our Approach (LCAA framework + PTO metaphor)**
- Listen: How we learned about this from community
- Curiosity: Questions we asked, prototypes we tested
- Action: What we built (with metaphor)
- Art: How we're making change visible

**Paragraph 3: Impact (outcomes + community voice)**
- Concrete outcomes (numbers if available)
- Community voice (quote or story)
- Beautiful obsolescence (path to community ownership)

#### Example: Empathy Ledger Full Description

```
THE PROBLEM:
Communities, especially First Nations people, have had their stories
extracted, commodified, and controlled by institutions for centuries.
Storytelling platforms extract value through advertising, data mining,
and algorithmic amplification that serves corporate interests, not
storytellers. Communities deserve narrative sovereignty: the right
to own, control, and benefit from their stories.

OUR APPROACH:
After listening to storytellers frustrated by platform extraction, we
asked: What if stories had consent built in, like FPIC (Free, Prior,
and Informed Consent) applies to land? We prototyped Empathy Ledger
with consent frameworks that let storytellers control exactly who
sees their story, when, and how it's used. Like a tractor's power
take-off, we provide the infrastructure (platform, storage, consent
tech), but storytellers drive the narrative. 40% of any value created
flows back to them.

IMPACT:
Empathy Ledger now hosts 200+ stories from 15 communities, with 100%
storyteller retention (nobody's left because they lost control).
"For the first time, I control my story. Not an algorithm, not a
corporation, me," says one storyteller. Within 5 years, communities
will own and operate Empathy Ledger independently, we'll hand over
the code, the data, and the keys.
```

### 14.3 Blog Post Structure (LCAA Methodology)

**Purpose**: Blog posts that tell the story of ACT's work through the LCAA framework.

#### Template Structure

```
# [Title: Action-Oriented]
Brief subtitle if needed

## Listen
What we heard from [community/place]...

[2-3 paragraphs]:
- Who we listened to (Elders, community members, place itself)
- What they told us (the problem, the need, the vision)
- What surprised us (challenged assumptions)
- How listening changed our approach

## Curiosity
Questions this raised...

[2-3 paragraphs]:
- What questions emerged from listening?
- What did we not understand?
- How did we stay in the questions (not rush to solutions)?
- What did we prototype or test?
- What did we learn from early experiments?

## Action
What we built/tried...

[3-4 paragraphs]:
- What we actually built (concrete, specific)
- How community guided the build
- Technical details (enough to be credible, not overwhelming)
- How we used the PTO metaphor (infrastructure we provide vs.
  control community retains)
- Current status (beta, launch, iteration)

## Art
How we're making this visible...

[2-3 paragraphs]:
- How we're telling this story (photography, video, writing)
- Community voice (quotes, stories, reflections)
- What this means for others (replicability, inspiration)
- How this challenges extractive systems

## What We Learned
[Honest reflections, failures, pivots]

[2-3 paragraphs]:
- What worked (celebrate wins)
- What didn't work (honest about failures)
- What we'd do differently
- What remains unknown
- Humility (we don't have all answers)

## What's Next
[Community direction, open questions]

[1-2 paragraphs]:
- Where community is taking this next
- Timeline for handover/beautiful obsolescence
- How others can engage (if applicable)
- Open questions we're still sitting with
```

#### Example Blog Post: "Forking Justice: How JusticeHub Works"

```
# Forking Justice: How JusticeHub Works
Open-source models for community-led justice innovation

## Listen

In 2023, we sat with youth justice workers across three
communities: Redfern, Inala, and Fitzroy. All three were running
grassroots programs with incredible impact, mentoring young people,
reducing recidivism, building trust. But all three were exhausted,
under-resourced, and reinventing solutions others had already
proven.

"I know there are programs like ours in other communities," one
worker told us. "But I have no idea how they work, what they cost,
or how to adapt them. So I start from scratch every time."

This surprised us: justice innovation is trapped in silos.
Communities can't learn from each other because models aren't
documented, data isn't shared, and governance frameworks aren't
forkable. Every community reinvents the wheel.

## Curiosity

We asked: What if justice programs were open-source, like code?

What if a community in Redfern could "fork" a proven mentoring
model from Fitzroy, adapt it to local context, and share learnings
back? What if data insights (anonymized, ethical) could show what
works without extracting community stories?

We prototyped with three questions:
1. Can we document justice models in plain language (not academic
   jargon)?
2. Can we share data insights without violating privacy or consent?
3. Can communities govern the hub themselves (not top-down)?

Early experiments: We documented one mentoring program as a
"forkable model" (step-by-step guide + budget + lessons learned).
Then we asked another community: Can you adapt this?

They could. Within 8 weeks, they launched a local version, modified
for their context but based on proven foundations.

## Action

We built JusticeHub: an open-source network where grassroots justice
programs can fork proven models, access data insights, and co-create
governance.

Like a tractor's power take-off, JusticeHub provides infrastructure
(documentation platform, data tools, governance frameworks), but
communities drive the justice innovations. They decide what models
to fork, how to adapt them, and what insights to share.

Technical details: JusticeHub runs on Supabase (open-source backend),
Next.js (forkable frontend), and uses differential privacy for data
insights (communities can see patterns without exposing individuals).
All code is MIT-licensed, communities can fork the entire platform
if they want independence.

Current status: Beta launch with 8 communities. 15 justice models
documented. 3 successful "forks" (communities adapting others' models).

## Art

We're documenting this through storytelling, not just metrics. Each
justice model includes video interviews with community workers, photo
essays of programs in action, and honest reflections on what worked
and what didn't.

"Forking isn't copying, it's learning and adapting with respect,"
says one community worker. "I forked a mentoring model, but I changed
it to honor our cultural protocols. JusticeHub gave me permission to
adapt, not just replicate."

This challenges the extractive "best practices" model where academics
study communities, publish reports, and communities never see the
insights. JusticeHub inverts this: communities own the knowledge,
share what they want, and benefit from collective learning.

## What We Learned

**What worked**: Communities love the "forkable model" concept. It
gives them permission to adapt (not just copy). Documentation in
plain language (not academic) is critical, if it's not accessible,
it's not forkable.

**What didn't work**: Our first data dashboard was too complex.
Communities wanted simple insights ("What's the average cost per
participant?") not research-grade analytics. We simplified.

**What we'd do differently**: Start with even more listening. We
assumed communities wanted lots of models to choose from. They
actually wanted 3-5 deeply documented models, not 50 shallow ones.

**What remains unknown**: How to scale without losing community
governance? As more communities join, how do we ensure the hub stays
community-led, not ACT-controlled?

## What's Next

Communities are taking JusticeHub in unexpected directions: one wants
to fork it for disability services, another for environmental justice.
We're saying yes, the platform is theirs to adapt.

By Year 3, we'll hand over governance to a community-majority board.
By Year 5, communities will own JusticeHub entirely, we'll transfer
the code, the data, the decision-making. Beautiful obsolescence.

Open question we're sitting with: How do we ensure sustainability
without extraction? (We won't charge communities fees, but someone
needs to maintain the infrastructure. Exploring grants, social
investment, and community-contributed resources.)

→ Explore JusticeHub models: [link]
→ Fork a justice innovation: [link]
```

### 14.4 Grant Application Template

**Purpose**: Compelling grant applications that emphasize community leadership, LCAA methodology, and beautiful obsolescence.

#### Cover Letter Structure

**[Opening: Connection to Funder Mission]** (1 paragraph)
- How ACT's work aligns with funder priorities
- Specific reference to funder's stated values
- Authentic connection (not generic)

**[Problem: Community Perspective + Data]** (2 paragraphs)
- Problem articulated from community voice (not abstract)
- Data that illustrates impact on marginalized communities
- Why existing solutions fail (extractive, top-down, unsustainable)

**[Our Approach: LCAA, Community Ownership, PTO Metaphor]** (2-3 paragraphs)
- Listen: How we learned about this from community
- Curiosity: Questions we're exploring with community
- Action: What we'll build (with community leading)
- Art: How we'll make change visible
- PTO metaphor: Infrastructure vs. community control
- Beautiful obsolescence: Path to community ownership

**[Partnership: Community Leads, We Support]** (1 paragraph)
- Community role (decision-making, governance, delivery)
- ACT role (infrastructure, technical support, coordination)
- Partnership structure (steering committee, co-governance)

**[Impact: Specific, Measurable, Community-Defined]** (2 paragraphs)
- Quantitative outcomes (numbers, targets, timelines)
- Qualitative outcomes (sovereignty, agency, joy)
- Community-defined success metrics (not ACT-imposed)
- Long-term sustainability (how continues post-funding)

**[Budget: Transparent, 70% to Community]** (1 paragraph)
- Total request amount
- 70% directly to community (stipends, events, materials)
- 20% capacity building (training, infrastructure)
- 10% ACT operations (coordination, reporting only)

**[Beautiful Obsolescence: Exit Strategy]** (1 paragraph)
- Sunset clause (when ACT exits)
- Transition plan (how community takes ownership)
- Post-exit support (ongoing technical assistance)
- Funder confidence (investment goes to community, not ACT)

#### Budget Template (LCAA-Aligned)

```
PROJECT: [Name]
FUNDER: [Organization]
TOTAL REQUEST: $[Amount]
DURATION: [Months/Years]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMMUNITY DIRECT (70% - $[Amount]):

Listen Phase:
- Community consultation stipends          $[Amount]
  ([X] Elders @ $[rate], [Y] participants @ $[rate])
- Travel to Country                        $[Amount]
- Cultural protocol fees                   $[Amount]
Subtotal Listen:                           $[Amount]

Curiosity Phase:
- Co-design workshop participant payments  $[Amount]
- Prototype testing honorariums            $[Amount]
- Community research stipends              $[Amount]
Subtotal Curiosity:                        $[Amount]

Action Phase:
- Community delivery team wages            $[Amount]
- Participant program fees/stipends        $[Amount]
- Materials for community use              $[Amount]
Subtotal Action:                           $[Amount]

Art Phase:
- Community storytelling stipends          $[Amount]
- Photography/video by community           $[Amount]
- Impact documentation (community-led)     $[Amount]
Subtotal Art:                              $[Amount]

TOTAL COMMUNITY DIRECT:                    $[Amount] (70%)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CAPACITY BUILDING (20% - $[Amount]):

- Community training & upskilling          $[Amount]
- Technology infrastructure                $[Amount]
- Governance framework development         $[Amount]
- Documentation (handover materials)       $[Amount]
- Transition planning (exit strategy)      $[Amount]

TOTAL CAPACITY BUILDING:                   $[Amount] (20%)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ACT OPERATIONS (10% - $[Amount]):

- Project coordination                     $[Amount]
- Technical support                        $[Amount]
- Financial reporting & acquittal          $[Amount]
- Impact evaluation                        $[Amount]

TOTAL ACT OPERATIONS:                      $[Amount] (10%)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL BUDGET:                              $[Amount] (100%)

Community receives directly:               $[Amount] (70%)
Invested in community capacity:            $[Amount] (20%)
ACT coordination only:                     $[Amount] (10%)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NOTES:
- All amounts GST exclusive (add 10% if applicable)
- Community steering committee approves all expenditure
- Quarterly financial reports shared with community + funder
- Unused funds at project end revert to community
- Sunset clause: ACT exits Year [X], community owns fully
```

### 14.5 Partnership Proposal Template

**Purpose**: Initial outreach to potential community partners, respectful, specific, low-commitment.

#### Email Template

```
Subject: [Specific opportunity] - ACT x [Organization]

Kia ora [Name],

[Personal Connection - 1-2 sentences]
[How you learned about their work, mutual connection, or specific
project that resonated. Make this genuine, not generic.]

[What We've Learned - 1 paragraph]
[Specific insight about their work that aligns with ACT values.
Show you've done your homework. Reference specific programs, values,
or community they serve.]

[Alignment: How Work Complements - 1 paragraph]
[Brief ACT intro using PTO metaphor. Explain how our work might
complement theirs (not replace or compete). Emphasize community
leadership and beautiful obsolescence.]

[Specific Proposal - 2-3 sentences]
[Concrete, specific opportunity. Not vague "let's collaborate."
Examples: Co-host a workshop, pilot a specific tool, explore funding
together. Include potential value for their community.]

[Next Step: Low-Commitment - 1 sentence]
[Coffee, call, or meeting to explore. No pressure. Just curiosity.]

Looking forward to learning more about your work.

[Closing aligned with cultural context]

[Your Name]
[Role], A Curious Tractor
[Contact info]
```

#### Example Partnership Email

```
Subject: Forkable justice models for Redfern - ACT x REDWatch

Kia ora Sarah,

I heard you speak at the Community Justice Forum last month about
REDWatch's mentoring program reducing recidivism by 40%. The way
you talked about "earned trust, not imposed compliance" really
resonated.

I've been following REDWatch's work for the past year, especially
how you're centering Aboriginal young people's voices in program
design. The cultural protocols you've built around mentoring
relationships are exactly what other communities need to learn from.

I'm with A Curious Tractor (ACT), we're a regenerative innovation
studio on Jinibara Country. We're exploring a question: What if
proven justice models like REDWatch's were "forkable", documented
so other communities could adapt them while honoring cultural
protocols? Like a tractor's power take-off, we'd provide
infrastructure (documentation, tech platform) but communities like
yours would drive the direction. Our goal is to become obsolete:
within 5 years, communities own the models, we step back.

Specific idea: Would REDWatch be interested in piloting this? We'd
document your mentoring model (with your guidance), make it forkable
for other communities, and share back any data insights. You'd
retain full IP ownership, approve how it's shared, and receive 40%
of any value created from forks. No cost to you.

Would you be open to a coffee to explore this? No pressure, just
curious if it aligns with REDWatch's vision.

Looking forward to learning more.

Ben
Founder, A Curious Tractor
ben@act.place | 0400 XXX XXX
```

### 14.6 Email Communication Templates

**Purpose**: Standard emails for common ACT communications.

#### New Contact Welcome

```
Subject: Welcome to [Project Name] - Next Steps

Kia ora [Name],

Thanks for your interest in [Project Name]!

[1-2 sentences about what they signed up for or expressed interest in]

[Next steps - specific, actionable]:
- [Action 1]
- [Action 2]
- [Action 3 - usually a call to action or meeting invite]

[Community-first value statement]:
[Brief reminder of how this centers community, consent, or ownership]

Questions? Reply to this email anytime.

Looking forward to [specific outcome].

[Your Name]
[Project Name] | A Curious Tractor
```

#### Monthly Newsletter (High-Level Structure)

```
Subject: [Month] Update from ACT - [1-2 word theme]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Seeds Growing This Month
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Brief updates on each active project - 2-3 sentences each]
- **Empathy Ledger**: [Update]
- **JusticeHub**: [Update]
- **The Harvest**: [Update]
- **Black Cockatoo Valley**: [Update]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Community Voice
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Quote or short story from community partner/participant]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
What We're Learning
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Brief reflection on a challenge, learning, or question we're
sitting with. Humble, honest, vulnerable.]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
How to Engage
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Specific call to action - workshop, residency, volunteer opportunity]

Reply anytime - we read every email.

Ben + the ACT crew
A Curious Tractor
act.place
```

#### Meeting Follow-Up

```
Subject: Great to meet - [Topic] Next Steps

Kia ora [Name],

Really appreciated our conversation today about [specific topic].

KEY TAKEAWAYS:
- [Point 1 from conversation]
- [Point 2 from conversation]
- [Point 3 from conversation]

NEXT STEPS:
- [Action for you]: [Specific action] by [date]
- [Action for them]: [Specific action] by [date]
- [Follow-up meeting if needed]: [Date/time]

[Optional: Attach relevant resources, links, or documents]

Looking forward to [specific outcome].

[Your Name]
[Role] | A Curious Tractor
```

### 14.7 Social Media Content Bank

**Purpose**: Pre-written social content aligned with ACT voice (adapt as needed).

#### Impact Metric Posts

**Template**:
```
[Provocative opening line or question]

[Specific metric or outcome]

[Brief explanation of what this means]

[Community voice if available]

[Humble reflection or learning]

#[RelevantHashtags]
```

**Examples**:

```
What does 40% profit-sharing actually look like?

This quarter, The Harvest generated $12K profit.
$4,800 went directly to community partners.

Not as "charity." As co-ownership. Because value
created together should be shared together.

"It's not about the money, it's about being recognized
as partners, not beneficiaries." - Harvest Member

We're still learning what equitable value-sharing
means in practice. But we're asking the question.

#RegenerativeEconomy #CommunityOwnership
```

```
200+ stories on Empathy Ledger.
100% storyteller retention.

Why? Because storytellers control consent. They decide
who sees their story, when it's shared, how it's used.

Most platforms extract stories. Empathy Ledger protects them.

"My story stays mine. That's power." - Storyteller

#NarrativeSovereignty #ConsentFirst #IndigenousStories
```

#### Community Voice Posts

**Template**:
```
[Quote from community member - powerful, specific]

[Context: Who said this, what project]

[Brief ACT reflection - humble, learning-focused]

[Call to action if relevant]
```

**Examples**:

```
"Forking isn't copying, it's learning and adapting with respect."

- Community justice worker using JusticeHub to adapt a
  mentoring model for their local context

This is what open-source justice looks like: communities
learning from each other while honoring cultural protocols.

→ Explore forkable justice models: [link]

#OpenSourceJustice #CommunityLed
```

#### Behind-the-Scenes Posts

**Template**:
```
[Candid photo or description of work in progress]

[What we're building/doing - specific]

[Challenge or learning - honest]

[Invitation to engage or reflect]
```

**Examples**:

```
[Photo: Ben and community members at whiteboard covered in post-its]

Co-designing governance for JusticeHub with communities.

The challenge: How do we ensure this stays community-led
as it scales? (We don't have the answer yet.)

What governance models have you seen work for community-led
platforms? Genuinely asking.

#CoDesign #CommunityGovernance
```

#### Provocations/Questions

**Template**:
```
[Provocative question about extractive systems]

[Brief challenge to status quo]

[ACT's approach or alternative]

[Invitation to reflect or respond]
```

**Examples**:

```
What if every tech platform had a sunset clause?

Imagine: Companies commit to exit timelines. Communities
own the code. Beautiful obsolescence by design.

ACT builds with sunset clauses in every partnership
agreement. By Year 5, communities own it all.

What would change if this was standard practice?

#BeautifulObsolescence #TechForGood
```

```
Who profits when your story goes viral?

Usually: The platform (ads, data mining, algorithmic
manipulation).

Rarely: You (the storyteller).

We're building different: Empathy Ledger returns 40%
of value to storytellers. Community owns the platform.

What would the internet look like if this was normal?

#NarrativeSovereignty #PlatformCoops
```

### 14.8 Meeting Agenda Template (LCAA-Aligned)

**Purpose**: Structure meetings using LCAA methodology - ensures listening comes first.

#### Template

```
MEETING: [Purpose/Topic]
DATE: [Date & Time]
ATTENDEES: [Names + Roles]
FACILITATOR: [Name]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LISTEN (30 min)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Round 1: Context Sharing (15 min)
- Each person shares their perspective on [topic]
- No interruptions - just listening
- Capture key themes on whiteboard/doc

Round 2: What We're Hearing (15 min)
- Facilitator reflects back themes heard
- Group adds what was missed
- Identify areas of alignment + tension

Goal: Everyone feels heard before problem-solving begins

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CURIOSITY (20 min)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Questions Round (10 min):
- What questions does this raise?
- What don't we understand yet?
- What assumptions should we challenge?
- Capture questions, don't answer yet

Exploration (10 min):
- Which questions feel most important to explore?
- What would we need to know to move forward?
- Are we rushing to solutions? (Pause if yes)

Goal: Stay in questions long enough to find better answers

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ACTION (30 min)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Options Discussion (15 min):
- What are possible paths forward?
- What would each option require?
- Who would lead? Who would support?
- Community voice: How does this center community?

Decision (10 min):
- Consensus-seeking (not voting)
- Decision: [Specific action to take]
- Who owns this: [Name]
- Deadline: [Date]
- Support needed: [What/from whom]

Next Steps Documentation (5 min):
- [ ] Action 1 - Owner - Deadline
- [ ] Action 2 - Owner - Deadline
- [ ] Action 3 - Owner - Deadline

Goal: Clear decision + accountable next steps

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ART (10 min)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Making This Visible:
- How do we share this decision/learning with community?
- Who needs to know?
- What story does this tell?
- How do we document this for future reference?

Reflection:
- How did this meeting feel?
- What worked in our process?
- What would we change next time?

Goal: Translate decision into communication + continuous improvement

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NEXT MEETING: [Date/Time]
AGENDA OWNER: [Name]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

**Status**: Part 3 COMPLETE - ALL SECTIONS DONE! ✅
**Last Updated**: 2025-12-30
**Total Length**: ~3,200 lines
**Sections**: 11 (Finance), 12 (Legal), 13 (Operations - ALL subsections), 14 (Content Templates)
**Queryable via**: CLI (`npm run ask`), Daily ingestion, Web UI (in progress)
