import { redirect } from 'next/navigation';

// The Payout Wall (the foundation-data grid) is retired from the campaign. Anyone landing here is sent to the voices, now
// under edition 01. Component + data are parked (src/components/confessions/PayoutWall.tsx,
// public/confessions/payout-wall.json) if the data piece is ever wanted back.
export default function PayoutWallPage() {
  redirect('/confessions/philanthropy/listen');
}
