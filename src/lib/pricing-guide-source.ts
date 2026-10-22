/**
 * Resolves every /pricing/<slug> guide from Sanity's pricingGuidePage documents and
 * the code pages in data/pricing-guide. Same rules as the other sources: Sanity wins
 * field by field; empty fields fall back to the code page, then to the defaults.
 */
import {
	CREDIT_ROWS,
	PRICING_GUIDES,
	QUOTE_ROWS,
	QUOTE_THEIRS,
	plainText,
	resolvePricingGuideCopy,
	type CreditRow,
	type PricingGuideCopy,
	type PricingGuidePage,
} from "../data/pricing-guide";
import type { CompareRow, CompetitorCell } from "../data/compare";
import type { Faq } from "../data/faqs";
import { getPricingGuidePages, type PricingGuidePageDoc, type ScriptsDoc, type SeoDoc } from "../sanity/lib/queries";

export interface ResolvedPricingGuide extends PricingGuidePage {
	copy: PricingGuideCopy;
	creditList: CreditRow[];
	quoteRows: CompareRow[];
	quoteCells: Record<string, CompetitorCell>;
	seoOverrides?: SeoDoc;
	scripts?: ScriptsDoc;
}

const has = (text: string | undefined): text is string => Boolean(text?.trim());

const stripBlank = (record: Record<string, string | undefined> | undefined) =>
	Object.fromEntries(Object.entries(record ?? {}).filter(([, v]) => has(v)));

function finish(p: PricingGuidePage, extra?: Pick<ResolvedPricingGuide, "seoOverrides" | "scripts">): ResolvedPricingGuide {
	const rows = (p.creditRows ?? []).filter((r) => has(r.label));
	return {
		...p,
		copy: resolvePricingGuideCopy(p.headings),
		creditList: rows.length ? rows : CREDIT_ROWS,
		quoteRows: QUOTE_ROWS.map((row) => ({
			...row,
			label: p.quote?.[row.id]?.label?.trim() || row.label,
			influenze: { ...row.influenze, text: p.quote?.[row.id]?.ours?.trim() || row.influenze.text },
		})),
		quoteCells: Object.fromEntries(
			QUOTE_ROWS.map((row) => [row.id, { text: p.quote?.[row.id]?.theirs?.trim() || QUOTE_THEIRS[row.id] }]),
		),
		...extra,
	};
}

function fromSanity(doc: PricingGuidePageDoc, code: PricingGuidePage | undefined): ResolvedPricingGuide {
	const name = has(doc.name) ? doc.name : (code?.name ?? doc.slug);
	const faqs = (doc.faqs ?? []).filter((f): f is Faq => has(f.question) && has(f.answer));
	const creditRows = (doc.creditRows ?? [])
		.filter((r) => has(r.label) && has(r.cost))
		.map((r) => ({ label: r.label!.trim(), detail: r.detail?.trim() ?? "", cost: r.cost!.trim() }));
	const headings = { ...code?.headings, ...stripBlank(doc.headings) };
	return finish(
		{
			slug: doc.slug,
			name,
			draft: doc.draft ?? true,
			seo: {
				title: has(doc.seo?.title) ? doc.seo.title : (code?.seo.title ?? `${name} | Influenze.ai`),
				description: has(doc.seo?.description)
					? doc.seo.description
					: (code?.seo.description ?? plainText(resolvePricingGuideCopy(headings).heroBody)),
			},
			headings,
			creditRows: creditRows.length ? creditRows : code?.creditRows,
			quote: { ...code?.quote, ...doc.quote },
			faqs: faqs.length ? faqs : code?.faqs,
		},
		{ seoOverrides: doc.seo, scripts: doc.scripts },
	);
}

export async function getPricingGuides(perspectiveCookie?: string): Promise<ResolvedPricingGuide[]> {
	const { data } = await getPricingGuidePages(perspectiveCookie);
	const bySlug = new Map(PRICING_GUIDES.map((p) => [p.slug, p]));
	const fromCms = (data ?? []).map((doc) => fromSanity(doc, bySlug.get(doc.slug)));
	const cmsSlugs = new Set(fromCms.map((p) => p.slug));
	return [...fromCms, ...PRICING_GUIDES.filter((p) => !cmsSlugs.has(p.slug)).map((p) => finish(p))];
}

export async function getPricingGuide(slug: string | undefined, perspectiveCookie?: string) {
	if (!slug) return undefined;
	return (await getPricingGuides(perspectiveCookie)).find((p) => p.slug === slug);
}
