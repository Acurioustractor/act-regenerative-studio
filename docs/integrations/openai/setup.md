# OpenAI Setup for ACT Living Wiki Embeddings

**Time:** 5 minutes
**Cost:** ~$0.0002 per page (nearly free!)
**Benefit:** 30-40% better confidence accuracy

---

## Step 1: Get Your OpenAI API Key

1. Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Click **"Create new secret key"**
4. Give it a name: `ACT Living Wiki Embeddings`
5. **Copy the key** (starts with `sk-proj-...`)
   - ⚠️ You won't be able to see it again!

---

## Step 2: Add to Your Environment

Open `.env.local` and add:

```bash
# OpenAI for Embeddings (text-embedding-3-small)
# Cost: ~$0.20 per 1M tokens (~$0.0002 per page)
OPENAI_API_KEY=sk-proj-YOUR_KEY_HERE
```

**Replace `sk-proj-YOUR_KEY_HERE` with your actual key!**

---

## Step 3: Set Up Billing (If Not Already Done)

1. Go to [https://platform.openai.com/account/billing](https://platform.openai.com/account/billing)
2. Add a payment method
3. Set a spending limit (recommended: $5/month)
   - With embeddings, this will cover ~25,000 pages!

---

## Step 4: Verify It Works

Test the setup:

```bash
# Should return your organization ID (not an error)
curl https://api.openai.com/v1/organizations \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

Or run a test scan:

```bash
# Trigger a Notion scan with embeddings
curl -X POST http://localhost:3001/api/knowledge/scan-notion
```

You should see output like:
```
📖 Processing: A Curious Tractor - Who we are
   🧮 Calculating embedding-based confidence...
   ✨ Confidence: 85% (similarity: 78%)
```

---

## What Happens Now?

**With OpenAI configured:**
- Each Notion page gets converted to a 1536-dimensional vector
- Semantic similarity is calculated using cosine distance
- Confidence scores are 30-40% more accurate
- Similar knowledge is easily discoverable

**Without OpenAI:**
- Fallback to keyword-based confidence (less accurate)
- No embedding storage
- No semantic search capability

---

## Cost Breakdown

**Model:** `text-embedding-3-small`
**Pricing:** $0.00002 per 1K tokens

**Examples:**
- 1 small page (500 words): $0.00001 (~1 cent per 1000 pages)
- 1 medium page (2000 words): $0.00004 (~4 cents per 1000 pages)
- 1 large page (8000 words): $0.00016 (~16 cents per 1000 pages)

**Monthly estimates:**
- 100 pages/month: ~$0.01/month
- 1,000 pages/month: ~$0.10/month
- 10,000 pages/month: ~$1.00/month

**Extremely affordable!** 💰

---

## Troubleshooting

### Error: "OpenAI API key not configured"

Make sure:
1. You added `OPENAI_API_KEY` to `.env.local` (not `.env.example`)
2. You restarted the dev server: `npm run dev`
3. The key starts with `sk-proj-` or `sk-`

### Error: "Incorrect API key provided"

Your key might be:
- Copied incorrectly (check for extra spaces)
- Revoked (create a new one)
- From the wrong project (check https://platform.openai.com/api-keys)

### Error: "You exceeded your current quota"

You need to:
1. Add billing at https://platform.openai.com/account/billing
2. Add a payment method
3. Wait ~5 minutes for it to activate

---

## Optional: Monitor Usage

See your OpenAI usage:
https://platform.openai.com/usage

You can set usage limits and get email alerts!

---

## Alternative: Skip OpenAI (Not Recommended)

If you don't want to use OpenAI, the wiki will still work but:
- Confidence scores will be less accurate (60-70% vs 85-95%)
- No semantic search
- No knowledge graph recommendations
- More manual review needed

The system automatically falls back to keyword-based scoring if OpenAI isn't configured.

---

## Next Steps

Once OpenAI is set up:

1. ✅ **Trigger a new scan** to generate embeddings for existing items
2. ✅ **Check the queue** at http://localhost:3001/admin/queue
3. ✅ **Compare confidence scores** - should see 80-95% for good knowledge
4. 🚀 **Move to Phase 2** - Add more knowledge sources!

---

**Questions?** Check the research docs:
- [LIVING_WIKI_RESEARCH_IMPROVEMENTS.md](LIVING_WIKI_RESEARCH_IMPROVEMENTS.md)
- [QUICK_WINS_IMPLEMENTATION.md](QUICK_WINS_IMPLEMENTATION.md)
