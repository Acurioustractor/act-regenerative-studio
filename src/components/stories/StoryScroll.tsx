import Image from 'next/image';
import Link from 'next/link';

import { NewsletterCTA } from '@/components/forms/NewsletterCTA';
import { SiteLoopVideo } from '@/components/media/SiteLoopVideo';
import featuredSnapshot from '@/data/empathy-ledger-featured.generated.json';
import type { StoryBlock, StoryMedia, StoryPacket } from '@/lib/stories/story-packets';

interface StoryScrollProps {
  story: StoryPacket;
  internalPreview?: boolean;
}

interface FeaturedMediaItem {
  id: string;
  url?: string;
  thumbnail_url?: string | null;
  preview_url?: string | null;
  kind?: string;
  type?: string;
  title?: string | null;
  alt?: string | null;
  caption?: string | null;
}

interface FeaturedProjectBlock {
  media?: {
    items?: FeaturedMediaItem[];
  };
}

const snapshot = featuredSnapshot as {
  projects?: Record<string, FeaturedProjectBlock | null>;
};

function mediaIsVideo(media: StoryMedia) {
  return media.kind === 'video' || /\.(mp4|webm|mov)$/i.test(media.src);
}

function isImageUrl(url: string | null | undefined) {
  return Boolean(url && /\.(jpe?g|png|webp|gif)(\?|#|$)/i.test(url));
}

function isVideoUrl(url: string | null | undefined) {
  return Boolean(url && /\.(mp4|webm|mov)(\?|#|$)/i.test(url));
}

function mediaImageSource(item: FeaturedMediaItem) {
  if (isImageUrl(item.thumbnail_url)) return item.thumbnail_url;
  if (isImageUrl(item.preview_url)) return item.preview_url;
  if (isImageUrl(item.url)) return item.url;
  return null;
}

function StoryMediaFrame({
  media,
  fill = false,
  className = '',
  priority = false,
}: {
  media: StoryMedia;
  fill?: boolean;
  className?: string;
  priority?: boolean;
}) {
  if (mediaIsVideo(media)) {
    return (
      <SiteLoopVideo
        src={media.src}
        poster={media.poster}
        title={media.title || media.alt}
        className={className || 'h-full w-full object-cover'}
        preload="metadata"
      />
    );
  }

  if (fill) {
    return (
      <Image
        src={media.src}
        alt={media.alt}
        fill
        sizes="100vw"
        priority={priority}
        className={className || 'object-cover'}
      />
    );
  }

  return (
    <Image
      src={media.src}
      alt={media.alt}
      width={1200}
      height={800}
      className={className || 'h-auto w-full object-cover'}
    />
  );
}

function isPublicBlock(block: StoryBlock, internalPreview: boolean) {
  return internalPreview || block.visibility !== 'internal';
}

function cleanAlt(value: string | null | undefined, fallback: string) {
  if (!value) return fallback;
  const cleaned = value
    .replace(/^Image:\s*/i, '')
    .replace(/^Video:\s*/i, '')
    .trim();
  if (!cleaned) return fallback;
  if (/^[\w().\-\s]+?\.(jpe?g|png|webp|gif|mp4|mov|webm)$/i.test(cleaned)) {
    return fallback;
  }
  if (/^(img|image|video|file|photo)[-_ ]?\d+/i.test(cleaned)) {
    return fallback;
  }
  return cleaned;
}

function getSnapshotMedia(sourceProjectSlug: string, kind: 'image' | 'video', limit = 6) {
  const items = snapshot.projects?.[sourceProjectSlug]?.media?.items || [];
  return items
    .filter((item) => item.url || item.thumbnail_url || item.preview_url)
    .filter((item) => {
      const itemKind = item.kind || item.type || '';
      const mediaUrl = item.url || item.thumbnail_url || item.preview_url || '';
      return kind === 'image'
        ? isImageUrl(item.url) || isImageUrl(item.thumbnail_url) || isImageUrl(item.preview_url)
        : itemKind === 'video' || itemKind.startsWith('video') || isVideoUrl(mediaUrl);
    })
    .slice(0, limit);
}

function BlockView({
  block,
  story,
  internalPreview,
}: {
  block: StoryBlock;
  story: StoryPacket;
  internalPreview: boolean;
}) {
  if (!isPublicBlock(block, internalPreview)) return null;

  switch (block.kind) {
    case 'read':
      return (
        <section className="px-6 py-20 md:px-10 md:py-28">
          <div className="mx-auto grid max-w-[1120px] gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
            <div>
              {block.eyebrow ? (
                <p className="font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.3em] text-clay-text">
                  {block.eyebrow}
                </p>
              ) : null}
              {block.title ? (
                <h2 className="mt-4 font-[var(--font-display)] text-[clamp(2rem,4vw,3.2rem)] font-light leading-[1.1] text-[var(--site-ink)]">
                  {block.title}
                </h2>
              ) : null}
            </div>
            <div className="space-y-5">
              {block.paragraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  className="font-[var(--font-body)] text-[17px] leading-[1.8] text-[var(--site-muted)]"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          {block.media ? (
            <div className="mx-auto mt-12 max-w-[1120px] overflow-hidden rounded-[var(--site-radius)]">
              <div className="relative aspect-[16/9] bg-[var(--site-dark)]">
                <StoryMediaFrame media={block.media} fill className="object-cover" />
              </div>
            </div>
          ) : null}
        </section>
      );

    case 'stats':
      return (
        <section className="bg-[var(--site-surface)] px-6 py-20 md:px-10 md:py-28">
          <div className="mx-auto max-w-[1120px]">
            <p className="font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.3em] text-clay-text">
              Field proof
            </p>
            <h2 className="mt-4 font-[var(--font-display)] text-[clamp(2rem,4vw,3rem)] font-light leading-[1.1] text-[var(--site-ink)]">
              {block.title}
            </h2>
            {block.description ? (
              <p className="mt-6 max-w-2xl font-[var(--font-body)] text-lg leading-[1.8] text-[var(--site-muted)]">
                {block.description}
              </p>
            ) : null}
            <div className="mt-12 grid gap-px overflow-hidden rounded-[var(--site-radius)] bg-[var(--site-line)] md:grid-cols-4">
              {block.items.map((item) => (
                <div key={`${item.value}-${item.label}`} className="bg-[var(--site-bg)] p-8">
                  <p className="font-[var(--font-display)] text-4xl font-light text-[var(--site-green)]">
                    {item.value}
                  </p>
                  <p className="mt-3 font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--site-muted)]">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case 'immersive':
      return (
        <section className="full-bleed relative min-h-[82vh] overflow-hidden bg-[var(--site-dark)]">
          <StoryMediaFrame
            media={block.media}
            fill
            className="h-full w-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--site-dark)] via-[var(--site-dark)]/55 to-[var(--site-dark)]/10" />
          <div className="relative z-10 mx-auto flex min-h-[82vh] max-w-[1120px] flex-col justify-end px-8 pb-20 pt-40">
            {block.eyebrow ? (
              <p className="font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.3em] text-clay-text">
                {block.eyebrow}
              </p>
            ) : null}
            <h2 className="mt-4 max-w-[14ch] font-[var(--font-display)] text-[clamp(2.8rem,6vw,5.2rem)] font-light leading-[1.05] text-[#FAFAF7]">
              {block.title}
            </h2>
            {block.body ? (
              <p className="mt-6 max-w-xl font-[var(--font-body)] text-lg leading-[1.8] text-[#FAFAF7]/70">
                {block.body}
              </p>
            ) : null}
          </div>
        </section>
      );

    case 'pullquote':
      return (
        <section className="bg-[var(--site-dark)] px-6 py-20 md:px-10 md:py-28">
          <div className="mx-auto max-w-[820px] border-l-4 border-[var(--site-clay)] pl-8 md:pl-12">
            {block.consentLabel ? (
              <p className="mb-5 font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.3em] text-clay-text">
                {block.consentLabel}
              </p>
            ) : null}
            <blockquote className="font-[var(--font-display)] text-[clamp(1.8rem,4vw,3.2rem)] font-light italic leading-[1.25] text-[#FAFAF7]">
              {block.quote}
            </blockquote>
            {block.attribution ? (
              <p className="mt-8 font-[var(--font-sans)] text-[12px] font-semibold uppercase tracking-[0.24em] text-[#FAFAF7]/50">
                {block.attribution}
              </p>
            ) : null}
          </div>
        </section>
      );

    case 'voices':
      return (
        <section className="px-6 py-20 md:px-10 md:py-28">
          <div className="mx-auto max-w-[1120px]">
            <p className="font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.3em] text-clay-text">
              Voice layer
            </p>
            <h2 className="mt-4 font-[var(--font-display)] text-[clamp(2rem,4vw,3rem)] font-light leading-[1.1] text-[var(--site-ink)]">
              {block.title}
            </h2>
            {block.description ? (
              <p className="mt-6 max-w-2xl font-[var(--font-body)] text-lg leading-[1.8] text-[var(--site-muted)]">
                {block.description}
              </p>
            ) : null}
            <div className="mt-12 grid gap-5 md:grid-cols-2">
              {block.voices
                .filter((voice) => internalPreview || voice.consent === 'cleared')
                .map((voice) => (
                  <article
                    key={`${voice.who}-${voice.quote}`}
                    className="rounded-[var(--site-radius)] border border-[var(--site-line)] bg-[var(--site-bg)] p-7"
                  >
                    <p className="font-[var(--font-display)] text-2xl font-light italic leading-[1.35] text-[var(--site-ink)]">
                      {voice.quote}
                    </p>
                    <p className="mt-6 font-[var(--font-sans)] text-[12px] font-semibold uppercase tracking-[0.22em] text-[var(--site-muted)]">
                      {voice.who}
                      {voice.community ? ` / ${voice.community}` : ''}
                    </p>
                    <p className="mt-2 text-xs uppercase tracking-[0.2em] text-clay-text">
                      Consent: {voice.consent}
                    </p>
                  </article>
                ))}
            </div>
          </div>
        </section>
      );

    case 'el-gallery': {
      const items = getSnapshotMedia(block.sourceProjectSlug, 'image', block.limit || 6);
      return (
        <section className="bg-[#F6F1E7] px-6 py-20 md:px-10 md:py-28">
          <div className="mx-auto max-w-[1220px]">
            <p className="font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.3em] text-clay-text">
              Empathy Ledger media
            </p>
            <h2 className="mt-4 font-[var(--font-display)] text-[clamp(2rem,4vw,3rem)] font-light leading-[1.1] text-[var(--site-ink)]">
              {block.title}
            </h2>
            {block.description ? (
              <p className="mt-6 max-w-2xl font-[var(--font-body)] text-lg leading-[1.8] text-[var(--site-muted)]">
                {block.description}
              </p>
            ) : null}
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {items.map((item) => {
                const src = mediaImageSource(item);
                if (!src) return null;

                return (
                  <figure
                    key={item.id}
                    className="overflow-hidden rounded-[var(--site-radius)] bg-[#11110F]"
                  >
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={src}
                        alt={cleanAlt(item.alt, item.title || story.title)}
                        fill
                        sizes="(min-width: 1024px) 33vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                    {item.caption ? (
                      <figcaption className="p-4 text-sm leading-6 text-[#F3EBDD]/80">
                        {item.caption}
                      </figcaption>
                    ) : null}
                  </figure>
                );
              })}
            </div>
          </div>
        </section>
      );
    }

    case 'el-video-gallery': {
      const items = getSnapshotMedia(block.sourceProjectSlug, 'video', block.limit || 3);
      return (
        <section className="bg-[var(--site-dark)] px-6 py-20 text-[#FAFAF7] md:px-10 md:py-28">
          <div className="mx-auto max-w-[1120px]">
            <p className="font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.3em] text-clay-text">
              Empathy Ledger video
            </p>
            <h2 className="mt-4 font-[var(--font-display)] text-[clamp(2rem,4vw,3rem)] font-light leading-[1.1]">
              {block.title}
            </h2>
            {block.description ? (
              <p className="mt-6 max-w-2xl font-[var(--font-body)] text-lg leading-[1.8] text-[#FAFAF7]/60">
                {block.description}
              </p>
            ) : null}
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {items.map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group overflow-hidden rounded-[var(--site-radius)] border border-[#4A3B2E] bg-[#171612]"
                >
                  <div className="relative aspect-video bg-[#11110F]">
                    {mediaImageSource(item) ? (
                      <Image
                        src={mediaImageSource(item) || ''}
                        alt={cleanAlt(item.alt, item.title || story.title)}
                        fill
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        className="object-cover opacity-80 transition group-hover:scale-[1.02]"
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <span className="absolute bottom-4 left-4 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white backdrop-blur-sm">
                      Open video
                    </span>
                  </div>
                  <div className="p-5">
                    <p className="font-[var(--font-display)] text-xl font-semibold text-[#F3EBDD]">
                      {item.title || 'Empathy Ledger video'}
                    </p>
                  </div>
                </a>
              ))}
              {items.length === 0 ? (
                <div className="rounded-[var(--site-radius)] border border-[#4A3B2E] bg-[#171612] p-6 text-sm leading-7 text-[#D7C8B2]">
                  No public videos are available for this story slot yet. Once
                  the matching Empathy Ledger media is cleared, this block can
                  render without a page redesign.
                </div>
              ) : null}
            </div>
          </div>
        </section>
      );
    }

    case 'before-after':
      return (
        <section className="px-6 py-20 md:px-10 md:py-28">
          <div className="mx-auto max-w-[1120px]">
            <p className="font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.3em] text-clay-text">
              Before and after
            </p>
            <h2 className="mt-4 font-[var(--font-display)] text-[clamp(2rem,4vw,3rem)] font-light leading-[1.1] text-[var(--site-ink)]">
              {block.title}
            </h2>
            {block.description ? (
              <p className="mt-6 max-w-2xl font-[var(--font-body)] text-lg leading-[1.8] text-[var(--site-muted)]">
                {block.description}
              </p>
            ) : null}
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {[block.before, block.after].map((item) => (
                <figure key={item.label} className="overflow-hidden rounded-[var(--site-radius)] border border-[var(--site-line)] bg-white">
                  <div className="relative aspect-[4/3]">
                    <StoryMediaFrame media={item} fill className="object-cover" />
                  </div>
                  <figcaption className="p-5 font-[var(--font-sans)] text-[12px] font-semibold uppercase tracking-[0.24em] text-[var(--site-muted)]">
                    {item.label}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      );

    case 'wiki-links':
      return (
        <section className="bg-[var(--site-surface)] px-6 py-20 md:px-10 md:py-28">
          <div className="mx-auto max-w-[1120px]">
            <p className="font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.3em] text-clay-text">
              Source trail
            </p>
            <h2 className="mt-4 font-[var(--font-display)] text-[clamp(2rem,4vw,3rem)] font-light leading-[1.1] text-[var(--site-ink)]">
              {block.title}
            </h2>
            {block.description ? (
              <p className="mt-6 max-w-2xl font-[var(--font-body)] text-lg leading-[1.8] text-[var(--site-muted)]">
                {block.description}
              </p>
            ) : null}
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {block.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-[var(--site-radius)] border border-[var(--site-line)] bg-[var(--site-bg)] p-6 transition hover:-translate-y-0.5 hover:border-[var(--site-green)]"
                >
                  <h3 className="font-[var(--font-display)] text-xl font-semibold text-[var(--site-ink)]">
                    {link.label}
                  </h3>
                  {link.note ? (
                    <p className="mt-3 text-sm leading-7 text-[var(--site-muted)]">
                      {link.note}
                    </p>
                  ) : null}
                </Link>
              ))}
            </div>
          </div>
        </section>
      );

    case 'newsletter':
      return (
        <section className="px-6 py-16 md:px-10 md:py-20">
          <div className="mx-auto max-w-[1120px]">
            <NewsletterCTA
              title={block.title}
              description={block.description}
              projectCode={story.projectCode}
              projectSlug={story.projectSlug}
              storySlug={story.slug}
              source={block.source}
              audience={block.audience}
              additionalTags={story.tags.map((tag) => `Story tag: ${tag}`)}
            />
          </div>
        </section>
      );

    case 'close':
      return (
        <section className="full-bleed relative min-h-[78vh] overflow-hidden bg-[var(--site-dark)]">
          <StoryMediaFrame media={block.media} fill className="h-full w-full object-cover opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--site-dark)] via-[var(--site-dark)]/60 to-[var(--site-dark)]/15" />
          <div className="relative z-10 mx-auto flex min-h-[78vh] max-w-[1120px] flex-col justify-end px-8 pb-20 pt-40">
            <h2 className="max-w-[18ch] font-[var(--font-display)] text-[clamp(2.4rem,5vw,4.6rem)] font-light leading-[1.05] text-[#FAFAF7]">
              {block.title}
            </h2>
            {block.description ? (
              <p className="mt-6 max-w-xl font-[var(--font-body)] text-lg leading-[1.8] text-[#FAFAF7]/70">
                {block.description}
              </p>
            ) : null}
            {block.links ? (
              <div className="mt-10 flex flex-wrap gap-4">
                {block.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-[var(--site-radius)] border border-[#FAFAF7]/30 px-6 py-3 font-[var(--font-sans)] text-[12px] font-semibold uppercase tracking-[0.18em] text-[#FAFAF7] transition hover:border-[#FAFAF7]/70"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </section>
      );

    default:
      return null;
  }
}

export function StoryScroll({ story, internalPreview = false }: StoryScrollProps) {
  return (
    <>
      {internalPreview ? (
        <div className="fixed inset-x-0 top-0 z-[90] bg-[#8B5E34] px-4 py-2 text-center font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.24em] text-white">
          Internal preview. Consent-pending content may be visible locally.
        </div>
      ) : null}

      <section className="full-bleed relative flex min-h-[100vh] flex-col justify-end overflow-hidden bg-[var(--site-dark)]">
        <div className="absolute inset-0">
          <StoryMediaFrame
            media={story.hero.media}
            fill
            priority
            className="h-full w-full object-cover animate-[slowZoom_30s_ease-in-out_infinite_alternate]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--site-dark)] via-[var(--site-dark)]/55 to-[var(--site-dark)]/15" />
        </div>
        <div className="relative z-10 mx-auto w-full max-w-[1200px] px-8 pb-24 pt-40 md:pb-32">
          <p className="font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.35em] text-clay-text">
            {story.hero.eyebrow}
          </p>
          <h1 className="mt-4 max-w-[13ch] font-[var(--font-display)] text-[clamp(3rem,7vw,5.5rem)] font-light leading-[1.05] text-[#FAFAF7]">
            {story.hero.title}
          </h1>
          <p className="mt-6 max-w-xl font-[var(--font-body)] text-lg leading-[1.8] text-[#FAFAF7]/75">
            {story.hero.subhead}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            {story.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[#FAFAF7]/20 bg-[#FAFAF7]/8 px-3 py-1 font-[var(--font-sans)] text-[10px] font-semibold uppercase tracking-[0.22em] text-[#FAFAF7]/75"
              >
                {tag}
              </span>
            ))}
          </div>
          <p className="mt-8 max-w-2xl font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.22em] text-[#FAFAF7]/45">
            {story.dateline}
          </p>
        </div>
      </section>

      {story.status !== 'published' ? (
        <section className="bg-[#F6F1E7] px-6 py-6 md:px-10">
          <div className="mx-auto max-w-[1120px] rounded-[var(--site-radius)] border border-[#D7C4A2] bg-[#FFF8EA] p-5 text-sm leading-7 text-[#5A4A3A]">
            This is a consent-safe public preview. Names, faces, and voice clips
            that still need review are hidden from the public route.
          </div>
        </section>
      ) : null}

      {story.blocks.map((block, index) => (
        <BlockView
          key={`${block.kind}-${index}`}
          block={block}
          story={story}
          internalPreview={internalPreview}
        />
      ))}
    </>
  );
}
