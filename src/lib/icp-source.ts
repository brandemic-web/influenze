/**
 * Resolves every /for/<audience> page from Sanity's icpPage documents and the code
 * pages in data/icp. Same rules as the other sources: Sanity wins field by field.
 */
import {
	BEFORE_AFTER_ROWS,
	BRIEFS,
	BRIEF_COST_LINES,
	ICP_PAGES,
	SLOWS_CARDS,
	SMARTER_STEPS,
	WORKFLOW_PILLS,
	plainText,
	resolveIcpCopy,
	resolveSlots,
	type IcpCopy,
	type IcpPage,
} from "../data/icp";
import type { CompareRow, CompetitorCell } from "../data/compare";
import type { Faq } from "../data/faqs";
import { getIcpPages, type IcpPageDoc, type ScriptsDoc, type SeoDoc } from "../sanity/lib/queries";

export interface ResolvedIcp extends IcpPage {
	copy: IcpCopy;
	pills: string[];
	slowsList: ReturnType<typeof resolveSlots<(typeof SLOWS_CARDS)[number]>>;
	beforeAfterRows: CompareRow[];
	smarterList: ReturnType<typeof resolveSlots<(typeof SMARTER_STEPS)[number]>>;
	briefList: ReturnType<typeof resolveSlots<(typeof BRIEFS)[number]>>;
	costList: string[];
	seoOverrides?: SeoDoc;
	scripts?: ScriptsDoc;
}

const has = (text: string | undefined): text is string => Boolean(text?.trim());
const stripBlank = (record: Record<string, string | undefined> | undefined) =>
	Object.fromEntries(Object.entries(record ?? {}).filter(([, v]) => has(v)));
const cleanList = (items: string[] | undefined) => (items ?? []).map((s) => s.trim()).filter(Boolean);

/** The before/after table draws no competitor column; its cells are left empty. */
export const NO_CELLS: Record<string, CompetitorCell> = {};

function finish(p: IcpPage, extra?: Pick<ResolvedIcp, "seoOverrides" | "scripts">): ResolvedIcp {
	const pills = cleanList(p.workflowPills);
	const cost = cleanList(p.costLines);
	return {
		...p,
		copy: resolveIcpCopy(p.headings),
		pills: pills.length ? pills : WORKFLOW_PILLS,
		slowsList: resolveSlots(SLOWS_CARDS, p.slows),
		beforeAfterRows: BEFORE_AFTER_ROWS.map((row) => ({
			...row,
			label: p.beforeAfter?.[row.id]?.before?.trim() || row.label,
			influenze: { ...row.influenze, text: p.beforeAfter?.[row.id]?.after?.trim() || row.influenze.text },
		})),
		smarterList: resolveSlots(SMARTER_STEPS, p.smarter),
		briefList: resolveSlots(BRIEFS, p.briefs),
		costList: cost.length ? cost : BRIEF_COST_LINES,
		...extra,
	};
}

function fromSanity(doc: IcpPageDoc, code: IcpPage | undefined): ResolvedIcp {
	const name = has(doc.name) ? doc.name : (code?.name ?? doc.slug);
	const faqs = (doc.faqs ?? []).filter((f): f is Faq => has(f.question) && has(f.answer));
	const headings = { ...code?.headings, ...stripBlank(doc.headings) };
	return finish(
		{
			slug: doc.slug,
			name,
			draft: doc.draft ?? true,
			seo: {
				title: has(doc.seo?.title) ? doc.seo.title : (code?.seo.title ?? `Creator Discovery for ${name} | Influenze.ai`),
				description: has(doc.seo?.description)
					? doc.seo.description
					: (code?.seo.description ?? plainText(resolveIcpCopy(headings).heroBody)),
			},
			headings,
			workflowPills: cleanList(doc.workflowPills).length ? doc.workflowPills : code?.workflowPills,
			slows: { ...code?.slows, ...doc.slows },
			beforeAfter: { ...code?.beforeAfter, ...doc.beforeAfter },
			smarter: { ...code?.smarter, ...doc.smarter },
			briefs: { ...code?.briefs, ...doc.briefs },
			costLines: cleanList(doc.costLines).length ? doc.costLines : code?.costLines,
			faqs: faqs.length ? faqs : code?.faqs,
		},
		{ seoOverrides: doc.seo, scripts: doc.scripts },
	);
}

export async function getIcps(perspectiveCookie?: string): Promise<ResolvedIcp[]> {
	const { data } = await getIcpPages(perspectiveCookie);
	const bySlug = new Map(ICP_PAGES.map((p) => [p.slug, p]));
	const fromCms = (data ?? []).map((doc) => fromSanity(doc, bySlug.get(doc.slug)));
	const cmsSlugs = new Set(fromCms.map((p) => p.slug));
	return [...fromCms, ...ICP_PAGES.filter((p) => !cmsSlugs.has(p.slug)).map((p) => finish(p))];
}

export async function getIcp(slug: string | undefined, perspectiveCookie?: string) {
	if (!slug) return undefined;
	return (await getIcps(perspectiveCookie)).find((p) => p.slug === slug);
}
