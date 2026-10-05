/** Shared blog types, fallback listing copy and the date formatter; content itself is in Sanity. */

export interface BlogAuthor {
	name: string;
	role: string;
	/** Two letters shown in the avatar disc when there is no portrait. */
	initials: string;
	/** Sanity CDN URL of the portrait, when one is uploaded. */
	avatarUrl?: string;
	/** Absent for authors saved before slugs existed; their byline simply doesn't link. */
	slug?: string;
}

/** Where an author's page lives — the one place the /author/ prefix is spelled. */
export function authorHref(slug: string): string {
	return `/author/${slug}`;
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

/** Every blog image (hero, featured, card) is cut to 4:3; 1792×1344 is the recommended upload. */
export const BLOG_IMAGE_RATIO = { width: 4, height: 3 } as const;

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

const SHORT_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "23 Sep 2026" for the byline meta. Spelled out because en-GB gives "Sept" but "Oct". */
export function formatShort(iso: string): string {
	const date = new Date(iso);
	return `${date.getUTCDate()} ${SHORT_MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

/** Labels for the byline meta, so the two dates are never confused. */
export const BLOG_META_LABELS = {
	published: "Published",
	updated: "Updated",
	readTime: "Read time",
	minutesSuffix: "min read",
	/** Under the "Read time" label, where "read" would say it twice. */
	minutesShort: "min",
} as const;

/** The last-edit date, only when it falls on a later day than publication — otherwise it adds nothing. */
export function laterUpdate(publishedIso: string, updatedIso: string | undefined): string | undefined {
	if (!updatedIso || !publishedIso) return undefined;
	const day = (iso: string) => iso.slice(0, 10);
	return day(updatedIso) > day(publishedIso) ? updatedIso : undefined;
}

/** Author-page copy; `{name}` is replaced with the author's name. */
export const BLOG_AUTHOR_PAGE = {
	listingHeading: "Articles by {name}",
	/** Meta description when the author has no bio. */
	metaDescription: "Articles by {name} on the Influenze.ai blog.",
	emptyTitle: "No articles yet",
	emptyBody: "Nothing has been published under this byline so far.",
} as const;

/** Listing-page copy, used for any field the Studio's blog index leaves blank. */
export const BLOG_INDEX = {
	title: "Blogs",
	sub: "Comparisons, alternatives and playbooks for teams who run influencer campaigns — written for the people building the shortlist, not the deck.",
	featuredLabel: "Featured",
	listingHeading: "All articles",
	emptyTitle: "Nothing here yet",
	emptyBody: "We are still writing for this category. Try another one, or start with everything.",
} as const;
