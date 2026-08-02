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
	checked?: boolean;
}

/**
 * The four rows the story's list holds — screen 8 renders exactly these, and
 * they open the results list on screen 3.
 *
 * Real creator figures pulled from the app. Slots are deliberately in the order
 * the animation was authored against: `checked` sits on rows 1 and 3, which are
 * the two the cursor ticks for Compare, and the profiled creator stays third so
 * beat 2's press lands where it always did.
 */
export const CREATORS: Creator[] = [
	{
		name: "KAWAL",
		handle: "kawalofficial",
		tierLabel: "💎 Macro",
		followers: "202.4K",
		avgLikes: "3.1K",
		engagement: "1.52%",
		engagementLevel: "AVERAGE",
		location: "India",
		language: "EN",
		checked: true,
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
		checked: true,
	},
	{
		name: "Gaelyn Mendonca",
		handle: "vjgaelyn",
		tierLabel: "💎 Macro",
		followers: "916.3K",
		avgLikes: "2.2K",
		engagement: "0.24%",
		engagementLevel: "LOW",
		location: "India",
		language: "EN",
	},
];

/**
 * Padding for the Analyze results list so it has somewhere to scroll. Only the
 * single-line analyze row is ever drawn for these, so their location and
 * language never reach the screen.
 */
const RESULT_PADDING: Creator[] = [
	{
		name: "Hamid Barkzi",
		handle: "hamidbarkzi07",
		tierLabel: "💎 Macro",
		followers: "391.5K",
		avgLikes: "5.7K",
		engagement: "1.46%",
		engagementLevel: "AVERAGE",
		location: "India",
		language: "EN",
	},
	{
		name: "Kavian Almasifar",
		handle: "kevinalmasifar",
		tierLabel: "💎 Macro",
		followers: "335.3K",
		avgLikes: "7.9K",
		engagement: "2.35%",
		engagementLevel: "ABOVE AVERAGE",
		location: "India",
		language: "EN",
	},
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
		name: "Raghu Dixit",
		handle: "theraghudixitproject",
		tierLabel: "💎 Macro",
		followers: "451.1K",
		avgLikes: "2.5K",
		engagement: "0.56%",
		engagementLevel: "LOW",
		location: "India",
		language: "EN",
	},
];

/**
 * The Analyze results list — the four signed-off rows first, then padding, so
 * screen 3's opening frame is unchanged and the extra rows only show once the
 * list scrolls. `CREATORS` stays at four because screen 8 renders it at the
 * taller list density and would clip.
 */
export const RESULT_CREATORS: Creator[] = [...CREATORS, ...RESULT_PADDING];

/**
 * The three rows the features page's creator showcase draws, top to bottom.
 * The strip fades out towards its foot, so the order is a display choice rather
 * than a ranking — whoever leads is the one read in full.
 */
export const SHOWCASE_HANDLES = [
	"nikhilchinapa",
	"hyperfitx",
	"salonipatelofficiall",
] as const;

/**
 * The creator the story opens from the results list. Screens 4 and 5 are this
 * profile, so their name and stats have to keep matching this row.
 */
export const PROFILED_HANDLE = "hyperfitx";

/** Resolves a row so screens never restate a creator's name or figures. */
export function creatorByHandle(handle: string): Creator {
	const creator = RESULT_CREATORS.find((row) => row.handle === handle);
	if (!creator) throw new Error(`workflowMockup: no creator with handle "${handle}"`);
	return creator;
}

/**
 * The two rows the story ticks for Compare, in the order screen 9 columns them:
 * the creator we just profiled, then the one nearest his follower range. Must
 * stay in step with the `checked` flags above, which paint the same two rows in
 * screen 8's authored frame.
 */
export const COMPARED_HANDLES = [PROFILED_HANDLE, "kawalofficial"] as const;

/**
 * The list the story adds that creator to. Screen 6 marks this row so the cursor
 * can find it; it is also the first card on screen 7.
 */
export const STORY_LIST = "Zamna Campaign 2026";

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
export const LOOKALIKE_HANDLE = "salonipatelofficiall";

export const RESULT_FILTERS = [
	{ label: "Platform", value: "Instagram" },
	{ label: "Sort", value: "Audience Lookalikes" },
	{ label: "Creator Location", value: "India" },
	{ label: "Audience Lookalike", value: `@${LOOKALIKE_HANDLE}` },
] as const;

/**
 * The card's fourth avatar tile shows `count - 3`, so overflow is derived.
 *
 * `preview` is whose portraits fill a card's tiles — four, since screen 6's rows
 * show that many and screen 7's cards show three plus the overflow count. The
 * story list previews its own members; the other two are only ever seen as
 * thumbnails, so they just draw from the same seven creators.
 */
export const CREATOR_LISTS = [
	{
		name: "Zamna Campaign 2026",
		count: 12,
		updated: "last updated 2m ago",
		preview: ["kawalofficial", "salonipatelofficiall", "hyperfitx", "vjgaelyn"],
	},
	{
		name: "Steelcase XV",
		count: 19,
		updated: "last updated 5d ago",
		preview: ["vjgaelyn", "theraghudixitproject", "hamidbarkzi07", "kevinalmasifar"],
	},
	{
		name: "Mokobora XV",
		count: 17,
		updated: "last updated 5d ago",
		preview: ["kevinalmasifar", "hamidbarkzi07", "salonipatelofficiall", "theraghudixitproject"],
	},
] as const;

/**
 * Media-kit tiles shown on the creator profile and the compare screen.
 *
 * `followers` here is the media kit's aggregated total across platforms, so it
 * legitimately differs from the per-platform figure in `CREATORS` (157K vs
 * 156.7k) — the app shows the same split.
 */
export const MEDIA_KIT_STATS = {
	justin: {
		engagement: "0.47%",
		tier: "💎 Macro Influencer",
		headline: "Macro Influencer (100k - 1M followers)",
		followers: "157K",
		posts: "1.14K",
		reelViews: "31.4K",
		likes: "738",
		comments: "21",
		level: "low",
		// 0.47 against a 1.01 median: 0.5x0.47 to 1.5x1.01.
		axis: ["0.2", "1.5"],
		marker: 21,
		median: 50,
	},
	kawal: {
		engagement: "1.52%",
		tier: "💎 Macro Influencer",
		headline: "Macro Influencer (100k - 1M followers)",
		followers: "202.4K",
		// `posts` and `reelViews` are the only figures here not taken from the app —
		// they are not on the results row, so they need KAWAL's own media kit.
		posts: "1.08K",
		reelViews: "62.3K",
		likes: "3.1K",
		// Sized so likes + comments ≈ the 1.52% rate on 202.4K followers.
		comments: "26",
		level: "average",
		// 1.52 against the same median: 0.5x1.01 to 1.5x1.52, so his rate sits
		// above the median rather than off the end of Justin's narrower axis.
		axis: ["0.5", "2.3"],
		marker: 57,
		median: 28,
	},
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
