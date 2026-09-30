import styles from './waveform.module.css';

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
    <div className={styles.wave} aria-hidden="true">
      {heights.map((v, i) => {
        const played = progress != null && i / Math.max(bars - 1, 1) <= progress;
        const tone = progress == null ? styles.idle : played ? styles.played : styles.rest;
        return <span key={i} className={`${styles.bar} ${tone}`} style={{ height: `${Math.round(v * 100)}%` }} />;
      })}
    </div>
  );
}
