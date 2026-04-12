/**
 * Project Articles API - Fetch blog articles related to a project
 *
 * GET /api/projects/[slug]/articles
 * Returns site-syndicated editorial articles mapped to the project.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getProjectEditorialArticles } from '@/lib/empathy-ledger-editorial';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const articles = (await getProjectEditorialArticles(slug, limit)).map((item) => ({
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt || '',
      url: item.localPath,
      canonicalUrl: item.canonicalUrl,
      featuredImage: item.featuredImageUrl || null,
      author: item.authorName || 'ACT Team',
      publishedDate: item.publishedAt || null,
      tags: item.tags || [],
      relatedProjects: item.relatedProjectSlugs,
      source: 'empathy-ledger-editorial',
    }));

    return NextResponse.json({
      success: true,
      articles,
      count: articles.length,
      projectSlug: slug,
    });

  } catch (error) {
    console.error('[Project Articles API] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
