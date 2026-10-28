import { defineArrayMember, defineField, defineType } from "sanity";
import {
	ALT_COPY_FIELDS,
	FEATURE_ROWS,
	FIT_ROWS,
	NETWORK_STEPS,
	USE_CASES,
	WHY_CARDS,
	type CompareRow,
} from "../../../data/alternative/shared";
import { copyField } from "../../lib/copyField";
import { influenzeColumnField } from "../../lib/influenzeColumn";

/**
 * One /alternatives/<slug> page: "an alternative to <competitor>". Influenze's half
 * (our table cells, defaults for every heading and card) lives in
 * src/data/alternative/shared.ts; this document holds the competitor's half and any
 * overrides. Tabs follow the page top to bottom, each section's headings first.
 * A new document opens from a template: every table row present, dashes set where
 * the design has them, the "why" cards pre-filled.
 */

/** "Fill this in", raised as a warning rather than an error so drafts still save and publish. */
const isFilled = (label: string) => (value: unknown) => {
	const text = typeof value === "object" && value !== null ? (value as { text?: string }).text : value;
	return typeof text === "string" && text.trim() ? true : `${label} is empty — the page shows a placeholder.`;
};

const cellFields = (rows: readonly CompareRow[]) =>
	rows.map((row) =>
		defineField({
			name: row.id,
			title: row.label,
			type: "compareCell",
			validation: (Rule) => Rule.custom(isFilled(row.label)).warning(),
		}),
	);

const blankCell = (row: CompareRow) => ({ _type: "compareCell", text: "", mark: Boolean(row.influenze.mark) });

/** Headings for one tab, in the order the copy list gives them. */
const copyFields = (group: string) => ALT_COPY_FIELDS.filter((f) => f.group === group).map((f) => copyField(f, group));

/** A fixed set of cards — the page always draws these slots; blank fields keep the default. */
const slotFields = (slots: readonly { id: string; title: string; body: string }[], label: string) =>
	slots.map((slot, i) =>
		defineField({
			name: slot.id,
			title: `${label} ${i + 1} — ${slot.title}`,
			type: "object",
			options: { collapsible: false },
			fields: [
				defineField({ name: "title", title: "Title", type: "string", placeholder: slot.title }),
				defineField({ name: "body", title: "Text", type: "text", rows: 2, placeholder: slot.body }),
			],
		}),
	);

const template = () => ({
	draft: true,
	whyCards: WHY_CARDS.map((card) => ({ _type: "whyCard", title: card.title, body: card.body })),
	fit: Object.fromEntries(FIT_ROWS.map((row) => [row.id, blankCell(row)])),
	features: Object.fromEntries(FEATURE_ROWS.map((row) => [row.id, blankCell(row)])),
});

export default defineType({
	name: "alternativePage",
	title: "Alternative Page",
	type: "document",
	initialValue: template,
	groups: [
		{ name: "hero", title: "Hero", default: true },
		{ name: "why", title: "Why Cards" },
		{ name: "fit", title: "Find The Right Fit" },
		{ name: "features", title: "Feature Table" },
		{ name: "network", title: "Keep Your Network" },
		{ name: "useCases", title: "Use Cases" },
		{ name: "faq", title: "FAQ" },
		{ name: "seo", title: "SEO" },
	],
	fields: [
		defineField({
			name: "competitorName",
			title: "Competitor name",
			type: "string",
			group: "hero",
			description: 'Just the competitor, e.g. "Qoruz". Used in the table headers, and wherever {name} appears.',
			validation: (Rule) =>
				Rule.required().custom((value) =>
					typeof value === "string" && /influenze|\bvs\b|alternative/i.test(value)
						? "Enter only the competitor's name."
						: true,
				),
		}),
		defineField({
			name: "competitorLogo",
			title: "Competitor logo (optional)",
			type: "image",
			group: "hero",
			description:
				'Shown in place of the name in the "How Influenze Compares" table header. Leave empty and the competitor name is shown instead.',
		}),
		defineField({
			name: "slug",
			title: "Slug",
			type: "slug",
			group: "hero",
			options: { source: "competitorName", maxLength: 96 },
			description: "The page's address: /alternatives/<slug>. Changing it breaks existing links.",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "draft",
			title: "Draft",
			type: "boolean",
			group: "hero",
			initialValue: true,
			description:
				"While on, the page is built only for previews and kept out of search engines — never on the live site. Turn off once every competitor fact is verified.",
		}),
		...copyFields("hero"),

		...copyFields("why"),
		defineField({
			name: "whyCards",
			title: "Cards",
			type: "array",
			group: "why",
			description: "Drag to reorder. A line break in the text is a line break on the page.",
			of: [
				defineArrayMember({
					name: "whyCard",
					type: "object",
					fields: [
						defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
						defineField({ name: "body", title: "Text", type: "text", rows: 2 }),
					],
					preview: { select: { title: "title", subtitle: "body" } },
				}),
			],
		}),

		...copyFields("fit"),
		defineField({
			name: "fit",
			title: "Their column",
			type: "object",
			group: "fit",
			options: { collapsible: false },
			fields: cellFields(FIT_ROWS),
		}),
		influenzeColumnField("influenzeFit", "Influenze.ai column", "fit", FIT_ROWS),

		...copyFields("features"),
		defineField({
			name: "features",
			title: "Their column",
			type: "object",
			group: "features",
			options: { collapsible: false },
			fields: cellFields(FEATURE_ROWS),
		}),
		influenzeColumnField("influenzeFeatures", "Influenze.ai column", "features", FEATURE_ROWS),

		...copyFields("network"),
		defineField({
			name: "steps",
			title: "Steps",
			type: "object",
			group: "network",
			options: { collapsible: false },
			description: "Leave a field empty to keep the default shown in it. The icons and product mockup stay as designed.",
			fields: slotFields(NETWORK_STEPS, "Step"),
		}),

		...copyFields("useCases"),
		defineField({
			name: "useCases",
			title: "Cards",
			type: "object",
			group: "useCases",
			options: { collapsible: false },
			description: "Leave a field empty to keep the default shown in it.",
			fields: slotFields(USE_CASES, "Card"),
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
		select: { name: "competitorName", slug: "slug.current", draft: "draft" },
		prepare: ({ name, slug, draft }) => ({
			title: name ? `${name} alternative` : "New alternative page",
			subtitle: [slug && `/alternatives/${slug}/`, draft && "Draft"].filter(Boolean).join(" · "),
		}),
	},
});
