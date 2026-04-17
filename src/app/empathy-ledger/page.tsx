import { ImageLightbox } from "@/components/flagship/ImageLightbox";
import { FullscreenVideo } from "@/components/flagship/FullscreenVideo";
import { QuickInquiryForm } from "@/components/flagship/QuickInquiryForm";
import { AnimatedStat } from "@/components/flagship/AnimatedStat";
import { ScrollReveal } from "@/components/flagship/ScrollReveal";
import { RelatedFields } from "@/components/flagship/RelatedFields";
import { EditableImage } from "@/components/flagship/EditableImage";
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
  title: "Empathy Ledger | A Curious Tractor",
  description:
    "Consent-first storytelling. Community-owned narratives with sovereignty, live syndication, and revocable permission.",
};

export default async function EmpathyLedgerPage() {
  const project = await getProjectData("empathy-ledger");
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
        eyebrow="Stories"
        title="Consent-first storytelling"
        titleMaxChars={16}
        subhead="Not your story. Not my story. But a third reality we can only discover together."
        coverVideo={project.coverVideo}
        coverImage={project.coverImage}
        primaryCta={{ label: "Visit empathyledger.com", href: "https://empathyledger.com", external: true }}
        secondaryCta={{ label: "The full story →", href: "#story" }}
      />

      {/* ——— THE WHY ——— */}
      <ScrollReveal>
        <section id="story" className="px-8 py-32 md:py-44">
          <div className="mx-auto max-w-[640px]">
            <p className="font-[var(--font-body)] text-[clamp(1.3rem,2.5vw,1.75rem)] leading-[1.6] text-[var(--site-ink)]">
              Communities told us their stories were being extracted without
              consent. Researchers, NGOs, and media take narratives from
              marginalised people and use them to raise funds, write reports,
              and build careers. The storyteller gets nothing. Not even control
              over how they are represented.
            </p>
          </div>
        </section>
      </ScrollReveal>

      {/* ——— FULL-BLEED PHOTO ——— */}
      <section className="full-bleed mt-8 md:mt-16">
        <div className="relative h-[50vh] md:h-[60vh] w-full overflow-hidden">
          <EditableImage
            src="/media/field-stills/el-storytelling.jpg"
            alt="Empathy Ledger storytelling session"
            slot="el-bleed-1"
            projectSlug="empathy-ledger"
            fill sizes="100vw" className="object-cover object-top" priority
          />
        </div>
      </section>

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

      {/* ——— FIVE CONSENT TYPES ——— */}
      <ScrollReveal>
        <section className="px-8 py-32 md:py-44">
          <div className="mx-auto max-w-[1200px]">
            <SectionHeader
              eyebrow="Consent architecture"
              title="Five consent relationships, not one checkbox"
              lede="Informed by two years of work with Aboriginal communities in Central Australia and Queensland. The consent model reflects OCAP principles: Ownership, Control, Access, Possession."
              ledeMaxWidth="640px"
            />
            <HairlineGrid columns={5} className="mt-16">
              {[
                { type: "Collection", question: "Can we record your story?", detail: "Separate from account creation. Covers recording method." },
                { type: "Processing", question: "Can AI analyse your story?", detail: "Model-specific permissions. Training data excluded by default." },
                { type: "Sharing", question: "Who can see your story?", detail: "Four tiers: public, community, restricted, sacred." },
                { type: "Attribution", question: "How do you want to be named?", detail: "Legal name, preferred name, community attribution, or anonymity." },
                { type: "Revocation", question: "Can you take it back?", detail: "Always. Consent is ongoing and revocable at any time." },
              ].map((item) => (
                <HairlineCell key={item.type}>
                  <p className="font-[var(--font-display)] text-lg font-semibold text-[var(--site-ink)]">{item.type}</p>
                  <p className="mt-3 font-[var(--font-body)] text-[14px] italic leading-[1.6] text-[var(--site-clay)]">&ldquo;{item.question}&rdquo;</p>
                  <p className="mt-3 font-[var(--font-body)] text-[13px] leading-[1.7] text-[var(--site-muted)]">{item.detail}</p>
                </HairlineCell>
              ))}
            </HairlineGrid>
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

      {/* ——— STATS ——— */}
      <ScrollReveal>
        <section className="full-bleed bg-[var(--site-dark)] px-8 py-32 md:py-44">
          <div className="mx-auto max-w-[1200px]">
            <div className="grid grid-cols-2 gap-12 md:grid-cols-4 md:gap-16 text-center">
              {[
                { n: "412", l: "Storytellers" },
                { n: "251", l: "Interviews recorded" },
                { n: "588K", l: "Words transcribed" },
                { n: "20", l: "Organisations" },
              ].map(({ n, l }) => (
                <AnimatedStat key={l} value={n} label={l} />
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ——— COMMUNITY IMPLEMENTATIONS ——— */}
      <ScrollReveal>
        <section className="px-8 py-32 md:py-44">
          <div className="mx-auto max-w-[1200px]">
            <SectionHeader
              eyebrow="Where it lives"
              eyebrowColor="muted"
              title="Community-controlled implementations"
            />
            <div className="mt-16 grid gap-10 md:grid-cols-2">
              <div className="rounded-[var(--site-radius)] border border-[var(--site-line)] p-10">
                <p className="font-[var(--font-sans)] text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--site-clay)]">Palm Island</p>
                <h3 className="mt-3 font-[var(--font-display)] text-2xl font-semibold text-[var(--site-ink)]">PICC</h3>
                <p className="mt-4 font-[var(--font-body)] text-[15px] leading-[1.8] text-[var(--site-muted)]">
                  Palm Island Community Company runs community-controlled service
                  delivery, governance, and storytelling infrastructure. Their
                  &ldquo;Our Story&rdquo; framing directly informs ACT&apos;s
                  story-sovereignty practice. Richard Cassidy&apos;s governance
                  work makes this the clearest example of community authority
                  over narrative.
                </p>
              </div>
              <div className="rounded-[var(--site-radius)] border border-[var(--site-line)] p-10">
                <p className="font-[var(--font-sans)] text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--site-clay)]">Alice Springs</p>
                <h3 className="mt-3 font-[var(--font-display)] text-2xl font-semibold text-[var(--site-ink)]">Oonchiumpa</h3>
                <p className="mt-4 font-[var(--font-body)] text-[15px] leading-[1.8] text-[var(--site-muted)]">
                  Community-led youth, culture, and justice storytelling on
                  Country in Mparntwe. Oonchiumpa demonstrates how Empathy
                  Ledger works in a place-based Indigenous-led context, with
                  cultural authority held by community Elders and young people
                  telling their own stories of transformation.
                </p>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ——— PHOTO BREAK ——— */}
      <section className="full-bleed mt-8 md:mt-16">
        <div className="relative h-[50vh] md:h-[60vh] w-full overflow-hidden">
          <EditableImage
            src="/media/field-stills/el-community.jpg"
            alt="Community storytelling on Country"
            slot="el-bleed-2"
            projectSlug="empathy-ledger"
            fill sizes="100vw" className="object-cover object-top"
          />
        </div>
      </section>

      {/* ——— THE CONNECTIVE TISSUE ——— */}
      <ScrollReveal>
        <section className="full-bleed bg-[var(--site-surface)] px-8 py-32 md:py-44">
          <div className="mx-auto max-w-[1200px] grid gap-20 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeader
                eyebrow="The Third Reality"
                title="The connective tissue of the ecosystem"
                lede="Without Empathy Ledger, the ACT ecosystem has data. With it, there is a third reality. JusticeHub provides evidence. Goods on Country provides design outcomes. The Harvest provides community rhythm. Empathy Ledger provides the human faces behind all of it."
              />
              <p className="mt-6 font-[var(--font-body)] text-[15px] leading-[1.8] text-[var(--site-muted)]">
                When individual narratives intersect with systemic data, AI-powered
                thematic analysis safely pulls themes, trends, and quotes. Funding
                applications carry the undeniable weight of real-life impact.
                Policy shifts are advocated using verified lived experience.
                Identity is always protected.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { platform: "JusticeHub", adds: "Stories of transformation" },
                { platform: "Goods on Country", adds: "Community voice in design" },
                { platform: "PICC", adds: "Lived experience of services" },
                { platform: "The Harvest", adds: "Seasonal community stories" },
              ].map((item) => (
                <div key={item.platform} className="rounded-[var(--site-radius)] border border-[var(--site-line)] p-6">
                  <p className="font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--site-clay)]">{item.platform}</p>
                  <p className="mt-2 font-[var(--font-body)] text-[14px] leading-[1.6] text-[var(--site-muted)]">{item.adds}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ——— WHERE IT SERVES ——— */}
      <ScrollReveal>
        <section className="full-bleed bg-[var(--site-dark)] px-8 py-32 md:py-44">
          <div className="mx-auto max-w-[1200px]">
            <SectionHeader
              eyebrow="Where it serves"
              title="Contexts where story stewardship matters"
              onDark
            />
            <div className="mt-16 grid gap-12 md:grid-cols-3">
              {[
                { title: "Justice programs", body: "Participant journeys and outcomes through their own words, not case files written about them." },
                { title: "Cultural preservation", body: "Community knowledge, traditions, and oral histories with sovereignty over access and attribution." },
                { title: "Impact reporting", body: "Evidence that respects dignity while demonstrating outcomes to funders and policymakers." },
              ].map((item) => (
                <div key={item.title}>
                  <h3 className="font-[var(--font-display)] text-xl font-semibold text-[#FAFAF7]">{item.title}</h3>
                  <p className="mt-3 font-[var(--font-body)] text-[15px] leading-[1.8] text-[#FAFAF7]/60">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ——— PHOTO BREAK ——— */}
      <section className="full-bleed mt-8 md:mt-16">
        <div className="relative h-[50vh] md:h-[60vh] w-full overflow-hidden">
          <EditableImage
            src="/media/field-stills/el-field.jpg"
            alt="Empathy Ledger field work"
            slot="el-bleed-3"
            projectSlug="empathy-ledger"
            fill sizes="100vw" className="object-cover object-top"
          />
        </div>
      </section>

      {/* ——— PHOTO STRIP ——— */}
      {galleryImages.length >= 6 && (
        <section className="px-8 py-8">
          <div className="mx-auto max-w-[1200px]">
            <PhotoStrip images={galleryImages.slice(0, 3)} columns={3} />
          </div>
        </section>
      )}

      {/* ——— FOUR COMMITMENTS ——— */}
      <ScrollReveal>
        <section className="px-8 py-32 md:py-44">
          <div className="mx-auto max-w-[800px]">
            <SectionHeader
              eyebrow="Principles"
              eyebrowColor="muted"
              title="Four commitments"
            />
            <div className="mt-12">
              <PrinciplesList
                items={[
                  { title: "Storyteller as sovereign", body: "Absolute control over how narrative is used. Stories travel only where explicit permission allows." },
                  { title: "Consent in the architecture", body: "Not a checkbox. Consent is structural, ongoing, and revocable. The platform enforces it." },
                  { title: "Community voice, not content", body: "Lived experience surfaced without treating people as raw inputs for institutional storytelling." },
                  { title: "Data sovereignty", body: "Shaped by Indigenous data sovereignty principles. Community control over storage, sharing, and syndication." },
                ]}
              />
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ——— GALLERY ——— */}
      {galleryImages.length > 4 && (
        <ScrollReveal>
          <section className="px-8 py-32 md:py-44">
            <div className="mx-auto max-w-[1200px]">
              <SectionHeader
                eyebrow="From the field"
                eyebrowColor="muted"
                title="Stories in practice"
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
              Every story matters. When we preserve our voices, we preserve our culture.
            </h2>
            <p className="mx-auto mt-8 max-w-lg font-[var(--font-body)] text-lg leading-[1.8] text-[#FAFAF7]/60">
              Partner with us to build story infrastructure grounded in consent
              and sovereignty.
            </p>
            <div className="mt-12 flex flex-wrap justify-center gap-5">
              <DarkCTA variant="primary" href="https://empathyledger.com" external>
                Explore the platform
              </DarkCTA>
              <DarkCTA variant="ghost" href="#inquiry">Partner with us →</DarkCTA>
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
                title="Interested in Empathy Ledger?"
                lede="We work with communities and organisations building story processes grounded in consent and sovereignty."
              />
              <p className="mt-6 font-[var(--font-body)] text-[15px] text-[var(--site-muted)]">
                Or email{" "}
                <a href="mailto:hi@act.place" className="text-[var(--site-green)] underline">hi@act.place</a>
              </p>
            </div>
            <QuickInquiryForm projectName="Empathy Ledger" projectSlug="empathy-ledger" projectCode="ACT-EL" />
          </div>
        </section>
      </ScrollReveal>

      {/* ——— RELATED ——— */}
      <RelatedFields currentSlug="empathy-ledger" />
    </>
  );
}
