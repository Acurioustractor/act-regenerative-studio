import Link from "next/link";

export default function AdminHomePage() {
  return (
    <section className="rounded-3xl border border-[var(--we-sand)] bg-white/70 p-6">
      <h2 className="text-xl font-semibold text-[var(--we-olive)] font-[var(--font-display)]">
        Welcome to the content studio
      </h2>
      <p className="mt-2 text-sm text-[var(--we-brown)]">
        Choose where you want to work.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/admin/ecosystem"
          className="rounded-full bg-forest px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white"
        >
          Ecosystem Dashboard
        </Link>
        <Link
          href="/vision"
          className="rounded-full bg-[var(--we-olive)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white"
        >
          Vision Book
        </Link>
        <Link
          href="/admin/engine"
          className="rounded-full bg-[#1e1e1e] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white border border-gray-700"
        >
          Engine Notes
        </Link>
        <Link
          href="/admin/content"
          className="rounded-full border border-forest px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--we-olive)]"
        >
          Manage content
        </Link>
        <Link
          href="/admin/media"
          className="rounded-full border border-forest px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--we-olive)]"
        >
          Media library
        </Link>
        <Link
          href="/admin/media-lab"
          className="rounded-full border border-forest px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--we-olive)]"
        >
          Media lab
        </Link>
      </div>
    </section>
  );
}
