# ACT People Intelligence Architecture

**Purpose**: Layer an advanced people intelligence system on top of GHL CRM using existing ACT Placemat database + Exa.ai enrichment

**Status**: Design Document
**Created**: December 24, 2025

---

## Executive Summary

You have **3 powerful systems** that should work together:

### 1. **ACT Placemat People DB** (15,000+ people)
*Location*: `/Users/benknight/Code/ACT Placemat`

**Purpose**: Intelligence layer - deep community analysis
- 8-dimensional contact scoring system
- Full interaction history
- AI-powered enrichment
- Campaign management
- Social graph analysis

### 2. **GHL Contact Sync** (NEW - just built)
*Location*: `/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio`

**Purpose**: Operational CRM - day-to-day marketing
- Unified contacts across 6 projects
- Email campaigns & LC Email
- Booking/scheduling
- Pipeline automation
- Webhook-based real-time sync

### 3. **Exa.ai Enrichment** (NEW - to build)

**Purpose**: Deep people research & discovery
- LinkedIn profile enrichment
- Company/organization research
- News mentions & media presence
- Social media activity
- Network mapping

---

## Recommended Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                  ACT PEOPLE INTELLIGENCE LAYER                       │
│                  (Supabase @ ACT Placemat)                           │
│                                                                       │
│  15,000+ enriched profiles with:                                     │
│  ✅ 8-dimensional scoring (influence, accessibility, alignment, etc.)│
│  ✅ Full interaction history                                         │
│  ✅ Campaign tracking                                                │
│  ✅ Social graph relationships                                       │
│  ✅ AI research logs                                                 │
│                                                                       │
│  NEW: Exa.ai enrichment pipeline                                     │
│  ✅ Automated LinkedIn deep-dive                                     │
│  ✅ Organization intelligence                                        │
│  ✅ News & media monitoring                                          │
│  ✅ Network discovery (find similar people)                          │
└──────────────────────────────────────────────────────────────────────┘
                                ↕
                    Bidirectional Sync (NEW)
                    (Supabase Edge Functions)
                                ↕
┌──────────────────────────────────────────────────────────────────────┐
│                  GHL OPERATIONAL CRM LAYER                           │
│              (Supabase @ Innovation Studio)                          │
│                                                                       │
│  Unified contacts across 6 ACT projects:                             │
│  ✅ Real-time webhook sync                                           │
│  ✅ Email campaigns (LC Email)                                       │
│  ✅ Booking/scheduling calendars                                     │
│  ✅ Marketing automation & workflows                                 │
│  ✅ Pipeline management                                              │
│                                                                       │
│  6 GHL Sub-Accounts:                                                 │
│  - ACT Hub (master) + Harvest + Farm + Ledger + JusticeHub + Goods  │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Why Keep Them Separate?

### ACT Placemat People DB = **Intelligence & Strategy**

**Use Cases**:
- Deep research on high-value contacts
- Campaign planning & targeting
- Relationship mapping
- Influence analysis
- Long-term community building

**Characteristics**:
- 15,000+ people (includes prospects, not just active contacts)
- Rich metadata (8+ scoring dimensions)
- Historical interaction tracking
- AI enrichment logs
- Slow-changing data (research-driven updates)

**Who Uses It**:
- Ben (strategy, research)
- Campaign managers
- Community organizers
- Researchers

### GHL CRM = **Operations & Execution**

**Use Cases**:
- Email newsletters & campaigns
- Event registration & booking
- Lead nurturing workflows
- Customer service
- Day-to-day contact management

**Characteristics**:
- Active contacts only (people who've engaged)
- Real-time updates (form submissions, bookings)
- Marketing automation
- Fast-changing data (email opens, clicks, bookings)

**Who Uses It**:
- Project managers (Harvest, Farm, Ledger, JusticeHub, Goods)
- Marketing team
- Customer service
- Event coordinators

---

## The Integration Strategy

### Sync Flow: Intelligence → Operations

```
ACT Placemat People DB
  ↓
Identify "hot leads" (high engagement_priority + campaign assignment)
  ↓
Sync to GHL as new contacts
  ↓
GHL workflows nurture + automate
  ↓
Contact engages (form submit, booking, email reply)
  ↓
GHL webhook fires
  ↓
Sync back to Placemat People DB (update interaction history)
```

### Sync Flow: Operations → Intelligence

```
GHL Contact created (website form submission)
  ↓
Webhook to Innovation Studio Supabase
  ↓
Check if person exists in Placemat People DB (by email)
  ↓
If NEW: Create basic record + trigger Exa.ai enrichment
If EXISTS: Update engagement tier + log interaction
  ↓
Exa.ai enriches: LinkedIn, company, news mentions
  ↓
Update Placemat intelligence scores
```

---

## Exa.ai Integration Design

### What is Exa.ai?

**Exa.ai** is a neural search engine that finds and enriches people data:
- **People Search**: Find people by company, role, location, interests
- **Profile Enrichment**: Deep LinkedIn-style profiles with work history, education, skills
- **Company Intelligence**: Organization size, funding, news, leadership
- **News & Media**: Recent mentions, articles, interviews
- **Network Discovery**: Find similar people or connections

**Pricing**:
- Free tier: 1,000 requests/month
- Growth: $50/month for 10,000 requests
- Pro: $200/month for 50,000 requests

**Use Case for ACT**:
- Enrich 15,000 existing contacts
- Auto-enrich new contacts added to GHL
- Discover new contacts similar to high-value people
- Monitor news mentions of key contacts

### Exa.ai Enrichment Pipeline Architecture

```typescript
// File: /Users/benknight/Code/ACT Placemat/src/services/exa-enrichment.ts

import Exa from 'exa-js';

interface ExaEnrichmentRequest {
  person_id: string;
  full_name: string;
  email?: string;
  linkedin_url?: string;
  current_company?: string;
}

interface ExaEnrichmentResult {
  linkedin_profile: {
    headline: string;
    summary: string;
    experience: Array<{
      company: string;
      title: string;
      duration: string;
      description: string;
    }>;
    education: Array<{
      school: string;
      degree: string;
      field: string;
    }>;
    skills: string[];
  };
  company_intel: {
    name: string;
    industry: string;
    size: string;
    location: string;
    description: string;
    recent_news: string[];
  };
  media_mentions: Array<{
    title: string;
    url: string;
    published_date: string;
    excerpt: string;
  }>;
  social_presence: {
    twitter_handle?: string;
    website?: string;
  };
  enrichment_confidence: number; // 0-1
}

class ExaEnrichmentService {
  private exa: Exa;

  constructor(apiKey: string) {
    this.exa = new Exa(apiKey);
  }

  /**
   * Enrich a person using Exa.ai
   */
  async enrichPerson(request: ExaEnrichmentRequest): Promise<ExaEnrichmentResult> {
    // 1. Build search query
    const query = this.buildSearchQuery(request);

    // 2. Search for person using Exa
    const searchResults = await this.exa.searchAndContents(query, {
      type: 'neural',
      useAutoprompt: true,
      numResults: 10,
      contents: {
        text: true,
        highlights: true,
      },
    });

    // 3. Extract LinkedIn profile
    const linkedinData = await this.extractLinkedInProfile(searchResults, request);

    // 4. Get company intelligence
    const companyData = await this.getCompanyIntelligence(request.current_company);

    // 5. Find media mentions
    const mediaMentions = await this.findMediaMentions(request.full_name, request.current_company);

    // 6. Combine and return
    return {
      linkedin_profile: linkedinData,
      company_intel: companyData,
      media_mentions: mediaMentions,
      social_presence: this.extractSocialPresence(searchResults),
      enrichment_confidence: this.calculateConfidence(linkedinData, companyData, mediaMentions),
    };
  }

  /**
   * Find similar people (network discovery)
   */
  async findSimilarPeople(person: ExaEnrichmentRequest, limit = 10): Promise<string[]> {
    const query = `People similar to ${person.full_name} who work in ${person.current_company} or related organizations`;

    const results = await this.exa.searchAndContents(query, {
      type: 'neural',
      useAutoprompt: true,
      numResults: limit,
      category: 'linkedin profile',
    });

    return results.results.map(r => r.url);
  }

  private buildSearchQuery(request: ExaEnrichmentRequest): string {
    const parts = [request.full_name];
    if (request.current_company) parts.push(request.current_company);
    return parts.join(' ');
  }

  private async extractLinkedInProfile(results: any, request: ExaEnrichmentRequest) {
    // Find LinkedIn URL in results
    const linkedinResult = results.results.find((r: any) =>
      r.url.includes('linkedin.com/in/') ||
      r.url === request.linkedin_url
    );

    if (!linkedinResult) {
      return this.generateEmptyProfile();
    }

    // Parse LinkedIn content using Exa's text extraction
    return this.parseLinkedInContent(linkedinResult.text);
  }

  private async getCompanyIntelligence(companyName?: string) {
    if (!companyName) return null;

    const results = await this.exa.searchAndContents(
      `${companyName} company information news leadership`,
      {
        type: 'neural',
        useAutoprompt: true,
        numResults: 5,
      }
    );

    return this.parseCompanyData(results);
  }

  private async findMediaMentions(name: string, company?: string) {
    const query = company
      ? `"${name}" ${company} news articles interviews`
      : `"${name}" news articles interviews`;

    const results = await this.exa.searchAndContents(query, {
      type: 'neural',
      useAutoprompt: true,
      numResults: 10,
      startPublishedDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(), // Last year
    });

    return results.results.map((r: any) => ({
      title: r.title,
      url: r.url,
      published_date: r.publishedDate,
      excerpt: r.highlights?.[0] || r.text.substring(0, 200),
    }));
  }

  private extractSocialPresence(results: any) {
    const twitterResult = results.results.find((r: any) => r.url.includes('twitter.com'));
    const websiteResult = results.results.find((r: any) =>
      !r.url.includes('linkedin.com') &&
      !r.url.includes('twitter.com') &&
      !r.url.includes('facebook.com')
    );

    return {
      twitter_handle: twitterResult?.url.match(/twitter\.com\/([^/]+)/)?.[1],
      website: websiteResult?.url,
    };
  }

  private calculateConfidence(linkedin: any, company: any, mentions: any[]): number {
    let score = 0;
    if (linkedin.headline) score += 0.3;
    if (linkedin.experience?.length) score += 0.3;
    if (company) score += 0.2;
    if (mentions.length > 0) score += 0.2;
    return Math.min(score, 1.0);
  }

  private generateEmptyProfile() {
    return {
      headline: '',
      summary: '',
      experience: [],
      education: [],
      skills: [],
    };
  }

  private parseLinkedInContent(text: string) {
    // Use Claude AI to parse unstructured LinkedIn text
    // This would call Anthropic API to extract structured data
    // For now, return placeholder
    return this.generateEmptyProfile();
  }

  private parseCompanyData(results: any) {
    // Extract company intelligence from search results
    return {
      name: '',
      industry: '',
      size: '',
      location: '',
      description: '',
      recent_news: [],
    };
  }
}

export { ExaEnrichmentService };
```

### Supabase Integration for Exa Enrichment

```sql
-- Add Exa enrichment columns to person_identity_map
ALTER TABLE person_identity_map
ADD COLUMN exa_enriched BOOLEAN DEFAULT FALSE,
ADD COLUMN exa_enriched_at TIMESTAMPTZ,
ADD COLUMN exa_linkedin_data JSONB,
ADD COLUMN exa_company_intel JSONB,
ADD COLUMN exa_media_mentions JSONB,
ADD COLUMN exa_social_presence JSONB,
ADD COLUMN exa_enrichment_confidence DECIMAL(3,2);

-- Create index for unenriched contacts
CREATE INDEX idx_person_exa_unenriched ON person_identity_map(exa_enriched)
WHERE exa_enriched = FALSE;

-- Create Exa enrichment queue table
CREATE TABLE exa_enrichment_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  person_id UUID NOT NULL REFERENCES person_identity_map(person_id),
  priority INTEGER NOT NULL DEFAULT 50, -- 0-100, higher = more urgent
  status TEXT NOT NULL DEFAULT 'pending', -- pending, processing, completed, failed
  retry_count INTEGER NOT NULL DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  exa_requests_made INTEGER DEFAULT 0,
  exa_cost_cents DECIMAL(10,2)
);

CREATE INDEX idx_exa_queue_pending ON exa_enrichment_queue(priority DESC, created_at)
WHERE status = 'pending';

-- Function to queue person for enrichment
CREATE OR REPLACE FUNCTION queue_exa_enrichment(
  p_person_id UUID,
  p_priority INTEGER DEFAULT 50
)
RETURNS UUID AS $$
DECLARE
  v_queue_id UUID;
BEGIN
  INSERT INTO exa_enrichment_queue (person_id, priority)
  VALUES (p_person_id, p_priority)
  ON CONFLICT (person_id) DO UPDATE
  SET priority = GREATEST(exa_enrichment_queue.priority, EXCLUDED.priority)
  RETURNING id INTO v_queue_id;

  RETURN v_queue_id;
END;
$$ LANGUAGE plpgsql;

-- View for enrichment candidates (high priority, not yet enriched)
CREATE VIEW vw_exa_enrichment_candidates AS
SELECT
  p.person_id,
  p.full_name,
  p.email,
  p.linkedin_contact_id,
  p.current_company,
  p.current_position,
  p.engagement_priority,
  p.youth_justice_relevance_score,
  cis.composite_score,
  cis.influence_score,
  CASE
    WHEN p.engagement_priority = 'critical' THEN 100
    WHEN p.engagement_priority = 'high' THEN 75
    WHEN p.engagement_priority = 'medium' THEN 50
    ELSE 25
  END AS enrichment_priority
FROM person_identity_map p
LEFT JOIN contact_intelligence_scores cis ON p.person_id = cis.person_id
WHERE p.exa_enriched = FALSE
  AND p.email IS NOT NULL
ORDER BY enrichment_priority DESC, cis.composite_score DESC NULLS LAST;
```

### Supabase Edge Function for Exa Enrichment

```typescript
// File: /Users/benknight/Code/ACT Placemat/supabase/functions/exa-enrich/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Exa from 'https://esm.sh/exa-js@1';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

const exa = new Exa(Deno.env.get('EXA_API_KEY')!);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*' } });
  }

  try {
    const { person_id, batch_size } = await req.json();

    if (person_id) {
      // Enrich single person
      const result = await enrichSinglePerson(person_id);
      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      // Batch enrich (process queue)
      const batchResults = await enrichBatch(batch_size || 10);
      return new Response(JSON.stringify(batchResults), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

async function enrichSinglePerson(person_id: string) {
  // Get person data
  const { data: person } = await supabase
    .from('person_identity_map')
    .select('*')
    .eq('person_id', person_id)
    .single();

  if (!person) throw new Error('Person not found');

  // Search Exa for person
  const query = [person.full_name, person.current_company].filter(Boolean).join(' ');

  const searchResults = await exa.searchAndContents(query, {
    type: 'neural',
    useAutoprompt: true,
    numResults: 10,
    contents: { text: true, highlights: true },
  });

  // Extract LinkedIn profile
  const linkedinResult = searchResults.results.find(r =>
    r.url.includes('linkedin.com/in/')
  );

  // Find media mentions
  const mediaMentions = await exa.searchAndContents(
    `"${person.full_name}" news articles interviews`,
    {
      type: 'neural',
      useAutoprompt: true,
      numResults: 5,
      startPublishedDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
    }
  );

  // Update person record
  const { error } = await supabase
    .from('person_identity_map')
    .update({
      exa_enriched: true,
      exa_enriched_at: new Date().toISOString(),
      exa_linkedin_data: linkedinResult ? { url: linkedinResult.url, text: linkedinResult.text } : null,
      exa_media_mentions: mediaMentions.results.map(r => ({
        title: r.title,
        url: r.url,
        published_date: r.publishedDate,
      })),
      exa_enrichment_confidence: linkedinResult ? 0.8 : 0.3,
    })
    .eq('person_id', person_id);

  // Log enrichment
  await supabase.from('contact_research_log').insert({
    person_id,
    research_type: 'web_search',
    research_query: query,
    research_data: { exa_results: searchResults.results.length },
    confidence_score: linkedinResult ? 0.8 : 0.3,
    source_urls: searchResults.results.map((r: any) => r.url),
    ai_provider: 'exa',
    success: !error,
    error_message: error?.message,
  });

  return { success: true, person_id, results_found: searchResults.results.length };
}

async function enrichBatch(batch_size: number) {
  // Get next batch from queue
  const { data: queueItems } = await supabase
    .from('exa_enrichment_queue')
    .select('id, person_id')
    .eq('status', 'pending')
    .order('priority', { ascending: false })
    .order('created_at')
    .limit(batch_size);

  if (!queueItems || queueItems.length === 0) {
    return { message: 'No items in queue' };
  }

  const results = [];
  for (const item of queueItems) {
    // Mark as processing
    await supabase
      .from('exa_enrichment_queue')
      .update({ status: 'processing', started_at: new Date().toISOString() })
      .eq('id', item.id);

    try {
      const result = await enrichSinglePerson(item.person_id);
      results.push(result);

      // Mark as completed
      await supabase
        .from('exa_enrichment_queue')
        .update({ status: 'completed', completed_at: new Date().toISOString() })
        .eq('id', item.id);
    } catch (error) {
      // Mark as failed
      await supabase
        .from('exa_enrichment_queue')
        .update({
          status: 'failed',
          error_message: error.message,
          retry_count: supabase.rpc('increment', { row_id: item.id }),
        })
        .eq('id', item.id);
    }
  }

  return { processed: results.length, results };
}
```

---

## Integration Architecture: Placemat ↔ GHL

### Sync Service (Supabase Edge Function)

```typescript
// File: /Users/benknight/Code/ACT Placemat/supabase/functions/sync-to-ghl/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const placematSupabase = createClient(
  Deno.env.get('PLACEMAT_SUPABASE_URL')!,
  Deno.env.get('PLACEMAT_SUPABASE_SERVICE_KEY')!
);

const innovationStudioSupabase = createClient(
  Deno.env.get('INNOVATION_STUDIO_SUPABASE_URL')!,
  Deno.env.get('INNOVATION_STUDIO_SUPABASE_SERVICE_KEY')!
);

serve(async (req) => {
  const { action, person_id, ghl_contact_id } = await req.json();

  if (action === 'sync_to_ghl') {
    // Placemat → GHL: Sync high-priority contacts to GHL for campaign execution
    return await syncPlacematToGHL(person_id);
  } else if (action === 'sync_from_ghl') {
    // GHL → Placemat: Update Placemat with engagement data from GHL
    return await syncGHLToPlacemat(ghl_contact_id);
  }

  return new Response('Invalid action', { status: 400 });
});

async function syncPlacematToGHL(person_id: string) {
  // Get person from Placemat
  const { data: person } = await placematSupabase
    .from('person_identity_map')
    .select('*, contact_intelligence_scores(*)')
    .eq('person_id', person_id)
    .single();

  if (!person) {
    return new Response('Person not found', { status: 404 });
  }

  // Determine which GHL project(s) to sync to based on campaign or engagement_priority
  const targetProjects = determineTargetProjects(person);

  // Create/update in GHL master contact database (Innovation Studio)
  const { data: ghlContact, error } = await innovationStudioSupabase
    .from('ghl_contacts_master')
    .upsert({
      email: person.email,
      name: person.full_name,
      phone: person.contact_data?.phone,
      tags: [
        ...person.tags,
        `placemat-priority-${person.engagement_priority}`,
        `composite-score-${Math.floor(person.contact_intelligence_scores?.composite_score || 0)}`,
      ],
      // Store Placemat intelligence in custom fields
      placemat_person_id: person_id,
      influence_score: person.contact_intelligence_scores?.influence_score,
      accessibility_score: person.contact_intelligence_scores?.accessibility_score,
      alignment_score: person.contact_intelligence_scores?.alignment_score,
    }, {
      onConflict: 'email',
    });

  return new Response(JSON.stringify({ success: true, ghl_contact: ghlContact }));
}

async function syncGHLToPlacemat(ghl_contact_id: string) {
  // Get GHL contact
  const { data: ghlContact } = await innovationStudioSupabase
    .from('ghl_contacts_master')
    .select('*')
    .eq('master_contact_id', ghl_contact_id)
    .single();

  if (!ghlContact || !ghlContact.email) {
    return new Response('GHL contact not found', { status: 404 });
  }

  // Find matching person in Placemat
  const { data: person } = await placematSupabase
    .from('person_identity_map')
    .select('person_id')
    .eq('email', ghlContact.email.toLowerCase())
    .single();

  if (person) {
    // Person exists - update engagement tier based on GHL activity
    const engagementTier = calculateEngagementTier(ghlContact);

    await placematSupabase
      .from('person_identity_map')
      .update({
        engagement_priority: engagementTier,
        updated_at: new Date().toISOString(),
      })
      .eq('person_id', person.person_id);

    // Log interaction
    await placematSupabase.from('contact_interactions').insert({
      person_id: person.person_id,
      interaction_type: 'other',
      interaction_date: ghlContact.last_interaction_date,
      description: `GHL engagement: ${ghlContact.last_interaction_project}`,
      outcome: 'positive',
    });
  } else {
    // New person - create in Placemat
    const { data: newPerson } = await placematSupabase
      .from('person_identity_map')
      .insert({
        full_name: ghlContact.name,
        email: ghlContact.email,
        current_company: ghlContact.company_name,
        engagement_priority: calculateEngagementTier(ghlContact),
        tags: ghlContact.tags,
        contact_data: { ghl_sync: true },
      })
      .select('person_id')
      .single();

    // Queue for Exa enrichment
    if (newPerson) {
      await placematSupabase.rpc('queue_exa_enrichment', {
        p_person_id: newPerson.person_id,
        p_priority: 75, // Medium-high priority for GHL-sourced contacts
      });
    }
  }

  return new Response(JSON.stringify({ success: true }));
}

function determineTargetProjects(person: any): string[] {
  // Based on person's sector, tags, campaigns, determine which ACT projects to sync to
  const projects = [];

  if (person.tags.includes('youth-justice') || person.youth_justice_relevance_score > 50) {
    projects.push('justice-hub');
  }

  if (person.tags.includes('storytelling') || person.sector === 'media') {
    projects.push('empathy-ledger');
  }

  if (person.tags.includes('farming') || person.tags.includes('regenerative')) {
    projects.push('act-farm');
    projects.push('the-harvest');
  }

  if (person.tags.includes('products') || person.tags.includes('circular-economy')) {
    projects.push('goods-on-country');
  }

  // Default to ACT Hub if no specific project match
  if (projects.length === 0) {
    projects.push('act-hub');
  }

  return projects;
}

function calculateEngagementTier(ghlContact: any): string {
  if (ghlContact.total_interactions >= 10) return 'critical';
  if (ghlContact.total_interactions >= 5) return 'high';
  if (ghlContact.total_interactions >= 1) return 'medium';
  return 'low';
}
```

---

## Implementation Roadmap

### Phase 1: Exa.ai Enrichment Pipeline (Week 1)

**Goal**: Enrich existing 15,000 contacts with deep intelligence

1. ☐ Set up Exa.ai account ($50/month Growth plan for 10k requests)
2. ☐ Add Exa enrichment columns to `person_identity_map` table (SQL above)
3. ☐ Create `exa_enrichment_queue` table
4. ☐ Deploy Supabase Edge Function: `exa-enrich`
5. ☐ Queue high-priority contacts (critical + high engagement_priority)
6. ☐ Run batch enrichment (100 contacts/day = 150 days for all 15k at $50/month)
7. ☐ Monitor enrichment quality and confidence scores

**Deliverables**:
- Enriched LinkedIn profiles for top 1,000 contacts
- Company intelligence for their organizations
- Media mentions for influential contacts
- Social presence discovery

**Cost**: $50/month (Exa.ai Growth plan)

---

### Phase 2: Placemat ↔ GHL Sync (Week 2)

**Goal**: Bidirectional sync between intelligence layer and operational CRM

1. ☐ Create Supabase Edge Function: `sync-to-ghl` (in Placemat project)
2. ☐ Create Supabase Edge Function: `sync-from-ghl` (in Innovation Studio)
3. ☐ Add Placemat reference fields to Innovation Studio `ghl_contacts_master` table:
   - `placemat_person_id` (UUID)
   - `influence_score` (INTEGER 0-100)
   - `accessibility_score` (INTEGER 0-100)
   - `alignment_score` (INTEGER 0-100)
4. ☐ Test sync: Placemat critical contact → GHL ACT Hub
5. ☐ Test sync: New GHL contact → Placemat (with Exa enrichment trigger)
6. ☐ Set up cron job: Daily sync of high-priority contacts

**Deliverables**:
- High-value Placemat contacts available in GHL for campaigns
- New GHL contacts auto-enriched via Exa
- Engagement data flowing back to Placemat

**Cost**: $0 (uses existing infrastructure)

---

### Phase 3: Network Discovery & Similar People (Week 3-4)

**Goal**: Use Exa to discover new contacts similar to high-performers

1. ☐ Build "Find Similar People" feature using Exa
2. ☐ Input: Top 100 critical contacts from Placemat
3. ☐ Exa searches for similar profiles (same sector, role, location)
4. ☐ Auto-add discovered people to Placemat with "discovered" tag
5. ☐ Queue for enrichment
6. ☐ Run scoring system on new contacts

**Deliverables**:
- 500-1,000 new high-value contacts discovered
- Pre-scored and enriched
- Ready for campaign assignment

**Cost**: Included in Exa.ai plan

---

### Phase 4: Automated Intelligence Updates (Ongoing)

**Goal**: Keep intelligence fresh with automated monitoring

1. ☐ Set up monthly Exa refresh for critical contacts (news mentions, job changes)
2. ☐ Alert system: Notify when high-value contact appears in news
3. ☐ Job change detection: Update when someone moves organizations
4. ☐ Company intel updates: Monitor funding, leadership changes

**Deliverables**:
- Always up-to-date intelligence
- Proactive outreach opportunities
- Reduced manual research time

**Cost**: Included in ongoing Exa.ai subscription

---

## ROI Analysis

### Current State (Manual Research)

**Time Investment**:
- Research 1 contact deeply: 15-30 minutes
- 15,000 contacts × 20 min average = **5,000 hours** = 125 work weeks
- @ $50/hour = **$250,000** in labor cost

**Data Freshness**:
- One-time research (goes stale in 6-12 months)
- No monitoring of news/job changes
- Manual discovery of new contacts

### With Exa.ai Enrichment

**Time Investment**:
- Setup: 20 hours
- Monitoring: 2 hours/month
- **Total Year 1**: 44 hours vs 5,000 hours = **99% time savings**

**Cost**:
- Exa.ai: $50/month × 12 = $600/year
- Supabase: $0 (free tier sufficient or already paying)
- Development time: 40 hours @ $100/hour = $4,000 (one-time)
- **Total Year 1**: $4,600

**ROI**:
- Manual approach: $250,000
- Automated approach: $4,600
- **Savings**: $245,400 (98% cost reduction)
- **ROI**: 5,326%

**Data Quality Improvement**:
- Automatic updates (news, job changes)
- Network discovery (find 500-1,000 new contacts)
- Consistent scoring across all contacts
- Always-on monitoring

---

## Technical Stack Summary

### ACT Placemat (Intelligence Layer)
- **Database**: Supabase PostgreSQL
- **API**: Express.js (existing)
- **Enrichment**: Exa.ai API
- **AI Scoring**: Python (existing strategic-contact-scoring.py)
- **Edge Functions**: Supabase Edge (Deno)

### ACT Innovation Studio (Operational CRM)
- **Database**: Supabase PostgreSQL
- **API**: Next.js API Routes
- **CRM**: GoHighLevel (6 sub-accounts)
- **Webhooks**: Next.js webhook endpoints
- **Sync**: TypeScript contact sync service

### Integration
- **Sync Method**: Supabase Edge Functions (bidirectional)
- **Trigger**: Manual (API call) or Cron (scheduled)
- **Enrichment Flow**: GHL new contact → Placemat → Exa.ai → Scoring → GHL update

---

## Next Steps

1. **Decide on Exa.ai Plan**: Free tier (1k requests/month) or Growth ($50/month for 10k)?

2. **Priority Enrichment**: Which contacts to enrich first?
   - Option A: Top 1,000 critical/high engagement_priority
   - Option B: All contacts with linkedin_url (better match rate)
   - Option C: Campaign-specific (e.g., all youth justice contacts)

3. **Sync Strategy**: When to sync Placemat → GHL?
   - Option A: Manual (API call when assigning to campaign)
   - Option B: Automatic (all critical/high contacts daily)
   - Option C: Selective (campaign-specific sync)

4. **Development Timeline**: Want this built now or later?
   - I can build the Exa enrichment pipeline
   - I can build the Placemat ↔ GHL sync
   - I can build the network discovery feature

**Ready to proceed?** Let me know which phase to start with!
