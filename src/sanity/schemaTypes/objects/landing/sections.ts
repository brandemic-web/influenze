import { defineArrayMember, defineField, defineType } from "sanity";
import { iconFields } from "../iconFields";
import { LANDING_ICON_NAMES, VIGNETTES } from "../../../../data/landing";

/** The app's own icon set, or an upload. Left blank, the section picks a fitting one. */
const cardIcon = () => iconFields([...LANDING_ICON_NAMES]);

/** A small product graphic from the hero mockup, drawn beside the text. */
const vignette = () =>
	defineField({
		name: "visual",
		title: "Product graphic",
		type: "string",
		options: { list: VIGNETTES.map(({ value, title }) => ({ value, title })) },
		description: "Optional. Left blank on scenario cards and deep dives, the graphic follows the icon.",
	});

/**
 * Section building blocks shared by the six landing templates. Each template places these in
 * its playbook order as named fields, so an editor fills sections rather than arranging them.
 * Headings are optional everywhere: a blank one falls back to data/landing.ts.
 */

const heading = defineField({
	name: "heading",
	title: "Heading",
	type: "string",
	description: "Leave blank to use the template's standard heading.",
});

const intro = defineField({
	name: "intro",
	title: "Intro",
	type: "text",
	rows: 2,
	description: "Optional line under the heading.",
});

/** A link that is either a page on this site (/pricing/how-credits-work) or another site. */
const href = (title = "Link", description?: string) =>
	defineField({
		name: "href",
		title,
		type: "string",
		description: description ?? "A path on this site (/pricing/) or a full https:// URL.",
	});

/** Rich text for free-form sections: paragraphs, H3s, lists and links. No images or CTAs. */
export const landingRichText = defineType({
	name: "landingRichText",
	title: "Rich text",
	type: "array",
	of: [
		defineArrayMember({
			type: "block",
			styles: [
				{ title: "Normal", value: "normal" },
				{ title: "Heading 3", value: "h3" },
			],
			lists: [
				{ title: "Bulleted", value: "bullet" },
				{ title: "Numbered", value: "number" },
			],
			marks: {
				decorators: [
					{ title: "Bold", value: "strong" },
					{ title: "Italic", value: "em" },
				],
				annotations: [
					{
						name: "link",
						title: "Link",
						type: "object",
						fields: [
							defineField({
								name: "href",
								title: "URL",
								type: "string",
								validation: (Rule) => Rule.required(),
							}),
							defineField({ name: "newTab", title: "Open in a new tab", type: "boolean" }),
						],
					},
				],
			},
		}),
	],
});

export const landingCard = defineType({
	name: "landingCard",
	title: "Card",
	type: "object",
	fields: [
		defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
		...cardIcon(),
		vignette(),
		defineField({ name: "body", title: "Body", type: "text", rows: 3 }),
		defineField({
			name: "bullets",
			title: "Bullets",
			type: "array",
			of: [defineArrayMember({ type: "string" })],
		}),
		defineField({
			name: "linkLabel",
			title: "Link label",
			type: "string",
			description: "Shown only when Link is filled in.",
		}),
		href(),
		defineField({
			name: "image",
			title: "Screenshot",
			type: "image",
			description: "Optional. Cropped to 4:3.",
			fields: [defineField({ name: "alt", title: "Alt text", type: "string" })],
		}),
	],
	preview: { select: { title: "title", subtitle: "body", media: "image" } },
});

export const landingCardsSection = defineType({
	name: "landingCardsSection",
	title: "Cards section",
	type: "object",
	fields: [
		heading,
		intro,
		defineField({ name: "cards", title: "Cards", type: "array", of: [defineArrayMember({ type: "landingCard" })] }),
	],
});

export const landingTableRow = defineType({
	name: "landingTableRow",
	title: "Row",
	type: "object",
	fields: [
		defineField({
			name: "cells",
			title: "Cells",
			type: "array",
			of: [defineArrayMember({ type: "string" })],
			description: "One per column, left to right. The first cell is the row's label.",
		}),
		defineField({
			name: "source",
			title: "Source URL",
			type: "url",
			description: "The official page a changeable fact came from. Shown as a link beside the row.",
		}),
	],
	preview: {
		select: { cells: "cells" },
		prepare: ({ cells }) => ({ title: (cells ?? []).join(" · ") || "Empty row" }),
	},
});

export const landingTableSection = defineType({
	name: "landingTableSection",
	title: "Table section",
	type: "object",
	fields: [
		heading,
		intro,
		defineField({
			name: "columns",
			title: "Column headings",
			type: "array",
			of: [defineArrayMember({ type: "string" })],
		}),
		defineField({
			name: "rows",
			title: "Rows",
			type: "array",
			of: [defineArrayMember({ type: "landingTableRow" })],
			validation: (Rule) =>
				Rule.custom((rows, context) => {
					const columns = (context.parent as { columns?: string[] } | undefined)?.columns?.length ?? 0;
					const bad = (rows as { cells?: string[] }[] | undefined)?.some(
						(row) => (row.cells?.length ?? 0) !== columns,
					);
					return bad ? "Every row needs one cell per column heading." : true;
				}),
		}),
		defineField({ name: "note", title: "Note under the table", type: "text", rows: 2 }),
	],
});

export const landingStep = defineType({
	name: "landingStep",
	title: "Step",
	type: "object",
	fields: [
		defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
		...cardIcon(),
		defineField({ name: "body", title: "Body", type: "text", rows: 2 }),
		defineField({
			name: "image",
			title: "Screenshot",
			type: "image",
			fields: [defineField({ name: "alt", title: "Alt text", type: "string" })],
		}),
	],
	preview: { select: { title: "title", subtitle: "body", media: "image" } },
});

export const landingStepsSection = defineType({
	name: "landingStepsSection",
	title: "Steps section",
	type: "object",
	fields: [
		heading,
		intro,
		defineField({ name: "steps", title: "Steps", type: "array", of: [defineArrayMember({ type: "landingStep" })] }),
	],
});

export const landingProseSection = defineType({
	name: "landingProseSection",
	title: "Text section",
	type: "object",
	fields: [heading, defineField({ name: "body", title: "Body", type: "landingRichText" })],
});

export const landingFaqSection = defineType({
	name: "landingFaqSection",
	title: "FAQs",
	type: "object",
	fields: [
		heading,
		intro,
		defineField({
			name: "items",
			title: "Questions",
			type: "array",
			of: [defineArrayMember({ type: "blogFaq" })],
			description:
				"Answered visibly on the page and repeated in FAQ schema — the same text in both places.",
			validation: (Rule) => Rule.min(8).warning("The playbook asks for at least 8 questions."),
		}),
	],
});

/** One metric's H2 on a comparison page: what it means, both positions, who it helps. */
export const landingDeepDive = defineType({
	name: "landingDeepDive",
	title: "Metric deep dive",
	type: "object",
	fields: [
		defineField({
			name: "metric",
			title: "Question heading",
			type: "string",
			description: "Phrase it as a question an answer engine can quote, e.g. “How big is each database?”",
			validation: (Rule) => Rule.required(),
		}),
		...cardIcon(),
		vignette(),
		defineField({ name: "meaning", title: "What it means", type: "text", rows: 2 }),
		defineField({ name: "ours", title: "Influenze.ai's position", type: "text", rows: 2 }),
		defineField({ name: "theirs", title: "Competitor's position", type: "text", rows: 2 }),
		defineField({ name: "source", title: "Competitor source URL", type: "url" }),
		defineField({ name: "whoBenefits", title: "Who benefits", type: "text", rows: 2 }),
		defineField({ name: "check", title: "Check before you buy", type: "string" }),
	],
	preview: { select: { title: "metric", subtitle: "meaning" } },
});

/** Searches, profiles and contacts for one task; the page works out the credits. */
export const landingCreditScenario = defineType({
	name: "landingCreditScenario",
	title: "Credit scenario",
	type: "object",
	fields: [
		defineField({ name: "title", title: "Task or team", type: "string", validation: (Rule) => Rule.required() }),
		defineField({ name: "body", title: "Description", type: "text", rows: 2 }),
		defineField({ name: "searches", title: "Searches", type: "number", initialValue: 0, validation: (Rule) => Rule.min(0).integer() }),
		defineField({ name: "analytics", title: "Profiles analyzed", type: "number", initialValue: 0, validation: (Rule) => Rule.min(0).integer() }),
		defineField({ name: "contacts", title: "Contacts unlocked", type: "number", initialValue: 0, validation: (Rule) => Rule.min(0).integer() }),
	],
	preview: {
		select: { title: "title", s: "searches", a: "analytics", c: "contacts" },
		prepare: ({ title, s, a, c }) => ({
			title,
			subtitle: `${s ?? 0} searches · ${a ?? 0} analyzed · ${c ?? 0} contacts`,
		}),
	},
});

export const landingLink = defineType({
	name: "landingLink",
	title: "Link",
	type: "object",
	fields: [
		defineField({ name: "label", title: "Label", type: "string", validation: (Rule) => Rule.required() }),
		href("Link"),
		defineField({ name: "description", title: "Description", type: "string" }),
	],
});

/** Internal links: picked pages resolve their own address, so a renamed slug can't break them. */
export const landingRelated = defineType({
	name: "landingRelated",
	title: "Related pages",
	type: "object",
	fields: [
		heading,
		defineField({
			name: "pages",
			title: "Pages on this site",
			type: "array",
			of: [
				defineArrayMember({
					type: "reference",
					to: [
						{ type: "comparisonPage" },
						{ type: "alternativePage" },
						{ type: "icpPage" },
						{ type: "platformPage" },
						{ type: "featurePage" },
						{ type: "pricingGuide" },
						{ type: "blogPost" },
					],
				}),
			],
			description:
				"The playbook's cross-links: the matching comparison/alternative, ICP, platform, feature and pricing pages, plus guides.",
		}),
		defineField({
			name: "links",
			title: "Other links",
			type: "array",
			of: [defineArrayMember({ type: "landingLink" })],
			description: "For anything that isn't a page above, e.g. /pricing/.",
		}),
	],
});

/** The closing CTA. Blank fields fall back to the template's standard one. */
export const landingCta = defineType({
	name: "landingCta",
	title: "Closing CTA",
	type: "object",
	fields: [
		defineField({ name: "heading", title: "Heading", type: "string", description: "Leave blank for the standard wording." }),
		defineField({ name: "body", title: "Body", type: "text", rows: 2 }),
		defineField({ name: "label", title: "Button label", type: "string" }),
		href("Button link", "Leave blank to send people to the app's signup."),
	],
});

export const landingSectionTypes = [
	landingRichText,
	landingCard,
	landingCardsSection,
	landingTableRow,
	landingTableSection,
	landingStep,
	landingStepsSection,
	landingProseSection,
	landingFaqSection,
	landingDeepDive,
	landingCreditScenario,
	landingLink,
	landingRelated,
	landingCta,
];
