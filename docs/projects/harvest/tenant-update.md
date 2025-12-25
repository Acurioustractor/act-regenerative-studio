# The Harvest - Tenant/Vendor Pipeline Implementation

## ✅ What's Been Added

### **New Inquiry Options in Contact Form**
Added 3 new options to The Harvest contact form dropdown:
1. **Tenant/Vendor Opportunity** - For long-term commercial tenants (cafe, retail, wellness, etc.)
2. **Pop-up Event Space** - For weekend markets, seasonal vendors, food trucks
3. **Witta Business Collaboration** - For local business partnerships (Witta General Store, cafes, tourism)

### **Complete Tenant Management Pipeline**
Created comprehensive 14-stage pipeline covering the full tenant lifecycle:

**Stages**:
1. Inquiry
2. Initial Review (mission alignment check)
3. Discovery Call
4. Site Visit Scheduled
5. Proposal Sent
6. Negotiation
7. Agreement Preparation
8. Agreement Signed
9. Fitout Period
10. Active Tenant
11. Tenant Support (optional, for struggling tenants)
12. Renewal Discussion
13. Offboarding
14. Alumni

**See**: [/The Harvest/TENANT_VENDOR_PIPELINE.md](../The%20Harvest/TENANT_VENDOR_PIPELINE.md) for complete documentation (60+ pages!)

---

## 💰 Revenue Opportunity

### **Tenant Types Supported**

**Long-Term Tenants** (Primary Revenue):
- Farm-to-table restaurant/cafe (anchor tenant)
- Community retail (local goods, crafts, produce)
- Wellness practitioners (yoga studio, therapy rooms)
- Educational spaces (children's programs, workshops)
- Office/co-working spaces

**Pop-Up Vendors** (Supplementary Revenue):
- Weekend markets (farmers, crafters, artists)
- Seasonal events (Christmas markets, harvest festivals)
- Food trucks/mobile vendors
- Guest makers (pottery, textiles, woodwork)

**Revenue Models**:
1. **Fixed Rent**: $500-$3,000/month (stable, predictable)
2. **Revenue Share**: 10-30% of gross revenue (risk/reward shared)
3. **Hybrid**: Low base rent + % over threshold (balanced)
4. **Equity Partnership**: Ownership stake in exchange for capital/sweat equity
5. **Barter/Trade**: Services to community in lieu of rent (therapists, educators)

**Example Revenue Scenarios**:
- **Scenario 1 (Conservative)**: 2 tenants @ $1,500/month = $3,000/month = $36,000/year
- **Scenario 2 (Moderate)**: 4 tenants @ $1,200/month average = $4,800/month = $57,600/year
- **Scenario 3 (Full Occupancy)**: 6 tenants @ $1,500/month average = $9,000/month = $108,000/year
- **Plus**: Pop-up vendors @ $100/day × 8 events/month = $800/month = $9,600/year

**Total Potential**: $45,000 - $120,000/year from tenant/vendor revenue

---

## 🎯 Strategic Rationale

### **Why Tenant Management is Critical**

1. **Financial Sustainability**:
   - Recurring revenue from tenants funds community programs
   - Reduces reliance on grants, donations
   - Creates cash flow for maintenance, staff, growth

2. **Community Vibrancy**:
   - Tenants bring foot traffic, activity, life to the site
   - Cross-promotion between tenants benefits all
   - Local businesses strengthen Witta economy

3. **Mission Alignment**:
   - Farm-to-table cafe showcases garden produce
   - Wellness practitioners complement therapeutic programs
   - Educational tenants expand youth/community offerings

4. **Heritage Activation**:
   - Historic site becomes working community hub (not just museum)
   - Adaptive reuse of buildings (commercial kitchen, retail, studios)
   - Economic viability ensures long-term preservation

5. **Risk Mitigation**:
   - Multiple tenants = diversified revenue (if one leaves, others remain)
   - Equity partnerships = shared financial burden
   - Pop-ups = low-risk testing ground before long-term leases

---

## 🔄 Integration with GHL

### **Form Routing**
When someone selects tenant/vendor options:
- Tagged: `the-harvest`, `interest:tenant` (or `interest:popup`, `interest:witta-business`)
- Routed to: Tenant/Vendor Pipeline (instead of Volunteer or Event pipeline)
- Priority: Medium (or High for anchor tenant types like cafe)

### **Automation Workflows** (To Be Built)

**Inquiry Stage**:
- Auto-response within 5 minutes with tenant info pack
- Team notification (Slack/email) with inquiry details
- Follow-up if no manual response within 3 days

**Discovery Call**:
- Calendar booking link sent automatically
- Reminder if not booked within 7 days
- Pre-call questionnaire (business type, space needs, budget)

**Proposal Stage**:
- Template-based proposal generation
- Follow-up sequence: Day 7, Day 14, Day 21 if no response
- Move to "Nurture" if not ready after 21 days

**Active Tenant**:
- Monthly rent invoice (automated, 3 days before due)
- Late payment reminders (Day 1, Day 7, Day 14 overdue)
- Quarterly satisfaction survey
- Annual renewal reminder (90 days before lease expiration)

**Offboarding**:
- 60-day exit checklist
- Final inspection scheduling
- Alumni invitation (stay connected, refer others, return opportunity)

---

## 📋 Custom Fields to Capture

**Business Info**:
- `business_name`
- `tenant_type` (restaurant, retail, wellness, education, office, popup, sole-trader)
- `business_description`
- `proposed_use` (what they want to do at The Harvest)

**Space Requirements**:
- `space_needs` (sq ft, indoor/outdoor, utilities needed)
- `budget_range` ($/month they can afford)
- `timeline` (when they want to start)

**Financial**:
- `pricing_model` (fixed rent, revenue share, hybrid, equity, barter)
- `rent_amount` or `revenue_share_percentage`
- `payment_status` (pending, paid, overdue)
- `lease_start_date`, `lease_end_date`

**Performance**:
- `tenant_status` (inquiry, active, support, renewal, offboarding, alumni)
- `performance_score` (1-5, based on payments, community feedback)
- `community_participation` (# events involved, hours contributed)
- `renewal_likelihood` (will they renew? yes/maybe/no)

---

## 📊 Metrics to Track

**Pipeline Health**:
- Inquiries per month (target: 5-10)
- Conversion rate (inquiry → signed lease) (target: 20-30%)
- Average time to sign (target: 60-90 days)
- Drop-off analysis (which stage do most exit?)

**Tenant Performance**:
- Occupancy rate (% of available space leased) (target: 80%+)
- Revenue per tenant (average $/month)
- Tenant satisfaction score (quarterly survey) (target: 4/5)
- Retention rate (% who renew after first lease) (target: 70%+)

**Community Impact**:
- Tenant event participation (% involved in community events)
- Cross-tenant collaborations (joint workshops, bundles)
- Local employment (% of tenant staff from Witta/Maleny)
- Mission alignment score (values assessment, 1-5)

**Financial**:
- Monthly recurring revenue (MRR) from tenants
- Revenue per square foot
- Operating expense ratio (tenant costs vs. revenue)
- Profitability per tenant

---

## 🚀 Next Steps

### **Immediate (Week 1-2)**
1. ✅ **Update contact form** - Add tenant/vendor options (DONE)
2. ✅ **Update API routing** - Handle new inquiry types (DONE)
3. ✅ **Create pipeline documentation** - 14-stage tenant pipeline (DONE)
4. ⏳ **Create GHL pipeline** in The Harvest sub-account (USER ACTION)
5. ⏳ **Build automation workflows** (auto-responses, follow-ups)

### **Short-Term (Month 1)**
6. Create email templates (20+ templates for all stages)
7. Set up calendar bookings (discovery calls, site visits)
8. Build tenant onboarding sequence
9. Create lease agreement templates (rent, revenue share, equity)
10. Design tenant handbook (policies, community expectations)

### **Medium-Term (Months 2-3)**
11. Build reporting dashboard (occupancy, revenue, pipeline health)
12. Create tenant portal (self-service rent payment, maintenance requests)
13. Launch tenant recruitment campaign (social media, local outreach)
14. Host tenant open house events (show the space, meet community)

### **Long-Term (Months 4-6)**
15. Sign first anchor tenant (cafe/restaurant)
16. Launch pop-up market series (monthly weekend markets)
17. Build tenant community (monthly meetups, collaboration opportunities)
18. Measure impact (revenue, community vibrancy, mission alignment)

---

## 💡 Strategic Opportunities

### **Cross-Project Synergies**

**The Harvest ↔ ACT Farm**:
- Farm-to-table cafe at The Harvest sources from ACT Farm
- ACT Farm residency participants pop-up at The Harvest markets
- Shared supply chain, bulk ordering, logistics

**The Harvest ↔ Empathy Ledger**:
- Tenant success stories featured on Empathy Ledger
- Storyteller profiles highlight local businesses
- Impact reporting (how tenants serve community)

**The Harvest ↔ JusticeHub**:
- Tenants offer employment to JusticeHub youth
- Service providers list The Harvest programs
- Cross-referral (youth programs → therapeutic horticulture)

### **Community-Centered Tenancy**

**Not Just Commercial Leases**:
- Tenants expected to participate in community (not just pay rent)
- Monthly tenant meetings (coordination, collaboration, mutual support)
- Shared values charter (sustainability, inclusion, local focus)
- Community event co-hosting (tenants involved in festivals, workshops)

**Example**:
Cafe tenant provides:
- Free community coffee morning (first Friday monthly)
- Discounted meals for program participants
- Cooking classes for youth programs
- Catering for community events (at cost)

In return:
- Prominent location at heritage site
- Marketing via The Harvest channels
- Guaranteed customer base (volunteers, program participants, events)
- Lower rent (barter model)

---

## 🎓 Learning from Other Community Hubs

**Successful Models to Emulate**:

1. **Daylesford Convent** (Victoria):
   - Historic site with 20+ tenants (cafe, galleries, retail, wellness)
   - Mix of rent and revenue share models
   - Strong community events (markets, festivals, workshops)
   - Annual turnover: $2M+ from tenant/visitor revenue

2. **Abbotsford Convent** (Melbourne):
   - 60+ creative tenants (artists, studios, offices, performance spaces)
   - Tiered pricing (subsidized for artists, market rate for commercial)
   - Community ownership model (social enterprise, not-for-profit)
   - Revenue funds heritage preservation + community programs

3. **The Commons** (Byron Bay):
   - Co-working + retail + wellness + cafe in regenerative building
   - Focus on aligned businesses (sustainability, social impact)
   - Cross-promotional ecosystem (tenants support each other)
   - Community events drive foot traffic for all tenants

**Key Success Factors**:
- **Mission clarity**: Know what you stand for, attract aligned tenants
- **Diverse mix**: Different tenant types create vibrancy (not monoculture)
- **Community first**: Tenants serve community, not just profit
- **Professional management**: Clear leases, fair terms, consistent enforcement
- **Flexibility**: Adapt to tenant needs, market changes, community feedback

---

## 📖 Resources Created

1. **[TENANT_VENDOR_PIPELINE.md](../The%20Harvest/TENANT_VENDOR_PIPELINE.md)** - Complete 14-stage pipeline guide (60 pages)
2. **Updated contact form** - 3 new tenant/vendor options
3. **Updated API routing** - Handles new inquiry types
4. **Environment template** - Added `GHL_TENANT_PIPELINE_ID` variable
5. **Updated master strategy** - Tenant pipeline integrated into main GHL document

---

## 🎯 Success Vision

**6 Months from Now**:
- 3-5 active tenants generating $3,000-$6,000/month
- Monthly pop-up markets with 10-15 vendors
- Thriving community hub with daily foot traffic
- Cross-tenant collaborations (cafe sources from farm, yoga studio partners with therapists)
- Financial sustainability (tenant revenue funds community programs)

**12 Months from Now**:
- Full occupancy (6-8 tenants)
- $8,000-$10,000/month recurring tenant revenue
- Waitlist for retail/studio spaces
- Nationally recognized model (social enterprise + heritage + community)
- Replicable framework (other community hubs adopting The Harvest model)

---

**The Harvest tenant management pipeline transforms the site from a volunteer-run community garden into a financially sustainable, vibrant community hub that preserves heritage while serving the present and building the future.**
