/**
 * Where a photograph's important part sits, from Empathy Ledger (focal_x and focal_y, 0 to 1 across and down,
 * chosen by a person on the photograph's page there). A site that crops a photograph to fill a box, a hero or a
 * card, crops around it; without one it crops from the centre, which on 30 Sep 2026 cut two men out of an article
 * hero on a phone.
 */
export type FocalPoint = { x: number; y: number };

/** A focal point from the feed, or null for anything that is not two numbers from 0 to 1. */
export function readFocal(value: unknown): FocalPoint | null {
  if (!value || typeof value !== "object") return null;
  const { x, y } = value as Record<string, unknown>;
  const inFrame = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v) && v >= 0 && v <= 1;
  return inFrame(x) && inFrame(y) ? { x, y } : null;
}

/** The CSS object-position that keeps the focal point in frame, or undefined to crop from the centre. */
export function objectPosition(focal: FocalPoint | null | undefined): string | undefined {
  if (!focal) return undefined;
  const pct = (v: number) => `${Math.round(v * 1000) / 10}%`;
  return `${pct(focal.x)} ${pct(focal.y)}`;
}
