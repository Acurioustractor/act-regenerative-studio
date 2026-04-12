import { cache } from 'react';

import {
  getFeaturedContentForProject,
  type FeaturedStoryteller,
} from '@/lib/empathy-ledger-featured';
import { getCanonicalWikiProjectRecords } from '@/lib/wiki/canonical-project-wiki';

export interface PublicPerson {
  id: string;
  name: string;
  role: string | null;
  organization: string | null;
  bio: string | null;
  imageUrl: string | null;
  projects: string[];
  storyCount: number;
  priority: number;
}

export interface FeaturedPeopleResult {
  storytellers: PublicPerson[];
  projectNames: Record<string, string>;
  stats: {
    storytellerCount: number;
    projectCount: number;
    storyCount: number;
  };
}

export const getAllFeaturedStorytellers = cache(
  async function getAllFeaturedStorytellers(): Promise<FeaturedPeopleResult> {
    const wikiProjects = await getCanonicalWikiProjectRecords();

    // Fetch featured content for each wiki project (parallel, with timeout)
    const projectSlugs = wikiProjects.map((p) => p.slug);
    const projectNames: Record<string, string> = {};
    for (const p of wikiProjects) {
      projectNames[p.slug] = p.title;
    }

    const results = await Promise.allSettled(
      projectSlugs.map((slug) =>
        getFeaturedContentForProject(slug, { type: 'all', limit: 20 })
      )
    );

    // Deduplicate storytellers across projects
    const personMap = new Map<string, PublicPerson>();
    let totalStories = 0;
    const projectsWithPeople = new Set<string>();

    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      if (result.status !== 'fulfilled' || !result.value) continue;

      const slug = projectSlugs[i];
      const featured = result.value.featured;

      for (const st of featured.storytellers) {
        const existing = personMap.get(st.storyteller_id);
        if (existing) {
          if (!existing.projects.includes(slug)) {
            existing.projects.push(slug);
          }
          existing.storyCount += st.featured_story_count;
          existing.priority = Math.max(existing.priority, st.featured_priority);
        } else {
          personMap.set(st.storyteller_id, {
            id: st.storyteller_id,
            name: st.display_name || st.full_name || 'Anonymous',
            role: st.current_role || null,
            organization: st.current_organization || null,
            bio: st.featured_bio || st.bio || null,
            imageUrl: st.profile_image_url || null,
            projects: [slug],
            storyCount: st.featured_story_count,
            priority: st.featured_priority,
          });
        }
        projectsWithPeople.add(slug);
      }

      totalStories += featured.stories.length;
    }

    // Sort: priority descending, then by story count, then alphabetically
    const storytellers = [...personMap.values()].sort((a, b) => {
      if (b.priority !== a.priority) return b.priority - a.priority;
      if (b.storyCount !== a.storyCount) return b.storyCount - a.storyCount;
      return a.name.localeCompare(b.name);
    });

    return {
      storytellers,
      projectNames,
      stats: {
        storytellerCount: storytellers.length,
        projectCount: projectsWithPeople.size,
        storyCount: totalStories,
      },
    };
  }
);
