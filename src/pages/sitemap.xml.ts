import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { getSiteSettings } from "../sanity/lib/queries";

export const prerender = false;

// A Sanity upload replaces the generated main-pages sitemap. The generated one
// is a static file at this same path (see astro.config.mjs); wrangler.jsonc's
// run_worker_first sends requests here first so the upload can win.
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

	const generated = await env.ASSETS.fetch(new URL("/sitemap.xml", url));
	return new Response(await generated.text(), {
		headers: { "Content-Type": "application/xml; charset=utf-8" },
	});
};
