const launchRedirects = [
  { source: '/lcaa', destination: '/method', permanent: true },
  { source: '/wiki/new', destination: '/wiki', permanent: true },
  { source: '/engine', destination: '/admin/engine', permanent: true },
  { source: '/image-picker', destination: '/admin/image-picker', permanent: true },
  { source: '/media-lab', destination: '/admin/media-lab', permanent: true },
  { source: '/wiki/source-packets', destination: '/admin/source-packets', permanent: true },
  { source: '/wiki/source-bridges', destination: '/admin/source-bridges', permanent: true },

  // Legacy public-site routes.
  { source: '/seeds', destination: '/projects', permanent: true },
  { source: '/action', destination: '/projects', permanent: true },
  { source: '/germinating', destination: '/stories', permanent: true },
  { source: '/news', destination: '/blog', permanent: true },
  { source: '/journal', destination: '/blog', permanent: true },
  { source: '/year-in-review', destination: '/stories', permanent: true },
  { source: '/2025-review', destination: '/stories', permanent: true },

  // Canonical slug renames, 2026-04-23.
  { source: '/projects/diagrama-spain', destination: '/projects/diagrama', permanent: true },
  { source: '/projects/bg-fit-mount-isa', destination: '/projects/bg-fit', permanent: true },
  { source: '/projects/smart-hcp-gp-uplift', destination: '/projects/smart-hcp-uplift', permanent: true },
  { source: '/projects/pakkinjalki-kari', destination: '/projects/pakkimjalki-kari', permanent: true },
  { source: '/projects/goods-on-country', destination: '/goods', permanent: true },
  { source: '/goods-on-country', destination: '/goods', permanent: true },
  { source: '/projects/the-harvest', destination: '/harvest', permanent: true },
  { source: '/projects/empathy-ledger', destination: '/empathy-ledger', permanent: true },
  { source: '/projects/justicehub', destination: '/justicehub', permanent: true },
  { source: '/projects/goods', destination: '/goods', permanent: true },
  { source: '/projects/black-cockatoo-valley', destination: '/farm', permanent: true },

  // Deleted or demoted entries redirect to parent context.
  { source: '/projects/green-harvest-witta', destination: '/harvest', permanent: true },
  { source: '/projects/project-her-self', destination: '/projects', permanent: true },
  { source: '/projects/act-monthly-dinners', destination: '/events', permanent: true },
  { source: '/projects/10x10-retreat', destination: '/events', permanent: true },
  { source: '/projects/westpac-summit-2025', destination: '/events', permanent: true },
  { source: '/projects/bupa-tfn-pitch', destination: '/events', permanent: true },
  { source: '/projects/naidoc-week-mount-isa', destination: '/events', permanent: true },
  { source: '/projects/dad-lab-25', destination: '/events', permanent: true },
  { source: '/projects/anat-spectra-2025', destination: '/events', permanent: true },
  { source: '/projects/cars-and-microcontrollers', destination: '/events', permanent: true },
  { source: '/projects/global-laundry-alliance', destination: '/events', permanent: true },

  // Launch holds (2026-05-27) — temporary, reverse when each surface is ready.
  // Kept as 307s (permanent: false) so engines don't cache them and the routes
  // can return cleanly. Mirror any change here in src/app/sitemap.ts and the
  // launchRoutes list in scripts/check-launch-site.mjs.
  // - /storytellers: held until more than one consented profile is syndicated.
  // - /ask: public AI Q&A held for a later phase (cost/safety/injection review).
  // - /wiki: living wiki is a longer build; held until it is ready.
  // - /people: held 2026-05-29 (internal research notes were leaking into public
  //   bios from the Empathy Ledger data); sanitize the bio source before reopening.
  { source: '/storytellers', destination: '/stories', permanent: false },
  { source: '/storytellers/:slug*', destination: '/stories', permanent: false },
  { source: '/ask', destination: '/projects', permanent: false },
  { source: '/wiki', destination: '/projects', permanent: false },
  { source: '/wiki/:slug*', destination: '/projects', permanent: false },
  { source: '/people', destination: '/about', permanent: false },

  // Project holds (2026-05-27) — not-ready / internal pages held off the public
  // launch. 307s (permanent: false) so they reverse cleanly when each is ready.
  // This is the single source of truth: a hold here removes the project from the
  // page (redirect), the public count, the sitemap, the /projects index, the
  // homepage mosaic, and related-projects (see heldProjectSlugs in public-projects).
  { source: '/projects/act-infrastructure', destination: '/projects', permanent: false },
  { source: '/projects/custodian-first-economy', destination: '/projects', permanent: false },
  { source: '/projects/facilitation', destination: '/projects', permanent: false },
  { source: '/projects/grantscope', destination: '/projects', permanent: false },
  { source: '/projects/minderoo-pitch-package', destination: '/projects', permanent: false },
  { source: '/projects/three-circles', destination: '/projects', permanent: false },
  { source: '/projects/the-full-idea', destination: '/projects', permanent: false },
  { source: '/projects/annual-field-service', destination: '/projects', permanent: false },
];

module.exports = { launchRedirects };
