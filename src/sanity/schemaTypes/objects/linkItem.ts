import { defineField, defineType } from "sanity";

/** One link — reused inside nav dropdowns and every footer column. */
export default defineType({
	name: "linkItem",
	title: "Link",
	type: "object",
	fields: [
		defineField({
			name: "label",
			title: "Label",
			type: "string",
			description: "The visible link text.",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "href",
			title: "URL",
			type: "string",
			description: 'Where the link goes — an internal path like "/pricing", or a full external address like "https://example.com".',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "newTab",
			title: "Open in a new tab",
			type: "boolean",
			initialValue: false,
			description: "Turn on for links that leave the site (e.g. a partner site). Leave off for pages on influenze.ai.",
		}),
		defineField({
			name: "hidden",
			title: "Hide this link",
			type: "boolean",
			initialValue: false,
			description: "Removes this link from the live site without deleting it — turn it back on to bring it back.",
		}),
	],
	preview: {
		select: { title: "label", subtitle: "href", hidden: "hidden" },
		prepare: ({ title, subtitle, hidden }) => ({
			title: hidden ? `${title} (hidden)` : title,
			subtitle,
		}),
	},
});
