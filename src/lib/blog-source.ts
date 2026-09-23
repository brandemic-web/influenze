/**
 * One source of blog content for both blog routes, whether it comes from Sanity
 * or from the files in src/data/blog-posts/.
 *
 * **Sanity wins outright.** The moment there is one blogPost document, the local
 * posts stop being rendered — they are a seed so the site has a blog before
 * anyone opens the Studio, not a set that Sanity adds to. Mixing the two would
 * mean a post could be edited in the Studio and still be overridden by a file.
 * Once the three seed posts have been re-entered in Sanity, `src/data/blog.ts`,
 * `src/data/blog-posts/` and the local branch below can all be deleted.
 *
 * The two sources differ in exactly two ways, and both are normalised here:
 *   - body — a typed block list from a file, Portable Text from Sanity
 *   - hero — an imported asset from a file, a CDN URL from Sanity
 * Everything downstream sees one shape, so the components do not know or care
 * which source they are rendering.
 */
import type { ImageMetadata } from "astro";
import type { PortableBlock } from "./portable-text";
import { estimateReadMinutes, headingSections } from "./portable-text";
import type { BlogBlock } from "../data/blog";
import {
	BLOG_CATEGORIES,
	BLOG_INDEX,
	BLOG_NOINDEX,
	BLOG_POSTS,
	FEATURED_SLUG,
	categoryLabel,
} from "../data/blog";
import {
	getBlogCategories,
	getBlogIndex,
	getBlogPost,
	getBlogPosts,
	type BlogCardDoc,
	type BlogPostDoc,
	type ScriptsDoc,
	type SeoDoc,
} from "../sanity/lib/queries";

export type BlogHeroImage =
	/** Imported through astro:assets, so Astro owns the sizes it emits. */
	| { kind: "local"; src: ImageMetadata; alt: string }
	/** A Sanity CDN URL, resized with query params — see BlogImage.astro. */
	| { kind: "remote"; url: string; alt: string; width?: number; height?: number };

export type BlogBody =
	| { kind: "blocks"; blocks: BlogBlock[] }
	| { kind: "portable"; blocks: PortableBlock[] };

/**
 * The listing's wording. Its own interface rather than `typeof BLOG_INDEX`,
 * because that object is `as const` — its literal types would reject any string
 * Sanity returned.
 */
export interface BlogIndexCopy {
	title: string;
	sub: string;
	featuredLabel: string;
	listingHeading: string;
	emptyTitle: string;
	emptyBody: string;
}

export interface BlogCategoryChip {
	id: string;
	label: string;
}

export interface BlogEntry {
	slug: string;
	title: string;
	/** The `<title>`, when it should differ from the H1. */
	metaTitle?: string;
	excerpt: string;
	category: BlogCategoryChip;
	author: { name: string; role: string; initials: string };
	readMinutes: number;
	publishedIso: string;
	hero: BlogHeroImage;
	body: BlogBody;
	/** Section headings, in order, with the ids the body will render. */
	sections: { id: string; text: string }[];
	faq: { heading: string; subcopy: string; items: { question: string; answer: string }[] };
	seo?: SeoDoc;
	scripts?: ScriptsDoc;
	noindex: boolean;
}

/** Two letters for the avatar disc, when nobody supplied them. */
function initialsFrom(name: string): string {
	const parts = name.trim().split(/\s+/);
	const letters = parts.length > 1 ? `${parts[0][0]}${parts.at(-1)?.[0] ?? ""}` : parts[0]?.slice(0, 2);
	return (letters ?? "").toUpperCase();
}

function chipFrom(category: BlogCardDoc["category"]): BlogCategoryChip {
	return {
		id: category?.slug ?? "uncategorised",
		label: category?.title ?? "Uncategorised",
	};
}

/** The shared half of a Sanity post — everything the listing card needs. */
function entryHeadFrom(doc: BlogCardDoc) {
	const name = doc.author?.name ?? "Influenze.ai";
	return {
		slug: doc.slug ?? "",
		title: doc.title ?? "Untitled",
		excerpt: doc.excerpt ?? "",
		category: chipFrom(doc.category),
		author: {
			name,
			role: doc.author?.role ?? "",
			initials: doc.author?.initials?.trim() || initialsFrom(name),
		},
		publishedIso: doc.publishedAt ?? "",
		hero: {
			kind: "remote" as const,
			url: doc.hero?.url ?? "",
			alt: doc.hero?.alt ?? "",
			width: doc.hero?.dimensions?.width,
			height: doc.hero?.dimensions?.height,
		},
	};
}

function entryFromSanity(doc: BlogPostDoc): BlogEntry {
	const blocks = (doc.body ?? []) as PortableBlock[];
	const faqs = (doc.faqs ?? [])
		.filter((faq) => faq.question && faq.answer)
		.map((faq) => ({ question: faq.question!, answer: faq.answer! }));

	return {
		...entryHeadFrom(doc),
		metaTitle: doc.seo?.title,
		// The field is optional in the Studio, so a blank one is estimated from
		// the body rather than shown as "0 min read".
		readMinutes: doc.readMinutes ?? estimateReadMinutes(blocks),
		body: { kind: "portable", blocks },
		sections: headingSections(blocks),
		faq: {
			heading: doc.faqHeading ?? "FAQs",
			subcopy: doc.faqSubcopy ?? "",
			items: faqs,
		},
		seo: doc.seo,
		scripts: doc.scripts,
		noindex: doc.seo?.noindex ?? false,
	};
}

/** A card-only entry: real for the listing, empty where only a post page looks. */
function cardFromSanity(doc: BlogCardDoc): BlogEntry {
	return {
		...entryHeadFrom(doc),
		readMinutes: doc.readMinutes ?? 1,
		body: { kind: "portable", blocks: [] },
		sections: [],
		faq: { heading: "", subcopy: "", items: [] },
		noindex: false,
	};
}

function entryFromLocal(post: (typeof BLOG_POSTS)[number]): BlogEntry {
	return {
		slug: post.slug,
		title: post.title,
		metaTitle: post.metaTitle,
		excerpt: post.excerpt,
		category: { id: post.category, label: categoryLabel(post.category) },
		author: post.author,
		readMinutes: post.readMinutes,
		publishedIso: post.publishedIso,
		hero: { kind: "local", src: post.hero.src, alt: post.hero.alt },
		body: { kind: "blocks", blocks: post.body },
		sections: post.body
			.filter((block) => block.type === "heading")
			.map((block) => ({ id: block.id, text: block.text })),
		faq: post.faq,
		noindex: BLOG_NOINDEX,
	};
}

export interface BlogListing {
	entries: BlogEntry[];
	categories: BlogCategoryChip[];
	featured?: BlogEntry;
	copy: BlogIndexCopy;
	seo?: SeoDoc;
	scripts?: ScriptsDoc;
	noindex: boolean;
	/** False while the local seed posts are what is being rendered. */
	fromSanity: boolean;
}

export async function getBlogListing(perspectiveCookie?: string): Promise<BlogListing> {
	// Independent queries, so they run concurrently rather than adding latencies.
	const [{ data: posts }, { data: categories }, { data: index }] = await Promise.all([
		getBlogPosts(perspectiveCookie),
		getBlogCategories(perspectiveCookie),
		getBlogIndex(perspectiveCookie),
	]);

	const sanityPosts = (posts ?? []).filter((post) => post.slug);
	const fromSanity = sanityPosts.length > 0;

	const entries = fromSanity
		? sanityPosts.map(cardFromSanity)
		: BLOG_POSTS.map(entryFromLocal);

	// The rail comes from the category documents; if nobody has made any yet, it
	// falls back to whatever the posts are actually filed under, so a fresh
	// dataset still filters rather than showing one empty chip.
	const sanityChips = (categories ?? [])
		.filter((category) => category.slug && category.title)
		.map((category) => ({ id: category.slug!, label: category.title! }));

	const derivedChips = [...new Map(entries.map((entry) => [entry.category.id, entry.category])).values()];

	const chips = fromSanity
		? sanityChips.length
			? sanityChips
			: derivedChips
		: BLOG_CATEGORIES.map((category) => ({ id: category.id, label: category.label }));

	const featuredSlug = index?.featuredSlug ?? (fromSanity ? entries[0]?.slug : FEATURED_SLUG);
	const featured = entries.find((entry) => entry.slug === featuredSlug) ?? entries[0];

	return {
		entries,
		categories: chips,
		featured,
		copy: {
			title: index?.title || BLOG_INDEX.title,
			sub: index?.sub || BLOG_INDEX.sub,
			featuredLabel: index?.featuredLabel || BLOG_INDEX.featuredLabel,
			listingHeading: index?.listingHeading || BLOG_INDEX.listingHeading,
			emptyTitle: index?.emptyTitle || BLOG_INDEX.emptyTitle,
			emptyBody: index?.emptyBody || BLOG_INDEX.emptyBody,
		},
		seo: index?.seo,
		scripts: index?.scripts,
		// Local seed posts stay out of search until their copy is signed off; a
		// post entered in Sanity is indexable unless its own SEO tab says not.
		noindex: fromSanity ? (index?.seo?.noindex ?? false) : BLOG_NOINDEX,
		fromSanity,
	};
}

export async function getBlogEntry(
	slug: string | undefined,
	perspectiveCookie?: string,
): Promise<BlogEntry | undefined> {
	if (!slug) return undefined;

	const { data: doc } = await getBlogPost(slug, perspectiveCookie);
	if (doc?.slug) return entryFromSanity(doc);

	// No Sanity post under this slug — fall back to a seed post, but only while
	// Sanity has no posts at all, so a deleted post 404s instead of resurrecting
	// the file it was seeded from.
	const { data: posts } = await getBlogPosts(perspectiveCookie);
	if ((posts ?? []).some((post) => post.slug)) return undefined;

	const local = BLOG_POSTS.find((post) => post.slug === slug);
	return local ? entryFromLocal(local) : undefined;
}
