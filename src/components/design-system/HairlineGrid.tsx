import type { ReactNode } from "react";

type HairlineGridProps = {
  columns: 2 | 3 | 5;
  onDark?: boolean;
  className?: string;
  children: ReactNode;
};

const columnClass: Record<HairlineGridProps["columns"], string> = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  5: "md:grid-cols-5",
};

export function HairlineGrid({ columns, onDark = false, className = "", children }: HairlineGridProps) {
  return (
    <div
      className={`grid gap-px overflow-hidden rounded-[var(--site-radius)] bg-[var(--site-line)] ${columnClass[columns]} ${className}`}
    >
      {children}
    </div>
  );
}

type HairlineCellProps = {
  onDark?: boolean;
  padding?: "compact" | "breathing";
  className?: string;
  children: ReactNode;
};

export function HairlineCell({
  onDark = false,
  padding = "compact",
  className = "",
  children,
}: HairlineCellProps) {
  const bg = onDark ? "bg-[var(--site-dark)]" : "bg-[var(--site-bg)]";
  const pad = padding === "breathing" ? "p-10" : "p-8";
  return <div className={`${bg} ${pad} ${className}`}>{children}</div>;
}
