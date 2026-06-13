import Link from 'next/link';
import { projects } from '@/data/projects';
import { getArtProjectConfigs } from '@/lib/art/art-portfolio';
import {
  EcosystemConstellation,
  type ConstellationNode,
  type ConstellationArtLink,
} from '@/components/ecosystem/EcosystemConstellation';
import { pageMetadata } from '@/lib/seo/site';

export const metadata = pageMetadata({
  title: 'The living map',
  description:
    'One studio, many fields. An interactive map of how A Curious Tractor projects connect across Country, partners, and the art made within them.',
  path: '/ecosystem/map',
});

/** The five flagships route to their own top-level hubs. */
const FLAGSHIP_ROUTES: Record<string, string> = {
  'empathy-ledger': '/empathy-ledger',
  justicehub: '/justicehub',
  'the-harvest': '/harvest',
  goods: '/goods',
  'black-cockatoo-valley': '/farm',
};

export default function EcosystemMapPage() {
  // Map artworks back onto the project they were made within.
  const artByProject = new Map<string, ConstellationArtLink[]>();
  for (const art of getArtProjectConfigs()) {
    const href = art.connectedProjectHref || '';
    const m = href.match(/^\/projects\/([^/]+)$/);
    if (!m) continue;
    const slug = m[1];
    if (!artByProject.has(slug)) artByProject.set(slug, []);
    artByProject.get(slug)!.push({ title: art.title, href: `/art/${art.slug}` });
  }

  const nodes: ConstellationNode[] = projects.map((p) => ({
    slug: p.slug,
    title: p.title,
    tagline: p.tagline,
    theme: p.theme,
    href: FLAGSHIP_ROUTES[p.slug] || `/projects/${p.slug}`,
    isFlagship: Boolean(FLAGSHIP_ROUTES[p.slug]),
    orgSlug: p.empathyLedger?.orgSlug ?? null,
    connectedArt: artByProject.get(p.slug) ?? [],
  }));

  return (
    <div className="space-y-12 pb-24">
      <header className="space-y-4 pt-4">
        <Link
          href="/ecosystem"
          className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--we-brown-deep)] hover:text-[var(--we-olive)]"
        >
          &larr; The ecosystem
        </Link>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--we-brown-deep)]">
          The living map
        </p>
        <h1 className="max-w-3xl font-[var(--font-display)] text-[clamp(2rem,4vw,3.2rem)] font-semibold leading-[1.08] text-[var(--we-olive)]">
          It starts with Country, and everything connects from there.
        </h1>
        <p className="max-w-2xl text-base leading-7 text-[var(--we-olive-deep)]">
          A Curious Tractor is one studio working across many fields. This map
          shows how the work connects: the field each project sits in, the
          partners it shares with others, and the art made within it. Hover or
          select any point to follow a thread.
        </p>
      </header>

      <EcosystemConstellation nodes={nodes} />

      <p className="text-xs text-[var(--we-brown-deep)]">
        Connections are drawn from shared partner organisations and the studio
        works linked to each project. This is a prototype view of the wider
        ecosystem.
      </p>
    </div>
  );
}
