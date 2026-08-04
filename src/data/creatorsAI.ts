export interface CreatorAIFeature {
	/** Key into the icon map in common/LucideIcon.astro */
	icon: "search" | "users" | "square-check" | "scaling";
	title: string;
	description: string;
}

export const CREATORS_AI_BUTTON = "View Features";

/**
 * The four feature rows on the left of the "world's creators" section.
 * Each maps to an asset group under home_page/sign_up/ (search_global is the
 * only state rendered in the static design — see PLAN.md).
 */
export const CREATORS_AI_FEATURES: CreatorAIFeature[] = [
	{
		icon: "search",
		title: "Search & Discover globally",
		description:
			"Search millions of creator profiles across Instagram, YouTube, and TikTok with AI-driven filters.",
	},
	{
		icon: "users",
		title: "Analyze the profile",
		description:
			"Know before you commit. Detailed creator reports break down audience, performance, and brand fit in real time.",
	},
	{
		icon: "square-check",
		title: "Build your shortlists",
		description:
			"Build lists from your search results & compare creators on the metrics that matter. Share, import and export with ease.",
	},
	{
		icon: "scaling",
		title: "Reach out directly",
		description:
			"Tap into verified contact details for creators across email, phone, and WhatsApp.",
	},
];
