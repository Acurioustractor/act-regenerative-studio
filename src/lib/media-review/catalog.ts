import path from "node:path";

export type MediaReviewField = "Art" | "Empathy Ledger" | "JusticeHub" | "Goods on Country" | "The Harvest" | "ACT / Farm";

export type MediaReviewItem = {
  id: string;
  title: string;
  field: MediaReviewField;
  role: "Opening" | "Place" | "Practice" | "Voice" | "Texture";
  note: string;
  boundary: string;
  publicUrl?: string;
  posterUrl?: string;
  sourceRepo?: "justice" | "goods" | "harvest" | "harvest_archive";
  sourcePath?: string;
};

const current: MediaReviewItem[] = [
  ["contained-aerial", "CONTAINED from above", "Art", "Opening", "Graphic, immediate and strange. Better once the wider installation has been established."],
  ["contained-cell", "Inside the CONTAINED cell", "Art", "Texture", "A short interior view of the installation. Steel, confinement and scale become physical."],
  ["confessions-to-philanthropy", "Confessions to Philanthropy", "Art", "Voice", "A telephone, a voice and the room philanthropy usually avoids."],
  ["empathy-community-story", "Community story gathering", "Empathy Ledger", "Voice", "Shows the story relationship rather than the software."],
  ["empathy-elder-trip", "Elders on the water", "Empathy Ledger", "Place", "Country and movement from the trip."],
  ["justice-community", "JusticeHub community", "JusticeHub", "Practice", "Current short loop. Low resolution and ready to replace."],
  ["justice-container", "The container", "JusticeHub", "Texture", "The built encounter, empty and waiting."],
  ["goods-build", "Building together", "Goods on Country", "Practice", "People and making in the same frame."],
  ["goods-delivery", "Delivery on Country", "Goods on Country", "Practice", "The object moving through the place it was made for."],
  ["goods-remote", "Road into community", "Goods on Country", "Place", "Distance becomes visible before the product appears."],
  ["harvest-aerial", "The Harvest from above", "The Harvest", "Place", "Useful orientation, but it cannot carry the whole Harvest story."],
  ["farm-aerial", "The farm in cloud", "ACT / Farm", "Opening", "Weather, valley and arrival. Strong parent-story opening."],
  ["bcv-aerial", "Black Cockatoo Valley", "ACT / Farm", "Place", "A slower view of the land and forest edge."],
  ["palm-island-coastline", "Palm Island coastline", "Empathy Ledger", "Place", "Country first, with the journey held in view."],
].map(([id, title, field, role, note]) => ({
  id: String(id), title: String(title), field: field as MediaReviewField, role: role as MediaReviewItem["role"], note: String(note),
  boundary: "Approved by Ben Knight for ACT website use.",
  publicUrl: `/media/field-videos/${id === "empathy-community-story" ? "empathy-ledger-community-story" : id === "empathy-elder-trip" ? "empathy-ledger-elder-trip" : id === "justice-community" ? "justicehub-community" : id === "justice-container" ? "justicehub-container" : id === "goods-build" ? "goods-community-build" : id === "goods-remote" ? "goods-remote-aerial" : id === "harvest-aerial" ? "harvest-witta-aerial" : id === "farm-aerial" ? "hero-farm-aerial" : id === "bcv-aerial" ? "black-cockatoo-valley-farm-aerial" : id}.mp4`,
  posterUrl: `/media/field-stills/${id === "empathy-community-story" ? "empathy-ledger-community-story" : id === "empathy-elder-trip" ? "empathy-ledger-elder-trip" : id === "justice-community" ? "justicehub-community-2" : id === "justice-container" ? "justicehub-container" : id === "goods-build" ? "goods-community-build" : id === "goods-delivery" ? "goods-delivery-2" : id === "goods-remote" ? "goods-remote-aerial" : id === "harvest-aerial" ? "harvest-witta-aerial-3" : id === "farm-aerial" ? "hero-farm-aerial" : id === "bcv-aerial" ? "black-cockatoo-valley-farm-aerial" : id}.jpg`,
}));

const justice: MediaReviewItem[] = [
  ["fire-road-river", "The river at dusk", "Place", "A patient opening. The road begins with Country.", "hero-river.mp4"],
  ["fire-road-crossing", "Crossing", "Place", "The long drive is felt through the windscreen.", "crossing.mp4"],
  ["fire-road-gold", "Road in gold light", "Texture", "Movement, dust and distance.", "road-gold.mp4"],
  ["fire-road-evening", "Road into evening", "Place", "A quieter transition between story chapters.", "road-evening.mp4"],
  ["fire-road-arrival", "Arrival at camp", "Practice", "The vehicle stops. People enter the frame.", "camp-arrival.mp4"],
  ["fire-road-country", "Jeremy on Country", "Voice", "A human centre for the road story.", "camp-country.mp4"],
  ["fire-road-smoke", "Camp smoke", "Texture", "A pause between spoken passages.", "camp-smoke.mp4"],
  ["fire-road-dusk", "Fire at dusk", "Texture", "Body, fire and silhouette.", "fire-dusk.mp4"],
  ["fire-road-stars", "Stars above camp", "Texture", "Night closes the chapter without explanation.", "stars.mp4"],
].map(([id, title, role, note, sourcePath]) => ({ id: String(id), title: String(title), field: "JusticeHub" as const, role: role as MediaReviewItem["role"], note: String(note), boundary: "Approved by Ben Knight for ACT website use.", sourceRepo: "justice" as const, sourcePath: String(sourcePath) }));

const goodsPublishedMedia: Record<string, { publicUrl: string; posterUrl: string }> = {
  "goods-hero": { publicUrl: "/media/field-videos/goods-site-hero.mp4", posterUrl: "/media/field-stills/goods-site-hero.jpg" },
  "goods-building": { publicUrl: "/media/field-videos/goods-site-building-together.mp4", posterUrl: "/media/field-stills/goods-site-building-together.jpg" },
  "goods-community": { publicUrl: "/media/field-videos/goods-site-community.mp4", posterUrl: "/media/field-stills/goods-site-community.jpg" },
  "goods-stretch-bed": { publicUrl: "/media/field-videos/goods-stretch-bed-community.mp4", posterUrl: "/media/field-stills/goods-stretch-bed-community.jpg" },
  "goods-recycling": { publicUrl: "/media/field-videos/goods-site-recycling-plant.mp4", posterUrl: "/media/field-stills/goods-site-recycling-plant.jpg" },
  "goods-jaquilane": { publicUrl: "/media/field-videos/goods-site-jaquilane-testimony.mp4", posterUrl: "/media/field-stills/goods-site-jaquilane-testimony.jpg" },
  "goods-jaquilane-overlay": { publicUrl: "/media/field-videos/goods-site-jaquilane-overlay.mp4", posterUrl: "/media/field-stills/goods-site-jaquilane-overlay.jpg" },
  "goods-assembly": { publicUrl: "/media/field-videos/goods-site-stretch-bed-assembly.mp4", posterUrl: "/media/field-stills/goods-site-stretch-bed-assembly.jpg" },
  "goods-utopia-road": { publicUrl: "/media/field-videos/goods-site-utopia-delivery-road.mp4", posterUrl: "/media/field-stills/goods-site-utopia-delivery-road.jpg" },
  "goods-utopia-build": { publicUrl: "/media/field-videos/goods-site-utopia-bed-building.mp4", posterUrl: "/media/field-stills/goods-site-utopia-bed-building.jpg" },
  "goods-utopia-setup": { publicUrl: "/media/field-videos/goods-site-utopia-community-setup.mp4", posterUrl: "/media/field-stills/goods-site-utopia-community-setup.jpg" },
  "goods-utopia-voice": { publicUrl: "/media/field-videos/goods-site-utopia-good-news.mp4", posterUrl: "/media/field-stills/goods-site-utopia-good-news.jpg" },
  "goods-karen-beds": { publicUrl: "/media/field-videos/goods-karen-liddle-on-beds.mp4", posterUrl: "/media/field-stills/goods-karen-liddle-on-beds.jpg" },
  "goods-mykel-build": { publicUrl: "/media/field-videos/goods-mykel-building-the-bed.mp4", posterUrl: "/media/field-stills/goods-mykel-building-the-bed.jpg" },
};

const goods: MediaReviewItem[] = [
  ["goods-hero", "Material becomes a bed", "Opening", "Hands, recovered plastic and the object taking shape.", "hero-desktop.mp4"],
  ["goods-building", "Loading the build", "Practice", "Work begins at the back of the vehicle.", "building-together-desktop.mp4"],
  ["goods-community", "Assembling together", "Practice", "The join is visible. So are the hands making it.", "community-desktop.mp4"],
  ["goods-stretch-bed", "Stretch bed in community", "Practice", "A longer view of assembly and use.", "stretch-bed-desktop.mp4"],
  ["goods-recycling", "Plastic through the machine", "Texture", "Waste becomes material in one close frame.", "recycling-plant-desktop.mp4"],
  ["goods-jaquilane", "Jaquilane speaks", "Voice", "A direct community voice. Do not cut into a decorative loop.", "jaquilane-testimony.mp4"],
  ["goods-jaquilane-overlay", "Jaquilane and the work", "Voice", "Jaquilane's account sits beside the material and assembly process.", "jaquilane-overlay-desktop.mp4"],
  ["goods-assembly", "The Stretch Bed assembles", "Practice", "The full object comes together without tools.", "stretch-bed/assembly.mp4"],
  ["goods-utopia-road", "The Utopia delivery road", "Place", "Distance, vehicle and the practical work of arrival.", "partners/centrecorp/utopia-delivery-road.mp4"],
  ["goods-utopia-build", "Building beds at Utopia", "Practice", "The product is assembled where it will stay.", "partners/centrecorp/utopia-bed-building.mp4"],
  ["goods-utopia-setup", "Community setup", "Practice", "Many hands, crates and mattresses in one working frame.", "partners/centrecorp/utopia-community-setup.mp4"],
  ["goods-utopia-voice", "Good news from Utopia", "Voice", "A seated account with room for the speaker.", "partners/centrecorp/utopia-good-news-full.mp4"],
  ["goods-karen-beds", "Karen Liddle on beds", "Voice", "A partner voice beside the work.", "partners/oonchiumpa/karen-liddle-on-beds.mp4"],
  ["goods-mykel-build", "Mykel builds the bed", "Practice", "A close account of assembly, not a product glamour shot.", "partners/oonchiumpa/mykel-building-the-bed.mp4"],
].map(([id, title, role, note, sourcePath]) => ({
  id: String(id),
  title: String(title),
  field: "Goods on Country" as const,
  role: role as MediaReviewItem["role"],
  note: String(note),
  boundary: "Approved by Ben Knight for ACT website use.",
  sourceRepo: "goods" as const,
  sourcePath: String(sourcePath),
  ...goodsPublishedMedia[String(id)],
}));

const utopiaTrip: MediaReviewItem[] = [
  {
    id: "goods-utopia-young-builders",
    title: "Young builders at Oonchiumpa",
    field: "Goods on Country",
    role: "Practice",
    note: "Young people work together on the bed legs in Alice Springs before the Utopia delivery.",
    boundary: "Approved by Ben Knight for ACT website use.",
    publicUrl: "/media/field-videos/goods-utopia-young-builders.mp4",
    posterUrl: "/media/field-stills/goods-utopia-young-builders.jpg",
  },
  {
    id: "goods-utopia-charley",
    title: "Charley at Utopia",
    field: "Goods on Country",
    role: "Voice",
    note: "Charley speaks from the road at Utopia. Strong story material, not a silent decorative loop.",
    boundary: "Approved by Ben Knight for ACT website use.",
    publicUrl: "/media/field-videos/goods-utopia-charley.mp4",
    posterUrl: "/media/field-stills/goods-utopia-charley.jpg",
  },
  {
    id: "goods-utopia-road-long",
    title: "The longer road to Utopia",
    field: "Goods on Country",
    role: "Place",
    note: "A wider aerial approach that makes distance, Country and the practical journey visible.",
    boundary: "Approved by Ben Knight for ACT website use.",
    publicUrl: "/media/field-videos/goods-utopia-road.mp4",
    posterUrl: "/media/field-stills/goods-utopia-road.jpg",
  },
  {
    id: "goods-utopia-loading-beds",
    title: "Loading the Utopia beds",
    field: "Goods on Country",
    role: "Practice",
    note: "Beds, vehicle and hands in one frame. The logistics become part of the story rather than disappearing.",
    boundary: "Approved by Ben Knight for ACT website use.",
    publicUrl: "/media/field-videos/goods-utopia-loading-beds.mp4",
    posterUrl: "/media/field-stills/goods-utopia-loading-beds.jpg",
  },
  {
    id: "goods-utopia-build-timelapse",
    title: "The full Alice Springs build",
    field: "Goods on Country",
    role: "Practice",
    note: "A long timelapse showing the collective build taking shape before the beds travel outward.",
    boundary: "Approved by Ben Knight for ACT website use.",
    publicUrl: "/media/field-videos/goods-utopia-build-timelapse.mp4",
    posterUrl: "/media/field-stills/goods-utopia-build-timelapse.jpg",
  },
  {
    id: "goods-utopia-sunrise",
    title: "Utopia sunrise",
    field: "Goods on Country",
    role: "Place",
    note: "A brief, quiet threshold into the trip before people or products enter the frame.",
    boundary: "Approved by Ben Knight for ACT website use.",
    publicUrl: "/media/field-videos/goods-utopia-sunrise.mp4",
    posterUrl: "/media/field-stills/goods-utopia-sunrise.jpg",
  },
];

const harvest: MediaReviewItem[] = [
  { id: "harvest-field-notes-dji-0021", title: "The Harvest across the field", field: "The Harvest", role: "Place", note: "A low aerial movement across The Harvest and the surrounding Witta landscape.", boundary: "Approved by Ben Knight for ACT website use.", publicUrl: "/media/field-videos/harvest-field-notes-dji-0021.mp4", posterUrl: "/media/field-stills/harvest-field-notes-dji-0021.jpg" },
  { id: "harvest-source-aerial", title: "The nursery from above", field: "The Harvest", role: "Place", note: "The source-site aerial, useful for comparing crop and quality.", boundary: "Approved by Ben Knight for ACT website use.", sourceRepo: "harvest", sourcePath: "hero-aerial.mp4" },
  { id: "harvest-oyster-lease", title: "Oyster lease from above", field: "The Harvest", role: "Place", note: "Archive material from the compendium. Context must be established before it belongs in this story.", boundary: "Approved by Ben Knight for ACT website use.", sourceRepo: "harvest", sourcePath: "oyster-lease.mp4" },
];

const harvestGardenCrew: MediaReviewItem[] = [
  ["harvest-garden-beds-one", "The first garden beds", "Practice", "A slow walk through the early beds, weeds and marked ground.", "00003041-VIDEO-2026-02-23-16-21-10.mp4"],
  ["harvest-garden-beds-two", "Marking the garden", "Practice", "String lines and the first practical shape of the garden.", "00003042-VIDEO-2026-02-23-16-21-54.mp4"],
  ["harvest-nursery-close", "Plants in the old nursery", "Texture", "A short close walk through leaves, soil and what was already growing.", "00003068-VIDEO-2026-02-24-15-49-55.mp4"],
  ["harvest-nursery-walk", "Walking the nursery", "Place", "A longer field walk through the existing plants and the work ahead.", "00003069-VIDEO-2026-02-24-15-50-15.mp4"],
  ["harvest-groundworks-night", "Groundworks after dark", "Practice", "Machinery and people continuing the physical work into the evening.", "00003224-VIDEO-2026-03-05-20-40-21.mp4"],
  ["harvest-container-ground", "The container and the ground", "Place", "A brief record of the site while paths and levels were still being formed.", "00003236-VIDEO-2026-03-05-20-40-30.mp4"],
  ["harvest-path-one", "The new garden path", "Practice", "Freshly worked earth and the first clear way through the garden.", "00003505-VIDEO-2026-04-15-18-27-24.mp4"],
  ["harvest-path-two", "Path along the trees", "Place", "The path finds an edge beneath the existing trees.", "00003506-VIDEO-2026-04-15-18-27-25.mp4"],
  ["harvest-path-three", "Mulch, gravel and garden", "Texture", "A short material study of the path as it settles into place.", "00003512-VIDEO-2026-04-15-18-28-35.mp4"],
  ["harvest-crates-site", "Crates across The Harvest", "Opening", "A wide walk across the nursery with crates, sheds and machinery visible together.", "00003531-VIDEO-2026-04-27-17-18-37.mp4"],
].map(([id, title, role, note, sourcePath]) => ({
  id: String(id),
  title: String(title),
  field: "The Harvest" as const,
  role: role as MediaReviewItem["role"],
  note: String(note),
  boundary: "Approved by Ben Knight for ACT website use.",
  sourceRepo: "harvest_archive" as const,
  sourcePath: String(sourcePath),
}));

export const mediaReviewCatalog = [...current, ...justice, ...goods, ...utopiaTrip, ...harvest, ...harvestGardenCrew];

const repoRoots = {
  justice: path.resolve(process.cwd(), "../JusticeHub/public/stories/fire-and-road/video"),
  goods: path.resolve(process.cwd(), "../Goods Asset Register/v2/public/video"),
  harvest: path.resolve(process.cwd(), "../The Harvest Website/client/public/images/compendium"),
  harvest_archive: path.resolve(process.cwd(), "../The Harvest Website/docs/communications/debriefs/_whatsapp-exports/2026-04-27T09-46-44-632Z-whatsapp-chat-harvest-garden-crew"),
};

export function resolveReviewSource(id: string) {
  const item = mediaReviewCatalog.find((candidate) => candidate.id === id && candidate.sourceRepo && candidate.sourcePath);
  if (!item?.sourceRepo || !item.sourcePath) return null;
  const root = repoRoots[item.sourceRepo];
  const resolved = path.resolve(root, item.sourcePath);
  return resolved.startsWith(`${root}${path.sep}`) ? { item, resolved } : null;
}
