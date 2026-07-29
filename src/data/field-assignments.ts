import type { LivingFieldId } from "@/data/living-field";

/**
 * Editorial overlay: article slug to field, curated by hand.
 *
 * The field graph normally derives an article's fields from its
 * `relatedProjectSlugs`. That works for four of the five fields and cannot work
 * for the fifth, because Empathy Ledger's project taxonomy has no art project.
 * Its slugs are goods-on-country, justicehub, empathy-ledger, the-harvest,
 * black-cockatoo-valley and act-farm. Nothing maps to art.
 *
 * That is not an oversight upstream. Art is a lens rather than a delivery
 * vehicle, which living-field.ts already says: CONTAINED "belongs to the Art
 * field and grows through JusticeHub". An article can be art *and* justice, and
 * a project taxonomy cannot express that.
 *
 * So this file exists, and it is additive: entries here are unioned with the
 * fields derived from project slugs, never subtracting from them. "CONTAINED:
 * Where Policy Meets Flesh" stays in justice and gains art.
 *
 * Why here and not in the generated JSON: src/data/empathy-ledger-editorial
 * .generated.json is rebuilt by `npm run sync:el-editorial` on every build, so
 * anything written into it is lost on the next deploy. This file is not
 * generated and survives.
 *
 * The guard in field-graph.test.ts asserts every slug below exists in the feed,
 * so a renamed or withdrawn article surfaces as a failing test rather than an
 * assignment that silently stops applying.
 */
export const FIELD_ASSIGNMENTS: Record<string, LivingFieldId[]> = {
  // CONTAINED is the art work: a shipping container built to the dimensions of
  // a cell. Both of these are about the piece itself, not the policy research
  // it draws on, so both belong to art. The second keeps justice from its
  // project tag as well.
  "from-bolivia-to-brisbane": ["art"],
  "contained-where-policy-meets-flesh": ["art"],

  // A comic drawn to explain the studio. Art as the way an idea is made
  // legible, which is the field's whole claim.
  "the-act-comic": ["art"],
};

/**
 * Slugs deliberately left unassigned, with the reason.
 *
 * Twelve articles arrive with `relatedProjectSlugs: []` and are genuinely about
 * the studio's thinking rather than a field: personal reflections, trip notes,
 * essays on fear and hope. Assigning them to a field to make the counts look
 * healthier would misrepresent them, and a field page padded with loosely
 * related essays is worse than one that is honestly short.
 *
 * Listed rather than ignored so the next person can see these were considered.
 * Move a slug up into FIELD_ASSIGNMENTS when there is a real editorial reason.
 */
export const DELIBERATELY_UNASSIGNED: Record<string, string> = {
  "the-spirit-must-be-strong": "Palm Island rangers; closest to goods, but the piece is about mentorship rather than the making work.",
  "seeds-of-change-walking-with-elders-and-youth-on-kalkadoon-country": "Kalkadoon Country trip notes, spans several fields without sitting in one.",
  "its-overwhelming-isnt-it": "Personal essay addressed to the reader.",
  "the-raucous-revolution": "Studio origin piece, about A Curious Tractor as a whole.",
  "nhats-story-finding-belonging-and-purpose-at-the-hope-centre": "Hope Centre, Vietnam; outside the five fields.",
  "life-is-hard-but-its-not": "Personal reflection.",
  "the-weight-of-silence-and-the-audacity-to-imagine-reflections-on-fear-hope-and-the-long-game-of-human-liberation": "Series opener on fear and hope; thematic rather than field work.",
  "naidoc-with-jimmy": "Time with Jimmy Frank Jupurrurla; relationship piece.",
  "between-waters-and-worlds-a-day-on-quandamooka-country": "Quandamooka Country day; knowledge-sharing rather than a field.",
  "a-heros-journey-from-addiction-to-inspiration-the-life-of-vireak": "Vireak's life; outside the five fields.",
  "conversation-camp": "Tagged black-cockatoo-valley upstream, which is land rather than a field of practice.",
};
