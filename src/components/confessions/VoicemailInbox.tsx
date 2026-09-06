'use client';

import { useEffect, useRef, useState } from 'react';

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

const isCleared = (c: Confession) => c.audioStatus === 'cleared' && !!c.audioSrc;

export function VoicemailInbox({ confessions }: { confessions: Confession[] }) {
  const [filter, setFilter] = useState<ConfessionTheme | 'all'>('all');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [reduced, setReduced] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  // One shared audio element for the whole inbox.
  useEffect(() => {
    const a = new Audio();
    a.preload = 'none';
    audioRef.current = a;
    return () => {
      a.pause();
      a.src = '';
      audioRef.current = null;
    };
  }, []);

  // Drive whatever is playing. Cleared rows play their real recording with the
  // waveform synced to currentTime; text-only rows (and reduced-motion, and any
  // audio load error) fall back to the original decorative sweep.
  useEffect(() => {
    if (!playingId) {
      audioRef.current?.pause();
      return;
    }
    const conf = confessions.find((c) => c.id === playingId);

    if (conf && isCleared(conf) && !reduced) {
      const a = audioRef.current;
      if (a) {
        let fellBack = false;
        const onTime = () => {
          if (a.duration > 0) {
            setProgress(a.currentTime / a.duration);
            setElapsed(a.currentTime);
          }
        };
        const stop = () => setPlayingId(null);
        const startSweep = () => {
          // Audio could not load/play: degrade to the decorative sweep so the
          // row still responds instead of sitting dead.
          fellBack = true;
          const durMs = Math.min(Math.max(conf.durationSeconds * 110, 1800), 6000);
          const start = performance.now();
          const tick = (t: number) => {
            const p = Math.min(1, (t - start) / durMs);
            setProgress(p);
            if (p < 1) requestAnimationFrame(tick);
            else setPlayingId(null);
          };
          requestAnimationFrame(tick);
        };
        a.addEventListener('timeupdate', onTime);
        a.addEventListener('ended', stop);
        a.addEventListener('error', startSweep);
        a.src = conf.audioSrc!;
        a.currentTime = 0;
        a.play().catch(startSweep);
        return () => {
          a.removeEventListener('timeupdate', onTime);
          a.removeEventListener('ended', stop);
          a.removeEventListener('error', startSweep);
          if (!fellBack) a.pause();
        };
      }
    }

    // Text-only + reduced-motion path: original sweep, no audio.
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
    setElapsed(0);
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
              ? 'border-[var(--warm-gold)] bg-[#CFA16B]/10 text-[#EFE6D2]'
              : 'border-[var(--warm-bark-deep)] text-[#9A8C73] hover:border-[#5A4A30]'
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
                borderColor: active ? `rgb(${themeMeta[t].rgb})` : 'var(--warm-bark-deep)',
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
      <ul className="mt-10 overflow-hidden rounded-2xl border border-[var(--warm-bark-deep)] bg-[#1A130B]">
        {shown.map((c) => {
          const playing = playingId === c.id;
          const cleared = isCleared(c);
          const t = themeMeta[c.theme];
          const label =
            playing && cleared ? formatDuration(Math.floor(elapsed)) : formatDuration(c.durationSeconds);
          const ariaLabel = cleared
            ? playing
              ? 'Pause recording'
              : 'Play the recording'
            : playing
              ? 'Stop'
              : 'Play message (shared as words)';
          return (
            <li
              key={c.id}
              className="border-b border-[var(--warm-earth)] p-6 last:border-b-0 md:p-7"
              style={playing ? { background: `rgba(${t.rgb},0.05)` } : undefined}
            >
              {cleared ? (
                <div className="flex items-start gap-5">
                  <button
                    onClick={() => toggle(c.id)}
                    aria-label={ariaLabel}
                    aria-pressed={playing}
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
                      <span className="flex items-center gap-2 font-mono text-[11px] tracking-[0.05em] text-[#9A8C73]">
                        <span
                          aria-hidden="true"
                          title="Real recording"
                          className="inline-block h-1.5 w-1.5 rounded-full"
                          style={{ background: playing ? `rgb(${t.rgb})` : `rgba(${t.rgb},0.55)` }}
                        />
                        ▸ {label}
                      </span>
                    </div>
                    <div className="mt-3">
                      <Waveform seed={c.id + c.text.slice(0, 12)} bars={56} progress={playing ? progress : null} />
                    </div>
                    <blockquote className="mt-4 font-[var(--font-body)] leading-8 text-[#E4D8C4]">
                      {renderTranscript(c.text)}
                    </blockquote>
                    {c.consentNote && (
                      <p className="mt-3 font-[var(--font-sans)] text-[10px] uppercase tracking-[0.2em] text-sand-lift">
                        {c.consentNote}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-3">
                    <span
                      className="font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.2em]"
                      style={{ color: `rgb(${t.rgb})` }}
                    >
                      {t.label}
                    </span>
                    <span
                      aria-hidden="true"
                      className="h-px flex-1"
                      style={{ background: `rgba(${t.rgb},0.25)` }}
                    />
                  </div>
                  <blockquote className="mt-5 font-[var(--font-body)] text-[19px] italic leading-[1.75] text-[#EFE6D2]">
                    {renderTranscript(c.text)}
                  </blockquote>
                  {c.consentNote && (
                    <p className="mt-3 font-[var(--font-sans)] text-[10px] uppercase tracking-[0.2em] text-sand-lift">
                      {c.consentNote}
                    </p>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
