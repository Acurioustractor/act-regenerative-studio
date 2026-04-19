import Link from "next/link";

import { SiteLoopVideo } from "@/components/media/SiteLoopVideo";
import type { EnrichedProject } from "@/lib/projects/get-project-data";
import { getProjectFieldMedia } from "@/lib/projects/get-project-field-media";
import type { LiveFeaturedWork } from "@/lib/works/live-featured-works";
import type { ACTFlagshipPackPerson } from "@/types/shared/act-flagship-project-pack";

interface ProjectEntryBridgeSectionProps {
  project: EnrichedProject;
  relatedWorks?: LiveFeaturedWork[];
}

function hasMediaPreview(project: EnrichedProject) {
  const media = getProjectFieldMedia(project);
  return media.images.length > 0 || !!media.video;
}

export function ProjectEntryBridgeSection({
  project,
  relatedWorks = [],
}: ProjectEntryBridgeSectionProps) {
  const liveMeta = project.empathyLedgerContent?.meta;
  const flagshipPack = project.flagshipPack;
  const fieldMedia = getProjectFieldMedia(project);
  const previewImages = fieldMedia.images.slice(0, 3);
  const flagshipSummary =
    flagshipPack?.summary ||
    flagshipPack?.whatItIs ||
    flagshipPack?.overview ||
    null;
  const canonicalFieldPath = `/projects/${project.slug}`;
  const sourceCodeUrl =
    flagshipPack?.implementation.primaryRepo?.githubUrl || project.projectRepoUrl || null;
  const leadPeople = (flagshipPack?.keyPeople || [])
    .slice(0, 3)
    .map((person: ACTFlagshipPackPerson) => person.title)
    .filter(Boolean);
  const canInlineVideo =
    !!fieldMedia.video &&
    (fieldMedia.video.url.startsWith("/media/") ||
      fieldMedia.video.url.endsWith(".mp4") ||
      fieldMedia.video.url.endsWith(".webm"));
  const hasLiveContent =
    !!liveMeta &&
    (liveMeta.story_count > 0 ||
      liveMeta.storyteller_count > 0 ||
      liveMeta.media_count > 0);

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-[#D9C9A9] bg-[#F6F1E7]/80 p-6 md:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--we-brown-deep)]">
              Living project system
            </p>
            <h2 className="font-[var(--font-display)] text-2xl font-semibold text-[var(--we-olive)]">
              This route is tied to the same flagship field, wiki, and story graph
            </h2>
            <p className="text-sm leading-7 text-[var(--we-brown)]">
              The durable memory of this project lives in the ACT wiki. Approved
              stories, media, and voices flow in through Empathy Ledger. This
              page is one entry point into that living system, not a separate
              brochure.
            </p>
            {flagshipSummary ? (
              <div className="rounded-2xl border border-[var(--we-sand)] bg-white/70 px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--we-warm-brown)]">
                  Canonical field brief
                </p>
                <p className="mt-3 text-sm leading-7 text-[var(--we-brown)]">
                  {flagshipSummary}
                </p>
              </div>
            ) : null}
            <div className="flex flex-wrap gap-3">
              <Link
                href={canonicalFieldPath}
                className="rounded-full bg-[#4CAF50] px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#3E9845]"
              >
                Open flagship field
              </Link>
              <Link
                href={`/wiki/${project.slug}`}
                className="rounded-full border border-[#4CAF50] px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--we-olive)] transition hover:bg-[#E5F4E4]"
              >
                Open wiki entry
              </Link>
              {project.projectWebsiteUrl ? (
                <a
                  href={project.projectWebsiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-[#CFA16B] px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--we-olive)] transition hover:bg-[#F8E8D6]"
                >
                  Visit project website
                </a>
              ) : null}
              {sourceCodeUrl ? (
                <a
                  href={sourceCodeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-[#D9C9A9] bg-white/70 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--we-olive)] transition hover:bg-white"
                >
                  Source code
                </a>
              ) : null}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {flagshipPack?.status || project.wikiData?.status ? (
                <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[var(--we-brown-deep)]">
                  Status: {flagshipPack?.status || project.wikiData?.status}
                </span>
              ) : null}
              {project.wikiData?.tier ? (
                <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[var(--we-brown-deep)]">
                  Tier: {project.wikiData.tier}
                </span>
              ) : null}
              {flagshipPack?.canonicalCode || project.wikiData?.code ? (
                <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[var(--we-brown-deep)]">
                  Code: {flagshipPack?.canonicalCode || project.wikiData?.code}
                </span>
              ) : null}
              {liveMeta?.source ? (
                <span className="rounded-full bg-[#EDF6EC] px-3 py-1 text-xs font-medium text-[var(--we-olive)]">
                  {liveMeta.source === "site-syndication"
                    ? "Site-scoped syndication"
                    : "Content Hub fallback"}
                </span>
              ) : null}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-white/70 px-4 py-4">
                <p className="text-lg font-semibold text-[var(--we-olive)]">
                  {liveMeta?.storyteller_count || 0}
                </p>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--we-warm-brown)]">
                  Voices
                </p>
              </div>
              <div className="rounded-2xl bg-white/70 px-4 py-4">
                <p className="text-lg font-semibold text-[var(--we-olive)]">
                  {liveMeta?.story_count || 0}
                </p>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--we-warm-brown)]">
                  Stories
                </p>
              </div>
              <div className="rounded-2xl bg-white/70 px-4 py-4">
                <p className="text-lg font-semibold text-[var(--we-olive)]">
                  {liveMeta?.media_count || 0}
                </p>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--we-warm-brown)]">
                  Media items
                </p>
              </div>
              <div className="rounded-2xl bg-white/70 px-4 py-4">
                <p className="text-lg font-semibold text-[var(--we-olive)]">
                  {relatedWorks.length}
                </p>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--we-warm-brown)]">
                  Related works
                </p>
              </div>
            </div>

            {flagshipPack ? (
              <div className="rounded-2xl border border-[var(--we-sand)] bg-white/70 px-4 py-4">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-[#F6F1E7] px-3 py-1 text-[11px] font-medium text-[var(--we-brown-deep)]">
                    {flagshipPack.sourceBridges.length} source bridge
                    {flagshipPack.sourceBridges.length === 1 ? "" : "s"}
                  </span>
                  <span className="rounded-full bg-[#F6F1E7] px-3 py-1 text-[11px] font-medium text-[var(--we-brown-deep)]">
                    {flagshipPack.keyPeople.length} key people
                  </span>
                </div>
                {leadPeople.length > 0 ? (
                  <p className="mt-3 text-sm leading-7 text-[var(--we-brown)]">
                    Key people: {leadPeople.join(", ")}
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {(hasMediaPreview(project) || relatedWorks.length > 0 || hasLiveContent) && (
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          {fieldMedia.images.length > 0 || fieldMedia.video ? (
            <div className="rounded-3xl border border-[var(--we-sand)] bg-white/80 p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--we-warm-brown)]">
                From the field
              </p>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-[#5F4E3F]">
                This preview now follows the same curated field sequence as the
                full project page: real motion first where it exists, then
                supporting stills that hold place, people, and material
                conditions together.
              </p>
              <div className="mt-4 space-y-4">
                {fieldMedia.video ? (
                  <a
                    href={fieldMedia.video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative block overflow-hidden rounded-[28px] border border-[#2F2A25] bg-[#171612] text-[#F3EBDD]"
                  >
                    <div className="absolute inset-0">
                      {canInlineVideo ? (
                        <SiteLoopVideo
                          src={fieldMedia.video.url}
                          poster={fieldMedia.video.posterUrl || undefined}
                          title={fieldMedia.video.title}
                          className="h-full w-full object-cover opacity-80"
                          preload="metadata"
                        />
                      ) : fieldMedia.video.posterUrl ? (
                        <img
                          src={fieldMedia.video.posterUrl}
                          alt={fieldMedia.video.title}
                          className="h-full w-full object-cover opacity-75 transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : null}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
                    </div>
                    <div className="relative flex min-h-[240px] flex-col justify-between p-5 md:min-h-[280px]">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-2">
                          <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#F3EBDD] backdrop-blur-sm">
                            {fieldMedia.video.eyebrow}
                          </span>
                          {fieldMedia.video.sourceTitle ? (
                            <p className="text-[11px] uppercase tracking-[0.18em] text-[#D7C8B2]">
                              {fieldMedia.video.sourceTitle}
                            </p>
                          ) : null}
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm">
                          <svg className="ml-0.5 h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M8 5.14v13.72c0 .72.78 1.17 1.4.81l10.2-6.86a.94.94 0 0 0 0-1.62L9.4 4.33A.94.94 0 0 0 8 5.14Z" />
                          </svg>
                        </div>
                      </div>
                      <div className="max-w-xl">
                        <h3 className="font-[var(--font-display)] text-2xl font-semibold leading-tight text-white">
                          {fieldMedia.video.title}
                        </h3>
                        <p className="mt-3 text-sm leading-7 text-[#D7C8B2]">
                          Let the moving image do some of the narrative work before the page asks for interpretation.
                        </p>
                      </div>
                    </div>
                  </a>
                ) : null}

                {previewImages.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {previewImages.map((item) => (
                      <a
                        key={item.id}
                        href={item.href}
                        target={item.href.startsWith("http") ? "_blank" : undefined}
                        rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="group overflow-hidden rounded-[24px] border border-[var(--we-sand)] bg-[#FDFBF7]"
                      >
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <img
                            src={item.url}
                            alt={item.alt}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                          <div className="absolute left-4 top-4 rounded-full bg-black/55 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
                            {item.eyebrow}
                          </div>
                        </div>
                        <div className="space-y-2 p-4">
                          {item.sourceTitle ? (
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7A9B76]">
                              {item.sourceTitle}
                            </p>
                          ) : null}
                          <p className="line-clamp-3 text-sm leading-6 text-[var(--we-brown)]">
                            {item.caption || project.title}
                          </p>
                        </div>
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}

          {(relatedWorks.length > 0 || hasLiveContent) ? (
            <div className="rounded-3xl border border-[#2F2A25] bg-[#171612] p-5 text-[#F3EBDD]">
              <p className="text-xs uppercase tracking-[0.3em] text-[#CFA16B]">
                Studio line
              </p>
              <h3 className="mt-2 font-[var(--font-display)] text-xl font-semibold">
                Related works and live signals
              </h3>
              <div className="mt-4 space-y-3">
                {relatedWorks.slice(0, 3).map((work) => (
                  <Link
                    key={work.slug}
                    href={work.href}
                    className="block rounded-2xl border border-[#4A3B2E] bg-[#11110F] px-4 py-4 transition hover:border-[#CFA16B]"
                  >
                    <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[#CFA16B]">
                      <span>{work.medium}</span>
                      <span className="text-[#6E6257]">•</span>
                      <span>{work.connectedTo}</span>
                    </div>
                    <p className="mt-2 font-semibold text-[#F3EBDD]">{work.title}</p>
                    <p className="mt-1 line-clamp-2 text-sm text-[#D7C8B2]">
                      {work.description}
                    </p>
                  </Link>
                ))}
                {hasLiveContent ? (
                  <p className="text-sm leading-7 text-[#D7C8B2]">
                    Approved content from Empathy Ledger can keep this route
                    fresh with new portraits, clips, interviews, and field
                    material as the work grows.
                  </p>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}
