import { defineField } from "sanity";

/**
 * The three fields that let an author either pick one of a section's built-in
 * icons or upload their own. Not a named object type: each section's preset
 * list differs, and the fields sit inline on the card so authors don't have to
 * open a nested object to set an icon.
 *
 * Components resolve these in the same order — `iconSource === "upload"` reads
 * `iconImage`, anything else looks `icon` up in the section's local icon map.
 */
export function iconFields(presets: string[]) {
	return [
		defineField({
			name: "iconSource",
			title: "Icon source",
			type: "string",
			options: {
				list: [
					{ title: "Pick a built-in icon", value: "preset" },
					{ title: "Upload an image", value: "upload" },
				],
				layout: "radio",
			},
			initialValue: "preset",
		}),
		defineField({
			name: "icon",
			title: "Built-in icon",
			type: "string",
			options: { list: presets },
			// Only one of the two applies at a time, so the other is hidden
			// rather than left to confuse authors.
			hidden: ({ parent }) => parent?.iconSource === "upload",
		}),
		defineField({
			name: "iconImage",
			title: "Uploaded icon",
			type: "image",
			description: "Drawn in a square — a square SVG or PNG works best.",
			hidden: ({ parent }) => parent?.iconSource !== "upload",
		}),
	];
}
