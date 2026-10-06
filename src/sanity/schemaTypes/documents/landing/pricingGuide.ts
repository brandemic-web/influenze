import { defineArrayMember, defineField, defineType } from "sanity";
import { LANDING_GROUPS, closingFields, heroFields, landingPreview, section } from "./shared";

/**
 * /pricing/<slug> — Content Playbook doc 06. Credit costs and rollover rules are not fields:
 * they come from the live pricing data, so a guide can't quote a stale price.
 */
export default defineType({
	name: "pricingGuide",
	title: "Pricing Guide",
	type: "document",
	groups: LANDING_GROUPS,
	fields: [
		...heroFields("pricingGuide", "e.g. “Creator discovery pricing you can understand before a sales call.”"),
		defineField({
			name: "showPlans",
			title: "Show the plan selector",
			type: "boolean",
			group: "sections",
			initialValue: false,
			description: "Embeds the live pricing panel from /pricing.",
		}),
		defineField({
			name: "showCalculator",
			title: "Show the credit calculator",
			type: "boolean",
			group: "sections",
			initialValue: true,
		}),
		section("body", "Guide body", "landingRichText", "The guide's own explanation, for topics like “Credit rollover explained”. Optional."),
		defineField({
			name: "includes",
			title: "What every plan includes",
			type: "array",
			group: "sections",
			of: [defineArrayMember({ type: "string" })],
			description: "Only confirmed common features.",
		}),
		defineField({
			name: "starterScenarios",
			title: "500-credit starter scenarios",
			type: "array",
			group: "sections",
			of: [defineArrayMember({ type: "landingCreditScenario" })],
			description: "Agency, brand, freelancer. Credits are worked out from the live costs.",
		}),
		defineField({
			name: "showRollover",
			title: "Show rollover rules",
			type: "boolean",
			group: "sections",
			initialValue: true,
		}),
		section("planFit", "Which plan fits which ICP", "landingTableSection", "A recommendation, not upsell-only."),
		section("oneTime", "One-time campaign section", "landingProseSection"),
		section("quoteLed", "Comparison with quote-led/annual platforms", "landingTableSection", "Keep it neutral."),
		...closingFields(),
	],
	preview: landingPreview(),
});
