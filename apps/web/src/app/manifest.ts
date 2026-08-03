import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Turbo Notes",
    short_name: "Turbo Notes",
    description:
      "A private, thoughtfully organized notebook for capturing ideas and keeping them close.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#f7efdf",
    theme_color: "#f7efdf",
    categories: ["productivity", "utilities"],
    icons: [
      {
        src: "/icons/turbo-notes-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/turbo-notes-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
