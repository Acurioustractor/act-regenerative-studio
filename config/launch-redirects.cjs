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
  { source: '/projects/goods-on-country', destination: '/goods', permanent: true },
  { source: '/goods-on-country', destination: '/goods', permanent: true },
  { source: '/projects/the-harvest', destination: '/harvest', permanent: true },
  { source: '/projects/empathy-ledger', destination: '/empathy-ledger', permanent: true },
  { source: '/projects/justicehub', destination: '/justicehub', permanent: true },

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
];

module.exports = { launchRedirects };
