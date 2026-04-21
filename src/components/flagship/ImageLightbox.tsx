"use client";

import Image from "next/image";
import { useState, useCallback, useEffect } from "react";

interface GalleryImage {
  id: string;
  url: string;
  thumbnailUrl?: string;
  alt?: string;
  title?: string;
}

export function ImageLightbox({ images }: { images: GalleryImage[] }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const close = useCallback(() => setSelectedIndex(null), []);
  const prev = useCallback(
    () =>
      setSelectedIndex((i) =>
        i !== null ? (i - 1 + images.length) % images.length : null
      ),
    [images.length]
  );
  const next = useCallback(
    () =>
      setSelectedIndex((i) =>
        i !== null ? (i + 1) % images.length : null
      ),
    [images.length]
  );

  useEffect(() => {
    if (selectedIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedIndex, close, prev, next]);

  if (!images.length) return null;

  return (
    <>
      <div className="grid gap-3 md:grid-cols-3">
        {images.map((img, i) => (
          <button
            key={img.id}
            onClick={() => setSelectedIndex(i)}
            className={`group relative cursor-pointer overflow-hidden rounded-[var(--site-radius)] ${
              i === 0
                ? "md:col-span-2 md:row-span-2 aspect-[4/3]"
                : "aspect-[16/10]"
            }`}
          >
            <Image
              src={img.thumbnailUrl || img.url}
              alt={img.alt || img.title || "Field documentation"}
              fill
              sizes={
                i === 0
                  ? "(min-width: 768px) 66vw, 100vw"
                  : "(min-width: 768px) 33vw, 100vw"
              }
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
          </button>
        ))}
      </div>

      {/* Lightbox overlay */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={close}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
            className="absolute right-6 top-6 z-50 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"
            aria-label="Close"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                className="absolute left-6 z-50 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"
                aria-label="Previous"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                className="absolute right-6 z-50 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"
                aria-label="Next"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </>
          )}

          <div
            className="relative max-h-[85vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[selectedIndex].url}
              alt={
                images[selectedIndex].alt ||
                images[selectedIndex].title ||
                "Field documentation"
              }
              width={1600}
              height={1000}
              className="max-h-[85vh] w-auto rounded-[var(--site-radius)] object-contain"
              priority
            />
            {images[selectedIndex].title && (
              <p className="mt-4 text-center font-[var(--font-body)] text-sm text-white/60">
                {images[selectedIndex].title}
              </p>
            )}
          </div>

          {/* Counter */}
          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.3em] text-white/40">
            {selectedIndex + 1} / {images.length}
          </p>
        </div>
      )}
    </>
  );
}
