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
	FEATURE_ROWS,
	PRICING_ROWS,
	TBC,
	WORKFLOW_STEPS,
	resolveScenarios,
	resolveSectionCopy,
	type ResolvedScenario,
	type SectionCopy,
	type Competitor,
	type CompetitorCell,
	type CompareRow,
} from "../data/compare";
import type { Faq } from "../data/faqs";
import { getComparePages, type CompareCellDoc, type ComparePageDoc, type ScriptsDoc, type SeoDoc } from "../sanity/lib/queries";

export interface ResolvedCompetitor extends Competitor {
	/** Every section heading, defaults filled in and `{name}` replaced. */
	copy: SectionCopy;
	/** The three scenario cards with this page's text. */
	scenarioCards: ResolvedScenario[];
	/** Sanity's SEO overrides — canonical URL, noindex, custom JSON-LD. */
	seoOverrides?: SeoDoc;
	scripts?: ScriptsDoc;
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
		chooseCompetitor: pin?.chooseCompetitor ?? list(doc.chooseCompetitor, code?.chooseCompetitor),
		features: cells(FEATURE_ROWS, doc.features, code?.features),
		pricing: cells(PRICING_ROWS, doc.pricing, code?.pricing),
		workflow: Object.fromEntries(
			WORKFLOW_STEPS.map((step) => {
				const value = doc.workflow?.[step.id];
				return [step.id, has(value) ? value : (code?.workflow[step.id] ?? TBC)];
			}),
		) as Competitor["workflow"],
		faqs: faqs.length ? faqs : code?.faqs,
		// A Sanity heading wins, then the code file's, then the default.
		copy: resolveSectionCopy({ ...code?.headings, ...stripBlank(doc.headings), ...pin?.headings }, name),
		scenarioCards: resolveScenarios({ ...code?.scenarios, ...doc.scenarios }, name),
		seoOverrides: doc.seo,
		scripts: doc.scripts,
	};
}

/** Every compare page, Sanity's first, then code-only competitors. Drafts included. */
export async function getCompetitors(perspectiveCookie?: string): Promise<ResolvedCompetitor[]> {
	const { data } = await getComparePages(perspectiveCookie);
	const docs = data ?? [];
	const bySlug = new Map(COMPETITORS.map((c) => [c.slug, c]));
	const fromCms = docs.map((doc) => fromSanity(doc, bySlug.get(doc.slug)));
	const cmsSlugs = new Set(fromCms.map((c) => c.slug));
	const codeOnly = COMPETITORS.filter((c) => !cmsSlugs.has(c.slug)).map((c) => ({
		...c,
		copy: resolveSectionCopy(c.headings, c.name),
		scenarioCards: resolveScenarios(c.scenarios, c.name),
	}));
	return [...fromCms, ...codeOnly];
}

/** One compare page by slug, fetched at render time so edits show without a restart. */
export async function getCompetitor(slug: string | undefined, perspectiveCookie?: string) {
	if (!slug) return undefined;
	const competitors = await getCompetitors(perspectiveCookie);
	return competitors.find((c) => c.slug === slug);
}
