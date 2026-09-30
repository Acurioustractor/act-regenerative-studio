import { redirect } from 'next/navigation';

// Folded into the Listen page: the thematics (feelings) show on the visualisation at /confessions/philanthropy/listen.
// WallOfFeeling.tsx is parked if the reading view is wanted.
export default function FeelingPage() {
  redirect('/confessions/philanthropy/listen');
}
