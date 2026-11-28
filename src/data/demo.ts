import { SIGNUP_CREDITS } from "./compare/shared";
import { CUSTOM_PLAN } from "./pricing";
import type { WorkflowIconName } from "./workflowIcons";

export const DEMO_PATH = "/demo/";
export const DEMO_LABEL = "Request a demo";

export const DEMO_PAGE = {
	title: "Request a personalised demo | Influenze.ai",
	description: "Request a 30-minute walkthrough of Influenze.ai for your brand, agency or creator roster.",
	heading: "Turn your brief into *a creator shortlist.*",
	intro: "See how to find creators, check audience quality and build a shortlist for your next campaign.",
	facts: [
		{ value: "450M+", label: "Searchable creator profiles", icon: "search" },
		{ value: "3", label: "Instagram, YouTube and TikTok", icon: "users" },
		{ value: "Daily", label: "Follower-quality audits", icon: "userRoundCheck" },
		{ value: `${SIGNUP_CREDITS}`, label: "Free credits at signup", icon: "coins" },
	] satisfies { value: string; label: string; icon: WorkflowIconName }[],
	form: {
		heading: "Get a 30-minute *personalised demo*",
		fields: [
			{ label: "First name", autocomplete: "given-name", type: "text", maxlength: 80 },
			{ label: "Last name", autocomplete: "family-name", type: "text", maxlength: 80 },
			{ label: "Company name", autocomplete: "organization", type: "text", maxlength: 120 },
			{ label: "Work email", autocomplete: "email", type: "email", maxlength: 254 },
		] as const,
		roleLabel: "Who do you represent?",
		roles: [
			{ label: "Agency", icon: "usersRound" },
			{ label: "Brand", icon: "badge" },
			{ label: "Creators", icon: "parameterMagic" },
		] satisfies { label: string; icon: WorkflowIconName }[],
		submitLabel: "Open email draft",
		submitNote: "Review and send your request from your email app.",
		privacyLead: "See how we handle your details in our",
		privacyLabel: "Privacy Policy",
		emailHref: `mailto:${CUSTOM_PLAN.contactEmail}?subject=${encodeURIComponent(DEMO_LABEL)}`,
	},
};
