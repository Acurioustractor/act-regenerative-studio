/**
 * Project Hero Section
 * Full-width cover image with gradient overlay, animated stat counters, LCAA phase indicator
 */

'use client';

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import type { CoverImage } from '@/lib/projects';
import type { ProjectTheme } from '@/data/projects';
import { themeStyles } from '@/lib/projects';
import { SiteLoopVideo } from '@/components/media/SiteLoopVideo';

interface ProjectHeroProps {
  title: string;
  tagline: string;
  description: string;
  theme: ProjectTheme;
  coverImage: CoverImage | null;
  coverVideo?: {
    url: string;
    posterUrl?: string | null;
    title: string;
  } | null;
  focus: string[];
  lcaaStage?: 'Listen' | 'Curiosity' | 'Action' | 'Art';
  stats?: Array<{ value: string; label: string }>;
}

function shouldContainCoverImage(coverImage: CoverImage | null) {
  if (!coverImage) return false;

  const url = coverImage.url.toLowerCase();

  return (
    coverImage.source === 'static' &&
    (url.endsWith('.png') || url.endsWith('.webp'))
  );
}

function AnimatedCounter({ value, label }: { value: string; label: string }) {
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
      // Ease out cubic
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
    <div ref={ref} className="text-center">
      <div className="text-3xl font-bold font-[var(--font-display)] md:text-4xl">
        {displayValue}
      </div>
      <div className="mt-1 text-xs uppercase tracking-wide opacity-80">{label}</div>
    </div>
  );
}

const lcaaStageColors = {
  Listen: { bg: 'bg-blue-500/20', text: 'text-blue-600', icon: '👂' },
  Curiosity: { bg: 'bg-purple-500/20', text: 'text-purple-600', icon: '🔍' },
  Action: { bg: 'bg-orange-500/20', text: 'text-orange-600', icon: '⚡' },
  Art: { bg: 'bg-pink-500/20', text: 'text-pink-600', icon: '🎨' },
};

export function ProjectHero({
  title,
  tagline,
  description,
  theme,
  coverImage,
  coverVideo = null,
  focus,
  lcaaStage,
  stats,
}: ProjectHeroProps) {
  const style = themeStyles[theme];
  const containCoverImage = shouldContainCoverImage(coverImage);
  const hasHeroMedia = Boolean(coverVideo || coverImage);

  return (
    <div className="space-y-0">
      {/* Full-width Hero Media */}
      {hasHeroMedia && (
        <div
          className={`relative w-full overflow-hidden rounded-t-[32px] ${
            !coverVideo && containCoverImage
              ? 'flex min-h-[320px] items-center justify-center border border-b-0 border-[#D9C9A9] bg-[#F0E7D8] px-6 py-8 md:min-h-[360px] md:px-10 md:py-10'
              : 'h-[50vh] min-h-[400px] max-h-[600px]'
          }`}
        >
          {!coverVideo && containCoverImage ? (
            <div className="absolute inset-0 bg-gradient-to-br from-[#F4EEE3] via-[#E8DECD] to-[#DCCFB7]" />
          ) : null}
          {coverVideo ? (
            <SiteLoopVideo
              src={coverVideo.url}
              poster={coverVideo.posterUrl || coverImage?.url || undefined}
              title={coverVideo.title}
              className="h-full w-full object-cover"
              preload="metadata"
            />
          ) : coverImage ? (
            <img
              src={coverImage.url}
              alt={coverImage.alt}
              className={`relative z-10 h-full w-full ${
                containCoverImage
                  ? 'max-h-[280px] object-contain drop-shadow-[0_24px_60px_rgba(0,0,0,0.22)] md:max-h-[320px]'
                  : 'object-cover'
              }`}
            />
          ) : null}
          {/* Gradient overlay at bottom */}
          {(coverVideo || !containCoverImage) ? (
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          ) : null}

          {/* Source badge */}
          {coverVideo ? (
            <div className="absolute bottom-4 right-4 rounded-full border border-white/15 bg-black/35 px-3 py-1 text-xs uppercase tracking-[0.22em] text-white backdrop-blur-sm">
              Field video
            </div>
          ) : coverImage?.source === 'media_gallery' && !containCoverImage ? (
            <div className="absolute bottom-4 right-4 rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-xs text-white">
              📸 Media Gallery
            </div>
          ) : containCoverImage ? (
            <div className="absolute bottom-4 right-4 z-10 rounded-full border border-[#D9C9A9] bg-white/80 px-3 py-1 text-xs text-[#4A4035] shadow-sm">
              Interface snapshot
            </div>
          ) : null}
        </div>
      )}

      {/* Hero Content Panel */}
      <section
        className={`relative overflow-hidden ${hasHeroMedia ? 'rounded-b-[32px]' : 'rounded-[32px]'} border ${style.border} p-8 md:p-12 ${
          theme === 'justice'
            ? 'bg-[#0B1F2A]'
            : `bg-gradient-to-br ${style.hero}`
        }`}
      >
        {/* Top bar with back link and badges */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/projects"
            className={`text-xs uppercase tracking-[0.3em] transition hover:opacity-80 ${
              theme === 'justice' ? 'text-[#F4D04F]' : style.accent
            }`}
          >
            ← Back to projects
          </Link>
          <div className="flex items-center gap-3">
            {lcaaStage && (
              <span
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium ${lcaaStageColors[lcaaStage].bg} ${lcaaStageColors[lcaaStage].text}`}
              >
                <span>{lcaaStageColors[lcaaStage].icon}</span>
                {lcaaStage} Phase
              </span>
            )}
            <span
              className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] ${
                theme === 'justice'
                  ? 'bg-[#F4D04F] text-[#0B1F2A]'
                  : style.badge
              }`}
            >
              Active seed
            </span>
          </div>
        </div>

        {/* Main content grid */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <h1
              className={`font-[var(--font-display)] text-3xl font-semibold leading-tight md:text-5xl ${
                theme === 'justice' ? 'text-[#F4D04F]' : style.text
              }`}
            >
              {title}
            </h1>
            <p className={`text-lg md:text-xl font-medium ${
              theme === 'justice' ? 'text-white' : style.sub
            }`}>
              {tagline}
            </p>
            <p className={`text-sm md:text-base leading-relaxed ${
              theme === 'justice' ? 'text-[#B8C9D6]' : style.sub
            }`}>
              {description}
            </p>
          </div>

          {/* Focus areas panel */}
          <div
            className={`rounded-3xl border ${style.border} ${
              theme === 'justice' ? 'bg-[#1A3040]' : style.panel
            } p-5 text-sm`}
          >
            <p className={`text-xs uppercase tracking-[0.3em] ${style.accent}`}>
              Focus areas
            </p>
            <ul className="mt-4 space-y-2">
              {focus.map((f) => (
                <li key={f} className={`rounded-2xl p-3 ${
                  theme === 'justice'
                    ? 'bg-[#0B1F2A] text-white border border-[#315060]'
                    : 'bg-white text-[#2F3E2E] shadow-sm'
                }`}>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Stats row (if provided) */}
        {stats && stats.length > 0 && (
          <div
            className={`mt-8 grid grid-cols-2 gap-4 rounded-2xl ${style.panel} p-6 md:grid-cols-4 ${style.text}`}
          >
            {stats.map((stat, idx) => (
              <AnimatedCounter key={idx} value={stat.value} label={stat.label} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
