'use client';

// The Wall of Feeling: the warm twin of the Payout Wall. The Payout Wall sorts
// the system by money; this sorts the people by what it feels like to be on the
// receiving end of giving. It leads with the good on purpose, the gratitude and
// the breakthroughs first, so the harder feelings land because you already trust
// the voice. Not anti-philanthropy. The whole human range of it.

import { useEffect, useMemo, useRef, useState } from 'react';

import type { Confession, ConfessionFeeling, ConfessionTheme } from '@/data/confessions-mock';
import { feelingMeta, feelingOrder } from '@/data/confessions-mock';

import { formatDuration, renderTranscript } from './transcript';

const isCleared = (c: Confession) => c.audioStatus === 'cleared' && !!c.audioSrc;

// Fallback if a voice has no feeling assigned yet (keeps new calls placeable).
const THEME_FALLBACK: Record<ConfessionTheme, ConfessionFeeling> = {
  money: 'the ask', power: 'frustration', 'the forms': 'the weight', shame: 'shame',
  hope: 'hope', breakthrough: 'breakthrough', 'the weird': 'the weird',
};
const feelingOf = (c: Confession): ConfessionFeeling => c.feeling ?? THEME_FALLBACK[c.theme];

function PlayDot({ playing, rgb }: { playing: boolean; rgb: string }) {
  return (
    <span
      aria-hidden="true"
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border"
      style={{ borderColor: `rgba(${rgb},0.5)`, color: `rgb(${rgb})`, background: `rgba(${rgb},0.1)` }}
    >
      {playing ? (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 translate-x-[1px]" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.5.87l11-6.5a1 1 0 0 0 0-1.74l-11-6.5A1 1 0 0 0 8 5.5Z" /></svg>
      )}
    </span>
  );
}

export function WallOfFeeling({ confessions }: { confessions: Confession[] }) {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const a = new Audio();
    a.preload = 'none';
    const onEnded = () => setPlayingId(null);
    a.addEventListener('ended', onEnded);
    audioRef.current = a;
    return () => { a.pause(); a.removeEventListener('ended', onEnded); audioRef.current = null; };
  }, []);

  const toggle = (c: Confession) => {
    if (!isCleared(c)) return;
    const a = audioRef.current;
    if (!a) return;
    if (playingId === c.id) { a.pause(); setPlayingId(null); return; }
    a.src = c.audioSrc!;
    a.currentTime = 0;
    a.play().then(() => setPlayingId(c.id)).catch(() => setPlayingId(null));
  };

  // Group by feeling, warm first. Empty feelings drop out.
  const groups = useMemo(
    () => feelingOrder
      .map((f) => ({ f, items: confessions.filter((c) => feelingOf(c) === f) }))
      .filter((g) => g.items.length > 0),
    [confessions],
  );

  // The warmest available voice is the lead, shown large; the rest fill the bands.
  const lead = groups[0]?.items[0] ?? null;
  const leadRgb = lead ? feelingMeta[feelingOf(lead)].rgb : '224,176,104';

  // The good feelings still waiting for a voice, shown as a quiet invitation so
  // the wall reads as living and leading-with-good even before they arrive.
  const missingGood = feelingOrder.slice(0, 3).filter((f) => !groups.some((g) => g.f === f));

  const Card = ({ c, rgb }: { c: Confession; rgb: string }) => {
    const cleared = isCleared(c);
    const playing = playingId === c.id;
    return (
      <article
        className="flex flex-col justify-between rounded-2xl border bg-[#1C1409]/70 p-6 transition-colors"
        style={{ borderColor: playing ? `rgb(${rgb})` : `rgba(${rgb},0.22)`, background: playing ? `rgba(${rgb},0.07)` : undefined }}
      >
        <blockquote className="font-[var(--font-display)] text-[clamp(1.05rem,1.6vw,1.35rem)] italic leading-[1.55] text-[#F3EBDD]">
          {renderTranscript(c.text)}
        </blockquote>
        <div className="mt-5 flex items-center gap-3">
          {cleared ? (
            <button onClick={() => toggle(c)} aria-pressed={playing} aria-label={playing ? 'Pause this voice' : 'Play this voice'} className="transition-transform hover:scale-105">
              <PlayDot playing={playing} rgb={rgb} />
            </button>
          ) : null}
          <span className="font-[var(--font-sans)] text-[10px] uppercase tracking-[0.2em]" style={{ color: `rgb(${rgb})` }}>
            {feelingMeta[feelingOf(c)].label}
          </span>
          <span className="ml-auto font-mono text-[11px] tracking-[0.04em] text-[#8C8169]">
            {cleared ? `▸ ${formatDuration(c.durationSeconds)}` : c.consentNote ?? 'shared as words'}
          </span>
        </div>
      </article>
    );
  };

  if (!lead) return null;

  return (
    <div className="mx-auto max-w-5xl">
      {/* THE LEAD: the warmest voice on the line, given the most room */}
      <figure className="mx-auto max-w-3xl text-center">
        <figcaption className="font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.32em]" style={{ color: `rgb(${leadRgb})` }}>
          {feelingMeta[feelingOf(lead)].label} · {feelingMeta[feelingOf(lead)].gloss}
        </figcaption>
        <blockquote className="mt-6 font-[var(--font-display)] text-[clamp(1.6rem,4vw,2.6rem)] italic leading-[1.35] text-[#F8F1E3]" style={{ textShadow: `0 0 40px rgba(${leadRgb},0.25)` }}>
          {renderTranscript(lead.text)}
        </blockquote>
        <div className="mt-7 flex items-center justify-center gap-3">
          {isCleared(lead) ? (
            <button onClick={() => toggle(lead)} aria-pressed={playingId === lead.id} aria-label={playingId === lead.id ? 'Pause this voice' : 'Play this voice'} className="transition-transform hover:scale-105">
              <PlayDot playing={playingId === lead.id} rgb={leadRgb} />
            </button>
          ) : (
            <span className="font-[var(--font-sans)] text-[10px] uppercase tracking-[0.22em] text-[#8C8169]">{lead.consentNote ?? 'shared as words'}</span>
          )}
        </div>
      </figure>

      {/* THE BANDS: warm to hard, every other voice in its feeling */}
      <div className="mt-20 space-y-16">
        {groups.map(({ f, items }) => {
          const rest = items.filter((c) => c.id !== lead.id);
          if (rest.length === 0) return null;
          const m = feelingMeta[f];
          return (
            <section key={f}>
              <div className="mb-6 flex items-baseline gap-3">
                <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full" style={{ background: `rgb(${m.rgb})`, boxShadow: `0 0 10px 1px rgba(${m.rgb},0.6)` }} />
                <h2 className="font-[var(--font-display)] text-2xl font-semibold" style={{ color: `rgb(${m.rgb})` }}>{m.label}</h2>
                <p className="font-[var(--font-body)] text-sm text-[#9C8E78]">{m.gloss}</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {rest.map((c) => <Card key={c.id} c={c} rgb={m.rgb} />)}
              </div>
            </section>
          );
        })}
      </div>

      {/* The good still on the line: an invitation where a warm band is empty */}
      {missingGood.length > 0 && (
        <p className="mx-auto mt-16 max-w-xl text-center font-[var(--font-body)] text-base leading-8 text-[#9C8E78]">
          No {missingGood.map((f) => feelingMeta[f].label).join(', ')} on the line yet. The good ones
          are still coming. If you have one, the phone is open.
        </p>
      )}
    </div>
  );
}
