# 🚀 Quick Start Guide - Human Verification System

**Status:** ✅ DEPLOYED AND READY TO USE

Everything is set up! Here's how to start using it RIGHT NOW:

---

## ✨ Try It Out Immediately

### Option 1: Demo the AI-Assisted Blog Editor (Recommended!)

1. **Navigate to JusticeHub:**
   ```
   http://localhost:3000/admin/blog/new-ai
   ```
   (Start the dev server if needed: `npm run dev` in JusticeHub directory)

2. **Fill out the form:**
   - Topic: "Success story from our youth mentorship program"
   - Angle: "How peer support changed outcomes"
   - Target Audience: "Service providers and families"
   - Tone: "Hopeful & Inspiring"
   - Length: "Medium"

3. **Click "Generate Article with AI"**
   - AI will generate content (takes 5-10 seconds)
   - Uses your self-hosted Mistral model (or Hugging Face fallback)

4. **Review with VerificationPanel:**
   - Score brand voice, cultural safety, factual accuracy, etc.
   - Edit the content inline
   - Add notes and suggestions
   - Click "Approve & Publish" or "Save Revisions"

5. **Done!**
   - Verification is saved to database
   - High-quality content will be used for future AI training
   - View your verification in admin dashboard

---

## 📊 View Your Verifications

### Access the Admin Dashboard

```
http://localhost:3999/admin/knowledge-review
```

**What you'll see:**
- **Verifications Tab:** All human reviews with scores
- **PMPP Tab:** Principles/Methods/Practices review schedule
- **Versions Tab:** Knowledge evolution tracking
- **Elder Queue:** Cultural content reviews (empty for now)
- **Feedback Tab:** Community feedback (empty for now)

---

## 🔄 Weekly Reviews Running Automatically

**Cron job is active!** Every Monday at 9am, the system will:
- Review AI content quality
- Check PMPP review schedule
- Monitor Elder review queue
- Summarize community feedback
- Generate recommendations

**Check status:**
```bash
crontab -l | grep weekly-knowledge-review
```

**View logs:**
```bash
tail -f "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio/weekly-knowledge-reviews/cron.log"
```

**Run manually anytime:**
```bash
cd "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio"
node scripts/weekly-knowledge-review.mjs
```

---

## 📁 What's Where

### Components (Ready to Use)
```
JusticeHub/src/components/ai/VerificationPanel.tsx
Empathy Ledger v.02/src/components/ai/VerificationPanel.tsx
ACT Farm/act-farm/components/ai/VerificationPanel.tsx
```

### Working Demo
```
JusticeHub/src/app/admin/blog/new-ai/page.tsx  ← Try this first!
```

### API Endpoint
```
JusticeHub/src/app/api/ai/generate/route.ts
```

### Database
```
✅ 7 tables created in Supabase
✅ 4 helper views active
✅ Sample data inserted (3 principles, 1 knowledge version)
```

### Scripts
```
scripts/weekly-knowledge-review.mjs  ← Running weekly via cron
weekly-knowledge-reviews/            ← Reports saved here
```

---

## 🎯 Next Steps

### 1. Test the Demo (5 minutes)
- Go to `/admin/blog/new-ai` in JusticeHub
- Generate an article
- Review and verify it
- Check the admin dashboard to see your verification

### 2. Add to Existing Blog Editor (10 minutes)
Want to add AI assistance to the regular blog editor at `/admin/blog/new`?

Add this button to the toolbar:
```typescript
<button
  onClick={async () => {
    const aiContent = await fetch('/api/ai/generate', {
      method: 'POST',
      body: JSON.stringify({ prompt: formData.title, type: 'blog_article' })
    }).then(r => r.json());

    setFormData({ ...formData, content: aiContent.content });
  }}
  className="px-4 py-2 bg-purple-600 text-white rounded"
>
  ✨ AI Assist
</button>
```

### 3. Create More Content Types
Copy the pattern from `new-ai/page.tsx` for:
- Social media posts
- Email campaigns
- Grant proposals
- Case studies

### 4. Set Up Elder Review (When Needed)
When you have cultural content that needs Elder review:
1. Set `requireElderReview={true}` in VerificationPanel
2. Create Elder user accounts
3. Build Elder review interface (template in Integration Guide)

### 5. Collect Community Feedback
Add feedback forms to public blog posts:
```typescript
import { CommunityFeedbackForm } from '@/components/CommunityFeedbackForm';

<CommunityFeedbackForm
  contentId={article.id}
  contentUrl={`https://justicehub.org/blog/${article.slug}`}
/>
```

---

## 🔍 Troubleshooting

### AI Generation Fails
**Check:**
1. Is your NAS running? `ping 192.168.0.34`
2. Is Ollama running on NAS? `curl http://192.168.0.34:11434/api/tags`
3. Do you have Hugging Face API token? Check `.env.local`

**Solution:** The endpoint will fall back to Hugging Face automatically

### Verification Panel Not Showing
**Check:**
1. Component imported correctly?
2. Supabase client configured?
3. User logged in?

**Solution:** Check browser console for errors

### Weekly Review Not Running
**Check:**
```bash
# Verify cron job exists
crontab -l | grep weekly-knowledge-review

# Test manually
node scripts/weekly-knowledge-review.mjs
```

**Solution:** Re-run setup script if needed

---

## 💡 Pro Tips

### Keyboard Shortcuts
- In blog editor: `Cmd+S` to save, `Cmd+Shift+P` to publish
- In verification: Tab through score buttons

### Best Practices
1. **Always verify cultural content** with Elder review
2. **Track scores over time** - aim for ≥4.0/5
3. **Review feedback weekly** - check admin dashboard
4. **Re-fine-tune quarterly** - export verified content

### Integration Pattern
```typescript
// 1. Generate with AI
const ai = await fetch('/api/ai/generate', { ... });

// 2. Show verification panel
<VerificationPanel
  generatedContent={ai.content}
  contentType="blog_article"
  projectSlug="justicehub"
  onVerified={(feedback) => {
    // 3. Save approved content
    saveArticle(feedback.finalContent);
  }}
/>
```

---

## 📞 Need Help?

**Documentation:**
- [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) - Detailed examples
- [HUMAN_VERIFICATION_SYSTEM.md](./HUMAN_VERIFICATION_SYSTEM.md) - System design
- [DEPLOYMENT_COMPLETE.md](./DEPLOYMENT_COMPLETE.md) - What was deployed

**Quick Commands:**
```bash
# Check database tables
PGPASSWORD="19bhlGkZRuH9LxrK" psql \
  -h aws-0-ap-southeast-2.pooler.supabase.com \
  -p 6543 \
  -d postgres \
  -U postgres.tednluwflfhxyucgwigh \
  -c "SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename LIKE '%verification%' ORDER BY tablename;"

# Run weekly review manually
node scripts/weekly-knowledge-review.mjs

# Test AI generation
curl http://192.168.0.34:11434/api/tags
```

---

## 🎉 You're All Set!

**The system is LIVE. Start by:**

1. Visit `http://localhost:3000/admin/blog/new-ai` (in JusticeHub)
2. Generate your first AI-assisted article
3. Verify it with the VerificationPanel
4. Check the admin dashboard to see your verification

**Every verification you do makes the AI better for next time!** 🌱

---

**Happy Creating!** ✨

Last Updated: December 25, 2024
