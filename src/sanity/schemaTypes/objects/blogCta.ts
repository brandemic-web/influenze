import { defineField, defineType } from "sanity";

/**
 * The call-to-action an author can drop into the middle of a post's rich text.
 *
 * Every field is optional and falls back to the site's standard blog CTA
 * (src/data/blog-cta.ts), because the blog deliberately runs one CTA with one
 * set of words everywhere — see the note in components/blog/BlogCta.astro.
 * Filling these in is an override for a post that genuinely needs its own, not
 * the normal way to use this.
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
