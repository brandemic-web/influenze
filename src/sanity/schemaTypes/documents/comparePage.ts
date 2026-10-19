import { defineArrayMember, defineField, defineType } from "sanity";
import {
	FEATURE_ROWS,
	PRICING_ROWS,
	SCENARIOS,
	SECTION_COPY_FIELDS,
	WORKFLOW_STEPS,
	type CompareRow,
	type SectionCopyKey,
} from "../../../data/compare/shared";
import { UPFLUENCE } from "../../../data/compare/upfluence";
import { copyField } from "../../lib/copyField";

/**
 * One /compare/<slug> page: the competitor's half of the comparison. Influenze's
 * half (our cells, headings, scenarios) is shared by every compare page and lives
 * in src/data/compare/shared.ts.
 *
 * The table and workflow fields are generated from that file's row lists, so
 * Studio always offers exactly the rows the page draws. A new document starts
 * from a template: every row present, dashes set where the design has them.
 * Each section's heading and subheading sit at the top of that section's tab.
 */

/** "Fill this in", raised as a warning rather than an error so drafts still save and publish. */
const isFilled = (label: string) => (value: unknown) => {
	const text = typeof value === "object" && value !== null ? (value as { text?: string }).text : value;
	return typeof text === "string" && text.trim() ? true : `${label} is empty — the page shows a placeholder.`;
};

const cellFields = (rows: readonly { id: string; label: string }[]) =>
	rows.map((row) =>
		defineField({
			name: row.id,
			title: row.label,
			type: "compareCell",
			validation: (Rule) => Rule.custom(isFilled(row.label)).warning(),
		}),
	);

/** A section heading or subheading, from SECTION_COPY_FIELDS; the page reads these as `headings`. */
const headingField = (key: SectionCopyKey, group: string) =>
	copyField(SECTION_COPY_FIELDS.find((field) => field.key === key)!, group);

/** An empty cell, with the design's dash wherever Influenze shows a tick. */
const blankCell = (row: CompareRow) => ({ _type: "compareCell", text: "", mark: Boolean(row.influenze.mark) });

/** The template a new compare page opens with. */
const template = () => ({
	draft: true,
	chooseInfluenze: UPFLUENCE.chooseInfluenze,
	features: Object.fromEntries(
		FEATURE_ROWS.map((row) => [row.id, blankCell(row)]),
	),
	pricing: Object.fromEntries(
		PRICING_ROWS.map((row) => [row.id, blankCell(row)]),
	),
	workflow: Object.fromEntries(WORKFLOW_STEPS.map((step) => [step.id, ""])),
});

export default defineType({
	name: "comparePage",
	title: "Compare Page",
	type: "document",
	initialValue: template,
	groups: [
		{ name: "content", title: "Hero & Cards", default: true },
		{ name: "features", title: "Feature Table" },
		{ name: "pricing", title: "Pricing Table" },
		{ name: "workflow", title: "Workflow" },
		{ name: "scenarios", title: "Scenarios" },
		{ name: "faq", title: "FAQ" },
		{ name: "seo", title: "SEO" },
	],
	fields: [
		defineField({
			name: "competitorName",
			title: "Competitor name",
			type: "string",
			group: "content",
			description:
				'Just the competitor, e.g. "Qoruz". The page adds "Influenze.ai vs" itself, and uses this in the table header and "Choose … if..".',
			validation: (Rule) =>
				Rule.required().custom((value) =>
					typeof value === "string" && /influenze|\bvs\b/i.test(value)
						? 'Enter only the competitor\'s name — the page already adds "Influenze.ai vs".'
						: true,
				),
		}),
		defineField({
			name: "slug",
			title: "Slug",
			type: "slug",
			group: "content",
			options: { source: "competitorName", maxLength: 96 },
			description: "The page's address: /compare/<slug>. Changing it breaks existing links.",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "draft",
			title: "Draft",
			type: "boolean",
			group: "content",
			initialValue: true,
			description:
				"While on, the page is built only for previews and kept out of search engines — never on the live site. Turn off once every competitor fact is verified.",
		}),
		headingField("heroEyebrow", "content"),
		headingField("heroTitle", "content"),
		headingField("heroQuestion", "content"),
		defineField({
			name: "intro",
			title: "Intro",
			type: "text",
			rows: 3,
			group: "content",
			description: 'The paragraph under the hero question. "Influenze.ai" in it is coloured green automatically.',
			validation: (Rule) => Rule.custom(isFilled("Intro")).warning(),
		}),
		headingField("chooseInfluenzeHeading", "content"),
		defineField({
			name: "chooseInfluenze",
			title: "Choose Influenze.ai for..",
			type: "array",
			group: "content",
			of: [defineArrayMember({ type: "string" })],
		}),
		headingField("chooseCompetitorHeading", "content"),
		defineField({
			name: "chooseCompetitor",
			title: "Choose <competitor> if..",
			type: "array",
			group: "content",
			of: [defineArrayMember({ type: "text", rows: 2 })],
			description: "A line break in a point is a line break on the page.",
		}),

		headingField("featureHeading", "features"),
		headingField("featureSubcopy", "features"),
		defineField({
			name: "features",
			title: "Feature table — their column",
			type: "object",
			group: "features",
			options: { collapsible: false },
			fields: cellFields(FEATURE_ROWS),
		}),
		headingField("pricingHeading", "pricing"),
		headingField("pricingSubcopy", "pricing"),
		defineField({
			name: "pricing",
			title: "Pricing table — their column",
			type: "object",
			group: "pricing",
			options: { collapsible: false },
			fields: cellFields(PRICING_ROWS),
		}),
		headingField("workflowHeading", "workflow"),
		headingField("workflowSubcopy", "workflow"),
		defineField({
			name: "workflow",
			title: "Workflow — their coverage per step",
			type: "object",
			group: "workflow",
			options: { collapsible: false },
			description: 'Shown as "<competitor> : <this>" under each step, e.g. "Core" or "Verify".',
			fields: WORKFLOW_STEPS.map((step) =>
				defineField({
					name: step.id,
					title: step.title,
					type: "string",
					validation: (Rule) => Rule.custom(isFilled(step.title)).warning(),
				}),
			),
		}),

		headingField("scenariosHeading", "scenarios"),
		defineField({
			name: "scenarios",
			title: "Cards",
			type: "object",
			group: "scenarios",
			options: { collapsible: false },
			description: "Leave a field empty to keep the default shown in it. The card images and icons stay as designed.",
			fields: SCENARIOS.map((card, i) =>
				defineField({
					name: card.imageKey,
					title: `Card ${i + 1} — ${card.title}`,
					type: "object",
					options: { collapsible: false },
					fields: [
						defineField({ name: "title", title: "Title", type: "string", placeholder: card.title }),
						defineField({
							name: "description",
							title: "Body",
							type: "text",
							rows: 2,
							placeholder: card.description,
						}),
					],
				}),
			),
		}),

		headingField("faqHeading", "faq"),
		headingField("faqSubcopy", "faq"),
		defineField({
			name: "faqs",
			title: "Questions",
			type: "array",
			group: "faq",
			of: [defineArrayMember({ type: "blogFaq" })],
			description: "Leave empty to show the homepage FAQs.",
		}),

		defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
		defineField({
			name: "scripts",
			title: "Page scripts",
			type: "customScripts",
			group: "seo",
			description: "Injected after the site-wide global scripts, only on this page.",
		}),
	],
	preview: {
		select: { name: "competitorName", slug: "slug.current", draft: "draft" },
		prepare: ({ name, slug, draft }) => ({
			title: name ? `Influenze.ai vs ${name}` : "New compare page",
			subtitle: [slug && `/compare/${slug}/`, draft && "Draft"].filter(Boolean).join(" · "),
		}),
	},
});
