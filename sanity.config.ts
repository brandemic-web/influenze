import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { presentationTool, defineDocuments, defineLocations } from "sanity/presentation";
import { schemaTypes } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET ?? "production";

// The site itself, so Presentation can iframe it for click-to-edit preview.
// Points at the dev server locally; set PUBLIC_SITE_ORIGIN in production.
const siteOrigin = import.meta.env.PUBLIC_SITE_ORIGIN ?? "http://localhost:1234";

// Each singleton maps to the one route that renders it, so picking a document
// in Presentation jumps the preview straight to the right page.
const DOCUMENT_ROUTES: Record<string, { title: string; href: string }> = {
	homePage: { title: "Home Page", href: "/" },
	pricingPage: { title: "Pricing Page", href: "/pricing" },
	featuresPage: { title: "Features Page", href: "/features" },
	blogIndex: { title: "Blog Index", href: "/blog" },
	siteSettings: { title: "Site Settings", href: "/" },
};

export default defineConfig({
	name: "influenze",
	title: "Influenze.ai",
	projectId,
	dataset,
	// The Studio's base path is set via astro.config.mjs's studioBasePath
	// instead — @sanity/astro ignores this one and warns if it's set here too.
	plugins: [
		structureTool({ structure }),
		presentationTool({
			previewUrl: {
				initial: siteOrigin,
				previewMode: {
					enable: "/api/draft-mode/enable",
					disable: "/api/draft-mode/disable",
				},
			},
			resolve: {
				// Maps each route straight to its document by type, so Presentation
				// can find and live-refresh a singleton even before it has content.
				// Blog posts are the one many-document route, matched on the slug.
				mainDocuments: defineDocuments([
					...Object.entries(DOCUMENT_ROUTES).map(([type, { href }]) => ({
						route: href,
						type,
					})),
					{
						route: "/blog/:slug",
						filter: `_type == "blogPost" && slug.current == $slug`,
					},
				]),
				/*
				 * A record rather than one function, because a blog post's location
				 * depends on its own slug — the function form is only handed the
				 * document's type and id, with no way to read a field off it.
				 */
				locations: {
					// A singleton's location never varies, so it is stated outright
					// rather than resolved from the document.
					...Object.fromEntries(
						Object.entries(DOCUMENT_ROUTES).map(([type, route]) => [
							type,
							{ locations: [route] },
						]),
					),
					blogPost: defineLocations({
						select: { title: "title", slug: "slug.current" },
						resolve: (doc) =>
							doc?.slug
								? {
										locations: [
											{ title: doc.title ?? "Untitled post", href: `/blog/${doc.slug}` },
											{ title: "Blog Index", href: "/blog" },
										],
									}
								: null,
					}),
				},
			},
		}),
		visionTool(),
	],
	schema: { types: schemaTypes },
});
