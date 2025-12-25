# GoHighLevel Cross-Account Contact Strategy

## Critical Finding: Contacts Are NOT Automatically Synced Across Sub-Accounts

**Answer to your question**: Yes, people living across multiple projects **IS a limitation** in GoHighLevel's default setup. Contacts are **isolated per sub-account** - there is NO automatic cross-account syncing.

This means:
- Someone who volunteers at The Harvest will be a separate contact record in that sub-account
- If they book a residency at ACT Farm, they'll be a NEW contact in the ACT Farm sub-account
- If they submit a story to Empathy Ledger, they'll be a THIRD contact record
- If they use JusticeHub services, they'll be a FOURTH contact record

**You will have 4+ duplicate contact records for the same person across different sub-accounts.**

---

## Why This Happens

GoHighLevel's architecture is **LocationID-centric**, not **CompanyID-centric**. Each sub-account (Location) has its own:
- Contact database
- Pipelines
- Workflows
- Email/SMS history
- Custom fields
- Tags

The Agency level has NO CRM features - it cannot see or manage contacts across all sub-accounts in a unified way.

---

## Available Solutions

### Solution 1: **Workflow-Based Contact Copying** (Manual Setup Required)

GoHighLevel provides a "Copy Contact to Sub-Account" workflow action that allows you to duplicate contacts between sub-accounts.

**How It Works**:
1. When a contact is created in Sub-Account A (e.g., The Harvest)
2. A workflow triggers
3. Contact is automatically copied to Sub-Account B (e.g., ACT Hub master database)
4. Workflow can copy tags, custom fields, and update existing contacts

**Limitations**:
- ❌ NOT bidirectional by default (requires separate workflows for each direction)
- ❌ Premium feature - costs $0.01 per execution after 100 free uses/month
- ❌ No automatic merge - if contact already exists, it updates but doesn't merge histories
- ❌ Each sub-account's activity history remains separate
- ❌ Must configure workflows for every possible sync combination (6 sub-accounts = complex web)

**Cost Impact**:
- If you have 100 new contacts/month across 6 sub-accounts
- Each contact copied to 1 master sub-account = 600 workflow executions/month
- After 100 free: 500 × $0.01 = **$5/month** (not huge, but adds up)

**Reference**: [Workflow Action - Copy Contact To Sub Account](https://help.gohighlevel.com/support/solutions/articles/155000003272-workflow-action-copy-contact-to-sub-account)

---

### Solution 2: **API-Based Contact Reconciliation** (Custom Development)

Build custom integration using GHL API to sync contacts across sub-accounts.

**Architecture**:
```
Contact created in any sub-account
  ↓
Webhook fires to your custom API endpoint
  ↓
Your API checks if contact exists in other sub-accounts (by email/phone)
  ↓
If exists: Update all matching records
If new: Create in master sub-account + tag with source
  ↓
Sync custom field "sub_accounts" = ["harvest", "farm", "ledger"]
```

**Implementation**:
- Use Next.js API routes in your existing infrastructure
- Store master contact mapping in Redis (NAS: redis://192.168.0.34:6379)
- Use GHL webhooks + Private Integration Tokens for each sub-account
- Bidirectional sync triggered by contact create/update events

**Advantages**:
- ✅ Fully automated
- ✅ Bidirectional sync
- ✅ Can maintain unified contact record in master sub-account (ACT Hub)
- ✅ Track which sub-accounts each person has interacted with
- ✅ No per-execution costs (just API rate limits)

**Disadvantages**:
- ❌ Requires development effort (estimated 10-15 hours)
- ❌ Must maintain webhook infrastructure
- ❌ GHL API rate limits: 100 requests/10 seconds, 200k/day per app
- ❌ Each sub-account's pipeline/workflow history still separate

**Cost**: $0/month (uses existing infrastructure + your development time)

**Reference**: [HighLevel API Documentation](https://help.gohighlevel.com/support/solutions/articles/48001060529-highlevel-api)

---

### Solution 3: **Master Sub-Account Pattern** (Recommended Hybrid)

Use ONE sub-account as the "master" contact database + sync contacts there.

**Setup**:
```
A Curious Tractor (Agency) ← Admin only
├── ACT Hub (Sub-Account) ← MASTER CONTACT DATABASE
├── The Harvest (Sub-Account) ← Operational CRM + workflows
├── ACT Farm (Sub-Account) ← Operational CRM + workflows
├── Empathy Ledger (Sub-Account) ← Operational CRM + workflows
├── JusticeHub (Sub-Account) ← Operational CRM + workflows
└── Goods on Country (Sub-Account) ← Operational CRM + workflows
```

**How It Works**:
1. Every contact created in any operational sub-account is automatically copied to ACT Hub (using workflow action)
2. ACT Hub becomes the "source of truth" for unified contact records
3. Add custom field in ACT Hub: `active_projects` (multi-select: Harvest, Farm, Ledger, JusticeHub, Goods)
4. When contact is copied, tag them with source project
5. Update `active_projects` field to track which projects they're involved with

**Workflow Example** (The Harvest):
```
Trigger: Contact Created
Condition: Contact has email
Action 1: Copy Contact to Sub-Account (ACT Hub)
Action 2 (in ACT Hub): Add tag "harvest-member"
Action 3 (in ACT Hub): Update custom field "active_projects" → add "The Harvest"
```

**Advantages**:
- ✅ Single source of truth in ACT Hub
- ✅ Can see all contacts across ecosystem in one place
- ✅ Track which projects each person is involved with
- ✅ Easier to manage agency-wide communications (newsletters, announcements)
- ✅ Simpler than full API sync (uses built-in workflow action)

**Disadvantages**:
- ❌ Still costs $0.01/execution after 100 free
- ❌ Contact histories remain separate in each operational sub-account
- ❌ Must manually check ACT Hub to see unified view
- ❌ NOT bidirectional (updates in project sub-accounts don't sync back to ACT Hub by default)

**Cost**: ~$5-10/month for workflow executions (depends on contact volume)

**Reference**: [Copy Contact Workflow Action Guide](https://rayodaniel.com/gohighlevel-copy-contact-workflow-action/)

---

### Solution 4: **Third-Party Integration Platform** (Zapier/Make)

Use Zapier or Make.com to sync contacts across sub-accounts.

**How It Works**:
1. Each GHL sub-account has webhook that fires to Zapier when contact created/updated
2. Zapier checks if contact exists in other sub-accounts
3. Zapier creates/updates contact in all relevant sub-accounts
4. Can add logic to update custom fields, merge tags, etc.

**Advantages**:
- ✅ No custom development required
- ✅ Visual workflow builder (easier to maintain)
- ✅ Can sync to external tools (Google Sheets, Airtable, etc.)
- ✅ Bidirectional sync possible

**Disadvantages**:
- ❌ Additional monthly cost (Zapier: $29.99+/month, Make: $10.59+/month)
- ❌ Limited by Zapier/Make task limits
- ❌ Another platform to manage
- ❌ Slower than native GHL workflows (external API calls)

**Cost**: $30-60/month for platform subscription

---

## Recommended Approach for ACT Ecosystem

### **Phase 1: Master Sub-Account Pattern** (Immediate - Week 1)

**Setup**:
1. Create "ACT Hub" as first sub-account (master contact database)
2. Create other 5 operational sub-accounts (Harvest, Farm, Ledger, JusticeHub, Goods)
3. In each operational sub-account, create workflow:
   ```
   Trigger: Contact Created OR Contact Updated
   Condition: Email is not empty
   Action: Copy Contact to Sub-Account (ACT Hub)
   ```
4. In ACT Hub, create custom fields:
   - `active_projects` (multi-select): The Harvest, ACT Farm, Empathy Ledger, JusticeHub, Goods on Country
   - `primary_project` (dropdown): Same options
   - `total_interactions` (number): Count of touchpoints across all projects
   - `last_interaction_date` (date): Most recent activity across all projects
   - `last_interaction_project` (text): Which project they last engaged with

**Result**: You'll have a unified contact view in ACT Hub showing everyone across the ecosystem.

---

### **Phase 2: Custom API Sync** (Month 2-3 - After Initial Launch)

Once sites are live and you're getting real traffic, build custom API sync:

**Implementation**:
1. Create webhook endpoint in your Dev Hub: `/api/webhooks/ghl/contact-sync`
2. Configure webhook in ALL 6 sub-accounts to fire on contact create/update
3. Endpoint logic:
   ```typescript
   // Receive webhook from Sub-Account A
   const contact = webhook.payload.contact;
   const sourceLocation = webhook.payload.location.id;

   // Check Redis cache for master contact ID
   const masterKey = `contact:${contact.email}`;
   let masterContact = await redis.get(masterKey);

   if (!masterContact) {
     // First time seeing this contact - create in ACT Hub
     masterContact = await ghlAPI.createContact('ACT_HUB_LOCATION_ID', {
       email: contact.email,
       name: contact.name,
       phone: contact.phone,
       customFields: {
         active_projects: [getProjectName(sourceLocation)],
         primary_project: getProjectName(sourceLocation),
         total_interactions: 1,
         last_interaction_date: new Date(),
         last_interaction_project: getProjectName(sourceLocation),
       },
       tags: [getProjectName(sourceLocation)],
     });

     // Cache master contact
     await redis.set(masterKey, JSON.stringify(masterContact), 'EX', 86400); // 24hr TTL
   } else {
     // Contact exists - update active_projects
     const projects = masterContact.customFields.active_projects || [];
     if (!projects.includes(getProjectName(sourceLocation))) {
       projects.push(getProjectName(sourceLocation));
     }

     await ghlAPI.updateContact(masterContact.id, {
       customFields: {
         active_projects: projects,
         total_interactions: (masterContact.customFields.total_interactions || 0) + 1,
         last_interaction_date: new Date(),
         last_interaction_project: getProjectName(sourceLocation),
       },
       tags: [...new Set([...masterContact.tags, getProjectName(sourceLocation)])],
     });

     // Update cache
     await redis.set(masterKey, JSON.stringify(masterContact), 'EX', 86400);
   }
   ```

**Result**: Fully automated, bidirectional contact syncing with unified view in ACT Hub.

---

## What You'll See in Practice

### Example: Jane Smith's Journey

**Week 1**: Jane signs up for The Harvest newsletter
- ✅ Contact created in **The Harvest** sub-account
- ✅ Workflow copies to **ACT Hub** sub-account
- ✅ ACT Hub shows: `active_projects: ["The Harvest"]`

**Week 3**: Jane books ACT Farm residency
- ✅ Contact created in **ACT Farm** sub-account
- ✅ Workflow copies to **ACT Hub** sub-account
- ✅ ACT Hub updates: `active_projects: ["The Harvest", "ACT Farm"]`
- ❌ ACT Farm has NO IDEA Jane is already in The Harvest (unless you build custom API)

**Week 5**: Jane submits story to Empathy Ledger
- ✅ Contact created in **Empathy Ledger** sub-account
- ✅ Workflow copies to **ACT Hub** sub-account
- ✅ ACT Hub updates: `active_projects: ["The Harvest", "ACT Farm", "Empathy Ledger"]`
- ❌ Empathy Ledger has NO IDEA Jane is in other projects

**In ACT Hub Master Database**:
```
Contact: Jane Smith
Email: jane@example.com
Phone: 0412 345 678
Tags: harvest-member, farm-guest, storyteller
Active Projects: The Harvest, ACT Farm, Empathy Ledger
Primary Project: The Harvest (first touchpoint)
Total Interactions: 3
Last Interaction: 2025-01-15 (Empathy Ledger story submission)
```

**In Each Operational Sub-Account**:
- The Harvest: Jane exists, can see her newsletter signups, volunteer history
- ACT Farm: Jane exists, can see her residency booking, payments
- Empathy Ledger: Jane exists, can see her story submissions
- ❌ NONE of these sub-accounts know about her activities in the others

---

## Key Limitations to Accept

1. **No True Unified CRM**: GHL is fundamentally designed for single-location businesses or agencies managing separate clients - NOT multi-brand ecosystems with shared audiences

2. **Activity Histories Remain Separate**: Even with contact syncing, you cannot see The Harvest email opens inside the ACT Farm sub-account

3. **Pipeline Stages Are Isolated**: Jane's pipeline stage in The Harvest (e.g., "Active Volunteer") is completely separate from her ACT Farm pipeline stage (e.g., "Past Guest")

4. **Email/SMS History Fragmented**: Jane's email conversation history is split across sub-accounts

5. **Reporting Challenges**: GHL's built-in reporting shows per-sub-account metrics only - you cannot easily generate "Total contacts across entire ecosystem" report without custom dashboard

---

## Workarounds for Limitations

### Unified Reporting Dashboard
Build custom dashboard in your Dev Hub that queries all sub-accounts via API:
- Total unique contacts across ecosystem
- Contact overlap (people in multiple projects)
- Most engaged contacts (high `total_interactions`)
- Project affinity analysis

### ACT Hub as "Command Center"
Use ACT Hub sub-account to:
- Send ecosystem-wide newsletters (all contacts are there)
- Manage major announcements
- Track VIP/high-engagement community members
- Run reports on cross-project engagement

### Custom Fields in Operational Sub-Accounts
Add custom field in EACH operational sub-account:
- `also_in_projects` (text): Manually or via API, track which other projects they're in
- When viewing Jane in The Harvest, you can see "Also in: ACT Farm, Empathy Ledger"

---

## Community Feature Requests

The GHL community has been requesting better multi-location contact management:

1. **"Automatically add new users from all sub-accounts to the agency's sub-account"** - Feature request on GHL Ideas board
   - Status: Under consideration
   - Would solve this exact problem
   - Reference: [GHL Ideas Board](https://ideas.gohighlevel.com/contacts/p/automatically-add-new-users-from-all-sub-accounts-to-the-agencys-sub-account)

2. **"Centralised support for multi-location businesses"** - Feature request
   - Status: In review
   - Would allow unified contact view across locations
   - Reference: [Multi-Location Support Request](https://ideas.gohighlevel.com/crm/p/centralised-support-for-multi-location-businesses)

3. **Design Flaw Acknowledgment**: Users report LocationID-centric design is limiting for companies with multiple brands/locations serving overlapping audiences

---

## Bottom Line Recommendation

### ✅ **Proceed with GHL using Master Sub-Account Pattern**

**Why**:
- GHL is still the best all-in-one CRM for your budget ($297/month vs $500+ for alternatives)
- Contact syncing IS possible with workflows or custom API (just not automatic)
- Benefits (unified email, booking, pipelines, automation) outweigh the contact sync limitation
- You can build custom API sync in Phase 2 if workflow costs become significant

### 🚧 **Accept These Realities**:
- You'll need ONE master sub-account (ACT Hub) to see unified contacts
- Operational sub-accounts will have isolated contact views (this is OK for day-to-day work)
- Plan for ~$5-10/month in workflow execution costs for contact copying
- Budget 10-15 hours development time for custom API sync if you want bidirectional updates

### 📊 **Alternative if This is a Deal-Breaker**:
If truly unified CRM across all projects is critical, consider:
- **HubSpot** (Free tier + paid features): Native multi-pipeline support, unified contacts, but $$$
- **Zoho CRM** + Zoho Campaigns: Better multi-brand support, but lacks GHL's all-in-one nature
- **Custom Build**: Supabase + Postgres + custom forms, but massive development effort

**My Opinion**: The contact sync limitation is annoying but NOT a deal-breaker. The Master Sub-Account pattern + eventual custom API sync will work well for your needs.

---

## Next Steps

1. **Confirm you're OK with Master Sub-Account approach** (ACT Hub as unified contact database)
2. **Proceed with creating 6 sub-accounts** (ACT Hub + 5 operational)
3. **Set up LC Email for all 6 domains**
4. **Configure contact copy workflows** (each operational → ACT Hub)
5. **Launch Phase 1 integrations** (forms, booking, pipelines)
6. **Monitor contact sync workflow costs** (first 100 executions/month are free)
7. **Month 2-3: Build custom API sync** if workflow costs become significant or you want bidirectional updates

---

## Questions?

Key questions to clarify:
1. Are you comfortable with ACT Hub being the "master" sub-account for unified contacts?
2. Are you OK with ~$5-10/month in workflow execution costs (after 100 free)?
3. Do you want to prioritize custom API sync (10-15 hours dev work) or use built-in workflows for now?
4. Should we track anything beyond `active_projects` in the master contact records?

---

## Sources

- [How to copy contacts from one sub-account to another sub-account](https://help.gohighlevel.com/support/solutions/articles/155000001034-how-to-copy-contacts-from-one-sub-account-to-another-sub-account-)
- [Workflow Action - Copy Contact To Sub Account](https://help.gohighlevel.com/support/solutions/articles/155000003272-workflow-action-copy-contact-to-sub-account)
- [Unified Contacts Workspace in Mobile App](https://help.gohighlevel.com/support/solutions/articles/155000005843-unified-contacts-workspace-in-mobile-app)
- [How to Merge Duplicate Contacts in HighLevel](https://help.gohighlevel.com/support/solutions/articles/48001202210-how-to-merge-duplicate-contacts-in-highlevel)
- [GoHighLevel Webhooks – 2025 Guide](https://supplygem.com/gohighlevel-webhooks/)
- [HighLevel API Documentation](https://help.gohighlevel.com/support/solutions/articles/48001060529-highlevel-api)
- [Centralised support for multi-location businesses](https://ideas.gohighlevel.com/crm/p/centralised-support-for-multi-location-businesses)
- [Automatically add new users from all sub-accounts to agency's sub-account](https://ideas.gohighlevel.com/contacts/p/automatically-add-new-users-from-all-sub-accounts-to-the-agencys-sub-account)
- [Boost Your Productivity: Using GoHighLevel Copy Contact Workflow Action](https://rayodaniel.com/gohighlevel-copy-contact-workflow-action/)
