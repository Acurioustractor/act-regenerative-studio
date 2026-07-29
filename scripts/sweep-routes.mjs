#!/usr/bin/env node
/**
 * Frontend route sweep.
 *
 * Walks every static page route in src/app, fetches it against a running
 * server, and reports the facts you need to decide what ships:
 *
 *   status      what the server actually returns (200 / 307 held / 404)
 *   title       the <title>, so untitled or default-titled pages surface
 *   words       body word count, the crude but reliable "is this a real page"
 *   h1          missing or duplicate H1s
 *   links       internal outbound links, for the link-graph / orphan analysis
 *   drift       rogue palette usage (Tailwind default greens, Material green)
 *   sitemap     whether the route is advertised in src/app/sitemap.ts
 *
 * Usage:
 *   node scripts/sweep-routes.mjs                  # table + summary
 *   node scripts/sweep-routes.mjs --json out.json  # machine-readable
 *
 * Requires a server on SWEEP_BASE_URL (default http://localhost:3001).
 */
import fs from "node:fs";
import path from "node:path";

const baseUrl = (process.env.SWEEP_BASE_URL || "http://localhost:3001").replace(
  /\/$/,
  "",
);
const repoRoot = process.cwd();
const appDir = path.join(repoRoot, "src", "app");

const jsonFlagIndex = process.argv.indexOf("--json");
const jsonOut = jsonFlagIndex !== -1 ? process.argv[jsonFlagIndex + 1] : null;

/** Collect static page routes from the app directory. */
function collectRoutes(dir = appDir, segments = []) {
  const routes = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const name = entry.name;
    // Private folders, route groups and parallel routes are not URL segments.
    if (name.startsWith("_") || name.startsWith("@")) continue;
    const isGroup = name.startsWith("(") && name.endsWith(")");
    const next = isGroup ? segments : [...segments, name];
    const child = path.join(dir, name);
    if (fs.existsSync(path.join(child, "page.tsx"))) {
      routes.push("/" + next.join("/"));
    }
    routes.push(...collectRoutes(child, next));
  }
  return routes;
}

/** Routes in src/app/sitemap.ts, so we can spot pages we never advertise. */
function sitemapRoutes() {
  const file = path.join(appDir, "sitemap.ts");
  if (!fs.existsSync(file)) return new Set();
  const src = fs.readFileSync(file, "utf8");
  return new Set([...src.matchAll(/path:\s*"([^"]+)"/g)].map((m) => m[1]));
}

const stripped = (html) =>
  html
    .replace(/<script\b[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[\s\S]*?<\/style>/gi, "");

function analyse(html) {
  const clean = stripped(html);
  const title = (clean.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || "";
  const h1s = [...clean.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) =>
    m[1].replace(/<[^>]+>/g, "").trim(),
  );
  const text = clean
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  const links = [
    ...new Set(
      [...clean.matchAll(/href="(\/[^"#?]*)/g)]
        .map((m) => m[1].replace(/\/$/, "") || "/")
        // Ignore asset and API hrefs, we want the page graph.
        .filter((h) => !/^\/(_next|api|favicon|images?|assets)/.test(h)),
    ),
  ];
  return { title: title.trim(), h1s, words: text ? text.split(" ").length : 0, links };
}

/** Rogue palette usage, read from source rather than the DOM. */
function driftFor(route) {
  const rel = route === "/" ? "" : route;
  const file = path.join(appDir, rel, "page.tsx");
  if (!fs.existsSync(file)) return null;
  const src = fs.readFileSync(file, "utf8");
  const material = (src.match(/#4[cC][aA][fF]50/g) || []).length;
  const twGreen = (src.match(/\bgreen-\d{2,3}\b/g) || []).length;
  const rawHex = new Set(
    (src.match(/\[#[0-9a-fA-F]{3,8}\]/g) || []).map((s) => s.toLowerCase()),
  ).size;
  return { material, twGreen, rawHex, total: material + twGreen + rawHex };
}

async function main() {
  const routes = [...new Set(collectRoutes())].sort();
  const inSitemap = sitemapRoutes();
  const rows = [];

  for (const route of routes) {
    // A dynamic segment cannot be fetched as its literal "[slug]" path; doing so
    // reported five routes as broken every run, which trains the reader to
    // ignore the broken count. They are exercised with real params instead.
    if (/\[.+\]/.test(route)) {
      rows.push({
        route,
        status: null,
        dynamic: true,
        title: "",
        h1s: [],
        words: 0,
        links: [],
        drift: driftFor(route),
        inSitemap: inSitemap.has(route),
      });
      continue;
    }

    let status = 0;
    let redirectedTo = null;
    let info = { title: "", h1s: [], words: 0, links: [] };
    try {
      const res = await fetch(baseUrl + route, { redirect: "manual" });
      status = res.status;
      if (status >= 300 && status < 400) {
        redirectedTo = res.headers.get("location");
      } else {
        info = analyse(await res.text());
      }
    } catch (err) {
      status = -1;
      info.title = `FETCH FAILED: ${err.message}`;
    }
    rows.push({
      route,
      status,
      redirectedTo,
      ...info,
      drift: driftFor(route),
      inSitemap: inSitemap.has(route),
    });
    process.stderr.write(".");
  }
  process.stderr.write("\n");

  // Inbound link counts, to find orphans nothing links to.
  const inbound = new Map(rows.map((r) => [r.route, 0]));
  for (const r of rows) {
    for (const l of r.links) {
      if (inbound.has(l) && l !== r.route) inbound.set(l, inbound.get(l) + 1);
    }
  }
  for (const r of rows) r.inbound = inbound.get(r.route) ?? 0;

  if (jsonOut) {
    fs.writeFileSync(jsonOut, JSON.stringify(rows, null, 2));
    console.log(`Wrote ${rows.length} routes to ${jsonOut}`);
  }

  const pub = rows.filter((r) => !/^\/(admin|prototypes)/.test(r.route));
  const line = (r) =>
    [
      r.route.padEnd(38),
      String(r.dynamic ? "dyn" : r.status).padEnd(4),
      String(r.words).padStart(5),
      String(r.inbound).padStart(3),
      r.inSitemap ? "map" : "   ",
      r.drift?.total ? `drift:${r.drift.total}` : "",
      r.h1s.length === 1 ? "" : `h1:${r.h1s.length}`,
      r.redirectedTo ? `-> ${r.redirectedTo}` : "",
    ].join(" ");

  console.log("\nROUTE".padEnd(39) + "CODE WORDS  IN MAP FLAGS");
  console.log("-".repeat(96));
  for (const r of pub) console.log(line(r));

  const admin = rows.filter((r) => /^\/(admin|prototypes)/.test(r.route));
  console.log(`\n--- ${admin.length} admin/prototype routes (not for launch) ---`);
  for (const r of admin) console.log(line(r));

  const dynamic = pub.filter((r) => r.dynamic);
  const thin = pub.filter((r) => r.status === 200 && r.words < 150);
  const orphan = pub.filter(
    (r) => r.status === 200 && r.inbound === 0 && r.route !== "/",
  );
  const held = pub.filter((r) => r.status >= 300 && r.status < 400);
  const broken = pub.filter((r) => r.status >= 400 || r.status === -1);
  const drifted = pub.filter((r) => r.drift?.total);
  const unmapped = pub.filter((r) => r.status === 200 && !r.inSitemap);

  console.log("\n=== SUMMARY ===");
  console.log(`public routes      ${pub.length}`);
  console.log(`  live (200)       ${pub.filter((r) => r.status === 200).length}`);
  console.log(`  held (3xx)       ${held.length}  ${held.map((r) => r.route).join(" ")}`);
  console.log(`  broken (4xx/5xx) ${broken.length}  ${broken.map((r) => r.route).join(" ")}`);
  console.log(
    `  dynamic (skipped)${dynamic.length}  ${dynamic.map((r) => r.route).join(" ")}`,
  );
  console.log(`  thin (<150 words)${thin.length}  ${thin.map((r) => r.route).join(" ")}`);
  console.log(`  orphan (0 inbound)${orphan.length}  ${orphan.map((r) => r.route).join(" ")}`);
  console.log(`  not in sitemap   ${unmapped.length}`);
  console.log(`  palette drift    ${drifted.length}`);
  console.log(`admin/prototype    ${admin.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
