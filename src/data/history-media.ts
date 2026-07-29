export type HistoryMediaStatus =
  | "currently-public"
  | "internal-candidate"
  | "approval-required"
  | "do-not-publish";

export type HistoryMediaItem = {
  id: string;
  chapter: string;
  title: string;
  role: string;
  kind: "image" | "video" | "audio";
  source: string;
  publicPath?: string;
  status: HistoryMediaStatus;
  note: string;
};

export const historyMedia: HistoryMediaItem[] = [
  {
    id: "history-country-aerial",
    chapter: "Opening",
    title: "The field in mist",
    role: "Open with place before founders or projects",
    kind: "video",
    source: "ACT website media library",
    publicPath: "/media/field-videos/hero-farm-aerial.mp4",
    status: "currently-public",
    note: "Already served publicly by this ACT repository. Confirm Country naming and long-term publication record before production launch.",
  },
  {
    id: "history-goods-aerial",
    chapter: "The years of yes",
    title: "Goods field work from above",
    role: "Show movement, distance and material work without isolating a person",
    kind: "image",
    source: "ACT website media library",
    publicPath: "/media/field-stills/goods-community-aerial.jpg",
    status: "currently-public",
    note: "Currently public on ACT. Verify place, photographer and permitted reuse beyond the existing Goods context.",
  },
  {
    id: "history-palm-island",
    chapter: "The story must come home",
    title: "Palm Island (Bwgcolman) coastline",
    role: "Let Country remain a subject before discussing the photo kiosk and story infrastructure",
    kind: "image",
    source: "ACT website media library",
    publicPath: "/media/field-stills/palm-island-coastline.jpg",
    status: "currently-public",
    note: "Currently public on ACT. Confirm any restrictions on place naming and reuse in the founders’ history.",
  },
  {
    id: "history-contained",
    chapter: "Justice, fire and the room",
    title: "CONTAINED aerial encounter",
    role: "Move from justice as explanation to justice as embodied encounter",
    kind: "video",
    source: "ACT website media library",
    publicPath: "/media/field-videos/contained-aerial.mp4",
    status: "currently-public",
    note: "Currently public and used on the Art prototype. Confirm artwork credit, exhibition context and collaborators in the final caption.",
  },
  {
    id: "history-harvest",
    chapter: "The kettle, table and land",
    title: "The Harvest from above",
    role: "Show the place as working infrastructure, not a lifestyle backdrop",
    kind: "video",
    source: "ACT website media library",
    publicPath: "/media/field-videos/harvest-witta-aerial.mp4",
    status: "currently-public",
    note: "Currently public on ACT. Country attribution and site-description language require final alignment.",
  },
  {
    id: "jeremy-country-dusk",
    chapter: "The Fire and the Road",
    title: "Country at dusk",
    role: "Opening landscape. Country enters before any portrait.",
    kind: "image",
    source: "JusticeHub/public/stories/fire-and-road/photos/country-dusk.jpg",
    status: "approval-required",
    note: "Do not duplicate into ACT. Jeremy review, Elder/community review and final ledger approval remain outstanding.",
  },
  {
    id: "jeremy-fire-wide",
    chapter: "The Fire and the Road",
    title: "The fire circle",
    role: "Show the collective from a respectful distance",
    kind: "image",
    source: "JusticeHub/public/stories/fire-and-road/photos/jeremy-fire-wide.jpg",
    status: "approval-required",
    note: "Human and cultural review required. Check every identifiable person and agreed reuse context.",
  },
  {
    id: "jeremy-recording",
    chapter: "The Fire and the Road",
    title: "Story as connection",
    role: "Show listening and exchange rather than media extraction",
    kind: "image",
    source: "JusticeHub/public/stories/fire-and-road/photos/jeremy-fire-recording.jpg",
    status: "approval-required",
    note: "Jeremy’s presentation review and content-specific consent are not yet recorded as approved.",
  },
  {
    id: "jeremy-audio",
    chapter: "The Fire and the Road",
    title: "Jeremy Donovan interview audio",
    role: "Source record for quotation and spoken rhythm review",
    kind: "audio",
    source: "Downloads/Jeremy Donovan - Youth Justice Reform.mp3",
    status: "internal-candidate",
    note: "Editorial source only. Do not publish audio until explicit use, audience and duration terms are recorded.",
  },
  {
    id: "year-review-featured",
    chapter: "2025",
    title: "2025 featured project media",
    role: "Discovery index for seasonal chapters and project milestones",
    kind: "image",
    source: "act-global-infrastructure/archive/.../data/curated-2025.json",
    status: "internal-candidate",
    note: "Contains remote media URLs but no consent metadata. Also mixes live, demo and AI-curated claims. Verify item by item.",
  },
];
