/**
 * Copy for the ranking pages. The creators and their numbers come from
 * the backend snapshot (lib/rankings.ts); this file holds only what the
 * page says around them.
 */
import { APP_URL } from "./site";

/** Every sign-up link on a ranking page carries these, so signups can be matched to the page. */
export const SIGNUP_UTM_SOURCE = "rankings";

export function signupUrl(pagePath: string): string {
	const url = new URL(APP_URL);
	url.searchParams.set("utm_source", SIGNUP_UTM_SOURCE);
	url.searchParams.set("utm_medium", "organic");
	url.searchParams.set("utm_campaign", pagePath);
	return url.toString();
}

/** The hub pages, one per platform: each links to every published list page under its path. */
export const RANKINGS_HUBS = [
	{
		path: "in/instagram-influencers",
		plat: "IG",
		title: "Instagram Influencers in India | Influenze",
		heading: "Instagram Influencers in India",
		meta: "Find Instagram influencers in India by follower tier, category, city and language, with live follower and engagement numbers.",
	},
	{
		path: "in/youtubers",
		plat: "YT",
		title: "YouTubers in India | Influenze",
		heading: "YouTubers in India",
		meta: "Find YouTubers in India by follower tier, category, city and language, with live follower and engagement numbers.",
	},
] as const;

export const RANKINGS_COPY = {
	platformNames: { IG: "Instagram", YT: "YouTube" } as const,
	followersLabel: { IG: "Followers", YT: "Subscribers" } as const,
	/** The second number per creator: likes on Instagram, views on YouTube. */
	averageLabel: { IG: "Avg likes", YT: "Avg views" } as const,
	columns: { rank: "#", creator: "Creator", engagement: "Engagement" },
	listLabel: "creators, ranked",
	verified: "Verified",
	opensProfile: "opens their profile",
	ctaButton: "Sign up free",
	moreLists: "More lists",
	/** Other lists linked under a list, before "All lists". */
	moreListsLimit: 12,
	allLists: "All lists",
	searchPlaceholder: "Search lists, e.g. fitness or Mumbai",
	searchLabel: "Search lists",
	noMatches: "No lists match. Try another word.",
	hubCount: "creators",
	draft: "Draft: this page is being checked and is not listed on Google yet.",
} as const;

/** The generated meta description ends with how the list is ranked; the page itself only needs its opening line. */
const META_TAIL = /,\s*ranked by followers with above-average engagement\.\s*Live numbers, refreshed every quarter\.\s*$/;

export function pageIntro(meta: string): string {
	return meta.replace(META_TAIL, ".");
}

export function formatCount(n: number | null): string {
	if (n == null) return "–";
	return new Intl.NumberFormat("en-IN").format(n);
}

export function formatDate(iso: string): string {
	if (!iso) return "";
	return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}
