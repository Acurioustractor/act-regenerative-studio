"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * The field-photograph gallery on an editorial article, with dead images
 * removed rather than framed.
 *
 * 81 of the 114 photograph URLs the editorial feed carries return HTTP 400
 * from Empathy Ledger's storage (measured 2026-08-07). The featured image of
 * every article survives; almost nothing else does. Because the gallery
 * deliberately excludes the featured image, seventeen of the nineteen articles
 * that have a gallery were rendering a bento grid in which *every* frame was
 * dead: seven black rectangles filling a full screen of the page.
 *
 * Three things could fix that. Filtering at sync time is the right long-term
 * home and needs Empathy Ledger to stop emitting URLs it cannot serve. A baked
 * list of known-dead URLs in this repository would work today and drift by
 * tomorrow. This is the third: let the browser be the source of truth. An
 * image that fails to load removes itself, and a gallery with nothing left
 * removes its whole section, heading included.
 *
 * The cost is a brief flash of empty frames before the errors land, which is
 * why the frames are the page's own surface colour rather than the near-black
 * they used to be: a photograph that has not arrived yet should look like a
 * space waiting, not like a hole.
 *
 * This is defence, not a repair. The photographs are genuinely missing
 * upstream, and no front-end change puts them back.
 */

export interface GalleryPhoto {
  url: string;
  alt: string;
  caption: string | null;
}

export function ArticleGallery({
  photos,
  articleTitle,
}: {
  photos: GalleryPhoto[];
  articleTitle: string;
}) {
  const [dead, setDead] = useState<string[]>([]);
  const live = photos.filter((photo) => !dead.includes(photo.url));

  if (live.length === 0) return null;

  // Layout follows the surviving count, not the requested one, so an article
  // left with a single photograph gets the single-photograph treatment rather
  // than one image stranded in a three-column grid.
  const columns =
    live.length === 1
      ? "mx-auto max-w-[900px] grid-cols-1"
      : live.length === 2
        ? "md:grid-cols-2"
        : "md:grid-cols-2 lg:grid-cols-3";

  return (
    <section className="full-bleed bg-[#F6F1E7] px-6 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-[1300px]">
        <p className="mb-8 text-center font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.35em] text-[var(--we-warm-brown)] md:mb-12">
          Field photographs
        </p>
        <div className={`grid gap-3 md:gap-4 ${columns}`}>
          {live.map((photo, index) => {
            const isBentoLead = index === 0 && live.length >= 3;
            return (
              <div
                key={photo.url}
                className={`relative overflow-hidden rounded-[20px] bg-[#EFE7D8] ${
                  isBentoLead
                    ? "aspect-[16/10] lg:col-span-2 lg:row-span-2 lg:aspect-[16/11]"
                    : live.length === 1
                      ? "aspect-[16/10]"
                      : "aspect-[4/3]"
                }`}
              >
                <Image
                  src={photo.url}
                  alt={photo.alt || `Field photograph from ${articleTitle}`}
                  fill
                  sizes={
                    isBentoLead
                      ? "(min-width: 1024px) 66vw, 100vw"
                      : live.length === 1
                        ? "(min-width: 900px) 900px, 100vw"
                        : "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  }
                  className="object-cover transition-transform duration-[6s] ease-out hover:scale-[1.03]"
                  onError={() =>
                    setDead((current) =>
                      current.includes(photo.url) ? current : [...current, photo.url],
                    )
                  }
                />
                {photo.caption ? (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 md:p-5">
                    <p className="font-[var(--font-body)] text-[13px] italic leading-snug text-[#F3EBDD] md:text-base md:leading-normal">
                      {photo.caption}
                    </p>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
