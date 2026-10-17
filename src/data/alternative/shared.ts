/**
 * The Influenze.ai half of every /alternatives/<competitor> page, drawn from the
 * Figma "Alternative" frame: section copy, the "why" cards, the fit table's rows,
 * the network steps and the use cases. A competitor file supplies only its own half
 * (see ./types.ts). The feature table reuses the compare page's rows unchanged.
 */
import { COMPARE_HERO, type CompareRow, type CopyField } from "../compare/shared";
import { FAQ_HEADING, FAQ_SUBCOPY } from "../faqs";

export { FEATURE_ROWS, TBC, plainText, twoTone, type CompareRow, type FeatureRowId } from "../compare/shared";

export const ALTERNATIVE_HERO = {
	primaryCta: COMPARE_HERO.primaryCta,
};

// ── Fit table ────────────────────────────────────────────────────────────────

export const FIT_CORNER_LABEL = "Need";

export const FIT_ROWS = [
	{ id: "focusedDiscovery", label: "Focused Discovery", influenze: { mark: true, text: "Core" } },
	{ id: "campaignOperations", label: "Campaign Operations", influenze: { mark: true, text: "Outside the platform" } },
	{ id: "pricingTransparency", label: "Pricing Transparency", influenze: { mark: true, text: "Published credit costs" } },
	{ id: "commitment", label: "Commitment", influenze: { mark: true, text: "No mandatory annual lock-in" } },
	{ id: "bestFitIcp", label: "Best-Fit ICP", influenze: { mark: true, text: "Agencies, brands, freelancers" } },
] as const satisfies readonly CompareRow[];

export type FitRowId = (typeof FIT_ROWS)[number]["id"];

// ── Cards and lists ──────────────────────────────────────────────────────────

export interface CardText {
	title: string;
	body: string;
}

/** "Why Influenze is an alternative" — a sideways rail, as drawn. */
export const WHY_CARDS: CardText[] = [
	{ title: "No Annual Commitment", body: "Start with 500 credits.\nNo long-term contracts." },
	{ title: "Focused Creator Discovery", body: "Find, evaluate and shortlist the\nright creators." },
	{ title: "Transparent Pricing", body: "Know per-action credit costs upfront.\nNo sales demo." },
	{ title: "Shareable Creator Lists", body: "Build, save and reuse creator\nshortlists." },
	{ title: "Works With Your Tools", body: "Keep outreach and payments in your\nexisting workflow." },
	{ title: "No Unnecessary Features", body: "Pay for discovery, not an entire enterprise suite." },
];

/**
 * The four "keep your network" steps. They drive the homepage's animated product panels
 * one for one, so there are exactly four; icons key the homepage section's tiles.
 */
export const NETWORK_STEPS = [
	{ id: "keep", icon: "users", title: "Keep Your Network", body: "Export or retain the creators you already\nwork with." },
	{ id: "gaps", icon: "search", title: "Search The Gaps", body: "Run niche, location and lookalike searches\nbeyond the network." },
	{ id: "evaluate", icon: "squareCheckBig", title: "Evaluate", body: "Unlock analytics on the candidates that matter." },
	{ id: "build", icon: "scaling", title: "Build A New List", body: "Save the shortlist by campaign or client." },
] as const satisfies readonly { id: string; icon: string; title: string; body: string }[];

export type NetworkStepId = (typeof NETWORK_STEPS)[number]["id"];

export const USE_CASES = [
	{ id: "agencies", title: "Agencies", body: "Move from client brief to shareable shortlist." },
	{ id: "talentManagers", title: "Talent Managers", body: "See beyond the existing network" },
	{ id: "brands", title: "Brands", body: "Build an independent view of the creator market." },
	{ id: "freelancers", title: "Freelancers", body: "Research professionally without enterprise software." },
] as const satisfies readonly { id: string; title: string; body: string }[];

export type UseCaseId = (typeof USE_CASES)[number]["id"];

/** Fixed-slot cards with any per-page title or body layered on; blank keeps the default. */
export function resolveSlots<T extends { id: string; title: string; body: string; location?: string }>(
	defaults: readonly T[],
	overrides: Partial<Record<string, (Partial<CardText> & { location?: string }) | undefined>> | undefined,
) {
	return defaults.map((card) => ({
		...card,
		title: overrides?.[card.id]?.title?.trim() || card.title,
		body: overrides?.[card.id]?.body?.trim() || card.body,
		...(card.location !== undefined ? { location: overrides?.[card.id]?.location?.trim() || card.location } : {}),
	}));
}

// ── Section copy ─────────────────────────────────────────────────────────────

/**
 * Every heading and text the page sets once, with its default and the Studio tab it
 * sits in. One list drives the page and the fields (documents/alternativePage.ts).
 * `*stars*` mark brand-green words where `twoTone` is set; `{name}` is the competitor.
 */
export const ALT_COPY_FIELDS = [
	{ key: "heroEyebrow", group: "hero", title: "Label above the title", default: "Alternatives" },
	{
		key: "heroTitle",
		group: "hero",
		title: "Title",
		default: "A More Advanced, Powerful\nAlternative for Influencer Discovery.",
		long: true,
	},
	{
		key: "heroBody",
		group: "hero",
		title: "Text in the frame",
		default:
			"Discover and shortlist creators from 450M+ profiles across Instagram, YouTube and TikTok, with transparent pricing and no annual contracts.",
		long: true,
	},
	{ key: "secondaryCta", group: "hero", title: "Second button label", default: "Jump to comparison" },
	{ key: "whyHeading", group: "why", title: "Heading", default: "Why *Influenze* Is An Alternative", twoTone: true },
	{ key: "fitHeading", group: "fit", title: "Heading", default: "Find The Right Fit", twoTone: true },
	{
		key: "fitSubcopy",
		group: "fit",
		title: "Subheading",
		default: "Understand what each platform offers and choose what works best for you.",
		long: true,
	},
	{ key: "featureHeading", group: "features", title: "Heading", default: "How Influenze *Compares*", twoTone: true },
	{
		key: "featureSubcopy",
		group: "features",
		title: "Subheading",
		default: "Not just another data platform — we verify, score, and surface only what matters.",
		long: true,
	},
	{
		key: "networkHeading",
		group: "network",
		title: "Heading",
		default: "Keep Your Network.\n*Expand Your Reach.*",
		twoTone: true,
		long: true,
	},
	{
		key: "useCasesHeading",
		group: "useCases",
		title: "Heading",
		default: "Use Cases For *Brands And Agencies*",
		twoTone: true,
	},
	{ key: "faqHeading", group: "faq", title: "Heading", default: FAQ_HEADING },
	{ key: "faqSubcopy", group: "faq", title: "Subheading", default: FAQ_SUBCOPY, long: true },
] as const satisfies readonly (CopyField & { group: string })[];

export type AltCopyKey = (typeof ALT_COPY_FIELDS)[number]["key"];
export type AltCopy = Record<AltCopyKey, string>;

/** Icon per network step, mapped to the homepage section's tiles on the alternative page. */
export type NetworkIcon = (typeof NETWORK_STEPS)[number]["icon"];
