// Guards for the one content list, so its rules hold in code: everything says what it is part of, every partOf
// points at a field that exists, and no second copy of a list survives somewhere else in the site.
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  FEATURED_WORDS,
  featuredWorks,
  fields,
  fieldsById,
  projects,
  questions,
  questionsBySlug,
  works,
  type FieldId,
} from "./index";

const isField = (id: string): id is FieldId => id in fieldsById;

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

/**
 * Every figure in the content's words: a number that is not a date, a name ("10x10") or part of a path.
 * Keys that hold ids, slugs, dates or paths are not words and are skipped.
 */
const NOT_WORDS = /^(id|slug|code|number|year|aliases|elSlugs|nextSlug|partOf)$/;
const FIGURE = /(?<![\w])\d[\d,]*(?:\.\d+)?%?(?![\w])/g;

function figuresIn(where: string, value: unknown, key = ""): string[] {
  if (NOT_WORDS.test(key)) return [];
  if (typeof value === "string") {
    if (/^(\/|https?:)/.test(value)) return [];
    return [...value.matchAll(FIGURE)]
      .map((m) => m[0].replace(/,$/, ""))
      .filter((n) => !/^(19|20)\d\d$/.test(n))
      .map((n) => `${where} ${key}: ${n}`);
  }
  if (Array.isArray(value)) return value.flatMap((v) => figuresIn(where, v, key));
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([k, v]) => figuresIn(where, v, k));
  }
  return [];
}

/**
 * Figures in the works' own words, from the ACT project record and the wiki, that name no source. They are listed so
 * a new one cannot arrive unnoticed; the checks that refuse a publish stop them rendering until each has a source.
 */
const UNSOURCED_FIGURES = [
  "work contained impact: 2",
  "work picc-on-country-photo-studio description: 501",
  "work picc-photo-kiosk description: 2,491",
  "work picc-photo-kiosk impact: 2,491",
  "work picc-photo-kiosk impact: 32",
  "work redtape impact: 29",
  "work uncle-allan-palm-island-art impact: 17",
  "work uncle-allan-palm-island-art impact: 1",
];

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

describe("the questions", () => {
  for (const q of questions) {
    it(`${q.slug} is part of at least one field, and every one exists`, () => {
      expect(q.partOf.length).toBeGreaterThan(0);
      for (const id of q.partOf) expect(isField(id), id).toBe(true);
    });
    it(`${q.slug} hands on to a question that exists`, () => {
      expect(questionsBySlug[q.nextSlug]).toBeDefined();
    });
  }

  it("have no second copy outside src/content", () => {
    expect(copiesOf(questions.map((q) => q.invitation))).toEqual([]);
  });
});

describe("the works", () => {
  it("are the fourteen pieces from the ACT project record, once each", () => {
    expect(works).toHaveLength(14);
    expect(new Set(works.map((w) => w.slug)).size).toBe(works.length);
  });

  for (const w of works) {
    it(`${w.slug} is a work in Art, and everything it is part of exists`, () => {
      expect(w.partOf.at(-1)).toBe("art");
      for (const id of w.partOf) expect(isField(id), id).toBe(true);
    });
  }

  it("CONTAINED is part of JusticeHub first, and a work in Art", () => {
    expect(works.find((w) => w.slug === "contained")?.partOf).toEqual(["justice", "art"]);
  });

  it("the featured ones are works, in the order they are written", () => {
    expect(featuredWorks.map((w) => w.slug)).toEqual(Object.keys(FEATURED_WORDS));
  });

  it("the featured words have no second copy outside src/content", () => {
    expect(copiesOf(featuredWorks.map((w) => w.featured.fallbackDescription))).toEqual([]);
  });

  it("are read from src/content, not from the snapshot directly", () => {
    const readers = sourceFiles().filter((f) => /art-pieces\.generated\.json['"]/.test(f.text));
    expect(readers.map((f) => f.file)).toEqual([]);
  });
});

describe("figures", () => {
  it("carry a source, or are the known unsourced ones", () => {
    const found = [
      ...fields.flatMap((f) => figuresIn(`field ${f.id}`, f)),
      ...questions.flatMap((q) => figuresIn(`question ${q.slug}`, q)),
      ...works.flatMap((w) => figuresIn(`work ${w.slug}`, w)),
    ];
    expect(
      found,
      "A figure needs its source. Give it one where its words come from, or take it out. " +
        "If one of the known figures is gone, take it off UNSOURCED_FIGURES.",
    ).toEqual(UNSOURCED_FIGURES);
  });
});
