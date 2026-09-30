import Link from "next/link";
import { site } from "@/content/site";
import { FullStop } from "./FullStop";
import { Surface } from "./Surface";
import styles from "./footer.module.css";

/**
 * One footer everywhere (Pencil: Footer NTYwd, Footer · phone TaSOe): the one line, the Acknowledgement of Country,
 * act.place with the tractor as its full stop, who we are and how to reach us, Privacy and Terms.
 */
export function Footer() {
  return (
    <Surface as="footer" tone="ink" className={styles.footer}>
      <div className={styles.left}>
        <p className={styles.oneLine}>{site.oneLine}</p>
        <p className={styles.acknowledgement}>{site.acknowledgement}</p>
      </div>
      <div className={styles.right}>
        <FullStop className={styles.fullStop} />
        <p className={styles.small}>{site.legalName}</p>
        <p className={styles.small}>{site.acn}</p>
        <a className={styles.small} href={`mailto:${site.email}`}>
          {site.email}
        </a>
        <p className={styles.small}>
          <Link href="/privacy">Privacy</Link> · <Link href="/terms">Terms</Link>
        </p>
      </div>
    </Surface>
  );
}
