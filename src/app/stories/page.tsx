import Image from 'next/image';
import Link from 'next/link';

import { NewsletterCTA } from '@/components/forms/NewsletterCTA';
import { getSiteEditorialArticles } from '@/lib/empathy-ledger-editorial';
import { pageMetadata } from '@/lib/seo/site';
import { storyPackets } from '@/lib/stories/story-packets';

export const metadata = pageMetadata({
  title: 'Stories',
  description:
    'Immersive ACT field stories, consent-aware media, and article writing connected to Empathy Ledger, the wiki, and the live project portfolio.',
  path: '/stories',
  image: {
    url: '/media/field-stills/goods-remote-aerial.jpg',
    alt: 'Goods on Country field site viewed from above',
  },
});

export const revalidate = 60;

export default async function StoriesPage() {
  const articles = await getSiteEditorialArticles(6).catch(() => []);
  const primaryStory = storyPackets[0];

  return (
    <div className="space-y-16 pb-24">
      <section className="full-bleed relative min-h-[82vh] overflow-hidden bg-[#11110F]">
        {primaryStory?.hero.media.poster ? (
          <Image
            src={primaryStory.hero.media.poster}
            alt={primaryStory.hero.media.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-75"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-[#11110F] via-[#11110F]/65 to-[#11110F]/15" />
        <div className="relative z-10 mx-auto flex min-h-[82vh] max-w-[1180px] flex-col justify-end px-6 pb-20 pt-40 md:px-10 md:pb-28">
          <p className="font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.35em] text-[#CFA16B]">
            ACT stories
          </p>
          <h1 className="mt-5 max-w-[12ch] font-[var(--font-display)] text-[clamp(3rem,7vw,5.7rem)] font-light leading-[1.02] text-[#F3EBDD]">
            Field stories with consent at the centre.
          </h1>
          <p className="mt-6 max-w-2xl font-[var(--font-body)] text-lg leading-[1.8] text-[#F3EBDD]/75">
            This is the public story layer for ACT. Immersive stories live here,
            article writing stays available in the blog archive, and every future
            photo, voice, and attribution should clear through Empathy Ledger
            before it travels.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            {primaryStory ? (
              <Link
                href={`/stories/${primaryStory.slug}`}
                className="rounded-full bg-[#CFA16B] px-7 py-3 font-[var(--font-sans)] text-[12px] font-semibold uppercase tracking-[0.22em] text-[#11110F] transition hover:bg-[#E0B680]"
              >
                Read first story
              </Link>
            ) : null}
            <Link
              href="/blog"
              className="rounded-full border border-[#F3EBDD]/35 px-7 py-3 font-[var(--font-sans)] text-[12px] font-semibold uppercase tracking-[0.22em] text-[#F3EBDD] transition hover:border-[#F3EBDD]/70"
            >
              Open blog archive
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-10">
        <div className="mx-auto max-w-[1180px]">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--site-clay)]">
                Immersive story packets
              </p>
              <h2 className="mt-3 font-[var(--font-display)] text-[clamp(2rem,4vw,3.1rem)] font-light leading-[1.1] text-[var(--site-ink)]">
                Built for proof, media, voice, and source trails.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-[var(--site-muted)]">
              Story packets can hold a masthead, read, immersive media,
              pullquotes, consent-aware voices, Empathy Ledger galleries,
              before and after proof, wiki links, and a close.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {storyPackets.map((story) => (
              <Link
                key={story.slug}
                href={`/stories/${story.slug}`}
                className="group overflow-hidden rounded-[28px] border border-[var(--site-line)] bg-[#11110F] text-[#F3EBDD] transition hover:-translate-y-1 hover:border-[#CFA16B]"
              >
                <div className="relative aspect-[16/10] bg-[#171612]">
                  {story.hero.media.poster ? (
                    <Image
                      src={story.hero.media.poster}
                      alt={story.hero.media.alt}
                      fill
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="object-cover opacity-80 transition duration-700 group-hover:scale-[1.03]"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                  <span className="absolute left-5 top-5 rounded-full border border-white/20 bg-white/10 px-3 py-1 font-[var(--font-sans)] text-[10px] font-semibold uppercase tracking-[0.22em] text-white backdrop-blur-sm">
                    {story.status === 'published' ? 'Published' : 'Consent-safe preview'}
                  </span>
                </div>
                <div className="space-y-4 p-6 md:p-8">
                  <p className="font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.3em] text-[#CFA16B]">
                    {story.projectCode}
                  </p>
                  <h3 className="font-[var(--font-display)] text-3xl font-light leading-tight">
                    {story.title}
                  </h3>
                  <p className="text-sm leading-7 text-[#D7C8B2]">{story.summary}</p>
                  <div className="flex flex-wrap gap-2">
                    {story.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/15 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white/65"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-10">
        <div className="mx-auto max-w-[1180px]">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--site-clay)]">
              Blog archive
              </p>
              <h2 className="mt-3 font-[var(--font-display)] text-[clamp(1.8rem,3vw,2.6rem)] font-light leading-[1.15] text-[var(--site-ink)]">
                Article writing stays connected.
              </h2>
            </div>
            <Link
              href="/blog"
              className="rounded-full border border-[var(--site-green)] px-5 py-3 font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--site-green)] transition hover:bg-[#E5F4E4]"
            >
              Open blog archive
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {articles.slice(0, 3).map((article) => (
              <Link
                key={article.slug}
                href={article.localPath}
                className="group overflow-hidden rounded-[24px] border border-[var(--site-line)] bg-white transition hover:-translate-y-0.5 hover:border-[var(--site-green)]"
              >
                <div className="relative aspect-[16/10] bg-[#F6F1E7]">
                  {article.featuredImageUrl ? (
                    <Image
                      src={article.featuredImageUrl}
                      alt={article.featuredImageAlt || article.title}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover"
                    />
                  ) : null}
                </div>
                <div className="space-y-3 p-5">
                  <p className="font-[var(--font-sans)] text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--site-clay)]">
                    {article.articleType || 'Editorial'}
                  </p>
                  <h3 className="font-[var(--font-display)] text-xl font-semibold leading-tight text-[var(--site-ink)]">
                    {article.title}
                  </h3>
                  {article.excerpt ? (
                    <p className="line-clamp-3 text-sm leading-7 text-[var(--site-muted)]">
                      {article.excerpt}
                    </p>
                  ) : null}
                </div>
              </Link>
            ))}
            {articles.length === 0 ? (
              <div className="rounded-[24px] border border-[var(--site-line)] bg-white p-6 text-sm leading-7 text-[var(--site-muted)]">
                No public articles are available from Empathy Ledger yet. The
                immersive story layer and project pages still carry the launch
                story system.
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-10">
        <div className="mx-auto max-w-[1180px]">
          <NewsletterCTA
            title="Follow new field stories"
            description="Get new ACT stories, project notes, and consent-cleared media as they move from Empathy Ledger into the public site."
            source="stories-index"
            audience="story-reader"
            additionalTags={['Stories index']}
          />
        </div>
      </section>
    </div>
  );
}
