'use client';

// The Friday Tape: play the week's cleared confessions back in sequence
// (money -> power -> hope), one continuous "said out loud" reckoning. Each card
// is the real recording; pressing "Play the week back" runs them end to end,
// auto-advancing, and any card can be played on its own.

import { useEffect, useRef, useState } from 'react';

import type { Confession } from '@/data/confessions-mock';
import { realConfessions, themeMeta } from '@/data/confessions-mock';
import { renderTranscript } from './transcript';

const THEME_SEQ = ['money', 'power', 'the forms', 'shame', 'hope', 'breakthrough', 'the weird'];

// the cleared (audio) confessions, ordered to match the honest version's arc
const TAPE: Confession[] = realConfessions
  .filter((c) => c.audioStatus === 'cleared' && !!c.audioSrc)
  .sort((a, b) => THEME_SEQ.indexOf(a.theme) - THEME_SEQ.indexOf(b.theme));

export function FridayTape() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const idxRef = useRef<number | null>(null);
  const [idx, setIdx] = useState<number | null>(null);

  useEffect(() => {
    idxRef.current = idx;
  }, [idx]);

  // one shared audio element; on a track ending, advance to the next in the tape
  useEffect(() => {
    const a = new Audio();
    a.preload = 'none';
    const onEnded = () => {
      const cur = idxRef.current;
      if (cur !== null && cur + 1 < TAPE.length) {
        const next = cur + 1;
        a.src = TAPE[next].audioSrc!;
        a.currentTime = 0;
        a.play().then(() => setIdx(next)).catch(() => setIdx(null));
      } else {
        setIdx(null);
      }
    };
    a.addEventListener('ended', onEnded);
    audioRef.current = a;
    return () => {
      a.pause();
      a.removeEventListener('ended', onEnded);
      audioRef.current = null;
    };
  }, []);

  const playFrom = (i: number) => {
    const a = audioRef.current;
    if (!a) return;
    a.src = TAPE[i].audioSrc!;
    a.currentTime = 0;
    a.play().then(() => setIdx(i)).catch(() => setIdx(null));
  };

  const toggleAll = () => {
    const a = audioRef.current;
    if (!a) return;
    if (idx !== null) {
      a.pause();
      setIdx(null);
    } else {
      playFrom(0);
    }
  };

  const toggleOne = (i: number) => {
    const a = audioRef.current;
    if (!a) return;
    if (idx === i) {
      a.pause();
      setIdx(null);
    } else {
      playFrom(i);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="text-center">
        <button
          onClick={toggleAll}
          aria-pressed={idx !== null}
          className="inline-flex items-center gap-3 rounded-full bg-[#CFA16B] px-7 py-3.5 font-[var(--font-sans)] text-sm font-semibold uppercase tracking-[0.18em] text-[#1A130B] transition hover:bg-[#E0B985]"
        >
          {idx !== null ? (
            <>
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
              Stop the tape
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" className="h-4 w-4 translate-x-[1px]" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.5.87l11-6.5a1 1 0 0 0 0-1.74l-11-6.5A1 1 0 0 0 8 5.5Z" /></svg>
              Play the week back
            </>
          )}
        </button>
        <p className="mt-4 font-[var(--font-sans)] text-[11px] uppercase tracking-[0.3em] text-[#7C7060]">
          {TAPE.length} messages, in sequence
        </p>
      </div>

      <ol className="mt-12 space-y-px overflow-hidden rounded-2xl border border-[#3A2C18] bg-[#1A130B]">
        {TAPE.map((c, i) => {
          const playing = idx === i;
          const t = themeMeta[c.theme];
          return (
            <li
              key={c.id}
              className="border-b border-[#2E2215] p-6 last:border-b-0 md:p-7"
              style={playing ? { background: `rgba(${t.rgb},0.06)` } : undefined}
            >
              <div className="flex items-start gap-5">
                <button
                  onClick={() => toggleOne(i)}
                  aria-label={playing ? 'Pause this message' : 'Play this message'}
                  aria-pressed={playing}
                  className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-transform hover:scale-105"
                  style={{ borderColor: `rgba(${t.rgb},0.5)`, color: `rgb(${t.rgb})`, background: `rgba(${t.rgb},0.08)` }}
                >
                  {playing ? (
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
                  ) : (
                    <svg viewBox="0 0 24 24" className="h-4 w-4 translate-x-[1px]" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.5.87l11-6.5a1 1 0 0 0 0-1.74l-11-6.5A1 1 0 0 0 8 5.5Z" /></svg>
                  )}
                </button>
                <div className="min-w-0 flex-1">
                  <span
                    className="font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.2em]"
                    style={{ color: `rgb(${t.rgb})` }}
                  >
                    {t.label}
                  </span>
                  <blockquote className="mt-3 font-[var(--font-body)] text-[17px] italic leading-[1.7] text-[#E4D8C4]">
                    &ldquo;{renderTranscript(c.text)}&rdquo;
                  </blockquote>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
