import { describe, expect, it } from "vitest";
import { getBakedEditorialSnapshot, type EditorialArticle } from "@/lib/empathy-ledger-editorial";
import { GROUP_NAMES, clip, groupsFor, rowFor, streamModel } from "./stories-model";

const { articles } = getBakedEditorialSnapshot();

describe("the stories stream", () => {
  it("counts what the feed returned and nothing else", () => {
    const model = streamModel(articles);
    expect(model.storyCount).toBe(articles.length);
    expect(model.rows).toHaveLength(articles.length);
    // Every project a story is part of, Land counted once, Art not a project.
    const groups = new Set(model.rows.flatMap((row) => row.groups));
    expect(model.projectCount).toBe([...groups].filter((group) => group !== "art").length);
    // One pill for each group a story is in, after All, and no pill that would show nothing.
    expect(model.pills[0]).toEqual({ value: "all", label: "All" });
    expect(model.pills.slice(1).map((pill) => pill.value).sort()).toEqual([...groups].sort());
    for (const pill of model.pills.slice(1)) {
      expect(model.rows.some((row) => row.groups.includes(pill.value as never))).toBe(true);
    }
  });

  it("counts nothing when the feed is empty", () => {
    const model = streamModel([]);
    expect(model.storyCount).toBe(0);
    expect(model.projectCount).toBe(0);
    expect(model.pills).toEqual([{ value: "all", label: "All" }]);
    expect(model.soleAuthor).toBeNull();
  });

  it("names a sole author only while every story has the same one", () => {
    const named = (authorName: string): EditorialArticle => ({ ...articles[0], authorName });
    expect(streamModel([named("A Writer"), named("A Writer")]).soleAuthor).toBe("A Writer");
    expect(streamModel([named("A Writer"), named("Another Writer")]).soleAuthor).toBeNull();
    expect(streamModel([named("A Writer"), named("")]).soleAuthor).toBeNull();
  });

  it("labels each story with the names its fields carry, or Across ACT", () => {
    for (const article of articles) {
      const row = rowFor(article);
      const expected = groupsFor(article).map((group) => GROUP_NAMES[group]).join(" · ") || "Across ACT";
      expect(row.label).toBe(expected);
      expect(row.href).toBe(article.localPath);
    }
  });

  it("gives alt text only in the ledger's own words", () => {
    for (const article of articles) {
      const row = rowFor(article);
      if (!row.photo) continue;
      expect([article.featuredImageAlt ?? "", ""]).toContain(row.photo.alt);
    }
  });

  it("reads a dash as a comma with its space, and cuts a long excerpt at a word", () => {
    const [source] = articles;
    const dashed = rowFor({ ...source, excerpt: "one — two–three" });
    expect(dashed.excerpt).toBe("one, two, three");
    expect(clip("a".repeat(30) + " " + "b".repeat(200), 40)).toBe("a".repeat(30) + "…");
    expect(clip("short", 40)).toBe("short");
  });
});
