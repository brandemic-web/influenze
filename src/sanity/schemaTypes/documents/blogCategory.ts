import { defineField, defineType } from "sanity";

/**
 * A filter chip on /blog, its own document so the rail can be reordered without a deploy.
 * "All" is not a category here: the rail adds it itself.
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
