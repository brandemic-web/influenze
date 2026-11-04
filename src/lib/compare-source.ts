/**
 * Resolves every /comparison/<slug> page from Sanity's comparePage documents and the
 * competitor files in data/compare, so the route never sees a nullable field.
 *
 * A Sanity document wins over a code file with the same slug, field by field: an
 * empty Sanity field falls back to the code file's value, then to the TBC
 * placeholder. Code-only competitors keep rendering until they move to Sanity.
 */
import { COMPARE_OVERRIDES } from "../data/compare/overrides";
import {
	COMPETITORS,
	SECTION_COPY_FIELDS,
	FEATURE_ROWS,
	PRICING_ROWS,
	TBC,
	WORKFLOW_STEPS,
	resolveInfluenzeRows,
	resolveScenarios,
	resolveSectionCopy,
	type FeatureRowId,
	type PricingRowId,
	type ResolvedScenario,
	type SectionCopy,
	type Competitor,
	type CompetitorCell,
	type CompareRow,
} from "../data/compare";
import type { ChooseCard } from "../data/compare/types";
import type { Faq } from "../data/faqs";
import { resolveCompetitorLogo, type CompetitorLogo } from "./competitor-logo";
import {
	getComparePages,
	type CompareCellDoc,
	type ComparedCompetitorDoc,
	type ComparePageDoc,
	type ScriptsDoc,
	type SeoDoc,
} from "../sanity/lib/queries";

export interface ResolvedCompetitor extends Competitor {
	/** Every section heading, defaults filled in and `{name}` replaced. */
	copy: SectionCopy;
	/** The three scenario cards with this page's text. */
	scenarioCards: ResolvedScenario[];
	/** The table rows with Studio's edits to the Influenze.ai column. */
	featureRows: CompareRow<FeatureRowId>[];
	pricingRows: CompareRow<PricingRowId>[];
	/** Optional upload for the feature table's header; the name is shown without one. */
	competitorLogo?: CompetitorLogo;
	/** The "Choose … if.." cards beside Influenze.ai's: one on a two-way page, two or three on a multi-way one. */
	chooseCards: ResolvedChooseCard[];
	/** The competitor columns of each table: one on a two-way page, two or three on a multi-way one. */
	featureColumns: TableColumn<FeatureRowId>[];
	pricingColumns: TableColumn<PricingRowId>[];
	/** Sanity's SEO overrides — canonical URL, noindex, custom JSON-LD. */
	seoOverrides?: SeoDoc;
	scripts?: ScriptsDoc;
}

export type ResolvedChooseCard = Required<Omit<ChooseCard, "note">> & Pick<ChooseCard, "note">;

/** One competitor's column in a compare table. */
export interface TableColumn<Id extends string = string> {
	name: string;
	logo?: CompetitorLogo;
	cells: Record<Id, CompetitorCell>;
}

const has = (text: string | undefined): text is string => Boolean(text?.trim());

/** Drops empty strings, so a cleared Sanity field falls through to the next source. */
const stripBlank = (record: Record<string, string | undefined> | undefined) =>
	Object.fromEntries(Object.entries(record ?? {}).filter(([, v]) => has(v)));

function cells<Id extends string>(
	rows: readonly CompareRow<Id>[],
	doc: Record<string, CompareCellDoc | undefined> | undefined,
	code: Record<Id, CompetitorCell> | undefined,
): Record<Id, CompetitorCell> {
	return Object.fromEntries(
		rows.map((row) => {
			const cell = doc?.[row.id];
			if (has(cell?.text)) return [row.id, { text: cell.text, mark: Boolean(cell.mark) }];
			// Unfilled: keep the design's dash where Influenze shows a tick.
			return [row.id, code?.[row.id] ?? { text: TBC, mark: Boolean(row.influenze.mark) }];
		}),
	) as Record<Id, CompetitorCell>;
}

function fromSanity(doc: ComparePageDoc, code: Competitor | undefined): ResolvedCompetitor {
	// Code that must beat Studio for now (data/compare/overrides.ts).
	const pin = COMPARE_OVERRIDES[doc.slug];
	const name = has(doc.competitorName) ? doc.competitorName : (code?.name ?? doc.slug);
	const intro = has(doc.intro) ? doc.intro : (code?.intro ?? "");
	const list = (items: string[] | undefined, fallback: string[] | undefined) => {
		const kept = (items ?? []).filter(has);
		return kept.length ? kept : (fallback ?? []);
	};
	const faqs = (doc.faqs ?? []).filter((f): f is Faq => has(f.question) && has(f.answer));
	// A Sanity heading wins, then the code file's, then the default.
	const copy = resolveSectionCopy({ ...code?.headings, ...stripBlank(doc.headings), ...pin?.headings }, name);
	const chooseCompetitor = pin?.chooseCompetitor ?? list(doc.chooseCompetitor, code?.chooseCompetitor);
	const multiWay = multiWayCompetitors(doc);
	const competitorLogo = resolveCompetitorLogo(doc.competitorLogo, doc.competitorLogoSize);
	const features = cells(FEATURE_ROWS, doc.features, code?.features);
	const pricing = cells(PRICING_ROWS, doc.pricing, code?.pricing);

	return {
		slug: pin?.slug ?? doc.slug,
		name,
		// Unset counts as a draft: a page goes live only when someone switches it off.
		draft: doc.draft ?? true,
		seo: {
			title: has(doc.seo?.title)
				? doc.seo.title
				: (code?.seo.title ?? `Influenze.ai vs ${name} — Which Creator Discovery Platform Fits?`),
			description: has(doc.seo?.description) ? doc.seo.description : (code?.seo.description ?? intro),
		},
		intro,
		chooseInfluenze: list(doc.chooseInfluenze, code?.chooseInfluenze),
		chooseCompetitor,
		chooseCards: chooseCards(multiWay, {
			name,
			heading: copy.chooseCompetitorHeading,
			points: chooseCompetitor,
			note: copy.chooseCompetitorNote || undefined,
		}),
		features,
		pricing,
		featureColumns: tableColumns(FEATURE_ROWS, multiWay, (c) => c.features, { name, logo: competitorLogo, cells: features }),
		pricingColumns: tableColumns(PRICING_ROWS, multiWay, (c) => c.pricing, { name, logo: competitorLogo, cells: pricing }),
		workflow: Object.fromEntries(
			WORKFLOW_STEPS.map((step) => {
				const value = doc.workflow?.[step.id];
				return [step.id, has(value) ? value : (code?.workflow[step.id] ?? TBC)];
			}),
		) as Competitor["workflow"],
		faqs: faqs.length ? faqs : code?.faqs,
		copy,
		scenarioCards: resolveScenarios({ ...code?.scenarios, ...doc.scenarios }, name),
		featureRows: resolveInfluenzeRows(FEATURE_ROWS, doc.influenzeFeatures),
		pricingRows: resolveInfluenzeRows(PRICING_ROWS, doc.influenzePricing),
		competitorLogo,
		seoOverrides: doc.seo,
		scripts: doc.scripts,
	};
}

const CHOOSE_HEADING = SECTION_COPY_FIELDS.find((f) => f.key === "chooseCompetitorHeading")!.default;

/**
 * The competitor cards. A page set to 3 or 4 companies with its cards filled in gets one
 * card each (at most three); otherwise the single two-way card, so a page switched over
 * before its cards are written keeps rendering as it did.
 */
function chooseCards(multiWay: NamedCompetitor[], single: ResolvedChooseCard): ResolvedChooseCard[] {
	if (!multiWay.length) return [single];
	return multiWay.map((c) => ({
		name: c.name,
		heading: has(c.heading) ? c.heading : CHOOSE_HEADING.replaceAll("{name}", c.name),
		points: (c.points ?? []).filter(has),
		note: has(c.note) ? c.note : undefined,
	}));
}

type NamedCompetitor = ComparedCompetitorDoc & { name: string };

/** The named competitors of a page set to 3 or 4 companies (at most three); none on a two-way page. */
function multiWayCompetitors(doc: ComparePageDoc): NamedCompetitor[] {
	if ((doc.companyCount ?? 2) < 3) return [];
	return (doc.competitors ?? [])
		.filter((c): c is NamedCompetitor => has(c?.name))
		.map((c) => ({ ...c, name: c.name.trim() }))
		.slice(0, 3);
}

/**
 * A table's competitor columns. Multi-way only once every competitor has written
 * something in this table, so a page mid-migration keeps its single filled-in column
 * instead of showing placeholder columns.
 */
function tableColumns<Id extends string>(
	rows: readonly CompareRow<Id>[],
	multiWay: NamedCompetitor[],
	pick: (c: NamedCompetitor) => Record<string, CompareCellDoc | undefined> | undefined,
	single: TableColumn<Id>,
): TableColumn<Id>[] {
	const written = (c: NamedCompetitor) => rows.some((row) => has(pick(c)?.[row.id]?.text));
	if (!multiWay.length || !multiWay.every(written)) return [single];
	return multiWay.map((c) => ({
		name: c.name,
		logo: resolveCompetitorLogo(c.logo, c.logoSize),
		cells: cells(rows, pick(c), undefined),
	}));
}

/** Every compare page, Sanity's first, then code-only competitors. Drafts included. */
export async function getCompetitors(perspectiveCookie?: string): Promise<ResolvedCompetitor[]> {
	const { data } = await getComparePages(perspectiveCookie);
	const docs = data ?? [];
	const bySlug = new Map(COMPETITORS.map((c) => [c.slug, c]));
	const fromCms = docs.map((doc) => fromSanity(doc, bySlug.get(doc.slug)));
	const cmsSlugs = new Set(fromCms.map((c) => c.slug));
	const codeOnly = COMPETITORS.filter((c) => !cmsSlugs.has(c.slug)).map((c) => {
		const copy = resolveSectionCopy(c.headings, c.name);
		return {
			...c,
			copy,
			chooseCards: [
				{ name: c.name, heading: copy.chooseCompetitorHeading, points: c.chooseCompetitor, note: copy.chooseCompetitorNote || undefined },
			],
			featureColumns: [{ name: c.name, cells: c.features }],
			pricingColumns: [{ name: c.name, cells: c.pricing }],
			scenarioCards: resolveScenarios(c.scenarios, c.name),
			featureRows: [...FEATURE_ROWS],
			pricingRows: [...PRICING_ROWS],
		};
	});
	return [...fromCms, ...codeOnly];
}

/** One compare page by slug, fetched at render time so edits show without a restart. */
export async function getCompetitor(slug: string | undefined, perspectiveCookie?: string) {
	if (!slug) return undefined;
	const competitors = await getCompetitors(perspectiveCookie);
	return competitors.find((c) => c.slug === slug);
}
