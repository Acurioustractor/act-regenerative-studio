import type { ReactNode } from "react";

type PhotoBreakProps = {
  children: ReactNode;
};

export function PhotoBreak({ children }: PhotoBreakProps) {
  return (
    <section className="full-bleed mt-8 md:mt-16">
      <div className="relative h-[50vh] md:h-[60vh] w-full overflow-hidden">
        {children}
      </div>
    </section>
  );
}
