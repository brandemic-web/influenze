// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from "vite";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import sanity from "@sanity/astro";

import react from "@astrojs/react";

import cloudflare from "@astrojs/cloudflare";

// astro.config.mjs runs before Astro loads .env into process.env, so the
// Sanity project ID has to be read explicitly here.
const env = loadEnv(process.env.NODE_ENV ?? "development", process.cwd(), "PUBLIC_");
const siteOrigin = env.PUBLIC_SITE_ORIGIN ?? "http://localhost:1234";

// https://astro.build/config
export default defineConfig({
  site: "https://influenze.ai",
  // Static: every page is built once and served as a file. Content changes
  // reach the site by a rebuild (Sanity's publish webhook triggers deploy.yml),
  // so there is no per-visit Sanity fetch. Routes that must run per request
  // opt out with `export const prerender = false` — the draft-mode API and /qc.
  // Live draft preview on the production site is given up for this; editors
  // did not use it.

  // /sitemap.xml is now a route (src/pages/sitemap.xml.ts): it checks Site
  // Settings for a custom upload before falling back to the auto-generated one.

  integrations: [sitemap({
      // Neither is a public page: /qc 404s on production, /studio is the CMS.
      filter: (page) => !/\/(studio|qc)\/?$/.test(page),
  }), sanity({
      projectId: env.PUBLIC_SANITY_PROJECT_ID,
      dataset: env.PUBLIC_SANITY_DATASET ?? "production",
      // Studio is embedded at /studio (see sanity.config.ts) rather than
      // mounted by this integration, so content authors get one deploy.
      useCdn: false,
      studioBasePath: "/studio",
      // Stega (the invisible edit-link encoding behind click-to-edit) needs
      // to know where the Studio lives to build those links.
      stega: { studioUrl: `${siteOrigin}/studio` },
  }), react()],

  server: {
      port: 1234,
  },

  // Astro's dev-only toolbar (the floating icon cluster bottom-left in
  // `astro dev`) — off by request, unrelated to Sanity.
  devToolbar: {
      enabled: false,
  },

  vite: {
      plugins: [tailwindcss()],
      // CJS modules the Sanity visual-editing chain imports (via
      // @sanity/mutate, for live document patches, and @sanity/ui) that
      // Vite's dep optimizer otherwise mis-bundles for their consumers'
      // named/default imports, breaking the client-side VisualEditing
      // island at hydration. The lodash/* list is every submodule that
      // scope imports (`grep -rohE 'lodash/[a-zA-Z]+\.js' node_modules/@sanity`).
      optimizeDeps: {
          include: [
              "lodash/deburr.js",
              "lodash/groupBy.js",
              "lodash/isObject.js",
              "lodash/keyBy.js",
              "lodash/partition.js",
              "lodash/sortedIndex.js",
              "lodash/startCase.js",
          ],
      },
      resolve: {
          alias: {
              // react/compiler-runtime.js re-exports one of two files behind
              // an `if (NODE_ENV === 'production')` branch. That conditional
              // defeats esbuild/rolldown's static named-export detection for
              // CJS, so `c` gets dropped no matter what's in
              // optimizeDeps.include — aliasing straight to the concrete
              // file for the current mode (a plain `exports.c = ...`, no
              // conditional) fixes the detection. Has to match the mode: the
              // dev file's body is itself wrapped in a
              // `"production" !== process.env.NODE_ENV && (...)` guard that
              // evaluates to nothing during a production build, so aliasing
              // to it unconditionally silently breaks the built site.
              // An absolute path, not a bare specifier: react's own
              // `exports` map doesn't list `./cjs/*`, so resolving it as a
              // package subpath gets rejected before the alias even helps.
              "react/compiler-runtime": fileURLToPath(
                  new URL(
                      `./node_modules/react/cjs/react-compiler-runtime.${process.env.NODE_ENV === "production" ? "production" : "development"}.js`,
                      import.meta.url,
                  ),
              ),
          },
      },
  },

  // "compile" runs sharp at build time. The default, "cloudflare-binding",
  // transforms at request time and — with no `q` in the URL — returns lossless
  // WebP, which made every image roughly 7x its lossy size.
  adapter: cloudflare({ imageService: "compile" }),
});