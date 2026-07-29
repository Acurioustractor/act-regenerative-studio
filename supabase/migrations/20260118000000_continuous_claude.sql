-- Continuous Claude v3 Integration
-- Enables persistent context, learning extraction, and session coordination

-- Ensure required extensions are enabled
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- =============================================================================
-- SESSIONS: Cross-terminal awareness
-- =============================================================================
CREATE TABLE IF NOT EXISTS cc_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project TEXT NOT NULL,
    working_on TEXT,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    last_heartbeat TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cc_sessions_project ON cc_sessions(project);
CREATE INDEX IF NOT EXISTS idx_cc_sessions_heartbeat ON cc_sessions(last_heartbeat);

-- =============================================================================
-- FILE CLAIMS: Prevent concurrent edit conflicts
-- =============================================================================
CREATE TABLE IF NOT EXISTS cc_file_claims (
    file_path TEXT NOT NULL,
    project TEXT NOT NULL,
    session_id UUID REFERENCES cc_sessions(id) ON DELETE CASCADE,
    claimed_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (file_path, project)
);

CREATE INDEX IF NOT EXISTS idx_cc_file_claims_session ON cc_file_claims(session_id);

-- =============================================================================
-- ARCHIVAL MEMORY: Long-term learnings with semantic search
-- =============================================================================
CREATE TABLE IF NOT EXISTS cc_archival_memory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES cc_sessions(id) ON DELETE SET NULL,
    agent_id TEXT,
    learning_type TEXT NOT NULL DEFAULT 'WORKING_SOLUTION',
    content TEXT NOT NULL,
    context TEXT,
    tags TEXT[],
    confidence TEXT DEFAULT 'medium',
    metadata JSONB DEFAULT '{}',
    embedding vector(1536),  -- OpenAI ada-002 compatible
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Learning types: ARCHITECTURAL_DECISION, WORKING_SOLUTION, CODEBASE_PATTERN,
--                 FAILED_APPROACH, ERROR_FIX, USER_PREFERENCE, OPEN_THREAD

CREATE INDEX IF NOT EXISTS idx_cc_memory_session ON cc_archival_memory(session_id);
CREATE INDEX IF NOT EXISTS idx_cc_memory_agent ON cc_archival_memory(agent_id);
CREATE INDEX IF NOT EXISTS idx_cc_memory_type ON cc_archival_memory(learning_type);
CREATE INDEX IF NOT EXISTS idx_cc_memory_tags ON cc_archival_memory USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_cc_memory_created ON cc_archival_memory(created_at DESC);

-- Full-text search on content
CREATE INDEX IF NOT EXISTS idx_cc_memory_content_fts
ON cc_archival_memory USING GIN(to_tsvector('english', content));

-- HNSW vector index for semantic similarity
CREATE INDEX IF NOT EXISTS idx_cc_memory_embedding
ON cc_archival_memory USING hnsw(embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- =============================================================================
-- HANDOFFS: Session state transfer documents
-- =============================================================================
CREATE TYPE cc_outcome AS ENUM ('SUCCEEDED', 'PARTIAL_PLUS', 'PARTIAL_MINUS', 'FAILED', 'UNKNOWN');

CREATE TABLE IF NOT EXISTS cc_handoffs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_name TEXT NOT NULL,
    file_path TEXT UNIQUE,
    format TEXT DEFAULT 'yaml',
    session_id UUID REFERENCES cc_sessions(id) ON DELETE SET NULL,
    agent_id TEXT,
    root_span_id TEXT,
    jsonl_path TEXT,
    goal TEXT,
    what_worked TEXT,
    what_failed TEXT,
    key_decisions JSONB DEFAULT '[]',
    outcome cc_outcome DEFAULT 'UNKNOWN',
    outcome_notes TEXT,
    content TEXT,
    embedding vector(1536),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    indexed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_cc_handoffs_session ON cc_handoffs(session_id);
CREATE INDEX IF NOT EXISTS idx_cc_handoffs_outcome ON cc_handoffs(outcome);
CREATE INDEX IF NOT EXISTS idx_cc_handoffs_created ON cc_handoffs(created_at DESC);

-- Full-text search on goal and content
CREATE INDEX IF NOT EXISTS idx_cc_handoffs_goal_fts
ON cc_handoffs USING GIN(to_tsvector('english', COALESCE(goal, '') || ' ' || COALESCE(content, '')));

-- HNSW vector index for semantic similarity
CREATE INDEX IF NOT EXISTS idx_cc_handoffs_embedding
ON cc_handoffs USING hnsw(embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- =============================================================================
-- CONTINUITY LEDGERS: Project-level state tracking
-- =============================================================================
CREATE TABLE IF NOT EXISTS cc_ledgers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project TEXT NOT NULL,
    ledger_path TEXT UNIQUE,
    summary TEXT,
    active_goals JSONB DEFAULT '[]',
    completed_goals JSONB DEFAULT '[]',
    blocked_items JSONB DEFAULT '[]',
    key_patterns JSONB DEFAULT '{}',
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cc_ledgers_project ON cc_ledgers(project);

-- =============================================================================
-- HELPER FUNCTIONS
-- =============================================================================

-- Semantic search for memories
CREATE OR REPLACE FUNCTION cc_search_memories(
    query_embedding vector(1536),
    match_threshold float DEFAULT 0.7,
    match_count int DEFAULT 5,
    filter_type text DEFAULT NULL,
    filter_tags text[] DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    content TEXT,
    context TEXT,
    learning_type TEXT,
    tags TEXT[],
    confidence TEXT,
    similarity float,
    created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        m.id,
        m.content,
        m.context,
        m.learning_type,
        m.tags,
        m.confidence,
        1 - (m.embedding <=> query_embedding) as similarity,
        m.created_at
    FROM cc_archival_memory m
    WHERE m.embedding IS NOT NULL
      AND (filter_type IS NULL OR m.learning_type = filter_type)
      AND (filter_tags IS NULL OR m.tags && filter_tags)
      AND (1 - (m.embedding <=> query_embedding)) > match_threshold
    ORDER BY m.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;

-- Full-text search for memories
CREATE OR REPLACE FUNCTION cc_search_memories_text(
    search_query text,
    match_count int DEFAULT 10,
    filter_type text DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    content TEXT,
    context TEXT,
    learning_type TEXT,
    tags TEXT[],
    confidence TEXT,
    rank float,
    created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        m.id,
        m.content,
        m.context,
        m.learning_type,
        m.tags,
        m.confidence,
        ts_rank(to_tsvector('english', m.content), plainto_tsquery('english', search_query)) as rank,
        m.created_at
    FROM cc_archival_memory m
    WHERE to_tsvector('english', m.content) @@ plainto_tsquery('english', search_query)
      AND (filter_type IS NULL OR m.learning_type = filter_type)
    ORDER BY rank DESC
    LIMIT match_count;
END;
$$;

-- Claim a file for editing
CREATE OR REPLACE FUNCTION cc_claim_file(
    p_file_path text,
    p_project text,
    p_session_id UUID
)
RETURNS TABLE (success boolean, holder UUID, message text)
LANGUAGE plpgsql
AS $$
DECLARE
    existing_claim cc_file_claims%ROWTYPE;
    stale_threshold INTERVAL := '5 minutes';
BEGIN
    -- Check for existing claim
    SELECT * INTO existing_claim
    FROM cc_file_claims
    WHERE file_path = p_file_path AND project = p_project;

    IF existing_claim IS NULL THEN
        -- No existing claim, create one
        INSERT INTO cc_file_claims (file_path, project, session_id)
        VALUES (p_file_path, p_project, p_session_id);
        RETURN QUERY SELECT true, p_session_id, 'File claimed successfully'::text;
    ELSIF existing_claim.session_id = p_session_id THEN
        -- Already claimed by this session
        UPDATE cc_file_claims SET claimed_at = NOW()
        WHERE file_path = p_file_path AND project = p_project;
        RETURN QUERY SELECT true, p_session_id, 'Claim refreshed'::text;
    ELSE
        -- Check if claim is stale
        IF existing_claim.claimed_at < NOW() - stale_threshold THEN
            UPDATE cc_file_claims
            SET session_id = p_session_id, claimed_at = NOW()
            WHERE file_path = p_file_path AND project = p_project;
            RETURN QUERY SELECT true, p_session_id, 'Stale claim overridden'::text;
        ELSE
            RETURN QUERY SELECT false, existing_claim.session_id, 'File claimed by another session'::text;
        END IF;
    END IF;
END;
$$;

-- Update session heartbeat
CREATE OR REPLACE FUNCTION cc_heartbeat(p_session_id UUID, p_working_on text DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE cc_sessions
    SET last_heartbeat = NOW(),
        working_on = COALESCE(p_working_on, working_on)
    WHERE id = p_session_id;
END;
$$;

-- =============================================================================
-- ROW LEVEL SECURITY (optional, for multi-tenant scenarios)
-- =============================================================================
-- These tables don't require RLS since they're accessed via service role key
-- Add policies here if you need user-level isolation

COMMENT ON TABLE cc_sessions IS 'Tracks active Claude Code sessions for coordination';
COMMENT ON TABLE cc_file_claims IS 'Prevents concurrent edits across terminals';
COMMENT ON TABLE cc_archival_memory IS 'Persistent learnings with semantic search';
COMMENT ON TABLE cc_handoffs IS 'Session state transfer documents';
COMMENT ON TABLE cc_ledgers IS 'Project-level continuity tracking';
