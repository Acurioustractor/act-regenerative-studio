# ACT Ecosystem Visual Strategy & Integration Map

> **Purpose**: Comprehensive visual strategy showing how The Harvest, ACT Farm, Empathy Ledger, and JusticeHub interconnect to create a regenerative community ecosystem powered by world-class CRM, communications, and community management.

---

## Executive Overview

**The ACT Ecosystem** is a regenerative community model where 4 distinct projects create synergistic value:

1. **The Harvest** - Physical community hub (Witta, QLD)
2. **ACT Farm** - Regenerative tourism & research (Black Cockatoo Valley, QLD)
3. **Empathy Ledger** - Digital storytelling platform (Global)
4. **JusticeHub** - Service directory & advocacy (Queensland-focused, expanding)

**Integration Strategy**: Each project operates independently BUT shares infrastructure, referral pathways, and community members who move between projects based on their needs and interests.

---

## Visual Ecosystem Map

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        ACT ECOSYSTEM - INTEGRATED MODEL                       │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                        SHARED INFRASTRUCTURE LAYER                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │   NAS/Redis  │  │  GoHighLevel │  │    Resend    │  │   Supabase   │   │
│  │   (Caching)  │  │   (CRM/Auto) │  │  (Email API) │  │  (Auth/Data) │   │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘   │
│         │                  │                  │                  │           │
│         └──────────────────┴──────────────────┴──────────────────┘           │
│                            Unified Backend                                    │
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
         ┌─────────────────────────────┼─────────────────────────────┐
         │                             │                             │
         ▼                             ▼                             ▼

┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│   THE HARVEST    │       │     ACT FARM     │       │ EMPATHY LEDGER   │
│  (Community Hub) │       │ (Regen Tourism)  │       │  (Storytelling)  │
├──────────────────┤       ├──────────────────┤       ├──────────────────┤
│                  │       │                  │       │                  │
│ VOLUNTEERS       │◄─────►│ RESIDENCY        │◄─────►│ STORYTELLERS     │
│ MEMBERS          │       │ WORKSHOPS        │       │ ORGANIZATIONS    │
│ TENANTS          │       │ JUNE'S PATCH     │       │ RESEARCHERS      │
│ EVENTS           │       │ TOURS            │       │ PARTNERSHIPS     │
│                  │       │                  │       │                  │
│ Revenue:         │       │ Revenue:         │       │ Revenue:         │
│ $100k-200k/yr    │       │ $150k-300k/yr    │       │ $50k-500k/yr     │
│                  │       │                  │       │                  │
└────────┬─────────┘       └─────────┬────────┘       └─────────┬────────┘
         │                           │                          │
         │                           │                          │
         │         ┌─────────────────┴──────────────┐           │
         │         │                                │           │
         └────────►│         JUSTICEHUB             │◄──────────┘
                   │    (Service Directory +        │
                   │     Advocacy Campaigns)        │
                   ├────────────────────────────────┤
                   │                                │
                   │ FAMILIES IN NEED               │
                   │ SERVICE PROVIDERS              │
                   │ CAMPAIGN LEADERS               │
                   │ STORYTELLERS (sync'd)          │
                   │                                │
                   │ Revenue:                       │
                   │ $50k-200k/yr (grants)          │
                   │                                │
                   └────────────────────────────────┘


        CROSS-PROJECT REFERRAL FLOWS (Automated via GHL)
        ═══════════════════════════════════════════════

 Harvest Volunteer + Conservation Interest  ───►  ACT Farm Workshop
 ACT Farm Resident + Storytelling Practice  ───►  Empathy Ledger Storyteller
 Empathy Ledger Storyteller + Justice Exp.  ───►  JusticeHub CONTAINED Campaign
 JusticeHub Family + Community Support Need ───►  The Harvest Programs
 Tenant/Vendor Shared Across All Sites      ◄───►  Cross-Project Synergy


        REVENUE MODEL (Combined Ecosystem)
        ═══════════════════════════════════

 The Harvest:      $100k-200k/yr  (Tenants, Events, Memberships, Programs)
 ACT Farm:         $150k-300k/yr  (Residencies, Workshops, Future Accommodation)
 Empathy Ledger:   $50k-500k/yr   (Org Subscriptions, Licensing, Research)
 JusticeHub:       $50k-200k/yr   (Grants, Sponsorships, Service Fees)
 ─────────────────────────────────────────────────────────────────────────
 TOTAL POTENTIAL:  $350k-1.2M/yr  (Mature state, 3-5 years)
```

---

## Integration Architecture

### 1. Technical Stack Integration

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      TECHNICAL ARCHITECTURE                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  FRONTEND LAYER (User-Facing Websites)                                   │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐  │
│  │ The Harvest  │ │  ACT Farm    │ │Empathy Ledger│ │ JusticeHub   │  │
│  │  Next.js 14  │ │  Next.js 16  │ │  Next.js 15  │ │  Next.js 14  │  │
│  │  Formspree→  │ │  (New forms) │ │  Supabase    │ │  Supabase    │  │
│  │  GHL         │ │              │ │  + GHL       │ │  + GHL       │  │
│  └──────┬───────┘ └──────┬───────┘ └──────┬───────┘ └──────┬───────┘  │
│         │                │                │                │           │
│         └────────────────┴────────────────┴────────────────┘           │
│                                  │                                      │
├──────────────────────────────────┼──────────────────────────────────────┤
│                                  │                                      │
│  API LAYER (Backend Endpoints)   │                                      │
│  ┌────────────────────────────────────────────────────────────┐        │
│  │  /api/contact        - GHL contact creation + pipeline     │        │
│  │  /api/volunteer      - Volunteer signup (Harvest)          │        │
│  │  /api/tenant-inquiry - Tenant/vendor inquiry (Harvest)     │        │
│  │  /api/residency      - Residency booking (ACT Farm)        │        │
│  │  /api/workshop       - Workshop registration (ACT Farm)    │        │
│  │  /api/org-inquiry    - Organization lead (Empathy Ledger)  │        │
│  │  /api/story-submit   - Story submission (JusticeHub)       │        │
│  │  /api/webhooks/ghl   - GHL webhook receiver (all projects) │        │
│  │  /api/webhooks/stripe- Payment webhooks (all projects)     │        │
│  │  /api/sync/supabase  - Supabase → GHL sync (EL, JH)        │        │
│  └────────────────────────────────────────────────────────────┘        │
│                                  │                                      │
├──────────────────────────────────┼──────────────────────────────────────┤
│                                  │                                      │
│  SERVICES LAYER (Shared Infrastructure)                                 │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐  │
│  │ GoHighLevel  │ │   Supabase   │ │    Resend    │ │  Redis NAS   │  │
│  ├──────────────┤ ├──────────────┤ ├──────────────┤ ├──────────────┤  │
│  │ CRM          │ │ Auth         │ │ Transactional│ │ Cache        │  │
│  │ Pipelines    │ │ PostgreSQL   │ │ Emails       │ │ Session      │  │
│  │ Automation   │ │ RLS          │ │ Templates    │ │ Performance  │  │
│  │ Calendars    │ │ Real-time    │ │ Delivery     │ │              │  │
│  │ SMS          │ │ Storage      │ │ Analytics    │ │              │  │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘  │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Data Flow Architecture

### Contact Creation & Pipeline Entry

```
USER SUBMITS FORM (any website)
         │
         ▼
┌────────────────────────────────────────────┐
│  Next.js API Route (/api/contact)          │
│  - Validates form data                     │
│  - Determines project + interest type      │
└────────────────┬───────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────┐
│  Redis Cache Check                         │
│  - Check if contact exists (by email)      │
│  - 10-minute TTL                           │
└────────┬───────────────────┬───────────────┘
         │ CACHE HIT         │ CACHE MISS
         ▼                   ▼
   ┌─────────┐         ┌─────────────────────┐
   │ Return  │         │ GHL API Call        │
   │ Cached  │         │ contacts.upsert()   │
   └────┬────┘         └──────┬──────────────┘
        │                     │
        └─────────┬───────────┘
                  ▼
┌────────────────────────────────────────────┐
│  GHL Contact Created/Updated               │
│  - Email, name, phone, source              │
│  - Tags: [project], [interest type]        │
│  - Custom fields: specific data            │
└────────────────┬───────────────────────────┘
                 │
                 ├──────────────┬─────────────────┬──────────────┐
                 ▼              ▼                 ▼              ▼
         ┌──────────────┐ ┌──────────┐  ┌──────────────┐ ┌──────────┐
         │ Add to       │ │ Trigger  │  │ Send Resend  │ │ Update   │
         │ Pipeline     │ │ Workflow │  │ Confirmation │ │ Cache    │
         │ (Stage 1)    │ │ (Email   │  │ Email        │ │ (10 min) │
         │              │ │ Sequence)│  │              │ │          │
         └──────────────┘ └──────────┘  └──────────────┘ └──────────┘
```

### Supabase + GHL Sync (Empathy Ledger, JusticeHub)

```
USER REGISTERS ON PLATFORM (Supabase Auth)
         │
         ▼
┌────────────────────────────────────────────┐
│  Supabase Auth User Created                │
│  - Email, password hash                    │
│  - User metadata (name, role)              │
└────────────────┬───────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────┐
│  Supabase Database Trigger                 │
│  auth.users INSERT → call sync function    │
└────────────────┬───────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────┐
│  Edge Function: /api/sync/supabase-to-ghl  │
│  - Receives new user data                  │
│  - Checks if GHL contact exists (email)    │
└────────┬───────────────────┬───────────────┘
         │ EXISTS            │ NEW
         ▼                   ▼
   ┌─────────────┐    ┌──────────────────────┐
   │ Link to     │    │ Create GHL Contact   │
   │ Existing GHL│    │ contacts.upsert()    │
   └──────┬──────┘    └──────┬───────────────┘
          │                  │
          └─────────┬────────┘
                    ▼
┌────────────────────────────────────────────┐
│  ghl_contact_sync Table (Supabase)         │
│  - supabase_user_id                        │
│  - ghl_contact_id                          │
│  - email (primary reconciliation key)      │
│  - project                                 │
│  - last_synced                             │
└────────────────────────────────────────────┘
```

---

## 3. User Journey Integration Map

### Example: Sarah's Journey Across ACT Ecosystem

```
MONTH 1: Discovery
─────────────────────────────────────────────────────────────────
Sarah searches Google: "community gardens Sunshine Coast"
    ▼
Finds: The Harvest website
    ▼
Submits: Contact form (Interest: Volunteering)
    ▼
GHL: Creates contact, adds to Volunteer Pipeline (Stage: Inquiry)
    ▼
Automation: Sends welcome email + orientation invite (first Friday)
    ▼
Sarah: Attends orientation, meets community
    ▼
GHL: Coordinator moves Sarah to "Attended Orientation" stage
    ▼
Automation: Sends volunteer schedule, safety induction booking


MONTH 2: Engagement
─────────────────────────────────────────────────────────────────
Sarah: Volunteers weekly, expresses interest in conservation
    ▼
GHL: Coordinator adds tag "interest:conservation" to Sarah's contact
    ▼
Automation: Cross-project workflow detects tag
    ▼
Email: "Hi Sarah, based on your love of conservation, you might enjoy
        Black Cockatoo Valley residencies at ACT Farm. First workshop
        50% off for Harvest volunteers!"
    ▼
Sarah: Clicks link, browses ACT Farm website
    ▼
GHL: Tracks click, adds tag "engaged:act-farm"


MONTH 3: Expansion
─────────────────────────────────────────────────────────────────
Sarah: Books ACT Farm weekend workshop ($75, discounted from $150)
    ▼
ACT Farm: Form submission creates contact in GHL (or finds existing via email)
    ▼
GHL: Recognizes Sarah already exists, merges records, adds to Workshop Pipeline
    ▼
GHL: Updates custom fields:
     - cross_project: true
     - projects: ["the-harvest", "act-farm"]
     - lifetime_value: $75
    ▼
Automation: Pre-workshop emails (what to bring, directions, excitement!)
    ▼
Sarah: Attends workshop, falls in love with regenerative agriculture
    ▼
ACT Farm: Coordinator moves Sarah to "Completed" stage
    ▼
Automation: Post-workshop email:
     "Loved having you, Sarah! Want to do a longer residency? Alumni get
      20% off. Also, check out Empathy Ledger - we'd love to share your
      conservation story!"


MONTH 6: Deep Engagement
─────────────────────────────────────────────────────────────────
Sarah: Applies for 5-day Creative Residency at ACT Farm ($2,000)
    ▼
GHL: Moves Sarah to Residency Pipeline (Stage: Application Received)
    ▼
Coordinator: Reviews application, approves (mission-aligned)
    ▼
GHL: Stage → "Approved", sends payment link (Stripe)
    ▼
Sarah: Pays deposit ($1,000)
    ▼
Stripe Webhook → GHL: Updates payment_status, moves to "Payment Received"
    ▼
Automation: Pre-arrival pack (what to bring, farm protocols, research outputs expectations)
    ▼
Sarah: Completes residency, creates photographic essay on regenerative land healing
    ▼
GHL: Stage → "Completed", tags "residency-alumni"
    ▼
Automation: Alumni nurture sequence begins (Day 30, 60, 90... stay connected)


MONTH 9: Storytelling
─────────────────────────────────────────────────────────────────
Sarah: Clicks link in alumni email about Empathy Ledger
    ▼
Empathy Ledger: Signs up as storyteller (Supabase Auth)
    ▼
Supabase: Creates user, triggers sync to GHL
    ▼
GHL: Recognizes Sarah exists, links Supabase user_id to GHL contact_id via ghl_contact_sync table
    ▼
GHL: Updates tags: ["the-harvest", "act-farm", "empathy-ledger"], adds to Storyteller Pipeline
    ▼
Sarah: Uploads photo essay + story about her residency experience
    ▼
Empathy Ledger: Publishes story, shares with ACT Farm for marketing
    ▼
GHL: Tracks engagement, lifetime value now $2,075 (volunteer time + workshop + residency)


YEAR 2: Advocacy
─────────────────────────────────────────────────────────────────
Sarah: Sees JusticeHub campaign about Indigenous land rights
    ▼
Sarah: Has personal connection (learned about Kabi Kabi/Jinibara land at The Harvest)
    ▼
JusticeHub: Sarah nominates local state MP for CONTAINED campaign experience
    ▼
JusticeHub: Creates contact for MP, adds Sarah as nominator
    ▼
GHL: Links Sarah (existing contact) to campaign, tags "campaign-nominator"
    ▼
Campaign: MP accepts, attends experience, issues public statement
    ▼
JusticeHub: Tags Sarah "campaign-advocate" for successful nomination
    ▼
Sarah: Now connected to all 4 ACT projects, deep community member


SARAH'S VALUE TO ACT ECOSYSTEM:
─────────────────────────────────────────────────────────────────
Monetary:        $2,075 (direct spend)
Volunteer:       48 hours @ $30/hr = $1,440 (in-kind)
Referrals:       Brought 2 friends to Harvest (potential $4,000+ value)
Advocacy:        MP statement on land rights (priceless impact)
Content:         Photo essay used in ACT Farm marketing (brand value)
Total Value:     $7,500+ over 18 months

GHL Tracking:    All touchpoints logged, cross-project journey visible,
                 automated referrals drove 60% of Sarah's expansion
```

---

## 4. Revenue Integration Model

### How Projects Cross-Sell and Share Revenue

```
┌─────────────────────────────────────────────────────────────────────┐
│                    REVENUE SHARING MODEL                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  The Harvest Volunteer Sarah → ACT Farm Workshop ($75)               │
│  ├─ The Harvest: $0 direct (volunteer is free)                       │
│  ├─ ACT Farm: $75 revenue                                            │
│  └─ Attribution: 50% discount given for "Harvest member" (tracked    │
│                  via GHL tag), so The Harvest "contributed" $37.50   │
│                                                                       │
│  Sarah → ACT Farm Residency ($2,000)                                 │
│  ├─ ACT Farm: $2,000 revenue                                         │
│  └─ Attribution: Sarah was referred via automated email from         │
│                  The Harvest volunteer workflow, so internal         │
│                  "referral bonus" of 10% = $200 conceptually         │
│                  credited to The Harvest marketing budget            │
│                                                                       │
│  Sarah → Empathy Ledger Storyteller (Free platform use)              │
│  ├─ Empathy Ledger: $0 direct (freemium model)                       │
│  ├─ BUT: Sarah's story is used in ACT Farm marketing → brand value   │
│  └─ Future: If organization licenses Sarah's story for $500,         │
│              Empathy Ledger revenue, but ACT Farm benefits from       │
│              enhanced storytelling in residency marketing             │
│                                                                       │
│  Sarah nominates MP → JusticeHub CONTAINED Campaign                  │
│  ├─ JusticeHub: $0 direct (grant-funded, pay-what-you-can)           │
│  └─ BUT: Strengthens relationship with The Harvest (land rights      │
│           advocacy aligns with Kabi Kabi/Jinibara cultural focus)    │
│                                                                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  TOTAL ECOSYSTEM VALUE FROM SARAH: $2,075 direct + $1,440 volunteer  │
│  = $3,515 economic value                                             │
│                                                                       │
│  ATTRIBUTION:                                                         │
│  The Harvest:     $37.50 (referral credit) + $1,440 (volunteer)      │
│  ACT Farm:        $2,075 (direct revenue)                            │
│  Empathy Ledger:  $0 (brand value, future licensing potential)       │
│  JusticeHub:      $0 (mission impact, community strengthening)       │
│                                                                       │
│  MULTIPLIER EFFECT:                                                   │
│  Sarah brings 2 friends to The Harvest → They follow similar journey │
│  3 Sarah's = $10,500 ecosystem value over 2 years                    │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

### Cross-Project Revenue Opportunities (Tracked in GHL)

| **Referral From** | **Referral To** | **Revenue Potential** | **GHL Automation** |
|-------------------|-----------------|----------------------|-------------------|
| Harvest Volunteer | ACT Farm Workshop | $50-150/person | Tag `interest:conservation` → Email invite |
| ACT Farm Resident | Empathy Ledger Storyteller | $0 (brand value) | Tag `interest:storytelling` → Platform intro |
| Empathy Ledger Storyteller | JusticeHub Campaign | $0 (impact value) | Tag `justice-experience` → Campaign invite |
| JusticeHub Family | Harvest Programs | $0-100/person | Tag `needs:community` → Program referral |
| Any Project Member | Another Project Member | 10-30% of LTV | Cross-project tags trigger referral emails |

**GHL Tracking**:
- Custom field: `referred_from` (project name)
- Custom field: `cross_project` (true/false)
- Custom field: `projects` (array: ["harvest", "act-farm"])
- Custom field: `lifetime_value` (total $ across all projects)
- Tag: `multi-project:active` (engaged with 2+ projects)

---

## 5. Communication Flow Architecture

### Email System Integration

```
┌─────────────────────────────────────────────────────────────────────┐
│                     EMAIL COMMUNICATION FLOW                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  TRANSACTIONAL EMAILS (Resend) - Immediate, User-Initiated           │
│  ┌────────────────────────────────────────────────────────────┐     │
│  │ • Contact form submission confirmation                      │     │
│  │ • Booking confirmation (residency, workshop, event)         │     │
│  │ • Payment receipt (Stripe → Resend webhook)                 │     │
│  │ • Password reset (Supabase → Resend)                        │     │
│  │ • Application received notification                         │     │
│  │ • Account created welcome email                             │     │
│  │                                                              │     │
│  │ Trigger: API endpoint calls Resend immediately              │     │
│  │ From: project-specific@domain.com                           │     │
│  │ Template: React Email components                            │     │
│  │ Deliverability: 99%+ (transactional sender reputation)      │     │
│  └────────────────────────────────────────────────────────────┘     │
│                                                                       │
│  MARKETING/NURTURE EMAILS (GHL) - Scheduled, Automated Sequences     │
│  ┌────────────────────────────────────────────────────────────┐     │
│  │ • Welcome sequence (Day 1, 3, 7 after signup)               │     │
│  │ • Nurture campaigns (volunteer → member, alumni → return)   │     │
│  │ • Event reminders (3 days, 1 day, 2 hours before)           │     │
│  │ • Re-engagement ("We miss you" after 90 days inactive)      │     │
│  │ • Cross-project referrals (tag-based triggers)              │     │
│  │ • Newsletter (monthly community updates)                    │     │
│  │                                                              │     │
│  │ Trigger: GHL workflow automation, tag changes, pipeline     │     │
│  │          stage transitions                                  │     │
│  │ From: GHL-configured sender                                 │     │
│  │ Template: GHL email builder                                 │     │
│  │ Deliverability: 95%+ (marketing sender reputation)          │     │
│  └────────────────────────────────────────────────────────────┘     │
│                                                                       │
│  SMS NOTIFICATIONS (GHL) - Urgent Reminders                          │
│  ┌────────────────────────────────────────────────────────────┐     │
│  │ • Event reminder (day before)                               │     │
│  │ • Booking confirmation (immediate)                          │     │
│  │ • Urgent updates (weather cancellation, etc.)               │     │
│  │ • Volunteer shift reminder (2 hours before)                 │     │
│  │                                                              │     │
│  │ Trigger: GHL workflow automation                            │     │
│  │ Cost: ~$0.05/SMS                                            │     │
│  │ Opt-in: Required, tracked per contact                       │     │
│  └────────────────────────────────────────────────────────────┘     │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 6. Admin Backend Wiki - System Architecture

### Proposed Admin Dashboard Structure

```
┌─────────────────────────────────────────────────────────────────────┐
│                    ACT ADMIN BACKEND WIKI                             │
│                   (World's Best Practice Model)                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  URL: https://admin.actstudio.org.au (or admin.theharvest.org.au)   │
│  Auth: Supabase Auth (admin role required)                           │
│  Stack: Next.js 15 + Supabase + GHL API + Redis + Tailwind           │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                     NAVIGATION SIDEBAR                        │    │
│  ├─────────────────────────────────────────────────────────────┤    │
│  │ 📊 Dashboard (System Health Overview)                        │    │
│  │ 🗺️  Ecosystem Map (Visual Integration Map - Interactive)     │    │
│  │ 👥 Community (Cross-Project Member Directory)                │    │
│  │ 📈 Pipelines (All GHL Pipelines Across Projects)             │    │
│  │ 💰 Revenue (Financial Dashboard + Forecasting)               │    │
│  │ 📧 Communications (Email/SMS Analytics)                       │    │
│  │ 🔗 Integrations (GHL, Supabase, Resend, Stripe Status)       │    │
│  │ 📚 Documentation (This Wiki + Guides)                         │    │
│  │ 🛠️  Tools (Bulk Actions, Data Export, System Maintenance)    │    │
│  │ ⚙️  Settings (API Keys, Permissions, Team Management)        │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

### Dashboard Pages (Detailed)

#### Page 1: System Health Dashboard

```
┌─────────────────────────────────────────────────────────────────────┐
│  📊 ACT ECOSYSTEM DASHBOARD                            [Last 30 Days]│
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  SYSTEM HEALTH                                                        │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌─────────────┐│
│  │ GHL API      │ │ Supabase     │ │ Resend       │ │ Redis Cache ││
│  │ ✅ Operational│ │ ✅ Operational│ │ ✅ Operational│ │ ✅ 99.2% Hit││
│  │ 47/100 calls │ │ 12ms avg     │ │ 98.5% deliver│ │ 10.2k hits  ││
│  └──────────────┘ └──────────────┘ └──────────────┘ └─────────────┘│
│                                                                       │
│  CROSS-PROJECT ACTIVITY                                               │
│  ┌────────────────────────────────────────────────────────────┐     │
│  │  The Harvest:    142 contacts  │  37 new  │  $12,450 rev   │     │
│  │  ACT Farm:       89 contacts   │  21 new  │  $28,500 rev   │     │
│  │  Empathy Ledger: 312 contacts  │  45 new  │  $3,200 rev    │     │
│  │  JusticeHub:     527 contacts  │  89 new  │  $0 rev        │     │
│  │  ─────────────────────────────────────────────────────────  │     │
│  │  Multi-Project:  47 contacts (engaged with 2+ projects)     │     │
│  └────────────────────────────────────────────────────────────┘     │
│                                                                       │
│  REVENUE TRENDS (Last 6 Months)                                       │
│  ┌────────────────────────────────────────────────────────────┐     │
│  │  $60k │                                          ╱╲         │     │
│  │       │                                    ╱╲  ╱  ╲        │     │
│  │  $40k │                            ╱╲    ╱  ╲╱    ╲       │     │
│  │       │                      ╱╲  ╱  ╲  ╱           ╲      │     │
│  │  $20k │            ╱╲  ╱╲  ╱  ╲╱    ╲╱             ╲╱    │     │
│  │       └────┴────┴────┴────┴────┴────                       │     │
│  │         Jul   Aug   Sep   Oct   Nov   Dec                  │     │
│  └────────────────────────────────────────────────────────────┘     │
│                                                                       │
│  TOP REFERRAL PATHWAYS (This Month)                                  │
│  ┌────────────────────────────────────────────────────────────┐     │
│  │  1. Harvest Volunteer → ACT Farm Workshop      (12 people) │     │
│  │  2. ACT Farm Resident → Empathy Ledger         (7 people)  │     │
│  │  3. Empathy Ledger → JusticeHub Campaign       (4 people)  │     │
│  │  4. JusticeHub Family → Harvest Programs       (3 people)  │     │
│  └────────────────────────────────────────────────────────────┘     │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

This is just the beginning! Let me continue building out the complete admin wiki structure...

Would you like me to continue with:
1. The interactive ecosystem map page design
2. The community cross-project directory
3. Pipeline visualization dashboard
4. The actual implementation of the admin backend wiki app

Which would you like to tackle first?
