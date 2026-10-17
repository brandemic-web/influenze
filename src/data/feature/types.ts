import type { Faq } from "../faqs";
import type { CardText, FeatureCopy, FreshnessId, NumbersId } from "./shared";

/** One /features/<slug> page. Everything past the SEO is optional; defaults are in shared.ts. */
export interface FeaturePage {
	/** The URL segment: /features/<slug>/ */
	slug: string;
	/** Internal name, shown in Studio's list. */
	name: string;
	/** Built only in dev and PR previews, and noindexed there, while on. */
	draft: boolean;
	seo: { title: string; description: string };
	headings?: Partial<FeatureCopy>;
	numbers?: Partial<Record<NumbersId, Partial<CardText>>>;
	freshness?: Partial<Record<FreshnessId, Partial<CardText>>>;
	whoForCards?: CardText[];
	faqs?: Faq[];
}
