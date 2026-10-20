import { defineArrayMember, defineField, defineType } from "sanity";
import {
	BRIEFS,
	FRESHNESS_CARDS,
	HOW_STEPS,
	ICON_TILES,
	MATTERS_POINTS,
	MATTERS_STATS,
	PLATFORM_COPY_FIELDS,
	PLATFORM_KEYS,
	SEARCH_BY_CARDS,
	WHO_FOR_CARDS,
} from "../../../data/platform/shared";
import { copyField } from "../../lib/copyField";

/**
 * One /platforms/<slug> page — creator search on one social platform. Defaults for
 * every text live in src/data/platform/shared.ts; empty fields keep them. Tabs follow
 * the page top to bottom, each section's headings first. A new document opens from a
 * template with the card lists pre-filled.
 */

const copyFields = (group: string) =>
	PLATFORM_COPY_FIELDS.filter((f) => f.group === group).map((f) => copyField(f, group));

/** A fixed set of slots — the page always draws these; blank fields keep the default. */
const slotFields = (slots: readonly { id: string; title: string; body: string; location?: string }[], label: string) =>
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
			],
		}),
	);

const ICON_OPTIONS = ICON_TILES.map((value) => ({ title: value.replace(/([A-Z])/g, " $1").toLowerCase(), value }));

const template = () => ({
	draft: true,
	platform: "instagram",
	searchByCards: SEARCH_BY_CARDS.map((card) => ({ _type: "iconCard", ...card })),
	whoForCards: WHO_FOR_CARDS.map((card) => ({ _type: "textCard", ...card })),
});

export default defineType({
	name: "platformPage",
	title: "Platform Page",
	type: "document",
	initialValue: template,
	groups: [
		{ name: "hero", title: "Hero", default: true },
		{ name: "searchBy", title: "What You Can Search By" },
		{ name: "creatorsAi", title: "Found With AI" },
		{ name: "whoFor", title: "Who Is It For" },
		{ name: "briefs", title: "Example Briefs" },
		{ name: "matters", title: "What Matters" },
		{ name: "freshness", title: "Fresh & Accurate" },
		{ name: "faq", title: "FAQ" },
		{ name: "seo", title: "SEO" },
	],
	fields: [
		defineField({
			name: "platformName",
			title: "Platform name",
			type: "string",
			group: "hero",
			description: 'e.g. "Instagram". Fills {name} in the text, so headings read "Find Instagram Creators…".',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "slug",
			title: "Slug",
			type: "slug",
			group: "hero",
			options: { source: "platformName", maxLength: 96 },
			description: "The page's address: /platforms/<slug>. Changing it breaks existing links.",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "platform",
			title: "Platform shown selected in the mockups",
			type: "string",
			group: "hero",
			options: { list: PLATFORM_KEYS.map((value) => ({ title: value, value })), layout: "radio", direction: "horizontal" },
			initialValue: "instagram",
		}),
		defineField({
			name: "draft",
			title: "Draft",
			type: "boolean",
			group: "hero",
			initialValue: true,
			description:
				"While on, the page is built only for previews and kept out of search engines — never on the live site.",
		}),
		...copyFields("hero"),

		...copyFields("searchBy"),
		defineField({
			name: "searchByCards",
			title: "Cards",
			type: "array",
			group: "searchBy",
			description: "Drag to reorder.",
			of: [
				defineArrayMember({
					name: "iconCard",
					type: "object",
					fields: [
						defineField({
							name: "icon",
							title: "Icon",
							type: "string",
							options: { list: ICON_OPTIONS },
							validation: (Rule) => Rule.required(),
						}),
						defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
						defineField({ name: "body", title: "Text", type: "text", rows: 2 }),
					],
					preview: { select: { title: "title", subtitle: "body" } },
				}),
			],
		}),

		...copyFields("creatorsAi"),
		defineField({
			name: "howSteps",
			title: "Steps",
			type: "object",
			group: "creatorsAi",
			options: { collapsible: false },
			description: "Leave a field empty to keep the default shown in it. The icons stay as designed.",
			fields: slotFields(HOW_STEPS, "Step"),
		}),

		...copyFields("whoFor"),
		defineField({
			name: "whoForCards",
			title: "Cards",
			type: "array",
			group: "whoFor",
			description: "Drag to reorder. The row opens centred on the middle card.",
			of: [
				defineArrayMember({
					name: "textCard",
					type: "object",
					fields: [
						defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
						defineField({ name: "body", title: "Text", type: "text", rows: 3 }),
					],
					preview: { select: { title: "title", subtitle: "body" } },
				}),
			],
		}),

		...copyFields("briefs"),
		defineField({
			name: "briefs",
			title: "Briefs",
			type: "object",
			group: "briefs",
			options: { collapsible: false },
			description: "Leave a field empty to keep the default shown in it. The photos stay as designed.",
			fields: slotFields(BRIEFS, "Brief"),
		}),

		...copyFields("matters"),
		defineField({
			name: "mattersPoints",
			title: "Points",
			type: "object",
			group: "matters",
			options: { collapsible: false },
			fields: slotFields(MATTERS_POINTS, "Point"),
		}),
		defineField({
			name: "mattersStats",
			title: "Mockup — stat tiles",
			type: "object",
			group: "matters",
			options: { collapsible: false },
			fields: MATTERS_STATS.map((stat, i) =>
				defineField({
					name: stat.id,
					title: `Tile ${i + 1} — ${stat.label}`,
					type: "object",
					options: { collapsible: false, columns: 3 },
					fields: [
						defineField({ name: "label", title: "Label", type: "string", placeholder: stat.label }),
						defineField({ name: "value", title: "Value", type: "string", placeholder: stat.value }),
						defineField({ name: "note", title: "Note", type: "string", placeholder: stat.note }),
					],
				}),
			),
		}),

		...copyFields("freshness"),
		defineField({
			name: "freshness",
			title: "Cards",
			type: "object",
			group: "freshness",
			options: { collapsible: false },
			description: "Leave a field empty to keep the default shown in it. The icons stay as designed.",
			fields: slotFields(FRESHNESS_CARDS, "Card"),
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
		select: { name: "platformName", slug: "slug.current", draft: "draft" },
		prepare: ({ name, slug, draft }) => ({
			title: name ? `${name} creator search` : "New platform page",
			subtitle: [slug && `/platforms/${slug}/`, draft && "Draft"].filter(Boolean).join(" · "),
		}),
	},
});
