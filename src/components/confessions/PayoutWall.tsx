'use client';

// The Payout Wall: 10,133 cells, one per Australian foundation/giver, brightness
// by annual giving. The ~112 with a public application program glow gold (the
// rare open doors); 98.9% sit dark. A real Confessions voicemail can be played
// over it: the wall breathes with the voice (Web Audio analyser), tying the
// cold receipts to the human truth. Data: /confessions/payout-wall.json
// (verified 2026-05-29, see grantscope/output/foundation-power.provenance.md).

import { useEffect, useRef, useState } from 'react';

type WallData = {
  stats: {
    nGivers: number; totalGivingB: number; openCount: number; pctNoOpenDoor: number;
    gini: number; deadCapitalB: number; deadCount: number; hoardUnder5B: number;
    tracedM: number; pctUntraceable: number;
  };
  giving: number[];
  openIdx: number[];
  deadZone: { count: number; capitalB: number };
};

const VOICES = [
  { id: 'c03', src: '/confessions/audio/c03.mp3', tag: 'the ask',
    line: 'When you make the ask human and honest, the answer is always yes.' },
  { id: 'c02', src: '/confessions/audio/c02.mp3', tag: 'power',
    line: 'Just give the money to the people who actually know what is going on.' },
  { id: 'c04', src: '/confessions/audio/c04.mp3', tag: 'hope',
    line: 'I wish you didn’t have to exist.' },
  { id: 'c06', src: '/confessions/audio/c06.mp3', tag: 'the weight',
    line: 'Only a very small drop in a very big ocean.' },
];

export function PayoutWall() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [data, setData] = useState<WallData | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const acRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  // Pin the buffer generic: getByteFrequencyData wants Uint8Array<ArrayBuffer>
  // (TS 5.7+ made Uint8Array generic), and that is what `new Uint8Array(n)` is.
  const freqRef = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const playingRef = useRef(false);
  const ampRef = useRef(0);

  useEffect(() => {
    fetch('/confessions/payout-wall.json').then((r) => r.json()).then(setData).catch(() => {});
  }, []);

  useEffect(() => {
    playingRef.current = playingId !== null;
  }, [playingId]);

  // Canvas render loop. Static dim field is pre-rendered to an offscreen buffer;
  // each frame blits it and draws the animated gold door-glows on top.
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
    const dead = (data.deadZone && data.deadZone.count) || 0; // foundations that gave nothing
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
          // the dead zone: capital that moved nothing. Cool, inert, matte grey,
          // a distinct mass against the warm brass of the givers.
          s.fillStyle = 'rgba(82,78,72,0.62)';
          s.fillRect(x + pad / 2, y + pad / 2, sz, sz);
          continue;
        }
        if (open.has(i)) continue; // doors live in the animated layer
        const t = (Math.log10(giving[i] + 1) - minG) / span; // 0..1 by giving
        // brass -> warm gold ramp by giving. Floor lifted so every closed door is a
        // visible mark: the wall reads as a dense field of doors, not empty space.
        const R = Math.round(96 + 128 * t), G = Math.round(70 + 106 * t), B = Math.round(40 + 64 * t);
        s.fillStyle = `rgba(${R},${G},${B},${0.5 + 0.42 * t})`;
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
      buildStatic();
    };

    const frame = (t: number) => {
      if (stopped) return;
      // amplitude: real audio when playing, gentle idle breath otherwise
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

      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      const pad = Math.max(cell * 0.22, dpr);
      const sz = Math.max(cell - pad, 1);
      const breath = 0.55 + 0.2 * idle + amp * 1.1;
      for (const i of data.openIdx) {
        const [x, y] = xy(i);
        const cx = x + cell / 2, cy = y + cell / 2;
        const r = cell * (1.5 + amp * 2.2 + 0.3 * idle);
        const a = Math.min(1, breath);
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        grad.addColorStop(0, `rgba(255,205,120,${0.5 * a})`);
        grad.addColorStop(0.4, `rgba(224,176,104,${0.2 * a})`);
        grad.addColorStop(1, 'rgba(224,176,104,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(255,228,170,${Math.min(1, 0.75 + amp * 0.5)})`;
        ctx.fillRect(x + pad / 2, y + pad / 2, sz, sz);
      }
      ctx.restore();
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

  const playVoice = (v: (typeof VOICES)[number]) => {
    ensureAudioGraph();
    const a = audioRef.current!;
    if (playingId === v.id) {
      a.pause();
      setPlayingId(null);
      return;
    }
    acRef.current?.resume?.();
    a.src = v.src;
    a.currentTime = 0;
    a.play().then(() => setPlayingId(v.id)).catch(() => setPlayingId(null));
  };

  const s = data?.stats;

  return (
    <div className="w-full">
      <div className="relative w-full overflow-hidden rounded-2xl border border-[#3A2C18] bg-[#0E0A05]">
        <canvas ref={canvasRef} className="block h-[46vh] min-h-[320px] w-full" aria-hidden="true" />
        {/* legend */}
        <div className="pointer-events-none absolute left-3 top-3 flex flex-col gap-1.5 rounded-md border border-[#241a10] bg-black/70 px-3.5 py-2.5 font-[var(--font-sans)] text-[10px] uppercase tracking-[0.16em] text-[#C3B5A0] backdrop-blur-[2px]">
          <span className="flex items-center gap-2"><span className="inline-block h-2 w-2 rounded-full bg-[#FFE4AA] shadow-[0_0_8px_2px_rgba(224,176,104,0.8)]" /> {s ? s.openCount : '~113'} with a public door</span>
          <span className="flex items-center gap-2"><span className="inline-block h-2 w-2 rounded-[1px] bg-[#6b4f2a]" /> {s ? s.nGivers.toLocaleString() : '10,133'} that give, no way in</span>
        </div>
        <div className="pointer-events-none absolute bottom-3 right-4 hidden font-mono text-[10px] tracking-[0.05em] text-[#7C7060] sm:block">
          one cell = one foundation · brightness = annual giving
        </div>
        {/* The dead block: capital that moved nothing. A matte void that pulses with a voice. */}
        {s && (
          <div
            className={`pointer-events-none absolute bottom-3 left-4 rounded-md border border-[#241a10] bg-black/80 px-3.5 py-2.5 ${playingId ? 'animate-pulse' : ''}`}
          >
            <p className="font-[var(--font-display)] text-xl font-bold leading-none text-[#5a4a32]">
              ${s.deadCapitalB}B
            </p>
            <p className="mt-1 font-[var(--font-sans)] text-[9px] uppercase tracking-[0.16em] text-[#6b5f4e]">
              {s.deadCount.toLocaleString()} foundations · moved nothing
            </p>
          </div>
        )}
      </div>

      {/* The voices: the human truth behind the receipts */}
      <div className="mt-8">
        <p className="text-center font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.35em] text-[#CFA16B]">
          The wall is the system. The phone is the people.
        </p>
        <div className="mx-auto mt-6 grid max-w-3xl gap-3 sm:grid-cols-2">
          {VOICES.map((v) => {
            const playing = playingId === v.id;
            return (
              <button
                key={v.id}
                onClick={() => playVoice(v)}
                aria-pressed={playing}
                aria-label={playing ? 'Pause this confession' : 'Play this confession over the wall'}
                className={`flex items-start gap-3 rounded-xl border p-4 text-left transition ${
                  playing
                    ? 'border-[#CFA16B] bg-[#CFA16B]/10'
                    : 'border-[#3A2C18] bg-[#1A130B] hover:border-[#5A4A30]'
                }`}
              >
                <span
                  className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border"
                  style={{ borderColor: 'rgba(224,176,104,0.5)', color: '#E0B068', background: 'rgba(224,176,104,0.08)' }}
                >
                  {playing ? (
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
                  ) : (
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 translate-x-[1px]" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.5.87l11-6.5a1 1 0 0 0 0-1.74l-11-6.5A1 1 0 0 0 8 5.5Z" /></svg>
                  )}
                </span>
                <span className="min-w-0">
                  <span className="font-[var(--font-sans)] text-[10px] uppercase tracking-[0.2em] text-[#CFA16B]">{v.tag}</span>
                  <span className="mt-1 block font-[var(--font-body)] text-[15px] italic leading-[1.5] text-[#E4D8C4]">&ldquo;{v.line}&rdquo;</span>
                </span>
              </button>
            );
          })}
        </div>
        <p className="mt-5 text-center font-[var(--font-body)] text-[13px] text-[#7C7060]">
          Press play and watch the wall breathe. Real voicemails from the gold phone.
        </p>
      </div>
    </div>
  );
}
