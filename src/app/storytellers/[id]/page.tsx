import Link from 'next/link';
import { notFound } from 'next/navigation';

import { TranscriptsSection } from '@/components/projects';
import {
  canDisplayStoryteller,
  getAllStorytellers,
  getStorytellerById,
} from '@/lib/empathy-ledger-storytellers';
import {
  canDisplayTranscript,
  getTranscriptsForStoryteller,
} from '@/lib/empathy-ledger-transcripts';
import { getCanonicalWikiProjectRecords } from '@/lib/wiki/canonical-project-wiki';

interface PageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return getAllStorytellers().map((s) => ({ id: s.id }));
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const s = getStorytellerById(id);
  if (!s) return {};
  return {
    title: `${s.displayName} | Storytellers | A Curious Tractor`,
    description:
      s.bio ||
      `Profile of ${s.displayName}, carried through Empathy Ledger with consent.`,
  };
}

export default async function StorytellerPage({ params }: PageProps) {
  const { id } = await params;
  const storyteller = getStorytellerById(id);
  if (!storyteller) notFound();
  if (!canDisplayStoryteller(storyteller)) notFound();

  const transcripts = getTranscriptsForStoryteller(id);
  const displayableTranscripts = transcripts.filter(canDisplayTranscript);

  const projectSlugs = Array.from(
    new Set(
      storyteller.roles.flatMap((r) => r.projects).filter((p) => p.length > 0)
    )
  );

  const projectRecords = await getCanonicalWikiProjectRecords();
  const projectTitleBySlug = new Map(
    projectRecords.map((record) => [record.websiteSlug || record.slug, record.title])
  );
  const projectsByStoryteller = projectSlugs.map((slug) => ({
    slug,
    title: projectTitleBySlug.get(slug) || slug,
  }));

  return (
    <div className="space-y-16">
      <Link
        href="/storytellers"
        className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-[var(--we-brown-deep)] hover:text-[var(--we-olive)]"
      >
        <span aria-hidden="true">←</span> All storytellers
      </Link>

      <header className="grid gap-8 md:grid-cols-[auto_minmax(0,1fr)]">
        {storyteller.avatarUrl ? (
          <img
            src={storyteller.avatarUrl}
            alt={storyteller.displayName}
            className="h-40 w-40 rounded-full object-cover md:h-48 md:w-48"
          />
        ) : (
          <div className="flex h-40 w-40 items-center justify-center rounded-full bg-[#E7DDC7] text-5xl font-semibold text-[var(--we-olive)] md:h-48 md:w-48">
            {storyteller.displayName.slice(0, 1).toUpperCase()}
          </div>
        )}
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--we-brown-deep)]">
            Storyteller
          </p>
          <h1 className="font-[var(--font-display)] text-[clamp(2rem,4.5vw,3.2rem)] font-light leading-[1.1] text-[var(--we-olive)]">
            {storyteller.displayName}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--we-olive-deep)]">
            {storyteller.location ? <span>{storyteller.location}</span> : null}
            {storyteller.isElder ? (
              <span className="rounded-full bg-[#2F3E2E] px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-white">
                Elder
              </span>
            ) : null}
            {storyteller.authorRole ? (
              <span className="text-xs uppercase tracking-[0.22em] text-[var(--we-brown-deep)]">
                {storyteller.authorRole.replace(/_/g, ' ')}
              </span>
            ) : null}
          </div>
          {storyteller.bio ? (
            <p className="max-w-2xl text-base leading-8 text-[var(--we-olive-deep)]">
              {storyteller.bio}
            </p>
          ) : null}
          {storyteller.culturalBackground.length > 0 ? (
            <div className="flex flex-wrap gap-2 pt-2">
              {storyteller.culturalBackground.map((cb) => (
                <span
                  key={cb}
                  className="rounded-full border border-[var(--we-sand)] bg-[#F6F1E7] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[var(--we-olive)]"
                >
                  {cb}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </header>

      {storyteller.analysis ? (
        <section className="grid gap-8 rounded-[28px] border border-[var(--we-sand)] bg-[#FDFBF7] p-6 md:grid-cols-3 md:p-10">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--we-brown-deep)]">
              Work at a glance
            </p>
            <div className="grid grid-cols-2 gap-4 text-center md:grid-cols-1 md:text-left">
              <div>
                <div className="font-[var(--font-display)] text-3xl text-[var(--we-olive)]">
                  {storyteller.analysis.transcriptCount}
                </div>
                <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--we-brown-deep)]">
                  Transcripts
                </div>
              </div>
              <div>
                <div className="font-[var(--font-display)] text-3xl text-[var(--we-olive)]">
                  {storyteller.analysis.mediaCount}
                </div>
                <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--we-brown-deep)]">
                  Media items
                </div>
              </div>
            </div>
          </div>

          {storyteller.analysis.themes.length > 0 ? (
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--we-brown-deep)]">
                Themes
              </p>
              <div className="flex flex-wrap gap-2">
                {storyteller.analysis.themes.slice(0, 8).map((t) => (
                  <span
                    key={t.label}
                    className="rounded-full border border-[var(--we-sand)] bg-white px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[var(--we-olive)]"
                  >
                    {t.label}
                    {typeof t.count === 'number' ? ` · ${t.count}` : ''}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {storyteller.analysis.culturalMarkers.length > 0 ? (
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--we-brown-deep)]">
                Cultural markers
              </p>
              <ul className="space-y-1 text-sm text-[var(--we-olive-deep)]">
                {storyteller.analysis.culturalMarkers.slice(0, 6).map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      ) : null}

      {storyteller.analysis && storyteller.analysis.quotes.length > 0 ? (
        <section className="space-y-4">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--we-brown-deep)]">
            In their words
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {storyteller.analysis.quotes.slice(0, 4).map((q, i) => (
              <blockquote
                key={i}
                className="rounded-2xl bg-[#2F3E2E] p-6 text-sm leading-7 text-white"
              >
                “{q.text}”
                {q.context ? (
                  <footer className="mt-3 text-[11px] uppercase tracking-[0.22em] text-[#D9B786]">
                    {q.context}
                  </footer>
                ) : null}
              </blockquote>
            ))}
          </div>
        </section>
      ) : null}

      {projectsByStoryteller.length > 0 ? (
        <section className="space-y-4">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--we-brown-deep)]">
            Projects they shape
          </p>
          <div className="flex flex-wrap gap-3">
            {projectsByStoryteller.map(({ slug, title }) => (
              <Link
                key={slug}
                href={`/projects/${slug}`}
                className="rounded-full border border-[var(--we-sand)] bg-white px-4 py-2 text-sm text-[var(--we-olive)] transition hover:border-[#7A9B76]"
              >
                {title}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {displayableTranscripts.length > 0 ? (
        <TranscriptsSection
          transcripts={displayableTranscripts}
          projectTitle={storyteller.displayName}
        />
      ) : null}

      <section className="rounded-[28px] border border-[var(--we-sand)] bg-[var(--we-olive)] px-6 py-8 text-white md:px-10 md:py-10">
        <p className="text-xs uppercase tracking-[0.3em] text-[#D7E7D4]">
          Carry a story
        </p>
        <h2 className="mt-3 font-[var(--font-display)] text-2xl font-semibold md:text-3xl">
          Want to share a story of your own?
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#E8E1D0]">
          Empathy Ledger is built on consent. Stories stay with the person who
          tells them. If you&rsquo;d like to carry a story into the work, let us
          know how you&rsquo;d like to be met.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/contact?type=share-your-story&source=storyteller-profile"
            className="rounded-full bg-[#4CAF50] px-5 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#3E9845]"
          >
            Start the conversation
          </Link>
          <Link
            href="/storytellers"
            className="rounded-full border border-white/30 px-5 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white/10"
          >
            Meet other storytellers
          </Link>
        </div>
      </section>
    </div>
  );
}
