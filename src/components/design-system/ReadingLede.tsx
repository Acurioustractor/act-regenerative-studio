import type { ReactNode } from "react";

type ReadingLedeProps = {
  id?: string;
  children: ReactNode;
};

export function ReadingLede({ id, children }: ReadingLedeProps) {
  return (
    <section id={id} className="px-8 py-32 md:py-44">
      <div className="mx-auto max-w-[640px]">
        <p className="font-[var(--font-body)] text-[clamp(1.3rem,2.5vw,1.75rem)] leading-[1.6] text-[var(--site-ink)]">
          {children}
        </p>
      </div>
    </section>
  );
}
