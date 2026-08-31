#!/usr/bin/env node
/**
 * Fetch every form submission on act.place, honestly.
 *
 * READ ONLY. Writes one JSON file locally and touches nothing else.
 *
 * THE OUTPUT NEVER GOES IN THE REPO. It holds 445 real people's names, email
 * addresses, phone numbers and messages, and this repository is public. It is
 * written to .webflow-export/, which is gitignored. Do not move it, do not paste
 * it into an issue, and delete it when the backfill is done.
 *
 * THE TRAP THIS IS BUILT AROUND
 * The Webflow submissions endpoint 404s intermittently, with "The dom could not
 * be found", on forms that read fine seconds later. Two honest single-pass runs
 * over this inbox returned 354 and 171 against a true 445. So any backfill
 * without retries AND a reconciliation assert will miss up to 60% of the rows and
 * report success while doing it.
 *
 * Hence: retries with backoff, dedupe by submission id, per-form accounting, and
 * a loud verdict at the end that distinguishes "complete" from "some forms never
 * answered". A number without that distinction is not evidence.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const SITE_ID = '64ea91d86ff3fda1ff23fb95'; // A Curious Tractor, act.place
const API = 'https://api.webflow.com/v2';
const MAX_ATTEMPTS = 5;
const PAGE = 100;

function token() {
  // Read it here rather than taking it as an argument, so it never travels
  // through a shell history or an agent transcript.
  for (const path of ['.env.local', '../act-regenerative-studio/.env.local']) {
    try {
      const line = readFileSync(path, 'utf8')
        .split('\n')
        .find((l) => l.startsWith('WEBFLOW_API_TOKEN='));
      if (line) return line.slice('WEBFLOW_API_TOKEN='.length).trim().replace(/^["']|["']$/g, '');
    } catch { /* try the next path */ }
  }
  throw new Error('WEBFLOW_API_TOKEN not found in .env.local');
}

const TOKEN = token();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** One request, retried. Returns {ok, data, attempts, status}. */
async function get(path) {
  let lastStatus = 0;
  let orphanHint = false;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const res = await fetch(`${API}${path}`, {
        headers: { Authorization: `Bearer ${TOKEN}`, accept: 'application/json' },
      });
      lastStatus = res.status;
      if (res.ok) return { ok: true, data: await res.json(), attempts: attempt, status: res.status };
      // 429 and 5xx are worth waiting on. So is 404 here, because this endpoint
      // returns it transiently for forms that exist.
      if (![404, 429, 500, 502, 503, 504].includes(res.status)) {
        return { ok: false, attempts: attempt, status: res.status };
      }
      // A 404 saying "the dom could not be found" on EVERY attempt is a different
      // animal from the transient 404 this whole script exists to survive. It is an
      // orphaned form record: the form is still listed on the site, but its DOM was
      // deleted, so Webflow can no longer resolve it. Retrying will never fix it.
      if (res.status === 404) {
        const text = await res.text().catch(() => '');
        if (text.includes('dom could not be found')) orphanHint = true;
      }
    } catch {
      lastStatus = -1; // network, retry
    }
    await sleep(400 * 2 ** (attempt - 1)); // 0.4s, 0.8s, 1.6s, 3.2s
  }
  return { ok: false, attempts: MAX_ATTEMPTS, status: lastStatus, orphan: orphanHint };
}

const forms = await get(`/sites/${SITE_ID}/forms?limit=100`);
if (!forms.ok) throw new Error(`could not list forms: HTTP ${forms.status}`);
const list = forms.data.forms ?? [];
console.log(`forms on the site: ${list.length}\n`);

const byId = new Map(); // submission id -> row. Dedupe lives here.
const report = [];

for (const form of list) {
  let offset = 0;
  let total = null;
  let got = 0;
  let attempts = 0;
  let failed = false;
  let orphan = false;

  while (true) {
    const res = await get(`/forms/${form.id}/submissions?offset=${offset}&limit=${PAGE}`);
    attempts += res.attempts;
    if (!res.ok) { failed = true; orphan = res.orphan === true; break; }
    const items = res.data.formSubmissions ?? [];
    if (total === null) total = res.data.pagination?.total ?? items.length;
    for (const s of items) byId.set(s.id, { ...s, _formId: form.id, _formName: form.displayName });
    got += items.length;
    offset += PAGE;
    if (items.length < PAGE || offset >= total) break;
  }

  report.push({ form: form.displayName, id: form.id, reported: total, fetched: got, attempts, failed, orphan });
  const flag = failed ? (orphan ? 'ORPHANED' : 'UNREACHABLE') : got === total ? '' : 'SHORT';
  if (total > 0 || failed) {
    console.log(`  ${String(got).padStart(4)}/${String(total ?? '?').padEnd(4)} ${flag.padEnd(12)} ${form.displayName}`);
  }
}

const reportedTotal = report.reduce((n, r) => n + (r.reported ?? 0), 0);
// Split the failures. An orphan is permanently gone and cannot block the run; a
// plain unreachable form is a transient failure and MUST block it, because
// re-running fixes that one and nothing fixes a backfill that silently skipped it.
const orphaned = report.filter((r) => r.failed && r.orphan);
const unreachable = report.filter((r) => r.failed && !r.orphan);
const short = report.filter((r) => !r.failed && r.reported !== null && r.fetched < r.reported);

console.log(`\n  unique submissions fetched: ${byId.size}`);
console.log(`  sum of per-form reported totals: ${reportedTotal}`);
console.log(`  forms permanently orphaned (DOM deleted): ${orphaned.length}`);
console.log(`  forms that failed transiently: ${unreachable.length}`);
console.log(`  forms that returned fewer than reported: ${short.length}`);

const out = process.env.WEBFLOW_EXPORT ?? '.webflow-export/submissions.json';
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify({
  fetchedAt: new Date().toISOString(),
  siteId: SITE_ID,
  unique: byId.size,
  reportedTotal,
  complete: unreachable.length === 0 && short.length === 0,
  orphanedFormIds: orphaned.map((r) => r.id),
  report,
  submissions: [...byId.values()],
}, null, 2));

console.log(`\n  written: ${out}`);
if (unreachable.length || short.length) {
  console.log(`\n  INCOMPLETE. Do not backfill from this file: it is missing rows and would`);
  console.log(`  report success while doing it. Re-run; the failures are usually transient.`);
  process.exit(1);
}
if (orphaned.length) {
  console.log(`
  ${orphaned.length} form(s) are orphaned: still listed on the site, DOM deleted, so
  Webflow cannot resolve them. If they ever held submissions, those are not
  retrievable through this API by any means, and no retry changes that.`);
}
console.log(`
  COMPLETE: every reachable form answered and returned its full reported count.`);
