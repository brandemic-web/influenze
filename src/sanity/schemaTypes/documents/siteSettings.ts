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
	fieldsets: [
		{
			name: "identity",
			title: "Site identity & default SEO",
			options: { columns: 1 },
		},
		{
			name: "links",
			title: "Outbound links",
			options: { columns: 2 },
		},
	],
	fields: [
		defineField({
			name: "name",
			title: "Site name",
			type: "string",
			description: 'Used as og:site_name and the Organization schema name, e.g. "influenze.ai".',
			fieldset: "identity",
		}),
		defineField({
			name: "defaultTitle",
			title: "Default page title",
			type: "string",
			description: "Used on any page that doesn't set its own SEO title.",
			fieldset: "identity",
		}),
		defineField({
			name: "defaultDescription",
			title: "Default meta description",
			type: "text",
			rows: 3,
			fieldset: "identity",
		}),
		defineField({
			name: "defaultOgImage",
			title: "Default social share image",
			type: "image",
			options: { hotspot: true },
			fieldset: "identity",
		}),
		defineField({
			name: "signupUrl",
			title: "Sign up URL",
			type: "url",
			fieldset: "links",
		}),
		defineField({
			name: "loginUrl",
			title: "Login URL",
			type: "url",
			fieldset: "links",
		}),
		defineField({
			name: "scripts",
			title: "Global scripts",
			description: "Injected into every page, before any per-page scripts.",
			type: "customScripts",
		}),
	],
	preview: {
		prepare: () => ({ title: "Site Settings" }),
	},
});
