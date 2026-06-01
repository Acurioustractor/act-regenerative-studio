import { redirect } from 'next/navigation';

// The Payout Wall (the foundation-data grid) is retired from the campaign. The
// one page is the message + the thematics + the voices. Anyone landing here is
// sent there. Component + data are parked (src/components/confessions/PayoutWall.tsx,
// public/confessions/payout-wall.json) if the data piece is ever wanted back.
export default function PayoutWallPage() {
  redirect('/confessions/listen');
}
