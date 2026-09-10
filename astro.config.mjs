// @ts-check
import { defineConfig } from "astro/config";
import netlify from "@astrojs/netlify";
import sitemap from "@astrojs/sitemap";

// Production domain. Override with PUBLIC_SITE_URL for branch previews if needed.
const SITE = process.env.PUBLIC_SITE_URL ?? "https://www.mercfund.com";

// https://astro.build/config
export default defineConfig({
  site: SITE,
  output: "static",
  adapter: netlify(),
  integrations: [sitemap()],
});
