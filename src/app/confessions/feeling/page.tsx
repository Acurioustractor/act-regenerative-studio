import { redirect } from 'next/navigation';

// Folded into the one page: the thematics (feelings) now show on the visualisation
// at /confessions/listen. WallOfFeeling.tsx is parked if the reading view is wanted.
export default function FeelingPage() {
  redirect('/confessions/listen');
}
