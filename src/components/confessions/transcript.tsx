import type { ReactNode } from 'react';

import styles from './transcript.module.css';

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
        className={styles.redacted}
        style={{ width: `${Math.min(7, Math.max(2, Math.round(seg.length / 2)))}ch` }}
      />
    ) : (
      <span key={i}>{seg}</span>
    ),
  );
}
