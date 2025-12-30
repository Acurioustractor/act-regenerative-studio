-- ============================================================================
-- ACT Unified Knowledge Base
-- Created: 2026-01-01
-- Purpose: Unified vector database for ACT's small language model system
--
-- Merges best practices from:
-- - ACT Studio Living Wiki (confidence scoring, extraction queue)
-- - ACT Placemat (multi-provider AI, contact intelligence)
--
-- Research:
-- - https://www.amazon.science/publications/confidence-scoring-for-llm-generated-sql-in-supply-chain-data-extraction
-- - https://sefiks.com/2025/09/02/from-embeddings-to-confidence-scores-converting-similarity-to-percentages/
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm; -- For text search optimization

-- ============================================================================
-- 1. Unified Knowledge Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS act_unified_knowledge (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  -- CONTENT
  -- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  summary TEXT, -- AI-generated summary (optional)
  excerpt TEXT, -- Short excerpt for previews

  -- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  -- SOURCE TRACKING (from Living Wiki)
  -- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  source_type TEXT NOT NULL CHECK (source_type IN (
    'codebase',        -- Documentation from code repos
    'notion',          -- Notion pages
    'gmail',           -- Email decisions/discussions
    'placemat',        -- ACT Placemat content
    'empathy-ledger',  -- Stories from Empathy Ledger
    'blog',            -- Blog posts
    'wiki',            -- Existing wiki pages
    'manual'           -- Manually created
  )),
  source_path TEXT NOT NULL,     -- File path or URL
  source_id TEXT,                 -- Original source ID
  source_project TEXT,            -- Which ACT project (act-regenerative-studio, etc.)
  source_url TEXT,                -- Public URL if available
  source_metadata JSONB DEFAULT '{}'::JSONB,

  -- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  -- CLASSIFICATION (PMPP Framework from Living Wiki)
  -- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  content_type TEXT CHECK (content_type IN (
    'principle',    -- Core values and beliefs
    'method',       -- Frameworks and approaches
    'practice',     -- How we regularly do things
    'procedure',    -- Step-by-step processes
    'decision',     -- Key decisions made
    'insight',      -- Learnings and observations
    'story',        -- Community stories
    'guide',        -- How-to guides
    'template',     -- Reusable templates
    'pattern'       -- Recurring patterns
  )),

  -- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  -- VECTOR EMBEDDINGS (Dual Strategy)
  -- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  -- Full semantic search (ACT Studio approach - OpenAI text-embedding-3-small)
  content_embedding vector(1536),

  -- Fast matching (ACT Placemat approach - Hugging Face BAAI/bge-small-en-v1.5)
  -- Optional - use for quick contact/profile matching
  summary_embedding vector(384),

  -- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  -- CONFIDENCE SCORING (ACT Studio Research-Backed Approach)
  -- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  similarity_score DECIMAL(3,2) CHECK (similarity_score >= 0 AND similarity_score <= 1),

  -- Confidence calculation method
  confidence_method TEXT CHECK (confidence_method IN (
    'embedding-semantic',  -- Embedding similarity (preferred)
    'keyword-structural',  -- Keyword-based fallback
    'hybrid'              -- Both combined
  )) DEFAULT 'embedding-semantic',

  -- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  -- AI ENRICHMENT (ACT Placemat Approach)
  -- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ai_enrichment JSONB DEFAULT '{}'::JSONB,
  -- Structure:
  -- {
  --   "providers": ["claude-sonnet-4-5", "gpt-4"],
  --   "themes": ["regeneration", "community-ownership"],
  --   "connections": ["story-123", "principle-456"],
  --   "quality_score": 0.85,
  --   "extracted_at": "2025-12-30T12:00:00Z",
  --   "extraction_model": "claude-sonnet-4-5",
  --   "cost": 0.015
  -- }

  -- Strategic value (AI-generated)
  strategic_value TEXT CHECK (strategic_value IN ('high', 'medium', 'low')),

  -- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  -- ACT METHODOLOGY METADATA
  -- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  -- Strategic pillars
  pillar TEXT[] DEFAULT ARRAY[]::TEXT[], -- ['Ethical Storytelling', 'Justice Reimagined', etc.]

  -- LCAA methodology phase
  lcaa_phase TEXT CHECK (lcaa_phase IN ('Listen', 'Curiosity', 'Action', 'Art')),

  -- Which ACT projects this relates to
  projects TEXT[] DEFAULT ARRAY[]::TEXT[], -- ['empathy-ledger', 'justicehub', 'theharvest', etc.]

  -- General tags
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],

  -- Domains (for Living Wiki compatibility)
  domains TEXT[] DEFAULT ARRAY[]::TEXT[], -- ['all', 'values', 'technical', etc.]

  -- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  -- IMPORTANCE & USAGE TRACKING
  -- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  importance_score DECIMAL(3,2) DEFAULT 0.5 CHECK (importance_score >= 0 AND importance_score <= 1),

  -- Usage analytics
  view_count INTEGER DEFAULT 0,
  last_viewed_at TIMESTAMPTZ,
  last_accessed_at TIMESTAMPTZ,

  -- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  -- LIFECYCLE & STATUS (Living Wiki Pattern)
  -- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  status TEXT CHECK (status IN (
    'pending',       -- Extracted but not reviewed
    'in_review',     -- Being reviewed
    'active',        -- Published and active
    'needs_review',  -- Needs periodic review
    'archived'       -- No longer active
  )) DEFAULT 'pending',

  -- Review tracking
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  review_notes TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  indexed_at TIMESTAMPTZ DEFAULT NOW(),

  -- Full-text search vector (auto-updated via trigger)
  search_vector TSVECTOR
);

-- ============================================================================
-- INDEXES (Optimized for Performance)
-- ============================================================================

-- Vector similarity indexes (IVFFlat from ACT Studio proven approach)
CREATE INDEX idx_knowledge_content_embedding ON act_unified_knowledge
  USING ivfflat (content_embedding vector_cosine_ops)
  WITH (lists = 100);

CREATE INDEX idx_knowledge_summary_embedding ON act_unified_knowledge
  USING ivfflat (summary_embedding vector_cosine_ops)
  WITH (lists = 100);

-- Source tracking
CREATE INDEX idx_knowledge_source_type ON act_unified_knowledge(source_type);
CREATE INDEX idx_knowledge_source_project ON act_unified_knowledge(source_project);
CREATE INDEX idx_knowledge_source_id ON act_unified_knowledge(source_type, source_id);

-- Classification
CREATE INDEX idx_knowledge_content_type ON act_unified_knowledge(content_type);
CREATE INDEX idx_knowledge_status ON act_unified_knowledge(status);

-- ACT metadata (GIN indexes for array columns)
CREATE INDEX idx_knowledge_pillar ON act_unified_knowledge USING GIN(pillar);
CREATE INDEX idx_knowledge_projects ON act_unified_knowledge USING GIN(projects);
CREATE INDEX idx_knowledge_tags ON act_unified_knowledge USING GIN(tags);
CREATE INDEX idx_knowledge_domains ON act_unified_knowledge USING GIN(domains);

-- Quality & importance
CREATE INDEX idx_knowledge_confidence ON act_unified_knowledge(confidence_score DESC);
CREATE INDEX idx_knowledge_importance ON act_unified_knowledge(importance_score DESC);
CREATE INDEX idx_knowledge_strategic_value ON act_unified_knowledge(strategic_value);

-- Full-text search
CREATE INDEX idx_knowledge_search ON act_unified_knowledge USING GIN(search_vector);

-- Composite index for common queries
CREATE INDEX idx_knowledge_active_high_confidence ON act_unified_knowledge(status, confidence_score DESC)
  WHERE status = 'active' AND confidence_score >= 0.7;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Auto-update search_vector on content changes
CREATE OR REPLACE FUNCTION update_knowledge_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.excerpt, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.summary, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.content, '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(array_to_string(NEW.tags, ' '), '')), 'D');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER knowledge_search_vector_update
  BEFORE INSERT OR UPDATE OF title, excerpt, summary, content, tags
  ON act_unified_knowledge
  FOR EACH ROW
  EXECUTE FUNCTION update_knowledge_search_vector();

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_knowledge_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER knowledge_updated_at
  BEFORE UPDATE ON act_unified_knowledge
  FOR EACH ROW
  EXECUTE FUNCTION update_knowledge_updated_at();

-- ============================================================================
-- SEMANTIC SEARCH FUNCTIONS (ACT Studio Proven Approach)
-- ============================================================================

-- Search using content embeddings (1536-dim for accuracy)
CREATE OR REPLACE FUNCTION search_knowledge(
  query_embedding vector(1536),
  match_threshold FLOAT DEFAULT 0.7,
  match_count INT DEFAULT 10,
  filter_project TEXT DEFAULT NULL,
  filter_type TEXT DEFAULT NULL,
  filter_status TEXT DEFAULT 'active'
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  content TEXT,
  excerpt TEXT,
  source_path TEXT,
  content_type TEXT,
  similarity FLOAT,
  confidence_score DECIMAL
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    k.id,
    k.title,
    k.content,
    k.excerpt,
    k.source_path,
    k.content_type,
    1 - (k.content_embedding <=> query_embedding) AS similarity,
    k.confidence_score
  FROM act_unified_knowledge k
  WHERE
    k.content_embedding IS NOT NULL
    AND 1 - (k.content_embedding <=> query_embedding) > match_threshold
    AND (filter_project IS NULL OR k.source_project = filter_project)
    AND (filter_type IS NULL OR k.content_type = filter_type)
    AND (filter_status IS NULL OR k.status = filter_status)
  ORDER BY k.content_embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Fast search using summary embeddings (384-dim for speed)
CREATE OR REPLACE FUNCTION search_knowledge_fast(
  query_embedding vector(384),
  match_threshold FLOAT DEFAULT 0.6,
  match_count INT DEFAULT 20
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  excerpt TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    k.id,
    k.title,
    k.excerpt,
    1 - (k.summary_embedding <=> query_embedding) AS similarity
  FROM act_unified_knowledge k
  WHERE
    k.summary_embedding IS NOT NULL
    AND k.status = 'active'
    AND 1 - (k.summary_embedding <=> query_embedding) > match_threshold
  ORDER BY k.summary_embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Increment view count on access (ACT Studio pattern)
CREATE OR REPLACE FUNCTION increment_knowledge_view(knowledge_id UUID)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE act_unified_knowledge
  SET
    view_count = view_count + 1,
    last_viewed_at = NOW(),
    last_accessed_at = NOW()
  WHERE id = knowledge_id;
END;
$$;

-- Full-text search combined with semantic search
CREATE OR REPLACE FUNCTION search_knowledge_hybrid(
  query_text TEXT,
  query_embedding vector(1536),
  match_count INT DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  content TEXT,
  semantic_similarity FLOAT,
  text_rank FLOAT,
  combined_score FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    k.id,
    k.title,
    k.content,
    1 - (k.content_embedding <=> query_embedding) AS semantic_similarity,
    ts_rank(k.search_vector, websearch_to_tsquery('english', query_text)) AS text_rank,
    -- Combined score: 70% semantic, 30% text
    (0.7 * (1 - (k.content_embedding <=> query_embedding))) +
    (0.3 * ts_rank(k.search_vector, websearch_to_tsquery('english', query_text))) AS combined_score
  FROM act_unified_knowledge k
  WHERE
    k.content_embedding IS NOT NULL
    AND k.status = 'active'
    AND (
      k.search_vector @@ websearch_to_tsquery('english', query_text)
      OR (1 - (k.content_embedding <=> query_embedding)) > 0.5
    )
  ORDER BY combined_score DESC
  LIMIT match_count;
END;
$$;

-- ============================================================================
-- KNOWLEDGE SOURCE SYNC TABLE (Living Wiki Pattern)
-- ============================================================================

CREATE TABLE IF NOT EXISTS knowledge_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  source_type TEXT NOT NULL,
  source_identifier TEXT NOT NULL, -- Repo name, file path, database ID
  source_config JSONB DEFAULT '{}'::JSONB,

  -- Sync tracking
  last_synced_at TIMESTAMPTZ,
  next_sync_at TIMESTAMPTZ,
  sync_frequency_hours INTEGER DEFAULT 24,

  -- Stats
  total_chunks INTEGER DEFAULT 0,
  total_synced INTEGER DEFAULT 0,
  last_sync_chunks INTEGER DEFAULT 0,

  -- Status
  sync_status TEXT CHECK (sync_status IN ('pending', 'syncing', 'completed', 'failed', 'paused')) DEFAULT 'pending',
  error_message TEXT,
  consecutive_errors INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(source_type, source_identifier)
);

CREATE INDEX idx_sources_status ON knowledge_sources(sync_status);
CREATE INDEX idx_sources_next_sync ON knowledge_sources(next_sync_at) WHERE sync_status != 'paused';

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE act_unified_knowledge ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_sources ENABLE ROW LEVEL SECURITY;

-- Public can read active knowledge with high confidence
CREATE POLICY "Active knowledge publicly readable"
  ON act_unified_knowledge FOR SELECT
  USING (status = 'active' AND confidence_score >= 0.7);

-- Service role can do everything
CREATE POLICY "Service role full access to knowledge"
  ON act_unified_knowledge FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Authenticated users can read all knowledge
CREATE POLICY "Authenticated users can read all knowledge"
  ON act_unified_knowledge FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can update knowledge they reviewed
CREATE POLICY "Authenticated users can update reviewed knowledge"
  ON act_unified_knowledge FOR UPDATE
  TO authenticated
  USING (auth.uid() = reviewed_by);

-- Service role full access to sources
CREATE POLICY "Service role full access to sources"
  ON knowledge_sources FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Authenticated users can read sources
CREATE POLICY "Authenticated users can read sources"
  ON knowledge_sources FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================================
-- HELPFUL VIEWS
-- ============================================================================

-- High-quality active knowledge
CREATE OR REPLACE VIEW active_knowledge AS
SELECT
  k.*,
  CASE
    WHEN k.confidence_score >= 0.9 THEN 'excellent'
    WHEN k.confidence_score >= 0.8 THEN 'high'
    WHEN k.confidence_score >= 0.7 THEN 'good'
    ELSE 'medium'
  END AS quality_tier
FROM act_unified_knowledge k
WHERE k.status = 'active' AND k.confidence_score >= 0.7
ORDER BY k.importance_score DESC, k.confidence_score DESC;

-- Knowledge needing review
CREATE OR REPLACE VIEW knowledge_needs_review AS
SELECT
  k.id,
  k.title,
  k.content_type,
  k.source_project,
  k.confidence_score,
  k.created_at
FROM act_unified_knowledge k
WHERE k.status = 'pending' AND k.confidence_score >= 0.7
ORDER BY k.confidence_score DESC, k.importance_score DESC;

-- Source health dashboard
CREATE OR REPLACE VIEW source_health AS
SELECT
  source_type,
  source_identifier,
  sync_status,
  last_synced_at,
  next_sync_at,
  total_chunks,
  consecutive_errors,
  CASE
    WHEN sync_status = 'failed' OR consecutive_errors >= 3 THEN 'error'
    WHEN sync_status = 'paused' THEN 'paused'
    WHEN next_sync_at < NOW() THEN 'overdue'
    WHEN next_sync_at < NOW() + INTERVAL '2 hours' THEN 'due_soon'
    ELSE 'healthy'
  END AS health_status
FROM knowledge_sources
ORDER BY
  CASE
    WHEN sync_status = 'failed' THEN 1
    WHEN next_sync_at < NOW() THEN 2
    ELSE 3
  END,
  source_type;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE act_unified_knowledge IS 'Unified knowledge base aggregating all ACT documentation, decisions, principles, and learnings for LM training and RAG retrieval. Merges ACT Studio Living Wiki + ACT Placemat multi-provider AI patterns.';

COMMENT ON COLUMN act_unified_knowledge.content_embedding IS 'OpenAI text-embedding-3-small (1536-dim) for high-accuracy semantic search';
COMMENT ON COLUMN act_unified_knowledge.summary_embedding IS 'Hugging Face BAAI/bge-small-en-v1.5 (384-dim) for fast contact/profile matching';
COMMENT ON COLUMN act_unified_knowledge.confidence_score IS 'Research-backed confidence score (0.0-1.0) using logistic function on embedding similarity. 0.7+ = good, 0.85-0.95 = excellent. Source: Amazon Science, Sefik 2025';
COMMENT ON COLUMN act_unified_knowledge.ai_enrichment IS 'AI-generated metadata: providers used, themes extracted, connections found, quality scores, costs';
COMMENT ON COLUMN act_unified_knowledge.strategic_value IS 'AI-classified strategic importance (high/medium/low) based on multi-provider consensus';

COMMENT ON FUNCTION search_knowledge IS 'Semantic search using 1536-dim embeddings with 0.7 threshold (research-backed). Returns top matches with similarity scores.';
COMMENT ON FUNCTION search_knowledge_fast IS 'Fast semantic search using 384-dim embeddings for quick lookups (contact matching, real-time suggestions)';
COMMENT ON FUNCTION search_knowledge_hybrid IS 'Combined semantic + full-text search (70% semantic, 30% text rank) for best accuracy';

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '✅ ACT Unified Knowledge Base Created Successfully!';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '';
  RAISE NOTICE '📊 Database Schema:';
  RAISE NOTICE '   • act_unified_knowledge - Main knowledge table';
  RAISE NOTICE '   • knowledge_sources - Source sync tracking';
  RAISE NOTICE '';
  RAISE NOTICE '🔍 Search Functions:';
  RAISE NOTICE '   • search_knowledge() - Accurate semantic search (1536-dim)';
  RAISE NOTICE '   • search_knowledge_fast() - Fast matching (384-dim)';
  RAISE NOTICE '   • search_knowledge_hybrid() - Combined semantic + text';
  RAISE NOTICE '';
  RAISE NOTICE '📈 Indexes Created:';
  RAISE NOTICE '   • IVFFlat vector indexes (lists=100)';
  RAISE NOTICE '   • GIN indexes for arrays (pillar, projects, tags)';
  RAISE NOTICE '   • Full-text search (tsvector)';
  RAISE NOTICE '';
  RAISE NOTICE '🎯 Next Steps:';
  RAISE NOTICE '   1. Add OPENAI_API_KEY to .env.local';
  RAISE NOTICE '   2. Deploy embedding service';
  RAISE NOTICE '   3. Run initial knowledge ingestion';
  RAISE NOTICE '   4. Test semantic search with sample queries';
  RAISE NOTICE '';
  RAISE NOTICE '🔗 Research Sources:';
  RAISE NOTICE '   • Amazon Science: Confidence scoring research';
  RAISE NOTICE '   • Sefik 2025: Embeddings to confidence conversion';
  RAISE NOTICE '   • pgvector: IVFFlat optimization guide';
  RAISE NOTICE '';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
END;
$$;
