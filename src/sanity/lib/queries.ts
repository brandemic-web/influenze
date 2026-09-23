import groq from "groq";
import { loadQuery } from "./loadQuery";
import type { Image } from "sanity";

const SEO_PROJECTION = groq`seo { title, description, ogImage, noindex, canonicalUrl, customSchema }`;
const SCRIPTS_PROJECTION = groq`scripts { header, footer }`;

export interface SeoDoc {
	title?: string;
	description?: string;
	ogImage?: Image;
	noindex?: boolean;
	canonicalUrl?: string;
	customSchema?: string;
}

export interface ScriptsDoc {
	header?: string;
	footer?: string;
}

// `sitemapFile` is a file reference, so it needs an explicit `asset->`
// dereference to resolve to a URL — everything else comes through via `...`.
export const siteSettingsQuery = groq`*[_type == "siteSettings"][0]{
	...,
	"sitemapFileUrl": sitemapFile.asset->url,
}`;

/** Only the fields components currently consume are typed. */
export interface SiteSettingsDoc {
	scripts?: ScriptsDoc;
	llmsTxt?: string;
	robotsTxt?: string;
	sitemapFileUrl?: string;
}

export async function getSiteSettings(perspectiveCookie?: string) {
	return loadQuery<SiteSettingsDoc | null>({ query: siteSettingsQuery, perspectiveCookie });
}

export const redirectsQuery = groq`*[_type == "redirect" && enabled == true]{ source, destination, permanent }`;

export interface RedirectDoc {
	source: string;
	destination: string;
	permanent?: boolean;
}

export async function getRedirects() {
	return loadQuery<RedirectDoc[]>({ query: redirectsQuery });
}

export const pricingPageQuery = groq`*[_type == "pricingPage"][0]{
	${SEO_PROJECTION},
	${SCRIPTS_PROJECTION},
	heading,
	sliderRange,
	tiers,
	annualBonusPct,
	customPlan,
	priceNote,
	planFeatures,
	creditCosts,
	useCasesSplit,
}`;

/** Only the fields components currently consume are typed. */
export interface PricingPageDoc {
	seo?: SeoDoc;
	scripts?: ScriptsDoc;
	useCasesSplit?: { title?: string; points?: string[] }[];
}

export async function getPricingPage(perspectiveCookie?: string) {
	return loadQuery<PricingPageDoc | null>({ query: pricingPageQuery, perspectiveCookie });
}

export const homePageQuery = groq`*[_type == "homePage"][0]{
	${SEO_PROJECTION},
	${SCRIPTS_PROJECTION},
	hero,
	creatorCollage,
	whyInfluenze,
	trustedBy {
		heading,
		logos[] {
			image,
			alt,
			desktop,
			mobile,
			padding,
			margin,
			// The asset's own pixel size, for the width/height attributes that
			// reserve the logo's space before it loads.
			"intrinsic": image.asset->metadata.dimensions { width, height },
		},
	},
	creatorsAI,
	useCases,
	comparison,
	testimonials,
	faqs,
}`;

/** Only the fields components currently consume are typed; the rest still
 * come through but as `unknown` until they're wired up the same way. */
export interface HomePageDoc {
	seo?: SeoDoc;
	scripts?: ScriptsDoc;
	hero?: {
		heading?: string;
		words?: string[];
		subcopy?: { lead?: string; highlight?: string; trail?: string };
		cta?: { label?: string; href?: string; newTab?: boolean };
	};
	creatorCollage?: {
		heading?: { lead?: string; accent?: string };
		bubbles?: {
			bubbleA?: Image;
			bubbleB?: Image;
			bubbleC?: Image;
			bubbleD?: Image;
			bubbleE?: Image;
			bubbleF?: Image;
			bubbleG?: Image;
		};
		statTags?: { label?: string; value?: string }[];
	};
	whyInfluenze?: {
		eyebrow?: string;
		heading?: { lead?: string; accent?: string };
		button?: { label?: string; href?: string; newTab?: boolean };
		steps?: {
			iconSource?: "preset" | "upload";
			icon?: string;
			iconImage?: Image;
			title?: string;
			description?: string;
		}[];
	};
	trustedBy?: {
		heading?: string;
		logos?: {
			image?: Image;
			alt?: string;
			desktop?: { width?: number; height?: number };
			mobile?: { width?: number; height?: number };
			padding?: { top?: number; right?: number; bottom?: number; left?: number };
			margin?: { top?: number; right?: number; bottom?: number; left?: number };
			intrinsic?: { width?: number; height?: number };
		}[];
	};
	creatorsAI?: {
		heading?: { lead?: string; accent?: string };
		button?: { label?: string; href?: string; newTab?: boolean };
		features?: {
			iconSource?: "preset" | "upload";
			icon?: string;
			iconImage?: Image;
			title?: string;
			description?: string;
		}[];
	};
	useCases?: {
		heading?: string;
		cards?: { title?: string; description?: string }[];
	};
	comparison?: {
		heading?: { lead?: string; accent?: string };
		competitors?: string[];
		rows?: {
			label?: string;
			influenze?: { accent?: string; text?: string; mark?: boolean };
			others?: { accent?: string; text?: string; mark?: boolean }[];
		}[];
	};
	testimonials?: {
		heading?: string;
		band?: string;
		items?: { name?: string; company?: string; quote?: string }[];
	};
	faqs?: {
		heading?: string;
		subcopy?: string;
		items?: { question?: string; answer?: string }[];
	};
}

export async function getHomePage(perspectiveCookie?: string) {
	return loadQuery<HomePageDoc | null>({ query: homePageQuery, perspectiveCookie });
}

export const featuresPageQuery = groq`*[_type == "featuresPage"][0]{
	${SEO_PROJECTION},
	${SCRIPTS_PROJECTION},
	hero,
	featureBlocksHeading,
	featureBlocks,
	creatorShowcase,
}`;

/** Only the fields components currently consume are typed. */
export interface FeaturesPageDoc {
	hero?: {
		heading?: string;
		subcopy?: { lead?: string; highlight?: string; trail?: string };
		creatorImages?: { image?: Image; alt?: string }[];
	};
	featureBlocksHeading?: { lead?: string; accent?: string };
	featureBlocks?: { title?: string; description?: string }[];
	creatorShowcase?: {
		heading?: { top?: string; bottom?: string };
	};
	seo?: SeoDoc;
	scripts?: ScriptsDoc;
}

export async function getFeaturesPage(perspectiveCookie?: string) {
	return loadQuery<FeaturesPageDoc | null>({ query: featuresPageQuery, perspectiveCookie });
}

/* ── Blog ────────────────────────────────────────────────────────────
 * The blog is the one many-document part of the site, so unlike the page
 * singletons these queries return lists and take params. Every projection
 * dereferences `category->` and `author->` and resolves the hero asset's URL
 * and dimensions here, so a component never has to re-query for them.
 */

/** Everything the listing card and the post hero need, minus the body. */
const BLOG_CARD_PROJECTION = groq`
	"slug": slug.current,
	title,
	excerpt,
	publishedAt,
	readMinutes,
	hero {
		alt,
		"url": asset->url,
		"dimensions": asset->metadata.dimensions { width, height },
	},
	category-> { title, "slug": slug.current },
	author-> { name, role, initials, "avatarUrl": avatar.asset->url },
`;

export interface BlogImageDoc {
	alt?: string;
	url?: string;
	dimensions?: { width?: number; height?: number };
}

export interface BlogCardDoc {
	slug?: string;
	title?: string;
	excerpt?: string;
	publishedAt?: string;
	readMinutes?: number;
	hero?: BlogImageDoc;
	category?: { title?: string; slug?: string };
	author?: { name?: string; role?: string; initials?: string; avatarUrl?: string };
}

/** The full post. `body` comes back as Portable Text — see components/blog/PortableText.astro. */
export const blogPostQuery = groq`*[_type == "blogPost" && slug.current == $slug][0]{
	${SEO_PROJECTION},
	${SCRIPTS_PROJECTION},
	${BLOG_CARD_PROJECTION}
	faqHeading,
	faqSubcopy,
	faqs[] { question, answer },
	body[] {
		...,
		// Inline images carry their own asset, resolved the same way as the hero.
		_type == "image" => { ..., "url": asset->url, "dimensions": asset->metadata.dimensions { width, height } },
	},
}`;

export interface BlogPostDoc extends BlogCardDoc {
	seo?: SeoDoc;
	scripts?: ScriptsDoc;
	faqHeading?: string;
	faqSubcopy?: string;
	faqs?: { question?: string; answer?: string }[];
	/** Portable Text. Typed loosely on purpose — the renderer narrows per block. */
	body?: Record<string, unknown>[];
}

export async function getBlogPost(slug: string, perspectiveCookie?: string) {
	return loadQuery<BlogPostDoc | null>({
		query: blogPostQuery,
		params: { slug },
		perspectiveCookie,
	});
}

/** Newest first, and only posts that are complete enough to render. */
export const blogPostsQuery = groq`*[_type == "blogPost" && defined(slug.current)] | order(publishedAt desc) {
	${BLOG_CARD_PROJECTION}
}`;

export async function getBlogPosts(perspectiveCookie?: string) {
	return loadQuery<BlogCardDoc[]>({ query: blogPostsQuery, perspectiveCookie });
}

export const blogCategoriesQuery = groq`*[_type == "blogCategory" && defined(slug.current)] | order(order asc, title asc) {
	title,
	"slug": slug.current,
}`;

export interface BlogCategoryDoc {
	title?: string;
	slug?: string;
}

export async function getBlogCategories(perspectiveCookie?: string) {
	return loadQuery<BlogCategoryDoc[]>({ query: blogCategoriesQuery, perspectiveCookie });
}

export const blogIndexQuery = groq`*[_type == "blogIndex"][0]{
	${SEO_PROJECTION},
	${SCRIPTS_PROJECTION},
	title,
	sub,
	featuredLabel,
	listingHeading,
	emptyTitle,
	emptyBody,
	"featuredSlug": featuredPost->slug.current,
}`;

export interface BlogIndexDoc {
	seo?: SeoDoc;
	scripts?: ScriptsDoc;
	title?: string;
	sub?: string;
	featuredLabel?: string;
	listingHeading?: string;
	emptyTitle?: string;
	emptyBody?: string;
	featuredSlug?: string;
}

export async function getBlogIndex(perspectiveCookie?: string) {
	return loadQuery<BlogIndexDoc | null>({ query: blogIndexQuery, perspectiveCookie });
}
