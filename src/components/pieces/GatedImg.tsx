"use client";

import { useEffect, useRef, useState } from "react";
import {
  canonicalMediaSrc,
  isOptimisable,
  optimisedImageUrl,
  optimisedSrcSet,
} from "@/lib/media/optimised-image";

/**
 * A photograph at the size it is shown, the way main's FallbackImage brings one (src/lib/media/optimised-image.ts).
 * An Empathy Ledger photograph always comes through its consent gate, and Next's optimiser asks the gate for it, so a
 * withdrawal still removes it. The optimiser gives up on a slow upstream, so a failure retries the original, still
 * through the gate, and only then gives up: onGiveUp tells the caller and the image draws nothing.
 *
 * `data-attempt` says which try is showing, so a guard can tell a retry from the end ("optimised" is followed by a
 * retry of the original). `width` and `height`, when known, are the photograph's own proportions, so the words do not
 * jump when it arrives.
 */
export function GatedImg({
  src,
  alt,
  sizes = "100vw",
  width,
  height,
  className,
  priority = false,
  onLoad,
  onGiveUp,
}: {
  src: string;
  alt: string;
  sizes?: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  onLoad?: () => void;
  onGiveUp?: () => void;
}) {
  const canonical = canonicalMediaSrc(src);
  const [attempt, setAttempt] = useState<"optimised" | "original" | "gone">(
    isOptimisable(canonical) ? "optimised" : "original",
  );
  const image = useRef<HTMLImageElement>(null);

  const fail = () => {
    if (attempt === "optimised") return setAttempt("original");
    setAttempt("gone");
    onGiveUp?.();
  };

  // It may have arrived, or failed, before this script did.
  useEffect(() => {
    const img = image.current;
    if (!img || !img.complete) return;
    if (img.naturalWidth > 0) onLoad?.();
    else fail();
    // Only when the try changes: `fail` and `onLoad` are the same work each render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt, canonical]);

  if (attempt === "gone") return null;
  const optimised = attempt === "optimised";

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={image}
      src={optimised ? optimisedImageUrl(canonical, 1200) : canonical}
      srcSet={optimised ? optimisedSrcSet(canonical) : undefined}
      sizes={optimised ? sizes : undefined}
      width={width}
      height={height}
      alt={alt}
      className={className}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : undefined}
      data-attempt={attempt}
      onLoad={onLoad}
      onError={fail}
    />
  );
}
