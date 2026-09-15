const launchRedirects = [
  // Flattened 2026-08-07: /method itself redirects into /about#convictions, so
  // pointing /lcaa at it chained a 308 into a second hop. /method's own rule
  // stays below for anything that cached the old destination.
  { source: "/lcaa", destination: "/about#convictions", permanent: true },
  // /wiki/new is caught by the /wiki/:slug* hold below (2026-08-07; it used to
  // 308 into the held /wiki, a three-hop chain). Restore a permanent rule to
  // the wiki when the /wiki hold reverses.
  { source: "/engine", destination: "/admin/engine", permanent: true },
  {
    source: "/image-picker",
    destination: "/admin/image-picker",
    permanent: true,
  },
  { source: "/media-lab", destination: "/admin/media-lab", permanent: true },
  {
    source: "/wiki/source-packets",
    destination: "/admin/source-packets",
    permanent: true,
  },
  {
    source: "/wiki/source-bridges",
    destination: "/admin/source-bridges",
    permanent: true,
  },

  // Legacy public-site routes. /seeds and /action used to point at /projects and
  // ride its closure redirect, which cost every visitor a second hop. The closure
  // is permanent (2026-08-07), so they go straight to where the work now lives.
  { source: "/seeds", destination: "/#fields", permanent: true },
  { source: "/action", destination: "/#fields", permanent: true },
  { source: "/germinating", destination: "/stories", permanent: true },
  { source: "/news", destination: "/stories", permanent: true },
  { source: "/journal", destination: "/stories", permanent: true },
  { source: "/year-in-review", destination: "/stories", permanent: true },
  { source: "/2025-review", destination: "/stories", permanent: true },

  // Canonical slug renames, 2026-04-23.
  {
    source: "/projects/diagrama-spain",
    destination: "/#fields",
    permanent: true,
  },
  {
    source: "/projects/bg-fit-mount-isa",
    destination: "/#fields",
    permanent: true,
  },
  {
    source: "/projects/smart-hcp-gp-uplift",
    destination: "/#fields",
    permanent: true,
  },
  {
    source: "/projects/pakkinjalki-kari",
    destination: "/#fields",
    permanent: true,
  },
  {
    source: "/projects/goods-on-country",
    destination: "/fields/goods",
    permanent: true,
  },
  { source: "/goods-on-country", destination: "/fields/goods", permanent: true },
  { source: "/projects/the-harvest", destination: "/harvest", permanent: true },
  {
    source: "/projects/empathy-ledger",
    destination: "/fields/empathy",
    permanent: true,
  },
  {
    source: "/projects/justicehub",
    destination: "/fields/justice",
    permanent: true,
  },
  { source: "/projects/goods", destination: "/fields/goods", permanent: true },
  {
    source: "/projects/black-cockatoo-valley",
    destination: "/about#history",
    permanent: true,
  },

  // Editorial-site closure, 2026-07-23, made permanent 2026-08-07. The Living
  // Field is the information architecture; /projects and /events are not coming
  // back. 308 rather than 307, because a temporary code tells a crawler to keep
  // the old URL indexed and check again, which is no longer true. The old page
  // code remains in the repository as source material. Keep admin, API, webhook,
  // Confessions, art detail, Harvest detail and story-article routes intact.
  { source: "/projects", destination: "/#fields", permanent: true },
  { source: "/projects/:slug*", destination: "/#fields", permanent: true },
  { source: "/goods", destination: "/fields/goods", permanent: false },
  {
    source: "/empathy-ledger",
    destination: "/fields/empathy",
    permanent: false,
  },
  { source: "/justicehub", destination: "/fields/justice", permanent: false },
  { source: "/farm", destination: "/about#history", permanent: false },
  { source: "/farm/:slug*", destination: "/about#history", permanent: false },
  { source: "/ecosystem", destination: "/#fields", permanent: false },
  { source: "/ecosystem/:slug*", destination: "/#fields", permanent: false },
  { source: "/method", destination: "/about#convictions", permanent: false },
  { source: "/vision", destination: "/about#convictions", permanent: false },
  {
    source: "/principles",
    destination: "/about#convictions",
    permanent: false,
  },
  {
    source: "/how-we-work",
    destination: "/about#convictions",
    permanent: false,
  },
  { source: "/governance", destination: "/about#bearings", permanent: false },
  { source: "/studio", destination: "/about", permanent: false },
  { source: "/impact", destination: "/stories", permanent: false },
  { source: "/partners", destination: "/contact", permanent: false },
  { source: "/events", destination: "/harvest", permanent: true },
  { source: "/media", destination: "/stories", permanent: false },
  // The Webflow site's own routes, mapped 2026-09-16 ahead of the cutover.
  //
  // act.place still serves Webflow, and 45 of the 81 URLs in its sitemap had no
  // home here, measured by fetching every one of them against production. The
  // domain has been live for years, so those URLs sit in search results, other
  // people's posts, grant applications and printed material, and the day DNS
  // moves they all become 404s. Each rule below sends one to the page that holds
  // that work now.
  //
  // What is deliberately NOT mapped, and should keep 404ing: /checkout,
  // /paypal-checkout and /order-confirmation (a Webflow shop whose only product
  // page reads "Lorem ipsum" at $0.00), /template/*, /relume-*,
  // /career-single-no-cms, /place-page, /goods-analysis and /goods-product-page
  // (unfinished scaffolding, one of them twelve words long). A redirect for a
  // page nobody meant to publish only teaches a crawler that it still exists.
  //
  // This block sits above the /blog rules because the misspelt slug below has to
  // match before /blog/:slug* claims it.
  {
    // The Webflow slug carries three dashes where the Empathy Ledger slug has
    // one. The target is in review upstream today; when it is published again,
    // this rule is what keeps the old link working.
    source:
      "/blog/the-kids-are-not-alright-how-queensland-is-failing-its-most-vulnerable-young-people---and-what-we-can-do-about-it",
    destination:
      "/stories/the-kids-are-not-alright-how-queensland-is-failing-its-most-vulnerable-young-people-and-what-we-can-do-about-it",
    permanent: true,
  },

  // Art works that began life as a Webflow project or seed page.
  { source: "/the-gold-phone", destination: "/art/gold-phone", permanent: true },
  { source: "/seeds/con-phone", destination: "/art/gold-phone", permanent: true },
  { source: "/seeds/the-treacher", destination: "/art/treacher", permanent: true },
  {
    source: "/project/the-confessional",
    destination: "/art/the-confessional",
    permanent: true,
  },
  {
    source: "/project/contained",
    destination: "/art/contained",
    permanent: true,
  },
  { source: "/be-contained", destination: "/art/contained", permanent: true },

  // Flagships. The old site gave each its own page; the field is the home now.
  {
    source: "/project/justicehub",
    destination: "/fields/justice",
    permanent: true,
  },
  {
    source: "/act-projects/justicehub",
    destination: "/fields/justice",
    permanent: true,
  },
  {
    source: "/project/con-nected",
    destination: "/fields/justice",
    permanent: true,
  },
  {
    source: "/project/confit-pathways-digital-mentoring",
    destination: "/fields/justice",
    permanent: true,
  },
  {
    source: "/seeds/yj-your-justice",
    destination: "/fields/justice",
    permanent: true,
  },
  { source: "/seeds/the-fixers", destination: "/fields/justice", permanent: true },
  {
    source: "/project/empathy-ledger",
    destination: "/fields/empathy",
    permanent: true,
  },
  {
    source: "/act-projects/empathy-ledger",
    destination: "/fields/empathy",
    permanent: true,
  },
  { source: "/project/goods", destination: "/fields/goods", permanent: true },
  { source: "/project/dad-lab", destination: "/harvest", permanent: true },

  // Goods sells and this site does not (cutover plan, 2026-08-07), so a product
  // page goes to the product's own site rather than to a field page that cannot
  // take an order.
  {
    source: "/weave-bed",
    destination: "https://www.goodsoncountry.com/beds",
    permanent: true,
  },
  {
    source: "/pakkimjalki-kari-indestructible-washing-machine",
    destination: "https://www.goodsoncountry.com/shop/washing-machine",
    permanent: true,
  },
  {
    source: "/goods-shop-page",
    destination: "https://www.goodsoncountry.com/beds",
    permanent: true,
  },
  {
    source: "/greate-beds---faqs",
    destination: "https://www.goodsoncountry.com/beds",
    permanent: true,
  },
  {
    source: "/product/:slug*",
    destination: "https://www.goodsoncountry.com/beds",
    permanent: true,
  },
  {
    source: "/goods-storytellers",
    destination: "https://www.goodsoncountry.com/storytellers",
    permanent: true,
  },

  // Who we are. Both bios ran to 7,000 words, of which 311 sentences were the
  // same boilerplate on each, so there is nothing in them /about does not say
  // better.
  { source: "/bens-bio", destination: "/about", permanent: true },
  { source: "/nics-bio", destination: "/about", permanent: true },
  { source: "/who-we-are", destination: "/about", permanent: true },
  { source: "/about-new", destination: "/about", permanent: true },
  { source: "/2024-in-review", destination: "/about#history", permanent: true },
  { source: "/act-homework", destination: "/contact", permanent: true },

  // Everything else the old site filed under a project or a seed. The specific
  // rules above match first; these catch the remainder, including anything
  // unpublished before its sitemap was read.
  { source: "/seeds/:slug*", destination: "/#fields", permanent: true },
  { source: "/project/:slug*", destination: "/#fields", permanent: true },
  { source: "/act-projects/:slug*", destination: "/#fields", permanent: true },

  // Route unification, 2026-08-07: editorial articles moved from /blog/[slug]
  // to /stories/[slug] so one slug space serves packets and articles. 308s,
  // because the naming decision is final.
  { source: "/blog", destination: "/stories", permanent: true },
  { source: "/blog/:slug*", destination: "/stories/:slug*", permanent: true },
  { source: "/economy", destination: "/fields/goods", permanent: false },
  { source: "/visit", destination: "/harvest", permanent: false },
  { source: "/surprise", destination: "/stories", permanent: false },

  // Deleted or demoted entries redirect to parent context.
  //
  // The /projects/:slug* rule above matches first and sends all of these to
  // /#fields in one hop (redirects are first-match-wins), so they are dormant and
  // the redirect check reports them as such. Their destinations were flattened on
  // 2026-08-07: they used to point at /projects and /events, which are themselves
  // closed, so each held URL would have cost two hops the moment it went live.
  // The earlier warning against flattening assumed the closure was temporary.
  {
    source: "/projects/green-harvest-witta",
    destination: "/harvest",
    permanent: true,
  },
  {
    source: "/projects/project-her-self",
    destination: "/#fields",
    permanent: true,
  },
  {
    source: "/projects/act-monthly-dinners",
    destination: "/harvest",
    permanent: true,
  },
  {
    source: "/projects/10x10-retreat",
    destination: "/harvest",
    permanent: true,
  },
  {
    source: "/projects/westpac-summit-2025",
    destination: "/harvest",
    permanent: true,
  },
  {
    source: "/projects/bupa-tfn-pitch",
    destination: "/harvest",
    permanent: true,
  },
  {
    source: "/projects/naidoc-week-mount-isa",
    destination: "/harvest",
    permanent: true,
  },
  { source: "/projects/dad-lab-25", destination: "/harvest", permanent: true },
  {
    source: "/projects/anat-spectra-2025",
    destination: "/harvest",
    permanent: true,
  },
  {
    source: "/projects/cars-and-microcontrollers",
    destination: "/harvest",
    permanent: true,
  },
  {
    source: "/projects/global-laundry-alliance",
    destination: "/harvest",
    permanent: true,
  },

  // Launch holds (2026-05-27) — temporary, reverse when each surface is ready.
  // Kept as 307s (permanent: false) so engines don't cache them and the routes
  // can return cleanly. Mirror any change here in src/app/sitemap.ts and the
  // launchRoutes list in scripts/check-launch-site.mjs.
  // - /storytellers: held until more than one consented profile is syndicated.
  // - /ask: public AI Q&A held for a later phase (cost/safety/injection review).
  // - /wiki: living wiki is a longer build; held until it is ready.
  // - /people: held 2026-05-29 (internal research notes were leaking into public
  //   bios from the Empathy Ledger data); sanitize the bio source before reopening.
  // Hold destinations flattened 2026-08-07: /ask and /wiki pointed at
  // /projects, which itself redirects, so every held URL cost two hops.
  { source: "/storytellers", destination: "/stories", permanent: false },
  { source: "/storytellers/:slug*", destination: "/stories", permanent: false },
  // ANAT SPECTRA 2025 was an event, not a studio-line work; retired from /art (art-from-the-record step 3).
  { source: "/art/anat-spectra-2025", destination: "/art", permanent: false },
  { source: "/ask", destination: "/questions", permanent: false },
  { source: "/wiki", destination: "/#fields", permanent: false },
  { source: "/wiki/:slug*", destination: "/#fields", permanent: false },
  { source: "/people", destination: "/about", permanent: false },

  // Project holds (2026-05-27) — not-ready / internal pages held off the public
  // launch. 307s (permanent: false) so they reverse cleanly when each is ready.
  // This is the single source of truth: a hold here removes the project from the
  // page (redirect), the public count, the sitemap, the /projects index, the
  // homepage mosaic, and related-projects (see heldProjectSlugs in public-projects).
  {
    source: "/projects/act-infrastructure",
    destination: "/#fields",
    permanent: false,
  },
  {
    source: "/projects/custodian-first-economy",
    destination: "/#fields",
    permanent: false,
  },
  {
    source: "/projects/facilitation",
    destination: "/#fields",
    permanent: false,
  },
  {
    source: "/projects/grantscope",
    destination: "/#fields",
    permanent: false,
  },
  {
    source: "/projects/minderoo-pitch-package",
    destination: "/#fields",
    permanent: false,
  },
  {
    source: "/projects/three-circles",
    destination: "/#fields",
    permanent: false,
  },
  {
    source: "/projects/the-full-idea",
    destination: "/#fields",
    permanent: false,
  },
  {
    source: "/projects/annual-field-service",
    destination: "/#fields",
    permanent: false,
  },

  // Campaign IA unification (2026-05-30): the Payout Wall + its method page moved
  // under /confessions so the whole Confessions to Philanthropy campaign lives in
  // one place. 308 permanent so the /art entry, the Friday tape link, and any
  // shared links keep resolving.
  // Flattened 2026-08-07: /confessions/wall now 307s on to /confessions/listen
  // because the Payout Wall was retired from the campaign, so pointing here sent
  // shared /art links through two hops. Straight to the page that answers.
  {
    source: "/art/the-payout-wall",
    destination: "/confessions/listen",
    permanent: true,
  },
  {
    source: "/art/the-payout-wall/method",
    destination: "/confessions/method",
    permanent: true,
  },
];

module.exports = { launchRedirects };
