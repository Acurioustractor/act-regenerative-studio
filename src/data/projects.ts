export type ProjectTheme = "earth" | "justice" | "goods" | "valley" | "harvest";

export type ProjectStat = {
  value: string;
  label: string;
};

export type Project = {
  slug: string;
  title: string;
  theme: ProjectTheme;
  tagline: string;
  description: string;
  focus: string[];
  heroImage?: string;
  // Media from year-in-review
  photos?: string[];
  videoUrl?: string;
  // LCAA method content
  listen?: string;
  curiosity?: string;
  action?: string;
  art?: string;
  // Rich content from year-in-review
  stats?: ProjectStat[];
  quote?: {
    text: string;
    author: string;
    role: string;
  };
  // Explicit link to Empathy Ledger content so each page always has the
  // partner org's media, stories, and projects on hand for reflection,
  // story-writing, and page-building (especially art pages).
  empathyLedger?: {
    orgSlug: string;            // EL organisation slug (e.g. "oonchiumpa")
    elProjectSlugs?: string[];  // EL project slugs under that org
    notes?: string;             // optional context for the team
  };
};

export const projects: Project[] = [
  {
    slug: "black-cockatoo-valley",
    empathyLedger: { orgSlug: "a-curious-tractor" },
    title: "Black Cockatoo Valley",
    theme: "valley",
    tagline: "Stewardship and restoration on Jinibara Country",
    description: "On Jinibara Country, Black Cockatoo Valley is given back the time it needs: land under restoration, conservation taken seriously, and residencies that let cultural practice and new ways of working take root. This is slow work done with care. The valley is not a backdrop for ACT's projects, it is the ground that makes them possible.",
    focus: ["Stewardship", "Residencies", "Jinibara Country"],
  },
  {
    slug: "diagrama",
    empathyLedger: { orgSlug: "diagrama" },
    title: "Diagrama Spain/England Journey",
    theme: "justice",
    tagline: "What Spain learned, and Australia still resists",
    description: "At Diagrama's La Zarza centre in Spain, staff and young people share conversation, laughter and conflict handled with respect, not punishment. Spain rebuilt its youth justice system decades ago and saw reoffending fall. This project carries that evidence home, asking why Australia keeps building walls higher while the results get worse.",
    focus: ["Youth justice", "International learning", "Therapeutic practice"],
    heroImage:
      "https://tednluwflfhxyucgwigh.supabase.co/storage/v1/object/public/photos/community/3909ee10-4611-4413-bc50-a35378d044c8.jpeg",
  },
  {
    slug: "gold-phone",
    empathyLedger: { orgSlug: "a-curious-tractor" },
    title: "Gold.Phone",
    theme: "earth",
    tagline: "A payphone reborn for community stories",
    description: "Gold.Phone is a remodelled payphone given a second life as a place to leave a story, a thought, or a message for the community. Pick up the handset and the past meets the present: an everyday object from a quieter era reworked into an open invitation to connect, reflect, and be heard.",
    focus: ["Community engagement", "Storytelling", "Creative technology"],
    heroImage:
      "https://tednluwflfhxyucgwigh.supabase.co/storage/v1/object/public/photos/community/9c6a44ab-a19d-4868-8d82-18fa79edab6c.png",
  },
  {
    slug: "empathy-ledger",
    empathyLedger: { orgSlug: "a-curious-tractor" },
    title: "Empathy Ledger",
    theme: "earth",
    tagline: "Stories kept on community's terms",
    description: "Built with Elders and First Nations technologists, Empathy Ledger is a consent-first storytelling platform grounded in Indigenous data sovereignty and OCAP principles. Communities decide what is shared, how, and with whom. In 2025 it held 251 interviews with 231 storytellers, including seven Elders, as a living archive that returns power to the people who speak.",
    focus: ["Cultural Storytelling", "Data Sovereignty", "OCAP Protocols"],
    listen:
      "We listened to Elders and community members who expressed the need for a platform that honours their stories while respecting cultural protocols. Every conversation began with understanding consent, ownership, and the sacred nature of sharing wisdom.",
    curiosity:
      "How can technology serve cultural preservation without extracting value? What does data sovereignty look like in practice? We explored Indigenous-led frameworks like OCAP (Ownership, Control, Access, Possession) and learned from First Nations technologists about building platforms that centre community control.",
    action:
      "In 2025, we captured 251 interviews with 231 storytellers including 7 respected Elders, preserving 588,143 words of wisdom across 65 hours of conversation. We built flexible consent controls, cultural review workflows, and partnership frameworks with 15 organisations.",
    art:
      "Every story becomes part of a living digital archive. We translate complex data sovereignty concepts into accessible interfaces, use visual storytelling to honour each person's journey, and create spaces where communities can see themselves reflected with dignity.",
    stats: [
      { value: "231", label: "Storytellers" },
      { value: "251", label: "Interviews Recorded" },
      { value: "65hrs", label: "Of Wisdom" },
      { value: "15", label: "Partner Organizations" },
    ],
    quote: {
      text: "Every story matters. When we preserve our voices, we preserve our culture for generations yet to come.",
      author: "Community Elder",
      role: "Palm Island Storyteller",
    },
  },
  {
    slug: "fishers-oysters",
    empathyLedger: { orgSlug: "fishers-oysters" },
    title: "Fishers Oysters",
    theme: "earth",
    tagline: "Quandamooka oyster reefs, restored from the water up",
    description: "On Quandamooka Country in Moreton Bay, Traditional Owners are rebuilding oyster reefs that colonisation all but erased. Fishers Oysters pairs cultural knowledge of tides and seasons with regenerative aquaculture, so young people move from training into ownership and the waters grow clearer with every harvest.",
    focus: ["Indigenous-led", "Regenerative practice", "Economic sovereignty"],
    listen:
      "Australia's oyster reefs were 99% destroyed in the 200 years since colonisation. For coastal Indigenous communities, this wasn't just environmental loss, it was loss of food source, cultural practice, and economic independence. We listened to Elders who remembered the reefs, to marine scientists documenting the damage, and to young people seeking pathways to sustainable livelihoods on Country.",
    curiosity:
      "What if reef restoration could rebuild both ecosystem and community self-determination? We explored how oyster aquaculture could become a vehicle for economic sovereignty while healing the waters. Each oyster filters 200 litres of water per day. What if Indigenous enterprise could scale this healing?",
    action:
      "Working with Quandamooka Traditional Owners, we've established oyster growing operations in Moreton Bay. The enterprise combines traditional knowledge of tides, seasons, and sustainable harvest with modern aquaculture techniques. Young people are training in marine enterprise, creating pathways from unemployment to ownership.",
    art:
      "The story of Fishers Oysters is told through the waters themselves, clearer, healthier, teeming with life. We document this transformation through underwater photography, time-lapse of reef regeneration, and community storytelling that connects ancient practice to contemporary enterprise.",
    stats: [
      { value: "99%", label: "Reefs Lost Since Colonisation" },
      { value: "200L", label: "Water Filtered Per Oyster/Day" },
      { value: "100%", label: "Indigenous Owned" },
    ],
    quote: {
      text: "When we restore the reefs, we restore ourselves. The oysters remember what these waters should be.",
      author: "Quandamooka Elder",
      role: "Fishers Oysters Advisor",
    },
    heroImage:
      "https://tednluwflfhxyucgwigh.supabase.co/storage/v1/object/public/photos/community/1cb29099-2df6-4089-ace0-3d65ea7c4ada.jpeg",
    videoUrl: "https://share.descript.com/view/VBn8Z3U9pV4",
  },
  {
    slug: "justicehub",
    empathyLedger: { orgSlug: "justicehub" },
    title: "JusticeHub",
    theme: "justice",
    tagline: "Communities have the cure for locking up kids",
    description: "Across Australia, grassroots programs are keeping First Nations young people out of detention and on Country, yet the money still flows to cells. JusticeHub documents what works, connects families to it in one search, and makes the case for moving resources to the people already healing their own communities.",
    focus: ["Youth Justice", "First Nations", "Community Programs"],
    listen:
      "Indigenous youth are locked up 24x more frequently than non-Indigenous youth, costing $1.1M per child per year. We listened to families, community workers, and young people who told us: detention doesn't work, but community programs do. The evidence was already there. We just needed to make it visible.",
    curiosity:
      "What if we could map every successful community program in Australia? What if families could find help with one search instead of dozens of phone calls? We asked: how do we shift funding from systems that harm to programs that heal?",
    action:
      "We documented 150+ grassroots programs, connected 2,400 youth to services, and demonstrated $45M in cost savings by redirecting just a fraction of youth from detention to community support. We built search tools, transparency dashboards, and storytelling platforms that make community solutions impossible to ignore.",
    art:
      "JusticeHub translates data into human stories. Bold typography, stark contrasts, and confronting statistics become tools for advocacy. We create installations like CONTAINED, experiential spaces that immerse visitors in the reality of youth detention and the power of community alternatives.",
    stats: [
      { value: "150+", label: "Programs Documented" },
      { value: "2,400", label: "Youth Connected" },
      { value: "$45M", label: "Cost Savings" },
      { value: "78%", label: "Community Success Rate" },
    ],
    quote: {
      text: "Communities have always had the solutions. JusticeHub makes them visible, connected, and impossible to ignore.",
      author: "JusticeHub Platform",
      role: "Mission Statement",
    },
    heroImage:
      "https://tednluwflfhxyucgwigh.supabase.co/storage/v1/object/public/photos/community/c202f7b9-23eb-4477-8214-df40108476fa.png",
  },
  {
    slug: "goods",
    empathyLedger: { orgSlug: "a-curious-tractor" },
    title: "Goods on Country",
    theme: "goods",
    tagline: "Beds built to last twenty years on Country",
    description: "Across remote communities in the NT, WA and Queensland, freight costs and flimsy products mean families pay far more for goods that fail fast. Working alongside Aboriginal Elders and Traditional Owners, Goods on Country designs durable beds, washing machines and furniture for the conditions they serve, with repair networks and feedback that improve every build.",
    focus: ["Remote Communities", "Essential Goods", "Community Partnership"],
    listen:
      "We listened to Traditional Owners in remote NT, WA, and Queensland communities who described the challenge of accessing basic household goods on Country. Expensive freight, unsuitable products, and lack of repair infrastructure meant families went without essentials or paid 3-4x urban prices.",
    curiosity:
      "What if we designed furniture specifically for remote conditions? What if beds could withstand extreme heat, washing machines could handle bore water, and everything was built to last 20 years instead of 2? We researched materials, tested prototypes, and learned from community feedback.",
    action:
      "In 2025, we deployed 389 assets including 363 beds across 8 communities. We built partnerships with Aboriginal-led organisations, established repair networks, and created feedback loops so every deployment improves the next. Products are designed with community input and built to remote specifications.",
    art:
      "Goods on Country is functional beauty. Clean lines, honest materials, and designs that honour the landscapes they serve. We document the journey of each piece, from co-design workshops to delivery, creating a visual story of place-based innovation.",
    stats: [
      { value: "389", label: "Assets Deployed" },
      { value: "363", label: "Beds Delivered" },
      { value: "8", label: "Communities Served" },
      { value: "500+", label: "Minutes of Feedback" },
    ],
    quote: {
      text: "It took just five minutes to put together, and it's properly comfortable... fellas who'd want something like this.",
      author: "Mark",
      role: "Community Member",
    },
    heroImage:
      "https://tednluwflfhxyucgwigh.supabase.co/storage/v1/object/public/photos/community/49a62fee-d7a8-4f54-8f41-b89f48e9536b.jpeg",
  },
  {
    slug: "bg-fit",
    empathyLedger: { orgSlug: "bg-fit" },
    title: "BG Fit Mount Isa",
    theme: "justice",
    tagline: "Trust built by someone who's lived it",
    description: "In Mount Isa, on Kalkadoon Country, Brodie Germaine runs BG Fit from lived experience of the streets the young people around him still walk. Within minutes of a yarn at the gym, ten youth had signed up for a fishing trip. The work shows what becomes possible when support is led by someone the community already trusts.",
    focus: ["Youth engagement", "Lived experience leadership", "Community trust"],
    heroImage:
      "https://tednluwflfhxyucgwigh.supabase.co/storage/v1/object/public/photos/community/f1ae054f-1a2e-42bc-89ea-a3f0a0fb2d02.jpeg",
    videoUrl: "https://share.descript.com/view/PyynfkFGD2o",
  },
  {
    slug: "quandamooka-justice-strategy",
    empathyLedger: {
      orgSlug: "mmeic",
      elProjectSlugs: ["mmeic-cultural-initiative", "quandamooka"],
    },
    title: "Quandamooka Justice and Healing Strategy",
    theme: "justice",
    tagline: "Quandamooka Elders charting justice and healing",
    description: "On Quandamooka Country, the Minjerribah Moorgumpin Elders-In-Council are leading a justice reinvestment strategy shaped by community, not imposed on it. From a new Justice and Healing hub, the team is listening to Quandamooka people about what justice means here and how to make it last for generations.",
    focus: ["Justice reinvestment", "Elder leadership", "Community healing"],
    videoUrl: "https://share.descript.com/view/WLVraYUDiyH",
  },
  {
    slug: "smart-recovery-gp-kits",
    empathyLedger: { orgSlug: "smart-recovery" },
    title: "SMART Recovery GP Kits",
    theme: "justice",
    tagline: "Making it easy for GPs to refer",
    description: "People living with addiction often wait a year or more before anyone offers a way forward. SMART Recovery GP Kits give doctors simple, memorable objects, notepads, sandtimers and coasters, that make it easy to start the conversation and refer on the spot. At GPCE Sydney 2024 the kits drew more than a thousand requests.",
    focus: ["Primary care", "Addiction support", "Early intervention"],
    heroImage:
      "https://tednluwflfhxyucgwigh.supabase.co/storage/v1/object/public/photos/community/dca16943-3672-4547-8d90-a1547ab4fb21.png",
  },
  {
    slug: "goods-tennant-creek",
    empathyLedger: { orgSlug: "a-curious-tractor" },
    title: "Goods Tennant Creek Journey",
    theme: "goods",
    tagline: "Twenty-three years on Country, designed together",
    description: "Dianne has lived on her traditional lands near Tennant Creek for twenty-three years, beginning with only her car for shelter. Working with her, A Curious Tractor crafted beds and learned Warumungu words for the buttons on a near-indestructible washing machine. The work blurs the line between helper and helped, treating design as something built side by side.",
    focus: ["Traditional Ownership", "Co-design", "Mutual transformation"],
    heroImage:
      "https://tednluwflfhxyucgwigh.supabase.co/storage/v1/object/public/photos/community/49a62fee-d7a8-4f54-8f41-b89f48e9536b.jpeg",
    videoUrl: "https://share.descript.com/view/MV7T2wE7rn7",
  },
  {
    slug: "oonchiumpa",
    empathyLedger: { orgSlug: "oonchiumpa" },
    title: "Oonchiumpa",
    theme: "justice",
    tagline: "Elders decide what support means",
    description: "In Central Australia, Oonchiumpa is an Aboriginal-led response for young people in crisis, where Elders and local cultural authority decide what genuine support looks like, both on Country and in town. The work follows community lead rather than imported program models, keeping young people connected to culture, kin, and place.",
    focus: ["Aboriginal-led", "Youth crisis support", "Cultural authority"],
    heroImage:
      "https://tednluwflfhxyucgwigh.supabase.co/storage/v1/object/public/photos/community/c6adc97f-cc96-45b0-a37a-ea081213a67e.jpeg",
  },
  {
    slug: "pakkimjalki-kari",
    empathyLedger: { orgSlug: "a-curious-tractor" },
    title: "Pakkimjalki Kari (Washing Machine)",
    theme: "goods",
    tagline: "One button, built to be repaired locally",
    description: "Pakkimjalki Kari, meaning washing machine in Warumungu, was designed on Warumungu Country through hundreds of hours of conversation with community. People asked for one thing that was simple, hard-wearing and easy to fix, so the buttons became a single go button and the surfaces were hardened with recycled plastic. Built on a common model, it keeps parts close and trains local people to do the repairs.",
    focus: ["Co-design", "Repair culture", "Community manufacturing"],
    heroImage:
      "https://tednluwflfhxyucgwigh.supabase.co/storage/v1/object/public/photos/community/dc210fe8-9f73-44af-b4a3-155889affc81.jpeg",
  },
  {
    slug: "weave-bed-tennant-creek",
    empathyLedger: { orgSlug: "a-curious-tractor" },
    title: "Weave Bed Design",
    theme: "goods",
    tagline: "A woven bed you can wash and mend",
    description: "On Warumungu Country near Tennant Creek, Jimmy Frank Jupurrurla and his community shaped a bed that can be woven, washed and repaired rather than thrown away. The prototype takes shape through iteration with the people who will use it, reimagining what everyday goods for remote communities can be when they are designed in place.",
    focus: ["Prototype design", "Community iteration", "Repairable goods on Country"],
    heroImage:
      "https://tednluwflfhxyucgwigh.supabase.co/storage/v1/object/public/photos/community/e9f86c0c-abff-4246-9b50-624e362b0347.jpeg",
  },
  {
    slug: "contained",
    empathyLedger: {"orgSlug":"justicehub"},
    title: "CONTAINED",
    theme: "justice",
    tagline: "Step inside a cell, then a way out",
    description: "CONTAINED puts visitors inside the reality of youth detention, then opens a door onto the community alternatives that actually work. Through physical space, storytelling and data made visible, it turns abstract debate into something you feel in your body, and a case you cannot unsee.",
    focus: ["Youth justice", "Experiential design", "Community advocacy"],
  },
  {
    slug: "the-harvest",
    empathyLedger: { orgSlug: "a-curious-tractor" },
    title: "The Harvest",
    theme: "harvest",
    tagline: "Where people grow food, share meals, and belong",
    description: "At The Harvest, neighbours gather to grow food, cook seasonal meals together, and tend therapeutic gardens that hold space for healing. Belonging is built slowly here, through shared work and good conversation. The land does as much of the work as the people, and everyone leaves with something grown.",
    focus: ["Community meals", "Therapeutic programs", "Seasonal harvests"],
    heroImage:
      "https://tednluwflfhxyucgwigh.supabase.co/storage/v1/object/public/photos/community/37eb9379-c39d-4eee-b5ad-d279f920c578.jpeg",
  },
  {
    slug: "tomnet",
    empathyLedger: { orgSlug: "tomnet" },
    title: "TOMNET",
    theme: "justice",
    tagline: "Men over fifty find their people",
    description: "In Toowoomba, TOMNET is a community-led network helping men over fifty move from isolation into belonging, purpose, and contribution. Through peer-led storytelling, volunteering, and intergenerational mentoring, the men themselves show how connection strengthens mental wellbeing across regional communities.",
    focus: ["Mental wellbeing", "Peer-led support", "Regional community"],
  },
  {
    slug: "uncle-allan-palm-island-art",
    empathyLedger: { orgSlug: "palm-island-community-company" },
    title: "Uncle Allan Palm Island Art",
    theme: "earth",
    tagline: "Uncle Allan's art, shared on his terms",
    description: "Uncle Allan, a Bwgcolman artist from Palm Island, shares his work and stories on his own terms through burrgumanbarraart.com. The site honours his practice, opens the door to commissions and collaborators, and strengthens cultural sovereignty by keeping how the work is seen and sold in his hands.",
    focus: ["Cultural sovereignty", "Indigenous art", "Digital platform"],
  },
  {
    slug: "the-confessional",
    empathyLedger: { orgSlug: "a-curious-tractor" },
    title: "The Confessional",
    theme: "earth",
    tagline: "A room built for the truth we carry",
    description: "Most people rarely get a moment to say what weighs on them out loud. The Confessional builds that moment: a designed space and a careful ritual where people name hard truths on their own terms. Honesty becomes something a community can share, not a burden carried alone.",
    focus: ["Safe space", "Vulnerability", "Community healing"],
  },
  {
    slug: "smart-hcp-uplift",
    empathyLedger: { orgSlug: "smart-recovery" },
    title: "SMART HCP GP Uplift",
    theme: "justice",
    tagline: "Built into the GP's daily practice",
    description: "When a GP sees a patient struggling with addiction, the path to help should be clear, not buried. This work weaves SMART Recovery into the everyday tools and referral pathways GPs already use, so evidence-based support is one easy step away rather than a dead end.",
    focus: ["Healthcare integration", "GP referrals", "Addiction support"],
  },
  {
    slug: "smart-connect",
    empathyLedger: { orgSlug: "smart-recovery" },
    title: "SMART Connect",
    theme: "justice",
    tagline: "Find a meeting, find your people",
    description: "Reaching out for help is hard enough without a maze of dead links and wrong numbers. SMART Connect lays down clear digital and in-person pathways so anyone looking for a SMART Recovery meeting, a resource or a peer can actually find one, close to home and close to now.",
    focus: ["Peer support", "Digital pathways", "Community connection"],
  },
  {
    slug: "regional-arts-fellowship",
    empathyLedger: {"orgSlug":"a-curious-tractor","notes":"BCV-linked fellowship; ACT parent org for now."},
    title: "Regional Arts Fellowship",
    theme: "earth",
    tagline: "Artists working where land meets new technology",
    description: "The Regional Arts Fellowship brings artists into the place where regenerative farming and emerging technology meet, out in regional Australia. Working alongside the Australian Network for Art and Technology and people on the land, fellows make creative work that takes the future of agriculture seriously. The result is art grounded in real Country, not theory.",
    focus: ["Art & technology", "Agriculture", "Regional innovation"],
  },
  {
    slug: "picc-centre-precinct",
    empathyLedger: { orgSlug: "palm-island-community-company" },
    title: "PICC Centre Precinct",
    theme: "earth",
    tagline: "A run-down site, re-imagined by community",
    description: "On Palm Island (Bwgcolman Country), Palm Island Community Company is turning an under-used, run-down site into a precinct the community designs for itself. Through co-design, residents shape what the space becomes, so the place reflects the people who will use it rather than a plan handed down from outside.",
    focus: ["Community space", "Co-design", "Palm Island"],
  },
  {
    slug: "picc-photo-kiosk",
    empathyLedger: { orgSlug: "palm-island-community-company" },
    title: "PICC Photo Kiosk",
    theme: "earth",
    tagline: "Image-making, in community hands",
    description: "On Palm Island (Bwgcolman Country), a community-controlled photo studio puts image-making in the hands of community members themselves. People tell their own stories and shape how their community is seen, keeping control of the camera and the picture it produces.",
    focus: ["Community control", "Digital tools", "Cultural storytelling"],
  },
  {
    slug: "picc-elders-hull-river",
    empathyLedger: { orgSlug: "palm-island-community-company" },
    title: "PICC Elders Hull River Trip",
    theme: "earth",
    tagline: "Elders, back on Country at Hull River",
    description: "Bwgcolman Elders from Palm Island returned to their traditional lands at Hull River for cultural practice, storytelling, and time on Country. Led by the Elders themselves, the journey reconnected knowledge to place and passed living culture to the next generation through being there together.",
    focus: ["Cultural practice", "Connection to Country", "Elder leadership"],
  },
  {
    slug: "picc-annual-report",
    empathyLedger: { orgSlug: "palm-island-community-company" },
    title: "PICC Annual Report",
    theme: "earth",
    tagline: "PICC's year, told in PICC's words",
    description: "Palm Island Community Company is producing its annual report on its own terms, written and shaped by the community it serves. The report strengthens Indigenous storytelling and keeps narrative control with Bwgcolman people, so accountability to funders and to community is told in the community's own voice.",
    focus: ["Indigenous storytelling", "Community control", "Accountability"],
  },
  {
    slug: "caring-for-those-who-care",
    empathyLedger: { orgSlug: "a-curious-tractor" },
    title: "Caring for Those Who Care",
    theme: "justice",
    tagline: "The people who hold the sector together",
    description: "Across Australia, the people leading not-for-profit organisations carry their communities through the hardest of social change, often unheard. This project listens to those leaders and records their wisdom, challenges, and hard-won insight, so the knowledge of frontline community work is shared rather than lost.",
    focus: ["NFP leadership", "Storytelling", "Community sector"],
  },
  {
    slug: "mounty-yarns",
    empathyLedger: { orgSlug: "mounty-yarns" },
    title: "Mounty Yarns",
    theme: "justice",
    tagline: "Young people shaping their own systems",
    description: "In Mount Druitt, on Dharug Country, Mounty Yarns is a youth-led base where lived experience becomes leadership. Young people gather, yarn, and build the confidence to influence the systems that shape their lives, on their own terms rather than someone else's agenda.",
    focus: ["Youth leadership", "Lived experience", "Systems change"],
  },
  {
    slug: "junes-patch",
    empathyLedger: {"orgSlug":"june-canavan-foundation"},
    title: "June's Patch",
    theme: "earth",
    tagline: "A garden where healing grows at its own pace",
    description: "June's Patch is a therapeutic garden where people work with soil, seasons, and growing things as part of their recovery. Horticultural therapy here is unhurried: hands in the earth, attention on what is taking root. Connection to land becomes a steady ground for mental health and wellbeing.",
    focus: ["Therapeutic gardening", "Nature connection", "Mental health"],
  },
  {
    slug: "designing-for-obsolescence",
    empathyLedger: { orgSlug: "a-curious-tractor" },
    title: "Designing for Obsolescence",
    theme: "goods",
    tagline: "Designing the end of a product first",
    description: "Most products are built to break and be binned. Designing for Obsolescence asks the opposite question: what if everyday goods were made to last, made to be repaired, and made with their end of life planned from the start. It is the design thinking that underpins the durable, fixable goods built alongside remote communities.",
    focus: ["Circular design", "Repair culture", "Product lifecycle"],
  },
  {
    slug: "travelling-womens-car",
    empathyLedger: { orgSlug: "oonchiumpa" },
    title: "Travelling Women's Car",
    theme: "earth",
    tagline: "Storytelling that travels to the women",
    description: "Women in remote communities said storytelling should come to them, not the other way around. The Travelling Women's Car answers that: a vehicle fitted for story capture that creates women-only space wherever it stops. Cultural knowledge that might otherwise be lost is recorded and returned to community, held on their terms.",
    focus: ["Women's voices", "Cultural preservation", "Mobile storytelling"],
    listen:
      "We listened to women in remote communities who said they needed storytelling to come to them, not the other way around.",
    curiosity:
      "What happens when we take storytelling infrastructure to where women are? How does a mobile space change what's possible?",
    action:
      "A vehicle equipped for story capture that travels to communities, creating women-only space for sharing and preserving knowledge.",
    art:
      "Stories preserved that would otherwise be lost - cultural knowledge captured and returned to community on their terms.",
  },
  {
    slug: "nfp-leaders-interviews",
    empathyLedger: { orgSlug: "a-curious-tractor" },
    title: "NFP Leaders Interview Project",
    theme: "justice",
    tagline: "Sector wisdom, before it walks out the door",
    description: "Across Australia's not-for-profit sector, experienced leaders carry hard-won knowledge that too often disappears when they retire. This project sits down with them, capturing what works, what doesn't, and what the sector needs to evolve, then makes those patterns and warnings available to the leaders coming next.",
    focus: ["Sector research", "Knowledge capture", "Leadership wisdom"],
    listen:
      "We heard from NFP leaders nearing retirement who worried their hard-won knowledge would disappear when they left.",
    curiosity:
      "What patterns emerge when you interview dozens of experienced sector leaders? What wisdom is the sector losing as leaders retire?",
    action:
      "Structured interviews with NFP leaders across Australia, capturing and analysing insights about community work, systems change, and impact.",
    art:
      "A shared resource of sector wisdom - patterns, warnings, and insights made available to the next generation of leaders.",
  },
];
