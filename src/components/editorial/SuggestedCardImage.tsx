"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * The thumbnail on a "Keep reading" card, and what it does when the
 * photograph behind it is gone.
 *
 * These cards already had a treatment for an article with no image: the tile
 * sets the word "Editorial" small and faint on the card's own sand colour. It
 * was only ever reached when the feed said there was no image, never when the
 * feed named one that answers 400.
 *
 * That gap was the last visible damage from the Empathy Ledger media move. The
 * article body, gallery and hero were all given a fallback in the first pass
 * and eighteen of twenty-one live story pages came back clean; the remaining
 * three each showed two broken frames, and every one of them was here, at the
 * foot of the page, in a card recommending another article.
 *
 * A suggestion is worth less than the thing it points at, so this fails to the
 * quiet tile rather than doing anything cleverer.
 */

export function SuggestedCardImage({
  src,
  alt,
}: {
  src: string | null;
  alt: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="flex h-full items-center justify-center">
        <span className="font-[var(--font-sans)] text-[10px] uppercase tracking-[0.3em] text-[var(--we-warm-brown)]/40">
          Editorial
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(min-width: 768px) 33vw, 100vw"
      className="object-cover transition-transform duration-[6s] ease-out group-hover:scale-[1.04]"
      onError={() => setFailed(true)}
    />
  );
}
