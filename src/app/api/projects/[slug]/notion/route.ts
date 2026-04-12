/**
 * Legacy compatibility alias for public ACT project metadata.
 *
 * GET /api/projects/[slug]/notion
 *
 * Keep this route only so older callers do not break immediately.
 * The canonical public route is `/api/projects/[slug]/metadata`.
 */

import { GET as getMetadata } from '../metadata/route';

export const GET = getMetadata;
