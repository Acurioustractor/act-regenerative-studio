# Public Copy Checklist

Quick reference for any user-facing copy on `act.place` and the studio website.
Use this with the `act-brand-alignment` skill before any text ships.

## Audience

External, partners, funders, philanthropy, community organisations, press,
the curious public. **Not** other ACT contributors.

## Patterns to avoid

These have all leaked into production at least once and were rewritten:

| Avoid | Why |
|---|---|
| "should X" ("Empathy Ledger should open with…") | Note-to-author leak |
| "durable memory", "source bridge", "flagship field", "living project system" | Internal architecture jargon |
| "consented live layer", "site-scoped syndication", "content hub fallback" | Debug/plumbing labels |
| "deeper spoke", "ACT hub framing", "second content system", "narrative work before the page asks for interpretation" | Internal voice |
| "Open wiki entry", "Open flagship field", "Open source bridges" CTAs | External readers don't know what these mean |
| "Imported from ACT Placemat curated-2025…", "Image: filename.jpg" | Captions that are import logs |
| Decorative emojis (👂🔍⚡🎨🌱🚀🌟💡🎯📍👥📖📊🛡⚙📈📚💬🌐💻🤝📝🌿💪🧭) in headings, badges, icon slots | Doesn't fit the warm editorial tone |

## Patterns to prefer

| Slot | External voice |
|---|---|
| Eyebrow | "About this project", "Background", "How we work", "From the field" |
| CTA | "Visit empathyledger.com", "Read more", "Background & method", "Watch", "Browse stories" |
| Caption | Describe the actual content of the image; don't editorialise on platform plumbing |
| Stat label | Plain noun ("Storytellers", "Stories", "Media items") |
| Section title | Speak to what the reader will find, not the architecture behind it |

## CTAs that point to internal surfaces

If a CTA links to `/wiki/{slug}`, label it for the reader: "Background &
method", "Read the full project page", "How this works". Never "Open wiki
entry", the wiki is internal-feeling for an external reader.

## Cards and click-throughs

- Image and video cards must click through to a real destination, never a
  raw `.jpg` or `.mp4` URL. Default fallback chain: external project site
  (`empathyledger.com`, etc.) → local `/storytellers` → if neither exists,
  consider not making it a link at all.
- Don't reuse the same image across multiple cards just to fill space. One
  honest card beats three shadow copies.

## Boundary sanitisation

When pulling content from external platforms (Empathy Ledger):
- Strip captions matching `^Imported from`, `^Image:\s`, `curated-2025`,
  `placemat`, "Compendium 2026" etc., these are import provenance, not
  captions.
- The boundary is `mapEmpathyLedgerMediaToGallery()` in
  `src/lib/projects/get-project-data.ts`. Add new patterns there.

## Process

1. **Always invoke `/act-brand-alignment`** before drafting any new public
   page or significant copy block.
2. **Run `npm run check:copy`** before committing. Wire it into a git
   pre-commit hook by adding `node scripts/check-public-copy.mjs --staged`
   to `.git/hooks/pre-commit`.
3. **When in doubt**, ask: would a partner who has never been in an ACT
   meeting understand this sentence? If no, rewrite.
