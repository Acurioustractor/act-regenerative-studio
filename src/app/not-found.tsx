import Link from "next/link";

export const metadata = {
  title: "Page not found",
  description:
    "The page you were looking for isn't here. The rest of the wiki, the projects, and the ecosystem are still a step away.",
};

export default function NotFound() {
  return (
    <div className="min-h-[70vh] bg-gradient-to-b from-[#F6F1E7] via-[#F5F1E8] to-white">
      <section className="mx-auto max-w-3xl px-4 py-24 md:py-32">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--we-warm-brown)]">
          404 · Not found
        </p>
        <h1 className="mt-4 font-[var(--font-display)] text-4xl font-semibold text-[var(--we-olive)] md:text-6xl">
          This page has moved, been retired, or never existed.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--we-brown)] md:text-lg">
          The site changes as the work changes. Something here didn&rsquo;t
          survive the last pass. Here are the places worth trying instead.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <Link
            href="/"
            className="rounded-[24px] border border-[var(--we-sand)] bg-white/90 p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[#7A9B76] hover:shadow-lg"
          >
            <p className="text-xs uppercase tracking-[0.24em] text-[#7A6A55]">
              Start over
            </p>
            <h2 className="mt-2 font-[var(--font-display)] text-2xl font-semibold text-[var(--we-olive)]">
              Home
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--we-brown)]">
              The map of what ACT is doing right now.
            </p>
          </Link>

          <Link
            href="/projects"
            className="rounded-[24px] border border-[var(--we-sand)] bg-white/90 p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[#7A9B76] hover:shadow-lg"
          >
            <p className="text-xs uppercase tracking-[0.24em] text-[#7A6A55]">
              The work
            </p>
            <h2 className="mt-2 font-[var(--font-display)] text-2xl font-semibold text-[var(--we-olive)]">
              Projects
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--we-brown)]">
              Every public work, by cluster.
            </p>
          </Link>

          <Link
            href="/wiki"
            className="rounded-[24px] border border-[var(--we-sand)] bg-white/90 p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[#7A9B76] hover:shadow-lg"
          >
            <p className="text-xs uppercase tracking-[0.24em] text-[#7A6A55]">
              Thinking in public
            </p>
            <h2 className="mt-2 font-[var(--font-display)] text-2xl font-semibold text-[var(--we-olive)]">
              Wiki
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--we-brown)]">
              Methods, decisions, and the people behind every project.
            </p>
          </Link>

          <Link
            href="/contact"
            className="rounded-[24px] border border-[var(--we-sand)] bg-white/90 p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[#7A9B76] hover:shadow-lg"
          >
            <p className="text-xs uppercase tracking-[0.24em] text-[#7A6A55]">
              Get in touch
            </p>
            <h2 className="mt-2 font-[var(--font-display)] text-2xl font-semibold text-[var(--we-olive)]">
              Contact
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--we-brown)]">
              Tell us what you were looking for.
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
