import Image from "next/image";

interface Storyteller {
  display_name: string | null;
  full_name: string | null;
  bio: string | null;
  custom_tagline: string | null;
  profile_image_url: string | null;
}

interface StoryExcerpt {
  storyteller_display_name: string | null;
  storyteller_name: string | null;
  story_title: string;
  excerpt: string | null;
}

interface FallbackQuote {
  text: string;
  author: string;
  role?: string;
}

interface StorytellerStripProps {
  storytellers: Storyteller[];
  stories: StoryExcerpt[];
  fallbackQuotes?: FallbackQuote[];
  projectName: string;
  /** Dark background variant */
  dark?: boolean;
}

export function StorytellerStrip({
  storytellers,
  stories,
  fallbackQuotes = [],
  projectName,
  dark = false,
}: StorytellerStripProps) {
  // Build display items: prefer story excerpts, fill with bios, then fallbacks
  const items: Array<{
    name: string;
    tagline?: string;
    text: string;
    imageUrl?: string;
  }> = [];

  // First: storytellers with real story excerpts
  for (const story of stories.slice(0, 3)) {
    const name =
      story.storyteller_display_name || story.storyteller_name || "Community voice";
    const teller = storytellers.find(
      (t) =>
        (t.display_name || t.full_name) === name
    );
    if (story.excerpt) {
      items.push({
        name,
        tagline: teller?.custom_tagline || undefined,
        text: story.excerpt,
        imageUrl: teller?.profile_image_url || undefined,
      });
    }
  }

  // Second: storytellers with bios (skip duplicates)
  if (items.length < 3) {
    for (const t of storytellers) {
      if (items.length >= 3) break;
      const name = t.display_name || t.full_name || "Community voice";
      if (items.some((i) => i.name === name)) continue;
      // Skip team/system accounts
      if (name.includes("ACT") || name.includes("Team") || name.includes("Accounts")) continue;
      if (t.bio) {
        items.push({
          name,
          tagline: t.custom_tagline || undefined,
          text: t.bio.length > 200 ? t.bio.substring(0, 200).replace(/\s\S*$/, "") + "..." : t.bio,
          imageUrl: t.profile_image_url || undefined,
        });
      }
    }
  }

  // Third: fallback quotes from static data
  if (items.length < 3) {
    for (const q of fallbackQuotes) {
      if (items.length >= 3) break;
      if (items.some((i) => i.name === q.author)) continue;
      items.push({
        name: q.author,
        tagline: q.role,
        text: q.text,
      });
    }
  }

  if (items.length === 0) return null;

  const ink = dark ? "var(--site-bg)" : "var(--site-ink)";
  const muted = dark ? "var(--site-bg)" : "var(--site-muted)";
  const mutedAlpha = dark ? "rgba(250,250,247,0.5)" : undefined;

  return (
    <div className="grid gap-12 md:grid-cols-3">
      {items.map((item, i) => (
        <div key={item.name + i} className="flex flex-col">
          {/* Quote text */}
          <blockquote
            className="flex-1 font-[var(--font-display)] text-lg font-light italic leading-[1.6]"
            style={{ color: ink }}
          >
            &ldquo;{item.text}&rdquo;
          </blockquote>

          {/* Attribution */}
          <div className="mt-6 flex items-center gap-4">
            {item.imageUrl ? (
              <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
            ) : (
              <div
                className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-lg font-semibold"
                style={{
                  backgroundColor: dark
                    ? "rgba(250,250,247,0.1)"
                    : "var(--site-surface)",
                  color: muted,
                }}
              >
                {item.name.charAt(0)}
              </div>
            )}
            <div>
              <p
                className="font-[var(--font-sans)] text-[13px] font-semibold"
                style={{ color: ink }}
              >
                {item.name}
              </p>
              {item.tagline && (
                <p
                  className="font-[var(--font-sans)] text-[11px] uppercase tracking-[0.15em]"
                  style={{ color: mutedAlpha || muted, opacity: dark ? 1 : 0.6 }}
                >
                  {item.tagline}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
