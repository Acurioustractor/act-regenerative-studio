"use client";

import { useState } from "react";

interface FullscreenVideoProps {
  src: string;
  poster?: string | null;
  title: string;
}

export function FullscreenVideo({ src, poster, title }: FullscreenVideoProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="group relative aspect-video w-full cursor-pointer overflow-hidden rounded-[var(--site-radius)]"
      >
        <video
          src={src}
          poster={poster || undefined}
          className="h-full w-full object-cover"
          muted
          loop
          autoPlay
          playsInline
          preload="metadata"
          aria-label={title}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/30">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform group-hover:scale-110">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="var(--site-dark)"
              className="ml-1"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        <div className="absolute bottom-4 right-4 rounded-full bg-black/50 px-3 py-1.5 backdrop-blur-sm">
          <span className="font-[var(--font-sans)] text-[10px] font-semibold uppercase tracking-[0.2em] text-white/80">
            Watch fullscreen
          </span>
        </div>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
          onClick={() => setIsOpen(false)}
        >
          <button
            onClick={() => setIsOpen(false)}
            className="absolute right-6 top-6 z-50 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"
            aria-label="Close"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          <div
            className="relative max-h-[90vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              src={src}
              poster={poster || undefined}
              className="max-h-[90vh] w-auto rounded-[var(--site-radius)]"
              controls
              autoPlay
              playsInline
              aria-label={title}
            />
          </div>
        </div>
      )}
    </>
  );
}
