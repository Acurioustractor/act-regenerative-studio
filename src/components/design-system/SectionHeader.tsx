import type { ReactNode } from "react";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  lede?: ReactNode;
  eyebrowColor?: "clay" | "muted";
  onDark?: boolean;
  ledeMaxWidth?: string;
  align?: "left" | "center";
};

export function SectionHeader({
  eyebrow,
  title,
  lede,
  eyebrowColor = "clay",
  onDark = false,
  ledeMaxWidth,
  align = "left",
}: SectionHeaderProps) {
  const titleColor = onDark ? "text-[#FAFAF7]" : "text-[var(--site-ink)]";
  const ledeColor = onDark ? "text-[#FAFAF7]/60" : "text-[var(--site-muted)]";
  // Clay has to switch by surface. clay-text is tuned for the light surfaces
  // and drops to 2.37:1 on --site-dark; the raw brand clay reads at 5.42:1
  // there and fails on light. Same colour family, opposite ends.
  const eyebrowTone =
    eyebrowColor === "clay"
      ? onDark
        ? "text-clay"
        : "text-clay-text"
      : onDark
        ? "text-[#FAFAF7]/60"
        : "text-[var(--site-muted)]";

  const isCenter = align === "center";
  const titleSize = isCenter
    ? "text-[clamp(2.5rem,5vw,4.5rem)] tracking-[-0.02em] leading-[1.05]"
    : "text-[clamp(2rem,4vw,3rem)] leading-[1.1]";
  const ledeStyle: React.CSSProperties = ledeMaxWidth
    ? { maxWidth: ledeMaxWidth }
    : isCenter
      ? { maxWidth: "42rem" }
      : {};

  const content = (
    <>
      {eyebrow ? (
        <p
          className={`font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.3em] ${eyebrowTone}`}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={`mt-4 font-[var(--font-display)] font-light ${titleSize} ${titleColor}`}
      >
        {title}
      </h2>
      {lede ? (
        <p
          className={`mt-8 font-[var(--font-body)] text-lg leading-[1.8] ${ledeColor} ${isCenter ? "mx-auto" : ""}`}
          style={ledeStyle}
        >
          {lede}
        </p>
      ) : null}
    </>
  );

  if (isCenter) {
    return <div className="flex flex-col items-center text-center">{content}</div>;
  }
  return <>{content}</>;
}
