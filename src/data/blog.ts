/** Shared blog types, fallback listing copy and the date formatter; content itself is in Sanity. */

export interface BlogAuthor {
	name: string;
	role: string;
	/** Two letters shown in the avatar disc, since there is no portrait yet. */
	initials: string;
}

/** Shape of the blog's one CTA (see `data/blog-cta.ts`), not a licence for per-post variants. */
export interface BlogCta {
	heading?: string;
	body?: string;
	label: string;
	href: string;
	/** Off-site destinations open in a new tab. */
	newTab?: boolean;
}

export interface BlogFaqItem {
	question: string;
	answer: string;
}

/** "All" is a view of the whole list, not a category, so the listing adds it to the rail itself. */
export const BLOG_ALL_ID = "all";
export const BLOG_ALL_LABEL = "All";

/** Readable date derived from the ISO one so the two can never disagree. */
export function formatPublished(iso: string): string {
	return new Date(iso).toLocaleDateString("en-GB", {
		day: "numeric",
		month: "long",
		year: "numeric",
		timeZone: "UTC",
	});
}

/** Listing-page copy, used for any field the Studio's blog index leaves blank. */
export const BLOG_INDEX = {
	title: "Blogs",
	sub: "Comparisons, alternatives and playbooks for teams who run influencer campaigns — written for the people building the shortlist, not the deck.",
	featuredLabel: "Featured",
	listingHeading: "All articles",
	emptyTitle: "Nothing here yet",
	emptyBody: "We are still writing for this category. Try another one, or start with everything.",
} as const;
