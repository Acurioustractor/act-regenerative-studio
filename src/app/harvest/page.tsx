import Link from "next/link";
import { notFound } from "next/navigation";
import { Film } from "@/components/pieces/Film";
import { FourWaysOn } from "@/components/pieces/FourWaysOn";
import { LinkButton } from "@/components/pieces/LinkButton";
import { NumberedCard } from "@/components/pieces/NumberedCard";
import { Wheel, rolls } from "@/components/pieces/Onward";
import { Page } from "@/components/pieces/Page";
import { Photo } from "@/components/pieces/Photo";
import { Surface } from "@/components/pieces/Surface";
import { fieldsById } from "@/content";
import { getProjectData } from "@/lib/projects/get-project-data";
import { cleanMediaAlt } from "@/lib/media/alt-text";
import { pageMetadata } from "@/lib/seo/site";
import { waysOn } from "@/lib/ways-on";
import { InquiryForm } from "./InquiryForm";
import styles from "./harvest.module.css";

export const metadata = pageMetadata({
  title: "The Harvest",
  description:
    "A regenerative community hub in Witta, seasonal kitchen, garden centre, workshops, and venue hire grounded in local food culture.",
  path: "/harvest",
});

const HARVEST_SITE = "https://theharvestwitta.com.au";

// The stills Pencil draws the page with, for where the photographs the page reads have run out.
const STRIP_FALLBACK = [
  "/media/field-stills/harvest-witta-aerial-3.jpg",
  "/media/field-stills/jinibara-country-aerial.jpg",
  "/media/field-stills/harvest-witta-aerial.jpg",
];

const FALLBACK_ALT = "Field documentation from A Curious Tractor";

const onSite = [
  {
    title: "Seasonal kitchen",
    body: "Breakfast and brunch using local produce, following seasonal availability and the surrounding food landscape. Saturday and Sunday, 8am to 2pm.",
  },
  {
    title: "Garden centre",
    body: "Native and productive plants suited to the Sunshine Coast, curated for home growers and regenerative smallholders. Green Harvest lineage.",
  },
  {
    title: "Workshops",
    body: "Pottery, food preserving, gardening. Hands-on programs within ACT's community education mission. Skills that travel home with you.",
  },
  {
    title: "Venue and events",
    body: "Indoor-outdoor space for community gatherings, private events, seasonal markets, and harvest feasts. Built for depth, not volume.",
  },
];

const takePart = [
  {
    title: "Harvest shares",
    href: "/harvest/csa",
    description: "A weekly share of what the kitchen garden and growers are producing. Pilot now taking members.",
  },
  {
    title: "Seasonal rhythms",
    href: "/harvest/produce",
    description:
      "The rhythm of the growing year, what you can expect on the table and at the garden centre right now.",
  },
];

// Pencil: Page 08 · The Harvest (kLIRW).
export default async function HarvestPage() {
  const project = await getProjectData("the-harvest");
  if (!project) notFound();

  const gallery = project.mediaGallery
    .filter((m) => m.type === "image" || m.type.startsWith("image"))
    .slice(0, 16);

  // The voice is a story Empathy Ledger lets us feature, read the way the page has always read it. Its words are the
  // story's own excerpt; nothing about it is written here.
  const leadStory = project.empathyLedgerContent?.featured.stories[0];

  const strip =
    gallery.length >= 3
      ? gallery.slice(0, 3).map((image) => ({
          src: image.url,
          alt: cleanMediaAlt(image.alt || image.title, FALLBACK_ALT) || FALLBACK_ALT,
        }))
      : STRIP_FALLBACK.map((src) => ({ src, alt: FALLBACK_ALT }));

  const cover = project.coverVideo;
  const coverStill = project.coverImage?.url || cover?.posterUrl || "/media/field-stills/harvest-witta-aerial.jpg";

  // The harvest's own question, not the first one that touches it.
  const question = fieldsById.harvest;
  const ways = waysOn(["harvest"], {}, {
    curiosity: {
      title: question.question,
      href: question.questionSlug ? `/questions/${question.questionSlug}` : "/questions",
    },
    action: { title: "Plan your visit ↗", href: HARVEST_SITE },
    art: { title: "Come into the art.", href: "/art" },
  });

  return (
    <Page door="The work">
      <section className={styles.opening} aria-labelledby="harvest-title">
        <div className={styles.openingMedia}>
          {cover ? (
            <Film src={cover.url} poster={cover.posterUrl || coverStill} className={styles.fill} />
          ) : (
            <Photo src={coverStill} alt="" priority className={styles.fill} />
          )}
        </div>
        <Surface tone="ink" className={styles.openingWords}>
          <p className={styles.eyebrow}>Commons · The Harvest · Witta, on Jinibara Country</p>
          <h1 id="harvest-title" className={styles.openingTitle}>
            Food, gathering, and regenerative enterprise
          </h1>
          <div className={styles.buttons}>
            <LinkButton href={HARVEST_SITE}>Visit The Harvest ↗</LinkButton>
            <LinkButton href="#story" variant="outline">
              Read the story ↓
            </LinkButton>
          </div>
        </Surface>
      </section>

      <section id="story" className={styles.lede}>
        <p>
          The Harvest grew from a site that already knew how to grow. Green Harvest sold organic seeds and gardening
          supplies from this land for decades. When that chapter closed, the soil, the infrastructure, and the community
          memory stayed. We inherited all of it.
        </p>
      </section>

      {leadStory?.excerpt ? (
        <section className={styles.voice} aria-label="A voice from the place">
          <figure className={styles.voiceBox}>
            <p className={styles.eyebrow}>A voice from the place · From Empathy Ledger</p>
            <blockquote className={styles.voiceQuote}>
              <p>{leadStory.excerpt}</p>
            </blockquote>
            {leadStory.storyteller_display_name && (
              <figcaption className={styles.voiceName}>{leadStory.storyteller_display_name}</figcaption>
            )}
          </figure>
        </section>
      ) : null}

      <section className={styles.split} aria-labelledby="kitchen-title">
        <div className={styles.splitText}>
          <p className={styles.eyebrow}>The kitchen</p>
          <h2 id="kitchen-title" className={styles.heading}>
            Cook what the land gives
          </h2>
          <p className={styles.text}>
            Breakfast and brunch using local produce, following seasonal availability and the surrounding food landscape
            of the Sunshine Coast hinterland. The menu changes with the seasons because the land changes with the
            seasons. Open Saturday and Sunday, 8am to 2pm.
          </p>
          <p className={styles.text}>
            The kitchen is not a restaurant. It is a community table where the harvest shows up as food, and food shows
            up as connection.
          </p>
        </div>
        <div className={styles.splitPhoto}>
          <Photo
            src="/media/field-stills/harvest-field-notes-dji-0021.jpg"
            alt="The Harvest seasonal kitchen"
            className={styles.fill}
          />
        </div>
      </section>

      <section className={`${styles.split} ${styles.reverse}`} aria-labelledby="garden-title">
        <div className={styles.splitText}>
          <p className={styles.eyebrow}>The garden centre</p>
          <h2 id="garden-title" className={styles.heading}>
            Native and productive plants for the Coast
          </h2>
          <p className={styles.text}>
            Plants suited to the Sunshine Coast region, sourced and curated for home growers, community gardens, and
            regenerative smallholders. This is Green Harvest&apos;s inheritance, evolved. The original organic seed
            business that operated from this site for decades laid the foundation. We are growing what they started.
          </p>
        </div>
        <div className={styles.splitPhoto}>
          <Photo
            src="/media/field-stills/harvest-witta-aerial-2.jpg"
            alt="The Harvest garden centre"
            className={styles.fill}
          />
        </div>
      </section>

      <section className={styles.strip} aria-label="Photographs from The Harvest">
        {strip.map((image) => (
          <div key={image.src} className={styles.stripPhoto}>
            <Photo src={image.src} alt={image.alt} className={styles.fill} />
          </div>
        ))}
      </section>

      <section className={styles.onSite} aria-labelledby="on-site-title">
        <div className={styles.head}>
          <p className={styles.eyebrow}>On site</p>
          <h2 id="on-site-title" className={styles.headingLarge}>
            Four ways the harvest shows up
          </h2>
        </div>
        <ol className={styles.cards}>
          {onSite.map((item, i) => (
            <NumberedCard
              key={item.title}
              as="li"
              number={String(i + 1).padStart(2, "0")}
              title={item.title}
              text={item.body}
            />
          ))}
        </ol>
      </section>

      <Surface as="section" tone="ink" className={styles.inheritance} aria-labelledby="inheritance-title">
        <p className={styles.eyebrow}>The inheritance</p>
        <h2 id="inheritance-title" className={styles.inheritanceTitle}>
          Memory of the hinterland as working country
        </h2>
        <p className={styles.mutedText}>
          Barry Rodgerig&apos;s shed holds the memory of the hinterland as working country. His decades of making,
          repairing, and sustaining life on this land shaped how we understand the site. The shed is not heritage. It
          still carries the work.
        </p>
        <p className={styles.mutedText}>
          Shaun Fisher&apos;s oyster-shell cycle turns Listen, Curiosity, Action, Art into a material return loop. Shells
          from the oyster farm go back into the soil, feeding the garden that feeds the kitchen that feeds the community.
          It is the whole method made tangible in the material build of the place.
        </p>
      </Surface>

      <section className={styles.csa} aria-labelledby="csa-title">
        <div className={styles.csaText}>
          <p className={styles.eyebrow}>Community supported agriculture</p>
          <h2 id="csa-title" className={styles.headingLarge}>
            Join the harvest cycle
          </h2>
          <p className={styles.text}>
            Seasonal produce shares, member subscriptions, and local farmer partnerships reflecting the Jinibara Country
            land rhythms. You share the harvest and the risk with the growers. When the season is generous, the box is
            full. When it is lean, we all feel it.
          </p>
          <p className={styles.csaLine}>CSA is not a delivery service. It is a relationship with place.</p>
          <LinkButton href={HARVEST_SITE} variant="outline">
            Learn about CSA membership ↗
          </LinkButton>
        </div>
        <div className={styles.csaPhoto}>
          <Photo
            src="/media/field-stills/harvest-witta-aerial-3.jpg"
            alt="Seasonal produce from The Harvest"
            className={styles.fill}
          />
        </div>
      </section>

      <section className={styles.takePart} aria-labelledby="take-part-title">
        <div className={styles.head}>
          <p className={styles.eyebrow}>Ways to take part</p>
          <h2 id="take-part-title" className={styles.headingMid}>
            What you can do here
          </h2>
          <p className={styles.mutedLede}>Two ongoing ways to step into The Harvest beyond a visit.</p>
        </div>
        <ul className={styles.wayCards}>
          {takePart.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className={`${styles.wayCard} ${rolls}`}>
                <h3 className={styles.wayTitle}>{item.title}</h3>
                <p className={styles.wayText}>{item.description}</p>
                <span className={styles.more}>
                  Read more
                  <Wheel />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <Surface as="section" tone="ink" className={styles.comeBy} aria-labelledby="come-by-title">
        <h2 id="come-by-title" className={styles.comeByTitle}>
          Come by on a weekend. Stay for the harvest.
        </h2>
        <p className={styles.mutedLede}>
          Visit the kitchen, browse the garden centre, join a workshop, or book the venue for your next gathering.
        </p>
        <div className={styles.buttons}>
          <LinkButton href={HARVEST_SITE}>Plan your visit ↗</LinkButton>
          <LinkButton href="#inquiry" variant="outline" onward>
            Get in touch
          </LinkButton>
        </div>
      </Surface>

      <section id="inquiry" className={styles.inquiry} aria-labelledby="inquiry-title">
        <div className={styles.inquiryText}>
          <p className={styles.eyebrow}>Get in touch</p>
          <h2 id="inquiry-title" className={styles.headingLarge}>
            Come by or reach out
          </h2>
          <p className={styles.mutedLede}>
            Visit on a weekend, book the venue, join a workshop, or ask about CSA membership.
          </p>
          <a href="mailto:hi@theharvestwitta.com.au" className={styles.email}>
            hi@theharvestwitta.com.au
          </a>
        </div>
        <div className={styles.inquiryForm}>
          <InquiryForm projectName="The Harvest" projectSlug="the-harvest" projectCode="ACT-HV" />
        </div>
      </section>

      <FourWaysOn {...ways} />
    </Page>
  );
}
