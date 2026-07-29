import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "A Curious Tractor",
    short_name: "ACT",
    description:
      "A regenerative innovation studio stewarding a farm on Jinibara Country.",
    start_url: "/",
    display: "standalone",
    background_color: "#F6F1E7",
    theme_color: "#4F6C3A",
    icons: [
      {
        src: "/branding/act/act-mark-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/branding/act/act-mark-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
