## Field 6 — Any other notes?

Paste this entire block into the "Any other notes?" box. It's long on purpose — this is where you hand Claude the rules it will otherwise guess at.

---

**Read `DESIGN.md` at the repo root first — it is the authoritative spec.** What follows is the condensed brief.

### Two languages, one system
Any page must declare which language it's in. **Never mix them.**
- **Bold Documentary** — homepage + 5 flagship project pages (`/empathy-ledger`, `/farm`, `/goods`, `/harvest`, `/justicehub`). Full-bleed dark video heroes, Fraunces light display, 8px radius, editorial rhythm.
- **Warm Editorial** — ~33 meta/legal/directory pages (about, method, vision, people, wiki, etc). Rounded sand-coloured cards, tan/brown/olive palette, rounded-3xl corners, no hero media.

### Color tokens (reference these, never raw hex)
All live as CSS variables in `src/app/globals.css`:

**Bold Documentary palette**
- `--site-bg` `#FAFAF7` warm white (background)
- `--site-surface` `#F0EDE6` (cards, contrast sections)
- `--site-ink` `#1A1A1A` (body on light)
- `--site-muted` `#6B6B6B`
- `--site-green` `#2D5A3D` — primary accent, buttons, links
- `--site-green-soft` `#F0F7F1`
- `--site-clay` `#C4845C` — pull-quote borders, eyebrows on dark
- `--site-gold` `#B8943F` — tertiary highlights
- `--site-dark` `#1A1F1A` (never pure black; warm-black for dark sections)
- `--site-line` `rgba(26,26,26,0.12)` — hairlines, borders
- Semantic: success=forest green, warning=gold, error=`#B34233`

**Warm Editorial palette** (meta/legal pages)
- `--we-olive` `#2F3E2E` (headings)
- `--we-olive-deep` `#3A4A3D`
- `--we-brown` `#4D3F33` (body)
- `--we-brown-deep` `#4A4035`
- `--we-warm-brown` `#6B5A45`
- `--we-sand` `#E3D4BA` (card borders, chip backgrounds)

**Text on dark sections:** display=`#FAFAF7`, body=`#FAFAF7/60`, micro=`#FAFAF7/50`. Never `/65`, `/70`, `/75`. Consistency over nuance.

**No dark mode.** The identity is warm/light with dark section moments.

### Typography
- **Display/Hero** — **Fraunces**, weight 300 for large display, 600–700 emphasis. CSS var `--font-display`.
- **Body** — **Source Serif 4**, weight 400 body / 500 emphasis. CSS var `--font-body`. Serif body signals "this is writing worth reading."
- **UI/Labels** — **Work Sans**, weight 600, letter-spacing 0.15–0.35em, uppercase. CSS var `--font-sans`.
- **Code/Data** — **Geist Mono** for project codes, metadata.

Type scale (use `clamp()`, not fixed):
- Hero: `clamp(3rem, 7vw, 5.5rem)` / weight 300 / tracking -0.02em / line-height 1.05
- H2: `clamp(2rem, 4vw, 3rem)` / weight 300 / line-height 1.1
- Lede: `clamp(1.3rem, 2.5vw, 1.75rem)` / line-height 1.6
- Body: 18px / line-height 1.8
- Eyebrow hero: 11px / weight 600 / tracking 0.35em / uppercase
- Eyebrow section: 11px / weight 600 / tracking 0.30em / uppercase

### Border radius (important)
- **Standard:** `--site-radius` **8px** (cards, buttons, panels, images). Sharp, confident.
- **Small elements:** 4px (tags, micro-badges)
- **Full:** avatars only, always with `ring-2 ring-clay/30`
- **Warm Editorial exception:** uses `rounded-3xl` (24px) — this is intentional and only lives on that language.
- **Never 20+px radius in Bold Documentary.** No "app card" feel. The site is confident, not cuddly.

### Spacing
8px base. Section padding: `py-32 md:py-44` (standard), `py-16` (CTA strip), `py-8` (photo strip). Horizontal: `px-8` + `max-w-[1200px]`.

### Content widths
- Narrow prose / single lede: `max-w-[640px]`
- Dark-section prose / principles: `max-w-[800px]`
- Inquiry form grid: `max-w-[1100px]`
- Standard section: `max-w-[1200px]`

### Grids
- Editorial split (default): `grid gap-20 lg:grid-cols-2 lg:items-center` — prose left, image/stat aside right
- Narrative cards: 1–2 columns max (`md:grid-cols-2`). Never 3+ for narrative.
- **Hairline grid** (data/enumeration): 2–5 cols, uses `gap-px` + `bg-[var(--site-line)]` container trick to paint dividers between tiles. No per-card borders.

### Motion
- Easing: `ease-out` enter, `ease-in` exit, `ease-in-out` move
- Durations: micro 100ms, short 200ms, medium 300ms, long 500ms
- Card hover: `translateY(-6px) scale(1.01)` + shadow lift, 300ms
- Image hover: slow Ken Burns `scale(1.05)` over 8s
- Hero background: `slowZoom` 30s alternate
- Ambient: `animate-breathe` 8s, `animate-float` 6s

### Global texture
- `body::after` — 5% opacity fractal-noise overlay. Always on. Paper-feel grain.
- `.bg-paper-texture` utility for cards/panels needing extra texture.
- **Rule:** Never combine heavy texture with strong colour. Texture belongs to the whites and near-darks.

### Photography
- Documentary, not stock. Process photos, field documentation, community moments.
- Full-bleed preferred. No filters or colour grading — the photography is honest.
- Aspect ratios: hero 16:9 or wider, cards 4:3 or 16:10, editorial splits `aspect-[4/3]`.

### Voice (affects microcopy, button labels, empty states)
- **Grounded yet Visionary** — plant seeds today for forests tomorrow
- **Humble yet Confident** — we don't have all the answers, but we're cultivating solutions
- **Warm yet Challenging** — let's get our hands dirty with hard truths
- **Poetic yet Clear** — metaphor to illuminate, not obscure
- Sentence-case buttons ("Plan a visit", "Get in touch"). Uppercase is applied via class, not typed into the text.
- **Avoid:** savior narratives, corporate jargon, glossy marketing speak, luxury positioning, overclaiming, em-dashes in any ACT-facing copy.

### Component recipes to expect in the codebase
`src/components/design-system/` holds the Bold Documentary primitives (`DocHero`, `SectionHeader`, `HairlineGrid`, `LeadVoice`, `PrinciplesList`, `DarkCTA`). `src/components/warm-editorial/` holds the Warm Editorial cards. Top-level components include `PageHero`, `SectionHeading`, `CardGrid`, `LivingSystemStrip`, `MobileMenu`, `UnifiedFooter`, `EcosystemLinks`, `AskACT`, `MediaPicker`. Treat these as the source of truth; new components should match their token usage.

### What I want out of the generated design system
1. Re-materialise the Bold Documentary + Warm Editorial duality as two distinct but related themes.
2. Preserve the exact colour tokens and their roles (accent = green, secondary = clay, tertiary = gold).
3. Keep Fraunces + Source Serif 4 + Work Sans + Geist Mono as the four-font stack with the scale above.
4. Keep 8px radius for Bold Documentary; `rounded-3xl` only for Warm Editorial.
5. Produce: a token sheet, button/card/hero/section-header/stat-strip/hairline-grid/lead-voice variants, form controls, and nav/footer patterns for both languages.
