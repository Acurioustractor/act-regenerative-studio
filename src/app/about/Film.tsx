"use client";

import { useEffect, useRef } from "react";

/**
 * A silent film that plays while it is on screen, as the live history does. It waits for its poster (the still the
 * page already uses) and never plays for someone who has asked their device for less motion: they see the still.
 * The film is decoration; what it shows is said in the words around it.
 */
export function Film({ src, poster, className }: { src: string; poster: string; className?: string }) {
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = video.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const watch = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.25 },
    );
    watch.observe(el);
    return () => watch.disconnect();
  }, []);

  return (
    <video ref={video} className={className} poster={poster} muted loop playsInline preload="metadata" aria-hidden="true">
      <source src={src} type="video/mp4" />
    </video>
  );
}
