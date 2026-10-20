/**
 * Fields set in code that win over the page's Sanity document, keyed by slug. Use it
 * only while the Studio document can't be edited; once Studio matches, delete the
 * entry. Applied last in lib/compare-source.ts.
 */
import type { Competitor } from "./types";

export const COMPARE_OVERRIDES: Record<string, Partial<Pick<Competitor, "slug" | "chooseCompetitor" | "headings">>> = {
	// Studio has the "Verified on…" line as a fourth point; the LP doc sets it as small print.
	"influenze-ai-vs-qoruz": {
		// The short URL, /comparison/influenze-qoruz/.
		slug: "influenze-qoruz",
		chooseCompetitor: [
			"You want outreach, campaign management and reporting in one suite",
			"You are comfortable booking a demo for paid plan pricing",
			"One vendor for discovery through campaign reporting matters most",
		],
		headings: { chooseCompetitorNote: "Verified on qoruz.com, Oct 2026" },
	},
};
