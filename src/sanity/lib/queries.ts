import groq from "groq";
import { loadQuery } from "./loadQuery";
import { SECTION_COPY_FIELDS } from "../../data/compare/shared";
import { ALT_COPY_FIELDS } from "../../data/alternative/shared";
import { PLATFORM_COPY_FIELDS } from "../../data/platform/shared";
import { FEATURE_COPY_FIELDS } from "../../data/feature/shared";
import { PRICING_GUIDE_COPY_FIELDS } from "../../data/pricing-guide/shared";
import { ICP_COPY_FIELDS } from "../../data/icp/shared";
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
		showShortlistFlow?: boolean;
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

/* ── Blog ─────────────────────────────────────────────────────────────
 * Unlike the page singletons these return lists and take params. Projections resolve category,
 * author and hero asset here so components never re-query.
 */

const BLOG_AUTHOR_PROJECTION = groq`name, role, initials, "slug": slug.current, "avatarUrl": avatar.asset->url`;

export interface BlogAuthorDoc {
	name?: string;
	role?: string;
	initials?: string;
	slug?: string;
	avatarUrl?: string;
}

/** Everything the listing card and the post hero need, minus the body. */
const BLOG_CARD_PROJECTION = groq`
	"slug": slug.current,
	title,
	excerpt,
	publishedAt,
	// The editor's date when set, otherwise the document's own last-edit time.
	"updatedAt": coalesce(updatedAt, _updatedAt),
	readMinutes,
	hero {
		alt,
		"url": asset->url,
		"dimensions": asset->metadata.dimensions { width, height },
	},
	category-> { title, "slug": slug.current },
	author-> { ${BLOG_AUTHOR_PROJECTION} },
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
	updatedAt?: string;
	readMinutes?: number;
	hero?: BlogImageDoc;
	category?: { title?: string; slug?: string };
	author?: BlogAuthorDoc;
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

/** One author and their posts, newest first, for /author/<slug>. */
export const blogAuthorQuery = groq`*[_type == "blogAuthor" && slug.current == $slug][0]{
	${BLOG_AUTHOR_PROJECTION},
	bio,
	"posts": *[_type == "blogPost" && author._ref == ^._id && defined(slug.current)] | order(publishedAt desc) {
		${BLOG_CARD_PROJECTION}
	},
}`;

export interface BlogAuthorPageDoc extends BlogAuthorDoc {
	bio?: string;
	posts?: BlogCardDoc[];
}

export async function getBlogAuthor(slug: string, perspectiveCookie?: string) {
	return loadQuery<BlogAuthorPageDoc | null>({
		query: blogAuthorQuery,
		params: { slug },
		perspectiveCookie,
	});
}

/** Every author with a page to build — see getStaticPaths in pages/author/[slug].astro. */
export const blogAuthorSlugsQuery = groq`*[_type == "blogAuthor" && defined(slug.current)].slug.current`;

export async function getBlogAuthorSlugs() {
	return loadQuery<string[]>({ query: blogAuthorSlugsQuery });
}

export const blogCategoriesQuery =groq`*[_type == "blogCategory" && defined(slug.current)] | order(order asc, title asc) {
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

/** Every compare page with a slug — see lib/compare-source.ts, which merges these with the code fallbacks. */
export const comparePagesQuery = groq`*[_type == "comparePage" && defined(slug.current)]{
	"slug": slug.current,
	competitorName,
	draft,
	intro,
	chooseInfluenze,
	chooseCompetitor,
	features,
	pricing,
	workflow,
	faqs[]{ question, answer },
	"headings": { ${SECTION_COPY_FIELDS.map((f) => f.key).join(", ")} },
	scenarios,
	${SEO_PROJECTION},
	${SCRIPTS_PROJECTION},
}`;

export interface CompareCellDoc {
	text?: string;
	mark?: boolean;
}

export interface ComparePageDoc {
	slug: string;
	competitorName?: string;
	draft?: boolean;
	intro?: string;
	chooseInfluenze?: string[];
	chooseCompetitor?: string[];
	features?: Record<string, CompareCellDoc | undefined>;
	pricing?: Record<string, CompareCellDoc | undefined>;
	workflow?: Record<string, string | undefined>;
	faqs?: { question?: string; answer?: string }[];
	headings?: Record<string, string | undefined>;
	scenarios?: Record<string, { title?: string; description?: string } | undefined>;
	seo?: SeoDoc;
	scripts?: ScriptsDoc;
}

export async function getComparePages(perspectiveCookie?: string) {
	return loadQuery<ComparePageDoc[]>({ query: comparePagesQuery, perspectiveCookie });
}

/** Every alternative page with a slug — see lib/alternative-source.ts. */
export const alternativePagesQuery = groq`*[_type == "alternativePage" && defined(slug.current)]{
	"slug": slug.current,
	competitorName,
	draft,
	"headings": { ${ALT_COPY_FIELDS.map((f) => f.key).join(", ")} },
	whyCards[]{ title, body },
	fit,
	features,
	steps,
	useCases,
	faqs[]{ question, answer },
	${SEO_PROJECTION},
	${SCRIPTS_PROJECTION},
}`;

export interface AlternativePageDoc {
	slug: string;
	competitorName?: string;
	draft?: boolean;
	headings?: Record<string, string | undefined>;
	whyCards?: { title?: string; body?: string }[];
	fit?: Record<string, CompareCellDoc | undefined>;
	features?: Record<string, CompareCellDoc | undefined>;
	steps?: Record<string, { title?: string; body?: string } | undefined>;
	useCases?: Record<string, { title?: string; body?: string } | undefined>;
	faqs?: { question?: string; answer?: string }[];
	seo?: SeoDoc;
	scripts?: ScriptsDoc;
}

export async function getAlternativePages(perspectiveCookie?: string) {
	return loadQuery<AlternativePageDoc[]>({ query: alternativePagesQuery, perspectiveCookie });
}

/** Every platform page with a slug — see lib/platform-source.ts. */
export const platformPagesQuery = groq`*[_type == "platformPage" && defined(slug.current)]{
	"slug": slug.current,
	platformName,
	platform,
	draft,
	"headings": { ${PLATFORM_COPY_FIELDS.map((f) => f.key).join(", ")} },
	searchByCards[]{ icon, title, body },
	whoForCards[]{ title, body },
	briefs,
	howSteps,
	mattersPoints,
	mattersStats,
	freshness,
	faqs[]{ question, answer },
	${SEO_PROJECTION},
	${SCRIPTS_PROJECTION},
}`;

type TextSlots = Record<string, { title?: string; body?: string; location?: string } | undefined>;

export interface PlatformPageDoc {
	slug: string;
	platformName?: string;
	platform?: string;
	draft?: boolean;
	headings?: Record<string, string | undefined>;
	searchByCards?: { icon?: string; title?: string; body?: string }[];
	whoForCards?: { title?: string; body?: string }[];
	briefs?: TextSlots;
	howSteps?: TextSlots;
	mattersPoints?: TextSlots;
	mattersStats?: Record<string, { label?: string; value?: string; note?: string } | undefined>;
	freshness?: TextSlots;
	faqs?: { question?: string; answer?: string }[];
	seo?: SeoDoc;
	scripts?: ScriptsDoc;
}

export async function getPlatformPages(perspectiveCookie?: string) {
	return loadQuery<PlatformPageDoc[]>({ query: platformPagesQuery, perspectiveCookie });
}

/** Every feature landing page with a slug — see lib/feature-source.ts. */
export const featureLandingPagesQuery = groq`*[_type == "featureLandingPage" && defined(slug.current)]{
	"slug": slug.current,
	name,
	draft,
	"headings": { ${FEATURE_COPY_FIELDS.map((f) => f.key).join(", ")} },
	howSteps,
	numbers,
	freshness,
	whoForCards[]{ title, body },
	faqs[]{ question, answer },
	${SEO_PROJECTION},
	${SCRIPTS_PROJECTION},
}`;

export interface FeatureLandingPageDoc {
	slug: string;
	name?: string;
	draft?: boolean;
	headings?: Record<string, string | undefined>;
	howSteps?: Record<string, { title?: string; body?: string } | undefined>;
	numbers?: Record<string, { title?: string; body?: string } | undefined>;
	freshness?: Record<string, { title?: string; body?: string } | undefined>;
	whoForCards?: { title?: string; body?: string }[];
	faqs?: { question?: string; answer?: string }[];
	seo?: SeoDoc;
	scripts?: ScriptsDoc;
}

export async function getFeatureLandingPages(perspectiveCookie?: string) {
	return loadQuery<FeatureLandingPageDoc[]>({ query: featureLandingPagesQuery, perspectiveCookie });
}

/** Every pricing guide with a slug — see lib/pricing-guide-source.ts. */
export const pricingGuidePagesQuery = groq`*[_type == "pricingGuidePage" && defined(slug.current)]{
	"slug": slug.current,
	name,
	draft,
	"headings": { ${PRICING_GUIDE_COPY_FIELDS.map((f) => f.key).join(", ")} },
	creditRows[]{ label, detail, cost },
	quote,
	faqs[]{ question, answer },
	${SEO_PROJECTION},
	${SCRIPTS_PROJECTION},
}`;

export interface PricingGuidePageDoc {
	slug: string;
	name?: string;
	draft?: boolean;
	headings?: Record<string, string | undefined>;
	creditRows?: { label?: string; detail?: string; cost?: string }[];
	quote?: Record<string, { label?: string; ours?: string; theirs?: string } | undefined>;
	faqs?: { question?: string; answer?: string }[];
	seo?: SeoDoc;
	scripts?: ScriptsDoc;
}

export async function getPricingGuidePages(perspectiveCookie?: string) {
	return loadQuery<PricingGuidePageDoc[]>({ query: pricingGuidePagesQuery, perspectiveCookie });
}

/** Every ICP page with a slug — see lib/icp-source.ts. */
export const icpPagesQuery = groq`*[_type == "icpPage" && defined(slug.current)]{
	"slug": slug.current,
	name,
	draft,
	"headings": { ${ICP_COPY_FIELDS.map((f) => f.key).join(", ")} },
	workflowPills,
	slows,
	beforeAfter,
	smarter,
	briefs,
	costLines,
	faqs[]{ question, answer },
	${SEO_PROJECTION},
	${SCRIPTS_PROJECTION},
}`;

export interface IcpPageDoc {
	slug: string;
	name?: string;
	draft?: boolean;
	headings?: Record<string, string | undefined>;
	workflowPills?: string[];
	slows?: Record<string, { title?: string; body?: string } | undefined>;
	beforeAfter?: Record<string, { before?: string; after?: string } | undefined>;
	smarter?: Record<string, { title?: string; body?: string } | undefined>;
	briefs?: Record<string, { title?: string; body?: string; location?: string } | undefined>;
	costLines?: string[];
	faqs?: { question?: string; answer?: string }[];
	seo?: SeoDoc;
	scripts?: ScriptsDoc;
}

export async function getIcpPages(perspectiveCookie?: string) {
	return loadQuery<IcpPageDoc[]>({ query: icpPagesQuery, perspectiveCookie });
}
