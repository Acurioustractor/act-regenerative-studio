'use client';

import Link from 'next/link';
import { BookOpen, Search } from 'lucide-react';
import { useDeferredValue, useMemo, useState } from 'react';

import type { CanonicalWikiPageListItem } from '@/lib/wiki/canonical-site-wiki';

type SectionOption = {
  id: string;
  title: string;
  count: number;
};

type WikiSearchProps = {
  pages: CanonicalWikiPageListItem[];
  sections: SectionOption[];
};

const ALL_SECTIONS = 'all';

function normaliseText(value: string): string {
  return value.toLowerCase().trim();
}

function matchesQuery(page: CanonicalWikiPageListItem, query: string): boolean {
  if (!query) return true;
  const haystack = [
    page.title,
    page.stem,
    page.excerpt || '',
    page.sectionTitle,
    page.path,
  ]
    .join(' ')
    .toLowerCase();
  // Split the query so multi-word searches still match across fields.
  const tokens = query.split(/\s+/).filter(Boolean);
  return tokens.every((token) => haystack.includes(token));
}

export function WikiSearch({ pages, sections }: WikiSearchProps) {
  const [query, setQuery] = useState('');
  const [sectionId, setSectionId] = useState<string>(ALL_SECTIONS);
  const deferredQuery = useDeferredValue(query);

  const filtered = useMemo(() => {
    const q = normaliseText(deferredQuery);
    return pages.filter((page) => {
      if (sectionId !== ALL_SECTIONS && page.sectionId !== sectionId) {
        return false;
      }
      return matchesQuery(page, q);
    });
  }, [pages, sectionId, deferredQuery]);

  const totalLabel = `${filtered.length} page${filtered.length === 1 ? '' : 's'}`;

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-[var(--we-sand)] bg-white/90 p-5 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_260px]">
          <label className="relative block">
            <span className="sr-only">Search the ACT wiki</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#7A6A55]" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search the ACT wiki by title, topic, or section..."
              className="w-full rounded-2xl border border-[#D7C4A2] bg-[#FDFBF7] py-3 pl-12 pr-4 text-sm text-[var(--we-olive)] outline-none ring-0 transition focus:border-[#7A9B76]"
              aria-label="Search the ACT wiki"
            />
          </label>

          <label className="block">
            <span className="sr-only">Filter by section</span>
            <select
              value={sectionId}
              onChange={(event) => setSectionId(event.target.value)}
              className="w-full rounded-2xl border border-[#D7C4A2] bg-[#FDFBF7] px-4 py-3 text-sm text-[var(--we-olive)] outline-none transition focus:border-[#7A9B76]"
              aria-label="Filter by section"
            >
              <option value={ALL_SECTIONS}>All sections ({pages.length})</option>
              {sections.map((section) => (
                <option key={section.id} value={section.id}>
                  {section.title} ({section.count})
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSectionId(ALL_SECTIONS)}
          className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
            sectionId === ALL_SECTIONS
              ? 'border-[#4CAF50] bg-[#E5F4E4] text-[#2F5233]'
              : 'border-[var(--we-sand)] bg-white text-[var(--we-brown)] hover:border-[#7A9B76]'
          }`}
        >
          All ({pages.length})
        </button>
        {sections.map((section) => {
          const active = sectionId === section.id;
          return (
            <button
              key={section.id}
              type="button"
              onClick={() => setSectionId(section.id)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                active
                  ? 'border-[#4CAF50] bg-[#E5F4E4] text-[#2F5233]'
                  : 'border-[var(--we-sand)] bg-white text-[var(--we-brown)] hover:border-[#7A9B76]'
              }`}
            >
              {section.title} ({section.count})
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#7A6A55]">
            Working wiki
          </p>
          <h2 className="mt-2 font-[var(--font-display)] text-2xl font-semibold text-[var(--we-olive)]">
            {totalLabel} available
          </h2>
        </div>
        {(query || sectionId !== ALL_SECTIONS) && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setSectionId(ALL_SECTIONS);
            }}
            className="rounded-full border border-[#D8C6A7] bg-white px-4 py-2 text-xs font-medium text-[var(--we-brown)] transition hover:border-[#7A9B76]"
          >
            Clear filters
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-[#D7C4A2] bg-white/80 px-6 py-14 text-center">
          <BookOpen className="mx-auto h-10 w-10 text-[#7A6A55]" />
          <h3 className="mt-4 font-[var(--font-display)] text-2xl font-semibold text-[var(--we-olive)]">
            No canonical pages matched this view
          </h3>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[var(--we-brown)]">
            Try a broader search term or clear the section filter. The source of truth stays in
            the markdown wiki even when this view is quiet.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setSectionId(ALL_SECTIONS);
            }}
            className="mt-6 inline-flex rounded-full bg-[#4CAF50] px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#3E9845]"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className="grid min-w-0 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((page) => (
            <Link
              key={page.path}
              href={`/wiki/${page.stem}`}
              className="group min-w-0 overflow-hidden rounded-[28px] border border-[var(--we-sand)] bg-white/90 p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#7A9B76] hover:shadow-lg"
            >
              <div className="flex min-w-0 items-center justify-between gap-3">
                <span className="min-w-0 rounded-full bg-[#F5F1E8] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#5A4A3A]">
                  {page.sectionTitle}
                </span>
                <span className="min-w-0 truncate text-[11px] uppercase tracking-[0.18em] text-[#8A7A65]">
                  Wiki page
                </span>
              </div>
              <h3 className="mt-4 break-words font-[var(--font-display)] text-2xl font-semibold text-[var(--we-olive)] group-hover:text-[#4E6A4F]">
                {page.title}
              </h3>
              <p className="mt-3 break-words text-sm leading-7 text-[var(--we-brown)]">
                {page.excerpt || 'Read the full page for context, examples, and links.'}
              </p>
              <div className="mt-5 flex min-w-0 items-center justify-between gap-3 text-xs text-[#7A6A55]">
                <span className="min-w-0 truncate pr-2">{page.sectionTitle} source</span>
                <span className="font-medium text-[#4CAF50]">Open →</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
