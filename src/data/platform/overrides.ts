/**
 * Fields set in code that win over the page's Sanity document, keyed by slug. Use it
 * only while the Studio document can't be edited; once Studio matches, delete the
 * entry. Applied last in lib/platform-source.ts.
 */
import { BRIEFS } from "./shared";
import type { PlatformPage } from "./types";

export const PLATFORM_OVERRIDES: Record<string, Partial<Pick<PlatformPage, "draft" | "searchByCards" | "briefs">>> = {
	// Studio has older, shorter card text, and the fitness brief's location set to Pune.
	instagram: {
		// Live: Studio still has Draft switched on.
		draft: false,
		searchByCards: [
			{ icon: "search", title: "Topic Relevance", body: "Start your Instagram influencer search with what creators actually post about." },
			{ icon: "hash", title: "Bio Phrase & Hashtags", body: "Search Instagram bios and the hashtags influencers use." },
			{ icon: "users", title: "Lookalikes", body: "Discover Instagram influencers similar to the ones already performing for you." },
			{ icon: "mapPin", title: "Location & Followers", body: "Find Instagram influencers by city and follower tier." },
			{
				icon: "userRoundGroup",
				title: "Engagement & Audience",
				body: "Match each Instagram influencer's engagement and audience to your brief.",
			},
		],
		briefs: { third: { location: BRIEFS[2].location } },
	},
};
