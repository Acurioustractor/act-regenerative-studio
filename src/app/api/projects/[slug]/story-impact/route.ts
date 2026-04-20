/**
 * Story-Based Impact API
 *
 * GET /api/projects/[slug]/story-impact
 * Derives project impact signals from the same site-scoped Empathy Ledger
 * live feed used by the public project pages.
 */

import { NextRequest, NextResponse } from 'next/server';
import type {
  StoryImpactMetrics,
  CommunityInsight,
} from '@/types/shared/act-featured-content';
import { getFeaturedContentForProject } from '@/lib/empathy-ledger-featured';

function buildThemeCounts(themes: string[]): Array<{ theme: string; count: number }> {
  const counts = new Map<string, number>();

  for (const theme of themes) {
    counts.set(theme, (counts.get(theme) || 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([theme, count]) => ({ theme, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}

function buildInsights(
  projectSlug: string,
  themes: string[],
  storyCount: number,
  storytellerCount: number
): CommunityInsight[] {
  const topThemes = buildThemeCounts(themes);
  const insights: CommunityInsight[] = [];

  if (topThemes.length > 0) {
    insights.push({
      id: `${projectSlug}-top-theme`,
      type: 'pattern',
      insight: `"${topThemes[0].theme}" is the strongest recurring theme emerging from live project stories.`,
      supportingStoryCount: topThemes[0].count,
      createdAt: new Date().toISOString(),
      confidence: storyCount > 0 ? Math.min(0.95, topThemes[0].count / storyCount + 0.35) : undefined,
    });
  }

  if (storytellerCount > 1) {
    insights.push({
      id: `${projectSlug}-breadth`,
      type: 'trend',
      insight: `${storytellerCount} storytellers are currently represented in the live project layer, giving this page a broader community signal than a single case study alone.`,
      supportingStoryCount: storyCount,
      createdAt: new Date().toISOString(),
      confidence: storytellerCount > 2 ? 0.82 : 0.68,
    });
  }

  if (storyCount > 0) {
    insights.push({
      id: `${projectSlug}-syndication`,
      type: 'wisdom',
      insight: 'These insights are drawn from stories told with consent — not scraped, not inferred.',
      supportingStoryCount: storyCount,
      createdAt: new Date().toISOString(),
      confidence: 0.9,
    });
  }

  return insights.slice(0, 3);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const liveContent = await getFeaturedContentForProject(slug, {
      limit: 12,
      mediaLimit: 12,
    });

    if (!liveContent) {
      return NextResponse.json({
        success: true,
        metrics: {
          storytellerCount: 0,
          storyCount: 0,
          themeCount: 0,
          insightCount: 0,
          topThemes: [],
        } satisfies StoryImpactMetrics,
        insights: [],
      });
    }

    const allThemes = liveContent.featured.stories.flatMap((story) => story.themes || []);
    const topThemes = buildThemeCounts(allThemes);
    const insights = buildInsights(
      slug,
      allThemes,
      liveContent.meta.story_count,
      liveContent.meta.storyteller_count
    );

    return NextResponse.json({
      success: true,
      metrics: {
        storytellerCount: liveContent.meta.storyteller_count,
        storyCount: liveContent.meta.story_count,
        themeCount: new Set(allThemes).size,
        insightCount: insights.length,
        topThemes,
        valueCreated: {
          collaborationsFormed: liveContent.meta.gallery_count || undefined,
          mediaCoverage: liveContent.meta.media_count || undefined,
        },
      } satisfies StoryImpactMetrics,
      insights,
      meta: liveContent.meta,
    });
  } catch (error) {
    console.error('[Story Impact API] Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch story impact data',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
