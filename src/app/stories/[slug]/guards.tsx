"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { GatedImg } from "@/components/pieces/GatedImg";
import styles from "./article.module.css";

/**
 * Three small guards for photographs that do not arrive. Empathy Ledger's storage still cannot serve every image an
 * article points at, and the old reader hid those rather than frame them: a figure whose picture is gone went with its
 * caption (a caption for a picture nobody can see is worse than none), a gallery with nothing left hid itself, and a
 * hero that failed fell back to the words alone. The pieces draw their own failure state ("Photograph not available");
 * these keep the article from showing it in the middle of a story.
 */

/** GatedImg retries an optimiser failure with the original; only a failure with no retry left is the end. */
function finallyFailed(image: HTMLImageElement): boolean {
  return image.dataset.attempt !== "optimised";
}

function conceal(image: HTMLImageElement) {
  const target = image.closest("figure") ?? image;
  if (!(target instanceof HTMLElement)) return;
  target.style.display = "none";
  target.setAttribute("aria-hidden", "true");
}

/** Wraps the article body. A photograph in it that fails takes its whole figure away. */
export function HideBrokenFigures({ children, className }: { children: ReactNode; className?: string }) {
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = box.current;
    if (!node) return;
    for (const image of node.querySelectorAll("img")) {
      if (image.complete && image.naturalWidth === 0 && finallyFailed(image)) conceal(image);
    }
    // An image that fails does not bubble an error, so listen on the way down.
    const onError = (event: Event) => {
      if (event.target instanceof HTMLImageElement && finallyFailed(event.target)) conceal(event.target);
    };
    node.addEventListener("error", onError, true);
    return () => node.removeEventListener("error", onError, true);
  }, []);

  return (
    <div ref={box} className={className}>
      {children}
    </div>
  );
}

/** The opening with its photograph, and the opening without it if that photograph never arrives. */
export function OpeningGuard({ children, fallback }: { children: ReactNode; fallback: ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const node = box.current;
    if (!node) return;
    const image = node.querySelector("img");
    if (image && image.complete && image.naturalWidth === 0 && finallyFailed(image)) setFailed(true);
    const onError = (event: Event) => {
      if (event.target instanceof HTMLImageElement && finallyFailed(event.target)) setFailed(true);
    };
    node.addEventListener("error", onError, true);
    return () => node.removeEventListener("error", onError, true);
  }, []);

  if (failed) return <>{fallback}</>;
  return (
    <div ref={box} className={styles.contents}>
      {children}
    </div>
  );
}

export type GalleryPhoto = { url: string; alt: string; caption: string | null };

/**
 * The field photographs at the foot of the article (Pencil: Field photographs theGf): a row of eyebrow, then the
 * photographs four across. Each is one Empathy Ledger holds for the article that the body did not already show. The
 * alt text and caption are the ledger's own words, and a photograph without either is left without.
 */
export function FieldPhotographs({ photos }: { photos: GalleryPhoto[] }) {
  // GatedImg gives up only after the original has failed too, including before this script arrived.
  const [dead, setDead] = useState<string[]>([]);
  const live = photos.filter((photo) => !dead.includes(photo.url));

  if (live.length === 0) return null;

  return (
    <section className={styles.gallery} aria-labelledby="field-photographs">
      <p id="field-photographs" className={styles.galleryEyebrow}>
        Field photographs
      </p>
      <ul className={styles.galleryGrid} style={{ "--across": Math.min(live.length, 4) } as CSSProperties}>
        {live.map((photo) => (
          <li key={photo.url}>
            <figure className={styles.galleryFigure}>
              <div className={styles.galleryPhoto}>
                <GatedImg
                  src={photo.url}
                  alt={photo.alt}
                  sizes="(max-width: 759px) 50vw, 25vw"
                  onGiveUp={() => setDead((current) => (current.includes(photo.url) ? current : [...current, photo.url]))}
                />
              </div>
              {photo.caption && <figcaption className={styles.galleryCaption}>{photo.caption}</figcaption>}
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
