"use client";

import { useEffect, useRef } from "react";

/**
 * Wraps an article's rich-text body and removes photographs that never arrive.
 *
 * Production carries 107 dead image URLs across 18 of its 21 story pages
 * (measured 2026-08-07 against act-regenerative-studio.vercel.app). Most of
 * them are not in the gallery at the foot of the page; they are inside the
 * prose, where Empathy Ledger's exported HTML embeds them directly. A reader
 * of "At the Speed of Ceremony" met eighteen broken frames while reading.
 *
 * The body is injected with dangerouslySetInnerHTML, so those images are not
 * React elements and cannot take an onError prop. This listens for `error` on
 * the capture phase instead, which is the only way to catch it: error events
 * from an <img> do not bubble.
 *
 * When a photograph fails, its whole <figure> goes, not just the <img>. Half
 * of these images sit in a figure with a caption, and a caption describing a
 * photograph nobody can see is worse than no photograph at all.
 *
 * Hiding rather than removing keeps the DOM stable for anything that may have
 * measured it, and `aria-hidden` keeps the empty node out of a screen reader.
 *
 * This treats the symptom. The photographs are genuinely missing from Empathy
 * Ledger's storage, and only a re-upload there puts them back; see
 * scripts/check-editorial-media.mjs for the measurement that watches it.
 */

/**
 * Body photographs go through Next's optimiser (optimiseArticleImages), which
 * gives up on a slow upstream. Before hiding one, ask for the original once,
 * still through Empathy Ledger's gate: a refused photograph fails again and is
 * hidden, a slow one arrives.
 */
function retryOriginal(image: HTMLImageElement): boolean {
  if (image.dataset.retried) return false;
  let original: string | null = null;
  try {
    const url = new URL(image.currentSrc || image.src, window.location.href);
    if (url.pathname === "/_next/image") original = url.searchParams.get("url");
  } catch {
    return false;
  }
  if (!original) return false;
  image.dataset.retried = "1";
  image.removeAttribute("srcset");
  image.removeAttribute("sizes");
  image.src = original;
  return true;
}

function giveUp(image: HTMLImageElement) {
  if (!retryOriginal(image)) conceal(image);
}

function conceal(image: HTMLImageElement) {
  const target = image.closest("figure") ?? image;
  if (!(target instanceof HTMLElement)) return;
  target.style.display = "none";
  target.setAttribute("aria-hidden", "true");
}

export function RichTextMedia({ html }: { html: string }) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = container.current;
    if (!node) return;

    // Images that failed before this effect ran never fire an event we can
    // catch, so the already-broken ones are swept first. A complete image with
    // no intrinsic width is one the browser tried and could not decode.
    for (const image of node.querySelectorAll("img")) {
      if (image.complete && image.naturalWidth === 0) giveUp(image);
    }

    const onError = (event: Event) => {
      if (event.target instanceof HTMLImageElement) giveUp(event.target);
    };
    node.addEventListener("error", onError, true);
    return () => node.removeEventListener("error", onError, true);
  }, [html]);

  return (
    <div
      ref={container}
      className="rich-text"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
