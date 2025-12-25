-- GoHighLevel Contact Sync Schema
-- Purpose: Track unified contact records across all 6 ACT projects
-- Database: Supabase PostgreSQL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ACT Projects enum
CREATE TYPE act_project AS ENUM (
  'act-hub',
  'the-harvest',
  'act-farm',
  'empathy-ledger',
  'justice-hub',
  'goods-on-country'
);

-- GHL Event types
CREATE TYPE ghl_event_type AS ENUM (
  'contact_create',
  'contact_update',
  'contact_delete',
  'contact_tag_update'
);

-- Master contact table (single source of truth)
CREATE TABLE ghl_contacts_master (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- GHL ACT Hub contact ID (master record in GHL)
  master_contact_id TEXT NOT NULL UNIQUE,

  -- Contact info
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  name TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,

  -- Ecosystem engagement tracking
  active_projects act_project[] NOT NULL DEFAULT '{}',
  primary_project act_project NOT NULL, -- First project they engaged with
  total_interactions INTEGER NOT NULL DEFAULT 1,
  last_interaction_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_interaction_project act_project NOT NULL,

  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Additional contact data (denormalized for performance)
  address_city TEXT,
  address_state TEXT,
  address_country TEXT,
  address_postal_code TEXT,
  company_name TEXT,
  tags TEXT[] DEFAULT '{}',

  -- GHL location ID for ACT Hub
  location_id TEXT NOT NULL,

  -- Search optimization
  search_vector TSVECTOR
);

-- Project-specific contact mappings
-- Links master contact to individual GHL contact IDs in each sub-account
CREATE TABLE ghl_contact_project_mappings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  master_contact_id UUID NOT NULL REFERENCES ghl_contacts_master(id) ON DELETE CASCADE,
  project act_project NOT NULL,
  project_contact_id TEXT NOT NULL, -- GHL contact ID in this project's sub-account
  project_location_id TEXT NOT NULL, -- GHL location ID for this project

  -- When contact was created/updated in this project
  first_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  interaction_count INTEGER NOT NULL DEFAULT 1,

  -- Project-specific tags
  project_tags TEXT[] DEFAULT '{}',

  -- Unique constraint: one contact per project
  UNIQUE(master_contact_id, project),
  UNIQUE(project, project_contact_id)
);

-- Contact sync event log
-- Tracks all webhook events for auditing and debugging
CREATE TABLE ghl_contact_sync_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Event metadata
  event_type ghl_event_type NOT NULL,
  source_project act_project NOT NULL,
  source_location_id TEXT NOT NULL,
  source_contact_id TEXT NOT NULL,

  -- Master contact (NULL if event failed to process)
  master_contact_id UUID REFERENCES ghl_contacts_master(id) ON DELETE SET NULL,

  -- Event payload
  event_payload JSONB NOT NULL,

  -- Processing status
  processed BOOLEAN NOT NULL DEFAULT FALSE,
  processing_error TEXT,
  retry_count INTEGER NOT NULL DEFAULT 0,

  -- Timestamps
  event_timestamp TIMESTAMPTZ NOT NULL,
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ,

  -- Webhook metadata
  webhook_id TEXT,
  webhook_signature TEXT
);

-- GHL project configurations
-- Stores API credentials and settings for each sub-account
CREATE TABLE ghl_project_configs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project act_project NOT NULL UNIQUE,

  -- GHL credentials
  location_id TEXT NOT NULL UNIQUE,
  api_key TEXT NOT NULL, -- Encrypted in production

  -- Project metadata
  project_name TEXT NOT NULL,
  project_domain TEXT NOT NULL,

  -- Settings
  sync_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  webhook_url TEXT,
  webhook_secret TEXT,

  -- Stats
  total_contacts INTEGER NOT NULL DEFAULT 0,
  last_sync_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance

-- Search by email (most common query)
CREATE INDEX idx_ghl_contacts_email ON ghl_contacts_master(email);

-- Search by phone
CREATE INDEX idx_ghl_contacts_phone ON ghl_contacts_master(phone);

-- Filter by active projects
CREATE INDEX idx_ghl_contacts_active_projects ON ghl_contacts_master USING GIN(active_projects);

-- Filter by primary project
CREATE INDEX idx_ghl_contacts_primary_project ON ghl_contacts_master(primary_project);

-- Recent interactions
CREATE INDEX idx_ghl_contacts_last_interaction ON ghl_contacts_master(last_interaction_date DESC);

-- Full text search
CREATE INDEX idx_ghl_contacts_search ON ghl_contacts_master USING GIN(search_vector);

-- Project mappings lookups
CREATE INDEX idx_ghl_project_mappings_master ON ghl_contact_project_mappings(master_contact_id);
CREATE INDEX idx_ghl_project_mappings_project ON ghl_contact_project_mappings(project, project_contact_id);

-- Event log queries
CREATE INDEX idx_ghl_events_timestamp ON ghl_contact_sync_events(event_timestamp DESC);
CREATE INDEX idx_ghl_events_source_project ON ghl_contact_sync_events(source_project);
CREATE INDEX idx_ghl_events_unprocessed ON ghl_contact_sync_events(processed, received_at) WHERE processed = FALSE;
CREATE INDEX idx_ghl_events_master_contact ON ghl_contact_sync_events(master_contact_id);

-- Functions and Triggers

-- Update search vector on contact changes
CREATE OR REPLACE FUNCTION update_contact_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', COALESCE(NEW.name, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.email, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.phone, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.company_name, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(array_to_string(NEW.tags, ' '), '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_contact_search_vector
  BEFORE INSERT OR UPDATE ON ghl_contacts_master
  FOR EACH ROW
  EXECUTE FUNCTION update_contact_search_vector();

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_ghl_contacts_updated_at
  BEFORE UPDATE ON ghl_contacts_master
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_ghl_project_configs_updated_at
  BEFORE UPDATE ON ghl_project_configs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Views for common queries

-- Contacts with project engagement details
CREATE VIEW vw_contacts_with_projects AS
SELECT
  c.id,
  c.master_contact_id,
  c.email,
  c.phone,
  c.name,
  c.active_projects,
  c.primary_project,
  c.total_interactions,
  c.last_interaction_date,
  c.last_interaction_project,
  c.tags,
  c.created_at,
  c.updated_at,
  COALESCE(
    json_agg(
      json_build_object(
        'project', pm.project,
        'project_contact_id', pm.project_contact_id,
        'interaction_count', pm.interaction_count,
        'first_seen_at', pm.first_seen_at,
        'last_seen_at', pm.last_seen_at,
        'project_tags', pm.project_tags
      ) ORDER BY pm.first_seen_at
    ) FILTER (WHERE pm.id IS NOT NULL),
    '[]'::json
  ) AS project_engagements
FROM ghl_contacts_master c
LEFT JOIN ghl_contact_project_mappings pm ON c.id = pm.master_contact_id
GROUP BY c.id;

-- Multi-project contacts (engaged with 2+ projects)
CREATE VIEW vw_multi_project_contacts AS
SELECT
  c.*,
  array_length(c.active_projects, 1) AS project_count
FROM ghl_contacts_master c
WHERE array_length(c.active_projects, 1) > 1
ORDER BY project_count DESC, total_interactions DESC;

-- Recent sync events with errors
CREATE VIEW vw_recent_sync_errors AS
SELECT
  e.id,
  e.event_type,
  e.source_project,
  e.source_contact_id,
  e.processing_error,
  e.retry_count,
  e.event_timestamp,
  e.received_at,
  c.email,
  c.name
FROM ghl_contact_sync_events e
LEFT JOIN ghl_contacts_master c ON e.master_contact_id = c.id
WHERE e.processed = FALSE OR e.processing_error IS NOT NULL
ORDER BY e.received_at DESC
LIMIT 100;

-- Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE ghl_contacts_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE ghl_contact_project_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ghl_contact_sync_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ghl_project_configs ENABLE ROW LEVEL SECURITY;

-- Allow service role full access
CREATE POLICY "Service role has full access to contacts"
  ON ghl_contacts_master
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role has full access to mappings"
  ON ghl_contact_project_mappings
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role has full access to events"
  ON ghl_contact_sync_events
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role has full access to configs"
  ON ghl_project_configs
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Authenticated users can read contacts (for admin dashboard)
CREATE POLICY "Authenticated users can read contacts"
  ON ghl_contacts_master
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read mappings"
  ON ghl_contact_project_mappings
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read events"
  ON ghl_contact_sync_events
  FOR SELECT
  TO authenticated
  USING (true);

-- Only service role can read configs (contains API keys)
-- No additional policy needed - service_role policy above covers it

-- Comments for documentation
COMMENT ON TABLE ghl_contacts_master IS 'Master contact records synced from all ACT projects. Single source of truth for unified contact view.';
COMMENT ON TABLE ghl_contact_project_mappings IS 'Maps master contacts to project-specific GHL contact IDs. Allows reverse lookup and tracks per-project engagement.';
COMMENT ON TABLE ghl_contact_sync_events IS 'Audit log of all webhook events received from GHL. Used for debugging and replay.';
COMMENT ON TABLE ghl_project_configs IS 'Configuration and credentials for each GHL sub-account. API keys should be encrypted at rest.';

COMMENT ON COLUMN ghl_contacts_master.active_projects IS 'Array of projects where this contact is active. Updated when contact is created/updated in any project.';
COMMENT ON COLUMN ghl_contacts_master.primary_project IS 'First project where contact was created. Used to identify lead source.';
COMMENT ON COLUMN ghl_contacts_master.total_interactions IS 'Cumulative count of contact create/update events across all projects. Indicates engagement level.';
COMMENT ON COLUMN ghl_contacts_master.search_vector IS 'Full-text search index. Auto-updated via trigger. Search using to_tsquery().';

-- Sample query examples (as SQL comments for reference)
/*
-- Find contact by email
SELECT * FROM ghl_contacts_master WHERE email = 'jane@example.com';

-- Find all contacts active in The Harvest
SELECT * FROM ghl_contacts_master WHERE 'the-harvest' = ANY(active_projects);

-- Find multi-project contacts
SELECT * FROM vw_multi_project_contacts;

-- Search contacts by name
SELECT * FROM ghl_contacts_master
WHERE search_vector @@ to_tsquery('english', 'jane & smith');

-- Get contact with all project engagements
SELECT * FROM vw_contacts_with_projects WHERE email = 'jane@example.com';

-- Find contacts who started with The Harvest but also engaged with ACT Farm
SELECT * FROM ghl_contacts_master
WHERE primary_project = 'the-harvest'
AND 'act-farm' = ANY(active_projects);

-- Recent sync errors
SELECT * FROM vw_recent_sync_errors;
*/
