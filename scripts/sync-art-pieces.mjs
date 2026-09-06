#!/usr/bin/env node
/**
 * Art pieces for /art, from two sources and nothing typed in:
 *   identity  config/project-codes.json via @act/projects (art block, connected project, EL key)
 *   prose     each piece's wiki page frontmatter (quote, summary, philosophy, impact, art_year, art_location)
 * Output: src/data/art-pieces.generated.json. Runs in the build chain; when the infra
 * checkout is not beside this repo (Vercel) it keeps the committed file.
 *
 * Env: ACT_PROJECT_CODES_PATH (default ../act-global-infrastructure/config/project-codes.json)
 */
import fs from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export const ART_PIECES_OUTPUT_PATH = path.resolve(process.cwd(), 'src/data/art-pieces.generated.json');
const outputPath = process.env.ART_PIECES_OUTPUT || ART_PIECES_OUTPUT_PATH;
const configPath = process.env.ACT_PROJECT_CODES_PATH || path.resolve(process.cwd(), '../act-global-infrastructure/config/project-codes.json');
const repoRoot = path.resolve(path.dirname(configPath), '..');
const packageEntry = path.join(repoRoot, 'packages/act-projects/src/index.mjs');
const wikiEntry = path.join(repoRoot, 'packages/act-projects/src/wiki.mjs');

/** Public home of the project a work sits inside. Only routes that are live; a missing entry renders the name without a link. */
export const PUBLIC_PATH_BY_CODE = {
  'ACT-JH': '/fields/justice',
  'ACT-EL': '/fields/empathy',
  'ACT-GD': '/fields/goods',
  'ACT-HV': '/harvest',
  'ACT-CS': 'https://civicgraph.app',
  'ACT-PI': 'https://picc.studio',
  'ACT-CTP': '/confessions',
};

export function parseFrontmatter(markdown) {
  const m = markdown.match(/^---\n([\s\S]*?)\n---\n/);
  const fm = {};
  if (!m) return fm;
  const lines = m[1].split('\n');
  for (let i = 0; i < lines.length; i++) {
    const kv = lines[i].match(/^([a-z_]+):\s*(.*)$/);
    if (!kv) continue;
    if (kv[2] === '|') {
      const buf = [];
      while (i + 1 < lines.length && lines[i + 1].startsWith('  ')) buf.push(lines[++i].slice(2));
      fm[kv[1]] = buf.join('\n').trim();
    } else fm[kv[1]] = kv[2].replace(/^"(.*)"$/, '$1').trim();
  }
  return fm;
}

/** Record art status -> the studio's vocabulary; retired pieces are dropped by the caller. */
export const STATUS_MAP = { exhibited: 'exhibited', active: 'active', ideation: 'ideation', concept: 'concept', retired: 'retired' };

export function buildPiece(project, projects, fm) {
  const art = project.art;
  const connected = art.connected_code ? projects[art.connected_code] : null;
  return {
    code: project.code,
    slug: art.piece_slug,
    aliases: art.slug_aliases || [],
    title: fm.title || project.name,
    quote: fm.quote || '',
    description: fm.summary || project.description || '',
    philosophy: fm.philosophy || null,
    impact: fm.impact || null,
    mediums: art.media,
    tags: art.tags || [],
    status: STATUS_MAP[art.status] || 'active',
    lcaaStages: art.lcaa_stages || [],
    year: fm.art_year || art.year || null,
    location: fm.art_location || art.location || null,
    connectedProject: connected ? connected.name : null,
    connectedProjectCode: art.connected_code || null,
    connectedProjectHref: art.connected_code ? PUBLIC_PATH_BY_CODE[art.connected_code] || null : null,
    elSlugs: [...new Set([project.empathy_ledger?.project_key, art.piece_slug, ...(art.slug_aliases || []), project.canonical_slug, ...(project.empathy_ledger?.partner_codes || [])].filter(Boolean))],
    elTracked: project.empathy_ledger?.tracked !== false,
    wikiPath: art.wiki_path || null,
  };
}

async function main() {
  if (!existsSync(packageEntry)) {
    console.warn(`art pieces: @act/projects not found at ${packageEntry}; keeping ${outputPath}`);
    return;
  }
  const { loadProjects, artPieces } = await import(pathToFileURL(packageEntry).href);
  const { indexWiki } = await import(pathToFileURL(wikiEntry).href);
  const { projects } = loadProjects({ path: configPath, repoRoot });
  const wiki = indexWiki(repoRoot);
  const pieces = [];
  for (const p of artPieces(projects)) {
    const wikiPath = p.art.wiki_path || (wiki.get(p.art.piece_slug) || [])[0];
    const fm = wikiPath ? parseFrontmatter(readFileSync(path.join(repoRoot, wikiPath), 'utf8')) : {};
    const piece = buildPiece(p, projects, fm);
    piece.wikiPath = wikiPath || null;
    if (piece.status === 'retired') continue;
    pieces.push(piece);
  }
  pieces.sort((a, b) => a.title.localeCompare(b.title));
  const snapshot = { generatedAt: new Date().toISOString(), sourceConfigPath: configPath, pieceCount: pieces.length, pieces };
  await fs.writeFile(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`);
  console.log(`art pieces: wrote ${pieces.length} to ${outputPath}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => { console.error(err); process.exit(1); });
}
