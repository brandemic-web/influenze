/**
 * Shared copy for the six SEO landing templates (Content Playbook docs 01–06). The per-page
 * copy is in Sanity; what lives here is what must read the same on every page — the approved
 * product facts, the mandatory comparison rows, default section headings and boundary wording —
 * so an editor can't drift from the playbook's claims rules one page at a time.
 */
import { APP_URL } from "./site";
import type { WorkflowIconName } from "./workflowIcons";

/** The six templates. Each is one Sanity document type and one route prefix. */
export type LandingType =
	| "comparisonPage"
	| "alternativePage"
	| "icpPage"
	| "platformPage"
	| "featurePage"
	| "pricingGuide";

/**
 * Where each template lives, and the breadcrumb's middle step. Features and pricing guides
 * nest under the existing /features and /pricing pages, which double as their hubs.
 */
export const LANDING_ROUTES: Record<LandingType, { prefix: string; crumb: string; hub: string }> = {
	comparisonPage: { prefix: "/compare", crumb: "Compare", hub: "/compare/" },
	alternativePage: { prefix: "/alternatives", crumb: "Alternatives", hub: "/alternatives/" },
	icpPage: { prefix: "/for", crumb: "Solutions", hub: "/for/" },
	platformPage: { prefix: "/platforms", crumb: "Platforms", hub: "/platforms/" },
	featurePage: { prefix: "/features", crumb: "Features", hub: "/features/" },
	pricingGuide: { prefix: "/pricing", crumb: "Pricing", hub: "/pricing/" },
};

/** The one place a landing page's address is spelled. */
export function landingHref(type: LandingType, slug: string): string {
	return `${LANDING_ROUTES[type].prefix}/${slug}/`;
}

/** Hub pages for the four prefixes that have no existing page to lean on. */
export const LANDING_HUBS = {
	comparisonPage: {
		title: "Influenze.ai compared",
		sub: "Side-by-side reviews of Influenze.ai and other creator discovery platforms, with the rows that matter for a buying decision.",
		metaTitle: "Influenze.ai Comparisons — Creator Discovery Platforms Side by Side",
	},
	alternativePage: {
		title: "Alternatives worth a look",
		sub: "When a platform's pricing, contract or scope doesn't fit, here is how Influenze.ai stands in as a focused discovery layer.",
		metaTitle: "Influenze.ai as an Alternative — Creator Discovery Without the Lock-in",
	},
	icpPage: {
		title: "Built for how your team works",
		sub: "How agencies, brands, talent managers and freelancers move from a brief to a defensible creator shortlist.",
		metaTitle: "Influenze.ai for Agencies, Brands and Talent Teams",
	},
	platformPage: {
		title: "Find creators on every platform",
		sub: "Search Instagram, YouTube and TikTok creators by niche, location, audience and engagement.",
		metaTitle: "Creator Search by Platform — Instagram, YouTube and TikTok",
	},
	empty: {
		title: "Nothing published here yet",
		body: "New pages are on their way. In the meantime, the features and pricing pages cover the product end to end.",
	},
} as const;

/** How each platform is named on the page. No LinkedIn until product confirms it is live. */
export const PLATFORM_LABELS = {
	instagram: "Instagram",
	youtube: "YouTube",
	tiktok: "TikTok",
	multi: "Instagram · YouTube · TikTok",
} as const;

/** The signup offer, as the playbook words it. Never "trial". */
export const STARTER_CREDITS = 500;

/**
 * The app icons an editor can put on a landing card — the hero mockup's own set, so the
 * landing pages draw with the same glyphs as the product. Order is the Studio's dropdown.
 */
export const LANDING_ICON_NAMES = [
	"search",
	"parameterMagic",
	"profileSearch",
	"usersRound",
	"users",
	"userRoundCheck",
	"chartColumnIncreasing",
	"chartCandlestick",
	"thumbsUp",
	"eyeSmall",
	"mkitUnlocked",
	"addToList",
	"list",
	"share",
	"export",
	"import",
	"mail",
	"phone",
	"coins",
	"hourglass",
	"mapPin",
	"badge",
	"galleryVertical",
	"circleCheck",
	"info",
	"redirect",
	"externalLink",
	"walkthrough",
] as const satisfies readonly WorkflowIconName[];

export type LandingIconName = (typeof LANDING_ICON_NAMES)[number];

/**
 * Proof chips under every hero. The playbook's approved facts, worded exactly as it requires
 * (450M+, never 460M+; three live platforms; credits, not a trial). `platforms` chips draw the
 * three platform tiles in place of an icon.
 */
export const PROOF_CHIPS: { label: string; icon?: LandingIconName; platforms?: true }[] = [
	{ label: "450M+ creator profiles", icon: "usersRound" },
	{ label: "Instagram, YouTube & TikTok", platforms: true },
	{ label: "Self-serve credits, no annual lock-in", icon: "coins" },
];

/** The platforms the product searches today, in the app's filter order. */
export const LIVE_PLATFORMS = ["instagram", "youtube", "tiktok"] as const;

/**
 * The comparison hero's graphic: the approved facts as the app draws them. The count runs
 * up to `value` on scroll; the markup already holds the final figure.
 */
export const COMPARISON_VISUAL = {
	profiles: { value: 450, suffix: "M+", label: "creator profiles to search" },
	refresh: { value: 15, suffix: " days", label: "data refreshed at least every" },
	creditsLabel: "Credits",
	/** Faces from the hero mockup's cast, so the two graphics read as one product. */
	creators: ["sellydsouzaaa", "neeraj__", "hyperfitx", "aevytvdaily"],
	shortlistLabel: "Shortlist ready to share",
	searchPlaceholder: "Describe the creators you need",
	/** Typed into the search bar on scroll; the playbook's own Instagram example brief. */
	searchQuery: "Skincare Reels creators in Pune, women 18–34",
	vs: "vs",
};

/**
 * The small product vignettes a card or deep dive can carry, drawn from the hero mockup's
 * parts (components/landing/AppVignette.astro). Editors pick one in Sanity; left blank, a
 * card takes the one its icon suggests.
 */
export const VIGNETTES = [
	{ value: "search", title: "Search — the brief typed into the app's search" },
	{ value: "lookalike", title: "Lookalike — creators orbiting a seed creator" },
	{ value: "analytics", title: "Analytics — a creator's engagement and reach" },
	{ value: "compare", title: "Compare — two creators side by side" },
	{ value: "shortlist", title: "Shortlist — a shared list card" },
	{ value: "credits", title: "Credits — what a brief spends from 500" },
	{ value: "steps", title: "Workflow — brief to shortlist, step by step" },
	{ value: "boundary", title: "Boundary — what's inside and outside the product" },
] as const;

export type VignetteKind = (typeof VIGNETTES)[number]["value"];

/** The vignette a card falls back to, from the icon it carries. */
export const VIGNETTE_FOR_ICON: Partial<Record<LandingIconName, VignetteKind>> = {
	search: "search",
	parameterMagic: "search",
	profileSearch: "lookalike",
	usersRound: "lookalike",
	users: "compare",
	chartColumnIncreasing: "analytics",
	chartCandlestick: "analytics",
	thumbsUp: "analytics",
	addToList: "shortlist",
	list: "shortlist",
	share: "shortlist",
	coins: "credits",
	hourglass: "steps",
	walkthrough: "steps",
};

/** Copy inside the vignettes. Figures are the hero mockup's own (data/workflowMockup.ts). */
export const VIGNETTE_COPY = {
	searchQuery: "Fitness creators like @hyperfitx",
	lookalikeLabel: "Lookalikes of",
	engagementLabel: "Engagement",
	followersLabel: "Followers",
	likesLabel: "Avg. likes",
	shareLabel: "Share",
	sharedLabel: "Shared with client",
	creditsOf: `of ${STARTER_CREDITS} credits`,
	inside: "Inside Influenze.ai",
	outside: "Your existing tools",
	outsideSteps: ["Outreach", "Campaign management", "Tracking", "Payments"],
};

/** Head-to-head rows whose Influenze.ai cell is drawn, not written. */
export const HEAD_TO_HEAD_GRAPHICS: Partial<Record<HeadToHeadRowId, "platforms" | "credits" | "database">> = {
	platforms: "platforms",
	credits: "credits",
};

/** Workflow-coverage step icons, matched on the step's name. */
export const STEP_ICONS: { match: RegExp; icon: LandingIconName }[] = [
	{ match: /search|discover/i, icon: "search" },
	{ match: /analy|evaluat/i, icon: "chartColumnIncreasing" },
	{ match: /shortlist|list|compare/i, icon: "addToList" },
	{ match: /share/i, icon: "share" },
	{ match: /outreach|contact/i, icon: "mail" },
	{ match: /track|payment|report/i, icon: "chartCandlestick" },
];

/** First matcher whose pattern fits, else the fallback. */
export function iconFor(text: string, matchers: { match: RegExp; icon: LandingIconName }[], fallback: LandingIconName) {
	return matchers.find((m) => m.match.test(text))?.icon ?? fallback;
}

/** Both hero buttons. A page may override the label; the destination stays the app. */
export const LANDING_CTA = {
	primaryLabel: `Start with ${STARTER_CREDITS} credits`,
	href: APP_URL,
	signupNote: `${STARTER_CREDITS} credits when you sign up with a work email.`,
};

/** Closing CTA defaults, per template, from each doc's final section. */
export const CLOSING_CTA: Record<LandingType, { heading: string; body: string }> = {
	comparisonPage: {
		heading: "Use your next real brief as the test",
		body: `Sign up with a work email, take the ${STARTER_CREDITS} credits, and run search → analyze → shortlist → share on a brief you already have.`,
	},
	alternativePage: {
		heading: "Test Influenze.ai alongside your current workflow",
		body: `Keep what works, run one live brief through Influenze.ai with ${STARTER_CREDITS} credits, and compare the shortlists.`,
	},
	icpPage: {
		heading: "Build a shortlist for a brief you already have",
		body: `Use ${STARTER_CREDITS} credits to go from brief to a shareable creator list.`,
	},
	platformPage: {
		heading: "Start a search with 500 credits",
		body: "The platform is preselected — add a niche, a location and a follower range and see who fits.",
	},
	featurePage: {
		heading: "Try it on a live brief",
		body: `Sign up with a work email and use ${STARTER_CREDITS} credits to run this step on real creators.`,
	},
	pricingGuide: {
		heading: "Start with 500 credits",
		body: "Sign up with a work email, see what a real brief costs in credits, then choose a plan or top up.",
	},
};

/**
 * The head-to-head table's mandatory rows, with Influenze.ai's side filled in once. Each
 * competitor document supplies the other column against the same `id`s, so no page can drop
 * or reword a mandatory row. Optional rows are added per competitor beneath these.
 */
export const HEAD_TO_HEAD_ROWS = [
	{ id: "focus", icon: "profileSearch", metric: "Primary focus", influenze: "Discovery and talent intelligence" },
	{ id: "database", icon: "usersRound", metric: "Discovery database", influenze: "450M+ profiles" },
	{ id: "platforms", icon: "galleryVertical", metric: "Platform coverage", influenze: "Instagram, YouTube, TikTok" },
	{
		id: "aiSearch",
		icon: "parameterMagic",
		metric: "AI-driven search parameters",
		influenze: "Semantic and parameter-led discovery",
	},
	{
		id: "pricing",
		icon: "eyeSmall",
		metric: "Public, transparent pricing",
		influenze: "Credit usage and starting access published",
	},
	{
		id: "selfServe",
		icon: "userRoundCheck",
		metric: "Self-serve / no annual lock-in",
		influenze: "Self-serve; no mandatory annual lock-in",
	},
	{
		id: "credits",
		icon: "coins",
		metric: "Usage-based credits and rollover",
		// Costs are appended from CREDIT_COSTS at render time, so they track /pricing.
		influenze: "Usage-based credits; rollover while subscribed",
	},
	{ id: "bestFor", icon: "thumbsUp", metric: "Best for", influenze: "Fast, flexible creator research and shortlisting" },
] as const satisfies readonly { id: string; icon: LandingIconName; metric: string; influenze: string }[];

export type HeadToHeadRowId = (typeof HEAD_TO_HEAD_ROWS)[number]["id"];

/** The product workflow, in order (Product & Industry Context). */
export const WORKFLOW_STEPS: { title: string; body: string; icon: LandingIconName }[] = [
	{ title: "Search", icon: "search", body: "Turn the brief into platform, location, audience and semantic criteria." },
	{ title: "Analyze", icon: "chartColumnIncreasing", body: "Unlock profile analytics where a creator needs a closer look." },
	{ title: "Shortlist", icon: "addToList", body: "Save candidates into campaign- or client-wise lists." },
	{ title: "Compare", icon: "users", body: "Put candidates side by side on reach, engagement and audience." },
	{ title: "Share", icon: "share", body: "Send the shortlist to a client or stakeholder for review." },
	{ title: "Unlock contact", icon: "mail", body: "Get aggregated contact details for outreach outside the platform." },
];

/**
 * The icon a card falls back to when its editor picked none, per section — so every small
 * card carries one. Keys are the Sanity field names the cards sit in.
 */
export const SECTION_ICONS: Record<string, LandingIconName> = {
	chooseInfluenze: "circleCheck",
	chooseCompetitor: "info",
	scenarios: "usersRound",
	whyLook: "info",
	whyInfluenze: "circleCheck",
	useCases: "usersRound",
	problems: "hourglass",
	capabilities: "parameterMagic",
	searchBy: "search",
	evaluate: "chartColumnIncreasing",
	exampleBriefs: "walkthrough",
	definitions: "info",
	deepDives: "info",
	steps: "circleCheck",
	pricingCommitment: "coins",
	scenario: "coins",
};

/** Related-link icons, by the template the linked page uses. */
export const TYPE_ICONS: Record<LandingType | "blogPost" | "link", LandingIconName> = {
	comparisonPage: "chartCandlestick",
	alternativePage: "redirect",
	icpPage: "usersRound",
	platformPage: "galleryVertical",
	featurePage: "parameterMagic",
	pricingGuide: "coins",
	blogPost: "list",
	link: "externalLink",
};

/** Workflow-coverage statuses, matched on the cell's first word. */
export const COVERAGE_STATUS = {
	core: { match: /^core\b/i, icon: "circleCheck" },
	outside: { match: /^(outside|no\b|not\b)/i, icon: "externalLink" },
	verify: { match: /verify/i, icon: "info" },
} as const satisfies Record<string, { match: RegExp; icon: LandingIconName }>;

/** What the product does not do. Every template states it the same way. */
export const PRODUCT_BOUNDARY = {
	heading: "Where Influenze.ai stops",
	body: "Influenze.ai is the research and decision layer before a campaign: discovery, analysis, comparison, lists, sharing and aggregated contact details. Outreach, campaign management, tracking and payments happen in the tools and teams you already use.",
};

/** The freshness and contact-data caveats, worded per the claims rules. */
export const DATA_CAVEATS = {
	heading: "How fresh and accurate is the data?",
	points: [
		"Creator data is refreshed at least once every 15 days — it is not real-time, and a profile can change between refreshes.",
		"Contact details are aggregated from available sources, not verified. Deliverability and replies are not guaranteed.",
		"Estimated pricing is a directional range, not a quote. Final rates depend on deliverables, usage rights, exclusivity and timing.",
		"Check the live profile before you commit budget to a creator.",
	],
};

/** Alternative pages: three or more "yes" answers is a strong fit (doc 02). */
export const SWITCHING_CHECKLIST = {
	heading: "Is Influenze.ai the right switch?",
	intro: "Three or more “yes” answers suggests a strong fit.",
	questions: [
		"Do you mainly need creator discovery and evaluation?",
		"Do you need public, understandable usage costs?",
		"Do you want to test the platform without annual procurement?",
		"Do you need reusable and shareable creator lists?",
		"Do you already have separate tools or teams for execution?",
	],
};

/** ICP pages' default before/after table (doc 03); a page may replace it. */
export const BEFORE_AFTER = {
	heading: "Before and after Influenze.ai",
	columns: ["Before", "With Influenze.ai"],
	rows: [
		["Manual platform searches", "One structured discovery workflow"],
		["Old spreadsheets and saved posts", "Reusable campaign or roster lists"],
		["Follower-count shortlisting", "Deeper creator and audience evaluation"],
		["Screenshot-based client approvals", "Shareable, consistent shortlists"],
		["Starting from the same roster", "Search beyond known creators"],
	],
};

/** Pricing guides' rollover rules (doc 06, provisional — link to current terms, never "forever"). */
export const ROLLOVER_RULES = {
	heading: "How credit rollover works",
	points: [
		"Credits roll over while your subscription stays active.",
		"Eligible unused one-time credits may carry forward if you later subscribe.",
		"Credits may become unavailable after a subscription stops, and cancelling can mean losing accumulated credits.",
	],
	termsLabel: "Read the current terms",
	termsHref: "/terms/",
};

/** Default section headings. A page's own heading wins when filled in. */
export const SECTION_HEADINGS = {
	quickVerdict: "Quick verdict",
	headToHead: "Head-to-head comparison",
	deepDives: "What each difference means for you",
	workflowCoverage: "Workflow coverage",
	scenarios: "Which fits your scenario?",
	pricingCommitment: "Pricing and commitment",
	limitations: "When Influenze.ai is not the right choice",
	faqs: "Frequently asked questions",
	related: "Keep comparing",
	whoFor: "Who this alternative is for",
	whyLook: "Why teams look for an alternative",
	fitMatrix: "Quick fit check",
	whyInfluenze: "Why Influenze.ai is an alternative",
	switchingWorkflow: "How to switch without losing your roster",
	useCases: "Use cases by team",
	whenToKeep: "When to keep your current platform",
	workflowStrip: "Built for your workflow",
	problems: "What gets in the way",
	capabilities: "What you can do",
	scenario: "A live brief, start to finish",
	economics: "What it costs in credits",
	searchBy: "What you can search by",
	evaluate: "What you can evaluate",
	workflow: "From search to shortlist",
	exampleBriefs: "Example briefs",
	selectionGuide: "What matters on this platform",
	otherPlatforms: "Search other platforms",
	problem: "The manual way",
	howItWorks: "How it works",
	inputsOutputs: "What goes in, what comes out",
	definitions: "What the numbers mean",
	relatedWorkflow: "Where this fits in the workflow",
	scope: "What this feature does not do",
	creditTable: "How credits work",
	calculator: "Estimate your credits",
	includes: "What every plan includes",
	starterScenarios: "What 500 credits gets you",
	planFit: "Which plan fits which team",
	oneTime: "Running a one-time campaign?",
	quoteLed: "Credits vs quote-led and annual platforms",
} as const;

/** Labels for the deep-dive cards on comparison pages (doc 01, step 5). */
export const DEEP_DIVE_LABELS = {
	meaning: "What it means",
	ours: "Influenze.ai",
	whoBenefits: "Who benefits",
	check: "Check before you buy",
};

/** Calculator copy (doc 06). The formula itself is built from CREDIT_COSTS. */
export const CALCULATOR = {
	intro: "Add up what a brief needs. Actual usage varies, and product changes can affect consumption.",
	fields: {
		search: "Searches",
		analytics: "Profiles analyzed",
		contact: "Contacts unlocked",
	},
	totalLabel: "Estimated credits",
	starterNote: `Fits inside the ${STARTER_CREDITS} signup credits`,
	overNote: `More than the ${STARTER_CREDITS} signup credits — see plans`,
};

/** Icons for the pricing & commitment tiles, matched on the row's label. */
export const COMMITMENT_ICONS: { match: RegExp; icon: LandingIconName }[] = [
	{ match: /entry|signup|start/i, icon: "userRoundCheck" },
	{ match: /public|pricing|price/i, icon: "eyeSmall" },
	{ match: /credit|module|usage/i, icon: "coins" },
	{ match: /commit|contract|lock|term/i, icon: "hourglass" },
	{ match: /trial|free/i, icon: "badge" },
	{ match: /sales|demo|call/i, icon: "phone" },
];

export const CREDIT_STRIP_LABEL = "Credits per action";

export const REVIEWED_LABEL = "Reviewed on";
export const METHODOLOGY_LABEL = "How we compare";
export const SOURCE_LABEL = "Source";
export const JUMP_LABEL = "Jump to comparison";
