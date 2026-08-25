export interface WhyInfluenzeStep {
	/** Key into the icon map in common/LucideIcon.astro */
	icon: "search" | "eye" | "rocket";
	title: string;
	description: string;
}

export const WHY_INFLUENZE_EYEBROW = "WHY INFLUENZE?";

/** Two halves of one line — the accent half renders in brand green. */
export const WHY_INFLUENZE_HEADING = {
	lead: "We are the first step for",
	accent: "every influencer Campaign",
};

export const WHY_INFLUENZE_BUTTON = "Learn More";

export const WHY_INFLUENZE_STEPS: WhyInfluenzeStep[] = [
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
