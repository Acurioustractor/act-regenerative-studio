/**
 * ALMA Insights Section
 * Displays core learnings and outcomes from the ALMA system
 * Shows community authority signals and key insights from vignettes
 */

import type { ProjectVignette } from '@/lib/projects/get-project-vignettes';
import type { ProjectTheme } from '@/data/projects';
import { themeStyles, getAlmaBadge } from '@/lib/projects';

interface ALMAInsightsSectionProps {
  vignettes: ProjectVignette[];
  projectTitle: string;
  theme: ProjectTheme;
}

// ALMA signal labels and descriptions
const almaSignalInfo = {
  evidence_strength: {
    label: 'Evidence Strength',
    description: 'How well-documented and verified the insights are',
    icon: '📊',
  },
  community_authority: {
    label: 'Community Authority',
    description: 'Validation from community members and leaders',
    icon: '👥',
  },
  harm_risk_inverted: {
    label: 'Safety Score',
    description: 'Low risk of harm when sharing or acting on insights',
    icon: '🛡️',
  },
  implementation_capability: {
    label: 'Actionability',
    description: 'Practical ability to implement the learnings',
    icon: '⚙️',
  },
  community_value_return: {
    label: 'Community Value',
    description: 'Benefit returned to the community',
    icon: '🌱',
  },
};

function SignalBar({ value, max = 5 }: { value: number; max?: number }) {
  const percentage = (value / max) * 100;
  return (
    <div className="h-2 w-full rounded-full bg-[#E3D4BA]/50">
      <div
        className="h-2 rounded-full bg-gradient-to-r from-[#7A9B76] to-[#4CAF50] transition-all duration-500"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

export function ALMAInsightsSection({
  vignettes,
  projectTitle,
  theme,
}: ALMAInsightsSectionProps) {
  const style = themeStyles[theme];

  if (vignettes.length === 0) {
    return null;
  }

  // Aggregate ALMA signals across all vignettes
  const aggregatedSignals = vignettes.reduce(
    (acc, v) => {
      const signals = v.frontmatter.alma_signals;
      if (signals) {
        acc.evidence_strength += signals.evidence_strength || 0;
        acc.community_authority += signals.community_authority || 0;
        acc.harm_risk_inverted += signals.harm_risk_inverted || 0;
        acc.implementation_capability += signals.implementation_capability || 0;
        acc.community_value_return += signals.community_value_return || 0;
        acc.count += 1;
      }
      return acc;
    },
    {
      evidence_strength: 0,
      community_authority: 0,
      harm_risk_inverted: 0,
      implementation_capability: 0,
      community_value_return: 0,
      count: 0,
    }
  );

  // Calculate averages
  const avgSignals = aggregatedSignals.count > 0
    ? {
        evidence_strength: aggregatedSignals.evidence_strength / aggregatedSignals.count,
        community_authority: aggregatedSignals.community_authority / aggregatedSignals.count,
        harm_risk_inverted: aggregatedSignals.harm_risk_inverted / aggregatedSignals.count,
        implementation_capability: aggregatedSignals.implementation_capability / aggregatedSignals.count,
        community_value_return: aggregatedSignals.community_value_return / aggregatedSignals.count,
      }
    : null;

  // Get the highest-scoring vignette for key learnings
  const topVignette = vignettes.reduce((best, current) => {
    const bestScore = best.frontmatter.alma_signals?.overall_score || 0;
    const currentScore = current.frontmatter.alma_signals?.overall_score || 0;
    return currentScore > bestScore ? current : best;
  }, vignettes[0]);

  const topAlmaScore = topVignette.frontmatter.alma_signals?.overall_score || 0;
  const almaBadge = getAlmaBadge(topAlmaScore);

  // Extract key learnings (LCAA shifts from vignettes)
  const keyLearnings = vignettes
    .filter((v) => v.frontmatter.lcaa_shift)
    .map((v) => ({
      shift: v.frontmatter.lcaa_shift,
      stage: v.frontmatter.lcaa_stage,
      voice: v.frontmatter.voice_owner,
      authority: v.frontmatter.authority_marker,
    }))
    .slice(0, 3);

  return (
    <section className="space-y-8">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-[#4A4035]">
          ALMA Insights
        </p>
        <h2 className="mt-2 font-[var(--font-display)] text-2xl font-semibold text-[#2F3E2E] md:text-3xl">
          Core Learnings & Outcomes
        </h2>
        <p className="mt-3 text-sm text-[#3A4A3D] max-w-2xl mx-auto">
          Insights verified through our ALMA (Adaptive Learning & Mapping Algorithm) system,
          ensuring community authority and evidence-based outcomes.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        {/* ALMA Signal Dashboard */}
        {avgSignals && (
          <div className="rounded-[24px] border border-[#E3D4BA] bg-white p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-[#2F3E2E]">Community Validation Signals</h3>
              {almaBadge && (
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${style.badge}`}>
                  {almaBadge}
                </span>
              )}
            </div>

            <div className="space-y-4">
              {Object.entries(almaSignalInfo).map(([key, info]) => {
                const value = avgSignals[key as keyof typeof avgSignals];
                return (
                  <div key={key} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-[#2F3E2E]">
                        <span>{info.icon}</span>
                        {info.label}
                      </span>
                      <span className="font-medium text-[#3A4A3D]">
                        {value.toFixed(1)}/5
                      </span>
                    </div>
                    <SignalBar value={value} />
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-[#E3D4BA]">
              <p className="text-xs text-[#4A4035]">
                Based on {aggregatedSignals.count} community-verified {aggregatedSignals.count === 1 ? 'story' : 'stories'}
              </p>
            </div>
          </div>
        )}

        {/* Key Learnings */}
        <div className="space-y-4">
          <h3 className="font-semibold text-[#2F3E2E]">Voices from the Work</h3>

          {keyLearnings.length > 0 ? (
            <div className="space-y-4">
              {keyLearnings.map((learning, idx) => (
                <div
                  key={idx}
                  className="rounded-[20px] border border-[#E3D4BA] bg-white p-5"
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${style.badge}`}>
                      {learning.stage === 'Listen' && '👂'}
                      {learning.stage === 'Curiosity' && '🔍'}
                      {learning.stage === 'Action' && '⚡'}
                      {learning.stage === 'Art' && '🎨'}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="font-semibold text-[#2F3E2E]">{learning.voice}</span>
                        {learning.authority && (
                          <span className="rounded-full bg-[#E5F4E4] px-2 py-0.5 text-xs text-[#3D7A4D]">
                            {learning.authority}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-[#4A4035]">
                        Contributed insights during the <span className="font-medium">{learning.stage}</span> phase
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-[20px] border border-[#E3D4BA] bg-white p-6 text-center">
              <p className="text-sm text-[#4A4035]">
                Key learnings are being gathered from community voices.
              </p>
            </div>
          )}

          {/* Featured Quote from Top Vignette */}
          {topVignette.excerpt && (
            <div className="rounded-[20px] border border-[#C9B896] bg-[#2F3E2E] p-6">
              <blockquote className="space-y-3">
                <p className="text-lg leading-relaxed text-white italic">
                  "{topVignette.excerpt}"
                </p>
                <footer className="text-sm text-[#C9D4C0]">
                  — {topVignette.frontmatter.voice_owner}
                  {topVignette.frontmatter.voice_role && (
                    <span className="opacity-80">, {topVignette.frontmatter.voice_role}</span>
                  )}
                </footer>
              </blockquote>
            </div>
          )}
        </div>
      </div>

      {/* ALMA Methodology Note */}
      <div className="rounded-2xl border border-[#E3D4BA] bg-[#F6F1E7] p-6 text-center">
        <p className="text-sm text-[#3A4A3D]">
          <span className="font-medium">What is ALMA?</span> Our Adaptive Learning & Mapping Algorithm
          ensures insights are community-verified, ethically gathered, and actionable.
          It prioritizes Indigenous data sovereignty and community authority over extractive research practices.
        </p>
      </div>
    </section>
  );
}
