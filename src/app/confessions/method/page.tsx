import { redirect } from 'next/navigation';

// Retired (Ben, 30 Sep). This page explained the Payout Wall, which left the campaign, and nothing links to it. The
// launch redirect (config/launch-redirects.cjs) sends /confessions/method to /confessions with a 308; until that is in,
// this sends it there too.
export default function RetiredMethodPage() {
  redirect('/confessions');
}
