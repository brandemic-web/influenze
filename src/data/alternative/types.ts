import type { Faq } from "../faqs";
import type { CompetitorCell } from "../compare/types";
import type { AltCopy, CardText, FeatureRowId, FitRowId, NetworkStepId, UseCaseId } from "./shared";

/**
 * One competitor's half of its /alternatives page. Every table row is a required
 * key, so adding a row to shared.ts fails the typecheck until each competitor fills
 * it in. Everything else is optional and falls back to the defaults in shared.ts.
 */
export interface AlternativeCompetitor {
	/** The URL segment: /alternatives/<slug>/ */
	slug: string;
	name: string;
	/** Built only in dev and PR previews, and noindexed there, until every TBC is replaced. */
	draft: boolean;
	seo: { title: string; description: string };
	fit: Record<FitRowId, CompetitorCell>;
	features: Record<FeatureRowId, CompetitorCell>;
	faqs?: Faq[];
	headings?: Partial<AltCopy>;
	whyCards?: CardText[];
	steps?: Partial<Record<NetworkStepId, Partial<CardText>>>;
	useCases?: Partial<Record<UseCaseId, Partial<CardText>>>;
}
