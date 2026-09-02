import { defineField, defineType } from "sanity";

/**
 * Singleton — content for /features. Mirrors src/data/featureBlocks.ts.
 * FeaturesHero and CreatorShowcase currently hardcode their own copy in the
 * component rather than a data file — hero fields here cover that, but the
 * showcase's cast/animation config stays in code since it's structural, not
 * editorial.
 */
export default defineType({
	name: "featuresPage",
	title: "Features Page",
	type: "document",
	fields: [
		defineField({ name: "seo", title: "SEO", type: "seo" }),
		defineField({
			name: "hero",
			title: "Hero",
			type: "object",
			fields: [
				defineField({ name: "heading", title: "Heading", type: "string" }),
				defineField({ name: "subcopy", title: "Subcopy", type: "text", rows: 2 }),
			],
		}),
		defineField({
			name: "featureBlocksHeading",
			title: "Feature blocks heading",
			type: "string",
		}),
		defineField({
			name: "featureBlocks",
			title: "Feature blocks",
			type: "array",
			of: [
				{
					type: "object",
					name: "featureBlock",
					fields: [
						defineField({ name: "title", title: "Title", type: "string" }),
						defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
						defineField({
							name: "image",
							title: "Image",
							type: "image",
							options: { hotspot: true },
							description: "Replaces the imageKey lookup in code once this block reads from Sanity.",
						}),
					],
					preview: {
						select: { title: "title", media: "image" },
					},
				},
			],
		}),
	],
	preview: {
		prepare: () => ({ title: "Features Page" }),
	},
});
