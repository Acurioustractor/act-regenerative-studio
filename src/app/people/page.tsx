import Image from 'next/image';
import Link from 'next/link';

import SectionHeading from '@/components/SectionHeading';
import { getAllFeaturedStorytellers } from '@/lib/people/get-featured-people';

export const metadata = {
  title: 'People — A Curious Tractor',
  description:
    'The people behind the work: storytellers, community leaders, and collaborators across the ACT ecosystem.',
};

export default async function PeoplePage() {
  const { storytellers, projectNames, stats } = await getAllFeaturedStorytellers();

  return (
    <div className="space-y-16">
      <section className="site-surface relative overflow-hidden rounded-[38px] bg-gradient-to-br from-[#f7f1e8] via-[#e9ddca] to-[#d5c09f] p-8 md:p-12">
        <div className="absolute -right-10 top-8 h-36 w-36 rounded-full bg-[#d9ead7] blur-3xl" />
        <div className="relative max-w-3xl space-y-6">
          <p className="site-eyebrow">People</p>
          <h1 className="font-[var(--font-display)] text-[2.8rem] font-semibold leading-[0.92] text-[#221b15] md:text-[4.45rem]">
            The people behind the work.
          </h1>
          <p className="text-lg leading-8 text-[#56483b] md:text-[1.12rem]">
            ACT is shaped by storytellers, community leaders, Elders, artists,
            and collaborators who give the work its texture and authority. These
            are the people who have opted in to being visible on the public
            layer of the ecosystem.
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="rounded-full border border-[#d7c4aa] bg-white/50 px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#5f4f41]">
              {stats.storytellerCount} people
            </div>
            <div className="rounded-full border border-[#d7c4aa] bg-white/50 px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#5f4f41]">
              {stats.projectCount} projects
            </div>
            <div className="rounded-full border border-[#d7c4aa] bg-white/50 px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#5f4f41]">
              {stats.storyCount} stories shared
            </div>
          </div>
        </div>
      </section>

      <section>
        <SectionHeading
          eyebrow="Community voices"
          title="Storytellers and collaborators across the ecosystem"
          description="Each person below has consented to public visibility through Empathy Ledger. Their stories, perspectives, and roles in the work are part of what makes the ecosystem real."
        />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {storytellers.map((person) => (
            <article
              key={person.id}
              className="group rounded-[24px] border border-[#E3D4BA] bg-[#FDFBF7] p-5 transition-all hover:border-[#2d6a4f] hover:shadow-[0_18px_45px_rgba(50,42,31,0.08)]"
            >
              <div className="flex items-start gap-4">
                {person.imageUrl ? (
                  <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-full bg-stone-100">
                    <Image
                      src={person.imageUrl}
                      alt={person.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                ) : (
                  <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#d9ead7] to-[#c5d9c3]">
                    <span className="text-lg font-semibold text-[#2d6a4f]">
                      {person.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold leading-tight text-[#2F3E2E]">
                    {person.name}
                  </h3>
                  {person.role && (
                    <p className="mt-0.5 text-xs text-[#6f5c49]">{person.role}</p>
                  )}
                  {person.organization && (
                    <p className="mt-0.5 text-xs text-[#9F927F]">{person.organization}</p>
                  )}
                </div>
              </div>
              {person.bio && (
                <p className="mt-3 text-sm leading-6 text-[#5A4A3A] line-clamp-3">
                  {person.bio}
                </p>
              )}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {person.projects.map((projectSlug) => (
                  <Link
                    key={projectSlug}
                    href={`/projects/${projectSlug}`}
                    className="rounded-full bg-[#EDF6EC] px-2.5 py-1 text-[10px] font-medium text-[#2F3E2E] transition hover:bg-[#d9ead7]"
                  >
                    {projectNames[projectSlug] || projectSlug}
                  </Link>
                ))}
              </div>
              {person.storyCount > 0 && (
                <p className="mt-2 text-[10px] text-[#9F927F]">
                  {person.storyCount} {person.storyCount === 1 ? 'story' : 'stories'} shared
                </p>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="site-surface rounded-[36px] bg-gradient-to-br from-[#f5efe5] via-[#e6dcc9] to-[#d4c2a2] p-8 md:p-10">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div className="space-y-4">
            <p className="site-eyebrow">Story sovereignty</p>
            <h2 className="font-[var(--font-display)] text-[2.2rem] font-semibold leading-tight text-[#241c15]">
              Every person here controls their own story.
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-[#4D3F33]">
              Empathy Ledger is built on narrative sovereignty: the principle
              that the person whose story it is decides how, where, and whether
              it appears. Everyone on this page has actively opted in to public
              visibility. Stories can be withdrawn at any time.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Link
              href="/empathy-ledger"
              className="site-glow-link rounded-full bg-[#245c43] px-7 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#1c4935]"
            >
              About Empathy Ledger
            </Link>
            <Link
              href="/contact"
              className="site-glow-link rounded-full border border-[#245c43] px-7 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#1f2b21] transition hover:bg-white/75"
            >
              Share your story
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
