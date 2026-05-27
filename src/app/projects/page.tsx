import Link from 'next/link';
import Image from 'next/image';

import SectionHeading from '@/components/SectionHeading';
import { ProjectShowcaseCard } from '@/components/showcase/ProjectShowcaseCard';
import { RoadmapTimeline } from '@/components/showcase/RoadmapTimeline';
import { getHomeEditorialFeature } from '@/lib/empathy-ledger-editorial';
import { buildCuratedProjectCards } from '@/lib/projects/build-curated-project-cards';
import { getCanonicalWikiProjectRecords } from '@/lib/wiki/canonical-project-wiki';
import { getFlagshipProjectPacks } from '@/lib/wiki/flagship-project-packs';
import { buildProjectIndexSignals } from '@/lib/projects/build-project-index-signals';
import { pageMetadata } from '@/lib/seo/site';
import { cleanPublicBrandText } from '@/lib/brand/public-copy';

export const metadata = pageMetadata({
  title: "Projects",
  description:
    "The public fields of practice at ACT, land, food, goods, justice, story, art. What the work looks like on the ground.",
  path: "/projects",
});

type ProjectStatus = 'active' | 'planning' | 'development';
type LCAAPhase = 'listen' | 'curiosity' | 'action' | 'art';

interface FeaturedProjectConfig {
  slug: string;
  repo: string | null;
  url: string | null;
  status: ProjectStatus;
  lcaaPhase: LCAAPhase;
  tags: string[];
  contributionAreas: string[];
}

interface ShowcaseProject {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  hubHref: string;
  repo: string | null;
  url: string | null;
  status: ProjectStatus;
  lcaaPhase: LCAAPhase;
  tags: string[];
  contributionAreas: string[];
  previewMedia?: {
    kind: 'image' | 'video';
    url: string;
    posterUrl?: string | null;
    alt: string;
  };
  supportingMedia?: Array<{
    url: string;
    alt: string;
    eyebrow?: string;
  }>;
  mediaEmphasis?: boolean;
  liveSignals?: {
    serviceConnectionCount: number;
    totalWorkCount: number;
    storyCount: number;
    mediaCount: number;
  };
}

const FEATURED_OUTPUTS: FeaturedProjectConfig[] = [
  {
    slug: 'justicehub',
    repo: 'Acurioustractor/justicehub-platform',
    url: 'https://justicehub.com.au',
    status: 'development',
    lcaaPhase: 'curiosity',
    tags: ['Justice', 'Evidence', 'Community authority', 'Policy'],
    contributionAreas: ['Backend', 'Frontend', 'Research'],
  },
  {
    slug: 'goods',
    repo: 'Acurioustractor/goods-asset-tracker',
    url: null,
    status: 'active',
    lcaaPhase: 'action',
    tags: ['Circular economy', 'Manufacturing', 'Health', 'Procurement'],
    contributionAreas: ['Frontend', 'Backend', 'Research'],
  },
  {
    slug: 'the-harvest',
    repo: 'Acurioustractor/theharvest',
    url: null,
    status: 'active',
    lcaaPhase: 'action',
    tags: ['Enterprise', 'Makers', 'Markets', 'Community'],
    contributionAreas: ['Design', 'Content', 'Documentation'],
  },
  {
    slug: 'empathy-ledger',
    repo: 'Acurioustractor/empathy-ledger-v2',
    url: 'https://empathyledger.com',
    status: 'development',
    lcaaPhase: 'action',
    tags: ['Narrative sovereignty', 'Consent', 'Stories', 'OCAP'],
    contributionAreas: ['Frontend', 'Design', 'Documentation'],
  },
  {
    slug: 'black-cockatoo-valley',
    repo: null,
    url: null,
    status: 'active',
    lcaaPhase: 'listen',
    tags: ['Country', 'Conservation', 'Residencies', 'Stewardship'],
    contributionAreas: ['Research', 'Design', 'Documentation'],
  },
];

const HIDDEN_PROJECT_SLUGS = new Set(['act-public-voice']);

const DOMAIN_BADGE_STYLES: Record<string, string> = {
  Active: 'border-[#8CB58B] bg-[#E5F4E4] text-[#2F5233]',
  Ideation: 'border-[#D7C4A2] bg-[#FFF7E9] text-[#8B6914]',
  Ecosystem: 'border-[#D9C9A9] bg-[#F5F1E8] text-[#5A4A3A]',
  Place: 'border-[#A2C5A2] bg-[#EEF7EE] text-[#2F5233]',
  Satellite: 'border-[#C7D3E8] bg-[#EFF4FB] text-[#385780]',
  Studio: 'border-[#E1C8E8] bg-[#F7EFFA] text-[#6B4D6B]',
};

function compactBadgeLabel(value: string | null | undefined) {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  if (/coming soon|placeholder|still being prepared|still being surfaced/i.test(trimmed)) {
    return 'In development';
  }
  if (trimmed.length > 28) {
    return cleanPublicBrandText(trimmed.split(/[—-]/)[0]?.trim()) || 'Active';
  }
  return cleanPublicBrandText(trimmed);
}

function excerptToTagline(value: string | null, fallback: string): string {
  if (!value) return fallback;
  const cleanValue = cleanPublicBrandText(value) || value;

  return cleanValue.length > 110 ? `${cleanValue.slice(0, 107).trimEnd()}...` : cleanValue;
}

function descriptionFromOverview(value: string | null, fallback: string): string {
  if (!value) return fallback;
  const cleanValue = cleanPublicBrandText(value) || value;
  return cleanValue.length > 280 ? `${cleanValue.slice(0, 277).trimEnd()}...` : cleanValue;
}

function signalWeight(signals?: {
  serviceConnectionCount: number;
  totalWorkCount: number;
  storyCount: number;
  mediaCount: number;
}) {
  if (!signals) return 0;

  return (
    signals.serviceConnectionCount * 4 +
    signals.totalWorkCount * 3 +
    signals.storyCount * 2 +
    signals.mediaCount
  );
}

export default async function ProjectsPage() {
  const [canonicalProjects, flagshipPacks, signalPayload, homeEditorialFeature, featuredProjectMediaCards] = await Promise.all([
    getCanonicalWikiProjectRecords(),
    getFlagshipProjectPacks(),
    buildProjectIndexSignals(),
    getHomeEditorialFeature(),
    buildCuratedProjectCards(
      FEATURED_OUTPUTS.map((config) => ({
        slug: config.slug,
        href: `/projects/${config.slug}`,
        eyebrow: 'Public field',
        fallbackTitle: config.slug,
        fallbackTagline: 'Canonical ACT project',
        fallbackDescription:
          'Open this project to see the strongest current context, media, and source trail.',
      })),
      { includeMedia: true }
    ),
  ]);
  const flagshipPackBySlug = new Map(flagshipPacks.map((pack) => [pack.slug, pack]));
  const featuredMediaBySlug = new Map(
    featuredProjectMediaCards.map((card) => [card.slug, card])
  );
  const featuredProjectOrder =
    homeEditorialFeature.featuredProjectSlugs.length > 0
      ? homeEditorialFeature.featuredProjectSlugs
      : FEATURED_OUTPUTS.map((item) => item.slug);

  const liveGraphCards = [
    {
      label: 'Ways in',
      value:
        signalPayload.summary.activeServiceCount > 0
          ? String(signalPayload.summary.activeServiceCount)
          : 'Mapped',
      hint:
        signalPayload.summary.activeServiceCount > 0
          ? 'Places to enter, join, or work with the portfolio are already visible.'
          : 'Project entry points are being reviewed through the launch nav and contact paths.',
    },
    {
      label: 'Works in public',
      value: String(signalPayload.summary.featuredWorkCount),
      hint: 'Studio works already sitting alongside the project fields.',
    },
    {
      label: 'Stories in public',
      value: String(signalPayload.summary.totalStorySignals),
      hint: 'Approved story traces arriving through Empathy Ledger.',
    },
    {
      label: 'Images & clips',
      value:
        signalPayload.summary.totalMediaSignals > 0
          ? String(signalPayload.summary.totalMediaSignals)
          : 'Growing',
      hint:
        signalPayload.summary.totalMediaSignals > 0
          ? 'Photos, clips, and media previews already touching the graph.'
          : 'Media coverage is growing unevenly across the public project layer.',
    },
  ];

  const featuredProjects: ShowcaseProject[] = FEATURED_OUTPUTS.map((config) => {
    const wikiRecord = canonicalProjects.find((record) => record.slug === config.slug);
    const flagshipPack = flagshipPackBySlug.get(config.slug);
    const liveSignals = signalPayload.bySlug[config.slug];
    const mediaCard = featuredMediaBySlug.get(config.slug);
    const mediaOverride =
      homeEditorialFeature.featuredProjectMediaOverrides[config.slug];
    const repoUrl =
      flagshipPack?.implementation.primaryRepo?.githubUrl || wikiRecord?.repoUrl || null;

    return {
      slug: config.slug,
      name: cleanPublicBrandText(flagshipPack?.title || wikiRecord?.title || config.slug) || config.slug,
      hubHref: `/projects/${config.slug}`,
      tagline: excerptToTagline(
        flagshipPack?.summary || wikiRecord?.summary || null,
        'Canonical ACT project'
      ),
      description: descriptionFromOverview(
        flagshipPack?.overview ||
          flagshipPack?.whatItIs ||
          flagshipPack?.systemPosition ||
          wikiRecord?.overview ||
          null,
        'This featured ACT output will inherit more context as the wiki keeps growing.'
      ),
      repo: repoUrl
        ? repoUrl.replace('https://github.com/', '')
        : flagshipPack?.implementation.primaryRepo?.github || config.repo,
      url: wikiRecord?.publicSiteUrl || config.url,
      liveSignals: liveSignals
        ? {
            serviceConnectionCount: liveSignals.serviceConnectionCount,
            totalWorkCount: liveSignals.totalWorkCount,
            storyCount: liveSignals.storyCount,
            mediaCount: liveSignals.mediaCount,
          }
        : undefined,
      status: config.status,
      lcaaPhase: config.lcaaPhase,
      tags: config.tags,
      contributionAreas: config.contributionAreas,
      previewMedia: mediaOverride
        ? {
            kind: mediaOverride.kind,
            url: mediaOverride.url,
            posterUrl: mediaOverride.posterUrl || null,
            alt:
              mediaOverride.alt ||
              mediaCard?.previewMedia?.alt ||
              wikiRecord?.title ||
              config.slug,
          }
        : mediaCard?.previewMedia,
      supportingMedia: mediaCard?.supportingMedia,
      mediaEmphasis: homeEditorialFeature.featuredMediaProjectSlugs.includes(config.slug),
    };
  }).sort(
    (left, right) =>
      featuredProjectOrder.indexOf(left.slug) - featuredProjectOrder.indexOf(right.slug)
  );

  const featuredSlugs = new Set(FEATURED_OUTPUTS.map((item) => item.slug));
  const projectIndex = canonicalProjects
    .filter(
    (record) => !featuredSlugs.has(record.slug) && !HIDDEN_PROJECT_SLUGS.has(record.slug)
    )
    .sort((a, b) => {
      const signalDelta =
        signalWeight(signalPayload.bySlug[b.slug]) - signalWeight(signalPayload.bySlug[a.slug]);
      if (signalDelta !== 0) return signalDelta;

      const publicSiteDelta = Number(Boolean(b.publicSiteUrl)) - Number(Boolean(a.publicSiteUrl));
      if (publicSiteDelta !== 0) return publicSiteDelta;

      const repoDelta = Number(Boolean(b.repoUrl)) - Number(Boolean(a.repoUrl));
      if (repoDelta !== 0) return repoDelta;

      const modifiedDelta =
        (Date.parse(b.modifiedAt || '') || 0) - (Date.parse(a.modifiedAt || '') || 0);
      if (modifiedDelta !== 0) return modifiedDelta;

      return a.title.localeCompare(b.title);
    });
  const archivePreview = projectIndex.slice(0, 12);
  const hiddenArchiveCount = Math.max(projectIndex.length - archivePreview.length, 0);
  const archiveProjectsWithSites = projectIndex.filter((project) => project.publicSiteUrl).length;
  const archiveProjectsWithRepos = projectIndex.filter((project) => project.repoUrl).length;

  return (
    <div className="space-y-16">
      <section className="site-surface relative overflow-hidden rounded-[38px] bg-gradient-to-br from-[#f7f1e8] via-[#e9ddca] to-[#d5c09f] p-8 md:p-12">
        <div className="relative grid gap-8 lg:grid-cols-[1.16fr_0.84fr]">
          <div className="space-y-6">
            <p className="site-eyebrow">Projects</p>
            <div className="flex flex-wrap gap-2">
              {[
                `${FEATURED_OUTPUTS.length} flagship projects`,
                `${signalPayload.summary.connectedProjectCount} active projects`,
                'Real outcomes, real partnerships',
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-[#d7c4aa] bg-white/50 px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#5f4f41]"
                >
                  {item}
                </span>
              ))}
            </div>
            <h1 className="max-w-[10ch] font-[var(--font-display)] text-[2.8rem] font-semibold leading-[0.92] text-[#221b15] md:text-[4.45rem]">
              What ACT does in public.
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-[#56483b] md:text-[1.12rem]">
              This is the public portfolio of ACT work: the strongest fields up
              front, visible proof where it exists, and the wider body of work
              behind them. Start here if you want to feel the work before you
              study the system.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="#flagship-projects"
                className="site-glow-link rounded-full bg-[#245c43] px-7 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-white shadow-[0_16px_36px_rgba(36,92,67,0.2)] transition hover:bg-[#1c4935]"
              >
                See flagship projects
              </Link>
              <Link
                href="/stories"
                className="site-glow-link rounded-full border border-[#245c43] bg-white/45 px-7 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-[#1f2b21] transition hover:bg-[#e5f4e4]"
              >
                Read field notes
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="relative min-h-[210px] overflow-hidden rounded-[28px] border border-[#244c39] bg-[#15261d] shadow-[0_24px_60px_rgba(43,31,18,0.2)] sm:col-span-2">
              <Image
                src="/media/field-stills/goods-remote-aerial.jpg"
                alt="Goods on Country field work seen from above"
                fill
                priority
                sizes="(min-width: 1024px) 38vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#15261d]/88 via-[#15261d]/35 to-transparent" />
              <p className="absolute bottom-5 left-5 max-w-xs font-[var(--font-display)] text-2xl font-semibold leading-tight text-[#f5ecde]">
                See the public works before you study the system.
              </p>
            </div>
            <div className="rounded-[28px] border border-[#244c39] bg-[#15261d] p-6 text-[#f5ecde] shadow-[0_24px_60px_rgba(43,31,18,0.2)] sm:col-span-2">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#cfa16b]">
                Start here
              </p>
              <p className="mt-4 font-[var(--font-display)] text-[2rem] font-semibold leading-tight">
                The strongest public fields first.
              </p>
              <p className="mt-3 text-sm leading-7 text-[#d7c8b2]">
                JusticeHub, Goods on Country, The Harvest, Empathy Ledger, and
                Black Cockatoo Valley are the clearest places to see ACT in
                action right now. The rest remain visible as a wider seed set,
                not hidden behind the flagship layer.
              </p>
            </div>
            <div className="rounded-[24px] border border-[#d7c4aa] bg-white/55 p-5">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#6f5c49]">
                Flagship set
              </p>
              <p className="mt-3 text-3xl font-semibold text-[#245c43]">
                {FEATURED_OUTPUTS.length}
              </p>
              <p className="mt-2 text-sm leading-6 text-[#514235]">
                The clearest public fields with their own stronger route and identity.
              </p>
            </div>
            <div className="rounded-[24px] border border-[#d7c4aa] bg-white/55 p-5">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#6f5c49]">
                Wider set
              </p>
              <p className="mt-3 text-3xl font-semibold text-[#245c43]">
                {projectIndex.length}
              </p>
              <p className="mt-2 text-sm leading-6 text-[#514235]">
                More proofs, experiments, satellites, and earlier strands behind the flagship layer.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="site-surface rounded-[34px] bg-[rgba(255,251,245,0.78)] p-7">
          <p className="site-eyebrow">Use this page to</p>
          <h2 className="mt-4 font-[var(--font-display)] text-[2.2rem] font-semibold leading-tight text-[#241c15]">
            Find the right field, proof, or invitation path.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--we-brown)]">
            Each project page now pulls together public framing, live stories
            and media where they exist, and direct ways to enter the work. You
            do not need to understand all of ACT before you can find the right
            project, partner path, or proof.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="#flagship-projects"
              className="site-glow-link rounded-full bg-[#245c43] px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#1c4935]"
            >
              Flagship projects
            </Link>
            <Link
              href="/stories"
              className="site-glow-link rounded-full border border-[#245c43] px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#1f2b21] transition hover:bg-[#E5F4E4]"
            >
              Follow field writing
            </Link>
          </div>
        </div>

        <div className="rounded-[34px] border border-[#2F2A25] bg-[#11110F] p-7 text-[#F3EBDD] shadow-[0_24px_60px_rgba(0,0,0,0.18)]">
          <p className="site-eyebrow text-[#cfa16b] before:bg-[#71553b]">Proof already moving</p>
          <h2 className="mt-4 font-[var(--font-display)] text-[2.2rem] font-semibold leading-tight">
            Visible signs that the work is already in motion.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#D7C8B2]">
            Stories, services, works, and media are already attached to parts of
            the portfolio. That gives this page real texture instead of leaving
            it as a flat project directory.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {liveGraphCards.map((card) => (
              <div
                key={card.label}
                className="rounded-[22px] border border-[#4A3B2E] bg-[#171612] px-5 py-4"
              >
                <p className="text-2xl font-semibold text-[#F3EBDD]">
                  {card.value}
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#BDAE98]">
                  {card.label}
                </p>
                <p className="mt-3 text-xs leading-6 text-[#9F927F]">
                  {card.hint}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="flagship-projects" className="space-y-8">
        <SectionHeading
          eyebrow="Flagship projects"
          title="Where ACT is most visible"
          description="The clearest public examples of ACT's work in justice, story, place, and culture. Each carries real outcomes, partnerships, and media where they exist."
        />
        <div className="grid gap-6 xl:grid-cols-2">
          {featuredProjects.map((project) => (
            <ProjectShowcaseCard key={project.slug} project={project} />
          ))}
        </div>
      </section>

      <section className="grid min-w-0 gap-6 lg:grid-cols-[1.06fr_0.94fr]">
        <div className="site-surface min-w-0 rounded-[34px] bg-[rgba(255,251,245,0.78)] p-7">
          <p className="site-eyebrow">Seed archive</p>
          <h2 className="mt-4 break-words font-[var(--font-display)] text-[2.2rem] font-semibold leading-tight text-[#241c15]">
            More projects, pilots, and live strands sit behind the flagship layer.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--we-brown)]">
            Not everything needs equal visual weight on the public site. This
            layer keeps the strongest public proofs in front while still giving
            the wider project set a visible place to live.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[22px] border border-[var(--we-sand)] bg-[#FDFBF7] px-4 py-4">
              <p className="text-2xl font-semibold text-[#2d6a4f]">
                {archivePreview.length}
              </p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-[#6f5c49]">
                Seed set shown
              </p>
            </div>
            <div className="rounded-[22px] border border-[var(--we-sand)] bg-[#FDFBF7] px-4 py-4">
              <p className="text-2xl font-semibold text-[#2d6a4f]">
                {archiveProjectsWithSites}
              </p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-[#6f5c49]">
                With public sites
              </p>
            </div>
            <div className="rounded-[22px] border border-[var(--we-sand)] bg-[#FDFBF7] px-4 py-4">
              <p className="text-2xl font-semibold text-[#2d6a4f]">
                {archiveProjectsWithRepos}
              </p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-[#6f5c49]">
                With code trails
              </p>
            </div>
          </div>
          <div className="mt-6 grid gap-4 xl:grid-cols-2">
            {archivePreview.map((project) => {
              const statusStyle =
                DOMAIN_BADGE_STYLES[project.status || ''] ||
                DOMAIN_BADGE_STYLES[project.tier || ''] ||
                'border-[var(--we-sand)] bg-[#FDFBF7] text-[#5A4A3A]';
              const liveSignals = signalPayload.bySlug[project.slug];

              return (
                <article
                  key={project.relativePath}
                  className="min-w-0 rounded-[24px] border border-[var(--we-sand)] bg-[#FDFBF7] p-5 transition-all hover:border-[#2d6a4f] hover:shadow-[0_18px_45px_rgba(50,42,31,0.08)]"
                >
                  <Link href={`/projects/${project.slug}`} className="group block min-w-0">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <h3 className="text-base font-semibold leading-tight text-[var(--we-olive)] group-hover:text-[#2d6a4f]">
                        {cleanPublicBrandText(project.title) || project.title}
                      </h3>
                      {compactBadgeLabel(project.status || project.tier) && (
                        <span
                          className={`max-w-[9rem] truncate rounded-full border px-2.5 py-1 text-[10px] font-medium ${statusStyle}`}
                        >
                          {compactBadgeLabel(project.status || project.tier)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm leading-7 text-[#5A4A3A]">
                      {cleanPublicBrandText(project.summary || project.overview) ||
                        'Open the project page to read the ACT wiki framing.'}
                    </p>
                    {liveSignals &&
                    (liveSignals.totalWorkCount > 0 ||
                      liveSignals.serviceConnectionCount > 0 ||
                      liveSignals.storyCount > 0 ||
                      liveSignals.mediaCount > 0) ? (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {liveSignals.serviceConnectionCount > 0 ? (
                          <span className="rounded-full bg-[#EDF6EC] px-2.5 py-1 text-[10px] font-medium text-[var(--we-olive)]">
                            {liveSignals.serviceConnectionCount} service
                            {liveSignals.serviceConnectionCount === 1 ? '' : 's'}
                          </span>
                        ) : null}
                        {liveSignals.totalWorkCount > 0 ? (
                          <span className="rounded-full bg-[#F7EFFA] px-2.5 py-1 text-[10px] font-medium text-[#6B4D6B]">
                            {liveSignals.totalWorkCount} work
                            {liveSignals.totalWorkCount === 1 ? '' : 's'}
                          </span>
                        ) : null}
                        {liveSignals.storyCount > 0 ? (
                          <span className="rounded-full bg-[#F6F1E7] px-2.5 py-1 text-[10px] font-medium text-[var(--we-brown-deep)]">
                            {liveSignals.storyCount} stories
                          </span>
                        ) : null}
                        {liveSignals.mediaCount > 0 ? (
                          <span className="rounded-full bg-[#F6F1E7] px-2.5 py-1 text-[10px] font-medium text-[var(--we-brown-deep)]">
                            {liveSignals.mediaCount} media
                          </span>
                        ) : null}
                      </div>
                    ) : null}
                    <p className="mt-4 text-xs font-medium text-[#2d6a4f] opacity-0 transition-opacity group-hover:opacity-100">
                      Open ACT hub page →
                    </p>
                  </Link>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="site-glow-link rounded-full bg-[var(--we-olive)] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#263425]"
                    >
                      Hub page
                    </Link>
                    {project.publicSiteUrl ? (
                      <a
                        href={project.publicSiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="site-glow-link rounded-full border border-[#4CAF50] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--we-olive)] transition hover:bg-[#E5F4E4]"
                      >
                        Project website
                      </a>
                    ) : null}
                    {project.repoUrl ? (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="site-glow-link rounded-full border border-[#D9C9A9] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#5A4A3A] transition hover:bg-[#F5F1E8]"
                      >
                        GitHub
                      </a>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-[24px] border border-dashed border-[#D6C19A] bg-[#f8f0e3] px-5 py-4">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-[var(--we-olive)]">
                {hiddenArchiveCount > 0
                  ? `${hiddenArchiveCount} more projects remain in the living archive.`
                  : 'This view is currently showing the full non-flagship archive.'}
              </p>
              <p className="text-xs leading-6 text-[#5A4A3A]">
                Go deeper when you want the wider graph, older proofs, and related strands beyond this front-facing seed set.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="site-glow-link rounded-full border border-[#245c43] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1f2b21] transition hover:bg-[#E5F4E4]"
              >
                Bring a strand in
              </Link>
            </div>
          </div>
        </div>

        <div className="min-w-0 space-y-6">
          <div className="site-surface min-w-0 rounded-[34px] bg-[rgba(255,251,245,0.78)] p-7">
            <p className="site-eyebrow">Roadmap & rhythm</p>
            <h2 className="mt-4 break-words font-[var(--font-display)] text-[2.2rem] font-semibold leading-tight text-[#241c15]">
              Seasons of listening, making, testing, and handover.
            </h2>
            <p className="mt-4 text-sm leading-7 text-[var(--we-brown)]">
              The flagship projects are the clearest entry points, but the wider
              work moves through seasons of listening, making, testing, and
              handover.
            </p>
          </div>

          <div className="min-w-0 rounded-[34px] border border-[var(--we-sand)] bg-[#fbf7f0] p-6 shadow-[0_18px_45px_rgba(50,42,31,0.08)]">
            <RoadmapTimeline />
          </div>
        </div>
      </section>

      <section className="site-surface rounded-[36px] bg-gradient-to-br from-[#f5efe5] via-[#e6dcc9] to-[#d4c2a2] p-8 md:p-10">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div className="space-y-4">
            <p className="site-eyebrow">Contribution paths</p>
            <h2 className="font-[var(--font-display)] text-[2.2rem] font-semibold leading-tight text-[#241c15]">
              If you want to enter the work, start here.
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-[var(--we-brown)]">
              ACT grows through collaboration, community memory, and practical
              contribution. Different people come in through different doors:
              building, growing, or partnering around a live need.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Link
              href="/contact"
              className="site-glow-link rounded-full bg-[#245c43] px-7 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#1c4935]"
            >
              Get in touch
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-[24px] border border-[var(--we-sand)] bg-white/70 p-6">
            <div className="text-2xl font-bold text-[#2d6a4f]">Build</div>
            <p className="mt-3 text-sm leading-7 text-[var(--we-brown)]">
              Frontend, backend, design systems, automation, and platform infrastructure.
            </p>
          </div>
          <div className="rounded-[24px] border border-[#244c39] bg-[#183125] p-6 text-[#f4ecde]">
            <div className="text-2xl font-bold text-[#bfe0c7]">Grow</div>
            <p className="mt-3 text-sm leading-7 text-[#d7c8b2]">
              Help shape place-based work, documentation, operations, and ecosystem coherence.
            </p>
          </div>
          <div className="rounded-[24px] border border-[var(--we-sand)] bg-white/70 p-6">
            <div className="text-2xl font-bold text-[#2d6a4f]">Partner</div>
            <p className="mt-3 text-sm leading-7 text-[var(--we-brown)]">
              Bring a community, institution, residency, commission, or field question into the ecosystem.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
