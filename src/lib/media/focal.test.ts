import { describe, expect, it } from "vitest";

import { objectPosition, readFocal } from "./focal";

describe("focal point", () => {
  it("turns Empathy Ledger's focal point into a crop position", () => {
    expect(objectPosition({ x: 0.3, y: 0.25 })).toBe("30% 25%");
    expect(objectPosition({ x: 0.333, y: 1 })).toBe("33.3% 100%");
  });

  it("crops from the centre when nobody chose one, or the value is not a point", () => {
    expect(objectPosition(null)).toBeUndefined();
    expect(readFocal(null)).toBeNull();
    expect(readFocal({ x: 1.2, y: 0.5 })).toBeNull();
    expect(readFocal({ x: "0.3", y: 0.5 })).toBeNull();
    expect(readFocal({ x: 0.3, y: 0.5 })).toEqual({ x: 0.3, y: 0.5 });
  });
});
