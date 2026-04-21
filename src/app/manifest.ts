import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "A Curious Tractor",
    short_name: "ACT",
    description:
      "A regenerative innovation studio stewarding a working farm on Jinibara Country.",
    start_url: "/",
    display: "standalone",
    background_color: "#F6F1E7",
    theme_color: "#4F6C3A",
    icons: [
      {
        src: "/branding/act-logo-square.png",
        sizes: "any",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
