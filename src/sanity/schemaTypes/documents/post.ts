import { defineField, defineType } from "sanity";

/**
 * A blog article. Replaces the placeholder posts in src/data/blog.ts (see
 * that file's own header comment — it's deleted once every consumer of it
 * has moved over). Field order matches the article page top to bottom.
 */
export default defineType({
	name: "post",
	title: "Blog Post",
	type: "document",
	fields: [
		defineField({
			name: "categories",
			title: "Categories",
			type: "array",
			of: [{ type: "reference", to: [{ type: "category" }] }],
			validation: (Rule) => Rule.required().min(1),
		}),
		defineField({
			name: "publishedAt",
			title: "Published date",
			type: "datetime",
			initialValue: () => new Date().toISOString(),
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "readTimeOverride",
			title: "Read time override (minutes)",
			type: "number",
			description:
				"Leave blank to auto-compute from the body's word count. Set this only to correct an estimate that reads oddly for a body with lots of images or short blocks.",
			validation: (Rule) => Rule.min(1).integer(),
		}),
		defineField({
			name: "title",
			title: "Title (H1)",
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
		defineField({
			name: "excerpt",
			title: "Subtext / excerpt",
			type: "text",
			rows: 3,
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "cover",
			title: "Thumbnail image",
			type: "image",
			options: { hotspot: true },
			fields: [
				defineField({
					name: "alt",
					title: "Alt text",
					type: "string",
					validation: (Rule) => Rule.required(),
				}),
			],
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "featured",
			title: "Featured",
			type: "boolean",
			initialValue: false,
			description: "Drives the blog index's lead slot. Exactly one post should carry this.",
		}),
		defineField({
			name: "author",
			title: "Author",
			type: "reference",
			to: [{ type: "author" }],
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "body",
			title: "Body",
			type: "array",
			of: [
				{
					type: "block",
					styles: [
						{ title: "Normal", value: "normal" },
						{ title: "H2", value: "h2" },
						{ title: "H3", value: "h3" },
						{ title: "Quote", value: "blockquote" },
					],
					lists: [
						{ title: "Bullet", value: "bullet" },
						{ title: "Numbered", value: "number" },
					],
					marks: {
						decorators: [
							{ title: "Strong", value: "strong" },
							{ title: "Emphasis", value: "em" },
						],
						annotations: [
							{
								name: "link",
								type: "object",
								title: "Link",
								fields: [
									defineField({
										name: "href",
										title: "URL",
										type: "url",
										validation: (Rule) => Rule.required(),
									}),
								],
							},
						],
					},
				},
				{ type: "articleImage" },
				{ type: "articleCta" },
			],
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "qna",
			title: "Q&A",
			type: "array",
			of: [
				{
					type: "object",
					name: "qnaItem",
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
							rows: 3,
							validation: (Rule) => Rule.required(),
						}),
						defineField({
							name: "visible",
							title: "Visible",
							type: "boolean",
							initialValue: true,
							description: "Uncheck to keep an item drafted without publishing it on the article.",
						}),
					],
					preview: {
						select: { title: "question", subtitle: "answer" },
					},
				},
			],
		}),
	],
	preview: {
		select: { title: "title", subtitle: "excerpt", media: "cover" },
	},
});
