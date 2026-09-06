'use client';

/**
 * EcosystemConstellation
 *
 * An accessible, dependency-free relationship map of the ACT ecosystem.
 * Each project is a node; selecting one reveals its connective tissue:
 * the field (theme) it sits in, the partner organisations it shares with
 * other projects, and the artworks made within it.
 *
 * This is the "relationship matrix" pattern (Bangarra Knowledge Ground):
 * the whole portfolio reads as one studio, and the visitor travels it by
 * relationship rather than a flat list. No external libraries, no WebGL.
 * Keyboard navigable, screen-reader friendly, and reduced-motion aware.
 */

import { useMemo, useState } from 'react';
import Link from 'next/link';

export interface ConstellationArtLink {
  title: string;
  href: string;
}

export interface ConstellationNode {
  slug: string;
  title: string;
  tagline: string;
  theme: string;
  href: string;
  isFlagship: boolean;
  orgSlug: string | null;
  connectedArt: ConstellationArtLink[];
}

interface ThemeMeta {
  label: string;
  /** node + edge accent colour (forest / earth palette) */
  color: string;
}

const THEME_META: Record<string, ThemeMeta> = {
  earth: { label: 'Story & Country', color: '#6B8E5A' },
  justice: { label: 'Justice & healing', color: '#B5713A' },
  goods: { label: 'Goods on Country', color: '#A8893F' },
  valley: { label: 'Land & stewardship', color: '#3F7D5C' },
  harvest: { label: 'Harvest & gathering', color: '#7E9B4E' },
};

const THEME_ORDER = ['valley', 'earth', 'justice', 'goods', 'harvest'];

/** Partner orgs that legitimately span projects. The parent org connects
 * everything, so it is excluded from the connective-tissue graph. */
const GENERIC_ORG = 'a-curious-tractor';

const PARTNER_LABELS: Record<string, string> = {
  'smart-recovery': 'SMART Recovery',
  'palm-island-community-company': 'Palm Island Community Company',
  oonchiumpa: 'Oonchiumpa',
  mmeic: 'Minjerribah Moorgumpin Elders-In-Council',
  justicehub: 'JusticeHub',
};

interface Positioned extends ConstellationNode {
  x: number; // 0..100
  y: number; // 0..100
}

function layout(nodes: ConstellationNode[]): Positioned[] {
  // Group nodes by theme, place each theme cluster around a central ring,
  // flagship at the cluster centre and the rest on a small orbit.
  const byTheme = new Map<string, ConstellationNode[]>();
  for (const t of THEME_ORDER) byTheme.set(t, []);
  for (const n of nodes) {
    if (!byTheme.has(n.theme)) byTheme.set(n.theme, []);
    byTheme.get(n.theme)!.push(n);
  }

  const themes = [...byTheme.keys()].filter((t) => byTheme.get(t)!.length > 0);
  const cx = 50;
  const cy = 50;
  const clusterR = 31; // distance of cluster centres from the middle
  const positioned: Positioned[] = [];

  themes.forEach((theme, ti) => {
    const members = byTheme.get(theme)!;
    // cluster centre on the main ring (start at top, go clockwise)
    const ca = (-90 + (360 / themes.length) * ti) * (Math.PI / 180);
    const ccx = cx + clusterR * Math.cos(ca);
    const ccy = cy + clusterR * Math.sin(ca);

    // flagship to the cluster centre, others on an orbit around it
    const flagship = members.find((m) => m.isFlagship);
    const others = members.filter((m) => !m.isFlagship);

    if (flagship) positioned.push({ ...flagship, x: ccx, y: ccy });

    const orbit = Math.min(15, 6 + others.length * 1.1);
    others.forEach((m, oi) => {
      const oa = (-90 + (360 / Math.max(others.length, 1)) * oi) * (Math.PI / 180);
      positioned.push({
        ...m,
        x: ccx + orbit * Math.cos(oa),
        y: ccy + orbit * Math.sin(oa),
      });
    });
  });

  return positioned;
}

interface Edge {
  a: string;
  b: string;
  org: string;
}

function partnerEdges(nodes: ConstellationNode[]): Edge[] {
  const groups = new Map<string, ConstellationNode[]>();
  for (const n of nodes) {
    if (!n.orgSlug || n.orgSlug === GENERIC_ORG) continue;
    if (!groups.has(n.orgSlug)) groups.set(n.orgSlug, []);
    groups.get(n.orgSlug)!.push(n);
  }
  const edges: Edge[] = [];
  for (const [org, members] of groups) {
    if (members.length < 2) continue;
    // star topology from the first member keeps the graph readable
    const hub = members[0];
    for (let i = 1; i < members.length; i++) {
      edges.push({ a: hub.slug, b: members[i].slug, org });
    }
  }
  return edges;
}

export function EcosystemConstellation({ nodes }: { nodes: ConstellationNode[] }) {
  const positioned = useMemo(() => layout(nodes), [nodes]);
  const edges = useMemo(() => partnerEdges(nodes), [nodes]);
  const posBySlug = useMemo(() => {
    const m = new Map<string, Positioned>();
    for (const p of positioned) m.set(p.slug, p);
    return m;
  }, [positioned]);

  const [active, setActive] = useState<string | null>(null);

  const connected = useMemo(() => {
    const set = new Set<string>();
    if (!active) return set;
    for (const e of edges) {
      if (e.a === active) set.add(e.b);
      if (e.b === active) set.add(e.a);
    }
    return set;
  }, [active, edges]);

  const selected = active ? posBySlug.get(active) ?? null : null;
  const selectedPartners = selected
    ? positioned.filter(
        (n) =>
          n.slug !== selected.slug &&
          n.orgSlug &&
          n.orgSlug !== GENERIC_ORG &&
          n.orgSlug === selected.orgSlug
      )
    : [];

  return (
    <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
      {/* Constellation canvas */}
      <div
        className="relative aspect-[4/3] w-full rounded-[28px] border border-[var(--we-sand)] bg-[#FBF8F1]"
        role="group"
        aria-label="Interactive map of how ACT projects connect"
      >
        {/* edge layer */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {edges.map((e, i) => {
            const a = posBySlug.get(e.a);
            const b = posBySlug.get(e.b);
            if (!a || !b) return null;
            const lit = active && (e.a === active || e.b === active);
            const dim = active && !lit;
            return (
              <line
                key={`${e.a}-${e.b}-${i}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={lit ? '#3F7D5C' : '#C9BBA0'}
                strokeWidth={lit ? 0.55 : 0.3}
                strokeOpacity={dim ? 0.12 : lit ? 0.9 : 0.4}
                className="motion-safe:transition-all motion-safe:duration-300"
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        </svg>

        {/* node layer */}
        {positioned.map((n) => {
          const meta = THEME_META[n.theme] ?? { label: n.theme, color: '#6B8E5A' };
          const isActive = active === n.slug;
          const isLinked = connected.has(n.slug);
          const dimmed = active && !isActive && !isLinked;
          const size = n.isFlagship ? 'h-4 w-4' : 'h-2.5 w-2.5';
          return (
            <button
              key={n.slug}
              type="button"
              onMouseEnter={() => setActive(n.slug)}
              onFocus={() => setActive(n.slug)}
              onClick={() => setActive((cur) => (cur === n.slug ? null : n.slug))}
              aria-pressed={isActive}
              aria-label={`${n.title}${n.isFlagship ? ' (flagship)' : ''}. ${meta.label} field. ${
                isActive ? 'Selected.' : 'Select to see connections.'
              }`}
              className="group absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full p-1 outline-none focus-visible:ring-2 focus-visible:ring-[#3F7D5C] focus-visible:ring-offset-1"
              style={{
                left: `${n.x}%`,
                top: `${n.y}%`,
                opacity: dimmed ? 0.3 : 1,
              }}
            >
              <span
                className={`block rounded-full ring-1 ring-white motion-safe:transition-transform motion-safe:duration-200 group-hover:scale-125 ${size} ${
                  isActive ? 'scale-150' : ''
                }`}
                style={{ backgroundColor: meta.color }}
              />
              {n.isFlagship && (
                <span className="pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--we-olive)]">
                  {n.title}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Detail / legend panel */}
      <div className="flex flex-col gap-5">
        {selected ? (
          <div className="rounded-[24px] border border-[var(--we-sand)] bg-white p-6">
            <p
              className="text-xs font-semibold uppercase tracking-[0.2em]"
              style={{ color: (THEME_META[selected.theme] ?? { color: '#6B8E5A' }).color }}
            >
              {(THEME_META[selected.theme] ?? { label: selected.theme }).label}
              {selected.isFlagship ? ' · flagship' : ''}
            </p>
            <h3 className="mt-2 font-[var(--font-display)] text-2xl font-semibold text-[var(--we-olive)]">
              {selected.title}
            </h3>
            <p className="mt-2 text-sm leading-7 text-[var(--we-olive-deep)]">
              {selected.tagline}
            </p>

            {selectedPartners.length > 0 && (
              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--we-brown-deep)]">
                  Shares a partner with
                  {selected.orgSlug && PARTNER_LABELS[selected.orgSlug]
                    ? ` ${PARTNER_LABELS[selected.orgSlug]}`
                    : ''}
                </p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {selectedPartners.map((p) => (
                    <li key={p.slug}>
                      <button
                        type="button"
                        onClick={() => setActive(p.slug)}
                        className="rounded-full border border-[var(--we-sand)] bg-[var(--warm-paper-bright)] px-3 py-1 text-xs text-[var(--we-olive)] transition hover:border-[var(--warm-sage)]"
                      >
                        {p.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {selected.connectedArt.length > 0 && (
              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--we-brown-deep)]">
                  Art made within it
                </p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {selected.connectedArt.map((a) => (
                    <li key={a.href}>
                      <Link
                        href={a.href}
                        className="rounded-full border border-[#2F2A25] bg-[#171612] px-3 py-1 text-xs text-[var(--warm-cream)] transition hover:border-[var(--warm-gold)]"
                      >
                        {a.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Link
              href={selected.href}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-forest px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-forest-deep"
            >
              Open {selected.title}
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        ) : (
          <div className="rounded-[24px] border border-dashed border-[var(--we-sand)] bg-white/60 p-6">
            <h3 className="font-[var(--font-display)] text-xl font-semibold text-[var(--we-olive)]">
              One studio, many fields
            </h3>
            <p className="mt-2 text-sm leading-7 text-[var(--we-olive-deep)]">
              Hover or select any point to see how the work connects: the field
              it sits in, the partners it shares with other projects, and the art
              made within it. Larger points are the five flagships.
            </p>
          </div>
        )}

        {/* Legend */}
        <div className="rounded-[24px] border border-[var(--we-sand)] bg-white/70 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--we-brown-deep)]">
            Fields of work
          </p>
          <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {THEME_ORDER.filter((t) => positioned.some((n) => n.theme === t)).map((t) => (
              <li key={t} className="flex items-center gap-2 text-sm text-[var(--we-olive-deep)]">
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: (THEME_META[t] ?? { color: '#6B8E5A' }).color }}
                />
                {(THEME_META[t] ?? { label: t }).label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
