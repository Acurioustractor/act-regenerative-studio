import type { ReactNode } from "react";

type WarmCardProps = {
  title?: string;
  children: ReactNode;
  as?: "div" | "section" | "article";
  headingLevel?: "h2" | "h3";
  className?: string;
};

export function WarmCard({
  title,
  children,
  as: Tag = "div",
  headingLevel: HeadingTag = "h2",
  className = "",
}: WarmCardProps) {
  return (
    <Tag
      className={`rounded-3xl border border-[var(--we-sand)] bg-white/80 p-8 text-sm leading-7 text-[var(--we-brown)] ${className}`}
    >
      {title ? (
        <HeadingTag className="font-[var(--font-display)] text-2xl font-semibold text-[var(--we-olive)]">
          {title}
        </HeadingTag>
      ) : null}
      {title ? <div className="mt-4 space-y-4">{children}</div> : children}
    </Tag>
  );
}
