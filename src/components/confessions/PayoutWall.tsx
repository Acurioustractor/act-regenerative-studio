'use client';

// The Payout Wall, mean-reactive. One cell per Australian foundation/giver,
// brightness by annual giving; the rare open doors glow gold. Hover a cell to see
// who it is; a searchable directory lists every one. The new part: press a
// confession and the wall IGNITES the exact cells that voice is about and
// resolves the one number behind it. The human makes the claim; the data proves
// it, in one motion. Cause and consequence on the same screen.
// Data: /confessions/payout-wall.json (scripts/build-payout-wall-data.mjs).

import { useEffect, useMemo, useRef, useState } from 'react';

type WallData = {
  stats: {
    nGivers: number; totalGivingB: number; openCount: number; pctNoOpenDoor: number;
    gini: number; deadCapitalB: number; deadCount: number; hoardUnder5B: number;
    tracedM: number; pctUntraceable: number; giversToHalf: number;
  };
  giving: number[];
  names: string[];
  openIdx: number[];
  nonGmIdx: number[];
  deadZone: { count: number; capitalB: number };
};

type CellKind = 'open' | 'closedGm' | 'nonGm' | 'dead';
type ReceiptMode = 'concentration' | 'doors' | 'longtail' | 'dead';

type Hover = {
  x: number; y: number; flipX: boolean; flipY: boolean;
  name: string | null; giving: number; kind: CellKind;
};

// Each confession is wired to the part of the system it indicts.
const RECEIPTS: { id: string; src?: string; words?: boolean; tag: string; line: string; mode: ReceiptMode }[] = [
  { id: 'c02', src: '/confessions/audio/c02.mp3', tag: 'power', mode: 'concentration',
    line: 'Just give the money to the people who actually know what is going on.' },
  { id: 'c03', src: '/confessions/audio/c03.mp3', tag: 'the ask', mode: 'doors',
    line: 'Please just ask us. When the ask is human and honest, the answer is always yes.' },
  { id: 'c08', words: true, tag: 'money', mode: 'longtail',
    line: 'Back the small organisations. No grant writer, no marketing budget. Too small to get more money.' },
  { id: 'c06', src: '/confessions/audio/c06.mp3', tag: 'the weight', mode: 'dead',
    line: 'Only a very small drop in a very big ocean.' },
];

const fmtMoney = (g: number) => {
  if (g >= 1e9) return `$${(g / 1e9).toFixed(2)}B`;
  if (g >= 1e6) return `$${(g / 1e6).toFixed(1)}M`;
  if (g >= 1e3) return `$${Math.round(g / 1e3)}K`;
  return `$${g}`;
};

const DOOR_LINE: Record<CellKind, string> = {
  open: '✓ Public application program',
  closedGm: 'No public program found',
  nonGm: 'Not classified as a grantmaker',
  dead: 'Moved nothing last year',
};

export function PayoutWall({ minimal = false, message, messageHint }: { minimal?: boolean; message?: string; messageHint?: string } = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [data, setData] = useState<WallData | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [hover, setHover] = useState<Hover | null>(null);
  const [query, setQuery] = useState('');
  const [openOnly, setOpenOnly] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const acRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const freqRef = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const playingRef = useRef(false);
  const ampRef = useRef(0);
  const geomRef = useRef<{ cols: number; cell: number; offX: number; offY: number; n: number; total: number; dpr: number } | null>(null);
  const hoverIdxRef = useRef<number>(-1);
  // The active receipt spotlight, read by the canvas each frame.
  const receiptRef = useRef<{ mode: ReceiptMode | null; target: number; progress: number }>({ mode: null, target: 0, progress: 0 });
  const dwellRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetch('/confessions/payout-wall.json').then((r) => r.json()).then(setData).catch(() => {});
  }, []);

  useEffect(() => {
    playingRef.current = playingId !== null;
    if (playingId === null) receiptRef.current.target = 0; // fade the spotlight out
  }, [playingId]);

  const openSet = useMemo(() => new Set(data?.openIdx ?? []), [data]);
  const nonGmSet = useMemo(() => new Set(data?.nonGmIdx ?? []), [data]);

  // The smaller half's share of all giving (the long-tail receipt).
  const longtailPct = useMemo(() => {
    if (!data) return 1;
    const g = data.giving, n = g.length, half = Math.floor(n / 2);
    const tot = g.reduce((a, b) => a + b, 0) || 1;
    return Math.max(1, Math.round((100 * g.slice(half).reduce((a, b) => a + b, 0)) / tot));
  }, [data]);

  const kindOf = (i: number, n: number): CellKind => {
    if (i >= n) return 'dead';
    if (openSet.has(i)) return 'open';
    if (nonGmSet.has(i)) return 'nonGm';
    return 'closedGm';
  };

  useEffect(() => {
    if (!data) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const open = new Set(data.openIdx);
    const giving = data.giving;
    const n = giving.length;
    const dead = (data.deadZone && data.deadZone.count) || 0;
    const total = n + dead;
    const maxG = Math.log10(giving[0] + 1);
    const minG = Math.log10((giving[n - 1] || 1) + 1);
    const span = Math.max(maxG - minG, 0.0001);

    let W = 0, H = 0, cols = 0, rows = 0, cell = 0, offX = 0, offY = 0;
    let staticLayer: HTMLCanvasElement | null = null;
    let raf = 0;
    let stopped = false;

    const xy = (i: number) => {
      const c = i % cols, r = Math.floor(i / cols);
      return [offX + c * cell, offY + r * cell] as const;
    };

    const buildStatic = () => {
      staticLayer = document.createElement('canvas');
      staticLayer.width = W; staticLayer.height = H;
      const s = staticLayer.getContext('2d')!;
      s.fillStyle = '#0E0A05';
      s.fillRect(0, 0, W, H);
      const pad = Math.max(cell * 0.22, dpr);
      const sz = Math.max(cell - pad, 1);
      for (let i = 0; i < total; i++) {
        const [x, y] = xy(i);
        if (i >= n) {
          s.fillStyle = 'rgba(74,70,66,0.5)';
          s.fillRect(x + pad / 2, y + pad / 2, sz, sz);
          continue;
        }
        if (open.has(i)) continue;
        const t = (Math.log10(giving[i] + 1) - minG) / span;
        const R = Math.round(120 + 128 * t), G = Math.round(64 + 132 * t), B = Math.round(28 + 92 * t);
        s.fillStyle = `rgba(${R},${G},${B},${0.4 + 0.5 * t})`;
        s.fillRect(x + pad / 2, y + pad / 2, sz, sz);
      }
    };

    const layout = () => {
      const rect = canvas.getBoundingClientRect();
      W = Math.max(1, Math.floor(rect.width * dpr));
      H = Math.max(1, Math.floor(rect.height * dpr));
      canvas.width = W; canvas.height = H;
      const aspect = W / H;
      cols = Math.max(1, Math.ceil(Math.sqrt(total * aspect)));
      rows = Math.ceil(total / cols);
      cell = Math.min(W / cols, H / rows);
      offX = (W - cols * cell) / 2;
      offY = (H - rows * cell) / 2;
      geomRef.current = { cols, cell, offX, offY, n, total, dpr };
      buildStatic();
    };

    const frame = (t: number) => {
      if (stopped) return;
      let target = 0;
      if (playingRef.current && analyserRef.current && freqRef.current) {
        analyserRef.current.getByteFrequencyData(freqRef.current);
        let sum = 0;
        for (let i = 0; i < freqRef.current.length; i++) sum += freqRef.current[i];
        target = Math.min(1, sum / freqRef.current.length / 110);
      }
      ampRef.current += (target - ampRef.current) * 0.18;
      const amp = ampRef.current;
      const idle = 0.5 + 0.5 * Math.sin(t * 0.0011);

      ctx.clearRect(0, 0, W, H);
      if (staticLayer) ctx.drawImage(staticLayer, 0, 0);

      const pad = Math.max(cell * 0.22, dpr);
      const sz = Math.max(cell - pad, 1);

      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      const breath = 0.55 + 0.2 * idle + amp * 1.1;
      for (const i of data.openIdx) {
        const [x, y] = xy(i);
        const cx = x + cell / 2, cy = y + cell / 2;
        const r = cell * (2.1 + amp * 2.6 + 0.4 * idle);
        const a = Math.min(1, breath);
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        grad.addColorStop(0, `rgba(255,224,150,${0.7 * a})`);
        grad.addColorStop(0.4, `rgba(240,190,118,${0.26 * a})`);
        grad.addColorStop(1, 'rgba(240,190,118,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(255,243,212,${Math.min(1, 0.82 + amp * 0.4)})`;
        ctx.fillRect(x + pad / 2, y + pad / 2, sz, sz);
      }
      if (hoverIdxRef.current >= 0 && hoverIdxRef.current < total) {
        const [hx, hy] = xy(hoverIdxRef.current);
        ctx.strokeStyle = 'rgba(248,241,227,0.9)';
        ctx.lineWidth = Math.max(1, dpr);
        ctx.strokeRect(hx + pad / 2 - 1, hy + pad / 2 - 1, sz + 2, sz + 2);
      }
      ctx.restore();

      // RECEIPT SPOTLIGHT: a played voice dims the wall and ignites its evidence.
      const rc = receiptRef.current;
      rc.progress += (rc.target - rc.progress) * 0.07;
      if (rc.target === 0 && rc.progress < 0.01) rc.mode = null;
      if (rc.mode && rc.progress > 0.01) {
        const a = rc.progress;
        ctx.fillStyle = `rgba(13,9,4,${0.62 * a})`;
        ctx.fillRect(0, 0, W, H);
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        const pulse = 0.75 + 0.25 * Math.sin(t * 0.004);
        const lit = (i: number, col: string) => {
          const [x, y] = xy(i);
          ctx.fillStyle = col;
          ctx.fillRect(x + pad / 2, y + pad / 2, sz, sz);
        };
        if (rc.mode === 'concentration') {
          const k = data.stats.giversToHalf;
          for (let i = 0; i < k; i++) lit(i, `rgba(255,226,150,${a * pulse})`);
        } else if (rc.mode === 'doors') {
          for (const i of data.openIdx) lit(i, `rgba(255,236,184,${a * pulse})`);
        } else if (rc.mode === 'dead') {
          for (let i = n; i < total; i++) lit(i, `rgba(150,172,205,${0.62 * a})`);
        } else if (rc.mode === 'longtail') {
          const half = Math.floor(n / 2);
          for (let i = half; i < n; i++) lit(i, `rgba(224,150,88,${0.46 * a})`);
        }
        ctx.restore();
      }

      raf = requestAnimationFrame(frame);
    };

    layout();
    raf = requestAnimationFrame(frame);
    const onResize = () => layout();
    window.addEventListener('resize', onResize);
    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, [data]);

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const g = geomRef.current;
    const canvas = canvasRef.current;
    if (!g || !canvas || !data) return;
    const rect = canvas.getBoundingClientRect();
    const cssX = e.clientX - rect.left;
    const cssY = e.clientY - rect.top;
    const col = Math.floor((cssX * g.dpr - g.offX) / g.cell);
    const row = Math.floor((cssY * g.dpr - g.offY) / g.cell);
    if (col < 0 || col >= g.cols || row < 0) {
      if (hoverIdxRef.current !== -1) { hoverIdxRef.current = -1; setHover(null); }
      return;
    }
    const i = row * g.cols + col;
    if (i < 0 || i >= g.total) {
      if (hoverIdxRef.current !== -1) { hoverIdxRef.current = -1; setHover(null); }
      return;
    }
    if (i === hoverIdxRef.current) {
      setHover((h) => (h ? { ...h, x: cssX, y: cssY, flipX: cssX > rect.width * 0.62, flipY: cssY > rect.height * 0.6 } : h));
      return;
    }
    hoverIdxRef.current = i;
    const kind = kindOf(i, g.n);
    setHover({
      x: cssX, y: cssY,
      flipX: cssX > rect.width * 0.62, flipY: cssY > rect.height * 0.6,
      name: i < g.n ? data.names[i] ?? null : null,
      giving: i < g.n ? data.giving[i] ?? 0 : 0,
      kind,
    });
  };

  const onPointerLeave = () => { hoverIdxRef.current = -1; setHover(null); };

  const ensureAudioGraph = () => {
    if (!audioRef.current) {
      const a = new Audio();
      a.preload = 'none';
      a.addEventListener('ended', () => setPlayingId(null));
      audioRef.current = a;
    }
    if (!acRef.current) {
      try {
        const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ac = new AC();
        const src = ac.createMediaElementSource(audioRef.current);
        const an = ac.createAnalyser();
        an.fftSize = 128;
        src.connect(an);
        an.connect(ac.destination);
        acRef.current = ac;
        analyserRef.current = an;
        freqRef.current = new Uint8Array(an.frequencyBinCount);
      } catch {
        // analyser unavailable: playback still works, wall falls back to idle breath
      }
    }
  };

  const clearDwell = () => { if (dwellRef.current) { clearTimeout(dwellRef.current); dwellRef.current = null; } };

  // Press a confession: play it (or reveal its words) AND ignite its receipt.
  const playReceipt = (v: (typeof RECEIPTS)[number]) => {
    if (playingId === v.id) {
      audioRef.current?.pause();
      clearDwell();
      setPlayingId(null);
      return;
    }
    clearDwell();
    setPlayingId(v.id);
    receiptRef.current.mode = v.mode;
    receiptRef.current.target = 1;
    if (v.src) {
      ensureAudioGraph();
      const a = audioRef.current!;
      acRef.current?.resume?.();
      a.src = v.src;
      a.currentTime = 0;
      a.play().catch(() => {
        // audio blocked: keep the receipt up for a read, then clear
        dwellRef.current = setTimeout(() => setPlayingId(null), 6000);
      });
    } else {
      // words-only: no audio, hold the receipt long enough to read, then clear
      audioRef.current?.pause();
      const ms = Math.min(Math.max(v.line.length * 60, 5200), 9000);
      dwellRef.current = setTimeout(() => setPlayingId(null), ms);
    }
  };

  const s = data?.stats;
  const activeReceipt = RECEIPTS.find((v) => v.id === playingId) ?? null;

  // The one number a receipt resolves to, derived from the data so it never drifts.
  const resolved = useMemo(() => {
    if (!activeReceipt || !s) return null;
    switch (activeReceipt.mode) {
      case 'concentration':
        return { big: String(s.giversToHalf), label: 'move half the money', sub: `of ${s.nGivers.toLocaleString()} that give` };
      case 'doors':
        return { big: String(s.openCount), label: 'have a public door', sub: `${s.pctNoOpenDoor}% have no way in` };
      case 'longtail':
        return { big: `${longtailPct}%`, label: 'is the smaller half’s entire share', sub: `${Math.floor(s.nGivers / 2).toLocaleString()} foundations, together` };
      case 'dead':
        return { big: `$${s.deadCapitalB}B`, label: 'moved nothing at all', sub: `${s.deadCount.toLocaleString()} foundations` };
    }
  }, [activeReceipt, s, longtailPct]);

  const entries = useMemo(() => {
    if (!data) return [] as { i: number; name: string; giving: number; open: boolean; gm: boolean }[];
    return data.names.map((name, i) => ({
      i, name, giving: data.giving[i] ?? 0, open: openSet.has(i), gm: !nonGmSet.has(i),
    }));
  }, [data, openSet, nonGmSet]);

  const filtered = useMemo(() => {
    let r = entries;
    if (openOnly) r = r.filter((e) => e.open);
    const q = query.trim().toLowerCase();
    if (q) r = r.filter((e) => e.name.toLowerCase().includes(q));
    return r;
  }, [entries, openOnly, query]);

  const CAP = 200;
  const shown = filtered.slice(0, CAP);

  return (
    <div className="w-full">
      <style>{`@keyframes rcptIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}`}</style>

      {!minimal && (
        <div className="mx-auto mb-5 max-w-2xl text-center">
          <p className="font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.35em] text-[var(--warm-gold)]">
            The wall is the system. The phone is the people.
          </p>
          <p className="mt-3 font-[var(--font-body)] text-base leading-7 text-[#E4D8C4]">
            Hover any cell to see who it is. Then press a confession: the wall lights up the exact part
            of the system that voice is about, and the number behind it.
          </p>
        </div>
      )}

      <div className="relative w-full">
        <div className="relative w-full overflow-hidden rounded-2xl border border-[var(--warm-bark-deep)] bg-[#0E0A05]">
          <canvas
            ref={canvasRef}
            className="block h-[46vh] min-h-[320px] w-full cursor-crosshair"
            aria-hidden="true"
            onPointerMove={onPointerMove}
            onPointerLeave={onPointerLeave}
          />
          {/* legend */}
          <div className={`pointer-events-none absolute left-3 top-3 flex flex-col gap-1.5 rounded-md border border-[var(--warm-bark-deep)] bg-black/85 px-3.5 py-2.5 font-[var(--font-sans)] text-[11px] uppercase tracking-[0.14em] text-[#EFE6D2] backdrop-blur-[2px] transition-opacity ${activeReceipt ? 'opacity-0' : 'opacity-100'}`}>
            <span className="flex items-center gap-2"><span className="inline-block h-2 w-2 rounded-full bg-[#FFE4AA] shadow-[0_0_8px_2px_rgba(224,176,104,0.8)]" /> {s ? s.openCount : '~104'} with a public door</span>
            <span className="flex items-center gap-2"><span className="inline-block h-2 w-2 rounded-[1px] bg-[#6b4f2a]" /> {s ? s.nGivers.toLocaleString() : '10,141'} that give, no way in</span>
          </div>
          <div className={`pointer-events-none absolute bottom-3 right-4 hidden rounded bg-black/80 px-2.5 py-1 font-mono text-[11px] tracking-[0.04em] text-[#B0A48E] transition-opacity sm:block ${activeReceipt || hover ? 'opacity-0' : 'opacity-100'}`}>
            one cell = one foundation · brightness = annual giving
          </div>
          {/* dead-capital stat plate */}
          {s && (
            <div className={`pointer-events-none absolute bottom-3 left-4 rounded-md border border-[#241a10] bg-black/80 px-3.5 py-2.5 transition-opacity ${activeReceipt || hover ? 'opacity-0' : 'opacity-100'}`}>
              <p className="font-[var(--font-display)] text-xl font-bold leading-none text-[#C4B5A0]">${s.deadCapitalB}B</p>
              <p className="mt-1 font-[var(--font-sans)] text-[10px] uppercase tracking-[0.14em] text-[#9C8E78]">{s.deadCount.toLocaleString()} foundations · moved nothing</p>
            </div>
          )}

          {/* THE RESOLVED NUMBER, top of the wall, the receipt the voice proves */}
          {resolved && (
            <div
              key={activeReceipt?.id}
              className="pointer-events-none absolute inset-x-0 top-7 z-10 flex flex-col items-center px-6 text-center"
              style={{ animation: 'rcptIn .55s ease-out both' }}
            >
              <span className="font-[var(--font-sans)] text-[10px] font-semibold uppercase tracking-[0.4em] text-[var(--warm-gold-bright)]">The receipt</span>
              <span className="mt-1 font-[var(--font-display)] text-[clamp(3rem,9vw,5.5rem)] font-bold leading-[0.95] text-[#FFE9C2]" style={{ textShadow: '0 0 40px rgba(224,176,104,0.45)' }}>
                {resolved.big}
              </span>
              <span className="mt-1 font-[var(--font-body)] text-[clamp(1rem,2.4vw,1.4rem)] text-[var(--warm-cream)]">{resolved.label}</span>
              <span className="mt-1 font-[var(--font-sans)] text-[11px] uppercase tracking-[0.2em] text-[#9C8E78]">{resolved.sub}</span>
            </div>
          )}

          {/* the playing confession's words, over the receipt */}
          {activeReceipt && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/92 via-black/60 to-transparent px-6 pb-8 pt-24">
              <div className="mx-auto max-w-2xl text-center">
                <span className="font-[var(--font-sans)] text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--warm-gold-bright)]">
                  {activeReceipt.tag}{activeReceipt.words ? ' · shared as words' : ''}
                </span>
                <p className="mt-2 font-[var(--font-body)] text-[clamp(1.15rem,2.7vw,1.7rem)] italic leading-snug text-[#F8F1E3]">
                  &ldquo;{activeReceipt.line}&rdquo;
                </p>
              </div>
            </div>
          )}

          {/* hover tooltip */}
          {hover && (
            <div
              className="pointer-events-none absolute z-20 w-[230px] rounded-lg border border-[#5A4A30] bg-black/92 px-3.5 py-3 shadow-xl backdrop-blur-[2px]"
              style={{ left: hover.x, top: hover.y, transform: `translate(${hover.flipX ? 'calc(-100% - 14px)' : '14px'}, ${hover.flipY ? 'calc(-100% - 14px)' : '14px'})` }}
            >
              <p className="font-[var(--font-body)] text-[13.5px] font-semibold leading-snug text-[#F8F1E3]">
                {hover.name ?? (hover.kind === 'dead' ? 'A foundation that moved nothing' : 'An undisclosed foundation')}
              </p>
              {hover.kind !== 'dead' && (
                <p className="mt-1 font-[var(--font-display)] text-lg font-bold leading-none text-[var(--warm-gold-bright)]">
                  {fmtMoney(hover.giving)}<span className="ml-1.5 font-[var(--font-sans)] text-[10px] font-normal uppercase tracking-[0.12em] text-[#9C8E78]">given last year</span>
                </p>
              )}
              <p className={`mt-2 font-[var(--font-sans)] text-[10px] font-semibold uppercase tracking-[0.16em] ${hover.kind === 'open' ? 'text-[#FFE4AA]' : 'text-[#9C8E78]'}`}>
                {DOOR_LINE[hover.kind]}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* the one message: the meaning, between the visualisation and the voices */}
      {(message || messageHint) && (
        <div className="mx-auto mt-9 max-w-2xl text-center">
          {message && (
            <p className="font-[var(--font-body)] text-[clamp(1.1rem,2.5vw,1.5rem)] leading-[1.5] text-[var(--warm-cream)]">{message}</p>
          )}
          {messageHint && (
            <p className="mt-3 font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--warm-gold)]">{messageHint}</p>
          )}
        </div>
      )}

      {/* the controls: press a voice, watch its receipt ignite */}
      <div className="mx-auto mt-6 grid max-w-3xl gap-3 sm:grid-cols-2">
        {RECEIPTS.map((v) => {
          const playing = playingId === v.id;
          return (
            <button
              key={v.id}
              onClick={() => playReceipt(v)}
              aria-pressed={playing}
              aria-label={playing ? 'Stop this confession' : 'Play this confession and light its receipt'}
              className={`flex items-start gap-3 rounded-xl border p-4 text-left transition ${
                playing ? 'border-[var(--warm-gold)] bg-[#CFA16B]/10' : 'border-[var(--warm-bark-deep)] bg-[#1A130B] hover:border-[#5A4A30]'
              }`}
            >
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border" style={{ borderColor: 'rgba(224,176,104,0.5)', color: 'var(--warm-gold-bright)', background: 'rgba(224,176,104,0.08)' }}>
                {playing ? (
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
                ) : v.words ? (
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7h16M4 12h10M4 17h7" /></svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 translate-x-[1px]" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.5.87l11-6.5a1 1 0 0 0 0-1.74l-11-6.5A1 1 0 0 0 8 5.5Z" /></svg>
                )}
              </span>
              <span className="min-w-0">
                <span className="font-[var(--font-sans)] text-[10px] uppercase tracking-[0.2em] text-[var(--warm-gold)]">{v.tag}{v.words ? ' · words' : ''}</span>
                <span className="mt-1 block font-[var(--font-body)] text-[15px] italic leading-[1.5] text-[#E4D8C4]">&ldquo;{v.line}&rdquo;</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* SEE THEM ALL: the directory (hidden in minimal mode) */}
      {!minimal && (
      <div className="mx-auto mt-8 max-w-3xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="relative block w-full sm:max-w-xs">
            <span className="sr-only">Search foundations by name</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search any foundation by name…"
              className="w-full rounded-lg border border-[var(--warm-bark-deep)] bg-[#1A130B] px-3.5 py-2.5 font-[var(--font-body)] text-sm text-[var(--warm-cream)] placeholder:text-sand-lift focus:border-[var(--warm-gold)] focus:outline-none"
            />
          </label>
          <div className="flex items-center gap-4 text-[12px]">
            <button
              onClick={() => setOpenOnly((v) => !v)}
              aria-pressed={openOnly}
              className={`rounded-full border px-3 py-1.5 font-[var(--font-sans)] uppercase tracking-[0.16em] transition ${
                openOnly ? 'border-[var(--warm-gold)] bg-[#CFA16B]/15 text-[#FFE4AA]' : 'border-[var(--warm-bark-deep)] text-[#B0A48E] hover:border-[#5A4A30]'
              }`}
            >
              Open doors only
            </button>
            <span className="font-mono text-[11px] text-sand-lift">
              {data ? `${filtered.length.toLocaleString()} of ${entries.length.toLocaleString()}` : '…'}
            </span>
          </div>
        </div>

        <ul className="mt-3 max-h-[360px] divide-y divide-[#241a10] overflow-y-auto rounded-xl border border-[var(--warm-bark-deep)] bg-[#120D07]">
          {shown.map((e) => (
            <li key={e.i} className="flex items-center justify-between gap-3 px-4 py-2.5">
              <span className="flex min-w-0 items-center gap-2.5">
                <span aria-hidden="true" className={`h-2 w-2 shrink-0 rounded-full ${e.open ? 'shadow-[0_0_6px_1px_rgba(224,176,104,0.7)]' : ''}`} style={{ background: e.open ? '#FFE4AA' : '#4a3a22' }} />
                <span className="truncate font-[var(--font-body)] text-[13.5px] text-[#E4D8C4]">{e.name}</span>
              </span>
              <span className="flex shrink-0 items-center gap-3">
                <span className="font-mono text-[12px] text-[#B0A48E]">{fmtMoney(e.giving)}</span>
                <span className={`hidden w-14 text-right font-[var(--font-sans)] text-[9px] font-semibold uppercase tracking-[0.14em] sm:inline ${e.open ? 'text-[#FFE4AA]' : 'text-[#6f6452]'}`}>
                  {e.open ? 'open' : e.gm ? 'no door' : ''}
                </span>
              </span>
            </li>
          ))}
          {data && filtered.length === 0 && (
            <li className="px-4 py-6 text-center font-[var(--font-body)] text-sm text-sand-lift">No foundation matches “{query}”.</li>
          )}
        </ul>
        {filtered.length > CAP && (
          <p className="mt-2 text-center font-[var(--font-sans)] text-[11px] uppercase tracking-[0.16em] text-sand-lift">
            Showing the top {CAP} by giving. Search a name to narrow it down.
          </p>
        )}
      </div>
      )}
    </div>
  );
}
