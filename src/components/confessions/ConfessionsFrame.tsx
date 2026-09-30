import type { ReactNode } from "react";
import { ActStrip } from "@/components/pieces/ActStrip";
import { Footer } from "@/components/pieces/Footer";
import { FourWaysOn, type Way } from "@/components/pieces/FourWaysOn";
import { Surface } from "@/components/pieces/Surface";
import look from "./look.module.css";

/**
 * A Confessions page: ACT's strip over the work's own dark and gold look, then ACT's four ways on and footer (Pencil:
 * Page 14 n0MhK, Page 14b E5hyfE). The old Confessions pages had no footer, so no Privacy or Terms link. `data-brand-page`
 * sends the old site chrome away wherever this is on screen, and `data-look="confessions"` brings the four colours of the look
 * (src/brand/tokens.css). Children are the sections of the work, in the look.
 */
export function ConfessionsFrame({
  context,
  back,
  ways,
  children,
}: {
  /** The words after "An artwork by A Curious Tractor" in the strip. */
  context: string;
  back: { label: string; href: string };
  ways: { listen: Way; curiosity: Way; action: Way; art: Way };
  children: ReactNode;
}) {
  return (
    <Surface data-brand-page="" data-look="confessions">
      <ActStrip context={context} back={back} />
      <div className={look.look}>{children}</div>
      <FourWaysOn {...ways} />
      <Footer />
    </Surface>
  );
}
