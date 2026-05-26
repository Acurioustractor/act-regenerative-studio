'use client';

import { useEffect, useState } from 'react';

// A ticking call timer, the Gold.Phone "04:32" homage. Starts at 00:00 on both
// server and client to avoid hydration mismatch, then counts up once mounted.
export function CallTimer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  return (
    <span className="inline-flex items-center gap-2 font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.4em] text-[rgba(255,170,60,0.7)]">
      <span className="h-2 w-2 animate-pulse rounded-full bg-[rgba(255,170,60,0.9)]" />
      Line open
      <span className="tabular-nums tracking-[0.2em]">
        {mm}:{ss}
      </span>
    </span>
  );
}
