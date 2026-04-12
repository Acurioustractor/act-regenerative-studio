/**
 * Legacy compatibility shim.
 *
 * Public ACT project metadata is now derived from the canonical wiki and
 * static project registry via `@/lib/project-metadata/*`.
 *
 * Keep this file only so older imports do not break immediately.
 *
 * @deprecated Prefer `@/lib/project-metadata/public`.
 */

export {
  getPublicProjectMetadata as getPublicNotionProject,
  getAllPublicProjectMetadata as getAllPublicNotionProjects,
  getPublicProjectPageContent as getPublicNotionPageContent,
} from '@/lib/project-metadata/public';
