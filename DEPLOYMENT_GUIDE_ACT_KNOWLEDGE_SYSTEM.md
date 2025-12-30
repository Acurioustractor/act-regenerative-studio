# ACT Knowledge Consolidation System - Deployment Guide

## Table of Contents
1. [System Overview](#system-overview)
2. [What Was Built](#what-was-built)
3. [Files Created/Modified](#files-createdmodified)
4. [Prerequisites](#prerequisites)
5. [Local Testing](#local-testing)
6. [Production Deployment](#production-deployment)
7. [Testing Checklist](#testing-checklist)
8. [Troubleshooting](#troubleshooting)
9. [Next Steps](#next-steps)

---

## System Overview

The ACT Knowledge Consolidation system provides a unified interface to query the comprehensive ACT knowledge base through both CLI and Web UI. It uses RAG (Retrieval-Augmented Generation) to provide intelligent answers with source citations, cost tracking, and confidence scoring.

**Total Knowledge Coverage**: 6,451 lines across 3 parts
- Part 1 (1,970 lines): Brand, Projects, Methodology
- Part 2 (1,281 lines): People, Systems, Infrastructure
- Part 3 (3,200 lines): Finance, Legal, Operations, Content Templates

---

## What Was Built

### 1. CLI Tool (`scripts/ask-act.mjs`)
- **Purpose**: Query ACT knowledge from the command line
- **Features**:
  - Two-tier query system (quick/deep)
  - Source citations with confidence scores
  - Cost and latency tracking
  - Pretty-printed terminal output
  - Comprehensive error handling
- **Lines**: 117

### 2. Knowledge Base Part 3 (Finance, Legal, Operations, Templates)
- **Purpose**: Complete operational knowledge for ACT
- **Coverage**:
  - Section 11: Finance & Accounting (revenue, invoicing, compliance)
  - Section 12: Legal & Compliance (structure, contracts, IP)
  - Section 13: Operations (processes, checklists, workflows)
  - Section 14: Content Templates (40+ ready-to-use templates)
- **Lines**: 3,200
- **File**: `.claude/skills/act-knowledge-base/ACT_COMPLETE_KNOWLEDGE_BASE_PART_3.md`

### 3. Web UI Component (`src/components/AskACT.tsx`)
- **Purpose**: Beautiful web interface for knowledge queries
- **Features**:
  - Real-time query input with Enter key support
  - Quick/Deep tier selection
  - Source visibility toggle
  - Cost/time/confidence metrics
  - 8 example queries for discovery
  - Responsive design with Tailwind CSS
- **Lines**: 235

### 4. Web Page (`src/app/ask/page.tsx`)
- **Purpose**: Dedicated page for the AskACT interface
- **Route**: `/ask`
- **Metadata**: SEO-optimized title and description
- **Lines**: 15

### 5. Package.json Integration
- **Added Script**: `"ask": "node scripts/ask-act.mjs"`
- **Usage**: `npm run ask "your question"`

---

## Files Created/Modified

### New Files (4)
```
/Users/benknight/Code/act-regenerative-studio/scripts/ask-act.mjs
/Users/benknight/Code/act-regenerative-studio/.claude/skills/act-knowledge-base/ACT_COMPLETE_KNOWLEDGE_BASE_PART_3.md
/Users/benknight/Code/act-regenerative-studio/src/components/AskACT.tsx
/Users/benknight/Code/act-regenerative-studio/src/app/ask/page.tsx
```

### Modified Files (1)
```
/Users/benknight/Code/act-regenerative-studio/package.json
```

### Existing Infrastructure (leveraged)
```
/Users/benknight/Code/act-regenerative-studio/src/app/api/v1/intelligence/ask/route.ts
/Users/benknight/Code/act-regenerative-studio/src/lib/ai-intelligence/unified-rag-service.ts
```

---

## Prerequisites

### Required
- Node.js 18+ installed
- npm or yarn
- Next.js dev server running
- Environment variables configured:
  - `OPENAI_API_KEY` (for embeddings and LLM calls)
  - Supabase credentials (if using database-backed knowledge)

### Optional
- Vercel CLI (for production deployment)
- Git (for version control and deployment)

---

## Local Testing

### Step 1: Start the Development Server

```bash
cd /Users/benknight/Code/act-regenerative-studio
npm run dev
```

**Expected Output**:
```
> act-regenerative-studio@0.1.0 dev
> next dev

  ▲ Next.js 14.x.x
  - Local:        http://localhost:3000
  - Ready in 2.5s
```

**Verification**: Server starts without errors and shows "Ready" message.

---

### Step 2: Test the CLI Tool

Open a **new terminal window** (keep dev server running) and run:

```bash
cd /Users/benknight/Code/act-regenerative-studio
npm run ask "What's the LCAA methodology?"
```

**Expected Output**:
```
🔍 Asking ACT: "What's the LCAA methodology?"

⚙️  Tier: deep

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 Answer:

LCAA (Living Commons, Awareness, Accountability) is ACT's core methodology...
[Full answer with detailed explanation]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💰 Cost: $0.0234
⏱️  Time: 1456ms
```

**Try Different Tiers**:
```bash
# Quick tier (faster, cheaper)
npm run ask "How do I create an invoice?" --tier=fast

# Deep tier with sources (default, more comprehensive)
npm run ask "What's our profit-sharing policy?" --sources
```

**Expected Behavior**:
- Fast tier: ~500-1000ms, $0.01-0.02
- Deep tier: ~1000-2000ms, $0.02-0.04
- Sources flag: Shows 5-10 source documents with confidence scores

---

### Step 3: Test the Web UI

1. **Open Browser**: Navigate to `http://localhost:3000/ask`

2. **Verify Page Load**:
   - Page title: "Ask ACT"
   - Description: "Query the comprehensive ACT knowledge base..."
   - Input field with placeholder
   - Quick/Deep radio buttons
   - "Show sources" checkbox
   - 8 example query buttons

3. **Test Query Flow**:

   **a. Click Example Query**:
   - Click "What's the LCAA methodology?"
   - Query should populate in input field
   - Click "Ask" button

   **b. Verify Response**:
   - Loading spinner appears
   - Answer appears in white card with border
   - Metadata shows: Cost, Time, Confidence
   - Sources section available (if "Show sources" checked)

   **c. Try Manual Query**:
   - Type "How do I invoice NDIS clients?"
   - Press Enter key (should submit)
   - Verify answer appears

4. **Test Tier Switching**:
   - Select "Quick" radio button
   - Ask: "Daily operations checklist"
   - Note faster response time, lower cost

   - Select "Deep" radio button
   - Ask same question
   - Note more comprehensive answer, higher cost

5. **Test Sources Display**:
   - Check "Show sources" checkbox
   - Ask: "Grant application budget template"
   - Expand "📚 Sources" dropdown
   - Verify: Title, Project, Confidence %, Excerpt visible

---

### Step 4: Verify Knowledge Coverage

Test queries across all sections to ensure knowledge is accessible:

```bash
# Section 11: Finance
npm run ask "What's our revenue model?"
npm run ask "How do I create an NDIS invoice?"
npm run ask "What's the profit-sharing policy?"

# Section 12: Legal
npm run ask "Explain the dual-entity structure"
npm run ask "What IP do we own vs license?"

# Section 13: Operations
npm run ask "Daily operations checklist"
npm run ask "How do we onboard new team members?"

# Section 14: Content Templates
npm run ask "Homepage hero copy template"
npm run ask "Grant application budget template"
npm run ask "Meeting agenda template"
```

**Expected Results**: All queries should return relevant, accurate answers with high confidence (>80%).

---

## Production Deployment

### Option 1: Vercel Deployment (Recommended)

#### Prerequisites
```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login
```

#### Deployment Steps

1. **Commit Changes**:
```bash
cd /Users/benknight/Code/act-regenerative-studio
git add .
git commit -m "feat: add ACT Knowledge Consolidation system

- CLI tool for command-line queries
- Knowledge Base Part 3 (3,200 lines)
- Web UI component and /ask page
- Total: 6,451 lines of queryable knowledge"
git push origin main
```

2. **Deploy to Production**:
```bash
vercel --prod
```

3. **Verify Environment Variables**:
```bash
vercel env ls
```

Ensure these are set:
- `OPENAI_API_KEY`
- `NEXT_PUBLIC_SUPABASE_URL` (if applicable)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (if applicable)

Add if missing:
```bash
vercel env add OPENAI_API_KEY
# Paste your key when prompted
# Select: Production, Preview, Development
```

4. **Test Production Deployment**:
   - Visit: `https://your-domain.vercel.app/ask`
   - Run through Web UI tests from Step 3
   - Verify sources, costs, and latency

#### CLI in Production
The CLI tool requires a running Next.js server. For production use:

```bash
# Point to production API
npm run ask "your question" --port=443 --host=your-domain.vercel.app
```

Or create a production-specific script in `package.json`:
```json
{
  "scripts": {
    "ask:prod": "PROD_URL=https://your-domain.vercel.app node scripts/ask-act-prod.mjs"
  }
}
```

---

### Option 2: Manual Deployment

If using a different hosting provider:

1. **Build the Application**:
```bash
npm run build
```

2. **Verify Build Success**:
```bash
# Check for .next directory
ls -la .next/

# Test production build locally
npm run start
```

3. **Deploy Built Files**:
   - Upload `.next/` directory
   - Upload `public/` directory
   - Upload `package.json` and `package-lock.json`
   - Run `npm install --production` on server
   - Start with `npm run start`

4. **Configure Environment**:
   - Set all required environment variables
   - Ensure `OPENAI_API_KEY` is accessible

---

## Testing Checklist

Use this checklist to verify the deployment:

### CLI Testing
- [ ] `npm run ask "test query"` returns answer
- [ ] `--tier=fast` flag works (faster, cheaper)
- [ ] `--tier=deep` flag works (comprehensive)
- [ ] `--sources` flag shows source documents
- [ ] Cost and time metrics display
- [ ] Error handling works (try with dev server stopped)
- [ ] Help text appears when no query provided

### Web UI Testing
- [ ] `/ask` page loads without errors
- [ ] Page title and description correct
- [ ] Input field accepts text
- [ ] Enter key submits query
- [ ] "Ask" button submits query
- [ ] Loading spinner appears during query
- [ ] Answer displays in formatted card
- [ ] Quick tier radio button works
- [ ] Deep tier radio button works
- [ ] "Show sources" checkbox works
- [ ] Sources dropdown expands/collapses
- [ ] Source metadata correct (title, project, confidence)
- [ ] Cost/time/confidence metrics display
- [ ] Example queries populate input on click
- [ ] Mobile responsive (test on small screen)

### Knowledge Coverage Testing
Test at least one query from each section:

- [ ] Section 11 (Finance): "What's our revenue model?"
- [ ] Section 12 (Legal): "Dual-entity structure"
- [ ] Section 13 (Operations): "Daily operations checklist"
- [ ] Section 14 (Content): "Homepage hero template"

### Edge Cases
- [ ] Empty query (should show error or help text)
- [ ] Very long query (5000+ chars - should error gracefully)
- [ ] Special characters in query
- [ ] Query with no relevant results
- [ ] Rapid successive queries (no race conditions)

### Performance Testing
- [ ] Quick tier: <1000ms response time
- [ ] Deep tier: <2000ms response time
- [ ] Cost per query: $0.01-0.04 (acceptable range)
- [ ] No memory leaks (check after 20+ queries)

---

## Troubleshooting

### Issue: CLI returns "ECONNREFUSED"

**Cause**: Next.js dev server is not running.

**Solution**:
```bash
# Terminal 1: Start dev server
cd /Users/benknight/Code/act-regenerative-studio
npm run dev

# Terminal 2: Run CLI
npm run ask "your question"
```

---

### Issue: "OPENAI_API_KEY not found"

**Cause**: Environment variable not set.

**Solution**:
```bash
# Check .env.local file
cat /Users/benknight/Code/act-regenerative-studio/.env.local

# Should contain:
OPENAI_API_KEY=sk-...

# If missing, add it:
echo "OPENAI_API_KEY=sk-your-key-here" >> .env.local

# Restart dev server
```

---

### Issue: "No knowledge found" or low confidence

**Cause**: Knowledge base not ingested or query too vague.

**Solution**:
1. **Verify knowledge files exist**:
```bash
ls -la /Users/benknight/Code/act-regenerative-studio/.claude/skills/act-knowledge-base/
```

2. **Check file sizes**:
```bash
wc -l /Users/benknight/Code/act-regenerative-studio/.claude/skills/act-knowledge-base/*.md
```

Expected:
- Part 1: ~1970 lines
- Part 2: ~1281 lines
- Part 3: ~3192 lines

3. **Try more specific query**:
   - Bad: "How does this work?"
   - Good: "How does NDIS invoicing work in JusticeHub?"

---

### Issue: Web UI shows blank page

**Cause**: Build error or route not found.

**Solution**:
```bash
# Check Next.js console for errors
# Look for compilation errors

# Verify page file exists
ls -la /Users/benknight/Code/act-regenerative-studio/src/app/ask/page.tsx

# Verify component exists
ls -la /Users/benknight/Code/act-regenerative-studio/src/components/AskACT.tsx

# Clear Next.js cache and rebuild
rm -rf .next
npm run dev
```

---

### Issue: Sources not displaying

**Cause**: "Show sources" checkbox not checked or no sources found.

**Solution**:
1. Check the "Show sources" checkbox
2. Submit query
3. Look for "📚 Sources" dropdown
4. If still missing, check browser console for errors

---

### Issue: High costs (>$0.10 per query)

**Cause**: Using deep tier with very long queries or many sources.

**Solution**:
- Switch to "Quick" tier for routine queries
- Reduce `topK` parameter in API call (default: 10)
- Use more specific queries (less context needed)

---

### Issue: Slow response times (>5 seconds)

**Cause**: Network latency, large knowledge base, or deep tier complexity.

**Solution**:
- Switch to "Quick" tier
- Check internet connection
- Verify OpenAI API status: https://status.openai.com
- Consider caching common queries (future enhancement)

---

## Next Steps

### Immediate (Deploy & Test)
1. **Complete Testing Checklist**: Run through all tests above
2. **Deploy to Production**: Follow Vercel deployment steps
3. **Share with Team**: Send `/ask` URL to team members for feedback

### Short-term (1-2 weeks)
4. **Add Authentication**: Protect `/ask` page with login
   - Use NextAuth.js or Supabase Auth
   - Limit access to ACT team members
   - Track usage per user

5. **Integrate into Dashboard**: Add to main ACT dashboard
   - Navigation link in header
   - Quick search widget on homepage
   - Recent queries sidebar

6. **Set Up Monitoring**:
   - Log all queries to database
   - Track costs per day/week/month
   - Monitor response times
   - Alert on errors or high costs

### Medium-term (1-2 months)
7. **Enhance Knowledge Base**:
   - Add Part 4: Case studies and success stories
   - Add Part 5: Technical documentation
   - Schedule quarterly knowledge reviews

8. **Improve UX**:
   - Add query history (per user)
   - Implement query suggestions (autocomplete)
   - Add "Ask follow-up" feature
   - Export answers as markdown/PDF

9. **Optimize Performance**:
   - Implement query result caching
   - Pre-generate embeddings for common queries
   - Add edge caching for production

### Long-term (3-6 months)
10. **Advanced Features**:
    - Multi-turn conversations (chat interface)
    - Voice input/output
    - Integration with Slack/Discord
    - API for external tools

11. **Analytics & Insights**:
    - Query trends dashboard
    - Knowledge gap analysis (unanswered questions)
    - Popular topics report
    - User engagement metrics

12. **Team Training**:
    - Document for onboarding materials
    - Create video tutorial
    - Host team demo/workshop
    - Build query best practices guide

---

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Interfaces                         │
├─────────────────────────────┬───────────────────────────────────┤
│  CLI Tool                   │  Web UI                           │
│  scripts/ask-act.mjs        │  src/app/ask/page.tsx             │
│  - Terminal queries         │  - Browser interface              │
│  - Flags: --tier, --sources │  - React component                │
│  - Pretty output            │  - Real-time updates              │
└─────────────┬───────────────┴───────────────┬───────────────────┘
              │                               │
              │    HTTP POST/GET              │
              ▼                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                API Endpoint                                      │
│  src/app/api/v1/intelligence/ask/route.ts                       │
│  - Request validation                                            │
│  - Error handling                                                │
│  - Response formatting                                           │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              │ unifiedRAG.ask()
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              Unified RAG Service                                 │
│  src/lib/ai-intelligence/unified-rag-service.ts                 │
│  - Embedding generation (OpenAI)                                 │
│  - Vector similarity search                                      │
│  - Context assembly                                              │
│  - LLM query (GPT-4)                                             │
│  - Cost tracking                                                 │
│  - Confidence scoring                                            │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              │ Query knowledge
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Knowledge Base                                 │
│  .claude/skills/act-knowledge-base/                             │
│  ├── Part 1 (1,970 lines): Brand, Projects, Methodology         │
│  ├── Part 2 (1,281 lines): People, Systems, Infrastructure      │
│  └── Part 3 (3,200 lines): Finance, Legal, Ops, Templates       │
│                                                                  │
│  Total: 6,451 lines of queryable ACT knowledge                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Example Queries & Expected Results

### Finance Queries
```bash
npm run ask "What's our revenue model?"
# Expected: Breakdown of JusticeHub, Harvest, BCV, Goods revenue streams

npm run ask "How do I create an NDIS invoice?"
# Expected: Step-by-step NDIS invoicing process with compliance notes

npm run ask "What's the 40% profit-sharing policy?"
# Expected: Explanation of profit distribution, calculation, timing
```

### Legal Queries
```bash
npm run ask "Explain the dual-entity structure"
# Expected: ACT Studio (for-profit) + ACT Farm (nonprofit) structure

npm run ask "What IP do we own?"
# Expected: List of owned IP, licensed IP, open source components
```

### Operations Queries
```bash
npm run ask "Daily operations checklist"
# Expected: Morning, afternoon, evening task lists

npm run ask "How do we onboard new team members?"
# Expected: 7-day onboarding process with tasks and resources
```

### Content Template Queries
```bash
npm run ask "Homepage hero copy template"
# Expected: Hero section template with headline, subhead, CTA structure

npm run ask "Grant application budget template"
# Expected: Budget line items, justification format, funder requirements

npm run ask "Meeting agenda template"
# Expected: Pre-meeting, during, post-meeting structure
```

---

## Success Metrics

Track these metrics to measure system success:

### Usage Metrics
- **Daily Active Users**: Team members using CLI or Web UI
- **Queries per Day**: Total knowledge queries
- **Query Success Rate**: % of queries with >70% confidence answers
- **Repeat Usage**: % of users returning within 7 days

### Performance Metrics
- **Avg Response Time**: Target <1500ms (deep tier)
- **Avg Cost per Query**: Target <$0.03
- **Uptime**: Target >99.5%
- **Error Rate**: Target <1%

### Business Metrics
- **Time Saved**: Estimated hours saved vs manual knowledge lookup
- **Onboarding Efficiency**: New team member time-to-productivity
- **Knowledge Coverage**: % of team questions answerable by system
- **User Satisfaction**: NPS or satisfaction score

### Knowledge Quality Metrics
- **Answer Confidence**: Avg confidence score (target >80%)
- **Source Relevance**: % of sources rated "helpful"
- **Knowledge Gaps**: Unanswered questions → new knowledge to add
- **Update Frequency**: Last knowledge base update date

---

## Support & Contact

For questions, issues, or feedback:

- **Technical Issues**: Check Troubleshooting section first
- **Knowledge Gaps**: Note unanswered queries for knowledge base updates
- **Feature Requests**: Document in project backlog
- **Emergency**: Contact Ben Knight (system owner)

---

## Changelog

### v1.0.0 (2025-12-30)
- Initial deployment
- CLI tool with quick/deep tiers
- Knowledge Base Part 3 (3,200 lines)
- Web UI component and /ask page
- Total: 6,451 lines of queryable knowledge
- Cost tracking and source citations
- 8 example queries for discovery

---

**Deployed by**: Ben Knight
**Deployment Date**: 2025-12-30
**System Status**: Ready for Production
**Next Review**: 2026-01-30
