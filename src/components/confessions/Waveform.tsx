// A deterministic voicemail waveform. Seeded from the message id so it is
// stable across server and client (no hydration mismatch) and each confession
// gets its own shape. Purely decorative: it says "this is a voice".

function seededHeights(seed: string, n: number): number[] {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    h = Math.imul(h, 1103515245) + 12345;
    const v = ((h >>> 8) & 0xffff) / 0xffff; // 0..1
    out.push(0.18 + v * 0.82);
  }
  return out;
}

// progress: null = idle (uniform). 0..1 = playback scrubber, bars up to the
// playhead are lit, the rest dim.
export function Waveform({
  seed,
  bars = 34,
  progress = null,
}: {
  seed: string;
  bars?: number;
  progress?: number | null;
}) {
  const heights = seededHeights(seed, bars);
  return (
    <div className="flex h-7 items-center gap-[2px]" aria-hidden="true">
      {heights.map((v, i) => {
        const played = progress != null && i / Math.max(bars - 1, 1) <= progress;
        const cls =
          progress == null ? 'bg-[#CFA16B]/40' : played ? 'bg-[#E0B068]/90' : 'bg-[#CFA16B]/18';
        return (
          <span
            key={i}
            className={`flex-1 rounded-full transition-colors duration-150 ${cls}`}
            style={{ height: `${Math.round(v * 100)}%` }}
          />
        );
      })}
    </div>
  );
}
