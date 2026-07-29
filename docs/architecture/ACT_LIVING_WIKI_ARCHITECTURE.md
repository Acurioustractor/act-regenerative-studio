# ACT Living Wiki - Architecture & Vision

**Purpose:** A continuously-updated, AI-enhanced knowledge base that captures how ACT works by scanning your daily tools (Notion, Gmail, Calendar, GHL, WhatsApp) and organizing it into a searchable, verified wiki.

**Goal:** Automate knowledge capture so the team can focus on engagement, art, and making.

---

## 🌱 The Vision

### What It Is
A **living, breathing knowledge base** that:
- Automatically scans your daily work (emails, meetings, Notion docs, GHL workflows, WhatsApp conversations)
- Extracts knowledge using AI (processes, decisions, guides, principles)
- Presents it for human review and verification
- Organizes into a structured wiki (Principles → Methods → Practices → Procedures)
- Stays up-to-date with a review cadence (weekly/monthly/quarterly)
- Becomes THE source of truth for "how ACT works"

### What It Enables
- **Onboard new team members** in hours, not weeks
- **Document as you go** - no manual wiki writing needed
- **Find answers instantly** - searchable knowledge across all tools
- **Automate repetitive work** - clear procedures anyone can follow
- **Preserve institutional knowledge** - nothing gets lost when people leave
- **Scale the team** - clear processes enable delegation

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    KNOWLEDGE SOURCES                            │
│  Notion │ Gmail │ Calendar │ GHL │ WhatsApp │ Slack │ Drive   │
└─────────────────┬───────────────────────────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────────────────────────────┐
│                 KNOWLEDGE SCANNERS                              │
│  - Notion API: Extract docs, databases, meeting notes          │
│  - Gmail API: Extract important threads, decisions              │
│  - Calendar API: Extract recurring patterns, workflows          │
│  - GHL API: Extract automation workflows, templates             │
│  - WhatsApp Export: Extract procedures, quick guides            │
└─────────────────┬───────────────────────────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────────────────────────────┐
│              AI KNOWLEDGE EXTRACTION                            │
│  - Claude/Mistral analyzes content                              │
│  - Identifies: Principles, Methods, Practices, Procedures       │
│  - Detects: Decisions, Workflows, Templates, Guides            │
│  - Tags: Projects, Domains, People                              │
│  - Suggests: Category, Priority, Related Pages                  │
└─────────────────┬───────────────────────────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────────────────────────────┐
│              REVIEW QUEUE                                       │
│  - Extracted knowledge awaiting human verification              │
│  - VerificationPanel for quality check                          │
│  - Approve → Wiki | Revise → Re-extract | Reject → Discard    │
└─────────────────┬───────────────────────────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────────────────────────────┐
│                 ACT LIVING WIKI                                 │
│                                                                  │
│  📚 Principles                                                  │
│  ├── Community Ownership                                        │
│  ├── Beautiful Obsolescence                                     │
│  └── Consent at Every Level                                     │
│                                                                  │
│  🛠️ Methods                                                     │
│  ├── LCAA Framework                                             │
│  ├── Power Take-Off Model                                       │
│  └── Elder Review Process                                       │
│                                                                  │
│  ⚙️ Practices                                                   │
│  ├── How We Run Meetings                                        │
│  ├── How We Review Content                                      │
│  └── How We Onboard Partners                                    │
│                                                                  │
│  📋 Procedures                                                  │
│  ├── Publishing a Blog Post                                     │
│  ├── Setting Up GHL Automation                                  │
│  └── Submitting a Grant Proposal                                │
│                                                                  │
│  🗂️ Templates & Guides                                         │
│  ├── Email Templates                                            │
│  ├── Meeting Agendas                                            │
│  └── Project Briefs                                             │
└─────────────────┬───────────────────────────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────────────────────────────┐
│              CONTINUOUS UPDATES                                 │
│  - Daily: Scan new emails, Notion pages, calendar events        │
│  - Weekly: Review queue check, suggest outdated pages           │
│  - Monthly: Full scan, detect patterns, suggest new pages       │
│  - Quarterly: Major review, archive old knowledge               │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Database Schema

### Wiki Pages Table
```sql
CREATE TABLE wiki_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Core content
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,

  -- PMPP classification
  page_type TEXT CHECK (page_type IN ('principle', 'method', 'practice', 'procedure', 'guide', 'template')) NOT NULL,

  -- Hierarchy
  parent_principle_id UUID REFERENCES wiki_pages(id),
  parent_method_id UUID REFERENCES wiki_pages(id),
  parent_practice_id UUID REFERENCES wiki_pages(id),

  -- Metadata
  projects TEXT[],
  domains TEXT[],
  tags TEXT[],

  -- Knowledge sources (where this came from)
  source_type TEXT[], -- ['notion', 'gmail', 'calendar', 'ghl', 'whatsapp']
  source_urls TEXT[],
  extracted_from TEXT[], -- Original content IDs

  -- Review tracking
  status TEXT CHECK (status IN ('draft', 'active', 'needs_review', 'archived')) DEFAULT 'draft',
  last_reviewed_at TIMESTAMPTZ DEFAULT NOW(),
  review_frequency_days INTEGER DEFAULT 90,
  next_review_due TIMESTAMPTZ,

  -- Verification
  verified_by UUID REFERENCES auth.users(id),
  verified_at TIMESTAMPTZ,
  quality_score INTEGER CHECK (quality_score BETWEEN 1 AND 5),

  -- Version tracking
  version INTEGER DEFAULT 1,
  updated_by UUID REFERENCES auth.users(id),

  -- Search
  search_vector TSVECTOR,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Full-text search index
CREATE INDEX idx_wiki_search ON wiki_pages USING GIN(search_vector);
CREATE INDEX idx_wiki_type ON wiki_pages(page_type);
CREATE INDEX idx_wiki_status ON wiki_pages(status);
CREATE INDEX idx_wiki_review ON wiki_pages(next_review_due);
CREATE INDEX idx_wiki_projects ON wiki_pages USING GIN(projects);
CREATE INDEX idx_wiki_tags ON wiki_pages USING GIN(tags);
```

### Knowledge Extraction Queue
```sql
CREATE TABLE knowledge_extraction_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Source
  source_type TEXT CHECK (source_type IN ('notion', 'gmail', 'calendar', 'ghl', 'whatsapp', 'slack')) NOT NULL,
  source_id TEXT NOT NULL, -- Original ID from source system
  source_url TEXT,

  -- Extracted content
  raw_content TEXT NOT NULL,
  extracted_knowledge TEXT, -- AI-generated wiki page draft
  suggested_title TEXT,
  suggested_type TEXT,
  suggested_category TEXT[],
  confidence_score DECIMAL(3,2), -- 0.00-1.00

  -- Review status
  status TEXT CHECK (status IN ('pending', 'in_review', 'approved', 'rejected', 'merged')) DEFAULT 'pending',
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  review_notes TEXT,

  -- If approved, links to wiki page
  wiki_page_id UUID REFERENCES wiki_pages(id),

  -- Extraction metadata
  extracted_at TIMESTAMPTZ DEFAULT NOW(),
  extraction_model TEXT, -- Which AI model was used

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_extraction_status ON knowledge_extraction_queue(status);
CREATE INDEX idx_extraction_source ON knowledge_extraction_queue(source_type, source_id);
```

### Knowledge Source Sync Status
```sql
CREATE TABLE knowledge_source_sync (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  source_type TEXT CHECK (source_type IN ('notion', 'gmail', 'calendar', 'ghl', 'whatsapp')) NOT NULL,

  -- Sync tracking
  last_sync_at TIMESTAMPTZ,
  last_sync_cursor TEXT, -- For incremental syncing
  items_scanned INTEGER DEFAULT 0,
  items_extracted INTEGER DEFAULT 0,
  items_approved INTEGER DEFAULT 0,

  -- Configuration
  enabled BOOLEAN DEFAULT TRUE,
  sync_frequency_hours INTEGER DEFAULT 24,
  next_sync_due TIMESTAMPTZ,

  -- Filters
  filters JSONB, -- Custom filters per source

  -- Status
  status TEXT CHECK (status IN ('active', 'paused', 'error')) DEFAULT 'active',
  last_error TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🔄 Knowledge Scanning Workflows

### 1. Notion Scanner

**What to Scan:**
- Meeting notes pages
- Project documentation
- Process documentation
- Templates
- Databases with "knowledge" tag

**Extraction Logic:**
```javascript
// Scan Notion for knowledge
async function scanNotion() {
  const notion = new Client({ auth: process.env.NOTION_API_KEY });

  // Get all pages tagged with "knowledge" or in specific databases
  const response = await notion.search({
    filter: {
      property: 'object',
      value: 'page'
    },
    sort: {
      direction: 'descending',
      timestamp: 'last_edited_time'
    }
  });

  for (const page of response.results) {
    // Skip if already extracted
    if (await isAlreadyExtracted('notion', page.id)) continue;

    // Get full page content
    const content = await getNotionPageContent(page.id);

    // Extract knowledge with AI
    const extraction = await extractKnowledge({
      source: 'notion',
      sourceId: page.id,
      content: content,
      metadata: {
        title: page.properties.title?.title[0]?.plain_text,
        created: page.created_time,
        lastEdited: page.last_edited_time,
      }
    });

    // Add to review queue
    await queueForReview(extraction);
  }
}
```

**AI Prompt for Extraction:**
```
Analyze this Notion page and extract actionable knowledge for ACT's wiki.

Content: {content}

Identify:
1. Type: Is this a Principle, Method, Practice, Procedure, Guide, or Template?
2. Title: What's a clear, searchable title?
3. Category: Which ACT domains does this relate to? (projects, engagement, operations, etc.)
4. Key Knowledge: What are the core learnings or instructions?
5. Related Topics: What other wiki pages would this link to?

Output as structured JSON.
```

### 2. Gmail Scanner

**What to Scan:**
- Threads tagged with "decision", "process", "guide"
- Emails from specific senders (team leads)
- Threads with >5 replies (indicates important discussion)
- Emails sent to specific labels/folders

**Extraction Logic:**
```javascript
async function scanGmail() {
  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

  // Search for knowledge-rich threads
  const queries = [
    'label:decisions after:2024/01/01',
    'label:processes after:2024/01/01',
    'subject:(how to OR guide OR template) after:2024/01/01',
  ];

  for (const query of queries) {
    const threads = await gmail.users.threads.list({
      userId: 'me',
      q: query,
    });

    for (const thread of threads.data.threads) {
      if (await isAlreadyExtracted('gmail', thread.id)) continue;

      // Get full thread
      const fullThread = await gmail.users.threads.get({
        userId: 'me',
        id: thread.id,
      });

      // Extract conversation
      const conversation = extractEmailThread(fullThread);

      // Extract knowledge
      const extraction = await extractKnowledge({
        source: 'gmail',
        sourceId: thread.id,
        content: conversation,
        metadata: {
          subject: fullThread.data.messages[0].payload.headers.find(h => h.name === 'Subject')?.value,
          participants: extractParticipants(fullThread),
          date: fullThread.data.messages[0].internalDate,
        }
      });

      await queueForReview(extraction);
    }
  }
}
```

### 3. Calendar Scanner

**What to Scan:**
- Recurring meetings (reveal regular practices)
- Meeting notes in descriptions
- Event types (1:1s, team meetings, planning sessions)

**Extraction Logic:**
```javascript
async function scanCalendar() {
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  // Get recurring events (reveal practices)
  const events = await calendar.events.list({
    calendarId: 'primary',
    timeMin: new Date('2024-01-01').toISOString(),
    singleEvents: false, // Get recurring series
    orderBy: 'startTime',
  });

  for (const event of events.data.items) {
    // Skip if not recurring or no description
    if (!event.recurrence || !event.description) continue;

    if (await isAlreadyExtracted('calendar', event.id)) continue;

    // Extract meeting pattern
    const extraction = await extractKnowledge({
      source: 'calendar',
      sourceId: event.id,
      content: `
        Meeting: ${event.summary}
        Frequency: ${event.recurrence.join(', ')}
        Attendees: ${event.attendees?.map(a => a.email).join(', ')}
        Notes: ${event.description}
      `,
      metadata: {
        type: 'practice', // Recurring meetings = practices
        frequency: event.recurrence,
      }
    });

    await queueForReview(extraction);
  }
}
```

### 4. GHL Scanner

**What to Scan:**
- Automation workflows
- Email templates
- SMS templates
- Pipeline configurations

**Extraction Logic:**
```javascript
async function scanGHL() {
  // Get all workflows
  const workflows = await fetch('https://services.leadconnectorhq.com/workflows', {
    headers: { 'Authorization': `Bearer ${process.env.GHL_API_KEY}` }
  }).then(r => r.json());

  for (const workflow of workflows.workflows) {
    if (await isAlreadyExtracted('ghl', workflow.id)) continue;

    // Extract workflow as procedure
    const extraction = await extractKnowledge({
      source: 'ghl',
      sourceId: workflow.id,
      content: `
        Workflow: ${workflow.name}
        Trigger: ${workflow.trigger}
        Actions: ${workflow.actions.map(a => a.type).join(' → ')}
        Description: ${workflow.description}
      `,
      metadata: {
        type: 'procedure', // Workflows = procedures
        tags: ['automation', 'ghl'],
      }
    });

    await queueForReview(extraction);
  }
}
```

### 5. WhatsApp Scanner

**What to Scan:**
- Exported chat archives
- Group chats with team
- Important saved messages

**Extraction Logic:**
```javascript
async function scanWhatsApp() {
  // Parse exported WhatsApp chat file
  const chatExport = await readFile('./whatsapp-export.txt', 'utf-8');
  const messages = parseWhatsAppExport(chatExport);

  // Group by conversation threads
  const threads = groupMessagesByThread(messages);

  for (const thread of threads) {
    // Skip short conversations
    if (thread.messages.length < 5) continue;

    if (await isAlreadyExtracted('whatsapp', thread.id)) continue;

    // Extract knowledge from conversation
    const extraction = await extractKnowledge({
      source: 'whatsapp',
      sourceId: thread.id,
      content: thread.messages.map(m => `${m.sender}: ${m.text}`).join('\n'),
      metadata: {
        participants: thread.participants,
        date: thread.startDate,
      }
    });

    await queueForReview(extraction);
  }
}
```

---

## 🎯 AI Knowledge Extraction

### Master Extraction Prompt

```
You are analyzing content from ACT's daily tools to extract actionable knowledge for their wiki.

ACT is a regenerative innovation ecosystem with these core principles:
- Community Ownership
- Beautiful Obsolescence
- Consent at Every Level
- Listen, Curiosity, Action, Art (LCAA)

Content Source: {source_type}
Content: {content}

Analyze this and extract structured knowledge:

1. KNOWLEDGE TYPE (choose one):
   - Principle: Core value that guides decisions
   - Method: Approach or framework (e.g., LCAA)
   - Practice: How we do recurring activities
   - Procedure: Step-by-step process
   - Guide: Educational content or tutorial
   - Template: Reusable document or format

2. TITLE: Clear, searchable (e.g., "How We Run Weekly Team Meetings")

3. CONTENT: Rewrite the knowledge as a clear wiki page:
   - Use headers, bullet points, examples
   - Make it actionable and specific
   - Preserve ACT's voice (grounded yet visionary, humble yet confident)
   - Link to related concepts

4. METADATA:
   - Projects: [list relevant ACT projects]
   - Domains: [operations, engagement, communications, etc.]
   - Tags: [3-5 searchable keywords]

5. HIERARCHY:
   - Parent Principle: Which core principle does this support?
   - Parent Method: Which method/framework does this belong to?
   - Related Pages: What other wiki pages should link here?

6. CONFIDENCE: How confident are you this is valuable knowledge? (0.0-1.0)

Output as JSON:
{
  "type": "practice",
  "title": "How We Run Weekly Team Meetings",
  "content": "...",
  "excerpt": "...",
  "projects": ["all"],
  "domains": ["operations"],
  "tags": ["meetings", "team", "collaboration"],
  "parent_principle": "Community Ownership",
  "related_pages": ["Meeting Agenda Template", "Decision-Making Process"],
  "confidence": 0.85
}
```

---

## 🖥️ Wiki UI Components

### Navigation Structure

```
ACT Living Wiki
├── 🏠 Home (Overview, Search, Recent Updates)
├── 📚 Principles (Core Values)
│   ├── Community Ownership
│   ├── Beautiful Obsolescence
│   └── Consent at Every Level
├── 🛠️ Methods (Frameworks & Approaches)
│   ├── LCAA Framework
│   ├── Power Take-Off Model
│   └── Elder Review Process
├── ⚙️ Practices (How We Work)
│   ├── Meetings
│   ├── Content Creation
│   └── Partner Engagement
├── 📋 Procedures (Step-by-Step)
│   ├── Publishing Content
│   ├── Onboarding Partners
│   └── Grant Proposals
├── 📄 Templates
│   ├── Email Templates
│   ├── Meeting Agendas
│   └── Project Briefs
└── 🔍 Search & Browse
```

---

## ⏱️ Review Cadences

### Daily
- **Auto-scan** new content from Notion, Gmail, Calendar
- **Queue** for review (don't auto-publish)
- **Notify** team of new extractions

### Weekly
- **Review queue** - approve/reject/revise extracted knowledge
- **Update check** - flag pages that might be outdated
- **Usage stats** - which pages are being viewed/searched most

### Monthly
- **Full scan** - comprehensive sweep of all sources
- **Pattern detection** - AI identifies emerging practices
- **Suggest new pages** - "I noticed you're doing X a lot, should we document it?"

### Quarterly
- **Major review** - verify all active pages still relevant
- **Archive old knowledge** - mark outdated pages
- **Knowledge gaps** - identify missing documentation

---

## 🚀 Implementation Phases

### Phase 1: Foundation (Week 1)
- [ ] Create wiki database schema
- [ ] Build basic wiki UI (list, view, edit)
- [ ] Set up knowledge extraction queue
- [ ] Create review interface

### Phase 2: First Scanner (Week 2)
- [ ] Implement Notion scanner
- [ ] AI extraction prompt
- [ ] Review workflow
- [ ] Test with real Notion pages

### Phase 3: More Scanners (Week 3-4)
- [ ] Gmail scanner
- [ ] Calendar scanner
- [ ] GHL scanner
- [ ] WhatsApp import

### Phase 4: Automation (Week 5-6)
- [ ] Daily auto-scan cron jobs
- [ ] Weekly review reminders
- [ ] Monthly pattern detection
- [ ] Quarterly health check

---

Ready to build this? Let's start with Phase 1! 🚀
