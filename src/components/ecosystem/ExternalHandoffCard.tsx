import Link from 'next/link';

interface ExternalHandoffCardProps {
  platformName: string;
  url: string;
  whatHappensThere: string;
  whyComeBack: string;
  linkLabel?: string;
}

/**
 * Frames the handoff between this hub page (where the story and context live)
 * and an external live platform (where the community actually does the thing).
 * Placed just below the hero on /farm, /harvest, /goods, /empathy-ledger,
 * /justicehub so a visitor knows why they&rsquo;d leave and why they&rsquo;d return.
 */
export function ExternalHandoffCard({
  platformName,
  url,
  whatHappensThere,
  whyComeBack,
  linkLabel,
}: ExternalHandoffCardProps) {
  return (
    <section className="mx-auto max-w-[1100px] px-6 py-6">
      <div className="rounded-[20px] border border-[var(--we-sand)] bg-[var(--warm-paper-bright)] px-6 py-5 md:flex md:items-center md:justify-between md:gap-8 md:px-8">
        <div className="space-y-2 md:flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--we-warm-brown)]">
            Where to go for what
          </p>
          <p className="text-sm leading-6 text-[var(--we-brown)]">
            <span className="font-semibold text-[var(--we-olive)]">
              {platformName}
            </span>{' '}
            is where {whatHappensThere}. Come back here for {whyComeBack}.
          </p>
        </div>
        <Link
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex shrink-0 items-center gap-2 rounded-full bg-[var(--we-olive)] px-5 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#3d5130] md:mt-0"
        >
          {linkLabel || `Visit ${platformName}`}
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </section>
  );
}
