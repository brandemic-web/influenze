import { CUSTOM_PLAN } from "./pricing";
import type { WorkflowIconName } from "./workflowIcons";

export const DEMO_PATH = "/demo/";
export const DEMO_LABEL = "Request a demo";

export const DEMO_PAGE = {
	title: "Request a personalised demo | Influenze.ai",
	description: "Request a 30-minute walkthrough of Influenze.ai for your brand, agency or creator roster.",
	heading: "Find creators who *fit your campaign.*",
	intro: "Go from a campaign brief to a shareable shortlist. Search 450M+ creator profiles across Instagram, YouTube and TikTok, then vet your picks before you reach out.",
	benefits: [
		"Find creators by niche, location and audience",
		"Check follower quality and estimated rates per post",
		"Compare creators and share view-only shortlists",
		"Unlock contact details and export lists for outreach",
	],
	form: {
		heading: "Get a 30‑minute *personalised demo*",
		fields: [
			{ label: "Name", autocomplete: "name", type: "text", maxlength: 160 },
			{ label: "Company name", autocomplete: "organization", type: "text", maxlength: 120 },
			{ label: "Work email", autocomplete: "email", type: "email", maxlength: 254 },
		] as const,
		roleLabel: "Who do you represent?",
		roles: [
			{ label: "Agency", icon: "usersRound" },
			{ label: "Brand", icon: "badge" },
			{ label: "Creators", icon: "parameterMagic" },
		] satisfies { label: string; icon: WorkflowIconName }[],
		budget: {
			label: "Monthly influencer spend",
			placeholder: "Select an option",
			options: [
				"I haven’t started yet",
				"Under $5k per month",
				"$5k–$25k per month",
				"$25k–$50k per month",
				"$50k–$100k per month",
				"Over $100k per month",
				"I don’t know",
				"Prefer not to say",
			],
		},
		submitLabel: "Open email draft",
		submitNote: "Review and send your request from your email app.",
		privacyLead: "See how we handle your details in our",
		privacyLabel: "Privacy Policy",
		emailHref: `mailto:${CUSTOM_PLAN.contactEmail}?subject=${encodeURIComponent(DEMO_LABEL)}`,
	},
};
