import { defineField, defineType } from "sanity";

/**
 * Singleton — content for /pricing. Mirrors src/data/pricing.ts: the heading,
 * the four tiers driving the slider, the "included in every plan" checklist,
 * and the per-credit-action cost table. The slider's own math (stop
 * positions, step size) stays in code — this only covers editorial content
 * and the numbers a non-engineer should be able to update.
 */
export default defineType({
	name: "pricingPage",
	title: "Pricing Page",
	type: "document",
	fields: [
		defineField({ name: "seo", title: "SEO", type: "seo" }),
		defineField({
			name: "heading",
			title: "Heading",
			type: "object",
			fields: [
				defineField({ name: "lead", title: "Lead text", type: "string" }),
				defineField({ name: "accent", title: "Accent text", type: "string" }),
				defineField({ name: "sub", title: "Subheading", type: "string" }),
			],
		}),
		defineField({
			name: "sliderRange",
			title: "Slider range (₹)",
			type: "object",
			fields: [
				defineField({ name: "min", title: "Minimum monthly spend", type: "number" }),
				defineField({ name: "max", title: "Maximum monthly spend", type: "number" }),
			],
		}),
		defineField({
			name: "tiers",
			title: "Pricing tiers",
			type: "array",
			validation: (Rule) => Rule.min(2),
			of: [
				{
					type: "object",
					name: "tier",
					fields: [
						defineField({ name: "id", title: "ID (stable, lowercase)", type: "string" }),
						defineField({ name: "name", title: "Name", type: "string" }),
						defineField({
							name: "minSpend",
							title: "Entry monthly spend (₹)",
							type: "number",
							description: "Inclusive lower bound of this tier's spend range.",
						}),
						defineField({
							name: "bonusPct",
							title: "Bonus credits (%)",
							type: "number",
							initialValue: 0,
						}),
						defineField({
							name: "custom",
							title: "Custom / quote-only plan",
							type: "boolean",
							description: 'When on, this tier has no self-serve price and shows the "talk to us" panel instead (e.g. Enterprise).',
							initialValue: false,
						}),
					],
					preview: {
						select: { title: "name", subtitle: "minSpend" },
						prepare: ({ title, subtitle }) => ({
							title,
							subtitle: subtitle ? `₹${subtitle}+` : undefined,
						}),
					},
				},
			],
		}),
		defineField({
			name: "annualBonusPct",
			title: "Annual billing bonus (%)",
			type: "number",
		}),
		defineField({
			name: "customPlan",
			title: "Custom plan (quote panel) copy",
			type: "object",
			fields: [
				defineField({ name: "priceLabel", title: "Price label", type: "string" }),
				defineField({ name: "priceSuffix", title: "Price suffix", type: "string" }),
				defineField({ name: "note", title: "Note under price", type: "string" }),
				defineField({ name: "creditsCaption", title: "Credits caption", type: "string" }),
				defineField({ name: "badge", title: "Qualifier badge", type: "string" }),
				defineField({ name: "ctaLabel", title: "CTA label", type: "string" }),
				defineField({ name: "contactEmail", title: "Contact email", type: "string" }),
				defineField({ name: "contactSubject", title: "Contact email subject", type: "string" }),
			],
		}),
		defineField({
			name: "priceNote",
			title: "Price note (e.g. \"Billed monthly + Taxes\")",
			type: "string",
		}),
		defineField({
			name: "planFeatures",
			title: "Included in every plan",
			type: "array",
			of: [{ type: "string" }],
		}),
		defineField({
			name: "creditCosts",
			title: "How credits work",
			type: "array",
			of: [
				{
					type: "object",
					name: "creditCost",
					fields: [
						defineField({ name: "label", title: "Label", type: "string" }),
						defineField({ name: "detail", title: "Detail (e.g. \"1 result\")", type: "string" }),
						defineField({ name: "cost", title: "Cost (e.g. \"5 Credits\")", type: "string" }),
						defineField({ name: "tooltip", title: "Tooltip explanation", type: "text", rows: 2 }),
					],
					preview: { select: { title: "label", subtitle: "cost" } },
				},
			],
		}),
		defineField({
			name: "useCasesSplit",
			title: "Use cases (Brands / Agencies split)",
			description: "The 'Use cases for brands and agencies' block below the pricing panel.",
			type: "array",
			of: [
				{
					type: "object",
					name: "useCaseColumn",
					fields: [
						defineField({ name: "title", title: "Column title", type: "string" }),
						defineField({
							name: "points",
							title: "Points",
							type: "array",
							of: [{ type: "string" }],
						}),
					],
					preview: { select: { title: "title" } },
				},
			],
		}),
	],
	preview: {
		prepare: () => ({ title: "Pricing Page" }),
	},
});
