export const ACT_METHOD_NAME = "Listen, Curiosity, Action, Art";
export const ACT_ALTERNATIVES_MAP_NAME = "Australian Living Map of Alternatives";

export function cleanPublicBrandText(value: string | null | undefined) {
  if (!value) return value ?? null;

  return value
    .replace(/\bLCAA\b/gi, ACT_METHOD_NAME)
    .replace(/\bALMA\b/gi, ACT_ALTERNATIVES_MAP_NAME)
    .replace(/[—–]/g, "-")
    .replace(/\s+-\s+/g, " - ")
    .replace(/\s{2,}/g, " ")
    .trim();
}
