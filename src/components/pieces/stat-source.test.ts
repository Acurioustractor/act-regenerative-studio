// The Stat tile's rule, held in code: a figure carries a source or does not render.
import { describe, expect, it } from "vitest";
import { canShowStat } from "./stat-source";

describe("canShowStat", () => {
  it("allows a figure with a named source, with or without a link", () => {
    expect(canShowStat("12", { name: "The named source" })).toBe(true);
    expect(canShowStat("12", { name: "The named source", href: "https://example.org/s" })).toBe(true);
  });

  it("refuses a figure with no source, whatever arrives at runtime", () => {
    for (const source of [undefined, null, {}, { name: "" }, { name: "   " }, { name: 3 }, "a string", []]) {
      expect(canShowStat("12", source), JSON.stringify(source)).toBe(false);
    }
  });

  it("refuses a source with no figure", () => {
    for (const figure of ["", "  ", undefined, null, 12]) {
      expect(canShowStat(figure, { name: "The named source" }), String(figure)).toBe(false);
    }
  });
});
