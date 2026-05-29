// Builds the static data snapshot for The Payout Wall (/art/the-payout-wall).
// Reads CivicGraph foundations from Supabase (project tednluwflfhxyucgwigh) and
// writes public/confessions/payout-wall.json. Numbers reconcile with
// grantscope/output/foundation-power.provenance.md (verified 2026-05-29).
// Run: node scripts/build-payout-wall-data.mjs
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';
import { writeFileSync } from 'node:fs';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}
console.log('Supabase host:', url.replace('https://', '').split('.')[0]);
const sb = createClient(url, key, { auth: { persistSession: false } });

async function fetchAllGivers() {
  const out = [];
  const PAGE = 1000;
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await sb
      .from('foundations')
      .select('name, total_giving_annual, open_programs')
      .gt('total_giving_annual', 0)
      .order('total_giving_annual', { ascending: false })
      .range(from, from + PAGE - 1);
    if (error) { console.error('query error:', error.message); process.exit(1); }
    out.push(...data);
    if (data.length < PAGE) break;
  }
  return out;
}

const rows = await fetchAllGivers();
const giving = rows.map((r) => Math.round(Number(r.total_giving_annual)));
const openIdx = [];
rows.forEach((r, i) => {
  const op = r.open_programs;
  if (Array.isArray(op) && op.length > 0) openIdx.push(i);
});
const top = rows.slice(0, 45).map((r) => ({ name: r.name, g: Math.round(Number(r.total_giving_annual)) }));
const totalGivingB = +(giving.reduce((a, b) => a + b, 0) / 1e9).toFixed(2);

const out = {
  meta: {
    runDate: '2026-05-29',
    source: 'CivicGraph / Supabase tednluwflfhxyucgwigh (foundations + acnc_ais)',
    note: 'Annual giving across the AI-enriched foundation set. Hoard + dead-zone are the reportable_in_power_map cut from acnc_ais. See grantscope/output/foundation-power.provenance.md.',
  },
  // Locked, verified figures (re-run by hand 2026-05-29). Hardcoded the financial
  // cuts (hoard/dead) so the page never needs the acnc_ais join at build time.
  stats: {
    nGivers: rows.length,
    totalGivingB,
    top45SharePct: 50.1,
    top100SharePct: 66.7,
    gini: 0.9482,
    openCount: openIdx.length,
    pctNoOpenDoor: +((100 * (rows.length - openIdx.length)) / rows.length).toFixed(2),
    onlyOpenInTop15: 1,
    hoardTotalB: 60.1,
    hoardUnder5B: 43.34,
    hoardUnder5Pct: 72.1,
    deadCapitalB: 15.64,
    deadCount: 2257,
    tracedM: 415.5,
    pctUntraceable: 96.8,
  },
  giving, // sorted descending, one number per foundation
  openIdx, // indices into `giving` that publish an open application program
  top, // the 45 that give half, named (public entities)
  deadZone: { count: 2257, capitalB: 15.64 },
};

writeFileSync('public/confessions/payout-wall.json', JSON.stringify(out));
console.log('wrote public/confessions/payout-wall.json');
console.log('  givers:', rows.length, '| open:', openIdx.length, '| total giving $B:', totalGivingB, '| top giver:', top[0]?.name);
