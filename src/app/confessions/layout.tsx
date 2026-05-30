import type { ReactNode } from 'react';

import { CampaignNav } from '@/components/confessions/CampaignNav';

// Wraps the whole Confessions to Philanthropy campaign (/confessions and its
// children: /wall, /friday, /method, /share) with persistent wayfinding. The nav
// hides itself on the /share card routes (see CampaignNav).
export default function ConfessionsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <CampaignNav />
      {children}
    </>
  );
}
