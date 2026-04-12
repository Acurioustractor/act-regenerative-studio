import Link from "next/link";
import LivingSystemStrip from "@/components/LivingSystemStrip";
import { SiteLoopVideo } from "@/components/media/SiteLoopVideo";
import SectionHeading from "../../components/SectionHeading";
import {
  getFeaturedWorks,
  getFeaturedWorkVoiceFragments,
} from "@/lib/works/live-featured-works";

const workFormats = [
  "Installations",
  "Exhibitions",
  "Commissions",
  "Residencies",
  "Voice and transcript works",
  "Objects and editions",
];

const collaborators = [
  {
    title: "Artists and cultural practitioners",
    description:
      "People working with ACT through residencies, commissions, and place-based collaborations.",
    href: "/art/artists",
  },
  {
    title: "Community collaborators",
    description:
      "Elders, storytellers, families, and local practitioners shaping the form and ethics of the work.",
    href: "/projects",
  },
  {
    title: "Project-connected works",
    description:
      "Pieces that grow out of JusticeHub, Empathy Ledger, the farm, or other live ACT initiatives.",
    href: "/projects",
  },
];

const collaborationPaths = [
  {
    title: "Residencies on Jinibara Country",
    description:
      "Slow, place-based time for artists, researchers, and collaborators whose work needs land, listening, and room to test.",
    href: "/farm/retreats",
    cta: "Explore residencies",
  },
  {
    title: "Social-change commissions",
    description:
      "Projects, installations, and public works that help a place, community, or institution handle difficult realities differently.",
    href: "/contact",
    cta: "Commission a work",
  },
];

const fallbackVoiceFragments = [
  {
    text: "A work can be an object, an encounter, a gathering, or a pressure point.",
    attribution: "ACT Studio",
    href: "/art",
  },
  {
    text: "We use art to make hidden realities felt in public life.",
    attribution: "ACT Studio",
    href: "/art",
  },
  {
    text: "Some ACT outputs are not platforms. They are things you enter, hear, hold, or remember.",
    attribution: "ACT Studio",
    href: "/art",
  },
];

function formatLiveSource(source: "site-syndication" | "content-hub" | null) {
  if (source === "site-syndication") return "Site-scoped live feed";
  if (source === "content-hub") return "Content Hub fallback";
  return null;
}

type LiveSourceLabel = Exclude<ReturnType<typeof formatLiveSource>, null>;

export default async function ArtPage() {
  const featuredWorks = await getFeaturedWorks();
  const leadWork =
    featuredWorks.find((work) => work.previewMedia?.kind === "video") ||
    featuredWorks[0] ||
    null;
  const supportWorks = featuredWorks
    .filter((work) => work.slug !== leadWork?.slug)
    .slice(0, 2);
  const voiceFragments = getFeaturedWorkVoiceFragments(featuredWorks, 3);
  const archiveFragments =
    voiceFragments.length > 0 ? voiceFragments : fallbackVoiceFragments;
  const liveSources = Array.from(
    new Set(
      featuredWorks
        .map((work) => formatLiveSource(work.live.source))
        .filter((value): value is LiveSourceLabel => value !== null)
    )
  );

  return (
    <div className="space-y-20">
      <section className="rounded-[32px] border border-[#2F2A25] bg-[#11110F] px-8 py-10 text-[#F3EBDD] md:px-12 md:py-14">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <p className="text-xs uppercase tracking-[0.4em] text-[#CFA16B]">
              Works
            </p>
            <h1 className="font-[var(--font-display)] text-4xl font-semibold leading-tight md:text-6xl">
              Art that carries story into public life
            </h1>
            <p className="max-w-3xl text-lg text-[#D7C8B2] md:text-xl">
              Our works emerge from listening, collaboration, and pressure. Some
              are installations. Some are commissions. Some are voice archives,
              images, objects, or gatherings. All of them try to make hidden
              realities felt.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="#selected-works"
                className="rounded-full bg-[#CFA16B] px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#11110F] transition hover:bg-[#E0B680]"
              >
                View selected works
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-[#CFA16B] px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#F3EBDD] transition hover:bg-[#1B1A16]"
              >
                Commission a project
              </Link>
            </div>
          </div>

          {leadWork ? (
            <Link
              href={leadWork.href}
              className="group relative overflow-hidden rounded-3xl border border-[#5B4634] bg-[#191815]"
            >
              <div className="absolute inset-0">
                {leadWork.previewMedia?.kind === "video" ? (
                  <SiteLoopVideo
                    src={leadWork.previewMedia.url}
                    poster={leadWork.previewMedia.thumbnailUrl || undefined}
                    title={leadWork.previewMedia.alt || leadWork.title}
                    preload="metadata"
                    className="h-full w-full object-cover opacity-85 transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                ) : leadWork.previewMedia ? (
                  <img
                    src={leadWork.previewMedia.thumbnailUrl || leadWork.previewMedia.url}
                    alt={leadWork.previewMedia.alt || leadWork.title}
                    className="h-full w-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                ) : null}
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,8,0.16)_0%,rgba(10,10,8,0.26)_34%,rgba(10,10,8,0.86)_100%)]" />
              </div>
              <div className="relative flex min-h-[460px] flex-col justify-between p-6 md:min-h-[520px]">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/15 bg-black/35 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-[#f3ebdd]">
                    Lead work
                  </span>
                  <span className="rounded-full border border-white/15 bg-black/35 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-[#f3ebdd]">
                    {leadWork.medium}
                  </span>
                  {leadWork.previewMedia?.kind === "video" ? (
                    <span className="rounded-full border border-white/15 bg-black/35 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-[#f3ebdd]">
                      Video
                    </span>
                  ) : null}
                </div>
                <div className="space-y-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-[#CFA16B]">
                    Cinematic lead
                  </p>
                  <div>
                    <h2 className="font-[var(--font-display)] text-3xl font-semibold leading-tight text-white md:text-[2.7rem]">
                      {leadWork.title}
                    </h2>
                    <p className="mt-3 max-w-xl text-sm font-semibold text-[#cfa16b]">
                      {leadWork.place} • {leadWork.connectedTo}
                    </p>
                    <p className="mt-4 max-w-xl text-sm leading-7 text-[#e6d8c6]">
                      {leadWork.description}
                    </p>
                  </div>
                  {leadWork.supportingMedia.length > 0 ? (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {leadWork.supportingMedia.map((item) => (
                        <div
                          key={item.url}
                          className="overflow-hidden rounded-[20px] border border-white/10 bg-black/20"
                        >
                          <div className="relative aspect-[4/3] overflow-hidden">
                            <img
                              src={item.url}
                              alt={item.alt}
                              className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent" />
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
                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#fff2e4] transition group-hover:gap-3">
                    <span>Enter the work</span>
                    <span aria-hidden="true">→</span>
                  </div>
                </div>
              </div>
            </Link>
          ) : (
            <div className="rounded-3xl border border-[#5B4634] bg-[#191815] p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-[#CFA16B]">
                Voice archive
              </p>
              <div className="mt-4 space-y-4">
                {archiveFragments.map((fragment) => (
                  <Link
                    key={`${fragment.attribution}-${fragment.text}`}
                    href={fragment.href}
                    className="block border-l border-[#CFA16B]/50 pl-4 transition hover:border-[#E0B680]"
                  >
                    <p className="text-sm leading-relaxed text-[#F3EBDD]">
                      {fragment.text}
                    </p>
                    <p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-[#BDAE98]">
                      {fragment.attribution}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {supportWorks.length > 0 ? (
        <section className="grid gap-4 md:grid-cols-2">
          {supportWorks.map((work) => {
            const supportStill =
              work.supportingMedia[0] ||
              (work.previewMedia?.thumbnailUrl || work.previewMedia?.url
                ? {
                    url: work.previewMedia.thumbnailUrl || work.previewMedia.url,
                    alt: work.previewMedia.alt || work.title,
                  }
                : null);

            return (
              <Link
                key={work.slug}
                href={work.href}
                className="group relative overflow-hidden rounded-[28px] border border-[#D8C7A5] bg-[#171612] text-[#F3EBDD]"
              >
                {supportStill ? (
                  <>
                    <div className="absolute inset-0">
                      <img
                        src={supportStill.url}
                        alt={supportStill.alt}
                        className="h-full w-full object-cover opacity-75 transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,8,0.12)_0%,rgba(10,10,8,0.24)_34%,rgba(10,10,8,0.82)_100%)]" />
                    </div>
                    <div className="relative flex min-h-[250px] flex-col justify-end p-6">
                      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-[#CFA16B]">
                        {work.medium}
                      </p>
                      <h3 className="mt-3 font-[var(--font-display)] text-[1.85rem] font-semibold leading-[1.04] text-white">
                        {work.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#eadfce]">
                        {work.description}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="flex min-h-[250px] flex-col justify-end bg-[#191815] p-6">
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-[#CFA16B]">
                      {work.medium}
                    </p>
                    <h3 className="mt-3 font-[var(--font-display)] text-[1.85rem] font-semibold leading-[1.04] text-white">
                      {work.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#eadfce]">
                      {work.description}
                    </p>
                  </div>
                )}
              </Link>
            );
          })}
        </section>
      ) : null}

      <LivingSystemStrip
        eyebrow="Living works system"
        title="Works that stay connected to memory, consent, and field material"
        description="The core framing of each work is grounded in the ACT wiki. Approved photos, video, transcript fragments, and voice can keep arriving through Empathy Ledger as the works evolve. The studio site is the public surface, not the place where that memory has to be manually rebuilt."
        wiki={{
          href: "/wiki",
          label: "Open ACT wiki",
        }}
        live={{
          sourceLabel:
            liveSources.length > 0 ? `Live sources: ${liveSources.join(" + ")}` : null,
          storyCount: featuredWorks.reduce((sum, work) => sum + work.live.storyCount, 0),
          storytellerCount: featuredWorks.reduce(
            (sum, work) => sum + work.live.storytellerCount,
            0
          ),
          mediaCount: featuredWorks.reduce((sum, work) => sum + work.live.mediaCount, 0),
          href: `${process.env.NEXT_PUBLIC_EMPATHY_LEDGER_URL || "https://empathyledger.com"}/projects`,
        }}
        stats={[
          {
            label: "Wiki-backed works",
            value: featuredWorks.filter((work) => work.project?.wikiData).length,
          },
        ]}
      />

      <section id="selected-works" className="space-y-10">
        <SectionHeading
          eyebrow="Selected works"
          title="Installations, encounters, and public experiments"
          description="Each work is a project in the ACT ecosystem. The core framing comes from the wiki; approved photos, video, and voice fragments can keep flowing in from Empathy Ledger as the work evolves."
        />
        <div className="grid gap-6 lg:grid-cols-2">
          {featuredWorks.map((work) => (
            <Link
              key={work.slug}
              href={work.href}
              className="group overflow-hidden rounded-[28px] border border-[#E1D3BA] bg-white/80 transition hover:-translate-y-1 hover:border-[#4CAF50] hover:shadow-[0_20px_50px_rgba(50,42,31,0.12)]"
            >
              {work.previewMedia ? (
                work.previewMedia.kind === "image" ? (
                  <img
                    src={work.previewMedia.thumbnailUrl || work.previewMedia.url}
                    alt={work.previewMedia.alt || work.title}
                    className="h-60 w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                ) : (
                  <div className="relative h-60 overflow-hidden bg-[#171612]">
                    {work.previewMedia.kind === "video" ? (
                      <SiteLoopVideo
                        src={work.previewMedia.url}
                        poster={work.previewMedia.thumbnailUrl || undefined}
                        title={work.previewMedia.alt || work.title}
                        preload="metadata"
                        className="h-full w-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                    ) : work.previewMedia.thumbnailUrl ? (
                      <img
                        src={work.previewMedia.thumbnailUrl}
                        alt={work.previewMedia.alt || work.title}
                        className="h-full w-full object-cover opacity-70 transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 rounded-full bg-black/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white">
                      {work.previewMedia.kind}
                    </div>
                  </div>
                )
              ) : (
                <div className="flex h-60 items-end bg-gradient-to-br from-[#F6F1E7] via-[#E7DDC7] to-[#D7C4A2] p-6">
                  <p className="text-sm uppercase tracking-[0.24em] text-[#6B5A45]">
                    Live project surface
                  </p>
                </div>
              )}

              <div className="space-y-5 p-8">
                <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.2em] text-[#6B5A45]">
                  <span>{work.medium}</span>
                  <span>•</span>
                  <span>{work.place}</span>
                  {formatLiveSource(work.live.source) ? (
                    <>
                      <span>•</span>
                      <span>{formatLiveSource(work.live.source)}</span>
                    </>
                  ) : null}
                </div>

                <div>
                  <h2 className="font-[var(--font-display)] text-3xl font-semibold text-[#2F3E2E]">
                    {work.title}
                  </h2>
                  <p className="mt-3 text-sm text-[#4D3F33]">{work.description}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-[#F6F1E7] px-3 py-1 text-xs font-medium text-[#4A4035]">
                    {work.collaborators}
                  </span>
                  {work.project?.wikiData ? (
                    <span className="rounded-full bg-[#EDF6EC] px-3 py-1 text-xs font-medium text-[#2F3E2E]">
                      Wiki-backed
                    </span>
                  ) : null}
                  {work.live.storyCount > 0 ? (
                    <span className="rounded-full bg-[#F6F1E7] px-3 py-1 text-xs font-medium text-[#4A4035]">
                      {work.live.storyCount} stories
                    </span>
                  ) : null}
                  {work.live.mediaCount > 0 ? (
                    <span className="rounded-full bg-[#F6F1E7] px-3 py-1 text-xs font-medium text-[#4A4035]">
                      {work.live.mediaCount} media
                    </span>
                  ) : null}
                </div>

                <p className="border-l border-[#D8C7A5] pl-4 text-sm italic text-[#5A4A3A]">
                  {work.quote}
                </p>

                {work.supportingMedia.length > 0 ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {work.supportingMedia.map((item) => (
                      <div
                        key={item.url}
                        className="overflow-hidden rounded-[18px] border border-[#E3D4BA] bg-[#FDFBF7]"
                      >
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <img
                            src={item.url}
                            alt={item.alt}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          />
                          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/55 to-transparent" />
                          {item.eyebrow ? (
                            <div className="absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-white">
                              {item.eyebrow}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}

                <div className="flex items-center justify-between gap-3">
                  <div className="text-[11px] uppercase tracking-[0.22em] text-[#6B5A45]">
                    Connected to {work.connectedTo}
                  </div>
                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#2F3E2E] transition group-hover:gap-3">
                    <span>View work</span>
                    <span aria-hidden="true">→</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-10">
        <SectionHeading
          eyebrow="Formats"
          title="How the work shows up"
          description="We are less interested in categories than in what form a work needs to take. These are the formats we return to most often."
        />
        <div className="flex flex-wrap gap-3">
          {workFormats.map((format) => (
            <div
              key={format}
              className="rounded-full border border-[#D8C7A5] bg-white/75 px-4 py-3 text-sm text-[#2F3E2E]"
            >
              {format}
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-10">
        <SectionHeading
          eyebrow="Collaborators"
          title="Artists, Elders, storytellers, and collaborators"
          description="ACT works are made with people, not around them. Collaboration is part of the form."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {collaborators.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group rounded-3xl border border-[#E1D3BA] bg-white/75 p-7 transition hover:-translate-y-1 hover:border-[#4CAF50] hover:shadow-[0_18px_45px_rgba(50,42,31,0.1)]"
            >
              <h3 className="font-[var(--font-display)] text-xl font-semibold text-[#2F3E2E]">
                {item.title}
              </h3>
              <p className="mt-3 text-sm text-[#4D3F33]">{item.description}</p>
              <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#2F3E2E] transition group-hover:gap-3">
                <span>Explore</span>
                <span aria-hidden="true">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-[#E3D4BA] bg-gradient-to-br from-[#F6F1E7] via-[#E7DDC7] to-[#D7C4A2] p-8 md:p-12">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-[#6B5A45]">
              Residencies and commissions
            </p>
            <h2 className="font-[var(--font-display)] text-3xl font-semibold text-[#2F3E2E] md:text-4xl">
              Two ways into the work
            </h2>
            <p className="text-sm text-[#4D3F33]">
              Some works need the quiet and duration of a residency. Others are
              built in direct response to a place, campaign, institution, or
              public question.
            </p>
          </div>
          <div className="grid gap-4">
            {collaborationPaths.map((path) => (
              <Link
                key={path.title}
                href={path.href}
                className="group rounded-3xl border border-[#D8C7A5] bg-white/75 p-6 transition hover:-translate-y-1 hover:border-[#4CAF50]"
              >
                <h3 className="font-semibold text-[#2F3E2E]">{path.title}</h3>
                <p className="mt-2 text-sm text-[#4D3F33]">{path.description}</p>
                <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#4CAF50] transition group-hover:gap-3">
                  <span>{path.cta}</span>
                  <span aria-hidden="true">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[32px] border border-[#2F2A25] bg-[#11110F] px-8 py-10 text-[#F3EBDD] md:px-12 md:py-14">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-[#CFA16B]">
              Archive
            </p>
            <h2 className="font-[var(--font-display)] text-3xl font-semibold md:text-4xl">
              Voice, transcript, and documentation
            </h2>
            <p className="text-sm text-[#D7C8B2]">
              Some works travel through transcript fragments, audio traces,
              notes, and documentary residue. This archive layer matters because
              it keeps the work connected to voice and memory.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {archiveFragments.map((fragment) => (
              <Link
                key={`${fragment.attribution}-${fragment.text}-archive`}
                href={fragment.href}
                className="rounded-3xl border border-[#4A3B2E] bg-[#171612] p-5 text-sm leading-relaxed text-[#F3EBDD] transition hover:border-[#CFA16B]"
              >
                <p>{fragment.text}</p>
                <p className="mt-4 text-[11px] uppercase tracking-[0.22em] text-[#BDAE98]">
                  {fragment.attribution}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
