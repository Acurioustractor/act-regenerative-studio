import PageHero from "../../components/PageHero";

export const metadata = {
  title: "Privacy + Consent | A Curious Tractor",
  description:
    "Interim public summary of how ACT handles enquiries, consented stories, media, and cultural material across the studio website and linked project surfaces.",
};

export default function PrivacyPage() {
  return (
    <div className="space-y-16">
      <PageHero
        eyebrow="Privacy + consent"
        title="Privacy and cultural data care"
        description="This is an interim public summary of how ACT handles enquiries, consented stories, media, and cultural material across the studio website and linked project surfaces. It is not a substitute for project-specific agreements or fuller legal terms where those apply."
        actions={[{ label: "Contact us", href: "/contact" }]}
      >
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-[#6B5A45]">
            What matters most
          </p>
          <ul className="space-y-2">
            <li>Consent is specific, ongoing, and revocable where possible.</li>
            <li>Community knowledge is not treated as free raw material.</li>
            <li>Public project memory and private participant data are not the same thing.</li>
          </ul>
        </div>
      </PageHero>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-[#E3D4BA] bg-white/80 p-8 text-sm leading-7 text-[#4D3F33]">
          <h2 className="font-[var(--font-display)] text-2xl font-semibold text-[#2F3E2E]">
            What this covers
          </h2>
          <p className="mt-4">
            This site may collect information you choose to share through contact,
            residency, CSA, workshop, or stay forms. Some ACT pages also surface
            approved stories, media, and documentation that originate in project
            workflows such as Empathy Ledger.
          </p>
          <p>
            The ACT wiki is used as durable public project memory. It is not the
            place where private participant records or restricted story permissions
            are stored.
          </p>
        </div>

        <div className="rounded-3xl border border-[#E3D4BA] bg-white/80 p-8 text-sm leading-7 text-[#4D3F33]">
          <h2 className="font-[var(--font-display)] text-2xl font-semibold text-[#2F3E2E]">
            How stories and media are handled
          </h2>
          <p className="mt-4">
            When ACT works with stories, photographs, audio, or video, we aim to
            treat permission as part of the infrastructure, not a box-ticking
            exercise. That means stories should only travel where permission allows,
            and public-facing pages should only show material approved for that use.
          </p>
          <p>
            Some permissions are time-bound, contextual, or revocable. Where that is
            the case, we aim to honour the most current approved use, even if that
            means removing or changing previously published material.
          </p>
        </div>

        <div className="rounded-3xl border border-[#E3D4BA] bg-white/80 p-8 text-sm leading-7 text-[#4D3F33]">
          <h2 className="font-[var(--font-display)] text-2xl font-semibold text-[#2F3E2E]">
            Basic site information
          </h2>
          <p className="mt-4">
            Like most websites, we may rely on hosting, analytics, form handling,
            and media delivery tools that generate operational logs. We try to keep
            this lightweight and proportionate to the work the site is doing.
          </p>
          <p>
            If a project, residency, or workshop requires more specific data
            collection, we will usually explain that closer to the point of
            participation rather than hide it in generic copy.
          </p>
        </div>

        <div className="rounded-3xl border border-[#E3D4BA] bg-white/80 p-8 text-sm leading-7 text-[#4D3F33]">
          <h2 className="font-[var(--font-display)] text-2xl font-semibold text-[#2F3E2E]">
            Requests, corrections, and withdrawal
          </h2>
          <p className="mt-4">
            You can contact ACT to ask what enquiry information we hold, request a
            correction, or ask us to review a published item. Where stories or media
            were shared through a consent-based workflow, we will review requests in
            line with the permission attached to that material and the practical
            limits of syndication or archival copies.
          </p>
          <p>
            The fastest path is through <a className="text-[#2F3E2E] underline" href="/contact">the contact page</a>.
          </p>
        </div>
      </section>
    </div>
  );
}
