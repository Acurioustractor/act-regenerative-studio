import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, BookOpen } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

import {
  getCanonicalWikiPage,
  renderCanonicalWikiMarkdown,
} from '@/lib/wiki/canonical-site-wiki';

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

  const renderedContent = await renderCanonicalWikiMarkdown(page.content);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F6F1E7] via-[#F5F1E8] to-white">
      <section className="border-b border-[#E3D4BA] bg-white/90">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <Link
            href="/wiki"
            className="inline-flex items-center gap-2 text-sm text-[#5A4A3A] transition hover:text-[#2F3E2E]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to the ACT wiki
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-[#F5F1E8] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#5A4A3A]">
              {page.sectionTitle}
            </span>
            <span className="rounded-full border border-[#D7C4A2] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[#7A6A55]">
              {page.source === 'live-wiki' ? 'Live canonical wiki' : 'Snapshot fallback'}
            </span>
            {page.modifiedAt && (
              <span className="text-xs text-[#8A7A65]">
                Updated {new Date(page.modifiedAt).toLocaleDateString('en-AU')}
              </span>
            )}
          </div>

          <h1 className="mt-5 max-w-4xl font-[var(--font-display)] text-4xl font-semibold text-[#2F3E2E] md:text-6xl">
            {page.title}
          </h1>

          {page.excerpt && (
            <p className="mt-6 max-w-3xl text-base leading-8 text-[#4D3F33] md:text-lg">
              {page.excerpt}
            </p>
          )}

          <div className="mt-6 rounded-2xl border border-[#E3D4BA] bg-[#FDFBF7] px-4 py-3 text-sm text-[#5A4A3A]">
            Canonical source: {page.relativePath}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_260px]">
          <article className="rounded-[32px] border border-[#E3D4BA] bg-white/90 px-6 py-8 shadow-sm md:px-10 md:py-10">
            <div className="prose prose-lg max-w-none prose-headings:font-[var(--font-display)] prose-headings:text-[#2F3E2E] prose-p:text-[#4D3F33] prose-li:text-[#4D3F33] prose-strong:text-[#2F3E2E] prose-a:text-[#4CAF50]">
              <ReactMarkdown>{renderedContent}</ReactMarkdown>
            </div>
          </article>

          <aside className="space-y-5">
            <div className="rounded-[28px] border border-[#E3D4BA] bg-white/90 p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-[#4CAF50]" />
                <h2 className="font-[var(--font-display)] text-xl font-semibold text-[#2F3E2E]">
                  Living page
                </h2>
              </div>
              <p className="mt-3 text-sm leading-7 text-[#4D3F33]">
                This page is rendered from the canonical ACT markdown wiki, not a separate CMS
                entry. As the wiki evolves, this public knowledge surface can evolve with it.
              </p>
            </div>

            <div className="rounded-[28px] border border-[#E3D4BA] bg-[#2F3E2E] p-6 text-white shadow-sm">
              <p className="text-xs uppercase tracking-[0.3em] text-[#D7E7D4]">
                Next move
              </p>
              <h2 className="mt-3 font-[var(--font-display)] text-2xl font-semibold">
                Follow the ecosystem
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#E8E1D0]">
                Jump from this knowledge page into the public project layer, then back into the
                wiki when you need the method, the context, or the proof behind it.
              </p>
              <div className="mt-5 flex flex-col gap-3">
                <Link
                  href="/projects"
                  className="rounded-full bg-[#4CAF50] px-4 py-2 text-center text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#3E9845]"
                >
                  Explore projects
                </Link>
                <Link
                  href="/method"
                  className="rounded-full border border-white/20 px-4 py-2 text-center text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white/10"
                >
                  See the method
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
