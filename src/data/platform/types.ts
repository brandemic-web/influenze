import type { Faq } from "../faqs";
import type {
	BriefId,
	CardText,
	FreshnessId,
	HowStepId,
	IconCardText,
	MattersPointId,
	MattersStatId,
	PlatformCopy,
	PlatformKey,
} from "./shared";

/**
 * One /platforms/<slug> page. Everything past the name is optional and falls back
 * to the defaults in shared.ts.
 */
export interface PlatformPage {
	/** The URL segment: /platforms/<slug>/ */
	slug: string;
	/** "Instagram" — fills {name} in the copy. */
	name: string;
	/** Which chip the mockups show selected. */
	platform: PlatformKey;
	/** Built only in dev and PR previews, and noindexed there, while on. */
	draft: boolean;
	seo: { title: string; description: string };
	headings?: Partial<PlatformCopy>;
	searchByCards?: IconCardText[];
	howSteps?: Partial<Record<HowStepId, Partial<CardText>>>;
	whoForCards?: CardText[];
	briefs?: Partial<Record<BriefId, Partial<CardText> & { location?: string }>>;
	mattersPoints?: Partial<Record<MattersPointId, Partial<CardText>>>;
	mattersStats?: Partial<Record<MattersStatId, { label?: string; value?: string; note?: string }>>;
	freshness?: Partial<Record<FreshnessId, Partial<CardText>>>;
	faqs?: Faq[];
}
