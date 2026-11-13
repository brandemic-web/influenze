/**
 * Defaults for every /pricing/<slug> guide, drawn from the Figma "Pricing Guide" frame
 * (Influenze.ai Branding – Web UI, node 2187:777). A Sanity "Pricing Guide Page"
 * overrides any of it; empty fields keep these. `*stars*` mark brand-green words.
 * The plans panel is the pricing page's own (data/pricing.ts), so prices stay in one place.
 */
import { APP_URL } from "../site";
import type { CompareRow, CopyField } from "../compare/shared";
import { FAQ_HEADING, FAQ_SUBCOPY } from "../faqs";
import { SIGNUP_CREDITS } from "../compare/shared";

export { plainText, twoTone } from "../compare/shared";

/** "How credits work" — the per-action costs, as the design lists them. */
export const CREDIT_ROWS = [
	{ label: "Direct search", detail: "1 result", cost: "5 Credits" },
	{ label: "Filtered search", detail: "10 results/page", cost: "50 Credits" },
	{ label: "Profile analytics unlock", detail: "", cost: "50 Credits" },
	{ label: "Contact detail unlock", detail: "", cost: "5 Credits" },
];
export type CreditRow = (typeof CREDIT_ROWS)[number];

/** The estimator's three inputs: what each counts, its cost per unit, its default. */
export const ESTIMATOR_FIELDS = [
	{ id: "searches", label: "Searches", unit: 5, value: 5 },
	{ id: "profiles", label: "Profiles Analyzed", unit: 50, value: 5 },
	{ id: "contacts", label: "Contacts Unlocked", unit: 5, value: 10 },
] as const;

/** "Who this makes sense for" — one card per team, shown only when a guide turns it on. */
export interface FitCard {
	title: string;
	body: string;
	credits: string;
}
export const FIT_CARDS: FitCard[] = [
	{
		title: "Influencer Marketing Agencies",
		body: "Four client briefs a month.",
		credits: "≈ 1,800 credits a month (80 searches, 24 profiles, 40 contacts). Best fit: monthly subscription",
	},
	{
		title: "Freelancers",
		body: "Two client briefs a month.",
		credits: "≈ 750 credits a month (20 searches, 10 profiles, 30 contacts). Best fit: one-time recharge",
	},
	{
		title: "D2C Brands",
		body: "Two product launches a month.",
		credits:
			"≈ 900 credits a month (40 searches, 12 profiles, 20 contacts). Best fit: one-time recharges, or a monthly subscription as volume grows",
	},
	{
		title: "Talent Managers",
		body: "Two roster reviews plus scouting each month.",
		credits:
			"≈ 950 credits a month (20 searches, 16 profiles, 10 contacts). Best fit: one-time recharges, or a monthly subscription as volume grows",
	},
];

/** "Credits vs quote-led and annual platforms". */
export const QUOTE_ROWS = [
	{ id: "visibility", label: "Pricing Visibility", influenze: { mark: true, text: "Per-action costs published" } },
	{ id: "commitment", label: "Commitment", influenze: { mark: true, text: "No mandatory annual lock-in" } },
	{ id: "payingFor", label: "Paying For", influenze: { mark: true, text: "Actions you run" } },
] as const satisfies readonly CompareRow[];
export type QuoteRowId = (typeof QUOTE_ROWS)[number]["id"];
export const QUOTE_THEIRS: Record<QuoteRowId, string> = {
	visibility: "Often shared after a demo",
	commitment: "Often 12-month terms",
	payingFor: "Seats or plan tiers",
};

export const PRICING_GUIDE_COPY_FIELDS = [
	{ key: "heroEyebrow", group: "hero", title: "Label above the title", default: "Pricing" },
	{ key: "heroTitle", group: "hero", title: "Title", default: "How Influenze.ai\n*Credits Work*", twoTone: true, long: true },
	{
		key: "heroBody",
		group: "hero",
		title: "Text under the title",
		default: `Every action in Influenze.ai costs a set number of credits — a search, a profile analytics unlock, a contact unlock — and work-email signups start with ${SIGNUP_CREDITS} credits. Add up the actions a brief needs to estimate its cost before choosing a plan.`,
		long: true,
	},
	{ key: "heroCta", group: "hero", title: "Button label", default: `Start With ${SIGNUP_CREDITS} Credits` },
	{ key: "heroCtaLink", group: "hero", title: "Button link", default: APP_URL, url: true },
	{ key: "creditsEyebrow", group: "hero", title: "“How credits work” label", default: "How Credits Work" },
	{ key: "estimatorHeading", group: "estimator", title: "Heading", default: "Estimate Your Credits", twoTone: true },
	{ key: "estimatorResultLabel", group: "estimator", title: "Result label", default: "Estimated Credits" },
	{
		key: "estimatorFits",
		group: "estimator",
		title: "Note when it fits the signup credits — {spare} is credits left over",
		default: `Fits inside your {credits} free credits, with {spare} to spare`,
	},
	{
		key: "estimatorOver",
		group: "estimator",
		title: "Note when it needs more — {over} is credits beyond the signup ones",
		default: `Needs {over} more than your {credits} free credits`,
	},
	{ key: "rollover", group: "estimator", title: "Rollover pill", default: "Unused Credits Roll Over" },
	{ key: "plansHeading", group: "plans", title: "Heading — first line", default: "Plans That" },
	{ key: "plansAccent", group: "plans", title: "Heading — green line", default: "Fit How You Work" },
	{ key: "plansIncluded", group: "plans", title: "Label above the features list", default: "Included In Every Plan" },
	{ key: "oneTimeHeading", group: "oneTime", title: "Heading", default: "Running A *One-Time\nCampaign?*", twoTone: true, long: true },
	{
		key: "oneTimeBody",
		group: "oneTime",
		title: "Text",
		default: `Running a single campaign? Sign up with a work email, use the ${SIGNUP_CREDITS} credits, and top up only if the brief needs more.`,
		long: true,
	},
	{
		key: "fitHeading",
		group: "fit",
		title: "Heading",
		default: "One-Time Recharge Or Monthly Subscription?\n*It Depends On Your Usage*",
		twoTone: true,
		long: true,
	},
	{ key: "fitSubheading", group: "fit", title: "Subheading", default: "Typical monthly credit use by team, and which option fits." },	{
		key: "quoteHeading",
		group: "quote",
		title: "Heading",
		default: "Credits Vs Quote-Led And\nAnnual Platforms",
		twoTone: true,
		long: true,
	},
	{ key: "quoteCorner", group: "quote", title: "First column header", default: "Factor" },
	{ key: "quoteThem", group: "quote", title: "Other column header", default: "Quote-led / annual platforms" },
	{ key: "quoteThem2", group: "quote", title: "Third column header (three-way only)", default: "Annual platforms" },
	{ key: "faqHeading", group: "faq", title: "Heading", default: FAQ_HEADING },
	{ key: "faqSubcopy", group: "faq", title: "Subheading", default: FAQ_SUBCOPY, long: true },
] as const satisfies readonly (CopyField & { group: string })[];

export type PricingGuideCopyKey = (typeof PRICING_GUIDE_COPY_FIELDS)[number]["key"];
export type PricingGuideCopy = Record<PricingGuideCopyKey, string>;

export function resolvePricingGuideCopy(overrides: Partial<Record<string, string | undefined>> | undefined) {
	return Object.fromEntries(
		PRICING_GUIDE_COPY_FIELDS.map((f) => [f.key, overrides?.[f.key]?.trim() || f.default]),
	) as PricingGuideCopy;
}
