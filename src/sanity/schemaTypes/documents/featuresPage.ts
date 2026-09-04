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
	groups: [
		{ name: "hero", title: "Hero" },
		{ name: "creatorShowcase", title: "Creator Showcase" },
		{ name: "featureBlocks", title: "Feature Blocks" },
	],
	fields: [
		defineField({ name: "seo", title: "SEO", type: "seo" }),
		defineField({
			name: "hero",
			title: "Hero",
			type: "object",
			group: "hero",
			fields: [
				defineField({
					name: "heading",
					title: "Heading",
					type: "string",
					initialValue: "A product that caters to you",
				}),
				defineField({
					name: "subcopy",
					title: "Subcopy",
					type: "object",
					description:
						'The highlighted phrase renders in brand green — e.g. lead "Search ", highlight "450M+ creators", trail " across Instagram, TikTok and YouTube using audience intelligence, fraud detection and performance signals."',
					initialValue: {
						lead: "Search ",
						highlight: "450M+ creators",
						trail:
							" across Instagram, TikTok and YouTube using audience intelligence, fraud detection and performance signals.",
					},
					fields: [
						defineField({ name: "lead", title: "Text before the highlight", type: "string" }),
						defineField({ name: "highlight", title: "Highlighted phrase", type: "string" }),
						defineField({ name: "trail", title: "Text after the highlight", type: "string" }),
					],
				}),
				defineField({
					name: "creatorImages",
					title: "Creator photos (marquee)",
					description:
						"Appended after the six built-in photos in the hero's scrolling strip — doesn't replace them.",
					type: "array",
					of: [
						{
							type: "object",
							name: "creatorImage",
							fields: [
								defineField({
									name: "image",
									title: "Photo",
									type: "image",
									options: { hotspot: true },
									validation: (Rule) => Rule.required(),
								}),
								defineField({ name: "alt", title: "Alt text", type: "string" }),
							],
							preview: { select: { title: "alt", media: "image" } },
						},
					],
				}),
			],
		}),
		defineField({
			name: "creatorShowcase",
			title: "Creator Showcase",
			type: "object",
			group: "creatorShowcase",
			fields: [
				defineField({
					name: "heading",
					title: "Heading",
					type: "object",
					description:
						'One complete heading split across two lines — e.g. top "The fastest way To discover", bottom "And evaluate the right creators". The bottom line right-aligns on desktop.',
					initialValue: {
						top: "The fastest way To discover",
						bottom: "And evaluate the right creators",
					},
					fields: [
						defineField({ name: "top", title: "Top line", type: "string" }),
						defineField({ name: "bottom", title: "Bottom line", type: "string" }),
					],
				}),
			],
		}),
		defineField({
			name: "featureBlocksHeading",
			title: "Feature blocks heading",
			type: "object",
			group: "featureBlocks",
			description: 'The accent half renders in brand green — e.g. lead "The platform that actually", accent " does the work".',
			initialValue: {
				lead: "The platform that actually",
				accent: " does the work",
			},
			fields: [
				defineField({ name: "lead", title: "Lead text", type: "string" }),
				defineField({ name: "accent", title: "Accent text", type: "string" }),
			],
		}),
		defineField({
			name: "featureBlocks",
			title: "Feature blocks",
			group: "featureBlocks",
			description:
				"Fixed at seven, pre-filled with the current copy — each one pairs with a hardcoded product image in code by position, so don't add, remove, or reorder items, just edit the title/description text in place.",
			type: "array",
			validation: (Rule) => Rule.length(7),
			initialValue: [
				{
					_key: "discovery",
					title: "Powerful Targeted Discovery",
					description:
						"Filter by niche, category, region, platform, audience type, and content style until the list in front of you matches exactly what the campaign needs.",
				},
				{
					_key: "analytics",
					title: "Creator Analytics & Media Kit Access",
					description:
						"Follower counts only tell half the story. Full media kits bring in performance data and audience insights, so evaluation goes deeper than surface numbers.",
				},
				{
					_key: "contacts",
					title: "Unlock Creator Contact Details",
					description:
						"The moment you've found the right creator, their contact details are already there, ready for outreach, collaboration planning, or onboarding.",
				},
				{
					_key: "comparisons",
					title: "Real-Time Creator Comparisons",
					description:
						"Watch creators stack up against each other side by side, turning shortlisting into a confident decision instead of a guess.",
				},
				{
					_key: "shortlists",
					title: "Organized Creator Shortlists With Import And Export",
					description:
						"Every campaign, brand, niche, region, or roster gets its own list, built for internal planning and easy client recommendations.",
				},
				{
					_key: "sharing",
					title: "Easy Sharing",
					description:
						"Forget the exports and screenshots. Creator profiles, shortlists, and campaign recommendations go out through clean, structured links.",
				},
				{
					_key: "pools",
					title: "Reusable Creator Pools",
					description:
						"Starting from scratch for every new brief gets old fast. Long-term creator pools mean the research you've already done keeps paying off.",
				},
			],
			of: [
				{
					type: "object",
					name: "featureBlock",
					fields: [
						defineField({ name: "title", title: "Title", type: "string" }),
						defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
					],
					preview: {
						select: { title: "title" },
					},
				},
			],
		}),
	],
	preview: {
		prepare: () => ({ title: "Features Page" }),
	},
});
