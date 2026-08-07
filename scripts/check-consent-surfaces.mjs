#!/usr/bin/env node
/**
 * Stops a commit that changes what community content is publicly visible until
 * the consent gate has actually been run.
 *
 * Written 2026-08-08, the day after a session restored 107 broken photographs
 * to the public story pages, changed which API route supplies them, and ran a
 * migration across 40 articles of consent-bearing media, without once running
 * `consent-check`. That skill's own description names this exact work:
 * "Run BEFORE publishing, syndicating, or externally sharing ANY storyteller
 * content — a story, quote, name, photo, or video."
 *
 * The gate was not skipped out of disagreement. It was skipped because nothing
 * asked. Every other guard in this repository runs whether anyone remembers it
 * or not, and this is the one that most needed to.
 *
 * What it cannot do is judge consent. That needs the records in
 * act-global-infrastructure/wiki/decisions and a human who knows what was
 * agreed in conversation. All this does is refuse to let the question go
 * unasked.
 *
 * Usage:
 *   node scripts/check-consent-surfaces.mjs --staged   # pre-commit
 *   node scripts/check-consent-surfaces.mjs --list     # show the surfaces
 *
 * To proceed once the gate has been run:
 *   CONSENT_CHECKED="green: <one line on who approved what, and where recorded>" git commit ...
 */

import { execSync } from "node:child_process";

/**
 * Paths that change what community content a stranger can see, or which
 * content is carried at all. Deliberately narrow: a rule that fires on
 * everything gets muted, and a muted rule is worse than none.
 */
const CONSENT_SURFACES = [
  { pattern: /^src\/app\/stories\//, why: "the story renderer: what a reader sees of a story" },
  { pattern: /^src\/app\/prototypes\/stories\//, why: "the stories index and its copy" },
  { pattern: /^src\/components\/(stories|editorial)\//, why: "how stories and their photographs render" },
  { pattern: /^src\/data\/empathy-ledger-.*\.generated\.json$/, why: "the syndicated content itself" },
  { pattern: /^scripts\/sync-el-/, why: "what is pulled from Empathy Ledger and on what terms" },
  { pattern: /^config\/withdrawn-editorial\.json$/, why: "the consent-withdrawal tombstone" },
  { pattern: /^src\/lib\/empathy-ledger-editorial\.ts$/, why: "the consent gate applied to the feed" },
  { pattern: /^src\/app\/storytellers\//, why: "storyteller profiles" },
  { pattern: /^src\/data\/field-assignments\.ts$/, why: "which stories surface on which field page" },
];

function stagedFiles() {
  const out = execSync("git diff --cached --name-only --diff-filter=ACMR", { encoding: "utf8" });
  return out.split("\n").map((line) => line.trim()).filter(Boolean);
}

if (process.argv.includes("--list")) {
  console.log("Consent-bearing surfaces in this repository:\n");
  for (const surface of CONSENT_SURFACES) {
    console.log(`  ${String(surface.pattern.source).padEnd(52)} ${surface.why}`);
  }
  process.exit(0);
}

const files = stagedFiles();
const touched = files
  .map((file) => ({ file, surface: CONSENT_SURFACES.find((s) => s.pattern.test(file)) }))
  .filter((entry) => entry.surface);

if (touched.length === 0) process.exit(0);

const acknowledged = process.env.CONSENT_CHECKED;
if (acknowledged && acknowledged.trim().length > 0) {
  console.log(`check:consent-surfaces ✓ acknowledged — ${acknowledged.trim()}`);
  process.exit(0);
}

console.error(`
check:consent-surfaces — BLOCKED

This commit changes what community content is publicly visible:
`);
for (const { file, surface } of touched) {
  console.error(`  ${file}\n      ${surface.why}`);
}
console.error(`
Run the consent gate before committing. It lives at
  act-global-infrastructure/.claude/skills/consent-check/SKILL.md

It grills six things: who consented and who holds the authority, what scope was
approved, the medium of consent, whether it is current, whether every personal
and place name is verified, and whether any youth or vulnerable voice is
involved. An incomplete or unverified trail is RED.

READ THE DATABASE FIRST, NOT THE WIKI. Empathy Ledger is the system of record.
Per-article, per-destination consent lives in its syndication_consent table,
scoped to the site row with slug 'act-regenerative-studio'. On 2026-08-08 every
live article had an approved row there. The wiki decision records
(act-global-infrastructure/wiki/decisions/2026-04-18-*-story-approval.md) say
public-internet publication is NOT approved, which contradicts the database and
is the older half of the record. Reading only the wiki produced a false alarm
once already.

  select a.slug, sc.status, sc.elder_approved, sc.revoked_at
  from articles a
  left join syndication_consent sc on sc.article_id = a.id
   and sc.site_id = (select id from syndication_sites
                     where slug = 'act-regenerative-studio')
  where a.syndication_enabled and a.status = 'published';

Genuinely open as of 2026-08-08: elder approval is unset on all 40 consent rows
(requires_elder_approval false, cultural_permission_level null) while 14 live
articles use Elder, Country or Traditional Owner. And the content-hub read
routes do not consult syndication_consent at all; they gate on article-level
booleans. See thoughts/shared/handoffs/2026-08-08-story-photographs-and-a-consent-red.md

Once the gate has been run and the answer recorded:

  CONSENT_CHECKED="green: <who approved what, and where it is recorded>" git commit ...

Never write that line to get past this. An unverified gap surfaced is
recoverable; a fabricated consent detail published is not.
`);
process.exit(1);
