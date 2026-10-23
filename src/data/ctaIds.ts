/**
 * The `cta_id` marketing reports each landing page's hero button under, sent
 * with its `signup_cta_click` event (see scripts/attribution.ts).
 *
 * Listed by path because three of the slugs differ from the names marketing
 * chose (influenze-ai-vs-qoruz, ai-search, pricing-plans). A page not listed
 * here, such as a new one published from Sanity, falls back to
 * `hero-sec-<page>-lp-<slug>`.
 */
const HERO_CTA_IDS: Record<string, string> = {
	"/comparison/influenze-ai-vs-qoruz": "hero-sec-com-lp-qoruz",
	"/comparison/influenze-ai-vs-upfluence": "hero-sec-com-lp-upfluence",
	"/alternatives/qoruz": "hero-sec-alt-lp-qoruz",
	"/alternatives/upfluence": "hero-sec-alt-lp-upfluence",
	"/platforms/instagram": "hero-sec-platform-lp-instagram",
	"/platforms/youtube": "hero-sec-platform-lp-youtube",
	"/features/ai-search": "hero-sec-feat-lp-ai-creator-search",
	"/features/creator-analytics": "hero-sec-feat-lp-creator-analytics",
	"/pricing/pricing-plans": "hero-sec-pricing-lp-influenze-pricing",
	"/pricing/credits": "hero-sec-pricing-lp-credits",
	"/icp/agencies": "hero-sec-icp-lp-agencies",
	"/icp/gaming-agencies": "hero-sec-icp-lp-gaming-agencies",
};

/** Each landing page type's short name in a `cta_id`. */
const PAGE_KEYS: Record<string, string> = {
	comparison: "com",
	alternatives: "alt",
	platforms: "platform",
	features: "feat",
	pricing: "pricing",
	icp: "icp",
};

/** The hero button's `cta_id` for the landing page at [pathname]. */
export function heroCtaId(pathname: string): string | undefined {
	const path = pathname.replace(/\/+$/, "") || "/";
	const known = HERO_CTA_IDS[path];
	if (known) return known;
	const [, section, slug] = path.split("/");
	const key = PAGE_KEYS[section];
	if (!key || !slug) return undefined;
	return `hero-sec-${key}-lp-${slug.replace(/^influenze-ai-vs-/, "")}`;
}
