"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * The arrive move: the parts come together once, then get out of the way. Marks its children data-arrive="waiting"
 * until they scroll into view, then "in"; the piece's own CSS says what arriving looks like. Nothing waits when motion
 * is reduced, when there is no IntersectionObserver, or when the piece is already in view on load.
 */
export function Arrive({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"still" | "waiting" | "in">("still");

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (node.getBoundingClientRect().top < window.innerHeight) return;
    setState("waiting");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setState("in");
        observer.disconnect();
      },
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className} data-arrive={state}>
      {children}
    </div>
  );
}
