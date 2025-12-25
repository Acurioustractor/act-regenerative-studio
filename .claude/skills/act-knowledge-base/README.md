# ACT Knowledge Base - AI Training System

## Overview

This directory contains a complete knowledge base system for training AI models to deeply understand A Curious Tractor's ecosystem, voice, methodology, and operations.

## Files in This Directory

### 1. `skill.md`
**Claude Skill Definition**
- Defines the `/act-knowledge` command
- Lists capabilities and use cases
- Provides example invocations
- **Status:** ✅ Ready to use

### 2. `ACT_COMPLETE_KNOWLEDGE_BASE.md` (Part 1)
**Comprehensive Knowledge Base - Sections 1-6**
- Core Identity & Mission
- Organizational Structure
- LCAA Methodology (detailed)
- All Projects & Initiatives
- Brand Voice & Communication
- Technical Infrastructure
- **Size:** ~50,000 tokens (~400 pages)
- **Status:** ✅ Complete

### 3. `ACT_COMPLETE_KNOWLEDGE_BASE_PART_2.md`
**Comprehensive Knowledge Base - Sections 7-10**
- Community Engagement & Partnerships
- Cultural Protocols & Indigenous Data Sovereignty
- Impact Measurement Framework
- Content Library & Knowledge Repository
- **Size:** ~28,000 tokens (~200 pages)
- **Status:** ✅ Complete

### 4. `LLM_TRAINING_STRATEGY.md`
**Implementation Roadmap**
- Recommended AI models (Claude 3.5 Sonnet, GPT-4 Turbo)
- Three-tier knowledge architecture
- Vector database setup guide
- RAG + fine-tuning hybrid approach
- 6-week implementation plan
- Cost analysis and ROI
- **Status:** ✅ Complete, ready to execute

### 5. `README.md` (this file)
**Navigation and Quick Start**

---

## Quick Start: Using the Knowledge Base

### For Immediate Use (Manual)

You can start using ACT knowledge right away by referencing these documents:

**Writing Blog Content:**
```
Read: Section 5 (Brand Voice) + Section 10 (Content Library)
Apply: Voice characteristics, writing patterns, farm metaphors
Check: Content checklists before publishing
```

**Creating Project Content:**
```
Read: Section 4 (Projects) for specific project details
Apply: LCAA methodology structure
Reference: Impact frameworks from Section 9
```

**Technical Development:**
```
Read: Section 6 (Technical Infrastructure)
Apply: Multi-tenant patterns, Registry API specs
Reference: Security and cultural safety protocols
```

### For AI Integration (Next Phase)

Follow the implementation plan in `LLM_TRAINING_STRATEGY.md`:

**Phase 1 (Week 1-2): Foundation**
1. Set up vector database (Supabase pgvector)
2. Generate embeddings for all knowledge base content
3. Build retrieval function
4. Test with sample queries

**Phase 2 (Week 3): Skill Integration**
1. Connect `/act-knowledge` skill to vector database
2. Implement RAG retrieval
3. Test across use cases
4. Refine prompts and retrieval

**Phase 3 (Week 4-5): Fine-Tuning (Optional)**
1. Prepare fine-tuning dataset from blog articles
2. Fine-tune GPT-4 or Claude for brand voice
3. Evaluate voice consistency
4. Compare RAG vs fine-tuned vs hybrid

**Phase 4 (Week 6): Production Deployment**
1. Deploy retrieval system
2. Create admin interface for knowledge base updates
3. Document usage for team
4. Train team on AI-assisted content creation

---

## Knowledge Base Statistics

### Content Volume

| Category | Items | Tokens | Pages (Est.) |
|----------|-------|--------|--------------|
| Core Identity | 1 section | ~8,000 | 60 |
| Organizational Structure | 1 section | ~3,000 | 20 |
| LCAA Methodology | 1 section | ~6,000 | 45 |
| Projects & Initiatives | 6 projects | ~15,000 | 110 |
| Brand Voice | 1 section | ~8,000 | 60 |
| Technical Infrastructure | 1 section | ~7,000 | 50 |
| Community Engagement | 1 section | ~5,000 | 35 |
| Cultural Protocols | 1 section | ~6,000 | 45 |
| Impact Framework | 1 section | ~5,000 | 35 |
| Content Library | 1 section | ~7,000 | 50 |
| **TOTAL** | **10 sections** | **~70,000** | **~510** |

### Additional Content Sources

| Source | Volume | Status | Notes |
|--------|--------|--------|-------|
| Blog Articles (JusticeHub) | 36 articles | ✅ Imported | Webflow CMS |
| Blog Articles (ACT Main) | 21 articles | ✅ Imported | Webflow CMS |
| Media Items (Year in Review) | 20 items | ✅ Enriched | 100% themed, 95% captioned |
| Project Documentation | 350+ pages | ✅ Available | Across all codebases |
| **TOTAL CORPUS** | **~460,000 tokens** | **~350 pages** | **Ready for training** |

---

## AI Model Recommendations

### Primary: Anthropic Claude 3.5 Sonnet

**Why Claude:**
- ✅ **200K context window** - Can hold entire ACT knowledge base
- ✅ **Strong instruction following** - Respects brand guidelines and cultural protocols
- ✅ **Nuanced understanding** - Handles complexity of ACT's work
- ✅ **Ethical alignment** - Built-in values align with ACT mission
- ✅ **Tool use capability** - Can interact with databases, APIs, registries

**Use For:**
- Content creation and refinement
- Campaign messaging
- Community communication
- Technical documentation
- Strategic planning support

**Cost:**
- ~$3 per 1M input tokens
- ~$15 per 1M output tokens
- Estimated: $50-200/month for typical ACT usage

### Alternative: OpenAI GPT-4 Turbo

**Why GPT-4:**
- ✅ **Fine-tuning available** - Can deeply internalize brand voice
- ✅ **128K context window** - Large but smaller than Claude
- ✅ **Strong generation** - Excellent at creative content
- ✅ **Ecosystem mature** - Many tools and integrations

**Use For:**
- Brand voice fine-tuning
- Blog article generation
- Social media content
- Email sequences
- Grant proposals

**Cost:**
- ~$10 per 1M input tokens (GPT-4 Turbo)
- ~$30 per 1M output tokens
- Fine-tuning: $25/M training tokens, $75/M hosted tokens
- Estimated: $100-300/month including fine-tuning

### Recommended: Hybrid Approach

**RAG (Claude 3.5 Sonnet) for:**
- Factual knowledge retrieval
- Project-specific information
- Technical documentation
- Impact metrics and data
- Community protocols

**Fine-Tuned (GPT-4) for:**
- Brand voice consistency
- Writing style internalization
- Tone and personality
- Farm metaphors and patterns
- LCAA methodology framing

**Benefits:**
- Best of both approaches
- Factual accuracy + voice consistency
- Flexibility for different tasks
- Cost optimization (use right tool for job)

---

## Use Cases

### 1. Website Content Creation

**Scenario:** Need homepage hero copy for The Harvest

**Process:**
```
1. Query: /act-knowledge "Write homepage hero for The Harvest"
2. AI retrieves: The Harvest project details, brand voice, farm metaphors
3. AI generates: Grounded yet visionary copy with heritage focus
4. Review: Against brand checklist
5. Publish: With community voice integrated
```

**Expected Output:**
- 2-3 headline options
- Supporting paragraph (50-100 words)
- Call to action
- Farm metaphor integrated
- Heritage and therapeutic horticulture themes

### 2. Blog Article Generation

**Scenario:** Write JusticeHub article on community courts

**Process:**
```
1. Query: /act-knowledge "Draft blog post on community court model for JusticeHub"
2. AI retrieves: JusticeHub details, LCAA methodology, justice impact data
3. AI generates: Story-driven article with LCAA structure
4. Review: Add specific community stories (with consent)
5. Refine: Voice, tone, accuracy
6. Publish: After community review
```

**Expected Output:**
- 1000-1500 word article
- Opening: Specific problem from community perspective
- Middle: LCAA structure (Listen → Curiosity → Action → Art)
- Closing: Call to action with vision
- Includes: Stats, quotes (placeholder for real ones), examples

### 3. Campaign Messaging

**Scenario:** Launch Goods on Country bed campaign

**Process:**
```
1. Query: /act-knowledge "Create campaign messaging for Goods on Country bed launch"
2. AI retrieves: Goods on Country details, 40% profit model, community ownership
3. AI generates: Multi-channel messaging (social, email, web)
4. Review: Community co-design workshop
5. Refine: Based on feedback
6. Launch: Coordinated across platforms
```

**Expected Output:**
- Email sequence (3-5 emails)
- Social media posts (10-15 variants)
- Press release draft
- FAQ content
- Landing page copy

### 4. Grant Proposal Writing

**Scenario:** Apply for conservation funding for BCV

**Process:**
```
1. Query: /act-knowledge "Draft grant proposal for BCV conservation funding"
2. AI retrieves: BCV details, impact framework, conservation metrics
3. AI generates: Structured proposal with evidence
4. Review: Add specific data, community letters of support
5. Refine: Match funder priorities
6. Submit: After final review
```

**Expected Output:**
- Executive summary (200 words)
- Problem statement (community voice)
- Methodology (LCAA applied to conservation)
- Impact metrics (environmental + social + economic + cultural)
- Budget and timeline
- Evaluation plan

### 5. Technical Documentation

**Scenario:** Document Empathy Ledger consent architecture

**Process:**
```
1. Query: /act-knowledge "Document Empathy Ledger consent system for developers"
2. AI retrieves: Technical infrastructure, cultural protocols, consent architecture
3. AI generates: Developer-focused documentation
4. Review: Technical accuracy, code examples
5. Publish: In GitHub wiki or docs site
```

**Expected Output:**
- Architecture overview
- Database schema
- RLS policies
- Code examples
- Cultural protocol integration
- API endpoints
- Testing guidance

### 6. Community Communication

**Scenario:** Monthly update email to BCV community

**Process:**
```
1. Query: /act-knowledge "Write monthly BCV community update email"
2. AI retrieves: BCV details, community engagement practices, recent activities
3. AI generates: Warm, authentic update
4. Review: Add specific names, photos, events
5. Send: Via newsletter platform
```

**Expected Output:**
- Welcoming opening
- Recent highlights (habitat restoration, residencies, events)
- Community shout-outs
- Upcoming opportunities
- Call to action (working bee, event)
- Closing with vision

### 7. Onboarding New Team Members

**Scenario:** New developer joins, needs to understand ACT quickly

**Process:**
```
1. New hire reads: Sections 1-3 (Core Identity, Structure, LCAA)
2. Asks AI: /act-knowledge "Explain ACT's approach to Indigenous data sovereignty"
3. AI retrieves: Cultural protocols, OCAP principles, technical implementation
4. AI answers: With context, examples, and code patterns
5. Follow-up: New hire can ask clarifying questions
```

**Expected Benefit:**
- Faster onboarding (days instead of weeks)
- Consistent understanding across team
- Self-service learning
- Cultural competency from day one
- Technical patterns understood

---

## Implementation Roadmap

### Immediate (No AI Setup Required)

**Week 1:**
- [ ] Read all knowledge base sections (team-wide)
- [ ] Create shared team folder with PDFs
- [ ] Reference during content creation
- [ ] Use checklists before publishing
- [ ] Bookmark for quick access

**Benefits:**
- Immediate consistency improvement
- Team alignment on voice and values
- Faster onboarding
- Quality control

### Short-Term (AI Setup - 2 Weeks)

**Week 1: Database Setup**
- [ ] Create `act_knowledge_base` table in Supabase
- [ ] Write script to chunk knowledge base documents
- [ ] Generate embeddings using OpenAI text-embedding-3-large
- [ ] Upload to vector database
- [ ] Test semantic search queries

**Week 2: Retrieval System**
- [ ] Build retrieval API endpoint
- [ ] Implement similarity search with pgvector
- [ ] Add filtering (by section, project, content type)
- [ ] Create prompt templates for different use cases
- [ ] Test with Claude 3.5 Sonnet

**Deliverable:** Working RAG system for knowledge retrieval

### Medium-Term (Fine-Tuning - 3 Weeks)

**Week 3: Fine-Tuning Prep**
- [ ] Extract 50+ blog articles
- [ ] Format as training dataset (prompt + completion pairs)
- [ ] Create evaluation dataset (hold-out set)
- [ ] Define voice consistency metrics
- [ ] Prepare GPT-4 fine-tuning job

**Week 4-5: Fine-Tuning & Evaluation**
- [ ] Run fine-tuning job (GPT-4 Turbo)
- [ ] Evaluate voice consistency on test set
- [ ] Compare: Base model vs RAG vs Fine-tuned vs Hybrid
- [ ] A/B test with team
- [ ] Select final approach

**Deliverable:** Fine-tuned model with ACT brand voice

### Long-Term (Production & Scale - Ongoing)

**Month 2:**
- [ ] Deploy hybrid system (RAG + fine-tuned)
- [ ] Create team interface (Slack bot, web UI, or API)
- [ ] Train team on AI-assisted workflows
- [ ] Set up auto-updating pipeline (new content → re-embed)
- [ ] Establish review process (human-in-loop)

**Month 3+:**
- [ ] Collect usage data and feedback
- [ ] Iterate on prompts and retrieval
- [ ] Expand use cases
- [ ] Build custom tools (email generator, social scheduler)
- [ ] Measure ROI (time saved, quality improvement)

**Deliverable:** Production AI system saving 40+ hours/month

---

## Cost-Benefit Analysis

### Setup Costs (One-Time)

| Item | DIY Cost (Hours) | Outsource Cost ($) | Notes |
|------|------------------|-------------------|-------|
| Vector DB Setup | 10 hours | $1,000-1,500 | Supabase schema, embeddings |
| Retrieval System | 20 hours | $2,000-3,000 | API, prompt engineering |
| Fine-Tuning Prep | 15 hours | $1,500-2,000 | Dataset creation, evaluation |
| Fine-Tuning Execution | 5 hours | $500-1,000 | GPT-4 job, testing |
| Production Deployment | 10 hours | $1,000-1,500 | Team interface, documentation |
| Training & Docs | 20 hours | $2,000-3,000 | Team onboarding, guidelines |
| **TOTAL** | **80 hours** | **$8,000-12,000** | **3-4 weeks** |

### Ongoing Costs (Monthly)

| Item | Cost | Notes |
|------|------|-------|
| OpenAI API (embeddings) | $5-10 | Text-embedding-3-large |
| Claude 3.5 Sonnet (RAG) | $50-200 | Content generation |
| GPT-4 Fine-Tuned (voice) | $50-100 | Hosted model usage |
| Maintenance (updates) | 5-10 hours | New content embedding |
| **TOTAL** | **$105-310/month** | **+ 5-10 hours** |

### ROI Calculation

**Time Saved:**
- Blog articles: 3 hours → 1 hour (2 hours saved per article × 2/month = 4 hours)
- Campaign messaging: 5 hours → 2 hours (3 hours saved × 1/month = 3 hours)
- Grant proposals: 10 hours → 5 hours (5 hours saved × 1/quarter = 1.7 hours/month)
- Social content: 8 hours → 3 hours (5 hours saved × 2/month = 10 hours)
- Technical docs: 6 hours → 3 hours (3 hours saved × 2/month = 6 hours)
- Email communications: 4 hours → 2 hours (2 hours saved × 4/month = 8 hours)
- Onboarding: 40 hours → 20 hours (20 hours saved × 0.25/month = 5 hours)
- **TOTAL: ~38 hours saved per month**

**Value:**
- At $50/hour: $1,900/month saved
- At $100/hour: $3,800/month saved

**Break-Even:**
- Setup: 3-4 months (at $50/hour rate)
- Ongoing: Immediate positive ROI
- Year 1 Net Value: $10,000-$35,000

**Non-Financial Benefits:**
- Consistent brand voice across all channels
- Faster content production
- Better team alignment
- Improved quality and accuracy
- Scalable knowledge transfer
- Cultural protocol compliance

---

## Quality Assurance

### Human-in-Loop Review

**Always Human-Reviewed:**
- Community stories and testimonials
- Cultural protocol-sensitive content
- Grant proposals and major communications
- Anything published externally
- Contract and legal documents

**AI-Assisted, Human-Approved:**
- Blog articles (AI draft, human edit)
- Social media posts (AI generate, human select/refine)
- Email sequences (AI template, human personalize)
- Technical docs (AI structure, human verify)

**AI-Generated, Spot-Checked:**
- Meta descriptions and SEO text
- Alt text for images
- FAQ answers
- Internal documentation
- Draft outlines and brainstorms

### Quality Metrics

**Brand Voice Consistency:**
- Grounded yet visionary (✓/✗)
- Humble yet confident (✓/✗)
- Warm yet challenging (✓/✗)
- Poetic yet clear (✓/✗)
- Farm metaphors appropriate (✓/✗)

**Cultural Safety:**
- OCAP® principles respected (✓/✗)
- Consent verified (✓/✗)
- Elder review completed (if required) (✓/✗)
- Sacred content excluded (✓/✗)
- Community voice centered (✓/✗)

**Technical Accuracy:**
- Facts verified against knowledge base (✓/✗)
- Project details current (✓/✗)
- Metrics and data correct (✓/✗)
- Links functional (✓/✗)
- Code examples tested (✓/✗)

---

## Maintenance & Updates

### Knowledge Base Updates

**Quarterly Reviews (Every 3 Months):**
- Update project details (milestones, metrics)
- Add new blog articles to corpus
- Refresh media library
- Update impact data
- Revise outdated information
- Re-generate embeddings

**Annual Comprehensive Review:**
- Full knowledge base audit
- Community partner feedback
- Brand voice evolution
- New projects added
- Retired projects archived
- Major version update

### Triggering Re-Training

**Re-Embed Knowledge Base When:**
- Quarterly scheduled update
- Major project launch
- Significant impact milestone
- Brand refresh
- New partnership
- Cultural protocol change

**Process:**
1. Update markdown files in this directory
2. Run embedding generation script
3. Upload new embeddings to vector database
4. Test retrieval with sample queries
5. Deploy updated system
6. Notify team of changes

---

## Support & Troubleshooting

### Common Issues

**AI Response Lacks ACT Voice:**
- Check: Is RAG retrieving correct sections?
- Fix: Improve query or add more context in prompt
- Fine-tune: May need voice fine-tuning (GPT-4)

**AI States Incorrect Facts:**
- Check: Is knowledge base up to date?
- Fix: Update knowledge base and re-embed
- Override: Add correction to system prompt

**AI Violates Cultural Protocol:**
- Immediate: Remove response and apologize
- Investigate: How did guardrails fail?
- Fix: Update cultural safety checks
- Prevent: Community review of AI outputs

**Retrieval Returns Irrelevant Results:**
- Check: Embedding quality and semantic match
- Fix: Rephrase query or improve chunk size
- Optimize: Tune similarity threshold

### Getting Help

**Internal:**
- Slack #ai-knowledge-base channel
- Documentation in this README
- Team training materials
- Recorded demos and tutorials

**External:**
- Anthropic support (Claude API)
- OpenAI support (GPT-4, embeddings)
- Supabase docs (pgvector)
- Community forums (Discord, GitHub)

---

## Next Steps

### Recommended Action Plan

**If You Want Immediate Benefits (No AI Setup):**
1. Read Sections 1-3 (Core, Structure, LCAA)
2. Bookmark Section 5 (Brand Voice) for content creation
3. Reference Section 4 (Projects) for project-specific work
4. Use checklists from Section 10 before publishing
5. Share with team and make part of onboarding

**If You Want AI-Assisted Content (2-4 Weeks):**
1. Follow "Short-Term Implementation" plan above
2. Set up vector database and retrieval
3. Test with Claude 3.5 Sonnet
4. Train team on `/act-knowledge` command
5. Measure time savings and quality

**If You Want Full AI Integration (2-3 Months):**
1. Complete RAG setup (Weeks 1-2)
2. Add fine-tuning for voice (Weeks 3-5)
3. Deploy hybrid system (Week 6)
4. Iterate based on usage (Ongoing)
5. Build custom tools and workflows (Month 2+)

---

## Questions?

**About This Knowledge Base:**
- Contact: Benjamin Knight (benjamin@act.place)
- Documentation: This README + strategy docs
- Updates: Quarterly reviews, annual comprehensive

**About AI Implementation:**
- Technical lead: [Your dev team contact]
- Strategy document: `LLM_TRAINING_STRATEGY.md`
- Recommended vendor: Anthropic (Claude) or OpenAI (GPT-4)

**About Cultural Protocols:**
- Review: Section 8 (Cultural Protocols)
- Community partners: [Contact list]
- Elder advisors: [Contact list with permission]

---

**Every seed contains the knowledge of the whole forest. This knowledge base is your seedbed.** 🌱

*Last Updated: December 2024*
*Version: 1.0*
*Status: Ready for Implementation*
