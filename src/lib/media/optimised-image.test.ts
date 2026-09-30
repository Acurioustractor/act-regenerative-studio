import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";

import {
  OPTIMISABLE_HOSTS,
  canonicalMediaSrc,
  OPTIMISER_WIDTHS,
  isEmpathyLedgerMedia,
  isOptimisable,
  optimisedImageUrl,
  optimisedSrcSet,
} from "./optimised-image";

const require = createRequire(import.meta.url);
const nextConfig = require("../../../next.config.js") as {
  images?: { remotePatterns?: { hostname: string }[]; deviceSizes?: number[]; imageSizes?: number[] };
};

// Next's defaults when next.config.js sets neither list.
const DEFAULT_DEVICE_SIZES = [640, 750, 828, 1080, 1200, 1920, 2048, 3840];

const GATED = "https://empathyledger.com/api/media/8c9860bb-4a0b-4706-8516-a6903dc81968/file";

describe("optimised-image", () => {
  it("knows exactly the hosts next.config.js lets the optimiser fetch", () => {
    // next/image throws on any other host, so a drift here is a page crash.
    const configured = (nextConfig.images?.remotePatterns || []).map((p) => p.hostname).sort();
    expect([...OPTIMISABLE_HOSTS].sort()).toEqual(configured);
  });

  it("asks only for widths the optimiser accepts", () => {
    const accepted = [
      ...(nextConfig.images?.deviceSizes || DEFAULT_DEVICE_SIZES),
      ...(nextConfig.images?.imageSizes || []),
    ];
    for (const width of OPTIMISER_WIDTHS) expect(accepted).toContain(width);
  });

  it("recognises Empathy Ledger's gated media route and nothing else", () => {
    expect(isEmpathyLedgerMedia(GATED)).toBe(true);
    expect(isEmpathyLedgerMedia(GATED.replace("https://", "https://www."))).toBe(true);
    expect(isEmpathyLedgerMedia(`${GATED}?v=thumb`)).toBe(true);
    // A storage bucket skips the gate: never treated as the gated route.
    expect(
      isEmpathyLedgerMedia(
        "https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/media/photos/x.jpeg",
      ),
    ).toBe(false);
    expect(isEmpathyLedgerMedia("https://empathyledger.com.evil.test/api/media/8c9860bb-4a0b-4706-8516-a6903dc81968/file")).toBe(false);
    expect(isEmpathyLedgerMedia(null)).toBe(false);
  });

  it("says a photograph is optimisable only when next/image would accept it", () => {
    expect(isOptimisable(GATED)).toBe(true);
    expect(isOptimisable("/media/field-stills/harvest-witta-aerial.jpg")).toBe(true);
    expect(isOptimisable("//cdn.example.com/x.jpg")).toBe(false);
    expect(isOptimisable("https://i.ytimg.com/vi/x/hqdefault.jpg")).toBe(false);
    expect(isOptimisable("http://empathyledger.com/api/media/x/file")).toBe(false);
    expect(isOptimisable("not a url")).toBe(false);
  });

  it("builds optimiser addresses that keep the gated source intact", () => {
    const url = optimisedImageUrl(GATED, 1200);
    expect(url).toBe(`/_next/image?url=${encodeURIComponent(GATED)}&w=1200&q=75`);
    expect(decodeURIComponent(new URL(url, "https://x.test").searchParams.get("url")!)).toBe(GATED);
    expect(optimisedSrcSet(GATED).split(", ")).toHaveLength(OPTIMISER_WIDTHS.length);
  });

  it("asks the gate itself for a 2000px copy at the apex, and touches nothing else", () => {
    const sized = `${GATED}?w=2000`;
    expect(canonicalMediaSrc(GATED)).toBe(sized);
    expect(canonicalMediaSrc(GATED.replace("https://", "https://www."))).toBe(sized);
    // Still the gated route: the resize happens behind the consent check.
    expect(isEmpathyLedgerMedia(canonicalMediaSrc(GATED))).toBe(true);
    expect(canonicalMediaSrc(`${GATED}?w=640`)).toBe(`${GATED}?w=640`);
    expect(canonicalMediaSrc(`${GATED}?v=thumb`)).toBe(`${GATED}?v=thumb`);
    expect(canonicalMediaSrc("https://www.example.com/x.jpg")).toBe("https://www.example.com/x.jpg");
    expect(canonicalMediaSrc("/media/field-stills/a.jpg")).toBe("/media/field-stills/a.jpg");
  });
});
