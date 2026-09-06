import { describeStatus, relativeTime, type SiteState } from "@/lib/sites/site-state";

const TONE_TEXT: Record<ReturnType<typeof describeStatus>["tone"], string> = {
  good: "text-forest",
  warn: "text-[#8A5A1B]",
  bad: "text-[#B4462F]",
  muted: "text-[var(--we-brown)]",
};

/**
 * Operator view of ecosystem_sites: one row per ACT site with code, status,
 * last production deploy and last check. Broken sites sort first.
 */
export function SiteStateTable({ sites }: { sites: SiteState[] }) {
  if (!sites.length) {
    return (
      <p className="text-sm text-[var(--we-brown)]">
        No site rows yet. The infra Vercel sync writes them; the webhook keeps them current.
      </p>
    );
  }
  const order: Record<SiteState["status"], number> = { broken: 0, building: 1, unknown: 2, canceled: 3, live: 4, external: 5, archived: 6 };
  const rows = [...sites].sort((a, b) => order[a.status] - order[b.status] || a.name.localeCompare(b.name));
  const checked = rows.map((r) => r.lastCheckAt).filter(Boolean).sort().at(-1) ?? null;

  return (
    <div className="space-y-3">
      <p className="text-xs text-[var(--we-brown)]">
        {rows.length} sites{checked ? ` · last checked ${relativeTime(checked) ?? checked}` : ""}
      </p>
      <div className="overflow-x-auto rounded-2xl border border-[var(--we-sand)] bg-white/70">
        <table className="w-full text-sm">
          <thead className="text-left text-[11px] uppercase tracking-[0.15em] text-[var(--we-warm-brown)]">
            <tr>
              <th className="px-4 py-3">Site</th>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Last deploy</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((site) => {
              const { label, tone } = describeStatus(site.status);
              return (
                <tr key={site.slug} className="border-t border-[var(--we-sand)]">
                  <td className="px-4 py-3">
                    {site.url ? (
                      <a href={site.url} className="font-medium text-[var(--we-olive)] hover:text-forest" rel="noopener noreferrer">
                        {site.name}
                      </a>
                    ) : (
                      <span className="font-medium text-[var(--we-olive)]">{site.name}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-[var(--we-brown)]">{site.projectCode}</td>
                  <td className={`px-4 py-3 font-medium ${TONE_TEXT[tone]}`}>{label}</td>
                  <td className="px-4 py-3 text-[var(--we-brown)]">
                    {relativeTime(site.lastDeploymentAt) ?? "—"}
                    {site.lastDeploymentAt ? (
                      <span className="ml-2 text-xs opacity-70">{site.lastDeploymentAt.slice(0, 10)}</span>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
