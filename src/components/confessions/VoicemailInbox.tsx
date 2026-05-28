'use client';

import { useEffect, useState } from 'react';

import type { Confession, ConfessionTheme } from '@/data/confessions-mock';
import { themeMeta, themeOrder } from '@/data/confessions-mock';

import { formatDuration, renderTranscript } from './transcript';
import { Waveform } from './Waveform';

function PlayIcon({ playing }: { playing: boolean }) {
  return playing ? (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" className="h-4 w-4 translate-x-[1px]" fill="currentColor" aria-hidden="true">
      <path d="M8 5.5v13a1 1 0 0 0 1.5.87l11-6.5a1 1 0 0 0 0-1.74l-11-6.5A1 1 0 0 0 8 5.5Z" />
    </svg>
  );
}

export function VoicemailInbox({ confessions }: { confessions: Confession[] }) {
  const [filter, setFilter] = useState<ConfessionTheme | 'all'>('all');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  // Sweep a playhead across the scrubber. No audio yet, so the duration is
  // scaled to a watchable few seconds; swaps to the real recording later.
  useEffect(() => {
    if (!playingId) return;
    const conf = confessions.find((c) => c.id === playingId);
    if (reduced) {
      setProgress(1);
      const id = setTimeout(() => setPlayingId(null), 900);
      return () => clearTimeout(id);
    }
    const durMs = Math.min(Math.max((conf?.durationSeconds ?? 3) * 110, 1800), 6000);
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / durMs);
      setProgress(p);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setPlayingId(null);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playingId, reduced, confessions]);

  const counts = themeOrder
    .map((t) => ({ t, n: confessions.filter((c) => c.theme === t).length }))
    .filter((x) => x.n > 0);
  const shown = filter === 'all' ? confessions : confessions.filter((c) => c.theme === filter);

  const toggle = (id: string) => {
    setProgress(0);
    setPlayingId((cur) => (cur === id ? null : id));
  };

  return (
    <div className="mx-auto max-w-3xl">
      {/* Theme filters, doubling as the shape of what is coming through. */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`rounded-full border px-4 py-1.5 font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors ${
            filter === 'all'
              ? 'border-[#CFA16B] bg-[#CFA16B]/10 text-[#EFE6D2]'
              : 'border-[#3A2C18] text-[#9A8C73] hover:border-[#5A4A30]'
          }`}
        >
          All <span className="font-mono">{confessions.length}</span>
        </button>
        {counts.map(({ t, n }) => {
          const active = filter === t;
          return (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className="rounded-full border px-4 py-1.5 font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors"
              style={{
                borderColor: active ? `rgb(${themeMeta[t].rgb})` : '#3A2C18',
                color: active ? '#EFE6D2' : '#9A8C73',
                background: active ? `rgba(${themeMeta[t].rgb},0.1)` : 'transparent',
              }}
            >
              {themeMeta[t].label} <span className="font-mono">{n}</span>
            </button>
          );
        })}
      </div>

      {/* The inbox. */}
      <ul className="mt-10 overflow-hidden rounded-2xl border border-[#3A2C18] bg-[#1A130B]">
        {shown.map((c) => {
          const playing = playingId === c.id;
          const t = themeMeta[c.theme];
          return (
            <li
              key={c.id}
              className="border-b border-[#2E2215] p-6 last:border-b-0 md:p-7"
              style={playing ? { background: `rgba(${t.rgb},0.05)` } : undefined}
            >
              <div className="flex items-start gap-5">
                <button
                  onClick={() => toggle(c.id)}
                  aria-label={playing ? 'Pause message' : 'Play message'}
                  className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-transform hover:scale-105"
                  style={{
                    borderColor: `rgba(${t.rgb},0.5)`,
                    color: `rgb(${t.rgb})`,
                    background: `rgba(${t.rgb},0.08)`,
                  }}
                >
                  <PlayIcon playing={playing} />
                </button>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className="font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.2em]"
                      style={{ color: `rgb(${t.rgb})` }}
                    >
                      {t.label}
                    </span>
                    <span className="font-mono text-[11px] tracking-[0.05em] text-[#9A8C73]">
                      ▸ {formatDuration(c.durationSeconds)}
                    </span>
                  </div>
                  <div className="mt-3">
                    <Waveform seed={c.id + c.text.slice(0, 12)} bars={56} progress={playing ? progress : null} />
                  </div>
                  <blockquote className="mt-4 font-[var(--font-body)] leading-8 text-[#E4D8C4]">
                    {renderTranscript(c.text)}
                  </blockquote>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
