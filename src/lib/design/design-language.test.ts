import { describe, expect, it } from "vitest";
import { languageForPath } from "./design-language";

describe("design language by route", () => {
  it("longest prefix wins and the home route is exact", () => {
    expect(languageForPath("/")).toBe("documentary");
    expect(languageForPath("/art")).toBe("editorial");
    expect(languageForPath("/art/contained")).toBe("editorial");
    expect(languageForPath("/fields/justice")).toBe("documentary");
    expect(languageForPath("/stories/some-story/")).toBe("documentary");
  });
  // control: an unknown route must not be read as documentary by accident
  it("control: unlisted routes are editorial, and /artists is not /art", () => {
    expect(languageForPath("/something-new")).toBe("editorial");
    expect(languageForPath("/artists")).toBe("editorial");
  });
});
