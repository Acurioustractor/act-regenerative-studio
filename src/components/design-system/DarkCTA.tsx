import Link from "next/link";
import type { ReactNode } from "react";

type DarkCTAProps = {
  variant: "primary" | "ghost";
  href: string;
  external?: boolean;
  children: ReactNode;
};

export function DarkCTA({ variant, href, external, children }: DarkCTAProps) {
  const base =
    "rounded-[var(--site-radius)] px-10 py-5 font-[var(--font-sans)] text-[14px] font-semibold uppercase tracking-[0.12em] transition";
  const styles =
    variant === "primary"
      ? "bg-[var(--site-bg)] text-[var(--site-dark)] hover:-translate-y-0.5 hover:shadow-[0_8px_40px_rgba(250,250,247,0.15)]"
      : "border-2 border-[#FAFAF7]/30 text-[#FAFAF7]/90 hover:border-[#FAFAF7]/60 hover:text-[var(--site-bg)]";
  const className = `${base} ${styles}`;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
