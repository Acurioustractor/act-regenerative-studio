-- Human Verification System Migration
-- Created: 2024-12-25
-- Purpose: Enable human-in-the-loop verification, knowledge versioning, and PMPP framework

-- ============================================================================
-- 1. AI Content Verifications Table
-- ============================================================================
-- Stores human feedback on AI-generated content

CREATE TABLE IF NOT EXISTS ai_content_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID,
  content_type TEXT NOT NULL,
  project_slug TEXT,
  generated_content TEXT NOT NULL,
  final_content TEXT,

  -- Quality scores (1-5 scale)
  brand_voice_score INTEGER CHECK (brand_voice_score BETWEEN 1 AND 5),
  cultural_safety_score INTEGER CHECK (cultural_safety_score BETWEEN 1 AND 5),
  factual_accuracy_score INTEGER CHECK (factual_accuracy_score BETWEEN 1 AND 5),
  community_voice_score INTEGER CHECK (community_voice_score BETWEEN 1 AND 5),
  overall_quality_score INTEGER CHECK (overall_quality_score BETWEEN 1 AND 5),

  -- Qualitative feedback
  human_notes TEXT,
  improvement_suggestions TEXT[],
  issues_found TEXT[],

  -- Verification metadata
  verified_by UUID REFERENCES auth.users(id),
  verified_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT CHECK (status IN ('approved', 'revised', 'rejected')) NOT NULL,

  -- Elder review tracking
  requires_elder_review BOOLEAN DEFAULT FALSE,
  elder_reviewed_by UUID REFERENCES auth.users(id),
  elder_reviewed_at TIMESTAMPTZ,
  elder_notes TEXT,

  -- Training loop
  used_for_training BOOLEAN DEFAULT FALSE,
  training_added_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_verifications_content_type ON ai_content_verifications(content_type);
CREATE INDEX idx_verifications_project ON ai_content_verifications(project_slug);
CREATE INDEX idx_verifications_status ON ai_content_verifications(status);
CREATE INDEX idx_verifications_elder_review ON ai_content_verifications(requires_elder_review, elder_reviewed_at);
CREATE INDEX idx_verifications_training ON ai_content_verifications(used_for_training);

-- ============================================================================
-- 2. Knowledge Versions Table
-- ============================================================================
-- Tracks evolution of ACT's understanding over time

CREATE TABLE IF NOT EXISTS knowledge_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  knowledge_id TEXT NOT NULL,
  version INTEGER NOT NULL,
  content TEXT NOT NULL,
  content_type TEXT NOT NULL,

  -- Change tracking
  changed_from TEXT,
  reason_for_change TEXT NOT NULL,
  changed_by UUID REFERENCES auth.users(id),
  approved_by UUID REFERENCES auth.users(id),

  -- Version status
  status TEXT CHECK (status IN ('draft', 'active', 'archived', 'deprecated')) DEFAULT 'draft',
  active_from TIMESTAMPTZ,
  active_until TIMESTAMPTZ,

  -- Metadata
  tags TEXT[],
  projects TEXT[],
  domains TEXT[],

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(knowledge_id, version)
);

-- Indexes
CREATE INDEX idx_knowledge_versions_id ON knowledge_versions(knowledge_id);
CREATE INDEX idx_knowledge_versions_status ON knowledge_versions(status);
CREATE INDEX idx_knowledge_versions_active ON knowledge_versions(active_from, active_until);
CREATE INDEX idx_knowledge_versions_projects ON knowledge_versions USING GIN(projects);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_knowledge_version_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER knowledge_versions_updated_at
  BEFORE UPDATE ON knowledge_versions
  FOR EACH ROW
  EXECUTE FUNCTION update_knowledge_version_timestamp();

-- ============================================================================
-- 3. Knowledge Sources Table
-- ============================================================================
-- Tracks where knowledge comes from and its authority level

CREATE TABLE IF NOT EXISTS knowledge_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  knowledge_id TEXT NOT NULL,
  source_type TEXT CHECK (source_type IN ('foundational', 'strategic', 'tactical', 'dynamic', 'experimental')) NOT NULL,
  source_name TEXT NOT NULL,
  source_url TEXT,
  source_date DATE,

  -- Authority tracking
  authority_level INTEGER CHECK (authority_level BETWEEN 1 AND 5) NOT NULL,
  verified_by UUID REFERENCES auth.users(id),
  verified_at TIMESTAMPTZ,

  -- Nuance and context
  context TEXT,
  limitations TEXT,
  conflicts_with UUID[],
  superseded_by UUID REFERENCES knowledge_sources(id),

  -- Attribution
  author TEXT,
  organization TEXT,
  projects TEXT[],

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_knowledge_sources_knowledge_id ON knowledge_sources(knowledge_id);
CREATE INDEX idx_knowledge_sources_type ON knowledge_sources(source_type);
CREATE INDEX idx_knowledge_sources_authority ON knowledge_sources(authority_level);
CREATE INDEX idx_knowledge_sources_projects ON knowledge_sources USING GIN(projects);

-- ============================================================================
-- 4. PMPP Knowledge Table (Principles, Methods, Practices, Procedures)
-- ============================================================================
-- Structured knowledge taxonomy

CREATE TABLE IF NOT EXISTS pmpp_knowledge (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT CHECK (type IN ('principle', 'method', 'practice', 'procedure')) NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  context TEXT,

  -- Hierarchy relationships
  parent_principle_id UUID REFERENCES pmpp_knowledge(id) ON DELETE CASCADE,
  parent_method_id UUID REFERENCES pmpp_knowledge(id) ON DELETE CASCADE,
  parent_practice_id UUID REFERENCES pmpp_knowledge(id) ON DELETE CASCADE,

  -- Version tracking
  version INTEGER DEFAULT 1,
  status TEXT CHECK (status IN ('draft', 'active', 'archived')) DEFAULT 'draft',
  last_reviewed_at TIMESTAMPTZ DEFAULT NOW(),
  review_frequency_days INTEGER,

  -- Approval workflow
  update_authority TEXT,
  requires_approval_from TEXT[],

  -- Categorization
  projects TEXT[],
  domains TEXT[],
  tags TEXT[],

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_pmpp_type ON pmpp_knowledge(type);
CREATE INDEX idx_pmpp_status ON pmpp_knowledge(status);
CREATE INDEX idx_pmpp_principle ON pmpp_knowledge(parent_principle_id);
CREATE INDEX idx_pmpp_method ON pmpp_knowledge(parent_method_id);
CREATE INDEX idx_pmpp_practice ON pmpp_knowledge(parent_practice_id);
CREATE INDEX idx_pmpp_projects ON pmpp_knowledge USING GIN(projects);
CREATE INDEX idx_pmpp_review ON pmpp_knowledge(last_reviewed_at);

-- Trigger to update updated_at
CREATE TRIGGER pmpp_knowledge_updated_at
  BEFORE UPDATE ON pmpp_knowledge
  FOR EACH ROW
  EXECUTE FUNCTION update_knowledge_version_timestamp();

-- Constraint: Enforce hierarchy (procedures must have practice parent, practices must have method parent, methods must have principle parent)
ALTER TABLE pmpp_knowledge ADD CONSTRAINT pmpp_hierarchy_check
  CHECK (
    (type = 'principle' AND parent_principle_id IS NULL AND parent_method_id IS NULL AND parent_practice_id IS NULL) OR
    (type = 'method' AND parent_principle_id IS NOT NULL AND parent_method_id IS NULL AND parent_practice_id IS NULL) OR
    (type = 'practice' AND parent_principle_id IS NOT NULL AND parent_method_id IS NOT NULL AND parent_practice_id IS NULL) OR
    (type = 'procedure' AND parent_principle_id IS NOT NULL AND parent_method_id IS NOT NULL AND parent_practice_id IS NOT NULL)
  );

-- ============================================================================
-- 5. Elder Review Queue Table
-- ============================================================================
-- Manages cultural content requiring elder approval

CREATE TABLE IF NOT EXISTS elder_review_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  verification_id UUID REFERENCES ai_content_verifications(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL,
  content TEXT NOT NULL,
  project_slug TEXT,

  -- Review status
  status TEXT CHECK (status IN ('pending', 'in_review', 'approved', 'rejected', 'needs_revision')) DEFAULT 'pending',

  -- Assignment
  assigned_to UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMPTZ,

  -- Cultural context
  cultural_topics TEXT[],
  communities_involved TEXT[],
  sensitivity_level TEXT CHECK (sensitivity_level IN ('low', 'medium', 'high', 'sacred')),

  -- Review outcome
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  review_notes TEXT,
  suggested_changes TEXT,

  -- Tracking
  submitted_by UUID REFERENCES auth.users(id),
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  priority INTEGER CHECK (priority BETWEEN 1 AND 5) DEFAULT 3,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_elder_queue_status ON elder_review_queue(status);
CREATE INDEX idx_elder_queue_assigned ON elder_review_queue(assigned_to, status);
CREATE INDEX idx_elder_queue_sensitivity ON elder_review_queue(sensitivity_level);
CREATE INDEX idx_elder_queue_priority ON elder_review_queue(priority, created_at);

-- ============================================================================
-- 6. Community Feedback Table
-- ============================================================================
-- Captures community input on published content

CREATE TABLE IF NOT EXISTS community_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID,
  content_type TEXT NOT NULL,
  content_url TEXT,

  -- Feedback
  feedback_type TEXT CHECK (feedback_type IN ('correction', 'suggestion', 'appreciation', 'concern')) NOT NULL,
  feedback_text TEXT NOT NULL,

  -- Categorization
  category TEXT,
  severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')),

  -- Submitter (optional - can be anonymous)
  submitted_by UUID REFERENCES auth.users(id),
  submitter_name TEXT,
  submitter_email TEXT,
  anonymous BOOLEAN DEFAULT FALSE,

  -- Review status
  status TEXT CHECK (status IN ('new', 'reviewing', 'addressed', 'dismissed')) DEFAULT 'new',
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  review_notes TEXT,
  action_taken TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_community_feedback_type ON community_feedback(feedback_type);
CREATE INDEX idx_community_feedback_status ON community_feedback(status);
CREATE INDEX idx_community_feedback_severity ON community_feedback(severity);
CREATE INDEX idx_community_feedback_content ON community_feedback(content_id, content_type);

-- ============================================================================
-- 7. Training Dataset Table
-- ============================================================================
-- Stores approved content for fine-tuning

CREATE TABLE IF NOT EXISTS training_dataset (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  verification_id UUID REFERENCES ai_content_verifications(id),

  -- Training data
  prompt TEXT NOT NULL,
  completion TEXT NOT NULL,
  content_type TEXT NOT NULL,
  project_slug TEXT,

  -- Quality metadata
  brand_voice_score INTEGER,
  cultural_safety_score INTEGER,
  overall_quality_score INTEGER,

  -- Training metadata
  included_in_training_run TEXT[],
  last_used_for_training TIMESTAMPTZ,
  usage_count INTEGER DEFAULT 0,

  -- Categorization
  tags TEXT[],
  themes TEXT[],
  difficulty_level TEXT CHECK (difficulty_level IN ('basic', 'intermediate', 'advanced')),

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_training_content_type ON training_dataset(content_type);
CREATE INDEX idx_training_project ON training_dataset(project_slug);
CREATE INDEX idx_training_quality ON training_dataset(overall_quality_score);
CREATE INDEX idx_training_tags ON training_dataset USING GIN(tags);

-- ============================================================================
-- 8. Helper Views
-- ============================================================================

-- View: High-quality verified content ready for training
CREATE OR REPLACE VIEW training_ready_content AS
SELECT
  v.id,
  v.content_type,
  v.project_slug,
  v.generated_content AS prompt,
  v.final_content AS completion,
  v.brand_voice_score,
  v.cultural_safety_score,
  v.overall_quality_score,
  v.verified_at
FROM ai_content_verifications v
WHERE v.status = 'approved'
  AND v.overall_quality_score >= 4
  AND (v.requires_elder_review = FALSE OR v.elder_reviewed_at IS NOT NULL)
  AND v.used_for_training = FALSE
ORDER BY v.overall_quality_score DESC, v.verified_at DESC;

-- View: Current active knowledge
CREATE OR REPLACE VIEW current_knowledge AS
SELECT
  kv.knowledge_id,
  kv.version,
  kv.content,
  kv.content_type,
  kv.tags,
  kv.projects,
  kv.active_from,
  kv.changed_by,
  kv.reason_for_change
FROM knowledge_versions kv
WHERE kv.status = 'active'
  AND kv.active_from <= NOW()
  AND (kv.active_until IS NULL OR kv.active_until > NOW())
ORDER BY kv.knowledge_id, kv.version DESC;

-- View: Pending elder reviews
CREATE OR REPLACE VIEW pending_elder_reviews AS
SELECT
  eq.id,
  eq.content_type,
  eq.project_slug,
  eq.cultural_topics,
  eq.sensitivity_level,
  eq.priority,
  eq.submitted_at,
  eq.assigned_to,
  u.email AS submitter_email
FROM elder_review_queue eq
LEFT JOIN auth.users u ON eq.submitted_by = u.id
WHERE eq.status IN ('pending', 'in_review')
ORDER BY eq.priority DESC, eq.submitted_at ASC;

-- View: Knowledge review schedule
CREATE OR REPLACE VIEW knowledge_review_schedule AS
SELECT
  p.id,
  p.type,
  p.title,
  p.last_reviewed_at,
  p.review_frequency_days,
  p.last_reviewed_at + (p.review_frequency_days || ' days')::INTERVAL AS next_review_due,
  CASE
    WHEN p.last_reviewed_at + (p.review_frequency_days || ' days')::INTERVAL < NOW() THEN 'overdue'
    WHEN p.last_reviewed_at + (p.review_frequency_days || ' days')::INTERVAL < NOW() + INTERVAL '7 days' THEN 'due_soon'
    ELSE 'current'
  END AS review_status
FROM pmpp_knowledge p
WHERE p.status = 'active'
  AND p.review_frequency_days IS NOT NULL
ORDER BY
  CASE
    WHEN p.last_reviewed_at + (p.review_frequency_days || ' days')::INTERVAL < NOW() THEN 1
    WHEN p.last_reviewed_at + (p.review_frequency_days || ' days')::INTERVAL < NOW() + INTERVAL '7 days' THEN 2
    ELSE 3
  END,
  p.last_reviewed_at + (p.review_frequency_days || ' days')::INTERVAL ASC;

-- ============================================================================
-- 9. Row Level Security (RLS) Policies
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE ai_content_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE pmpp_knowledge ENABLE ROW LEVEL SECURITY;
ALTER TABLE elder_review_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_dataset ENABLE ROW LEVEL SECURITY;

-- Verifications: Anyone can read, authenticated users can create, only creator/admin can update
CREATE POLICY "Verifications are viewable by everyone" ON ai_content_verifications FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create verifications" ON ai_content_verifications FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update their own verifications" ON ai_content_verifications FOR UPDATE USING (auth.uid() = verified_by);

-- Knowledge: Public read, authenticated write
CREATE POLICY "Knowledge is viewable by everyone" ON knowledge_versions FOR SELECT USING (status = 'active');
CREATE POLICY "Authenticated users can create knowledge versions" ON knowledge_versions FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Sources: Public read, authenticated write
CREATE POLICY "Sources are viewable by everyone" ON knowledge_sources FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create sources" ON knowledge_sources FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- PMPP: Public read active, authenticated write
CREATE POLICY "Active PMPP is viewable by everyone" ON pmpp_knowledge FOR SELECT USING (status = 'active');
CREATE POLICY "Authenticated users can create PMPP" ON pmpp_knowledge FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Elder queue: Restricted to assigned reviewers and admins
CREATE POLICY "Assigned elders can view their reviews" ON elder_review_queue FOR SELECT USING (auth.uid() = assigned_to OR auth.uid() = submitted_by);
CREATE POLICY "Authenticated users can submit for elder review" ON elder_review_queue FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Community feedback: Anyone can submit, only admins can review
CREATE POLICY "Anyone can submit community feedback" ON community_feedback FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can view feedback" ON community_feedback FOR SELECT USING (auth.role() = 'authenticated');

-- Training dataset: Authenticated read, system write
CREATE POLICY "Authenticated users can view training data" ON training_dataset FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "System can create training data" ON training_dataset FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- ============================================================================
-- 10. Sample Data (Optional - for testing)
-- ============================================================================

-- Insert sample PMPP structure for ACT
INSERT INTO pmpp_knowledge (type, title, content, status, review_frequency_days, projects) VALUES
  ('principle', 'Community Ownership', 'Communities own their innovations, stories, and solutions. ACT facilitates but never owns.', 'active', 365, ARRAY['all']),
  ('principle', 'Beautiful Obsolescence', 'We design ourselves to become obsolete as communities build their own capacity.', 'active', 365, ARRAY['all']),
  ('principle', 'Consent at Every Level', 'Nothing moves forward without explicit, informed consent from communities.', 'active', 365, ARRAY['all']);

-- Insert sample knowledge version
INSERT INTO knowledge_versions (knowledge_id, version, content, content_type, reason_for_change, status, active_from, projects) VALUES
  ('act-brand-voice', 1, 'ACT''s brand voice is grounded yet visionary, humble yet confident, warm yet challenging, and poetic yet clear.', 'brand-guideline', 'Initial documentation', 'active', NOW(), ARRAY['all']);

-- ============================================================================
-- End of Migration
-- ============================================================================
