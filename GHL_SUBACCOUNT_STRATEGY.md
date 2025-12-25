# GoHighLevel Sub-Account Strategy - Complete

**Date**: December 24, 2025
**Purpose**: Define all GHL sub-accounts needed across ACT ecosystem

---

## 🎯 The Complete Picture

### Master Account: **A Curious Tractor (ACT)**

**Purpose**: Parent organization account that:
- Manages all sub-accounts
- Handles ACT Hub (act.place) inquiries
- Centralizes cross-project reporting
- Manages partnerships, funding, governance inquiries
- Handles art program, residencies, general ACT inquiries

**URL**: act.place
**Contact Types**:
- General ACT inquiries
- Partnership opportunities
- Funding/philanthropy connections
- Art commissions/residencies
- Governance participation
- Media/press inquiries
- Team recruitment

**Pipelines** (in Master Account):
1. **General Inquiry Pipeline**: Contact → Responded → Qualified → Routed
2. **Partnership Pipeline**: Inquiry → Discovery → Alignment → Active Partner
3. **Funding Pipeline**: Inquiry → Application → Review → Funded
4. **Art Program Pipeline**: Inquiry → Application → Residency → Exhibition
5. **Governance Pipeline**: Interest → Participation → Co-steward

---

## 📊 Sub-Accounts Strategy

### Why Separate Sub-Accounts?

✅ **DO Separate** when projects have:
- Own public-facing website
- Own customer/user base
- Own revenue streams
- Own operational workflows
- Distinct value propositions

❌ **DON'T Separate** when:
- Project is purely internal/admin
- No customer-facing forms
- Part of ACT Hub operations
- Still in R&D phase

---

## 🌱 The 6 Sub-Accounts

### 1. **The Harvest Community Hub** (Sub-Account)

**Why Separate**: Own website, distinct community hub identity, tenant/volunteer/CSA management

**URL**: theharvest.org.au

**Contact Types**:
- Volunteers
- Event attendees
- CSA subscribers
- Tenants (stalls, pop-ups, businesses)
- Workshop participants
- Community partners

**Pipelines**:
1. **Volunteer Pipeline**: Inquiry → Onboarding → Active → Alumni
2. **Event Booking**: Inquiry → Booked → Attended → Follow-up
3. **Tenant Pipeline**: Inquiry → Application → Approved → Active → Offboarded
4. **CSA Pipeline**: Inquiry → Subscribed → Active → Renewal
5. **Contact Pipeline**: Inquiry → Responded → Nurture → Partner

**Priority**: High (community-facing, active operations)

---

### 2. **ACT Farm Tourism & Residencies** (Sub-Account)

**Why Separate**: Own website, tourism/accommodation business, booking revenue, healthcare program

**URL**: actfarm.org.au

**Contact Types**:
- Residency applicants (artists, researchers, R&D)
- Accommodation guests
- Workshop attendees
- June's Patch clients (therapeutic referrals)
- Farm tour bookings
- General inquiries

**Pipelines**:
1. **Residency Pipeline**: Inquiry → Application → Booked → Confirmed → Attended → Alumni
2. **Accommodation Pipeline**: Inquiry → Booked → Stayed → Follow-up
3. **Workshop Pipeline**: Inquiry → Registered → Attended → Follow-up
4. **June's Patch Pipeline**: Referral → Assessment → Approved → Active → Graduated
5. **General Inquiry**: Contact → Responded → Nurture

**Priority**: High (revenue-generating, bookings critical)

---

### 3. **Empathy Ledger Platform** (Sub-Account)

**Why Separate**: Own website, SaaS platform, distinct user base (storytellers + organizations), subscription revenue

**URL**: empathyledger.com

**Contact Types**:
- Storytellers (226 already in Supabase)
- Organizations seeking stories
- Partnership inquiries
- Research collaborations
- Subscription customers
- Enterprise clients

**Pipelines**:
1. **Storyteller Pipeline**: Applied → Onboarding → Active → Featured
2. **Organization Pipeline**: Inquiry → Discovery → Proposal → Partner
3. **Partnership Pipeline**: Inquiry → Alignment → Active
4. **Research Pipeline**: Inquiry → Collaboration → Output
5. **Subscription Pipeline**: Trial → Paid → Retained → Champion

**Priority**: High (platform with existing users, revenue potential)

**Special Note**: Needs Supabase ↔ GHL sync (email as key)

---

### 4. **JusticeHub Service Finder** (Sub-Account)

**Why Separate**: Own website, service directory platform, distinct user base (families + providers), campaign operations

**URL**: justicehub.org.au

**Contact Types**:
- Families seeking services
- Service providers
- Campaign nominations
- CONTAINED experience bookings
- Partnership inquiries
- Funders/supporters

**Pipelines**:
1. **Family Inquiry Pipeline**: Contact → Assessment → Service Match → Follow-up
2. **Service Provider Pipeline**: Application → Verification → Listed → Active
3. **Campaign Nomination Pipeline**: Submitted → Review → Featured → Complete
4. **CONTAINED Booking Pipeline**: Inquiry → Booked → Attended → Follow-up
5. **Partnership Pipeline**: Inquiry → Alignment → Active

**Priority**: High (community service, active users)

**Special Note**: Needs Supabase ↔ GHL sync (email as key)

---

### 5. **Goods on Country** (Sub-Account)

**Why Separate**: Own website, product sales, e-commerce operations, distinct circular economy business model

**URL**: goodsoncountry.com (or goodsoncountry.netlify.app)

**Contact Types**:
- Product customers
- Community manufacturers
- Wholesale partners
- Remote community contacts
- Design collaborators
- Impact investors

**Pipelines**:
1. **Customer Pipeline**: Inquiry → Purchase → Fulfilled → Repeat Customer
2. **Manufacturer Pipeline**: Interest → Onboarding → Active → Scaled
3. **Wholesale Pipeline**: Inquiry → Sample → Order → Active Partner
4. **Community Partnership Pipeline**: Contact → Pilot → Active → Scaling
5. **Product Development Pipeline**: Idea → Prototype → Testing → Launch

**Priority**: Medium (website exists, but less active than others currently)

**Special Note**: E-commerce integration (Shopify or custom), waste-to-product tracking

---

### 6. **A Curious Tractor (ACT) - Master Account** (NOT a sub-account)

**Why Master**: Parent organization, manages all sub-accounts, ACT Hub website, cross-project inquiries

**URL**: act.place

**Contact Types**:
- General ACT inquiries (not specific to one project)
- Partnership opportunities (ecosystem-wide)
- Funders/philanthropists
- Art commissions/residencies (BCV)
- Media/press inquiries
- Team recruitment
- Governance participation
- Strategic collaborations

**Pipelines** (in Master Account):
1. **General Inquiry Pipeline**: Contact → Responded → Qualified → Routed (to sub-account if needed)
2. **Partnership Pipeline**: Inquiry → Discovery → Alignment → Active Partner
3. **Funding Pipeline**: Inquiry → Application → Review → Funded
4. **Art Program Pipeline**: Inquiry → Application → Residency → Exhibition
5. **Governance Pipeline**: Interest → Participation → Co-steward

**Priority**: High (ecosystem hub, strategic relationships)

**Special Role**: Routes inquiries to appropriate sub-accounts

---

## 🔄 Cross-Account Routing Logic

### When Someone Contacts ACT Hub (act.place):

**Scenario**: "I want to volunteer"
- **Route to**: The Harvest sub-account (Volunteer Pipeline)
- **Tag**: `routed-from-act-hub`

**Scenario**: "I want to book a residency"
- **Route to**: ACT Farm sub-account (Residency Pipeline)
- **Tag**: `routed-from-act-hub`

**Scenario**: "I'm an organization looking for stories"
- **Route to**: Empathy Ledger sub-account (Organization Pipeline)
- **Tag**: `routed-from-act-hub`

**Scenario**: "I need help finding youth justice services"
- **Route to**: JusticeHub sub-account (Family Inquiry Pipeline)
- **Tag**: `routed-from-act-hub`

**Scenario**: "I want to buy products made on Country"
- **Route to**: Goods on Country sub-account (Customer Pipeline)
- **Tag**: `routed-from-act-hub`

**Scenario**: "I want to fund the ACT ecosystem" or "I want to partner across multiple projects"
- **Keep in**: ACT Master account (Partnership/Funding Pipeline)
- **Tag**: `ecosystem-wide`

---

## 🎨 Implementation Strategy

### Phase 1: Core Operations (Week 1)
Create these 4 sub-accounts FIRST:
1. ✅ The Harvest
2. ✅ ACT Farm
3. ✅ Empathy Ledger
4. ✅ JusticeHub

**Why**: Active websites, immediate need for form integration

---

### Phase 2: E-commerce & Master (Week 2)
Create these 2 accounts:
5. ✅ Goods on Country
6. ✅ A Curious Tractor (Master account setup - already exists, just configure)

**Why**: Goods needs e-commerce setup, ACT Hub website launching soon

---

## 📝 Environment Variables Needed

### All Projects (.env.local files)

#### The Harvest
```bash
GHL_API_KEY=sk-live_the_harvest_key_here
GHL_LOCATION_ID=loc_the_harvest_id_here
GHL_VOLUNTEER_PIPELINE_ID=
GHL_EVENT_BOOKING_PIPELINE_ID=
GHL_TENANT_PIPELINE_ID=
GHL_CSA_PIPELINE_ID=
GHL_CONTACT_PIPELINE_ID=
```

#### ACT Farm
```bash
GHL_API_KEY=sk-live_act_farm_key_here
GHL_LOCATION_ID=loc_act_farm_id_here
GHL_RESIDENCY_PIPELINE_ID=
GHL_ACCOMMODATION_PIPELINE_ID=
GHL_WORKSHOP_PIPELINE_ID=
GHL_JUNES_PATCH_PIPELINE_ID=
GHL_GENERAL_INQUIRY_PIPELINE_ID=
```

#### Empathy Ledger
```bash
GHL_API_KEY=sk-live_empathy_ledger_key_here
GHL_LOCATION_ID=loc_empathy_ledger_id_here
GHL_STORYTELLER_PIPELINE_ID=
GHL_ORGANIZATION_PIPELINE_ID=
GHL_PARTNERSHIP_PIPELINE_ID=
GHL_RESEARCH_PIPELINE_ID=
GHL_SUBSCRIPTION_PIPELINE_ID=
```

#### JusticeHub
```bash
GHL_API_KEY=sk-live_justicehub_key_here
GHL_LOCATION_ID=loc_justicehub_id_here
GHL_FAMILY_INQUIRY_PIPELINE_ID=
GHL_SERVICE_PROVIDER_PIPELINE_ID=
GHL_CAMPAIGN_NOMINATION_PIPELINE_ID=
GHL_CONTAINED_BOOKING_PIPELINE_ID=
GHL_PARTNERSHIP_PIPELINE_ID=
```

#### Goods on Country
```bash
GHL_API_KEY=sk-live_goods_key_here
GHL_LOCATION_ID=loc_goods_id_here
GHL_CUSTOMER_PIPELINE_ID=
GHL_MANUFACTURER_PIPELINE_ID=
GHL_WHOLESALE_PIPELINE_ID=
GHL_COMMUNITY_PARTNERSHIP_PIPELINE_ID=
GHL_PRODUCT_DEVELOPMENT_PIPELINE_ID=
```

#### ACT Hub (act.place)
```bash
GHL_API_KEY=sk-live_act_master_key_here
GHL_LOCATION_ID=loc_act_master_id_here
GHL_GENERAL_INQUIRY_PIPELINE_ID=
GHL_PARTNERSHIP_PIPELINE_ID=
GHL_FUNDING_PIPELINE_ID=
GHL_ART_PROGRAM_PIPELINE_ID=
GHL_GOVERNANCE_PIPELINE_ID=
```

---

## 📊 Total Pipeline Count

| Project | Pipelines | Notes |
|---------|-----------|-------|
| **The Harvest** | 5 | Volunteer, Events, Tenants, CSA, Contact |
| **ACT Farm** | 5 | Residency, Accommodation, Workshop, June's Patch, Inquiry |
| **Empathy Ledger** | 5 | Storyteller, Organization, Partnership, Research, Subscription |
| **JusticeHub** | 5 | Family, Provider, Campaign, CONTAINED, Partnership |
| **Goods on Country** | 5 | Customer, Manufacturer, Wholesale, Community, Product Dev |
| **ACT Hub (Master)** | 5 | General, Partnership, Funding, Art, Governance |
| **TOTAL** | **30 pipelines** | Across 6 accounts (1 master + 5 sub-accounts) |

---

## 🎯 Updated Roadmap View

Need to update `RoadmapView.tsx` to include:
- **Goods on Country** as 6th project column
- **ACT Hub** features (already there, but clarify it's the master account)

---

## 💡 Key Decisions

### What Goes in Master vs Sub-Accounts?

**Master Account (ACT)**:
- ✅ Ecosystem-wide partnerships
- ✅ Funders who support multiple projects
- ✅ Media/press for ACT overall
- ✅ Art program (BCV residencies, exhibitions)
- ✅ Governance participation
- ✅ Team recruitment
- ✅ Strategic collaborations

**Sub-Accounts (Projects)**:
- ✅ Project-specific customer/user inquiries
- ✅ Project-specific bookings/transactions
- ✅ Project-specific volunteer/community management
- ✅ Project-specific product/service delivery

**Routing Rule**: If inquiry is specific to ONE project → Sub-account. If inquiry spans multiple projects or is strategic/funding → Master account.

---

## 🔗 Registry Integration

All 6 need registry APIs for ACT Hub aggregation:

| Project | Registry Status | URL |
|---------|----------------|-----|
| The Harvest | ✅ Live | `/api/registry` |
| ACT Farm | ⏳ Planned | `/api/registry` |
| Empathy Ledger | ✅ Live | `/api/registry` |
| JusticeHub | ✅ Live | `/api/registry` |
| Goods on Country | ✅ Live | `/registry.json` |
| ACT Hub | 🔄 In Progress | `/api/registry` (aggregates all) |

---

## 🎯 Next Steps

### Immediate (This Week)
1. Create **6 GHL accounts** total:
   - 1 Master: A Curious Tractor
   - 5 Sub-accounts: The Harvest, ACT Farm, Empathy Ledger, JusticeHub, Goods on Country

2. Generate API keys for all 6 accounts

3. Populate .env vault:
   - `.env-vault/the-harvest.env.local`
   - `.env-vault/act-farm.env.local`
   - `.env-vault/empathy-ledger.env.local`
   - `.env-vault/justicehub.env.local`
   - `.env-vault/goods-on-country.env.local`
   - `.env-vault/act-hub.env.local`

4. Update Roadmap view to show Goods on Country

---

**Total GHL Setup**: 1 Master + 5 Sub-accounts = **6 GHL accounts**
**Total Pipelines**: 30 (5 per account)
**Total Projects**: 6 (ACT Hub + 5 active seeds)

---

**Last Updated**: December 24, 2025
**Maintained By**: ACT Development Team
