#!/usr/bin/env node
/**
 * Sync .claude/skills/act-brand-alignment from act-global-infrastructure, which is canonical.
 *
 *   node scripts/sync-brand-skill.mjs           # report drift, change nothing
 *   node scripts/sync-brand-skill.mjs --apply   # copy upstream over the local files
 *
 * Upstream location: $ACT_INFRA_DIR, else ../act-global-infrastructure next to this repo.
 * Files that exist only here (repo-specific overlays such as references/public-copy-checklist.md)
 * are left alone and listed. Files that exist only upstream are copied in on --apply.
 * Exit 1 when drift exists and --apply was not given, so it can run as a check.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, relative, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, "..");
const infra = process.env.ACT_INFRA_DIR ?? resolve(repo, "..", "act-global-infrastructure");
const SKILL = join(".claude", "skills", "act-brand-alignment");
const src = join(infra, SKILL);
const dst = join(repo, SKILL);
const apply = process.argv.includes("--apply");

if (!existsSync(join(src, "SKILL.md"))) {
  console.error(`upstream skill not found at ${src}; set ACT_INFRA_DIR`);
  process.exit(2);
}

function walk(dir, base = dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p, base));
    else out.push(relative(base, p));
  }
  return out.sort();
}

const upstream = new Set(walk(src));
const local = new Set(existsSync(dst) ? walk(dst) : []);
const changed = [];
const missing = [];
for (const f of upstream) {
  const a = readFileSync(join(src, f));
  if (!local.has(f)) missing.push(f);
  else if (!a.equals(readFileSync(join(dst, f)))) changed.push(f);
}
const localOnly = [...local].filter((f) => !upstream.has(f));

for (const f of changed) console.log(`drift    ${f}`);
for (const f of missing) console.log(`missing  ${f}`);
for (const f of localOnly) console.log(`local    ${f} (kept, not upstream)`);

const drift = changed.length + missing.length;
if (drift === 0) {
  console.log(`in sync with ${infra}`);
  process.exit(0);
}
if (!apply) {
  console.log(`\n${drift} file(s) differ from upstream. Run with --apply to take the upstream version.`);
  process.exit(1);
}
for (const f of [...changed, ...missing]) {
  mkdirSync(dirname(join(dst, f)), { recursive: true });
  writeFileSync(join(dst, f), readFileSync(join(src, f)));
  console.log(`copied   ${f}`);
}
