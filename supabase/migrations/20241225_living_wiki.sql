-- ACT Living Wiki Migration
-- Created: 2024-12-25
-- Purpose: Self-updating wiki that scans daily tools for knowledge

-- ============================================================================
-- 1. Wiki Pages Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS wiki_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Core content
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,

  -- PMPP classification
  page_type TEXT CHECK (page_type IN ('principle', 'method', 'practice', 'procedure', 'guide', 'template')) NOT NULL,

  -- Hierarchy (links to PMPP framework)
  parent_principle_id UUID REFERENCES wiki_pages(id),
  parent_method_id UUID REFERENCES wiki_pages(id),
  parent_practice_id UUID REFERENCES wiki_pages(id),

  -- Metadata
  projects TEXT[] DEFAULT ARRAY[]::TEXT[],
  domains TEXT[] DEFAULT ARRAY[]::TEXT[],
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],

  -- Knowledge sources (where this came from)
  source_types TEXT[] DEFAULT ARRAY[]::TEXT[], -- ['notion', 'gmail', 'calendar']
  source_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
  extracted_from_ids TEXT[] DEFAULT ARRAY[]::TEXT[], -- Original content IDs

  -- Review tracking
  status TEXT CHECK (status IN ('draft', 'active', 'needs_review', 'archived')) DEFAULT 'draft',
  last_reviewed_at TIMESTAMPTZ DEFAULT NOW(),
  review_frequency_days INTEGER DEFAULT 90,
  next_review_due TIMESTAMPTZ,

  -- Verification
  verified_by UUID REFERENCES auth.users(id),
  verified_at TIMESTAMPTZ,
  quality_score INTEGER CHECK (quality_score BETWEEN 1 AND 5),

  -- Version tracking
  version INTEGER DEFAULT 1,
  updated_by UUID REFERENCES auth.users(id),

  -- Search (updated via trigger)
  search_vector TSVECTOR,

  -- Usage analytics
  view_count INTEGER DEFAULT 0,
  last_viewed_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_wiki_pages_type ON wiki_pages(page_type);
CREATE INDEX idx_wiki_pages_status ON wiki_pages(status);
CREATE INDEX idx_wiki_pages_review ON wiki_pages(next_review_due) WHERE status = 'active';
CREATE INDEX idx_wiki_pages_projects ON wiki_pages USING GIN(projects);
CREATE INDEX idx_wiki_pages_domains ON wiki_pages USING GIN(domains);
CREATE INDEX idx_wiki_pages_tags ON wiki_pages USING GIN(tags);
CREATE INDEX idx_wiki_pages_search ON wiki_pages USING GIN(search_vector);
CREATE INDEX idx_wiki_pages_slug ON wiki_pages(slug);

-- Trigger to update search vector
CREATE OR REPLACE FUNCTION wiki_pages_search_trigger() RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.excerpt, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.content, '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(array_to_string(NEW.tags, ' '), '')), 'D');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER wiki_pages_search_update
  BEFORE INSERT OR UPDATE OF title, excerpt, content, tags
  ON wiki_pages
  FOR EACH ROW
  EXECUTE FUNCTION wiki_pages_search_trigger();

-- Trigger to update updated_at
CREATE TRIGGER wiki_pages_updated_at
  BEFORE UPDATE ON wiki_pages
  FOR EACH ROW
  EXECUTE FUNCTION update_knowledge_version_timestamp();

-- Trigger to calculate next_review_due
CREATE OR REPLACE FUNCTION wiki_pages_review_due_trigger() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.last_reviewed_at IS NOT NULL AND NEW.review_frequency_days IS NOT NULL THEN
    NEW.next_review_due := NEW.last_reviewed_at + (NEW.review_frequency_days || ' days')::INTERVAL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER wiki_pages_review_due
  BEFORE INSERT OR UPDATE OF last_reviewed_at, review_frequency_days
  ON wiki_pages
  FOR EACH ROW
  EXECUTE FUNCTION wiki_pages_review_due_trigger();

-- ============================================================================
-- 2. Knowledge Extraction Queue
-- ============================================================================

CREATE TABLE IF NOT EXISTS knowledge_extraction_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Source
  source_type TEXT CHECK (source_type IN ('notion', 'gmail', 'calendar', 'ghl', 'whatsapp', 'slack', 'drive')) NOT NULL,
  source_id TEXT NOT NULL,
  source_url TEXT,
  source_metadata JSONB DEFAULT '{}'::JSONB,

  -- Raw content
  raw_content TEXT NOT NULL,
  raw_title TEXT,

  -- AI extraction
  extracted_knowledge TEXT,
  suggested_title TEXT,
  suggested_type TEXT CHECK (suggested_type IN ('principle', 'method', 'practice', 'procedure', 'guide', 'template')),
  suggested_excerpt TEXT,
  suggested_projects TEXT[],
  suggested_domains TEXT[],
  suggested_tags TEXT[],
  suggested_parent_ids JSONB, -- {principle_id, method_id, practice_id}
  confidence_score DECIMAL(3,2) CHECK (confidence_score BETWEEN 0 AND 1),

  -- Review status
  status TEXT CHECK (status IN ('pending', 'in_review', 'approved', 'rejected', 'merged')) DEFAULT 'pending',
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  review_notes TEXT,

  -- If approved/merged
  wiki_page_id UUID REFERENCES wiki_pages(id),

  -- Extraction metadata
  extracted_at TIMESTAMPTZ DEFAULT NOW(),
  extraction_model TEXT DEFAULT 'mistral-7b',
  extraction_prompt TEXT,

  -- Priority (AI-determined)
  priority INTEGER CHECK (priority BETWEEN 1 AND 5) DEFAULT 3,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_extraction_queue_status ON knowledge_extraction_queue(status);
CREATE INDEX idx_extraction_queue_source ON knowledge_extraction_queue(source_type, source_id);
CREATE INDEX idx_extraction_queue_priority ON knowledge_extraction_queue(priority DESC, created_at DESC);
CREATE INDEX idx_extraction_queue_confidence ON knowledge_extraction_queue(confidence_score DESC);

-- Unique constraint to prevent duplicate extractions
CREATE UNIQUE INDEX idx_extraction_queue_unique_source
  ON knowledge_extraction_queue(source_type, source_id)
  WHERE status NOT IN ('rejected');

-- ============================================================================
-- 3. Knowledge Source Sync Status
-- ============================================================================

CREATE TABLE IF NOT EXISTS knowledge_source_sync (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  source_type TEXT CHECK (source_type IN ('notion', 'gmail', 'calendar', 'ghl', 'whatsapp', 'slack', 'drive')) UNIQUE NOT NULL,

  -- Sync tracking
  last_sync_at TIMESTAMPTZ,
  last_sync_cursor TEXT,
  last_sync_duration_ms INTEGER,
  items_scanned_last_sync INTEGER DEFAULT 0,
  items_extracted_last_sync INTEGER DEFAULT 0,

  -- Cumulative stats
  total_items_scanned INTEGER DEFAULT 0,
  total_items_extracted INTEGER DEFAULT 0,
  total_items_approved INTEGER DEFAULT 0,
  total_items_rejected INTEGER DEFAULT 0,

  -- Configuration
  enabled BOOLEAN DEFAULT TRUE,
  sync_frequency_hours INTEGER DEFAULT 24,
  next_sync_due TIMESTAMPTZ,

  -- Source-specific configuration
  config JSONB DEFAULT '{}'::JSONB,

  -- Filters (source-specific)
  filters JSONB DEFAULT '{}'::JSONB,

  -- Status
  status TEXT CHECK (status IN ('active', 'paused', 'syncing', 'error')) DEFAULT 'active',
  last_error TEXT,
  last_error_at TIMESTAMPTZ,
  consecutive_errors INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger for updated_at
CREATE TRIGGER knowledge_source_sync_updated_at
  BEFORE UPDATE ON knowledge_source_sync
  FOR EACH ROW
  EXECUTE FUNCTION update_knowledge_version_timestamp();

-- ============================================================================
-- 4. Wiki Page Versions (History)
-- ============================================================================

CREATE TABLE IF NOT EXISTS wiki_page_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES wiki_pages(id) ON DELETE CASCADE NOT NULL,

  version INTEGER NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,

  -- Change tracking
  changed_by UUID REFERENCES auth.users(id),
  change_reason TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(page_id, version)
);

-- Index
CREATE INDEX idx_wiki_versions_page ON wiki_page_versions(page_id, version DESC);

-- Trigger to create version on update
CREATE OR REPLACE FUNCTION wiki_page_create_version() RETURNS TRIGGER AS $$
BEGIN
  -- Only create version if content actually changed
  IF (OLD.content IS DISTINCT FROM NEW.content) OR
     (OLD.title IS DISTINCT FROM NEW.title) OR
     (OLD.excerpt IS DISTINCT FROM NEW.excerpt) THEN

    -- Increment version number
    NEW.version := OLD.version + 1;

    -- Save old version to history
    INSERT INTO wiki_page_versions (page_id, version, title, content, excerpt, changed_by)
    VALUES (OLD.id, OLD.version, OLD.title, OLD.content, OLD.excerpt, NEW.updated_by);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER wiki_page_versioning
  BEFORE UPDATE ON wiki_pages
  FOR EACH ROW
  EXECUTE FUNCTION wiki_page_create_version();

-- ============================================================================
-- 5. Wiki Page Links (Internal)
-- ============================================================================

CREATE TABLE IF NOT EXISTS wiki_page_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_page_id UUID REFERENCES wiki_pages(id) ON DELETE CASCADE NOT NULL,
  to_page_id UUID REFERENCES wiki_pages(id) ON DELETE CASCADE NOT NULL,
  link_type TEXT CHECK (link_type IN ('related', 'parent', 'child', 'prerequisite', 'see_also')) DEFAULT 'related',
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(from_page_id, to_page_id, link_type)
);

-- Indexes
CREATE INDEX idx_wiki_links_from ON wiki_page_links(from_page_id);
CREATE INDEX idx_wiki_links_to ON wiki_page_links(to_page_id);

-- ============================================================================
-- 6. Helper Views
-- ============================================================================

-- View: Pending extractions by priority
CREATE OR REPLACE VIEW pending_extractions AS
SELECT
  e.*,
  CASE
    WHEN e.confidence_score >= 0.8 THEN 'high'
    WHEN e.confidence_score >= 0.5 THEN 'medium'
    ELSE 'low'
  END AS confidence_level
FROM knowledge_extraction_queue e
WHERE e.status = 'pending'
ORDER BY e.priority DESC, e.confidence_score DESC, e.created_at ASC;

-- View: Active wiki pages with metadata
CREATE OR REPLACE VIEW active_wiki_pages AS
SELECT
  w.*,
  CASE
    WHEN w.next_review_due < NOW() THEN 'overdue'
    WHEN w.next_review_due < NOW() + INTERVAL '7 days' THEN 'due_soon'
    ELSE 'current'
  END AS review_status,
  (SELECT COUNT(*) FROM wiki_page_links WHERE from_page_id = w.id) AS outgoing_links,
  (SELECT COUNT(*) FROM wiki_page_links WHERE to_page_id = w.id) AS incoming_links
FROM wiki_pages w
WHERE w.status = 'active'
ORDER BY w.last_viewed_at DESC NULLS LAST;

-- View: Wiki hierarchy (breadcrumb support)
CREATE OR REPLACE VIEW wiki_hierarchy AS
WITH RECURSIVE hierarchy AS (
  -- Base case: top-level pages (principles)
  SELECT
    id,
    title,
    slug,
    page_type,
    ARRAY[id] AS path,
    ARRAY[title] AS breadcrumb,
    1 AS level
  FROM wiki_pages
  WHERE page_type = 'principle' AND status = 'active'

  UNION ALL

  -- Recursive case: child pages
  SELECT
    w.id,
    w.title,
    w.slug,
    w.page_type,
    h.path || w.id,
    h.breadcrumb || w.title,
    h.level + 1
  FROM wiki_pages w
  JOIN hierarchy h ON (
    w.parent_principle_id = h.id OR
    w.parent_method_id = h.id OR
    w.parent_practice_id = h.id
  )
  WHERE w.status = 'active'
)
SELECT * FROM hierarchy;

-- View: Knowledge source health
CREATE OR REPLACE VIEW knowledge_source_health AS
SELECT
  source_type,
  enabled,
  status,
  last_sync_at,
  next_sync_due,
  CASE
    WHEN status = 'error' THEN 'error'
    WHEN NOT enabled THEN 'disabled'
    WHEN next_sync_due < NOW() THEN 'overdue'
    WHEN next_sync_due < NOW() + INTERVAL '2 hours' THEN 'due_soon'
    ELSE 'healthy'
  END AS health_status,
  total_items_scanned,
  total_items_extracted,
  total_items_approved,
  CASE
    WHEN total_items_extracted > 0
    THEN ROUND((total_items_approved::DECIMAL / total_items_extracted) * 100, 1)
    ELSE 0
  END AS approval_rate_pct,
  consecutive_errors,
  last_error
FROM knowledge_source_sync
ORDER BY
  CASE
    WHEN status = 'error' THEN 1
    WHEN next_sync_due < NOW() THEN 2
    ELSE 3
  END,
  source_type;

-- ============================================================================
-- 7. Row Level Security
-- ============================================================================

ALTER TABLE wiki_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_extraction_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_source_sync ENABLE ROW LEVEL SECURITY;
ALTER TABLE wiki_page_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE wiki_page_links ENABLE ROW LEVEL SECURITY;

-- Wiki pages: Public read for active, authenticated write
CREATE POLICY "Active wiki pages are publicly readable"
  ON wiki_pages FOR SELECT
  USING (status = 'active');

CREATE POLICY "Authenticated users can create wiki pages"
  ON wiki_pages FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own wiki pages"
  ON wiki_pages FOR UPDATE
  USING (auth.uid() = updated_by OR auth.uid() = verified_by);

-- Extraction queue: Authenticated users only
CREATE POLICY "Authenticated users can view extraction queue"
  ON knowledge_extraction_queue FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update extraction queue"
  ON knowledge_extraction_queue FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Source sync: Authenticated read, admin write
CREATE POLICY "Authenticated users can view source sync status"
  ON knowledge_source_sync FOR SELECT
  USING (auth.role() = 'authenticated');

-- Versions: Public read if parent page is active
CREATE POLICY "Wiki versions are readable if page is active"
  ON wiki_page_versions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM wiki_pages
      WHERE id = page_id AND status = 'active'
    )
  );

-- Links: Public read
CREATE POLICY "Wiki links are publicly readable"
  ON wiki_page_links FOR SELECT
  USING (true);

-- ============================================================================
-- 8. Sample Data
-- ============================================================================

-- Insert core principles (from PMPP table)
INSERT INTO wiki_pages (title, slug, page_type, content, excerpt, status, domains, tags) VALUES
(
  'Community Ownership',
  'community-ownership',
  'principle',
  '# Community Ownership

Communities own their innovations, stories, and solutions. ACT facilitates but never owns.

## What This Means

- Projects belong to communities, not ACT
- Communities decide what gets shared and how
- We design for eventual obsolescence
- Success = communities no longer need us

## In Practice

- All IP stays with communities
- OCAP® principles guide data governance
- Community consent required at every step
- We build capacity, not dependency

## Related

- [Beautiful Obsolescence](beautiful-obsolescence)
- [OCAP® Principles](ocap-principles)
- [Consent at Every Level](consent-at-every-level)',
  'Communities own their innovations, stories, and solutions. ACT facilitates but never owns.',
  'active',
  ARRAY['all', 'values'],
  ARRAY['principles', 'community', 'ownership', 'values']
),
(
  'Beautiful Obsolescence',
  'beautiful-obsolescence',
  'principle',
  '# Beautiful Obsolescence

We design ourselves to become obsolete as communities build their own capacity.

## The Philosophy

The measure of our success is when communities no longer need us. We build capacity, share knowledge, and step back.

## How We Practice This

- Open source everything possible
- Document processes so others can replicate
- Train communities to run systems independently
- Celebrate when partners outgrow us

## Examples

- Empathy Ledger designed for community forking
- Knowledge base openly shared
- Training programs transfer ownership
- "Graduation" is celebrated, not prevented

## Related

- [Community Ownership](community-ownership)
- [Knowledge Sharing](knowledge-sharing)
- [Capacity Building](capacity-building)',
  'We design ourselves to become obsolete as communities build their own capacity.',
  'active',
  ARRAY['all', 'values'],
  ARRAY['principles', 'obsolescence', 'sustainability', 'values']
),
(
  'Consent at Every Level',
  'consent-at-every-level',
  'principle',
  '# Consent at Every Level

Nothing moves forward without explicit, informed consent from communities.

## Core Practice

- No surprises
- Clear explanations of what we''re asking
- Space to say no
- Respect for community timelines

## Consent Architecture

1. **Initial consent**: Partner with us?
2. **Data consent**: Share this information?
3. **Story consent**: Tell this story?
4. **Use consent**: Use it for this purpose?
5. **Ongoing consent**: Continue this relationship?

## Implementation

- Consent forms at every stage
- Regular check-ins
- Easy opt-out mechanisms
- Document all permissions

## Related

- [OCAP® Principles](ocap-principles)
- [Elder Review Process](elder-review-process)
- [Community Ownership](community-ownership)',
  'Nothing moves forward without explicit, informed consent from communities.',
  'active',
  ARRAY['all', 'values'],
  ARRAY['principles', 'consent', 'ethics', 'values']
);

-- Update parent relationships
UPDATE wiki_pages SET parent_principle_id = (SELECT id FROM wiki_pages WHERE slug = 'community-ownership')
WHERE slug IN ('beautiful-obsolescence', 'consent-at-every-level');

-- Insert initial source sync configurations
INSERT INTO knowledge_source_sync (source_type, enabled, sync_frequency_hours, config) VALUES
('notion', true, 24, '{"databases": [], "search_query": ""}'),
('gmail', false, 24, '{"labels": [], "search_query": "label:decisions OR label:processes"}'),
('calendar', false, 168, '{"calendar_ids": []}'),
('ghl', false, 24, '{}'),
('whatsapp', false, 0, '{"manual_import_only": true}');

-- ============================================================================
-- End of Migration
-- ============================================================================
