/**
 * Resolves every /features/<slug> page from Sanity's featureLandingPage documents and
 * the code files in data/feature, so the route never sees a nullable field. Same rules
 * as the other sources: Sanity wins field by field; empty fields fall back to the code
 * file, then to the defaults in shared.ts.
 */
import {
	FEATURE_PAGES,
	FRESHNESS_CARDS,
	HOW_STEPS,
	NUMBERS_CARDS,
	WHO_FOR_CARDS,
	plainText,
	resolveFeatureCopy,
	resolveSlots,
	type CardText,
	type FeatureCopy,
	type FeaturePage,
} from "../data/feature";
import type { Faq } from "../data/faqs";
import { urlFor } from "../sanity/lib/image";
import { getFeatureLandingPages, type FeatureLandingPageDoc, type ScriptsDoc, type SeoDoc } from "../sanity/lib/queries";

export interface ResolvedFeature extends FeaturePage {
	copy: FeatureCopy;
	howList: ReturnType<typeof resolveSlots<(typeof HOW_STEPS)[number]>>;
	numbersList: ReturnType<typeof resolveSlots<(typeof NUMBERS_CARDS)[number]>>;
	freshnessList: ReturnType<typeof resolveSlots<(typeof FRESHNESS_CARDS)[number]>>;
	whoForList: CardText[];
	/** Uploaded image that replaces the creator rows under "the fastest way…"; undefined keeps the rows. */
	resultImage?: { src: string; alt: string };
	/** Uploaded images either side of the manual-way text box; undefined keeps the bundled icon. */
	manualImages?: { left?: string; right?: string };
	seoOverrides?: SeoDoc;
	scripts?: ScriptsDoc;
}

const has = (text: string | undefined): text is string => Boolean(text?.trim());

const stripBlank = (record: Record<string, string | undefined> | undefined) =>
	Object.fromEntries(Object.entries(record ?? {}).filter(([, v]) => has(v)));

function finish(p: FeaturePage, extra?: Pick<ResolvedFeature, "seoOverrides" | "scripts" | "resultImage" | "manualImages">): ResolvedFeature {
	const whoFor = (p.whoForCards ?? []).filter((c) => has(c.title));
	return {
		...p,
		copy: resolveFeatureCopy(p.headings),
		howList: resolveSlots(HOW_STEPS, p.howSteps),
		numbersList: resolveSlots(NUMBERS_CARDS, p.numbers),
		freshnessList: resolveSlots(FRESHNESS_CARDS, p.freshness),
		whoForList: whoFor.length ? whoFor : WHO_FOR_CARDS,
		...extra,
	};
}

function fromSanity(doc: FeatureLandingPageDoc, code: FeaturePage | undefined): ResolvedFeature {
	const name = has(doc.name) ? doc.name : (code?.name ?? doc.slug);
	const faqs = (doc.faqs ?? []).filter((f): f is Faq => has(f.question) && has(f.answer));
	const whoForCards = (doc.whoForCards ?? [])
		.filter((c) => has(c.title))
		.map((c) => ({ title: c.title!.trim(), body: c.body?.trim() ?? "" }));
	const headings = { ...code?.headings, ...stripBlank(doc.headings) };
	const copy = resolveFeatureCopy(headings);

	return finish(
		{
			slug: doc.slug,
			name,
			draft: doc.draft ?? true,
			seo: {
				title: has(doc.seo?.title) ? doc.seo.title : (code?.seo.title ?? `${name} | Influenze.ai`),
				description: has(doc.seo?.description) ? doc.seo.description : (code?.seo.description ?? plainText(copy.heroBody)),
			},
			headings,
			howSteps: { ...code?.howSteps, ...doc.howSteps },
			numbers: { ...code?.numbers, ...doc.numbers },
			freshness: { ...code?.freshness, ...doc.freshness },
			whoForCards: whoForCards.length ? whoForCards : code?.whoForCards,
			heroBubbles: doc.heroBubbles?.length ? doc.heroBubbles : code?.heroBubbles,
			faqs: faqs.length ? faqs : code?.faqs,
		},
		{
			// Twice the rows' 879px design width, for sharpness on large windows.
			resultImage: doc.resultImage?.asset
				? { src: urlFor(doc.resultImage).width(1758).url(), alt: doc.resultImage.alt?.trim() ?? "" }
				: undefined,
			// Twice the larger icon's 317px design width. Width only, so the image is never cropped.
			manualImages: {
				left: doc.manualImages?.left?.asset ? urlFor(doc.manualImages.left).width(634).url() : undefined,
				right: doc.manualImages?.right?.asset ? urlFor(doc.manualImages.right).width(634).url() : undefined,
			},
			seoOverrides: doc.seo,
			scripts: doc.scripts,
		},
	);
}

/** Every feature landing page, Sanity's first, then code-only pages. Drafts included. */
export async function getFeaturePages(perspectiveCookie?: string): Promise<ResolvedFeature[]> {
	const { data } = await getFeatureLandingPages(perspectiveCookie);
	const bySlug = new Map(FEATURE_PAGES.map((p) => [p.slug, p]));
	const fromCms = (data ?? []).map((doc) => fromSanity(doc, bySlug.get(doc.slug)));
	const cmsSlugs = new Set(fromCms.map((p) => p.slug));
	return [...fromCms, ...FEATURE_PAGES.filter((p) => !cmsSlugs.has(p.slug)).map((p) => finish(p))];
}

/** One feature landing page by slug, fetched at render time so edits show without a restart. */
export async function getFeaturePage(slug: string | undefined, perspectiveCookie?: string) {
	if (!slug) return undefined;
	return (await getFeaturePages(perspectiveCookie)).find((p) => p.slug === slug);
}
