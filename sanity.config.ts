import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { presentationTool } from "sanity/presentation";
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
				locations: (params) => {
					const route = DOCUMENT_ROUTES[params.type];
					if (!route) return undefined;
					return { locations: [route] };
				},
			},
		}),
		visionTool(),
	],
	schema: { types: schemaTypes },
});
