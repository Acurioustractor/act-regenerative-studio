import Image from "next/image";
import Link from "next/link";
import { getSiteEditorialArticles } from "../../lib/empathy-ledger-editorial";
import { pageMetadata } from "@/lib/seo/site";

export const metadata = pageMetadata({
  title: "Blog",
  description:
    "The ACT blog archive. Field notes, editorial essays, and consent-cleared writing syndicated from Empathy Ledger.",
  path: "/blog",
});

export const revalidate = 60;

export default async function BlogPage() {
  let posts: Awaited<ReturnType<typeof getSiteEditorialArticles>> = [];
  try {
    posts = await getSiteEditorialArticles(60);
  } catch (error) {
    console.error('Failed to fetch blog posts:', error);
  }

  return (
    <div className="space-y-16">
      <section className="rounded-[32px] border border-[var(--we-sand)] bg-gradient-to-br from-[#F6F1E7] via-[#E7DDC7] to-[#D7C4A2] p-8 md:p-12">
        <p className="text-xs uppercase tracking-[0.4em] text-[var(--we-warm-brown)]">
          Blog archive, syndicated from Empathy Ledger
        </p>
        <h1 className="mt-4 text-3xl font-semibold text-[var(--we-olive)] md:text-5xl font-[var(--font-display)]">
          Field notes and articles carried with consent.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--we-brown)] md:text-base">
          Field notes, editorial essays, and voices from across the ecosystem.
          Each one is published first in the Empathy Ledger, where storytellers
          control how their words travel. When the consent is there, the story
          flows here.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-5">
          <Link
            href="/stories"
            className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--we-olive)] transition-all hover:gap-3"
          >
            Read stories <span aria-hidden="true">&rarr;</span>
          </Link>
          <a
            href="https://empathyledger.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--we-warm-brown)] transition-all hover:gap-3"
          >
            Visit the Empathy Ledger <span aria-hidden="true">&rarr;</span>
          </a>
          {/* Launch hold (2026-05-27): "Meet the storytellers" link removed while
              the /storytellers surface is held. */}
          <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--we-warm-brown)]/70">
            {posts.length} stor{posts.length === 1 ? "y" : "ies"} flowing
          </p>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group flex h-full flex-col overflow-hidden rounded-3xl border border-[#E1D3BA] bg-white/70 transition hover:-translate-y-1 hover:border-[#4CAF50] hover:shadow-[0_18px_45px_rgba(50,42,31,0.12)]"
          >
            <div className="relative aspect-[4/3] w-full bg-[#F7F2E8]">
              {post.featuredImageUrl ? (
                <Image
                  src={post.featuredImageUrl}
                  alt={post.featuredImageAlt ?? post.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[#F5F0E8]">
                  <svg className="h-8 w-8 text-[#C4B5A0]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col gap-3 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--we-warm-brown)]">
                Blog
              </p>
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[var(--we-warm-brown)]">
                  {post.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-[var(--we-sand)] px-3 py-1"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              {post.relatedProjectSlugs.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-[#4CAF50]">
                  {post.relatedProjectSlugs.slice(0, 2).map((slug) => (
                    <span
                      key={slug}
                      className="rounded-full bg-[#E8F3E6] px-3 py-1 text-[var(--we-olive)]"
                    >
                      {slug.replace(/-/g, " ")}
                    </span>
                  ))}
                </div>
              )}
              <h2 className="text-xl font-semibold text-[var(--we-olive)] font-[var(--font-display)]">
                {post.title}
              </h2>
              <p className="text-sm text-[var(--we-brown)]">
                {post.excerpt || "A story carried through ACT and Empathy Ledger."}
              </p>
              {post.authorName ? (
                <div className="flex items-center gap-2 text-xs text-[var(--we-warm-brown)]">
                  <span>{post.authorName}</span>
                </div>
              ) : null}
              <span className="mt-auto inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#4CAF50]">
                Read more
                <span aria-hidden="true">-&gt;</span>
              </span>
            </div>
          </Link>
        ))}
        {posts.length === 0 ? (
          <div className="rounded-3xl border border-[#E1D3BA] bg-white/70 p-6 text-sm text-[var(--we-brown)]">
            No public articles are available from Empathy Ledger yet. Field stories and project pages still carry the live story system.
          </div>
        ) : null}
      </section>
    </div>
  );
}
