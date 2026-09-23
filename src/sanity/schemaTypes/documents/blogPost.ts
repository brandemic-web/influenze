import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * One blog post — one page at /blog/<slug>, listed on /blog.
 *
 * The body is a single rich-text field rather than a list of typed sections:
 * authors write prose, and the two things that are not prose — a call to action
 * and the FAQ — are handled separately. The CTA is an insertable block inside
 * the rich text (Insert → Call to action), so it can sit between two paragraphs;
 * the FAQ is its own field at the end, because it always renders as the same
 * section in the same place.
 *
 * Headings: use Heading 2 for the sections that should appear in the contents
 * rail, Heading 3 for sub-points inside them. The rail is built from the H2s
 * automatically — there is no separate list of sections to keep in step.
 */
export default defineType({
	name: "blogPost",
	title: "Blog Post",
	type: "document",
	groups: [
		{ name: "content", title: "Content", default: true },
		{ name: "meta", title: "Byline & Filing" },
		{ name: "faq", title: "FAQ" },
		{ name: "seo", title: "SEO" },
	],
	fields: [
		defineField({
			name: "title",
			title: "Title",
			type: "string",
			group: "content",
			description: "The headline on the page (its H1) and on the listing card.",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "slug",
			title: "Slug",
			type: "slug",
			group: "content",
			options: { source: "title", maxLength: 96 },
			description: "The page's address: /blog/<slug>. Changing it breaks existing links.",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "excerpt",
			title: "Excerpt",
			type: "text",
			rows: 3,
			group: "content",
			description:
				"The summary under the title, and on the listing card. Also the meta description unless SEO → Meta description is filled in.",
			validation: (Rule) =>
				Rule.max(200).warning("Longer than ~200 characters gets clipped on the listing card."),
		}),
		defineField({
			name: "hero",
			title: "Hero image",
			type: "image",
			group: "content",
			options: { hotspot: true },
			description:
				"Shown beside the title, and on the listing card. Cropped to 784×457 — upload at least 1568×914 so it stays sharp.",
			fields: [
				defineField({
					name: "alt",
					title: "Alt text",
					type: "string",
					description:
						"What the image shows, for screen readers. Leave blank if it is decorative and adds nothing to the words.",
				}),
			],
		}),
		defineField({
			name: "body",
			title: "Body",
			type: "array",
			group: "content",
			description:
				"The article. Heading 2 marks a section and puts it in the contents rail; Heading 3 is a sub-point. Use Insert → Call to action to drop the CTA between paragraphs.",
			of: [
				defineArrayMember({
					type: "block",
					styles: [
						{ title: "Normal", value: "normal" },
						{ title: "Heading 2 (section)", value: "h2" },
						{ title: "Heading 3 (sub-point)", value: "h3" },
						{ title: "Quote", value: "blockquote" },
					],
					lists: [
						{ title: "Bulleted", value: "bullet" },
						{ title: "Numbered", value: "number" },
					],
					marks: {
						decorators: [
							{ title: "Bold", value: "strong" },
							{ title: "Italic", value: "em" },
						],
						annotations: [
							{
								name: "link",
								title: "Link",
								type: "object",
								fields: [
									defineField({
										name: "href",
										title: "URL",
										type: "string",
										description: "https://… for another site, or /pricing for a page on this one.",
										validation: (Rule) => Rule.required(),
									}),
									defineField({
										name: "newTab",
										title: "Open in a new tab",
										type: "boolean",
										initialValue: false,
									}),
								],
							},
						],
					},
				}),
				defineArrayMember({ type: "blogCta", title: "Call to action" }),
				defineArrayMember({
					type: "image",
					title: "Image",
					options: { hotspot: true },
					fields: [
						defineField({ name: "alt", title: "Alt text", type: "string" }),
						defineField({ name: "caption", title: "Caption", type: "string" }),
					],
				}),
			],
		}),

		defineField({
			name: "author",
			title: "Author",
			type: "reference",
			group: "meta",
			to: [{ type: "blogAuthor" }],
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "category",
			title: "Category",
			type: "reference",
			group: "meta",
			to: [{ type: "blogCategory" }],
			description: "Which chip on the listing's filter rail this post appears under.",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "publishedAt",
			title: "Published on",
			type: "date",
			group: "meta",
			options: { dateFormat: "D MMMM YYYY" },
			description: "The date shown on the byline, and the order posts are listed in.",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "readMinutes",
			title: "Read time (minutes)",
			type: "number",
			group: "meta",
			description: 'Shown on the byline as "N min read".',
			validation: (Rule) => Rule.min(1).integer(),
		}),

		defineField({
			name: "faqHeading",
			title: "FAQ heading",
			type: "string",
			group: "faq",
			initialValue: "FAQs",
		}),
		defineField({
			name: "faqSubcopy",
			title: "FAQ intro",
			type: "text",
			rows: 2,
			group: "faq",
			description: "The paragraph beside the questions.",
		}),
		defineField({
			name: "faqs",
			title: "Questions",
			type: "array",
			group: "faq",
			of: [defineArrayMember({ type: "blogFaq" })],
			description: "Leave empty to drop the FAQ section from this post entirely.",
		}),

		defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
		defineField({
			name: "scripts",
			title: "Page scripts",
			type: "customScripts",
			group: "seo",
			description: "Injected after the site-wide global scripts, only on this post.",
		}),
	],
	orderings: [
		{
			name: "publishedDesc",
			title: "Newest first",
			by: [{ field: "publishedAt", direction: "desc" }],
		},
	],
	preview: {
		select: { title: "title", subtitle: "category.title", media: "hero", date: "publishedAt" },
		prepare: ({ title, subtitle, media, date }) => ({
			title,
			subtitle: [subtitle, date].filter(Boolean).join(" · "),
			media,
		}),
	},
});
