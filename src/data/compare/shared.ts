/**
 * The Influenze.ai half of every /compare/<competitor> page: section copy, our cells in
 * both tables, the workflow steps and the scenario cards. A competitor file supplies
 * only its own half (see ./types.ts), keyed by the row and step ids defined here.
 */
import { FAQ_HEADING, FAQ_SUBCOPY } from "../faqs";
import { CREDIT_COSTS } from "../pricing";
import type { WorkflowIconName } from "../workflowIcons";

/** Stand-in for a competitor fact not yet verified. Grep for it before publishing. */
export const TBC = "Lorem Ipsum";

export const SIGNUP_CREDITS = 500;

/** "{name}" in any heading below is replaced with the competitor's name. */
export const fillName = (text: string, name: string) => text.replaceAll("{name}", name);

/** "How Influenze *Compares*" → segments, the starred words flagged for brand green. */
export const twoTone = (text: string) =>
	text
		.split(/(\*[^*]+\*)/)
		.filter(Boolean)
		.map((part) =>
			part.startsWith("*") && part.endsWith("*") ? { text: part.slice(1, -1), accent: true } : { text: part, accent: false },
		);

/** The same text with its stars dropped, for places drawn in one colour. */
export const plainText = (text: string) => text.replaceAll("*", "");

export interface InfluenzeCell {
	/** Leading fragment rendered in brand green, before `text`. */
	accent?: string;
	text?: string;
	/** The capability tick above the text. */
	mark?: boolean;
	/** Show the per-action credit chips under the text. */
	credits?: boolean;
	/** Semibold, as the design sets the platform list. */
	bold?: boolean;
	/** A lead-in sentence: set larger and in sentence case, as the design does. */
	lead?: boolean;
}

export interface CompareRow<Id extends string = string> {
	id: Id;
	label: string;
	/** Keep the label for screen readers only, where the design leaves the cell empty. */
	hideLabel?: boolean;
	influenze: InfluenzeCell;
}

/** The 5 / 50 / 5 chips, read off the pricing page's costs so the two can't drift. */
export const CREDIT_CHIPS = CREDIT_COSTS.map((c) => ({
	cost: c.cost.replace(/\D+/g, ""),
	label: c.label.charAt(0).toUpperCase() + c.label.slice(1),
}));

// ── Hero ─────────────────────────────────────────────────────────────────────

export const COMPARE_HERO = {
	pills: {
		profiles: "450M+ creator profiles",
		platforms: "Instagram, YouTube & TikTok",
		credits: "Self-serve credits, no annual lock-in",
	},
	primaryCta: `Start with ${SIGNUP_CREDITS} credits`,
	secondaryCta: "Jump to comparison",
};

// ── Feature table ────────────────────────────────────────────────────────────

export const FEATURE_ROWS = [
	{
		id: "primaryFocus",
		label: "Primary Focus",
		influenze: { text: "Discovery & Talent\nIntelligence" },
	},
	{
		id: "database",
		label: "Discovery Database",
		influenze: { accent: "450M+", text: "Profiles" },
	},
	{
		id: "platforms",
		label: "Platform Coverage",
		influenze: { text: "IG · YT · TikTok", bold: true },
	},
	{
		id: "aiSearch",
		label: "AI-Driven Search Parameters",
		influenze: { mark: true, text: "Semantic and parameter-\nled discovery" },
	},
	{
		id: "publicPricing",
		label: "Public, Transparent Pricing",
		influenze: { mark: true, text: "Credit usage and starting\naccess published" },
	},
	{
		id: "selfServe",
		label: "Self-Serve · No Annual Lock-In",
		influenze: { mark: true, text: "Self-serve; no mandatory\nannual lock-in" },
	},
	{
		id: "credits",
		label: "Usage-Based Credits + Rollover",
		influenze: { mark: true, text: "Usage-based credits with rollover while subscribed" },
	},
	{
		id: "bestFor",
		label: "Best For",
		influenze: { mark: true, text: "Fast, flexible creator research\nand shortlisting", credits: true },
	},
	{
		id: "outreach",
		label: "Native Outreach",
		influenze: { mark: true, text: "No - aggregated contacts for\noutreach elsewhere" },
	},
] as const satisfies readonly CompareRow[];

export type FeatureRowId = (typeof FEATURE_ROWS)[number]["id"];

// ── Pricing table ────────────────────────────────────────────────────────────

export const PRICING_ROWS = [
	{
		// Unlabelled in the design; named for screen readers so the row still has a header.
		id: "model",
		label: "Pricing Model",
		hideLabel: true,
		influenze: {
			text: `Usage-based credits with transparent\ncosts and ${SIGNUP_CREDITS} signup credits.`,
		},
	},
	{
		id: "creditsPerAction",
		label: "Credits Per Action",
		influenze: {
			text: `Pay per action · ${SIGNUP_CREDITS} credits when\nyou sign up with a work email.`,
			credits: true,
			lead: true,
		},
	},
	{
		id: "entryPath",
		label: "Entry Path",
		influenze: { mark: true, text: `Work-email signup with\n${SIGNUP_CREDITS} credits` },
	},
	{
		id: "publicPricing",
		label: "Public Pricing",
		influenze: { mark: true, text: "Credit costs published" },
	},
	{
		id: "commitment",
		label: "Minimum Commitment",
		influenze: { mark: true, text: "No mandatory annual lock-in" },
	},
	{
		id: "salesCall",
		label: "Sales Call Required",
		influenze: { mark: true, text: "No" },
	},
	{
		id: "whoBenefits",
		label: "Who Benefits",
		influenze: { text: "Freelancers, small agencies and\none-off campaign teams." },
	},
] as const satisfies readonly CompareRow[];

export type PricingRowId = (typeof PRICING_ROWS)[number]["id"];

// ── Workflow coverage ────────────────────────────────────────────────────────

export const WORKFLOW_STEPS = [
	{ id: "search", title: "Search", icon: "search", influenze: "Core" },
	{ id: "analyze", title: "Analyze", icon: "eyeSmall", influenze: "Core" },
	{ id: "shortlist", title: "Shortlist & Compare", icon: "hourglass", influenze: "Core" },
	{ id: "share", title: "Share", icon: "share", influenze: "Core" },
	// "Core" is as drawn, but the feature table says outreach happens elsewhere —
	// confirm before publishing.
	{ id: "outreach", title: "Outreach", icon: "mail", influenze: "Core" },
] as const satisfies readonly { id: string; title: string; icon: WorkflowIconName; influenze: string }[];

export type WorkflowStepId = (typeof WORKFLOW_STEPS)[number]["id"];

// ── Scenarios ────────────────────────────────────────────────────────────────

export const SCENARIOS = [
	{
		/** Card id: keys Sanity's per-page text and the image map in ScenarioCards.astro. */
		imageKey: "agency",
		title: "Agency: A 24-Hour Pitch",
		description: "Convert briefs into search criteria, evaluate creators and share same-day shortlists.",
		icon: "hourglass",
		imageAlt: "Adding creators to a campaign list in Influenze.ai",
	},
	{
		imageKey: "d2c",
		title: "D2C Brand: Sourcing 30 UGC Creators",
		description: "Find creators by category and audience fit, compare profiles, and save UGC lists.",
		icon: "chartColumnIncreasing",
		imageAlt: "Sharing a creator list by email from Influenze.ai",
	},
	{
		imageKey: "talent",
		title: "Talent Manager: Mapping A Roster",
		description: "Benchmark roster creators against the wider market and find lookalikes outside it.",
		icon: "userRoundCheck",
		imageAlt: "Lookalike search filters in Influenze.ai",
	},
] as const satisfies readonly {
	imageKey: string;
	title: string;
	description: string;
	icon: WorkflowIconName;
	imageAlt: string;
}[];

export type ScenarioId = (typeof SCENARIOS)[number]["imageKey"];
export type ScenarioText = { title?: string; description?: string };

/** The cards with any per-page title or body layered on; blank keeps the default. */
export function resolveScenarios(overrides: Partial<Record<string, ScenarioText | undefined>> | undefined, name: string) {
	return SCENARIOS.map((card) => {
		const own = overrides?.[card.imageKey];
		return {
			...card,
			title: fillName(own?.title?.trim() || card.title, name),
			description: fillName(own?.description?.trim() || card.description, name),
		};
	});
}

export type ResolvedScenario = ReturnType<typeof resolveScenarios>[number];

// ── Section headings ─────────────────────────────────────────────────────────

/**
 * Every section's heading and subheading, with its default. One list drives both
 * the page and the Studio fields (documents/comparePage.ts), so a heading added here
 * is editable in Sanity straight away. `*stars*` mark brand-green words where
 * `twoTone` is set; elsewhere they are dropped. `{name}` is the competitor.
 */
export const SECTION_COPY_FIELDS = [
	{ key: "heroEyebrow", title: "Hero — label above the title", default: "Compare" },
	{ key: "heroTitle", title: "Hero — title", default: "Influenze.ai vs {name}" },
	{
		key: "heroQuestion",
		title: "Hero — question in the frame",
		default: "Which *Creator Discovery Platform* Fits Your Team?",
		twoTone: true,
	},
	{
		key: "chooseInfluenzeHeading",
		title: "Card — “Choose Influenze.ai” heading",
		default: "Choose *Influenze.ai* for..",
		twoTone: true,
	},
	{ key: "chooseCompetitorHeading", title: "Card — “Choose competitor” heading", default: "Choose {name} if.." },
	{ key: "featureHeading", title: "Feature table — heading", default: "How Influenze *Compares*", twoTone: true },
	{
		key: "featureSubcopy",
		title: "Feature table — subheading",
		default: "Not just another data platform — we verify, score, and surface only what matters.",
		long: true,
	},
	{
		key: "pricingHeading",
		title: "Pricing table — heading",
		default: "How Do The *Pricing Models Differ?*",
		twoTone: true,
	},
	{
		key: "pricingSubcopy",
		title: "Pricing table — subheading",
		default: "Whether you can see and control cost before procurement.",
		long: true,
	},
	{ key: "workflowHeading", title: "Workflow — heading", default: "*Workflow Coverage*", twoTone: true },
	{
		key: "workflowSubcopy",
		title: "Workflow — subheading",
		default: "Core means the platform does it; Verify means check the vendor's current documentation.",
		long: true,
	},
	{ key: "scenariosHeading", title: "Scenarios — heading", default: "Which Fits Your Scenario?", twoTone: true },
	{ key: "faqHeading", title: "FAQ — heading", default: FAQ_HEADING },
	{ key: "faqSubcopy", title: "FAQ — subheading", default: FAQ_SUBCOPY, long: true },
] as const satisfies readonly CopyField[];

export type SectionCopyKey = (typeof SECTION_COPY_FIELDS)[number]["key"];
export type SectionCopy = Record<SectionCopyKey, string>;

/** One editable heading or text: its key, Studio label and default. */
export interface CopyField {
	key: string;
	title: string;
	default: string;
	/** `*stars*` render brand green. */
	twoTone?: boolean;
	/** A multi-line field in Studio. */
	long?: boolean;
}

/** Any copy-field list's overrides layered on its defaults, `{name}` filled in. Blank keeps the default. */
export function resolveCopy<K extends string>(
	fields: readonly (CopyField & { key: K })[],
	overrides: Partial<Record<string, string | undefined>> | undefined,
	name: string,
) {
	return Object.fromEntries(
		fields.map((f) => [f.key, fillName(overrides?.[f.key]?.trim() || f.default, name)]),
	) as Record<K, string>;
}

/** Overrides layered on the defaults, with `{name}` filled in. Blank overrides keep the default. */
export const resolveSectionCopy = (overrides: Partial<Record<string, string | undefined>> | undefined, name: string) =>
	resolveCopy(SECTION_COPY_FIELDS, overrides, name) as SectionCopy;
