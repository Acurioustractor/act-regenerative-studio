/**
 * Story Vignettes Section
 * Card-based layout for community vignettes with ALMA signals and voice attribution
 */

import { getAlmaBadge, themeStyles, type ProjectVignette } from '@/lib/projects';
import type { ProjectTheme } from '@/data/projects';

interface StoryVignettesSectionProps {
  vignettes: ProjectVignette[];
  projectTitle: string;
  theme: ProjectTheme;
}

function VignetteCard({ vignette, theme }: { vignette: ProjectVignette; theme: ProjectTheme }) {
  const style = themeStyles[theme];
  const { frontmatter, excerpt } = vignette;
  const almaBadge = getAlmaBadge(frontmatter.alma_signals?.overall_score || 0);

  // Extract a quote from the content if available
  const contentLines = vignette.content.split('\n');
  let quote = '';
  for (const line of contentLines) {
    if (line.trim().startsWith('>') && !line.includes('pending')) {
      quote = line.replace(/^>\s*/, '').replace(/\*+/g, '').trim();
      if (quote.length > 10) break;
    }
  }

  return (
    <div className="group rounded-[24px] border border-[var(--we-sand)] bg-white p-6 transition-all hover:shadow-lg hover:border-[var(--warm-sage)]">
      {/* Header with voice owner and role */}
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h4 className="font-[var(--font-display)] text-lg font-semibold text-[var(--we-olive)] group-hover:text-forest-sage">
            {frontmatter.voice_owner}
          </h4>
          <p className="text-sm text-[var(--we-brown-deep)]">{frontmatter.voice_role}</p>
        </div>
        {/* LCAA Stage badge */}
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${style.badge}`}
        >
          {frontmatter.lcaa_stage}
        </span>
      </div>

      {/* Quote callout (if available) */}
      {quote && (
        <blockquote className="mb-4 border-l-4 border-[#7A9B76]/30 pl-4 text-sm italic text-[var(--we-olive-deep)]">
          "{quote.slice(0, 150)}{quote.length > 150 ? '...' : ''}"
        </blockquote>
      )}

      {/* Excerpt */}
      <p className="text-sm text-[var(--we-olive-deep)] leading-relaxed mb-4">
        {excerpt || frontmatter.title}
      </p>

      {/* Footer with ALMA badge and metadata */}
      <div className="flex items-center justify-between pt-4 border-t border-[var(--we-sand)]/50">
        {almaBadge ? (
          <span className="flex items-center gap-1.5 text-xs text-forest-sage">
            <svg
              className="h-3.5 w-3.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clipRule="evenodd"
              />
            </svg>
            {almaBadge}
          </span>
        ) : (
          <span className="text-xs text-[var(--we-brown-deep)]">
            {frontmatter.authority_marker}
          </span>
        )}
        <span className="text-xs text-[var(--we-brown-deep)]">
          {frontmatter.place_country}
        </span>
      </div>
    </div>
  );
}

export function StoryVignettesSection({
  vignettes,
  projectTitle,
  theme,
}: StoryVignettesSectionProps) {
  if (!vignettes || vignettes.length === 0) {
    return null;
  }

  return (
    <section className="space-y-8">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--we-brown-deep)]">
          Community Stories
        </p>
        <h2 className="mt-2 font-[var(--font-display)] text-2xl font-semibold text-[var(--we-olive)] md:text-3xl">
          Voices from this work
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-[var(--we-olive-deep)]">
          Real stories from people connected to {projectTitle}, curated from our
          community vignette collection.
        </p>
      </div>

      {/* Vignette cards grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {vignettes.map((vignette) => (
          <VignetteCard
            key={vignette.frontmatter.slug}
            vignette={vignette}
            theme={theme}
          />
        ))}
      </div>

      {/* Consent note */}
      <p className="text-center text-xs text-[var(--we-brown-deep)]">
        All stories shared with consent through our ethical storytelling protocols.
      </p>
    </section>
  );
}
