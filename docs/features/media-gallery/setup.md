# ACT Media Gallery System - Setup & Usage Guide

## Overview

The ACT Media Gallery is a comprehensive media management system for organizing photos, videos, and documents across all ACT projects. It provides:

- **Smart Tagging**: Three-tier tagging system (manual tags, impact themes, project associations)
- **Hero Image Management**: Easy swapping of hero images for projects
- **Polymorphic Linking**: Flexible association of media to projects, blog posts, galleries, etc.
- **Full-Text Search**: Fast searching across titles, descriptions, and captions
- **RLS Security**: Row-level security for public read, authenticated write access

## Architecture

### Database Schema

The system uses three main tables in Supabase:

1. **`media_items`** - Central media library with metadata and tagging
2. **`project_media_links`** - Polymorphic links between media and entities
3. **`video_embeds`** - External video embeds (YouTube, Vimeo, Loom)

See [supabase/migrations/20251224_media_gallery.sql](supabase/migrations/20251224_media_gallery.sql) for complete schema.

### Components

- **`MediaPicker`** - Reusable component for selecting media from library
- **`HeroImageManager`** - Component for managing hero images on project pages
- **Media Gallery Admin Page** - Full admin interface at `/admin/media-gallery`

### API Endpoints

- `GET /api/media` - List/search media items
- `POST /api/media` - Create media item
- `POST /api/media/upload` - Upload file to Supabase Storage
- `GET /api/media/[id]` - Get single media item
- `PATCH /api/media/[id]` - Update media item
- `DELETE /api/media/[id]` - Delete media item
- `GET /api/projects/[slug]/media` - Get all media for a project
- `POST /api/projects/[slug]/media` - Link media to a project
- `GET /api/projects/[slug]/hero` - Get hero image for a project
- `PUT /api/projects/[slug]/hero` - Set hero image for a project

## Setup Instructions

### Step 1: Apply Database Migration

**Manual Application (Recommended)**:

1. Go to [Supabase SQL Editor](https://supabase.com/dashboard/project/tednluwflfhxyucgwigh/sql/new)
2. Copy the contents of `supabase/migrations/20251224_media_gallery.sql`
3. Paste into the SQL editor
4. Click "Run"
5. Verify tables were created:
   - `media_items`
   - `project_media_links`
   - `video_embeds`

**Alternative: Using Script** (if manual doesn't work):

```bash
node scripts/apply-media-migration.mjs
```

Note: This script may have issues with RPC functions. Manual application via SQL editor is more reliable.

### Step 2: Create Supabase Storage Bucket

1. Go to [Supabase Storage](https://supabase.com/dashboard/project/tednluwflfhxyucgwigh/storage/buckets)
2. Click "Create Bucket"
3. Name: `media`
4. Public: `true` (for public access to images)
5. Click "Create"

### Step 3: Verify Environment Variables

Ensure `.env.local` has:

```bash
# Supabase (Shared with Empathy Ledger)
NEXT_PUBLIC_SUPABASE_URL=https://tednluwflfhxyucgwigh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 4: Test the System

1. Start dev server: `npm run dev`
2. Navigate to: `http://localhost:3002/admin/media-gallery`
3. Upload a test image
4. Verify it appears in the media library

## Usage Guide

### Uploading Media

**Via Admin Interface**:

1. Go to `/admin/media-gallery`
2. Click "Upload Media"
3. Fill in the form:
   - **File**: Select image/video/document (max 50MB)
   - **Title**: Descriptive title
   - **Description**: Longer description
   - **Alt Text**: For accessibility (recommended)
   - **Credit**: Photographer/creator name
   - **Tags**: Comma-separated tags (e.g., `farming, community, workshop`)
   - **Impact Themes**: Comma-separated themes (e.g., `environmental, social`)
   - **Project Associations**: Comma-separated slugs (e.g., `justicehub, the-harvest`)
   - **Hero Image**: Check if this should be available as a hero image
4. Click "Upload"

**Via API**:

```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('title', 'My Image');
formData.append('description', 'A beautiful photo');
formData.append('manual_tags', JSON.stringify(['nature', 'farm']));
formData.append('project_slugs', JSON.stringify(['the-harvest']));

const response = await fetch('/api/media/upload', {
  method: 'POST',
  body: formData,
});
```

### Searching Media

**Via Admin Interface**:

- Use the search box to search across titles, descriptions, and captions
- Click tag filters to narrow results
- Results update in real-time

**Via API**:

```javascript
// Search for "farm" in images tagged "community"
const response = await fetch('/api/media?search=farm&tag=community&fileType=image');
const { data } = await response.json();
```

### Managing Hero Images

**In Project Edit Pages**:

```tsx
import HeroImageManager from '@/components/HeroImageManager';

export default function ProjectEditPage({ params }) {
  return (
    <div>
      <h1>Edit Project</h1>
      <HeroImageManager
        projectSlug={params.slug}
        onHeroChanged={() => {
          // Optional: Refresh project data
          console.log('Hero image updated!');
        }}
      />
    </div>
  );
}
```

**Via API**:

```javascript
// Get current hero image
const response = await fetch('/api/projects/justicehub/hero');
const { data } = await response.json();

// Set new hero image
await fetch('/api/projects/justicehub/hero', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ media_id: 'uuid-here' }),
});
```

### Using MediaPicker Component

```tsx
import MediaPicker from '@/components/MediaPicker';

export default function MyComponent() {
  const [selectedMedia, setSelectedMedia] = useState(null);

  return (
    <MediaPicker
      onSelect={(media) => setSelectedMedia(media)}
      selectedId={selectedMedia?.id}
      fileType="image" // Optional: filter by type
      projectSlug="justicehub" // Optional: filter by project
      multiSelect={false} // Optional: allow multiple selection
      onMultiSelect={(mediaArray) => {
        // Handle multiple selection
      }}
    />
  );
}
```

## Integration Examples

### Display Project Gallery

```tsx
'use client';

import { useEffect, useState } from 'react';

export default function ProjectGallery({ slug }) {
  const [media, setMedia] = useState([]);

  useEffect(() => {
    async function fetchMedia() {
      const response = await fetch(`/api/projects/${slug}/media`);
      const { data } = await response.json();
      setMedia(data);
    }
    fetchMedia();
  }, [slug]);

  return (
    <div className="grid grid-cols-3 gap-4">
      {media.map((item) => (
        <img
          key={item.id}
          src={item.file_url}
          alt={item.alt_text || item.title}
          className="rounded-lg"
        />
      ))}
    </div>
  );
}
```

### Link Existing Media to Project

```javascript
// Link an existing media item to a project
await fetch('/api/projects/justicehub/media', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    media_id: 'uuid-here',
    link_type: 'project_page',
    display_order: 0,
    is_featured: true,
  }),
});
```

## Database Helper Functions

The migration creates PostgreSQL functions for common queries:

### `get_project_media(link_type, link_id)`

Get all media for a specific entity (project, blog post, etc.)

```sql
SELECT * FROM get_project_media('project_page', 'justicehub');
```

### `get_hero_image(link_type, link_id)`

Get the hero image for an entity

```sql
SELECT * FROM get_hero_image('project_page', 'the-harvest');
```

### `search_media(query, file_type, project_slug, tag, limit, offset)`

Full-text search with filters

```sql
SELECT * FROM search_media(
  p_search_query := 'community farm',
  p_file_type := 'image',
  p_project_slug := 'the-harvest',
  p_tag := 'workshop',
  p_limit := 20,
  p_offset := 0
);
```

## Tagging System

The three-tier tagging system allows flexible organization:

### 1. Manual Tags

User-defined tags for general categorization:
- `farming`, `workshop`, `community`, `event`, `portrait`, etc.

### 2. Impact Themes

ACT's impact areas:
- `environmental`, `social`, `economic`, `cultural`, `educational`

### 3. Project Associations

Project slugs for automatic filtering:
- `justicehub`, `the-harvest`, `empathy-ledger`, `act-farm`

**Example**: A photo of a community workshop at The Harvest could have:
- **Manual Tags**: `workshop`, `community`, `people`, `outdoor`
- **Impact Themes**: `social`, `educational`
- **Project Associations**: `the-harvest`

This allows:
- Searching for all "workshop" media across all projects
- Filtering by "social" impact theme
- Automatically showing on The Harvest project page

## File Type Categories

Supported file types are categorized as:

- **`photo`/`image`**: JPEG, PNG, GIF, WebP, SVG
- **`video`**: MP4, WebM, QuickTime
- **`audio`**: MP3, WAV, OGG
- **`document`**: PDF, DOC, DOCX
- **`video_link`**: External video embeds (YouTube, Vimeo, Loom)

## Security & Permissions

### Row Level Security (RLS)

- **Public (unauthenticated)**: Can read all media items
- **Authenticated users**: Can create, update, delete their own media
- **Service role**: Full access (for admin operations)

### Storage Bucket Access

The `media` bucket is public, allowing direct access to URLs without authentication.

For private media, create a separate `private-media` bucket with restricted access.

## Troubleshooting

### Migration Fails

**Issue**: SQL errors when applying migration

**Solution**: Apply migration manually via Supabase SQL Editor (see Step 1)

### Upload Fails

**Issue**: 500 error when uploading

**Solutions**:
1. Verify `media` storage bucket exists and is public
2. Check environment variables are set correctly
3. Ensure file size is under 50MB
4. Check file type is in allowed list

### Images Don't Display

**Issue**: Broken image links

**Solutions**:
1. Verify storage bucket is public
2. Check CORS settings in Supabase Storage
3. Ensure `NEXT_PUBLIC_SUPABASE_URL` is correct

### Hero Image Not Updating

**Issue**: Hero image doesn't change when selected

**Solutions**:
1. Check browser console for API errors
2. Verify `project_media_links` table has the link
3. Check that only one link has `is_hero = true` for the project

## Future Enhancements

Potential improvements:

1. **Image Processing**: Auto-generate thumbnails using Sharp or Supabase Image Transformation
2. **Blurhash Generation**: Generate blurhash placeholders on upload
3. **AI Tagging**: Auto-tag images using AI vision models (GPT-4 Vision, Claude Vision)
4. **Bulk Operations**: Select and update multiple media items at once
5. **Media Collections**: Create curated collections of media
6. **Version History**: Track changes to media metadata
7. **Usage Tracking**: See where each media item is used across the site
8. **CDN Integration**: Use CloudFlare or similar for faster delivery

## Support

For issues or questions:
1. Check this documentation
2. Review the code comments in source files
3. Test API endpoints directly using curl/Postman
4. Check Supabase dashboard for database errors

## Files Reference

### Core Files

- **Migration**: `supabase/migrations/20251224_media_gallery.sql`
- **Client Library**: `src/lib/media/client.ts`
- **Upload API**: `src/app/api/media/upload/route.ts`
- **Media API**: `src/app/api/media/route.ts`
- **Project Media API**: `src/app/api/projects/[slug]/media/route.ts`
- **Hero API**: `src/app/api/projects/[slug]/hero/route.ts`

### Components

- **MediaPicker**: `src/components/MediaPicker.tsx`
- **HeroImageManager**: `src/components/HeroImageManager.tsx`

### Admin Pages

- **Media Gallery**: `src/app/admin/media-gallery/page.tsx`

---

**Created**: 2024-12-24
**Last Updated**: 2024-12-24
**Version**: 1.0.0
