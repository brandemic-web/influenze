import { defineField, defineType } from "sanity";

/** Repeatable inline CTA block for a post's rich-text `body` — drop it in
 * anywhere, any number of times. Every field is optional; a blank instance
 * renders ArticleInlineCta.astro's default copy. */
export default defineType({
	name: "articleCta",
	title: "Inline CTA",
	type: "object",
	fields: [
		defineField({
			name: "heading",
			title: "Heading",
			type: "string",
			description: 'Leave blank to use the default: "Ready to find your next creator?"',
		}),
		defineField({
			name: "subcopy",
			title: "Subcopy",
			type: "string",
			description: "Leave blank to use the default subcopy.",
		}),
		defineField({
			name: "buttonLabel",
			title: "Button label",
			type: "string",
			description: "Leave blank to use the default label.",
		}),
		defineField({
			name: "buttonHref",
			title: "Button link override",
			type: "url",
			description: "Leave blank to link to the app sign-up URL, same as every other CTA on the site.",
		}),
	],
	preview: {
		select: { title: "heading" },
		prepare: ({ title }) => ({ title: title || "Inline CTA (default copy)" }),
	},
});
