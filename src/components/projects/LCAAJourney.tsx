/**
 * LCAA Journey Component
 * Visual timeline showing Listen → Curiosity → Action → Art with project content
 */
import type { ProjectTheme } from '@/data/projects';
import { themeStyles } from '@/lib/projects';

interface LCAAJourneyProps {
  listen?: string;
  curiosity?: string;
  action?: string;
  art?: string;
  theme: ProjectTheme;
}

const phases = [
  {
    key: 'listen',
    title: 'Listen',
    description: 'Deep listening to place, people, history, community voice',
  },
  {
    key: 'curiosity',
    title: 'Curiosity',
    description: 'Think deeply, prototype boldly, test rigorously',
  },
  {
    key: 'action',
    title: 'Action',
    description: 'Build tangible solutions alongside communities',
  },
  {
    key: 'art',
    title: 'Art',
    description: 'Translate change into culture, challenge status quo',
  },
] as const;

function PhaseCard({
  phase,
  content,
  isActive,
  index,
  theme,
}: {
  phase: (typeof phases)[number];
  content: string | undefined;
  isActive: boolean;
  index: number;
  theme: ProjectTheme;
}) {
  const style = themeStyles[theme];
  const hasContent = !!content;

  return (
    <div className="relative">
      {/* Connection line to next phase */}
      {index < 3 && (
        <div className="absolute -right-6 top-1/2 hidden w-12 lg:block">
          <svg
            className="h-6 w-full text-[var(--we-sand)]"
            viewBox="0 0 48 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M0 12 L48 12" strokeDasharray="4 4" />
            <path d="M40 6 L48 12 L40 18" strokeLinecap="round" />
          </svg>
        </div>
      )}

      <div
        className={`rounded-3xl border p-6 transition-all duration-300 ${
          hasContent
            ? `border-[var(--we-sand)] bg-white/70 shadow-sm hover:shadow-md`
            : 'border-dashed border-[var(--we-sand)]/50 bg-white/30'
        }`}
        style={{ transitionDelay: `${index * 60}ms` }}
      >
        {/* Phase header */}
        <div className="mb-4 flex items-center gap-3">
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-xs font-semibold tracking-[0.18em] ${
              hasContent
                ? `${style.badge} border-transparent`
                : 'border-[#D7C4A2] text-[#A0A0A0]'
            }`}
          >
            {String(index + 1).padStart(2, '0')}
          </span>
          <div>
            <h3
              className={`font-[var(--font-display)] text-xl font-semibold ${
                hasContent ? style.text : 'text-[#A0A0A0]'
              }`}
            >
              {phase.title}
            </h3>
            {!hasContent && (
              <p className="text-xs text-[#A0A0A0]">{phase.description}</p>
            )}
          </div>
          {isActive && hasContent && (
            <span
              className={`ml-auto rounded-full px-2 py-0.5 text-xs ${style.badge}`}
            >
              Current
            </span>
          )}
        </div>

        {/* Phase content */}
        {hasContent ? (
          <p className="text-sm leading-relaxed text-[#2A2318]">{content}</p>
        ) : (
          <p className="text-sm italic text-[#8A8A8A]">
            This phase is in development...
          </p>
        )}
      </div>
    </div>
  );
}

export function LCAAJourney({
  listen,
  curiosity,
  action,
  art,
  theme,
}: LCAAJourneyProps) {
  const contentMap: Record<string, string | undefined> = {
    listen,
    curiosity,
    action,
    art,
  };

  // Determine active phase (latest phase with content)
  const getActivePhase = () => {
    if (art) return 'art';
    if (action) return 'action';
    if (curiosity) return 'curiosity';
    if (listen) return 'listen';
    return null;
  };

  const activePhase = getActivePhase();

  // Don't render if no LCAA content at all
  if (!listen && !curiosity && !action && !art) {
    return null;
  }

  return (
    <section className="space-y-8">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--we-brown-deep)]">
          Our Process
        </p>
        <h2 className="mt-2 font-[var(--font-display)] text-2xl font-semibold text-[var(--we-olive)] md:text-3xl">
          How we work: Listen, Curiosity, Action, Art
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-[var(--we-olive-deep)]">
          Every project follows our methodology of Listen, Curiosity, Action, and Art, 
          transforming community challenges into lasting solutions.
        </p>
      </div>

      {/* Desktop: horizontal timeline */}
      <div className="hidden lg:grid lg:grid-cols-4 lg:gap-12">
        {phases.map((phase, index) => (
          <PhaseCard
            key={phase.key}
            phase={phase}
            content={contentMap[phase.key]}
            isActive={phase.key === activePhase}
            index={index}
            theme={theme}
          />
        ))}
      </div>

      {/* Mobile/Tablet: vertical stack */}
      <div className="grid gap-6 lg:hidden">
        {phases.map((phase, index) => (
          <PhaseCard
            key={phase.key}
            phase={phase}
            content={contentMap[phase.key]}
            isActive={phase.key === activePhase}
            index={index}
            theme={theme}
          />
        ))}
      </div>

      {/* Progress indicator */}
      <div className="flex justify-center">
        <div className="flex items-center gap-2">
          {phases.map((phase, idx) => (
            <div
              key={phase.key}
              className={`h-2 rounded-full transition-all ${
                contentMap[phase.key]
                  ? 'w-8 bg-[#4CAF50]'
                  : 'w-2 bg-[var(--we-sand)]'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
