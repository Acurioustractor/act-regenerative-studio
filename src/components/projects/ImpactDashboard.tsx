/**
 * Impact Dashboard Component
 * Stats grid with animated counters, quote highlight, and Empathy Ledger badge
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import type { ProjectTheme } from '@/data/projects';
import { themeStyles } from '@/lib/projects';

interface ImpactDashboardProps {
  stats?: Array<{ value: string; label: string }>;
  quote?: {
    text: string;
    author: string;
    role: string;
  };
  storytellerCount?: number;
  storyCount?: number;
  mediaCount?: number;
  galleryCount?: number;
  theme: ProjectTheme;
}

function AnimatedStat({
  value,
  label,
  index,
  theme,
}: {
  value: string;
  label: string;
  index: number;
  theme: ProjectTheme;
}) {
  const style = themeStyles[theme];
  const [displayValue, setDisplayValue] = useState('0');
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    // Extract numeric part and suffix
    const numericMatch = value.match(/^([\d,]+)/);
    const suffix = value.replace(/^[\d,]+/, '');

    if (!numericMatch) {
      setDisplayValue(value);
      return;
    }

    const targetNum = parseInt(numericMatch[1].replace(/,/g, ''), 10);
    const duration = 1500;
    const steps = 30;
    const stepTime = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = Math.min(currentStep / steps, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(targetNum * eased);
      setDisplayValue(current.toLocaleString() + suffix);

      if (currentStep >= steps) {
        clearInterval(timer);
        setDisplayValue(value);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isVisible, value]);

  return (
    <div
      ref={ref}
      className={`rounded-3xl border border-[var(--we-sand)] bg-white/70 p-6 text-center transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div
        className={`text-3xl font-bold ${style.accent} font-[var(--font-display)] md:text-4xl`}
      >
        {displayValue}
      </div>
      <div className="mt-2 text-sm text-[#3A3025]">{label}</div>
    </div>
  );
}

export function ImpactDashboard({
  stats,
  quote,
  storytellerCount,
  storyCount,
  mediaCount,
  galleryCount,
  theme,
}: ImpactDashboardProps) {
  const style = themeStyles[theme];

  // Don't render if no content
  if (!stats?.length && !quote && !storytellerCount) {
    return null;
  }

  return (
    <section className="space-y-8">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--we-brown-deep)]">
          Impact
        </p>
        <h2 className="mt-2 font-[var(--font-display)] text-2xl font-semibold text-[var(--we-olive)] md:text-3xl">
          What we've achieved together
        </h2>
      </div>

      {/* Stats grid - centers when 3 or fewer stats */}
      {stats && stats.length > 0 && (
        <div
          className={`grid gap-4 ${
            stats.length === 1
              ? 'grid-cols-1 max-w-xs mx-auto'
              : stats.length === 2
                ? 'grid-cols-2 max-w-lg mx-auto'
                : stats.length === 3
                  ? 'grid-cols-1 sm:grid-cols-3 max-w-3xl mx-auto'
                  : 'grid-cols-2 md:grid-cols-4'
          }`}
        >
          {stats.map((stat, idx) => (
            <AnimatedStat
              key={idx}
              value={stat.value}
              label={stat.label}
              index={idx}
              theme={theme}
            />
          ))}
        </div>
      )}

      {/* Quote highlight */}
      {quote && (
        <div
          className="rounded-3xl border border-[#C9B896] bg-[var(--we-olive)] p-8 md:p-12"
        >
          <div className="mx-auto max-w-3xl text-center">
            <svg
              className="mx-auto mb-6 h-8 w-8 text-[#7A9B76] opacity-60"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
            <blockquote
              className="font-[var(--font-display)] text-xl font-medium leading-relaxed text-white md:text-2xl"
            >
              {quote.text}
            </blockquote>
            <div className="mt-6 text-sm text-[#C9D4C0]">
              <p className="font-semibold">{quote.author}</p>
              <p className="text-xs opacity-80">{quote.role}</p>
            </div>
          </div>
        </div>
      )}

      {/* Empathy Ledger badge (if connected) */}
      {(storytellerCount || storyCount || mediaCount || galleryCount) && (
        <div className="flex justify-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-3 rounded-full border border-[var(--we-sand)] bg-white/80 px-5 py-2.5">
            <div className="flex items-center gap-2 text-sm text-[var(--we-brown-deep)]">
              <span className="text-lg">📖</span>
              <span>Powered by</span>
              <a
                href={process.env.NEXT_PUBLIC_EMPATHY_LEDGER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[#B85C38] hover:underline"
              >
                Empathy Ledger
              </a>
            </div>
            {storytellerCount && (
              <span className="rounded-full bg-[#F6F1E7] px-3 py-1 text-xs text-[var(--we-brown-deep)]">
                {storytellerCount} storyteller{storytellerCount !== 1 ? 's' : ''}
              </span>
            )}
            {storyCount && (
              <span className="rounded-full bg-[#F6F1E7] px-3 py-1 text-xs text-[var(--we-brown-deep)]">
                {storyCount} {storyCount !== 1 ? 'stories' : 'story'}
              </span>
            )}
            {mediaCount && (
              <span className="rounded-full bg-[#F6F1E7] px-3 py-1 text-xs text-[var(--we-brown-deep)]">
                {mediaCount} media assets
              </span>
            )}
            {galleryCount && (
              <span className="rounded-full bg-[#F6F1E7] px-3 py-1 text-xs text-[var(--we-brown-deep)]">
                {galleryCount} {galleryCount !== 1 ? 'galleries' : 'gallery'}
              </span>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
