import type { ReactNode } from "react";

type EditorialSplitProps = {
  left: ReactNode;
  right: ReactNode;
  bg?: "default" | "surface" | "dark";
  id?: string;
  leftClassName?: string;
  rightClassName?: string;
};

const bgClass: Record<NonNullable<EditorialSplitProps["bg"]>, string> = {
  default: "",
  surface: "full-bleed bg-[var(--site-surface)]",
  dark: "full-bleed bg-[var(--site-dark)]",
};

export function EditorialSplit({
  left,
  right,
  bg = "default",
  id,
  leftClassName = "",
  rightClassName = "",
}: EditorialSplitProps) {
  const sectionClass = `${bgClass[bg]} px-8 py-32 md:py-44`.trim();
  return (
    <section id={id} className={sectionClass}>
      <div className="mx-auto max-w-[1200px] grid gap-20 lg:grid-cols-2 lg:items-center">
        <div className={leftClassName}>{left}</div>
        <div className={rightClassName}>{right}</div>
      </div>
    </section>
  );
}
