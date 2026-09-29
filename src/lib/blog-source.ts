/** Shapes Sanity blog documents for both routes so components never see a nullable field. */
import type { PortableBlock } from "./portable-text";
import { estimateReadMinutes, headingSections } from "./portable-text";
import { BLOG_INDEX } from "../data/blog";
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

/** A Sanity CDN URL, resized with query params — see BlogImage.astro. */
export interface BlogHeroImage {
	url: string;
	alt: string;
	width?: number;
	height?: number;
}

/** Its own interface because `typeof BLOG_INDEX` is `as const` and would reject Sanity's strings. */
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
	body: PortableBlock[];
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

/** The shared half of a post — everything the listing card needs. */
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
		body: blocks,
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
		body: [],
		sections: [],
		faq: { heading: "", subcopy: "", items: [] },
		noindex: false,
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
}

export async function getBlogListing(perspectiveCookie?: string): Promise<BlogListing> {
	// Independent queries, so they run concurrently rather than adding latencies.
	const [{ data: posts }, { data: categories }, { data: index }] = await Promise.all([
		getBlogPosts(perspectiveCookie),
		getBlogCategories(perspectiveCookie),
		getBlogIndex(perspectiveCookie),
	]);

	const entries = (posts ?? []).filter((post) => post.slug).map(cardFromSanity);

	// Falls back to the categories posts are filed under when none exist yet, so a
	// fresh dataset still filters.
	const sanityChips = (categories ?? [])
		.filter((category) => category.slug && category.title)
		.map((category) => ({ id: category.slug!, label: category.title! }));

	const derivedChips = [...new Map(entries.map((entry) => [entry.category.id, entry.category])).values()];

	const featured = entries.find((entry) => entry.slug === index?.featuredSlug) ?? entries[0];

	return {
		entries,
		categories: sanityChips.length ? sanityChips : derivedChips,
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
		noindex: index?.seo?.noindex ?? false,
	};
}

export async function getBlogEntry(
	slug: string | undefined,
	perspectiveCookie?: string,
): Promise<BlogEntry | undefined> {
	if (!slug) return undefined;

	const { data: doc } = await getBlogPost(slug, perspectiveCookie);
	return doc?.slug ? entryFromSanity(doc) : undefined;
}
