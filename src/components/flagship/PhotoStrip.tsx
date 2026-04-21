"use client";

import Image from "next/image";
import { useState } from "react";

interface MediaItem {
  url: string;
  alt?: string;
  title?: string;
}

interface PhotoStripProps {
  images: MediaItem[];
  columns?: 2 | 3 | 4;
  aspectRatio?: "square" | "landscape" | "portrait";
  rounded?: boolean;
}

export function PhotoStrip({
  images,
  columns = 3,
  aspectRatio = "landscape",
  rounded = true,
}: PhotoStripProps) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  if (images.length === 0) return null;

  const aspect =
    aspectRatio === "square"
      ? "aspect-square"
      : aspectRatio === "portrait"
        ? "aspect-[3/4]"
        : "aspect-[3/2]";

  const cols =
    columns === 2
      ? "grid-cols-2"
      : columns === 4
        ? "grid-cols-2 md:grid-cols-4"
        : "grid-cols-3";

  return (
    <>
      <div className={`grid ${cols} gap-2 md:gap-3`}>
        {images.slice(0, columns).map((img, i) => (
          <button
            key={i}
            onClick={() => setLightboxIdx(i)}
            className={`relative ${aspect} overflow-hidden ${rounded ? "rounded-[var(--site-radius)]" : ""} group cursor-pointer`}
          >
            <Image
              src={img.url}
              alt={img.alt || img.title || ""}
              fill
              sizes={`${Math.round(100 / columns)}vw`}
              className="object-cover transition duration-500 group-hover:scale-105"
              unoptimized
            />
          </button>
        ))}
      </div>

      {/* Simple lightbox */}
      {lightboxIdx !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={() => setLightboxIdx(null)}
        >
          <div className="relative max-h-[85vh] max-w-[90vw]">
            <Image
              src={images[lightboxIdx].url}
              alt={images[lightboxIdx].alt || ""}
              width={1200}
              height={800}
              className="max-h-[85vh] w-auto rounded-lg object-contain"
              unoptimized
            />
          </div>
          <button
            onClick={() => setLightboxIdx(null)}
            className="absolute right-6 top-6 rounded-full bg-white/10 p-3 text-white/60 transition hover:bg-white/20 hover:text-white"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}
