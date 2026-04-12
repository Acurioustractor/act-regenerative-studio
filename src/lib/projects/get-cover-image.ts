/**
 * Cover Image Resolver
 * Priority: Media Gallery hero → Static fallback
 */

import { supabase } from '@/lib/supabase/client';

export interface CoverImage {
  url: string;
  alt: string;
  source: 'media_gallery' | 'static' | 'empathy_ledger';
  blurhash?: string;
  width?: number;
  height?: number;
}

/**
 * Get cover image from Media Gallery (hero image for project)
 */
async function getMediaGalleryHero(projectSlug: string): Promise<CoverImage | null> {
  try {
    const { data, error } = await supabase.rpc('get_hero_image', {
      p_link_type: 'project_page',
      p_link_id: projectSlug,
    });

    if (error || !data || data.length === 0) {
      return null;
    }

    const hero = data[0];
    return {
      url: hero.file_url,
      alt: hero.alt_text || hero.title || `${projectSlug} hero image`,
      source: 'media_gallery',
      blurhash: hero.blurhash,
    };
  } catch {
    // Media gallery not available or error
    return null;
  }
}

/**
 * Resolve cover image with fallback priority
 * Priority: Media Gallery → Static fallback
 */
export async function getCoverImage(
  projectSlug: string,
  projectTitle: string,
  staticFallback?: string
): Promise<CoverImage | null> {
  // 1. Try Media Gallery hero
  const mediaGalleryHero = await getMediaGalleryHero(projectSlug);
  if (mediaGalleryHero) {
    return mediaGalleryHero;
  }

  // 2. Use static fallback
  if (staticFallback) {
    return {
      url: staticFallback,
      alt: `${projectTitle} cover`,
      source: 'static',
    };
  }

  return null;
}

/**
 * Get all project media from Media Gallery
 */
export async function getProjectMedia(
  projectSlug: string,
  options: { limit?: number; includeHero?: boolean } = {}
): Promise<Array<{
  id: string;
  url: string;
  thumbnailUrl?: string;
  type: string;
  title?: string;
  alt?: string;
  caption?: string;
  credit?: string;
  isHero: boolean;
  isFeatured: boolean;
}>> {
  const { limit = 20, includeHero = true } = options;

  try {
    const { data, error } = await supabase.rpc('get_project_media', {
      p_link_type: 'project_page',
      p_link_id: projectSlug,
    });

    if (error || !data) {
      return [];
    }

    let media = data.map((item: {
      id: string;
      file_url: string;
      thumbnail_url?: string;
      file_type: string;
      title?: string;
      alt_text?: string;
      caption?: string;
      credit?: string;
      is_hero: boolean;
      is_featured: boolean;
    }) => ({
      id: item.id,
      url: item.file_url,
      thumbnailUrl: item.thumbnail_url,
      type: item.file_type,
      title: item.title,
      alt: item.alt_text,
      caption: item.caption,
      credit: item.credit,
      isHero: item.is_hero,
      isFeatured: item.is_featured,
    }));

    if (!includeHero) {
      media = media.filter((item: { isHero: boolean }) => !item.isHero);
    }

    return media.slice(0, limit);
  } catch {
    return [];
  }
}
