// The four parts becoming the thing a work is (act-play.html, d-become; Pencil "The parts, as CONTAINED", azPSA).
// The arrangements live in src/brand/brand.json. This file only chooses one for a work and works out where each of
// the four parts sits in the stage, so it imports nothing but the brand and can ship to the browser.
import { arrangement, brand, type PartColour } from "@/brand/brand";

/** The order the parts cycle through when you tap the drawing: the eight things act-play.html shows them become. */
export const BECOME_ORDER: string[] = [
  "tractor",
  "bed",
  "container",
  "table",
  "page and voice",
  "caravan",
  "phone",
  "camera",
].filter((name) => name in brand.arrangements);

/**
 * What the parts are called once they have become each thing, in ACT's own words: the ones act-play.html sets under
 * "Tap to change what they make", and Pencil's "A container, door open." for CONTAINED.
 */
export const BECOMES: Record<string, string> = {
  tractor: "A tractor",
  bed: "A bed",
  container: "A container, door open",
  table: "A table in the sun",
  "page and voice": "A page and a voice",
  caravan: "A caravan",
  phone: "A phone",
  camera: "A camera",
};

/** What an arrangement stands for, straight from brand.json ("CONTAINED, within JusticeHub"). */
export function standsFor(name: string): string {
  return arrangement(name).stands_for;
}

/**
 * The arrangement a work is, when brand.json has one: the one that stands for it by name (CONTAINED is the container,
 * Gold.Phone the phone). The tractor and the scattered parts stand for ACT itself, so no work is those. Null when the
 * brand has not made this work out of the parts yet.
 */
export function arrangementFor(title: string): string | null {
  const wanted = title.trim().toLowerCase();
  if (!wanted) return null;
  const found = Object.entries(brand.arrangements).find(
    ([name, a]) => name !== "tractor" && name !== "scattered" && a.stands_for.toLowerCase().includes(wanted),
  );
  return found ? found[0] : null;
}

export type Placed = {
  role: string;
  shape: "rect" | "round";
  /** Every length as a percentage of the stage, so the drawing scales with the box it sits in. */
  left: number;
  top: number;
  width: number;
  height: number;
  colour: PartColour;
  /** Degrees, turned about the part's top-left corner as Pencil turns it (counter-clockwise). */
  rotate: number;
  /** Where it sits in the drawing's stack: a later part is drawn over an earlier one, as in <Parts>. */
  layer: number;
};

/** The stage Pencil draws it in: 620 by 340. */
export const STAGE = { width: 620, height: 340 };

/**
 * One arrangement fitted into the stage and centred, as parts.js fits it: the largest scale at which all four parts
 * fit. The parts come back in a fixed order (big, small, cab, bonnet) whatever the arrangement, so each part is the same
 * element from one arrangement to the next and can move between them.
 */
export function placeParts(name: string): Placed[] {
  const pieces = arrangement(name).parts;
  const minX = Math.min(...pieces.map((p) => p.x));
  const minY = Math.min(...pieces.map((p) => p.y));
  const maxX = Math.max(...pieces.map((p) => p.x + p.w));
  const maxY = Math.max(...pieces.map((p) => p.y + p.h));
  const k = Math.min(STAGE.width / (maxX - minX), STAGE.height / (maxY - minY));
  const ox = (STAGE.width - (maxX - minX) * k) / 2 - minX * k;
  const oy = (STAGE.height - (maxY - minY) * k) / 2 - minY * k;

  return ["big", "small", "cab", "bonnet"].map((role) => {
    const layer = pieces.findIndex((piece) => piece.role === role);
    const p = pieces[layer];
    if (!p) throw new Error(`Arrangement "${name}" has no ${role} part`);
    return {
      role,
      shape: p.shape,
      left: ((ox + p.x * k) / STAGE.width) * 100,
      top: ((oy + p.y * k) / STAGE.height) * 100,
      width: ((p.w * k) / STAGE.width) * 100,
      height: ((p.h * k) / STAGE.height) * 100,
      colour: p.colour,
      rotate: p.rotate ? -p.rotate : 0,
      layer,
    };
  });
}
