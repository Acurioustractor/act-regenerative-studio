## Field 2 — Link code on GitHub

Paste this into the "Link code on GitHub" field:

```
https://github.com/Acurioustractor/act-regenerative-studio
```

Click **Add**.

---

## Field 3 — Link code from your computer (recommended alternative)

**Preferred over the GitHub link**, because Claude won't crawl the whole repo — only the frontend matters for a design system.

Drag this folder into the "Drag a folder here or browse" drop zone:

```
/Users/benknight/Code/act-regenerative-studio/src
```

If the uploader chokes on size, use these subfolders in priority order:

1. `/Users/benknight/Code/act-regenerative-studio/src/components` — all recipes (design-system/, warm-editorial/, PageHero, CardGrid, LivingSystemStrip, SectionHeading, etc.)
2. `/Users/benknight/Code/act-regenerative-studio/src/app/globals.css` — token definitions
3. `/Users/benknight/Code/act-regenerative-studio/DESIGN.md` — the authoritative design language doc
4. `/Users/benknight/Code/act-regenerative-studio/tailwind.config.ts`

Do **not** upload `src/data/` (generated JSON), `opc/`, `scripts/`, `supabase/`, or `thoughts/`. They add noise.
