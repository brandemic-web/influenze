import { defineArrayMember, defineField } from "sanity";
import { LANDING_ROUTES, type LandingType } from "../../../../data/landing";

/**
 * Fields every landing template shares, in the order the page renders them: the hero first,
 * related links, FAQs and the closing CTA last. Each template slots its own sections between.
 */

export const LANDING_GROUPS = [
	{ name: "hero", title: "Hero", default: true },
	{ name: "sections", title: "Sections" },
	{ name: "faq", title: "FAQs & CTA" },
	{ name: "seo", title: "SEO" },
];

export function heroFields(type: LandingType, h1Hint: string) {
	const { prefix } = LANDING_ROUTES[type];
	return [
		defineField({
			name: "title",
			title: "H1",
			type: "string",
			group: "hero",
			description: `The page's headline. Template: ${h1Hint}`,
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "slug",
			title: "Slug",
			type: "slug",
			group: "hero",
			options: { source: "title", maxLength: 96 },
			description: `The page's address: ${prefix}/<slug>. Changing it breaks existing links.`,
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "eyebrow",
			title: "Eyebrow",
			type: "string",
			group: "hero",
			description: "Small label above the H1. Leave blank to use the breadcrumb section name.",
		}),
		defineField({
			name: "answer",
			title: "Direct answer",
			type: "text",
			rows: 3,
			group: "hero",
			description:
				"40–60 words that answer the page's question outright. Answer engines quote this; it is also the meta description unless SEO → Meta description is set.",
			validation: (Rule) => [
				Rule.required(),
				Rule.custom((value?: string) => {
					const words = value?.trim().split(/\s+/).length ?? 0;
					return words && words > 60 ? `Keep it under 60 words (now ${words}).` : true;
				}).warning(),
			],
		}),
		defineField({
			name: "reviewedAt",
			title: "Reviewed on",
			type: "date",
			group: "hero",
			options: { dateFormat: "D MMMM YYYY" },
			description: "Shown as “Reviewed on …” and used as the page's last-modified date.",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "ctaLabel",
			title: "Hero button label",
			type: "string",
			group: "hero",
			description: "Leave blank for “Start with 500 credits”.",
		}),
		defineField({
			name: "proofChips",
			title: "Proof chips",
			type: "array",
			group: "hero",
			of: [defineArrayMember({ type: "string" })],
			description:
				"Leave empty for the approved set (450M+ profiles · Instagram, YouTube & TikTok · self-serve credits). Never 460M+, never “real-time”, never “verified contacts”.",
		}),
	];
}

export function closingFields() {
	return [
		defineField({ name: "related", title: "Related pages", type: "landingRelated", group: "faq" }),
		defineField({ name: "faq", title: "FAQs", type: "landingFaqSection", group: "faq" }),
		defineField({ name: "cta", title: "Closing CTA", type: "landingCta", group: "faq" }),
		defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
		defineField({
			name: "scripts",
			title: "Page scripts",
			type: "customScripts",
			group: "seo",
			description: "Injected after the site-wide global scripts, only on this page.",
		}),
	];
}

/** A section field in the "Sections" tab. */
export function section(name: string, title: string, type: string, description?: string) {
	return defineField({ name, title, type, group: "sections", description });
}

export function landingPreview(subtitleField = "slug.current") {
	return {
		select: { title: "title", subtitle: subtitleField, date: "reviewedAt" },
		prepare: ({ title, subtitle, date }: { title?: string; subtitle?: string; date?: string }) => ({
			title,
			subtitle: [subtitle, date && `reviewed ${date}`].filter(Boolean).join(" · "),
		}),
	};
}
