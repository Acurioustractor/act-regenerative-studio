import type { ReactNode } from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Surface } from "./Surface";

/**
 * A Brand v1 page: one header, the page, one footer. `door` is the door the page sits behind ("Stories", "Questions",
 * "The work", "Art", "About", "Contact"), so its part turns rust in the header. The route must be listed in brandRoots
 * (src/components/SiteChromeGate.tsx) so the old site's chrome steps aside.
 */
export function Page({ door, children }: { door?: string; children: ReactNode }) {
  return (
    <Surface data-brand-page="">
      <Header current={door} />
      {children}
      <Footer />
    </Surface>
  );
}
