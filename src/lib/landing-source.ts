/** Shapes landing-page documents for the six templates, so components never see a nullable field. */
import { resolveIcon, type SanityIcon } from "../sanity/lib/icon";
import { WORKFLOW_ICONS } from "../data/workflowIcons";
import {
	CLOSING_CTA,
	HEAD_TO_HEAD_GRAPHICS,
	HEAD_TO_HEAD_ROWS,
	LANDING_CTA,
	LANDING_ROUTES,
	PROOF_CHIPS,
	TYPE_ICONS,
	landingHref,
	VIGNETTE_FOR_ICON,
	type LandingIconName,
	type LandingType,
	type VignetteKind,
} from "../data/landing";
import { CREDIT_COSTS } from "../data/pricing";
import { formatPublished } from "../data/blog";
import {
	getLandingList,
	type CompetitorDoc,
	type LandingCardsSectionDoc,
	type LandingCreditScenarioDoc,
	type LandingPageDoc,
	type LandingRelatedPageDoc,
	type LandingStepsSectionDoc,
	type LandingTableSectionDoc,
} from "../sanity/lib/landingQueries";

/** An app glyph by name, or an uploaded image's URL. */
export type LandingIconRef = { name: LandingIconName } | { src: string };

/**
 * A card's icon: the editor's upload, else their pick from the app set, else the section's
 * fallback — so a card is never drawn without one.
 */
export function iconOf(source: SanityIcon | undefined, fallback: LandingIconName): LandingIconRef {
	if (source?.iconSource === "upload") {
		const src = resolveIcon(source, {}, 96);
		if (src) return { src };
	}
	const name = source?.icon;
	return name && name in WORKFLOW_ICONS ? { name: name as LandingIconName } : { name: fallback };
}

/**
 * A card's product graphic: the editor's pick, else — where `auto` — the one its icon
 * suggests. Uploaded icons suggest nothing.
 */
export function vignetteOf(
	source: { visual?: VignetteKind } | undefined,
	icon: LandingIconRef,
	auto: boolean,
): VignetteKind | undefined {
	if (source?.visual) return source.visual;
	return auto && "name" in icon ? VIGNETTE_FOR_ICON[icon.name] : undefined;
}

/** Credits per action, keyed by CREDIT_COSTS' ids — the same numbers /pricing prints. */
export const CREDITS = Object.fromEntries(CREDIT_COSTS.map((action) => [action.id, action.credits])) as Record<
	(typeof CREDIT_COSTS)[number]["id"],
	number
>;

/** `searches × search + analytics × analytics + contacts × contact`, the playbook's formula. */
export function creditsFor(scenario: Pick<LandingCreditScenarioDoc, "searches" | "analytics" | "contacts">): number {
	return (
		(scenario.searches ?? 0) * CREDITS.search +
		(scenario.analytics ?? 0) * CREDITS.analytics +
		(scenario.contacts ?? 0) * CREDITS.contact
	);
}

/** Every slug a template should build, so a page exists exactly when it is published. */
export async function landingPaths(type: LandingType) {
	const { data } = await getLandingList(type);
	return (data ?? []).filter((page) => page.slug).map((page) => ({ params: { slug: page.slug! } }));
}

export function relatedHref(page: LandingRelatedPageDoc): string | undefined {
	if (!page.slug) return undefined;
	return page._type === "blogPost" ? `/blog/${page.slug}/` : landingHref(page._type, page.slug);
}

export interface LandingLinkItem {
	label: string;
	href: string;
	description?: string;
	icon?: LandingIconName;
}

/** Picked pages first, in the editor's order, then the free-form links. */
export function relatedLinks(related: LandingPageDoc["related"]): LandingLinkItem[] {
	const pages = (related?.pages ?? []).flatMap((page) => {
		const href = page && relatedHref(page);
		return page?.title && href
			? [{ label: page.title, href, description: page.summary, icon: TYPE_ICONS[page._type] }]
			: [];
	});
	const links = (related?.links ?? []).flatMap((link) =>
		link.label && link.href
			? [{ label: link.label, href: link.href, description: link.description, icon: TYPE_ICONS.link }]
			: [],
	);
	return [...pages, ...links];
}

export interface HeadToHeadRow {
	icon: LandingIconName;
	graphic?: "platforms" | "credits" | "database";
	metric: string;
	influenze: string;
	competitor: string;
	source?: string;
}

/**
 * The mandatory rows in their fixed order, then the competitor's verified supporting rows.
 * A mandatory row the competitor document hasn't filled in reads "Not verified" rather than
 * disappearing — the playbook forbids dropping one.
 */
export function headToHeadRows(competitor: CompetitorDoc | null | undefined): HeadToHeadRow[] {
	const costs = CREDIT_COSTS.map((action) => `${action.label.toLowerCase()} ${action.credits}`).join(" · ");
	const mandatory = HEAD_TO_HEAD_ROWS.map((row) => {
		const theirs = competitor?.positions?.[row.id];
		return {
			icon: row.icon,
			graphic: HEAD_TO_HEAD_GRAPHICS[row.id],
			metric: row.metric,
			// The credits row draws its costs as badges; the text keeps them for readers without the graphic.
			influenze: row.id === "credits" ? `${row.influenze} (${costs})` : row.influenze,
			competitor: theirs?.value || "Not verified",
			source: theirs?.source,
		};
	});
	const extra = (competitor?.extraRows ?? []).flatMap((row) =>
		row.metric && row.influenze && row.competitor
			? [{ icon: "info" as const, metric: row.metric, influenze: row.influenze, competitor: row.competitor, source: row.source }]
			: [],
	);
	return [...mandatory, ...extra];
}

/** Everything the hero needs, with the approved defaults filled in. */
export function heroFrom(page: LandingPageDoc, type: LandingType) {
	return {
		eyebrow: page.eyebrow || LANDING_ROUTES[type].crumb,
		title: page.title ?? "",
		answer: page.answer ?? "",
		// An editor's own chips carry a tick; the approved set has its own icons.
		chips: page.proofChips?.length
			? page.proofChips.map((label) => ({ label, icon: "circleCheck" as LandingIconName }))
			: PROOF_CHIPS,
		ctaLabel: page.ctaLabel || LANDING_CTA.primaryLabel,
		ctaHref: LANDING_CTA.href,
		reviewed: page.reviewedAt ? formatPublished(page.reviewedAt) : undefined,
		reviewedIso: page.reviewedAt,
		crumbs: breadcrumbs(type, page.title ?? ""),
	};
}

export function ctaFrom(page: LandingPageDoc, type: LandingType) {
	const fallback = CLOSING_CTA[type];
	const href = page.cta?.href || LANDING_CTA.href;
	return {
		heading: page.cta?.heading || fallback.heading,
		body: page.cta?.body || fallback.body,
		label: page.cta?.label || LANDING_CTA.primaryLabel,
		href,
		// Signup lives on the app's subdomain; anything else on this site stays in the tab.
		newTab: /^https?:\/\//.test(href),
	};
}

export function breadcrumbs(type: LandingType, title: string) {
	const route = LANDING_ROUTES[type];
	return [
		{ label: "Home", href: "/" },
		{ label: route.crumb, href: route.hub },
		{ label: title },
	];
}

export function faqItems(page: LandingPageDoc) {
	return (page.faq?.items ?? []).flatMap((faq) =>
		faq.question && faq.answer ? [{ question: faq.question, answer: faq.answer }] : [],
	);
}

/**
 * The JSON-LD every template shares: a BreadcrumbList, and an FAQPage only when the same
 * questions are visibly answered on the page.
 */
export function landingSchema(page: LandingPageDoc, type: LandingType, site: URL) {
	const crumbs = breadcrumbs(type, page.title ?? "");
	const faqs = faqItems(page);
	return [
		{
			"@type": "BreadcrumbList",
			itemListElement: crumbs.map((crumb, i) => ({
				"@type": "ListItem",
				position: i + 1,
				name: crumb.label,
				...(crumb.href ? { item: new URL(crumb.href, site).href } : {}),
			})),
		},
		...(faqs.length
			? [
					{
						"@type": "FAQPage",
						mainEntity: faqs.map((faq) => ({
							"@type": "Question",
							name: faq.question,
							acceptedAnswer: { "@type": "Answer", text: faq.answer },
						})),
					},
				]
			: []),
	];
}

/** A card section's cards, minus any left without a title. */
export function cardsOf(
	section: LandingCardsSectionDoc | undefined,
	fallbackIcon: LandingIconName = "circleCheck",
	{ autoVisual = false }: { autoVisual?: boolean } = {},
) {
	return (section?.cards ?? []).flatMap((card) => {
		const icon = iconOf(card, fallbackIcon);
		return card.title
			? [
					{
						title: card.title,
						icon,
						visual: vignetteOf(card, icon, autoVisual),
						body: card.body,
						bullets: card.bullets?.filter(Boolean),
						linkLabel: card.linkLabel,
						href: card.href,
						image: card.image?.url ? { url: card.image.url, alt: card.image.alt ?? "" } : undefined,
					},
				]
			: [];
	});
}

export function stepsOf(section: LandingStepsSectionDoc | undefined, fallbackIcon: LandingIconName = "circleCheck") {
	return (section?.steps ?? []).flatMap((step) =>
		step.title
			? [
					{
						title: step.title,
						icon: iconOf(step, fallbackIcon),
						body: step.body,
						image: step.image?.url ? { url: step.image.url, alt: step.image.alt ?? "" } : undefined,
					},
				]
			: [],
	);
}

/** A table section, or undefined when it has no columns or rows to show. */
export function tableOf(section: LandingTableSectionDoc | undefined) {
	const columns = section?.columns?.filter(Boolean) ?? [];
	const rows = (section?.rows ?? []).flatMap((row) =>
		row.cells?.length ? [{ cells: row.cells, source: row.source }] : [],
	);
	return columns.length && rows.length ? { columns, rows, note: section?.note } : undefined;
}

/** Whether a rich-text field has anything worth a section. */
export function hasBlocks(blocks: Record<string, unknown>[] | undefined): blocks is Record<string, unknown>[] {
	return Boolean(blocks?.length);
}
