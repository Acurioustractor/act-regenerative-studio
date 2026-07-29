import type { Config } from "tailwindcss";

/**
 * Token layer, locked to what the homepage actually renders.
 *
 * The homepage is the reference implementation of the Bold Documentary
 * language described in DESIGN.md. Every value below was measured off the
 * rendered page rather than transcribed from a spec, so `bg-sage` and
 * `text-clay-text` are the same colours a visitor already sees at `/`.
 *
 * Source of truth for the colour values is `:root` in src/app/globals.css.
 * They are restated here as `var(--...)` so a change in one place propagates,
 * and so nobody has to reach for an arbitrary `[#4CAF50]` to get a brand tone.
 *
 * Note the deliberate absences: the homepage renders no border-radius and no
 * box-shadow. Dividers are hairline rules at graded alpha. The radius and
 * shadow scales below are intentionally short so that "soft" stays a decision
 * someone makes once, not a drift into four radii doing two jobs.
 */
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core surfaces
        bg: "var(--site-bg)",
        surface: "var(--site-surface)",
        sage: "var(--site-sage)",
        dark: "var(--site-dark)",

        // Ink
        ink: "var(--site-ink)",
        muted: "var(--site-muted)",
        "muted-deep": "var(--site-muted-deep)", // on the sage / surface bands
        "muted-lift": "var(--site-muted-lift)", // on dark sections
        "sand-lift": "var(--site-sand-lift)", // on the Confessions darks

        // Accents.
        // Named `forest`, not `green`: overriding `green` would shadow
        // Tailwind's default green-50..950 scale, which 120 call sites across
        // the admin and project pages still depend on. Those uses are drift to
        // be migrated onto `forest`, but they must not break in the meantime.
        forest: {
          DEFAULT: "var(--site-green)",
          deep: "var(--site-green-deep)",
          soft: "var(--site-green-soft)",
          lift: "var(--site-forest-lift)", // green accent on dark sections
          sage: "var(--site-sage-deep)", // sage-green label on near-white
        },
        clay: {
          DEFAULT: "var(--site-clay)", // rules, borders, large decorative type
          light: "var(--site-clay-light)", // closing CTA band
          text: "var(--site-clay-text)", // AA-safe for small uppercase labels
        },
        gold: "var(--site-gold)",

        // Warm Editorial, for meta / legal / directory pages. See DESIGN.md.
        we: {
          olive: "var(--we-olive)",
          "olive-deep": "var(--we-olive-deep)",
          brown: "var(--we-brown)",
          "brown-deep": "var(--we-brown-deep)",
          "warm-brown": "var(--we-warm-brown)",
          sand: "var(--we-sand)",
        },
      },

      borderColor: {
        rule: "var(--site-rule)",
        "rule-strong": "var(--site-rule-strong)",
        "rule-invert": "var(--site-rule-invert)",
      },

      fontFamily: {
        display: ["var(--font-display)", "Fraunces", "Georgia", "serif"],
        body: ["var(--font-body)", "Source Serif 4", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Work Sans", "system-ui", "sans-serif"],
      },

      /**
       * Eyebrow labels. The homepage currently renders these at six sizes
       * between 9.9px and 11.5px with ten different tracking values; that
       * spread is drift, not intent. Two steps replace it.
       */
      fontSize: {
        eyebrow: ["0.6875rem", { lineHeight: "1", letterSpacing: "0.18em" }],
        "eyebrow-lg": ["0.75rem", { lineHeight: "1", letterSpacing: "0.16em" }],
      },

      letterSpacing: {
        eyebrow: "0.18em",
        label: "0.14em",
        display: "-0.03em",
      },

      borderRadius: {
        // The Bold Documentary default. Sharp is the brand.
        sharp: "0px",
        // Warm Editorial cards only.
        soft: "1.5rem",
      },

      boxShadow: {
        // Bold Documentary uses none. These exist for Warm Editorial surfaces.
        site: "var(--site-shadow)",
        "site-hover": "var(--site-shadow-hover)",
      },
    },
  },
  plugins: [],
};

export default config;
