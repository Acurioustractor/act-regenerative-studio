"use client";

import { useEffect, useRef } from "react";

/**
 * A silent film that fills the box its parent gives it, with its still as the poster. It plays while it is on screen and
 * never plays for someone who has asked their device for less motion: they see the still. Give it a `label` when the
 * film says something the words around it do not; otherwise it is decoration and is hidden from a screen reader.
 */
export function Film({
  src,
  poster,
  label,
  className,
}: {
  src: string;
  poster: string;
  label?: string;
  className?: string;
}) {
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
  }, [src]);

  return (
    <video
      ref={video}
      className={className}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      disablePictureInPicture
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
