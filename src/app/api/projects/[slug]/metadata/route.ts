/**
 * API endpoint to fetch public ACT project metadata.
 *
 * GET /api/projects/[slug]/metadata
 *
 * This is the canonical public metadata route. Data comes from the
 * wiki-derived public metadata layer.
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getPublicProjectMetadata,
  getPublicProjectPageContent,
} from '@/lib/project-metadata/public';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const project = await getPublicProjectMetadata(slug);

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found in public metadata registry' },
        { status: 404 }
      );
    }

    let pageContent = '';
    if (project.id) {
      try {
        pageContent = await getPublicProjectPageContent(slug);
      } catch (error) {
        console.warn('Could not fetch page content:', error);
      }
    }

    return NextResponse.json({
      success: true,
      project: {
        ...project,
        pageContent,
        source: 'wiki-derived',
      },
    });
  } catch (error) {
    console.error('Error fetching derived project metadata:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch project metadata',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
