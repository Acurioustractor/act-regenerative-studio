/**
 * Legacy compatibility shim.
 *
 * Public ACT project metadata types now live in `@/lib/project-metadata/types`.
 * Keep these aliases so older imports still compile while the codebase is
 * migrated away from Notion-centric naming.
 *
 * @deprecated Prefer `@/lib/project-metadata/types`.
 */

import type {
  ProjectMetadata,
  ProjectMetadataEnrichmentData,
  ProjectMetadataEnrichmentDiff,
  ProjectMetadataVerificationWorkflow,
} from '@/lib/project-metadata/types';

export type NotionProjectMetadata = ProjectMetadata;
export type ProjectEnrichmentData = ProjectMetadataEnrichmentData;
export type EnrichmentDiff = ProjectMetadataEnrichmentDiff;
export type VerificationWorkflow = ProjectMetadataVerificationWorkflow;
