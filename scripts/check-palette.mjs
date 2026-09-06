#!/usr/bin/env node
/**
 * Palette ratchet for the public site.
 *
 * Two rules, both ratcheted against config/palette-baseline.json so nothing new
 * gets in while the old is worked down:
 *   1. raw hex colours in public page and component code (should be tokens)
 *   2. tokens from the other design language in a route's page code
 *      (documentary routes use --site-*, editorial routes use --we-*)
 *
 * Usage: node scripts/check-palette.mjs            exit 1 when any file got worse
 *        node scripts/check-palette.mjs --update   rewrite the baseline to now
 */
import { readdirSync, readFileSync, statSync, writeFileSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const BASELINE = join(ROOT, 'config/palette-baseline.json');
const update = process.argv.includes('--update');

// Single source: parsed from src/lib/design/design-language.ts so the rule and the check cannot drift.
const ROUTE_LANGUAGE = [...readFileSync(join(ROOT, 'src/lib/design/design-language.ts'), 'utf8').matchAll(/\["([^"]+)",\s*"(documentary|editorial|shell)"\]/g)].map((m) => [m[1], m[2]]);
if (ROUTE_LANGUAGE.length < 5) { console.error('palette: could not read ROUTE_LANGUAGE from design-language.ts'); process.exit(2); }
const FOREIGN = { documentary: /--we-|\bwe-(olive|brown|sand|gold|paper|cream|bark|earth|night|sage|forest)/, editorial: /--site-|\b(text|bg|border|from|to|ring)-(forest|clay|ink|muted|sage|gold)\b/ };

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) { if (!/\/(admin|prototypes|api)$/.test(p)) walk(p, out); }
    else if (/\.(tsx|ts|css)$/.test(name) && !/\.test\./.test(name) && !/globals\.css$/.test(name)) out.push(p);
  }
  return out;
}

function languageOfPageFile(rel) {
  const m = rel.match(/^src\/app(\/.*)?\/(page|layout|[a-z-]+)\.(tsx|css)$/);
  if (!m) return null;
  const route = (m[1] || '/').replace(/\/\([^)]+\)/g, '').replace(/\/\[[^\]]+\]/g, '/x') || '/';
  let best = null;
  for (const [prefix, lang] of ROUTE_LANGUAGE) {
    const hit = prefix === '/' ? route === '/' : route === prefix || route.startsWith(prefix + '/');
    if (hit && (!best || prefix.length > best[0].length)) best = [prefix, lang];
  }
  return best ? best[1] : 'editorial';
}

const files = [...walk(join(ROOT, 'src/app')), ...walk(join(ROOT, 'src/components'))];
const now = {};
let hexTotal = 0, foreignTotal = 0;
for (const f of files) {
  const rel = relative(ROOT, f);
  const src = readFileSync(f, 'utf8');
  const hex = (src.match(/#[0-9A-Fa-f]{6}\b/g) || []).length;
  const lang = languageOfPageFile(rel);
  const foreign = lang && FOREIGN[lang] ? (src.match(new RegExp(FOREIGN[lang].source, 'g')) || []).length : 0;
  if (hex || foreign) now[rel] = { hex, foreign };
  hexTotal += hex; foreignTotal += foreign;
}

if (update || !existsSync(BASELINE)) {
  writeFileSync(BASELINE, JSON.stringify({ updated: new Date().toISOString().slice(0, 10), hexTotal, foreignTotal, files: now }, null, 2) + '\n');
  console.log(`palette: baseline written. raw hex ${hexTotal}, foreign-language tokens ${foreignTotal}, ${Object.keys(now).length} files`);
  process.exit(0);
}

const base = JSON.parse(readFileSync(BASELINE, 'utf8'));
const worse = [];
for (const [rel, v] of Object.entries(now)) {
  const b = base.files[rel] || { hex: 0, foreign: 0 };
  if (v.hex > b.hex || v.foreign > b.foreign) worse.push(`${rel}: hex ${b.hex} -> ${v.hex}, foreign ${b.foreign} -> ${v.foreign}`);
}
console.log(`palette: raw hex ${hexTotal} (baseline ${base.hexTotal}), foreign-language tokens ${foreignTotal} (baseline ${base.foreignTotal})`);
if (worse.length) {
  console.error(`palette: ${worse.length} file(s) got worse. Use a token from src/app/globals.css (see src/lib/design/design-language.ts for which family this route speaks).`);
  for (const w of worse) console.error('  ' + w);
  process.exit(1);
}
if (hexTotal < base.hexTotal || foreignTotal < base.foreignTotal) console.log('palette: better than baseline; run with --update to lock it in');
