// Guards for the brand's own rules, so they hold in code rather than in anyone's memory.
// Four parts, one rust: "If it needs a fifth part, it belongs to someone else." The CSS never drifts from brand.json,
// and the video kit (~/.claude/skills/video-cut/brands/act/sync.py) finds every key it reads.
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { brand, arrangement } from "./brand";
import { render, TOKENS_CSS } from "../../scripts/brand-css.mjs";

const ROLES = ["big", "bonnet", "cab", "small"];

describe("the four parts", () => {
  for (const [name, a] of Object.entries(brand.arrangements)) {
    it(`${name} is exactly the four parts, one of each`, () => {
      expect(a.parts.map((p) => p.role).sort()).toEqual(ROLES);
    });
    it(`${name} has exactly one rust part`, () => {
      expect(a.parts.filter((p) => p.colour === "accent")).toHaveLength(1);
    });
    it(`${name} says what it stands for`, () => {
      expect(a.stands_for.trim().length).toBeGreaterThan(0);
    });
  }

  it("the tractor arrangement is the tractor in brand.parts", () => {
    for (const piece of arrangement("tractor").parts) {
      const [x, y, w, h] = brand.parts[piece.role as keyof typeof brand.parts] as number[];
      expect([piece.x, piece.y, piece.w, piece.h]).toEqual([x, y, w, h]);
    }
    const rust = arrangement("tractor").parts.find((p) => p.colour === "accent");
    expect(rust?.role).toBe(brand.parts.rust);
  });

  it("the four doors use the four parts once each, in the order of the method", () => {
    const parts = brand.doors.filter((d) => d.part).map((d) => d.part);
    expect(parts).toEqual(["big", "small", "cab", "bonnet"]);
    expect(parts.map((p) => brand.partMeanings[p!])).toEqual(["Listen", "Curiosity", "Action", "Art"]);
  });
});

describe("tokens", () => {
  it("tokens.css is exactly what brand.json generates (run npm run brand:css)", () => {
    expect(readFileSync(TOKENS_CSS, "utf8")).toBe(render(brand));
  });

  it("both surfaces define the same variables", () => {
    expect(Object.keys(brand.surfaces.ink).sort()).toEqual(Object.keys(brand.surfaces.paper).sort());
  });
});

describe("the video kit can read this file", () => {
  it("has every key sync.py asserts", () => {
    for (const k of ["colors", "fonts", "parts", "record", "unknown"]) expect(brand).toHaveProperty(k);
    for (const k of ["paper", "ink", "rust"]) expect(brand.colors).toHaveProperty(k);
    for (const k of ["display", "mono", "loud"]) expect(brand.fonts).toHaveProperty(k);
    expect(brand.record).toHaveLength(4);
    expect(brand.unknown).toHaveLength(4);
  });
});

// Rust is too faint as small text: 4.05:1 on paper, 3.67:1 on shaded paper, 4.06:1 on ink, under the 4.5:1 small text
// needs. So small labels and links are ink, and rust stays on the parts, the wheels, large type (24px and up, which
// needs only 3:1) and what you point at (Ben, 1 Oct 2026). This reads every style file the Brand v1 site uses.
describe("rust is never small text", () => {
  const styleFiles = (dir: string): string[] =>
    readdirSync(dir).flatMap((name) => {
      const full = path.join(dir, name);
      if (statSync(full).isDirectory()) return /\/(prototypes|admin)$/.test(full) ? [] : styleFiles(full);
      return name.endsWith(".module.css") ? [full] : [];
    });

  it("colours no small resting text rust", () => {
    const offenders: string[] = [];
    for (const file of [...styleFiles("src/components/pieces"), ...styleFiles("src/app")]) {
      const css = readFileSync(file, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
      for (const [, selector, body] of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
        if (!/(?<![-\w])color:\s*var\(--accent\)/.test(body)) continue;
        const pointedAt = /:hover|:focus|\.part\b|\.menuPart|::marker/.test(selector);
        const size = Number(/font-size:\s*(\d+(?:\.\d+)?)px/.exec(body)?.[1] ?? 0);
        const isWheel = file.endsWith("photo.module.css");
        if (!pointedAt && !isWheel && size < 24) offenders.push(`${file}: ${selector.trim().replace(/\s+/g, " ")}`);
      }
    }
    expect(offenders).toEqual([]);
  });
});
