#!/usr/bin/env node

/**
 * Build a newsletter issue into send-ready HTML for GoHighLevel.
 *
 * An issue is a directory under emails/issues/<slug>/ containing meta.json
 * ({ title, preheader, eyebrow }) and content.html (the body fragment:
 * h2 / p / blockquote / a using inherited styles). Output lands at
 * emails/issues/<slug>/dist.html — paste into a GHL email campaign.
 *
 * Usage: node emails/build.mjs <slug>
 */

import fs from 'node:fs';
import path from 'node:path';

const slug = process.argv[2];
if (!slug) {
  console.error('Usage: node emails/build.mjs <issue-slug>');
  process.exit(1);
}

const root = path.dirname(new URL(import.meta.url).pathname);
const issueDir = path.join(root, 'issues', slug);
const meta = JSON.parse(fs.readFileSync(path.join(issueDir, 'meta.json'), 'utf8'));
const content = fs.readFileSync(path.join(issueDir, 'content.html'), 'utf8');
const master = fs.readFileSync(path.join(root, 'master.html'), 'utf8');

const html = master
  .replaceAll('{{TITLE}}', meta.title)
  .replaceAll('{{PREHEADER}}', meta.preheader || '')
  .replaceAll('{{EYEBROW}}', meta.eyebrow || 'From the paddock')
  .replace('{{CONTENT}}', content);

const out = path.join(issueDir, 'dist.html');
fs.writeFileSync(out, html);
console.log(`built ${out}`);
