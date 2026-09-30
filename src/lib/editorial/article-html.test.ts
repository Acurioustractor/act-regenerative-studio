import { describe, it, expect } from "vitest";
import { captionFigures, htmlContainsMedia, optimiseArticleImages } from "./article-html";

const url = "https://empathyledger.com/api/media/d55aacad-c553-495e-bbe3-32ddcbd355f7/file";
const fig = `<figure><img src="${url}" alt="Aerial view of a forested coastline" loading="lazy" /></figure>`;

describe("captionFigures", () => {
  it("captions a figure from the ledger's title, matched by media id", () => {
    const out = captionFigures(fig, [{ url: `${url}?w=1200`, title: "Palm Island coastline" }]);
    expect(out).toContain("<figcaption>Palm Island coastline</figcaption>");
  });
  it("prefers caption over title over alt, and escapes", () => {
    expect(captionFigures(fig, [{ url, caption: "Bwgcolman <Palm Island>", title: "x" }])).toContain("Bwgcolman &lt;Palm Island&gt;");
    expect(captionFigures(fig, [])).toContain("<figcaption>Aerial view of a forested coastline</figcaption>");
  });
  it("uses the ledger's alt for the asset when the exported img alt is a placeholder", () => {
    const junk = `<figure><img src="${url}" alt="__wf_reserved_inherit" /></figure>`;
    expect(captionFigures(junk, [{ url, alt_text: "Bwgcolman from the water" }])).toContain("<figcaption>Bwgcolman from the water</figcaption>");
  });
  it("leaves a figure that already has a caption, junk alt with no source, and non-figure images alone", () => {
    const captioned = `<figure><img src="${url}" alt="x" /><figcaption>Kept</figcaption></figure>`;
    expect(captionFigures(captioned, [{ url, title: "New" }])).toBe(captioned);
    const junk = `<figure><img src="${url}" alt="IMG_1234.jpg" /></figure>`;
    expect(captionFigures(junk, [])).toBe(junk);
    const bare = `<p><img src="${url}" alt="Bare" /></p>`;
    expect(captionFigures(bare, [{ url, title: "Nope" }])).toBe(bare);
  });
});

describe("htmlContainsMedia", () => {
  it("matches by id or exact url, and not otherwise", () => {
    expect(htmlContainsMedia(fig, `${url}?w=800`)).toBe(true);
    expect(htmlContainsMedia(fig, "https://empathyledger.com/api/media/00000000-0000-0000-0000-000000000000/file")).toBe(false);
  });
});

describe("optimiseArticleImages", () => {
  const exported = `<img src="${url}" loading="lazy" alt="" width="auto" height="auto" id="">`;

  it("sends a gated photograph through the optimiser at the column's width", () => {
    const out = optimiseArticleImages(`<p>Text</p>${exported}`);
    // The optimiser asks the gate for its 2000px copy, never the bucket.
    expect(out).toContain(`src="/_next/image?url=${encodeURIComponent(`${url}?w=2000`)}&amp;w=1200&amp;q=75"`);
    expect(out).toContain('sizes="(max-width: 768px) 100vw, 720px"');
    expect(out).toMatch(/srcset="[^"]*w=640[^"]* 640w, [^"]*w=1920[^"]* 1920w"/);
    // "auto" is not a valid width or height; the CSS holds the space instead.
    expect(out).not.toMatch(/\b(width|height)="auto"/);
    expect(out).toContain('loading="lazy"');
    expect(out).toContain('decoding="async"');
  });

  it("sizes a full-width figure for its breakout, not the column", () => {
    const out = optimiseArticleImages(`<figure class="w-richtext-align-fullwidth w-richtext-figure-type-image">${exported}</figure>`);
    expect(out).toContain('sizes="(max-width: 1148px) calc(100vw - 3rem), 1100px"');
    expect(out.match(/srcset=/g)).toHaveLength(1);
  });

  it("leaves every other host exactly as it arrived", () => {
    // A storage bucket or a third-party host is not the gated route; the
    // optimiser is not asked to fetch it.
    const bucket = '<img src="https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/media/x.jpg" alt="">';
    const other = '<img src="https://cdn.prod.website-files.com/a/b.jpg" alt="">';
    expect(optimiseArticleImages(bucket)).toBe(bucket);
    expect(optimiseArticleImages(other)).toBe(other);
  });

  it("does not touch an image that already carries a srcset", () => {
    const withSrcset = `<img src="${url}" srcset="${url} 800w" alt="">`;
    expect(optimiseArticleImages(withSrcset)).toBe(withSrcset);
  });

  it("keeps a caption match working when run after captionFigures", () => {
    const captioned = captionFigures(fig, [{ url, title: "Palm Island coastline" }]);
    const out = optimiseArticleImages(captioned);
    expect(out).toContain("<figcaption>Palm Island coastline</figcaption>");
    expect(htmlContainsMedia(out, url)).toBe(true);
  });

  it("puts the true proportions on a photograph whose shape is known", () => {
    const shapes = new Map([[url, { width: 4000, height: 3000 }]]);
    const out = optimiseArticleImages(exported, shapes);
    expect(out).toContain('width="1200" height="900"');
    // Unknown shape: no size is guessed.
    expect(optimiseArticleImages(exported)).not.toMatch(/\b(width|height)="\d/);
  });
});

