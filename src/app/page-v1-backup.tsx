import Image from "next/image";
import Link from "next/link";

import { SiteLoopVideo } from "@/components/media/SiteLoopVideo";
import { EcosystemLinks } from "@/components/EcosystemLinks";
import SectionHeading from "@/components/SectionHeading";
import { getHomeEditorialFeature } from "@/lib/empathy-ledger-editorial";
import { buildCuratedProjectCards } from "@/lib/projects/build-curated-project-cards";
import {
  getFeaturedWorks,
  getFeaturedWorkVoiceFragments,
} from "@/lib/works/live-featured-works";

const practiceFields = [
  {
    title: "Build community infrastructure",
    description:
      "Justice platforms, practical tools, and shared systems communities can adapt, run, and eventually own.",
  },
  {
    title: "Shape places people can enter",
    description:
      "Farms, gatherings, retreats, and local enterprise spaces where people can actually meet the work on the ground.",
  },
  {
    title: "Run living story systems",
    description:
      "Consent-first archives, field writing, portraits, and media systems that carry memory without extracting it.",
  },
  {
    title: "Make public works",
    description:
      "Installations, commissions, and cultural production that make hidden realities felt in public life.",
  },
];

const featuredProjectConfigs = [
  {
    slug: "justicehub",
    href: "/justicehub",
    eyebrow: "Justice",
    fallbackTitle: "JusticeHub",
    fallbackTagline: "Justice models that can be adapted and owned locally",
    fallbackDescription:
      "Forkable programs, community infrastructure, and practical pathways beyond extractive systems.",
  },
  {
    slug: "goods-on-country",
    href: "/goods",
    eyebrow: "Goods",
    fallbackTitle: "Goods on Country",
    fallbackTagline: "Circular economy and practical enterprise held closer to community",
    fallbackDescription:
      "Goods, manufacturing, and procurement pathways designed to keep value, story, and utility closer to place.",
  },
  {
    slug: "the-harvest",
    href: "/harvest",
    eyebrow: "Commons",
    fallbackTitle: "The Harvest",
    fallbackTagline: "A local enterprise hub for gatherings, food, and testing",
    fallbackDescription:
      "Seasonal meals, workshops, and practical enterprise rooted in place and relationship.",
  },
  {
    slug: "empathy-ledger",
    href: "/empathy-ledger",
    eyebrow: "Stories",
    fallbackTitle: "Empathy Ledger",
    fallbackTagline: "Consent-first storytelling and narrative sovereignty",
    fallbackDescription:
      "A living archive that protects story, memory, and community authority over cultural knowledge.",
  },
  {
    slug: "black-cockatoo-valley",
    href: "/farm",
    eyebrow: "Land",
    fallbackTitle: "Black Cockatoo Valley",
    fallbackTagline: "Conservation-first land practice on Jinibara Country",
    fallbackDescription:
      "A working valley where land care, residencies, and careful experimentation meet.",
  },
];

const lcaaSteps = [
  {
    title: "Listen",
    description:
      "Pay attention to place, people, and histories that are usually ignored.",
  },
  {
    title: "Curiosity",
    description: "Ask better questions. Prototype before certainty hardens.",
  },
  {
    title: "Action",
    description: "Build useful things with communities, not for them.",
  },
  {
    title: "Art",
    description:
      "Turn learning into culture, meaning, and pressure for change.",
  },
];

const ecosystemPreview = [
  {
    title: "Fields",
    description:
      "Land, justice, stories, and works are distinct fields of practice, but they feed one another.",
  },
  {
    title: "Seeds",
    description:
      "Projects begin as small, place-based tests. Some become shared infrastructure. Some become independent.",
  },
  {
    title: "Handover",
    description:
      "We design for community ownership, forkable tools, and beautiful obsolescence.",
  },
];

const invitationPaths = [
  {
    title: "Visit or stay",
    description:
      "Join a residency, field visit, or farm stay and encounter the place directly.",
    href: "/farm",
    cta: "Visit the farm",
  },
  {
    title: "Commission or collaborate",
    description:
      "Work with ACT on a project, installation, story process, or place-based commission.",
    href: "/contact",
    cta: "Start a conversation",
  },
  {
    title: "Support or partner",
    description:
      "Back the commons through goods, partnerships, and long-term aligned support.",
    href: "/partners",
    cta: "Explore partnership",
  },
];

const practiceFieldTones = [
  "from-[#f6efe3] via-[#efe3d3] to-[#e0cfb4]",
  "from-[#e6efe9] via-[#d8e7db] to-[#c4d8cc]",
  "from-[#f4eee6] via-[#ece0d0] to-[#e0d2bf]",
  "from-[#191714] via-[#211c17] to-[#2b241d]",
];

const featuredProjectLayouts = [
  "xl:col-span-6",
  "xl:col-span-6",
  "xl:col-span-4",
  "xl:col-span-4",
  "xl:col-span-4",
];

const featuredProjectTones = [
  "from-[#111914] via-[#1b2c21] to-[#264431] text-[#f4ecde] border-[#365440]",
  "from-[#f3e9da] via-[#eadcc7] to-[#dfc9a8] text-[#251d16] border-[#d5bf9e]",
  "from-[#f7f1e9] via-[#efe3d4] to-[#e6d6bf] text-[#251d16] border-[#dcc7a7]",
  "from-[#181614] via-[#201c18] to-[#31291f] text-[#f4ecde] border-[#5a4b3d]",
  "from-[#edf2e7] via-[#d9e4d3] to-[#c8d8bf] text-[#233022] border-[#bbcfb5]",
];

export default async function HomePage() {
  const [featuredWorks, homeEditorialFeature] = await Promise.all([
    getFeaturedWorks({ limit: 3 }),
    getHomeEditorialFeature(),
  ]);
  const orderedFeaturedProjectConfigs = (
    homeEditorialFeature.featuredProjectSlugs.length > 0
      ? [
          ...homeEditorialFeature.featuredProjectSlugs
            .map((slug) =>
              featuredProjectConfigs.find((config) => config.slug === slug)
            )
            .filter((config): config is (typeof featuredProjectConfigs)[number] =>
              Boolean(config)
            ),
          ...featuredProjectConfigs.filter(
            (config) =>
              !homeEditorialFeature.featuredProjectSlugs.includes(config.slug)
          ),
        ]
      : featuredProjectConfigs
  ).slice(0, featuredProjectConfigs.length);
  const featuredProjects = await buildCuratedProjectCards(
    orderedFeaturedProjectConfigs,
    {
      includeMedia: true,
      mediaEmphasisSlugs: homeEditorialFeature.featuredMediaProjectSlugs,
      mediaOverrides: homeEditorialFeature.featuredProjectMediaOverrides,
    }
  );
  const heroMediaProjects = featuredProjects.filter(
    (project) => project.previewMedia && project.mediaEmphasis
  );
  const [heroLeadProject, ...heroSupportProjects] = heroMediaProjects;
  const heroSupportCards = heroSupportProjects.slice(0, 2).map((project) => {
    const supportStill =
      project.supportingMedia?.[0] ||
      (project.previewMedia?.kind === "image"
        ? {
            url: project.previewMedia.url,
            alt: project.previewMedia.alt,
          }
        : project.previewMedia?.posterUrl
          ? {
              url: project.previewMedia.posterUrl,
              alt: project.previewMedia.alt,
            }
          : null);

    return {
      project,
      supportStill,
    };
  });

  const voiceFragment =
    getFeaturedWorkVoiceFragments(featuredWorks, 1)[0] || null;
  const { leadArticle, supportingArticles } = homeEditorialFeature;
  const featuredStoryCount = featuredProjects.reduce(
    (sum, project) => sum + (project.liveSignals?.storyCount || 0),
    0
  );
  const featuredMediaCount = featuredProjects.reduce(
    (sum, project) => sum + (project.liveSignals?.mediaCount || 0),
    0
  );
  const featuredServiceCount = featuredProjects.reduce(
    (sum, project) => sum + (project.liveSignals?.serviceConnectionCount || 0),
    0
  );
  const editorialCount = (leadArticle ? 1 : 0) + supportingArticles.length;

  return (
    <div className="space-y-0">
      {/* ====== HERO — Full viewport, dark, bold ====== */}
      <section className="full-bleed relative flex min-h-[92vh] flex-col justify-end overflow-hidden bg-[var(--site-dark)]">
        {/* Background: lead project video/image with Ken Burns */}
        <div className="absolute inset-0">
          {heroLeadProject?.previewMedia?.kind === "video" ? (
            <SiteLoopVideo
              src={heroLeadProject.previewMedia.url}
              poster={heroLeadProject.previewMedia.posterUrl || undefined}
              title={heroLeadProject.previewMedia.alt}
              preload="metadata"
              className="h-full w-full object-cover animate-[slowZoom_30s_ease-in-out_infinite_alternate]"
            />
          ) : heroLeadProject?.previewMedia ? (
            <Image
              src={heroLeadProject.previewMedia.url}
              alt={heroLeadProject.previewMedia.alt}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--site-dark)] via-[var(--site-dark)]/60 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1200px] px-8 pb-16 pt-32 md:pb-24">
          <p className="mb-6 font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.35em] text-[#FAFAF7]/50">
            A Curious Tractor &middot; Jinibara Country
          </p>
          <h1 className="max-w-[14ch] font-[var(--font-display)] text-[clamp(2.8rem,7vw,5.5rem)] font-light leading-[1.05] tracking-[-0.02em] text-[#FAFAF7]">
            We build places, story systems, and public works you can step into.
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-[1.7] text-[#FAFAF7]/65">
            Regenerative innovation from a working farm. Justice platforms,
            ethical storytelling, community art, and land care. {featuredProjects.length} flagship
            fields. One ecosystem.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/projects"
              className="rounded-[var(--site-radius)] bg-[#FAFAF7] px-8 py-4 font-[var(--font-sans)] text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--site-dark)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_40px_rgba(250,250,247,0.15)]"
            >
              Enter the work
            </Link>
            <Link
              href="/art"
              className="rounded-[var(--site-radius)] border border-[#FAFAF7]/25 px-8 py-4 font-[var(--font-sans)] text-[13px] font-semibold uppercase tracking-[0.14em] text-[#FAFAF7]/80 transition hover:border-[#FAFAF7]/50 hover:text-[#FAFAF7]"
            >
              See the art &rarr;
            </Link>
          </div>

          {/* Stats strip */}
          <div className="mt-16 flex flex-wrap gap-12 border-t border-[#FAFAF7]/10 pt-8">
            {[
              { n: "58", l: "Projects" },
              { n: "319", l: "Storytellers" },
              { n: "10", l: "Artworks" },
              { n: "191", l: "Wiki articles" },
            ].map(({ n, l }) => (
              <div key={l}>
                <p className="font-[var(--font-display)] text-3xl font-bold text-[#FAFAF7]">{n}</p>
                <p className="mt-1 font-[var(--font-sans)] text-[10px] font-semibold uppercase tracking-[0.3em] text-[#FAFAF7]/40">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== FLAGSHIP FIELDS ====== */}
      <section className="bg-[var(--site-bg)] px-8 py-24">
        <div className="mx-auto max-w-[1200px]">
          <p className="font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--site-muted)]">Five flagship fields</p>
          <h2 className="mt-4 max-w-[18ch] font-[var(--font-display)] text-[clamp(2rem,4vw,3.5rem)] font-light leading-[1.1] tracking-[-0.01em] text-[var(--site-ink)]">
            How the work meets the ground
          </h2>
          <p className="mt-4 max-w-xl text-[var(--site-muted)]">
            Each field is a live platform, place, or system that communities can enter, test, and eventually hold for themselves.
          </p>
        </div>

        {/* Flagship project cards */}
        <div className="mx-auto mt-16 grid max-w-[1200px] gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project) => (
            <Link
              key={project.slug}
              href={project.href}
              className="group relative overflow-hidden rounded-[var(--site-radius)] border border-[var(--site-line)] bg-white transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[var(--site-shadow-hover)]"
            >
              {/* Card image */}
              <div className="relative aspect-[16/10] overflow-hidden">
                {project.previewMedia?.kind === "video" ? (
                  <SiteLoopVideo
                    src={project.previewMedia.url}
                    poster={project.previewMedia.posterUrl || undefined}
                    title={project.previewMedia.alt}
                    preload="metadata"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : project.previewMedia ? (
                  <Image
                    src={project.previewMedia.url}
                    alt={project.previewMedia.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-[var(--site-surface)]">
                    <span className="font-[var(--font-display)] text-2xl font-bold text-[var(--site-muted)]/30">{project.title}</span>
                  </div>
                )}
              </div>
              {/* Card body */}
              <div className="p-6">
                <p className="font-[var(--font-sans)] text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--site-green)]">
                  {project.eyebrow}
                </p>
                <h3 className="mt-2 font-[var(--font-display)] text-xl font-semibold leading-tight text-[var(--site-ink)]">
                  {project.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[var(--site-muted)]">
                  {project.tagline}
                </p>
                <span className="mt-4 inline-flex items-center gap-2 font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--site-ink)] transition-all group-hover:gap-3">
                  Enter field <span aria-hidden="true">&rarr;</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-10">
        <SectionHeading
          eyebrow="What ACT actually does"
          title="Four ways the work meets the world"
          description="ACT moves through community infrastructure, place-based work, living story systems, and public works. Different people enter through different doors, but the work stays connected."
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {practiceFields.map((field, index) => (
            <div
              key={field.title}
              className={`site-glow-link rounded-lg border border-[#e1d3ba] bg-gradient-to-br ${practiceFieldTones[index]} p-7 transition hover:-translate-y-1 hover:border-[#2d6a4f] hover:shadow-[0_22px_50px_rgba(50,42,31,0.11)] ${
                field.title === "Works" ? "text-[#f4ecde]" : ""
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <p
                  className={`text-xs uppercase tracking-[0.3em] ${
                    field.title === "Make public works" ? "text-[#cfa16b]" : "text-[#6B5A45]"
                  }`}
                >
                  Mode
                </p>
                <span
                  className={`text-sm font-semibold uppercase tracking-[0.22em] ${
                    field.title === "Make public works" ? "text-[#8f7d69]" : "text-[#9f8a74]"
                  }`}
                >
                  0{index + 1}
                </span>
              </div>
              <h3
                className={`mt-6 font-[var(--font-display)] text-[2rem] font-semibold ${
                  field.title === "Make public works" ? "text-[#fff6ea]" : "text-[#2F3E2E]"
                }`}
              >
                {field.title}
              </h3>
              <p
                className={`mt-4 text-sm leading-7 ${
                  field.title === "Make public works" ? "text-[#d7c8b2]" : "text-[#4D3F33]"
                }`}
              >
                {field.description}
              </p>
              <div
                className={`mt-8 h-px w-16 ${
                  field.title === "Make public works" ? "bg-[#cfa16b]/60" : "bg-[#bfa98a]"
                }`}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="site-surface rounded-lg bg-[rgba(255,251,245,0.78)] p-7">
          <p className="site-eyebrow">Proof in motion</p>
          <h2 className="mt-4 font-[var(--font-display)] text-[2.2rem] font-semibold leading-tight text-[#241c15]">
            The work is already visible across the flagship set.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#4D3F33]">
            This is the fastest way to understand ACT: look at the current
            public fields, the stories moving through them, the works connected
            to them, and the invitations they create.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/projects"
              className="site-glow-link rounded-full bg-[#245c43] px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#1c4935]"
            >
              See flagship fields
            </Link>
            <Link
              href="/art"
              className="site-glow-link rounded-full border border-[#245c43] px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#1f2b21] transition hover:bg-[#E5F4E4]"
            >
              Enter the works
            </Link>
          </div>
        </div>

        <div className="rounded-lg border border-[#2F2A25] bg-[#11110F] p-7 text-[#F3EBDD] shadow-[0_24px_60px_rgba(0,0,0,0.18)]">
          <p className="site-eyebrow text-[#cfa16b] before:bg-[#71553b]">Current signals</p>
          <h2 className="mt-4 font-[var(--font-display)] text-[2.2rem] font-semibold leading-tight">
            Not theory. Current public proof.
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              {
                label: 'Flagship fields',
                value: String(featuredProjects.length),
                hint: 'The clearest current public fields in the ACT ecosystem.',
              },
              {
                label: 'Ways in',
                value:
                  featuredServiceCount > 0
                    ? String(featuredServiceCount)
                    : 'Growing',
                hint:
                  featuredServiceCount > 0
                    ? 'Active invitations, service paths, and entry points already visible.'
                    : 'New pathways into the work are still being brought forward.',
              },
              {
                label: 'Story signals',
                value: String(featuredStoryCount),
                hint: 'Approved stories already touching the flagship set.',
              },
              {
                label: 'Media signals',
                value: String(featuredMediaCount),
                hint: 'Images and clips already available to carry the public story.',
              },
            ].map((card) => (
              <div
                key={card.label}
                className="rounded-lg border border-[#4A3B2E] bg-[#171612] px-5 py-4"
              >
                <p className="text-2xl font-semibold text-[#F3EBDD]">{card.value}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#BDAE98]">
                  {card.label}
                </p>
                <p className="mt-3 text-xs leading-6 text-[#9F927F]">{card.hint}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-10">
        <SectionHeading
          eyebrow="Flagship fields"
          title="Five flagship fields of work"
          description="Start with the five public fields where ACT is already most visible. Each one is a doorway into the wider body of work, with proof, media, and invitations where they exist."
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-12">
          {featuredProjects.map((project, index) => (
            <Link
              key={project.slug}
              href={project.href}
              className={`group site-glow-link ${featuredProjectLayouts[index]} overflow-hidden rounded-lg border bg-gradient-to-br p-8 transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(50,42,31,0.14)] ${featuredProjectTones[index]}`}
            >
              {project.previewMedia ? (
                <div className="mb-6 space-y-3">
                  <div
                    className={`relative overflow-hidden rounded-lg border ${
                      index === 0 || index === 3
                        ? "border-white/10 bg-black/25"
                        : "border-[#d5bf9e] bg-white/35"
                    } ${
                      project.mediaEmphasis ? "aspect-[16/9]" : "aspect-[16/8]"
                    }`}
                  >
                    {project.previewMedia.kind === "video" ? (
                      <SiteLoopVideo
                        src={project.previewMedia.url}
                        poster={project.previewMedia.posterUrl || undefined}
                        title={project.previewMedia.alt}
                        preload="metadata"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <Image
                        src={project.previewMedia.url}
                        alt={project.previewMedia.alt}
                        fill
                        sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                    )}
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/55 to-transparent" />
                    <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                      {project.mediaEmphasis ? (
                        <span className="rounded-full border border-white/15 bg-black/35 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-[#f3ebdd]">
                          Field media
                        </span>
                      ) : null}
                      {project.previewMedia.kind === "video" ? (
                        <span className="rounded-full border border-white/15 bg-black/35 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-[#f3ebdd]">
                          Video
                        </span>
                      ) : null}
                    </div>
                  </div>
                  {project.supportingMedia && project.supportingMedia.length > 0 ? (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {project.supportingMedia.map((item) => (
                        <div
                          key={item.url}
                          className={`group/image overflow-hidden rounded-md border ${
                            index === 0 || index === 3
                              ? "border-white/10 bg-black/25"
                              : "border-[#d5bf9e] bg-white/45"
                          }`}
                        >
                          <div className="relative aspect-[4/3] overflow-hidden">
                            <img
                              src={item.url}
                              alt={item.alt}
                              className="h-full w-full object-cover transition-transform duration-700 group-hover/image:scale-[1.04]"
                            />
                            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/55 to-transparent" />
                            {item.eyebrow ? (
                              <div className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/35 px-2.5 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-[#f3ebdd]">
                                {item.eyebrow}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : null}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p
                    className={`text-xs uppercase tracking-[0.3em] ${
                      index === 0 || index === 3 ? "text-[#cfa16b]" : "text-[#6B5A45]"
                    }`}
                  >
                    {project.eyebrow}
                  </p>
                  <h3
                    className={`mt-4 font-[var(--font-display)] text-[2.1rem] font-semibold leading-[1.02] ${
                      index === 0 || index === 3 ? "text-[#fdf6ea]" : "text-[#2F3E2E]"
                    }`}
                  >
                    {project.title}
                  </h3>
                </div>
                <span
                  className={`rounded-full border px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.22em] ${
                    index === 0 || index === 3
                      ? "border-[#6b5a45] text-[#d7c8b2]"
                      : "border-[#d5bf9e] text-[#6b5a45]"
                  }`}
                >
                  Flagship
                </span>
              </div>
              <p
                className={`mt-4 text-sm font-semibold ${
                  index === 0 || index === 3 ? "text-[#9cd09e]" : "text-[#2d6a4f]"
                }`}
              >
                {project.tagline}
              </p>
              <p
                className={`mt-4 text-sm leading-7 ${
                  index === 0 || index === 3 ? "text-[#d7c8b2]" : "text-[#4D3F33]"
                }`}
              >
                {project.description}
              </p>
              {project.liveSignals &&
              (project.liveSignals.serviceConnectionCount > 0 ||
                project.liveSignals.totalWorkCount > 0 ||
                project.liveSignals.storyCount > 0 ||
                project.liveSignals.mediaCount > 0) ? (
                <div className="mt-5 flex flex-wrap gap-2">
                  {project.liveSignals.serviceConnectionCount > 0 ? (
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        index === 0 || index === 3
                          ? "bg-[#284131] text-[#dff0e2]"
                          : "bg-[#edf6ec] text-[#2F3E2E]"
                      }`}
                    >
                      {project.liveSignals.serviceConnectionCount} service
                      {project.liveSignals.serviceConnectionCount === 1 ? "" : "s"}
                    </span>
                  ) : null}
                  {project.liveSignals.totalWorkCount > 0 ? (
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        index === 0 || index === 3
                          ? "bg-[#332a37] text-[#eadcf0]"
                          : "bg-[#F7EFFA] text-[#6B4D6B]"
                      }`}
                    >
                      {project.liveSignals.totalWorkCount} work
                      {project.liveSignals.totalWorkCount === 1 ? "" : "s"}
                    </span>
                  ) : null}
                  {project.liveSignals.storyCount > 0 ? (
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        index === 0 || index === 3
                          ? "bg-[#30271f] text-[#f3e5cf]"
                          : "bg-[#F6F1E7] text-[#4A4035]"
                      }`}
                    >
                      {project.liveSignals.storyCount} stories
                    </span>
                  ) : null}
                  {project.liveSignals.mediaCount > 0 ? (
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        index === 0 || index === 3
                          ? "bg-[#30271f] text-[#f3e5cf]"
                          : "bg-[#F6F1E7] text-[#4A4035]"
                      }`}
                    >
                      {project.liveSignals.mediaCount} media
                    </span>
                  ) : null}
                </div>
              ) : null}
              <div
                className={`mt-8 inline-flex items-center gap-2 text-sm font-semibold transition group-hover:gap-3 ${
                  index === 0 || index === 3 ? "text-[#fff6ea]" : "text-[#2F3E2E]"
                }`}
              >
                <span>Explore project</span>
                <span aria-hidden="true">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {leadArticle ? (
        <section className="space-y-10">
          <SectionHeading
            eyebrow="Field writing"
            title="Writing moving through the ecosystem"
            description="The wiki holds the durable memory. Empathy Ledger carries the live editorial layer. These pieces are the current writing anchor points for the wider ACT field."
          />
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <Link
              href={leadArticle.localPath}
              className="group site-glow-link overflow-hidden rounded-lg border border-[#e1d3ba] bg-gradient-to-br from-[#f7f1e8] via-[#efe3d2] to-[#dfc9a8] transition hover:-translate-y-1 hover:border-[#2d6a4f] hover:shadow-[0_24px_60px_rgba(50,42,31,0.14)]"
            >
              <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="relative min-h-[320px] overflow-hidden bg-[#e6d6bf]">
                  {leadArticle.featuredImageUrl ? (
                    <Image
                      src={leadArticle.featuredImageUrl}
                      alt={leadArticle.featuredImageAlt ?? leadArticle.title}
                      fill
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-full min-h-[320px] items-center justify-center bg-[radial-gradient(circle_at_top,#264431_0%,#1e3025_48%,#171612_100%)] px-8 text-center text-xs font-semibold uppercase tracking-[0.34em] text-[#f3ebdd]">
                      ACT editorial signal
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/55 to-transparent" />
                  <div className="absolute bottom-5 left-5 flex flex-wrap gap-2">
                    {leadArticle.relatedProjectSlugs.slice(0, 2).map((slug) => (
                      <span
                        key={slug}
                        className="rounded-full border border-white/20 bg-black/35 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-[#f3ebdd]"
                      >
                        {slug.replace(/-/g, " ")}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col p-7 md:p-8">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#6b5a45]">
                    Lead article
                  </p>
                  <h3 className="mt-4 font-[var(--font-display)] text-[2.15rem] font-semibold leading-[1.04] text-[#1f1913]">
                    {leadArticle.title}
                  </h3>
                  <p className="mt-4 text-base leading-8 text-[#4d3f33]">
                    {leadArticle.excerpt ||
                      leadArticle.subtitle ||
                      "A current piece of ACT field writing moving between memory, public argument, and the work on the ground."}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2 text-[0.64rem] uppercase tracking-[0.24em] text-[#6b5a45]">
                    {leadArticle.authorName ? (
                      <span className="rounded-full border border-[#d5bf9e] px-3 py-1">
                        {leadArticle.authorName}
                      </span>
                    ) : null}
                    {leadArticle.articleType ? (
                      <span className="rounded-full border border-[#d5bf9e] px-3 py-1">
                        {leadArticle.articleType}
                      </span>
                    ) : null}
                    {leadArticle.media.photoCount > 0 || leadArticle.media.videoCount > 0 ? (
                      <span className="rounded-full border border-[#d5bf9e] px-3 py-1">
                        {leadArticle.media.photoCount + leadArticle.media.videoCount} linked media
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-auto pt-8">
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#245c43] transition group-hover:gap-3">
                      Read the article
                      <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            <div className="grid gap-4">
              {supportingArticles.map((article) => (
                <Link
                  key={article.slug}
                  href={article.localPath}
                  className="group site-glow-link overflow-hidden rounded-lg border border-[#e1d3ba] bg-white/78 p-6 transition hover:-translate-y-1 hover:border-[#2d6a4f] hover:shadow-[0_20px_50px_rgba(50,42,31,0.12)]"
                >
                  <p className="text-[0.64rem] font-semibold uppercase tracking-[0.28em] text-[#6b5a45]">
                    Supporting note
                  </p>
                  <h3 className="mt-3 font-[var(--font-display)] text-[1.55rem] font-semibold leading-[1.08] text-[#233022]">
                    {article.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[#4d3f33]">
                    {article.excerpt ||
                      article.subtitle ||
                      "A linked ACT article that extends the field context around the flagship work."}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2 text-[0.62rem] uppercase tracking-[0.24em] text-[#6b5a45]">
                    {article.relatedProjectSlugs.slice(0, 2).map((slug) => (
                      <span
                        key={slug}
                        className="rounded-full border border-[#e1d3ba] px-3 py-1"
                      >
                        {slug.replace(/-/g, " ")}
                      </span>
                    ))}
                  </div>
                  <div className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#245c43] transition group-hover:gap-3">
                    Read more
                    <span aria-hidden="true">→</span>
                  </div>
                </Link>
              ))}
              <Link
                href="/blog"
                className="site-glow-link rounded-lg border border-[#304532] bg-[#161713] p-6 text-[#f3ebdd] transition hover:border-[#cfa16b] hover:bg-[#1c1e18]"
              >
                <p className="text-[0.64rem] font-semibold uppercase tracking-[0.28em] text-[#cfa16b]">
                  Editorial layer
                </p>
                <h3 className="mt-3 font-[var(--font-display)] text-[1.5rem] font-semibold">
                  Follow the field writing
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#d7c8b2]">
                  Articles, reflections, and project notes are syndicated through
                  Empathy Ledger, then surfaced here where they best strengthen the
                  wider ACT story.
                </p>
                <div className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#f3ebdd]">
                  Open the journal
                  <span aria-hidden="true">→</span>
                </div>
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      <section className="rounded-lg border border-[#2F2A25] bg-[#11110F] px-8 py-10 text-[#F3EBDD] md:px-12 md:py-14">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-5">
            <p className="site-eyebrow text-[#cfa16b] before:bg-[#71553b]">
              Featured work
            </p>
            <h2 className="font-[var(--font-display)] text-[2.6rem] font-semibold leading-[1.02] md:text-[3.5rem]">
              Works that carry voice, place, and pressure
            </h2>
            <p className="max-w-xl text-base leading-8 text-[#D7C8B2]">
              Some ACT outputs are not services or platforms. They are
              installations, encounters, objects, and fragments that let people
              feel what systems usually hide.
            </p>
            <div className="rounded-lg border border-[#5B4634] bg-[#191815] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.22)]">
              <p className="text-xs uppercase tracking-[0.3em] text-[#CFA16B]">
                Voice fragment
              </p>
              <p className="mt-4 text-xl leading-relaxed text-[#F3EBDD]">
                “
                {voiceFragment?.text ||
                  "Move your cursor over a voice particle to hear it."}
                ”
              </p>
              <p className="mt-4 text-sm text-[#BDAE98]">
                {voiceFragment?.attribution ||
                  "From Gold.Phone, a work that treats testimony as encounter rather than content."}
              </p>
            </div>
            <Link
              href="/art"
              className="site-glow-link inline-flex items-center gap-2 rounded-full border border-[#CFA16B] bg-[#181612] px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#F3EBDD] transition hover:bg-[#1f1d18]"
            >
              Enter the works
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="grid gap-4">
            {featuredWorks.map((work) => (
              <Link
                key={work.slug}
                href={work.href}
                className="group site-glow-link overflow-hidden rounded-lg border border-[#4A3B2E] bg-[#171612] transition hover:border-[#CFA16B] hover:bg-[#1B1A16]"
              >
                {work.previewMedia ? (
                  work.previewMedia.kind === "image" ? (
                    <img
                      src={work.previewMedia.thumbnailUrl || work.previewMedia.url}
                      alt={work.previewMedia.alt || work.title}
                      className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="relative h-44 overflow-hidden bg-[#11110F]">
                      {work.previewMedia.thumbnailUrl ? (
                        <img
                          src={work.previewMedia.thumbnailUrl}
                          alt={work.previewMedia.alt || work.title}
                          className="h-full w-full object-cover opacity-70 transition-transform duration-500 group-hover:scale-[1.02]"
                        />
                      ) : null}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-4 left-4 rounded-full bg-black/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
                        {work.previewMedia.kind}
                      </div>
                    </div>
                  )
                ) : null}

                <div className="space-y-4 p-6">
                  <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.2em] text-[#CFA16B]">
                    <span>{work.medium}</span>
                    <span className="text-[#6E6257]">•</span>
                    <span>{work.connectedTo}</span>
                    {work.live.storyCount > 0 ? (
                      <>
                        <span className="text-[#6E6257]">•</span>
                        <span>{work.live.storyCount} stories</span>
                      </>
                    ) : null}
                  </div>
                  <h3 className="font-[var(--font-display)] text-[2rem] font-semibold leading-tight text-[#F3EBDD]">
                    {work.title}
                  </h3>
                  <p className="text-sm leading-7 text-[#D7C8B2]">
                    {work.description}
                  </p>
                  <p className="border-l border-[#CFA16B]/50 pl-4 text-sm italic text-[#F3EBDD]">
                    {work.quote}
                  </p>
                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#F3EBDD] transition group-hover:gap-3">
                    <span>View work</span>
                    <span aria-hidden="true">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="site-surface rounded-lg bg-gradient-to-br from-[#f5efe5] via-[#e6dcc9] to-[#d2be9a] p-8 md:p-12">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <SectionHeading
              eyebrow="Method"
              title="Listen. Curiosity. Action. Art."
              description="LCAA is the loop that keeps the studio grounded in place, experimentation, and public meaning."
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {lcaaSteps.map((step, index) => (
                <div
                  key={step.title}
                  className={`rounded-lg border p-5 ${
                    index === 3
                      ? "border-[#4a3b2e] bg-[#171612] text-[#f5ecde]"
                      : "border-[#E5D6BE] bg-white/70 text-[#2F3E2E]"
                  }`}
                >
                  <h3 className="font-semibold">{step.title}</h3>
                  <p
                    className={`mt-2 text-sm leading-7 ${
                      index === 3 ? "text-[#d8c8b4]" : "text-[#4D3F33]"
                    }`}
                  >
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-[#d8c7a5] bg-[rgba(255,251,245,0.68)] p-6 shadow-[0_18px_50px_rgba(58,42,28,0.08)]">
            <p className="site-eyebrow">Method in practice</p>
            <div className="mt-4 space-y-4 text-sm leading-7 text-[#4D3F33]">
              <p>
                We start with listening and local authority. We stay long enough
                to understand context. We prototype with people, not on them.
              </p>
              <p>
                Art matters because it returns us to feeling, memory, and
                collective imagination. It is not decoration. It closes the
                loop.
              </p>
              <p>
                We design so value, infrastructure, and narrative authority can
                remain in community hands.
              </p>
            </div>
            <Link
              href="/method"
              className="site-glow-link mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#2d6a4f] transition hover:gap-3"
            >
              <span>Read the method</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-10">
        <SectionHeading
          eyebrow="Ecosystem"
          title="An ecosystem, not a holding company"
          description="ACT is a network of projects, communities, and experiments. Some become independent. Some become shared infrastructure. Some are designed to disappear."
        />
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {ecosystemPreview.map((item, index) => (
              <div
                key={item.title}
                className={`rounded-lg border p-6 ${
                  index === 1
                    ? "border-[#244c39] bg-[#e3efe7]"
                    : "border-[#E1D3BA] bg-white/75"
                }`}
              >
                <h3 className="font-[var(--font-display)] text-xl font-semibold text-[#2F3E2E]">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#4D3F33]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
          <div className="rounded-lg border border-[#E3D4BA] bg-[rgba(255,252,246,0.8)] p-8 shadow-[0_20px_50px_rgba(58,42,28,0.08)]">
            <p className="site-eyebrow">Live pathways</p>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#4D3F33]">
              The live platforms are only one layer of the ecosystem. They sit
              alongside residencies, community programs, works, goods, and
              place-based infrastructure.
            </p>
            <div className="mt-6">
              <EcosystemLinks variant="buttons" liveOnly={true} />
            </div>
            <Link
              href="/projects"
              className="site-glow-link mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#2d6a4f] transition hover:gap-3"
            >
              <span>Explore the ecosystem</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-10">
        <SectionHeading
          eyebrow="Invitation"
          title="Ways into the work"
          description="There are different ways to come closer: through place, collaboration, or practical support."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {invitationPaths.map((path, index) => (
            <Link
              key={path.title}
              href={path.href}
              className={`group site-glow-link rounded-lg border p-7 transition hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(50,42,31,0.1)] ${
                index === 1
                  ? "border-[#244c39] bg-[#1d3527] text-[#f4ecde]"
                  : "border-[#E1D3BA] bg-white/75 text-[#2F3E2E]"
              }`}
            >
              <h3
                className={`font-[var(--font-display)] text-xl font-semibold ${
                  index === 1 ? "text-[#fff6ea]" : "text-[#2F3E2E]"
                }`}
              >
                {path.title}
              </h3>
              <p
                className={`mt-3 text-sm leading-7 ${
                  index === 1 ? "text-[#d7c8b2]" : "text-[#4D3F33]"
                }`}
              >
                {path.description}
              </p>
              <div
                className={`mt-6 inline-flex items-center gap-2 text-sm font-semibold transition group-hover:gap-3 ${
                  index === 1 ? "text-[#bfe0c7]" : "text-[#2F3E2E]"
                }`}
              >
                <span>{path.cta}</span>
                <span aria-hidden="true">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
