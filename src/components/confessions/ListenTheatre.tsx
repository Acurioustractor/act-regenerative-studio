'use client';

// Full-screen "theatre" for the line. Click Full screen and the messages fill
// the room: an ambient field of slowed lights behind, a sidebar of every voice
// you can click straight to, and Play all that walks the whole inbox on its own
// (cleared clips play their audio; words-only ones rest on screen long enough to
// read, then advance). One audio element, native fullscreen when the browser
// allows, Esc to leave.

import { useCallback, useEffect, useRef, useState } from 'react';

import type { Confession } from '@/data/confessions-mock';
import { themeMeta } from '@/data/confessions-mock';

import { ConfessionField } from './ConfessionField';
import { formatDuration } from './transcript';
import { Waveform } from './Waveform';

const isCleared = (c: Confession) => c.audioStatus === 'cleared' && !!c.audioSrc;
// How long a words-only message rests on screen during Play all: scaled to its
// length so longer notes get longer, clamped to a brisk-but-readable window.
const wordDwellMs = (c: Confession) => Math.min(Math.max(c.text.length * 42, 4200), 9000);

export function ListenTheatre({ confessions }: { confessions: Confession[] }) {
  const order = confessions;
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playAll, setPlayAll] = useState(false);
  const [progress, setProgress] = useState(0);
  const [playGen, setPlayGen] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const wordTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeIndexRef = useRef<number | null>(null);
  const playAllRef = useRef(false);

  useEffect(() => { activeIndexRef.current = activeIndex; }, [activeIndex]);
  useEffect(() => { playAllRef.current = playAll; }, [playAll]);

  const clearWordTimer = () => {
    if (wordTimerRef.current) { clearTimeout(wordTimerRef.current); wordTimerRef.current = null; }
  };

  // End of the current message: in Play all, step to the next; otherwise rest.
  const advanceOrStop = useCallback(() => {
    const i = activeIndexRef.current;
    if (playAllRef.current && i !== null && i < order.length - 1) {
      setActiveIndex(i + 1);
      setPlayGen((g) => g + 1);
    } else {
      playAllRef.current = false;
      setPlayAll(false);
      setIsPlaying(false);
    }
  }, [order.length]);

  // One audio element for the whole theatre.
  useEffect(() => {
    const a = new Audio();
    a.preload = 'none';
    const onEnded = () => advanceOrStop();
    const onTime = () => { if (a.duration > 0) setProgress(a.currentTime / a.duration); };
    a.addEventListener('ended', onEnded);
    a.addEventListener('timeupdate', onTime);
    audioRef.current = a;
    return () => {
      a.pause();
      a.removeEventListener('ended', onEnded);
      a.removeEventListener('timeupdate', onTime);
      audioRef.current = null;
    };
  }, [advanceOrStop]);

  // Play whatever playGen points at (activeIndex is already settled by then).
  useEffect(() => {
    if (playGen === 0 || activeIndex === null) return;
    const a = audioRef.current;
    if (!a) return;
    clearWordTimer();
    const c = order[activeIndex];
    setProgress(0);
    if (isCleared(c)) {
      a.src = c.audioSrc!;
      a.currentTime = 0;
      a.play().then(() => setIsPlaying(true)).catch(() => {
        setIsPlaying(false);
        if (playAllRef.current) wordTimerRef.current = setTimeout(advanceOrStop, wordDwellMs(c));
      });
    } else {
      a.pause();
      setIsPlaying(false);
      if (playAllRef.current) wordTimerRef.current = setTimeout(advanceOrStop, wordDwellMs(c));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playGen]);

  const play = (i: number) => { setActiveIndex(i); setPlayGen((g) => g + 1); };

  const selectOne = (i: number) => { playAllRef.current = false; setPlayAll(false); play(i); };

  const togglePlayAll = () => {
    if (playAllRef.current) {
      playAllRef.current = false;
      setPlayAll(false);
      audioRef.current?.pause();
      clearWordTimer();
      setIsPlaying(false);
    } else {
      playAllRef.current = true;
      setPlayAll(true);
      play(activeIndex ?? 0);
    }
  };

  const togglePlayPause = () => {
    if (activeIndex === null) { play(0); return; }
    const c = order[activeIndex];
    const a = audioRef.current;
    if (!isCleared(c) || !a) { play(activeIndex); return; }
    if (isPlaying) { a.pause(); setIsPlaying(false); }
    else { a.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false)); }
  };

  const step = (dir: 1 | -1) => {
    const i = activeIndex ?? 0;
    const next = Math.min(Math.max(i + dir, 0), order.length - 1);
    play(next);
  };

  const openTheatre = () => { setActiveIndex(0); setOpen(true); };
  const closeTheatre = useCallback(() => {
    audioRef.current?.pause();
    clearWordTimer();
    playAllRef.current = false;
    setPlayAll(false);
    setIsPlaying(false);
    setOpen(false);
    if (typeof document !== 'undefined' && document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {});
    }
  }, []);

  // Native fullscreen + scroll lock + Esc while open.
  useEffect(() => {
    if (!open) return;
    overlayRef.current?.requestFullscreen?.().catch(() => {});
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeTheatre(); };
    const onFsChange = () => { if (!document.fullscreenElement && open) { /* user left native fs: keep overlay, they can close */ } };
    window.addEventListener('keydown', onKey);
    document.addEventListener('fullscreenchange', onFsChange);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('fullscreenchange', onFsChange);
    };
  }, [open, closeTheatre]);

  const active = activeIndex !== null ? order[activeIndex] : null;
  const activeCleared = active ? isCleared(active) : false;

  return (
    <>
      <button
        onClick={openTheatre}
        className="inline-flex items-center gap-2 rounded-full border border-[#3A2C18] bg-[#1A130B] px-5 py-2.5 font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.24em] text-[rgba(224,176,104,0.9)] transition hover:border-[#CFA16B] hover:text-[#F3EBDD]"
      >
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3" />
        </svg>
        Full screen
      </button>

      {open && (
        <div
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-label="Listen to the messages, full screen"
          className="fixed inset-0 z-[100] flex flex-col bg-[#0E0A05] text-[#F3EBDD] md:flex-row"
        >
          {/* ambient backdrop: slowed lights, low presence so the UI leads */}
          <div className="pointer-events-none absolute inset-0 opacity-50">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,#241910_0%,#0E0A05_70%)]" />
            <ConfessionField confessions={order} interactive={false} />
          </div>

          {/* SIDEBAR — every message, click to play */}
          <aside className="relative z-10 flex max-h-[38vh] shrink-0 flex-col border-b border-[#241a10] bg-black/55 backdrop-blur-sm md:max-h-none md:w-[340px] md:border-b-0 md:border-r">
            <div className="flex items-center justify-between px-5 pb-3 pt-5">
              <p className="font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.3em] text-[#CFA16B]">
                The messages
              </p>
              <span className="font-mono text-[11px] text-sand-lift">{order.length}</span>
            </div>
            <ul className="flex-1 overflow-y-auto px-2.5 pb-4">
              {order.map((c, i) => {
                const t = themeMeta[c.theme];
                const activeRow = i === activeIndex;
                const cleared = isCleared(c);
                return (
                  <li key={c.id}>
                    <button
                      onClick={() => selectOne(i)}
                      aria-current={activeRow ? 'true' : undefined}
                      className={`mb-1.5 flex w-full items-start gap-3 rounded-lg border px-3 py-2.5 text-left transition ${
                        activeRow ? 'border-[#CFA16B]/60 bg-[#CFA16B]/10' : 'border-transparent hover:bg-white/5'
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className="mt-1 h-2 w-2 shrink-0 rounded-full"
                        style={{ background: `rgb(${t.rgb})`, boxShadow: activeRow ? `0 0 8px 1px rgba(${t.rgb},0.8)` : 'none' }}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-2">
                          <span className="font-[var(--font-sans)] text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: `rgb(${t.rgb})` }}>
                            {t.label}
                          </span>
                          <span className="font-mono text-[10px] text-sand-lift">
                            {cleared ? `▸ ${formatDuration(c.durationSeconds)}` : '✎ words'}
                          </span>
                        </span>
                        <span className="mt-1 block truncate font-[var(--font-body)] text-[13px] text-[#C7B9A4]">
                          {c.text}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>

          {/* MAIN — now playing + transport */}
          <div className="relative z-10 flex min-h-0 flex-1 flex-col">
            <div className="flex items-center justify-between px-6 pt-5">
              <p className="font-[var(--font-sans)] text-[11px] uppercase tracking-[0.3em] text-sand-lift">
                Confessions to philanthropy
              </p>
              <button
                onClick={closeTheatre}
                aria-label="Close full screen"
                className="inline-flex items-center gap-2 rounded-full border border-[#3A2C18] px-3.5 py-1.5 font-[var(--font-sans)] text-[11px] uppercase tracking-[0.2em] text-[#B0A48E] transition hover:border-[#5A4A30] hover:text-[#F3EBDD]"
              >
                Close
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-6 py-6 text-center">
              {active ? (
                <div className="mx-auto max-w-2xl">
                  <p className="font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.32em]" style={{ color: `rgb(${themeMeta[active.theme].rgb})` }}>
                    {activeCleared ? (isPlaying ? 'Now playing' : 'Paused') : 'Shared as words'}
                    <span className="mx-2 text-sand-lift">·</span>
                    {themeMeta[active.theme].label}
                  </p>
                  {activeCleared && (
                    <div className="mx-auto mt-5 max-w-md">
                      <Waveform seed={active.id + active.text.slice(0, 12)} bars={64} progress={isPlaying ? progress : null} />
                    </div>
                  )}
                  <p className="mt-6 max-h-[42vh] overflow-y-auto font-[var(--font-display)] text-[clamp(1.2rem,3vw,2rem)] italic leading-[1.5] text-[#F8F1E3]" style={{ textShadow: '0 0 30px rgba(224,176,104,0.25)' }}>
                    &ldquo;{active.text}&rdquo;
                  </p>
                  {active.consentNote && (
                    <p className="mt-4 font-[var(--font-sans)] text-[10px] uppercase tracking-[0.2em] text-sand-lift">{active.consentNote}</p>
                  )}
                </div>
              ) : (
                <p className="font-[var(--font-body)] text-lg text-[#C7B9A4]">Press Play all, or pick a message.</p>
              )}
            </div>

            {/* transport */}
            <div className="relative z-10 flex items-center justify-center gap-3 border-t border-[#241a10] bg-black/45 px-6 py-5 backdrop-blur-sm">
              <button onClick={() => step(-1)} aria-label="Previous message" className="flex h-11 w-11 items-center justify-center rounded-full border border-[#3A2C18] text-[#CFA16B] transition hover:border-[#5A4A30] hover:text-[#F3EBDD]">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true"><path d="M7 5h2v14H7zM20 5.5v13a1 1 0 0 1-1.5.87l-10-6.5a1 1 0 0 1 0-1.74l10-6.5A1 1 0 0 1 20 5.5Z" /></svg>
              </button>
              <button onClick={togglePlayPause} aria-label={isPlaying ? 'Pause' : 'Play'} className="flex h-14 w-14 items-center justify-center rounded-full border border-[#CFA16B] bg-[#CFA16B]/15 text-[#FFE4AA] transition hover:bg-[#CFA16B]/25">
                {isPlaying ? (
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="h-5 w-5 translate-x-[1px]" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.87l11-6.5a1 1 0 0 0 0-1.74l-11-6.5A1 1 0 0 0 8 5.5Z" /></svg>
                )}
              </button>
              <button onClick={() => step(1)} aria-label="Next message" className="flex h-11 w-11 items-center justify-center rounded-full border border-[#3A2C18] text-[#CFA16B] transition hover:border-[#5A4A30] hover:text-[#F3EBDD]">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true"><path d="M15 5h2v14h-2zM4 5.5v13a1 1 0 0 0 1.5.87l10-6.5a1 1 0 0 0 0-1.74l-10-6.5A1 1 0 0 0 4 5.5Z" /></svg>
              </button>
              <button
                onClick={togglePlayAll}
                aria-pressed={playAll}
                className={`ml-3 inline-flex items-center gap-2 rounded-full border px-5 py-2.5 font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.2em] transition ${
                  playAll ? 'border-[#CFA16B] bg-[#CFA16B]/15 text-[#FFE4AA]' : 'border-[#3A2C18] text-[#CFA16B] hover:border-[#5A4A30] hover:text-[#F3EBDD]'
                }`}
              >
                {playAll ? 'Stop' : 'Play all'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
