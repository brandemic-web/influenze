/**
 * The blog's shared vocabulary: the block types a post body is built from, the
 * categories the listing filters by, and the registry every blog route reads.
 *
 * A post's content lives in its own file under `data/blog-posts/`, one file per
 * post, and is registered in `BLOG_POSTS` below. Both `/blog` and `/blog/[slug]`
 * read that one array, so a post cannot exist on the listing without a page or
 * vice versa.
 */
import type { ImageMetadata } from "astro";
import howToFindInfluencers from "./blog-posts/how-to-find-influencers-for-your-brand";
import influenzeVsQoruz from "./blog-posts/influenze-vs-qoruz";
import qoruzAlternative from "./blog-posts/qoruz-alternative-for-creator-discovery";

export interface BlogAuthor {
	name: string;
	role: string;
	/** Two letters shown in the avatar disc, since there is no portrait yet. */
	initials: string;
}

/**
 * There is one CTA treatment and one set of CTA words across the whole blog —
 * see `data/blog-cta.ts`. This shape exists so the renderer has something to
 * take, not so posts can each invent their own.
 */
export interface BlogCta {
	heading?: string;
	body?: string;
	label: string;
	href: string;
	/** Off-site destinations open in a new tab. */
	newTab?: boolean;
}

export type BlogBlock =
	| { type: "heading"; id: string; text: string }
	| { type: "subheading"; text: string }
	/** `html` is authored here, so a limited set of inline tags is allowed. */
	| { type: "paragraph"; html: string }
	| { type: "list"; ordered?: boolean; items: string[] }
	| { type: "quote"; text: string; attribution: string }
	| { type: "callout"; title: string; body: string }
	| { type: "table"; caption?: string; columns: string[]; rows: string[][] }
	| { type: "cta"; cta: BlogCta };

export interface BlogFaqItem {
	question: string;
	answer: string;
}

export interface BlogPost {
	/** URL segment under /blog/ — also the registry key, so it must be unique. */
	slug: string;
	/** A `BlogCategoryId`; the listing's filter and the post's pill both read it. */
	category: BlogCategoryId;
	/** The H1, and the title shown on the hero and the listing card. */
	title: string;
	/** The `<title>`, when SEO wants something shorter or differently worded than the H1. */
	metaTitle?: string;
	/** Doubles as the meta description and the summary on the hero and the card. */
	excerpt: string;
	/**
	 * Hero image. It fills the 60 column of the post hero's 40/60 split, which is
	 * 784×457 on the 1728px grid — so the source wants to be 1568×914 for retina.
	 * `alt` is empty for art that only decorates, per the note in BlogHero.astro.
	 */
	hero: { src: ImageMetadata; alt: string };
	author: BlogAuthor;
	readMinutes: number;
	/** ISO 8601 — the readable date is formatted from it, so the two can't drift. */
	publishedIso: string;
	body: BlogBlock[];
	faq: {
		heading: string;
		subcopy: string;
		items: BlogFaqItem[];
	};
}

/**
 * The listing's filter rail, in display order. `id` is what the markup and the
 * filter script exchange; `label` is the only thing a reader sees, so renaming a
 * category is a one-word edit that leaves the hooks alone.
 *
 * "All" is not in here — it is the rail's own always-present first chip, added
 * by the component, because it is a view of the list rather than a category a
 * post can be filed under.
 */
export const BLOG_CATEGORIES = [
	{ id: "comparison", label: "Comparison Pages" },
	{ id: "alternative", label: "Alternative Pages" },
	{ id: "icp", label: "ICP Pages" },
	{ id: "platform", label: "Platform Pages" },
	{ id: "feature", label: "Feature Pages" },
	{ id: "pricing", label: "Pricing Pages" },
] as const;

export type BlogCategoryId = (typeof BLOG_CATEGORIES)[number]["id"];

/** The rail's first chip and the filter's default — see the note above. */
export const BLOG_ALL_ID = "all";
export const BLOG_ALL_LABEL = "All";

export function categoryLabel(id: BlogCategoryId): string {
	return BLOG_CATEGORIES.find((category) => category.id === id)?.label ?? id;
}

/** Readable date derived from the ISO one so the two can never disagree. */
export function formatPublished(iso: string): string {
	return new Date(iso).toLocaleDateString("en-GB", {
		day: "numeric",
		month: "long",
		year: "numeric",
		timeZone: "UTC",
	});
}

/** Newest first — the listing renders this order as-is. */
export const BLOG_POSTS: BlogPost[] = [qoruzAlternative, howToFindInfluencers, influenzeVsQoruz];

/**
 * The post that gets the glass hero card above the listing. It stays in
 * `BLOG_POSTS` as well, so filtering to its category shows it in the grid
 * rather than an empty state.
 */
export const FEATURED_SLUG = qoruzAlternative.slug;

export function getPost(slug: string | undefined): BlogPost | undefined {
	return BLOG_POSTS.find((post) => post.slug === slug);
}

/**
 * The blog ships behind `noindex` until the competitor claims in these posts
 * have marketing and legal sign-off. Flip to `false` to let it be indexed, and
 * add /blog to the sitemap at the same time.
 */
export const BLOG_NOINDEX = true;

/** Listing-page copy. The hero is the H1 and one two-line line of sub-copy — nothing else. */
export const BLOG_INDEX = {
	title: "Blogs",
	sub: "Comparisons, alternatives and playbooks for teams who run influencer campaigns — written for the people building the shortlist, not the deck.",
	featuredLabel: "Featured",
	listingHeading: "All articles",
	emptyTitle: "Nothing here yet",
	emptyBody: "We are still writing for this category. Try another one, or start with everything.",
} as const;
