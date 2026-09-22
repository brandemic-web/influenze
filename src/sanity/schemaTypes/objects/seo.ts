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
				"A complete JSON-LD document — e.g. { \"@context\": \"https://schema.org\", \"@graph\": [...] } — that REPLACES the automatically generated structured data on this page entirely (Organization, WebSite, WebPage and any page-specific nodes are not included alongside it). Leave blank to keep the auto-generated schema.",
			validation: (Rule) =>
				Rule.custom((value) => {
					if (!value) return true;
					try {
						const parsed = JSON.parse(value);
						return (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) ||
							"Must be a JSON object, e.g. { \"@context\": \"https://schema.org\", \"@graph\": [...] }.";
					} catch {
						return "Not valid JSON.";
					}
				}),
		}),
	],
});
