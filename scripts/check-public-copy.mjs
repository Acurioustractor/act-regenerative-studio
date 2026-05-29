#!/usr/bin/env node
/**
 * Scan user-facing source files for known internal-copy patterns and emoji
 * decoration that should not ship to external readers.
 *
 * Run manually: `npm run check:copy`
 * Wire into git pre-commit by adding to .git/hooks/pre-commit:
 *   #!/bin/sh
 *   node scripts/check-public-copy.mjs --staged
 */

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

// Phrases that have leaked from internal authoring/debug into public-facing
// copy. Adding to this list is the primary maintenance — keep it specific so
// the script doesn't generate noise.
const INTERNAL_PHRASES = [
  // Seed-prompt notes-to-author
  /\bshould (open|show|read|hold|carry|feel) (with|the|like|as|grounded)/i,
  /\bstronger\b.{0,40}\bpage needs\b/i,
  // Insider plumbing terms in user-facing prose
  /\bdurable memory\b/i,
  /\bsource bridges?\b/i,
  /\bflagship field\b/i,
  /\bliving project system\b/i,
  /\bconsented live layer\b/i,
  /\bsite-scoped syndication\b/i,
  /\bcontent hub fallback\b/i,
  /\bdeeper spoke\b/i,
  /\bACT hub framing\b/i,
  /\bcanonical field brief\b/i,
  /\bnarrative work before\b/i,
  // Import/debug captions
  /\bImported from ACT Placemat\b/i,
  /\bcurated-2025 for Compendium\b/i,
  /^\s*"Image:\s/m,
  // Internal CTAs (user-facing buttons should not say these)
  /["'`]Open wiki entry["'`]/,
  /["'`]Open flagship field["'`]/,
];

// High-signal internal markers that leaked from research/CRM data into public
// bios (the /people incident, 2026-05-29). Checked in .tsx always, and in the
// Empathy Ledger bio data via `--data` (run before un-gating /people, since the
// generated source still carries these until the bios are sanitized at sync).
const INTERNAL_MARKERS = [
  /\bPUBLIC-ARCHIVE-CONFIRMED\b/i,
  /\bcluster identity\b/i,
  /\bStrengths:\s+\w/,
];

// Decorative emoji that should not appear in user-facing component literals.
// Limit to the set we've cleaned; expand as needed.
const BANNED_EMOJI = /[👂🔍⚡🎨🌱🚀🌟💡🎯📍👥📖📊🛡⚙📈📚💬🌐💻🤝📝🌿💪🧭🎙🌊]/u;

// Files this scanner cares about: components and pages that render JSX.
// We only flag *.tsx (rendering surface). Plain *.ts under app/ is server
// route logic with internal logging emojis that never reach the browser.
const TARGET_GLOBS = [/^src\/app\/.*\.tsx$/, /^src\/components\/.*\.tsx$/];
// Generated public-bio data. Scanned only with `--data` because the EL source
// still carries internal markers until the bios are sanitized; keeping it out
// of the default run lets the launch gate stay green while /people is gated.
const DATA_GLOBS = [/^src\/data\/empathy-ledger-(featured|storytellers).*\.generated\.json$/];
const SKIP_PATTERNS = [
  /\/__tests__\//,
  /\.test\.(t|j)sx?$/,
  /\/admin\//,
  /\/dashboard\//,
];

function listAllFiles(root, files = []) {
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
    const full = path.join(root, entry.name);
    if (entry.isDirectory()) {
      listAllFiles(full, files);
    } else {
      files.push(full);
    }
  }
  return files;
}

function listStagedFiles() {
  try {
    const output = execSync('git diff --cached --name-only --diff-filter=ACMR', {
      encoding: 'utf8',
    });
    return output.split('\n').filter(Boolean);
  } catch {
    return [];
  }
}

function scanFile(absolutePath, repoRelativePath, { scanData = false } = {}) {
  const isTsx = TARGET_GLOBS.some((re) => re.test(repoRelativePath));
  const isData = DATA_GLOBS.some((re) => re.test(repoRelativePath));
  if (!isTsx && !(isData && scanData)) return [];
  if (SKIP_PATTERNS.some((re) => re.test(repoRelativePath))) return [];
  if (!fs.existsSync(absolutePath) || fs.statSync(absolutePath).isDirectory()) return [];

  const content = fs.readFileSync(absolutePath, 'utf8');
  const findings = [];
  const lines = content.split('\n');

  lines.forEach((line, idx) => {
    // Internal research/CRM markers: flagged everywhere we scan (.tsx and data).
    for (const marker of INTERNAL_MARKERS) {
      if (marker.test(line)) {
        findings.push({
          file: repoRelativePath,
          line: idx + 1,
          kind: 'internal-marker',
          text: line.trim().slice(0, 140),
        });
      }
    }
    // Prose phrases + decorative emoji only matter on the rendered .tsx surface.
    if (isTsx) {
      for (const phrase of INTERNAL_PHRASES) {
        if (phrase.test(line)) {
          findings.push({
            file: repoRelativePath,
            line: idx + 1,
            kind: 'internal-phrase',
            text: line.trim().slice(0, 140),
          });
        }
      }
      if (BANNED_EMOJI.test(line)) {
        findings.push({
          file: repoRelativePath,
          line: idx + 1,
          kind: 'decorative-emoji',
          text: line.trim().slice(0, 140),
        });
      }
    }
  });

  return findings;
}

function main() {
  const stagedOnly = process.argv.includes('--staged');
  const scanData = process.argv.includes('--data');
  const repoRoot = process.cwd();

  let candidates;
  if (stagedOnly) {
    candidates = listStagedFiles().map((rel) => ({
      abs: path.join(repoRoot, rel),
      rel,
    }));
  } else {
    candidates = listAllFiles(path.join(repoRoot, 'src')).map((abs) => ({
      abs,
      rel: path.relative(repoRoot, abs),
    }));
  }

  const findings = candidates.flatMap(({ abs, rel }) => scanFile(abs, rel, { scanData }));

  if (findings.length === 0) {
    console.log('check:copy ✓ no internal-copy patterns found in user-facing files');
    process.exit(0);
  }

  console.error(`check:copy found ${findings.length} potential issue(s):\n`);
  for (const f of findings) {
    console.error(`  ${f.file}:${f.line}  [${f.kind}]`);
    console.error(`    ${f.text}\n`);
  }
  console.error(
    'Rewrite these for an external reader (partner / funder / public),\n' +
      'or update scripts/check-public-copy.mjs INTERNAL_PHRASES if a match is a false positive.'
  );
  process.exit(1);
}

main();
