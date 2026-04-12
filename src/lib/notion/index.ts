/**
 * Direct Notion client exports.
 *
 * This namespace is now primarily for true Notion API work and legacy
 * compatibility. Public project metadata should come from
 * `@/lib/project-metadata/*`.
 *
 * @deprecated For public project data, prefer `@/lib/project-metadata/*`.
 */

export {
  getNotionProject,
  getAllNotionProjects,
  getNotionPageContent,
  notion,
} from './client';

export type {
  NotionProjectMetadata,
  ProjectEnrichmentData,
  EnrichmentDiff,
  VerificationWorkflow,
} from './types';
