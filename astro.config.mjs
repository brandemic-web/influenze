// @ts-check
import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import sanity from "@sanity/astro";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import { readFile, rename, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { loadEnv } from "vite";

// astro.config.mjs runs before Astro loads .env into process.env, so the
// Sanity project ID has to be read explicitly here.
const env = loadEnv(process.env.NODE_ENV ?? "development", process.cwd(), "PUBLIC_");
const siteOrigin = env.PUBLIC_SITE_ORIGIN ?? "http://localhost:1234";

/// The SEO landing pages: one page per competitor, audience, feature, platform and pricing guide.
const isLandingPage = (/** @type {string} */ url) =>
  /\/(alternatives|comparison|features|icp|platforms|pricing)\/[^/]+\/?$/.test(new URL(url).pathname);
/// Neither is a public page: /qc 404s on production, /studio is the CMS.
const isPrivatePage = (/** @type {string} */ url) => /\/(studio|qc)\/?$/.test(url);

/// Filled by the sitemap filter, so these URLs match @astrojs/sitemap's exactly.
/** @type {string[]} */
const mainPageUrls = [];

/// Renames the landing-page sitemap to /lp-sitemap.xml and writes the rest to /sitemap.xml; must run after @astrojs/sitemap.
/** @returns {import("astro").AstroIntegration} */
function mainPagesSitemap() {
  const escapeXml = (/** @type {string} */ s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return {
    name: "main-pages-sitemap",
    hooks: {
      "astro:build:done": async ({ dir }) => {
        const urls = [...new Set(mainPageUrls)].map((u) => `<url><loc>${escapeXml(u)}</loc></url>`).join("");
        const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
        await writeFile(new URL("sitemap.xml", dir), xml);

        await rename(new URL("sitemap-0.xml", dir), new URL("lp-sitemap.xml", dir));
        const indexFile = new URL("sitemap-index.xml", dir);
        const index = await readFile(indexFile, "utf8");
        await writeFile(indexFile, index.replace("/sitemap-0.xml<", "/lp-sitemap.xml<"));
      },
    },
  };
}

// https://astro.build/config
export default defineConfig({
  site: "https://influenze.ai",
  // Static: every page is built once and served as a file. Content changes
  // reach the site by a rebuild (Sanity's publish webhook triggers deploy.yml),
  // so there is no per-visit Sanity fetch. Routes that must run per request
  // opt out with `export const prerender = false` — the draft-mode API and /qc.
  // Live draft preview on the production site is given up for this; editors
  // did not use it.

  // Two sitemaps under /sitemap-index.xml: landing pages in /lp-sitemap.xml,
  // every other page in /sitemap.xml (written by mainPagesSitemap below and
  // served through src/pages/sitemap.xml.ts, which honours a Sanity upload).

  integrations: [sitemap({
      filter: (page) => {
          if (isLandingPage(page)) return true;
          if (!isPrivatePage(page)) mainPageUrls.push(page);
          return false;
      },
      customSitemaps: ["https://influenze.ai/sitemap.xml"],
  }), mainPagesSitemap(), sanity({
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
              // Every package the page scripts import, pre-bundled up front:
              // found on first page load instead, one makes Vite re-optimize
              // mid-session, which strands the Cloudflare dev runner on deps that
              // no longer exist (500 on every page until a restart).
              "gsap",
              "gsap/ScrollTrigger",
              "gsap/SplitText",
              "swiper",
              "swiper/modules",
          ],
      },
      // The server side of the same problem: a package first imported at request
      // time (the draft-mode API loads @sanity/preview-url-secret when Studio
      // opens) re-optimizes deps_ssr and strands the Cloudflare runner — 500 on
      // every page until restart. Everything server code imports is listed here.
      ssr: {
          optimizeDeps: {
              include: [
                  "@sanity/client",
                  "@sanity/image-url",
                  "@sanity/preview-url-secret",
                  "@sanity/preview-url-secret/constants",
                  "groq",
                  "astro/logger/json",
              ],
          },
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