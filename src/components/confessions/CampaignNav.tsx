import Link from "next/link";
import styles from "./campaign-nav.module.css";

const items = [
  { key: "confess", label: "Confess", path: "" },
  { key: "listen", label: "Listen", path: "/listen" },
  { key: "friday", label: "Friday Tape", path: "/friday" },
] as const;

export type CampaignPage = (typeof items)[number]["key"];

/**
 * The edition's own way round its three pages: Confess (the call), Listen (the voices) and the Friday Tape (the week played
 * back). Pencil: Campaign nav, o9lk6o on Page 14b. `base` is the edition's address, e.g. /confessions/philanthropy.
 */
export function CampaignNav({ base, name, current }: { base: string; name: string; current: CampaignPage }) {
  return (
    <nav aria-label={name} className={styles.nav}>
      {items.map((item) => (
        <Link
          key={item.key}
          href={`${base}${item.path}`}
          className={styles.link}
          aria-current={item.key === current ? "page" : undefined}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
