# Design System — A Curious Tractor

## Product Context
- **What this is:** Public-facing website for ACT, a regenerative innovation ecosystem
- **Who it's for:** Funders evaluating, artists seeking collaboration, community members, curious strangers
- **Space/industry:** Social practice art, regenerative agriculture, community-led innovation
- **Project type:** Editorial/portfolio hybrid with living data (58 projects, 319 storytellers, 5,039 media)

## Aesthetic Direction
- **Direction:** Bold Documentary
- **Decoration level:** Intentional (grain texture, editorial rules, pull-quote borders)
- **Mood:** A field journal written at scale. Confident, curious, grounded. Not polished. Not precious. Alive. The first emotion should be curiosity.
- **Reference sites:** Neri Oxman (oxman.com), Naughtyduk (naughtyduk.com), Forensic Architecture, Theaster Gates, Assemble Studio
- **Anti-patterns:** No rounded-corner padding soup. No generic card grids. No nonprofit template energy. No decorative blobs.

## Typography
- **Display/Hero:** Fraunces (variable, opsz 9-144) — optical size cranked for headlines. Warm, serious, human. Use weight 300 for large display, 600-700 for emphasis.
- **Body:** Source Serif 4 (variable, opsz 8-60) — editorial weight, reads like a journal. Serif body signals "this is writing worth reading." Weight 400 for body, 500 for emphasis.
- **UI/Labels:** System sans (-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif) — tight, modern, for badges/nav/meta. Weight 600, letter-spacing 0.15-0.3em, uppercase.
- **Code/Data:** Geist Mono — for project codes, technical metadata, data displays.
- **Loading:** Google Fonts via `<link>` for Fraunces + Source Serif 4 + Geist Mono.
- **Scale:**
  - Hero: clamp(3rem, 7vw, 5.5rem) / weight 300
  - Section heading: clamp(2rem, 4vw, 3.5rem) / weight 300
  - Card title: 24px / weight 600
  - Body: 18px / line-height 1.7
  - UI label: 11px / weight 600 / tracking 0.3em / uppercase
  - Small label: 10px / weight 600 / tracking 0.2em / uppercase

## Color
- **Approach:** Restrained (1 accent + earth neutrals, photography provides visual richness)
- **Background:** #FAFAF7 (warm white)
- **Surface:** #F0EDE6 (cards, panels)
- **Ink:** #1A1A1A (near-black, high contrast)
- **Muted:** #6B6B6B (secondary text)
- **Forest (accent):** #2D5A3D (deep green, primary action color)
- **Clay:** #C4845C (warm accent, pull-quote borders, secondary badges)
- **Gold:** #B8943F (tertiary accent, highlights)
- **Dark:** #1A1F1A (dark sections, not pure black)
- **Line:** rgba(26, 26, 26, 0.12) (borders, rules)
- **Semantic:** success #2D5A3D (forest), warning #B8943F (gold), error #B34233
- **Dark mode:** Not planned. The site's identity is warm/light with dark section moments.

## Spacing
- **Base unit:** 8px
- **Density:** Comfortable body, generous between sections
- **Scale:** 2xs(4) xs(8) sm(16) md(24) lg(32) xl(48) 2xl(64) 3xl(80) 4xl(100-120)
- **Section gaps:** 80-120px between major sections
- **Component internal:** 16-24px padding
- **Card padding:** 24px body, 0 for full-bleed images

## Layout
- **Approach:** Creative-editorial
- **Grid:** Asymmetric splits (60/40, 50/50) for editorial blocks. Standard grid for card collections.
- **Max content width:** 1200px (container), 720px (narrow/reading)
- **Full-bleed:** Images and dark sections break out to 100vw
- **Border radius:** 8px (sharp, confident). NOT 28px. Use 4px for small elements (tags, badges).
- **Card grid:** 2-column on desktop, 1-column on mobile. No 3-column (too dense for editorial feel).

## Motion
- **Approach:** Intentional (not flashy, not static)
- **Easing:** enter(ease-out) exit(ease-in) move(ease-in-out)
- **Duration:** micro(100ms) short(200ms) medium(300ms) long(500ms)
- **Card hover:** translateY(-6px) + scale(1.01) + shadow lift, 300ms ease
- **Image hover:** scale(1.05) over 8s (slow Ken Burns)
- **Hero background:** Slow zoom animation (30s cycle)
- **Scroll:** Subtle fade-in for sections (CSS animation, no JS library)
- **Video headers:** Supported for hero sections. Muted autoplay with poster fallback.

## Photography Style
- **Documentary, not stock.** Process photos, field documentation, community moments.
- **Full-bleed preferred.** Images should feel immersive, not contained in cards.
- **No filters or color grading.** The photography is honest.
- **Aspect ratios:** Hero 16:9 or wider. Cards 16:10. Editorial splits: fill container.

## Components

### Buttons
- **Primary:** Forest bg (#2D5A3D), white text, 8px radius, uppercase UI font, letter-spacing 0.12em
- **Secondary:** Transparent bg, 1.5px ink border, ink text. Hover inverts.
- **Ghost:** No bg, accent color text, arrow suffix. For inline CTAs.
- **Hover:** translateY(-2px) + shadow on primary. Color invert on secondary.

### Cards
- **Background:** White (#fff)
- **Border:** 1px solid var(--line)
- **Radius:** 8px
- **Shadow:** Subtle at rest (0 2px 20px rgba(26,26,26,0.06)), lifted on hover
- **Image:** Full-width, no padding, no rounded top corners beyond card radius
- **Eyebrow:** UI font, accent color, uppercase

### Tags/Badges
- **Tags:** Surface bg, muted text, 4px radius, UI font 10px
- **Badges:** Solid color bg (accent/clay/gold), white text, 4px radius
- **Outline badge:** 1.5px ink border, transparent bg

### Pull Quotes
- **Border:** 4px solid clay on left
- **Font:** Fraunces italic, 28px, weight 400
- **Citation:** UI font, muted, uppercase

### Dark Sections
- **Background:** #1A1F1A
- **Text:** #FAFAF7, reduced opacity for secondary text (0.7)
- **Tags:** rgba(250,250,247,0.1) bg
- **Use for:** Art portfolio callouts, method sections, impact stats

### Stats Strip
- **Layout:** Horizontal flex with generous gaps (64px)
- **Number:** Fraunces 48px bold, accent color
- **Label:** UI font, muted, uppercase

### Navigation
- **Style:** Frosted glass (backdrop-filter blur, 95% opacity bg)
- **Logo:** Fraunces 20px bold
- **Links:** UI font 12px, muted, uppercase, 0.2em tracking
- **Hover:** Color to ink

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-04-13 | Initial design system created | Bold Documentary direction. Merges Oxman confidence + Naughtyduk energy + field journal warmth. |
| 2026-04-13 | Serif body text (Source Serif 4) | Deliberate departure from nonprofit sans-serif. Signals editorial weight. |
| 2026-04-13 | Sharp corners (8px) over rounded (28px) | Current 28px reads as soft/safe. 8px reads as confident/serious. |
| 2026-04-13 | Video hero support planned | User confirmed big video headers for some pages. Muted autoplay + poster fallback. |
