export interface HowItWorksStep {
	/** Key into the icon map in common/LucideIcon.astro */
	icon: "search" | "eye" | "rocket";
	title: string;
	description: string;
}

export const HOW_IT_WORKS_EYEBROW = "How It Works";
export const HOW_IT_WORKS_BUTTON = "Learn More";

export const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
	{
		icon: "search",
		title: "Discover",
		description:
			"Access the largest database of Instagram, YouTube, and TikTok profiles across countries, languages, and interests",
	},
	{
		icon: "eye",
		title: "Analyze",
		description:
			"View Audience insights, growth, brand affinities, performance, estimated pricing and more in real time",
	},
	{
		icon: "rocket",
		title: "Launch",
		description:
			"Shortlist & reach out to creators, build campaigns and optimize your budget where it delivers results",
	},
];
