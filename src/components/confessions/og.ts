/**
 * The share card the Confessions pages name as their picture: the hook card, rendered by src/app/confessions/opengraph-image.tsx.
 * pageMetadata passes `images: undefined` when it is given no image, and in that case Next did not add the file-based
 * image to the page's tags (checked on /confessions in dev), so the pages name it themselves.
 */
export const confessionsShareImage = {
  url: "/confessions/opengraph-image",
  alt: "Confessions to Philanthropy: call the gold phone",
  width: 1200,
  height: 630,
};
