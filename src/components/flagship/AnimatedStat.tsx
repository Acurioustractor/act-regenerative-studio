"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedStatProps {
  value: string;
  label: string;
}

export function AnimatedStat({ value, label }: AnimatedStatProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(value);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!ref.current || hasAnimated.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimated.current) return;
        hasAnimated.current = true;
        observer.disconnect();

        // Parse: "9,225" → numeric 9225, prefix "", suffix ""
        // Parse: "$94.6B" → numeric 94.6, prefix "$", suffix "B"
        // Parse: "10+" → numeric 10, prefix "", suffix "+"
        // Parse: "97x" → numeric 97, prefix "", suffix "x"
        const m = value.match(/^([^0-9]*)([\d,.]+)(.*)$/);
        if (!m) return; // non-numeric, just show as-is

        const prefix = m[1];
        const numStr = m[2];
        const suffix = m[3];
        const target = parseFloat(numStr.replace(/,/g, ""));
        const hasCommas = numStr.includes(",");
        const hasDecimal = numStr.includes(".");
        const decimalPlaces = hasDecimal ? (numStr.split(".")[1] || "").length : 0;

        if (isNaN(target) || target === 0) return;

        const duration = 1000;
        const steps = 30;
        let step = 0;

        const timer = setInterval(() => {
          step++;
          const progress = step / steps;
          // Ease out
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = target * eased;

          if (step >= steps) {
            setDisplay(value); // restore exact original string
            clearInterval(timer);
          } else {
            let formatted: string;
            if (hasDecimal) {
              formatted = current.toFixed(decimalPlaces);
            } else if (hasCommas) {
              formatted = Math.round(current).toLocaleString();
            } else {
              formatted = Math.round(current).toString();
            }
            setDisplay(`${prefix}${formatted}${suffix}`);
          }
        }, duration / steps);
      },
      { threshold: 0.3 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref}>
      <p className="font-[var(--font-display)] text-5xl font-bold text-[#FAFAF7]">
        {display}
      </p>
      <p className="mt-2 font-[var(--font-sans)] text-[10px] font-semibold uppercase tracking-[0.3em] text-[#FAFAF7]/40">
        {label}
      </p>
    </div>
  );
}
