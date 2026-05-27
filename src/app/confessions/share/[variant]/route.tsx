import { isShareCardVariant, renderShareCard } from '@/lib/confessions/share-card';

// Stable, shareable card images:
//   /confessions/share/hook   /confessions/share/answer   /confessions/share/invite
// Each returns a 1200x630 PNG (ImageResponse is a Response subclass).
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ variant: string }> }
) {
  const { variant } = await params;
  if (!isShareCardVariant(variant)) {
    return new Response('Not found', { status: 404 });
  }
  return renderShareCard(variant);
}
