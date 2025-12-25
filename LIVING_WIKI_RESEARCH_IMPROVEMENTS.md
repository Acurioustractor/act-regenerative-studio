# ACT Living Wiki - Research-Backed Improvements

**Research Date:** December 25, 2024
**Purpose:** Implement best practices from industry leaders to improve the Living Wiki system

---

## 🎯 Executive Summary

Research into modern knowledge management systems reveals **7 key improvement areas** for the ACT Living Wiki:

1. **Better confidence scoring** using embedding similarity
2. **Tacit knowledge capture** from conversations and meetings
3. **Auto-update mechanisms** via CI/CD-style pipelines
4. **Enhanced categorization** using supervised ML
5. **Review cadence automation** with Slack/email nudges
6. **Knowledge graph connections** between related concepts
7. **Multi-source unified search** across all platforms

---

## 📊 Current vs. Best Practices Comparison

| Feature | ACT Living Wiki (Current) | Industry Best Practice | Priority |
|---------|---------------------------|------------------------|----------|
| **Confidence Scoring** | Simple keyword matching (0.0-1.0) | Embedding similarity + LLM self-assessment | 🔴 High |
| **Knowledge Types** | 4 types (PMPP framework) | ✅ Good - matches industry | ✅ Keep |
| **Review Cadence** | Manual tracking with `next_review_due` | Automated Slack/email nudges | 🟡 Medium |
| **Source Coverage** | Notion only (13 items) | Multi-source (Notion, Slack, Gmail, Calendar) | 🔴 High |
| **Tacit Knowledge** | Not captured | Storytelling, shadowing, conversation extraction | 🔴 High |
| **Auto-Updates** | Manual scan trigger | CI/CD pipeline integration, webhook triggers | 🟡 Medium |
| **Search** | Basic full-text (planned) | Natural language + semantic search | 🟡 Medium |
| **Versioning** | Database-tracked versions | ✅ Good - matches Git-style patterns | ✅ Keep |

---

## 🔬 Research Findings by Category

### 1. Confidence Scoring & Embedding Similarity

**Current Approach:**
```typescript
// Simple keyword matching
if (content.includes('principle')) confidence += 0.3;
if (content.includes('framework')) confidence += 0.2;
```

**Research-Backed Improvement:**
According to [Amazon Science research (June 2025)](https://www.amazon.science/publications/confidence-scoring-for-llm-generated-sql-in-supply-chain-data-extraction), embedding-based similarity methods demonstrate strong discriminative power:

```typescript
// Improved: Embedding similarity approach
async function calculateConfidence(extracted: string, sourceContent: string) {
  // 1. Compute embeddings
  const extractedEmbedding = await embed(extracted);
  const sourceEmbedding = await embed(sourceContent);

  // 2. Cosine similarity
  const similarity = cosineSimilarity(extractedEmbedding, sourceEmbedding);

  // 3. Convert to percentage using logistic regression
  const confidence = 1 / (1 + Math.exp(-10 * (similarity - 0.5)));

  return confidence;
}
```

**Key Finding:** [Research shows](https://sefiks.com/2025/09/02/from-embeddings-to-confidence-scores-converting-similarity-to-percentages/) that LLMs are often overconfident (self-reported scores unreliable), so embedding similarity is more trustworthy.

**Implementation:**
- Use OpenAI `text-embedding-3-small` or Mistral embeddings
- Store embeddings in PostgreSQL with `pgvector` extension
- Compare extracted knowledge against source for semantic similarity

---

### 2. Tacit Knowledge Capture

**Current Gap:** The Living Wiki only captures explicit knowledge (documented Notion pages).

**Research Finding:** Studies show that [tacit knowledge accounts for ~80% of organizational knowledge](https://www.phpkb.com/kb/article/capturing-and-converting-tacit-knowledge-for-effective-knowledge-management-343.html).

**What is Tacit Knowledge?**
- Personal experiences and insights
- "How we actually do things" vs. "how we document we do things"
- Conversations, stories, WhatsApp exchanges
- Implicit decision-making patterns

**Capture Methods from Research:**

1. **Storytelling** ([Helpjuice](https://helpjuice.com/blog/tacit-knowledge))
   - Extract stories from Slack/WhatsApp conversations
   - Identify patterns like "When X happened, we did Y"
   - Tag as "Practice" or "Procedure"

2. **Social Interaction Mining** ([Elium](https://elium.com/blog/tacit-knowledge-how-to-capture-and-codify-for-employees/))
   - Analyze recurring meeting topics from Calendar
   - Extract action items from GHL notes
   - Identify repeated questions in Slack

3. **Visualization** ([SC Training](https://training.safetyculture.com/blog/tacit-vs-explicit-knowledge/))
   - Convert flowcharts from images to knowledge
   - Extract diagrams from Notion pages

**Implementation for ACT:**
```sql
-- Add tacit vs explicit flag
ALTER TABLE wiki_pages
ADD COLUMN knowledge_origin VARCHAR(20) DEFAULT 'explicit'
CHECK (knowledge_origin IN ('explicit', 'tacit'));

-- Track conversation sources
ALTER TABLE wiki_pages
ADD COLUMN conversation_thread_url TEXT;
```

**Example Tacit Knowledge Extraction:**
```
WhatsApp Thread: "How do we handle late RSVPs to community dinners?"
→ Extract as: Practice "ACT Monthly Dinner RSVP Flexibility"
→ Content: "When someone RSVPs late, we check if we have extra..."
→ Confidence: 0.6 (extracted from conversation)
→ Source: WhatsApp thread URL
```

---

### 3. Auto-Update Mechanisms (Living Documentation)

**Current Approach:** Manual API trigger for Notion scan.

**Research-Backed Patterns:**

#### Pattern 1: CI/CD Pipeline Integration
[Living Documentation research](https://www.oreilly.com/library/view/living-documentation-continuous/9780134689418/) shows documentation should update automatically when source changes.

**For ACT Wiki:**
```yaml
# .github/workflows/wiki-sync.yml
name: Living Wiki Auto-Update
on:
  schedule:
    - cron: '0 2 * * *'  # Daily 2am
  webhook:
    types: [notion_page_updated]

jobs:
  sync-knowledge:
    runs-on: ubuntu-latest
    steps:
      - name: Scan Notion for changes
        run: curl -X POST https://act.farm/api/knowledge/scan-notion

      - name: Process pending extractions
        run: node scripts/auto-approve-high-confidence.mjs
```

#### Pattern 2: Webhook-Based Real-Time Updates
According to [AI-Assisted Documentation research](https://medium.com/ux-management/ai-assisted-design-documentation-how-to-build-living-style-guides-that-update-themselves-e0c4fd81433b), modern systems use webhooks:

```typescript
// /api/webhooks/notion
export async function POST(request: Request) {
  const event = await request.json();

  if (event.type === 'page.updated') {
    // Check if page exists in wiki
    const existing = await supabase
      .from('wiki_pages')
      .select('*')
      .eq('source_urls', event.page_url)
      .single();

    if (existing) {
      // Re-scan and flag for review
      await flagForReview(existing.id, 'source_updated');
    }
  }
}
```

#### Pattern 3: Automated Staleness Detection
[Nulab research](https://nulab.com/learn/project-management/agile-teams-living-documentation/) shows successful teams use scripts to flag stale pages:

```typescript
// scripts/flag-stale-pages.mjs
const STALENESS_THRESHOLD_DAYS = 90;

const { data: stalePages } = await supabase
  .from('wiki_pages')
  .select('*')
  .lt('updated_at', new Date(Date.now() - STALENESS_THRESHOLD_DAYS * 24 * 60 * 60 * 1000))
  .eq('status', 'active');

// Send Slack notification to page owners
for (const page of stalePages) {
  await slackNotify({
    channel: '#wiki-maintenance',
    text: `📄 "${page.title}" hasn't been updated in ${STALENESS_THRESHOLD_DAYS} days. Please review.`,
    actions: [
      { text: 'Mark as Current', url: `/wiki/${page.slug}/verify` },
      { text: 'Update Needed', url: `/wiki/${page.slug}/edit` }
    ]
  });
}
```

---

### 4. Enhanced Categorization with Machine Learning

**Current Approach:** Simple keyword matching for PMPP categorization.

**Research Findings:** [Document classification research](https://nanonets.com/blog/document-classification/) shows modern systems use supervised ML with 95%+ accuracy.

#### Supervised Classification Approach

**1. Feature Extraction:**
```typescript
// Use TF-IDF or embeddings
import { TfIdf } from 'natural';

function extractFeatures(content: string) {
  const tfidf = new TfIdf();
  tfidf.addDocument(content);

  return {
    topTerms: tfidf.listTerms(0).slice(0, 20),
    embedding: await getEmbedding(content),
    structuralFeatures: {
      hasHeadings: content.includes('##'),
      hasLists: content.includes('- '),
      hasNumberedSteps: /\d+\.\s/.test(content),
      wordCount: content.split(/\s+/).length
    }
  };
}
```

**2. Training Data from Human Approvals:**
```typescript
// Learn from your approval decisions
async function trainClassifier() {
  // Get approved items as training data
  const { data: approved } = await supabase
    .from('knowledge_extraction_queue')
    .select('raw_content, suggested_type, approved_type')
    .eq('status', 'approved')
    .not('approved_type', 'is', null);

  // Build training set
  const trainingData = approved.map(item => ({
    features: extractFeatures(item.raw_content),
    label: item.approved_type || item.suggested_type
  }));

  // Train simple classifier
  const model = await trainNaiveBayes(trainingData);

  // Save model
  await fs.writeFile('models/pmpp-classifier.json', JSON.stringify(model));
}
```

**3. Multi-Label Classification:**
According to [Wikipedia on Document Classification](https://en.wikipedia.org/wiki/Document_classification), some documents fit multiple categories:

```typescript
// A page can be both a Method AND a Procedure
type KnowledgeType = 'principle' | 'method' | 'practice' | 'procedure';

interface Classification {
  primaryType: KnowledgeType;
  secondaryTypes: KnowledgeType[];
  confidence: {
    [K in KnowledgeType]?: number;
  };
}
```

---

### 5. Review Cadence Automation

**Current Approach:** Database field `next_review_due` (calculated but not acted upon).

**Research-Backed Pattern:** [Slack's knowledge management guide](https://slack.com/blog/transformation/knowledge-management-tools) recommends automated review workflows.

#### Implementation: Slack-Based Review Nudges

**1. Daily Review Bot:**
```typescript
// scripts/daily-review-bot.mjs
import { WebClient } from '@slack/web-api';

const slack = new WebClient(process.env.SLACK_BOT_TOKEN);

async function sendReviewReminders() {
  // Find pages due for review
  const { data: duePages } = await supabase
    .from('wiki_pages')
    .select('*, page_owner_email')
    .lt('next_review_due', new Date().toISOString())
    .eq('status', 'active');

  for (const page of duePages) {
    // Find Slack user by email
    const user = await slack.users.lookupByEmail({ email: page.page_owner_email });

    // Send DM
    await slack.chat.postMessage({
      channel: user.user.id,
      text: `⏰ Time to review: "${page.title}"`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*${page.title}* is due for review\n\nLast reviewed: ${formatDate(page.last_reviewed_at)}\nReview frequency: Every ${page.review_frequency_days} days`
          }
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: { type: 'plain_text', text: '✅ Mark as Current' },
              url: `${process.env.WIKI_URL}/wiki/${page.slug}/verify`
            },
            {
              type: 'button',
              text: { type: 'plain_text', text: '✏️ Update Now' },
              url: `${process.env.WIKI_URL}/wiki/${page.slug}/edit`
            }
          ]
        }
      ]
    });
  }
}

// Run daily
setInterval(sendReviewReminders, 24 * 60 * 60 * 1000);
```

**2. Quarterly Review Dashboard:**
[Best practice research](https://www.c2experience.com/blog/nine-best-practices-for-managing-software-releases-and-upgrades) shows quarterly reviews work better than continuous nudging:

```typescript
// /api/admin/quarterly-review
export async function GET() {
  const { data: stats } = await supabase.rpc('get_review_stats');

  return {
    totalPages: stats.total,
    dueForReview: stats.due,
    upToDate: stats.current,
    stale: stats.stale,
    byOwner: stats.by_owner,
    byProject: stats.by_project
  };
}
```

---

### 6. Knowledge Graph Connections

**Current Gap:** Pages are isolated - no connections between related knowledge.

**Research Finding:** [Neo4j's Knowledge Graph research](https://neo4j.com/blog/developer/knowledge-graph-extraction-challenges/) shows connected knowledge is 3x more useful.

#### Pattern: Automatic Relationship Extraction

**1. Entity Recognition:**
```typescript
import { Client as NotionClient } from '@notionhq/client';

async function extractEntities(page: WikiPage) {
  const entities = {
    projects: [] as string[],
    people: [] as string[],
    organizations: [] as string[],
    methods: [] as string[],
    relatedConcepts: [] as string[]
  };

  // Extract @mentions of other wiki pages
  const pageMatches = page.content.match(/\[\[([^\]]+)\]\]/g);
  if (pageMatches) {
    entities.relatedConcepts = pageMatches.map(m => m.slice(2, -2));
  }

  // Extract project references
  const projectMatches = page.content.match(/(JusticeHub|Empathy Ledger|The Harvest|ACT Farm)/gi);
  if (projectMatches) {
    entities.projects = [...new Set(projectMatches)];
  }

  return entities;
}
```

**2. Create Relationship Graph:**
```sql
-- New table for knowledge relationships
CREATE TABLE wiki_page_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_page_id UUID REFERENCES wiki_pages(id) ON DELETE CASCADE,
  target_page_id UUID REFERENCES wiki_pages(id) ON DELETE CASCADE,
  relationship_type VARCHAR(50) NOT NULL, -- 'implements', 'extends', 'contradicts', 'related_to'
  confidence DECIMAL(3,2) DEFAULT 0.5,
  auto_detected BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(source_page_id, target_page_id, relationship_type)
);

CREATE INDEX idx_relationships_source ON wiki_page_relationships(source_page_id);
CREATE INDEX idx_relationships_target ON wiki_page_relationships(target_page_id);
```

**3. LLM-Based Relationship Detection:**
According to [IBM Research](https://research.ibm.com/blog/knowledge-graph-ai), modern KG systems use LLMs to detect relationships:

```typescript
async function detectRelationships(page: WikiPage, allPages: WikiPage[]) {
  const prompt = `
Given this knowledge page:
Title: ${page.title}
Content: ${page.content.substring(0, 500)}...

And these other pages: ${allPages.map(p => p.title).join(', ')}

Identify relationships in this format:
- [Page Title] IMPLEMENTS [This Page] (confidence: 0.8)
- [Page Title] EXTENDS [This Page] (confidence: 0.6)

Relationship types: implements, extends, contradicts, related_to, prerequisite
`;

  const response = await mistral.chat({
    model: 'mistral-small',
    messages: [{ role: 'user', content: prompt }]
  });

  // Parse and save relationships
  const relationships = parseRelationships(response.content);

  for (const rel of relationships) {
    await supabase.from('wiki_page_relationships').insert({
      source_page_id: findPageId(rel.source),
      target_page_id: page.id,
      relationship_type: rel.type,
      confidence: rel.confidence,
      auto_detected: true
    });
  }
}
```

**4. Visualize Knowledge Graph:**
```typescript
// /wiki/graph
export default function KnowledgeGraphPage() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  useEffect(() => {
    async function loadGraph() {
      const { data: pages } = await supabase.from('wiki_pages').select('*');
      const { data: relationships } = await supabase.from('wiki_page_relationships').select('*');

      setNodes(pages.map(p => ({ id: p.id, label: p.title, group: p.page_type })));
      setEdges(relationships.map(r => ({
        from: r.source_page_id,
        to: r.target_page_id,
        label: r.relationship_type,
        dashes: r.confidence < 0.6
      })));
    }

    loadGraph();
  }, []);

  return <ForceGraph2D graphData={{ nodes, links: edges }} />;
}
```

---

### 7. Multi-Source Unified Search

**Current Gap:** Can only search Notion.

**Research Finding:** [Best knowledge base bots](https://clearfeed.ai/blogs/8-best-knowledge-base-bots-for-slack-in-2025) pull from Google Drive, Confluence, Notion, wikis, and Slack threads.

#### Pattern: Unified Search Index

**1. Normalize All Sources:**
```typescript
interface UnifiedKnowledgeItem {
  id: string;
  title: string;
  content: string;
  source: 'notion' | 'gmail' | 'slack' | 'calendar' | 'ghl' | 'whatsapp';
  sourceUrl: string;
  timestamp: Date;
  participants: string[];
  embedding: number[]; // 1536-dim vector
  metadata: Record<string, any>;
}
```

**2. Create Unified Search API:**
```typescript
// /api/search
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  // Generate query embedding
  const queryEmbedding = await getEmbedding(query);

  // Search across all sources using vector similarity
  const { data: results } = await supabase.rpc('unified_search', {
    query_embedding: queryEmbedding,
    match_threshold: 0.7,
    match_count: 20
  });

  // Group by source
  return {
    notion: results.filter(r => r.source === 'notion'),
    slack: results.filter(r => r.source === 'slack'),
    gmail: results.filter(r => r.source === 'gmail'),
    // ... etc
  };
}
```

**3. PostgreSQL Function for Vector Search:**
```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE unified_knowledge_index (
  id UUID PRIMARY KEY,
  title TEXT,
  content TEXT,
  source TEXT,
  source_url TEXT,
  embedding vector(1536),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX ON unified_knowledge_index USING ivfflat (embedding vector_cosine_ops);

-- Unified search function
CREATE OR REPLACE FUNCTION unified_search(
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  content TEXT,
  source TEXT,
  source_url TEXT,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    unified_knowledge_index.id,
    unified_knowledge_index.title,
    unified_knowledge_index.content,
    unified_knowledge_index.source,
    unified_knowledge_index.source_url,
    1 - (unified_knowledge_index.embedding <=> query_embedding) as similarity
  FROM unified_knowledge_index
  WHERE 1 - (unified_knowledge_index.embedding <=> query_embedding) > match_threshold
  ORDER BY unified_knowledge_index.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
```

---

## 🎯 Recommended Implementation Roadmap

### Phase 1: Quick Wins (1-2 weeks)
1. ✅ **Enhanced Queue Viewer** (DONE!)
2. **Embedding-Based Confidence Scoring**
   - Add `pgvector` extension to PostgreSQL
   - Store embeddings for all extractions
   - Replace keyword matching with similarity scores

3. **Slack Review Reminders**
   - Create Slack bot
   - Daily check for due pages
   - Send review nudges

### Phase 2: Multi-Source Integration (2-4 weeks)
4. **Gmail Scanner**
   - Extract knowledge from email threads
   - Focus on decision emails, planning emails

5. **Slack Scanner**
   - Scan important channels (#act-team, #decisions)
   - Extract recurring discussions

6. **Calendar Scanner**
   - Extract meeting patterns
   - Identify recurring practices from meeting series

### Phase 3: Intelligence Layer (4-6 weeks)
7. **Knowledge Graph**
   - Extract relationships between pages
   - Build visual graph explorer

8. **Unified Search**
   - Create `unified_knowledge_index` table
   - Implement vector search across all sources

9. **Supervised ML Classifier**
   - Train on approved items
   - Improve PMPP categorization accuracy

### Phase 4: Automation (6-8 weeks)
10. **CI/CD Integration**
    - GitHub Actions for daily scans
    - Webhook handlers for real-time updates

11. **Auto-Approval for High Confidence**
    - Auto-approve items with >90% confidence
    - Human review only for uncertain items

12. **Staleness Detection**
    - Flag outdated pages
    - Suggest review schedules

---

## 📚 Key Research Sources

### Confidence Scoring & Embeddings
- [Confidence Scoring for LLM-Generated SQL - Amazon Science](https://www.amazon.science/publications/confidence-scoring-for-llm-generated-sql-in-supply-chain-data-extraction)
- [Converting Embeddings to Confidence Scores - Sefik Serengil](https://sefiks.com/2025/09/02/from-embeddings-to-confidence-scores-converting-similarity-to-percentages/)
- [Knowledge Graph Confidence-Aware Embedding - ScienceDirect](https://www.sciencedirect.com/science/article/abs/pii/S0893608024005252)

### Living Documentation Patterns
- [Living Documentation: Continuous Knowledge Sharing - O'Reilly](https://www.oreilly.com/library/view/living-documentation-continuous/9780134689418/)
- [Self-Updating Documentation: 7 AI-Powered Systems - CodeCondo](https://codecondo.com/self-updating-documentation-ai-systems/)
- [Why Agile Teams Need Living Documentation - Nulab](https://nulab.com/learn/project-management/agile-teams-living-documentation/)

### Knowledge Management Best Practices
- [Making Internal Knowledge Searchable with AI - Quidget](https://quidget.ai/blog/ai-automation/notion-google-docs-or-slack-heres-how-to-make-your-internal-knowledge-searchable-with-ai/)
- [8 Best Knowledge Base Bots for Slack - ClearFeed](https://clearfeed.ai/blogs/8-best-knowledge-base-bots-for-slack-in-2025)
- [Knowledge Management Tools - Slack Blog](https://slack.com/blog/transformation/knowledge-management-tools)

### Tacit vs. Explicit Knowledge
- [Capturing and Converting Tacit Knowledge - PHPKB](https://www.phpkb.com/kb/article/capturing-and-converting-tacit-knowledge-for-effective-knowledge-management-343.html)
- [Tacit Knowledge Definition and Examples - Helpjuice](https://helpjuice.com/blog/tacit-knowledge)
- [Different Types of Knowledge - Kipwise](https://kipwise.com/learn/tacit-vs-explicit-knowledge)

### Knowledge Graph & Entity Extraction
- [Knowledge Graph Extraction Challenges - Neo4j](https://neo4j.com/blog/developer/knowledge-graph-extraction-challenges/)
- [Knowledge Graph Construction with AI - IBM Research](https://research.ibm.com/blog/knowledge-graph-ai)
- [LLM-Empowered Knowledge Graph Construction - arXiv](https://arxiv.org/html/2510.20345v1)

### Document Classification
- [Document Classification Guide - Nanonets](https://nanonets.com/blog/document-classification/)
- [How Document Categorization Works - Box](https://blog.box.com/how-does-document-categorization-work)
- [Document Classification - Wikipedia](https://en.wikipedia.org/wiki/Document_classification)

### Version Control & Review Cadence
- [Version Control Best Practices - Perforce](https://www.perforce.com/blog/vcs/8-version-control-best-practices)
- [Best Practices for Managing Software Releases - C2 Group](https://www.c2experience.com/blog/nine-best-practices-for-managing-software-releases-and-upgrades)
- [Patch Cadence Best Practices - SecurityScorecard](https://securityscorecard.com/blog/patch-cadence-and-management-best-practices/)

### Notion API & Patterns
- [Working with Databases - Notion Developers](https://developers.notion.com/docs/working-with-databases)
- [Notion Knowledge Base AI Assistant - n8n](https://n8n.io/workflows/2413-notion-knowledge-base-ai-assistant/)
- [The Complete Notion API Crash Course - Thomas Frank](https://thomasjfrank.com/notion-api-crash-course/)

---

## 🚀 Next Steps

1. **Review this document** with the ACT team
2. **Prioritize improvements** based on impact vs. effort
3. **Start with Phase 1** (quick wins)
4. **Measure success** with metrics:
   - Knowledge item count (target: 50+ by end of Phase 2)
   - Coverage across sources (target: 4+ sources by Phase 2)
   - Review compliance (target: 90%+ pages reviewed on time)
   - Search accuracy (target: >85% relevant results)
   - Time saved (target: 5+ hours/week automated)

---

**Research compiled by:** Claude Sonnet 4.5
**For:** ACT Living Wiki Enhancement Project
**Next Review:** January 2025
