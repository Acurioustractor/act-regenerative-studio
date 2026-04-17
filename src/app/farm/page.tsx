import Link from "next/link";

import { ImageLightbox } from "@/components/flagship/ImageLightbox";
import { FullscreenVideo } from "@/components/flagship/FullscreenVideo";
import { QuickInquiryForm } from "@/components/flagship/QuickInquiryForm";
import { ScrollReveal } from "@/components/flagship/ScrollReveal";
import { RelatedFields } from "@/components/flagship/RelatedFields";
import { PhotoStrip } from "@/components/flagship/PhotoStrip";
import {
  DocHero,
  SectionHeader,
  HairlineGrid,
  HairlineCell,
  LeadVoice,
  PrinciplesList,
  DarkCTA,
} from "@/components/design-system";
import { getProjectData } from "@/lib/projects/get-project-data";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Black Cockatoo Valley | A Curious Tractor",
  description:
    "150 acres on Jinibara Country. Conservation-first land practice, residencies, workshops, and habitat restoration.",
};

export default async function FarmPage() {
  const project = await getProjectData("black-cockatoo-valley");
  if (!project) notFound();

  const galleryImages = project.mediaGallery
    .filter((m) => m.type === "image" || m.type.startsWith("image"))
    .slice(0, 16);

  const stories = project.empathyLedgerContent?.featured.stories || [];
  const leadStory = stories[0];

  return (
    <>
      <DocHero
        eyebrow="Land"
        title="Black Cockatoo Valley"
        titleMaxChars={14}
        subhead="150 acres on Jinibara Country. Conservation is the baseline. The land sets the pace."
        coverVideo={project.coverVideo}
        coverImage={project.coverImage}
        primaryCta={{ label: "Plan a visit", href: "#inquiry" }}
        secondaryCta={{ label: "The full story →", href: "#story" }}
      />

      {/* ——— THE WHY ——— */}
      <ScrollReveal>
        <section id="story" className="px-8 py-32 md:py-44">
          <div className="mx-auto max-w-[640px]">
            <p className="font-[var(--font-body)] text-[clamp(1.3rem,2.5vw,1.75rem)] leading-[1.6] text-[var(--site-ink)]">
              The land holding that grounds ACT&apos;s entire physical practice.
              Residencies, R&amp;D, habitat restoration, and community programs on
              a working valley near Witta, Queensland. When the creek is low or
              the grass is tired, we slow down. Capacity is a land decision
              before it is a calendar decision.
            </p>
          </div>
        </section>
      </ScrollReveal>

      {leadStory?.excerpt ? (
        <ScrollReveal>
          <LeadVoice
            quote={leadStory.excerpt}
            authorName={leadStory.storyteller_display_name || ""}
          />
        </ScrollReveal>
      ) : null}

      {/* ——— THE SITE ——— */}
      <ScrollReveal>
        <section className="px-8 py-32 md:py-44">
          <div className="mx-auto max-w-[1200px] grid gap-20 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeader
                eyebrow="The site"
                title="What the valley holds"
                lede={
                  <>
                    150 acres of pasture under regenerative grazing, food forest
                    and orchard, native corridor restoration zones, water catchment
                    systems, and studio and gathering buildings. Together with
                    The Harvest in Witta town, Black Cockatoo Valley forms ACT&apos;s
                    &ldquo;Place&rdquo; cluster, the land base that makes all the
                    digital and social enterprise work legible.
                  </>
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Pasture", detail: "Regenerative grazing practice" },
                { label: "Food forest", detail: "Orchard and productive gardens" },
                { label: "Native corridor", detail: "Habitat restoration zones" },
                { label: "Water catchment", detail: "Creek and dam systems" },
                { label: "Studio buildings", detail: "Creative practice spaces" },
                { label: "Gathering spaces", detail: "Community programs and retreats" },
              ].map((item) => (
                <div key={item.label} className="rounded-[var(--site-radius)] border border-[var(--site-line)] p-5">
                  <p className="font-[var(--font-display)] text-[15px] font-semibold text-[var(--site-ink)]">{item.label}</p>
                  <p className="mt-1 font-[var(--font-body)] text-[13px] leading-[1.6] text-[var(--site-muted)]">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ——— ACTIVITIES ——— */}
      <ScrollReveal>
        <section className="full-bleed bg-[var(--site-surface)] px-8 py-32 md:py-44">
          <div className="mx-auto max-w-[1200px]">
            <SectionHeader
              eyebrow="What happens here"
              eyebrowColor="muted"
              title="Ways to be on the land"
            />
            <HairlineGrid columns={2} className="mt-16">
              {[
                { title: "Residencies", body: "Creative practice on Country. Seasonal residencies for artists, writers, and practitioners who need time with the land. Not a retreat centre. A working valley." },
                { title: "Workshops", body: "Soil health, story practice, land care, collective governance. Hands-on programs with skills that travel home with you." },
                { title: "Retreats", body: "Curated gatherings for regeneration and systems practice. Designed for depth, not volume. Small groups, long days, real ground." },
                { title: "Restoration", body: "Weed management, native corridor planting, habitat monitoring, and water catchment. The ongoing care that makes everything else possible." },
              ].map((item) => (
                <HairlineCell key={item.title} padding="breathing">
                  <h3 className="font-[var(--font-display)] text-xl font-semibold text-[var(--site-ink)]">{item.title}</h3>
                  <p className="mt-4 font-[var(--font-body)] text-[15px] leading-[1.8] text-[var(--site-muted)]">{item.body}</p>
                </HairlineCell>
              ))}
            </HairlineGrid>
          </div>
        </section>
      </ScrollReveal>

      {/* ——— PHOTO STRIP ——— */}
      {galleryImages.length >= 3 && (
        <section className="px-8 py-8">
          <div className="mx-auto max-w-[1200px]">
            <PhotoStrip images={galleryImages.slice(0, 3)} columns={3} />
          </div>
        </section>
      )}

      {/* ——— CONSERVATION PHILOSOPHY ——— */}
      <ScrollReveal>
        <section className="full-bleed bg-[var(--site-dark)] px-8 py-32 md:py-44">
          <div className="mx-auto max-w-[800px]">
            <SectionHeader
              eyebrow="Conservation-first"
              title="The land has veto power"
              onDark
            />
            <div className="mt-12">
              <PrinciplesList
                onDark
                variant="plain"
                items={[
                  { body: "No extractive tourism. Limited-volume operations only." },
                  { body: "Revenue from residencies and workshops funds restoration." },
                  { body: "Scale to land capacity and community readiness, not demand." },
                  { body: "No activities during sensitive seasons. Habitat areas are protected." },
                  { body: "If a project asks for more than the land can give, we redesign the project, not the land." },
                  { body: "The goal is community co-stewardship and beautiful obsolescence." },
                ]}
              />
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ——— HOW LAND CONNECTS TO PROJECTS ——— */}
      <ScrollReveal>
        <section className="px-8 py-32 md:py-44">
          <div className="mx-auto max-w-[1200px]">
            <SectionHeader
              eyebrow="Ecosystem connections"
              eyebrowColor="muted"
              title="How land practice connects to everything"
            />
            <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                { project: "Goods on Country", connection: "Manufacturing and maintenance grounded in place. The containerised factory vision starts here." },
                { project: "Empathy Ledger", connection: "Stories from and about Country. The land is where storytelling becomes embodied practice." },
                { project: "JusticeHub", connection: "On-Country healing as a justice alternative. The valley hosts programs that the evidence base tracks." },
                { project: "The Harvest", connection: "Local enterprise supporting land care revenue. The kitchen, garden, and workshops in Witta town." },
                { project: "ACT Studio", connection: "Technology serving conservation goals. R&D prototyping happens on the land it is designed to serve." },
              ].map((item) => (
                <div key={item.project} className="rounded-[var(--site-radius)] border border-[var(--site-line)] p-8">
                  <h3 className="font-[var(--font-display)] text-lg font-semibold text-[var(--site-ink)]">{item.project}</h3>
                  <p className="mt-3 font-[var(--font-body)] text-[14px] leading-[1.7] text-[var(--site-muted)]">{item.connection}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ——— VIDEO ——— */}
      {project.coverVideo && (
        <ScrollReveal>
          <section className="px-8 pb-16">
            <div className="mx-auto max-w-[1200px]">
              <FullscreenVideo
                src={project.coverVideo.url}
                poster={project.coverVideo.posterUrl}
                title={project.coverVideo.title}
              />
            </div>
          </section>
        </ScrollReveal>
      )}

      {/* ——— PHOTO STRIP ——— */}
      {galleryImages.length >= 7 && (
        <section className="px-8 py-8">
          <div className="mx-auto max-w-[1200px]">
            <PhotoStrip images={galleryImages.slice(3, 7)} columns={4} aspectRatio="square" />
          </div>
        </section>
      )}

      {/* ——— GALLERY ——— */}
      {galleryImages.length > 4 && (
        <ScrollReveal>
          <section className="px-8 py-32 md:py-44">
            <div className="mx-auto max-w-[1200px]">
              <SectionHeader
                eyebrow="From the field"
                eyebrowColor="muted"
                title="The valley"
              />
              <div className="mt-14">
                <ImageLightbox images={galleryImages.slice(4)} />
              </div>
            </div>
          </section>
        </ScrollReveal>
      )}

      {/* ——— BIG CTA ——— */}
      <ScrollReveal>
        <section className="full-bleed bg-[var(--site-dark)] px-8 py-32 md:py-44">
          <div className="mx-auto max-w-[800px] text-center">
            <h2 className="font-[var(--font-display)] text-[clamp(2rem,5vw,3.5rem)] font-light leading-[1.1] text-[#FAFAF7]">
              We work with Country, not on it.
            </h2>
            <p className="mx-auto mt-8 max-w-lg font-[var(--font-body)] text-lg leading-[1.8] text-[#FAFAF7]/60">
              Plan a residency, join a workshop, visit the farm, or partner with
              us on land practice and regenerative enterprise.
            </p>
            <div className="mt-12 flex flex-wrap justify-center gap-5">
              <DarkCTA variant="primary" href="#inquiry">Plan a visit</DarkCTA>
              <DarkCTA variant="ghost" href="#inquiry">Get in touch →</DarkCTA>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ——— INQUIRY ——— */}
      <ScrollReveal>
        <section id="inquiry" className="px-8 py-32 md:py-44">
          <div className="mx-auto grid max-w-[1100px] gap-20 lg:grid-cols-[1fr_1.2fr] lg:items-start">
            <div>
              <SectionHeader
                eyebrow="Get in touch"
                eyebrowColor="muted"
                title="Come to the valley"
                lede="Plan a residency, join a workshop, or visit the farm."
              />
              <p className="mt-6 font-[var(--font-body)] text-[15px] text-[var(--site-muted)]">
                Or email{" "}
                <a href="mailto:hi@act.place" className="text-[var(--site-green)] underline">hi@act.place</a>
              </p>
            </div>
            <QuickInquiryForm projectName="Black Cockatoo Valley" projectSlug="black-cockatoo-valley" projectCode="ACT-BV" />
          </div>
        </section>
      </ScrollReveal>

      {/* ——— RELATED ——— */}
      <RelatedFields currentSlug="black-cockatoo-valley" />

      {/* ——— PROJECT PAGE ——— */}
      <section className="full-bleed bg-[var(--site-surface)] px-8 py-16">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-6">
          <p className="font-[var(--font-body)] text-[15px] text-[var(--site-muted)]">
            See the full project page with stories, media, and storytellers
          </p>
          <Link
            href="/projects/black-cockatoo-valley"
            className="inline-flex items-center gap-3 rounded-[var(--site-radius)] border-2 border-[var(--site-green)] px-8 py-4 font-[var(--font-sans)] text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--site-green)] transition hover:bg-[var(--site-green)] hover:text-white"
          >
            Full project page <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </>
  );
}
