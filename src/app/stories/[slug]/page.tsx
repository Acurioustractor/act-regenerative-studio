import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { JsonLd } from '@/components/seo/JsonLd';
import { StoryScroll } from '@/components/stories/StoryScroll';
import { articleJsonLd, breadcrumbJsonLd, pageMetadata } from '@/lib/seo/site';
import { getStoryPacket, storyPackets } from '@/lib/stories/story-packets';
import {
  getEditorialArticleBySlug,
  getEditorialArticleStaticSlugs,
} from '@/lib/empathy-ledger-editorial';
import {
  EditorialArticleReader,
  editorialArticleMetadata,
} from './editorial-article';

/**
 * One slug space for everything a reader opens from /stories (route
 * unification, 2026-08-07). Authored story packets resolve first, then
 * editorial articles syndicated from Empathy Ledger; packets win a slug
 * collision because they are curated by hand in this repository.
 * /blog/[slug] 308s here via config/launch-redirects.cjs.
 */

export const revalidate = 60;

interface StoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export function generateStaticParams() {
  const packetSlugs = storyPackets.map((story) => story.slug);
  let articleSlugs: string[] = [];
  try {
    articleSlugs = getEditorialArticleStaticSlugs();
  } catch (error) {
    console.error('Failed to generate static params for editorial articles:', error);
  }
  return [...new Set([...packetSlugs, ...articleSlugs])].map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const story = getStoryPacket(slug);

  if (story) {
    return pageMetadata({
      title: `${story.title} | ACT Stories`,
      description: story.summary,
      path: `/stories/${story.slug}`,
      type: 'article',
      noIndex: story.status !== 'published',
      image: story.hero.media.poster
        ? {
            url: story.hero.media.poster,
            alt: story.hero.media.alt,
          }
        : undefined,
    });
  }

  const post = await getEditorialArticleBySlug(slug);
  if (!post) return {};
  return editorialArticleMetadata(post);
}

export default async function StoryPage({ params, searchParams }: StoryPageProps) {
  const { slug } = await params;
  const query = await searchParams;
  const story = getStoryPacket(slug);

  if (!story) {
    const post = await getEditorialArticleBySlug(slug);
    if (!post) {
      notFound();
    }
    return <EditorialArticleReader post={post} />;
  }

  const previewValue = query.preview || query.internal;
  const wantsInternalPreview =
    previewValue === 'internal' ||
    previewValue === '1' ||
    (Array.isArray(previewValue) && previewValue.includes('internal'));
  const internalPreview =
    process.env.NODE_ENV !== 'production' && wantsInternalPreview;

  return (
    <>
      <JsonLd
        id={`story-${story.slug}-article-jsonld`}
        data={articleJsonLd({
          title: story.title,
          description: story.summary,
          path: `/stories/${story.slug}`,
          image: story.hero.media.poster || story.hero.media.src,
        })}
      />
      <JsonLd
        id={`story-${story.slug}-breadcrumb-jsonld`}
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Stories', path: '/stories' },
          { name: story.title, path: `/stories/${story.slug}` },
        ])}
      />
      <StoryScroll story={story} internalPreview={internalPreview} />
    </>
  );
}
