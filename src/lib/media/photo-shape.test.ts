import { describe, expect, it } from "vitest";

import { imageDimensions, photoShape } from "./photo-shape";

const bytes = (...parts: (number[] | string)[]) =>
  new Uint8Array(parts.flatMap((p) => (typeof p === "string" ? [...p].map((c) => c.charCodeAt(0)) : p)));

describe("imageDimensions", () => {
  it("reads a PNG header (what the gate returns for a small copy)", () => {
    const png = bytes([0x89], "PNG", [0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 13], "IHDR", [0, 0, 0, 64, 0, 0, 0, 47, 8, 3]);
    expect(imageDimensions(png)).toEqual({ width: 64, height: 47 });
  });

  it("reads a JPEG frame past an APP0 segment", () => {
    const app0 = [0xff, 0xe0, 0x00, 0x10, ...new Array(14).fill(0)];
    const sof0 = [0xff, 0xc0, 0x00, 0x11, 0x08, 0x01, 0xe0, 0x02, 0x80, 0x03, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    expect(imageDimensions(bytes([0xff, 0xd8], app0, sof0))).toEqual({ width: 640, height: 480 });
  });

  it("does not mistake a Huffman table (C4) for a frame", () => {
    const dht = [0xff, 0xc4, 0x00, 0x05, 0x09, 0x09, 0x09];
    const sof2 = [0xff, 0xc2, 0x00, 0x11, 0x08, 0x00, 0x64, 0x00, 0xc8, 0x03, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    expect(imageDimensions(bytes([0xff, 0xd8], dht, sof2))).toEqual({ width: 200, height: 100 });
  });

  it("reads GIF and extended WebP headers", () => {
    expect(imageDimensions(bytes("GIF89a", [0x2c, 0x01, 0xc8, 0x00]))).toEqual({ width: 300, height: 200 });
    const vp8x = bytes("RIFF", [0, 0, 0, 0], "WEBP", "VP8X", [10, 0, 0, 0, 0, 0, 0, 0], [0x7f, 0x02, 0x00], [0xdf, 0x01, 0x00]);
    expect(imageDimensions(vp8x)).toEqual({ width: 640, height: 480 });
  });

  it("returns null for anything that is not an image, so no size is invented", () => {
    expect(imageDimensions(bytes('{"error":"forbidden"}'))).toBeNull();
    expect(imageDimensions(new Uint8Array())).toBeNull();
  });
});

describe("photoShape", () => {
  it("asks nothing for a photograph that is not behind Empathy Ledger's gate", async () => {
    expect(await photoShape("https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/media/x.jpg")).toBeNull();
    expect(await photoShape("/media/field-stills/a.jpg")).toBeNull();
  });
});
