import Image from "next/image";

import { STORYTELLERS_PUBLIC } from "@/lib/launch-flags";
import { ImageLightbox } from "@/components/flagship/ImageLightbox";
import { FullscreenVideo } from "@/components/flagship/FullscreenVideo";
import { QuickInquiryForm } from "@/components/flagship/QuickInquiryForm";
import { StorytellerStrip } from "@/components/flagship/StorytellerStrip";
import { AnimatedStat } from "@/components/flagship/AnimatedStat";
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
  PhotoBreak,
  EditorialSplit,
  ComparisonStatPair,
} from "@/components/design-system";
import { getProjectData } from "@/lib/projects/get-project-data";
import { pageMetadata } from "@/lib/seo/site";
import { notFound } from "next/navigation";

export const metadata = pageMetadata({
  title: "JusticeHub",
  description:
    "Evidence-based justice alternatives. Proving what works, routing capital to what heals.",
  path: "/justicehub",
  image: {
    url: "/media/field-stills/justicehub-container.jpg",
    alt: "JusticeHub public work and community infrastructure",
  },
});

export default async function JusticeHubPage() {
  const project = await getProjectData("justicehub");
  if (!project) notFound();

  const galleryImages = project.mediaGallery
    .filter((m) => m.type === "image" || m.type.startsWith("image"))
    .slice(0, 16);

  const storytellers = project.empathyLedgerContent?.featured.storytellers || [];
  const stories = project.empathyLedgerContent?.featured.stories || [];

  const portraitPeople = storytellers
    .filter(
      (t) =>
        t.profile_image_url &&
        t.bio &&
        !(t.display_name || t.full_name || "").includes("ACT") &&
        !(t.display_name || t.full_name || "").includes("Team"),
    )
    .slice(0, 3);

  const leadStory = stories[0];
  const leadStoryteller = leadStory
    ? storytellers.find(
        (s) => (s.display_name || s.full_name) === leadStory.storyteller_display_name,
      )
    : null;

  return (
    <>
      <DocHero
        eyebrow="Justice"
        title="Proving what works. Funding what heals."
        titleMaxChars={16}
        subhead="Communities already hold the answers to youth justice. JusticeHub gathers the proof and routes capital to programs that work."
        coverVideo={project.coverVideo}
        coverImage={project.coverImage}
        primaryCta={{ label: "Open JusticeHub", href: "https://justicehub.com.au", external: true }}
        secondaryCta={{ label: "Read the story", href: "#story" }}
      />

      <ExternalHandoffCard
        platformName="JusticeHub"
        url="https://justicehub.com.au"
        whatHappensThere="the evidence library, program directory, and justice network actually live, searchable, forkable, open"
        whyComeBack="the story behind the data and why this work matters"
      />

      {/* , , ,  THE WHY , , ,  */}
      <ScrollReveal>
        <ReadingLede id="story">
          Youth detention costs $1.3 million per child per year and has an
          85% recidivism rate. Indigenous young people face 24 times higher
          incarceration. The system does not work. Communities have always
          had the solutions. JusticeHub makes them visible, connected, and
          impossible to ignore.
        </ReadingLede>
      </ScrollReveal>

      {/* , , ,  FULL-BLEED PHOTO , , ,  */}
      <PhotoBreak>
        <EditableImage
          src="/media/field-stills/justicehub-community.jpg"
          alt="Community justice program in action"
          slot="jh-bleed-1"
          projectSlug="justicehub"
          fill sizes="100vw" className="object-cover object-top" priority
        />
      </PhotoBreak>

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

      {/* , , ,  THE ECONOMIC CASE , , ,  */}
      <ScrollReveal>
        <EditorialSplit
          left={
            <>
              <SectionHeader
                eyebrow="The economic case"
                title="97 times cheaper than detention"
                lede="Youth detention costs $3,634.90 per day, per child. That is $1.3 million per year with an 85% failure rate. Community-led alternatives cost around $14,000 per year and actually work. Every dollar diverted from detention to community creates compounding savings across health, education, and justice systems."
              />
              <p className="mt-6 font-[var(--font-body)] text-[15px] leading-[1.8] text-[var(--site-muted)]">
                This is not a moral argument. It is arithmetic. JusticeHub
                provides the evidence dashboards, cost calculators, and system
                maps that make the economic case undeniable for policymakers
                and treasuries.
              </p>
            </>
          }
          right={
            <ComparisonStatPair
              lossy={{ value: "$1.3M", label: "Detention per child/year", meta: "85% recidivism" }}
              win={{ value: "$14K", label: "Community alternative/year", meta: "97x cheaper" }}
            />
          }
        />
      </ScrollReveal>

      {/* , , ,  VIDEO , , ,  */}
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

      {/* , , ,  STATS , , ,  */}
      <ScrollReveal>
        <section className="full-bleed bg-[var(--site-dark)] px-8 py-32 md:py-44">
          <div className="mx-auto max-w-[1200px]">
            <div className="grid grid-cols-2 gap-12 md:grid-cols-4 md:gap-16 text-center">
              {[
                { n: "1,000+", l: "Alternative models mapped" },
                { n: "$94.6B", l: "Funding tracked" },
                { n: "98,418", l: "Organisations" },
                { n: "97x", l: "Cheaper than detention" },
              ].map(({ n, l }) => (
                <AnimatedStat key={l} value={n} label={l} />
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* , , ,  THREE PATHWAYS , , ,  */}
      <ScrollReveal>
        <section className="px-8 py-32 md:py-44">
          <div className="mx-auto max-w-[1200px]">
            <SectionHeader
              eyebrow="Pathways"
              eyebrowColor="muted"
              title="Three ways in"
            />
            <HairlineGrid columns={3} className="mt-16">
              {[
                { title: "For young people", body: "Direct pathways to local support, legal help, and community programs. The Youth Scout finds what is available near you.", icon: "I need help" },
                { title: "For organisations", body: "A directory of 1,000+ verified alternatives with evidence data and forkable program designs. The Australian Living Map of Alternatives.", icon: "Alternatives map" },
                { title: "For policymakers", body: "Evidence dashboards, cost calculators, and system maps that make the economic case for diversion from detention to community.", icon: "Evidence tools" },
              ].map((item) => (
                <HairlineCell key={item.title} padding="breathing">
                  <p className="font-[var(--font-sans)] text-[10px] font-semibold uppercase tracking-[0.2em] text-clay-text">{item.icon}</p>
                  <h3 className="mt-3 font-[var(--font-display)] text-xl font-semibold text-[var(--site-ink)]">{item.title}</h3>
                  <p className="mt-4 font-[var(--font-body)] text-[15px] leading-[1.8] text-[var(--site-muted)]">{item.body}</p>
                </HairlineCell>
              ))}
            </HairlineGrid>
          </div>
        </section>
      </ScrollReveal>

      {/* , , ,  PHOTO BREAK , , ,  */}
      <PhotoBreak>
        <EditableImage
          src="/media/field-stills/justicehub-community.jpg"
          alt="Justice program field work"
          slot="jh-bleed-2"
          projectSlug="justicehub"
          fill sizes="100vw" className="object-cover object-top"
        />
      </PhotoBreak>

      {/* , , ,  ALMA , , ,  */}
      <ScrollReveal>
        <EditorialSplit
          bg="surface"
          left={
            <>
              <SectionHeader
                eyebrow="Australian Living Map of Alternatives"
                title="What works, mapped by evidence"
                lede={
                  <>
                    The Australian Living Map of Alternatives sits on top of JusticeHub's funding
                    data layer. Evidence-based interventions mapped by topic and geography
                    across nine domains: child protection, community-led programs, diversion,
                    family services, Indigenous-led, legal services, NDIS, prevention, and
                    youth justice.
                  </>
                }
              />
              <p className="mt-6 font-[var(--font-body)] text-[15px] leading-[1.8] text-[var(--site-muted)]">
                Every model in the directory is forkable. Communities can take a
                program design that works in Mount Isa, adapt it for their context,
                and launch with evidence already behind them. Not starting from scratch.
                Starting from proof.
              </p>
            </>
          }
          right={
            <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--site-radius)]">
              <EditableImage
                src="/media/field-stills/justicehub-container.jpg"
                alt="Australian Living Map of Alternatives"
                slot="jh-alma"
                projectSlug="justicehub"
                fill sizes="50vw" className="object-cover"
              />
            </div>
          }
        />
      </ScrollReveal>

      {/* , , ,  LOCAL PROOF POINTS , , ,  */}
      <ScrollReveal>
        <section className="px-8 py-32 md:py-44">
          <div className="mx-auto max-w-[1200px]">
            <SectionHeader
              eyebrow="Proof points"
              eyebrowColor="muted"
              title="What the evidence says"
            />
            <div className="mt-16 grid gap-6 md:grid-cols-3">
              {[
                { place: "BG Fit, Mount Isa", stat: "5 → <1", label: "police contacts per young person", desc: "Community-led physical activity and mentoring program. Reduced youth police contact from an average of 5 incidents to less than 1." },
                { place: "Oonchiumpa, Alice Springs", stat: "95%", label: "reduction in anti-social behaviour", desc: "Place-based, Indigenous-led program. Cultural immersion, on-Country camps, and mentorship as a justice alternative." },
                { place: "Confit Pathways, Sydney", stat: "60%", label: "reduction in recidivism", desc: "Diversionary program with wraparound support. Demonstrating that community models scale across urban and regional contexts." },
              ].map((item) => (
                <div key={item.place} className="rounded-[var(--site-radius)] border border-[var(--site-line)] p-8">
                  <p className="font-[var(--font-sans)] text-[10px] font-semibold uppercase tracking-[0.2em] text-clay-text">{item.place}</p>
                  <p className="mt-4 font-[var(--font-display)] text-3xl font-bold text-[var(--site-ink)]">{item.stat}</p>
                  <p className="mt-1 font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--site-muted)]">{item.label}</p>
                  <p className="mt-4 font-[var(--font-body)] text-[14px] leading-[1.7] text-[var(--site-muted)]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* , , ,  PHOTO STRIP , , ,  */}
      {galleryImages.length >= 6 && (
        <section className="px-8 py-8">
          <div className="mx-auto max-w-[1200px]">
            <PhotoStrip images={galleryImages.slice(0, 3)} columns={3} />
          </div>
        </section>
      )}

      {/* , , ,  THE VISION, Capital routing , , ,  */}
      <ScrollReveal>
        <section className="full-bleed bg-[var(--site-dark)] px-8 py-32 md:py-44">
          <div className="mx-auto max-w-[800px]">
            <SectionHeader
              eyebrow="The vision"
              title="Capital follows evidence, not politics"
              onDark
              lede={
                <>
                  JusticeHub's end state is programmable capital allocation.
                  Impact-weighted quadratic funding routes resources to programs
                  based on verified community outcomes, not popularity or political
                  connections. The AI scores programs, the evidence dashboard makes
                  the case, and capital follows truth.
                </>
              }
            />
            <p className="mt-6 font-[var(--font-body)] text-[15px] leading-[1.8] text-[#FAFAF7]/50">
              Built on open-source infrastructure. Every model is forkable.
              Every dataset is auditable. Communities do not need permission
              to use what works. They need evidence, and JusticeHub provides it.
            </p>
          </div>
        </section>
      </ScrollReveal>

      {/* , , ,  PHOTO BREAK , , ,  */}
      <PhotoBreak>
        <EditableImage
          src="/media/field-stills/justicehub-community-2.jpg"
          alt="Community justice gathering"
          slot="jh-bleed-3"
          projectSlug="justicehub"
          fill sizes="100vw" className="object-cover object-top"
        />
      </PhotoBreak>

      {/* , , ,  PEOPLE , , ,  */}
      {portraitPeople.length >= 2 && (
        <ScrollReveal>
          <section className="px-8 py-32 md:py-44">
            <div className="mx-auto max-w-[1200px]">
              <SectionHeader
                eyebrow="Voices from the field"
                eyebrowColor="muted"
                title="The people"
              />
              <div className="mt-16 grid gap-10 md:grid-cols-3">
                {portraitPeople.map((person) => {
                  const name = person.display_name || person.full_name || "Community voice";
                  const bio = person.bio || "";
                  const shortBio = bio.length > 140 ? bio.substring(0, 140).replace(/\s\S*$/, "") + "..." : bio;
                  return (
                    <div key={name}>
                      <div className="relative aspect-[3/4] overflow-hidden rounded-[var(--site-radius)]">
                        <Image src={person.profile_image_url!} alt={name} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-8">
                          <p className="font-[var(--font-display)] text-xl font-semibold text-[#FAFAF7]">{name}</p>
                          {person.custom_tagline && (
                            <p className="mt-1 font-[var(--font-sans)] text-[11px] uppercase tracking-[0.15em] text-[#FAFAF7]/60">{person.custom_tagline}</p>
                          )}
                        </div>
                      </div>
                      <p className="mt-5 font-[var(--font-body)] text-[15px] leading-[1.7] text-[var(--site-muted)]">{shortBio}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </ScrollReveal>
      )}

      {/* , , ,  STORYTELLERS (fallback) , , ,  */}
      {/* Launch hold (2026-05-27): storyteller strip hidden while /storytellers is held. Flip STORYTELLERS_PUBLIC in @/lib/launch-flags to restore. */}
      {STORYTELLERS_PUBLIC && portraitPeople.length < 2 && (storytellers.length + stories.length >= 2) && (
        <ScrollReveal>
          <section className="full-bleed bg-[var(--site-surface)] px-8 py-32 md:py-44">
            <div className="mx-auto max-w-[1200px]">
              <SectionHeader
                eyebrow="Voices"
                eyebrowColor="muted"
                title="People in the work"
              />
              <div className="mt-16">
                <StorytellerStrip
                  storytellers={storytellers}
                  stories={stories}
                  fallbackQuotes={[
                    { text: "Communities have always had the solutions. JusticeHub makes them visible, connected, and impossible to ignore.", author: "JusticeHub", role: "Mission" },
                  ]}
                  projectName="JusticeHub"
                />
              </div>
            </div>
          </section>
        </ScrollReveal>
      )}

      {/* , , ,  GALLERY , , ,  */}
      {galleryImages.length > 4 && (
        <ScrollReveal>
          <section className="px-8 py-32 md:py-44">
            <div className="mx-auto max-w-[1200px]">
              <SectionHeader
                eyebrow="From the field"
                eyebrowColor="muted"
                title="Justice in practice"
              />
              <div className="mt-14">
                <ImageLightbox images={galleryImages.slice(4)} />
              </div>
            </div>
          </section>
        </ScrollReveal>
      )}

      {/* , , ,  BIG CTA , , ,  */}
      <ScrollReveal>
        <section className="full-bleed bg-[var(--site-dark)] px-8 py-32 md:py-44">
          <div className="mx-auto max-w-[800px] text-center">
            <h2 className="font-[var(--font-display)] text-[clamp(2rem,5vw,3.5rem)] font-light leading-[1.1] text-[#FAFAF7]">
              JusticeHub needs $500K to scale nationally.
            </h2>
            <p className="mx-auto mt-8 max-w-lg font-[var(--font-body)] text-lg leading-[1.8] text-[#FAFAF7]/60">
              Partner with us to build the evidence infrastructure that diverts
              capital from detention to community healing.
            </p>
            <div className="mt-12 flex flex-wrap justify-center gap-5">
              <DarkCTA variant="primary" href="https://justicehub.com.au" external>
                Explore the platform
              </DarkCTA>
              <DarkCTA variant="ghost" href="#inquiry">Partner with us →</DarkCTA>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* , , ,  INQUIRY , , ,  */}
      <ScrollReveal>
        <section id="inquiry" className="px-8 py-32 md:py-44">
          <div className="mx-auto grid max-w-[1100px] gap-20 lg:grid-cols-[1fr_1.2fr] lg:items-start">
            <div>
              <SectionHeader
                eyebrow="Get in touch"
                eyebrowColor="muted"
                title="Work with us on justice reform"
                lede="Communities, legal services, government, and funders building evidence-based alternatives to detention."
              />
              <p className="mt-6 font-[var(--font-body)] text-[15px] text-[var(--site-muted)]">
                Or email{" "}
                <a href="mailto:hi@act.place" className="text-[var(--site-green)] underline">hi@act.place</a>
              </p>
            </div>
            <QuickInquiryForm projectName="JusticeHub" projectSlug="justicehub" projectCode="ACT-JH" />
          </div>
        </section>
      </ScrollReveal>

      {/* , , ,  RELATED , , ,  */}
      <RelatedFields currentSlug="justicehub" />
    </>
  );
}
