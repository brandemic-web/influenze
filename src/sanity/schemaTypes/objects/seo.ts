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
			description: "Adds a noindex tag so search engines don't list this page. Leave off for anything that should be found on Google.",
		}),
		defineField({
			name: "canonicalUrl",
			title: "Canonical URL override",
			type: "url",
			description:
				"Overrides the canonical URL this page reports to search engines. Leave this blank almost always — it defaults to the page's own address. Only set it when this content is a duplicate/syndicated copy that should point search engines at another URL instead.",
		}),
	],
});
