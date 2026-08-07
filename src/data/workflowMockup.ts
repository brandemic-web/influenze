/**
 * Dummy content for the hero product-workflow animation.
 *
 * These are illustrative figures for the marketing site only — the real app
 * fetches this from the API. Kept in one place so copy tweaks never mean
 * hunting through ten screen components.
 */

/**
 * Whoever is signed in to the mockup. `handle` is only how the nav finds their
 * photo in profile_images — they are the operator, not a creator, so they are
 * deliberately not in `CREATORS`.
 */
export const APP_USER = { name: "Harsh", handle: "harsh" } as const;

/**
 * How many profiles a search analyses — the "Analyzed 10" the results header
 * reads out, and the count the search is billed for.
 */
export const ANALYZED_COUNT = 10;

/** The app charges per creator: 5 to analyse one, 50 to unlock one's profile. */
const PER_ANALYZED = 5;
const PER_UNLOCK = 50;

const CREDITS_START = 2540;
const SEARCH_COST = ANALYZED_COUNT * PER_ANALYZED;

/**
 * The nav credits chip, at each point the story spends.
 *
 * Apply & Search bills for the ten profiles it analyses; opening one of them
 * bills the unlock. Every screen is authored holding the balance it should show
 * when it comes into view, and beats 1 and 2 tick the chip from one of these to
 * the next on the layer the spend happens on — so the swap that follows lands on
 * a chip already reading the new number.
 */
export const CREDITS = {
	start: CREDITS_START,
	afterSearch: CREDITS_START - SEARCH_COST,
	afterProfile: CREDITS_START - SEARCH_COST - PER_UNLOCK,
} as const;

/** The chip's thousands separator — shared so the tween writes what the nav rendered. */
export const formatCredits = (value: number) => value.toLocaleString("en-US");

/**
 * Parameter dropdown options, in the app's order — `DiscoveryFilter` in
 * analyze/widgets/filters/discovery_filters_section.dart. Every option except
 * "None" carries an info tooltip.
 */
export const PARAMETER_OPTIONS = [
	{ label: "None", muted: true },
	{ label: "Lookalike", selected: true },
	{ label: "Interest" },
	{ label: "Topic Relevance" },
	{ label: "Bio Phrase" },
	{ label: "Description Keyword" },
	{ label: "Mention" },
	{ label: "Hashtag" },
	{ label: "Brand Affinity" },
] as const;

/**
 * Rail scroll, in rem, that brings the follower-tier list to the top of the rail.
 *
 * Screens 3-5 are authored here and beat 1 scrolls the cursor's way down to it,
 * so the animated path and the static frames land on the same pixels. Change it
 * in one place or they drift apart.
 */
export const RAIL_TIER_SCROLL = 36.4375;

/**
 * `benchmark` is the tier's Instagram *average* engagement cut — the figure the
 * expanded tier's slider reads out as its minimum, and the same number screen 5
 * labels its Category Median with. Straight from `engagementRateBenchmarks` in
 * common/constants.dart.
 */
export const FOLLOWER_TIERS = [
	{ label: "🚀 Nano Influencer", range: "1k - 10k followers", benchmark: "2.42%" },
	{ label: "🔥 Micro Influencer", range: "10k - 50k followers", benchmark: "0.98%" },
	{ label: "⭐ Mid-Tier Influencer", range: "50k - 100k followers", benchmark: "0.88%" },
	{ label: "💎 Macro Influencer", range: "100k - 1M followers", benchmark: "1.01%", selected: true },
	{ label: "👑 Mega Influencer", range: "1M+ followers", benchmark: "1.15%" },
] as const;

/**
 * Engagement quality band, uppercased as the app prints it —
 * `EngagementRateWithQuality` in common/widgets/profile_card.dart. Which band a
 * rate falls into is fixed by platform and follower tier
 * (`engagementRateBenchmarks` in common/constants.dart); for Instagram macro
 * the cuts are 2.53 / 1.53 / 1.01 / 0.66.
 */
export type EngagementLevel = "HIGH" | "ABOVE AVERAGE" | "AVERAGE" | "BELOW AVERAGE" | "LOW";

export interface Creator {
	name: string;
	handle: string;
	tierLabel: string;
	followers: string;
	avgLikes: string;
	engagement: string;
	engagementLevel: EngagementLevel;
	location: string;
	/** Omitted where we do not have it — the row simply leaves the slot out. */
	gender?: string;
	language: string;
	/** Draws the platform's blue rosette beside the name. */
	verified?: boolean;
	checked?: boolean;
}

/**
 * The Analyze results list — what the search returns, in the order the app
 * ranked them. Seven rows so the list has somewhere to scroll.
 *
 * Figures are real, pulled from the app against the `hyperfitx` lookalike seed.
 */
export const RESULT_CREATORS: Creator[] = [
	{
		name: "Selwyn D'souza",
		handle: "sellydsouzaaa",
		tierLabel: "💎 Macro",
		followers: "190.4K",
		avgLikes: "9.0K",
		engagement: "4.73%",
		engagementLevel: "HIGH",
		location: "Bangalore, India",
		gender: "Male",
		language: "EN",
		verified: true,
	},
	{
		name: "Neeraj Choudhary",
		handle: "neeraj__",
		tierLabel: "💎 Macro",
		followers: "193.6K",
		avgLikes: "9.5K",
		engagement: "4.89%",
		engagementLevel: "HIGH",
		location: "India",
		gender: "Male",
		language: "EN",
		verified: true,
	},
	{
		name: "Poorav",
		handle: "pooo.raw",
		tierLabel: "💎 Macro",
		followers: "282.4K",
		avgLikes: "7.4K",
		engagement: "2.62%",
		engagementLevel: "HIGH",
		location: "Bangalore, India",
		gender: "Male",
		language: "EN",
		verified: true,
	},
	{
		name: "AevyTV",
		handle: "aevytvdaily",
		tierLabel: "💎 Macro",
		followers: "396.4K",
		avgLikes: "4.7K",
		engagement: "1.19%",
		engagementLevel: "AVERAGE",
		location: "India",
		language: "EN",
		verified: true,
	},
	{
		name: "everythingbengaluru",
		handle: "boredinbengaluru",
		tierLabel: "💎 Macro",
		followers: "191.6K",
		avgLikes: "3.6K",
		engagement: "1.88%",
		engagementLevel: "ABOVE AVERAGE",
		location: "Bangalore, India",
		language: "EN",
		verified: true,
	},
	{
		name: "Yogish G",
		handle: "street.comic",
		tierLabel: "💎 Macro",
		followers: "245.6K",
		avgLikes: "2.5K",
		engagement: "1.01%",
		engagementLevel: "BELOW AVERAGE",
		location: "India",
		gender: "Male",
		language: "EN",
		verified: true,
	},
	{
		name: "Daniel J Samuel",
		handle: "danieljsamuel_",
		tierLabel: "💎 Macro",
		followers: "214.5K",
		avgLikes: "8.8K",
		engagement: "4.12%",
		engagementLevel: "HIGH",
		location: "India",
		gender: "Male",
		language: "EN",
		verified: true,
	},
];

/**
 * The three rows the features page's creator showcase draws, top to bottom.
 * Deliberately its own cast rather than the story's: the strip is a marketing
 * flourish on another page and has no reason to move when the story's does.
 */
const SHOWCASE_CREATORS: Creator[] = [
	{
		name: "Nikhil Chinapa",
		handle: "nikhilchinapa",
		tierLabel: "💎 Macro",
		followers: "987.5K",
		avgLikes: "4.4K",
		engagement: "0.44%",
		engagementLevel: "LOW",
		location: "Mumbai, India",
		gender: "Male",
		language: "EN",
	},
	{
		name: "Justin Joy",
		handle: "hyperfitx",
		tierLabel: "💎 Macro",
		followers: "156.8K",
		avgLikes: "556",
		engagement: "0.35%",
		engagementLevel: "LOW",
		location: "India",
		gender: "Male",
		language: "EN",
		verified: true,
	},
	{
		name: "SALONI S",
		handle: "salonipatelofficiall",
		tierLabel: "💎 Macro",
		followers: "566.6K",
		avgLikes: "18.3K",
		engagement: "3.24%",
		engagementLevel: "HIGH",
		location: "India",
		gender: "Female",
		language: "EN",
	},
];

export const SHOWCASE_HANDLES = SHOWCASE_CREATORS.map((creator) => creator.handle);

/**
 * The creator the story opens from the results list. Screens 4 and 5 are this
 * profile, so their name and stats have to keep matching this row.
 */
export const PROFILED_HANDLE = "sellydsouzaaa";

/** Resolves a row so screens never restate a creator's name or figures. */
export function creatorByHandle(handle: string): Creator {
	const creator = [...RESULT_CREATORS, ...SHOWCASE_CREATORS].find((row) => row.handle === handle);
	if (!creator) throw new Error(`workflowMockup: no creator with handle "${handle}"`);
	return creator;
}

/**
 * The two rows the story compares, in the order screen 9 columns them: the
 * creator it just profiled, then the list's other member. These are exactly
 * `LIST_CREATORS`, which is what screen 8 paints as already ticked.
 */
export const COMPARED_HANDLES = [PROFILED_HANDLE, "pooo.raw"] as const;

/**
 * The story list's members, and so the rows screen 8 draws.
 *
 * Poorav and Justin are the list's standing members — the two the add-to-list
 * dialog already shows on screen 6 — and Selwyn is the one the story adds there,
 * so by screen 7 the list holds three. He leads because screens 8 and 9 are about
 * the creator just profiled.
 */
export const LIST_CREATORS: Creator[] = [PROFILED_HANDLE, "pooo.raw", "hyperfitx"].map((handle) => ({
	...creatorByHandle(handle),
	checked: (COMPARED_HANDLES as readonly string[]).includes(handle),
}));

/**
 * The list the story adds that creator to. Screen 6 marks this row so the cursor
 * can find it; it is also the only card on screen 7.
 */
export const STORY_LIST = "Vox Pop";

/**
 * The handle the story types into the Lookalike field on screens 1-2, which is
 * then echoed by the results header's Creator Lookalike chip. The typing
 * animation reads it out of the rendered field, so this is the only place it is
 * written — see AnalyzeFilterSidebar.astro's [data-wf-handle-value].
 *
 * Has to stay a different creator from `PROFILED_HANDLE`: the seed can't also be
 * the row the story opens, since that would select a creator as its own lookalike.
 * It does legitimately appear *among* the results, which is what the app does.
 */
export const LOOKALIKE_HANDLE = "hyperfitx";

/** The tier the story picks in the rail, read out of `FOLLOWER_TIERS`. */
const PICKED_TIER = FOLLOWER_TIERS.find((tier) => "selected" in tier && tier.selected)?.label ?? "";

/**
 * Every filter the story applies, in the order `buildGroups` in
 * analyze_applied_filters_bar.dart appends them. The strip is wider than the
 * results panel at this many groups, which is why it fades at its right edge.
 */
export const RESULT_FILTERS = [
	{ label: "Platform", value: "Instagram" },
	{ label: "Sort", value: "Audience Lookalikes" },
	{ label: "Audience Lookalike", value: `@${LOOKALIKE_HANDLE}` },
	{ label: "Creator Location", value: "India" },
	{ label: "Follower Count", value: PICKED_TIER },
] as const;

/**
 * The only list in the story, and the one screen 6 adds a creator to.
 *
 * `count` and `preview` are what the *dialog* shows: the list before the story
 * touches it, so Poorav and Justin. Screen 7 renders it after the add, so it
 * counts `LIST_CREATORS` instead and the two never have to be kept in step.
 *
 * `preview` is whose portraits fill a card's tiles; a list this small simply
 * draws fewer of them.
 */
export const CREATOR_LISTS = [
	{
		name: STORY_LIST,
		count: 2,
		updated: "last updated 2m ago",
		preview: ["pooo.raw", "hyperfitx"],
	},
] as const;

/**
 * Media-kit tiles, growth charts and pricing shown on the creator profile and
 * the compare screen.
 *
 * `axis` is the bar's two end labels, and `marker`/`median` are positions along
 * it as a percentage of its width. The app derives all three from the rate and
 * the tier median — `EngagementGraph` takes `min = median x 0.5` and
 * `max = rate x 1.5` — so they are computed here the same way rather than eyeballed.
 *
 * The two growth series are **raw monthly values, not positions**: everything
 * drawn from them — the padded scale, the gridlines, their compact labels and
 * the line itself — is derived in `data/mediaKitCharts.ts`, exactly as the app
 * derives it. So they are the one place a figure can be edited, and the last
 * month of each has to stay in step with the tile above it: `followerGrowth`
 * ends on `followers` and `likesGrowth` on `likes`.
 *
 * `priceBars` are the four Instagram post types in `MediaKitPricingHelper.igGroups`
 * order. The headline range is the min and max across them, so it is derived too.
 */
export const MEDIA_KIT_STATS = {
	selwyn: {
		engagement: "4.73%",
		tier: "💎 Macro Influencer",
		headline: "Macro Influencer (100k - 1M followers)",
		followers: "190K",
		posts: "2.1K",
		reelViews: "137K",
		likes: "9.01K",
		comments: "66",
		level: "high",
		// 4.73 against a 1.01 median: 0.5x1.01 to 1.5x4.73.
		axis: ["0.5", "7.1"],
		marker: 64,
		median: 8,
		followerGrowth: [
			{ month: "feb", value: 178_500 },
			{ month: "mar", value: 180_700 },
			{ month: "apr", value: 186_000 },
			{ month: "may", value: 189_200 },
			{ month: "jun", value: 192_700 },
			{ month: "jul", value: 192_100 },
			{ month: "aug", value: 190_373 },
		],
		likesGrowth: [
			{ month: "feb", value: 3_460 },
			{ month: "mar", value: 5_300 },
			{ month: "apr", value: 10_500 },
			{ month: "may", value: 17_500 },
			{ month: "jun", value: 22_950 },
			{ month: "jul", value: 13_500 },
			{ month: "aug", value: 9_010 },
		],
		priceBars: [
			{ label: "per reel", min: 965, max: 1_400 },
			{ label: "per story", min: 563, max: 844 },
			{ label: "per post", min: 804, max: 1_200 },
			{ label: "per carousel", min: 884, max: 1_300 },
		],
	},
	poorav: {
		engagement: "2.62%",
		tier: "💎 Macro Influencer",
		headline: "Macro Influencer (100k - 1M followers)",
		followers: "282K",
		posts: "395",
		reelViews: "123K",
		likes: "7.4K",
		comments: "18",
		level: "high",
		// 2.62 against the same median, so the axis stops short of Selwyn's.
		axis: ["0.5", "3.9"],
		marker: 62,
		median: 15,
		followerGrowth: [
			{ month: "feb", value: 277_800 },
			{ month: "mar", value: 279_900 },
			{ month: "apr", value: 285_000 },
			{ month: "may", value: 287_000 },
			{ month: "jun", value: 285_300 },
			{ month: "jul", value: 283_600 },
			{ month: "aug", value: 282_150 },
		],
		likesGrowth: [
			{ month: "feb", value: 9_300 },
			{ month: "mar", value: 9_350 },
			{ month: "apr", value: 9_400 },
			{ month: "may", value: 9_920 },
			{ month: "jun", value: 7_900 },
			{ month: "jul", value: 6_820 },
			{ month: "aug", value: 7_400 },
		],
		priceBars: [
			{ label: "per reel", min: 1_300, max: 1_900 },
			{ label: "per story", min: 740, max: 1_100 },
			{ label: "per post", min: 1_100, max: 1_600 },
			{ label: "per carousel", min: 1_200, max: 1_700 },
		],
	},
} as const;

/**
 * The currency the pricing card quotes in, and the factors under it.
 *
 * Both are shared rather than per creator: the app reads the symbol from the
 * media kit's `currency` field, and the factors from `price_explanations`, whose
 * descriptions are a fixed set of sentences chosen by band. Every creator the
 * story shows lands in the same bands, so both columns really do read the same —
 * which is why they live here rather than being copied into each one.
 *
 * Order is `MediaKitPricingHelper.factorOrder`: follower level, engagement,
 * audience location, audience credibility.
 */
export const PRICING = {
	currency: "$",
	factors: [
		"Follower count is within the mid-range, representing moderate reach and visibility.",
		"Engagement rate is within the average range, reflecting standard audience interaction levels.",
		"Audience is primarily in Tier 3 countries, where purchasing power and prices are lower.",
		"Audience credibility score is average, indicating a mix of authentic and general followers.",
	],
} as const;

/**
 * The About tab's profile block for the creator the story opens. Kept beside the
 * row rather than in the screen so the two can't state different follower counts.
 */
export const PROFILED_ABOUT = {
	followersInFull: "190,373",
	topGender: { value: "Male", share: "50.4%" },
	topCountry: { value: "India", share: "90.3%" },
	bio: "humour based on your pain\nrepped by @circuitmgmt\n\u{1F4E7} - selly@circuitmgmt.com",
} as const;

/**
 * The tier copy under a media kit's benchmark bar. Every creator the story shows
 * is macro, so the median and the paragraph are the same figures for all of them
 * — the *bar* is not shared, which is why `axis`/`marker`/`median` sit per creator
 * in `MEDIA_KIT_STATS` above.
 *
 * Kept here rather than in either screen because the Media Kit tab and both
 * compare columns render it, and they used to hold their own copies.
 */
export const MACRO_BENCHMARK = {
	medianLabel: "1.01%",
	body: [
		{ text: "Macro influencers", accent: true },
		{ text: " deliver broader reach, though engagement begins to taper. Maintaining above " },
		{ text: "1.01%", accent: true },
		{ text: " signals strong resonance even at scale." },
	],
} as const;
