import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteLoopVideo } from "@/components/media/SiteLoopVideo";
import { EmpathyLedgerConnections } from "@/components/projects/EmpathyLedgerConnections";
import { FourWaysOn } from "@/components/pieces/FourWaysOn";
import { Wheel, rolls } from "@/components/pieces/Onward";
import { Page } from "@/components/pieces/Page";
import { Photo } from "@/components/pieces/Photo";
import { PieceLink } from "@/components/pieces/PieceLink";
import { StatTile } from "@/components/pieces/StatTile";
import { Surface } from "@/components/pieces/Surface";
import { fieldsById } from "@/content";
import { projects as actProjects } from "@/data/projects";
import {
  getAllArtSlugs,
  getAllArtProjects,
  getArtProject,
  splitFeaturedAndEmerging,
} from "@/lib/art/art-portfolio";
import {
  clean,
  fieldsOf,
  heroPhoto,
  impactLines,
  inPortfolioOrder,
  mediumLabel,
  partOfChips,
  readYear,
  relatedWorks,
  sized,
  statusLabel,
  titleSize,
  withoutFigures,
} from "@/lib/art/art-page";
import { arrangementFor } from "@/lib/art/become";
import { pageMetadata } from "@/lib/seo/site";
import { waysOn } from "@/lib/ways-on";
import { WorkVisual } from "../WorkVisual";
import { BecomeParts } from "./BecomeParts";
import { Quiet } from "./Quiet";
import styles from "./artwork.module.css";

export function generateStaticParams() {
  return getAllArtSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getArtProject(slug);
  if (!project) return { title: "Work not found" };

  // An old slug (uncle-allan) shows the work under the address it was published at; the canonical is the current one.
  return pageMetadata({
    title: `${project.title} | ACT Art Portfolio`,
    description: project.quote,
    path: `/art/${project.slug}`,
  });
}

/** Photographs for the "From the field" wall: a wide one beside a narrow one, then one across, and again. */
function wall<T>(items: T[]): T[][] {
  const rows: T[][] = [];
  for (let i = 0, wide = true; i < items.length; wide = !wide) {
    const take = wide ? 2 : 1;
    rows.push(items.slice(i, i + take));
    i += take;
  }
  return rows;
}

// Pencil: Page 06 · Artwork · CONTAINED (Y7TjeU), phone hTMzb.
export default async function ArtWorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getArtProject(slug);
  if (!project) notFound();

  const all = await getAllArtProjects();
  const related = relatedWorks(project, inPortfolioOrder(splitFeaturedAndEmerging(all).featured), 3);

  const title = clean(project.title);
  const photo = heroPhoto(project);
  const video = photo ? null : project.heroVideo;
  const chips = partOfChips(project);
  const own = arrangementFor(project.title);
  const lines = impactLines(project.impact);
  const description = withoutFigures(project.description);
  const philosophy = withoutFigures(project.philosophy);
  const gallery = project.media.filter((item) => item.id !== project.heroImage?.id && item.kind === "image");
  const year = readYear(project.year);

  // Resolve the Empathy Ledger mapping. Priority:
  // 1. Direct empathyLedger field on the art piece
  // 2. ACT project whose slug matches the art slug
  // 3. ACT project whose slug or title matches connectedProject (case-insensitive)
  const connected = project.connectedProject?.toLowerCase() || "";
  const linkedAct =
    actProjects.find((p) => p.slug === project.slug) ||
    actProjects.find((p) => connected && (p.slug === connected || p.title.toLowerCase() === connected)) ||
    null;
  const elMapping = project.empathyLedger || linkedAct?.empathyLedger;
  const elOwnerSlug = project.empathyLedger ? project.slug : linkedAct?.slug;

  const details: Array<[string, string]> = (
    [
      ["Medium", project.mediums.map(mediumLabel).join(", ")],
      ["Location", clean(project.location)],
      ["Year", year],
      ["Status", statusLabel(project.status)],
      ["Method stage", project.lcaaStages?.join(", ") ?? ""],
      ["Part of", chips.map((chip) => chip.label).join(", ")],
    ] as Array<[string, string]>
  ).filter(([, value]) => value);

  const tags = project.tags.map((tag) => `#${tag}`);
  const ways = waysOn(fieldsOf(project), { work: project.slug }, { art: { title: "All the art", href: "/art" } });

  return (
    <Page door="Art">
      {(photo || video) && (
        <div className={styles.hero}>
          {photo ? (
            <Photo src={sized(photo.src, 1920)} alt={photo.alt} priority className={styles.heroPhoto} />
          ) : (
            video && (
              <SiteLoopVideo
                src={video.url}
                poster={video.posterUrl}
                title={video.alt || title}
                preload="metadata"
                className={video.fit === "contain" ? styles.videoContain : styles.videoCover}
              />
            )
          )}
        </div>
      )}

      <section className={styles.title}>
        <div className={styles.chips}>
          {chips.map((chip, i) => (
            <PieceLink key={chip.href} href={chip.href} className={`${styles.chip} ${i === 0 ? styles.filled : ""} ${rolls}`}>
              <span>Part of {chip.label}</span>
              <Wheel />
            </PieceLink>
          ))}
          {/*
            A work with its own public site links to it from the top of the page. Describing a live exhibition and
            giving the reader no way to open it is a review of something they cannot go and see.
          */}
          {project.externalSite && (
            <a
              href={project.externalSite.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.chip} ${styles.filled} ${rolls}`}
            >
              <span>{project.externalSite.label}</span>
              <Wheel />
            </a>
          )}
          {project.mediums.map((medium) => (
            <span key={medium} className={styles.chip}>
              {mediumLabel(medium)}
            </span>
          ))}
          {project.location && <span className={styles.chip}>{clean(project.location)}</span>}
          {year && <span className={styles.chip}>{year}</span>}
        </div>
        <h1 className={styles.loud} data-size={titleSize(title)}>
          {title}
        </h1>
      </section>

      <section className={styles.words}>
        <p className={styles.quote}>{clean(project.quote)}</p>
        <div className={styles.right}>
          {description && <p className={styles.description}>{description}</p>}
          {philosophy && (
            <div className={styles.philosophy}>
              <p className={styles.eyebrow}>Philosophy</p>
              <p className={styles.philosophyText}>{philosophy}</p>
            </div>
          )}
        </div>
      </section>

      <BecomeParts title={title} own={own} />

      {gallery.length > 0 && (
        <section className={styles.field} aria-labelledby="field-title">
          <div className={styles.head}>
            <p className={styles.eyebrow}>Documentation</p>
            <h2 id="field-title" className={styles.heading}>
              From the field
            </h2>
          </div>
          {wall(gallery).map((row, r) => (
            <div key={row[0].id} className={styles.wallRow} data-count={row.length} data-flip={row.length === 2 && r % 4 === 2}>
              {row.map((item, i) => (
                <Photo
                  key={item.id}
                  src={sized(item.url, row.length === 1 ? 1920 : i === 0 ? 1200 : 750)}
                  alt={item.alt || `${title} documentation`}
                  className={styles.shot}
                />
              ))}
            </div>
          ))}
        </section>
      )}

      <section className={styles.details} aria-label="Details">
        <div className={styles.detailsLeft}>
          <dl className={styles.list}>
            {details.map(([label, value]) => (
              <div key={label} className={styles.item}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          {(project.photoCount > 0 || project.storytellerCount > 0) && (
            <ul className={styles.counts}>
              {project.photoCount > 0 && (
                <StatTile
                  as="li"
                  figure={String(project.photoCount)}
                  counts={project.photoCount === 1 ? "photograph of this work" : "photographs of this work"}
                  source={{ name: "Empathy Ledger", href: fieldsById.empathy.destinationHref }}
                />
              )}
              {project.storytellerCount > 0 && (
                <StatTile
                  as="li"
                  figure={String(project.storytellerCount)}
                  counts={project.storytellerCount === 1 ? "storyteller linked to this work" : "storytellers linked to this work"}
                  source={{ name: "Empathy Ledger", href: fieldsById.empathy.destinationHref }}
                />
              )}
            </ul>
          )}
          {lines.length === 0 && tags.length > 0 && (
            <p className={styles.tags}>
              {tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </p>
          )}
        </div>
        {lines.length > 0 && (
          <Surface as="section" tone="ink" className={styles.did} aria-labelledby="did-title">
            <h2 id="did-title" className={styles.eyebrow}>
              What it did
            </h2>
            <p className={styles.didText}>{lines.join(" ")}</p>
            {tags.length > 0 && (
              <p className={styles.tags}>
                {tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </p>
            )}
          </Surface>
        )}
      </section>

      {related.length > 0 && (
        <section className={styles.connected} aria-labelledby="connected-title">
          <h2 id="connected-title" className={styles.connectedHeading}>
            Connected work in the portfolio
          </h2>
          <ul className={styles.cards}>
            {related.map((other) => (
              <li key={other.slug}>
                <Link href={`/art/${other.slug}`} className={`${styles.card} ${rolls}`}>
                  <span className={styles.cardVisual}>
                    <WorkVisual project={other} compact decorative width={750} />
                  </span>
                  <h3 className={styles.cardTitle}>{clean(other.title)}</h3>
                  <p className={styles.cardText}>{clean(other.quote)}</p>
                  <span className={styles.cardLink}>
                    View work
                    <Wheel />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <FourWaysOn {...ways} />

      {elMapping && elOwnerSlug && (
        <Quiet>
          <EmpathyLedgerConnections
            projectSlug={elOwnerSlug}
            projectTitle={project.title}
            orgSlug={elMapping.orgSlug}
            elProjectSlugs={elMapping.elProjectSlugs}
            notes={elMapping.notes}
          />
        </Quiet>
      )}
    </Page>
  );
}
