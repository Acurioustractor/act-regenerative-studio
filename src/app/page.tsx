import Image from "next/image";
import Link from "next/link";

import { SiteLoopVideo } from "@/components/media/SiteLoopVideo";
import {
  DarkCTA,
  DocHero,
  EditorialSplit,
  SectionHeader,
} from "@/components/design-system";
import { buildCuratedProjectCards } from "@/lib/projects/build-curated-project-cards";
import { getAllArtProjects, splitFeaturedAndEmerging } from "@/lib/art/art-portfolio";
import { getHomeEditorialFeature } from "@/lib/empathy-ledger-editorial";

const featuredProjectConfigs = [
  {
    slug: "goods-on-country",
    href: "/goods",
    eyebrow: "Goods",
    fallbackTitle: "Goods",
    fallbackTagline: "Circular economy held closer to community",
    fallbackDescription:
      "Goods, manufacturing, and procurement pathways designed to keep value closer to place.",
  },
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

export default async function HomePage() {
  const [homeEditorialFeature] = await Promise.all([
    getHomeEditorialFeature(),
  ]);

  // Homepage order is intentional — don't let editorial feature reorder
  const orderedConfigs = featuredProjectConfigs;
  // Force homepage titles (wiki/flagship data overrides fallbacks — we want our curated names)
  const homepageTitles: Record<string, string> = Object.fromEntries(
    featuredProjectConfigs.map((c) => [c.slug, c.fallbackTitle])
  );

  const [featuredProjects, allArtProjects] = await Promise.all([
    buildCuratedProjectCards(orderedConfigs, {
      includeMedia: true,
      mediaEmphasisSlugs: homeEditorialFeature.featuredMediaProjectSlugs,
      mediaOverrides: homeEditorialFeature.featuredProjectMediaOverrides,
    }),
    getAllArtProjects(),
  ]);
  const { featured: featuredArt } = splitFeaturedAndEmerging(allArtProjects);
  // Curated order: CONTAINED (lead), Gold.Phone, The Confessional
  const artOrder = ["contained", "gold-phone", "the-confessional"];
  const artForHomepage = [
    ...artOrder
      .map((slug) => featuredArt.find((p) => p.slug === slug))
      .filter((p): p is NonNullable<typeof p> => !!p && !!p.heroImage),
    ...featuredArt.filter((p) => p.heroImage && !artOrder.includes(p.slug)),
  ].slice(0, 3);

  return (
    <>
      {/* ——— 1. HERO — Full-screen dark, farm drone video ——— */}
      <DocHero
        fullHeight
        gradientStrength="strong"
        eyebrow="A Curious Tractor · Jinibara Country"
        title="Places, story systems, and public works you can step into."
        subhead="Regenerative innovation from a working farm on Jinibara Country. Justice platforms, ethical storytelling, community art, and land care."
        coverVideo={{
          url: "/media/field-videos/hero-farm-aerial.mp4",
          posterUrl: "/media/field-stills/hero-farm-aerial.jpg",
          title: "Black Cockatoo Valley aerial through morning fog",
        }}
        primaryCta={{ label: "Enter the work", href: "/projects" }}
        secondaryCta={{ label: "See the art →", href: "/art" }}
        statsAfter={
          <div className="flex flex-wrap gap-12 border-t border-[#FAFAF7]/10 pt-8">
            {[
              { n: "58", l: "Projects" },
              { n: "319", l: "Storytellers" },
              { n: "10", l: "Artworks" },
              { n: "191", l: "Wiki articles" },
            ].map(({ n, l }) => (
              <div key={l}>
                <p className="font-[var(--font-display)] text-3xl font-bold text-[#FAFAF7]">
                  {n}
                </p>
                <p className="mt-1 font-[var(--font-sans)] text-[10px] font-semibold uppercase tracking-[0.3em] text-[#FAFAF7]/40">
                  {l}
                </p>
              </div>
            ))}
          </div>
        }
      />

      {/* ——— 1b. AUDIENCE CHIPS — slim row, tells the visitor where to go ——— */}
      <section className="border-b border-[var(--we-sand)] bg-[#F6F1E7] px-8 py-8">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-3">
          <p className="mr-2 font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--we-warm-brown)]">
            I&rsquo;m here to&hellip;
          </p>
          {[
            { label: 'Partner', href: '/contact?type=project-partnership&source=home-audience' },
            { label: 'Visit the farm', href: '/farm' },
            { label: 'Support the work', href: '/contact?type=support&source=home-audience' },
            { label: 'Research or write', href: '/wiki' },
            { label: 'Share a story', href: '/contact?type=share-your-story&source=home-audience' },
          ].map((chip) => (
            <Link
              key={chip.label}
              href={chip.href}
              className="rounded-full border border-[var(--we-sand)] bg-white/80 px-4 py-1.5 text-sm text-[var(--we-olive)] transition hover:border-[#4CAF50] hover:bg-white"
            >
              {chip.label}
            </Link>
          ))}
        </div>
      </section>

      {/* ——— 2. FLAGSHIP FIELDS — Editorial, no borders ——— */}
      <section className="px-8 py-28 md:py-36">
        <div className="mx-auto max-w-[1200px]">
          <SectionHeader
            eyebrow="Flagship projects"
            title="How the work meets the ground"
            eyebrowColor="muted"
          />
        </div>

        {/* Lead project — full-bleed image */}
        {featuredProjects[0] && (
          <Link
            href={featuredProjects[0].href}
            className="group mt-16 block"
          >
            <div className="relative mx-auto max-w-[1200px] overflow-hidden rounded-[var(--site-radius)]">
              <div className="relative aspect-[21/9] overflow-hidden">
                {featuredProjects[0].previewMedia?.kind === "video" ? (
                  <SiteLoopVideo
                    src={featuredProjects[0].previewMedia.url}
                    poster={featuredProjects[0].previewMedia.posterUrl || undefined}
                    title={featuredProjects[0].previewMedia.alt}
                    preload="metadata"
                    className="h-full w-full object-cover transition-transform duration-[8s] group-hover:scale-[1.02]"
                  />
                ) : featuredProjects[0].previewMedia ? (
                  <Image
                    src={featuredProjects[0].previewMedia.url}
                    alt={featuredProjects[0].previewMedia.alt}
                    fill
                    sizes="100vw"
                    className="object-cover transition-transform duration-[8s] group-hover:scale-[1.02]"
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                  <p className="font-[var(--font-sans)] text-[10px] font-semibold uppercase tracking-[0.3em] text-[#FAFAF7]/60">
                    {featuredProjects[0].eyebrow}
                  </p>
                  <h3 className="mt-2 font-[var(--font-display)] text-[clamp(1.8rem,3vw,2.8rem)] font-semibold leading-tight text-[#FAFAF7]">
                    {homepageTitles[featuredProjects[0].slug] || featuredProjects[0].title}
                  </h3>
                  <p className="mt-2 max-w-lg font-[var(--font-body)] text-[15px] leading-relaxed text-[#FAFAF7]/70">
                    {featuredProjects[0].tagline}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-2 font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.2em] text-[#FAFAF7]/80 transition-all group-hover:gap-3">
                    Enter field <span aria-hidden="true">&rarr;</span>
                  </span>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Remaining projects — clean 2x2, text overlaid on image */}
        <div className="mx-auto mt-6 grid max-w-[1200px] gap-6 md:grid-cols-2">
          {featuredProjects.slice(1).map((project) => (
            <Link
              key={project.slug}
              href={project.href}
              className="group relative overflow-hidden rounded-[var(--site-radius)]"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                {project.previewMedia?.kind === "video" ? (
                  <SiteLoopVideo
                    src={project.previewMedia.url}
                    poster={project.previewMedia.posterUrl || undefined}
                    title={project.previewMedia.alt}
                    preload="metadata"
                    className="h-full w-full object-cover transition-transform duration-[8s] group-hover:scale-[1.03]"
                  />
                ) : project.previewMedia ? (
                  <Image
                    src={project.previewMedia.url}
                    alt={project.previewMedia.alt}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-[8s] group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-[var(--site-dark)]">
                    <span className="font-[var(--font-display)] text-2xl text-[#FAFAF7]/20">
                      {project.title}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <p className="font-[var(--font-sans)] text-[10px] font-semibold uppercase tracking-[0.3em] text-[#FAFAF7]/60">
                    {project.eyebrow}
                  </p>
                  <h3 className="mt-1 font-[var(--font-display)] text-xl font-semibold leading-tight text-[#FAFAF7] md:text-2xl">
                    {homepageTitles[project.slug] || project.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 font-[var(--font-body)] text-sm leading-relaxed text-[#FAFAF7]/65">
                    {project.tagline}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-2 font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.2em] text-[#FAFAF7]/70 transition-all group-hover:gap-3 group-hover:text-[#FAFAF7]">
                    Enter field <span aria-hidden="true">&rarr;</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ——— 3. ART CALLOUT — Full-bleed dark ——— */}
      <EditorialSplit
        bg="dark"
        left={
          <>
            <SectionHeader
              onDark
              eyebrowColor="clay"
              eyebrow="Art portfolio"
              title="If art isn't being made and stories aren't being told, the whole system dies."
              lede={
                <>
                  Installation, photography, film, sculpture, performance — art as
                  the final act of listening. {allArtProjects.length} works documented
                  and growing.
                </>
              }
              ledeMaxWidth="32rem"
            />
            <div className="mt-8">
              <DarkCTA variant="ghost" href="/art">
                Enter the art →
              </DarkCTA>
            </div>
          </>
        }
        right={
          <div className="grid grid-cols-2 gap-3">
            {artForHomepage.map((art, index) => {
              const imgUrl = art.heroImage?.url || art.heroImage?.thumbnail_url;
              return (
                <Link
                  key={art.slug}
                  href={`/art/${art.slug}`}
                  className={`group relative overflow-hidden rounded-[var(--site-radius)] ${
                    index === 0 ? "col-span-2 aspect-[16/9]" : "aspect-square"
                  }`}
                >
                  {imgUrl ? (
                    <Image
                      src={imgUrl}
                      alt={art.heroImage?.alt || art.title}
                      fill
                      sizes={
                        index === 0
                          ? "(min-width: 1024px) 50vw, 100vw"
                          : "(min-width: 1024px) 25vw, 50vw"
                      }
                      className="object-cover transition-transform duration-[8s] group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-[#2A2F2A]">
                      <span className="font-[var(--font-display)] text-lg text-[#FAFAF7]/20">
                        {art.title}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="absolute bottom-0 left-0 right-0 translate-y-4 p-4 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                    <p className="font-[var(--font-sans)] text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--site-clay)]">
                      {art.mediums[0]}
                    </p>
                    <p className="mt-1 font-[var(--font-display)] text-lg font-semibold text-[#FAFAF7]">
                      {art.title}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        }
      />

      {/* ——— 4. LCAA METHOD — Typographic, no boxes ——— */}
      <section className="px-8 py-28 md:py-36">
        <div className="mx-auto max-w-[1200px]">
          <SectionHeader
            align="center"
            eyebrowColor="muted"
            eyebrow="Method"
            title="Listen. Curiosity. Action. Art."
            lede="Every project follows the same path. We start by listening to place and people. Curiosity shapes the question. Action builds something real. Art carries it into public life."
          />
          <div className="mt-8 flex justify-center">
            <Link
              href="/method"
              className="inline-flex items-center gap-2 font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--site-green)] transition-all hover:gap-3"
            >
              Read the full method <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ——— 5. INVITATION — Three paths ——— */}
      <section className="full-bleed bg-[var(--site-surface)] px-8 py-28 md:py-36">
        <div className="mx-auto max-w-[1200px]">
          <SectionHeader
            eyebrow="Invitation"
            title="Ways into the work"
            eyebrowColor="muted"
          />
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                title: "Visit or stay",
                body: "Join a residency, field visit, or farm stay and encounter the place directly.",
                href: "/farm",
                cta: "Visit the farm",
              },
              {
                title: "Collaborate",
                body: "Work with ACT on a project, installation, story process, or place-based commission.",
                href: "/contact",
                cta: "Start a conversation",
              },
              {
                title: "Support",
                body: "Back the commons through goods, partnerships, and long-term aligned support.",
                href: "/partners",
                cta: "Explore partnership",
              },
            ].map((path) => (
              <Link
                key={path.title}
                href={path.href}
                className="group"
              >
                <h3 className="font-[var(--font-display)] text-2xl font-semibold text-[var(--site-ink)]">
                  {path.title}
                </h3>
                <p className="mt-3 font-[var(--font-body)] text-[15px] leading-[1.8] text-[var(--site-muted)]">
                  {path.body}
                </p>
                <span className="mt-4 inline-flex items-center gap-2 font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--site-green)] transition-all group-hover:gap-3">
                  {path.cta} <span aria-hidden="true">&rarr;</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
