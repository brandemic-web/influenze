import { defineField, defineType } from "sanity";

/** Per-side spacing in design px — any side left blank is 0. */
export default defineType({
	name: "trustedBySpacing",
	title: "Spacing",
	type: "object",
	options: { columns: 4, collapsible: true, collapsed: true },
	fields: (["top", "right", "bottom", "left"] as const).map((side) =>
		defineField({
			name: side,
			title: `${side[0].toUpperCase()}${side.slice(1)} (px)`,
			type: "number",
		}),
	),
});
