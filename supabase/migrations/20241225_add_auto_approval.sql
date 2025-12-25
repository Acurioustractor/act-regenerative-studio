/**
 * ACT Living Wiki - Auto-Approval System
 *
 * Automatically approves high-confidence knowledge extractions
 * Reduces manual review time by 60-80%
 */

-- Add auto-approval tracking columns to wiki_pages
ALTER TABLE wiki_pages
ADD COLUMN IF NOT EXISTS auto_approved BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS approval_confidence FLOAT,
ADD COLUMN IF NOT EXISTS notion_page_id TEXT;

-- Add index for auto-approved pages
CREATE INDEX IF NOT EXISTS idx_wiki_pages_auto_approved ON wiki_pages(auto_approved) WHERE auto_approved = true;
CREATE INDEX IF NOT EXISTS idx_wiki_pages_notion_id ON wiki_pages(notion_page_id);

-- Function to auto-approve high-confidence items
CREATE OR REPLACE FUNCTION auto_approve_high_confidence(
  confidence_threshold FLOAT DEFAULT 0.90,
  dry_run BOOLEAN DEFAULT false
)
RETURNS TABLE (
  action TEXT,
  queue_item_id UUID,
  title TEXT,
  confidence FLOAT,
  suggested_type TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
  item_record RECORD;
  new_page_id UUID;
  approval_count INTEGER := 0;
BEGIN
  -- Find high-confidence pending items
  FOR item_record IN
    SELECT
      q.id,
      q.source_id as notion_page_id,
      q.raw_title,
      q.extracted_knowledge as extracted_content,
      q.confidence_score::float,
      q.suggested_type,
      q.source_url,
      q.created_at
    FROM knowledge_extraction_queue q
    WHERE q.status = 'pending'
    AND q.confidence_score >= confidence_threshold
    AND q.confidence_score IS NOT NULL
    ORDER BY q.confidence_score DESC, q.created_at ASC
  LOOP
    IF dry_run THEN
      -- Dry run: just return what would be approved
      RETURN QUERY SELECT
        'would_approve'::TEXT,
        item_record.id,
        item_record.raw_title,
        item_record.confidence_score,
        item_record.suggested_type;
    ELSE
      -- Check if page already exists for this Notion page
      SELECT id INTO new_page_id
      FROM wiki_pages
      WHERE notion_page_id = item_record.notion_page_id;

      IF new_page_id IS NULL THEN
        -- Create new wiki page
        INSERT INTO wiki_pages (
          title,
          slug,
          content,
          page_type,
          status,
          notion_page_id,
          source_urls,
          auto_approved,
          approval_confidence,
          created_at,
          updated_at
        ) VALUES (
          item_record.raw_title,
          lower(regexp_replace(
            regexp_replace(item_record.raw_title, '[^a-zA-Z0-9\s-]', '', 'g'),
            '\s+', '-', 'g'
          )),
          item_record.extracted_content,
          item_record.suggested_type,
          'active',
          item_record.notion_page_id,
          ARRAY[item_record.source_url],
          true,
          item_record.confidence_score,
          item_record.created_at,
          NOW()
        )
        RETURNING id INTO new_page_id;

        -- Mark queue item as approved
        UPDATE knowledge_extraction_queue
        SET
          status = 'approved',
          approved_at = NOW(),
          wiki_page_id = new_page_id
        WHERE id = item_record.id;

        approval_count := approval_count + 1;

        RETURN QUERY SELECT
          'approved'::TEXT,
          item_record.id,
          item_record.raw_title,
          item_record.confidence_score,
          item_record.suggested_type;
      ELSE
        -- Page already exists, mark as duplicate
        UPDATE knowledge_extraction_queue
        SET
          status = 'rejected',
          rejected_at = NOW(),
          rejection_reason = 'Duplicate: Page already exists'
        WHERE id = item_record.id;

        RETURN QUERY SELECT
          'duplicate'::TEXT,
          item_record.id,
          item_record.raw_title,
          item_record.confidence_score,
          item_record.suggested_type;
      END IF;
    END IF;
  END LOOP;

  -- Log summary
  IF NOT dry_run AND approval_count > 0 THEN
    RAISE NOTICE '✅ Auto-approved % high-confidence items (>= % confidence)', approval_count, confidence_threshold;
  END IF;
END;
$$;

-- Function to get auto-approval statistics
CREATE OR REPLACE FUNCTION get_auto_approval_stats()
RETURNS TABLE (
  total_auto_approved BIGINT,
  avg_confidence NUMERIC,
  by_type_principle BIGINT,
  by_type_method BIGINT,
  by_type_practice BIGINT,
  by_type_procedure BIGINT,
  last_7_days BIGINT,
  last_30_days BIGINT
)
LANGUAGE sql
AS $$
  SELECT
    COUNT(*) FILTER (WHERE auto_approved = true) as total_auto_approved,
    ROUND(AVG(approval_confidence)::numeric FILTER (WHERE auto_approved = true), 3) as avg_confidence,
    COUNT(*) FILTER (WHERE auto_approved = true AND page_type = 'principle') as by_type_principle,
    COUNT(*) FILTER (WHERE auto_approved = true AND page_type = 'method') as by_type_method,
    COUNT(*) FILTER (WHERE auto_approved = true AND page_type = 'practice') as by_type_practice,
    COUNT(*) FILTER (WHERE auto_approved = true AND page_type = 'procedure') as by_type_procedure,
    COUNT(*) FILTER (WHERE auto_approved = true AND created_at > NOW() - INTERVAL '7 days') as last_7_days,
    COUNT(*) FILTER (WHERE auto_approved = true AND created_at > NOW() - INTERVAL '30 days') as last_30_days
  FROM wiki_pages;
$$;

-- View for monitoring auto-approval quality
CREATE OR REPLACE VIEW auto_approval_quality AS
SELECT
  wp.id,
  wp.title,
  wp.page_type,
  wp.approval_confidence,
  wp.created_at as approved_at,
  wp.updated_at as last_updated,
  CASE
    WHEN wp.updated_at > wp.created_at + INTERVAL '1 day' THEN 'edited'
    ELSE 'untouched'
  END as post_approval_status,
  EXTRACT(DAY FROM NOW() - wp.created_at)::INTEGER as days_since_approval
FROM wiki_pages wp
WHERE wp.auto_approved = true
ORDER BY wp.created_at DESC;

-- Comment
COMMENT ON FUNCTION auto_approve_high_confidence IS 'Auto-approves high-confidence knowledge extractions (default >= 90%)';
COMMENT ON FUNCTION get_auto_approval_stats IS 'Returns statistics on auto-approved pages';
COMMENT ON VIEW auto_approval_quality IS 'Monitor quality of auto-approved pages';

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Auto-approval system created!';
  RAISE NOTICE '📊 Usage:';
  RAISE NOTICE '   - Dry run: SELECT * FROM auto_approve_high_confidence(0.90, true);';
  RAISE NOTICE '   - Execute: SELECT * FROM auto_approve_high_confidence(0.90, false);';
  RAISE NOTICE '   - Stats: SELECT * FROM get_auto_approval_stats();';
  RAISE NOTICE '   - Quality: SELECT * FROM auto_approval_quality;';
END
$$;
