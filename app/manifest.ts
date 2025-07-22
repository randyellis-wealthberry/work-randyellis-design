import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Randy Ellis - AI Product Design Engineer",
    short_name: "Randy Ellis",
    description: "AI Product Design Engineer specializing in generative AI, design systems, and product leadership. Portfolio showcasing innovative projects and design expertise.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#6366f1",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
    categories: ["design", "portfolio", "ai", "technology"],
    screenshots: [
      {
        src: "/screenshot-wide.png",
        sizes: "1280x720",
        type: "image/png",
        form_factor: "wide",
        label: "Randy Ellis Portfolio - Desktop View",
      },
      {
        src: "/screenshot-narrow.png",
        sizes: "390x844",
        type: "image/png",
        form_factor: "narrow",
        label: "Randy Ellis Portfolio - Mobile View",
      },
    ],
    lang: "en",
    dir: "ltr",
    scope: "/",
    id: "randy-ellis-portfolio",
    launch_handler: {
      client_mode: "auto",
    },
  };
}