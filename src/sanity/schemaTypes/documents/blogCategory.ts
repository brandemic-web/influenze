import { defineField, defineType } from "sanity";

/**
 * A filter chip on /blog. Its own document so the rail can be reordered and
 * renamed without a deploy, and so a post points at a category rather than
 * repeating its name as a string.
 *
 * The slug is what the listing's markup and filter script exchange, so changing
 * it is safe but renaming the title is the cheaper edit — readers only ever see
 * the title. "All" is not a category here: the rail adds it itself, because it
 * is a view of the list rather than something a post can be filed under.
 */
export default defineType({
	name: "blogCategory",
	title: "Blog Category",
	type: "document",
	fields: [
		defineField({
			name: "title",
			title: "Title",
			type: "string",
			description: 'What the chip says, e.g. "Comparison Pages".',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "slug",
			title: "Slug",
			type: "slug",
			options: { source: "title", maxLength: 60 },
			description: "Used internally by the filter. Generated from the title.",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "order",
			title: "Order",
			type: "number",
			description: "Lowest first. Sets where the chip sits in the rail.",
			initialValue: 0,
		}),
	],
	orderings: [
		{
			name: "orderAsc",
			title: "Rail order",
			by: [{ field: "order", direction: "asc" }],
		},
	],
	preview: {
		select: { title: "title", subtitle: "slug.current" },
	},
});
