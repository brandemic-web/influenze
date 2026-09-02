import { defineField, defineType } from "sanity";

/**
 * One cell in the homepage comparison table — either a plain claim (`text`
 * only), a capability tick/dash (`mark`), or both, with an optional leading
 * fragment (`accent`) tinted brand-green. Mirrors ComparisonCell in
 * src/data/comparison.ts.
 */
export default defineType({
	name: "comparisonCell",
	title: "Comparison cell",
	type: "object",
	fields: [
		defineField({
			name: "accent",
			title: "Accent fragment (brand-green, before the text)",
			type: "string",
		}),
		defineField({ name: "text", title: "Text", type: "string" }),
		defineField({
			name: "mark",
			title: "Show capability mark (tick for Influenze, dash for competitors)",
			type: "boolean",
			initialValue: false,
		}),
	],
	preview: {
		select: { title: "text", subtitle: "accent" },
	},
});
