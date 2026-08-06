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
  // a cell. This is about the piece itself, not the policy research it draws
  // on, so it belongs to art while keeping justice from its project tag.
  // "from-bolivia-to-brisbane" and "the-act-comic" were assigned here too until
  // the 2026-08-07 launch review withdrew them (config/withdrawn-editorial.json).
  "contained-where-policy-meets-flesh": ["art"],

  // Jimmy Frank Jupurrurla crafts boomerangs and leads the housing work. The
  // Wilya Janta housing article is already tagged goods-on-country upstream;
  // this is the same work seen through the person leading it.
  "naidoc-with-jimmy": ["goods"],

  // Richard Cassidy on Palm Island, the same partnership as "At the Speed of
  // Ceremony". Nearer to mentorship than to the making work, but it is the same
  // place and the same relationship.
  "the-spirit-must-be-strong": ["goods"],

  // Elders and youth on Kalkadoon Country. Reads partly as trip reflection, and
  // the youth-and-Elders work is what the justice field is for.
  "seeds-of-change-walking-with-elders-and-youth-on-kalkadoon-country": ["justice"],
};

/**
 * Slugs deliberately left unassigned, with the reason.
 *
 * These arrive with `relatedProjectSlugs: []` and are genuinely about the
 * studio's thinking rather than a field: personal reflections, trip notes,
 * essays on fear and hope. Assigning them to a field to make the counts look
 * healthier would misrepresent them, and a field page padded with loosely
 * related essays is worse than one that is honestly short.
 *
 * Reviewed article by article on 2026-07-29. Four moved up into
 * FIELD_ASSIGNMENTS; these seven stayed, each for the reason given.
 *
 * Listed rather than ignored so the next person can see these were considered.
 * Move a slug up into FIELD_ASSIGNMENTS when there is a real editorial reason.
 */
export const DELIBERATELY_UNASSIGNED: Record<string, string> = {
  "its-overwhelming-isnt-it": "Personal essay addressed to the reader.",
  "the-raucous-revolution": "Studio origin piece, about A Curious Tractor as a whole.",
  "life-is-hard-but-its-not": "Personal reflection.",
  "the-weight-of-silence-and-the-audacity-to-imagine-reflections-on-fear-hope-and-the-long-game-of-human-liberation": "Series opener on fear and hope; thematic rather than field work.",
  "naidoc-with-jimmy": "Time with Jimmy Frank Jupurrurla; relationship piece.",
  "between-waters-and-worlds-a-day-on-quandamooka-country": "Quandamooka Country day; knowledge-sharing rather than a field.",
  "conversation-camp": "Tagged black-cockatoo-valley upstream, which is land rather than a field of practice.",
  // "nhats-story-finding-belonging-and-purpose-at-the-hope-centre" and
  // "a-heros-journey-from-addiction-to-inspiration-the-life-of-vireak" sat here
  // until the 2026-08 feed regen stopped carrying them.
};
