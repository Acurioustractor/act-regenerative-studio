import Image from "next/image";
import Link from "next/link";

import { SiteLoopVideo } from "@/components/media/SiteLoopVideo";
import {
  DarkCTA,
  DocHero,
  EditorialSplit,
  SectionHeader,
} from "@/components/design-system";
import { EditableImage } from "@/components/flagship/EditableImage";
import { buildCuratedProjectCards } from "@/lib/projects/build-curated-project-cards";
import { getAllArtProjects, splitFeaturedAndEmerging } from "@/lib/art/art-portfolio";
import { getHomeEditorialFeature } from "@/lib/empathy-ledger-editorial";
import { cleanMediaAlt } from "@/lib/media/alt-text";
import { pageMetadata } from "@/lib/seo/site";
import featuredSnapshot from "@/data/empathy-ledger-featured.generated.json";

export const metadata = pageMetadata({
  title: "A Curious Tractor",
  description:
    "A regenerative innovation studio on Jinibara Country. Explore ACT projects, stories, public works, art, farm practice, and the living wiki.",
  path: "/",
  image: {
    url: "/media/field-stills/hero-farm-aerial.jpg",
    alt: "Black Cockatoo Valley aerial view through morning fog",
  },
});

// 9 non-flagship projects for the "More from the field" mosaic.
// Hero images come from the EL featured snapshot; `override` wins over EL
// (use it when the EL hero is wrong for this slot); `fallback` kicks in when
// EL has no media at all for that slug.
const mosaicTiles: Array<{
  slug: string;
  name: string;
  href: string;
  override?: string;
  fallback?: string;
}> = [
  { slug: "picc-elders-hull-river", name: "PICC Elders Hull River Story", href: "/projects/picc-elders-hull-river" },
  {
    slug: "civicgraph",
    name: "CivicScope",
    href: "/projects/civicgraph",
    fallback: "/media/field-stills/justicehub-container.jpg",
  },
  { slug: "contained", name: "CONTAINED", href: "/projects/contained" },
  { slug: "gold-phone", name: "Gold.Phone", href: "/art/gold-phone" },
  { slug: "uncle-allan-palm-island-art", name: "Uncle Allan Palm Island", href: "/projects/uncle-allan-palm-island-art" },
  { slug: "fishers-oysters", name: "Fishers Oysters", href: "/projects/fishers-oysters" },
  { slug: "community-capital", name: "Community Capital", href: "/projects/community-capital" },
  {
    slug: "oonchiumpa",
    name: "Oonchiumpa",
    href: "/projects/oonchiumpa",
    fallback: "/media/field-stills/goods-remote-aerial.jpg",
  },
  { slug: "smart-recovery", name: "SMART Recovery", href: "/projects/smart-recovery" },
];

// Resolution order: explicit override → EL hero → EL first item → local fallback.
function resolveMosaicImage(
  slug: string,
  name: string,
  override?: string,
  fallback?: string
): { url: string; alt: string } | null {
  if (override) {
    return { url: override, alt: `${name} project image` };
  }
  const project = (featuredSnapshot.projects as Record<string, unknown>)[slug] as
    | {
        media?: {
          hero?: { url?: string; alt?: string | null; title?: string | null; kind?: string | null };
          items?: Array<{ url?: string; alt?: string | null; title?: string | null; kind?: string | null }>;
        };
      }
    | undefined;

  const isImageMedia = (item: { url?: string; kind?: string | null } | undefined) =>
    item?.url ? /\.(jpe?g|png|webp|gif)(\?|#|$)/i.test(item.url) : false;
  const candidate = [project?.media?.hero, ...(project?.media?.items || [])].find(isImageMedia);

  if (candidate?.url) {
    const fallbackAlt = `${name} project image`;
    return {
      url: candidate.url,
      alt: cleanMediaAlt(candidate.alt || candidate.title, fallbackAlt) || fallbackAlt,
    };
  }
  if (fallback) {
    return { url: fallback, alt: `${name} project image` };
  }
  return null;
}

const featuredProjectConfigs = [
  {
    slug: "goods",
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

  // Homepage order is intentional, don't let editorial feature reorder
  const orderedConfigs = featuredProjectConfigs;
  // Force homepage titles (wiki/flagship data overrides fallbacks, we want our curated names)
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
      {/* , , ,  1. HERO, Full-screen dark, farm drone video , , ,  */}
      <DocHero
        fullHeight
        gradientStrength="strong"
        eyebrow="A Curious Tractor · Jinibara Country"
        title="A Curious Tractor"
        subhead="Places, story systems, and public works you can step into. Regenerative innovation from a farm on Jinibara Country, co-designed with the people who will hold the work."
        coverVideo={{
          url: "/media/field-videos/hero-farm-aerial.mp4",
          posterUrl: "/media/field-stills/hero-farm-aerial.jpg",
          title: "Black Cockatoo Valley aerial through morning fog",
        }}
        primaryCta={{ label: "Explore projects", href: "/projects" }}
        statsAfter={
          <div className="flex flex-wrap gap-12 border-t border-[#FAFAF7]/10 pt-8">
            {[
              { n: "58", l: "Projects" },
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

      {/* , , ,  1b. AUDIENCE CHIPS, uniform grid, playful surprise tile , , ,  */}
      <section className="full-bleed border-b border-[var(--we-sand)] bg-[#F6F1E7] px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto flex max-w-[1100px] flex-col items-center text-center">
          <p className="font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.35em] text-[var(--we-warm-brown)]">
            I'm here to...
          </p>
          <p className="mt-3 font-[var(--font-body)] text-sm italic leading-relaxed text-[var(--we-warm-brown)]/80 md:text-[15px]">
            Pick the thing that pulled you here. Every door opens to somewhere real.
          </p>

          {/* 12 curated intents in a uniform grid: 2 cols mobile, 3 tablet, 4 desktop.
              Tiles all render identically; "Surprise me" gets its own playful slot below. */}
          <ul className="mt-10 grid w-full grid-cols-2 gap-2.5 md:grid-cols-3 md:gap-3 lg:grid-cols-4">
            {[
              { label: 'Partner', href: '/contact?type=project-partnership&source=home-audience' },
              { label: 'Support the work', href: '/contact?type=support&source=home-audience' },
              { label: 'Share a story', href: '/contact?type=share-your-story&source=home-audience' },
              { label: 'Research or write', href: '/wiki' },
              { label: 'Visit the farm', href: '/farm' },
              { label: 'Visit The Harvest', href: '/harvest' },
              { label: 'See some art', href: '/art' },
              { label: 'Be an artist', href: '/art' },
              { label: 'Have some fun', href: '/events' },
              { label: 'Find myself', href: '/stories' },
              { label: 'Buy a bed', href: '/goods' },
              { label: 'Buy a washing machine', href: '/goods' },
            ].map((chip) => (
              <li key={chip.label}>
                <Link
                  href={chip.href}
                  className="group flex h-full items-center justify-center rounded-[18px] border border-[var(--we-sand)] bg-white/90 px-4 py-4 font-[var(--font-sans)] text-[13px] font-medium text-[var(--we-olive)] transition-all hover:-translate-y-0.5 hover:border-[#4CAF50] hover:bg-white hover:shadow-[0_10px_28px_-12px_rgba(47,62,46,0.28)] md:min-h-[64px] md:text-[14px]"
                >
                  <span>{chip.label}</span>
                  <span
                    aria-hidden="true"
                    className="ml-2 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                  >
                    &rarr;
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Surprise me: distinct playful tile. Full width on mobile, wide pill on desktop.
              Inverted palette (dark olive on cream) signals "something different". */}
          <Link
            href="/surprise"
            className="group mt-4 inline-flex w-full items-center justify-center gap-3 rounded-[18px] border border-dashed border-[var(--we-olive)]/40 bg-[var(--we-olive)] px-8 py-4 font-[var(--font-sans)] text-[13px] font-semibold uppercase tracking-[0.22em] text-[#F3EBDD] transition-all hover:-translate-y-0.5 hover:border-[#CFA16B] hover:bg-[#1B2820] hover:shadow-[0_12px_32px_-14px_rgba(47,62,46,0.55)] md:mt-6 md:w-auto md:text-sm"
          >
            <span>Surprise me</span>
            <span
              aria-hidden="true"
              className="inline-block transition-transform duration-500 group-hover:rotate-[360deg]"
            >
              &rarr;
            </span>
          </Link>
        </div>
      </section>

      {/* , , ,  1c. WHO WE ARE, centred narrative, breathing, with full-bleed photo below , , ,  */}
      <section className="full-bleed bg-[#F6F1E7] px-8 pt-28 pb-20 md:pt-36 md:pb-24">
        <div className="mx-auto flex max-w-[900px] flex-col items-center text-center">
          <p className="font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.35em] text-[var(--we-warm-brown)]">
            What is A Curious Tractor?
          </p>
          <h2 className="mt-6 font-[var(--font-display)] text-[clamp(2rem,4.2vw,3.6rem)] font-semibold leading-[1.08] text-[var(--we-olive)]">
            A small studio that grows slowly, with the people who'll hold what we make.
          </h2>
          <div className="mt-10 h-px w-16 bg-[var(--we-warm-brown)]/40" />
          <p className="mt-10 max-w-[680px] font-[var(--font-body)] text-[18px] leading-[1.8] text-[var(--we-brown)] md:text-[19px]">
            We listen first. Stay long enough to notice what's missing.
            Build the thing with the communities who'll carry it. Hand
            over the keys when they're ready. Then move on.
          </p>
          <p className="mt-6 max-w-[680px] font-[var(--font-body)] text-[18px] leading-[1.8] text-[var(--we-brown)] md:text-[19px]">
            That shows up as a farm on Jinibara Country, a justice
            platform that lets programs be owned locally, a storytelling
            system built on consent, circular goods made close to place,
            an art line that makes it all legible, and a growing
            constellation of other places alongside.
          </p>

          {/* Design-with-community rhythm, the practice, stated plainly */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center">
            {["Listen", "Design with", "Hand over", "Move on"].map((step, i) => (
              <span key={step} className="inline-flex items-center gap-3">
                <span className="font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--we-olive)]">
                  {step}
                </span>
                {i < 3 && (
                  <span aria-hidden="true" className="text-[var(--we-warm-brown)]/40">
                    &rarr;
                  </span>
                )}
              </span>
            ))}
          </div>
          <p className="mt-4 max-w-[540px] font-[var(--font-body)] text-[14px] italic leading-[1.7] text-[var(--we-warm-brown)]">
            We design <em>with</em> community, not <em>for</em>. We leave when the work is ready to be held locally.
          </p>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-5">
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--we-olive)] px-7 py-3.5 font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition-transform hover:-translate-y-0.5"
            >
              Read the fuller story <span aria-hidden="true">&rarr;</span>
            </Link>
            <Link
              href="/method"
              className="inline-flex items-center gap-2 font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--we-olive)] transition-all hover:gap-3"
            >
              See the method <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* , , ,  1d. FULL-BLEED PHOTO BREAK, Jinibara Country, the ground of the work , , ,  */}
      <section className="full-bleed relative h-[70vh] min-h-[520px] w-full overflow-hidden md:h-[80vh]">
        <Image
          src="/media/field-stills/jinibara-country-aerial.jpg"
          alt="Aerial over Jinibara Country, forest edges, gathering spaces, and working paddocks"
          fill
          sizes="100vw"
          className="object-cover"
          priority={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 px-8 pb-12 md:pb-16">
          <div className="mx-auto max-w-[900px] text-center">
            <p className="font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.35em] text-[#CFA16B]">
              Jinibara Country · Witta
            </p>
            <p className="mt-3 font-[var(--font-display)] text-[clamp(1.2rem,2.2vw,1.8rem)] font-light italic leading-[1.4] text-[#F3EBDD]">
              Working country, not scenic backdrop.
            </p>
          </div>
        </div>
      </section>

      {/* , , ,  2. FLAGSHIP FIELDS, Editorial, no borders , , ,  */}
      <section className="px-8 py-28 md:py-36">
        <div className="mx-auto max-w-[1200px]">
          <SectionHeader
            eyebrow="Flagship projects"
            title="How the work meets the ground"
            eyebrowColor="muted"
          />
        </div>

        {/* Lead project, full-bleed image */}
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

        {/* Remaining projects, clean 2x2, text overlaid on image */}
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

      {/* , , ,  2b. VOICES FROM THE FIELD, centred title on top, 3-card grid, CTAs below , , ,  */}
      {homeEditorialFeature.leadArticle && (
        <section className="full-bleed bg-[var(--we-olive)] px-6 py-24 md:px-12 md:py-32 lg:px-20">
          {/* Centred header */}
          <div className="mx-auto flex max-w-[820px] flex-col items-center text-center">
            <p className="font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.35em] text-[#CFA16B]">
              Voices from the field
            </p>
            <h2 className="mt-4 font-[var(--font-display)] text-[clamp(1.9rem,3.4vw,2.8rem)] font-semibold leading-[1.1] text-[#F3EBDD]">
              Stories carried with consent, through the Empathy Ledger
            </h2>
            <div className="mt-8 h-px w-16 bg-[#CFA16B]/50" />
          </div>

          {/* Article grid: lead on left spans 2 rows, supporting stack on right (desktop).
              Mobile: stacks cleanly top-to-bottom. */}
          <div className="mx-auto mt-14 grid max-w-[1300px] gap-5 md:mt-20 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {/* Lead article, spans 2 columns on large */}
            <Link
              href={homeEditorialFeature.leadArticle.localPath || `/blog/${homeEditorialFeature.leadArticle.slug}`}
              className="group block overflow-hidden rounded-[24px] border border-[#CFA16B]/20 bg-[#1B2820] transition-all hover:-translate-y-1 hover:border-[#CFA16B]/50 hover:shadow-[0_20px_60px_-24px_rgba(0,0,0,0.6)] md:col-span-2 md:row-span-2 lg:col-span-2 lg:row-span-2"
            >
              <div className="relative aspect-[16/9] overflow-hidden md:aspect-[16/10]">
                {homeEditorialFeature.leadArticle.featuredImageUrl ? (
                  <Image
                    src={homeEditorialFeature.leadArticle.featuredImageUrl}
                    alt={homeEditorialFeature.leadArticle.featuredImageAlt || homeEditorialFeature.leadArticle.title}
                    fill
                    sizes="(min-width: 1024px) 66vw, (min-width: 768px) 100vw, 100vw"
                    className="object-cover transition-transform duration-[8s] group-hover:scale-[1.02]"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[#11110F]">
                    <span className="font-[var(--font-sans)] text-[10px] uppercase tracking-[0.3em] text-[#CFA16B]/40">
                      Editorial
                    </span>
                  </div>
                )}
              </div>
              <div className="space-y-4 p-7 md:p-10">
                <p className="font-[var(--font-sans)] text-[10px] font-semibold uppercase tracking-[0.3em] text-[#CFA16B]">
                  {homeEditorialFeature.leadArticle.articleType || "Editorial"}
                </p>
                <h3 className="font-[var(--font-display)] text-[clamp(1.4rem,2.4vw,2rem)] font-semibold leading-[1.2] text-[#F3EBDD] transition-colors group-hover:text-white">
                  {homeEditorialFeature.leadArticle.title}
                </h3>
                {homeEditorialFeature.leadArticle.excerpt && (
                  <p className="font-[var(--font-body)] text-[15px] leading-[1.75] text-[#E0D4B9] md:text-[16px]">
                    {homeEditorialFeature.leadArticle.excerpt}
                  </p>
                )}
                <div className="flex items-center justify-between pt-2">
                  <p className="font-[var(--font-sans)] text-[11px] uppercase tracking-[0.18em] text-[#CFA16B]/80">
                    By {homeEditorialFeature.leadArticle.authorName}
                  </p>
                  <span className="inline-flex items-center gap-2 font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.2em] text-[#F3EBDD] transition-all group-hover:gap-3">
                    Read <span aria-hidden="true">&rarr;</span>
                  </span>
                </div>
              </div>
            </Link>

            {/* Supporting cards, stack on the right on desktop */}
            {homeEditorialFeature.supportingArticles.map((article) => (
              <Link
                key={article.slug}
                href={article.localPath || `/blog/${article.slug}`}
                className="group flex flex-col overflow-hidden rounded-[24px] border border-[#CFA16B]/20 bg-[#1B2820] transition-all hover:-translate-y-1 hover:border-[#CFA16B]/50 hover:shadow-[0_20px_60px_-24px_rgba(0,0,0,0.6)]"
              >
                {article.featuredImageUrl ? (
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={article.featuredImageUrl}
                      alt={article.featuredImageAlt || article.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-[8s] group-hover:scale-[1.03]"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-[16/9] items-center justify-center bg-[#11110F]">
                    <span className="font-[var(--font-sans)] text-[10px] uppercase tracking-[0.3em] text-[#CFA16B]/40">
                      Editorial
                    </span>
                  </div>
                )}
                <div className="flex flex-1 flex-col space-y-3 p-6">
                  <p className="font-[var(--font-sans)] text-[10px] font-semibold uppercase tracking-[0.3em] text-[#CFA16B]">
                    {article.articleType || "Editorial"}
                  </p>
                  <h4 className="font-[var(--font-display)] text-xl font-semibold leading-tight text-[#F3EBDD] transition-colors group-hover:text-white">
                    {article.title}
                  </h4>
                  {article.excerpt && (
                    <p className="line-clamp-3 font-[var(--font-body)] text-sm leading-[1.7] text-[#E0D4B9]">
                      {article.excerpt}
                    </p>
                  )}
                  <span className="mt-auto inline-flex items-center gap-2 pt-2 font-[var(--font-sans)] text-[10px] font-semibold uppercase tracking-[0.2em] text-[#CFA16B] transition-all group-hover:gap-3 group-hover:text-[#E0B680]">
                    Read <span aria-hidden="true">&rarr;</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Centred CTAs below the grid */}
          {/* Launch hold (2026-05-27): "Meet the storytellers" CTA removed while
              the /storytellers surface is held. Restore alongside that surface. */}
          <div className="mx-auto mt-14 flex max-w-[820px] flex-wrap items-center justify-center gap-4 md:mt-20 md:gap-6">
            <Link
              href="/stories"
              className="inline-flex items-center gap-2 rounded-full border border-[#CFA16B]/60 bg-[#CFA16B]/5 px-7 py-3.5 font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.22em] text-[#F3EBDD] transition-all hover:-translate-y-0.5 hover:border-[#CFA16B] hover:bg-[#CFA16B]/15 hover:gap-3 md:text-sm"
            >
              Read all stories <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </section>
      )}

      {/* , , ,  3. ART CALLOUT, Full-bleed dark , , ,  */}
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
                  Installation, photography, film, sculpture, performance: art as
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

      {/* , , ,  3b. GLIMPSES FROM THE FIELD, gapless mosaic of non-flagship projects , , ,  */}
      <section className="full-bleed bg-[#11110F]">
        <div className="flex flex-wrap items-end justify-between gap-6 px-8 pt-28 pb-10 md:px-16 md:pt-36 md:pb-14 lg:px-24">
          <div className="max-w-2xl">
            <p className="font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.3em] text-[#CFA16B]">
              More from the field
            </p>
            <h2 className="mt-3 font-[var(--font-display)] text-[clamp(1.8rem,3vw,2.4rem)] font-semibold leading-[1.15] text-[#F3EBDD]">
              The wider ecosystem, by hand and over time.
            </h2>
            <p className="mt-4 font-[var(--font-body)] text-[15px] leading-[1.7] text-[#E0D4B9]">
              Beyond the flagships, a constellation of places, practices, and works alongside community.
            </p>
          </div>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.22em] text-[#CFA16B] transition-all hover:gap-3 hover:text-[#E0B680]"
          >
            All projects <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        {/*
          Gapless mosaic. 4×3 cells on desktop, 2×? on mobile.
          Lead tile spans 2×2, filling the top-left quadrant.
          Remaining 8 tiles are 1×1, packing around it with no gaps.
          Hover reveals the project name with a subtle dark overlay.
        */}
        <div className="grid grid-cols-2 md:grid-cols-4 md:grid-rows-[repeat(3,minmax(0,1fr))] md:aspect-[4/3]">
          {mosaicTiles.map((tile, i) => {
            const img = resolveMosaicImage(tile.slug, tile.name, tile.override, tile.fallback);
            const isLead = i === 0;
            // Each tile gets a stable slot id so the image-override JSON can
            // remember which image belongs to which mosaic position.
            const slot = `home-mosaic-${tile.slug}`;
            return (
              <div
                key={tile.slug}
                className={`group relative overflow-hidden bg-[#1B1A16] ${
                  isLead
                    ? "aspect-[4/5] md:aspect-auto md:col-span-2 md:row-span-2"
                    : "aspect-square"
                }`}
              >
                {img ? (
                  <EditableImage
                    src={img.url}
                    alt={img.alt || tile.name}
                    slot={slot}
                    projectSlug={tile.slug}
                    fill
                    sizes={isLead ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 25vw, 50vw"}
                    className="object-cover transition-transform duration-[6s] ease-out group-hover:scale-[1.04]"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[#11110F]">
                    <span className="font-[var(--font-sans)] text-[10px] uppercase tracking-[0.3em] text-[#CFA16B]/40">
                      {tile.name}
                    </span>
                  </div>
                )}
                {/* Base gradient keeps the mosaic legible even before hover */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-90" />
                {/* Hover label */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4 md:p-5">
                  <p className="translate-y-2 font-[var(--font-sans)] text-[10px] font-semibold uppercase tracking-[0.3em] text-[#CFA16B] opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    Explore
                  </p>
                  <p className={`translate-y-1 font-[var(--font-display)] leading-tight text-[#F3EBDD] opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 ${isLead ? "text-lg md:text-2xl" : "text-base md:text-lg"}`}>
                    {tile.name}
                  </p>
                </div>
                {/* Navigate link sits on top of visual layers but below the pencil
                    button (which is z-10 inside EditableImage) so admin edits stay reachable. */}
                <Link
                  href={tile.href}
                  aria-label={`Explore ${tile.name}`}
                  className="absolute inset-0 z-[5]"
                />
              </div>
            );
          })}
        </div>

        <p className="px-8 pt-12 pb-28 text-center font-[var(--font-body)] text-[13px] italic leading-[1.7] text-[#CFA16B]/80 md:pb-36">
          Every tile is a living project. Click through to the people, the place, and the work alongside community.
        </p>
      </section>

      {/* , , ,  4. LCAA METHOD, Typographic, no boxes , , ,  */}
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

      {/* , , ,  5. INVITATION, Three paths , , ,  */}
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
