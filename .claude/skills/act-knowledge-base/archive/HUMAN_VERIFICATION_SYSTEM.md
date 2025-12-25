# Human Verification & Knowledge Management System
## Keeping ACT AI Knowledge Current, Nuanced, and Community-Informed

**Purpose:** Ensure AI-generated content respects cultural protocols, maintains quality, and evolves with ACT's growing wisdom while archiving outdated thinking and integrating diverse knowledge sources.

---

## Philosophy: Human-in-the-Loop, Not Human-Replaced

**Core Principle:** AI assists, humans verify. Community wisdom guides, AI amplifies.

**Why This Matters:**
- AI doesn't understand lived experience
- Cultural nuance requires human judgment
- Community knowledge evolves faster than models
- Elder wisdom can't be automated
- Context matters more than correctness

---

## 1. Human Verification Workflow

### Tier 1: Real-Time Verification (During Generation)

**For:** Content being created right now

**Process:**
```
AI Generates → Human Reviews → Feedback Loop → Final Approval

Example:
1. AI writes blog draft
2. Human reviews (5 min)
3. Notes issues: "Too corporate, missing community voice"
4. AI revises based on feedback
5. Human approves or requests changes
6. Final version published
```

**Implementation:**

Create verification UI component:

```typescript
// src/components/ai/VerificationPanel.tsx
'use client';

import { useState } from 'react';

interface VerificationPanelProps {
  content: string;
  type: 'blog' | 'grant' | 'social' | 'email' | 'technical';
  onApprove: (feedback: VerificationFeedback) => void;
  onReject: (issues: string[]) => void;
}

interface VerificationFeedback {
  brandVoice: 1 | 2 | 3 | 4 | 5; // 1=Poor, 5=Excellent
  culturalSafety: 1 | 2 | 3 | 4 | 5;
  factualAccuracy: 1 | 2 | 3 | 4 | 5;
  communityVoice: 1 | 2 | 3 | 4 | 5;
  overallQuality: 1 | 2 | 3 | 4 | 5;
  notes: string;
  improvementSuggestions: string[];
}

export default function VerificationPanel({
  content,
  type,
  onApprove,
  onReject
}: VerificationPanelProps) {
  const [feedback, setFeedback] = useState<Partial<VerificationFeedback>>({});
  const [issues, setIssues] = useState<string[]>([]);

  // Checklist based on content type
  const checklists = {
    blog: [
      'Starts with community perspective',
      'Uses ACT brand voice (grounded yet visionary)',
      'Includes farm/garden metaphor',
      'LCAA methodology evident',
      'No savior complex language',
      'Community voices centered',
      'Cultural protocols respected',
    ],
    grant: [
      'Community-defined metrics included',
      'OCAP® principles evident',
      'Exit/handover strategy mentioned',
      '40% profit-sharing if applicable',
      'Evidence-based claims',
      'Budget realistic',
    ],
    social: [
      'Under 150 words',
      'Clear call to action',
      'Brand voice consistent',
      'No overclaiming',
      'Community invitation, not directive',
    ],
  };

  const checklist = checklists[type] || [];

  return (
    <div className="border rounded-lg p-6 bg-white shadow-sm">
      <h3 className="text-xl font-bold mb-4">Human Verification</h3>

      {/* Content Preview */}
      <div className="mb-6 p-4 bg-gray-50 rounded border">
        <h4 className="font-semibold mb-2">Generated Content:</h4>
        <div className="prose prose-sm">{content}</div>
      </div>

      {/* Checklist */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3">Content Checklist:</h4>
        {checklist.map((item, idx) => (
          <label key={idx} className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              onChange={(e) => {
                if (!e.target.checked) {
                  setIssues([...issues, item]);
                } else {
                  setIssues(issues.filter(i => i !== item));
                }
              }}
            />
            <span className="text-sm">{item}</span>
          </label>
        ))}
      </div>

      {/* Quality Ratings */}
      <div className="mb-6 space-y-3">
        <h4 className="font-semibold mb-3">Quality Assessment:</h4>

        <RatingInput
          label="Brand Voice Consistency"
          value={feedback.brandVoice}
          onChange={(v) => setFeedback({...feedback, brandVoice: v})}
        />

        <RatingInput
          label="Cultural Safety"
          value={feedback.culturalSafety}
          onChange={(v) => setFeedback({...feedback, culturalSafety: v})}
        />

        <RatingInput
          label="Factual Accuracy"
          value={feedback.factualAccuracy}
          onChange={(v) => setFeedback({...feedback, factualAccuracy: v})}
        />

        <RatingInput
          label="Community Voice Centered"
          value={feedback.communityVoice}
          onChange={(v) => setFeedback({...feedback, communityVoice: v})}
        />
      </div>

      {/* Notes */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">Notes & Improvements:</label>
        <textarea
          className="w-full border rounded p-2 min-h-[100px]"
          placeholder="What needs improvement? What's working well?"
          value={feedback.notes || ''}
          onChange={(e) => setFeedback({...feedback, notes: e.target.value})}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => onApprove(feedback as VerificationFeedback)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          disabled={issues.length > 0}
        >
          ✓ Approve & Publish
        </button>

        <button
          onClick={() => onReject(issues)}
          className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
        >
          ↻ Request Revision
        </button>

        <button
          onClick={() => onReject(['Manual rewrite needed'])}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          ✗ Reject (Manual Rewrite)
        </button>
      </div>
    </div>
  );
}

function RatingInput({ label, value, onChange }: {
  label: string;
  value?: number;
  onChange: (v: 1 | 2 | 3 | 4 | 5) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            onClick={() => onChange(rating as any)}
            className={`w-10 h-10 rounded ${
              value === rating
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {rating}
          </button>
        ))}
      </div>
    </div>
  );
}
```

**Database Schema for Verification Logs:**

```sql
CREATE TABLE ai_content_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID, -- Link to actual content
  content_type TEXT NOT NULL, -- 'blog', 'grant', 'social', etc.
  generated_content TEXT NOT NULL,
  final_content TEXT, -- After human edits

  -- Ratings
  brand_voice_score INTEGER CHECK (brand_voice_score BETWEEN 1 AND 5),
  cultural_safety_score INTEGER CHECK (cultural_safety_score BETWEEN 1 AND 5),
  factual_accuracy_score INTEGER CHECK (factual_accuracy_score BETWEEN 1 AND 5),
  community_voice_score INTEGER CHECK (community_voice_score BETWEEN 1 AND 5),
  overall_quality_score INTEGER CHECK (overall_quality_score BETWEEN 1 AND 5),

  -- Feedback
  human_notes TEXT,
  improvement_suggestions TEXT[],
  issues_found TEXT[],

  -- Metadata
  verified_by UUID REFERENCES auth.users(id),
  verified_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT CHECK (status IN ('approved', 'revised', 'rejected')),

  -- Learning
  used_for_training BOOLEAN DEFAULT FALSE,
  training_added_at TIMESTAMPTZ
);

-- Index for analytics
CREATE INDEX ON ai_content_verifications(content_type, status);
CREATE INDEX ON ai_content_verifications(verified_at);
CREATE INDEX ON ai_content_verifications(overall_quality_score);
```

**Feedback Loop to Improve AI:**

```typescript
// scripts/update-training-from-feedback.mjs

/**
 * Periodically update fine-tuning dataset with verified content
 *
 * This creates a continuous improvement loop:
 * 1. AI generates content
 * 2. Humans verify and edit
 * 3. High-quality verified content added to training
 * 4. Next fine-tuning iteration improves
 */

async function updateTrainingDataset() {
  // Get highly-rated verified content (score ≥ 4)
  const { data: verifications } = await supabase
    .from('ai_content_verifications')
    .select('*')
    .eq('status', 'approved')
    .gte('overall_quality_score', 4)
    .eq('used_for_training', false)
    .limit(50);

  if (verifications.length === 0) {
    console.log('No new high-quality content to add');
    return;
  }

  // Convert to training examples
  const trainingExamples = verifications.map(v => ({
    instruction: `Write ${v.content_type} content for ACT`,
    input: extractContextFromContent(v.generated_content),
    output: v.final_content, // Human-edited version
    metadata: {
      source: 'human-verified',
      quality_score: v.overall_quality_score,
      verification_date: v.verified_at,
    },
  }));

  // Append to training dataset
  await appendToFile(
    './training-data-human-verified.jsonl',
    trainingExamples.map(ex => JSON.stringify(ex)).join('\n') + '\n'
  );

  // Mark as used
  await supabase
    .from('ai_content_verifications')
    .update({ used_for_training: true, training_added_at: new Date() })
    .in('id', verifications.map(v => v.id));

  console.log(`✅ Added ${verifications.length} verified examples to training data`);
  console.log('💡 Re-fine-tune when you have 100+ new examples');
}
```

---

### Tier 2: Elder Review (Cultural Content)

**For:** Content touching on:
- Indigenous knowledge
- Cultural practices
- Traditional Owner protocols
- Sacred or sensitive topics
- Community stories
- Historical narratives

**Process:**
```
AI Generates → Staff Review → Elder Review → Final Approval

Safeguards:
- AI NEVER generates content about sacred topics (guardrails)
- Elders have veto power (no appeals)
- Compensation for review time
- No rush (respect Elder timelines)
- Option to remove content entirely
```

**Implementation:**

```typescript
// src/lib/ai/cultural-safety-check.ts

/**
 * Check if content requires Elder review before publication
 */
export function requiresElderReview(content: string, metadata: {
  project?: string;
  topic?: string;
  tags?: string[];
}): boolean {

  // Trigger words (case-insensitive)
  const culturalKeywords = [
    'traditional owner',
    'indigenous',
    'aboriginal',
    'first nations',
    'elder',
    'ceremony',
    'sacred',
    'cultural practice',
    'dreaming',
    'songline',
    'country', // When used in cultural context
    'jinibara', // Specific nations
    'kalkadoon',
  ];

  const contentLower = content.toLowerCase();

  // Check for keywords
  const hasCulturalContent = culturalKeywords.some(keyword =>
    contentLower.includes(keyword.toLowerCase())
  );

  // Check project (BCV always requires review)
  const isCulturalProject = metadata.project === 'black-cockatoo-valley';

  // Check tags
  const hasCulturalTags = metadata.tags?.some(tag =>
    ['indigenous-leadership', 'cultural-safety', 'traditional-knowledge'].includes(tag)
  );

  return hasCulturalContent || isCulturalProject || hasCulturalTags;
}

/**
 * Elder Review Request
 */
export async function requestElderReview(content: {
  id: string;
  text: string;
  type: string;
  context: string;
}) {
  // Create review request
  const { data: request } = await supabase
    .from('elder_reviews')
    .insert({
      content_id: content.id,
      content_text: content.text,
      content_type: content.type,
      context: content.context,
      status: 'pending',
      requested_at: new Date(),
    })
    .select()
    .single();

  // Notify designated Elder(s) via email
  await sendElderReviewRequest({
    contentId: request.id,
    contentType: content.type,
    excerpt: content.text.substring(0, 200),
  });

  // Record compensation owed
  await supabase
    .from('elder_compensation')
    .insert({
      review_id: request.id,
      amount_aud: 100, // $100 per review
      status: 'pending',
    });

  return request;
}
```

**Elder Review Database Schema:**

```sql
CREATE TABLE elder_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID NOT NULL,
  content_text TEXT NOT NULL,
  content_type TEXT NOT NULL,
  context TEXT,

  -- Review
  status TEXT CHECK (status IN ('pending', 'approved', 'revision_needed', 'rejected')) DEFAULT 'pending',
  elder_notes TEXT,
  approved_by TEXT, -- Elder name (with permission)
  reviewed_at TIMESTAMPTZ,

  -- Edits
  suggested_edits TEXT,
  final_approved_text TEXT,

  -- Protocol
  requires_removal BOOLEAN DEFAULT FALSE,
  removal_reason TEXT,

  -- Metadata
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  requested_by UUID REFERENCES auth.users(id)
);

CREATE TABLE elder_compensation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID REFERENCES elder_reviews(id),
  amount_aud DECIMAL(10,2) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'paid', 'declined')) DEFAULT 'pending',
  paid_at TIMESTAMPTZ,
  payment_reference TEXT
);
```

---

### Tier 3: Community Feedback Loop

**For:** Published content that community can respond to

**Process:**
```
Content Published → Community Reads → Feedback Collected → Updates Made

Channels:
- Comment forms on articles
- Community surveys (quarterly)
- Story circles (semi-annual)
- Direct outreach to partners
```

**Implementation:**

```typescript
// src/components/CommunityFeedbackForm.tsx

export function CommunityFeedbackForm({ contentId, contentType }: {
  contentId: string;
  contentType: string;
}) {
  return (
    <form className="mt-8 p-6 bg-gray-50 rounded border">
      <h3 className="text-lg font-bold mb-4">Community Feedback</h3>

      <p className="text-sm text-gray-700 mb-4">
        Help us improve. Your voice shapes how ACT communicates.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block font-medium mb-2">
            Does this content reflect ACT's values?
          </label>
          <select className="w-full border rounded p-2">
            <option value="">Select...</option>
            <option value="yes">Yes, it's authentic</option>
            <option value="mostly">Mostly, with some concerns</option>
            <option value="no">No, it feels off</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-2">
            What could be improved?
          </label>
          <textarea
            className="w-full border rounded p-2 min-h-[100px]"
            placeholder="Be specific. Your feedback helps us learn."
          />
        </div>

        <div>
          <label className="flex items-center gap-2">
            <input type="checkbox" />
            <span className="text-sm">
              I'm open to follow-up conversation about this feedback
            </span>
          </label>
        </div>

        <button className="px-4 py-2 bg-blue-600 text-white rounded">
          Submit Feedback
        </button>
      </div>

      <p className="text-xs text-gray-600 mt-4">
        Your feedback is reviewed monthly. We don't respond to every comment,
        but we read and learn from all of them.
      </p>
    </form>
  );
}
```

---

## 2. Knowledge Archival & Versioning System

### Problem: Thinking Evolves, Old Content Becomes Outdated

**Examples:**
- ACT used to say X, now we say Y (evolved understanding)
- Project ended or pivoted (needs archiving)
- Partnership changed (update relationships)
- New research challenges old claims (factual updates)

**Solution: Version Control for Knowledge**

### Implementation:

```sql
-- Knowledge Base Versioning
CREATE TABLE knowledge_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  knowledge_id TEXT NOT NULL, -- e.g., 'core-mission', 'lcaa-listen'
  version INTEGER NOT NULL,
  content TEXT NOT NULL,
  content_type TEXT NOT NULL, -- 'principle', 'method', 'practice', 'procedure'

  -- Change tracking
  changed_from TEXT, -- What changed
  reason_for_change TEXT NOT NULL, -- Why it changed
  changed_by UUID REFERENCES auth.users(id),
  approved_by UUID REFERENCES auth.users(id),

  -- Status
  status TEXT CHECK (status IN ('draft', 'active', 'archived', 'deprecated')) DEFAULT 'draft',
  active_from TIMESTAMPTZ,
  active_until TIMESTAMPTZ,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(knowledge_id, version)
);

-- Archive old versions when new one becomes active
CREATE FUNCTION archive_old_knowledge_version()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'active' THEN
    -- Archive previous active version
    UPDATE knowledge_versions
    SET status = 'archived',
        active_until = NEW.active_from
    WHERE knowledge_id = NEW.knowledge_id
      AND status = 'active'
      AND id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER archive_knowledge_on_activation
  AFTER UPDATE OF status ON knowledge_versions
  FOR EACH ROW
  EXECUTE FUNCTION archive_old_knowledge_version();
```

**Usage Example:**

```typescript
// Example: LCAA methodology evolved

// Version 1 (2022)
await createKnowledgeVersion({
  id: 'lcaa-listen',
  version: 1,
  content: 'Listen: We observe before acting',
  reason: 'Initial definition',
  status: 'archived',
});

// Version 2 (2023) - Deepened understanding
await createKnowledgeVersion({
  id: 'lcaa-listen',
  version: 2,
  content: 'Listen: We sit in silence to take in knowledge from Country, Elders, and community',
  reason: 'Expanded to include sources of listening and cultural depth',
  changed_from: 'Version 1 was too shallow, missing cultural context',
  status: 'archived',
});

// Version 3 (2024) - Current
await createKnowledgeVersion({
  id: 'lcaa-listen',
  version: 3,
  content: `Listen: We sit in silence to take in knowledge.

Who we listen to:
- Country (land teaches if we slow down)
- Traditional Owners (ancestral knowledge)
- Community (those most impacted)
- Elders (wisdom across generations)
- Youth (vision unencumbered)
- The Silenced (systematically excluded)`,
  reason: 'Added specificity on who we listen to and why',
  changed_from: 'Version 2 mentioned sources but didn\'t detail the why',
  status: 'active',
  active_from: new Date('2024-01-01'),
});

// AI always uses ACTIVE version
const activeKnowledge = await supabase
  .from('knowledge_versions')
  .select('*')
  .eq('knowledge_id', 'lcaa-listen')
  .eq('status', 'active')
  .single();
```

**Archive Navigation UI:**

```typescript
// src/app/admin/knowledge-history/page.tsx

export default function KnowledgeHistoryPage() {
  return (
    <div>
      <h1>Knowledge Evolution History</h1>

      {/* Timeline view */}
      <div className="space-y-6">
        <KnowledgeTimeline knowledgeId="lcaa-listen" />
        <KnowledgeTimeline knowledgeId="core-mission" />
        <KnowledgeTimeline knowledgeId="pto-metaphor" />
      </div>
    </div>
  );
}

function KnowledgeTimeline({ knowledgeId }: { knowledgeId: string }) {
  const versions = useKnowledgeVersions(knowledgeId);

  return (
    <div className="border rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">
        {knowledgeId.replace(/-/g, ' ').toUpperCase()}
      </h2>

      <div className="space-y-4">
        {versions.map((v, idx) => (
          <div key={v.id} className={`
            pl-4 border-l-4
            ${v.status === 'active' ? 'border-green-500' : 'border-gray-300'}
          `}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold">
                Version {v.version}
                {v.status === 'active' && (
                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                    CURRENT
                  </span>
                )}
              </span>
              <span className="text-sm text-gray-600">
                {new Date(v.created_at).toLocaleDateString()}
              </span>
            </div>

            <p className="text-sm text-gray-700 mb-2">{v.content}</p>

            {v.reason_for_change && (
              <p className="text-xs text-gray-600 italic">
                Why changed: {v.reason_for_change}
              </p>
            )}

            {v.changed_from && idx > 0 && (
              <details className="mt-2 text-xs">
                <summary className="cursor-pointer text-blue-600">
                  Show what changed from v{v.version - 1}
                </summary>
                <div className="mt-2 p-2 bg-gray-50 rounded">
                  {v.changed_from}
                </div>
              </details>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 3. Multi-Source Knowledge Integration with Nuance

### Problem: Knowledge Comes from Many Places

**Sources:**
1. **Notion** - Project registry, actions, people
2. **Webflow** - Blog articles (JusticeHub, ACT Main)
3. **Empathy Ledger** - Community stories, impact data
4. **Supabase** - Media, enrichments, internal data
5. **GitHub** - Code, technical docs, issues
6. **Community Partners** - Direct conversations, emails, workshops
7. **Elders** - Oral knowledge, cultural protocols
8. **Academic Research** - Studies, papers, evidence
9. **Government Reports** - Policy, funding, regulations
10. **Lived Experience** - Team reflections, retrospectives

**Challenge:** Each source has different:
- Authority levels (Elder wisdom > blog post)
- Update frequencies (code changes daily, values rarely)
- Nuance requirements (cultural > technical)
- Verification needs (data claims > opinions)

### Solution: Knowledge Source Taxonomy

```typescript
// src/lib/knowledge/source-taxonomy.ts

export const KnowledgeSourceTaxonomy = {
  // Tier 1: Foundational Truth (Rarely changes, highest authority)
  foundational: {
    authority: 10,
    updateFrequency: 'rarely', // Years
    requiresVerification: 'elder-review',
    sources: [
      'Traditional Owner protocols',
      'Elder wisdom',
      'OCAP® principles',
      'Core ACT values',
    ],
    nuanceLevel: 'critical', // Zero tolerance for error
    exampleUpdate: 'Only with community consensus and Elder approval',
  },

  // Tier 2: Strategic (Changes with organizational evolution)
  strategic: {
    authority: 8,
    updateFrequency: 'occasionally', // Quarters to years
    requiresVerification: 'leadership-approval',
    sources: [
      'Mission statements',
      'LCAA methodology',
      'Partnership principles',
      'Governance model',
    ],
    nuanceLevel: 'high',
    exampleUpdate: 'Board approval, documented reasoning',
  },

  // Tier 3: Tactical (Operational knowledge)
  tactical: {
    authority: 6,
    updateFrequency: 'regularly', // Weeks to months
    requiresVerification: 'team-consensus',
    sources: [
      'Project details',
      'Program structures',
      'Technical architecture',
      'Content guidelines',
    ],
    nuanceLevel: 'medium',
    exampleUpdate: 'Team decision, version controlled',
  },

  // Tier 4: Dynamic (Rapid iteration)
  dynamic: {
    authority: 4,
    updateFrequency: 'frequently', // Days to weeks
    requiresVerification: 'peer-review',
    sources: [
      'Blog articles',
      'Social media content',
      'Event details',
      'Temporary campaigns',
    ],
    nuanceLevel: 'low',
    exampleUpdate: 'Individual contributor with review',
  },

  // Tier 5: Experimental (Testing ideas)
  experimental: {
    authority: 2,
    updateFrequency: 'constantly', // Real-time
    requiresVerification: 'self',
    sources: [
      'Draft proposals',
      'Brainstorms',
      'Prototypes',
      'A/B test variations',
    ],
    nuanceLevel: 'exploratory',
    exampleUpdate: 'No formal approval, marked as experimental',
  },
};
```

**Nuance Tracking in Knowledge Base:**

```sql
CREATE TABLE knowledge_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  knowledge_id TEXT NOT NULL REFERENCES knowledge_versions(knowledge_id),

  -- Source attribution
  source_type TEXT NOT NULL, -- 'elder', 'community', 'staff', 'research', 'data'
  source_name TEXT, -- Person, organization, or document
  source_url TEXT,
  source_date TIMESTAMPTZ,

  -- Authority & nuance
  authority_tier TEXT CHECK (authority_tier IN ('foundational', 'strategic', 'tactical', 'dynamic', 'experimental')),
  authority_score INTEGER CHECK (authority_score BETWEEN 1 AND 10),
  nuance_level TEXT CHECK (nuance_level IN ('critical', 'high', 'medium', 'low', 'exploratory')),

  -- Context
  context TEXT, -- Why this source matters
  limitations TEXT, -- What this source doesn't cover
  conflicting_sources UUID[], -- Links to sources that disagree

  -- Verification
  verified_by UUID REFERENCES auth.users(id),
  verified_at TIMESTAMPTZ,
  verification_method TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Link knowledge to multiple sources
CREATE INDEX ON knowledge_sources(knowledge_id);
CREATE INDEX ON knowledge_sources(authority_tier);
```

**Multi-Source Knowledge Example:**

```typescript
// Example: "What is ACT's mission?"

const missionKnowledge = {
  knowledge_id: 'core-mission',
  current_version: 3,
  content: 'A Curious Tractor partners with marginalized communities...',

  sources: [
    {
      type: 'foundational',
      source: 'Co-Founder Vision Statement',
      date: '2020-01-15',
      authority: 10,
      nuance: 'critical',
      context: 'Original articulation by Benjamin & Nic',
      verified_by: 'Board',
    },
    {
      type: 'strategic',
      source: 'Community Feedback Workshop',
      date: '2022-06-20',
      authority: 9,
      nuance: 'high',
      context: 'Community partners refined language to center their voice',
      verified_by: 'Community Advisory',
    },
    {
      type: 'dynamic',
      source: 'Website Copy (Homepage)',
      date: '2024-01-10',
      authority: 6,
      nuance: 'medium',
      context: 'Public-facing simplified version',
      limitations: 'Abbreviated for marketing, doesn\'t capture full depth',
    },
  ],

  // AI understands:
  // - Use foundational source for formal contexts
  // - Use strategic source when explaining to partners
  // - Use dynamic source for website/marketing
};
```

---

## 4. Principles, Methods, Practices, Procedures Framework (PMPP)

### Distinguish Different Types of Knowledge

**Why This Matters:**
- **Principles** rarely change (values, philosophy)
- **Methods** evolve slowly (LCAA methodology)
- **Practices** adapt often (how we apply methods)
- **Procedures** change frequently (step-by-step instructions)

AI needs to know which level it's working with.

### Taxonomy:

```typescript
export const PMPPFramework = {
  principles: {
    definition: 'Foundational beliefs that guide all work',
    changeFrequency: 'rarely', // 5-10 years
    authority: 'Elder/Board level',
    examples: [
      'Radical humility',
      'Decentralized power',
      'Design for obsolescence',
      'OCAP® principles',
    ],
    howToUpdate: 'Community consensus + Board vote + Elder approval if cultural',
  },

  methods: {
    definition: 'Systematic approaches to achieving principles',
    changeFrequency: 'occasionally', // 1-3 years
    authority: 'Leadership team',
    examples: [
      'LCAA (Listen, Curiosity, Action, Art)',
      'Co-design methodology',
      '40% profit-sharing model',
      'Multi-tenant architecture pattern',
    ],
    howToUpdate: 'Team proposal + pilot testing + leadership approval',
  },

  practices: {
    definition: 'Specific ways methods are applied in context',
    changeFrequency: 'regularly', // 3-12 months
    authority: 'Team leads',
    examples: [
      'How we run listening sessions',
      'How we conduct co-design workshops',
      'How we calculate profit-sharing',
      'How we implement RLS policies',
    ],
    howToUpdate: 'Team reflection + adjustment + documentation',
  },

  procedures: {
    definition: 'Step-by-step instructions for specific tasks',
    changeFrequency: 'frequently', // Monthly
    authority: 'Individual contributors',
    examples: [
      'How to set up Ollama on NAS',
      'How to fine-tune a model',
      'How to deploy Next.js to Vercel',
      'How to run weekly evaluation script',
    ],
    howToUpdate: 'Edit docs, test, commit to repo',
  },
};
```

**Database Schema:**

```sql
CREATE TABLE pmpp_knowledge (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT CHECK (type IN ('principle', 'method', 'practice', 'procedure')) NOT NULL,

  -- Core content
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  context TEXT, -- When/why this applies

  -- Relationships
  parent_principle_id UUID REFERENCES pmpp_knowledge(id), -- Methods link to principles
  parent_method_id UUID REFERENCES pmpp_knowledge(id), -- Practices link to methods
  parent_practice_id UUID REFERENCES pmpp_knowledge(id), -- Procedures link to practices

  -- Change management
  version INTEGER DEFAULT 1,
  status TEXT CHECK (status IN ('draft', 'active', 'archived')) DEFAULT 'draft',
  last_reviewed_at TIMESTAMPTZ DEFAULT NOW(),
  review_frequency_days INTEGER, -- How often to review

  -- Authority
  update_authority TEXT, -- Who can update this
  requires_approval_from TEXT[],

  -- Tags
  projects TEXT[], -- Which projects this applies to
  domains TEXT[], -- 'cultural', 'technical', 'operational', etc.

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure hierarchy is valid
CREATE FUNCTION validate_pmpp_hierarchy()
RETURNS TRIGGER AS $$
BEGIN
  -- Methods can only reference principles
  IF NEW.type = 'method' AND NEW.parent_method_id IS NOT NULL THEN
    RAISE EXCEPTION 'Methods can only reference principles, not other methods';
  END IF;

  -- Practices can only reference methods
  IF NEW.type = 'practice' AND NEW.parent_principle_id IS NOT NULL THEN
    RAISE EXCEPTION 'Practices must reference methods, not principles directly';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_pmpp_hierarchy
  BEFORE INSERT OR UPDATE ON pmpp_knowledge
  FOR EACH ROW
  EXECUTE FUNCTION validate_pmpp_hierarchy();
```

**Example Hierarchy:**

```typescript
// Principle → Method → Practice → Procedure

const example = {
  principle: {
    id: 'p-001',
    type: 'principle',
    title: 'Community Ownership',
    content: '40% of profits flow to communities who co-create value',
    update_authority: 'board',
    review_frequency_days: 1825, // 5 years
  },

  method: {
    id: 'm-001',
    type: 'method',
    title: '40% Profit-Sharing Model',
    parent_principle_id: 'p-001',
    content: 'Legal and financial structures that allocate 40% of profits...',
    update_authority: 'leadership',
    review_frequency_days: 365, // Annual
  },

  practice: {
    id: 'pr-001',
    type: 'practice',
    title: 'Quarterly Profit Distribution for Goods on Country',
    parent_method_id: 'm-001',
    content: 'Every quarter, calculate gross profits from bed sales...',
    update_authority: 'finance-lead',
    review_frequency_days: 90, // Quarterly
  },

  procedure: {
    id: 'proc-001',
    type: 'procedure',
    title: 'Step-by-Step: Calculate Quarterly Profit Share',
    parent_practice_id: 'pr-001',
    content: `
1. Log into Xero
2. Run P&L report for quarter
3. Identify Goods on Country revenue line items
4. Calculate COGS (cost of goods sold)
5. Subtract COGS from revenue = gross profit
6. Multiply gross profit × 0.40 = community share
7. Create payment in banking system
8. Send notification to community partners
9. Update profit-sharing tracker spreadsheet
    `,
    update_authority: 'any-team-member',
    review_frequency_days: 30, // Monthly
  },
};
```

**AI Usage:**

```typescript
// When AI generates content, it understands the level

async function generateContent(type: 'principle' | 'method' | 'practice' | 'procedure', context: string) {
  const pmppConfig = PMPPFramework[type];

  const systemPrompt = `
You are generating ${type}-level content for ACT.

${type.toUpperCase()} CHARACTERISTICS:
- Change frequency: ${pmppConfig.changeFrequency}
- Authority: ${pmppConfig.authority}
- Typical examples: ${pmppConfig.examples.join(', ')}

IMPORTANT:
- ${type === 'principle' ? 'This rarely changes. Use timeless, foundational language. Connect to core values.' : ''}
- ${type === 'method' ? 'This is a systematic approach. Reference underlying principles it serves.' : ''}
- ${type === 'practice' ? 'This is context-specific application. Reference the method it implements.' : ''}
- ${type === 'procedure' ? 'This is step-by-step instruction. Be concrete and actionable. Link to relevant practice.' : ''}

Context: ${context}
`;

  // AI knows to be more careful with principles than procedures
  const temperature = {
    principle: 0.3, // Very conservative
    method: 0.5,
    practice: 0.7,
    procedure: 0.8, // Can be more creative with procedural steps
  }[type];

  return await generateWithMistral(systemPrompt, temperature);
}
```

---

## 5. Continuous Knowledge Refinement Loops

### Weekly: Quick Review

```bash
# Automated every Monday morning
node scripts/weekly-knowledge-review.mjs
```

**What It Does:**
- Checks for knowledge that hasn't been reviewed in X days
- Surfaces new content added to sources (Notion, Webflow, GitHub)
- Identifies conflicts (same topic, different claims)
- Sends digest to team

**Output Email:**

```
📚 Weekly Knowledge Review - Dec 18, 2024

⚠️  NEEDS REVIEW (Overdue):
- "LCAA - Listen" (last reviewed 180 days ago, due for review)
- "Goods on Country pricing" (conflicting data in Notion vs. website)
- "BCV residency capacity" (updated in Notion, not in knowledge base)

📥 NEW CONTENT DETECTED:
- 3 new blog articles on JusticeHub
- 1 new project added to Notion registry
- 5 GitHub commits updating technical docs

🔄 SUGGESTED UPDATES:
- "Empathy Ledger features" (new feature shipped, knowledge base outdated)
- "Team members" (2 new hires not in knowledge base)

👉 Review at: http://localhost:3000/admin/knowledge-review
```

### Monthly: Deep Review

**Process:**
1. Team meeting (60-90 minutes)
2. Review AI-generated content quality scores from past month
3. Identify patterns in what's working / what's not
4. Discuss any controversial or sensitive content
5. Vote on knowledge updates (if needed)

**Agenda Template:**

```markdown
# ACT Monthly Knowledge Review
## December 2024

### 1. Quality Metrics Review (15 min)
- AI content verification scores: 8.2/10 avg (↑ from 7.9 last month)
- Rejection rate: 12% (target: <15%)
- Elder reviews: 3 requested, 3 approved, 0 rejected
- Community feedback: 8 comments received

### 2. Content That Worked Well (15 min)
- Blog articles: High scores, minimal edits needed
- Grant proposals: Strong quality, 2/2 approved
- Social media: Mixed (some too formal, some great)

### 3. Content That Needs Improvement (20 min)
- Cultural content: AI too generic, needs more specificity
- Technical docs: Good accuracy, but missing context
- Campaign messaging: Not provocative enough

### 4. Knowledge Updates to Approve (30 min)
Vote on:
- Update LCAA "Listen" definition (Version 4 proposed)
- Archive old JusticeHub program (ended in Oct)
- Add new BCV residency type (Artist Residency launched)

### 5. Training Data Updates (10 min)
- 23 new verified examples ready for next fine-tuning
- Schedule fine-tuning: Q1 2025 (after 50+ examples)

### 6. Action Items (10 min)
- [ ] Nic: Review and approve LCAA update
- [ ] Ben: Update technical architecture docs
- [ ] Cath: Provide input on Harvest therapeutic language
```

### Quarterly: Re-fine-tuning Evaluation

**Decision Tree:**

```
Has quality declined?
├─ YES → Re-fine-tune immediately
└─ NO → Continue to next check

Do we have 50+ new verified examples?
├─ YES → Re-fine-tune to improve
└─ NO → Continue to next check

Has brand voice evolved significantly?
├─ YES → Re-fine-tune to capture evolution
└─ NO → Skip fine-tuning this quarter
```

**Script:**

```bash
# scripts/quarterly-fine-tuning-check.mjs

import { assessFineTuningNeed } from './lib/knowledge-management.js';

async function quarterlyCheck() {
  console.log('🔍 Quarterly Fine-Tuning Assessment\n');

  // 1. Check quality trends
  const qualityTrend = await getQualityTrend(90); // Last 90 days
  console.log(`Quality trend: ${qualityTrend.direction} (${qualityTrend.change})`);

  if (qualityTrend.direction === 'declining') {
    console.log('⚠️  Quality declining → Recommend fine-tuning');
    return { recommend: true, reason: 'quality_decline' };
  }

  // 2. Check new training examples
  const newExamples = await getVerifiedExamplesCount();
  console.log(`New verified examples: ${newExamples}`);

  if (newExamples >= 50) {
    console.log('✅ 50+ new examples → Recommend fine-tuning for improvement');
    return { recommend: true, reason: 'new_examples' };
  }

  // 3. Check brand voice evolution
  const voiceChanges = await detectVoiceEvolution();
  console.log(`Brand voice changes: ${voiceChanges.length}`);

  if (voiceChanges.length >= 3) {
    console.log('✅ Significant voice evolution → Recommend fine-tuning');
    return { recommend: true, reason: 'voice_evolution' };
  }

  console.log('✅ No fine-tuning needed this quarter');
  return { recommend: false };
}
```

### Annual: Comprehensive Audit

**Full Knowledge Base Review:**
1. Every principle reviewed by Board + Elders (if cultural)
2. Every method reviewed by Leadership
3. Every practice reviewed by team leads
4. Procedures reviewed by individual contributors

**Deliverable:** Annual Knowledge Report

```markdown
# ACT Knowledge Base - 2024 Annual Report

## Summary
- 250 knowledge items tracked (↑ 18% from 2023)
- 45 updates made this year
- 12 items archived as outdated
- 3 major methodology evolutions

## Highlights
- LCAA "Listen" definition deepened (Version 4)
- New project launched: The Harvest
- 57 blog articles added to training corpus
- 100+ AI-generated pieces verified and published

## Quality Metrics
- Average verification score: 8.4/10 (target: ≥8.0)
- Community feedback satisfaction: 89%
- Elder review approval rate: 100%

## Recommendations for 2025
- Invest in video content for knowledge transfer
- Expand Elder partnership for cultural knowledge
- Create Spanish translation of core knowledge
- Build community editing interface
```

---

## Summary: Putting It All Together

### The Complete Workflow:

```
1. AI generates content using ACTIVE knowledge
   ↓
2. Human verifies (Tier 1, 2, or 3)
   ↓
3. Feedback logged in database
   ↓
4. High-quality verified content added to training pool
   ↓
5. Weekly: Review knowledge for updates
   ↓
6. Monthly: Team approves major changes
   ↓
7. Quarterly: Re-fine-tune if needed
   ↓
8. Annual: Comprehensive audit
   ↓
9. Knowledge evolves, AI learns, quality improves
   (Repeat)
```

### Key Files Created (Next):

I'll now create the implementation scripts and UI components for this system. Ready?

1. `VerificationPanel.tsx` - Human review UI
2. `weekly-knowledge-review.mjs` - Automated review script
3. `knowledge-management-dashboard/` - Admin interface
4. Database migrations for all new tables
5. Integration guide for existing ACT sites

Shall I proceed with building these components?
