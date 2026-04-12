/**
 * Project Data Layer
 * Unified exports for project-related data fetching
 *
 * NOTE: Server-only functions (vignettes, cover image, project data) should be
 * imported directly from their files, not from this barrel, to avoid bundling
 * fs/node modules in client components.
 *
 * Server components should import from:
 * - '@/lib/projects/get-project-data'
 * - '@/lib/projects/get-project-vignettes'
 * - '@/lib/projects/get-cover-image'
 */

// Client-safe exports (no fs, no node modules)
export { themeStyles, type ThemeStyle } from './theme-styles';
export { getAlmaBadge } from './alma-badge';

// Types only (safe for client) - use 'import type' to avoid runtime imports
import type { EnrichedProject as _EnrichedProject } from './get-project-data';
import type { ProjectVignette as _ProjectVignette, VignetteFrontmatter as _VignetteFrontmatter } from './get-project-vignettes';
import type { CoverImage as _CoverImage } from './get-cover-image';

export type EnrichedProject = _EnrichedProject;
export type ProjectVignette = _ProjectVignette;
export type VignetteFrontmatter = _VignetteFrontmatter;
export type CoverImage = _CoverImage;
