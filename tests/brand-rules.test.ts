import { chromium } from "playwright";
import { beforeAll, describe, expect, it } from "vitest";
import withdrawn from "../config/withdrawn-editorial.json";

/**
 * Brand v1's rules, checked against the running site: the checks that refuse a publish.
 *
 *   1. Everything is part of something.
 *   2. No dead ends, and no dead links in four ways on.
 *   3. A figure needs its source.
 *   4. Consent is read, never assumed.
 *   5. The footer is on every address.
 *
 * Like api-contract.test.ts it runs against a server, because what is under test is what a reader receives: every
 * address in the sitemap, a 404, and the withdrawn stories. CI builds and starts one before `npm test`.
 *
 *   npm run build && npx next start -p 3001      # terminal 1
 *   npx vitest run tests/brand-rules.test.ts     # terminal 2 (TEST_BASE_URL to point elsewhere)
 *
 * The pieces carry plain data attributes for these checks: data-brand-page (Page), data-site-footer (Footer),
 * data-four-ways-on, data-way and data-way-closing (FourWaysOn), data-part-of (PartOf), data-figure and data-source
 * (StatTile).
 */

const baseUrl = (process.env.TEST_BASE_URL || "http://localhost:3001").replace(/\/$/, "");

/** Words from the Acknowledgement of Country, in every footer the site has. */
const ACKNOWLEDGEMENT = "Traditional Custodians of the land on which we work and live";

/**
 * Photographs reach the site through Empathy Ledger's gate (empathyledger.com/api/media/<id>/file); a public storage
 * link to Empathy Ledger's own projects skips consent. The current project and the retired one. ACT's shared project
 * (tednluwflfhxyucgwigh) serves ACT's own media and is not Empathy Ledger's.
 */
const UNGATED_PHOTO = /(yvnuayzslukamizrlhwb|uaxhjzqrdotoahjnxmbj)\.supabase\.co\/storage\/v1\/object\/public/;
const UNGATED_ENCODED = /(yvnuayzslukamizrlhwb|uaxhjzqrdotoahjnxmbj)\.supabase\.co%2Fstorage%2Fv1%2Fobject%2Fpublic/i;

/**
 * The addresses rebuilt on Brand v1 (pages.json in the act-global-infrastructure handoff). Rules 1 to 3 read a page's
 * Brand v1 marks, so a page that drops the Page piece would fall out of them silently; this list makes it fail by
 * name instead. The 404 is checked too.
 */
const BRAND_V1 = [
  /^\/$/,
  /^\/(about|contact|work|art|harvest|stories|questions|confessions|privacy|terms)$/,
  /^\/fields\/(empathy|justice|goods)$/,
  /^\/(art|stories|questions)\/[^/]+$/,
  /^\/confessions\/philanthropy(\/(listen|friday))?$/,
];

/** Addresses under a Brand v1 route that are deliberately not on it yet, each with its reason. */
const NOT_ON_BRAND_V1_YET: Record<string, string> = {
  "/stories/utopia-may-2026": "a story packet, held noindex until its four figures have a named source",
};

/** A page that is one thing inside something else says what it is part of. */
const BELONGS = /^\/(stories|questions|art)\/[^/]+$/;

/**
 * Stories the field graph places in no field yet: no related project it maps and no curated assignment. Each needs a
 * field, set in Empathy Ledger (its related projects) or in src/data/field-assignments.ts, and that is Ben's call.
 * Listed so a new one cannot arrive unnoticed; take a story off when it gains a field.
 */
const IN_NO_FIELD_YET: string[] = [];

/** `html` is the markup a reader gets, without the script payloads (React's page data repeats every attribute). */
type Fetched = { path: string; status: number; html: string; raw: string };
type Anchor = { href: string; way?: string; closing: boolean };

const decode = (s: string) => s.replace(/&amp;/g, "&").replace(/&#x27;/g, "'").replace(/&quot;/g, '"');

async function fetchPage(path: string): Promise<Fetched> {
  const res = await fetch(baseUrl + path, { redirect: "follow" });
  const raw = await res.text();
  return { path, status: res.status, raw, html: raw.replace(/<script\b[\s\S]*?<\/script>/g, "") };
}

async function inBatches<T, R>(items: T[], size: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const out: R[] = [];
  for (let i = 0; i < items.length; i += size) out.push(...(await Promise.all(items.slice(i, i + size).map(fn))));
  return out;
}

/** Every anchor, with the way it stands for in four ways on, if any. The closing line is a div around one link. */
function anchors(html: string): Anchor[] {
  const closingAt = html.indexOf("data-way-closing");
  const closingEnd = closingAt >= 0 ? html.indexOf("</div>", closingAt) : -1;
  return [...html.matchAll(/<a\b([^>]*)>/g)].flatMap((m) => {
    const href = /\bhref="([^"]*)"/.exec(m[1])?.[1];
    if (href === undefined) return [];
    const way = /\bdata-way="([^"]*)"/.exec(m[1])?.[1];
    const at = m.index ?? 0;
    return [{ href: decode(href), way, closing: closingAt >= 0 && at > closingAt && at < closingEnd }];
  });
}

const isBrand = (html: string) => html.includes("data-brand-page");
const count = (html: string, needle: string) => html.split(needle).length - 1;

let pages: Fetched[] = [];
let notFound: Fetched;

beforeAll(async () => {
  const sitemap = await (await fetch(`${baseUrl}/sitemap.xml`)).text();
  const paths = [...new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname))];
  pages = await inBatches(paths, 6, fetchPage);
  notFound = await fetchPage("/this-address-does-not-exist");
}, 300_000);

describe("the site answers", () => {
  it("serves every address in its own sitemap", () => {
    expect(pages.length).toBeGreaterThan(20);
    expect(pages.filter((p) => p.status !== 200).map((p) => `${p.path} ${p.status}`)).toEqual([]);
  });
});

describe("every Brand v1 page is on Brand v1", () => {
  it("carries the Brand v1 marks on every address rebuilt on it, the 404 included", () => {
    const fallen = [...pages, notFound]
      .filter((p) => p === notFound || BRAND_V1.some((re) => re.test(p.path)))
      .filter((p) => !(p.path in NOT_ON_BRAND_V1_YET))
      .filter((p) => !isBrand(p.html))
      .map((p) => p.path);
    expect(fallen, "rebuilt on Brand v1 but not drawn with the Page piece").toEqual([]);
  });
});

describe("5. the footer is on every address", () => {
  it("carries the Acknowledgement of Country, Privacy and Terms everywhere, the 404 included", () => {
    const missing = [...pages, notFound].flatMap((p) => {
      const gaps = [
        !p.html.includes(ACKNOWLEDGEMENT) && "acknowledgement",
        !p.html.includes('href="/privacy"') && "privacy",
        !p.html.includes('href="/terms"') && "terms",
        isBrand(p.html) && !p.html.includes("data-site-footer") && "Brand v1 footer",
      ].filter(Boolean);
      return gaps.length ? [`${p.path}: ${gaps.join(", ")}`] : [];
    });
    expect(missing).toEqual([]);
  });
});

describe("2. no dead ends", () => {
  it("ends every Brand v1 page with four ways on: a story, a question, the work, the art, and a way to write", () => {
    const wrong = [...pages, notFound].filter((p) => isBrand(p.html)).flatMap((p) => {
      const ways = anchors(p.html).filter((a) => a.way).map((a) => a.way);
      const closing = anchors(p.html).filter((a) => a.closing);
      const ok =
        count(p.html, "data-four-ways-on") === 1 &&
        JSON.stringify(ways) === JSON.stringify(["listen", "curiosity", "action", "art"]) &&
        closing.length === 1;
      return ok ? [] : [`${p.path}: ways ${JSON.stringify(ways)}, closing ${closing.length}`];
    });
    expect(wrong).toEqual([]);
  });

  it("has no dead link on any Brand v1 page, four ways on included", async () => {
    const brand = [...pages, notFound].filter((p) => isBrand(p.html));
    const internal = new Map<string, string>();
    const external: string[] = [];
    for (const p of brand) {
      for (const a of anchors(p.html)) {
        if (a.href.startsWith("#") || a.href.startsWith("/api/")) continue;
        if (a.href.startsWith("/") && !a.href.startsWith("//")) {
          const target = a.href.split("#")[0];
          if (!internal.has(target)) internal.set(target, p.path);
        } else if ((a.way || a.closing) && !/^(https:\/\/|mailto:)/.test(a.href)) {
          external.push(`${p.path}: ${a.href}`);
        }
      }
    }
    const results = await inBatches([...internal], 8, async ([target, from]) => {
      const res = await fetch(baseUrl + target, { redirect: "follow" });
      return res.status === 200 ? null : `${target} (${res.status}, linked from ${from})`;
    });
    expect(results.filter(Boolean)).toEqual([]);
    expect(external, "four ways on leaves the site only by https or mailto").toEqual([]);
  }, 300_000);
});

describe("1. everything is part of something", () => {
  it("says what it is part of on every story, question and work page", () => {
    const silent = pages
      .filter((p) => BELONGS.test(p.path) && isBrand(p.html))
      .filter((p) => !p.html.includes("data-part-of"))
      .map((p) => p.path);
    expect(silent.filter((path) => !IN_NO_FIELD_YET.includes(path)), "a page that says nothing about where it belongs").toEqual([]);
    const placed = IN_NO_FIELD_YET.filter((path) => pages.some((p) => p.path === path) && !silent.includes(path));
    expect(placed, "these now say what they are part of: take them off IN_NO_FIELD_YET").toEqual([]);
  });
});

describe("3. a figure needs its source", () => {
  it("names a source for every figure it shows", () => {
    const unsourced = pages.flatMap((p) => {
      const sources = [...p.html.matchAll(/<p\b[^>]*data-source=""[^>]*>([\s\S]*?)<\/p>/g)].map((m) =>
        m[1].replace(/<[^>]+>/g, "").replace(/Source\s*·/i, "").trim(),
      );
      const figures = count(p.html, 'data-figure=""');
      const named = sources.filter((s) => s.length > 0).length;
      return figures === named ? [] : [`${p.path}: ${figures} figures, ${named} named sources`];
    });
    expect(unsourced).toEqual([]);
  });
});

describe("4. consent is read, never assumed", () => {
  it("never links to a withdrawn story", () => {
    const withdrawnPaths = new Set(withdrawn.slugs.map((slug) => `/stories/${slug}`));
    const leaks = [...pages, notFound].flatMap((p) =>
      anchors(p.html)
        .filter((a) => withdrawnPaths.has(a.href.split(/[?#]/)[0]))
        .map((a) => `${p.path} -> ${a.href}`),
    );
    expect(leaks).toEqual([]);
  });

  it("answers 404 for every withdrawn story", async () => {
    const answers = await inBatches(withdrawn.slugs, 6, async (slug) => {
      const res = await fetch(`${baseUrl}/stories/${slug}`, { redirect: "manual" });
      return res.status === 404 ? null : `${slug} ${res.status}`;
    });
    expect(answers.filter(Boolean)).toEqual([]);
  }, 120_000);

  it("sends no public storage link for an Empathy Ledger photograph in any page's HTML", () => {
    const ungated = [...pages, notFound]
      .filter((p) => UNGATED_PHOTO.test(p.raw) || UNGATED_ENCODED.test(p.raw))
      .map((p) => p.path);
    expect(ungated).toEqual([]);
  });

  // The server's HTML is not the whole page: a photo swapped in after load (as the old EditableImage did) never
  // reaches it. So every page is opened in a browser, scrolled, and every picture it shows is read back, unwrapping
  // Next's image optimiser.
  it("shows photographs only through Empathy Ledger's gate in the browser too", async () => {
    const browser = await chromium.launch();
    try {
      const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
      const found = await inBatches([...pages.map((p) => p.path), notFound.path], 4, async (path) => {
        const page = await context.newPage();
        try {
          // "load", not "networkidle": a page with a film or a slow request may never go quiet, and that should not
          // time the whole check out. Scroll to wake lazy pictures, let them settle briefly, then read what is there.
          try {
            await page.goto(baseUrl + path, { waitUntil: "load", timeout: 60_000 });
          } catch (error) {
            return [`${path}: did not load (${String(error).split("\n")[0]})`];
          }
          await page.evaluate(async () => {
            for (let y = 0; y < document.documentElement.scrollHeight; y += 700) {
              window.scrollTo(0, y);
              await new Promise((r) => setTimeout(r, 80));
            }
          });
          await page.waitForLoadState("networkidle", { timeout: 5_000 }).catch(() => undefined);
          const sources: string[] = await page.evaluate(() => {
            const out: string[] = [];
            const add = (v?: string | null) => v && out.push(v);
            document.querySelectorAll("img").forEach((img) => {
              add(img.currentSrc);
              add(img.getAttribute("src"));
              (img.getAttribute("srcset") || "").split(",").forEach((c) => add(c.trim().split(" ")[0]));
            });
            document.querySelectorAll("source, video").forEach((el) => {
              add(el.getAttribute("src"));
              add(el.getAttribute("poster"));
              (el.getAttribute("srcset") || "").split(",").forEach((c) => add(c.trim().split(" ")[0]));
            });
            document.querySelectorAll<HTMLElement>("*").forEach((el) => {
              const bg = getComputedStyle(el).backgroundImage;
              for (const m of bg.matchAll(/url\("?([^")]+)"?\)/g)) add(m[1]);
            });
            return out;
          });
          const unwrap = (raw: string) =>
            raw.includes("/_next/image") ? decodeURIComponent(new URL(raw, baseUrl).searchParams.get("url") || "") : raw;
          return [...new Set(sources.map(unwrap).filter((src) => UNGATED_PHOTO.test(src)))].map((src) => `${path}: ${src}`);
        } finally {
          await page.close();
        }
      });
      expect(found.flat()).toEqual([]);
    } finally {
      await browser.close();
    }
  }, 900_000);
});
