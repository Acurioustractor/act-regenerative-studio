// The words every page carries: the one line, the Acknowledgement of Country, who we are, how to reach us, and the
// doors with where they lead. The live footer (src/components/UnifiedFooter.tsx) says the same until the pages move.
import { brand, type PartRole } from "@/brand/brand";

export const site = {
  oneLine: brand.oneLine,
  acknowledgement:
    "We acknowledge the Jinibara people as the Traditional Custodians of the land on which we work and live. We pay our respects to Elders past and present, and extend that respect to all Aboriginal and Torres Strait Islander peoples.",
  legalName: "A Curious Tractor Pty Ltd",
  acn: "ACN 697 347 676",
  email: "hi@act.place",
  invitation: "Bring us the question you cannot leave alone.",
};

/** The first sentence of the acknowledgement, where a page has room for one line of it. */
export const acknowledgementShort = site.acknowledgement.slice(0, site.acknowledgement.indexOf(".") + 1);

export type Door = {
  label: string;
  href: string;
  /** The part of the tractor under this door. About and Contact have none. */
  part: PartRole | null;
  /** Listen, Curiosity, Action or Art. */
  meaning: string | null;
  /** What going through this door does, in a few words. */
  invite: string | null;
};

const ROUTES: Record<string, { href: string; invite: string | null }> = {
  Stories: { href: "/stories", invite: "Read what was said" },
  Questions: { href: "/questions", invite: "Follow the question" },
  "The work": { href: "/work", invite: "Go to the work" },
  Art: { href: "/art", invite: "See what was made" },
  About: { href: "/about", invite: null },
  Contact: { href: "/contact", invite: null },
};

export const doors: Door[] = brand.doors.map((door) => ({
  ...door,
  ...ROUTES[door.label],
  meaning: door.part ? brand.partMeanings[door.part] : null,
}));

/** Stories, Questions, The work, Art: the four doors with a part, in the order of the method. */
export const partDoors = doors.filter((door): door is Door & { part: PartRole; meaning: string; invite: string } =>
  Boolean(door.part),
);
