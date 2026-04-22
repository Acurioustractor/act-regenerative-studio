import Link from "next/link";

export const metadata = {
  title: "Pending EL Stories · ACT Admin",
};

export default function PendingElStoriesPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] px-6 py-12 md:px-10">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--we-warm-brown,#8a6a3f)]">
            Admin / Editorial queue
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-[var(--we-olive,#5a6b3a)]">
            Pending EL stories
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-[var(--we-brown,#5a4a3a)]">
            New stories captured in Empathy Ledger appear here once an
            <code className="mx-1 rounded bg-[var(--we-cream,#F6F1E7)] px-1 py-0.5 text-[12px]">
              approved_for_act_site
            </code>
            flag exists on the EL side. The team reviews each one and approves
            it before it can flow into the public ACT site sync.
          </p>
        </header>

        <section className="rounded-2xl border border-amber-300/50 bg-amber-50/60 p-6">
          <h2 className="text-base font-semibold text-amber-900">
            Waiting on EL API support
          </h2>
          <p className="mt-2 text-sm leading-6 text-amber-900/80">
            The endpoint that returns unapproved stories
            (<code className="rounded bg-white/70 px-1 py-0.5 text-[12px]">/api/v1/content-hub/pending</code>)
            does not exist yet. Once the EL repo ships the schema migration and
            the new endpoint, this page will list everything pending review with
            an inline approve action.
          </p>
          <p className="mt-3 text-sm leading-6 text-amber-900/80">
            Until then, all EL content tied to a mapped ACT project flows into
            the site sync automatically — the curation gate is not enforced.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/admin/empathy-ledger-coverage"
              className="inline-flex items-center gap-1.5 rounded-full border border-amber-700/30 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-amber-900 transition hover:bg-white"
            >
              View coverage dashboard
            </Link>
            <a
              href="https://github.com/Acurioustractor/empathy-ledger-v2/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-amber-700/30 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-amber-900 transition hover:bg-white"
            >
              Open EL issue tracker
            </a>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-[var(--we-sand,#D7C4A2)] bg-white/80 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--we-warm-brown,#8a6a3f)]">
            Workflow design
          </h2>
          <p className="mt-3 text-sm leading-6 text-[var(--we-brown,#5a4a3a)]">
            Full design lives at{" "}
            <code className="rounded bg-[var(--we-cream,#F6F1E7)] px-1 py-0.5 text-[12px]">
              thoughts/shared/plans/el-editorial-approval-workflow.md
            </code>
            . Summary:
          </p>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-[var(--we-brown,#5a4a3a)]">
            <li>
              <strong>EL schema</strong> — add{" "}
              <code className="text-[12px]">approved_for_act_site</code> +{" "}
              <code className="text-[12px]">approved_at</code> +{" "}
              <code className="text-[12px]">approved_by</code> to{" "}
              <code className="text-[12px]">stories</code> and{" "}
              <code className="text-[12px]">media</code>; backfill all existing
              rows as approved (one-time).
            </li>
            <li>
              <strong>EL API</strong> — content-hub endpoints accept{" "}
              <code className="text-[12px]">?approved_for=act-regenerative-studio</code>{" "}
              and a new{" "}
              <code className="text-[12px]">/api/v1/content-hub/pending</code>{" "}
              endpoint returns the queue (admin-only).
            </li>
            <li>
              <strong>ACT sync</strong> — three sync scripts add the{" "}
              <code className="text-[12px]">approved_for</code> param behind an{" "}
              <code className="text-[12px]">EL_APPROVAL_GATE</code> env flag.
            </li>
            <li>
              <strong>This page</strong> — fetches the pending queue, lets the
              team approve in one click; deep-links to EL for full context.
            </li>
          </ol>
        </section>
      </div>
    </div>
  );
}
