import { themeColors } from "@pickeed/ui";
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Pickeed",
    short_name: "Pickeed",
    lang: "de-CH",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: themeColors.light,
    theme_color: themeColors.light,
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}
