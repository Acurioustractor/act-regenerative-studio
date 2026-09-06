import { describe, expect, it } from "vitest";
import { describeStatus, normalizeStatus, relativeTime, rowToSiteState } from "./site-state";

describe("site state", () => {
  it("maps table statuses to public wording", () => {
    expect(describeStatus("live").label).toBe("Online");
    expect(describeStatus("broken")).toEqual({ label: "Needs attention", tone: "bad" });
    expect(describeStatus("external").tone).toBe("muted");
  });

  // Control: an unexpected value must never read as Online.
  it("control: unknown or garbage status reads Unknown, not Online", () => {
    expect(normalizeStatus("hacked")).toBe("unknown");
    expect(normalizeStatus(null)).toBe("unknown");
    expect(describeStatus(normalizeStatus("READY")).label).toBe("Unknown");
    expect(rowToSiteState({ slug: "x", name: "X", url: null, project_code: "ACT-XX", status: "nope", last_deployment_at: null, last_check_at: null }).status).toBe("unknown");
  });

  it("relative time is coarse and stable", () => {
    const now = new Date("2026-09-06T06:00:00Z");
    expect(relativeTime("2026-09-06T01:00:00Z", now)).toBe("today");
    expect(relativeTime("2026-09-05T01:00:00Z", now)).toBe("yesterday");
    expect(relativeTime("2026-08-20T01:00:00Z", now)).toBe("17 days ago");
    expect(relativeTime("2026-02-01T04:52:00Z", now)).toBe("7 months ago");
    expect(relativeTime(null, now)).toBeNull();
    expect(relativeTime("not a date", now)).toBeNull();
  });
});
