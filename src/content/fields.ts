// The five fields: Art, and ACT's four projects. Every other item in src/content says which of these it is part of.
// The words are act.place's own, moved here unchanged from src/data/living-field.ts, which now keeps only how the
// prototype pages present them.
import { questionsBySlug } from "./questions";

export type FieldId = "art" | "empathy" | "justice" | "goods" | "harvest";

export type Field = {
  id: FieldId;
  /** Art is a door, not a project: its field page folds into /art. The other four are the projects. */
  kind: "art" | "project";
  name: string;
  number: string;
  eyebrow: string;
  title: string;
  line: string;
  opening: string;
  /** The question underneath the field. Read from its question page when it has one. */
  question: string;
  /** That question page, so the field can hand on to it. Goods on Country's question has none yet. */
  questionSlug: string | null;
  answer: string;
  invitation: string;
  /** Where it hands on: the field's own home beyond act.place. */
  destinationLabel: string;
  destinationHref: string;
  destinationAction?: string;
  image: string;
  secondImage: string;
  video?: string;
};

/** A field as written: its question is either its own words or a question page's, never both. */
type WrittenField = Omit<Field, "question" | "questionSlug"> &
  ({ question: string; questionSlug?: never } | { questionSlug: string; question?: never });

const written: WrittenField[] = [
  {
    id: "art",
    kind: "art",
    name: "Art",
    number: "01",
    eyebrow: "Art belongs in the method",
    title: "Art begins early and arrives late.",
    line: "Art makes us care enough to return.",
    opening:
      "Art is not the decoration added when the work is finished. It begins early, in how we notice, and arrives late, after everyone represented in it has had the chance to disagree.",
    questionSlug: "what-does-evidence-feel-like",
    answer:
      "CONTAINED takes the architecture of confinement out of the report and puts it in the room. It belongs to the Art field and grows through JusticeHub. The categories overlap because the work does.",
    invitation: "Cross the threshold",
    destinationLabel: "Experience CONTAINED",
    destinationHref: "https://www.justicehub.com.au/contained",
    image: "/media/field-stills/contained-aerial.jpg",
    // Not the Confessions phone still: its burned-in caption clips mid-word in
    // this page's cropped frame. The cell interior is caption-free.
    secondImage: "/media/field-stills/contained-cell.jpg",
    video: "/media/field-videos/contained-aerial.mp4",
  },
  {
    id: "empathy",
    kind: "project",
    name: "Empathy Ledger",
    number: "02",
    eyebrow: "Stories remain with their owners",
    title: "A story is a relationship, not raw material.",
    line: "Stories remain with their owners.",
    opening:
      "People are asked to share the hardest parts of their lives. The story leaves the room. The storyteller often loses sight of where it went, who used it and what value it created.",
    questionSlug: "who-holds-the-story",
    answer:
      "Empathy Ledger makes consent ongoing and visible. Storytellers can decide how they are named, where a story travels and when permission ends. The technology matters. The relationship matters more.",
    invitation: "Hear a voice",
    destinationLabel: "Enter Empathy Ledger",
    destinationHref: "https://www.empathyledger.com",
    destinationAction: "Publish, listen and manage consent",
    image: "/media/field-stills/empathy-ledger-community-story.jpg",
    secondImage: "/media/field-stills/empathy-ledger-elder-trip.jpg",
    video: "/media/field-videos/empathy-ledger-community-story.mp4",
  },
  {
    id: "justice",
    kind: "project",
    name: "JusticeHub",
    number: "03",
    eyebrow: "Local knowledge finds local action",
    title: "Communities already hold the alternatives.",
    line: "Local knowledge finds local action.",
    opening:
      "The justice system keeps funding containment while community programs quietly do the work that keeps young people connected to culture, family and possibility.",
    questionSlug: "what-if-alternatives-were-easier-to-find",
    answer:
      "JusticeHub connects community practice, lived experience and evidence. ACT holds the origin story here. The live platform is where people search programs, follow the evidence and contribute what works.",
    invitation: "Find an alternative",
    destinationLabel: "Search JusticeHub",
    destinationHref: "https://www.justicehub.com.au",
    destinationAction: "Move from encounter to place and evidence",
    image: "/media/field-stills/justicehub-community-2.jpg",
    secondImage: "/media/field-stills/justicehub-container.jpg",
    video: "/media/field-videos/justicehub-community.mp4",
  },
  {
    id: "goods",
    kind: "project",
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
    destinationHref: "https://www.goodsoncountry.com",
    destinationAction: "Follow the object, support and ownership journey",
    image: "/media/field-stills/goods-community-build.jpg",
    secondImage: "/media/field-stills/goods-delivery-2.jpg",
    video: "/media/field-videos/goods-community-build.mp4",
  },
  {
    id: "harvest",
    kind: "project",
    name: "The Harvest",
    number: "05",
    eyebrow: "The gate is open",
    title: "Come before the rhythm is settled.",
    line: "The gate is open. The rhythm is not settled.",
    opening:
      "The Harvest is where the wider ACT field becomes physical. Food, making, art and conversation share the same ground while the place is still becoming itself.",
    questionSlug: "can-a-place-hold-work",
    answer:
      "The Harvest is an old nursery waking up in Witta, on Jinibara Country. ACT carries the connecting story here. Its own site carries the changing works, current dates and practical ways to take part.",
    invitation: "Come to the table",
    destinationLabel: "Visit The Harvest",
    destinationHref: "https://theharvestwitta.com.au",
    destinationAction: "Build, grow, gather and come to the table",
    image: "/media/field-stills/harvest-witta-aerial-3.jpg",
    secondImage: "/media/field-stills/harvest-witta-aerial.jpg",
    video: "/media/field-videos/harvest-witta-aerial.mp4",
  },
];

function questionOf(field: WrittenField): string {
  if (field.questionSlug) return questionsBySlug[field.questionSlug].question;
  if (field.question) return field.question;
  throw new Error(`The ${field.name} field has no question`);
}

export const fields: Field[] = written.map((field) => ({
  ...field,
  question: questionOf(field),
  questionSlug: field.questionSlug ?? null,
}));

export const fieldsById = Object.fromEntries(fields.map((field) => [field.id, field])) as Record<FieldId, Field>;

/** Empathy Ledger, JusticeHub, Goods on Country, The Harvest. */
export const projects = fields.filter((field) => field.kind === "project");
