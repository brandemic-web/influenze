/**
 * Resolves every /platforms/<slug> page from Sanity's platformPage documents and the
 * code files in data/platform, so the route never sees a nullable field. Same rules as
 * compare-source.ts: a Sanity document wins field by field over a code file with the
 * same slug; empty fields fall back to it, then to the defaults in shared.ts.
 */
import {
	BRIEFS,
	FRESHNESS_CARDS,
	ICON_TILES,
	MATTERS_POINTS,
	MATTERS_STATS,
	PLATFORM_KEYS,
	PLATFORM_PAGES,
	SEARCH_BY_CARDS,
	WHO_FOR_CARDS,
	fillPlatform,
	plainText,
	resolvePlatformCopy,
	resolveSlots,
	type CardText,
	type IconCardText,
	type IconTile,
	type PlatformCopy,
	type PlatformKey,
	type PlatformPage,
} from "../data/platform";
import type { Faq } from "../data/faqs";
import { getPlatformPages, type PlatformPageDoc, type ScriptsDoc, type SeoDoc } from "../sanity/lib/queries";

export interface ResolvedPlatform extends PlatformPage {
	copy: PlatformCopy;
	searchByList: IconCardText[];
	whoForList: CardText[];
	briefList: ReturnType<typeof resolveSlots<(typeof BRIEFS)[number]>>;
	mattersList: ReturnType<typeof resolveSlots<(typeof MATTERS_POINTS)[number]>>;
	statList: { id: string; label: string; value: string; note: string }[];
	freshnessList: ReturnType<typeof resolveSlots<(typeof FRESHNESS_CARDS)[number]>>;
	seoOverrides?: SeoDoc;
	scripts?: ScriptsDoc;
}

const has = (text: string | undefined): text is string => Boolean(text?.trim());

const stripBlank = (record: Record<string, string | undefined> | undefined) =>
	Object.fromEntries(Object.entries(record ?? {}).filter(([, v]) => has(v)));

/** `{name}` / `{an}` filled into a card's text. */
const fillCard = <T extends { title: string; body: string }>(card: T, name: string) => ({
	...card,
	title: fillPlatform(card.title, name),
	body: fillPlatform(card.body, name),
});

function finish(p: PlatformPage, extra?: Pick<ResolvedPlatform, "seoOverrides" | "scripts">): ResolvedPlatform {
	const searchBy = (p.searchByCards ?? []).filter((c) => has(c.title));
	const whoFor = (p.whoForCards ?? []).filter((c) => has(c.title));
	return {
		...p,
		copy: resolvePlatformCopy(p.headings, p.name),
		searchByList: (searchBy.length ? searchBy : SEARCH_BY_CARDS).map((c) => fillCard(c, p.name)),
		whoForList: (whoFor.length ? whoFor : WHO_FOR_CARDS).map((c) => fillCard(c, p.name)),
		briefList: resolveSlots(BRIEFS, p.briefs).map((c) => fillCard(c, p.name)),
		mattersList: resolveSlots(MATTERS_POINTS, p.mattersPoints).map((c) => fillCard(c, p.name)),
		statList: MATTERS_STATS.map((stat) => ({
			id: stat.id,
			label: p.mattersStats?.[stat.id]?.label?.trim() || stat.label,
			value: p.mattersStats?.[stat.id]?.value?.trim() || stat.value,
			note: p.mattersStats?.[stat.id]?.note?.trim() || stat.note,
		})),
		freshnessList: resolveSlots(FRESHNESS_CARDS, p.freshness).map((c) => fillCard(c, p.name)),
		...extra,
	};
}

const isPlatformKey = (value: string | undefined): value is PlatformKey =>
	PLATFORM_KEYS.includes(value as PlatformKey);
const isIconTile = (value: string | undefined): value is IconTile => ICON_TILES.includes(value as IconTile);

function fromSanity(doc: PlatformPageDoc, code: PlatformPage | undefined): ResolvedPlatform {
	const name = has(doc.platformName) ? doc.platformName : (code?.name ?? doc.slug);
	const faqs = (doc.faqs ?? []).filter((f): f is Faq => has(f.question) && has(f.answer));
	const searchByCards = (doc.searchByCards ?? [])
		.filter((c) => has(c.title))
		.map((c) => ({ icon: isIconTile(c.icon) ? c.icon : "search", title: c.title!.trim(), body: c.body?.trim() ?? "" }));
	const whoForCards = (doc.whoForCards ?? [])
		.filter((c) => has(c.title))
		.map((c) => ({ title: c.title!.trim(), body: c.body?.trim() ?? "" }));
	const heroBody = plainText(fillPlatform(resolvePlatformCopy(undefined, name).heroBody, name));

	return finish(
		{
			slug: doc.slug,
			name,
			platform: isPlatformKey(doc.platform) ? doc.platform : (code?.platform ?? "instagram"),
			draft: doc.draft ?? true,
			seo: {
				title: has(doc.seo?.title)
					? doc.seo.title
					: (code?.seo.title ?? `${name} Influencer Search and Discovery | Influenze.ai`),
				description: has(doc.seo?.description) ? doc.seo.description : (code?.seo.description ?? heroBody),
			},
			headings: { ...code?.headings, ...stripBlank(doc.headings) },
			searchByCards: searchByCards.length ? searchByCards : code?.searchByCards,
			whoForCards: whoForCards.length ? whoForCards : code?.whoForCards,
			briefs: { ...code?.briefs, ...doc.briefs },
			mattersPoints: { ...code?.mattersPoints, ...doc.mattersPoints },
			mattersStats: { ...code?.mattersStats, ...doc.mattersStats },
			freshness: { ...code?.freshness, ...doc.freshness },
			faqs: faqs.length ? faqs : code?.faqs,
		},
		{ seoOverrides: doc.seo, scripts: doc.scripts },
	);
}

/** Every platform page, Sanity's first, then code-only pages. Drafts included. */
export async function getPlatforms(perspectiveCookie?: string): Promise<ResolvedPlatform[]> {
	const { data } = await getPlatformPages(perspectiveCookie);
	const bySlug = new Map(PLATFORM_PAGES.map((p) => [p.slug, p]));
	const fromCms = (data ?? []).map((doc) => fromSanity(doc, bySlug.get(doc.slug)));
	const cmsSlugs = new Set(fromCms.map((p) => p.slug));
	return [...fromCms, ...PLATFORM_PAGES.filter((p) => !cmsSlugs.has(p.slug)).map((p) => finish(p))];
}

/** One platform page by slug, fetched at render time so edits show without a restart. */
export async function getPlatform(slug: string | undefined, perspectiveCookie?: string) {
	if (!slug) return undefined;
	return (await getPlatforms(perspectiveCookie)).find((p) => p.slug === slug);
}
