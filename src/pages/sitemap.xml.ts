import type { APIRoute } from "astro";
import { getSiteSettings } from "../sanity/lib/queries";

export const prerender = false;

// Falls back to the @astrojs/sitemap-generated /sitemap-index.xml when no
// custom sitemap is uploaded.
export const GET: APIRoute = async ({ redirect }) => {
	const { data: siteSettings } = await getSiteSettings();

	if (siteSettings?.sitemapFileUrl) {
		const uploaded = await fetch(siteSettings.sitemapFileUrl);
		if (uploaded.ok) {
			return new Response(await uploaded.text(), {
				headers: { "Content-Type": "application/xml; charset=utf-8" },
			});
		}
	}

	return redirect("/sitemap-index.xml", 302);
};
