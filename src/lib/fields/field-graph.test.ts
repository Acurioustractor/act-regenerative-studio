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
import { getEditorialSnapshot } from "@/lib/empathy-ledger-editorial";

/**
 * The first test is the one that matters. Everything else here is ordinary
 * behaviour cover; `unmappedReferences` is the guard that stops the graph
 * quietly losing content when the editorial feed adds a project or someone
 * tags a question with a new word.
 */
describe("field graph guard", () => {
  it("maps every project slug and question tag that appears in the data", () => {
    const { slugs, tags } = unmappedReferences();
    expect(
      { unmappedSlugs: slugs, unmappedTags: tags },
      "Add these to PROJECT_SLUG_TO_FIELD / QUESTION_TAG_TO_FIELD in field-graph.ts. " +
        "Map to null if they deliberately belong to no field.",
    ).toEqual({ unmappedSlugs: [], unmappedTags: [] });
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
    const articles = getEditorialSnapshot().articles;
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
    for (const article of getEditorialSnapshot().articles.slice(0, 10)) {
      const related = relatedArticles(article);
      expect(related.map((r) => r.slug)).not.toContain(article.slug);
    }
  });

  it("respects the related-article limit", () => {
    for (const article of getEditorialSnapshot().articles.slice(0, 10)) {
      expect(relatedArticles(article, 2).length).toBeLessThanOrEqual(2);
    }
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
