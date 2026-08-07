"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * The backdrop of an editorial article's hero, and what happens when the
 * photograph behind it does not exist.
 *
 * The reader already had a considered treatment for an article with no
 * featured image: a deep olive field, a low clay glow, and the title's first
 * letter set enormous and barely visible. It was only ever reached when the
 * feed said there was no image at all. Two articles say there is one and point
 * at a URL that returns 400 (wilya-janta and edition-1-sowing-seeds-of-
 * connection-2, measured 2026-08-07), and those landed on the plain near-black
 * rectangle the photograph was meant to cover.
 *
 * So the typographic cover is now the floor rather than a branch. It renders
 * underneath every hero; a photograph that loads simply covers it. Nothing
 * flashes, because the cover is painted first and the photograph arrives on
 * top of it in the ordinary way.
 *
 * Only the scrim changes on failure. The photograph scrim is heavy enough to
 * hold white text over an unpredictable image, and that same weight over the
 * olive would leave the cover looking like a mistake rather than a decision.
 */

export function ArticleHeroMedia({
  imageUrl,
  alt,
  initial,
}: {
  imageUrl: string | null;
  alt: string;
  initial: string;
}) {
  const [failed, setFailed] = useState(false);
  const showingPhotograph = Boolean(imageUrl) && !failed;

  return (
    <>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(150deg,#33402F_0%,#222B21_55%,#161B15_100%)]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_18%_88%,rgba(196,132,92,0.28),transparent_70%)]" />
        <span className="absolute -bottom-24 right-[-4%] select-none font-[var(--font-display)] text-[38vw] font-light italic leading-none text-[#F3EBDD]/[0.05] md:text-[26vw]">
          {initial}
        </span>
      </div>

      {imageUrl && !failed ? (
        <Image
          src={imageUrl}
          alt={alt}
          fill
          sizes="100vw"
          className="object-cover"
          priority
          onError={() => setFailed(true)}
        />
      ) : null}

      <div
        className={
          showingPhotograph
            ? "absolute inset-0 bg-gradient-to-b from-black/30 via-black/60 to-black/85"
            : "absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40"
        }
      />
    </>
  );
}
