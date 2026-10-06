import { defineArrayMember, defineField, defineType } from "sanity";
import { LANDING_GROUPS, closingFields, heroFields, landingPreview, section } from "./shared";

/**
 * /platforms/<slug> — Content Playbook doc 04. Only the three live platforms are offered: no
 * LinkedIn page until product confirms it is generally available.
 */
export default defineType({
	name: "platformPage",
	title: "Platform Page",
	type: "document",
	groups: LANDING_GROUPS,
	fields: [
		defineField({
			name: "platform",
			title: "Platform",
			type: "string",
			group: "hero",
			options: {
				list: [
					{ title: "Instagram", value: "instagram" },
					{ title: "YouTube", value: "youtube" },
					{ title: "TikTok", value: "tiktok" },
					{ title: "Multi-platform", value: "multi" },
				],
				layout: "radio",
			},
			validation: (Rule) => Rule.required(),
		}),
		...heroFields("platformPage", "“Find [Platform] creators who fit the brief, not just the follower count.”"),
		defineField({
			name: "searchExample",
			title: "Search module example",
			type: "array",
			group: "sections",
			of: [
				defineArrayMember({
					type: "object",
					name: "filter",
					fields: [
						defineField({ name: "label", title: "Filter", type: "string" }),
						defineField({ name: "value", title: "Value", type: "string" }),
					],
					preview: { select: { title: "label", subtitle: "value" } },
				}),
			],
			description: "Niche, location, follower and engagement examples shown in the mock search panel.",
		}),
		section("searchBy", "What you can search by", "landingCardsSection", "Only live filters and semantic parameters."),
		section("evaluate", "What you can evaluate", "landingCardsSection", "Platform-relevant metrics and audience signals."),
		section("useCases", "ICP use cases", "landingCardsSection", "Agency, D2C/performance brand, talent manager."),
		section("exampleBriefs", "Example briefs", "landingCardsSection", "Three concrete search prompts."),
		section("selectionGuide", "Platform-specific selection guide", "landingProseSection", "What matters here, and what doesn't transfer across platforms."),
		...closingFields(),
	],
	preview: landingPreview("platform"),
});
