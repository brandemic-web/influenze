import { defineArrayMember, defineField, defineType } from "sanity";
import {
	BUBBLE_LABELS,
	BUBBLE_NAMES,
	BUBBLES_PER_PAGE,
	FEATURE_COPY_FIELDS,
	FRESHNESS_CARDS,
	HOW_STEPS,
	NUMBERS_CARDS,
	WHO_FOR_CARDS,
} from "../../../data/feature/shared";
import { copyField } from "../../lib/copyField";
import { BubblePicker } from "../../lib/BubblePicker";

/**
 * One /features/<slug> page — a single feature told end to end, e.g. AI creator
 * search. Defaults for every text live in src/data/feature/shared.ts; empty fields keep
 * them. Tabs follow the page top to bottom, each section's headings first. The overview
 * at /features is the separate "Features Page" singleton.
 */

const copyFields = (group: string) =>
	FEATURE_COPY_FIELDS.filter((f) => f.group === group).map((f) => copyField(f, group));

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

export default defineType({
	name: "featureLandingPage",
	title: "Feature Landing Page",
	type: "document",
	initialValue: () => ({
		draft: true,
		whoForCards: WHO_FOR_CARDS.map((card) => ({ _type: "textCard", ...card })),
	}),
	groups: [
		{ name: "hero", title: "Hero", default: true },
		{ name: "manual", title: "The Manual Way" },
		{ name: "how", title: "How It Works" },
		{ name: "numbers", title: "What The Numbers Mean" },
		{ name: "freshness", title: "Fresh & Accurate" },
		{ name: "fastest", title: "Fastest Way" },
		{ name: "whoFor", title: "Who Is It For" },
		{ name: "faq", title: "FAQ" },
		{ name: "seo", title: "SEO" },
	],
	fields: [
		defineField({
			name: "name",
			title: "Page name",
			type: "string",
			group: "hero",
			description: 'For Studio only, e.g. "AI Creator Search". The page shows the headings below.',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "slug",
			title: "Slug",
			type: "slug",
			group: "hero",
			options: { source: "name", maxLength: 96 },
			description: "The page's address: /features/<slug>. Changing it breaks existing links.",
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
			name: "heroBubbles",
			title: "Hero creator bubbles",
			type: "array",
			group: "hero",
			of: [defineArrayMember({ type: "string" })],
			description: `Tick the ${BUBBLES_PER_PAGE} creator photos to show under the hero. They fill the ${BUBBLES_PER_PAGE} spots in number order, whatever order you tick them in. Leave empty for the default 1–${BUBBLES_PER_PAGE}. A photo with no image file yet is skipped.`,
			options: { list: BUBBLE_NAMES.map((name) => ({ title: BUBBLE_LABELS[name], value: name })) },
			components: { input: BubblePicker },
			validation: (Rule) => [
				Rule.unique(),
				Rule.custom((picked) =>
					!picked || (Array.isArray(picked) && picked.length === BUBBLES_PER_PAGE)
						? true
						: `Pick exactly ${BUBBLES_PER_PAGE} — the page fills any gap from the defaults.`,
				).warning(),
			],
		}),
		...copyFields("manual"),
		defineField({
			name: "manualImages",
			title: "Side images",
			description:
				"The two images either side of the text box. Upload a replacement per side — a square PNG or WebP with a transparent background works best, since it is shown whole, not cropped. An empty side keeps the default image.",
			type: "object",
			group: "manual",
			fields: [
				defineField({ name: "left", title: "Left image (default: spreadsheet)", type: "image" }),
				defineField({ name: "right", title: "Right image (default: hashtag)", type: "image" }),
			],
		}),
		...copyFields("how"),
		defineField({
			name: "howSteps",
			title: "Steps",
			type: "object",
			group: "how",
			options: { collapsible: false },
			description: "Leave a field empty to keep the default shown in it. The icons stay as designed.",
			fields: slotFields(HOW_STEPS, "Step"),
		}),
		...copyFields("numbers"),
		defineField({
			name: "numbers",
			title: "Cards",
			type: "object",
			group: "numbers",
			options: { collapsible: false },
			description: "Leave a field empty to keep the default shown in it. The icons stay as designed.",
			fields: slotFields(NUMBERS_CARDS, "Card"),
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
		...copyFields("fastest"),
		defineField({
			name: "resultImage",
			title: "Image under the heading",
			description:
				"Replaces the three creator rows shown under the heading. Shown whole, at the rows' width (about 880px wide, upload at 2× for sharpness). Leave empty to keep the default creator rows.",
			type: "image",
			group: "fastest",
			fields: [defineField({ name: "alt", title: "Alt text", type: "string", description: "Describe the image for screen readers and search engines." })],
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
			title: name || "New feature landing page",
			subtitle: [slug && `/features/${slug}/`, draft && "Draft"].filter(Boolean).join(" · "),
		}),
	},
});
