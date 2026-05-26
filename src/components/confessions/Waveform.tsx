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

export function Waveform({ seed, bars = 34 }: { seed: string; bars?: number }) {
  const heights = seededHeights(seed, bars);
  return (
    <div className="flex h-7 items-center gap-[2px]" aria-hidden="true">
      {heights.map((v, i) => (
        <span
          key={i}
          className="flex-1 rounded-full bg-[#CFA16B]/40"
          style={{ height: `${Math.round(v * 100)}%` }}
        />
      ))}
    </div>
  );
}
