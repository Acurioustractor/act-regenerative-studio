#!/usr/bin/env node
/**
 * Every door out of the Living Field must open on the first knock.
 *
 * The five field pages each end at a platform: JusticeHub, Empathy Ledger,
 * Goods on Country, The Harvest, and CONTAINED on JusticeHub for Art. Those
 * links are the point of the site, so this checks each against the live
 * internet and fails on anything but a direct 200. A redirect means readers
 * are being sent through an avoidable hop; a 4xx, 5xx or timeout means the
 * door is shut.
 *
 * It also probes the production_url the project-code registry holds for the
 * same platforms. A hop or failure there is a warning, not a failure: the
 * registry is edited in act-global-infrastructure, so this script cannot fix
 * it, only say so.
 *
 * The guard that these links belong to the right platform at all is offline,
 * in src/data/living-field.test.ts. This is the half that needs the network.
 *
 * Usage:
 *   node scripts/check-platform-links.mjs            # table, exit 1 on failure
 *   node scripts/check-platform-links.mjs --json
 *   node scripts/check-platform-links.mjs --probe https://example.org/
 *     # one URL under the same rules; handy as a control, since a URL that
 *     # redirects must come back FAIL for a passing run to mean anything
 */
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const args = process.argv.slice(2);
const asJson = args.includes("--json");
const probeIndex = args.indexOf("--probe");
const TIMEOUT_MS = 15_000;
const USER_AGENT = "act-regenerative-studio check:platforms";

async function probe(url) {
  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "manual",
      headers: { "user-agent": USER_AGENT, accept: "text/html" },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    // Drain the body so the socket is released before the next probe.
    await response.arrayBuffer().catch(() => {});
    return { status: response.status, location: response.headers.get("location") };
  } catch (error) {
    return { status: 0, error: error.message };
  }
}

function verdict(result) {
  if (result.status === 200) return { ok: true, note: "200" };
  if (result.status >= 300 && result.status < 400) {
    return { ok: false, note: `${result.status} hops to ${result.location ?? "(no location)"}` };
  }
  if (result.status === 0) return { ok: false, note: `request failed: ${result.error}` };
  return { ok: false, note: String(result.status) };
}

if (probeIndex !== -1) {
  const url = args[probeIndex + 1];
  if (!url) {
    console.error("--probe needs a URL");
    process.exit(2);
  }
  const result = verdict(await probe(url));
  console.log(`${result.ok ? "ok  " : "FAIL"} ${url}  ${result.note}`);
  process.exit(result.ok ? 0 : 1);
}

const repoRoot = process.cwd();
// Node 22.18+ strips types on import, so the data file is read as-is rather
// than duplicated here. If this line ever fails, the fix is the Node version,
// not a parallel copy of the links.
const { livingFields } = await import(
  pathToFileURL(path.join(repoRoot, "src/data/living-field.ts")).href
);
const registry = JSON.parse(
  await fs.readFile(path.join(repoRoot, "src/data/project-code-registry.generated.json"), "utf8"),
);
const byCode = new Map(registry.projects.map((project) => [project.code, project]));

const rows = [];
const failures = [];
const warnings = [];
const seen = new Set();

for (const field of livingFields) {
  const links = [
    ["destination", field.destinationHref],
    ["project", field.projectHref],
  ];
  for (const [kind, href] of links) {
    if (!href.startsWith("http") || seen.has(href)) continue;
    seen.add(href);
    const result = verdict(await probe(href));
    rows.push({ subject: field.id, kind, url: href, ...result });
    if (!result.ok) failures.push(`${field.id} ${kind}: ${href} ${result.note}`);
  }
}

for (const code of new Set(livingFields.map((field) => field.platformCode))) {
  const url = byCode.get(code)?.productionUrl;
  if (!url) {
    warnings.push(`${code}: no production_url in the registry`);
    continue;
  }
  if (seen.has(url)) continue;
  const result = verdict(await probe(url));
  rows.push({ subject: code, kind: "registry", url, ...result });
  if (!result.ok) {
    warnings.push(
      `registry ${code}: ${url} ${result.note} (fix production_url in act-global-infrastructure/config/project-codes.json, then npm run sync:project-codes)`,
    );
  }
}

if (asJson) {
  console.log(JSON.stringify({ rows, failures, warnings }, null, 2));
} else {
  for (const row of rows) {
    const mark = row.ok ? "ok  " : row.kind === "registry" ? "warn" : "FAIL";
    console.log(`${mark} ${row.subject.padEnd(8)} ${row.kind.padEnd(11)} ${row.url}  ${row.note}`);
  }
  for (const warning of warnings) console.warn(`warn ${warning}`);
}

if (failures.length > 0) {
  console.error(`\nPlatform link check failed: ${failures.length} door(s) do not open on the first knock.`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

const checked = rows.filter((row) => row.kind !== "registry").length;
console.log(
  `\nPlatform link check passed: ${checked} links answer 200 directly${warnings.length > 0 ? `, ${warnings.length} registry warning(s) above` : ""}.`,
);
