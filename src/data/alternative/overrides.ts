/**
 * Fields set in code that win over the page's Sanity document, keyed by slug. Use it
 * only while the Studio document can't be edited; once Studio matches, delete the
 * entry. Applied last in lib/alternative-source.ts.
 */
import type { AlternativeCompetitor } from "./types";

export const ALTERNATIVE_OVERRIDES: Record<string, Partial<Pick<AlternativeCompetitor, "name" | "draft" | "whyCards">>> = {
	// Studio has the name in capitals and a sixth card the LP doc doesn't have.
	qoruz: {
		// Live: Studio still has Draft switched on.
		draft: false,
		name: "Qoruz",
		whyCards: [
			{ title: "No Annual Commitment", body: "Start with 500 credits. No long-term contracts." },
			{ title: "Focused Creator Discovery", body: "Find, evaluate and shortlist the right creators for every brief." },
			{ title: "Transparent Pricing", body: "See per-action credit costs upfront. No sales demo." },
			{ title: "Shareable Creator Lists", body: "Build, save and share creator shortlists with clients." },
			{ title: "Works With Your Stack", body: "Keep the outreach and payment tools you already use." },
		],
	},
};
