"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isEditorialRoute } from "@/components/SiteChromeGate";

/**
 * Quiet legal line for the editorial routes, where SiteChromeGate hides the
 * UnifiedFooter (the only place Privacy and Terms were linked). Renders on
 * exactly the routes the gate hides; everywhere else UnifiedFooter carries
 * the legal links.
 */
export function EditorialLegalFooter() {
  const pathname = usePathname();
  if (!isEditorialRoute(pathname)) return null;
  return (
    <footer className="border-t border-black/10 bg-[#faf7f2] px-6 py-6 text-center text-xs tracking-wide text-black/55 md:px-8">
      <p>
        © {new Date().getFullYear()} A Curious Tractor
        <span aria-hidden="true" className="mx-3">·</span>
        <Link href="/privacy" className="underline underline-offset-2 hover:text-black">
          Privacy
        </Link>
        <span aria-hidden="true" className="mx-3">·</span>
        <Link href="/terms" className="underline underline-offset-2 hover:text-black">
          Terms
        </Link>
      </p>
    </footer>
  );
}
