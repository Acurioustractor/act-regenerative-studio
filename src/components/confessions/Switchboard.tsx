'use client';

import { useEffect, useRef, useState } from 'react';

import type { Confession } from '@/data/confessions-mock';
import { themeMeta } from '@/data/confessions-mock';

import { ConfessionDetail } from './ConfessionDetail';
import { ConfessionWall } from './ConfessionWall';

// The Switchboard: every confession is a patch-light cabled down to the
// operator hub. They arrive staggered, like calls coming in. Click a light to
// patch through to that voice. ACT is the operator. Metaphor and dashboard in one.
export function Switchboard({ confessions }: { confessions: Confession[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reduced, setReduced] = useState(false);
  const selectedRef = useRef<string | null>(null);
  selectedRef.current = selectedId;

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    const start = Date.now();

    type Node = { c: Confession; x: number; y: number; r: number; phase: number; appear: number };
    let nodes: Node[] = [];

    const layout = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cols = Math.max(3, Math.ceil(Math.sqrt(confessions.length * 1.7)));
      const rows = Math.ceil(confessions.length / cols);
      const padX = w * 0.08;
      const padY = h * 0.14;
      const cellW = (w - padX * 2) / cols;
      const cellH = (h * 0.6 - padY) / Math.max(rows, 1);
      nodes = confessions.map((c, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        return {
          c,
          x: padX + cellW * (col + 0.5) + Math.sin(i * 12.9) * cellW * 0.28,
          y: padY + cellH * (row + 0.5) + Math.cos(i * 7.7) * cellH * 0.28,
          r: 4.5 + (i % 3),
          phase: i * 0.7,
          appear: i * 230,
        };
      });
    };
    layout();

    const draw = () => {
      const t = Date.now() - start;
      ctx.clearRect(0, 0, w, h);

      const hx = w / 2;
      const hy = h - Math.min(56, h * 0.09);

      // Jack-hole grid texture across the board.
      ctx.fillStyle = 'rgba(207,161,107,0.05)';
      for (let x = 26; x < w; x += 26) {
        for (let y = 24; y < h * 0.72; y += 26) {
          ctx.beginPath();
          ctx.arc(x, y, 1.1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Operator hub glow at the bottom.
      const hg = ctx.createRadialGradient(hx, hy, 0, hx, hy, 90);
      hg.addColorStop(0, 'rgba(207,161,107,0.16)');
      hg.addColorStop(1, 'rgba(207,161,107,0)');
      ctx.fillStyle = hg;
      ctx.fillRect(0, hy - 90, w, 180);

      for (const n of nodes) {
        if (t < n.appear) continue;
        const age = Math.min(1, (t - n.appear) / 700);
        const sel = selectedRef.current === n.c.id;
        const rgb = themeMeta[n.c.theme].rgb;
        n.phase += 0.02;
        const pulse = Math.sin(n.phase) * 0.5 + 0.5;
        const a = (sel ? 0.95 : 0.4 + pulse * 0.35) * age;

        // Patch cable down to the hub.
        ctx.strokeStyle = `rgba(${rgb},${(sel ? 0.6 : 0.13) * age})`;
        ctx.lineWidth = sel ? 2 : 1;
        ctx.beginPath();
        ctx.moveTo(n.x, n.y);
        ctx.quadraticCurveTo((n.x + hx) / 2, n.y + (hy - n.y) * 0.62, hx, hy);
        ctx.stroke();

        // Glowing plug.
        const r = n.r + pulse * 2.4;
        const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 3.3);
        g.addColorStop(0, `rgba(${rgb},${a})`);
        g.addColorStop(0.6, `rgba(${rgb},${a * 0.25})`);
        g.addColorStop(1, `rgba(${rgb},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(n.x, n.y, r * 3.3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(${rgb},${Math.min(a + 0.3, 1)})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * (sel ? 1.5 : 1), 0, Math.PI * 2);
        ctx.fill();

        if (sel) {
          ctx.strokeStyle = `rgba(${rgb},0.8)`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r * 2.5, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    const pick = (ev: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = ev.clientX - rect.left;
      const my = ev.clientY - rect.top;
      let best: string | null = null;
      let bd = 26 * 26;
      for (const n of nodes) {
        const dx = n.x - mx;
        const dy = n.y - my;
        const d = dx * dx + dy * dy;
        if (d < bd) {
          bd = d;
          best = n.c.id;
        }
      }
      return best;
    };
    const onMove = (e: PointerEvent) => {
      canvas.style.cursor = pick(e) ? 'pointer' : 'default';
    };
    const onClick = (e: PointerEvent) => {
      const id = pick(e);
      if (id) setSelectedId(id);
    };
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerdown', onClick);
    window.addEventListener('resize', layout);
    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerdown', onClick);
      window.removeEventListener('resize', layout);
    };
  }, [reduced, confessions]);

  const selected = confessions.find((c) => c.id === selectedId) || null;

  if (reduced) return <ConfessionWall confessions={confessions} />;

  return (
    <div>
      <div className="relative overflow-hidden rounded-3xl border border-[#3A2C18] bg-[#15100A]">
        <canvas ref={canvasRef} className="block h-[440px] w-full touch-none md:h-[540px]" aria-hidden="true" />
        <span className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 font-[var(--font-sans)] text-[10px] uppercase tracking-[0.35em] text-[#7C7060]">
          operator
        </span>
      </div>
      <div className="mt-8">
        <ConfessionDetail key={selected?.id ?? 'none'} confession={selected} />
      </div>
    </div>
  );
}
