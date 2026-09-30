import type { ReactNode } from "react";

// Every Confessions page draws its own frame (src/components/confessions/ConfessionsFrame.tsx): ACT's strip, the work's
// dark and gold look, ACT's footer. The old layout here hid the site chrome and put the campaign nav over every page;
// the frame does the first, and the edition's own nav (CampaignNav) the second.
export default function ConfessionsLayout({ children }: { children: ReactNode }) {
  return children;
}
