import { defineField, defineType } from "sanity";
import { WORKFLOW_STEPS } from "../../../../data/landing";
import { LANDING_GROUPS, closingFields, heroFields, landingPreview, section } from "./shared";

/** /features/<slug> — Content Playbook doc 05: the job, how it works, and where it stops. */
export default defineType({
	name: "featurePage",
	title: "Feature Page",
	type: "document",
	groups: LANDING_GROUPS,
	fields: [
		...heroFields("featurePage", "Name the job, e.g. “Find creators from a real brief with AI-driven search”."),
		defineField({
			name: "boundary",
			title: "Hero boundary line",
			type: "string",
			group: "hero",
			description: "One sentence on what this feature does not do, shown under the answer.",
		}),
		defineField({
			name: "heroImage",
			title: "Screenshot",
			type: "image",
			group: "hero",
			description: "Cropped to 4:3.",
			fields: [defineField({ name: "alt", title: "Alt text", type: "string" })],
		}),
		defineField({
			name: "workflowStep",
			title: "Workflow step",
			type: "string",
			group: "hero",
			options: { list: WORKFLOW_STEPS.map((step) => step.title) },
			description: "Highlighted in the “Where this fits in the workflow” strip.",
		}),
		section("problem", "Problem statement", "landingProseSection", "The manual behaviour this replaces — searches, spreadsheets, screenshots, subjective comparison."),
		section("howItWorks", "How it works", "landingStepsSection", "3–5 numbered steps, verb + output, with screenshots."),
		section("inputsOutputs", "Inputs and outputs", "landingTableSection"),
		section("definitions", "Proof and definitions", "landingCardsSection", "Explain every metric. Contacts are aggregated, not verified."),
		section("useCases", "ICP use cases", "landingCardsSection", "Agency, brand, talent/freelance."),
		section("scope", "Scope and limitations", "landingProseSection", "What the feature does not do."),
		...closingFields(),
	],
	preview: landingPreview(),
});
