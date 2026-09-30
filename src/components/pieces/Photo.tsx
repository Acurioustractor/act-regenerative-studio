"use client";

import { useEffect, useRef, useState } from "react";
import { Wheel } from "./Onward";
import styles from "./photo.module.css";

type State = "still" | "loading" | "loaded" | "failed";

/**
 * A photograph, and what stands in for it until it arrives (Pencil: Photo E6GIv; the wait from act-play.html's d-load).
 * No spinner: the big wheel turns until the picture arrives, then the picture comes up over it. If it never arrives the
 * wheel stops and the slot says so in words; nothing is faked in its place. It fills the box its parent gives it, so
 * the parent sets the height or the ratio. `tone="duotone"` is Pencil's Photo treatment (ink and paper only).
 * Without script the picture simply shows.
 */
export function Photo({
  src,
  alt,
  tone = "colour",
  priority = false,
  className,
}: {
  src: string;
  /** What is in the photograph. Pass an empty string only when the picture is decoration. */
  alt: string;
  tone?: "colour" | "duotone";
  /** Load now rather than when it scrolls near: for the photograph at the top of a page. */
  priority?: boolean;
  className?: string;
}) {
  const image = useRef<HTMLImageElement>(null);
  const [state, setState] = useState<State>("still");

  useEffect(() => {
    const img = image.current;
    if (!img) return;
    // It may have arrived (or failed) before this script did.
    setState(img.complete ? (img.naturalWidth > 0 ? "loaded" : "failed") : "loading");
  }, [src]);

  const classes = [styles.photo, tone === "duotone" ? styles.duotone : "", className].filter(Boolean).join(" ");

  return (
    <div className={classes} data-state={state}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={image}
        src={src}
        alt={alt}
        className={styles.image}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : undefined}
        onLoad={() => setState("loaded")}
        onError={() => setState("failed")}
      />
      {(state === "loading" || state === "failed") && (
        <>
          <span aria-hidden="true" className={styles.wheel}>
            <Wheel />
          </span>
          {state === "failed" && <span className={styles.note}>Photograph not available</span>}
        </>
      )}
    </div>
  );
}
