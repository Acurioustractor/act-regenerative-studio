# ACT Open-Source AI Implementation Roadmap
## Your Step-by-Step Guide to $80/Year AI System

**Status:** Ready to Execute
**Last Updated:** December 2024
**Estimated Time:** 6-8 weeks (phased approach)
**Total Cost Year 1:** $180 (vs. $3,600 with Claude)

---

## 📊 Key Insights from Analysis

### Cost Comparison Results

From `ai-model-comparison.mjs`:

| Approach | Year 1 Cost | Year 5 Cost | Quality | Savings vs. Claude |
|----------|-------------|-------------|---------|-------------------|
| **Mistral Self-Hosted (Recommended)** | $80 | $300 | 9.0/10 | **98%** |
| Mistral Hugging Face | $340 | $1,200 | 9.0/10 | 91% |
| Claude Haiku (Baseline Good) | $1,000 | $5,000 | 8.5/10 | 72% |
| Claude Sonnet (Current) | $3,600 | $18,000 | 9.5/10 | 0% |

**Winner:** Mistral 7B Self-Hosted + Fine-Tuning
- **Cost:** $80/year ($20 fine-tuning one-time + $60 hosting)
- **Quality:** 9.0/10 (matches Claude for ACT-specific tasks after fine-tuning)
- **Savings:** $3,520/year (98% reduction)
- **Benefits:** Unlimited usage, complete privacy, community-forkable

---

## 🎯 Three-Phase Implementation Plan

### Phase 1: Foundation & Testing (Weeks 1-2)
**Goal:** Prove open-source can work for ACT
**Cost:** $10-20
**Time:** 10-15 hours

#### Week 1: Proof of Concept

**Day 1-2: Test Mistral via Hugging Face**
```bash
# Set up HF API token
# Get free token at: https://huggingface.co/settings/tokens
# Add to .env.local: HUGGING_FACE_API_TOKEN=hf_...

# Run test suite
node scripts/ai-test-mistral-hf.mjs
```

**Expected Output:**
- 5 test prompts (blog, grant, social, email, docs)
- Quality scores per task
- Cost analysis
- Recommendation on whether to proceed

**Success Criteria:**
- ✅ 3+ tests pass (quality ≥ 7.5/10)
- ✅ Total cost < $0.10 for all tests
- ✅ Response time < 5 seconds

**If Successful:** Proceed to Week 2
**If Not:** Try Phi-3.5 Medium (better quality, slightly slower)

#### Week 2: Prepare for Fine-Tuning

**Day 3-5: Create Training Dataset**
```bash
# Extract blog articles into training format
node scripts/prepare-fine-tuning-dataset.mjs
```

**Output Files:**
- `training-data-alpaca-train.jsonl` (80% of articles)
- `training-data-alpaca-val.jsonl` (20% for validation)
- `training-data-chatml-train.jsonl` (alternative format)
- `axolotl-config.yml` (fine-tuning configuration)

**Expected:**
- 45+ training examples (from 57 blog articles)
- Average 500-1000 words per example
- Mix across all ACT projects

**Day 6-7: Set Up NAS for Self-Hosting**
```bash
# SSH into your NAS
ssh [user]@192.168.0.34

# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Download Mistral 7B
ollama pull mistral:7b-instruct

# Run server (test)
ollama serve

# Test from laptop
curl http://192.168.0.34:11434/api/generate -d '{
  "model": "mistral",
  "prompt": "Write a blog opening for ACT about youth justice",
  "stream": false
}'
```

**Success Criteria:**
- ✅ Ollama installed successfully
- ✅ Mistral 7B downloaded (4.7GB)
- ✅ Server accessible from network
- ✅ Test generation works

**Deliverable:** Working self-hosted LLM on NAS

---

### Phase 2: Fine-Tuning & Optimization (Weeks 3-4)
**Goal:** Train model on ACT brand voice
**Cost:** $20-50
**Time:** 15-20 hours

#### Week 3: Fine-Tune Model

**Option A: DIY with RunPod (Cheapest)**
```bash
# 1. Sign up at runpod.io
# 2. Create account, add $10 credit
# 3. Launch A100 Spot Instance (~$0.80/hour)
# 4. Upload training data
# 5. Run Axolotl fine-tuning

# Install Axolotl on RunPod
pip install axolotl

# Run training (4-8 hours)
accelerate launch -m axolotl.cli.train axolotl-config.yml

# Merge LoRA weights
python -m axolotl.cli.merge_lora axolotl-config.yml \
  --lora_model_dir ./act-mistral-lora

# Download merged model (4.7GB)
```

**Cost:** $6-15 (8 hours × $0.80/hour spot pricing)

**Option B: Unsloth + Google Colab (Easiest)**
```bash
# 1. Open: https://colab.research.google.com/drive/1lBzz5KeZJKXjvivbYvmGarix9Ao6Wxe5
# 2. Upload training-data-alpaca-train.jsonl
# 3. Select Mistral 7B as base model
# 4. Run all cells (2-4 hours on free T4 GPU)
# 5. Download LoRA adapter (100MB)
```

**Cost:** $0 (free Colab) or $10 (Colab Pro for faster)

**Option C: Hugging Face AutoTrain (Most Managed)**
```bash
# 1. Upload dataset to HF
# 2. Use AutoTrain web UI
# 3. Select Mistral base
# 4. Wait for training (4-8 hours)
# 5. Deploy fine-tuned model
```

**Cost:** $50-100 (managed fine-tuning)

**Recommendation:** Start with Option B (Unsloth/Colab) for testing, move to Option A (RunPod) if you want to fine-tune often.

#### Week 4: Deploy & Test

**Deploy Fine-Tuned Model to NAS**
```bash
# SSH to NAS
ssh [user]@192.168.0.34

# Create Modelfile for fine-tuned version
cat > Modelfile <<EOF
FROM mistral:7b-instruct

# Import LoRA adapter
ADAPTER ./act-mistral-lora-adapter.bin

# Set temperature for creativity
PARAMETER temperature 0.7

# System prompt with ACT voice
SYSTEM You are a content writer for A Curious Tractor, a regenerative innovation ecosystem. Your voice is grounded yet visionary, humble yet confident, warm yet challenging, and poetic yet clear. You use farm metaphors thoughtfully and center community voices.
EOF

# Create custom model
ollama create act-mistral -f Modelfile

# Test it
ollama run act-mistral "Write a blog opening about community justice"
```

**Run Comparison Test**
```bash
# Compare base vs. fine-tuned
node scripts/ai-continuous-evaluation.mjs
```

**Expected Improvement:**
- Brand voice: 7.5/10 → 9.0/10 (+1.5)
- Cultural safety: 7.0/10 → 8.5/10 (+1.5)
- Overall quality: 7.5/10 → 9.0/10 (+1.5)

**Deliverable:** Fine-tuned model matching Claude quality for ACT tasks

---

### Phase 3: Production & Scaling (Weeks 5-6)
**Goal:** Deploy to all ACT sites, enable team access
**Cost:** $0
**Time:** 10-15 hours

#### Week 5: Integration

**Create API Wrapper (OpenAI-Compatible)**
```typescript
// src/lib/ai/act-llm-client.ts

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { messages, temperature = 0.7, max_tokens = 500 } = body;

  // Convert to Ollama format
  const prompt = messages.map((m: any) =>
    `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`
  ).join('\n\n');

  // Call NAS Ollama
  const response = await fetch('http://192.168.0.34:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'act-mistral',
      prompt,
      stream: false,
      options: {
        temperature,
        num_predict: max_tokens,
      },
    }),
  });

  const data = await response.json();

  // Return OpenAI-compatible format
  return NextResponse.json({
    id: `act-${Date.now()}`,
    object: 'chat.completion',
    created: Date.now(),
    model: 'act-mistral-7b',
    choices: [{
      index: 0,
      message: {
        role: 'assistant',
        content: data.response,
      },
      finish_reason: 'stop',
    }],
  });
}
```

**Update All ACT Sites**
```typescript
// Update .env.local on each site
ACT_LLM_API_URL=http://192.168.0.34:11434
ACT_LLM_MODEL=act-mistral

// Or use API route
ACT_LLM_API_URL=https://act-hub.vercel.app/api/ai/generate
```

**Create Team Interface**
```bash
# Option 1: Simple web UI
npm install @gradio/client
# Create simple chat interface at /admin/ai

# Option 2: Slack bot (optional)
npm install @slack/bolt
# Connect to Ollama for team queries

# Option 3: Notion integration (optional)
# Use Notion AI blocks to call ACT LLM
```

#### Week 6: Documentation & Training

**Create Team Documentation**
1. How to use ACT AI for blog writing
2. How to use ACT AI for grant proposals
3. How to use ACT AI for campaign messaging
4. Dos and don'ts (human review required)
5. Cultural protocol checklist

**Run Team Training Session**
- Demo of AI capabilities
- Hands-on practice
- Quality vs. speed tradeoffs
- When to use AI vs. human
- How to review AI-generated content

**Set Up Continuous Evaluation**
```bash
# Add to crontab (weekly evaluation)
0 9 * * 1 cd /path/to/act && node scripts/ai-continuous-evaluation.mjs

# Email results to team
# Track quality over time
# Monitor costs (should be $0)
```

**Deliverable:** Production AI system available to all ACT team and sites

---

## 🔄 Continuous Improvement Loop

### Weekly
```bash
# Run automated evaluation
node scripts/ai-continuous-evaluation.mjs

# Check results:
# - Quality scores still high?
# - Any degradation?
# - New use cases to add?
```

### Monthly
```bash
# Run cost comparison
node scripts/ai-model-comparison.mjs

# Review:
# - Are we still on best model?
# - Any new open-source models to test?
# - Any issues reported by team?
```

### Quarterly
```bash
# Consider re-fine-tuning if:
# - 20+ new blog articles published
# - Brand voice has evolved
# - New projects launched
# - Quality scores declining

# Re-run fine-tuning (~$20)
# Takes 4-8 hours
# Improves quality with new data
```

---

## 📈 Success Metrics

### Track These KPIs

**Quality Metrics:**
- [ ] Brand voice consistency: ≥ 8.5/10
- [ ] Cultural safety: ≥ 9.0/10
- [ ] Factual accuracy: ≥ 9.0/10
- [ ] Overall satisfaction: ≥ 85% (team survey)

**Efficiency Metrics:**
- [ ] Time saved: ≥ 30 hours/month
- [ ] Content creation speed: 50% faster
- [ ] Revision rounds: 30% fewer
- [ ] First-draft quality: "Good enough to publish" ≥ 60% of time

**Cost Metrics:**
- [ ] Total cost: < $100/year
- [ ] Cost per 1000 words: < $0.01
- [ ] ROI: > 1000% (time saved vs. cost)

**Adoption Metrics:**
- [ ] Team using AI: ≥ 80%
- [ ] Use cases covered: ≥ 5 (blog, grant, social, email, docs)
- [ ] Generated content published: ≥ 50% (with human review)

---

## 🚨 Troubleshooting Guide

### Issue: Quality Not Good Enough

**Symptoms:**
- Responses don't sound like ACT
- Missing key brand elements
- Cultural protocol violations

**Solutions:**
1. Check if using fine-tuned model (not base Mistral)
2. Add more examples to fine-tuning dataset
3. Improve system prompt
4. Use hybrid approach (80% fine-tuned, 20% Claude for review)
5. Re-fine-tune with feedback examples

### Issue: NAS Performance Slow

**Symptoms:**
- Response time > 30 seconds
- NAS CPU maxed out
- Other services affected

**Solutions:**
1. Check NAS RAM (need 16GB minimum)
2. Use quantized model (4-bit instead of full precision)
3. Limit concurrent requests
4. Add cloud bursting for peak times
5. Upgrade NAS or add dedicated GPU ($300 RTX 4060)

### Issue: Team Not Using AI

**Symptoms:**
- Low adoption rates
- Prefer manual writing
- Don't trust quality

**Solutions:**
1. More training and demos
2. Start with low-stakes content (social media)
3. Show time savings with metrics
4. Create easy-to-use interface
5. Collect and share success stories
6. Mandate review but not use

### Issue: Costs Creeping Up

**Symptoms:**
- Monthly bill > $20
- Using cloud services for most requests
- Not using self-hosted

**Solutions:**
1. Check NAS uptime (should be 24/7)
2. Route 95%+ traffic to NAS
3. Cloud only for burst/backup
4. Optimize prompts (shorter = cheaper on cloud)
5. Batch requests instead of one-by-one

---

## 🎁 Bonus: Community Replication Kit

### Make ACT AI Forkable

**Package for Other Organizations:**
```bash
# 1. Create Docker container
docker build -t act-ai-system .

# 2. Export fine-tuned model
ollama export act-mistral > act-mistral-export.bin

# 3. Create setup script
./setup-act-ai.sh

# 4. Documentation
README.md              # Quick start
INSTALLATION.md        # Detailed setup
FINE_TUNING_GUIDE.md  # How to customize
CULTURAL_PROTOCOLS.md # Adapting for your community
```

**Share on JusticeHub:**
- Upload to GitHub (MIT license)
- Create video tutorial
- Host office hours for communities
- Enable other orgs to benefit from ACT's work

**Beautiful Obsolescence in Action:**
- Communities can self-host
- No ongoing dependency on ACT
- Customize for their own voice
- Share improvements back to commons

---

## 📞 Next Steps & Support

### Immediate Actions (This Week)

**Priority 1:** Test Mistral via Hugging Face
```bash
# Get HF token: https://huggingface.co/settings/tokens
# Add to .env.local
# Run: node scripts/ai-test-mistral-hf.mjs
```

**Priority 2:** Prepare training data
```bash
node scripts/prepare-fine-tuning-dataset.mjs
```

**Priority 3:** Set up NAS (if you have shell access)
```bash
ssh [user]@192.168.0.34
curl -fsSL https://ollama.ai/install.sh | sh
ollama pull mistral:7b-instruct
```

### Questions?

**Technical Setup:**
- Ollama docs: https://ollama.ai/docs
- Axolotl fine-tuning: https://github.com/OpenAccess-AI-Collective/axolotl
- Unsloth: https://github.com/unslothai/unsloth

**Model Selection:**
- Mistral 7B: https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.3
- Phi-3.5 Medium: https://huggingface.co/microsoft/Phi-3.5-medium-instruct
- LLaMA 3.1 8B: https://huggingface.co/meta-llama/Meta-Llama-3.1-8B-Instruct

**Community:**
- r/LocalLLaMA subreddit
- Hugging Face Discord
- ACT internal Slack/Discord

---

## 🌱 Closing Thoughts

**You're not just saving money** (though 98% savings is massive). You're building infrastructure that:

- ✅ **Respects your values** (open-source, community-owned)
- ✅ **Protects privacy** (data never leaves your network)
- ✅ **Enables replication** (other communities can fork)
- ✅ **Designs for obsolescence** (no vendor lock-in)
- ✅ **Scales with you** (unlimited usage as you grow)

This is the **Power Take-Off metaphor applied to AI** - you're creating capacity that communities can attach to, use, and eventually own independently.

**The seeds are planted. Let's watch the forest grow.** 🌲

---

**Status:** Ready to Begin
**First Step:** Run `node scripts/ai-test-mistral-hf.mjs`
**Timeline:** 6-8 weeks to full production
**ROI:** 1000%+ in year one

Let's build this. 🚀
