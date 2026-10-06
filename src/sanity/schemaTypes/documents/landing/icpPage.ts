import { defineArrayMember, defineField, defineType } from "sanity";
import { LANDING_GROUPS, closingFields, heroFields, landingPreview, section } from "./shared";

/** /for/<slug> — Content Playbook doc 03: one role, its workflow, its objections. */
export default defineType({
	name: "icpPage",
	title: "ICP Page",
	type: "document",
	groups: LANDING_GROUPS,
	fields: [
		...heroFields("icpPage", "“[Outcome] for [ICP], without [current painful workflow]” — put the role noun in the H1, title and first paragraph."),
		section("workflowStrip", "Built for your workflow", "landingStepsSection", "The role's real sequence, e.g. brief → search → analyze → shortlist → client review."),
		section("problems", "Problems", "landingCardsSection", "3–5 role-specific problems from sales conversations — not generic “save time” copy."),
		section("beforeAfter", "Before / after table", "landingTableSection", "Leave empty to use the standard five rows."),
		section("capabilities", "Capability-to-outcome modules", "landingCardsSection", "Discover / analyze / organize-compare / share-contact — each with a screenshot, an outcome and a feature-page link."),
		defineField({
			name: "scenario",
			title: "Live scenario",
			type: "object",
			group: "sections",
			fields: [
				defineField({ name: "heading", title: "Heading", type: "string" }),
				defineField({ name: "brief", title: "The brief", type: "text", rows: 3 }),
				defineField({
					name: "filters",
					title: "Filters applied",
					type: "array",
					of: [
						defineArrayMember({
							type: "object",
							name: "filter",
							fields: [
								defineField({ name: "label", title: "Filter", type: "string" }),
								defineField({ name: "value", title: "Value", type: "string" }),
							],
							preview: { select: { title: "label", subtitle: "value" } },
						}),
					],
				}),
				defineField({ name: "outcome", title: "What comes out", type: "text", rows: 2 }),
			],
		}),
		defineField({
			name: "economics",
			title: "Economics — credits to tasks",
			type: "array",
			group: "sections",
			of: [defineArrayMember({ type: "landingCreditScenario" })],
			description: "Credits are worked out from the live credit costs. No invented savings percentages.",
		}),
		...closingFields(),
	],
	preview: landingPreview(),
});
