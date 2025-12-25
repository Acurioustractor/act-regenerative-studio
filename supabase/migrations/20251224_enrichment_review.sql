-- Enrichment Review System
-- Stores AI-generated content for human verification

CREATE TABLE IF NOT EXISTS enrichment_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Project reference
  project_slug TEXT NOT NULL,
  project_title TEXT,

  -- Type of enrichment
  enrichment_type TEXT NOT NULL CHECK (enrichment_type IN ('notion', 'blog_links', 'related_projects', 'description', 'media_suggestions')),

  -- Content
  ai_generated JSONB NOT NULL,
  original_data JSONB,

  -- Metadata
  confidence DECIMAL(3,2) CHECK (confidence >= 0 AND confidence <= 1),
  reasoning TEXT, -- Why the AI made this suggestion

  -- Review status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'needs_revision')),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  reviewer_notes TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_enrichment_reviews_project ON enrichment_reviews(project_slug);
CREATE INDEX IF NOT EXISTS idx_enrichment_reviews_status ON enrichment_reviews(status);
CREATE INDEX IF NOT EXISTS idx_enrichment_reviews_type ON enrichment_reviews(enrichment_type);
CREATE INDEX IF NOT EXISTS idx_enrichment_reviews_created ON enrichment_reviews(created_at DESC);

-- RLS Policies
ALTER TABLE enrichment_reviews ENABLE ROW LEVEL SECURITY;

-- Public can read approved enrichments
CREATE POLICY "Public can read approved enrichments"
  ON enrichment_reviews FOR SELECT
  USING (status = 'approved');

-- Authenticated users can manage enrichments
CREATE POLICY "Authenticated users can manage enrichments"
  ON enrichment_reviews FOR ALL
  TO authenticated
  USING (true);

-- Updated_at trigger
DROP TRIGGER IF EXISTS update_enrichment_reviews_updated_at ON enrichment_reviews;
CREATE TRIGGER update_enrichment_reviews_updated_at
  BEFORE UPDATE ON enrichment_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Helper function to get pending reviews by project
CREATE OR REPLACE FUNCTION get_pending_enrichments(p_project_slug TEXT DEFAULT NULL)
RETURNS TABLE (
  id UUID,
  project_slug TEXT,
  project_title TEXT,
  enrichment_type TEXT,
  ai_generated JSONB,
  original_data JSONB,
  confidence DECIMAL,
  reasoning TEXT,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    e.id,
    e.project_slug,
    e.project_title,
    e.enrichment_type,
    e.ai_generated,
    e.original_data,
    e.confidence,
    e.reasoning,
    e.created_at
  FROM enrichment_reviews e
  WHERE e.status = 'pending'
    AND (p_project_slug IS NULL OR e.project_slug = p_project_slug)
  ORDER BY e.created_at ASC;
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE enrichment_reviews IS 'Stores AI-generated content for human verification before going live';
