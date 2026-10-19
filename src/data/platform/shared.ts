/**
 * Defaults for every /platforms/<platform> page, drawn from the Figma "Platform"
 * frame (Influenze.ai Branding – Web UI, node 2090:1336). A platform document in
 * Sanity overrides any of it; empty fields keep these. In copy, `{name}` is the
 * platform ("Instagram"), `{an}` is "a" or "an" to suit it, and `*stars*` mark
 * brand-green words.
 */
import type { CopyField } from "../compare/shared";
import { FAQ_HEADING, FAQ_SUBCOPY } from "../faqs";
import { SIGNUP_CREDITS } from "../compare/shared";

export { plainText, twoTone } from "../compare/shared";
export { resolveSlots, type CardText } from "../alternative/shared";

/** The platforms the app's filter offers; picks the chip shown selected in the mockups. */
export const PLATFORM_KEYS = ["instagram", "youtube", "tiktok"] as const;
export type PlatformKey = (typeof PLATFORM_KEYS)[number];

/** `{name}` → platform name, `{an}` → its article. */
export const fillPlatform = (text: string, name: string) =>
	text.replaceAll("{an}", /^[aeiou]/i.test(name) ? "an" : "a").replaceAll("{name}", name);

// ── Icon tiles ───────────────────────────────────────────────────────────────

/** Tile names an icon card can use; resolved to assets in IconCard.astro. */
export const ICON_TILES = [
	"search",
	"hash",
	"users",
	"mapPin",
	"userRoundGroup",
	"heart",
	"squareCheckBig",
	"refreshCcw",
	"circleUserRound",
	"circleDollarSign",
] as const;
export type IconTile = (typeof ICON_TILES)[number];

export interface IconCardText {
	icon: IconTile;
	title: string;
	body: string;
}

// ── Cards and lists ──────────────────────────────────────────────────────────

/** "What you can search by" — a sideways rail of six icon cards, as drawn. */
export const SEARCH_BY_CARDS: IconCardText[] = [
	{ icon: "search", title: "Topic Relevance", body: "What the creator actually posts about." },
	{ icon: "hash", title: "Bio Phrase & Hashtags", body: "Words in bios and the tags they use." },
	{ icon: "users", title: "Lookalikes", body: "Find similar creators to those performing" },
	{ icon: "mapPin", title: "Location & Follower Tier", body: "Where they are and how big they are." },
	{ icon: "userRoundGroup", title: "Audience", body: "Who follows them." },
	{ icon: "heart", title: "Brand Affinity", body: "Brands they already mention." },
];

/** "Who is it for?" — a sideways rail, centred on the middle card as drawn. */
export const WHO_FOR_CARDS = [
	{
		title: "INFLUENCER MARKETING",
		body: "Facilitates campaign-wise creator discovery, influencer list building, media kit analytics, real-time comparisons, contact access, shortlisting, sharing, and client recommendations.",
	},
	{
		title: "TALENT MANAGEMENT",
		body: "Aids in new talent discovery, roster planning, creator categorization, brand-fit mapping, profile evaluation, talent comparison, contact discovery, and brand presentations.",
	},
	{
		title: "PUBLIC RELATIONS",
		body: "Assists in creator discovery, ambassador shortlisting, UGC partner discovery, product launch campaigns, regional creator identification, comparison, and long-term creator pool building.",
	},
	{
		title: "ADVERTISING",
		body: "Assists in creator discovery, ambassador shortlisting, UGC partner discovery, product launch campaigns, regional creator identification, comparison, and long-term creator pool building.",
	},
	{
		title: "E-COMMERCE",
		body: "Assists in creator discovery, ambassador shortlisting, UGC partner discovery, product launch campaigns, regional creator identification, comparison, and long-term creator pool building.",
	},
];

/**
 * Each brief pairs with its own photos and the location shown in the app's field over
 * them (ExampleBriefs.astro); the section cycles through them. Locations are as drawn.
 */
export const BRIEFS = [
	{ id: "first", title: "Skincare micro-creators in Pune", body: "Reels-first, strong women 18–34 audience.", location: "Pune", photos: "skincare" },
	{ id: "second", title: "Home-cooking creators in Bengaluru", body: "Under 50K followers, high saves.", location: "Bengaluru", photos: "cooking" },
	{ id: "third", title: "Fitness creators for a supplement launch", body: "Tier-2 Indian cities, Hindi and English.", location: "Bengaluru", photos: "fitness" },
] as const;
export type BriefId = (typeof BRIEFS)[number]["id"];

export const MATTERS_POINTS = [
	{
		id: "reach",
		icon: "search",
		title: "Reach Over Follower Count",
		body: "On Instagram, Reels views and saves are stronger indicators of reach than follower count alone.",
	},
	{
		id: "engagement",
		icon: "users",
		title: "Consistent Engagement Matters",
		body: "We look at performance across recent content, not just a single viral Reel.",
	},
	{
		id: "platform",
		icon: "squareCheckBig",
		title: "Platform-Specific Performance",
		body: "YouTube long-form views don’t directly translate to Instagram performance. Each platform is evaluated using its own relevant metrics.",
	},
] as const satisfies readonly { id: string; icon: IconTile; title: string; body: string }[];
export type MattersPointId = (typeof MATTERS_POINTS)[number]["id"];

/** The three stat tiles above the follower-quality card. */
export const MATTERS_STATS = [
	{ id: "engagement", label: "Engagement rate", value: "8.4%", note: "Tiktok" },
	{ id: "gender", label: "Top gender", value: "256k", note: "Female" },
	{ id: "age", label: "Top age", value: "25-34", note: "Years Old" },
] as const;
export type MattersStatId = (typeof MATTERS_STATS)[number]["id"];

export const FRESHNESS_CARDS = [
	{
		id: "updated",
		icon: "refreshCcw",
		title: "Updated regularly",
		body: "Creator data is refreshed at least every 15 days, so profiles may change between updates.",
	},
	{
		id: "contact",
		icon: "circleUserRound",
		title: "Contact Details",
		body: "Contact information is aggregated from publicly available sources. Deliverability and response rates are not guaranteed.",
	},
	{
		id: "pricing",
		icon: "circleDollarSign",
		title: "Estimated Pricing",
		body: "Pricing is directional and intended as a benchmark, not a quote. Final rates vary based on deliverables and timings.",
	},
] as const satisfies readonly { id: string; icon: IconTile; title: string; body: string }[];
export type FreshnessId = (typeof FRESHNESS_CARDS)[number]["id"];

// ── Section copy ─────────────────────────────────────────────────────────────

/** Every once-per-page text, with its default and the Studio tab it sits in. */
export const PLATFORM_COPY_FIELDS = [
	{ key: "heroEyebrow", group: "hero", title: "Label above the title", default: "Platforms" },
	{
		key: "heroTitle",
		group: "hero",
		title: "Title",
		default: "Find {name} Creators\n*Who Fit the Brief*, Not Just\nthe Follower Count",
		twoTone: true,
		long: true,
	},
	{ key: "heroCta", group: "hero", title: "Button label", default: `Start {an} {name} Search with ${SIGNUP_CREDITS} Credits` },
	{
		key: "heroBody",
		group: "hero",
		title: "Text under the panel",
		default:
			"Search {name} creators by niche, location, follower tier, engagement and audience, then analyze Reels performance and audience fit before you shortlist. Influenze.ai covers *450M+* profiles across Instagram, YouTube and TikTok, refreshed at least every 15 days.",
		twoTone: true,
		long: true,
	},
	{ key: "searchTerm", group: "hero", title: "Mockup — search term", default: "Skincare" },
	{ key: "nicheValue", group: "hero", title: "Mockup — niche", default: "Skincare" },
	{ key: "audienceValue", group: "hero", title: "Mockup — audience", default: "Women 18-35" },
	{ key: "locationValue", group: "hero", title: "Mockup — location", default: "Mumbai, India" },
	{ key: "searchByEyebrow", group: "searchBy", title: "Label above the heading", default: "Why Influenze?" },
	{ key: "searchByHeading", group: "searchBy", title: "Heading", default: "What You Can *Search By*", twoTone: true },
	{
		key: "creatorsAiHeading",
		group: "creatorsAi",
		title: "Heading",
		default: "The World’s Creators,\n*Found With AI*",
		twoTone: true,
		long: true,
	},
	{ key: "creatorsAiButton", group: "creatorsAi", title: "Button label", default: "Sign Up" },
	{ key: "whoForHeading", group: "whoFor", title: "Heading", default: "Who Is It *For?*", twoTone: true },
	{ key: "briefsHeading", group: "briefs", title: "Heading", default: "Example Briefs", twoTone: true },
	{ key: "mattersHeading", group: "matters", title: "Heading", default: "*What Matters* On This Platform", twoTone: true },
	{
		key: "freshnessHeading",
		group: "freshness",
		title: "Heading",
		default: "How *Fresh And Accurate*\nIs The Data?",
		twoTone: true,
		long: true,
	},
	{ key: "faqHeading", group: "faq", title: "Heading", default: FAQ_HEADING },
	{ key: "faqSubcopy", group: "faq", title: "Subheading", default: FAQ_SUBCOPY, long: true },
] as const satisfies readonly (CopyField & { group: string })[];

export type PlatformCopyKey = (typeof PLATFORM_COPY_FIELDS)[number]["key"];
export type PlatformCopy = Record<PlatformCopyKey, string>;

/** Overrides layered on the defaults; blank keeps the default. */
export function resolvePlatformCopy(overrides: Partial<Record<string, string | undefined>> | undefined, name: string) {
	return Object.fromEntries(
		PLATFORM_COPY_FIELDS.map((f) => [f.key, fillPlatform(overrides?.[f.key]?.trim() || f.default, name)]),
	) as PlatformCopy;
}
