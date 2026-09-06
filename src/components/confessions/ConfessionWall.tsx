'use client';

import { useEffect, useRef, useState } from 'react';

import type { Confession } from '@/data/confessions-mock';

import { Waveform } from './Waveform';

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = String(seconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}

// Render the transcript, turning runs of "█" (redacted detail) into bars.
function renderTranscript(text: string) {
  return text.split(/(█+)/).map((seg, i) => {
    if (/^█+$/.test(seg)) {
      const w = Math.min(7, Math.max(2, Math.round(seg.length / 2)));
      return (
        <span
          key={i}
          aria-label="redacted"
          className="mx-0.5 inline-block h-[0.9em] translate-y-[2px] rounded-[2px] bg-[#D8CBB6]/80"
          style={{ width: `${w}ch` }}
        />
      );
    }
    return <span key={i}>{seg}</span>;
  });
}

export function ConfessionWall({ confessions }: { confessions: Confession[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  // Stagger the cards in when the wall scrolls into view, so it reads like
  // messages arriving on a line rather than a static grid.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setRevealed(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setRevealed(true);
          io.disconnect();
        }
      },
      { threshold: 0.08 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
      {confessions.map((c, i) => (
        <figure
          key={c.id}
          style={{ transitionDelay: `${Math.min(i * 70, 900)}ms` }}
          className={`break-inside-avoid rounded-2xl border border-[var(--warm-bark-deep)] bg-[#1E160D] p-6 transition-all duration-700 ease-out ${
            revealed ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          <Waveform seed={c.id + c.text.slice(0, 12)} />
          <blockquote className="mt-4 font-[var(--font-body)] text-[1.02rem] leading-8 text-[#E4D8C4]">
            {renderTranscript(c.text)}
          </blockquote>
          <figcaption className="mt-5 flex items-center justify-between font-[var(--font-sans)] text-[11px] uppercase tracking-[0.18em]">
            <span className="text-[var(--warm-gold)]">{c.theme}</span>
            <span className="inline-flex items-center gap-1.5 text-sand-lift">
              <span aria-hidden="true">▸</span> {formatDuration(c.durationSeconds)}
            </span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
