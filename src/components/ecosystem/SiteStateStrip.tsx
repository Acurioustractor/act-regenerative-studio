import SectionHeading from "@/components/SectionHeading";
import { describeStatus, relativeTime, type SiteState } from "@/lib/sites/site-state";

const TONE_DOT: Record<ReturnType<typeof describeStatus>["tone"], string> = {
  good: "bg-forest",
  warn: "bg-[var(--warm-gold)]",
  bad: "bg-[#B4462F]",
  muted: "bg-[#B9AE9C]",
};

/**
 * Every ACT site and whether it is up right now. Rendered only when the shared
 * database answered; an empty list hides the section.
 */
export function SiteStateStrip({ sites }: { sites: SiteState[] }) {
  if (!sites.length) return null;
  const attention = sites.filter((s) => s.status === "broken").length;

  return (
    <section className="space-y-8">
      <SectionHeading
        eyebrow="Sites"
        title="Every site, right now"
        description={
          attention
            ? `${sites.length} sites. ${attention} need${attention === 1 ? "s" : ""} attention.`
            : `${sites.length} sites, all online.`
        }
      />
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {sites.map((site) => {
          const { label, tone } = describeStatus(site.status);
          const updated = relativeTime(site.lastDeploymentAt);
          const inner = (
            <>
              <span className="flex items-center gap-2">
                <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full ${TONE_DOT[tone]}`} />
                <span className="font-medium text-[var(--we-olive)]">{site.name}</span>
              </span>
              <span className="mt-1 block text-xs text-[var(--we-brown)]">
                {label}
                {updated ? ` · updated ${updated}` : ""}
              </span>
            </>
          );
          return (
            <li key={site.slug} className="rounded-2xl border border-[var(--warm-sand-line)] bg-white/80 px-4 py-3 text-sm">
              {site.url ? (
                <a href={site.url} className="block transition hover:text-forest" rel="noopener noreferrer">
                  {inner}
                </a>
              ) : (
                <span className="block">{inner}</span>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
