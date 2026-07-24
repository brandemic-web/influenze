export interface WhyChooseCard {
	/** Key into the icon map in WhyChooseUs.astro (Figma-exported 48px tiles) */
	icon: string;
	title: string;
	description: string;
}

export const WHY_CHOOSE_EYEBROW = "Why Choose Us";
export const WHY_CHOOSE_BUTTON = "Learn More";

/** Copy is exactly the Figma "Home V2" card frame 224:26722 (6 cards). */
export const WHY_CHOOSE_CARDS: WhyChooseCard[] = [
	{
		icon: "search",
		title: "Powerful targeted Discovery",
		description: "Find creators based on specific niches, categories, regions and platforms",
	},
	{
		icon: "chart",
		title: "Creator Analytics & Media Kit Access",
		description: "View audience insights, engagement, growth trends and performance",
	},
	{
		icon: "contact",
		title: "Contact Detail Unlocks",
		description:
			"Access available creator contact details to streamline outreach, collaboration and onboarding",
	},
	{
		icon: "compare",
		title: "Real Time Comparison",
		description:
			"Compare multiple creators side by side in real time to make faster and more confident shortlisting",
	},
	{
		icon: "share",
		title: "Easy Sharing",
		description:
			"Share creator profiles, shortlists, and campaign recommendations with clients and brands",
	},
	{
		icon: "import-export",
		title: "Easy Import & Export of Lists",
		description:
			"Build campaign-wise, brand-wise, niche-wise, region-wise, or roster-wise creator lists",
	},
];
