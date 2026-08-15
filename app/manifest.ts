import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Randy Ellis - AI Product Design Engineer",
    short_name: "Randy Ellis",
    description:
      "AI Product Design Engineer specializing in generative AI, design systems, and product leadership. Portfolio showcasing innovative projects and design expertise.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
    categories: ["design", "portfolio", "ai", "technology"],
    lang: "en",
    dir: "ltr",
    scope: "/",
    id: "randy-ellis-portfolio",
    launch_handler: {
      client_mode: "auto",
    },
  };
}
