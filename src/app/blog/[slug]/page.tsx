import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import {
  getEditorialArticleBySlug,
  getEditorialArticleStaticSlugs,
  getSiteEditorialArticles,
  type EditorialArticle,
} from "../../../lib/empathy-ledger-editorial";

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    return getEditorialArticleStaticSlugs().map((slug) => ({ slug }));
  } catch (error) {
    console.error("Failed to generate static params for blog posts:", error);
    return [];
  }
}

function shortLede(raw: string | null): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  // Keep the first sentence, cap at roughly 180 chars so the hero stays tight.
  const firstSentence = trimmed.split(/(?<=[.!?])\s/)[0] || trimmed;
  if (firstSentence.length <= 200) return firstSentence;
  return firstSentence.slice(0, 180).replace(/[,\s]+\S*$/, "") + "…";
}

function publishedDateLabel(iso: string | null): string | null {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString("en-AU", {
      year: "numeric",
      month: "long",
    });
  } catch {
    return null;
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getEditorialArticleBySlug(slug);

  if (!post) {
    notFound();
  }

  const content = post.content || "";
  const looksLikeHtml = /<\/?[a-z][\s\S]*>/i.test(content);
  const lede = shortLede(post.excerpt);
  const dateLabel = publishedDateLabel(post.publishedAt);
  const hasHero = !!post.featuredImageUrl;

  // Gallery photos = everything from EL media except the featured image (which
  // already runs at the top as the hero) and duplicates.
  const gallery = (post.media?.photoPreviews || [])
    .filter((photo) => !!photo.url && photo.url !== post.featuredImageUrl)
    .slice(0, 8);

  // Suggested reading: 3 most recent other articles that have a featured image
  // so the cards render well. Falls back to just recent if not enough with images.
  const allArticles: EditorialArticle[] = await getSiteEditorialArticles(40).catch(
    () => [] as EditorialArticle[]
  );
  const others = allArticles.filter((a) => a.slug !== post.slug);
  const suggested = [
    ...others.filter((a) => !!a.featuredImageUrl),
    ...others.filter((a) => !a.featuredImageUrl),
  ].slice(0, 3);

  return (
    <>
      {/* , , ,  HERO: full-bleed image with title + meta overlay , , ,  */}
      <section className="full-bleed relative min-h-[60vh] w-full overflow-hidden bg-[#11110F] md:min-h-[75vh]">
        {hasHero ? (
          <Image
            src={post.featuredImageUrl!}
            alt={post.featuredImageAlt ?? post.title}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/45 to-black/80" />
        <div className="relative z-10 mx-auto flex min-h-[60vh] max-w-[1000px] flex-col justify-end px-6 pb-16 pt-32 md:min-h-[75vh] md:px-10 md:pb-24 md:pt-40">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.3em] text-[#CFA16B] transition-all hover:gap-3 hover:text-[#E0B680]"
          >
            <span aria-hidden="true">&larr;</span> All stories
          </Link>
          <h1 className="mt-6 font-[var(--font-display)] text-[clamp(2.2rem,5vw,4.2rem)] font-semibold leading-[1.05] text-[#F3EBDD]">
            {post.title}
          </h1>
          {lede ? (
            <p className="mt-6 max-w-[680px] font-[var(--font-body)] text-[17px] italic leading-[1.65] text-[#E0D4B9] md:text-[19px]">
              {lede}
            </p>
          ) : null}
          <div className="mt-8 flex flex-wrap items-center gap-5 font-[var(--font-sans)] text-[11px] uppercase tracking-[0.22em] text-[#CFA16B]/90">
            {post.authorName ? <span>{post.authorName}</span> : null}
            {dateLabel ? (
              <>
                <span aria-hidden="true" className="text-[#CFA16B]/40">·</span>
                <span>{dateLabel}</span>
              </>
            ) : null}
            {post.articleType ? (
              <>
                <span aria-hidden="true" className="text-[#CFA16B]/40">·</span>
                <span>{post.articleType}</span>
              </>
            ) : null}
          </div>
        </div>
      </section>

      {/* , , ,  BODY: long-form article in a readable measure , , ,  */}
      <section className="bg-[#FBF6EC] px-6 py-20 md:px-10 md:py-28">
        <article className="mx-auto max-w-[720px]">
          {content ? (
            <div className="rich-text prose prose-lg max-w-none prose-headings:font-[var(--font-display)] prose-headings:text-[var(--we-olive)] prose-p:text-[17px] prose-p:leading-[1.8] prose-p:text-[var(--we-brown)] prose-a:text-[#4CAF50] prose-a:no-underline hover:prose-a:underline prose-strong:text-[var(--we-olive)] prose-blockquote:border-l-[3px] prose-blockquote:border-[#CFA16B] prose-blockquote:bg-[#F3EBDD]/50 prose-blockquote:py-1 prose-blockquote:italic prose-img:rounded-[20px]">
              {looksLikeHtml ? (
                <div dangerouslySetInnerHTML={{ __html: content }} />
              ) : (
                <ReactMarkdown>{content}</ReactMarkdown>
              )}
            </div>
          ) : (
            <p className="font-[var(--font-body)] italic text-[var(--we-warm-brown)]">
              This story is still being prepared.
            </p>
          )}
        </article>
      </section>

      {/* , , ,  GALLERY: nice big photos from the field , , ,  */}
      {gallery.length > 0 && (
        <section className="full-bleed bg-[#F6F1E7] px-6 py-20 md:px-10 md:py-28">
          <div className="mx-auto max-w-[1300px]">
            <p className="mb-8 text-center font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.35em] text-[var(--we-warm-brown)] md:mb-12">
              Field photographs
            </p>
            <div
              className={`grid gap-3 md:gap-4 ${
                gallery.length === 1
                  ? "mx-auto max-w-[900px] grid-cols-1"
                  : gallery.length === 2
                    ? "md:grid-cols-2"
                    : "md:grid-cols-2 lg:grid-cols-3"
              }`}
            >
              {gallery.map((photo, i) => {
                const isBentoLead = i === 0 && gallery.length >= 3;
                return (
                  <div
                    key={photo.url + i}
                    className={`relative overflow-hidden rounded-[20px] bg-[#1B1A16] ${
                      isBentoLead
                        ? "aspect-[16/10] lg:col-span-2 lg:row-span-2 lg:aspect-[16/11]"
                        : gallery.length === 1
                          ? "aspect-[16/10]"
                          : "aspect-[4/3]"
                    }`}
                  >
                    <Image
                      src={photo.url}
                      alt={photo.alt || `Field photograph from ${post.title}`}
                      fill
                      sizes={isBentoLead
                        ? "(min-width: 1024px) 66vw, (min-width: 768px) 100vw, 100vw"
                        : gallery.length === 1
                          ? "(min-width: 900px) 900px, 100vw"
                          : "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"}
                      className="object-cover transition-transform duration-[6s] ease-out hover:scale-[1.03]"
                    />
                    {photo.caption ? (
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 md:p-5">
                        <p className="font-[var(--font-body)] text-[13px] italic leading-snug text-[#F3EBDD] md:text-base md:leading-normal">
                          {photo.caption}
                        </p>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* , , ,  AUTHOR + RELATED PROJECTS , , ,  */}
      <section className="bg-[#FBF6EC] px-6 py-16 md:px-10 md:py-20">
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

          {post.relatedProjectSlugs.length > 0 ? (
            <div>
              <p className="font-[var(--font-sans)] text-[10px] uppercase tracking-[0.3em] text-[var(--we-warm-brown)]">
                Connected projects
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {post.relatedProjectSlugs.map((projectSlug) => (
                  <Link
                    key={projectSlug}
                    href={`/projects/${projectSlug}`}
                    className="rounded-full border border-[var(--we-sand)] bg-white/80 px-4 py-2 font-[var(--font-sans)] text-[12px] text-[var(--we-olive)] transition hover:-translate-y-0.5 hover:border-[#4CAF50] hover:bg-white hover:shadow-sm"
                  >
                    {projectSlug
                      .replace(/-/g, " ")
                      .replace(/\b\w/g, (c) => c.toUpperCase())}
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* , , ,  CTAS , , ,  */}
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
              Open in Empathy Ledger <span aria-hidden="true">&rarr;</span>
            </a>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-full border border-transparent px-6 py-3.5 font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.22em] text-[#CFA16B] transition-all hover:gap-3 hover:text-[#E0B680] md:text-sm"
            >
              All stories <span aria-hidden="true">&rarr;</span>
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

      {/* , , ,  SUGGESTED READING , , ,  */}
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
                href="/blog"
                className="inline-flex items-center gap-2 font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--we-olive)] transition-all hover:gap-3"
              >
                All stories <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {suggested.map((other) => (
                <Link
                  key={other.slug}
                  href={`/blog/${other.slug}`}
                  className="group flex flex-col overflow-hidden rounded-[24px] border border-[var(--we-sand)] bg-white/80 transition-all hover:-translate-y-1 hover:border-[#4CAF50] hover:shadow-[0_20px_50px_-20px_rgba(47,62,46,0.18)]"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#F5F0E8]">
                    {other.featuredImageUrl ? (
                      <Image
                        src={other.featuredImageUrl}
                        alt={other.featuredImageAlt ?? other.title}
                        fill
                        sizes="(min-width: 768px) 33vw, 100vw"
                        className="object-cover transition-transform duration-[6s] ease-out group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="font-[var(--font-sans)] text-[10px] uppercase tracking-[0.3em] text-[var(--we-warm-brown)]/40">
                          Editorial
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col space-y-3 p-6">
                    <p className="font-[var(--font-sans)] text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--we-warm-brown)]">
                      {other.articleType || "Editorial"}
                    </p>
                    <h3 className="font-[var(--font-display)] text-xl font-semibold leading-tight text-[var(--we-olive)] transition-colors group-hover:text-[#4CAF50]">
                      {other.title}
                    </h3>
                    {other.excerpt ? (
                      <p className="line-clamp-3 font-[var(--font-body)] text-sm leading-[1.7] text-[var(--we-brown)]">
                        {other.excerpt}
                      </p>
                    ) : null}
                    <span className="mt-auto inline-flex items-center gap-2 pt-2 font-[var(--font-sans)] text-[10px] font-semibold uppercase tracking-[0.22em] text-[#4CAF50] transition-all group-hover:gap-3">
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
