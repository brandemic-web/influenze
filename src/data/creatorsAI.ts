export interface CreatorAIFeature {
	/** Key into the icon map in common/LucideIcon.astro */
	icon: "search" | "users" | "square-check" | "scaling";
	title: string;
	description: string;
}

export const CREATORS_AI_BUTTON = "Sign Up";

/**
 * The four feature rows on the left of the "world's creators" section.
 * Each maps to an asset group under home_page/sign_up/ (search_global is the
 * only state rendered in the static design — see PLAN.md).
 */
export const CREATORS_AI_FEATURES: CreatorAIFeature[] = [
	{
		icon: "search",
		title: "Search Globally",
		description:
			"Access a vast database of Instagram, YouTube, and TikTok creators across countries, languages, and niches",
	},
	{
		icon: "users",
		title: "Know The Audience",
		description:
			"Analyze audience quality, geography, interests, and behavior beyond simple follower counts",
	},
	{
		icon: "square-check",
		title: "Choose The Right Creators",
		description:
			"Compare creators based on audience fit, performance signals, and campaign relevance",
	},
	{
		icon: "scaling",
		title: "Scale Campaigns Confidently",
		description:
			"Build creator lists for local, regional, or worldwide campaigns from a single platform",
	},
];
