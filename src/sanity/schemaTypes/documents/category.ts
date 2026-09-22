import { defineField, defineType } from "sanity";

/** A blog category, referenced from `post`. Deliberately minimal — no
 * archive/index page reads this yet, just the post's own category pills. */
export default defineType({
	name: "category",
	title: "Blog Category",
	type: "document",
	fields: [
		defineField({
			name: "title",
			title: "Name",
			type: "string",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "slug",
			title: "Slug",
			type: "slug",
			options: { source: "title" },
			validation: (Rule) => Rule.required(),
		}),
	],
	preview: {
		select: { title: "title" },
	},
});
