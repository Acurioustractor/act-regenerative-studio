import { describe, it, expect } from "vitest";
import { captionFigures, htmlContainsMedia } from "./article-html";

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
