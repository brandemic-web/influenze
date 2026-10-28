import { defineArrayMember, defineField, defineType } from "sanity";
import {
	BEFORE_AFTER_ROWS,
	BRIEFS,
	BRIEF_COST_LINES,
	ICP_COPY_FIELDS,
	SLOWS_CARDS,
	SMARTER_STEPS,
	WORKFLOW_PILLS,
} from "../../../data/icp/shared";
import { copyField } from "../../lib/copyField";
import { briefPhotoFields } from "../objects/briefPhotoFields";

/**
 * One /icp/<audience> page — Influenze.ai for one kind of customer, e.g. agencies.
 * Defaults live in src/data/icp/shared.ts; empty fields keep them. Tabs follow the
 * page top to bottom, each section's headings first.
 */
const copyFields = (group: string) => ICP_COPY_FIELDS.filter((f) => f.group === group).map((f) => copyField(f, group));

const slotFields = (
	slots: readonly { id: string; title: string; body: string; location?: string }[],
	label: string,
	withPhotos = false,
) =>
	slots.map((slot, i) =>
		defineField({
			name: slot.id,
			title: `${label} ${i + 1} — ${slot.title}`,
			type: "object",
			options: { collapsible: false },
			fields: [
				defineField({ name: "title", title: "Title", type: "string", placeholder: slot.title }),
				defineField({ name: "body", title: "Text", type: "text", rows: 2, placeholder: slot.body }),
				...(slot.location
					? [
							defineField({
								name: "location",
								title: "Location shown in the app mockup",
								type: "string",
								placeholder: slot.location,
							}),
						]
					: []),
				...(withPhotos ? briefPhotoFields() : []),
			],
		}),
	);

export default defineType({
	name: "icpPage",
	title: "ICP Page",
	type: "document",
	initialValue: () => ({ draft: true, workflowPills: WORKFLOW_PILLS, costLines: BRIEF_COST_LINES }),
	groups: [
		{ name: "hero", title: "Hero", default: true },
		{ name: "workflow", title: "Workflow" },
		{ name: "slows", title: "What Slows Discovery" },
		{ name: "beforeAfter", title: "Before & After" },
		{ name: "smarter", title: "A Smarter Way" },
		{ name: "briefs", title: "Live Brief" },
		{ name: "cost", title: "Brief Cost" },
		{ name: "faq", title: "FAQ" },
		{ name: "seo", title: "SEO" },
	],
	fields: [
		defineField({
			name: "name",
			title: "Audience",
			type: "string",
			group: "hero",
			description: 'For Studio, e.g. "Agencies". The page shows the headings below.',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "slug",
			title: "Slug",
			type: "slug",
			group: "hero",
			options: { source: "name", maxLength: 96 },
			description: "The page's address: /icp/<slug>. Changing it breaks existing links.",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "draft",
			title: "Draft",
			type: "boolean",
			group: "hero",
			initialValue: true,
			description: "While on, the page is built only for previews and kept out of search engines — never on the live site.",
		}),
		...copyFields("hero"),
		...copyFields("workflow"),
		defineField({
			name: "workflowPills",
			title: "Steps",
			type: "array",
			group: "workflow",
			of: [defineArrayMember({ type: "string" })],
			description: "The numbered steps under the app screen, in order.",
		}),
		...copyFields("slows"),
		defineField({
			name: "slows",
			title: "Cards",
			type: "object",
			group: "slows",
			options: { collapsible: false },
			fields: slotFields(SLOWS_CARDS, "Card"),
		}),
		...copyFields("beforeAfter"),
		defineField({
			name: "beforeAfter",
			title: "Rows",
			type: "object",
			group: "beforeAfter",
			options: { collapsible: false },
			fields: BEFORE_AFTER_ROWS.map((row, i) =>
				defineField({
					name: row.id,
					title: `Row ${i + 1}`,
					type: "object",
					options: { collapsible: false, columns: 2 },
					fields: [
						defineField({ name: "before", title: "Before", type: "string", placeholder: row.label }),
						defineField({ name: "after", title: "With Influenze.ai", type: "string", placeholder: row.influenze.text }),
					],
				}),
			),
		}),
		...copyFields("smarter"),
		defineField({
			name: "smarter",
			title: "Steps",
			type: "object",
			group: "smarter",
			options: { collapsible: false },
			fields: slotFields(SMARTER_STEPS, "Step"),
		}),
		...copyFields("briefs"),
		defineField({
			name: "briefs",
			title: "Briefs",
			type: "object",
			group: "briefs",
			options: { collapsible: false },
			description: "Leave a field empty to keep the default shown in it, photos included.",
			fields: slotFields(BRIEFS, "Brief", true),
		}),
		...copyFields("cost"),
		defineField({
			name: "costLines",
			title: "Lines",
			type: "array",
			group: "cost",
			of: [defineArrayMember({ type: "string" })],
		}),
		...copyFields("faq"),
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
		select: { name: "name", slug: "slug.current", draft: "draft" },
		prepare: ({ name, slug, draft }) => ({
			title: name ? `For ${name}` : "New ICP page",
			subtitle: [slug && `/icp/${slug}/`, draft && "Draft"].filter(Boolean).join(" · "),
		}),
	},
});
