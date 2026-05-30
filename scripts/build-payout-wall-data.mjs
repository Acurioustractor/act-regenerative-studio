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
      .select('name, total_giving_annual, open_programs, foundation_power_profiles(reportable_in_power_map, capital_source_class)')
      .gt('total_giving_annual', 0)
      .order('total_giving_annual', { ascending: false })
      .order('id', { ascending: true }) // unique tiebreaker: deterministic offset pagination across ties in total_giving_annual
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
const totalGivingB = +(giving.reduce((a, b) => a + b, 0) / 1e9).toFixed(2);

// How many entities, ranked by giving, it takes to reach half the total.
const nToHalf = (vals) => {
  const tot = vals.reduce((a, b) => a + b, 0);
  let cum = 0;
  for (let i = 0; i < vals.length; i++) {
    cum += vals[i];
    if (cum >= tot * 0.5) return i + 1;
  }
  return vals.length;
};

// Confirmed-grantmaker cut: reportable + a known capital_source_class (excludes
// the 'unknown'-class aid charities/universities that top the raw giving list).
// Computed in-pipeline so "N control half" is data-driven, not a magic number.
const GRANTMAKER_CLASSES = new Set([
  'corporate_foundation', 'family_trust', 'institutional_endowment', 'community_foundation', 'ancillary_fund',
]);
const profileOf = (r) =>
  Array.isArray(r.foundation_power_profiles) ? r.foundation_power_profiles[0] : r.foundation_power_profiles;
const grantmakers = rows.filter((r) => {
  const p = profileOf(r);
  return p && p.reportable_in_power_map === true && GRANTMAKER_CLASSES.has(p.capital_source_class);
});
const gmGiving = grantmakers.map((r) => Number(r.total_giving_annual)).sort((a, b) => b - a);
const giversToHalf = nToHalf(giving); // giving is already sorted descending
const grantmakerToHalf = nToHalf(gmGiving);
const grantmakerTotalB = +(gmGiving.reduce((a, b) => a + b, 0) / 1e9).toFixed(2);
const grantmakerTop = grantmakers.slice(0, 6).map((r) => r.name);
// Named cells: top confirmed grantmakers by giving (clean cut; excludes the
// operating-charity and university mislabels that top the raw giving list). The
// wall's 10,133 cell brightnesses stay in `giving`; only the named list is filtered.
const top = grantmakers.slice(0, 45).map((r) => ({ name: r.name, g: Math.round(Number(r.total_giving_annual)) }));

const out = {
  meta: {
    runDate: new Date().toISOString().slice(0, 10),
    source: 'CivicGraph / Supabase tednluwflfhxyucgwigh (foundations + acnc_ais)',
    note: 'Giving + openness are computed live at build time. Hoard/dead-zone/gini/share are carried from the 2026-05-29 provenance lock (re-verify before publishing). See grantscope/output/foundation-power.provenance.md.',
  },
  // Locked, verified figures (re-run by hand 2026-05-29). Hardcoded the financial
  // cuts (hoard/dead) so the page never needs the acnc_ais join at build time.
  stats: {
    nGivers: rows.length,
    totalGivingB,
    top45SharePct: 50.1,
    top100SharePct: 66.7,
    gini: 0.9482,
    giversToHalf,
    grantmakerN: grantmakers.length,
    grantmakerTotalB,
    grantmakerToHalf,
    grantmakerTop,
    openCount: openIdx.length,
    pctNoOpenDoor: +((100 * (rows.length - openIdx.length)) / rows.length).toFixed(2),
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
  top, // top 45 confirmed grantmakers by giving, named (public entities; clean cut)
  deadZone: { count: 2257, capitalB: 15.64 },
};

writeFileSync('public/confessions/payout-wall.json', JSON.stringify(out));
console.log('wrote public/confessions/payout-wall.json');
console.log('  givers:', rows.length, '| open:', openIdx.length, '| total giving $B:', totalGivingB, '| top giver:', top[0]?.name);
