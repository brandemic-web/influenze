import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { getSiteSettings } from "../sanity/lib/queries";

export const prerender = false;

// Falls back to the @astrojs/sitemap-generated sitemap when no custom one is
// uploaded. @astrojs/sitemap always wraps its output in an index file, even
// for the single sub-sitemap this site has, so that sub-sitemap's content is
// served here directly — /sitemap.xml must be the canonical 200, not a
// redirect to /sitemap-index.xml. If the page count ever grows enough that
// @astrojs/sitemap splits into more than one sub-sitemap, this needs to serve
// /sitemap-index.xml instead.
export const GET: APIRoute = async ({ url }) => {
	const { data: siteSettings } = await getSiteSettings();

	if (siteSettings?.sitemapFileUrl) {
		const uploaded = await fetch(siteSettings.sitemapFileUrl);
		if (uploaded.ok) {
			return new Response(await uploaded.text(), {
				headers: { "Content-Type": "application/xml; charset=utf-8" },
			});
		}
	}

	const generated = await env.ASSETS.fetch(new URL("/sitemap-0.xml", url));
	return new Response(await generated.text(), {
		headers: { "Content-Type": "application/xml; charset=utf-8" },
	});
};
