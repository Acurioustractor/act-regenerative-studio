"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

import { canonicalMediaSrc, isOptimisable } from "@/lib/media/optimised-image";

/**
 * next/image with the original as a floor.
 *
 * The optimiser gives up on an upstream that is slow to answer, and a cold
 * page asks it for many 1.5 to 2.5 MB originals at once: on 30 Sep 2026 three
 * of the /harvest gallery photographs timed out that way while the consent
 * gate was serving them. Before the optimiser, the browser fetched the
 * original itself and never timed out. So a failure here retries the original,
 * still through the gate, and only then gives up: `onGiveUp` lets a caller
 * fall back to its empty tile, and without one the frame is removed.
 */
export function FallbackImage({
  src,
  onGiveUp,
  unoptimized,
  ...props
}: Omit<ImageProps, "src" | "onError"> & { src: string; onGiveUp?: () => void }) {
  const canonical = canonicalMediaSrc(src);
  const [attempt, setAttempt] = useState<"optimised" | "original" | "gone">(
    unoptimized || !isOptimisable(canonical) ? "original" : "optimised",
  );
  if (attempt === "gone") return null;

  const onError = () => {
    if (attempt === "optimised") return setAttempt("original");
    setAttempt("gone");
    onGiveUp?.();
  };

  if (attempt === "original" && !isOptimisable(canonical)) {
    // next/image throws on a host outside next.config.js; a plain img does not.
    const { alt, className, sizes, priority, fill } = props;
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={canonical}
        alt={alt}
        className={className}
        sizes={typeof sizes === "string" ? sizes : undefined}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        style={fill ? { position: "absolute", inset: 0, width: "100%", height: "100%" } : undefined}
        onError={onError}
      />
    );
  }

  return <Image {...props} src={canonical} unoptimized={attempt === "original"} onError={onError} />;
}
