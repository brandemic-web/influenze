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
			"Filter by niche, category, region, platform, audience type, and content style until the list in front of you matches exactly what the campaign needs.",
		imageKey: "discovery",
	},
	{
		title: "Creator Analytics & Media Kit Access",
		description:
			"Follower counts only tell half the story. Full media kits bring in performance data and audience insights, so evaluation goes deeper than surface numbers.",
		imageKey: "analytics",
	},
	{
		title: "Unlock Creator Contact Details",
		description:
			"The moment you've found the right creator, their contact details are already there, ready for outreach, collaboration planning, or onboarding.",
		imageKey: "contacts",
	},
	{
		title: "Real-Time Creator Comparisons",
		description:
			"Watch creators stack up against each other side by side, turning shortlisting into a confident decision instead of a guess.",
		imageKey: "comparisons",
	},
	{
		title: "Organized Creator Shortlists With Import And Export",
		description:
			"Every campaign, brand, niche, region, or roster gets its own list, built for internal planning and easy client recommendations.",
		imageKey: "shortlists",
	},
	{
		title: "Easy Sharing",
		description:
			"Forget the exports and screenshots. Creator profiles, shortlists, and campaign recommendations go out through clean, structured links.",
		imageKey: "sharing",
	},
	{
		title: "Reusable Creator Pools",
		description:
			"Starting from scratch for every new brief gets old fast. Long-term creator pools mean the research you've already done keeps paying off.",
		imageKey: "pools",
	},
];
