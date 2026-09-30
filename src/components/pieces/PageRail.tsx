import Link from "next/link";
import styles from "./page-rail.module.css";

/** The strip under the header that names the door and the page's sections (Pencil: Page rail, vPjBL). */
export function PageRail({ label, links }: { label: string; links: Array<{ label: string; href: string }> }) {
  return (
    <nav aria-label={`${label}: on this page`} className={styles.rail}>
      <span className={styles.label}>{label}</span>
      {links.map((link) => (
        <Link key={link.href} href={link.href} className={styles.link}>
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
