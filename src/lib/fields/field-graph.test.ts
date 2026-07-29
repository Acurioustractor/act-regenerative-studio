import { describe, expect, it } from "vitest";

import {
  FIELD_IDS,
  PROJECT_SLUG_TO_FIELD,
  QUESTION_TAG_TO_FIELD,
  articlesForField,
  fieldCoverage,
  fieldsForArticle,
  questionsForField,
  relatedArticles,
  unmappedReferences,
} from "./field-graph";
import { getBakedEditorialSnapshot } from "@/lib/empathy-ledger-editorial";

/**
 * The first test is the one that matters. Everything else here is ordinary
 * behaviour cover; `unmappedReferences` is the guard that stops the graph
 * quietly losing content when the editorial feed adds a project or someone
 * tags a question with a new word.
 */
describe("field graph guard", () => {
  it("maps every project slug and question tag that appears in the data", () => {
    const { slugs, tags, staleAssignments } = unmappedReferences();
    expect(
      { unmappedSlugs: slugs, unmappedTags: tags, staleAssignments },
      "Unmapped slugs/tags go in PROJECT_SLUG_TO_FIELD / QUESTION_TAG_TO_FIELD " +
        "(map to null if they deliberately belong to no field). Stale assignments " +
        "are curated entries in field-assignments.ts pointing at articles the feed " +
        "no longer carries; the article was renamed or withdrawn.",
    ).toEqual({ unmappedSlugs: [], unmappedTags: [], staleAssignments: [] });
  });

  it("only ever resolves to canonical field ids", () => {
    const targets = [
      ...Object.values(PROJECT_SLUG_TO_FIELD),
      ...Object.values(QUESTION_TAG_TO_FIELD),
    ].filter((value) => value !== null);

    for (const target of targets) {
      expect(FIELD_IDS).toContain(target);
    }
  });
});

describe("lookups", () => {
  it("assigns articles to the field their project belongs to", () => {
    const articles = getBakedEditorialSnapshot().articles;
    const justice = articles.find((a) =>
      (a.relatedProjectSlugs ?? []).includes("justicehub"),
    );
    // Guard the fixture itself: if the feed stops carrying justicehub, this
    // test should say so rather than silently pass on an empty search.
    expect(justice, "expected at least one justicehub article in the feed").toBeDefined();
    expect(fieldsForArticle(justice!)).toContain("justice");
  });

  it("does not place land projects in a field of practice", () => {
    expect(PROJECT_SLUG_TO_FIELD["black-cockatoo-valley"]).toBeNull();
    expect(PROJECT_SLUG_TO_FIELD["act-farm"]).toBeNull();
  });

  it("returns questions for a field", () => {
    expect(questionsForField("justice").length).toBeGreaterThan(0);
  });

  it("never returns an article as its own related article", () => {
    for (const article of getBakedEditorialSnapshot().articles.slice(0, 10)) {
      const related = relatedArticles(article);
      expect(related.map((r) => r.slug)).not.toContain(article.slug);
    }
  });

  it("respects the related-article limit", () => {
    for (const article of getBakedEditorialSnapshot().articles.slice(0, 10)) {
      expect(relatedArticles(article, 2).length).toBeLessThanOrEqual(2);
    }
  });

  it("gives the art field content it cannot derive from project slugs", () => {
    // No upstream project maps to art, so without the curated overlay this is
    // zero and the field page is empty.
    expect(articlesForField("art").length).toBeGreaterThan(0);
  });

  it("adds curated fields without removing derived ones", () => {
    const contained = getBakedEditorialSnapshot().articles.find(
      (a) => a.slug === "contained-where-policy-meets-flesh",
    );
    expect(contained).toBeDefined();
    const fields = fieldsForArticle(contained!);
    expect(fields).toContain("art"); // curated
    expect(fields).toContain("justice"); // derived from its project slug
  });

  /**
   * An inverted guard: it asserts the data is still broken.
   *
   * `publishedAt` in the editorial feed is a migration artifact, not an
   * editorial date. 21 of the 29 articles carry one identical timestamp to the
   * millisecond, and createdAt and updatedAt each hold a single value across the
   * whole corpus. FieldWriting renders no date because of it, since printing
   * "10 January 2026" under every headline would state something false.
   *
   * A comment saying so decays: nobody re-checks it, and the day the feed gains
   * real dates, the site quietly goes on hiding them. This fails on that day and
   * says what to do, which is the only way the caveat resolves itself.
   */
  it("still has degenerate publishedAt values, so dates stay hidden", () => {
    const articles = getBakedEditorialSnapshot().articles;
    const distinct = new Set(articles.map((a) => a.publishedAt)).size;
    const ratio = distinct / articles.length;

    expect(
      ratio,
      `publishedAt now has ${distinct} distinct values across ${articles.length} ` +
        "articles, which no longer looks like a migration artifact. The feed may " +
        "be carrying real dates. Re-enable the date in " +
        "src/components/fields/FieldWriting.tsx and delete this test.",
    ).toBeLessThan(0.5);
  });

  it("reports coverage for all five fields", () => {
    const coverage = fieldCoverage();
    expect(coverage).toHaveLength(5);
    expect(coverage.map((c) => c.fieldId).sort()).toEqual(
      [...FIELD_IDS].sort(),
    );
  });

  it("sorts field articles newest first", () => {
    for (const fieldId of FIELD_IDS) {
      const dates = articlesForField(fieldId).map((a) => a.publishedAt ?? "");
      expect([...dates].sort().reverse()).toEqual(dates);
    }
  });
});
