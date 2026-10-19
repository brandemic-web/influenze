import { defineArrayMember, defineField, defineType } from "sanity";
import { CREDIT_ROWS, PRICING_GUIDE_COPY_FIELDS, QUOTE_ROWS, QUOTE_THEIRS } from "../../../data/pricing-guide/shared";
import { copyField } from "../../lib/copyField";

/**
 * One /pricing/<slug> guide — credits explained end to end. Defaults live in
 * src/data/pricing-guide/shared.ts; empty fields keep them. The plans panel is the
 * pricing page's own and is edited in "Pricing Page", so prices stay in one place.
 */
const copyFields = (group: string) =>
	PRICING_GUIDE_COPY_FIELDS.filter((f) => f.group === group).map((f) => copyField(f, group));

export default defineType({
	name: "pricingGuidePage",
	title: "Pricing Guide Page",
	type: "document",
	initialValue: () => ({
		draft: true,
		creditRows: CREDIT_ROWS.map((row) => ({ _type: "creditRow", ...row })),
	}),
	groups: [
		{ name: "hero", title: "Hero & Credits", default: true },
		{ name: "estimator", title: "Estimator" },
		{ name: "plans", title: "Plans" },
		{ name: "oneTime", title: "One-Time Campaign" },
		{ name: "quote", title: "Credits vs Quote-Led" },
		{ name: "faq", title: "FAQ" },
		{ name: "seo", title: "SEO" },
	],
	fields: [
		defineField({
			name: "name",
			title: "Page name",
			type: "string",
			group: "hero",
			description: "For Studio only. The page shows the headings below.",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "slug",
			title: "Slug",
			type: "slug",
			group: "hero",
			options: { source: "name", maxLength: 96 },
			description: "The page's address: /pricing/<slug>. Changing it breaks existing links.",
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
		defineField({
			name: "creditRows",
			title: "How credits work — rows",
			type: "array",
			group: "hero",
			description: "Drag to reorder.",
			of: [
				defineArrayMember({
					name: "creditRow",
					type: "object",
					fields: [
						defineField({ name: "label", title: "Action", type: "string", validation: (Rule) => Rule.required() }),
						defineField({ name: "detail", title: "Detail (after the dot)", type: "string" }),
						defineField({ name: "cost", title: "Cost", type: "string", validation: (Rule) => Rule.required() }),
					],
					preview: { select: { title: "label", subtitle: "cost" } },
				}),
			],
		}),
		...copyFields("estimator"),
		...copyFields("plans"),
		...copyFields("oneTime"),
		...copyFields("quote"),
		defineField({
			name: "quote",
			title: "Rows",
			type: "object",
			group: "quote",
			options: { collapsible: false },
			description: "Leave a field empty to keep the default shown in it.",
			fields: QUOTE_ROWS.map((row, i) =>
				defineField({
					name: row.id,
					title: `Row ${i + 1} — ${row.label}`,
					type: "object",
					options: { collapsible: false },
					fields: [
						defineField({ name: "label", title: "Factor", type: "string", placeholder: row.label }),
						defineField({ name: "ours", title: "Influenze.ai", type: "string", placeholder: row.influenze.text }),
						defineField({ name: "theirs", title: "Quote-led / annual", type: "string", placeholder: QUOTE_THEIRS[row.id] }),
					],
				}),
			),
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
			title: name || "New pricing guide",
			subtitle: [slug && `/pricing/${slug}/`, draft && "Draft"].filter(Boolean).join(" · "),
		}),
	},
});
