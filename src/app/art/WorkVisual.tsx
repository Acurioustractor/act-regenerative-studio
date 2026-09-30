import { Parts } from "@/components/pieces/Parts";
import { Photo } from "@/components/pieces/Photo";
import { arrangementFor } from "@/lib/art/become";
import type { HydratedArtProject } from "@/lib/art/art-portfolio";
import { clean, heroPhoto, sized } from "@/lib/art/art-page";
import styles from "./work-visual.module.css";

/**
 * What stands for a work where there is a picture slot: its Empathy Ledger photograph, or the still of its film, or,
 * when there is no photograph, the four parts drawn as the work is, or, when the brand has not made it out of the parts,
 * its name in the loud face. Nothing is faked in place of a photograph. It fills the box its parent gives it.
 */
export function WorkVisual({
  project,
  width = 1200,
  priority = false,
  compact = false,
  decorative = false,
}: {
  project: HydratedArtProject;
  /** The widest the picture is shown, in pixels, so Empathy Ledger sends one that size. */
  width?: number;
  priority?: boolean;
  /** The small size, for a card among cards: the name and the drawing are set smaller. */
  compact?: boolean;
  /** Inside a link that already says what the work is: the picture is decoration and reads as nothing. */
  decorative?: boolean;
}) {
  const title = clean(project.title);
  const photo = heroPhoto(project);
  if (photo) {
    return <Photo src={sized(photo.src, width)} alt={decorative ? "" : photo.alt} priority={priority} className={styles.fill} />;
  }

  const still = project.heroVideo?.posterUrl;
  if (still) {
    const contain = project.heroVideo?.fit === "contain";
    return (
      <Photo
        src={still}
        alt={decorative ? "" : project.heroVideo?.alt || title}
        priority={priority}
        className={[styles.fill, contain ? styles.contain : ""].filter(Boolean).join(" ")}
      />
    );
  }

  const own = arrangementFor(project.title);
  if (own) {
    return (
      <div className={`${styles.fill} ${styles.drawing} ${compact ? styles.compact : ""}`}>
        <Parts name={own} label={decorative ? undefined : `${title}, drawn as the four parts`} />
      </div>
    );
  }

  return (
    <div className={`${styles.fill} ${styles.name} ${compact ? styles.compact : ""}`} data-surface="ink">
      <span>{title}</span>
    </div>
  );
}
