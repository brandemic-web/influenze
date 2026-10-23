import { defineField } from "sanity";
import { influenzeCellText, type CompareRow } from "../../data/compare/shared";

/**
 * The Influenze.ai column of a comparison table, one field per row, each showing the
 * row's default as its placeholder. Read by resolveInfluenzeRows in data/compare/shared.ts.
 */
export const influenzeColumnField = (name: string, title: string, group: string, rows: readonly CompareRow[]) =>
	defineField({
		name,
		title,
		type: "object",
		group,
		options: { collapsible: true, collapsed: true },
		description: "Leave a row empty to keep the text shown in grey.",
		fields: rows.map((row) =>
			defineField({
				name: row.id,
				title: row.label,
				type: "object",
				options: { columns: 1 },
				fields: [
					defineField({
						name: "text",
						title: "Text",
						type: "text",
						rows: 2,
						placeholder: influenzeCellText(row.influenze),
						description: "A line break here is a line break on the page. Wrap a leading word in *stars* to make it green.",
					}),
					defineField({
						name: "mark",
						title: "Show a tick above",
						type: "boolean",
						description: `Leave unset to keep the default (${row.influenze.mark ? "tick shown" : "no tick"}).`,
					}),
				],
			}),
		),
	});
