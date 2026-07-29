import Image from 'next/image';
import Link from 'next/link';
import { SiteLoopVideo } from '@/components/media/SiteLoopVideo';

interface Project {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  hubHref: string;
  repo: string | null;
  url: string | null;
  status: 'active' | 'development' | 'planning';
  lcaaPhase: 'listen' | 'curiosity' | 'action' | 'art';
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

const toneBySlug: Record<
  string,
  {
    card: string;
    title: string;
    tagline: string;
    body: string;
    muted: string;
    softPill: string;
    strongAction: string;
    outlineAction: string;
    status: string;
  }
> = {
  justicehub: {
    card: 'border-[#365440] bg-gradient-to-br from-[#121b15] via-[#1a2c21] to-[#274432] text-[#f4ecde]',
    title: 'text-[#fff8ed]',
    tagline: 'text-[#9dd0a0]',
    body: 'text-[#d7c8b2]',
    muted: 'text-[#b6a894]',
    softPill: 'bg-[#294131] text-[#e0f1e2]',
    strongAction: 'bg-[#f4d04f] text-[#0b1f2a] hover:bg-[#f7de72]',
    outlineAction: 'border-[#627b67] text-[#f4ecde] hover:bg-[#243327]',
    status: 'bg-[#f4d04f] text-[#0b1f2a]',
  },
  'goods': {
    card: 'border-[#d5bf9e] bg-gradient-to-br from-[#f3e9da] via-[#eadbc5] to-[#dfc8aa] text-[#261e16]',
    title: 'text-[#261e16]',
    tagline: 'text-[#8c4d28]',
    body: 'text-[#514235]',
    muted: 'text-[#735d49]',
    softPill: 'bg-[#f5efe5] text-[#5a4a3a]',
    strongAction: 'bg-[#a24a2e] text-white hover:bg-[#8b3f28]',
    outlineAction: 'border-[#c08f66] text-[#3b2f28] hover:bg-white/70',
    status: 'bg-[#a24a2e] text-white',
  },
  'the-harvest': {
    card: 'border-[#dcc7a7] bg-gradient-to-br from-[#f8f1e8] via-[#efe3d2] to-[#e7d8bf] text-[#241c14]',
    title: 'text-[#241c14]',
    tagline: 'text-[#a35e25]',
    body: 'text-[#514235]',
    muted: 'text-[#735d49]',
    softPill: 'bg-white/70 text-[#5a4a3a]',
    strongAction: 'bg-[#b15b20] text-white hover:bg-[#964d1b]',
    outlineAction: 'border-[#caa173] text-[#3c2e24] hover:bg-white/75',
    status: 'bg-[#b15b20] text-white',
  },
  'empathy-ledger': {
    card: 'border-[#5a4b3d] bg-gradient-to-br from-[#181614] via-[#211c18] to-[#30291f] text-[#f4ecde]',
    title: 'text-[#fff7ee]',
    tagline: 'text-[#cfa16b]',
    body: 'text-[#d7c8b2]',
    muted: 'text-[#b6a894]',
    softPill: 'bg-[#322a22] text-[#f0dfc6]',
    strongAction: 'bg-[#2d6a4f] text-white hover:bg-[#245741]',
    outlineAction: 'border-[#6c5e4f] text-[#f4ecde] hover:bg-[#27211c]',
    status: 'bg-[#2d6a4f] text-white',
  },
  'black-cockatoo-valley': {
    card: 'border-[#bbcfb5] bg-gradient-to-br from-[#edf2e7] via-[#dce7d7] to-[#cadac4] text-[#233022]',
    title: 'text-[#233022]',
    tagline: 'text-[#3d7a4d]',
    body: 'text-[#425641]',
    muted: 'text-[#647662]',
    softPill: 'bg-white/70 text-[#45614d]',
    strongAction: 'bg-[#3d7a4d] text-white hover:bg-[#32623e]',
    outlineAction: 'border-[#88aa8c] text-[#233022] hover:bg-white/70',
    status: 'bg-[#3d7a4d] text-white',
  },
};

export function ProjectShowcaseCard({ project }: { project: Project }) {
  const tone =
    toneBySlug[project.slug] ?? {
      card: 'border-[var(--we-sand)] bg-white/90 text-[var(--we-olive)]',
      title: 'text-[var(--we-olive)]',
      tagline: 'text-[#2d6a4f]',
      body: 'text-[var(--we-brown)]',
      muted: 'text-[#6b5a45]',
      softPill: 'bg-[#F5F1E8] text-[var(--we-brown)]',
      strongAction: 'bg-[var(--we-olive)] text-white hover:bg-[#263425]',
      outlineAction: 'border-[#4CAF50] text-[var(--we-olive)] hover:bg-[#4CAF50]/10',
      status: 'bg-[var(--we-olive)] text-white',
    };

  const leadTheme = project.tags[0] || 'Project';
  const visibleSignals = [
    project.liveSignals?.storyCount
      ? `${project.liveSignals.storyCount} stories`
      : null,
    project.liveSignals?.mediaCount
      ? `${project.liveSignals.mediaCount} images & clips`
      : null,
    project.liveSignals?.totalWorkCount
      ? `${project.liveSignals.totalWorkCount} works`
      : null,
    project.liveSignals?.serviceConnectionCount
      ? `${project.liveSignals.serviceConnectionCount} ways in`
      : null,
  ].filter((value): value is string => Boolean(value));

  return (
    <div
      className={`group site-glow-link rounded-[30px] border p-7 transition-all hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(50,42,31,0.14)] ${tone.card}`}
    >
      {project.previewMedia ? (
        <div className="mb-6 space-y-3">
          <div className="relative overflow-hidden rounded-[24px] border border-current/10 bg-black/10 aspect-[16/9]">
            {project.previewMedia.kind === 'video' ? (
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
                sizes="(min-width: 1280px) 40vw, (min-width: 768px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
            )}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
              {project.mediaEmphasis ? (
                <span className="rounded-full border border-white/15 bg-black/35 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-[#f3ebdd]">
                  Field media
                </span>
              ) : null}
              {project.previewMedia.kind === 'video' ? (
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
                  className="group/image overflow-hidden rounded-[18px] border border-current/10 bg-white/35"
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

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className={`text-[0.68rem] font-semibold uppercase tracking-[0.24em] ${tone.muted}`}>
            {leadTheme}
          </p>
          <h3 className={`mt-4 text-[2rem] font-semibold leading-[1.02] font-[var(--font-display)] ${tone.title}`}>
            {project.name}
          </h3>
          <p className={`mt-3 text-sm font-semibold ${tone.tagline}`}>{project.tagline}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${tone.status}`}>
          Flagship
        </span>
      </div>

      {/* Description */}
      <p className={`mt-5 text-sm leading-7 ${tone.body}`}>
        {project.description}
      </p>

      {/* Tags */}
      <div className="mt-5 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className={`rounded-full px-3 py-1 text-xs ${tone.softPill}`}
          >
            {tag}
          </span>
        ))}
      </div>

      {visibleSignals.length > 0 ? (
        <div className="mt-5 rounded-[20px] border border-current/10 bg-black/5 px-4 py-4">
          <p className={`text-[0.68rem] font-semibold uppercase tracking-[0.24em] ${tone.muted}`}>
            Visible here
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {visibleSignals.map((signal) => (
              <span
                key={signal}
                className={`rounded-full px-3 py-1 text-xs font-medium ${tone.softPill}`}
              >
                {signal}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {/* Actions */}
      <div className="mt-7 flex flex-wrap gap-2">
        <Link
          href={project.hubHref}
          className={`site-glow-link rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider ${tone.strongAction}`}
        >
          Open field
        </Link>
        {project.url && (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`site-glow-link rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wider ${tone.outlineAction}`}
          >
            Visit site
          </a>
        )}
        {project.repo && (
          <a
            href={`https://github.com/${project.repo}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`site-glow-link rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wider ${tone.outlineAction}`}
          >
            Source trail
          </a>
        )}
      </div>
    </div>
  );
}
