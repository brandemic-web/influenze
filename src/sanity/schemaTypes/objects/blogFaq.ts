import { defineField, defineType } from "sanity";

/** One question and answer in a post's FAQ. Also feeds the page's FAQPage JSON-LD. */
export default defineType({
	name: "blogFaq",
	title: "FAQ",
	type: "object",
	fields: [
		defineField({
			name: "question",
			title: "Question",
			type: "string",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "answer",
			title: "Answer",
			type: "text",
			rows: 4,
			description: "Plain text — this is also what search engines read from the page's FAQ schema.",
			validation: (Rule) => Rule.required(),
		}),
	],
	preview: {
		select: { title: "question", subtitle: "answer" },
	},
});
