import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { JsonLd } from '@/components/seo/JsonLd';
import { StoryScroll } from '@/components/stories/StoryScroll';
import { articleJsonLd, breadcrumbJsonLd, pageMetadata } from '@/lib/seo/site';
import { getStoryPacket, storyPackets } from '@/lib/stories/story-packets';

interface StoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export function generateStaticParams() {
  return storyPackets.map((story) => ({ slug: story.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const story = getStoryPacket(slug);

  if (!story) return {};

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

export default async function StoryPage({ params, searchParams }: StoryPageProps) {
  const { slug } = await params;
  const query = await searchParams;
  const story = getStoryPacket(slug);

  if (!story) {
    notFound();
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
