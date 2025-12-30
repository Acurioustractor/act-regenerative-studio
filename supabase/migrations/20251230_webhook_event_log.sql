-- Webhook Event Log Table
-- Stores processed webhook events for idempotency and debugging
CREATE TABLE IF NOT EXISTS webhook_event_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_key TEXT UNIQUE NOT NULL,
  event_type TEXT NOT NULL,
  source_project TEXT,
  source_contact_id TEXT,
  processed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  payload JSONB,

  -- Index for fast duplicate checking
  INDEX idx_event_key ON webhook_event_log(event_key),
  INDEX idx_processed_at ON webhook_event_log(processed_at)
);

-- Auto-delete old events after 30 days (optional - for disk space management)
-- You can enable this with a cron job or pg_cron extension
COMMENT ON TABLE webhook_event_log IS 'Stores processed webhook events for idempotency checking. Events older than 30 days can be safely deleted.';
