import Link from "next/link";

const allFields = [
  { slug: "goods-on-country", href: "/goods-on-country", title: "Goods on Country", eyebrow: "Goods", video: "/media/field-videos/goods-community-build.mp4", poster: "/media/field-stills/goods-community-build.jpg" },
  { slug: "justicehub", href: "/justicehub", title: "JusticeHub", eyebrow: "Justice", video: "/media/field-videos/justicehub-container.mp4", poster: "/media/field-stills/justicehub-container.jpg" },
  { slug: "the-harvest", href: "/harvest", title: "The Harvest", eyebrow: "Commons", video: "/media/field-videos/harvest-witta-aerial.mp4", poster: "/media/field-stills/harvest-witta-aerial.jpg" },
  { slug: "empathy-ledger", href: "/empathy-ledger", title: "Empathy Ledger", eyebrow: "Stories", video: "/media/field-videos/empathy-ledger-elder-trip.mp4", poster: "/media/field-stills/empathy-ledger-elder-trip.jpg" },
  { slug: "black-cockatoo-valley", href: "/farm", title: "Black Cockatoo Valley", eyebrow: "Land", video: "/media/field-videos/hero-farm-aerial.mp4", poster: "/media/field-stills/hero-farm-aerial.jpg" },
];

export function RelatedFields({ currentSlug }: { currentSlug: string }) {
  const others = allFields.filter((f) => f.slug !== currentSlug).slice(0, 3);

  return (
    <section className="px-8 py-20">
      <div className="mx-auto max-w-[1200px]">
        <p className="font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--site-muted)]">
          Also from ACT
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {others.map((field) => (
            <Link
              key={field.slug}
              href={field.href}
              className="group relative overflow-hidden rounded-[var(--site-radius)]"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <video
                  src={field.video}
                  poster={field.poster}
                  className="h-full w-full object-cover transition-transform duration-[8s] group-hover:scale-[1.03]"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-label={field.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="font-[var(--font-sans)] text-[10px] font-semibold uppercase tracking-[0.3em] text-[#FAFAF7]/60">
                    {field.eyebrow}
                  </p>
                  <h3 className="mt-1 font-[var(--font-display)] text-lg font-semibold text-[#FAFAF7]">
                    {field.title}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
