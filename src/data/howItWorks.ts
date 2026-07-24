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
			"Access a vast database of Instagram, YouTube, and TikTok creators across countries, languages, and interests",
	},
	{
		icon: "eye",
		title: "Vet",
		description:
			"View audience insights, engagement, growth trends and performance before making a decision",
	},
	{
		icon: "rocket",
		title: "Launch",
		description:
			"Shortlist creators, build campaigns and spend your budget where it delivers results",
	},
];
