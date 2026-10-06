import { defineArrayMember, defineField, defineType } from "sanity";
import { LANDING_GROUPS, closingFields, heroFields, landingPreview, section } from "./shared";

/**
 * /alternatives/<slug> — Content Playbook doc 02. Starts from the switching trigger, not from
 * a rewritten versus page; the head-to-head table is the competitor document's, shared.
 */
export default defineType({
	name: "alternativePage",
	title: "Alternative Page",
	type: "document",
	groups: LANDING_GROUPS,
	fields: [
		defineField({
			name: "competitor",
			title: "Competitor",
			type: "reference",
			to: [{ type: "competitor" }],
			group: "hero",
			validation: (Rule) => Rule.required(),
		}),
		...heroFields("alternativePage", "“The [Competitor] Alternative for [need]” — lead with the switching pain."),
		defineField({
			name: "whoFor",
			title: "Who this alternative is for",
			type: "object",
			group: "sections",
			fields: [
				defineField({ name: "heading", title: "Heading", type: "string" }),
				defineField({
					name: "qualifiers",
					title: "Good fit if…",
					type: "array",
					of: [defineArrayMember({ type: "string" })],
					validation: (Rule) => Rule.min(4).warning("The playbook asks for four qualifiers."),
				}),
				defineField({ name: "disqualifier", title: "Not a fit if…", type: "string" }),
			],
		}),
		section("whyLook", "Why buyers look for an alternative", "landingCardsSection", "Evidence-backed only — link each reason to its source. Never invent competitor complaints."),
		section("fitMatrix", "Quick fit matrix", "landingTableSection", "Focused discovery, campaign ops, pricing transparency, commitment, ICP."),
		section("whyInfluenze", "Why Influenze.ai is an alternative", "landingCardsSection", "Map each switching trigger to a capability."),
		section("switchingWorkflow", "Switching workflow", "landingStepsSection", "Export/retain roster → gap search → evaluate → new list → share."),
		section("useCases", "Use cases by ICP", "landingCardsSection", "Agency, brand, talent manager, freelancer."),
		section("whenToKeep", "When to keep the competitor", "landingProseSection", "Complementary or full-suite cases."),
		section("pricingCommitment", "Pricing & commitment", "landingProseSection", "Link to the credit guide."),
		...closingFields(),
	],
	preview: landingPreview("competitor.name"),
});
