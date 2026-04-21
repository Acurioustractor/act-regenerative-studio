import Image from "next/image";
import Link from "next/link";

import { ImageLightbox } from "@/components/flagship/ImageLightbox";
import { FullscreenVideo } from "@/components/flagship/FullscreenVideo";
import { QuickInquiryForm } from "@/components/flagship/QuickInquiryForm";
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
} from "@/components/design-system";
import { getProjectData } from "@/lib/projects/get-project-data";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Goods on Country",
  description:
    "Indestructible beds and washing machines from 100% recycled plastic, co-designed with remote Aboriginal communities across Australia.",
};

export default async function GoodsPage() {
  const project = await getProjectData("goods-on-country");
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
        !(t.display_name || t.full_name || "").includes("Team") &&
        !(t.display_name || t.full_name || "").includes("Accounts"),
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
        eyebrow="Goods"
        title="Beds that change lives"
        titleMaxChars={14}
        subhead="389 products. 8 communities. 9,225kg of plastic diverted from landfill."
        coverVideo={project.coverVideo}
        coverImage={project.coverImage}
        primaryCta={{ label: "Shop at goodsoncountry.com", href: "https://goodsoncountry.com", external: true }}
        secondaryCta={{ label: "The full story →", href: "#story" }}
      />

      <ExternalHandoffCard
        platformName="Goods on Country"
        url="https://goodsoncountry.com"
        whatHappensThere="procurement teams and communities order durable, community-designed beds and washing machines"
        whyComeBack="the story behind each product, the communities they come from, and the plastic they keep out of landfill"
        linkLabel="Shop at Goods on Country"
      />

      {/* , , ,  THE WHY , , ,  */}
      <ScrollReveal>
        <ReadingLede id="story">
          In remote communities, families sleep on floors. Standard goods
          break in weeks. Nobody comes to fix them. The replacement cycle
          drains resources and dignity at the same time.
        </ReadingLede>
      </ScrollReveal>

      {/* , , ,  FULL-BLEED PHOTO , , ,  */}
      <PhotoBreak>
        <EditableImage
          src="/media/field-stills/goods-community-build.jpg"
          alt="Community stretch bed build in remote Australia"
          slot="goods-bleed-1"
          projectSlug="goods-on-country"
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

      {/* , , ,  THE STRETCH BED, Product story , , ,  */}
      <ScrollReveal>
        <EditorialSplit
          left={
            <>
              <SectionHeader
                eyebrow="The stretch bed"
                title="Three materials. No tools. Five minutes."
                lede="100% recycled HDPE plastic frame. Galvanised steel poles. Heavy-duty canvas. 26kg flat-packed, supports 200kg, assembles tool-free in five minutes, washes with a garden hose, and every component is individually replaceable. Built to last 10+ years."
              />
              <p className="mt-6 font-[var(--font-body)] text-[15px] leading-[1.8] text-[var(--site-muted)]">
                Not designed in an office. Co-designed with Elders in Tennant Creek,
                tested in Alice Springs, refined on Palm Island. Fred Campbell,
                a Western Arrernte man from Oonchiumpa, consults on every product
                for cultural appropriateness.
              </p>
            </>
          }
          right={
            project.coverVideo ? (
              <FullscreenVideo
                src={project.coverVideo.url}
                poster={project.coverVideo.posterUrl}
                title="Stretch bed community build"
              />
            ) : galleryImages[1] ? (
              <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--site-radius)]">
                <Image src={galleryImages[1].url} alt="The Stretch Bed" fill sizes="50vw" className="object-cover" />
              </div>
            ) : null
          }
        />
      </ScrollReveal>

      {/* , , ,  PAKKIMJALKI KARI, The washing machine , , ,  */}
      <ScrollReveal>
        <EditorialSplit
          bg="surface"
          left={
            <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--site-radius)]">
              <EditableImage src="/media/field-stills/goods-delivery-2.jpg" alt="Goods on Country community deployment" slot="goods-washing" projectSlug="goods-on-country" fill sizes="50vw" className="object-cover" />
            </div>
          }
          right={
            <>
              <SectionHeader
                eyebrow="Pakkimjalki Kari"
                title="The washing machine named in language"
                lede={
                  <>
                    Elder Dianne Stokes, a Warumungu woman from Tennant Creek, named
                    the industrial washing machine in language. 20 machines deployed
                    across communities. Each one is IoT-instrumented, sending
                    telemetry data back to ACT's R&D program for remote fleet
                    management and anomaly detection.
                  </>
                }
              />
              <p className="mt-6 font-[var(--font-body)] text-[15px] leading-[1.8] text-[var(--site-muted)]">
                The washing machine fleet serves a dual purpose: providing clean
                laundry infrastructure to communities, and generating data that
                makes the next generation of community-deployed goods smarter.
              </p>
            </>
          }
        />
      </ScrollReveal>

      {/* , , ,  FROM RUBBISH TO BED, Manufacturing , , ,  */}
      <ScrollReveal>
        <section className="px-8 py-32 md:py-44">
          <div className="mx-auto max-w-[1200px]">
            <SectionHeader
              eyebrow="How it's made"
              eyebrowColor="muted"
              title="From rubbish to bed"
            />
            <HairlineGrid columns={5} className="mt-16">
              {[
                { step: "01", title: "Collect", desc: "Recycled HDPE plastic sourced from community waste and Envirobank" },
                { step: "02", title: "Shred", desc: "Plastic shredded into consistent feedstock at containerised facility" },
                { step: "03", title: "Press", desc: "High-pressure moulding into UV-stabilised frames and components" },
                { step: "04", title: "Cut + assemble", desc: "Canvas cut, steel galvanised, components flat-packed" },
                { step: "05", title: "Deploy", desc: "Shipped to communities. Every unit gets a QR code for lifetime tracking" },
              ].map((item) => (
                <HairlineCell key={item.step}>
                  <p className="font-[var(--font-display)] text-3xl font-light text-[var(--site-green)]">{item.step}</p>
                  <h3 className="mt-3 font-[var(--font-display)] text-lg font-semibold text-[var(--site-ink)]">{item.title}</h3>
                  <p className="mt-2 font-[var(--font-body)] text-[14px] leading-[1.7] text-[var(--site-muted)]">{item.desc}</p>
                </HairlineCell>
              ))}
            </HairlineGrid>
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

      {/* , , ,  THE VISION, Containerised factories , , ,  */}
      <ScrollReveal>
        <section className="full-bleed bg-[var(--site-dark)] px-8 py-32 md:py-44">
          <div className="mx-auto max-w-[800px]">
            <SectionHeader
              eyebrow="The vision"
              title="Containerised factories on Country"
              onDark
              lede="The scale vision is not a central factory that ships to communities. It is containerised manufacturing infrastructure that communities own and operate. Each facility is self-contained in shipping containers, produces 1,000 to 1,500 goods annually, and employs 4 to 6 local workers processing locally-sourced recycled plastic."
            />
            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {[
                { year: "2026", label: "First facility", desc: "Jinibara Country, QLD. 1,500 beds, 6 workers." },
                { year: "2027", label: "Second facility", desc: "Oonchiumpa partnership, Alice Springs. Combined 3,500 units." },
                { year: "2028", label: "Third facility", desc: "Top End or Torres Strait. 5,000+ units/year, 18 workers." },
              ].map((item) => (
                <div key={item.year} className="border-l-2 border-[var(--site-clay)]/30 pl-6">
                  <p className="font-[var(--font-display)] text-3xl font-bold text-[#FAFAF7]">{item.year}</p>
                  <p className="mt-2 font-[var(--font-sans)] text-[12px] font-semibold uppercase tracking-[0.1em] text-[var(--site-clay)]">{item.label}</p>
                  <p className="mt-2 font-[var(--font-body)] text-[14px] leading-[1.7] text-[#FAFAF7]/50">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* , , ,  WHERE WE WORK, Locations , , ,  */}
      <ScrollReveal>
        <section className="px-8 py-32 md:py-44">
          <div className="mx-auto max-w-[1200px]">
            <SectionHeader
              eyebrow="Communities"
              eyebrowColor="muted"
              title="Where the work is"
            />
            <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                { place: "Palm Island", detail: "141 beds deployed. PICC partnership. Housing expansion in progress." },
                { place: "Tennant Creek", detail: "200+ beds across multiple orgs. Anyinginyi Health washing fleet. Centrecorp pipeline for Utopia Homelands." },
                { place: "Alice Springs", detail: "Oonchiumpa manufacturing partner. Fred Campbell cultural consultation. Containerised facility planned." },
                { place: "East Arnhem", detail: "Miwatj Health exploring fleet across 8 clinics. 500+ mattress requests from Groote Eylandt." },
              ].map((item) => (
                <div key={item.place} className="rounded-[var(--site-radius)] border border-[var(--site-line)] p-8">
                  <h3 className="font-[var(--font-display)] text-xl font-semibold text-[var(--site-ink)]">{item.place}</h3>
                  <p className="mt-3 font-[var(--font-body)] text-[14px] leading-[1.7] text-[var(--site-muted)]">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* , , ,  PEOPLE , , ,  */}
      {portraitPeople.length >= 2 && (
        <ScrollReveal>
          <section className="px-8 py-32 md:py-44">
            <div className="mx-auto max-w-[1200px]">
              <SectionHeader
                eyebrow="33 storytellers across 8 communities"
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

      {/* , , ,  PHOTO STRIP , , ,  */}
      {galleryImages.length >= 9 && (
        <section className="px-8 py-8">
          <div className="mx-auto max-w-[1200px]">
            <PhotoStrip images={galleryImages.slice(3, 7)} columns={4} aspectRatio="square" />
          </div>
        </section>
      )}

      {/* , , ,  STATS , , ,  */}
      <ScrollReveal>
        <section className="full-bleed bg-[var(--site-dark)] px-8 py-32 md:py-44">
          <div className="mx-auto max-w-[1200px]">
            <div className="grid grid-cols-2 gap-12 md:grid-cols-4 md:gap-16 text-center">
              {[
                { n: "389", l: "Products deployed" },
                { n: "9,225", l: "kg plastic diverted" },
                { n: "1,000+", l: "Lives impacted" },
                { n: "33", l: "Community storytellers" },
              ].map(({ n, l }) => (
                <AnimatedStat key={l} value={n} label={l} />
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* , , ,  GALLERY , , ,  */}
      {galleryImages.length > 4 && (
        <ScrollReveal>
          <section className="px-8 py-32 md:py-44">
            <div className="mx-auto max-w-[1200px]">
              <SectionHeader
                eyebrow="From the field"
                eyebrowColor="muted"
                title="The work in place"
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
              A good bed can prevent heart disease.
            </h2>
            <p className="mx-auto mt-8 max-w-lg font-[var(--font-body)] text-lg leading-[1.8] text-[#FAFAF7]/60">
              Buy a bed, sponsor a bed, or partner with us on the next community deployment.
            </p>
            <div className="mt-12 flex flex-wrap justify-center gap-5">
              <DarkCTA variant="primary" href="https://goodsoncountry.com" external>
                Buy or sponsor a bed
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
                title="Work with us"
                lede="Communities, organisations, health services, and funders who want to see essential goods designed with dignity."
              />
              <p className="mt-6 font-[var(--font-body)] text-[15px] text-[var(--site-muted)]">
                Or email{" "}
                <a href="mailto:hi@act.place" className="text-[var(--site-green)] underline">hi@act.place</a>
              </p>
            </div>
            <QuickInquiryForm projectName="Goods on Country" projectSlug="goods-on-country" projectCode="ACT-GD" />
          </div>
        </section>
      </ScrollReveal>

      {/* , , ,  RELATED , , ,  */}
      <RelatedFields currentSlug="goods-on-country" />

      {/* , , ,  PROJECT PAGE , , ,  */}
      <section className="full-bleed bg-[var(--site-surface)] px-8 py-16">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-6">
          <p className="font-[var(--font-body)] text-[15px] text-[var(--site-muted)]">
            See the full project page with stories, media, and storytellers
          </p>
          <Link
            href="/projects/goods-on-country"
            className="inline-flex items-center gap-3 rounded-[var(--site-radius)] border-2 border-[var(--site-green)] px-8 py-4 font-[var(--font-sans)] text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--site-green)] transition hover:bg-[var(--site-green)] hover:text-white"
          >
            Full project page <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </section>
    </>
  );
}
