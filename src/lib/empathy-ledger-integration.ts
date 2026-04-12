/**
 * Empathy Ledger Integration
 * Legacy search helpers for storyteller/story discovery.
 * These now share the same runtime contract as the site-scoped live feed:
 * fast timeout, single disable switch, and graceful fallback when EL is offline.
 */

import { cache } from 'react';
import {
  fetchEmpathyLedgerJson,
  requestEmpathyLedgerJson,
} from '@/lib/empathy-ledger-runtime';

export interface Storyteller {
  id: string;
  full_name: string;
  bio?: string;
  profile_image_url?: string;
  cultural_background?: string;
  organization_id?: string;
  is_featured?: boolean;
  story_count?: number;
}

export interface Story {
  id: string;
  title: string;
  excerpt?: string;
  themes?: string[];
  storyteller_id: string;
  storyteller?: {
    full_name: string;
    profile_image_url?: string;
  };
  created_at: string;
}

export interface StorytellerSearchResult {
  storytellers: Storyteller[];
  totalCount: number;
}

export interface StorySearchResult {
  stories: Story[];
  totalCount: number;
}

async function fetchJson<T>(path: string, revalidate: number = 600): Promise<T | null> {
  return fetchEmpathyLedgerJson<T>(path, { revalidate });
}

/**
 * Search storytellers by organization
 */
const searchStorytellersByOrganizationCached = cache(
  async (
    organizationName: string,
    serializedOptions: string
  ): Promise<StorytellerSearchResult> => {
    const options = JSON.parse(serializedOptions) as {
      limit?: number;
      hasStories?: boolean;
    };
    const params = new URLSearchParams();
    if (organizationName) params.append('organization', organizationName);
    if (options.limit) params.append('limit', options.limit.toString());
    if (options.hasStories !== undefined)
      params.append('has_stories', options.hasStories.toString());

    const data = await fetchJson<{
      storytellers?: Storyteller[];
      totalCount?: number;
    }>(`/api/search/storytellers?${params.toString()}`, 600);

    return {
      storytellers: data?.storytellers || [],
      totalCount: data?.totalCount || 0,
    };
  }
);

export async function searchStorytellersByOrganization(
  organizationName: string,
  options: {
    limit?: number;
    hasStories?: boolean;
  } = {}
): Promise<StorytellerSearchResult> {
  try {
    return await searchStorytellersByOrganizationCached(
      organizationName,
      JSON.stringify({
        limit: options.limit ?? null,
        hasStories: options.hasStories ?? null,
      })
    );
  } catch (error) {
    console.error('Error searching storytellers:', error);
    return { storytellers: [], totalCount: 0 };
  }
}

/**
 * Search storytellers by themes
 */
const searchStorytellersByThemesCached = cache(
  async (
    serializedThemes: string,
    serializedOptions: string
  ): Promise<StorytellerSearchResult> => {
    const themes = JSON.parse(serializedThemes) as string[];
    const options = JSON.parse(serializedOptions) as {
      limit?: number;
    };
    const params = new URLSearchParams();
    params.append('themes', themes.join(','));
    if (options.limit) params.append('limit', options.limit.toString());

    const data = await fetchJson<{
      storytellers?: Storyteller[];
      totalCount?: number;
    }>(`/api/search/storytellers?${params.toString()}`, 600);

    return {
      storytellers: data?.storytellers || [],
      totalCount: data?.totalCount || 0,
    };
  }
);

export async function searchStorytellersByThemes(
  themes: string[],
  options: {
    limit?: number;
  } = {}
): Promise<StorytellerSearchResult> {
  try {
    return await searchStorytellersByThemesCached(
      JSON.stringify([...themes].sort()),
      JSON.stringify({
        limit: options.limit ?? null,
      })
    );
  } catch (error) {
    console.error('Error searching storytellers by themes:', error);
    return { storytellers: [], totalCount: 0 };
  }
}

/**
 * Get storyteller's stories
 */
const getStorytellerStoriesCached = cache(
  async (
    storytellerId: string,
    serializedOptions: string
  ): Promise<StorySearchResult> => {
    const options = JSON.parse(serializedOptions) as {
      limit?: number;
      privacyLevel?: 'public' | 'community';
    };
    const params = new URLSearchParams();
    if (options.limit) params.append('limit', options.limit.toString());
    if (options.privacyLevel)
      params.append('privacy_level', options.privacyLevel);

    const data = await fetchJson<{
      stories?: Story[];
      total_count?: number;
    }>(`/api/v1/profiles/${storytellerId}/stories?${params.toString()}`, 600);

    return {
      stories: data?.stories || [],
      totalCount: data?.total_count || 0,
    };
  }
);

export async function getStorytellerStories(
  storytellerId: string,
  options: {
    limit?: number;
    privacyLevel?: 'public' | 'community';
  } = {}
): Promise<StorySearchResult> {
  try {
    return await getStorytellerStoriesCached(
      storytellerId,
      JSON.stringify({
        limit: options.limit ?? null,
        privacyLevel: options.privacyLevel ?? null,
      })
    );
  } catch (error) {
    console.error('Error fetching storyteller stories:', error);
    return { stories: [], totalCount: 0 };
  }
}

/**
 * Search stories by themes
 */
const searchStoriesByThemesCached = cache(
  async (
    serializedThemes: string,
    serializedOptions: string
  ): Promise<StorySearchResult> => {
    const themes = JSON.parse(serializedThemes) as string[];
    const options = JSON.parse(serializedOptions) as {
      limit?: number;
      project?: string;
    };
    const params = new URLSearchParams();
    params.append('themes', themes.join(','));
    if (options.limit) params.append('limit', options.limit.toString());
    if (options.project) params.append('project', options.project);

    const data = await fetchJson<{
      stories?: Story[];
      totalCount?: number;
    }>(`/api/stories/search?${params.toString()}`, 600);

    return {
      stories: data?.stories || [],
      totalCount: data?.totalCount || 0,
    };
  }
);

export async function searchStoriesByThemes(
  themes: string[],
  options: {
    limit?: number;
    project?: string;
  } = {}
): Promise<StorySearchResult> {
  try {
    return await searchStoriesByThemesCached(
      JSON.stringify([...themes].sort()),
      JSON.stringify({
        limit: options.limit ?? null,
        project: options.project ?? null,
      })
    );
  } catch (error) {
    console.error('Error searching stories:', error);
    return { stories: [], totalCount: 0 };
  }
}

/**
 * Get thematic analysis across storytellers
 */
export async function getThematicAnalysis(
  storytellerIds: string[],
  options: {
    organization?: string;
    culturalContext?: string;
  } = {}
): Promise<any> {
  try {
    return await requestEmpathyLedgerJson<any>(
      '/api/analytics/thematic-analysis',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          storytellerIds,
          organization: options.organization,
          analysisType: 'comprehensive',
          culturalContext: options.culturalContext,
          includeMediaKit: true,
          includeRelatedContent: true,
        }),
        revalidate: 3600,
      }
    );
  } catch (error) {
    console.error('Error fetching thematic analysis:', error);
    return null;
  }
}
