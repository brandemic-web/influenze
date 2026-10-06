import { defineField, defineType } from "sanity";
import { LANDING_GROUPS, closingFields, heroFields, landingPreview, section } from "./shared";

/** /compare/<slug> — Content Playbook doc 01, in its canonical section order. */
export default defineType({
	name: "comparisonPage",
	title: "Comparison Page",
	type: "document",
	groups: LANDING_GROUPS,
	fields: [
		defineField({
			name: "competitor",
			title: "Competitor",
			type: "reference",
			to: [{ type: "competitor" }],
			group: "hero",
			description: "Supplies the head-to-head table and the competitor's name throughout.",
			validation: (Rule) => Rule.required(),
		}),
		...heroFields("comparisonPage", "“Influenze.ai vs [Competitor]: Which Creator Discovery Platform Fits Your Team?”"),
		defineField({
			name: "methodologyUrl",
			title: "Methodology link",
			type: "string",
			group: "hero",
			description: "Where “How we compare” points, beside the reviewed date. Leave blank to hide it.",
		}),
		defineField({
			name: "chooseInfluenze",
			title: "Quick verdict — choose Influenze.ai if…",
			type: "landingCard",
			group: "sections",
		}),
		defineField({
			name: "chooseCompetitor",
			title: "Quick verdict — choose the competitor if…",
			type: "landingCard",
			group: "sections",
		}),
		defineField({
			name: "deepDives",
			title: "Metric deep dives",
			type: "array",
			group: "sections",
			of: [{ type: "landingDeepDive" }],
			description: "One per mandatory metric, each phrased as a question.",
		}),
		section("workflowCoverage", "Workflow coverage", "landingTableSection", "Step matrix — mark each step Core or Verify."),
		section("scenarios", "ICP scenarios", "landingCardsSection", "Three required: agency 24-hr pitch, D2C 30-UGC sourcing, talent-manager roster mapping."),
		section("pricingCommitment", "Pricing & commitment", "landingTableSection", "Entry path, public pricing, credit/module structure, minimum commitment, trial, sales-call requirement."),
		section("limitations", "Honest limitations", "landingProseSection", "Where Influenze.ai is not the right choice."),
		...closingFields(),
	],
	preview: landingPreview("competitor.name"),
});
