#!/usr/bin/env node

import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { launchRedirects } = require('../config/launch-redirects.cjs');

const baseUrl = (process.env.REDIRECT_CHECK_BASE_URL || 'http://localhost:3001').replace(/\/$/, '');

const failures = [];

function expectedStatus(redirect) {
  return redirect.permanent ? 308 : 307;
}

function normalizePath(value) {
  if (!value) return '';
  try {
    const url = new URL(value, baseUrl);
    return `${url.pathname}${url.search}`.replace(/\/$/, '') || '/';
  } catch {
    return value.replace(/\/$/, '') || '/';
  }
}

// Next matches redirects in declaration order, first match wins. The config
// leans on that: while the editorial-site closure holds, `/projects/:slug*`
// covers the retired `/projects/*` entries declared below it, and those entries
// exist to record where each URL belongs if `/projects` and `/events` return
// (see the note in config/launch-redirects.cjs, which warns against flattening
// them). Asserting a covered rule against the live site tests the closure, not
// the rule, so those are reported as dormant rather than failed.
function sourceMatcher(source) {
  const pattern = source
    .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
    .replace(/\/:[A-Za-z_]\w*\*/g, '(?:/.*)?')
    .replace(/\/:[A-Za-z_]\w*\+/g, '/.+')
    .replace(/:[A-Za-z_]\w*/g, '[^/]+');
  return new RegExp(`^${pattern}$`);
}

const matchers = launchRedirects.map((entry) => (entry.source ? sourceMatcher(entry.source) : null));
const dormant = [];

function coveredBy(index) {
  const { source } = launchRedirects[index];
  for (let i = 0; i < index; i += 1) {
    if (matchers[i]?.test(source)) return launchRedirects[i];
  }
  return null;
}

// A rule whose destination is itself redirected costs the visitor a second hop and
// splits the link equity across two URLs, and this check could not see it: it
// asserts one hop at a time, so /projects/justicehub -> /justicehub passed while
// the browser went on to /fields/justice. Thirty rules had drifted into chains
// behind the editorial-site closure before anyone noticed.
function chainedDestination(destination) {
  const target = destination.split("#")[0];
  const hit = launchRedirects.find((entry) => entry.source && matchers[launchRedirects.indexOf(entry)]?.test(target));
  return hit && hit.destination !== destination ? hit.destination : null;
}

for (const [index, redirect] of launchRedirects.entries()) {
  if (!redirect.source || !redirect.destination) {
    failures.push(`redirect entry is missing source or destination: ${JSON.stringify(redirect)}`);
    continue;
  }

  const onward = chainedDestination(redirect.destination);
  if (onward) {
    failures.push(
      `${redirect.source}: destination ${redirect.destination} redirects on to ${onward}; point it at the final page`,
    );
  }

  const cover = coveredBy(index);
  if (cover) {
    dormant.push(`${redirect.source} -> ${redirect.destination} (covered by ${cover.source} -> ${cover.destination})`);
    continue;
  }

  if (redirect.source.includes(':') || redirect.source.includes('*')) {
    continue;
  }

  let response;
  try {
    response = await fetch(`${baseUrl}${redirect.source}`, { redirect: 'manual' });
  } catch (error) {
    failures.push(`${redirect.source}: request failed: ${error.message}`);
    continue;
  }

  const status = expectedStatus(redirect);
  const location = response.headers.get('location');
  const locationPath = normalizePath(location);
  const destinationPath = normalizePath(redirect.destination);

  if (response.status !== status) {
    failures.push(`${redirect.source}: expected ${status}, got ${response.status}`);
  }

  if (locationPath !== destinationPath) {
    failures.push(`${redirect.source}: expected location ${redirect.destination}, got ${location || 'missing'}`);
  }
}

if (failures.length > 0) {
  console.error(`Launch redirect check failed against ${baseUrl}`);
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`Launch redirect check passed against ${baseUrl}`);
console.log(`Checked ${launchRedirects.length} configured redirects.`);
if (dormant.length > 0) {
  console.log(
    `${dormant.length} dormant: an earlier rule covers them today, and they hold the destination for when it lifts.`,
  );
  for (const entry of dormant) {
    console.log(`- ${entry}`);
  }
}
