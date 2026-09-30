// A Curious Tractor, Brand v1. Typed access to src/brand/brand.json, the one home for the brand in code.
// The site, the video kit and print read that file; change it there, then run `npm run brand:css`.
import raw from "./brand.json";

export type PartRole = "big" | "small" | "cab" | "bonnet";
export type PartColour = "ink" | "accent" | "paper";

export interface Piece {
  role: string;
  shape: "rect" | "round";
  x: number;
  y: number;
  w: number;
  h: number;
  colour: PartColour;
  rotate?: number;
}

export interface Arrangement {
  stands_for: string;
  parts: Piece[];
}

export interface Door {
  label: string;
  part: PartRole | null;
}

export interface Brand {
  name: string;
  site: string;
  place: string;
  oneLine: string;
  line: string;
  colors: { paper: string; ink: string; rust: string; paperShade: string; paperMuted: string; inkMuted: string; inkLine: string };
  accent: "rust";
  surfaces: Record<"paper" | "ink", Record<"bg" | "fg" | "fg-muted" | "line" | "bg-shade", string>>;
  fonts: { display: string; mono: string; loud: string };
  weights: { statement: number; reading: number; label: number };
  sizes: Record<string, number>;
  space: number[];
  radius: number;
  parts: Record<PartRole, number[]> & { rust: PartRole };
  partMeanings: Record<PartRole, string>;
  doors: Door[];
  arrangements: Record<string, Arrangement>;
  scenes: Record<string, unknown>;
  rule: string;
  motion: Record<string, unknown>;
  record: string[];
  unknown: string[];
}

export const brand = raw as Brand;

/** One of the four-part arrangements (tractor, bed, container, table, ...). Throws on an unknown name. */
export function arrangement(name: string): Arrangement {
  const found = brand.arrangements[name];
  if (!found) throw new Error(`No arrangement named "${name}"`);
  return found;
}

/** The colour a piece is drawn in. "accent" is the one rust part. */
export function colourOf(colour: PartColour): string {
  return colour === "accent" ? brand.colors[brand.accent] : brand.colors[colour];
}
