# Quick Integration Example

## How to Add All Content Engagement Components to a Project Page

This example shows how to integrate all the content engagement components into your project pages for maximum engagement.

---

## Step 1: Import Components

```tsx
// src/app/projects/[slug]/page.tsx

import CommunityVoicesSection from '@/components/projects/CommunityVoicesSection';
import StoryBasedImpactPanel from '@/components/projects/StoryBasedImpactPanel';
import CommunityImpactPanel from '@/components/impact/CommunityImpactPanel';
import RelatedArticlesPanel from '@/components/projects/RelatedArticlesPanel';
import MediaGallery from '@/components/media/MediaGallery';
```

---

## Step 2: Update Project Page Template

```tsx
export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  // Get project data (existing code)
  const project = await getProjectBySlug(slug);

  return (
    <main>
      {/* EXISTING: Hero Section */}
      <section className="hero-section">
        <HeroImage projectSlug={slug} />
        <PageHero
          title={project.title}
          description={project.description}
          back="/projects"
        />
      </section>

      {/* EXISTING: Project Details */}
      <section className="container mx-auto px-4 py-12">
        <ProjectDetails project={project} />
        <FocusAreasPanel focusAreas={project.focusAreas} />
      </section>

      {/* EXISTING: LCAA Method Cards */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <SectionHeading title="Our Approach" subtitle="The LCAA Method" />
          <LCAACards
            listen={project.listen}
            curiosity={project.curiosity}
            action={project.action}
            art={project.art}
          />
        </div>
      </section>

      {/* NEW: Community Voices */}
      <section className="container mx-auto px-4 py-16">
        <SectionHeading
          title="Community Voices"
          subtitle="Stories and insights from our community"
        />
        <CommunityVoicesSection projectSlug={slug} />
      </section>

      {/* NEW: Story-Based Impact */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Community-Informed Impact"
            subtitle="Insights from storyteller voices"
          />
          <StoryBasedImpactPanel projectSlug={slug} />
        </div>
      </section>

      {/* NEW: Related Articles */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <RelatedArticlesPanel
            projectSlug={slug}
            limit={6}
            variant="full"
          />
        </div>
      </section>

      {/* NEW: Media Gallery */}
      <section className="container mx-auto px-4 py-16">
        <SectionHeading
          title="Project Media"
          subtitle="Photos and videos from this initiative"
        />
        <MediaGallery
          projectSlug={slug}
          limit={12}
        />
      </section>

      {/* NEW: Ecosystem Impact (Optional) */}
      <section className="bg-gradient-to-br from-[var(--color-earth-500)] to-[var(--color-earth-600)] text-white py-16">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="ACT Ecosystem Impact"
            subtitle="Collective achievements across all projects"
            className="text-white"
          />
          <CommunityImpactPanel variant="compact" />
        </div>
      </section>

      {/* EXISTING: Engagement CTA */}
      <section className="container mx-auto px-4 py-16">
        <EngagementCTA project={project} />
      </section>
    </main>
  );
}
```

---

## Step 3: Test the Integration

Run the test suite to verify everything works:

```bash
# Start dev server
npm run dev

# In another terminal, run tests
node scripts/test-engagement-system.mjs
```

Expected output:
```
✅ Passed: 15+
❌ Failed: 0
🎯 Pass Rate: 100%
🎉 Content Engagement System is working well!
```

---

## Step 4: Verify Data Sources

### JusticeHub Articles (Already Imported)

Check that articles are available:

```bash
node scripts/fetch-all-justicehub-articles.mjs
```

Should show: **36 published articles**

### Media Items (Already Imported)

Check that media is enriched:

```bash
# Connect to database
PGPASSWORD="..." psql -h ... -d postgres -U ... -c "
  SELECT COUNT(*),
         COUNT(*) FILTER (WHERE array_length(impact_themes, 1) > 0) as enriched,
         COUNT(*) FILTER (WHERE array_length(project_slugs, 1) > 0) as linked
  FROM media_items;
"
```

Should show: **20 total, 20 enriched, 15+ linked**

---

## Step 5: Admin Hero Image Setup

Add the hero image picker to your admin interface:

```tsx
// src/app/admin/projects/[slug]/page.tsx

'use client';

import { useState } from 'react';
import HeroImagePicker from '@/components/admin/HeroImagePicker';

export default function AdminProjectPage({ params }) {
  const [showHeroPicker, setShowHeroPicker] = useState(false);

  return (
    <div>
      <button
        onClick={() => setShowHeroPicker(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Change Hero Image
      </button>

      {showHeroPicker && (
        <HeroImagePicker
          projectSlug={params.slug}
          currentHeroUrl={currentHero?.file_url}
          onSelect={(item) => {
            console.log('New hero:', item);
            setShowHeroPicker(false);
            // Refresh page or update state
          }}
          onCancel={() => setShowHeroPicker(false)}
        />
      )}
    </div>
  );
}
```

---

## Customization Options

### Variant Modes

**RelatedArticlesPanel**:
```tsx
{/* Full grid with images */}
<RelatedArticlesPanel variant="full" limit={6} />

{/* Compact list without images */}
<RelatedArticlesPanel variant="compact" limit={3} />
```

**CommunityImpactPanel**:
```tsx
{/* Detailed dashboard */}
<CommunityImpactPanel variant="full" />

{/* Minimal metrics for sidebar */}
<CommunityImpactPanel variant="compact" />
```

### Filtering

**MediaGallery**:
```tsx
{/* Show only photos */}
<MediaGallery fileType="photo" />

{/* Show only videos */}
<MediaGallery fileType="video" />

{/* Filter by impact theme */}
<MediaGallery impactTheme="youth-empowerment" />

{/* Combine filters */}
<MediaGallery
  projectSlug="justicehub"
  fileType="photo"
  impactTheme="social-justice"
  limit={20}
/>
```

---

## Styling & Theming

All components use ACT design tokens:

```tsx
// They automatically adapt to project theme
<main data-theme="justice">
  {/* All components will use justice theme colors */}
  <RelatedArticlesPanel projectSlug="justicehub" />
</main>

<main data-theme="earth">
  {/* All components will use earth theme colors */}
  <RelatedArticlesPanel projectSlug="harvest" />
</main>
```

Theme colors are defined in your CSS:

```css
[data-theme="justice"] {
  --color-primary: #2C3E50;
}

[data-theme="earth"] {
  --color-primary: #8B7355;
}
```

---

## Performance Optimization

### Server-Side Rendering

Components marked `'use client'` will:
- Load asynchronously after page renders
- Show skeleton loaders during fetch
- Not block initial page paint

### Caching

API endpoints use Next.js caching:

```typescript
// 5-minute cache for community metrics
fetch('...', {
  next: { revalidate: 300 }
});
```

### Image Optimization

All images use Next.js `<Image>` component:
- Automatic WebP conversion
- Lazy loading
- Responsive sizes
- Blur placeholders (if blurhash available)

---

## Troubleshooting

### No articles showing?

Check enrichment_reviews table:
```sql
SELECT COUNT(*) FROM enrichment_reviews
WHERE project_slug = 'your-slug'
  AND enrichment_type = 'blog_links'
  AND status = 'approved';
```

If zero, run import:
```bash
node scripts/import-justicehub-articles.mjs
```

### No media showing?

Check media_items table:
```sql
SELECT COUNT(*) FROM media_items
WHERE 'your-slug' = ANY(project_slugs);
```

If zero, upload media via admin or run:
```bash
node scripts/enrich-imported-media.mjs
```

### No impact metrics showing?

Check if Empathy Ledger is running:
```bash
curl http://localhost:3000/api/analytics/community-metrics
```

If not running, component will show fallback mock data.

### Components not styled correctly?

Ensure Tailwind CSS includes component paths in `tailwind.config.js`:

```javascript
module.exports = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
  ],
  // ...
};
```

---

## Next Steps

1. **Add Analytics Tracking**
   ```tsx
   import { trackEvent } from '@/lib/analytics';

   // Track article clicks
   onClick={() => trackEvent('article_click', { slug, position })}
   ```

2. **Implement Search**
   ```tsx
   <MediaGallery
     searchQuery={userQuery}
     onSearchChange={setUserQuery}
   />
   ```

3. **Add Pagination**
   ```tsx
   <RelatedArticlesPanel
     limit={6}
     offset={currentPage * 6}
     onLoadMore={() => setCurrentPage(p => p + 1)}
   />
   ```

4. **Social Sharing**
   ```tsx
   <ShareButtons
     url={article.url}
     title={article.title}
   />
   ```

---

## Quick Reference

| Component | Purpose | Data Source | Status |
|-----------|---------|-------------|--------|
| **CommunityVoicesSection** | Featured stories | Empathy Ledger API | ✅ Ready |
| **StoryBasedImpactPanel** | Project impact | `/api/projects/[slug]/story-impact` | ✅ Ready |
| **CommunityImpactPanel** | Ecosystem metrics | `/api/impact/community-metrics` | ✅ Ready |
| **RelatedArticlesPanel** | Blog articles | `/api/projects/[slug]/articles` | ✅ Ready |
| **MediaGallery** | Photos/videos | `/api/media` | ✅ Ready |
| **HeroImagePicker** | Admin hero select | MediaGallery + API | ✅ Ready |

---

**You're all set!** 🚀

The content engagement system is fully integrated and ready to deliver a great user experience with rich, multi-source content!
