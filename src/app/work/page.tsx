import type { Metadata } from "next";
import { FourWaysOn } from "@/components/pieces/FourWaysOn";
import { Onward } from "@/components/pieces/Onward";
import { Page } from "@/components/pieces/Page";
import { Parts } from "@/components/pieces/Parts";
import { Surface } from "@/components/pieces/Surface";
import { WorkCard } from "@/components/pieces/WorkCard";
import { fieldsById, partDoors, projects, type FieldId } from "@/content";
import { pageMetadata } from "@/lib/seo/site";
import { waysOn } from "@/lib/ways-on";
import styles from "./work.module.css";

const lede = "Sometimes a story. Sometimes technology, a business, an artwork, a place, or an idea that hasn't found its form yet.";

export const metadata: Metadata = pageMetadata({
  title: "The work",
  description: lede,
  path: "/work",
});

// The photographs Pencil sets on each card (files in public/media/field-stills), and the words it adds after a
// project's name in the kicker. Pencil's Work card page (AJNp3) is the only place either is written.
const photos: Record<string, string> = {
  empathy: "/media/field-stills/empathy-ledger-elder-trip.jpg",
  justice: "/media/field-stills/justicehub-community-2.jpg",
  goods: "/media/field-stills/goods-community-build.jpg",
  harvest: "/media/field-stills/harvest-witta-aerial-3.jpg",
};
const kickerAfter: Partial<Record<FieldId, string>> = {
  justice: "With CONTAINED",
  harvest: "The place you can visit",
};

const door = partDoors.find((d) => d.label === "The work");

// Pencil: Page 04a · The work (AJNp3).
export default function WorkPage() {
  // Pencil's four ways: a story and a question written from JusticeHub's field, the field to start with, and CONTAINED.
  const ways = waysOn(["justice"], {}, {
    action: { invite: "A field to start", title: fieldsById.justice.name, href: "/fields/justice" },
  });

  return (
    <Page door="The work">
      <section className={styles.opening}>
        <div className={styles.openingWords}>
          <p className={styles.eyebrow}>
            {door?.label} · {door?.meaning}
          </p>
          <h1 className={styles.title}>We make useful things with people.</h1>
        </div>
        <p className={styles.lede}>{lede}</p>
      </section>

      <div className={styles.projects}>
        <ul className={styles.grid}>
          {projects.map((project, i) => (
            <WorkCard
              key={project.id}
              as="li"
              size="feature"
              headingAs="h2"
              photo={{ src: photos[project.id], alt: "" }}
              kicker={[String(i + 1).padStart(2, "0"), project.name, kickerAfter[project.id]].filter(Boolean).join(" · ")}
              title={project.title}
              sentence={project.line}
              link={{ label: project.destinationLabel, href: project.destinationHref }}
            />
          ))}
        </ul>
      </div>

      <Surface as="section" tone="ink" className={styles.art} aria-labelledby="art-title">
        <div className={styles.artWords}>
          <span className={styles.tractor}>
            <Parts name="tractor" rust="bonnet" />
          </span>
          <h2 id="art-title" className={styles.artTitle}>
            Art is part of how we work.
          </h2>
        </div>
        <Onward href="/art" tone="fg">
          Come into the art
        </Onward>
      </Surface>

      <FourWaysOn {...ways} />
    </Page>
  );
}
