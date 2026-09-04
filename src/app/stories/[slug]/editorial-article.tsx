import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import { JsonLd } from "@/components/seo/JsonLd";
import { EditorialHeader } from "@/components/prototypes/EditorialHeader";
import {
  getSiteEditorialArticles,
  type EditorialArticle,
} from "@/lib/empathy-ledger-editorial";
import { articleJsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo/site";
import {
  cleanAltText,
  prepareArticleHtml,
  readingTimeMinutes,
} from "@/lib/editorial/article-html";
import { formatArticleType } from "@/lib/editorial/article-type";
import { articleDateTime, formatArticleDate } from "@/lib/editorial/format-date";
import { ReadingProgress } from "@/components/editorial/ReadingProgress";
import { ArticleGallery } from "@/components/editorial/ArticleGallery";
import { RichTextMedia } from "@/components/editorial/RichTextMedia";
import { ArticleHeroMedia } from "@/components/editorial/ArticleHeroMedia";
import { SuggestedCardImage } from "@/components/editorial/SuggestedCardImage";
import {
  fieldsForArticle,
  projectSlugDestination,
  relatedArticles,
} from "@/lib/fields/field-graph";
import { livingFieldsById } from "@/data/living-field";

/**
 * The editorial article reader, served at /stories/[slug] since the route
 * unification (2026-08-07; previously /blog/[slug]). The page decides whether
 * a slug is an authored story packet or an editorial article; this component
 * only ever renders the article branch, so it carries the EditorialHeader the
 * old /blog layout provided.
 */

export function editorialArticleMetadata(post: EditorialArticle): Metadata {
  return pageMetadata({
    title: post.title,
    description:
      post.excerpt || "ACT writing carried with consent through Empathy Ledger.",
    path: `/stories/${post.slug}`,
    type: "article",
    // These articles are syndicated from Empathy Ledger, which holds the master
    // copy. Point the canonical at the source so search engines attribute it
    // there instead of treating /stories as duplicate content.
    canonicalUrl: post.canonicalUrl,
    image: post.featuredImageUrl
      ? {
          url: post.featuredImageUrl,
          alt: post.featuredImageAlt || post.title,
        }
      : undefined,
  });
}

function shortLede(raw: string | null): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  // Keep the first sentence, cap at roughly 180 chars so the hero stays tight.
  const firstSentence = trimmed.split(/(?<=[.!?])\s/)[0] || trimmed;
  if (firstSentence.length <= 200) return firstSentence;
  return firstSentence.slice(0, 180).replace(/[,\s]+\S*$/, "") + "…";
}

/*
 * The date in the meta line is real. Until 2026-09-05 nothing was printed
 * here, for the reason recorded in FieldWriting: the feed carried the import
 * day as every article's publishedAt, and until 2026-08-07 this reader had put
 * that timestamp under five unrelated headlines as "January 2026". The real
 * dates were written back into Empathy Ledger from the import metadata on
 * 2026-09-05, and field-graph.test.ts now fails if they ever collapse again.
 */

export async function EditorialArticleReader({
  post,
}: {
  post: EditorialArticle;
}) {
  const content = post.content || "";
  const looksLikeHtml = /<\/?[a-z][\s\S]*>/i.test(content);
  const preparedHtml = looksLikeHtml ? prepareArticleHtml(content) : null;
  const readingMinutes = readingTimeMinutes(content);
  const lede = shortLede(post.excerpt);

  // Related project slugs resolved to the field pages that absorbed them.
  // Deduplicated, since several projects can land on the same field.
  // Every field the article belongs to, not just the ones its project slugs
  // imply: fieldsForArticle also picks up the curated assignments, so a piece
  // tagged justicehub upstream and art by hand shows both.
  const connectedFields = [
    ...new Map(
      [
        ...fieldsForArticle(post).map((fieldId) => ({
          href: `/fields/${fieldId}`,
          label: livingFieldsById[fieldId].name,
        })),
        ...post.relatedProjectSlugs
          .map(projectSlugDestination)
          .filter((d): d is { href: string; label: string } => Boolean(d)),
      ].map((destination) => [destination.href, destination]),
    ).values(),
  ];

  // Gallery photos = everything from EL media except the featured image (which
  // already runs at the top as the hero) and duplicates. The sync writes alt
  // text under alt_text (older shapes used alt), and most of it is Webflow
  // filename junk — cleanAltText decides whether any of it is a real
  // description.
  const gallery = (post.media?.photoPreviews || [])
    .filter((photo) => !!photo.url && photo.url !== post.featuredImageUrl)
    .slice(0, 8)
    .map((photo) => ({
      url: photo.url,
      alt: cleanAltText(photo.alt ?? photo.alt_text ?? photo.title),
      caption: photo.caption ?? null,
    }));

  // Suggested reading, related first.
  //
  // This used to be "the 3 most recent articles that have a featured image",
  // which meant every article on the site recommended the same three pieces
  // regardless of subject. relatedArticles ranks by shared field first and
  // shared storyteller second, so a justice piece now leads to justice pieces.
  //
  // Recent articles still top the list up to three when a piece has few or no
  // relations, because an empty grid here would be a worse page than a loosely
  // relevant one. Images are preferred within each group so the cards render.
  const allArticles: EditorialArticle[] = await getSiteEditorialArticles(40).catch(
    () => [] as EditorialArticle[]
  );
  const withImagesFirst = (list: EditorialArticle[]) => [
    ...list.filter((a) => !!a.featuredImageUrl),
    ...list.filter((a) => !a.featuredImageUrl),
  ];
  const related = withImagesFirst(relatedArticles(post, 6));
  const relatedSlugs = new Set(related.map((a) => a.slug));
  const filler = withImagesFirst(
    allArticles.filter((a) => a.slug !== post.slug && !relatedSlugs.has(a.slug))
  );
  const suggested = [...related, ...filler].slice(0, 3);

  return (
    <>
      <EditorialHeader />
      <JsonLd
        id={`editorial-${post.slug}-article-jsonld`}
        data={articleJsonLd({
          title: post.title,
          description: post.excerpt || 'ACT writing carried with consent through Empathy Ledger.',
          path: `/stories/${post.slug}`,
          image: post.featuredImageUrl,
          authorName: post.authorName,
          publishedAt: post.publishedAt,
        })}
      />
      <JsonLd
        id={`editorial-${post.slug}-breadcrumb-jsonld`}
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Stories', path: '/stories' },
          { name: post.title, path: `/stories/${post.slug}` },
        ])}
      />
      <ReadingProgress />
      {/* HERO: full-bleed image with title + meta overlay. The typographic
          cover behind it carries any article whose photograph is absent or
          dead; see ArticleHeroMedia. */}
      <section className="full-bleed relative min-h-[60vh] w-full overflow-hidden bg-[#11110F] md:min-h-[75vh]">
        <ArticleHeroMedia
          imageUrl={post.featuredImageUrl ?? null}
          alt={post.featuredImageAlt ?? post.title}
          initial={post.title.charAt(0)}
        />
        <div className="relative z-10 mx-auto flex min-h-[60vh] max-w-[1000px] flex-col justify-end px-6 pb-16 pt-32 md:min-h-[75vh] md:px-10 md:pb-24 md:pt-40">
          {/* The "All stories" link used to sit here, above the title. It was
              the topmost text in the hero and so the least covered by the
              scrim, and it measured 1.58 to 4.18 against a photograph where
              small text needs 4.5 (five heroes sampled by rendered pixel,
              2026-08-07). No scrim opacity fixes it: the label is clay-gold,
              a mid tone, so it needs a backdrop near solid black to clear AA,
              and that is a slab over the photograph rather than a scrim.
              It now sits below the hero on a solid surface, where the contrast
              is deterministic and the existing gate can actually see it. */}
          <h1 className="font-[var(--font-display)] text-[clamp(2.2rem,5vw,4.2rem)] font-light leading-[1.08] text-[#F3EBDD]">
            {post.title}
          </h1>
          {lede ? (
            <p className="mt-6 max-w-[680px] font-[var(--font-body)] text-[17px] italic leading-[1.65] text-[#E0D4B9] md:text-[19px]">
              {lede}
            </p>
          ) : null}
          <div className="mt-8 flex flex-wrap items-center gap-5 font-[var(--font-sans)] text-[11px] uppercase tracking-[0.22em] text-[#CFA16B]/90">
            {post.authorName ? <span>{post.authorName}</span> : null}
            {formatArticleType(post.articleType) ? (
              <>
                <span aria-hidden="true" className="text-[#CFA16B]/40">·</span>
                <span>{formatArticleType(post.articleType)}</span>
              </>
            ) : null}
            {formatArticleDate(post.publishedAt) ? (
              <>
                <span aria-hidden="true" className="text-[#CFA16B]/40">·</span>
                <time dateTime={articleDateTime(post.publishedAt) ?? undefined}>
                  {formatArticleDate(post.publishedAt)}
                </time>
              </>
            ) : null}
            {readingMinutes ? (
              <>
                <span aria-hidden="true" className="text-[#CFA16B]/40">·</span>
                <span>{readingMinutes} min read</span>
              </>
            ) : null}
          </div>
        </div>
      </section>

      {/* Return path, on the body's solid surface rather than over the
          photograph. Forest green on #FBF6EC, the pairing the rest of the site
          uses for links, rather than the clay-gold that only worked on dark. */}
      <nav
        aria-label="Breadcrumb"
        className="border-b border-[var(--we-sand)] bg-[#FBF6EC] px-6 pt-8 md:px-10"
      >
        <Link
          href="/stories"
          className="mx-auto flex max-w-[720px] items-center gap-2 pb-8 font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.3em] text-forest transition-all hover:gap-3"
        >
          <span aria-hidden="true">&larr;</span> All stories
        </Link>
      </nav>

      {/* BODY: long-form article in a readable measure.
          full-bleed because main > section is capped at 1200px and centred, so
          without it the reading surface paints #FBF6EC inside that cap and the
          body's #FAFAF7 shows as a pale band down both edges. The measure is
          held by the inner max-w-[720px], not by the section width. */}
      <section className="full-bleed bg-[#FBF6EC] px-6 py-20 md:px-10 md:py-28">
        <article className="mx-auto max-w-[720px]">
          {content ? (
            preparedHtml ? (
              // Most of the corpus is exported HTML, and most of the dead
              // photographs live inside it. RichTextMedia carries the .rich-text
              // class the CSS keys off, so the wrapper div that used to sit
              // outside it would now be a second, redundant .rich-text.
              <RichTextMedia html={preparedHtml} />
            ) : (
              <div className="rich-text">
                <ReactMarkdown>{content}</ReactMarkdown>
              </div>
            )
          ) : (
            <p className="font-[var(--font-body)] italic text-[var(--we-warm-brown)]">
              This story has no public body yet. Its media, project links, and
              source record remain connected through Empathy Ledger.
            </p>
          )}
        </article>
      </section>

      {/* GALLERY: field photographs. Most of these URLs are dead upstream, so
          the component drops what fails and hides itself when nothing loads. */}
      <ArticleGallery photos={gallery} articleTitle={post.title} />


      {/* AUTHOR + CONNECTED FIELDS. full-bleed for the same reason as the body. */}
      <section className="full-bleed bg-[#FBF6EC] px-6 py-16 md:px-10 md:py-20">
        <div className="mx-auto max-w-[720px] space-y-8">
          {post.authorName ? (
            <div className="flex items-center gap-4 border-t border-[var(--we-sand)] pt-8">
              {post.storyteller?.avatarUrl ? (
                <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-full ring-2 ring-[var(--we-sand)]">
                  <Image
                    src={post.storyteller.avatarUrl}
                    alt={post.authorName}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
              ) : null}
              <div>
                <p className="font-[var(--font-sans)] text-[10px] uppercase tracking-[0.3em] text-[var(--we-warm-brown)]">
                  Written by
                </p>
                <p className="mt-1 font-[var(--font-display)] text-xl font-semibold text-[var(--we-olive)]">
                  {post.authorName}
                </p>
                {post.authorBio ? (
                  <p className="mt-2 font-[var(--font-body)] text-sm leading-[1.7] text-[var(--we-brown)]">
                    {post.authorBio}
                  </p>
                ) : null}
              </div>
            </div>
          ) : null}

          {/* These chips linked to /projects/<slug>, which has been a 308 since
              the site collapse; seventeen of the twenty-nine articles render at
              least one. projectSlugDestination resolves each slug to the field
              page that absorbed it, and drops any slug it does not recognise
              rather than emitting a link that goes nowhere. */}
          {connectedFields.length > 0 ? (
            <div>
              <p className="font-[var(--font-sans)] text-[10px] uppercase tracking-[0.3em] text-[var(--we-warm-brown)]">
                Connected fields
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {connectedFields.map((destination) => (
                  <Link
                    key={destination.href}
                    href={destination.href}
                    className="rounded-full border border-[var(--we-sand)] bg-white/80 px-4 py-2 font-[var(--font-sans)] text-[12px] text-[var(--we-olive)] transition hover:-translate-y-0.5 hover:border-forest hover:bg-white hover:shadow-sm"
                  >
                    {destination.label}
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* CTAS */}
      <section className="full-bleed bg-[var(--we-olive)] px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto flex max-w-[820px] flex-col items-center gap-6 text-center">
          <p className="font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.35em] text-[#CFA16B]">
            Keep moving
          </p>
          <h2 className="font-[var(--font-display)] text-[clamp(1.6rem,2.8vw,2.2rem)] font-semibold leading-[1.2] text-[#F3EBDD]">
            This story lives in the Empathy Ledger, carried with consent. Keep reading, or get in touch.
          </h2>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
            <a
              href={post.canonicalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[#CFA16B]/60 bg-[#CFA16B]/5 px-7 py-3.5 font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.22em] text-[#F3EBDD] transition-all hover:-translate-y-0.5 hover:border-[#CFA16B] hover:bg-[#CFA16B]/15 hover:gap-3 md:text-sm"
            >
              Open source record <span aria-hidden="true">&rarr;</span>
            </a>
            <Link
              href="/stories"
              className="inline-flex items-center gap-2 rounded-full border border-transparent px-6 py-3.5 font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.22em] text-[#CFA16B] transition-all hover:gap-3 hover:text-[#E0B680] md:text-sm"
            >
              Read stories <span aria-hidden="true">&rarr;</span>
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-[#CFA16B] px-6 py-3.5 font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.22em] text-[#11110F] transition-all hover:-translate-y-0.5 hover:bg-[#E0B680] hover:gap-3 md:text-sm"
            >
              Start a conversation <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* SUGGESTED READING */}
      {suggested.length > 0 && (
        <section className="full-bleed bg-[#FBF6EC] px-6 py-20 md:px-10 md:py-28">
          <div className="mx-auto max-w-[1200px]">
            <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.35em] text-[var(--we-warm-brown)]">
                  Keep reading
                </p>
                <h2 className="mt-3 font-[var(--font-display)] text-[clamp(1.6rem,2.8vw,2.2rem)] font-semibold leading-[1.15] text-[var(--we-olive)]">
                  More stories carried with consent
                </h2>
              </div>
              <Link
                href="/stories"
                className="inline-flex items-center gap-2 font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--we-olive)] transition-all hover:gap-3"
              >
                All stories <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {suggested.map((other) => (
                <Link
                  key={other.slug}
                  href={`/stories/${other.slug}`}
                  className="group flex flex-col overflow-hidden rounded-[24px] border border-[var(--we-sand)] bg-white/80 transition-all hover:-translate-y-1 hover:border-forest hover:shadow-[0_20px_50px_-20px_rgba(47,62,46,0.18)]"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#F5F0E8]">
                    <SuggestedCardImage
                      src={other.featuredImageUrl ?? null}
                      alt={other.featuredImageAlt ?? other.title}
                    />
                  </div>
                  <div className="flex flex-1 flex-col space-y-3 p-6">
                    <p className="font-[var(--font-sans)] text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--we-warm-brown)]">
                      {formatArticleType(other.articleType) ?? "Editorial"}
                    </p>
                    <h3 className="font-[var(--font-display)] text-xl font-semibold leading-tight text-[var(--we-olive)] transition-colors group-hover:text-forest">
                      {other.title}
                    </h3>
                    {other.excerpt ? (
                      <p className="line-clamp-3 font-[var(--font-body)] text-sm leading-[1.7] text-[var(--we-brown)]">
                        {other.excerpt}
                      </p>
                    ) : null}
                    <span className="mt-auto inline-flex items-center gap-2 pt-2 font-[var(--font-sans)] text-[10px] font-semibold uppercase tracking-[0.22em] text-forest transition-all group-hover:gap-3">
                      Read <span aria-hidden="true">&rarr;</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
