import { defineField } from "sanity";
import type { CopyField } from "../../data/compare/shared";

/**
 * A heading or text field generated from a page's copy list (SECTION_COPY_FIELDS,
 * ALT_COPY_FIELDS). Empty keeps the default, which the field shows as its
 * placeholder, so editors only type what they change.
 */
export const copyField = (f: CopyField, group: string) =>
	defineField({
		name: f.key,
		title: f.title,
		type: f.long ? "text" : "string",
		...(f.long ? { rows: 2 } : {}),
		group,
		placeholder: f.default,
		description: [
			"Leave empty to keep the default.",
			f.default.includes("{name}") && "{name} becomes the competitor's name.",
			f.default.includes("\n") && "A line break here is a line break on the page.",
			f.twoTone && "Wrap words in *stars* to make them green.",
		]
			.filter(Boolean)
			.join(" "),
	});
