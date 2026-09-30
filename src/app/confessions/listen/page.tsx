import { redirect } from 'next/navigation';

// Confessions is a series now (Ben, 30 Sep): each edition has its own address. Edition 01's Listen page moved to
// /confessions/philanthropy/listen. The launch redirect (config/launch-redirects.cjs) sends this address there with a 308;
// until that is in, this sends it there too, so a link already shared still lands.
export default function OldListenPage() {
  redirect('/confessions/philanthropy/listen');
}
