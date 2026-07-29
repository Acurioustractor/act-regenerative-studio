import type { ReactNode } from "react";

type Principle = {
  title?: string;
  body: ReactNode;
};

type PrinciplesListProps = {
  items: Principle[];
  onDark?: boolean;
  variant?: "titled" | "plain";
};

export function PrinciplesList({
  items,
  onDark = false,
  variant = "titled",
}: PrinciplesListProps) {
  const titleColor = onDark ? "text-[#FAFAF7]" : "text-[var(--site-ink)]";
  const bodyColor = onDark ? "text-[#FAFAF7]/60" : "text-[var(--site-muted)]";

  if (variant === "plain") {
    return (
      <div className="space-y-8">
        {items.map((item, i) => (
          <p
            key={i}
            className={`border-l-[3px] border-[var(--site-clay)] pl-6 font-[var(--font-body)] text-lg leading-[1.8] ${bodyColor}`}
          >
            {item.body}
          </p>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {items.map((item, i) => (
        <div key={i} className="border-l-[3px] border-[var(--site-clay)] pl-8">
          {item.title ? (
            <h3 className={`font-[var(--font-display)] text-lg font-semibold ${titleColor}`}>
              {item.title}
            </h3>
          ) : null}
          <p
            className={`mt-2 font-[var(--font-body)] text-[15px] leading-[1.8] ${bodyColor}`}
          >
            {item.body}
          </p>
        </div>
      ))}
    </div>
  );
}
