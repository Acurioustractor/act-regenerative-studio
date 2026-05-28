import Link from "next/link";
import PageHero from "../../../components/PageHero";
import SectionHeading from "../../../components/SectionHeading";
import {
  getFeaturedWorks,
  getFeaturedWorkCollaborators,
} from "@/lib/works/live-featured-works";

import { pageMetadata } from "@/lib/seo/site";

export const metadata = pageMetadata({
  title: "Artists & Collaborators",
  description:
    "The artists, storytellers, and partners currently shaping ACT projects in public. A living roll-call drawn from the work itself.",
  path: "/art/artists",
});

export default async function ArtistsPage() {
  const works = await getFeaturedWorks();
  const collaborators = getFeaturedWorkCollaborators(works, 8);

  return (
    <div className="space-y-20">
      <PageHero
        eyebrow="Artists and collaborators"
        title="The people behind the work"
        description="Not a fixed roster. The artists, storytellers, and partners shown here are the people currently shaping ACT projects in public. As the work changes, this page changes with it."
        actions={[
          { label: "Explore works", href: "/art" },
          { label: "Apply for a residency", href: "/art/residencies", variant: "outline" },
        ]}
        gradientClass="from-[#F4E8DD] via-[#E3C7B4] to-[#CFA989]"
      />

      <section className="space-y-10">
        <SectionHeading
          eyebrow="Current collaborators"
          title="Artists, storytellers, and partners"
          description="A living roll-call drawn from the projects themselves. Some are storytellers whose voices appear directly in the work; others are named collaborators across residencies, commissions, and Country-based partnerships."
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {collaborators.map((collaborator) => (
            <Link
              key={collaborator.key}
              href={collaborator.href}
              className="group overflow-hidden rounded-3xl border border-[#E1D3BA] bg-white/80 transition hover:-translate-y-1 hover:border-[#4CAF50] hover:shadow-[0_18px_45px_rgba(50,42,31,0.1)]"
            >
              <div className="flex min-h-[120px] items-end bg-gradient-to-br from-[#F6F1E7] via-[#E7DDC7] to-[#D7C4A2] p-6">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.22em] text-[var(--we-warm-brown)]">
                    {collaborator.source === "storyteller"
                      ? "Storyteller"
                      : "Project collaborator"}
                  </p>
                  <h2 className="font-[var(--font-display)] text-2xl font-semibold text-[var(--we-olive)]">
                    {collaborator.name}
                  </h2>
                </div>
              </div>
              <div className="space-y-4 p-6">
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#4CAF50]">
                  {collaborator.role}
                </p>
                <p className="text-sm leading-7 text-[var(--we-brown)]">
                  {collaborator.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {collaborator.relatedWorks.map((work) => (
                    <span
                      key={`${collaborator.key}-${work}`}
                      className="rounded-full bg-[#F6F1E7] px-3 py-1 text-xs font-medium text-[var(--we-brown-deep)]"
                    >
                      {work}
                    </span>
                  ))}
                </div>
                <div className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--we-olive)] transition group-hover:gap-3">
                  <span>Open related work</span>
                  <span aria-hidden="true">&rarr;</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-[var(--we-sand)] bg-gradient-to-br from-[#F6F1E7] via-[#E7DDC7] to-[#D7C4A2] p-8 md:p-12">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-[#D8C7A5] bg-white/75 p-6">
            <h3 className="font-semibold text-[var(--we-olive)]">Residency collaborators</h3>
            <p className="mt-3 text-sm text-[var(--we-brown)]">
              Artists, researchers, and cultural practitioners working through Black Cockatoo Valley and other ACT places.
            </p>
          </div>
          <div className="rounded-2xl border border-[#D8C7A5] bg-white/75 p-6">
            <h3 className="font-semibold text-[var(--we-olive)]">Community authorities</h3>
            <p className="mt-3 text-sm text-[var(--we-brown)]">
              Elders, storytellers, and local cultural authorities who shape the ethics, permission, and direction of the work.
            </p>
          </div>
          <div className="rounded-2xl border border-[#D8C7A5] bg-white/75 p-6">
            <h3 className="font-semibold text-[var(--we-olive)]">Commission partners</h3>
            <p className="mt-3 text-sm text-[var(--we-brown)]">
              Institutions, campaigns, and community groups that invite ACT to turn a social question into a public work.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
