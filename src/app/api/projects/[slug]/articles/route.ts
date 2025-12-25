/**
 * Project Articles API - Fetch blog articles related to a project
 *
 * GET /api/projects/[slug]/articles
 * Returns approved blog articles from enrichment_reviews table
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    const supabase = getSupabaseServerClient();
    if (!supabase) {
      throw new Error('Supabase client not configured');
    }

    // Fetch approved blog_links enrichments for this project
    const { data, error } = await supabase
      .from('enrichment_reviews')
      .select('ai_generated, created_at')
      .eq('project_slug', slug)
      .eq('enrichment_type', 'blog_links')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('[Project Articles API] Database error:', error);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to fetch articles',
          details: error.message,
        },
        { status: 500 }
      );
    }

    // Transform enrichment data into article format
    const articles = (data || []).map((item: any) => ({
      title: item.ai_generated.title,
      slug: item.ai_generated.slug,
      excerpt: item.ai_generated.excerpt || '',
      url: item.ai_generated.url,
      featuredImage: item.ai_generated.featuredImage || null,
      author: item.ai_generated.author || 'ACT Team',
      publishedDate: item.ai_generated.publishedDate || item.created_at,
      tags: item.ai_generated.tags || [],
      source: item.ai_generated.source || 'webflow',
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
