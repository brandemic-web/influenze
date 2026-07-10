export interface FeatureBlock {
	title: string;
	description: string;
	/** Key into the image map in FeatureBlock.astro (src/assets imports live there) */
	imageKey: string;
}

export const FEATURE_BLOCKS_HEADING = "The platform that actually does the work";

export const FEATURE_BLOCKS: FeatureBlock[] = [
	{
		title: "Powerful Targeted Discovery",
		description:
			"Find creators based on specific niches, categories, regions, platforms, audience types, content styles, and campaign requirements through advanced search capabilities.",
		imageKey: "discovery",
	},
	{
		title: "Creator Analytics & Media Kit Access",
		description:
			"Access deeper creator insights, performance data, audience information, and structured media kit analytics to evaluate creators beyond surface-level numbers.",
		imageKey: "analytics",
	},
	{
		title: "Contact Detail Unlocks",
		description:
			"Access available creator contact details to streamline outreach, collaboration planning, and creator onboarding.",
		imageKey: "contacts",
	},
	{
		title: "Real-Time Creator Comparisons",
		description:
			"Compare multiple creators side by side in real time to make faster and more confident shortlisting decisions.",
		imageKey: "comparisons",
	},
	{
		title: "Organized Creator Shortlists with import and export",
		description:
			"Build campaign-wise, brand-wise, niche-wise, region-wise, or roster-wise creator lists for better internal planning and client recommendations.",
		imageKey: "shortlists",
	},
	{
		title: "Easy Sharing",
		description:
			"Share creator profiles, shortlists, and campaign recommendations with clients, brands, internal teams, and stakeholders through structured view-access links.",
		imageKey: "sharing",
	},
	{
		title: "Reusable Creator Pools",
		description:
			"Build long-term creator intelligence instead of starting research from scratch for every new brief, campaign, or brand requirement.",
		imageKey: "pools",
	},
];
