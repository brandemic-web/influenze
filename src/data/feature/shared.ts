/**
 * Defaults for every /features/<slug> page, drawn from the Figma "Features" frame
 * (Influenze.ai Branding – Web UI, node 2169:9). A Sanity "Feature Page" document
 * overrides any of it; empty fields keep these. `*stars*` mark brand-green words.
 * The cards it shares with the platform page come from there, so the two match.
 */
import { APP_URL } from "../site";
import type { CopyField } from "../compare/shared";
import { FAQ_HEADING, FAQ_SUBCOPY } from "../faqs";
import { FRESHNESS_CARDS, WHO_FOR_CARDS, type IconTile } from "../platform/shared";

export { plainText, twoTone } from "../compare/shared";
export { resolveSlots, type CardText } from "../alternative/shared";
export { FRESHNESS_CARDS, HOW_STEPS, WHO_FOR_CARDS, type HowStepId, type IconCardText, type IconTile } from "../platform/shared";

export const NUMBERS_CARDS = [
	{
		id: "topic",
		icon: "search",
		title: "Topic Relevance",
		body: "How closely a creator's content matches the topic, not just their tags.",
	},
	{
		id: "engagement",
		icon: "mapPin",
		title: "Engagement Rate",
		body: "Interactions relative to audience size, benchmarked to similar creators.",
	},
	{ id: "affinity", icon: "heart", title: "Brand Affinity", body: "Brands a creator has mentioned or worked with." },
] as const satisfies readonly { id: string; icon: IconTile; title: string; body: string }[];
export type NumbersId = (typeof NUMBERS_CARDS)[number]["id"];
export type FreshnessId = (typeof FRESHNESS_CARDS)[number]["id"];

/** The creator rows under "the fastest way…" — the app's search results, as drawn. */
export const RESULT_ROWS = [
	{
		avatar: "saloni",
		name: "Saloni S",
		handle: "@salonipatelofficall",
		tier: "💎 Macro Influencer",
		location: "Mumbai, IN",
		gender: "Female",
		language: "EN",
		platforms: ["instagram", "youtube"],
		followers: "570k",
		engagement: "5.8%",
		level: "GOOD",
	},
	{
		avatar: "justin",
		name: "Justin Joy",
		handle: "@hyperfitx",
		tier: "🔥 Micro Influencer",
		location: "Bengaluru, IN",
		gender: "Male",
		language: "EN",
		platforms: ["youtube"],
		followers: "156k",
		engagement: "3.25%",
		level: "AVERAGE",
	},
	{
		avatar: "placeholder",
		name: "One more here",
		handle: "@username",
		tier: "👑 Mega Influencer",
		location: "Mumbai, IN",
		gender: "Male",
		language: "EN",
		platforms: ["youtube"],
		followers: "256k",
		engagement: "3.25%",
		level: "GOOD",
	},
] as const;

/** Every once-per-page text, with its default and the Studio tab it sits in. */
export const FEATURE_COPY_FIELDS = [
	{ key: "heroEyebrow", group: "hero", title: "Label above the title", default: "Features" },
	{
		key: "heroTitle",
		group: "hero",
		title: "Title",
		default: "Find Creators From a Real\nBrief With *AI-Driven Search*",
		twoTone: true,
		long: true,
	},
	{
		key: "searchPrompt",
		group: "hero",
		title: "Mockup — search bar text",
		default: "Enter *username* / *@handle* / *URL*",
		twoTone: true,
	},
	{ key: "heroCta", group: "hero", title: "Button label", default: "Run your First Parameter Search" },
	{ key: "heroCtaLink", group: "hero", title: "Button link", default: APP_URL, url: true },
	{
		key: "heroBody",
		group: "hero",
		title: "Text under the panel",
		default:
			"Describe the creators you need — topic, audience, location, follower range — and Influenze.ai searches *450M+* profiles across Instagram, YouTube and TikTok using semantic and parameter-led discovery, so you start from relevant candidates instead of broad hashtags.",
		twoTone: true,
		long: true,
	},
	{ key: "manualEyebrow", group: "manual", title: "Label above the heading", default: "Without Influenze" },
	{ key: "manualHeading", group: "manual", title: "Heading", default: "The Manual Way", twoTone: true },
	{
		key: "manualBody",
		group: "manual",
		title: "Text in the box",
		default:
			"Without it, discovery becomes a manual process of searching one hashtag at a time, tracking saved posts in spreadsheets, and circulating screenshots for approval.",
		long: true,
	},
	{ key: "howHeading", group: "how", title: "Heading", default: "How It Works", twoTone: true, long: true },
	{ key: "howButton", group: "how", title: "Button label", default: "Sign Up" },
	{ key: "howButtonLink", group: "how", title: "Button link", default: APP_URL, url: true },
	{ key: "numbersHeading", group: "numbers", title: "Heading", default: "What The *Numbers Mean*", twoTone: true },
	{
		key: "freshnessHeading",
		group: "freshness",
		title: "Heading",
		default: "How *Fresh And Accurate*\nIs The Data?",
		twoTone: true,
		long: true,
	},
	{
		key: "fastestLine1",
		group: "fastest",
		title: "Heading — first line",
		default: "*The* Fastest Way *To Discover*",
		twoTone: true,
	},
	{
		key: "fastestLine2",
		group: "fastest",
		title: "Heading — second line",
		default: "*And Evaluate The* Right Creators",
		twoTone: true,
	},
	{ key: "whoForHeading", group: "whoFor", title: "Heading", default: "Who Is It *For?*", twoTone: true },
	{ key: "faqHeading", group: "faq", title: "Heading", default: FAQ_HEADING },
	{ key: "faqSubcopy", group: "faq", title: "Subheading", default: FAQ_SUBCOPY, long: true },
] as const satisfies readonly (CopyField & { group: string })[];

export type FeatureCopyKey = (typeof FEATURE_COPY_FIELDS)[number]["key"];
export type FeatureCopy = Record<FeatureCopyKey, string>;

export function resolveFeatureCopy(overrides: Partial<Record<string, string | undefined>> | undefined) {
	return Object.fromEntries(
		FEATURE_COPY_FIELDS.map((f) => [f.key, overrides?.[f.key]?.trim() || f.default]),
	) as FeatureCopy;
}
