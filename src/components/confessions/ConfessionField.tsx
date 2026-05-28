'use client';

import { useEffect, useRef, useState } from 'react';

// The default catchable voices: the brief's own prompts and litany, floating
// as bait so the page feels like the Gold.Phone "catch a voice" piece rather
// than a static poster. The page can pass a `voices` prop to mix in short
// (mock or, later, moderated) confession fragments.
export const CONFESSION_PROMPTS: string[] = [
  'What do you wish philanthropy knew?',
  'What have you always wanted to tell it?',
  'What have you never confessed?',
  'What would you tell it if it had to listen?',
  'The thing you keep tidy.',
  'What you couldn’t say on the record.',
  'Tell us about the money.',
  'Tell us about the power.',
  'Tell us about the forms.',
  'Tell us what no one says in the room.',
  'The moment it actually changed everything.',
  'The good.',
  'The weird.',
  'The messy.',
  'The hopeful.',
  'The bullshit.',
  'The breakthrough.',
  'Say the quiet bit out loud.',
  'No jargon. No grant forms.',
  'You can be anonymous.',
  'Leave a message at the tone.',
];

const GOLD = '224, 176, 104'; // warm brass / candlelight, softer than neon amber

type Particle = {
  text: string;
  angle: number;
  speed: number;
  radius: number;
  baseRadius: number;
  pulse: number;
  wobble: number;
  size: number;
  x: number;
  y: number;
  caught: boolean;
  releaseAt: number;
};

export function ConfessionField({ voices = CONFESSION_PROMPTS }: { voices?: string[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [caught, setCaught] = useState<string | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

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
    let captionTimer: ReturnType<typeof setTimeout> | null = null;

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

    const ring = Math.min(w, h) * 0.34 || 220;
    const particles: Particle[] = voices.map((text, i) => {
      const angle = (i / voices.length) * Math.PI * 2;
      return {
        text,
        angle,
        speed: 0.0012 + Math.random() * 0.0016,
        radius: ring,
        baseRadius: ring * (0.62 + Math.random() * 0.5),
        pulse: Math.random() * Math.PI * 2,
        wobble: 0.4 + Math.random() * 0.7,
        size: 2.4 + Math.random() * 2.6,
        x: 0,
        y: 0,
        caught: false,
        releaseAt: 0,
      };
    });

    const showCaption = (p: Particle) => {
      setCaught(p.text);
      if (captionTimer) clearTimeout(captionTimer);
      captionTimer = setTimeout(() => setCaught(null), 3600);
    };

    const tick = () => {
      const now = Date.now();
      // Trails: paint a translucent black over the previous frame.
      ctx.fillStyle = 'rgba(10, 9, 8, 0.16)';
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;

      // Soft glow at the centre, the point everything orbits.
      const center = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(w, h) * 0.18);
      center.addColorStop(0, `rgba(${GOLD}, 0.10)`);
      center.addColorStop(1, `rgba(${GOLD}, 0)`);
      ctx.fillStyle = center;
      ctx.fillRect(0, 0, w, h);

      for (const p of particles) {
        if (!p.caught) {
          p.angle += p.speed;
          p.pulse += 0.02;
          const r = p.baseRadius + Math.sin(p.pulse) * 26;
          const tx = cx + Math.cos(p.angle) * r;
          const ty = cy + Math.sin(p.angle) * r * 0.78;
          p.x += (tx - p.x) * 0.04 || 0;
          p.y += (ty - p.y) * 0.04 || 0;
          if (!p.x) p.x = tx;
          if (!p.y) p.y = ty;
          p.x += Math.sin(now * 0.001 + p.pulse) * p.wobble;
          p.y += Math.cos(now * 0.0011 + p.pulse) * p.wobble;

          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          if (dx * dx + dy * dy < 44 * 44) {
            p.caught = true;
            p.releaseAt = now + 4200;
            showCaption(p);
          }
        } else if (now > p.releaseAt) {
          p.caught = false;
        }

        const pulse = Math.sin(p.pulse) * 0.5 + 0.5;
        const opacity = p.caught ? 0.12 : 0.32 + pulse * 0.4;
        const glow = p.size + pulse * 3;

        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glow * 2.4);
        g.addColorStop(0, `rgba(${GOLD}, ${opacity})`);
        g.addColorStop(0.6, `rgba(${GOLD}, ${opacity * 0.25})`);
        g.addColorStop(1, `rgba(${GOLD}, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, glow * 2.4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(${GOLD}, ${Math.min(opacity + 0.25, 0.9)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Faint connective lines, the switchboard feel.
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.strokeStyle = `rgba(${GOLD}, ${(1 - dist / 130) * 0.12})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

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
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerdown', onMove);
    canvas.addEventListener('pointerleave', onLeave);
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(raf);
      if (captionTimer) clearTimeout(captionTimer);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerdown', onMove);
      canvas.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('resize', resize);
    };
  }, [reducedMotion, voices]);

  // Reduced motion: skip the canvas, show the prompts as a quiet static stack.
  if (reducedMotion) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <ul className="flex max-w-2xl flex-wrap items-center justify-center gap-x-5 gap-y-2 px-6 text-center text-[0.8rem] uppercase tracking-[0.18em] text-[rgba(224,176,104,0.45)]">
          {voices.slice(0, 10).map((v) => (
            <li key={v}>{v}</li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full cursor-crosshair touch-none"
      />
      {/* Caught voice, surfaced like a line picked up on the receiver. */}
      <div
        aria-live="polite"
        className={`pointer-events-none absolute inset-x-0 bottom-10 mx-auto max-w-xl px-6 text-center font-[var(--font-display)] text-lg italic leading-7 text-[#F3EBDD] transition-opacity duration-700 md:text-xl ${
          caught ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ textShadow: '0 0 24px rgba(224,176,104,0.35)' }}
      >
        {caught}
      </div>
      {/* Always-present for screen readers / no-JS. */}
      <ul className="sr-only">
        {voices.map((v) => (
          <li key={v}>{v}</li>
        ))}
      </ul>
    </>
  );
}
