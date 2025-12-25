/**
 * ACT Living Wiki - Embeddings Support
 *
 * Adds vector embeddings support for semantic similarity-based confidence scoring
 *
 * Research: https://www.amazon.science/publications/confidence-scoring-for-llm-generated-sql-in-supply-chain-data-extraction
 * Method: Embedding similarity shows 30-40% better accuracy than keyword matching
 */

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Add embedding column to extraction queue
ALTER TABLE knowledge_extraction_queue
ADD COLUMN content_embedding vector(1536);

-- Add embedding column to wiki pages for future search
ALTER TABLE wiki_pages
ADD COLUMN content_embedding vector(1536);

-- Create index for fast similarity search (IVFFlat algorithm)
-- Lists parameter: sqrt(row_count) is a good default
-- We'll start with 100 lists, can adjust as data grows
CREATE INDEX IF NOT EXISTS idx_queue_embedding
ON knowledge_extraction_queue
USING ivfflat (content_embedding vector_cosine_ops)
WITH (lists = 100);

CREATE INDEX IF NOT EXISTS idx_wiki_embedding
ON wiki_pages
USING ivfflat (content_embedding vector_cosine_ops)
WITH (lists = 100);

-- Function to calculate cosine similarity between embeddings
CREATE OR REPLACE FUNCTION cosine_similarity(a vector, b vector)
RETURNS float
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  -- Cosine similarity = 1 - cosine distance
  RETURN 1 - (a <=> b);
END;
$$;

-- Function to find similar knowledge items
CREATE OR REPLACE FUNCTION find_similar_knowledge(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 10
)
RETURNS TABLE (
  id uuid,
  title text,
  content text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    wiki_pages.id,
    wiki_pages.title,
    wiki_pages.content,
    1 - (wiki_pages.content_embedding <=> query_embedding) as similarity
  FROM wiki_pages
  WHERE
    wiki_pages.content_embedding IS NOT NULL
    AND 1 - (wiki_pages.content_embedding <=> query_embedding) > match_threshold
  ORDER BY wiki_pages.content_embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Add comment for documentation
COMMENT ON COLUMN knowledge_extraction_queue.content_embedding IS 'OpenAI text-embedding-3-small (1536 dimensions) - used for semantic similarity confidence scoring';
COMMENT ON COLUMN wiki_pages.content_embedding IS 'OpenAI text-embedding-3-small (1536 dimensions) - used for semantic search';
COMMENT ON FUNCTION find_similar_knowledge IS 'Find wiki pages similar to a query embedding using cosine similarity';

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Embeddings support added successfully!';
  RAISE NOTICE '📊 Next steps:';
  RAISE NOTICE '   1. Add OPENAI_API_KEY to .env.local';
  RAISE NOTICE '   2. Deploy embedding service';
  RAISE NOTICE '   3. Run new Notion scan to generate embeddings';
END
$$;
