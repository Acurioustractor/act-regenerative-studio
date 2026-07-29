/**
 * Project Key People Section
 * Surfaces people explicitly attached to a project in its wiki doc
 * (## Key People section). Links people with a wiki-slug to /wiki/people/<slug>.
 */

import Link from 'next/link';

import { findStorytellerByName } from '@/lib/empathy-ledger-storytellers';
import type { ProjectWikiPerson } from '@/lib/wiki/project-lcaa';

interface ProjectKeyPeopleSectionProps {
  people: ProjectWikiPerson[];
  projectTitle: string;
}

export function ProjectKeyPeopleSection({
  people,
  projectTitle,
}: ProjectKeyPeopleSectionProps) {
  if (people.length === 0) return null;

  return (
    <section className="space-y-6">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--we-brown-deep)]">
          Key people
        </p>
        <h2 className="mt-2 font-[var(--font-display)] text-2xl font-semibold text-[var(--we-olive)] md:text-3xl">
          Who shapes {projectTitle}
        </h2>
      </div>

      <ul className="grid gap-4 md:grid-cols-2">
        {people.map((person, i) => {
          const storyteller = findStorytellerByName(person.name);

          const body = (
            <>
              <h3 className="font-[var(--font-display)] text-lg font-semibold text-[var(--we-olive)]">
                {person.name}
              </h3>
              {person.context ? (
                <p className="mt-2 text-sm leading-7 text-[var(--we-olive-deep)]">
                  {person.context}
                </p>
              ) : null}
            </>
          );

          return (
            <li
              key={`${person.name}-${i}`}
              className="rounded-[20px] border border-[var(--we-sand)] bg-white p-5 transition hover:border-[#7A9B76]"
            >
              {storyteller ? (
                <Link
                  href={`/storytellers/${storyteller.id}`}
                  className="group block"
                >
                  {body}
                  <span className="mt-3 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-[var(--we-brown-deep)] group-hover:text-[var(--we-olive)]">
                    <span className="rounded-full border border-[var(--we-sand)] bg-[#F6F1E7] px-2 py-0.5 text-[10px] tracking-[0.18em] text-[var(--we-olive)]">
                      Storyteller profile
                    </span>
                    <span>View story →</span>
                  </span>
                </Link>
              ) : person.wikiSlug ? (
                <Link
                  href={`/wiki/${person.wikiSlug}`}
                  className="group block"
                >
                  {body}
                  <span className="mt-3 inline-block text-[11px] uppercase tracking-[0.22em] text-[var(--we-brown-deep)] group-hover:text-[var(--we-olive)]">
                    Read profile →
                  </span>
                </Link>
              ) : (
                body
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
