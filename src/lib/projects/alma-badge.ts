/**
 * ALMA Badge Helper
 * Pure function, safe for client components
 */

/**
 * Get ALMA authority badge text from score
 */
export function getAlmaBadge(score: number): string | null {
  if (score >= 4.5) return 'High Community Authority';
  if (score >= 4.0) return 'Community Verified';
  if (score >= 3.5) return 'Community Voice';
  return null;
}
