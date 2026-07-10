export interface PlanFeature {
	label: string;
	included: boolean;
}

export interface Plan {
	name: string;
	price: string;
	priceUnit: string;
	users: string;
	features: PlanFeature[];
	credits: string;
	creditsBonus?: string;
	creditAddOn: string;
	/** Growth gets the 3D star + emphasis in the design */
	highlighted?: boolean;
}

// "Analyze 400M+ Creators" (vs 450M+ in heroes) is as designed — NOTES.md #5.
const SHARED_FEATURES: PlanFeature[] = [
	{ label: "Analyze 400M+ Creators", included: true },
	{ label: "Media Kits", included: true },
	{ label: "Lists", included: true },
	{ label: "Contact Unlocks", included: true },
	{ label: "Share profiles and lists", included: true },
	{ label: "CSV Upload", included: true },
	{ label: "Whitelabeling", included: false },
	{ label: "Custom creator link-in Bios", included: false },
];

export const PLANS: Plan[] = [
	{
		name: "STARTER",
		price: "₹6,000",
		priceUnit: "/mo + GST",
		users: "1 USER",
		features: SHARED_FEATURES,
		credits: "6,000 credits",
		creditAddOn: "No extra credit",
	},
	{
		name: "GROWTH",
		price: "₹10,000",
		priceUnit: "/mo + GST",
		users: "2 USERS",
		features: SHARED_FEATURES,
		credits: "11,000 credits",
		creditsBonus: "(Bonus 10%)",
		creditAddOn: "Recharge any amount and get 10% extra credit.",
		highlighted: true,
	},
	{
		name: "ACCELERATE",
		price: "₹20,000",
		priceUnit: "/mo + GST",
		users: "3 USERS",
		features: SHARED_FEATURES,
		credits: "24,000 credits",
		creditsBonus: "(Bonus 20%)",
		creditAddOn: "Recharge any amount and get 20% extra credit.",
	},
];

export const PRICING_HERO = {
	headingAccent: "Built for teams ",
	headingRest: "that demand accuracy",
	// Figma has a double space where a dash went missing — NOTES.md #11.
	subcopy:
		"Not just another data platform — we verify, score, and surface only what matters.",
};

export const CUSTOM_PLAN = {
	label: "CUSTOM",
	heading: "Looking for More Flexibility?",
	description:
		"Get a tailored plan with White-labeling, a custom creator link-in-bio, and features built for your team.",
	descriptionHighlight: "White-labeling, a custom creator link-in-bio",
	availability: "Available for teams of 3 OR MORE USERS",
	buttonLabel: "Get in Touch",
};

export const CREDITS_EXPLAINER = {
	heading: "How credits work",
	// "Per Media Media Kit Unlock" doubled word is as designed — NOTES.md #8.
	costs: [
		{ label: "Per Displayed Result", cost: "5 Credits" },
		{ label: "Per Media Media Kit Unlock", cost: "50 Credits" },
		{ label: "Per Contact Details Unlock", cost: "5 Credits" },
	],
	sideCard: {
		title: "Your Credits Stay With You",
		body: "Unused credits are carried forward and remain available for future use.",
	},
};
