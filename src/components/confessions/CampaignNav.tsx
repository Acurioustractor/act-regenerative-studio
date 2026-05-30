'use client';

// Persistent wayfinding for the Confessions to Philanthropy campaign. Sits at the
// top of every campaign page (the call, the wall, the tape, the method) so you can
// move between the areas in one click instead of hunting for an inline link. In
// flow (not fixed) with top padding that clears the floating global header.

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ITEMS = [
  { href: '/confessions', label: 'Confess' },
  { href: '/confessions/wall', label: 'The Wall' },
  { href: '/confessions/friday', label: 'Friday Tape' },
  { href: '/confessions/method', label: 'Method' },
] as const;

export function CampaignNav() {
  const path = usePathname();
  // The share-card routes are clean social previews; no campaign chrome on them.
  if (path?.startsWith('/confessions/share')) return null;
  return (
    <nav
      aria-label="Confessions to Philanthropy"
      className="full-bleed relative z-40 flex flex-wrap items-center justify-center gap-x-2 gap-y-2 border-b border-[#2E2215] bg-[#15100A]/95 px-4 pb-3 pt-24 backdrop-blur-sm md:pt-28"
    >
      <span className="mr-1 hidden font-[var(--font-sans)] text-[10px] uppercase tracking-[0.22em] text-[#6F6353] md:inline">
        Confessions to Philanthropy
      </span>
      {ITEMS.map((it) => {
        const active = it.href === '/confessions' ? path === '/confessions' : path.startsWith(it.href);
        return (
          <Link
            key={it.href}
            href={it.href}
            aria-current={active ? 'page' : undefined}
            className={`rounded-full border px-3.5 py-1.5 font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors ${
              active
                ? 'border-[#CFA16B]/60 bg-[#CFA16B]/15 text-[#EFE6D2]'
                : 'border-transparent text-[#9A8C73] hover:border-[#3A2C18] hover:text-[#E4D8C4]'
            }`}
          >
            {it.label}
          </Link>
        );
      })}
    </nav>
  );
}
