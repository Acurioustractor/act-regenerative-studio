import { describe, expect, it } from "vitest";
import withdrawn from "../../../../config/withdrawn-editorial.json";
import { getBakedEditorialSnapshot } from "@/lib/empathy-ledger-editorial";
import { isReturnedSlug, isWithdrawnSlug } from "./withdrawn";

describe("the story returned page", () => {
  it("says a story went back to its owner only for a withdrawn story whose owner took it back", () => {
    // None has, as recorded in Empathy Ledger on 30 Sep 2026: every withdrawn slug answers 404.
    for (const slug of withdrawn.slugs) expect(isReturnedSlug(slug), slug).toBe(false);
    expect(isReturnedSlug("what-the-road-corrects")).toBe(false);
  });

  it("knows every slug in the withdrawal tombstone, and nothing else", () => {
    expect(withdrawn.slugs.length).toBeGreaterThan(0);
    for (const slug of withdrawn.slugs) expect(isWithdrawnSlug(slug), slug).toBe(true);
    expect(isWithdrawnSlug("what-the-road-corrects")).toBe(false);
    expect(isWithdrawnSlug("")).toBe(false);
  });

  it("never meets a slug the feed still serves (the consent gate has already removed them)", () => {
    const served = new Set(getBakedEditorialSnapshot().articles.map((article) => article.slug));
    for (const slug of withdrawn.slugs) expect(served.has(slug), slug).toBe(false);
  });
});
