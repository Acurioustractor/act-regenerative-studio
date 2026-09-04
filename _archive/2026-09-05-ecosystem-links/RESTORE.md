# Archived 2026-09-05: the hand-typed ecosystem list

Two files moved here, paths preserved, on Ben's instruction ("archive the two
ecosystem files"), the same day the Living Field's platform links were held to
the project-code registry (commit a4a772c on feat/platform-links-from-registry).

| File | What it was |
|---|---|
| `src/data/ecosystem.ts` | A second, hand-typed list of ACT's sites. By the time it was archived it pointed Empathy Ledger at a Vercel preview host and Goods at Netlify, and nothing on a public page read it. |
| `src/components/EcosystemLinks.tsx` | Cards, compact list and buttons for the sibling sites, built on that list plus the wiki's canonical project records. It had no importers anywhere in `src/`. |

## Why archived rather than fixed

The registry in act-global-infrastructure (`config/project-codes.json`, synced
into `src/data/project-code-registry.generated.json`) already carries one
production URL per project, and `src/data/living-field.ts` now names the
platform code for each field with a guard test holding the two together. A
third copy of the same URLs could only drift, and this one had.

## What changed alongside the move

`src/lib/ecosystem/index.ts` used to merge this file into the bundled registry
for descriptions, URLs and GitHub repos. That merge was removed in a4a772c;
the library now reads the registry alone.

## To restore

```bash
git mv _archive/2026-09-05-ecosystem-links/src/data/ecosystem.ts src/data/ecosystem.ts
git mv _archive/2026-09-05-ecosystem-links/src/components/EcosystemLinks.tsx src/components/EcosystemLinks.tsx
```

Then re-add the import in `src/lib/ecosystem/index.ts` if the merge is wanted
back, and correct the URLs first: Empathy Ledger is `https://empathyledger.com`,
Goods is `https://www.goodsoncountry.com`. Better still, read them from the
registry, which is what replaced this.

Nothing under `_archive/` is compiled (`tsconfig.json` includes `src/**` only),
scanned by the copy gate, or served.
