// The history on /about, in the words of the live page (src/app/prototypes/field-history/page.tsx), unchanged except
// where a comment says otherwise. The manifesto's words are Pencil's (Page 02 · About, vcol9), set from manifesto v2.
import type { FieldId } from "@/content";

export type Stanza = { lead: string; body: string };

/** The manifesto, in the three columns Pencil sets it in. Word for word from manifesto v2 (Notion 3ebebcf9-81cf-811e-8b69-c7d0e207aae9). */
export const manifesto = {
  eyebrow: "About · the manifesto",
  headline: "We want to leave more behind than we take",
  columns: [
    [
      { lead: "We make useful things with people.", body: "Sometimes a story. Sometimes technology, a business, an artwork, a place, or an idea that hasn't found its form yet." },
      { lead: "We begin by listening, and we listen again every time we get something wrong.", body: "We stay curious enough to change our minds." },
      { lead: "People closest to the work should have power over what happens.", body: "A story stays with the people and the community it comes from. They decide where it goes." },
    ],
    [
      { lead: "Art is part of how we work.", body: "It shows that somebody made this arrangement, and somebody could make another." },
      { lead: "Our time has value.", body: "So does community knowledge, creative thinking and the years it takes to build trust. People doing meaningful work should be able to build good lives from doing it. We want communities to own more, our partners to become more capable, our families to become more secure, and ACT to build things that keep being useful." },
    ],
    [
      { lead: "We want that value to create freedom.", body: "Freedom to stay with something that matters. To say no. To make art. To spend time with our families. To back an idea before anybody has paid for it. And the same freedom for the people we work with, starting with the freedom to tell us no." },
      { lead: "We build so the people carrying the work need us less each year.", body: "That means giving up control, authorship and the pleasure of being necessary. ACT may stay nearby. It should no longer be in the middle." },
    ],
  ] satisfies Stanza[][],
  asking: "And we keep asking",
  question: "What will exist because we were here, and who will hold it after we leave?",
};

export type ChapterContent = {
  number: string;
  kicker: string;
  heading: string;
  paragraphs: string[];
  /** A way into the field the chapter is about. `to` is a field id; the page turns it into the field's address. */
  link?: { label: string; to: FieldId };
};

export const chapters: ChapterContent[] = [
  {
    number: "01",
    kicker: "Before the tractor",
    heading: "Two kinds of restlessness.",
    paragraphs: [
      "Nic learned early through tools, movement and making. At nineteen, an old van became a mobile washing service for people experiencing homelessness. The machine mattered, but the larger discovery was the room that opened around it: chairs, time, conversation and the dignity of being met without a counter between you.",
      "Ben arrived by another road: Muswellbrook on Wanaruah Country, travel, youth work, remote community programs, prisons, young people in care and photography. The camera opened rooms, but it also carried a problem that would shape the next decade. An image can witness a person, and it can take from them. The difference is the relationship around it.",
      "At Orange Sky their paths converged. One had learned that a machine could make human space. The other was learning that an image must listen before it speaks. Both were impatient with the distance between a good intention and something a person could touch.",
    ],
  },
  {
    number: "02",
    kicker: "31 July 2022",
    heading: "Two people, one curious tractor.",
    paragraphs: [
      "The first public account of A Curious Tractor appeared under the words \"Irrigation, seeds and ACTion.\" Centre-pivot irrigation machines traced enormous circles across the Great Plains. Ordinary materials, arranged differently, could alter what a field was capable of becoming.",
      "The beginning carried bright voltage. ACT would walk beside people, help ideas take form and gift the work back. The early language trusted innovation, impact and scale. It had not yet learned to speak precisely about authority, consent, cultural governance, local production or the economy left behind after a project vehicle leaves.",
      "Still, the later ethic was already present in the promise to return the work. The company began by asking how to give an idea force. The field taught a harder question: whose force is it, and where should it live when we are gone?",
    ],
  },
  {
    number: "03",
    kicker: "The years of yes",
    heading: "We could feel the coherence before we could explain it.",
    paragraphs: [
      "Beds assembled in the Centre. Photo kiosks on Bwgcolman (Palm Island). Story circles. A ledger for consent. JusticeHub demos. Public artworks. Farm workshops. Gardens, data maps, caravans and shipping containers cut open and rebuilt.",
      "The abundance carried a risk. An organisation that gathers worthy projects can become the centre of a world it claims to decentralise. Care without limit can become another form of carelessness. The work needed a spine, and the founders needed a limit.",
    ],
  },
  {
    number: "04",
    kicker: "What Country corrected",
    heading: "Relationship is not a distribution route.",
    paragraphs: [
      "Goods on Country made the correction tangible. A better bed matters. So does a washing machine designed for heat, hard water, distance, repair and real use. But a durable product can still participate in an extractive economy.",
      "If decisions, machinery, wages, data, margin and authority leave on the same truck that delivered the object, the object has improved while the pattern remains. The work must follow value all the way home: what arrives, what leaves, what remains and who decides what happens next.",
      "The people and organisations who opened the roads were not a distribution network. They were the authority that made the work possible. Relationship is the ground on which an idea is allowed to change.",
    ],
    link: { label: "Follow the Goods on Country story", to: "goods" },
  },
  {
    number: "05",
    kicker: "The story must come home",
    heading: "The storyteller remains the source.",
    paragraphs: [
      "Every photograph carries a quiet question. After an image travels into a report, a funding room, a newspaper or a website, what returns to the person whose life made it valuable?",
      "On Bwgcolman (Palm Island), a photo kiosk and locally held server began to make a different relationship physical. Empathy Ledger extended the question into infrastructure. Consent could remain alive, specific to each use, capable of being changed and capable of being withdrawn.",
      "The story does not belong to the pipe merely because the pipe carried it. Technology can remember an obligation. It cannot become the source of authority.",
    ],
    link: { label: "Follow the Empathy Ledger story", to: "empathy" },
  },
  {
    number: "06",
    kicker: "Justice, fire and the room you can enter",
    heading: "The missing thing was connective tissue.",
    paragraphs: [
      "JusticeHub began because the same truth kept appearing in different places. Communities already held answers, but those answers were isolated from one another and from the rooms where money, policy and public stories were decided.",
      "In the East Kimberley, Jeremy Donovan’s teaching beside biri, the fire, offers a grounded philosophy of justice: see beauty before behaviour, tend force rather than extinguish spirit, and let Country, Culture, kinship and responsibility become anchors. His story must be published in his voice, with cultural terms, quotations and images confirmed before release.",
      "CONTAINED carries the argument into an object. A shipping container becomes a public artwork people can enter. The system is no longer explained at a safe distance. It becomes a threshold crossed by the body.",
    ],
    link: { label: "Follow the JusticeHub story", to: "justice" },
  },
  {
    number: "07",
    kicker: "The kettle, table and land",
    heading: "Hospitality is infrastructure.",
    paragraphs: [
      "Nic’s part of the work resists the fantasy that change occurs only through strategy, software or policy. His materials are often humbler: a kettle, a table, a tool, a room, a garden, food at the right moment and the repair that tells a person somebody expected them to stay.",
      "At Black Cockatoo Valley and The Harvest, place is not scenery. Place is one of the ways the work thinks. A garden, kitchen, art space and long table lower the threshold at which a stranger can become a participant.",
      "The romantic version of place forgets rates, rosters, insurance, repairs and who washes the plates. Care that cannot endure becomes a beautiful weekend somebody else must clean up.",
    ],
    link: { label: "Follow The Harvest story", to: "harvest" },
  },
  {
    number: "08",
    kicker: "Art was never the fourth step",
    heading: "Art is a form of moral attention.",
    paragraphs: [
      "Listen · Curiosity · Action · Art gave the scattered work a spine. It becomes false when treated as a production line. Listening does not end when curiosity begins. Action can be the decision to wait, return or refuse. Art is present in the first act of attention.",
      "Art keeps different truths in the same body: the bed and the economy behind it; the young person and the file written about them; the story and the consent that governs it; the generous room and the labour required to hold it open.",
      "ACT is not an arts organisation with social projects beneath it, or a consultancy that sometimes uses art. Art is the connective tissue between what a system says it does and what a person feels it doing.",
    ],
    link: { label: "Enter the art", to: "art" },
  },
  {
    number: "09",
    kicker: "Systems that remember",
    heading: "Automate administration, not relationship.",
    paragraphs: [
      "A ledger, evidence base, asset register or digital platform can help knowledge travel without being lost. It can also become a mine. A dashboard can make what is easy to count appear more real than what takes years to understand.",
      "The answer is not to refuse machinery. It is to make machinery remember its obligations. Let it carry receipts, reminders, version histories and the memory of promises. Do not ask it to conduct ceremony, resolve cultural authority, repair trust or decide what a story means to the person who lived it.",
      "The machine belongs behind the house. People belong at the table and the fire.",
    ],
  },
  {
    number: "10",
    kicker: "Two different instruments",
    heading: "The partnership is strongest when neither man wins.",
    paragraphs: [
      "Ben reaches for story, systems, evidence, justice and the infrastructure that lets knowledge move. Nic reaches for place, people, art, hospitality and the practical gesture that changes the feeling in a room.",
      "Without Ben, lived detail may fail to travel into rooms of policy, money and evidence. Without Nic, a system may confuse legibility with truth. One brings the ledger toward the fire. The other keeps the fire from becoming a line in the ledger.",
      "Speed must answer to season. System must answer to place. Proof must answer to trust. Imagination must answer to maintenance. The friction is not an inconvenience to remove. It is one of ACT’s instruments of truth.",
    ],
  },
];

/** The seven convictions, as the live page has them. */
export const convictions: Array<{ title: string; text: string }> = [
  { title: "Begin with presence", text: "Look for relationship, memory, humour, skill, cultural authority and ambition before defining a place by absence." },
  { title: "Let relationship alter the design", text: "If the object, contract, timetable or governance cannot change, listening has become consultation theatre." },
  { title: "Follow value all the way home", text: "Ask where wages, margin, machinery, data, rights, decisions and reputation come to rest." },
  { title: "Treat story as sacred trust", text: "Consent is alive, specific and reversible. Cultural knowledge remains governed by its people." },
  { title: "Use art as a way of knowing", text: "Art lets systems become felt and keeps contradiction visible." },
  { title: "Build every tool with a door out", text: "Transfer knowledge, infrastructure, capability and decisions. Being needed forever is not impact." },
  { title: "Protect the capacity to return", text: "Rest, family, health, clean books and disciplined refusal are part of keeping faith." },
];

export const bearings: Array<{ when: string; title: string; text: string }> = [
  { when: "Before ACT", title: "Two apprenticeships", text: "A practical object opens a human relationship. A camera teaches that witnessing can also become taking." },
  { when: "31 Jul 2022", title: "The public beginning", text: "Two people, one curious tractor. Ideas, action, pride and an early promise to return the work." },
  { when: "2023 to 24", title: "The field widens", text: "Goods, justice, story, place and public art reveal connected questions about ownership and power." },
  // The live row counted actions, projects and locations. Nothing in the repo sources those figures, so the row carries two
  // sentences from chapter 03 until the figures have a named source (then they belong in a StatTile, not in a sentence).
  { when: "2025", title: "The years of yes", text: "The abundance carried a risk. The work needed a spine, and the founders needed a limit." },
  { when: "2026", title: "Structure catches up", text: "The shared company, clearer decisions, sustainable revenue, family, rest and fewer deeper commitments." },
  { when: "Next", title: "From presence to transfer", text: "Capability, authority, memory and value move toward the people and places from which the work came." },
];

/** The ten turns in the field, in order: one word or short phrase for each chapter, as the live page's chapter index has them. */
export const turns = ["Restlessness", "The tractor", "The years of yes", "Country", "Story", "Justice", "Hospitality", "Art", "Memory", "Partnership"];
