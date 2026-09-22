import { defineField, defineType } from "sanity";

/**
 * Reusable SEO block — dropped into every page document. Fields are optional
 * everywhere so a page can inherit the site defaults (see siteSettings) by
 * leaving them blank.
 */
export default defineType({
	name: "seo",
	title: "SEO",
	type: "object",
	fields: [
		defineField({
			name: "title",
			title: "Page title",
			type: "string",
			description: "Falls back to the site default title if left blank.",
		}),
		defineField({
			name: "description",
			title: "Meta description",
			type: "text",
			rows: 3,
			validation: (Rule) => Rule.max(160).warning("Longer than ~160 characters gets truncated in search results."),
		}),
		defineField({
			name: "ogImage",
			title: "Social share image",
			type: "image",
			description: "Shown when this page is shared on social/chat apps. Falls back to the site default.",
			options: { hotspot: true },
		}),
		defineField({
			name: "noindex",
			title: "Hide from search engines",
			type: "boolean",
			initialValue: false,
		}),
		defineField({
			name: "canonicalUrl",
			title: "Canonical URL",
			type: "url",
			description: "Overrides the auto-generated canonical URL. Leave blank to use this page's own URL.",
		}),
		defineField({
			name: "customSchema",
			title: "Custom structured data (JSON-LD)",
			type: "text",
			rows: 6,
			description:
				"A raw JSON array of extra schema.org nodes for this page, merged into the site's JSON-LD graph. Must be valid JSON — e.g. [{ \"@type\": \"Product\", ... }].",
			validation: (Rule) =>
				Rule.custom((value) => {
					if (!value) return true;
					try {
						const parsed = JSON.parse(value);
						return Array.isArray(parsed) || "Must be a JSON array, e.g. [{ ... }].";
					} catch {
						return "Not valid JSON.";
					}
				}),
		}),
	],
});
