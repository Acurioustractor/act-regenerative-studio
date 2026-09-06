import Link from 'next/link';

import {
  canDisplayStoryteller,
  getAllStorytellers,
} from '@/lib/empathy-ledger-storytellers';

import { pageMetadata } from "@/lib/seo/site";

export const metadata = pageMetadata({
  title: 'Storytellers',
  description:
    'The people whose voice, experience, and custodianship carry the work. Portraits and full storyteller profiles from the ACT ecosystem, syndicated through Empathy Ledger with consent.',
  path: "/storytellers",
});

export default function StorytellersIndexPage() {
  const storytellers = getAllStorytellers().filter(canDisplayStoryteller);

  return (
    <div className="space-y-12">
      <header className="space-y-5">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--we-brown-deep)]">
          Storytellers
        </p>
        <h1 className="font-[var(--font-display)] text-[clamp(2.5rem,5vw,4rem)] font-light leading-[1.05] text-[var(--we-olive)]">
          The people the work comes through.
        </h1>
        <p className="max-w-2xl text-base leading-8 text-[var(--we-olive-deep)]">
          ACT does not build around frameworks. It builds around the people whose
          voice, memory, and custodianship carry the work. Every storyteller here has
          opted in to be seen, and every story here is carried through Empathy Ledger
          with consent.
        </p>
      </header>

      {storytellers.length === 0 ? (
        <section className="rounded-[28px] border border-[var(--we-sand)] bg-[var(--warm-paper-bright)] p-8">
          <h2 className="font-[var(--font-display)] text-xl font-semibold text-[var(--we-olive)]">
            Storyteller profiles open as consent clears.
          </h2>
          <p className="mt-3 text-sm text-[var(--we-olive-deep)]">
            Profiles are published through the Empathy Ledger once storytellers have given consent. New voices will appear here as they come onboard.
          </p>
        </section>
      ) : (
        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {storytellers.map((s) => (
            <Link
              key={s.id}
              href={`/storytellers/${encodeURIComponent(s.id)}`}
              className="group rounded-[24px] border border-[var(--we-sand)] bg-white p-6 transition-all hover:border-[var(--warm-sage)] hover:shadow-lg"
            >
              <div className="flex items-start gap-4">
                {s.avatarUrl ? (
                  <img
                    src={s.avatarUrl}
                    alt={s.displayName}
                    className="h-16 w-16 flex-none rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 flex-none items-center justify-center rounded-full bg-[#E7DDC7] text-lg font-semibold text-[var(--we-olive)]">
                    {s.displayName.slice(0, 1).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <h3 className="truncate font-[var(--font-display)] text-lg font-semibold text-[var(--we-olive)] group-hover:text-forest-sage">
                    {s.displayName}
                  </h3>
                  {s.location ? (
                    <p className="text-xs uppercase tracking-[0.22em] text-[var(--we-brown-deep)]">
                      {s.location}
                    </p>
                  ) : null}
                  {s.isElder ? (
                    <span className="mt-1 inline-block rounded-full bg-[#2F3E2E] px-2 py-[2px] text-[10px] uppercase tracking-[0.22em] text-white">
                      Elder
                    </span>
                  ) : null}
                </div>
              </div>
              {s.bio ? (
                <p className="mt-4 line-clamp-3 text-sm leading-7 text-[var(--we-olive-deep)]">
                  {s.bio}
                </p>
              ) : null}
              {s.culturalBackground.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {s.culturalBackground.slice(0, 3).map((cb) => (
                    <span
                      key={cb}
                      className="rounded-full border border-[var(--we-sand)] bg-[var(--warm-paper)] px-2 py-[2px] text-[10px] uppercase tracking-[0.18em] text-[var(--we-olive)]"
                    >
                      {cb}
                    </span>
                  ))}
                </div>
              ) : null}
              {s.analysis ? (
                <p className="mt-4 text-xs uppercase tracking-[0.22em] text-[var(--we-brown-deep)]">
                  {s.analysis.transcriptCount} transcripts · {s.analysis.mediaCount} media
                </p>
              ) : null}
            </Link>
          ))}
        </section>
      )}
    </div>
  );
}
