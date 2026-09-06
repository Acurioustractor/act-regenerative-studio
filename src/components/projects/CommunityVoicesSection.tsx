/**
 * Community Voices Section
 * Displays featured storytellers and stories from Empathy Ledger
 * Uses tag-based system where storytellers opt-in and ACT admins approve
 */

import Link from 'next/link';

import type {
  FeaturedStoryteller,
  FeaturedStory,
} from '@/lib/empathy-ledger-featured';
import { getStorytellerById } from '@/lib/empathy-ledger-storytellers';

interface CommunityVoicesSectionProps {
  storytellers: FeaturedStoryteller[];
  stories: FeaturedStory[];
  projectTitle: string;
}

export function CommunityVoicesSection({
  storytellers,
  stories,
  projectTitle,
}: CommunityVoicesSectionProps) {
  if (storytellers.length === 0 && stories.length === 0) {
    return null; // Don't show section if no content
  }

  return (
    <section className="space-y-12">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--we-brown-deep)]">
          Community Voices
        </p>
        <h2 className="mt-2 font-[var(--font-display)] text-2xl font-semibold text-[var(--we-olive)] md:text-3xl">
          Stories from this work
        </h2>
        <p className="mt-4 text-[var(--we-olive-deep)]">
          Real stories from people connected to {projectTitle}, shared through
          Empathy Ledger
        </p>
      </div>

      {/* Featured Storytellers */}
      {storytellers.length > 0 && (
        <div className="space-y-6">
          <h3 className="font-[var(--font-display)] text-xl font-semibold text-[var(--we-olive)]">
            Featured Storytellers
          </h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {storytellers.map((storyteller) => {
              const hasProfile = Boolean(getStorytellerById(storyteller.storyteller_id));
              const cardClass =
                'rounded-[24px] border border-[var(--we-sand)] bg-white p-6 transition-shadow hover:shadow-lg' +
                (hasProfile ? ' hover:border-[var(--warm-sage)]' : '');
              const inner = (
                <>
                  {storyteller.profile_image_url && (
                    <img
                      src={storyteller.profile_image_url}
                      alt={
                        storyteller.display_name ||
                        storyteller.full_name ||
                        'Storyteller'
                      }
                      className="mb-4 h-24 w-24 rounded-full object-cover"
                    />
                  )}
                  <h4 className="font-[var(--font-display)] text-lg font-semibold text-[var(--we-olive)]">
                    {storyteller.display_name || storyteller.full_name}
                  </h4>
                  {storyteller.current_role && storyteller.current_organization && (
                    <p className="mt-1 text-sm text-[var(--we-brown-deep)]">
                      {storyteller.current_role} at{' '}
                      {storyteller.current_organization}
                    </p>
                  )}
                  {storyteller.custom_tagline && (
                    <p className="mt-2 text-sm italic text-forest-sage">
                      {storyteller.custom_tagline}
                    </p>
                  )}
                  <p className="mt-3 text-sm text-[var(--we-olive-deep)]">
                    {storyteller.featured_bio}
                  </p>
                  <div className="mt-3 flex items-center justify-between text-xs text-[var(--we-brown-deep)]">
                    {storyteller.featured_story_count > 0 ? (
                      <span>
                        {storyteller.featured_story_count}{' '}
                        {storyteller.featured_story_count === 1 ? 'story' : 'stories'}
                      </span>
                    ) : (
                      <span />
                    )}
                    {hasProfile ? (
                      <span className="uppercase tracking-[0.22em]">View profile →</span>
                    ) : null}
                  </div>
                </>
              );
              return hasProfile ? (
                <Link
                  key={storyteller.storyteller_id}
                  href={`/storytellers/${encodeURIComponent(storyteller.storyteller_id)}`}
                  className={cardClass}
                >
                  {inner}
                </Link>
              ) : (
                <div key={storyteller.storyteller_id} className={cardClass}>
                  {inner}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Featured Stories */}
      {stories.length > 0 && (
        <div className="space-y-6">
          <h3 className="font-[var(--font-display)] text-xl font-semibold text-[var(--we-olive)]">
            Featured Stories
          </h3>
          <div className="grid gap-6 md:grid-cols-2">
            {stories.map((story) => (
              <a
                key={story.story_id}
                href={story.story_url || `${process.env.NEXT_PUBLIC_EMPATHY_LEDGER_URL}/stories/${story.story_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-[24px] border border-[var(--we-sand)] bg-white overflow-hidden transition-all hover:shadow-lg hover:border-[var(--warm-sage)]"
              >
                {story.featured_image_url && (
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={story.featured_image_url}
                      alt={story.story_title}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                    {story.featured_as_hero && (
                      <div className="absolute top-4 right-4 rounded-full bg-[#B85C38] px-3 py-1 text-xs font-medium text-white">
                        Featured
                      </div>
                    )}
                  </div>
                )}
                <div className="p-6">
                  <h4 className="font-[var(--font-display)] text-lg font-semibold text-[var(--we-olive)] group-hover:text-forest-sage">
                    {story.story_title}
                  </h4>
                  <p className="mt-1 text-sm text-[var(--we-brown-deep)]">
                    by {story.storyteller_display_name || story.storyteller_name}
                  </p>
                  {story.excerpt && (
                    <p className="mt-3 text-sm text-[var(--we-olive-deep)] line-clamp-3">
                      {story.excerpt}
                    </p>
                  )}
                  {story.themes && story.themes.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {story.themes.slice(0, 3).map((theme) => (
                        <span
                          key={theme}
                          className="rounded-full bg-[var(--warm-paper)] px-3 py-1 text-xs text-[var(--we-brown-deep)]"
                        >
                          {theme}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="mt-4 text-sm font-medium text-forest-sage group-hover:underline">
                    Read full story →
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Link to Empathy Ledger */}
      <div className="text-center rounded-[24px] border border-[var(--we-sand)] bg-gradient-to-br from-[var(--warm-paper)] to-[#E7DDC7] p-8">
        <p className="text-sm text-[var(--we-brown-deep)]">
          These stories are powered by{' '}
          <a
            href={process.env.NEXT_PUBLIC_EMPATHY_LEDGER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[#B85C38] hover:underline"
          >
            Empathy Ledger
          </a>
          , a platform for community storytelling and Indigenous data sovereignty.
        </p>
      </div>
    </section>
  );
}
