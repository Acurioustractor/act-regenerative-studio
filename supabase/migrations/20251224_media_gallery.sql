-- ACT Project Media Gallery System
-- Adapted from ACT Placemat webflow-portfolio architecture
-- Provides comprehensive media management for all ACT projects

-- ============================================================================
-- 1. MEDIA ITEMS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS media_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- File references
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,

  -- Media type
  file_type TEXT NOT NULL CHECK (file_type IN ('photo', 'video', 'document', 'image', 'video_link', 'audio')),
  mime_type TEXT,
  file_size_bytes BIGINT,

  -- Image/Video metadata
  width INTEGER,
  height INTEGER,
  duration_seconds INTEGER,
  blurhash TEXT,

  -- Descriptive metadata
  title TEXT,
  description TEXT,
  alt_text TEXT,
  credit TEXT, -- Photographer/videographer credit
  caption TEXT,

  -- Organization & tagging
  manual_tags TEXT[] DEFAULT '{}',
  impact_themes TEXT[] DEFAULT '{}',
  project_slugs TEXT[] DEFAULT '{}', -- ACT project slugs (justicehub, the-harvest, etc.)

  -- Hero image flags
  is_hero_image BOOLEAN DEFAULT false,

  -- Source tracking
  source TEXT, -- 'upload', 'webflow', 'empathy-ledger', 'year-in-review', 'notion'
  source_id TEXT, -- ID from source system

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_media_items_file_type ON media_items(file_type);
CREATE INDEX IF NOT EXISTS idx_media_items_created_at ON media_items(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_media_items_is_hero ON media_items(is_hero_image) WHERE is_hero_image = true;
CREATE INDEX IF NOT EXISTS idx_media_items_source ON media_items(source);

-- GIN indexes for array searches
CREATE INDEX IF NOT EXISTS idx_media_items_project_slugs ON media_items USING GIN(project_slugs);
CREATE INDEX IF NOT EXISTS idx_media_items_manual_tags ON media_items USING GIN(manual_tags);
CREATE INDEX IF NOT EXISTS idx_media_items_impact_themes ON media_items USING GIN(impact_themes);

-- Full-text search on text fields
CREATE INDEX IF NOT EXISTS idx_media_items_search ON media_items USING GIN(
  to_tsvector('english', COALESCE(title, '') || ' ' || COALESCE(description, '') || ' ' || COALESCE(caption, ''))
);

-- ============================================================================
-- 2. PROJECT MEDIA LINKS (Polymorphic many-to-many)
-- ============================================================================

CREATE TABLE IF NOT EXISTS project_media_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Media reference
  media_id UUID NOT NULL REFERENCES media_items(id) ON DELETE CASCADE,

  -- Polymorphic link
  link_type TEXT NOT NULL CHECK (link_type IN ('project_page', 'blog_post', 'gallery', 'timeline_entry', 'hero')),
  link_id TEXT NOT NULL, -- Slug or ID of the entity

  -- Display metadata
  display_order INTEGER DEFAULT 0,
  caption TEXT,
  alt_text TEXT,
  is_hero BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Ensure one media item can't be linked to same entity multiple times
  UNIQUE(media_id, link_type, link_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_project_media_links_media_id ON project_media_links(media_id);
CREATE INDEX IF NOT EXISTS idx_project_media_links_link ON project_media_links(link_type, link_id);
CREATE INDEX IF NOT EXISTS idx_project_media_links_hero ON project_media_links(is_hero) WHERE is_hero = true;

-- ============================================================================
-- 3. VIDEO EMBEDS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS video_embeds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Platform
  platform TEXT NOT NULL CHECK (platform IN ('youtube', 'vimeo', 'loom', 'direct')),
  video_id TEXT NOT NULL, -- YouTube video ID, Vimeo ID, etc.
  embed_url TEXT NOT NULL,

  -- Metadata
  thumbnail_url TEXT,
  title TEXT,
  description TEXT,
  duration_seconds INTEGER,

  -- Polymorphic link
  link_type TEXT CHECK (link_type IN ('project_page', 'blog_post', 'gallery', 'timeline_entry', 'standalone')),
  link_id TEXT,

  -- Display
  display_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  autoplay BOOLEAN DEFAULT false,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_video_embeds_platform ON video_embeds(platform);
CREATE INDEX IF NOT EXISTS idx_video_embeds_link ON video_embeds(link_type, link_id);

-- ============================================================================
-- 4. HELPER FUNCTIONS
-- ============================================================================

-- Get media gallery for a specific entity
CREATE OR REPLACE FUNCTION get_project_media(p_link_type TEXT, p_link_id TEXT)
RETURNS TABLE (
  id UUID,
  file_url TEXT,
  thumbnail_url TEXT,
  file_type TEXT,
  title TEXT,
  description TEXT,
  alt_text TEXT,
  caption TEXT,
  credit TEXT,
  width INTEGER,
  height INTEGER,
  blurhash TEXT,
  display_order INTEGER,
  is_hero BOOLEAN,
  is_featured BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    m.id,
    m.file_url,
    m.thumbnail_url,
    m.file_type,
    m.title,
    m.description,
    COALESCE(pml.alt_text, m.alt_text) as alt_text,
    COALESCE(pml.caption, m.caption) as caption,
    m.credit,
    m.width,
    m.height,
    m.blurhash,
    pml.display_order,
    pml.is_hero,
    pml.is_featured
  FROM media_items m
  INNER JOIN project_media_links pml ON m.id = pml.media_id
  WHERE pml.link_type = p_link_type
    AND pml.link_id = p_link_id
  ORDER BY pml.is_hero DESC, pml.display_order ASC, m.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Get hero image for a specific entity
CREATE OR REPLACE FUNCTION get_hero_image(p_link_type TEXT, p_link_id TEXT)
RETURNS TABLE (
  id UUID,
  file_url TEXT,
  thumbnail_url TEXT,
  title TEXT,
  alt_text TEXT,
  blurhash TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    m.id,
    m.file_url,
    m.thumbnail_url,
    m.title,
    COALESCE(pml.alt_text, m.alt_text) as alt_text,
    m.blurhash
  FROM media_items m
  INNER JOIN project_media_links pml ON m.id = pml.media_id
  WHERE pml.link_type = p_link_type
    AND pml.link_id = p_link_id
    AND pml.is_hero = true
  ORDER BY m.created_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Search media items
CREATE OR REPLACE FUNCTION search_media(
  p_search_query TEXT DEFAULT NULL,
  p_file_type TEXT DEFAULT NULL,
  p_project_slug TEXT DEFAULT NULL,
  p_tag TEXT DEFAULT NULL,
  p_limit INTEGER DEFAULT 50,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  file_url TEXT,
  thumbnail_url TEXT,
  file_type TEXT,
  title TEXT,
  description TEXT,
  alt_text TEXT,
  manual_tags TEXT[],
  impact_themes TEXT[],
  project_slugs TEXT[],
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    m.id,
    m.file_url,
    m.thumbnail_url,
    m.file_type,
    m.title,
    m.description,
    m.alt_text,
    m.manual_tags,
    m.impact_themes,
    m.project_slugs,
    m.created_at
  FROM media_items m
  WHERE
    (p_search_query IS NULL OR
     to_tsvector('english', COALESCE(m.title, '') || ' ' || COALESCE(m.description, ''))
     @@ plainto_tsquery('english', p_search_query))
    AND (p_file_type IS NULL OR m.file_type = p_file_type)
    AND (p_project_slug IS NULL OR p_project_slug = ANY(m.project_slugs))
    AND (p_tag IS NULL OR p_tag = ANY(m.manual_tags) OR p_tag = ANY(m.impact_themes))
  ORDER BY m.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 5. ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE media_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_media_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_embeds ENABLE ROW LEVEL SECURITY;

-- Public can read all media
CREATE POLICY "Public can read media_items"
  ON media_items FOR SELECT
  USING (true);

CREATE POLICY "Public can read project_media_links"
  ON project_media_links FOR SELECT
  USING (true);

CREATE POLICY "Public can read video_embeds"
  ON video_embeds FOR SELECT
  USING (true);

-- Authenticated users can insert media (allow NULL created_by for system uploads)
CREATE POLICY "Authenticated users can insert media"
  ON media_items FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated users can update their media or media without owner
CREATE POLICY "Authenticated users can update their media"
  ON media_items FOR UPDATE
  TO authenticated
  USING (created_by IS NULL OR auth.uid() = created_by);

-- Authenticated users can delete their media or media without owner
CREATE POLICY "Authenticated users can delete their media"
  ON media_items FOR DELETE
  TO authenticated
  USING (created_by IS NULL OR auth.uid() = created_by);

-- Similar for links
CREATE POLICY "Authenticated users can manage media links"
  ON project_media_links FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage video embeds"
  ON video_embeds FOR ALL
  TO authenticated
  USING (true);

-- ============================================================================
-- 6. UPDATED_AT TRIGGER
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_media_items_updated_at
  BEFORE UPDATE ON media_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_video_embeds_updated_at
  BEFORE UPDATE ON video_embeds
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- DONE
-- ============================================================================

COMMENT ON TABLE media_items IS 'Central media library for all ACT projects with tagging and metadata';
COMMENT ON TABLE project_media_links IS 'Polymorphic links between media and various content entities';
COMMENT ON TABLE video_embeds IS 'External video embeds from YouTube, Vimeo, Loom, etc.';
