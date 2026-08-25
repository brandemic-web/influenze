import groq from "groq";
import { loadQuery } from "./loadQuery";
import type { Image } from "sanity";

const SEO_PROJECTION = groq`seo { title, description, ogImage, noindex }`;

export const siteSettingsQuery = groq`*[_type == "siteSettings"][0]`;

export async function getSiteSettings(perspectiveCookie?: string) {
	return loadQuery({ query: siteSettingsQuery, perspectiveCookie });
}

export const pricingPageQuery = groq`*[_type == "pricingPage"][0]{
	${SEO_PROJECTION},
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
	useCasesSplit?: { title?: string; points?: string[] }[];
}

export async function getPricingPage(perspectiveCookie?: string) {
	return loadQuery<PricingPageDoc | null>({ query: pricingPageQuery, perspectiveCookie });
}

export const homePageQuery = groq`*[_type == "homePage"][0]{
	${SEO_PROJECTION},
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
	hero,
	featureBlocksHeading,
	featureBlocks,
}`;

export async function getFeaturesPage(perspectiveCookie?: string) {
	return loadQuery({ query: featuresPageQuery, perspectiveCookie });
}
