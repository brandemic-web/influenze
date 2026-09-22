import { defineField, defineType } from "sanity";

/** An in-body figure for a post's rich-text `body` — renders as
 * `<figure><img/><figcaption/></figure>`, already styled in article.css. */
export default defineType({
	name: "articleImage",
	title: "Image",
	type: "object",
	fields: [
		defineField({
			name: "image",
			title: "Image",
			type: "image",
			options: { hotspot: true },
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "alt",
			title: "Alt text",
			type: "string",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "caption",
			title: "Caption",
			type: "string",
			description: "Optional — rendered as the figure's caption. Leave blank to omit it.",
		}),
	],
	preview: {
		select: { title: "caption", media: "image" },
		prepare: ({ title, media }) => ({ title: title || "Image", media }),
	},
});
