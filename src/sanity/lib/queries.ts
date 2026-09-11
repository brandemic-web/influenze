import groq from "groq";
import { loadQuery } from "./loadQuery";
import type { Image } from "sanity";
import type { PortableTextBlock } from "@portabletext/types";

const SEO_PROJECTION = groq`seo { title, description, ogImage, noindex, canonicalUrl }`;
const CUSTOM_CODE_PROJECTION = groq`customCode { headerCode, footerCode }`;

export interface SeoDoc {
	title?: string;
	description?: string;
	ogImage?: Image;
	noindex?: boolean;
	canonicalUrl?: string;
}

export interface CustomCodeDoc {
	headerCode?: string;
	footerCode?: string;
}

export const siteSettingsQuery = groq`*[_type == "siteSettings"][0]`;

export interface RedirectRuleDoc {
	source: string;
	destination: string;
	permanent?: boolean;
}

/** Only the fields components currently consume are typed. */
export interface SiteSettingsDoc {
	name?: string;
	defaultTitle?: string;
	defaultDescription?: string;
	defaultOgImage?: Image;
	signupUrl?: string;
	loginUrl?: string;
	customCode?: CustomCodeDoc;
	navItems?: NavItemDoc[];
	footerColumns?: FooterColumnDoc[];
	redirects?: RedirectRuleDoc[];
	llmsTxt?: string;
	robotsTxt?: string;
}

export async function getSiteSettings(perspectiveCookie?: string) {
	return loadQuery<SiteSettingsDoc | null>({ query: siteSettingsQuery, perspectiveCookie });
}

export const pricingPageQuery = groq`*[_type == "pricingPage"][0]{
	${SEO_PROJECTION},
	${CUSTOM_CODE_PROJECTION},
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
	customCode?: CustomCodeDoc;
	useCasesSplit?: { title?: string; points?: string[] }[];
}

export async function getPricingPage(perspectiveCookie?: string) {
	return loadQuery<PricingPageDoc | null>({ query: pricingPageQuery, perspectiveCookie });
}

export const homePageQuery = groq`*[_type == "homePage"][0]{
	${SEO_PROJECTION},
	${CUSTOM_CODE_PROJECTION},
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
	customCode?: CustomCodeDoc;
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
	${CUSTOM_CODE_PROJECTION},
	hero,
	featureBlocksHeading,
	featureBlocks,
	creatorShowcase,
}`;

/** Only the fields components currently consume are typed. */
export interface FeaturesPageDoc {
	customCode?: CustomCodeDoc;
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
}

export async function getFeaturesPage(perspectiveCookie?: string) {
	return loadQuery<FeaturesPageDoc | null>({ query: featuresPageQuery, perspectiveCookie });
}

export interface LinkItemDoc {
	label?: string;
	href?: string;
	newTab?: boolean;
	hidden?: boolean;
}

export interface NavItemDoc extends LinkItemDoc {
	badge?: string;
	dropdown?: LinkItemDoc[];
}

export interface FooterColumnDoc {
	title?: string;
	hidden?: boolean;
	links?: LinkItemDoc[];
}

export interface AuthorDoc {
	name: string;
	role?: string;
	avatar: Image;
}

export interface QnaItemDoc {
	question: string;
	answer: string;
}

export const postQuery = groq`*[_type == "post" && slug.current == $slug][0]{
	title,
	"slug": slug.current,
	excerpt,
	cover,
	"coverAlt": cover.alt,
	publishedAt,
	readTimeOverride,
	featured,
	"categories": categories[]->title,
	"categoryIds": categories[]->_id,
	author->{ name, role, avatar },
	body[]{
		...,
		_type == "articleCta" => { _type, _key, heading, subcopy, buttonLabel, buttonHref },
		_type == "articleImage" => { _type, _key, image, alt, caption },
	},
	qna[visible != false]{ question, answer },
}`;

export interface PostDoc {
	title: string;
	slug: string;
	excerpt: string;
	cover: Image;
	coverAlt?: string;
	publishedAt: string;
	readTimeOverride?: number;
	featured?: boolean;
	categories: string[];
	categoryIds: string[];
	author: AuthorDoc;
	body: PortableTextBlock[];
	qna: QnaItemDoc[];
}

export async function getPost(slug: string, perspectiveCookie?: string) {
	return loadQuery<PostDoc | null>({ query: postQuery, params: { slug }, perspectiveCookie });
}

export const relatedPostsQuery = groq`*[
	_type == "post"
	&& slug.current != $slug
	&& count((categories[]->_id)[@ in $categoryIds]) > 0
] | order(publishedAt desc) [0...3] {
	title,
	"slug": slug.current,
	excerpt,
	cover,
	"coverAlt": cover.alt,
	publishedAt,
	readTimeOverride,
	"categories": categories[]->title,
	author->{ name, role, avatar },
	body,
}`;

export type RelatedPostDoc = Omit<PostDoc, "categoryIds" | "qna" | "featured">;

export async function getRelatedPosts(slug: string, categoryIds: string[], perspectiveCookie?: string) {
	return loadQuery<RelatedPostDoc[]>({
		query: relatedPostsQuery,
		params: { slug, categoryIds },
		perspectiveCookie,
	});
}

export const allPostsQuery = groq`*[_type == "post"] | order(featured desc, publishedAt desc){
	title,
	"slug": slug.current,
	excerpt,
	cover,
	"coverAlt": cover.alt,
	publishedAt,
	readTimeOverride,
	featured,
	"categories": categories[]->title,
	author->{ name, role, avatar },
	body,
}`;

export type PostListItemDoc = Omit<PostDoc, "categoryIds" | "qna">;

export async function getAllPosts(perspectiveCookie?: string) {
	return loadQuery<PostListItemDoc[]>({ query: allPostsQuery, perspectiveCookie });
}

export const categoriesQuery = groq`*[_type == "category"] | order(title asc){ title }`;

export async function getCategories(perspectiveCookie?: string) {
	return loadQuery<{ title: string }[]>({ query: categoriesQuery, perspectiveCookie });
}
