/**
 * Resolves every /alternatives/<slug> page from Sanity's alternativePage documents and
 * the code files in data/alternative, so the route never sees a nullable field. Same
 * rules as compare-source.ts: a Sanity document wins field by field over a code file
 * with the same slug; empty fields fall back to it, then to the defaults.
 */
import { ALTERNATIVE_OVERRIDES } from "../data/alternative/overrides";
import {
	ALTERNATIVES,
	ALT_COPY_FIELDS,
	FEATURE_ROWS,
	FIT_ROWS,
	NETWORK_STEPS,
	TBC,
	USE_CASES,
	WHY_CARDS,
	plainText,
	resolveSlots,
	type AltCopy,
	type AlternativeCompetitor,
	type CardText,
	type CompareRow,
} from "../data/alternative";
import type { CompetitorCell } from "../data/compare";
import { resolveCopy } from "../data/compare/shared";
import type { Faq } from "../data/faqs";
import {
	getAlternativePages,
	type AlternativePageDoc,
	type CompareCellDoc,
	type ScriptsDoc,
	type SeoDoc,
} from "../sanity/lib/queries";

export interface ResolvedAlternative extends AlternativeCompetitor {
	copy: AltCopy;
	whyCardList: CardText[];
	stepList: ReturnType<typeof resolveSlots<(typeof NETWORK_STEPS)[number]>>;
	useCaseList: ReturnType<typeof resolveSlots<(typeof USE_CASES)[number]>>;
	seoOverrides?: SeoDoc;
	scripts?: ScriptsDoc;
}

const has = (text: string | undefined): text is string => Boolean(text?.trim());

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
			return [row.id, code?.[row.id] ?? { text: TBC, mark: Boolean(row.influenze.mark) }];
		}),
	) as Record<Id, CompetitorCell>;
}

/** Everything derived from defaults + overrides, shared by Sanity and code-only pages. */
function finish(c: AlternativeCompetitor, extra?: Pick<ResolvedAlternative, "seoOverrides" | "scripts">) {
	const cards = (c.whyCards ?? []).filter((card) => has(card.title));
	return {
		...c,
		copy: resolveCopy(ALT_COPY_FIELDS, c.headings, c.name) as AltCopy,
		whyCardList: cards.length ? cards : WHY_CARDS,
		stepList: resolveSlots(NETWORK_STEPS, c.steps),
		useCaseList: resolveSlots(USE_CASES, c.useCases),
		...extra,
	} satisfies ResolvedAlternative;
}

function fromSanity(doc: AlternativePageDoc, code: AlternativeCompetitor | undefined): ResolvedAlternative {
	// Code that must beat Studio for now (data/alternative/overrides.ts).
	const pin = ALTERNATIVE_OVERRIDES[doc.slug];
	const name = pin?.name ?? (has(doc.competitorName) ? doc.competitorName : (code?.name ?? doc.slug));
	const faqs = (doc.faqs ?? []).filter((f): f is Faq => has(f.question) && has(f.answer));
	const whyCards = (doc.whyCards ?? [])
		.filter((card) => has(card.title))
		.map((card) => ({ title: card.title!.trim(), body: card.body?.trim() ?? "" }));

	return finish(
		{
			slug: doc.slug,
			name,
			draft: pin?.draft ?? doc.draft ?? true,
			seo: {
				title: has(doc.seo?.title) ? doc.seo.title : (code?.seo.title ?? `${name} Alternative for Creator Discovery | Influenze.ai`),
				description: has(doc.seo?.description)
					? doc.seo.description
					: (code?.seo.description ?? plainText(ALT_COPY_FIELDS.find((f) => f.key === "heroBody")!.default)),
			},
			fit: cells(FIT_ROWS, doc.fit, code?.fit),
			features: cells(FEATURE_ROWS, doc.features, code?.features),
			faqs: faqs.length ? faqs : code?.faqs,
			headings: { ...code?.headings, ...stripBlank(doc.headings) },
			whyCards: pin?.whyCards ?? (whyCards.length ? whyCards : code?.whyCards),
			steps: { ...code?.steps, ...doc.steps },
			useCases: { ...code?.useCases, ...doc.useCases },
		},
		{ seoOverrides: doc.seo, scripts: doc.scripts },
	);
}

/** Every alternative page, Sanity's first, then code-only competitors. Drafts included. */
export async function getAlternatives(perspectiveCookie?: string): Promise<ResolvedAlternative[]> {
	const { data } = await getAlternativePages(perspectiveCookie);
	const bySlug = new Map(ALTERNATIVES.map((c) => [c.slug, c]));
	const fromCms = (data ?? []).map((doc) => fromSanity(doc, bySlug.get(doc.slug)));
	const cmsSlugs = new Set(fromCms.map((c) => c.slug));
	return [...fromCms, ...ALTERNATIVES.filter((c) => !cmsSlugs.has(c.slug)).map((c) => finish(c))];
}

/** One alternative page by slug, fetched at render time so edits show without a restart. */
export async function getAlternative(slug: string | undefined, perspectiveCookie?: string) {
	if (!slug) return undefined;
	return (await getAlternatives(perspectiveCookie)).find((c) => c.slug === slug);
}
