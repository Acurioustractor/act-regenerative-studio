import Link from "next/link";
import type { ReactNode } from "react";
import { SiteLoopVideo } from "@/components/media/SiteLoopVideo";

type HeroAction = {
  label: string;
  href: string;
  variant?: "solid" | "outline";
  external?: boolean;
};

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  coverImage?: {
    url: string;
    alt: string;
  } | null;
  coverVideo?: {
    url: string;
    posterUrl?: string | null;
    title: string;
  } | null;
  actions?: HeroAction[];
  gradientClass?: string;
  className?: string;
  panelClassName?: string;
  children?: ReactNode;
};

const actionVariants = {
  solid:
    "site-glow-link rounded-full bg-[#2D6A4F] px-6 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white shadow-[0_16px_40px_rgba(45,106,79,0.22)] transition hover:bg-[#245741]",
  outline:
    "site-glow-link rounded-full border border-[#2D6A4F] bg-white/45 px-6 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#1F2B21] transition hover:bg-[#E5F4E4]",
};

export default function PageHero({
  eyebrow,
  title,
  description,
  coverImage,
  coverVideo,
  actions,
  gradientClass,
  className,
  panelClassName,
  children,
}: PageHeroProps) {
  const hasPanel = Boolean(children);
  const hasHeroMedia = Boolean(coverVideo || coverImage);

  return (
    <section className={`space-y-0 ${className ?? ""}`}>
      {hasHeroMedia ? (
        <div className="relative h-[42vh] min-h-[320px] max-h-[560px] overflow-hidden rounded-t-[36px] border border-b-0 border-[#D9C9A9] bg-[#11110F]">
          {coverVideo ? (
            <SiteLoopVideo
              src={coverVideo.url}
              poster={coverVideo.posterUrl || coverImage?.url || undefined}
              title={coverVideo.title}
              preload="metadata"
              className="h-full w-full object-cover"
            />
          ) : coverImage ? (
            <img
              src={coverImage.url}
              alt={coverImage.alt}
              className="h-full w-full object-cover"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
          <div className="absolute bottom-4 right-4 rounded-full border border-white/15 bg-black/35 px-3 py-1 text-xs uppercase tracking-[0.22em] text-white backdrop-blur-sm">
            {coverVideo ? "Field video" : "Field image"}
          </div>
        </div>
      ) : null}

      <div
        className={`site-surface relative overflow-hidden ${hasHeroMedia ? "rounded-b-[36px]" : "rounded-[36px]"} bg-gradient-to-br ${
          gradientClass ?? "from-[#F7F1E7] via-[#E6D9C6] to-[#D1C1A1]"
        } p-8 md:p-12`}
      >
        <div className="absolute -left-16 top-8 h-40 w-40 rounded-full bg-[#d9ead7]/60 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-56 w-56 translate-x-10 translate-y-10 rounded-full bg-[#d3a24f]/15 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />
        <div
          className={`relative z-10 grid gap-8 ${hasPanel ? "lg:grid-cols-[1.2fr_0.8fr]" : ""}`}
        >
          <div className="space-y-6">
            {eyebrow ? <p className="site-eyebrow">{eyebrow}</p> : null}
            <h1 className="text-4xl font-semibold leading-[1.02] text-[#241c15] md:text-6xl font-[var(--font-display)]">
              {title}
            </h1>
            {description ? (
              <p className="max-w-2xl text-base leading-8 text-[#5a4b3e] md:text-[1.08rem]">
                {description}
              </p>
            ) : null}
            {actions && actions.length > 0 ? (
              <div className="flex flex-wrap gap-4">
                {actions.map((action) => {
                  const className =
                    actionVariants[action.variant ?? "solid"] ??
                    actionVariants.solid;

                  if (action.external) {
                    return (
                      <a
                        key={action.label}
                        href={action.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${className} inline-flex items-center gap-2`}
                      >
                        {action.label}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      </a>
                    );
                  }

                  return (
                    <Link
                      key={action.label}
                      href={action.href}
                      className={className}
                    >
                      {action.label}
                    </Link>
                  );
                })}
              </div>
            ) : null}
          </div>
          {hasPanel ? (
            <div
              className={
                panelClassName ??
                "rounded-[28px] border border-[#d8c7a5] bg-[rgba(255,251,245,0.72)] p-6 text-sm leading-7 text-[#4D3F33] shadow-[0_20px_45px_rgba(58,42,28,0.09)]"
              }
            >
              {children}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
