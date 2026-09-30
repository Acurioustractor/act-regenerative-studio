// Guards for how the Art pages choose and shorten what a work says: no unsourced figure reaches the page, every work is
// part of something, the four parts always draw, and a picture from Empathy Ledger comes at the width it is shown.
import { describe, expect, it } from "vitest";
import { brand } from "@/brand/brand";
import { works } from "@/content";
import { getArtProjectConfigBySlug, type HydratedArtProject } from "./art-portfolio";
import {
  hasFigure,
  impactLines,
  inPortfolioOrder,
  partOfChips,
  projectName,
  readYear,
  relatedWorks,
  shorten,
  sized,
  titleSize,
  withoutFigures,
} from "./art-page";
import { BECOME_ORDER, arrangementFor, placeParts } from "./become";

/** A work as the pages get it, with nothing from Empathy Ledger. */
function work(slug: string): HydratedArtProject {
  const config = getArtProjectConfigBySlug(slug);
  if (!config) throw new Error(`No work ${slug}`);
  return { ...config, media: [], heroImage: null, storytellers: [], stories: [], elContent: null };
}

describe("figures", () => {
  it("are told from dates and names with a number in them", () => {
    expect(hasFigure("2,491 self-directed portraits captured.")).toBe(true);
    expect(hasFigure("More than 501 photographs, 12% of them.")).toBe(true);
    expect(hasFigure("The first sittings in September 2025 were held.")).toBe(false);
    expect(hasFigure("Born at the 10x10 Community Capital Leadership Retreat.")).toBe(false);
  });

  it("leave a work's impact without the lines that carry one", () => {
    expect(impactLines(work("picc-photo-kiosk").impact)).toEqual([
      "Community-owned visual archive established.",
      "No external access without community consent.",
    ]);
    expect(impactLines(work("contained").impact)).not.toContain("2 storytellers contributed lived experience.");
    expect(impactLines(null)).toEqual([]);
  });

  it("leave no work's description, philosophy or impact with an unsourced figure", () => {
    for (const w of works) {
      for (const text of [withoutFigures(w.description), withoutFigures(w.philosophy), ...impactLines(w.impact)]) {
        expect(hasFigure(text), `${w.slug}: ${text}`).toBe(false);
      }
    }
  });

  it("keep the rest of a description in its own words", () => {
    const words = withoutFigures(work("picc-on-country-photo-studio").description);
    expect(words).toContain("lit, considered, printed, handed over.");
    expect(words).not.toContain("501");
  });
});

describe("words", () => {
  it("write a year range as Pencil sets it", () => {
    expect(readYear("2022–present")).toBe("2022 to present");
    expect(readYear("2025 to present")).toBe("2025 to present");
    expect(readYear("In development")).toBe("In development");
    expect(readYear(null)).toBe("");
  });

  it("cut a long description at a word, with an ellipsis", () => {
    const long = "word ".repeat(80).trim();
    const cut = shorten(long, 200);
    expect(cut.length).toBeLessThanOrEqual(200);
    expect(cut.endsWith("…")).toBe(true);
    expect(cut.endsWith("word…")).toBe(true);
    expect(shorten("short", 200)).toBe("short");
  });

  it("set the loud title by how long it is", () => {
    expect(titleSize("CONTAINED")).toBe("xl");
    expect(titleSize("The Caravan")).toBe("l");
    expect(titleSize("Confessions to Philanthropy")).toBe("m");
  });
});

describe("pictures", () => {
  it("come from Empathy Ledger at the width they are shown", () => {
    expect(sized("https://www.empathyledger.com/api/media/abc/file", 1200)).toBe(
      "https://www.empathyledger.com/api/media/abc/file?w=1200",
    );
    expect(sized("https://empathyledger.com/api/media/abc/file?v=thumb", 750)).toBe(
      "https://empathyledger.com/api/media/abc/file?v=thumb&w=750",
    );
  });

  it("are left alone when they are ours", () => {
    expect(sized("/media/field-stills/contained-aerial.jpg", 1200)).toBe("/media/field-stills/contained-aerial.jpg");
    expect(sized("https://example.org/a.jpg", 1200)).toBe("https://example.org/a.jpg");
  });
});

describe("what a work is part of", () => {
  it("names the project first, and links to its field", () => {
    expect(partOfChips(work("contained"))).toEqual([{ label: "JusticeHub", href: "/fields/justice" }]);
    expect(projectName(work("contained"))).toBe("JusticeHub");
  });

  it("keeps a home the record names with an address of its own", () => {
    expect(partOfChips(work("picc-photo-kiosk"))).toEqual([{ label: "PICC", href: "https://picc.studio" }]);
    expect(partOfChips(work("confessions-to-philanthropy"))).toEqual([
      { label: "Confessions to Philanthropy", href: "/confessions" },
    ]);
  });

  it("puts every other work in Art, so none stands without one", () => {
    expect(partOfChips(work("redtape"))).toEqual([{ label: "Art", href: "/art" }]);
    for (const w of works) expect(partOfChips(work(w.slug)).length, w.slug).toBeGreaterThan(0);
  });
});

describe("the order", () => {
  it("follows Pencil, and leaves the works it does not place in the record's order", () => {
    const slugs = inPortfolioOrder(works).map((w) => w.slug);
    expect(slugs.slice(0, 3)).toEqual(["redtape", "the-caravan", "picc-photo-kiosk"]);
    expect(new Set(slugs).size).toBe(works.length);
    expect(slugs.at(-1)).toBe(works.filter((w) => !slugs.slice(0, 13).includes(w.slug)).at(-1)?.slug);
  });

  it("leads on from a work to others, never to itself, at most three", () => {
    const all = works.map((w) => work(w.slug));
    const related = relatedWorks(work("contained"), all);
    expect(related).toHaveLength(3);
    expect(related.map((w) => w.slug)).not.toContain("contained");
  });
});

describe("the four parts as a work", () => {
  it("are the arrangement that stands for the work, and none for a work the brand has not drawn", () => {
    expect(arrangementFor("CONTAINED")).toBe("container");
    expect(arrangementFor("Gold.Phone")).toBe("phone");
    expect(arrangementFor("The Caravan")).toBe("caravan");
    expect(arrangementFor("PICC Photo Kiosk")).toBe("camera");
    expect(arrangementFor("Redtape")).toBeNull();
    expect(arrangementFor("PICC On Country Photo Studio")).toBeNull();
    expect(arrangementFor("")).toBeNull();
  });

  it("only ever name an arrangement the brand has", () => {
    for (const w of works) {
      const name = arrangementFor(w.title);
      if (name) expect(name in brand.arrangements, w.slug).toBe(true);
    }
    for (const name of BECOME_ORDER) expect(name in brand.arrangements, name).toBe(true);
  });

  it("draw all four parts, inside the stage, once each, in every arrangement they cycle through", () => {
    for (const name of BECOME_ORDER) {
      const parts = placeParts(name);
      expect(parts.map((p) => p.role).sort(), name).toEqual(["big", "bonnet", "cab", "small"]);
      for (const p of parts) {
        expect(p.left, `${name} ${p.role}`).toBeGreaterThanOrEqual(-0.001);
        expect(p.top, `${name} ${p.role}`).toBeGreaterThanOrEqual(-0.001);
        expect(p.left + p.width, `${name} ${p.role}`).toBeLessThanOrEqual(100.001);
        expect(p.top + p.height, `${name} ${p.role}`).toBeLessThanOrEqual(100.001);
      }
      expect(new Set(parts.map((p) => p.layer)).size, name).toBe(4);
    }
  });
});
