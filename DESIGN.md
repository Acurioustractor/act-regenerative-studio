# Design System — A Curious Tractor

## Product Context
- **What this is:** Public-facing website for ACT, a regenerative innovation ecosystem
- **Who it's for:** Funders evaluating, artists seeking collaboration, community members, curious strangers
- **Space/industry:** Social practice art, regenerative agriculture, community-led innovation
- **Project type:** Editorial/portfolio hybrid with living data (58 projects, 319 storytellers, 5,039 media)

---

## Two Design Languages

This site intentionally uses **two visual languages** for two kinds of content. Pick the right one before building a new page.

### 🎥 Bold Documentary — for flagship project narratives
The big cinematic treatment. Full-bleed dark video heroes, Fraunces light display type, forest green + clay accents on warm white, 8px sharp corners, editorial rhythm. Feels like a field journal.

**Use when:** The page tells a single project's story with hero media, stats, lead voices, and a clear CTA. This is the headline treatment — use it sparingly.

**Currently applied to:**
- Homepage (`/`)
- Flagship project pages: `/empathy-ledger`, `/farm`, `/goods`, `/harvest`, `/justicehub`

**Components:** `src/components/design-system/` — `DocHero`, `SectionHeader`, `HairlineGrid`, `LeadVoice`, `PrinciplesList`, `DarkCTA`

### 📄 Warm Editorial — for meta, legal, and supporting content
The quiet informational treatment. Rounded sand-colored cards, tan/brown/olive palette, rounded-3xl corners, softer hierarchy. Feels like reading a thoughtful printed booklet.

**Use when:** The page is about ACT itself (not a single project), gives reference info, holds legal copy, lists things, or routes visitors across the ecosystem. No hero media required.

**Currently applied to:** 33 pages including about, method, principles, vision, impact, how-we-work, studio, governance, ecosystem, engine, contact, people, partners, events, media, media-lab, ask, projects index, terms, privacy, wiki/*, art/*, and flagship sub-pages (farm/stay, farm/retreats, farm/workshops, harvest/csa, harvest/produce).

**Components:** `src/components/PageHero.tsx`, `src/components/SectionHeading.tsx`, `src/components/CardGrid.tsx`, `src/components/LivingSystemStrip.tsx` (17 pages)

### Decision rule
| Question | Answer | Language |
|---|---|---|
| Is this one project's dedicated narrative page? | Yes | Bold Documentary |
| Is this the site homepage? | Yes | Bold Documentary |
| Does the page have a cover video or hero image? | Yes, and it's telling a story | Bold Documentary |
| Is this about ACT, a method, legal, or a directory? | Yes | Warm Editorial |
| Does the page list many things (projects, people, artists, events)? | Yes | Warm Editorial |
| Is it a sub-page of a flagship (stays, workshops, produce)? | Yes | Warm Editorial |

**Don't mix them on one page.** If a page wants both energies, that's a signal the page is doing too much — split it.

---

## Bold Documentary

### Aesthetic Direction
- **Direction:** Bold Documentary
- **Decoration level:** Intentional (grain texture, editorial rules, pull-quote borders)
- **Mood:** A field journal written at scale. Confident, curious, grounded. Not polished. Not precious. Alive. The first emotion should be curiosity.
- **Reference sites:** Neri Oxman (oxman.com), Naughtyduk (naughtyduk.com), Forensic Architecture, Theaster Gates, Assemble Studio
- **Anti-patterns:** No rounded-corner padding soup. No generic card grids. No nonprofit template energy. No decorative blobs. No gradient buttons. No centered everything.

## Typography

Fonts are loaded in `src/app/layout.tsx` via `next/font/google` and exposed as CSS variables.

- **Display/Hero — Fraunces** (variable, opsz 9-144). CSS var: `--font-display`. Warm, serious, human. Weight 300 for large display, 600-700 for emphasis.
- **Body — Source Serif 4** (variable, opsz 8-60). CSS var: `--font-body`. Editorial weight, reads like a journal. Serif body signals "this is writing worth reading." Weight 400 body, 500 emphasis.
- **UI/Labels — Work Sans.** CSS var: `--font-sans`. For eyebrows, nav, badges, button labels, meta. Weight 600, letter-spacing 0.15–0.35em, uppercase.
- **Code/Data — Geist Mono.** For project codes, technical metadata, data displays.
- **Scale:**
  - Hero: `clamp(3rem, 7vw, 5.5rem)` / weight 300 / tracking -0.02em / line-height 1.05
  - Section heading (H2): `clamp(2rem, 4vw, 3rem)` / weight 300 / line-height 1.1
  - Reading lede (narrow prose): `clamp(1.3rem, 2.5vw, 1.75rem)` / line-height 1.6
  - Large body (sections): 18px / line-height 1.8
  - Card title: 20–24px / weight 600
  - Card body: 14–15px / line-height 1.7–1.8
  - Eyebrow (hero): 11px / weight 600 / tracking 0.35em / uppercase
  - Eyebrow (section): 11px / weight 600 / tracking 0.30em / uppercase
  - Micro-label: 10px / weight 600 / tracking 0.20em / uppercase

## Color

Tokens live as CSS variables in `src/app/globals.css:5-21`. Always reference vars, never hex, except `#FAFAF7` on dark sections (warm white over dark is intentional and matches `--site-bg`).

- **Approach:** Restrained (1 primary accent + earth neutrals; photography provides visual richness)
- **Background — `--site-bg`** #FAFAF7 (warm white)
- **Surface — `--site-surface`** #F0EDE6 (cards, full-bleed contrast sections)
- **Panel — `--site-panel`** rgba(250, 250, 247, 0.95) (frosted nav/glass surfaces)
- **Ink — `--site-ink`** #1A1A1A (body text on light)
- **Muted — `--site-muted`** #6B6B6B (secondary text on light)
- **Green (primary accent) — `--site-green`** #2D5A3D
- **Green-soft — `--site-green-soft`** #F0F7F1 (green-tinted backgrounds)
- **Clay — `--site-clay`** #C4845C (pull-quote borders, eyebrows on dark/hero, secondary badges)
- **Gold — `--site-gold`** #B8943F (tertiary accent, highlights)
- **Dark — `--site-dark`** #1A1F1A (dark sections, not pure black)
- **Line — `--site-line`** rgba(26, 26, 26, 0.12) (borders, hairlines)
- **Shadows:** `--site-shadow` / `--site-shadow-hover` (already defined in globals.css)
- **Semantic:** success = forest green, warning = gold, error = #B34233
- **Dark mode:** Not planned. The site's identity is warm/light with dark section moments.

### Text on dark sections
- Display headings: `#FAFAF7` (100%)
- Body: `#FAFAF7/60`
- Micro/tagline: `#FAFAF7/50`
- **Rule:** Never use `/65`, `/70`, `/75` for dark-section body. Use `/60` for body, `/50` for micro. Consistency over nuance.

## Spacing
- **Base unit:** 8px
- **Density:** Comfortable body, generous between sections
- **Scale:** 2xs(4) xs(8) sm(16) md(24) lg(32) xl(48) 2xl(64) 3xl(80) 4xl(100-120)

### Section padding rhythm (use these, not custom values)
- **Standard section:** `py-32 md:py-44`
- **CTA strip / full-project-page callout:** `py-16`
- **Photo strip:** `py-8`
- **Horizontal:** `px-8` for standard sections (`clamp(1.5rem, 4vw, 3rem)` is handled by `main > section` default)

## Layout

### Content widths
- **Narrow prose / single lede:** `max-w-[640px]`
- **Dark-section prose block / principles list / lead voice:** `max-w-[800px]`
- **Inquiry form grid:** `max-w-[1100px]`
- **Standard section:** `max-w-[1200px]`
- Full-bleed breaks out to 100vw via the `.full-bleed` class.

### Grids
- **Approach:** Creative-editorial + hairline-grid for data
- **Editorial split (default for narrative sections):** `grid gap-20 lg:grid-cols-2 lg:items-center` — prose left, image/stat aside right
- **Card grid (narrative):** 1–2 columns (`md:grid-cols-2`), no 3+ for narrative cards
- **Hairline grid (data/enumeration):** 2–5 columns allowed. See "Hairline Grid" component below. Denser grids are for data-like content (consent types, stats, 5-step processes), never for narrative cards.
- **Asymmetric splits:** 60/40 and 50/50 ok for editorial

### Border radius
- **Standard — `--site-radius`** 8px (cards, buttons, panels, images)
- **Small elements:** 4px (tags, micro-badges)
- **Full:** avatars only (rounded-full, always with `ring-2 ring-[var(--site-clay)]/30` or equivalent accent ring)
- **Never:** 20+px radius. No 28px "app card" feel. The site is confident, not cuddly.

## Motion
- **Approach:** Intentional (not flashy, not static)
- **Easing:** `ease-out` enter, `ease-in` exit, `ease-in-out` move
- **Duration:** micro(100ms) short(200ms) medium(300ms) long(500ms)
- **Card hover:** `translateY(-6px)` + `scale(1.01)` + shadow lift, 300ms
- **Image hover:** `scale(1.05)` over 8s (slow Ken Burns)
- **Hero background:** `slowZoom` 30s cycle (keyframes in globals.css)
- **Scroll reveal:** Use `<ScrollReveal>` component for section entries
- **Video headers:** Supported for hero sections. Muted autoplay with poster fallback via `<SiteLoopVideo>`.
- **Body ambient:** `animate-breathe` (8s), `animate-float` (6s) available for subtle elements

## Photography Style
- **Documentary, not stock.** Process photos, field documentation, community moments.
- **Full-bleed preferred.** Images should feel immersive, not contained in cards.
- **No filters or color grading.** The photography is honest.
- **Aspect ratios:** Hero 16:9 or wider. Cards 4:3 or 16:10. Editorial splits: aspect-[4/3] inside container.

## Global texture
- **Body noise overlay:** `body::after` — 5% opacity fractal noise. Always on. Adds paper-feel grain.
- **`.bg-paper-texture`** utility class: apply to cards/panels that need additional texture (5% opacity SVG noise).
- **Rule:** Never combine heavy texture with strong colors. Texture belongs to the whites and near-darks.

---

## Components

All components are composed from the tokens above. Prefer these recipes over custom one-offs.

### Page Hero (every top-level project page)
```tsx
<section className="full-bleed relative flex min-h-[90vh] flex-col justify-end overflow-hidden bg-[var(--site-dark)]">
  <div className="absolute inset-0">
    {/* SiteLoopVideo or Image with class: object-cover animate-[slowZoom_30s_ease-in-out_infinite_alternate] */}
    <div className="absolute inset-0 bg-gradient-to-t from-[var(--site-dark)] via-[var(--site-dark)]/25 to-transparent" />
  </div>
  <div className="relative z-10 mx-auto w-full max-w-[1200px] px-8 pb-24 pt-40 md:pb-32">
    <p className="font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.35em] text-[var(--site-clay)]">{eyebrow}</p>
    <h1 className="mt-4 max-w-[16ch] font-[var(--font-display)] text-[clamp(3rem,7vw,5.5rem)] font-light leading-[1.05] tracking-[-0.02em] text-[#FAFAF7]">{title}</h1>
    <p className="mt-6 max-w-md font-[var(--font-body)] text-lg leading-[1.7] text-[#FAFAF7]/60">{subhead}</p>
    <div className="mt-12 flex flex-wrap gap-5">{/* Primary-on-dark + Ghost-on-dark CTAs */}</div>
  </div>
</section>
```
- Always `full-bleed`, `min-h-[90vh]`, dark bg, video/image with `slowZoom`, bottom gradient, clay eyebrow, Fraunces light display, short subhead (max ~20 words), 2 CTAs.
- Eyebrow tracking is `0.35em` on hero (wider than section eyebrows at 0.3em).

### Section Header (the universal formula)
```tsx
<p className="font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--site-clay)]">{eyebrow}</p>
<h2 className="mt-4 font-[var(--font-display)] text-[clamp(2rem,4vw,3rem)] font-light leading-[1.1] text-[var(--site-ink)]">{title}</h2>
<p className="mt-8 font-[var(--font-body)] text-lg leading-[1.8] text-[var(--site-muted)]">{lede}</p>
```
- Eyebrow color: `clay` for most sections, `muted` for neutral/meta sections (gallery, inquiry, ecosystem connections), `clay` on dark.
- On dark: swap `text-[var(--site-ink)]` → `text-[#FAFAF7]`, `text-[var(--site-muted)]` → `text-[#FAFAF7]/60`.
- Rhythm: `mt-4` between eyebrow and title, `mt-8` between title and lede. Never deviate.

### `.site-eyebrow` (alternate with dash prefix)
Defined in globals.css. Used in nav/metadata strips where the eyebrow wants a visible leading hairline (`1.8rem × 1px`). Use sparingly — heroes and section headers skip the dash.

### Reading Lede (narrow prose block)
```tsx
<section className="px-8 py-32 md:py-44">
  <div className="mx-auto max-w-[640px]">
    <p className="font-[var(--font-body)] text-[clamp(1.3rem,2.5vw,1.75rem)] leading-[1.6] text-[var(--site-ink)]">
      {long-form opening paragraph}
    </p>
  </div>
</section>
```
- Used after heroes to give the argument weight before cards begin. Always 640px wide. Body font, not display.

### Editorial Split
```tsx
<div className="mx-auto max-w-[1200px] grid gap-20 lg:grid-cols-2 lg:items-center">
  <div>{/* Section Header + prose */}</div>
  <div>{/* aspect-[4/3] image OR small card grid (2-col) */}</div>
</div>
```
- Default container for most narrative sections.
- Right side is either one `aspect-[4/3]` image OR a 2×N card grid.

### Hairline Grid (for data/enumeration)
```tsx
<div className="mt-16 grid gap-px overflow-hidden rounded-[var(--site-radius)] bg-[var(--site-line)] md:grid-cols-5">
  {items.map(item => (
    <div key={item.id} className="bg-[var(--site-bg)] p-8">{/* content */}</div>
  ))}
</div>
```
- The `gap-px` + `bg-[var(--site-line)]` container trick paints hairlines between tiles without borders.
- Column counts allowed: `md:grid-cols-2`, `md:grid-cols-3`, `md:grid-cols-5`. Pick based on item count.
- Padding: `p-8` (compact), `p-10` (breathing). Never `p-6` or less (cards feel cramped).
- Children get `bg-[var(--site-bg)]` (light) or `bg-[var(--site-dark)]` (dark variant).

### Lead Voice Block
```tsx
<section className="full-bleed bg-[var(--site-dark)] px-8 py-32 md:py-44">
  <div className="mx-auto max-w-[800px]">
    <blockquote className="border-l-4 border-[var(--site-clay)] pl-10 md:pl-14">
      <p className="font-[var(--font-display)] text-[clamp(1.4rem,3vw,2.2rem)] font-light italic leading-[1.5] text-[#FAFAF7]">
        &ldquo;{excerpt}&rdquo;
      </p>
      <footer className="mt-10 flex items-center gap-5">
        {/* 64px avatar: rounded-full ring-2 ring-[var(--site-clay)]/30 */}
        <div>
          <p className="font-[var(--font-sans)] text-[15px] font-semibold text-[#FAFAF7]">{name}</p>
          {tagline && <p className="mt-1 font-[var(--font-sans)] text-[11px] uppercase tracking-[0.15em] text-[#FAFAF7]/50">{tagline}</p>}
        </div>
      </footer>
    </blockquote>
  </div>
</section>
```
- Always on `--site-dark`, always `max-w-[800px]`, always `border-l-4` clay (4px, bolder than principle lists).
- Avatar: 64×64, `rounded-full`, `ring-2 ring-clay/30`.

### Principles List (vertical stack with clay markers)
```tsx
<div className="mt-12 space-y-8">
  {principles.map(p => (
    <div key={p.title} className="border-l-[3px] border-[var(--site-clay)] pl-8">
      <h3 className="font-[var(--font-display)] text-lg font-semibold text-[var(--site-ink)]">{p.title}</h3>
      <p className="mt-2 font-[var(--font-body)] text-[15px] leading-[1.8] text-[var(--site-muted)]">{p.body}</p>
    </div>
  ))}
</div>
```
- Always `border-l-[3px]` clay (3px, lighter than lead voice — signals list vs. dramatic callout).
- For plain prose tenets (no title/body pair), use `pl-6` + body text directly on the left border.
- Dark variant: swap ink → `#FAFAF7`, muted → `#FAFAF7/60`.

### Photo Break (full-bleed image between sections)
```tsx
<section className="full-bleed mt-8 md:mt-16">
  <div className="relative h-[50vh] md:h-[60vh] w-full overflow-hidden">
    <EditableImage fill sizes="100vw" className="object-cover object-top" ... />
  </div>
</section>
```
- 50vh mobile, 60vh desktop. Always object-top by default (most field photos lead with sky or subject in upper portion).

### Photo Strip (3–4 image row)
- Use `<PhotoStrip images={...} columns={3|4} aspectRatio="square|16:10" />` inside `section className="px-8 py-8"` + `max-w-[1200px]` wrapper.

### Buttons

**Primary on light:**
- `bg-[var(--site-green)] text-white`, 8px radius, UI font uppercase, tracking `0.12em`, `px-10 py-5`
- Hover: `translateY(-2px)` + shadow

**Primary on dark (inverted):**
```
rounded-[var(--site-radius)] bg-[#FAFAF7] px-10 py-5
font-[var(--font-sans)] text-[14px] font-semibold uppercase tracking-[0.12em]
text-[var(--site-dark)]
transition hover:-translate-y-0.5 hover:shadow-[0_8px_40px_rgba(250,250,247,0.15)]
```

**Ghost on dark:**
```
rounded-[var(--site-radius)] border-2 border-[#FAFAF7]/30 px-10 py-5
font-[var(--font-sans)] text-[14px] font-semibold uppercase tracking-[0.12em]
text-[#FAFAF7]/90
transition hover:border-[#FAFAF7]/60 hover:text-[#FAFAF7]
```

**Secondary on light (outlined green):**
```
rounded-[var(--site-radius)] border-2 border-[var(--site-green)] px-8 py-4
font-[var(--font-sans)] text-[13px] font-semibold uppercase tracking-[0.12em]
text-[var(--site-green)]
transition hover:bg-[var(--site-green)] hover:text-white
```
Used for "Full project page →" terminal strips.

**Ghost on light:**
- Transparent, accent color text, arrow suffix. Inline CTAs only.

**Button copy:** Always sentence-case for primary ("Plan a visit", "Get in touch"). Always uppercase tracking for labels (via the class, not the text).

### Cards (narrative)
- Background `#fff`, border `1px solid var(--site-line)`, radius `var(--site-radius)`, shadow at rest, lifted on hover
- Padding: `p-8` (compact) / `p-10` (breathing)
- Image: full-width, no padding, matches card radius
- Eyebrow: UI font, 10px, 0.2em tracking, color clay

### Tags/Badges
- **Tags:** surface bg, muted text, 4px radius, UI font 10px, tracking 0.2em
- **Badges:** solid color bg (green/clay/gold), white text, 4px radius
- **Outline badge:** 1.5px ink border, transparent bg

### Pull Quotes (inline, not hero)
- `border-l-4 border-clay pl-10`
- Fraunces italic, 28px, weight 400
- Citation below: UI font, muted, uppercase
- See "Lead Voice Block" for full-width dark-section version

### Dark Sections
- `bg-[var(--site-dark)]` (full-bleed)
- Display text `#FAFAF7`, body `#FAFAF7/60`, micro `#FAFAF7/50`
- Tags: `rgba(250,250,247,0.1)` bg
- Use for: lead voices, stat strips, CTAs, manifesto lines, dark section moments

### Stats Strip
```tsx
<div className="grid grid-cols-2 gap-12 md:grid-cols-4 md:gap-16 text-center">
  {stats.map(s => <AnimatedStat key={s.label} value={s.value} label={s.label} />)}
</div>
```
- Always inside a `full-bleed bg-dark` section with `max-w-[1200px]`
- Numbers: Fraunces, bold, accent color
- Labels: UI font, muted, uppercase

### Comparison Stat Pair (for before/after or cost deltas)
```tsx
<div className="grid grid-cols-2 gap-6">
  <div className="rounded-[var(--site-radius)] border border-[var(--site-line)] p-8">
    <p className="font-[var(--font-display)] text-4xl font-bold text-[var(--site-ink)]">{lossyValue}</p>
    <p className="mt-2 font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--site-muted)]">{lossyLabel}</p>
    <p className="mt-3 font-[var(--font-body)] text-[14px] text-red-600/70">{lossyMeta}</p>
  </div>
  <div className="rounded-[var(--site-radius)] border-2 border-[var(--site-green)] p-8">
    <p className="font-[var(--font-display)] text-4xl font-bold text-[var(--site-green)]">{winValue}</p>
    <p className="mt-2 font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--site-muted)]">{winLabel}</p>
    <p className="mt-3 font-[var(--font-body)] text-[14px] text-[var(--site-green)]">{winMeta}</p>
  </div>
</div>
```
- Winner card gets `border-2 border-green`; losing card gets neutral `border border-line`.
- Used for evidence framing ($1.3M detention vs $14K community on JusticeHub).

### Navigation
- Style: frosted glass (`backdrop-filter: blur(14px)`, 95% opacity bg via `--site-panel`)
- Logo: Fraunces 20px bold
- Links: UI font 12px, muted, uppercase, tracking 0.2em
- Hover: color to ink

### Terminal "Full project page →" strip
- `full-bleed bg-[var(--site-surface)] px-8 py-16`
- 2-col: copy left, secondary-on-light button right
- Used at the bottom of flagship pages to route curious visitors to the deeper project page

---

## Warm Editorial

The informational-content language. Soft, warm, quiet. Prioritizes scannability over drama. Lives on the meta/legal/directory pages where Bold Documentary would feel too heavy.

### Aesthetic Direction
- **Direction:** Warm Editorial
- **Decoration level:** Intentional (soft sand borders, decorative blurred blobs on hero, warm gradients)
- **Mood:** A thoughtful printed booklet. Calm, considered, grounded. The reader should feel invited to read without being performed at.
- **Anti-patterns:** No dark video heroes (that's Bold Documentary). No forest green CTAs (Warm Editorial uses its own palette). No 8px sharp corners (reserved for Bold Documentary).

### Typography
Same fonts as Bold Documentary (Fraunces display, Source Serif 4 body, Work Sans UI) — the site has one type system, two color/shape systems.

### Color (Warm Editorial palette)
These are currently hardcoded in components. Consider extracting to CSS vars (`--we-*`) if the language grows.

- **Olive ink — `#2F3E2E`** — primary headings
- **Deep brown body — `#4D3F33`** — body copy
- **Warm brown eyebrow — `#6B5A45`** — eyebrows, muted UI labels
- **Sand border — `#E3D4BA`** — card/panel borders (also `#E1D3BA` in CardGrid)
- **Sand surface — `#F6F1E7`** — warm backgrounds and gradient start
- **Mid-tan — `#E7DDC7`** — gradient mid stop
- **Deep tan — `#D7C4A2`** — gradient end stop
- **Sage blob — `#d9ead7`** — decorative hero blob (30% opacity, blurred)
- **Amber blob — `#d3a24f`** — decorative hero blob (15% opacity, blurred)
- **Meta text — `#4A4035`** — small pill/label text
- **Hover green — `#4CAF50`** — card hover border accent

### Shape
- **Card radius:** `rounded-3xl` (24px) — soft, generous
- **Small elements:** `rounded-full` for pills
- **Card pattern:** `rounded-3xl border border-[#E3D4BA] bg-white/70 p-8` with `text-sm leading-7 text-[#4D3F33]`

### Spacing
- **Page container:** `space-y-16` to `space-y-20` between sections
- **Card padding:** `p-6` (compact) or `p-8` / `p-12` (breathing)
- **Card grid gaps:** `gap-6`

### Components

Located in `src/components/` (NOT `src/components/design-system/`).

**`PageHero` (legacy)** — `src/components/PageHero.tsx`
- Rounded sand-colored panel with decorative blurred blobs
- `eyebrow`, `title`, `description`, `actions: [{label, href, variant: 'solid' | 'outline'}]`
- Optional `children` slot renders as a right-hand info panel
- Optional `coverImage` / `coverVideo` renders above as `h-[42vh]` rounded top
- Keep using this for every Warm Editorial page hero

**`SectionHeading` (legacy)** — `src/components/SectionHeading.tsx`
- `eyebrow`, `title`, `description`, `align: 'left' | 'center'`
- Uses the `.site-eyebrow` class with dash prefix
- Pair with `CardGrid` or a custom section body

**`CardGrid`** — `src/components/CardGrid.tsx`
- Pass `cards: [{title, description?, eyebrow?, href?, ctaLabel?}]`
- Renders `rounded-3xl border border-[#E1D3BA] bg-white/70 p-6` cards
- Green hover border `#4CAF50`
- Use for lists of projects, method steps, identity cards, etc.

**`LivingSystemStrip`** — `src/components/LivingSystemStrip.tsx`
- Shared infrastructure on 17 meta pages. Shows "this page connects to the living ecosystem" with wiki link + live data pill + stats
- `eyebrow`, `title`, `description`, `wiki: {href, label}`, `live: {sourceLabel, href}`, `stats: [{label, value}]`
- Appears after the hero on most Warm Editorial pages

### Button patterns
- **Solid (primary):** `bg-[var(--site-green)] px-6 py-3 text-xs uppercase tracking-[0.22em] text-white` — Warm Editorial still uses the forest green primary, just at a lighter weight than Bold Documentary
- **Outline (secondary):** `border-[1.5px] border-[var(--site-ink)] px-6 py-3 text-xs uppercase tracking-[0.22em] text-[var(--site-ink)] hover:bg-ink hover:text-white`

### When to reach for Warm Editorial
- About / method / principles / vision / governance / impact / how-we-work / studio
- Contact / people / partners / events / ask
- Ecosystem / engine / projects (index, not per-project narratives)
- Legal: terms, privacy
- Wiki surfaces (source-bridges, source-packets)
- Art surfaces (index, artists, artworks, commissions, exhibitions, residencies)
- Flagship sub-pages that list or inform rather than narrate: farm/stay, farm/retreats, farm/workshops, harvest/csa, harvest/produce
- Media / media-lab

### When to migrate a page from Warm Editorial → Bold Documentary
Only when **all** of these are true:
1. The page tells one coherent project story (not a list, not a directory)
2. You have hero video or a strong hero image ready
3. The project is important enough to warrant flagship treatment
4. You're willing to maintain the narrative structure (lead voice, stats, principles, CTA)

If you only have (1) or (2), stay in Warm Editorial.

---

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-04-13 | Initial design system created | Bold Documentary direction. Merges Oxman confidence + Naughtyduk energy + field journal warmth. |
| 2026-04-13 | Serif body text (Source Serif 4) | Deliberate departure from nonprofit sans-serif. Signals editorial weight. |
| 2026-04-13 | Sharp corners (8px) over rounded (28px) | Current 28px reads as soft/safe. 8px reads as confident/serious. |
| 2026-04-13 | Video hero support planned | User confirmed big video headers for some pages. Muted autoplay + poster fallback. |
| 2026-04-18 | UI font = Work Sans (not system sans) | Ratified what's shipping. `next/font/google` Work Sans loaded as `--font-sans` in `layout.tsx`. The system-sans note in earlier spec was wrong. |
| 2026-04-18 | Allow 3/4/5-column grids for data/enumeration | Observed in consent types (5-col), ecosystem connections (3-col), stats (4-col). The "no 3-column" rule was editorial-safety that doesn't hold for data-shaped content. Keep the rule for narrative cards only. |
| 2026-04-18 | Dark-section opacity: body `/60`, micro `/50` | Previous `/70` rule was unused. Ratified what the hero + CTA body already ships. |
| 2026-04-18 | Left-border weights: lead voice 4px, principles 3px | Intentional distinction — 4px for dramatic single quote, 3px for list markers. Both clay. |
| 2026-04-18 | Components spec'd: Page Hero, Section Header, Reading Lede, Editorial Split, Hairline Grid, Lead Voice, Principles List, Photo Break, Comparison Stat Pair, Dark CTAs | All recurring on 4–5 pages. Codified the recipes so future pages don't rediscover them. |
| 2026-04-18 | Section padding rhythm: `py-32 md:py-44` standard | Universal across shipped pages. Named it. |
| 2026-04-18 | Content-width tokens: 640/800/1100/1200 | Ratified what's shipping for prose, dark-prose, form grid, and standard section. |
| 2026-04-20 | Two design languages declared: Bold Documentary + Warm Editorial | Audit of the 33 non-flagship pages revealed they use a fundamentally different aesthetic (warm tan/olive palette, rounded-3xl, LivingSystemStrip) — not just different components. Rather than forcing a site-wide redesign, recognized this as intentional visual hierarchy: flagship projects get cinematic treatment, supporting content gets quiet editorial treatment. Both are valid; picking the right one is the key design decision per page. |
| 2026-04-20 | Warm Editorial palette codified | Previously hardcoded across 33 pages with no central reference. Documented the palette (#2F3E2E olive, #4D3F33 brown, #6B5A45 warm-brown, #E3D4BA sand, #F6F1E7 / #E7DDC7 / #D7C4A2 gradient, #4CAF50 hover) and the three core shared components (PageHero, SectionHeading, CardGrid, LivingSystemStrip) so future additions don't drift. |
| 2026-04-20 | Routing rule added: which language per page | Encoded decision rule as a table. Prevents future confusion about which hero/header to reach for. Flagship project narratives get Bold Documentary; everything else (meta, legal, directories, sub-pages) gets Warm Editorial. Don't mix them on one page — that's a signal the page is doing too much. |
