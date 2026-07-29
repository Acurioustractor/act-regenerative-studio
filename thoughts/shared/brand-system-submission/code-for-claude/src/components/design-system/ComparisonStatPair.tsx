type StatSide = {
  value: string;
  label: string;
  meta?: string;
};

type ComparisonStatPairProps = {
  lossy: StatSide;
  win: StatSide;
};

export function ComparisonStatPair({ lossy, win }: ComparisonStatPairProps) {
  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="rounded-[var(--site-radius)] border border-[var(--site-line)] p-8">
        <p className="font-[var(--font-display)] text-4xl font-bold text-[var(--site-ink)]">
          {lossy.value}
        </p>
        <p className="mt-2 font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--site-muted)]">
          {lossy.label}
        </p>
        {lossy.meta ? (
          <p className="mt-3 font-[var(--font-body)] text-[14px] text-red-600/70">
            {lossy.meta}
          </p>
        ) : null}
      </div>
      <div className="rounded-[var(--site-radius)] border-2 border-[var(--site-green)] p-8">
        <p className="font-[var(--font-display)] text-4xl font-bold text-[var(--site-green)]">
          {win.value}
        </p>
        <p className="mt-2 font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--site-muted)]">
          {win.label}
        </p>
        {win.meta ? (
          <p className="mt-3 font-[var(--font-body)] text-[14px] text-[var(--site-green)]">
            {win.meta}
          </p>
        ) : null}
      </div>
    </div>
  );
}
