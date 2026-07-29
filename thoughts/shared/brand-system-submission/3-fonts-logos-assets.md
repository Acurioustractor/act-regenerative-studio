## Field 5 — Add fonts, logos and assets

Drag these files into the "Drag files here or browse" zone. Grouped by priority.

### Logo (required)
```
/Users/benknight/Code/act-regenerative-studio/public/branding/act-logo.svg
/Users/benknight/Code/act-regenerative-studio/public/branding/act-logo-clay.svg
/Users/benknight/Code/act-regenerative-studio/public/branding/act-logo-plate.svg
/Users/benknight/Code/act-regenerative-studio/public/branding/act-logo-square.png
/Users/benknight/Code/act-regenerative-studio/public/favicon.ico
```

> **Variants:**
> - `act-logo.svg` — primary vector master. Uses `currentColor`, so the mark inherits whatever `color:` is set on the parent. Works on every surface in both Bold Documentary and Warm Editorial languages.
> - `act-logo-clay.svg` — clay (`#C4845C`) baked in. For places that can't control colour via CSS (PDF exports, email, third-party embeds).
> - `act-logo-plate.svg` — warm-white rounded plate version for avatars, favicons, app icons, social profile images.
> - `act-logo-square.png` — the original hand-drawn raster. Keep it; use it when the brand wants its hand-drawn warmth rather than the geometric vector.
>
> **Preview all variants:** open `public/branding/preview.html` in a browser.

### Hero / representative imagery (pick 4–6, not all)
These set the visual tone. Prefer the aerial and community shots that show *land + people*, not product renders:

```
/Users/benknight/Code/act-regenerative-studio/public/media/field-stills/jinibara-country-aerial.jpg
/Users/benknight/Code/act-regenerative-studio/public/media/field-stills/hero-farm-aerial.jpg
/Users/benknight/Code/act-regenerative-studio/public/media/field-stills/black-cockatoo-valley-farm-aerial-2.jpg
/Users/benknight/Code/act-regenerative-studio/public/media/field-stills/harvest-witta-aerial.jpg
/Users/benknight/Code/act-regenerative-studio/public/media/field-stills/empathy-ledger-elder-trip.jpg
/Users/benknight/Code/act-regenerative-studio/public/media/field-stills/goods-community-build.jpg
```

### Placemat poster (brand system snapshot)
```
/Users/benknight/Code/act-regenerative-studio/public/act_placemat_2026_poster.png
```

### Videos — skip the upload
The repo ships 12 MP4s in `public/media/field-videos/` (hero-farm-aerial, black-cockatoo-valley aerial, goods-delivery, empathy-ledger elder-trip, etc.) but the Claude design system generator is primarily a static-visual tool — video uploads may be stripped or ignored. The live site URL (`https://www.act.place`) in the blurb already gives Claude a crawlable view of the homepage hero video and flagship page motion, which is the better signal.

If you want one motion sample on the upload anyway, use:
```
/Users/benknight/Code/act-regenerative-studio/public/media/field-videos/hero-farm-aerial.mp4
```

### Fonts
**Do not upload font files.** All four typefaces are loaded via `next/font/google` in `src/app/layout.tsx` — Claude will see this in the codebase. For reference the fonts are:

- **Fraunces** (display/hero) — variable, opsz 9–144
- **Source Serif 4** (body) — variable, opsz 8–60
- **Work Sans** (UI/labels)
- **Geist Mono** (project codes, data)
