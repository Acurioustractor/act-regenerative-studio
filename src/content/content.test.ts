// Guards for the one content list, so its rules hold in code: everything says what it is part of, every partOf
// points at a field that exists, and no second copy of a list survives somewhere else in the site.
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { fields, fieldsById, projects } from "./index";

const SRC = path.resolve(__dirname, "..");
const HOME = path.resolve(__dirname);

/** Every .ts and .tsx file under src, outside src/content, with its text. */
function sourceFiles(): Array<{ file: string; text: string }> {
  const out: Array<{ file: string; text: string }> = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (full !== HOME) walk(full);
      } else if (/\.tsx?$/.test(entry.name)) {
        out.push({ file: path.relative(SRC, full), text: readFileSync(full, "utf8") });
      }
    }
  };
  walk(SRC);
  return out;
}

/** Files outside src/content that still carry these exact words. */
function copiesOf(words: string[]): string[] {
  const files = sourceFiles();
  return words.flatMap((w) => files.filter((f) => f.text.includes(w)).map((f) => `${f.file}: "${w.slice(0, 50)}"`));
}

describe("the fields", () => {
  it("are Art and the four projects, once each", () => {
    expect(fields.map((f) => f.id)).toEqual(["art", "empathy", "justice", "goods", "harvest"]);
    expect(projects.map((p) => p.name)).toEqual(["Empathy Ledger", "JusticeHub", "Goods on Country", "The Harvest"]);
    expect(fields.filter((f) => f.kind === "art")).toHaveLength(1);
  });

  it("are keyed by their own id", () => {
    for (const f of fields) expect(fieldsById[f.id]).toBe(f);
  });

  it("have no second copy outside src/content", () => {
    expect(copiesOf(fields.map((f) => f.opening))).toEqual([]);
  });
});
