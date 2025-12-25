import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPostBySlug, getBlogPosts } from "../../../lib/webflow";

export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="space-y-12">
      <section className="rounded-[32px] border border-[#E3D4BA] bg-gradient-to-br from-[#F6F1E7] via-[#E7DDC7] to-[#D7C4A2] p-8 md:p-12">
        <Link
          href="/blog"
          className="text-xs uppercase tracking-[0.3em] text-[#4CAF50]"
        >
          Back to journal
        </Link>
        <h1 className="mt-4 text-3xl font-semibold text-[#2F3E2E] md:text-5xl font-[var(--font-display)]">
          {post.title}
        </h1>
        {(post.theme || post.readTime) && (
          <div className="mt-4 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[#6B5A45]">
            {post.theme ? (
              <span className="rounded-full border border-[#E3D4BA] px-3 py-1">
                {post.theme}
              </span>
            ) : null}
            {post.readTime ? <span>{post.readTime}</span> : null}
          </div>
        )}
        {post.summary ? (
          <p className="mt-4 max-w-2xl text-sm text-[#4D3F33] md:text-base">
            {post.summary}
          </p>
        ) : null}
        {post.author ? (
          <div className="mt-5 flex items-center gap-3 text-xs text-[#6B5A45]">
            {post.authorAvatar?.url ? (
              <Image
                src={post.authorAvatar.url}
                alt={post.authorAvatar.alt ?? post.author}
                width={36}
                height={36}
                className="rounded-full border border-[#E3D4BA] object-cover"
              />
            ) : null}
            <span>{post.author}</span>
          </div>
        ) : null}
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-3xl border border-[#E3D4BA] bg-white/70 p-6 text-sm text-[#4D3F33]">
          {post.body ? (
            <div
              className="rich-text"
              dangerouslySetInnerHTML={{ __html: post.body }}
            />
          ) : (
            <p>No body content available.</p>
          )}
        </article>
        <aside className="space-y-6">
          <div className="rounded-3xl border border-[#E3D4BA] bg-white/70 p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-[#6B5A45]">
              Featured image
            </p>
            <div className="relative mt-4 aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#F7F2E8]">
              {post.image?.url ? (
                <Image
                  src={post.image.url}
                  alt={post.image.alt ?? post.title}
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs uppercase tracking-[0.3em] text-[#6B5A45]">
                  Image placeholder
                </div>
              )}
            </div>
          </div>
          <div className="rounded-3xl border border-[#E3D4BA] bg-white/70 p-5 text-sm text-[#4D3F33]">
            <p className="text-xs uppercase tracking-[0.3em] text-[#6B5A45]">
              Share
            </p>
            <p className="mt-3">
              Invite collaborators to read and respond to this field note.
            </p>
            <Link
              href="/contact"
              className="mt-4 inline-flex rounded-full bg-[#4CAF50] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white"
            >
              Start a conversation
            </Link>
          </div>
        </aside>
      </section>
    </div>
  );
}
