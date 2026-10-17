import type { Faq } from "../faqs";
import type { FeatureRowId, PricingRowId, ScenarioId, ScenarioText, SectionCopy, WorkflowStepId } from "./shared";

export interface CompetitorCell {
	text: string;
	/** A dash above the text: they lack the capability, and `text` says what they do instead. */
	mark?: boolean;
}

/**
 * One competitor's half of its /compare page. Every table row and workflow step is a
 * required key, so adding a row to shared.ts fails the typecheck until each competitor
 * fills it in.
 */
export interface Competitor {
	/** The URL segment: /compare/<slug>/ */
	slug: string;
	name: string;
	/**
	 * Built only in dev and PR previews, and noindexed there, until every TBC is
	 * replaced with a verified fact.
	 */
	draft: boolean;
	seo: { title: string; description: string };
	/** The paragraph under the hero question. */
	intro: string;
	chooseInfluenze: string[];
	chooseCompetitor: string[];
	features: Record<FeatureRowId, CompetitorCell>;
	pricing: Record<PricingRowId, CompetitorCell>;
	workflow: Record<WorkflowStepId, string>;
	/** Questions specific to this comparison; the homepage FAQs when omitted. */
	faqs?: Faq[];
	/** Section headings to override; the defaults in shared.ts otherwise. */
	headings?: Partial<SectionCopy>;
	/** Scenario card text to override; the defaults in shared.ts otherwise. */
	scenarios?: Partial<Record<ScenarioId, ScenarioText>>;
}
