import type { MetadataRoute } from "next";

/**
 * Web App Manifest — makes CVeed installable ("Add to Home Screen") and lets it
 * open fullscreen like a native app, with a name, icon, and brand colour.
 * Next.js auto-injects the <link rel="manifest"> for this file.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CVeed — AI Talent Discovery",
    short_name: "CVeed",
    description: "The AI recruiter for SMEs. Build a profile once; describe who you need; AI does the matching.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#4f46e5",
    icons: [
      { src: "/icon", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
