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
 * The story list's members, and so the rows screen 8 draws. Both are `checked`
 * because the story ticks the pair on its way into Compare — screen 8's authored
 * frame paints them already selected.
 *
 * Poorav is the list's founding member; Selwyn is the one the story adds on
 * screen 6, so by screen 7 the list holds two.
 */
export const LIST_CREATORS: Creator[] = ["sellydsouzaaa", "pooo.raw"].map((handle) => {
	const row = RESULT_CREATORS.find((creator) => creator.handle === handle);
	if (!row) throw new Error(`workflowMockup: no creator with handle "${handle}"`);
	return { ...row, checked: true };
});

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
		followers: "156.7k",
		avgLikes: "738",
		engagement: "0.47%",
		engagementLevel: "LOW",
		location: "India",
		gender: "Male",
		language: "EN",
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

export const RESULT_FILTERS = [
	{ label: "Platform", value: "Instagram" },
	{ label: "Sort", value: "Audience Lookalikes" },
	{ label: "Creator Location", value: "India" },
	{ label: "Audience Lookalike", value: `@${LOOKALIKE_HANDLE}` },
] as const;

/**
 * The only list in the story, and the one screen 6 adds a creator to.
 *
 * `count` is what the *dialog* shows — the list before the story touches it, so
 * Poorav alone. Screen 7 renders it after the add, so it counts `LIST_CREATORS`
 * instead and the two never have to be kept in step by hand.
 *
 * `preview` is whose portraits fill a card's tiles; a list this small simply
 * draws fewer of them.
 */
export const CREATOR_LISTS = [
	{
		name: STORY_LIST,
		count: 1,
		updated: "last updated 2m ago",
		preview: ["pooo.raw"],
	},
] as const;

/**
 * Media-kit tiles shown on the creator profile and the compare screen.
 *
 * `axis` is the bar's two end labels, and `marker`/`median` are positions along
 * it as a percentage of its width. The app derives all three from the rate and
 * the tier median — `EngagementGraph` takes `min = median x 0.5` and
 * `max = rate x 1.5` — so they are computed here the same way rather than eyeballed.
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
	},
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
