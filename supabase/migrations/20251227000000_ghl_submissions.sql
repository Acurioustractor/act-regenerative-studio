-- GHL Form Submissions Tracking
-- Stores webhook data from GoHighLevel form submissions
-- Tracks submission counts for dashboard analytics

CREATE TABLE IF NOT EXISTS ghl_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Form identification
  form_id TEXT NOT NULL,
  form_name TEXT NOT NULL,
  form_type TEXT, -- contact, farm_stay, csa, art_residency, newsletter, etc.

  -- Submission data
  submission_id TEXT UNIQUE NOT NULL,
  contact_id TEXT, -- GHL contact ID
  email TEXT,
  name TEXT,
  phone TEXT,

  -- Custom fields (JSONB for flexibility)
  custom_fields JSONB DEFAULT '{}',

  -- Source tracking
  source_url TEXT,
  utm_source TEXT,
  utm_campaign TEXT,
  utm_medium TEXT,

  -- Timestamps
  submitted_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Notion sync status
  synced_to_notion BOOLEAN DEFAULT FALSE,
  notion_page_id TEXT,
  synced_at TIMESTAMPTZ,

  -- Metadata
  webhook_payload JSONB, -- Store full webhook payload for debugging

  -- Indexes
  CONSTRAINT ghl_submissions_submission_id_key UNIQUE (submission_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_ghl_submissions_form_id ON ghl_submissions(form_id);
CREATE INDEX IF NOT EXISTS idx_ghl_submissions_form_type ON ghl_submissions(form_type);
CREATE INDEX IF NOT EXISTS idx_ghl_submissions_submitted_at ON ghl_submissions(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_ghl_submissions_synced ON ghl_submissions(synced_to_notion);
CREATE INDEX IF NOT EXISTS idx_ghl_submissions_contact_id ON ghl_submissions(contact_id);

-- RLS Policies (enable row level security)
ALTER TABLE ghl_submissions ENABLE ROW LEVEL SECURITY;

-- Allow service role to do everything
CREATE POLICY "Service role can manage ghl_submissions"
  ON ghl_submissions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to read
CREATE POLICY "Authenticated users can read ghl_submissions"
  ON ghl_submissions
  FOR SELECT
  TO authenticated
  USING (true);

-- Add helpful comment
COMMENT ON TABLE ghl_submissions IS 'Stores GoHighLevel form submission data from webhooks for dashboard analytics and Notion sync';
