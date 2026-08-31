#!/usr/bin/env node
/**
 * Replay act.place's Webflow form submissions through the intake spine.
 *
 *   node webflow-replay.mjs            # plan only. No network calls at all.
 *   node webflow-replay.mjs --apply    # record each row in the spine
 *
 * WHY THIS EXISTS NOW
 * act.place leaves Webflow this week. When the domain moves, that site stops
 * existing and 445 submissions go with it, the oldest from February 2024. They
 * have never been actioned.
 *
 * WHAT --apply DOES AND DOES NOT DO
 * It POSTs each row to the spine with `dryRun: true`, which records the
 * submission durably in `act_intake` with its lane resolved, and makes NO
 * GoHighLevel call. That is deliberate and is the agreed decision: 406 contacts
 * and 406 conversations manufactured from years-old submissions would be worse
 * than useless, and several of these people have since been contacted by other
 * means. The point is that a human can read them, not that the CRM swallows them.
 *
 * Consequence to know: those rows land with `ghl_status = 'pending'`, so they
 * will show as an undelivered backlog in check-estate until someone triages them.
 * That is honest. They ARE a backlog.
 *
 * IDEMPOTENCY
 * The Webflow submission id is the key. The spine's default key is scoped to the
 * write date, so without this every row written today would collapse into a
 * handful. Re-running is safe: the second run dedupes against the first.
 */

import { readFileSync } from 'node:fs';

const INPUT = process.env.WEBFLOW_EXPORT ?? '.webflow-export/submissions.json';
const ENDPOINT = 'https://tednluwflfhxyucgwigh.supabase.co/functions/v1/intake';
const APPLY = process.argv.includes('--apply');

/**
 * Page to project code. Derived from `publishedPath`, which Webflow records on
 * every submission, rather than guessed from the form name.
 *
 * `/project` is the Projects Template page. It is one Webflow template serving
 * every project, so the submission does not record WHICH project, and no amount
 * of staring at the row recovers it. Those sit at ACT-CORE with the row saying
 * the project was undeterminable. Recording "we could not tell" is honest;
 * picking a plausible project would be fabrication.
 */
const PROJECT_BY_PATH = {
  '/contact': 'ACT-IN',
  '/about-new': 'ACT-IN',
  '/act-homework': 'ACT-IN',
  '/act-projects/justicehub': 'ACT-JH',
  '/be-contained': 'ACT-JH',   // CONTAINED is JusticeHub
  '/goods': 'ACT-GD',
  '/project': 'ACT-CORE',      // undeterminable, see above
};

/** Field names differ per form. Webflow lets you name inputs anything. */
function person(row) {
  const f = row.formResponse ?? {};
  const pick = (...keys) => { for (const k of keys) if (f[k]?.trim?.()) return f[k].trim(); };
  return {
    name: pick('Name', 'Contact 1 Name', 'Contact 8 Name'),
    email: pick('Email', 'Email 2', 'Contact 1 Email', 'Contact 8 Email'),
    phone: pick('Phone Number'),
    organisation: pick('Company Name'),
    message: pick('Message', 'Message 2', 'Contact 1 Message', 'Contact 8 Message', 'Additional notes'),
  };
}

const data = JSON.parse(readFileSync(INPUT, 'utf8'));
if (!data.complete) {
  console.error('The fetch file is marked incomplete. Re-run webflow-fetch.mjs first.');
  process.exit(1);
}

const plan = { replay: [], mailOnly: [], noContact: [] };

for (const row of data.submissions) {
  const p = person(row);
  const projectCode = PROJECT_BY_PATH[row.publishedPath];

  // Email-only rows are a mailing-list signup wearing a form. They are not an
  // enquiry, nobody is waiting on a reply, and pushing them through intake would
  // manufacture 39 conversations nobody had. They go to the mail lane separately.
  const emailOnly = !p.message && !p.name && p.email;
  if (emailOnly) { plan.mailOnly.push({ id: row.id, email: p.email, at: row.dateSubmitted }); continue; }
  if (!p.email && !p.phone) { plan.noContact.push({ id: row.id, path: row.publishedPath }); continue; }

  plan.replay.push({
    id: row.id,
    projectCode: projectCode ?? 'ACT-CORE',
    knownProject: Boolean(projectCode) && row.publishedPath !== '/project',
    path: row.publishedPath,
    at: row.dateSubmitted,
    person: p,
  });
}

const byProject = {};
for (const r of plan.replay) byProject[r.projectCode] = (byProject[r.projectCode] || 0) + 1;

console.log(`\nSource: ${data.unique} submissions fetched ${data.fetchedAt}\n`);
console.log(`  replay through the spine : ${plan.replay.length}`);
for (const [code, n] of Object.entries(byProject).sort((a, b) => b[1] - a[1])) {
  const undet = code === 'ACT-CORE' ? '  (project undeterminable, template page)' : '';
  console.log(`      ${String(n).padStart(4)}  ${code}${undet}`);
}
console.log(`  mail lane, not intake    : ${plan.mailOnly.length}   email-only signups`);
console.log(`  no contact point at all  : ${plan.noContact.length}`);
console.log(`  ----`);
console.log(`  accounted for            : ${plan.replay.length + plan.mailOnly.length + plan.noContact.length} of ${data.unique}`);

if (plan.replay.length + plan.mailOnly.length + plan.noContact.length !== data.unique) {
  console.error('\n  ABORT: the three buckets do not sum to the source count. A row was dropped silently.');
  process.exit(1);
}

if (!APPLY) {
  console.log(`\n  Plan only. Nothing was sent. Re-run with --apply to record these in the spine.`);
  console.log(`  --apply makes NO GoHighLevel call: it records, so a human can read them.\n`);
  process.exit(0);
}

const KEY = process.env.ACT_INTAKE_KEY;
if (!KEY) { console.error('\nACT_INTAKE_KEY is not set.'); process.exit(1); }

let ok = 0, deduped = 0, failed = 0;
for (const [i, r] of plan.replay.entries()) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-act-intake-key': KEY },
    body: JSON.stringify({
      site: 'act-regenerative-studio',
      projectCode: r.projectCode,
      formType: 'contact',
      idempotencyKey: r.id,          // the Webflow submission id
      capturedAt: r.at,
      dryRun: true,                  // record, do not deliver
      fields: {
        name: r.person.name,
        email: r.person.email,
        phone: r.person.phone,
        organisation: r.person.organisation,
        message: r.person.message,
        _webflowPath: r.path,
        _projectDetermined: r.knownProject,
      },
    }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) { failed++; console.error(`  FAIL ${r.id} ${res.status} ${JSON.stringify(body).slice(0, 120)}`); }
  else if (body.deduped) deduped++;
  else ok++;
  if ((i + 1) % 25 === 0) console.log(`  ${i + 1}/${plan.replay.length}  new=${ok} deduped=${deduped} failed=${failed}`);
}

console.log(`\n  recorded ${ok}, already present ${deduped}, failed ${failed}`);
process.exit(failed > 0 ? 1 : 0);
