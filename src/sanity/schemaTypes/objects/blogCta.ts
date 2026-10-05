import { defineField, defineType } from "sanity";

/**
 * CTA block for a post's rich text. Every field is optional and falls back to the standard CTA in
 * src/data/blog-cta.ts; filling one in is an override, not the normal use.
 */
export default defineType({
	name: "blogCta",
	title: "Call to action",
	type: "object",
	fields: [
		defineField({
			name: "heading",
			title: "Heading",
			type: "string",
			description: "Leave blank to use the standard blog CTA heading.",
		}),
		defineField({
			name: "body",
			title: "Body",
			type: "text",
			rows: 2,
			description: "Leave blank to use the standard blog CTA copy.",
		}),
		defineField({
			name: "label",
			title: "Button label",
			type: "string",
			description: "Leave blank to use the standard button label.",
		}),
		defineField({
			name: "href",
			title: "Button link",
			type: "string",
			description:
				"An absolute URL (https://…) or a path on this site (/pricing). Leave blank to use the standard destination.",
		}),
		defineField({
			name: "newTab",
			title: "Open in a new tab",
			type: "boolean",
			description: "Turn on for links that leave the site.",
			initialValue: false,
		}),
	],
	preview: {
		select: { heading: "heading", label: "label" },
		prepare: ({ heading, label }) => ({
			title: heading || "Standard blog CTA",
			subtitle: label ? `Button: ${label}` : "Using the site's standard wording",
		}),
	},
});
