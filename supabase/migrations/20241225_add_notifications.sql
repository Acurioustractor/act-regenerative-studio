/**
 * ACT Living Wiki - Notifications System
 *
 * In-app notifications for review reminders and wiki updates
 * No external dependencies (Slack, email, etc.)
 */

-- Notifications table
CREATE TABLE IF NOT EXISTS wiki_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(50) NOT NULL, -- 'review_due', 'page_stale', 'new_extraction'
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT, -- URL to navigate to
  priority VARCHAR(20) DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  read_at TIMESTAMPTZ,

  -- Optional: Link to wiki page
  wiki_page_id UUID REFERENCES wiki_pages(id) ON DELETE CASCADE,

  -- Optional: Link to queue item
  queue_item_id UUID REFERENCES knowledge_extraction_queue(id) ON DELETE CASCADE,

  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,

  CHECK (type IN ('review_due', 'page_stale', 'new_extraction', 'high_confidence', 'system'))
);

-- Indexes
CREATE INDEX idx_notifications_unread ON wiki_notifications(is_read, created_at DESC);
CREATE INDEX idx_notifications_type ON wiki_notifications(type);
CREATE INDEX idx_notifications_priority ON wiki_notifications(priority, created_at DESC);
CREATE INDEX idx_notifications_wiki_page ON wiki_notifications(wiki_page_id);

-- Function to create review reminder notifications
CREATE OR REPLACE FUNCTION create_review_reminders()
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  pages_due CURSOR FOR
    SELECT id, title, slug, next_review_due, last_reviewed_at
    FROM wiki_pages
    WHERE status = 'active'
    AND next_review_due < NOW()
    AND NOT EXISTS (
      -- Don't create duplicate notifications
      SELECT 1 FROM wiki_notifications
      WHERE wiki_page_id = wiki_pages.id
      AND type = 'review_due'
      AND is_read = false
      AND created_at > NOW() - INTERVAL '7 days'
    );

  page_record RECORD;
  days_overdue INTEGER;
  notification_count INTEGER := 0;
BEGIN
  FOR page_record IN pages_due LOOP
    days_overdue := EXTRACT(DAY FROM NOW() - page_record.next_review_due)::INTEGER;

    INSERT INTO wiki_notifications (
      type,
      title,
      message,
      link,
      priority,
      wiki_page_id,
      metadata
    ) VALUES (
      'review_due',
      'Page Due for Review',
      page_record.title || ' is ' || days_overdue || ' days overdue for review',
      '/wiki/' || page_record.slug || '/edit',
      CASE
        WHEN days_overdue > 30 THEN 'urgent'
        WHEN days_overdue > 14 THEN 'high'
        WHEN days_overdue > 7 THEN 'normal'
        ELSE 'low'
      END,
      page_record.id,
      jsonb_build_object(
        'days_overdue', days_overdue,
        'last_reviewed_at', page_record.last_reviewed_at,
        'next_review_due', page_record.next_review_due
      )
    );

    notification_count := notification_count + 1;
  END LOOP;

  RETURN notification_count;
END;
$$;

-- Function to create new extraction notifications
CREATE OR REPLACE FUNCTION create_extraction_notifications()
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  high_confidence_items CURSOR FOR
    SELECT id, raw_title, confidence_score, suggested_type
    FROM knowledge_extraction_queue
    WHERE status = 'pending'
    AND confidence_score >= 0.8
    AND NOT EXISTS (
      SELECT 1 FROM wiki_notifications
      WHERE queue_item_id = knowledge_extraction_queue.id
      AND type = 'high_confidence'
    );

  item_record RECORD;
  notification_count INTEGER := 0;
BEGIN
  FOR item_record IN high_confidence_items LOOP
    INSERT INTO wiki_notifications (
      type,
      title,
      message,
      link,
      priority,
      queue_item_id,
      metadata
    ) VALUES (
      'high_confidence',
      'High-Confidence Knowledge Extracted',
      item_record.raw_title || ' (' || ROUND(item_record.confidence_score * 100) || '% confidence)',
      '/admin/queue',
      'normal',
      item_record.id,
      jsonb_build_object(
        'confidence_score', item_record.confidence_score,
        'suggested_type', item_record.suggested_type
      )
    );

    notification_count := notification_count + 1;
  END LOOP;

  RETURN notification_count;
END;
$$;

-- View for notification summary
CREATE OR REPLACE VIEW notification_summary AS
SELECT
  COUNT(*) FILTER (WHERE NOT is_read) as unread_count,
  COUNT(*) FILTER (WHERE NOT is_read AND priority = 'urgent') as urgent_count,
  COUNT(*) FILTER (WHERE NOT is_read AND priority = 'high') as high_count,
  COUNT(*) FILTER (WHERE NOT is_read AND type = 'review_due') as review_due_count,
  COUNT(*) FILTER (WHERE NOT is_read AND type = 'high_confidence') as high_confidence_count,
  MAX(created_at) FILTER (WHERE NOT is_read) as latest_unread_at
FROM wiki_notifications;

-- Comment
COMMENT ON TABLE wiki_notifications IS 'In-app notifications for wiki review reminders and updates';
COMMENT ON FUNCTION create_review_reminders IS 'Creates notifications for pages due for review (run daily)';
COMMENT ON FUNCTION create_extraction_notifications IS 'Creates notifications for high-confidence extractions (run after scans)';

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Notifications system created!';
  RAISE NOTICE '📊 Next steps:';
  RAISE NOTICE '   1. Call create_review_reminders() daily';
  RAISE NOTICE '   2. Call create_extraction_notifications() after scans';
  RAISE NOTICE '   3. Display notifications in UI banner';
END
$$;
