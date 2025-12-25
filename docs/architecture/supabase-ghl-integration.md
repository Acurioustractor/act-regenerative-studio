# Supabase + GoHighLevel Integration Architecture
## Unified Communication & User Management Strategy

**Challenge**: We have two powerful but different systems:
- **Supabase**: Authentication, database, complex permissions (Empathy Ledger, JusticeHub)
- **GoHighLevel**: CRM, marketing automation, pipelines (All 4 projects)

**Goal**: Seamless user experience with no duplicate records, unified communications, and clear separation of concerns.

---

## 🎯 Strategic Architecture

### **Core Principle**: Right Tool for Right Job

**Supabase Handles**:
- ✅ Platform authentication (login/signup)
- ✅ Complex user permissions (roles, cultural protocols)
- ✅ Database-level access control (RLS policies)
- ✅ Real-time collaboration features
- ✅ User-generated content storage (stories, profiles)
- ✅ Business logic tied to data (approval workflows, consent management)

**GoHighLevel Handles**:
- ✅ Marketing contact management (leads, inquiries)
- ✅ Pipeline tracking (volunteer → active, inquiry → tenant)
- ✅ Marketing automation (email campaigns, SMS sequences)
- ✅ Transactional emails (confirmations, reminders, receipts)
- ✅ Booking/calendar management
- ✅ Revenue tracking (memberships, rentals, bookings)
- ✅ Team collaboration (pipeline assignments, tasks)

**Email System** (New Addition):
- ✅ **Resend** for all transactional emails (both Supabase and GHL trigger)
- ✅ Unified templates, branding, deliverability
- ✅ Single dashboard for all email analytics

---

## 📊 Per-Project Integration Strategy

### **EMPATHY LEDGER** - Supabase PRIMARY, GHL for Marketing

#### Current State
- ✅ Supabase Auth working (login, roles, permissions)
- ✅ Complex database with cultural protocols
- ❌ **No email system** (critical gap)
- ❌ No marketing automation
- ❌ No lead nurturing for organizations

#### Proposed Architecture

**User Registration Flow**:
```
1. User visits /onboarding
   ↓
2. Fills 3-step form (name, email, role, privacy)
   ↓
3. POST /api/onboarding/register-storyteller
   ↓
4. Creates Supabase user (with auth)
   ↓
5. Creates storyteller record in database
   ↓
6. SYNC TO GHL: Create/update contact with tags
   ↓
7. GHL triggers: Welcome email sequence (via Resend)
   ↓
8. User redirected to dashboard
```

**Dual Record Strategy**:
- **Supabase User**: `id` (UUID), `email`, `role`, permissions, profile data
- **GHL Contact**: `id` (GHL contact ID), `email`, tags (`empathy-ledger`, `storyteller`), pipeline stage
- **Sync Table** (new Supabase table): Links `supabase_user_id` ↔ `ghl_contact_id` by `email`

**Who Handles What**:
| Task | System | Why |
|------|--------|-----|
| Login/signup | Supabase | Complex roles, permissions, RLS |
| Story creation | Supabase | Content ownership, cultural protocols |
| Email: Welcome | GHL → Resend | Marketing automation |
| Email: Story approval needed | Supabase → Resend | Business logic trigger |
| Email: Revenue notification | Supabase → Resend | Payment event |
| **Organization Inquiries** | **GHL** | Lead nurturing pipeline |
| **Storyteller onboarding nurture** | **GHL** | Drip campaign (Day 1, 3, 7, 30) |

**Organization Lead Flow** (NEW):
```
1. Organization submits contact form
   ↓
2. GHL contact created with tags (`empathy-ledger`, `organization`, `interest:demo`)
   ↓
3. Added to "Organization Pipeline"
   ↓
4. GHL workflow triggered:
   - Day 1: Send organization info pack (via Resend)
   - Day 3: Book demo call (GHL calendar)
   - Day 7: Follow-up if no demo booked
   ↓
5. Demo completed → Move to "Proposal" stage
   ↓
6. Contract signed → Create Supabase organization record
   ↓
7. Link GHL contact_id to Supabase organization_id
```

#### Implementation Tasks
1. ✅ **Add Resend** to Empathy Ledger project
2. ✅ **Create email templates** (welcome, story submitted, approval needed, revenue notification)
3. ✅ **Add GHL contact form** for organization inquiries (`/contact` page - currently has TODO)
4. ✅ **Create sync table** in Supabase:
   ```sql
   CREATE TABLE ghl_contact_sync (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     supabase_user_id UUID REFERENCES auth.users(id),
     ghl_contact_id TEXT NOT NULL,
     email TEXT NOT NULL,
     last_synced TIMESTAMPTZ DEFAULT NOW(),
     sync_status TEXT DEFAULT 'synced', -- 'synced' | 'pending' | 'error'
     UNIQUE(email)
   );
   ```
5. ✅ **Add GHL sync to onboarding** (`/api/onboarding/register-storyteller/route.ts`):
   ```typescript
   // After creating Supabase user:
   const ghlContact = await ghlClient.contacts.upsert({
     email: data.email,
     name: data.full_name,
     tags: ['empathy-ledger', `role:${data.role}`],
     customFields: {
       storyteller_id: storytellerId,
       profile_visibility: data.privacy_preferences.profile_visibility,
     },
   });

   // Store sync mapping:
   await supabase.from('ghl_contact_sync').upsert({
     supabase_user_id: userId,
     ghl_contact_id: ghlContact.id,
     email: data.email,
   });

   // Trigger welcome email via GHL workflow:
   await ghlClient.workflows.trigger(process.env.GHL_STORYTELLER_WELCOME_WORKFLOW_ID, {
     contactId: ghlContact.id,
   });
   ```

---

### **JUSTICEHUB** - Supabase PRIMARY, GHL for Service Providers

#### Current State
- ✅ Supabase Auth working (login, profiles, stories)
- ⚠️ Auth0 configured but NOT USED (remove to reduce complexity)
- ❌ **No email system** (critical gap)
- ❌ No service provider onboarding automation
- ❌ No family support follow-up

#### Proposed Architecture

**User Types & Systems**:
| User Type | Auth | CRM | Why |
|-----------|------|-----|-----|
| **Story Submitters** | Supabase | GHL | Supabase for profile, GHL for nurture |
| **Service Providers** | None initially | GHL | GHL pipeline → Supabase after verification |
| **Families Seeking Support** | Optional | GHL | Can browse anonymously, GHL tracks inquiries |
| **Admins** | Supabase | N/A | Full platform access |

**Service Provider Onboarding Flow** (NEW):
```
1. Service provider submits application form
   ↓
2. GHL contact created with tags (`justicehub`, `service-provider`, `status:pending`)
   ↓
3. Added to "Service Provider Pipeline"
   ↓
4. GHL workflow:
   - Day 1: Application received confirmation (via Resend)
   - Day 1: Send verification requirements (WWCC, insurance, references)
   - Admin notified to review
   ↓
5. Admin verifies in GHL (moves to "Verified" stage)
   ↓
6. GHL webhook → Create Supabase service record
   ↓
7. Service goes live in directory
   ↓
8. GHL workflow: "You're now listed!" email + onboarding guide
```

**Story Submission Flow**:
```
1. User submits story (currently TODO implementation)
   ↓
2. Story saved to Supabase (stories table)
   ↓
3. SYNC TO GHL: Create/update contact
   ↓
4. GHL workflow: Confirmation email (via Resend)
   ↓
5. Story enters 48-hour review (Supabase)
   ↓
6. Approved → Supabase trigger → Resend "Story published!" email
   ↓
7. GHL: Move contact to "Active Storyteller" stage
```

**Family Support Flow** (Crisis-Sensitive):
```
1. Family submits inquiry form
   ↓
2. GHL contact created with tags (`justicehub`, `family-support`, `urgency:crisis`)
   ↓
3. **IMMEDIATE** auto-response (via Resend) with crisis resources
   ↓
4. Added to "Family Support Pipeline"
   ↓
5. Coordinator notified (Slack + email within minutes)
   ↓
6. GHL workflow:
   - Day 1: Personalized service recommendations
   - Day 7: Check-in call scheduled
   - Day 30: Follow-up survey
   - Day 90: Long-term support check-in
```

#### Implementation Tasks
1. ✅ **Remove Auth0** (not being used, adds complexity)
2. ✅ **Add Resend** to JusticeHub project
3. ✅ **Implement contact form** (`/app/contact/page.tsx` - currently TODO)
4. ✅ **Implement story submission API** (`/app/api/stories/route.ts` - currently TODO)
5. ✅ **Create service provider application form** (new page)
6. ✅ **Add GHL sync table** to Supabase
7. ✅ **Build GHL → Supabase webhook** for service provider verification

---

### **THE HARVEST** - GHL PRIMARY, Supabase Optional

#### Current State
- ✅ GHL integration complete (contact form, pipelines)
- ✅ No authentication (static site)
- ❌ No member portal
- ❌ No volunteer scheduling system
- ❌ No tenant dashboard

#### Proposed Architecture

**Phase 1: Pure GHL** (Current - Good for 6-12 months):
- All contacts in GHL
- Email automation via GHL → Resend
- Event bookings via GHL calendar
- Membership renewals via GHL + Stripe
- Tenant invoicing via GHL

**Phase 2: Add Supabase** (If needed later):
- **Members Portal**: Login to view membership status, renew, see events
- **Volunteer Portal**: Calendar, hours logged, badges/achievements
- **Tenant Portal**: Invoices, booking requests, resource sharing

**Decision Criteria for Phase 2**:
- More than 50 active members (need self-service)
- More than 20 regular volunteers (need scheduling coordination)
- More than 5 active tenants (need dashboard for invoices, bookings)

**If Phase 2 Needed**:
```
User registers for membership:
  → GHL contact created (primary record)
  → Payment processed (Stripe via GHL)
  → Supabase user created (for portal login)
  → Linked via sync table
  → User gets portal access (view-only initially)
```

#### Recommendation
**Stay with GHL-only for now**. Complexity of dual system not justified until significant user base.

---

### **ACT FARM** - GHL PRIMARY, Supabase Optional

#### Current State
- ✅ GHL integration complete (contact form, pipelines)
- ✅ No authentication (static site)
- ❌ No residency application portal
- ❌ No booking management system
- ❌ No alumni network

#### Proposed Architecture

**Phase 1: Pure GHL** (Current - Good for 1-2 years):
- Residency inquiries → GHL pipeline
- Booking management → GHL calendar + Stripe
- Workshop registrations → GHL events
- June's Patch referrals → GHL healthcare pipeline
- Alumni nurture → GHL email sequences

**Phase 2: Add Supabase** (If needed later):
- **Residency Portal**: Application submission, project documentation, resource booking
- **Alumni Network**: Directory, project showcase, collaboration tools
- **Workshop Portal**: Materials download, participant forums

**Decision Criteria for Phase 2**:
- More than 20 residencies/year (need application management)
- Alumni wanting ongoing collaboration (need network tools)
- Research outputs database (need structured storage)

#### Recommendation
**Stay with GHL-only for now**. Most residency management can be handled via email + GHL workflows.

---

## 📧 Unified Email Architecture: RESEND

### **Why Resend?**
- ✅ **React Email** integration (beautiful, tested templates)
- ✅ **Better deliverability** than self-hosted
- ✅ **Developer-friendly** API (simpler than SendGrid)
- ✅ **Affordable** ($20/month for 50k emails - plenty for all 4 projects)
- ✅ **Analytics** (open rates, click rates, bounces)
- ✅ **Domains**: Can send from @theharvestwitta.com.au, @acurioustractor.com, etc.

### **Email Trigger Matrix**

| Event | Triggered From | Sent Via | Template | Priority |
|-------|---------------|----------|----------|----------|
| **Empathy Ledger** |  |  |  |  |
| User registers | Supabase | Resend | `storyteller-welcome` | High |
| Story submitted | Supabase | Resend | `story-submitted` | Normal |
| Story approved | Supabase | Resend | `story-approved` | High |
| Elder approval needed | Supabase | Resend | `elder-review-needed` | High |
| Revenue earned | Supabase | Resend | `revenue-notification` | Normal |
| Organization inquiry | GHL | Resend | `org-inquiry-response` | High |
| **JusticeHub** |  |  |  |  |
| Story submitted | Supabase | Resend | `story-confirmation` | Normal |
| Story published | Supabase | Resend | `story-published` | High |
| Family inquiry | GHL | Resend | `family-support-immediate` | **URGENT** |
| Service provider applied | GHL | Resend | `provider-application-received` | Normal |
| Service verified | GHL | Resend | `provider-approved` | High |
| **The Harvest** |  |  |  |  |
| Contact inquiry | GHL | Resend | `contact-confirmation` | Normal |
| Tenant proposal | GHL | Resend | `tenant-proposal` | High |
| Membership renewal | GHL | Resend | `membership-renewal-reminder` | Normal |
| Event registration | GHL | Resend | `event-confirmation` | High |
| **ACT Farm** |  |  |  |  |
| Residency inquiry | GHL | Resend | `residency-inquiry-confirmation` | High |
| Residency approved | GHL | Resend | `residency-approved` | High |
| Booking confirmation | GHL | Resend | `booking-confirmation` | High |
| Pre-arrival logistics | GHL | Resend | `residency-pre-arrival` | High |
| June's Patch referral | GHL | Resend | `junes-patch-confirmation` | **URGENT** |

### **Resend Implementation**

**Install in all 4 projects**:
```bash
npm install resend react-email
```

**Shared Email Templates** (create in Dev Hub, copy to all projects):
```typescript
// /Users/benknight/Code/ACT Farm and Regenerative Innovation Studio/emails/contact-confirmation.tsx
import { Html, Head, Body, Container, Text, Button } from '@react-email/components';

export default function ContactConfirmation({ name, projectName, responseTime }) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: 'sans-serif', backgroundColor: '#f4f4f4' }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#fff', padding: '40px' }}>
          <Text style={{ fontSize: '24px', fontWeight: 'bold' }}>
            Thank you for contacting {projectName}!
          </Text>
          <Text style={{ fontSize: '16px', lineHeight: '1.6' }}>
            Hi {name},
          </Text>
          <Text style={{ fontSize: '16px', lineHeight: '1.6' }}>
            We've received your inquiry and will respond within {responseTime}.
          </Text>
          <Text style={{ fontSize: '16px', lineHeight: '1.6' }}>
            In the meantime, feel free to explore our website to learn more about our work.
          </Text>
          <Button
            href={`https://${projectName.toLowerCase().replace(' ', '')}.com.au`}
            style={{ backgroundColor: '#4CAF50', color: '#fff', padding: '12px 24px', borderRadius: '5px', textDecoration: 'none' }}
          >
            Explore {projectName}
          </Button>
        </Container>
      </Body>
    </Html>
  );
}
```

**Resend API Wrapper** (shared library):
```typescript
// /src/lib/email.ts
import { Resend } from 'resend';
import ContactConfirmation from '@/emails/contact-confirmation';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactConfirmation(to: string, name: string, projectName: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: `${projectName} <hello@${getProjectDomain(projectName)}>`,
      to: [to],
      subject: `Thank you for contacting ${projectName}`,
      react: ContactConfirmation({ name, projectName, responseTime: '3-5 business days' }),
    });

    if (error) {
      console.error('Resend error:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Email send failed:', error);
    throw error;
  }
}

function getProjectDomain(projectName: string): string {
  const domains = {
    'The Harvest': 'theharvestwitta.com.au',
    'ACT Farm': 'acurioustractor.com',
    'Empathy Ledger': 'empathyledger.com',
    'JusticeHub': 'justicehub.com.au',
  };
  return domains[projectName] || 'acurioustractor.com';
}
```

**GHL Workflow Integration**:
```typescript
// In GHL workflow webhook handler:
// POST /api/webhooks/ghl

export async function POST(request: Request) {
  const event = await request.json();

  if (event.type === 'contact.created' && event.tags.includes('the-harvest')) {
    // Send welcome email via Resend
    await sendContactConfirmation(
      event.contact.email,
      event.contact.name,
      'The Harvest'
    );
  }

  return Response.json({ received: true });
}
```

---

## 🔄 Sync Strategy: Email as Primary Key

### **Golden Rule**: Email is ALWAYS the reconciliation key

**Sync Table Structure** (add to both Empathy Ledger and JusticeHub Supabase):
```sql
CREATE TABLE ghl_contact_sync (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supabase_user_id UUID REFERENCES auth.users(id),
  ghl_contact_id TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  project TEXT NOT NULL, -- 'empathy-ledger' | 'justicehub'
  last_synced TIMESTAMPTZ DEFAULT NOW(),
  sync_status TEXT DEFAULT 'synced', -- 'synced' | 'pending' | 'error'
  sync_direction TEXT, -- 'supabase_to_ghl' | 'ghl_to_supabase' | 'bidirectional'
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ghl_sync_email ON ghl_contact_sync(email);
CREATE INDEX idx_ghl_sync_supabase_user ON ghl_contact_sync(supabase_user_id);
CREATE INDEX idx_ghl_sync_ghl_contact ON ghl_contact_sync(ghl_contact_id);
```

### **Sync Scenarios**

**Scenario 1: User registers on platform first**
```typescript
// /api/auth/register (Empathy Ledger or JusticeHub)
async function registerUser(email, name, role) {
  // 1. Create Supabase user
  const { data: user } = await supabase.auth.signUp({ email, password });

  // 2. Check if GHL contact exists
  const ghlContact = await ghlClient.contacts.searchByEmail(email);

  if (ghlContact) {
    // Contact exists in GHL - link records
    await supabase.from('ghl_contact_sync').insert({
      supabase_user_id: user.id,
      ghl_contact_id: ghlContact.id,
      email,
      sync_direction: 'bidirectional',
    });

    // Update GHL with Supabase user ID
    await ghlClient.contacts.updateCustomFields(ghlContact.id, {
      supabase_user_id: user.id,
      platform_registered: true,
    });
  } else {
    // No GHL contact - create one
    const newGhlContact = await ghlClient.contacts.upsert({
      email,
      name,
      tags: ['empathy-ledger', `role:${role}`],
      customFields: {
        supabase_user_id: user.id,
        platform_registered: true,
        registration_source: 'platform',
      },
    });

    await supabase.from('ghl_contact_sync').insert({
      supabase_user_id: user.id,
      ghl_contact_id: newGhlContact.id,
      email,
      sync_direction: 'supabase_to_ghl',
    });
  }

  return user;
}
```

**Scenario 2: Contact submits form first, registers later**
```typescript
// /api/contact (contact form submission)
async function handleContactForm(email, name, interest) {
  // 1. Create GHL contact
  const ghlContact = await ghlClient.contacts.upsert({
    email,
    name,
    tags: ['empathy-ledger', `interest:${interest}`],
  });

  // 2. Check if Supabase user exists
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single();

  if (existingUser) {
    // User already registered - link records
    await supabase.from('ghl_contact_sync').upsert({
      supabase_user_id: existingUser.id,
      ghl_contact_id: ghlContact.id,
      email,
      sync_direction: 'ghl_to_supabase',
    });
  }
  // If no Supabase user, that's fine - will link when they register

  return ghlContact;
}
```

**Scenario 3: Bidirectional updates**
```typescript
// Supabase trigger (after user updates profile)
CREATE OR REPLACE FUNCTION sync_to_ghl()
RETURNS TRIGGER AS $$
BEGIN
  -- Call edge function to update GHL
  PERFORM net.http_post(
    url := 'https://your-project.vercel.app/api/sync/supabase-to-ghl',
    body := json_build_object(
      'user_id', NEW.id,
      'email', NEW.email,
      'updates', json_build_object(
        'name', NEW.full_name,
        'bio', NEW.bio
      )
    )::text
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_updated_sync_to_ghl
  AFTER UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION sync_to_ghl();
```

```typescript
// GHL webhook (when contact is updated in GHL)
// POST /api/webhooks/ghl

export async function POST(request: Request) {
  const event = await request.json();

  if (event.type === 'contact.updated') {
    // Look up sync record
    const { data: sync } = await supabase
      .from('ghl_contact_sync')
      .select('supabase_user_id')
      .eq('ghl_contact_id', event.contact.id)
      .single();

    if (sync) {
      // Update Supabase user
      await supabase
        .from('users')
        .update({
          name: event.contact.name,
          // other fields...
        })
        .eq('id', sync.supabase_user_id);

      // Update sync timestamp
      await supabase
        .from('ghl_contact_sync')
        .update({ last_synced: new Date().toISOString() })
        .eq('ghl_contact_id', event.contact.id);
    }
  }

  return Response.json({ received: true });
}
```

---

## 🚀 Implementation Roadmap

### **Phase 1: Add Email System** (Week 1-2)
1. ✅ **Install Resend** in all 4 projects
2. ✅ **Create shared email templates** (10-15 core templates)
3. ✅ **Implement email sending wrapper** (`/src/lib/email.ts`)
4. ✅ **Add Resend to existing GHL workflows**
5. ✅ **Test all transactional emails**

### **Phase 2: Complete Contact Forms** (Week 2-3)
1. ✅ **Empathy Ledger**: Implement `/contact` page + organization inquiry pipeline
2. ✅ **JusticeHub**: Implement contact form, story submission API
3. ✅ **Both**: Add GHL integration to existing Supabase flows

### **Phase 3: Build Sync System** (Week 3-4)
1. ✅ **Create sync tables** in Empathy Ledger + JusticeHub Supabase
2. ✅ **Add sync logic** to user registration flows
3. ✅ **Build GHL webhook handlers** for bidirectional updates
4. ✅ **Test sync scenarios** (register first, form first, updates)

### **Phase 4: GHL CRM Advisor Skill** (Week 4-5)
1. ✅ **Build skill** with full context of Supabase + GHL architecture
2. ✅ **Test skill** on common queries (pipeline generation, email sequences)
3. ✅ **Use skill** to accelerate remaining implementations

### **Phase 5: Optimization** (Month 2+)
1. Monitor sync errors, fix edge cases
2. A/B test email templates, improve open rates
3. Build analytics dashboards (Supabase + GHL data combined)
4. Automate more workflows based on usage patterns

---

## 📊 Success Metrics

**Email Performance**:
- Delivery rate (target: >98%)
- Open rate (target: >25% for transactional, >15% for marketing)
- Click rate (target: >5%)
- Unsubscribe rate (target: <0.5%)

**Sync Reliability**:
- Sync success rate (target: >99%)
- Duplicate record rate (target: <1%)
- Sync latency (target: <5 seconds)

**User Experience**:
- Contact form to confirmation email (target: <1 minute)
- Registration to welcome email (target: <2 minutes)
- Platform login success rate (target: >95%)

---

## ✅ Decision Matrix: When to Use What

| Question | Answer | Why |
|----------|--------|-----|
| User needs to login to platform? | **Supabase** | Authentication, permissions, session management |
| User just submitting inquiry? | **GHL** | Lead capture, marketing automation |
| Complex role-based access? | **Supabase** | RLS policies, granular permissions |
| Marketing email campaign? | **GHL → Resend** | Automation, segmentation, analytics |
| Transactional email (receipt, confirmation)? | **Resend** | Deliverability, templates, speed |
| Business logic tied to database? | **Supabase** | Triggers, functions, data integrity |
| Pipeline tracking (inquiry → customer)? | **GHL** | Visual pipeline, team collaboration |
| Content ownership/privacy controls? | **Supabase** | Database-level security, consent management |
| Calendar/booking management? | **GHL** | Built-in calendar, availability checking |
| Real-time collaboration? | **Supabase** | Real-time subscriptions, WebSockets |

---

**This architecture gives you the best of both worlds: Supabase's power for complex platforms + GHL's automation for marketing, all unified with Resend for reliable email delivery.**
