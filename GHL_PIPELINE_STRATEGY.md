# GoHighLevel CRM & Pipeline Strategy
## Complete Customer Journey Architecture Across All ACT Projects

**Purpose**: Unified CRM strategy connecting all conversion points, user journeys, and revenue streams across The Harvest, ACT Farm, Empathy Ledger, and JusticeHub.

---

## 🎯 Strategic Overview

### Vision
Create a single source of truth for all customer interactions across 4 distinct but connected social impact projects, enabling:
- **Automated nurture sequences** for every user type
- **Cross-project referrals** (e.g., JusticeHub storyteller → Empathy Ledger)
- **Unified reporting** on social impact metrics
- **Revenue tracking** across membership, residencies, platform fees
- **Pipeline visibility** for team collaboration

### Current State
- ❌ No centralized CRM
- ❌ Manual inquiry management (email/spreadsheets)
- ❌ No automated follow-ups
- ❌ No conversion tracking
- ❌ Limited cross-project awareness
- ✅ Strong individual project identities
- ✅ Clear user personas per project
- ✅ Existing payment systems (Stripe in Empathy Ledger)

### Target State (Post-GHL Integration)
- ✅ All inquiries centralized in GHL
- ✅ Automated 3-5 day response reminders
- ✅ Pipeline visualization for each user journey
- ✅ Email/SMS nurture sequences per persona
- ✅ Booking calendars integrated
- ✅ Payment processing unified
- ✅ Cross-project referral tracking
- ✅ Monthly impact reporting automated

---

## 📊 Pipeline Architecture

### Master Pipeline Structure (Per Project)

Each project gets **3-5 core pipelines** representing distinct user journeys:

---

## THE HARVEST - Pipelines

### 1. **Tenant/Vendor Pipeline** (Revenue-Generating, High Priority)
**Purpose**: Manage commercial tenants, pop-up vendors, and community businesses

**Stages**:
1. **Inquiry** - Submitted tenant/vendor/pop-up inquiry
2. **Initial Review** - Team assesses mission alignment
3. **Discovery Call** - 30-min exploratory conversation
4. **Site Visit Scheduled** - Showing the space
5. **Proposal Sent** - Formal offer with terms
6. **Negotiation** - Discussing terms, pricing, partnership model
7. **Agreement Preparation** - Drafting lease/contracts
8. **Agreement Signed** - All documents executed, deposit paid
9. **Fitout Period** - Preparing space for opening (1-12 weeks)
10. **Active Tenant** - Business operational
11. **Tenant Support** - (Optional) Struggling tenant receiving help
12. **Renewal Discussion** - 90 days before lease expiration
13. **Offboarding** - Tenant leaving (planned exit)
14. **Alumni** - Former tenant, departed on good terms

**Automation**:
- **Inquiry**: Auto-response within 5 minutes, team notification
- **Proposal sent**: Follow-up at 7, 14, 21 days if no response
- **Agreement signed**: Welcome sequence (Day 1, Day 3, Week 1)
- **Active tenant**:
  - Monthly rent invoice (3 days before due)
  - Quarterly satisfaction survey
  - Annual renewal reminder (90 days before)
- **Offboarding**: Exit survey, alumni invitation

**Custom Fields**:
- `tenant_type` (restaurant, retail, wellness, education, office, popup, sole-trader)
- `business_name`
- `space_needs` (sq ft, indoor/outdoor, utilities)
- `pricing_model` (fixed rent, revenue share, hybrid, equity, barter)
- `rent_amount` or `revenue_share_percentage`
- `lease_start_date`, `lease_end_date`
- `tenant_status` (inquiry, active, support, renewal, offboarding, alumni)
- `performance_score` (1-5, based on payments, community feedback)

**Revenue Models**:
- **Fixed Rent**: $500-$3,000/month (depends on space)
- **Revenue Share**: 10-30% of gross revenue
- **Hybrid**: Low base + % over threshold
- **Equity Partnership**: Ownership stake in The Harvest
- **Barter/Trade**: Services to community in lieu of rent

**See**: [/The Harvest/TENANT_VENDOR_PIPELINE.md](../The%20Harvest/TENANT_VENDOR_PIPELINE.md) for complete details

---

### 2. **Volunteer Pipeline**
**Purpose**: Manage volunteer recruitment and retention

**Stages**:
1. **Inquiry** - Filled out contact form or called
2. **Invited to Orientation** - Sent orientation date/details
3. **Attended Orientation** - Came to first Friday coffee
4. **Active Volunteer** - Regular participant (weekly/monthly)
5. **Inactive** - Not attended in 3+ months
6. **Alumni** - Moved away but wants updates

**Automation**:
- **Trigger**: Contact created with tag `the-harvest` + `interest:volunteering`
- **Day 1**: Send welcome email with orientation dates
- **Day 3**: SMS reminder with phone number 0424 054 113
- **Day 7**: Follow-up if no orientation booked
- **Monthly**: Send volunteer day schedule to active volunteers
- **After 3 months inactive**: Re-engagement email ("We miss you!")

**Custom Fields**:
- `volunteer_skills` (gardening, cooking, admin, teaching)
- `availability` (weekday/weekend/flexible)
- `background_check_date` (for working with youth)
- `t_shirt_size` (for volunteer uniform)
- `dietary_requirements`

---

### 2. **Member Pipeline**
**Purpose**: Manage community membership and governance

**Stages**:
1. **Interested** - Expressed interest in membership
2. **Application Sent** - Sent membership form
3. **Approved** - Board approved membership
4. **Paid** - Membership fee received ($25/yr, $10 concession, $0 youth)
5. **Active Member** - Current year paid up
6. **Renewal Due** - Membership expiring in 30 days
7. **Lapsed** - Membership expired

**Automation**:
- **Trigger**: Tag `interest:membership`
- **Day 1**: Send membership info pack (PDF with benefits, governance rights)
- **Day 3**: Send payment link (Stripe checkout)
- **Day 30**: Remind if not paid
- **60 days before renewal**: Early renewal discount email
- **30 days before expiry**: Renewal reminder
- **Day of expiry**: Final renewal notice
- **7 days after expiry**: "We'd love to have you back" email

**Custom Fields**:
- `membership_type` (full/concession/youth/life)
- `membership_start_date`
- `membership_expiry_date`
- `governance_interests` (board/events/gardens/youth)
- `payment_method` (stripe/bank/cash)

---

---

### 3. **Member Pipeline**
**Purpose**: Community membership and governance

**Stages**:
1. **Interested** - Expressed interest in membership
2. **Application Sent** - Sent membership form
3. **Approved** - Board approved membership
4. **Paid** - Membership fee received ($25/yr, $10 concession, $0 youth)
5. **Active Member** - Current year paid up
6. **Renewal Due** - Membership expiring in 30 days
7. **Lapsed** - Membership expired

**Automation**:
- **Trigger**: Tag `interest:membership`
- **Day 1**: Send membership info pack (PDF with benefits, governance rights)
- **Day 3**: Send payment link (Stripe checkout)
- **Day 30**: Remind if not paid
- **60 days before renewal**: Early renewal discount email
- **30 days before expiry**: Renewal reminder
- **Day of expiry**: Final renewal notice
- **7 days after expiry**: "We'd love to have you back" email

**Custom Fields**:
- `membership_type` (full/concession/youth/life)
- `membership_start_date`
- `membership_expiry_date`
- `governance_interests` (board/events/gardens/youth)
- `payment_method` (stripe/bank/cash)

---

### 4. **Program Participant Pipeline**
**Purpose**: Therapeutic horticulture, youth programs, educational groups

**Stages**:
1. **Referral Received** - From GP, therapist, school, NDIS coordinator
2. **Intake Scheduled** - Booked initial assessment
3. **Program Matched** - Assigned to therapeutic/youth/education program
4. **Active Participant** - Attending sessions
5. **Program Completed** - Finished initial program
6. **Ongoing Support** - Continued engagement post-program

**Automation**:
- **Trigger**: Tag `program:therapeutic` or `program:youth` or `program:education`
- **Day 1**: Send intake questionnaire (health, accessibility, goals)
- **Day 3**: Coordinator assigns to program, sends welcome pack
- **Day 7**: Reminder before first session
- **Weekly**: Session reminders (if opted in)
- **End of program**: Feedback survey
- **30 days post-program**: Check-in email

**Custom Fields**:
- `referral_source` (GP/therapist/school/self)
- `program_type` (therapeutic/youth/education)
- `accessibility_needs`
- `emergency_contact`
- `session_frequency` (weekly/fortnightly/monthly)
- `outcomes_tracker` (wellbeing score, attendance rate)

---

### 4. **Partner/Sponsor Pipeline**
**Purpose**: Business sponsors, healthcare partners, educational institutions

**Stages**:
1. **Initial Contact** - Partnership inquiry received
2. **Discovery Call** - Exploratory conversation
3. **Proposal Sent** - Customized partnership options
4. **Negotiation** - Terms being discussed
5. **Agreement Signed** - Active partnership
6. **Renewal** - Annual partnership review

**Automation**:
- **Trigger**: Tag `interest:partnership`
- **Day 1**: Send partnership prospectus (PDF)
- **Day 3**: Book discovery call (GHL calendar)
- **Day 7**: Follow-up if no call booked
- **After call**: Automated proposal template generation
- **30 days before renewal**: Partnership review meeting invitation

**Custom Fields**:
- `partner_type` (business/healthcare/education/government)
- `partnership_value` ($ annual contribution)
- `partnership_benefits` (CSA boxes, team building, branding)
- `renewal_date`

---

## ACT FARM - Pipelines

### 1. **Residency Pipeline** (High Value)
**Purpose**: Manage R&D residency applications and bookings

**Stages**:
1. **Inquiry** - Submitted interest via contact form
2. **Application Sent** - Full residency application form emailed
3. **Application Received** - Completed application submitted
4. **Under Review** - Team assessing fit with conservation mission
5. **Approved** - Residency approved, awaiting dates
6. **Dates Confirmed** - Calendar booking made
7. **Payment Received** - Prepaid $300-$500/night
8. **Pre-Arrival** - 2 weeks before arrival (logistics)
9. **In Residence** - Currently on-site
10. **Completed** - Residency finished
11. **Alumni** - Ongoing research partnership

**Automation**:
- **Trigger**: Tag `interest:residency` + `priority:high`
- **Day 1**: Send detailed application form (research proposal, conservation alignment, dates, budget)
- **Day 3**: Send residency guide PDF (accommodation, equipment, research support)
- **Application received**: Notify team for review (Slack/email)
- **Approved**: Send available dates calendar link (GHL calendar)
- **Dates confirmed**: Send payment invoice (Stripe/bank transfer)
- **Payment received**: Send pre-arrival pack (what to bring, access codes, emergency contacts)
- **7 days before**: Arrival logistics email + SMS
- **Day 1 of residency**: Check-in message
- **Mid-residency**: Check-in (needs anything?)
- **Last day**: Checkout instructions
- **Day after departure**: Thank you + research outputs request
- **30 days post**: Alumni network invitation
- **6 months**: Return visit offer

**Custom Fields**:
- `research_focus` (conservation tech, regenerative practice, creative documentation, wellbeing)
- `institution_affiliation` (USC, NGO, independent)
- `residency_duration` (days)
- `residency_dates` (start/end)
- `accommodation_needs` (current cabins, future eco-cabins)
- `equipment_needed` (microscopes, cameras, monitoring tools)
- `budget` ($300-$500/night × duration)
- `research_outputs` (papers, tools, documentation produced)
- `conservation_impact` (hectares monitored, species documented, etc.)

---

### 2. **June's Patch Pipeline** (Healthcare Workers)
**Purpose**: Nature-based wellbeing for healthcare workers

**Stages**:
1. **Referral/Self-Inquiry** - Healthcare worker interested
2. **Intake Questionnaire Sent** - Health, wellbeing, needs assessment
3. **Therapist Matched** - Assigned to appropriate practitioner
4. **Program Designed** - Customized nature prescription
5. **Sessions Scheduled** - Calendar bookings made
6. **Active Participant** - Attending sessions
7. **Program Review** - Mid-program check-in
8. **Program Completed** - Finished initial program
9. **Maintenance Plan** - Ongoing support post-program

**Automation**:
- **Trigger**: Tag `interest:junes-patch` + `priority:high` + `healthcare`
- **Day 1**: Send healthcare worker wellbeing intake form
- **Day 2**: Notify June's Patch coordinator (high priority)
- **Day 3**: Therapist assignment + welcome call
- **Day 5**: Send customized program plan
- **Weekly**: Session reminders
- **Mid-program**: Wellbeing check-in survey
- **End of program**: Outcomes assessment
- **Monthly post-program**: Maintenance check-ins

**Custom Fields**:
- `healthcare_role` (nurse, doctor, paramedic, allied health)
- `wellbeing_needs` (burnout, stress, compassion fatigue, PTSD)
- `referral_source` (self/GP/employer/NDIS)
- `funding_source` (NDIS, private, workplace EAP)
- `therapist_assigned`
- `session_frequency`
- `wellbeing_baseline_score`
- `wellbeing_outcome_score`
- `nature_prescription` (forest bathing, gardening, animal therapy)

---

### 3. **Workshop/Event Pipeline**
**Purpose**: Regeneration monitoring workshops, farm tours

**Stages**:
1. **Interested** - Expressed interest in workshop
2. **Registered** - Booked and paid
3. **Confirmed** - Received confirmation email
4. **Reminded** - 1 week and 1 day reminders sent
5. **Attended** - Checked in at workshop
6. **Completed** - Finished workshop
7. **Follow-up Resources Sent** - Post-workshop materials
8. **Repeat Attendee** - Signed up for another workshop

**Automation**:
- **Trigger**: Tag `interest:workshop`
- **Day 1**: Send workshop calendar (upcoming dates)
- **Upon registration**: Confirmation email + calendar invite
- **7 days before**: Reminder email with location/parking
- **1 day before**: SMS reminder
- **During workshop**: Attendance tracking (check-in form)
- **Day after**: Thank you + resource pack (slides, readings, tool links)
- **30 days later**: Next workshop announcement

**Custom Fields**:
- `workshop_type` (regeneration monitoring, conservation tools, land management)
- `workshop_date`
- `ticket_type` (early bird, regular, scholarship)
- `payment_status`
- `attendance_status` (registered/attended/no-show)
- `feedback_score`

---

### 4. **General Inquiry Pipeline**
**Purpose**: Accommodation, collaboration, miscellaneous inquiries

**Stages**:
1. **New Inquiry** - Contact form submitted
2. **Categorized** - Tagged by type (accommodation/collaboration/media)
3. **Response Sent** - 3-5 business day reply
4. **Qualified** - Relevant to ACT Farm mission
5. **Not Qualified** - Redirected to appropriate resource
6. **Converted** - Became residency/workshop/partner
7. **Closed** - No further action

**Automation**:
- **Trigger**: Tags `interest:accommodation`, `interest:collaboration`, `interest:other`
- **Day 1**: Auto-reply "We received your inquiry, will respond in 3-5 days"
- **Day 3**: Reminder to team if no manual response
- **Day 6**: Escalation if still no response
- **After response**: Move to qualified/not qualified based on outcome

---

## EMPATHY LEDGER - Pipelines

### 1. **Storyteller Onboarding Pipeline**
**Purpose**: Individual storytellers joining platform

**Stages**:
1. **Registration Started** - Began onboarding form (Step 1 of 3)
2. **Registration Abandoned** - Didn't complete form (trigger re-engagement)
3. **Registration Completed** - Finished 3-step form
4. **Profile Under Review** - Cultural protocol review (if applicable)
5. **Profile Approved** - Ready to create stories
6. **First Story Created** - Uploaded first transcript/photo
7. **Story Published** - First story live (public/community/private)
8. **Active Storyteller** - Multiple stories, regular uploads
9. **Revenue Earning** - Generating income via platform
10. **Advocate** - Referring other storytellers

**Automation**:
- **Registration started**: Save progress, send "Complete your profile" email after 24 hours
- **Registration completed**: Welcome email series (Day 1: Platform tour, Day 3: First story tips, Day 7: Success stories)
- **Cultural protocol review**: Notify community representative, send to storyteller when approved
- **First story created**: Congratulations email, share on social media (with permission)
- **Active milestone** (10 stories): Recognition badge, feature in newsletter
- **Revenue milestone** ($100 earned): Thank you, testimonial request
- **90 days inactive**: Re-engagement campaign

**Custom Fields**:
- `role` (midwife, teacher, social entrepreneur, healthcare worker, etc.)
- `organization`
- `cultural_background` (if Indigenous, which Nation/Country)
- `privacy_level` (public/community/private)
- `story_count`
- `total_revenue_earned`
- `last_upload_date`
- `community_approval_required` (yes/no)
- `analytics_opt_in` (yes/no)

---

### 2. **Organization Pipeline**
**Purpose**: NGOs, government agencies, researchers seeking storyteller network access

**Stages**:
1. **Inquiry** - Organization interested in platform
2. **Discovery Call** - Exploratory conversation
3. **Demo Provided** - Platform walkthrough
4. **Proposal Sent** - Pricing, API access, white-label options
5. **Contract Negotiation** - Terms being finalized
6. **Onboarded** - Organization account created
7. **Active Partner** - Using platform, generating impact reports
8. **Renewal** - Annual contract review

**Automation**:
- **Day 1**: Send organization info pack (case studies, pricing tiers, API docs)
- **Day 3**: Book discovery call
- **After call**: Send customized proposal
- **Contract signed**: Onboarding sequence (admin training, API setup, brand integration)
- **Monthly**: Usage reports, impact metrics
- **60 days before renewal**: Renewal conversation

**Custom Fields**:
- `organization_type` (NGO, government, academic, corporate)
- `use_case` (grant reporting, program evaluation, research, storytelling)
- `contract_value` ($/year)
- `api_access` (yes/no)
- `white_label` (yes/no)
- `storyteller_count` (how many storytellers they've connected)
- `impact_reports_generated`

---

### 3. **Partnership/Research Pipeline**
**Purpose**: Collaborators, academics, technology partners

**Stages**:
1. **Initial Contact** - Partnership inquiry
2. **Alignment Call** - Values, mission, capacity fit
3. **Collaboration Proposal** - Co-created project scope
4. **Agreement Signed** - MOU or contract
5. **Project Underway** - Active collaboration
6. **Project Completed** - Deliverables finished
7. **Ongoing Relationship** - Continued partnership

**Automation**:
- Standard partnership nurture sequence
- Monthly collaboration check-ins
- Joint publication/announcement coordination

---

## JUSTICEHUB - Pipelines

### 1. **Family Support Pipeline**
**Purpose**: Families with youth in justice system seeking services

**Stages**:
1. **Crisis Inquiry** - Family just learned youth entered system
2. **Needs Assessment** - Determined what services needed
3. **Services Recommended** - Matched to appropriate providers
4. **Service Contact Made** - Family connected with provider(s)
5. **Actively Supported** - Family engaged with services
6. **Follow-up Check-in** - 30/60/90 day check-ins
7. **Success** - Youth transition successful, family stabilized
8. **Advocate** - Family wants to give back, support others

**Automation**:
- **Crisis inquiry**: Immediate response (within hours, not days) with crisis resources
- **Day 1**: Send service finder guide, how to navigate system
- **Day 2**: Personalized service recommendations based on location/needs
- **Day 7**: Check-in call scheduled (via calendar)
- **Monthly**: Follow-up survey (how are services working?)
- **Success milestone**: Story submission invitation, testimonial request
- **Advocate path**: Volunteer opportunities, campaign involvement

**Custom Fields**:
- `youth_age`
- `youth_current_status` (remand, sentenced, diversion program, post-release)
- `family_location` (for service matching)
- `services_needed` (legal, mental health, education, housing, employment)
- `services_connected` (which providers contacted)
- `case_urgency` (crisis, high, medium, low)
- `consent_to_follow_up` (yes/no)

---

### 2. **Service Provider Pipeline**
**Purpose**: Organizations offering youth justice services wanting to be listed

**Stages**:
1. **Application Submitted** - Service provider signup form
2. **Verification** - Checking legitimacy, quality, WWCC
3. **Profile Created** - Service details added to directory
4. **Listed** - Live in service finder
5. **Active** - Receiving referrals, updating info
6. **Renewal** - Annual re-verification

**Automation**:
- **Application submitted**: Acknowledge, send verification requirements (WWCC, insurance, references)
- **Verification complete**: Welcome to network, profile setup guide
- **Listed**: Monthly referral reports (how many families viewed your service)
- **Quarterly**: Quality check-in, update service details
- **Annual renewal**: Re-verification reminder

**Custom Fields**:
- `service_type` (legal, mental health, education, housing, employment, cultural)
- `age_range_served` (10-14, 15-17, 18-21)
- `location_coverage` (suburbs/regions covered)
- `capacity` (accepting new referrals? yes/no/waitlist)
- `wwcc_expiry_date`
- `referrals_received_count`
- `family_feedback_score`

---

### 3. **Campaign Pipeline** (CONTAINED Experience)
**Purpose**: Nominate leaders to experience justice system, book facility visits

**Stages**:
1. **Nominated** - Leader nominated by community member
2. **Contacted** - Outreach to nominated leader
3. **Engaged** - Leader interested in experience
4. **Booked** - Facility visit scheduled
5. **Attended** - Completed CONTAINED experience
6. **Advocate** - Leader now championing reform
7. **Ambassador** - Ongoing public advocacy, media, policy influence

**Automation**:
- **Nomination submitted**: Thank nominator, send campaign update
- **Leader contacted**: Personalized outreach email (from campaign director)
- **Engaged**: Send booking link, CONTAINED experience details
- **Booked**: Confirmation email, preparation guide
- **1 week before**: Logistics reminder
- **Day after experience**: Thank you, media consent form
- **Advocate milestone**: Feature in campaign, social media amplification
- **Quarterly**: Ambassador gatherings, policy briefings

**Custom Fields**:
- `nominee_category` (politician, justice official, media, business, philanthropist, community leader)
- `nominator_name`
- `nomination_reason`
- `contact_status` (not contacted, reached out, responded, declined)
- `booking_date`
- `attendance_status`
- `post_experience_action` (statement, media interview, policy change)
- `ambassador_level` (one-time, recurring, champion)

---

### 4. **Story Submission Pipeline**
**Purpose**: Young people sharing transformation stories

**Stages**:
1. **Story Started** - Began multi-step form
2. **Story Abandoned** - Didn't complete submission
3. **Story Submitted** - Awaiting 48-hour review
4. **Under Review** - Team assessing (safety, quality, consent)
5. **Approved** - Story ready to publish
6. **Published** - Live on platform
7. **Featured** - Highlighted in campaign/media
8. **Storyteller Alumni** - Multiple stories, ongoing engagement

**Automation**:
- **Story started**: Auto-save, send "Finish your story" reminder after 24 hours
- **Story submitted**: Acknowledge, explain 48-hour review process
- **Under review**: Notify review team
- **Approved**: Congratulations, story is live, share links
- **Published**: Social media amplification (with consent)
- **Featured**: Media kit, storyteller support, speaking opportunities
- **Alumni**: Invitation to story circles, advocate training

**Custom Fields**:
- `story_theme` (transformation, education, healing, foster care, advocacy, etc.)
- `visibility_preference` (public, network-only, anonymous)
- `consent_level` (name/photo/full story)
- `age_at_story_time`
- `program_involved` (which service helped them)
- `review_status` (pending, approved, featured)
- `media_consent` (yes/no)

---

## 🔄 Cross-Project Referral Workflows

### **The Harvest → ACT Farm**
- Volunteer shows interest in conservation research → Tagged for ACT Farm residency info
- Therapeutic program participant improves → Invited to June's Patch follow-up

### **ACT Farm → The Harvest**
- Residency participant from Brisbane area → Invited to The Harvest community events
- June's Patch graduate → Volunteer opportunities at The Harvest gardens

### **Empathy Ledger → JusticeHub**
- Storyteller works in youth justice → Invited to share story on JusticeHub
- Organization partner overlaps both platforms → Unified reporting

### **JusticeHub → Empathy Ledger**
- Young person sharing transformation story → Offered Empathy Ledger profile for ongoing storytelling
- Advocate/service provider → Empathy Ledger storyteller opportunity

### **GHL Automation**:
- Tags trigger cross-project workflows
- Example: Tag `cross-project:act-farm-harvest` triggers email: "You might also be interested in The Harvest community hub..."
- Unified contact record prevents duplicate outreach

---

## 📅 Calendar Integration Strategy

### **The Harvest**
- **Volunteer Days** (weekly recurring)
- **Community Coffee** (first Friday monthly)
- **Member Meetings** (quarterly)
- **Therapeutic Program Sessions** (individual scheduling)

### **ACT Farm**
- **Residency Bookings** (multi-day, limited capacity: 2 concurrent)
- **Workshop Calendar** (monthly events, 10-20 attendee capacity)
- **June's Patch Sessions** (individual therapy appointments)

### **Empathy Ledger**
- **Community Approval Meetings** (cultural protocol review)
- **Organization Demo Calls** (sales pipeline)

### **JusticeHub**
- **CONTAINED Experience Bookings** (24 slots/day, group size 1-5+)
- **Family Support Check-in Calls** (coordinator calendar)

**GHL Calendar Features Needed**:
- Multi-day booking (residencies)
- Recurring availability (therapy, volunteer days)
- Group booking (workshops, CONTAINED)
- Buffer time between appointments
- Team member assignments (therapists, coordinators)

---

## 💰 Revenue Tracking & Reporting

### **Revenue Streams by Project**

**The Harvest**:
- Membership Fees: $25/yr × member count (or $10 concession)
- Workshop Fees: Variable per workshop
- CSA Subscriptions: Weekly/monthly recurring
- Donations: One-time and recurring
- **GHL Pipeline Value**: Sum of membership renewals, workshop registrations, CSA subscriptions

**ACT Farm**:
- Residency Fees: $300-$500/night × duration × bookings
- Workshop Fees: $50-150/attendee × workshop count
- June's Patch: NDIS/private pay per session
- Future Accommodation: Eco-glamping revenue (future)
- **GHL Pipeline Value**: Sum of residency bookings, workshop tickets, therapy sessions

**Empathy Ledger**:
- Platform Fees: % of storyteller revenue
- Organization Subscriptions: $XXX/month or $X,XXX/year per org
- API Access Fees: Tiered pricing
- White-label Licensing: Premium pricing
- **GHL Pipeline Value**: MRR (monthly recurring revenue) tracking

**JusticeHub**:
- CONTAINED Bookings: $0-$50 pay-what-you-can × attendees
- Grant Funding: Track grant applications, awarded amounts
- Donations: One-time and recurring
- **GHL Pipeline Value**: Sum of booking revenue, grant amounts, donations

**Unified Reporting**:
- Monthly revenue dashboard across all projects
- Pipeline health (open opportunities, expected close dates)
- Conversion rates (inquiry → booking/membership/partnership)
- Lifetime value per user persona

---

## 🤖 Automation Workflows to Build

### **High Priority** (Week 1-2)

1. **Contact Form Auto-Response**:
   - All 4 projects
   - Immediate: "We received your inquiry"
   - Day 3-5: Manual response reminder to team
   - Day 7: Escalation if no response

2. **Booking Confirmation**:
   - The Harvest: Workshop registration
   - ACT Farm: Residency/workshop booking
   - JusticeHub: CONTAINED experience booking
   - Email + SMS + calendar invite

3. **Payment Reminders**:
   - The Harvest: Membership renewal
   - ACT Farm: Residency deposit due
   - Empathy Ledger: Organization subscription renewal

4. **Nurture Sequences**:
   - Post-inquiry: Educational content about project
   - Post-booking: Pre-arrival logistics
   - Post-experience: Follow-up, testimonial request, cross-project opportunities

### **Medium Priority** (Week 3-4)

5. **Abandoned Form Recovery**:
   - Empathy Ledger: Onboarding form abandonment (24hr reminder)
   - JusticeHub: Story submission abandonment

6. **Re-engagement Campaigns**:
   - The Harvest: Inactive volunteers (90 days)
   - ACT Farm: Residency alumni (6 months post)
   - Empathy Ledger: Inactive storytellers (90 days)

7. **Referral Workflows**:
   - Post-experience: "Know someone who would benefit?"
   - Advocate stage: Personalized referral links, tracking

### **Low Priority** (Month 2+)

8. **Seasonal Campaigns**:
   - The Harvest: Garden planting season volunteer drives
   - ACT Farm: Summer residency applications
   - JusticeHub: Annual report, year-in-review storytelling

9. **VIP Workflows**:
   - High-value donors ($1,000+)
   - Research partners (multi-year collaborations)
   - Major media features

---

## 🏷️ Master Tag Taxonomy

### **Project Tags**
- `the-harvest`
- `act-farm`
- `empathy-ledger`
- `justicehub`

### **Interest Tags**
- `interest:volunteering`
- `interest:membership`
- `interest:program` (therapeutic/youth/education)
- `interest:partnership`
- `interest:residency`
- `interest:workshop`
- `interest:junes-patch`
- `interest:accommodation`
- `interest:collaboration`
- `interest:storyteller`
- `interest:organization`
- `interest:research`
- `interest:family-support`
- `interest:service-provider`
- `interest:campaign`
- `interest:story-submission`

### **Priority Tags**
- `priority:high` (residency, June's Patch, partnerships, crisis inquiries)
- `priority:medium` (workshops, memberships)
- `priority:low` (general inquiries, future accommodation)

### **Status Tags**
- `status:active`
- `status:inactive`
- `status:alumni`
- `status:advocate`

### **Cross-Project Tags**
- `cross-project:act-farm-harvest` (relevant to both)
- `cross-project:empathy-justicehub` (storytelling overlap)

### **Special Tags**
- `healthcare` (June's Patch, therapeutic programs)
- `research` (academic partnerships)
- `cultural-protocol` (Indigenous storytellers needing community approval)
- `crisis` (urgent family support needs)
- `media` (press inquiries, story features)
- `vip` (major donors, partners, ambassadors)

---

## 📈 Success Metrics & Reporting

### **Weekly Team Dashboards**

**The Harvest**:
- New volunteer inquiries
- Orientation attendance rate
- Active volunteer count
- Membership renewals this week
- Program participant engagement

**ACT Farm**:
- Residency applications received
- Residency bookings this month
- Workshop registrations
- June's Patch waitlist length
- Average response time to inquiries

**Empathy Ledger**:
- New storyteller registrations
- Stories published this week
- Organization demos scheduled
- Revenue earned by storytellers
- Platform engagement (logins, uploads)

**JusticeHub**:
- Family inquiries (crisis vs. general)
- Service connections made
- CONTAINED bookings
- Stories submitted/published
- Campaign nominations

### **Monthly Leadership Dashboards**

- Total contacts across all projects
- Pipeline values (expected revenue)
- Conversion rates (inquiry → booking/membership)
- Cross-project referrals made
- Email open/click rates
- Automation workflow performance

### **Quarterly Impact Reports**

- Lives impacted (volunteers, program participants, families supported, storytellers empowered)
- Revenue generated (memberships, bookings, platform fees, donations)
- Conservation outcomes (residencies hosted, research outputs, hectares monitored)
- Stories shared (total story count, media features, policy influence)

---

## 🛠️ Implementation Recommendations

### **Phase 1: Foundation (Week 1-2)** ✅ IN PROGRESS
- [x] Create GHL sub-accounts (4)
- [x] Generate API tokens (4)
- [x] Build contact form integrations (The Harvest, ACT Farm complete)
- [ ] Build contact form integrations (Empathy Ledger, JusticeHub)
- [ ] Create core pipelines (12 total across 4 projects)
- [ ] Set up basic automations (auto-responses, reminders)

### **Phase 2: Calendars & Bookings (Week 3-4)**
- [ ] Integrate GHL calendars
- [ ] The Harvest: Workshop calendar
- [ ] ACT Farm: Residency multi-day booking, workshop calendar
- [ ] JusticeHub: CONTAINED 24-slot booking system
- [ ] Payment processing (Stripe integration)

### **Phase 3: Advanced Automations (Month 2)**
- [ ] Nurture sequences per persona (20+ workflows)
- [ ] Abandoned form recovery
- [ ] Re-engagement campaigns
- [ ] Cross-project referral workflows

### **Phase 4: Reporting & Optimization (Month 3+)**
- [ ] Custom dashboards
- [ ] A/B testing email sequences
- [ ] Lead scoring models
- [ ] Predictive pipeline analytics

---

## 🎓 Recommended: Custom Claude Skill

### **"GHL CRM Strategy Advisor" Skill**

**Purpose**: Ongoing support for building and optimizing GHL pipelines, workflows, and automations as ACT projects evolve.

**Capabilities**:
1. **Pipeline Design**: Generate stage sequences for new user journeys
2. **Workflow Scripting**: Draft email sequences, SMS templates, automation logic
3. **Tag Strategy**: Recommend tags for new initiatives
4. **Reporting Queries**: Answer "How many X are in Y pipeline stage?"
5. **Optimization**: Identify bottlenecks, suggest improvements
6. **Integration**: Connect new tools (payment, email, calendars)
7. **Training**: Generate team guides for using GHL pipelines

**Example Prompts**:
- "Create a pipeline for The Harvest CSA subscription management"
- "Write a 5-email nurture sequence for ACT Farm residency alumni"
- "What tags should I add for tracking JusticeHub media inquiries?"
- "Show me conversion rate from inquiry to booking for all projects"
- "How do I set up a cross-project referral from Empathy Ledger to JusticeHub?"

**Value**: Ensures GHL strategy stays aligned with evolving project needs, reduces learning curve, maintains consistency across all 4 projects.

**Implementation**: Create as a Claude Code skill with access to GHL documentation, ACT project context, and this strategy document.

---

## ✅ Next Steps

1. **Review this strategy** with ACT team/stakeholders
2. **Prioritize pipelines** (which to build first?)
3. **Approve automation workflows** (which emails/SMS to send?)
4. **Build GHL CRM Strategy Advisor skill** (if desired)
5. **Continue Week 1 implementation** (Empathy Ledger + JusticeHub contact forms)
6. **Create GHL sub-accounts and pipelines** (user action required)

---

**Document Status**: Draft for review
**Last Updated**: Now
**Next Review**: After Phase 1 completion
