/**
 * Canonical project metadata types for the public ACT website.
 *
 * These types describe the derived metadata layer that sits between the
 * canonical wiki/static project registry and the public website surfaces.
 */

export interface ProjectMetadata {
  id: string;
  slug: string;
  title: string;
  description: string;
  status: 'active' | 'planning' | 'completed' | 'paused';
  priority: number;
  focusAreas: string[];
  themes: string[];
  partners: string[];
  organizationName: string;
  startDate: string | null;
  endDate: string | null;
  outcomes: string;
  metrics: Record<string, any>;
  timelineEntries: Array<{
    date: string;
    description: string;
    type: string;
  }>;
  connections: string[];
  notes: string;
  coverImage?: string;
  lastUpdated: string;
}

export interface ProjectMetadataEnrichmentData {
  metadata: ProjectMetadata | null;
  storytellers: Array<{
    id: string;
    name: string;
    bio: string;
    profileImage?: string;
    storyCount: number;
  }>;
  stories: Array<{
    id: string;
    title: string;
    excerpt: string;
    storytellerId: string;
    themes: string[];
    createdAt: string;
  }>;
  thematicInsights: {
    primaryThemes: string[];
    emergingThemes: string[];
    storyCountByTheme: Record<string, number>;
    commonPatterns: string[];
  };
  relatedBlogPosts: Array<{
    slug: string;
    title: string;
    excerpt: string;
    relevanceScore: number;
    publishedAt: string;
  }>;
  relatedProjects: Array<{
    slug: string;
    title: string;
    connectionType: 'direct' | 'thematic' | 'community' | 'geographic' | 'temporal';
    relevanceScore: number;
    reason: string;
  }>;
  media: {
    photos: Array<{
      url: string;
      caption: string;
      source: string;
      verified: boolean;
      tags?: string[];
    }>;
    videos: Array<{
      url: string;
      title: string;
      duration: number;
      source: string;
      thumbnail?: string;
    }>;
  };
  lastEnriched: string;
  enrichmentVersion: string;
  verificationStatus: {
    lcaaContent: 'draft' | 'needs_review' | 'approved';
    communityVoices: 'draft' | 'needs_review' | 'approved';
    blogLinks: 'draft' | 'needs_review' | 'approved';
    mediaGalleries: 'draft' | 'needs_review' | 'approved';
  };
  sources: {
    metadata?: {
      source: string;
      page_id: string;
      last_synced: string;
    };
    empathyLedger?: {
      storytellerCount: number;
      storyCount: number;
      last_synced: string;
    };
    blogPosts?: {
      linkedCount: number;
      last_scanned: string;
    };
  };
}

export interface ProjectMetadataEnrichmentDiff {
  section: string;
  sourceData: any;
  generatedContent: string;
  confidence: number;
  sources: string[];
  flags: string[];
}

export interface ProjectMetadataVerificationWorkflow {
  projectSlug: string;
  diffs: ProjectMetadataEnrichmentDiff[];
  flaggedItems: Array<{
    message: string;
    severity: 'warning' | 'error';
    suggestion?: string;
  }>;
  status: 'pending_review' | 'approved' | 'rejected' | 'needs_changes';
}
