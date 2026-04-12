import Link from "next/link";
import PageHero from "../../components/PageHero";
import SectionHeading from "../../components/SectionHeading";
import { ProjectEntryBridgeSection } from "@/components/projects";
import { getProjectData } from "@/lib/projects/get-project-data";
import { getRelatedFeaturedWorks } from "@/lib/works/live-featured-works";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Goods on Country | A Curious Tractor",
  description:
    "Circular manufacturing shaped with remote communities so waste, utility, and local value can be reorganised on more community-led terms.",
};

const products = [
  {
    name: "Beds",
    description: "Community-shaped beds made to respond to actual local conditions and use.",
    status: "Field-tested",
  },
  {
    name: "Mattresses",
    description: "Durable mattress designs suited to hygiene, climate, and long use cycles.",
    status: "Current line",
  },
  {
    name: "Washing Machines",
    description: "Laundry capability emerging from identified community need and practical service gaps.",
    status: "Prototype stage",
  },
  {
    name: "Fridges",
    description: "Essential goods being explored as the product line and manufacturing model mature.",
    status: "Exploration",
  },
];

const deploymentCommunities = [
  "Kalgoorlie",
  "Mt Isa (Kalkadoon Country)",
  "Tennant Creek",
  "Palm Island",
];

const impactGoals = [
  { metric: "Waste", label: "Less material leaving community as dead cost" },
  { metric: "Jobs", label: "More local work, skills, and manufacturing capacity" },
  { metric: "Choice", label: "Goods shaped by local need rather than generic supply chains" },
  { metric: "Value", label: "More value retained closer to the community that generates it" },
];

export default async function GoodsPage() {
  const project = await getProjectData("goods-on-country");

  if (!project) {
    notFound();
  }

  const relatedWorks = await getRelatedFeaturedWorks(
    "goods-on-country",
    project.title,
    3
  );

  return (
    <div className="space-y-16">
      <PageHero
        eyebrow="Circular goods"
        title="Manufacturing that keeps value closer to community"
        description={project.description}
        coverImage={project.coverImage}
        coverVideo={project.coverVideo}
        actions={[
          ...(project.projectWebsiteUrl
            ? [{ label: "Visit Goods on Country", href: project.projectWebsiteUrl, external: true as const }]
            : []),
          { label: "Partner With Us", href: "/contact", variant: "outline" },
        ]}
      >
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-[#6B5A45]">
            The problem we address
          </p>
          <p>
            Remote communities face dual extraction: premium prices for essential goods
            AND waste they cannot process. We flip this model.
          </p>
        </div>
      </PageHero>

      <ProjectEntryBridgeSection project={project} relatedWorks={relatedWorks} />

      {/* The Problem */}
      <section className="rounded-3xl border border-[#E3D4BA] bg-gradient-to-br from-[#F6F1E7] via-[#E7DDC7] to-[#D7C4A2] p-8 md:p-12">
        <div className="space-y-6">
          <h2 className="font-[var(--font-display)] text-2xl font-semibold text-[#2F3E2E] md:text-3xl">
            Why this work matters
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-[#2F3E2E]">Economic extraction</h3>
              <ul className="space-y-2 text-sm text-[#4D3F33]">
                <li className="flex items-start gap-2">
                  <span className="text-[#A24A2E]">•</span>
                  <span>Premium prices for essential goods</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#A24A2E]">•</span>
                  <span>Products often culturally inappropriate or low quality</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#A24A2E]">•</span>
                  <span>Value extracted through expensive products</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-[#2F3E2E]">Environmental burden</h3>
              <ul className="space-y-2 text-sm text-[#4D3F33]">
                <li className="flex items-start gap-2">
                  <span className="text-[#A24A2E]">•</span>
                  <span>Plastic waste accumulates with no local recycling</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#A24A2E]">•</span>
                  <span>Unsafe/dirty mattresses affecting sleep and hygiene</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#A24A2E]">•</span>
                  <span>Dignity compromised by poor-quality goods</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="space-y-8">
        <SectionHeading
          eyebrow="Process"
          title="How it works"
          description="A circular model that starts with local need, local waste, and a longer path toward community ownership."
        />
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          {[
            { step: "1", title: "Co-Design", description: "Communities identify needed products and design specifications" },
            { step: "2", title: "Waste Collection", description: "Plastic waste gathered from communities as input material" },
            { step: "3", title: "Manufacturing", description: "Products made from recycled plastic + other inputs" },
            { step: "4", title: "Distribution", description: "Sold back to communities at fair prices" },
            { step: "5", title: "Profit-Sharing", description: "40% of profits to source communities" },
            { step: "6", title: "Capacity Transfer", description: "Communities learn manufacturing, eventually operate independently" },
          ].map((item) => (
            <div
              key={item.step}
              className="rounded-2xl border border-[#E3D4BA] bg-white p-4 text-center"
            >
              <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#4CAF50] text-sm font-bold text-white">
                {item.step}
              </div>
              <h3 className="font-semibold text-[#2F3E2E] text-sm">{item.title}</h3>
              <p className="mt-1 text-xs text-[#5A4A3A]">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="space-y-8">
        <SectionHeading
          eyebrow="Products"
          title="What we make"
          description="Essential products co-designed with communities, manufactured using local waste."
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <div
              key={product.name}
              className="rounded-2xl border border-[#E3D4BA] bg-white p-6"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-[#2F3E2E]">{product.name}</h3>
                <span className="rounded-full bg-[#E5F4E4] px-2 py-1 text-xs text-[#2F3E2E]">
                  {product.status}
                </span>
              </div>
              <p className="text-sm text-[#5A4A3A]">{product.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Impact Goals */}
      <section className="rounded-3xl border border-[#E3D4BA] bg-gradient-to-br from-[#2F3E2E] to-[#1a2a1a] p-8 md:p-12">
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-[#9AA396]">Direction of travel</p>
          <h2 className="mt-2 font-[var(--font-display)] text-2xl font-semibold text-white md:text-3xl">
            What the model is aiming toward
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {impactGoals.map((goal) => (
            <div
              key={goal.label}
              className="rounded-2xl border border-[#4a5a4a] bg-[#3a4a3a]/50 p-6 text-center"
            >
              <div className="text-3xl font-bold text-[#4CAF50]">{goal.metric}</div>
              <p className="mt-2 text-sm text-[#B8C4B8]">{goal.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Deployment Communities */}
      <section className="space-y-8">
        <SectionHeading
          eyebrow="Communities"
          title="Where we work"
          description="Current community relationships and field contexts connected to the Goods on Country line of work."
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {deploymentCommunities.map((community) => (
            <div
              key={community}
              className="rounded-2xl border border-[#E3D4BA] bg-white/70 p-6 text-center"
            >
              <span className="text-2xl">📍</span>
              <h3 className="mt-2 font-semibold text-[#2F3E2E]">{community}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Orange Sky Connection */}
      <section className="rounded-3xl border border-[#E3D4BA] bg-gradient-to-br from-[#F4E8DD] via-[#E6CBB7] to-[#D1A788] p-8 md:p-12">
        <div className="grid gap-8 lg:grid-cols-2 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#6B5A45]">Connection</p>
            <h2 className="mt-2 font-[var(--font-display)] text-2xl font-semibold text-[#2F3E2E] md:text-3xl">
              From Orange Sky to Remote Communities
            </h2>
            <p className="mt-4 text-sm text-[#5A4A3A]">
              Nicholas Marchesi also co-founded Orange Sky. That practical history of
              laundry access and dignity still informs parts of Goods on Country,
              especially where communities identify washing capability as a critical gap.
            </p>
          </div>
          <div className="text-center">
            <div className="inline-block rounded-2xl bg-white/70 p-6">
              <p className="text-sm text-[#4D3F33] italic">
                "What if useful goods, local dignity, and circular manufacturing could
                be designed together instead of arriving as separate problems?"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Visit Registry */}
      <section className="rounded-3xl border border-[#E3D4BA] bg-white p-8 text-center md:p-12">
        <div className="space-y-6">
          <h2 className="font-[var(--font-display)] text-2xl font-semibold text-[#2F3E2E] md:text-3xl">
            View the Goods Registry
          </h2>
          <p className="mx-auto max-w-xl text-sm text-[#5A4A3A]">
            Browse the current product line and follow how the work is being shaped
            through community need, fabrication, and field learning.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://goodsoncountry.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#4CAF50] px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#3D9143]"
            >
              View Registry
            </a>
            <Link
              href="/contact"
              className="rounded-full border border-[#4CAF50] px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#2F3E2E] transition hover:bg-[#E5F4E4]"
            >
              Partner With Us
            </Link>
          </div>
        </div>
      </section>

      {/* LCAA Application */}
      <section className="space-y-8">
        <SectionHeading
          eyebrow="Method"
          title="LCAA in action"
          description="How ACT's shared method becomes circular goods practice."
        />
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-[#E1D3BA] bg-white/70 p-6 space-y-3">
            <h3 className="text-lg font-semibold text-[#2F3E2E] font-[var(--font-display)]">
              Listen
            </h3>
            <p className="text-sm text-[#4D3F33]">
              Communities identified practical goods needs, waste burdens, and the
              importance of local control over both design and value.
            </p>
          </div>
          <div className="rounded-3xl border border-[#E1D3BA] bg-white/70 p-6 space-y-3">
            <h3 className="text-lg font-semibold text-[#2F3E2E] font-[var(--font-display)]">
              Curiosity
            </h3>
            <p className="text-sm text-[#4D3F33]">
              Can waste become community value? What would manufacturing look like if
              it followed local need and cultural fit instead of distant supply logic?
            </p>
          </div>
          <div className="rounded-3xl border border-[#E1D3BA] bg-white/70 p-6 space-y-3">
            <h3 className="text-lg font-semibold text-[#2F3E2E] font-[var(--font-display)]">
              Action
            </h3>
            <p className="text-sm text-[#4D3F33]">
              Prototypes, fabrication workflows, and ownership structures are being
              tested so communities can move from supply recipients toward local makers.
            </p>
          </div>
          <div className="rounded-3xl border border-[#E1D3BA] bg-white/70 p-6 space-y-3">
            <h3 className="text-lg font-semibold text-[#2F3E2E] font-[var(--font-display)]">
              Art
            </h3>
            <p className="text-sm text-[#4D3F33]">
              Design, fabrication, and material transformation can all carry cultural
              meaning. Goods are not neutral objects when they are tied to dignity,
              care, and sovereignty.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
