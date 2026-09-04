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
   * The inverse of a guard that lived here until 2026-09-05.
   *
   * For eight months `publishedAt` in the editorial feed was a migration
   * artifact: 21 of 29 articles shared one timestamp to the millisecond, and
   * the site hid every date rather than print "10 January 2026" under headlines
   * written in 2023. A test here asserted the data was still broken, so the day
   * it improved would announce itself instead of leaving the dates quietly
   * hidden. That day was 2026-09-05, when the real publish dates were written
   * back into Empathy Ledger from the import metadata
   * (docs/integrations/empathy-ledger/backfill-article-fields-2026-09-05.sql).
   *
   * So this now guards the other direction. If the feed ever collapses back to
   * a handful of shared timestamps, the dates FieldWriting and the article page
   * print become false again, and this says so before a deploy does.
   */
  it("carries real publish dates, so dates render", () => {
    const articles = getBakedEditorialSnapshot().articles;
    const distinct = new Set(articles.map((a) => a.publishedAt)).size;
    const ratio = distinct / articles.length;

    expect(
      ratio,
      `publishedAt has only ${distinct} distinct values across ${articles.length} ` +
        "articles, which looks like import timestamps again. Check the feed, and if " +
        "it has regressed, hide the date in src/components/fields/FieldWriting.tsx " +
        "and src/app/stories/[slug]/editorial-article.tsx until it is fixed.",
    ).toBeGreaterThanOrEqual(0.5);
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
