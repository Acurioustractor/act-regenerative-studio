# ✅ Your Notion Integration is Working!

**Date:** December 25, 2024
**Token:** `ntn_633000...` (valid ✅)

---

## 🎉 What You Have Access To

### 4 Notion Databases:

1. **📊 Projects Database**
   - ID: `177ebcf9-81cf-80dd-9514-f1ec32f3314c`
   - URL: https://www.notion.so/177ebcf981cf80dd9514f1ec32f3314c
   - **Use for:** Project documentation, methodologies, workflows

2. **📋 Actions Database**
   - ID: `177ebcf9-81cf-8023-af6e-dff974284218`
   - URL: https://www.notion.so/177ebcf981cf8023af6edff974284218
   - **Use for:** Action items, procedures, step-by-step processes

3. **👥 People Database**
   - ID: `47bdc1c4-df99-4ddc-81c4-a0214c919d69`
   - URL: https://www.notion.so/47bdc1c4df994ddc81c4a0214c919d69
   - **Use for:** Team roles, contact info (probably skip for wiki)

4. **🏢 Organisations Database**
   - ID: `948f3946-7d1c-42f2-bd7e-1317a755e67b`
   - URL: https://www.notion.so/948f39467d1c42f2bd7e1317a755e67b
   - **Use for:** Partner orgs, relationship guidelines

---

## 📖 How to Use These Databases with the Living Wiki

The wiki scanner can extract knowledge from database **pages** (items in these databases).

### What Makes Good Wiki Content from Your Databases:

**From Projects Database:**
- ✅ **Project methodologies** (e.g., "LCAA Framework for ACT Farm")
- ✅ **Reusable workflows** (e.g., "How we onboard new partners")
- ✅ **Principles** guiding projects (e.g., "Community ownership in practice")
- ❌ Specific project timelines, budgets, one-off notes

**From Actions Database:**
- ✅ **Recurring procedures** (e.g., "Monthly review process")
- ✅ **Templates** for common actions
- ✅ **Best practices** discovered through actions
- ❌ One-off action items, personal todos

**From Organizations Database:**
- ✅ **Partnership guidelines** (e.g., "How we work with Aboriginal orgs")
- ✅ **Relationship principles**
- ✅ **Communication practices**
- ❌ Specific contact details, meeting notes

---

## 🚀 Next Steps to Start Scanning

### 1. Start the Wiki Scanner (2 minutes)

```bash
# Start dev server
npm run dev

# Open admin dashboard
open http://localhost:3999/admin/wiki-scanner
```

### 2. Click "Scan Notion Now"

The scanner will:
- Search through all accessible Notion pages
- Detect knowledge in your databases
- Queue high-quality items for review

### 3. Review Extractions

You'll see items like:
- "Project Template for Community Partnerships" (from Projects DB)
- "How to Conduct Monthly Reviews" (from Actions DB)
- "Partnership Agreement Guidelines" (from Organizations DB)

### 4. Approve Good Knowledge

Click "Run AI Extraction" → Review → "Approve"

Published pages will appear at: http://localhost:3999/wiki

---

## 💡 How to Improve Detection from Your Databases

### Structure Database Pages for Better Extraction

**Example: Project Database Page**

**Before (low confidence):**
```
Project: JusticeHub Redesign
Status: In Progress
Notes: Working on it
```

**After (high confidence):**
```
# JusticeHub Redesign Project

## Methodology
We use the LCAA Framework (Land, Culture, Autonomy, Authority) to guide all design decisions.

## Principles
- Community ownership: Youth have final say on features
- Beautiful obsolescence: Design for eventual handoff
- Consent at every level: No data collected without explicit consent

## Process
1. Co-design workshops with youth
2. Prototype and test
3. Community review and sign-off
4. Implementation with continuous feedback

## Learnings
[What worked, what didn't, what we'd do differently]
```

### Add Properties to Help Scanner

In your Notion databases, add these properties:

- **Knowledge Type** (Select): Principle / Method / Practice / Procedure / Guide
- **Reusable?** (Checkbox): Is this reusable knowledge vs. one-off?
- **Status** (Select): Draft / Published / Archived
- **Related Projects** (Multi-select): JusticeHub, Empathy Ledger, etc.

The scanner will use these to improve categorization!

---

## 🎯 Recommended Scan Strategy

### Start Small (Week 1):

1. **Identify 5-10 "goldmine" pages** in your databases that contain reusable knowledge
2. **Structure them** with headings, lists, clear principles
3. **Run first scan** and see what gets extracted
4. **Approve 3-5 high-quality** extractions
5. **Refine** based on results

### Scale Up (Week 2+):

1. **Create templates** for common knowledge types
2. **Encourage team** to structure Notion pages consistently
3. **Run daily scans** automatically
4. **Review queue** weekly
5. **Build wiki** to 20-30 pages

---

## 🔧 How the Scanner Works with Databases

The scanner searches for pages, including database items:

```javascript
// What it does:
1. Searches all accessible Notion pages (including database rows)
2. Reads page content (the blocks/text inside each database item)
3. Detects if content is reusable knowledge
4. Extracts and categorizes
5. Queues for your review
```

**Database items that work best:**
- Rich text content (not just properties)
- Well-structured with headings
- Reusable knowledge, not one-off info

---

## 📊 Example: What You Might Extract

### From Projects Database → Wiki

**Notion Database Item:**
- Database: Projects
- Name: "ACT Farm Residency Program"
- Content: Full description of how residencies work

**Extracted to Wiki:**
- Type: Practice (⚙️)
- Title: "How We Run Artist Residencies"
- Tags: [agriculture, tourism, community]
- Projects: [act-farm]
- Confidence: 0.8

### From Actions Database → Wiki

**Notion Database Item:**
- Database: Actions
- Name: "Monthly Community Check-in Process"
- Content: Step-by-step how to run check-ins

**Extracted to Wiki:**
- Type: Procedure (📋)
- Title: "Monthly Community Check-in Procedure"
- Tags: [community, meetings, governance]
- Confidence: 0.9

---

## 🎨 Customizing for Your Databases

### If you want to scan ONLY databases (not all pages):

Edit [notion-scanner.ts](src/lib/knowledge/notion-scanner.ts):

```typescript
// Around line 90
async scanWorkspace(): Promise<KnowledgeExtraction[]> {
  // Instead of searching all pages, query specific databases
  const databases = [
    process.env.NOTION_PROJECTS_DATABASE_ID,
    process.env.NOTION_ACTIONS_DATABASE_ID,
    // Add others as needed
  ];

  for (const dbId of databases) {
    const pages = await this.queryDatabase(dbId);
    // Process pages...
  }
}
```

### If you want to use database properties:

The scanner can read Notion properties (Status, Type, etc.):

```typescript
// Extract properties for better categorization
const status = page.properties.Status?.select?.name;
const type = page.properties['Knowledge Type']?.select?.name;

if (status === 'Draft') {
  return null; // Skip drafts
}

if (type) {
  // Use explicit type from Notion property
  suggestedType = type.toLowerCase();
}
```

---

## 🆘 Common Questions

**Q: Will it scan EVERYTHING in my databases?**
A: Only pages that:
- Have content (not just properties)
- Match knowledge signals (principles, methods, procedures, etc.)
- Aren't marked as draft/personal

**Q: Can I exclude certain database items?**
A: Yes! The scanner skips pages with titles like:
- "untitled", "test", "draft", "personal", "scratch"

Add your own exclusions in [notion-scanner.ts:260](src/lib/knowledge/notion-scanner.ts:260)

**Q: What if it extracts the wrong type?**
A: You can:
1. Edit before approving in the admin dashboard
2. Add better structure to Notion page
3. Adjust AI prompt to understand your terminology

**Q: Can I prioritize Projects database over Actions?**
A: Yes! Modify the scanner to scan databases in order and process Projects first.

---

## 🎉 Ready to Start!

Your Notion integration is **fully working** and connected to 4 databases.

**Try it now:**
```bash
npm run dev
open http://localhost:3999/admin/wiki-scanner
# Click "Scan Notion Now"
```

The scanner will find knowledge in your databases and queue it for review!

---

**Questions? Check:**
- [HOW_TO_IMPROVE_WIKI.md](.claude/skills/act-knowledge-base/HOW_TO_IMPROVE_WIKI.md) - Detailed improvement guide
- [NOTION_SCANNER_SETUP.md](.claude/skills/act-knowledge-base/NOTION_SCANNER_SETUP.md) - Setup instructions
- [LIVING_WIKI_COMPLETE.md](.claude/skills/act-knowledge-base/LIVING_WIKI_COMPLETE.md) - Full system docs
