import { FourWaysOn } from "@/components/pieces/FourWaysOn";
import { Page } from "@/components/pieces/Page";
import { PartsApart } from "@/components/pieces/PartsApart";
import { generalWays } from "@/lib/ways-on";
import styles from "./not-found.module.css";

export const metadata = {
  title: "Page not found",
  description: "The page you were looking for isn't here.",
};

// Pencil: Page 16 · Not found (came apart) (l5YI2X), Phone · 16 Not found (QvIwF). "This page came apart." and the line
// under it are Pencil's proposed words (the phone board says "Tap" where the desktop says "Click"). A 404 renders at any address, so this page cannot be in the route list; its
// Page wrapper is what sends the old header and footer away.
export default function NotFound() {
  return (
    <Page>
      <section className={styles.cameApart}>
        <p className={styles.eyebrow}>Not found</p>
        <h1 className={styles.title}>
          This page
          <br />
          came apart.
        </h1>
        <PartsApart label="Put the parts back together" className={styles.parts} />
        <p className={styles.text}>
          <span className={styles.onDesktop}>Click</span>
          <span className={styles.onPhone}>Tap</span> the parts to put it back together, or take a door.
        </p>
      </section>
      <FourWaysOn {...generalWays} />
    </Page>
  );
}
