import type { Metadata } from "next";
import { FourWaysOn } from "@/components/pieces/FourWaysOn";
import { Footer } from "@/components/pieces/Footer";
import { FullStop } from "@/components/pieces/FullStop";
import { Header } from "@/components/pieces/Header";
import { Onward } from "@/components/pieces/Onward";
import { PageRail } from "@/components/pieces/PageRail";
import { PartOf } from "@/components/pieces/PartOf";
import { Parts } from "@/components/pieces/Parts";
import { Eyebrow, Rule, RustSquare } from "@/components/pieces/Small";
import { Surface } from "@/components/pieces/Surface";
import { Wordmark } from "@/components/pieces/Wordmark";
import { Specimen } from "./Specimen";
import styles from "./pieces.module.css";

export const metadata: Metadata = {
  title: "Brand v1 pieces | A Curious Tractor",
  robots: { index: false, follow: false },
};

// Every Brand v1 piece, drawn once with the sample words from its Pencil board (02 Components), so the code can be
// set beside the design. Nothing on the live site imports these pieces yet.
export default function PiecesPage() {
  return (
    <Surface className={`full-bleed ${styles.page}`}>
      <div className={styles.intro}>
        <h1>The pieces</h1>
        <p>
          Brand v1, board 02 Components, in code. Each piece carries its Pencil node, and the words are the board&apos;s
          own samples. Not agreed with Nic; nothing live uses these yet.
        </p>
      </div>

      <h2 className={styles.group}>Marks</h2>
      <Specimen node="JKaTU" name="Wordmark">
        <div className={styles.row}>
          <Wordmark />
        </div>
      </Specimen>
      <Specimen node="tIcky" name="Symbol" width={182}>
        <div style={{ height: 142 }}>
          <Parts label="A Curious Tractor" />
        </div>
      </Specimen>
      <Specimen node="Ax1RV" name="Full stop">
        <div className={styles.row}>
          <FullStop />
        </div>
      </Specimen>
      <Specimen node="D6uyE" name="Unhitched" width={320}>
        <div style={{ height: 120 }}>
          <Parts name="unhitched" />
        </div>
      </Specimen>
      <Specimen node="parts" name="Every arrangement">
        <div className={styles.row}>
          {["tractor", "scattered", "bed", "washing machine", "camera", "container", "table", "shed", "page and voice", "printer", "caravan", "phone"].map(
            (name) => (
              <div key={name} style={{ width: 160, height: 110 }}>
                <Parts name={name} label={name} />
              </div>
            ),
          )}
        </div>
      </Specimen>

      <h2 className={styles.group}>Small pieces</h2>
      <Specimen node="I7lf2l" name="Eyebrow">
        <div className={styles.row}>
          <Eyebrow>Work · four, and the art below</Eyebrow>
        </div>
      </Specimen>
      <Specimen node="x0bCrf" name="Link (the wheel rolls)">
        <div className={styles.row}>
          <Onward href="/about">Read the manifesto</Onward>
        </div>
      </Specimen>
      <Specimen node="g5xia" name="Rust square and rule">
        <div className={styles.row}>
          <RustSquare />
          <Rule />
        </div>
      </Specimen>

      <h2 className={styles.group}>Chrome</h2>
      <Specimen node="hAT8r" name="Header" width={1440}>
        <Header />
      </Specimen>
      <Specimen node="hAT8r-current" name="Header, in Stories" width={1440}>
        <Header current="Stories" />
      </Specimen>
      <Specimen node="vPjBL" name="Page rail" width={1440}>
        <PageRail
          label="Stories"
          links={[
            { label: "Introduction", href: "#introduction" },
            { label: "Browse", href: "#browse" },
            { label: "Publishing model", href: "#publishing-model" },
          ]}
        />
      </Specimen>
      <Specimen node="RKSFG" name="Part of">
        <div className={styles.row}>
          <PartOf name="JusticeHub" href="/fields/justice" />
        </div>
      </Specimen>
      <Specimen node="x5WoQq" name="Four ways on" width={1440}>
        <FourWaysOn
          listen={{ title: "CONTAINED: Where Policy Meets Flesh", href: "/stories" }}
          curiosity={{
            title: "What if the alternatives were easier to find than detention?",
            href: "/questions/what-if-alternatives-were-easier-to-find",
          }}
          action={{ title: "Search JusticeHub ↗", href: "https://www.justicehub.com.au" }}
          art={{ title: "CONTAINED", href: "/art/contained" }}
        />
      </Specimen>
      <Specimen node="NTYwd" name="Footer" width={1440} tone="ink">
        <Footer />
      </Specimen>
    </Surface>
  );
}
