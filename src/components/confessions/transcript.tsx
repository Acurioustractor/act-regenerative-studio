import type { ReactNode } from 'react';

export function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  return `${m}:${String(seconds % 60).padStart(2, '0')}`;
}

// Render a transcript, turning runs of "█" (moderator-redacted detail) into bars.
export function renderTranscript(text: string): ReactNode {
  return text.split(/(█+)/).map((seg, i) =>
    /^█+$/.test(seg) ? (
      <span
        key={i}
        aria-label="redacted"
        className="mx-0.5 inline-block h-[0.9em] translate-y-[2px] rounded-[2px] bg-[#D8CBB6]/80"
        style={{ width: `${Math.min(7, Math.max(2, Math.round(seg.length / 2)))}ch` }}
      />
    ) : (
      <span key={i}>{seg}</span>
    ),
  );
}
