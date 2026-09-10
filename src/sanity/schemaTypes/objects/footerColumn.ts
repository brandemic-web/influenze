import { defineField, defineType } from "sanity";

/** One column of links in the footer, e.g. "Quick Links" or "Legal". */
export default defineType({
	name: "footerColumn",
	title: "Footer Column",
	type: "object",
	fields: [
		defineField({
			name: "title",
			title: "Column heading",
			type: "string",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "hidden",
			title: "Hide this column",
			type: "boolean",
			initialValue: false,
			description: "Removes the whole column from the live footer without deleting it — useful while its links aren't ready yet.",
		}),
		defineField({
			name: "links",
			title: "Links",
			type: "array",
			of: [{ type: "linkItem" }],
			validation: (Rule) => Rule.min(1),
		}),
	],
	preview: {
		select: { title: "title", hidden: "hidden", links: "links" },
		prepare: ({ title, hidden, links }) => ({
			title: hidden ? `${title} (hidden)` : title,
			subtitle: `${(links ?? []).length} link(s)`,
		}),
	},
});
