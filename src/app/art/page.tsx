import Link from "next/link";
import { FourWaysOn } from "@/components/pieces/FourWaysOn";
import { NumberedCard } from "@/components/pieces/NumberedCard";
import { LinkButton } from "@/components/pieces/LinkButton";
import { Onward } from "@/components/pieces/Onward";
import { Page } from "@/components/pieces/Page";
import { Parts } from "@/components/pieces/Parts";
import { Photo } from "@/components/pieces/Photo";
import { Surface } from "@/components/pieces/Surface";
import { fieldsById, partDoors, works } from "@/content";
import { getAllArtProjects, splitFeaturedAndEmerging, type HydratedArtProject } from "@/lib/art/art-portfolio";
import {
  clean,
  heroPhoto,
  inPortfolioOrder,
  mediumLabel,
  projectName,
  readYear,
  shorten,
  sized,
  statusLabel,
  withoutFigures,
} from "@/lib/art/art-page";
import { pageMetadata } from "@/lib/seo/site";
import { waysOn } from "@/lib/ways-on";
import { WorkVisual } from "./WorkVisual";
import styles from "./art.module.css";

export const metadata = pageMetadata({
  title: "Art",
  description:
    "Installations, photography, film, sculpture, art as the final act of listening. Works from across the ACT ecosystem.",
  path: "/art",
});

// Commission and residency both open Contact with their choice already picked. The source and context are the ones
// the folded pages (/art/commissions, /art/residencies) sent, so the enquiry still arrives saying where it began.
const COMMISSION = "/contact?type=commission-cultural-work&source=art-commissions&context=works-commission";
const RESIDENCY = "/contact?type=residency-visit&source=art-residencies&context=art-residency";

// The three cells of "How to read this page" are Pencil's words (Page 05 · Art, u4xXn8).
const READING = [
  {
    title: "Works",
    text: "Installations, images, films and objects. Start here if you want to feel what ACT makes public.",
  },
  {
    title: "People",
    text: "Artists, storytellers, Elders, makers and communities remain attached to the work that carries them.",
  },
  {
    title: "Invitations",
    text: "Commissions, exhibitions and residencies are handled through relationship first, not a separate catalogue.",
  },
];

// What each part does in the method: the words the live Art page has always carried.
const METHOD: Record<string, string> = {
  Listen: "Go to the place. Be with the people. Earn the right to hear.",
  Curiosity: "Ask the harder questions. Follow what matters, not what is funded.",
  Action: "Build the tool, the service, the infrastructure. Test it in the field.",
  Art: "Make the work that carries all of it into public consciousness.",
};

function FeaturedWork({ project }: { project: HydratedArtProject }) {
  const href = `/art/${project.slug}`;
  const title = clean(project.title);
  const home = projectName(project);
  const kicker = [...project.mediums.map(mediumLabel), home && `Part of ${home}`].filter(Boolean).join(" · ");
  const where = [clean(project.location), readYear(project.year)].filter(Boolean).join(" · ");

  return (
    <li className={styles.row}>
      {/* The picture opens the work too; the words beside it carry the one link a screen reader needs. */}
      <Link href={href} className={styles.visual} tabIndex={-1} aria-hidden="true">
        <WorkVisual project={project} />
      </Link>
      <div className={styles.rowText}>
        <p className={styles.kicker}>{kicker}</p>
        <h3 className={styles.workTitle}>{title}</h3>
        <p className={styles.tagline}>{clean(project.quote)}</p>
        <p className={styles.description}>{shorten(withoutFigures(project.description))}</p>
        {where && <p className={styles.meta}>{where}</p>}
        <Onward href={href} tone="fg">
          View work<span className={styles.sr}>: {title}</span>
        </Onward>
      </div>
    </li>
  );
}

// Pencil: Page 05 · Art (WzDfe).
export default async function ArtPage() {
  const all = await getAllArtProjects();
  const split = splitFeaturedAndEmerging(all);
  const featured = inPortfolioOrder(split.featured);
  const emerging = inPortfolioOrder(split.emerging);

  // The first featured work that has a photograph opens the page; without one, the art field's own still.
  const lead = featured.find((project) => heroPhoto(project));
  const leadPhoto = lead ? heroPhoto(lead) : null;
  const opening = leadPhoto
    ? { src: sized(leadPhoto.src, 1200), alt: leadPhoto.alt, caption: clean(lead?.title) }
    : { src: fieldsById.art.image, alt: "CONTAINED, seen from above", caption: "CONTAINED" };

  const confessions = works.find((w) => w.slug === "confessions-to-philanthropy");
  const ways = waysOn(["art"], {}, {
    action: { invite: "Work with the studio", title: "Commission a work", href: COMMISSION },
    art: confessions ? { title: confessions.title, href: `/art/${confessions.slug}` } : undefined,
  });

  return (
    <Page door="Art">
      <section className={styles.opening} aria-labelledby="art-title">
        <div className={styles.openingText}>
          <p className={styles.eyebrow}>Art belongs in the method</p>
          <h1 id="art-title" className={styles.title}>
            Come into the art.
          </h1>
          <p className={styles.lede}>Find yourself in the work. Then follow it into the field.</p>
          <div className={styles.links}>
            <Onward href="#featured-works" tone="fg">
              View the works
            </Onward>
            <Onward href={COMMISSION} tone="fg">
              Commission a work
            </Onward>
          </div>
        </div>
        <div className={styles.panel} data-surface="ink">
          <Photo src={opening.src} alt={opening.alt} priority className={styles.panelPhoto} />
          <p className={styles.panelCaption}>{opening.caption}</p>
        </div>
      </section>

      <section className={styles.read} aria-labelledby="read-title">
        <h2 id="read-title" className={styles.eyebrow}>
          How to read this page
        </h2>
        <ol className={styles.cells}>
          {READING.map((cell, i) => (
            <NumberedCard key={cell.title} as="li" number={String(i + 1).padStart(2, "0")} title={cell.title} text={cell.text} />
          ))}
        </ol>
      </section>

      <section id="featured-works" className={styles.featured} aria-labelledby="featured-title">
        <div className={styles.head}>
          <p className={styles.eyebrow}>Featured works</p>
          <h2 id="featured-title" className={styles.heading}>
            Installations, archives, and public experiments
          </h2>
          <p className={styles.headText}>
            Each work is a project in the ACT ecosystem. The documentation here comes from community-consented sources
            through Empathy Ledger. These are not portfolio pieces. They are ongoing relationships with people and places.
          </p>
        </div>
        <ol className={styles.rows}>
          {featured.map((project) => (
            <FeaturedWork key={project.slug} project={project} />
          ))}
        </ol>
      </section>

      <Surface as="section" tone="ink" className={styles.method} aria-labelledby="method-title">
        <p className={styles.eyebrow}>The method behind the art</p>
        <h2 id="method-title" className={styles.methodHeading}>
          Listen &middot; Curiosity &middot; Action &middot; Art
        </h2>
        <p className={styles.methodText}>
          Art is not where ACT starts. It is where the process arrives after listening has earned trust, curiosity has
          surfaced what matters, and action has built something real. The art carries the story of what was learned, heard,
          and tested, not as illustration, but as a form that can move through public life on its own terms.
        </p>
        <ul className={styles.four}>
          {partDoors.map((door) => (
            <li key={door.meaning} className={styles.stage}>
              <Parts name="tractor" rust={door.part} className={styles.glyph} />
              <h3 className={styles.stageTitle}>{door.meaning}</h3>
              <p className={styles.stageText}>{METHOD[door.meaning]}</p>
            </li>
          ))}
        </ul>
        <Onward href="/about#convictions" tone="fg">
          Read about the full method
        </Onward>
      </Surface>

      {emerging.length > 0 && (
        <section className={styles.forming} aria-labelledby="forming-title">
          <div className={styles.head}>
            <p className={styles.eyebrow}>Emerging and in-development</p>
            <h2 id="forming-title" className={styles.heading}>
              Works still forming
            </h2>
            <p className={styles.headText}>
              These projects are in early stages: listening, researching, prototyping. They do not have full documentation
              yet, but the ideas are alive and moving.
            </p>
          </div>
          <ul className={styles.cards}>
            {emerging.map((project) => (
              <li key={project.slug}>
                <Link href={`/art/${project.slug}`} className={styles.card}>
                  <span className={styles.chip}>{statusLabel(project.status)}</span>
                  <h3 className={styles.cardTitle}>{clean(project.title)}</h3>
                  <p className={styles.cardText}>{clean(project.quote)}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <Surface as="section" tone="ink" className={styles.studio} aria-labelledby="studio-title">
        <p className={styles.eyebrow}>Work with us</p>
        <h2 id="studio-title" className={styles.studioHeading}>
          The studio is open.
        </h2>
        <p className={styles.studioText}>
          If you have a story that needs a form, a place that needs an intervention, or an institution that needs to feel
          something differently, the studio takes commissions, residencies, and collaborations.
        </p>
        <div className={styles.buttons}>
          <LinkButton href={COMMISSION} variant="solid" onward>
            Commission a work
          </LinkButton>
          <LinkButton href={RESIDENCY} variant="outline" onward>
            Talk about a residency
          </LinkButton>
        </div>
      </Surface>

      <FourWaysOn {...ways} />
    </Page>
  );
}
