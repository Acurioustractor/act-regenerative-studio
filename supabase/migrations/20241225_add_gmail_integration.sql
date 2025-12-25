/**
 * ACT Living Wiki - Gmail Integration
 *
 * Enables knowledge extraction from Gmail emails
 * Supports incremental sync using Gmail History API
 */

-- Gmail OAuth tokens table
CREATE TABLE IF NOT EXISTS gmail_auth_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL UNIQUE,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expiry_date BIGINT,
  scope TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gmail sync state (for incremental sync using History API)
CREATE TABLE IF NOT EXISTS gmail_sync_state (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID REFERENCES gmail_auth_tokens(id) ON DELETE CASCADE,
  last_history_id TEXT,
  last_sync_at TIMESTAMPTZ,
  next_sync_at TIMESTAMPTZ,
  status TEXT DEFAULT 'pending',
  items_found INTEGER DEFAULT 0,
  items_extracted INTEGER DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CHECK (status IN ('pending', 'running', 'completed', 'error'))
);

-- Add thread_id to knowledge_extraction_queue for email threading
ALTER TABLE knowledge_extraction_queue
ADD COLUMN IF NOT EXISTS thread_id TEXT;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_gmail_tokens_email ON gmail_auth_tokens(user_email);
CREATE INDEX IF NOT EXISTS idx_gmail_sync_account ON gmail_sync_state(account_id);
CREATE INDEX IF NOT EXISTS idx_gmail_sync_status ON gmail_sync_state(status, next_sync_at);
CREATE INDEX IF NOT EXISTS idx_extraction_queue_thread ON knowledge_extraction_queue(thread_id);

-- Function to get active Gmail accounts ready for sync
CREATE OR REPLACE FUNCTION get_gmail_accounts_for_sync()
RETURNS TABLE (
  account_id UUID,
  user_email TEXT,
  last_sync_at TIMESTAMPTZ,
  last_history_id TEXT
)
LANGUAGE sql
AS $$
  SELECT
    t.id as account_id,
    t.user_email,
    s.last_sync_at,
    s.last_history_id
  FROM gmail_auth_tokens t
  LEFT JOIN gmail_sync_state s ON s.account_id = t.id
  WHERE t.refresh_token IS NOT NULL  -- Has valid refresh token
  ORDER BY COALESCE(s.last_sync_at, '1970-01-01'::timestamptz) ASC;
$$;

-- Function to update sync state
CREATE OR REPLACE FUNCTION update_gmail_sync_state(
  p_account_id UUID,
  p_history_id TEXT,
  p_items_found INTEGER,
  p_items_extracted INTEGER,
  p_status TEXT DEFAULT 'completed',
  p_error_message TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO gmail_sync_state (
    account_id,
    last_history_id,
    last_sync_at,
    next_sync_at,
    status,
    items_found,
    items_extracted,
    error_message,
    updated_at
  ) VALUES (
    p_account_id,
    p_history_id,
    NOW(),
    NOW() + INTERVAL '1 hour',  -- Next sync in 1 hour
    p_status,
    p_items_found,
    p_items_extracted,
    p_error_message,
    NOW()
  )
  ON CONFLICT (account_id)
  DO UPDATE SET
    last_history_id = EXCLUDED.last_history_id,
    last_sync_at = EXCLUDED.last_sync_at,
    next_sync_at = EXCLUDED.next_sync_at,
    status = EXCLUDED.status,
    items_found = EXCLUDED.items_found,
    items_extracted = EXCLUDED.items_extracted,
    error_message = EXCLUDED.error_message,
    updated_at = EXCLUDED.updated_at;
END;
$$;

-- View for Gmail sync statistics
CREATE OR REPLACE VIEW gmail_sync_stats AS
SELECT
  t.user_email,
  s.last_sync_at,
  s.last_history_id,
  s.status,
  s.items_found as last_scan_found,
  s.items_extracted as last_scan_extracted,
  COUNT(q.id) as total_in_queue,
  COUNT(q.id) FILTER (WHERE q.status = 'pending') as pending_review,
  COUNT(q.id) FILTER (WHERE q.status = 'approved') as approved,
  MAX(q.created_at) as latest_extraction
FROM gmail_auth_tokens t
LEFT JOIN gmail_sync_state s ON s.account_id = t.id
LEFT JOIN knowledge_extraction_queue q ON q.source_type = 'gmail' AND q.source_metadata->>'account_id' = t.id::text
GROUP BY t.id, t.user_email, s.last_sync_at, s.last_history_id, s.status, s.items_found, s.items_extracted;

-- Add unique constraint to prevent duplicate email extractions
CREATE UNIQUE INDEX IF NOT EXISTS idx_extraction_queue_gmail_unique
ON knowledge_extraction_queue (source_type, source_id)
WHERE source_type = 'gmail';

-- Comments
COMMENT ON TABLE gmail_auth_tokens IS 'OAuth tokens for Gmail API access';
COMMENT ON TABLE gmail_sync_state IS 'Tracks Gmail sync state for incremental scanning';
COMMENT ON FUNCTION get_gmail_accounts_for_sync IS 'Returns Gmail accounts ready for sync';
COMMENT ON FUNCTION update_gmail_sync_state IS 'Updates Gmail sync state after scan';
COMMENT ON VIEW gmail_sync_stats IS 'Statistics for Gmail knowledge extraction';

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Gmail integration tables created!';
  RAISE NOTICE '📊 Next steps:';
  RAISE NOTICE '   1. Set up Google Cloud OAuth credentials';
  RAISE NOTICE '   2. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to .env.local';
  RAISE NOTICE '   3. Connect Gmail account via /api/auth/gmail';
  RAISE NOTICE '   4. Run Gmail scan: POST /api/knowledge/scan-gmail';
END
$$;
