import type { ReactNode } from "react";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  lede?: ReactNode;
  eyebrowColor?: "clay" | "muted";
  onDark?: boolean;
  ledeMaxWidth?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  lede,
  eyebrowColor = "clay",
  onDark = false,
  ledeMaxWidth,
}: SectionHeaderProps) {
  const titleColor = onDark ? "text-[#FAFAF7]" : "text-[var(--site-ink)]";
  const ledeColor = onDark ? "text-[#FAFAF7]/60" : "text-[var(--site-muted)]";
  const eyebrowTone =
    eyebrowColor === "clay"
      ? "text-[var(--site-clay)]"
      : onDark
        ? "text-[#FAFAF7]/60"
        : "text-[var(--site-muted)]";

  return (
    <>
      {eyebrow ? (
        <p
          className={`font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.3em] ${eyebrowTone}`}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={`mt-4 font-[var(--font-display)] text-[clamp(2rem,4vw,3rem)] font-light leading-[1.1] ${titleColor}`}
      >
        {title}
      </h2>
      {lede ? (
        <p
          className={`mt-8 font-[var(--font-body)] text-lg leading-[1.8] ${ledeColor}`}
          style={ledeMaxWidth ? { maxWidth: ledeMaxWidth } : undefined}
        >
          {lede}
        </p>
      ) : null}
    </>
  );
}
