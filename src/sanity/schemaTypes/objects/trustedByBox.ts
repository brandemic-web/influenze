import { defineField, defineType } from "sanity";

/**
 * A rendered width/height in design px. Both are optional: setting only one
 * leaves the other on the row's shared default, which is how a logo that only
 * needs to be narrower gets there.
 */
export default defineType({
	name: "trustedByBox",
	title: "Size",
	type: "object",
	options: { columns: 2 },
	fields: [
		defineField({ name: "width", title: "Width (px)", type: "number", validation: (Rule) => Rule.positive() }),
		defineField({ name: "height", title: "Height (px)", type: "number", validation: (Rule) => Rule.positive() }),
	],
});
