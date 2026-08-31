#!/usr/bin/env node
/**
 * Fail if a credential literal is committed to this repository.
 *
 * WHY THIS EXISTS
 * On 2026-08-31 five Supabase `service_role` JWTs were found hardcoded in
 * scripts/, in a repository that is public. Three were for the live Empathy
 * Ledger project, which holds storyteller consent. They had been there long
 * enough that nobody remembered putting them there.
 *
 * They turned out to be dead: Supabase had disabled legacy keys on both
 * projects. That was luck, not design, and it was verified rather than assumed
 * (a valid sb_secret_ key returned 200 on the same tables where both the
 * committed key and a nonsense key returned 401 — without that control the 401
 * would have proved nothing).
 *
 * A grep is a poor security control and this is not pretending otherwise. What
 * it does is make the specific mistake that already happened here unrepeatable,
 * which is worth more than a document saying "do not commit keys".
 *
 *   node scripts/check-committed-secrets.mjs
 *
 * Exit 1 on any hit. Scans TRACKED files only: .env.local is ignored by git and
 * is the correct home for a local credential.
 */

import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

/**
 * Each pattern must be specific enough that a hit is a credential rather than a
 * word. A noisy gate gets muted, and a muted gate is worse than none.
 */
/**
 * Each pattern must be specific enough that a hit is a credential rather than a
 * word. A noisy gate gets muted, and a muted gate is worse than none.
 *
 * The first draft of this file produced 19 hits and every one was a false
 * positive: placeholder strings in env templates (`sk-your_openai_api_key_here`,
 * `sk-live_xxxxxxxx`) and beehiiv newsletter click-tracking URLs, which are
 * genuinely JWTs but are published links rather than credentials. So the tests
 * below are structural, not shape-based.
 */

/** Placeholder markers. A "key" containing one of these is documentation. */
const PLACEHOLDER = /your[_-]|xxxx|_here\b|<[a-z-]+>|example|placeholder|\.\.\./i;

/**
 * A Supabase JWT is only a credential if its payload actually says so. Decoding
 * is what separates a service_role key from a beehiiv tracking link, which
 * carries a `url` payload and no issuer.
 */
function isSupabaseCredential(token) {
  const payload = token.split('.')[1];
  if (!payload) return false;
  try {
    const json = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return json.iss === 'supabase' && (json.role === 'service_role' || json.role === 'anon');
  } catch {
    return false; // not decodable as a claim set, so not one of ours
  }
}

const PATTERNS = [
  {
    label: 'Supabase legacy service_role / anon JWT',
    re: /eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}/g,
    accept: isSupabaseCredential,
  },
  { label: 'Supabase secret key', re: /\bsb_secret_[A-Za-z0-9_-]{10,}/g },
  { label: 'GoHighLevel private integration token', re: /\bpit-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-/g },
  { label: 'OpenAI key', re: /\bsk-(?:proj-)?[A-Za-z0-9_-]{20,}/g },
  { label: 'Anthropic key', re: /\bsk-ant-[A-Za-z0-9_-]{20,}/g },
  { label: 'AWS access key id', re: /\bAKIA[0-9A-Z]{16}\b/g },
  { label: 'Resend key', re: /\bre_[A-Za-z0-9_-]{20,}/g },
];

/**
 * Files that legitimately contain credential-shaped strings. Kept short on
 * purpose: every entry is a hole, so the structural tests above do the work
 * instead wherever they can.
 */
const ALLOW = [/^scripts\/check-committed-secrets\.mjs$/];

const tracked = execFileSync('git', ['ls-files'], { encoding: 'utf8' })
  .split('\n')
  .filter(Boolean)
  .filter((f) => !ALLOW.some((re) => re.test(f)));

const hits = [];
for (const file of tracked) {
  let text;
  try {
    text = readFileSync(file, 'utf8');
  } catch {
    continue; // binary or unreadable; nothing to match
  }
  if (text.includes('\0')) continue;
  text.split('\n').forEach((line, i) => {
    for (const { label, re, accept } of PATTERNS) {
      for (const m of line.matchAll(re)) {
        const value = m[0];
        if (PLACEHOLDER.test(value)) continue;      // documentation, not a key
        if (accept && !accept(value)) continue;      // shaped like one, is not one
        // Never print the value. A gate that leaks the secret into CI logs while
        // reporting the leak has not helped anybody.
        hits.push({ file, line: i + 1, label, len: value.length });
      }
    }
  });
}

if (hits.length === 0) {
  console.log(`check:secrets ✓ no credential literals in ${tracked.length} tracked files`);
  process.exit(0);
}

console.error(`\ncheck:secrets ✗ ${hits.length} credential literal(s) in tracked files\n`);
for (const h of hits) console.error(`  ${h.file}:${h.line}  ${h.label} (${h.len} chars)`);
console.error(`
Treat every one as BURNED, whether or not it still works: it is public, and git
history keeps it even after you delete the line. Rotate it, then read it from
the environment with no fallback literal.
`);
process.exit(1);
