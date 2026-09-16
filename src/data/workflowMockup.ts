/**
 * Dummy content for the hero product-workflow animation.
 *
 * These are illustrative figures for the marketing site only — the real app
 * fetches this from the API. Kept in one place so copy tweaks never mean
 * hunting through ten screen components.
 */

/**
 * Whoever is signed in. `handle` is only how the nav finds their photo in
 * profile_images — they are the operator, so deliberately not in `CREATORS`.
 */
export const APP_USER = { name: "Harsh", handle: "harsh" } as const;

/** Profiles a search analyses — the results header's "Analyzed 10", and the bill. */
export const ANALYZED_COUNT = 10;

/** The app charges per creator: 5 to analyse one, 50 to unlock one's profile. */
const PER_ANALYZED = 5;
const PER_UNLOCK = 50;

const CREDITS_START = 2540;
const SEARCH_COST = ANALYZED_COUNT * PER_ANALYZED;

/**
 * The nav credits chip at each point the story spends. Every screen is authored
 * holding the balance it should show, and the beats tick the chip on the layer the
 * spend happens on — so the following swap lands on a chip already reading right.
 *
 * The story spends exactly twice, and *where* is the whole argument for shortlists:
 * `afterSearch` on Apply & Search, then `afterProfile` when the shortlist opens a
 * creator — `CreatorDetail` watches `mediaKitByProfileKeyPod`, so opening one is
 * what fires GET /mkit and bills the 50. Saving to a shortlist opens nobody, so it
 * is free; and promoting an already-opened creator to a list is free too, because
 * the dialog charges "50 credits per *new* unlock" and this one is already bought.
 * Hence only three balances for thirteen steps.
 */
export const CREDITS = {
	start: CREDITS_START,
	afterSearch: CREDITS_START - SEARCH_COST,
	afterProfile: CREDITS_START - SEARCH_COST - PER_UNLOCK,
} as const;

/** The chip's thousands separator — shared so the tween writes what the nav rendered. */
export const formatCredits = (value: number) => value.toLocaleString("en-US");

/** Parameter dropdown options, in the app's `DiscoveryFilter` order. */
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
 * Rail scroll (rem) that brings the follower-tier list to the top. Screens 3-5 are
 * authored here and beat 1 scrolls to it, so both land on the same pixels.
 */
export const RAIL_TIER_SCROLL = 36.4375;

/**
 * `benchmark` is the tier's Instagram average engagement cut, from the app's
 * `engagementRateBenchmarks` — the slider's minimum and screen 5's Category Median.
 */
export const FOLLOWER_TIERS = [
	{ label: "🚀 Nano Influencer", range: "1k - 10k followers", benchmark: "2.42%" },
	{ label: "🔥 Micro Influencer", range: "10k - 50k followers", benchmark: "0.98%" },
	{ label: "⭐ Mid-Tier Influencer", range: "50k - 100k followers", benchmark: "0.88%" },
	{ label: "💎 Macro Influencer", range: "100k - 1M followers", benchmark: "1.01%", selected: true },
	{ label: "👑 Mega Influencer", range: "1M+ followers", benchmark: "1.15%" },
] as const;

/**
 * Engagement quality band, uppercased as the app prints it. Bands are fixed by
 * platform and tier; for Instagram macro the cuts are 2.53 / 1.53 / 1.01 / 0.66.
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
 * The Analyze results, in the app's ranked order — seven rows so the list can
 * scroll. Figures are real, pulled from the app against the `hyperfitx` seed.
 */
export const RESULT_CREATORS: Creator[] = [
	{
		name: "Selwyn D'souza",
		handle: "sellydsouzaaa",
		tierLabel: "💎 Macro",
		followers: "188.0K",
		avgLikes: "10.6K",
		engagement: "5.62%",
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
		followers: "189.8K",
		avgLikes: "4.9K",
		engagement: "2.56%",
		engagementLevel: "HIGH",
		location: "India",
		gender: "Male",
		language: "EN",
		verified: true,
	},
	{
		name: "Poorav",
		handle: "pooravw",
		tierLabel: "💎 Macro",
		followers: "273.9K",
		avgLikes: "4.1K",
		engagement: "1.50%",
		engagementLevel: "AVERAGE",
		location: "Bangalore, India",
		gender: "Male",
		language: "EN",
		verified: true,
	},
	{
		name: "AevyTV",
		handle: "aevytvdaily",
		tierLabel: "💎 Macro",
		followers: "533.3K",
		avgLikes: "10.7K",
		engagement: "2.01%",
		engagementLevel: "ABOVE AVERAGE",
		location: "India",
		language: "EN",
		verified: true,
	},
	{
		name: "Shreyas N Rao",
		handle: "bengaluru_nakshe",
		tierLabel: "💎 Macro",
		followers: "321.2K",
		avgLikes: "5.1K",
		engagement: "1.59%",
		engagementLevel: "ABOVE AVERAGE",
		location: "Bangalore, India",
		gender: "Male",
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
 * The features page's showcase rows. Its own cast on purpose — that strip has no
 * reason to move when the story's cast does.
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

/** The creator the story opens. Screens 4 and 5 are this profile. */
export const PROFILED_HANDLE = "sellydsouzaaa";

/** Resolves a row so screens never restate a creator's name or figures. */
export function creatorByHandle(handle: string): Creator {
	const creator = [...RESULT_CREATORS, ...SHOWCASE_CREATORS].find((row) => row.handle === handle);
	if (!creator) throw new Error(`workflowMockup: no creator with handle "${handle}"`);
	return creator;
}

/**
 * The two rows the story compares, in screen 9's column order. Exactly the
 * `LIST_CREATORS` screen 8 paints as already ticked.
 */
export const COMPARED_HANDLES = [PROFILED_HANDLE, "pooravw"] as const;

/**
 * The story list's members, and so screen 8's rows. Poorav and Justin are standing
 * members (what the dialog shows on screen 6); Selwyn is the one the story adds, and
 * leads because screens 8-9 are about the creator just profiled.
 */
export const LIST_CREATORS: Creator[] = [PROFILED_HANDLE, "pooravw", "hyperfitx"].map((handle) => ({
	...creatorByHandle(handle),
	checked: (COMPARED_HANDLES as readonly string[]).includes(handle),
}));

/**
 * The app runs one set of screens for both, swapping the word and the accent —
 * `models/list_type.dart`. Screens take this rather than a boolean so a call site
 * reads the way the app's own does.
 */
export type ListType = "list" | "shortlist";

/** The list the story adds to — marked on the dialog's List tab, the only card on Lists. */
export const STORY_LIST = "Vox Pop";

/** The shortlist the story saves into, straight off the Analyze results. */
export const STORY_SHORTLIST = "Bangalore Scout";

/**
 * The three rows the story ticks in the results and bulk-adds to the shortlist.
 * Selwyn leads because he is the one it goes on to open; the other two are chosen
 * for *not* being in `LIST_CREATORS`, so when only Selwyn is promoted you can see
 * the two that stayed behind.
 */
export const SHORTLIST_HANDLES = [PROFILED_HANDLE, "neeraj__", "bengaluru_nakshe"] as const;

/**
 * Nothing here is ticked: the story opens Selwyn from these rows and promotes him
 * from his own panel, so it never comes back to select anybody. An earlier cut did,
 * and this was where its selection was authored.
 */
export const SHORTLIST_CREATORS: Creator[] = SHORTLIST_HANDLES.map(creatorByHandle);

/**
 * A row's Media Kit column. `locked` is the app's blank cell — `buildMediaKitCell`
 * returns a `SizedBox.shrink()` rather than any placeholder, so an unbought creator
 * shows *nothing* there. `synced` is the creator's own data version, `d MMM yyyy`.
 */
export type MediaKitState =
	| { status: "locked" }
	| { status: "latest" | "past"; synced: string };

/**
 * What the account already owns when the story opens — the mockup's stand-in for
 * `purchasedMediakitsPod`.
 *
 * **One map for the whole app, not one per screen.** A kit is bought per *profile*,
 * so wherever that creator turns up — the Analyze results, a shortlist, a list — the
 * same cell shows; Analyze and the list screens both read that one pod. Poorav and
 * Justin are standing members of the story's list, and being in a list is what buys
 * the kit, so both were already paid for long before the story starts.
 *
 * Poorav's values are the app's own, read off a live Analyze row. Justin never
 * appears in a search here, so his are ours — and he carries the stale one, which is
 * what keeps the column's second state on screen now that Poorav's snapshot is
 * fresh. A kit goes stale after 15 days.
 */
export const PURCHASED_MEDIA_KITS: Record<string, MediaKitState> = {
	pooravw: { status: "latest", synced: "6 Sep 2026" },
	hyperfitx: { status: "past", synced: "20 Aug 2026" },
};

/**
 * Who has reach-out details, and so a live Enquire button — `enquireReadyPod`, which
 * is `hasReachOut(contactDetails)` and **not** the same question as "is the media kit
 * bought".
 *
 * Analyze rows never render it at all: `showEnquireButton: reachOutFilterOn`, and the
 * story applies no Reach Out filter. Poorav is only ever in the list, so list detail
 * is the one screen his live button shows up on — the shortlist holds a different
 * three, and his locked contact chip on Analyze is a separate question from this one.
 */
export const CONTACTABLE = new Set<string>([PROFILED_HANDLE, "pooravw"]);

/**
 * The one kit the story itself buys, when the shortlist opens Selwyn. Held apart
 * from `PURCHASED_MEDIA_KITS` because the story has a before and an after: every
 * screen up to that press must show him blank, and every screen after it must show
 * this — which is what makes the 50 credits legible.
 */
export const STORY_UNLOCK: MediaKitState = { status: "latest", synced: "12 Sep 2026" };

/**
 * The account's kits as a screen sees them. `unlocked` folds in the story's own
 * purchase, so a screen asks the question the app asks — "has this profile been
 * bought?" — rather than restating an answer per screen.
 *
 * A **list** row is never blank: joining a list is what buys the kit, so every member
 * is purchased by definition. Only a shortlist can show the empty cell.
 */
export const mediaKitsFor = (unlocked = false): Record<string, MediaKitState> =>
	unlocked ? { ...PURCHASED_MEDIA_KITS, [PROFILED_HANDLE]: STORY_UNLOCK } : PURCHASED_MEDIA_KITS;

/**
 * The lookalike seed the story types on screens 1-2. Written only here — the typing
 * animation reads it back out of the rendered field. Must stay different from
 * `PROFILED_HANDLE`, or the story would open a creator as its own lookalike.
 */
export const LOOKALIKE_HANDLE = "hyperfitx";

/** The tier the story picks in the rail, read out of `FOLLOWER_TIERS`. */
const PICKED_TIER = FOLLOWER_TIERS.find((tier) => "selected" in tier && tier.selected)?.label ?? "";

/**
 * Every filter the story applies, in the app's `buildGroups` order. At this many
 * groups the strip outgrows the results panel, hence the fade at its right edge.
 */
export const RESULT_FILTERS = [
	{ label: "Platform", value: "Instagram" },
	{ label: "Sort", value: "Audience Lookalikes" },
	{ label: "Audience Lookalike", value: `@${LOOKALIKE_HANDLE}` },
	{ label: "Creator Location", value: "India" },
	{ label: "Follower Count", value: PICKED_TIER },
] as const;

/**
 * The only list in the story. `count`/`preview` are what the *dialog* shows — the
 * list before the add. Screen 7 counts `LIST_CREATORS` instead, so the two never
 * have to be kept in step. `preview` is whose portraits fill a card's tiles.
 */
export const CREATOR_LISTS = [
	{
		name: STORY_LIST,
		count: 2,
		updated: "last updated 2m ago",
		preview: ["pooravw", "hyperfitx"],
	},
] as const;

/**
 * The ShortLists tab's one card, as `CREATOR_LISTS` above: `count`/`preview` are the
 * *dialog's* figures, the shortlist before the add. It starts empty because the
 * story is what first fills it — which is also why the dialog's ShortList tab has no
 * search bar, there being nothing yet to search.
 */
export const CREATOR_SHORTLISTS = [
	{
		name: STORY_SHORTLIST,
		count: 0,
		updated: "last updated just now",
		preview: [] as readonly string[],
	},
] as const;

/**
 * Whose portraits the dialog drops into a row's grid when Add is pressed, per tab.
 * Three into the shortlist — the results rows the story ticked — and then just the
 * one into the list, because only the creator it actually opened gets promoted.
 */
export const DIALOG_ADDS = {
	shortlist: SHORTLIST_HANDLES,
	list: [PROFILED_HANDLE],
} as const satisfies Record<ListType, readonly string[]>;

/**
 * Media-kit tiles, growth charts and pricing for the profile and compare screens.
 *
 * `axis`/`marker`/`median` follow the app's `EngagementGraph`: min = median x 0.5,
 * max = rate x 1.5. The growth series are **raw monthly values, not positions** —
 * scale, gridlines, labels and the line are all derived in `data/mediaKitCharts.ts`,
 * so this is the only place a figure is edited. Each series' last month must match
 * the tile above it (`followerGrowth` → `followers`, `likesGrowth` → `likes`).
 * `priceBars` are the four Instagram post types in `igGroups` order; the headline
 * range is derived from them.
 */
export const MEDIA_KIT_STATS = {
	selwyn: {
		engagement: "5.62%",
		tier: "💎 Macro Influencer",
		headline: "Macro Influencer (100k - 1M followers)",
		followers: "188K",
		posts: "2.1K",
		reelViews: "137K",
		likes: "10.6K",
		comments: "66",
		level: "high",
		// 5.62 against a 1.01 median: 0.5x1.01 to 1.5x5.62.
		axis: ["0.5", "8.4"],
		marker: 65,
		median: 6,
		followerGrowth: [
			{ month: "mar", value: 178_500 },
			{ month: "apr", value: 180_700 },
			{ month: "may", value: 186_000 },
			{ month: "jun", value: 189_200 },
			{ month: "jul", value: 190_400 },
			{ month: "aug", value: 189_100 },
			{ month: "sep", value: 188_037 },
		],
		likesGrowth: [
			{ month: "mar", value: 3_460 },
			{ month: "apr", value: 5_300 },
			{ month: "may", value: 10_500 },
			{ month: "jun", value: 17_500 },
			{ month: "jul", value: 22_950 },
			{ month: "aug", value: 13_500 },
			{ month: "sep", value: 10_600 },
		],
		priceBars: [
			{ label: "per reel", min: 965, max: 1_400 },
			{ label: "per story", min: 563, max: 844 },
			{ label: "per post", min: 804, max: 1_200 },
			{ label: "per carousel", min: 884, max: 1_300 },
		],
	},
	poorav: {
		engagement: "1.50%",
		tier: "💎 Macro Influencer",
		headline: "Macro Influencer (100k - 1M followers)",
		followers: "274K",
		posts: "433",
		reelViews: "83.3K",
		likes: "4.12K",
		comments: "12",
		level: "average",
		// 1.50 against the same median: 0.5x1.01 to 1.5x1.50, so 2.25 rounds to 2.3.
		axis: ["0.5", "2.3"],
		marker: 57,
		median: 29,
		followerGrowth: [
			{ month: "mar", value: 279_400 },
			{ month: "apr", value: 285_100 },
			{ month: "may", value: 286_300 },
			{ month: "jun", value: 284_300 },
			{ month: "jul", value: 281_100 },
			{ month: "aug", value: 276_500 },
			{ month: "sep", value: 273_900 },
		],
		likesGrowth: [
			{ month: "mar", value: 9_280 },
			{ month: "apr", value: 9_240 },
			{ month: "may", value: 9_900 },
			{ month: "jun", value: 7_990 },
			{ month: "jul", value: 6_870 },
			{ month: "aug", value: 4_660 },
			{ month: "sep", value: 4_120 },
		],
		priceBars: [
			{ label: "per reel", min: 1_300, max: 1_900 },
			{ label: "per story", min: 743, max: 1_100 },
			{ label: "per post", min: 1_100, max: 1_600 },
			{ label: "per carousel", min: 1_200, max: 1_800 },
		],
	},
} as const;

/**
 * The export dialog's column picker — `list/widgets/export_dialog.dart` for
 * Instagram, which is the only platform the story uses.
 *
 * The app builds the Available list as mandatory columns first, then everything
 * else **sorted by label**, groups included — so this is one alphabetical run, not
 * a hand-ordered one. `group` rows are collapsible parents over child columns and
 * `count` rows hide a 1–5 picker behind the same chevron; the story opens neither,
 * so only the chevron is reproduced.
 */
export interface ExportColumn {
	label: string;
	/** Always exported: ticked, dimmed and not clickable. */
	mandatory?: boolean;
	/** Draws the chevron — a collapsible group or a count picker. */
	expandable?: boolean;
}

export const EXPORT_MANDATORY: readonly ExportColumn[] = [
	{ label: "Username", mandatory: true },
	{ label: "Profile URL", mandatory: true },
	{ label: "Full Name", mandatory: true },
];

export const EXPORT_OPTIONAL: readonly ExportColumn[] = [
	{ label: "Audience % (Female)" },
	{ label: "Audience % (Male)" },
	{ label: "Audience Age and Gender Split" },
	{ label: "Audience Interest" },
	{ label: "Average Reel Views" },
	{ label: "Avg Likes" },
	{ label: "Bio" },
	{ label: "Contact Details", expandable: true },
	{ label: "Creator Age Group" },
	{ label: "Creator City" },
	{ label: "Creator Country" },
	{ label: "Creator State" },
	{ label: "Credibility Score", expandable: true },
	{ label: "Engagement Rate" },
	{ label: "Followers" },
	{ label: "Gender" },
	{ label: "Language" },
	{ label: "Pricing", expandable: true },
	{ label: "Top Cities (Audience)", expandable: true },
	{ label: "Top Countries (Audience)", expandable: true },
	{ label: "Verified" },
];

/**
 * Ticked the moment the dialog opens — `_defaultSelectedForPlatform`. The three
 * mandatory columns plus the two metrics, and `_selectedOrder` keeps them in this
 * order, which is why the Selected pane reads the same way.
 */
export const EXPORT_SELECTED = ["Username", "Profile URL", "Full Name", "Followers", "Engagement Rate"] as const;

/** The two the story ticks, in the order it ticks them — appended to Selected. */
export const EXPORT_ADDS = ["Audience Interest", "Language"] as const;

/**
 * The day the story happens on, and every date the mockup states against it.
 * Held together so they cannot drift: the share link's expiry read `7 Aug` for a
 * good while after the media kits had moved into September.
 */
export const STORY_DATE = {
	/** The export job's stamp — `IoNotificationButton`'s `d MMMM HH:mm`. */
	exportedAt: "16 September 17:24",
	/**
	 * The share picker's default, `d MMM` of **today + 7** — `ShareModal`'s
	 * `DateTime.now().add(const Duration(days: 7))`. 16 Sep → 23 Sep.
	 */
	shareExpiry: "23 Sep",
} as const;

/**
 * The finished job the header popover opens with — `IoNotificationButton`
 * auto-opens on completion with that job expanded. `rows` is the selection the
 * export ran over, so it has to be the pair the list screen ticked.
 */
export const EXPORT_JOB = {
	title: STORY_LIST,
	at: STORY_DATE.exportedAt,
	rows: COMPARED_HANDLES.length,
} as const;

/**
 * The pricing card's currency and driving factors. Shared, not per creator: the app
 * picks factor sentences by band, and every creator the story shows lands in the
 * same bands. Order is the app's `factorOrder`.
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

/** The About tab's profile block, kept beside the row so their figures can't drift. */
export const PROFILED_ABOUT = {
	followersInFull: "188,037",
	topGender: { value: "Male", share: "50.4%" },
	topCountry: { value: "India", share: "90.3%" },
	bio: "humour based on your pain\nrepped by @circuitmgmt\n\u{1F4E7} - selly@circuitmgmt.com",
} as const;

/**
 * Tier copy under a media kit's benchmark bar. Shared because every creator the story
 * shows is macro — the *bar* is not, which is why `axis`/`marker`/`median` stay per
 * creator in `MEDIA_KIT_STATS`. Here, not in a screen: three call sites render it.
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
