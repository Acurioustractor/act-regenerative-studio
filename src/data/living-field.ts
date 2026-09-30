import { fields, type Field, type FieldId } from "@/content";

/**
 * The five fields as the prototype pages present them: their words from
 * src/content/fields.ts, joined to the routes, link labels and accents those
 * pages use. This file goes when the pages are rebuilt on Brand v1.
 */
type Presentation = {
  localHref: string;
  overviewHref: string;
  experienceHref: string;
  projectHref: string;
  projectLabel: string;
  next: { label: string; href: string };
  /**
   * Decorative accent: rules, focus outlines, the ghost numeral. Not for text.
   *
   * No single value can carry text on both surfaces this component uses. Each
   * field's accent fails WCAG AA on one side or the other, and goods failed on
   * both: art 2.95 on light, empathy and harvest 2.11 on dark, justice 2.73 on
   * light, goods 4.21 light and 3.80 dark. So text takes accentOnLight or
   * accentOnDark and this stays for decoration, where contrast does not apply.
   */
  accent: string;
  /** Accent for text on the warm-white and sand surfaces. Clears 4.5:1 on all. */
  accentOnLight: string;
  /** Accent for text on --site-dark sections. Clears 4.5:1. */
  accentOnDark: string;
};

/** Still read by field-assignments.ts and the story renderer, which are consent surfaces and move in their own step. */
export type LivingFieldId = FieldId;

export type LivingField = Field & Presentation;

const PRESENTATION: Record<FieldId, Presentation> = {
  art: {
    localHref: "/fields/art",
    overviewHref: "/prototypes/living-field/art",
    experienceHref: "/prototypes/art-field",
    projectHref: "/art",
    projectLabel: "Explore the art",
    next: { label: "Empathy Ledger", href: "/prototypes/living-field/empathy" },
    accent: "#c4845c",
    accentOnLight: "#7F4C2B",
    accentOnDark: "#C4845C",
  },
  empathy: {
    localHref: "/fields/empathy",
    overviewHref: "/prototypes/living-field/empathy",
    experienceHref: "/prototypes/story-remains",
    projectHref: "https://www.empathyledger.com",
    projectLabel: "Enter Empathy Ledger",
    next: { label: "JusticeHub", href: "/prototypes/living-field/justice" },
    accent: "#2d5a3d",
    accentOnLight: "#2D5A3D",
    accentOnDark: "#8FB88A",
  },
  justice: {
    localHref: "/fields/justice",
    overviewHref: "/prototypes/living-field/justice",
    experienceHref: "/prototypes/justice-field",
    projectHref: "https://www.justicehub.com.au",
    projectLabel: "Search JusticeHub",
    next: { label: "Goods on Country", href: "/prototypes/living-field/goods" },
    accent: "#b8943f",
    accentOnLight: "#70591C",
    accentOnDark: "#B8943F",
  },
  goods: {
    localHref: "/fields/goods",
    overviewHref: "/prototypes/living-field/goods",
    experienceHref: "/prototypes/goods-field",
    projectHref: "https://www.goodsoncountry.com",
    projectLabel: "Visit Goods on Country",
    next: { label: "The Harvest", href: "/prototypes/living-field/harvest" },
    accent: "#a66a45",
    accentOnLight: "#7F4C2B",
    accentOnDark: "#C98D63",
  },
  harvest: {
    localHref: "/fields/harvest",
    overviewHref: "/prototypes/living-field/harvest",
    experienceHref: "/prototypes/harvest-field",
    projectHref: "https://theharvestwitta.com.au",
    projectLabel: "Visit The Harvest",
    next: { label: "Return to Art", href: "/prototypes/living-field/art" },
    accent: "#2d5a3d",
    accentOnLight: "#2D5A3D",
    accentOnDark: "#8FB88A",
  },
};

export const livingFields: LivingField[] = fields.map((field) => ({ ...field, ...PRESENTATION[field.id] }));

export const livingFieldsById = Object.fromEntries(
  livingFields.map((field) => [field.id, field]),
) as Record<FieldId, LivingField>;
