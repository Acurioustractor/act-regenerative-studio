// "Confessions to ___": a series, one sector or system at a time, philanthropy first (Ben, 30 Sep). Only the first
// edition has a name; the others stay empty until Ben names them. The confessions themselves are people's words and
// stay in src/data/confessions-mock.ts, never here.
import type { FieldId } from "./fields";

export type ConfessionsEdition = {
  number: string;
  /** The sector or system this edition confesses to. Null until it is named. */
  to: string | null;
  status: "live" | "unnamed";
  /** The work in Art this edition is, by its slug in src/content/works.ts. */
  work: string | null;
  partOf: FieldId[];
};

export const confessionsEditions: ConfessionsEdition[] = [
  { number: "01", to: "Philanthropy", status: "live", work: "confessions-to-philanthropy", partOf: ["art"] },
  { number: "02", to: null, status: "unnamed", work: null, partOf: ["art"] },
  { number: "03", to: null, status: "unnamed", work: null, partOf: ["art"] },
];
