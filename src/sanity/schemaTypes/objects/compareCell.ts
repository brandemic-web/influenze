import { defineField, defineType } from "sanity";

/**
 * One competitor cell on a compare page: what they offer for that row, and
 * whether to draw a dash above it (they lack the capability). Mirrors
 * CompetitorCell in src/data/compare/types.ts.
 */
export default defineType({
	name: "compareCell",
	title: "Competitor cell",
	type: "object",
	options: { columns: 1 },
	fields: [
		defineField({
			name: "text",
			title: "Text",
			type: "text",
			rows: 2,
			description: "A line break here is a line break on the page.",
		}),
		defineField({
			name: "mark",
			title: "Show a dash above (they don't offer this)",
			type: "boolean",
			initialValue: false,
		}),
	],
	preview: {
		select: { title: "text", mark: "mark" },
		prepare: ({ title, mark }) => ({ title: title || "—", subtitle: mark ? "With dash" : undefined }),
	},
});
