# Claude Design System — Submission Package

Everything you need to fill out [claude.ai/design/p/019dc13d-a3fd-74fa-85b3-701c3780d7e9?setup=design-system](https://claude.ai/design/p/019dc13d-a3fd-74fa-85b3-701c3780d7e9?setup=design-system) in one pass.

Work top to bottom:

| # | Form field | File |
|---|---|---|
| 1 | Company name and blurb | [`1-company-blurb.md`](./1-company-blurb.md) |
| 2 | Link code on GitHub | [`2-github-link.md`](./2-github-link.md) |
| 3 | Link code from your computer | [`2-github-link.md`](./2-github-link.md) (same file) |
| 4 | Upload a .fig file | *skip — no Figma master exists* |
| 5 | Add fonts, logos and assets | [`3-fonts-logos-assets.md`](./3-fonts-logos-assets.md) |
| 6 | Any other notes? | [`4-any-other-notes.md`](./4-any-other-notes.md) |

## Why this order

- **Blurb** primes the generator with the two-language duality so it doesn't produce a single generic theme.
- **Local folder upload** beats the GitHub link because Claude won't index the whole monorepo — we point it at `src/` only.
- **`DESIGN.md` at repo root** is your real spec; the assets and notes reinforce it.
- **The notes field** carries the rules Claude would otherwise guess at — colour tokens, radius rule, "no em-dashes", anti-patterns.

## What to skip
- `.fig` upload — no Figma master in this repo.
- Extra media — pick 4–6 hero images, not the full `field-stills` folder (it's 50+ files and will dilute the signal).

## After generation
Download what it gives you and diff against `DESIGN.md`. Discrepancies to watch for:
- Did it preserve the 8px vs `rounded-3xl` split between languages?
- Did it keep `--site-green` as primary accent, or did it promote clay/gold by accident?
- Did it generate a dark mode? (Reject — site has no dark mode.)
- Did it introduce em-dashes or corporate-speak in microcopy? (Reject.)
