import { defineField } from "sanity";

/**
 * The two optional photo uploads on an Example Brief slot (platform and ICP pages).
 * Empty keeps the bundled photo; sizes are the 2x of what ExampleBriefs.astro draws.
 */
export function briefPhotoFields() {
	return [
		defineField({
			name: "mainImage",
			title: "Main photo (optional)",
			type: "image",
			options: { hotspot: true },
			description: "The large photo. Best at 956 × 1104 px; cropped to fill. Empty keeps the default.",
		}),
		defineField({
			name: "detailImage",
			title: "Small photo (optional)",
			type: "image",
			options: { hotspot: true },
			description: "The small square photo. Best at 490 × 490 px; cropped to fill. Empty keeps the default.",
		}),
	];
}
