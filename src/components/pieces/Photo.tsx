"use client";

import { useEffect, useState } from "react";
import { GatedImg } from "./GatedImg";
import { Wheel } from "./Onward";
import styles from "./photo.module.css";

type State = "still" | "loading" | "loaded" | "failed";

/**
 * A photograph, and what stands in for it until it arrives (Pencil: Photo E6GIv; the wait from act-play.html's d-load).
 * No spinner: the big wheel turns until the picture arrives, then the picture comes up over it. If it never arrives the
 * wheel stops and the slot says so in words; nothing is faked in its place. It fills the box its parent gives it, so
 * the parent sets the height or the ratio. `tone="duotone"` is Pencil's Photo treatment (ink and paper only).
 * Without script the picture simply shows. The picture comes through GatedImg: Empathy Ledger's gate, at the size it is
 * shown (`sizes`), with the original as a floor.
 */
export function Photo({
  src,
  alt,
  tone = "colour",
  priority = false,
  sizes = "100vw",
  className,
}: {
  src: string;
  /** What is in the photograph. Pass an empty string only when the picture is decoration. */
  alt: string;
  tone?: "colour" | "duotone";
  /** Load now rather than when it scrolls near: for the photograph at the top of a page. */
  priority?: boolean;
  /** How wide it is shown, as an `<img sizes>`, so the optimiser sends no more than that. */
  sizes?: string;
  className?: string;
}) {
  // "still" until script runs, so the picture shows without it; then loading until it arrives or GatedImg gives up.
  // GatedImg reports a picture that arrived before script did, and its report runs first.
  const [state, setState] = useState<State>("still");
  useEffect(() => setState((now) => (now === "still" ? "loading" : now)), []);

  const classes = [styles.photo, tone === "duotone" ? styles.duotone : "", className].filter(Boolean).join(" ");

  return (
    <div className={classes} data-state={state}>
      <GatedImg
        key={src}
        src={src}
        alt={alt}
        sizes={sizes}
        className={styles.image}
        priority={priority}
        onLoad={() => setState("loaded")}
        onGiveUp={() => setState("failed")}
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
