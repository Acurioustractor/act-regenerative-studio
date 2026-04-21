import Link from 'next/link';
import { projects } from '@/data/projects';
import featuredSnapshot from '@/data/empathy-ledger-featured.generated.json';

interface OrgBlock {
  org: { slug: string; name: string; id: string };
  media?: { items?: Array<{ kind: string }> };
}

interface ProjectBlock {
  media?: { items?: Array<{ kind: string }> };
  featured?: {
    stories?: unknown[];
    storytellers?: unknown[];
  };
}

interface Snapshot {
  organizations?: Record<string, OrgBlock | null>;
  projects: Record<string, ProjectBlock | null>;
}

export const metadata = {
  title: 'Empathy Ledger Coverage · ACT Admin',
};

export default function EmpathyLedgerCoveragePage() {
  const snapshot = featuredSnapshot as unknown as Snapshot;
  const orgsData = snapshot.organizations || {};
  const projectsData = snapshot.projects || {};

  const rows = projects.map((p) => {
    const el = p.empathyLedger;
    const orgBlock = el ? orgsData[el.orgSlug] : null;
    const projectBlock = projectsData[p.slug];
    const orgItems = orgBlock?.media?.items || [];
    const photos = orgItems.filter((m) => m.kind === 'image').length;
    const videos = orgItems.filter((m) => m.kind === 'video').length;
    const stories = projectBlock?.featured?.stories?.length || 0;
    const storytellers = projectBlock?.featured?.storytellers?.length || 0;
    const isDefault =
      el?.orgSlug === 'a-curious-tractor' && !!el.notes;

    return {
      slug: p.slug,
      title: p.title,
      mapped: !!el,
      orgSlug: el?.orgSlug || null,
      orgName: orgBlock?.org?.name || null,
      notes: el?.notes || null,
      isDefault,
      photos,
      videos,
      stories,
      storytellers,
    };
  });

  const stats = {
    total: rows.length,
    mapped: rows.filter((r) => r.mapped).length,
    unmapped: rows.filter((r) => !r.mapped).length,
    specific: rows.filter((r) => r.mapped && !r.isDefault).length,
    default: rows.filter((r) => r.isDefault).length,
  };

  const orgUsage = new Map<string, number>();
  for (const r of rows) {
    if (r.orgSlug) orgUsage.set(r.orgSlug, (orgUsage.get(r.orgSlug) || 0) + 1);
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] px-6 py-12 md:px-10">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--we-warm-brown,#8a6a3f)]">
            Admin / Audit
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-[var(--we-olive,#5a6b3a)]">
            Empathy Ledger Coverage
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-[var(--we-brown,#5a4a3a)]">
            Every ACT project should link to an Empathy Ledger organisation so
            the team has direct access to media, stories, and storytellers when
            reflecting, writing stories, or building pages. This page shows
            which projects are specifically mapped versus defaulted to the ACT
            parent org.
          </p>
        </header>

        <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard label="Total projects" value={stats.total} />
          <StatCard label="Specifically mapped" value={stats.specific} tone="good" />
          <StatCard label="Defaulted to parent" value={stats.default} tone="warn" />
          <StatCard label="Unmapped" value={stats.unmapped} tone={stats.unmapped === 0 ? 'good' : 'bad'} />
        </div>

        <section className="mb-10">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--we-warm-brown,#8a6a3f)]">
            EL org usage across ACT projects
          </h2>
          <div className="flex flex-wrap gap-2">
            {[...orgUsage.entries()]
              .sort((a, b) => b[1] - a[1])
              .map(([slug, count]) => (
                <span
                  key={slug}
                  className="rounded-full border border-[var(--we-sand,#D7C4A2)] bg-white px-3 py-1 text-xs text-[var(--we-brown,#5a4a3a)]"
                >
                  {slug} <span className="ml-1 opacity-50">×{count}</span>
                </span>
              ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--we-warm-brown,#8a6a3f)]">
            Projects ({rows.length})
          </h2>
          <div className="overflow-hidden rounded-2xl border border-[var(--we-sand,#D7C4A2)] bg-white">
            <table className="w-full text-sm">
              <thead className="bg-[var(--we-cream,#F6F1E7)] text-left">
                <tr>
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--we-warm-brown,#8a6a3f)]">Project</th>
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--we-warm-brown,#8a6a3f)]">EL org</th>
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--we-warm-brown,#8a6a3f)]">Photos</th>
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--we-warm-brown,#8a6a3f)]">Videos</th>
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--we-warm-brown,#8a6a3f)]">Stories</th>
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--we-warm-brown,#8a6a3f)]">Tellers</th>
                </tr>
              </thead>
              <tbody>
                {rows
                  .sort((a, b) => {
                    // Unmapped first, then defaults, then specific mappings
                    if (!a.mapped && b.mapped) return -1;
                    if (a.mapped && !b.mapped) return 1;
                    if (a.isDefault && !b.isDefault) return -1;
                    if (!a.isDefault && b.isDefault) return 1;
                    return a.title.localeCompare(b.title);
                  })
                  .map((r, idx) => (
                    <tr
                      key={r.slug}
                      className={`border-t border-[var(--we-sand,#D7C4A2)] ${
                        idx % 2 === 1 ? 'bg-[#FDFBF7]' : ''
                      }`}
                    >
                      <td className="px-4 py-3">
                        <Link
                          href={`/projects/${r.slug}`}
                          className="font-medium text-[var(--we-olive,#5a6b3a)] hover:underline"
                        >
                          {r.title}
                        </Link>
                        <p className="text-[11px] text-[var(--we-brown,#5a4a3a)] opacity-60">{r.slug}</p>
                        {r.notes && (
                          <p className="mt-1 text-[11px] italic text-amber-700">{r.notes}</p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {!r.mapped ? (
                          <span className="rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-medium text-red-700">
                            Unmapped
                          </span>
                        ) : r.isDefault ? (
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-800">
                            {r.orgSlug} (default)
                          </span>
                        ) : (
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-800">
                            {r.orgSlug}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--we-brown,#5a4a3a)]">{r.photos}</td>
                      <td className="px-4 py-3 text-xs text-[var(--we-brown,#5a4a3a)]">{r.videos}</td>
                      <td className="px-4 py-3 text-xs text-[var(--we-brown,#5a4a3a)]">{r.stories}</td>
                      <td className="px-4 py-3 text-xs text-[var(--we-brown,#5a4a3a)]">{r.storytellers}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-[var(--we-sand,#D7C4A2)] bg-white p-6">
          <h2 className="mb-2 text-base font-semibold text-[var(--we-olive,#5a6b3a)]">
            Refining a mapping
          </h2>
          <ol className="list-decimal space-y-1 pl-5 text-sm text-[var(--we-brown,#5a4a3a)]">
            <li>Find the project in <code className="rounded bg-[var(--we-cream,#F6F1E7)] px-1">src/data/projects.ts</code>.</li>
            <li>Update its <code className="rounded bg-[var(--we-cream,#F6F1E7)] px-1">empathyLedger.orgSlug</code> to the correct EL org slug.</li>
            <li>Optionally add <code className="rounded bg-[var(--we-cream,#F6F1E7)] px-1">elProjectSlugs: [...]</code> for specific EL projects to deep-link.</li>
            <li>Remove the <code className="rounded bg-[var(--we-cream,#F6F1E7)] px-1">notes</code> field once confirmed.</li>
            <li>Run <code className="rounded bg-[var(--we-cream,#F6F1E7)] px-1">npm run sync:el-media</code> and reload the page.</li>
          </ol>
        </section>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone?: 'good' | 'warn' | 'bad';
}) {
  const toneClass =
    tone === 'good'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
      : tone === 'warn'
      ? 'border-amber-200 bg-amber-50 text-amber-900'
      : tone === 'bad'
      ? 'border-red-200 bg-red-50 text-red-900'
      : 'border-[var(--we-sand,#D7C4A2)] bg-white text-[var(--we-brown,#5a4a3a)]';

  return (
    <div className={`rounded-2xl border p-4 ${toneClass}`}>
      <p className="text-[10px] font-semibold uppercase tracking-wider opacity-70">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}
