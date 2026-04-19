import type { ProjectTheme } from '@/data/projects';
import { SiteLoopVideo } from '@/components/media/SiteLoopVideo';
import { themeStyles } from '@/lib/projects';
import type { ProjectFieldMediaSet } from '@/lib/projects/get-project-field-media';

interface ProjectFieldMediaSectionProps {
  projectTitle: string;
  media: ProjectFieldMediaSet;
  projectWebsiteUrl?: string | null;
}

export function ProjectFieldMediaSection({
  projectTitle,
  media,
  projectWebsiteUrl,
}: ProjectFieldMediaSectionProps) {
  if (media.images.length === 0 && !media.video) {
    return null;
  }

  const style = themeStyles[media.theme as ProjectTheme];
  const [leadImage, ...supportImages] = media.images;
  const canInlineVideo =
    !!media.video &&
    (media.video.url.startsWith('/media/') ||
      media.video.url.endsWith('.mp4') ||
      media.video.url.endsWith('.webm'));

  return (
    <section className="grid gap-6 lg:grid-cols-[1.12fr_0.88fr]">
      {leadImage ? (
        <a
          href={leadImage.href}
          target={leadImage.href.startsWith('http') ? '_blank' : undefined}
          rel={leadImage.href.startsWith('http') ? 'noopener noreferrer' : undefined}
          className="group relative overflow-hidden rounded-[34px] border border-[#D9C9A9] bg-[#11110F]"
        >
          <div className="absolute inset-0">
            <img
              src={leadImage.url}
              alt={leadImage.alt}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
          </div>
          <div className="relative flex min-h-[420px] flex-col justify-end p-7 md:min-h-[500px]">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white backdrop-blur-sm">
                  {leadImage.eyebrow}
                </span>
                {leadImage.sourceTitle ? (
                  <span className="rounded-full border border-white/20 bg-black/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/85 backdrop-blur-sm">
                    {leadImage.sourceTitle}
                  </span>
                ) : null}
              </div>
              <div className="max-w-2xl">
                <h2 className="font-[var(--font-display)] text-[2rem] font-semibold leading-tight text-white md:text-[2.5rem]">
                  {projectTitle}
                </h2>
                <p className="mt-3 text-sm leading-7 text-white/80 md:text-base">
                  {leadImage.caption ||
                    `${projectTitle} should feel grounded in the places, people, and material conditions it is working with.`}
                </p>
              </div>
            </div>
          </div>
        </a>
      ) : null}

      <div className="space-y-6">
        {media.video ? (
          <a
            href={media.video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block overflow-hidden rounded-[30px] border border-[#2F2A25] bg-[#171612] text-[#F3EBDD]"
          >
            <div className="absolute inset-0">
              {canInlineVideo ? (
                <SiteLoopVideo
                  src={media.video.url}
                  poster={media.video.posterUrl || undefined}
                  title={media.video.title}
                  className="h-full w-full object-cover opacity-80"
                  preload="metadata"
                />
              ) : media.video.posterUrl ? (
                <img
                  src={media.video.posterUrl}
                  alt={media.video.title}
                  className="h-full w-full object-cover opacity-70 transition-transform duration-700 group-hover:scale-105"
                />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-black/35 to-black/80" />
            </div>
            <div className="relative flex min-h-[250px] flex-col justify-between p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#F3EBDD] backdrop-blur-sm">
                    {media.video.eyebrow}
                  </span>
                  {media.video.sourceTitle ? (
                    <p className="text-xs uppercase tracking-[0.18em] text-[#D7C8B2]">
                      {media.video.sourceTitle}
                    </p>
                  ) : null}
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm">
                  <svg className="ml-1 h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M8 5.14v13.72c0 .72.78 1.17 1.4.81l10.2-6.86a.94.94 0 0 0 0-1.62L9.4 4.33A.94.94 0 0 0 8 5.14Z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="font-[var(--font-display)] text-2xl font-semibold leading-tight">
                  {media.video.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#D7C8B2]">
                  Open the footage and let the moving image carry some of the texture that a project page alone cannot.
                </p>
                <span
                  className={`mt-4 inline-flex items-center rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] ${style.badge}`}
                >
                  Open footage
                </span>
              </div>
            </div>
          </a>
        ) : null}

        {supportImages.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {supportImages.map((item) => (
              <a
                key={item.id}
                href={item.href}
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="group overflow-hidden rounded-[26px] border border-[var(--we-sand)] bg-[#FDFBF7]"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={item.url}
                    alt={item.alt}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
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
                    {item.caption || projectTitle}
                  </p>
                </div>
              </a>
            ))}
          </div>
        ) : null}

        {projectWebsiteUrl ? (
          <a
            href={projectWebsiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="site-glow-link flex items-center justify-between rounded-[24px] border border-[#D6C19A] bg-[#F8F1E5] px-5 py-4 text-[var(--we-olive)] transition hover:bg-white"
          >
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7A9B76]">
                Dedicated project surface
              </p>
              <p className="mt-1 text-sm leading-6 text-[var(--we-brown)]">
                Jump to the project’s own public site when you need the deeper spoke, not just the ACT hub framing.
              </p>
            </div>
            <span className="text-sm font-semibold uppercase tracking-[0.18em]">
              Visit site
            </span>
          </a>
        ) : null}
      </div>
    </section>
  );
}
