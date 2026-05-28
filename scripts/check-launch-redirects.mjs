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

for (const redirect of launchRedirects) {
  if (!redirect.source || !redirect.destination) {
    failures.push(`redirect entry is missing source or destination: ${JSON.stringify(redirect)}`);
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
