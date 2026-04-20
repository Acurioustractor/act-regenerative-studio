import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, BookOpen } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

import {
  getCanonicalWikiPage,
  renderCanonicalWikiMarkdown,
} from '@/lib/wiki/canonical-site-wiki';
import {
  getRelatedWikiPagesInSection,
  getWikiBacklinksForSlug,
} from '@/lib/wiki/backlinks';

export default async function WikiPageViewer({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getCanonicalWikiPage(slug);

  if (!page) {
    notFound();
  }

  const [renderedContent, backlinks, related] = await Promise.all([
    renderCanonicalWikiMarkdown(page.content),
    getWikiBacklinksForSlug(page.stem),
    getRelatedWikiPagesInSection(page.stem, 5),
  ]);

  const projectBacklinks = backlinks.fromProjects.slice(0, 6);
  const wikiBacklinks = backlinks.fromWiki.slice(0, 6);
  const nextMove = projectBacklinks[0] || null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F6F1E7] via-[#F5F1E8] to-white">
      <section className="border-b border-[var(--we-sand)] bg-white/90">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <Link
            href="/wiki"
            className="inline-flex items-center gap-2 text-sm text-[#5A4A3A] transition hover:text-[var(--we-olive)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to the wiki
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-[#F5F1E8] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#5A4A3A]">
              {page.sectionTitle}
            </span>
            {page.modifiedAt && (
              <span className="text-xs text-[#8A7A65]">
                Updated {new Date(page.modifiedAt).toLocaleDateString('en-AU')}
              </span>
            )}
          </div>

          <h1 className="mt-5 max-w-4xl font-[var(--font-display)] text-4xl font-semibold text-[var(--we-olive)] md:text-6xl">
            {page.title}
          </h1>

          {page.excerpt && (
            <p className="mt-6 max-w-3xl text-base leading-8 text-[var(--we-brown)] md:text-lg">
              {page.excerpt}
            </p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_260px]">
          <article className="rounded-[32px] border border-[var(--we-sand)] bg-white/90 px-6 py-8 shadow-sm md:px-10 md:py-10">
            <div className="prose prose-lg max-w-none prose-headings:font-[var(--font-display)] prose-headings:text-[var(--we-olive)] prose-p:text-[var(--we-brown)] prose-li:text-[var(--we-brown)] prose-strong:text-[var(--we-olive)] prose-a:text-[#4CAF50]">
              <ReactMarkdown>{renderedContent}</ReactMarkdown>
            </div>
          </article>

          <aside className="space-y-5">
            <div className="rounded-[28px] border border-[var(--we-sand)] bg-white/90 p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-[#4CAF50]" />
                <h2 className="font-[var(--font-display)] text-xl font-semibold text-[var(--we-olive)]">
                  About this page
                </h2>
              </div>
              <p className="mt-3 text-sm leading-7 text-[var(--we-brown)]">
                Part of the ACT working wiki. We keep our methods, decisions
                and context in public so you can check the thinking behind any
                project.
              </p>
            </div>

            {nextMove ? (
              <div className="rounded-[28px] border border-[var(--we-sand)] bg-[var(--we-olive)] p-6 text-white shadow-sm">
                <p className="text-xs uppercase tracking-[0.3em] text-[#D7E7D4]">
                  See it in the field
                </p>
                <h2 className="mt-3 font-[var(--font-display)] text-2xl font-semibold">
                  {nextMove.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-[#E8E1D0]">
                  This page shows up directly in the work we&rsquo;re doing on
                  {' '}
                  {nextMove.title}.
                </p>
                <Link
                  href={nextMove.href}
                  className="mt-5 inline-flex rounded-full bg-[#4CAF50] px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#3E9845]"
                >
                  Open the project
                </Link>
              </div>
            ) : (
              <div className="rounded-[28px] border border-[var(--we-sand)] bg-[var(--we-olive)] p-6 text-white shadow-sm">
                <p className="text-xs uppercase tracking-[0.3em] text-[#D7E7D4]">
                  Next move
                </p>
                <h2 className="mt-3 font-[var(--font-display)] text-2xl font-semibold">
                  See what this looks like on the ground
                </h2>
                <p className="mt-3 text-sm leading-7 text-[#E8E1D0]">
                  Browse the public works — each one is a place you can step
                  into, visit, or partner on.
                </p>
                <Link
                  href="/projects"
                  className="mt-5 inline-flex rounded-full bg-[#4CAF50] px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#3E9845]"
                >
                  Explore projects
                </Link>
              </div>
            )}
          </aside>
        </div>

        {(projectBacklinks.length > 0 || wikiBacklinks.length > 0 || related.length > 0) && (
          <div className="mt-16 grid gap-10 border-t border-[var(--we-sand)] pt-12 md:grid-cols-2">
            {projectBacklinks.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--we-brown)]">
                  Where this shows up
                </p>
                <h3 className="mt-2 font-[var(--font-display)] text-xl font-semibold text-[var(--we-olive)]">
                  Projects that reference this page
                </h3>
                <ul className="mt-4 space-y-2">
                  {projectBacklinks.map((entry) => (
                    <li key={entry.path}>
                      <Link
                        href={entry.href}
                        className="inline-flex items-center gap-2 text-sm text-[var(--we-olive)] transition hover:text-[#3E9845]"
                      >
                        <span aria-hidden="true">→</span> {entry.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {(wikiBacklinks.length > 0 || related.length > 0) && (
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--we-brown)]">
                  Keep reading
                </p>
                <h3 className="mt-2 font-[var(--font-display)] text-xl font-semibold text-[var(--we-olive)]">
                  {wikiBacklinks.length > 0
                    ? 'Pages that pick up the same thread'
                    : `More from ${page.sectionTitle}`}
                </h3>
                <ul className="mt-4 space-y-2">
                  {(wikiBacklinks.length > 0 ? wikiBacklinks : related).map(
                    (entry) => (
                      <li key={entry.path}>
                        <Link
                          href={entry.href}
                          className="inline-flex items-center gap-2 text-sm text-[var(--we-olive)] transition hover:text-[#3E9845]"
                        >
                          <span aria-hidden="true">→</span> {entry.title}
                          <span className="text-[10px] uppercase tracking-[0.22em] text-[#8A7A65]">
                            {entry.sectionTitle}
                          </span>
                        </Link>
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
