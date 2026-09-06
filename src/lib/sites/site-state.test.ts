import { describe, expect, it } from "vitest";
import { describeStatus, normalizeStatus, relativeTime, rowToSiteState, storyState } from "./site-state";

describe("site state", () => {
  it("maps table statuses to public wording", () => {
    expect(describeStatus("live").label).toBe("Online");
    expect(describeStatus("broken")).toEqual({ label: "Needs attention", tone: "bad" });
    expect(describeStatus("external").tone).toBe("muted");
    expect(describeStatus("archived")).toEqual({ label: "Retired", tone: "muted" });
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

describe("story state", () => {
  it("consented but never pulled is the warning; pulled is good; none is muted", () => {
    expect(storyState({ elSiteSlug: "theharvest", storiesConsented: 3, storiesLastPullAt: null })).toEqual({ label: "3 consented, never pulled", tone: "warn" });
    expect(storyState({ elSiteSlug: "justicehub", storiesConsented: 47, storiesLastPullAt: "2026-09-06T00:00:00Z" }).tone).toBe("good");
    expect(storyState({ elSiteSlug: "campfire", storiesConsented: 0, storiesLastPullAt: null })).toEqual({ label: "Nothing consented yet", tone: "muted" });
    expect(storyState({ elSiteSlug: null, storiesConsented: null, storiesLastPullAt: null }).label).toBe("No story feed");
  });
  // control: rows from before the migration (columns absent) must read as no feed, not as a warning
  it("control: missing columns map to nulls and read as no feed", () => {
    const s = rowToSiteState({ slug: "x", name: "X", url: null, project_code: "ACT-XX", status: "live", last_deployment_at: null, last_check_at: null });
    expect(s.elSiteSlug).toBeNull();
    expect(storyState(s).tone).toBe("muted");
  });
});
