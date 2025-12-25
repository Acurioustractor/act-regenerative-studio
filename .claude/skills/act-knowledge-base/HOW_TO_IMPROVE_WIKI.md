# How to Understand & Improve the ACT Living Wiki

## 🎯 What the System Does Right Now

The Living Wiki automatically:
1. **Scans** your Notion workspace daily
2. **Detects** which pages contain reusable knowledge
3. **Extracts** that knowledge using AI (Mistral 7B)
4. **Categorizes** it as Principle/Method/Practice/Procedure/Guide/Template
5. **Queues** it for human review
6. **Publishes** approved knowledge to a searchable wiki

## 📊 Understanding What Notion Data You Have Access To

### After you set up your Notion integration, run:

```bash
node scripts/test-notion-connection.mjs
```

This will show you:
- **All pages** the integration can see
- **All databases** it can access
- **Sample content** from the first page
- **Properties** of each database

### Example Output:

```
✅ Found 12 accessible pages:

📄 Team Onboarding Process
   Type: Page
   Last edited: 2024-12-20
   URL: https://notion.so/...

📊 Project Database
   Type: Database
   Properties:
      - Name (title)
      - Status (select)
      - Owner (person)
      - Notes (rich_text)
```

## 🔍 How the Scanner Decides What's "Knowledge"

The scanner looks for **knowledge signals** with confidence scoring:

### Detection Algorithm (from [notion-scanner.ts](../../../src/lib/knowledge/notion-scanner.ts:220))

**Principle Detection** (+0.3 confidence):
- Keywords: "principle", "value", "belief", "philosophy", "why we", "core to"
- Example: "Community Ownership" → 📚 Principle

**Method Detection** (+0.3 confidence):
- Keywords: "framework", "approach", "methodology", "model", "strategy"
- Example: "LCAA Framework" → 🛠️ Method

**Practice Detection** (+0.3 confidence):
- Keywords: "how we", "our practice", "regularly", "routine", "meeting"
- Example: "Weekly Team Check-ins" → ⚙️ Practice

**Procedure Detection** (+0.3 confidence):
- Keywords: "step", "process", "procedure", "workflow", "how to", "guide", "checklist"
- Example: "How to Onboard a New Partner" → 📋 Procedure

**Structure Bonuses:**
- Has headings (##, ###): +0.1
- Has lists (-, 1.): +0.1

**Threshold:** If total confidence > 0.2, it's worth reviewing

### What Gets Filtered Out

Pages are **skipped** if the title matches:
- "untitled", "test", "scratch", "todo", "notes"
- "meeting notes" (too informal)
- "personal", "draft", "admin"

Source: [notion-scanner.ts:260](../../../src/lib/knowledge/notion-scanner.ts:260)

## 🎨 How to Improve Detection Quality

### 1. Structure Your Notion Pages Better

**Before (low confidence):**
```
Team meeting - discussed new process
- Bob said we should do X
- Alice agreed
- Will follow up next week
```

**After (high confidence):**
```
## Weekly Team Meetings

### Our Practice
We hold team meetings every Tuesday at 10am.

### Why We Do This
Regular check-ins ensure alignment and surface blockers early.

### How It Works
1. Round-robin updates (5 min each)
2. Blockers discussion (15 min)
3. Decisions requiring consent (10 min)
```

### 2. Use Templates in Notion

Create templates for each knowledge type:

**Procedure Template:**
```
# [Procedure Name]

## Purpose
Why this procedure exists

## Prerequisites
What you need before starting

## Steps
1. First step
2. Second step
3. Third step

## Tips
- Helpful tip
- Common pitfall to avoid

## Related
- Link to principle this supports
- Link to practice this is part of
```

### 3. Tag Knowledge Appropriately in Notion

Add Notion properties to help the scanner:
- **Type**: Select (Principle/Method/Practice/Procedure)
- **Projects**: Multi-select (JusticeHub, Empathy Ledger, etc.)
- **Status**: Select (Published/Draft) - scanner skips drafts

### 4. Adjust Confidence Thresholds

If you're getting too many false positives:

Edit [notion-scanner.ts:250](../../../src/lib/knowledge/notion-scanner.ts:250):

```typescript
return {
  isKnowledge: confidence > 0.3,  // Increase from 0.2 to 0.3 for stricter filtering
  suggestedType,
  suggestedTags,
  confidence: Math.min(confidence, 1.0),
};
```

**Recommendations:**
- `0.2` = Liberal (catches more, some noise) - **Current default**
- `0.3` = Balanced
- `0.5` = Conservative (only high-confidence)

### 5. Add Custom Keywords

If you use specific ACT terminology, add it to the detection:

Edit [notion-scanner.ts:220-240](../../../src/lib/knowledge/notion-scanner.ts:220):

```typescript
// Add your own keywords
const principleKeywords = [
  'principle', 'value', 'belief', 'philosophy',
  'core to', 'foundational',
  'OCAP', 'sovereignty',  // ACT-specific
];

const practiceKeywords = [
  'how we', 'our practice', 'regularly',
  'check-in', 'standup', 'retrospective',  // Your team's terms
];
```

## 📈 Monitoring & Improving Over Time

### 1. Review Scan Logs

After each daily scan, check the logs:

```bash
# View today's scan
cat logs/wiki-scans/scan-$(date +%Y-%m-%d).json

# Pretty print
cat logs/wiki-scans/scan-$(date +%Y-%m-%d).json | jq
```

**What to look for:**
- `scanned`: How many pages found
- `extracted`: How many passed AI extraction
- `errors`: Any failures

### 2. Analyze Confidence Scores

Query the database to see confidence distribution:

```sql
-- Average confidence by source
SELECT
  source_type,
  AVG(confidence_score) as avg_confidence,
  COUNT(*) as total
FROM knowledge_extraction_queue
GROUP BY source_type;

-- High confidence items
SELECT source_title, confidence_score, suggested_type
FROM knowledge_extraction_queue
WHERE confidence_score > 0.7
ORDER BY confidence_score DESC;

-- Low confidence items (may need better Notion structure)
SELECT source_title, confidence_score
FROM knowledge_extraction_queue
WHERE confidence_score < 0.3
ORDER BY confidence_score ASC;
```

### 3. Track Approval Rate

```sql
-- What % of extractions get approved?
SELECT
  status,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM knowledge_extraction_queue
GROUP BY status;
```

**Target:** >60% approval rate means good quality

## 🚀 Advanced Improvements

### 1. Custom AI Prompts

The AI extraction prompt is in [extract/route.ts:24](../../../src/app/api/knowledge/extract/route.ts:24)

You can customize it to:
- Add ACT-specific context
- Include examples of good extractions
- Emphasize certain values

Example addition:
```typescript
const EXTRACTION_PROMPT = `You are analyzing content from ACT's daily tools...

IMPORTANT ACT CONTEXT:
- ACT follows OCAP® principles (data sovereignty)
- Community ownership means communities own their innovations
- Beautiful obsolescence means designing for eventual independence

Analyze this content...`;
```

### 2. Multi-Source Knowledge

The scanner can detect knowledge from multiple sources:

**Notion** (✅ Built):
- Team pages, databases, meeting notes

**Gmail** (🔜 Next):
```typescript
// Scan emails tagged "decision" or "process"
const gmailScanner = new GmailScanner();
await gmailScanner.scanLabels(['decisions', 'processes']);
```

**Calendar** (🔜 Future):
```typescript
// Recurring meetings reveal practices
const calendarScanner = new CalendarScanner();
await calendarScanner.scanRecurringEvents();
```

### 3. Knowledge Graph

Link related knowledge automatically:

```typescript
// When extracting, detect relationships
const relationships = detectRelationships(content);
// "This practice implements the Community Ownership principle"

// Save to wiki_page_links table
await supabase.from('wiki_page_links').insert({
  from_page_id: practice.id,
  to_page_id: principle.id,
  relationship_type: 'implements',
});
```

### 4. Auto-Update Detection

Detect when Notion pages change significantly:

```typescript
// Compare extracted content with current wiki page
const similarity = calculateSimilarity(
  currentWikiPage.content,
  newExtractionContent
);

if (similarity < 0.8) {
  // Content changed significantly
  await flagForReview(wikiPage.id);
}
```

### 5. Knowledge Gap Detection

Find missing knowledge:

```sql
-- Projects with no procedures
SELECT DISTINCT unnest(projects) as project
FROM wiki_pages
WHERE 'justicehub' = ANY(projects)
EXCEPT
SELECT DISTINCT unnest(projects)
FROM wiki_pages
WHERE page_type = 'procedure';
```

## 🎓 Understanding the Code

### Key Files to Know

**Scanner Logic:**
- [notion-scanner.ts](../../../src/lib/knowledge/notion-scanner.ts) - Main scanner class
  - `scanWorkspace()` - Finds new pages
  - `extractFromPage()` - Processes each page
  - `detectKnowledgeSignals()` - Confidence scoring

**API Endpoints:**
- [scan-notion/route.ts](../../../src/app/api/knowledge/scan-notion/route.ts) - Trigger scans
- [extract/route.ts](../../../src/app/api/knowledge/extract/route.ts) - AI extraction

**Admin UI:**
- [wiki-scanner/page.tsx](../../../src/app/admin/wiki-scanner/page.tsx) - Review interface

**Automation:**
- [daily-wiki-scan.mjs](../../../scripts/daily-wiki-scan.mjs) - Cron job

### How to Add a New Source (e.g., Gmail)

1. **Create scanner class:**
```typescript
// src/lib/knowledge/gmail-scanner.ts
export class GmailScanner {
  async scanLabels(labels: string[]): Promise<KnowledgeExtraction[]> {
    // Fetch emails with labels
    // Convert to markdown
    // Detect knowledge signals
    // Return extractions
  }
}
```

2. **Add API endpoint:**
```typescript
// src/app/api/knowledge/scan-gmail/route.ts
export async function POST() {
  const scanner = new GmailScanner();
  const extractions = await scanner.scanLabels(['decisions', 'processes']);
  await saveToQueue(extractions);
  return NextResponse.json({ success: true });
}
```

3. **Update admin UI:**
Add "Scan Gmail" button next to "Scan Notion"

4. **Add to daily script:**
```typescript
// scripts/daily-wiki-scan.mjs
await fetch(`${API_BASE}/api/knowledge/scan-gmail`, { method: 'POST' });
```

## 📊 Success Metrics

Track these to measure improvement:

**Quality Metrics:**
- Average confidence score (target: >0.6)
- Approval rate (target: >60%)
- False positive rate (target: <20%)

**Usage Metrics:**
- Wiki page views (growing)
- Search queries (what people look for)
- Page edits (community contributions)

**Impact Metrics:**
- Reduced "how do we do X?" questions
- Faster onboarding (measured in days)
- Knowledge referenced in meetings

## 🔧 Quick Tweaks You Can Make Now

### 1. Exclude Certain Pages

```typescript
// notion-scanner.ts:260
const skipKeywords = [
  'untitled', 'test', 'scratch', 'todo',
  'personal', 'draft',
  'meeting notes',  // Too informal
  'admin',
  'budget',  // Add your own
  'invoice',
];
```

### 2. Change Scan Frequency

```typescript
// notion-scanner.ts:330
// Currently: 7 days lookback on first run
const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 30);  // Change to 30 days
```

### 3. Adjust AI Temperature

```typescript
// extract/route.ts:85
options: {
  temperature: 0.1,  // Lower = more consistent (was 0.3)
  top_p: 0.9,
}
```

### 4. Add More Page Types

```typescript
// In database migration, add to page_type enum:
page_type TEXT CHECK (page_type IN (
  'principle', 'method', 'practice', 'procedure',
  'guide', 'template',
  'case-study', 'example', 'reference'  // New types
))
```

---

## 💡 Questions to Ask Yourself

**About your Notion workspace:**
- What pages contain reusable knowledge vs one-off notes?
- How can you structure pages more consistently?
- What templates would help?

**About detection quality:**
- Are you getting too many false positives? (Increase threshold)
- Missing important pages? (Lower threshold, add keywords)
- Wrong categorization? (Adjust AI prompt, add examples)

**About the wiki:**
- What knowledge is most searched for?
- What's missing from the wiki?
- How can you make it more discoverable?

---

## 🆘 Need Help?

1. **Run the test script** to see what Notion data you have access to
2. **Check the logs** to understand what's being scanned
3. **Review confidence scores** to tune detection
4. **Ask questions** about specific pages or behaviors

The system is designed to be customizable - don't hesitate to tweak it for your team's needs!
