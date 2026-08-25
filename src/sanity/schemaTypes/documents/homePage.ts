import { defineField, defineType } from "sanity";
import { iconFields } from "../objects/iconFields";

/**
 * Singleton — content for / (the homepage). Mirrors the editorial content
 * currently spread across src/data/{heroWords,whyInfluenze,useCases,
 * useCasesSplit,comparison,testimonials,faqs,creatorsAI}.ts. Excludes
 * workflowMockup/workflowIcons/mediaKitCharts/creatorPortraits — those drive
 * the animated product-demo mockup and are engineering config, not copy.
 */
export default defineType({
	name: "homePage",
	title: "Home Page",
	type: "document",
	groups: [
		{ name: "hero", title: "Hero" },
		{ name: "creatorCollage", title: "Creator Collage" },
		{ name: "whyInfluenze", title: "Why Influenze" },
		{ name: "trustedBy", title: "Trusted By" },
		{ name: "creatorsAI", title: "Creators AI" },
		{ name: "useCases", title: "Use Cases" },
		{ name: "comparison", title: "Comparison Table" },
		{ name: "testimonials", title: "Testimonials" },
		{ name: "faqs", title: "FAQs" },
	],
	fields: [
		defineField({ name: "seo", title: "SEO", type: "seo" }),

		defineField({
			name: "hero",
			title: "Hero",
			type: "object",
			group: "hero",
			fields: [
				defineField({
					name: "heading",
					title: 'Heading lead-in ("___ [cycling word]")',
					type: "string",
					initialValue: "Find The Right",
				}),
				defineField({
					name: "words",
					title: 'Cycling words ("Find The Right ___")',
					type: "array",
					of: [{ type: "string" }],
					description: "The first word is what renders with no JS, so keep the signed-off opening word first.",
				}),
				defineField({
					name: "subcopy",
					title: "Subcopy line",
					type: "object",
					description: 'The highlighted phrase renders in brand green — e.g. lead "Get access to the world\'s largest database of ", highlight "450M+ profiles", trail " across Instagram, Youtube, TikTok & LinkedIn".',
					fields: [
						defineField({ name: "lead", title: "Text before the highlight", type: "string" }),
						defineField({ name: "highlight", title: "Highlighted phrase", type: "string" }),
						defineField({ name: "trail", title: "Text after the highlight", type: "string" }),
					],
				}),
				defineField({
					name: "cta",
					title: "Free Trial button",
					type: "object",
					fields: [
						defineField({ name: "label", title: "Button label", type: "string", initialValue: "Free Trial" }),
						defineField({ name: "href", title: "Button link", type: "url", initialValue: "https://influenze.ai/login" }),
						defineField({
							name: "newTab",
							title: "Open in a new tab",
							type: "boolean",
							initialValue: true,
						}),
					],
				}),
			],
		}),

		defineField({
			name: "creatorCollage",
			title: "Creator Collage",
			description: "The orbiting creator-photo collage directly under the hero.",
			type: "object",
			group: "creatorCollage",
			fields: [
				defineField({
					name: "heading",
					title: "Heading",
					type: "object",
					fields: [
						defineField({ name: "lead", title: "Lead text", type: "string" }),
						defineField({ name: "accent", title: "Accent text (brand green)", type: "string" }),
					],
				}),
				defineField({
					name: "bubbles",
					title: "Creator photos",
					description: "Each slot is a fixed, hand-positioned spot in the collage — upload a replacement photo per slot; slots can't be added or removed here.",
					type: "object",
					fields: (["a", "b", "c", "d", "e", "f", "g"] as const).map((letter) =>
						defineField({
							name: `bubble${letter.toUpperCase()}`,
							title: `Bubble ${letter.toUpperCase()}`,
							type: "image",
							options: { hotspot: true },
						}),
					),
				}),
				defineField({
					name: "statTags",
					title: "Stat pills",
					description: 'The three "Engagement Rate · 2.5%"-style pills beside the creator photos.',
					type: "array",
					validation: (Rule) => Rule.max(3),
					of: [
						{
							type: "object",
							name: "statTag",
							fields: [
								defineField({ name: "label", title: "Label", type: "string" }),
								defineField({ name: "value", title: "Value", type: "string" }),
							],
							preview: { select: { title: "label", subtitle: "value" } },
						},
					],
				}),
			],
		}),

		defineField({
			name: "whyInfluenze",
			title: "Why Influenze",
			type: "object",
			group: "whyInfluenze",
			fields: [
				defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
				defineField({
					name: "heading",
					title: "Heading",
					type: "object",
					description: 'Renders as one line — the accent half in brand green, e.g. lead "We are the first step for", accent "every influencer Campaign".',
					fields: [
						defineField({ name: "lead", title: "Lead text (white)", type: "string" }),
						defineField({ name: "accent", title: "Accent text (brand green)", type: "string" }),
					],
				}),
				defineField({
					name: "button",
					title: "Button",
					type: "object",
					fields: [
						defineField({ name: "label", title: "Button label", type: "string" }),
						defineField({
							name: "href",
							title: "Button link",
							type: "string",
							description: "A path on this site (/features) or a full URL (https://…).",
						}),
						defineField({ name: "newTab", title: "Open in a new tab", type: "boolean", initialValue: false }),
					],
				}),
				defineField({
					name: "steps",
					title: "Steps",
					type: "array",
					of: [
						{
							type: "object",
							name: "step",
							fields: [
								...iconFields(["search", "eye", "rocket"]),
								defineField({ name: "title", title: "Title", type: "string" }),
								defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
							],
							preview: {
								select: { title: "title", subtitle: "icon", media: "iconImage" },
							},
						},
					],
				}),
			],
		}),

		defineField({
			name: "trustedBy",
			title: "Trusted By",
			description: "The greyed-out client logo row under Why Influenze.",
			type: "object",
			group: "trustedBy",
			fields: [
				defineField({ name: "heading", title: "Heading", type: "string" }),
				defineField({
					name: "logos",
					title: "Logos",
					description: "Row order. Every logo shares one box unless it's given its own size below.",
					type: "array",
					of: [
						{
							type: "object",
							name: "trustedByLogo",
							fields: [
								defineField({
									name: "image",
									title: "Logo",
									type: "image",
									validation: (Rule) => Rule.required(),
								}),
								defineField({
									name: "alt",
									title: "Company name",
									type: "string",
									description: "Read out by screen readers in place of the logo.",
									validation: (Rule) => Rule.required(),
								}),
								defineField({
									name: "desktop",
									title: "Size on desktop",
									type: "trustedByBox",
									description: "In px, from the design. Leave blank for the shared 256×68 box. These scale with the window above 1024px.",
								}),
								defineField({
									name: "mobile",
									title: "Size on mobile",
									type: "trustedByBox",
									description: "In px. Leave blank for the shared 100×32 box.",
								}),
								defineField({
									name: "padding",
									title: "Padding",
									type: "trustedBySpacing",
									description: "In px, inside the box — shrinks the logo without moving its neighbours. Desktop only; the mobile ticker keeps every logo in one uniform box.",
								}),
								defineField({
									name: "margin",
									title: "Margin",
									type: "trustedBySpacing",
									description: "In px, outside the box — nudges the logo and its neighbours along the row. Desktop only, as with padding.",
								}),
							],
							preview: { select: { title: "alt", media: "image" } },
						},
					],
				}),
			],
		}),

		defineField({
			name: "creatorsAI",
			title: "Creators AI section",
			type: "object",
			group: "creatorsAI",
			fields: [
				defineField({
					name: "heading",
					title: "Heading",
					type: "object",
					description: 'Two lines — the accent line renders in brand green, e.g. lead "The world\'s creators," accent "found with AI".',
					fields: [
						defineField({ name: "lead", title: "First line (white)", type: "string" }),
						defineField({ name: "accent", title: "Second line (brand green)", type: "string" }),
					],
				}),
				defineField({
					name: "button",
					title: "Button",
					type: "object",
					fields: [
						defineField({ name: "label", title: "Button label", type: "string" }),
						defineField({
							name: "href",
							title: "Button link",
							type: "string",
							description: "A path on this site (/features) or a full URL (https://…).",
						}),
						defineField({ name: "newTab", title: "Open in a new tab", type: "boolean", initialValue: false }),
					],
				}),
				defineField({
					name: "features",
					title: "Feature cards",
					description: "Exactly four, in this order — each one drives a hand-built product visual beside it, so a shorter or reordered list falls back to the built-in copy.",
					type: "array",
					validation: (Rule) => Rule.length(4),
					of: [
						{
							type: "object",
							name: "feature",
							fields: [
								...iconFields(["search", "users", "square-check", "scaling"]),
								defineField({ name: "title", title: "Heading", type: "string" }),
								defineField({ name: "description", title: "Paragraph", type: "text", rows: 3 }),
							],
							preview: { select: { title: "title", subtitle: "icon", media: "iconImage" } },
						},
					],
				}),
			],
		}),

		defineField({
			name: "useCases",
			title: 'Who is it for?',
			type: "object",
			group: "useCases",
			fields: [
				defineField({ name: "heading", title: "Heading", type: "string" }),
				defineField({
					name: "cards",
					title: "Cards",
					description: "Row order. The marquee loops however many there are.",
					type: "array",
					of: [
						{
							type: "object",
							name: "useCase",
							fields: [
								defineField({ name: "title", title: "Title", type: "string" }),
								defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
							],
							preview: { select: { title: "title", subtitle: "description" } },
						},
					],
				}),
			],
		}),

		defineField({
			name: "comparison",
			title: "Comparison table",
			type: "object",
			group: "comparison",
			fields: [
				defineField({
					name: "heading",
					title: "Heading",
					type: "object",
					fields: [
						defineField({ name: "lead", title: "Lead text", type: "string" }),
						defineField({ name: "accent", title: "Accent text", type: "string" }),
					],
				}),
				defineField({
					name: "competitors",
					title: "Competitor names",
					type: "array",
					of: [{ type: "string" }],
					description: "Column order — each row's \"others\" array must list cells in this same order.",
				}),
				defineField({
					name: "rows",
					title: "Rows",
					type: "array",
					of: [
						{
							type: "object",
							name: "comparisonRow",
							fields: [
								defineField({ name: "label", title: "Row label", type: "string" }),
								defineField({ name: "influenze", title: "Influenze cell", type: "comparisonCell" }),
								defineField({
									name: "others",
									title: "Competitor cells (same order as Competitor names)",
									type: "array",
									of: [{ type: "comparisonCell" }],
								}),
							],
							preview: { select: { title: "label" } },
						},
					],
				}),
			],
		}),

		defineField({
			name: "testimonials",
			title: "Testimonials",
			type: "object",
			group: "testimonials",
			fields: [
				defineField({ name: "heading", title: "Heading", type: "string" }),
				defineField({ name: "band", title: "Band text", type: "string" }),
				defineField({
					name: "items",
					title: "Quotes",
					type: "array",
					of: [
						{
							type: "object",
							name: "testimonial",
							fields: [
								defineField({ name: "name", title: "Name", type: "string" }),
								defineField({ name: "company", title: "Company", type: "string" }),
								defineField({ name: "quote", title: "Quote", type: "text", rows: 3 }),
							],
							preview: { select: { title: "name", subtitle: "company" } },
						},
					],
				}),
			],
		}),

		defineField({
			name: "faqs",
			title: "FAQs",
			type: "object",
			group: "faqs",
			fields: [
				defineField({ name: "heading", title: "Heading", type: "string" }),
				defineField({ name: "subcopy", title: "Subcopy", type: "string" }),
				defineField({
					name: "items",
					title: "Questions",
					type: "array",
					of: [
						{
							type: "object",
							name: "faq",
							fields: [
								defineField({ name: "question", title: "Question", type: "string" }),
								defineField({ name: "answer", title: "Answer", type: "text", rows: 4 }),
							],
							preview: { select: { title: "question" } },
						},
					],
				}),
			],
		}),
	],
	preview: {
		prepare: () => ({ title: "Home Page" }),
	},
});
