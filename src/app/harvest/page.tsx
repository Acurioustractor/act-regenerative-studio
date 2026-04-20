import Link from "next/link";

import { ImageLightbox } from "@/components/flagship/ImageLightbox";
import { FullscreenVideo } from "@/components/flagship/FullscreenVideo";
import { QuickInquiryForm } from "@/components/flagship/QuickInquiryForm";
import { ScrollReveal } from "@/components/flagship/ScrollReveal";
import { RelatedFields } from "@/components/flagship/RelatedFields";
import { EditableImage } from "@/components/flagship/EditableImage";
import { PhotoStrip } from "@/components/flagship/PhotoStrip";
import { ExternalHandoffCard } from "@/components/ecosystem/ExternalHandoffCard";
import {
  DocHero,
  SectionHeader,
  HairlineGrid,
  HairlineCell,
  LeadVoice,
  DarkCTA,
  ReadingLede,
  EditorialSplit,
} from "@/components/design-system";
import { getProjectData } from "@/lib/projects/get-project-data";
import { notFound } from "next/navigation";

export const metadata = {
  title: "The Harvest | A Curious Tractor",
  description:
    "A regenerative community hub in Witta — seasonal kitchen, garden centre, workshops, and venue hire grounded in local food culture.",
};

export default async function HarvestPage() {
  const project = await getProjectData("the-harvest");
  if (!project) notFound();

  const galleryImages = project.mediaGallery
    .filter((m) => m.type === "image" || m.type.startsWith("image"))
    .slice(0, 16);

  const storytellers = project.empathyLedgerContent?.featured.storytellers || [];
  const stories = project.empathyLedgerContent?.featured.stories || [];
  const leadStory = stories[0];
  const leadStoryteller = leadStory
    ? storytellers.find(
        (s) => (s.display_name || s.full_name) === leadStory.storyteller_display_name,
      )
    : null;

  return (
    <>
      <DocHero
        eyebrow="Commons"
        title="Food, gathering, and regenerative enterprise"
        titleMaxChars={16}
        subhead="A seasonal kitchen, garden centre, and community hub on the former Green Harvest site in Witta, Queensland."
        coverVideo={project.coverVideo}
        coverImage={project.coverImage}
        primaryCta={{ label: "Visit theharvestwitta.com.au", href: "https://theharvestwitta.com.au", external: true }}
        secondaryCta={{ label: "The full story →", href: "#story" }}
      />

      <ExternalHandoffCard
        platformName="The Harvest"
        url="https://theharvestwitta.com.au"
        whatHappensThere="seasonal meals, workshops, and venue hire actually happen — menus, booking, events"
        whyComeBack="the story of the land and how The Harvest fits the wider ACT ecosystem"
      />

      {/* ——— THE WHY ——— */}
      <ScrollReveal>
        <ReadingLede id="story">
          The Harvest grew from a site that already knew how to grow.
          Green Harvest sold organic seeds and gardening supplies from this
          land for decades. When that chapter closed, the soil, the
          infrastructure, and the community memory stayed. We inherited
          all of it.
        </ReadingLede>
      </ScrollReveal>

      {leadStory?.excerpt ? (
        <ScrollReveal>
          <LeadVoice
            quote={leadStory.excerpt}
            authorName={leadStory.storyteller_display_name || ""}
            authorImageUrl={leadStoryteller?.profile_image_url}
            authorTagline={leadStoryteller?.custom_tagline}
          />
        </ScrollReveal>
      ) : null}

      {/* ——— THE SEASONAL KITCHEN ——— */}
      <ScrollReveal>
        <EditorialSplit
          left={
            <>
              <SectionHeader
                eyebrow="The kitchen"
                title="Cook what the land gives"
                lede="Breakfast and brunch using local produce, following seasonal availability and the surrounding food landscape of the Sunshine Coast hinterland. The menu changes with the seasons because the land changes with the seasons. Open Saturday and Sunday, 8am to 2pm."
              />
              <p className="mt-6 font-[var(--font-body)] text-[15px] leading-[1.8] text-[var(--site-muted)]">
                The kitchen is not a restaurant. It is a community table where
                the harvest shows up as food, and food shows up as connection.
              </p>
            </>
          }
          right={
            <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--site-radius)]">
              <EditableImage
                src="/media/field-stills/harvest-kitchen.jpg"
                alt="The Harvest seasonal kitchen"
                slot="harvest-kitchen"
                projectSlug="the-harvest"
                fill sizes="50vw" className="object-cover"
              />
            </div>
          }
        />
      </ScrollReveal>

      {/* ——— THE GARDEN CENTRE ——— */}
      <ScrollReveal>
        <EditorialSplit
          bg="surface"
          left={
            <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--site-radius)]">
              <EditableImage
                src="/media/field-stills/harvest-garden.jpg"
                alt="The Harvest garden centre"
                slot="harvest-garden"
                projectSlug="the-harvest"
                fill sizes="50vw" className="object-cover"
              />
            </div>
          }
          right={
            <SectionHeader
              eyebrow="The garden centre"
              title="Native and productive plants for the Coast"
              lede={
                <>
                  Plants suited to the Sunshine Coast region, sourced and curated
                  for home growers, community gardens, and regenerative
                  smallholders. This is Green Harvest&apos;s inheritance, evolved.
                  The original organic seed business that operated from this site
                  for decades laid the foundation. We are growing what they started.
                </>
              }
            />
          }
        />
      </ScrollReveal>

      {/* ——— PHOTO STRIP ——— */}
      {galleryImages.length >= 3 && (
        <section className="px-8 py-8">
          <div className="mx-auto max-w-[1200px]">
            <PhotoStrip images={galleryImages.slice(0, 3)} columns={3} />
          </div>
        </section>
      )}

      {/* ——— WHAT'S ON SITE — Grid ——— */}
      <ScrollReveal>
        <section className="px-8 py-32 md:py-44">
          <div className="mx-auto max-w-[1200px]">
            <SectionHeader
              eyebrow="On site"
              eyebrowColor="muted"
              title="Four ways the harvest shows up"
            />
            <HairlineGrid columns={2} className="mt-16">
              {[
                { title: "Seasonal kitchen", body: "Breakfast and brunch using local produce, following seasonal availability and the surrounding food landscape. Saturday and Sunday, 8am to 2pm." },
                { title: "Garden centre", body: "Native and productive plants suited to the Sunshine Coast, curated for home growers and regenerative smallholders. Green Harvest lineage." },
                { title: "Workshops", body: "Pottery, food preserving, gardening. Hands-on programs within ACT's community education mission. Skills that travel home with you." },
                { title: "Venue and events", body: "Indoor-outdoor space for community gatherings, private events, seasonal markets, and harvest feasts. Built for depth, not volume." },
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

      {/* ——— THE INHERITANCE — Barry + Shaun ——— */}
      <ScrollReveal>
        <section className="full-bleed bg-[var(--site-dark)] px-8 py-32 md:py-44">
          <div className="mx-auto max-w-[800px]">
            <SectionHeader
              eyebrow="The inheritance"
              title="Memory of the hinterland as working country"
              onDark
              lede={
                <>
                  Barry Rodgerig&apos;s shed holds the memory of the hinterland as
                  working country. His decades of making, repairing, and sustaining
                  life on this land shaped how we understand the site. The shed is
                  not heritage. It still carries the work.
                </>
              }
            />
            <p className="mt-6 font-[var(--font-body)] text-[15px] leading-[1.8] text-[#FAFAF7]/50">
              Shaun Fisher&apos;s oyster-shell cycle turns Listen, Curiosity,
              Action, Art into a material return loop. Shells from the oyster
              farm go back into the soil, feeding the garden that feeds the
              kitchen that feeds the community. It is LCAA made tangible in
              the material build of the place.
            </p>
          </div>
        </section>
      </ScrollReveal>

      {/* ——— PHOTO STRIP ——— */}
      {galleryImages.length >= 7 && (
        <section className="px-8 py-8">
          <div className="mx-auto max-w-[1200px]">
            <PhotoStrip images={galleryImages.slice(3, 7)} columns={4} aspectRatio="square" />
          </div>
        </section>
      )}

      {/* ——— CSA ——— */}
      <ScrollReveal>
        <EditorialSplit
          left={
            <>
              <SectionHeader
                eyebrow="Community Supported Agriculture"
                title="Join the harvest cycle"
                lede="Seasonal produce shares, member subscriptions, and local farmer partnerships reflecting the Jinibara Country land rhythms. You share the harvest and the risk with the growers. When the season is generous, the box is full. When it is lean, we all feel it."
              />
              <p className="mt-6 font-[var(--font-body)] text-[15px] leading-[1.8] text-[var(--site-muted)]">
                CSA is not a delivery service. It is a relationship with place.
              </p>
              <a
                href="https://theharvestwitta.com.au"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-10 inline-block rounded-[var(--site-radius)] border-2 border-[var(--site-green)] px-8 py-4 font-[var(--font-sans)] text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--site-green)] transition hover:bg-[var(--site-green)] hover:text-white"
              >
                Learn about CSA membership
              </a>
            </>
          }
          right={
            <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--site-radius)]">
              <EditableImage
                src="/media/field-stills/harvest-produce.jpg"
                alt="Seasonal produce from The Harvest"
                slot="harvest-csa"
                projectSlug="the-harvest"
                fill sizes="50vw" className="object-cover"
              />
            </div>
          }
        />
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

      {/* ——— GALLERY ——— */}
      {galleryImages.length > 4 && (
        <ScrollReveal>
          <section className="px-8 py-32 md:py-44">
            <div className="mx-auto max-w-[1200px]">
              <SectionHeader
                eyebrow="From the field"
                eyebrowColor="muted"
                title="Seasons on site"
              />
              <div className="mt-14">
                <ImageLightbox images={galleryImages.slice(4)} />
              </div>
            </div>
          </section>
        </ScrollReveal>
      )}

      {/* ——— WAYS TO TAKE PART ——— */}
      <ScrollReveal>
        <section className="px-8 py-24">
          <div className="mx-auto max-w-[1100px]">
            <SectionHeader
              eyebrow="Ways to take part"
              eyebrowColor="muted"
              title="What you can do here"
              lede="Two ongoing ways to step into The Harvest beyond a visit."
            />
            <div className="mt-12 grid gap-5 md:grid-cols-2">
              {[
                {
                  label: 'CSA membership',
                  href: '/harvest/csa',
                  description: 'A weekly share of what the kitchen garden and growers are producing. Pilot now taking members.',
                },
                {
                  label: 'What is in season',
                  href: '/harvest/produce',
                  description: 'The rhythm of the growing year — what you can expect on the table and at the garden centre right now.',
                },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group rounded-[24px] border border-[var(--we-sand)] bg-white/80 p-6 transition hover:-translate-y-0.5 hover:border-[#4CAF50] hover:shadow-[0_12px_32px_rgba(50,42,31,0.08)]"
                >
                  <p className="font-[var(--font-display)] text-xl font-semibold text-[var(--we-olive)]">
                    {item.label}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[var(--we-brown)]">
                    {item.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#4CAF50] transition group-hover:gap-2">
                    Read more <span aria-hidden="true">&rarr;</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ——— BIG CTA ——— */}
      <ScrollReveal>
        <section className="full-bleed bg-[var(--site-dark)] px-8 py-32 md:py-44">
          <div className="mx-auto max-w-[800px] text-center">
            <h2 className="font-[var(--font-display)] text-[clamp(2rem,5vw,3.5rem)] font-light leading-[1.1] text-[#FAFAF7]">
              Come by on a weekend. Stay for the harvest.
            </h2>
            <p className="mx-auto mt-8 max-w-lg font-[var(--font-body)] text-lg leading-[1.8] text-[#FAFAF7]/60">
              Visit the kitchen, browse the garden centre, join a workshop, or
              book the venue for your next gathering.
            </p>
            <div className="mt-12 flex flex-wrap justify-center gap-5">
              <DarkCTA variant="primary" href="https://theharvestwitta.com.au" external>
                Plan your visit
              </DarkCTA>
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
                title="Come by or reach out"
                lede="Visit on a weekend, book the venue, join a workshop, or ask about CSA membership."
              />
              <p className="mt-6 font-[var(--font-body)] text-[15px] text-[var(--site-muted)]">
                Or email{" "}
                <a href="mailto:hello@theharvest.community" className="text-[var(--site-green)] underline">hello@theharvest.community</a>
              </p>
            </div>
            <QuickInquiryForm projectName="The Harvest" projectSlug="the-harvest" projectCode="ACT-HV" />
          </div>
        </section>
      </ScrollReveal>

      {/* ——— RELATED ——— */}
      <RelatedFields currentSlug="the-harvest" />

      {/* ——— PROJECT PAGE ——— */}
      <section className="full-bleed bg-[var(--site-surface)] px-8 py-16">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-6">
          <p className="font-[var(--font-body)] text-[15px] text-[var(--site-muted)]">
            See the full project page with stories, media, and storytellers
          </p>
          <Link
            href="/projects/the-harvest"
            className="inline-flex items-center gap-3 rounded-[var(--site-radius)] border-2 border-[var(--site-green)] px-8 py-4 font-[var(--font-sans)] text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--site-green)] transition hover:bg-[var(--site-green)] hover:text-white"
          >
            Full project page <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </>
  );
}
