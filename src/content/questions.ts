// The questions: act.place's own words, moved here unchanged from src/data/field-questions.ts. Each is part of the
// fields its tags name.
import type { FieldId } from "./fields";

export type QuestionStatus = "Answered for now" | "Still open" | "Growing";

export type Question = {
  slug: string;
  question: string;
  invitation: string;
  origin: string;
  askedBy: string;
  responseBy: string;
  status: QuestionStatus;
  /** Free-text tags, shown on the page as written. QUESTION_TAG_TO_FIELD turns them into `partOf`. */
  fields: string[];
  image: string;
  response: string[];
  pullQuote?: string;
  nextSlug: string;
  /** The fields this question is part of, derived from its tags. */
  partOf: FieldId[];
};

/**
 * Question tag to field.
 *
 * The tags are editorial rather than structural, and several are broader than
 * any single field ("Public imagination", "Practice"). Those map to null: a
 * question can be about the work without belonging to one field, and forcing
 * it into one would misrepresent it.
 */
export const QUESTION_TAG_TO_FIELD: Record<string, FieldId | null> = {
  Art: "art",
  Justice: "justice",
  Goods: "goods",
  Story: "empathy",
  Consent: "empathy",
  Land: "harvest",
  Place: "harvest",
  Gathering: "harvest",
  Making: "goods",
  Evidence: "justice",
  Community: "justice",
  Technology: "empathy",
  "Public imagination": null,
  Practice: null,
};

const written: Array<Omit<Question, "partOf">> = [
  {
    slug: "when-should-the-work-no-longer-need-us",
    question: "How do we know when the work should no longer need us?",
    invitation: "A question about power, usefulness and knowing when to let go.",
    origin: "Carried through ACT's work on community ownership and beautiful obsolescence.",
    askedBy: "An ACT working question",
    responseBy: "A Curious Tractor",
    status: "Growing",
    fields: ["Justice", "Story", "Practice"],
    image: "/media/field-stills/justicehub-community.jpg",
    response: [
      "A tool can be useful and still hold too tightly. We notice it when the timetable, money and decisions continue to gather around the people who began the work.",
      "Our test is deliberately ordinary. Who holds the key? Who can change the plan? Where does the value come to rest? Could the work continue if our engine went quiet?",
      "We do not have a final answer. We are learning to make succession part of the design, not a conversation left until the end.",
    ],
    pullQuote: "The tractor should transfer power without mistaking itself for the field.",
    nextSlug: "who-holds-the-story",
  },
  {
    slug: "who-holds-the-story",
    question: "Who holds the story after it has been told?",
    invitation: "Consent is not a form signed once. What would it mean for permission to remain alive?",
    origin: "A question underneath the Empathy Ledger model.",
    askedBy: "Raised through Empathy Ledger",
    responseBy: "A Curious Tractor",
    status: "Answered for now",
    fields: ["Story", "Consent", "Technology"],
    image: "/media/field-stills/empathy-ledger-community-story-2.jpg",
    response: [
      "The person who carries the experience must retain meaningful authority over where their story travels, how they are named and when permission changes.",
      "Technology can make those choices visible, but a consent setting is not the relationship itself. The slower work is returning, asking again and accepting that an earlier yes can become a no.",
    ],
    pullQuote: "The technology matters. The relationship matters more.",
    nextSlug: "what-if-alternatives-were-easier-to-find",
  },
  {
    slug: "what-if-alternatives-were-easier-to-find",
    question: "What if the alternatives were easier to find than detention?",
    invitation: "A map can make another future feel practical rather than imaginary.",
    origin: "A question driving JusticeHub and the Australian Living Map of Alternatives.",
    askedBy: "Raised through JusticeHub",
    responseBy: "A Curious Tractor",
    status: "Growing",
    fields: ["Justice", "Evidence", "Community"],
    image: "/media/field-stills/justicehub-container.jpg",
    response: [
      "Alternatives already exist. They live in community organisations, local practice, lived experience and programs that rarely share one language or one place.",
      "JusticeHub works to make those practices easier to find, understand and adapt. The map is not the answer. It is infrastructure for people already building answers to find one another.",
    ],
    nextSlug: "what-does-evidence-feel-like",
  },
  {
    slug: "what-does-evidence-feel-like",
    question: "What changes when evidence becomes an encounter?",
    invitation: "Some truths need to be entered, heard and felt before they can be understood.",
    origin: "A question carried by CONTAINED, an art project within JusticeHub.",
    askedBy: "Raised through CONTAINED",
    responseBy: "A Curious Tractor",
    status: "Answered for now",
    fields: ["Art", "Justice", "Public imagination"],
    image: "/media/field-stills/contained-aerial.jpg",
    response: [
      "Reports can describe confinement while keeping the reader safely outside it. Art changes the distance.",
      "CONTAINED takes the architecture and testimony of confinement out of the report and puts them in relation with a person. It does not replace evidence. It asks what evidence can do when it reaches more than the analytical mind.",
    ],
    nextSlug: "what-does-material-remember",
  },
  {
    slug: "what-does-material-remember",
    question: "What does material remember?",
    invitation: "Waste carries the shape of the system that produced it, and perhaps the beginning of another one.",
    origin: "A shared question across Goods, The Harvest and land practice.",
    askedBy: "An ACT working question",
    responseBy: "A Curious Tractor",
    status: "Still open",
    fields: ["Goods", "Land", "Making"],
    image: "/media/field-stills/goods-community-build.jpg",
    response: [
      "Discarded plastic remembers extraction, distance and the assumption that an object can become somebody else's problem.",
      "When that material becomes a useful object made closer to where it is needed, its next life carries different relationships. We are still asking whether changing the object can help change the system around it.",
    ],
    nextSlug: "can-a-place-hold-work",
  },
  {
    slug: "can-a-place-hold-work",
    question: "Can a place hold work that a website cannot?",
    invitation: "Some knowledge arrives through weather, labour, food and returning to the same table.",
    origin: "A question emerging through The Harvest in Witta, on Jinibara Country.",
    askedBy: "Raised through The Harvest",
    responseBy: "A Curious Tractor",
    status: "Still open",
    fields: ["Place", "Gathering", "Land"],
    image: "/media/field-stills/harvest-witta-aerial-3.jpg",
    response: [
      "A website can invite, document and connect. It cannot reproduce the feeling of arriving, noticing what needs doing and finding yourself beside somebody you did not expect to meet.",
      "The Harvest is teaching us to let the physical place lead. The digital story should help people cross the threshold, then become quiet enough for the place to speak.",
    ],
    nextSlug: "when-should-the-work-no-longer-need-us",
  },
];

export const questions: Question[] = written.map((question) => ({
  ...question,
  partOf: [
    ...new Set(
      question.fields
        .map((tag) => QUESTION_TAG_TO_FIELD[tag])
        .filter((id): id is FieldId => id != null),
    ),
  ],
}));

export const questionsBySlug = Object.fromEntries(questions.map((item) => [item.slug, item]));
