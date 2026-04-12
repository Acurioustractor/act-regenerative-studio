/**
 * Project Vignettes Loader
 * Parses markdown vignettes from compendium/04-story/vignettes/ by project_slugs
 * Filters by consent scope (EXTERNAL-LITE or EXTERNAL only)
 */

import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface VignetteFrontmatter {
  title: string;
  slug: string;
  vignette_number: number;
  category: string;
  consent_scope: 'INTERNAL' | 'EXTERNAL-LITE' | 'EXTERNAL';
  cultural_review_status: string;
  cultural_sensitivity_level: string;
  requires_elder_approval: boolean;
  identity_protected: boolean;
  project_slugs: string[];
  place_country: string;
  voice_owner: string;
  voice_role: string;
  authority_marker: string;
  alma_signals: {
    evidence_strength: number;
    community_authority: number;
    harm_risk_inverted: number;
    implementation_capability: number;
    option_value: number;
    community_value_return: number;
    overall_score: number;
  };
  lcaa_stage: 'Listen' | 'Curiosity' | 'Action' | 'Art';
  lcaa_shift: string;
  media: {
    descript_video_id: string | null;
    descript_url: string | null;
    photos: string[];
    audio: string | null;
  };
  status: string;
  last_updated: string;
  shareability: string;
}

export interface ProjectVignette {
  frontmatter: VignetteFrontmatter;
  content: string;
  excerpt: string;
  filePath: string;
}

// Cache for vignettes to avoid repeated file system reads
let vignetteCache: Map<string, ProjectVignette[]> | null = null;

/**
 * Get all vignettes from the filesystem
 */
async function getAllVignettes(): Promise<ProjectVignette[]> {
  const vignettesDir = path.join(process.cwd(), 'compendium/04-story/vignettes');
  const vignettes: ProjectVignette[] = [];

  async function scanDirectory(dir: string): Promise<void> {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory() && !entry.name.startsWith('_')) {
          await scanDirectory(fullPath);
        } else if (entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'index.md') {
          try {
            const fileContent = await fs.readFile(fullPath, 'utf-8');
            const { data, content } = matter(fileContent);

            // Skip template files
            if (entry.name.includes('template')) continue;

            // Extract excerpt (first paragraph after frontmatter, skip blockquotes)
            const contentLines = content.split('\n');
            let excerpt = '';
            for (const line of contentLines) {
              const trimmed = line.trim();
              // Skip headers, blockquotes, empty lines, and horizontal rules
              if (trimmed.startsWith('#') || trimmed.startsWith('>') || trimmed.startsWith('-') ||
                  trimmed === '' || trimmed === '---') {
                continue;
              }
              // Take the first real paragraph
              if (trimmed.length > 20) {
                excerpt = trimmed.slice(0, 200) + (trimmed.length > 200 ? '...' : '');
                break;
              }
            }

            vignettes.push({
              frontmatter: data as VignetteFrontmatter,
              content,
              excerpt,
              filePath: fullPath,
            });
          } catch {
            // Skip files that can't be parsed
            console.warn(`Could not parse vignette: ${fullPath}`);
          }
        }
      }
    } catch {
      // Directory doesn't exist, return empty
      console.warn(`Vignettes directory not found: ${dir}`);
    }
  }

  await scanDirectory(vignettesDir);
  return vignettes;
}

/**
 * Get vignettes for a specific project by slug
 * Only returns vignettes with EXTERNAL-LITE or EXTERNAL consent
 */
export async function getProjectVignettes(
  projectSlug: string,
  options: {
    limit?: number;
    sortBy?: 'alma_score' | 'date' | 'vignette_number';
  } = {}
): Promise<ProjectVignette[]> {
  const { limit = 3, sortBy = 'alma_score' } = options;

  // Use cache if available
  if (!vignetteCache) {
    const allVignettes = await getAllVignettes();
    vignetteCache = new Map();

    // Group by project slug
    for (const vignette of allVignettes) {
      const projectSlugs = vignette.frontmatter.project_slugs || [];
      for (const slug of projectSlugs) {
        if (!vignetteCache.has(slug)) {
          vignetteCache.set(slug, []);
        }
        vignetteCache.get(slug)!.push(vignette);
      }
    }
  }

  const projectVignettes = vignetteCache.get(projectSlug) || [];

  // Filter by consent scope - only EXTERNAL-LITE or EXTERNAL
  const publicVignettes = projectVignettes.filter((v) => {
    const consent = v.frontmatter.consent_scope;
    return consent === 'EXTERNAL-LITE' || consent === 'EXTERNAL';
  });

  // Sort
  const sorted = [...publicVignettes].sort((a, b) => {
    if (sortBy === 'alma_score') {
      const scoreA = a.frontmatter.alma_signals?.overall_score || 0;
      const scoreB = b.frontmatter.alma_signals?.overall_score || 0;
      return scoreB - scoreA;
    }
    if (sortBy === 'date') {
      return new Date(b.frontmatter.last_updated).getTime() - new Date(a.frontmatter.last_updated).getTime();
    }
    return (a.frontmatter.vignette_number || 0) - (b.frontmatter.vignette_number || 0);
  });

  return sorted.slice(0, limit);
}

/**
 * Get ALMA authority badge text from score
 */
export function getAlmaBadge(score: number): string | null {
  if (score >= 4.5) return 'High Community Authority';
  if (score >= 4.0) return 'Community Verified';
  if (score >= 3.5) return 'Community Voice';
  return null;
}

/**
 * Clear the vignette cache (useful for development)
 */
export function clearVignetteCache(): void {
  vignetteCache = null;
}
