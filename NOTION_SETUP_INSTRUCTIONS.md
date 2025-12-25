# Notion Integration Setup

Your current Notion API key is invalid. Let's set up a new integration.

## Step 1: Create Notion Integration (3 minutes)

1. **Go to Notion Integrations:**
   - Visit: https://www.notion.so/my-integrations
   - Click "**+ New integration**" button

2. **Fill out the form:**
   - **Name:** ACT Living Wiki Scanner
   - **Associated workspace:** Select your ACT workspace
   - **Logo:** (optional)
   - **Capabilities:**
     - ✅ **Read content** (required)
     - ✅ **Read comments** (optional, useful for discussions)
     - ❌ Update content (NOT needed)
     - ❌ Insert content (NOT needed)

3. **Click "Submit"**

4. **Copy the Internal Integration Token:**
   - It will look like: `secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - Click "Show" and then "Copy"

## Step 2: Update Environment Variable (1 minute)

Replace the token in `.env.local`:

```bash
# Open .env.local
nano .env.local

# Replace the current NOTION_API_KEY line with:
NOTION_API_KEY=secret_YOUR_NEW_TOKEN_HERE

# Save: Ctrl+O, Enter, Ctrl+X
```

Or use this command:
```bash
# Replace YOUR_TOKEN with the actual token you copied
echo "NOTION_API_KEY=secret_YOUR_TOKEN" >> .env.local
```

## Step 3: Share Pages with Integration (2 minutes)

The integration won't see any pages until you explicitly share them.

**For each Notion page or database you want to scan:**

1. Open the page in Notion
2. Click the "**⋯**" menu (top right)
3. Scroll down and click "**+ Add connections**"
4. Search for "**ACT Living Wiki Scanner**"
5. Click to add it
6. Grant "**Can view**" permission

**Tip:** Share entire workspaces or parent pages to give access to all child pages at once!

## Step 4: Test the Connection (1 minute)

Run the test script:
```bash
node scripts/test-notion-connection.mjs
```

You should see:
- ✅ List of accessible pages
- ✅ List of accessible databases
- ✅ Sample page content

If you see "No pages found", go back to Step 3 and share more pages with your integration.

## Step 5: Run Your First Scan (5 minutes)

Once the test script shows your pages:

```bash
# Start the dev server
npm run dev

# Open the admin dashboard
open http://localhost:3999/admin/wiki-scanner

# Click "Scan Notion Now"
```

---

## What Pages Should I Share?

**Share pages that contain reusable knowledge:**

✅ **Good candidates:**
- Team processes and workflows
- Onboarding guides
- Project methodologies
- Meeting templates
- Decision frameworks
- How-to guides
- Best practices

❌ **Skip these:**
- Personal notes
- One-off meeting notes
- Draft documents
- Sensitive information
- Customer data

**Tip:** Start small! Share 5-10 pages initially to test the system, then expand.

---

## Troubleshooting

**"API token is invalid"**
- Make sure the token starts with `secret_`
- Check there are no extra spaces
- Verify you copied the entire token
- Try creating a new integration

**"No pages found"**
- Integration created but pages not shared
- Go to each page → "Add connections" → Select your integration

**"Permission denied"**
- Integration needs "Read content" capability
- Edit integration settings at https://www.notion.so/my-integrations

---

## Next Steps After Setup

Once you have pages accessible:

1. **Review what the scanner finds** - Check the admin dashboard
2. **Run AI extraction** - Let Mistral categorize the knowledge
3. **Approve high-quality items** - Publish to wiki
4. **Set up daily automation** - Add cron job for daily scans
5. **Train your team** - Show them how to contribute

---

Need help? Run the test script and share the output!
