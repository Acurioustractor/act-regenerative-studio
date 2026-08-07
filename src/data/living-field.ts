export type LivingFieldId = "art" | "empathy" | "justice" | "goods" | "harvest";

export type LivingField = {
  id: LivingFieldId;
  name: string;
  number: string;
  eyebrow: string;
  title: string;
  line: string;
  opening: string;
  question: string;
  answer: string;
  invitation: string;
  destinationLabel: string;
  image: string;
  secondImage: string;
  video?: string;
  localHref: string;
  overviewHref: string;
  experienceHref: string;
  destinationHref: string;
  destinationAction?: string;
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

export const livingFields: LivingField[] = [
  {
    id: "art",
    name: "Art",
    number: "01",
    eyebrow: "Art belongs in the method",
    title: "Make the system impossible to ignore.",
    line: "Art makes us care enough to return.",
    opening:
      "Art is not the decoration added when the work is finished. It is how a hidden system becomes visible, physical and difficult to forget.",
    question: "What changes when evidence becomes an encounter?",
    answer:
      "CONTAINED takes the architecture of confinement out of the report and puts it in the room. It belongs to the Art field and grows through JusticeHub. The categories overlap because the work does.",
    invitation: "Cross the threshold",
    destinationLabel: "Experience CONTAINED",
    image: "/media/field-stills/contained-aerial.jpg",
    // Not the Confessions phone still: its burned-in caption clips mid-word in
    // this page's cropped frame. The cell interior is caption-free.
    secondImage: "/media/field-stills/contained-cell.jpg",
    video: "/media/field-videos/contained-aerial.mp4",
    localHref: "/fields/art",
    overviewHref: "/prototypes/living-field/art",
    experienceHref: "/prototypes/art-field",
    destinationHref: "https://www.justicehub.com.au/contained",
    projectHref: "/art",
    projectLabel: "Explore the art",
    next: { label: "Empathy Ledger", href: "/prototypes/living-field/empathy" },
    accent: "#c4845c",
    accentOnLight: "#7F4C2B",
    accentOnDark: "#C4845C",
  },
  {
    id: "empathy",
    name: "Empathy Ledger",
    number: "02",
    eyebrow: "Stories remain with their owners",
    title: "A story is a relationship, not raw material.",
    line: "Stories remain with their owners.",
    opening:
      "People are asked to share the hardest parts of their lives. The story leaves the room. The storyteller often loses sight of where it went, who used it and what value it created.",
    question: "Who holds the story after it has been told?",
    answer:
      "Empathy Ledger makes consent ongoing and visible. Storytellers can decide how they are named, where a story travels and when permission ends. The technology matters. The relationship matters more.",
    invitation: "Hear a voice",
    destinationLabel: "Enter Empathy Ledger",
    image: "/media/field-stills/empathy-ledger-community-story.jpg",
    secondImage: "/media/field-stills/empathy-ledger-elder-trip.jpg",
    video: "/media/field-videos/empathy-ledger-community-story.mp4",
    localHref: "/fields/empathy",
    overviewHref: "/prototypes/living-field/empathy",
    experienceHref: "/prototypes/story-remains",
    destinationHref: "https://www.empathyledger.com",
    destinationAction: "Publish, listen and manage consent",
    projectHref: "https://www.empathyledger.com",
    projectLabel: "Enter Empathy Ledger",
    next: { label: "JusticeHub", href: "/prototypes/living-field/justice" },
    accent: "#2d5a3d",
    accentOnLight: "#2D5A3D",
    accentOnDark: "#8FB88A",
  },
  {
    id: "justice",
    name: "JusticeHub",
    number: "03",
    eyebrow: "Local knowledge finds local action",
    title: "Communities already hold the alternatives.",
    line: "Local knowledge finds local action.",
    opening:
      "The justice system keeps funding containment while community programs quietly do the work that keeps young people connected to culture, family and possibility.",
    question: "What if the alternatives were easier to find than detention?",
    answer:
      "JusticeHub connects community practice, lived experience and evidence. ACT holds the origin story here. The live platform is where people search programs, follow the evidence and contribute what works.",
    invitation: "Find an alternative",
    destinationLabel: "Search JusticeHub",
    image: "/media/field-stills/justicehub-community-2.jpg",
    secondImage: "/media/field-stills/justicehub-container.jpg",
    video: "/media/field-videos/justicehub-community.mp4",
    localHref: "/fields/justice",
    overviewHref: "/prototypes/living-field/justice",
    experienceHref: "/prototypes/justice-field",
    destinationHref: "https://www.justicehub.com.au",
    destinationAction: "Move from encounter to place and evidence",
    projectHref: "https://www.justicehub.com.au",
    projectLabel: "Search JusticeHub",
    next: { label: "Goods on Country", href: "/prototypes/living-field/goods" },
    accent: "#b8943f",
    accentOnLight: "#70591C",
    accentOnDark: "#B8943F",
  },
  {
    id: "goods",
    name: "Goods on Country",
    number: "04",
    eyebrow: "Making capability stays on Country",
    title: "The object is only half the work.",
    line: "Making capability stays on Country.",
    opening:
      "A bed can solve an immediate problem and still reproduce the system that created it. Goods on Country asks who designs it, what it is made from, who can repair it and where the value stays.",
    question: "What if essential goods built local capability too?",
    answer:
      "The products begin with use, heat, distance, waste and repair. They are designed in community for remote conditions and move toward local manufacturing from recovered material.",
    invitation: "Follow the object",
    destinationLabel: "Visit Goods on Country",
    image: "/media/field-stills/goods-community-build.jpg",
    secondImage: "/media/field-stills/goods-delivery-2.jpg",
    video: "/media/field-videos/goods-community-build.mp4",
    localHref: "/fields/goods",
    overviewHref: "/prototypes/living-field/goods",
    experienceHref: "/prototypes/goods-field",
    destinationHref: "https://www.goodsoncountry.com",
    destinationAction: "Follow the object, support and ownership journey",
    projectHref: "https://www.goodsoncountry.com",
    projectLabel: "Visit Goods on Country",
    next: { label: "The Harvest", href: "/prototypes/living-field/harvest" },
    accent: "#a66a45",
    accentOnLight: "#7F4C2B",
    accentOnDark: "#C98D63",
  },
  {
    id: "harvest",
    name: "The Harvest",
    number: "05",
    eyebrow: "The gate is open",
    title: "Come before the rhythm is settled.",
    line: "The gate is open. The rhythm is not settled.",
    opening:
      "The Harvest is where the wider ACT field becomes physical. Food, making, art and conversation share the same ground while the place is still becoming itself.",
    question: "Can a place hold work that a website cannot?",
    answer:
      "The Harvest is an old nursery waking up in Witta, on Jinibara Country. ACT carries the connecting story here. Its own site carries the changing works, current dates and practical ways to take part.",
    invitation: "Come to the table",
    destinationLabel: "Visit The Harvest",
    image: "/media/field-stills/harvest-witta-aerial-3.jpg",
    secondImage: "/media/field-stills/harvest-witta-aerial.jpg",
    video: "/media/field-videos/harvest-witta-aerial.mp4",
    localHref: "/fields/harvest",
    overviewHref: "/prototypes/living-field/harvest",
    experienceHref: "/prototypes/harvest-field",
    destinationHref: "https://theharvestwitta.com.au",
    destinationAction: "Build, grow, gather and come to the table",
    projectHref: "https://theharvestwitta.com.au",
    projectLabel: "Visit The Harvest",
    next: { label: "Return to Art", href: "/prototypes/living-field/art" },
    accent: "#2d5a3d",
    accentOnLight: "#2D5A3D",
    accentOnDark: "#8FB88A",
  },
];

export const livingFieldsById = Object.fromEntries(
  livingFields.map((field) => [field.id, field]),
) as Record<LivingFieldId, LivingField>;
