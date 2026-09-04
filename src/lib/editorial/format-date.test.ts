import { describe, expect, it } from "vitest";

import { articleDateTime, formatArticleDate } from "./format-date";

describe("article dates", () => {
  it("prints the Brisbane day in words", () => {
    expect(formatArticleDate("2026-08-14T00:00:00.000Z")).toBe("14 August 2026");
  });

  it("moves a late UTC evening onto the next Brisbane day", () => {
    // 19:21Z is 05:21 the following morning in Brisbane.
    expect(formatArticleDate("2025-10-07T19:21:42.450Z")).toBe("8 October 2025");
    expect(articleDateTime("2025-10-07T19:21:42.450Z")).toBe("2025-10-08");
  });

  it("keeps a Brisbane morning on its own day", () => {
    expect(articleDateTime("2023-03-22T10:25:26.224Z")).toBe("2023-03-22");
  });

  it("renders nothing for a missing or broken date", () => {
    expect(formatArticleDate(null)).toBeNull();
    expect(formatArticleDate(undefined)).toBeNull();
    expect(formatArticleDate("")).toBeNull();
    expect(formatArticleDate("not a date")).toBeNull();
    expect(articleDateTime("not a date")).toBeNull();
  });
});
