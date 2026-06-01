import type { ReactNode } from 'react';

import { CampaignNav } from '@/components/confessions/CampaignNav';

// Wraps the whole Confessions to Philanthropy campaign (/confessions and its
// children: /wall, /friday, /method, /share) with persistent wayfinding. The nav
// hides itself on the /share card routes (see CampaignNav).
export default function ConfessionsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Run /confessions as its own contained site: hide the global ACT header +
          footer (marked data-site-chrome in the root layout). Server-rendered, so
          there is no flash of the global chrome. */}
      <style>{`[data-site-chrome]{display:none !important;}`}</style>
      <CampaignNav />
      {children}
    </>
  );
}
