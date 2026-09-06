#!/usr/bin/env node
// Fails when src/data/art-pieces.generated.json is behind the record + wiki.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const committed = 'src/data/art-pieces.generated.json';
const tmp = join(mkdtempSync(join(tmpdir(), 'art-record-')), 'art.json');
execFileSync('node', ['scripts/sync-art-pieces.mjs'], { stdio: ['ignore', 'ignore', 'inherit'], env: { ...process.env, ART_PIECES_OUTPUT: tmp } });
if (!existsSync(tmp)) { console.log('art record: infra not beside this repo, nothing to compare'); process.exit(0); }
const strip = (raw) => { const j = JSON.parse(raw); delete j.generatedAt; delete j.sourceConfigPath; return j; };
const fresh = strip(readFileSync(tmp, 'utf8')), cur = strip(readFileSync(committed, 'utf8'));
if (fresh.pieceCount === 0) { console.error('art record: fresh snapshot is empty, refusing to compare'); process.exit(1); }
if (JSON.stringify(fresh) === JSON.stringify(cur)) { console.log(`art record: ${committed} matches (${fresh.pieceCount} pieces)`); process.exit(0); }
const by = (j) => new Map(j.pieces.map((p) => [p.slug, JSON.stringify(p)]));
const a = by(fresh), b = by(cur);
const diff = [...new Set([...a.keys(), ...b.keys()])].filter((s) => a.get(s) !== b.get(s));
console.error(`art record: ${committed} is behind. ${diff.length} piece(s) differ: ${diff.join(' ')}\nrun: npm run sync:art-pieces`);
process.exit(1);
