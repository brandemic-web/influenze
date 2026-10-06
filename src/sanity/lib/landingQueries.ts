import groq from "groq";
import { loadQuery } from "./loadQuery";
import type { ScriptsDoc, SeoDoc } from "./queries";
import type { SanityIcon } from "./icon";
import type { LandingType, VignetteKind } from "../../data/landing";

const SEO_PROJECTION = groq`seo { title, description, ogImage, noindex, canonicalUrl, customSchema }`;
const SCRIPTS_PROJECTION = groq`scripts { header, footer }`;
const IMAGE = groq`{ alt, "url": asset->url }`;

/**
 * Every field of these types that holds images, so the query can resolve them to URLs.
 * GROQ can't dereference assets generically, so a new image-bearing section joins a list here.
 */
const CARD_SECTIONS = [
	"scenarios",
	"whyLook",
	"whyInfluenze",
	"useCases",
	"problems",
	"capabilities",
	"searchBy",
	"evaluate",
	"exampleBriefs",
	"definitions",
];
const STEP_SECTIONS = ["workflowStrip", "switchingWorkflow", "howItWorks"];

const PAGE_PROJECTION = groq`
	...,
	"slug": slug.current,
	${SEO_PROJECTION},
	${SCRIPTS_PROJECTION},
	"heroImage": heroImage ${IMAGE},
	${CARD_SECTIONS.map((name) => `"${name}": ${name} { ..., cards[] { ..., "image": image ${IMAGE} } }`).join(",\n\t")},
	${STEP_SECTIONS.map((name) => `"${name}": ${name} { ..., steps[] { ..., "image": image ${IMAGE} } }`).join(",\n\t")},
	"chooseInfluenze": chooseInfluenze { ..., "image": image ${IMAGE} },
	"chooseCompetitor": chooseCompetitor { ..., "image": image ${IMAGE} },
	competitor->{ name, website, reviewedAt, positions, extraRows },
	"related": related {
		heading,
		links,
		"pages": pages[]->{ _type, title, "slug": slug.current, "summary": coalesce(answer, excerpt) },
	},
`;

export interface LandingImageDoc {
	alt?: string;
	url?: string;
}

export interface LandingCardDoc extends SanityIcon {
	_key?: string;
	visual?: VignetteKind;
	title?: string;
	body?: string;
	bullets?: string[];
	linkLabel?: string;
	href?: string;
	image?: LandingImageDoc | null;
}

export interface LandingCardsSectionDoc {
	heading?: string;
	intro?: string;
	cards?: LandingCardDoc[];
}

export interface LandingTableSectionDoc {
	heading?: string;
	intro?: string;
	columns?: string[];
	rows?: { _key?: string; cells?: string[]; source?: string }[];
	note?: string;
}

export interface LandingStepsSectionDoc {
	heading?: string;
	intro?: string;
	steps?: ({ _key?: string; title?: string; body?: string; image?: LandingImageDoc | null } & SanityIcon)[];
}

export interface LandingProseSectionDoc {
	heading?: string;
	/** Portable Text, rendered by components/blog/PortableText.astro. */
	body?: Record<string, unknown>[];
}

export interface LandingFaqSectionDoc {
	heading?: string;
	intro?: string;
	items?: { question?: string; answer?: string }[];
}

export interface LandingCreditScenarioDoc {
	_key?: string;
	title?: string;
	body?: string;
	searches?: number;
	analytics?: number;
	contacts?: number;
}

export interface LandingFilterDoc {
	_key?: string;
	label?: string;
	value?: string;
}

export interface LandingRelatedPageDoc {
	_type: LandingType | "blogPost";
	title?: string;
	slug?: string;
	summary?: string;
}

export interface CompetitorDoc {
	name?: string;
	website?: string;
	reviewedAt?: string;
	positions?: Record<string, { value?: string; source?: string } | undefined>;
	extraRows?: { _key?: string; metric?: string; influenze?: string; competitor?: string; source?: string }[];
}

/** Every template's fields in one shape; each page reads only its own. */
export interface LandingPageDoc {
	_type: LandingType;
	title?: string;
	slug?: string;
	eyebrow?: string;
	answer?: string;
	reviewedAt?: string;
	_updatedAt?: string;
	ctaLabel?: string;
	proofChips?: string[];
	seo?: SeoDoc;
	scripts?: ScriptsDoc;
	related?: {
		heading?: string;
		links?: { _key?: string; label?: string; href?: string; description?: string }[];
		pages?: (LandingRelatedPageDoc | null)[];
	};
	faq?: LandingFaqSectionDoc;
	cta?: { heading?: string; body?: string; label?: string; href?: string };

	// comparison + alternative
	competitor?: CompetitorDoc | null;
	methodologyUrl?: string;
	chooseInfluenze?: LandingCardDoc;
	chooseCompetitor?: LandingCardDoc;
	deepDives?: (SanityIcon & {
		_key?: string;
		visual?: VignetteKind;
		metric?: string;
		meaning?: string;
		ours?: string;
		theirs?: string;
		source?: string;
		whoBenefits?: string;
		check?: string;
	})[];
	workflowCoverage?: LandingTableSectionDoc;
	scenarios?: LandingCardsSectionDoc;
	pricingCommitment?: LandingTableSectionDoc & LandingProseSectionDoc;
	limitations?: LandingProseSectionDoc;
	whoFor?: { heading?: string; qualifiers?: string[]; disqualifier?: string };
	whyLook?: LandingCardsSectionDoc;
	fitMatrix?: LandingTableSectionDoc;
	whyInfluenze?: LandingCardsSectionDoc;
	switchingWorkflow?: LandingStepsSectionDoc;
	useCases?: LandingCardsSectionDoc;
	whenToKeep?: LandingProseSectionDoc;

	// icp
	workflowStrip?: LandingStepsSectionDoc;
	problems?: LandingCardsSectionDoc;
	beforeAfter?: LandingTableSectionDoc;
	capabilities?: LandingCardsSectionDoc;
	scenario?: { heading?: string; brief?: string; filters?: LandingFilterDoc[]; outcome?: string };
	economics?: LandingCreditScenarioDoc[];

	// platform
	platform?: "instagram" | "youtube" | "tiktok" | "multi";
	searchExample?: LandingFilterDoc[];
	searchBy?: LandingCardsSectionDoc;
	evaluate?: LandingCardsSectionDoc;
	exampleBriefs?: LandingCardsSectionDoc;
	selectionGuide?: LandingProseSectionDoc;

	// feature
	boundary?: string;
	heroImage?: LandingImageDoc | null;
	workflowStep?: string;
	problem?: LandingProseSectionDoc;
	howItWorks?: LandingStepsSectionDoc;
	inputsOutputs?: LandingTableSectionDoc;
	definitions?: LandingCardsSectionDoc;
	scope?: LandingProseSectionDoc;

	// pricing guide
	showPlans?: boolean;
	showCalculator?: boolean;
	showRollover?: boolean;
	body?: Record<string, unknown>[];
	includes?: string[];
	starterScenarios?: LandingCreditScenarioDoc[];
	planFit?: LandingTableSectionDoc;
	oneTime?: LandingProseSectionDoc;
	quoteLed?: LandingTableSectionDoc;
}

export const landingPageQuery = groq`*[_type == $type && slug.current == $slug][0]{ ${PAGE_PROJECTION} }`;

export async function getLandingPage(type: LandingType, slug: string, perspectiveCookie?: string) {
	return loadQuery<LandingPageDoc | null>({
		query: landingPageQuery,
		params: { type, slug },
		perspectiveCookie,
	});
}

/** A card per published page, for hubs, getStaticPaths and the platform cross-links. */
export interface LandingCardSummaryDoc {
	_type: LandingType;
	title?: string;
	slug?: string;
	summary?: string;
	platform?: string;
	competitor?: string;
}

export const landingListQuery = groq`*[_type == $type && defined(slug.current)] | order(title asc) {
	_type,
	title,
	"slug": slug.current,
	"summary": answer,
	platform,
	"competitor": competitor->name,
}`;

export async function getLandingList(type: LandingType, perspectiveCookie?: string) {
	return loadQuery<LandingCardSummaryDoc[]>({ query: landingListQuery, params: { type }, perspectiveCookie });
}
