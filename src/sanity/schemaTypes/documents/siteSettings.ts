import { defineField, defineType } from "sanity";

/**
 * Singleton — one document holds site-wide identity, default SEO, and the
 * outbound URLs currently hardcoded in src/data/site.ts. The Studio's
 * structure builder pins this to a single non-deletable entry.
 */
export default defineType({
	name: "siteSettings",
	title: "Site Settings",
	type: "document",
	fields: [
		defineField({
			name: "name",
			title: "Site name",
			type: "string",
			description: 'Used as og:site_name and the Organization schema name, e.g. "influenze.ai".',
		}),
		defineField({
			name: "defaultTitle",
			title: "Default page title",
			type: "string",
			description: "Used on any page that doesn't set its own SEO title.",
		}),
		defineField({
			name: "defaultDescription",
			title: "Default meta description",
			type: "text",
			rows: 3,
		}),
		defineField({
			name: "defaultOgImage",
			title: "Default social share image",
			type: "image",
			options: { hotspot: true },
		}),
		defineField({
			name: "signupUrl",
			title: "Sign up URL",
			type: "url",
		}),
		defineField({
			name: "loginUrl",
			title: "Login URL",
			type: "url",
		}),
	],
	preview: {
		prepare: () => ({ title: "Site Settings" }),
	},
});
