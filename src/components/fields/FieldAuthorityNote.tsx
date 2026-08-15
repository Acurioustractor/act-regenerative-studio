/**
 * Where ACT stands, on every field page.
 *
 * All five live field pages describe work alongside Elders, Aboriginal
 * communities and Country. None of them said whose organisation this is. The
 * page that did say it, /goods, is a 307 to /fields/goods in production, so the
 * statement was written where no reader reaches it.
 *
 * The words are the essay's own ("What the Road Corrects", Field Notes 01) and
 * match /about, so the site says this the same way wherever it says it.
 */
export function FieldAuthorityNote() {
  return (
    <section
      className="border-t border-rule bg-bg px-8 py-16 md:px-12 lg:px-20"
      aria-labelledby="field-authority-note"
    >
      <div className="mx-auto max-w-6xl">
        <p className="font-sans text-eyebrow font-semibold uppercase text-clay-text">
          Where we stand
        </p>
        <h2
          id="field-authority-note"
          className="mt-4 max-w-2xl font-display text-2xl font-light tracking-display text-ink md:text-3xl"
        >
          Who we are, and who we are not
        </h2>
        <p className="mt-6 max-w-2xl font-body text-base leading-relaxed text-muted-deep">
          A Curious Tractor is not a First Nations organisation and does not
          speak as one. When we are invited into work with First Nations
          communities, our responsibility is to follow community authority, be
          clear about what we hold, and accept correction, refusal and silence
          as part of the work. A relationship is not consent in perpetuity. A
          good history together does not turn the next visit into an
          entitlement.
        </p>
      </div>
    </section>
  );
}
