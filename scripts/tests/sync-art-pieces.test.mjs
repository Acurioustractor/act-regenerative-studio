import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildPiece, parseFrontmatter } from '../sync-art-pieces.mjs';

const projects = {
  'ACT-JH': { code: 'ACT-JH', name: 'JusticeHub', canonical_slug: 'justicehub' },
  'ACT-CN': { code: 'ACT-CN', name: 'Contained', canonical_slug: 'contained', description: 'fallback', empathy_ledger: { project_key: 'contained' },
    art: { media: ['installation'], tags: ['immersive'], piece_slug: 'contained', status: 'active', lcaa_stages: ['Art'], connected_code: 'ACT-JH', slug_aliases: ['old-contained'] } },
};

test('frontmatter: block scalars and quoted scalars', () => {
  const fm = parseFrontmatter('---\ntitle: CONTAINED\nquote: |\n  Step inside\n  what we fund\nart_year: "2022–present"\n---\nbody');
  assert.equal(fm.title, 'CONTAINED');
  assert.equal(fm.quote, 'Step inside\nwhat we fund');
  assert.equal(fm.art_year, '2022–present');
});

test('piece: wiki prose over record fallback, connected project resolved to a live public path', () => {
  const p = buildPiece(projects['ACT-CN'], projects, { title: 'CONTAINED', quote: 'q', summary: 's', philosophy: 'ph' });
  assert.equal(p.title, 'CONTAINED');
  assert.equal(p.description, 's');
  assert.equal(p.connectedProject, 'JusticeHub');
  assert.equal(p.connectedProjectHref, '/fields/justice');
  assert.deepEqual(p.elSlugs, ['contained', 'old-contained']);
  assert.deepEqual(p.aliases, ['old-contained']);
});

// Control: a connected project with no live public route must not get a link,
// and missing wiki prose falls back to the record, never to an empty title.
test('control: no public route means no href; no wiki page means record fallback', () => {
  const projs = { ...projects, 'ACT-CP': { code: 'ACT-CP', name: 'Community Capital', canonical_slug: 'community-capital' } };
  const art = { ...projects['ACT-CN'], art: { ...projects['ACT-CN'].art, connected_code: 'ACT-CP' } };
  const p = buildPiece(art, projs, {});
  assert.equal(p.connectedProject, 'Community Capital');
  assert.equal(p.connectedProjectHref, null);
  assert.equal(p.title, 'Contained');
  assert.equal(p.description, 'fallback');
  assert.equal(p.quote, '');
});
