/**
 * The shape of an Empathy Ledger photograph, known before the browser loads it.
 *
 * Empathy Ledger holds `width` and `height` columns for every media asset, but
 * on 30 Sep 2026 all 17 body photographs of "At the Speed of Ceremony" had
 * both empty, and its feed does not carry them. With no size in the HTML, each
 * photograph opened from nothing and pushed the text down as it arrived:
 * layout shift 2.0 on the live article (desktop, first visit after a deploy).
 * A guessed 3:2 box made it worse (see optimiseArticleImages).
 *
 * The gate resizes on request, so a 160px copy (a few KB) gives the true
 * proportions. Responses are cached for a week in Next's data cache; the shape
 * of a photograph does not change, and a withdrawn one still fails at the gate
 * when the reader's browser asks for it, where it is hidden.
 *
 * The lasting home for this is Empathy Ledger itself: fill the columns once
 * and pass them in the feed, and every site holds the right space without
 * asking. Until then this asks, per photograph, once a week.
 */

import { canonicalMediaSrc, isEmpathyLedgerMedia } from "./optimised-image";

export interface PhotoShape {
  width: number;
  height: number;
}

const PROBE_WIDTH = 160;
const PROBE_TIMEOUT_MS = 3000;
const WEEK_SECONDS = 60 * 60 * 24 * 7;

/** Width and height from a PNG, JPEG, GIF or WebP header; null for anything else. */
export function imageDimensions(bytes: Uint8Array): PhotoShape | null {
  const b = bytes;
  const u16be = (i: number) => (b[i] << 8) | b[i + 1];
  const u16le = (i: number) => b[i] | (b[i + 1] << 8);
  const u24le = (i: number) => b[i] | (b[i + 1] << 8) | (b[i + 2] << 16);
  const u32be = (i: number) => ((b[i] << 24) >>> 0) + (b[i + 1] << 16) + (b[i + 2] << 8) + b[i + 3];
  const ascii = (i: number, n: number) => String.fromCharCode(...b.subarray(i, i + n));
  const ok = (s: PhotoShape) => (s.width > 0 && s.height > 0 ? s : null);

  if (b.length >= 24 && b[0] === 0x89 && ascii(1, 3) === "PNG") {
    return ok({ width: u32be(16), height: u32be(20) });
  }
  if (b.length >= 10 && ascii(0, 3) === "GIF") {
    return ok({ width: u16le(6), height: u16le(8) });
  }
  if (b.length >= 30 && ascii(0, 4) === "RIFF" && ascii(8, 4) === "WEBP") {
    const chunk = ascii(12, 4);
    if (chunk === "VP8X") return ok({ width: u24le(24) + 1, height: u24le(27) + 1 });
    if (chunk === "VP8 ") return ok({ width: u16le(26) & 0x3fff, height: u16le(28) & 0x3fff });
    if (chunk === "VP8L") {
      const bits = b[21] | (b[22] << 8) | (b[23] << 16) | (b[24] << 24);
      return ok({ width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 });
    }
    return null;
  }
  if (b.length >= 4 && b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i + 9 < b.length) {
      if (b[i] !== 0xff) return null;
      const marker = b[i + 1];
      if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
        i += 2;
        continue;
      }
      // Start-of-frame markers carry the size; C4 (DHT), C8 and CC are not frames.
      if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
        return ok({ width: u16be(i + 7), height: u16be(i + 5) });
      }
      i += 2 + u16be(i + 2);
    }
  }
  return null;
}

/** The shape of one gated photograph, or null when it cannot be known. */
export async function photoShape(src: string): Promise<PhotoShape | null> {
  if (!isEmpathyLedgerMedia(src)) return null;
  const url = new URL(canonicalMediaSrc(src));
  url.searchParams.set("w", String(PROBE_WIDTH));
  try {
    const response = await fetch(url, {
      next: { revalidate: WEEK_SECONDS },
      signal: AbortSignal.timeout(PROBE_TIMEOUT_MS),
    } as RequestInit);
    if (!response.ok) return null;
    return imageDimensions(new Uint8Array(await response.arrayBuffer()));
  } catch {
    return null;
  }
}

/** Shapes for every gated photograph in a piece of HTML, keyed by its src as written. */
export async function photoShapesIn(html: string): Promise<Map<string, PhotoShape>> {
  const sources = new Set<string>();
  for (const match of html.matchAll(/<img\b[^>]*\bsrc=(["'])(.*?)\1/gi)) {
    const src = match[2].replace(/&amp;/g, "&");
    if (isEmpathyLedgerMedia(src)) sources.add(src);
  }
  const entries = await Promise.all([...sources].map(async (src) => [src, await photoShape(src)] as const));
  return new Map(entries.filter((entry): entry is readonly [string, PhotoShape] => entry[1] !== null));
}
