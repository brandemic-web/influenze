import { defineField, defineType } from "sanity";

/**
 * One entry in the header nav. Either a plain link, or — when Dropdown links
 * has at least one entry — a "▾" menu button instead (its own href/newTab are
 * ignored in that case).
 */
export default defineType({
	name: "navItem",
	title: "Nav Item",
	type: "object",
	fields: [
		defineField({
			name: "label",
			title: "Label",
			type: "string",
			description: "The visible nav text.",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "href",
			title: "URL",
			type: "string",
			description: 'Where the link goes — an internal path like "/features", or a full external address. Ignored if this item has Dropdown links below.',
		}),
		defineField({
			name: "newTab",
			title: "Open in a new tab",
			type: "boolean",
			initialValue: false,
			description: "Turn on for links that leave the site. Leave off for pages on influenze.ai.",
		}),
		defineField({
			name: "hidden",
			title: "Hide this item",
			type: "boolean",
			initialValue: false,
			description: "Removes this item from the live nav without deleting it.",
		}),
		defineField({
			name: "badge",
			title: "Badge text",
			type: "string",
			description: 'Small highlighted label shown next to the nav text, e.g. "DotMe". Leave blank for none.',
		}),
		defineField({
			name: "dropdown",
			title: "Dropdown links",
			type: "array",
			of: [{ type: "linkItem" }],
			description: "Add links here to turn this item into a dropdown menu instead of a direct link.",
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
