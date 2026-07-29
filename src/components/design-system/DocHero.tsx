import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { SiteLoopVideo } from "@/components/media/SiteLoopVideo";

type CoverImage = { url: string; alt: string };
type CoverVideo = { url: string; posterUrl?: string | null; title: string };

type HeroCta = {
  label: string;
  href: string;
  external?: boolean;
};

type DocHeroProps = {
  eyebrow?: string;
  title: string;
  subhead?: string;
  titleMaxChars?: number;
  coverImage?: CoverImage | null;
  coverVideo?: CoverVideo | null;
  primaryCta?: HeroCta;
  secondaryCta?: HeroCta;
  children?: ReactNode;
  fullHeight?: boolean;
  statsAfter?: ReactNode;
  gradientStrength?: "default" | "strong";
};

function CtaButton({ cta, variant }: { cta: HeroCta; variant: "primary" | "ghost" }) {
  const base =
    "rounded-[var(--site-radius)] px-10 py-5 font-[var(--font-sans)] text-[14px] font-semibold uppercase tracking-[0.12em] transition";
  const primary =
    "bg-[#FAFAF7] text-[var(--site-dark)] hover:-translate-y-0.5 hover:shadow-[0_8px_40px_rgba(250,250,247,0.15)]";
  const ghost =
    "border-2 border-[#FAFAF7]/30 text-[#FAFAF7]/90 hover:border-[#FAFAF7]/60 hover:text-[#FAFAF7]";
  const className = `${base} ${variant === "primary" ? primary : ghost}`;

  if (cta.external) {
    return (
      <a href={cta.href} target="_blank" rel="noopener noreferrer" className={className}>
        {cta.label}
      </a>
    );
  }
  return (
    <Link href={cta.href} className={className}>
      {cta.label}
    </Link>
  );
}

export function DocHero({
  eyebrow,
  title,
  subhead,
  titleMaxChars = 16,
  coverImage,
  coverVideo,
  primaryCta,
  secondaryCta,
  children,
  fullHeight = false,
  statsAfter,
  gradientStrength = "default",
}: DocHeroProps) {
  const minHeight = fullHeight ? "min-h-[100vh]" : "min-h-[90vh]";
  const gradientClass =
    gradientStrength === "strong"
      ? "bg-gradient-to-t from-[var(--site-dark)] via-[var(--site-dark)]/55 to-[var(--site-dark)]/15"
      : "bg-gradient-to-t from-[var(--site-dark)] via-[var(--site-dark)]/25 to-transparent";
  return (
    <section className={`full-bleed relative flex ${minHeight} flex-col justify-end overflow-hidden bg-[var(--site-dark)]`}>
      <div className="absolute inset-0">
        {coverVideo ? (
          <SiteLoopVideo
            src={coverVideo.url}
            poster={coverVideo.posterUrl || undefined}
            title={coverVideo.title}
            preload="metadata"
            className="h-full w-full object-cover animate-[slowZoom_30s_ease-in-out_infinite_alternate]"
          />
        ) : coverImage ? (
          <Image
            src={coverImage.url}
            alt={coverImage.alt}
            fill
            sizes="100vw"
            className="object-cover"
          />
        ) : null}
        <div className={`absolute inset-0 ${gradientClass}`} />
      </div>
      <div className="relative z-10 mx-auto w-full max-w-[1200px] px-8 pb-24 pt-40 md:pb-32">
        {eyebrow ? (
          <p
            className="font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.35em] text-clay-text"
            style={{ textShadow: "0 1px 12px rgba(0,0,0,0.6)" }}
          >
            {eyebrow}
          </p>
        ) : null}
        <h1
          className="mt-4 font-[var(--font-display)] text-[clamp(3rem,7vw,5.5rem)] font-light leading-[1.05] tracking-[-0.02em] text-[#FAFAF7]"
          style={{ maxWidth: `${titleMaxChars}ch` }}
        >
          {title}
        </h1>
        {subhead ? (
          <p
            className={`mt-6 max-w-md font-[var(--font-body)] text-lg leading-[1.7] ${gradientStrength === "strong" ? "text-[#FAFAF7]/80" : "text-[#FAFAF7]/60"}`}
            style={gradientStrength === "strong" ? { textShadow: "0 1px 12px rgba(0,0,0,0.6)" } : undefined}
          >
            {subhead}
          </p>
        ) : null}
        {(primaryCta || secondaryCta || children) ? (
          <div className="mt-12 flex flex-wrap gap-5">
            {primaryCta ? <CtaButton cta={primaryCta} variant="primary" /> : null}
            {secondaryCta ? <CtaButton cta={secondaryCta} variant="ghost" /> : null}
            {children}
          </div>
        ) : null}
        {statsAfter ? <div className="mt-20">{statsAfter}</div> : null}
      </div>
    </section>
  );
}
