import Link from "next/link";
import type { AnchorHTMLAttributes } from "react";

const isExternal = (href: string) => /^(https?:|mailto:)/.test(href);

/** A next/link for a page on this site, a plain anchor for an address elsewhere. */
export function PieceLink({ href, children, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return isExternal(href) ? (
    <a href={href} {...rest}>
      {children}
    </a>
  ) : (
    <Link href={href} {...rest}>
      {children}
    </Link>
  );
}
