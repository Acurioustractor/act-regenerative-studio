# ACT Living Wiki - Complete Knowledge System Design

**Last Updated**: 2025-12-26
**Status**: Phase 2 Complete - Gmail + Notion Integration Live

---

## 🎯 System Overview

A **multi-source knowledge extraction and management system** that automatically captures, reviews, and publishes knowledge from:

1. ✅ **Notion** (ACT Placemat) - Principles, methods, practices, procedures
2. ✅ **Gmail** - Decisions, discussions, meeting notes, planning
3. 🚧 **Google Calendar** (Next Phase) - Historical events, future milestones, patterns

---

## 📊 Current State

### Active Integrations

**Notion Scanner** ✅
- **Status**: Working (with OpenAI quota limit)
- **What it does**: Scans ACT Placemat for knowledge pages
- **Triggers**: Manual POST to `/api/knowledge/scan-notion`
- **Extracts**: Principles, methods, practices, guides, procedures
- **Confidence**: Keyword-based (OpenAI embeddings disabled due to quota)
- **Queue**: 12 items extracted, deduplicated via upsert
- **Issue**: OpenAI API quota exceeded (insufficient_quota error)
- **Workaround**: Using keyword-based confidence (works without OpenAI)

**Gmail Scanner** ✅
- **Status**: Fully operational
- **What it does**: Scans benjamin@act.place for knowledge in emails
- **OAuth**: Connected (refresh token saved)
- **Triggers**: Manual POST to `/api/knowledge/scan-gmail`
- **Extracts**: Decisions, discussions, meetings, planning
- **Last Scan**: 1 email scanned, 1 knowledge item extracted
- **Incremental Sync**: Uses Gmail History API
- **Rate Limiting**: 30 concurrent requests (p-limit)

**Review Queue** ✅
- **URL**: http://localhost:3001/admin/queue
- **Status**: Operational
- **Items**: 13+ pending (Notion + Gmail)
- **Features**:
  - Filter by source (Gmail, Notion)
  - Bulk selection
  - Approve/reject
  - View source URLs
- **Auto-Approval**: 90%+ confidence items auto-publish (currently disabled due to null content issue)

---

## 🔄 Knowledge Freshness & Review System

### Problem Statement

Knowledge becomes stale. We need:
1. **Up-to-date information** - Refreshed automatically
2. **Quality reviews** - Regular audits of published content
3. **Source tracking** - Know where knowledge came from
4. **Change detection** - Detect when source material changes
5. **Lifecycle management** - Archive outdated, promote evergreen

### Proposed Solution: Knowledge Lifecycle Management

```
┌────────────────────────────────────────────────────────────┐
│                   Knowledge Lifecycle                       │
└────────────────────────────────────────────────────────────┘

EXTRACTION → QUEUE → REVIEW → PUBLISH → MAINTENANCE → ARCHIVE

1. EXTRACTION (Automated)
   ├─ Notion: Scans ACT Placemat daily
   ├─ Gmail: Scans new emails hourly
   └─ Calendar: Extracts events weekly (future)

2. QUEUE (Automated + Manual)
   ├─ Deduplicate by source_type + source_id
   ├─ Calculate confidence score
   ├─ Tag with suggested_type + suggested_tags
   └─ Auto-approve if confidence >= 90% (when OpenAI working)

3. REVIEW (Manual)
   ├─ View at /admin/queue
   ├─ Filter by source, type, confidence
   ├─ Edit extracted content
   ├─ Approve → Publish
   └─ Reject → Archive

4. PUBLISH (Automated)
   ├─ Create wiki_pages entry
   ├─ Generate slug
   ├─ Set status = 'published'
   ├─ Record source_tracking metadata
   └─ Show at /wiki

5. MAINTENANCE (Automated + Manual)
   ├─ Re-scan source periodically
   ├─ Detect changes in source
   ├─ Flag for review if changed
   ├─ Track last_verified_at timestamp
   └─ Show "Last updated" on wiki pages

6. ARCHIVE (Manual)
   ├─ Mark as outdated/deprecated
   ├─ Remove from active wiki
   ├─ Keep in database for history
   └─ Redirect to updated version if exists
```

---

## 🗓️ Calendar Integration Design (Phase 3)

### Why Calendar?

**Historical Context**:
- Meetings and decisions have dates
- Grants and funding have deadlines
- Projects have timelines
- Patterns emerge over time (quarterly reviews, annual planning, seasonal activities)

**Future Planning**:
- Upcoming deadlines visible
- Milestone tracking
- Grant application cycles
- Workshop/residency schedules

### Calendar Data Model

```typescript
interface CalendarExtraction {
  source_type: 'calendar';
  source_id: string;  // Event ID
  source_url: string; // Calendar link
  event_title: string;
  event_description: string;
  event_start: Date;
  event_end: Date;
  attendees: string[];
  location?: string;
  recurrence?: string;

  // Knowledge extraction
  suggested_type: 'meeting' | 'deadline' | 'milestone' | 'recurring_pattern';
  suggested_tags: string[];
  extracted_decisions?: string;  // Decisions made
  extracted_actions?: string[];  // Action items
  related_projects?: string[];   // ACT projects referenced

  confidence_score: number;
  is_recurring: boolean;
  pattern_type?: 'weekly' | 'monthly' | 'quarterly' | 'annual';
}
```

### Calendar Scanner Features

**1. Historical Pattern Detection**
```
Examples:
- "Monthly board meetings" (1st Thursday each month)
- "Quarterly reviews" (End of March, June, Sept, Dec)
- "Annual AGM" (Same date each year)
- "Grant deadlines" (Recurring annually)
```

**2. Future Timeline View**
```
/wiki/timeline
├─ Upcoming (next 30 days)
├─ This Quarter
├─ This Year
└─ Future Years
```

**3. Event Knowledge Extraction**
```
From calendar event:
  Title: "JusticeHub - Funding Review Meeting"
  Description: "Discuss NDIS funding increase, review Q4 numbers..."

Extract:
  - Project: JusticeHub
  - Type: Funding decision meeting
  - Tags: funding, NDIS, quarterly-review
  - Related to: Financial planning, JusticeHub operations
```

**4. Deadline Tracking**
```
Automatic detection of:
- Grant application deadlines
- Funding cycle dates
- Report due dates
- Project milestones
- Contract renewals
```

### Calendar Integration Schema

**New Database Tables**:

```sql
-- Calendar events with knowledge extraction
CREATE TABLE calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  calendar_id TEXT NOT NULL,  -- Google Calendar ID
  event_id TEXT NOT NULL,     -- Google Event ID
  event_title TEXT NOT NULL,
  event_description TEXT,
  event_start TIMESTAMPTZ NOT NULL,
  event_end TIMESTAMPTZ NOT NULL,
  attendees JSONB DEFAULT '[]',
  location TEXT,
  recurrence_rule TEXT,

  -- Knowledge extraction
  extracted_knowledge TEXT,
  suggested_type TEXT,
  suggested_tags TEXT[],
  confidence_score DECIMAL(3,2),

  -- Pattern detection
  is_recurring BOOLEAN DEFAULT FALSE,
  pattern_type TEXT,  -- weekly, monthly, quarterly, annual
  pattern_frequency INT,

  -- Metadata
  source_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_synced_at TIMESTAMPTZ,

  UNIQUE(calendar_id, event_id)
);

-- Timeline view for important dates
CREATE TABLE timeline_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  entry_date TIMESTAMPTZ NOT NULL,
  entry_type TEXT,  -- deadline, milestone, decision, meeting
  project_id TEXT,  -- Link to ACT project
  calendar_event_id UUID REFERENCES calendar_events(id),
  wiki_page_id UUID REFERENCES wiki_pages(id),

  status TEXT DEFAULT 'upcoming',  -- upcoming, completed, missed
  priority TEXT DEFAULT 'medium',   -- low, medium, high, critical

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pattern recognition results
CREATE TABLE calendar_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pattern_name TEXT NOT NULL,  -- "Monthly Board Meeting"
  pattern_type TEXT NOT NULL,  -- weekly, monthly, quarterly, annual
  frequency INT,               -- Every N weeks/months
  typical_day_of_week INT,     -- 0-6 (Sunday-Saturday)
  typical_day_of_month INT,    -- 1-31
  typical_month INT,           -- 1-12

  -- Events that match this pattern
  event_ids TEXT[],
  first_occurrence TIMESTAMPTZ,
  last_occurrence TIMESTAMPTZ,
  next_expected TIMESTAMPTZ,

  confidence_score DECIMAL(3,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Calendar Scanner Implementation

**File**: `src/lib/knowledge/calendar-scanner.ts`

```typescript
export class CalendarScanner {
  private calendar: calendar_v3.Calendar;
  private supabase: any;

  /**
   * Scan calendar for events since last sync
   */
  async scanCalendar(
    userEmail: string,
    options: {
      calendarId?: string;
      timeMin?: Date;
      timeMax?: Date;
      includeRecurring?: boolean;
    } = {}
  ): Promise<CalendarExtraction[]> {
    // Get authenticated Calendar client
    const auth = await getAuthenticatedClient(userEmail);
    this.calendar = google.calendar({ version: 'v3', auth });

    // Get events since last sync
    const events = await this.getEvents(options);

    // Extract knowledge from each event
    const extractions = [];
    for (const event of events) {
      const extraction = await this.extractFromEvent(event);
      if (extraction) {
        extractions.push(extraction);
      }
    }

    // Detect patterns in recurring events
    await this.detectPatterns(events);

    return extractions;
  }

  /**
   * Extract knowledge from calendar event
   */
  private async extractFromEvent(
    event: calendar_v3.Schema$Event
  ): Promise<CalendarExtraction | null> {
    // Skip if no title/summary
    if (!event.summary) return null;

    // Detect if this is knowledge-worthy
    const signals = this.detectEventSignals(event);
    if (!signals.isKnowledge) return null;

    // Extract decisions/actions from description
    const extracted = this.extractEventKnowledge(event);

    return {
      source_type: 'calendar',
      source_id: event.id!,
      source_url: event.htmlLink!,
      event_title: event.summary,
      event_description: event.description || '',
      event_start: new Date(event.start?.dateTime || event.start?.date!),
      event_end: new Date(event.end?.dateTime || event.end?.date!),
      attendees: event.attendees?.map(a => a.email!) || [],
      location: event.location,
      recurrence: event.recurrence?.[0],

      suggested_type: signals.suggestedType,
      suggested_tags: signals.suggestedTags,
      extracted_decisions: extracted.decisions,
      extracted_actions: extracted.actions,
      related_projects: extracted.projects,

      confidence_score: signals.confidence,
      is_recurring: !!event.recurrence,
      pattern_type: this.detectPatternType(event.recurrence),
    };
  }

  /**
   * Detect patterns in recurring events
   */
  private async detectPatterns(
    events: calendar_v3.Schema$Event[]
  ): Promise<void> {
    // Group by similar titles (fuzzy match)
    const groups = this.groupSimilarEvents(events);

    // For each group, detect if it's a pattern
    for (const group of groups) {
      if (group.events.length < 3) continue;

      const pattern = this.analyzeEventPattern(group.events);
      if (pattern.confidence > 0.7) {
        await this.savePattern(pattern);
      }
    }
  }

  /**
   * Analyze pattern in event group
   */
  private analyzeEventPattern(
    events: calendar_v3.Schema$Event[]
  ): CalendarPattern {
    // Calculate frequency (days between events)
    const intervals = [];
    for (let i = 1; i < events.length; i++) {
      const prev = new Date(events[i-1].start!.dateTime!);
      const curr = new Date(events[i].start!.dateTime!);
      intervals.push(Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)));
    }

    // Detect pattern type
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    let patternType: string;
    let frequency: number;

    if (avgInterval <= 7) {
      patternType = 'weekly';
      frequency = Math.round(avgInterval / 7);
    } else if (avgInterval <= 31) {
      patternType = 'monthly';
      frequency = Math.round(avgInterval / 30);
    } else if (avgInterval <= 100) {
      patternType = 'quarterly';
      frequency = Math.round(avgInterval / 91);
    } else {
      patternType = 'annual';
      frequency = Math.round(avgInterval / 365);
    }

    return {
      pattern_name: events[0].summary!,
      pattern_type: patternType,
      frequency,
      confidence: this.calculatePatternConfidence(intervals),
    };
  }
}
```

### Calendar API Setup

**OAuth Scopes Required**:
```
https://www.googleapis.com/auth/calendar.readonly
https://www.googleapis.com/auth/calendar.events.readonly
```

**Authorization Flow**: Same as Gmail
1. Enable Google Calendar API in Google Cloud Console
2. Add scopes to OAuth consent screen
3. User authorizes via `/api/auth/calendar`
4. Tokens saved to `calendar_auth_tokens` table

---

## 🔄 Knowledge Update & Review Workflows

### 1. Daily Workflow (Automated)

```bash
# 6:00 AM - Scan Notion for new/updated pages
curl -X POST http://localhost:3001/api/knowledge/scan-notion

# 6:30 AM - Scan Gmail for new emails (last 24 hours)
curl -X POST http://localhost:3001/api/knowledge/scan-gmail \
  -d '{"userEmail": "benjamin@act.place"}'

# 7:00 AM - Auto-approve high-confidence items (90%+)
curl -X POST http://localhost:3001/api/knowledge/auto-approve
```

### 2. Weekly Workflow (Manual)

**Every Monday Morning**:
1. Review queue at `/admin/queue`
2. Approve/reject pending items (target: <10 pending)
3. Check for stale wiki pages (not updated in 90 days)
4. Review auto-approved items from last week

### 3. Monthly Workflow (Manual)

**First Monday of Month**:
1. Run comprehensive knowledge audit
2. Review all wiki pages by project
3. Archive outdated pages
4. Update "Last reviewed" timestamps
5. Check for orphaned pages (no source tracking)

### 4. Source Change Detection (Automated)

```typescript
// Detect when source material changes
async function detectSourceChanges() {
  // For each published wiki page
  const pages = await getPublishedPages();

  for (const page of pages) {
    if (page.source_type === 'notion') {
      // Check if Notion page was updated
      const notionPage = await notion.pages.retrieve({
        page_id: page.source_id
      });

      const sourceLastEdited = new Date(notionPage.last_edited_time);
      const wikiLastUpdated = new Date(page.updated_at);

      if (sourceLastEdited > wikiLastUpdated) {
        // Source changed! Flag for review
        await flagForReview(page.id, 'source_updated');
      }
    }

    // Similar logic for Gmail, Calendar
  }
}
```

---

## 📊 Knowledge Quality Metrics

### Dashboard at `/admin/knowledge-health`

**Metrics to Track**:

1. **Extraction Metrics**
   - Total items extracted (all time)
   - Items extracted (last 7/30 days)
   - Extraction rate by source (Notion, Gmail, Calendar)
   - Average confidence score

2. **Review Metrics**
   - Pending queue size
   - Average time to review
   - Approval rate (approved / total reviewed)
   - Auto-approval rate

3. **Freshness Metrics**
   - Pages updated in last 30 days
   - Pages not updated in 90+ days (stale)
   - Pages with source changes pending review
   - Average days since last update

4. **Source Tracking**
   - Pages with source tracking vs orphaned
   - Pages by source type (Notion, Gmail, Calendar)
   - Source sync health (last sync time, errors)

5. **Usage Metrics** (Future)
   - Page views (top 10 pages)
   - Search queries (what people look for)
   - Most linked-to pages
   - Dead links / broken references

---

## 🚀 Implementation Roadmap

### ✅ Phase 1: Foundation (Complete)
- [x] Database schema (wiki_pages, knowledge_extraction_queue)
- [x] Notion scanner
- [x] Admin review queue
- [x] Auto-approval system
- [x] Public wiki display

### ✅ Phase 2: Multi-Source (Complete)
- [x] Gmail OAuth setup
- [x] Gmail scanner with History API
- [x] Incremental sync
- [x] Source deduplication
- [x] Fix Supabase client imports

### 🚧 Phase 3: Calendar Integration (Next)
- [ ] Google Calendar OAuth setup
- [ ] Calendar scanner implementation
- [ ] Timeline view UI
- [ ] Pattern detection algorithm
- [ ] Deadline tracking system
- [ ] Historical event knowledge extraction

### 📋 Phase 4: Knowledge Lifecycle (Priority)
- [ ] Source change detection
- [ ] Automated freshness checks
- [ ] Review workflows (daily/weekly/monthly)
- [ ] Staleness alerts
- [ ] Archive system
- [ ] Version history

### 📈 Phase 5: Intelligence & Insights (Future)
- [ ] Knowledge quality dashboard
- [ ] Usage analytics
- [ ] Semantic search across all sources
- [ ] Related content suggestions
- [ ] Knowledge graph visualization
- [ ] Small language model rollups (as requested)

---

## 🛠️ Technical Fixes Needed

### Immediate (This Week)

1. **OpenAI API Quota**
   - ✅ **Workaround Active**: Keyword-based confidence working
   - ⚠️ **Action Needed**: Add credits to OpenAI account OR
   - 💡 **Alternative**: Use local embeddings (sentence-transformers) OR
   - 💡 **Alternative**: Use Anthropic Claude for embeddings

2. **Null Content in Queue**
   - Issue: `extracted_knowledge` field is NULL for some items
   - Impact: Auto-approval fails with constraint violation
   - Fix: Ensure content extraction doesn't return null
   - Status: Needs investigation

3. **Gmail Scanner Enhancement**
   - Current: Only scans 1 email (recent messages limit)
   - Needed: Scan all unread, or last N days
   - Fix: Adjust `maxResults` parameter

### Soon (This Month)

4. **Scheduled Scanning**
   - Set up cron jobs or Vercel cron
   - Daily Notion scan
   - Hourly Gmail scan
   - Weekly Calendar scan (when implemented)

5. **Source Change Detection**
   - Background job to check for source updates
   - Flag wiki pages for re-review
   - Notify via email/Slack when important pages change

6. **Knowledge Health Dashboard**
   - Build `/admin/knowledge-health` page
   - Show all metrics listed above
   - Alerts for stale content, large queue, sync failures

---

## 🎯 Success Criteria

### Month 1 (Current)
- ✅ Gmail scanner operational
- ✅ Notion scanner operational (with keyword confidence)
- ✅ Review queue functional
- ⚠️ 50+ knowledge items extracted (currently 13+)
- ⚠️ Auto-approval working (blocked by null content)

### Month 2 (January 2026)
- [ ] Calendar integration live
- [ ] Timeline view showing upcoming events
- [ ] Pattern detection identifying recurring meetings
- [ ] Source change detection running daily
- [ ] Knowledge health dashboard operational

### Month 3 (February 2026)
- [ ] 100+ wiki pages published
- [ ] <5 items in review queue (fast turnaround)
- [ ] 80%+ pages reviewed in last 90 days
- [ ] Automated daily/weekly workflows
- [ ] Small language model rollup reports

---

## 📚 Documentation

**For Users**:
- `/wiki/README.md` - How to use the wiki
- `/wiki/contributing.md` - How to contribute knowledge

**For Admins**:
- `/admin/queue` - Review pending knowledge
- `/admin/knowledge-health` - System health dashboard
- This doc - Complete system design

**For Developers**:
- `GMAIL_OAUTH_SETUP.md` - Gmail integration setup
- `CALENDAR_OAUTH_SETUP.md` - Calendar integration setup (to be created)
- `IMPLEMENTATION_SUMMARY.md` - Technical implementation details

---

**Last Updated**: 2025-12-26
**Next Review**: 2026-01-26
**Maintained By**: Ben Knight + Claude AI
