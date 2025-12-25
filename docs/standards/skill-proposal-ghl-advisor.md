# Claude Skill Proposal: GHL CRM Strategy Advisor

## Overview

A custom Claude Code skill to provide ongoing strategic support for GoHighLevel CRM implementation, optimization, and evolution across all 4 ACT projects.

---

## Why Build This Skill?

### Current Challenge
- **Complex multi-project CRM**: 4 distinct projects, 12+ pipelines, 50+ automation workflows
- **Evolving needs**: New programs launch, user journeys change, campaigns evolve
- **Team learning curve**: GHL is powerful but complex, team needs ongoing support
- **Consistency required**: Maintain unified strategy across projects while honoring unique identities

### Solution
A dedicated Claude skill that:
- ✅ Knows your entire GHL architecture
- ✅ Understands all 4 ACT projects deeply
- ✅ Can generate workflows, emails, pipelines on demand
- ✅ Provides strategic recommendations
- ✅ Troubleshoots issues
- ✅ Trains team members

---

## Skill Capabilities

### 1. **Pipeline Design & Optimization**

**User asks**:
> "We're launching a new CSA subscription program at The Harvest. What pipeline stages should we use?"

**Skill generates**:
```
CSA Subscription Pipeline - The Harvest

Stages:
1. Interest Expressed - Filled out CSA interest form
2. Box Size Selected - Chose weekly/fortnightly, small/medium/large
3. Payment Set Up - Stripe subscription created
4. Active Subscriber - Receiving boxes weekly/fortnightly
5. Paused - Temporarily suspended (vacation, etc.)
6. Cancelled - No longer subscribing
7. Re-engagement - Win-back campaign

Automation Triggers:
- Interest expressed: Send CSA guide (what's included, pickup locations, pricing)
- Payment set up: Welcome pack, first box ETA, farm tour invitation
- 3 days before first box: Reminder SMS with pickup location
- Weekly: Box ready notification
- After 3 months: Satisfaction survey
- After 6 months: Referral request (friend gets first box free)
- Paused: Check-in, "ready to resume?" monthly
- Cancelled: Exit survey, "We'd love you back" campaign after 90 days

Custom Fields:
- box_size (small/medium/large)
- frequency (weekly/fortnightly)
- pickup_location (Witta General Store, Maleny IGA, etc.)
- dietary_preferences (vegetarian, no nightshades, etc.)
- subscription_start_date
- lifetime_value (total $ spent)
```

---

### 2. **Workflow Scripting**

**User asks**:
> "Write a 7-email nurture sequence for ACT Farm residency alumni to encourage return visits"

**Skill generates**:
```
ACT Farm Alumni Nurture Sequence

Email 1 (Day 30 post-residency): "Welcome to the BCV Alumni Network"
Subject: You're officially part of the Black Cockatoo Valley family 🦜
Body:
[Name],

We hope you're still feeling the regenerative energy from your time at Black
Cockatoo Valley! Your research on [research_focus] during your residency was
inspiring to witness.

As an alumni, you're part of a growing network of conservation innovators...

[Continue with alumni benefits, network introductions, research outputs request]

---

Email 2 (Day 60): "How's your research progressing?"
Subject: Following up on [research_focus]
Body:
[Personal check-in about their specific research project]
[Offer: ongoing support, equipment access, data sharing]

---

Email 3 (Day 90): "New monitoring tools we've added since you were here"
Subject: BCV Tech Updates: [specific tool relevant to their work]
Body:
[Share innovations made since their residency]
[Implication: "You should come back and test this"]

---

Email 4 (Day 120): "Alumni spotlight: [another alumni's breakthrough]"
Subject: You'll want to read this - [Alumni Name]'s latest findings
Body:
[Social proof: other alumni are still engaged, producing outcomes]
[Invitation: alumni gathering, research symposium]

---

Email 5 (Day 150): "Return residency discount: 20% off for alumni"
Subject: We miss you (and so do the wallabies) 🦘
Body:
[Nostalgia trigger: specific moment from their residency]
[Offer: 20% discount on return residency, priority booking]
[CTA: "Check availability"]

---

Email 6 (Day 180): "Research partnership opportunity"
Subject: USC collaboration - is this up your alley?
Body:
[Specific research partnership that aligns with their expertise]
[Value: co-authorship, funding, equipment access]
[CTA: Expression of interest]

---

Email 7 (Day 210): "Your alumni survey"
Subject: 5 minutes to help shape the future of BCV residencies
Body:
[Feedback request: what worked, what could improve]
[Incentive: entered to win free weekend return visit]
[Final CTA: "Or just book a return visit now"]

---

Workflow Logic:
- If they book a return residency at ANY point → Stop sequence, move to "Return Resident" workflow
- If they respond to ANY email → Tag "engaged_alumni", personalized follow-up
- If they don't open after Email 3 → Add tag "unengaged_alumni", reduce frequency
- After sequence ends → Monthly newsletter only, re-engagement campaign every 6 months
```

---

### 3. **Tag Strategy & Organization**

**User asks**:
> "What tags should I use for tracking JusticeHub campaign participants across different levels of engagement?"

**Skill generates**:
```
JusticeHub Campaign Tag Architecture

Base Tags:
- justicehub
- campaign:contained

Participation Level Tags:
- campaign-participant:nominee (nominated a leader)
- campaign-participant:nominator (was nominated)
- campaign-participant:attendee (booked/attended experience)
- campaign-participant:advocate (one-time public support)
- campaign-participant:ambassador (ongoing champion)

Engagement Stage Tags:
- campaign-stage:nominated (leader nominated, not yet contacted)
- campaign-stage:contacted (outreach sent)
- campaign-stage:engaged (responded positively)
- campaign-stage:booked (facility visit scheduled)
- campaign-stage:attended (completed experience)
- campaign-stage:declined (not interested)

Action Tags:
- campaign-action:media-interview (gave interview post-experience)
- campaign-action:policy-change (influenced legislation)
- campaign-action:public-statement (issued statement)
- campaign-action:social-share (shared on social media)
- campaign-action:referral (referred another leader)

Special Tags:
- campaign-priority:high (state/federal politician, major media)
- campaign-priority:medium (local politician, business leader)
- campaign-priority:low (community leader)

Tag Usage Example:
Leader "Jane Smith" (State MP) nominated by community member:
- justicehub
- campaign:contained
- campaign-participant:nominee
- campaign-stage:nominated
- campaign-priority:high
- category:state-politician

After she attends and issues public statement:
- Remove: campaign-stage:nominated
- Add: campaign-stage:attended, campaign-action:public-statement
- Upgrade: campaign-participant:advocate (or ambassador if ongoing)

This creates searchable segments:
- "All high-priority nominees not yet contacted" → campaign-priority:high + campaign-stage:nominated
- "All attendees who haven't taken public action" → campaign-stage:attended - campaign-action:*
- "All ambassadors for quarterly briefing" → campaign-participant:ambassador
```

---

### 4. **Reporting & Analytics Queries**

**User asks**:
> "Show me conversion rates from inquiry to booking for ACT Farm residencies"

**Skill generates**:
```
ACT Farm Residency Conversion Analysis

Data to pull from GHL:

1. Pipeline: "Residency Pipeline"

2. Conversion Metrics:
   - Inquiry → Application Sent: (Count in "Application Sent") / (Count in "Inquiry") × 100
     Target: 60% (high-quality inquiries due to $300-500/night price)

   - Application Sent → Application Received: (Count in "Application Received") / (Count in "Application Sent") × 100
     Target: 80% (most who receive form complete it)

   - Application Received → Approved: (Count in "Approved") / (Count in "Application Received") × 100
     Target: 70% (conservation mission alignment filter)

   - Approved → Booked: (Count in "Dates Confirmed") / (Count in "Approved") × 100
     Target: 85% (most approved do book, may take time for scheduling)

   - Booked → Attended: (Count in "Completed") / (Count in "Dates Confirmed") × 100
     Target: 95% (very few cancellations due to prepay)

3. Overall Funnel:
   - Inquiry → Completed: (Count in "Completed") / (Count in "Inquiry") × 100
     Target: 30-40% (industry benchmark for high-touch, premium offerings)

4. Time Metrics:
   - Average time in each stage (days)
   - Total time from inquiry to residency start (target: 30-60 days)

5. Drop-off Analysis:
   - Where do most people exit pipeline? (likely: Application Sent → Application Received, or Approved → Booked)
   - Why? (too complex application form, pricing, scheduling conflicts)

6. Optimization Recommendations:
   - If Application Sent → Received is <70%: Simplify application form, send reminder after 7 days
   - If Approved → Booked is <75%: Follow up with calendar availability earlier, offer more flexible dates
   - If Time from Inquiry → Completed is >90 days: Speed up review process, automate more touchpoints

7. GHL Report to Build:
   - Custom report: "Residency Funnel"
   - Columns: Stage, Count, Conversion %, Avg Days in Stage, Revenue Value
   - Filters: Date range, Residency type (R&D, Creative, Wellbeing), Price tier ($300/$400/$500)
   - Schedule: Weekly email to team
```

---

### 5. **Integration Support**

**User asks**:
> "How do I connect Stripe payments to ACT Farm residency bookings in GHL?"

**Skill generates**:
```
Stripe + GHL Integration for ACT Farm Residencies

Option 1: GHL Native Stripe Integration (Recommended)

Setup:
1. In GHL: Settings → Payments → Connect Stripe
2. Authorize Stripe account access
3. Map products:
   - Create product "R&D Residency" ($300-500/night, custom pricing)
   - Create product "Workshop Ticket" ($50-150, fixed pricing)

Booking Flow:
1. User fills contact form → Creates contact in GHL
2. Contact moves to "Approved" stage in Residency Pipeline
3. Automation triggers: Send email with Stripe payment link
4. Payment link includes:
   - Residency type dropdown (R&D, Creative, Wellbeing)
   - Number of nights (1-14)
   - Dynamic pricing (nights × $300-500)
   - Deposit option (50% now, 50% 14 days before arrival)
5. Upon payment:
   - Webhook fires to GHL
   - Contact moves to "Payment Received" stage
   - Automation sends: Receipt, pre-arrival pack, calendar invite
   - Creates GHL invoice for records

Webhook Setup:
1. In Stripe: Developers → Webhooks → Add endpoint
2. URL: https://services.leadconnectorhq.com/webhooks/stripe/{your-ghl-account-id}
3. Events to listen for:
   - charge.succeeded (payment received)
   - charge.refunded (cancellation processed)
   - invoice.payment_failed (retry payment reminder)

GHL Custom Fields to Update:
- payment_status (pending/deposit_paid/fully_paid/refunded)
- stripe_charge_id (for reference)
- amount_paid ($)
- balance_due ($)
- payment_date

---

Option 2: Custom API Integration (If need more control)

ACT Farm Codebase:
File: /app/api/residency-booking/route.ts

import Stripe from 'stripe';
import { createGHLClient } from '@/lib/ghl/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const ghlClient = createGHLClient();

export async function POST(request: Request) {
  const { contactId, nights, residencyType, pricePerNight } = await request.json();

  // Create Stripe Checkout Session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'aud',
        product_data: {
          name: `${residencyType} Residency - ${nights} nights`,
        },
        unit_amount: pricePerNight * nights * 100, // Stripe uses cents
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_URL}/booking-confirmed?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/residencies`,
    metadata: {
      contactId,
      nights,
      residencyType,
    },
  });

  // Update GHL contact with payment link
  await ghlClient.contacts.updateCustomFields(contactId, {
    stripe_checkout_url: session.url,
    payment_status: 'pending',
  });

  return Response.json({ checkoutUrl: session.url });
}

Webhook Handler:
File: /app/api/webhooks/stripe/route.ts

export async function POST(request: Request) {
  const sig = request.headers.get('stripe-signature')!;
  const body = await request.text();
  const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { contactId, nights, residencyType } = session.metadata;

    // Update GHL contact
    await ghlClient.contacts.updateCustomFields(contactId, {
      payment_status: 'fully_paid',
      amount_paid: session.amount_total / 100,
      payment_date: new Date().toISOString(),
      stripe_charge_id: session.payment_intent,
    });

    // Move to next pipeline stage
    await ghlClient.opportunities.updateStage(contactId, 'payment-received-stage-id');

    // Trigger confirmation workflow
    await ghlClient.workflows.trigger(process.env.GHL_BOOKING_CONFIRMED_WORKFLOW_ID!, {
      contactId,
    });
  }

  return Response.json({ received: true });
}

Recommendation: Use Option 1 (GHL Native) for simplicity. Use Option 2 if you need custom pricing logic, subscription billing for June's Patch, or payment plans.
```

---

### 6. **Team Training Materials**

**User asks**:
> "Create a quick reference guide for The Harvest coordinators on how to manually move volunteers through the pipeline"

**Skill generates**:
```markdown
# The Harvest Volunteer Pipeline - Coordinator Quick Reference

## When to Update Pipeline Stages

### Stage 1: Inquiry
**When**: Someone fills contact form, calls 0424 054 113, or approaches in person
**What to do in GHL**:
1. Search for contact by email/phone
2. If doesn't exist, create manually: Contacts → Add Contact
3. Add tags: `the-harvest`, `interest:volunteering`
4. Add to "Volunteer Pipeline" → "Inquiry" stage
5. Send welcome email (template: "Volunteer Welcome")

### Stage 2: Invited to Orientation
**When**: You've sent them orientation details (first Friday coffee date)
**What to do in GHL**:
1. Open their contact record
2. Drag to "Invited to Orientation" stage
3. Update custom field: `orientation_date` (e.g., "First Friday March")
4. Automation will send: Reminder email 3 days before, SMS day before

### Stage 3: Attended Orientation
**When**: They showed up to first Friday coffee
**What to do in GHL**:
1. On Friday: Have sign-in sheet with names
2. Back in GHL: Search each name, drag to "Attended Orientation"
3. Update custom field: `volunteer_skills` (what they're interested in: gardening/cooking/admin/teaching)
4. Automation sends: Welcome pack, volunteer schedule, safety induction booking

### Stage 4: Active Volunteer
**When**: They've volunteered at least once
**What to do in GHL**:
1. After first volunteer day: Drag to "Active Volunteer"
2. Update custom fields:
   - `availability` (weekday/weekend/flexible)
   - `preferred_tasks` (beds 1-4, kitchen, admin, tours)
   - `t_shirt_size` (for ordering volunteer shirts)
3. They'll now receive: Weekly volunteer day schedule, monthly member updates

### Stage 5: Inactive
**When**: Haven't volunteered in 3 months
**What to do in GHL**:
1. Monthly review: Run report "Active Volunteers with Last Activity >90 days ago"
2. Bulk update: Select all, drag to "Inactive"
3. Automation sends: "We miss you" re-engagement email
4. Manually reach out: Phone call to check in (personal touch matters!)

### Stage 6: Alumni
**When**: Moved away, can't volunteer anymore, but wants to stay connected
**What to do in GHL**:
1. Conversation with volunteer → they're relocating
2. Update stage: "Alumni"
3. Update custom field: `new_location` (Brisbane/Melbourne/etc.)
4. They'll receive: Quarterly newsletter, major event invitations, no weekly schedules

---

## Common Tasks

### Add Someone to Volunteer Day Schedule
1. Open contact → Custom Fields → `next_volunteer_date`
2. Enter date (e.g., "Saturday March 15, 9am-12pm")
3. Automation sends: Calendar invite, reminder SMS day before

### Record Volunteer Hours
1. Contact record → Activities → Add Note
2. Title: "Volunteer Hours - [Date]"
3. Note body: "3 hours, Garden Bed 2, planted tomatoes"
4. Update custom field: `total_hours` (running total)

### Generate Volunteer Report for Grant Application
1. Contacts → Filters → "Active Volunteer" + Date range
2. Export CSV with fields: name, email, total_hours, skills, start_date
3. Analytics tab → "Volunteer Engagement" dashboard
4. Screenshot charts: hours per month, volunteer retention rate

---

## Troubleshooting

**"I can't find someone in GHL"**:
- Try searching by phone, not just email (some older volunteers don't use email)
- Check "All Contacts" not just "Volunteer Pipeline"
- They might be tagged differently (check "Program Participant" or "Member")

**"Automation didn't send"**:
- Check contact has correct tags: `the-harvest` + `interest:volunteering`
- Check workflow is "Published" not "Draft"
- Check contact's email opt-in status (if opted out, emails won't send)

**"Pipeline is messy, lots in wrong stages"**:
- Monthly cleanup: Coordinator meeting, review pipeline together
- Drag contacts to correct stages
- Add notes explaining why they're in that stage

---

## Quick Links
- GHL Login: https://app.gohighlevel.com/
- Volunteer Pipeline: [Direct link to be added]
- Templates: Settings → Templates → The Harvest folder
- Reports: Analytics → Volunteer Dashboard

Questions? Ask [Coordinator Name] or tag @ghl-support in Slack
```

---

## How the Skill Works

### **Input**: User question/request about GHL strategy
### **Processing**:
1. Loads context:
   - All 4 ACT project details
   - GHL Pipeline Strategy document
   - Current implementation status
   - GHL API documentation
2. Analyzes request type (pipeline design, workflow script, tag strategy, etc.)
3. Generates tailored response with:
   - Strategic recommendations
   - Code examples (if integration question)
   - Email templates (if workflow question)
   - Step-by-step guides (if training question)
   - GHL configuration instructions

### **Output**: Actionable, project-specific guidance

---

## Skill Configuration

```yaml
name: ghl-crm-advisor
description: Strategic advisor for GoHighLevel CRM across ACT projects
version: 1.0.0

context_files:
  - /Users/benknight/Code/ACT Farm and Regenerative Innovation Studio/GHL_PIPELINE_STRATEGY.md
  - /Users/benknight/Code/ACT Farm and Regenerative Innovation Studio/GHL_SETUP_GUIDE.md
  - /Users/benknight/Code/ACT Farm and Regenerative Innovation Studio/GHL_IMPLEMENTATION_STATUS.md
  - /Users/benknight/Code/ACT Farm and Regenerative Innovation Studio/GHL_INTEGRATION_PROGRESS.md

project_context:
  - /Users/benknight/Code/The Harvest/
  - /Users/benknight/Code/ACT Farm/act-farm/
  - /Users/benknight/Code/Empathy Ledger v.02/
  - /Users/benknight/Code/JusticeHub/

capabilities:
  - pipeline_design
  - workflow_scripting
  - email_template_generation
  - tag_strategy
  - reporting_queries
  - integration_support
  - team_training_materials
  - troubleshooting

model: sonnet  # Sonnet for strategic thinking, Haiku for quick queries

system_prompt: |
  You are a GoHighLevel CRM strategy expert specialized in social impact organizations.
  You deeply understand The Harvest, ACT Farm, Empathy Ledger, and JusticeHub projects.

  When responding:
  - Provide specific, actionable recommendations
  - Use examples from the 4 ACT projects
  - Consider cross-project synergies
  - Balance automation with human touch
  - Prioritize user experience and mission alignment
  - Include implementation steps, not just concepts

  Your goal: Help ACT team build world-class CRM that serves their communities effectively.
```

---

## Skill Value Proposition

### **Time Savings**
- **Pipeline design**: 2 hours → 15 minutes (skill generates draft)
- **Workflow scripting**: 4 hours → 30 minutes (skill writes email sequences)
- **Team training**: 3 hours → 1 hour (skill creates guides)
- **Troubleshooting**: 1 hour → 10 minutes (skill diagnoses issues)

**Total time savings**: ~20 hours/month across all GHL work

### **Quality Improvements**
- **Consistency**: All 4 projects follow same strategic framework
- **Best practices**: Skill embeds GHL expertise in every response
- **Completeness**: Skill doesn't forget edge cases (e.g., unsubscribe links, privacy compliance)
- **Evolution**: Skill learns from ACT-specific patterns over time

### **Strategic Alignment**
- **Mission-first**: Recommendations prioritize impact, not just revenue
- **Cross-project synergies**: Skill actively suggests referral opportunities
- **Community-centered**: Automation designed to enhance, not replace, human connection

---

## Recommendation

**Build this skill**.

It will:
1. ✅ Accelerate GHL implementation (50% faster)
2. ✅ Reduce learning curve for team members
3. ✅ Ensure strategic consistency across projects
4. ✅ Provide ongoing support as projects evolve
5. ✅ Become institutional knowledge repository

**Estimated build time**: 2-4 hours (worth it for 20+ hours/month ongoing savings)

**Next step**: Create skill scaffold, test with sample queries, refine prompts.

---

Would you like me to build this skill now?
