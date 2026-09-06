'use client';

import { useEffect, useRef, useState } from 'react';

import type { Confession } from '@/data/confessions-mock';
import { feelingMeta, feelingOf } from '@/data/confessions-mock';

// The hero field IS the voicemail line. Each light is one real message left on
// the gold phone. Pick one up (tap / click) to play it: the four cleared voices
// actually play their audio; the words-only ones reveal what the caller chose to
// leave in writing. No "receiver", no catching game, no promise of sound it can't
// keep, the lights are the people, and they speak.

const GOLD = '224, 176, 104'; // warm brass / candlelight

type Voice = {
  id: string;
  text: string;
  themeLabel: string;
  rgb: string;
  cleared: boolean;
  audioSrc?: string;
};

type Spark = {
  // null voice => ambient light (atmosphere only, not pickable)
  voice: Voice | null;
  angle: number;
  speed: number;
  baseRadius: number;
  pulse: number;
  wobble: number;
  size: number;
  x: number;
  y: number;
  settle: number; // 0..1 eased toward 1 when hot/active (the light comes to hand)
};

function toVoice(c: Confession): Voice {
  const f = feelingOf(c);
  return {
    id: c.id,
    text: c.text,
    themeLabel: feelingMeta[f].label,
    rgb: feelingMeta[f].rgb,
    cleared: c.audioStatus === 'cleared' && !!c.audioSrc,
    audioSrc: c.audioSrc,
  };
}

export function ConfessionField({
  confessions,
  interactive = true,
}: {
  confessions: Confession[];
  /** false = ambient backdrop only: lights float, but no hover, no pickup, no
   *  caption (used behind the hero so it never overlaps the headline). */
  interactive?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [active, setActive] = useState<Voice | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  // The animation loop reads these without re-subscribing.
  const activeIdRef = useRef<string | null>(null);
  const hotIdRef = useRef<string | null>(null);

  const voices = confessions.map(toVoice);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // One shared audio element for the whole field.
  useEffect(() => {
    const a = new Audio();
    a.preload = 'none';
    const onEnded = () => setIsPlaying(false);
    a.addEventListener('ended', onEnded);
    audioRef.current = a;
    return () => {
      a.pause();
      a.removeEventListener('ended', onEnded);
      audioRef.current = null;
    };
  }, []);

  // Pick up a voice: play its audio if cleared, otherwise reveal its words.
  const pickUp = (v: Voice) => {
    const a = audioRef.current;
    // Tapping the one already playing puts it back down.
    if (active?.id === v.id && isPlaying && a) {
      a.pause();
      setIsPlaying(false);
      return;
    }
    setActive(v);
    activeIdRef.current = v.id;
    if (v.cleared && v.audioSrc && a) {
      a.src = v.audioSrc;
      a.currentTime = 0;
      a.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    } else {
      a?.pause();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    activeIdRef.current = active?.id ?? null;
  }, [active]);

  useEffect(() => {
    if (reducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    const pointer = { x: -9999, y: -9999 };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const ring = Math.min(w, h) * 0.36 || 240;

    // The real voices, spread evenly around the ring, plus a scatter of dim
    // ambient sparks so the switchboard feels alive rather than sparse.
    const sparks: Spark[] = [];
    voices.forEach((voice, i) => {
      const angle = (i / Math.max(voices.length, 1)) * Math.PI * 2 - Math.PI / 2;
      sparks.push({
        voice,
        angle,
        speed: 0.00042 + (i % 3) * 0.00018,
        baseRadius: ring * (0.74 + ((i * 7) % 5) * 0.07),
        pulse: (i / voices.length) * Math.PI * 2,
        wobble: 0.4 + ((i * 13) % 7) * 0.06,
        size: voice.cleared ? 3.4 : 2.6,
        x: 0,
        y: 0,
        settle: 0,
      });
    });
    const AMBIENT = 22;
    for (let i = 0; i < AMBIENT; i++) {
      sparks.push({
        voice: null,
        angle: (i / AMBIENT) * Math.PI * 2,
        speed: 0.00028 + (i % 4) * 0.00014,
        baseRadius: ring * (0.4 + ((i * 11) % 9) * 0.09),
        pulse: (i * 1.7) % (Math.PI * 2),
        wobble: 0.3 + ((i * 5) % 6) * 0.05,
        size: 1.1 + ((i * 3) % 4) * 0.3,
        x: 0,
        y: 0,
        settle: 0,
      });
    }

    const tick = () => {
      const now = Date.now();
      ctx.fillStyle = 'rgba(10, 9, 8, 0.18)';
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;

      const center = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(w, h) * 0.18);
      center.addColorStop(0, `rgba(${GOLD}, 0.10)`);
      center.addColorStop(1, `rgba(${GOLD}, 0)`);
      ctx.fillStyle = center;
      ctx.fillRect(0, 0, w, h);

      // Find the voice nearest the pointer (the one that would be picked up).
      let nearestId: string | null = null;
      let nearestDist = 52 * 52;

      for (const s of sparks) {
        const isActive = s.voice && activeIdRef.current === s.voice.id;
        const settleTarget = isActive ? 1 : 0;

        if (s.settle < settleTarget) s.settle = Math.min(1, s.settle + 0.06);
        else s.settle = Math.max(0, s.settle - 0.05);

        s.angle += s.speed * (1 - s.settle * 0.9);
        s.pulse += 0.012;
        const r = s.baseRadius + Math.sin(s.pulse) * 22;
        const tx = cx + Math.cos(s.angle) * r;
        const ty = cy + Math.sin(s.angle) * r * 0.74;
        if (!s.x) s.x = tx;
        if (!s.y) s.y = ty;
        s.x += (tx - s.x) * 0.03;
        s.y += (ty - s.y) * 0.03;
        s.x += Math.sin(now * 0.0006 + s.pulse) * s.wobble * (1 - s.settle);
        s.y += Math.cos(now * 0.00065 + s.pulse) * s.wobble * (1 - s.settle);

        if (s.voice) {
          const dx = s.x - pointer.x;
          const dy = s.y - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < nearestDist) {
            nearestDist = d2;
            nearestId = s.voice.id;
          }
        }
      }
      hotIdRef.current = nearestId;

      for (const s of sparks) {
        const pulse = Math.sin(s.pulse) * 0.5 + 0.5;
        const isActive = s.voice && activeIdRef.current === s.voice.id;
        const isHot = s.voice && hotIdRef.current === s.voice.id;
        const ambient = !s.voice;
        const col = s.voice ? s.voice.rgb : GOLD; // each voice glows its feeling's colour

        let opacity: number;
        if (ambient) opacity = 0.12 + pulse * 0.16;
        else if (isActive) opacity = 0.95;
        else if (isHot) opacity = 0.85;
        else opacity = 0.4 + pulse * 0.35;

        const grow = 1 + s.settle * 0.9 + (isHot ? 0.4 : 0);
        const coreSize = s.size * grow;
        const glow = coreSize + pulse * 3 + s.settle * 4;

        const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, glow * 2.6);
        g.addColorStop(0, `rgba(${col}, ${opacity})`);
        g.addColorStop(0.55, `rgba(${col}, ${opacity * 0.28})`);
        g.addColorStop(1, `rgba(${col}, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(s.x, s.y, glow * 2.6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(${col}, ${Math.min(opacity + 0.2, 0.95)})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, coreSize, 0, Math.PI * 2);
        ctx.fill();

        // A thin ring marks a cleared voice: this one you can actually hear.
        if (s.voice?.cleared && !ambient) {
          ctx.strokeStyle = `rgba(${col}, ${Math.min(opacity, 0.7)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(s.x, s.y, coreSize + 4 + (isActive ? Math.sin(now * 0.006) * 2 : 0), 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // Faint connective lines, the switchboard feel.
      const voiceSparks = sparks.filter((s) => s.voice);
      for (let i = 0; i < voiceSparks.length; i++) {
        for (let j = i + 1; j < voiceSparks.length; j++) {
          const a = voiceSparks[i];
          const b = voiceSparks[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.strokeStyle = `rgba(${GOLD}, ${(1 - dist / 150) * 0.1})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Cursor reads as a pickup point when a voice is in reach.
      canvas.style.cursor = nearestId ? 'pointer' : 'default';

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };
    // Tap / click: pick up whichever voice is nearest the click. Using 'click'
    // (not pointer capture) keeps the page scrollable on touch.
    const onClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      const id = hotIdRef.current;
      if (!id) return;
      const v = voices.find((x) => x.id === id);
      if (v) pickUp(v);
    };
    // Ambient backdrop: lights float, but nothing is hoverable or playable.
    if (interactive) {
      canvas.addEventListener('pointermove', onMove);
      canvas.addEventListener('pointerleave', onLeave);
      canvas.addEventListener('click', onClick);
    }
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerleave', onLeave);
      canvas.removeEventListener('click', onClick);
      window.removeEventListener('resize', resize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion, confessions, interactive]);

  // Ambient backdrop with reduced motion: nothing to show, the hero text stands
  // alone (no canvas, no list).
  if (reducedMotion && !interactive) return null;

  // Reduced motion (interactive): the voices as a plain, playable list.
  if (reducedMotion) {
    return (
      <div className="absolute inset-0 flex items-center justify-center px-6">
        <ul className="flex max-w-2xl flex-wrap items-center justify-center gap-2">
          {voices.map((v) => (
            <li key={v.id}>
              <button
                onClick={() => pickUp(v)}
                className="rounded-full border border-[rgba(224,176,104,0.4)] px-3 py-1.5 text-[0.72rem] uppercase tracking-[0.16em] text-[rgba(224,176,104,0.8)] transition hover:border-[rgba(224,176,104,0.8)] hover:text-[var(--warm-cream)]"
              >
                {v.cleared ? '▸ ' : '✎ '}
                {v.themeLabel}
              </button>
            </li>
          ))}
        </ul>
        <CaptionBlock active={active} isPlaying={isPlaying} onStop={() => pickUp(active!)} />
      </div>
    );
  }

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
      />
      {interactive && (
        <>
          <CaptionBlock active={active} isPlaying={isPlaying} onStop={() => active && pickUp(active)} />
          {/* Keyboard / screen-reader access to every voice. */}
          <ul className="sr-only">
            {voices.map((v) => (
              <li key={v.id}>
                <button onClick={() => pickUp(v)}>
                  Play the {v.themeLabel} message{v.cleared ? '' : ' (shared as words)'}: {v.text}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}

// The picked-up voice, surfaced over the field: words as subtitle, with a clear
// "playing / shared as words" state so the sound (or its absence) is honest.
function CaptionBlock({
  active,
  isPlaying,
  onStop,
}: {
  active: Voice | null;
  isPlaying: boolean;
  onStop: () => void;
}) {
  return (
    <div
      aria-live="polite"
      className={`pointer-events-none absolute inset-x-0 bottom-8 z-20 mx-auto max-w-2xl px-6 text-center transition-opacity duration-500 ${
        active ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {active && (
        <>
          <p className="font-[var(--font-sans)] text-[10px] font-semibold uppercase tracking-[0.32em] text-[var(--warm-gold-bright)]">
            {active.cleared ? (isPlaying ? 'Now playing' : 'Tap the light again to play') : 'Shared as words'}
            <span className="mx-2 text-sand-lift">·</span>
            {active.themeLabel}
          </p>
          <p
            className="mt-3 font-[var(--font-display)] text-[clamp(1.05rem,2.4vw,1.5rem)] italic leading-snug text-[#F8F1E3]"
            style={{ textShadow: '0 0 24px rgba(224,176,104,0.3)' }}
          >
            &ldquo;{active.text}&rdquo;
          </p>
          {active.cleared && isPlaying && (
            <button
              onClick={onStop}
              className="pointer-events-auto mt-4 inline-flex items-center gap-2 rounded-full border border-[rgba(224,176,104,0.4)] px-3.5 py-1.5 font-[var(--font-sans)] text-[11px] uppercase tracking-[0.2em] text-[rgba(224,176,104,0.85)] transition hover:border-[rgba(224,176,104,0.8)] hover:text-[var(--warm-cream)]"
            >
              <span className="flex gap-0.5" aria-hidden="true">
                <span className="h-3 w-[3px] animate-pulse rounded-full bg-[var(--warm-gold-bright)]" />
                <span className="h-3 w-[3px] animate-pulse rounded-full bg-[var(--warm-gold-bright)] [animation-delay:150ms]" />
                <span className="h-3 w-[3px] animate-pulse rounded-full bg-[var(--warm-gold-bright)] [animation-delay:300ms]" />
              </span>
              Stop
            </button>
          )}
        </>
      )}
    </div>
  );
}
