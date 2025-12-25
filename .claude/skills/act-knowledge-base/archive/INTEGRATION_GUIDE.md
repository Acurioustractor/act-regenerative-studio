# Human Verification System Integration Guide

## Overview

This guide shows you how to integrate the human verification system into existing ACT sites. The verification system ensures AI-generated content is reviewed by humans before publication, with special workflows for culturally sensitive content.

**Components Created:**
1. `VerificationPanel.tsx` - React component for human review
2. Database migration - All verification tables
3. `weekly-knowledge-review.mjs` - Automated review script
4. Admin dashboard - Knowledge management interface at `/admin/knowledge-review`

---

## Quick Start

### 1. Run Database Migration

First, apply the database migration to create all necessary tables:

```bash
# Using Supabase CLI
supabase db push

# Or manually run the migration
psql -h [your-supabase-host] -U postgres -d postgres -f supabase/migrations/20241225_human_verification_system.sql
```

**Tables Created:**
- `ai_content_verifications` - Stores human feedback
- `knowledge_versions` - Tracks knowledge evolution
- `knowledge_sources` - Source attribution
- `pmpp_knowledge` - Principles, Methods, Practices, Procedures
- `elder_review_queue` - Cultural content review
- `community_feedback` - Public feedback
- `training_dataset` - Fine-tuning data

### 2. Install Dependencies

Ensure you have the required dependencies:

```bash
npm install @supabase/supabase-js
# or
pnpm add @supabase/supabase-js
```

### 3. Add Verification to Your Site

Import and use the VerificationPanel component:

```typescript
import { VerificationPanel } from '@/components/ai/VerificationPanel';

// In your AI content generation flow
const [aiGeneratedContent, setAiGeneratedContent] = useState('');

// After generating content with AI
<VerificationPanel
  generatedContent={aiGeneratedContent}
  contentType="blog_article"
  projectSlug="justicehub"
  contentId={articleId}
  onVerified={(feedback) => {
    console.log('Content verified:', feedback);
    // Publish content or save for later
  }}
  requireElderReview={false} // Set to true for cultural content
/>
```

---

## Integration Examples

### Example 1: Blog Article Generation

```typescript
// src/app/blog/new/page.tsx

'use client';

import { useState } from 'react';
import { VerificationPanel } from '@/components/ai/VerificationPanel';

export default function NewBlogArticle() {
  const [prompt, setPrompt] = useState('');
  const [aiContent, setAiContent] = useState('');
  const [showVerification, setShowVerification] = useState(false);

  async function generateContent() {
    // Call your AI API
    const response = await fetch('/api/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        type: 'blog_article',
        project: 'justicehub',
      }),
    });

    const data = await response.json();
    setAiContent(data.content);
    setShowVerification(true);
  }

  async function handleVerification(feedback) {
    // Save the verified content
    const response = await fetch('/api/blog/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: feedback.finalContent,
        status: feedback.status === 'approved' ? 'published' : 'draft',
        verificationId: feedback.id,
      }),
    });

    if (response.ok) {
      alert('Article saved!');
      // Redirect to blog list
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">New Blog Article</h1>

      {!showVerification ? (
        <div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what you want to write about..."
            className="w-full h-32 p-4 border rounded-lg mb-4"
          />
          <button
            onClick={generateContent}
            className="px-6 py-3 bg-green-600 text-white rounded-lg"
          >
            Generate Article
          </button>
        </div>
      ) : (
        <VerificationPanel
          generatedContent={aiContent}
          contentType="blog_article"
          projectSlug="justicehub"
          onVerified={handleVerification}
        />
      )}
    </div>
  );
}
```

### Example 2: Email Campaign with Elder Review

```typescript
// src/app/campaigns/email/new/page.tsx

'use client';

import { useState } from 'react';
import { VerificationPanel } from '@/components/ai/VerificationPanel';

export default function NewEmailCampaign() {
  const [campaignData, setCampaignData] = useState({
    audience: '',
    topic: '',
    includesCulturalContent: false,
  });
  const [aiContent, setAiContent] = useState('');
  const [showVerification, setShowVerification] = useState(false);

  async function generateEmail() {
    const response = await fetch('/api/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'email_campaign',
        audience: campaignData.audience,
        topic: campaignData.topic,
      }),
    });

    const data = await response.json();
    setAiContent(data.content);
    setShowVerification(true);
  }

  async function handleVerification(feedback) {
    // If approved, schedule the campaign
    if (feedback.status === 'approved') {
      await fetch('/api/campaigns/schedule', {
        method: 'POST',
        body: JSON.stringify({
          content: feedback.finalContent,
          audience: campaignData.audience,
        }),
      });
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">New Email Campaign</h1>

      {!showVerification ? (
        <div className="space-y-4">
          <div>
            <label className="block mb-2">Audience</label>
            <input
              type="text"
              value={campaignData.audience}
              onChange={(e) => setCampaignData({ ...campaignData, audience: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-2">Topic</label>
            <input
              type="text"
              value={campaignData.topic}
              onChange={(e) => setCampaignData({ ...campaignData, topic: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={campaignData.includesCulturalContent}
                onChange={(e) =>
                  setCampaignData({ ...campaignData, includesCulturalContent: e.target.checked })
                }
              />
              Includes cultural content (requires Elder review)
            </label>
          </div>

          <button
            onClick={generateEmail}
            className="px-6 py-3 bg-green-600 text-white rounded-lg"
          >
            Generate Email
          </button>
        </div>
      ) : (
        <VerificationPanel
          generatedContent={aiContent}
          contentType="email_campaign"
          projectSlug="empathy-ledger"
          onVerified={handleVerification}
          requireElderReview={campaignData.includesCulturalContent}
        />
      )}
    </div>
  );
}
```

### Example 3: Social Media Post (Quick Verification)

```typescript
// src/app/social/new/page.tsx

'use client';

import { useState } from 'react';
import { VerificationPanel } from '@/components/ai/VerificationPanel';

export default function NewSocialPost() {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState<'twitter' | 'linkedin' | 'facebook'>('twitter');
  const [aiContent, setAiContent] = useState('');
  const [showVerification, setShowVerification] = useState(false);

  async function generatePost() {
    const response = await fetch('/api/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'social_media',
        platform,
        topic,
        maxLength: platform === 'twitter' ? 280 : 500,
      }),
    });

    const data = await response.json();
    setAiContent(data.content);
    setShowVerification(true);
  }

  async function handleVerification(feedback) {
    if (feedback.status === 'approved') {
      // Auto-post or schedule
      await fetch('/api/social/post', {
        method: 'POST',
        body: JSON.stringify({
          platform,
          content: feedback.finalContent,
        }),
      });
      alert('Posted successfully!');
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">New Social Media Post</h1>

      {!showVerification ? (
        <div className="space-y-4">
          <div>
            <label className="block mb-2">Platform</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as any)}
              className="w-full p-2 border rounded"
            >
              <option value="twitter">Twitter</option>
              <option value="linkedin">LinkedIn</option>
              <option value="facebook">Facebook</option>
            </select>
          </div>

          <div>
            <label className="block mb-2">Topic</label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full h-24 p-2 border rounded"
              placeholder="What do you want to post about?"
            />
          </div>

          <button
            onClick={generatePost}
            className="px-6 py-3 bg-green-600 text-white rounded-lg"
          >
            Generate Post
          </button>
        </div>
      ) : (
        <VerificationPanel
          generatedContent={aiContent}
          contentType={`social_media_${platform}`}
          projectSlug="act-farm"
          onVerified={handleVerification}
        />
      )}
    </div>
  );
}
```

---

## API Integration

### Create AI Generation Endpoint

```typescript
// src/app/api/ai/generate/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { type, prompt, project } = body;

  // Call your AI model (Mistral, Claude, etc.)
  const aiResponse = await fetch('http://192.168.0.34:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'act-mistral', // Your fine-tuned model
      prompt: `${prompt}\n\nWrite this in ACT's voice: grounded yet visionary, humble yet confident.`,
      stream: false,
    }),
  });

  const data = await aiResponse.json();

  return NextResponse.json({
    content: data.response,
    model: 'act-mistral',
    timestamp: new Date().toISOString(),
  });
}
```

---

## Weekly Review Setup

### Schedule Automated Reviews

Add to crontab:

```bash
# Open crontab editor
crontab -e

# Add weekly review (every Monday at 9am)
0 9 * * 1 cd /Users/benknight/Code/ACT\ Farm\ and\ Regenerative\ Innovation\ Studio && node scripts/weekly-knowledge-review.mjs >> /var/log/act-weekly-review.log 2>&1
```

Or use a task scheduler like `pm2`:

```bash
# Install pm2
npm install -g pm2

# Create ecosystem config
cat > ecosystem.config.js <<EOF
module.exports = {
  apps: [{
    name: 'act-weekly-review',
    script: './scripts/weekly-knowledge-review.mjs',
    cron_restart: '0 9 * * 1', // Every Monday at 9am
    autorestart: false,
  }]
};
EOF

# Start with pm2
pm2 start ecosystem.config.js
pm2 save
```

---

## Access Control

### Restrict Admin Dashboard

Add authentication check to the admin dashboard:

```typescript
// src/app/admin/knowledge-review/page.tsx

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function KnowledgeReviewDashboard() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Check if user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user?.id)
    .single();

  if (!user || profile?.role !== 'admin') {
    redirect('/');
  }

  // ... rest of component
}
```

### Set Up RLS Policies

The migration already includes Row Level Security policies, but you may want to customize them:

```sql
-- Only admins can view all verifications
CREATE POLICY "Admins can view all verifications"
  ON ai_content_verifications
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Only assigned elders can review
CREATE POLICY "Assigned elders can review"
  ON elder_review_queue
  FOR UPDATE
  USING (assigned_to = auth.uid());
```

---

## Elder Review Workflow

### 1. Flag Content for Elder Review

When creating content that involves cultural topics:

```typescript
async function submitForElderReview(verificationId: string, culturalTopics: string[]) {
  const supabase = createClient();

  await supabase.from('elder_review_queue').insert({
    verification_id: verificationId,
    content_type: 'blog_article',
    cultural_topics: culturalTopics,
    sensitivity_level: 'high',
    priority: 4,
  });
}
```

### 2. Elder Review Interface

Create a dedicated interface for elders:

```typescript
// src/app/elder-review/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function ElderReviewPage() {
  const [queue, setQueue] = useState([]);
  const supabase = createClient();

  useEffect(() => {
    loadQueue();
  }, []);

  async function loadQueue() {
    const { data } = await supabase
      .from('pending_elder_reviews')
      .select('*')
      .eq('assigned_to', (await supabase.auth.getUser()).data.user?.id);

    setQueue(data || []);
  }

  async function approveReview(id: string, notes: string) {
    await supabase
      .from('elder_review_queue')
      .update({
        status: 'approved',
        review_notes: notes,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', id);

    loadQueue();
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Elder Review Queue</h1>
      {queue.map((item) => (
        <div key={item.id} className="border rounded-lg p-4 mb-4">
          <h3 className="font-semibold">{item.content_type}</h3>
          <p className="text-sm text-gray-600">{item.cultural_topics?.join(', ')}</p>
          {/* Review interface */}
        </div>
      ))}
    </div>
  );
}
```

---

## Community Feedback Collection

### Add Feedback Form to Public Pages

```typescript
// src/components/CommunityFeedbackForm.tsx

'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export function CommunityFeedbackForm({ contentId, contentUrl }: { contentId: string; contentUrl: string }) {
  const [feedback, setFeedback] = useState('');
  const [type, setType] = useState<'correction' | 'suggestion' | 'appreciation' | 'concern'>('suggestion');
  const [submitted, setSubmitted] = useState(false);

  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await supabase.from('community_feedback').insert({
      content_id: contentId,
      content_url: contentUrl,
      content_type: 'blog_article',
      feedback_type: type,
      feedback_text: feedback,
      anonymous: true,
    });

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        Thank you for your feedback! We appreciate your input.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="font-semibold">Share Your Feedback</h3>

      <div>
        <label className="block mb-2">Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as any)}
          className="w-full p-2 border rounded"
        >
          <option value="correction">Correction</option>
          <option value="suggestion">Suggestion</option>
          <option value="appreciation">Appreciation</option>
          <option value="concern">Concern</option>
        </select>
      </div>

      <div>
        <label className="block mb-2">Your Feedback</label>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="w-full h-24 p-2 border rounded"
          required
        />
      </div>

      <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-lg">
        Submit Feedback
      </button>
    </form>
  );
}
```

---

## Training Dataset Export

### Export Verified Content for Fine-Tuning

```typescript
// scripts/export-training-data.mjs

import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { writeFile } from 'fs/promises';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function exportTrainingData() {
  // Get all approved verifications with high quality
  const { data } = await supabase
    .from('training_ready_content')
    .select('*');

  // Convert to training format
  const trainingData = data.map(item => ({
    messages: [
      {
        role: 'system',
        content: 'You are a content writer for A Curious Tractor...',
      },
      {
        role: 'user',
        content: `Write a ${item.content_type} for ${item.project_slug}`,
      },
      {
        role: 'assistant',
        content: item.completion,
      },
    ],
  }));

  // Save as JSONL
  const jsonl = trainingData.map(item => JSON.stringify(item)).join('\n');
  await writeFile('./training-data-verified.jsonl', jsonl);

  console.log(`Exported ${trainingData.length} training examples`);
}

exportTrainingData();
```

---

## Monitoring and Alerts

### Set Up Email Alerts

```typescript
// scripts/check-review-queue.mjs

import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkAndAlert() {
  // Check for overdue reviews
  const { data: overdue } = await supabase
    .from('knowledge_review_schedule')
    .select('*')
    .eq('review_status', 'overdue');

  // Check pending elder reviews
  const { data: elderQueue } = await supabase
    .from('pending_elder_reviews')
    .select('*');

  if (overdue.length > 0 || elderQueue.length > 5) {
    // Send email alert
    const transporter = nodemailer.createTransporter({
      // Your email config
    });

    await transporter.sendMail({
      to: 'admin@acurioust ractor.org',
      subject: 'ACT Knowledge Review Alerts',
      text: `
        Overdue Reviews: ${overdue.length}
        Pending Elder Reviews: ${elderQueue.length}
      `,
    });
  }
}

checkAndAlert();
```

---

## Best Practices

### 1. Always Verify Cultural Content

```typescript
// Good
<VerificationPanel
  generatedContent={content}
  requireElderReview={true} // For Indigenous content
  contentType="cultural_story"
/>

// Bad - skipping verification for cultural content
```

### 2. Track Quality Trends

Run weekly reviews and monitor score trends over time:

```bash
node scripts/weekly-knowledge-review.mjs
```

### 3. Update Training Data Regularly

Every quarter, export verified content and re-fine-tune:

```bash
node scripts/export-training-data.mjs
# Then run fine-tuning process
```

### 4. Respond to Community Feedback

Check the feedback queue weekly and address concerns:

```sql
SELECT * FROM community_feedback WHERE status = 'new';
```

---

## Troubleshooting

### Issue: Verification Panel Not Showing

Check that:
1. Component is imported correctly
2. Supabase client is configured
3. Database migration has been run

### Issue: Elder Reviews Not Triggering

Ensure `requireElderReview` prop is set to `true`:

```typescript
<VerificationPanel requireElderReview={true} />
```

### Issue: Weekly Review Script Not Running

Check cron syntax and permissions:

```bash
# Test manually first
node scripts/weekly-knowledge-review.mjs

# Check cron logs
tail -f /var/log/cron
```

---

## Next Steps

1. Run the database migration
2. Add VerificationPanel to your first content generation flow
3. Test the verification workflow
4. Set up weekly automated reviews
5. Create elder review accounts and assign first reviews
6. Monitor quality scores and iterate

---

## Support

For questions or issues:
- Check the [HUMAN_VERIFICATION_SYSTEM.md](./HUMAN_VERIFICATION_SYSTEM.md) for detailed documentation
- Review the [IMPLEMENTATION_ROADMAP.md](./IMPLEMENTATION_ROADMAP.md) for full AI system setup
- Contact ACT team leads for access control questions

---

**Last Updated:** December 25, 2024
**Version:** 1.0.0
