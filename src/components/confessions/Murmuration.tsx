'use client';

import { useEffect, useRef, useState } from 'react';

import type { Confession } from '@/data/confessions-mock';
import { themeMeta, themeOrder } from '@/data/confessions-mock';

import { ConfessionDetail } from './ConfessionDetail';
import { ConfessionWall } from './ConfessionWall';

// The Murmuration: themes are gravity wells (money, power, the forms, shame,
// hope, breakthrough). Confessions drift toward their theme and cluster like
// starlings. The shape of what philanthropy is and is not hearing. Click a node
// to hear it. (Clustering is by theme here; swaps to embedding clusters later.)
export function Murmuration({ confessions }: { confessions: Confession[] }) {
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

    // Only show wells that actually have confessions, so clusters fill the space.
    const themes = themeOrder.filter((t) => confessions.some((c) => c.theme === t));
    const wells: Record<string, { x: number; y: number }> = {};

    type Node = { c: Confession; x: number; y: number; vx: number; vy: number; r: number; phase: number };
    let nodes: Node[] = [];

    const layout = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cx = w / 2;
      const cy = h / 2;
      const rad = Math.min(w, h) * 0.34;
      themes.forEach((t, i) => {
        const ang = (i / themes.length) * Math.PI * 2 - Math.PI / 2;
        wells[t] = { x: cx + Math.cos(ang) * rad, y: cy + Math.sin(ang) * rad * 0.82 };
      });
      if (nodes.length === 0) {
        nodes = confessions.map((c, i) => ({
          c,
          x: cx + (Math.sin(i * 5.1) * w) / 5,
          y: cy + (Math.cos(i * 3.3) * h) / 5,
          vx: 0,
          vy: 0,
          r: 4 + (i % 3),
          phase: i * 0.9,
        }));
      }
    };
    layout();

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // Well labels, faint.
      ctx.textAlign = 'center';
      ctx.font = "600 11px var(--font-sans), system-ui, sans-serif";
      for (const t of themes) {
        const wl = wells[t];
        if (!wl) continue;
        const rgb = themeMeta[t].rgb;
        ctx.fillStyle = `rgba(${rgb},0.42)`;
        ctx.fillText(themeMeta[t].label.toUpperCase(), wl.x, wl.y - 4);
      }

      // Drift: steer toward the theme well + slight orbit + jitter.
      for (const n of nodes) {
        const wl = wells[n.c.theme];
        if (wl) {
          const dx = wl.x - n.x;
          const dy = wl.y - n.y;
          n.vx += dx * 0.0008 + (Math.random() - 0.5) * 0.06 - dy * 0.00016;
          n.vy += dy * 0.0008 + (Math.random() - 0.5) * 0.06 + dx * 0.00016;
        }
        // Separation: keep nodes from piling on the well so the cluster stays
        // a visible flock of points, not a single blob.
        for (const m of nodes) {
          if (m === n) continue;
          const sx = n.x - m.x;
          const sy = n.y - m.y;
          const d2 = sx * sx + sy * sy;
          if (d2 > 0.01 && d2 < 28 * 28) {
            const d = Math.sqrt(d2);
            n.vx += (sx / d) * 0.12;
            n.vy += (sy / d) * 0.12;
          }
        }
        n.vx *= 0.94;
        n.vy *= 0.94;
        const sp = Math.hypot(n.vx, n.vy);
        if (sp > 1.4) {
          n.vx = (n.vx / sp) * 1.4;
          n.vy = (n.vy / sp) * 1.4;
        }
        n.x += n.vx;
        n.y += n.vy;
        n.phase += 0.02;
      }

      // Constellation lines between nearby same-theme nodes.
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          if (a.c.theme !== b.c.theme) continue;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 110) {
            ctx.strokeStyle = `rgba(${themeMeta[a.c.theme].rgb},${(1 - dist / 110) * 0.16})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Nodes.
      for (const n of nodes) {
        const sel = selectedRef.current === n.c.id;
        const rgb = themeMeta[n.c.theme].rgb;
        const pulse = Math.sin(n.phase) * 0.5 + 0.5;
        const a = sel ? 0.95 : 0.45 + pulse * 0.35;
        const r = n.r + pulse * 2;
        const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 3.2);
        g.addColorStop(0, `rgba(${rgb},${a})`);
        g.addColorStop(0.6, `rgba(${rgb},${a * 0.25})`);
        g.addColorStop(1, `rgba(${rgb},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(n.x, n.y, r * 3.2, 0, Math.PI * 2);
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
      let bd = 24 * 24;
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
      <div className="relative overflow-hidden rounded-3xl border border-[#2A251F] bg-[#0A0908]">
        <canvas ref={canvasRef} className="block h-[460px] w-full touch-none md:h-[560px]" aria-hidden="true" />
      </div>
      <div className="mt-8">
        <ConfessionDetail key={selected?.id ?? 'none'} confession={selected} />
      </div>
    </div>
  );
}
