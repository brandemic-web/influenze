/**
 * Copy for the Top creators pages. The creators and their numbers come from
 * the backend snapshot (lib/top-creators.ts); this file holds only what the
 * page says around them.
 */
import { APP_URL } from "./site";

/** Every sign-up link on a Top creators page carries these, so signups can be matched to the page. */
export const SIGNUP_UTM_SOURCE = "top_creators";

export function signupUrl(pagePath: string): string {
	const url = new URL(APP_URL);
	url.searchParams.set("utm_source", SIGNUP_UTM_SOURCE);
	url.searchParams.set("utm_medium", "organic");
	url.searchParams.set("utm_campaign", pagePath);
	return url.toString();
}

export const TOP_CREATORS_COPY = {
	eyebrow: "Top creators",
	countryLabel: "India",
	platformNames: { IG: "Instagram", YT: "YouTube" } as const,
	followersLabel: { IG: "Followers", YT: "Subscribers" } as const,
	tierNames: { nano: "Nano", micro: "Micro", mid_tier: "Mid-tier", macro: "Macro", mega: "Mega" } as const,
	columns: { rank: "#", creator: "Creator", engagement: "Engagement", tier: "Tier" },
	listLabel: "creators, ranked",
	matches: "creators match this search",
	averageEngagement: "average engagement",
	refreshed: "Refreshed",
	verified: "Verified",
	noPhoto: "No photo",
	opensProfile: "opens their profile",
	method: {
		heading: "How this list is made",
		points: [
			"We search public creator profiles in India that fit this list, then rank the matches by followers.",
			"A creator only makes the list if their engagement rate beats the average for creators of their size.",
			"The numbers are refreshed every three months, so follower counts and engagement stay current.",
		],
	},
	cta: "Find, filter and contact creators like these on Influenze",
	ctaButton: "Sign up free",
	moreLists: "More lists",
	allLists: "All lists",
	hubIntro: "Ranked lists of creators in India, each one refreshed every three months.",
	hubCount: "creators",
	draft: "Draft: this page is being checked and is not listed on Google yet.",
} as const;

export function formatCount(n: number | null): string {
	if (n == null) return "–";
	return new Intl.NumberFormat("en-IN").format(n);
}

export function formatDate(iso: string): string {
	if (!iso) return "";
	return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}
