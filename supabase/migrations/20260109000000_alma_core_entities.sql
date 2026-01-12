-- ALMA (Adaptive Learning & Measurement Architecture) - Core Entities
-- ECOSYSTEM OPERATING SYSTEM (Land, Studio, Harvest, Art)
--
-- This migration creates the foundation for ALMA's 4 core entities:
-- 1. Initiatives - Any action taken (projects, programs, enterprises)
-- 2. Contexts - Place-based, cultural, or digital contexts
-- 3. Evidence - Research, evaluations, story, and wisdom
-- 4. Outcomes - Ecological, Social, Economic, and Systemic results

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================
-- ALMA INITIATIVES (Was Interventions)
-- =====================================
CREATE TABLE alma_initiatives (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Basic Information
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN (
    -- LAND
    'Regenerative Agriculture', 'Conservation', 'Rewilding', 'Land Management',
    -- STUDIO
    'Digital Infrastructure', 'Open Source Tool', 'Data Sovereignty', 'Research/R&D',
    -- HARVEST
    'Community Enterprise', 'Food System', 'Event/Gathering', 'Education/Workshop',
    -- ART
    'Cultural Production', 'Storytelling', 'Public Installation',
    -- GOVERNANCE
    'Governance Framework', 'Policy/Advocacy'
  )),
  description TEXT NOT NULL,
  status TEXT DEFAULT 'Idea/Concept',

  -- Target & Context
  target_audience TEXT[] DEFAULT '{}', -- e.g., ['Artists', 'Farmers', 'Youth']
  locations TEXT[] DEFAULT '{}', -- e.g., ['Black Cockatoo Valley', 'Witta']

  -- Evidence & Authority
  evidence_level TEXT CHECK (evidence_level IN (
    'Promising (community-endorsed, emerging evidence)',
    'Effective (strong evaluation, positive outcomes)',
    'Proven (RCT/quasi-experimental, replicated)',
    'Indigenous-led (culturally grounded, community authority)',
    'Sensor-verified (IoT/biometric data)',
    'Untested (theory/pilot stage)'
  )),

  -- Governance Fields (CRITICAL)
  cultural_authority TEXT, -- Who holds authority
  consent_level TEXT NOT NULL DEFAULT 'Strictly Private' CHECK (consent_level IN (
    'Public Knowledge Commons', 'Community Controlled', 'Strictly Private'
  )),
  permitted_uses TEXT[] DEFAULT ARRAY['Query (internal)']::TEXT[],
  contributors TEXT[] DEFAULT '{}',
  source_documents JSONB DEFAULT '[]',

  -- Risk Assessment
  risks TEXT,
  harm_risk_level TEXT CHECK (harm_risk_level IN ('Low', 'Medium', 'High', 'Requires cultural review')),

  -- Implementation Details
  resource_requirement TEXT, -- Low <10k, Medium 10-50k, High 50k+
  cost_description TEXT, -- Generalized cost field
  scalability TEXT CHECK (scalability IN ('Place-based (Local)', 'Bioregional', 'National', 'Global/Digital', 'Context-dependent')),
  replication_readiness TEXT CHECK (replication_readiness IN (
    'Not ready (needs more development)',
    'Ready with support (requires adaptation guidance)',
    'Ready (playbook/forkable)',
    'Community authority required'
  )),

  -- Operating Entity
  lead_organization TEXT,
  contact_person TEXT,
  contact_email TEXT,
  website TEXT,
  start_date DATE,
  end_date DATE,

  -- Portfolio Analytics (Signal Scores 0-1)
  portfolio_score DECIMAL(5, 4),
  evidence_strength_signal DECIMAL(5, 4),
  community_authority_signal DECIMAL(5, 4),
  harm_risk_signal DECIMAL(5, 4),
  implementation_capability_signal DECIMAL(5, 4),
  option_value_signal DECIMAL(5, 4),

  -- Workflow
  review_status TEXT NOT NULL DEFAULT 'Draft',
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMPTZ,

  -- ACT Project Linking
  linked_project_id UUID, -- Can link to other project tables if needed

  -- Search
  search_vector TSVECTOR,

  -- Metadata
  metadata JSONB DEFAULT '{}'
);

-- GOVERNANCE CONSTRAINT
ALTER TABLE alma_initiatives ADD CONSTRAINT check_cultural_authority_required
  CHECK (consent_level = 'Public Knowledge Commons' OR cultural_authority IS NOT NULL);

-- =====================================
-- ALMA CONTEXTS
-- =====================================
CREATE TABLE alma_contexts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Basic Information
  name TEXT NOT NULL,
  context_type TEXT NOT NULL CHECK (context_type IN (
    'Bioregion', 'First Nations Country', 'Rural Community', 
    'Urban Community', 'Digital Community', 'Organization/Institution'
  )),

  -- Location
  location_description TEXT,
  bioregion TEXT,
  coordinates JSONB, -- GeoJSON

  -- Context Description
  description TEXT,
  ecological_features TEXT,
  cultural_features TEXT,

  -- Governance
  cultural_authority TEXT NOT NULL,
  consent_level TEXT NOT NULL DEFAULT 'Strictly Private' CHECK (consent_level IN (
    'Public Knowledge Commons', 'Community Controlled', 'Strictly Private'
  )),
  contributors TEXT[] DEFAULT '{}',

  -- Search
  search_vector TSVECTOR,
  metadata JSONB DEFAULT '{}'
);

-- =====================================
-- ALMA EVIDENCE
-- =====================================
CREATE TABLE alma_evidence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Basic Information
  title TEXT NOT NULL,
  evidence_type TEXT NOT NULL CHECK (evidence_type IN (
    'Academic Research', 'Evaluation Report', 'Case Study', 
    'Lived Experience/Story', 'Cultural Knowledge', 'Sensor/Biometric Data',
    'Code/Github Commit', 'Oral History', 'Policy Analysis'
  )),

  -- Details
  methodology TEXT,
  findings TEXT NOT NULL,
  limitations TEXT,

  -- Cultural Safety
  cultural_safety TEXT,

  -- Source Information
  author TEXT,
  organization TEXT,
  publication_date DATE,
  source_url TEXT,

  -- Governance
  consent_level TEXT NOT NULL DEFAULT 'Strictly Private',
  contributors TEXT[] DEFAULT '{}',

  -- Search
  search_vector TSVECTOR,
  metadata JSONB DEFAULT '{}'
);

-- =====================================
-- ALMA OUTCOMES
-- =====================================
CREATE TABLE alma_outcomes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Basic Information
  name TEXT NOT NULL,
  outcome_type TEXT NOT NULL CHECK (outcome_type IN (
    -- ECOLOGICAL
    'Biodiversity Increase', 'Carbon Sequestration', 'Soil Health', 'Water Quality', 'Habitat Restoration',
    -- SOCIAL
    'Community Cohesion', 'Cultural Safety', 'Knowledge Sovereignty', 'Health/Wellbeing', 'Skills/Capability',
    -- ECONOMIC
    'Local Wealth Circulated', 'Cost Savings', 'Artist/Maker Income', 'Livelihood Creation',
    -- SYSTEMIC
    'Policy Shift', 'Narrative Change', 'System Pattern Shift'
  )),
  description TEXT,

  -- Measurement
  unit TEXT, -- e.g. 'tonnes', 'people', '%'
  measurement_method TEXT,
  indicators TEXT,
  time_horizon TEXT,
  
  -- Alignment
  sdg_targets TEXT[],

  -- Search
  search_vector TSVECTOR,
  metadata JSONB DEFAULT '{}'
);

-- =====================================
-- RELATIONSHIP TABLES
-- =====================================

-- Initiatives ↔ Outcomes
CREATE TABLE alma_initiative_outcomes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  initiative_id UUID NOT NULL REFERENCES alma_initiatives(id) ON DELETE CASCADE,
  outcome_id UUID NOT NULL REFERENCES alma_outcomes(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(initiative_id, outcome_id)
);

-- Initiatives ↔ Evidence
CREATE TABLE alma_initiative_evidence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  initiative_id UUID NOT NULL REFERENCES alma_initiatives(id) ON DELETE CASCADE,
  evidence_id UUID NOT NULL REFERENCES alma_evidence(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(initiative_id, evidence_id)
);

-- Initiatives ↔ Contexts
CREATE TABLE alma_initiative_contexts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  initiative_id UUID NOT NULL REFERENCES alma_initiatives(id) ON DELETE CASCADE,
  context_id UUID NOT NULL REFERENCES alma_contexts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(initiative_id, context_id)
);

-- Evidence ↔ Outcomes
CREATE TABLE alma_evidence_outcomes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  evidence_id UUID NOT NULL REFERENCES alma_evidence(id) ON DELETE CASCADE,
  outcome_id UUID NOT NULL REFERENCES alma_outcomes(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(evidence_id, outcome_id)
);

-- =====================================
-- SEARCH VECTOR TRIGGERS (Simplified)
-- =====================================

-- Initiatives
CREATE OR REPLACE FUNCTION update_alma_initiatives_search_vector() RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := setweight(to_tsvector('english', COALESCE(NEW.name, '')), 'A') ||
                       setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_alma_initiatives_search
BEFORE INSERT OR UPDATE ON alma_initiatives
FOR EACH ROW EXECUTE FUNCTION update_alma_initiatives_search_vector();
