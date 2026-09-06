/**
 * Case Study Section
 * Features a hero story from Empathy Ledger with prominent quote and deep link
 */

import type { FeaturedStory } from '@/lib/empathy-ledger-featured';
import type { ProjectTheme } from '@/data/projects';
import { themeStyles } from '@/lib/projects';

interface CaseStudySectionProps {
  story: FeaturedStory;
  projectTitle: string;
  theme: ProjectTheme;
}

const EMPATHY_LEDGER_URL = process.env.NEXT_PUBLIC_EMPATHY_LEDGER_URL || 'https://empathyledger.org';

export function CaseStudySection({
  story,
  projectTitle,
  theme,
}: CaseStudySectionProps) {
  const style = themeStyles[theme];
  const storyUrl = story.story_url || `${EMPATHY_LEDGER_URL}/stories/${story.story_id}`;

  return (
    <section className="space-y-6">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--we-brown-deep)]">
          Case Study
        </p>
        <h2 className="mt-2 font-[var(--font-display)] text-2xl font-semibold text-[var(--we-olive)] md:text-3xl">
          A story from this work
        </h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        {/* Featured Image */}
        {story.featured_image_url && (
          <a
            href={storyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-[4/3] overflow-hidden rounded-[32px]"
          >
            <img
              src={story.featured_image_url}
              alt={story.story_title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className={`inline-block rounded-full px-4 py-2 text-xs font-semibold ${style.badge}`}>
                Featured Case Study
              </span>
            </div>
          </a>
        )}

        {/* Story Content */}
        <div className="flex flex-col justify-center space-y-6">
          {/* Pull Quote */}
          {story.excerpt && (
            <blockquote className="relative">
              <div className={`absolute -left-4 top-0 text-6xl font-serif ${style.accent} opacity-30`}>
                "
              </div>
              <p className="pl-8 text-xl leading-relaxed text-[var(--we-olive)] md:text-2xl font-[var(--font-display)]">
                {story.excerpt.length > 300
                  ? story.excerpt.slice(0, 300) + '...'
                  : story.excerpt}
              </p>
              <div className={`absolute -right-2 bottom-0 text-6xl font-serif ${style.accent} opacity-30`}>
                "
              </div>
            </blockquote>
          )}

          {/* Attribution */}
          <div className="flex items-center gap-4 pt-4 border-t border-[var(--we-sand)]">
            {story.storyteller_image && (
              <img
                src={story.storyteller_image}
                alt={story.storyteller_display_name || story.storyteller_name || 'Storyteller'}
                className="h-14 w-14 rounded-full object-cover ring-2 ring-white shadow-md"
              />
            )}
            <div>
              <p className="font-semibold text-[var(--we-olive)]">
                {story.storyteller_display_name || story.storyteller_name}
              </p>
              {story.themes && story.themes.length > 0 && (
                <p className="text-sm text-[var(--we-brown-deep)]">
                  {story.themes.slice(0, 2).join(' · ')}
                </p>
              )}
            </div>
          </div>

          {/* Story Title & Link */}
          <div className="rounded-2xl border border-[var(--we-sand)] bg-white p-6">
            <h3 className="font-[var(--font-display)] text-lg font-semibold text-[var(--we-olive)]">
              {story.story_title}
            </h3>
            <p className="mt-2 text-sm text-[var(--we-olive-deep)]">
              Part of the {projectTitle} project, shared through Empathy Ledger.
            </p>
            <a
              href={storyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-4 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition ${style.button}`}
            >
              Read full story on Empathy Ledger
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>

          <div className="rounded-2xl border border-[var(--we-sand)] bg-[var(--warm-paper)] px-5 py-4 text-sm text-[var(--we-brown-deep)]">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--we-warm-brown)]">
              Live story layer
            </p>
            <p className="mt-2 leading-7">
              This field story is part of the consented Empathy Ledger layer connected to{" "}
              {projectTitle}. The project page holds the framing; the story system keeps the
              human record alive.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
