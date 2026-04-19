import Link from "next/link";

type LiveMeta = {
  sourceLabel?: string | null;
  siteLabel?: string | null;
  storyCount?: number;
  storytellerCount?: number;
  mediaCount?: number;
  fetchedAt?: string | null;
  href?: string | null;
};

type WikiMeta = {
  href: string;
  label?: string;
  status?: string | null;
  code?: string | null;
  tier?: string | null;
};

interface LivingSystemStripProps {
  eyebrow?: string;
  title: string;
  description: string;
  wiki?: WikiMeta | null;
  live?: LiveMeta | null;
  site?: {
    href: string;
    label?: string;
  } | null;
  stats?: Array<{ label: string; value: string | number }>;
}

function renderPill(value: string) {
  return (
    <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-medium text-[var(--we-brown-deep)]">
      {value}
    </span>
  );
}

export default function LivingSystemStrip({
  eyebrow = "Living system",
  title,
  description,
  wiki,
  live,
  site,
  stats = [],
}: LivingSystemStripProps) {
  const hasLive =
    !!live &&
    ((live.storyCount || 0) > 0 ||
      (live.storytellerCount || 0) > 0 ||
      (live.mediaCount || 0) > 0 ||
      !!live.sourceLabel);

  const hasStats = stats.length > 0;

  return (
    <section className="rounded-3xl border border-[#D9C9A9] bg-[#F6F1E7]/85 p-6 md:p-8">
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--we-brown-deep)]">
            {eyebrow}
          </p>
          <div className="space-y-3">
            <h2 className="font-[var(--font-display)] text-2xl font-semibold text-[var(--we-olive)]">
              {title}
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-[var(--we-brown)]">
              {description}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {wiki ? (
              <Link
                href={wiki.href}
                className="rounded-full bg-[#4CAF50] px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#3E9845]"
              >
                {wiki.label || "Open wiki memory"}
              </Link>
            ) : null}
            {live?.href ? (
              <a
                href={live.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-[#4CAF50] px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--we-olive)] transition hover:bg-[#E5F4E4]"
              >
                Open live story layer
              </a>
            ) : null}
            {site?.href ? (
              <a
                href={site.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-[#CFA16B] px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--we-olive)] transition hover:bg-[#F8E8D6]"
              >
                {site.label || "Visit project website"}
              </a>
            ) : null}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {wiki?.status ? renderPill(`Status: ${wiki.status}`) : null}
            {wiki?.code ? renderPill(`Code: ${wiki.code}`) : null}
            {wiki?.tier ? renderPill(`Tier: ${wiki.tier}`) : null}
            {live?.sourceLabel ? renderPill(live.sourceLabel) : null}
            {live?.siteLabel ? renderPill(live.siteLabel) : null}
            {live?.fetchedAt
              ? renderPill(
                  `Updated ${new Date(live.fetchedAt).toLocaleDateString("en-AU")}`
                )
              : null}
          </div>

          {(hasLive || hasStats) && (
            <div className="grid gap-3 sm:grid-cols-2">
              {hasLive && (live?.storytellerCount || 0) > 0 ? (
                <div className="rounded-2xl bg-white/70 px-4 py-4">
                  <p className="text-lg font-semibold text-[var(--we-olive)]">
                    {live?.storytellerCount || 0}
                  </p>
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--we-warm-brown)]">
                    Voices
                  </p>
                </div>
              ) : null}
              {hasLive && (live?.storyCount || 0) > 0 ? (
                <div className="rounded-2xl bg-white/70 px-4 py-4">
                  <p className="text-lg font-semibold text-[var(--we-olive)]">
                    {live?.storyCount || 0}
                  </p>
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--we-warm-brown)]">
                    Stories
                  </p>
                </div>
              ) : null}
              {hasLive && (live?.mediaCount || 0) > 0 ? (
                <div className="rounded-2xl bg-white/70 px-4 py-4">
                  <p className="text-lg font-semibold text-[var(--we-olive)]">
                    {live?.mediaCount || 0}
                  </p>
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--we-warm-brown)]">
                    Media items
                  </p>
                </div>
              ) : null}
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl bg-white/70 px-4 py-4"
                >
                  <p className="text-lg font-semibold text-[var(--we-olive)]">
                    {stat.value}
                  </p>
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--we-warm-brown)]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
